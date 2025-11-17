"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HdDayTeJiaModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
/**
 * 每日特价
 */
class HdDayTeJiaModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdDayTeJia"; //用于存储key 和  输出1级key
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
            outTime: 0,
            list: {},
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
        if (info.outTime < this.ctx.state.new0) {
            info.outTime = this.ctx.state.newTime;
            info.list = {};
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
     * 领奖
     * @param id
     */
    async rwd(dc) {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        let info = await this.getInfo();
        if (info.list[dc] == null) {
            info.list[dc] = 0;
        }
        if (info.list[dc] >= cfg.data.list[dc].limit) {
            this.ctx.throw("今日无购买次数");
        }
        info.list[dc] += 1;
        await this.update(info, ['outf', 'red']);
        if (cfg.data.list[dc].need.length > 0) {
            await this.ctx.state.master.subItem1(cfg.data.list[dc].need);
        }
        await this.ctx.state.master.addItem2(cfg.data.list[dc].items);
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
        for (const dc in cfg.data.list) {
            if (cfg.data.list[dc].need.length > 0) {
                continue;
            }
            if (info.list[dc] == null) {
                return 1;
            }
        }
        return 0;
    }
    /**
     * 充值下单检查
     */
    async checkUp(dc) {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        let czdc = 0;
        let info = await this.getInfo();
        if (dc == "0") {
            for (const _dc of cfg.data.yijian.ids) {
                if (info.list[_dc] == null) {
                    info.list[_dc] = 0;
                }
                if (info.list[_dc] >= cfg.data.list[_dc].limit) {
                    this.ctx.throw("今日无购买次数");
                }
            }
            czdc = cfg.data.yijian.need[1];
        }
        else {
            if (info.list[dc] == null) {
                info.list[dc] = 0;
            }
            if (info.list[dc] >= cfg.data.list[dc].limit) {
                this.ctx.throw("今日无购买次数");
            }
            czdc = cfg.data.list[dc].need[1];
        }
        return {
            type: 1,
            msg: cfg.info.title + dc,
            data: czdc
        };
    }
    /**
     * 充值成功后执行
     */
    async carryOut(dc) {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        let czdc = 0;
        let info = await this.getInfo();
        if (dc == "0") {
            for (const _dc of cfg.data.yijian.ids) {
                if (info.list[_dc] == null) {
                    info.list[_dc] = 0;
                }
                if (info.list[_dc] >= cfg.data.list[_dc].limit) {
                    this.ctx.throw("今日无购买次数");
                }
                info.list[_dc] += 1;
                await this.ctx.state.master.addItem2(cfg.data.list[_dc].items);
            }
            czdc = cfg.data.yijian.need[1];
        }
        else {
            if (info.list[dc] == null) {
                info.list[dc] = 0;
            }
            info.list[dc] += 1;
            await this.ctx.state.master.addItem2(cfg.data.list[dc].items);
            czdc = cfg.data.list[dc].need[1];
        }
        await this.update(info, ['outf', 'red']);
        return {
            type: 1,
            msg: "充值成功",
            data: czdc
        };
    }
}
exports.HdDayTeJiaModel = HdDayTeJiaModel;
//# sourceMappingURL=HdDayTeJiaModel.js.map