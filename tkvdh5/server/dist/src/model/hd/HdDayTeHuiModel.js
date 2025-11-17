"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HdDayTeHuiModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const gameMethod_1 = require("../../../common/gameMethod");
/**
 * 每日特惠礼包
1. 礼包分为免费领和三档付费¥1，¥3，¥6。
2. 免费和付费都是每日限购1次。
3. 礼包内容：礼包价格对应价值灵石+刚需道具+稍微有点价值的道具
4. 可以包周，¥60，直接获得一份较高价值的道具奖励，并且可以连续7天领取所有每日特惠礼包，包周期间每天都被计算为有进行充值，可以获得累天充值计数
 */
/**
 * 每日特惠
 * 每日小额礼包 周打包购买
 */
class HdDayTeHuiModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdDayTeHui"; //用于存储key 和  输出1级key
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
            dayRwd: 0,
            outTime: 0,
            allOutTime: 0,
            dayList: {},
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
            info.dayList = {};
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
        if (info.allOutTime < this.ctx.state.newTime) {
            this.ctx.throw("未购买全额");
        }
        //未领取
        if (info.dayList[id] != null) {
            this.ctx.throw("已经领取" + id);
        }
        //记录购买
        info.dayList[id] = this.ctx.state.newTime;
        await this.update(info, ['outf', 'red']);
        // 给与奖励
        await this.ctx.state.master.addItem2(cfg.data.dayList[id].rwd);
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
        if (info.allOutTime < this.ctx.state.newTime) {
            //未购买全额
            return 0;
        }
        //遍历奖励配置
        for (const id in cfg.data.dayList) {
            if (info.dayList[id] == null) {
                return 1;
            }
        }
        return 0;
    }
    /**
     * 充值下单检查
     */
    async checkUp(id) {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        let info = await this.getInfo();
        if (info.allOutTime > this.ctx.state.newTime) {
            this.ctx.throw("已购买全额");
        }
        if (gameMethod_1.gameMethod.isEmpty(id)) {
            //购买全额
            return {
                type: 1,
                msg: cfg.data.allTitle,
                data: cfg.data.allNeed[1],
            };
        }
        else {
            //购买单档次
            if (cfg.data.dayList[id] == null) {
                this.ctx.throw(`id_null:${id}`);
            }
            //本档次 今天是否已被购买
            if (info.dayList[id] != null) {
                this.ctx.throw(`今日已购买`);
            }
            //购买单档
            return {
                type: 1,
                msg: cfg.data.dayList[id].title,
                data: cfg.data.dayList[id].need[1],
                kind10Cs: this.kid + "_" + this.hdcid + "_" + id + "_" + cfg.data.dayList[id].need[1]
            };
        }
    }
    /**
     * 充值成功后执行
     */
    async carryOut(id) {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        let info = await this.getInfo();
        //再次购买 不可购买
        if (info.allOutTime > this.ctx.state.newTime) {
            this.ctx.throw("已购买全额");
        }
        let jiner = 0;
        if (gameMethod_1.gameMethod.isEmpty(id)) {
            //设置全买时间
            info.allOutTime = this.ctx.state.new0 + 86400 * (cfg.data.allDays + 1);
            // 给与奖励
            await this.ctx.state.master.addItem2(cfg.data.allRwd);
            jiner = cfg.data.allNeed[1];
        }
        else {
            //购买单档次
            if (cfg.data.dayList[id] == null) {
                this.ctx.throw(`id_null:${id}`);
            }
            //本档次 今天是否已被购买
            if (info.dayList[id] != null) {
                this.ctx.throw(`今日已购买`);
            }
            //记录购买
            info.dayList[id] = this.ctx.state.newTime;
            // 给与奖励
            await this.ctx.state.master.addItem2(cfg.data.dayList[id].rwd);
            jiner = cfg.data.dayList[id].need[1];
        }
        await this.update(info, ['outf', 'red']);
        return {
            type: 1,
            msg: "充值成功",
            data: jiner,
        };
    }
}
exports.HdDayTeHuiModel = HdDayTeHuiModel;
let cfg = {
    //每日奖励
    dayRwd: [[1, 1, 1]],
    allNeed: [10, 6],
    allDays: 7,
    allRwd: [[1, 1, 1]],
    allTitle: '连购X天',
    dayList: {
        '1': {
            title: '小礼包',
            need: [10, 6],
            rwd: [[1, 1, 1]],
        },
        '2': {
            title: '小2礼包',
            need: [10, 128],
            rwd: [[1, 1, 1]],
        },
        '3': {
            title: '小3礼包',
            need: [10, 256],
            rwd: [[1, 1, 1]],
        },
    },
};
//# sourceMappingURL=HdDayTeHuiModel.js.map