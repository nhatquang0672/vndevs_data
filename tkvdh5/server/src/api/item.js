"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tool_1 = require("../util/tool");
const gameCfg_1 = __importDefault(require("../../common/gameCfg"));
const game_1 = __importDefault(require("../util/game"));
const ActWanXiangModel_1 = require("../model/act/ActWanXiangModel");
const ActDaoyouModel_1 = require("../model/act/ActDaoyouModel");
const ActJingGuaiModel_1 = require("../model/act/ActJingGuaiModel");
const router = new koa_router_1.default();
exports.router = router;
router.prefix('/item');
/**
 * @api {post} /item/hecheng 道具合成
 * @apiName 道具合成
 * @apiGroup item
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {number} id 道具ID
 * @apiParam {number} count 道具数量
 *
 */
router.all('/hecheng', async (ctx) => {
    ctx.state.apidesc = "道具-道具合成";
    const { id, count } = tool_1.tool.getParams(ctx);
    if (count > 0) { }
    else {
        ctx.throw("参数错误");
    }
    let cfg = gameCfg_1.default.itemMoney.getItemCtx(ctx, id.toString());
    if (cfg.type != "hecheng") {
        ctx.throw("道具不能合成");
    }
    if (cfg.param.items == null || cfg.param.items.length <= 0) {
        ctx.throw("合成参数配置错误");
        return;
    }
    await ctx.state.master.subItem2(game_1.default.chengArr(cfg.param.items, count));
    await ctx.state.master.addItem1([1, id, count]);
});
/**
 * @api {post} /item/use 使用道具
 * @apiName 使用道具
 * @apiGroup item
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {number} id 道具ID
 * @apiParam {number} count 道具数量
 * @apiParam {string} fzid 自选id默认""
 *
 */
