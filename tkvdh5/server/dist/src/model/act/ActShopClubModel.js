"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActShopClubModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const game_1 = __importDefault(require("../../util/game"));
const ActClubModel_1 = require("./ActClubModel");
const SevClubModel_1 = require("../sev/SevClubModel");
const tool_1 = require("../../util/tool");
const ActEquipModel_1 = require("./ActEquipModel");
/**
 * 商店 - 工会
 */
class ActShopClubModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actShopClub"; //用于存储key 和  输出1级key
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
            bugVer: "1" //配置错位数据修复
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        if (info.dayAt < this.ctx.state.new0) {
            info.dayAt = this.ctx.state.new0;
            let cfgPool = gameCfg_1.default.shopClub.pool;
            for (const key in cfgPool) {
                if (cfgPool[key].reset != "day") {
                    continue;
                }
                info.buy[cfgPool[key].id] = 0;
            }
        }
        if (info.weekAt < this.ctx.state.newTime) {
            info.weekAt = game_1.default.getWeek0(this.ctx.state.newTime) + 7 * 86400;
            let cfgPool = gameCfg_1.default.shopClub.pool;
            for (const key in cfgPool) {
                if (cfgPool[key].reset != "week") {
                    continue;
                }
                info.buy[cfgPool[key].id] = 0;
            }
        }
        if (info.bugVer != "1") {
            info.bugVer = "1";
            let cfgPool = gameCfg_1.default.shopClub.pool;
            let actEquipModel = ActEquipModel_1.ActEquipModel.getInstance(this.ctx, this.id);
            let actEquip = await actEquipModel.getInfo();
            for (const key in cfgPool) {
                if (cfgPool[key].item[0] != 6) {
                    continue;
                }
                let _dc = cfgPool[key].id;
                let _hh = cfgPool[key].item[1].toString();
                let buwei1 = gameCfg_1.default.equipPifu.getItemCtx(this.ctx, _hh).buwei;
                if (actEquip.chuan[buwei1] == null) {
                    continue;
                }
                if (actEquip.chuan[buwei1].hhList[_hh] == null) {
                    delete info.buy[_dc];
                }
                else {
                    info.buy[_dc] = 1;
                }
            }
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
     *  购买
     */
    async buy(dc, count) {
        let info = await this.getInfo();
        let cfg = gameCfg_1.default.shopClub.getItem(dc);
        if (cfg == null) {
            this.ctx.throw("参数错误");
            return;
        }
        //获取玩家仙盟ID
        let actClubModel = ActClubModel_1.ActClubModel.getInstance(this.ctx, this.id);
        let clubId = await actClubModel.clickClub(true);
        //仙盟
        let sevClubModel = SevClubModel_1.SevClubModel.getInstance(this.ctx, clubId);
        let sevClubInfo = await sevClubModel.clickEmpty(true);
        ////club_shopOpenTime	{"count":6}	仙盟创建X小时后开启仙盟商店
        if ((sevClubInfo.createTime + tool_1.tool.mathcfg_count(this.ctx, "club_shopOpenTime") * 3600) > this.ctx.state.newTime) {
            this.ctx.throw("仙盟商店未开放");
        }
        //商品已开放 //获得工会BOSS最大击杀ID
        if (Number(cfg.bossId) >= sevClubInfo.boss.unlock) {
            this.ctx.throw("商品未解锁");
        }
        if (info.buy[dc] == null) {
            info.buy[dc] = 0;
        }
        info.buy[dc] += count;
        if (info.buy[dc] > cfg.limit) {
            this.ctx.throw("购买次数已达上限");
        }
        await this.ctx.state.master.subItem1([cfg.need[0], cfg.need[1], cfg.need[2] * count]);
        await this.ctx.state.master.addItem1([cfg.item[0], cfg.item[1], cfg.item[2] * count]);
        await this.update(info);
    }
}
exports.ActShopClubModel = ActShopClubModel;
//# sourceMappingURL=ActShopClubModel.js.map