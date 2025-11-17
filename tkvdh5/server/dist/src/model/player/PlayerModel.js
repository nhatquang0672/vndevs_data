"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerModel = void 0;
//继承于基类
const mongodb_1 = require("../../util/mongodb");
const AModel_1 = require("../AModel");
const UserModel_1 = require("../user/UserModel");
const ts_md5_1 = require("ts-md5");
const game_1 = __importDefault(require("../../util/game"));
const master_1 = require("../../util/master");
const setting_1 = __importDefault(require("../../crontab/setting"));
const gameMethod_1 = require("../../../common/gameMethod");
class PlayerModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "player"; //表名
        this.kid = "playerInfo"; //用于存储key 和  输出1级key
        this.outIsAu = false; //下发数据是否用au下发
        this.dType = master_1.DataType.player;
    }
    //单例模式
    static getInstance(ctx, uuid, hdcid = "1") {
        let dlKey = this.name + "_" + uuid + "_" + hdcid; //单例模式key
        if (!ctx.state.model[dlKey]) {
            ctx.state.model[dlKey] = new this(ctx, uuid, hdcid);
        }
        return ctx.state.model[dlKey];
    }
    outKey2() {
        return ""; //输出2级key
    }
    //初始化
    init() {
        return {
            sid: setting_1.default.getQufuNewId(),
            list: {},
            token: "",
            invuuid: "",
            pid: "",
            qdtype: "",
            lastlogin: this.ctx.state.newTime,
            regtime: this.ctx.state.newTime,
        };
    }
    async getOutPut() {
        let actInfo = await this.getInfo();
        let list = {};
        for (const _sid in actInfo.list) {
            let _uuid = actInfo.list[_sid].uuid;
            let usermodel = UserModel_1.UserModel.getInstance(this.ctx, _uuid);
            let userInfo = await usermodel.getInfo();
            list[_sid] = {
                uuid: _uuid,
                level: userInfo.level,
                lastlogin: userInfo.lastlogin //最后一次登录时间
            };
        }
        return {
            uid: this.id,
            sid: actInfo.sid,
            list: list,
            token: actInfo.token,
        };
    }
    /**
     * 更新账号信息  返回 uuid
     * @param sid
     * @param ip
     */
    async doInit(sid) {
        let actInfo = await this.getInfo();
        actInfo.sid = sid;
        if (actInfo.list[sid] == null) {
            if (setting_1.default.getQufus()[sid].suofu == 1) {
                this.ctx.throw("已经锁服,不能在此服创建新角色");
            }
            //创建uuid
            let uuid = await mongodb_1.dbSev.getDataDb().getNextId("UUID");
            actInfo.list[sid] = {
                uuid: uuid.toString(),
            };
            this.ctx.state.uuid = uuid; //角色ID 赋值
            this.ctx.state.pid = actInfo.pid; //赋值pid
            //创建uuid
            let userModel = UserModel_1.UserModel.getInstance(this.ctx, uuid.toString());
            await userModel.doInit(this.id, uuid.toString(), sid);
        }
        await this.update(actInfo);
        return actInfo.list[sid].uuid;
    }
    /**
     * 重置token
     */
    async resetToken() {
        let actInfo = await this.getInfo();
        actInfo.token = ts_md5_1.Md5.hashStr(this.id + this.ctx.state.newTime + game_1.default.rand(1, 10000)).toString();
        await this.update(actInfo);
    }
    /**
     * 设置包ID
     */
    async setPid(pid, qdtype) {
        let actInfo = await this.getInfo();
        if (actInfo.pid == null || actInfo.pid == "") {
            actInfo.pid = pid;
            actInfo.qdtype = qdtype;
            await this.update(actInfo);
        }
    }
    /**
     * 检查token
     */
    async checkToken(token) {
        if (token != "000") {
            let actInfo = await this.getInfo();
            if (actInfo.token != token) {
                this.ctx.throw("uid_token过期,请重新登陆");
            }
        }
    }
    /**
     * 设置SID
     */
    async setSid(sid) {
        let actInfo = await this.getInfo();
        if (actInfo.list[sid] == null) {
            if (setting_1.default.getQufus()[sid] == null) {
                this.ctx.throw("指定区服错误");
            }
            if (setting_1.default.getQufus()[sid].suofu == 1) {
                this.ctx.throw("已经锁服,不能在此服创建新角色");
            }
        }
        actInfo.sid = sid;
        await this.update(actInfo);
    }
    /**
     * 设置Lastlogin  一天更新一次
     */
    async setLastlogin() {
        let actInfo = await this.getInfo();
        actInfo.lastlogin = this.ctx.state.newTime;
        await this.update(actInfo);
    }
    /**
     * 设置邀请者
     */
    async setInvite(invuuid) {
        let actInfo = await this.getInfo();
        if (gameMethod_1.gameMethod.isEmpty(actInfo.invuuid)) {
            if (gameMethod_1.gameMethod.isEmpty(invuuid)) {
                invuuid = "no";
            }
            actInfo.invuuid = invuuid;
            await this.update(actInfo);
        }
        //邀请者 已存在 不再设置
    }
}
exports.PlayerModel = PlayerModel;
//# sourceMappingURL=PlayerModel.js.map