"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tool_1 = require("../util/tool");
const setting_1 = __importDefault(require("../crontab/setting"));
const mongodb_1 = require("../util/mongodb");
const ActShopDiaMondModel_1 = require("../model/act/ActShopDiaMondModel");
const HdNewModel_1 = require("../model/hd/HdNewModel");
const HdSpeGiftModel_1 = require("../model/hd/HdSpeGiftModel");
const HdGrowthFundModel_1 = require("../model/hd/HdGrowthFundModel");
const HdPriCardModel_1 = require("../model/hd/HdPriCardModel");
const HdTimeBenModel_1 = require("../model/hd/HdTimeBenModel");
const HdTimeBen2Model_1 = require("../model/hd/HdTimeBen2Model");
const UserModel_1 = require("../model/user/UserModel");
const ActDongTianModel_1 = require("../model/act/ActDongTianModel");
const ActShopRenWuModel_1 = require("../model/act/ActShopRenWuModel");
const HdLianchongModel_1 = require("../model/hd/HdLianchongModel");
const HdKaifuModel_1 = require("../model/hd/HdKaifuModel");
const HdChouModel_1 = require("../model/hd/HdChouModel");
const ActShopFushiGModel_1 = require("../model/act/ActShopFushiGModel");
const HdJiYuanModel_1 = require("../model/hd/HdJiYuanModel");
const HdXianshiModel_1 = require("../model/hd/HdXianshiModel");
const ActGiftDtModel_1 = require("../model/act/ActGiftDtModel");
const HdJuBaoPenModel_1 = require("../model/hd/HdJuBaoPenModel");
const ActFuShiYhModel_1 = require("../model/act/ActFuShiYhModel");
const HdQiYuanModel_1 = require("../model/hd/HdQiYuanModel");
const HdHuanJingModel_1 = require("../model/hd/HdHuanJingModel");
const HdXinMoModel_1 = require("../model/hd/HdXinMoModel");
const HdHefuqdModel_1 = require("../model/hd/HdHefuqdModel");
const HdChumoModel_1 = require("../model/hd/HdChumoModel");
const HdZixuanModel_1 = require("../model/hd/HdZixuanModel");
const YlWechat_1 = __importDefault(require("../sdk/YlWechat"));
const HdLunHuiModel_1 = require("../model/hd/HdLunHuiModel");
const HdDayTeHuiModel_1 = require("../model/hd/HdDayTeHuiModel");
const HdNewJiYuanModel_1 = require("../model/hd/HdNewJiYuanModel");
const HdTianGongModel_1 = require("../model/hd/HdTianGongModel");
const HdYueGongModel_1 = require("../model/hd/HdYueGongModel");
const HdHuaLianModel_1 = require("../model/hd/HdHuaLianModel");
const HdShanheModel_1 = require("../model/hd/HdShanheModel");
const HdChongYangModel_1 = require("../model/hd/HdChongYangModel");
const ActShopJinTiaoModel_1 = require("../model/act/ActShopJinTiaoModel");
const hook_1 = require("../util/hook");
const HdDayTeJiaModel_1 = require("../model/hd/HdDayTeJiaModel");
const HdDengShenBangModel_1 = require("../model/hd/HdDengShenBangModel");
const router = new koa_router_1.default();
exports.router = router;
router.prefix("/kind10");
/**
 * @api {post} /kind10/xiadan 下单获取充值订单ID
 * @apiName 下单获取充值订单ID
 * @apiGroup kind10
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} kid  标识(协议的一级key)
 * @apiParam {string} hdcid 标识对应分组ID 没有发"1"  (协议的二级key)
 * @apiParam {string} dc 内部档次 没有发""
 * @apiParam {string} dc1 内部档次 没有发""
 */
