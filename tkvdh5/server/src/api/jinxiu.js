"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tool_1 = require("../util/tool");
const ActJinxiuModel_1 = require("../model/act/ActJinxiuModel");
const router = new koa_router_1.default();
exports.router = router;
router.prefix('/jinxiu');
/**
 * @api {post} /jinxiu/upStep 解锁升阶
 * @apiName 解锁升阶
 * @apiGroup jinxiu
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} tzid 套装ID
 *
 */
router.all('/upStep', async (ctx) => {
    ctx.state.apidesc = "锦绣坊-解锁升阶";
    const { uuid, tzid } = tool_1.tool.getParams(ctx);
    let actJinxiuModel = ActJinxiuModel_1.ActJinxiuModel.getInstance(ctx, uuid);
    await actJinxiuModel.upStep(tzid);
});
/**
 * @api {post} /jinxiu/fenxiang 分享
 * @apiName 分享
 * @apiGroup jinxiu
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} tzid 套装ID
 *
 */
router.all('/fenxiang', async (ctx) => {
    ctx.state.apidesc = "锦绣坊-分享";
    const { uuid, tzid } = tool_1.tool.getParams(ctx);
    let actJinxiuModel = ActJinxiuModel_1.ActJinxiuModel.getInstance(ctx, uuid);
    await actJinxiuModel.fenxiang(tzid);
});
/**
 * @api {post} /jinxiu/setTzid 设置套装ID
 * @apiName 设置套装ID
 * @apiGroup jinxiu
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} tzid 套装ID
 *
 */
router.all('/setTzid', async (ctx) => {
    ctx.state.apidesc = "锦绣坊-设置套装ID";
    const { uuid, tzid } = tool_1.tool.getParams(ctx);
    let actJinxiuModel = ActJinxiuModel_1.ActJinxiuModel.getInstance(ctx, uuid);
    await actJinxiuModel.setTzid(tzid);
});
/**
 * @api {post} /jinxiu/hcTz 合成套装
 * @apiName 合成套装
 * @apiGroup jinxiu
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} tzid 套装ID
 *
 */
router.all('/hcTz', async (ctx) => {
    ctx.state.apidesc = "锦绣坊-合成套装";
    const { uuid, tzid } = tool_1.tool.getParams(ctx);
    let actJinxiuModel = ActJinxiuModel_1.ActJinxiuModel.getInstance(ctx, uuid);
    await actJinxiuModel.hcTz(tzid);
});
//# sourceMappingURL=jinxiu.js.map