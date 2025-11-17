"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HdDengShenBangLogModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const game_1 = __importDefault(require("../../util/game"));
const HdDengShenBangModel_1 = require("./HdDengShenBangModel");
/**
 * 登神榜
 * 跨服pvp 战斗日志
 * HdDouLuoLogLogModel
 */
class HdDengShenBangLogModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdDengShenBangLog"; //用于存储key 和  输出1级key
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
            weekId: "",
            list: {},
            iid: 0 //日志序号ID
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        let hsDengShenBangModel = HdDengShenBangModel_1.HdDengShenBangModel.getInstance(this.ctx, this.id, this.hdcid);
        let cfg = await hsDengShenBangModel._getHdCfg();
        let weekId = game_1.default.getWeekId();
        if (cfg != null && (cfg.info.id != info.hdid || info.weekId != weekId)) {
            info = this.init();
            //活动重置ID
            info.hdid = cfg.info.id;
            //每周重置ID
            info.weekId = weekId;
        }
        return info;
    }
    /**
     * 返回数据
     */
    async getOutPut() {
        let info = await this.getInfo();
        return {
            info: {},
            data: {},
            red: 0,
            outf: info.list,
        };
    }
    async getOutPut_u(iid) {
        let info = await this.getInfo();
        return info.list[iid];
    }
    //输出我的信息 //刷页面
    async getOutPut_outf() {
        let info = await this.getInfo();
        return info.list;
    }
    /**
     * 获取红点
     */
    async getRed() {
        return 0;
    }
    //加日志
    async addLog(log) {
        let MAX = 50; //最大日志条目 上线需要改为50
        let info = await this.getInfo();
        info.iid += 1;
        info.list[info.iid.toString()] = log;
        await this.update(info, [info.iid.toString()]);
        if (info.list[(info.iid - MAX).toString()] != null) {
            delete info.list[(info.iid - MAX).toString()];
            await this.update(info, []);
            await this.backData_d([(info.iid - MAX).toString()]);
        }
    }
}
exports.HdDengShenBangLogModel = HdDengShenBangLogModel;
//# sourceMappingURL=HdDengShenBangLogModel.js.map