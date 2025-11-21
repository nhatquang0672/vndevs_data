"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HdChouModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const game_1 = __importDefault(require("../../util/game"));
const gameMethod_1 = require("../../../common/gameMethod");
const RdsUserModel_1 = require("../redis/RdsUserModel");
const ActItemModel_1 = require("../act/ActItemModel");
const ActJjcFightModel_1 = require("../act/ActJjcFightModel");
const setting_1 = __importDefault(require("../../crontab/setting"));
const ActTaskMainModel_1 = require("../act/ActTaskMainModel");
/**
 * 活动 九龙宝藏
 */
class HdChouModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdChou"; //用于存储key 和  输出1级key
        this.outIsAu = true; //下发数据是否用au下发
        this.dType = master_1.DataType.user;
    }
    //加道具
    static async addCons(ctx, uuid, count) {
        let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
        let cfgHdChou = setting_1.default.getHuodong2(heid, "hdChou");
        if (cfgHdChou != null) {
            for (const hdcid in cfgHdChou) {
                let hdChouModel = HdChouModel.getInstance(ctx, uuid, hdcid);
                await hdChouModel.addCons(count);
            }
        }
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
            time: this.ctx.state.newTime,
            score: 0,
            count: 0,
            dropCount: 0,
            jifendc: [],
            chou: {},
            gift: {},
            itemId_802: 0,
            //20230608版本  大奖触发抽取[第61次开始概率触发,100次保底触发大奖,如果第一次没触发第二次必定触发大奖ID]
            cnum: 0,
            djid: "",
            //排行奖励红点（开启生效，点击消除）
            phRed: 1,
            ver_20230608: 1,
            bug: 1
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        let cfg = await this.getHdCfg();
        if (cfg != null && cfg.info.id != info.hdid) {
            info = this.init();
            info.hdid = cfg.info.id;
        }
        if (info.ver_20230608 != 1) {
            info.ver_20230608 = 1;
            info.jifendc = [];
        }
        if (this.ctx.state.new0 > info.time) {
            info.time = this.ctx.state.newTime;
            // if(info.gift["1"] != null){  //只重置第一档
            //     delete info.gift["1"]
            // }
            info.gift = {};
            info.dropCount = 0;
        }
        if (info.itemId_802 == null) {
            info.itemId_802 = 0;
            let actItemModel = ActItemModel_1.ActItemModel.getInstance(this.ctx, this.id, "1");
            let actItem = await actItemModel.getInfo();
            if (gameMethod_1.gameMethod.isEmpty(actItem["802"]) == false) {
                info.itemId_802 = actItem["802"];
            }
            await this.update(info, [""]);
        }
        //20230608版本  大奖触发抽取[第61次开始概率触发,100次保底触发大奖,如果第一次没触发第二次必定触发大奖ID]
        if (info.cnum == null) {
            info.cnum = 0;
        }
        if (info.djid == null) {
            info.djid = "";
        }
        if (info.phRed == null) {
            info.phRed = 1;
        }
        if (info.bug != 1 && parseInt(this.ctx.state.sid) < 75) {
            info.bug = 1;
            //加入排行榜
            let rdsUserModel_rdsHdChou = await new RdsUserModel_1.RdsUserModel("rdsHdChou", this.hdcid, await this.getHeIdByUuid(this.id), cfg.info.id);
            await rdsUserModel_rdsHdChou.zSet(this.id, info.score);
            await this.update(info);
        }
        return info;
    }
    /**
     * 返回数据
     */
    async getOutPut() {
        let cfgInfo = await this.getOutPut_u("info");
        if (cfgInfo == null || this.ctx.state.newTime > cfgInfo.dAt) {
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
        switch (key) {
            case "info":
                return cfg[key];
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
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("HdChouModel.getRed  活动已结束");
        }
        let info = await this.getInfo();
        if (info.phRed == 1) {
            return 1;
        }
        if (info.itemId_802 > 0) {
            return 1;
        }
        for (const dc in cfg.data.jifen) {
            if (info.jifendc.indexOf(dc) != -1) {
                continue;
            }
            if (info.score >= cfg.data.jifen[dc].need) {
                return 1;
            }
        }
        //礼包
        for (const dc in cfg.data.gift) {
            if (cfg.data.gift[dc].need.length > 0) {
                continue;
            }
            if (info.gift[dc] == null) {
                info.gift[dc] = 0;
            }
            if (info.gift[dc] < cfg.data.gift[dc].limit) {
                return 1;
            }
        }
        return 0;
    }
    /**
     * 充值下单检查
     */
    async checkUp(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("HdChouModel.checkUp  活动已结束");
        }
        if (cfg.data.gift[dc] == null) {
            this.ctx.throw("参数错误");
        }
        if (cfg.data.gift[dc].need[0] != 10) {
            this.ctx.throw("不是充值档次");
        }
        let info = await this.getInfo();
        if (info.gift[dc] == null) {
            info.gift[dc] = 0;
        }
        if (info.gift[dc] >= cfg.data.gift[dc].limit) {
            this.ctx.throw("无次数");
        }
        return {
            type: 1,
            msg: cfg.data.gift[dc].title,
            data: cfg.data.gift[dc].need[1],
            kind10Cs: this.kid + "_" + this.hdcid + "_" + dc + "_" + cfg.data.gift[dc].need[1]
        };
    }
    /**
     * 充值成功后执行
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
        await this.update(info, ["outf", "red"]);
        await this.ctx.state.master.addItem2(cfg.data.gift[dc].items);
        return {
            type: 1,
            msg: "充值成功",
            data: cfg.data.gift[dc].need[1]
        };
    }
    /**
     * 有几率获得藏宝图
     */
    async hook() {
        let actTaskMainModel = await ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
        if (await actTaskMainModel.kaiqi("4001") == 0) {
            return;
        }
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            return;
        }
        let info = await this.getInfo();
        if (info.dropCount == null) {
            info.dropCount = 0;
        }
        for (const jjcItems of cfg.data.drop) {
            if (info.dropCount >= jjcItems[0] && info.dropCount <= jjcItems[1]) {
                if (game_1.default.rand(1, 10000) <= jjcItems[2]) {
                    info.dropCount += 1;
                    await this.update(info, [""]);
                    if (this.hdcid == "3") {
                        await this.ctx.state.master.addItem1([1, 802, 1], "dongtian");
                    }
                    else if (this.hdcid == "2") {
                        await this.ctx.state.master.addItem1([1, 802, 1], "");
                        let actJjcFightModel = ActJjcFightModel_1.ActJjcFightModel.getInstance(this.ctx, this.id);
                        await actJjcFightModel.addWinItems([1, 802, 1]);
                    }
                    else {
                        await this.ctx.state.master.addItem1([1, 802, 1]);
                    }
                    // this.ctx.state.master.addWin("msg",`恭喜获得九龙秘宝藏宝图`)
                    return;
                }
            }
        }
    }
    /**
     * 抽奖
     */
    async chou(num) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("HdChouModel.chou  活动已结束");
        }
        if (cfg.data.dajiang == null) {
            this.ctx.throw("大奖配置缺失");
        }
        if (cfg.data.need[2] * num <= 0) {
            this.ctx.throw("道具不足!");
        }
        let info = await this.getInfo();
        if (info.itemId_802 < cfg.data.need[2] * num) {
            this.ctx.throw("道具不足");
        }
        info.itemId_802 -= cfg.data.need[2] * num;
        let items = [];
        let oldScore = info.score;
        for (let index = 0; index < num; index++) {
            info.cnum += 1;
            let citem1 = game_1.default.getProbByItems(cfg.data.prob, 0, 1);
            if (citem1 == null) {
                this.ctx.throw("抽取失败");
                return;
            }
            let type = citem1[0];
            if (info.cnum < cfg.data.dajiang[0]) {
                type = 1;
            }
            if (info.cnum >= cfg.data.dajiang[1]) {
                type = 2; //保底抽大奖
            }
            if (type == 2) {
                info.cnum = 0;
            }
            if (cfg.data.chou[type] == null) {
                this.ctx.throw("抽取失败!");
                return;
            }
            let chouPool = gameMethod_1.gameMethod.objCopy(cfg.data.chou[type]);
            for (const dc in chouPool) {
                if (info.chou[type] != null && info.chou[type][dc] != null
                    && chouPool[dc].limit > 0 && chouPool[dc].limit <= info.chou[type][dc]) {
                    delete chouPool[dc];
                }
            }
            let citem2 = game_1.default.getProbRandId(0, chouPool, 'prob');
            if (citem2 == null) {
                this.ctx.throw("抽取失败!!");
                return;
            }
            if (type == 2) {
                if (info.djid == "") {
                    info.djid = citem2.toString();
                }
                else {
                    if (info.djid != cfg.data.dajiang[2]) {
                        info.djid = cfg.data.dajiang[2];
                        citem2 = cfg.data.dajiang[2];
                    }
                }
            }
            items = game_1.default.addArr(chouPool[citem2].item, items);
            info.score += game_1.default.rand(cfg.data.score[0], cfg.data.score[1]);
            info.count += 1;
            if (info.chou[type] == null) {
                info.chou[type] = {};
            }
            if (info.chou[type][citem2] == null) {
                info.chou[type][citem2] = 0;
            }
            info.chou[type][citem2] += 1;
        }
        await this.update(info, ["outf", "red"]);
        await this.ctx.state.master.addWin("msg", "积分+ " + (info.score - oldScore));
        //加入排行榜
        let rdsUserModel_rdsHdChou = await new RdsUserModel_1.RdsUserModel("rdsHdChou", this.hdcid, await this.getHeIdByUuid(this.id), cfg.info.id);
        await rdsUserModel_rdsHdChou.zSet(this.id, info.score);
        if (items.length > 0) {
            await this.ctx.state.master.addItem2(items);
        }
    }
    /**
     * 免费领取礼包
     */
    async hdcGift(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("HdChouModel.hdcGift  活动已结束");
        }
        if (cfg.data.gift[dc] == null) {
            this.ctx.throw("参数错误");
        }
        if (cfg.data.gift[dc].need.length > 0) {
            await this.ctx.state.master.subItem1(cfg.data.gift[dc].need);
        }
        let info = await this.getInfo();
        if (info.gift[dc] == null) {
            info.gift[dc] = 0;
        }
        if (info.gift[dc] >= cfg.data.gift[dc].limit) {
            this.ctx.throw("无次数");
        }
        info.gift[dc] += 1;
        await this.update(info, ["outf", "red"]);
        await this.ctx.state.master.addItem2(cfg.data.gift[dc].items);
    }
    /**
     * 领取积分奖励
     */
    async hdcScore(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("HdChouModel.hdcScore  活动已结束");
        }
        if (cfg.data.jifen[dc] == null) {
            this.ctx.throw("参数错误");
        }
        let info = await this.getInfo();
        if (info.jifendc.indexOf(dc) != -1) {
            this.ctx.throw("已经领取");
        }
        if (info.score < cfg.data.jifen[dc].need) {
            this.ctx.throw("积分不足");
        }
        info.jifendc.push(dc);
        await this.ctx.state.master.addItem2(cfg.data.jifen[dc].items);
        await this.update(info, ["outf", "red"]);
    }
    /**
     * 加积分
     */
    async addCons(cons) {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            return;
        }
        let info = await this.getInfo();
        info.itemId_802 += cons;
        await this.update(info, ['outf', 'red']);
        this.ctx.state.master.addLog(1, 802, cons, info.itemId_802);
    }
    /**
     * 消除排行红点
     */
    async delPhRed() {
        let info = await this.getInfo();
        if (info.phRed == 0) {
            return;
        }
        info.phRed = 0;
        await this.update(info, ['outf', 'red']);
    }
}
exports.HdChouModel = HdChouModel;
//# sourceMappingURL=HdChouModel.js.map