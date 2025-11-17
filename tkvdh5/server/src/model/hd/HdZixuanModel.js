"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HdZixuanModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const gameMethod_1 = require("../../../common/gameMethod");
/**
 * 活动 自选礼包
 */
class HdZixuanModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdZixuan"; //用于存储key 和  输出1级key
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
    outKey2() {
        return this.hdcid; //输出2级key
    }
    //初始化
    init() {
        return {
            hdid: "",
            list: {}
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        let cfg = await this.getHdCfg();
        if (cfg != null && cfg.info.id != info.hdid) {
            info = this.init();
            info.hdid = cfg.info.id;
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
        return 0;
    }
    /**
     * 获取红点
     */
    async select(cs) {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            this.ctx.throw("活动已结束");
        }
        let info = await this.getInfo();
        for (const c of cs) {
            let dc1 = c[0];
            let dc2 = c[1];
            let xb = c[2];
            if (cfg.data.list[dc1] == null || cfg.data.list[dc1].items[dc2] == null) {
                this.ctx.throw("参数错误");
            }
            let kuid = cfg.data.list[dc1].items[dc2].ku;
            if (kuid == "") {
                this.ctx.throw("参数错误!");
            }
            if (cfg.data.list[dc1].ku[kuid] == null) {
                this.ctx.throw("kuid配置错误" + kuid);
            }
            if (cfg.data.list[dc1].ku[kuid][xb] == null) {
                this.ctx.throw("参数错误!!");
            }
            if (info.list[dc1] == null) {
                info.list[dc1] = {
                    items: {},
                    buy: 0
                };
            }
            info.list[dc1].items[dc2] = gameMethod_1.gameMethod.objCopy(cfg.data.list[dc1].ku[kuid][xb]);
        }
        await this.update(info, ["outf", "red"]);
    }
    /**
     * 领取免费礼包
     */
    async mianfei(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动已结束");
        }
        if (cfg.data.list[dc].need.length > 0) {
            await this.ctx.state.master.subItem1(cfg.data.list[dc].need);
        }
        let info = await this.getInfo();
        if (info.list[dc] == null) {
            info.list[dc] = {
                items: {},
                buy: 0
            };
        }
        if (info.list[dc].buy >= cfg.data.list[dc].limit) {
            this.ctx.throw("今日已无购买次数");
        }
        let items = [];
        for (const dc2 in cfg.data.list[dc].items) {
            if (cfg.data.list[dc].items[dc2].ku == "") {
                items.push(cfg.data.list[dc].items[dc2].item);
                continue;
            }
            if (info.list[dc] == null || info.list[dc].items[dc2].length <= 0) {
                this.ctx.throw("未选择购买的商品");
            }
            items.push(info.list[dc].items[dc2]);
        }
        await this.ctx.state.master.addItem2(items);
        info.list[dc].buy += 1;
        await this.update(info, ['outf', 'red']);
    }
    /**
     * 充值下单检查
     */
    async checkUp(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动已结束");
        }
        if (cfg.data.list[dc] == null || cfg.data.list[dc].need[0] != 10) {
            this.ctx.throw("不是充值档次");
        }
        let info = await this.getInfo();
        if (info.list[dc] != null && info.list[dc].buy >= cfg.data.list[dc].limit) {
            this.ctx.throw("今日已无购买次数");
        }
        for (const dc2 in cfg.data.list[dc].items) {
            if (cfg.data.list[dc].items[dc2].ku == "") {
                continue;
            }
            if (info.list[dc] == null || info.list[dc].items[dc2].length <= 0) {
                this.ctx.throw("未选择购买的商品");
            }
        }
        return {
            type: 1,
            msg: cfg.data.list[dc].name,
            data: cfg.data.list[dc].need[1],
            kind10Cs: this.kid + "_" + this.hdcid + "_" + dc + "_" + cfg.data.list[dc].need[1]
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
                msg: "充值活动已关闭",
                data: null
            };
        }
        let info = await this.getInfo();
        if (info.list[dc] == null) {
            info.list[dc] = {
                items: {},
                buy: 0
            };
        }
        let items = [];
        for (const dc2 in cfg.data.list[dc].items) {
            if (cfg.data.list[dc].items[dc2].ku == "") {
                items.push(cfg.data.list[dc].items[dc2].item);
                continue;
            }
            if (info.list[dc] == null || info.list[dc].items[dc2].length <= 0) {
                return {
                    type: 0,
                    msg: "领取奖励失败",
                    data: null
                };
            }
            items.push(info.list[dc].items[dc2]);
        }
        await this.ctx.state.master.addItem2(items);
        info.list[dc].buy += 1;
        await this.update(info, ['outf', 'red']);
        return {
            type: 1,
            msg: "充值成功",
            data: cfg.data.list[dc].need[1]
        };
    }
}
exports.HdZixuanModel = HdZixuanModel;
//# sourceMappingURL=HdZixuanModel.js.map