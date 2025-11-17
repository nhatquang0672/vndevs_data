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
exports.RdsUserModel = void 0;
const RModel_1 = require("../RModel");
const Xys = __importStar(require("../../../common/Xys"));
const cache_1 = __importDefault(require("../../util/cache"));
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const gameMethod_1 = require("../../../common/gameMethod");
const game_1 = __importDefault(require("../../util/game"));
/**
 * 用户输出类型的排行榜
 */
class RdsUserModel extends RModel_1.RModel {
    //单例模式
    static getInstance(ctx, kid, sevId, hdcid = "x", hid = "1") {
        let dlKey = this.name + "_" + kid + "_" + hdcid + "_" + sevId + "_" + hid; //单例模式key
        if (!ctx.state.model[dlKey]) {
            ctx.state.model[dlKey] = new this(kid, hdcid, sevId, hid);
            if (kid == Xys.RdsUser.rdsDouLuo) {
                //升序
                ctx.state.model[dlKey]._sortType = -1;
            }
        }
        return ctx.state.model[dlKey];
    }
    async getInfo(ctx, fuuid, rid, score) {
        if (this.kid == "rdsJjc") {
            if (parseInt(fuuid) < 100000) {
                //机器人
                let cfg = gameCfg_1.default.jjcNpc.getItemCtx(ctx, fuuid);
                let actFazhen = { list: {}, useGzId: "" };
                if (cfg.shouling.length > 0) {
                    actFazhen = {
                        list: { "1": { fzid: cfg.shouling[0], saveId: cfg.shouling[1], otherEps: {}, zaddp: 0, faddp: 0 } },
                        useGzId: "1",
                    };
                }
                return {
                    uid: "",
                    uuid: fuuid,
                    sid: this.id,
                    name: cfg.name,
                    sex: 0,
                    head: "",
                    wxhead: "",
                    tzid: "",
                    level: cfg.level,
                    lastlogin: ctx.state.newTime,
                    rid: rid,
                    score: Math.ceil(parseFloat(score)),
                    clubName: "",
                    chid: "1",
                    cbid: "1",
                    sevBack: {
                        actChiBang: {
                            hh: cfg.jianling[0].toString(),
                            hhList: [cfg.jianling[0].toString()],
                            id: cfg.jianling[1],
                            exp: 0,
                            cleps: {},
                        },
                        actFazhen: actFazhen,
                    },
                };
            }
        }
        else if (this.kid == Xys.RdsUser.rdsDouLuo) {
            //最强斗罗
            if (gameMethod_1.gameMethod.isNpc(fuuid) || rid >= 495) {
                fuuid = rid.toString();
                // 机器人
                let cfg = gameCfg_1.default.douLuoNpc.getItemCtx(ctx, fuuid);
                let sevBack = game_1.default.getDouLuoNpc(fuuid);
                let opt = {
                    uid: "",
                    uuid: fuuid,
                    sid: cfg.sevname,
                    name: cfg.name,
                    sex: 0,
                    head: "",
                    wxhead: "",
                    tzid: "",
                    level: cfg.level,
                    lastlogin: ctx.state.newTime,
                    rid: rid,
                    score: Math.ceil(parseFloat(score)),
                    clubName: "",
                    chid: cfg.chenghao,
                    cbid: "",
                };
                if (sevBack != null) {
                    opt.sevBack = sevBack;
                }
                return opt;
            }
            rid = Number(score); //名次 = 积分
        }
        let fuser = await cache_1.default.getFUser(ctx, fuuid);
        fuser.rid = rid;
        fuser.score = Math.ceil(parseFloat(score));
        if (rid >= 1 && rid <= 3) {
            let fuserAll = await cache_1.default.getFUser(ctx, fuuid);
            fuser.sevBack = fuserAll.sevBack;
        }
        return fuser;
    }
}
exports.RdsUserModel = RdsUserModel;
//# sourceMappingURL=RdsUserModel.js.map