"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActClubMjModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
/**
 * 工会 个人信息
 */
class ActClubMjModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actClubMj"; //用于存储key 和  输出1级key
        this.outIsAu = false; //下发数据是否用au下发
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
        return ""; //输出2级key
    }
    init() {
        return {
            list: {
                '1': { id: 1 }, '2': { id: 1 }, '3': { id: 1 }, '4': { id: 1 }, '5': { id: 1 }, '6': { id: 1 },
            },
        };
    }
    async getOutPut() {
        let info = await this.getInfo();
        return info;
    }
    /**
     * 升级升阶
     */
    async mjUpLv(type) {
        let info = await this.getInfo();
        if (info.list[type] == null) {
            this.ctx.throw("参数错误");
        }
        let cfgNext = gameCfg_1.default.clubMiji.getItem(type, (info.list[type].id + 1).toString());
        if (cfgNext == null) {
            this.ctx.throw("已满级");
        }
        let cfg = gameCfg_1.default.clubMiji.getItemCtx(this.ctx, type, info.list[type].id.toString());
        let needs = [];
        if (cfg.need1 > 0) {
            needs.push([1, 912, cfg.need1]);
        }
        if (cfg.need2 > 0) {
            needs.push([1, 913, cfg.need2]);
        }
        await this.ctx.state.master.subItem2(needs);
        info.list[type].id += 1;
        await this.update(info);
    }
}
exports.ActClubMjModel = ActClubMjModel;
//# sourceMappingURL=ActClubMjModel.js.map