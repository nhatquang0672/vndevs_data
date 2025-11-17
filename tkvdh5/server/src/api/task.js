"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tool_1 = require("../util/tool");
const ActTaskMainModel_1 = require("../model/act/ActTaskMainModel");
const router = new koa_router_1.default();
exports.router = router;
router.prefix('/task');
/**
 * @api {post} /task/rwd 领取主线任务
 * @apiName 领取主线任务
 * @apiGroup task
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 */
router.all('/rwd', async (ctx) => {
    ctx.state.apidesc = "主线任务-领取主线任务";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.taskRwd();
});
//# sourceMappingURL=task.js.map