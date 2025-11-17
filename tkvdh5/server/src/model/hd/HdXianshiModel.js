"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HdXianshiModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const gameMethod_1 = require("../../../common/gameMethod");
/**
 * 活动 独立限时礼包
 * hdcid = 1 洞天加一个限时礼包，在他升2级的时候返回主界面时马上弹出来。为4小时限购，礼包入口需显示倒计时。
 */
class HdXianshiModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdXianshi"; //用于存储key 和  输出1级key
        this.outIsAu = true; //下发数据是否用au下发
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
        return this.hdcid; //输出2级key
    }
    //初始化
    init() {
        return {
            hdid: "",
            stime: 0,
            buy: 0 //0未购买，1已购买
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        let cfg = await this.getHdCfg();
        if (cfg != null && cfg.info.id != info.hdid) {
            info = this.init();
            info.hdid = cfg.info.id;
        }
        return info;
    }
    /**
     * 返回数据
     */
    async getOutPut() {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            return null;
        }
        let info = await this.getInfo();
        if (info.stime == 0 || this.ctx.state.newTime > info.stime + cfg.data.cx) {
            return null; //未开启 | 过期
        }
        if (info.buy != 0) {
            return null; //已经购买 
        }
        return {
            info: await this.getOutPut_u("info"),
            data: await this.getOutPut_u("data"),
            red: await this.getOutPut_u("red"),
            outf: await this.getOutPut_u("outf"),
        };
    }
    async getOutPut_u(key) {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            return null;
        }
        let info = await this.getInfo();
        switch (key) {
            case "info":
                let cfgInfo = gameMethod_1.gameMethod.objCopy(cfg[key]);
                if (info.stime == 0) {
                    cfgInfo.sAt = 0;
                    cfgInfo.eAt = 0;
                    cfgInfo.dAt = 0;
                }
                else {
                    cfgInfo.sAt = info.stime;
                    cfgInfo.eAt = info.stime + cfg.data.cx;
                    cfgInfo.dAt = info.stime + cfg.data.cx;
                }
                return cfgInfo;
            case "data":
                return cfg[key];
            case "red":
                return await this.getRed();
            case "outf":
                return {
                    buy: info.buy
                };
        }
        return null;
    }
    /**
     * 获取红点
     */
    async getRed() {
        return 0;
    }
    /**
     * 充值下单检查
     */
    async checkUp() {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            this.ctx.throw("活动未生效");
        }
        let info = await this.getInfo();
        if (info.buy > 0) {
            this.ctx.throw("已购买");
        }
        return {
            type: 1,
            msg: cfg.info.title,
            data: cfg.data.need[1],
            kind10Cs: this.kid + "_" + this.hdcid + "_" + "1" + "_" + cfg.data.need[1]
        };
    }
    /**
     * 充值成功后执行
     */
    async carryOut() {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            return {
                type: 0,
                msg: "充值活动已关闭",
                data: null
            };
        }
        let info = await this.getInfo();
        info.buy = 1;
        info.stime = 1;
        await this.update(info, ['info', 'outf']);
        await this.ctx.state.master.addItem2(cfg.data.items);
        return {
            type: 1,
            msg: "充值成功",
            data: cfg.data.need[1]
        };
    }
    /**
     * 触发洞天礼包
     */
    async chufaHdcid_1() {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            return;
        }
        let info = await this.getInfo();
        if (info.stime != 0) {
            return;
        }
        info.stime = this.ctx.state.newTime;
        info.buy = 0;
        await this.update(info);
    }
}
exports.HdXianshiModel = HdXianshiModel;
//# sourceMappingURL=HdXianshiModel.js.map