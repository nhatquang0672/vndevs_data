"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tool_1 = require("../util/tool");
const ActLiuDaoModel_1 = require("../model/act/ActLiuDaoModel");
const router = new koa_router_1.default();
exports.router = router;
router.prefix('/liudao');
/**
 * @api {post} /liudao/fight 六道战斗
 * @apiName 六道战斗
 * @apiGroup liudao
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all('/fight', async (ctx) => {
    ctx.state.apidesc = "六道秘境-战斗";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actLiuDaoModel = ActLiuDaoModel_1.ActLiuDaoModel.getInstance(ctx, uuid);
    await actLiuDaoModel.fight_one();
});
/**
 * @api {post} /liudao/saodang 六道扫荡
 * @apiName 六道扫荡
 * @apiGroup liudao
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all('/saodang', async (ctx) => {
    ctx.state.apidesc = "六道秘境-扫荡";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actLiuDaoModel = ActLiuDaoModel_1.ActLiuDaoModel.getInstance(ctx, uuid);
    await actLiuDaoModel.saodang();
});
/**
 * @api {post} /liudao/getCj5 获取成就进榜的5名玩家
 * @apiName 获取成就进榜的5名玩家
 * @apiGroup liudao
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} id 成就档次
 *
 */
router.all('/getCj5', async (ctx) => {
    ctx.state.apidesc = "六道秘境-获取成就进榜的5名玩家";
    const { uuid, id } = tool_1.tool.getParams(ctx);
    let actLiuDaoModel = ActLiuDaoModel_1.ActLiuDaoModel.getInstance(ctx, uuid);
    await actLiuDaoModel.getCj5(id);
});
/**
 * @api {post} /liudao/sevCjRwd 领取全服成就奖励
 * @apiName 领取成就奖励
 * @apiGroup liudao
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} id 成就档次
 *
 */
router.all('/sevCjRwd', async (ctx) => {
    ctx.state.apidesc = "六道秘境-领取成就奖励";
    const { uuid, id } = tool_1.tool.getParams(ctx);
    let actLiuDaoModel = ActLiuDaoModel_1.ActLiuDaoModel.getInstance(ctx, uuid);
    await actLiuDaoModel.sevCjRwd(id);
});
/**
 * @api {post} /liudao/actCjRwd 领取个人成就奖励
 * @apiName 领取成就奖励
 * @apiGroup liudao
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} id 成就档次
 *
 */
router.all('/actCjRwd', async (ctx) => {
    ctx.state.apidesc = "六道秘境-领取成就奖励";
    const { uuid, id } = tool_1.tool.getParams(ctx);
    let actLiuDaoModel = ActLiuDaoModel_1.ActLiuDaoModel.getInstance(ctx, uuid);
    await actLiuDaoModel.actCjRwd(id);
});
//# sourceMappingURL=liudao.js.map