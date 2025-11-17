"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tool_1 = require("../util/tool");
const HdNewModel_1 = require("../model/hd/HdNewModel");
const HdSpeGiftModel_1 = require("../model/hd/HdSpeGiftModel");
const HdGrowthFundModel_1 = require("../model/hd/HdGrowthFundModel");
const HdSignGiftModel_1 = require("../model/hd/HdSignGiftModel");
const HdPriCardModel_1 = require("../model/hd/HdPriCardModel");
const HdTimeBenModel_1 = require("../model/hd/HdTimeBenModel");
const HdTimeBen2Model_1 = require("../model/hd/HdTimeBen2Model");
const HdWelChestModel_1 = require("../model/hd/HdWelChestModel");
const setting_1 = __importDefault(require("../crontab/setting"));
const HdTimeActModel_1 = require("../model/hd/HdTimeActModel");
const Xys_1 = require("../../common/Xys");
const HdLianchongModel_1 = require("../model/hd/HdLianchongModel");
const HdKaifuModel_1 = require("../model/hd/HdKaifuModel");
const HdEquipShopModel_1 = require("../model/hd/HdEquipShopModel");
const HdChouModel_1 = require("../model/hd/HdChouModel");
const HdJiYuanModel_1 = require("../model/hd/HdJiYuanModel");
const HdJuBaoPenModel_1 = require("../model/hd/HdJuBaoPenModel");
const HdQiYuanModel_1 = require("../model/hd/HdQiYuanModel");
const HdHuanJingModel_1 = require("../model/hd/HdHuanJingModel");
const HdXinMoModel_1 = require("../model/hd/HdXinMoModel");
const HdHefuqdModel_1 = require("../model/hd/HdHefuqdModel");
const HdChumoModel_1 = require("../model/hd/HdChumoModel");
const RdsUserModel_1 = require("../model/redis/RdsUserModel");
const HdZixuanModel_1 = require("../model/hd/HdZixuanModel");
const HdLunHuiModel_1 = require("../model/hd/HdLunHuiModel");
const HdDayTeHuiModel_1 = require("../model/hd/HdDayTeHuiModel");
const HdChargeDays_1 = require("../model/hd/HdChargeDays");
const HdChargeTotal_1 = require("../model/hd/HdChargeTotal");
const HdNewJiYuanModel_1 = require("../model/hd/HdNewJiYuanModel");
const HdDouLuoModel_1 = require("../model/hd/HdDouLuoModel");
const ActDouLuoFightModel_1 = require("../model/act/ActDouLuoFightModel");
const HdDouLuoLogModel_1 = require("../model/hd/HdDouLuoLogModel");
const HdTianGongModel_1 = require("../model/hd/HdTianGongModel");
const HdYueGongModel_1 = require("../model/hd/HdYueGongModel");
const HdHuaLianModel_1 = require("../model/hd/HdHuaLianModel");
const HdShanheModel_1 = require("../model/hd/HdShanheModel");
const HdChongYangModel_1 = require("../model/hd/HdChongYangModel");
const HdChongBangModel_1 = require("../model/hd/HdChongBangModel");
const HdDayTeJiaModel_1 = require("../model/hd/HdDayTeJiaModel");
const HdMonkeyModel_1 = require("../model/hd/HdMonkeyModel");
const SevMonkeyModel_1 = require("../model/sev/SevMonkeyModel");
const HdDengShenBangModel_1 = require("../model/hd/HdDengShenBangModel");
const ActDengShenBangFightModel_1 = require("../model/act/ActDengShenBangFightModel");
const HdDengShenBangLogModel_1 = require("../model/hd/HdDengShenBangLogModel");
const router = new koa_router_1.default();
exports.router = router;
router.prefix("/huodong");
/**
 * @api {post} /huodong/newRwdInto 进入新人礼包
 * @apiName 进入新人礼包
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 *
 */
router.all("/newRwdInto", async (ctx) => {
    ctx.state.apidesc = "活动-进入新人礼包";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdNewModel = HdNewModel_1.HdNewModel.getInstance(ctx, uuid, hdcid);
    await hdNewModel.setRed(0);
    await hdNewModel.hdChuFaMd();
});
/**
 * @api {post} /huodong/newRwd 新人礼包领取奖励
 * @apiName 新人礼包领取奖励
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {number} isNew 是不是换成新的
 *
 */
router.all("/newRwd", async (ctx) => {
    ctx.state.apidesc = "活动-新人礼包领取奖励";
    const { uuid, hdcid, isNew } = tool_1.tool.getParams(ctx);
    let hdNewModel = HdNewModel_1.HdNewModel.getInstance(ctx, uuid, hdcid);
    await hdNewModel.rwd(isNew);
});
/**
 * @api {post} /huodong/speGiftInfo 进入特惠礼包
 * @apiName 进入特惠礼包
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 *
 */
router.all("/speGiftInfo", async (ctx) => {
    ctx.state.apidesc = "活动-进入特惠礼包";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdSpeGiftModel = HdSpeGiftModel_1.HdSpeGiftModel.getInstance(ctx, uuid, hdcid);
    await hdSpeGiftModel.hdChuFaMd();
});
/**
 * @api {post} /huodong/speGiftBuy 特惠礼包购买
 * @apiName 特惠礼包
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc 档次
 *
 */
router.all("/speGiftBuy", async (ctx) => {
    ctx.state.apidesc = "活动-特惠礼包购买";
    const { uuid, hdcid, dc } = tool_1.tool.getParams(ctx);
    let hdSpeGiftModel = HdSpeGiftModel_1.HdSpeGiftModel.getInstance(ctx, uuid, hdcid);
    await hdSpeGiftModel.buy(dc);
});
/**
 * @api {post} /huodong/growthFundInto 进入成长基金
 * @apiName 进入成长基金
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 *
 */
router.all("/growthFundInto", async (ctx) => {
    ctx.state.apidesc = "活动-进入成长基金";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdGrowthFundModel = HdGrowthFundModel_1.HdGrowthFundModel.getInstance(ctx, uuid, hdcid);
    await hdGrowthFundModel.hdChuFaMd();
});
/**
 * @api {post} /huodong/growthFundRwd 成长基金领取
 * @apiName 成长基金领取
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc 档次
 * @apiParam {string} type free免费奖励,grwd基金奖励,all两档都领
 * @apiParam {number} isNew 是不是换成新的
 *
 */
router.all("/growthFundRwd", async (ctx) => {
    ctx.state.apidesc = "活动-成长基金领取";
    const { uuid, hdcid, dc, type, isNew } = tool_1.tool.getParams(ctx);
    let hdGrowthFundModel = HdGrowthFundModel_1.HdGrowthFundModel.getInstance(ctx, uuid, hdcid);
    await hdGrowthFundModel.rwd(dc, type, isNew);
});
/**
 * @api {post} /huodong/growthFundRwdAll 成长基金一键领取
 * @apiName 成长基金一键领取
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {keyValue} isNew 装备ID对应新旧
 *
 */
router.all("/growthFundRwdAll", async (ctx) => {
    ctx.throw("api已弃用");
    const { uuid, hdcid, isNew } = tool_1.tool.getParams(ctx);
    let hdGrowthFundModel = HdGrowthFundModel_1.HdGrowthFundModel.getInstance(ctx, uuid, hdcid);
    await hdGrowthFundModel.rwdAll(isNew);
});
/**
 * @api {post} /huodong/hdSignGift 签到
 * @apiName 签到
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} days 天数
 *
 */
router.all("/hdSignGift", async (ctx) => {
    ctx.state.apidesc = "活动-签到";
    const { uuid, hdcid, days } = tool_1.tool.getParams(ctx);
    let hdSignGiftModel = HdSignGiftModel_1.HdSignGiftModel.getInstance(ctx, uuid, hdcid);
    await hdSignGiftModel.rwd(days);
});
/**
 * @api {post} /huodong/hdPriCardInto 进入特权
 * @apiName 特权
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all("/hdPriCardInto", async (ctx) => {
    ctx.state.apidesc = "活动-进入特权";
    const { uuid } = tool_1.tool.getParams(ctx);
    let hdPriCardModel1 = HdPriCardModel_1.HdPriCardModel.getInstance(ctx, uuid, Xys_1.PriCardType.moon);
    await hdPriCardModel1.hdChuFaMd();
    let hdPriCardModel2 = HdPriCardModel_1.HdPriCardModel.getInstance(ctx, uuid, Xys_1.PriCardType.fever);
    await hdPriCardModel2.hdChuFaMd();
});
/**
 * @api {post} /huodong/hdPriCard 特权
 * @apiName 特权
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID枚举PriCardType
 *
 */
router.all("/hdPriCard", async (ctx) => {
    ctx.state.apidesc = "活动-特权";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdPriCardModel = HdPriCardModel_1.HdPriCardModel.getInstance(ctx, uuid, hdcid);
    await hdPriCardModel.rwd();
});
/**
 * @api {post} /huodong/hdTimeBen 限时福利_通用触发钩子
 * @apiName 限时福利_通用触发钩子
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} type 礼包类型Xys.TimeBenType
 *
 */
router.all("/hdTimeBen", async (ctx) => {
    ctx.state.apidesc = "活动-限时福利_通用触发钩子";
    const { uuid, hdcid, type } = tool_1.tool.getParams(ctx);
    let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
    //活动 - 限时福利
    let cfgHdTimeBen = setting_1.default.getHuodong2(heid, "hdTimeBen");
    if (cfgHdTimeBen != null) {
        for (const hdcid in cfgHdTimeBen) {
            let hdTimeBenModel = HdTimeBenModel_1.HdTimeBenModel.getInstance(ctx, uuid, hdcid);
            await hdTimeBenModel.trip(type);
        }
    }
    //活动 - 限时福利2 改版列表
    let cfgHdTimeBen2 = setting_1.default.getHuodong2(heid, "hdTimeBen2");
    if (cfgHdTimeBen2 != null) {
        for (const hdcid in cfgHdTimeBen2) {
            let hdTimeBe2nModel = HdTimeBen2Model_1.HdTimeBen2Model.getInstance(ctx, uuid, hdcid);
            await hdTimeBe2nModel.trip(type);
        }
    }
});
/**
 * @api {post} /huodong/hdWelChest 福利宝箱花钱领取
 * @apiName 福利宝箱花钱领取
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID枚举PriCardType
 *
 */
