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
router.prefix('/s_register');
router.all('/:token', async (ctx) => {
    let backs = await mongodb_1.dbSev.getDataDb().find("loginPlatform");
    let list = {};
    list["all"] = {};
    let echarts = ["all"];
    let minAt = game_1.default.getNowTime();
    for (const back of backs) {
        let id = game_1.default.getTodayId(back.time);
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
        list[back.plat][id] += 1;
        list["all"][id] += 1;
        minAt = Math.min(minAt, back.time);
    }
    for (let index = minAt; index < game_1.default.getToDay_0() + 86400; index += 86400) {
        let id = game_1.default.getTodayId(index);
        for (const plat in list) {
            if (list[plat][id] == null) {
                list[plat][id] = 0;
            }
        }
    }
    let back = await s_game_1.default.allOut(ctx, [], [echarts, list]);
    await ctx.render('a_register', back);
});
//# sourceMappingURL=s_register.js.map