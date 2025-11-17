"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActChiBangModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const Xys_1 = require("../../../common/Xys");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const gameMethod_1 = require("../../../common/gameMethod");
const hook_1 = require("../../util/hook");
const game_1 = __importDefault(require("../../util/game"));
const HdPriCardModel_1 = require("../hd/HdPriCardModel");
const ActTaskMainModel_1 = require("./ActTaskMainModel");
/**
 * 翅膀
 */
class ActChiBangModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actChiBang"; //用于存储key 和  输出1级key
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
        return {
            id: 0,
            exp: 0,
            hh: "",
            hhList: [],
            tsNum: 0,
            cleps: { "hsjiyun": 0, "hsshanbi": 0, "hslianji": 0, "hsfanji": 0, "hsbaoji": 0, "hsxixue": 0 }
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        if (info.exp == null) {
            info.exp = 0;
        }
        if (info.tsNum == null) {
            info.tsNum = 0;
        }
        if (info.cleps == null) {
            info.cleps = { "hsjiyun": 0, "hsshanbi": 0, "hslianji": 0, "hsfanji": 0, "hsbaoji": 0, "hsxixue": 0 };
        }
        return info;
    }
    /**
     * 返回数据
     */
    async getOutPut() {
        let info = await this.getInfo();
        return info;
    }
    /**
     * 翅膀解锁
     * @param level 角色等级
     */
    async unLock() {
        let info = await this.getInfo();
        if (info.hh != "") {
            return;
        }
        let actTaskMainModel = await ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
        if (await actTaskMainModel.kaiqi("5200") == 0) {
            return;
        }
        info.hh = '1';
        info.hhList.push("1");
        info.id = 1;
        info.exp = 0;
        await this.update(info);
    }
    /**
     * 购买翅膀
     * @param id
     */
    async buy(id) {
        let info = await this.getInfo();
        if (info.id == 0) {
            this.ctx.throw("功能未解锁");
        }
        if (info.hhList.indexOf(id) != -1) {
            this.ctx.throw("已获取");
        }
        let cfg = gameCfg_1.default.chibangInfo.getItemCtx(this.ctx, id);
        if (gameMethod_1.gameMethod.isEmpty(cfg.need) == false) {
            await this.ctx.state.master.subItem1(cfg.need);
        }
        info.hhList.push(id);
        await this.update(info);
    }
    /**
     * 翅膀更换
     * @param id
     */
    async gengHuan(id) {
        let info = await this.getInfo();
        if (info.id == 0) {
            this.ctx.throw("功能未解锁");
        }
        if (info.hhList.indexOf(id) == -1) {
            this.ctx.throw("未获取");
        }
        info.hh = id;
        await this.update(info);
    }
    /**
     * 翅膀提升
     */
    async tiSheng() {
        let info = await this.getInfo();
        if (info.hh == "") {
            this.ctx.throw("功能未解锁");
        }
        let cfgNext = gameCfg_1.default.chibangLevel.getItem((info.id + 1).toString());
        if (cfgNext == null) {
            this.ctx.throw("已满级");
            return 0;
        }
        let cftype = 0; //触发类型  0升经验  1升级 2 升阶
        let cfg = gameCfg_1.default.chibangLevel.getItemCtx(this.ctx, info.id.toString());
        //判定当前 是不是升阶
        if (cfgNext.step != cfg.step && info.exp >= cfg.exp) { //升阶
            let cfgStep = gameCfg_1.default.chibangStep.getItemCtx(this.ctx, info.hh, cfg.step.toString());
            await this.ctx.state.master.subItem2(cfgStep.need);
            info.id += 1;
            info.exp -= cfg.exp;
            await hook_1.hookNote(this.ctx, "chibangUpStep", 1);
            await this.update(info);
            cftype = 2;
            return cftype; //升阶完成
        }
        let addExp = 0;
        //升级
        await this.ctx.state.master.subItem2(cfg.need); //消耗
        info.tsNum += 1;
        let cfgzj = gameCfg_1.default.chibangZuojia.getItem(info.tsNum.toString());
        if (cfgzj == null) {
            let probKey = "prob" + cfg.step;
            let cfgpool = gameCfg_1.default.chibangExp.pool;
            let _item = game_1.default.getProbRandItem(0, cfgpool, probKey);
            if (_item == null) {
                info.exp += 1;
                addExp += 1;
            }
            else {
                info.exp += parseInt(_item.id);
                addExp += parseInt(_item.id);
            }
        }
        else { //作假
            info.exp += cfgzj.exp;
            addExp += cfgzj.exp;
        }
        //如果有开月卡，多加1点
        let hdPriCardModel = HdPriCardModel_1.HdPriCardModel.getInstance(this.ctx, this.id, Xys_1.PriCardType.moon);
        let hdmoon = await hdPriCardModel.getInfo();
        if (hdmoon.btime < 0 || hdmoon.btime > this.ctx.state.newTime) {
            info.exp += 1;
            addExp += 1;
        }
        if (cfgNext.step == cfg.step && info.exp >= cfg.exp) {
            info.id += 1;
            info.exp -= cfg.exp;
            cftype = 1;
        }
        await hook_1.hookNote(this.ctx, "chibangUpLv", 1);
        await this.update(info);
        if (addExp > 0) {
            await this.ctx.state.master.addWin("fzExp", addExp);
        }
        return cftype;
    }
    /**
     * 翅膀一键提升
     */
    async tiShengAll() {
        let kk = 500;
        while (kk > 0) {
            kk--;
            let info = await this.getInfo();
            if (info.hh == "") {
                this.ctx.state.master.addWin("msg", "功能未解锁");
                return;
            }
            let cfgNext = gameCfg_1.default.chibangLevel.getItem((info.id + 1).toString());
            if (cfgNext == null) {
                this.ctx.state.master.addWin("msg", "已满级");
                return;
            }
            let cfg = gameCfg_1.default.chibangLevel.getItemCtx(this.ctx, info.id.toString());
            //判定当前 是不是升阶
            if (cfgNext.step != cfg.step && info.exp >= cfg.exp) { //升阶
                return; //升阶完成
            }
            if (await this.ctx.state.master.subItem2(cfg.need, true) == false) {
                return;
            }
            if (await this.tiSheng() == 1) {
                return;
            }
        }
    }
    /**
     * 获得翅膀
     * @param id
     */
    async addChibang(hhid) {
        let info = await this.getInfo();
        if (info.hhList.indexOf(hhid) != -1) {
            return;
        }
        info.hhList.push(hhid);
        await this.update(info);
        let cfgName = gameCfg_1.default.chibangInfo.getItemCtx(this.ctx, hhid).name;
        await this.ctx.state.master.addWin("msg", "恭喜获得剑灵-" + cfgName);
    }
    /**
     * 淬炼提升
     * @param key 属性key
     */
    async cuilian(key) {
        let info = await this.getInfo();
        if (info.cleps[key] == null) {
            this.ctx.throw("参数错误");
        }
        let cfgNext = gameCfg_1.default.chibangClLv.getItem(key, (info.cleps[key] + 1).toString());
        if (cfgNext == null) {
            this.ctx.throw("已满级");
        }
        let cfg = gameCfg_1.default.chibangClLv.getItemCtx(this.ctx, key, info.cleps[key].toString());
        await this.ctx.state.master.subItem2(cfg.need);
        if (game_1.default.rand(1, 10000) > cfg.prob) {
            return; //失败
        }
        info.cleps[key] += 1;
        await this.update(info);
        await hook_1.hookNote(this.ctx, "clUplevel", 1);
    }
}
exports.ActChiBangModel = ActChiBangModel;
//# sourceMappingURL=ActChiBangModel.js.map