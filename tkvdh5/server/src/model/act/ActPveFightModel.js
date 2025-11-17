"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActPveFightModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const ActPveInfoModel_1 = require("./ActPveInfoModel");
const game_1 = __importDefault(require("../../util/game"));
const gameMethod_1 = require("../../../common/gameMethod");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const fight_1 = require("../../../common/fight");
const UserModel_1 = require("../user/UserModel");
const setting_1 = __importDefault(require("../../crontab/setting"));
const hook_1 = require("../../util/hook");
const HdNewModel_1 = require("../hd/HdNewModel");
const ActRedDailyModel_1 = require("./ActRedDailyModel");
const tool_1 = require("../../util/tool");
/**
 * pve 战斗
 */
class ActPveFightModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actPveFight"; //用于存储key 和  输出1级key
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
            nowId: 0,
            start: {
                from: "",
                seed: 0,
                teams: {}
            },
            end: {
                win: 0,
                items: [] //获得奖励
            },
            pkFirst: true,
            pkAt: this.ctx.state.newTime //战斗时间
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
    async fight_one(pveId = -1) {
        let info = await this.getInfo();
        if (info.pkFirst == null) {
            info.pkFirst = true;
        }
        let pkFirst = info.pkFirst;
        info = await this.init();
        let actPveInfoModel = ActPveInfoModel_1.ActPveInfoModel.getInstance(this.ctx, this.id);
        let actPveInfo = await actPveInfoModel.getInfo();
        info.nowId = actPveInfo.id; //当前在打的关卡ID
        if (pveId != -1) {
            info.nowId = pveId;
        }
        let userModel = UserModel_1.UserModel.getInstance(this.ctx, this.id);
        let gStart = await userModel.getFightEps();
        //敌方阵容
        let cfgPveInfo = gameCfg_1.default.pveInfo.getItemCtx(this.ctx, info.nowId.toString());
        let cfgMonInfo = gameCfg_1.default.monPve.getItemCtx(this.ctx, cfgPveInfo.mid.toString());
        let monEps = gameMethod_1.gameMethod.ep_merge(gameMethod_1.gameMethod.ep_init(), cfgMonInfo.eps);
        //调控
        let cfgUserEp = setting_1.default.getSetting("1", "userEp");
        if (cfgUserEp != null && cfgUserEp.open.indexOf(this.id) != -1) {
            let initEp = gameMethod_1.gameMethod.ep_init();
            gStart.eps = gameMethod_1.gameMethod.ep_merge(initEp, cfgUserEp.userEps);
            monEps = gameMethod_1.gameMethod.ep_merge(initEp, cfgUserEp.monEps);
        }
        info.start = {
            from: "pve",
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
                    fid: cfgPveInfo.mid.toString(),
                    zhanwei: 0,
                    eps: monEps,
                    level: 0,
                    wxSk: {},
                    isnq: 0,
                    jgSk: {} //精怪技能
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
        //战斗
        let fight = new fight_1.Fight(info.start);
        let back = fight.get_outf();
        //记录战斗日志
        tool_1.tool.addFightTeam(this.ctx, info.start);
        info.end.win = back.win;
        if (info.end.win == 1) {
            info.end.items = game_1.default.addArr(info.end.items, cfgPveInfo.winItems);
            await actPveInfoModel.pvePass(); //过关
            info.pkFirst = true;
        }
        else {
            info.pkFirst = false;
            //活动 - 签到
            let cfgHdNew = setting_1.default.getHuodong2(await this.getHeIdByUuid(this.id), "hdNew");
            if (cfgHdNew != null) {
                for (const hdcid in cfgHdNew) {
                    let hdNewModel = HdNewModel_1.HdNewModel.getInstance(this.ctx, this.id, hdcid);
                    await hdNewModel.setIsShow();
                }
            }
            //记录战斗失败次数
            let actRedDailyModel = ActRedDailyModel_1.ActRedDailyModel.getInstance(this.ctx, this.id);
            await actRedDailyModel.battleFailed();
        }
        //加道具
        if (gameMethod_1.gameMethod.isEmpty(info.end.items) == false) {
            await this.ctx.state.master.addItem2(info.end.items, ""); //加道具
        }
        await this.update(info);
        await hook_1.hookNote(this.ctx, "pvePk", 1);
    }
}
exports.ActPveFightModel = ActPveFightModel;
//# sourceMappingURL=ActPveFightModel.js.map