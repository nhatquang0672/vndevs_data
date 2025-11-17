"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HdGrowthFundModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const UserModel_1 = require("../user/UserModel");
const ActBoxModel_1 = require("../act/ActBoxModel");
const game_1 = __importDefault(require("../../util/game"));
const ActEquipModel_1 = require("../act/ActEquipModel");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const gameMethod_1 = require("../../../common/gameMethod");
const hook_1 = require("../../util/hook");
const ActPvwModel_1 = require("../act/ActPvwModel");
const ActTaskMainModel_1 = require("../act/ActTaskMainModel");
const ActPveInfoModel_1 = require("../act/ActPveInfoModel");
const ActWanXiangModel_1 = require("../act/ActWanXiangModel");
/**
 * 活动 成长基金 角色基金
 */
class HdGrowthFundModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdGrowthFund"; //用于存储key 和  输出1级key
        this.outIsAu = true; //下发数据是否用au下发
        this.dType = master_1.DataType.user;
    }
    //单例模式
    static getInstance(ctx, uuid, hdcid = "1") {
        let dlKey = this.name + "_" + uuid + "_" + hdcid; //单例模式key
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
            free: {},
            gbuy: {},
            buy: 0,
            buy1: 0,
            mdAt: 0,
            ver: 0,
            isOver: 0 //是否完成 消失
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        let cfg = (await this.getHdCfg());
        if (cfg != null && cfg.info.id != info.hdid) {
            info = this.init();
            info.hdid = cfg.info.id;
            info.ver = cfg.data.ver;
        }
        if (info.ver != cfg.data.ver) {
            info.ver = cfg.data.ver;
            if (cfg.data.free != null) {
                for (const dc of cfg.data.free) {
                    delete info.free[dc];
                }
            }
            if (cfg.data.grwd != null) {
                for (const dc of cfg.data.grwd) {
                    delete info.gbuy[dc];
                }
            }
            await this.update(info, [""]);
        }
        if (info.buy1 == null) {
            info.buy1 = 0;
        }
        if (info.isOver == null) {
            info.isOver = 0;
        }
        return info;
    }
    /**
     * 返回数据
     */
    async getOutPut() {
        if (["1", "2", "3"].indexOf(this.hdcid) != -1) {
            let info = await this.getInfo();
            if (info.buy == 0) {
                return null;
            }
            if (info.isOver == 1) {
                return null;
            }
        }
        return {
            info: await this.getOutPut_u("info"),
            data: await this.getOutPut_u("data"),
            red: await this.getOutPut_u("red"),
            outf: await this.getOutPut_u("outf"),
        };
    }
    async getOutPut_u(key) {
        let cfg = (await this.getHdCfg());
        if (cfg == null) {
            return null;
        }
        if (["1", "2", "3"].indexOf(this.hdcid) != -1) {
            let info = await this.getInfo();
            if (info.buy == 0) {
                return null;
            }
        }
        let info = await this.getInfo();
        switch (key) {
            case "info":
            case "data":
                return cfg[key];
            case "red":
                return await this.getRed();
            case "outf":
                return {
                    free: info.free,
                    gbuy: info.gbuy,
                    buy: info.buy,
                    buy1: info.buy1,
                };
        }
        return null;
    }
    /**
     * 获取红点
     */
    async getRed() {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            return 0;
        }
        //当前达到的等级
        let level = await this.getLevel(cfg.data.type);
        let info = await this.getInfo();
        //遍历是否有可领取档次
        for (const dc in cfg.data.list) {
            //条件未达成
            if (level < cfg.data.list[dc].level) {
                continue;
            }
            //本档次未领取
            if (info.free[dc] == null) {
                return 1;
            }
            //基金已购买 + 本档次未领取
            if (info.buy > 0 && info.gbuy[dc] == null) {
                return 1;
            }
        }
        return 0;
    }
    //获取等级
    async getLevel(type) {
        if (type == "level") {
            let userModel = UserModel_1.UserModel.getInstance(this.ctx, this.id);
            return (await userModel.getInfo()).level;
        }
        else if (type == "box") {
            let actBoxModel = ActBoxModel_1.ActBoxModel.getInstance(this.ctx, this.id);
            return (await actBoxModel.getInfo()).level;
        }
        else if (type == "pvw") {
            let actPvwModel = ActPvwModel_1.ActPvwModel.getInstance(this.ctx, this.id);
            return (await actPvwModel.getInfo()).histMax;
        }
        else if (type == "pve") {
            let ActPveInfo = ActPveInfoModel_1.ActPveInfoModel.getInstance(this.ctx, this.id);
            return (await ActPveInfo.getInfo()).id - 1;
        }
        else if (type == "wanxiang") {
            let actWanXiangModel = ActWanXiangModel_1.ActWanXiangModel.getInstance(this.ctx, this.id);
            let actWanXiang = await actWanXiangModel.getInfo();
            return (Object.keys(actWanXiang.mfList).length);
        }
        return 0;
    }
    /**
     * 领奖
     */
    async rwd(dc, type, isNew) {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        if (cfg.data.list[dc] == null) {
            this.ctx.throw(`档次错误 ${dc}`);
        }
        //当前达到的等级
        let level = await this.getLevel(cfg.data.type);
        if (level < cfg.data.list[dc].level) {
            this.ctx.throw("等级未达标");
        }
        let info = await this.getInfo();
        let kind4 = 0;
        let itemid4 = 0;
        if (type == "free" || type == "all") {
            if (info.free[dc] == null) {
                info.free[dc] = this.ctx.state.newTime; //设置为已购买
                await this.update(info, ["outf", "red"]);
                let _kind = cfg.data.list[dc].free[0];
                let _itemid = cfg.data.list[dc].free[1];
                let _count = cfg.data.list[dc].free[2];
                if (info.buy1 > 0 && cfg.data.list[dc].freeAdd != null && cfg.data.list[dc].freeAdd > 0) {
                    _count += cfg.data.list[dc].freeAdd;
                }
                if (_count > 0) {
                    await this.ctx.state.master.addItem1([_kind, _itemid, _count]);
                }
                if (cfg.data.list[dc].free[0] == 4) {
                    kind4 = cfg.data.list[dc].free[0];
                    itemid4 = cfg.data.list[dc].free[1];
                }
            }
        }
        if (type == "grwd" || type == "all") {
            if (info.buy > 0) {
                if (info.gbuy[dc] == null) {
                    info.gbuy[dc] = this.ctx.state.newTime; //设置为已购买
                    await this.update(info, ["outf", "red"]);
                    let _kind = cfg.data.list[dc].grwd[0];
                    let _itemid = cfg.data.list[dc].grwd[1];
                    let _count = cfg.data.list[dc].grwd[2];
                    if (info.buy1 > 0 && cfg.data.list[dc].grwdAdd != null && cfg.data.list[dc].grwdAdd > 0) {
                        _count += cfg.data.list[dc].grwdAdd;
                    }
                    if (_count > 0) {
                        await this.ctx.state.master.addItem1([_kind, _itemid, _count]);
                    }
                    if (cfg.data.list[dc].grwd[0] == 4) {
                        kind4 = cfg.data.list[dc].grwd[0];
                        itemid4 = cfg.data.list[dc].grwd[1];
                    }
                    if (cfg.data.list[dc].grwd2 != null) {
                        let _kind2 = cfg.data.list[dc].grwd2[0];
                        let _itemid2 = cfg.data.list[dc].grwd2[1];
                        let _count2 = cfg.data.list[dc].grwd2[2];
                        if (info.buy1 > 0 && cfg.data.list[dc].grwdAdd2 != null && cfg.data.list[dc].grwdAdd2 > 0) {
                            _count2 += cfg.data.list[dc].grwdAdd2;
                        }
                        if (_count2 > 0) {
                            await this.ctx.state.master.addItem1([_kind2, _itemid2, _count2]);
                        }
                        if (cfg.data.list[dc].grwd2[0] == 4) {
                            kind4 = cfg.data.list[dc].grwd2[0];
                            itemid4 = cfg.data.list[dc].grwd2[1];
                        }
                    }
                }
            }
        }
        if (kind4 != 4) {
            return;
        }
        if (cfg.data.linshi[itemid4.toString()] == null) {
            this.ctx.throw("活动linshi配置错误");
            return;
        }
        let oldEquipId = cfg.data.linshi[itemid4.toString()].equipId;
        let oldEquipLv = cfg.data.linshi[itemid4.toString()].level;
        let actEquipModel = ActEquipModel_1.ActEquipModel.getInstance(this.ctx, this.id);
        let actEquip = await actEquipModel.getInfo();
        let cfgEquipInfo = gameCfg_1.default.equipInfo.getItemCtx(this.ctx, oldEquipId);
        //直接穿上
        if (actEquip.chuan[cfgEquipInfo.buwei] == null) {
            actEquip.chuan[cfgEquipInfo.buwei] = actEquipModel.initBuWei();
        }
        if (actEquip.chuan[cfgEquipInfo.buwei].hhList[cfg.data.linshi[itemid4.toString()].mrhh] == null) {
            actEquip.chuan[cfgEquipInfo.buwei].hhList[cfg.data.linshi[itemid4.toString()].mrhh] = 1;
            actEquip.chuan[cfgEquipInfo.buwei].newHh = cfg.data.linshi[itemid4.toString()].mrhh;
        }
        if (isNew == 1) {
            //加装备
            oldEquipId = actEquip.chuan[cfgEquipInfo.buwei].equipId;
            oldEquipLv = actEquip.chuan[cfgEquipInfo.buwei].level;
            actEquip.chuan[cfgEquipInfo.buwei].equipId = cfg.data.linshi[itemid4.toString()].equipId;
            actEquip.chuan[cfgEquipInfo.buwei].level = cfg.data.linshi[itemid4.toString()].level;
            actEquip.chuan[cfgEquipInfo.buwei].mrhh = cfg.data.linshi[itemid4.toString()].mrhh;
            actEquip.chuan[cfgEquipInfo.buwei].eps = gameMethod_1.gameMethod.objCopy(cfg.data.linshi[itemid4.toString()].eps);
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
        await actEquipModel.update(actEquip, ["chuan", "linshi", "linshiOld"]);
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
    /**
     * 一键领奖
     */
    async rwdAll(isNew) {
        this.ctx.throw("api已弃用");
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        let info = await this.getInfo();
        let items = [];
        for (const dc in cfg.data.list) {
            //当前达到的等级
            let level = await this.getLevel(cfg.data.type);
            if (level < cfg.data.list[dc].level) {
                continue;
            }
            //免费
            if (info.free[dc] == null) {
                info.free[dc] = this.ctx.state.newTime; //设置为已购买
                items.push(cfg.data.list[dc].free);
            }
            if (info.buy > 0 && info.gbuy[dc] == null) {
                if (cfg.data.list[dc].grwd[0] == 4) {
                    if (isNew[cfg.data.list[dc].grwd[1]] == null) {
                        continue;
                    }
                }
                info.gbuy[dc] = this.ctx.state.newTime; //设置为已购买
                items.push(cfg.data.list[dc].grwd);
            }
        }
        if (items.length > 0) {
            await this.ctx.state.master.addItem2(items);
            await this.update(info, ["outf", "red"]);
            for (const epid in isNew) {
                if (cfg.data.linshi[epid] == null) {
                    this.ctx.throw("活动linshi配置错误", epid);
                    continue;
                }
                let oldEquipId = cfg.data.linshi[epid].equipId;
                let oldEquipLv = cfg.data.linshi[epid].level;
                let actEquipModel = ActEquipModel_1.ActEquipModel.getInstance(this.ctx, this.id);
                let actEquip = await actEquipModel.getInfo();
                let cfgEquipInfo = gameCfg_1.default.equipInfo.getItemCtx(this.ctx, oldEquipId);
                //直接穿上
                if (actEquip.chuan[cfgEquipInfo.buwei] == null) {
                    actEquip.chuan[cfgEquipInfo.buwei] = actEquipModel.initBuWei();
                }
                if (actEquip.chuan[cfgEquipInfo.buwei].hhList[cfg.data.linshi[epid].mrhh] == null) {
                    actEquip.chuan[cfgEquipInfo.buwei].hhList[cfg.data.linshi[epid].mrhh] = 1;
                    actEquip.chuan[cfgEquipInfo.buwei].newHh = cfg.data.linshi[epid].mrhh;
                }
                if (isNew[epid] == 1) {
                    //加装备
                    oldEquipId = actEquip.chuan[cfgEquipInfo.buwei].equipId;
                    oldEquipLv = actEquip.chuan[cfgEquipInfo.buwei].level;
                    actEquip.chuan[cfgEquipInfo.buwei].equipId = cfg.data.linshi[epid].equipId;
                    actEquip.chuan[cfgEquipInfo.buwei].level = cfg.data.linshi[epid].level;
                    actEquip.chuan[cfgEquipInfo.buwei].mrhh = cfg.data.linshi[epid].mrhh;
                    actEquip.chuan[cfgEquipInfo.buwei].eps = gameMethod_1.gameMethod.objCopy(cfg.data.linshi[epid].eps);
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
                        actEquip.chuan[cfgEquipInfo.buwei].newHh = "";
                    }
                }
                await actEquipModel.update(actEquip, ["chuan", "linshi", "linshiOld"]);
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
        else {
            this.ctx.throw("无奖励可领取");
        }
    }
    /**
     * 充值下单检查
     */
    async checkUp() {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        if (cfg.data.need[0] != 10) {
            this.ctx.throw("参数错误");
        }
        let info = await this.getInfo();
        if (info.buy > 0) {
            this.ctx.throw("已经购买");
        }
        return {
            type: 1,
            msg: cfg.info.title,
            data: cfg.data.need[1],
            kind10Cs: this.kid + "_" + this.hdcid + "_" + "1" + "_" + cfg.data.need[1]
        };
    }
    /**
     * 充值成功后执行
     */
    async carryOut() {
        let cfg = (await this.getHdCfg());
        if (cfg == null) {
            return {
                type: 0,
                msg: "充值失败",
                data: null,
            };
        }
        let info = await this.getInfo();
        info.buy = this.ctx.state.newTime;
        await this.update(info, ["outf", "red"]);
        return {
            type: 1,
            msg: "充值成功",
            data: cfg.data.need[1],
        };
    }
    /**
     * 豪华充值下单检查
     */
    async checkUp1() {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        if (cfg.data.need[0] != 10) {
            this.ctx.throw("参数错误");
        }
        let info = await this.getInfo();
        if (info.buy == 0) {
            this.ctx.throw("请先购买基础礼包");
        }
        if (info.buy1 > 0) {
            this.ctx.throw("已购买");
        }
        return {
            type: 1,
            msg: cfg.info.title + "豪华",
            data: cfg.data.need1[1],
            kind10Cs: "hdGrowthFundHh" + "_" + this.hdcid + "_" + "1" + "_" + cfg.data.need[1]
        };
    }
    /**
     * 豪华充值成功后执行
     */
    async carryOut1() {
        let cfg = (await this.getHdCfg());
        if (cfg == null) {
            return {
                type: 0,
                msg: "充值失败",
                data: null,
            };
        }
        let info = await this.getInfo();
        info.buy1 = this.ctx.state.newTime;
        await this.update(info, ["outf", "red"]);
        //补发已经领取过的档次
        let items = [];
        items = game_1.default.addArr(items, cfg.data.hhItems);
        //免费的
        for (const dc in info.free) {
            if (info.free[dc] == null || info.free[dc] <= 0) {
                continue;
            }
            if (cfg.data.list[dc].freeAdd == null || cfg.data.list[dc].freeAdd <= 0) {
                continue;
            }
            let _kind = cfg.data.list[dc].free[0];
            let _itemid = cfg.data.list[dc].free[1];
            items.push([_kind, _itemid, cfg.data.list[dc].freeAdd]);
        }
        //豪华的
        for (const dc in info.gbuy) {
            if (info.gbuy[dc] == null || info.gbuy[dc] <= 0) {
                continue;
            }
            if (cfg.data.list[dc].grwdAdd == null || cfg.data.list[dc].grwdAdd <= 0) {
                continue;
            }
            let _kind = cfg.data.list[dc].free[0];
            let _itemid = cfg.data.list[dc].free[1];
            items.push([_kind, _itemid, cfg.data.list[dc].grwdAdd]);
            if (cfg.data.list[dc].grwd2 != null && cfg.data.list[dc].grwdAdd2 > 0) {
                let _kind2 = cfg.data.list[dc].grwd2[0];
                let _itemid2 = cfg.data.list[dc].grwd2[1];
                items.push([_kind2, _itemid2, cfg.data.list[dc].grwdAdd2]);
            }
        }
        if (items.length > 0) {
            items = game_1.default.mergeArr(items);
            await this.ctx.state.master.addItem2(items);
        }
        return {
            type: 1,
            msg: "充值成功",
            data: cfg.data.need1[1],
        };
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
     * 检测活动是否结束
     */
    async checkIsOver() {
        if (["1", "2", "3"].indexOf(this.hdcid) == -1) {
            return;
        }
        let cfg = (await this.getHdCfg());
        if (cfg == null) {
            return;
        }
        let info = await this.getInfo();
        if (info.isOver == 1) {
            return;
        }
        for (const dc in cfg.data.list) {
            if (info.free[dc] == null || info.gbuy[dc] == null) {
                return;
            }
        }
        info.isOver = 1;
        await this.update(info, [""]);
    }
}
exports.HdGrowthFundModel = HdGrowthFundModel;
//# sourceMappingURL=HdGrowthFundModel.js.map