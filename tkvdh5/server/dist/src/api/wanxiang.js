"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tool_1 = require("../util/tool");
const ActWanXiangModel_1 = require("../model/act/ActWanXiangModel");
const router = new koa_router_1.default();
exports.router = router;
router.prefix('/wanxiang');
/**
 * @api {post} /wanxiang/into 进入万象
 * @apiName 进入万象
 * @apiGroup wanxiang
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all('/into', async (ctx) => {
    ctx.state.apidesc = "万象-进入万象";
    const { uuid } = tool_1.tool.getParams(ctx);
    // let actWanXiangModel = ActWanXiangModel.getInstance(ctx,uuid)
    // await actWanXiangModel.into()
});
/**
 * @api {post} /wanxiang/yansuan 演算
 * @apiName 演算
 * @apiGroup wanxiang
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {number} isOpen 1自动0不自动
 *
 */
router.all('/yansuan', async (ctx) => {
    ctx.state.apidesc = "万象-演算";
    const { uuid, isOpen } = tool_1.tool.getParams(ctx);
    let actWanXiangModel = ActWanXiangModel_1.ActWanXiangModel.getInstance(ctx, uuid);
    if (isOpen == 1) {
        await actWanXiangModel.yiwang();
    }
    await actWanXiangModel.yansuan(isOpen);
});
/**
 * @api {post} /wanxiang/zhuangbei 装备
 * @apiName 装备
 * @apiGroup wanxiang
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all('/zhuangbei', async (ctx) => {
    ctx.state.apidesc = "万象-装备";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actWanXiangModel = ActWanXiangModel_1.ActWanXiangModel.getInstance(ctx, uuid);
    await actWanXiangModel.zhuangbei();
});
/**
 * @api {post} /wanxiang/yiwang 遗忘
 * @apiName 遗忘
 * @apiGroup wanxiang
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all('/yiwang', async (ctx) => {
    ctx.state.apidesc = "万象-遗忘";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actWanXiangModel = ActWanXiangModel_1.ActWanXiangModel.getInstance(ctx, uuid);
    await actWanXiangModel.yiwang();
});
/**
* @api {post} /wanxiang/setOpen 设置是否开启自动模式
* @apiName 设置是否开启自动模式
* @apiGroup wanxiang
*
* @apiParam {string} uuid 角色uuid
* @apiParam {string} token 角色token (user下发得token字段)
*
*/
router.all('/setOpen', async (ctx) => {
    ctx.state.apidesc = "万象-设置是否开启自动模式";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actWanXiangModel = ActWanXiangModel_1.ActWanXiangModel.getInstance(ctx, uuid);
    await actWanXiangModel.setOpen();
});
/**
 * @api {post} /wanxiang/setYw 设置是否自动遗忘
 * @apiName 设置是否自动遗忘
 * @apiGroup wanxiang
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all('/setYw', async (ctx) => {
    ctx.state.apidesc = "万象-设置是否自动遗忘";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actWanXiangModel = ActWanXiangModel_1.ActWanXiangModel.getInstance(ctx, uuid);
    await actWanXiangModel.setYw();
});
/**
 * @api {post} /wanxiang/setMoshi 设置自动模式
 * @apiName 设置自动模式
 * @apiGroup wanxiang
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {number} pinzhi 大于等于命格品质
 * @apiParam {number} upPower 0|1战力提升时停止
 * @apiParam {number} hq 0同时 1或者
 * @apiParam {Wxmskeys} keys [是否选择，属性key1，属性key2] ""表示任意
 * @apiParam {Wxmslm} lm [是否选择，灵脉id] ""表示任意
 *
 */
router.all('/setMoshi', async (ctx) => {
    ctx.state.apidesc = "万象-设置自动模式";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actWanXiangModel = ActWanXiangModel_1.ActWanXiangModel.getInstance(ctx, uuid);
    await actWanXiangModel.setMoshi();
});
/**
 * @api {post} /wanxiang/upKwd 提升开悟点
 * @apiName 提升开悟点
 * @apiGroup wanxiang
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {number} count 开悟次数
 *
 */
router.all('/upKwd', async (ctx) => {
    ctx.state.apidesc = "万象-提升开悟点";
    const { uuid, count } = tool_1.tool.getParams(ctx);
    if (count < 1) {
        ctx.throw("参数错误");
    }
    let actWanXiangModel = ActWanXiangModel_1.ActWanXiangModel.getInstance(ctx, uuid);
    await actWanXiangModel.upKwd(count);
});
/**
 * @api {post} /wanxiang/canwu 秘法参悟
 * @apiName 秘法参悟
 * @apiGroup wanxiang
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {number} count 参悟次数
 */
router.all('/canwu', async (ctx) => {
    ctx.state.apidesc = "万象-秘法参悟";
    const { uuid, count } = tool_1.tool.getParams(ctx);
    if (count < 1) {
        ctx.throw("参数错误");
    }
    let actWanXiangModel = ActWanXiangModel_1.ActWanXiangModel.getInstance(ctx, uuid);
    await actWanXiangModel.canwu(count, true);
});
/**
 * @api {post} /wanxiang/upLv 秘法升级
 * @apiName 秘法升级
 * @apiGroup wanxiang
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} mfid 秘法id
 */
