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
const SevClubModel_1 = require("../../src/model/sev/SevClubModel");
const SevClubMemberModel_1 = require("../../src/model/sev/SevClubMemberModel");
const lock_1 = __importDefault(require("../../src/util/lock"));
const ActClubModel_1 = require("../../src/model/act/ActClubModel");
router.prefix('/s_sevClub');
router.all('/:token', async (ctx) => {
    let { clubid } = tool_1.tool.getParamsAdmin(ctx);
    let outf = {
        cinfo: [],
        mem: [],
    };
    if (clubid == "" || clubid == null) {
        let back = await s_game_1.default.allOut(ctx, outf, [clubid]);
        await ctx.render('a_sevClub', back);
        return;
    }
    let adminCtx = await tool_1.tool.ctxCreate('club', "10086");
    let sevClubModel = SevClubModel_1.SevClubModel.getInstance(adminCtx, clubid);
    let sevClub = await sevClubModel.getInfo();
    if (sevClub == null || sevClub.createTime <= 0) {
        let back = await s_game_1.default.allOut(ctx, outf, [clubid, "公会不存在"]);
        await ctx.render('a_sevClub', back);
        return;
    }
    outf.cinfo = [
        clubid,
        sevClub.name,
        sevClub.sid,
        sevClub.uuid,
        sevClub.notice,
        game_1.default.getTimeS(sevClub.createTime),
        sevClub.boss.unlock,
        sevClub.boss.open,
        sevClub.boss.hurt,
        sevClub.boss.kill
    ];
    let sevCluMemberbModel = SevClubMemberModel_1.SevClubMemberModel.getInstance(adminCtx, clubid);
    let sevCluMember = await sevCluMemberbModel.getOutPut();
    for (const fuuid in sevCluMember) {
        let post = "";
        if (sevClub.uuid == fuuid) {
            post = "会长";
        }
        outf.mem.push([
            post,
            fuuid,
            sevCluMember[fuuid].user.name,
            sevCluMember[fuuid].user.level,
            game_1.default.getTimeS(sevCluMember[fuuid].user.lastlogin),
            sevCluMember[fuuid].active7D
        ]);
    }
    let back = await s_game_1.default.allOut(ctx, outf, [clubid]);
    await ctx.render('a_sevClub', back);
});
//删除
router.post('/delete/:token/:clubid', async (ctx) => {
    let { clubid } = tool_1.tool.getParamsAdmin(ctx);
    let adminCtx = await tool_1.tool.ctxCreate('club', "10086");
    //仙盟锁
    await lock_1.default.setLock(adminCtx, "club", clubid);
    //仙盟
    let sevClubModel = SevClubModel_1.SevClubModel.getInstance(adminCtx, clubid);
    let sevClub = await sevClubModel.getInfo();
    //会长退出仙盟 执行解散机制
    let sevClubMemberModel = SevClubMemberModel_1.SevClubMemberModel.getInstance(adminCtx, clubid);
    let sevClubMember = await sevClubMemberModel.getInfo();
    for (const _fuuid in sevClubMember.list) {
        let actClubModel = ActClubModel_1.ActClubModel.getInstance(adminCtx, _fuuid);
        await actClubModel.outClub(2, sevClub.name);
    }
    //删除仙盟
    await sevClubModel.delete();
    await tool_1.tool.ctxUpdate(adminCtx);
    let outf = {
        cinfo: [],
        mem: [],
    };
    if (clubid == "" || clubid == null) {
        let back = await s_game_1.default.allOut(ctx, outf, [clubid]);
        await ctx.render('a_sevClub', back);
        return;
    }
    sevClub = await sevClubModel.getInfo();
    if (sevClub == null || sevClub.createTime <= 0) {
        let back = await s_game_1.default.allOut(ctx, outf, [clubid, "公会已解散"]);
        await ctx.render('a_sevClub', back);
        return;
    }
    outf.cinfo = [
        clubid,
        sevClub.name,
        sevClub.sid,
        sevClub.uuid,
        sevClub.notice,
        game_1.default.getTimeS(sevClub.createTime),
        sevClub.boss.unlock,
        sevClub.boss.open,
        sevClub.boss.hurt,
        sevClub.boss.kill
    ];
    let sevCluMemberbModel = SevClubMemberModel_1.SevClubMemberModel.getInstance(adminCtx, clubid);
    let sevCluMember = await sevCluMemberbModel.getOutPut();
    for (const fuuid in sevCluMember) {
        let post = "";
        if (sevClub.uuid == fuuid) {
            post = "会长";
        }
        outf.mem.push([
            post,
            fuuid,
            sevCluMember[fuuid].user.name,
            sevCluMember[fuuid].user.level,
            game_1.default.getTimeS(sevCluMember[fuuid].user.lastlogin),
            sevCluMember[fuuid].active7D
        ]);
    }
    let back = await s_game_1.default.allOut(ctx, outf, [clubid]);
    await ctx.render('a_sevClub', back);
});
//# sourceMappingURL=s_sevClub.js.map