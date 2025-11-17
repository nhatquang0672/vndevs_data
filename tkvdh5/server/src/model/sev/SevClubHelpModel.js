"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SevClubHelpModel = void 0;
const master_1 = require("../../util/master");
const AModel_1 = require("../AModel");
const cache_1 = __importDefault(require("../../util/cache"));
const SevAdokClubModel_1 = require("./SevAdokClubModel");
const ActBoxModel_1 = require("../act/ActBoxModel");
const lock_1 = __importDefault(require("../../util/lock"));
const ActFuShiModel_1 = require("../act/ActFuShiModel");
/**
 * 公会助力
 */
class SevClubHelpModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "sev"; //数据库表名
        this.kid = "clubHelp"; //用于存储key 和  输出1级key
        this.outIsAu = true; //下发数据是否用au下发
        this.dType = master_1.DataType.sev;
    }
    static getInstance(ctx, clubId, hdcid = "1") {
        let dlKey = this.name + "_" + clubId + "_" + hdcid; //单例模式key
        if (!ctx.state.model[dlKey]) {
            ctx.state.model[dlKey] = new this(ctx, clubId, hdcid);
        }
        return ctx.state.model[dlKey];
    }
    outKey2() {
        return ""; //输出2级key
    }
    init() {
        return {
            list: {},
            lid: 0,
            outTime: 0,
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        //每日重置时间
        if (info.outTime < this.ctx.state.newTime) {
            info.list = {};
            info.outTime = this.ctx.state.new0 + 86400;
            await this.update(info);
        }
        return info;
    }
    async update(info, keys = []) {
        await super.update(info, keys);
        //通知adok 更新
        let sevAdokClubModel = SevAdokClubModel_1.SevAdokClubModel.getInstance(this.ctx, this.id);
        await sevAdokClubModel.setVer("clubHelp");
    }
    //公会成员XX
    async getOutPut() {
        let info = await this.getInfo();
        let opt = {};
        for (const lid in info.list) {
            let task = info.list[lid];
            //构造帮助表
            let helps = {};
            for (const huuid in task.helps) {
                helps[huuid] = {
                    user: await cache_1.default.getFUser(this.ctx, huuid, 1),
                    time: task.helps[huuid].time,
                };
            }
            opt[lid] = {
                id: lid,
                user: await cache_1.default.getFUser(this.ctx, task.uuid, 1),
                type: task.type,
                helps: helps,
                cars: task.cars,
                // qtimes: task.qtimes, //已加速时长:
                otime: task.otime,
            };
        }
        return opt;
    }
    /**
     * 帮助
     * @param uuid  帮助人
     * @param id  任务id
     * @param times  加速时长
     */
    async helpTask(uuid, id) {
        let info = await this.getInfo();
        //本任务信息
        let task = info.list[id];
        if (task == null) {
            this.ctx.throw("iderr:" + id);
        }
        if (task.uuid == uuid) {
            this.ctx.throw("不能给自己互助");
        }
        //任务已完成
        if (task.otime < this.ctx.state.newTime) {
            this.ctx.throw("任务已完成");
        }
        if (task.helps[uuid] != null) {
            this.ctx.throw("已经助力过了");
        }
        task.helps[uuid] = {
            time: this.ctx.state.newTime,
        };
        // task.qtimes += times; //加速时长
        await this.update(info, [""]);
        //执行助力
        if (task.type == "box") {
            await lock_1.default.setLock(this.ctx, "user", task.uuid); //枷锁
            this.ctx.state.fuuid = task.uuid; //操作他人 开始
            let factBoxModel = ActBoxModel_1.ActBoxModel.getInstance(this.ctx, task.uuid);
            await factBoxModel.clubZhuLi();
            this.ctx.state.fuuid = ""; //操作他人 结束
        }
        else if (task.type == "boxStep") {
            await lock_1.default.setLock(this.ctx, "user", task.uuid); //枷锁
            this.ctx.state.fuuid = task.uuid; //操作他人 开始
            let factBoxModel = ActBoxModel_1.ActBoxModel.getInstance(this.ctx, task.uuid);
            await factBoxModel.clubZhuLi();
            this.ctx.state.fuuid = ""; //操作他人 结束
        }
        else if (task.type == "fushi") {
            await lock_1.default.setLock(this.ctx, "user", task.uuid); //枷锁
            this.ctx.state.fuuid = task.uuid; //操作他人 开始
            let actFuShiModel = ActFuShiModel_1.ActFuShiModel.getInstance(this.ctx, task.uuid);
            await actFuShiModel.clubZhuLi();
            this.ctx.state.fuuid = ""; //操作他人 结束
        }
        else {
            this.ctx.throw("helpTask_type_err:" + task.type);
        }
    }
    /**
     * 新增条目
     */
    async add(task) {
        let info = await this.getInfo();
        info.lid += 1;
        info.list[info.lid] = task;
        await this.update(info, [""]);
        return info.lid.toString();
    }
}
exports.SevClubHelpModel = SevClubHelpModel;
//# sourceMappingURL=SevClubHelpModel.js.map