router.all('/upLv', async (ctx) => {
    ctx.state.apidesc = "万象-秘法升级";
    const { uuid, mfid } = tool_1.tool.getParams(ctx);
    let actWanXiangModel = ActWanXiangModel_1.ActWanXiangModel.getInstance(ctx, uuid);
    await actWanXiangModel.upLv(mfid);
});
/**
 * @api {post} /wanxiang/upStep 秘法升阶
 * @apiName 秘法升阶
 * @apiGroup wanxiang
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} mfid 秘法id
 */
router.all('/upStep', async (ctx) => {
    ctx.state.apidesc = "万象-秘法升阶";
    const { uuid, mfid } = tool_1.tool.getParams(ctx);
    let actWanXiangModel = ActWanXiangModel_1.ActWanXiangModel.getInstance(ctx, uuid);
    await actWanXiangModel.upStep(mfid);
});
/**
 * @api {post} /wanxiang/chongzhi 秘法重置
 * @apiName 秘法重置
 * @apiGroup wanxiang
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} mfid 秘法id
 */
router.all('/chongzhi', async (ctx) => {
    ctx.state.apidesc = "万象-秘法重置";
    const { uuid, mfid } = tool_1.tool.getParams(ctx);
    let actWanXiangModel = ActWanXiangModel_1.ActWanXiangModel.getInstance(ctx, uuid);
    await actWanXiangModel.chongzhi(mfid);
});
/**
 * @api {post} /wanxiang/chuzhan 秘法出战
 * @apiName 秘法出战
 * @apiGroup wanxiang
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} mfid 秘法id
 */
router.all('/chuzhan', async (ctx) => {
    ctx.state.apidesc = "万象-秘法出战";
    const { uuid, mfid } = tool_1.tool.getParams(ctx);
    let actWanXiangModel = ActWanXiangModel_1.ActWanXiangModel.getInstance(ctx, uuid);
    await actWanXiangModel.chuzhan(mfid);
});
/**
 * @api {post} /wanxiang/tjUplv 图鉴升级
 * @apiName 图鉴升级
 * @apiGroup wanxiang
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} tjid 图鉴id
 */
router.all('/tjUplv', async (ctx) => {
    ctx.state.apidesc = "万象-图鉴升级";
    const { uuid, tjid } = tool_1.tool.getParams(ctx);
    let actWanXiangModel = ActWanXiangModel_1.ActWanXiangModel.getInstance(ctx, uuid);
    await actWanXiangModel.tjUplv(tjid);
});
/**
 * @api {post} /wanxiang/mwGenghuan 秘法更换铭文
 * @apiName 秘法更换铭文
 * @apiGroup wanxiang
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} mfid 秘法id
 * @apiParam {number} xbid 铭文下标
 * @apiParam {string} mwid 更换的铭文ID没有发""
 */
router.all('/mwGenghuan', async (ctx) => {
    ctx.state.apidesc = "万象-秘法更换铭文";
    const { uuid, mfid, xbid, mwid } = tool_1.tool.getParams(ctx);
    let actWanXiangModel = ActWanXiangModel_1.ActWanXiangModel.getInstance(ctx, uuid);
    await actWanXiangModel.mwGenghuan(mfid, xbid, mwid);
});
/**
 * @api {post} /wanxiang/mwhecheng 铭文3合1
 * @apiName 铭文3合1
 * @apiGroup wanxiang
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} mwid 铭文ID
 */
router.all('/mwhecheng', async (ctx) => {
    ctx.state.apidesc = "万象-铭文3合1";
    const { uuid, mwid } = tool_1.tool.getParams(ctx);
    let actWanXiangModel = ActWanXiangModel_1.ActWanXiangModel.getInstance(ctx, uuid);
    await actWanXiangModel.mwhecheng(mwid);
});
/**
 * @api {post} /wanxiang/mwhcAll 铭文一键合成
 * @apiName 铭文一键合成
 * @apiGroup wanxiang
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 */
router.all('/mwhcAll', async (ctx) => {
    ctx.state.apidesc = "万象-铭文一键合成";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actWanXiangModel = ActWanXiangModel_1.ActWanXiangModel.getInstance(ctx, uuid);
    await actWanXiangModel.mwhcAll();
});
/**
 * @api {post} /wanxiang/buyCons 购买自动开启命盘次数
 * @apiName 购买自动开启命盘次数
 * @apiGroup wanxiang
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {number} count 购买次数
 */
router.all('/buyCons', async (ctx) => {
    ctx.state.apidesc = "万象-购买自动开启命盘次数";
    const { uuid, count } = tool_1.tool.getParams(ctx);
    let actWanXiangModel = ActWanXiangModel_1.ActWanXiangModel.getInstance(ctx, uuid);
    await actWanXiangModel.buyCons(count);
});
//# sourceMappingURL=wanxiang.js.map