"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tool_1 = require("../util/tool");
const ActDaoyouModel_1 = require("../model/act/ActDaoyouModel");
const ActDaoYouFightModel_1 = require("../model/act/ActDaoYouFightModel");
const router = new koa_router_1.default();
exports.router = router;
router.prefix('/daoyou');
/**
 * @api {post} /daoyou/into 进入道友
 * @apiName 进入道友
 * @apiGroup daoyou
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 *
 */
router.all('/into', async (ctx) => {
    ctx.state.apidesc = "道友-进入道友";
    const { uuid } = tool_1.tool.getParams(ctx);
    let model = ActDaoyouModel_1.ActDaoyouModel.getInstance(ctx, uuid);
    await model.getInfo();
});
/**
 * @api {post} /daoyou/jieYuan 结缘
 * @apiName 结缘
 * @apiGroup daoyou
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {number} did 道友id
 *
 *
 */
router.all('/jieYuan', async (ctx) => {
    ctx.state.apidesc = "道友-结缘";
    const { uuid, did } = tool_1.tool.getParams(ctx);
    let model = ActDaoyouModel_1.ActDaoyouModel.getInstance(ctx, uuid);
    await model.jieYuan(did);
});
/**
 * @api {post} /daoyou/rename 道友改名
 * @apiName 道友改名
 * @apiGroup daoyou
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {number} did 道友id
 * @apiParam {string} newName 道友新名称
 *
 *
 */
router.all('/rename', async (ctx) => {
    ctx.state.apidesc = "道友-道友改名";
    const { uuid, did, newName } = tool_1.tool.getParams(ctx);
    let model = ActDaoyouModel_1.ActDaoyouModel.getInstance(ctx, uuid);
    await model.rename(did, newName);
});
/**
 * @api {post} /daoyou/break 道友突破
 * @apiName 道友突破
 * @apiGroup daoyou
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {number} did 道友id
 *
 *
 */
router.all('/break', async (ctx) => {
    ctx.state.apidesc = "道友-道友突破";
    const { uuid, did } = tool_1.tool.getParams(ctx);
    let model = ActDaoyouModel_1.ActDaoyouModel.getInstance(ctx, uuid);
    await model.break(did);
});
/**
 * @api {post} /daoyou/trustReward 领取委托奖励
 * @apiName 领取委托奖励
 * @apiGroup daoyou
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {number} wid 委托事件ID
 *
 *
 */
router.all('/trustReward', async (ctx) => {
    ctx.state.apidesc = "道友-领取委托奖励";
    const { uuid, wid } = tool_1.tool.getParams(ctx);
    let model = ActDaoyouModel_1.ActDaoyouModel.getInstance(ctx, uuid);
    await model.getTrustRewards(wid);
});
/**
 * @api {post} /daoyou/trust 进行委托
 * @apiName 进行委托
 * @apiGroup daoyou
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {number} wid 委托事件ID
 *
 *
 */
router.all('/trust', async (ctx) => {
    ctx.state.apidesc = "道友-进行委托";
    const { uuid, wid } = tool_1.tool.getParams(ctx);
    let model = ActDaoyouModel_1.ActDaoyouModel.getInstance(ctx, uuid);
    await model.trust(wid);
});
/**
 * @api {post} /daoyou/invite 邀约派遣
 * @apiName 邀约派遣
 * @apiGroup daoyou
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {number} vid 邀约事件ID
 * @apiParam {number} out1 派遣能力道友ID
 * @apiParam {number} out2 派遣等级道友2ID
 * @apiParam {number} help 助力道友ID
 *
 *
 */
router.all('/invite', async (ctx) => {
    ctx.state.apidesc = "道友-邀约派遣";
    const { uuid, vid, out1, out2, help } = tool_1.tool.getParams(ctx);
    let model = ActDaoyouModel_1.ActDaoyouModel.getInstance(ctx, uuid);
    await model.invite(vid, out1, out2, help);
});
/**
 * @api {post} /daoyou/getInviteReward 获取邀约奖励
 * @apiName 获取邀约奖励
 * @apiGroup daoyou
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {number} vid 邀约事件ID
 *
 *
 */
