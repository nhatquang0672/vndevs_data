"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HdChargeTotalModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const setting_1 = __importDefault(require("../../crontab/setting"));
const ActTaskMainModel_1 = require("../act/ActTaskMainModel");
const UserModel_1 = require("../user/UserModel");
/**
 * 累计充值礼包
 */
class HdChargeTotalModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdChargeTotal"; //用于存储key 和  输出1级key
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
    //启动钩子 整合代码
    static async start(ctx, uuid) {
        let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
        //活动 - 累计天数充值礼包
        let cfgHdChargeTotal = setting_1.default.getHuodong2(heid, "hdChargeTotal");
        if (cfgHdChargeTotal != null) {
            for (const hdcid in cfgHdChargeTotal) {
                let hdChargeTotalModel = HdChargeTotalModel.getInstance(ctx, uuid, hdcid);
                await hdChargeTotalModel.start();
            }
        }
    }
    //充值钩子 整合代码
    static async hook(ctx, uuid, count) {
        let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
        //活动 - 累计天数充值礼包
        let cfgHdChargeTotal = setting_1.default.getHuodong2(heid, "hdChargeTotal");
        if (cfgHdChargeTotal != null) {
            for (const hdcid in cfgHdChargeTotal) {
                let hdChargeTotalModel = HdChargeTotalModel.getInstance(ctx, uuid, hdcid);
                await hdChargeTotalModel.addHook(count);
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
            dayRwd: 0,
            //已领取 档次
            rwd: {},
            score: 0,
            endTime: 0,
            //每日重置
            outTime: 0,
            bugVer: 1
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        let cfg = (await this.getHdCfg());
        if (cfg != null && cfg.info.id != info.hdid) {
            info = this.init();
            //活动重置ID
            info.hdid = cfg.info.id;
        }
        //未启动 尝试启动
        if (info.endTime <= 0) {
            let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
            if (await actTaskMainModel.kaiqi("3300") > 0) {
                let userModel = UserModel_1.UserModel.getInstance(this.ctx, this.id);
                let userInfo = await userModel.getInfo();
                info.score = userInfo.iscz;
                //启动
                info.endTime = this.ctx.state.newTime + cfg.data.hdHours * 3600;
                await this.update(info, ["outf", "red"]);
            }
        }
        else {
            if (info.bugVer != 1) {
                info.bugVer = 1;
                let userModel = UserModel_1.UserModel.getInstance(this.ctx, this.id);
                let userInfo = await userModel.getInfo();
                info.score = userInfo.iscz;
                await this.update(info, ["outf", "red"]);
            }
        }
        //每日重置
        if (this.ctx.state.newTime > info.outTime) {
            info.outTime = this.ctx.state.new0 + 86400;
            //每日白嫖
            info.dayRwd = 0;
            await this.update(info, ["outf", "red"]);
        }
        return info;
    }
    /**
     * 返回数据
     */
    async getOutPut() {
        return {
            info: await this.getOutPut_u("info"),
            data: await this.getOutPut_u("data"),
            red: await this.getOutPut_u("red"),
            outf: await this.getOutPut_u("outf"),
        };
    }
    async getOutPut_u(key) {
        let cfg = (await this.getHdCfg());
        if (cfg == null) {
            return null;
        }
        let info = await this.getInfo();
        switch (key) {
            case "info":
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
     * 启动活动
     */
    async start() {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            return null;
        }
        let info = await this.getInfo();
        //是否已经启动
        if (info.endTime > 0) {
            //报错 已经启动
            return;
        }
        //设置结束时间
        info.endTime = this.ctx.state.newTime + cfg.data.hdHours * 3600;
        let fuserModel = UserModel_1.UserModel.getInstance(this.ctx, this.id);
        let fuser = await fuserModel.getInfo();
        info.score = fuser.iscz;
        await this.update(info, ["outf", "red"]);
    }
    /**
     * 道具消耗钩子
     */
    async addHook(count) {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            return null;
        }
        let info = await this.getInfo();
        if (info.endTime < this.ctx.state.newTime) {
            //活动已结束
            return;
        }
        info.score += count;
        await this.update(info, ["outf", "red"]);
    }
    /**
     * 每日白嫖奖励
     */
    async dailyRwd() {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        let info = await this.getInfo();
        if (info.endTime < this.ctx.state.newTime) {
            this.ctx.throw("活动已结束");
        }
        //已领取
        if (info.dayRwd > 0) {
            this.ctx.throw("已经领取");
        }
        //记录领奖
        info.dayRwd = this.ctx.state.newTime;
        await this.update(info, ["outf", "red"]);
        //给与奖励
        await this.ctx.state.master.addItem2(cfg.data.dayRwd);
    }
    /**
     * 领奖
     * @param id
     */
    async rwd(id) {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        let info = await this.getInfo();
        if (info.endTime < this.ctx.state.newTime) {
            this.ctx.throw("活动已结束");
        }
        //已领取
        if (info.rwd[id] != null) {
            this.ctx.throw("已经领取" + id);
        }
        //未达成
        if (info.score < cfg.data.list[id].need) {
            this.ctx.throw("任务未完成");
        }
        //记录领奖
        info.rwd[id] = this.ctx.state.newTime;
        await this.update(info, ["outf", "red"]);
        //给与奖励
        //添加道具
        await this.ctx.state.master.addItem2(cfg.data.list[id].rwd);
    }
    /**
     * 获取红点
     */
    async getRed() {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            return 0;
        }
        let info = await this.getInfo();
        if (info.endTime < this.ctx.state.newTime) {
            return 0;
        }
        //每日领取
        if (info.dayRwd <= 0) {
            return 1;
        }
        //档次领取
        for (const id in cfg.data.list) {
            //未领取 + 已达成
            if (info.rwd[id] == null && cfg.data.list[id].need <= info.score) {
                return 1;
            }
        }
        return 0;
    }
}
exports.HdChargeTotalModel = HdChargeTotalModel;
/*
let cfg: Xys.HdChargeTotalData =
    {
        dayRwd: [[1,1,1]],//每日白嫖
        hdHours: 72, //持续时间 小时
        //奖励档次
        list: {
            '1':{
                need:1,
                rwd:[[1,1,1]],
            },
            '2':{
                need:50,
                rwd:[[1,1,1]],
            },
            '3':{
                need:100,
                rwd:[[1,1,1]],
            },
        }
    };
    */
//# sourceMappingURL=HdChargeTotal.js.map