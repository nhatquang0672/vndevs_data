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
const gameMethod_1 = require("../../common/gameMethod");
const tool_1 = require("../../src/util/tool");
const master_1 = require("../../src/util/master");
const game_1 = __importDefault(require("../../src/util/game"));
const lock_1 = __importDefault(require("../../src/util/lock"));
const SevLonggongModel_1 = require("../../src/model/sev/SevLonggongModel");
const RdsUserModel_1 = require("../../src/model/redis/RdsUserModel");
const gameCfg_1 = __importDefault(require("../../common/gameCfg"));
const cache_1 = __importDefault(require("../../src/util/cache"));
const ActJjcInfoModel_1 = require("../../src/model/act/ActJjcInfoModel");
const YlWechat_1 = __importDefault(require("../../src/sdk/YlWechat"));
const ts_md5_1 = require("ts-md5");
router.prefix('/s_hefu');
//登陆页面
router.all('/:token', async (ctx) => {
    await ctx.render('a_hefu', await s_game_1.default.allOut(ctx, []));
});
//合服操作
router.all('/weihu/:token', async (ctx) => {
    let { type, minsid, maxsid } = JSON.parse(ctx.request.body);
    if (type == 1) { //[开启维护] 
        let dbqufus = await mongodb_1.dbSev.getDataDb().find("a_qufu");
        for (const dbqufu of dbqufus) {
            if (parseInt(dbqufu.sid) < minsid) {
                continue;
            }
            if (parseInt(dbqufu.sid) > maxsid) {
                continue;
            }
            await mongodb_1.dbSev.getDataDb().update("a_qufu", { "sid": dbqufu.sid }, { "status": "4" });
            console.log(`${dbqufu.sid}开启维护`);
        }
        await mongodb_1.dbSev.getDataDb().getNextId('A_VER');
        ctx.body = `${minsid}-${maxsid}开启维护成功`;
        return;
    }
    if (type == 0) { //[关闭维护] 
        let dbqufus = await mongodb_1.dbSev.getDataDb().find("a_qufu");
        for (const dbqufu of dbqufus) {
            if (parseInt(dbqufu.sid) < minsid) {
                continue;
            }
            if (parseInt(dbqufu.sid) > maxsid) {
                continue;
            }
            await mongodb_1.dbSev.getDataDb().update("a_qufu", { "sid": dbqufu.sid }, { "status": "3" });
            console.log(`${dbqufu.sid}关闭维护`);
        }
        await mongodb_1.dbSev.getDataDb().getNextId('A_VER');
        ctx.body = `${minsid}-${maxsid}关闭维护成功`;
        return;
    }
    ctx.body = `步骤${type}错误`;
});
//合服操作
router.all('/dohefu/:token', async (ctx) => {
    let { type, hsids } = JSON.parse(ctx.request.body);
    if (typeof hsids == "string") {
        hsids = JSON.parse(hsids);
    }
    console.log('====hsids====', JSON.stringify(hsids), type);
    let dbqufus = await mongodb_1.dbSev.getDataDb().find("a_qufu");
    let hefuids = {};
    for (const dbqu of dbqufus) {
        hefuids[dbqu.sid] = dbqu.heid;
    }
    if (type == 1) {
        //试炼奖励
        let ctxSysrds = await tool_1.tool.ctxCreate('redis', "10010");
        for (const zisid of hsids) {
            if (hefuids[zisid] != zisid) {
                continue; //不是主服
            }
            let pvwRdsUserModel = RdsUserModel_1.RdsUserModel.getInstance(ctxSysrds, "rdsPvw", zisid, 'x', game_1.default.getWeekId());
            console.log('==试炼奖励 key==', pvwRdsUserModel.getKey());
            let pvwAll = await pvwRdsUserModel.getRankBetween(1, 0);
            let crid = 1;
            for (let i = 0; i < pvwAll.length; i += 2) {
                let cmember = pvwAll[i].toString();
                if (cache_1.default.addHfuuid("rdsPvw", cmember) == false) {
                    console.log('==试练关卡奖励已发过==', cmember, crid);
                    continue;
                }
                //获取排行奖励
                for (const _id in gameCfg_1.default.pvwRankrwd.pool) {
                    let _cfg = gameCfg_1.default.pvwRankrwd.pool[_id];
                    if (crid >= _cfg.start && crid <= _cfg.end) {
                        let ctxOrder = await tool_1.tool.ctxCreate('user', cmember);
                        await lock_1.default.setLock(ctxOrder, 'user', cmember); //枷锁
                        ctxOrder.state.master = new master_1.Master(ctxOrder);
                        await ctxOrder.state.master.sendMail(cmember, {
                            title: `试练关卡奖励`,
                            content: `恭喜您在试炼关卡中表现优异，获得第${crid}名，以下为您的奖励，请注意查收。`,
                            items: _cfg.rwd,
                        });
                        await tool_1.tool.ctxUpdate(ctxOrder);
                        console.log('==试练关卡奖励==', cmember, crid);
                        break;
                    }
                }
                crid += 1;
            }
        }
        return;
    }
    if (type == 2) {
        //斗法奖励
        let ctxSysrds = await tool_1.tool.ctxCreate('redis', "10011");
        for (const zisid of hsids) {
            if (hefuids[zisid] != zisid) {
                continue; //不是主服
            }
            let jjcRdsUserModel = RdsUserModel_1.RdsUserModel.getInstance(ctxSysrds, "rdsJjc", zisid, 'x', tool_1.tool.jjcWeekId(game_1.default.getNowTime()));
            console.log('==斗法奖励 key==', jjcRdsUserModel.getKey());
            let jjcAll = await jjcRdsUserModel.getRankBetween(1, 0);
            let crid = 1;
            for (let i = 0; i < jjcAll.length; i += 2) {
                let cmember = jjcAll[i].toString();
                if (cache_1.default.addHfuuid("rdsJjc", cmember) == false) {
                    console.log('==斗法奖励已发过==', cmember, crid);
                    continue;
                }
                let ctxOrder = await tool_1.tool.ctxCreate('user', cmember);
                await lock_1.default.setLock(ctxOrder, 'user', cmember); //枷锁
                ctxOrder.state.master = new master_1.Master(ctxOrder);
                let factJjcInfoModel = ActJjcInfoModel_1.ActJjcInfoModel.getInstance(ctxOrder, cmember);
                let factJjcInfo = await factJjcInfoModel.getInfo();
                //每日奖励
                factJjcInfo.lastDayRid = crid;
                let cfgDayPool = gameCfg_1.default.jjcDay.pool;
                for (const key in cfgDayPool) {
                    if (crid <= parseInt(cfgDayPool[key].id)) {
                        factJjcInfo.dItems = cfgDayPool[key].items;
                        break;
                    }
                }
                factJjcInfo.dayAt = ctxOrder.state.new0 + 22 * 3600; //今天晚上10点
                //每周奖励
                factJjcInfo.lastWeekRid = crid;
                let cfgWeekPool = gameCfg_1.default.jjcWeek.pool;
                for (const key in cfgWeekPool) {
                    if (crid <= parseInt(cfgWeekPool[key].id)) {
                        factJjcInfo.wItems = cfgWeekPool[key].items;
                        break;
                    }
                }
                await factJjcInfoModel.update(factJjcInfo);
                await tool_1.tool.ctxUpdate(ctxOrder);
                crid += 1;
            }
        }
        return;
    }
    if (type == 3) {
        //龙宫
        let createCtx = await tool_1.tool.ctxCreate("admin", "10086");
        let fsevLonggongModel = SevLonggongModel_1.SevLonggongModel.getInstance(createCtx, hsids[0]);
        let fsevLonggong = await fsevLonggongModel.getInfo();
        for (const zisid of hsids) {
            if (hsids[0] == zisid) {
                continue;
            }
            if (hefuids[zisid] != zisid) {
                continue; //不是主服
            }
            console.log('=====龙宫子服======', zisid);
            await lock_1.default.setLock(createCtx, "sevLonggong", zisid);
            //子服：
            let zsevLonggongModel = SevLonggongModel_1.SevLonggongModel.getInstance(createCtx, zisid);
            let zsevLonggong = await zsevLonggongModel.getInfo();
            for (const _fuuid in zsevLonggong.list) {
                fsevLonggong.list[_fuuid] = zsevLonggong.list[_fuuid];
            }
            await fsevLonggongModel.update(fsevLonggong);
        }
        await tool_1.tool.ctxUpdate(createCtx);
        return;
    }
    if (type == 4) {
        for (const zisid of hsids) {
            if (hsids[0] == zisid) {
                continue;
            }
            //[并入] : 子服并入父服
            await mongodb_1.dbSev.getDataDb().update("a_qufu", { "sid": zisid.toString() }, { "heid": hsids[0].toString() });
            console.log(`子服${zisid}并入父服${hsids[0]}成功`);
            await mongodb_1.dbSev.getDataDb().getNextId('A_VER');
        }
        return;
    }
    ctx.body = `步骤${type}错误`;
});
//合服操作
router.all('/weihu/:token', async (ctx) => {
    let { type, minsid, maxsid } = JSON.parse(ctx.request.body);
    if (type == 1) { //[开启维护] 
        let dbqufus = await mongodb_1.dbSev.getDataDb().find("a_qufu");
        for (const dbqufu of dbqufus) {
            if (parseInt(dbqufu.sid) < minsid) {
                continue;
            }
            if (parseInt(dbqufu.sid) > maxsid) {
                continue;
            }
            await mongodb_1.dbSev.getDataDb().update("a_qufu", { "sid": dbqufu.sid }, { "status": "4" });
            console.log(`${dbqufu.sid}开启维护`);
        }
        await mongodb_1.dbSev.getDataDb().getNextId('A_VER');
        ctx.body = `${minsid}-${maxsid}开启维护成功`;
        return;
    }
    if (type == 0) { //[关闭维护] 
        let dbqufus = await mongodb_1.dbSev.getDataDb().find("a_qufu");
        for (const dbqufu of dbqufus) {
            if (parseInt(dbqufu.sid) < minsid) {
                continue;
            }
            if (parseInt(dbqufu.sid) > maxsid) {
                continue;
            }
            await mongodb_1.dbSev.getDataDb().update("a_qufu", { "sid": dbqufu.sid }, { "status": "3" });
            console.log(`${dbqufu.sid}关闭维护`);
        }
        await mongodb_1.dbSev.getDataDb().getNextId('A_VER');
        ctx.body = `${minsid}-${maxsid}关闭维护成功`;
        return;
    }
    ctx.body = `步骤${type}错误`;
});
//同步问道订单
router.all('/wdOrder/:token', async (ctx) => {
    let kind10s = await mongodb_1.dbSev.getDataDb().find("kind10");
    for (const kind10 of kind10s) {
        if (kind10.overAt <= 0) {
            continue;
        }
        let type = 2;
        if (kind10.platOrderId.indexOf("anzhuo_") != -1) {
            type = 1;
        }
        if (kind10.platOrderId.indexOf("ios_") != -1) {
            type = 0;
        }
        if (kind10.status == 4) {
            type = 3;
        }
        let kind10Ctx = await tool_1.tool.ctxCreate("user", kind10.uuid);
        await YlWechat_1.default.shangbaoOrder(kind10Ctx, type, kind10, kind10.orderId, game_1.default.getTimeS(kind10.overAt));
    }
    ctx.body = `同步问道订单完成`;
});
//同步问道用户信息
router.all('/wdshangbaoUser/:token', async (ctx) => {
    // let NowTime = game.getNowTime()
    let logins = await mongodb_1.dbSev.getDataDb().find("loginPlatform");
    let kk = 0;
    for (const login of logins) {
        let params = login.parms;
        let cs = {
            "account": "11479580",
            "appid": "wx10a702d7d0ba0414",
            "timestamp": game_1.default.getNowTime(),
            "sign": "",
            "port": "user",
            "accountId": login.uid,
            "openid": login.openId,
            "regTime": game_1.default.getTimeS(login.time),
            "firstLoginIp": login.ip,
            "firstLoginScene": params[4] == null ? 0 : params[4],
            "firstLoginOs": params[5] == null ? "0" : params[5],
            "userAgent": params[6] == null ? "0" : params[6],
            "source": gameMethod_1.gameMethod.isEmpty(params[7]) == true ? "[]" : params[7] //用户注册来源标记  (前端)
        };
        const keys = Object.keys(cs);
        keys.sort((a, b) => {
            if (a.toLowerCase() < b.toLowerCase()) {
                return -1;
            }
            else if (a.toLowerCase() > b.toLowerCase()) {
                return 1;
            }
            else {
                return 0;
            }
        });
        let str = "";
        for (const key of keys) {
            if (key == "sign") {
                continue;
            }
            str += `${key}=${cs[key]}&`;
        }
        let str1 = str + "key=" + "5b26e165ac5dfd42be70fafa14984d3d";
        let signStr = ts_md5_1.Md5.hashStr(str1).toString().toLocaleUpperCase();
        let _sburl = "https://game.szvi-bo.com/index/api/portApi" + "?" + str + "sign=" + signStr;
        let back = await tool_1.tool.postSync(encodeURI(_sburl), {});
        kk++;
        console.log("===kk====", kk, login.uid, back);
        if (typeof back == "string") {
            back = JSON.parse(back);
        }
        if (back.code != "200") {
            console.log("===back=用户===", _sburl, cs);
        }
        // break
    }
    ctx.body = `同步问道用户信息`;
});
//同步问道用户info信息
router.all('/wdshangbaoUserInfo/:token', async (ctx) => {
    // let NowTime = game.getNowTime()
    let logins = await mongodb_1.dbSev.getDataDb().find("loginPlatform");
    let hasLs = {};
    for (const login of logins) {
        hasLs[login.uid.toString()] = login;
    }
    let users = await mongodb_1.dbSev.getDataDb().find("user");
    let kk = 0;
    for (const user of users) {
        let uid = user.data.uid;
        let cs = {
            "account": "11479580",
            "appid": "wx10a702d7d0ba0414",
            "timestamp": game_1.default.getNowTime(),
            "sign": "",
            "port": "user_info",
            "accountId": uid,
            "openid": hasLs[uid.toString()].openId,
            "gameRoleIndex": user.id,
            "gameArea": user.data.sid,
            "gameRoleName": user.data.name,
            "gameCharGuid": user.id,
        };
        const keys = Object.keys(cs);
        keys.sort((a, b) => {
            if (a.toLowerCase() < b.toLowerCase()) {
                return -1;
            }
            else if (a.toLowerCase() > b.toLowerCase()) {
                return 1;
            }
            else {
                return 0;
            }
        });
        let str = "";
        for (const key of keys) {
            if (key == "sign") {
                continue;
            }
            str += `${key}=${cs[key]}&`;
        }
        let str1 = str + "key=" + "5b26e165ac5dfd42be70fafa14984d3d";
        let signStr = ts_md5_1.Md5.hashStr(str1).toString().toLocaleUpperCase();
        let _sburl = "https://game.szvi-bo.com/index/api/portApi" + "?" + str + "sign=" + signStr;
        let back = await tool_1.tool.postSync(encodeURI(_sburl), {});
        kk++;
        console.log("===kk====", kk, user.id, back);
        if (typeof back == "string") {
            back = JSON.parse(back);
        }
        if (back.code != "200") {
            console.log("===back=用户info===", _sburl, cs);
        }
        // break
    }
    ctx.body = `同步问道用户info信息`;
});
//# sourceMappingURL=s_hefu.js.map