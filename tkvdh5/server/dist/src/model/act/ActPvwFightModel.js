"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActPvwFightModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const game_1 = __importDefault(require("../../util/game"));
const gameMethod_1 = require("../../../common/gameMethod");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const fight_1 = require("../../../common/fight");
const UserModel_1 = require("../user/UserModel");
const ActRedDailyModel_1 = require("./ActRedDailyModel");
const tool_1 = require("../../util/tool");
/**
 * 试炼 战斗
 */
class ActPvwFightModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actPvwFight"; //用于存储key 和  输出1级key
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
     *
     */
    async fight_one(actPvw) {
        let info = this.init();
        //创建对战阵容 
        let userModel = UserModel_1.UserModel.getInstance(this.ctx, this.id);
        let gStart = await userModel.getFightEps();
        //我的属性增幅
        let epadd = gameMethod_1.gameMethod.ep_pvw(actPvw.pos);
        let myeps = gameMethod_1.gameMethod.ep_merge(gStart.eps, epadd);
        //敌方阵容
        let pvwMonster = gameCfg_1.default.pvwMonster.getItemCtx(this.ctx, (actPvw.nowId + 1).toString());
        let feps = gameMethod_1.gameMethod.ep_init();
        feps = gameMethod_1.gameMethod.ep_merge(feps, gameCfg_1.default.monPvw.getItemCtx(this.ctx, actPvw.monId).eps); // + 穿着装备
        info.start = {
            from: "pvw",
            seed: game_1.default.rand(1, 65535),
            teams: {
                "10": {
                    fid: this.id,
                    zhanwei: 0,
                    eps: myeps,
                    level: 0,
                    wxSk: gStart.wxSk,
                    isnq: gStart.isnq,
                    jgSk: gStart.jgSk //精怪技能
                },
                "20": {
                    fid: actPvw.monId,
                    zhanwei: 0,
                    eps: feps,
                    level: 0,
                    wxSk: {},
                    isnq: 0,
                    jgSk: {} //精怪技能
                },
            }
        };
        //战斗
        let fight = new fight_1.Fight(info.start);
        let back = fight.get_outf();
        //记录战斗日志
        tool_1.tool.addFightTeam(this.ctx, info.start);
        info.end.win = back.win;
        // //加上首通奖励
        if (info.end.win == 1) {
            info.end.items = [];
            if (actPvw.nowId + 1 > actPvw.histMax) {
                info.end.items = game_1.default.addArr(info.end.items, pvwMonster.frwd);
            }
            if (actPvw.nowId + 1 > actPvw.dayMax) {
                info.end.items = game_1.default.addArr(info.end.items, pvwMonster.drwd);
            }
            if (info.end.items.length > 0) {
                await this.ctx.state.master.addItem2(info.end.items, ""); //加道具
            }
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
        await this.update(info);
        return info.end.win;
    }
}
exports.ActPvwFightModel = ActPvwFightModel;
//# sourceMappingURL=ActPvwFightModel.js.map