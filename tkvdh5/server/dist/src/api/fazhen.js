"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tool_1 = require("../util/tool");
const ActFazhenModel_1 = require("../model/act/ActFazhenModel");
const gameCfg_1 = __importDefault(require("../../common/gameCfg"));
const router = new koa_router_1.default();
exports.router = router;
router.prefix('/fazhen');
/**
 * @api {post} /fazhen/xuanzhe 初始法阵选择
 * @apiName 初始法阵选择
 * @apiGroup fazhen
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} fzId 法阵ID
 */
router.all('/xuanzhe', async (ctx) => {
    ctx.state.apidesc = "灵兽-初始法阵选择";
    const { uuid, fzId } = tool_1.tool.getParams(ctx);
    let cfgMath = gameCfg_1.default.mathInfo.getItemCtx(ctx, 'zhenfa_init');
    if (cfgMath.pram.item == null) {
        ctx.throw("配置错误Math_zhenfa_init");
        return;
    }
    if (cfgMath.pram.item.indexOf(parseInt(fzId)) == -1) {
        ctx.throw("参数错误");
    }
    let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(ctx, uuid);
    await actFazhenModel.xuanzhe(fzId);
});
/**
 * @api {post} /fazhen/jiesuo 法阵解锁位置
 * @apiName 法阵解锁位置
 * @apiGroup fazhen
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 */
router.all('/jiesuo', async (ctx) => {
    ctx.state.apidesc = "灵兽-法阵解锁位置";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(ctx, uuid);
    await actFazhenModel.jiesuo();
});
/**
 * @api {post} /fazhen/ptChouqu 普通抽取
 * @apiName 普通抽取
 * @apiGroup fazhen
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 */
router.all('/ptChouqu', async (ctx) => {
    ctx.state.apidesc = "灵兽-普通抽取";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(ctx, uuid);
    await actFazhenModel.ptChouqu();
});
/**
 * @api {post} /fazhen/gjChouqu 高级抽取
 * @apiName 高级抽取
 * @apiGroup fazhen
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 */
router.all('/gjChouqu', async (ctx) => {
    ctx.state.apidesc = "灵兽-高级抽取";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(ctx, uuid);
    await actFazhenModel.gjChouqu();
});
/**
 * @api {post} /fazhen/zhaohuan 召唤法阵
 * @apiName 召唤法阵
 * @apiGroup fazhen
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 */
router.all('/zhaohuan', async (ctx) => {
    ctx.state.apidesc = "灵兽-召唤法阵";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(ctx, uuid);
    await actFazhenModel.zhaohuan();
});
/**
 * @api {post} /fazhen/upLevel 升级升阶
 * @apiName 升级升阶
 * @apiGroup fazhen
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} gzId 法阵放置的格子ID
 * @apiParam {number} type 0默认1随机2指定
 */
router.all('/upLevel', async (ctx) => {
    ctx.state.apidesc = "灵兽-升级升阶";
    const { uuid, gzId, type } = tool_1.tool.getParams(ctx);
    let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(ctx, uuid);
    await actFazhenModel.upLevel(gzId, type);
});
/**
 * @api {post} /fazhen/zibao 法阵自爆
 * @apiName 法阵自爆
 * @apiGroup fazhen
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} gzId 法阵放置的格子ID
 */
router.all('/zibao', async (ctx) => {
    ctx.state.apidesc = "灵兽-法阵自爆";
    const { uuid, gzId } = tool_1.tool.getParams(ctx);
    let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(ctx, uuid);
    await actFazhenModel.zibao(gzId);
});
/**
 * @api {post} /fazhen/shangzhen 法阵上阵
 * @apiName 法阵上阵
 * @apiGroup fazhen
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} gzId 法阵放置的格子ID
 */
router.all('/shangzhen', async (ctx) => {
    ctx.state.apidesc = "灵兽-法阵上阵";
    const { uuid, gzId } = tool_1.tool.getParams(ctx);
    let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(ctx, uuid);
    await actFazhenModel.shangzhen(gzId);
});
/**
 * @api {post} /fazhen/lianjinShang 炼金上阵
 * @apiName 炼金上阵
 * @apiGroup fazhen
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} gzId 法阵放置的格子ID
 */
