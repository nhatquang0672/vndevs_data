"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActJjcFightModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const ActJjcInfoModel_1 = require("./ActJjcInfoModel");
const game_1 = __importDefault(require("../../util/game"));
const gameMethod_1 = require("../../../common/gameMethod");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const fight_1 = require("../../../common/fight");
const RdsUserModel_1 = require("../redis/RdsUserModel");
const UserModel_1 = require("../user/UserModel");
const hook_1 = require("../../util/hook");
const tool_1 = require("../../util/tool");
const ActRedDailyModel_1 = require("./ActRedDailyModel");
const cache_1 = __importDefault(require("../../util/cache"));
const ActDaoyouModel_1 = require("./ActDaoyouModel");
/**
 * Jjc 战斗
 */
class ActJjcFightModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actJjcFight"; //用于存储key 和  输出1级key
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
                score: 0,
                fscore: 0,
                mys: 0,
                fs: 0,
            }
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
     * 开启一场战斗
     * @param fuuid 对手
     * @param type 0普通战斗1复仇
     */
    async fight_one(fuuid, type) {
        let info = await this.init();
        info.start.seed = game_1.default.rand(1, 65535); //生成随机种子
        let userModel = UserModel_1.UserModel.getInstance(this.ctx, this.id);
        let gStart = await userModel.getFightEps(true);
        info.start = {
            from: "jjc",
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
                },
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
        //敌方阵容
        let feps = {};
        if (parseInt(fuuid) < 100000) {
            feps = gameMethod_1.gameMethod.ep_init();
            let cfgNpc = gameCfg_1.default.jjcNpc.getItemCtx(this.ctx, fuuid);
            feps = gameMethod_1.gameMethod.ep_merge(feps, cfgNpc.eps); // + 穿着装备
            let actFazhen = { list: {}, useGzId: "" };
            if (cfgNpc.shouling.length > 0) {
                actFazhen = {
                    list: { "1": { fzid: cfgNpc.shouling[0], saveId: cfgNpc.shouling[1], otherEps: {}, zaddp: 0, faddp: 0 }, },
                    useGzId: "1",
                };
            }
            info.fuserAll = {
                uid: "",
                uuid: fuuid,
                sid: await this.getHeIdByUuid(this.id),
                name: cfgNpc.name,
                sex: 0,
                head: "1",
                wxhead: "",
                tzid: "",
                level: cfgNpc.level,
                lastlogin: this.ctx.state.newTime,
                clubName: "",
                chid: "1",
                cbid: "1",
                sevBack: {
                    actChiBang: {
                        hh: cfgNpc.jianling[0].toString(),
                        hhList: [cfgNpc.jianling[0].toString()],
                        id: cfgNpc.jianling[1],
                        exp: 0,
                        cleps: {}
                    },
                    actFazhen: actFazhen
                }
            };
            info.start.teams["20"] = {
                fid: fuuid,
                zhanwei: 0,
                eps: feps,
                level: 0,
                wxSk: {},
                isnq: 0,
                jgSk: {} //精怪技能
            };
        }
        else {
            let fuserModel = UserModel_1.UserModel.getInstance(this.ctx, fuuid);
            let fgStart = await fuserModel.getFightEps(true);
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
        }
        //战斗
        let fight = new fight_1.Fight(info.start);
        let back = fight.get_outf();
        //记录战斗日志
        tool_1.tool.addFightTeam(this.ctx, info.start);
        info.end.win = back.win;
        if (info.end.win == 1) {
            let cfgMath = gameCfg_1.default.mathInfo.getItemCtx(this.ctx, 'jjc_win');
            if (cfgMath.pram.items == null) {
                this.ctx.throw("配置错误Math_jjc_win");
                return 0;
            }
            let addrate = 0;
            for (const _item of cfgMath.pram.items) {
                let count = _item[2];
                if (_item[0] == 1 && _item[1] == 2) {
                    count += Math.floor(_item[2] * addrate / 100);
                }
                info.end.items.push([_item[0], _item[1], count]);
            }
            let winItem = gameMethod_1.gameMethod.objCopy(info.end.items);
            //道友概率奖励道具
            let actDaoyouModel = ActDaoyouModel_1.ActDaoyouModel.getInstance(this.ctx, this.id);
            let rate = await actDaoyouModel.getDaoYouSkill("4");
            if (Math.random() <= rate) {
                let conf = gameCfg_1.default.daoyouSkillType.getItemCtx(this.ctx, "4");
                if (conf.param.item) {
                    winItem.push(conf.param.item);
                }
            }
            await this.ctx.state.master.addItem2(gameMethod_1.gameMethod.mergeArr(winItem), ""); //加道具
        }
        else {
            //活动 - 签到
            // let cfgHdNew = Setting.getHuodong2(await this.getHeIdByUuid(this.id), "hdNew");
            // if (cfgHdNew != null) {
            //     for (const hdcid in cfgHdNew) {
            //         let hdNewModel = HdNewModel.getInstance(this.ctx, this.id, hdcid);
            //         await hdNewModel.setIsShow()
            //     }
            // }
            //记录战斗失败次数
            let actRedDailyModel = ActRedDailyModel_1.ActRedDailyModel.getInstance(this.ctx, this.id);
            await actRedDailyModel.battleFailed();
        }
        //战斗积分结算
        let actJjcInfoModel = ActJjcInfoModel_1.ActJjcInfoModel.getInstance(this.ctx, this.id);
        let scores = await actJjcInfoModel.fightEnd(fuuid, back.win, type);
        info.end.score = scores[0];
        info.end.fscore = scores[1];
        let rdsUserModel = await new RdsUserModel_1.RdsUserModel("rdsJjc", 'x', await this.getHeIdByUuid(this.id), tool_1.tool.jjcWeekId(this.ctx.state.newTime));
        info.end.mys = Math.ceil(parseFloat(await rdsUserModel.zScore(this.id)));
        if (parseInt(fuuid) < 100000) {
            let _fscore = gameCfg_1.default.jjcNpc.getItemCtx(this.ctx, fuuid).score;
            info.end.fs = _fscore + scores[1];
        }
        else {
            info.end.fs = Math.ceil(parseFloat(await rdsUserModel.zScore(fuuid)));
        }
        await this.update(info);
        await hook_1.hookNote(this.ctx, "jjcPk", 1);
        await hook_1.hookNote(this.ctx, "jjcScore", info.end.mys);
        return back.win;
    }
    /**
     * 奖励弹窗展示
     */
    async addWinItems(item) {
        let info = await this.getInfo();
        info.end.items.push(item);
        await this.update(info);
    }
}
exports.ActJjcFightModel = ActJjcFightModel;
//# sourceMappingURL=ActJjcFightModel.js.map