router.all('/use', async (ctx) => {
    ctx.state.apidesc = "道具-使用道具";
    const { uuid, id, count, fzid } = tool_1.tool.getParams(ctx);
    let cfg = gameCfg_1.default.itemMoney.getItemCtx(ctx, id.toString());
    if (cfg == null) {
        ctx.throw("id参数错误");
    }
    if (count < 1) {
        ctx.throw("count参数错误");
    }
    switch (cfg.type) {
        case "fazhen":
            await ctx.state.master.subItem1([1, id, 1]);
            await ctx.state.master.addItem1([2, fzid, 1]);
            break;
        case "fazhensj":
            if (cfg.param.nums == null) {
                ctx.throw("fazhensj_配置错误");
                return;
            }
            await ctx.state.master.subItem1([1, id, count]);
            for (let index = 0; index < count; index++) {
                let _fzid = game_1.default.getRandArr(cfg.param.nums, 1)[0];
                await ctx.state.master.addItem1([2, _fzid, 1]);
            }
            break;
        case "hecheng":
            if (cfg.param.items == null || cfg.param.items.length <= 0) {
                ctx.throw("合成参数配置错误");
                return;
            }
            await ctx.state.master.subItem2(game_1.default.chengArr(cfg.param.items, count));
            await ctx.state.master.addItem1([1, id, count]);
            break;
        case "baoshidai":
            if (cfg.param.nums == null) {
                ctx.throw("baoshidai_配置错误");
                return;
            }
            await ctx.state.master.subItem1([1, id, count]);
            let items = [];
            for (let index = 0; index < count; index++) {
                let getId = game_1.default.getRandArr(cfg.param.nums, 1)[0];
                items.push([9, getId, 1]);
            }
            await ctx.state.master.addItem2(items, "");
            break;
        case "mingwensj":
            if (cfg.param.nums == null) {
                ctx.throw("mingwensj_配置错误");
                return;
            }
            await ctx.state.master.subItem1([1, id, count]);
            let actWanXiangModel = ActWanXiangModel_1.ActWanXiangModel.getInstance(ctx, uuid);
            for (let index = 0; index < count; index++) {
                let _mwid = game_1.default.getRandArr(cfg.param.nums, 1)[0];
                await actWanXiangModel.addMw(_mwid.toString(), 1);
                ctx.state.master.addWin("items", [16, _mwid, 1]);
            }
            break;
        case "mingwenzx":
            if (cfg.param.nums == null) {
                ctx.throw("mingwensj_配置错误");
                return;
            }
            if (cfg.param.nums.indexOf(fzid) != -1) {
                ctx.throw("mingwenzx_自选参数错误");
            }
            await ctx.state.master.subItem1([1, id, count]);
            let actWanXiangModel1 = ActWanXiangModel_1.ActWanXiangModel.getInstance(ctx, uuid);
            await actWanXiangModel1.addMw(fzid, count);
            ctx.state.master.addWin("items", [16, fzid, count]);
            break;
        case "wanxiangdan":
            if (cfg.param.count == null) {
                ctx.throw("wanxiangdan_配置错误");
                return;
            }
            await ctx.state.master.subItem1([1, id, count]);
            let allcount = cfg.param.count * count;
            let actWanXiangModel5 = ActWanXiangModel_1.ActWanXiangModel.getInstance(ctx, uuid);
            await actWanXiangModel5.addCons(allcount);
            ctx.state.master.addWin("msg", `获得自动演化${allcount}次`);
            break;
        case "mifazx":
            if (cfg.param.nums == null) {
                ctx.throw("mifazx_配置错误");
                return;
            }
            if (cfg.param.nums.indexOf(fzid) != -1) {
                ctx.throw("mingwenzx_自选参数错误");
            }
            await ctx.state.master.subItem1([1, id, count]);
            let actWanXiangModel2 = ActWanXiangModel_1.ActWanXiangModel.getInstance(ctx, uuid);
            for (let index = 0; index < count; index++) {
                let fitem = await actWanXiangModel2.addMf(fzid);
                ctx.state.master.addWin("items", fitem);
            }
            break;
        case "mifasj":
            if (cfg.param.nums == null) {
                ctx.throw("mifasj_配置错误");
            }
            await ctx.state.master.subItem1([1, id, count]);
            let actWanXiangModel3 = ActWanXiangModel_1.ActWanXiangModel.getInstance(ctx, uuid);
            for (let index = 0; index < count; index++) {
                let _mfid = game_1.default.getRandArr(cfg.param.nums, 1)[0];
                let fitem = await actWanXiangModel3.addMf(_mfid.toString());
                ctx.state.master.addWin("items", fitem);
            }
            break;
        case "daoyou":
            await ctx.state.master.subItem1([1, id, count]);
            let daoYouMod = ActDaoyouModel_1.ActDaoyouModel.getInstance(ctx, uuid);
            await daoYouMod.addFavor(fzid, id, count);
            break;
        case "daoyouzx":
            if (cfg.param.nums == null) {
                ctx.throw("daoyouzx_配置错误");
            }
            await ctx.state.master.subItem1([1, id, count]);
            await ctx.state.master.addItem1([1, fzid, count]);
            break;
        case "daoyousj":
            if (cfg.param.items == null) {
                ctx.throw("daoyousj_配置错误");
            }
            await ctx.state.master.subItem1([1, id, count]);
            for (let index = 0; index < count; index++) {
                await ctx.state.master.addItem1(tool_1.tool.getRandomList(cfg.param.items, 1));
            }
            break;
        case "jingguaizx": //开启后，在以下传奇精怪中自选1个
            if (cfg.param.nums == null) {
                ctx.throw("jingguaisj_配置错误");
                return;
            }
            if (cfg.param.nums.indexOf(fzid) != -1) {
                ctx.throw("jingguaizx_自选参数错误");
            }
            await ctx.state.master.subItem1([1, id, count]);
            let actJingGuaiModel1 = ActJingGuaiModel_1.ActJingGuaiModel.getInstance(ctx, uuid);
            let cfgjg2 = gameCfg_1.default.jingguaiInfo.getItemCtx(ctx, fzid.toString());
            await actJingGuaiModel1.addChip(fzid.toString(), cfgjg2.hecheng * count);
            ctx.state.master.addWin("items", [20, fzid, cfgjg2.hecheng * count]);
            break;
        case "jingguaisj": //开启后，在以下传奇精怪中随机获取1个
            if (cfg.param.nums == null) {
                ctx.throw("jingguaisj_配置错误");
                return;
            }
            await ctx.state.master.subItem1([1, id, count]);
            let actJingGuaiModel2 = ActJingGuaiModel_1.ActJingGuaiModel.getInstance(ctx, uuid);
            for (let index = 0; index < count; index++) {
                let _jgid = game_1.default.getRandArr(cfg.param.nums, 1)[0];
                let cfgjg2 = gameCfg_1.default.jingguaiInfo.getItemCtx(ctx, _jgid.toString());
                await actJingGuaiModel2.addChip(_jgid.toString(), cfgjg2.hecheng);
                ctx.state.master.addWin("items", [20, _jgid, cfgjg2.hecheng]);
            }
            break;
        case "jingguaispzx": //开启后，在以下上品精怪碎片中自选1个
            if (cfg.param.nums == null) {
                ctx.throw("jingguaisj_配置错误");
                return;
            }
            if (cfg.param.nums.indexOf(fzid) != -1) {
                ctx.throw("jingguaizx_自选参数错误");
            }
            await ctx.state.master.subItem1([1, id, count]);
            let actJingGuaiModel3 = ActJingGuaiModel_1.ActJingGuaiModel.getInstance(ctx, uuid);
            await actJingGuaiModel3.addChip(fzid.toString(), count);
            ctx.state.master.addWin("items", [20, fzid, count]);
            break;
        case "jingguaispsj": //开启后，在以下极品精怪碎片中随机获得1个
            if (cfg.param.nums == null) {
                ctx.throw("jingguaisj_配置错误");
                return;
            }
            await ctx.state.master.subItem1([1, id, count]);
            let actJingGuaiModel4 = ActJingGuaiModel_1.ActJingGuaiModel.getInstance(ctx, uuid);
            for (let index = 0; index < count; index++) {
                let _jgid = game_1.default.getRandArr(cfg.param.nums, 1)[0];
                await actJingGuaiModel4.addChip(_jgid.toString(), 1);
                ctx.state.master.addWin("items", [20, _jgid, 1]);
            }
            break;
        default:
            ctx.throw("未处理类型" + cfg.type);
    }
});
//# sourceMappingURL=item.js.map