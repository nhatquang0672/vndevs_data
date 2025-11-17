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
const A_CodeModel_1 = require("../model/A_CodeModel");
const tool_1 = require("../../src/util/tool");
const game_1 = __importDefault(require("../../src/util/game"));
const ts_md5_1 = require("ts-md5");
const mongodb_1 = require("../../src/util/mongodb");
router.prefix('/s_code');
//登陆页面
router.all('/:token', async (ctx) => {
    let list = await A_CodeModel_1.a_CodeModel.getList();
    let back = await s_game_1.default.allOut(ctx, list);
    await ctx.render('a_code', back);
});
//删除
router.post('/delete/:token/:id', async (ctx) => {
    let { id } = ctx.params;
    await A_CodeModel_1.a_CodeModel.delete(id);
    let list = await A_CodeModel_1.a_CodeModel.getList();
    let back = await s_game_1.default.allOut(ctx, list);
    await ctx.render('a_code', back);
});
//添加
router.post('/add/:token', async (ctx) => {
    let back = await s_game_1.default.allOut(ctx);
    await ctx.render('a_code_add', back);
});
//添加保存
router.post('/addSave/:token', async (ctx) => {
    let params = tool_1.tool.getParamsAdmin(ctx);
    if (tool_1.tool.isJSON(params.items) == false) {
        let back = await s_game_1.default.allOut(ctx, params, { msg: "道具格式错误" });
        await ctx.render('a_mail_add', back);
        return;
    }
    params.etime = game_1.default.getTimeByStr(params.etime);
    params.kstime = game_1.default.getTimeByStr(params.kstime);
    params.jstime = game_1.default.getTimeByStr(params.jstime);
    params.lccount = params.lccount == "" ? 0 : parseInt(params.lccount);
    params.xdtime = game_1.default.getTimeByStr(params.xdtime);
    await A_CodeModel_1.a_CodeModel.insert(params);
    let back = await s_game_1.default.allOut(ctx);
    back.data = await A_CodeModel_1.a_CodeModel.getList();
    await ctx.render('a_code', back);
});
//补码编辑页
router.post('/buma/:token/:id/:title', async (ctx) => {
    let params = tool_1.tool.getParamsAdmin(ctx);
    let back = await s_game_1.default.allOut(ctx, { id: params.id, title: params.title });
    await ctx.render('a_code_buma', back);
});
//补码
router.post('/bumaAdd/:token/:id', async (ctx) => {
    let { id, addCount } = tool_1.tool.getParamsAdmin(ctx);
    let mas = [];
    for (let index = 0; index < addCount; index++) {
        let str = ts_md5_1.Md5.hashStr(id + game_1.default.getNowTime().toString() + index.toString() + game_1.default.rand(1, 99999)).toString();
        let key = str.substr(1, 8).toLowerCase();
        if (mas.indexOf(key) != -1) {
            continue;
        }
        mas.push(key);
    }
    let new0 = game_1.default.getNowTime();
    let sqls = [];
    for (const ma of mas) {
        sqls.push({
            id: id.toString(),
            ma: ma,
            time: new0
        });
    }
    await mongodb_1.dbSev.getDataDb().insertMany(A_CodeModel_1.a_CodeModel.tableMa, sqls);
    let list = await A_CodeModel_1.a_CodeModel.getList();
    let back = await s_game_1.default.allOut(ctx, list);
    await ctx.render('a_code', back);
});
//补码编辑页
router.post('/xiazai/:token/:id', async (ctx) => {
    let { id } = tool_1.tool.getParamsAdmin(ctx);
    let dbdata = await A_CodeModel_1.a_CodeModel.findOneById(id);
    let dbdatama = await A_CodeModel_1.a_CodeModel.findById(id);
    let outf = [];
    for (const val of dbdatama) {
        val.title = dbdata.title;
        val.qufu = dbdata.qufu;
        val.plat = dbdata.plat;
        val.type = dbdata.type;
        val.time = game_1.default.getDayTime(val.time);
        val.etime = val.etime == 0 ? "永久" : game_1.default.getDayTime(dbdata.etime);
        val.fuuid = val.fuuid == null ? "" : val.fuuid;
        val.count = dbdata.count;
        outf.push(val);
    }
    let list = await A_CodeModel_1.a_CodeModel.getList();
    let back = await s_game_1.default.allOut(ctx, list, outf);
    await ctx.render('a_code', back);
});
//# sourceMappingURL=s_code.js.map