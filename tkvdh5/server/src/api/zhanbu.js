"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tool_1 = require("../util/tool");
const ActZhanbuModel_1 = require("../model/act/ActZhanbuModel");
const router = new koa_router_1.default();
exports.router = router;
router.prefix("/zhanbu");
/**
 * @api {post} /zhanbu/xuandajiang 占卜选大奖
 * @apiName 占卜选大奖
 * @apiGroup zhanbu
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} id 选中ID
 */
router.all("/xuandajiang", async (ctx) => {
    ctx.state.apidesc = "运势-占卜选大奖";
    const { uuid, id } = tool_1.tool.getParams(ctx);
    let actZhanbuModel = ActZhanbuModel_1.ActZhanbuModel.getInstance(ctx, uuid);
    await actZhanbuModel.xuandajiang(id);
});
/**
 * @api {post} /zhanbu/choujiang 占卜转盘道具抽奖
 * @apiName 占卜转盘道具抽奖
 * @apiGroup zhanbu
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 */
router.all("/choujiang", async (ctx) => {
    ctx.state.apidesc = "运势-占卜转盘道具抽奖";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actZhanbuModel = ActZhanbuModel_1.ActZhanbuModel.getInstance(ctx, uuid);
    await actZhanbuModel.choujiang(0);
});
/**
 * @api {post} /zhanbu/ptrwd 普通领取奖励
 * @apiName 普通领取奖励
 * @apiGroup zhanbu
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 */
router.all("/ptrwd", async (ctx) => {
    ctx.state.apidesc = "运势-普通领取奖励";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actZhanbuModel = ActZhanbuModel_1.ActZhanbuModel.getInstance(ctx, uuid);
    await actZhanbuModel.rwd(1);
});
//# sourceMappingURL=zhanbu.js.map