"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tool_1 = require("../util/tool");
const Xys = __importStar(require("../../common/Xys"));
const SevChatModel_1 = require("../model/sev/SevChatModel");
const game_1 = __importDefault(require("../util/game"));
const lock_1 = __importDefault(require("../util/lock"));
const setting_1 = __importDefault(require("../crontab/setting"));
const ActClubModel_1 = require("../model/act/ActClubModel");
const cache_1 = __importDefault(require("../util/cache"));
const ActTaskMainModel_1 = require("../model/act/ActTaskMainModel");
const YlWechat_1 = __importDefault(require("../sdk/YlWechat"));
const router = new koa_router_1.default();
exports.router = router;
router.prefix("/chat");
/**
 * @api {post} /chat/send 发送聊天信息
 * @apiName 发送聊天信息
 * @apiGroup chat
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 渠道类型(合服hefu|所有服all|公会club|跨服kua)
 * @apiParam {string} type 聊天类型1默认2表情3公会日志
 * @apiParam {string} str 语句
 */
router.all("/send", async (ctx) => {
    ctx.state.apidesc = "聊天-发送聊天信息";
    const { uuid, hdcid, type, str } = tool_1.tool.getParams(ctx);
    let _sid = ctx.state.sid;
    if (setting_1.default.isBan(uuid, "1", ctx.state.newTime) == true) {
        ctx.throw("聊天已被限制，请联系客服！");
    }
    switch (hdcid) {
        case Xys.ChannelType.hefu:
            let list = setting_1.default.getQufus();
            if (list[_sid] == null) {
                ctx.throw("参数错误");
            }
            _sid = list[_sid].heid;
            break;
        case Xys.ChannelType.all:
            _sid = "0";
            break;
        case Xys.ChannelType.club:
            YlWechat_1.default.msg_sec_check(ctx, str, uuid);
            //获取玩家公会ID
            let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
            _sid = await actClubModel.clickClub(true); //获取公会ID
            break;
        case Xys.ChannelType.kua:
            YlWechat_1.default.msg_sec_check(ctx, str, uuid);
            // let list2 = Setting.getQufus();
            // if (list2[_sid] == null) {
            //     ctx.throw("参数错误");
            // }
            let actTaskMainModel = await ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
            if (await actTaskMainModel.kaiqi("1700") != 1) {
                ctx.throw("功能未开启");
            }
            _sid = await ctx.state.master.getChatKuaId(_sid);
            break;
        default:
            ctx.throw("参数错误");
            break;
    }
    await lock_1.default.setLock(ctx, "chat_" + hdcid + "_" + _sid, _sid);
    let sevChatModel = SevChatModel_1.SevChatModel.getInstance(ctx, _sid, hdcid);
    let data = {
        id: 0,
        type: type,
        user: await cache_1.default.getFUser(ctx, uuid, 1),
        msg: str,
        time: game_1.default.getNowTime(),
    };
    await sevChatModel.add(data);
});
/**
 * @api {post} /chat/history 查询历史聊天信息
 * @apiName 查询历史聊天信息
 * @apiGroup chat
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} hdcid 渠道类型(合服hefu|所有服all|公会club)
 * @apiParam {number} lastId 最小的聊天ID
 */
router.all("/history", async (ctx) => {
    ctx.state.apidesc = "聊天-查询历史聊天信息";
    const { uuid, hdcid, lastId } = tool_1.tool.getParams(ctx);
    let _sid = ctx.state.sid;
    switch (hdcid) {
        case Xys.ChannelType.hefu:
            let list = setting_1.default.getQufus();
            if (list[_sid] == null) {
                ctx.throw("参数错误");
            }
            _sid = list[_sid].heid;
            break;
        case Xys.ChannelType.all:
            _sid = "0";
            break;
        case Xys.ChannelType.club:
            //获取玩家公会ID
            let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
            _sid = await actClubModel.clickClub(true);
            break;
        case Xys.ChannelType.kua:
            _sid = await ctx.state.master.getChatKuaId(_sid);
            break;
        default:
            ctx.throw("参数错误");
            break;
    }
    lock_1.default.setLock(ctx, "chat_" + hdcid + "_" + _sid, _sid);
    let sevChatModel = new SevChatModel_1.SevChatModel(ctx, _sid, hdcid);
    await sevChatModel.backData_history(lastId);
});
//# sourceMappingURL=chat.js.map