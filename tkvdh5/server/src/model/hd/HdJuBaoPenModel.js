"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HdJuBaoPenModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const gameMethod_1 = require("../../../common/gameMethod");
const setting_1 = __importDefault(require("../../crontab/setting"));
/**
 * 活动 聚宝盆
 */
class HdJuBaoPenModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdJuBaoPen"; //用于存储key 和  输出1级key
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
    //加道具
    static async addHook(ctx, uuid) {
        let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
        let cfgHdJuBaoPen = setting_1.default.getHuodong2(heid, "hdJuBaoPen");
        if (cfgHdJuBaoPen != null) {
            for (const hdcid in cfgHdJuBaoPen) {
                let hdJuBaoPenModel = HdJuBaoPenModel.getInstance(ctx, uuid, hdcid);
                await hdJuBaoPenModel.addHook();
            }
        }
    }
    outKey2() {
        return this.hdcid; //输出2级key
    }
    //初始化
    init() {
        return {
            hdid: "",
            tong: {
                cons: 0,
                rwd: 0,
            },
            yin: {
                cons: 0,
                rwd: 0,
            },
            jin: {
                cons: 0,
                rwd: 0,
            }
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        let cfg = await this.getHdCfg();
        if (cfg != null && cfg.info.id != info.hdid) {
            info = this.init();
            info.hdid = cfg.info.id;
            info.tong.cons = cfg.data.tong.init;
            info.yin.cons = cfg.data.yin.init;
            info.jin.cons = cfg.data.jin.init;
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
        if (info.jin.rwd > 0) {
            return null;
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
                if (info.jin.rwd > 0) {
                    cfgInfo.eAt = this.ctx.state.newTime - 1;
                    cfgInfo.dAt = this.ctx.state.newTime - 1;
                }
                return cfgInfo;
            case "data":
                return cfg[key];
            case "red":
                return await this.getRed();
            case "outf":
                return info;
        }
        return null;
    }
    /**
     * 获取红点
     */
    async getRed() {
        let cfg = await this.getHdCfg();
        let info = await this.getInfo();
        if (info.tong.rwd == 0 && info.tong.cons >= cfg.data.tong.fanwei[1]) {
            return 1;
        }
        return 0;
    }
    /**
     * 掠夺触发
     */
    async addHook() {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            return;
        }
        let info = await this.getInfo();
        if (info.tong.rwd == 0) {
            info.tong.cons += cfg.data.tong.add;
            info.tong.cons = Math.min(info.tong.cons, cfg.data.tong.fanwei[1]);
        }
        else if (info.yin.rwd == 0) {
            info.yin.cons += cfg.data.yin.add;
            info.yin.cons = Math.min(info.yin.cons, cfg.data.yin.fanwei[1]);
        }
        else if (info.jin.rwd == 0) {
            info.jin.cons += cfg.data.jin.add;
            info.jin.cons = Math.min(info.jin.cons, cfg.data.jin.fanwei[1]);
        }
        else {
            return;
        }
        await this.update(info, ['outf', 'red']);
    }
    /**
     * 领取铜奖励
     */
    async tongRwd() {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            this.ctx.throw("活动已经结束");
            return;
        }
        let info = await this.getInfo();
        if (info.tong.cons < cfg.data.tong.fanwei[0]) {
            this.ctx.throw("未达到领取条件");
        }
        if (info.tong.rwd > 0) {
            this.ctx.throw("已经领取");
        }
        info.tong.rwd = this.ctx.state.newTime;
        await this.update(info, ['outf', 'red']);
        await this.ctx.state.master.addItem1([1, 1, info.tong.cons]);
    }
    /**
     * 充值下单检查
     */
    async checkUp(type) {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            this.ctx.throw("活动已经结束");
            return {
                type: 0,
                msg: "",
                data: ""
            };
        }
        if (cfg.data.yin.need[0] != 10) {
            this.ctx.throw("不是充值档次");
        }
        let info = await this.getInfo();
        let jiner = 0;
        if (type == "yin") {
            if (info.tong.rwd <= 0) {
                this.ctx.throw("未解锁");
            }
            if (info.yin.rwd > 0) {
                this.ctx.throw("已经领取");
            }
            if (info.yin.cons < cfg.data.yin.fanwei[0]) {
                this.ctx.throw("未达到领取条件");
            }
            jiner = cfg.data.yin.need[1];
        }
        else if (type == "jin") {
            if (info.yin.rwd <= 0) {
                this.ctx.throw("未解锁");
            }
            if (info.jin.rwd > 0) {
                this.ctx.throw("已经领取");
            }
            if (info.jin.cons < cfg.data.jin.fanwei[0]) {
                this.ctx.throw("未达到领取条件");
            }
            jiner = cfg.data.jin.need[1];
        }
        else {
            this.ctx.throw("参数错误");
        }
        return {
            type: 1,
            msg: cfg.info.title + "-" + type,
            data: jiner,
            kind10Cs: this.kid + "_" + this.hdcid + "_" + type + "_" + jiner
        };
    }
    /**
     * 充值成功后执行
     */
    async carryOut(type) {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            return {
                type: 0,
                msg: "活动已关闭",
                data: null
            };
        }
        let info = await this.getInfo();
        let jiner = 0;
        if (type == "yin") {
            info.yin.rwd = this.ctx.state.newTime;
            await this.update(info, ['outf', 'red']);
            await this.ctx.state.master.addItem1([1, 1, info.yin.cons]);
            jiner = cfg.data.yin.need[1];
        }
        else if (type == "jin") {
            info.jin.rwd = this.ctx.state.newTime;
            await this.update(info, ['info', 'red', 'outf']);
            await this.ctx.state.master.addItem1([1, 1, info.jin.cons]);
            jiner = cfg.data.jin.need[1];
        }
        return {
            type: 1,
            msg: "充值成功",
            data: jiner
        };
    }
}
exports.HdJuBaoPenModel = HdJuBaoPenModel;
//# sourceMappingURL=HdJuBaoPenModel.js.map