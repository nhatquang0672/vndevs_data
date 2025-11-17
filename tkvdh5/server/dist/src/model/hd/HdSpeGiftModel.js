"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HdSpeGiftModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const game_1 = __importDefault(require("../../util/game"));
/**
 * 活动 特惠礼包
 */
class HdSpeGiftModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdSpeGift"; //用于存储key 和  输出1级key
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
            list: {},
            outTime: 0,
            mdAt: 0 //埋点控制（每日刷一次）
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        let cfg = (await this.getHdCfg());
        if (cfg != null && cfg.info.id != info.hdid) {
            info = this.init();
            info.hdid = cfg.info.id;
        }
        //每日重置
        if (this.ctx.state.newTime > info.outTime) {
            info.list = {};
            info.outTime = this.ctx.state.new0 + 86400;
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
                    list: info.list,
                    outTime: info.outTime,
                };
        }
        return null;
    }
    /**
     * 获取红点
     */
    async getRed() {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.dAt) {
            return 0;
        }
        let info = await this.getInfo();
        for (const dc in cfg.data.list) {
            if (cfg.data.list[dc].need.length <= 0 && (info.list[dc] == null || info.list[dc] == 0)) {
                return 1;
            }
        }
        return 0;
    }
    /**
     * 购买
     */
    async buy(dc) {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        if (cfg.data.list[dc] == null) {
            this.ctx.throw(`档次错误 ${dc}`);
        }
        let info = await this.getInfo();
        if (info.list[dc] == null) {
            info.list[dc] = 0;
        }
        if (info.list[dc] >= cfg.data.list[dc].limit) {
            this.ctx.throw("购买上限");
        }
        info.list[dc] += 1;
        await this.update(info, ["outf", "red"]);
        //扣钱
        if (cfg.data.list[dc].need.length > 0) {
            await this.ctx.state.master.subItem1(cfg.data.list[dc].need);
        }
        await this.ctx.state.master.addItem2(cfg.data.list[dc].items);
    }
    /**
     * 充值下单检查
     */
    async checkUp(dc) {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        if (cfg.data.list[dc] == null) {
            this.ctx.throw(`档次错误 ${dc}`);
        }
        if (cfg.data.list[dc].need[0] != 10) {
            this.ctx.throw("参数错误");
        }
        let info = await this.getInfo();
        if (info.list[dc] == null) {
            info.list[dc] = 0;
        }
        if (info.list[dc] >= cfg.data.list[dc].limit) {
            this.ctx.throw("购买上限");
        }
        return {
            type: 1,
            msg: cfg.info.title,
            data: cfg.data.list[dc].need[1],
            kind10Cs: this.kid + "_" + this.hdcid + "_" + dc + "_" + cfg.data.list[dc].need[1]
        };
    }
    /**
     * 充值成功后执行
     */
    async carryOut(dc) {
        let cfg = (await this.getHdCfg());
        if (cfg == null) {
            return {
                type: 0,
                msg: "充值失败",
                data: null,
            };
        }
        let info = await this.getInfo();
        if (info.list[dc] == null) {
            info.list[dc] = 0;
        }
        info.list[dc] += 1;
        await this.update(info, ["outf", "red"]);
        await this.ctx.state.master.addItem2(cfg.data.list[dc].items);
        return {
            type: 1,
            msg: "充值成功",
            data: cfg.data.list[dc].need[1],
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
}
exports.HdSpeGiftModel = HdSpeGiftModel;
//# sourceMappingURL=HdSpeGiftModel.js.map