"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HdKaifugModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const game_1 = __importDefault(require("../../util/game"));
const MailModel_1 = require("../user/MailModel");
const setting_1 = __importDefault(require("../../crontab/setting"));
const gameMethod_1 = require("../../../common/gameMethod");
const ActTaskKindModel_1 = require("../act/ActTaskKindModel");
const ActTaskMainModel_1 = require("../act/ActTaskMainModel");
/**
 * 活动 连冲活动
 */
class HdKaifugModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdKaifu"; //用于存储key 和  输出1级key
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
    //钩子 整合代码
    static async hook(ctx, uuid, kind, count) {
        let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
        let cfgHdKaifu = setting_1.default.getHuodong2(heid, "hdKaifu");
        if (cfgHdKaifu != null) {
            for (const hdcid in cfgHdKaifu) {
                let hdKaifugModel = HdKaifugModel.getInstance(ctx, uuid, hdcid);
                await hdKaifugModel.addHook(kind, count);
            }
        }
    }
    //钩子 整合代码
    static async refreHook(ctx, uuid, kind, count) {
        let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
        let cfgHdKaifu = setting_1.default.getHuodong2(heid, "hdKaifu");
        if (cfgHdKaifu != null) {
            for (const hdcid in cfgHdKaifu) {
                let hdKaifugModel = HdKaifugModel.getInstance(ctx, uuid, hdcid);
                await hdKaifugModel.refreshHook(kind, count);
            }
        }
    }
    //加道具
    static async addCons(ctx, uuid, count) {
        let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
        let cfgHdKaifu = setting_1.default.getHuodong2(heid, "hdKaifu");
        if (cfgHdKaifu != null) {
            for (const hdcid in cfgHdKaifu) {
                let hdKaifugModel = HdKaifugModel.getInstance(ctx, uuid, hdcid);
                await hdKaifugModel.addCons(count);
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
            time: this.ctx.state.newTime,
            cons: 0,
            allCons: 0,
            jflist: {},
            duihuan: {},
            taskhook: {},
            task: {},
            gift: {},
            isOver: 0,
            bugver: 1 //版本
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
            for (const dc in cfg.data.gift) {
                if (cfg.data.gift[dc].need.length <= 0) {
                    delete info.gift[dc];
                }
            }
        }
        if (info.bugver != 3) {
            info.bugver = 3;
            let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(this.ctx, this.id);
            let actTaskKind = await actTaskKindModel.getInfo();
            for (const key in cfg.data.task) {
                let kind = cfg.data.task[key].kind;
                if (actTaskKind.nids[kind] != null) {
                    info.taskhook[kind] = actTaskKind.nids[kind];
                }
            }
            await this.update(info, ['outf', 'red']);
        }
        return info;
    }
    /**
     * 返回数据
     */
    async getOutPut() {
        let cfgInfo = await this.getOutPut_u("info");
        if (cfgInfo == null || this.ctx.state.newTime > cfgInfo.dAt) {
            return null;
        }
        return {
            info: cfgInfo,
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
        let openAt = setting_1.default.getQufus()[await this.getHeIdByUuid(this.id)].openAt;
        let tome_0 = game_1.default.getToDay_0(Math.max(openAt, cfg.data.kfMinAt));
        let etime = tome_0 + cfg.data.kfday * 86400;
        let info = await this.getInfo();
        if (this.ctx.state.newTime >= etime && info.isOver != 1) {
            info.isOver = 1;
            let items = [];
            for (const key in cfg.data.jflist) {
                if (parseInt(key) > info.allCons) {
                    continue;
                }
                if (info.jflist[key] != null) {
                    continue;
                }
                info.jflist[key] = 1;
                items = game_1.default.addArr(items, cfg.data.jflist[key].items);
            }
            for (const key in cfg.data.task) {
                let kind = cfg.data.task[key].kind;
                if (info.taskhook[kind] == null || cfg.data.task[key].need > info.taskhook[kind]) {
                    continue;
                }
                if (info.task[key] != null) {
                    continue;
                }
                info.task[key] = 1;
                items = game_1.default.addArr(items, cfg.data.task[key].items);
            }
            if (items.length > 0) {
                items = gameMethod_1.gameMethod.mergeArr(items);
                let _items = [];
                for (const _item of items) {
                    if (_item[0] == 1 && _item[1] == 801) {
                        continue;
                    }
                    _items.push(_item);
                }
                let mailModel = MailModel_1.MailModel.getInstance(this.ctx, this.id);
                await mailModel.sendMail("开服庆典活动奖励", "开服庆典活动结束，您有奖励尚未领取，请及时领取奖励。", _items, 1, etime);
            }
            await this.update(info, [""]);
        }
        switch (key) {
            case "info":
                let cfgInfo = gameMethod_1.gameMethod.objCopy(cfg[key]);
                cfgInfo.eAt = etime;
                cfgInfo.dAt = etime;
                return cfgInfo;
            case "data":
                return cfg[key];
            case "red":
                return await this.getRed();
            case "outf":
                return {
                    cons: info.cons,
                    allCons: info.allCons,
                    jflist: info.jflist,
                    duihuan: info.duihuan,
                    taskhook: info.taskhook,
                    task: info.task,
                    gift: info.gift,
                };
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
        //积分
        for (const dc in cfg.data.jflist) {
            if (info.jflist[dc] != null) {
                continue;
            }
            if (cfg.data.jflist[dc].need <= info.allCons) {
                return 1;
            }
        }
        //礼包
        for (const dc in cfg.data.gift) {
            if (cfg.data.gift[dc].need.length > 0) {
                continue;
            }
            if (info.gift[dc] == null) {
                info.gift[dc] = 0;
            }
            if (info.gift[dc] < cfg.data.gift[dc].limit) {
                return 1;
            }
        }
        //任务
        for (const dc in cfg.data.task) {
            let kind = cfg.data.task[dc].kind;
            if (info.taskhook[kind] == null || info.taskhook[kind] < cfg.data.task[dc].need) {
                continue;
            }
            if (info.task[dc] == null) {
                return 1;
            }
        }
        return 0;
    }
    /**
     * 充值下单检查
     */
    async checkUp(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        if (cfg.data.gift[dc].need[0] != 10) {
            this.ctx.throw("参数错误");
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
        await this.update(info, ['outf', 'red']);
        await this.ctx.state.master.addItem2(cfg.data.gift[dc].items);
        return {
            type: 1,
            msg: "充值成功",
            data: cfg.data.gift[dc].need[1]
        };
    }
    /**
     * 加积分
     */
    async addCons(cons) {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            this.ctx.throw("活动已关闭");
            return;
        }
        let info = await this.getInfo();
        info.cons += cons;
        info.allCons += cons;
        await this.update(info, ['outf', 'red']);
        this.ctx.state.master.addLog(1, 801, cons, info.cons);
    }
    /**
     * 领取积分奖励
     */
    async hdKfScore(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            this.ctx.throw("活动已关闭");
            return;
        }
        if (cfg.data.jflist[dc] == null) {
            this.ctx.throw("参数错误");
            return;
        }
        let info = await this.getInfo();
        if (cfg.data.jflist[dc].need > info.allCons) {
            this.ctx.throw("庆典积分不足");
            return;
        }
        if (info.jflist[dc] != null) {
            this.ctx.throw("已经领取");
        }
        info.jflist[dc] = 1;
        await this.update(info, ['outf', 'red']);
        await this.ctx.state.master.addItem2(cfg.data.jflist[dc].items);
    }
    /**
     * 开服活动兑换
     */
    async hdKfDh(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            this.ctx.throw("活动已关闭");
            return;
        }
        if (cfg.data.duihuan[dc] == null) {
            this.ctx.throw("参数错误");
            return;
        }
        let info = await this.getInfo();
        if (cfg.data.duihuan[dc].need > info.cons) {
            this.ctx.throw("庆典积分不足");
        }
        if (cfg.data.duihuan[dc].lock > info.allCons) {
            this.ctx.throw(`积分需达到${cfg.data.duihuan[dc].lock}解锁`);
        }
        if (info.duihuan[dc] == null) {
            info.duihuan[dc] = 0;
        }
        if (info.duihuan[dc] >= cfg.data.duihuan[dc].limit) {
            this.ctx.throw("无兑换次数");
        }
        info.cons -= cfg.data.duihuan[dc].need;
        info.duihuan[dc] += 1;
        await this.update(info, ['outf', 'red']);
        await this.ctx.state.master.addItem1(cfg.data.duihuan[dc].item);
    }
    /**
     * 领取任务奖励
     */
    async hdKfTask(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            this.ctx.throw("活动已关闭");
            return;
        }
        if (cfg.data.task[dc] == null) {
            this.ctx.throw("参数错误");
            return;
        }
        let info = await this.getInfo();
        let kind = cfg.data.task[dc].kind;
        if (info.taskhook[kind] == null || info.taskhook[kind] < cfg.data.task[dc].need) {
            this.ctx.throw("任务未完成");
        }
        if (info.task[dc] != null) {
            this.ctx.throw("已经领取");
        }
        info.task[dc] = 1;
        await this.update(info, ['outf', 'red']);
        await this.ctx.state.master.addItem2(cfg.data.task[dc].items);
    }
    /**
     * 领取礼包奖励
     */
    async hdKfGift(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            this.ctx.throw("活动已关闭");
            return;
        }
        if (cfg.data.gift[dc] == null) {
            this.ctx.throw("参数错误");
            return;
        }
        let info = await this.getInfo();
        if (info.gift[dc] == null) {
            info.gift[dc] = 0;
        }
        if (info.gift[dc] >= cfg.data.gift[dc].limit) {
            this.ctx.throw("无次数");
        }
        if (cfg.data.gift[dc].need.length > 0) {
            await this.ctx.state.master.subItem1(cfg.data.gift[dc].need);
        }
        info.gift[dc] += 1;
        await this.update(info, ['outf', 'red']);
        await this.ctx.state.master.addItem2(cfg.data.gift[dc].items);
    }
    /**
     * 接收任务统计
     */
    async addHook(kind, count) {
        let actTaskMainModel = await ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
        if (await actTaskMainModel.kaiqi("4000") == 0) {
            return;
        }
        let cfg = (await this.getHdCfg());
        let openAt = setting_1.default.getQufus()[await this.getHeIdByUuid(this.id)].openAt;
        let tome_0 = game_1.default.getToDay_0(Math.max(openAt, cfg.data.kfMinAt));
        let etime = tome_0 + cfg.data.kfday * 86400;
        if (cfg == null || this.ctx.state.newTime >= etime) {
            return;
        }
        let isPass = false;
        for (const dc in cfg.data.task) {
            if (kind == cfg.data.task[dc].kind.toString()) {
                isPass = true;
                break;
            }
        }
        if (isPass == false) {
            return;
        }
        let info = await this.getInfo();
        if (info.taskhook[kind] == null) {
            info.taskhook[kind] = 0;
        }
        info.taskhook[kind] += count;
        await this.update(info, ["outf", "red"]);
    }
    /**
     * 刷新任务统计
     * 哪些任务 需要一开始 就去成就获取
     */
    async refreshHook(kind, count) {
        let cfg = (await this.getHdCfg());
        let openAt = setting_1.default.getQufus()[await this.getHeIdByUuid(this.id)].openAt;
        let tome_0 = game_1.default.getToDay_0(Math.max(openAt, cfg.data.kfMinAt));
        let etime = tome_0 + cfg.data.kfday * 86400;
        if (cfg == null || this.ctx.state.newTime >= etime) {
            return;
        }
        let isPass = false;
        for (const dc in cfg.data.task) {
            if (kind == cfg.data.task[dc].kind.toString()) {
                isPass = true;
                break;
            }
        }
        if (isPass == false) {
            return;
        }
        let info = await this.getInfo();
        if (info.taskhook[kind] == null) {
            info.taskhook[kind] = 0;
        }
        info.taskhook[kind] = count;
        await this.update(info, ["outf", "red"]);
    }
}
exports.HdKaifugModel = HdKaifugModel;
//# sourceMappingURL=HdKaifuModel.js.map