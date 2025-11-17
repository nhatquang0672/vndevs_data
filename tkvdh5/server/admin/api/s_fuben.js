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
const game_1 = __importDefault(require("../../src/util/game"));
router.prefix('/s_fuben');
router.all('/:token', async (ctx) => {
    let outf1 = {};
    let pvePool = gameCfg_1.default.pveInfo.pool;
    for (const key in pvePool) {
        outf1[pvePool[key].id] = { "300": 0, "310": 0 };
    }
    let outfD = {};
    let backs = await mongodb_1.dbSev.getFlowDb().find("Smaidian_3");
    let md300 = {};
    let md310 = {};
    for (const back of backs) {
        if (back.mdid == 300) {
            if (md300[back.uuid] == null) {
                md300[back.uuid] = back.cs[0];
            }
            else {
                md300[back.uuid] = Math.max(back.cs[0], md300[back.uuid]);
            }
        }
        if (back.mdid == 310) {
            if (md310[back.uuid] == null) {
                md310[back.uuid] = back.cs[0];
            }
            else {
                md310[back.uuid] = Math.max(back.cs[0], md310[back.uuid]);
            }
        }
        let todayId = game_1.default.getTodayId(back.at);
        if (outfD[todayId] == null) {
            outfD[todayId] = { '305': [], '315': [], '320': 0, '325': [], '330': [] };
        }
        if (back.mdid == 305) {
            if (outfD[todayId]['305'].indexOf(back.uuid) == -1) {
                outfD[todayId]['305'].push(back.uuid);
            }
        }
        if (back.mdid == 315) {
            if (outfD[todayId]['315'].indexOf(back.uuid) == -1) {
                outfD[todayId]['315'].push(back.uuid);
            }
        }
        if (back.mdid == 320) {
            outfD[todayId]['320'] += back.cs[0];
            if (outfD[todayId]['325'].indexOf(back.uuid) == -1) {
                outfD[todayId]['325'].push(back.uuid);
            }
            if (back.cs[0] == 0) {
                if (outfD[todayId]['330'].indexOf(back.uuid) == -1) {
                    outfD[todayId]['330'].push(back.uuid);
                }
            }
        }
    }
    for (const uuid in md300) {
        outf1[md300[uuid]]['300'] += 1;
    }
    for (const uuid in md310) {
        outf1[md310[uuid]]['310'] += 1;
    }
    let keys1 = Object.keys(outf1);
    let keysd = Object.keys(outfD);
    let max = Math.max(keysd.length, keys1.length);
    let outf = [];
    for (let index = 0; index < max; index++) {
        let outone = ["", "", "", "", "", "", "", "", ""];
        if (keys1[index] != null) {
            outone[0] = keys1[index];
            outone[1] = outf1[keys1[index]][300].toString();
            outone[2] = outf1[keys1[index]][310].toString();
        }
        if (keysd[index] != null) {
            outone[3] = keysd[index];
            outone[4] = outfD[keysd[index]][305].length.toString();
            outone[5] = outfD[keysd[index]][315].length.toString();
            outone[6] = outfD[keysd[index]][320].toString();
            outone[7] = outfD[keysd[index]][325].length.toString();
            outone[8] = outfD[keysd[index]][330].length.toString();
        }
        outf.push(outone);
    }
    let back = await s_game_1.default.allOut(ctx, outf);
    await ctx.render('a_fuben', back);
});
//# sourceMappingURL=s_fuben.js.map