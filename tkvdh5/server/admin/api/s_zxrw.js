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
router.prefix('/s_zxrw');
router.all('/:token', async (ctx) => {
    let outf = {};
    let cfgPool = gameCfg_1.default.taskMain.pool;
    for (const key in cfgPool) {
        let name = "";
        let cfg = gameCfg_1.default.taskDesc.getItem(cfgPool[key].kind);
        if (cfg != null && cfg.name != null) {
            name = cfg.name.replace("{0}", cfgPool[key].need.toString());
        }
        outf[cfgPool[key].id] = {
            '400': 0,
            'desc': name
        };
    }
    let backs = await mongodb_1.dbSev.getFlowDb().find("Smaidian_4");
    for (const back of backs) {
        if (back.mdid == 400) {
            outf[back.cs[0].toString()]["400"] += 1;
        }
    }
    let back = await s_game_1.default.allOut(ctx, outf, []);
    await ctx.render('a_zxrw', back);
});
//# sourceMappingURL=s_zxrw.js.map