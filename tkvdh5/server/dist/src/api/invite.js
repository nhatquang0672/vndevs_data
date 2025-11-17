"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tool_1 = require("../util/tool");
const ActInviteModel_1 = require("../model/act/ActInviteModel");
const router = new koa_router_1.default();
exports.router = router;
router.prefix("/invite");
/**
 * @api {post} /invite/dailySend 完成了每日分享
 * @apiName 完成了每日分享
 * @apiGroup invite
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 */
router.all("/dailySend", async (ctx) => {
    ctx.state.apidesc = "分享-完成了每日分享";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actInviteModel = ActInviteModel_1.ActInviteModel.getInstance(ctx, uuid);
    await actInviteModel.daily_send();
});
/**
 * @api {post} /invite/dailyRwd 领取每日分享奖励
 * @apiName 领取每日分享奖励
 * @apiGroup invite
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 */
router.all("/dailyRwd", async (ctx) => {
    ctx.state.apidesc = "分享-领取每日分享奖励";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actInviteModel = ActInviteModel_1.ActInviteModel.getInstance(ctx, uuid);
    await actInviteModel.daily_rwd();
});
/**
 * @api {post} /invite/groupSend 发群点进来
 * @apiName 发群点进来
 * @apiGroup invite
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 */
router.all("/groupSend", async (ctx) => {
    ctx.state.apidesc = "分享-发群点进来";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actInviteModel = ActInviteModel_1.ActInviteModel.getInstance(ctx, uuid);
    await actInviteModel.group_send();
});
/**
 * @api {post} /invite/groupRwd 领取发群奖励
 * @apiName 领取发群奖励
 * @apiGroup invite
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 */
router.all("/groupRwd", async (ctx) => {
    ctx.state.apidesc = "分享-领取发群奖励";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actInviteModel = ActInviteModel_1.ActInviteModel.getInstance(ctx, uuid);
    await actInviteModel.group_rwd();
});
/**
 * @api {post} /invite/invsRwd 领取邀请好友奖励
 * @apiName 领取邀请好友奖励
 * @apiGroup invite
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} id 奖励档次
 */
router.all("/invsRwd", async (ctx) => {
    ctx.state.apidesc = "分享-领取邀请好友奖励";
    const { uuid, id } = tool_1.tool.getParams(ctx);
    let actInviteModel = ActInviteModel_1.ActInviteModel.getInstance(ctx, uuid);
    await actInviteModel.invs_rwd(id);
});
//# sourceMappingURL=invite.js.map