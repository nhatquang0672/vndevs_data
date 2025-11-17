"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HdSignGiftModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const setting_1 = __importDefault(require("../../crontab/setting"));
/**
 * 活动 签到 7日签到
 */
class HdSignGiftModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdSignGift"; //用于存储key 和  输出1级key
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
    //钩子 整合代码
    static async hook(ctx, uuid) {
        let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
        //活动 - 限时活动 任务
        let cfgHdSignGift = setting_1.default.getHuodong2(heid, "hdSignGift");
        if (cfgHdSignGift != null) {
            for (const hdcid in cfgHdSignGift) {
                let hdSignGiftModel = HdSignGiftModel.getInstance(ctx, uuid, hdcid);
                await hdSignGiftModel.addDays();
            }
        }
    }
    outKey2() {
        return this.hdcid; //输出2级key
    }
    //初始化
    init() {
        return {
            hdid: "",
            rwds: {},
            days: 0,
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        let cfg = (await this.getHdCfg());
        if (cfg != null && cfg.info.id != info.hdid) {
            info = this.init();
            info.hdid = cfg.info.id;
        }
        return info;
    }
    /**
     * 返回数据
     */
    async getOutPut() {
        return {
            info: await this.getOutPut_u("info"),
            data: await this.getOutPut_u("data"),
            red: await this.getOutPut_u("red"),
            outf: await this.getOutPut_u("outf"),
        };
    }
    /**
     * add day 增加一天登录
     */
    async addDays() {
        let info = await this.getInfo();
        info.days += 1;
        await this.update(info, ["outf", "red"]);
    }
    async getOutPut_u(key) {
        let cfg = (await this.getHdCfg());
        if (cfg == null) {
            return null;
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
                    rwds: info.rwds,
                    days: info.days,
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
        //遍历配置档次
        let info = await this.getInfo();
        for (const day in cfg.data.list) {
            if (info.rwds[day] == null && info.days >= Number(day)) {
                return 1;
            }
        }
        return 0;
    }
    /**
     * 领取签到奖励
     */
    async rwd(days) {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        if (cfg.data.list[days] == null) {
            this.ctx.throw(`档次错误 ${days}`);
        }
        let info = await this.getInfo();
        if (info.days < Number(days)) {
            this.ctx.throw(`已经领取`);
        }
        if (info.rwds[days] != null) {
            this.ctx.throw(`已经领取`);
        }
        //设置为已经领取
        info.rwds[days] = this.ctx.state.newTime;
        await this.update(info, ["outf", "red"]);
        //给奖励
        await this.ctx.state.master.addItem2(cfg.data.list[days].rwd);
    }
}
exports.HdSignGiftModel = HdSignGiftModel;
//# sourceMappingURL=HdSignGiftModel.js.map