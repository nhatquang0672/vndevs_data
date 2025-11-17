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
exports.ActDengShenBangFightModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const Xys = __importStar(require("../../../common/Xys"));
const game_1 = __importDefault(require("../../util/game"));
const gameMethod_1 = require("../../../common/gameMethod");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const fight_1 = require("../../../common/fight");
const UserModel_1 = require("../user/UserModel");
const tool_1 = require("../../util/tool");
const RdsUserModel_1 = require("../redis/RdsUserModel");
const lock_1 = __importDefault(require("../../util/lock"));
const cache_1 = __importDefault(require("../../util/cache"));
const HdDengShenBangModel_1 = require("../hd/HdDengShenBangModel");
const HdDengShenBangLogModel_1 = require("../hd/HdDengShenBangLogModel");
/**
 * 登神榜 战斗
 * ActModel
 */
class ActDengShenBangFightModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actDengShenBangFight"; //用于存储key 和  输出1级key
        this.outIsAu = false; //下发数据是否用au下发
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
        return ""; //输出2级key
    }
    //初始化
    init() {
        return {
            fuserAll: null,
            start: {
                from: "",
                seed: 0,
                teams: {}
            },
            end: {
                win: 0,
                items: [],
            },
        };
    }
    /**
     * 返回数据
     */
    async getOutPut() {
        let info = await this.getInfo();
        return info;
    }
    /**
     *  开启一场战斗
     */
    async fight_one(hdcid) {
        //活动数据
        let hdDengShenBangModel = HdDengShenBangModel_1.HdDengShenBangModel.getInstance(this.ctx, this.id, hdcid);
        //是否活动时间内
        await hdDengShenBangModel.in_fight();
        //扣除战斗次数
        await hdDengShenBangModel.subItem(1);
        let hdinfo = await hdDengShenBangModel.getInfo();
        //登神榜跨服锁
        await lock_1.default.setLock(this.ctx, "dengShenBang", hdinfo.ksid);
        let info = await this.getInfo();
        //我方阵容
        let userModel = UserModel_1.UserModel.getInstance(this.ctx, this.id);
        let gStart = await userModel.getFightEps(true);
        let mUserInfo = await userModel.getFUserInfo();
        let rdsUserModel = RdsUserModel_1.RdsUserModel.getInstance(this.ctx, Xys.RdsUser.rdsHdDengShenBangKua, hdinfo.ksid, hdcid, hdinfo.weekId);
        let rdsUserModel_king = RdsUserModel_1.RdsUserModel.getInstance(this.ctx, Xys.RdsUser.rdsHdDengShenBangKing, hdinfo.ksid, hdcid, hdinfo.weekId);
        //敌方阵容
        let fuserInfo;
        let fuuid = "";
        let dengshenbangNpcs = gameCfg_1.default.dengshenbangNpcList.getItemListCtx(this.ctx, hdinfo.state.toString());
        const cfg = await hdDengShenBangModel._getHdCfg();
        if (!cfg || !cfg.data) {
            this.ctx.throw("活动未开启");
        }
        //匹配玩家
        if (hdinfo.state === cfg.data.stateInfo.length - 1) {
            // 1. 圣王榜，所有玩家在圣王榜里随机匹配（异步匹配），当不足5人时，以机器人做为填充，当满足5人时，则不会再匹配到机器人
            let enemies = [];
            let my_score = await hdDengShenBangModel.getTotalScore(hdinfo);
            let my_rank = await rdsUserModel.zRevrank(this.id);
            //限制循环次数 防止死循环
            let count = 3;
            let min_r = my_rank + 10;
            let max_r = Math.max(my_rank - 10, 1);
            while (enemies.length < cfg.data.minPlayers && count > 0) {
                count--;
                let neighbors = await rdsUserModel.getRankBetween(max_r, min_r);
                for (let i = 0; i < neighbors.length; i += 2) {
                    const member = neighbors[i];
                    if (enemies.includes(member) || hdinfo.fightFUuid.includes(member) || member == this.id) {
                        continue;
                    }
                    const score = Number(neighbors[i + 1]);
                    let fState = await hdDengShenBangModel.getState(score);
                    if (fState !== hdinfo.state) {
                        continue;
                    }
                    enemies.push(member);
                    if (enemies.length === cfg.data.minPlayers) {
                        break;
                    }
                }
                //说明到榜顶 | 次数要没了 用机器人
                if (count === 0) {
                    //用机器人替代
                    for (const npc of game_1.default.getRandArr(dengshenbangNpcs, cfg.data.minPlayers - enemies.length)) {
                        if (!hdinfo.fightFUuid.includes(npc.id)) {
                            enemies.push(npc.id);
                        }
                    }
                }
                min_r = min_r + 10;
                max_r = Math.max(max_r - 10, 1);
            }
            if (enemies.length === 0) {
                this.ctx.throw("活动未开启");
            }
            fuuid = game_1.default.getRandArr(enemies, 1)[0];
        }
        else {
            // 2. 其余榜，匹配时，先计算上一把是否胜利，如胜利，；失败则匹则匹配真实玩家配机器人【读表的机器人】。
            //        匹配玩家时，拉取与自己积分相同的对手，如果对手数量不足5人，则±1分进行拉取，如果还不足5人，则继续±1分，最大分差为5分。【数量不足时，将以机器人填充】
            let enemies = [];
            let my_score = await hdDengShenBangModel.getTotalScore(hdinfo);
            if (info.end.win) {
                //最大分差
                let count = cfg.data.maxScoreGap;
                let min_s = my_score;
                let max_s = my_score;
                while (enemies.length !== cfg.data.minPlayers && count > 0) {
                    count--;
                    let fMaxState = await hdDengShenBangModel.getState(max_s);
                    let fMinState = await hdDengShenBangModel.getState(max_s);
                    if (fMaxState !== hdinfo.state) {
                        max_s--;
                    }
                    if (fMinState !== hdinfo.state) {
                        min_s++;
                    }
                    let neighbors = await rdsUserModel.getScoreBetween(min_s, max_s);
                    let _gap = rdsUserModel._sortType == 1 ? 1 : 2;
                    for (let i = 0; i < neighbors.length; i += _gap) {
                        const member = neighbors[i];
                        if (!enemies.includes(member) && !hdinfo.fightFUuid.includes(member) && member != this.id) {
                            enemies.push(member);
                        }
                        if (enemies.length === cfg.data.minPlayers) {
                            break;
                        }
                    }
                    //分差达到上限 用机器人
                    if (count === 0) {
                        //用机器人替代
                        for (const npc of game_1.default.getRandArr(dengshenbangNpcs, cfg.data.minPlayers - enemies.length)) {
                            enemies.push(npc.id);
                        }
                        break;
                    }
                    min_s--;
                    max_s++;
                }
            }
            else {
                //用机器人替代
                for (const npc of game_1.default.getRandArr(dengshenbangNpcs, cfg.data.minPlayers)) {
                    enemies.push(npc.id);
                }
            }
            if (enemies.length === 0) {
                this.ctx.throw("活动未开启");
            }
            fuuid = game_1.default.getRandArr(enemies, 1)[0];
        }
        info = this.init();
        info.start = {
            from: "dengshenbangfight",
            seed: game_1.default.rand(1, 65535),
            teams: {
                "10": {
                    fid: this.id,
                    zhanwei: 0,
                    eps: gStart.eps,
                    level: 0,
                    wxSk: gStart.wxSk,
                    isnq: gStart.isnq,
                    jgSk: gStart.jgSk //精怪是否拥有怒气技能
                }
            }
        };
        if (gStart.xlid != "") {
            info.start.teams["11"] = {
                fid: "xl_" + gStart.xlid,
                zhanwei: gStart.xlzw,
                eps: gStart.xleps,
                level: gStart.xlLv,
                wxSk: {},
                isnq: 0,
                jgSk: {} //精怪技能
            };
        }
        if (gameMethod_1.gameMethod.isNpc(fuuid)) {
            //NPC
            const cfgNpc = gameCfg_1.default.dengshenbangNpc.getItemCtx(this.ctx, fuuid);
            let actFazhen = { list: {}, useGzId: "" };
            if (cfgNpc.shouling.length > 0) {
                actFazhen = {
                    list: { "1": { fzid: cfgNpc.shouling[0], saveId: cfgNpc.shouling[1], otherEps: {}, zaddp: 0, faddp: 0 } },
                    useGzId: "1",
                };
            }
            //NPC信息
            fuserInfo = {
                uid: "",
                uuid: fuuid,
                sid: hdinfo.ksid,
                name: cfgNpc.name,
                sex: 0,
                head: "",
                wxhead: "",
                tzid: "",
                level: cfgNpc.level,
                lastlogin: this.ctx.state.newTime,
                clubName: "",
                chid: "1",
                cbid: "1",
            };
            let sevBack = game_1.default.getDengShenBangNpc(fuuid);
            info.fuserAll = {
                uid: "",
                uuid: fuuid,
                sid: hdinfo.ksid,
                name: cfgNpc.name,
                sex: 0,
                head: "",
                wxhead: "",
                tzid: "",
                level: cfgNpc.level,
                lastlogin: this.ctx.state.newTime,
                clubName: "",
                chid: "1",
                cbid: "1",
                sevBack: sevBack,
            };
            info.start.teams["20"] = {
                fid: fuuid,
                zhanwei: 0,
                eps: gameMethod_1.gameMethod.ep_merge(gameMethod_1.gameMethod.ep_init(), cfgNpc.eps),
                level: 0,
                wxSk: {},
                isnq: 0,
                jgSk: {} //精怪技能
            };
        }
        else {
            //玩家
            let fuserModel = UserModel_1.UserModel.getInstance(this.ctx, fuuid);
            let fgStart = await fuserModel.getFightEps(true);
            fuserInfo = await fuserModel.getFUserInfo();
            info.fuserAll = await cache_1.default.getFUser(this.ctx, fuuid);
            info.start.teams["20"] = {
                fid: fuuid,
                zhanwei: 0,
                eps: fgStart.eps,
                level: 0,
                wxSk: fgStart.wxSk,
                isnq: fgStart.isnq,
                jgSk: fgStart.jgSk //精怪技能
            };
            if (fgStart.xlid != "") {
                info.start.teams["21"] = {
                    fid: "xlf_" + fgStart.xlid,
                    zhanwei: fgStart.xlzw,
                    eps: fgStart.xleps,
                    level: fgStart.xlLv,
                    wxSk: {},
                    isnq: 0,
                    jgSk: {} //精怪技能
                };
            }
        }
        //战斗
        let fight = new fight_1.Fight(info.start);
        let back = fight.get_outf();
        //记录战斗日志
        await tool_1.tool.addFightTeam(this.ctx, info.start);
        info.end.win = back.win;
        let old_score = await hdDengShenBangModel.getTotalScore(hdinfo);
        //胜利
        if (info.end.win == 1) {
            if (hdinfo.up) {
                //升境比试胜利
                hdinfo.up = 0;
                hdinfo.upTimes = 0;
                if (hdinfo.state === cfg.data.stateInfo.length - 1) {
                    hdinfo.score += 1;
                }
                else {
                    hdinfo.state = hdinfo.state + 1;
                    hdinfo.score = 0;
                }
            }
            else {
                //自由比试胜利
                hdinfo.score += 1;
                //升境检测
                await hdDengShenBangModel.checkUp(hdinfo);
            }
            //战斗胜利给自己发奖励
            await this.ctx.state.master.addItem2(cfg.data.winItems, "");
        }
        else {
            if (hdinfo.up) {
                //升境比试失败
                hdinfo.upTimes++;
                await hdDengShenBangModel.checkUp(hdinfo);
            }
            else {
                //自由比试失败 最高境界失败不扣分 | 活动配置的不扣分境界
                if (hdinfo.state !== cfg.data.stateInfo.length - 1 || !cfg.data.noLoseScoreState.includes(hdinfo.state)) {
                    hdinfo.score -= 1;
                    //降境
                    if (hdinfo.score < 0) {
                        if (!cfg.data.noDownState.includes(hdinfo.state)) {
                            hdinfo.state--;
                            hdinfo.score = cfg.data.stateInfo[hdinfo.state].breakScore - 1;
                        }
                        else {
                            hdinfo.score = 0;
                        }
                    }
                }
            }
        }
        let new_score = await hdDengShenBangModel.getTotalScore(hdinfo);
        //更新榜单数据
        if (new_score != old_score && new_score !== 0) {
            let time = await hdDengShenBangModel.updateClubScore(new_score - old_score);
            if (time) {
                hdinfo.refreshClubScoreTime = time;
            }
            await rdsUserModel.zSet(this.id, new_score);
            // for (let i = 0; i < 100; i++) {
            //     let m = (100000 + Math.ceil(Math.max(Math.random() * 10000,1))).toString();
            //     let s = Math.ceil(Math.max(Math.random() * 100,1));
            //     await rdsUserModel.zSetVal( m, s);
            //     if (s > 30){
            //         await rdsUserModel_king.zSetVal(m,s);
            //     }
            //
            // }
            //圣王榜单独记录
            if (hdinfo.state === cfg.data.stateInfo.length - 1) {
                await rdsUserModel_king.zSet(this.id, hdinfo.score);
            }
        }
        //日志
        let log = {
            fUser: fuserInfo,
            fScore: hdinfo.score + Math.floor(Math.random() * cfg.data.maxScoreGap),
            fState: hdinfo.state,
            win: info.end.win,
            mUser: mUserInfo,
            mState: hdinfo.state,
            mScore: hdinfo.score,
            time: game_1.default.getNowTime()
        };
        //给对方加上日志
        if (!gameMethod_1.gameMethod.isNpc(fuuid)) {
            await lock_1.default.setLock(this.ctx, "user", fuuid); //枷锁
            this.ctx.state.fuuid = fuuid;
            //活动数据
            let fHdDengShenBangModel = HdDengShenBangModel_1.HdDengShenBangModel.getInstance(this.ctx, fuuid, hdcid);
            let fHdinfo = await fHdDengShenBangModel.getInfo();
            log.fState = fHdinfo.state;
            log.fScore = fHdinfo.score;
            let hdDengShenBangLogModel = HdDengShenBangLogModel_1.HdDengShenBangLogModel.getInstance(this.ctx, fuuid, hdcid);
            await hdDengShenBangLogModel.addLog(log);
            this.ctx.state.fuuid = "";
        }
        //增加挑战次数
        hdinfo.times++;
        //给自己加上日志
        let hdDengShenBangLogModel = HdDengShenBangLogModel_1.HdDengShenBangLogModel.getInstance(this.ctx, this.id, hdcid);
        await hdDengShenBangLogModel.addLog(gameMethod_1.gameMethod.objCopy(log));
        await hdDengShenBangModel.addFuuid(hdinfo, fuuid);
        await this.update(info);
        await hdDengShenBangModel.update(hdinfo, ["outf", "red"]);
        await userModel.getOutPut();
    }
}
exports.ActDengShenBangFightModel = ActDengShenBangFightModel;
//# sourceMappingURL=ActDengShenBangFightModel.js.map