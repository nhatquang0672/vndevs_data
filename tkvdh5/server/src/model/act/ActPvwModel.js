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
exports.ActPvwModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const Xys = __importStar(require("../../../common/Xys"));
const tool_1 = require("../../util/tool");
const gameMethod_1 = require("../../../common/gameMethod");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const game_1 = __importDefault(require("../../util/game"));
const ActPvwFightModel_1 = require("./ActPvwFightModel");
const RdsUserModel_1 = require("../redis/RdsUserModel");
const hook_1 = require("../../util/hook");
const setting_1 = __importDefault(require("../../crontab/setting"));
/**
 * 试炼
 */
class ActPvwModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actPvw"; //用于存储key 和  输出1级key
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
        let monId = "";
        let cfgMonList = gameCfg_1.default.monPvwList.getItemList("1");
        if (cfgMonList != null) {
            let _item = game_1.default.getProbRandItem(0, cfgMonList, "prob");
            if (_item != null) {
                monId = _item.id;
            }
        }
        return {
            histMax: 0,
            weekCount: 0,
            weekMax: 0,
            nowId: 0,
            monId: monId,
            rwdId: 0,
            resetNum: 0,
            selEquip: {},
            selId: "",
            posnum: 2,
            pos: {},
            //下次发我周奖励时间
            weekRwdTime: this.getNextWeekRwdTime(),
            weekOutTime: 0,
            dayAt: 0,
            dayMax: 0,
            hfVer: "",
            bugVer: "1",
            bug: 1
        };
    }
    /**
     *  获取下次发周奖时间
     * 下次可以领取周邮件时间 本周日晚上10点半 开始
     * 直接吧时间给前端 前端发来领奖要求 直接给? 或者发奖励?
     * pvw? 如果很久没玩 一上线 就领到了 X周之前的奖励
     * //根据周时间 发送那周的
     * @returns
     */
    getNextWeekRwdTime() {
        //本周 日 22点 30 分
        let pvw_week_time = tool_1.tool.mathcfg_item(this.ctx, "pvw_week_time");
        let weekRwdTime = game_1.default.getWeek0(this.ctx.state.newTime) + pvw_week_time[0];
        if (this.ctx.state.newTime >= weekRwdTime) {
            //时间过了 就下周
            weekRwdTime += 86400 * 7;
        }
        return weekRwdTime;
    }
    /**
     * 排行发放中 禁赛期间
     */
    clickSleep() {
        //本周 日 22点 30 分
        let pvw_week_time = tool_1.tool.mathcfg_item(this.ctx, "pvw_week_time");
        let weekRwdTime = game_1.default.getWeek0(this.ctx.state.newTime) + pvw_week_time[0];
        if (this.ctx.state.newTime >= weekRwdTime) {
            //时间到了 禁赛
            this.ctx.throw("周奖励结算中,明天再来吧");
        }
    }
    /**
     * @returns
     */
    async getInfo() {
        let info = await super.getInfo();
        if (info.resetNum == null) {
            info.resetNum = 0;
        }
        if (info.weekCount == null || info.bugVer == null) {
            info.bugVer = "1";
            info.weekCount = 1;
        }
        let isupdate = false;
        if (info.hfVer == null) {
            info.hfVer = "";
        }
        let heid = await this.getHeIdByUuid(this.id);
        let rdsHdcid = "x";
        let cfgSysHefu = setting_1.default.getSetting("1", "sys_hefu");
        if (cfgSysHefu != null && cfgSysHefu.list[heid] != null) {
            let hfAt = cfgSysHefu.list[heid].newVer;
            if (info.hfVer != hfAt) {
                info.hfVer = hfAt;
                info.dayMax = 0;
                //重置
                info.weekMax = 0;
                info.nowId = 0;
                info.rwdId = 0;
                info.selEquip = {};
                info.selId = "";
                info.pos = {};
                info.resetNum = 0;
                let cfgMonList = gameCfg_1.default.monPvwList.getItemList("1");
                if (cfgMonList != null) {
                    let _item = game_1.default.getProbRandItem(0, cfgMonList, "prob");
                    if (_item != null) {
                        info.monId = _item.id;
                    }
                }
                isupdate = true;
                heid = cfgSysHefu.list[heid].oldSid; //最后一次奖励检测是否发放
                rdsHdcid = "old";
            }
        }
        //周奖励检查发放
        if (this.ctx.state.newTime >= info.weekRwdTime) {
            //排行榜
            let pvwRdsUserModel = RdsUserModel_1.RdsUserModel.getInstance(this.ctx, Xys.RdsUser.pvw, heid, rdsHdcid, game_1.default.getWeekId(info.weekRwdTime));
            let _myr = await pvwRdsUserModel.zRevrank(this.id);
            if (_myr != null) {
                //有排名才发
                let myrid = _myr + 1;
                //获取排行奖励
                for (const _id in gameCfg_1.default.pvwRankrwd.pool) {
                    let _cfg = gameCfg_1.default.pvwRankrwd.pool[_id];
                    if (myrid >= _cfg.start && myrid <= _cfg.end) {
                        await this.ctx.state.master.sendMail(this.id, {
                            title: `试练关卡奖励`,
                            content: `恭喜您在试炼关卡中表现优异，获得第${myrid}名，以下为您的奖励，请注意查收。`,
                            items: _cfg.rwd,
                        });
                        break;
                    }
                }
            }
            info.weekCount = Math.ceil((this.ctx.state.newTime - info.weekRwdTime) / 86400 / 7);
            info.weekCount = Math.max(1, info.weekCount);
            info.weekRwdTime = this.getNextWeekRwdTime(); //下周发奖时间
            isupdate = true;
        }
        //每周重置
        if (this.ctx.state.newTime >= info.weekOutTime) {
            //重置
            info.nowId = 0;
            info.weekMax = 0;
            info.rwdId = 0;
            info.selEquip = {};
            info.selId = "";
            info.pos = {};
            let cfgMonList = gameCfg_1.default.monPvwList.getItemList("1");
            if (cfgMonList != null) {
                let _item = game_1.default.getProbRandItem(0, cfgMonList, "prob");
                if (_item != null) {
                    info.monId = _item.id;
                }
            }
            // info.posnum = 2;
            info.weekOutTime = game_1.default.getWeek0(this.ctx.state.newTime) + 604800;
            isupdate = true;
        }
        //重置关卡，重置关卡奖励，重置装备。装备的开槽不重置。
        if (info.dayAt == null) {
            info.dayAt = 0;
        }
        if (this.ctx.state.new0 > info.dayAt) {
            info.dayAt = this.ctx.state.newTime;
            info.dayMax = 0;
            //重置
            info.nowId = 0;
            info.rwdId = 0;
            info.selEquip = {};
            info.selId = "";
            info.pos = {};
            info.resetNum = 0;
            let cfgMonList = gameCfg_1.default.monPvwList.getItemList("1");
            if (cfgMonList != null) {
                let _item = game_1.default.getProbRandItem(0, cfgMonList, "prob");
                if (_item != null) {
                    info.monId = _item.id;
                }
            }
            isupdate = true;
        }
        if (info.bug != 1 && parseInt(this.ctx.state.sid) < 75) {
            info.bug = 1;
            isupdate = true;
            let pvwRdsUserModel = RdsUserModel_1.RdsUserModel.getInstance(this.ctx, Xys.RdsUser.pvw, await this.getHeIdByUuid(this.id), "x", game_1.default.getWeekId());
            await pvwRdsUserModel.zSet(this.id, info.weekMax);
        }
        if (isupdate) {
            await this.update(info);
        }
        return info;
    }
    async getOutPut() {
        let info = await this.getInfo();
        return info;
    }
    //开格子
    async open() {
        let info = await this.getInfo();
        info.posnum += 1;
        //道具配置
        let poscfg = gameCfg_1.default.pvwPos.getItemCtx(this.ctx, info.posnum.toString());
        //扣除道具
        await this.ctx.state.master.subItem2(poscfg.need);
        await this.update(info);
        await hook_1.hookNote(this.ctx, "pveSlCao", 1);
    }
    //放弃装备
    async cancel() {
        let info = await this.getInfo();
        //当前是否处于 选择装备装填
        if (gameMethod_1.gameMethod.pvwStatic(info) != "sel") {
            this.ctx.throw("状态错误" + gameMethod_1.gameMethod.pvwStatic(info));
        }
        if (info.selId != "") {
            this.ctx.throw("已经选择");
        }
        //发奖励记录
        info.rwdId += 1;
        //保存上次选中装备
        info.selId = "0";
        //如果接下去 还是选装备 那就清除本次选择信息
        if (gameMethod_1.gameMethod.pvwStatic(info) == "sel") {
            info.selEquip = {};
            info.selId = "";
        }
        else {
            //保存上次选中装备
            info.selId = "0";
        }
        info.selEquip = this.randEquip(info);
        await this.update(info);
    }
    //选装备
    async sel(id, pos) {
        pos = Math.floor(Number(pos));
        let info = await this.getInfo();
        //当前是否处于 选择装备装填
        if (gameMethod_1.gameMethod.pvwStatic(info) != "sel") {
            this.ctx.throw("状态错误" + gameMethod_1.gameMethod.pvwStatic(info));
        }
        //装备ID合法
        if (info.selEquip[id] == null) {
            this.ctx.throw("selIdErr:" + id);
        }
        if (info.selId != "") {
            this.ctx.throw("已经选择");
        }
        //选中的装备配置
        let sel_ecfg = gameCfg_1.default.pvwEquip.getItemCtx(this.ctx, info.selEquip[id]);
        //pos合法
        if (pos <= 0) {
            this.ctx.throw(`pos_err`);
        }
        //指定格子 开了没
        if (pos > info.posnum) {
            this.ctx.throw(`格子还没开`);
        }
        //指定放入的格子有东西
        if (info.pos[pos] != null) {
            //同种装备
            if (info.pos[pos].type == sel_ecfg.type) {
                let pvw_equipMaxLv = tool_1.tool.mathcfg_count(this.ctx, "pvw_equipMaxLv"); //试炼装备最高等级
                if (info.pos[pos].level >= pvw_equipMaxLv) {
                    this.ctx.throw(`已经满级`);
                }
                //等级++
                info.pos[pos].level += sel_ecfg.lvadd;
                //最高级限制
                info.pos[pos].level = Math.min(info.pos[pos].level, pvw_equipMaxLv);
            }
            else {
                //不是同种装备 换掉
                info.pos[pos] = {
                    type: sel_ecfg.type,
                    level: sel_ecfg.lvadd,
                };
            }
        }
        else {
            //放入空位
            info.pos[pos] = {
                type: sel_ecfg.type,
                level: sel_ecfg.lvadd,
            };
        }
        //发奖励记录
        info.rwdId += 1;
        //如果接下去 还是选装备 那就清除本次选择信息
        if (gameMethod_1.gameMethod.pvwStatic(info) == "sel") {
            info.selEquip = {};
            info.selId = "";
        }
        else {
            //保存上次选中装备
            info.selId = id;
        }
        info.selEquip = this.randEquip(info);
        await this.update(info);
    }
    // async update(info: Info, keys?: string[]): Promise<void> {
    //     //处于选择状态 //检查要不要刷装备
    //     let loop:boolean = true
    //     while(loop && info.nowId > info.rwdId){
    //         loop = false
    //         if (gameMethod.isEmpty(info.selEquip) ) {
    //             //去除选中状态
    //             info.selId = "";
    //             //重新随机
    //             info.selEquip = this.randEquip(info.rwdId);
    //             if(gameMethod.isEmpty(info.selEquip) == true){
    //                 info.rwdId += 1
    //             }
    //         }
    //     }
    //     super.update(info, keys);
    // }
    /**
     * 随机装备 (不重复)
     */
    randEquip(info) {
        let selEquip = {};
        while (info.nowId > info.rwdId) {
            let pvwMonster = gameCfg_1.default.pvwMonster.getItemCtx(this.ctx, (info.rwdId + 1).toString());
            if (pvwMonster.prob.length <= 0) {
                info.rwdId += 1;
                continue;
            }
            for (let index = 1; index <= 3; index++) {
                let _item = game_1.default.getProbByItems(pvwMonster.prob, 0, 1);
                let clist = [];
                let _list = gameCfg_1.default.pvwEquipList.getItemListCtx(this.ctx, _item[0]);
                let hasEid = [];
                for (const _li of _list) {
                    if (hasEid.indexOf(_li.id) != -1) {
                        continue;
                    }
                    clist.push([_li.id, 1]);
                }
                let _item1 = game_1.default.getProbByItems(clist, 0, 1);
                if (_item1 == null) {
                    continue;
                }
                selEquip[index.toString()] = _item1[0];
            }
            info.selId = "";
            return selEquip;
        }
        return selEquip;
    }
    //打架
    async fight() {
        //奖励发放期间 不能打
        this.clickSleep();
        //拼凑属性
        //遍历所有装备
        let info = await this.getInfo();
        //当前是否处于 选择装备装填
        if (gameMethod_1.gameMethod.pvwStatic(info) != "fight") {
            this.ctx.throw("状态错误" + gameMethod_1.gameMethod.pvwStatic(info));
        }
        //开始打架
        let actPvwFightModel = ActPvwFightModel_1.ActPvwFightModel.getInstance(this.ctx, this.id);
        if ((await actPvwFightModel.fight_one(info)) != 1) {
            //失败
            return;
        }
        //胜利
        info.nowId += 1;
        let cfgMonList = gameCfg_1.default.monPvwList.getItemList((info.nowId + 1).toString());
        if (cfgMonList != null) {
            let _item = game_1.default.getProbRandItem(0, cfgMonList, "prob");
            if (_item != null) {
                info.monId = _item.id; //抽取下一次要打的怪物
            }
        }
        if (info.nowId > info.dayMax) {
            info.dayMax = info.nowId;
        }
        //周上限
        if (info.nowId > info.weekMax) {
            //记录周上限
            info.weekMax = info.nowId;
            //排行榜更新
            let pvwRdsUserModel = RdsUserModel_1.RdsUserModel.getInstance(this.ctx, Xys.RdsUser.pvw, await this.getHeIdByUuid(this.id), "x", game_1.default.getWeekId());
            await pvwRdsUserModel.zSet(this.id, info.weekMax);
            //历史上限
            if (info.nowId > info.histMax) {
                //记录
                info.histMax = info.nowId;
                await hook_1.hookNote(this.ctx, "pveSlMax", info.histMax);
            }
        }
        //选择装备装填
        info.selEquip = this.randEquip(info);
        await this.update(info);
        await hook_1.hookNote(this.ctx, "pveSlPk", 1);
        await hook_1.hookNote(this.ctx, "pveSlCoin", 1);
    }
    //重置
    async reset() {
        let info = await this.getInfo();
        if (info.resetNum != 0) {
            this.ctx.throw("今日已重置");
        }
        //重置
        info.resetNum += 1;
        info.nowId = 0;
        info.rwdId = 0;
        info.selEquip = {};
        info.selId = "";
        info.pos = {};
        let cfgMonList = gameCfg_1.default.monPvwList.getItemList("1");
        if (cfgMonList != null) {
            let _item = game_1.default.getProbRandItem(0, cfgMonList, "prob");
            if (_item != null) {
                info.monId = _item.id;
            }
        }
        await this.update(info);
    }
    //速战
    async quick(ad) {
        let info = await this.getInfo();
        let pvw_quickNum = tool_1.tool.mathcfg_count(this.ctx, "pvw_quickNum");
        if (info.histMax - info.nowId <= pvw_quickNum * info.weekCount) {
            this.ctx.throw(`不能速战`);
        }
        if (ad <= 0) {
            //没看广告 扣钱
            let pvw_quickNeed = tool_1.tool.mathcfg_item(this.ctx, "pvw_quickNeed");
            await this.ctx.state.master.subItem1(pvw_quickNeed);
        }
        await hook_1.hookNote(this.ctx, "pveSlPk", info.histMax - info.nowId);
        //跳关
        let jumpId = info.histMax - pvw_quickNum * info.weekCount;
        //首通奖励
        let rwditem = [];
        do {
            //当前关卡周奖励
            info.nowId += 1;
            let pvwMonster = gameCfg_1.default.pvwMonster.getItemCtx(this.ctx, info.nowId.toString());
            if (info.nowId > info.histMax) {
                info.histMax = info.nowId;
                rwditem = gameMethod_1.gameMethod.addArr(rwditem, pvwMonster.frwd);
            }
            if (info.nowId > info.weekMax) {
                info.weekMax = info.nowId;
            }
            if (info.nowId > info.dayMax) {
                info.dayMax = info.nowId;
                rwditem = game_1.default.addArr(rwditem, pvwMonster.drwd);
            }
        } while (info.nowId < jumpId);
        //选择装备装填
        info.selEquip = this.randEquip(info);
        await this.update(info);
        //加上首通奖励
        if (rwditem.length > 0) {
            //道具整理
            rwditem = gameMethod_1.gameMethod.mergeArr(rwditem);
            await this.ctx.state.master.addItem2(rwditem); //加道具
        }
        await this.ctx.state.master.addWin("msg", `已快速挑战至${info.nowId}层`);
        return {
            type: 1,
            msg: "",
            data: null,
        };
    }
    /**
     * 广告下单检查
     */
    async checkUp() {
        let info = await this.getInfo();
        let pvw_quickNum = tool_1.tool.mathcfg_count(this.ctx, "pvw_quickNum");
        if (info.histMax - info.nowId <= pvw_quickNum * info.weekCount) {
            this.ctx.throw(`不能速战`);
        }
        return {
            type: 1,
            msg: "试炼速战",
            data: null,
        };
    }
}
exports.ActPvwModel = ActPvwModel;
//# sourceMappingURL=ActPvwModel.js.map