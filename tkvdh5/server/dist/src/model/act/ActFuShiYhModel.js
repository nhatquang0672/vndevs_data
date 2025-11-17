"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActFuShiYhModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const tool_1 = require("../../util/tool");
/**
 * 符石 - 鱼获盛宴
 */
class ActFuShiYhModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actFuShiYh"; //用于存储key 和  输出1级key
        this.outIsAu = false; //下发数据是否用au下发
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
        return ""; //输出2级key
    }
    //初始化
    init() {
        return {
            level: 0,
            sAt: 0,
            dayAt: 0,
            nids: {},
            task: {},
            lvList: {},
            gift: {},
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        if (info.sAt == 0) {
            return info; //未开启
        }
        let count = tool_1.tool.mathcfg_count(this.ctx, "fushi_yuhuo_cx");
        if (info.sAt + count * 86400 < this.ctx.state.newTime) {
            return info; //已经结束
        }
        //重置每日商店购买
        if (info.dayAt < this.ctx.state.new0) {
            info.dayAt = this.ctx.state.newTime;
            let pool = gameCfg_1.default.fushiSyjianggift.pool;
            for (const key in pool) {
                if (pool[key].type == 1) {
                    delete info.gift[pool[key].id];
                }
            }
        }
        return info;
    }
    /**
     * 返回数据
     */
    async getOutPut() {
        let info = await this.getInfo();
        if (info.sAt == 0) {
            return null;
        }
        let count = tool_1.tool.mathcfg_count(this.ctx, "fushi_yuhuo_cx");
        if (info.sAt + count * 86400 < this.ctx.state.newTime) {
            return null;
        }
        return info;
    }
    /**
     * 解锁鱼获盛宴
     */
    async unlock() {
        let info = await this.getInfo();
        info.sAt = this.ctx.state.new0;
        //解锁任务
        let cfgPool = gameCfg_1.default.fushiSyrenwu.pool;
        for (const key in cfgPool) {
            if (cfgPool[key].qianzhi == 0) {
                info.task[cfgPool[key].id] = 0;
                info.nids[cfgPool[key].param[0].toString()] = 0;
            }
        }
        await this.update(info);
    }
    /**
     * 鱼获盛宴领取任务奖励
     */
    async yhTaskRwd(dc) {
        let info = await this.getInfo();
        if (info.task[dc] == null) {
            this.ctx.throw("任务不存在");
        }
        let cfg = gameCfg_1.default.fushiSyrenwu.getItemCtx(this.ctx, dc);
        let kind = cfg.param[0].toString();
        if (info.nids[kind] == null || info.nids[kind] < cfg.param[1]) {
            this.ctx.throw("未满足条件");
        }
        if (info.task[dc] > 0) {
            this.ctx.throw("已领取");
        }
        await this.ctx.state.master.addItem2(cfg.items);
        info.task[dc] = this.ctx.state.newTime;
        let cfgPool = gameCfg_1.default.fushiSyrenwu.pool;
        for (const key in cfgPool) {
            if (cfgPool[key].qianzhi.toString() == dc) {
                delete info.task[dc];
                info.task[cfgPool[key].id] = 0;
                if (info.nids[cfgPool[key].param[0].toString()] == null) {
                    info.nids[cfgPool[key].param[0].toString()] = 0;
                }
                break;
            }
        }
        await this.update(info);
    }
    /**
     * 鱼获盛宴领取等级奖励
     */
    async yhLvRwd(dc) {
        let cfg = gameCfg_1.default.fushiSyjiangli.getItemCtx(this.ctx, dc);
        let info = await this.getInfo();
        if (info.level < cfg.level) {
            this.ctx.throw("未达到等级");
        }
        if (info.lvList[dc] != null) {
            this.ctx.throw("已经领取");
        }
        info.lvList[dc] = this.ctx.state.newTime;
        await this.update(info);
        await this.ctx.state.master.addItem2(cfg.items);
    }
    /**
     * 鱼获盛宴增加等级
     */
    async addLvevl(count) {
        let info = await this.getInfo();
        info.level += count;
        await this.update(info);
    }
    /**
     * 任务钩子
     */
    async addHook(kind, count, isSet) {
        let info = await this.getInfo();
        if (info.sAt == 0) {
            return; //未开启
        }
        if (info.sAt + tool_1.tool.mathcfg_count(this.ctx, "fushi_yuhuo_cx") * 86400 < this.ctx.state.newTime) {
            return; //已经结束
        }
        if (info.nids[kind] == null) {
            return;
        }
        if (isSet) {
            info.nids[kind] = count;
        }
        else {
            info.nids[kind] += count;
        }
        await this.update(info);
    }
    /**
     * 充值下单检查
     */
    async checkUp(dc) {
        let cfg = gameCfg_1.default.fushiSyjianggift.getItemCtx(this.ctx, dc);
        if (cfg.need[0] != 10) {
            this.ctx.throw("不是充值档次");
        }
        let info = await this.getInfo();
        if (info.sAt == 0) {
            this.ctx.throw("活动未生效");
        }
        let count = tool_1.tool.mathcfg_count(this.ctx, "fushi_yuhuo_cx");
        if (info.sAt + count * 86400 < this.ctx.state.newTime) {
            this.ctx.throw("活动已经结束");
        }
        if (info.gift[dc] == null) {
            info.gift[dc] = 0;
        }
        if (info.gift[dc] >= cfg.limit) {
            this.ctx.throw("无购买次数");
        }
        return {
            type: 1,
            msg: "鱼获盛宴每日" + dc,
            data: cfg.need[1],
            kind10Cs: this.kid + "_" + "1" + "_" + dc + "_" + cfg.need[1]
        };
    }
    /**
     * 充值成功后执行
     */
    async carryOut(dc) {
        let cfg = gameCfg_1.default.fushiSyjianggift.getItemCtx(this.ctx, dc);
        let info = await this.getInfo();
        if (info.gift[dc] == null) {
            info.gift[dc] = 0;
        }
        info.gift[dc] += 1;
        await this.update(info);
        await this.ctx.state.master.addItem2(cfg.rwd);
        return {
            type: 1,
            msg: "充值成功",
            data: cfg.need[1]
        };
    }
}
exports.ActFuShiYhModel = ActFuShiYhModel;
//# sourceMappingURL=ActFuShiYhModel.js.map