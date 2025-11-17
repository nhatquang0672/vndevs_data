"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tool_1 = require("../util/tool");
const ActBaoShiModel_1 = require("../model/act/ActBaoShiModel");
const router = new koa_router_1.default();
exports.router = router;
router.prefix('/baoshi');
/**
 * @api {post} /baoshi/hecheng 宝石合成
 * @apiName 宝石合成
 * @apiGroup baoshi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string[]} iids 宝石ID
 */
router.all('/hecheng', async (ctx) => {
    ctx.state.apidesc = "星图-宝石合成";
    const { uuid, iids } = tool_1.tool.getParams(ctx);
    let actBaoShiModel = ActBaoShiModel_1.ActBaoShiModel.getInstance(ctx, uuid);
    await actBaoShiModel.hecheng(iids);
});
/**
 * @api {post} /baoshi/plhecheng 宝石批量合成
 * @apiName 宝石批量合成
 * @apiGroup baoshi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {number} level 选择等级以下
 */
router.all('/plhecheng', async (ctx) => {
    ctx.state.apidesc = "星图-宝石批量合成";
    const { uuid, level } = tool_1.tool.getParams(ctx);
    let actBaoShiModel = ActBaoShiModel_1.ActBaoShiModel.getInstance(ctx, uuid);
    await actBaoShiModel.plhecheng(level);
});
/**
 * @api {post} /baoshi/jihuo 星图激活
 * @apiName 星图激活
 * @apiGroup baoshi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} xtid 星图ID
 */
router.all('/jihuo', async (ctx) => {
    ctx.state.apidesc = "星图-星图激活";
    const { uuid, xtid } = tool_1.tool.getParams(ctx);
    let actBaoShiModel = ActBaoShiModel_1.ActBaoShiModel.getInstance(ctx, uuid);
    await actBaoShiModel.jihuo(xtid);
});
/**
 * @api {post} /baoshi/xiangqian 星图镶嵌宝石
 * @apiName 星图镶嵌宝石
 * @apiGroup baoshi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} xtid 星图ID
 * @apiParam {string} xb 小星图下标
 * @apiParam {string} iid 宝石唯一ID
 */
router.all('/xiangqian', async (ctx) => {
    ctx.state.apidesc = "星图-星图镶嵌宝石";
    const { uuid, xtid, xb, iid } = tool_1.tool.getParams(ctx);
    let actBaoShiModel = ActBaoShiModel_1.ActBaoShiModel.getInstance(ctx, uuid);
    await actBaoShiModel.xiangqian(xtid, xb, iid);
});
/**
 * @api {post} /baoshi/huhuan 星图镶嵌宝石互换
 * @apiName 星图镶嵌宝石互换
 * @apiGroup baoshi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} xtid 星图ID
 * @apiParam {string} wzid 位置ID
 * @apiParam {string} wzid1 位置ID1
 */
router.all('/huhuan', async (ctx) => {
    ctx.state.apidesc = "星图-星图镶嵌宝石互换";
    const { uuid, xtid, wzid, wzid1 } = tool_1.tool.getParams(ctx);
    let actBaoShiModel = ActBaoShiModel_1.ActBaoShiModel.getInstance(ctx, uuid);
    await actBaoShiModel.huhuan(xtid, wzid, wzid1);
});
/**
 * @api {post} /baoshi/xiexia 星图卸下宝石
 * @apiName 星图卸下宝石
 * @apiGroup baoshi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} xtid 星图ID
 * @apiParam {string} xb 小星图下标
 */
router.all('/xiexia', async (ctx) => {
    ctx.state.apidesc = "星图-星图卸下宝石";
    const { uuid, xtid, xb } = tool_1.tool.getParams(ctx);
    let actBaoShiModel = ActBaoShiModel_1.ActBaoShiModel.getInstance(ctx, uuid);
    await actBaoShiModel.xiexia(xtid, xb);
});
/**
 * @api {post} /baoshi/upLevel 星图升级
 * @apiName 星图升级
 * @apiGroup baoshi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} xtid 星图IDh
 */
router.all('/upLevel', async (ctx) => {
    ctx.state.apidesc = "星图-星图升级";
    const { uuid, xtid } = tool_1.tool.getParams(ctx);
    let actBaoShiModel = ActBaoShiModel_1.ActBaoShiModel.getInstance(ctx, uuid);
    await actBaoShiModel.upLevel(xtid);
});
/**
 * @api {post} /baoshi/chongzhu 宝石重铸
 * @apiName 星图升级
 * @apiGroup baoshi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} iid 宝石唯一ID
 */
router.all('/chongzhu', async (ctx) => {
    ctx.state.apidesc = "星图-宝石重铸";
    const { uuid, iid } = tool_1.tool.getParams(ctx);
    let actBaoShiModel = ActBaoShiModel_1.ActBaoShiModel.getInstance(ctx, uuid);
    await actBaoShiModel.chongzhu(iid);
});
/**
 * @api {post} /baoshi/sxJiesuo 特殊属性解锁
 * @apiName 特殊属性解锁
 * @apiGroup baoshi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} key 属性key
 */
router.all('/sxJiesuo', async (ctx) => {
    ctx.state.apidesc = "星图-特殊属性解锁";
    const { uuid, key } = tool_1.tool.getParams(ctx);
    let actBaoShiModel = ActBaoShiModel_1.ActBaoShiModel.getInstance(ctx, uuid);
    await actBaoShiModel.sxJiesuo(key);
});
/**
 * @api {post} /baoshi/sxUse 特殊属性使用
 * @apiName 特殊属性使用
 * @apiGroup baoshi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} key 属性key
 */
router.all('/sxUse', async (ctx) => {
    ctx.state.apidesc = "星图-特殊属性使用";
    const { uuid, key } = tool_1.tool.getParams(ctx);
    let actBaoShiModel = ActBaoShiModel_1.ActBaoShiModel.getInstance(ctx, uuid);
    await actBaoShiModel.sxUse(key);
});
/**
 * @api {post} /baoshi/kxJiesuo 特殊属性解锁
 * @apiName 特殊属性解锁
 * @apiGroup baoshi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} key 属性key
 */
router.all('/kxJiesuo', async (ctx) => {
    ctx.state.apidesc = "星图-特殊属性解锁";
    const { uuid, key } = tool_1.tool.getParams(ctx);
    let actBaoShiModel = ActBaoShiModel_1.ActBaoShiModel.getInstance(ctx, uuid);
    await actBaoShiModel.kxJiesuo(key);
});
/**
 * @api {post} /baoshi/kxUse 特殊属性使用
 * @apiName 特殊属性使用
 * @apiGroup baoshi
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} key 属性key
 */
router.all('/kxUse', async (ctx) => {
    ctx.state.apidesc = "星图-特殊属性使用";
    const { uuid, key } = tool_1.tool.getParams(ctx);
    let actBaoShiModel = ActBaoShiModel_1.ActBaoShiModel.getInstance(ctx, uuid);
    await actBaoShiModel.kxUse(key);
});
//# sourceMappingURL=baoshi.js.map