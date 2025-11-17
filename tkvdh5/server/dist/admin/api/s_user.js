"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const router = new koa_router_1.default();
exports.router = router;
const A_UserModel_1 = require("../model/A_UserModel");
const s_game_1 = __importDefault(require("../tool/s_game"));
const tool_1 = require("../../src/util/tool");
router.prefix('/s_user');
//登陆页面
router.all('/:token', async (ctx) => {
    let list = await A_UserModel_1.a_UserModel.getList();
    let back = await s_game_1.default.allOut(ctx, list);
    await ctx.render('a_user', back);
});
//同意
router.post('/agree/:token/:id', async (ctx) => {
    let { id } = ctx.params;
    await A_UserModel_1.a_UserModel.update(id, {
        status: '已启用'
    });
    let list = await A_UserModel_1.a_UserModel.getList();
    let back = await s_game_1.default.allOut(ctx, list);
    await ctx.render('a_user', back);
});
//禁用
router.post('/disable/:token/:id', async (ctx) => {
    let { id } = ctx.params;
    let list = await A_UserModel_1.a_UserModel.getList();
    let back = await s_game_1.default.allOut(ctx, list, { "msg": "没有权限" });
    if (back.user.department != "管理员" || back.user.department == "后端") {
        await ctx.render('a_user', back, {});
        return;
    }
    await A_UserModel_1.a_UserModel.update(id, {
        status: '已禁用'
    });
    list = await A_UserModel_1.a_UserModel.getList();
    back = await s_game_1.default.allOut(ctx, list);
    await ctx.render('a_user', back);
});
//删除
router.post('/delete/:token/:id', async (ctx) => {
    let { id } = ctx.params;
    let list = await A_UserModel_1.a_UserModel.getList();
    let back = await s_game_1.default.allOut(ctx, list, { "msg": "没有权限" });
    if (back.user.department != "管理员" || back.user.department == "后端") {
        await ctx.render('a_user', back);
        return;
    }
    await A_UserModel_1.a_UserModel.delete(id);
    list = await A_UserModel_1.a_UserModel.getList();
    back = await s_game_1.default.allOut(ctx, list);
    await ctx.render('a_user', back, {});
});
//编辑
router.post('/edit/:token/:id', async (ctx) => {
    let { id } = ctx.params;
    let userinfo = await A_UserModel_1.a_UserModel.findOneById(id);
    let back = await s_game_1.default.allOut(ctx, userinfo);
    await ctx.render('a_user_edit', back);
});
//编辑 - 保存
router.post('/editSave/:token/:id', async (ctx) => {
    let { id } = ctx.params;
    let params = tool_1.tool.getParamsAdmin(ctx);
    let sdata = {
        name: params.name,
        wx: params.wx,
        mobile: params.mobile,
    };
    let back = await s_game_1.default.allOut(ctx);
    if (back.user.department == "管理员" || back.user.department == "后端") {
        sdata["department"] = params.department;
    }
    await A_UserModel_1.a_UserModel.update(id, sdata);
    back.data = await A_UserModel_1.a_UserModel.getList();
    await ctx.render('a_user', back);
});
//# sourceMappingURL=s_user.js.map