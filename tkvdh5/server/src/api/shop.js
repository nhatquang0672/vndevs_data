"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tool_1 = require("../util/tool");
const ActShopItemModel_1 = require("../model/act/ActShopItemModel");
const ActShopCoinModel_1 = require("../model/act/ActShopCoinModel");
const ActShopDiaMondModel_1 = require("../model/act/ActShopDiaMondModel");
const ActShopClubModel_1 = require("../model/act/ActShopClubModel");
const ActShopWuqiModel_1 = require("../model/act/ActShopWuqiModel");
const ActShopFushouModel_1 = require("../model/act/ActShopFushouModel");
const ActShopMaoziModel_1 = require("../model/act/ActShopMaoziModel");
const ActShopYifuModel_1 = require("../model/act/ActShopYifuModel");
const gameCfg_1 = __importDefault(require("../../common/gameCfg"));
const ActShopPvwModel_1 = require("../model/act/ActShopPvwModel");
const ActShopFushiZModel_1 = require("../model/act/ActShopFushiZModel");
const ActShopFushiCModel_1 = require("../model/act/ActShopFushiCModel");
const ActShopFushiGModel_1 = require("../model/act/ActShopFushiGModel");
const hook_1 = require("../util/hook");
const setting_1 = __importDefault(require("../../src/crontab/setting"));
const HdTimeBenModel_1 = require("../../src/model/hd/HdTimeBenModel");
const HdTimeBen2Model_1 = require("../../src/model/hd/HdTimeBen2Model");
const Xys_1 = require("../../common/Xys");
const ActBaoShiModel_1 = require("../model/act/ActBaoShiModel");
const ActShopKind11Model_1 = require("../model/act/ActShopKind11Model");
const game_1 = __importDefault(require("../util/game"));
const router = new koa_router_1.default();
exports.router = router;
router.prefix('/shop');
/**
 * @api {post} /shop/kind11Buy 广告商店钻石购买
 * @apiName 广告商店钻石购买
 * @apiGroup shop
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (shop下发得token字段)
 * @apiParam {string} dc 档次
 */
router.all('/kind11Buy', async (ctx) => {
    ctx.state.apidesc = "商店-广告商店钻石购买";
    const { uuid, dc } = tool_1.tool.getParams(ctx);
    let actShopKind11Model = ActShopKind11Model_1.ActShopKind11Model.getInstance(ctx, uuid);
    await actShopKind11Model.buy(dc);
});
/**
 * @api {post} /shop/itemBuy 商店道具购买
 * @apiName 商店道具购买
 * @apiGroup shop
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (shop下发得token字段)
 * @apiParam {string} dc 档次
 * @apiParam {number} count 购买数量
 */
router.all('/itemBuy', async (ctx) => {
    ctx.state.apidesc = "商店-商店道具购买";
    const { uuid, dc, count } = tool_1.tool.getParams(ctx);
    let actShopItemModel = ActShopItemModel_1.ActShopItemModel.getInstance(ctx, uuid);
    await actShopItemModel.buy(dc, count);
});
/**
 * @api {post} /shop/coinBuy 商店金币购买
 * @apiName 商店金币购买
 * @apiGroup shop
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (shop下发得token字段)
 * @apiParam {string} dc 档次
 * @apiParam {number} count 购买数量
 */
router.all('/coinBuy', async (ctx) => {
    ctx.state.apidesc = "商店-商店金币购买";
    const { uuid, dc, count } = tool_1.tool.getParams(ctx);
    let actShopCoinModel = ActShopCoinModel_1.ActShopCoinModel.getInstance(ctx, uuid);
    await actShopCoinModel.buy(dc, count);
});
/**
 * @api {post} /shop/clubBuy 商店工会购买
 * @apiName 商店工会购买
 * @apiGroup shop
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (shop下发得token字段)
 * @apiParam {string} dc 档次
 * @apiParam {number} count 购买数量
 */
router.all('/clubBuy', async (ctx) => {
    ctx.state.apidesc = "商店-商店工会购买";
    const { uuid, dc, count } = tool_1.tool.getParams(ctx);
    if (count == null || count < 1) {
        ctx.throw("count参数错误");
    }
    let actShopClubModel = ActShopClubModel_1.ActShopClubModel.getInstance(ctx, uuid);
    await actShopClubModel.buy(dc, count);
});
/**
 * @api {post} /shop/pvwBuy 商店试炼购买
 * @apiName 商店试炼购买
 * @apiGroup shop
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (shop下发得token字段)
 * @apiParam {string} dc 档次
 * @apiParam {number} count 购买数量
 */
