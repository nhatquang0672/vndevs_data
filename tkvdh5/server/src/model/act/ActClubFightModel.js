"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActClubFightModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const game_1 = __importDefault(require("../../util/game"));
const gameMethod_1 = require("../../../common/gameMethod");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const fight_1 = require("../../../common/fight");
const UserModel_1 = require("../user/UserModel");
const tool_1 = require("../../util/tool");
/**
 * 公会BOSS 战斗
 */
class ActClubFightModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actClubFight"; //用于存储key 和  输出1级key
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
            start: {
                from: "",
                seed: 0,
                teams: {}
            },
            end: {
                win: 0,
                items: [],
                hurt: 0,
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
     * 开启一场战斗
     * @param bossid 对手
     * @param hurt 已造成伤害
     */
    async fight_one(bossid, hurt) {
        let info = this.init();
        //我方
        let userModel = UserModel_1.UserModel.getInstance(this.ctx, this.id);
        let gStart = await userModel.getFightEps();
        //敌方阵容
        let feps = gameMethod_1.gameMethod.ep_init();
        feps = gameMethod_1.gameMethod.ep_merge(feps, gameCfg_1.default.monClubBoss.getItemCtx(this.ctx, bossid).eps); // + 穿着装备
        feps.hp = feps.hp_max - hurt;
        //战斗阵容
        info.start = {
            from: "club",
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
                "20": {
                    fid: bossid,
                    zhanwei: 0,
                    eps: feps,
                    level: 0,
                    wxSk: {},
                    isnq: 0,
                    jgSk: {} //精怪技能
                }
            }
        };
        //战斗
        let fight = new fight_1.Fight(info.start);
        let back = fight.get_outf();
        let allHurt = fight.get_hurt();
        //记录战斗日志
        tool_1.tool.addFightTeam(this.ctx, info.start);
        const bossCfg = gameCfg_1.default.monClubBoss.getItemCtx(this.ctx, bossid);
        //奖励
        let items = [];
        let gxb = Math.floor(allHurt / bossCfg.rate);
        gxb = Math.max(bossCfg.min, gxb);
        gxb = Math.min(bossCfg.max, gxb);
        items.push([1, 7, gxb]);
        info.end.win = back.win;
        info.end.items = items;
        info.end.hurt = allHurt;
        await this.update(info);
        await this.ctx.state.master.addItem2(items, "");
        return allHurt;
    }
}
exports.ActClubFightModel = ActClubFightModel;
//# sourceMappingURL=ActClubFightModel.js.map