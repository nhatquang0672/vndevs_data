"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActJinxiuModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const UserModel_1 = require("../user/UserModel");
const hook_1 = require("../../util/hook");
const ActChiBangModel_1 = require("./ActChiBangModel");
/**
 * 锦绣坊
 */
class ActJinxiuModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actJinxiu"; //用于存储key 和  输出1级key
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
            list: {},
        };
    }
    /**
     * 返回数据
     */
    async getOutPut() {
        let info = await this.getInfo();
        return info;
    }
    /**
    *  升阶
    */
    async upStep(tzid) {
        let info = await this.getInfo();
        if (info.list[tzid] == null) {
            info.list[tzid] = {
                step: 0,
                fx: 0 //是否已经分享（刚获得时触发）
            };
        }
        let cfgNext = gameCfg_1.default.jinxiuStep.getItemCtx(this.ctx, tzid, (info.list[tzid].step + 1).toString());
        if (cfgNext == null) {
            this.ctx.throw("已满阶");
        }
        let cfg = gameCfg_1.default.jinxiuStep.getItemCtx(this.ctx, tzid, info.list[tzid].step.toString());
        await this.ctx.state.master.subItem2(cfg.need);
        info.list[tzid].step += 1;
        await this.update(info);
        let cfginfo = gameCfg_1.default.jinxiuByTz.getItemCtx(this.ctx, tzid);
        if (cfginfo.id == "3" && info.list[tzid].step <= 1) {
            await this.ctx.state.master.addWin("msg", cfginfo.tzName + "套装解锁成功！");
        }
        if (cfginfo.id == "6" && info.list[tzid].step <= 1) {
            await this.ctx.state.master.addWin("msg", cfginfo.tzName + "剑灵觉醒成功！");
        }
    }
    /**
    *  分享获得道具
    */
    async fenxiang(tzid) {
        let info = await this.getInfo();
        if (info.list[tzid] == null) {
            this.ctx.throw("未解锁");
        }
        if (info.list[tzid].fx == 1) {
            this.ctx.throw("已分享");
        }
        info.list[tzid].fx = 1;
        await this.update(info);
        let cfg = gameCfg_1.default.jinxiuByTz.getItemCtx(this.ctx, tzid);
        await this.ctx.state.master.addItem2(cfg.items);
        await hook_1.hookNote(this.ctx, "fenxiang", 1);
    }
    /**
    *  设置套装ID
    */
    async setTzid(tzid) {
        if (tzid != "") {
            let info = await this.getInfo();
            if (info.list[tzid] == null) {
                this.ctx.throw("未解锁");
            }
        }
        //设置套装ID
        let userModel = UserModel_1.UserModel.getInstance(this.ctx, this.id);
        let userInfo = await userModel.getInfo();
        userInfo.tzid = tzid;
        await userModel.update(userInfo);
    }
    /**
    *  合成套装
    */
    async hcTz(tzid) {
        let info = await this.getInfo();
        if (info.list[tzid] != null) {
            this.ctx.throw("已合成");
        }
        let cfgStep = gameCfg_1.default.jinxiuStep.getItemCtx(this.ctx, tzid, "0");
        await this.ctx.state.master.subItem2(cfgStep.need);
        if (info.list[tzid] == null) {
            info.list[tzid] = {
                step: 0,
                fx: 0 //是否已经分享（刚获得时触发）
            };
        }
        await this.update(info);
        //解锁翅膀
        let cfgInfo = gameCfg_1.default.jinxiuByTz.getItemCtx(this.ctx, tzid);
        let actChiBangModel = ActChiBangModel_1.ActChiBangModel.getInstance(this.ctx, this.id);
        await actChiBangModel.addChibang(cfgInfo.glid);
    }
}
exports.ActJinxiuModel = ActJinxiuModel;
//# sourceMappingURL=ActJinxiuModel.js.map