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
const child_process_1 = require("child_process");
router.prefix("/s_chongqi");
//登陆页面
router.all("/:token", async (ctx) => {
    let back = await s_game_1.default.allOut(ctx, []);
    await ctx.render("a_chongqi", back);
});
router.all("/chongqi/:token", async (ctx) => {
    //这边写重启脚本
    let bf = child_process_1.execSync("/data/www/byjb.sh ");
    let msg = bf.toString();
    let back = await s_game_1.default.allOut(ctx, [], { msg: msg });
    await ctx.render("a_chongqi", back);
});
//# sourceMappingURL=s_chongqi.js.map