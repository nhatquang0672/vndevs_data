"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActJjcInfoModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const gameMethod_1 = require("../../../common/gameMethod");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const game_1 = __importDefault(require("../../util/game"));
const RdsUserModel_1 = require("../redis/RdsUserModel");
const setting_1 = __importDefault(require("../../crontab/setting"));
const ActJjcLogModel_1 = require("./ActJjcLogModel");
const lock_1 = __importDefault(require("../../util/lock"));
const tool_1 = require("../../util/tool");
const cache_1 = __importDefault(require("../../util/cache"));
const SevJjcModel_1 = require("../sev/SevJjcModel");
const SevPaoMaModel_1 = require("../sev/SevPaoMaModel");
/**
 * Jjc 信息
 */
class ActJjcInfoModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actJjcInfo"; //用于存储key 和  输出1级key
        this.outIsAu = false; //下发数据是否用au下发
        this.dType = master_1.DataType.user;
    }
    //单例模式
    static getInstance(ctx, uuid, hdcid = '1') {
        let dlKey = this.name + '_' + uuid + '_' + hdcid; //单例模式key
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
        let jjc_day_time = tool_1.tool.mathcfg_count(this.ctx, 'jjc_day_time');
        let dayAt = 0;
        if (this.ctx.state.newTime >= this.ctx.state.new0 + jjc_day_time) {
            dayAt = this.ctx.state.new0 + jjc_day_time + 86400; //明天晚上10点
        }
        else {
            dayAt = this.ctx.state.new0 + jjc_day_time; //今天晚上10点
        }
        let jjc_week_time = tool_1.tool.mathcfg_item(this.ctx, 'jjc_week_time');
        let weekAt = 0;
        let week0 = game_1.default.getWeek0(this.ctx.state.newTime);
        if (this.ctx.state.newTime >= week0 + jjc_week_time[0]) {
            weekAt = week0 + jjc_week_time[0] + 86400 * 7; //下周六晚上10点
        }
        else {
            weekAt = week0 + jjc_week_time[0]; //周六晚上10点
        }
        return {
            lastDayRid: -1,
            lastWeekRid: -1,
            cons: 0,
            dayAt: dayAt,
            weekAt: weekAt,
            dItems: [],
            wItems: [],
            get5: {},
            refreAt: 0,
            refreNum: 0,
            pkNum: 0,
            bug0521: 1,
            hfVer: "",
            winCount: 0,
            datAt: 0,
            pkwin: 0,
            bugver: 4
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        if (info.pkNum == null) {
            info.pkNum = 0;
        }
        if (info.winCount == null) {
            info.winCount = 0;
        }
        if (info.datAt == null) {
            info.datAt = 0;
        }
        if (info.pkwin == null) {
            info.pkwin = 0;
        }
        if (info.datAt < this.ctx.state.new0) {
            info.datAt = this.ctx.state.newTime;
            info.winCount = 0;
        }
        if (info.weekAt == 1682776800) {
            info.weekAt += 86400; //修复20230424 时间配置的错误
        }
        let isUpdate = false;
        if (info.bug0521 == null && this.ctx.state.regtime < 1684677600) {
            info.bug0521 = 1;
            if (info.dayAt == 1684764000) {
                info.dayAt = 1684677600;
                isUpdate = true;
            }
        }
        let heid = await this.getHeIdByUuid(this.id);
        let rdsHdcid = "x";
        let cfgSysHefu = setting_1.default.getSetting("1", "sys_hefu");
        if (cfgSysHefu != null && cfgSysHefu.list[heid] != null) {
            let hfAt = cfgSysHefu.list[heid].newVer;
            if (info.hfVer != hfAt) {
                info.hfVer = hfAt;
                isUpdate = true;
                heid = cfgSysHefu.list[heid].oldSid;
                rdsHdcid = "old";
            }
        }
        //每日奖励
        if (this.ctx.state.newTime >= info.dayAt) {
            let jjc_day_time = tool_1.tool.mathcfg_count(this.ctx, 'jjc_day_time');
            //查看奖励是否领取到
            let dayRwd = setting_1.default.getSysRwds(heid, 'jjcDay', rdsHdcid, this.ctx.state.newTime);
            let isClose = 0;
            let cfgSystem = setting_1.default.getSetting("1", "system");
            if (cfgSystem != null && cfgSystem.jjc_day_rwd == 1) {
                isClose = 1;
            }
            if (dayRwd != null && isClose == 0) { //如果为空需要等待奖励到达
                if (this.ctx.state.newTime >= this.ctx.state.new0 + jjc_day_time) {
                    info.dayAt = this.ctx.state.new0 + jjc_day_time + 86400; //明天晚上10点
                }
                else {
                    info.dayAt = this.ctx.state.new0 + jjc_day_time; //今天晚上10点
                }
                info.refreNum = 0;
                info.winCount = 0;
                if (dayRwd[this.id] != null) {
                    let rid = dayRwd[this.id][0];
                    info.lastDayRid = rid;
                    let cfgDayPool = gameCfg_1.default.jjcDay.pool;
                    for (const key in cfgDayPool) {
                        if (rid <= parseInt(cfgDayPool[key].id)) {
                            info.dItems = cfgDayPool[key].items;
                            isUpdate = true;
                            break;
                        }
                    }
                }
                //重新获取5个
                if (game_1.default.weekId() == 7) {
                    await this.get5();
                }
            }
        }
        //每周奖励
        if (this.ctx.state.newTime >= info.weekAt) {
            let rdsUserModel = await new RdsUserModel_1.RdsUserModel("rdsJjc", rdsHdcid, heid, tool_1.tool.jjcWeekId(info.weekAt - 1));
            let _myr = await rdsUserModel.zRevrank(this.id);
            if (_myr != null) { //有排名才发
                let myrid = _myr + 1;
                info.lastWeekRid = myrid;
                let cfgWeekPool = gameCfg_1.default.jjcWeek.pool;
                for (const key in cfgWeekPool) {
                    if (myrid <= parseInt(cfgWeekPool[key].id)) {
                        info.wItems = cfgWeekPool[key].items;
                        isUpdate = true;
                        break;
                    }
                }
            }
            let week0 = game_1.default.getWeek0(this.ctx.state.newTime);
            let jjc_week_time = tool_1.tool.mathcfg_item(this.ctx, 'jjc_week_time');
            if (this.ctx.state.newTime >= week0 + jjc_week_time[0]) {
                info.weekAt = week0 + jjc_week_time[0] + 86400 * 7; //下周六晚上10点
            }
            else {
                info.weekAt = week0 + jjc_week_time[0]; //周六晚上10点
            }
        }
        if (info.bugver != 4 && parseInt(this.ctx.state.sid) < 75) {
            info.bugver = 4;
            let rdsUserModel = await new RdsUserModel_1.RdsUserModel("rdsJjc", 'x', await this.getHeIdByUuid(this.id), tool_1.tool.jjcWeekId(this.ctx.state.newTime));
            await rdsUserModel.zSet(this.id, 1500);
            await this.get5();
            isUpdate = true;
        }
        if (isUpdate) {
            await this.update(info);
        }
        return info;
    }
    /**
     * 返回数据
     */
    async getOutPut() {
        let info = await this.getInfo();
        return {
            lastDayRid: info.lastDayRid,
            lastWeekRid: info.lastWeekRid,
            cons: info.cons,
            dayAt: info.dayAt,
            weekAt: info.weekAt,
            dItems: info.dItems,
            wItems: info.wItems,
            get5: Object.values(info.get5),
            refreAt: info.refreAt,
            pkNum: info.pkNum,
            winCount: info.winCount,
            pkwin: info.pkwin
        };
    }
    /**
    *  进入竞技场
    */
    async into() {
        let rdsUserModel = await new RdsUserModel_1.RdsUserModel("rdsJjc", 'x', await this.getHeIdByUuid(this.id), tool_1.tool.jjcWeekId(this.ctx.state.newTime));
        if (await rdsUserModel.zRevrank(this.id) == null) {
            await rdsUserModel.zSet(this.id, 1500);
            await this.get5();
        }
    }
    /**
    *  获取5个对手
    * o匹配规则：
        1、匹配范围玩家的名次向下取10名到向上取20名 例如玩家当前的名次是: 50名那玩家匹配的范围就是: 第60~30名刷新就在这个范围里面
        这个范围里面优先刷出同等级对手，如这些对手在战斗冷却中会略过，再筛选等级±1级的对手，±2级的对手，以此类推。
        无对手则扩大名次搜索。实在没人，就找积分最近的机器人补齐（机器人补齐，就包括冷却中的也会出现）
    */
    async get5() {
        let sevJjcModel = SevJjcModel_1.SevJjcModel.getInstance(this.ctx, await this.getHeIdByUuid(this.id));
        let sevJjc = await sevJjcModel.getInfo();
        let rdsUserModel = await new RdsUserModel_1.RdsUserModel("rdsJjc", 'x', await this.getHeIdByUuid(this.id), tool_1.tool.jjcWeekId(this.ctx.state.newTime));
        let myRid = (await rdsUserModel.zRevrank(this.id)) + 1; //从1开始
        let myScore = Math.ceil(parseFloat(await rdsUserModel.zScore(this.id)));
        let f30 = [];
        let n20 = [];
        //向上找 20名真实玩家  向下找 10名真实玩家
        let minRid = Math.max(1, myRid - 20);
        let maxRid = myRid + 10;
        let rds30 = await rdsUserModel.getRankBetween(minRid, maxRid); //获取我附近榜单玩家
        for (let index = 0; index < rds30.length; index += 2) {
            let fuuid = rds30[index];
            if (fuuid == this.id) {
                continue;
            }
            if (parseInt(fuuid) < 100000) {
                continue; //兼容错误 ， 过滤机器人
            }
            if (sevJjc.list[fuuid] != null) {
                continue; //保护中
            }
            if (f30.length >= 30) {
                break;
            }
            let score = Math.ceil(parseFloat(rds30[index + 1]));
            let fuser = await cache_1.default.getFUser(this.ctx, fuuid);
            f30.push({ fuuid: fuuid, score: score, clv: Math.abs(this.ctx.state.level - fuser.level) });
        }
        let npcPoolArr = Object.values(gameCfg_1.default.jjcNpc.pool);
        npcPoolArr.sort(function (a, b) {
            return Math.abs(a.score - myScore) - Math.abs(b.score - myScore);
        });
        for (const cfgnpc of npcPoolArr) {
            if (n20.length >= 20) {
                continue;
            }
            n20.push({ fuuid: cfgnpc.id, score: cfgnpc.score, clv: cfgnpc.level });
        }
        let g5 = [];
        f30 = game_1.default.shuffle(f30);
        n20 = game_1.default.shuffle(n20);
        //真实玩家根据等级排序
        f30.sort(function (a, b) {
            return b.clv - a.clv; //最大排前面，因为后面获取一个附近等级玩家取的是最后一个
        });
        //当前需要获取NPC个数
        let needNpc = await this.getNpcNum();
        //获取真实玩家
        for (let index = 0; index < 5 - needNpc; index++) {
            //先获取1个相近等级的 ，其他随机抽取
            if (index > 0) {
                f30 = game_1.default.shuffle(f30);
            }
            let gOne = f30.pop();
            if (gOne != null && gOne.fuuid != this.id) {
                g5.push([gOne.fuuid, gOne.score]);
            }
        }
        //不足5个 补齐
        while (g5.length < 5 && n20.length > 0) {
            let gOne = n20.pop();
            if (gOne != null) {
                g5.push([gOne.fuuid, gOne.score]);
            }
            else {
                break;
            }
        }
        let info = await this.getInfo();
        info.get5 = {};
        g5 = game_1.default.shuffle(g5);
        for (const g of g5) {
            if (g[0] == this.id) {
                continue;
            }
            let fuser = null;
            //找出一个同等级的玩家进行展示
            let fuuid = g[0];
            if (parseInt(g[0]) < 100000) {
                //机器人
                let cfg = gameCfg_1.default.jjcNpc.getItemCtx(this.ctx, g[0]);
                fuser = {
                    uuid: g[0],
                    sid: this.ctx.state.sid,
                    name: cfg.name,
                    sex: 0,
                    head: "",
                    level: cfg.level,
                    lastlogin: this.ctx.state.newTime,
                    score: g[1],
                    bhAt: sevJjc.list[g[0]] == null ? 0 : sevJjc.list[g[0]],
                    clubName: "",
                    chid: "1",
                    cbid: "1",
                };
                let _fuuid = await cache_1.default.getJjcFuuid(this.ctx.state.level, this.ctx.state.newTime);
                if (_fuuid != "" && _fuuid != null) {
                    fuuid = _fuuid;
                }
            }
            else {
                fuser = await cache_1.default.getFUser(this.ctx, g[0]);
            }
            info.get5[g[0]] = fuser;
            info.get5[g[0]].score = g[1];
            info.get5[g[0]].bhAt = sevJjc.list[g[0]] == null ? 0 : sevJjc.list[g[0]];
            info.get5[g[0]].fuuid = fuuid;
        }
        info.refreNum += 1;
        await this.update(info);
    }
    /**
     * 战斗积分结算
     * @param fuuid 对手uuid
     * @param win 我方1胜利0失败
     * @param type 0战斗1复仇
     */
    async fightEnd(fuuid, win, type) {
        let info = await this.getInfo();
        let rdsUserModel = await new RdsUserModel_1.RdsUserModel("rdsJjc", 'x', await this.getHeIdByUuid(this.id), tool_1.tool.jjcWeekId(this.ctx.state.newTime));
        let myScore = Math.ceil(parseFloat(await rdsUserModel.zScore(this.id)));
        //我刚开始的排名
        let myRidOld = (await rdsUserModel.zRevrank(this.id)) + 1; //从1开始
        let fScore = 1500;
        if (parseInt(fuuid) >= 100000) {
            fScore = Math.ceil(parseFloat(await rdsUserModel.zScore(fuuid)));
        }
        else {
            fScore = gameCfg_1.default.jjcNpc.getItemCtx(this.ctx, fuuid).score;
        }
        //[我方积分，对方积分]
        let getScores = [0, 0];
        let winScore = 0;
        let loseScore = 0;
        if (win == 1) {
            if (myScore > fScore) {
                winScore = Math.floor(Math.max(1 - (myScore - fScore) / fScore, 0.3) * 16);
            }
            else {
                winScore = Math.floor(Math.min(1 - (fScore - myScore) / myScore, 1.5) * 16);
            }
            if (fScore >= 1800) {
                loseScore = winScore;
            }
            else {
                loseScore = Math.max(0, winScore - 8);
            }
            if (type == 1) {
                loseScore = winScore;
            }
            if (winScore > 0) {
                await rdsUserModel.zAdd(this.id, winScore);
            }
            if (parseInt(fuuid) >= 100000 && loseScore > 0) {
                await rdsUserModel.zAdd(fuuid, (-1) * loseScore);
            }
            getScores = [winScore, (-1) * loseScore];
            if (type == 0) {
                let actJjcLogModel = ActJjcLogModel_1.ActJjcLogModel.getInstance(this.ctx, this.id);
                await actJjcLogModel.addLog(fuuid, 1, winScore, 2);
            }
            //加入日志
            if (type == 0 && parseInt(fuuid) >= 100000) {
                await lock_1.default.setLock(this.ctx, 'user', fuuid); //枷锁
                this.ctx.state.fuuid = fuuid;
                let factJjcLogModel = ActJjcLogModel_1.ActJjcLogModel.getInstance(this.ctx, fuuid);
                await factJjcLogModel.addLog(this.id, 0, (-1) * loseScore);
                this.ctx.state.fuuid = "";
                //加入保护期
                await lock_1.default.setLock(this.ctx, "sevJjc", await this.getHeIdByUuid(this.id)); //枷锁
                let sevJjcModel = SevJjcModel_1.SevJjcModel.getInstance(this.ctx, await this.getHeIdByUuid(this.id));
                await sevJjcModel.addList(fuuid);
            }
            let jjcSx = gameCfg_1.default.jjcShuaxin.getItem((info.winCount + 1).toString());
            if (jjcSx != null) {
                info.winCount += 1;
            }
            if (parseInt(fuuid) >= 100000) {
                info.pkwin += 1;
            }
        }
        else {
            if (fScore > myScore) {
                winScore = Math.floor(Math.max(1 - (fScore - myScore) / myScore, 0.3) * 16);
            }
            else {
                winScore = Math.floor(Math.min(1 - (myScore - fScore) / fScore, 1.5) * 16);
            }
            if (myScore >= 1800) {
                loseScore = winScore;
            }
            else {
                loseScore = Math.max(0, winScore - 8);
            }
            if (type == 1) {
                loseScore = 0;
                winScore = 0;
            }
            if (parseInt(fuuid) >= 100000 && winScore > 0) {
                await rdsUserModel.zAdd(fuuid, winScore);
            }
            if (loseScore > 0) {
                await rdsUserModel.zAdd(this.id, (-1) * loseScore);
            }
            getScores = [(-1) * loseScore, winScore];
            if (type == 0) {
                let actJjcLogModel = ActJjcLogModel_1.ActJjcLogModel.getInstance(this.ctx, this.id);
                await actJjcLogModel.addLog(fuuid, 0, (-1) * loseScore, 2);
            }
        }
        info.pkNum += 1;
        await this.update(info);
        //下发我的排名信息
        await rdsUserModel.backData_my(this.ctx, this.id);
        //下发前20名榜单信息
        let myRid = (await rdsUserModel.zRevrank(this.id)) + 1; //从1开始
        if (myRid <= 10) {
            await rdsUserModel.backData_u(this.ctx, 1, 10);
        }
        if (myRid <= 3 && myRid < myRidOld) {
            let heid = await this.getHeIdByUuid(this.id);
            await lock_1.default.setLock(this.ctx, "paoma", heid); //枷锁
            let sevPaoMaModel = SevPaoMaModel_1.SevPaoMaModel.getInstance(this.ctx, heid);
            await sevPaoMaModel.addList("4", [this.ctx.state.name, myRid.toString()]);
        }
        return getScores;
    }
    /**
    *  领取日奖励
    */
    async rwdDay() {
        let info = await this.getInfo();
        if (gameMethod_1.gameMethod.isEmpty(info.dItems) == true) {
            this.ctx.throw("已领取");
        }
        await this.ctx.state.master.addItem2(info.dItems);
        info.dItems = [];
        await this.update(info);
    }
    /**
    *  领取赛季奖励
    */
    async rwdWeek() {
        let info = await this.getInfo();
        if (gameMethod_1.gameMethod.isEmpty(info.wItems) == true) {
            this.ctx.throw("已领取");
        }
        await this.ctx.state.master.addItem2(info.wItems);
        info.wItems = [];
        await this.update(info);
    }
    /**
    *  开宝箱获得竞技场门票
    */
    async addCons(cons) {
        let info = await this.getInfo();
        info.cons += cons;
        await this.update(info);
        this.ctx.state.master.addLog(1, 64, cons, info.cons);
    }
    /**
    *  扣除竞技场门票
    */
    async subCons(cons) {
        let info = await this.getInfo();
        if (info.cons < cons) {
            this.ctx.throw("门票不足");
        }
        info.cons -= cons;
        await this.update(info);
    }
    /**
    *
    */
    async refreAt(isCheck) {
        let info = await this.getInfo();
        // if(isCheck && info.refreAt >  this.ctx.state.newTime){
        //     this.ctx.throw("冷却中")
        // }
        // let jjc_refresh = tool.mathcfg_count(this.ctx,'jjc_refresh')
        // info.refreAt = this.ctx.state.newTime + jjc_refresh
        // await this.update(info)
        let cfg = gameCfg_1.default.jjcShuaxin.getItemCtx(this.ctx, info.winCount.toString());
        await this.ctx.state.master.subItem1(cfg.need);
    }
    /**
     * 当前刷新需要获取几个NPC
     */
    async getNpcNum() {
        let info = await this.getInfo();
        let cfg = gameCfg_1.default.jjcShuaxin.getItemCtx(this.ctx, info.winCount.toString());
        let maxNpc = 0;
        for (let index = 0; index < cfg.npc; index++) {
            if (game_1.default.rand(1, 10000) > cfg.prob) {
                continue;
            }
            maxNpc += 1;
        }
        return maxNpc;
    }
}
exports.ActJjcInfoModel = ActJjcInfoModel;
//# sourceMappingURL=ActJjcInfoModel.js.map