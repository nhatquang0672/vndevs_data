"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SevPvdModel = void 0;
const master_1 = require("../../util/master");
const AModel_1 = require("../AModel");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
/**
 * 竞技场保护
 */
class SevPvdModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "sev"; //数据库表名
        this.kid = "sevPvd"; //用于存储key 和  输出1级key
        this.outIsAu = false; //下发数据是否用au下发
        this.dType = master_1.DataType.sev;
    }
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
        return {
            time: 0,
            pkid: 1 //配置表dailyboss下info下的唯一ID
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        //每日更新
        if (this.ctx.state.new0 > info.time) {
            info.time = this.ctx.state.newTime;
            info.pkid += 1;
            let cfg = gameCfg_1.default.dailybossInfo.getItem(info.pkid.toString());
            if (cfg == null) {
                info.pkid = 1;
            }
            await this.update(info, ['']);
        }
        return info;
    }
    async getOutPut() {
        let info = await this.getInfo();
        return info;
    }
}
exports.SevPvdModel = SevPvdModel;
//# sourceMappingURL=SevPvdModel.js.map