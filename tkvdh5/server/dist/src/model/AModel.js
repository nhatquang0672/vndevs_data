"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AModel = void 0;
const master_1 = require("../util/master");
const redis_1 = require("../util/redis");
const mongodb_1 = require("../util/mongodb");
const setting_1 = __importDefault(require("../crontab/setting"));
const gameMethod_1 = require("../../common/gameMethod");
const game_1 = __importDefault(require("../util/game"));
const UserModel_1 = require("./user/UserModel");
/**
 * 存储类基类
 */
class AModel {
    /**
     * 构造函数
     * @param id
     */
    constructor(ctx, id, hdcid = '1') {
        this.ctx = ctx;
        this.id = id;
        this.hdcid = hdcid;
    }
    //获取缓存1级key
    getKey1() {
        return this.dType + '_' + this.id;
    }
    //获取缓存2级key
    getKey2() {
        return this.table + '_' + this.kid + '_' + this.hdcid;
    }
    async getOutPut_u(key) {
        let outPut = await this.getOutPut();
        return outPut[key];
    }
    //返回数据
    async backData() {
        let outPut = await this.getOutPut();
        if (outPut == null) {
            return;
        }
        let outf = {};
        outf[this.kid] = {};
        let _key2 = this.outKey2();
        if (this.outIsAu == true) {
            if (_key2 != "") {
                outf[this.kid][_key2] = {};
                outf[this.kid][_key2]["a"] = outPut;
            }
            else {
                outf[this.kid]["a"] = outPut;
            }
        }
        else {
            if (_key2 != "") {
                outf[this.kid][_key2] = outPut;
            }
            else {
                outf[this.kid] = outPut;
            }
        }
        if (this.dType == master_1.DataType.user && this.ctx.state.uuid != null && this.id != this.ctx.state.uuid) {
            this.ctx.state.master.addfBackBuf(this.id, outf);
        }
        else {
            this.ctx.state.master.addBackBuf(outf);
        }
    }
    //u下发
    async backData_u(keys) {
        if (keys.length < 1) {
            return;
        }
        let outf = {};
        outf[this.kid] = {};
        let _key2 = this.outKey2();
        for (const key of keys) {
            let outPut = await this.getOutPut_u(key);
            if (outPut == null) {
                continue;
            }
            if (_key2 != "") {
                if (outf[this.kid][_key2] == null) {
                    outf[this.kid][_key2] = {};
                }
                if (outf[this.kid][_key2]["u"] == null) {
                    outf[this.kid][_key2]["u"] = {};
                }
                outf[this.kid][_key2]["u"][key] = outPut;
            }
            else {
                if (outf[this.kid]["u"] == null) {
                    outf[this.kid]["u"] = {};
                }
                outf[this.kid]["u"][key] = outPut;
            }
        }
        if (this.dType == master_1.DataType.user && this.ctx.state.uuid != null && this.id != this.ctx.state.uuid) {
            this.ctx.state.master.addfBackBuf(this.id, outf);
        }
        else {
            this.ctx.state.master.addBackBuf(outf);
        }
    }
    /**
     * 从缓存获取用户信息
     */
    async getInfo() {
        let info = this.ctx.state.master.getInfo(this.getKey1(), this.getKey2());
        if (info != null) {
            return info;
        }
        //如果 ctx 没有 从缓存获取
        let dbInfo = await redis_1.redisSev.getRedis(this.dType).hGet(this.getKey1(), this.getKey2());
        if (dbInfo == null) {
            dbInfo = await this._getInfoFromDb();
            if (dbInfo == null) {
                //数据库没有 执行业务初始化
                info = this.init();
            }
            else {
                info = dbInfo;
                this.ctx.state.master.addSave(this.getKey1(), this.getKey2(), info);
            }
        }
        else {
            info = dbInfo;
        }
        this.ctx.state.master.setInfo(this.getKey1(), this.getKey2(), info);
        return info;
    }
    /**
     * 从缓存获取用户信息
     */
    async getBaseInfo() {
        let info = this.ctx.state.master.getInfo(this.getKey1(), this.getKey2());
        if (info != null) {
            return info;
        }
        //如果 ctx 没有 从缓存获取
        let dbInfo = await redis_1.redisSev.getRedis(this.dType).hGet(this.getKey1(), this.getKey2());
        if (dbInfo == null) {
            dbInfo = await this._getInfoFromDb();
            if (dbInfo == null) {
                //数据库没有 执行业务初始化
                info = this.init();
            }
            else {
                info = dbInfo;
                this.ctx.state.master.addSave(this.getKey1(), this.getKey2(), info);
            }
        }
        else {
            info = dbInfo;
        }
        this.ctx.state.master.setInfo(this.getKey1(), this.getKey2(), info);
        return info;
    }
    /**
     * 从数据库获取用户信息
     */
    async _getInfoFromDb() {
        let result = await mongodb_1.dbSev.getDataDb().findOne(this.table, {
            id: this.id.toString(),
            kid: this.kid.toString(),
            hdcid: this.hdcid.toString()
        });
        if (result == null) {
            return null;
        }
        else {
            return result.data;
        }
    }
    //所有更新 必须经过这个函数
    async update(info, keys = []) {
        if (info == null) {
            return;
        }
        this.ctx.state.master.setInfo(this.getKey1(), this.getKey2(), info);
        this.ctx.state.master.addSave(this.getKey1(), this.getKey2(), info);
        //更新下发
        if (keys.length > 0) {
            if (keys[0] == "") {
                return;
            }
            await this.backData_u(keys);
        }
        else {
            await this.backData();
        }
    }
    //d下发
    async backData_d(keys) {
        if (keys.length < 1) {
            return;
        }
        let outf = {};
        outf[this.kid] = {};
        let _key2 = this.outKey2();
        if (_key2 != "") {
            outf[this.kid][this.outKey2()] = {};
            outf[this.kid][this.outKey2()]["d"] = {};
            for (const key of keys) {
                outf[this.kid][this.outKey2()]["d"][key] = true;
            }
        }
        else {
            outf[this.kid]["d"] = {};
            for (const key of keys) {
                outf[this.kid]["d"][key] = true;
            }
        }
        if (this.dType == master_1.DataType.user && this.ctx.state.uuid != null && this.id != this.ctx.state.uuid) {
            this.ctx.state.master.addfBackBuf(this.id, outf);
        }
        else {
            this.ctx.state.master.addBackBuf(outf);
        }
    }
    /**
     * 通过fuuid获取合服ID
     * @param fsid
     */
    async getHeIdByUuid(fuuid) {
        if (fuuid == null || fuuid == "") {
            // console.log("===获取不到合服ID==1=",fuuid)
            return "";
        }
        // await lock.setLock(this.ctx, "user", fuuid); //枷锁
        let fuserModel = UserModel_1.UserModel.getInstance(this.ctx, fuuid);
        let fuser = await fuserModel.getInfo();
        return setting_1.default.getHeid(fuser.sid);
    }
    /**
     * 活动act专用
     * 获取活动配置
     */
    async getHdCfg() {
        let heid = await this.getHeIdByUuid(this.id);
        let hdCfg = gameMethod_1.gameMethod.objCopy(setting_1.default.getHuodong3(heid, this.kid, this.hdcid));
        if (hdCfg == null) {
            return null;
        }
        if (hdCfg.info.cuser == "") {
            return hdCfg;
        }
        let arr = hdCfg.info.cuser.split('_');
        let passDay = Math.ceil((this.ctx.state.new0 + 86400 - this.ctx.state.regtime) / 86400); //创建到现在距离多少天
        //已经不在创号范围内
        if (passDay < parseInt(arr[0]) || passDay > parseInt(arr[1])) {
            return null;
        }
        let createT_0 = game_1.default.getToDay_0(this.ctx.state.regtime); //创号当天0点
        hdCfg.info.sAt = createT_0 + (parseInt(arr[0]) - 1) * 86400; //开始时间
        hdCfg.info.eAt = createT_0 + parseInt(arr[1]) * 86400; //结束时间
        hdCfg.info.dAt = hdCfg.info.eAt + hdCfg.info.show * 60;
        return hdCfg;
    }
}
exports.AModel = AModel;
//# sourceMappingURL=AModel.js.map