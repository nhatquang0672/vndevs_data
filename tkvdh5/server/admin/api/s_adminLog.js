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
router.prefix('/s_adminLog');
//登陆页面
router.all('/:token', async (ctx) => {
    let { account, stime, etime } = tool_1.tool.getParamsAdmin(ctx);
    if (account == null && stime == null && etime == null) {
        let back = await s_game_1.default.allOut(ctx, []);
        await ctx.render('a_adminLog', back);
        return;
    }
    let sql = {};
    if (account != "") {
        sql["account"] = account;
    }
    if (stime != "" && etime == "") {
        let _stime = game_1.default.getTimeByStr(stime);
        sql["doAt"] = { $gt: _stime, $lt: game_1.default.getNowTime() };
    }
    if (stime != "" && etime != "") {
        let _stime = game_1.default.getTimeByStr(stime);
        let _etime = game_1.default.getTimeByStr(etime);
        sql["doAt"] = { $gt: _stime, $lt: _etime };
    }
    if (stime == "" && etime != "") {
        let _etime = game_1.default.getTimeByStr(etime);
        sql["doAt"] = { $gt: _etime - 86400, $lt: _etime };
    }
    let list = await mongodb_1.dbSev.getFlowDb().find("a_adminLog", sql);
    let outf = [];
    for (const val of list) {
        val.openAt = game_1.default.getDayTime(val.doAt);
        outf.push(val);
    }
    let back = await s_game_1.default.allOut(ctx, outf, [account, stime, etime]);
    await ctx.render('a_adminLog', back);
});
//# sourceMappingURL=s_adminLog.js.map