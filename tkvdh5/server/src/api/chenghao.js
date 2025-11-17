"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tool_1 = require("../util/tool");
const ActChengHModel_1 = require("../model/act/ActChengHModel");
const ActEquipModel_1 = require("../model/act/ActEquipModel");
const router = new koa_router_1.default();
exports.router = router;
router.prefix('/chenghao');
/**
 * @api {post} /chenghao/rwd 领取晋升奖励
 * @apiName 领取晋升奖励
 * @apiGroup chenghao
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 */
router.all('/rwd', async (ctx) => {
    ctx.state.apidesc = "称号-领取晋升奖励";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.rwd();
    //重新刷 装备商人属性
    let actEquipModel = ActEquipModel_1.ActEquipModel.getInstance(ctx, uuid);
    await actEquipModel.resetTrader();
});
/**
 * @api {post} /chenghao/peidai 佩戴
 * @apiName 佩戴
 * @apiGroup chenghao
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} chid 称号ID
 */
router.all('/peidai', async (ctx) => {
    ctx.state.apidesc = "称号-佩戴";
    const { uuid, chid } = tool_1.tool.getParams(ctx);
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.peidai(chid);
});
/**
 * @api {post} /chenghao/delRed 删除称号红点
 * @apiName 删除称号红点
 * @apiGroup chenghao
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} chid 称号ID
 */
router.all('/delRed', async (ctx) => {
    ctx.state.apidesc = "称号-删除称号红点";
    const { uuid, chid } = tool_1.tool.getParams(ctx);
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.delRed(chid);
});
//# sourceMappingURL=chenghao.js.map