router.all('/lianjinShang', async (ctx) => {
    ctx.state.apidesc = "灵兽-炼金上阵";
    const { uuid, gzId } = tool_1.tool.getParams(ctx);
    let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(ctx, uuid);
    await actFazhenModel.lianjinShang(gzId);
});
/**
 * @api {post} /fazhen/lianjinXia 炼金下阵
 * @apiName 炼金下阵
 * @apiGroup fazhen
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} gzId 法阵放置的格子ID
 */
router.all('/lianjinXia', async (ctx) => {
    ctx.state.apidesc = "灵兽-炼金下阵";
    const { uuid, gzId } = tool_1.tool.getParams(ctx);
    let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(ctx, uuid);
    await actFazhenModel.lianjinXia(gzId);
});
/**
 * @api {post} /fazhen/lianjinRwd 炼金领取
 * @apiName 炼金领取
 * @apiGroup fazhen
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 */
router.all('/lianjinRwd', async (ctx) => {
    ctx.state.apidesc = "灵兽-炼金领取";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(ctx, uuid);
    await actFazhenModel.lianjinRwd();
});
/**
 * @api {post} /fazhen/chouquNew 大改版抽取
 * @apiName 大改版抽取
 * @apiGroup fazhen
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {number} type 1金币抽2灵石抽3广告灵石抽
 */
router.all('/chouquNew', async (ctx) => {
    ctx.state.apidesc = "灵兽-大改版抽取";
    const { uuid, type } = tool_1.tool.getParams(ctx);
    let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(ctx, uuid);
    await actFazhenModel.chouquNew(type);
});
/**
 * @api {post} /fazhen/buzhuo 大改版捕捉
 * @apiName 大改版捕捉
 * @apiGroup fazhen
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} fzId 法阵ID
 */
router.all('/buzhuo', async (ctx) => {
    ctx.state.apidesc = "灵兽-大改版捕捉";
    const { uuid, fzId } = tool_1.tool.getParams(ctx);
    let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(ctx, uuid);
    await actFazhenModel.buzhuo(fzId);
});
/**
 * @api {post} /fazhen/upPinZhi 大改版升品质
 * @apiName 大改版升品质
 * @apiGroup fazhen
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string[]} gzIds 法阵放置的格子ID列表
 */
router.all('/upPinZhi', async (ctx) => {
    ctx.state.apidesc = "灵兽-大改版升品质";
    const { uuid, gzIds } = tool_1.tool.getParams(ctx);
    let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(ctx, uuid);
    await actFazhenModel.upPinZhi(gzIds);
});
/**
 * @api {post} /fazhen/tunshi 大改版吞噬
 * @apiName 大改版吞噬
 * @apiGroup fazhen
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string[]} gzIds 法阵放置的格子ID列表
 */
router.all('/tunshi', async (ctx) => {
    ctx.state.apidesc = "灵兽-大改版吞噬";
    const { uuid, gzIds } = tool_1.tool.getParams(ctx);
    let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(ctx, uuid);
    await actFazhenModel.tunshi(gzIds);
});
/**
 * @api {post} /fazhen/genghuan 更换技能
 * @apiName 更换技能
 * @apiGroup fazhen
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} gzId 法阵放置的格子ID
 * @apiParam {string} skillId 要更换的ID
 */
router.all('/genghuan', async (ctx) => {
    ctx.state.apidesc = "灵兽-更换技能";
    const { uuid, gzId, skillId } = tool_1.tool.getParams(ctx);
    let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(ctx, uuid);
    await actFazhenModel.genghuan(gzId, skillId);
});
/**
 * @api {post} /fazhen/gjtunshi 大改版高级吞噬
 * @apiName 大改版高级吞噬
 * @apiGroup fazhen
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string[]} cs 法阵放置的格子ID列表[格子A,技能A,格子B,技能B]
 */
router.all('/gjtunshi', async (ctx) => {
    ctx.state.apidesc = "灵兽-大改版高级吞噬";
    const { uuid, cs } = tool_1.tool.getParams(ctx);
    let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(ctx, uuid);
    await actFazhenModel.gjtunshi(cs);
});
/**
 * @api {post} /fazhen/fangqi 放弃技能
 * @apiName 放弃技能
 * @apiGroup fazhen
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} gzId 法阵放置的格子ID
 */
