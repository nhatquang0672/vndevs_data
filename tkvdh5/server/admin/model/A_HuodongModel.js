"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.a_HuodongModel = exports.A_HuodongModel = void 0;
const A_AModel_1 = require("./A_AModel");
const mongodb_1 = require("../../src/util/mongodb");
const game_1 = __importDefault(require("../../src/util/game"));
/**
 *   活动模块
 */
class A_HuodongModel extends A_AModel_1.A_AModel {
    constructor() {
        super(...arguments);
        this.table = "a_huodong";
    }
    //初始化
    init() {
        return {
            id: "",
            qufu: "",
            key: "",
            hdcid: "",
            msg: "",
            s_qf: 0,
            e_qf: 0,
            s_at: 0,
            e_at: 0,
            value: ""
        };
    }
    //获取列表
    async getList(sql = {}) {
        let back = await mongodb_1.dbSev.getDataDb().find(this.table, sql);
        let outf = [];
        for (const val of back) {
            val.s_at = val.s_at == 0 ? "" : game_1.default.getDayTime(val.s_at);
            val.e_at = val.e_at == 0 ? "" : game_1.default.getDayTime(val.e_at);
            outf.push(val);
        }
        return outf;
    }
    //后台添加
    async insert(params) {
        let id = await mongodb_1.dbSev.getDataDb().getNextId('A_HUODONG');
        let data = this.init();
        data.id = id.toString();
        data.key = params.key;
        data.qufu = params.qufu;
        data.key = params.key;
        data.hdcid = params.hdcid;
        data.msg = params.msg;
        data.s_qf = params.s_qf;
        data.e_qf = params.e_qf;
        data.s_at = isNaN(params.s_at) ? 0 : params.s_at;
        data.e_at = isNaN(params.e_at) ? 0 : params.e_at;
        data.value = params.value;
        await mongodb_1.dbSev.getDataDb().insert(this.table, data);
        await mongodb_1.dbSev.getDataDb().getNextId('A_VER');
        return true;
    }
    //删除信息
    async delete(id) {
        let back = await mongodb_1.dbSev.getDataDb().remove(this.table, { "id": id });
        await mongodb_1.dbSev.getDataDb().getNextId('A_VER');
        return back;
    }
    //更新
    async update(id, data) {
        await mongodb_1.dbSev.getDataDb().update(this.table, { id: id }, data);
        await mongodb_1.dbSev.getDataDb().getNextId('A_VER');
        return true;
    }
}
exports.A_HuodongModel = A_HuodongModel;
exports.a_HuodongModel = new A_HuodongModel();
//# sourceMappingURL=A_HuodongModel.js.map