"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.a_MailModel = exports.A_MailModel = void 0;
const A_AModel_1 = require("./A_AModel");
const mongodb_1 = require("../../src/util/mongodb");
const game_1 = __importDefault(require("../../src/util/game"));
/**
 * 邮件模块
 */
class A_MailModel extends A_AModel_1.A_AModel {
    constructor() {
        super(...arguments);
        this.table = "a_mail";
    }
    //初始化
    init() {
        return {
            id: "",
            type: 1,
            title: "",
            content: "",
            geren: "",
            qufu: "",
            regtime: 0,
            items: "",
            etime: 0,
        };
    }
    //获取列表
    async getList() {
        let back = await mongodb_1.dbSev.getDataDb().find(this.table);
        let outf = [];
        for (const val of back) {
            val.etime = val.etime == 0 ? "永久" : game_1.default.getDayTime(val.etime);
            val.regtime = val.regtime == 0 ? "无限制" : game_1.default.getDayTime(val.regtime);
            outf.push(val);
        }
        return outf;
    }
    //后台添加
    async insert(params) {
        let id = await mongodb_1.dbSev.getDataDb().getNextId('A_MAIL');
        let geren = params.geren;
        geren = geren.replace('/r/n', '');
        let data = this.init();
        data.id = id.toString();
        data.title = params.title;
        data.content = params.content;
        data.geren = geren;
        data.qufu = params.qufu;
        data.regtime = isNaN(params.regtime) ? 0 : params.regtime;
        data.type = params.type == null ? 1 : parseInt(params.type);
        data.items = typeof params.items != "string" ? JSON.stringify(params.items) : params.items;
        data.etime = isNaN(params.etime) ? 0 : params.etime;
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
exports.A_MailModel = A_MailModel;
exports.a_MailModel = new A_MailModel();
//# sourceMappingURL=A_MailModel.js.map