router.all("/hdWelChest", async (ctx) => {
    ctx.state.apidesc = "活动-福利宝箱花钱领取";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdWelChestModel = HdWelChestModel_1.HdWelChestModel.getInstance(ctx, uuid, hdcid);
    await hdWelChestModel.rwd(0);
});
/**
 * @api {post} /huodong/hdTimeAct 限时活动任务
 * @apiName 限时活动 任务
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID枚举PriCardType
 * @apiParam {string} id 领取档次
 *
 */
router.all("/hdTimeAct", async (ctx) => {
    ctx.state.apidesc = "活动-限时活动任务";
    const { uuid, hdcid, id } = tool_1.tool.getParams(ctx);
    let hdTimeActModel = HdTimeActModel_1.HdTimeActModel.getInstance(ctx, uuid, hdcid);
    await hdTimeActModel.rwd(id);
});
/**
 * @api {post} /huodong/hdlcInto 进入连充活动
 * @apiName 进入连充活动
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 *
 */
router.all("/hdlcInto", async (ctx) => {
    ctx.state.apidesc = "活动-进入连充活动";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdLianchongModel = HdLianchongModel_1.HdLianchongModel.getInstance(ctx, uuid, hdcid);
    await hdLianchongModel.hdlcInto();
});
/**
 * @api {post} /huodong/hdlcRwd 连充活动领取档次奖励
 * @apiName 连充活动领取档次奖励
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc list的下标ID
 * @apiParam {number} isNew 是不是换成新的
 *
 */
router.all("/hdlcRwd", async (ctx) => {
    ctx.state.apidesc = "活动-连充活动领取档次奖励";
    const { uuid, hdcid, dc, isNew } = tool_1.tool.getParams(ctx);
    let hdLianchongModel = HdLianchongModel_1.HdLianchongModel.getInstance(ctx, uuid, hdcid);
    await hdLianchongModel.hdlcRwd(dc, isNew);
});
/**
 * @api {post} /huodong/hdKfInto 进入开服活动
 * @apiName 进入开服活动
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 *
 */
router.all("/hdKfInto", async (ctx) => {
    ctx.state.apidesc = "活动-进入开服活动";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdKaifugModel = HdKaifuModel_1.HdKaifugModel.getInstance(ctx, uuid, hdcid);
    await hdKaifugModel.backData();
});
/**
 * @api {post} /huodong/hdKfScore 开服活动领取积分奖励
 * @apiName 开服活动领取积分奖励
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc 档次
 *
 */
router.all("/hdKfScore", async (ctx) => {
    ctx.state.apidesc = "活动-开服活动领取积分奖励";
    const { uuid, hdcid, dc } = tool_1.tool.getParams(ctx);
    let hdKaifugModel = HdKaifuModel_1.HdKaifugModel.getInstance(ctx, uuid, hdcid);
    await hdKaifugModel.hdKfScore(dc);
});
/**
 * @api {post} /huodong/hdKfDh 开服活动兑换
 * @apiName 开服活动兑换
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc 档次
 *
 */
router.all("/hdKfDh", async (ctx) => {
    ctx.state.apidesc = "活动-开服活动兑换";
    const { uuid, hdcid, dc } = tool_1.tool.getParams(ctx);
    let hdKaifugModel = HdKaifuModel_1.HdKaifugModel.getInstance(ctx, uuid, hdcid);
    await hdKaifugModel.hdKfDh(dc);
});
/**
 * @api {post} /huodong/hdKfTask 开服领取任务奖励
 * @apiName 开服领取任务奖励
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc 档次
 *
 */
router.all("/hdKfTask", async (ctx) => {
    ctx.state.apidesc = "活动-开服领取任务奖励";
    const { uuid, hdcid, dc } = tool_1.tool.getParams(ctx);
    let hdKaifugModel = HdKaifuModel_1.HdKaifugModel.getInstance(ctx, uuid, hdcid);
    await hdKaifugModel.hdKfTask(dc);
});
/**
 * @api {post} /huodong/hdKfGift 领取礼包奖励
 * @apiName 领取礼包奖励
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc 档次
 *
 */
router.all("/hdKfGift", async (ctx) => {
    ctx.state.apidesc = "活动-开服领取礼包奖励";
    const { uuid, hdcid, dc } = tool_1.tool.getParams(ctx);
    let hdKaifugModel = HdKaifuModel_1.HdKaifugModel.getInstance(ctx, uuid, hdcid);
    await hdKaifugModel.hdKfGift(dc);
});
/**
 * @api {post} /huodong/hdEsInto 进入装备商人
 * @apiName 进入装备商人
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 *
 */
router.all("/hdEsInto", async (ctx) => {
    ctx.state.apidesc = "活动-进入装备商人";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdEquipShopModel = HdEquipShopModel_1.HdEquipShopModel.getInstance(ctx, uuid, hdcid);
    await hdEquipShopModel.into();
});
/**
 * @api {post} /huodong/hdEsRwd 装备商人领取奖励
 * @apiName 装备商人领取奖励
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 *
 */
router.all("/hdEsRwd", async (ctx) => {
    ctx.state.apidesc = "活动-装备商人领取奖励";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdEquipShopModel = HdEquipShopModel_1.HdEquipShopModel.getInstance(ctx, uuid, hdcid);
    await hdEquipShopModel.rwd();
});
/**
 * @api {post} /huodong/hdCinto 进入九龙秘宝
 * @apiName 进入九龙秘宝
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 *
 */
router.all("/hdCinto", async (ctx) => {
    ctx.state.apidesc = "活动-进入九龙秘宝";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdChouModel = HdChouModel_1.HdChouModel.getInstance(ctx, uuid, hdcid);
    await hdChouModel.backData_u(["data", "red", "outf"]);
});
/**
 * @api {post} /huodong/hdCchou 九龙秘宝抽卡
 * @apiName 九龙秘宝抽卡
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {number} num 一次抽几个
 *
 */
router.all("/hdCchou", async (ctx) => {
    ctx.state.apidesc = "活动-九龙秘宝抽卡";
    const { uuid, hdcid, num } = tool_1.tool.getParams(ctx);
    num == null ? 1 : num;
    let hdChouModel = HdChouModel_1.HdChouModel.getInstance(ctx, uuid, hdcid);
    await hdChouModel.chou(num);
});
/**
 * @api {post} /huodong/hdCdelPhRed 九龙秘宝消除排行红点
 * @apiName 九龙秘宝消除排行红点
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 *
 */
router.all("/hdCdelPhRed", async (ctx) => {
    ctx.state.apidesc = "活动-九龙秘宝消除排行红点";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdChouModel = HdChouModel_1.HdChouModel.getInstance(ctx, uuid, hdcid);
    await hdChouModel.delPhRed();
});
/**
 * @api {post} /huodong/hdcGift 九龙秘宝免费领取礼包
 * @apiName 九龙秘宝免费领取礼包
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc 档次
 *
 */
router.all("/hdcGift", async (ctx) => {
    ctx.state.apidesc = "活动-九龙秘宝免费领取礼包";
    const { uuid, hdcid, dc } = tool_1.tool.getParams(ctx);
    let hdChouModel = HdChouModel_1.HdChouModel.getInstance(ctx, uuid, hdcid);
    await hdChouModel.hdcGift(dc);
});
/**
 * @api {post} /huodong/hdcScore 领取积分奖励
 * @apiName 领取积分奖励
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc 档次
 *
 */
router.all("/hdcScore", async (ctx) => {
    ctx.state.apidesc = "活动-领取积分奖励";
    const { uuid, hdcid, dc } = tool_1.tool.getParams(ctx);
    let hdChouModel = HdChouModel_1.HdChouModel.getInstance(ctx, uuid, hdcid);
    await hdChouModel.hdcScore(dc);
});
/**
 * @api {post} /huodong/jyInto 活动机缘进入
 * @apiName 活动机缘进入
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 *
 */
router.all("/jyInto", async (ctx) => {
    ctx.state.apidesc = "活动-活动机缘进入";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdJiYuanModel = HdJiYuanModel_1.HdJiYuanModel.getInstance(ctx, uuid, hdcid);
    await hdJiYuanModel.backData();
});
/**
 * @api {post} /huodong/jyLvRwd 活动机缘领取等级奖励
 * @apiName 活动机缘领取等级奖励
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} level 档次(等级)
 * @apiParam {string} type  pt普通xy需要all=pt+xy
 *
 */
router.all("/jyLvRwd", async (ctx) => {
    ctx.state.apidesc = "活动-活动机缘领取等级奖励";
    const { uuid, hdcid, level, type } = tool_1.tool.getParams(ctx);
    let hdJiYuanModel = HdJiYuanModel_1.HdJiYuanModel.getInstance(ctx, uuid, hdcid);
    await hdJiYuanModel.jyLvRwd(level, type);
});
/**
 * @api {post} /huodong/jyLvBuy 活动机缘购买等级
 * @apiName 活动机缘购买等级
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {number} maxLv 购买到哪一个等级
 *
 */
router.all("/jyLvBuy", async (ctx) => {
    ctx.state.apidesc = "活动-活动机缘购买等级";
    const { uuid, hdcid, maxLv } = tool_1.tool.getParams(ctx);
    let hdJiYuanModel = HdJiYuanModel_1.HdJiYuanModel.getInstance(ctx, uuid, hdcid);
    await hdJiYuanModel.jyLvBuy(maxLv);
});
/**
 * @api {post} /huodong/jyTaskRwd 活动机缘领取任务奖励
 * @apiName 活动机缘领取任务奖励
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc 档次
 *
 */
