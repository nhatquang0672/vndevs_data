"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HdLianchongModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const game_1 = __importDefault(require("../../util/game"));
const MailModel_1 = require("../user/MailModel");
const ActEquipModel_1 = require("../act/ActEquipModel");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const gameMethod_1 = require("../../../common/gameMethod");
const hook_1 = require("../../util/hook");
const ActBoxModel_1 = require("../act/ActBoxModel");
const ActTaskMainModel_1 = require("../act/ActTaskMainModel");
/**
 * 活动 连冲活动
 */
class HdLianchongModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdLianchong"; //用于存储key 和  输出1级key
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
            rtime: this.ctx.state.newTime,
            intoAt: 0,
            buy: 0,
            count: 0,
            list: [],
            isOver: 0
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        let cfg = await this.getHdCfg();
        if (cfg != null && cfg.info.id != info.hdid) {
            info = this.init();
            info.hdid = cfg.info.id;
        }
        if (info.rtime < this.ctx.state.new0) {
            info.rtime = this.ctx.state.newTime;
            info.buy = 0;
        }
        return info;
    }
    /**
     * 返回数据
     */
    async getOutPut() {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            return null;
        }
        let info = await this.getInfo();
        let endAt_0 = game_1.default.getToDay_0(Math.max(this.ctx.state.regtime, cfg.data.rtime)) + cfg.data.days * 86400;
        if (this.ctx.state.newTime < endAt_0) {
            info.isOver = 0;
        }
        if (info.isOver == 1) {
            return null;
        }
        let cfgInfo = await this.getOutPut_u("info");
        if (cfgInfo == null || this.ctx.state.newTime > cfgInfo.dAt) {
            return null;
        }
        return {
            info: cfgInfo,
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
        let endAt_0 = game_1.default.getToDay_0(Math.max(this.ctx.state.regtime, cfg.data.rtime)) + cfg.data.days * 86400;
        if (this.ctx.state.newTime < endAt_0) {
            info.isOver = 0;
        }
        if (this.ctx.state.newTime > endAt_0 && info.isOver != 1) {
            info.isOver = 1;
            //检测是否还有奖励没有发
            let items = [];
            for (const dc in cfg.data.list) {
                if (cfg.data.list[dc].length <= 0) {
                    continue;
                }
                if (parseInt(dc) > info.count) {
                    continue;
                }
                if (info.list.indexOf(dc) != -1) {
                    continue;
                }
                info.list.push(dc);
                items = game_1.default.addArr(items, cfg.data.list[dc]);
            }
            if (items.length > 0) {
                let mailModel = MailModel_1.MailModel.getInstance(this.ctx, this.id);
                await mailModel.sendMail("持之以恒活动奖励", "持之以恒活动结束，您有奖励尚未领取，请及时领取奖励。", gameMethod_1.gameMethod.mergeArr(items), 1, endAt_0);
            }
            await this.update(info, ["outf"]);
        }
        let red = await this.getRed();
        if (info.intoAt < this.ctx.state.new0) {
            red = 1;
        }
        switch (key) {
            case "info":
                let cfgInfo = gameMethod_1.gameMethod.objCopy(cfg[key]);
                cfgInfo.eAt = endAt_0;
                cfgInfo.dAt = endAt_0;
                return cfgInfo;
            case "data":
                return cfg[key];
            case "red":
                return red;
            case "outf":
                return {
                    count: info.count,
                    buy: info.buy,
                    list: info.list
                };
        }
        return null;
    }
    /**
     * 获取红点
     */
    async getRed() {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime > cfg.info.dAt) {
            return 0;
        }
        let info = await this.getInfo();
        for (const dc in cfg.data.list) {
            if (cfg.data.list[dc].length <= 0) {
                continue;
            }
            if (parseInt(dc) > info.count) {
                continue;
            }
            if (info.list.indexOf(dc) != -1) {
                continue;
            }
            return 1;
        }
        return 0;
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
        let _id = (info.count + 1).toString();
        if (cfg.data.buy[_id] == null || cfg.data.buy[_id].need[0] != 10) {
            this.ctx.throw("参数错误");
        }
        if (info.buy == 1) {
            this.ctx.throw("已购买");
        }
        return {
            type: 1,
            msg: cfg.info.title,
            data: cfg.data.buy[_id].need[1],
            kind10Cs: this.kid + "_" + this.hdcid + "_" + "1" + "_" + cfg.data.buy[_id].need[1]
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
                msg: "活动已关闭",
                data: null
            };
        }
        let info = await this.getInfo();
        info.buy = 1;
        info.count += 1;
        await this.update(info, ['outf', 'red']);
        let _id = info.count.toString();
        await this.ctx.state.master.addItem2(cfg.data.buy[_id].items);
        return {
            type: 1,
            msg: "充值成功",
            data: cfg.data.buy[_id].need[1]
        };
    }
    /**
     * 领取档次奖励
     */
    async hdlcInto() {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            return;
        }
        let info = await this.getInfo();
        info.intoAt = this.ctx.state.newTime;
        await this.update(info, ['red']);
    }
    /**
     * 领取档次奖励
     */
    async hdlcRwd(dc, isNew) {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            return {
                type: 0,
                msg: "活动已关闭",
                data: null
            };
        }
        if (cfg.data.list[dc] == null) {
            this.ctx.throw("参数错误");
        }
        let info = await this.getInfo();
        if (info.list.indexOf(dc) != -1) {
            this.ctx.throw("已经领取");
        }
        if (info.count < parseInt(dc)) {
            this.ctx.throw("未满足条件");
        }
        info.list.push(dc);
        await this.update(info, ['outf', 'red']);
        if (cfg.data.list[dc].length > 0) {
            for (const _item of cfg.data.list[dc]) {
                if (_item[0] != 4) {
                    await this.ctx.state.master.addItem1(_item);
                    continue;
                }
                if (cfg.data.linshi[_item[1].toString()] == null) {
                    continue;
                }
                let oldEquipId = cfg.data.linshi[_item[1].toString()].equipId;
                let oldEquipLv = cfg.data.linshi[_item[1].toString()].level;
                let actEquipModel = ActEquipModel_1.ActEquipModel.getInstance(this.ctx, this.id);
                let actEquip = await actEquipModel.getInfo();
                let cfgEquipInfo = gameCfg_1.default.equipInfo.getItemCtx(this.ctx, oldEquipId);
                //直接穿上
                if (actEquip.chuan[cfgEquipInfo.buwei] == null) {
                    actEquip.chuan[cfgEquipInfo.buwei] = actEquipModel.initBuWei();
                }
                if (actEquip.chuan[cfgEquipInfo.buwei].hhList[cfg.data.linshi[_item[1].toString()].mrhh] == null) {
                    actEquip.chuan[cfgEquipInfo.buwei].hhList[cfg.data.linshi[_item[1].toString()].mrhh] = 1;
                    actEquip.chuan[cfgEquipInfo.buwei].newHh = cfg.data.linshi[_item[1].toString()].mrhh;
                }
                if (isNew == 1) { //加装备
                    oldEquipId = actEquip.chuan[cfgEquipInfo.buwei].equipId;
                    oldEquipLv = actEquip.chuan[cfgEquipInfo.buwei].level;
                    actEquip.chuan[cfgEquipInfo.buwei].equipId = cfg.data.linshi[_item[1].toString()].equipId;
                    actEquip.chuan[cfgEquipInfo.buwei].level = cfg.data.linshi[_item[1].toString()].level;
                    actEquip.chuan[cfgEquipInfo.buwei].mrhh = cfg.data.linshi[_item[1].toString()].mrhh;
                    actEquip.chuan[cfgEquipInfo.buwei].eps = gameMethod_1.gameMethod.objCopy(cfg.data.linshi[_item[1].toString()].eps);
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
                        let fenjie = gameCfg_1.default.equipLevel.getItemCtx(this.ctx, pinzhi.toString(), oldEquipLv.toString()).fenjie;
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
        }
    }
}
exports.HdLianchongModel = HdLianchongModel;
//# sourceMappingURL=HdLianchongModel.js.map