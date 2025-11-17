"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.a_QufuModel = exports.A_QufuModel = void 0;
const A_AModel_1 = require("./A_AModel");
const mongodb_1 = require("../../src/util/mongodb");
const game_1 = __importDefault(require("../../src/util/game"));
/**
 *   区服模块
 */
class A_QufuModel extends A_AModel_1.A_AModel {
    constructor() {
        super(...arguments);
        this.table = "a_qufu";
    }
    //初始化
    init() {
        return {
            id: "",
            sid: "",
            name: "",
            openAt: 0,
            status: "",
            heid: "" //合服ID
        };
    }
    //获取列表
    async getList() {
        let back = await mongodb_1.dbSev.getDataDb().find(this.table);
        let outf = [];
        for (const val of back) {
            val.openAt = game_1.default.getDayTime(val.openAt);
            outf.push(val);
        }
        return outf;
    }
    //后台添加
    async insert(params) {
        let id = await mongodb_1.dbSev.getDataDb().getNextId('A_QUFU');
        let data = this.init();
        data.id = id.toString();
        data.sid = params.sid;
        data.name = params.name;
        data.openAt = params.openAt;
        data.status = params.status;
        data.heid = params.heid;
        await mongodb_1.dbSev.getDataDb().insert(this.table, data);
        await mongodb_1.dbSev.getDataDb().getNextId('A_VER');
        return true;
    }
    //删除信息
    async delete(id) {
        let object = {
            id: id
        };
        let back = await mongodb_1.dbSev.getDataDb().remove(this.table, object);
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
exports.A_QufuModel = A_QufuModel;
exports.a_QufuModel = new A_QufuModel();
//# sourceMappingURL=A_QufuModel.js.map