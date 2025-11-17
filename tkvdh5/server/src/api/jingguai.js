"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tool_1 = require("../util/tool");
const ActJingGuaiModel_1 = require("../model/act/ActJingGuaiModel");
const router = new koa_router_1.default();
exports.router = router;
router.prefix("/jingguai");
/**
 * @api {post} /jingguai/dazao 打造精怪
 * @apiName 打造精怪
 * @apiGroup jingguai
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {number} count 次数
 */
router.all("/dazao", async (ctx) => {
    ctx.state.apidesc = "精怪-打造精怪";
    const { uuid, count } = tool_1.tool.getParams(ctx);
    if (count < 1) {
        ctx.throw("参数错误");
    }
    let actJingGuaiModel = ActJingGuaiModel_1.ActJingGuaiModel.getInstance(ctx, uuid);
    await actJingGuaiModel.dazao(count);
});
/**
 * @api {post} /jingguai/shangzhen 上阵
 * @apiName 上阵
 * @apiGroup jingguai
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} id1 阵容ID
 * @apiParam {number} id2 下标ID
 * @apiParam {string} jgid 精怪ID
 */
router.all("/shangzhen", async (ctx) => {
    ctx.state.apidesc = "精怪-上阵";
    const { uuid, id1, id2, jgid } = tool_1.tool.getParams(ctx);
    let actJingGuaiModel = ActJingGuaiModel_1.ActJingGuaiModel.getInstance(ctx, uuid);
    await actJingGuaiModel.shangzhen(id1, id2, jgid);
});
/**
 * @api {post} /jingguai/qiehuan 切换阵容
 * @apiName 切换阵容
 * @apiGroup jingguai
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} id 阵容ID
 */
router.all("/qiehuan", async (ctx) => {
    ctx.state.apidesc = "精怪-切换阵容";
    const { uuid, id } = tool_1.tool.getParams(ctx);
    let actJingGuaiModel = ActJingGuaiModel_1.ActJingGuaiModel.getInstance(ctx, uuid);
    await actJingGuaiModel.qiehuan(id);
});
/**
 * @api {post} /jingguai/uplevel 升级
 * @apiName 升级
 * @apiGroup jingguai
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} jgid 精怪ID
 */
router.all("/uplevel", async (ctx) => {
    ctx.state.apidesc = "精怪-升级";
    const { uuid, jgid } = tool_1.tool.getParams(ctx);
    let actJingGuaiModel = ActJingGuaiModel_1.ActJingGuaiModel.getInstance(ctx, uuid);
    await actJingGuaiModel.uplevel(jgid);
});
/**
 * @api {post} /jingguai/fenjie 碎片分解
 * @apiName 碎片分解
 * @apiGroup jingguai
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string[]} jgids 精怪ID列表
 * @apiParam {number[]} pzs 品质列表
 */
router.all("/fenjie", async (ctx) => {
    ctx.state.apidesc = "精怪-碎片分解";
    const { uuid, jgids, pzs } = tool_1.tool.getParams(ctx);
    let actJingGuaiModel = ActJingGuaiModel_1.ActJingGuaiModel.getInstance(ctx, uuid);
    await actJingGuaiModel.fenjie(jgids, pzs);
});
/**
 * @api {post} /jingguai/hecheng 合成精怪
 * @apiName 合成精怪
 * @apiGroup jingguai
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} jgid 精怪ID
 */
router.all("/hecheng", async (ctx) => {
    ctx.state.apidesc = "精怪-碎片分解";
    const { uuid, jgid } = tool_1.tool.getParams(ctx);
    let actJingGuaiModel = ActJingGuaiModel_1.ActJingGuaiModel.getInstance(ctx, uuid);
    await actJingGuaiModel.hecheng(jgid);
});
//# sourceMappingURL=jingguai.js.map