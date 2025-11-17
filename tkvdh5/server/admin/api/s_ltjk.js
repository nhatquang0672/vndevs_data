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
const gameMethod_1 = require("../../common/gameMethod");
const PlayerModel_1 = require("../../src/model/player/PlayerModel");
router.prefix('/s_ltjk');
router.all('/:token', async (ctx) => {
    let { sid, jktime } = tool_1.tool.getParamsAdmin(ctx);
    if (sid == null || sid == "") {
        let back = await s_game_1.default.allOut(ctx, [], { "sid": sid, "jktime": jktime });
        await ctx.render('a_ltjk', back);
        return;
    }
    let newAt = game_1.default.getNowTime();
    await setting_1.default.createCash(game_1.default.getToDay_0(), newAt, false);
    let sql = { "kid": "club", "data.sid": sid };
    if (sid == "all") {
        sql = { "kid": "club" };
    }
    let dayid = "";
    if (gameMethod_1.gameMethod.isEmpty(jktime) == false) {
        let _jktime = game_1.default.getTimeByStr(jktime);
        dayid = game_1.default.getTodayId(_jktime);
    }
    let outf = [];
    let clubs = await mongodb_1.dbSev.getDataDb().find("sev", sql);
    for (const club of clubs) {
        let data = await mongodb_1.dbSev.getDataDb().findOne("chat", { "id": club.id, "kid": "chat", "hdcid": "club", });
        if (data == null) {
            continue;
        }
        for (const id in data.data.list) {
            if (data.data.list[id].type != 1) {
                continue; //不是玩家发的聊天
            }
            let chatInfo = data.data.list[id];
            if (dayid != "" && dayid != game_1.default.getTodayId(chatInfo.time)) {
                continue;
            }
            let ban = 0;
            let fuuid = chatInfo.user.uuid.toString();
            if (setting_1.default.isBan(fuuid, "1", newAt) == true
                || setting_1.default.isBan(fuuid, "2", newAt) == true
                || setting_1.default.isBan(chatInfo.user.uid, "3", newAt) == true) {
                ban = 1;
            }
            outf.push([
                id,
                sid,
                fuuid,
                chatInfo.user.name,
                chatInfo.user.level,
                club.id,
                club.data.name,
                chatInfo.msg,
                chatInfo.time,
                ban
            ]);
        }
    }
    outf.sort(function (a, b) {
        return b[8] - a[8];
    });
    for (const key in outf) {
        outf[key][8] = game_1.default.getTimeS(outf[key][8]);
    }
    let back = await s_game_1.default.allOut(ctx, outf, { "sid": sid, "jktime": jktime });
    await ctx.render('a_ltjk', back);
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
//# sourceMappingURL=s_ltjk.js.map