"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActRedDailyModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const Xys_1 = require("../../../common/Xys");
const HdNewModel_1 = require("../hd/HdNewModel");
const UserModel_1 = require("../user/UserModel");
const setting_1 = __importDefault(require("../../crontab/setting"));
const HdTimeBen2Model_1 = require("../hd/HdTimeBen2Model");
const gameMethod_1 = require("../../../common/gameMethod");
const ActTaskMainModel_1 = require("./ActTaskMainModel");
/**
 * 红点 每日重置
 */
class ActRedDailyModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actRedDaily"; //用于存储key 和  输出1级key
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
    //初始化
    init() {
        return {
            battleFailed: 0,
            outTime: 0,
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        if (info.outTime != 1) {
            info = this.init();
        }
        //新增字段赋值 //新增字段 要在这里赋值
        // if (info.battleFailed == null){
        //     info.battleFailed = 0
        // }
        if (info.outTime <= this.ctx.state.newTime) {
            info.outTime = this.ctx.state.new0 + 86400;
            //重置一些字段
            info.battleFailed = 0;
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
     * 战斗失败统计
     */
    async battleFailed(count = 1) {
        let info = await this.getInfo();
        info.battleFailed += 1;
        await this.update(info);
        let userModel = UserModel_1.UserModel.getInstance(this.ctx, this.id);
        let level = (await userModel.getInfo()).level; //玩家等级
        //弹出XX礼包
        //如果 前3次 并且新手礼包 存在 就不作为(前端展示新手礼包)
        if (info.battleFailed <= 3 && level < 100) {
            //新手礼包
            let cfgHdNew = setting_1.default.getHuodong2(await this.getHeIdByUuid(this.id), "hdNew");
            if (cfgHdNew != null) {
                for (const hdcid in cfgHdNew) {
                    let hdNewModel = HdNewModel_1.HdNewModel.getInstance(this.ctx, this.id, hdcid);
                    if (await hdNewModel.isShow()) {
                        //新人礼包 生效中 前端去弹出 新人礼包
                        return;
                    }
                }
            }
        }
        //活动 - 限时福利 改版列表版
        let cfgHdTimeBen2 = setting_1.default.getHuodong2(await this.getHeIdByUuid(this.id), "hdTimeBen2");
        if (cfgHdTimeBen2 != null) {
            for (const hdcid in cfgHdTimeBen2) {
                //功能开启类
                let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
                let rcfs = []; //可随机表
                //剑灵
                if (await actTaskMainModel.kaiqi("5200") > 0) {
                    rcfs.push(Xys_1.TimeBen2Type.chibang);
                }
                //兽灵【升级】
                if (await actTaskMainModel.kaiqi("7200") > 0) {
                    rcfs.push(Xys_1.TimeBen2Type.fazhen);
                }
                //星宿【宝石】礼包、
                if (await actTaskMainModel.kaiqi("7400") > 0) {
                    rcfs.push(Xys_1.TimeBen2Type.baoshi);
                }
                //附魔
                if (await actTaskMainModel.kaiqi("8000") > 0) {
                    rcfs.push(Xys_1.TimeBen2Type.fumo);
                }
                //随机一个
                if (rcfs.length > 0) {
                    //随机一个
                    let type = rcfs[gameMethod_1.gameMethod.rand(1, rcfs.length) - 1];
                    let hdTimeBen2Model = HdTimeBen2Model_1.HdTimeBen2Model.getInstance(this.ctx, this.id, hdcid);
                    await hdTimeBen2Model.trip(type);
                }
            }
        }
    }
}
exports.ActRedDailyModel = ActRedDailyModel;
//# sourceMappingURL=ActRedDailyModel.js.map