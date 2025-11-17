"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActDongTianFightModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const game_1 = __importDefault(require("../../util/game"));
const fight_1 = require("../../../common/fight");
const UserModel_1 = require("../user/UserModel");
const tool_1 = require("../../util/tool");
const cache_1 = __importDefault(require("../../util/cache"));
/**
 * 洞天 战斗
 */
class ActDongTianFightModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actDongTianFight"; //用于存储key 和  输出1级key
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
                carid: "" //矿车ID
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
     */
    async fight_one(fuuid, carid) {
        let info = this.init();
        info.start.seed = game_1.default.rand(1, 65535); //生成随机种子
        let userModel = UserModel_1.UserModel.getInstance(this.ctx, this.id);
        let gStart = await userModel.getFightEps();
        let fuserModel = UserModel_1.UserModel.getInstance(this.ctx, fuuid);
        let fgStart = await fuserModel.getFightEps();
        info.fuserAll = await cache_1.default.getFUser(this.ctx, fuuid),
            info.start = {
                from: "dongtianpvp",
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
                        fid: fuuid,
                        zhanwei: 0,
                        eps: fgStart.eps,
                        level: 0,
                        wxSk: fgStart.wxSk,
                        isnq: fgStart.isnq,
                        jgSk: fgStart.jgSk //精怪技能
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
        //战斗
        let fight = new fight_1.Fight(info.start);
        let back = fight.get_outf();
        //记录战斗日志
        tool_1.tool.addFightTeam(this.ctx, info.start);
        info.end.win = back.win;
        info.end.carid = carid;
        await this.update(info);
        return back.win;
    }
}
exports.ActDongTianFightModel = ActDongTianFightModel;
//# sourceMappingURL=ActDongTianFightModel.js.map