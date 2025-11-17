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
const tool_1 = require("../../src/util/tool");
const game_1 = __importDefault(require("../../src/util/game"));
const gameCfg_1 = __importDefault(require("../../common/gameCfg"));
router.prefix('/s_qdmd');
router.all('/:token', async (ctx) => {
    let { pid, stime, etime } = tool_1.tool.getParamsAdmin(ctx);
    let pack = [];
    let pool = gameCfg_1.default.packageInfo.pool;
    let name = "所有包";
    for (const key in pool) {
        if (pid == pool[key].id) {
            name = pid + pool[key].name;
        }
        pack.push([pool[key].id, pool[key].id + pool[key].name]);
    }
    let outf = {};
    let opens = {};
    let maidians = await mongodb_1.dbSev.getFlowDb().find('Cmaidian');
    for (const maidian of maidians) {
        if (pid != 0 && pid != maidian.pid) {
            continue;
        }
        if (opens[maidian.openid] == null) {
            opens[maidian.openid] = {
                step: [],
                uuid: "",
                at: maidian.at
            };
        }
        if (opens[maidian.openid].step.indexOf(maidian.step) == -1) {
            opens[maidian.openid].step.push(maidian.step);
        }
        if (maidian.uuid != null && maidian.uuid != "") {
            opens[maidian.openid].uuid = maidian.uuid;
        }
    }
    for (const openid in opens) {
        let todayId = game_1.default.getTodayId(opens[openid].at);
        if (outf[todayId] == null) {
            outf[todayId] = {
                "name": name, "10000": 0, "10005": 0, "10010": 0, "10015": 0, "10020": 0, "10025": 0, "10030": 0, "10035": 0, "10040": 0, "10045": 0,
            };
        }
        for (const stepid of opens[openid].step) {
            outf[todayId][stepid] += 1;
        }
    }
    for (const todayId in outf) {
        outf[todayId]['10005'] = (outf[todayId]['10005'] * 100 / outf[todayId]['10000']).toFixed(2);
        outf[todayId]['10010'] = (outf[todayId]['10010'] * 100 / outf[todayId]['10000']).toFixed(2);
        outf[todayId]['10015'] = (outf[todayId]['10015'] * 100 / outf[todayId]['10000']).toFixed(2);
        outf[todayId]['10020'] = (outf[todayId]['10020'] * 100 / outf[todayId]['10000']).toFixed(2);
        outf[todayId]['10025'] = (outf[todayId]['10025'] * 100 / outf[todayId]['10000']).toFixed(2);
        outf[todayId]['10030'] = (outf[todayId]['10030'] * 100 / outf[todayId]['10000']).toFixed(2);
        outf[todayId]['10035'] = (outf[todayId]['10035'] * 100 / outf[todayId]['10000']).toFixed(2);
        outf[todayId]['10040'] = (outf[todayId]['10040'] * 100 / outf[todayId]['10000']).toFixed(2);
        outf[todayId]['10045'] = (outf[todayId]['10045'] * 100 / outf[todayId]['10000']).toFixed(2);
    }
    let back = await s_game_1.default.allOut(ctx, outf, [pack, stime, etime]);
    await ctx.render('a_qdmd', back);
});
//# sourceMappingURL=s_qdmd.js.map