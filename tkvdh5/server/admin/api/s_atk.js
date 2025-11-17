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
router.prefix('/s_atk');
router.all('/:token', async (ctx) => {
    let back = await s_game_1.default.allOut(ctx, []);
    await ctx.render('a_atk', back);
});
router.all('/find/:token', async (ctx) => {
    let { sid, rmbMin, rmbMax } = tool_1.tool.getParamsAdmin(ctx);
    let sql = {};
    if (sid != "" && sid != "all") {
        sql["heid"] = sid;
    }
    let _rmbMin = 0;
    if (rmbMin != "" && rmbMin != null) {
        _rmbMin = parseInt(rmbMin);
    }
    let _rmbMax = 999999999;
    if (rmbMax != "" && rmbMax != null) {
        _rmbMax = parseInt(rmbMax);
    }
    let atks = await mongodb_1.dbSev.getFlowDb().find("Smaidian_atk", sql);
    let outf = [];
    let pjAtk = {};
    for (const atk of atks) {
        if (atk.iscz < _rmbMin || atk.iscz > _rmbMax) {
            continue;
        }
        outf.push(atk);
        if (pjAtk[atk.level] == null) {
            pjAtk[atk.level] = [0, 0, 0];
        }
        pjAtk[atk.level][0] += atk.atk;
        pjAtk[atk.level][1] += 1;
        pjAtk[atk.level][2] += atk.def;
    }
    outf.sort(function (a, b) {
        return b.level - a.level;
    });
    let pjAtk1 = {};
    let pjdef1 = {};
    let keys = [];
    for (const lv in pjAtk) {
        pjAtk1[lv] = Math.floor(pjAtk[lv][0] / pjAtk[lv][1]);
        pjdef1[lv] = Math.floor(pjAtk[lv][2] / pjAtk[lv][1]);
        keys.push([parseInt(lv), pjAtk1[lv], pjdef1[lv]]);
    }
    keys.sort(function (a, b) {
        return b[0] - a[0];
    });
    let data = {
        outf: outf,
        pjAtk: pjAtk1,
        keys: keys
    };
    let back = await s_game_1.default.allOut(ctx, data, [sid, rmbMin, rmbMax]);
    await ctx.render('a_atk', back);
});
//# sourceMappingURL=s_atk.js.map