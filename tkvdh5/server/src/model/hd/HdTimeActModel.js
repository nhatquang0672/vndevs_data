"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HdTimeActModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const setting_1 = __importDefault(require("../../crontab/setting"));
/**
 * 限时活动 任务
 */
class HdTimeActModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdTimeAct"; //用于存储key 和  输出1级key
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
    static async hook(ctx, uuid, kind, count) {
        let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
        //活动 - 限时活动 任务
        let cfgHdTimeAct = setting_1.default.getHuodong2(heid, "hdTimeAct");
        if (cfgHdTimeAct != null) {
            for (const hdcid in cfgHdTimeAct) {
                let hdTimeActModel = HdTimeActModel.getInstance(ctx, uuid, hdcid);
                await hdTimeActModel.addHook(kind, count);
            }
        }
    }
    //钩子 整合代码
    static async refreHook(ctx, uuid, kind, count) {
        let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
        //活动 - 限时活动 任务
        let cfgHdTimeAct = setting_1.default.getHuodong2(heid, "hdTimeAct");
        if (cfgHdTimeAct != null) {
            for (const hdcid in cfgHdTimeAct) {
                let hdTimeActModel = HdTimeActModel.getInstance(ctx, uuid, hdcid);
                await hdTimeActModel.refreshHook(kind, count);
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
            rwds: {},
            hook: {},
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        let cfg = (await this.getHdCfg());
        if (cfg != null && cfg.info.id != info.hdid) {
            info = this.init();
            info.hdid = cfg.info.id;
            //重新初始化 需要一开始就获取的数据
        }
        return info;
    }
    /**
     * 返回数据
     */
    async getOutPut() {
        let cfg = (await this.getHdCfg());
        if (cfg == null) {
            return null;
        }
        let info = await this.getInfo();
        let isClose = true;
        for (const dc in cfg.data.list) {
            if (info.rwds[dc] == null) {
                isClose = false;
            }
        }
        if (isClose) {
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
                return {
                    rwds: info.rwds,
                    hook: info.hook,
                };
        }
        return null;
    }
    /**
     * 接收任务统计
     */
    async addHook(kind, count) {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            //this.ctx.throw("活动未开启");
            return;
        }
        let info = await this.getInfo();
        let isClose = true;
        for (const dc in cfg.data.list) {
            if (info.rwds[dc] == null) {
                isClose = false;
            }
        }
        if (isClose) {
            return;
        }
        let isPass = false;
        for (const dc in cfg.data.list) {
            if (cfg.data.list[dc].kind == kind) {
                isPass = true;
                break;
            }
        }
        if (isPass == false) {
            return;
        }
        if (info.hook[kind] == null) {
            info.hook[kind] = 0;
        }
        info.hook[kind] += count;
        await this.update(info, ["outf", "red"]);
    }
    /**
     * 刷新任务统计
     * 哪些任务 需要一开始 就去成就获取
     */
    async refreshHook(kind, count) {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            //this.ctx.throw("活动未开启");
            return;
        }
        let info = await this.getInfo();
        let isClose = true;
        for (const dc in cfg.data.list) {
            if (info.rwds[dc] == null) {
                isClose = false;
            }
        }
        if (isClose) {
            return;
        }
        let isPass = false;
        for (const dc in cfg.data.list) {
            if (cfg.data.list[dc].kind == kind) {
                isPass = true;
                break;
            }
        }
        if (isPass == false) {
            return;
        }
        info.hook[kind] = count;
        await this.update(info);
    }
    /**
     * 获取红点
     */
    async getRed() {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        //遍历所有任务 看下有没完成未领取任务
        let info = await this.getInfo();
        //遍历配置表任务
        for (const id in cfg.data.list) {
            if (info.rwds[id] == null && //未领取
                info.hook[cfg.data.list[id].kind] != null && //已达成
                info.hook[cfg.data.list[id].kind] >= cfg.data.list[id].need) {
                return 1;
            }
        }
        return 0;
    }
    /**
     * 领取奖励
     */
    async rwd(id) {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        let info = await this.getInfo();
        //遍历配置表任务
        if (info.rwds[id] != null) {
            this.ctx.throw("已领取");
        }
        if (info.hook[cfg.data.list[id].kind] == null || //未达成
            info.hook[cfg.data.list[id].kind] < cfg.data.list[id].need) {
            this.ctx.throw("未达成");
        }
        //记录领取
        info.rwds[id] = this.ctx.state.newTime;
        await this.update(info, ["outf", "red"]);
        //加上奖励
        await this.ctx.state.master.addItem2(cfg.data.list[id].rwd);
    }
}
exports.HdTimeActModel = HdTimeActModel;
//# sourceMappingURL=HdTimeActModel.js.map