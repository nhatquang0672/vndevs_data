"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tool_1 = require("../util/tool");
const ActFuShiModel_1 = require("../model/act/ActFuShiModel");
const ActFuShiYhModel_1 = require("../model/act/ActFuShiYhModel");
const router = new koa_router_1.default();
exports.router = router;
router.prefix('/fushi');
/**
 * @api {post} /fushi/into 进入符石
 * @apiName 进入符石
 * @apiGroup fushi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 */
router.all('/into', async (ctx) => {
    ctx.state.apidesc = "钓鱼-进入符石";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actFuShiModel = ActFuShiModel_1.ActFuShiModel.getInstance(ctx, uuid);
    await actFuShiModel.unlock();
    await actFuShiModel.backData();
});
/**
 * @api {post} /fushi/chou 抽符石
 * @apiName 抽符石
 * @apiGroup fushi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 */
router.all('/chou', async (ctx) => {
    ctx.state.apidesc = "钓鱼-抽符石";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actFuShiModel = ActFuShiModel_1.ActFuShiModel.getInstance(ctx, uuid);
    await actFuShiModel.chou();
});
/**
 * @api {post} /fushi/loopChou 轮询抽符石
 * @apiName 轮询抽符石
 * @apiGroup fushi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {number} type 0出售1提交订单
 * @apiParam {number} isChou 1抽0不抽
 */
router.all('/loopChou', async (ctx) => {
    ctx.state.apidesc = "钓鱼-轮询抽符石";
    const { uuid, type, isChou } = tool_1.tool.getParams(ctx);
    let actFuShiModel = ActFuShiModel_1.ActFuShiModel.getInstance(ctx, uuid);
    await actFuShiModel.chushou(type);
    if (isChou) {
        await actFuShiModel.chou();
    }
});
/**
 * @api {post} /fushi/chushou 符石出售
 * @apiName 符石出售
 * @apiGroup fushi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {number} type 0出售1提交订单
 */
router.all('/chushou', async (ctx) => {
    ctx.state.apidesc = "钓鱼-符石出售";
    const { uuid, type } = tool_1.tool.getParams(ctx);
    let actFuShiModel = ActFuShiModel_1.ActFuShiModel.getInstance(ctx, uuid);
    await actFuShiModel.chushou(type);
});
/**
 * @api {post} /fushi/tihuan 符石替换
 * @apiName 符石替换
 * @apiGroup fushi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} wzid 位置id
 */
router.all('/tihuan', async (ctx) => {
    ctx.state.apidesc = "钓鱼-符石替换";
    const { uuid, wzid } = tool_1.tool.getParams(ctx);
    let actFuShiModel = ActFuShiModel_1.ActFuShiModel.getInstance(ctx, uuid);
    await actFuShiModel.tihuan(wzid);
});
/**
 * @api {post} /fushi/upKuLevel 升级符石库
 * @apiName 升级符石库
 * @apiGroup fushi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 */
router.all('/upKuLevel', async (ctx) => {
    ctx.state.apidesc = "钓鱼-升级符石库";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actFuShiModel = ActFuShiModel_1.ActFuShiModel.getInstance(ctx, uuid);
    await actFuShiModel.upKuLevel();
});
/**
 * @api {post} /fushi/refreTask 刷新任务
 * @apiName 刷新任务
 * @apiGroup fushi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} xbid 任务下标ID
 */
router.all('/refreTask', async (ctx) => {
    ctx.state.apidesc = "钓鱼-刷新任务";
    const { uuid, xbid } = tool_1.tool.getParams(ctx);
    let actFuShiModel = ActFuShiModel_1.ActFuShiModel.getInstance(ctx, uuid);
    await actFuShiModel.refreTask(xbid);
});
/**
 * @api {post} /fushi/resetTask 重置任务
 * @apiName 重置任务
 * @apiGroup fushi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 */
router.all('/resetTask', async (ctx) => {
    ctx.state.apidesc = "钓鱼-重置任务";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actFuShiModel = ActFuShiModel_1.ActFuShiModel.getInstance(ctx, uuid);
    await actFuShiModel.resetTask();
});
/**
 * @api {post} /fushi/taskRwd 领取任务奖励
 * @apiName 领取任务奖励
 * @apiGroup fushi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} xbid 任务下标ID
 */
