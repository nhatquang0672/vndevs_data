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
const A_SettingModel_1 = require("../model/A_SettingModel");
router.prefix('/s_setting');
//登陆页面
router.all('/:token', async (ctx) => {
    let list = await A_SettingModel_1.a_SettingModel.getList();
    let back = await s_game_1.default.allOut(ctx, list);
    await ctx.render('a_setting', back);
});
//删除
router.post('/delete/:token/:id', async (ctx) => {
    let { id } = ctx.params;
    await A_SettingModel_1.a_SettingModel.delete(id);
    let list = await A_SettingModel_1.a_SettingModel.getList();
    let back = await s_game_1.default.allOut(ctx, list);
    await ctx.render('a_setting', back);
});
//添加
router.post('/add/:token', async (ctx) => {
    let { id } = ctx.params;
    let userinfo = await A_SettingModel_1.a_SettingModel.findOneById(id);
    let back = await s_game_1.default.allOut(ctx, userinfo);
    await ctx.render('a_setting_add', back);
});
//添加保存
router.post('/addSave/:token', async (ctx) => {
    let params = tool_1.tool.getParamsAdmin(ctx);
    delete params.token;
    await A_SettingModel_1.a_SettingModel.insert(params);
    let back = await s_game_1.default.allOut(ctx);
    back.data = await A_SettingModel_1.a_SettingModel.getList();
    await ctx.render('a_setting', back);
});
//编辑
router.post('/edit/:token/:id', async (ctx) => {
    let { id } = ctx.params;
    let userinfo = await A_SettingModel_1.a_SettingModel.findOneById(id);
    let back = await s_game_1.default.allOut(ctx, userinfo);
    await ctx.render('a_setting_edit', back);
});
//编辑 - 保存
router.post('/editSave/:token/:id', async (ctx) => {
    let { id } = ctx.params;
    let params = tool_1.tool.getParamsAdmin(ctx);
    delete params.token;
    await A_SettingModel_1.a_SettingModel.update(id, params);
    let back = await s_game_1.default.allOut(ctx);
    back.data = await A_SettingModel_1.a_SettingModel.getList();
    await ctx.render('a_setting', back);
});
//# sourceMappingURL=s_setting.js.map