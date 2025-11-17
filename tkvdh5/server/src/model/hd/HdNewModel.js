"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HdNewModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const ActEquipModel_1 = require("../act/ActEquipModel");
const hook_1 = require("../../util/hook");
const gameMethod_1 = require("../../../common/gameMethod");
const ActBoxModel_1 = require("../act/ActBoxModel");
const game_1 = __importDefault(require("../../util/game"));
const ActTaskMainModel_1 = require("../act/ActTaskMainModel");
const ActChiBangModel_1 = require("../act/ActChiBangModel");
/**
 * 活动 新人礼包
 */
class HdNewModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdNew"; //用于存储key 和  输出1级key
        this.outIsAu = true; //下发数据是否用au下发
        this.dType = master_1.DataType.user;
    }
    //单例模式
    static getInstance(ctx, uuid, hdcid = '1') {
        let dlKey = this.name + '_' + uuid + '_' + hdcid; //单例模式key
        if (!ctx.state.model[dlKey]) {
            ctx.state.model[dlKey] = new this(ctx, uuid, hdcid);
        }
        return ctx.state.model[dlKey];
    }
    outKey2() {
        return this.hdcid; //输出2级key
    }
    //初始化
    init() {
        return {
            hdid: "",
            dc: 0,
            buy: 0,
            lastAt: 0,
            mdAt: 0,
            red: 0,
            tdc: [],
            ver: 1,
            isshow: 0,
            tzAt: 0 //跳过时间戳
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        let cfg = await this.getHdCfg();
        if (cfg != null && cfg.info.id != info.hdid) {
            info = this.init();
            info.hdid = cfg.info.id;
        }
        //（老玩家）兼容新配置  转到下一档
        if (info.buy == 2) {
            //转到下一档
            if (cfg.data.list[info.dc + 1] != null) {
                info.lastAt = this.ctx.state.newTime - 1;
                if (cfg.data.jgTime[info.dc] != null) {
                    info.lastAt = this.ctx.state.newTime + cfg.data.jgTime[info.dc] - 1;
                }
                info.dc += 1;
                info.buy = 0;
            }
        }
        //跳过时间
        if (info.tzAt == null) {
            info.tzAt = this.ctx.state.newTime;
            await this.update(info, [""]);
        }
        if (info.ver != 1) {
            info.ver = 1;
            if (info.tdc != null && info.tdc.indexOf(4) != -1 && info.dc == 5 && info.buy == 0) {
                info.dc = 4;
            }
            await this.update(info, [""]);
        }
        if (info.isshow == null) {
            info.isshow = 1;
        }
        return info;
    }
    /**
     * 返回数据
     */
    async getOutPut() {
        let info = await this.getInfo();
        // if(info.isshow != 1){
        //     return null
        // }
        return {
            info: await this.getOutPut_u("info"),
            data: await this.getOutPut_u("data"),
            red: await this.getOutPut_u("red"),
            outf: await this.getOutPut_u("outf"),
        };
    }
    async getOutPut_u(key) {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            return null;
        }
        let info = await this.getInfo();
        // if(info.isshow != 1){
        //     return null
        // }
        switch (key) {
            case "info":
            case "data":
                return cfg[key];
            case "red":
                return await this.getRed();
            case "outf":
                return {
                    dc: info.dc,
                    buy: info.buy,
                    lastAt: info.lastAt //下次刷新时间点0不刷新
                };
        }
        return null;
    }
    /**
     * 获取红点
     */
    async getRed() {
        let info = await this.getInfo();
        if (info.red == 1) {
            return 1;
        }
        if (info.buy == 1) {
            return 1;
        }
        return 0;
    }
    /**
     * 设置登陆红点
     */
    async setRed(red) {
        let info = await this.getInfo();
        info.red = red;
        await this.update(info);
    }
    /**
     * 充值下单检查
     */
    async checkUp() {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        let info = await this.getInfo();
        if (cfg.data.list[info.dc] == null || cfg.data.list[info.dc].need[0] != 10) {
            this.ctx.throw("参数错误");
        }
        if (info.buy > 0) {
            this.ctx.throw("已购买");
        }
        return {
            type: 1,
            msg: cfg.info.title,
            data: cfg.data.list[info.dc].need[1],
            kind10Cs: this.kid + "_" + this.hdcid + "_" + info.dc + "_" + cfg.data.list[info.dc].need[1]
        };
    }
    /**
     * 充值成功后执行
     */
    async carryOut() {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            return {
                type: 0,
                msg: "充值活动已关闭",
                data: null
            };
        }
        let info = await this.getInfo();
        info.buy = 1;
        await this.update(info, ['outf', 'red']);
        return {
            type: 1,
            msg: "充值成功",
            data: cfg.data.list[info.dc].need[1]
        };
    }
    /**
     * 领取奖励
     */
    async rwd(isNew) {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            return {
                type: 0,
                msg: "充值活动已关闭",
                data: null
            };
        }
        let info = await this.getInfo();
        if (info.buy == 0) {
            this.ctx.throw("未购买");
        }
        if (info.buy == 2) {
            this.ctx.throw("已领取");
        }
        info.buy = 2;
        await this.ctx.state.master.addItem2(cfg.data.list[info.dc].items);
        if (cfg.data.list[info.dc].linshi != null) {
            let oldEquipId = cfg.data.list[info.dc].linshi.equipId;
            let oldEquipLv = cfg.data.list[info.dc].linshi.level;
            let actEquipModel = ActEquipModel_1.ActEquipModel.getInstance(this.ctx, this.id);
            let actEquip = await actEquipModel.getInfo();
            let cfgEquipInfo = gameCfg_1.default.equipInfo.getItemCtx(this.ctx, cfg.data.list[info.dc].linshi.equipId);
            //直接穿上
            if (actEquip.chuan[cfgEquipInfo.buwei] == null) {
                actEquip.chuan[cfgEquipInfo.buwei] = actEquipModel.initBuWei();
            }
            if (actEquip.chuan[cfgEquipInfo.buwei].hhList[cfg.data.list[info.dc].linshi.mrhh] == null) {
                actEquip.chuan[cfgEquipInfo.buwei].hhList[cfg.data.list[info.dc].linshi.mrhh] = 1;
                actEquip.chuan[cfgEquipInfo.buwei].newHh = cfg.data.list[info.dc].linshi.mrhh;
            }
            if (isNew == 1) { //加装备
                oldEquipId = actEquip.chuan[cfgEquipInfo.buwei].equipId;
                oldEquipLv = actEquip.chuan[cfgEquipInfo.buwei].level;
                actEquip.chuan[cfgEquipInfo.buwei].equipId = cfg.data.list[info.dc].linshi.equipId;
                actEquip.chuan[cfgEquipInfo.buwei].level = cfg.data.list[info.dc].linshi.level;
                actEquip.chuan[cfgEquipInfo.buwei].mrhh = cfg.data.list[info.dc].linshi.mrhh;
                actEquip.chuan[cfgEquipInfo.buwei].eps = gameMethod_1.gameMethod.objCopy(cfg.data.list[info.dc].linshi.eps);
                if (actEquip.linshi.equipId != "") {
                    let cfgEinfo1 = gameCfg_1.default.equipInfo.getItemCtx(this.ctx, actEquip.linshi.equipId);
                    if (cfgEinfo1.buwei == cfgEquipInfo.buwei) {
                        actEquip.linshiOld.equipId = actEquip.chuan[cfgEquipInfo.buwei].equipId;
                        actEquip.linshiOld.mrhh = actEquip.chuan[cfgEquipInfo.buwei].mrhh;
                        actEquip.linshiOld.hh = actEquip.chuan[cfgEquipInfo.buwei].hh;
                        actEquip.linshiOld.level = actEquip.chuan[cfgEquipInfo.buwei].level;
                        actEquip.linshiOld.eps = actEquip.chuan[cfgEquipInfo.buwei].eps;
                        actEquip.linshiOld.isNew = 0;
                    }
                }
                await hook_1.hookNote(this.ctx, "equipChuan", 1);
            }
            else {
                if (actEquip.chuan[cfgEquipInfo.buwei] != null && actEquip.chuan[cfgEquipInfo.buwei].newHh != "") {
                    let cfgpf = gameCfg_1.default.equipPifu.getItem(actEquip.chuan[cfgEquipInfo.buwei].newHh);
                    if (cfgpf != null && [1, 2, 3, 4].indexOf(cfgEquipInfo.buwei) != -1 && actEquip.chuan[cfgEquipInfo.buwei].equipId != "") {
                        let actTaskMainModel = await ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
                        if (await actTaskMainModel.kaiqi("6800") == 1) {
                            this.ctx.state.master.addWin("msg", `获得解锁新${cfgpf.name}换装`);
                        }
                    }
                    actEquip.chuan[cfgEquipInfo.buwei].newHh = "";
                }
            }
            await actEquipModel.update(actEquip, ['chuan', "linshi", "linshiOld"]);
            if (oldEquipId != "") {
                let actBoxModel = ActBoxModel_1.ActBoxModel.getInstance(this.ctx, this.id);
                let actBox = await actBoxModel.getInfo();
                if (actBox.mType == 1) {
                    let pinzhi = gameCfg_1.default.equipInfo.getItemCtx(this.ctx, oldEquipId).pinzhi;
                    let fenjie = gameCfg_1.default.equipLevel.getItemCtx(this.ctx, pinzhi.toString(), cfg.data.list[info.dc].linshi.level.toString()).fenjie;
                    if (fenjie.length > 0) {
                        await this.ctx.state.master.addItem2(fenjie);
                    }
                    await hook_1.hookNote(this.ctx, "equipFenJie", 1);
                }
                else {
                    let pinzhi = gameCfg_1.default.equipInfo.getItemCtx(this.ctx, oldEquipId).pinzhi;
                    let chushou = gameCfg_1.default.equipLevel.getItemCtx(this.ctx, pinzhi.toString(), oldEquipLv.toString()).chushou;
                    if (chushou > 0) {
                        await this.ctx.state.master.addItem1([1, 2, chushou]);
                    }
                    await hook_1.hookNote(this.ctx, "equipChuShou", 1);
                }
            }
        }
        //转到下一档
        if (cfg.data.list[info.dc + 1] != null) {
            info.tzAt = this.ctx.state.newTime;
            info.lastAt = this.ctx.state.newTime + cfg.data.jgTime[info.dc] - 1;
            info.dc += 1;
            info.buy = 0;
        }
        await this.update(info, ['outf', 'red']);
    }
    /**
     * 设置触发
     */
    async setIsShow() {
        let info = await this.getInfo();
        if (info.isshow == 1) {
            return;
        }
        let actTaskMainModel = await ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
        if (await actTaskMainModel.kaiqi("3600") == 0) {
            return; //任务未完成
        }
        info.isshow = 1;
        await this.update(info);
    }
    /**
     * 本活动 是否展示中
     */
    async isShow() {
        let info = await this.getInfo();
        if (info.isshow != 1) {
            //未触发
            return false;
        }
        if (info.buy >= 2) {
            //已领取
            return false;
        }
        //展示中
        return true;
    }
    /**
     * 活动触发埋点
     */
    async hdChuFaMd() {
        let info = await this.getInfo();
        if (game_1.default.isToday(info.mdAt) == true) {
            return;
        }
        info.mdAt = this.ctx.state.newTime;
        await this.update(info, [""]);
    }
    /**
     * 当玩家身上的装备生命、攻击、防御高于新人礼包所出售的装备时，则相应的新人礼包会直接跳到下一档。
     */
    async checkUpDc() {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            return;
        }
        let info = await this.getInfo();
        if (info.buy != 0) {
            return;
        }
        if (cfg.data.list[info.dc] == null) {
            return;
        }
        if (info.tdc == null) {
            info.tdc = [];
        }
        if (info.dc >= 4 && this.ctx.state.newTime > info.tzAt + 86400 * 3) {
            info.tzAt = this.ctx.state.newTime;
            info.tdc.push(info.dc);
            info.buy = 2;
            if (cfg.data.list[info.dc + 1] != null) {
                info.dc += 1;
                info.buy = 0;
            }
            await this.update(info);
            return;
        }
        let myHp = 0;
        let myatk = 0;
        let mydef = 0;
        let actEquipModel = ActEquipModel_1.ActEquipModel.getInstance(this.ctx, this.id);
        let actEquip = await actEquipModel.getInfo();
        if (cfg.data.list[info.dc].linshi != null) {
            let cfgLinshi = gameMethod_1.gameMethod.objCopy(cfg.data.list[info.dc].linshi);
            let cfgFe = gameCfg_1.default.equipInfo.getItemCtx(this.ctx, cfgLinshi.equipId);
            let buwei = cfgFe.buwei;
            let myPinzhi = 0;
            if (actEquip.chuan[buwei] != null) {
                let cfgME = gameCfg_1.default.equipInfo.getItem(actEquip.chuan[buwei].equipId);
                if (cfgME != null) {
                    myPinzhi = cfgME.pinzhi;
                }
                myHp = actEquip.chuan[buwei].eps["hp_max"] == null ? 0 : actEquip.chuan[buwei].eps["hp_max"];
                myatk = actEquip.chuan[buwei].eps["atk"] == null ? 0 : actEquip.chuan[buwei].eps["atk"];
                mydef = actEquip.chuan[buwei].eps["def"] == null ? 0 : actEquip.chuan[buwei].eps["def"];
            }
            let fhp = cfgLinshi.eps["hp_max"] == null ? 0 : cfgLinshi.eps["hp_max"];
            let fatk = cfgLinshi.eps["atk"] == null ? 0 : cfgLinshi.eps["atk"];
            let fdef = cfgLinshi.eps["def"] == null ? 0 : cfgLinshi.eps["def"];
            if (myHp <= fhp && myatk <= fatk && mydef <= fdef && myPinzhi < cfgFe.pinzhi) {
                return; //调整成单项低于玩家装备的部件时，就会跳过这个礼包。
            }
        }
        else {
            let isHas = false;
            let cfgid = "";
            for (const _item of cfg.data.list[info.dc].items) {
                if (_item[0] == 12) {
                    cfgid = _item[1].toString();
                    break;
                }
                if (_item[0] == 13) {
                    let actChiBangModel = ActChiBangModel_1.ActChiBangModel.getInstance(this.ctx, this.id);
                    let actChiBang = await actChiBangModel.getInfo();
                    if (actChiBang.hhList.indexOf(_item[1].toString()) != -1) {
                        isHas = true;
                    }
                }
            }
            if (cfgid != "") {
                let cfgIE = gameCfg_1.default.itemEquip.getItemCtx(this.ctx, cfgid);
                let cfgfE = gameCfg_1.default.equipInfo.getItemCtx(this.ctx, cfgIE.equipId);
                let buwei = cfgfE.buwei;
                let myPinzhi = 0;
                if (actEquip.chuan[buwei] != null) {
                    let cfgME = gameCfg_1.default.equipInfo.getItem(actEquip.chuan[buwei].equipId);
                    if (cfgME != null) {
                        myPinzhi = cfgME.pinzhi;
                    }
                    myHp = actEquip.chuan[buwei].eps["hp_max"] == null ? 0 : actEquip.chuan[buwei].eps["hp_max"];
                    myatk = actEquip.chuan[buwei].eps["atk"] == null ? 0 : actEquip.chuan[buwei].eps["atk"];
                    mydef = actEquip.chuan[buwei].eps["def"] == null ? 0 : actEquip.chuan[buwei].eps["def"];
                }
                let fhp = cfgIE.eps["hp_max"] == null ? 0 : cfgIE.eps["hp_max"];
                let fatk = cfgIE.eps["atk"] == null ? 0 : cfgIE.eps["atk"];
                let fdef = cfgIE.eps["def"] == null ? 0 : cfgIE.eps["def"];
                if (myHp <= fhp && myatk <= fatk && mydef <= fdef && myPinzhi < cfgfE.pinzhi) {
                    return; //调整成单项低于玩家装备的部件时，就会跳过这个礼包。
                }
            }
            if (isHas == false) {
                return; //没有获得
            }
        }
        info.tdc.push(info.dc);
        info.buy = 2;
        if (cfg.data.list[info.dc + 1] != null) {
            info.tzAt = this.ctx.state.newTime;
            info.dc += 1;
            info.buy = 0;
        }
        await this.update(info);
    }
}
exports.HdNewModel = HdNewModel;
//# sourceMappingURL=HdNewModel.js.map