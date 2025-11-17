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
const tool_1 = require("../../src/util/tool");
const game_1 = __importDefault(require("../../src/util/game"));
router.prefix('/s_fazhen');
router.all('/:token', async (ctx) => {
    let { stime, etime } = tool_1.tool.getParamsAdmin(ctx);
    let outf = { fzList: {}, userLv: {}, days: [] };
    let cfgPool = gameCfg_1.default.fazhenInfo.pool;
    let maxlv = {}; //法阵满级
    for (const key in cfgPool) {
        outf.fzList[cfgPool[key].id] = { name: cfgPool[key].name, "900": 0, "905": 0, "910": 0, "930": 0 };
        let cfgList = gameCfg_1.default.fazhenLevelList.getItemList(cfgPool[key].id);
        if (cfgList != null) {
            maxlv[cfgPool[key].id] = Object.keys(cfgList).length;
        }
        else {
            maxlv[cfgPool[key].id] = 0;
        }
    }
    let backs = await mongodb_1.dbSev.getDataDb().find("act", { "kid": "actFazhen" });
    for (const back of backs) {
        let hasfz = [];
        for (const gzId in back.data.list) {
            let fzid = back.data.list[gzId].fzid;
            if (outf.fzList[fzid] == null) {
                continue;
            }
            if (hasfz.indexOf(fzid) != -1) {
                continue;
            }
            hasfz.push(fzid);
            outf.fzList[fzid]["900"] += 1;
            if (back.data.list[gzId].saveId >= maxlv[fzid]) {
                outf.fzList[fzid]["905"] += 1;
            }
            if (back.data.list[back.data.useGzId] != null) {
                let usefz = back.data.list[back.data.useGzId].fzid;
                outf.fzList[usefz]["930"] += 1;
            }
        }
    }
    //初始化
    let cfgUserPool = gameCfg_1.default.userInfo.pool;
    for (const key in cfgUserPool) {
        outf.userLv[cfgUserPool[key].id] = {
            days: {},
            zsall: 0,
            jball: 0,
            gzall: 0,
            zsleft: 0,
            lzleft: 0,
        };
        if (stime != "" && stime != null && etime != "" && etime != null) {
            let _stime = game_1.default.getTimeByStr(stime);
            let _etime = game_1.default.getTimeByStr(etime);
            let passDay = game_1.default.passDayByTimes(_stime, _etime);
            //时间
            for (let index = 0; index < passDay; index++) {
                let todayId = game_1.default.getTodayId(_stime + index * 86400);
                if (outf.days.indexOf(todayId) == -1) {
                    outf.days.push(todayId);
                }
                outf.userLv[cfgUserPool[key].id].days[todayId] = {
                    zs: 0,
                    jb: 0,
                    free: 0,
                    gz: 0,
                };
            }
        }
    }
    let fuuids = [];
    let back2s = await mongodb_1.dbSev.getFlowDb().find("Smaidian_9");
    for (const back2 of back2s) {
        if (back2.mdid == "910") {
            outf.fzList[back2.cs[0]]["910"] += back2.cs[1];
        }
        let todayId = game_1.default.getTodayId(back2.at);
        if (back2.mdid == "915") {
            outf.userLv[back2.cs[1]].zsall += back2.cs[0];
            if (outf.userLv[back2.cs[1]].days[todayId] != null) {
                outf.userLv[back2.cs[1]].days[todayId].zs += back2.cs[0];
            }
        }
        if (back2.mdid == "920") {
            outf.userLv[back2.cs[1]].jball += back2.cs[0];
            if (outf.userLv[back2.cs[1]].days[todayId] != null) {
                outf.userLv[back2.cs[1]].days[todayId].jb += back2.cs[0];
            }
        }
        if (back2.mdid == "925") {
            if (fuuids.indexOf(back2.uuid) == -1) {
                fuuids.push(back2.uuid);
                if (outf.userLv[back2.cs[1]].days[todayId] != null) {
                    outf.userLv[back2.cs[1]].days[todayId].free += 1;
                }
            }
        }
        if (back2.mdid == "935") {
            outf.userLv[back2.cs[1]].gzall += back2.cs[0];
            if (outf.userLv[back2.cs[1]].days[todayId] != null) {
                outf.userLv[back2.cs[1]].days[todayId].gz += 1;
            }
        }
        if (back2.mdid == "940") {
            outf.userLv[back2.cs[1]].lzleft += back2.cs[0];
        }
        if (back2.mdid == "945") {
            outf.userLv[back2.cs[1]].zsleft += back2.cs[0];
        }
    }
    let back = await s_game_1.default.allOut(ctx, outf, [stime, etime]);
    await ctx.render('a_fazhen', back);
});
//# sourceMappingURL=s_fazhen.js.map