router.all("/jyTaskRwd", async (ctx) => {
    ctx.state.apidesc = "活动-活动机缘领取任务奖励";
    const { uuid, hdcid, dc } = tool_1.tool.getParams(ctx);
    let hdJiYuanModel = HdJiYuanModel_1.HdJiYuanModel.getInstance(ctx, uuid, hdcid);
    await hdJiYuanModel.jyTaskRwd(dc);
});
/**
 * @api {post} /huodong/jyFreeGift 活动机缘领取免费礼包
 * @apiName 活动机缘领取免费礼包
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 *
 */
router.all("/jyFreeGift", async (ctx) => {
    ctx.state.apidesc = "活动-活动机缘领取免费礼包";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdJiYuanModel = HdJiYuanModel_1.HdJiYuanModel.getInstance(ctx, uuid, hdcid);
    await hdJiYuanModel.jyFreeGift();
});
/**
 * @api {post} /huodong/jyGiftRwd 活动机缘领取礼包额外奖励
 * @apiName 活动机缘领取礼包额外奖励
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 *
 */
router.all("/jyGiftRwd", async (ctx) => {
    ctx.state.apidesc = "活动-活动机缘领取礼包额外奖励";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdJiYuanModel = HdJiYuanModel_1.HdJiYuanModel.getInstance(ctx, uuid, hdcid);
    await hdJiYuanModel.jyGiftRwd();
});
/**
 * @api {post} /huodong/jbpTong 领取铜奖励
 * @apiName 领取铜奖励
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 *
 */
router.all("/jbpTong", async (ctx) => {
    ctx.state.apidesc = "活动-领取铜奖励";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdJuBaoPenModel = HdJuBaoPenModel_1.HdJuBaoPenModel.getInstance(ctx, uuid, hdcid);
    await hdJuBaoPenModel.tongRwd();
});
/**
 * @api {post} /huodong/qiYuanInto 灵兽起源:进入
 * @apiName 灵兽起源:进入
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 */
router.all("/qiYuanInto", async (ctx) => {
    ctx.state.apidesc = "活动-灵兽起源:进入";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdQiYuanModel = HdQiYuanModel_1.HdQiYuanModel.getInstance(ctx, uuid, hdcid);
    await hdQiYuanModel.backData();
});
/**
 * @api {post} /huodong/qiYuanTask1 灵兽起源:活跃任务领奖
 * @apiName 灵兽起源:活跃任务领奖
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} id 任务ID
 */
router.all("/qiYuanTask1", async (ctx) => {
    ctx.state.apidesc = "活动-灵兽起源:活跃任务领奖";
    const { uuid, hdcid, id } = tool_1.tool.getParams(ctx);
    let hdQiYuanModel = HdQiYuanModel_1.HdQiYuanModel.getInstance(ctx, uuid, hdcid);
    await hdQiYuanModel.task1Rwd(id);
});
/**
 * @api {post} /huodong/qiYuanTask2 灵兽起源:探索任务领奖
 * @apiName 灵兽起源:探索任务领奖
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} id 任务ID
 */
router.all("/qiYuanTask2", async (ctx) => {
    ctx.state.apidesc = "活动-灵兽起源:探索任务领奖";
    const { uuid, hdcid, id } = tool_1.tool.getParams(ctx);
    let hdQiYuanModel = HdQiYuanModel_1.HdQiYuanModel.getInstance(ctx, uuid, hdcid);
    await hdQiYuanModel.task2Rwd(id);
});
/**
 * @api {post} /huodong/qiYuanTreeOpen 灵兽起源:树_开格子
 * @apiName 灵兽起源:树_开格子
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {number} lid 行号
 */
router.all("/qiYuanTreeOpen", async (ctx) => {
    ctx.state.apidesc = "活动-灵兽起源:树_开格子";
    const { uuid, hdcid, lid } = tool_1.tool.getParams(ctx);
    let hdQiYuanModel = HdQiYuanModel_1.HdQiYuanModel.getInstance(ctx, uuid, hdcid);
    await hdQiYuanModel.treeOpen(lid);
});
/**
 * @api {post} /huodong/qiYuanTreePush 灵兽起源:树_放兽灵
 * @apiName 灵兽起源:树_放兽灵
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {number} lid 行ID
 * @apiParam {number} gz 格子ID
 * @apiParam {string} gzid 阵法格子ID
 */
router.all("/qiYuanTreePush", async (ctx) => {
    ctx.state.apidesc = "活动-灵兽起源:树_放兽灵";
    const { uuid, hdcid, lid, gz, gzid } = tool_1.tool.getParams(ctx);
    let hdQiYuanModel = HdQiYuanModel_1.HdQiYuanModel.getInstance(ctx, uuid, hdcid);
    await hdQiYuanModel.treePush(lid, gz, gzid);
});
/**
 * @api {post} /huodong/qiYuanTreeRwd 灵兽起源:树_领取挂机奖励
 * @apiName 灵兽起源:树_领取挂机奖励
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 */
router.all("/qiYuanTreeRwd", async (ctx) => {
    ctx.state.apidesc = "活动-灵兽起源:树_领取挂机奖励";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdQiYuanModel = HdQiYuanModel_1.HdQiYuanModel.getInstance(ctx, uuid, hdcid);
    await hdQiYuanModel.treeRwd();
});
/**
 * @api {post} /huodong/qiYuanTreeQuick 灵兽起源:树_快速挂机
 * @apiName 灵兽起源:树_快速挂机
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 */
router.all("/qiYuanTreeQuick", async (ctx) => {
    ctx.state.apidesc = "活动-灵兽起源:树_快速挂机";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdQiYuanModel = HdQiYuanModel_1.HdQiYuanModel.getInstance(ctx, uuid, hdcid);
    await hdQiYuanModel.treeQuick();
});
/**
 * @api {post} /huodong/qiYuanRound 灵兽起源:转盘_抽奖
 * @apiName 灵兽起源:转盘_抽奖
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 */
router.all("/qiYuanRound", async (ctx) => {
    ctx.state.apidesc = "活动-灵兽起源:转盘_抽奖";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdQiYuanModel = HdQiYuanModel_1.HdQiYuanModel.getInstance(ctx, uuid, hdcid);
    await hdQiYuanModel.round();
});
/**
 * @api {post} /huodong/qiYuanPayFree 灵兽起源: 免费充值领取
 * @apiName 灵兽起源: 免费充值领取
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} id 档次
 */
router.all("/qiYuanPayFree", async (ctx) => {
    ctx.state.apidesc = "活动-灵兽起源:免费充值领取";
    const { uuid, hdcid, id } = tool_1.tool.getParams(ctx);
    let hdQiYuanModel = HdQiYuanModel_1.HdQiYuanModel.getInstance(ctx, uuid, hdcid);
    await hdQiYuanModel.gitFree(id);
});
/**
 * @api {post} /huodong/huanJingInto 鱼灵幻境:进入
 * @apiName 鱼灵幻境:进入
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 */
router.all("/huanJingInto", async (ctx) => {
    ctx.state.apidesc = "活动-鱼灵幻境:进入";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdHuanJingModel = HdHuanJingModel_1.HdHuanJingModel.getInstance(ctx, uuid, hdcid);
    await hdHuanJingModel.backData();
});
/**
 * @api {post} /huodong/huanJingTask 鱼灵幻境: 任务领取
 * @apiName 鱼灵幻境: 任务领取
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc1 任务ID
 * @apiParam {string} dc2 任务子档次
 */
router.all("/huanJingTask", async (ctx) => {
    ctx.state.apidesc = "活动-鱼灵幻境:任务领取";
    const { uuid, hdcid, dc1, dc2 } = tool_1.tool.getParams(ctx);
    let hdHuanJingModel = HdHuanJingModel_1.HdHuanJingModel.getInstance(ctx, uuid, hdcid);
    await hdHuanJingModel.taskRwd(dc1, dc2);
});
/**
 * @api {post} /huodong/huanJingChou 鱼灵幻境: 抽奖
 * @apiName 鱼灵幻境: 抽奖
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {number} count 次数
 */
router.all("/huanJingChou", async (ctx) => {
    ctx.state.apidesc = "活动-鱼灵幻境:抽奖";
    const { uuid, hdcid, count } = tool_1.tool.getParams(ctx);
    let hdHuanJingModel = HdHuanJingModel_1.HdHuanJingModel.getInstance(ctx, uuid, hdcid);
    await hdHuanJingModel.chou(count);
});
/**
 * @api {post} /huodong/huanJingScore 鱼灵幻境: 积分奖励
 * @apiName 鱼灵幻境: 积分奖励
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} id 档次
 */
router.all("/huanJingScore", async (ctx) => {
    ctx.state.apidesc = "活动-鱼灵幻境:积分奖励";
    const { uuid, hdcid, id } = tool_1.tool.getParams(ctx);
    let hdHuanJingModel = HdHuanJingModel_1.HdHuanJingModel.getInstance(ctx, uuid, hdcid);
    await hdHuanJingModel.scoreRwd(id);
});
/**
 * @api {post} /huodong/huanJingpayRwd 鱼灵幻境: 充值积分奖励
 * @apiName 鱼灵幻境: 充值积分奖励
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} id 档次
 */
router.all("/huanJingpayRwd", async (ctx) => {
    ctx.state.apidesc = "活动-鱼灵幻境:充值积分奖励";
    const { uuid, hdcid, id } = tool_1.tool.getParams(ctx);
    let hdHuanJingModel = HdHuanJingModel_1.HdHuanJingModel.getInstance(ctx, uuid, hdcid);
    await hdHuanJingModel.payRwd(id);
});
/**
 * @api {post} /huodong/huanJingPayFree 鱼灵幻境: 免费充值领取
 * @apiName 鱼灵幻境: 免费充值领取
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} id 档次
 */
