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
const mongodb_1 = require("../../src/util/mongodb");
const game_1 = __importDefault(require("../../src/util/game"));
const tool_1 = require("../../src/util/tool");
const setting_1 = __importDefault(require("../../src/crontab/setting"));
const cache_1 = __importDefault(require("../../src/util/cache"));
router.prefix('/s_czjl');
router.all('/:token', async (ctx) => {
    let { sid, plat } = tool_1.tool.getParamsAdmin(ctx);
    if (sid == null || plat == null) {
        let back = await s_game_1.default.allOut(ctx, {});
        await ctx.render('a_czjl', back);
        return;
    }
    await setting_1.default.createCash(game_1.default.getToDay_0(), game_1.default.getNowTime(), false);
    let kinds = {};
    // let kind10s:tableKind10[] = await dbSev.getDataDb().find("kind10",{"overAt":{$gte:1}})
    let tkind10s = await cache_1.default.getorderrall();
    let uuids = {};
    let bishus = {};
    for (const wwww in tkind10s) {
        let kind10 = tkind10s[wwww];
        if (kind10.overAt <= 0) {
            continue;
        }
        if (sid != '' && sid != kind10.sid) {
            continue;
        }
        if (plat != 'all' && plat != kind10.plat) {
            continue;
        }
        if (kind10.status == 0 || kind10.status == 4) {
            continue;
        }
        let todayId = game_1.default.getTodayId(kind10.overAt);
        if (kinds[todayId] == null) {
            kinds[todayId] = {
                sid: sid == '' ? "all" : sid,
                plat: plat,
                money: 0,
                count: 0,
                bishu: 0,
                all: 0
            };
            uuids[todayId] = {};
            bishus[todayId] = 0;
        }
        kinds[todayId].money += kind10.money;
        uuids[todayId][kind10.uuid] = 1;
        bishus[todayId] += 1;
    }
    let all = 0;
    if (sid == "" || sid == "all") {
        all = await mongodb_1.dbSev.getDataDb().findCount("user");
    }
    else {
        all = await mongodb_1.dbSev.getDataDb().findCount("user", { "data.sid": sid });
    }
    for (const _todayId in kinds) {
        kinds[_todayId].bishu = bishus[_todayId];
        kinds[_todayId].count = Object.keys(uuids[_todayId]).length;
        kinds[_todayId].all = all;
    }
    let back = await s_game_1.default.allOut(ctx, kinds, [sid]);
    await ctx.render('a_czjl', back);
});
//# sourceMappingURL=s_czjl.js.map