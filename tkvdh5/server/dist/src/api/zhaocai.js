"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tool_1 = require("../util/tool");
const ActZhaoCaiModel_1 = require("../model/act/ActZhaoCaiModel");
const router = new koa_router_1.default();
exports.router = router;
router.prefix('/zhaocai');
/**
 * @api {post} /zhaocai/zhaohuan 招财幡召唤
 * @apiName 招财幡召唤
 * @apiGroup zhaocai
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all('/zhaohuan', async (ctx) => {
    ctx.state.apidesc = "运势-招财幡召唤";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actZhaoCaiModel = ActZhaoCaiModel_1.ActZhaoCaiModel.getInstance(ctx, uuid);
    await actZhaoCaiModel.zhaohuan();
});
/**
 * @api {post} /zhaocai/buyTili 招财幡购买体力
 * @apiName 招财幡购买体力
 * @apiGroup zhaocai
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all('/buyTili', async (ctx) => {
    ctx.state.apidesc = "运势-招财幡购买体力";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actZhaoCaiModel = ActZhaoCaiModel_1.ActZhaoCaiModel.getInstance(ctx, uuid);
    await actZhaoCaiModel.buyTili();
});
/**
 * @api {post} /zhaocai/upStep 招财幡升阶
 * @apiName 招财幡升阶
 * @apiGroup zhaocai
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all('/upStep', async (ctx) => {
    ctx.state.apidesc = "运势-招财幡升阶";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actZhaoCaiModel = ActZhaoCaiModel_1.ActZhaoCaiModel.getInstance(ctx, uuid);
    await actZhaoCaiModel.upStep();
});
/**
 * @api {post} /zhaocai/rwd 招财幡领取奖励
 * @apiName 招财幡领取奖励
 * @apiGroup zhaocai
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all('/rwd', async (ctx) => {
    ctx.state.apidesc = "运势-招财幡领取奖励";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actZhaoCaiModel = ActZhaoCaiModel_1.ActZhaoCaiModel.getInstance(ctx, uuid);
    await actZhaoCaiModel.rwd();
});
/**
 * @api {post} /zhaocai/kind11Buy 看广告消耗钻石
 * @apiName 看广告消耗钻石
 * @apiGroup zhaocai
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all('/kind11Buy', async (ctx) => {
    ctx.state.apidesc = "运势-看广告消耗钻石";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actZhaoCaiModel = ActZhaoCaiModel_1.ActZhaoCaiModel.getInstance(ctx, uuid);
    await actZhaoCaiModel.kind11Buy();
});
//# sourceMappingURL=zhaocai.js.map