router.all("/huanJingPayFree", async (ctx) => {
    ctx.state.apidesc = "活动-鱼灵幻境:免费充值领取";
    const { uuid, hdcid, id } = tool_1.tool.getParams(ctx);
    let hdHuanJingModel = HdHuanJingModel_1.HdHuanJingModel.getInstance(ctx, uuid, hdcid);
    await hdHuanJingModel.gitFree(id);
});
/**
 * @api {post} /huodong/hdXinMoInto 破除心魔:进入
 * @apiName 破除心魔:进入
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 */
router.all("/hdXinMoInto", async (ctx) => {
    ctx.state.apidesc = "活动-破除心魔:进入";
    const { uuid, hdcid, id } = tool_1.tool.getParams(ctx);
    let hdXinMoModel = HdXinMoModel_1.HdXinMoModel.getInstance(ctx, uuid, hdcid);
    await hdXinMoModel.backData();
    // //排行也一起下发
    // let hdCfg_hdXinMo = gameMethod.objCopy(Setting.getHuodong3(heid,"hdXinMo",_hdcid))
    // if(hdCfg_hdXinMo == null){
    //     ctx.throw("活动未开启")
    // }
    // let rdsUserModel_rdsHdXinMo = new RdsUserModel(kid, _hdcid, heid, hdCfg_hdXinMo.info.id);
    // await rdsUserModel_rdsHdXinMo.backData_u(ctx, _lastId, _lastId + 19);
    // await rdsUserModel_rdsHdXinMo.backData_my(ctx, uuid);
});
/**
 * @api {post} /huodong/hdXinMoTask 破除心魔: 任务奖励
 * @apiName 破除心魔: 任务奖励
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} id 档次
 */
router.all("/hdXinMoTask", async (ctx) => {
    ctx.state.apidesc = "活动-破除心魔:任务奖励";
    const { uuid, hdcid, id } = tool_1.tool.getParams(ctx);
    let hdXinMoModel = HdXinMoModel_1.HdXinMoModel.getInstance(ctx, uuid, hdcid);
    await hdXinMoModel.taskRwd(id);
});
/**
 * @api {post} /huodong/hdXinMoRst 破除心魔: 刷新心魔
 * @apiName 破除心魔: 刷新心魔
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 */
router.all("/hdXinMoRst", async (ctx) => {
    ctx.state.apidesc = "活动-破除心魔:刷新心魔";
    const { uuid, hdcid, id } = tool_1.tool.getParams(ctx);
    let hdXinMoModel = HdXinMoModel_1.HdXinMoModel.getInstance(ctx, uuid, hdcid);
    await hdXinMoModel.rstXinMo();
});
/**
 * @api {post} /huodong/hdXinMoKill 破除心魔: 杀心魔
 * @apiName 破除心魔: 杀心魔
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} xmlid 心魔序号
 * @apiParam {string[]} gzids 宠物下标组
 */
router.all("/hdXinMoKill", async (ctx) => {
    ctx.state.apidesc = "活动-破除心魔:杀心魔";
    const { uuid, hdcid, xmlid, gzids } = tool_1.tool.getParams(ctx);
    let hdXinMoModel = HdXinMoModel_1.HdXinMoModel.getInstance(ctx, uuid, hdcid);
    await hdXinMoModel.killXinMo(xmlid, gzids);
});
/**
 * @api {post} /huodong/hdXinMopayRwd 破除心魔: 充值积分奖励
 * @apiName 破除心魔: 充值积分奖励
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} id 档次
 */
router.all("/hdXinMopayRwd", async (ctx) => {
    ctx.state.apidesc = "活动-破除心魔:充值积分奖励";
    const { uuid, hdcid, id } = tool_1.tool.getParams(ctx);
    let hdXinMoModel = HdXinMoModel_1.HdXinMoModel.getInstance(ctx, uuid, hdcid);
    await hdXinMoModel.payRwd(id);
});
/**
 * @api {post} /huodong/hdXinMoPayFree 破除心魔: 免费充值领取
 * @apiName 破除心魔: 免费充值领取
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} id 档次
 */
router.all("/hdXinMoPayFree", async (ctx) => {
    ctx.state.apidesc = "活动-破除心魔:免费充值领取";
    const { uuid, hdcid, id } = tool_1.tool.getParams(ctx);
    let hdXinMoModel = HdXinMoModel_1.HdXinMoModel.getInstance(ctx, uuid, hdcid);
    await hdXinMoModel.gitFree(id);
});
/**
 * @api {post} /huodong/hdHfqdInto 进入合服庆典
 * @apiName 进入合服庆典
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 */
router.all("/hdHfqdInto", async (ctx) => {
    ctx.state.apidesc = "活动-进入合服庆典";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdHefuqdModel = HdHefuqdModel_1.HdHefuqdModel.getInstance(ctx, uuid, hdcid);
    await hdHefuqdModel.backData();
});
/**
 * @api {post} /huodong/hdHfqdSign 合服庆典领取签到奖励
 * @apiName 合服庆典领取签到奖励
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc 签到奖励档次
 */
router.all("/hdHfqdSign", async (ctx) => {
    ctx.state.apidesc = "活动-合服庆典领取签到奖励";
    const { uuid, hdcid, dc } = tool_1.tool.getParams(ctx);
    let hdHefuqdModel = HdHefuqdModel_1.HdHefuqdModel.getInstance(ctx, uuid, hdcid);
    await hdHefuqdModel.signRwd(dc);
});
/**
 * @api {post} /huodong/hdHfqdTask 合服庆典领取任务奖励
 * @apiName 合服庆典领取任务奖励
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc 档次
 */
router.all("/hdHfqdTask", async (ctx) => {
    ctx.state.apidesc = "活动-合服庆典领取任务奖励";
    const { uuid, hdcid, dc } = tool_1.tool.getParams(ctx);
    let hdHefuqdModel = HdHefuqdModel_1.HdHefuqdModel.getInstance(ctx, uuid, hdcid);
    await hdHefuqdModel.taskRwd(dc);
});
/**
 * @api {post} /huodong/hdHfqdTehui 合服庆典领取特惠奖励
 * @apiName 合服庆典领取特惠奖励
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc 特惠档次
 */
router.all("/hdHfqdTehui", async (ctx) => {
    ctx.state.apidesc = "活动-合服庆典领取特惠奖励";
    const { uuid, hdcid, dc } = tool_1.tool.getParams(ctx);
    let hdHefuqdModel = HdHefuqdModel_1.HdHefuqdModel.getInstance(ctx, uuid, hdcid);
    await hdHefuqdModel.tehuiRwd(dc);
});
/**
 * @api {post} /huodong/hdHfqdShopRef 合服庆典商店刷新
 * @apiName 合服庆典商店刷新
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 */
router.all("/hdHfqdShopRef", async (ctx) => {
    ctx.state.apidesc = "活动-合服庆典商店刷新";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdHefuqdModel = HdHefuqdModel_1.HdHefuqdModel.getInstance(ctx, uuid, hdcid);
    await hdHefuqdModel.ShopRef();
});
/**
 * @api {post} /huodong/hdHfqdShopBuy 合服庆典商店购买
 * @apiName 合服庆典商店购买
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc 档次
 */
router.all("/hdHfqdShopBuy", async (ctx) => {
    ctx.state.apidesc = "活动-合服庆典商店购买";
    const { uuid, hdcid, dc } = tool_1.tool.getParams(ctx);
    let hdHefuqdModel = HdHefuqdModel_1.HdHefuqdModel.getInstance(ctx, uuid, hdcid);
    await hdHefuqdModel.ShopBuy(dc);
});
/**
 * @api {post} /huodong/hdChumoInto 进入除魔卫道
 * @apiName 进入除魔卫道
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 */
router.all("/hdChumoInto", async (ctx) => {
    ctx.state.apidesc = "活动-进入除魔卫道";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdChumoModel = HdChumoModel_1.HdChumoModel.getInstance(ctx, uuid, hdcid);
    await hdChumoModel.backData();
    //加入排行榜
    let cfg = (await hdChumoModel.getHdCfg());
    if (cfg != null) {
        let rdsUserModel_rdsHd = await new RdsUserModel_1.RdsUserModel("rdsHdChumo", hdcid, await hdChumoModel.getHeIdByUuid(uuid), cfg.info.id);
        await rdsUserModel_rdsHd.backData_my(ctx, uuid);
    }
});
/**
 * @api {post} /huodong/hdChumoGift 除魔卫道领取免费礼包
 * @apiName 除魔卫道领取免费礼包
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc 档次
 */
router.all("/hdChumoGift", async (ctx) => {
    ctx.state.apidesc = "活动-除魔卫道领取免费礼包";
    const { uuid, hdcid, dc } = tool_1.tool.getParams(ctx);
    let hdChumoModel = HdChumoModel_1.HdChumoModel.getInstance(ctx, uuid, hdcid);
    await hdChumoModel.giftRwd(dc);
});
/**
 * @api {post} /huodong/hdChumoFight 除魔卫道战斗
 * @apiName 除魔卫道战斗
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 */
router.all("/hdChumoFight", async (ctx) => {
    ctx.state.apidesc = "活动-除魔卫道战斗";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdChumoModel = HdChumoModel_1.HdChumoModel.getInstance(ctx, uuid, hdcid);
    await hdChumoModel.fight_one();
});
/**
 * @api {post} /huodong/hdZixuanInto 进入自选礼包
 * @apiName 进入自选礼包
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 */
router.all("/hdZixuanInto", async (ctx) => {
    ctx.state.apidesc = "活动-进入自选礼包";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdZixuanModel = HdZixuanModel_1.HdZixuanModel.getInstance(ctx, uuid, hdcid);
    await hdZixuanModel.backData();
});
/**
 * @api {post} /huodong/hdZixuanSelect 自选礼包选择
 * @apiName 自选礼包选择
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {ZixuanSelectCs[]} cs [dc1,dc2,xb][]配置档次1
 */
