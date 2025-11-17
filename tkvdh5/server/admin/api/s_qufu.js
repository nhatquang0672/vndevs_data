"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const router = new koa_router_1.default();
exports.router = router;
const A_QufuModel_1 = require("../model/A_QufuModel");
const s_game_1 = __importDefault(require("../tool/s_game"));
const tool_1 = require("../../src/util/tool");
const game_1 = __importDefault(require("../../src/util/game"));
const mongodb_1 = require("../../src/util/mongodb");
router.prefix('/s_qufu');
//登陆页面
router.all('/:token', async (ctx) => {
    let list = await A_QufuModel_1.a_QufuModel.getList();
    let back = await s_game_1.default.allOut(ctx, list);
    await ctx.render('a_qufu', back);
});
//删除
router.post('/delete/:token/:id', async (ctx) => {
    let { id } = ctx.params;
    await A_QufuModel_1.a_QufuModel.delete(id);
    await mongodb_1.dbSev.getDataDb().getNextId('A_VER');
    let win = {};
    win["msg"] = "删除成功";
    let list = await A_QufuModel_1.a_QufuModel.getList();
    let back = await s_game_1.default.allOut(ctx, list, win);
    await ctx.render('a_qufu', back);
});
//添加
router.post('/add/:token', async (ctx) => {
    let { id } = ctx.params;
    let userinfo = await A_QufuModel_1.a_QufuModel.findOneById(id);
    let back = await s_game_1.default.allOut(ctx, userinfo);
    await ctx.render('a_qufu_add', back);
});
//添加保存
router.post('/addSave/:token', async (ctx) => {
    let params = tool_1.tool.getParamsAdmin(ctx);
    params.openAt = game_1.default.getTimeByStr(params.openAt);
    await A_QufuModel_1.a_QufuModel.insert(params);
    let back = await s_game_1.default.allOut(ctx);
    back.data = await A_QufuModel_1.a_QufuModel.getList();
    await ctx.render('a_qufu', back);
});
//编辑
router.post('/edit/:token/:id', async (ctx) => {
    let { id } = ctx.params;
    let userinfo = await A_QufuModel_1.a_QufuModel.findOneById(id);
    let back = await s_game_1.default.allOut(ctx, userinfo);
    back.data.openAt = game_1.default.getDayTime(back.data.openAt);
    await ctx.render('a_qufu_edit', back);
});
//编辑 - 保存
router.post('/editSave/:token/:id', async (ctx) => {
    let { id } = ctx.params;
    let params = tool_1.tool.getParamsAdmin(ctx);
    let sdata = {
        sid: params.sid,
        name: params.name,
        status: params.status,
        openAt: game_1.default.getTimeByStr(params.openAt),
        heid: params.heid,
        suofu: params.suofu
    };
    await A_QufuModel_1.a_QufuModel.update(id, sdata);
    let back = await s_game_1.default.allOut(ctx);
    back.data = await A_QufuModel_1.a_QufuModel.getList();
    await ctx.render('a_qufu', back);
});
//# sourceMappingURL=s_qufu.js.map