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
const game_1 = __importDefault(require("../../src/util/game"));
router.prefix('/s_gonghui');
router.all('/:token', async (ctx) => {
    let outf = { bossids: {}, qufu: {}, days: {} };
    let back1s = await mongodb_1.dbSev.getDataDb().find("sev", { "kid": "club" });
    for (const back1 of back1s) {
        if (back1.data.createTime <= 0) {
            continue; //
        }
        if (outf.qufu[back1.data.sid] == null) {
            outf.qufu[back1.data.sid] = {
                count: 0,
                boss: {}
            };
        }
        outf.qufu[back1.data.sid].count += 1;
        for (let index = 1; index <= back1.data.boss.unlock; index++) {
            if (outf.qufu[back1.data.sid].boss[index] == null) {
                outf.qufu[back1.data.sid].boss[index] = 0;
            }
            outf.qufu[back1.data.sid].boss[index] += 1;
            outf.bossids[index] = 1;
        }
    }
    // 1205	公会互助参与度		    每天进行公会互助人数，与活跃用户结合计算参与度
    // 1215	手动召唤的boss数量		每天各BOSS数量分布
    // 1220	自动召唤的boss数量		每天各BOSS数量分布
    // 1225	召唤的boss完成数量		每天各BOSS召唤的数量，以及完成率
    // 1235	每日公会BOSS参与度		每天进行挑战1次公会BOSS，与活跃用户结合计算参与度
    // 1240	使用boss挑战号角数量	每天各BOSS消耗的挑战号角数量
    let back2s = await mongodb_1.dbSev.getFlowDb().find("Smaidian_12");
    for (const back2 of back2s) {
        let dayid = game_1.default.getTodayId(back2.at);
        if (outf.days[dayid] == null) {
            outf.days[dayid] = { "1205": 0, "1215": {}, "1220": {}, "1225": {}, "1235": 0, "1240": {} };
        }
        if (back2.mdid == "1205" || back2.mdid == "1235") {
            outf.days[dayid][back2.mdid] += 1;
        }
        if (back2.mdid == "1215" || back2.mdid == "1220" || back2.mdid == "1225") {
            if (outf.days[dayid][back2.mdid][back2.cs[0]] == null) {
                outf.days[dayid][back2.mdid][back2.cs[0]] = 0;
            }
            outf.days[dayid][back2.mdid][back2.cs[0]] += 1;
        }
        if (back2.mdid == "1240") {
            if (outf.days[dayid][back2.mdid][back2.cs[0]] == null) {
                outf.days[dayid][back2.mdid][back2.cs[0]] = 0;
            }
            outf.days[dayid][back2.mdid][back2.cs[0]] += back2.cs[1];
        }
    }
    await ctx.render('a_gonghui', await s_game_1.default.allOut(ctx, outf, []));
});
//# sourceMappingURL=s_gonghui.js.map