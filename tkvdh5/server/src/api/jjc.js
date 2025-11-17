"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tool_1 = require("../util/tool");
const ActJjcInfoModel_1 = require("../model/act/ActJjcInfoModel");
const ActJjcFightModel_1 = require("../model/act/ActJjcFightModel");
const game_1 = __importDefault(require("../util/game"));
const ActJjcLogModel_1 = require("../model/act/ActJjcLogModel");
const ActDingYueModel_1 = require("../model/act/ActDingYueModel");
const lock_1 = __importDefault(require("../util/lock"));
const cache_1 = __importDefault(require("../util/cache"));
const RdsUserModel_1 = require("../model/redis/RdsUserModel");
const router = new koa_router_1.default();
exports.router = router;
router.prefix('/jjc');
/**
 * @api {post} /jjc/into 进入jjc
 * @apiName 进入jjc
 * @apiGroup jjc
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all('/into', async (ctx) => {
    ctx.state.apidesc = "斗法-进入jjc";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actJjcInfoModel = ActJjcInfoModel_1.ActJjcInfoModel.getInstance(ctx, uuid);
    await actJjcInfoModel.into();
    await actJjcInfoModel.backData();
    let rdsUserModel_rdsJjc = await new RdsUserModel_1.RdsUserModel("rdsJjc", "x", await actJjcInfoModel.getHeIdByUuid(uuid), tool_1.tool.jjcWeekId(ctx.state.newTime));
    await rdsUserModel_rdsJjc.backData_my(ctx, uuid);
    await rdsUserModel_rdsJjc.backData_u(ctx, 1, 10);
});
/**
 * @api {post} /jjc/get5 jjc刷新
 * @apiName jjc刷新
 * @apiGroup jjc
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all('/get5', async (ctx) => {
    ctx.state.apidesc = "斗法-jjc刷新";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actJjcInfoModel = ActJjcInfoModel_1.ActJjcInfoModel.getInstance(ctx, uuid);
    await actJjcInfoModel.refreAt(true);
    await actJjcInfoModel.get5();
});
/**
 * @api {post} /jjc/fight jjc战斗
 * @apiName jjc战斗
 * @apiGroup jjc
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} fuuid 战斗对手角色ID
 *
 */
router.all('/fight', async (ctx) => {
    ctx.state.apidesc = "斗法-jjc战斗";
    const { uuid, fuuid } = tool_1.tool.getParams(ctx);
    if (fuuid == uuid) {
        ctx.throw("不能选自己为对手");
    }
    let jjc_week_time = tool_1.tool.mathcfg_item(ctx, 'jjc_week_time');
    //周日22-22：05点 不能打
    let week0 = game_1.default.getWeek0(ctx.state.newTime);
    if (ctx.state.newTime >= week0 + jjc_week_time[0] && ctx.state.newTime <= week0 + jjc_week_time[1]) {
        ctx.throw("赛季结算中...");
    }
    let actJjcInfoModel = ActJjcInfoModel_1.ActJjcInfoModel.getInstance(ctx, uuid);
    await actJjcInfoModel.subCons(1); //扣除门票
    let actJjcInfo = await actJjcInfoModel.getInfo();
    if (actJjcInfo.get5[fuuid] == null) {
        ctx.throw("参数错误");
    }
    let actJjcFightModel = ActJjcFightModel_1.ActJjcFightModel.getInstance(ctx, uuid);
    if ((await actJjcFightModel.fight_one(fuuid, 0)) == 1) {
        await actJjcInfoModel.get5();
    }
    if (parseInt(fuuid) >= 100000) {
        let fuser = await cache_1.default.getFUser(ctx, fuuid);
        await lock_1.default.setLock(ctx, "user", fuuid); //枷锁
        ctx.state.fuuid = fuuid;
        let factDingYueModel = ActDingYueModel_1.ActDingYueModel.getInstance(ctx, fuuid);
        await factDingYueModel.sendDy("4", [fuser.name]);
        ctx.state.fuuid = "";
    }
});
/**
 * @api {post} /jjc/fuchou jjc复仇
 * @apiName jjc复仇
 * @apiGroup jjc
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} id  log日志id
 *
 */
router.all('/fuchou', async (ctx) => {
    ctx.state.apidesc = "斗法-jjc复仇";
    const { uuid, id } = tool_1.tool.getParams(ctx);
    let jjc_week_time = tool_1.tool.mathcfg_item(ctx, 'jjc_week_time');
    //周六22-24点 不能打
    let week0 = game_1.default.getWeek0(ctx.state.newTime);
    if (ctx.state.newTime >= week0 + jjc_week_time[0] && ctx.state.newTime <= week0 + jjc_week_time[1]) {
        ctx.throw("赛季结算中...");
    }
    let actJjcInfoModel = ActJjcInfoModel_1.ActJjcInfoModel.getInstance(ctx, uuid);
    await actJjcInfoModel.subCons(1); //扣除门票
    let actJjcLogModel = ActJjcLogModel_1.ActJjcLogModel.getInstance(ctx, uuid);
    await actJjcLogModel.fuchou(id);
});
/**
 * @api {post} /jjc/rwdDay jjc领取日奖励
 * @apiName jjc领取日奖励
 * @apiGroup jjc
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all('/rwdDay', async (ctx) => {
    ctx.state.apidesc = "斗法-jjc领取日奖励";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actJjcInfoModel = ActJjcInfoModel_1.ActJjcInfoModel.getInstance(ctx, uuid);
    await actJjcInfoModel.rwdDay();
});
/**
 * @api {post} /jjc/rwdWeek jjc领取赛季奖励
 * @apiName jjc领取赛季奖励
 * @apiGroup jjc
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all('/rwdWeek', async (ctx) => {
    ctx.state.apidesc = "斗法-jjc领取赛季奖励";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actJjcInfoModel = ActJjcInfoModel_1.ActJjcInfoModel.getInstance(ctx, uuid);
    await actJjcInfoModel.rwdWeek();
});
//# sourceMappingURL=jjc.js.map