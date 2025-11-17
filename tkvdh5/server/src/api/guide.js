"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tool_1 = require("../util/tool");
const ActGuideModel_1 = require("../model/act/ActGuideModel");
const router = new koa_router_1.default();
exports.router = router;
router.prefix('/guide');
/**
 * @api {post} /guide/doGuide 做新手引导
 * @apiName 做新手引导
 * @apiGroup guide
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} id 步骤ID
 * @apiParam {string[]} param 参数
 */
router.all('/doGuide', async (ctx) => {
    ctx.state.apidesc = "新手引导-做新手引导";
    const { uuid, id } = tool_1.tool.getParams(ctx);
    let actGuideModel = ActGuideModel_1.ActGuideModel.getInstance(ctx, uuid);
    await actGuideModel.doGuide(id);
});
//# sourceMappingURL=guide.js.map