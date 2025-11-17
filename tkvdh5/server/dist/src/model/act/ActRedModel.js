"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActRedModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
/**
 * 红点
 */
class ActRedModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actRed"; //用于存储key 和  输出1级key
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
        return {};
    }
    /**
     * 返回数据
     */
    async getOutPut() {
        let info = await this.getInfo();
        return info;
    }
    /**
     * 设置红点装备
     * @param key 红点key
     * @param val 红点状态1有红点0没有
     */
    async set(key, val) {
        let info = await this.getInfo();
        info[key] = val;
        await this.update(info);
    }
}
exports.ActRedModel = ActRedModel;
//# sourceMappingURL=ActRedModel.js.map