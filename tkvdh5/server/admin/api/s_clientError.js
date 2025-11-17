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
const mongodb_1 = require("../../src/util/mongodb");
router.prefix('/s_clientError');
//登陆页面
router.all('/:token', async (ctx) => {
    let { stime, etime } = tool_1.tool.getParamsAdmin(ctx);
    if (stime == null && etime == null) {
        let back = await s_game_1.default.allOut(ctx, []);
        await ctx.render('a_clientError', back);
        return;
    }
    let sql = {};
    if (stime != "" && etime == "") {
        let _stime = game_1.default.getTimeByStr(stime);
        sql["time"] = { $gt: _stime, $lt: game_1.default.getNowTime() };
    }
    if (stime != "" && etime != "") {
        let _stime = game_1.default.getTimeByStr(stime);
        let _etime = game_1.default.getTimeByStr(etime);
        sql["time"] = { $gt: _stime, $lt: _etime };
    }
    if (stime == "" && etime != "") {
        let _etime = game_1.default.getTimeByStr(etime);
        sql["time"] = { $gt: _etime - 86400, $lt: _etime };
    }
    let list = await mongodb_1.dbSev.getFlowDb().find("clientError", sql);
    let outf = [];
    for (const val of list) {
        val.time = game_1.default.getDayTime(val.time);
        outf.push(val);
    }
    let back = await s_game_1.default.allOut(ctx, outf, [stime, etime]);
    await ctx.render('a_clientError', back);
});
//# sourceMappingURL=s_clientError.js.map