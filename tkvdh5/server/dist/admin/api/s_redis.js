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
const master_1 = require("../../src/util/master");
router.prefix('/s_redis');
//登陆页面
router.all('/:token', async (ctx) => {
    let back = await s_game_1.default.allOut(ctx, []);
    await ctx.render('a_redis', back);
});
//查询
router.post('/find/:token', async (ctx) => {
    let { token, sid } = tool_1.tool.getParamsAdmin(ctx);
    let keys = await redis_1.redisSev.getRedis(master_1.DataType.rds).getKeys(sid);
    if (keys == null) {
        keys = [];
    }
    let back = await s_game_1.default.allOut(ctx, keys, { type: "key", sid: sid });
    await ctx.render('a_redis', back);
});
//查看
router.post('/look/:token/:key/:sid', async (ctx) => {
    let { token, key, sid } = tool_1.tool.getParamsAdmin(ctx);
    let keys = await redis_1.redisSev.getRedis(master_1.DataType.rds).zRevrangeWithScores(key, 0, -1);
    if (keys == null) {
        keys = [];
    }
    let back = await s_game_1.default.allOut(ctx, keys, { type: "value", key: key, sid: key });
    await ctx.render('a_redis', back);
});
//设置
router.post('/setMember/:token/:key/:sid', async (ctx) => {
    let { token, key, member, score, sid } = tool_1.tool.getParamsAdmin(ctx);
    await redis_1.redisSev.getRedis(master_1.DataType.rds).zAdd(key, score, member);
    let keys = await redis_1.redisSev.getRedis(master_1.DataType.rds).zRevrangeWithScores(key, 0, -1);
    if (keys == null) {
        keys = [];
    }
    let back = await s_game_1.default.allOut(ctx, keys, { type: "value", key: key, sid: sid });
    await ctx.render('a_redis', back);
});
//删除
router.post('/delMember/:token/:key/:member/:sid', async (ctx) => {
    let { token, key, member, sid } = tool_1.tool.getParamsAdmin(ctx);
    await redis_1.redisSev.getRedis(master_1.DataType.rds).zRem(key, member);
    let keys = await redis_1.redisSev.getRedis(master_1.DataType.rds).zRevrangeWithScores(key, 0, -1);
    if (keys == null) {
        keys = [];
    }
    let back = await s_game_1.default.allOut(ctx, keys, { type: "value", key: key, sid: sid });
    await ctx.render('a_redis', back);
});
//# sourceMappingURL=s_redis.js.map