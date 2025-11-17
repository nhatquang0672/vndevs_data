"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const router = new koa_router_1.default();
exports.router = router;
const A_MailModel_1 = require("../model/A_MailModel");
const s_game_1 = __importDefault(require("../tool/s_game"));
const tool_1 = require("../../src/util/tool");
const game_1 = __importDefault(require("../../src/util/game"));
router.prefix('/s_mail');
//登陆页面
router.all('/:token', async (ctx) => {
    let list = await A_MailModel_1.a_MailModel.getList();
    let back = await s_game_1.default.allOut(ctx, list);
    await ctx.render('a_mail', back);
});
//删除
router.post('/delete/:token/:id', async (ctx) => {
    let { id } = ctx.params;
    await A_MailModel_1.a_MailModel.delete(id);
    let list = await A_MailModel_1.a_MailModel.getList();
    let back = await s_game_1.default.allOut(ctx, list);
    await ctx.render('a_mail', back);
});
//添加
router.post('/add/:token', async (ctx) => {
    let back = await s_game_1.default.allOut(ctx);
    await ctx.render('a_mail_add', back);
});
//添加保存
router.post('/addSave/:token', async (ctx) => {
    let params = tool_1.tool.getParamsAdmin(ctx);
    if (tool_1.tool.isJSON(params.items) == false) {
        let back = await s_game_1.default.allOut(ctx, params, { msg: "道具格式错误" });
        await ctx.render('a_mail_add', back);
        return;
    }
    params.regtime = game_1.default.getTimeByStr(params.regtime);
    params.etime = game_1.default.getTimeByStr(params.etime);
    await A_MailModel_1.a_MailModel.insert(params);
    let back = await s_game_1.default.allOut(ctx);
    back.data = await A_MailModel_1.a_MailModel.getList();
    await ctx.render('a_mail', back);
});
//编辑
router.post('/edit/:token/:id', async (ctx) => {
    let { id } = ctx.params;
    let userinfo = await A_MailModel_1.a_MailModel.findOneById(id);
    let back = await s_game_1.default.allOut(ctx, userinfo);
    back.data.etime = game_1.default.getDayTime(back.data.etime);
    back.data.regtime = game_1.default.getDayTime(back.data.regtime);
    await ctx.render('a_mail_edit', back);
});
//编辑 - 保存
router.post('/editSave/:token/:id', async (ctx) => {
    let { id } = ctx.params;
    let params = tool_1.tool.getParamsAdmin(ctx);
    let geren = params.geren;
    geren = geren.replace('/r/n', '');
    let sdata = {
        title: params.title,
        content: params.content,
        geren: geren,
        qufu: params.qufu,
        regtime: game_1.default.getTimeByStr(params.regtime),
        items: typeof params.items != "string" ? JSON.stringify(params.items) : params.items,
        etime: game_1.default.getTimeByStr(params.etime),
    };
    await A_MailModel_1.a_MailModel.update(id, sdata);
    let back = await s_game_1.default.allOut(ctx);
    back.data = await A_MailModel_1.a_MailModel.getList();
    await ctx.render('a_mail', back);
});
//# sourceMappingURL=s_mail.js.map