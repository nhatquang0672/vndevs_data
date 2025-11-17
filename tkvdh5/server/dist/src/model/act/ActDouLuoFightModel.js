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
exports.ActDouLuoFightModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const Xys = __importStar(require("../../../common/Xys"));
const game_1 = __importDefault(require("../../util/game"));
const gameMethod_1 = require("../../../common/gameMethod");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const fight_1 = require("../../../common/fight");
const UserModel_1 = require("../user/UserModel");
const hook_1 = require("../../util/hook");
const tool_1 = require("../../util/tool");
const HdDouLuoModel_1 = require("../hd/HdDouLuoModel");
const RdsUserModel_1 = require("../redis/RdsUserModel");
const lock_1 = __importDefault(require("../../util/lock"));
const HdDouLuoLogModel_1 = require("../hd/HdDouLuoLogModel");
const SevPaoMaModel_1 = require("../sev/SevPaoMaModel");
const cache_1 = __importDefault(require("../../util/cache"));
/**
 * 最强斗罗 战斗
 * ActModel
 */
class ActDouLuoFightModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actDouLuoFight"; //用于存储key 和  输出1级key
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
            frid: "",
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
    async fight_one(hdcid, rid) {
        //活动数据
        let hdDouLuoModel = HdDouLuoModel_1.HdDouLuoModel.getInstance(this.ctx, this.id, hdcid);
        //是否活动时间内
        hdDouLuoModel.in_fight();
        //扣除战斗次数
        await hdDouLuoModel.subItem(1);
        let hdinfo = await hdDouLuoModel.getInfo();
        //斗罗跨服锁
        await lock_1.default.setLock(this.ctx, "douLuo", hdinfo.ksid);
        //这个名次 是否存在
        if (hdinfo.tzList.indexOf(rid) < 0) {
            this.ctx.throw(`名次错误 请刷新`);
        }
        let info = this.init();
        //我方阵容
        let userModel = UserModel_1.UserModel.getInstance(this.ctx, this.id);
        let gStart = await userModel.getFightEps(true);
        let rdsUserModel = RdsUserModel_1.RdsUserModel.getInstance(this.ctx, Xys.RdsUser.rdsDouLuo, hdinfo.ksid, hdcid, hdinfo.weekId);
        //495 名以上 直接使用NPC
        let fuuid = rid.toString();
        if (rid < 495) {
            //按名次 获取玩家UID
            fuuid = await rdsUserModel.getMemberByRid(rid);
        }
        //排行
        //敌方阵容
        let fuserInfo;
        info.frid = rid.toString();
        info.start = {
            from: "douluo",
            seed: game_1.default.rand(1, 65535),
            teams: {
                "10": {
                    fid: this.id,
                    zhanwei: 0,
                    eps: gStart.eps,
                    level: 0,
                    wxSk: gStart.wxSk,
                    isnq: gStart.isnq,
                    jgSk: gStart.jgSk //精怪技能
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
        let fname = "";
        if (gameMethod_1.gameMethod.isNpc(fuuid)) {
            //NPC
            let cfgNpc = gameCfg_1.default.douLuoNpc.getItemCtx(this.ctx, fuuid);
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
            let sevBack = game_1.default.getDouLuoNpc(fuuid);
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
            fname = info.fuserAll.name;
        }
        else {
            //玩家
            let fuserModel = UserModel_1.UserModel.getInstance(this.ctx, fuuid);
            let fgStart = await fuserModel.getFightEps(true);
            fuserInfo = await fuserModel.getFUserInfo();
            info.fuserAll = await cache_1.default.getFUser(this.ctx, fuuid),
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
            fname = fuserInfo.name;
        }
        //战斗
        let fight = new fight_1.Fight(info.start);
        let back = fight.get_outf();
        //记录战斗日志
        tool_1.tool.addFightTeam(this.ctx, info.start);
        info.end.win = back.win;
        //获取我当前名次
        let myrid = await rdsUserModel.zRevrank(this.id);
        if (myrid == null || myrid > 500) {
            myrid = 500;
        }
        myrid += 1;
        //结束后排名
        let end_myrid = myrid;
        let end_rid = rid;
        //胜利
        if (info.end.win == 1) {
            //交换站位
            if (myrid > rid) {
                //设置我的名次为 rid
                await rdsUserModel.zSetVal(this.id, rid);
                //设置 fuuid  的名次为 myrid
                if (gameMethod_1.gameMethod.isNpc(fuuid)) {
                    if (myrid <= 500) {
                        //是NPC的话 吧我空出来的位置 设置为 原始NPC
                        await rdsUserModel.zSetVal(myrid.toString(), myrid);
                    }
                    //吧我要占领的位置的NPC 删除掉
                    await rdsUserModel.zDel(rid.toString());
                }
                else {
                    if (myrid <= 500) {
                        //不是NPC的话 交换站位
                        await rdsUserModel.zSetVal(fuuid, myrid);
                    }
                    else {
                        //榜外 直接删了
                        await rdsUserModel.zDel(fuuid);
                    }
                }
                end_myrid = rid;
                end_rid = myrid;
                if (rid <= 3) {
                    let heid = await this.getHeIdByUuid(this.id);
                    await lock_1.default.setLock(this.ctx, "paoma", heid); //枷锁
                    let sevPaoMaModel = SevPaoMaModel_1.SevPaoMaModel.getInstance(this.ctx, heid);
                    await sevPaoMaModel.addList("5", [this.ctx.state.name, fname, rid.toString()]);
                }
            }
            //加上奖励道具
            //弹窗
            info.end.items = await hdDouLuoModel.getWinRwd(rid);
            await this.ctx.state.master.addItem2(gameMethod_1.gameMethod.objCopy(info.end.items), ""); //加道具
            //刷新挑战者
            await hdDouLuoModel._refresh();
            //给对方 刷新挑战者 / 在后面
        }
        else {
            //失败
            //
            info.end.items = await hdDouLuoModel.getLoseRwd();
            if (info.end.items.length > 0) {
                await this.ctx.state.master.addItem2(gameMethod_1.gameMethod.objCopy(info.end.items), ""); //加道具
            }
        }
        await this.update(info);
        await userModel.getOutPut();
        //日志
        let log = {
            type: 0,
            win: info.end.win,
            time: this.ctx.state.newTime,
            users: [
                {
                    user: await userModel.getFUserInfo(),
                    rid: myrid,
                },
                {
                    user: fuserInfo,
                    rid: rid,
                },
            ],
        };
        //活动数据
        let hdDouLuoLogModel = HdDouLuoLogModel_1.HdDouLuoLogModel.getInstance(this.ctx, this.id, hdcid);
        //我自己加上日志
        await hdDouLuoLogModel.addLog(gameMethod_1.gameMethod.objCopy(log));
        //给对方加上日志
        if (gameMethod_1.gameMethod.isNpc(fuuid) != true) {
            await lock_1.default.setLock(this.ctx, "user", fuuid); //枷锁
            this.ctx.state.fuuid = fuuid;
            log.type = 1;
            //活动数据
            let fhdDouLuoLogModel = HdDouLuoLogModel_1.HdDouLuoLogModel.getInstance(this.ctx, fuuid, hdcid);
            await fhdDouLuoLogModel.addLog(gameMethod_1.gameMethod.objCopy(log));
            if (info.end.win == 1) {
                //给失败者 刷新挑战者
                let fhdDouLuoModel = HdDouLuoModel_1.HdDouLuoModel.getInstance(this.ctx, fuuid, hdcid);
                await fhdDouLuoModel._refresh();
            }
            this.ctx.state.fuuid = "";
        }
        await hook_1.hookNote(this.ctx, "joinDouLuo", 1);
    }
}
exports.ActDouLuoFightModel = ActDouLuoFightModel;
//# sourceMappingURL=ActDouLuoFightModel.js.map