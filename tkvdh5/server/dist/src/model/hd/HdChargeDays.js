"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HdChargeDaysModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const setting_1 = __importDefault(require("../../crontab/setting"));
/**
 * 累计天数充值礼包
 */
class HdChargeDaysModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdChargeDays"; //用于存储key 和  输出1级key
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
    //钩子 整合代码
    static async hook(ctx, uuid, count) {
        let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
        //活动 - 累计天数充值礼包
        let cfgHdChargeDays = setting_1.default.getHuodong2(heid, "hdChargeDays");
        if (cfgHdChargeDays != null) {
            for (const hdcid in cfgHdChargeDays) {
                let hdChargeDaysModel = HdChargeDaysModel.getInstance(ctx, uuid, hdcid);
                await hdChargeDaysModel.addHook(count);
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
            //累计充值天数 计算需要的字段
            score: 0,
            todayTotol: 0,
            todayAdd: 0,
            //轮次
            lun: 0,
            //已领取 档次
            rwd: {},
            //每日重置
            outTime: 0,
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
        //每日重置
        if (this.ctx.state.newTime > info.outTime) {
            info.outTime = this.ctx.state.new0 + 86400;
            //每日白嫖
            info.dayRwd = 0;
            //统计今日充值
            info.todayTotol = 0;
            info.todayAdd = 0;
            //判断是不是过轮了
            let lunOver = true; // 本轮已完成
            for (const id in cfg.data.list) {
                if (info.rwd[id] == null) {
                    //本轮未完成
                    lunOver = false;
                    break;
                }
            }
            //过轮操作
            if (lunOver) {
                info.score = 0; //清空累计天数
                info.rwd = {}; //清空领奖记录
                info.lun += 1;
            }
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
     * 接收任务统计
     */
    async addHook(count) {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            return null;
        }
        let info = await this.getInfo();
        // let actTaskMainModel = ActTaskMainModel.getInstance(this.ctx,this.id)
        // if (info.score <= 0 && await actTaskMainModel.kaiqi("3301") < 1){
        //     return
        // }
        info.todayTotol += count;
        //达到每日充值要求
        if (info.todayAdd <= 0 && info.todayTotol >= cfg.data.dayNeed) {
            info.score += 1; //天数+
            info.todayAdd = this.ctx.state.newTime;
        }
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
        if (info.lun > 0) {
            //添加道具
            await this.ctx.state.master.addItem2(cfg.data.list[id].rwd1);
        }
        else {
            //添加道具
            await this.ctx.state.master.addItem2(cfg.data.list[id].rwd);
        }
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
exports.HdChargeDaysModel = HdChargeDaysModel;
/*
let cfg: Xys.HdChargeDaysData = {
    dayRwd: [[1, 1, 1]], //每日白嫖
    //活动配置
    dayNeed: 6, //每日需要充值多少钱(6元)
    //一轮内 档次奖励
    list: {
        "1": {
            need: 1,
            rwd: [[1, 1, 1]],
        },
        "2": {
            need: 1,
            rwd: [[1, 1, 1]],
        },
        "3": {
            need: 1,
            rwd: [[1, 1, 1]],
        },
    },
};
*/
//# sourceMappingURL=HdChargeDays.js.map