router.all('/pvwBuy', async (ctx) => {
    ctx.state.apidesc = "商店-商店试炼购买";
    const { uuid, dc, count } = tool_1.tool.getParams(ctx);
    if (count == null || count < 1) {
        ctx.throw("count参数错误");
    }
    let actShopPvwModel = ActShopPvwModel_1.ActShopPvwModel.getInstance(ctx, uuid);
    await actShopPvwModel.buy(dc, count);
});
/**
 * @api {post} /shop/wuqiBuy 皮肤商店武器购买
 * @apiName 皮肤商店武器购买
 * @apiGroup shop
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (shop下发得token字段)
 * @apiParam {string} dc 档次
 */
router.all('/wuqiBuy', async (ctx) => {
    ctx.state.apidesc = "商店-皮肤商店武器购买";
    const { uuid, dc } = tool_1.tool.getParams(ctx);
    let actShopWuqiModel = ActShopWuqiModel_1.ActShopWuqiModel.getInstance(ctx, uuid);
    await actShopWuqiModel.buy(dc);
});
/**
 * @api {post} /shop/fushouBuy 皮肤商店副手购买
 * @apiName 皮肤商店副手购买
 * @apiGroup shop
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (shop下发得token字段)
 * @apiParam {string} dc 档次
 */
router.all('/fushouBuy', async (ctx) => {
    ctx.state.apidesc = "商店-皮肤商店副手购买";
    const { uuid, dc } = tool_1.tool.getParams(ctx);
    let actShopFushouModel = ActShopFushouModel_1.ActShopFushouModel.getInstance(ctx, uuid);
    await actShopFushouModel.buy(dc);
});
/**
 * @api {post} /shop/maoziBuy 皮肤商店帽子购买
 * @apiName 皮肤商店帽子购买
 * @apiGroup shop
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (shop下发得token字段)
 * @apiParam {string} dc 档次
 */
router.all('/maoziBuy', async (ctx) => {
    ctx.state.apidesc = "商店-皮肤商店帽子购买";
    const { uuid, dc } = tool_1.tool.getParams(ctx);
    let actShopMaoziModel = ActShopMaoziModel_1.ActShopMaoziModel.getInstance(ctx, uuid);
    await actShopMaoziModel.buy(dc);
});
/**
 * @api {post} /shop/yifuBuy 皮肤商店衣服购买
 * @apiName 皮肤商店衣服购买
 * @apiGroup shop
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (shop下发得token字段)
 * @apiParam {string} dc 档次
 */
router.all('/yifuBuy', async (ctx) => {
    ctx.state.apidesc = "商店-皮肤商店衣服购买";
    const { uuid, dc } = tool_1.tool.getParams(ctx);
    let actShopYifuModel = ActShopYifuModel_1.ActShopYifuModel.getInstance(ctx, uuid);
    await actShopYifuModel.buy(dc);
});
/**
 * @api {post} /shop/baoshiBuy 宝石商店购买
 * @apiName 宝石商店购买
 * @apiGroup shop
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (shop下发得token字段)
 * @apiParam {string} dc 档次
 * @apiParam {number} count 购买数量
 */
