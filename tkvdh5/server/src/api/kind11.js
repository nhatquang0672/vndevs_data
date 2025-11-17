"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tool_1 = require("../util/tool");
const mongodb_1 = require("../util/mongodb");
const ActBoxModel_1 = require("../model/act/ActBoxModel");
const HdWelChestModel_1 = require("../model/hd/HdWelChestModel");
const ActZhanbuModel_1 = require("../model/act/ActZhanbuModel");
const ActPvwModel_1 = require("../model/act/ActPvwModel");
const ActFuShiModel_1 = require("../model/act/ActFuShiModel");
const ActDongTianModel_1 = require("../model/act/ActDongTianModel");
const ActShopKind11Model_1 = require("../model/act/ActShopKind11Model");
const ActZhaoCaiModel_1 = require("../model/act/ActZhaoCaiModel");
const ActLonggongModel_1 = require("../model/act/ActLonggongModel");
const ActFazhenModel_1 = require("../model/act/ActFazhenModel");
const HdYueGongModel_1 = require("../model/hd/HdYueGongModel");
const HdShanheModel_1 = require("../model/hd/HdShanheModel");
const HdChongYangModel_1 = require("../model/hd/HdChongYangModel");
const ActWanXiangModel_1 = require("../model/act/ActWanXiangModel");
const gameMethod_1 = require("../../common/gameMethod");
const router = new koa_router_1.default();
exports.router = router;
router.prefix("/kind11");
/**
 * @api {post} /kind11/xiadan 下单获取广告订单ID
 * @apiName 下单获取广告订单ID
 * @apiGroup kind11
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} kid  标识(协议的一级key)
 * @apiParam {string} hdcid 标识对应分组ID 没有发"1"  (协议的二级key)
 * @apiParam {string} dc 内部档次 没有发""
 */
router.all("/xiadan", async (ctx) => {
    ctx.state.apidesc = "广告-下单获取广告订单ID";
    const { uuid, kid, hdcid, dc } = tool_1.tool.getParams(ctx);
    let uidInfo = await tool_1.tool.getInfoByUid(ctx);
    let typeMsg = {
        type: 0,
        msg: "",
        data: 0,
    };
    //检查是否可以下单
    switch (kid) {
        case "actBox": //宝箱进阶广告加速
            let actBoxModel = ActBoxModel_1.ActBoxModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await actBoxModel.checkUp();
            break;
        case "actBoxStep": //宝箱进阶广告加速
            let actBoxModel1 = ActBoxModel_1.ActBoxModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await actBoxModel1.checkUp1();
            break;
        case "actZhanbu": //抽奖 占卜转盘
            let actZhanbuModel = ActZhanbuModel_1.ActZhanbuModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await actZhanbuModel.checkUp();
            break;
        case "actZhanbuRwd": //抽奖 占卜转盘翻倍奖励
            let actZhanbuModel1 = ActZhanbuModel_1.ActZhanbuModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await actZhanbuModel1.checkUp1();
            break;
        case "actPvw": //试炼 速战
            let actPvwModel = ActPvwModel_1.ActPvwModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await actPvwModel.checkUp();
            break;
        case "hdWelChest": //福利宝箱
            let hdWelChestModel = HdWelChestModel_1.HdWelChestModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdWelChestModel.checkUp();
            break;
        case "actFuShi": //符石进阶广告加速
            let actFuShiModel = ActFuShiModel_1.ActFuShiModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await actFuShiModel.checkUp();
            break;
        case "actDongTian": //广告下单刷新列表
            let actDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await actDongTianModel.checkUp11();
            break;
        case "actShopKind11": //广告商店
            let actShopKind11Model = ActShopKind11Model_1.ActShopKind11Model.getInstance(ctx, uuid, hdcid);
            typeMsg = await actShopKind11Model.checkUp(dc);
            break;
        case "actZhaoCai": //招财幡
            let actZhaoCaiModel = ActZhaoCaiModel_1.ActZhaoCaiModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await actZhaoCaiModel.checkUp();
            break;
        case "actLonggong": //龙宫运宝
            let actLonggongModel = ActLonggongModel_1.ActLonggongModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await actLonggongModel.checkUp();
            break;
        case "actFazhen": //新版灵兽抽取看广告
            let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await actFazhenModel.checkUp();
            break;
        case "hdYueGong": //月宫探宝
            let hdYueGongModel = HdYueGongModel_1.HdYueGongModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdYueGongModel.checkUp11(dc);
            break;
        case "hdChongYang": //重阳
            let hdChongYangModel = HdChongYangModel_1.HdChongYangModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdChongYangModel.checkUp11(dc);
            break;
        case "hdShanhe": //山河庆典
            let hdShanheModel = HdShanheModel_1.HdShanheModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await hdShanheModel.checkUp11(dc);
            break;
        case "actWanXiang": //万象
            let actWanXiangModel = ActWanXiangModel_1.ActWanXiangModel.getInstance(ctx, uuid, hdcid);
            typeMsg = await actWanXiangModel.checkUp11();
            break;
        default:
            typeMsg.msg = "未定义下单kid：" + kid;
            break;
    }
    if (typeMsg.type == 0) {
        ctx.throw("下单错误");
    }
    let order_id = await mongodb_1.dbSev.getDataDb().getNextId("KIND11_ID");
    let orderInfo = {
        orderId: order_id.toString(),
        plat: uidInfo.plat,
        platOrderId: "",
        uuid: uuid,
        sid: ctx.state.sid,
        createAt: ctx.state.newTime,
        kid: kid,
        hdcid: hdcid,
        dc: dc,
        title: typeMsg.msg,
        overAt: 0,
        param: [],
    };
    //立即写入数据库
    await mongodb_1.dbSev.getDataDb().insert("kind11", orderInfo);
    ctx.state.master.addBackBuf({ order11Id: order_id.toString() });
    if (uidInfo.plat == "taobao") {
        const { open_id } = tool_1.tool.getParams(ctx);
        let back = await mongodb_1.dbSev.getDataDb().findOne("tb_kind11", { openid: open_id });
        if (back != null && gameMethod_1.gameMethod.isEmpty(back.time) == false && gameMethod_1.gameMethod.isEmpty(back.kind11Id) == false) {
            await ctx.state.master.kind11Success(back.kind11Id, back.kind11Id);
        }
        await mongodb_1.dbSev.getDataDb().update("tb_kind11", { openid: open_id }, {
            "openid": open_id,
            "kind11Id": order_id.toString(),
            "time": 0
        }, true);
    }
});
/**
 * @api {post} /kind11/success 成功回调领取
 * @apiName 成功回调领取
 * @apiGroup kind11
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} order11Id 看广告返回订单ID
 */
router.all("/success", async (ctx) => {
    ctx.state.apidesc = "广告-成功回调领取";
    const { order11Id } = tool_1.tool.getParams(ctx);
    await ctx.state.master.kind11Success(order11Id, order11Id);
});
//# sourceMappingURL=kind11.js.map