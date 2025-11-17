"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HdLunHuiModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const setting_1 = __importDefault(require("../../crontab/setting"));
/**
 * 天道轮回
 * 累计道具消耗
 */
class HdLunHuiModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdLunHui"; //用于存储key 和  输出1级key
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
    static async clickSubItem(ctx, uuid, item) {
        let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
        //活动 - 破除心魔
        let cfgHdLunHui = setting_1.default.getHuodong2(heid, "hdLunHui");
        if (cfgHdLunHui != null) {
            for (const hdcid in cfgHdLunHui) {
                let hdLunHuiModel = HdLunHuiModel.getInstance(ctx, uuid, hdcid);
                await hdLunHuiModel.clickSubItem(item);
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
            rwd: {},
            score: 0,
            gift: {},
            hs: {},
            dayRwd: 0,
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
     * 道具消耗钩子
     */
    async clickSubItem(item) {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            //this.ctx.throw("活动未开启");
            return;
        }
        if (cfg.data.needItem[0] != item[0] || cfg.data.needItem[1] != item[1]) {
            //非我关心的道具
            return;
        }
        let info = await this.getInfo();
        info.score += item[2];
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
        //每日领取
        if (cfg.data.dayRwd.length > 0 && info.dayRwd <= 0) {
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
    /**
     * 充值下单检查
     */
    async checkUp(id) {
        //遍历查找 自己是不是用了
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        if (cfg.data.gift == null) {
            this.ctx.throw("礼包开放");
            return {
                type: 0,
                msg: "",
                data: "",
            };
        }
        if (cfg.data.gift[id] == null) {
            this.ctx.throw(`id_null:${id}`);
        }
        if (cfg.data.gift[id].need[0] != 10) {
            this.ctx.throw("参数错误");
        }
        let info = await this.getInfo();
        //总限购
        if (info.gift[id] == null && //没买过
            cfg.data.gift[id].limit > 0 && //有限购
            info.gift[id] >= cfg.data.gift[id].limit //限购达到
        ) {
            this.ctx.throw("购买上限");
        }
        return {
            type: 1,
            msg: cfg.data.gift[id].title,
            data: cfg.data.gift[id].need[1],
            kind10Cs: this.kid + "_" + this.hdcid + "_" + id + "_" + cfg.data.gift[id].need[1]
        };
    }
    /**
     * 充值成功后执行
     */
    async carryOut(id) {
        //遍历查找 自己是不是用了
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            return {
                type: 0,
                msg: "活动未生效",
                data: null,
            };
        }
        if (cfg.data.gift == null) {
            this.ctx.throw("礼包开放");
            return {
                type: 0,
                msg: "",
                data: "",
            };
        }
        if (cfg.data.gift[id] == null) {
            return {
                type: 0,
                msg: `id_null:${id}`,
                data: null,
            };
        }
        if (cfg.data.gift[id].need[0] != 10) {
            return {
                type: 0,
                msg: `参数错误`,
                data: null,
            };
        }
        let info = await this.getInfo();
        if (info.gift[id] == null) {
            info.gift[id] = 0;
        }
        if (cfg.data.gift[id].limit > 0 && //有限购
            info.gift[id] >= cfg.data.gift[id].limit //限购达到
        ) {
            return {
                type: 0,
                msg: `购买上限`,
                data: null,
            };
        }
        //礼包购买次数累计
        info.gift[id] += 1;
        await this.update(info, ["outf", "red"]);
        //加上礼包奖励
        await this.ctx.state.master.addItem2(cfg.data.gift[id].rwd);
        return {
            type: 1,
            msg: "充值成功",
            data: cfg.data.gift[id].need[1],
        };
    }
    /**
     * 黑市礼包购买
     */
    async hsBuy(id) {
        //遍历查找 自己是不是用了
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        if (cfg.data.hs == null) {
            this.ctx.throw("黑市未开放");
            return {
                type: 0,
                msg: "",
                data: "",
            };
        }
        if (cfg.data.hs[id] == null) {
            this.ctx.throw(`id_null:${id}`);
        }
        let info = await this.getInfo();
        if (info.hs[id] == null) {
            info.hs[id] = 0;
        }
        if (cfg.data.hs[id].limit > 0 && //有限购
            info.hs[id] >= cfg.data.hs[id].limit //限购达到
        ) {
            this.ctx.throw(`购买上限`);
        }
        //礼包购买次数累计
        info.hs[id] += 1;
        await this.update(info, ["outf", "red"]);
        //扣除需求
        await this.ctx.state.master.subItem1(cfg.data.hs[id].need);
        //加上礼包奖励
        await this.ctx.state.master.addItem2(cfg.data.hs[id].rwd);
    }
}
exports.HdLunHuiModel = HdLunHuiModel;
// let cfg: Xys.HdLunHuiData = {
//     dayRwd: [[1, 1, 1]], //每日奖励
//     needItem: [1, 1, 1], //需求消耗道具
//     //任务(每日重置)
//     list: {
//         "1": {
//             lun: 1, //第X轮
//             lunBase: 0, //本轮基数(上一轮最后一档)
//             need: 100, //需求消耗
//             rwd: [[1, 918, 1]], //奖励
//         },
//         "2": {
//             lun: 1, //第X轮
//             lunBase: 0, //本轮基数(上一轮最后一档)
//             need: 200, //需求消耗
//             rwd: [[1, 918, 1]], //奖励
//         },
//         "3": {
//             lun: 1, //第X轮
//             lunBase: 0, //本轮基数(上一轮最后一档)
//             need: 300, //需求消耗
//             rwd: [[1, 918, 1]], //奖励
//         },
//         "4": {
//             lun: 2, //第X轮
//             lunBase: 300, //本轮基数(上一轮最后一档)
//             need: 400, //需求消耗
//             rwd: [[1, 918, 1]], //奖励
//         },
//         "5": {
//             lun: 2, //第X轮
//             lunBase: 300, //本轮基数(上一轮最后一档)
//             need: 500, //需求消耗
//             rwd: [[1, 918, 1]], //奖励
//         },
//         "6": {
//             lun: 2, //第X轮
//             lunBase: 300, //本轮基数(上一轮最后一档)
//             need: 600, //需求消耗
//             rwd: [[1, 918, 1]], //奖励
//         },
//         "7": {
//             lun: 3, //第X轮
//             lunBase: 600, //本轮基数(上一轮最后一档)
//             need: 700, //需求消耗
//             rwd: [[1, 918, 1]], //奖励
//         },
//         "8": {
//             lun: 3, //第X轮
//             lunBase: 600, //本轮基数(上一轮最后一档)
//             need: 800, //需求消耗
//             rwd: [[1, 918, 1]], //奖励
//         },
//         "9": {
//             lun: 3, //第X轮
//             lunBase: 600, //本轮基数(上一轮最后一档)
//             need: 900, //需求消耗
//             rwd: [[1, 918, 1]], //奖励
//         },
//     },
//     //礼包购买
//     gift: {
//         "1": {
//             title: "XX福利",
//             need: [10, 12],
//             rwd: [
//                 [1, 1, 10],
//                 [1, 902, 12],
//             ],
//             limit: 0,
//         },
//         "2": {
//             title: "挑战礼包",
//             need: [10, 12],
//             rwd: [
//                 [1, 1, 120],
//                 [1, 902, 60],
//                 [1, 59, 4],
//                 [1, 918, 1],
//             ],
//             limit: 2,
//         },
//         "3": {
//             title: "挑战礼包",
//             need: [10, 30],
//             rwd: [
//                 [1, 1, 300],
//                 [1, 902, 120],
//                 [1, 59, 8],
//             ],
//             limit: 2,
//         },
//         "4": {
//             title: "挑战礼包",
//             need: [10, 68],
//             rwd: [
//                 [1, 1, 680],
//                 [1, 52, 20],
//                 [1, 59, 12],
//             ],
//             limit: 5,
//         },
//         "5": {
//             title: "挑战礼包",
//             need: [10, 128],
//             rwd: [
//                 [1, 1, 1280],
//                 [1, 62, 5400],
//                 [1, 59, 16],
//                 [1, 918, 1],
//             ],
//             limit: 5,
//         },
//         "6": {
//             title: "挑战礼包",
//             need: [10, 198],
//             rwd: [
//                 [1, 1, 1980],
//                 [1, 52, 58],
//                 [1, 59, 20],
//                 [1, 918, 1],
//             ],
//             limit: 5,
//         },
//         "7": {
//             title: "挑战礼包",
//             need: [10, 198],
//             rwd: [
//                 [1, 1, 1980],
//                 [1, 55, 3500],
//                 [1, 59, 24],
//                 [1, 918, 1],
//             ],
//             limit: 5,
//         },
//         "8": {
//             title: "挑战礼包",
//             need: [10, 198],
//             rwd: [
//                 [1, 1, 1980],
//                 [1, 60, 2900],
//                 [1, 59, 28],
//                 [1, 918, 1],
//             ],
//             limit: 5,
//         },
//         "9": {
//             title: "挑战礼包",
//             need: [10, 328],
//             rwd: [
//                 [1, 1, 3280],
//                 [1, 54, 20],
//                 [1, 55, 6400],
//                 [1, 918, 1],
//             ],
//             limit: 5,
//         },
//         "10": {
//             title: "挑战礼包",
//             need: [10, 648],
//             rwd: [
//                 [1, 1, 6480],
//                 [1, 52, 78],
//                 [1, 53, 10],
//                 [1, 918, 2],
//             ],
//             limit: 5,
//         },
//     },
//     //黑市
//     hs: {
//         "1": {
//             title: "XX福利",
//             need: [1, 1, 1],
//             rwd: [
//                 [1, 1, 10],
//                 [1, 902, 12],
//             ],
//             limit: 0,
//         },
//         "2": {
//             title: "挑战礼包",
//             need: [1, 1, 1],
//             rwd: [
//                 [1, 1, 120],
//                 [1, 902, 60],
//                 [1, 59, 4],
//                 [1, 918, 1],
//             ],
//             limit: 2,
//         },
//         "3": {
//             title: "挑战礼包",
//             need: [1, 1, 1],
//             rwd: [
//                 [1, 1, 300],
//                 [1, 902, 120],
//                 [1, 59, 8],
//             ],
//             limit: 2,
//         },
//         "4": {
//             title: "挑战礼包",
//             need: [1, 1, 1],
//             rwd: [
//                 [1, 1, 680],
//                 [1, 52, 20],
//                 [1, 59, 12],
//             ],
//             limit: 5,
//         },
//         "5": {
//             title: "挑战礼包",
//             need: [1, 1, 1],
//             rwd: [
//                 [1, 1, 1280],
//                 [1, 62, 5400],
//                 [1, 59, 16],
//                 [1, 918, 1],
//             ],
//             limit: 5,
//         },
//     },
// };
//# sourceMappingURL=HdLunHuiModel.js.map