router.all('/taskRwd', async (ctx) => {
    ctx.state.apidesc = "钓鱼-领取任务奖励";
    const { uuid, xbid } = tool_1.tool.getParams(ctx);
    let actFuShiModel = ActFuShiModel_1.ActFuShiModel.getInstance(ctx, uuid);
    await actFuShiModel.taskRwd(xbid);
});
/**
 * @api {post} /fushi/setLingShi 设置灵石
 * @apiName 设置灵石
 * @apiGroup fushi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} itemId 灵石ID
 */
router.all('/setLingShi', async (ctx) => {
    ctx.state.apidesc = "钓鱼-设置灵石";
    const { uuid, itemId } = tool_1.tool.getParams(ctx);
    let actFuShiModel = ActFuShiModel_1.ActFuShiModel.getInstance(ctx, uuid);
    await actFuShiModel.setNowId(itemId);
});
/**
 * @api {post} /fushi/itemSpeed 符石升阶使用钻石加速
 * @apiName 符石升阶使用钻石加速
 * @apiGroup fushi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 */
router.all('/itemSpeed', async (ctx) => {
    ctx.state.apidesc = "钓鱼-符石升阶使用钻石加速";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actFuShiModel = ActFuShiModel_1.ActFuShiModel.getInstance(ctx, uuid);
    await actFuShiModel.speed();
});
/**
 * @api {post} /fushi/itemZhuLi 道具助力
 * @apiName 道具助力
 * @apiGroup fushi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {number} count 消耗道具个数
 */
router.all('/itemZhuLi', async (ctx) => {
    ctx.state.apidesc = "钓鱼-道具助力";
    const { uuid, count } = tool_1.tool.getParams(ctx);
    if (count <= 0) {
        ctx.throw("参数错误");
    }
    let actFuShiModel = ActFuShiModel_1.ActFuShiModel.getInstance(ctx, uuid);
    await actFuShiModel.itemZhuLi(count);
});
/**
 * @api {post} /fushi/setWeiTuo 设置委托
 * @apiName 设置委托
 * @apiGroup fushi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} fangan 方案列表
 */
router.all('/setWeiTuo', async (ctx) => {
    ctx.state.apidesc = "钓鱼-设置委托";
    const { uuid, fangan } = tool_1.tool.getParams(ctx);
    let actFuShiModel = ActFuShiModel_1.ActFuShiModel.getInstance(ctx, uuid);
    await actFuShiModel.setFangAn(fangan);
});
/**
 * @api {post} /fushi/jitanUplv 祭坛升级
 * @apiName 祭坛升级
 * @apiGroup fushi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} jtid  1纳灵2灵焰3神像4灵基
 */
router.all('/jitanUplv', async (ctx) => {
    ctx.state.apidesc = "钓鱼-祭坛升级";
    const { uuid, jtid } = tool_1.tool.getParams(ctx);
    let actFuShiModel = ActFuShiModel_1.ActFuShiModel.getInstance(ctx, uuid);
    await actFuShiModel.jitanUplv(jtid);
});
/**
 * @api {post} /fushi/jitanFlUse 祭坛附灵使用钻石
 * @apiName 祭坛附灵使用钻石
 * @apiGroup fushi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 */
router.all('/jitanFlUse', async (ctx) => {
    ctx.state.apidesc = "钓鱼-祭坛附灵使用钻石";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actFuShiModel = ActFuShiModel_1.ActFuShiModel.getInstance(ctx, uuid);
    await actFuShiModel.flUse();
});
/**
 * @api {post} /fushi/jitanFlLock 祭坛附灵上锁
 * @apiName 祭坛附灵上锁
 * @apiGroup fushi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} jtid  1纳灵2灵焰3神像4灵基
 * @apiParam {string} xhid  序号ID
 */
router.all('/jitanFlLock', async (ctx) => {
    ctx.state.apidesc = "钓鱼-祭坛附灵上锁";
    const { uuid, jtid, xhid } = tool_1.tool.getParams(ctx);
    let actFuShiModel = ActFuShiModel_1.ActFuShiModel.getInstance(ctx, uuid);
    await actFuShiModel.jitanFlLock(jtid, xhid);
});
/**
 * @api {post} /fushi/jitanFl 祭坛附灵
 * @apiName 祭坛附灵
 * @apiGroup fushi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} jtid  1纳灵2灵焰3神像4灵基
 */
