"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActShopKind11Model = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const hook_1 = require("../../util/hook");
/**
 * 商店 - 广告商店
 */
class ActShopKind11Model extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actShopKind11"; //用于存储key 和  输出1级key
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
            dayAt: 0
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        if (this.ctx.state.new0 > info.dayAt) {
            info.dayAt = this.ctx.state.newTime;
            for (const dc in info.buy) {
                if (info.buy[dc].rwd != 0) {
                    delete info.buy[dc];
                }
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
    *  钻石购买
    */
    async buy(dc) {
        let cfg = gameCfg_1.default.shopKind11.getItemCtx(this.ctx, dc);
        if (cfg.need[0] != 11) {
            await this.ctx.state.master.subItem1(cfg.need);
        }
        else {
            if (cfg.need1 <= 0) {
                this.ctx.throw("道具不足");
            }
            await this.ctx.state.master.subItem1([1, 1, cfg.need1]);
        }
        let info = await this.getInfo();
        if (info.buy[dc] == null) {
            info.buy[dc] = {
                count: 0,
                rwd: 0,
            };
        }
        if (info.buy[dc].rwd >= cfg.limit) {
            this.ctx.throw("今日已无购买次数");
        }
        info.buy[dc].rwd += 1;
        await this.update(info);
        await this.ctx.state.master.addItem2(cfg.items);
        await hook_1.hookNote(this.ctx, "shopBuy3", 1);
    }
    /**
     * 广告下单检查
     */
    async checkUp(dc) {
        let cfg = gameCfg_1.default.shopKind11.getItemCtx(this.ctx, dc);
        if (cfg == null || cfg.need[0] != 11) {
            this.ctx.throw("参数错误");
        }
        let info = await this.getInfo();
        if (info.buy[dc] == null) {
            info.buy[dc] = {
                count: 0,
                rwd: 0,
            };
        }
        if (info.buy[dc].rwd >= cfg.limit) {
            this.ctx.throw("今日已无购买次数");
        }
        return {
            type: 1,
            msg: "宝箱进阶广告加速",
            data: null
        };
    }
    /**
     * 广告成功后执行
     */
    async carryOut(dc) {
        let cfg = gameCfg_1.default.shopKind11.getItemCtx(this.ctx, dc);
        let info = await this.getInfo();
        if (info.buy[dc] == null) {
            info.buy[dc] = {
                count: 0,
                rwd: 0,
            };
        }
        if (info.buy[dc].rwd >= cfg.limit) {
            this.ctx.throw("今日已无购买次数");
        }
        info.buy[dc].count += 1;
        if (info.buy[dc].count >= cfg.need[1]) {
            info.buy[dc].rwd += 1;
            info.buy[dc].count = 0;
            await this.ctx.state.master.addItem2(cfg.items);
        }
        await this.update(info);
        return {
            type: 1,
            msg: "",
            data: null
        };
    }
}
exports.ActShopKind11Model = ActShopKind11Model;
//# sourceMappingURL=ActShopKind11Model.js.map