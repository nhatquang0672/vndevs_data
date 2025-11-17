"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActDaoYouFightModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const game_1 = __importDefault(require("../../util/game"));
const gameMethod_1 = require("../../../common/gameMethod");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const fight_1 = require("../../../common/fight");
const UserModel_1 = require("../user/UserModel");
const setting_1 = __importDefault(require("../../crontab/setting"));
const tool_1 = require("../../util/tool");
const ActDaoyouModel_1 = require("./ActDaoyouModel");
const hook_1 = require("../../util/hook");
/**
 * 道友切磋
 */
class ActDaoYouFightModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actDaoYouFight"; //用于存储key 和  输出1级key
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
            levelId: "",
            did: "",
            start: {
                from: "",
                seed: 0,
                teams: {}
            },
            end: {
                win: 0,
                items: [] //获得奖励
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
    *  开启一场战斗
    */
    async fight_one(did, levelId) {
        let info = await this.getInfo();
        info = await this.init();
        info.did = did;
        info.levelId = levelId;
        let userModel = UserModel_1.UserModel.getInstance(this.ctx, this.id);
        let gStart = await userModel.getFightEps();
        let daoyouModel = ActDaoyouModel_1.ActDaoyouModel.getInstance(this.ctx, this.id);
        let daoyouInfo = await daoyouModel.getInfo();
        if (!daoyouInfo.daoyouMap[did]) {
            this.ctx.throw("参数错误");
        }
        //敌方阵容
        const cfgPveInfoList = gameCfg_1.default.pveDaoyouList.getItemListCtx(this.ctx, did);
        let pve;
        for (const _pve of cfgPveInfoList) {
            if (_pve.gid === levelId) {
                pve = gameMethod_1.gameMethod.objCopy(_pve);
            }
        }
        if (!pve) {
            this.ctx.throw("参数错误");
        }
        let daoyou = daoyouInfo.daoyouMap[did];
        //关卡不存在的话,刷新一下
        if (!daoyou.unlockLevel[levelId]) {
            daoyou = daoyouModel.refreshLevel(daoyou);
            daoyouInfo.daoyouMap[did] = daoyou;
            //刷新完成之后还不存在则有问题
            if (!daoyou.unlockLevel[levelId]) {
                this.ctx.throw("亲密度不足");
            }
        }
        if (daoyou.unlockLevel[levelId].state) {
            this.ctx.throw("已挑战成功");
        }
        const cfgMonInfo = gameCfg_1.default.monDaoyou.getItemCtx(this.ctx, pve.mid.toString());
        let monEps = gameMethod_1.gameMethod.ep_merge(gameMethod_1.gameMethod.ep_init(), cfgMonInfo.eps);
        //调控
        let cfgUserEp = setting_1.default.getSetting("1", "userEp");
        if (cfgUserEp != null && cfgUserEp.open.indexOf(this.id) != -1) {
            gStart.eps = cfgUserEp.userEps;
            monEps = cfgUserEp.monEps;
        }
        info.start = {
            from: "daoyou",
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
                    fid: pve.mid.toString(),
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
        await tool_1.tool.addFightTeam(this.ctx, info.start);
        info.end.win = back.win;
        if (info.end.win == 1) {
            //挑战完成
            daoyouInfo.daoyouMap[did].unlockLevel[levelId] = {
                state: 1,
                red: 0
            };
            info.end.items = game_1.default.addArr(info.end.items, pve.winItems);
            await daoyouModel.update(daoyouInfo);
        }
        else {
            daoyouInfo.daoyouMap[did].unlockLevel[levelId] = {
                state: 0,
                red: 0
            };
            await daoyouModel.update(daoyouInfo);
        }
        //加道具
        if (gameMethod_1.gameMethod.isEmpty(info.end.items) == false) {
            await this.ctx.state.master.addItem2(info.end.items, ""); //加道具
        }
        await hook_1.hookNote(this.ctx, "dyqiecuo", 1);
        await this.update(info);
    }
}
exports.ActDaoYouFightModel = ActDaoYouFightModel;
//# sourceMappingURL=ActDaoYouFightModel.js.map