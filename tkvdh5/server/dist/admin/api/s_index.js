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
const tool_1 = require("../../src/util/tool");
router.prefix('/s_index');
//登陆页面
router.all('/', async (ctx) => {
    await ctx.render('a_index');
});
//确认登陆
router.post('/login', async (ctx) => {
    let params = tool_1.tool.getParamsAdmin(ctx);
    let back = await A_UserModel_1.a_UserModel.findOneByAccount(params.username, params.password);
    console.log(JSON.stringify(back));
    if (back == null || back.status == "已申请") {
        await A_UserModel_1.a_UserModel.apply(ctx, params.username, params.password);
        await ctx.render('a_index', {
            msg: "已经申请，等待批准！"
        });
    }
    else {
        if (back.status != "已启用") {
            await ctx.render('a_index', {
                msg: back.status
            });
        }
        let token = await A_UserModel_1.a_UserModel.createToken(params.username, tool_1.tool.getClientIP(ctx));
        if (back.department == "前端") {
            await ctx.redirect('/s_qufu/' + token);
            return;
        }
        if (back.department == "策划") {
            await ctx.redirect('/s_qufu/' + token);
            return;
        }
        if (back.department == "第三方") {
            await ctx.redirect('/s_qufu/' + token);
            return;
        }
        if (back.department == "第三方策划") {
            await ctx.redirect('/s_qufu/' + token);
            return;
        }
        if (back.department == "第三方风控") {
            await ctx.redirect('/s_playerKsh/' + token);
            return;
        }
        if (back.department == "财务") {
            await ctx.redirect('/s_czjl/' + token);
            return;
        }
        if (back.department == "松鹤") {
            await ctx.redirect('/s_sjzl/' + token);
            return;
        }
        await ctx.redirect('/s_user/' + token);
    }
});
//# sourceMappingURL=s_index.js.map