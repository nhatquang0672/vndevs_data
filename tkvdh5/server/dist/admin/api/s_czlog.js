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
const lock_1 = __importDefault(require("../../src/util/lock"));
const gameMethod_1 = require("../../common/gameMethod");
const game_1 = __importDefault(require("../../src/util/game"));
router.prefix('/s_czlog');
router.all('/:token', async (ctx) => {
    let { uuid, status, qstime, jztime } = tool_1.tool.getParamsAdmin(ctx);
    if (uuid == null || status == null) {
        let back = await s_game_1.default.allOut(ctx, []);
        await ctx.render('a_czlog', back);
        return;
    }
    let _qstime = 0;
    if (qstime != null && qstime != "") {
        _qstime = game_1.default.getTimeByStr(qstime);
    }
    let _jztime = 9999999999999;
    if (jztime != null && jztime != "") {
        _jztime = game_1.default.getTimeByStr(jztime);
    }
    let sts = [];
    if (status == "statusall") {
        sts = [0, 1, 2, 3, 4, 5];
    }
    if (status == "status0") {
        sts = [0];
    }
    if (status == "status2") {
        sts = [2];
    }
    if (status == "status1_3") {
        sts = [1, 3, 5];
    }
    if (status == "status4") {
        sts = [4];
    }
    let outf = [];
    let kind10s = await mongodb_1.dbSev.getDataDb().find("kind10");
    kind10s.sort(function (a, b) {
        return b.overAt - a.overAt;
    });
    for (const kind10 of kind10s) {
        if (uuid != "" && kind10.uuid != uuid && kind10.platOrderId != uuid) {
            continue;
        }
        if (sts.indexOf(kind10.status) == -1) {
            continue;
        }
        if (kind10.createAt < _qstime) {
            continue;
        }
        if (kind10.createAt > _jztime) {
            continue;
        }
        let _outf = gameMethod_1.gameMethod.objCopy(kind10);
        if (kind10.status == 0) {
            _outf.status = "未支付";
        }
        if (kind10.status == 1) {
            _outf.status = "需补单";
        }
        if (kind10.status == 2) {
            _outf.status = "正常到账";
        }
        if (kind10.status == 3) {
            _outf.status = "补单到账";
        }
        if (kind10.status == 4) {
            _outf.status = "后台直冲";
        }
        if (kind10.status == 5) {
            _outf.status = "补单异常";
        }
        _outf.createAt = game_1.default.getDayTime(_outf.createAt);
        _outf.overAt = _outf.overAt == 0 ? "未完成" : game_1.default.getDayTime(_outf.overAt);
        outf.push(_outf);
    }
    let back = await s_game_1.default.allOut(ctx, outf);
    await ctx.render('a_czlog', back);
});
//补单
router.post('/budan/:token/:uuid/:orderId', async (ctx) => {
    let { uuid, orderId } = tool_1.tool.getParamsAdmin(ctx);
    let orderInfo = await mongodb_1.dbSev.getDataDb().findOne("kind10", { "orderId": orderId });
    let msg = "补单成功";
    if (orderInfo != null && orderInfo.status == 1) {
        try {
            let bdCtx = await tool_1.tool.ctxCreate('user', orderInfo.uuid);
            await lock_1.default.setLock(bdCtx, 'user', orderInfo.uuid); //枷锁
            let typeMsg = await bdCtx.state.master.kind10Success(orderInfo.orderId, 'budan' + orderInfo.orderId, 3);
            if (typeMsg.type == 0) {
                await mongodb_1.dbSev.getDataDb().update("kind10", { orderId: orderId }, {
                    status: 5 // 订单状态 0下单 1已到账未下发道具 2已下发道具 3已补单 4后台直冲 5补单异常
                });
                msg = "补单异常";
            }
            await tool_1.tool.ctxUpdate(bdCtx);
        }
        catch (error) {
            await mongodb_1.dbSev.getDataDb().update("kind10", { orderId: orderId }, {
                status: 5 // 订单状态 0下单 1已到账未下发道具 2已下发道具 3已补单 4后台直冲 5补单异常
            });
            msg = "补单异常";
        }
    }
    let kind10s = await mongodb_1.dbSev.getDataDb().find("kind10");
    let outf = [];
    for (const kind10 of kind10s) {
        if ([1, 3, 5].indexOf(kind10.status) == -1) {
            continue;
        }
        let _outf = gameMethod_1.gameMethod.objCopy(kind10);
        if (kind10.status == 1) {
            _outf.status = "需补单";
        }
        if (kind10.status == 3) {
            _outf.status = "补单到账";
        }
        if (kind10.status == 5) {
            _outf.status = "补单异常";
        }
        _outf.createAt = game_1.default.getDayTime(_outf.createAt);
        _outf.overAt = _outf.overAt == 0 ? "未完成" : game_1.default.getDayTime(_outf.overAt);
        outf.push(_outf);
    }
    let back = await s_game_1.default.allOut(ctx, outf, { type: "user", uuid: uuid, msg: msg });
    await ctx.render('a_czlog', back);
});
router.post('/approve/:token/:uuid/:orderId', async (ctx) => {
    let { uuid, orderId } = tool_1.tool.getParamsAdmin(ctx);
    let orderInfo = await mongodb_1.dbSev.getDataDb().findOne("kind10", { "orderId": orderId });
    let msg = "Approve Order Failed";
    if (orderInfo != null && orderInfo.status == 0) {
        console.log('### olala');
        let bdCtx = await tool_1.tool.ctxCreate('user', orderInfo.uuid);
        await lock_1.default.setLock(bdCtx, 'user', orderInfo.uuid); //枷锁
        let typeMsg = await bdCtx.state.master.kind10Success(orderInfo.orderId, orderInfo.orderId, 4);
        msg = "Approve Order Success";
        await tool_1.tool.ctxUpdate(bdCtx);
    }
    let outf = [];
    let kind10s = await mongodb_1.dbSev.getDataDb().find("kind10");
    for (const kind10 of kind10s) {
        let _outf = gameMethod_1.gameMethod.objCopy(kind10);
        // if ([0].indexOf(kind10.status) == -1) {
        if (kind10.status != 0) {
            continue;
        }
        if (kind10.status == 0) {
            _outf.status = "未支付";
        }
        _outf.createAt = game_1.default.getDayTime(_outf.createAt);
        _outf.overAt = _outf.overAt == 0 ? "未完成" : game_1.default.getDayTime(_outf.overAt);
        outf.push(_outf);
    }
    let back = await s_game_1.default.allOut(ctx, outf, { type: "user", uuid: uuid, msg: msg });
    await ctx.render('a_czlog', back);
});
//# sourceMappingURL=s_czlog.js.map