"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tool_1 = require("../util/tool");
const ActBoxModel_1 = require("../model/act/ActBoxModel");
const router = new koa_router_1.default();
exports.router = router;
router.prefix('/box');
/**
 * @api {post} /box/upLevel 升级增加进度条
 * @apiName 升级增加进度条
 * @apiGroup box
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 */
router.all('/upLevel', async (ctx) => {
    ctx.state.apidesc = "鼎炉-升级增加进度条";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actBoxModel = ActBoxModel_1.ActBoxModel.getInstance(ctx, uuid);
    await actBoxModel.upLevel();
});
/**
 * @api {post} /box/upStep 升阶进入下一等级
 * @apiName 升阶进入下一等级
 * @apiGroup box
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 */
router.all('/upStep', async (ctx) => {
    ctx.state.apidesc = "鼎炉-升阶进入下一等级";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actBoxModel = ActBoxModel_1.ActBoxModel.getInstance(ctx, uuid);
    await actBoxModel.upStep();
});
/**
 * @api {post} /box/itemZhuLi 道具助力
 * @apiName 道具助力
 * @apiGroup box
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {number} count 消耗道具个数
 */
router.all('/itemZhuLi', async (ctx) => {
    ctx.state.apidesc = "鼎炉-道具助力";
    const { uuid, count } = tool_1.tool.getParams(ctx);
    if (count <= 0) {
        ctx.throw("参数错误");
    }
    let actBoxModel = ActBoxModel_1.ActBoxModel.getInstance(ctx, uuid);
    await actBoxModel.itemZhuLi(count);
});
/**
 * @api {post} /box/setMType 设置出售分解状态(卡牌)
 * @apiName 设置出售分解状态
 * @apiGroup box
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 */
router.all('/setMType', async (ctx) => {
    ctx.state.apidesc = "鼎炉-设置出售分解状态(卡牌)";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actBoxModel = ActBoxModel_1.ActBoxModel.getInstance(ctx, uuid);
    await actBoxModel.setMType();
});
/**
 * @api {post} /box/setBType 设置出售分解状态(委托)
 * @apiName 设置出售分解状态
 * @apiGroup box
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 */
router.all('/setBType', async (ctx) => {
    ctx.state.apidesc = "鼎炉-设置出售分解状态(委托)";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actBoxModel = ActBoxModel_1.ActBoxModel.getInstance(ctx, uuid);
    await actBoxModel.setBType();
});
/**
 * @api {post} /box/setWeiTuo 设置委托
 * @apiName 设置委托
 * @apiGroup box
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} fangan 方案列表
 */
router.all('/setWeiTuo', async (ctx) => {
    ctx.state.apidesc = "鼎炉-设置委托";
    const { uuid, fangan } = tool_1.tool.getParams(ctx);
    let actBoxModel = ActBoxModel_1.ActBoxModel.getInstance(ctx, uuid);
    await actBoxModel.setFangAn(fangan);
});
/**
 * @api {post} /box/itemSpeed 宝箱升阶使用钻石加速
 * @apiName 宝箱升阶使用钻石加速
 * @apiGroup box
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 */
router.all('/itemSpeed', async (ctx) => {
    ctx.state.apidesc = "鼎炉-宝箱升阶使用钻石加速";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actBoxModel = ActBoxModel_1.ActBoxModel.getInstance(ctx, uuid);
    await actBoxModel.speed();
});
/**
 * @api {post} /box/upStepLv 升阶增加进度条
 * @apiName 升阶增加进度条
 * @apiGroup box
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 */
router.all('/upStepLv', async (ctx) => {
    ctx.state.apidesc = "鼎炉-升阶增加进度条";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actBoxModel = ActBoxModel_1.ActBoxModel.getInstance(ctx, uuid);
    await actBoxModel.upStepLv();
});
/**
 * @api {post} /box/upStepNext 升阶进入下一阶级
 * @apiName 升阶进入下一阶级
 * @apiGroup box
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 */
router.all('/upStepNext', async (ctx) => {
    ctx.state.apidesc = "鼎炉-升阶进入下一阶级";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actBoxModel = ActBoxModel_1.ActBoxModel.getInstance(ctx, uuid);
    await actBoxModel.upStepNext();
});
/**
 * @api {post} /box/itemZhuLiStep 阶级道具助力
 * @apiName 阶级道具助力
 * @apiGroup box
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {number} count 消耗道具个数
 */
router.all('/itemZhuLiStep', async (ctx) => {
    ctx.state.apidesc = "鼎炉-阶级道具助力";
    const { uuid, count } = tool_1.tool.getParams(ctx);
    if (count <= 0) {
        ctx.throw("参数错误");
    }
    let actBoxModel = ActBoxModel_1.ActBoxModel.getInstance(ctx, uuid);
    await actBoxModel.itemZhuLiStep(count);
});
//# sourceMappingURL=box.js.map