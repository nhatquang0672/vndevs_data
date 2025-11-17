"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HdChumoModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const gameMethod_1 = require("../../../common/gameMethod");
const RdsUserModel_1 = require("../redis/RdsUserModel");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const game_1 = __importDefault(require("../../util/game"));
const UserModel_1 = require("../user/UserModel");
const fight_1 = require("../../../common/fight");
const MailModel_1 = require("../user/MailModel");
const tool_1 = require("../../util/tool");
/**
 * 活动 合服-除魔
 */
class HdChumoModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdChumo"; //用于存储key 和  输出1级key
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
            dayAt: 0,
            gift: {},
            nowId: 1,
            start: {
                from: "",
                seed: 0,
                teams: {}
            },
            end: {
                win: 0,
                items: [],
            },
            bugVer: 1
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        let cfg = (await this.getHdCfg());
        if (cfg != null && cfg.info.id != info.hdid) {
            info = this.init();
            info.hdid = cfg.info.id;
        }
        if (this.ctx.state.new0 > info.dayAt) {
            info.dayAt = this.ctx.state.newTime;
            //礼包
            info.gift = {};
        }
        if (info.bugVer != 1) {
            info.bugVer = 1;
            let items = [];
            for (let index = 1; index < info.nowId; index++) {
                if (cfg.data.list[index] == null) {
                    continue;
                }
                items = game_1.default.addArr(items, cfg.data.list[index].items);
            }
            if (items.length > 0) {
                let mailModel = MailModel_1.MailModel.getInstance(this.ctx, this.id);
                await mailModel.sendMail("除魔卫道奖励", "挑战关卡奖励发放，请及时查收。", gameMethod_1.gameMethod.mergeArr(items));
            }
            await this.update(info, [""]);
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
                return info;
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
        //礼包
        for (const dc in cfg.data.gift) {
            if (cfg.data.gift[dc].need.length > 0) {
                continue;
            }
            if (info.gift[dc] == null || info.gift[dc] < cfg.data.gift[dc].limit) {
                return 1; //免费
            }
        }
        return 0;
    }
    /**
     * 领取礼包奖励
     */
    async giftRwd(dc) {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动已结束");
        }
        if (cfg.data.gift[dc] == null) {
            this.ctx.throw("参数错误");
        }
        if (cfg.data.gift[dc].need.length > 0) {
            await this.ctx.state.master.subItem1(cfg.data.gift[dc].need);
        }
        let info = await this.getInfo();
        if (info.nowId <= cfg.data.gift[dc].lock) {
            this.ctx.throw("未解锁");
        }
        if (info.gift[dc] == null) {
            info.gift[dc] = 0;
        }
        if (info.gift[dc] >= cfg.data.gift[dc].limit) {
            this.ctx.throw("无购买次数");
        }
        info.gift[dc] += 1;
        await this.update(info, ['outf', 'red']);
        await this.ctx.state.master.addItem2(cfg.data.gift[dc].items);
    }
    /**
     * 战斗
     */
    async fight_one() {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动已结束");
        }
        let info = await this.getInfo();
        if (cfg.data.list[info.nowId] == null) {
            this.ctx.throw("已通关");
            return;
        }
        let monid = cfg.data.list[info.nowId].monid;
        let cfgMon = gameCfg_1.default.monHdChumo.getItem(monid.toString());
        if (cfgMon == null) {
            this.ctx.throw("怪物未生成");
            return;
        }
        let userModel = UserModel_1.UserModel.getInstance(this.ctx, this.id);
        let gStart = await userModel.getFightEps();
        info.start = {
            from: "hdchumo",
            seed: game_1.default.rand(1, 65535),
            teams: {
                "10": {
                    fid: this.id,
                    zhanwei: 0,
                    eps: gStart.eps,
                    level: 0,
                    wxSk: gStart.wxSk,
                    isnq: gStart.isnq,
                    jgSk: gStart.jgSk //精怪技能
                },
                "20": {
                    fid: monid.toString(),
                    zhanwei: 0,
                    eps: gameMethod_1.gameMethod.ep_merge(gameMethod_1.gameMethod.ep_init(), cfgMon.eps),
                    level: 0,
                    wxSk: {},
                    isnq: 0,
                    jgSk: {} //精怪技能
                },
            }
        };
        if (gStart.xlid != "") {
            info.start.teams["11"] = {
                fid: "xl_" + gStart.xlid,
                zhanwei: gStart.xlzw,
                eps: gStart.xleps,
                level: gStart.xlLv,
                wxSk: {},
                isnq: 0,
                jgSk: {} //精怪技能
            };
        }
        //战斗
        let fight = new fight_1.Fight(info.start);
        let back = fight.get_outf();
        //记录战斗日志
        tool_1.tool.addFightTeam(this.ctx, info.start);
        info.end.win = back.win;
        info.end.items = [];
        if (info.end.win == 1) {
            info.end.items = game_1.default.addArr(info.end.items, cfg.data.list[info.nowId].items);
            //加入排行榜
            let rdsUserModel_rdsHd = await new RdsUserModel_1.RdsUserModel("rdsHdChumo", this.hdcid, await this.getHeIdByUuid(this.id), cfg.info.id);
            await rdsUserModel_rdsHd.zSet(this.id, info.nowId);
            await rdsUserModel_rdsHd.backData_my(this.ctx, this.id);
            await this.ctx.state.master.addItem2(info.end.items, "");
            info.nowId += 1;
        }
        await this.update(info, ['outf', 'red']);
    }
    /**
     * 充值下单检查  - 礼包礼包
     */
    async checkUp(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动已结束");
        }
        if (cfg.data.gift[dc] == null) {
            this.ctx.throw("参数错误");
        }
        if (cfg.data.gift[dc].need[0] != 10) {
            this.ctx.throw("不是充值档次");
        }
        let info = await this.getInfo();
        if (info.nowId <= cfg.data.gift[dc].lock) {
            this.ctx.throw("未解锁");
        }
        if (info.gift[dc] == null) {
            info.gift[dc] = 0;
        }
        if (info.gift[dc] >= cfg.data.gift[dc].limit) {
            this.ctx.throw("无购买次数");
        }
        return {
            type: 1,
            msg: cfg.data.gift[dc].title,
            data: cfg.data.gift[dc].need[1],
            kind10Cs: this.kid + "_" + this.hdcid + "_" + dc + "_" + cfg.data.gift[dc].need[1]
        };
    }
    /**
     * 充值成功后执行  - 礼包礼包
     */
    async carryOut(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            return {
                type: 0,
                msg: "活动已关闭",
                data: null
            };
        }
        let info = await this.getInfo();
        if (info.gift[dc] == null) {
            info.gift[dc] = 0;
        }
        info.gift[dc] += 1;
        await this.update(info, ['outf', 'red']);
        await this.ctx.state.master.addItem2(cfg.data.gift[dc].items);
        return {
            type: 1,
            msg: "充值成功",
            data: cfg.data.gift[dc].need[1]
        };
    }
}
exports.HdChumoModel = HdChumoModel;
//# sourceMappingURL=HdChumoModel.js.map