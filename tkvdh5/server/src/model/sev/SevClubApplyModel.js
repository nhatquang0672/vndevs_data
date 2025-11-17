"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SevClubApplyModel = void 0;
const master_1 = require("../../util/master");
const AModel_1 = require("../AModel");
const cache_1 = __importDefault(require("../../../src/util/cache"));
const SevAdokClubModel_1 = require("./SevAdokClubModel");
const ActClubModel_1 = require("../act/ActClubModel");
const tool_1 = require("../../util/tool");
/**
 * 公会成员
 */
class SevClubApplyModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "sev"; //数据库表名
        this.kid = "clubApply"; //用于存储key 和  输出1级key
        this.outIsAu = true; //下发数据是否用au下发
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
            count: 0,
        };
    }
    async update(info, keys = []) {
        await super.update(info, keys);
        //通知adok 更新
        let sevAdokClubModel = SevAdokClubModel_1.SevAdokClubModel.getInstance(this.ctx, this.id);
        await sevAdokClubModel.setVer("clubApply");
    }
    //公会成员XX
    async getOutPut() {
        let info = await this.getInfo();
        let opt = {};
        for (const fuuid in info.list) {
            let actClubModel = ActClubModel_1.ActClubModel.getInstance(this.ctx, fuuid);
            opt[fuuid] = {
                user: await cache_1.default.getFUser(this.ctx, fuuid),
                active7D: await actClubModel.getActive(),
            };
        }
        return opt;
    }
    /**
     * 获取成员
     */
    async getById(id) {
        let info = await this.getInfo();
        if (info.list[id] == null) {
            this.ctx.throw("成员错误:" + id);
        }
        return info.list[id];
    }
    /**
     * 检查成员已满
     */
    async isFull() {
        let info = await this.getInfo();
        //获取成员配置
        //创建公会货币需求
        let club_maxMember = tool_1.tool.mathcfg_count(this.ctx, "club_maxMember");
        if (info.count >= club_maxMember) {
            this.ctx.throw(`申请人数已满`);
        }
        return info.count;
    }
    /**
     * 添加成员
     */
    async add(fuuid, post = "") {
        let info = await this.getInfo();
        if (info.list[fuuid] != null) {
            this.ctx.throw(`已经申请了`);
        }
        info.list[fuuid] = this.ctx.state.newTime;
        info.count = Object.keys(info.list).length;
        await this.update(info, [""]);
    }
    /**
     * 删除成员
     */
    async del(fuuid) {
        let info = await this.getInfo();
        if (info.list[fuuid] == null) {
            return;
        }
        delete info.list[fuuid];
        info.count = Object.keys(info.list).length;
        await this.update(info, [""]);
    }
}
exports.SevClubApplyModel = SevClubApplyModel;
//# sourceMappingURL=SevClubApplyModel.js.map