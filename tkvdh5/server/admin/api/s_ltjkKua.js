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
const tool_1 = require("../../src/util/tool");
const game_1 = __importDefault(require("../../src/util/game"));
const setting_1 = __importDefault(require("../../src/crontab/setting"));
const UserModel_1 = require("../../src/model/user/UserModel");
const PlayerModel_1 = require("../../src/model/player/PlayerModel");
router.prefix('/s_ltjkKua');
router.all('/:token', async (ctx) => {
    let { jktime } = tool_1.tool.getParamsAdmin(ctx);
    if (jktime == null || jktime == "") {
        let back = await s_game_1.default.allOut(ctx, [], { "jktime": jktime });
        await ctx.render('a_ltjkKua', back);
        return;
    }
    await setting_1.default.createCash(game_1.default.getToDay_0(), game_1.default.getNowTime(), false);
    let sql = { "hdcid": "kua" };
    let outf = [];
    let lists = await mongodb_1.dbSev.getDataDb().find("chat", sql);
    let _jktime = game_1.default.getTimeByStr(jktime);
    let cstime = game_1.default.getToDay_0(_jktime);
    for (const list of lists) {
        for (const _id in list.data.list) {
            if (list.data.list[_id].type != "1") {
                continue;
            }
            if (list.data.list[_id].time < cstime || list.data.list[_id].time >= cstime + 86400) {
                continue;
            }
            let ban = 0;
            let fuuid = list.data.list[_id].user.uuid.toString();
            if (setting_1.default.isBan(fuuid, "1", game_1.default.getNowTime()) == true
                || setting_1.default.isBan(fuuid, "2", game_1.default.getNowTime()) == true
                || setting_1.default.isBan(list.data.list[_id].user.uid.toString(), "3", game_1.default.getNowTime()) == true) {
                ban = 1;
            }
            outf.push([
                _id,
                list.data.list[_id].user.sid,
                list.data.list[_id].user.uuid,
                list.data.list[_id].user.name,
                list.data.list[_id].user.level,
                list.data.list[_id].msg,
                list.data.list[_id].time,
                ban
            ]);
        }
    }
    outf.sort(function (a, b) {
        return b[6] - a[6];
    });
    for (const key in outf) {
        outf[key][6] = game_1.default.getTimeS(outf[key][6]);
    }
    let back = await s_game_1.default.allOut(ctx, outf, { "jktime": jktime });
    await ctx.render('a_ltjkKua', back);
});
//封号
router.all('/testAjxa/:token', async (ctx) => {
    let param = JSON.parse(ctx.request.body);
    let uuid = param.fuuid;
    let outf = {};
    let data = {
        id: "",
        qufu: "1",
        key: "a_ban",
        msg: "后台封禁",
        value: ""
    };
    let fback = await mongodb_1.dbSev.getDataDb().findOne("a_setting", { "key": "a_ban" });
    if (fback == null) {
        if (uuid != null) {
            let id = await mongodb_1.dbSev.getDataDb().getNextId('A_SETTING');
            data.id = id;
        }
    }
    else {
        data.id = fback.id;
        outf = eval("(" + fback.value + ")");
    }
    if (uuid != null) {
        let ctx_admin = await tool_1.tool.ctxCreate("admin", "10086");
        let userModel = UserModel_1.UserModel.getInstance(ctx_admin, uuid);
        let userInfo = await userModel.getInfo();
        if (outf[uuid] == null) {
            outf[uuid] = {
                uid: "",
                list: {},
                yuanyin: {},
                name: "",
                sid: "",
                boji: {} //封号波及角色
            };
        }
        outf[uuid].uid = userInfo.uid;
        outf[uuid].name = userInfo.name;
        outf[uuid].sid = userInfo.sid;
        outf[uuid].yuanyin["3"] = param.yuanyin;
        outf[uuid].list["3"] = game_1.default.getNowTime() + 86400 * 365;
        let playerModel = PlayerModel_1.PlayerModel.getInstance(ctx_admin, userInfo.uid);
        let player = await playerModel.getInfo();
        outf[uuid].boji = player.list;
        data.value = JSON.stringify(outf);
        await mongodb_1.dbSev.getDataDb().update("a_setting", { "key": "a_ban" }, data, true);
        await mongodb_1.dbSev.getDataDb().getNextId('A_VER');
    }
    ctx.body = "封号成功";
});
//# sourceMappingURL=s_ltjkKua.js.map