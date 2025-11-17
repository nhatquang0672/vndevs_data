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
router.prefix('/s_czlc');
router.all('/:token', async (ctx) => {
    let { sid } = tool_1.tool.getParamsAdmin(ctx);
    if (sid == null || sid == "") {
        let back = await s_game_1.default.allOut(ctx, {});
        await ctx.render('a_czlc', back);
        return;
    }
    let czlc = {
        key: "czlc_" + sid,
        ver: game_1.default.getTodayId(),
        json: {}
    };
    //充值玩家
    let kind10s = await mongodb_1.dbSev.getDataDb().find("kind10");
    let kinds = {};
    for (const kind10 of kind10s) {
        if (kind10.overAt <= 0 || kind10.status == 4) {
            continue;
        }
        if (kinds[kind10.uuid] == null) {
            kinds[kind10.uuid] = {};
        }
        let dayId = game_1.default.getTodayId(kind10.overAt); //日期
        kinds[kind10.uuid][dayId] = 1;
    }
    let czJson = {};
    let sql = {};
    if (sid != "all") {
        sql = { "data.sid": sid };
    }
    let riqis = {};
    let reguuids = {};
    let players = await mongodb_1.dbSev.getDataDb().find("user", sql);
    let czUuids = {};
    let daysUuids = {}; //日期对应uuid
    for (const player of players) {
        if (player.data.regtime == null || player.data.lastlogin == null) {
            continue;
        }
        let regtime = player.data.regtime; //注册时间
        if (regtime < 1681920000 || regtime >= 1682956800) {
            continue;
        }
        let regtime_0 = game_1.default.getToDay_0(regtime); //注册时间0点
        let lastlogin = player.data.lastlogin; //登陆时间
        let lastlogin_0 = game_1.default.getToDay_0(lastlogin); //登陆时间0点
        if (lastlogin < regtime) {
            continue;
        }
        let lastAt = Math.min(lastlogin_0, 1682956800);
        for (let index = regtime_0; index < lastAt; index += 86400) {
            if (kinds[player.id] == null) {
                continue; //不是充值玩家
            }
            let dayId = game_1.default.getTodayId(index); //日期
            if (czUuids[player.id] == null) {
                for (const _dayId in kinds[player.id]) {
                    if (parseInt(_dayId) <= parseInt(dayId)) {
                        czUuids[player.id] = 1;
                    }
                }
            }
            if (czUuids[player.id] == 1) {
                if (daysUuids[dayId] == null) {
                    daysUuids[dayId] = {};
                }
                daysUuids[dayId][player.id] = 1;
            }
        }
    }
    //当日登陆用户列表
    let md99s = await mongodb_1.dbSev.getFlowDb().find("Smaidian_99");
    for (const md99 of md99s) {
        if (md99.at < 1682956800) {
            continue;
        }
        if (kinds[md99.uuid] == null) {
            continue; //不是充值玩家
        }
        let dayId = game_1.default.getTodayId(md99.at); //日期
        if (czUuids[md99.uuid] == null) {
            for (const _dayId in kinds[md99.uuid]) {
                if (parseInt(_dayId) <= parseInt(dayId)) {
                    czUuids[md99.uuid] = 1;
                }
            }
        }
        if (czUuids[md99.uuid]) {
            if (daysUuids[dayId] == null) {
                daysUuids[dayId] = {};
            }
            daysUuids[dayId][md99.uuid] = 1;
        }
    }
    for (const player of players) {
        if (player.data.regtime == null || player.data.lastlogin == null) {
            continue;
        }
        let regtime = player.data.regtime; //注册时间
        if (regtime < 1681920000) {
            continue; //2023-04-20 00:00:00
        }
        let regtime_0 = game_1.default.getToDay_0(regtime); //注册时间0点
        let lastlogin = player.data.lastlogin; //登陆时间
        let lastlogin_0 = game_1.default.getToDay_0(lastlogin); //登陆时间0点
        if (lastlogin < regtime) {
            continue;
        }
        let regtId = game_1.default.getTodayId(regtime); //注册日期
        if (czJson[regtId] == null) {
            czJson[regtId] = {};
            riqis[regtId] = {};
            let dayids = [];
            for (let index = 1; index <= 17; index++) {
                dayids.push(game_1.default.getTodayId(regtime + (index - 1) * 86400));
                riqis[regtId][index.toString()] = dayids;
            }
            reguuids[regtId] = {};
        }
        if (czJson[regtId]['new'] == null) {
            czJson[regtId]['new'] = 0;
            czJson[regtId]['fflogin'] = 0;
            czJson[regtId]['sid'] = sid;
        }
        czJson[regtId]['new'] += 1; //注册人数
        if (kinds[player.id] == null) {
            continue; //不是充值玩家
        }
        let isChongzhi = false;
        //每一天登陆记录人数
        for (let index = regtime_0; index <= lastlogin_0; index += 86400) {
            let _dayId = game_1.default.getTodayId(index); //注册日期
            let _passId = game_1.default.passDayByTimes(regtime_0, index); //间隔天数
            if (_passId > 17) {
                continue;
            }
            if (isChongzhi == false) {
                if (daysUuids[_dayId] != null && daysUuids[_dayId][player.id] != null) {
                    isChongzhi = true;
                    czJson[regtId]["fflogin"] += 1;
                    if (reguuids[regtId][_passId] == null) {
                        reguuids[regtId][_passId] = 0;
                    }
                    reguuids[regtId][_passId] += 1;
                }
            }
            if (isChongzhi == false) {
                continue; //没有充值不累加
            }
            if (czJson[regtId][_passId] == null) {
                czJson[regtId][_passId] = 0;
            }
            if (daysUuids[_dayId] != null && daysUuids[_dayId][player.id] != null) {
                czJson[regtId][_passId] += 1;
            }
        }
    }
    // console.log('=======czJson=====',czJson)
    for (const regtId in czJson) {
        if (czlc.json[regtId] == null) {
            czlc.json[regtId] = {
                new: czJson[regtId]["new"],
                sid: czJson[regtId]["sid"],
                fflogin: czJson[regtId]["fflogin"],
            };
        }
        for (const key in czJson[regtId]) {
            if (key == "new" || key == "sid" || key == "fflogin") {
                continue;
            }
            //第n天登陆人数  czJson[regtId][key]
            //1 - n 的付费人数
            // 这些日期里面的充值账号 riqis[regtId][key] 
            //[kind10.uuid][dayId] = 1
            let keyCount = 0;
            if (reguuids[regtId] != null) {
                for (const _key in reguuids[regtId]) {
                    if (parseInt(_key) <= parseInt(key)) {
                        keyCount += reguuids[regtId][_key];
                    }
                }
            }
            czlc.json[regtId][key] = keyCount == 0 ? 0 : (czJson[regtId][key] * 100 / keyCount).toFixed(2) + '%';
        }
    }
    let back = await s_game_1.default.allOut(ctx, czlc.json, { "sid": sid });
    await ctx.render('a_czlc', back);
});
//# sourceMappingURL=s_czlc.js.map