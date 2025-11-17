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
const gameCfg_1 = __importDefault(require("../../common/gameCfg"));
const mongodb_1 = require("../../src/util/mongodb");
router.prefix('/s_shangdian');
router.all('/:token', async (ctx) => {
    let { stime, etime } = tool_1.tool.getParamsAdmin(ctx);
    if (stime == null || stime == "" || etime == null || etime == "") {
        await ctx.render('a_shangdian', await s_game_1.default.allOut(ctx, {}, [stime, etime]));
    }
    let outf = {
        days: [],
        shopdc: {},
        list: {} //档次对应信息
    };
    let _stime = game_1.default.getTimeByStr(stime);
    let _etime = game_1.default.getTimeByStr(etime);
    let passDay = game_1.default.passDayByTimes(_stime, _etime);
    //时间
    for (let index = 0; index < passDay; index++) {
        let todayId = game_1.default.getTodayId(_stime + index * 86400);
        outf.days.push(todayId);
    }
    //档次
    let cfgItemPool = gameCfg_1.default.shopItem.pool;
    for (const key in cfgItemPool) {
        outf.shopdc["item_" + cfgItemPool[key].id] = "道具商店" + cfgItemPool[key].id;
    }
    let cfgCoinPool = gameCfg_1.default.shopCoin.pool;
    for (const key in cfgCoinPool) {
        outf.shopdc["coin_" + cfgCoinPool[key].id] = "铜钱商店" + cfgCoinPool[key].id;
    }
    let cfgDiamondPool = gameCfg_1.default.shopDiamond.pool;
    for (const key in cfgDiamondPool) {
        outf.shopdc["diamond_" + cfgDiamondPool[key].id] = "灵石商店" + cfgDiamondPool[key].id;
    }
    let cfgClubPool = gameCfg_1.default.shopClub.pool;
    for (const key in cfgClubPool) {
        outf.shopdc["club_" + cfgClubPool[key].id] = "公会商店" + cfgClubPool[key].id;
    }
    let cfgPvwPool = gameCfg_1.default.shopPvw.pool;
    for (const key in cfgPvwPool) {
        outf.shopdc["pvw_" + cfgPvwPool[key].id] = "试炼商店" + cfgPvwPool[key].id;
    }
    for (const key in outf.shopdc) {
        outf.list[key] = {};
        for (const dayId of outf.days) {
            outf.list[key][dayId] = 0;
        }
    }
    let backs = await mongodb_1.dbSev.getFlowDb().find("Smaidian_5");
    for (const back of backs) {
        let _todayid = game_1.default.getTodayId(back.at);
        if (outf.days.indexOf(_todayid) == -1) {
            continue;
        }
        switch (back.cs[0]) {
            case 'actShopItem':
                if (outf.list["item_" + back.cs[1]] == null) {
                    break;
                }
                outf.list["item_" + back.cs[1]][_todayid] += 1;
                break;
            case 'actShopCoin':
                if (outf.list["coin_" + back.cs[1]] == null) {
                    break;
                }
                outf.list["coin_" + back.cs[1]][_todayid] += 1;
                break;
            case 'actShopDiaMond':
                if (outf.list["diamond_" + back.cs[1]] == null) {
                    break;
                }
                outf.list["diamond_" + back.cs[1]][_todayid] += 1;
                break;
            case 'actShopClub':
                if (outf.list["club_" + back.cs[1]] == null) {
                    break;
                }
                outf.list["club_" + back.cs[1]][_todayid] += 1;
                break;
            case 'actShopPvw':
                if (outf.list["pvw_" + back.cs[1]] == null) {
                    break;
                }
                outf.list["pvw_" + back.cs[1]][_todayid] += 1;
                break;
        }
    }
    await ctx.render('a_shangdian', await s_game_1.default.allOut(ctx, outf, [stime, etime]));
});
//# sourceMappingURL=s_shangdian.js.map