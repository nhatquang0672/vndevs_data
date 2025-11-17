"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.a_UserModel = exports.A_UserModel = void 0;
const mongodb_1 = require("../../src/util/mongodb");
const game_1 = __importDefault(require("../../src/util/game"));
const ts_md5_1 = require("ts-md5");
const A_AModel_1 = require("./A_AModel");
/**
 * 账号模块
 */
class A_UserModel extends A_AModel_1.A_AModel {
    constructor() {
        super(...arguments);
        this.table = "a_user";
    }
    //初始化
    init() {
        return {
            id: "",
            account: "",
            pwd: "",
            name: "",
            wx: "",
            mobile: "",
            department: "",
            status: "",
            createAt: 0,
            ip: ""
        };
    }
    //申请账号
    async apply(ctx, account, pwd) {
        if (account == "" || account == null) {
            ctx.throw('账号不能为空');
        }
        let back = await mongodb_1.dbSev.getDataDb().findOne(this.table, { account: account });
        if (back != null && back.pwd != pwd) {
            ctx.throw('密码错误');
        }
        if (back != null) {
            if (back.status != null) {
                ctx.throw(back.status);
            }
        }
        let id = await mongodb_1.dbSev.getDataDb().getNextId('A_USER');
        let insert = this.init();
        insert.id = id.toString();
        insert.account = account;
        insert.pwd = pwd;
        insert.status = "已申请";
        insert.createAt = game_1.default.getNowTime();
        await mongodb_1.dbSev.getDataDb().insert(this.table, insert);
        return true;
    }
    //生成token
    async createToken(account, ip) {
        let token = ts_md5_1.Md5.hashStr(account + game_1.default.getNowTime() + game_1.default.rand(1, 10000)).toString();
        await mongodb_1.dbSev.getDataDb().update(this.table, { account: account }, {
            token: token,
            tokenAt: game_1.default.getNowTime() + 3600 * 8,
            ip: ip
        });
        return token;
    }
    //token是否过期
    async tokenPass(token) {
        let back = await mongodb_1.dbSev.getDataDb().findOne(this.table, { token: token });
        if (back == null || back.tokenAt < game_1.default.getNowTime()) {
            return this.init();
        }
        await mongodb_1.dbSev.getDataDb().update(this.table, { token: token }, {
            tokenAt: game_1.default.getNowTime() + 3600 * 8 //8小时过期
        });
        return back;
    }
    //通过账号密码查询
    async findOneByAccount(account, pwd) {
        let object = {
            account: account,
            pwd: pwd
        };
        let back = await mongodb_1.dbSev.getDataDb().findOne(this.table, object);
        return back;
    }
}
exports.A_UserModel = A_UserModel;
exports.a_UserModel = new A_UserModel();
//# sourceMappingURL=A_UserModel.js.map