"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActRwdOptModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const tool_1 = require("../../util/tool");
/**
 * 杂项领奖记录  - 要输出
 */
class ActRwdOptModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actRwdOpt"; //用于存储key 和  输出1级key
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
            club_fp: 0,
            club_chat: 0,
        };
    }
    async getOutPut() {
        let info = await this.getInfo();
        return info;
    }
    /**
     * 公会防骗领奖
     */
    async club_fp() {
        //奖励配置
        let cfg_items = tool_1.tool.mathcfg_items(this.ctx, "rwd_club_fp");
        let info = await this.getInfo();
        if (info.club_fp > 0) {
            this.ctx.throw("已经领取");
        }
        //记录领奖
        info.club_fp = this.ctx.state.newTime;
        //发奖励
        await this.ctx.state.master.addItem2(cfg_items);
        await this.update(info);
    }
    /**
     * 公会聊天防骗领奖
     */
    async club_chat() {
        //奖励配置
        let cfg_items = tool_1.tool.mathcfg_items(this.ctx, "rwd_club_chat");
        let info = await this.getInfo();
        if (info.club_chat > 0) {
            this.ctx.throw("已经领取");
        }
        //记录领奖
        info.club_chat = this.ctx.state.newTime;
        //发奖励
        await this.ctx.state.master.addItem2(cfg_items);
        await this.update(info);
    }
}
exports.ActRwdOptModel = ActRwdOptModel;
//# sourceMappingURL=ActRwdOptModel.js.map