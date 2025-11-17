"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_AModel = void 0;
const mongodb_1 = require("../../src/util/mongodb");
class A_AModel {
    //获取列表
    async getList() {
        let back = await mongodb_1.dbSev.getDataDb().find(this.table);
        return back;
    }
    //通过id
    async findOneById(id) {
        let back = await mongodb_1.dbSev.getDataDb().findOne(this.table, { id: id });
        return back;
    }
    //删除信息
    async delete(id) {
        let object = {
            id: id
        };
        let back = await mongodb_1.dbSev.getDataDb().remove(this.table, object);
        return back;
    }
    //更新
    async update(id, data) {
        await mongodb_1.dbSev.getDataDb().update(this.table, { id: id }, data);
        return true;
    }
}
exports.A_AModel = A_AModel;
//# sourceMappingURL=A_AModel.js.map