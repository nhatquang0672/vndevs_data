"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HdEquipShopModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const MailModel_1 = require("../user/MailModel");
const gameMethod_1 = require("../../../common/gameMethod");
/**
 * 活动 装备商人
 */
class HdEquipShopModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdEquipShop"; //用于存储key 和  输出1级key
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
            cons: 0,
            sAt: 0,
            rwd: 0,
            isOver: 0,
            redAt: 0
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        let cfg = await this.getHdCfg();
        if (cfg != null && cfg.info.id != info.hdid) {
            info = this.init();
            info.hdid = cfg.info.id;
        }
        //如果未启动 并且 注册时间 > 配置的启动时间 并且 等级达到
        if (info.sAt == 0 && this.ctx.state.regtime >= cfg.data.regtime && this.ctx.state.level >= cfg.data.userLv) {
            info.sAt = this.ctx.state.newTime; //设置启动时间
            await this.update(info, ['outf']);
        }
        return info;
    }
    /**
     * 检测解锁
     * @param level
     */
    async lock(level) {
        let info = await super.getInfo();
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            return null;
        }
        if (info.sAt > 0) {
            return;
        }
        if (this.ctx.state.regtime < cfg.data.regtime) {
            return;
        }
        //输出
        if (level == cfg.data.userLv) {
            await this.backData();
        }
    }
    /**
     * 返回数据
     */
    async getOutPut() {
        let cfgInfo = await this.getOutPut_u("info");
        if (cfgInfo == null || this.ctx.state.newTime > cfgInfo.dAt) {
            return null;
        }
        let info = await this.getInfo();
        if (info.sAt == 0) {
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
        let info = await this.getInfo();
        let cfgInfo = gameMethod_1.gameMethod.objCopy(cfg["info"]);
        if (info.sAt > 0) {
            if (info.rwd == 1) {
                //已领取 就把活动显示关闭
                cfgInfo.eAt = this.ctx.state.newTime - 1;
                cfgInfo.dAt = this.ctx.state.newTime - 1;
            }
            else {
                //未发邮件 并且时间已经过去48 小时
                if (info.isOver != 1 && this.ctx.state.newTime >= info.sAt + 3600 * 48) {
                    info.isOver = 1;
                    info.rwd = 1;
                    let maxPer = 0;
                    for (const dc in cfg.data.list) {
                        if (info.cons >= cfg.data.list[dc].need) {
                            maxPer = Math.max(maxPer, cfg.data.list[dc].fhPer);
                        }
                    }
                    let count = Math.floor(info.cons * maxPer / 100);
                    count = Math.min(count, cfg.data.max);
                    if (count > 0) {
                        let mailModel = MailModel_1.MailModel.getInstance(this.ctx, this.id);
                        await mailModel.sendMail("装备商人活动奖励", "装备商人活动结束，您有奖励尚未领取，请及时领取奖励。", [[1, 2, count]], 1, info.sAt + 3600 * 48);
                    }
                    await this.update(info, [""]);
                    cfgInfo.eAt = this.ctx.state.newTime - 1;
                    cfgInfo.dAt = this.ctx.state.newTime - 1;
                }
                else {
                    cfgInfo.sAt = info.sAt;
                    cfgInfo.eAt = info.sAt + 3600 * 24;
                    cfgInfo.dAt = info.sAt + 3600 * 48 - 1;
                }
            }
        }
        switch (key) {
            case "info":
                return cfgInfo;
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
        if (info.sAt == 0) {
            return 0;
        }
        if (info.redAt < this.ctx.state.new0) {
            return 1;
        }
        if (this.ctx.state.newTime > info.sAt + cfg.data.days * 3600 && info.rwd != 1) {
            return 1;
        }
        return 0;
    }
    /**
     * 增加进度
     */
    async addCons(count) {
        let info = await this.getInfo();
        if (info.sAt == 0) {
            return;
        }
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            return;
        }
        if (this.ctx.state.newTime > info.sAt + cfg.data.days * 3600) {
            return;
        }
        info.cons += count;
        await this.update(info, ['outf']);
    }
    /**
     * 领取金币
     */
    async into() {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            return;
        }
        let info = await this.getInfo();
        if (info.redAt < this.ctx.state.new0) {
            info.redAt = this.ctx.state.new0 + 86400 * 999;
            await this.update(info, ['red']);
        }
    }
    /**
     * 领取金币
     */
    async rwd() {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            this.ctx.throw("活动未开启！");
        }
        let info = await this.getInfo();
        if (info.rwd == 1) {
            this.ctx.throw("已经领取");
        }
        if (info.sAt == 0) {
            this.ctx.throw("活动未开启");
        }
        if (this.ctx.state.newTime <= info.sAt + 24 * 3600) {
            this.ctx.throw("活动结束后可领取");
        }
        info.rwd = 1;
        await this.update(info, ['info', 'outf', 'red']);
        let maxPer = 0;
        for (const dc in cfg.data.list) {
            if (info.cons >= cfg.data.list[dc].need) {
                maxPer = Math.max(maxPer, cfg.data.list[dc].fhPer);
            }
        }
        let count = Math.floor(info.cons * maxPer / 100);
        count = Math.min(count, cfg.data.max);
        if (count > 0) {
            await this.ctx.state.master.addItem1([1, 2, count]);
        }
    }
}
exports.HdEquipShopModel = HdEquipShopModel;
//# sourceMappingURL=HdEquipShopModel.js.map