router.all("/hdZixuanSelect", async (ctx) => {
    ctx.state.apidesc = "活动-自选礼包选择";
    const { uuid, hdcid, cs } = tool_1.tool.getParams(ctx);
    let hdZixuanModel = HdZixuanModel_1.HdZixuanModel.getInstance(ctx, uuid, hdcid);
    await hdZixuanModel.select(cs);
});
/**
 * @api {post} /huodong/hdZixuanRwd 自选礼包免费
 * @apiName 自选礼包免费
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc1 配置档次1
 */
router.all("/hdZixuanRwd", async (ctx) => {
    ctx.state.apidesc = "活动-自选礼包免费";
    const { uuid, hdcid, dc1 } = tool_1.tool.getParams(ctx);
    let hdZixuanModel = HdZixuanModel_1.HdZixuanModel.getInstance(ctx, uuid, hdcid);
    await hdZixuanModel.mianfei(dc1);
});
/**
 * @api {post} /huodong/hdLunHuiInfo 天道轮回进入
 * @apiName 天道轮回 进入
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 */
router.all("/hdLunHuiInfo", async (ctx) => {
    ctx.state.apidesc = "活动-天道轮回进入";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdLunHuiModel = HdLunHuiModel_1.HdLunHuiModel.getInstance(ctx, uuid, hdcid);
    await hdLunHuiModel.backData();
});
/**
 * @api {post} /huodong/hdLunHuiRwd 天道轮回 - 领取任务奖励
 * @apiName 天道轮回 - 领取任务奖励
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} id 档次id
 */
router.all("/hdLunHuiRwd", async (ctx) => {
    ctx.state.apidesc = "活动-天道轮回：领取任务奖励";
    const { uuid, hdcid, id } = tool_1.tool.getParams(ctx);
    let hdLunHuiModel = HdLunHuiModel_1.HdLunHuiModel.getInstance(ctx, uuid, hdcid);
    await hdLunHuiModel.rwd(id);
});
/**
 * @api {post} /huodong/hdLunHuiDailyRwd 天道轮回 - 每日白嫖奖励
 * @apiName 天道轮回 - 每日白嫖奖励
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 */
router.all("/hdLunHuiDailyRwd", async (ctx) => {
    ctx.state.apidesc = "活动-天道轮回：每日白嫖奖励";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdLunHuiModel = HdLunHuiModel_1.HdLunHuiModel.getInstance(ctx, uuid, hdcid);
    await hdLunHuiModel.dailyRwd();
});
/**
 * @api {post} /huodong/hdLunHuiDailyHsBuy 天道轮回 - 黑市购买
 * @apiName 天道轮回 - 黑市购买
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} id 档次id
 */
router.all("/hdLunHuiDailyHsBuy", async (ctx) => {
    ctx.state.apidesc = "活动-天道轮回：黑市购买";
    const { uuid, hdcid, id } = tool_1.tool.getParams(ctx);
    let hdLunHuiModel = HdLunHuiModel_1.HdLunHuiModel.getInstance(ctx, uuid, hdcid);
    await hdLunHuiModel.hsBuy(id);
});
/**
 * @api {post} /huodong/hdDayHuiInfo 每日特惠进入
 * @apiName 每日特惠 进入
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 */
router.all("/hdDayHuiInfo", async (ctx) => {
    ctx.state.apidesc = "活动-每日特惠进入";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdDayTeHuiModel = HdDayTeHuiModel_1.HdDayTeHuiModel.getInstance(ctx, uuid, hdcid);
    await hdDayTeHuiModel.backData();
});
/**
 * @api {post} /huodong/hdDayHuiRwd 每日特惠 - 领取购买奖励
 * @apiName 每日特惠 - 领取购买奖励
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} id 档次id
 */
router.all("/hdDayHuiRwd", async (ctx) => {
    ctx.state.apidesc = "活动-每日特惠领取购买奖励";
    const { uuid, hdcid, id } = tool_1.tool.getParams(ctx);
    let hdDayTeHuiModel = HdDayTeHuiModel_1.HdDayTeHuiModel.getInstance(ctx, uuid, hdcid);
    await hdDayTeHuiModel.rwd(id);
});
/**
 * @api {post} /huodong/hdDayHuiDailyRwd 每日特惠 - 每日白嫖奖励
 * @apiName 每日特惠 - 每日白嫖奖励
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 */
router.all("/hdDayHuiDailyRwd", async (ctx) => {
    ctx.state.apidesc = "活动-每日特惠每日白嫖奖励";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdDayTeHuiModel = HdDayTeHuiModel_1.HdDayTeHuiModel.getInstance(ctx, uuid, hdcid);
    await hdDayTeHuiModel.dailyRwd();
});
/**
 * @api {post} /huodong/hdChargeDaysInfo 累计天数充值礼包进入
 * @apiName 累计天数充值礼包 进入
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 */
router.all("/hdChargeDaysInfo", async (ctx) => {
    ctx.state.apidesc = "活动-累计天数充值礼包进入";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdChargeDaysModel = HdChargeDays_1.HdChargeDaysModel.getInstance(ctx, uuid, hdcid);
    await hdChargeDaysModel.backData();
    //额外发送XX
});
/**
 * @api {post} /huodong/hdChargeDaysRwd 累计天数充值礼包 - 领取奖励
 * @apiName 累计天数充值礼包 - 领取奖励
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} id 档次id
 */
router.all("/hdChargeDaysRwd", async (ctx) => {
    ctx.state.apidesc = "活动-累计天数充值礼包领取奖励";
    const { uuid, hdcid, id } = tool_1.tool.getParams(ctx);
    let hdChargeDaysModel = HdChargeDays_1.HdChargeDaysModel.getInstance(ctx, uuid, hdcid);
    await hdChargeDaysModel.rwd(id);
});
/**
 * @api {post} /huodong/hdChargeDaysDailyRwd 累计天数充值礼包 - 每日白嫖奖励
 * @apiName 累计天数充值礼包 - 每日白嫖奖励
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 */
router.all("/hdChargeDaysDailyRwd", async (ctx) => {
    ctx.state.apidesc = "活动-累计天数充值礼包每日白嫖奖励";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdChargeDaysModel = HdChargeDays_1.HdChargeDaysModel.getInstance(ctx, uuid, hdcid);
    await hdChargeDaysModel.dailyRwd();
});
/**
 * @api {post} /huodong/hdChargeTotalInfo 累计充值礼包 进入
 * @apiName 累计充值礼包 进入
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 */
router.all("/hdChargeTotalInfo", async (ctx) => {
    ctx.state.apidesc = "活动-累计充值礼包 进入";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdChargeTotalModel = HdChargeTotal_1.HdChargeTotalModel.getInstance(ctx, uuid, hdcid);
    await hdChargeTotalModel.backData();
});
/**
 * @api {post} /huodong/hdChargeTotalRwd 累计充值礼包 - 领取奖励
 * @apiName 累计充值礼包 - 领取奖励
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} id 档次id
 */
router.all("/hdChargeTotalRwd", async (ctx) => {
    ctx.state.apidesc = "活动-累计充值礼包 - 领取奖励";
    const { uuid, hdcid, id } = tool_1.tool.getParams(ctx);
    let hdChargeTotalModel = HdChargeTotal_1.HdChargeTotalModel.getInstance(ctx, uuid, hdcid);
    await hdChargeTotalModel.rwd(id);
});
/**
 * @api {post} /huodong/hdChargeTotalDailyRwd 累计充值礼包 - 每日白嫖奖励
 * @apiName 累计充值礼包 - 每日白嫖奖励
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 */
router.all("/hdChargeTotalDailyRwd", async (ctx) => {
    ctx.state.apidesc = "活动-累计充值礼包 - 每日白嫖奖励";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdChargeTotalModel = HdChargeTotal_1.HdChargeTotalModel.getInstance(ctx, uuid, hdcid);
    await hdChargeTotalModel.dailyRwd();
});
/**
 * @api {post} /huodong/newjyInto 新版机缘进入
 * @apiName 新版机缘进入
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 *
 */
router.all("/newjyInto", async (ctx) => {
    ctx.state.apidesc = "活动-新版机缘进入";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdNewJiYuanModel = HdNewJiYuanModel_1.HdNewJiYuanModel.getInstance(ctx, uuid, hdcid);
    await hdNewJiYuanModel.backData();
});
/**
 * @api {post} /huodong/newjyLvRwd 新版活动机缘领取等级奖励
 * @apiName 新版活动机缘领取等级奖励
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} level 档次(等级)
 * @apiParam {string} type  pt普通xy需要all=pt+xy
 *
 */
router.all("/newjyLvRwd", async (ctx) => {
    ctx.state.apidesc = "活动-新版活动机缘领取等级奖励";
    const { uuid, hdcid, level, type } = tool_1.tool.getParams(ctx);
    let hdNewJiYuanModel = HdNewJiYuanModel_1.HdNewJiYuanModel.getInstance(ctx, uuid, hdcid);
    await hdNewJiYuanModel.jyLvRwd(level, type);
});
/**
 * @api {post} /huodong/newjyLvRwdYue 新版活动机缘领取等级奖励月
 * @apiName 新版活动机缘领取等级奖励月
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} level 档次(等级)
 * @apiParam {string} type  pt普通xy需要all=pt+xy
 *
 */
router.all("/newjyLvRwdYue", async (ctx) => {
    ctx.state.apidesc = "活动-新版活动机缘领取等级奖励月";
    const { uuid, hdcid, level, type } = tool_1.tool.getParams(ctx);
    let hdNewJiYuanModel = HdNewJiYuanModel_1.HdNewJiYuanModel.getInstance(ctx, uuid, hdcid);
    await hdNewJiYuanModel.jyLvRwdYue(level, type);
});
/**
 * @api {post} /huodong/newjyTaskRwd 新版机缘领取任务奖励
 * @apiName 新版机缘领取任务奖励
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc 档次
 *
 */
