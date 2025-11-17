"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActTaskMainModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const ActTaskKindModel_1 = require("./ActTaskKindModel");
const ActChiBangModel_1 = require("./ActChiBangModel");
const ActClubModel_1 = require("./ActClubModel");
const ActGuideModel_1 = require("./ActGuideModel");
const HdNewJiYuanModel_1 = require("../hd/HdNewJiYuanModel");
const HdChongBangModel_1 = require("../hd/HdChongBangModel");
const HdTimeBenModel_1 = require("../hd/HdTimeBenModel");
/**
 *主线任务 信息
 */
class ActTaskMainModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actTaskMain"; //用于存储key 和  输出1级key
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
            cons: 0 //当前完成进度
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
     * 接收任务统计
     */
    async addHook(kind, count) {
        let info = await this.getInfo();
        let cfg = gameCfg_1.default.taskMain.getItem(info.id.toString());
        if (cfg == null) {
            return; //满级
        }
        let cfg_kind = cfg.kind;
        if (cfg_kind != kind) {
            return;
        }
        info.cons += count;
        await this.update(info);
    }
    /**
     * 登陆刷新任务进度
     */
    async LoginrefreshHook() {
        let info = await this.getInfo();
        let cfg = gameCfg_1.default.taskMain.getItem(info.id.toString());
        if (cfg == null) {
            return; //满级
        }
        let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(this.ctx, this.id);
        let actTaskKind = await actTaskKindModel.getInfo();
        if (actTaskKind.nids[cfg.kind] != null) {
            info.cons = actTaskKind.nids[cfg.kind];
            await this.update(info);
        }
    }
    /**
     * 重置任务进度
     */
    async refreshHook(kind, count) {
        let info = await this.getInfo();
        let cfg = gameCfg_1.default.taskMain.getItem(info.id.toString());
        if (cfg == null) {
            return; //满级
        }
        if (kind != cfg.kind) {
            return;
        }
        info.cons = count;
        await this.update(info);
    }
    /**
     * 完成任务领取奖励
     */
    async taskRwd() {
        let info = await this.getInfo();
        let cfg = gameCfg_1.default.taskMain.getItem(info.id.toString());
        if (cfg == null) {
            return; //满级
        }
        if (cfg.need > info.cons) {
            this.ctx.throw("任务未完成");
        }
        await this.ctx.state.master.addItem1(cfg.item);
        info.id += 1;
        info.cons = 0;
        let cfgNext = gameCfg_1.default.taskMain.getItem(info.id.toString());
        if (cfgNext != null) {
            let type = gameCfg_1.default.taskDesc.getItemCtx(this.ctx, cfgNext.kind).type;
            if (type == 0) { //注册累计
                let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(this.ctx, this.id);
                let actTaskKind = await actTaskKindModel.getInfo();
                if (actTaskKind.nids[cfgNext.kind] != null) {
                    info.cons = actTaskKind.nids[cfgNext.kind];
                }
            }
        }
        await this.update(info);
        //解锁翅膀
        let actChiBangModel = ActChiBangModel_1.ActChiBangModel.getInstance(this.ctx, this.id);
        await actChiBangModel.unLock();
        //累计充值礼包 启动
        // if (await this.kaiqi('3303') > 0){
        //     await HdChargeTotalModel.start(this.ctx, this.id)
        // }
        if (await this.kaiqi('5400') > 0) {
            await HdTimeBenModel_1.HdTimeBenModel.start(this.ctx, this.id);
        }
        if (await this.kaiqi('4009', 0) > 0) {
            await HdNewJiYuanModel_1.HdNewJiYuanModel.start(this.ctx, this.id);
        }
        if (await this.kaiqi('4010', 0) > 0) {
            //pve 冲榜
            let hdChongBangModel = HdChongBangModel_1.HdChongBangModel.getInstance(this.ctx, this.id, "1");
            await hdChongBangModel.isOpenHd();
        }
        await this.clickKind191();
    }
    /**
     * 开启条件统一处理
     * old 是否兼容旧版
     */
    async kaiqi(xlsId, old = 1) {
        if (old == 1) {
            let actGuideModel = ActGuideModel_1.ActGuideModel.getInstance(this.ctx, this.id);
            let actGuide = await actGuideModel.getInfo();
            if (actGuide.kaiqi[xlsId] != null && actGuide.kaiqi[xlsId] == 1) {
                return 1;
            }
        }
        let cfgKq = gameCfg_1.default.kaiqiInfo.getItem(xlsId);
        if (cfgKq == null) {
            return 0;
        }
        switch (cfgKq.type1) {
            case 0:
                break;
            case 4:
                let info = await this.getInfo();
                if (info.id > cfgKq.param1) {
                    return 1;
                }
                break;
            default:
                this.ctx.throw("未处理" + cfgKq.type1);
        }
        return 0;
    }
    /**
     * 检测   加入或创建仙盟
     */
    async clickKind191() {
        let info = await this.getInfo();
        let cfg = gameCfg_1.default.taskMain.getItem(info.id.toString());
        if (cfg == null || cfg.kind != "191" || info.cons > 0) {
            return;
        }
        let actClubModel = ActClubModel_1.ActClubModel.getInstance(this.ctx, this.id);
        if (await actClubModel.getClubId() != "") {
            info.cons = 1;
        }
        await this.update(info);
    }
}
exports.ActTaskMainModel = ActTaskMainModel;
//# sourceMappingURL=ActTaskMainModel.js.map