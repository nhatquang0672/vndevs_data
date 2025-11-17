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
router.prefix('/s_lvPve');
router.all('/:token', async (ctx) => {
    let back = await s_game_1.default.allOut(ctx, []);
    await ctx.render('a_lvPve', back);
});
router.all('/find/:token', async (ctx) => {
    let { sid, rmbMin, rmbMax } = tool_1.tool.getParamsAdmin(ctx);
    let _sid = "all";
    if (sid == "" || sid == null) {
        _sid = "all";
    }
    else {
        _sid = sid;
    }
    let _rmbMin = 0;
    if (rmbMin != "" && rmbMin != null) {
        _rmbMin = parseInt(rmbMin);
    }
    let _rmbMax = 999999999;
    if (rmbMax != "" && rmbMax != null) {
        _rmbMax = parseInt(rmbMax);
    }
    //充值
    let kind10s = await mongodb_1.dbSev.getDataDb().find("kind10", { "overAt": { $gte: 1 } });
    let kind10User = {}; //角色ID 对应 充值金额
    for (const kind10 of kind10s) {
        if (kind10User[kind10.uuid] == null) {
            kind10User[kind10.uuid] = 0;
        }
        kind10User[kind10.uuid] += kind10.rmb;
    }
    let lvs = {}; //等级对应人数
    let uuids = {}; //要统计的角色ID列表 对应金额
    let pves = {}; //关卡ID对应人数
    let acts = await mongodb_1.dbSev.getDataDb().find("act", { "kid": "actPveInfo" }); //用户列表
    let actpve = {};
    for (const act of acts) {
        actpve[act.id] = act.data.id.toString();
    }
    //角色
    let sql = {};
    if (_sid != "all") {
        sql = { "data.sid": _sid };
    }
    let users = await mongodb_1.dbSev.getDataDb().find("user", sql); //用户列表
    for (const user of users) {
        if (kind10User[user.id] != null) {
            uuids[user.id] = kind10User[user.id];
        }
        else {
            uuids[user.id] = 0;
        }
        if (uuids[user.id] >= _rmbMin && uuids[user.id] <= _rmbMax) {
            let lvstr = user.data.level.toString();
            if (lvs[lvstr] == null) {
                lvs[lvstr] = 0;
            }
            lvs[lvstr] += 1;
            if (actpve[user.id] == null) {
                if (pves["1"] == null) {
                    pves["1"] = 0;
                }
                pves["1"] += 1;
            }
            else {
                if (pves[actpve[user.id]] == null) {
                    pves[actpve[user.id]] = 0;
                }
                pves[actpve[user.id]] += 1;
            }
        }
    }
    let outf = {
        lvs: lvs,
        pves: pves
    };
    let back = await s_game_1.default.allOut(ctx, outf, [sid, rmbMin, rmbMax]);
    await ctx.render('a_lvPve', back);
});
//# sourceMappingURL=s_lvPve.js.map