router.all("/newjyTaskRwd", async (ctx) => {
    ctx.state.apidesc = "活动-新版机缘领取任务奖励";
    const { uuid, hdcid, dc } = tool_1.tool.getParams(ctx);
    let hdNewJiYuanModel = HdNewJiYuanModel_1.HdNewJiYuanModel.getInstance(ctx, uuid, hdcid);
    await hdNewJiYuanModel.jyTaskRwd(dc);
});
/**
 * @api {post} /huodong/newjyFreeGift 新版机缘领取免费礼包
 * @apiName 新版机缘领取免费礼包
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 *
 */
router.all("/newjyFreeGift", async (ctx) => {
    ctx.state.apidesc = "活动-新版机缘领取免费礼包";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdNewJiYuanModel = HdNewJiYuanModel_1.HdNewJiYuanModel.getInstance(ctx, uuid, hdcid);
    await hdNewJiYuanModel.jyFreeGift();
});
/**
 * @api {post} /huodong/newjyGiftRwd 新版机缘领取礼包额外奖励
 * @apiName 新版机缘领取礼包额外奖励
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 *
 */
router.all("/newjyGiftRwd", async (ctx) => {
    ctx.state.apidesc = "活动-新版机缘领取礼包额外奖励";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdNewJiYuanModel = HdNewJiYuanModel_1.HdNewJiYuanModel.getInstance(ctx, uuid, hdcid);
    await hdNewJiYuanModel.jyGiftRwd();
});
/**
 * @api {post} /huodong/douLuoInfo 最强斗罗 进入
 * @apiName 最强斗罗 进入
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 *
 */
router.all("/douLuoInfo", async (ctx) => {
    ctx.state.apidesc = "活动-最强斗罗 进入";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdDouLuoModel = HdDouLuoModel_1.HdDouLuoModel.getInstance(ctx, uuid, hdcid);
    let hdinfo = await hdDouLuoModel.getInfo();
    if (hdinfo.tzList.length <= 0) {
        //初始化挑战表
        await hdDouLuoModel._refresh();
    }
    //检查我的排名
    await hdDouLuoModel.resetMinRid();
    await hdDouLuoModel.setLogin(0);
    await hdDouLuoModel.backData();
});
/**
 * @api {post} /huodong/douLuoRef 最强斗罗 刷新
 * @apiName 最强斗罗 刷新
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 */
router.all("/douLuoRef", async (ctx) => {
    ctx.state.apidesc = "活动-最强斗罗 刷新";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdDouLuoModel = HdDouLuoModel_1.HdDouLuoModel.getInstance(ctx, uuid, hdcid);
    await hdDouLuoModel.refresh();
});
/**
 * @api {post} /huodong/douLuoBuy 购买XX(数量)
 * @apiName 最强斗罗 购买XX
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {number} count 数量
 *
 */
router.all("/douLuoBuy", async (ctx) => {
    ctx.state.apidesc = "活动-最强斗罗 购买XX(数量)";
    const { uuid, hdcid, count } = tool_1.tool.getParams(ctx);
    let hdDouLuoModel = HdDouLuoModel_1.HdDouLuoModel.getInstance(ctx, uuid, hdcid);
    await hdDouLuoModel.buy(count);
});
/**
 * @api {post} /huodong/douLuoFight 战斗
 * @apiName 最强斗罗 战斗
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {number} rid 名次
 *
 */
router.all("/douLuoFight", async (ctx) => {
    ctx.state.apidesc = "活动-最强斗罗 战斗";
    const { uuid, hdcid, rid } = tool_1.tool.getParams(ctx);
    let actDouLuoFightModel = ActDouLuoFightModel_1.ActDouLuoFightModel.getInstance(ctx, uuid);
    await actDouLuoFightModel.fight_one(hdcid, rid);
});
/**
 * @api {post} /huodong/douLuoSd 扫荡
 * @apiName 最强斗罗 扫荡
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {number} count 次数
 *
 */
router.all("/douLuoSd", async (ctx) => {
    ctx.state.apidesc = "活动-最强斗罗 扫荡";
    const { uuid, hdcid, count } = tool_1.tool.getParams(ctx);
    let hdDouLuoModel = HdDouLuoModel_1.HdDouLuoModel.getInstance(ctx, uuid, hdcid);
    await hdDouLuoModel.sd(count, 1);
});
/**
 * @api {post} /huodong/douLuoLogInfo 最强斗罗LOG 进入
 * @apiName 最强斗罗LOG 进入
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 *
 */
router.all("/douLuoLogInfo", async (ctx) => {
    ctx.state.apidesc = "活动-最强斗罗LOG 进入";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdDouLuoLogModel = HdDouLuoLogModel_1.HdDouLuoLogModel.getInstance(ctx, uuid, hdcid);
    await hdDouLuoLogModel.backData();
});
/**
 * @api {post} /huodong/douLuoShop 最强斗罗商店购买
 * @apiName 最强斗罗商店购买
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc 商店档次
 * @apiParam {number} count 数量
 *
 */
router.all("/douLuoShop", async (ctx) => {
    ctx.state.apidesc = "活动-最强斗罗商店购买";
    const { uuid, hdcid, dc, count } = tool_1.tool.getParams(ctx);
    let hdDouLuoModel = HdDouLuoModel_1.HdDouLuoModel.getInstance(ctx, uuid, hdcid);
    await hdDouLuoModel.shopBuy(dc, count);
});
/**
 * @api {post} /huodong/douLuoCj 最强斗罗成就领取
 * @apiName 最强斗罗成就领取
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc 成就档次
 *
 */
router.all("/douLuoCj", async (ctx) => {
    ctx.state.apidesc = "活动-最强斗罗成就领取";
    const { uuid, hdcid, dc } = tool_1.tool.getParams(ctx);
    let hdDouLuoModel = HdDouLuoModel_1.HdDouLuoModel.getInstance(ctx, uuid, hdcid);
    await hdDouLuoModel.chengJiuRwd(dc);
});
/**
 *
 * @api {post} /huodong/hdTianGongInfo 天宫乐舞 进入
 * @apiName 天宫乐舞 进入
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 *
 */
router.all("/hdTianGongInfo", async (ctx) => {
    ctx.state.apidesc = "活动-天宫乐舞 进入";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdTianGongModel = HdTianGongModel_1.HdTianGongModel.getInstance(ctx, uuid, hdcid);
    await hdTianGongModel.backData();
});
/**
 *
 * @api {post} /huodong/hdTianGongBuy 天宫乐舞 购买道具
 * @apiName 天宫乐舞 购买道具
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} id 道具ID
 */
router.all("/hdTianGongBuy", async (ctx) => {
    ctx.state.apidesc = "活动-天宫乐舞 购买道具";
    const { uuid, hdcid, id } = tool_1.tool.getParams(ctx);
    //实例化 model
    let hdTianGongModel = HdTianGongModel_1.HdTianGongModel.getInstance(ctx, uuid, hdcid);
    //调用
    await hdTianGongModel.buy(id);
});
/**
 *
 * @api {post} /huodong/hdTianGongLingQu 天宫乐舞 领取道具
 * @apiName 天宫乐舞 领取道具
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} id 道具ID
 * @apiParam {number} count 购买数量
 */
router.all("/hdTianGongLingQu", async (ctx) => {
    ctx.state.apidesc = "活动-天宫乐舞 领取道具";
    const { uuid, hdcid, id, count } = tool_1.tool.getParams(ctx);
    //实例化 model
    let hdTianGongModel = HdTianGongModel_1.HdTianGongModel.getInstance(ctx, uuid, hdcid);
    //调用
    await hdTianGongModel.lingqu(id, count);
});
/**
 *
 * @api {post} /huodong/hdTianGongPlay 天宫乐舞 表演
 * @apiName 天宫乐舞 表演
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} id 道具ID
 * @apiParam {number} count 购买数量
 */
router.all("/hdTianGongPlay", async (ctx) => {
    ctx.state.apidesc = "活动-天宫乐舞 表演";
    const { uuid, hdcid, id, count } = tool_1.tool.getParams(ctx);
    //实例化 model
    let hdTianGongModel = HdTianGongModel_1.HdTianGongModel.getInstance(ctx, uuid, hdcid);
    //调用
    await hdTianGongModel.play(id, count);
});
/**
 *
 * @api {post} /huodong/hdTianGongDuiHuan 天宫乐舞 兑换道具
 * @apiName 天宫乐舞 兑换道具
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} id 道具ID
 * @apiParam {number} count 购买数量
 */
router.all("/hdTianGongDuiHuan", async (ctx) => {
    ctx.state.apidesc = "活动-天宫乐舞 兑换道具";
    const { uuid, hdcid, id, count } = tool_1.tool.getParams(ctx);
    //实例化 model
    let hdTianGongModel = HdTianGongModel_1.HdTianGongModel.getInstance(ctx, uuid, hdcid);
    //调用
    await hdTianGongModel.duihuan(id, count);
});
/**
 * @api {post} /huodong/hdYgInto 月宫探宝进入
 * @apiName 月宫探宝进入
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 */
router.all("/hdYgInto", async (ctx) => {
    ctx.state.apidesc = "月宫探宝进入";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdYueGongModel = HdYueGongModel_1.HdYueGongModel.getInstance(ctx, uuid, hdcid);
    await hdYueGongModel.backData();
});
/**
 * @api {post} /huodong/hdYgXuan 月宫探宝选择大奖
 * @apiName 月宫探宝选择大奖
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc 大奖档次
 */
router.all("/hdYgXuan", async (ctx) => {
    ctx.state.apidesc = "月宫探宝选择大奖";
    const { uuid, hdcid, dc } = tool_1.tool.getParams(ctx);
    let hdYueGongModel = HdYueGongModel_1.HdYueGongModel.getInstance(ctx, uuid, hdcid);
    await hdYueGongModel.hdYgXuan(dc);
});
/**
 * @api {post} /huodong/hdYgChou 月宫探宝抽奖
 * @apiName 月宫探宝抽奖
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {number} num 抽取次数
 */
