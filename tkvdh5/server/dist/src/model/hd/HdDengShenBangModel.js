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
exports.HdDengShenBangModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const gameMethod_1 = require("../../../common/gameMethod");
const game_1 = __importDefault(require("../../util/game"));
const Xys = __importStar(require("../../../common/Xys"));
const SevDengShenBangModel_1 = require("../sev/SevDengShenBangModel");
const ActClubModel_1 = require("../act/ActClubModel");
const RdsClubModel_1 = require("../redis/RdsClubModel");
const ActItemModel_1 = require("../act/ActItemModel");
const ActTaskMainModel_1 = require("../act/ActTaskMainModel");
/**
 * HdDengShenBangModel
 * 活动 登神榜
 */
class HdDengShenBangModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdDengShenBang"; //用于存储key 和  输出1级key
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
            state: 0,
            ksid: "",
            kopen: 0,
            score: 0,
            times: 0,
            outTime: 0,
            lastTime: 0,
            up: 0,
            upTimes: 0,
            fightFUuid: [],
            rwdProcess: -1,
            buyCount: 0,
            refreshClubScoreTime: 0,
            gift: {},
            giftDay: {},
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        const cfg = await this.getHdCfg();
        let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
        if (!cfg || !cfg.data.freeGap || await actTaskMainModel.kaiqi("4014", 0) != 1) {
            return info;
        }
        if (!info.giftDay) {
            info.giftDay = {};
        }
        if (!info.gift) {
            info.gift = {};
        }
        //重置: 活动重置 周重置
        let weekId = game_1.default.getWeekId();
        let isUpdate = false;
        let now = this.ctx.state.newTime;
        //跨天 每日重置
        if (this.ctx.state.new0 > info.outTime) {
            //从sev 获取 活动开放信息
            let sevDengShenBangModel = SevDengShenBangModel_1.SevDengShenBangModel.getInstance(this.ctx, "1", this.hdcid);
            let sevOpenInfo = await sevDengShenBangModel.getKidBySid(await this.getHeIdByUuid(this.id));
            //每日重置数据
            info.times = 0;
            info.ksid = sevOpenInfo.ksid; //跨服ID
            info.kopen = sevOpenInfo.open; //开启状态
            info.hdid = cfg.info.id;
            info.buyCount = 0;
            info.rwdProcess = -1;
            info.giftDay = {};
            let actItemModel = ActItemModel_1.ActItemModel.getInstance(this.ctx, this.id);
            let hasNum = await actItemModel.getCount(cfg.data.costItem[1]);
            if (hasNum >= cfg.data.maxFreeNum) {
                info.lastTime = 0;
            }
            else {
                let count = cfg.data.freeItem;
                if (count > 0) {
                    count = Math.min(cfg.data.maxFreeNum, hasNum + count);
                    await actItemModel.setItem(cfg.data.costItem[1], count);
                    //若获得后达到上限则 不再自然增长（lastTime = 0） 登神贴
                    info.lastTime = count === cfg.data.maxFreeNum ? 0 : now;
                }
            }
            //跨周 活动重置
            if (info.weekId != weekId) {
                //写入重置ID
                info.hdid = cfg.info.id;
                info.ksid = sevOpenInfo.ksid; //跨服ID
                info.weekId = weekId;
                info.kopen = sevOpenInfo.open;
                info.up = 0;
                info.upTimes = 0;
                info.score = 0;
                info.state = 0;
                info.fightFUuid = [];
                info.refreshClubScoreTime = 0;
                info.gift = {}; //礼包购买
                if (now < sevOpenInfo.openTime) {
                    info.lastTime = sevOpenInfo.openTime;
                }
                else {
                    info.lastTime = now;
                }
                await actItemModel.setItem(cfg.data.costItem[1], cfg.data.freeItem);
            }
            info.outTime = this.ctx.state.newTime;
            isUpdate = true;
        }
        if (info.lastTime && info.lastTime < now) {
            let actItemModel = ActItemModel_1.ActItemModel.getInstance(this.ctx, this.id);
            let hasNum = await actItemModel.getCount(cfg.data.costItem[1]);
            if (hasNum >= cfg.data.maxFreeNum) {
                info.lastTime = 0;
                isUpdate = true;
            }
            else {
                let gapTime = now - info.lastTime;
                if (gapTime > 0 && gapTime >= cfg.data.freeGap && info.kopen && cfg.info.sAt <= now && now <= cfg.info.eAt) {
                    //计算获取几个登神帖
                    let count = Math.floor(gapTime / cfg.data.freeGap);
                    //免费获得登神帖
                    if (count > 0) {
                        count = Math.min(cfg.data.maxFreeNum, hasNum + count);
                        await actItemModel.setItem(cfg.data.costItem[1], count);
                        //若获得后达到上限则 不再自然增长（lastTime = 0） 登神贴
                        info.lastTime = count === cfg.data.maxFreeNum ? 0 : info.lastTime + (count - hasNum) * cfg.data.freeGap;
                        isUpdate = true;
                    }
                }
            }
        }
        if (isUpdate) {
            await this.update(info, ["outf", "red"]);
        }
        return info;
    }
    /**
     * 领取任务奖励
     * @param times 次数
     */
    async getRwd(times) {
        await this.in_fight();
        let info = await this.getInfo();
        const hdCfg = await this._getHdCfg();
        if (!hdCfg.data.rwd[times]) {
            this.ctx.throw("参数错误");
        }
        if (info.rwdProcess >= times) {
            this.ctx.throw("奖励已领取");
        }
        const sortedKeys = Object.keys(hdCfg.data.rwd).map(Number).sort((a, b) => a - b);
        let key;
        let target = false;
        for (const id of sortedKeys) {
            if (target || info.rwdProcess === -1) {
                key = id;
                break;
            }
            if (info.rwdProcess === id) {
                target = true;
            }
        }
        if (!key || key != times) {
            this.ctx.throw("请先领取上一个奖励");
        }
        await this.ctx.state.master.addItem2(hdCfg.data.rwd[key]);
        info.rwdProcess = Number(times);
        await this.update(info, ["outf"]);
    }
    /**
     * 获取红点
     */
    async getRed() {
        return 0;
    }
    async getOutPut_u(key) {
        const cfg = await this._getHdCfg();
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
                return outf;
        }
        return null;
    }
    /**
     * 获取登神贴的数量
     */
    async getItemNum(cfg) {
        let actItemModel = ActItemModel_1.ActItemModel.getInstance(this.ctx, this.id);
        return Number(await actItemModel.getCount(cfg.data.costItem[1]));
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
    async _getHdCfg() {
        //从sev 获取 活动开放信息
        let sevDengShenBangModel = SevDengShenBangModel_1.SevDengShenBangModel.getInstance(this.ctx, "1", this.hdcid);
        let sevOpenInfo = await sevDengShenBangModel.getKidBySid(await this.getHeIdByUuid(this.id));
        let hdCfg = gameMethod_1.gameMethod.objCopy(await this.getHdCfg());
        if (!hdCfg) {
            this.ctx.throw("赛季结算中，无法查看");
        }
        //跨服信息
        hdCfg.info.sAt = sevOpenInfo.openTime; //开始时间
        hdCfg.info.eAt = sevOpenInfo.endTime; //结束时间
        hdCfg.info.dAt = hdCfg.info.eAt + hdCfg.info.show * 60;
        return gameMethod_1.gameMethod.objCopy(hdCfg);
    }
    /**
     * 是否处于战斗时间内
     */
    async in_fight(e = true) {
        let info = await this.getInfo();
        const cfg = await this._getHdCfg();
        let now = game_1.default.getNowTime();
        if (cfg && info.kopen && cfg.info.sAt <= now && now <= cfg.info.eAt) {
            return true;
        }
        if (e) {
            this.ctx.throw(`赛季结算中，无法查看`);
        }
        return false;
    }
    /**
     * 是否处于活动展示时间内
     */
    async in_show() {
        const cfg = await this._getHdCfg();
        let now = game_1.default.getNowTime();
        let show_0 = game_1.default.getToDay_0(cfg.info.sAt);
        //配置存在 && 在展示时间内 && 活动这周开启(bt不用)
        return cfg && cfg.data.showDay.includes(Number(game_1.default.getWeek(now))) && (show_0 <= now && now <= cfg.info.eAt);
    }
    /**
     * 判断分数处于哪个境界
     */
    async getState(score) {
        let s = Number(score);
        const cfg = await this._getHdCfg();
        let stateInfo = cfg.data.stateInfo;
        for (const [index, sInfo] of stateInfo.entries()) {
            if (s <= sInfo.breakScore || index === stateInfo.length - 1) {
                return index;
            }
            s -= sInfo.breakScore;
            s--;
        }
        return 0;
    }
    /**
     * 获取我的总分数
     */
    async getTotalScore(info) {
        if (!info) {
            info = await this.getInfo();
        }
        const cfg = await this._getHdCfg();
        if (cfg) {
            let state = Math.min(info.state, cfg.data.stateInfo.length - 1);
            let totalScore = info.score;
            for (let i = 0; i < state; i++) {
                let _state = cfg.data.stateInfo[i];
                totalScore += _state.breakScore;
                totalScore++;
            }
            return totalScore;
        }
        this.ctx.throw(`赛季结算中，无法查看`);
    }
    /**
     * 使用登神帖
     */
    async subItem(count) {
        //参数安全化
        count = Number(count);
        let info = await this.getInfo();
        if (count <= 0) {
            this.ctx.throw(`count_err:${count}`);
        }
        //获取配置
        const cfg = await this._getHdCfg();
        if (!cfg) {
            this.ctx.throw("赛季结算中，无法查看");
        }
        let costItem = gameMethod_1.gameMethod.objCopy(cfg.data.costItem);
        if (!costItem || !costItem[2]) {
            this.ctx.throw("赛季结算中，无法查看");
        }
        costItem[2] *= count;
        await this.ctx.state.master.subItem1(costItem);
        let totalNum = await this.getItemNum(cfg);
        if (!info.lastTime && totalNum < cfg.data.maxFreeNum) {
            info.lastTime = game_1.default.getNowTime();
        }
        await this.update(info, ["outf", "red"]);
    }
    /**
     * 获取本活动的跨服ID
     */
    async getKsid() {
        //自己的数据
        let info = await this.getInfo();
        return info.ksid;
    }
    /**
     * 更新我为仙盟提供的积分
     * @param score 变动积分，有正有负数
     * @param clear 是否清空
     * @param clubId 公会ID
     */
    async updateClubScore(score, clear = false, clubId = "") {
        if (!await this.in_fight(false)) {
            return;
        }
        let info = await this.getInfo();
        const cfg = await this._getHdCfg();
        let rdsClubModel = RdsClubModel_1.RdsClubModel.getInstance(this.ctx, Xys.RdsClub.rdsClubDengShenBang, info.ksid, this.hdcid, info.weekId);
        //获取玩家公会ID
        let actClubModel = ActClubModel_1.ActClubModel.getInstance(this.ctx, this.id);
        let iTime = await actClubModel.getItime();
        let _sid = await actClubModel.getClubId();
        //加入公会时长
        let joinTime = game_1.default.getNowTime() - iTime;
        if (clear && clubId !== "") {
            await rdsClubModel.zAdd(clubId, -await this.getTotalScore(info));
            info.refreshClubScoreTime = 0;
        }
        else if (_sid && joinTime >= cfg.data.clubDelayTime) {
            //X小时内加入仙盟的新人，无法为仙盟提供积分
            await rdsClubModel.zAdd(_sid, score);
            info.refreshClubScoreTime = game_1.default.getNowTime();
        }
        await this.update(info);
        return info.refreshClubScoreTime;
    }
    /**
     * 购买登神帖
     * @param count 购买数量
     */
    async buy(count) {
        await this.in_fight();
        let _count = Number(count);
        let info = await this.getInfo();
        const cfg = await this._getHdCfg();
        if (_count <= 0 || _count > cfg.data.maxBuyNum - info.buyCount) {
            this.ctx.throw("参数错误");
        }
        let costItem = gameMethod_1.gameMethod.objCopy(cfg.data.itemPrice);
        costItem[2] *= _count;
        await this.ctx.state.master.subItem1(costItem);
        let addItem = gameMethod_1.gameMethod.objCopy(cfg.data.costItem);
        addItem[2] *= _count;
        await this.ctx.state.master.addItem1(addItem);
        info.buyCount += _count;
        if (await this.getItemNum(cfg) >= cfg.data.maxFreeNum) {
            info.lastTime = 0;
        }
        await this.update(info, ["outf", "red"]);
    }
    /**
     * 记录下挑战对手
     */
    async addFuuid(info, fuuid) {
        //获取配置
        const cfg = await this._getHdCfg();
        if (!cfg) {
            this.ctx.throw("活动未开启");
        }
        if (!fuuid) {
            return;
        }
        let maxLog = Number(cfg.data.maxAttempts);
        let _fuuid = gameMethod_1.gameMethod.isNpc(fuuid) ? "npc1" : fuuid;
        info.fightFUuid.push(_fuuid);
        // 检查数组长度是否超过限制
        const excess = info.fightFUuid.length - maxLog;
        if (excess > 0) {
            info.fightFUuid.splice(0, excess);
        }
    }
    /**
     * 检测能否进行升境
     */
    async checkUp(info) {
        let cfg = await this._getHdCfg();
        if (!cfg || !cfg.data) {
            this.ctx.throw(`活动时间未开启`);
        }
        let stateInfo = cfg.data.stateInfo[info.state];
        if (info.up) {
            if (info.upTimes === stateInfo.times) {
                //升境失败
                info.up = 0;
                info.score--;
                info.upTimes = 0;
            }
        }
        else {
            //已满境不需要升
            if (info.state === cfg.data.stateInfo.length - 1) {
                return;
            }
            //开始升境
            if (stateInfo.breakScore === info.score) {
                info.up = 1;
                info.upTimes = 0;
            }
        }
    }
    /**
     * 领取免费档次(礼包)
     */
    async getFree(id) {
        await this.in_fight();
        //遍历查找 自己是不是用了
        let cfg = await this._getHdCfg();
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("赛季结算中，无法查看");
        }
        if (cfg.data.gift[id] == null) {
            this.ctx.throw(`id_null:${id}`);
        }
        if (gameMethod_1.gameMethod.isEmpty(cfg.data.gift[id].need) != true) {
            this.ctx.throw("非免费");
        }
        let info = await this.getInfo();
        //总限购
        if (info.gift[id] == null) {
            info.gift[id] = 0;
        }
        if (cfg.data.gift[id].limit > 0 && //有限购
            info.gift[id] >= cfg.data.gift[id].limit //限购达到
        ) {
            this.ctx.throw("购买上限");
        }
        //日限购上限
        //总限购
        if (info.giftDay[id] == null) {
            info.giftDay[id] = 0;
        }
        if (cfg.data.gift[id].dayLimit > 0 && //有每日限购
            info.giftDay[id] >= cfg.data.gift[id].dayLimit //每日限购达到
        ) {
            this.ctx.throw("每日购买上限");
        }
        //礼包购买次数累计
        info.gift[id] += 1;
        info.giftDay[id] += 1;
        await this.update(info, ["outf", "red"]);
        //加上礼包奖励
        await this.ctx.state.master.addItem2(cfg.data.gift[id].rwd);
    }
    /**
     * 充值下单检查
     */
    async checkPay(id) {
        //遍历查找 自己是不是用了
        let cfg = await this._getHdCfg();
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("赛季结算中，无法查看");
        }
        if (cfg.data.gift[id] == null) {
            this.ctx.throw(`id_null:${id}`);
        }
        if (cfg.data.gift[id].need[0] != 10) {
            this.ctx.throw("参数错误");
        }
        let info = await this.getInfo();
        //总限购
        if (info.gift[id] == null && //没买过
            cfg.data.gift[id].limit > 0 && //有限购
            info.gift[id] >= cfg.data.gift[id].limit //限购达到
        ) {
            this.ctx.throw("购买上限");
        }
        //日限购上限
        if (info.giftDay[id] == null && //今天没买过
            cfg.data.gift[id].dayLimit > 0 && //有每日限购
            info.giftDay[id] >= cfg.data.gift[id].dayLimit //每日限购达到
        ) {
            this.ctx.throw("每日购买上限");
        }
        return {
            type: 1,
            msg: cfg.data.gift[id].title,
            data: cfg.data.gift[id].need[1],
            kind10Cs: this.kid + "_" + this.hdcid + "_" + id + "_" + cfg.data.gift[id].need[1]
        };
    }
    /**
     * 充值成功后执行
     */
    async carryOut(id) {
        //遍历查找 自己是不是用了
        let cfg = await this._getHdCfg();
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            return {
                type: 0,
                msg: "赛季结算中，无法查看",
                data: null,
            };
        }
        if (cfg.data.gift[id] == null) {
            return {
                type: 0,
                msg: `id_null:${id}`,
                data: null,
            };
        }
        if (cfg.data.gift[id].need[0] != 10) {
            return {
                type: 0,
                msg: `参数错误`,
                data: null,
            };
        }
        let info = await this.getInfo();
        if (info.gift[id] == null) {
            info.gift[id] = 0;
        }
        if (cfg.data.gift[id].limit > 0 && //有限购
            info.gift[id] >= cfg.data.gift[id].limit //限购达到
        ) {
            return {
                type: 0,
                msg: `购买上限`,
                data: null,
            };
        }
        if (info.giftDay[id] == null) {
            info.giftDay[id] = 0;
        }
        if (cfg.data.gift[id].dayLimit > 0 && //有每日限购
            info.giftDay[id] >= cfg.data.gift[id].dayLimit //每日限购达到
        ) {
            return {
                type: 0,
                msg: `每日购买上限`,
                data: null,
            };
        }
        //礼包购买次数累计
        info.gift[id] += 1;
        info.giftDay[id] += 1;
        await this.update(info, ["outf", "red"]);
        //加上礼包奖励
        await this.ctx.state.master.addItem2(cfg.data.gift[id].rwd);
        return {
            type: 1,
            msg: "充值成功",
            data: cfg.data.gift[id].need[1],
        };
    }
}
exports.HdDengShenBangModel = HdDengShenBangModel;
//# sourceMappingURL=HdDengShenBangModel.js.map