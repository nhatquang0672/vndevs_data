"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tool = void 0;
const mongodb_1 = require("./mongodb");
const master_1 = require("./master");
const game_1 = __importDefault(require("./game"));
const os_1 = __importDefault(require("os"));
const gameMethod_1 = require("../../common/gameMethod");
const request = __importStar(require("request"));
const setting_1 = __importDefault(require("../crontab/setting"));
const lock_1 = __importDefault(require("./lock"));
const UserModel_1 = require("../model/user/UserModel");
const gameCfg_1 = __importDefault(require("../../common/gameCfg"));
const PlayerModel_1 = require("../model/player/PlayerModel");
const YlWechat_1 = __importDefault(require("../sdk/YlWechat"));
/**
 * 工具类函数
 */
class Tool {
    constructor() {
        /**
         * 根据 uid 获取 账号信息
         * @param ctx  CTX
         */
        this.openIdByUid = {};
        this.localIp = "";
    }
    isJSON(str) {
        if (typeof str == "string") {
            try {
                let obj = JSON.parse(str);
                if (typeof obj == "object" && obj) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (e) {
                return false;
            }
        }
        return false;
    }
    /**
     * 获取服务器配置
     */
    getServerCfg() {
        let config = require(`../../config/config.json`);
        if (config.mongoDb == null) {
            console.error("---服务器配置mongoDb_err--");
            process.exit(1);
        }
        if (config.redis == null) {
            console.error("---服务器配置redis_err--");
            process.exit(1);
        }
        if (config.adminPort == null) {
            console.error("---服务器配置adminPort_err--");
            process.exit(1);
        }
        if (config.gamePort == null) {
            console.error("---服务器配置gamePort_err--");
            process.exit(1);
        }
        return config;
    }
    /**
     * 是不是主服务器IP
     */
    isZhuIp() {
        let ip1 = exports.tool.getServerCfg().server[0].host;
        let localIp = exports.tool.getLockIp();
        if (ip1 == localIp) {
            return true;
        }
        return false;
    }
    //数据库连接
    async dbLink() {
        //连接数据库
        if ((await mongodb_1.dbSev.init()) != true) {
            console.log("---数据库连接失败--");
            //服务器关闭
            return false; //process.exit(1)
        }
        console.log("---数据库连接完成2--");
        return true;
    }
    //数据库 自增字段检查
    async mongoTableCount() {
        //其他游戏后台业务表 判断ID是否存在
        await this._gameTableCount("A_USER", 1);
        await this._gameTableCount("A_MAIL", 1);
        await this._gameTableCount("A_QUFU", 1);
        await this._gameTableCount("A_CODE", 1);
        await this._gameTableCount("A_HUODONG", 1);
        await this._gameTableCount("A_SETTING", 1);
        //其他游戏业务表 判断ID是否存在
        await this._gameTableCount("UID", 10000000);
        await this._gameTableCount("UUID", 100000);
        await this._gameTableCount("CLUBID", 1000);
        await this._gameTableCount("MAIL", 100);
        await this._gameTableCount("KIND10_ID", 10000);
        await this._gameTableCount("KIND11_ID", 10000);
        //setting 版本号
        await this._gameTableCount("A_VER", 1);
        await this._gameTableCount("A_HDVER", 1);
        //服务器检测数据库是否正常
        await this._gameTableCount("FORK_ID", 1);
        console.log("自增字段检查");
    }
    async _gameTableCount(keyname, min) {
        let rest = await mongodb_1.dbSev.getDataDb().findOne("table_count", { name: keyname });
        if (gameMethod_1.gameMethod.isEmpty(rest)) {
            await mongodb_1.dbSev.getDataDb().update("table_count", { name: keyname }, { points: min }, true);
        }
    }
    async getTableCount(keyname) {
        let rest = await mongodb_1.dbSev.getDataDb().findOne("table_count", { name: keyname });
        if (rest == null) {
            return -1;
        }
        return rest.points;
    }
    //游戏业务
    async mongoIndex(type) {
        if (type == 0) {
            return;
        }
        let dbs = {
            a_mail: [{ id: 1 }, { etime: 1 }],
            a_qufu: [{ id: 1 }],
            a_huodong: [{ key: 1 }, { hdcid: 1 }],
            a_huodongXun: [{ key: 1 }],
            a_setting: [{ key: 1 }],
            a_user: [{ id: 1 }],
            a_code: [{ id: 1 }],
            a_codeMa: [{ id: 1 }, { ma: 1 }, { fuuid: 1 }],
            hefu_hd: [{ zuid: 1 }],
            putong_hd: [{ sid: 1, zuid: 1 }],
            sys_setting: [{ eAt: 1 }, { sid: 1, kid: 1, hdcid: 1 }],
            a_settingCache: [{ kid: 1 }],
            loginPlatform: [{ openId: 1 }, { uid: 1 }, { time: 1 }, { sfz: 1 }],
            plat: [{ openid: 1 }, { pid: 1, openid: 1 }],
            table_count: [{ name: 1 }],
            kind10: [{ orderId: 1 }, { sid: 1 }, { overAt: 1 }, { uuid: 1, overAt: 1 }, { uuid: 1 }, { platOrderId: 1 }],
            kind11: [{ orderId: 1 }, { overAt: 1 }, { uuid: 1, overAt: 1 }],
            register: [{ account: 1 }, { openid: 1 }],
            timer: [{ doAt: 1, isOver: 1 }, { doAt: 1 }, { kid: 1 }, { sid: 1, kid: 1, hdcid: 1, hid: 1 }],
            act: [{ id: 1, kid: 1, hdcid: 1 }, { kid: 1 }],
            hd: [{ id: 1, kid: 1, hdcid: 1 }],
            mail: [{ id: 1, kid: 1, hdcid: 1 }, { "data.dts": 1 }],
            dtNpc: [{ id: 1, kid: 1, hdcid: 1 }],
            user: [{ id: 1, kid: 1, hdcid: 1 }, { "data.lastlogin": 1 }, { "id": 1 }, { "data.sid": 1 }, { "data.level": 1 }],
            staff: [{ id: 1, kid: 1, hdcid: 1 }],
            build: [{ id: 1, kid: 1, hdcid: 1 }],
            chat: [{ id: 1, kid: 1, hdcid: 1 }, { id: 1 }, { kid: 1 }, { hdcid: 1 }],
            player: [{ id: 1, kid: 1, hdcid: 1 }],
            sev: [{ id: 1, kid: 1, hdcid: 1 }, { kid: 1, "data.sid": 1 }, { kid: 1 }],
            clubname: [{ iname: 1 }],
            ylWechat: [{ openId: 1 }],
            tb_kind11: [{ openid: 1 }],
            tb_task: [{ openId: 1, actionId: 1 }],
        };
        let tables = [];
        let all = await mongodb_1.dbSev.getDataDb().collections();
        if (all == null) {
            return;
        }
        for (const val of all) {
            tables.push(val.name);
        }
        for (const table in dbs) {
            if (tables.indexOf(table) == -1) {
                continue;
            }
            if (type == 2) {
                let ok = await mongodb_1.dbSev.getDataDb().indexes(table);
                if (ok.length > 1) {
                    // _id 默认一个索引
                    continue;
                }
            }
            if (type == 1) {
                //删除索引
                await mongodb_1.dbSev.getDataDb().dropIndexes(table);
            }
            if (dbs[table].length < 1) {
                continue; //不需要索引
            }
            for (const val of dbs[table]) {
                //添加索引
                await mongodb_1.dbSev.getDataDb().createIndexes(table, val);
            }
        }
        console.log("=======索引 结束===", type);
    }
    //游戏流水
    async mongoFlow(type) {
        if (type == 0) {
            return;
        }
        let dbs = {
            a_adminLog: [{ account: 1 }],
            flow: [{ ber: 1 }, { url: 1 }, { type: 1 }, { kind: 1 }, { id: 1 }, { time: 1 }],
            flow1: [{ ber: 1 }, { url: 1 }, { type: 1 }, { kind: 1 }, { id: 1 }, { time: 1 }],
            serverError: [{ url: 1 }],
            clientError: [{ url: 1 }],
            tongjiAct: [{ key: 1 }],
            LoginDown: [{ uuid: 1 }, { dAt: 1 }],
            Cmaidian: [],
            Smaidian_1: [{ at: 1 }],
            Smaidian_2: [{ at: 1 }],
            Smaidian_3: [{ at: 1 }],
            Smaidian_4: [{ at: 1 }],
            Smaidian_5: [{ at: 1 }],
            Smaidian_6: [{ at: 1 }],
            Smaidian_7: [{ at: 1 }],
            Smaidian_8: [{ at: 1 }],
            Smaidian_9: [{ at: 1 }],
            Smaidian_10: [{ at: 1 }],
            Smaidian_11: [{ at: 1 }],
            Smaidian_12: [{ at: 1 }],
            Smaidian_13: [{ at: 1 }],
            Smaidian_14: [{ at: 1 }],
            Smaidian_15: [{ at: 1 }],
            Smaidian_16: [{ at: 1 }],
            Smaidian_17: [{ at: 1 }],
            Smaidian_18: [{ at: 1 }],
            Smaidian_99: [{ at: 1 }, { sid: 1, at: 1 }],
            Smaidian_atk: [{ uuid: 1 }, { heid: 1 }],
            fight_start: [{ uuid: 1, time: 1 }],
        };
        let tables = [];
        let all = await mongodb_1.dbSev.getFlowDb().collections();
        if (all == null) {
            return;
        }
        for (const val of all) {
            tables.push(val.name);
        }
        for (const table in dbs) {
            if (tables.indexOf(table) == -1) {
                continue;
            }
            if (type == 2) {
                let ok = await mongodb_1.dbSev.getFlowDb().indexes(table);
                if (ok.length > 1) {
                    // _id 默认一个索引
                    continue;
                }
            }
            if (type == 1) {
                //删除索引
                await mongodb_1.dbSev.getFlowDb().dropIndexes(table);
            }
            if (dbs[table].length < 1) {
                continue; //不需要索引
            }
            for (const val of dbs[table]) {
                //添加索引
                await mongodb_1.dbSev.getFlowDb().createIndexes(table, val);
            }
        }
        console.log("=======flow索引 结束===", type);
    }
    //获取参数
    getParams(ctx) {
        let _query = {};
        let _body = {};
        if (ctx.request != null) {
            if (ctx.request.query != null) {
                _query = ctx.request.query;
            }
            if (ctx.request.body != null) {
                // if (ctx.request.body.cs != null) {
                //     _body = game.jiemi(ctx.request.body.cs);
                // } else {
                //     _body = ctx.request.body;
                // }
                _body = ctx.request.body;
            }
        }
        if (ctx.params == null) {
            ctx.params = {};
        }
        let param = Object.assign({}, _query, _body, ctx.params);
        if (param.uuid != null) {
            ctx.state.qhao = param.uuid;
            let cfgLoginUuid = setting_1.default.getSetting("1", "loginUuid");
            if (cfgLoginUuid != null && cfgLoginUuid[param.uuid] != null) {
                param.uuid = cfgLoginUuid[param.uuid];
            }
        }
        return param;
    }
    //不加密
    getParamsAdmin(ctx) {
        let _query = {};
        let _body = {};
        if (ctx.request != null) {
            if (ctx.request.query != null) {
                _query = ctx.request.query;
            }
            if (ctx.request.body != null) {
                _body = ctx.request.body;
            }
        }
        if (ctx.params == null) {
            ctx.params = {};
        }
        let param = Object.assign({}, _query, _body, ctx.params);
        if (param.uuid != null) {
            ctx.state.qhao = param.uuid;
            let cfgLoginUuid = setting_1.default.getSetting("1", "loginUuid");
            if (cfgLoginUuid != null && cfgLoginUuid[param.uuid] != null) {
                param.uuid = cfgLoginUuid[param.uuid];
            }
        }
        return param;
    }
    /**
     * 根据 openId 获取 UID
     * @param packageID  包名ID  excel定义
     * @param openId     平台传过来的唯一标识ID
     * @param ip        用户客户端的Ip
     */
    async openidLogin(ctx) {
        const params = exports.tool.getParams(ctx);
        if (params.openid == null || params.plat == null) {
            ctx.throw("无效登陆");
        }
        let tableName = "loginPlatform";
        let info = await mongodb_1.dbSev.getDataDb().findOne(tableName, { openId: params.openid });
        //创建uid
        if (info == null) {
            //获取一个新的uid
            let uid = await mongodb_1.dbSev.getDataDb().getNextId("UID");
            let sql = {
                pid: params.pid,
                openId: params.openid,
                plat: params.plat,
                uid: uid.toString(),
                ip: this.getClientIP(ctx),
                time: ctx.state.newTime,
                parms: params.parms
            };
            await mongodb_1.dbSev.getDataDb().insert(tableName, sql);
            //首次上报
            if (params.plat == "ylWechat") {
                YlWechat_1.default.shangbaoUser(ctx, uid, params.openid);
            }
            //返回
            return {
                type: 2,
                msg: "",
                data: uid,
            };
        }
        else {
            if (params.plat == "ylWechat") {
                await mongodb_1.dbSev.getDataDb().update(tableName, { openId: params.openid }, { parms: params.parms });
            }
        }
        //返回
        return {
            type: 1,
            msg: "",
            data: info.uid,
        };
    }
    /**
     * 根据 uid 获取 账号信息
     * @param ctx  CTX
     */
    async getInfoByUid(ctx) {
        let uuid = ctx.state.master.getUuid();
        let userModel = UserModel_1.UserModel.getInstance(ctx, uuid);
        let userInfo = await userModel.getInfo();
        let tableName = "loginPlatform";
        let info = await mongodb_1.dbSev.getDataDb().findOne(tableName, { uid: userInfo.uid.toString() });
        if (info == null) {
            ctx.throw(`获取不到账号信息uuid:${uuid},uid:${userInfo.uid}`);
        }
        //返回
        return info;
    }
    async getOpenIdByUid(uid) {
        if (this.openIdByUid[uid] == null) {
            let tableName = "loginPlatform";
            let info = await mongodb_1.dbSev.getDataDb().findOne(tableName, { "uid": uid.toString() });
            if (info == null || info.openId == null) {
                return null;
            }
            let wxopenid = "";
            let info1 = await mongodb_1.dbSev.getDataDb().findOne("plat", { "openid": info.openId });
            if (info1 != null && info1.wxopenid != null) {
                wxopenid = info1.wxopenid;
            }
            this.openIdByUid[uid] = {
                pid: info.pid,
                openid: info.openId,
                plat: info.plat,
                wxopenid: wxopenid,
                parms: info.parms
            };
        }
        return this.openIdByUid[uid];
    }
    //获取IP
    getClientIP(ctx) {
        if (ctx.headers == null) {
            return "127.0.0.1";
        }
        let ip = ctx.headers["x-forwarded-for"] || ctx.ip || ctx.socket.remoteAddress;
        if (typeof ip == "string") {
            return ip;
        }
        if (typeof ip == "object") {
            return JSON.stringify(ip);
        }
        return "";
    }
    getLockIp() {
        if (this.localIp != "") {
            return this.localIp;
        }
        let CfgServer = exports.tool.getServerCfg().server;
        let serverIpS = [];
        for (const val of CfgServer) {
            serverIpS.push(val.host);
        }
        let fwqInfo = os_1.default.networkInterfaces();
        if (fwqInfo != null) {
            for (const key in fwqInfo) {
                for (const val of fwqInfo[key]) {
                    if (serverIpS.indexOf(val.address) != -1) {
                        this.localIp = val.address;
                        console.log("====获取服务器启动ip===", this.localIp);
                        return this.localIp;
                    }
                }
            }
        }
        console.error("====获取服务器启动ip错误===", fwqInfo);
        return this.localIp;
    }
    /**
     * 创建一个tcx
     */
    async ctxCreate(type, fuuid) {
        let ctx = Object.create({ ctxId: type + fuuid });
        ctx.state = {
            uuid: type + "_" + fuuid,
            pid: "",
            sid: "1",
            regtime: 0,
            lasttime: 0,
            locks: [],
            addLock: true,
            master: new master_1.Master(ctx),
            fuuid: fuuid,
            uid: "",
            level: 1,
            log: [],
            newTime: game_1.default.getNowTime(),
            new0: game_1.default.getToDay_0(),
            model: {},
            qhao: "",
            apidesc: "",
            name: ""
        };
        ctx.state.master.addBackBuf({});
        if (type == "user" && parseInt(fuuid) >= 100000) {
            let userModel = UserModel_1.UserModel.getInstance(ctx, fuuid);
            let userInfo = await userModel.getInfo();
            ctx.state.sid = userInfo.sid;
            ctx.state.regtime = userInfo.regtime;
            ctx.state.lasttime = userInfo.lastlogin;
            ctx.state.level = userInfo.level;
            ctx.state.name = userInfo.name == "" ? "初心者" + fuuid : userInfo.name;
            ctx.state.uid = userInfo.uid;
            let playerModel = PlayerModel_1.PlayerModel.getInstance(ctx, userInfo.uid);
            let player = await playerModel.getInfo();
            ctx.state.pid = player.pid;
        }
        return ctx;
    }
    /**
     * ctx更新
     */
    async ctxUpdate(ctx) {
        await ctx.state.master.updateFBuf(); //存储我给他人的输出信息
        await ctx.state.master.distroy(); //写入
        await lock_1.default.unLock(ctx); //解锁
    }
    /**
     * 流水日志写入
     */
    async insertFlow(ctx) {
        if (ctx.state.log == null) {
            return;
        }
        let timeMs = ctx.state.newTime;
        let url = ctx.url == null ? "" : ctx.url;
        if (url != "") {
            url = url.split("?")[0];
        }
        let cs = exports.tool.getParams(ctx);
        let sql = [];
        for (const val of ctx.state.log) {
            sql.push({
                czer: val.czer,
                ber: val.ber,
                url: url,
                cs: cs,
                kind: val.item[0],
                id: val.item[1],
                count: val.item[2],
                last: val.item[3],
                time: timeMs,
            });
        }
        if (sql.length <= 0) {
            return;
        }
        await mongodb_1.dbSev.getFlowDb().insertMany("flow1", sql);
    }
    /**
     * 记录服务端异常错误
     */
    async addServerError(url, cs, error) {
        //存储异常错误
        await mongodb_1.dbSev.getFlowDb().insert("serverError", {
            url: url,
            cs: cs,
            error: error,
            time: game_1.default.getNowTime(),
        });
        console.log("===服务端异常错误==", error);
    }
    /**
     * 记录客户端异常错误
     */
    async addClientError(pid, uuid, error) {
        //存储异常错误
        await mongodb_1.dbSev.getFlowDb().insert("clientError", {
            pid: pid,
            uuid: uuid,
            error: error,
            time: game_1.default.getNowTime(),
        });
    }
    /**
     * 插入名字
     * @param type  类型 user   club
     * @param sid   区服
     * @param name  名字
     * @param id    类型对应ID
     */
    async addName(type, sid, name, id) {
        let table = "name";
        let info = await mongodb_1.dbSev.getDataDb().findOne(table, {
            type: type,
            sid: sid,
            name: name,
        });
        if (info != null) {
            return false;
        }
        await mongodb_1.dbSev.getDataDb().insert(table, {
            type: type,
            sid: sid,
            name: name,
            id: id,
        });
        return true;
    }
    /**
     * 更新名字
     * @param type  类型 user   club
     * @param sid   区服
     * @param name  名字
     * @param id    类型对应ID
     */
    async updateName(type, sid, name, id) {
        let table = "name";
        await mongodb_1.dbSev.getDataDb().update(table, {
            type: type,
            sid: sid,
            id: id,
        }, {
            type: type,
            sid: sid,
            name: name,
            id: id,
        });
    }
    /**
     * 注册系统 -  查询
     * @param query  查询条件
     */
    async findRegister(query) {
        let table = "register";
        let info = await mongodb_1.dbSev.getDataDb().findOne(table, query);
        return info;
    }
    /**
     * 注册系统 - 更新
     * @param account   账号
     * @param update 更新数据
     */
    async updateRegister(account, update) {
        let table = "register";
        await mongodb_1.dbSev.getDataDb().update(table, { account: account }, update, true);
    }
    //添加定时器
    async addTimer(sid, kid, hdcid, hid, doAt, cs = []) {
        let info = await mongodb_1.dbSev.getDataDb().findOne("timer", {
            sid: sid,
            kid: kid,
            hdcid: hdcid,
            hid: hid,
        });
        if (info != null) {
            return;
        }
        await mongodb_1.dbSev.getDataDb().update("timer", {
            sid: sid,
            kid: kid,
            hdcid: hdcid,
            hid: hid,
        }, {
            sid: sid,
            kid: kid,
            hdcid: hdcid,
            hid: hid,
            doAt: doAt,
            isOver: 0,
            paoNum: 0,
            cs: cs,
        }, true);
    }
    //更新定时器
    async updateTimer(sid, kid, hdcid, hid, doAt, cs = []) {
        await mongodb_1.dbSev.getDataDb().update("timer", {
            sid: sid,
            kid: kid,
            hdcid: hdcid,
            hid: hid,
        }, {
            sid: sid,
            kid: kid,
            hdcid: hdcid,
            hid: hid,
            doAt: doAt,
            isOver: 0,
            paoNum: 0,
            cs: cs,
        }, true);
    }
    //post方式封装   {json:requestData}  {form:requestData}
    async postSync(url, requestData) {
        try {
            return await this._postSync(url, requestData);
        }
        catch (e) {
            console.error("post抛异常 " + e);
            console.error("url: " + url);
            return "-1";
        }
    }
    async _postSync(url, requestData) {
        return new Promise((reslove, reject) => {
            request.post(url, requestData, (err, response, body) => {
                //非业务层的错误判断
                if (!err) {
                    reslove(body); // 请求成功的处理逻辑
                }
                else {
                    reject(err);
                }
            });
        });
    }
    /**
     * 打印日志
     * @param msg 提示文字头
     * @param str 提示信息
     */
    clog(msg, ...str) {
        let cfgSystem = setting_1.default.getSetting("1", "system");
        //如果是local ，开关也有开 直接充值
        if (cfgSystem != null && cfgSystem.log_open == 1) {
            console.log(msg, str);
        }
    }
    /**
     * 是不是假期
     * @param ymd 年月日 YYYYmmdd
     */
    sfz_isHoliday(ymd) {
        let year = ymd.substring(0, 4);
        let month = ymd.substring(4, 6);
        let day = ymd.substring(6, 8);
        let cfgHoliday = setting_1.default.getSetting("1", "holiday");
        if (cfgHoliday[year] == null || cfgHoliday[year][month] == null || cfgHoliday[year][month].indexOf(day) == -1) {
            return {
                type: 0,
                msg: "不是假期",
                data: "",
            };
        }
        return {
            type: 1,
            msg: "是假期",
            data: "",
        };
    }
    /**
     * 是不是满age 周岁
     * @param ymd 年月日 YYYYmmdd
     * @param age
     */
    sfz_isAge(ymd, age = 18) {
        let birthYear = parseInt(ymd.substring(0, 4));
        let birthMonth = parseInt(ymd.substring(4, 6));
        let birthDay = parseInt(ymd.substring(6, 8));
        const d = new Date();
        const nowYear = d.getFullYear();
        const nowMonth = d.getMonth() + 1;
        const nowDay = d.getDate();
        if (nowYear - birthYear > age) {
            return {
                type: 1,
                msg: `满${age}周岁`,
                data: "",
            };
        }
        if (nowYear - birthYear < 18) {
            return {
                type: 0,
                msg: `未满${age}周岁`,
                data: "",
            };
        }
        //年相同  比较月
        if (nowMonth > birthMonth) {
            return {
                type: 1,
                msg: `满${age}周岁`,
                data: "",
            };
        }
        if (nowMonth < birthMonth) {
            return {
                type: 0,
                msg: `未满${age}周岁`,
                data: "",
            };
        }
        //年相同 月相同 比较日
        if (nowDay < birthDay) {
            return {
                type: 0,
                msg: `未满${age}周岁`,
                data: "",
            };
        }
        return {
            type: 1,
            msg: `满${age}周岁`,
            data: "",
        };
    }
    async url_post_addhead(url, requestData, heads) {
        return new Promise((reslove, reject) => {
            let headers = {};
            headers["Content-Type"] = "application/json";
            for (const key in heads) {
                headers[key] = heads[key];
            }
            let options = {
                headers: headers,
                url: url,
                method: "POST",
                body: requestData,
            };
            request.post(options, (err, response, body) => {
                if (!err) {
                    reslove(body); // 请求成功的处理逻辑
                }
                else {
                    reject(err);
                }
            });
        });
    }
    async url_post_from(url, requestData) {
        const formData = new URLSearchParams(requestData);
        return new Promise((reslove, reject) => {
            let options = {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                url: url,
                method: "POST",
                body: formData.toString()
            };
            request.post(options, (err, response, body) => {
                if (!err) {
                    reslove(body); // 请求成功的处理逻辑
                }
                else {
                    reject(err);
                }
            });
        });
    }
    /**
     * 获取常量配置
     * @param ctx
     * @param key
     */
    mathcfg_count(ctx, key) {
        let cfgMath = gameCfg_1.default.mathInfo.getItemCtx(ctx, key);
        if (cfgMath.pram.count == null) {
            ctx.throw(`mathcfg_count ${key} count`);
            return 99999;
        }
        return cfgMath.pram.count;
    }
    mathcfg_count1(ctx, key) {
        let cfgMath = gameCfg_1.default.mathInfo.getItemCtx(ctx, key);
        if (cfgMath.pram.count1 == null) {
            ctx.throw(`mathcfg_count ${key} count1`);
            return 99999;
        }
        return cfgMath.pram.count1;
    }
    mathcfg_item(ctx, key) {
        let cfgMath = gameCfg_1.default.mathInfo.getItemCtx(ctx, key);
        if (cfgMath.pram.item == null) {
            ctx.throw(`mathcfg_count ${key} item`);
            return [];
        }
        return cfgMath.pram.item;
    }
    mathcfg_items(ctx, key) {
        let cfgMath = gameCfg_1.default.mathInfo.getItemCtx(ctx, key);
        if (cfgMath.pram.items == null) {
            ctx.throw(`mathcfg_count ${key} items`);
            return [];
        }
        return cfgMath.pram.items;
    }
    mathcfg_kv(ctx, key) {
        let cfgMath = gameCfg_1.default.mathInfo.getItemCtx(ctx, key);
        if (cfgMath.pram.kv == null) {
            ctx.throw(`mathcfg_count ${key} kv`);
            return {};
        }
        return cfgMath.pram.kv;
    }
    /**
     * 竞技场 获取 周ID
     */
    jjcWeekId(time) {
        let cfgMath = gameCfg_1.default.mathInfo.getItem("jjc_week_time");
        if (cfgMath != null && cfgMath.pram != null && cfgMath.pram.item != null) {
            let chaAt = 86400 * 7 - cfgMath.pram.item[0];
            return game_1.default.getWeekId(time + chaAt);
        }
        return game_1.default.getWeekId();
    }
    /**
     * 后端埋点
     * @param ctx
     * @param id 埋点序号
     * @param cs 参数
     */
    async maidian(ctx, id, ...cs) {
        let bai = Math.floor(id / 100);
        let table = "Smaidian_" + bai;
        await mongodb_1.dbSev.getFlowDb().insert(table, {
            pid: ctx.state.pid,
            uuid: ctx.state.uuid,
            uid: ctx.state.uid,
            sid: ctx.state.sid,
            mdid: id,
            at: ctx.state.newTime,
            cs: cs,
        });
    }
    /**
     * 后端埋点 更新
     * @param ctx
     * @param id 埋点序号
     * @param cs 参数
     */
    async maidianUpdate(ctx, id, ...cs) {
        let bai = Math.floor(id / 100);
        let table = "Smaidian_" + bai;
        await mongodb_1.dbSev.getFlowDb().update(table, {
            uuid: ctx.state.uuid,
            mdid: id
        }, {
            pid: ctx.state.pid,
            uuid: ctx.state.uuid,
            sid: ctx.state.sid,
            mdid: id,
            at: ctx.state.newTime,
            cs: cs,
        });
    }
    /**
     * 后端战斗日志
     */
    async addFightTeam(ctx, start) {
        if (start == null || start.teams["10"] == null || start.teams["20"] == null) {
            return;
        }
        let table = "fight_start";
        await mongodb_1.dbSev.getFlowDb().insert(table, {
            from: start.from,
            uuid: start.teams["10"].fid,
            fuuid: start.teams["20"].fid,
            start: JSON.stringify(start),
            time: ctx.state.newTime
        });
    }
    /**
     * 根据权重随机选择一个 key
     * @param weightedData 包含键和对应权重的对象
     * @returns 选中的 key，如果发生异常返回 null
     */
    getRandomKey(weightedData) {
        let _weightedData = gameMethod_1.gameMethod.objCopy(weightedData);
        const keys = Object.keys(_weightedData);
        const totalWeight = keys.reduce((sum, key) => sum + (_weightedData[key] || 0), 0);
        const randomValue = Math.random() * totalWeight;
        let cumulativeWeight = 0;
        for (const key of keys) {
            cumulativeWeight += _weightedData[key] || 0;
            if (randomValue < cumulativeWeight) {
                return key;
            }
        }
        return null;
    }
    /**
     * 根据权重随机选择一个 数组元素
     * @param weightedData 包含键和对应权重的对象 [[道具ID，道具数量，权重]]
     * @param kind 对应的道具类型
     * @returns 道具格式
     */
    getRandomList(weightedData, kind) {
        let _weightedData = gameMethod_1.gameMethod.objCopy(weightedData);
        const totalWeight = _weightedData.reduce((sum, [, , weight]) => sum + weight, 0);
        const randomValue = Math.random() * totalWeight;
        let cumulativeWeight = 0;
        for (const [itemID, itemCount, weight] of _weightedData) {
            cumulativeWeight += weight;
            if (randomValue < cumulativeWeight) {
                return [kind, itemID, itemCount];
            }
        }
        return null;
    }
}
exports.tool = new Tool();
//# sourceMappingURL=tool.js.map