router.all("/hdYgChou", async (ctx) => {
    ctx.state.apidesc = "月宫探宝抽奖";
    const { uuid, hdcid, num } = tool_1.tool.getParams(ctx);
    let hdYueGongModel = HdYueGongModel_1.HdYueGongModel.getInstance(ctx, uuid, hdcid);
    await hdYueGongModel.hdYgChou(num);
});
/**
 * @api {post} /huodong/hdYgDuiHuan 月宫探宝兑换
 * @apiName 月宫探宝兑换
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc 大奖档次
 * @apiParam {number} num 兑换数量
 */
router.all("/hdYgDuiHuan", async (ctx) => {
    ctx.state.apidesc = "月宫探宝兑换";
    const { uuid, hdcid, dc, num } = tool_1.tool.getParams(ctx);
    let hdYueGongModel = HdYueGongModel_1.HdYueGongModel.getInstance(ctx, uuid, hdcid);
    await hdYueGongModel.hdYgDuiHuan(dc, num);
});
/**
 * @api {post} /huodong/hdYgTask 月宫探宝领取每日任务
 * @apiName 月宫探宝领取每日任务
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc 大奖档次
 */
router.all("/hdYgTask", async (ctx) => {
    ctx.state.apidesc = "月宫探宝领取每日任务";
    const { uuid, hdcid, dc } = tool_1.tool.getParams(ctx);
    let hdYueGongModel = HdYueGongModel_1.HdYueGongModel.getInstance(ctx, uuid, hdcid);
    await hdYueGongModel.hdYgTask(dc);
});
/**
 * @api {post} /huodong/hdYglj 月宫探宝领取累计奖励
 * @apiName 月宫探宝领取累计奖励
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc 档次
 */
router.all("/hdYglj", async (ctx) => {
    ctx.state.apidesc = "月宫探宝领取累计奖励";
    const { uuid, hdcid, dc } = tool_1.tool.getParams(ctx);
    let hdYueGongModel = HdYueGongModel_1.HdYueGongModel.getInstance(ctx, uuid, hdcid);
    await hdYueGongModel.hdYglj(dc);
});
/**
 * @api {post} /huodong/hdYgGift 月宫探宝领取礼包
 * @apiName 月宫探宝领取礼包
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc 大奖档次
 */
router.all("/hdYgGift", async (ctx) => {
    ctx.state.apidesc = "月宫探宝领取礼包";
    const { uuid, hdcid, dc } = tool_1.tool.getParams(ctx);
    let hdYueGongModel = HdYueGongModel_1.HdYueGongModel.getInstance(ctx, uuid, hdcid);
    await hdYueGongModel.hdYgGift(dc);
});
/**
 * @api {post} /huodong/hdYgSign 月宫探宝签到
 * @apiName 月宫探宝签到
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc 档次
 */
router.all("/hdYgSign", async (ctx) => {
    ctx.state.apidesc = "月宫探宝签到";
    const { uuid, hdcid, dc } = tool_1.tool.getParams(ctx);
    let hdYueGongModel = HdYueGongModel_1.HdYueGongModel.getInstance(ctx, uuid, hdcid);
    await hdYueGongModel.hdYgSign(dc);
});
/**
 * @api {post} /huodong/hdHlInto 化莲进入
 * @apiName 化莲进入
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 */
router.all("/hdHlInto", async (ctx) => {
    ctx.state.apidesc = "化莲进入";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdHuaLianModel = HdHuaLianModel_1.HdHuaLianModel.getInstance(ctx, uuid, hdcid);
    await hdHuaLianModel.backData();
});
/**
 * @api {post} /huodong/hdHlChou 化莲抽奖
 * @apiName 化莲抽奖
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {number} num 抽取次数
 */
router.all("/hdHlChou", async (ctx) => {
    ctx.state.apidesc = "化莲抽奖";
    const { uuid, hdcid, num } = tool_1.tool.getParams(ctx);
    let hdHuaLianModel = HdHuaLianModel_1.HdHuaLianModel.getInstance(ctx, uuid, hdcid);
    await hdHuaLianModel.hdHlChou(num);
});
/**
 * @api {post} /huodong/hdHlJifen 化莲领取积分档次
 * @apiName 化莲领取积分档次
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc 积分档次
 */
router.all("/hdHlJifen", async (ctx) => {
    ctx.state.apidesc = "化莲领取积分档次";
    const { uuid, hdcid, dc } = tool_1.tool.getParams(ctx);
    let hdHuaLianModel = HdHuaLianModel_1.HdHuaLianModel.getInstance(ctx, uuid, hdcid);
    await hdHuaLianModel.hdHlJifen(dc);
});
/**
 * @api {post} /huodong/hdHlTask 化莲领取每日任务
 * @apiName 化莲领取每日任务
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc 大奖档次
 */
router.all("/hdHlTask", async (ctx) => {
    ctx.state.apidesc = "化莲领取每日任务";
    const { uuid, hdcid, dc } = tool_1.tool.getParams(ctx);
    let hdHuaLianModel = HdHuaLianModel_1.HdHuaLianModel.getInstance(ctx, uuid, hdcid);
    await hdHuaLianModel.hdHlTask(dc);
});
/**
 * @api {post} /huodong/hdHlGift 化莲领取礼包
 * @apiName 化莲领取礼包
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc 大奖档次
 */
router.all("/hdHlGift", async (ctx) => {
    ctx.state.apidesc = "化莲领取礼包";
    const { uuid, hdcid, dc } = tool_1.tool.getParams(ctx);
    let hdHuaLianModel = HdHuaLianModel_1.HdHuaLianModel.getInstance(ctx, uuid, hdcid);
    await hdHuaLianModel.hdHlGift(dc);
});
/**
 * @api {post} /huodong/hdShInto 山河庆典进入
 * @apiName 山河庆典进入
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 */
router.all("/hdShInto", async (ctx) => {
    ctx.state.apidesc = "山河庆典进入";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdShanheModel = HdShanheModel_1.HdShanheModel.getInstance(ctx, uuid, hdcid);
    await hdShanheModel.backData();
});
/**
 * @api {post} /huodong/hdShLeiji 山河庆典领取累计大奖
 * @apiName 山河庆典领取累计大奖
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc 大奖档次
 */
router.all("/hdShLeiji", async (ctx) => {
    ctx.state.apidesc = "山河庆典领取累计大奖";
    const { uuid, hdcid, dc } = tool_1.tool.getParams(ctx);
    let hdShanheModel = HdShanheModel_1.HdShanheModel.getInstance(ctx, uuid, hdcid);
    await hdShanheModel.hdShLeiji(dc);
});
/**
 * @api {post} /huodong/hdShGift 山河庆典领取礼包
 * @apiName 山河庆典领取礼包
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc 大奖档次
 */
router.all("/hdShGift", async (ctx) => {
    ctx.state.apidesc = "山河庆典领取礼包";
    const { uuid, hdcid, dc } = tool_1.tool.getParams(ctx);
    let hdShanheModel = HdShanheModel_1.HdShanheModel.getInstance(ctx, uuid, hdcid);
    await hdShanheModel.hdShGift(dc);
});
/**
 * @api {post} /huodong/hdShSign 山河庆典签到
 * @apiName 山河庆典签到
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc 档次
 */
router.all("/hdShSign", async (ctx) => {
    ctx.state.apidesc = "山河庆典签到";
    const { uuid, hdcid, dc } = tool_1.tool.getParams(ctx);
    let hdShanheModel = HdShanheModel_1.HdShanheModel.getInstance(ctx, uuid, hdcid);
    await hdShanheModel.hdShSign(dc);
});
/**
 * @api {post} /huodong/hdShFight 山河庆典战斗
 * @apiName 山河庆典战斗
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 */
router.all("/hdShFight", async (ctx) => {
    ctx.state.apidesc = "活动-山河庆典战斗";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdShanheModel = HdShanheModel_1.HdShanheModel.getInstance(ctx, uuid, hdcid);
    await hdShanheModel.fight_one();
});
/**
 * @api {post} /huodong/hdShChou 山河庆典抽奖
 * @apiName 山河庆典抽奖
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {number} num 抽取次数
 */
router.all("/hdShChou", async (ctx) => {
    ctx.state.apidesc = "活动-山河庆典抽奖";
    const { uuid, hdcid, num } = tool_1.tool.getParams(ctx);
    let hdShanheModel = HdShanheModel_1.HdShanheModel.getInstance(ctx, uuid, hdcid);
    await hdShanheModel.choujiang(num);
});
/**
 * @api {post} /huodong/hdCyInto 重阳出游进入
 * @apiName 重阳出游进入
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 */
router.all("/hdCyInto", async (ctx) => {
    ctx.state.apidesc = "重阳出游进入";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdChongYangModel = HdChongYangModel_1.HdChongYangModel.getInstance(ctx, uuid, hdcid);
    await hdChongYangModel.backData();
});
/**
 * @api {post} /huodong/hdCyTask 重阳出游领取每日任务
 * @apiName 重阳出游领取每日任务
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc 大奖档次
 */
router.all("/hdCyTask", async (ctx) => {
    ctx.state.apidesc = "重阳出游领取每日任务";
    const { uuid, hdcid, dc } = tool_1.tool.getParams(ctx);
    let hdChongYangModel = HdChongYangModel_1.HdChongYangModel.getInstance(ctx, uuid, hdcid);
    await hdChongYangModel.hdCyTask(dc);
});
/**
 * @api {post} /huodong/hdCyCj 重阳出游领取累计奖励
 * @apiName 重阳出游领取累计奖励
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc 档次
 */