router.all('/jitanFl', async (ctx) => {
    ctx.state.apidesc = "钓鱼-祭坛附灵";
    const { uuid, jtid } = tool_1.tool.getParams(ctx);
    let actFuShiModel = ActFuShiModel_1.ActFuShiModel.getInstance(ctx, uuid);
    await actFuShiModel.jitanFl(jtid);
});
/**
 * @api {post} /fushi/jitanFlTh 祭坛附灵替换
 * @apiName 祭坛附灵替换
 * @apiGroup fushi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} jtid  1纳灵2灵焰3神像4灵基
 */
router.all('/jitanFlTh', async (ctx) => {
    ctx.state.apidesc = "钓鱼-祭坛附灵替换";
    const { uuid, jtid } = tool_1.tool.getParams(ctx);
    let actFuShiModel = ActFuShiModel_1.ActFuShiModel.getInstance(ctx, uuid);
    await actFuShiModel.jitanFlTh(jtid);
});
/**
 * @api {post} /fushi/delTjRed 去除图鉴红点
 * @apiName 去除图鉴红点
 * @apiGroup fushi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} itemId 道具ID
 */
router.all('/delTjRed', async (ctx) => {
    ctx.state.apidesc = "钓鱼-去除图鉴红点";
    const { uuid, itemId } = tool_1.tool.getParams(ctx);
    let actFuShiModel = ActFuShiModel_1.ActFuShiModel.getInstance(ctx, uuid);
    await actFuShiModel.delTjRed(itemId);
});
/**
 * @api {post} /fushi/delTjRedAll 去除图鉴所有红点
 * @apiName 去除图鉴所有红点
 * @apiGroup fushi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} scid 手册ID
 */
router.all('/delTjRedAll', async (ctx) => {
    ctx.state.apidesc = "钓鱼-去除图鉴所有红点";
    const { uuid, scid } = tool_1.tool.getParams(ctx);
    let actFuShiModel = ActFuShiModel_1.ActFuShiModel.getInstance(ctx, uuid);
    await actFuShiModel.delTjRedAll(scid);
});
/**
 * @api {post} /fushi/useShouCe 使用手册
 * @apiName 使用手册
 * @apiGroup fushi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {number} id 手册ID
 */
router.all('/useShouCe', async (ctx) => {
    ctx.state.apidesc = "钓鱼-使用手册";
    const { uuid, id } = tool_1.tool.getParams(ctx);
    let actFuShiModel = ActFuShiModel_1.ActFuShiModel.getInstance(ctx, uuid);
    await actFuShiModel.useShouCe(id);
});
/**
 * @api {post} /fushi/unlockShouCe 解锁手册
 * @apiName 解锁手册
 * @apiGroup fushi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 */
router.all('/unlockShouCe', async (ctx) => {
    ctx.state.apidesc = "钓鱼-解锁手册";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actFuShiModel = ActFuShiModel_1.ActFuShiModel.getInstance(ctx, uuid);
    await actFuShiModel.unlockShouCe();
});
/**
 * @api {post} /fushi/yhTaskRwd 鱼获盛宴领取任务奖励
 * @apiName 鱼获盛宴领取任务奖励
 * @apiGroup fushi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} id 任务ID
 */
router.all('/yhTaskRwd', async (ctx) => {
    ctx.state.apidesc = "钓鱼-鱼获盛宴领取任务奖励";
    const { uuid, id } = tool_1.tool.getParams(ctx);
    let atFuShiYhModel = ActFuShiYhModel_1.ActFuShiYhModel.getInstance(ctx, uuid);
    await atFuShiYhModel.yhTaskRwd(id);
});
/**
 * @api {post} /fushi/yhLvRwd 鱼获盛宴领取等级奖励
 * @apiName 鱼获盛宴领取等级奖励
 * @apiGroup fushi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} id 配置表ID
 */
router.all('/yhLvRwd', async (ctx) => {
    ctx.state.apidesc = "钓鱼-鱼获盛宴领取等级奖励";
    const { uuid, id } = tool_1.tool.getParams(ctx);
    let atFuShiYhModel = ActFuShiYhModel_1.ActFuShiYhModel.getInstance(ctx, uuid);
    await atFuShiYhModel.yhLvRwd(id);
});
//# sourceMappingURL=fushi.js.map