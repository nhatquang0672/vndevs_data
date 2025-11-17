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
router.prefix('/s_keep');
router.all('/:token', async (ctx) => {
    let back = await s_game_1.default.allOut(ctx, []);
    await ctx.render('a_keep', back);
});
//查询
router.post('/find/:token', async (ctx) => {
    let { time } = tool_1.tool.getParamsAdmin(ctx);
    if (time == null || time == "") {
        let back = await s_game_1.default.allOut(ctx, [], [time]);
        await ctx.render('a_keep', back);
        return;
    }
    let _time = game_1.default.getTimeByStr(time);
    let stime = game_1.default.getToDay_0(_time);
    let plats = await mongodb_1.dbSev.getDataDb().find("loginPlatform", { "time": { $gte: stime, $lt: stime + 86400 } });
    let plat_uids = {};
    for (const plat of plats) {
        if (plat_uids[plat.plat] == null) {
            plat_uids[plat.plat] = [];
        }
        plat_uids[plat.plat].push(plat.uid);
    }
    //'注册', '次留', '3留', '5留', '7留', '15留', '30留','45留','60留'
    //次留
    let outf_2 = {};
    let outf_3 = {};
    let outf_5 = {};
    let outf_7 = {};
    let outf_15 = {};
    let outf_30 = {};
    let outf_45 = {};
    let outf_60 = {};
    let list = {};
    let echarts = [];
    for (const plat in plat_uids) {
        let keeps = [plat_uids[plat].length, 0, 0, 0, 0, 0, 0, 0, 0];
        for (const fuid of plat_uids[plat]) {
            if (outf_2[fuid] != null) {
                keeps[1] += 1;
            }
            if (outf_3[fuid] != null) {
                keeps[2] += 1;
            }
            if (outf_5[fuid] != null) {
                keeps[3] += 1;
            }
            if (outf_7[fuid] != null) {
                keeps[4] += 1;
            }
            if (outf_15[fuid] != null) {
                keeps[5] += 1;
            }
            if (outf_30[fuid] != null) {
                keeps[6] += 1;
            }
            if (outf_45[fuid] != null) {
                keeps[7] += 1;
            }
            if (outf_60[fuid] != null) {
                keeps[8] += 1;
            }
        }
        list[plat] = keeps;
        echarts.push(plat);
    }
    if (echarts.length == 0) {
        echarts = ["无"];
        list["无"] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    let back = await s_game_1.default.allOut(ctx, [], [time, echarts, list]);
    await ctx.render('a_keep', back);
});
//# sourceMappingURL=s_keep.js.map