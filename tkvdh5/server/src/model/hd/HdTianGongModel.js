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
exports.HdTianGongModel = exports.AModel = void 0;
// import { AModel } from "../AModel";
const Xys = __importStar(require("../../../common/Xys"));
const master_1 = require("../../util/master");
const gameMethod_1 = require("../../../common/gameMethod");
const game_1 = __importDefault(require("../../util/game"));
const setting_1 = __importDefault(require("../../crontab/setting"));
const RdsUserModel_1 = require("../redis/RdsUserModel");
const SevTianGongModel_1 = require("../sev/SevTianGongModel");
// import { AModel } from "../AModel";
// import * as Xys from "../../../common/Xys";
// import { DataType, CTX } from "../../util/master";
// import Gamecfg from "../../../common/gameCfg";
// import Setting from "../../crontab/setting";
// import { ActFazhenModel } from "../act/ActFazhenModel";
// import { SeedRand, gameMethod } from "../../../common/gameMethod";
// import game from "../../util/game";
// import { RdsUserModel } from "../redis/RdsUserModel";
// import { ActTaskMainModel } from "../act/ActTaskMainModel";
// import { SevDouLuoModel } from "../sev/SevDouLuoModel";
// import { UserModel } from "../user/UserModel";
// import LockCache from "../../util/cache";
// import { tool } from "../../util/tool";
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
    constructor(ctx, id, hdcid = "1") {
        this.ctx = ctx;
        this.id = id;
        this.hdcid = hdcid;
    }
    //获取缓存1级key
    getKey1() {
        return this.dType + "_" + this.id;
    }
    //获取缓存2级key
    getKey2() {
        return this.table + "_" + this.kid + "_" + this.hdcid;
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
            hdcid: this.hdcid.toString(),
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
        let arr = hdCfg.info.cuser.split("_");
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
 * HdTianGongModel
 * 活动 天宫乐舞
 */
class HdTianGongModel extends AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdTianGong"; //用于存储key 和  输出1级key
        this.outIsAu = true; //下发数据是否用au下发
        this.dType = master_1.DataType.user;
    }
    //钩子 整合代码
    static async hook(ctx, uuid, count) {
        let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
        let cfgHdTianGong = setting_1.default.getHuodong2(heid, "hdTianGong");
        if (cfgHdTianGong != null) {
            for (const hdcid in cfgHdTianGong) {
                let hdTianGongModel = HdTianGongModel.getInstance(ctx, uuid, hdcid);
                await hdTianGongModel.addHook(count);
            }
        }
    }
    //加道具 整合代码 score2 //XX积分
    static async additem(ctx, uuid, id, count) {
        let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
        //活动 - 天宫乐舞
        let cfgHdTianGong = setting_1.default.getHuodong2(heid, "hdTianGong");
        if (cfgHdTianGong != null) {
            for (const hdcid in cfgHdTianGong) {
                if (cfgHdTianGong[hdcid].data.playList[id] == null) {
                    //不是本活动道具
                    continue;
                }
                //加上活动道具
                let hdTianGongModel = HdTianGongModel.getInstance(ctx, uuid, hdcid);
                let info = await hdTianGongModel.getInfo();
                if (info.items[id] == null) {
                    info.items[id] = 0;
                }
                info.items[id] += count;
                await hdTianGongModel.update(info, ["outf", "red"]);
            }
        }
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
        return this.hdcid; //输出2级key
    }
    //初始化
    init() {
        return {
            hdid: "",
            weekId: "",
            ksid: "",
            kopen: 0,
            score: 0,
            score2: 0,
            buyList: {},
            buyListDay: {},
            buyListWeek: {},
            //领取记录
            lqList: {},
            lqListDay: {},
            dhList: {},
            dhListDay: {},
            dhListMon: {},
            outTime: 0,
            //表演道具
            items: {},
            bug: 1
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        let cfg = await this.getHdCfg();
        //判断活动是否进行中
        //改写活动info
        //....
        //重置: 活动重置 周重置
        let weekId = game_1.default.getTianGongWeek();
        if (cfg != null && (cfg.info.id != info.hdid || info.weekId != weekId)) {
            info = this.init();
            //写入重置ID
            info.hdid = cfg.info.id;
            info.weekId = weekId;
            //保存
            await this.update(info, ["outf", "red"]);
        }
        //跨天 每日重置
        if (this.ctx.state.newTime > info.outTime) {
            //每日重置数据
            info.buyListDay = {};
            info.score2 = 0;
            //从sev 获取 活动开放信息
            let sevTianGongModel = SevTianGongModel_1.SevTianGongModel.getInstance(this.ctx, "1", this.hdcid);
            let sevOpenInfo = await sevTianGongModel.getKidBySid(await this.getHeIdByUuid(this.id));
            info.ksid = sevOpenInfo.ksid; //跨服ID
            info.kopen = sevOpenInfo.open; //开启状态
            //跨周 每周重置
            if (game_1.default.getWeek0(this.ctx.state.newTime) != game_1.default.getWeek0(info.outTime)) {
                info.buyListWeek = {};
            }
            //跨月 每月重置
            if (game_1.default.getNowMonth(this.ctx.state.newTime) != game_1.default.getNowMonth(info.outTime)) {
                // info.moon = {};
            }
            info.outTime = this.ctx.state.new0 + 86400;
            //保存
            await this.update(info, ["outf", "red"]);
        }
        return info;
    }
    /**
     * 返回数据
     */
    async getOutPut() {
        return {
            info: await this.getOutPut_u("info"),
            data: await this.getOutPut_u("data"),
            red: await this.getOutPut_u("red"),
            outf: await this.getOutPut_u("outf"),
        };
    }
    //改写 活动配置 生成活动时间
    static async getHdCfg(hdcid) {
        //获取活动配置
        let hdCfg = gameMethod_1.gameMethod.objCopy(setting_1.default.getHuodong3("1", "hdTianGong", hdcid));
        if (hdCfg == null) {
            return null;
        }
        //重写开始 结束时间
        hdCfg.info.sAt = game_1.default.week_0() + (hdCfg.data.openWeek[0] - 1) * 86400; //开始时间
        hdCfg.info.eAt = game_1.default.week_0() + hdCfg.data.openWeek[1] * 86400; //结束时间
        hdCfg.info.dAt = hdCfg.info.eAt + hdCfg.info.show * 60;
        return hdCfg;
    }
    async getHdCfg() {
        return HdTianGongModel.getHdCfg(this.hdcid);
    }
    async getOutPut_u(key) {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            return null;
        }
        let info = await this.getInfo();
        switch (key) {
            case "info":
            case "data":
                return cfg[key];
            case "red":
                return await this.getRed();
            case "outf": //构造输出体
                let outf = gameMethod_1.gameMethod.objCopy(info);
                let sevTianGongModel = SevTianGongModel_1.SevTianGongModel.getInstance(this.ctx, "1", this.hdcid);
                let sevInfo = await sevTianGongModel.getInfo();
                outf.sevOpens = sevInfo.list;
                return outf;
        }
        return null;
    }
    async getOutPut_info() {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            return null;
        }
        //改写开放时间
        let cfginfo = gameMethod_1.gameMethod.objCopy(cfg.info);
        cfginfo.sAt;
        cfginfo.dAt; //结束时间= 周X
        return cfg.info;
    }
    /**
     * 获取红点
     */
    async getRed() {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            return 0;
        }
        let info = await this.getInfo();
        // 1.天宫乐舞活动首页入口红点,有表演道具时候显示红点
        for (const key in cfg.data.playList) {
            if (info.items[key] > 0) {
                return 1;
            }
        }
        //2. 礼包，有免费礼包可以领取时红点，领取后消失。
        for (const dc in cfg.data.buyList) {
            //遍历配置礼包
            if (cfg.data.buyList[dc].need.length <= 0 && //免费档
                info.buyList[dc] == null //未领取
            ) {
                return 1;
            }
        }
        // // 3. 天宫乐舞活动首页积分兑换，有兑换可以领取时红点，领取后消失。
        // for (const dc in cfg.data.dhList) { //遍历配置礼包
        //     if (info.score < cfg.data.dhList[dc].needScore) {
        //         return 0;
        //     }
        //      //总限购
        //     if (cfg.data.dhList[dc].limit > 0) {
        //         if (info.dhList[dc] > cfg.data.dhList[dc].limit) {
        //             return 0;
        //         }
        //     }
        //     //每日限购
        //     if (cfg.data.dhList[dc].limitDay > 0) {
        //         if (info.dhListDay[dc]  > cfg.data.dhList[dc].limitDay) {
        //             return 0;
        //         }
        //     }
        //     //每月限购
        //     if (cfg.data.dhList[dc].limitMon > 0) {
        //         if (info.dhListMon[dc] > cfg.data.dhList[dc].limitMon) {
        //             return 0;
        //         }
        //     }
        //     if (
        //         info.dhList[dc] == null && //未领取
        //         cfg.data.dhList[dc].needScore <= info.score2 //积分需求
        //     ) {
        //         return 1;
        //     }
        // }
        return 0;
    }
    /**
     * 购买
     * async await
     *
     * 异步调用
     *
     */
    async buy(id) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime > cfg.info.dAt) {
            this.ctx.throw("活动未生效");
            return;
        }
        //自己的数据
        let info = await this.getInfo();
        if (info.buyList[id] == null) {
            info.buyList[id] = 0;
        }
        if (info.buyListDay[id] == null) {
            info.buyListDay[id] = 0;
        }
        if (info.buyListWeek[id] == null) {
            info.buyListWeek[id] = 0;
        }
        //总限购
        if (cfg.data.buyList[id].limit > 0) {
            if (info.buyList[id] > cfg.data.buyList[id].limit) {
                this.ctx.throw("总限购上限");
            }
        }
        //每日限购
        if (cfg.data.buyList[id].limitDay > 0) {
            if (info.buyListDay[id] > cfg.data.buyList[id].limitDay) {
                this.ctx.throw("日限购上限");
            }
        }
        //每周限购
        if (cfg.data.buyList[id].limitWeek > 0) {
            if (info.buyListWeek[id] > cfg.data.buyList[id].limitWeek) {
                this.ctx.throw("周限购上限");
            }
        }
        //需求
        let need = gameMethod_1.gameMethod.objCopy(cfg.data.buyList[id].need);
        //--判断----加减---------------
        if (gameMethod_1.gameMethod.isEmpty(need) != true) {
            need[2] *= 1;
            await this.ctx.state.master.subItem1(need);
        }
        else {
            //免费
        }
        //加道具
        let rwds = gameMethod_1.gameMethod.objCopy(cfg.data.buyList[id].rwd);
        for (let index = 0; index < rwds.length; index++) {
            const rwd = rwds[index];
            await this.ctx.state.master.addItem1(rwd);
        }
        //记录购买
        info.buyList[id] += 1;
        info.buyListDay[id] += 1;
        info.buyListWeek[id] += 1;
        //保存
        await this.update(info, ["outf", "red"]);
        return 0;
    }
    /**
     * 领取
     */
    async lingqu(id, count) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime > cfg.info.dAt) {
            this.ctx.throw("活动未生效");
            return;
        }
        //自己的数据
        let info = await this.getInfo();
        if (info.lqList[id] == null) {
            info.lqList[id] = 0;
        }
        //累计金额限制
        if (info.score2 < cfg.data.lqList[id].needScore2) {
            this.ctx.throw("累计金额不足");
        }
        //每日领取
        if (cfg.data.lqList[id].limitDay > 0) {
            if (info.lqListDay[id] + count > cfg.data.lqList[id].limitDay) {
                this.ctx.throw("日领取上限");
            }
        }
        //加道具
        let rwd = gameMethod_1.gameMethod.objCopy(cfg.data.lqList[id].rwd);
        rwd[2] *= count;
        await this.ctx.state.master.addItem1(rwd);
        //记录购买
        info.lqListDay[id] += 1;
        //保存
        await this.update(info, ["outf", "red"]);
    }
    /**
     * 兑换
     */
    async duihuan(id, count) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime > cfg.info.dAt) {
            this.ctx.throw("活动未生效");
            return;
        }
        //自己的数据
        let info = await this.getInfo();
        //总积分限制
        if (info.score < cfg.data.dhList[id].needScore) {
            this.ctx.throw("总积分不足");
        }
        if (info.dhList[id] == null) {
            info.dhList[id] = 0;
        }
        if (info.dhListDay[id] == null) {
            info.dhListDay[id] = 0;
        }
        if (info.dhListMon[id] == null) {
            info.dhListMon[id] = 0;
        }
        //总限购
        if (cfg.data.dhList[id].limit > 0) {
            if (info.dhList[id] + count > cfg.data.dhList[id].limit) {
                this.ctx.throw("限购上限");
            }
        }
        //每日限购
        if (cfg.data.dhList[id].limitDay > 0) {
            if (info.dhListDay[id] + count > cfg.data.dhList[id].limitDay) {
                this.ctx.throw("日限购上限");
            }
        }
        //每月限购
        if (cfg.data.dhList[id].limitMon > 0) {
            if (info.dhListMon[id] + count > cfg.data.dhList[id].limitMon) {
                this.ctx.throw("月限购上限");
            }
        }
        //需求
        cfg.data.dhList[id].need[2] *= count;
        await this.ctx.state.master.subItem1(cfg.data.dhList[id].need);
        cfg.data.dhList[id].rwd[2] *= count;
        await this.ctx.state.master.addItem1(cfg.data.dhList[id].rwd);
        //记录购买
        info.dhList[id] += count;
        info.dhListDay[id] += count;
        info.dhListMon[id] += count;
        //保存
        await this.update(info, ["outf", "red"]);
        return 0;
    }
    //表演
    async play(id, count) {
        //配置
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime > cfg.info.dAt) {
            this.ctx.throw("活动未生效");
            return;
        }
        if (count <= 0 || count > 100) {
            this.ctx.throw("数量异常");
        }
        let info = await this.getInfo();
        //不足取小
        let have = 0;
        if (info.items[id] != null) {
            have = info.items[id];
        }
        count = Math.min(count, have);
        if (count <= 0) {
            this.ctx.throw("道具不足");
        }
        //----------------
        //扣除需求道具
        info.items[id] -= count;
        //加[排行积分]
        info.score += cfg.data.playList[id].score * count;
        //获取总概率
        let probMax = game_1.default.getProbMax(cfg.data.playList[id].items, "prob");
        //抽取道具
        let items = [];
        //先加上积分
        items.push([cfg.data.scoreItemId[0], cfg.data.scoreItemId[1], count * cfg.data.playList[id].score]);
        for (let i = 0; i < count; i++) {
            //抽奖
            let r_item = game_1.default.getProbRandItem(probMax, cfg.data.playList[id].items, "prob");
            if (r_item == null) {
                this.ctx.throw("抽奖错误");
                return;
            }
            items.push(r_item.item);
        }
        //道具整理
        items = gameMethod_1.gameMethod.mergeArr(items);
        //加道具
        await this.ctx.state.master.addItem2(items);
        //加入排行榜
        let hesid = await this.getHeIdByUuid(this.id);
        // 1_rdsHdTianGongKua_1_20230314
        // sid_ xxxx _hdcid_weekid
        let rdsUserModel = RdsUserModel_1.RdsUserModel.getInstance(this.ctx, Xys.RdsUser.rdsHdTianGong, hesid, this.hdcid, info.weekId);
        await rdsUserModel.zSet(this.id, info.score);
        //加入排行榜 跨服
        let rdsUserModel_kua = RdsUserModel_1.RdsUserModel.getInstance(this.ctx, Xys.RdsUser.rdsHdTianGongKua, info.ksid, this.hdcid, info.weekId);
        await rdsUserModel_kua.zSet(this.id, info.score);
        // 更新
        await this.update(info, ["outf", "red"]);
    }
    /**
     * 充值钩子
     */
    async addHook(count) {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            return null;
        }
        let info = await this.getInfo();
        info.score2 += count;
        await this.update(info, ["outf", "red"]);
    }
    /**
     * 充值下单检查
     * pay
     */
    async checkUp(id) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime > cfg.info.dAt) {
            this.ctx.throw("活动未生效");
            return {
                type: 0,
                msg: "",
                data: "",
            };
        }
        //自己的数据
        let info = await this.getInfo();
        if (info.buyList[id] == null) {
            info.buyList[id] = 0;
        }
        let count = 1;
        //总限购
        if (cfg.data.buyList[id].limit > 0) {
            if (info.buyList[id] + count > cfg.data.buyList[id].limit) {
                this.ctx.throw("总限购上限");
            }
        }
        //每日限购
        if (cfg.data.buyList[id].limitDay > 0) {
            if (info.buyListDay[id] + count > cfg.data.buyList[id].limitDay) {
                this.ctx.throw("日限购上限");
            }
        }
        //每周限购
        if (cfg.data.buyList[id].limitWeek > 0) {
            if (info.buyListWeek[id] + count > cfg.data.buyList[id].limitWeek) {
                this.ctx.throw("周限购上限");
            }
        }
        if (cfg.data.buyList[id].need[0] != 10) {
            this.ctx.throw("参数错误");
        }
        return {
            type: 1,
            msg: cfg.data.buyList[id].title,
            data: cfg.data.buyList[id].need[1],
            kind10Cs: this.kid + "_" + this.hdcid + "_" + id + "_" + cfg.data.buyList[id].need[1]
        };
    }
    /**
     * 充值成功后执行
     */
    async carryOut(id) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime > cfg.info.dAt) {
            return {
                type: 0,
                msg: "活动未生效",
                data: null,
            };
        }
        //自己的数据
        let info = await this.getInfo();
        if (info.buyList[id] == null) {
            info.buyList[id] = 0;
        }
        if (info.buyListDay[id] == null) {
            info.buyListDay[id] = 0;
        }
        if (info.buyListWeek[id] == null) {
            info.buyListWeek[id] = 0;
        }
        let count = 1;
        //总限购
        if (cfg.data.buyList[id].limit > 0) {
            if (info.buyList[id] + count > cfg.data.buyList[id].limit) {
                return {
                    type: 0,
                    msg: "总限购上限",
                    data: null,
                };
            }
        }
        //每日限购
        if (cfg.data.buyList[id].limitDay > 0) {
            if (info.buyListDay[id] + count > cfg.data.buyList[id].limitDay) {
                return {
                    type: 0,
                    msg: "日限购上限",
                    data: null,
                };
            }
        }
        //每周限购
        if (cfg.data.buyList[id].limitWeek > 0) {
            if (info.buyListWeek[id] + count > cfg.data.buyList[id].limitWeek) {
                return {
                    type: 0,
                    msg: "周限购上限",
                    data: null,
                };
            }
        }
        if (cfg.data.buyList[id].need[0] != 10) {
            return {
                type: 0,
                msg: "参数错误",
                data: null,
            };
        }
        //加道具
        let rwds = gameMethod_1.gameMethod.objCopy(cfg.data.buyList[id].rwd);
        for (let index = 0; index < rwds.length; index++) {
            const rwd = rwds[index];
            await this.ctx.state.master.addItem1(rwd);
        }
        //记录购买
        info.buyList[id] += 1;
        info.buyListDay[id] += 1;
        info.buyListWeek[id] += 1;
        return {
            type: 1,
            msg: "充值成功",
            data: cfg.data.buyList[id].need[1],
        };
    }
    /**
     * 获取本活动的跨服ID
     */
    async getKsid() {
        //自己的数据
        let info = await this.getInfo();
        return info.ksid;
    }
}
exports.HdTianGongModel = HdTianGongModel;
// let a = {
//     info: {
//         //活动基础信息
//         id: "20230316", //重置ID
//         icon: "1", //图片id
//         title: "天宫乐舞", //活动标题
//         cuser: "", //创号区间 格式：1_7
//         show: 0, //展示时间 (分钟)
//     },
//     data: {
//         openWeek: [1, 4], //周几 开放 到周几
//         openDays: 5, //开服第几天开放
//         openKuaNum: 3, //第几次开放 开始跨服
//         buyList: {
//             "1": {
//                 //序号ID
//                 title: "免费福利",
//                 rwd: [[1, 921, 10]], //获得什么 一个道具
//                 need: [], //需求价格
//                 limit: 0, //总限购 0 不限购
//                 limitDay: 1, //日限购 0 不限购
//                 limitWeek: 0, //周限购 0 不限购
//             },
//             "2": {
//                 //序号ID
//                 title: "钻石礼包",
//                 rwd: [[1, 922, 5]], //获得什么 一个道具
//                 need: [1, 1, 100], //需求价格
//                 limit: 0, //总限购 0 不限购
//                 limitDay: 3, //日限购 0 不限购
//                 limitWeek: 0, //周限购 0 不限购
//             },
//             "3": {
//                 //序号ID
//                 title: "低级仙乐礼包",
//                 rwd: [
//                     [1, 1, 60],
//                     [1, 923, 4],
//                 ], //获得什么 一个道具
//                 need: [10, 6], //需求价格
//                 limit: 0, //总限购 0 不限购
//                 limitDay: 1, //日限购 0 不限购
//                 limitWeek: 0, //周限购 0 不限购
//             },
//             "4": {
//                 //序号ID
//                 title: "中级仙乐礼包",
//                 rwd: [
//                     [1, 1, 300],
//                     [1, 923, 6],
//                     [1, 924, 5],
//                 ], //获得什么 一个道具
//                 need: [10, 30], //需求价格
//                 limit: 0, //总限购 0 不限购
//                 limitDay: 1, //日限购 0 不限购
//                 limitWeek: 0, //周限购 0 不限购
//             },
//             "5": {
//                 //序号ID
//                 title: "高级仙乐礼包",
//                 rwd: [
//                     [1, 1, 680],
//                     [1, 923, 15],
//                     [1, 924, 10],
//                 ], //获得什么 一个道具
//                 need: [10, 68], //需求价格
//                 limit: 0, //总限购 0 不限购
//                 limitDay: 1, //日限购 0 不限购
//                 limitWeek: 0, //周限购 0 不限购
//             },
//             "6": {
//                 //序号ID
//                 title: "史诗仙乐礼包",
//                 rwd: [
//                     [1, 1, 1280],
//                     [1, 923, 32],
//                     [1, 924, 15],
//                 ], //获得什么 一个道具
//                 need: [10, 128], //需求价格
//                 limit: 0, //总限购 0 不限购
//                 limitDay: 1, //日限购 0 不限购
//                 limitWeek: 0, //周限购 0 不限购
//             },
//             "7": {
//                 //序号ID
//                 title: "豪华仙乐礼包",
//                 rwd: [
//                     [1, 1, 1980],
//                     [1, 923, 48],
//                     [1, 924, 25],
//                 ], //获得什么 一个道具
//                 need: [10, 198], //需求价格
//                 limit: 0, //总限购 0 不限购
//                 limitDay: 1, //日限购 0 不限购
//                 limitWeek: 0, //周限购 0 不限购
//             },
//             "8": {
//                 //序号ID
//                 title: "尊享仙乐礼包",
//                 rwd: [
//                     [1, 1, 3280],
//                     [1, 923, 60],
//                     [1, 924, 50],
//                 ], //获得什么 一个道具
//                 need: [10, 328], //需求价格
//                 limit: 0, //总限购 0 不限购
//                 limitDay: 2, //日限购 0 不限购
//                 limitWeek: 0, //周限购 0 不限购
//             },
//             "9": {
//                 //序号ID
//                 title: "至尊仙乐礼包",
//                 rwd: [
//                     [1, 1, 6480],
//                     [1, 923, 100],
//                     [1, 924, 100],
//                 ], //获得什么 一个道具
//                 need: [10, 648], //需求价格
//                 limit: 0, //总限购 0 不限购
//                 limitDay: 3, //日限购 0 不限购
//                 limitWeek: 0, //周限购 0 不限购
//             },
//         },
//         dhList: {
//             "1": {
//                 //序号ID
//                 rwd: [1, 816, 1], //获得什么 一个道具
//                 need: [1, 925, 25000], //需求价格
//                 needScore: 12500, //需求【排行总积分】
//                 limit: 3, //总限购 0 不限购
//                 limitDay: 0, //日限购 0 不限购
//                 limitMon: 0, //月限购 0 不限购
//             },
//             "2": {
//                 //序号ID
//                 rwd: [1, 76, 1], //获得什么 一个道具
//                 need: [1, 925, 15000], //需求价格
//                 needScore: 12500, //需求【排行总积分】
//                 limit: 1, //总限购 0 不限购
//                 limitDay: 0, //日限购 0 不限购
//                 limitMon: 0, //月限购 0 不限购
//             },
//             "3": {
//                 //序号ID
//                 rwd: [1, 80, 1], //获得什么 一个道具
//                 need: [1, 925, 8000], //需求价格
//                 needScore: 12500, //需求【排行总积分】
//                 limit: 5, //总限购 0 不限购
//                 limitDay: 0, //日限购 0 不限购
//                 limitMon: 0, //月限购 0 不限购
//             },
//             "4": {
//                 //序号ID
//                 rwd: [1, 202, 1], //获得什么 一个道具
//                 need: [1, 925, 300], //需求价格
//                 needScore: 12500, //需求【排行总积分】
//                 limit: 100, //总限购 0 不限购
//                 limitDay: 0, //日限购 0 不限购
//                 limitMon: 0, //月限购 0 不限购
//             },
//             "5": {
//                 //序号ID
//                 rwd: [1, 53, 1], //获得什么 一个道具
//                 need: [1, 925, 600], //需求价格
//                 needScore: 12500, //需求【排行总积分】
//                 limit: 20, //总限购 0 不限购
//                 limitDay: 0, //日限购 0 不限购
//                 limitMon: 0, //月限购 0 不限购
//             },
//             "6": {
//                 //序号ID
//                 rwd: [1, 806, 1], //获得什么 一个道具
//                 need: [1, 925, 10000], //需求价格
//                 needScore: 0, //需求【排行总积分】
//                 limit: 3, //总限购 0 不限购
//                 limitDay: 0, //日限购 0 不限购
//                 limitMon: 0, //月限购 0 不限购
//             },
//             "7": {
//                 //序号ID
//                 rwd: [1, 202, 1], //获得什么 一个道具
//                 need: [1, 925, 300], //需求价格
//                 needScore: 0, //需求【排行总积分】
//                 limit: 2, //总限购 0 不限购
//                 limitDay: 0, //日限购 0 不限购
//                 limitMon: 0, //月限购 0 不限购
//             },
//             "8": {
//                 //序号ID
//                 rwd: [1, 902, 20], //获得什么 一个道具
//                 need: [1, 925, 40], //需求价格
//                 needScore: 0, //需求【排行总积分】
//                 limit: 100, //总限购 0 不限购
//                 limitDay: 0, //日限购 0 不限购
//                 limitMon: 0, //月限购 0 不限购
//             },
//             "9": {
//                 //序号ID
//                 rwd: [1, 51, 4], //获得什么 一个道具
//                 need: [1, 925, 60], //需求价格
//                 needScore: 0, //需求【排行总积分】
//                 limit: 100, //总限购 0 不限购
//                 limitDay: 0, //日限购 0 不限购
//                 limitMon: 0, //月限购 0 不限购
//             },
//             "10": {
//                 //序号ID
//                 rwd: [1, 52, 1], //获得什么 一个道具
//                 need: [1, 925, 100], //需求价格
//                 needScore: 0, //需求【排行总积分】
//                 limit: 200, //总限购 0 不限购
//                 limitDay: 0, //日限购 0 不限购
//                 limitMon: 0, //月限购 0 不限购
//             },
//             "11": {
//                 //序号ID
//                 rwd: [1, 54, 200], //获得什么 一个道具
//                 need: [1, 925, 100], //需求价格
//                 needScore: 0, //需求【排行总积分】
//                 limit: 100, //总限购 0 不限购
//                 limitDay: 0, //日限购 0 不限购
//                 limitMon: 0, //月限购 0 不限购
//             },
//             "12": {
//                 //序号ID
//                 rwd: [1, 55, 20], //获得什么 一个道具
//                 need: [1, 925, 100], //需求价格
//                 needScore: 0, //需求【排行总积分】
//                 limit: 200, //总限购 0 不限购
//                 limitDay: 0, //日限购 0 不限购
//                 limitMon: 0, //月限购 0 不限购
//             },
//             "13": {
//                 //序号ID
//                 rwd: [1, 59, 3], //获得什么 一个道具
//                 need: [1, 925, 90], //需求价格
//                 needScore: 0, //需求【排行总积分】
//                 limit: 200, //总限购 0 不限购
//                 limitDay: 0, //日限购 0 不限购
//                 limitMon: 0, //月限购 0 不限购
//             },
//             "14": {
//                 //序号ID
//                 rwd: [1, 60, 50], //获得什么 一个道具
//                 need: [1, 925, 100], //需求价格
//                 needScore: 0, //需求【排行总积分】
//                 limit: 100, //总限购 0 不限购
//                 limitDay: 0, //日限购 0 不限购
//                 limitMon: 0, //月限购 0 不限购
//             },
//             "15": {
//                 //序号ID
//                 rwd: [1, 61, 5], //获得什么 一个道具
//                 need: [1, 925, 100], //需求价格
//                 needScore: 0, //需求【排行总积分】
//                 limit: 100, //总限购 0 不限购
//                 limitDay: 0, //日限购 0 不限购
//                 limitMon: 0, //月限购 0 不限购
//             },
//             "16": {
//                 //序号ID
//                 rwd: [1, 56, 1], //获得什么 一个道具
//                 need: [1, 925, 50], //需求价格
//                 needScore: 0, //需求【排行总积分】
//                 limit: 100, //总限购 0 不限购
//                 limitDay: 0, //日限购 0 不限购
//                 limitMon: 0, //月限购 0 不限购
//             },
//             "17": {
//                 //序号ID
//                 rwd: [1, 62, 4000], //获得什么 一个道具
//                 need: [1, 925, 200], //需求价格
//                 needScore: 0, //需求【排行总积分】
//                 limit: 100, //总限购 0 不限购
//                 limitDay: 0, //日限购 0 不限购
//                 limitMon: 0, //月限购 0 不限购
//             },
//         },
//         //消耗道具配置 921
//         playList: {
//             921: {
//                 score: 10, //积分
//                 items: [
//                     { item: [1, 902, 1], prob: 10000 },
//                     { item: [1, 902, 1], prob: 0 },
//                 ],
//             },
//             922: {
//                 score: 20, //积分
//                 items: [
//                     { item: [1, 902, 2], prob: 10000 },
//                     { item: [1, 902, 2], prob: 0 },
//                 ],
//             },
//             923: {
//                 score: 50, //积分
//                 items: [
//                     { item: [1, 902, 4], prob: 10000 },
//                     { item: [1, 902, 4], prob: 0 },
//                 ],
//             },
//             924: {
//                 score: 100, //积分
//                 items: [
//                     { item: [1, 902, 6], prob: 10000 },
//                     { item: [1, 902, 6], prob: 0 },
//                 ],
//             },
//         },
//         scoreItemId: [1, 925], //积分道具ID
//         lqList: {},
//         //排行奖励
//         rank: [
//             {
//                 pm: [1, 1],
//                 items: [
//                     [1, 56, 15],
//                     [1, 59, 60],
//                     [1, 902, 100],
//                 ],
//             },
//             {
//                 pm: [2, 2],
//                 items: [
//                     [1, 56, 12],
//                     [1, 59, 50],
//                     [1, 902, 90],
//                 ],
//             },
//             {
//                 pm: [3, 3],
//                 items: [
//                     [1, 56, 10],
//                     [1, 59, 40],
//                     [1, 902, 80],
//                 ],
//             },
//             {
//                 pm: [4, 5],
//                 items: [
//                     [1, 56, 8],
//                     [1, 59, 30],
//                     [1, 902, 70],
//                 ],
//             },
//             {
//                 pm: [6, 10],
//                 items: [
//                     [1, 56, 7],
//                     [1, 59, 20],
//                     [1, 902, 60],
//                 ],
//             },
//             {
//                 pm: [11, 20],
//                 items: [
//                     [1, 56, 6],
//                     [1, 59, 10],
//                     [1, 902, 50],
//                 ],
//             },
//             {
//                 pm: [21, 35],
//                 items: [
//                     [1, 56, 5],
//                     [1, 59, 8],
//                     [1, 902, 40],
//                 ],
//             },
//             {
//                 pm: [36, 50],
//                 items: [
//                     [1, 56, 4],
//                     [1, 59, 6],
//                     [1, 902, 30],
//                 ],
//             },
//             {
//                 pm: [51, 75],
//                 items: [
//                     [1, 56, 3],
//                     [1, 59, 4],
//                     [1, 902, 20],
//                 ],
//             },
//             {
//                 pm: [76, 100],
//                 items: [
//                     [1, 56, 2],
//                     [1, 59, 2],
//                     [1, 902, 10],
//                 ],
//             },
//             {
//                 pm: [101, 999],
//                 items: [
//                     [1, 56, 1],
//                     [1, 59, 1],
//                     [1, 902, 5],
//                 ],
//             },
//         ],
//         //排行奖励 跨服
//         rank2: [
//             {
//                 pm: [1, 1],
//                 items: [
//                     [1, 1500, 15],
//                     [1, 62, 24000],
//                     [1, 902, 150],
//                 ],
//             },
//             {
//                 pm: [2, 2],
//                 items: [
//                     [1, 1500, 12],
//                     [1, 62, 20000],
//                     [1, 902, 120],
//                 ],
//             },
//             {
//                 pm: [3, 3],
//                 items: [
//                     [1, 1500, 10],
//                     [1, 62, 16000],
//                     [1, 902, 100],
//                 ],
//             },
//             {
//                 pm: [4, 5],
//                 items: [
//                     [1, 1500, 8],
//                     [1, 62, 12000],
//                     [1, 902, 80],
//                 ],
//             },
//             {
//                 pm: [6, 10],
//                 items: [
//                     [1, 1500, 7],
//                     [1, 62, 8000],
//                     [1, 902, 70],
//                 ],
//             },
//             {
//                 pm: [11, 20],
//                 items: [
//                     [1, 1500, 6],
//                     [1, 62, 4000],
//                     [1, 902, 60],
//                 ],
//             },
//             {
//                 pm: [21, 35],
//                 items: [
//                     [1, 1500, 5],
//                     [1, 62, 3200],
//                     [1, 902, 50],
//                 ],
//             },
//             {
//                 pm: [36, 50],
//                 items: [
//                     [1, 1500, 4],
//                     [1, 62, 2400],
//                     [1, 902, 40],
//                 ],
//             },
//             {
//                 pm: [51, 75],
//                 items: [
//                     [1, 1500, 3],
//                     [1, 62, 1600],
//                     [1, 902, 30],
//                 ],
//             },
//             {
//                 pm: [76, 100],
//                 items: [
//                     [1, 1500, 2],
//                     [1, 62, 800],
//                     [1, 902, 20],
//                 ],
//             },
//             {
//                 pm: [101, 999],
//                 items: [
//                     [1, 1500, 1],
//                     [1, 62, 400],
//                     [1, 902, 10],
//                 ],
//             },
//         ],
//     },
// };
//# sourceMappingURL=HdTianGongModel.js.map