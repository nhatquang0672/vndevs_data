"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SevJjcModel = void 0;
const master_1 = require("../../util/master");
const AModel_1 = require("../AModel");
const tool_1 = require("../../util/tool");
/**
 * 竞技场保护
 */
class SevJjcModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "sev"; //数据库表名
        this.kid = "sevJjc"; //用于存储key 和  输出1级key
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
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        for (const fuuid in info.list) {
            if (info.list[fuuid] < this.ctx.state.newTime) {
                delete info.list[fuuid];
            }
        }
        return info;
    }
    //公会成员XX
    async getOutPut() {
        let info = await this.getInfo();
        return info;
    }
    /**
     * 添加用户
     */
    async addList(fuuid) {
        let jjc_baohu = tool_1.tool.mathcfg_count(this.ctx, 'jjc_baohu');
        let info = await this.getInfo();
        info.list[fuuid] = this.ctx.state.newTime + jjc_baohu;
        await this.update(info, ['']);
    }
}
exports.SevJjcModel = SevJjcModel;
//# sourceMappingURL=SevJjcModel.js.map