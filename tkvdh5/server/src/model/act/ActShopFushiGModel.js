"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActShopFushiGModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const game_1 = __importDefault(require("../../util/game"));
/**
 * 符石商店 - 符石币
 */
class ActShopFushiGModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actShopFushiG"; //用于存储key 和  输出1级key
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
            weekAt: 0,
            buy: {},
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        if (info.dayAt < this.ctx.state.new0) {
            info.dayAt = this.ctx.state.new0;
            let cfgPool = gameCfg_1.default.shopFushig.pool;
            for (const key in cfgPool) {
                if (cfgPool[key].reset != "day") {
                    continue;
                }
                info.buy[cfgPool[key].id] = 0;
            }
        }
        if (info.weekAt < this.ctx.state.newTime) {
            info.weekAt = game_1.default.getWeek0(this.ctx.state.newTime) + 7 * 86400;
            let cfgPool = gameCfg_1.default.shopFushig.pool;
            for (const key in cfgPool) {
                if (cfgPool[key].reset != "week") {
                    continue;
                }
                info.buy[cfgPool[key].id] = 0;
            }
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
     *  购买
     */
    async buy(dc) {
        let info = await this.getInfo();
        let cfg = gameCfg_1.default.shopFushig.getItem(dc);
        if (cfg == null) {
            this.ctx.throw("参数错误");
            return;
        }
        if (info.buy[dc] == null) {
            info.buy[dc] = 0;
        }
        info.buy[dc] += 1;
        if (info.buy[dc] > cfg.limit) {
            this.ctx.throw("购买次数已达上限");
        }
        await this.ctx.state.master.subItem1(cfg.need);
        await this.ctx.state.master.addItem2(cfg.items);
        await this.update(info);
    }
    /**
     * 充值下单检查
     */
    async checkUp(dc) {
        let cfg = gameCfg_1.default.shopFushig.getItemCtx(this.ctx, dc);
        if (cfg == null) {
            this.ctx.throw("参数错误");
        }
        let info = await this.getInfo();
        if (info.buy[dc] == null) {
            info.buy[dc] = 0;
        }
        if (info.buy[dc] >= cfg.limit) {
            this.ctx.throw("无购买次数");
        }
        return {
            type: 1,
            msg: cfg.name,
            data: cfg.need[1],
            kind10Cs: this.kid + "_" + "1" + "_" + dc + "_" + cfg.need[1]
        };
    }
    /**
     * 充值成功后执行
     */
    async carryOut(dc) {
        let info = await this.getInfo();
        if (info.buy[dc] == null) {
            info.buy[dc] = 0;
        }
        info.buy[dc] += 1;
        let cfg = gameCfg_1.default.shopFushig.getItemCtx(this.ctx, dc);
        await this.ctx.state.master.addItem2(cfg.items);
        await this.update(info);
        return {
            type: 1,
            msg: "充值成功",
            data: cfg.need[1]
        };
    }
}
exports.ActShopFushiGModel = ActShopFushiGModel;
//# sourceMappingURL=ActShopFushiGModel.js.map