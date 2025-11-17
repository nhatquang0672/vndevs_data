"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SevAdokClubModel = void 0;
const master_1 = require("../../util/master");
const AModel_1 = require("../AModel");
const game_1 = __importDefault(require("../../util/game"));
/**
 * sev信息 版本号 - 公会
 */
class SevAdokClubModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "sev"; //数据库表名
        this.kid = "adokClub"; //用于存储key 和  输出1级key
        this.outIsAu = false; //下发数据是否用au下发
        this.dType = master_1.DataType.sev;
    }
    //单例模式
    static getInstance(ctx, clubId, hdcid = "1") {
        let dlKey = this.name + "_" + clubId + "_" + hdcid; //单例模式key
        if (!ctx.state.model[dlKey]) {
            ctx.state.model[dlKey] = new this(ctx, clubId, hdcid);
        }
        return ctx.state.model[dlKey];
    }
    outKey2() {
        return ""; //输出2级key
    }
    init() {
        return game_1.default.sevAdok_club_init();
    }
    async getOutPut() {
        return null;
    }
    async getInfo() {
        let info = await super.getInfo();
        if (info.apply == null) {
            info.apply = 0;
        }
        if (info.clubFx == null) {
            info.clubFx = 0;
        }
        return info;
    }
    /**
     * 设置本功能版本号
     * @param key
     * @param val
     */
    async setVer(key, val = null) {
        let info = await this.getInfo();
        switch (key) {
            case "club":
                info.base += 1;
                break;
            case "clubMember":
                info.member += 1;
                break;
            case "clubApply":
                info.apply += 1;
                break;
            case "clubHelp":
                info.help += 1;
            case "clubChat":
                if (val != null) {
                    info.chat = val;
                }
                break;
            case "clubFx":
                info.clubFx += 1;
                break;
        }
        await this.update(info, [""]);
    }
}
exports.SevAdokClubModel = SevAdokClubModel;
//# sourceMappingURL=SevAdokClubModel.js.map