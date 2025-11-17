"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tool_1 = require("../util/tool");
const ActHuanJingModel_1 = require("../model/act/ActHuanJingModel");
const router = new koa_router_1.default();
exports.router = router;
router.prefix('/huanjing');
/**
 * @api {post} /huanjing/jiesuo 幻境阁解锁
 * @apiName 幻境阁解锁
 * @apiGroup huanjing
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} id 需要解锁的id
 *
 */
router.all('/jiesuo', async (ctx) => {
    ctx.state.apidesc = "幻境阁-解锁";
    const { uuid, id } = tool_1.tool.getParams(ctx);
    let actHuanJingModel = ActHuanJingModel_1.ActHuanJingModel.getInstance(ctx, uuid);
    await actHuanJingModel.jiesuo(id);
});
/**
 * @api {post} /huanjing/setpf 幻境阁设置皮肤
 * @apiName 幻境阁设置皮肤
 * @apiGroup huanjing
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} id 设置id
 *
 */
router.all('/setpf', async (ctx) => {
    ctx.state.apidesc = "幻境阁-设置皮肤";
    const { uuid, id } = tool_1.tool.getParams(ctx);
    let actHuanJingModel = ActHuanJingModel_1.ActHuanJingModel.getInstance(ctx, uuid);
    await actHuanJingModel.setpf(id);
});
/**
 * @api {post} /huanjing/setcj 幻境阁设置场景
 * @apiName 幻境阁设置场景
 * @apiGroup huanjing
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} id 设置id
 *
 */
router.all('/setcj', async (ctx) => {
    ctx.state.apidesc = "幻境阁-设置场景";
    const { uuid, id } = tool_1.tool.getParams(ctx);
    let actHuanJingModel = ActHuanJingModel_1.ActHuanJingModel.getInstance(ctx, uuid);
    await actHuanJingModel.setcj(id);
});
//# sourceMappingURL=huanjing.js.map