"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HdWuLinPartyModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
/**
 * 合服活动 （魔种降生）
 */
class HdWuLinPartyModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdWuLinParty"; //用于存储key 和  输出1级key
        this.outIsAu = true; //下发数据是否用au下发
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
        return this.hdcid; //输出2级key
    }
    //初始化
    init() {
        return {
            hdid: "",
            time: this.ctx.state.newTime,
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        let cfg = (await this.getHdCfg());
        if (cfg != null && cfg.info.id != info.hdid) {
            info = this.init();
            info.hdid = cfg.info.id;
        }
        return info;
    }
    /**
     * 返回数据
     */
    async getOutPut() {
        return {
            info: await this.getOutPut_u("info"),
            data: await this.getOutPut_u("data"),
            red: await this.getOutPut_u("red"),
            outf: await this.getOutPut_u("outf"),
        };
    }
    async getOutPut_u(key) {
        let cfg = (await this.getHdCfg());
        if (cfg == null) {
            return null;
        }
        let info = await this.getInfo();
        switch (key) {
            case "info":
                return cfg[key];
            case "data":
                return cfg[key];
            case "red":
                return await this.getRed();
            case "outf":
                return info;
        }
        return null;
    }
    /**
     * 获取红点
     */
    async getRed() {
        let cfg = (await this.getHdCfg());
        if (cfg == null) {
            return 0;
        }
        return 0;
    }
    /**
     * 辅助方法：检查活动状态和获取信息
     *
     * @returns 存储数据和活动配置数据
     */
    async checkActivityAndGetInfo() {
        const cfg = (await this.getHdCfg());
        const info = await this.getInfo();
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未开启");
        }
        return { info, cfg };
    }
    async gift(id) {
        const { info, cfg } = await this.checkActivityAndGetInfo();
    }
}
exports.HdWuLinPartyModel = HdWuLinPartyModel;
//# sourceMappingURL=HdWuLinPartyModel.js.map