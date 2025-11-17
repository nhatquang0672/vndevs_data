"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActDaoyouModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const MailModel_1 = require("../user/MailModel");
const ActJinxiuModel_1 = require("./ActJinxiuModel");
const ActTaskMainModel_1 = require("./ActTaskMainModel");
const game_1 = __importDefault(require("../../util/game"));
const tool_1 = require("../../util/tool");
const gameMethod_1 = require("../../../common/gameMethod");
const ActEquipModel_1 = require("./ActEquipModel");
const hook_1 = require("../../util/hook");
/**
 * 道友系统
 */
class ActDaoyouModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actDaoyou"; //用于存储key 和  输出1级key
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
    async getOutPut() {
        let info = gameMethod_1.gameMethod.objCopy(await this.getInfo());
        //过滤未解锁事件
        info.tradeEvents = Object.values(info.tradeEvents)
            .filter(eventInfo => {
            return !(eventInfo && eventInfo.unlockTime && eventInfo.unlockTime > game_1.default.getNowTime()) &&
                !(eventInfo && eventInfo.endTime <= game_1.default.getNowTime());
        });
        info.inviteEvents = Object.values(info.inviteEvents)
            .filter(eventInfo => {
            return !(eventInfo && eventInfo.unlockTime && eventInfo.unlockTime > game_1.default.getNowTime()) &&
                !(eventInfo && eventInfo.endTime <= game_1.default.getNowTime());
        });
        info.trustEvents = Object.values(info.trustEvents)
            .filter(eventInfo => {
            return !(eventInfo && eventInfo.unlockTime && eventInfo.unlockTime > game_1.default.getNowTime()) &&
                !(eventInfo && eventInfo.endTime <= game_1.default.getNowTime());
        });
        return info;
    }
    async getInfo() {
        let info = await super.getInfo();
        let isUpdate = false;
        let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
        if (await actTaskMainModel.kaiqi("6700", 0) != 1) {
            return info;
        }
        else {
            for (const p of Object.values(gameCfg_1.default.daoyouBase.pool)) {
                if (p.unlockType === "0" && !info.daoyouMap[p.id]) {
                    const conf = gameCfg_1.default.daoyouBase.getItemCtx(this.ctx, p.id);
                    const favorLvConf = gameCfg_1.default.daoyouFavorLv.getItemCtx(this.ctx, p.id, "1");
                    let daoyou = {
                        did: p.id,
                        favorLv: 1,
                        red: 1,
                        skillLv: 1,
                        favorCount: 0,
                        decFavor: 0,
                        ability: favorLvConf.ability == null ? 0 : favorLvConf.ability,
                        name: conf.name == null ? "" : conf.name,
                        unlockLevel: {},
                        state: 0,
                        eventState: 0
                    };
                    daoyou = this.refreshLevel(daoyou);
                    info.daoyouMap[p.id] = daoyou;
                    isUpdate = true;
                    break;
                }
            }
        }
        //隔天刷新 生成所有的预设事件
        if (this.ctx.state.new0 > info.time) {
            //刷新过期事件
            info.tradeEvents = Object.values(info.tradeEvents)
                .filter(eventInfo => {
                return !(eventInfo && eventInfo.endTime <= game_1.default.getNowTime());
            });
            info.inviteEvents = Object.values(info.inviteEvents)
                .filter(eventInfo => {
                return !(eventInfo && eventInfo.endTime <= game_1.default.getNowTime());
            });
            info.trustEvents = Object.values(info.trustEvents)
                .filter(eventInfo => {
                return !(eventInfo && eventInfo.endTime <= game_1.default.getNowTime());
            });
            isUpdate = true;
            let newTradeEvents = [];
            let newTrustEvents = [];
            let newInviteEvents = [];
            let refreshCfg = tool_1.tool.mathcfg_item(this.ctx, "daoyou_refresh");
            //玩家还剩余的最大上限条数
            let limitMax = Math.max(tool_1.tool.mathcfg_count(this.ctx, "daoyou_max") - info.tradeEvents.length - info.inviteEvents.length - info.trustEvents.length, 0);
            //交易事件今日的刷新上限
            let tLimit = tool_1.tool.mathcfg_count1(this.ctx, "daoyou_trade");
            //邀约事件今日的刷新上限
            let iLimit = tool_1.tool.mathcfg_count1(this.ctx, "daoyou_invite");
            //委托事件今日的刷新上限
            let tuLimit = tool_1.tool.mathcfg_count1(this.ctx, "daoyou_trust");
            for (const [index, hour] of refreshCfg.entries()) {
                let maxNum = Math.max(0, limitMax - newTradeEvents.length - newTrustEvents.length - newInviteEvents.length);
                if (maxNum === 0) {
                    break;
                }
                const maxCfg = gameCfg_1.default.mathInfo.getItemCtx(this.ctx, "daoyou_max");
                let item = gameMethod_1.gameMethod.objCopy(maxCfg.pram.item);
                if (!item) {
                    this.ctx.throw("maxCfg配置错误");
                }
                //获取这次刷新的总数
                let maxEvent = Math.min(game_1.default.getRandArr(item, 1)[0], maxNum);
                //获取当次刷新每个事件的个数
                let tNum = 0;
                let iNum = 0;
                let tuNum = 0;
                if (index !== refreshCfg.length - 1 || maxEvent === maxNum) {
                    let randNUm = this.getRandNum(newTrustEvents, newInviteEvents, newTradeEvents, maxEvent, maxEvent === maxNum);
                    tNum = randNUm[2];
                    iNum = randNUm[0];
                    tuNum = randNUm[1];
                }
                else {
                    //最后一个时间点下发所有数据
                    tNum = Math.max(0, tLimit - newTradeEvents.length);
                    iNum = Math.max(0, iLimit - newInviteEvents.length);
                    tuNum = Math.max(0, tuLimit - newTrustEvents.length);
                }
                //预设交易事件
                for (let i = 0; i < tNum; i++) {
                    newTradeEvents.push({
                        eventId: this.getId("3", hour, i),
                        id: 0,
                        discount: 0,
                        red: 0,
                        did: "",
                        endTime: 0,
                        unlockTime: this.ctx.state.new0 + hour * 3600,
                        type: 3 /* trade */,
                        sid: "",
                    });
                }
                //预设邀约事件
                for (let i = 0; i < iNum; i++) {
                    newInviteEvents.push({
                        eventId: this.getId("1", hour, i),
                        did: "",
                        baseId: "",
                        red: 0,
                        out1: "",
                        out2: "",
                        help: "",
                        rewardId: "",
                        inviteEndTime: 0,
                        helpState: 0,
                        state: 0,
                        endTime: 0,
                        needAb: 0,
                        needLv: 0,
                        unlockTime: this.ctx.state.new0 + hour * 3600,
                        type: 1 /* invite */,
                        sid: "",
                    });
                }
                //预设委托事件
                for (let i = 0; i < tuNum; i++) {
                    newTrustEvents.push({
                        eventId: this.getId("2", hour, i),
                        did: "",
                        id: 0,
                        red: 0,
                        endTime: 0,
                        unlockTime: this.ctx.state.new0 + hour * 3600,
                        time: 0,
                        type: 2 /* trust */,
                        sid: "",
                    });
                }
            }
            //初始作假
            if (info.time === 0) {
                let zuojiaCfg = tool_1.tool.mathcfg_kv(this.ctx, "daoyou_init_zuojia");
                for (const type of Object.keys(zuojiaCfg)) {
                    switch (type) {
                        case 1 /* invite */.toString():
                            newInviteEvents = this.zuojia(zuojiaCfg[type], newInviteEvents, 1 /* invite */);
                            break;
                        case 2 /* trust */.toString():
                            newTrustEvents = this.zuojia(zuojiaCfg[type], newTrustEvents, 2 /* trust */);
                            break;
                        case 3 /* trade */.toString():
                            newTradeEvents = this.zuojia(zuojiaCfg[type], newTradeEvents, 3 /* trade */);
                            break;
                        default:
                            this.ctx.throw("未处理类型" + type);
                    }
                }
            }
            info.tradeEvents.push(...newTradeEvents);
            info.trustEvents.push(...newTrustEvents);
            info.inviteEvents.push(...newInviteEvents);
            info.time = this.ctx.state.newTime;
        }
        //检测是否有需要解锁的事件
        for (let event of info.tradeEvents) {
            if (event && event.unlockTime && event.unlockTime <= game_1.default.getNowTime() && event.endTime < game_1.default.getNowTime()) {
                await this.unlockTradeEvent(event, info);
                isUpdate = true;
            }
        }
        for (let event of info.trustEvents) {
            if (event && event.unlockTime && event.unlockTime <= game_1.default.getNowTime() && event.endTime < game_1.default.getNowTime()) {
                await this.unlockTrustEvent(event, info);
                isUpdate = true;
            }
        }
        for (let event of info.inviteEvents) {
            if (event && event.unlockTime && event.unlockTime <= game_1.default.getNowTime() && event.endTime < game_1.default.getNowTime()) {
                await this.unlockInviteEvent(event, info);
                isUpdate = true;
            }
        }
        if (isUpdate) {
            await this.update(info);
        }
        return info;
    }
    init() {
        let daoyouMap = {};
        let tradeEvents = [];
        let trustEvents = [];
        let inviteEvents = [];
        return {
            time: 0,
            tradeEvents,
            trustEvents,
            inviteEvents,
            daoyouMap
        };
    }
    /**
     * 检查道友是否能够被解锁
     * @param nids 任务进度
     */
    async checkTask(nids) {
        const info = await this.getInfo();
        let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
        if (await actTaskMainModel.kaiqi("6700", 0) != 1) {
            return;
        }
        for (const daoYou of Object.values(gameCfg_1.default.daoyouBase.pool)) {
            if (info.daoyouMap[daoYou.id]) {
                continue;
            }
            if (daoYou.unlockType === "1") {
                let isUnlock = 0;
                for (const [lockType, value] of Object.entries(daoYou.locks)) {
                    //已有的任务进度 >= 所需要的进度
                    if (nids[lockType] && nids[lockType] >= Number(value)) {
                        isUnlock++;
                    }
                }
                if (isUnlock === Object.keys(daoYou.locks).length) {
                    await this.unlockDaoyou(daoYou.id);
                }
            }
        }
    }
    /**
     * 检查道友是否能够被解锁
     * @param did 道友ID
     */
    async unlockCheck(did) {
        const info = await this.getInfo();
        if (info.daoyouMap[did]) {
            this.ctx.throw("道友已激活");
        }
        const daoyouConf = gameCfg_1.default.daoyouBase.getItemCtx(this.ctx, did);
        switch (daoyouConf.unlockType) {
            case "2":
                await this.ctx.state.master.subItem1(gameMethod_1.gameMethod.objCopy(daoyouConf.locks));
                break;
            default:
                this.ctx.throw("未识别类型" + daoyouConf.unlockType);
        }
        await this.unlockDaoyou(did);
    }
    /**
     * 消除红点
     * @param did 道友ID
     * @param type 类别 1道友 2交易 3邀约&委托
     */
    async delRed(did, type) {
        const info = await this.getInfo();
        let isUpdate = false;
        switch (type) {
            case 1:
                let daoyou = info.daoyouMap[did];
                if (!info.daoyouMap[did]) {
                    this.ctx.throw("道友未解锁");
                }
                daoyou.red = 0;
                isUpdate = true;
                break;
            case 2:
                for (const event of info.tradeEvents) {
                    if (event.red) {
                        event.red = 0;
                    }
                }
                isUpdate = true;
                break;
            case 3:
                for (const event of info.inviteEvents) {
                    if (event.red) {
                        event.red = 0;
                    }
                }
                for (const event of info.trustEvents) {
                    if (event.red) {
                        event.red = 0;
                    }
                }
                isUpdate = true;
                break;
            default:
                this.ctx.throw("未处理类型" + type);
                break;
        }
        if (isUpdate) {
            await this.update(info);
        }
    }
    /**
     * 拒绝事件
     * @param eid 事件ID
     * @param type 事件类型  1邀约 2委托 3交易(无法拒绝)
     */
    async reject(eid, type) {
        const info = await this.getInfo();
        let events = [];
        let isUpdate = false;
        switch (type) {
            case 1 /* invite */:
                events = info.inviteEvents;
                break;
            case 2 /* trust */:
                events = info.trustEvents;
                break;
            default:
                this.ctx.throw("未处理类型" + type);
        }
        for (const event of events) {
            if (event.eventId === eid) {
                event.endTime = game_1.default.getNowTime() - 1;
                isUpdate = true;
                break;
            }
        }
        if (isUpdate) {
            await this.update(info);
        }
    }
    /**
     * 解锁道友
     * @param did 道友Id
     */
    async unlockDaoyou(did) {
        const info = await this.getInfo();
        if (info.daoyouMap[did]) {
            return;
        }
        const conf = gameCfg_1.default.daoyouBase.getItemCtx(this.ctx, did);
        const favorLvConf = gameCfg_1.default.daoyouFavorLv.getItemCtx(this.ctx, did, "1");
        let daoyou = {
            did,
            favorLv: 1,
            red: 1,
            skillLv: 1,
            favorCount: 0,
            decFavor: 0,
            ability: favorLvConf.ability == null ? 0 : favorLvConf.ability,
            name: conf.name == null ? "" : conf.name,
            unlockLevel: {},
            state: 0,
            eventState: 0
        };
        daoyou = this.refreshLevel(daoyou);
        info.daoyouMap[did] = daoyou;
        await hook_1.hookNote(this.ctx, "dyhasnum", Object.keys(info.daoyouMap).length);
        await this.update(info);
    }
    /**
     * 使用道具添加好感度
     * @param did 道友Id
     * @param itemId 道具Id
     * @param count 使用数量
     */
    async addFavor(did, itemId, count) {
        let info = await this.getInfo();
        let daoyou = info.daoyouMap[did];
        if (!daoyou) {
            // 道友未解锁
            this.ctx.throw("道友未解锁");
        }
        let favorItem = gameCfg_1.default.daoyouFavorItem.getItemCtx(this.ctx, itemId);
        let totalAddFavor = favorItem.addFavor * count;
        if (favorItem.favorList.includes(Number(did))) {
            totalAddFavor = favorItem.addFavorMuch * count;
        }
        daoyou.favorCount += totalAddFavor;
        info.daoyouMap[did] = await this.upgradeFavorLv(daoyou);
        await hook_1.hookNote(this.ctx, "dyzengli", count);
        await this.update(info);
    }
    /**
     * 邀约 - 派遣
     * @param vid 邀约事件ID
     */
    async invite(vid, out1, out2, help) {
        let info = await this.getInfo();
        let event;
        for (const _event of Object.values(info.inviteEvents)) {
            if (_event.eventId === vid) {
                event = _event;
                this.break;
            }
        }
        if (!event) {
            this.ctx.throw("参数错误1");
        }
        const cfg = gameCfg_1.default.daoyouInviteBase.getItemCtx(this.ctx, event.baseId);
        if (!cfg.inviteTime) {
            this.ctx.throw("参数错误2");
        }
        //事件状态 0默认 1：按能力派遣（派遣人数1）  2：按等级派遣（派遣人数1）3：按能力与等级派遣（派遣人数2）
        switch (event.state) {
            case 1:
                let ab_daoyou = info.daoyouMap[out1];
                if (!out1 || out1 === "" || ab_daoyou.eventState === 1 || ab_daoyou.ability < event.needAb) {
                    this.ctx.throw("派遣能力道友不可用");
                }
                out2 = "";
                break;
            case 2:
                let lv_daoyou = info.daoyouMap[out2];
                if (!out2 || out2 === "" || lv_daoyou.eventState === 1 || lv_daoyou.favorLv < event.needLv) {
                    this.ctx.throw("派遣等级道友不可用");
                }
                out1 = "";
                break;
            case 3:
                let a_daoyou = info.daoyouMap[out1];
                if (!out1 || out1 === "" || a_daoyou.eventState === 1 || a_daoyou.ability < event.needAb) {
                    this.ctx.throw("派遣能力道友不可用");
                }
                let l_daoyou = info.daoyouMap[out2];
                if (!out2 || out2 === "" || l_daoyou.eventState === 1 || l_daoyou.favorLv < event.needLv) {
                    this.ctx.throw("派遣等级道友不可用");
                }
                break;
            default:
                this.ctx.throw("参数错误4");
        }
        event.inviteEndTime = game_1.default.getNowTime() + cfg.inviteTime;
        //设置道友状态
        event.out1 = out1;
        event.out2 = out2;
        event.help = help;
        event.endTime = Number.MAX_SAFE_INTEGER;
        if (info.daoyouMap[event.out1]) {
            info.daoyouMap[event.out1].eventState = 1;
        }
        if (info.daoyouMap[event.out2]) {
            info.daoyouMap[event.out2].eventState = 1;
        }
        if (help && info.daoyouMap[event.help]) {
            info.daoyouMap[event.help].eventState = 1;
        }
        await hook_1.hookNote(this.ctx, "dyyaoyue", 1);
        await this.update(info);
    }
    /**
     * 获取邀约奖励
     * @param vid 邀约事件ID
     */
    async getInviteReward(vid) {
        let info = await this.getInfo();
        let event;
        for (const _event of Object.values(info.inviteEvents)) {
            if (_event.eventId === vid) {
                event = _event;
                break;
            }
        }
        if (!event) {
            this.ctx.throw("参数错误");
        }
        //时间是否达到
        if (event.inviteEndTime > game_1.default.getNowTime()) {
            this.ctx.throw("派遣时间还没到噢");
        }
        const cfg = gameCfg_1.default.daoyouInviteBase.getItemCtx(this.ctx, event.baseId);
        const poolCfg = gameCfg_1.default.daoyouInvitePool.getItemCtx(this.ctx, event.rewardId);
        if (!poolCfg.item) {
            this.ctx.throw("参数错误");
        }
        let reward = gameMethod_1.gameMethod.objCopy(poolCfg.item);
        if (event.helpState) {
            reward[2] = Math.ceil(reward[2] * (1 + tool_1.tool.mathcfg_count(this.ctx, "daoyou_zhuli")) / 10000);
        }
        await this.ctx.state.master.addItem1(reward);
        //释放道友
        let daoyou = info.daoyouMap[event.did];
        daoyou.favorCount += cfg.favor;
        daoyou.eventState = 0;
        daoyou = await this.upgradeFavorLv(daoyou);
        let daoyou_out1 = info.daoyouMap[event.out1];
        let daoyou_out2 = info.daoyouMap[event.out2];
        if (daoyou_out1) {
            daoyou_out1.eventState = 0;
            daoyou_out1.favorCount += cfg.favor;
            daoyou_out1 = await this.upgradeFavorLv(daoyou_out1);
        }
        if (daoyou_out2) {
            daoyou_out2.eventState = 0;
            daoyou_out2.favorCount += cfg.favor;
            daoyou_out2 = await this.upgradeFavorLv(daoyou_out2);
        }
        if (event.help && info.daoyouMap[event.help]) {
            let _help = info.daoyouMap[event.help];
            _help.favorCount += cfg.favor;
            _help.eventState = 0;
            _help = await this.upgradeFavorLv(_help);
        }
        event.endTime = game_1.default.getNowTime();
        await this.update(info);
    }
    /**
     * 交易
     * @param jid 交易事件ID
     */
    async jiaoYi(jid) {
        let info = await this.getInfo();
        let event;
        for (const _event of Object.values(info.tradeEvents)) {
            if (_event.eventId === jid) {
                event = _event;
                this.break;
            }
        }
        if (!event) {
            this.ctx.throw("参数错误");
        }
        const tradeConf = gameCfg_1.default.daoyouTradePool.getItemCtx(this.ctx, event.id.toString());
        let costItem = gameMethod_1.gameMethod.objCopy(tradeConf.price);
        costItem[2] = Math.floor(costItem[2] * event.discount / 10000);
        let getItem = gameMethod_1.gameMethod.objCopy(tradeConf.sellItem);
        await this.ctx.state.master.subItem1(costItem);
        await this.ctx.state.master.addItem1(getItem);
        event.endTime = game_1.default.getNowTime();
        await this.update(info);
    }
    /**
     * 升级亲密度等级
     * @param daoyou 道友对象
     */
    async upgradeFavorLv(daoyou) {
        const favorLvConfig = gameCfg_1.default.daoyouFavorLv.getItemCtx(this.ctx, daoyou.did, daoyou.favorLv.toString());
        const jieYuanConf = gameCfg_1.default.daoyouJieYuan.getItemCtx(this.ctx, daoyou.did);
        const needFavor = favorLvConfig.upgradeFavor;
        const daoyouConfig = gameCfg_1.default.daoyouBase.getItemCtx(this.ctx, daoyou.did);
        if (needFavor > daoyou.favorCount - daoyou.decFavor) {
            return daoyou;
        }
        //已满级 无需升级
        if (daoyou.favorLv >= daoyouConfig.maxLv) {
            return daoyou;
        }
        if (favorLvConfig.canUpgradeSkill) {
            this.ctx.state.master.addWin("msg", daoyou.name + "需要突破");
            return daoyou;
        }
        daoyou.favorLv++;
        daoyou.decFavor += needFavor;
        //发送邮件回礼
        let mailModel = MailModel_1.MailModel.getInstance(this.ctx, this.id);
        let returnGift = daoyouConfig.returnGift;
        if (!returnGift) {
            this.ctx.throw("returnGift配置错误：" + daoyou.did);
        }
        let mailTitle = "回礼";
        let mailContent = daoyouConfig.name + "成功升级到" + daoyou.favorLv + "级，给你准备了一份薄利，敬请查收。";
        await mailModel.sendMail(mailTitle, mailContent, [returnGift]);
        //道友能力升级
        let rate = 10000;
        if (daoyou.state) {
            rate += jieYuanConf.rate;
        }
        let baseAbility = favorLvConfig.ability;
        daoyou.ability = baseAbility * (rate / 10000);
        //更新道友解锁关卡
        daoyou = this.refreshLevel(daoyou);
        //防止一次连续升级
        daoyou = await this.upgradeFavorLv(daoyou);
        await hook_1.hookNote(this.ctx, "dyqinmidu", 1);
        return daoyou;
    }
    /**
     * 结缘
     * @param did 道友Id
     */
    async jieYuan(did) {
        let info = await this.getInfo();
        let daoyou = info.daoyouMap[did];
        if (daoyou === null) {
            this.ctx.throw("道友未解锁");
        }
        const jieYuanConf = gameCfg_1.default.daoyouJieYuan.getItemCtx(this.ctx, did);
        //道友等级是否达到
        if (daoyou.favorLv < jieYuanConf.requiredFavorLv) {
            this.ctx.throw("道友亲密度等级未达到");
        }
        //扣除消耗道具
        await this.ctx.state.master.subItem1(gameMethod_1.gameMethod.objCopy(jieYuanConf.costItem));
        //增加道友能力
        daoyou.ability += daoyou.ability * (jieYuanConf.rate / 10000);
        //开放道友改名功能
        daoyou.state = 1;
        let jinxiuModel = ActJinxiuModel_1.ActJinxiuModel.getInstance(this.ctx, this.id);
        let jinxiuInfo = await jinxiuModel.getInfo();
        jinxiuInfo.list[jieYuanConf.tzid] = {
            step: 0,
            fx: 0 //是否已经分享（刚获得时触发）
        };
        await jinxiuModel.update(jinxiuInfo);
        info.daoyouMap[daoyou.did] = daoyou;
        await this.update(info);
    }
    /**
     * 道友改名
     * @param did 道友Id
     * @param newName 道友新名称
     */
    async rename(did, newName) {
        let info = await this.getInfo();
        let daoyou = info.daoyouMap[did];
        if (daoyou === null) {
            this.ctx.throw("道友未解锁");
        }
        //当前道友是否结缘
        if (!daoyou.state) {
            this.ctx.throw("结缘后可修改名称");
        }
        daoyou.name = newName;
        info.daoyouMap[daoyou.did] = daoyou;
        await this.update(info);
    }
    /**
     * 道友突破
     * @param did 道友Id
     */
    async break(did) {
        let info = await this.getInfo();
        let daoyou = info.daoyouMap[did];
        if (daoyou === null) {
            this.ctx.throw("道友未解锁");
        }
        const cfgDao = gameCfg_1.default.daoyouBase.getItemCtx(this.ctx, did);
        const cfg = gameCfg_1.default.daoyouSkillLv.getItemCtx(this.ctx, cfgDao.sid, daoyou.skillLv.toString());
        const favorLvConfig = gameCfg_1.default.daoyouFavorLv.getItemCtx(this.ctx, daoyou.did, daoyou.favorLv.toString());
        if (cfg.requiredFavorLv < daoyou.favorLv) {
            this.ctx.throw(daoyou.name + "不需要突破");
        }
        let needFavor = favorLvConfig.upgradeFavor;
        if (needFavor > daoyou.favorCount - daoyou.decFavor) {
            this.ctx.throw(daoyou.name + "亲密度不足");
        }
        await this.ctx.state.master.subItem1(cfg.need);
        daoyou.favorLv++;
        daoyou.skillLv++;
        daoyou.decFavor += needFavor;
        info.daoyouMap[daoyou.did] = daoyou;
        await this.update(info);
    }
    /**
     * 领取委托奖励
     * @param wid 委托事件ID
     */
    async getTrustRewards(wid) {
        let info = await this.getInfo();
        let event;
        for (const _event of Object.values(info.trustEvents)) {
            if (_event.eventId === wid) {
                event = _event;
                this.break;
            }
        }
        if (!event) {
            this.ctx.throw("参数错误");
        }
        if (event.time > game_1.default.getNowTime()) {
            this.ctx.throw("委托时间未到");
        }
        let daoyou = info.daoyouMap[event.did];
        if (!daoyou) {
            this.ctx.throw("道友未解锁");
        }
        const cfg = gameCfg_1.default.daoyouTrust.getItemCtx(this.ctx, event.id.toString());
        await this.ctx.state.master.addItem1(cfg.getItem);
        daoyou.favorCount += cfg.favor;
        daoyou = await this.upgradeFavorLv(daoyou);
        info.daoyouMap[daoyou.did] = daoyou;
        event.endTime = game_1.default.getNowTime();
        await this.update(info);
    }
    /**
     * 进行委托
     * @param wid 委托事件ID
     */
    async trust(wid) {
        let info = await this.getInfo();
        let event;
        for (const _event of Object.values(info.trustEvents)) {
            if (_event.eventId === wid) {
                event = _event;
                this.break;
            }
        }
        if (!event) {
            this.ctx.throw("参数错误");
        }
        const cfg = gameCfg_1.default.daoyouTrust.getItemCtx(this.ctx, event.id.toString());
        if (!cfg.costItem) {
            this.ctx.throw("配置错误");
        }
        let costItem = gameMethod_1.gameMethod.objCopy(cfg.costItem);
        //鼎炉特殊处理
        if (costItem[1].toString() === "902") {
            let actEquipModel = ActEquipModel_1.ActEquipModel.getInstance(this.ctx, this.id);
            let actEquip = await actEquipModel.getInfo();
            if (actEquip.box < costItem[2]) {
                this.ctx.throw("道具不足");
            }
            actEquip.box -= costItem[2];
            await actEquipModel.update(actEquip);
        }
        else {
            await this.ctx.state.master.subItem1(costItem);
        }
        event.time = game_1.default.getNowTime() + cfg.time;
        event.endTime = Number.MAX_SAFE_INTEGER;
        await hook_1.hookNote(this.ctx, "dyweituo", 1);
        await this.update(info);
    }
    /**
     * 获取技能参数
     * @param type 技能type
     */
    async getDaoYouSkill(type, needBfb = true) {
        let info = await this.getInfo();
        let totalSkill = 0;
        for (const daoyou of Object.values(info.daoyouMap)) {
            const daoyouConf = gameCfg_1.default.daoyouBase.getItemCtx(this.ctx, daoyou.did);
            const skConf = gameCfg_1.default.daoyouSkillLv.getItemCtx(this.ctx, daoyouConf.sid, daoyou.skillLv.toString());
            if (daoyouConf.sid === type) {
                totalSkill += skConf.value;
            }
        }
        const stConf = gameCfg_1.default.daoyouSkillType.getItemCtx(this.ctx, type);
        //是否是万分比
        if (stConf.rate && needBfb) {
            totalSkill = totalSkill / 10000;
        }
        return totalSkill;
    }
    /*****工具函数*******/
    /**
     * 道友切磋关卡数据
     * @param daoyou 道友对象
     */
    refreshLevel(daoyou) {
        const pveList = gameCfg_1.default.pveDaoyouList.getItemListCtx(this.ctx, daoyou.did);
        if (!daoyou.unlockLevel) {
            daoyou.unlockLevel = {};
        }
        for (const pveInfo of pveList) {
            if (pveInfo.favorLv <= daoyou.favorLv && !daoyou.unlockLevel[pveInfo.gid]) {
                daoyou.unlockLevel[pveInfo.gid] = {
                    state: 0,
                    red: 1
                };
            }
        }
        return daoyou;
    }
    /**
     * 获取随机数
     */
    getRandNum(tuEvents, iEvents, tEvents, max, strict) {
        //邀约1 委托2 交易3
        let weightCfg = tool_1.tool.mathcfg_kv(this.ctx, "daoyou_event_weight");
        //交易事件今日的刷新上限
        let tLimit = tool_1.tool.mathcfg_count1(this.ctx, "daoyou_trade");
        //邀约事件今日的刷新上限
        let iLimit = tool_1.tool.mathcfg_count1(this.ctx, "daoyou_invite");
        //委托事件今日的刷新上限
        let tuLimit = tool_1.tool.mathcfg_count1(this.ctx, "daoyou_trust");
        //每个事件单次的上限
        let tNow = tool_1.tool.mathcfg_count(this.ctx, "daoyou_trade");
        let iNow = tool_1.tool.mathcfg_count(this.ctx, "daoyou_invite");
        let tuNow = tool_1.tool.mathcfg_count(this.ctx, "daoyou_trust");
        let iRand = 0;
        let tRand = 0;
        let tuRand = 0;
        let iType = 1 /* invite */.toString();
        let tType = 3 /* trade */.toString();
        let tuType = 2 /* trust */.toString();
        for (let i = 0; i < max; i++) {
            let weightData = {};
            if (iRand < Math.min(iNow, iLimit - iEvents.length)) {
                weightData[iType] = weightCfg[iType];
            }
            if (tRand < Math.min(tNow, tLimit - tEvents.lengt)) {
                weightData[tType] = weightCfg[tType];
            }
            if (tuRand < Math.min(tuNow, tuLimit - tuEvents.length)) {
                weightData[tuType] = weightCfg[tuType];
            }
            let randKey = tool_1.tool.getRandomKey(weightData);
            switch (randKey) {
                case iType:
                    iRand++;
                    break;
                case tuType:
                    tuRand++;
                    break;
                case tType:
                    tRand++;
                    break;
            }
        }
        if (!strict) {
            iRand = Math.max(1, iRand);
            tuRand = Math.max(1, tuRand);
            tRand = Math.max(1, tRand);
            let count = 5; //5次随机不到就算了
            while (iRand + tuRand + tRand > max && count > 0) {
                let randKey = tool_1.tool.getRandomKey(weightCfg);
                switch (randKey) {
                    case iType:
                        if (iRand > 1) {
                            iRand--;
                        }
                        break;
                    case tuType:
                        if (tuRand > 1) {
                            tuRand--;
                        }
                        break;
                    case tType:
                        if (tRand > 1) {
                            tRand--;
                        }
                        break;
                }
                count--;
            }
        }
        return [iRand, tuRand, tRand];
    }
    rand(num1, num2) {
        let min = Math.min(num1, num2);
        let max = Math.max(num1, num2);
        return Math.round((max - min + 1) * Math.random() - 0.5) + min;
    }
    /**
     * 解锁交易事件
     */
    async unlockTradeEvent(event, info) {
        let actTaskModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
        let dids = Object.keys(info.daoyouMap);
        let weightData = {};
        for (const did of dids) {
            weightData[did] = Number(gameCfg_1.default.daoyouTradeRate.getItemCtx(this.ctx, did).weight);
        }
        //随机一个道友
        let did = tool_1.tool.getRandomKey(weightData);
        if (!did) {
            event.unlockTime = 0;
            event.endTime = game_1.default.getNowTime();
            console.error("解锁交易事件失败");
            return;
        }
        let daoyou = info.daoyouMap[did];
        const favorPool = Object.values(gameCfg_1.default.daoyouFavorPool.pool);
        if (!favorPool) {
            event.unlockTime = 0;
            event.endTime = game_1.default.getNowTime();
            console.error("favorPool配置错误：" + did);
            return;
        }
        //随机一个池ID
        let poolId;
        weightData = {};
        for (const [index, range] of favorPool.entries()) {
            if (range.minfavor <= daoyou.favorLv && range.maxfavor >= daoyou.favorLv) {
                for (const index in range.ratePool) {
                    weightData[Number(index) + 1] = range.ratePool[index];
                }
                poolId = tool_1.tool.getRandomKey(weightData);
                break;
            }
        }
        if (!poolId) {
            event.unlockTime = 0;
            event.endTime = game_1.default.getNowTime();
            console.error("poolId配置错误:" + JSON.stringify(weightData));
            return;
        }
        //随机一个道具
        const tradePool = Object.values(gameCfg_1.default.daoyouTradePool.pool);
        let items = [];
        for (const t of tradePool) {
            if (t.pid === Number(poolId) && t.dids.includes(Number(did)) && (t.kaiqi == "0" || await actTaskModel.kaiqi(t.kaiqi, 0) > 0)) {
                items.push(t.id);
            }
        }
        let itemId = game_1.default.getRandArr(items, 1)[0];
        if (!itemId) {
            event.unlockTime = 0;
            event.endTime = game_1.default.getNowTime();
            console.error("item配置错误：" + items + " did:" + did);
            return;
        }
        //随机一个折扣
        const disRate = gameCfg_1.default.daoyouTradeDiscount.getItemCtx(this.ctx, poolId.toString());
        let dis;
        weightData = {};
        for (const rate of disRate.rate) {
            weightData[rate[0]] = rate[1];
        }
        dis = tool_1.tool.getRandomKey(weightData);
        if (!dis) {
            event.unlockTime = 0;
            event.endTime = game_1.default.getNowTime();
            console.error("dis配置错误" + disRate);
            return;
        }
        event.sid = this.randDiaLogue(daoyou.did, 3 /* trade */);
        event.id = itemId;
        event.discount = Number(dis);
        event.endTime = event.unlockTime + 86400;
        event.unlockTime = 0;
        event.did = daoyou.did;
        event.red = 1;
    }
    /**
     * 解锁邀约事件
     */
    async unlockInviteEvent(event, info) {
        let actTaskModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
        let dids = Object.values(info.daoyouMap);
        let minLv = Number.MAX_SAFE_INTEGER;
        let maxLv = 0;
        let weightData = {};
        for (const daoyou of dids) {
            weightData[daoyou.did] = 1000 - (5 * daoyou.favorLv);
            if (daoyou.favorLv < minLv) {
                minLv = daoyou.favorLv;
            }
            if (daoyou.favorLv > maxLv) {
                maxLv = daoyou.favorLv;
            }
        }
        //随机一个派遣道友
        let did = tool_1.tool.getRandomKey(weightData);
        if (!did) {
            event.unlockTime = 0;
            event.endTime = game_1.default.getNowTime();
            console.error("unlockInviteEvent did 配置错误" + JSON.stringify(weightData));
            return;
        }
        //道友设置为派遣状态
        let daoyou = info.daoyouMap[did];
        const inviteBase = Object.values(gameCfg_1.default.daoyouInviteBase.pool);
        let favorBase;
        for (const base of inviteBase) {
            if (base.minfavor <= daoyou.favorLv && base.maxfavor >= daoyou.favorLv) {
                favorBase = base;
            }
        }
        if (!favorBase) {
            event.unlockTime = 0;
            event.endTime = game_1.default.getNowTime();
            console.error("favorBase 配置错误" + JSON.stringify(daoyou));
            return;
        }
        //是否出大奖
        let rate = Math.min(3000, Math.max((daoyou.favorLv - 45) * 100, 0));
        let poolId = favorBase.pid;
        if (this.isWin(rate)) {
            poolId = favorBase.topPool;
        }
        //随机奖励
        const rewardPool = Object.values(gameCfg_1.default.daoyouInvitePool.pool);
        weightData = {};
        for (const pool of rewardPool) {
            if (Number(pool.pid) === poolId && pool.dids.includes(Number(did))
                && (pool.kaiqi == "0" || await actTaskModel.kaiqi(pool.kaiqi, 0) > 0)) {
                weightData[poolId] = pool.rate;
            }
        }
        let _rewardId = tool_1.tool.getRandomKey(weightData);
        if (!_rewardId) {
            event.unlockTime = 0;
            event.endTime = game_1.default.getNowTime();
            console.error("unlockInviteEvent _reward 配置错误" + JSON.stringify(weightData));
            return;
        }
        //计算助力条件
        const _reward = gameCfg_1.default.daoyouInvitePool.getItemCtx(this.ctx, _rewardId);
        //两个人派遣
        if (favorBase.num === 2) {
            event.state = 3;
        }
        else {
            //一个人派遣
            event.state = this.isWin(5000) ? 1 : 2;
        }
        //随机道友能力
        let needAb = this.generateRandomValue(daoyou.ability, tool_1.tool.mathcfg_count(this.ctx, "daoyou_zhuli_ab_range"), tool_1.tool.mathcfg_item(this.ctx, "daoyou_zhuli_ab_range"));
        event.needAb = needAb;
        //随机道友等级
        let needLv = this.generateRandomValue(daoyou.favorLv, tool_1.tool.mathcfg_count(this.ctx, "daoyou_zhuli_lv_range"), tool_1.tool.mathcfg_item(this.ctx, "daoyou_zhuli_lv_range"));
        //等级不超过现有道友的最低等级与最高等级
        needLv = Math.min(needLv, maxLv);
        needLv = Math.max(needLv, minLv);
        event.needLv = needLv;
        //是否出现助力  助力标识为1 && 命中概率
        event.sid = this.randDiaLogue(daoyou.did, 1 /* invite */);
        event.helpState = (_reward.help && this.isWin(_reward.rate)) ? 1 : 0;
        //随机助力道友
        if (event.helpState) {
            if (this.isWin(tool_1.tool.mathcfg_count(this.ctx, "daoyou_zhuli_rate"))) {
                let lockDaoYou = [];
                for (const _daoyou of Object.values(gameCfg_1.default.daoyouBase.pool)) {
                    if (info.daoyouMap[_daoyou.id]) {
                        lockDaoYou.push(_daoyou.id);
                    }
                }
                if (lockDaoYou.length === 0) {
                    lockDaoYou = Object.keys(info.daoyouMap);
                }
                let helpDaoYou = game_1.default.getRandArr(lockDaoYou, 1)[0];
                if (!helpDaoYou) {
                    helpDaoYou = "1";
                }
                event.help = helpDaoYou;
            }
            else {
                let helpDaoYou = game_1.default.getRandArr(Object.keys(info.daoyouMap), 1)[0];
                if (!helpDaoYou) {
                    helpDaoYou = "1";
                }
                event.help = helpDaoYou;
            }
        }
        event.rewardId = _rewardId;
        event.baseId = favorBase.id;
        event.endTime = event.unlockTime + 86400;
        event.did = daoyou.did;
        //解锁
        event.unlockTime = 0;
        event.red = 1;
    }
    /**
     * 解锁委托事件
     */
    async unlockTrustEvent(event, info) {
        let dids = Object.keys(info.daoyouMap);
        let weightData = {};
        for (const did of dids) {
            weightData[did] = Number(gameCfg_1.default.daoyouTradeRate.getItemCtx(this.ctx, did).weight);
        }
        //随机一个道友
        let did = tool_1.tool.getRandomKey(weightData);
        if (!did) {
            event.unlockTime = 0;
            event.endTime = game_1.default.getNowTime();
            console.error("解锁委托事件失败");
            return;
        }
        event.did = did;
        let actTaskModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
        //随机奖励
        let unlockNum = Object.keys(info.daoyouMap);
        const trustPool = Object.values(gameCfg_1.default.daoyouTrust.pool);
        weightData = {};
        for (const [index, t] of trustPool.entries()) {
            if (t.num <= unlockNum.length && (t.kaiqi == "0" || await actTaskModel.kaiqi(t.kaiqi, 0) > 0)) {
                weightData[t.id] = t.rate;
            }
        }
        let tr = tool_1.tool.getRandomKey(weightData);
        if (!tr) {
            event.endTime = game_1.default.getNowTime();
            event.unlockTime = 0;
            console.error("tr配置错误: " + weightData);
            return;
        }
        const result = gameCfg_1.default.daoyouTrust.getItem(tr);
        if (null === result) {
            event.unlockTime = 0;
            event.endTime = game_1.default.getNowTime();
            console.error("result配置错误: " + tr);
            return;
        }
        event.sid = this.randDiaLogue(did, 2 /* trust */);
        event.endTime = event.unlockTime + 86400;
        event.id = Number(result.id);
        //解锁
        event.unlockTime = 0;
        event.red = 1;
    }
    /**
     * 是否中奖（万分比）
     */
    isWin(rate) {
        const randomNumber = Math.floor(Math.random() * 10001);
        return randomNumber <= rate;
    }
    /**
     * 随机对白
     */
    randDiaLogue(did, type) {
        //随机对话
        const dCfg = gameCfg_1.default.daoyouDialogueList.getItemListCtx(this.ctx, did);
        if (!dCfg) {
            return "";
        }
        let dList = [];
        for (const cfg of dCfg) {
            if (cfg.type === type) {
                dList.push(cfg);
            }
        }
        let d = game_1.default.getRandArr(dList, 1)[0];
        if (!d) {
            return "";
        }
        return d.sid;
    }
    /**
     * 随机值
     * @param baseValue 基础值
     * @param number 随机因子
     * @param randomRange 可随机的方位
     * @return 基础值 + 随机出来的值（只能是随机因子的倍数）
     */
    generateRandomValue(baseValue, randomNumber, randomRange) {
        let randomChange = Math.floor(Math.random() * (randomRange[1] - randomRange[0] + 1)) + randomRange[0];
        while (Math.abs(randomChange) % randomNumber !== 0) {
            randomChange = Math.floor(Math.random() * (randomRange[1] - randomRange[0] + 1)) + randomRange[0];
        }
        return baseValue + randomChange;
    }
    /**
     * 作假
     */
    zuojia(num, events, type) {
        let hour = game_1.default.getHour();
        events = Object.values(events)
            .filter(eventInfo => {
            return !(eventInfo && eventInfo.unlockTime <= game_1.default.getNowTime());
        });
        for (let i = 0; i < num; i++) {
            switch (type) {
                case 1 /* invite */:
                    events.push({
                        eventId: this.getId(1 /* invite */.toString(), hour, i),
                        did: "",
                        baseId: "",
                        red: 0,
                        out1: "",
                        out2: "",
                        help: "",
                        rewardId: "",
                        inviteEndTime: 0,
                        helpState: 0,
                        state: 0,
                        endTime: 0,
                        needAb: 0,
                        needLv: 0,
                        unlockTime: game_1.default.getNowTime() - 1,
                        type: 1 /* invite */,
                        sid: "",
                    });
                    break;
                case 3 /* trade */:
                    events.push({
                        eventId: this.getId(3 /* trade */.toString(), hour, i),
                        id: 0,
                        discount: 0,
                        red: 0,
                        did: "",
                        endTime: 0,
                        unlockTime: game_1.default.getNowTime() - 1,
                        type: 3 /* trade */,
                        sid: "",
                    });
                    break;
                case 2 /* trust */:
                    events.push({
                        eventId: this.getId(2 /* trust */.toString(), hour, i),
                        did: "",
                        id: 0,
                        red: 0,
                        endTime: 0,
                        unlockTime: game_1.default.getNowTime() - 1,
                        time: 0,
                        type: 2 /* trust */,
                        sid: "",
                    });
                    break;
                default:
                    this.ctx.throw("未处理类型" + type);
            }
        }
        return events;
    }
    getId(type, hour, index) {
        let sHour = hour.toString().padStart(2, '0');
        let baseId = game_1.default.getTodayId().toString();
        return baseId + sHour + type + index;
    }
}
exports.ActDaoyouModel = ActDaoyouModel;
//# sourceMappingURL=ActDaoyouModel.js.map