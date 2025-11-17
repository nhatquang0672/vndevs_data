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
const tool_1 = require("../../src/util/tool");
const game_1 = __importDefault(require("../../src/util/game"));
const mongodb_1 = require("../../src/util/mongodb");
router.prefix('/s_dengji');
router.all('/:token', async (ctx) => {
    let { sid, stime, etime } = tool_1.tool.getParamsAdmin(ctx);
    let outf = {};
    let cfgPool = gameCfg_1.default.userInfo.pool;
    for (const key in cfgPool) {
        let level = cfgPool[key].id;
        outf[level] = { '200': 0, '205': 0 };
    }
    let sql = {};
    if (sid != "" && sid != null) {
        sql["sid"] = sid;
    }
    if (stime != "" && stime != null) {
        let _stime = game_1.default.getTimeByStr(stime);
        if (sql["at"] == null) {
            sql["at"] = {};
        }
        sql["at"] = { $gt: _stime };
    }
    if (etime != "" && etime != null) {
        let _stime = game_1.default.getTimeByStr(stime);
        let _etime = game_1.default.getTimeByStr(etime);
        if (sql["at"] == null) {
            sql["at"] = {};
            sql["at"] = { $lt: _etime };
        }
        else {
            sql["at"] = { $gt: _stime, $lt: _etime };
        }
    }
    let backs = await mongodb_1.dbSev.getFlowDb().find("Smaidian_2", sql);
    let md200 = {};
    let md205 = {};
    for (const back of backs) {
        if (back.mdid == 205) {
            if (md205[back.uuid] == null) {
                md205[back.uuid] = back.cs[0];
            }
            else {
                md205[back.uuid] = Math.max(back.cs[0], md205[back.uuid]);
            }
        }
        if (back.mdid == 200) {
            if (md200[back.uuid] == null) {
                md200[back.uuid] = back.cs[0];
            }
            else {
                md200[back.uuid] = Math.max(back.cs[0], md200[back.uuid]);
            }
        }
    }
    for (const uuid in md200) {
        if (outf[md200[uuid]] != null) {
            outf[md200[uuid]]['200'] += 1;
        }
    }
    for (const uuid in md205) {
        if (outf[md205[uuid]] != null) {
            outf[md205[uuid]]['205'] += 1;
        }
    }
    let back = await s_game_1.default.allOut(ctx, outf, [sid, stime, etime]);
    await ctx.render('a_dengji', back);
});
//# sourceMappingURL=s_dengji.js.map