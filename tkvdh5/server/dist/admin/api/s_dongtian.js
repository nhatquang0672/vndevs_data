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
const gameCfg_1 = __importDefault(require("../../common/gameCfg"));
const mongodb_1 = require("../../src/util/mongodb");
const game_1 = __importDefault(require("../../src/util/game"));
const tool_1 = require("../../src/util/tool");
router.prefix('/s_dongtian');
router.all('/:token', async (ctx) => {
    let { stime, etime } = tool_1.tool.getParamsAdmin(ctx);
    let _stime = game_1.default.getNowTime();
    if (stime != null && stime != "") {
        _stime = game_1.default.getTimeByStr(stime);
    }
    let _etime = game_1.default.getNowTime();
    if (etime != null && etime != "") {
        _etime = game_1.default.getTimeByStr(etime);
    }
    let _stime0 = game_1.default.getToDay_0(_stime);
    let _etime1 = game_1.default.getToDay_0(_etime) + 86400;
    let outf = { dtList: {}, days: {}, uLv: {}, dayids: [] };
    let cfgPool = gameCfg_1.default.dongtianLevel.pool;
    for (const key in cfgPool) {
        let sqLv = cfgPool[key].id;
        outf.dtList[sqLv] = {
            users: 0
        };
    }
    let backs = await mongodb_1.dbSev.getDataDb().find("act", { "kid": "actDongTian" });
    for (const back of backs) {
        let level = back.data.level;
        outf.dtList[level].users += 1;
    }
    outf.dayids = ["总消耗"];
    let back2s = await mongodb_1.dbSev.getFlowDb().find("Smaidian_11");
    for (const back2 of back2s) {
        let todayId = game_1.default.getTodayId(back2.at);
        if (outf.days[todayId] == null) {
            outf.days[todayId] = {
                "1105": 0,
                "1110_cash": 0,
                "1110_box": 0,
                "1110_dtlv": 0,
                "1110_fzlv": 0,
                "1110_baoshi": 0,
                "1110_jiasu": 0,
                "1110_secret": 0,
                "1115_cash": 0,
                "1115_box": 0,
                "1115_dtlv": 0,
                "1115_fzlv": 0,
                "1115_baoshi": 0,
                "1115_jiasu": 0,
                "1115_secret": 0,
                "1120_cash": 0,
                "1120_box": 0,
                "1120_dtlv": 0,
                "1120_fzlv": 0,
                "1120_baoshi": 0,
                "1120_jiasu": 0,
                "1120_secret": 0,
            };
        }
        if (back2.mdid == 1105) {
            outf.days[todayId]["1105"] += 1;
        }
        if (back2.mdid == 1110 || back2.mdid == 1115 || back2.mdid == 1120) {
            outf.days[todayId][back2.mdid + "_" + back2.cs[0]] += 1;
        }
        if (back2.mdid == 1125) {
            if (outf.uLv[back2.cs[0]] == null) {
                outf.uLv[back2.cs[0]] = {};
            }
            if (outf.uLv[back2.cs[0]]["总消耗"] == null) {
                outf.uLv[back2.cs[0]]["总消耗"] = 0;
            }
            outf.uLv[back2.cs[0]]["总消耗"] += back2.cs[1];
            if (back2.at < _stime0 || back2.at >= _etime1) {
                continue;
            }
            if (outf.uLv[back2.cs[0]][todayId] == null) {
                outf.uLv[back2.cs[0]][todayId] = 0;
            }
            outf.uLv[back2.cs[0]][todayId] = back2.cs[1];
            if (outf.dayids.indexOf(todayId) == -1) {
                outf.dayids.push(todayId);
            }
        }
    }
    let back = await s_game_1.default.allOut(ctx, outf, [stime, etime]);
    await ctx.render('a_dongtian', back);
});
//# sourceMappingURL=s_dongtian.js.map