"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActPveInfoModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const hook_1 = require("../../util/hook");
/**
 * pve 信息
 */
class ActPveInfoModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actPveInfo"; //用于存储key 和  输出1级key
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
        return {
            id: 1,
            jdRwd: []
        };
    }
    /**
     * 返回数据
     */
    async getOutPut() {
        let info = await this.getInfo();
        return info;
    }
    /**
    *  过关
    */
    async pvePass() {
        let info = await this.getInfo();
        info.id += 1;
        await this.update(info);
        await hook_1.hookNote(this.ctx, "pvePass", info.id - 1);
    }
    /**
    *  领取节点奖励
    */
    async jiedianRwd(id) {
        let cfg = gameCfg_1.default.pveInfo.getItemCtx(this.ctx, id);
        let info = await this.getInfo();
        if (info.id < parseInt(id)) {
            this.ctx.throw("未解锁");
        }
        if (info.jdRwd.indexOf(id) != -1) {
            this.ctx.throw("已领取");
        }
        info.jdRwd.push(id);
        await this.update(info);
        await this.ctx.state.master.addItem2(cfg.zjItems);
    }
}
exports.ActPveInfoModel = ActPveInfoModel;
//# sourceMappingURL=ActPveInfoModel.js.map