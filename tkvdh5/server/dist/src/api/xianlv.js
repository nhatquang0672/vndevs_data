"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tool_1 = require("../util/tool");
const ActXianlvModel_1 = require("../model/act/ActXianlvModel");
const router = new koa_router_1.default();
exports.router = router;
router.prefix('/xianlv');
/**
 * @api {post} /xianlv/useHulu 使用葫芦
 * @apiName 使用葫芦
 * @apiGroup xianlv
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {number} type 1木2绿3紫
 *
 *
 */
router.all('/useHulu', async (ctx) => {
    ctx.state.apidesc = "仙侣-使用葫芦";
    const { uuid, type } = tool_1.tool.getParams(ctx);
    let actXianlvModel = ActXianlvModel_1.ActXianlvModel.getInstance(ctx, uuid);
    await actXianlvModel.useHulu(type);
});
/**
 * @api {post} /xianlv/kaigz 开启合成区域
 * @apiName 开启合成区域
 * @apiGroup xianlv
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} gzid 格子ID
 *
 */
router.all('/kaigz', async (ctx) => {
    ctx.state.apidesc = "仙侣-开启合成区域";
    const { uuid, gzid } = tool_1.tool.getParams(ctx);
    let actXianlvModel = ActXianlvModel_1.ActXianlvModel.getInstance(ctx, uuid);
    await actXianlvModel.kaigz(gzid);
});
/**
 * @api {post} /xianlv/hecheng 仙侣合成
 * @apiName 仙侣合成
 * @apiGroup xianlv
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} gzid1 格子ID1材料
 * @apiParam {string} gzid2 格子ID2主位
 *
 */
router.all('/hecheng', async (ctx) => {
    ctx.state.apidesc = "仙侣-仙侣合成";
    const { uuid, gzid1, gzid2 } = tool_1.tool.getParams(ctx);
    let actXianlvModel = ActXianlvModel_1.ActXianlvModel.getInstance(ctx, uuid);
    await actXianlvModel.hecheng(gzid1, gzid2);
});
/**
 * @api {post} /xianlv/shangzhen 仙侣上阵
 * @apiName 仙侣上阵
 * @apiGroup xianlv
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} gzid 格子ID
 *
 */
router.all('/shangzhen', async (ctx) => {
    ctx.state.apidesc = "仙侣-仙侣上阵";
    const { uuid, gzid } = tool_1.tool.getParams(ctx);
    let actXianlvModel = ActXianlvModel_1.ActXianlvModel.getInstance(ctx, uuid);
    await actXianlvModel.shangzhen(gzid);
});
/**
 * @api {post} /xianlv/duihuan 兑换仙侣
 * @apiName 兑换仙侣
 * @apiGroup xianlv
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} dc 配置表dc
 *
 */
router.all('/duihuan', async (ctx) => {
    ctx.state.apidesc = "仙侣-兑换仙侣";
    const { uuid, dc } = tool_1.tool.getParams(ctx);
    let actXianlvModel = ActXianlvModel_1.ActXianlvModel.getInstance(ctx, uuid);
    await actXianlvModel.duihuan(dc);
});
/**
 * @api {post} /xianlv/tujianRwd 领取图鉴奖励
 * @apiName 领取图鉴奖励
 * @apiGroup xianlv
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} xlid 仙侣ID
 *
 */
router.all('/tujianRwd', async (ctx) => {
    ctx.state.apidesc = "仙侣-领取图鉴奖励";
    const { uuid, xlid } = tool_1.tool.getParams(ctx);
    let actXianlvModel = ActXianlvModel_1.ActXianlvModel.getInstance(ctx, uuid);
    await actXianlvModel.tujianRwd(xlid);
});
/**
 * @api {post} /xianlv/shangsuo 上锁
 * @apiName 上锁
 * @apiGroup xianlv
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} gzid 格子ID
 * @apiParam {number} lock 上锁0没有1上锁
 *
 */
router.all('/shangsuo', async (ctx) => {
    ctx.state.apidesc = "仙侣-上锁";
    const { uuid, gzid, lock } = tool_1.tool.getParams(ctx);
    let actXianlvModel = ActXianlvModel_1.ActXianlvModel.getInstance(ctx, uuid);
    await actXianlvModel.shangsuo(gzid, lock);
});
/**
 * @api {post} /xianlv/setZw 设置站位
 * @apiName 设置站位
 * @apiGroup xianlv
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} gzid 格子ID0为出战位置
 * @apiParam {number} zhanwei 站位 1前2后
 *
 */
router.all('/setZw', async (ctx) => {
    ctx.state.apidesc = "仙侣-设置站位";
    const { uuid, gzid, zhanwei } = tool_1.tool.getParams(ctx);
    let actXianlvModel = ActXianlvModel_1.ActXianlvModel.getInstance(ctx, uuid);
    await actXianlvModel.setZw(gzid, zhanwei);
});
/**
 * @api {post} /xianlv/dandan 开启蛋蛋
 * @apiName 开启蛋蛋
 * @apiGroup xianlv
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} gzid 格子ID
 *
 */
router.all('/dandan', async (ctx) => {
    ctx.state.apidesc = "仙侣-开启蛋蛋";
    const { uuid, gzid } = tool_1.tool.getParams(ctx);
    let actXianlvModel = ActXianlvModel_1.ActXianlvModel.getInstance(ctx, uuid);
    await actXianlvModel.dandan(gzid);
});
/**
 * @api {post} /xianlv/huhuan 互换位置
 * @apiName 互换位置
 * @apiGroup xianlv
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} gzid 格子ID(0|97|98|99|gezi)
 * @apiParam {string} gzid1 格子ID(0|97|98|99|gezi)
 *
 */
router.all('/huhuan', async (ctx) => {
    ctx.state.apidesc = "仙侣-互换位置";
    const { uuid, gzid, gzid1 } = tool_1.tool.getParams(ctx);
    let actXianlvModel = ActXianlvModel_1.ActXianlvModel.getInstance(ctx, uuid);
    await actXianlvModel.huhuan(gzid, gzid1);
});
//# sourceMappingURL=xianlv.js.map