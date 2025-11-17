"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HdYueGongModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const game_1 = __importDefault(require("../../util/game"));
const ActItemModel_1 = require("../act/ActItemModel");
const setting_1 = __importDefault(require("../../crontab/setting"));
const ActTaskMainModel_1 = require("../act/ActTaskMainModel");
/**
 * 活动 月宫探宝
 */
class HdYueGongModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdYueGong"; //用于存储key 和  输出1级key
        this.outIsAu = true; //下发数据是否用au下发
        this.dType = master_1.DataType.user;
    }
    //钩子 整合代码
    static async hook(ctx, uuid, kind, count, isSet = false) {
        let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
        //活动 - 破除心魔
        let cfgHdYueGong = setting_1.default.getHuodong2(heid, "hdYueGong");
        if (cfgHdYueGong != null) {
            for (const hdcid in cfgHdYueGong) {
                let hdYueGongModel = HdYueGongModel.getInstance(ctx, uuid, hdcid);
                await hdYueGongModel.addHook(kind, count, isSet);
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
            dajiang: {},
            djid: "",
            get1: 0,
            get2: 0,
            baoge: {},
            task: {},
            taskKind: {},
            gift: {},
            sign: [],
            chouAll: 0,
            leiji: {},
            red1: 0,
            red2: 0,
            red3: 0,
            djprob: 0,
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        let cfg = await this.getHdCfg();
        if (cfg != null && cfg.info.id != info.hdid) {
            info = this.init();
            info.hdid = cfg.info.id;
        }
        if (info.time < this.ctx.state.new0) {
            info.time = this.ctx.state.newTime;
            info.task = {};
            info.taskKind = {};
            info.gift = {};
        }
        if (info.chouAll == null) {
            info.chouAll = 0;
        }
        if (info.leiji == null) {
            info.leiji = {};
        }
        if (info.djprob == null) {
            info.djprob = 0;
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
        let back = await this.getRed();
        let info = await this.getInfo();
        switch (key) {
            case "info":
                return cfg[key];
            case "data":
                return cfg[key];
            case "red":
                return back.red;
            case "outf":
                return back.info;
        }
        return null;
    }
    /**
     * 获取红点
     */
    async getRed() {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime >= cfg.info.eAt) {
            return {
                red: 0,
                info: null
            };
        }
        let info = await this.getInfo();
        info.red1 = 0;
        info.red2 = 0;
        info.red3 = 0;
        let red = 0;
        let passDay = game_1.default.passDay(cfg.info.sAt);
        for (let index = 1; index <= passDay; index++) {
            if (cfg.data.sign[index.toString()] != null && info.sign.indexOf(index.toString()) == -1) {
                info.red3 = 1;
                red = 1;
                break;
            }
        }
        if (cfg.data.gift["1"] != null && cfg.data.gift["1"].need.length == 0 && info.gift["1"] == null) {
            info.red1 = 1;
            red = 1;
        }
        for (const dc in cfg.data.task) {
            if (info.task[dc] != null) {
                continue;
            }
            let kind = cfg.data.task[dc].kind;
            if (info.taskKind[kind] != null && info.taskKind[kind] >= cfg.data.task[dc].need) {
                info.red2 = 1;
                red = 1;
                break;
            }
        }
        let subItemid = cfg.data.taobao.need[1].toString();
        let actItemModel = ActItemModel_1.ActItemModel.getInstance(this.ctx, this.id);
        let actItem = await actItemModel.getInfo();
        if (actItem[subItemid] != null && actItem[subItemid] > 0) {
            red = 1;
        }
        for (const dc in cfg.data.leiji) {
            if (info.chouAll < cfg.data.leiji[dc].need) {
                continue;
            }
            if (info.leiji[dc] == null) {
                red = 1;
                break;
            }
        }
        return {
            red: red,
            info: info
        };
    }
    /**
     * 选择大奖
     */
    async hdYgXuan(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime >= cfg.info.eAt) {
            this.ctx.throw("活动已结束");
        }
        if (cfg.data.taobao.dajiang[dc] == null) {
            this.ctx.throw("参数错误");
        }
        let info = await this.getInfo();
        if (info.dajiang[dc] == null) {
            info.dajiang[dc] = 0;
        }
        if (info.dajiang[dc] >= cfg.data.taobao.dajiang[dc].limit) {
            this.ctx.throw("已抽满");
        }
        info.djid = dc;
        await this.update(info, ["red", "outf"]);
    }
    /**
     * 抽奖
     */
    async hdYgChou(num) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime >= cfg.info.eAt) {
            this.ctx.throw("活动已结束");
        }
        let info = await this.getInfo();
        if (info.djid == "") {
            this.ctx.throw("请选择心仪大奖");
        }
        if (num < 1) {
            this.ctx.throw("参数错误");
        }
        await this.ctx.state.master.subItem1([cfg.data.taobao.need[0], cfg.data.taobao.need[1], cfg.data.taobao.need[2] * num]);
        let hdYueGong = [];
        let items = [];
        let get1All = 0;
        for (let index = 1; index <= num; index++) {
            //找出抽大奖概率
            for (const djProb of cfg.data.taobao.djProb) {
                if (info.get2 >= djProb[0] && info.get2 <= djProb[1]) {
                    info.djprob += djProb[2];
                    break;
                }
            }
            if (info.djid != "" && (game_1.default.rand(1, 10000) <= info.djprob || info.get2 >= cfg.data.taobao.maxMy)) { //中大奖
                if (info.dajiang[info.djid] == null) {
                    info.dajiang[info.djid] = 0;
                }
                items.push(cfg.data.taobao.dajiang[info.djid].item);
                hdYueGong.push({
                    type: "1",
                    dc: info.djid,
                    item: cfg.data.taobao.dajiang[info.djid].item
                });
                info.djprob = 0;
                info.dajiang[info.djid] += 1;
                info.djid = "";
                info.get2 -= cfg.data.taobao.maxMy;
                info.get2 = Math.max(0, info.get2);
            }
            else {
                let gid = game_1.default.getProbRandId(0, cfg.data.taobao.putong, "prob");
                if (gid == null || cfg.data.taobao.putong[gid] == null) {
                    this.ctx.throw("抽取奖品失败");
                    return;
                }
                items.push(cfg.data.taobao.putong[gid].item);
                hdYueGong.push({
                    type: "2",
                    dc: gid.toString(),
                    item: cfg.data.taobao.putong[gid].item
                });
            }
            //获得 积分 和 满月值
            let _get1 = game_1.default.rand(cfg.data.taobao.get1[0], cfg.data.taobao.get1[1]);
            info.get1 += _get1;
            info.get2 += game_1.default.rand(cfg.data.taobao.get2[0], cfg.data.taobao.get2[1]);
            get1All += _get1;
            info.chouAll += 1;
        }
        await this.ctx.state.master.addItem2(items, "");
        await this.update(info, ["red", "outf"]);
        if (get1All > 0) {
            await this.ctx.state.master.addWin("msg", "月宫积分 " + get1All);
        }
        //弹窗
        this.ctx.state.master.addWin("hdYueGong", hdYueGong);
    }
    /**
     * 月宫探宝兑换
     */
    async hdYgDuiHuan(dc, num) {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            this.ctx.throw("活动已结束");
        }
        if (num < 1) {
            this.ctx.throw("参数错误1");
        }
        if (cfg.data.baoge[dc] == null) {
            this.ctx.throw("参数错误");
        }
        let info = await this.getInfo();
        if (info.baoge[dc] == null) {
            info.baoge[dc] = 0;
        }
        if (info.baoge[dc] + num > cfg.data.baoge[dc].limit) {
            this.ctx.throw("没有兑换次数");
        }
        if (info.get1 < cfg.data.baoge[dc].get1) {
            this.ctx.throw("未解锁");
        }
        info.baoge[dc] += num;
        await this.update(info, ["red", "outf"]);
        await this.ctx.state.master.subItem1([cfg.data.baoge[dc].need[0], cfg.data.baoge[dc].need[1], cfg.data.baoge[dc].need[2] * num]);
        let getItems = game_1.default.chengArr(cfg.data.baoge[dc].items, num);
        //添加道具
        await this.ctx.state.master.addItem2(getItems);
    }
    /**
     * 月宫探宝领取每日任务
     */
    async hdYgTask(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime >= cfg.info.eAt) {
            this.ctx.throw("活动已结束");
        }
        if (cfg.data.task[dc] == null) {
            this.ctx.throw("参数错误");
        }
        let info = await this.getInfo();
        if (info.task[dc] != null) {
            this.ctx.throw("任务奖励已经领取");
        }
        let kind = cfg.data.task[dc].kind;
        if (info.taskKind[kind] == null || info.taskKind[kind] < cfg.data.task[dc].need) {
            this.ctx.throw("任务未完成");
        }
        info.task[dc] = this.ctx.state.newTime;
        await this.update(info, ["red", "outf"]);
        await this.ctx.state.master.addItem2(cfg.data.task[dc].items);
    }
    /**
     * 月宫探宝领取累计奖励
     */
    async hdYglj(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime >= cfg.info.eAt) {
            this.ctx.throw("活动已结束");
        }
        if (cfg.data.leiji[dc] == null) {
            this.ctx.throw("参数错误");
        }
        let info = await this.getInfo();
        if (info.leiji[dc] != null) {
            this.ctx.throw("累计奖励已经领取");
        }
        if (info.chouAll < cfg.data.leiji[dc].need) {
            this.ctx.throw("未满足条件");
        }
        info.leiji[dc] = this.ctx.state.newTime;
        await this.update(info, ["red", "outf"]);
        await this.ctx.state.master.addItem2(cfg.data.leiji[dc].items);
    }
    /**
     * 月宫探宝领取礼包
     */
    async hdYgGift(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime >= cfg.info.eAt) {
            this.ctx.throw("活动已结束");
        }
        if (cfg.data.gift[dc] == null) {
            this.ctx.throw("参数错误");
        }
        let info = await this.getInfo();
        if (info.gift[dc] == null) {
            info.gift[dc] = 0;
        }
        if (info.gift[dc] >= cfg.data.gift[dc].limit) {
            this.ctx.throw("购买次数已达上限");
        }
        info.gift[dc] += 1;
        await this.update(info, ["red", "outf"]);
        if (cfg.data.gift[dc].need.length > 0) {
            await this.ctx.state.master.subItem1(cfg.data.gift[dc].need);
        }
        await this.ctx.state.master.addItem2(cfg.data.gift[dc].items);
    }
    /**
     * 月宫探宝签到
     */
    async hdYgSign(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime >= cfg.info.eAt) {
            this.ctx.throw("活动已结束");
        }
        let info = await this.getInfo();
        let passDay = game_1.default.passDay(cfg.info.sAt);
        if (passDay < parseInt(dc)) {
            this.ctx.throw("未满足条件");
        }
        if (info.sign.indexOf(dc) != -1) {
            this.ctx.throw("已签到");
        }
        info.sign.push(dc);
        if (cfg.data.sign[dc] == null) {
            this.ctx.throw("活动配置错误");
        }
        await this.update(info, ["red", "outf"]);
        await this.ctx.state.master.addItem2(cfg.data.sign[dc].items);
    }
    /**
     * 充值下单检查
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
     * 充值下单检查
     */
    async checkUp11(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动已结束");
        }
        if (cfg.data.gift[dc] == null) {
            this.ctx.throw("参数错误");
        }
        if (cfg.data.gift[dc].need[0] != 11) {
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
            data: cfg.data.gift[dc].need[1]
        };
    }
    /**
     * 充值成功后执行
     */
    async carryOut11(dc) {
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
        if (info.gift[dc] >= cfg.data.gift[dc].limit) {
            this.ctx.throw("无次数");
        }
        info.gift[dc] += 1;
        await this.update(info, ["outf", "red"]);
        await this.ctx.state.master.addItem2(cfg.data.gift[dc].items);
        return {
            type: 1,
            msg: "",
            data: cfg.data.gift[dc].need[1]
        };
    }
    /**
     * 任务钩子
     */
    async addHook(kind, count, isSet) {
        let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
        if (await actTaskMainModel.kaiqi("4300") != 1) {
            return;
        }
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            return;
        }
        let pass = false;
        for (const dc in cfg.data.task) {
            if (cfg.data.task[dc].kind.toString() == kind.toString()) {
                pass = true;
            }
        }
        if (!pass) {
            return;
        }
        let info = await this.getInfo();
        if (isSet) {
            info.taskKind[kind] = count;
        }
        else {
            if (info.taskKind[kind] == null) {
                info.taskKind[kind] = 0;
            }
            info.taskKind[kind] += count;
        }
        await this.update(info, ["outf", "red"]);
    }
}
exports.HdYueGongModel = HdYueGongModel;
//# sourceMappingURL=HdYueGongModel.js.map