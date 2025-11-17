"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HdChongBangModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const ActPveInfoModel_1 = require("../act/ActPveInfoModel");
const RdsUserModel_1 = require("../redis/RdsUserModel");
/**
 * 活动 冲榜
 */
class HdChongBangModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdChongbang"; //用于存储key 和  输出1级key
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
            isOpen: 0,
            cons: 0,
            bug: 1,
            rwd: {} //领取档次奖励
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        let cfg = await this.getHdCfg();
        if (cfg != null && cfg.info.id != info.hdid) {
            info = this.init();
            info.hdid = cfg.info.id;
        }
        if (info.rwd == null) {
            info.rwd = {};
        }
        if (info.bug != 1 && parseInt(this.ctx.state.sid) < 75) {
            info.bug = 1;
            if (info.cons > 0) {
                let rdsUserModel_rdsHdCb = await new RdsUserModel_1.RdsUserModel("rdsHdChongBang", this.hdcid, await this.getHeIdByUuid(this.id), cfg.info.id);
                await rdsUserModel_rdsHdCb.zSet(this.id, info.cons);
            }
            await this.update(info);
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
    async isOpenHd() {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            return null;
        }
        let info = await this.getInfo();
        if (info.isOpen == 1) {
            return null;
        }
        let actPveInfoModel = ActPveInfoModel_1.ActPveInfoModel.getInstance(this.ctx, this.id);
        let actPveInfo = await actPveInfoModel.getInfo();
        info.isOpen = 1;
        info.cons = actPveInfo.id - 1;
        await this.update(info);
        //加入排行榜
        if (info.cons > 0) {
            let rdsUserModel_rdsHdCb = await new RdsUserModel_1.RdsUserModel("rdsHdChongBang", this.hdcid, await this.getHeIdByUuid(this.id), cfg.info.id);
            await rdsUserModel_rdsHdCb.zSet(this.id, info.cons);
        }
    }
    async addHook(id) {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            return null;
        }
        let info = await this.getInfo();
        if (info.isOpen != 1) {
            return null;
        }
        info.cons = id;
        await this.update(info, [""]);
        //加入排行榜
        if (info.cons > 0) {
            let rdsUserModel_rdsHdCb = await new RdsUserModel_1.RdsUserModel("rdsHdChongBang", this.hdcid, await this.getHeIdByUuid(this.id), cfg.info.id);
            await rdsUserModel_rdsHdCb.zSet(this.id, info.cons);
        }
    }
    async rwd(id) {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            return null;
        }
        let info = await this.getInfo();
        if (info.rwd[id] != null) {
            this.ctx.throw("已经领取");
        }
        if (cfg.data.rwd[id] == null) {
            this.ctx.throw("参数错误");
        }
        info.rwd[id] = this.ctx.state.newTime;
        await this.update(info, ['outf', 'red']);
        await this.ctx.state.master.addItem2(cfg.data.rwd[id].items);
    }
}
exports.HdChongBangModel = HdChongBangModel;
//# sourceMappingURL=HdChongBangModel.js.map