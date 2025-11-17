"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RdsClubModel = void 0;
const RModel_1 = require("../RModel");
const SevClubModel_1 = require("../sev/SevClubModel");
/**
 * 公会输出类型的排行榜
 */
class RdsClubModel extends RModel_1.RModel {
    //单例模式
    static getInstance(ctx, kid, sevId, hdcid = "x", hid = "1") {
        let dlKey = this.name + "_" + kid + "_" + hdcid + "_" + sevId; //单例模式key
        if (!ctx.state.model[dlKey]) {
            ctx.state.model[dlKey] = new this(kid, hdcid, sevId, hid);
        }
        return ctx.state.model[dlKey];
    }
    async getInfo(ctx, clubId, rid, score) {
        let sevClubModel = SevClubModel_1.SevClubModel.getInstance(ctx, clubId);
        let opt = {
            info: await sevClubModel.getOutPut(),
            rid: rid,
            score: Math.ceil(parseFloat(score)).toString(),
        };
        return opt;
    }
}
exports.RdsClubModel = RdsClubModel;
//# sourceMappingURL=RdsClubModel.js.map