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
const game_1 = __importDefault(require("../../src/util/game"));
const mongodb_1 = require("../../src/util/mongodb");
const master_1 = require("../../src/util/master");
const lock_1 = __importDefault(require("../../src/util/lock"));
router.prefix('/s_order');
//登陆页面
router.all('/:token', async (ctx) => {
    let list = {};
    let back = await s_game_1.default.allOut(ctx, list, { type: "", uuid: "" });
    await ctx.render('a_order', back);
});
//查询
router.post('/find/:token', async (ctx) => {
    let { uuid } = tool_1.tool.getParamsAdmin(ctx);
    let orderlist = await mongodb_1.dbSev.getDataDb().find('kind10', { "uuid": uuid.toString() });
    let outf = [];
    for (const val of orderlist) {
        val.createAt = game_1.default.getDayTime(val.createAt);
        val.overAt = val.overAt == 0 ? "未完成" : game_1.default.getDayTime(val.overAt);
        outf.push(val);
    }
    let back = await s_game_1.default.allOut(ctx, outf, { type: "user", uuid: uuid });
    await ctx.render('a_order', back);
});
//补单
router.post('/budan/:token/:uuid/:id', async (ctx) => {
    let { uuid, id } = tool_1.tool.getParamsAdmin(ctx);
    let orderInfo = await mongodb_1.dbSev.getDataDb().findOne("kind10", { "orderId": id });
    if (orderInfo == null) {
        let orderlist = await mongodb_1.dbSev.getDataDb().find('kind10', { "uuid": uuid });
        let outf = [];
        for (const val of orderlist) {
            val.createAt = game_1.default.getDayTime(val.createAt);
            val.overAt = val.overAt == 0 ? "未完成" : game_1.default.getDayTime(val.overAt);
            outf.push(val);
        }
        let back = await s_game_1.default.allOut(ctx, outf, { type: "user", uuid: uuid, msg: "订单ID异常" });
        await ctx.render('a_order', back);
        return;
    }
    if (orderInfo.overAt > 0) {
        let orderlist = await mongodb_1.dbSev.getDataDb().find('kind10', { "uuid": uuid });
        let outf = [];
        for (const val of orderlist) {
            val.createAt = game_1.default.getDayTime(val.createAt);
            val.overAt = val.overAt == 0 ? "未完成" : game_1.default.getDayTime(val.overAt);
            outf.push(val);
        }
        let back = await s_game_1.default.allOut(ctx, outf, { type: "user", uuid: uuid, msg: "订单已经完成" });
        await ctx.render('a_order', back);
        return;
    }
    let msg = "订单已经完成";
    try {
        let ctxOrder = await tool_1.tool.ctxCreate('user', orderInfo.uuid);
        await lock_1.default.setLock(ctxOrder, 'user', orderInfo.uuid); //枷锁
        ctxOrder.state.master = new master_1.Master(ctxOrder);
        await ctxOrder.state.master.kind10Success(id, 'budan' + id, 3);
        await tool_1.tool.ctxUpdate(ctxOrder);
    }
    catch (error) {
        msg = error.message;
    }
    let orderlist = await mongodb_1.dbSev.getDataDb().find('kind10', { "uuid": uuid });
    let outf = [];
    for (const val of orderlist) {
        val.createAt = game_1.default.getDayTime(val.createAt);
        val.overAt = val.overAt == 0 ? "未完成" : game_1.default.getDayTime(val.overAt);
        outf.push(val);
    }
    let back = await s_game_1.default.allOut(ctx, outf, { type: "user", uuid: uuid, msg: msg });
    await ctx.render('a_order', back);
});
//# sourceMappingURL=s_order.js.map