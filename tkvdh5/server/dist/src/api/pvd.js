"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tool_1 = require("../util/tool");
const ActPvdModel_1 = require("../model/act/ActPvdModel");
const RdsUserModel_1 = require("../model/redis/RdsUserModel");
const setting_1 = __importDefault(require("../crontab/setting"));
const game_1 = __importDefault(require("../util/game"));
const router = new koa_router_1.default();
exports.router = router;
router.prefix('/pvd');
/**
 * @api {post} /pvd/into 进入每日挑战
 * @apiName 进入每日挑战
 * @apiGroup pvd
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all('/into', async (ctx) => {
    ctx.state.apidesc = "每日挑战-进入每日挑战";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actPvdModel = ActPvdModel_1.ActPvdModel.getInstance(ctx, uuid);
    await actPvdModel.backData();
    let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
    let rdsUserModel_rdsPvd = await new RdsUserModel_1.RdsUserModel("rdsPvd", "x", heid, game_1.default.getTodayId(ctx.state.newTime));
    await rdsUserModel_rdsPvd.backData_my(ctx, uuid);
});
/**
 * @api {post} /pvd/fight pvd每日挑战
 * @apiName pvd每日挑战
 * @apiGroup pvd
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all('/fight', async (ctx) => {
    ctx.state.apidesc = "每日挑战-pvd每日挑战";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actPvdModel = ActPvdModel_1.ActPvdModel.getInstance(ctx, uuid);
    await actPvdModel.fight_one();
    let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
    let rdsUserModel_rdsPvd = await new RdsUserModel_1.RdsUserModel("rdsPvd", "x", heid, game_1.default.getTodayId(ctx.state.newTime));
    await rdsUserModel_rdsPvd.backData_my(ctx, uuid);
});
//# sourceMappingURL=pvd.js.map