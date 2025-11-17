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
router.prefix('/s_qfuser');
router.all('/:token', async (ctx) => {
    let { sid, name } = tool_1.tool.getParamsAdmin(ctx);
    if ((name == "" && sid == "") || (name == null && sid == null)) {
        let back = await s_game_1.default.allOut(ctx, [], [sid, name]);
        await ctx.render('a_qfuser', back);
        return;
    }
    let sql = {};
    if (sid != "") {
        sql["data.sid"] = sid;
    }
    if (name != "") {
        sql["data.name"] = { $regex: name };
    }
    let outf = [];
    let backs = await mongodb_1.dbSev.getDataDb().find("user", sql);
    for (const back of backs) {
        outf.push({
            sid: back.data.sid,
            uid: back.data.uid,
            uuid: back.data.uuid,
            name: back.data.name,
            level: back.data.level,
            lastlogin: game_1.default.getDayTime(back.data.lastlogin),
            regtime: game_1.default.getDayTime(back.data.regtime),
        });
    }
    outf.sort(function (a, b) {
        if (a.level === b.level) {
            return a.uuid - b.uuid;
        }
        else {
            return b.level - a.level;
        }
    });
    let back = await s_game_1.default.allOut(ctx, outf, [sid, name]);
    await ctx.render('a_qfuser', back);
});
//# sourceMappingURL=s_qfuser.js.map