router.all("/xiadan", async (ctx) => {
    ctx.state.apidesc = "充值-下单获取充值订单ID";
    const { uuid, kid, hdcid, dc, dc1 } = tool_1.tool.getParams(ctx);
    let uidInfo = await tool_1.tool.getInfoByUid(ctx);
    let typeMsg = {
        type: 0,
        msg: "",
        data: 0,
    };
    //检查是否可以下单
    switch (kid) {
        case "actShopDiaMond":
            let actShopDiaMondModel = ActShopDiaMondModel_1.ActShopDiaMondModel.getInstance(ctx, uuid);
            typeMsg = await actShopDiaMondModel.checkUp(dc);
            break;
        case "actShopJinTiao":
            let actShopJinTiaoModel = ActShopJinTiaoModel_1.ActShopJinTiaoModel.getInstance(ctx, uuid);
            typeMsg = await actShopJinTiaoModel.checkUp(dc);
            break;
        case "actShopRenWu": //皮肤商店 - 头像
            let actShopRenWuModel = ActShopRenWuModel_1.ActShopRenWuModel.getInstance(ctx, uuid);
            typeMsg = await actShopRenWuModel.checkUp(dc);
            break;
        case "actShopFushiG": //符石 - 礼包
            let actShopFushiGModel = ActShopFushiGModel_1.ActShopFushiGModel.getInstance(ctx, uuid);
            typeMsg = await actShopFushiGModel.checkUp(dc);
            break;
        case "hdNew": //新人礼包
            let hdNewModel = HdNewModel_1.HdNewModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdNewModel.checkUp();
            break;
        case "hdSpeGift": //特惠礼包
            let hdSpeGiftModel = HdSpeGiftModel_1.HdSpeGiftModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdSpeGiftModel.checkUp(dc);
            break;
        case "hdGrowthFund": //基金
            let hdGrowthFundModel = HdGrowthFundModel_1.HdGrowthFundModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdGrowthFundModel.checkUp();
            break;
        case "hdGrowthFundHh": //基金（豪华礼包）
            let hdGrowthFundModel1 = HdGrowthFundModel_1.HdGrowthFundModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdGrowthFundModel1.checkUp1();
            break;
        case "hdPriCard": //特权卡
            let hdPriCardModel = HdPriCardModel_1.HdPriCardModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdPriCardModel.checkUp();
            break;
        case "hdTimeBen": //限时福利
            let hdTimeBenModel = HdTimeBenModel_1.HdTimeBenModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdTimeBenModel.checkUp(dc, dc1);
            if (typeMsg.type == 2) {
                return;
            }
            break;
        case "hdTimeBen2": //限时福利 触发礼包 改版列表
            let hdTimeBen2Model = HdTimeBen2Model_1.HdTimeBen2Model.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdTimeBen2Model.checkUp(dc);
            break;
        case "actDongTian": //洞天礼包
            let actDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await actDongTianModel.checkUp(dc);
            break;
        case "hdLianchong": //连冲活动
            let hdLianchongModel = HdLianchongModel_1.HdLianchongModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdLianchongModel.checkUp();
            break;
        case "hdKaifu": //开服活动
            let hdKaifugModel = HdKaifuModel_1.HdKaifugModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdKaifugModel.checkUp(dc);
            break;
        case "hdChou": //九龙宝藏
            let hdChouModel = HdChouModel_1.HdChouModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdChouModel.checkUp(dc);
            break;
        case "hdJiYuanLock": //活动机缘 - 解锁礼包
            let hdJiYuanModel = HdJiYuanModel_1.HdJiYuanModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdJiYuanModel.checkUp(dc);
            break;
        case "hdJiYuanGift": //活动机缘 - 每日礼包
            let hdJiYuanModel1 = HdJiYuanModel_1.HdJiYuanModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdJiYuanModel1.checkUp1(dc);
            break;
        case "hdNewJiYuanLock": //新版机缘 - 解锁礼包
            let hdNewJiYuanModel = HdNewJiYuanModel_1.HdNewJiYuanModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdNewJiYuanModel.checkUp(dc);
            break;
        case "hdNewJiYuanLockYue": //新版机缘 - 解锁礼包 - 月
            let hdNewJiYuanModelyue = HdNewJiYuanModel_1.HdNewJiYuanModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdNewJiYuanModelyue.checkUp2(dc);
            break;
        case "hdNewJiYuanGift": //新版机缘 - 每日礼包
            let hdNewJiYuanModel1 = HdNewJiYuanModel_1.HdNewJiYuanModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdNewJiYuanModel1.checkUp1(dc);
            break;
        case "hdXianshi": //活动 - 独立限时礼包
            let hdXianshiModel = HdXianshiModel_1.HdXianshiModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdXianshiModel.checkUp();
            break;
        case "actGiftDt": //常规礼包 - 洞天
            let actGiftDtModel = ActGiftDtModel_1.ActGiftDtModel.getInstance(ctx, uuid);
            typeMsg = await actGiftDtModel.checkUp(dc);
            break;
        case "hdJuBaoPen": //活动 - 聚宝盆
            let hdJuBaoPenModel = HdJuBaoPenModel_1.HdJuBaoPenModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdJuBaoPenModel.checkUp(dc);
            break;
        case "actFuShiYh": //鱼获盛宴
            let actFuShiYhModel = ActFuShiYhModel_1.ActFuShiYhModel.getInstance(ctx, uuid);
            typeMsg = await actFuShiYhModel.checkUp(dc);
            break;
        case "hdQiYuan": //兽灵起源
            let hdQiYuanModel = HdQiYuanModel_1.HdQiYuanModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdQiYuanModel.checkUp(dc);
            break;
        case "hdHuanJing": //鱼灵幻境
            let hdHuanJingModel = HdHuanJingModel_1.HdHuanJingModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdHuanJingModel.checkUp(dc);
            break;
        case "hdXinMo": //破除心魔
            let hdXinMoModel = HdXinMoModel_1.HdXinMoModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdXinMoModel.checkUp(dc);
            break;
        case "hdHefuqdTh": //合服庆典 - 特惠礼包
            let hdHefuqdModel = HdHefuqdModel_1.HdHefuqdModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdHefuqdModel.checkUp(dc);
            break;
        case "hdHefuqdCard": //合服庆典 - 超级翻倍卡
            let hdHefuqdModel1 = HdHefuqdModel_1.HdHefuqdModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdHefuqdModel1.checkUp1();
            break;
        case "hdChumo": //合服 - 除魔卫道
            let hdChumoModel = HdChumoModel_1.HdChumoModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdChumoModel.checkUp(dc);
            break;
        case "hdZixuan": //自选礼包
            let hdZixuanModel = HdZixuanModel_1.HdZixuanModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdZixuanModel.checkUp(dc);
            break;
        case "hdLunHui": //天道轮回
            let hdLunHuiModel = HdLunHuiModel_1.HdLunHuiModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdLunHuiModel.checkUp(dc);
            break;
        case "hdDayTeHui": //每日特惠
            let hdDayTeHuiModel = HdDayTeHuiModel_1.HdDayTeHuiModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdDayTeHuiModel.checkUp(dc);
            break;
        case "hdTianGong": //天宫乐舞
            let hdTianGongModel = HdTianGongModel_1.HdTianGongModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdTianGongModel.checkUp(dc);
            break;
        case "hdYueGong": //月宫探宝
            let hdYueGongModel = HdYueGongModel_1.HdYueGongModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdYueGongModel.checkUp(dc);
            break;
        case "hdChongYang": //月宫探宝
            let hdChongYangModel = HdChongYangModel_1.HdChongYangModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdChongYangModel.checkUp(dc);
            break;
        case "hdHuaLian": //月宫探宝
            let hdHuaLianModel = HdHuaLianModel_1.HdHuaLianModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdHuaLianModel.checkUp(dc);
            break;
        case "hdShanhe": //月宫探宝
            let hdShanheModel = HdShanheModel_1.HdShanheModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdShanheModel.checkUp(dc);
            break;
        case "hdDayTeJia": //每日特价
            let hdDayTeJiaModel = HdDayTeJiaModel_1.HdDayTeJiaModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdDayTeJiaModel.checkUp(dc);
            break;
        case "hdDengShenBang": //登神榜
            let hdDengShenBangModel = HdDengShenBangModel_1.HdDengShenBangModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdDengShenBangModel.checkPay(dc);
            break;
        default:
            typeMsg.msg = "未定义下单kid：" + kid;
            break;
    }
    if (typeMsg.type == 0) {
        ctx.throw("下单错误");
    }
    let cfgOrder = setting_1.default.getSetting(ctx.state.sid, "order");
    if (cfgOrder == null || cfgOrder[uidInfo.plat] == null || cfgOrder[uidInfo.plat][typeMsg.data] == null) {
        ctx.throw(ctx.state.sid + uidInfo.plat + "充值档次错误" + typeMsg.data);
    }
    let userModel = UserModel_1.UserModel.getInstance(ctx, uuid);
    let user = await userModel.getInfo();
    let order_id = await mongodb_1.dbSev.getDataDb().getNextId("KIND10_ID");
    let orderInfo = {
        orderId: order_id.toString(),
        plat: uidInfo.plat,
        platOrderId: "",
        uid: user.uid,
        uuid: uuid,
        sid: ctx.state.sid,
        createAt: ctx.state.newTime,
        kid: kid,
        hdcid: hdcid,
        dc: dc,
        money: cfgOrder[uidInfo.plat][typeMsg.data].money,
        rmb: cfgOrder[uidInfo.plat][typeMsg.data].rmb,
        title: typeMsg.msg,
        overAt: 0,
        status: 0,
        param: [],
    };
    //立即写入数据库
    await mongodb_1.dbSev.getDataDb().insert("kind10", orderInfo);
    // if(typeMsg.kind10Cs == null){
    //     ctx.throw("计费点错误")
    // }
    ctx.state.master.addBackBuf({
        order10Id: order_id.toString(),
        order10cs: "com.dianhun.money_" + typeMsg.data
    });
    let cfgswitch = setting_1.default.getSetting("1", "switch");
    if (cfgswitch != null && cfgswitch.openPay == 2 || uidInfo.plat == "localbt") {
        let back = await ctx.state.master.kind10Success(order_id.toString(), uidInfo.plat + order_id, 2);
        console.log("===back==", back);
    }
});
/**
 * @api {post} /kind10/jintiaoBuy 金条购买
 * @apiName 金条购买
 * @apiGroup kind10
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} kid  标识(协议的一级key)
 * @apiParam {string} hdcid 标识对应分组ID 没有发"1"  (协议的二级key)
 * @apiParam {string} dc 内部档次 没有发""
 */
