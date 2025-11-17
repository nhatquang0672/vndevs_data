"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActGiftDtModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
/**
 * 常规礼包 - 洞天
 * 今天买了的话，就一直升档。升到648就停住。超过198的话，
 * 第二天从198档开始弹，今天198没买，下一天会变成128档，买了的话就变成198，没买就次日继续下降。
 */
class ActGiftDtModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actGiftDt"; //用于存储key 和  输出1级key
        this.outIsAu = false; //下发数据是否用au下发
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
        return ""; //输出2级key
    }
    //初始化
    init() {
        return {
            dayAt: 0,
            list: {
                "1": 1,
                "2": 1,
                "3": 1,
            }
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        if (info.dayAt < this.ctx.state.new0) {
            info.dayAt = this.ctx.state.newTime;
            for (const type in info.list) {
                if (info.list[type] > 1) {
                    info.list[type] -= 1;
                }
                if (info.list[type] > 5) {
                    info.list[type] = 5;
                }
            }
            await this.update(info, [""]);
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
     * 充值下单检查
     */
    async checkUp(type) {
        let info = await this.getInfo();
        let cfg = gameCfg_1.default.giftDongtian.getItemCtx(this.ctx, type, info.list[type].toString());
        if (cfg.need[0] != 10) {
            this.ctx.throw("不是充值档次");
        }
        return {
            type: 1,
            msg: cfg.title,
            data: cfg.need[1],
            kind10Cs: this.kid + "_" + type + "_" + "1" + "_" + cfg.need[1]
        };
    }
    /**
     * 充值成功后执行
     */
    async carryOut(type) {
        let info = await this.getInfo();
        let cfg = gameCfg_1.default.giftDongtian.getItemCtx(this.ctx, type, info.list[type].toString());
        await this.ctx.state.master.addItem2(cfg.items);
        let cfgNext = gameCfg_1.default.giftDongtian.getItem(type, (info.list[type] + 1).toString());
        if (cfgNext != null) {
            info.list[type] += 1;
        }
        await this.update(info);
        return {
            type: 1,
            msg: "充值成功",
            data: cfg.need[1],
        };
    }
}
exports.ActGiftDtModel = ActGiftDtModel;
//# sourceMappingURL=ActGiftDtModel.js.map