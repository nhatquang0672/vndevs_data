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
const A_SettingModel_1 = require("../model/A_SettingModel");
const tool_1 = require("../../src/util/tool");
const redis_1 = require("../../src/util/redis");
const master_1 = require("../../src/util/master");
const HdDouLuoModel_1 = require("../../src/model/hd/HdDouLuoModel");
const lock_1 = __importDefault(require("../../src/util/lock"));
router.prefix('/s_qingdang');
//登陆页面
router.all('/:token', async (ctx) => {
    await ctx.render('a_qingdang', await s_game_1.default.allOut(ctx, []));
});
//区服维护开启
router.post('/closeQufu/:token', async (ctx) => {
    let backMg = await mongodb_1.dbSev.getDataDb().find("a_setting", { "key": "closeQufu" });
    if (gameMethod_1.gameMethod.isEmpty(backMg) == true) {
        await A_SettingModel_1.a_SettingModel.insert({
            qufu: "1",
            key: "closeQufu",
            msg: "区服维护",
            value: JSON.stringify({ "msg": "程序员清档中..." }),
        });
    }
    else {
        await mongodb_1.dbSev.getDataDb().update("a_setting", { "key": "closeQufu" }, {
            value: JSON.stringify({ "msg": "程序员清档中..." }),
        });
        await mongodb_1.dbSev.getDataDb().getNextId('A_VER');
    }
    await ctx.render('a_qingdang', await s_game_1.default.allOut(ctx, []));
});
//清数据库
router.post('/clearMongodb/:token', async (ctx) => {
    //要保留不删除的表
    let baoLiuJh = ["table_count", "a_user", "a_huodong", "a_setting", "a_qufu", "a_mail", "a_code", "a_codeMa"];
    //清除业务数据库
    let jihes = await mongodb_1.dbSev.getDataDb().collections();
    if (jihes != null) {
        for (const jihe of jihes) {
            if (baoLiuJh.indexOf(jihe.name) != -1) {
                console.log('=业务数据库====保留集合====：', jihe.name);
                continue;
            }
            await mongodb_1.dbSev.getDataDb().dropExistTable(jihe.name);
            console.log('=业务数据库====删除集合====：', jihe.name);
        }
    }
    //矫正 table_count 计数器
    let tableCounts = await mongodb_1.dbSev.getDataDb().find("table_count");
    if (tableCounts != null) {
        for (const tableCount of tableCounts) {
            switch (tableCount.name) {
                case 'A_USER':
                case 'A_MAIL':
                case 'A_QUFU':
                case 'A_MAIL':
                case 'A_HUODONG':
                case 'A_SETTING':
                case 'KIND10_ID':
                case 'KIND11_ID':
                case 'A_CODE':
                    console.log('=====保留计数器====', tableCount.name, tableCount.points);
                    break;
                default:
                    await mongodb_1.dbSev.getDataDb().remove("table_count", { "name": tableCount.name });
                    console.log('=====清除计数器====', tableCount.name);
                    break;
            }
        }
    }
    //清除flow数据库
    jihes = await mongodb_1.dbSev.getFlowDb().collections();
    baoLiuJh = ["a_adminLog"];
    if (jihes != null) {
        for (const jihe of jihes) {
            if (baoLiuJh.indexOf(jihe.name) != -1) {
                console.log('=flow数据库====保留集合====：', jihe.name);
                continue;
            }
            await mongodb_1.dbSev.getFlowDb().dropExistTable(jihe.name);
            console.log('=flow数据库====删除集合====：', jihe.name);
        }
    }
    await ctx.render('a_qingdang', await s_game_1.default.allOut(ctx, []));
});
//清redis
router.post('/clearRedis/:token', async (ctx) => {
    // 删除排行redis
    await redis_1.redisSev.getRedis(master_1.DataType.rds).delall();
    console.log('====删除ph====');
    //删除业务1 redis
    await redis_1.redisSev.getRedis(master_1.DataType.user).delall();
    console.log('====删除yw1====');
    //
    await ctx.render('a_qingdang', await s_game_1.default.allOut(ctx, []));
});
//区服维护关闭
router.post('/openQufu/:token', async (ctx) => {
    let backMg = await mongodb_1.dbSev.getDataDb().find("a_setting", { "key": "closeQufu" });
    if (gameMethod_1.gameMethod.isEmpty(backMg) == true) {
        await A_SettingModel_1.a_SettingModel.insert({
            qufu: "1",
            key: "closeQufu",
            msg: "区服维护",
            value: JSON.stringify({ "msg": "" }),
        });
    }
    else {
        await mongodb_1.dbSev.getDataDb().update("a_setting", { "key": "closeQufu" }, {
            value: JSON.stringify({ "msg": "" }),
        });
        await mongodb_1.dbSev.getDataDb().getNextId('A_VER');
    }
    await ctx.render('a_qingdang', await s_game_1.default.allOut(ctx, []));
});
//添加数据库索引
router.post('/addMongodbSy/:token', async (ctx) => {
    //加索引 - game
    await tool_1.tool.mongoIndex(1);
    //加索引 - flow
    await tool_1.tool.mongoFlow(1);
    await ctx.render('a_qingdang', await s_game_1.default.allOut(ctx, []));
});
router.post('/douluo/:token', async (ctx) => {
    for (const rdskey of ["21_rdsDouLuo_1_20231225"]) {
        // let rdskey = "57_rdsDouLuo_1_20231225"
        let getAll = await redis_1.redisSev.getRedis(master_1.DataType.rds).zRange(rdskey, 0, -1);
        console.log("====getAll=====", JSON.stringify(getAll));
        //构造 排行信息备份
        let rid = 0;
        let kk = 0;
        let addmem = [];
        let list = {};
        for (let i = 0; i < getAll.length; i += 1) {
            let member = getAll[i];
            if (Number(member) < 10000) {
                continue;
            }
            rid += 1;
            if (rid <= 490) {
                addmem.push(rid.toString());
                addmem.push(member);
                kk = rid;
            }
            list[member] = rid;
        }
        for (let index = kk + 1; index <= 500; index++) {
            addmem.push(index.toString());
            addmem.push(index.toString());
        }
        console.log("====addmem=====", JSON.stringify(addmem));
        await redis_1.redisSev.getRedis(master_1.DataType.rds).del(rdskey); //清空所有
        await redis_1.redisSev.getRedis(master_1.DataType.rds).zAddArr(rdskey, addmem);
        for (const _member in list) {
            let dyCtx = await tool_1.tool.ctxCreate("user", _member);
            await lock_1.default.setLock(dyCtx, "user", _member);
            let hdDouLuoModel = HdDouLuoModel_1.HdDouLuoModel.getInstance(dyCtx, _member, "1");
            let hdDouLuo = await hdDouLuoModel.getInfo();
            if (list[_member] > 500) {
                hdDouLuo.minRid = 99999;
            }
            else {
                hdDouLuo.minRid = list[_member];
            }
            hdDouLuo.tzList = [];
            await hdDouLuoModel.update(hdDouLuo);
            await tool_1.tool.ctxUpdate(dyCtx);
            console.log("=====member==========", _member, list[_member]);
        }
    }
    await ctx.render('a_qingdang', await s_game_1.default.allOut(ctx, []));
});
//# sourceMappingURL=s_qingdang.js.map