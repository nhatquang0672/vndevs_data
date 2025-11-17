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
const mongodb_1 = require("../../src/util/mongodb");
const game_1 = __importDefault(require("../../src/util/game"));
router.prefix('/s_jbly');
router.all('/:token', async (ctx) => {
    let { stime, etime } = tool_1.tool.getParamsAdmin(ctx);
    if (stime == null && etime == null) {
        let back = await s_game_1.default.allOut(ctx, []);
        await ctx.render('a_jbly', back);
        return;
    }
    let _stime = game_1.default.getTimeByStr(stime);
    let _etime = game_1.default.getTimeByStr(etime);
    let _stime0 = game_1.default.getToDay_0(_stime);
    let _etime1 = game_1.default.getToDay_0(_etime) + 86400;
    let outf = {};
    let backs = await mongodb_1.dbSev.getFlowDb().find("Smaidian_16");
    for (const back of backs) {
        let riqi = game_1.default.getTodayId(back.at);
        outf[riqi] = { "总来源": 0, "1600": 0, "1605": 0, "1610": 0, "1615": 0, "1620": 0, "1625": 0 };
        if (back.at >= _stime0 && back.at < _etime1) {
            outf[riqi][back.mdid] = back.cs[0];
        }
    }
    let back = await s_game_1.default.allOut(ctx, outf, []);
    await ctx.render('a_jbly', back);
});
//# sourceMappingURL=s_jbly.js.map