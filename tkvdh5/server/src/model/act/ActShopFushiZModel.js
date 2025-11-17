"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActShopFushiZModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const ActFuShiModel_1 = require("./ActFuShiModel");
/**
 * 符石商店 - 钻石
 */
class ActShopFushiZModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actShopFushiZ"; //用于存储key 和  输出1级key
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
            buy: {},
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
    *  购买
    */
    async buy(dc) {
        let info = await this.getInfo();
        let cfg = gameCfg_1.default.shopFushiz.getItem(dc);
        if (cfg == null) {
            this.ctx.throw("参数错误");
            return;
        }
        if (info.buy[dc] == null) {
            info.buy[dc] = 0;
        }
        await this.ctx.state.master.subItem1(cfg.need);
        await this.ctx.state.master.addItem1(cfg.item);
        info.buy[dc] += 1;
        await this.update(info);
        let actFuShiModel = ActFuShiModel_1.ActFuShiModel.getInstance(this.ctx, this.id);
        await actFuShiModel.addHook("535", 1, false);
    }
}
exports.ActShopFushiZModel = ActShopFushiZModel;
//# sourceMappingURL=ActShopFushiZModel.js.map