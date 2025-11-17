"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActItemModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const hook_1 = require("../../util/hook");
const setting_1 = __importDefault(require("../../crontab/setting"));
const HdChouModel_1 = require("../hd/HdChouModel");
const HdLunHuiModel_1 = require("../hd/HdLunHuiModel");
/**
 * 道具存储
 */
class ActItemModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actItem"; //用于存储key 和  输出1级key
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
        return {};
    }
    /**
     * 返回数据
     */
    async getOutPut() {
        let info = await this.getInfo();
        return info;
    }
    /**
     *  添加道具
     */
    async add(itemid, count) {
        let info = await this.getInfo();
        if (info[itemid.toString()] == null) {
            info[itemid.toString()] = 0;
        }
        info[itemid.toString()] += count;
        await this.update(info, [itemid.toString()]);
        this.ctx.state.master.addLog(this.hdcid, itemid, count, info[itemid.toString()]);
        if (this.hdcid == "1" && itemid == 802) {
            //活动 - 九龙秘宝
            let cfgHdChou = setting_1.default.getHuodong2(await this.getHeIdByUuid(this.id), "hdChou");
            if (cfgHdChou != null) {
                for (const _hdcid in cfgHdChou) {
                    let hdChouModel = HdChouModel_1.HdChouModel.getInstance(this.ctx, this.id, _hdcid);
                    await hdChouModel.backData_u(["red"]);
                }
            }
        }
    }
    /**
     *  扣除道具
     */
    async sub(itemid, count, isCheck = false) {
        let info = await this.getInfo();
        if (info[itemid.toString()] == null) {
            info[itemid.toString()] = 0;
        }
        if (info[itemid.toString()] < count) {
            if (isCheck) {
                return false;
            }
            this.ctx.throw("道具不足");
        }
        if (isCheck) {
            return true;
        }
        info[itemid.toString()] -= count;
        await this.update(info, [itemid.toString()]);
        this.ctx.state.master.addLog(this.hdcid, itemid, -count, info[itemid.toString()]);
        if (this.hdcid == "1" && itemid == 1) {
            await hook_1.hookNote(this.ctx, "subItem1_1", count);
        }
        //天道轮回 累计道具消耗 钩子
        await HdLunHuiModel_1.HdLunHuiModel.clickSubItem(this.ctx, this.id, [Number(this.hdcid), itemid, count]);
        return true;
    }
    /**
     * 获取道具数量
     */
    async getCount(itemid) {
        let info = await this.getInfo();
        if (info[itemid.toString()] == null) {
            return 0;
        }
        return info[itemid.toString()];
    }
    /**
     *  设置道具数据
     */
    async setItem(itemid, count) {
        let info = await this.getInfo();
        if (info[itemid.toString()] == null) {
            info[itemid.toString()] = 0;
        }
        info[itemid.toString()] = count;
        await this.update(info, [itemid.toString()]);
    }
}
exports.ActItemModel = ActItemModel;
//# sourceMappingURL=ActItemModel.js.map