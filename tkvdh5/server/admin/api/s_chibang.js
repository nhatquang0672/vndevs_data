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
const gameCfg_1 = __importDefault(require("../../common/gameCfg"));
const mongodb_1 = require("../../src/util/mongodb");
router.prefix('/s_chibang');
router.all('/:token', async (ctx) => {
    let cblv = {};
    let cfgcblvpool = gameCfg_1.default.chibangLevel.pool;
    for (const key in cfgcblvpool) {
        cblv[cfgcblvpool[key].id] = [cfgcblvpool[key].step, cfgcblvpool[key].level, 0];
    }
    let hascb = { "0": 0 }; //多少个翅膀：人数
    let cbinfo = {}; //翅膀ID：【名字，拥有的人数，穿戴人数】
    let cfgcbpool = gameCfg_1.default.chibangInfo.pool;
    for (const key in cfgcbpool) {
        cbinfo[cfgcbpool[key].id] = [cfgcbpool[key].name, 0, 0];
        hascb[cfgcbpool[key].id] = 0;
    }
    let backs = await mongodb_1.dbSev.getDataDb().find("act", { "kid": "actChiBang" });
    for (const back of backs) {
        if (back.data.hh == "") {
            continue;
        }
        if (cblv[back.data.id] != null) {
            cblv[back.data.id][2] += 1;
        }
        hascb[back.data.hhList.length] += 1;
        for (const hh of back.data.hhList) {
            cbinfo[hh][1] += 1;
        }
        if (cbinfo[back.data.hh] != null) {
            cbinfo[back.data.hh][2] += 1;
        }
    }
    let outf = [];
    let keys1 = Object.keys(cblv);
    let keys3 = Object.keys(cbinfo);
    let maxLeng = keys1.length;
    for (let index = 0; index < maxLeng; index++) {
        let key1 = keys1[index];
        let _outf = [];
        _outf[0] = cblv[key1][0] + "_" + cblv[key1][1];
        _outf[1] = cblv[key1][2];
        if (hascb[index] != null) {
            _outf[2] = index;
            _outf[3] = hascb[index];
        }
        else {
            _outf[2] = "";
            _outf[3] = "";
        }
        if (keys3[index] != null) {
            let key3 = keys3[index];
            _outf[4] = key3;
            _outf[5] = cbinfo[key3][0];
            _outf[6] = cbinfo[key3][1];
            _outf[7] = cbinfo[key3][2];
        }
        else {
            _outf[4] = "";
            _outf[5] = "";
            _outf[6] = "";
            _outf[7] = "";
        }
        outf.push(_outf);
    }
    let back = await s_game_1.default.allOut(ctx, outf, []);
    await ctx.render('a_chibang', back);
});
//# sourceMappingURL=s_chibang.js.map