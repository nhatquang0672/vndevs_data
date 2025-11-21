"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tool_1 = require("../util/tool");
const MailModel_1 = require("../model/user/MailModel");
const router = new koa_router_1.default();
exports.router = router;
router.prefix('/mail');
/**
 * @api {post} /mail/rwd 领取邮件奖励
 * @apiName 领取邮件奖励
 * @apiGroup mail
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} xbid 邮件ID
 */
router.all('/rwd', async (ctx) => {
    ctx.state.apidesc = "邮件-领取邮件奖励";
    const { uuid, xbid } = tool_1.tool.getParams(ctx);
    let mailModel = MailModel_1.MailModel.getInstance(ctx, uuid);
    await mailModel.redMail(xbid);
});
/**
 * @api {post} /mail/rwdAll 一键领取邮件奖励
 * @apiName 一键领取邮件奖励
 * @apiGroup mail
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 */
router.all('/rwdAll', async (ctx) => {
    ctx.state.apidesc = "邮件-一键领取邮件奖励";
    const { uuid } = tool_1.tool.getParams(ctx);
    let mailModel = MailModel_1.MailModel.getInstance(ctx, uuid);
    await mailModel.redAllMail();
});
/**
 * @api {post} /mail/del 删除邮件
 * @apiName 删除邮件
 * @apiGroup mail
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} xbid 邮件ID
 */
router.all('/del', async (ctx) => {
    ctx.state.apidesc = "邮件-删除邮件";
    const { uuid, xbid } = tool_1.tool.getParams(ctx);
    let mailModel = MailModel_1.MailModel.getInstance(ctx, uuid);
    await mailModel.delMail(xbid);
});
/**
 * @api {post} /mail/delAll 一键删除邮件
 * @apiName 一键删除邮件
 * @apiGroup mail
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 */
router.all('/delAll', async (ctx) => {
    ctx.state.apidesc = "邮件-一键删除邮件";
    const { uuid } = tool_1.tool.getParams(ctx);
    let mailModel = MailModel_1.MailModel.getInstance(ctx, uuid);
    await mailModel.delAllMail();
});
//# sourceMappingURL=mail.js.map