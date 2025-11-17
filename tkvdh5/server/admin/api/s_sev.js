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
router.prefix('/s_sev');
router.all('/:token', async (ctx) => {
    let { kid, id } = tool_1.tool.getParamsAdmin(ctx);
    if (kid == null || id == null || (kid == "" && id == "")) {
        let back = await s_game_1.default.allOut(ctx, [], { kid: kid, id: id });
        ctx.render('a_sev', back);
        return;
    }
    let list = [];
    let sevList = await mongodb_1.dbSev.getDataDb().find("sev");
    for (const sev of sevList) {
        if (kid != '' && sev.kid != kid) {
            continue;
        }
        if (id != '' && sev.id != id) {
            continue;
        }
        list.push({
            desc: "sev模块",
            key1: master_1.DataType.sev + '_' + sev.id,
            key2: "sev" + '_' + sev.kid + '_' + sev.hdcid,
            info: sev.data
        });
    }
    let back = await s_game_1.default.allOut(ctx, list, { kid: kid, id: id });
    ctx.render('a_sev', back);
});
//编辑 - 保存
router.post('/editSave/:token/:key1/:key2', async (ctx) => {
    let params = tool_1.tool.getParamsAdmin(ctx);
    let arr1 = params.key1.split('_');
    let arr2 = params.key2.split('_');
    if (tool_1.tool.isJSON(params.info) == false) {
        let back = await s_game_1.default.allOut(ctx, await getList(), { msg: "json格式不对" });
        ctx.render('a_sev', back);
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
    let list = [];
    let sevList = await mongodb_1.dbSev.getDataDb().find("sev");
    for (const sev of sevList) {
        if (params._kid != '' && params._kid != null && sev.kid != params._kid) {
            continue;
        }
        if (params._id != '' && params._id != null && sev.id != params._id) {
            continue;
        }
        list.push({
            desc: "sev模块",
            key1: master_1.DataType.sev + '_' + sev.id,
            key2: "sev" + '_' + sev.kid + '_' + sev.hdcid,
            info: sev.data
        });
    }
    let back = await s_game_1.default.allOut(ctx, list, { msg: "操作成功！", kid: params._kid, id: params._id });
    ctx.render('a_sev', back);
});
async function getList() {
    let list = [];
    let sevList = await mongodb_1.dbSev.getDataDb().find("sev");
    for (const sev of sevList) {
        list.push({
            desc: "sev模块",
            key1: master_1.DataType.sev + '_' + sev.id,
            key2: "sev" + '_' + sev.kid + '_' + sev.hdcid,
            info: sev.data
        });
    }
    return list;
}
//# sourceMappingURL=s_sev.js.map