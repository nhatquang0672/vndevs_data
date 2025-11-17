"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActPveJyModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const Xys_1 = require("../../../common/Xys");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const hook_1 = require("../../util/hook");
const HdPriCardModel_1 = require("../hd/HdPriCardModel");
/**
 * pve精英 信息
 */
class ActPveJyModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actPveJy"; //用于存储key 和  输出1级key
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
            time: 0,
            id: 1,
            sdNum: 0 //今日已扫荡次数
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        if (this.ctx.state.new0 > info.time) {
            info.time = this.ctx.state.newTime;
            info.sdNum = 0;
        }
        return info;
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
    async pveJyPass() {
        let info = await this.getInfo();
        info.id += 1;
        await this.update(info);
    }
    /**
    *  扫荡
    */
    async saodang() {
        let cfgMath = gameCfg_1.default.mathInfo.getItemCtx(this.ctx, 'pvej_saodang');
        if (cfgMath.pram.count == null) {
            this.ctx.throw("配置错误Math_pvej_saodang");
            return;
        }
        let sdcount = cfgMath.pram.count;
        let hdPriCardModel = HdPriCardModel_1.HdPriCardModel.getInstance(this.ctx, this.id, Xys_1.PriCardType.moon);
        let hdmoon = await hdPriCardModel.getInfo();
        if (hdmoon.btime < 0 || hdmoon.btime > this.ctx.state.newTime) {
            sdcount += 2;
        }
        let info = await this.getInfo();
        if (info.sdNum >= sdcount) {
            this.ctx.throw("无扫荡次数");
        }
        let cfg = gameCfg_1.default.pveJingying.getItemCtx(this.ctx, (info.id - 1).toString());
        if (cfg.sdNeed[info.sdNum] == null) {
            this.ctx.throw("pveJing配置错误");
        }
        if (cfg.sdNeed[info.sdNum] > 0) {
            await this.ctx.state.master.subItem1([1, 1, cfg.sdNeed[info.sdNum]]);
        }
        await this.ctx.state.master.addItem2(cfg.sdItems);
        info.sdNum++;
        await this.update(info);
        await hook_1.hookNote(this.ctx, "pveJySd", 1);
    }
}
exports.ActPveJyModel = ActPveJyModel;
//# sourceMappingURL=ActPveJyModel.js.map