"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActXianlvModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const tool_1 = require("../../util/tool");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const game_1 = __importDefault(require("../../util/game"));
const gameMethod_1 = require("../../../common/gameMethod");
const ActItemModel_1 = require("./ActItemModel");
const hook_1 = require("../../util/hook");
const HdHuanJingModel_1 = require("../hd/HdHuanJingModel");
const setting_1 = __importDefault(require("../../crontab/setting"));
const HdTimeBenModel_1 = require("../hd/HdTimeBenModel");
/**
 * 仙侣
 */
class ActXianlvModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actXianlv"; //用于存储key 和  输出1级key
        this.outIsAu = false; //下发数据是否用au下发
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
        return ""; //输出2级key
    }
    //初始化
    init() {
        let hecheng = {}; //合成区域
        let cfgPool = gameCfg_1.default.xianlvGezi.pool;
        for (const key in cfgPool) {
            if (cfgPool[key].count != 0) {
                continue; //不是免费的
            }
            hecheng[cfgPool[key].id] = {
                xlid: "",
                level: 0,
                exp: 0,
                lock: 0,
                zhanwei: 0,
                dandan: 0 //蛋蛋的品质
            };
        }
        return {
            shangzhen: {
                xlid: "",
                level: 0,
                exp: 0,
                lock: 0,
                zhanwei: 0,
                dandan: 0 //蛋蛋的品质
            },
            zhuzhan: {},
            hecheng: hecheng,
            mu_count: 5,
            mu_at: this.ctx.state.newTime,
            lv_count: 0,
            zi_count: 0,
            tujian: {},
            hcBd: {},
            zuojia: 0,
            bugver: "1"
        };
    }
    async getInfo() {
        let count = tool_1.tool.mathcfg_count(this.ctx, "xianlv_mu_hulu");
        let count1 = tool_1.tool.mathcfg_count1(this.ctx, "xianlv_mu_hulu");
        let info = await super.getInfo();
        if (info.zhuzhan == null) {
            info.zhuzhan = {};
        }
        //木葫芦 cd
        while (info.mu_count < count && info.mu_at + count1 <= this.ctx.state.newTime) {
            info.mu_count += 1;
            info.mu_at += count1;
        }
        if (info.mu_count >= count) {
            info.mu_at = this.ctx.state.newTime;
        }
        if (info.bugver != "1") {
            info.bugver = "1";
            if (info.shangzhen.xlid != "") { //出战
                let zhanwei1 = gameCfg_1.default.xianlvInfo.getItemCtx(this.ctx, info.shangzhen.xlid).zhanwei;
                if (zhanwei1 == 1 && info.shangzhen.zhanwei != 1) {
                    info.shangzhen.zhanwei = 1;
                }
                if (zhanwei1 == 2 && info.shangzhen.zhanwei != 2) {
                    info.shangzhen.zhanwei = 2;
                }
            }
            for (const _gzid in info.hecheng) {
                if (info.hecheng[_gzid].xlid != "") {
                    let zhanwei1 = gameCfg_1.default.xianlvInfo.getItemCtx(this.ctx, info.hecheng[_gzid].xlid).zhanwei;
                    if (zhanwei1 == 1 && info.hecheng[_gzid].zhanwei != 1) {
                        info.hecheng[_gzid].zhanwei = 1;
                    }
                    if (zhanwei1 == 2 && info.hecheng[_gzid].zhanwei != 2) {
                        info.hecheng[_gzid].zhanwei = 2;
                    }
                }
            }
            await this.update(info);
        }
        return info;
    }
    async update(info, keys = []) {
        let actItemModel = ActItemModel_1.ActItemModel.getInstance(this.ctx, this.id, "1");
        await actItemModel.setItem(1500, info.mu_count);
        await actItemModel.setItem(1501, info.lv_count);
        await actItemModel.setItem(1502, info.zi_count);
        await super.update(info, keys);
    }
    /**
     * 返回数据
     */
    async getOutPut() {
        let count1 = tool_1.tool.mathcfg_count1(this.ctx, "xianlv_mu_hulu");
        let info = await this.getInfo();
        let outf = gameMethod_1.gameMethod.objCopy(info);
        outf.mu_at += count1;
        return outf;
    }
    /**
     * 使用葫芦
     */
    async useHulu(type) {
        let info = await this.getInfo();
        let cfgzid = ""; //当前抽取要存放的格子ID
        for (const gzid in info.hecheng) {
            if (info.hecheng[gzid].xlid == "" && gameMethod_1.gameMethod.isEmpty(info.hecheng[gzid].dandan) == true) {
                cfgzid = gzid;
                break;
            }
        }
        if (cfgzid == "") {
            this.ctx.throw("空位不足，无法购买");
        }
        let cqPinzhi = 0;
        switch (type) {
            case 1:
                if (info.mu_count <= 0) {
                    this.ctx.throw("木葫芦数量不足，无法获取仙侣");
                }
                info.mu_count -= 1;
                let items1 = tool_1.tool.mathcfg_items(this.ctx, "xianlv_mu_hulu");
                let ritem1 = game_1.default.getProbByItems(items1, 0, 1);
                if (ritem1 != null) {
                    cqPinzhi = ritem1[0];
                }
                break;
            case 2:
                if (info.lv_count <= 0) {
                    let item2 = tool_1.tool.mathcfg_item(this.ctx, "xianlv_lv_hulu");
                    await this.ctx.state.master.subItem1(item2);
                }
                else {
                    info.lv_count -= 1;
                }
                let items2 = tool_1.tool.mathcfg_items(this.ctx, "xianlv_lv_hulu");
                let ritem2 = game_1.default.getProbByItems(items2, 0, 1);
                if (ritem2 != null) {
                    cqPinzhi = ritem2[0];
                }
                break;
            case 3:
                if (info.zi_count <= 0) {
                    let item3 = tool_1.tool.mathcfg_item(this.ctx, "xianlv_zi_hulu");
                    await this.ctx.state.master.subItem1(item3);
                }
                else {
                    info.zi_count -= 1;
                }
                let items3 = tool_1.tool.mathcfg_items(this.ctx, "xianlv_zi_hulu");
                let ritem3 = game_1.default.getProbByItems(items3, 0, 1);
                if (ritem3 != null) {
                    cqPinzhi = ritem3[0];
                }
                break;
            default:
                this.ctx.throw("参数错误" + type);
                return;
        }
        if (cqPinzhi == 0) {
            this.ctx.throw("获取仙侣异常");
        }
        let cfgList = gameCfg_1.default.xianlvInfoList.getItemListCtx(this.ctx, cqPinzhi.toString());
        // 过滤 只能是类型为1的
        let _List = [];
        if (info.zuojia == null) {
            info.zuojia = 0;
        }
        info.zuojia += 1;
        for (const _cfgList of cfgList) {
            if (info.zuojia <= 2) {
                if (_cfgList.id != info.zuojia.toString()) {
                    continue;
                }
                _List.push(_cfgList);
                break;
            }
            if (_cfgList.type == 1) {
                _List.push(_cfgList);
            }
        }
        let citem = game_1.default.getProbRandItem(0, _List, "prob");
        if (citem == null) {
            this.ctx.throw("获取仙侣失败");
            return;
        }
        info.hecheng[cfgzid].xlid = citem.id;
        info.hecheng[cfgzid].level = 1;
        info.hecheng[cfgzid].exp = 0;
        info.hecheng[cfgzid].zhanwei = citem.zhanwei == 2 ? 2 : 1;
        info.hecheng[cfgzid].lock = 0;
        //加图鉴
        if (info.tujian[citem.id] == null) {
            info.tujian[citem.id] = 0;
        }
        await this.update(info);
        //获得仙侣时弹窗
        await this.ctx.state.master.addWin("xianlvGz", cfgzid);
        await hook_1.hookNote(this.ctx, "xlZhaohuan", 1);
    }
    /**
     * 加一只仙侣
     */
    async addXianlv(xlid) {
        let info = await this.getInfo();
        let cfgzid = ""; //当前抽取要存放的格子ID
        for (const gzid in info.hecheng) {
            if (info.hecheng[gzid].xlid == "" && gameMethod_1.gameMethod.isEmpty(info.hecheng[gzid].dandan) == true) {
                cfgzid = gzid;
                break;
            }
        }
        if (cfgzid == "") {
            this.ctx.throw("空位不足，无法购买");
        }
        let cfgInfo = gameCfg_1.default.xianlvInfo.getItemCtx(this.ctx, xlid);
        info.hecheng[cfgzid].xlid = xlid;
        info.hecheng[cfgzid].level = 1;
        info.hecheng[cfgzid].exp = 0;
        info.hecheng[cfgzid].zhanwei = cfgInfo.zhanwei == 2 ? 2 : 1;
        info.hecheng[cfgzid].lock = 0;
        info.hecheng[cfgzid].dandan = 0;
        //加图鉴
        if (info.tujian[xlid] == null) {
            info.tujian[xlid] = 0;
        }
        await this.update(info);
        //获得仙侣时弹窗
        await this.ctx.state.master.addWin("xianlvGz", cfgzid);
        await this.ctx.state.master.addWin("xianlvId", xlid);
    }
    /**
     * 开启合成区域
     */
    async kaigz(gzid) {
        let info = await this.getInfo();
        if (info.hecheng[gzid] != null) {
            this.ctx.throw("已开启");
        }
        let cfg = gameCfg_1.default.xianlvGezi.getItemCtx(this.ctx, gzid);
        if (cfg.count > 0) {
            await this.ctx.state.master.subItem1([1, 1, cfg.count]);
        }
        info.hecheng[gzid] = {
            xlid: "",
            level: 0,
            exp: 0,
            lock: 0,
            zhanwei: 0,
            dandan: 0
        };
        await this.update(info);
    }
    /**
     * 仙侣合成
     */
    async hecheng(gzid1, gzid2) {
        let info = await this.getInfo();
        if (info.hecheng[gzid1] == null || info.hecheng[gzid2] == null || info.hecheng[gzid1].xlid == "") {
            this.ctx.throw("参数错误");
        }
        if (info.hecheng[gzid2].xlid == "") { //换位置
            if (info.hecheng[gzid2].dandan != null && info.hecheng[gzid2].dandan > 0) {
                this.ctx.throw("仙侣蛋无法进行合成");
            }
            let gzid1Info = gameMethod_1.gameMethod.objCopy(info.hecheng[gzid1]);
            info.hecheng[gzid2].xlid = gzid1Info.xlid;
            info.hecheng[gzid2].level = gzid1Info.level;
            info.hecheng[gzid2].exp = gzid1Info.exp;
            info.hecheng[gzid2].lock = gzid1Info.lock;
            info.hecheng[gzid2].zhanwei = gzid1Info.zhanwei;
            info.hecheng[gzid1].xlid = "";
            info.hecheng[gzid1].level = 0;
            info.hecheng[gzid1].exp = 0;
            info.hecheng[gzid1].lock = 0;
            info.hecheng[gzid1].zhanwei = 0;
            await this.update(info);
            return;
        }
        let xlid1 = info.hecheng[gzid1].xlid;
        let xlid2 = info.hecheng[gzid2].xlid;
        let cfgInfo1 = gameCfg_1.default.xianlvInfo.getItemCtx(this.ctx, xlid1);
        let cfgInfo2 = gameCfg_1.default.xianlvInfo.getItemCtx(this.ctx, xlid2);
        if (info.hecheng[gzid1].lock == 1) {
            this.ctx.throw("已上锁!");
        }
        let cfgXlLv = gameCfg_1.default.xianlvLevel.pool;
        //第一只的总exp
        let exp1 = info.hecheng[gzid1].exp;
        for (const key in cfgXlLv) {
            if (cfgXlLv[key].level < info.hecheng[gzid1].level) {
                exp1 += cfgXlLv[key].exp;
            }
        }
        //加积分
        await HdHuanJingModel_1.HdHuanJingModel.addScore(this.ctx, this.id);
        if (cfgInfo1.type == 1) { //合成
            if (cfgInfo2.type != 1) {
                this.ctx.throw("参数错误!");
            }
            if (info.hecheng[gzid2].lock == 1) {
                this.ctx.throw("已上锁!!!");
            }
            let cfg = gameCfg_1.default.xianlvHecheng.getItem(xlid1, xlid2);
            if (cfg == null) {
                cfg = gameCfg_1.default.xianlvHecheng.getItem(xlid2, xlid1);
            }
            if (cfg == null) {
                this.ctx.throw("找不到合成配置");
                return;
            }
            let mathKv = tool_1.tool.mathcfg_kv(this.ctx, "xianlv_hc_baodi");
            //是否触发保底
            let bdpz1 = cfgInfo1.pinzhi.toString();
            if (info.hcBd[bdpz1] == null) {
                info.hcBd[bdpz1] = 0;
            }
            info.hcBd[bdpz1] += 1;
            let hechengKu = [];
            if (mathKv[bdpz1] != null && info.hcBd[bdpz1] >= mathKv[bdpz1]) {
                info.hcBd[bdpz1] = 0;
                for (const _hc of cfg.hecheng) {
                    let _cfg = gameCfg_1.default.xianlvInfo.getItemCtx(this.ctx, _hc[0].toString());
                    if (_cfg.type == 1) {
                        hechengKu.push(_hc);
                    }
                }
            }
            else {
                hechengKu = gameMethod_1.gameMethod.objCopy(cfg.hecheng);
            }
            let item = game_1.default.getProbByItems(hechengKu, 0, 1);
            if (item == null) {
                this.ctx.throw("合成获取失败");
                return;
            }
            //清除材料
            let oldXlid = info.hecheng[gzid1].xlid;
            info.hecheng[gzid1].xlid = "";
            info.hecheng[gzid1].level = 0;
            info.hecheng[gzid1].exp = 0;
            info.hecheng[gzid1].zhanwei = 0;
            info.hecheng[gzid1].lock = 0;
            let cfgInfoNew = gameCfg_1.default.xianlvInfo.getItemCtx(this.ctx, item[0].toString());
            if (cfgInfoNew.type == 2) { //失败
                await this.ctx.state.master.addItem2(cfg.items, "xlitems");
                //判定是否送一个蛋蛋
                let cfgDd = setting_1.default.getSetting("1", "xianlvDandan");
                if (cfgDd != null) {
                    let heid = await this.getHeIdByUuid(this.id);
                    for (const fw of cfgDd.open) {
                        if (parseInt(heid) >= fw[0] && parseInt(heid) <= fw[1]) {
                            let cfgInfolod = gameCfg_1.default.xianlvInfo.getItemCtx(this.ctx, oldXlid);
                            info.hecheng[gzid1].dandan = cfgInfolod.losePz;
                        }
                    }
                }
            }
            info.hecheng[gzid2].xlid = item[0].toString();
            info.hecheng[gzid2].exp += exp1;
            info.hecheng[gzid2].zhanwei = cfgInfoNew.zhanwei == 2 ? 2 : 1;
            info.hecheng[gzid2].lock = info.hecheng[gzid2].lock == null ? 0 : info.hecheng[gzid2].lock;
            // if(cfgInfoNew.pinzhi >= 6){  //加个东西，合成橙色品质的仙侣的时候，自动上锁
            //     info.hecheng[gzid2].lock = 1
            // }
            let cfginfo2 = gameCfg_1.default.xianlvLevel.getItemCtx(this.ctx, info.hecheng[gzid2].level.toString());
            let cfginfo2Next = gameCfg_1.default.xianlvLevel.getItem((info.hecheng[gzid2].level + 1).toString());
            //升级
            while (cfginfo2Next != null && cfginfo2.exp > 0 && info.hecheng[gzid2].exp > cfginfo2.exp) {
                info.hecheng[gzid2].exp -= cfginfo2.exp;
                info.hecheng[gzid2].level += 1;
                cfginfo2 = gameCfg_1.default.xianlvLevel.getItemCtx(this.ctx, info.hecheng[gzid2].level.toString());
                cfginfo2Next = gameCfg_1.default.xianlvLevel.getItem((info.hecheng[gzid2].level + 1).toString());
            }
            //加图鉴
            if (info.tujian[item[0].toString()] == null) {
                info.tujian[item[0].toString()] = 0;
            }
            await this.update(info);
            //获得仙侣时弹窗
            await this.ctx.state.master.addWin("xianlvGz", gzid2);
            await hook_1.hookNote(this.ctx, "xlUpHecheng", 1);
            return;
        }
        if (cfgInfo1.type == 2) { //经验包
            //清除材料
            info.hecheng[gzid1].xlid = "";
            info.hecheng[gzid1].level = 0;
            info.hecheng[gzid1].exp = 0;
            info.hecheng[gzid1].zhanwei = 0;
            info.hecheng[gzid1].lock = 0;
            exp1 += cfgInfo1.cs;
            info.hecheng[gzid2].exp += exp1;
            let cfginfo2 = gameCfg_1.default.xianlvLevel.getItemCtx(this.ctx, info.hecheng[gzid2].level.toString());
            let cfginfo2Next = gameCfg_1.default.xianlvLevel.getItem((info.hecheng[gzid2].level + 1).toString());
            //升级
            while (cfginfo2Next != null && cfginfo2.exp > 0 && info.hecheng[gzid2].exp > cfginfo2.exp) {
                info.hecheng[gzid2].exp -= cfginfo2.exp;
                info.hecheng[gzid2].level += 1;
                cfginfo2 = gameCfg_1.default.xianlvLevel.getItemCtx(this.ctx, info.hecheng[gzid2].level.toString());
                cfginfo2Next = gameCfg_1.default.xianlvLevel.getItem((info.hecheng[gzid2].level + 1).toString());
            }
            await this.update(info);
            await hook_1.hookNote(this.ctx, "xlUpLevel", 1);
            await hook_1.hookNote(this.ctx, "xlUpHecheng", 1);
            return;
        }
        if (cfgInfo1.type == 3) {
            if (cfgInfo2.type != 1) {
                this.ctx.throw("仙桃无法合成仙侣");
            }
            if (info.hecheng[gzid2].lock == 1) {
                this.ctx.throw("已上锁!");
            }
            info.hecheng[gzid1].xlid = "";
            info.hecheng[gzid1].level = 0;
            info.hecheng[gzid1].exp = 0;
            info.hecheng[gzid1].lock = 0;
            info.hecheng[gzid1].zhanwei = 0;
            let cfgPzList = gameCfg_1.default.xianlvInfoList.getItemListCtx(this.ctx, cfgInfo2.pinzhi.toString());
            for (const key in cfgPzList) {
                if (cfgPzList[key].type == 2) {
                    info.hecheng[gzid2].xlid = cfgPzList[key].id;
                    info.hecheng[gzid2].exp += exp1;
                    info.hecheng[gzid2].zhanwei = cfgPzList[key].zhanwei == 2 ? 2 : 1;
                    //加图鉴
                    if (info.tujian[cfgPzList[key].id] == null) {
                        info.tujian[cfgPzList[key].id] = 0;
                    }
                    let cfginfo2 = gameCfg_1.default.xianlvLevel.getItemCtx(this.ctx, info.hecheng[gzid2].level.toString());
                    let cfginfo2Next = gameCfg_1.default.xianlvLevel.getItem((info.hecheng[gzid2].level + 1).toString());
                    //升级
                    while (cfginfo2Next != null && cfginfo2.exp > 0 && info.hecheng[gzid2].exp > cfginfo2.exp) {
                        info.hecheng[gzid2].exp -= cfginfo2.exp;
                        info.hecheng[gzid2].level += 1;
                        cfginfo2 = gameCfg_1.default.xianlvLevel.getItemCtx(this.ctx, info.hecheng[gzid2].level.toString());
                        cfginfo2Next = gameCfg_1.default.xianlvLevel.getItem((info.hecheng[gzid2].level + 1).toString());
                    }
                    break;
                }
            }
            await this.update(info);
            await hook_1.hookNote(this.ctx, "xlUpHecheng", 1);
            return;
        }
        this.ctx.throw("参数错误!!!");
    }
    /**
     * 仙侣上阵
     */
    async shangzhen(gzid) {
        let info = await this.getInfo();
        if (info.hecheng[gzid] == null) {
            this.ctx.throw("参数错误");
        }
        let gzInfo = gameMethod_1.gameMethod.objCopy(info.hecheng[gzid]);
        info.hecheng[gzid].xlid = info.shangzhen.xlid;
        info.hecheng[gzid].level = info.shangzhen.level;
        info.hecheng[gzid].exp = info.shangzhen.exp;
        info.hecheng[gzid].lock = info.shangzhen.lock;
        info.hecheng[gzid].zhanwei = info.shangzhen.zhanwei;
        info.shangzhen.xlid = gzInfo.xlid;
        info.shangzhen.level = gzInfo.level;
        info.shangzhen.exp = gzInfo.exp;
        info.shangzhen.lock = gzInfo.lock;
        info.shangzhen.zhanwei = gzInfo.zhanwei;
        await this.update(info);
    }
    /**
     * 兑换仙侣
     */
    async duihuan(dc) {
        let cfg = gameCfg_1.default.xianlvDuihuan.getItemCtx(this.ctx, dc);
        await this.ctx.state.master.subItem1(cfg.need);
        await this.ctx.state.master.addItem1(cfg.item);
    }
    /**
     * 解锁图鉴奖励
     */
    async tujianRwd(xlid) {
        let info = await this.getInfo();
        if (info.tujian[xlid] == null) {
            this.ctx.throw("图鉴未解锁");
        }
        if (info.tujian[xlid] != 0) {
            this.ctx.throw("图鉴奖励已领取");
        }
        info.tujian[xlid] = this.ctx.state.newTime;
        await this.update(info);
        let cfg = gameCfg_1.default.xianlvInfo.getItemCtx(this.ctx, xlid);
        if (cfg.items.length > 0) {
            await this.ctx.state.master.addItem2(cfg.items);
        }
    }
    /**
     * 上锁
     */
    async shangsuo(gzid, lock) {
        let info = await this.getInfo();
        if (gzid == "0") {
            info.shangzhen.lock = lock;
            await this.update(info);
            return;
        }
        if (info.hecheng[gzid] == null || info.hecheng[gzid].xlid == "") {
            this.ctx.throw("参数错误");
        }
        info.hecheng[gzid].lock = lock;
        await this.update(info);
    }
    /**
     * 设置站位
     */
    async setZw(gzid, zhanwei) {
        let info = await this.getInfo();
        if (gzid == "0") {
            if (info.shangzhen.xlid == "") {
                this.ctx.throw("参数错误");
            }
            info.shangzhen.zhanwei = zhanwei;
        }
        else {
            if (info.hecheng[gzid] == null || info.hecheng[gzid].xlid == "") {
                this.ctx.throw("参数错误");
            }
            info.hecheng[gzid].zhanwei = zhanwei;
        }
        await this.update(info);
    }
    /**
     * 设置站位
     */
    async dandan(gzid) {
        let info = await this.getInfo();
        if (info.hecheng[gzid] == null || info.hecheng[gzid].dandan == null || info.hecheng[gzid].dandan == 0) {
            this.ctx.throw("参数错误");
        }
        let cfgPool = gameCfg_1.default.xianlvInfo.pool;
        let xls = [];
        for (const key in cfgPool) {
            if (info.hecheng[gzid].dandan != cfgPool[key].pinzhi) {
                continue;
            }
            if (cfgPool[key].type != 1) {
                continue;
            }
            xls.push(cfgPool[key].id);
        }
        if (xls.length <= 0) {
            this.ctx.throw("获取仙侣失败");
        }
        let xlid = game_1.default.getRandArr(xls, 1)[0];
        let oldPz = info.hecheng[gzid].dandan;
        let cfgInfo = gameCfg_1.default.xianlvInfo.getItemCtx(this.ctx, xlid);
        info.hecheng[gzid].xlid = xlid;
        info.hecheng[gzid].level = 1;
        info.hecheng[gzid].exp = 0;
        info.hecheng[gzid].zhanwei = cfgInfo.zhanwei == 2 ? 2 : 1;
        info.hecheng[gzid].lock = 0;
        info.hecheng[gzid].dandan = 0;
        //加图鉴
        if (info.tujian[xlid] == null) {
            info.tujian[xlid] = 0;
        }
        await this.update(info);
        //获得仙侣时弹窗
        await this.ctx.state.master.addWin("xianlvGz", gzid);
        await this.ctx.state.master.addWin("xianlvId", xlid);
        //活动 - 限时福利
        let cfgHdTimeBen = setting_1.default.getHuodong2(await this.getHeIdByUuid(this.id), "hdTimeBen");
        if (cfgHdTimeBen != null) {
            for (const hdcid in cfgHdTimeBen) {
                let hdTimeBenModel = HdTimeBenModel_1.HdTimeBenModel.getInstance(this.ctx, this.id, hdcid);
                await hdTimeBenModel.trip(("xlDandan" + oldPz));
            }
        }
    }
    /**
     * 获得葫芦
     * type 1木 2绿 3紫
     * count  数量
     */
    async addHulu(type, count) {
        let info = await this.getInfo();
        if (type == 1) {
            info.mu_count += count;
            await this.update(info);
            return;
        }
        if (type == 2) {
            info.lv_count += count;
            await this.update(info);
            return;
        }
        if (type == 3) {
            info.zi_count += count;
            await this.update(info);
            return;
        }
        this.ctx.throw("葫芦类型错误");
    }
    /**
     * 获得葫芦
     * type 1木 2绿 3紫
     * count  数量
     */
    async subHulu(type, count, isCheck = false) {
        let info = await this.getInfo();
        if (type == 1) {
            if (info.mu_count < count) {
                if (isCheck) {
                    return false;
                }
                this.ctx.throw("葫芦不足");
            }
            if (isCheck) {
                return true;
            }
            info.mu_count -= count;
            await this.update(info);
            return true;
        }
        if (type == 2) {
            if (info.lv_count < count) {
                if (isCheck) {
                    return false;
                }
                this.ctx.throw("葫芦不足");
            }
            if (isCheck) {
                return true;
            }
            info.lv_count -= count;
            await this.update(info);
            return true;
        }
        if (type == 3) {
            if (info.zi_count < count) {
                if (isCheck) {
                    return false;
                }
                this.ctx.throw("葫芦不足");
            }
            if (isCheck) {
                return true;
            }
            info.zi_count -= count;
            await this.update(info);
            return true;
        }
        return true;
    }
    /**
     * 呼唤位置
     */
    async huhuan(gzid, gzid1) {
        let info = await this.getInfo();
        let copy = null;
        if (gzid == "0") {
            copy = gameMethod_1.gameMethod.objCopy(info.shangzhen);
        }
        if (info.hecheng[gzid] != null) {
            copy = gameMethod_1.gameMethod.objCopy(info.hecheng[gzid]);
        }
        if (["97", "98", "99"].indexOf(gzid) != -1) {
            if (info.zhuzhan[gzid] == null) {
                info.zhuzhan[gzid] = {
                    xlid: "",
                    level: 0,
                    exp: 0,
                    lock: 0,
                    zhanwei: 0,
                    dandan: 0 //蛋蛋的品质
                };
            }
            copy = gameMethod_1.gameMethod.objCopy(info.zhuzhan[gzid]);
        }
        if (copy == null) {
            this.ctx.throw("参数错误");
        }
        let copy1 = null;
        if (gzid1 == "0") {
            copy1 = gameMethod_1.gameMethod.objCopy(info.shangzhen);
        }
        if (info.hecheng[gzid1] != null) {
            copy1 = gameMethod_1.gameMethod.objCopy(info.hecheng[gzid1]);
        }
        if (["97", "98", "99"].indexOf(gzid1) != -1) {
            if (info.zhuzhan[gzid1] == null) {
                info.zhuzhan[gzid1] = {
                    xlid: "",
                    level: 0,
                    exp: 0,
                    lock: 0,
                    zhanwei: 0,
                    dandan: 0 //蛋蛋的品质
                };
            }
            copy1 = gameMethod_1.gameMethod.objCopy(info.zhuzhan[gzid1]);
        }
        if (copy1 == null) {
            this.ctx.throw("参数错误1");
        }
        if (gzid == "0") {
            info.shangzhen = copy1;
        }
        if (info.hecheng[gzid] != null) {
            info.hecheng[gzid] = copy1;
        }
        if (["97", "98", "99"].indexOf(gzid) != -1) {
            info.zhuzhan[gzid] = copy1;
        }
        if (gzid1 == "0") {
            info.shangzhen = copy;
        }
        if (info.hecheng[gzid1] != null) {
            info.hecheng[gzid1] = copy;
        }
        if (["97", "98", "99"].indexOf(gzid1) != -1) {
            info.zhuzhan[gzid1] = copy;
        }
        await this.update(info);
    }
}
exports.ActXianlvModel = ActXianlvModel;
//# sourceMappingURL=ActXianlvModel.js.map