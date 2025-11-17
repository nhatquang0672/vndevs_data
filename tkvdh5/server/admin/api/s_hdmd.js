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
router.prefix('/s_hdmd');
router.all('/:token', async (ctx) => {
    let { stime, etime } = tool_1.tool.getParamsAdmin(ctx);
    let outf = {};
    let back = await s_game_1.default.allOut(ctx, outf, [stime, etime]);
    await ctx.render('a_hdmd', back);
});
//# sourceMappingURL=s_hdmd.js.map