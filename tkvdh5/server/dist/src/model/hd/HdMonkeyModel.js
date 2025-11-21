"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HdMonkeyModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const setting_1 = __importDefault(require("../../crontab/setting"));
const ActTaskMainModel_1 = require("../act/ActTaskMainModel");
const game_1 = __importDefault(require("../../util/game"));
/**
 * 合服活动 （魔种降生）
 */
class HdMonkeyModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdMonkey"; //用于存储key 和  输出1级key
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
            time: this.ctx.state.newTime,
            //礼包
            gifts: {},
            // //幸运日志
            // luckyLogs: [],
            //玩家总抽取次数
            drawNum: 0,
            //玩家当前幸运值
            lucky: 0,
            //玩家选择的大奖
            selected: "",
            //皮肤池-限量
            // pool2: {
            //     limitItems: {
            //         1: { limit: 0 },
            //         2: { limit: 0 },
            //         3: { limit: 0 },
            //     },
            //     allItems: [],
            // },
            hook: {},
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        let cfg = (await this.getHdCfg());
        if (cfg != null && cfg.info.id != info.hdid) {
            info = this.init();
            info.hdid = cfg.info.id;
        }
        if (info.time < this.ctx.state.new0) {
            info.time = this.ctx.state.newTime;
            // info.task = {}
            // info.taskKind = {}
            info.gifts = {};
        }
        //初始化皮肤池
        // if (info.pool2.allItems.length == 0) {
        //     info.pool2.allItems = cfg.data.pool2.allItems;
        // }
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
                return cfg[key];
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
        let cfg = (await this.getHdCfg());
        if (cfg == null) {
            return 0;
        }
        let info = await this.getInfo();
        //code
        //每日礼包红点
        if (cfg.data.gifts["1"] != null && cfg.data.gifts["1"].need.length == 0 && info.gifts["1"] == null) {
            return 1;
        }
        return 0;
    }
    /**
     * 辅助方法：检查活动状态和获取信息
     *
     * @returns 存储数据和活动配置数据
     */
    async checkActivityAndGetInfo() {
        const cfg = (await this.getHdCfg());
        const info = await this.getInfo();
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("HdMonkeyModel 活动已结束");
        }
        return { info, cfg };
    }
    /**
     * 魔种之心-限时特惠抽奖
     */
    /*     【魔种之心】
    1. 在合服抽奖活动中，玩家需要先选择大奖，而后可以消耗道具开始抽奖，可以单抽或者十连。大奖初始可
       选4个，当抽奖次数达标以后，可以开启新的可选大奖选项。
    2. 合服抽奖中，每次抽奖会积攒1点幸运值，当幸运值满50以后，下次抽奖必得大奖。
    3. 合服抽奖时可以获取道具奖励，道具奖励包括游戏常规道具、限量外观抽奖道具、外观兑换道具等内容。 */
    /**
     * 选择大奖
     * @param index 大奖的索引
     */
    async selectPrize(index) {
        // 调用辅助方法
        const { info } = await this.checkActivityAndGetInfo();
        info.selected = index;
        await this.update(info, ["red", "outf"]);
    }
    /**
     * 抽大奖
     * @param num 抽数
     */
    async prizeDraw(num) {
        // 调用辅助方法
        const { info, cfg } = await this.checkActivityAndGetInfo();
        if (info.selected == "") {
            this.ctx.throw("请先选择大奖");
        }
        await this.ctx.state.master.subItem1([cfg.data.prizedraw[0], cfg.data.prizedraw[1], cfg.data.prizedraw[2] * num]);
        let items = [];
        for (let index = 0; index < num; index++) {
            info.lucky += 1;
            info.drawNum += 1;
            //幸运值满 下一次必获得大奖
            if (info.lucky > cfg.data.maxLucky) {
                items.push(cfg.data.pool1.prizes[info.selected].item);
                info.lucky = info.drawNum % cfg.data.maxLucky;
                continue;
            }
            //抽中大奖
            if (game_1.default.rand(1, 10000) <= cfg.data.pool1.prizeProb) {
                items.push(cfg.data.pool1.prizes[info.selected].item);
                continue;
            }
            //普通奖励
            let _item = game_1.default.getProbByItems(cfg.data.pool1.items, 0, 3);
            if (_item == null) {
                this.ctx.throw("获取普通奖励失败");
            }
            items.push(_item);
        }
        await this.update(info, ["red", "outf"]);
        await this.ctx.state.master.addItem2(items);
    }
    // /**
    //  * 抽皮肤
    //  *
    //  * @param num 抽数
    //  *
    //  */
    // //奖池里有三个奖品和其他若干普通奖品，这三个奖品都有数量限制，当其中一个奖品达到数量限制时，抽奖不再获得这个奖品
    // async skinDraw(num: number) {
    //     // 调用辅助方法
    //     const { info, cfg } = await this.checkActivityAndGetInfo();
    //     await this.ctx.state.master.subItem1([cfg.data.skinDraw[0], cfg.data.skinDraw[1], cfg.data.skinDraw[2] * num]);
    //     //记录抽奖接结果的数组
    //     let items: KindItem[] = [];
    //     //根据抽数循环抽奖
    //     for (let index = 0; index < num; index++) {
    //         //奖池里有三个奖品和其他若干普通奖品，这三个奖品都有数量限制，当其中一个奖品达到数量限制时，抽奖不再获得这个奖品
    //         //如果三个限量奖品都领完了，就不用再更新info.pool2.allItems数组了。
    //         //先更新奖池
    //         if (cfg.data.pool2.allItems.length == info.pool2.allItems.length + 3) {
    //             // 检查数量
    //             if (info.pool2.limitItems[1].limit >= cfg.data.pool2.limitItems[1].limit) {
    //                 // 使用 indexOf 找到元素的索引
    //                 const indexToRemove = info.pool2.allItems.indexOf(cfg.data.pool2.allItems[0]);
    //                 info.pool2.allItems.splice(indexToRemove, 1);
    //             }
    //             if (info.pool2.limitItems[2].limit >= cfg.data.pool2.limitItems[2].limit) {
    //                 const indexToRemove = info.pool2.allItems.indexOf(cfg.data.pool2.allItems[1]);
    //                 info.pool2.allItems.splice(indexToRemove, 1);
    //             }
    //             if (info.pool2.limitItems[3].limit >= cfg.data.pool2.limitItems[3].limit) {
    //                 const indexToRemove = info.pool2.allItems.indexOf(cfg.data.pool2.allItems[2]);
    //                 info.pool2.allItems.splice(indexToRemove, 1);
    //             }
    //         }
    //         //获取奖品
    //         let _item = game.getProbByItems(info.pool2.allItems, 0, 3);
    //         if (_item == null) {
    //             this.ctx.throw("获取奖励失败");
    //         }
    //         items.push(_item);
    //         if (_item == cfg.data.pool2.allItems[0]) {
    //             info.pool2.limitItems[1].limit += 1;
    //             info.luckyLogs.push({ timestamp: game.getNowTime(), prize: _item });
    //         }
    //         if (_item == cfg.data.pool2.allItems[1]) {
    //             info.pool2.limitItems[2].limit += 1;
    //             info.luckyLogs.push({ timestamp: game.getNowTime(), prize: _item });
    //         }
    //         if (_item == cfg.data.pool2.allItems[2]) {
    //             info.pool2.limitItems[3].limit += 1;
    //             info.luckyLogs.push({ timestamp: game.getNowTime(), prize: _item });
    //         }
    //     }
    //     await this.update(info, ["red", "outf"]);
    //     await this.ctx.state.master.addItem2(items);
    // }
    /**
     * 魔种礼包
     */
    // 1. 合服礼包中免费档为每日限量领取1次。
    // 2. 合服礼包中付费档为活动期间限购。
    async gift(id) {
        const { info, cfg } = await this.checkActivityAndGetInfo();
        if (cfg.data.gifts[id] == null) {
            this.ctx.throw("参数错误");
        }
        if (info.gifts[id].limit == null) {
            info.gifts[id].limit = 0;
        }
        if (info.gifts[id].limit >= cfg.data.gifts[id].limit) {
            this.ctx.throw("购买次数已达上限");
        }
        info.gifts[id].limit += 1;
        await this.update(info, ["red", "outf"]);
    }
    //钩子 整合代码
    static async hook(ctx, uuid, kind, count, md = "add") {
        let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
        //活动 - 兽灵起源
        let cfgHdMonkey = setting_1.default.getHuodong2(heid, "hdMonkey");
        if (cfgHdMonkey != null) {
            for (const hdcid in cfgHdMonkey) {
                let hdMonkeyModel = HdMonkeyModel.getInstance(ctx, uuid, hdcid);
                await hdMonkeyModel.hook(kind, count, md);
            }
        }
    }
    /**
     * 接收任务统计
     */
    async hook(kind, count, md = "add") {
        let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
        if ((await actTaskMainModel.kaiqi("4006")) != 1) {
            return;
        }
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            //this.ctx.throw("活动未开启");
            return;
        }
        let isPass = false;
        for (const dc in cfg.data.task1) {
            if (kind == cfg.data.task1[dc].kind) {
                isPass = true;
                break;
            }
        }
        for (const dc in cfg.data.task2) {
            if (kind == cfg.data.task2[dc].kind) {
                isPass = true;
                break;
            }
        }
        if (isPass == false) {
            return;
        }
        let info = await this.getInfo();
        if (info.hook[kind] == null) {
            info.hook[kind] = 0;
        }
        switch (md) {
            case "add":
                info.hook[kind] += count;
                break;
            case "set":
                info.hook[kind] = count;
                break;
            case "max":
                info.hook[kind] = Math.max(info.hook[kind], count);
                break;
            case "min":
                info.hook[kind] = Math.min(info.hook[kind], count);
                break;
        }
        await this.update(info, ["outf", "red"]);
    }
}
exports.HdMonkeyModel = HdMonkeyModel;
//# sourceMappingURL=HdMonkeyModel.js.map