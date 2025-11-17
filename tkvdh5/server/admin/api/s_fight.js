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
const fight_1 = require("../../common/fight");
router.prefix('/s_fight');
//登陆页面
router.all('/:token', async (ctx) => {
    await ctx.render('a_fight', await s_game_1.default.allOut(ctx, []));
});
//查询
router.post('/find/:token', async (ctx) => {
    let { uuid, cxtime } = tool_1.tool.getParamsAdmin(ctx);
    let _cxtime = cxtime == '' ? game_1.default.getNowTime() : game_1.default.getTimeByStr(cxtime);
    let _stime = game_1.default.getToDay_0(_cxtime);
    let _etime = _stime + 86400;
    let outf = await mongodb_1.dbSev.getFlowDb().find("fight_start", { "uuid": uuid, "time": { $gt: _stime, $lt: _etime } });
    for (const val of outf) {
        val.time = game_1.default.getTimeS(val.time);
    }
    let back = await s_game_1.default.allOut(ctx, outf, [uuid, cxtime]);
    await ctx.render('a_fight', back);
});
router.post('/chongfang/:token', async (ctx) => {
    let { start } = JSON.parse(ctx.request.body);
    //战斗
    let fight = new fight_1.Fight(JSON.parse(start));
    let back = fight.get_outf();
    ctx.body = back;
    return;
});
//# sourceMappingURL=s_fight.js.map