"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HdNewJiYuanModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const game_1 = __importDefault(require("../../util/game"));
const setting_1 = __importDefault(require("../../crontab/setting"));
const UserModel_1 = require("../user/UserModel");
const ActTaskMainModel_1 = require("../act/ActTaskMainModel");
/**
 * 活动 机缘新版
 */
class HdNewJiYuanModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdNewJiYuan"; //用于存储key 和  输出1级key
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
    //启动钩子 整合代码
    static async start(ctx, uuid) {
        let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
        //活动 - 
        let cfgHdJiYuan = setting_1.default.getHuodong2(heid, "hdNewJiYuan");
        if (cfgHdJiYuan != null) {
            for (const hdcid in cfgHdJiYuan) {
                let hdNewJiYuanModel = HdNewJiYuanModel.getInstance(ctx, uuid, hdcid);
                await hdNewJiYuanModel.backData_u(["info", "red"]);
            }
        }
    }
    //钩子 整合代码
    static async hook(ctx, uuid, kind, count) {
        let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
        let cfgHdJiYuan = setting_1.default.getHuodong2(heid, "hdNewJiYuan");
        if (cfgHdJiYuan != null) {
            for (const hdcid in cfgHdJiYuan) {
                let hdNewJiYuanModel = HdNewJiYuanModel.getInstance(ctx, uuid, hdcid);
                await hdNewJiYuanModel.addHook(kind, count);
            }
        }
    }
    //钩子 整合代码
    static async refreHook(ctx, uuid, kind, count, isSet) {
        let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
        let cfgHdJiYuan = setting_1.default.getHuodong2(heid, "hdNewJiYuan");
        if (cfgHdJiYuan != null) {
            for (const hdcid in cfgHdJiYuan) {
                let hdNewJiYuanModel = HdNewJiYuanModel.getInstance(ctx, uuid, hdcid);
                await hdNewJiYuanModel.refreshHook(kind, count, isSet);
            }
        }
    }
    //加道具
    static async addCons(ctx, uuid, count) {
        let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
        let cfgHdJiYuan = setting_1.default.getHuodong2(heid, "hdNewJiYuan");
        if (cfgHdJiYuan != null) {
            for (const hdcid in cfgHdJiYuan) {
                let hdNewJiYuanModel = HdNewJiYuanModel.getInstance(ctx, uuid, hdcid);
                await hdNewJiYuanModel.addExp(count);
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
            lunEat: 0,
            dayAt: 0,
            lockGift: "",
            exp: 0,
            pt: [],
            xy: [],
            y_lunEat: 0,
            y_lockGift: "",
            y_exp: 0,
            y_pt: [],
            y_xy: [],
            taskHook: {},
            taskdc: [],
            gift: {},
            freeGift: 0,
            giftOver: 0,
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        let cfg = await this.getHdCfg();
        if (cfg != null && cfg.info.id != info.hdid) {
            info = this.init();
            info.hdid = cfg.info.id;
        }
        //开启初始化
        if (info.lunEat == 0) {
            let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
            if (await actTaskMainModel.kaiqi('4009', 0) <= 0) {
                return this.init();
            }
        }
        //7天 轮重置
        if (info.lunEat <= this.ctx.state.newTime && cfg.data.lun > 0) {
            let lunEat = info.lunEat;
            if (info.lunEat == 0) {
                lunEat = this.ctx.state.new0 + cfg.data.lun * 86400;
            }
            else {
                while (lunEat < this.ctx.state.newTime) {
                    lunEat += cfg.data.lun * 86400;
                }
            }
            info.lunEat = lunEat;
            info.lockGift = "";
            info.exp = 0;
            info.pt = [];
            info.xy = [];
        }
        if (info.y_lunEat == null) {
            info.y_lunEat = 0;
        }
        if (info.y_lockGift == null) {
            info.y_lockGift = "";
        }
        if (info.y_exp == null) {
            info.y_exp = 0;
        }
        if (info.y_pt == null) {
            info.y_pt = [];
        }
        if (info.y_xy == null) {
            info.y_xy = [];
        }
        //30天 轮重置
        if (info.y_lunEat <= this.ctx.state.newTime && cfg.data.y_lun > 0) {
            let y_lunEat = info.y_lunEat;
            if (info.y_lunEat == 0) {
                y_lunEat = this.ctx.state.new0 + cfg.data.y_lun * 86400;
            }
            else {
                while (y_lunEat < this.ctx.state.newTime) {
                    y_lunEat += cfg.data.lun * 86400;
                }
            }
            info.y_lunEat = y_lunEat;
            info.y_lockGift = "";
            info.y_exp = 0;
            info.y_pt = [];
            info.y_xy = [];
        }
        //每日刷新
        if (this.ctx.state.new0 >= info.dayAt) {
            info.dayAt = this.ctx.state.newTime;
            info.taskdc = [];
            info.taskHook = {};
            info.gift = {};
            let userModel = UserModel_1.UserModel.getInstance(this.ctx, this.id);
            let user = await userModel.getInfo();
            let dcs = [];
            for (const dc in cfg.data.gift) {
                if (user.iscz >= cfg.data.gift[dc].tiaojian[0] && user.iscz <= cfg.data.gift[dc].tiaojian[1]) {
                    dcs.push(dc);
                }
            }
            let get2 = game_1.default.getRandArr(dcs, 2);
            for (const dc2 of get2) {
                info.gift[dc2] = 0;
            }
            info.freeGift = 0;
            await this.update(info, ['']);
        }
        info.taskHook["138"] = 1;
        return info;
    }
    /**
     * 返回数据
     */
    async getOutPut() {
        let info = await this.getInfo();
        if (info.lunEat == 0) {
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
        if (info.lunEat == 0) {
            return null;
        }
        switch (key) {
            case "info":
                cfg[key].sAt = info.lunEat - cfg.data.lun * 86400;
                cfg[key].eAt = info.lunEat;
                cfg[key].dAt = info.lunEat;
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
        if (cfg == null) {
            return 0;
        }
        let info = await this.getInfo();
        if (info.lunEat == 0) {
            return 0;
        }
        //免费礼包
        if (info.freeGift == 0) {
            return 1;
        }
        //积分
        for (const level in cfg.data.xyuan) {
            if (info.exp < cfg.data.xyuan[level].exp) {
                continue;
            }
            if (info.lockGift != "") {
                if (info.xy.indexOf(level) == -1) {
                    return 1;
                }
            }
            if (info.pt.indexOf(level) == -1) {
                return 1;
            }
        }
        //月积分
        for (const level in cfg.data.y_xyuan) {
            if (info.y_exp < cfg.data.y_xyuan[level].exp) {
                continue;
            }
            if (info.y_lockGift != "") {
                if (info.y_xy.indexOf(level) == -1) {
                    return 1;
                }
            }
            if (info.y_pt.indexOf(level) == -1) {
                return 1;
            }
        }
        //任务
        for (const dc in cfg.data.task) {
            let kind = cfg.data.task[dc].kind;
            if (info.taskdc.indexOf(dc) != -1) {
                continue;
            }
            if (info.taskHook[kind] != null && info.taskHook[kind] >= cfg.data.task[dc].need) {
                return 1;
            }
        }
        //额外礼包奖励
        if (info.giftOver >= cfg.data.giftOver.need) {
            return 1;
        }
        return 0;
    }
    /**
     * 活动机缘领取等级奖励
     * @param level 等级档次
     * @param type pt普通xy需要all=pt+xy
     */
    async jyLvRwd(level, type) {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            this.ctx.throw("活动已关闭");
        }
        if (cfg.data.xyuan[level] == null) {
            this.ctx.throw("参数错误");
        }
        let info = await this.getInfo();
        if (info.exp < cfg.data.xyuan[level].exp) {
            this.ctx.throw("积分不足");
        }
        if (type == "xy" || type == "all") {
            if (info.lockGift != "" && info.xy.indexOf(level) == -1) {
                info.xy.push(level);
                await this.ctx.state.master.addItem2(cfg.data.xyuan[level].xy);
            }
        }
        if (type == "pt" || type == "all") {
            if (info.pt.indexOf(level) == -1) {
                info.pt.push(level);
                await this.ctx.state.master.addItem2(cfg.data.xyuan[level].pt);
            }
        }
        await this.update(info, ['outf', 'red']);
    }
    /**
     * 活动机缘领取等级月奖励
     * @param level 等级档次
     * @param type pt普通xy需要all=pt+xy
     */
    async jyLvRwdYue(level, type) {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            this.ctx.throw("活动已关闭");
        }
        if (cfg.data.y_xyuan[level] == null) {
            this.ctx.throw("参数错误");
        }
        let info = await this.getInfo();
        if (info.y_exp < cfg.data.y_xyuan[level].exp) {
            this.ctx.throw("积分不足");
        }
        if (type == "xy" || type == "all") {
            if (info.y_lockGift != "" && info.y_xy.indexOf(level) == -1) {
                info.y_xy.push(level);
                await this.ctx.state.master.addItem2(cfg.data.y_xyuan[level].xy);
            }
        }
        if (type == "pt" || type == "all") {
            if (info.y_pt.indexOf(level) == -1) {
                info.y_pt.push(level);
                await this.ctx.state.master.addItem2(cfg.data.y_xyuan[level].pt);
            }
        }
        await this.update(info, ['outf', 'red']);
    }
    /**
     * 活动机缘领取任务奖励
     * @param  dc 档次
     */
    async jyTaskRwd(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            this.ctx.throw("活动已关闭");
        }
        if (cfg.data.task[dc] == null) {
            this.ctx.throw("参数错误");
        }
        let kind = cfg.data.task[dc].kind;
        let info = await this.getInfo();
        if (info.taskHook[kind] == null || info.taskHook[kind] < cfg.data.task[dc].need) {
            this.ctx.throw("未满足条件");
        }
        if (info.taskdc.indexOf(dc) != -1) {
            this.ctx.throw("已领取");
        }
        info.taskdc.push(dc);
        await this.ctx.state.master.addItem2(cfg.data.task[dc].items);
        await this.update(info, ['outf', 'red']);
    }
    /**
     * 活动机缘领取免费礼包
     */
    async jyFreeGift() {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            this.ctx.throw("活动已关闭");
        }
        let info = await this.getInfo();
        if (info.freeGift != 0) {
            this.ctx.throw("已经领取");
        }
        info.freeGift = this.ctx.state.newTime;
        await this.ctx.state.master.addItem2(cfg.data.freeGift.items);
        await this.update(info, ['outf', 'red']);
    }
    /**
     * 活动机缘领取礼包额外奖励
     */
    async jyGiftRwd() {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            this.ctx.throw("活动已关闭");
        }
        let info = await this.getInfo();
        if (cfg.data.giftOver.need > info.giftOver) {
            this.ctx.throw("未满足条件");
        }
        info.giftOver -= cfg.data.giftOver.need;
        await this.ctx.state.master.addItem2(cfg.data.giftOver.items);
        await this.update(info, ['outf', 'red']);
    }
    /**
     * 解锁礼包
     * 充值下单检查
     */
    async checkUp(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动已关闭");
        }
        let info = await this.getInfo();
        if (info.lockGift != "") {
            this.ctx.throw("已购买");
        }
        if (cfg.data.lockGift[dc] == null) {
            this.ctx.throw("参数错误");
        }
        return {
            type: 1,
            msg: cfg.info.title,
            data: cfg.data.lockGift[dc].need[1],
            kind10Cs: "hdNewJiYuanLock" + "_" + this.hdcid + "_" + dc + "_" + cfg.data.lockGift[dc].need[1]
        };
    }
    /**
     * 解锁礼包
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
        info.lockGift = dc;
        await this.update(info, ['outf', 'red']);
        await this.ctx.state.master.addItem2(cfg.data.lockGift[dc].items2);
        return {
            type: 1,
            msg: "充值成功",
            data: cfg.data.lockGift[dc].need[1]
        };
    }
    /**
     * 解锁礼包（月）
     * 充值下单检查
     */
    async checkUp2(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动已关闭");
        }
        let info = await this.getInfo();
        if (info.y_lockGift != "") {
            this.ctx.throw("已购买");
        }
        if (cfg.data.y_lockGift[dc] == null) {
            this.ctx.throw("参数错误");
        }
        return {
            type: 1,
            msg: cfg.info.title,
            data: cfg.data.y_lockGift[dc].need[1],
            kind10Cs: "hdNewJiYuanLockYue" + "_" + this.hdcid + "_" + dc + "_" + cfg.data.y_lockGift[dc].need[1]
        };
    }
    /**
     * 解锁礼包（月）
     * 充值成功后执行
     */
    async carryOut2(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            return {
                type: 0,
                msg: "活动已关闭",
                data: null
            };
        }
        let info = await this.getInfo();
        info.y_lockGift = dc;
        await this.update(info, ['outf', 'red']);
        await this.ctx.state.master.addItem2(cfg.data.y_lockGift[dc].items2);
        return {
            type: 1,
            msg: "充值成功",
            data: cfg.data.y_lockGift[dc].need[1]
        };
    }
    /**
 * 解锁礼包
 * 充值下单检查
 */
    async checkUp1(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动已关闭");
        }
        let info = await this.getInfo();
        if (info.gift[dc] == null) {
            this.ctx.throw("参数错误");
        }
        if (info.gift[dc] > 0) {
            this.ctx.throw("已购买");
        }
        return {
            type: 1,
            msg: cfg.info.title,
            data: cfg.data.gift[dc].need[1],
            kind10Cs: "hdNewJiYuanGift" + "_" + this.hdcid + "_" + dc + "_" + cfg.data.gift[dc].need[1]
        };
    }
    /**
     * 解锁礼包
     * 充值成功后执行
     */
    async carryOut1(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            return {
                type: 0,
                msg: "活动已关闭",
                data: null
            };
        }
        let info = await this.getInfo();
        info.gift[dc] = this.ctx.state.newTime;
        info.giftOver += 1;
        await this.update(info, ['outf', 'red']);
        await this.ctx.state.master.addItem2(cfg.data.gift[dc].items);
        return {
            type: 1,
            msg: "充值成功",
            data: cfg.data.gift[dc].need[1]
        };
    }
    /**
     * 接收任务统计
     */
    async addHook(kind, count) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime >= cfg.info.eAt) {
            return;
        }
        let isPass = false;
        for (const dc in cfg.data.task) {
            if (kind == cfg.data.task[dc].kind) {
                isPass = true;
                break;
            }
        }
        if (isPass == false) {
            return;
        }
        let info = await this.getInfo();
        if (info.lunEat == 0) {
            return;
        }
        if (info.taskHook[kind] == null) {
            info.taskHook[kind] = 0;
        }
        info.taskHook[kind] += count;
        await this.update(info, ["outf", "red"]);
    }
    /**
     * 刷新任务统计
     * 哪些任务 需要一开始 就去成就获取
     */
    async refreshHook(kind, count, isSet) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime >= cfg.info.eAt) {
            return;
        }
        let isPass = false;
        for (const dc in cfg.data.task) {
            if (kind == cfg.data.task[dc].kind) {
                isPass = true;
                break;
            }
        }
        if (isPass == false) {
            return;
        }
        let info = await this.getInfo();
        if (info.lunEat == 0) {
            return;
        }
        if (isSet == true) {
            info.taskHook[kind] = count;
        }
        else {
            if (info.taskHook[kind] == null) {
                info.taskHook[kind] = 0;
            }
            info.taskHook[kind] += count;
        }
        await this.update(info, ["outf", "red"]);
    }
    /**
     * 增加经验提升等级
     * 哪些任务 需要一开始 就去成就获取
     */
    async addExp(count) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime >= cfg.info.eAt) {
            return;
        }
        let info = await this.getInfo();
        if (info.lunEat == 0) {
            return;
        }
        info.exp += count;
        info.y_exp += count;
        await this.update(info, ["outf", "red"]);
        this.ctx.state.master.addLog(1, 805, count, info.exp);
    }
}
exports.HdNewJiYuanModel = HdNewJiYuanModel;
//# sourceMappingURL=HdNewJiYuanModel.js.map