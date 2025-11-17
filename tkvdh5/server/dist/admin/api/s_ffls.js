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
const gameMethod_1 = require("../../common/gameMethod");
const mongodb_1 = require("../../src/util/mongodb");
const game_1 = __importDefault(require("../../src/util/game"));
const gameCfg_1 = __importDefault(require("../../common/gameCfg"));
router.prefix('/s_ffls');
router.all('/:token', async (ctx) => {
    let { uuids } = tool_1.tool.getParamsAdmin(ctx);
    let outf = [];
    if (gameMethod_1.gameMethod.isEmpty(uuids) == true) {
        let back = await s_game_1.default.allOut(ctx, outf);
        await ctx.render('a_ffls', back);
        return;
    }
    if (typeof uuids == "string") {
        uuids = JSON.parse(uuids);
    }
    //角色信息
    let dbuser = await mongodb_1.dbSev.getDataDb().find("user", { "id": { "$in": uuids } });
    let users = {};
    for (const user of dbuser) {
        if (uuids.indexOf(user.id) == -1) {
            continue;
        }
        users[user.id] = {
            uuid: user.id,
            level: user.data.level,
            rat: game_1.default.getTimeS(user.data.regtime),
            lat: game_1.default.getTimeS(user.data.lastlogin),
        };
    }
    //个人信息
    let dbact = await mongodb_1.dbSev.getDataDb().find("act", { "id": { "$in": uuids } });
    let acts = {};
    for (const act of dbact) {
        if (uuids.indexOf(act.id) == -1) {
            continue;
        }
        if (acts[act.id] == null) {
            acts[act.id] = { box: 0, boxLv: 0, pve: 0, pvejy: 0, lcMy: 0, lcF: 0, pvw: 0, isclub: 0, jjc: 0, dtNum: 0 };
        }
        if (act.kid == "actEquip") {
            acts[act.id]["box"] = act.data.box;
        }
        if (act.kid == "actBox") {
            acts[act.id]["boxLv"] = act.data.level;
        }
        if (act.kid == "actpvw") {
            acts[act.id]["pvw"] = act.data.histMax;
        }
        if (act.kid == "actClub") {
            let isclub = 0;
            if (act.data.itime > 0 || act.data.outClubTime > 0) {
                isclub = 1;
            }
            acts[act.id]["isclub"] = isclub;
        }
        if (act.kid == "actJjcInfo") {
            acts[act.id]["jjc"] = act.data.pkNum;
        }
        if (act.kid == "actDongTian") {
            acts[act.id]["lcMy"] = act.data.myCount;
            acts[act.id]["lcF"] = act.data.heCount;
            acts[act.id]["dtNum"] = act.data.dtNum;
            if (act.data != null && act.data.dtlv != null) {
                let dtCfg = gameCfg_1.default.dongtianDtlv.getItem(act.data.dtlv.toString());
                if (dtCfg != null) {
                    acts[act.id]["dtNum"] += dtCfg.worker;
                }
            }
        }
        if (act.kid == "actPveInfo") {
            acts[act.id]["pve"] = act.data.id;
        }
        if (act.kid == "actPveJy") {
            acts[act.id]["pvejy"] = act.data.id;
        }
    }
    let dbkind10 = await mongodb_1.dbSev.getDataDb().find("kind10", { "uuid": { "$in": uuids } });
    let kinds = {};
    for (const kind10 of dbkind10) {
        if (uuids.indexOf(kind10.uuid) == -1) {
            continue;
        }
        if (kind10.overAt <= 0) {
            continue;
        }
        if (kinds[kind10.uuid] == null) {
            kinds[kind10.uuid] = 0;
        }
        kinds[kind10.uuid] = Math.max(kinds[kind10.uuid], kind10.overAt);
    }
    for (const uuid of uuids) {
        outf.push({
            uuid: uuid,
            level: users[uuid] == null ? "缺失" : users[uuid].level,
            box: acts[uuid] == null ? "缺失" : acts[uuid]["box"],
            boxLv: acts[uuid] == null ? "缺失" : acts[uuid]["boxLv"],
            pve: acts[uuid] == null ? "缺失" : acts[uuid]["pve"],
            pvejy: acts[uuid] == null ? "缺失" : acts[uuid]["pvejy"],
            lcMy: acts[uuid] == null ? "缺失" : acts[uuid]["lcMy"],
            lcF: acts[uuid] == null ? "缺失" : acts[uuid]["lcF"],
            pvw: acts[uuid] == null ? "缺失" : acts[uuid]["pvw"],
            isclub: acts[uuid] == null ? "缺失" : acts[uuid]["isclub"],
            jjc: acts[uuid] == null ? "缺失" : acts[uuid]["jjc"],
            dtNum: acts[uuid] == null ? "缺失" : acts[uuid]["dtNum"],
            rat: users[uuid] == null ? "缺失" : users[uuid].rat,
            lat: users[uuid] == null ? "缺失" : users[uuid].lat,
            oat: kinds[uuid] == null ? "缺失" : game_1.default.getTimeS(kinds[uuid]),
        });
    }
    let back = await s_game_1.default.allOut(ctx, outf, [JSON.stringify(uuids)]);
    await ctx.render('a_ffls', back);
});
//# sourceMappingURL=s_ffls.js.map