router.all('/getInviteReward', async (ctx) => {
    ctx.state.apidesc = "道友-获取邀约奖励";
    const { uuid, vid } = tool_1.tool.getParams(ctx);
    let model = ActDaoyouModel_1.ActDaoyouModel.getInstance(ctx, uuid);
    await model.getInviteReward(vid);
});
/**
 * @api {post} /daoyou/jiaoYi 交易
 * @apiName 交易
 * @apiGroup daoyou
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {number} jid 交易事件ID
 *
 *
 */
router.all('/jiaoYi', async (ctx) => {
    ctx.state.apidesc = "道友-交易";
    const { uuid, jid } = tool_1.tool.getParams(ctx);
    let model = ActDaoyouModel_1.ActDaoyouModel.getInstance(ctx, uuid);
    await model.jiaoYi(jid);
});
/**
 * @api {post} /daoyou/fight 道友切磋
 * @apiName 道友切磋
 * @apiGroup daoyou
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} did 道友ID
 * @apiParam {string} levelId 关卡ID
 *
 */
router.all('/fight', async (ctx) => {
    ctx.state.apidesc = "道友-道友切磋";
    const { uuid, did, levelId } = tool_1.tool.getParams(ctx);
    let daoyouFight = ActDaoYouFightModel_1.ActDaoYouFightModel.getInstance(ctx, uuid);
    await daoyouFight.fight_one(did, levelId);
});
/**
 * @api {post} /daoyou/fightEnd 切磋结束
 * @apiName 切磋结束
 * @apiGroup daoyou
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} did 道友ID
 * @apiParam {string} levelId 关卡ID
 *
 */
router.all('/fightEnd', async (ctx) => {
    ctx.state.apidesc = "道友-切磋结束";
    const { uuid, did, levelId } = tool_1.tool.getParams(ctx);
    let daoyouFight = ActDaoYouFightModel_1.ActDaoYouFightModel.getInstance(ctx, uuid);
    await daoyouFight.getInfo();
});
/**
 * @api {post} /daoyou/unlock 解锁道友
 * @apiName 解锁道友
 * @apiGroup daoyou
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} did 道友ID
 *
 */
router.all('/unlock', async (ctx) => {
    ctx.state.apidesc = "道友-解锁道友";
    const { uuid, did } = tool_1.tool.getParams(ctx);
    let daoyouModel = ActDaoyouModel_1.ActDaoyouModel.getInstance(ctx, uuid);
    await daoyouModel.unlockCheck(did);
});
/**
 * @api {post} /daoyou/delRed 消除红点
 * @apiName 消除红点
 * @apiGroup daoyou
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} did 道友ID
 * @apiParam {number} type 消除类型 1道友 2交易 3邀约&委托
 *
 */
router.all('/delRed', async (ctx) => {
    ctx.state.apidesc = "道友-消除红点";
    const { uuid, did, type } = tool_1.tool.getParams(ctx);
    let daoyouModel = ActDaoyouModel_1.ActDaoyouModel.getInstance(ctx, uuid);
    await daoyouModel.delRed(did, type);
});
/**
 * @api {post} /daoyou/reject 拒绝事件
 * @apiName 拒绝事件
 * @apiGroup daoyou
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} eid 事件ID
 * @apiParam {number} type 事件类型 1邀约 2委托 3交易
 *
 */
router.all('/reject', async (ctx) => {
    ctx.state.apidesc = "道友-拒接事件";
    const { uuid, eid, type } = tool_1.tool.getParams(ctx);
    let daoyouModel = ActDaoyouModel_1.ActDaoyouModel.getInstance(ctx, uuid);
    await daoyouModel.reject(eid, type);
});
//# sourceMappingURL=daoyou.js.map