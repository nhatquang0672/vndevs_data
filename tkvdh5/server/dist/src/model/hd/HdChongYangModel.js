"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HdChongYangModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const ActItemModel_1 = require("../act/ActItemModel");
const setting_1 = __importDefault(require("../../crontab/setting"));
const ActTaskMainModel_1 = require("../act/ActTaskMainModel");
const game_1 = __importDefault(require("../../util/game"));
/**
 * 活动 重阳出游
 */
class HdChongYangModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdChongYang"; //用于存储key 和  输出1级key
        this.outIsAu = true; //下发数据是否用au下发
        this.dType = master_1.DataType.user;
    }
    //钩子 整合代码
    static async hook(ctx, uuid, kind, count, isSet = false) {
        let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
        //活动 - 重阳出游
        let cfgHdChongYang = setting_1.default.getHuodong2(heid, "hdChongYang");
        if (cfgHdChongYang != null) {
            for (const hdcid in cfgHdChongYang) {
                let hdChongYangModel = HdChongYangModel.getInstance(ctx, uuid, hdcid);
                await hdChongYangModel.addHook(kind, count, isSet);
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
            task: {},
            taskKind: {},
            gift: {},
            chengjiu: {},
            dajiang: {},
            chouAll: 0,
            //出游玩法字段
            ceng: 1,
            quan: 1,
            gzs: {},
            nowXb: 1,
            nowItems: {},
            isShow: 0 //是否展示进入下一层 0没有 1是
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
            info.quan = Object.keys(cfg.data.chuyou["1"]).length;
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
        if (cfg == null || this.ctx.state.newTime >= cfg.info.eAt) {
            return 0;
        }
        let info = await this.getInfo();
        if (cfg.data.gift["1"] != null && cfg.data.gift["1"].need.length == 0 && info.gift["1"] == null) {
            return 1;
        }
        for (const dc in cfg.data.task) {
            if (info.task[dc] != null) {
                continue;
            }
            let kind = cfg.data.task[dc].kind;
            if (info.taskKind[kind] != null && info.taskKind[kind] >= cfg.data.task[dc].need) {
                return 1;
            }
        }
        let subItemid = cfg.data.need[1].toString();
        let actItemModel = ActItemModel_1.ActItemModel.getInstance(this.ctx, this.id);
        let actItem = await actItemModel.getInfo();
        if (actItem[subItemid] != null && actItem[subItemid] > 0) {
            return 1;
        }
        for (const dc in cfg.data.chengjiu) {
            if (info.chouAll < cfg.data.chengjiu[dc].need) {
                continue;
            }
            if (info.chengjiu[dc] == null) {
                return 1;
            }
        }
        for (const dc in cfg.data.dajiang) {
            if (info.ceng < cfg.data.dajiang[dc].ceng) {
                continue;
            }
            if (info.dajiang[dc] == null) {
                continue;
            }
            if (info.dajiang[dc].rwd == 0) {
                return 1;
            }
        }
        return 0;
    }
    /**
     * 重阳出游领取每日任务
     */
    async hdCyTask(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime >= cfg.info.eAt) {
            this.ctx.throw("HdChongYang 活动已结束");
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
     * 重阳出游领取成就奖励
     */
    async hdCyCj(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime >= cfg.info.eAt) {
            this.ctx.throw("HdChongYang 活动已结束");
        }
        if (cfg.data.chengjiu[dc] == null) {
            this.ctx.throw("参数错误");
        }
        let info = await this.getInfo();
        if (info.chengjiu[dc] != null) {
            this.ctx.throw("成就奖励已经领取");
        }
        if (info.chouAll < cfg.data.chengjiu[dc].need) {
            this.ctx.throw("未满足条件");
        }
        info.chengjiu[dc] = this.ctx.state.newTime;
        await this.update(info, ["red", "outf"]);
        await this.ctx.state.master.addItem2(cfg.data.chengjiu[dc].items);
    }
    /**
     * 重阳出游领取礼包
     */
    async hdCyGift(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime >= cfg.info.eAt) {
            this.ctx.throw("HdChongYang 活动已结束");
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
     * 重阳出游领取礼包
     */
    async hdCyXuan(dc, xb) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("HdChongYang 活动已结束");
        }
        if (cfg.data.dajiang[dc] == null) {
            this.ctx.throw("参数错误");
        }
        let info = await this.getInfo();
        if (cfg.data.dajiang[dc].ceng < info.ceng) {
            this.ctx.throw("已达到领取进度，无法更改");
        }
        if (info.dajiang[dc] == null) {
            info.dajiang[dc] = {
                xb: 0,
                rwd: 0 //是否已领取
            };
        }
        if (info.dajiang[dc].rwd != 0) {
            this.ctx.throw("已领取，不能更换");
        }
        info.dajiang[dc].xb = xb;
        await this.update(info, ["outf", "red"]);
    }
    /**
     * 重阳出游
     */
    async hdCyChou() {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("HdChongYang 活动已结束");
        }
        //出游消耗道具茱萸。
        await this.ctx.state.master.subItem1(cfg.data.need); //扣除道具
        let info = await this.getInfo();
        info.chouAll += cfg.data.need[2];
        //需要把自选进度大奖都选择完成以后，才能开始进行出游。
        for (const dc in cfg.data.dajiang) {
            for (const _Item of cfg.data.dajiang[dc].items) {
                if (_Item[0] != null) {
                    continue;
                }
                if (info.dajiang[dc] == null) {
                    this.ctx.throw("需要选中所有的自选大奖");
                }
            }
        }
        /*
        3.每次出游时，兔子会在格子上随机一格前往，到达对应格子后，会击碎格子，获得奖励，回到起点。
        4.已经击碎的格子不会重复前往，前往一格少一个。
        5.每层有多圈的格子，将由外到内依次破除。
        6.每圈所有格子破除完毕后才会进入下一圈。
        7.每圈都有1个特殊格子，特殊格子破除后可以破除这圈剩余的所有格子，获得对应格子的奖励，并进入下一圈。
        8.每层的最内部，都有一个最终的核心宝格，破除宝格可以进入下一层。

        三、核心秘宝
            1.破除完每层的最终宝格以后，可以进入更深层的宝格。
            2.每层中心的特殊格子即为本层的核心秘宝。
            3.当道友通关最后一层后，将会进入循环层，循环层每次出游完成后将重置该层继续抽取。
        */
        if (info.gzs[info.quan.toString()] == null) {
            info.gzs[info.quan.toString()] = [];
        }
        //抽中大奖的概率
        let djProb = cfg.data.chuyou[info.ceng.toString()][info.quan.toString()].prob[0];
        let pygz = []; //存放普通格子 1 - N
        let maxgz = cfg.data.chuyou[info.ceng.toString()][info.quan.toString()].gezi;
        for (let index = 1; index <= maxgz; index++) {
            if (cfg.data.chuyou[info.ceng.toString()][info.quan.toString()].qjid == index) {
                continue; //大奖
            }
            if (info.gzs[info.quan.toString()].indexOf(index) != -1) {
                continue; //已经抽中
            }
            pygz.push(index);
        }
        if (pygz.length <= 0) {
            djProb = 10000;
        }
        else {
            let pxb = maxgz - pygz.length - 1;
            if (cfg.data.chuyou[info.ceng.toString()][info.quan.toString()].prob[pxb] != null) {
                djProb = cfg.data.chuyou[info.ceng.toString()][info.quan.toString()].prob[pxb];
            }
        }
        info.nowItems = {};
        if (game_1.default.rand(1, 10000) <= djProb) {
            //大奖
            info.nowXb = cfg.data.chuyou[info.ceng.toString()][info.quan.toString()].qjid;
            info.gzs[info.quan.toString()].push(info.nowXb);
            let citem = game_1.default.getProbByItems(cfg.data.ptItems, 0, 3);
            if (citem == null) {
                this.ctx.throw("抽取奖励失败3");
            }
            if (info.nowItems[info.nowXb.toString()] == null) {
                info.nowItems[info.nowXb.toString()] = [];
            }
            info.nowItems[info.nowXb.toString()].push(citem);
            //收菜
            for (const _gz of pygz) {
                let citem = game_1.default.getProbByItems(cfg.data.ptItems, 0, 3);
                if (citem == null) {
                    this.ctx.throw("抽取奖励失败1");
                }
                if (info.nowItems[_gz.toString()] == null) {
                    info.nowItems[_gz.toString()] = [];
                }
                info.nowItems[_gz.toString()].push(citem);
            }
            //然后 圈ID 加1
            if (cfg.data.chuyou[info.ceng.toString()][(info.quan - 1).toString()] != null) {
                info.quan -= 1; //下一圈
                info.nowXb = 1;
            }
            else {
                info.isShow = 1;
                if (cfg.data.chuyou[(info.ceng + 1).toString()] == null) { //循环圈
                    let xhitem = game_1.default.getProbByItems(cfg.data.dajiang[info.ceng.toString()].items, 0, 3);
                    if (xhitem == null) {
                        this.ctx.throw("抽取奖励失败2");
                    }
                    if (info.nowItems["0"] == null) {
                        info.nowItems["0"] = [];
                    }
                    info.nowItems["0"].push(xhitem);
                }
                else {
                    if (info.dajiang[info.ceng.toString()] == null) {
                        info.dajiang[info.ceng.toString()] = {
                            xb: 0,
                            rwd: 0,
                        };
                    }
                    if (info.dajiang[info.ceng.toString()].rwd != 1) {
                        info.dajiang[info.ceng.toString()].rwd = 1;
                        let items = [];
                        for (const _item of cfg.data.dajiang[info.ceng.toString()].items) {
                            if (_item[0] == 0) {
                                items.push(cfg.data.dajiang[info.ceng.toString()].kuItems[info.dajiang[info.ceng.toString()].xb]);
                            }
                            else {
                                items.push(_item);
                            }
                        }
                        if (info.nowItems["0"] == null) {
                            info.nowItems["0"] = [];
                        }
                        info.nowItems["0"] = items;
                    }
                }
            }
        }
        else {
            info.nowXb = game_1.default.getRandArr(pygz, 1)[0];
            info.gzs[info.quan.toString()].push(info.nowXb);
            let citem = game_1.default.getProbByItems(cfg.data.ptItems, 0, 3);
            if (citem == null) {
                this.ctx.throw("抽取奖励失败3");
            }
            if (info.nowItems[info.nowXb.toString()] == null) {
                info.nowItems[info.nowXb.toString()] = [];
            }
            info.nowItems[info.nowXb.toString()].push(citem);
        }
        for (const xb in info.nowItems) {
            // let items2:KindItem[] = []
            // for (const _item of info.nowItems[xb]) {
            //     if(_item[0] != 1){
            //         items2.push(_item)
            //         continue
            //     }
            //     let cfgType = Gamecfg.itemMoney.getItemCtx(this.ctx,_item[1].toString()).type
            //     if(["fazhen","fazhensj"].indexOf(cfgType) == -1){
            //         items2.push(_item)
            //         continue
            //     }
            //     let mailModel = MailModel.getInstance(this.ctx, this.id);
            //     await mailModel.sendMail(cfg.info.title+"活动兽灵发放",cfg.info.title+`活动中获得自选兽灵，请开启足够灵兽槽位后及时领取。`,[_item])
            //     await this.ctx.state.master.addWin("msg","获得自选兽灵，请前往邮件领取")
            //     continue
            // }
            // if(items2.length > 0){
            //     await this.ctx.state.master.addItem2(items2,"")
            // }
            await this.ctx.state.master.addItem2(info.nowItems[xb], "");
        }
        await this.update(info, ["outf", "red"]);
    }
    /**
     * 重阳出游
     */
    async hdCyNext() {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("HdChongYang 活动已结束");
        }
        let info = await this.getInfo();
        if (info.isShow != 1) {
            this.ctx.throw("参数错误");
        }
        info.isShow = 0;
        if (cfg.data.chuyou[(info.ceng + 1).toString()] != null) {
            info.ceng += 1;
        }
        info.quan = Object.keys(cfg.data.chuyou[info.ceng.toString()]).length; //循环层
        info.nowXb = 1;
        info.gzs = {};
        await this.update(info, ["outf", "red"]);
    }
    /**
     * 充值下单检查
     */
    async checkUp(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("HdChongYang 活动已结束");
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
            this.ctx.throw("HdChongYang 活动已结束");
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
            data: null
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
exports.HdChongYangModel = HdChongYangModel;
//# sourceMappingURL=HdChongYangModel.js.map