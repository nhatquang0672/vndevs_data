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
const UserModel_1 = require("../../src/model/user/UserModel");
const lock_1 = __importDefault(require("../../src/util/lock"));
const SevClubModel_1 = require("../../src/model/sev/SevClubModel");
router.prefix('/s_sevClubs');
router.all('/:token', async (ctx) => {
    let { looksid } = tool_1.tool.getParamsAdmin(ctx);
    if (looksid == "" || looksid == null) {
        let back = await s_game_1.default.allOut(ctx, [], [looksid]);
        await ctx.render('a_sevClubs', back);
        return;
    }
    let sql = { "kid": "club" };
    if (looksid != "all") {
        sql = { "kid": "club", "data.sid": looksid };
    }
    let adminCtx = await tool_1.tool.ctxCreate('club', "10086");
    let outf = [];
    let clubs = await mongodb_1.dbSev.getDataDb().find("sev", sql);
    for (const club of clubs) {
        if (club.data.createTime == 0) {
            continue;
        }
        let fuserModel = UserModel_1.UserModel.getInstance(adminCtx, club.data.uuid);
        let fuser = await fuserModel.getInfo();
        outf.push({
            looksid: looksid,
            sid: club.data.sid,
            clubid: club.id,
            name: club.data.name,
            hzuuid: club.data.uuid,
            hzname: fuser.name == "" ? "初心者" + club.data.uuid : fuser.name,
            notice: club.data.notice,
        });
    }
    let back = await s_game_1.default.allOut(ctx, outf, [looksid]);
    await ctx.render('a_sevClubs', back);
});
//编辑
router.post('/notice/:token/:looksid', async (ctx) => {
    let { clubid, sid, notice, name, looksid } = tool_1.tool.getParamsAdmin(ctx);
    let outf = {
        looksid: looksid,
        clubid: clubid,
        sid: sid,
        name: name,
        notice: notice
    };
    let back = await s_game_1.default.allOut(ctx, outf);
    await ctx.render('a_sevClubs_notice', back);
});
//编辑 - 保存
router.post('/noticeSave/:token/:sid/:clubid', async (ctx) => {
    let { sid, clubid, name, notice } = tool_1.tool.getParamsAdmin(ctx);
    let adminCtx = await tool_1.tool.ctxCreate('club', "10086");
    await lock_1.default.setLock(adminCtx, "club", clubid);
    let sevClubModel = SevClubModel_1.SevClubModel.getInstance(adminCtx, clubid);
    let sevClub = await sevClubModel.getInfo();
    sevClub.notice = notice;
    sevClub.name = name;
    await sevClubModel.update(sevClub);
    await tool_1.tool.ctxUpdate(adminCtx);
    if (sid == "" || sid == null) {
        let back = await s_game_1.default.allOut(ctx, [], [sid]);
        await ctx.render('a_sevClubs', back);
        return;
    }
    let sql = { "kid": "club" };
    if (sid != "all") {
        sql = { "kid": "club", "data.sid": sid };
    }
    let outf = [];
    let clubs = await mongodb_1.dbSev.getDataDb().find("sev", sql);
    for (const club of clubs) {
        if (club.data.createTime == 0) {
            continue;
        }
        let fuserModel = UserModel_1.UserModel.getInstance(adminCtx, club.data.uuid);
        let fuser = await fuserModel.getInfo();
        outf.push({
            looksid: sid,
            sid: club.data.sid,
            clubid: club.id,
            name: club.data.name,
            hzuuid: club.data.uuid,
            hzname: fuser.name == "" ? "初心者" + club.data.uuid : fuser.name,
            notice: club.data.notice,
        });
    }
    let back = await s_game_1.default.allOut(ctx, outf, [sid]);
    await ctx.render('a_sevClubs', back);
});
//# sourceMappingURL=s_sevClubs.js.map