"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SevLiuDaoModel = void 0;
const master_1 = require("../../util/master");
const AModel_1 = require("../AModel");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
/**
 * 六道秘境 - sev
 */
class SevLiuDaoModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "sev"; //数据库表名
        this.kid = "sevLiuDao"; //用于存储key 和  输出1级key
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
            cj: {}
        };
    }
    async getOutPut() {
        let info = await this.getInfo();
        return info;
    }
    /**
     * 添加排行
     * @param fuuid
     * @param maxId
     * @returns
     */
    async addFuuid(fuuid, maxId) {
        let cfgCj = gameCfg_1.default.liudaoSevCj.getItem(maxId.toString());
        if (cfgCj == null) {
            return;
        }
        let info = await this.getInfo();
        if (info.cj[maxId] == null) {
            info.cj[maxId] = [];
        }
        if (info.cj[maxId].length >= 10) {
            return; //最多放10个
        }
        info.cj[maxId].push(fuuid);
        await this.update(info);
    }
}
exports.SevLiuDaoModel = SevLiuDaoModel;
//# sourceMappingURL=SevLiuDaoModel.js.map