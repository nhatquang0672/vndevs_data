"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.a_SettingModel = exports.A_SettingModel = void 0;
const A_AModel_1 = require("./A_AModel");
const mongodb_1 = require("../../src/util/mongodb");
/**
 *   活动模块
 */
class A_SettingModel extends A_AModel_1.A_AModel {
    constructor() {
        super(...arguments);
        this.table = "a_setting";
    }
    //初始化
    init() {
        return {
            id: "",
            qufu: "",
            key: "",
            msg: "",
            value: ""
        };
    }
    //获取列表
    async getList() {
        let back = await mongodb_1.dbSev.getDataDb().find(this.table);
        return back;
    }
    //后台添加
    async insert(params) {
        let id = await mongodb_1.dbSev.getDataDb().getNextId('A_SETTING');
        let data = this.init();
        data.id = id.toString();
        data.qufu = params.qufu;
        data.key = params.key;
        data.msg = params.msg;
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
exports.A_SettingModel = A_SettingModel;
exports.a_SettingModel = new A_SettingModel();
//# sourceMappingURL=A_SettingModel.js.map