router.all("/jintiaoBuy", async (ctx) => {
    ctx.state.apidesc = "充值-金条购买";
    const { uuid, kid, hdcid, dc } = tool_1.tool.getParams(ctx);
    let typeMsg = {
        type: 0,
        msg: "",
        data: 0,
    };
    //检查是否可以下单
    switch (kid) {
        case "actShopDiaMond":
            let actShopDiaMondModel = ActShopDiaMondModel_1.ActShopDiaMondModel.getInstance(ctx, uuid);
            typeMsg = await actShopDiaMondModel.carryOut(dc);
            break;
        // case "actShopJinTiao":
        //     let actShopJinTiaoModel = ActShopJinTiaoModel.getInstance(ctx, uuid);
        //     typeMsg = await actShopJinTiaoModel.carryOut(dc);
        //     break;
        case "actShopRenWu": //皮肤商店 - 头像
            let actShopRenWuModel = ActShopRenWuModel_1.ActShopRenWuModel.getInstance(ctx, uuid);
            typeMsg = await actShopRenWuModel.carryOut(dc);
            break;
        case "actShopFushiG": //符石 - 礼包
            let actShopFushiGModel = ActShopFushiGModel_1.ActShopFushiGModel.getInstance(ctx, uuid);
            typeMsg = await actShopFushiGModel.carryOut(dc);
            break;
        case "hdNew": //新人礼包
            let hdNewModel = HdNewModel_1.HdNewModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdNewModel.carryOut();
            break;
        case "hdSpeGift": //特惠礼包
            let hdSpeGiftModel = HdSpeGiftModel_1.HdSpeGiftModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdSpeGiftModel.carryOut(dc);
            break;
        case "hdGrowthFund": //基金
            let hdGrowthFundModel = HdGrowthFundModel_1.HdGrowthFundModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdGrowthFundModel.carryOut();
            break;
        case "hdGrowthFundHh": //基金（豪华礼包）
            let hdGrowthFundModel1 = HdGrowthFundModel_1.HdGrowthFundModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdGrowthFundModel1.carryOut1();
            break;
        case "hdPriCard": //特权卡
            let hdPriCardModel = HdPriCardModel_1.HdPriCardModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdPriCardModel.carryOut();
            break;
        case "hdTimeBen": //限时福利
            let hdTimeBenModel = HdTimeBenModel_1.HdTimeBenModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdTimeBenModel.carryOut(dc);
            break;
        case "hdTimeBen2": //限时福利 触发礼包 改版列表
            let hdTimeBen2Model = HdTimeBen2Model_1.HdTimeBen2Model.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdTimeBen2Model.carryOut(dc);
            break;
        case "actDongTian": //洞天礼包
            let actDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await actDongTianModel.carryOut(dc);
            break;
        case "hdLianchong": //连冲活动
            let hdLianchongModel = HdLianchongModel_1.HdLianchongModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdLianchongModel.carryOut();
            break;
        case "hdKaifu": //开服活动
            let hdKaifugModel = HdKaifuModel_1.HdKaifugModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdKaifugModel.carryOut(dc);
            break;
        case "hdChou": //九龙宝藏
            let hdChouModel = HdChouModel_1.HdChouModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdChouModel.carryOut(dc);
            break;
        case "hdJiYuanLock": //活动机缘 - 解锁礼包
            let hdJiYuanModel = HdJiYuanModel_1.HdJiYuanModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdJiYuanModel.carryOut(dc);
            break;
        case "hdJiYuanGift": //活动机缘 - 每日礼包
            let hdJiYuanModel1 = HdJiYuanModel_1.HdJiYuanModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdJiYuanModel1.carryOut1(dc);
            break;
        case "hdNewJiYuanLock": //新版机缘 - 解锁礼包
            let hdNewJiYuanModel = HdNewJiYuanModel_1.HdNewJiYuanModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdNewJiYuanModel.carryOut(dc);
            break;
        case "hdNewJiYuanLockYue": //新版机缘 - 解锁礼包 - 月
            let hdNewJiYuanModelyue = HdNewJiYuanModel_1.HdNewJiYuanModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdNewJiYuanModelyue.carryOut2(dc);
            break;
        case "hdNewJiYuanGift": //新版机缘 - 每日礼包
            let hdNewJiYuanModel1 = HdNewJiYuanModel_1.HdNewJiYuanModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdNewJiYuanModel1.carryOut1(dc);
            break;
        case "hdXianshi": //活动 - 独立限时礼包
            let hdXianshiModel = HdXianshiModel_1.HdXianshiModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdXianshiModel.carryOut();
            break;
        case "actGiftDt": //常规礼包 - 洞天
            let actGiftDtModel = ActGiftDtModel_1.ActGiftDtModel.getInstance(ctx, uuid);
            typeMsg = await actGiftDtModel.carryOut(dc);
            break;
        case "hdJuBaoPen": //活动 - 聚宝盆
            let hdJuBaoPenModel = HdJuBaoPenModel_1.HdJuBaoPenModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdJuBaoPenModel.carryOut(dc);
            break;
        case "actFuShiYh": //鱼获盛宴
            let actFuShiYhModel = ActFuShiYhModel_1.ActFuShiYhModel.getInstance(ctx, uuid);
            typeMsg = await actFuShiYhModel.carryOut(dc);
            break;
        case "hdQiYuan": //兽灵起源
            let hdQiYuanModel = HdQiYuanModel_1.HdQiYuanModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdQiYuanModel.carryOut(dc);
            break;
        case "hdHuanJing": //鱼灵幻境
            let hdHuanJingModel = HdHuanJingModel_1.HdHuanJingModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdHuanJingModel.carryOut(dc);
            break;
        case "hdXinMo": //破除心魔
            let hdXinMoModel = HdXinMoModel_1.HdXinMoModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdXinMoModel.carryOut(dc);
            break;
        case "hdHefuqdTh": //合服庆典 - 特惠礼包
            let hdHefuqdModel = HdHefuqdModel_1.HdHefuqdModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdHefuqdModel.carryOut(dc);
            break;
        case "hdHefuqdCard": //合服庆典 - 超级翻倍卡
            let hdHefuqdModel1 = HdHefuqdModel_1.HdHefuqdModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdHefuqdModel1.carryOut1();
            break;
        case "hdChumo": //合服 - 除魔卫道
            let hdChumoModel = HdChumoModel_1.HdChumoModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdChumoModel.carryOut(dc);
            break;
        case "hdZixuan": //自选礼包
            let hdZixuanModel = HdZixuanModel_1.HdZixuanModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdZixuanModel.carryOut(dc);
            break;
        case "hdLunHui": //天道轮回
            let hdLunHuiModel = HdLunHuiModel_1.HdLunHuiModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdLunHuiModel.carryOut(dc);
            break;
        case "hdDayTeHui": //每日特惠
            let hdDayTeHuiModel = HdDayTeHuiModel_1.HdDayTeHuiModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdDayTeHuiModel.carryOut(dc);
            break;
        case "hdTianGong": //天宫乐舞
            let hdTianGongModel = HdTianGongModel_1.HdTianGongModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdTianGongModel.carryOut(dc);
            break;
        case "hdYueGong": //月宫探宝
            let hdYueGongModel = HdYueGongModel_1.HdYueGongModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdYueGongModel.carryOut(dc);
            break;
        case "hdChongYang": //月宫探宝
            let hdChongYangModel = HdChongYangModel_1.HdChongYangModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdChongYangModel.carryOut(dc);
            break;
        case "hdHuaLian": //月宫探宝
            let hdHuaLianModel = HdHuaLianModel_1.HdHuaLianModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdHuaLianModel.carryOut(dc);
            break;
        case "hdShanhe": //月宫探宝
            let hdShanheModel = HdShanheModel_1.HdShanheModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdShanheModel.carryOut(dc);
            break;
        case "hdDayTeJia": //每日特价
            let hdDayTeJiaModel = HdDayTeJiaModel_1.HdDayTeJiaModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdDayTeJiaModel.carryOut(dc);
            break;
        case "hdDengShenBang": //登神榜
            let hdDengShenBangModel = HdDengShenBangModel_1.HdDengShenBangModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdDengShenBangModel.carryOut(dc);
            break;
        default:
            typeMsg.msg = "未定义金条kid：" + kid;
            break;
    }
    if (typeMsg.type != 1) {
        ctx.throw(typeMsg.msg);
    }
    let uidInfo = await tool_1.tool.getInfoByUid(ctx);
    let cfgOrder = setting_1.default.getSetting(ctx.state.sid, "order");
    if (cfgOrder == null || cfgOrder[uidInfo.plat] == null || cfgOrder[uidInfo.plat][typeMsg.data] == null) {
        ctx.throw(ctx.state.sid + uidInfo.plat + "充值档次错误" + typeMsg.data);
    }
    let count = cfgOrder[uidInfo.plat][typeMsg.data].rmb;
    await ctx.state.master.subItem1([1, 8, count]);
    await hook_1.hookNote(ctx, "chongzhi", count);
});
/**
 * @api {post} /kind10/ylWechat 仙剑问道米大师安卓
 * @apiName 仙剑问道米大师安卓
 * @apiGroup kind10
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} order10Id 下单返回的订单ID
 * @apiParam {string} wxcode 前端code
 *
 */
router.all("/ylWechat", async (ctx) => {
    ctx.state.apidesc = "充值-仙剑问道米大师安卓";
    await YlWechat_1.default.zhifuAndriod(ctx);
});
/**
 * @api {post} /kind10/ylSend 仙剑问道发送客服消息
 * @apiName 仙剑问道发送客服消息
 * @apiGroup kind10
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} order10Id 下单返回的订单ID
 *
 */
router.all("/ylSend", async (ctx) => {
    ctx.state.apidesc = "充值-仙剑问道发送客服消息";
    await YlWechat_1.default.zhifuIosSend(ctx);
});
//# sourceMappingURL=kind10.js.map