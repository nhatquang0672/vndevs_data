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
const game_1 = __importDefault(require("../../src/util/game"));
const tool_1 = require("../../src/util/tool");
const setting_1 = __importDefault(require("../../src/crontab/setting"));
const cache_1 = __importDefault(require("../../src/util/cache"));
router.prefix('/s_sjzl');
router.all('/:token', async (ctx) => {
    let { sid, days, isf, qidao } = tool_1.tool.getParamsAdmin(ctx);
    if (sid == null || sid == "") {
        let back = await s_game_1.default.allOut(ctx, {}, ["all", 10, 0]);
        await ctx.render('a_sjzl', back);
        return;
    }
    let tjkey = "sjzl_" + sid + "_" + qidao;
    if (qidao == "ALL") {
        tjkey = "sjzl_" + sid;
    }
    let sjzl = await mongodb_1.dbSev.getFlowDb().findOne("tongjiAct", { "key": tjkey });
    if (sjzl == null) {
        let verNum = 1681920000;
        if (sid != "all") {
            let qfInfo = setting_1.default.getQufus()[sid];
            if (qfInfo != null && qfInfo.openAt != null) {
                verNum = game_1.default.getToDay_0(qfInfo.openAt);
            }
        }
        sjzl = {
            key: tjkey,
            ver: verNum.toString(),
            json: {},
            lookAt: verNum
        };
    }
    if (sjzl.lookAt == null || sjzl.lookAt < 1698076800) {
        sjzl.lookAt = 1698076800;
    }
    let lookAt_0 = game_1.default.getToDay_0(sjzl.lookAt);
    let day_0 = game_1.default.getToDay_0();
    for (let index = lookAt_0; index <= day_0; index += 86400) {
        console.log('===删除日期==', game_1.default.getTodayId(index));
        delete sjzl.json[game_1.default.getTodayId(index)]; //删除今天的，重新生成
    }
    if (isf == 0 && sjzl.lookAt >= game_1.default.getToDay_0()) {
        days = days == null || days == "" ? 10 : parseInt(days);
        let keys = Object.keys(sjzl.json).sort();
        let backJson = {};
        for (let index = keys.length - days; index < keys.length; index++) {
            if (keys[index] == null) {
                continue;
            }
            backJson[keys[index]] = sjzl.json[keys[index]];
        }
        let back = await s_game_1.default.allOut(ctx, backJson, [sid, days, isf]);
        await ctx.render('a_sjzl', back);
        return;
    }
    sjzl.ver = lookAt_0.toString();
    sjzl.lookAt = game_1.default.getNowTime();
    let players = await cache_1.default.getplayerall();
    // console.log("===players===",Object.keys(players).length)
    let users = await cache_1.default.getuerall();
    // console.log("===users===",users.length)
    let tkind10s = await cache_1.default.getorderrall();
    // console.log("===tkind10s===",tkind10s.length)
    //0下单 1已到账未下发道具 2已下发道具 3已补单 4后台直冲 5补单异常
    let kind10s = {};
    for (const wwww in tkind10s) {
        let tkind10 = tkind10s[wwww];
        if (sid != "all" && tkind10.sid != sid) {
            continue;
        }
        if ([1, 2, 3].indexOf(tkind10.status) == -1) {
            continue;
        }
        if (qidao != "ALL") { //不是所有渠道
            if (players[tkind10.uid] == null) {
                continue;
            }
            if (players[tkind10.uid][0] != qidao) {
                continue;
            }
        }
        let todayId = game_1.default.getTodayId(tkind10.overAt);
        if (kind10s[todayId] == null) {
            kind10s[todayId] = {
                money: 0,
                count: 0,
                uuids: {}
            };
        }
        kind10s[todayId].money += tkind10.money;
        kind10s[todayId].count += 1;
        if (kind10s[todayId].uuids[tkind10.uuid] == null) {
            kind10s[todayId].uuids[tkind10.uuid] = 0;
        }
        kind10s[todayId].uuids[tkind10.uuid] += tkind10.money;
    }
    let stime = parseInt(sjzl.ver);
    let etime = game_1.default.getToDay_0();
    let addsjzl = {};
    let riqi = {}; //日期对应0点
    let fagnan1 = [];
    for (let index = stime; index <= etime; index += 86400) {
        let todayId = game_1.default.getTodayId(index);
        if (index < 1698076800) {
            fagnan1.push(todayId);
        }
        if (sjzl.json[todayId] != null) {
            continue;
        }
        riqi[todayId] = index;
        addsjzl[todayId] = {
            'c1': 0, 'c2': 0, 'c3': 0, 'c4': 0, 'c5': 0, 'c6': 0, 'c7': 0, 'c8': 0, 'c9': 0, 'c10': 0,
            'c11': 0, 'c12': 0, 'c13': 0, 'c14': 0, 'c15': 0, 'c16': 0, 'c17': 0, 'c18': 0, 'c19': 0, 'c20': 0
        };
    }
    //[tplayer.id,tplayer.data.sid,tplayer.data.uid,tplayer.data.lastlogin,tplayer.data.regtime]
    for (const kkkkk in users) {
        let user = users[kkkkk];
        if (sid != "all" && user[1] != sid) {
            continue;
        }
        if (qidao != "ALL") { //不是所有渠道
            if (players[user[2]] == null) {
                continue;
            }
            if (players[user[2]][0] != qidao) {
                continue;
            }
        }
        let rtodayId = game_1.default.getTodayId(user[4]);
        if (addsjzl[rtodayId] != null) {
            addsjzl[rtodayId].c1 += 1;
            addsjzl[rtodayId].c6 += 1;
            if (kind10s[rtodayId] != null && kind10s[rtodayId].uuids[user[0]] != null) {
                addsjzl[rtodayId].c13 += 1;
                addsjzl[rtodayId].c14 += kind10s[rtodayId].uuids[user[0]];
            }
            let uid = user[2]; //uid
            let psids = [];
            if (players[uid] == null) {
                // console.log('==uid===',uid)
            }
            else {
                psids = players[uid][1]; // user[6] // Object.keys(players[uid].data.list)
            }
            if (psids.length <= 1) {
                addsjzl[rtodayId].c5 += 1;
            }
            else {
                if (psids[0] != user[1]) {
                    addsjzl[rtodayId].c4 += 1;
                }
                else {
                    addsjzl[rtodayId].c5 += 1;
                }
            }
        }
        for (const _dayId in riqi) {
            if (fagnan1.indexOf(_dayId) != -1) {
                let rat0 = game_1.default.getToDay_0(user[4]);
                if (riqi[_dayId] < rat0) {
                    continue;
                }
                if (user[3] >= riqi[_dayId]) {
                    addsjzl[_dayId].c3 += 1;
                    addsjzl[_dayId].c7 += 1;
                }
            }
        }
    }
    for (const _id in addsjzl) {
        //检测方案2
        if (riqi[_id] != null && riqi[_id] >= 1698076800) {
            let sql = {};
            if (sid != "all") {
                sql["sid"] = sid;
            }
            sql["at"] = { $gte: riqi[_id], $lt: riqi[_id] + 86400 };
            let isrefresh = game_1.default.getTodayId() == _id ? true : false;
            let s99s = await cache_1.default.getmd99dall("md" + _id, sql, isrefresh);
            let _count = 0;
            for (const s99 of s99s) {
                if (qidao != "ALL") { //不是所有渠道
                    if (s99.uid == null) {
                        continue;
                    }
                    if (players[s99.uid] == null) {
                        continue;
                    }
                    if (players[s99.uid][0] != qidao) {
                        continue;
                    }
                    _count += 1;
                }
                else {
                    _count += 1;
                }
            }
            addsjzl[_id].c3 = _count;
            addsjzl[_id].c7 = _count;
        }
        if (kind10s[_id] != null) {
            addsjzl[_id].c9 = Object.keys(kind10s[_id].uuids).length;
            addsjzl[_id].c10 = kind10s[_id].money;
            if (addsjzl[_id].c9 > 0) {
                addsjzl[_id].c11 = (kind10s[_id].money / addsjzl[_id].c9).toFixed(2);
            }
            addsjzl[_id].c17 = addsjzl[_id].c9 - addsjzl[_id].c13;
            addsjzl[_id].c18 = kind10s[_id].money - addsjzl[_id].c14;
        }
        addsjzl[_id].c12 = addsjzl[_id].c3 == 0 ? 0 : (addsjzl[_id].c9 / addsjzl[_id].c3 * 100).toFixed(2) + "%";
        addsjzl[_id].c2 = addsjzl[_id].c3 - addsjzl[_id].c1;
        if (addsjzl[_id].c13 != 0) {
            addsjzl[_id].c15 = (addsjzl[_id].c14 / addsjzl[_id].c13).toFixed(2);
        }
        if (addsjzl[_id].c17 != 0) {
            addsjzl[_id].c19 = (addsjzl[_id].c18 / addsjzl[_id].c17).toFixed(2);
        }
        addsjzl[_id].c16 = addsjzl[_id].c1 == 0 ? 0 : (addsjzl[_id].c13 / addsjzl[_id].c1 * 100).toFixed(2) + "%";
        addsjzl[_id].c20 = addsjzl[_id].c2 == 0 ? 0 : (addsjzl[_id].c17 / addsjzl[_id].c2 * 100).toFixed(2) + "%";
        sjzl.json[_id] = addsjzl[_id];
    }
    sjzl.ver = game_1.default.getToDay_0().toString();
    await mongodb_1.dbSev.getFlowDb().update("tongjiAct", { "key": tjkey }, sjzl, true);
    days = days == null || days == "" ? 10 : parseInt(days);
    let keys = Object.keys(sjzl.json).sort();
    let backJson = {};
    for (let index = keys.length - days; index < keys.length; index++) {
        if (keys[index] == null) {
            continue;
        }
        backJson[keys[index]] = sjzl.json[keys[index]];
    }
    let back = await s_game_1.default.allOut(ctx, backJson, [sid, days, isf]);
    await ctx.render('a_sjzl', back);
});
//# sourceMappingURL=s_sjzl.js.map