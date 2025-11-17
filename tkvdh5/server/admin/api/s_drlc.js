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
router.prefix('/s_drlc');
router.all('/:token', async (ctx) => {
    let { sid } = tool_1.tool.getParamsAdmin(ctx);
    if (sid == null || sid == "") {
        let back = await s_game_1.default.allOut(ctx, {});
        await ctx.render('a_drlc', back);
        return;
    }
    // 5月2号 0点 1682956800
    // let drlc:tableTongjiAct= await dbSev.getFlowDb().findOne("tongjiAct",{"key":"drlc_"+sid})
    // if(drlc == null || drlc.ver != game.getTodayId()){
    let sql = {};
    if (sid != "all") {
        sql = { "data.sid": sid };
    }
    let players = await mongodb_1.dbSev.getDataDb().find("user", sql);
    let drlc = {
        key: "drlc_" + sid,
        ver: game_1.default.getTodayId(),
        json: {}
    };
    //当日登陆用户列表
    let md99s = await mongodb_1.dbSev.getFlowDb().find("Smaidian_99");
    let daysUuids = {}; //日期对应uuid
    for (const md99 of md99s) {
        if (md99.at < 1682956800) {
            continue;
        }
        let dayId = game_1.default.getTodayId(md99.at); //日期
        if (daysUuids[dayId] == null) {
            daysUuids[dayId] = {};
        }
        daysUuids[dayId][md99.uuid] = 1;
    }
    for (const player of players) {
        if (player.data.regtime == null || player.data.lastlogin == null) {
            continue;
        }
        let regtime = player.data.regtime; //注册时间
        let regtime_0 = game_1.default.getToDay_0(regtime); //注册时间0点
        let lastlogin = player.data.lastlogin; //登陆时间
        let lastlogin_0 = game_1.default.getToDay_0(lastlogin); //登陆时间0点
        if (lastlogin < regtime) {
            continue;
        }
        let regtId = game_1.default.getTodayId(regtime); //注册日期
        if (drlc.json[regtId] == null) {
            drlc.json[regtId] = {};
        }
        if (drlc.json[regtId]['new'] == null) {
            drlc.json[regtId]['new'] = 0;
            drlc.json[regtId]['sid'] = sid;
        }
        drlc.json[regtId]['new'] += 1;
        for (let index = regtime_0; index <= lastlogin_0; index += 86400) {
            let _dayId = game_1.default.getTodayId(index); //注册日期
            let _passId = game_1.default.passDayByTimes(regtime_0, index); //间隔天数
            if (drlc.json[regtId][_passId] == null) {
                drlc.json[regtId][_passId] = 0;
            }
            if (index < 1682956800) { //老版本
                drlc.json[regtId][_passId] += 1;
            }
            else { //新版本
                if (daysUuids[_dayId] != null && daysUuids[_dayId][player.id] != null) {
                    drlc.json[regtId][_passId] += 1;
                }
            }
        }
    }
    let huizong = {
        new: 0, sid: sid,
        "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0,
        "11": 0, "12": 0, "13": 0, "14": 0, "15": 0, "16": 0, "17": 0
    };
    for (const regtId in drlc.json) {
        huizong.new += drlc.json[regtId]["new"];
        for (const key1 in drlc.json[regtId]) {
            if (key1 == 'new' || key1 == 'sid') {
                continue;
            }
            if (huizong[key1] != null) {
                huizong[key1] += drlc.json[regtId][key1];
            }
            drlc.json[regtId][key1] = (drlc.json[regtId][key1] * 100 / drlc.json[regtId]['new']).toFixed(2) + '%';
        }
    }
    if (drlc.json["汇总"] == null) {
        drlc.json["汇总"] = {
            new: huizong["new"],
            sid: huizong["sid"],
            "1": huizong["new"] == 0 ? "" : (huizong["1"] * 100 / huizong["new"]).toFixed(2) + '%',
            "2": huizong["new"] == 0 ? "" : (huizong["2"] * 100 / huizong["new"]).toFixed(2) + '%',
            "3": huizong["new"] == 0 ? "" : (huizong["3"] * 100 / huizong["new"]).toFixed(2) + '%',
            "4": huizong["new"] == 0 ? "" : (huizong["4"] * 100 / huizong["new"]).toFixed(2) + '%',
            "5": huizong["new"] == 0 ? "" : (huizong["5"] * 100 / huizong["new"]).toFixed(2) + '%',
            "6": huizong["new"] == 0 ? "" : (huizong["6"] * 100 / huizong["new"]).toFixed(2) + '%',
            "7": huizong["new"] == 0 ? "" : (huizong["7"] * 100 / huizong["new"]).toFixed(2) + '%',
            "8": huizong["new"] == 0 ? "" : (huizong["8"] * 100 / huizong["new"]).toFixed(2) + '%',
            "9": huizong["new"] == 0 ? "" : (huizong["9"] * 100 / huizong["new"]).toFixed(2) + '%',
            "10": huizong["new"] == 0 ? "" : (huizong["10"] * 100 / huizong["new"]).toFixed(2) + '%',
            "11": huizong["new"] == 0 ? "" : (huizong["11"] * 100 / huizong["new"]).toFixed(2) + '%',
            "12": huizong["new"] == 0 ? "" : (huizong["12"] * 100 / huizong["new"]).toFixed(2) + '%',
            "13": huizong["new"] == 0 ? "" : (huizong["13"] * 100 / huizong["new"]).toFixed(2) + '%',
            "14": huizong["new"] == 0 ? "" : (huizong["14"] * 100 / huizong["new"]).toFixed(2) + '%',
            "15": huizong["new"] == 0 ? "" : (huizong["15"] * 100 / huizong["new"]).toFixed(2) + '%',
            "16": huizong["new"] == 0 ? "" : (huizong["16"] * 100 / huizong["new"]).toFixed(2) + '%',
            "17": huizong["new"] == 0 ? "" : (huizong["17"] * 100 / huizong["new"]).toFixed(2) + '%',
        };
    }
    // await dbSev.getFlowDb().update("tongjiAct",{"key":"drlc_"+sid},drlc,true)
    // }
    let back = await s_game_1.default.allOut(ctx, drlc.json, { "sid": sid });
    await ctx.render('a_drlc', back);
});
//# sourceMappingURL=s_drlc.js.map