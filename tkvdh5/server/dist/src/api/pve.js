"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tool_1 = require("../util/tool");
const ActPveFightModel_1 = require("../model/act/ActPveFightModel");
const ActPveInfoModel_1 = require("../model/act/ActPveInfoModel");
const ActPveJyFightModel_1 = require("../model/act/ActPveJyFightModel");
const ActPveJyModel_1 = require("../model/act/ActPveJyModel");
const router = new koa_router_1.default();
exports.router = router;
router.prefix('/pve');
/**
 * @api {post} /pve/fight pve战斗
 * @apiName pve战斗
 * @apiGroup pve
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all('/fight', async (ctx) => {
    ctx.state.apidesc = "历练-pve战斗";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actPveFightModel = ActPveFightModel_1.ActPveFightModel.getInstance(ctx, uuid);
    await actPveFightModel.fight_one();
});
/**
 * @api {post} /pve/jiedianRwd pve领取章节奖励
 * @apiName pve领取章节奖励
 * @apiGroup pve
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} id 节点ID
 * @apiParam {number} isNew 是不是换成新的
 *
 */
router.all('/jiedianRwd', async (ctx) => {
    ctx.state.apidesc = "历练-pve领取章节奖励";
    const { uuid, id } = tool_1.tool.getParams(ctx);
    let actPveInfoModel = ActPveInfoModel_1.ActPveInfoModel.getInstance(ctx, uuid);
    await actPveInfoModel.jiedianRwd(id);
});
/**
 * @api {post} /pve/jyFight pve精英战斗
 * @apiName pve精英战斗
 * @apiGroup pve
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all('/jyFight', async (ctx) => {
    ctx.state.apidesc = "历练-pve精英战斗";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actPveJyFightModel = ActPveJyFightModel_1.ActPveJyFightModel.getInstance(ctx, uuid);
    await actPveJyFightModel.fight_one();
});
/**
 * @api {post} /pve/saodang pve精英扫荡
 * @apiName pve精英扫荡
 * @apiGroup pve
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all('/saodang', async (ctx) => {
    ctx.state.apidesc = "历练-pve精英扫荡";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actPveJyModel = ActPveJyModel_1.ActPveJyModel.getInstance(ctx, uuid);
    await actPveJyModel.saodang();
});
/**
 * @api {post} /pve/fightEnd 战斗结束
 * @apiName 战斗结束
 * @apiGroup pve
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} ftype pve|pvejy
 *
 */
router.all('/fightEnd', async (ctx) => {
    ctx.state.apidesc = "历练-战斗结束";
    const { uuid, ftype } = tool_1.tool.getParams(ctx);
    if (ftype == "pve") {
        let actPveFightModel = ActPveFightModel_1.ActPveFightModel.getInstance(ctx, uuid);
        let actPveFight = await actPveFightModel.getInfo();
    }
    if (ftype == "pvejy") {
        let actPveJyFightModel = ActPveJyFightModel_1.ActPveJyFightModel.getInstance(ctx, uuid);
        let actPveJyFight = await actPveJyFightModel.getInfo();
    }
});
//# sourceMappingURL=pve.js.map