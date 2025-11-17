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
const setting_1 = __importDefault(require("../../src/crontab/setting"));
const game_1 = __importDefault(require("../../src/util/game"));
router.prefix('/s_showHd');
//登陆页面
router.all('/:token', async (ctx) => {
    await ctx.render('a_showHd', await s_game_1.default.allOut(ctx, []));
});
//查询
router.post('/find/:token', async (ctx) => {
    let { qufu, cxtime } = tool_1.tool.getParamsAdmin(ctx);
    let _cxtime = cxtime == '' ? game_1.default.getNowTime() : game_1.default.getTimeByStr(cxtime);
    let _qufu = qufu == '' ? "1" : qufu;
    setting_1.default.ver = 0;
    let newTime = _cxtime;
    let new0 = game_1.default.getToDay_0(_cxtime);
    await setting_1.default.createCash(new0, newTime, false);
    let hds = setting_1.default.getHuodong(_qufu);
    for (const key in hds) {
        for (const hdcid in hds[key]) {
            hds[key][hdcid].info.sAt = game_1.default.getDayTime(hds[key][hdcid].info.sAt);
            hds[key][hdcid].info.eAt = game_1.default.getDayTime(hds[key][hdcid].info.eAt);
            hds[key][hdcid].info.dAt = game_1.default.getDayTime(hds[key][hdcid].info.dAt);
        }
    }
    let back = await s_game_1.default.allOut(ctx, hds);
    await ctx.render('a_showHd', back);
});
//# sourceMappingURL=s_showHd.js.map