router.all('/baoshiBuy', async (ctx) => {
    ctx.state.apidesc = "商店-宝石商店购买";
    const { uuid, dc, count } = tool_1.tool.getParams(ctx);
    let cfg = gameCfg_1.default.shopBaoshi.getItemCtx(ctx, dc);
    if (cfg == null || count == null) {
        ctx.throw("参数错误");
    }
    if (count < 1) {
        ctx.throw("购买数量错误");
    }
    await ctx.state.master.subItem1([cfg.need[0], cfg.need[1], cfg.need[2] * count]);
    let actBaoShiModel = ActBaoShiModel_1.ActBaoShiModel.getInstance(ctx, uuid);
    let actBaoShi = await actBaoShiModel.getInfo();
    for (let index = 0; index < count; index++) {
        if (dc == '1') {
            let cfgzj = gameCfg_1.default.baoshiZuojia.getItem((actBaoShi.zuojia + index + 1).toString());
            if (cfgzj != null) {
                await actBaoShiModel.addItem(cfgzj.itemId.toString());
                ctx.state.master.addLog(9, cfgzj.itemId, 1, 1);
                continue;
            }
        }
        let cfgItemMoney = gameCfg_1.default.itemMoney.getItemCtx(ctx, cfg.item[1].toString());
        if (cfgItemMoney.param.nums != null) {
            let getId = game_1.default.getRandArr(cfgItemMoney.param.nums, 1)[0];
            await actBaoShiModel.addItem(getId.toString());
            ctx.state.master.addLog(9, getId, 1, 1);
        }
    }
    if (dc == '1') {
        await actBaoShiModel.setZuoJia(count);
    }
    await hook_1.hookNote(ctx, "stoneGet", count);
    //触发礼包 如果购买的第第一档  并且下次不够钱的话
    if (dc == '1') {
        if (await ctx.state.master.subItem1(cfg.need, true) != true) {
            let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
            //触发礼包
            //活动 - 限时福利
            let cfgHdTimeBen = setting_1.default.getHuodong2(heid, "hdTimeBen");
            if (cfgHdTimeBen != null) {
                for (const hdcid in cfgHdTimeBen) {
                    let hdTimeBenModel = HdTimeBenModel_1.HdTimeBenModel.getInstance(ctx, uuid, hdcid);
                    await hdTimeBenModel.trip(Xys_1.TimeBenType.stone);
                }
            }
            //触发礼包 改版 列表版
            let cfgHdTimeBen2 = setting_1.default.getHuodong2(heid, "hdTimeBen2");
            if (cfgHdTimeBen2 != null) {
                for (const hdcid in cfgHdTimeBen2) {
                    let hdTimeBen2Model = HdTimeBen2Model_1.HdTimeBen2Model.getInstance(ctx, uuid, hdcid);
                    await hdTimeBen2Model.trip(Xys_1.TimeBen2Type.stone);
                }
            }
        }
    }
});
/**
 * @api {post} /shop/diaMondBuy 商店钻石购买
 * @apiName 商店钻石购买
 * @apiGroup shop
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (shop下发得token字段)
 * @apiParam {string} dc 档次
 */
router.all('/diaMondBuy', async (ctx) => {
    ctx.state.apidesc = "商店-商店钻石购买";
    const { uuid, dc } = tool_1.tool.getParams(ctx);
    let actShopDiaMondModel = ActShopDiaMondModel_1.ActShopDiaMondModel.getInstance(ctx, uuid);
    await actShopDiaMondModel.buy(dc);
});
/**
 * @api {post} /shop/fushiZBuy 符石商店钻石购买
 * @apiName 符石商店钻石购买
 * @apiGroup shop
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (shop下发得token字段)
 * @apiParam {string} dc 档次
 */
router.all('/fushiZBuy', async (ctx) => {
    ctx.state.apidesc = "商店-符石商店钻石购买";
    const { uuid, dc } = tool_1.tool.getParams(ctx);
    let actShopFushiZModel = ActShopFushiZModel_1.ActShopFushiZModel.getInstance(ctx, uuid);
    await actShopFushiZModel.buy(dc);
});
/**
 * @api {post} /shop/fushiCBuy 符石商店符石币购买
 * @apiName 符石商店符石币购买
 * @apiGroup shop
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (shop下发得token字段)
 * @apiParam {string} dc 档次
 */
router.all('/fushiCBuy', async (ctx) => {
    ctx.state.apidesc = "商店-符石商店符石币购买";
    const { uuid, dc } = tool_1.tool.getParams(ctx);
    let actShopFushiCModel = ActShopFushiCModel_1.ActShopFushiCModel.getInstance(ctx, uuid);
    await actShopFushiCModel.buy(dc);
});
/**
 * @api {post} /shop/fushiGBuy 符石商店符石礼包购买
 * @apiName 符石商店符石礼包购买
 * @apiGroup shop
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (shop下发得token字段)
 * @apiParam {string} dc 档次
 */
router.all('/fushiGBuy', async (ctx) => {
    ctx.state.apidesc = "商店-符石商店符石礼包购买";
    const { uuid, dc } = tool_1.tool.getParams(ctx);
    let actShopFushiGModel = ActShopFushiGModel_1.ActShopFushiGModel.getInstance(ctx, uuid);
    await actShopFushiGModel.buy(dc);
});
//# sourceMappingURL=shop.js.map