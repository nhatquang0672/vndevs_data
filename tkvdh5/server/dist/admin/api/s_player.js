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
const redis_1 = require("../../src/util/redis");
const mongodb_1 = require("../../src/util/mongodb");
const master_1 = require("../../src/util/master");
const UserModel_1 = require("../../src/model/user/UserModel");
const MailModel_1 = require("../../src/model/user/MailModel");
const PlayerModel_1 = require("../../src/model/player/PlayerModel");
router.prefix('/s_player');
router.all('/:token', async (ctx) => {
    let { uuid, token } = tool_1.tool.getParamsAdmin(ctx);
    if (uuid == null || uuid == "") {
        let back = await s_game_1.default.allOut(ctx, []);
        await ctx.render('a_player', back);
        return;
    }
    let back = await s_game_1.default.allOut(ctx, await getList(uuid), { uuid: uuid });
    ctx.render('a_player', back);
});
//编辑 - 保存
router.post('/editSave/:token/:uuid/:key1/:key2', async (ctx) => {
    let params = tool_1.tool.getParamsAdmin(ctx);
    let arr1 = params.key1.split('_');
    let arr2 = params.key2.split('_');
    if (tool_1.tool.isJSON(params.info) == false) {
        let back = await s_game_1.default.allOut(ctx, await getList(arr1[1]), { msg: "json格式不对" });
        await ctx.render('a_player', back);
        return;
    }
    let info = JSON.parse(params.info);
    await redis_1.redisSev.getRedis(arr1[0]).hSet(params.key1, params.key2, info);
    //如果是列表
    if (arr2[2] == 'list') {
        for (const xbid in info) {
            //立即写入数据库
            await mongodb_1.dbSev.getDataDb().update(arr2[0], {
                id: arr1[1],
                kid: arr2[1],
                hdcid: xbid
            }, {
                id: arr1[1],
                kid: arr2[1],
                hdcid: xbid,
                data: info[xbid]
            }, true);
        }
    }
    else {
        //立即写入数据库
        await mongodb_1.dbSev.getDataDb().update(arr2[0], {
            id: arr1[1],
            kid: arr2[1],
            hdcid: arr2[2]
        }, {
            id: arr1[1],
            kid: arr2[1],
            hdcid: arr2[2],
            data: info
        }, true);
    }
    let back = await s_game_1.default.allOut(ctx, await getList(params.uuid), { uuid: params.uuid, msg: "操作成功！" });
    await ctx.render('a_player', back);
});
async function getList(uuid) {
    let adminCtx = await tool_1.tool.ctxCreate('user', uuid);
    let userModel = UserModel_1.UserModel.getInstance(adminCtx, uuid);
    let userInfo = await userModel.getInfo();
    let list = [];
    if (userInfo.sid == "") {
        return [];
    }
    let playerModel = PlayerModel_1.PlayerModel.getInstance(adminCtx, userInfo.uid);
    let playerInfo = await playerModel.getInfo();
    list.push({
        desc: "账号基础信息",
        key1: playerModel.getKey1(),
        key2: playerModel.getKey2(),
        info: playerInfo
    });
    list.push({
        desc: "角色基础信息",
        key1: userModel.getKey1(),
        key2: userModel.getKey2(),
        info: userInfo
    });
    let mailModel = MailModel_1.MailModel.getInstance(adminCtx, uuid);
    list.push({
        desc: "邮件模块",
        key1: mailModel.getKey1(),
        key2: mailModel.getKey2(),
        info: await mailModel.getInfoList()
    });
    let actList = await mongodb_1.dbSev.getDataDb().find("act", { id: uuid });
    for (const act of actList) {
        list.push({
            desc: "act模块",
            key1: master_1.DataType.user + '_' + uuid,
            key2: "act" + '_' + act.kid + '_' + act.hdcid,
            info: act.data
        });
    }
    let hdList = await mongodb_1.dbSev.getDataDb().find("hd", { id: uuid });
    for (const hd of hdList) {
        list.push({
            desc: "hd模块",
            key1: master_1.DataType.user + '_' + uuid,
            key2: "hd" + '_' + hd.kid + '_' + hd.hdcid,
            info: hd.data
        });
    }
    return list;
}
//# sourceMappingURL=s_player.js.map