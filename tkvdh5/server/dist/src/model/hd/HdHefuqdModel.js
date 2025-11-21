"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HdHefuqdModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const game_1 = __importDefault(require("../../util/game"));
const gameMethod_1 = require("../../../common/gameMethod");
const setting_1 = __importDefault(require("../../crontab/setting"));
/**
 * 活动 合服庆典
 */
class HdHefuqdModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdHefuqd"; //用于存储key 和  输出1级key
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
    //钩子 整合代码
    static async hook(ctx, uuid, kind, count, isSet) {
        let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
        let cfgHefuqd = setting_1.default.getHuodong2(heid, "hdHefuqd");
        if (cfgHefuqd != null) {
            for (const hdcid in cfgHefuqd) {
                let hdHefuqdModel = HdHefuqdModel.getInstance(ctx, uuid, hdcid);
                await hdHefuqdModel.hook(kind, count, isSet);
            }
        }
    }
    outKey2() {
        return this.hdcid; //输出2级key
    }
    //初始化
    init() {
        return {
            hdid: "",
            dayAt: 0,
            qdrq: [],
            qddc: [],
            taskHook: {},
            taskRwd: {},
            superCard: 0,
            tehui: {},
            shopRef: 0,
            shopList: {} //商店列表 (每日重置)
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
            //签到
            let todayId = game_1.default.getTodayId(info.dayAt);
            if (info.qdrq.indexOf(todayId) == -1) {
                info.qdrq.push(todayId);
            }
            //特惠
            info.tehui = {};
            //商店
            info.shopRef = 0;
            info.shopList = await this.getShop6();
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
        //签到
        if (info.qdrq.length > info.qddc.length) {
            return 1;
        }
        //目标
        for (const dc in cfg.data.task) {
            let kind = cfg.data.task[dc].kind;
            if (info.taskHook[kind] == null || info.taskHook[kind] < cfg.data.task[dc].need) {
                continue;
            }
            if (info.taskRwd[dc] == null) {
                continue;
            }
            return 1;
        }
        //特惠
        for (const dc in cfg.data.tehui) {
            if (cfg.data.tehui[dc].need.length > 0) {
                continue;
            }
            if (info.tehui[dc] == null || info.tehui[dc] < cfg.data.tehui[dc].limit) {
                return 1; //免费
            }
        }
        return 0;
    }
    /**
     * 商店获取6个商品
     */
    async getShop6() {
        let cfg = (await this.getHdCfg());
        if (cfg == null) {
            return {};
        }
        //商品信息
        let list = {};
        let cfgShopList = gameMethod_1.gameMethod.objCopy(cfg.data.shop.list);
        for (let index = 1; index <= 6; index++) {
            //抽取kuid
            let _kuid = game_1.default.getProbRandId(0, cfg.data.shop.drop, "prob");
            if (_kuid == null || cfgShopList[_kuid] == null) {
                continue;
            }
            let _dc = game_1.default.getProbRandId(0, cfgShopList[_kuid], "prob");
            if (_dc == null || cfgShopList[_kuid][_dc] == null) {
                continue;
            }
            list[index.toString()] = {
                kuid: _kuid.toString(),
                dc: _dc.toString(),
                limit: 0
            };
            delete cfgShopList[_kuid][_dc];
        }
        return list;
    }
    /**
     * 领取签到奖励
     */
    async signRwd(dc) {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("HdHefuqdModel  活动已结束");
        }
        if (cfg.data.sign[dc] == null) {
            this.ctx.throw("参数错误");
        }
        let info = await this.getInfo();
        if (parseInt(dc) > info.qdrq.length) {
            this.ctx.throw("未解锁");
        }
        if (info.qddc.indexOf(dc) != -1) {
            this.ctx.throw("已经签到");
        }
        info.qddc.push(dc);
        await this.update(info, ['outf', 'red']);
        await this.ctx.state.master.addItem2(cfg.data.sign[dc].rwd);
    }
    /**
     * 目标进度
     */
    async hook(kind, count, isSet) {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            return;
        }
        let isPass = false;
        for (const dc in cfg.data.task) {
            if (cfg.data.task[dc].kind.toString() != kind) {
                continue;
            }
            isPass = true;
            break;
        }
        if (isPass == false) {
            return;
        }
        let info = await this.getInfo();
        if (info.taskHook[kind] == null) {
            info.taskHook[kind] = 0;
        }
        if (isSet) {
            info.taskHook[kind] = count;
        }
        else {
            info.taskHook[kind] += count;
        }
        await this.update(info, ['outf', 'red']);
    }
    /**
     * 领取任务奖励
     */
    async taskRwd(dc) {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("HdHefuqdModel  活动已结束");
        }
        if (cfg.data.task[dc] == null) {
            this.ctx.throw("参数错误");
        }
        let _kind = cfg.data.task[dc].kind.toString();
        let info = await this.getInfo();
        if (info.taskHook[_kind] == null || info.taskHook[_kind] < cfg.data.task[dc].need) {
            this.ctx.throw("未完成目标");
        }
        if (info.taskRwd[dc] != null) {
            this.ctx.throw("已领取");
        }
        info.taskRwd[dc] = this.ctx.state.newTime;
        await this.update(info, ['outf', 'red']);
        let items = cfg.data.task[dc].items;
        if (info.superCard > 0) {
            items = game_1.default.chengArr(items, cfg.data.superCard.addRate);
        }
        await this.ctx.state.master.addItem2(items);
    }
    /**
     * 领取特惠奖励
     */
    async tehuiRwd(dc) {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("HdHefuqdModel  活动已结束");
        }
        if (cfg.data.tehui[dc] == null) {
            this.ctx.throw("参数错误");
        }
        if (cfg.data.tehui[dc].need.length > 0) {
            await this.ctx.state.master.subItem1(cfg.data.tehui[dc].need);
        }
        let info = await this.getInfo();
        if (info.tehui[dc] == null) {
            info.tehui[dc] = 0;
        }
        if (info.tehui[dc] >= cfg.data.tehui[dc].limit) {
            this.ctx.throw("无购买次数");
        }
        info.tehui[dc] += 1;
        await this.update(info, ['outf', 'red']);
        await this.ctx.state.master.addItem2(cfg.data.tehui[dc].items);
    }
    /**
     * 合服庆典商店刷新
     */
    async ShopRef() {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("HdHefuqdModel  活动已结束");
        }
        let info = await this.getInfo();
        let min = Math.min(info.shopRef, cfg.data.shop.refNeed.length - 1);
        if (cfg.data.shop.refNeed[min] > 0) {
            await this.ctx.state.master.subItem1([1, 1, cfg.data.shop.refNeed[min]]);
        }
        info.shopRef += 1;
        info.shopList = await this.getShop6();
        await this.update(info, ['outf', 'red']);
    }
    /**
     * 合服庆典商店购买
     */
    async ShopBuy(dc) {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("HdHefuqdModel  活动已结束");
        }
        let info = await this.getInfo();
        if (info.shopList[dc] == null) {
            this.ctx.throw("参数错误");
        }
        let _kuid = info.shopList[dc].kuid;
        let _dc = info.shopList[dc].dc;
        if (info.shopList[dc].limit >= cfg.data.shop.list[_kuid][_dc].limit) {
            this.ctx.throw("无购买次数");
        }
        await this.ctx.state.master.subItem1(cfg.data.shop.list[_kuid][_dc].need);
        info.shopList[dc].limit += 1;
        await this.update(info, ['outf', 'red']);
        await this.ctx.state.master.addItem1(cfg.data.shop.list[_kuid][_dc].item);
    }
    /**
     * 充值下单检查  - 特惠礼包
     */
    async checkUp(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("HdHefuqdModel  活动已结束");
        }
        if (cfg.data.tehui[dc] == null) {
            this.ctx.throw("参数错误");
        }
        if (cfg.data.tehui[dc].need[0] != 10) {
            this.ctx.throw("不是充值档次");
        }
        let info = await this.getInfo();
        if (info.tehui[dc] == null) {
            info.tehui[dc] = 0;
        }
        if (info.tehui[dc] >= cfg.data.tehui[dc].limit) {
            this.ctx.throw("无购买次数");
        }
        return {
            type: 1,
            msg: cfg.data.tehui[dc].title,
            data: cfg.data.tehui[dc].need[1],
            kind10Cs: "hdHefuqdTh" + "_" + this.hdcid + "_" + dc + "_" + cfg.data.tehui[dc].need[1]
        };
    }
    /**
     * 充值成功后执行  - 特惠礼包
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
        if (info.tehui[dc] == null) {
            info.tehui[dc] = 0;
        }
        info.tehui[dc] += 1;
        await this.update(info, ['outf', 'red']);
        await this.ctx.state.master.addItem2(cfg.data.tehui[dc].items);
        return {
            type: 1,
            msg: "充值成功",
            data: cfg.data.tehui[dc].need[1]
        };
    }
    /**
     * 充值下单检查  - 超级翻倍卡
     */
    async checkUp1() {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("HdHefuqdModel  活动已结束");
        }
        let info = await this.getInfo();
        if (info.superCard != 0) {
            this.ctx.throw("已购买");
        }
        return {
            type: 1,
            msg: "合服庆典-超级翻倍卡",
            data: cfg.data.superCard.need[1],
            kind10Cs: "hdHefuqdCard" + "_" + this.hdcid + "_" + "1" + "_" + cfg.data.superCard.need[1]
        };
    }
    /**
     * 充值成功后执行  - 超级翻倍卡
     */
    async carryOut1() {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            return {
                type: 0,
                msg: "活动已关闭",
                data: null
            };
        }
        let info = await this.getInfo();
        info.superCard = this.ctx.state.newTime;
        await this.update(info, ['outf', 'red']);
        let items = [];
        for (const dc in info.taskRwd) {
            let addItems = game_1.default.chengArr(cfg.data.task[dc].items, cfg.data.superCard.addRate - 1);
            items = game_1.default.addArr(items, addItems);
        }
        if (items.length > 0) {
            items = game_1.default.mergeArr(items);
            await this.ctx.state.master.addItem2(items);
        }
        return {
            type: 1,
            msg: "充值成功",
            data: cfg.data.superCard.need[1]
        };
    }
}
exports.HdHefuqdModel = HdHefuqdModel;
//# sourceMappingURL=HdHefuqdModel.js.map