router.all("/hdCyCj", async (ctx) => {
    ctx.state.apidesc = "重阳出游领取累计奖励";
    const { uuid, hdcid, dc } = tool_1.tool.getParams(ctx);
    let hdChongYangModel = HdChongYangModel_1.HdChongYangModel.getInstance(ctx, uuid, hdcid);
    await hdChongYangModel.hdCyCj(dc);
});
/**
 * @api {post} /huodong/hdCyGift 重阳出游领取礼包
 * @apiName 重阳出游领取礼包
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc 大奖档次
 */
router.all("/hdCyGift", async (ctx) => {
    ctx.state.apidesc = "重阳出游领取礼包";
    const { uuid, hdcid, dc } = tool_1.tool.getParams(ctx);
    let hdChongYangModel = HdChongYangModel_1.HdChongYangModel.getInstance(ctx, uuid, hdcid);
    await hdChongYangModel.hdCyGift(dc);
});
/**
 * @api {post} /huodong/hdCyXuan 重阳出游选择大奖
 * @apiName 重阳出游选择大奖
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {keyValue} sets 大奖档次
 */
router.all("/hdCyXuan", async (ctx) => {
    ctx.state.apidesc = "重阳出游选择大奖";
    const { uuid, hdcid, sets } = tool_1.tool.getParams(ctx);
    let hdChongYangModel = HdChongYangModel_1.HdChongYangModel.getInstance(ctx, uuid, hdcid);
    for (const dc in sets) {
        await hdChongYangModel.hdCyXuan(dc, sets[dc]);
    }
});
/**
 * @api {post} /huodong/hdCyChou 重阳出游抽奖
 * @apiName 重阳出游抽奖
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 */
router.all("/hdCyChou", async (ctx) => {
    ctx.state.apidesc = "重阳出游抽奖";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdChongYangModel = HdChongYangModel_1.HdChongYangModel.getInstance(ctx, uuid, hdcid);
    await hdChongYangModel.hdCyChou();
});
/**
 * @api {post} /huodong/hdCyNext 重阳出游下一层
 * @apiName 重阳出游下一层
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 */
router.all("/hdCyNext", async (ctx) => {
    ctx.state.apidesc = "重阳出游下一层";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdChongYangModel = HdChongYangModel_1.HdChongYangModel.getInstance(ctx, uuid, hdcid);
    await hdChongYangModel.hdCyNext();
});
/**
 * @api {post} /huodong/hdcbRwd pve冲榜领取档次奖励
 * @apiName pve冲榜领取档次奖励
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc 活动档次
 */
router.all("/hdcbRwd", async (ctx) => {
    ctx.state.apidesc = "pve冲榜-领取档次奖励";
    const { uuid, hdcid, dc } = tool_1.tool.getParams(ctx);
    let hdChongBangModel = HdChongBangModel_1.HdChongBangModel.getInstance(ctx, uuid, hdcid);
    await hdChongBangModel.rwd(dc);
});
/**
 * @api {post} /huodong/hdDayBuy 每日特价购买
 * @apiName 每日特价购买
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc 活动档次
 */
router.all("/hdDayBuy", async (ctx) => {
    ctx.state.apidesc = "每日特价-购买";
    const { uuid, hdcid, dc } = tool_1.tool.getParams(ctx);
    let hdDayTeJiaModel = HdDayTeJiaModel_1.HdDayTeJiaModel.getInstance(ctx, uuid, hdcid);
    await hdDayTeJiaModel.rwd(dc);
});
/**
 * @api {post} /huodong/hdMonkeySelect 魔种降生选择大奖
 * @apiName 魔种降生选择大奖
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} index 活动配置中大奖的索引
 */
router.all("/hdMonkeySelect", async (ctx) => {
    ctx.state.apidesc = "魔种降生选择大奖";
    const { uuid, hdcid, index } = tool_1.tool.getParams(ctx);
    let hdMonkeyModel = HdMonkeyModel_1.HdMonkeyModel.getInstance(ctx, uuid, hdcid);
    await hdMonkeyModel.selectPrize(index);
});
/**
 * @api {post} /huodong/hdMonkeyPrizeDraw 魔种降生大奖抽奖
 * @apiName 魔种降生大奖抽奖
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} num 玩家几连抽
 */
router.all("/hdMonkeyPrizeDraw", async (ctx) => {
    ctx.state.apidesc = "魔种降生大奖抽奖";
    const { uuid, hdcid, num } = tool_1.tool.getParams(ctx);
    if (num < 1) {
        ctx.throw("参数错误");
    }
    let hdMonkeyModel = HdMonkeyModel_1.HdMonkeyModel.getInstance(ctx, uuid, hdcid);
    await hdMonkeyModel.prizeDraw(num);
});
/**
 * @api {post} /huodong/hdMonkeySkinDraw 魔种降生皮肤抽奖
 * @apiName 魔种降生皮肤抽奖
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} num 玩家几连抽
 */
router.all("/hdMonkeySkinDraw", async (ctx) => {
    ctx.state.apidesc = "魔种降生皮肤抽奖";
    const { uuid, hdcid, num } = tool_1.tool.getParams(ctx);
    if (num < 1) {
        ctx.throw("参数错误");
    }
    let sevMonkeyModel = SevMonkeyModel_1.SevMonkeyModel.getInstance(ctx, uuid, hdcid);
    await sevMonkeyModel.skinDraw(num);
});
/**
 * @api {post} /huodong/hdMonkeyGift 魔种降生领取礼包
 * @apiName 魔种降生领取礼包
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} dc 大奖档次
 */
router.all("/hdMonkeyGift", async (ctx) => {
    ctx.state.apidesc = "魔种降生领取礼包";
    const { uuid, hdcid, dc } = tool_1.tool.getParams(ctx);
    let hdMonkeyModel = HdMonkeyModel_1.HdMonkeyModel.getInstance(ctx, uuid, hdcid);
    await hdMonkeyModel.gift(dc);
});
/**
 *
 * @api {post} /huodong/hdDengShenBangGetRwd 登神榜 领取任务奖励
 * @apiName 登神榜 领取任务奖励
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} index 任务下标
 */
router.all("/hdDengShenBangGetRwd", async (ctx) => {
    ctx.state.apidesc = "活动-登神榜 领取任务奖励";
    const { uuid, hdcid, index } = tool_1.tool.getParams(ctx);
    //实例化 model
    let hdDengShenBangModel = HdDengShenBangModel_1.HdDengShenBangModel.getInstance(ctx, uuid, hdcid);
    //调用
    await hdDengShenBangModel.getRwd(index);
});
/**
 * @api {post} /huodong/dengShenBangFight 登神榜-战斗
 * @apiName 登神榜-战斗
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 *
 */
router.all("/dengShenBangFight", async (ctx) => {
    ctx.state.apidesc = "活动-登神榜 战斗";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let actDengShenBangFightModel = ActDengShenBangFightModel_1.ActDengShenBangFightModel.getInstance(ctx, uuid);
    await actDengShenBangFightModel.fight_one(hdcid);
});
/**
 * @api {post} /huodong/dengShenBangInfo 登神榜 进入
 * @apiName 登神榜 进入
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 *
 */
router.all("/dengShenBangInfo", async (ctx) => {
    ctx.state.apidesc = "活动-登神榜 进入";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdDengShenBangModel = HdDengShenBangModel_1.HdDengShenBangModel.getInstance(ctx, uuid, hdcid);
    let hdinfo = await hdDengShenBangModel.getInfo();
    await hdDengShenBangModel.backData();
});
/**
 * @api {post} /huodong/dengShenBangClearClubScore 登神榜 清空玩家公会积分
 * @apiName 登神榜 清空玩家公会积分
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} clubId 活动分组ID
 *
 */
router.all("/dengShenBangClearClubScore", async (ctx) => {
    ctx.state.apidesc = "活动-登神榜 清空玩家公会积分";
    const { uuid, hdcid, clubId } = tool_1.tool.getParams(ctx);
    let hdDengShenBangModel = HdDengShenBangModel_1.HdDengShenBangModel.getInstance(ctx, uuid, hdcid);
    await hdDengShenBangModel.updateClubScore(0, true, clubId);
});
/**
 * @api {post} /huodong/dengShenBangBuy 登神榜 购买登神帖
 * @apiName 登神榜 购买登神帖
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} count 购买数量
 *
 */
router.all("/dengShenBangBuy", async (ctx) => {
    ctx.state.apidesc = "活动-登神榜 购买登神帖";
    const { uuid, hdcid, count } = tool_1.tool.getParams(ctx);
    let hdDengShenBangModel = HdDengShenBangModel_1.HdDengShenBangModel.getInstance(ctx, uuid, hdcid);
    await hdDengShenBangModel.buy(count);
});
/**
 * @api {post} /huodong/dengShenBangLogInfo 登神榜LOG 进入
 * @apiName 登神榜LOG 进入
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 *
 */
router.all("/dengShenBangLogInfo", async (ctx) => {
    ctx.state.apidesc = "活动-登神榜LOG 进入";
    const { uuid, hdcid } = tool_1.tool.getParams(ctx);
    let hdDengShenBangLogModel = HdDengShenBangLogModel_1.HdDengShenBangLogModel.getInstance(ctx, uuid, hdcid);
    await hdDengShenBangLogModel.backData();
});
/**
 * @api {post} /huodong/dengShenBangPayFree 登神榜: 免费充值领取
 * @apiName 登神榜: 免费充值领取
 * @apiGroup huodong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 活动分组ID
 * @apiParam {string} id 档次
 */
router.all("/dengShenBangPayFree", async (ctx) => {
    ctx.state.apidesc = "活动-登神榜:免费充值领取";
    const { uuid, hdcid, id } = tool_1.tool.getParams(ctx);
    let hdDengShenBangModel = HdDengShenBangModel_1.HdDengShenBangModel.getInstance(ctx, uuid, hdcid);
    await hdDengShenBangModel.getFree(id);
});
//# sourceMappingURL=huodong.js.map