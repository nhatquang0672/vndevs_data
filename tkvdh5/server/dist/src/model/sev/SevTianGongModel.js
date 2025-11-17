"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SevTianGongModel = exports.AModel = void 0;
const master_1 = require("../../util/master");
const setting_1 = __importDefault(require("../../crontab/setting"));
const gameMethod_1 = require("../../../common/gameMethod");
const game_1 = __importDefault(require("../../util/game"));
const redis_1 = require("../../util/redis");
const mongodb_1 = require("../../util/mongodb");
const UserModel_1 = require("../user/UserModel");
const lock_1 = __importDefault(require("../../util/lock"));
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
        await lock_1.default.setLock(this.ctx, "user", fuuid); //枷锁
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
/**
 * 天宫跨服信息
 * SevTianGongModel
 */
class SevTianGongModel extends AModel {
    constructor() {
        super(...arguments);
        this.table = "sev"; //数据库表名
        this.kid = "tianGong"; //用于存储key 和  输出1级key
        this.outIsAu = true; //下发数据是否用au下发
        this.dType = master_1.DataType.sev;
    }
    outKey2() {
        return this.hdcid; //输出2级key
    }
    init() {
        return {
            hdid: "",
            weekId: "",
            list: {},
            dayAt: 0,
        };
    }
    //单例模式
    static getInstance(ctx, cid = "1", hdcid = "1") {
        let dlKey = this.name + "_" + cid + "_" + hdcid; //单例模式key
        if (!ctx.state.model[dlKey]) {
            ctx.state.model[dlKey] = new this(ctx, cid, hdcid);
        }
        return ctx.state.model[dlKey];
    }
    /**
     * 初始化下发 不下发
     */
    async getOutPut() {
        return {};
    }
    async getInfo() {
        let info = await super.getInfo();
        let cfg = gameMethod_1.gameMethod.objCopy(setting_1.default.getHuodong3("1", "hdTianGong", this.hdcid));
        let weekId = game_1.default.getTianGongWeek();
        //hid重置 全部重置
        if (cfg != null && cfg.info.id != info.hdid) {
            info = this.init();
            info.hdid = cfg.info.id;
        }
        if (info.weekId != weekId) {
            info.weekId = weekId;
            //跨周 //不重置 只是重新拉取服务器表
            //本周开始时间
            let weekstime = game_1.default.week_0() + (cfg.data.openWeek[0] - 1) * 86400;
            //所有合服ID 排列一下
            let hsids = Object.keys(setting_1.default.getHefus());
            //遍历所有合服ID
            for (let i_hsid = 0; i_hsid < hsids.length; i_hsid++) {
                let _hsid = hsids[i_hsid]; //本合服ID
                if (info.list[_hsid] == null) {
                    info.list[_hsid] = {
                        ksid: "",
                        open: 0,
                        knum: 0,
                    };
                }
                //计算出 本合服ID的跨服ID 的下标
                let kid_xb = Math.floor(i_hsid / 10) * 10;
                info.list[_hsid].ksid = hsids[kid_xb]; //跨服ID;
                //获取本服 相对于本周活动开始的 开服天数
                let openDays = 0;
                if (setting_1.default.qufus[info.list[_hsid].ksid] != null) {
                    openDays = Math.floor((weekstime - game_1.default.getToDay_0(setting_1.default.qufus[info.list[_hsid].ksid].openAt)) / 86400);
                }
                //开服X天开始 活动生效
                if (openDays >= cfg.data.openDays) {
                    info.list[_hsid].knum += 1;
                    if (info.list[_hsid].knum >= cfg.data.openKuaNum) {
                        info.list[_hsid].open = 2; //开启跨服
                    }
                    else {
                        info.list[_hsid].open = 1; //只开活动 不开跨服
                    }
                }
                else {
                    //未开启活动
                    info.list[_hsid].open = 0; //活动未开启
                }
            }
            await this.update(info);
        }
        else {
            if (info.dayAt == null || info.dayAt < this.ctx.state.new0) {
                info.dayAt = this.ctx.state.newTime;
                //所有合服ID 排列一下
                let hsids = Object.keys(setting_1.default.getHefus());
                //遍历所有合服ID
                for (let i_hsid = 0; i_hsid < hsids.length; i_hsid++) {
                    let _hsid = hsids[i_hsid]; //本合服ID
                    if (info.list[_hsid] != null && info.list[_hsid].ksid != "") {
                        continue;
                    }
                    if (info.list[_hsid] == null) {
                        info.list[_hsid] = {
                            ksid: "",
                            open: 0,
                            knum: 0,
                        };
                    }
                    //计算出 本合服ID的跨服ID 的下标
                    let kid_xb = Math.floor(i_hsid / 10) * 10;
                    info.list[_hsid].ksid = hsids[kid_xb]; //跨服ID;
                    let openDays = 0;
                    if (setting_1.default.qufus[info.list[_hsid].ksid] != null) {
                        openDays = game_1.default.passDay(setting_1.default.qufus[info.list[_hsid].ksid].openAt);
                    }
                    //开服X天开始 活动生效
                    if (openDays >= cfg.data.openDays) {
                        info.list[_hsid].knum += 1;
                        info.list[_hsid].open = 1; //只开活动 不开跨服
                    }
                    else {
                        //未开启活动
                        info.list[_hsid].open = 0; //活动未开启
                    }
                }
                await this.update(info);
            }
        }
        return info;
    }
    //获取 天宫跨服ID  //传入合服ID
    async getKidBySid(hsid) {
        let cfg = gameMethod_1.gameMethod.objCopy(setting_1.default.getHuodong3("1", "hdTianGong", this.hdcid));
        if (cfg == null) {
            return {
                ksid: hsid,
                open: 0,
                knum: 0,
            };
        }
        let info = await this.getInfo();
        if (info.list[hsid] == null) {
            return {
                ksid: hsid,
                open: 0,
                knum: 0,
            };
        }
        return info.list[hsid];
    }
}
exports.SevTianGongModel = SevTianGongModel;
//# sourceMappingURL=SevTianGongModel.js.map