"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActInviteModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const tool_1 = require("../../util/tool");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const hook_1 = require("../../util/hook");
//每日分享 1/0/1  分享 //今日分享次数
//每日分享 0/1/1  领取 //今日领奖次数
//每日分享 1/1/1  分享 //
/**
 * 邀请
 * 1: 每日发群邀请
 * 2: 邀请好友
 * 3: 发群邀请 自己点进
 */
class ActInviteModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actInvite"; //用于存储key 和  输出1级key
        this.outIsAu = false; //下发数据是否用au下发
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
        return ""; //输出2级key
    }
    //初始化
    init() {
        return {
            //功能1: 每日分享
            daily: {
                send: 0,
                rwd: 0,
            },
            //功能2: 发群 群点进来
            group: {
                send: 0,
                rwd: 0,
            },
            //功能3: 好友任务
            invs: {
                uids: {},
                rwds: {},
            },
            outTime: 0,
            ver: 1
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        //每日重置
        if (this.ctx.state.newTime > info.outTime) {
            info.daily.send = 0;
            info.daily.rwd = 0;
            info.outTime = this.ctx.state.new0 + 86400;
        }
        if (info.ver != 1) {
            info.ver = 1;
            info.invs.uids = {};
            info.invs.rwds = {};
        }
        return info;
    }
    async getOutPut() {
        let info = await this.getInfo();
        return info;
    }
    //完成了每日分享
    async daily_send() {
        let info = await this.getInfo();
        if (info.daily.send < tool_1.tool.mathcfg_count(this.ctx, `invite_dailyNum`)) {
            info.daily.send += 1;
            await this.update(info);
            await hook_1.hookNote(this.ctx, "fenxiang", 1);
        }
    }
    //领取每日分享奖励
    async daily_rwd() {
        let info = await this.getInfo();
        if (info.daily.send <= info.daily.rwd) {
            this.ctx.throw("已经领取");
        }
        info.daily.rwd += 1;
        await this.update(info);
        //加上奖励
        let items = tool_1.tool.mathcfg_items(this.ctx, `invite_dailyRwd`);
        await this.ctx.state.master.addItem2(items);
    }
    //发群点进来
    async group_send() {
        let info = await this.getInfo();
        info.group.send = this.ctx.state.newTime;
        await this.update(info);
        await hook_1.hookNote(this.ctx, "fenxiang", 1);
    }
    //领取发群奖励
    async group_rwd() {
        let info = await this.getInfo();
        if (info.group.send < this.ctx.state.new0) {
            this.ctx.throw("还没发");
        }
        if (info.group.rwd >= this.ctx.state.new0) {
            this.ctx.throw("已经领过");
        }
        //记录领奖时间
        info.group.rwd = this.ctx.state.newTime;
        await this.update(info);
        //加上发群奖励
        let items = tool_1.tool.mathcfg_items(this.ctx, `invite_groupRwd`);
        await this.ctx.state.master.addItem2(items);
    }
    //好友完成触发
    async invs_add(uid) {
        let info = await this.getInfo();
        if (info.invs.uids[uid] == null) {
            info.invs.uids[uid] = this.ctx.state.newTime;
            await this.update(info);
        }
    }
    //好友系列
    async invs_rwd(id) {
        let info = await this.getInfo();
        //配置表获取
        let inviteGame = gameCfg_1.default.inviteGame.getItemCtx(this.ctx, id);
        if (info.invs.rwds[id] != null) {
            this.ctx.throw("已领取");
        }
        //当前邀请人数
        if (Object.keys(info.invs.uids).length < inviteGame.need) {
            this.ctx.throw("未完成");
        }
        //记录领取
        info.invs.rwds[id] = this.ctx.state.newTime;
        await this.update(info);
        await this.ctx.state.master.addItem2(inviteGame.rwd);
    }
}
exports.ActInviteModel = ActInviteModel;
//# sourceMappingURL=ActInviteModel.js.map