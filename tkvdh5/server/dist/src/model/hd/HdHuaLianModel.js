"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HdHuaLianModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const game_1 = __importDefault(require("../../util/game"));
const ActItemModel_1 = require("../act/ActItemModel");
const setting_1 = __importDefault(require("../../crontab/setting"));
const ActTaskMainModel_1 = require("../act/ActTaskMainModel");
/**
 * 活动 化莲
 */
class HdHuaLianModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdHuaLian"; //用于存储key 和  输出1级key
        this.outIsAu = true; //下发数据是否用au下发
        this.dType = master_1.DataType.user;
    }
    //钩子 整合代码
    static async hook(ctx, uuid, kind, count, isSet = false) {
        let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
        //活动 - 
        let cfgHdHl = setting_1.default.getHuodong2(heid, "hdHuaLian");
        if (cfgHdHl != null) {
            for (const hdcid in cfgHdHl) {
                let hdHuaLianModel = HdHuaLianModel.getInstance(ctx, uuid, hdcid);
                await hdHuaLianModel.addHook(kind, count, isSet);
            }
        }
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
            time: this.ctx.state.newTime,
            baodi: {},
            score: 0,
            chou1: {},
            chou2: {},
            jifen: [],
            gift: {},
            task: {},
            taskKind: {}
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        let cfg = await this.getHdCfg();
        if (cfg != null && cfg.info.id != info.hdid) {
            info = this.init();
            info.hdid = cfg.info.id;
        }
        if (info.time < this.ctx.state.new0) {
            info.time = this.ctx.state.newTime;
            info.task = {};
            info.taskKind = {};
            info.gift = {};
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
        let cfg = await this.getHdCfg();
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
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            return 0;
        }
        let info = await this.getInfo();
        if (cfg.data.gift["1"] != null && cfg.data.gift["1"].need.length == 0 && info.gift["1"] == null) {
            return 1;
        }
        for (const dc in cfg.data.task) {
            if (info.task[dc] != null) {
                continue;
            }
            let kind = cfg.data.task[dc].kind;
            if (info.taskKind[kind] != null && info.taskKind[kind] > cfg.data.task[dc].need) {
                return 1;
            }
        }
        let subItemid = cfg.data.need[1].toString();
        let actItemModel = ActItemModel_1.ActItemModel.getInstance(this.ctx, this.id);
        let actItem = await actItemModel.getInfo();
        if (actItem[subItemid] != null && actItem[subItemid] > 0) {
            return 1;
        }
        return 0;
    }
    /**
     * 充值下单检查
     */
    async checkUp(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动已结束");
        }
        if (cfg.data.gift[dc] == null) {
            this.ctx.throw("参数错误");
        }
        if (cfg.data.gift[dc].need[0] != 10) {
            this.ctx.throw("不是充值档次");
        }
        let info = await this.getInfo();
        if (info.gift[dc] == null) {
            info.gift[dc] = 0;
        }
        if (info.gift[dc] >= cfg.data.gift[dc].limit) {
            this.ctx.throw("无次数");
        }
        return {
            type: 1,
            msg: cfg.data.gift[dc].title,
            data: cfg.data.gift[dc].need[1],
            kind10Cs: this.kid + "_" + this.hdcid + "_" + dc + "_" + cfg.data.gift[dc].need[1]
        };
    }
    /**
     * 充值成功后执行
     */
    async carryOut(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            return {
                type: 0,
                msg: "活动已关闭",
                data: null
            };
        }
        let info = await this.getInfo();
        if (info.gift[dc] == null) {
            info.gift[dc] = 0;
        }
        info.gift[dc] += 1;
        await this.update(info, ["outf", "red"]);
        await this.ctx.state.master.addItem2(cfg.data.gift[dc].items);
        return {
            type: 1,
            msg: "充值成功",
            data: cfg.data.gift[dc].need[1]
        };
    }
    /**
     * 领取每日任务
     */
    async hdHlTask(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime >= cfg.info.eAt) {
            this.ctx.throw("活动已结束");
        }
        if (cfg.data.task[dc] == null) {
            this.ctx.throw("参数错误");
        }
        let info = await this.getInfo();
        if (info.task[dc] != null) {
            this.ctx.throw("任务奖励已经领取");
        }
        let kind = cfg.data.task[dc].kind;
        if (info.taskKind[kind] == null || info.taskKind[kind] < cfg.data.task[dc].need) {
            this.ctx.throw("任务未完成");
        }
        info.task[dc] = this.ctx.state.newTime;
        await this.update(info, ["red", "outf"]);
        await this.ctx.state.master.addItem2(cfg.data.task[dc].items);
    }
    /**
     * 领取礼包
     */
    async hdHlGift(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime >= cfg.info.eAt) {
            this.ctx.throw("活动已结束");
        }
        if (cfg.data.gift[dc] == null) {
            this.ctx.throw("参数错误");
        }
        let info = await this.getInfo();
        if (info.gift[dc] == null) {
            info.gift[dc] = 0;
        }
        if (info.gift[dc] >= cfg.data.gift[dc].limit) {
            this.ctx.throw("购买次数已达上限");
        }
        info.gift[dc] += 1;
        await this.update(info, ["red", "outf"]);
        if (cfg.data.gift[dc].need.length > 0) {
            await this.ctx.state.master.subItem1(cfg.data.gift[dc].need);
        }
        await this.ctx.state.master.addItem2(cfg.data.gift[dc].items);
    }
    /**
     * 化莲抽奖
     */
    async hdHlChou(num) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime >= cfg.info.eAt) {
            this.ctx.throw("活动已结束");
        }
        if (num < 1) {
            this.ctx.throw("参数错误");
        }
        await this.ctx.state.master.subItem1([cfg.data.need[0], cfg.data.need[1], cfg.data.need[2] * num]);
        let info = await this.getInfo();
        let items = [];
        for (let index = 1; index <= num; index++) {
            let citem1 = game_1.default.getProbByItems(cfg.data.prob, 0, 1);
            if (citem1 == null) {
                this.ctx.throw("抽取失败");
            }
            info.score += 1;
            let hasdj = 0;
            for (const dc2 in cfg.data.chou["2"]) {
                if (info.baodi[dc2] == null) {
                    info.baodi[dc2] = 0;
                }
                if (info.chou2[dc2] == null) {
                    info.chou2[dc2] = 0;
                }
                if (cfg.data.chou["2"][dc2].limit <= info.chou2[dc2]) {
                    continue;
                }
                info.baodi[dc2] += 1;
                if (info.baodi[dc2] >= cfg.data.chou["2"][dc2].baodi) {
                    citem1[0] = "2";
                }
                hasdj += 1;
            }
            if (hasdj <= 0) { //没有大奖了
                citem1[0] = "1";
            }
            if (citem1[0] == "1") { //普通奖励
                let cfgchou1 = {};
                for (const dc2 in cfg.data.chou["1"]) {
                    if (info.chou1[dc2] == null) {
                        info.chou1[dc2] = 0;
                    }
                    if (cfg.data.chou["1"][dc2].limit > 0 && cfg.data.chou["1"][dc2].limit <= info.chou1[dc2]) {
                        continue;
                    }
                    cfgchou1[dc2] = cfg.data.chou["1"][dc2];
                }
                let gid = game_1.default.getProbRandId(0, cfgchou1, "prob");
                if (gid == null || cfgchou1[gid] == null) {
                    this.ctx.throw("抽取奖品失败1");
                }
                info.chou1[gid] += 1;
                items = game_1.default.addArr(items, cfgchou1[gid].item);
            }
            else if (citem1[0] == "2") { //大奖
                let biZhongId = "";
                let cfgchou2 = {};
                for (const dc2 in cfg.data.chou["2"]) {
                    if (info.chou2[dc2] == null) {
                        info.chou2[dc2] = 0;
                    }
                    if (cfg.data.chou["2"][dc2].limit > 0 && cfg.data.chou["2"][dc2].limit <= info.chou2[dc2]) {
                        continue;
                    }
                    if (info.baodi[dc2] <= cfg.data.chou["2"][dc2].buzhong) {
                        continue;
                    }
                    if (info.baodi[dc2] >= cfg.data.chou["2"][dc2].baodi) {
                        biZhongId = dc2;
                    }
                    cfgchou2[dc2] = cfg.data.chou["2"][dc2];
                }
                if (biZhongId == "") {
                    let gid = game_1.default.getProbRandId(0, cfgchou2, "prob");
                    if (gid == null || cfgchou2[gid] == null) {
                        this.ctx.throw("抽取奖品失败2");
                    }
                    info.chou2[gid] += 1;
                    info.baodi[gid] = 0;
                    items = game_1.default.addArr(items, cfgchou2[gid].item);
                }
                else {
                    items = game_1.default.addArr(items, cfgchou2[biZhongId].item);
                    info.baodi[biZhongId] = 0;
                    info.chou2[biZhongId] += 1;
                }
            }
            else {
                this.ctx.throw("抽取类型错误");
            }
        }
        await this.ctx.state.master.addItem2(items);
        await this.update(info, ["outf", "red"]);
    }
    /**
     * 领取积分档次
     */
    async hdHlJifen(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            this.ctx.throw("活动已结束");
        }
        if (cfg.data.jifen[dc] == null) {
            this.ctx.throw("参数错误");
        }
        let info = await this.getInfo();
        if (info.score < cfg.data.jifen[dc].need) {
            this.ctx.throw("未满足条件");
        }
        if (info.jifen.indexOf(dc) != -1) {
            this.ctx.throw("已领取");
        }
        info.jifen.push(dc);
        await this.update(info, ["outf", "red"]);
        await this.ctx.state.master.addItem2(cfg.data.jifen[dc].items);
    }
    /**
     * 任务钩子
     */
    async addHook(kind, count, isSet) {
        let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
        if (await actTaskMainModel.kaiqi("4012") != 1) {
            return;
        }
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            return;
        }
        let pass = false;
        for (const dc in cfg.data.task) {
            if (cfg.data.task[dc].kind.toString() == kind.toString()) {
                pass = true;
            }
        }
        if (!pass) {
            return;
        }
        let info = await this.getInfo();
        if (isSet) {
            info.taskKind[kind] = count;
        }
        else {
            if (info.taskKind[kind] == null) {
                info.taskKind[kind] = 0;
            }
            info.taskKind[kind] += count;
        }
        await this.update(info, ["outf", "red"]);
    }
}
exports.HdHuaLianModel = HdHuaLianModel;
//# sourceMappingURL=HdHuaLianModel.js.map