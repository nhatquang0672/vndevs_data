"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HdPriCardModel = void 0;
const AModel_1 = require("../AModel");
const Xys = __importStar(require("../../../common/Xys"));
const master_1 = require("../../util/master");
const game_1 = __importDefault(require("../../util/game"));
const lock_1 = __importDefault(require("../../util/lock"));
const SevPaoMaModel_1 = require("../sev/SevPaoMaModel");
const SevChatModel_1 = require("../sev/SevChatModel");
const UserModel_1 = require("../user/UserModel");
const ActTaskMainModel_1 = require("../act/ActTaskMainModel");
const cache_1 = __importDefault(require("../../util/cache"));
//每天手动领取
//过期时间
//过天不管 不补发
//获取当前特权状态
/**
 * 活动 特权卡
 * HdPriCardModel
 */
class HdPriCardModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdPriCard"; //用于存储key 和  输出1级key
        this.outIsAu = true; //下发数据是否用au下发
        this.dType = master_1.DataType.user;
    }
    //单例模式
    static getInstance(ctx, uuid, hdcid) {
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
            btime: 0,
            rtime: 0,
            mdAt: 0 //埋点控制（每日刷一次）
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        let cfg = (await this.getHdCfg());
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
                    btime: info.btime,
                    rtime: game_1.default.getToDay_0(info.rtime) + 86400,
                };
        }
        return null;
    }
    /**
     * 获取特权是否有效中
     */
    async isHave() {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            return false;
        }
        let info = await this.getInfo();
        if (info.btime == 0) {
            return false;
        }
        if (info.btime > 0 && this.ctx.state.newTime > info.btime) {
            return false;
        }
        return true;
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
        if (info.btime == 0) {
            return 0;
        }
        if (info.btime > 0 && this.ctx.state.newTime > info.btime) {
            return 0;
        }
        if (info.rtime >= this.ctx.state.new0) {
            return 0;
        }
        return 1;
    }
    /**
     * 领取
     */
    async rwd() {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        let info = await this.getInfo();
        if (info.btime == 0) {
            this.ctx.throw("未购买");
        }
        if (info.btime > 0 && this.ctx.state.newTime > info.btime) {
            this.ctx.throw("已过期");
        }
        if (info.rtime >= this.ctx.state.new0) {
            this.ctx.throw("今天已经领取了");
        }
        //领取
        info.rtime = this.ctx.state.newTime;
        await this.update(info, ["outf", "red"]);
        //发送每日奖励
        await this.ctx.state.master.addItem2(cfg.data.card.dayRwd);
    }
    /**
     * 充值下单检查
     */
    async checkUp() {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        let info = await this.getInfo();
        if (info.btime < 0) {
            //永久生效类型 不允许重复购买
            this.ctx.throw("已购买");
        }
        if (cfg.data.card.need[0] != 10) {
            this.ctx.throw("参数错误");
        }
        return {
            type: 1,
            msg: cfg.info.title,
            data: cfg.data.card.need[1],
            kind10Cs: this.kid + "_" + this.hdcid + "_" + "1" + "_" + cfg.data.card.need[1]
        };
    }
    /**
     * 充值成功后执行
     */
    async carryOut() {
        let cfg = (await this.getHdCfg());
        if (cfg == null) {
            return {
                type: 0,
                msg: "充值失败",
                data: null,
            };
        }
        let info = await this.getInfo();
        if (cfg.data.card.days > 0) {
            if (info.btime > this.ctx.state.newTime) {
                //未到期 天数加上
                info.btime += cfg.data.card.days * 86400;
            }
            else {
                //从今天0点开始算
                info.btime = this.ctx.state.new0 + cfg.data.card.days * 86400;
            }
        }
        else {
            //永久类型
            info.btime = -1;
        }
        await this.update(info, ["outf", "red"]);
        //加上奖励
        await this.ctx.state.master.addItem2(cfg.data.card.rwd);
        if (this.hdcid == "fever") {
            // let actDongTianModel = ActDongTianModel.getInstance(this.ctx,this.id)
            // await actDongTianModel.zsfBuyTq()
        }
        let chatMgs = "";
        let chatType = "1";
        let heid = await this.getHeIdByUuid(this.id);
        await lock_1.default.setLock(this.ctx, "paoma", heid); //枷锁
        let sevPaoMaModel = SevPaoMaModel_1.SevPaoMaModel.getInstance(this.ctx, heid);
        if (this.hdcid == "moon") {
            await sevPaoMaModel.addList("6", [this.ctx.state.name]);
            chatMgs = this.ctx.state.name + "购买了月卡，畅享月卡特权";
            chatType = "6";
        }
        if (this.hdcid == "fever") {
            await sevPaoMaModel.addList("7", [this.ctx.state.name]);
            chatMgs = this.ctx.state.name + "购买了终身卡，尊享终身卡特权";
            chatType = "7";
        }
        if (this.hdcid == "fushi") {
            await sevPaoMaModel.addList("8", [this.ctx.state.name]);
            chatMgs = this.ctx.state.name + "购买了垂钓特权卡，乐享垂钓特权";
            chatType = "8";
        }
        let userModel = UserModel_1.UserModel.getInstance(this.ctx, this.id);
        let actTaskMainModel = await ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
        if (await actTaskMainModel.kaiqi("1700") == 1) {
            let kuaid = await this.ctx.state.master.getChatKuaId(this.ctx.state.sid);
            await lock_1.default.setLock(this.ctx, "chat_kua_" + kuaid, kuaid);
            let sevChatModel = SevChatModel_1.SevChatModel.getInstance(this.ctx, kuaid, Xys.ChannelType.kua);
            let data = {
                id: 0,
                type: chatType,
                user: await cache_1.default.getFUser(this.ctx, this.id, 1),
                msg: chatMgs,
                time: game_1.default.getNowTime(),
            };
            await sevChatModel.add(data);
        }
        return {
            type: 1,
            msg: "充值成功",
            data: cfg.data.card.need[1],
        };
    }
    /**
     * 活动触发埋点
     */
    async hdChuFaMd() {
        let info = await this.getInfo();
        if (game_1.default.isToday(info.mdAt) == true) {
            return;
        }
        info.mdAt = this.ctx.state.newTime;
        await this.update(info, [""]);
    }
}
exports.HdPriCardModel = HdPriCardModel;
//# sourceMappingURL=HdPriCardModel.js.map