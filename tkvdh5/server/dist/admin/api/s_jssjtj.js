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
router.prefix('/s_jssjtj');
router.all('/:token', async (ctx) => {
    let { time } = tool_1.tool.getParamsAdmin(ctx);
    if (time == null || time == "") {
        let back = await s_game_1.default.allOut(ctx, {});
        await ctx.render('a_jssjtj', back);
        return;
    }
    let _time = game_1.default.getTimeByStr(time);
    let dayid = game_1.default.getTodayId(_time);
    let jssjtjs = await mongodb_1.dbSev.getFlowDb().findOne("tongjiAct", { "key": "jssjtj_" + dayid });
    if (dayid != game_1.default.getTodayId()) {
        if (jssjtjs != null) {
            let back = await s_game_1.default.allOut(ctx, jssjtjs.json);
            await ctx.render('a_jssjtj', back);
        }
    }
    await setting_1.default.createCash(game_1.default.getToDay_0(), game_1.default.getNowTime(), false);
    let jssjtj = {};
    let users = await mongodb_1.dbSev.getDataDb().find("user");
    let _players = await mongodb_1.dbSev.getDataDb().find("player");
    let _kind10s = await mongodb_1.dbSev.getDataDb().find("kind10");
    let kind10s = {};
    // 0下单 1已到账未下发道具 2已下发道具 3已补单 4后台直冲 5补单异常
    for (const _kind10 of _kind10s) {
        if ([1, 2, 3].indexOf(_kind10.status) == -1) {
            continue;
        }
        if (dayid != game_1.default.getTodayId(_kind10.overAt)) {
            continue;
        }
        if (kind10s[_kind10.uuid] == null) {
            kind10s[_kind10.uuid] = 0;
        }
        kind10s[_kind10.uuid] += _kind10.money;
    }
    let players = {};
    for (const _player of _players) {
        if (_player.data.regtime == null) {
            continue;
        }
        players[_player.id] = _player.data.regtime;
    }
    for (const user of users) {
        if (jssjtj[dayid] == null) {
            jssjtj[dayid] = {};
        }
        let sid = user.data.sid;
        if (jssjtj[dayid][sid] == null) {
            jssjtj[dayid][sid] = { 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: "0", 9: "0", 10: game_1.default.getDayTime(setting_1.default.getQufus()[sid].openAt) };
        }
        let regtimeId = game_1.default.getTodayId(user.data.regtime);
        if (dayid == regtimeId) {
            jssjtj[dayid][sid]["2"] += 1;
        }
        if (players[user.data.uid] != null && regtimeId != game_1.default.getTodayId(players[user.data.uid])) {
            jssjtj[dayid][sid]["4"] += 1;
        }
        let today_0 = game_1.default.getToDay_0(_time);
        if (user.data.lastlogin >= today_0) {
            jssjtj[dayid][sid]["5"] += 1;
            if (kind10s[user.id] != null) {
                jssjtj[dayid][sid]["6"] += kind10s[user.id];
                jssjtj[dayid][sid]["7"] += 1;
                jssjtj[dayid][sid]["8"] = (jssjtj[dayid][sid]["7"] * 100 / jssjtj[dayid][sid]["5"]).toFixed(2) + '%';
                jssjtj[dayid][sid]["9"] = (jssjtj[dayid][sid]["6"] / jssjtj[dayid][sid]["7"]).toFixed(2);
            }
        }
    }
    if (_time < game_1.default.getToDay_0()) {
        await mongodb_1.dbSev.getFlowDb().update("tongjiAct", { "key": "jssjtj_" + dayid }, { "key": "jssjtj_" + dayid, "ver": 1, "json": jssjtj }, true);
    }
    let back = await s_game_1.default.allOut(ctx, jssjtj);
    await ctx.render('a_jssjtj', back);
});
//# sourceMappingURL=s_jssjtj.js.map