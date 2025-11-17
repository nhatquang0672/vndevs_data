"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tool_1 = require("../util/tool");
const ActPvwModel_1 = require("../model/act/ActPvwModel");
const RdsUserModel_1 = require("../model/redis/RdsUserModel");
const game_1 = __importDefault(require("../util/game"));
const router = new koa_router_1.default();
exports.router = router;
router.prefix("/pvw");
/**
 * @api {post} /pvw/fight 试炼打
 * @apiName 试炼打
 * @apiGroup pvw
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 */
router.all("/fight", async (ctx) => {
    ctx.state.apidesc = "试炼-试炼打";
    //TODO //等级限制
    const { uuid } = tool_1.tool.getParams(ctx);
    let actPvwModel = ActPvwModel_1.ActPvwModel.getInstance(ctx, uuid);
    await actPvwModel.fight();
    let rdsUserModel_pvw = RdsUserModel_1.RdsUserModel.getInstance(ctx, "rdsPvw", await actPvwModel.getHeIdByUuid(uuid), "x", game_1.default.getWeekId());
    await rdsUserModel_pvw.backData_my(ctx, uuid);
});
/**
 * @api {post} /pvw/sel 试炼选装备
 * @apiName 试炼选装备
 * @apiGroup pvw
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} id 自选ID
 * @apiParam {string} pos 放到哪个槽位
 */
router.all("/sel", async (ctx) => {
    ctx.state.apidesc = "试炼-试炼选装备";
    const { uuid, id, pos } = tool_1.tool.getParams(ctx);
    let actPvwModel = ActPvwModel_1.ActPvwModel.getInstance(ctx, uuid);
    await actPvwModel.sel(id, pos);
});
/**
 * @api {post} /pvw/cancel 放弃选择装备
 * @apiName 放弃选择装备
 * @apiGroup pvw
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 */
router.all("/cancel", async (ctx) => {
    ctx.state.apidesc = "试炼-放弃选择装备";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actPvwModel = ActPvwModel_1.ActPvwModel.getInstance(ctx, uuid);
    await actPvwModel.cancel();
});
/**
 * @api {post} /pvw/open 开格子
 * @apiName 开格子
 * @apiGroup pvw
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 */
router.all("/open", async (ctx) => {
    ctx.state.apidesc = "试炼-开格子";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actPvwModel = ActPvwModel_1.ActPvwModel.getInstance(ctx, uuid);
    await actPvwModel.open();
});
/**
 * @api {post} /pvw/quick 试炼速战
 * @apiName 试炼速战
 * @apiGroup pvw
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 */
router.all("/quick", async (ctx) => {
    ctx.state.apidesc = "试炼-试炼速战";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actPvwModel = ActPvwModel_1.ActPvwModel.getInstance(ctx, uuid);
    await actPvwModel.quick(0);
    let rdsUserModel_pvw = RdsUserModel_1.RdsUserModel.getInstance(ctx, "rdsPvw", await actPvwModel.getHeIdByUuid(uuid), "x", game_1.default.getWeekId());
    await rdsUserModel_pvw.backData_my(ctx, uuid);
});
/**
 * @api {post} /pvw/reset 重置
 * @apiName 重置
 * @apiGroup pvw
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 */
router.all("/reset", async (ctx) => {
    ctx.state.apidesc = "试炼-重置";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actPvwModel = ActPvwModel_1.ActPvwModel.getInstance(ctx, uuid);
    await actPvwModel.reset();
});
//# sourceMappingURL=pvw.js.map