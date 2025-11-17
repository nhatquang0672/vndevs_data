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
router.prefix('/s_ltv');
router.all('/:token', async (ctx) => {
    let { sid } = tool_1.tool.getParamsAdmin(ctx);
    if (sid == null || sid == "") {
        let back = await s_game_1.default.allOut(ctx, {});
        await ctx.render('a_ltv', back);
        return;
    }
    // ltv=累积到当天的充值金额/累计注册用户数
    // 比如3月1日的7日ltv=3月1日注册的用户在7天内的充值/3月1日的注册用户。
    let kind10s = await mongodb_1.dbSev.getDataDb().find("kind10");
    let kinds = {};
    for (const kind10 of kind10s) {
        if (kind10.overAt <= 0) {
            continue;
        }
        if (kind10.status == 4) {
            continue;
        }
        if (sid != kind10.sid) {
            continue;
        }
        if (kinds[kind10.uuid] == null) {
            kinds[kind10.uuid] = {};
        }
        if (kinds[kind10.uuid][game_1.default.getToDay_0(kind10.overAt)] == null) {
            kinds[kind10.uuid][game_1.default.getToDay_0(kind10.overAt)] = 0;
        }
        kinds[kind10.uuid][game_1.default.getToDay_0(kind10.overAt)] += kind10.money;
    }
    // let ltv:tableTongjiAct= await dbSev.getFlowDb().findOne("tongjiAct",{"key":"ltv_"+sid})
    let ltv = {
        key: "ltv_" + sid,
        ver: game_1.default.getTodayId(),
        json: {}
    };
    // if(ltv == null || ltv.ver != game.getTodayId()){
    let players = await mongodb_1.dbSev.getDataDb().find("user", { "data.sid": sid });
    ltv = {
        key: "ltv_" + sid,
        ver: game_1.default.getTodayId(),
        json: {}
    };
    //那一天注册的玩家列表
    let users = {};
    for (const player of players) {
        if (player.data.regtime == null || player.data.lastlogin == null) {
            continue;
        }
        let regtime = player.data.regtime;
        if (users[game_1.default.getToDay_0(regtime)] == null) {
            users[game_1.default.getToDay_0(regtime)] = [];
        }
        users[game_1.default.getToDay_0(regtime)].push(player.id);
    }
    for (const at_0 in users) {
        let regtId = game_1.default.getTodayId(parseInt(at_0));
        if (ltv.json[regtId] == null) {
            ltv.json[regtId] = {
                new: users[at_0].length,
                sid: sid,
                "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0,
                "11": 0, "12": 0, "13": 0, "14": 0, "15": 0, "16": 0, "17": 0,
            };
        }
        let cz = 0;
        for (let index = 1; index <= 17; index++) {
            let _at_0 = (parseInt(at_0) + (index - 1) * 86400).toString();
            if (parseInt(_at_0) > game_1.default.getNowTime()) {
                break;
            }
            for (const uuid of users[at_0]) {
                if (kinds[uuid] == null || kinds[uuid][_at_0] == null) {
                    continue;
                }
                cz += kinds[uuid][_at_0];
            }
            ltv.json[regtId][index.toString()] = (cz / ltv.json[regtId]['new']).toFixed(2);
        }
    }
    // await dbSev.getFlowDb().update("tongjiAct",{"key":"ltv_"+sid},ltv,true)
    // }
    let back = await s_game_1.default.allOut(ctx, ltv.json);
    await ctx.render('a_ltv', back);
});
//# sourceMappingURL=s_ltv.js.map