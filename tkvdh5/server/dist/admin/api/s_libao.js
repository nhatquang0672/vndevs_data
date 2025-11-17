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
router.prefix('/s_libao');
router.all('/:token', async (ctx) => {
    let { stime, etime } = tool_1.tool.getParamsAdmin(ctx);
    if (stime == null || stime == "" || etime == null || etime == "") {
        await ctx.render('a_libao', await s_game_1.default.allOut(ctx, {}, [stime, etime]));
    }
    let outf = {
        days: [],
        shopdc: {},
        list: {} //档次对应信息
    };
    let _stime = game_1.default.getTimeByStr(stime);
    let _etime = game_1.default.getTimeByStr(etime);
    let passDay = game_1.default.passDayByTimes(_stime, _etime);
    //时间
    for (let index = 0; index < passDay; index++) {
        let todayId = game_1.default.getTodayId(_stime + index * 86400);
        outf.days.push(todayId);
    }
    outf.shopdc["600"] = "新人礼包";
    outf.shopdc["605"] = "特惠礼包_直购";
    outf.shopdc["606"] = "特惠礼包_钻石";
    outf.shopdc["610"] = "每日礼包";
    outf.shopdc["615"] = "卡牌基金";
    outf.shopdc["620"] = "角色基金";
    outf.shopdc["625"] = "特权卡_月卡";
    outf.shopdc["626"] = "特权卡_至尊";
    outf.shopdc["630"] = "限时福利-圣器礼包";
    outf.shopdc["635"] = "限时福利-翅膀礼包";
    outf.shopdc["640"] = "限时福利-法阵礼包";
    outf.shopdc["645"] = "洞天建木礼包";
    for (const key in outf.shopdc) {
        outf.list[key] = {};
        for (const dayId of outf.days) {
            outf.list[key][dayId] = [0, 0];
        }
    }
    //展示
    let backs = await mongodb_1.dbSev.getFlowDb().find("Smaidian_6");
    for (const back of backs) {
        let _todayid = game_1.default.getTodayId(back.at);
        if (outf.days.indexOf(_todayid) == -1) {
            continue;
        }
        if (outf.list[back.mdid] == null) {
            continue;
        }
        if (outf.list[back.mdid][_todayid] == null) {
            continue;
        }
        outf.list[back.mdid][_todayid][1] += 1;
    }
    //购买
    let min0 = game_1.default.getToDay_0(_stime);
    let max0 = game_1.default.getToDay_0(_etime) + 86400;
    let back2s = await mongodb_1.dbSev.getDataDb().find("kind10", { "overAt": { $gte: min0, $lt: max0 } });
    for (const back2 of back2s) {
        let _todayid = game_1.default.getTodayId(back2.overAt);
        if (outf.days.indexOf(_todayid) == -1) {
            continue;
        }
        let mdid = "0";
        if (back2.kid == "hdGrowthFund" && back2.hdcid == "1") {
            mdid = "615";
        }
        if (back2.kid == "hdGrowthFund" && back2.hdcid == "2") {
            mdid = "620";
        }
        if (back2.kid == "hdNew") {
            mdid = "600";
        }
        if (back2.kid == "hdSpeGift" && back2.hdcid == "1") {
            mdid = "605";
        }
        if (back2.kid == "hdSpeGift" && back2.hdcid == "2") {
            mdid = "606";
        }
        if (back2.kid == "hdSpeGift" && back2.hdcid == "3") {
            mdid = "610";
        }
        if (back2.kid == "hdPriCard" && back2.hdcid == "moon") {
            mdid = "625";
        }
        if (back2.kid == "hdPriCard" && back2.hdcid == "fever") {
            mdid = "626";
        }
        if (back2.kid == "hdTimeBen" && back2.dc == "shengqi") {
            mdid = "630";
        }
        if (back2.kid == "hdTimeBen" && back2.dc == "chibang") {
            mdid = "635";
        }
        if (back2.kid == "hdTimeBen" && back2.dc == "fazhen") {
            mdid = "640";
        }
        if (back2.kid == "actDongTian") {
            mdid = "645";
        }
        if (mdid == "0") {
            continue;
        }
        if (outf.list[mdid] == null) {
            continue;
        }
        if (outf.list[mdid][_todayid] == null) {
            continue;
        }
        outf.list[mdid][_todayid][0] += 1;
    }
    for (const mdid in outf.list) {
        for (const _todayid in outf.list[mdid]) {
            outf.list[mdid][_todayid] = outf.list[mdid][_todayid][0] + '/' + outf.list[mdid][_todayid][1];
        }
    }
    await ctx.render('a_libao', await s_game_1.default.allOut(ctx, outf, [stime, etime]));
});
//# sourceMappingURL=s_libao.js.map