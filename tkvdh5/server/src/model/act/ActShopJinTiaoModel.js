"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActShopJinTiaoModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const setting_1 = __importDefault(require("../../crontab/setting"));
const game_1 = __importDefault(require("../../util/game"));
/**
 * 商店 - 金条
 */
class ActShopJinTiaoModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actShopJinTiao"; //用于存储key 和  输出1级key
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
            ver1: 0,
            ver2: 0
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        if (info.ver1 == null) {
            info.ver1 = 0;
        }
        if (info.ver2 == null) {
            info.ver2 = 0;
        }
        let update = false;
        let heid = await this.getHeIdByUuid(this.id);
        let back = setting_1.default.getSetting(heid, "resetShop");
        if (back != null && back.actShopJinTiao != null) { //开启
            if (back.actShopJinTiao["1"] != null && info.ver1 == 0) {
                let qf_0 = setting_1.default.getQufus()[heid].openAt;
                info.ver1 = game_1.default.getToDay_0(qf_0) + (back.actShopJinTiao["1"] - 1) * 86400;
                update = true;
            }
            if (back.actShopJinTiao["2"] != null && info.ver2 != back.actShopJinTiao["2"]) {
                info.ver2 = back.actShopJinTiao["2"];
                info.buy = {};
                update = true;
            }
        }
        if (info.ver1 > 1 && this.ctx.state.newTime > info.ver1) {
            info.ver1 = 1;
            info.buy = {};
            update = true;
        }
        if (update) {
            await this.update(info);
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
    async checkUp(dc) {
        let cfg = gameCfg_1.default.shopJintiao.getItemCtx(this.ctx, dc);
        if (cfg == null) {
            this.ctx.throw("参数错误");
        }
        return {
            type: 1,
            msg: cfg.name,
            data: cfg.need[1],
            kind10Cs: ""
        };
    }
    /**
     * 充值成功后执行
     */
    async carryOut(dc) {
        let info = await this.getInfo();
        let cfg = gameCfg_1.default.shopJintiao.getItemCtx(this.ctx, dc);
        await this.ctx.state.master.addItem1(cfg.item);
        if (info.buy[dc] == null) {
            info.buy[dc] = 0;
        }
        info.buy[dc] += 1;
        if (info.buy[dc] <= 1) {
            await this.ctx.state.master.addItem1(cfg.item_2);
        }
        await this.update(info);
        return {
            type: 1,
            msg: "充值成功",
            data: null
        };
    }
}
exports.ActShopJinTiaoModel = ActShopJinTiaoModel;
//# sourceMappingURL=ActShopJinTiaoModel.js.map