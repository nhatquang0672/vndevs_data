"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActGuideModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const ActEquipModel_1 = require("./ActEquipModel");
const ActBoxModel_1 = require("./ActBoxModel");
const ActTaskMainModel_1 = require("./ActTaskMainModel");
const setting_1 = __importDefault(require("../../crontab/setting"));
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const ActJjcInfoModel_1 = require("./ActJjcInfoModel");
const gameMethod_1 = require("../../../common/gameMethod");
/**
 * 新手引导
 */
class ActGuideModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actGuide"; //用于存储key 和  输出1级key
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
            heid: setting_1.default.getHeid(this.ctx.state.sid),
            list: {},
            kqver: 1,
            kaiqi: {}
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        if (info.kqver != 1) {
            info.kqver = 1;
            info.kaiqi = {};
            let cfgPool = gameCfg_1.default.kaiqiInfo.pool;
            for (const key in cfgPool) {
                switch (cfgPool[key].type) {
                    case 1:
                        if (this.ctx.state.level >= cfgPool[key].param) {
                            info.kaiqi[cfgPool[key].id] = 1;
                        }
                        break;
                    case 2:
                        let actJjcInfoModel = await ActJjcInfoModel_1.ActJjcInfoModel.getInstance(this.ctx, this.id);
                        let actJjcInfo = await actJjcInfoModel.getInfo();
                        if (actJjcInfo.pkNum > cfgPool[key].param) {
                            info.kaiqi[cfgPool[key].id] = 1;
                        }
                        break;
                }
            }
            await this.update(info);
        }
        let guideInit = setting_1.default.getSetting("1", "guideInit");
        if (gameMethod_1.gameMethod.isEmpty(guideInit) == false && gameMethod_1.gameMethod.isEmpty(info.list) == true) {
            info.list = guideInit;
            await this.update(info);
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
     * 宝石重铸
     */
    async doGuide(id) {
        let info = await this.getInfo();
        switch (id) {
            case "10002": //开箱
            case "10004":
            case "10006":
            case "10009":
                let actEquipModel = ActEquipModel_1.ActEquipModel.getInstance(this.ctx, this.id);
                await actEquipModel.openBox95(1);
                await actEquipModel.xuanzhong("1");
                break;
            case "10003": //穿装
            case "10005":
            case "10010":
                let actBoxModel = ActBoxModel_1.ActBoxModel.getInstance(this.ctx, this.id);
                let actBox = await actBoxModel.getInfo();
                let actEquipModel1 = ActEquipModel_1.ActEquipModel.getInstance(this.ctx, this.id);
                await actEquipModel1.zhuangbei("1");
                let actEquip = await actEquipModel1.getInfo();
                if (actEquip.linshi.equipId != "") {
                    if (actBox.mType == 1) {
                        await actEquipModel1.fenjie95("1");
                    }
                    else {
                        await actEquipModel1.chushou95("1");
                    }
                }
                break;
            case "10007": //出售
                let actEquipModel2 = ActEquipModel_1.ActEquipModel.getInstance(this.ctx, this.id);
                await actEquipModel2.chushou95("1");
                break;
            case "10012": //领取主线任务奖励
                let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
                await actTaskMainModel.taskRwd();
                break;
        }
        info.list[id] = this.ctx.state.newTime;
        await this.update(info);
    }
}
exports.ActGuideModel = ActGuideModel;
//# sourceMappingURL=ActGuideModel.js.map