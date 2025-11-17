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
const tool_1 = require("../../src/util/tool");
const mongodb_1 = require("../../src/util/mongodb");
const UserModel_1 = require("../../src/model/user/UserModel");
const game_1 = __importDefault(require("../../src/util/game"));
const gameMethod_1 = require("../../common/gameMethod");
const PlayerModel_1 = require("../../src/model/player/PlayerModel");
router.prefix('/s_ban');
//登陆页面
router.all('/:token', async (ctx) => {
    let { uuid, type, etime, yuanyin } = tool_1.tool.getParamsAdmin(ctx);
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
        //修复数据
        // for (const _uuid in outf) {
        //     if(outf[_uuid].yuanyin != null){
        //         continue
        //     }
        //     let ctx_admin = await tool.ctxCreate("admin", "10086");
        //     let userModel = UserModel.getInstance(ctx_admin,_uuid)
        //     let userInfo = await userModel.getInfo()
        //     if(outf[_uuid].yuanyin == null){
        //         outf[_uuid].yuanyin = {}
        //     }
        //     if(outf[_uuid].boji == null){
        //         outf[_uuid].boji = {}
        //     }
        //     outf[_uuid].sid = userInfo.sid
        //     outf[_uuid].name = userInfo.name
        //     for (const _type in outf[_uuid].list) {
        //         outf[_uuid].yuanyin[_type] = ""
        //     }
        //     if(outf[_uuid].list["3"] != null){
        //         let playerModel = PlayerModel.getInstance(ctx_admin,userInfo.uid)
        //         let player = await playerModel.getInfo()
        //         outf[_uuid].boji = player.list
        //     }
        // }
        // data.value = JSON.stringify(outf)
        // await dbSev.getDataDb().update("a_setting",{"key":"a_ban"},data,true)
    }
    if (uuid != null && uuid != "") {
        if (etime == "" || etime == null) {
            etime = "2099-05-28T16:46";
        }
        let _etime = game_1.default.getTimeByStr(etime);
        let ctx_admin = await tool_1.tool.ctxCreate("admin", "10086");
        let userModel = UserModel_1.UserModel.getInstance(ctx_admin, uuid);
        let userInfo = await userModel.getInfo();
        if (userInfo.uid == null || userInfo.uid == "") {
            let back = await s_game_1.default.allOut(ctx, changeOutf(outf), { "msg": "角色id不存在！" });
            await ctx.render('a_ban', back);
            return;
        }
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
        outf[uuid].list[type] = _etime;
        outf[uuid].name = userInfo.name;
        outf[uuid].sid = userInfo.sid;
        outf[uuid].yuanyin[type] = yuanyin;
        if (type == 3) {
            let playerModel = PlayerModel_1.PlayerModel.getInstance(ctx_admin, userInfo.uid);
            let player = await playerModel.getInfo();
            outf[uuid].boji = player.list;
        }
        data.value = JSON.stringify(outf);
        await mongodb_1.dbSev.getDataDb().update("a_setting", { "key": "a_ban" }, data, true);
        await mongodb_1.dbSev.getDataDb().getNextId('A_VER');
    }
    let back = await s_game_1.default.allOut(ctx, changeOutf(outf));
    await ctx.render('a_ban', back);
});
//删除
router.post('/delete/:token/:fuuid/:type', async (ctx) => {
    let { fuuid, type } = ctx.params;
    let fback = await mongodb_1.dbSev.getDataDb().findOne("a_setting", { "key": "a_ban" });
    let outf = {};
    let data = {
        id: "",
        qufu: "1",
        key: "a_ban",
        msg: "后台封禁",
        value: ""
    };
    if (fback != null) {
        outf = eval("(" + fback.value + ")");
        if (outf[fuuid] != null) {
            delete outf[fuuid].list[type];
            delete outf[fuuid].yuanyin[type];
            if (type == 3) {
                outf[fuuid].boji = {};
            }
            if (gameMethod_1.gameMethod.isEmpty(outf[fuuid].list) == true) {
                delete outf[fuuid];
            }
            data.id = fback.id;
            data.value = JSON.stringify(outf);
            await mongodb_1.dbSev.getDataDb().update("a_setting", { "key": "a_ban" }, data, true);
            await mongodb_1.dbSev.getDataDb().getNextId('A_VER');
        }
    }
    let back = await s_game_1.default.allOut(ctx, changeOutf(outf));
    await ctx.render('a_ban', back);
});
function changeOutf(outf) {
    for (const uuid in outf) {
        for (const type in outf[uuid].list) {
            if (type == "1") {
                outf[uuid].list[type] = {
                    time: game_1.default.getDayTime(outf[uuid].list[type]).replace(/T/, " "),
                    name: "角色禁言"
                };
            }
            if (type == "2") {
                outf[uuid].list[type] = {
                    time: game_1.default.getDayTime(outf[uuid].list[type]).replace(/T/, " "),
                    name: "封角色"
                };
            }
            if (type == "3") {
                outf[uuid].list[type] = {
                    time: game_1.default.getDayTime(outf[uuid].list[type]).replace(/T/, " "),
                    name: "封号"
                };
            }
        }
    }
    return outf;
}
//# sourceMappingURL=s_ban.js.map