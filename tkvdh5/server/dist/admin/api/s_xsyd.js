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
const gameCfg_1 = __importDefault(require("../../common/gameCfg"));
const gameMethod_1 = require("../../common/gameMethod");
router.prefix('/s_xsyd');
router.all('/:token', async (ctx) => {
    let outf = { list: {}, steps: {} };
    let pool = gameCfg_1.default.guideInfo.pool;
    let steps = {};
    for (const key in pool) {
        steps[pool[key].id] = 0;
    }
    let fdatas = await mongodb_1.dbSev.getDataDb().find("act", { "kid": "actGuide" });
    for (const fdata of fdatas) {
        if (fdata.data.heid == null) {
            continue;
        }
        let heid = fdata.data.heid;
        if (outf.list[heid] == null) {
            outf.list[heid] = gameMethod_1.gameMethod.objCopy(steps);
        }
        for (const id in fdata.data.list) {
            if (outf.list[heid][id] == null) {
                continue;
            }
            outf.list[heid][id] += 1;
        }
    }
    outf.steps = steps;
    let back = await s_game_1.default.allOut(ctx, outf, []);
    await ctx.render('a_xsyd', back);
});
//# sourceMappingURL=s_xsyd.js.map