"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActShopPvwModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const game_1 = __importDefault(require("../../util/game"));
const ActPvwModel_1 = require("./ActPvwModel");
/**
 * 商店 - 试炼
 */
class ActShopPvwModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actShopPvw"; //用于存储key 和  输出1级key
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
            let cfgPool = gameCfg_1.default.shopPvw.pool;
            for (const key in cfgPool) {
                if (cfgPool[key].reset != "day") {
                    continue;
                }
                info.buy[cfgPool[key].id] = 0;
            }
        }
        if (info.weekAt < this.ctx.state.newTime) {
            info.weekAt = game_1.default.getWeek0(this.ctx.state.newTime) + 7 * 86400;
            let cfgPool = gameCfg_1.default.shopPvw.pool;
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
    async buy(dc, count) {
        let info = await this.getInfo();
        let cfg = gameCfg_1.default.shopPvw.getItem(dc);
        if (cfg == null) {
            this.ctx.throw("参数错误");
            return;
        }
        //获取玩家试炼信息
        let actPvwModel = ActPvwModel_1.ActPvwModel.getInstance(this.ctx, this.id);
        let pvwInfo = await actPvwModel.getInfo();
        if (pvwInfo.histMax < cfg.lock) {
            this.ctx.throw("未解锁");
        }
        if (info.buy[dc] == null) {
            info.buy[dc] = 0;
        }
        if (info.buy[dc] + count > cfg.limit) {
            this.ctx.throw("购买次数已达上限");
        }
        info.buy[dc] += count;
        await this.ctx.state.master.subItem1([cfg.need[0], cfg.need[1], cfg.need[2] * count]);
        await this.ctx.state.master.addItem1([cfg.item[0], cfg.item[1], cfg.item[2] * count]);
        await this.update(info);
    }
}
exports.ActShopPvwModel = ActShopPvwModel;
//# sourceMappingURL=ActShopPvwModel.js.map