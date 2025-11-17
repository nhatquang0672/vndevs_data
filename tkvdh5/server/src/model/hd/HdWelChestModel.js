"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HdWelChestModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
/**
 * 5分钟一个，每天最多6个， 可以广告领 可以直接领取
 */
/**
 * 活动 福利宝箱
 * HdWelChestModel
 */
class HdWelChestModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdWelChest"; //用于存储key 和  输出1级key
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
            rwdnum: 0,
            rtime: 0,
            outTime: 0,
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        let cfg = (await this.getHdCfg());
        if (cfg != null && cfg.info.id != info.hdid) {
            info = this.init();
            info.hdid = cfg.info.id;
        }
        //每日重置
        if (this.ctx.state.newTime > info.outTime) {
            info.rwdnum = 0; //今天领过几个了
            info.rtime = 0; //下个刷出来时间
            info.outTime = this.ctx.state.new0 + 86400;
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
                return {
                    rwdnum: info.rwdnum,
                    rtime: info.rtime,
                    outTime: info.outTime,
                };
        }
        return null;
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
        //时间到了没
        if (info.rtime > this.ctx.state.newTime) {
            return 0;
        }
        //本日上限未到
        if (info.rwdnum >= cfg.data.dnum) {
            return 0;
        }
        return 1;
    }
    /**
     * 广告下单检查
     */
    async checkUp() {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        let info = await this.getInfo();
        //时间到了没
        if (info.rtime > this.ctx.state.newTime) {
            this.ctx.throw("时间还没到");
        }
        //本日上限未到
        if (info.rwdnum >= cfg.data.dnum) {
            this.ctx.throw("今天已经领完");
        }
        return {
            type: 1,
            msg: "福利宝箱",
            data: null
        };
    }
    /**
     * 领取
     * //广告领取 或者 花钱领取
     *
     */
    async rwd(ad) {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        let info = await this.getInfo();
        //时间到了没
        if (info.rtime > this.ctx.state.newTime) {
            this.ctx.throw("时间还没到");
        }
        //本日上限未到
        if (info.rwdnum >= cfg.data.dnum) {
            this.ctx.throw("今天已经领完");
        }
        //设置领取次数
        info.rwdnum += 1;
        //设置下次时间
        info.rtime = this.ctx.state.newTime + cfg.data.cd;
        await this.update(info, ["outf", "red"]);
        if (ad <= 0) {
            //没看广告 扣除需求
            await this.ctx.state.master.subItem1(cfg.data.need);
        }
        //加上奖励
        await this.ctx.state.master.addItem2(cfg.data.rwd);
        return {
            type: 1,
            msg: "福利宝箱广告加速成功",
            data: null
        };
    }
}
exports.HdWelChestModel = HdWelChestModel;
//# sourceMappingURL=HdWelChestModel.js.map