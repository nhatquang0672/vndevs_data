"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const router = new koa_router_1.default();
exports.router = router;
const s_game_1 = __importDefault(require("../tool/s_game"));
const tool_1 = require("../../src/util/tool");
const game_1 = __importDefault(require("../../src/util/game"));
const A_HuodongModel_1 = require("../model/A_HuodongModel");
router.prefix('/s_huodong');
//登陆页面
router.all('/:token', async (ctx) => {
    let list = await A_HuodongModel_1.a_HuodongModel.getList();
    let back = await s_game_1.default.allOut(ctx, list);
    await ctx.render('a_huodong', back);
});
//查询
router.post('/find/:token', async (ctx) => {
    let { key, hdcid } = tool_1.tool.getParamsAdmin(ctx);
    let sql = {};
    if (key != null && key != "") {
        sql["key"] = key;
    }
    if (hdcid != null && hdcid != "") {
        sql["hdcid"] = hdcid;
    }
    let list = await A_HuodongModel_1.a_HuodongModel.getList(sql);
    let back = await s_game_1.default.allOut(ctx, list);
    await ctx.render('a_huodong', back);
});
//删除
router.post('/delete/:token/:id', async (ctx) => {
    let { id } = ctx.params;
    await A_HuodongModel_1.a_HuodongModel.delete(id);
    let list = await A_HuodongModel_1.a_HuodongModel.getList();
    let back = await s_game_1.default.allOut(ctx, list);
    await ctx.render('a_huodong', back);
});
//添加
router.post('/add/:token', async (ctx) => {
    let { id } = ctx.params;
    let userinfo = await A_HuodongModel_1.a_HuodongModel.findOneById(id);
    let back = await s_game_1.default.allOut(ctx, userinfo);
    await ctx.render('a_huodong_add', back);
});
//添加保存
router.post('/addSave/:token', async (ctx) => {
    let params = tool_1.tool.getParamsAdmin(ctx);
    params.s_at = game_1.default.getTimeByStr(params.s_at);
    params.e_at = game_1.default.getTimeByStr(params.e_at);
    delete params.token;
    await A_HuodongModel_1.a_HuodongModel.insert(params);
    let back = await s_game_1.default.allOut(ctx);
    back.data = await A_HuodongModel_1.a_HuodongModel.getList();
    await ctx.render('a_huodong', back);
});
//编辑
router.post('/edit/:token/:id', async (ctx) => {
    let { id } = ctx.params;
    let userinfo = await A_HuodongModel_1.a_HuodongModel.findOneById(id);
    let back = await s_game_1.default.allOut(ctx, userinfo);
    back.data.s_at = game_1.default.getDayTime(back.data.s_at);
    back.data.e_at = game_1.default.getDayTime(back.data.e_at);
    await ctx.render('a_huodong_edit', back);
});
//编辑 - 保存
router.post('/editSave/:token/:id', async (ctx) => {
    let { id } = ctx.params;
    let params = tool_1.tool.getParamsAdmin(ctx);
    params.s_at = params.s_at == "" ? 0 : game_1.default.getTimeByStr(params.s_at);
    params.e_at = params.e_at == "" ? 0 : game_1.default.getTimeByStr(params.e_at);
    delete params.token;
    await A_HuodongModel_1.a_HuodongModel.update(id, params);
    let back = await s_game_1.default.allOut(ctx);
    back.data = await A_HuodongModel_1.a_HuodongModel.getList();
    await ctx.render('a_huodong', back);
});
//添加
router.post('/copy/:token/:id', async (ctx) => {
    let { id } = ctx.params;
    let userinfo = await A_HuodongModel_1.a_HuodongModel.findOneById(id);
    let back = await s_game_1.default.allOut(ctx, userinfo);
    await ctx.render('a_huodong_copy', back);
});
//添加保存
router.post('/copySave/:token', async (ctx) => {
    let params = tool_1.tool.getParamsAdmin(ctx);
    params.s_at = game_1.default.getTimeByStr(params.s_at);
    params.e_at = game_1.default.getTimeByStr(params.e_at);
    delete params.token;
    await A_HuodongModel_1.a_HuodongModel.insert(params);
    let back = await s_game_1.default.allOut(ctx);
    back.data = await A_HuodongModel_1.a_HuodongModel.getList();
    await ctx.render('a_huodong', back);
});
//# sourceMappingURL=s_huodong.js.map