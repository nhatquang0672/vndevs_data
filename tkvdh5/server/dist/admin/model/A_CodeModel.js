"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.a_CodeModel = exports.A_CodeModel = void 0;
const A_AModel_1 = require("./A_AModel");
const mongodb_1 = require("../../src/util/mongodb");
const game_1 = __importDefault(require("../../src/util/game"));
const ts_md5_1 = require("ts-md5");
/**
 * 兑换码模块
 */
class A_CodeModel extends A_AModel_1.A_AModel {
    constructor() {
        super(...arguments);
        this.table = "a_code";
        this.tableMa = "a_codeMa";
    }
    //初始化
    init() {
        return {
            id: "",
            type: "",
            plat: "all",
            qufu: "",
            title: "",
            etime: 0,
            items: [],
            count: 0,
            lccount: 0,
            kstime: 0,
            jstime: 0,
            xdtime: 0,
        };
    }
    //获取列表
    async getList() {
        let back = await mongodb_1.dbSev.getDataDb().find(this.table);
        let outf = [];
        for (const val of back) {
            val.etime = val.etime == 0 ? "永久" : game_1.default.getDayTime(val.etime);
            val.kstime = val.kstime == 0 ? "" : game_1.default.getDayTime(val.kstime);
            val.jstime = val.jstime == 0 ? "" : game_1.default.getDayTime(val.jstime);
            val.xdtime = val.xdtime == 0 ? "" : game_1.default.getDayTime(val.xdtime);
            outf.push(val);
        }
        return outf;
    }
    //后台添加
    async insert(params) {
        let id = await mongodb_1.dbSev.getDataDb().getNextId('A_CODE');
        let data = this.init();
        data.id = id.toString();
        data.title = params.title;
        data.plat = params.plat;
        data.qufu = params.qufu;
        data.type = params.type;
        data.count = 0;
        data.etime = isNaN(params.etime) ? 0 : params.etime;
        data.jstime = isNaN(params.jstime) ? 0 : params.jstime;
        data.kstime = isNaN(params.kstime) ? 0 : params.kstime;
        data.lccount = params.lccount;
        data.xdtime = isNaN(params.xdtime) ? 0 : params.xdtime;
        data.items = typeof params.items != "string" ? JSON.stringify(params.items) : params.items;
        await mongodb_1.dbSev.getDataDb().insert(this.table, data);
        let mas = [];
        if (params.teding != "") {
            mas = params.teding.split(",");
        }
        let maxLen = parseInt(params.count) - mas.length;
        for (let index = 0; index < maxLen; index++) {
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
                time: new0,
                fuuid: ""
            });
        }
        await mongodb_1.dbSev.getDataDb().insertMany(this.tableMa, sqls);
        return true;
    }
    //删除信息
    async delete(id) {
        let object = { id: id };
        await mongodb_1.dbSev.getDataDb().remove(this.tableMa, object, true);
        return await super.delete(id);
    }
    //通过id 获取码列表
    async findById(id) {
        let back = await mongodb_1.dbSev.getDataDb().find(this.tableMa, { id: id });
        return back;
    }
}
exports.A_CodeModel = A_CodeModel;
exports.a_CodeModel = new A_CodeModel();
//# sourceMappingURL=A_CodeModel.js.map