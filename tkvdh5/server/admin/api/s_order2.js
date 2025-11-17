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
const game_1 = __importDefault(require("../../src/util/game"));
const mongodb_1 = require("../../src/util/mongodb");
router.prefix('/s_order2');
router.all('/:token', async (ctx) => {
    let backs = await mongodb_1.dbSev.getDataDb().find("kind10");
    let list = {};
    list["all"] = {};
    let echarts = ["all"];
    let minAt = game_1.default.getNowTime();
    for (const back of backs) {
        if (back.overAt <= 0) {
            continue;
        }
        if (back.status == 4) {
            continue;
        }
        let id = game_1.default.getMonthId(back.overAt);
        if (list[back.plat] == null) {
            list[back.plat] = {};
            echarts.push(back.plat);
        }
        if (list[back.plat][id] == null) {
            list[back.plat][id] = 0;
        }
        if (list["all"][id] == null) {
            list["all"][id] = 0;
        }
        list[back.plat][id] += back.money;
        list["all"][id] += back.money;
        minAt = Math.min(minAt, back.overAt);
    }
    for (let index = minAt; index < game_1.default.getToDay_0() + 86400 * 30; index += 86400 * 30) {
        let id = game_1.default.getMonthId(index);
        for (const plat in list) {
            if (list[plat][id] == null) {
                list[plat][id] = 0;
            }
        }
    }
    let back = await s_game_1.default.allOut(ctx, [], [echarts, list]);
    await ctx.render('a_order2', back);
});
//# sourceMappingURL=s_order2.js.map