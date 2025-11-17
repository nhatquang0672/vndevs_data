"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tool_1 = require("../util/tool");
const ActShengQiModel_1 = require("../model/act/ActShengQiModel");
const router = new koa_router_1.default();
exports.router = router;
router.prefix('/shengqi');
/**
 * @api {post} /shengqi/chou 开启圣器宝箱
 * @apiName 开启圣器宝箱
 * @apiGroup shengqi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 */
router.all('/chou', async (ctx) => {
    ctx.state.apidesc = "法器-开启圣器宝箱";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actShengQiModel = ActShengQiModel_1.ActShengQiModel.getInstance(ctx, uuid);
    await actShengQiModel.chou();
});
/**
 * @api {post} /shengqi/upLevel 激活或升级
 * @apiName 激活或升级
 * @apiGroup shengqi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} sqId 圣器ID
 */
router.all('/upLevel', async (ctx) => {
    ctx.state.apidesc = "法器-激活或升级";
    const { uuid, sqId } = tool_1.tool.getParams(ctx);
    let actShengQiModel = ActShengQiModel_1.ActShengQiModel.getInstance(ctx, uuid);
    await actShengQiModel.upLevel(sqId);
});
/**
 * @api {post} /shengqi/chuandai 穿戴
 * @apiName 穿戴
 * @apiGroup shengqi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} sqId 圣器ID
 */
router.all('/chuandai', async (ctx) => {
    ctx.state.apidesc = "法器-穿戴";
    const { uuid, sqId } = tool_1.tool.getParams(ctx);
    let actShengQiModel = ActShengQiModel_1.ActShengQiModel.getInstance(ctx, uuid);
    await actShengQiModel.chuandai(sqId);
});
/**
 * @api {post} /shengqi/lookLog 查看获奖记录
 * @apiName 查看获奖记录
 * @apiGroup shengqi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 */
router.all('/lookLog', async (ctx) => {
    ctx.state.apidesc = "法器-查看获奖记录";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actShengQiModel = ActShengQiModel_1.ActShengQiModel.getInstance(ctx, uuid);
    await actShengQiModel.backData_u(['log']);
});
//# sourceMappingURL=shengqi.js.map