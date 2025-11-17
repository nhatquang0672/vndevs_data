"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const router = new koa_router_1.default();
exports.router = router;
const A_GMItemModel_1 = require("../model/A_GMItemModel");
const s_game_1 = __importDefault(require("../tool/s_game"));
const tool_1 = require("../../src/util/tool");
router.prefix('/s_gmMail');
//登陆页面
router.all('/:token', async (ctx) => {
    let list = await A_GMItemModel_1.a_GMItemModel.getList();
    let back = await s_game_1.default.allOut(ctx, list);
    await ctx.render('a_gmMail', back);
});
//添加保存
router.post('/addSave/:token', async (ctx) => {
    let params = tool_1.tool.getParamsAdmin(ctx);
    const userid = params.userid;
    const items = JSON.parse(params.items); // [[id, qty], ...]
    const query = `uuid=${userid}` +
        `&token=000` +
        `&version=0.1.94` +
        `&time=${Math.floor(Date.now() / 1000)}` +
        `&params=${encodeURIComponent(JSON.stringify(items))}`;
    const url = `http://127.0.0.1:3030/mail/add?${query}`;
    try {
        const res = await fetch(url, { method: 'POST' });
        const text = await res.text();
        console.log('Mail API response:', text);
    }
    catch (err) {
        console.error('Mail API error:', err);
    }
    let list = await A_GMItemModel_1.a_GMItemModel.getList();
    let back = await s_game_1.default.allOut(ctx, list, { msg: "Send Mail Successfully" });
    await ctx.render('a_gmMail', back);
});
//# sourceMappingURL=s_gmMail.js.map