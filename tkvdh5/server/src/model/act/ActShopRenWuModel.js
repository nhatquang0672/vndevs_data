"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActShopRenWuModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
/**
 * 皮肤商店 - 头像
 */
class ActShopRenWuModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actShopRenWu"; //用于存储key 和  输出1级key
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
     * 充值下单检查
     */
    async checkUp(dc) {
        let cfg = gameCfg_1.default.shopPifu_renwu.getItemCtx(this.ctx, dc);
        if (cfg == null) {
            this.ctx.throw("参数错误");
        }
        return {
            type: 1,
            msg: "皮肤商店-头像",
            data: cfg.need[1],
            kind10Cs: this.kid + "_" + "1" + "_" + dc + "_" + cfg.need[1]
        };
    }
    /**
     * 充值成功后执行
     */
    async carryOut(dc) {
        let info = await this.getInfo();
        let cfg = gameCfg_1.default.shopPifu_renwu.getItemCtx(this.ctx, dc);
        await this.ctx.state.master.addItem1(cfg.item);
        if (info.buy[dc] == null) {
            info.buy[dc] = 0;
        }
        info.buy[dc] += 1;
        if (info.buy[dc] <= 1) {
            await this.ctx.state.master.addItem1(cfg.item);
        }
        await this.update(info);
        return {
            type: 1,
            msg: "充值成功",
            data: cfg.need[1]
        };
    }
}
exports.ActShopRenWuModel = ActShopRenWuModel;
//# sourceMappingURL=ActShopRenWuModel.js.map