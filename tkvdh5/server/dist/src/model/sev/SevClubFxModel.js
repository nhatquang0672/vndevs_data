"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SevClubFxModel = void 0;
const master_1 = require("../../util/master");
const AModel_1 = require("../AModel");
const SevAdokClubModel_1 = require("./SevAdokClubModel");
/**
 * 公会 - 福星
 */
class SevClubFxModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "sev"; //数据库表名
        this.kid = "clubFx"; //用于存储key 和  输出1级key
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
            list: {},
            dayAt: 0,
            cons: 0 //今日福字总数量
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        //每日重置时间
        if (info.dayAt < this.ctx.state.new0) {
            info.dayAt = this.ctx.state.newTime;
            info.list = {};
            info.cons = 0;
        }
        return info;
    }
    async getOutPut() {
        let info = await this.getInfo();
        return info;
    }
    /**
     * 添加列表
     * @param cons 福字数量
     * @param yl 阅历
     * @param jjd 进阶点
     * @param gx 贡献
     */
    async addList(fuuid, cons, yl, jjd, gx) {
        let info = await this.getInfo();
        if (info.list[fuuid] == null) {
            info.list[fuuid] = [0, 0, 0, 0];
        }
        info.list[fuuid][0] += cons;
        info.list[fuuid][1] += yl;
        info.list[fuuid][2] += jjd;
        info.list[fuuid][3] += gx;
        info.cons += cons;
        await this.update(info, [""]);
        //通知adok 更新
        let sevAdokClubModel = SevAdokClubModel_1.SevAdokClubModel.getInstance(this.ctx, this.id);
        await sevAdokClubModel.setVer("clubFx");
    }
    /**
     * 去除列表
     * @param cons 福字数量
     */
    async subList(fuuid) {
        let info = await this.getInfo();
        delete info.list[fuuid];
        await this.update(info, [""]);
        //通知adok 更新
        let sevAdokClubModel = SevAdokClubModel_1.SevAdokClubModel.getInstance(this.ctx, this.id);
        await sevAdokClubModel.setVer("clubFx");
    }
}
exports.SevClubFxModel = SevClubFxModel;
//# sourceMappingURL=SevClubFxModel.js.map