router.all('/fangqi', async (ctx) => {
    ctx.state.apidesc = "灵兽-放弃技能";
    const { uuid, gzId } = tool_1.tool.getParams(ctx);
    let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(ctx, uuid);
    await actFazhenModel.fangqi(gzId);
});
/**
 * @api {post} /fazhen/delRed 删除羁绊红点
 * @apiName 删除羁绊红点
 * @apiGroup fazhen
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} fzId 法阵ID
 */
router.all('/delRed', async (ctx) => {
    ctx.state.apidesc = "灵兽-删除羁绊红点";
    const { uuid, fzId } = tool_1.tool.getParams(ctx);
    let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(ctx, uuid);
    await actFazhenModel.delRed(fzId);
});
/**
 * @api {post} /fazhen/delRedAll 删除所有羁绊红点
 * @apiName 删除所有羁绊红点
 * @apiGroup fazhen
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 */
router.all('/delRedAll', async (ctx) => {
    ctx.state.apidesc = "灵兽-删除所有羁绊红点";
    const { uuid, fzId } = tool_1.tool.getParams(ctx);
    let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(ctx, uuid);
    await actFazhenModel.delRedAll();
});
/**
 * @api {post} /fazhen/chongsheng 灵兽重生
 * @apiName 灵兽重生
 * @apiGroup fazhen
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} gzId 法阵放置的格子ID
 */
router.all('/chongsheng', async (ctx) => {
    ctx.state.apidesc = "灵兽-灵兽重生";
    const { uuid, gzId } = tool_1.tool.getParams(ctx);
    let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(ctx, uuid);
    await actFazhenModel.chongsheng(gzId);
});
/**
 * @api {post} /fazhen/upStar 灵兽升星
 * @apiName 灵兽升星
 * @apiGroup fazhen
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} gzId1 目标格子ID
 * @apiParam {string} gzId2 材料格子ID
 */
router.all('/upStar', async (ctx) => {
    ctx.state.apidesc = "灵兽-灵兽升星";
    const { uuid, gzId1, gzId2 } = tool_1.tool.getParams(ctx);
    let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(ctx, uuid);
    await actFazhenModel.upStar(gzId1, gzId2);
});
/**
 * @api {post} /fazhen/suoding 灵兽锁定
 * @apiName 灵兽锁定
 * @apiGroup fazhen
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} gzId 目标格子
 * @apiParam {string} skid 技能ID
 */
router.all('/suoding', async (ctx) => {
    ctx.state.apidesc = "灵兽-灵兽锁定";
    const { uuid, gzId, skid } = tool_1.tool.getParams(ctx);
    let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(ctx, uuid);
    await actFazhenModel.suoding(gzId, skid);
});
/**
 * @api {post} /fazhen/xilian 灵兽洗练
 * @apiName 灵兽洗练
 * @apiGroup fazhen
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} gzId 目标格子
 */
router.all('/xilian', async (ctx) => {
    ctx.state.apidesc = "灵兽-灵兽洗练";
    const { uuid, gzId } = tool_1.tool.getParams(ctx);
    let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(ctx, uuid);
    await actFazhenModel.xilian(gzId);
});
/**
 * @api {post} /fazhen/xietong 兽灵协同
 * @apiName 兽灵协同
 * @apiGroup fazhen
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} gzId 目标格子
 * @apiParam {string} xtId 协同格子
 */
router.all('/xietong', async (ctx) => {
    ctx.state.apidesc = "灵兽-兽灵协同";
    const { uuid, gzId, xtId } = tool_1.tool.getParams(ctx);
    let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(ctx, uuid);
    await actFazhenModel.xietong(gzId, xtId);
});
/**
 * @api {post} /fazhen/setFzid 设置目标兽灵
 * @apiName 设置目标兽灵
 * @apiGroup fazhen
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token
 * @apiParam {string} fzid 兽灵Id
 */
router.all('/setFzid', async (ctx) => {
    ctx.state.apidesc = "灵兽-设置目标兽灵";
    const { uuid, fzid } = tool_1.tool.getParams(ctx);
    let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(ctx, uuid);
    await actFazhenModel.setFzid(fzid);
});
//# sourceMappingURL=fazhen.js.map