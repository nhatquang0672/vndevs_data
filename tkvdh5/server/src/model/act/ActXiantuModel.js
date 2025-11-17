"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActXiantuModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const ActJjcInfoModel_1 = require("./ActJjcInfoModel");
const ActTaskMainModel_1 = require("./ActTaskMainModel");
const ActGuideModel_1 = require("./ActGuideModel");
const HdNewModel_1 = require("../hd/HdNewModel");
/**
 * 仙途
 */
class ActXiantuModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actXiantu"; //用于存储key 和  输出1级key
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
            list: {} //本轮升阶总奖励
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
    *  仙途领取奖励
    */
    async xiantu(id) {
        let info = await this.getInfo();
        if (info.list[id] != null) {
            this.ctx.throw("奖励已经领取");
        }
        let cfg = gameCfg_1.default.xiantuInfo.getItemCtx(this.ctx, id);
        let actGuideModel = await ActGuideModel_1.ActGuideModel.getInstance(this.ctx, this.id);
        let actGuide = await actGuideModel.getInfo();
        if (actGuide.kaiqi[cfg.id] != null && actGuide.kaiqi[cfg.id] == 1) {
            info.list[id] = this.ctx.state.newTime;
            await this.update(info);
            await this.ctx.state.master.addItem2(cfg.items);
            return; //老版本已经开启
        }
        if (cfg.id == "6600") {
            let hdNewModel = HdNewModel_1.HdNewModel.getInstance(this.ctx, this.id, "1");
            let hdNew = await hdNewModel.getInfo();
            if (hdNew.dc > 0 || hdNew.buy > 0) {
                info.list[id] = this.ctx.state.newTime;
                await this.update(info);
                await this.ctx.state.master.addItem2(cfg.items);
                return; //老版本已经开启
            }
        }
        let cfgKq = gameCfg_1.default.kaiqiInfo.getItemCtx(this.ctx, id);
        switch (cfgKq.type1) {
            case 1:
                if (cfgKq.param1 > this.ctx.state.level) {
                    this.ctx.throw("未满足条件");
                }
                break;
            case 2:
                let actJjcInfoModel = ActJjcInfoModel_1.ActJjcInfoModel.getInstance(this.ctx, this.id);
                let actJjcInfo = await actJjcInfoModel.getInfo();
                if (cfgKq.param1 > actJjcInfo.pkNum) {
                    this.ctx.throw("未满足条件");
                }
                break;
            case 4:
                let actTaskMainModel = await ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
                let actTaskMain = await actTaskMainModel.getInfo();
                if (actTaskMain.id <= cfgKq.param1) {
                    this.ctx.throw("未满足条件");
                }
                break;
            default:
                this.ctx.throw("kind_未处理");
        }
        info.list[id] = this.ctx.state.newTime;
        await this.update(info);
        await this.ctx.state.master.addItem2(cfg.items);
    }
}
exports.ActXiantuModel = ActXiantuModel;
//# sourceMappingURL=ActXiantuModel.js.map