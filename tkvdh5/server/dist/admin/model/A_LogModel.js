"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.a_LogModel = exports.A_LogModel = void 0;
const mongodb_1 = require("../../src/util/mongodb");
const game_1 = __importDefault(require("../../src/util/game"));
const A_AModel_1 = require("./A_AModel");
const tool_1 = require("../../src/util/tool");
/**
 * 后台日志模块
 */
class A_LogModel extends A_AModel_1.A_AModel {
    constructor() {
        super(...arguments);
        this.table = "a_adminLog";
    }
    //初始化
    init() {
        return {
            account: "",
            url: "",
            cs: null,
            ip: "",
            doAt: 0 //操作时间
        };
    }
    //后台添加
    async insert(ctx, user) {
        let data = this.init();
        data.account = user.account;
        data.url = ctx.url;
        data.cs = tool_1.tool.getParamsAdmin(ctx);
        data.ip = tool_1.tool.getClientIP(ctx);
        data.doAt = game_1.default.getNowTime();
        await mongodb_1.dbSev.getFlowDb().insert(this.table, data);
        return true;
    }
}
exports.A_LogModel = A_LogModel;
exports.a_LogModel = new A_LogModel();
//# sourceMappingURL=A_LogModel.js.map