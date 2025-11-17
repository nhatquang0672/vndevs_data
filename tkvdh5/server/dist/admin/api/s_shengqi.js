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
const game_1 = __importDefault(require("../../src/util/game"));
router.prefix('/s_shengqi');
router.all('/:token', async (ctx) => {
    let outf = { sqList: {}, days: {}, uLv: {} };
    let cfgPool = gameCfg_1.default.shengqiLevel.pool;
    let ids = {}; //圣器列表:满级
    for (const key in cfgPool) {
        let sqid = cfgPool[key].id;
        let sqLv = cfgPool[key].level;
        ids[sqid] = cfgPool[key].level;
        if (outf.sqList[sqid] == null) {
            outf.sqList[sqid] = {};
        }
        if (outf.sqList[sqid][sqLv] == null) {
            outf.sqList[sqid][sqLv] = {
                name: "",
                users: 0 //用户数量
            };
            let cfgSqInfo = gameCfg_1.default.shengqiInfo.getItem(sqid);
            if (cfgSqInfo != null) {
                outf.sqList[sqid][sqLv].name = cfgSqInfo.name;
            }
        }
    }
    //初始化
    let cfgUserPool = gameCfg_1.default.userInfo.pool;
    for (const key in cfgUserPool) {
        outf.uLv[cfgUserPool[key].id] = {
            sq: {},
            syys: 0,
            sysp: 0 //剩余碎片
        };
        for (const _sqid in ids) {
            outf.uLv[cfgUserPool[key].id].sq[_sqid] = {
                users: 0,
                max: 0,
            };
        }
    }
    let uids = {};
    let users = await mongodb_1.dbSev.getDataDb().find("user");
    for (const user of users) {
        uids[user.id] = user.data.level;
    }
    let actItems = await mongodb_1.dbSev.getDataDb().find("act", { "kid": "actItem" });
    for (const actItem of actItems) {
        uids[actItems.id] = actItem.data['56'] == null ? 0 : actItem.data['56'];
    }
    let backs = await mongodb_1.dbSev.getDataDb().find("act", { "kid": "actShengQi" });
    for (const back of backs) {
        let ulv = uids[back.id];
        outf.uLv[ulv].sysp += back.data.chip;
        for (const _sqid in back.data.list) {
            let _level = back.data.list[_sqid].level;
            outf.sqList[_sqid][_level].users += 1;
            let chuanId = back.data.chuan;
            if (chuanId == "") {
                continue;
            }
            if (outf.uLv[ulv] == null) {
                continue;
            }
            if (outf.uLv[ulv].sq[chuanId] == null) {
                continue;
            }
            outf.uLv[ulv].sq[chuanId].users += 1;
            let dcLv = back.data.list[chuanId].level;
            if (dcLv >= ids[chuanId]) {
                outf.uLv[ulv].sq[chuanId].max += 1;
            }
        }
    }
    let back2s = await mongodb_1.dbSev.getFlowDb().find("Smaidian_10");
    for (const back2 of back2s) {
        let todayId = game_1.default.getTodayId(back2.at);
        if (outf.days[todayId] == null) {
            outf.days[todayId] = {
                open: 0
            };
        }
        outf.days[todayId].open += 1;
    }
    let back = await s_game_1.default.allOut(ctx, outf, []);
    await ctx.render('a_shengqi', back);
});
//# sourceMappingURL=s_shengqi.js.map