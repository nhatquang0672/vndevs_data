"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActDingYueModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const Weixin_1 = __importDefault(require("../../sdk/Weixin"));
const tool_1 = require("../../util/tool");
const cache_1 = __importDefault(require("../../util/cache"));
/**
 * 订阅
 */
class ActDingYueModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actDingYue"; //用于存储key 和  输出1级key
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
     * 设置open
     */
    async setOpen(id, val) {
        let info = await this.getInfo();
        if (info[id] == null) {
            info[id] = {
                open: 1,
                dy: 0,
            };
        }
        info[id].open = val;
        await this.update(info);
    }
    /**
     * 设置dy
     */
    async setDy(ids) {
        let info = await this.getInfo();
        for (const id of ids) {
            if (info[id] == null) {
                info[id] = {
                    open: 1,
                    dy: 0,
                };
            }
            info[id].dy = 1;
        }
        await this.update(info);
        //签到提醒
        if (ids.indexOf("2") != -1) {
            await this.saveDy("2", this.ctx.state.new0 + 86400, []);
        }
        //版本更新提醒
        if (ids.indexOf("3") != -1) {
            await this.saveDy("3", this.ctx.state.new0 + 86400 * 30, []);
        }
        //斗法排行榜
        if (ids.indexOf("5") != -1) {
            await this.saveDy("5", this.ctx.state.new0 + 86400, [this.id, await this.getHeIdByUuid(this.id)]);
        }
    }
    /**
     * 推送
     * @param id 配置表序号ID
     */
    async sendDy(id, cs) {
        let info = await this.getInfo();
        if (info[id] == null || info[id].dy != 1) {
            return; //没用订阅不管
        }
        info[id].dy = 0;
        await this.update(info);
        let fuser = await cache_1.default.getFUser(this.ctx, this.id);
        Weixin_1.default.dingYueSend(fuser.uid, id, cs);
    }
    /**
     * 延迟推送
     * @param id 配置表序号ID
     */
    async saveDy(id, doAt, cs) {
        let info = await this.getInfo();
        if (info[id] == null || info[id].dy != 1) {
            return; //没用订阅不管
        }
        tool_1.tool.updateTimer(this.ctx.state.sid, "dingyue", this.id, id, doAt, cs);
    }
}
exports.ActDingYueModel = ActDingYueModel;
//# sourceMappingURL=ActDingYueModel.js.map