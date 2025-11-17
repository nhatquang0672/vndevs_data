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
router.prefix('/s_chenghao');
router.all('/:token', async (ctx) => {
    let outf = {
        list: {} //档次对应信息
    };
    let cfgChPool = gameCfg_1.default.chenghaoInfo.pool;
    for (const key in cfgChPool) {
        outf.list[cfgChPool[key].id] = {
            name: cfgChPool[key].name,
            huode: 0,
            chuan: 0,
            task: {}
        };
        for (const taskid in cfgChPool[key].locks) {
            outf.list[cfgChPool[key].id].task[taskid] = [0, cfgChPool[key].locks[taskid]];
        }
    }
    let backs = await mongodb_1.dbSev.getDataDb().find("act", { "kid": "actChengH" });
    for (const back of backs) {
        if (outf.list[back.data.chuan] != null) {
            outf.list[back.data.chuan].chuan += 1;
        }
        for (const chid in back.data.list) {
            if (outf.list[chid] != null) {
                outf.list[chid].huode += 1;
                for (const taskid in outf.list[chid].task) {
                    outf.list[chid].task[taskid][0] += 1;
                }
            }
        }
        let nextid = (parseInt(back.data.getId) + 1).toString();
        if (outf.list[nextid] != null) {
            for (const taskid in outf.list[nextid].task) {
                if (back.data.hook[taskid] != null && back.data.hook[taskid] > outf.list[nextid].task[taskid][1]) {
                    outf.list[nextid].task[taskid][0] += 1;
                }
            }
        }
    }
    await ctx.render('a_chenghao', await s_game_1.default.allOut(ctx, outf));
});
//# sourceMappingURL=s_chenghao.js.map