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
exports.HdDouLuoModel = void 0;
const AModel_1 = require("../AModel");
const Xys = __importStar(require("../../../common/Xys"));
const master_1 = require("../../util/master");
const gameMethod_1 = require("../../../common/gameMethod");
const game_1 = __importDefault(require("../../util/game"));
const RdsUserModel_1 = require("../redis/RdsUserModel");
const SevDouLuoModel_1 = require("../sev/SevDouLuoModel");
const UserModel_1 = require("../user/UserModel");
const cache_1 = __importDefault(require("../../util/cache"));
/**
 * 最强斗罗
 * 跨服pvp
 */
class HdDouLuoModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdDouLuo"; //用于存储key 和  输出1级key
        this.outIsAu = true; //下发数据是否用au下发
        this.dType = master_1.DataType.user;
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
            item: 0,
            itemCd: 0,
            itemNext: 0,
            itemBuy: 0,
            //刷新cd 上次手动刷新时间
            rtime: 0,
            //挑战表
            tzList: [],
            //扫荡人
            sdList: [],
            //每日重置
            outTimeDay: 0,
            //每周重置
            //20231009 版本新增
            score: 0,
            minRid: 99999,
            shop: {},
            chengjiu: {},
            islogin: 0,
            bugVer: 3
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        let cfg = (await this.getHdCfg());
        //获取最强斗罗周ID
        let weekId = game_1.default.getDouLuoWeek();
        if (cfg != null && (cfg.info.id != info.hdid || info.weekId != weekId)) {
            // let info_bak = gameMethod.objCopy(info);
            // info = this.init();
            //写入重置ID
            info.weekId = weekId;
            info.hdid = cfg.info.id;
            info.item = 0;
            info.itemCd = 0;
            info.itemNext = 0;
            info.itemBuy = 0;
            info.rtime = 0;
            info.tzList = [];
            info.sdList = [];
            info.outTimeDay = 0;
            info.score = 0;
            info.minRid = 99999;
            info.shop = {};
            //保存 后 初始化挑战表
            await this.update(info, ["outf", "red"]);
            //初始化挑战表
            await this._refresh();
        }
        let sevDouLuoModel = SevDouLuoModel_1.SevDouLuoModel.getInstance(this.ctx, "1", this.hdcid);
        info.ksid = await sevDouLuoModel.getDLKidBySid(this.ctx.state.sid);
        //每日重置
        if (this.ctx.state.newTime > info.outTimeDay) {
            info.outTimeDay = this.ctx.state.new0 + 86400;
            //累计购买次数
            info.itemBuy = 0;
        }
        //CD恢复
        let cdData = game_1.default.cdTime(info.itemCd, info.item, cfg.data.itemCd, cfg.data.itemMax);
        info.item = cdData.count;
        info.itemCd = cdData.stime;
        info.itemNext = cdData.next;
        if (info.score == null) {
            info.score = 0;
        }
        if (info.minRid == null) {
            info.minRid = 9999;
        }
        if (info.shop == null) {
            info.shop = {};
        }
        if (info.chengjiu == null) {
            info.chengjiu = {};
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
    async getOutPut_u(key) {
        let cfg = (await this.getHdCfg());
        if (cfg == null) {
            return null;
        }
        switch (key) {
            case "info":
            case "data":
                return cfg[key];
            case "red":
                return await this.getRed();
            case "outf":
                return await this.getOutPut_outf();
        }
        return null;
    }
    //输出我的信息 //刷页面
    async getOutPut_outf() {
        let info = await this.getInfo();
        //排行
        let rdsUserModel = RdsUserModel_1.RdsUserModel.getInstance(this.ctx, Xys.RdsUser.rdsDouLuo, info.ksid, this.hdcid, info.weekId);
        //获取我的当前排名
        let score = await rdsUserModel.zScore(this.id); //score 1 开始
        if (score == null) {
            score = '501';
        }
        let rid = Number(score);
        if (rid == null || rid >= 500) {
            rid = 500;
        }
        // rid += 1; //rid 这边转换为 1 开始
        //挑战表
        let tjIds = {
            1: 0,
            2: 0,
            3: 0,
        };
        //再放 我的挑战人表
        for (let i = 0; i < info.tzList.length; i++) {
            const frid = info.tzList[i]; //frid 1 开始
            tjIds[frid] = 1; //可以打的
        }
        //再放 我自己
        tjIds[rid] = 0;
        //再放 我的扫荡表 //最后一名 没得扫荡
        if (rid < 500) {
            for (let i = 0; i < info.sdList.length; i++) {
                const frid = info.sdList[i];
                tjIds[frid] = 2; //可以扫荡的
            }
        }
        let tzList = [];
        let auser = 0;
        for (const _rid in tjIds) { //_rid 1开始
            auser += 1;
            if (auser > 8) {
                break;
            }
            if (Number(_rid) == 501 || rid == Number(_rid)) { //我自己
                let userModel = UserModel_1.UserModel.getInstance(this.ctx, this.id);
                //我自己 getFUserInfo
                let fuser = await userModel.getFUserInfo();
                fuser.rid = _rid;
                fuser.score = 0;
                fuser.sevBack = (await userModel.getFUserAll()).sevBack;
                fuser.type = tjIds[_rid];
                tzList.push(fuser);
            }
            else {
                let fuser = await rdsUserModel.getInfoByRid(this.ctx, Number(_rid));
                if (gameMethod_1.gameMethod.isNpc(fuser.uuid) != true) {
                    let fuserAll = await cache_1.default.getFUser(this.ctx, fuser.uuid);
                    fuser.sevBack = fuserAll.sevBack;
                }
                fuser.type = tjIds[_rid];
                tzList.push(fuser);
            }
        }
        return {
            ksid: info.ksid,
            item: info.item,
            itemBuy: info.itemBuy,
            itemNext: info.itemNext,
            //刷新cd 上次手动刷新时间
            rtime: 0,
            //挑战表
            tzList: tzList,
            //每日重置
            outTimeDay: info.outTimeDay,
            //每周重置
            // outTimeWeek: info.outTimeWeek, //每周结束时间点
            //20231009 版本新增
            score: info.score,
            minRid: info.minRid,
            shop: info.shop,
            chengjiu: info.chengjiu,
        };
    }
    /**
     * 获取红点
     */
    async getRed() {
        //体力 输出红点
        //模块数据的读取
        //方法 数据 
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            return 0;
        }
        let info = await this.getInfo();
        if (info.item >= 1 && info.islogin == 1) {
            return 1;
        }
        //成就
        for (const dc in cfg.data.chengjiu) {
            if (info.minRid > parseInt(dc)) {
                continue;
            }
            if (info.chengjiu[dc] != null) {
                continue;
            }
            return 1;
        }
        return 0;
    }
    /**
     * 是否处于战斗时间内
     */
    in_fight(onliClick = false) {
        if (game_1.default.inDouLuoTime()) {
            return true;
        }
        if (onliClick) {
            return false;
        }
        this.ctx.throw(`活动时间还没到`);
    }
    /**
     * 设置是否登录
     */
    async setLogin(val) {
        //获取配置
        let cfg = (await this.getHdCfg());
        if (cfg == null) {
            return null;
        }
        let info = await this.getInfo();
        info.islogin = val;
        await this.update(info, [""]);
    }
    /**
     * 刷新 业务调用
     */
    async refresh() {
        //获取配置
        let cfg = (await this.getHdCfg());
        if (cfg == null) {
            return null;
        }
        //扣除需求
        await this.ctx.state.master.subItem1(cfg.data.refNeed);
        //CD判定 未做
        //刷新
        await this._refresh();
    }
    async resetMinRid() {
        let info = await this.getInfo();
        //获取我的当前名次
        let rdsUserModel = RdsUserModel_1.RdsUserModel.getInstance(this.ctx, Xys.RdsUser.rdsDouLuo, info.ksid, this.hdcid, info.weekId);
        let oldrid = await rdsUserModel.zRevrank(this.id);
        if (oldrid == null || info.minRid < oldrid) {
            return;
        }
        info.minRid = oldrid;
        await this.update(info, [""]);
    }
    /**
     * 刷新
     * 榜外沙箱
     *  501
     * 501 无限叠加位置 所有>500名的 认为是501
     *
     * 500  //标识未我的 榜外排名
     * 499  //无限叠加 只出NPC
     * 498  //无限叠加 只出NPC
     * 497  //无限叠加 只出NPC
     * 496  //无限叠加 只出NPC
     * 495  //无限叠加 只出NPC
     * 494  //正常位
     *
     * //正常榜单区间  1~494
     * //无限叠加区间  495~500 //这期间的玩家 无限叠加 //这期间只会被刷出NPC 给未进榜单玩家刷
     *
     */
    async _refresh() {
        let info = await this.getInfo();
        //获取我的当前名次
        let rdsUserModel = RdsUserModel_1.RdsUserModel.getInstance(this.ctx, Xys.RdsUser.rdsDouLuo, info.ksid, this.hdcid, info.weekId);
        //获取配置
        let cfg = (await this.getHdCfg());
        if (cfg == null) {
            return null;
        }
        info.sdList = [];
        //根据我的 uuid 获取 我的名次
        // let oldrid = await rdsUserModel.zRevrank(this.id);
        let score = await rdsUserModel.zScore(this.id);
        if (score == null) {
            score = '501';
        }
        let rid = Math.round(Number(score)) - 1; //下面算法 是按照 名次-1 来计算你的
        if (rid == null || rid >= 500) {
            // rid = 500;
            //从495 ~ 499 里面 随机出X个 //500 只用来 给最后的人 刷 不参与
            info.tzList = game_1.default.getRandArr([495, 496, 497, 498, 499], 3);
        }
        else {
            rid += 1; //转换为 1 开始
            //根据名次 获取该名次下的 跨度人数
            //跨度人数
            let kd = 1;
            for (let i = 0; i < cfg.data.kd.length; i++) {
                const element = cfg.data.kd[i];
                if (rid <= cfg.data.kd[i][0]) {
                    kd = cfg.data.kd[i][1];
                    break;
                }
            }
            //挑战表 3 人
            info.tzList = [];
            for (let i = 0; i < 3; i++) {
                //起始名次
                let s_rid = rid - kd * (i + 1);
                //结束名次
                let e_rid = rid - kd * i - 1;
                if (s_rid > 0) {
                    let trid = gameMethod_1.gameMethod.rand(s_rid, e_rid);
                    info.tzList.push(trid);
                }
            }
            //扫荡表 放满7人 根据需求 截取
            for (let i = 0; i < 7; i++) {
                // const element = array[i];
                //起始名次
                let s_rid = rid + kd * i + 1;
                //结束名次
                let e_rid = rid + kd * (i + 1);
                //扫荡范围 旧名次497 新名次498 s_rid499 e_rid505
                // console.log(`扫荡范围 旧名次${oldrid} 新名次${rid} s_rid${s_rid} e_rid${e_rid}`)
                let sdrid = gameMethod_1.gameMethod.rand(s_rid, e_rid);
                if (sdrid >= 500) {
                    info.sdList.push(500);
                    break;
                }
                info.sdList.push(sdrid);
            }
            // info.sdUser = [gameMethod.rand(Math.min(rid + 1, 500), Math.min(rid + kd, 500))];
        }
        await this.update(info, ["outf", "red"]);
    }
    /**
     * 购买XX
     */
    async buy(count) {
        //参数安全化
        count = Number(count);
        if (count <= 0) {
            this.ctx.throw(`count_err:${count}`);
        }
        let info = await this.getInfo();
        //获取配置
        let cfg = (await this.getHdCfg());
        if (cfg == null) {
            return null;
        }
        if (info.itemBuy + count > cfg.data.buyMax) {
            this.ctx.throw(`购买上限`);
        }
        //价格 每次购买价格
        //扣除需求金额
        let buyNeed = gameMethod_1.gameMethod.objCopy(cfg.data.buyNeed);
        buyNeed[2] *= count;
        await this.ctx.state.master.subItem1(buyNeed);
        info.itemBuy += count;
        //加上XX
        info.item += count;
        //更新
        await this.update(info, ["outf", "red"]);
    }
    /**
     * 扫荡
     */
    async sd(count, rid) {
        // //我是否有这个可以扫荡的玩家
        //获取配置
        let cfg = (await this.getHdCfg());
        if (cfg == null) {
            this.ctx.throw("活动未开启");
        }
        //扣除次数
        count = await this.subItem(count);
        //道具倍数
        for (let i = 0; i < count; i++) {
            await this.ctx.state.master.addItem2(cfg.data.sdRwd);
        }
    }
    //扣除挑战次数 //返回实际扣除次数
    async subItem(count) {
        //参数安全化
        count = Number(count);
        if (count <= 0 || count > 5) {
            this.ctx.throw(`count_err:${count}`);
        }
        //获取配置
        let cfg = (await this.getHdCfg());
        if (cfg == null) {
            this.ctx.throw("活动未开启");
        }
        let info = await this.getInfo();
        //是否验证 扫荡名次ID?
        //不验证 错就错了
        //扣除XX
        if (info.item <= 0) {
            this.ctx.throw(`道具不足`);
        }
        count = Math.min(info.item, count);
        info.item -= count;
        //更新
        await this.update(info, ["outf", "red"]);
        return count;
    }
    async getWinRwd(rid) {
        //获取配置
        let cfg = (await this.getHdCfg());
        if (cfg == null) {
            return [];
        }
        let info = await this.getInfo();
        if (info.minRid > rid) {
            info.minRid = rid;
            //更新
            await this.update(info, ["outf", "red"]);
        }
        return cfg.data.winRwd;
    }
    async getLoseRwd() {
        //获取配置
        let cfg = (await this.getHdCfg());
        if (cfg == null) {
            return [];
        }
        return cfg.data.loseRwd;
    }
    async addScore(count) {
        //获取配置
        let cfg = (await this.getHdCfg());
        if (cfg == null) {
            return;
        }
        let info = await this.getInfo();
        info.score += count;
        await this.update(info, ["outf", "red"]);
    }
    /**
     * 最强斗罗商店购买
     * @param dc
     */
    async shopBuy(dc, count) {
        //获取配置
        let cfg = (await this.getHdCfg());
        if (cfg == null) {
            this.ctx.throw("活动已过期");
        }
        if (cfg.data.shop[dc] == null) {
            this.ctx.throw("配置错误");
        }
        let info = await this.getInfo();
        if (info.shop[dc] == null) {
            info.shop[dc] = 0;
        }
        if (info.shop[dc] + count > cfg.data.shop[dc].limit) {
            this.ctx.throw("超过购买次数");
        }
        if (info.score < cfg.data.shop[dc].needScore) {
            this.ctx.throw("不满足购买条件");
        }
        await this.ctx.state.master.subItem1([cfg.data.shop[dc].need[0], cfg.data.shop[dc].need[1], cfg.data.shop[dc].need[2] * count]);
        info.shop[dc] += count;
        await this.update(info, ["outf", "red"]);
        await this.ctx.state.master.addItem1([cfg.data.shop[dc].item[0], cfg.data.shop[dc].item[1], cfg.data.shop[dc].item[2] * count]);
    }
    /**
     * 最强斗罗成就领取
     * @param dc
     */
    async chengJiuRwd(dc) {
        //获取配置
        let cfg = (await this.getHdCfg());
        if (cfg == null) {
            this.ctx.throw("活动已过期");
        }
        if (cfg.data.chengjiu[dc] == null) {
            this.ctx.throw("配置错误");
        }
        let info = await this.getInfo();
        if (info.chengjiu[dc] != null) {
            this.ctx.throw("已领取");
        }
        if (info.minRid > parseInt(dc)) {
            this.ctx.throw("条件未完成");
        }
        info.chengjiu[dc] = this.ctx.state.newTime;
        await this.update(info, ["outf", "red"]);
        await this.ctx.state.master.addItem2(cfg.data.chengjiu[dc]);
    }
}
exports.HdDouLuoModel = HdDouLuoModel;
//# sourceMappingURL=HdDouLuoModel.js.map