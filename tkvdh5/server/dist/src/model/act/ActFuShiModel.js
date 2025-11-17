"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActFuShiModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const Xys_1 = require("../../../common/Xys");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const game_1 = __importDefault(require("../../util/game"));
const tool_1 = require("../../util/tool");
const gameMethod_1 = require("../../../common/gameMethod");
const ActFuShiYhModel_1 = require("./ActFuShiYhModel");
const cache_1 = __importDefault(require("../../util/cache"));
const ActPveInfoModel_1 = require("./ActPveInfoModel");
const hook_1 = require("../../util/hook");
const HdPriCardModel_1 = require("../hd/HdPriCardModel");
const lock_1 = __importDefault(require("../../util/lock"));
const SevPaoMaModel_1 = require("../sev/SevPaoMaModel");
/**
 * 符石
 */
class ActFuShiModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actFuShi"; //用于存储key 和  输出1级key
        this.outIsAu = true; //下发数据是否用au下发
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
    //初始化
    init() {
        return {
            time: 0,
            tili: {
                con: 0,
                at: this.ctx.state.newTime,
                linshi: {
                    type: 0,
                    id: "",
                    pf: 0,
                    eps: {},
                    isp: 0,
                    isNew: 0,
                    isTask: 0 //是不是任务订单 0否 1是
                }
            },
            fangan: "",
            pf: {},
            fsku: {
                level: 0,
                exp: 0,
                upType: 0,
                endAt: 0,
                time: 0,
                lqAt: 0,
                list: {}
            },
            task: {},
            shouce: {
                id: 0,
                hook: {},
                useId: 0,
            },
            tujian: {},
            useType: 1,
            nowId: "1000",
            jitan: {},
            jtEpVer: 1,
            bugVer: 1,
            taskVer: 1,
            opAt: 0
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        if (info.useType == null) {
            info.useType = 1;
        }
        if (info.nowId == null) {
            info.nowId = "1000";
        }
        if (info.jtEpVer == null) {
            info.jtEpVer = 1;
        }
        if (info.shouce != null && info.shouce.id > 0 && info.shouce.useId == null) {
            info.shouce.useId = 1;
        }
        if (info.bugVer != 1) {
            info.bugVer = 1;
            for (const _itemId in info.pf) {
                if (info.tujian[_itemId] == null) {
                    info.tujian[_itemId] = 1;
                }
            }
        }
        let cfgMathCount = tool_1.tool.mathcfg_count(this.ctx, "fushi_tili");
        let cfgMathCount1 = tool_1.tool.mathcfg_count1(this.ctx, "fushi_tili");
        //恢复体力
        if (info.tili.con >= cfgMathCount) {
            info.tili.at = this.ctx.state.newTime + cfgMathCount1;
        }
        else {
            let addcon = Math.floor((this.ctx.state.newTime - (info.tili.at - cfgMathCount1)) / cfgMathCount1);
            if (addcon > 0) {
                info.tili.at += addcon * cfgMathCount1;
                info.tili.con += addcon;
                if (info.tili.con >= cfgMathCount) {
                    info.tili.con = cfgMathCount;
                    info.tili.at = this.ctx.state.newTime + cfgMathCount1;
                }
            }
        }
        //看广告冷却时间重置
        if (info.fsku.time < this.ctx.state.new0 + 3600 * 5 && this.ctx.state.newTime >= this.ctx.state.new0 + 3600 * 5) {
            info.fsku.time = this.ctx.state.newTime;
            info.fsku.lqAt = 0;
        }
        let isUpdate = false;
        //判定符石库是否进阶完成
        if (info.fsku.upType == 1) {
            if (info.fsku.endAt <= this.ctx.state.newTime) {
                info.fsku.upType = 0;
                info.fsku.level += 1;
                info.fsku.exp = 0;
                let cfgKu = gameCfg_1.default.fushiKuLevel.getItemCtx(this.ctx, info.fsku.level.toString());
                for (const leibie in cfgKu.lock) {
                    if (info.fsku.list[leibie] == null) {
                        info.fsku.list[leibie] = {};
                    }
                    for (let index = 1; index <= cfgKu.lock[leibie]; index++) {
                        if (info.fsku.list[leibie][index] != null) {
                            continue;
                        }
                        info.fsku.list[leibie][index] = {
                            itemid: "",
                            pf: 0,
                            eps: {},
                        };
                    }
                }
                if (info.fsku.level >= 3) {
                    let heid = await this.getHeIdByUuid(this.id);
                    await lock_1.default.setLock(this.ctx, "paoma", heid); //枷锁
                    let sevPaoMaModel = SevPaoMaModel_1.SevPaoMaModel.getInstance(this.ctx, heid);
                    await sevPaoMaModel.addList("3", [this.ctx.state.name, info.fsku.level.toString()]);
                }
                isUpdate = true;
            }
        }
        if (info.time < this.ctx.state.new0) {
            info.time = this.ctx.state.newTime;
            //刷新3个任务
            info.task = {};
            let get3 = this.getTask(3, info.shouce.useId);
            let xbid = 0;
            for (const taskid of get3) {
                xbid++;
                info.task[xbid.toString()] = { taskId: taskid, con: 0, rwd: 0 };
            }
            if (info.tili.linshi.id != "") {
                info.tili.linshi.isTask = 0;
                for (const xbid in info.task) {
                    if (info.task[xbid].rwd != 0) {
                        continue;
                    }
                    let cfg = gameCfg_1.default.fushiItem.getItemCtx(this.ctx, info.tili.linshi.id);
                    let cfgTask = gameCfg_1.default.fushiTask.getItemCtx(this.ctx, info.task[xbid].taskId);
                    if (cfg.kinds.indexOf(parseInt(cfgTask.kind)) != -1) {
                        info.tili.linshi.isTask = 1;
                        break;
                    }
                }
            }
            isUpdate = true;
        }
        //任务补丁
        if (info.taskVer != 1) {
            info.taskVer = 1;
            let hasIds = [];
            for (const _xbid in info.task) {
                hasIds.push(info.task[_xbid].taskId);
            }
            for (const _xbId in info.task) {
                let cfgTask1 = gameCfg_1.default.fushiTask.getItem(info.task[_xbId].taskId);
                if (cfgTask1 != null) {
                    continue;
                }
                let get1 = this.getTask(1, info.shouce.useId, hasIds)[0];
                info.task[_xbId] = { taskId: get1, con: 0, rwd: 0 };
                hasIds.push(get1);
            }
            isUpdate = true;
        }
        if (isUpdate) {
            await this.update(info, [""]);
        }
        return info;
    }
    /**
     * 返回数据
     */
    async getOutPut() {
        let info = await this.getInfo();
        return info;
    }
    /**
     * 解锁符石信息
     */
    async unlock() {
        let info = await this.getInfo();
        if (info.fsku.level > 0) {
            return;
        }
        let cfgMathCount = tool_1.tool.mathcfg_count(this.ctx, "fushi_tili");
        info.fsku.level = 1;
        let cfgKu = gameCfg_1.default.fushiKuLevel.getItemCtx(this.ctx, info.fsku.level.toString());
        for (const leibie in cfgKu.lock) {
            info.fsku.list[leibie] = {};
            for (let index = 1; index <= cfgKu.lock[leibie]; index++) {
                info.fsku.list[leibie][index] = {
                    itemid: "",
                    pf: 0,
                    eps: {},
                };
            }
        }
        info.tili.con = cfgMathCount;
        info.tili.at = this.ctx.state.newTime;
        //刷新3个任务
        info.task = {};
        let get3 = this.getTask(3, 1);
        let xbid = 0;
        for (const taskid of get3) {
            xbid++;
            info.task[xbid.toString()] = { taskId: taskid, con: 0, rwd: 0 };
        }
        //祭坛
        for (let index = 1; index <= 4; index++) {
            info.jitan[index.toString()] = {
                saveid: 1,
                cons: 0,
                epList: {},
                linshi: {}
            };
        }
        //手册
        info.shouce.id = 1;
        info.shouce.hook = {};
        info.shouce.useId = 1;
        info.jtEpVer += 1;
        await this.update(info, [""]);
        //符石 - 鱼获盛宴 - 解锁
        let actFuShiYhModel = ActFuShiYhModel_1.ActFuShiYhModel.getInstance(this.ctx, this.id);
        await actFuShiYhModel.unlock();
        let actPveInfoModel = await ActPveInfoModel_1.ActPveInfoModel.getInstance(this.ctx, this.id);
        let actPveInfo = await actPveInfoModel.getInfo();
        await this.addHook("536", actPveInfo.id - 1, true);
    }
    /**
     * 获取任务ID列表
     * @param num 获取个数
     * @param useId 使用手册ID
     */
    getTask(num, useId, hasIds = []) {
        let has = {};
        for (const _taskid of hasIds) {
            let _cfg = gameCfg_1.default.fushiTask.getItem(_taskid);
            if (_cfg == null) {
                continue;
            }
            if (has[_cfg.kind.toString()] == null) {
                has[_cfg.kind.toString()] = [];
            }
            has[_cfg.kind.toString()].push(_cfg.star);
        }
        let cfgFsTask = gameCfg_1.default.fushiTask.pool;
        let get3 = [];
        for (let index = 0; index < num; index++) {
            let tasks = [];
            for (const key in cfgFsTask) {
                let kind = cfgFsTask[key].kind.toString();
                if (has[kind] != null && has[kind].indexOf(cfgFsTask[key].star) != -1) {
                    continue;
                }
                if (cfgFsTask[key].suoshu.indexOf(useId) != -1) {
                    tasks.push(cfgFsTask[key]);
                    continue;
                }
                if (cfgFsTask[key].suoshu.indexOf(0) != -1) {
                    tasks.push(cfgFsTask[key]);
                    continue;
                }
            }
            let _item = game_1.default.getProbRandItem(0, tasks, "prob");
            if (_item == null) {
                continue;
            }
            get3.push(_item.id);
            if (has[_item.kind.toString()] == null) {
                has[_item.kind.toString()] = [];
            }
            has[_item.kind.toString()].push(_item.star);
        }
        return get3;
    }
    /**
     * 抽符石
     */
    async chou() {
        let info = await this.getInfo();
        //检测是否开加速器
        let minms = tool_1.tool.mathcfg_count(this.ctx, "fushi_minms") / 1000;
        if (info.opAt != null && info.opAt + minms > this.ctx.state.newTime) {
            this.ctx.throw(502, "本地时间异常,请重新登录!");
        }
        info.opAt = this.ctx.state.newTime;
        if (info.tili.con < 1) {
            this.ctx.throw("体力不足");
        }
        info.tili.linshi = {
            type: 0,
            id: "",
            pf: 0,
            eps: {},
            isp: 0,
            isNew: 0,
            isTask: 0 //是不是任务订单 0否 1是
        };
        //18	活力	5%概率不消耗体力
        if (game_1.default.rand(1, 10000) > await this.getChouEp_x("18", "1000")) {
            info.tili.con -= 1;
        }
        //扣除道具
        let useNowId = info.nowId; //本次使用的道具ID
        if (info.nowId != "1000") {
            //提高钓鱼不消耗饵料的概率。
            if (game_1.default.rand(1, 10000) > await this.getChouEp_x("6", info.nowId)) {
                //先判定道具够不够防卡住
                if (await this.ctx.state.master.subItem1([1, parseInt(info.nowId), 1], true) == true) {
                    await this.ctx.state.master.subItem1([1, parseInt(info.nowId), 1]);
                }
                else {
                    info.nowId = "1000";
                    useNowId = "1000";
                }
                //正常检测道具够不够
                if (info.nowId != "1000") {
                    if (await this.ctx.state.master.subItem1([1, parseInt(info.nowId), 1], true) == false) {
                        info.nowId = "1000"; //道具不够了 转默认
                    }
                }
            }
        }
        if (useNowId != "1000") {
            await hook_1.hookNote(this.ctx, "fushiUseItem", 1);
        }
        let hasKinds = [];
        for (const xbId in info.task) {
            if (info.task[xbId].rwd != 0) {
                continue;
            }
            let _kind = gameCfg_1.default.fushiTask.getItemCtx(this.ctx, info.task[xbId].taskId).kind;
            hasKinds.push(_kind);
        }
        //获得钓到的鱼儿
        let cfgPool = gameMethod_1.gameMethod.objCopy(gameCfg_1.default.fushiItem.pool);
        for (const key in cfgPool) {
            if (gameMethod_1.gameMethod.isEmpty(cfgPool[key].suoshu) == true || cfgPool[key].suoshu.indexOf(info.shouce.useId) == -1) {
                delete cfgPool[key]; //过滤不属于当前使用的鱼塘
                continue;
            }
            if (gameMethod_1.gameMethod.isEmpty(cfgPool[key].limit) == false && cfgPool[key].limit != parseInt(useNowId)) {
                delete cfgPool[key]; //过滤 特殊鱼饵限制
                continue;
            }
            if (cfgPool[key].leibie == 1) { //1：小型鱼
                // 8	小型鱼猎手	提高钓到小型鱼的概率。
                // 14	小型鱼克星	降低钓到小型鱼的概率。
                cfgPool[key].prob += Math.floor(cfgPool[key].prob * (await this.getChouEp_x("8", info.nowId) - await this.getChouEp_x("14", info.nowId)) / 10000);
            }
            if (cfgPool[key].leibie == 2) { // 2：中型鱼
                // 9	中型鱼猎手	提高钓到中型鱼的概率。
                // 15	中型鱼克星	降低钓到中型鱼的概率。
                cfgPool[key].prob += Math.floor(cfgPool[key].prob * (await this.getChouEp_x("9", info.nowId) - await this.getChouEp_x("15", info.nowId)) / 10000);
            }
            if (cfgPool[key].leibie == 3) { // 3：大型鱼
                // 10	大型鱼猎手	提高钓到大型鱼的概率。
                // 16	大型鱼克星	降低钓到大型鱼的概率。
                cfgPool[key].prob += Math.floor(cfgPool[key].prob * (await this.getChouEp_x("10", info.nowId) - await this.getChouEp_x("16", info.nowId)) / 10000);
            }
            if (cfgPool[key].leibie == 4) { // 4：水中生物
                // 11	生物学家	提高钓到水中生物的概率。
                cfgPool[key].prob += Math.floor(cfgPool[key].prob * await this.getChouEp_x("14", info.nowId) / 10000);
            }
            if (cfgPool[key].leibie == 5) { // 5：杂物
                // 13	拾荒	提高钓到杂物的概率。
                cfgPool[key].prob += Math.floor(cfgPool[key].prob * (await this.getChouEp_x("13", info.nowId) - await this.getChouEp_x("4", info.nowId)) / 10000);
            }
            if (info.nowId == cfgPool[key].limit.toString()) {
                // 12	高效	提高钓饵属性加成。
                cfgPool[key].prob += Math.floor(cfgPool[key].prob * await this.getChouEp_x("12", info.nowId) / 10000);
            }
            //21 赏金钓客	垂钓目标概率提高10%
            for (const _kind of cfgPool[key].kinds) {
                if (hasKinds.indexOf(_kind.toString()) != -1) {
                    cfgPool[key].prob += Math.floor(cfgPool[key].prob * await this.getChouEp_x("21", info.nowId) / 10000);
                    break;
                }
            }
        }
        let item = game_1.default.getProbRandItem(0, cfgPool, "prob");
        if (item == null) {
            this.ctx.throw("钓鱼失败");
            return;
        }
        //1. 鱼的长度随机范围=（鱼的长度下限，鱼的长度下限*（1+大鱼概率百）） 在范围内随机1个长度，并且不大于上限长度
        let pf = game_1.default.rand(item.changdu[0], item.changdu[0] * (10000 + await this.getChouEp_x("1", info.nowId)) / 10000);
        pf = parseFloat(pf.toFixed(1));
        pf = Math.min(pf, item.changdu[1]);
        //获取使用手册的配置   
        let cfgSc = gameCfg_1.default.fushiShouce.getItemCtx(this.ctx, info.shouce.useId.toString());
        //鱼逃跑的实际概率=max((渔场鱼逃跑的概率*(1+(鱼的长度-鱼的基础长度)/鱼的基础长度*0.3)-专注值),0)
        let tpProb = Math.max((cfgSc.taopao * (1 + (pf - item.changdu[0]) / item.changdu[0] * 0.3) - await this.getChouEp_x("5", info.nowId)), 0);
        if (game_1.default.rand(1, 10000) <= tpProb) {
            info.tili.linshi.type = 1;
            await this.update(info, ["tili", "linshi", "nowId"]);
            return;
        }
        //max(max((鱼的强度*(1+(鱼的长度-鱼的基础长度)/鱼的基础长度*0.3))-鱼线的强度,0)*3000
        let sg1 = Math.max((item.qiangdu * (1 + (pf - item.changdu[0]) / item.changdu[0] * 0.3)) - (await this.getChouEp_x("17", info.nowId)), 0);
        let ztProb = Math.max(sg1 * 3000, 0);
        if (game_1.default.rand(1, 10000) <= ztProb) {
            info.tili.linshi.type = 2;
            info.tili.linshi.id = item.id;
            if ([1, 2, 3, 4].indexOf(item.leibie) != -1 && info.pf[item.id] == null) {
                info.tili.linshi.isNew = 1;
            }
            await this.update(info, ["tili", "linshi", "nowId"]);
            return;
        }
        let isp = 0;
        let isnew = 0;
        let eps = {};
        if (gameMethod_1.gameMethod.isEmpty(item.eps) == false) {
            for (const key in item.eps) {
                // 鱼的属性值=鱼的基础属性+鱼的基础属性*（鱼的长度-鱼的最小长度）/鱼的最小长度*0.3
                eps[key] = Math.floor(item.eps[key] + item.eps[key] * (pf - item.changdu[0]) / item.changdu[0] * 0.3);
            }
        }
        if (info.pf[item.id] == null) {
            isnew = 1;
            info.pf[item.id] = 0;
        }
        if (info.pf[item.id] < pf) {
            isp = 1;
            info.pf[item.id] = pf;
        }
        let cfg = gameCfg_1.default.fushiItem.getItemCtx(this.ctx, item.id);
        if (cfg.pinzhi == 1) {
            await hook_1.hookNote(this.ctx, "fushiItem_pz1", 1);
        }
        if (cfg.pinzhi == 2) {
            await hook_1.hookNote(this.ctx, "fushiItem_pz2", 1);
        }
        if (cfg.pinzhi == 3) {
            await hook_1.hookNote(this.ctx, "fushiItem_pz3", 1);
        }
        if (cfg.pinzhi == 4) {
            await hook_1.hookNote(this.ctx, "fushiItem_pz4", 1);
        }
        if (cfg.pinzhi == 6) {
            await hook_1.hookNote(this.ctx, "fushiItem_pz6", 1);
        }
        //是不是任务订单 0否 1是
        let isTask = 0;
        for (const xbid in info.task) {
            if (info.task[xbid].rwd != 0) {
                continue;
            }
            let cfgTask = gameCfg_1.default.fushiTask.getItemCtx(this.ctx, info.task[xbid].taskId);
            if (cfg.kinds.indexOf(parseInt(cfgTask.kind)) != -1) {
                isTask = 1;
                break;
            }
        }
        info.tili.linshi = {
            type: 3,
            id: item.id,
            pf: pf,
            eps: eps,
            isp: isp,
            isNew: isnew,
            isTask: isTask //是不是任务订单 0否 1是
        };
        let outfKeys = ["tili", "pf", "nowId", "linshi"];
        //检测图鉴
        if ([1, 2, 3, 4].indexOf(item.leibie) != -1) {
            // 528	钓鱼	钓到{0}条鱼		后端处理
            // 529	钓鱼	钓到{0}条10cm以上的鱼		后端处理
            // 530	钓鱼	钓到{0}条20cm以上的鱼		后端处理
            // 531	钓鱼	钓到{0}条30cm以上的鱼		后端处理
            // 532	钓鱼	钓到{0}条40cm以上的鱼		后端处理
            // 533	钓鱼	钓到{0}条50cm以上的鱼		后端处理
            //任务
            await this.addHook("528", 1, false);
            if (pf >= 10) {
                await this.addHook("529", 1, false);
            }
            if (pf >= 20) {
                await this.addHook("530", 1, false);
            }
            if (pf >= 30) {
                await this.addHook("531", 1, false);
            }
            if (pf >= 40) {
                await this.addHook("532", 1, false);
            }
            if (pf >= 50) {
                await this.addHook("533", 1, false);
            }
        }
        //图鉴
        if (info.tujian[item.id] == null) {
            info.tujian[item.id] = 1;
            outfKeys.push("tujian");
        }
        await this.update(info, outfKeys);
        for (const _kind of item.kinds) {
            await this.addHook(_kind.toString(), 1, false);
        }
    }
    /**
     * 符石替换
     */
    async tihuan(wzid) {
        let info = await this.getInfo();
        if (info.tili.linshi.id == "") {
            await this.backData_u(["tili"]);
            await this.ctx.state.master.addWin("msg", "功法未抽取");
            return;
        }
        let fsItemid = info.tili.linshi.id;
        let cfgfsitem = gameCfg_1.default.fushiItem.getItemCtx(this.ctx, fsItemid);
        if (info.fsku.list[cfgfsitem.leibie.toString()] == null) {
            this.ctx.throw("类别未解锁");
        }
        if (info.fsku.list[cfgfsitem.leibie.toString()][wzid] == null) {
            this.ctx.throw("位置未解锁");
        }
        let oldItemid = info.fsku.list[cfgfsitem.leibie.toString()][wzid].itemid;
        if (oldItemid != null && oldItemid != "") { //如果之前有直接卖出
            let cfgold = gameCfg_1.default.fushiItem.getItemCtx(this.ctx, oldItemid);
            //鱼的基础价格*（1+（鱼的长度-鱼的长度下限）/鱼的长度下限*0.3）*（1+渔夫百分比）
            let count = cfgold.chushou[2];
            if (cfgold.chushou[0] == 1 && cfgold.chushou[1] == 907) {
                if (cfgold.changdu[0] > 0) {
                    count = count * (1 + (info.tili.linshi.pf - cfgold.changdu[0]) / cfgold.changdu[0] * 0.3) * (10000 + await this.getChouEp_x("7", info.nowId)) / 10000;
                }
                if (cfgold.leibie == 5) {
                    count += count * await this.getChouEp_x("20", "1000") / 10000;
                }
                //符石卡
                let hdPriCardModel = HdPriCardModel_1.HdPriCardModel.getInstance(this.ctx, this.id, Xys_1.PriCardType.fushi);
                let hdmoon = await hdPriCardModel.getInfo();
                if (hdmoon.btime < 0 || hdmoon.btime > this.ctx.state.newTime) {
                    count += count * 5 / 100;
                }
            }
            count = Math.floor(count);
            if (count > 0) {
                await this.ctx.state.master.addItem1([cfgold.chushou[0], cfgold.chushou[1], count], "fsItems");
                await this.addHook("534", count, false);
                if (cfgold.leibie == 5) {
                    await this.addHook("537", count, false);
                }
                if ([1, 2, 3, 4].indexOf(cfgold.leibie) != -1) {
                    await this.addHook("538", count, false);
                }
            }
            else {
                console.error("===出售价格0=====", info.tili.linshi.id);
            }
        }
        info.fsku.list[cfgfsitem.leibie.toString()][wzid] = {
            itemid: fsItemid,
            pf: info.tili.linshi.pf,
            eps: info.tili.linshi.eps
        };
        info.tili.linshi = {
            type: 0,
            id: "",
            pf: 0,
            eps: {},
            isp: 0,
            isNew: 0,
            isTask: 0 //是不是任务订单 0否 1是
        };
        await this.update(info, ["tili", "fsku", "pf"]);
    }
    /**
     * 符石出售
     */
    async chushou(type) {
        let info = await this.getInfo();
        let csid = info.tili.linshi.id;
        if (csid != "") {
            let cfg = gameCfg_1.default.fushiItem.getItemCtx(this.ctx, csid);
            if (type == 1) { //完成任务订单
                for (const xbid in info.task) {
                    if (info.task[xbid].rwd == 2) {
                        continue;
                    }
                    let cfgTask = gameCfg_1.default.fushiTask.getItemCtx(this.ctx, info.task[xbid].taskId);
                    if (cfg.kinds.indexOf(parseInt(cfgTask.kind)) != -1) {
                        info.task[xbid].con += 1;
                        if (info.task[xbid].con >= cfgTask.need) {
                            info.task[xbid].rwd = 1;
                        }
                    }
                }
                await this.ctx.state.master.addWin("msg", `提交成功`);
            }
            else {
                if (info.tili.linshi.type == 3) {
                    //鱼的基础价格*（1+（鱼的长度-鱼的长度下限）/鱼的长度下限*0.3）*（1+渔夫百分比）
                    let count = cfg.chushou[2];
                    if (cfg.chushou[0] == 1 && cfg.chushou[1] == 907) {
                        if (cfg.changdu[0] > 0) {
                            count = count * (1 + (info.tili.linshi.pf - cfg.changdu[0]) / cfg.changdu[0] * 0.3) * (10000 + await this.getChouEp_x("7", info.nowId)) / 10000;
                        }
                        if (cfg.leibie == 5) {
                            count += count * await this.getChouEp_x("20", "1000") / 10000;
                        }
                        //符石卡
                        let hdPriCardModel = HdPriCardModel_1.HdPriCardModel.getInstance(this.ctx, this.id, Xys_1.PriCardType.fushi);
                        let hdmoon = await hdPriCardModel.getInfo();
                        if (hdmoon.btime < 0 || hdmoon.btime > this.ctx.state.newTime) {
                            count += count * 5 / 100;
                        }
                    }
                    count = Math.floor(count);
                    if (count > 0) {
                        await this.ctx.state.master.addItem1([cfg.chushou[0], cfg.chushou[1], count], "fsItems");
                        await this.addHook("534", count, false);
                        if (cfg.leibie == 5) {
                            await this.addHook("537", count, false);
                        }
                        if ([1, 2, 3, 4].indexOf(cfg.leibie) != -1) {
                            await this.addHook("538", count, false);
                        }
                    }
                    else {
                        console.error("===出售价格0=====", csid);
                    }
                }
            }
            info.tili.linshi = {
                type: 0,
                id: "",
                pf: 0,
                eps: {},
                isp: 0,
                isNew: 0,
                isTask: 0 //是不是任务订单 0否 1是
            };
        }
        await this.update(info, ["tili", "rwd", "task"]);
    }
    /**
     * 升级符石库
     */
    async upKuLevel() {
        let info = await this.getInfo();
        if (info.fsku.upType != 0) {
            this.ctx.throw("进阶中");
        }
        let cfgku = gameCfg_1.default.fushiKuLevel.getItemCtx(this.ctx, info.fsku.level.toString());
        let cfgkuNext = gameCfg_1.default.fushiKuLevel.getItem((info.fsku.level + 1).toString());
        if (cfgkuNext == null) {
            this.ctx.throw("已满级");
        }
        //只是提升经验
        if (info.fsku.exp < cfgku.exp) {
            await this.ctx.state.master.subItem1(cfgku.need);
            info.fsku.exp += 1;
            await this.update(info, ["fsku"]);
            return;
        }
        //满经验 转进阶
        info.fsku.upType = 1;
        info.fsku.endAt = this.ctx.state.newTime + cfgku.miao;
        await this.update(info, ["tili", "fsku"]);
    }
    /**
     * 刷新任务
     */
    async refreTask(xbid) {
        let info = await this.getInfo();
        if (info.task[xbid] == null) {
            this.ctx.throw("任务不存在");
        }
        await this.ctx.state.master.subItem1(tool_1.tool.mathcfg_item(this.ctx, "fushi_task_refresh"));
        let hasIds = [];
        for (const _xbid in info.task) {
            if (_xbid == xbid) {
                continue;
            }
            hasIds.push(info.task[_xbid].taskId);
        }
        let get1 = this.getTask(1, info.shouce.useId, hasIds)[0];
        info.task[xbid] = { taskId: get1, con: 0, rwd: 0 };
        if (info.tili.linshi.id != "") {
            info.tili.linshi.isTask = 0;
            for (const xbid in info.task) {
                if (info.task[xbid].rwd != 0) {
                    continue;
                }
                let cfg = gameCfg_1.default.fushiItem.getItemCtx(this.ctx, info.tili.linshi.id);
                let cfgTask = gameCfg_1.default.fushiTask.getItemCtx(this.ctx, info.task[xbid].taskId);
                if (cfg.kinds.indexOf(parseInt(cfgTask.kind)) != -1) {
                    info.tili.linshi.isTask = 1;
                    break;
                }
            }
        }
        await this.update(info, ["task", "tili"]);
        await hook_1.hookNote(this.ctx, "fushiTaskRef", 1);
    }
    /**
     * 重置任务
     */
    async resetTask() {
        let info = await this.getInfo();
        for (const _xbId in info.task) {
            if (info.task[_xbId].rwd != 2) {
                this.ctx.throw("有垂钓目标尚未完成,无法重置");
            }
        }
        await this.ctx.state.master.subItem1(tool_1.tool.mathcfg_item(this.ctx, "fushi_task_chongzhi"));
        //刷新3个任务
        info.task = {};
        let get3 = this.getTask(3, info.shouce.useId);
        let xbid = 0;
        for (const taskid of get3) {
            xbid++;
            info.task[xbid.toString()] = { taskId: taskid, con: 0, rwd: 0 };
        }
        if (info.tili.linshi.id != "") {
            info.tili.linshi.isTask = 0;
            for (const xbid in info.task) {
                if (info.task[xbid].rwd != 0) {
                    continue;
                }
                let cfg = gameCfg_1.default.fushiItem.getItemCtx(this.ctx, info.tili.linshi.id);
                let cfgTask = gameCfg_1.default.fushiTask.getItemCtx(this.ctx, info.task[xbid].taskId);
                if (cfg.kinds.indexOf(parseInt(cfgTask.kind)) != -1) {
                    info.tili.linshi.isTask = 1;
                    break;
                }
            }
        }
        await this.update(info, ["task", "tili"]);
        this.ctx.state.master.addWin("msg", "垂钓目标重置完成");
    }
    /**
     * 领取任务奖励
     */
    async taskRwd(xbid) {
        let info = await this.getInfo();
        if (info.task[xbid] == null) {
            this.ctx.throw("任务不存在");
        }
        if (info.task[xbid].rwd == 2) {
            this.ctx.throw("已领取");
        }
        if (info.task[xbid].rwd != 1) {
            this.ctx.throw("未完成");
        }
        info.task[xbid].rwd = 2;
        await this.update(info, ["task"]);
        let cfg = gameCfg_1.default.fushiTask.getItemCtx(this.ctx, info.task[xbid].taskId);
        await this.ctx.state.master.addItem2(cfg.items);
        await hook_1.hookNote(this.ctx, "fushiTaskStar", cfg.star);
    }
    /**
     * 设置灵石
     */
    async setNowId(itemId) {
        let info = await this.getInfo();
        info.nowId = itemId;
        await this.update(info, ["nowId"]);
    }
    /**
     * 广告下单检查
     */
    async checkUp() {
        let info = await this.getInfo();
        if (info.fsku.upType == 0) {
            this.ctx.throw("符石进阶已完成");
        }
        if (info.fsku.lqAt > this.ctx.state.newTime) {
            this.ctx.throw("广告冷却中");
        }
        return {
            type: 1,
            msg: "符石进阶广告加速",
            data: null
        };
    }
    /**
     * 广告成功后执行
     */
    async carryOut() {
        let info = await this.getInfo();
        if (info.fsku.upType == 0) {
            return {
                type: 1,
                msg: "宝箱进阶广告加速失败0",
                data: null
            };
        }
        if (info.fsku.upType == 0) {
            this.ctx.throw("符石进阶已完成");
        }
        if (info.fsku.lqAt > this.ctx.state.newTime) {
            this.ctx.throw("广告冷却中");
        }
        let cfgMathCount = tool_1.tool.mathcfg_count(this.ctx, "fushi_kind11");
        let cfgMathCount1 = tool_1.tool.mathcfg_count1(this.ctx, "fushi_kind11");
        info.fsku.endAt -= cfgMathCount;
        info.fsku.lqAt = this.ctx.state.newTime + cfgMathCount1;
        await this.update(info, ['fsku']);
        return {
            type: 1,
            msg: "符石进阶广告加速成功",
            data: null
        };
    }
    /**
     * 钻石助力
     */
    async speed() {
        let info = await this.getInfo();
        if (info.fsku.upType == 0) {
            this.ctx.throw("符石进阶已完成");
        }
        if (info.fsku.lqAt > this.ctx.state.newTime) {
            this.ctx.throw("广告冷却中");
        }
        let cfgMathCount = tool_1.tool.mathcfg_count(this.ctx, "fushi_kind11");
        let cfgMathCount1 = tool_1.tool.mathcfg_count1(this.ctx, "fushi_kind11");
        let cfgMathitem = tool_1.tool.mathcfg_item(this.ctx, "fushi_kind11");
        await this.ctx.state.master.subItem1(cfgMathitem);
        info.fsku.endAt -= cfgMathCount;
        info.fsku.lqAt = this.ctx.state.newTime + cfgMathCount1;
        await this.update(info, ['fsku']);
    }
    /**
     * 道具助力
     */
    async itemZhuLi(count) {
        if (count <= 0) {
            this.ctx.throw("参数错误");
        }
        let info = await this.getInfo();
        if (info.fsku.upType == 0) {
            this.ctx.throw("符石进阶已完成");
        }
        let cfgMathCount = tool_1.tool.mathcfg_count(this.ctx, "box_zhuli_item");
        let cfgMathitem = tool_1.tool.mathcfg_item(this.ctx, "box_zhuli_item");
        await this.ctx.state.master.subItem1([cfgMathitem[0], cfgMathitem[1], cfgMathitem[2] * count]);
        info.fsku.endAt -= cfgMathCount * count;
        await this.update(info, ['fsku']);
    }
    /**
     * 工会助力 返回加速时长
    */
    async clubZhuLi() {
        let info = await this.getInfo();
        if (info.fsku.upType == 0) {
            return 0;
        }
        let cfgMath = gameCfg_1.default.mathInfo.getItemCtx(this.ctx, "box_zhuli_club");
        if (cfgMath.pram.count == null) {
            this.ctx.throw("配置错误Math_box_zhuli_club");
            return 0;
        }
        info.fsku.endAt -= cfgMath.pram.count;
        await this.update(info, ["fsku"]);
        return cfgMath.pram.count;
    }
    /**
     * 获取升阶截止时间 (用来判断当前是否允许进行助力发布)
     */
    async zhuliTime() {
        let info = await this.getInfo();
        if (info.fsku.upType == 0) {
            //不需要助力
            return 0;
        }
        return info.fsku.endAt;
    }
    //设置方案
    async setFangAn(fangan) {
        let info = await this.getInfo();
        info.fangan = fangan;
        await this.update(info, ['fangan']);
    }
    /**
     * 祭坛升级
     * @param jtid 1纳灵2灵焰3神像4灵基
     */
    async jitanUplv(jtid) {
        let info = await this.getInfo();
        if (info.jitan[jtid] == null) {
            this.ctx.throw("参数错误");
        }
        let cfgJiTan = gameCfg_1.default.fushiJitan.getItemCtx(this.ctx, jtid, info.jitan[jtid].saveid.toString());
        if (cfgJiTan.type == 1) {
            await this.ctx.state.master.subItem1(cfgJiTan.param);
        }
        else if (cfgJiTan.type == 2) {
            if (info.jitan[jtid].cons < cfgJiTan.param[1]) {
                this.ctx.throw("任务未完成");
            }
            info.jitan[jtid].cons = 0;
        }
        else {
            this.ctx.throw("配置类型错误");
        }
        info.jitan[jtid].saveid += 1;
        info.jtEpVer += 1;
        await this.update(info, ['jitan']);
        await this.addHook("539", 1, false);
    }
    /**
     * 解锁手册
     */
    async unlockShouCe() {
        let info = await this.getInfo();
        let cfgSc = gameCfg_1.default.fushiShouce.getItem((info.shouce.id + 1).toString());
        if (cfgSc == null || cfgSc.isOpen == 0 || gameMethod_1.gameMethod.isEmpty(cfgSc.tiaojian) == true) {
            this.ctx.throw("已经全部解锁");
            return;
        }
        for (const kind in cfgSc.tiaojian) {
            if (info.shouce.hook[kind] == null) {
                info.shouce.hook[kind] = 0;
            }
            //检测
            if (info.shouce.hook[kind] < cfgSc.tiaojian[kind]) {
                this.ctx.throw("条件未达成");
            }
        }
        info.shouce.id += 1;
        await this.update(info, ['shouce']);
        let actPveInfoModel = await ActPveInfoModel_1.ActPveInfoModel.getInstance(this.ctx, this.id);
        let actPveInfo = await actPveInfoModel.getInfo();
        await this.addHook("536", actPveInfo.id - 1, true);
    }
    /**
     * 祭坛附灵使用钻石
     */
    async flUse() {
        let info = await this.getInfo();
        if (info.useType == 1) {
            info.useType = 2;
        }
        else {
            info.useType = 1;
        }
        await this.update(info, ['useType']);
    }
    /**
     * 祭坛附灵
     * @param jtid 1纳灵2灵焰3神像4灵基
     */
    async jitanFl(jtid) {
        let info = await this.getInfo();
        if (info.jitan[jtid] == null) {
            this.ctx.throw("参数错误");
        }
        let count = 0; //锁住几个
        for (const _xhid in info.jitan[jtid].epList) {
            if (info.jitan[jtid].epList[_xhid].lock == 1) {
                count++;
            }
        }
        //基础消耗
        if (info.useType == 1) {
            let cfgMathitem = tool_1.tool.mathcfg_item(this.ctx, "fushi_xilian_rneed");
            await this.ctx.state.master.subItem1(cfgMathitem);
        }
        else {
            let cfgMathitem = tool_1.tool.mathcfg_item(this.ctx, "fushi_xilian_buyfree");
            await this.ctx.state.master.subItem1(cfgMathitem);
        }
        //锁住消耗
        let cfgMathitem = tool_1.tool.mathcfg_item(this.ctx, "fushi_jitan_1");
        if (cfgMathitem[count] != null && cfgMathitem[count] > 0) {
            await this.ctx.state.master.subItem1([1, 1, cfgMathitem[count]]);
        }
        info.jitan[jtid].linshi = {};
        let pool = gameCfg_1.default.fushiEp.pool;
        let itemProb = tool_1.tool.mathcfg_item(this.ctx, "fushi_xilian_prob");
        let step = gameCfg_1.default.fushiJitan.getItemCtx(this.ctx, jtid, info.jitan[jtid].saveid.toString()).step.toString();
        let cfgxlList = gameCfg_1.default.fushiXilianStepList.getItemListCtx(this.ctx, step);
        let isover = false;
        let newxb = 1;
        for (let index = 1; index <= 3; index++) {
            let _item1 = game_1.default.getProbRandItem(0, cfgxlList, "prob");
            if (_item1 == null) {
                this.ctx.throw("异常错误");
                return;
            }
            let cfgxlstep = _item1.step;
            if (info.jitan[jtid].epList[index] != null && info.jitan[jtid].epList[index].lock == 1) {
                let epKey = info.jitan[jtid].epList[index].ep[0];
                if (['18', '19', '20', '21'].indexOf(epKey) != -1) {
                    cfgxlstep = 7;
                }
                let cfgEps = gameCfg_1.default.fushiXilian.getItemCtx(this.ctx, epKey, cfgxlstep.toString()).eps;
                info.jitan[jtid].linshi[newxb] = [epKey, game_1.default.rand(cfgEps[0], cfgEps[1]), cfgxlstep, 1];
                newxb++;
                continue;
            }
            if (isover) {
                continue;
            }
            if (game_1.default.rand(1, 10000) > itemProb[count]) {
                isover = true;
                continue;
            }
            count += 1;
            let lsPool = [];
            for (const key in pool) {
                if (pool[key].isXilian == 0) {
                    continue;
                }
                if (pool[key].only == 1) {
                    if (await this.getChouEp_x(pool[key].key, "1000") > 0) {
                        continue;
                    }
                }
                lsPool.push(pool[key]);
            }
            let _item = game_1.default.getProbRandItem(0, lsPool, "prob");
            if (_item == null) {
                continue;
            }
            if (['18', '19', '20', '21'].indexOf(_item.key) != -1) {
                cfgxlstep = 7;
            }
            let cfgEps = gameCfg_1.default.fushiXilian.getItemCtx(this.ctx, _item.key, cfgxlstep.toString()).eps;
            info.jitan[jtid].linshi[newxb] = [_item.key, game_1.default.rand(cfgEps[0], cfgEps[1]), cfgxlstep, 0];
            newxb++;
        }
        await this.update(info, ['jitan']);
    }
    /**
     * 祭坛附灵上锁
     * @param jtid 1纳灵2灵焰3神像4灵基
     * @param xhid 序号ID
     */
    async jitanFlLock(jtid, xhid) {
        let info = await this.getInfo();
        if (info.jitan[jtid] == null) {
            this.ctx.throw("参数错误");
        }
        if (info.jitan[jtid].epList[xhid] == null) {
            this.ctx.throw("序号参数错误");
        }
        if (info.jitan[jtid].epList[xhid].lock == 1) {
            info.jitan[jtid].epList[xhid].lock = 0;
        }
        else {
            let count = 0;
            for (const _xhid in info.jitan[jtid].epList) {
                if (info.jitan[jtid].epList[_xhid].lock == 1) {
                    count++;
                }
            }
            if (count >= 3) {
                this.ctx.throw("不能全部锁掉");
            }
            info.jitan[jtid].epList[xhid].lock = 1;
            await this.ctx.state.master.addWin("msg", "加锁需下一次附灵生效");
        }
        await this.update(info, ['jitan']);
    }
    /**
     * 祭坛附灵
     * @param jtid 1纳灵2灵焰3神像4灵基
     */
    async jitanFlTh(jtid) {
        let info = await this.getInfo();
        if (info.jitan[jtid] == null) {
            this.ctx.throw("参数错误");
        }
        if (gameMethod_1.gameMethod.isEmpty(info.jitan[jtid].linshi) == true) {
            this.ctx.throw("请先附灵");
        }
        info.jitan[jtid].epList = {};
        for (const xbid in info.jitan[jtid].linshi) {
            info.jitan[jtid].epList[xbid] = {
                lock: info.jitan[jtid].linshi[xbid][3],
                ep: [info.jitan[jtid].linshi[xbid][0], info.jitan[jtid].linshi[xbid][1], info.jitan[jtid].linshi[xbid][2]]
            };
        }
        info.jitan[jtid].linshi = {};
        info.jtEpVer += 1;
        await this.update(info, ['jitan']);
    }
    /**
     * 去除图鉴红点
     * @param itemId 道具ID
     */
    async delTjRed(itemId) {
        let info = await this.getInfo();
        if (info.tujian[itemId] == null) {
            await this.backData_u(['tujian']);
            return;
        }
        info.tujian[itemId] = 0;
        await this.update(info, ['tujian']);
    }
    /**
     * 去除图鉴所有红点
     */
    async delTjRedAll(scid) {
        let info = await this.getInfo();
        let fsList = gameCfg_1.default.fushiTujianList.getItemListCtx(this.ctx, scid);
        for (const fstj of fsList) {
            for (const _itemid of fstj.itemIds) {
                if (info.tujian[_itemid] == 1) {
                    info.tujian[_itemid] = 0;
                }
            }
        }
        await this.update(info, ['tujian']);
    }
    /**
     * 使用手册
     * @param id 手册ID
     */
    async useShouCe(id) {
        let info = await this.getInfo();
        if (id > info.shouce.id) {
            this.ctx.throw("未解锁");
        }
        info.shouce.useId = id;
        await this.update(info, ['shouce']);
    }
    /**
     * 去除图鉴红点
     * @param itemId 道具ID
     */
    async addTiLi(count) {
        let info = await this.getInfo();
        info.tili.con += count;
        await this.update(info, ['tili']);
    }
    /**
     * 获取抽奖属性
     *  1	大鱼概率	提高钓到的鱼灵的长度。
        2	垂钓速度	提高钓鱼的速度。
        3	幸运	有时候需要那么一点运气。
        4	慧眼	降低钓到杂物的概率。
        5	专注	降低鱼的逃跑概率。
        6	精通	提高钓鱼不消耗饵料的概率。
        7	渔夫	提高出售鱼灵获得的鱼币数量。
        8	小型鱼猎手	提高钓到小型鱼的概率。
        9	中型鱼猎手	提高钓到中型鱼的概率。
        10	大型鱼猎手	提高钓到大型鱼的概率。
        11	生物学家	提高钓到水中生物的概率。
        12	高效	提高钓饵属性加成。
        13	拾荒	提高钓到杂物的概率。
        14	小型鱼克星	降低钓到小型鱼的概率。
        15	中型鱼克星	降低钓到中型鱼的概率。
        16	大型鱼克星	降低钓到大型鱼的概率。
        17	强度	降低大鱼挣脱鱼线的概率。
        18	活力	5%概率不消耗体力
        19	饲养员	水族箱属性增加5%
        20	清道夫	出售杂物鱼币翻倍
        21	赏金钓客	垂钓目标概率提高10%
     */
    async getChouEp_x(key, nowId) {
        let info = await this.getInfo();
        let val = cache_1.default.getFsJtEps(this.id, key, info);
        let kv = gameCfg_1.default.itemMoney.getItemCtx(this.ctx, nowId).param.kv;
        if (kv != null && kv[key] != null) {
            let val12 = cache_1.default.getFsJtEps(this.id, "12", info);
            val += Math.floor(val * val12 / 10000);
        }
        return val;
    }
    /**
     * 特殊处理增加任务进度
     */
    async addHook(kind, count, isSet) {
        let info = await this.getInfo();
        //祭坛
        for (const jtid in info.jitan) {
            let cfgJt = gameCfg_1.default.fushiJitan.getItemCtx(this.ctx, jtid, info.jitan[jtid].saveid.toString());
            if (cfgJt.type != 2) {
                continue;
            }
            if (cfgJt.param[0].toString() == kind) {
                if (isSet) {
                    info.jitan[jtid].cons = count;
                }
                else {
                    info.jitan[jtid].cons += count;
                }
            }
            await this.update(info, ['jitan']);
        }
        //手册
        let cfgScPool = gameCfg_1.default.fushiShouce.pool;
        for (const key in cfgScPool) {
            if (cfgScPool[key].tiaojian[kind] != null) {
                if (info.shouce.hook[kind] == null) {
                    info.shouce.hook[kind] = 0;
                }
                if (isSet) {
                    info.shouce.hook[kind] = count;
                }
                else {
                    info.shouce.hook[kind] += count;
                }
                await this.update(info, ['shouce']);
                break;
            }
        }
        //渔获盛宴
        let actFuShiYhModel = ActFuShiYhModel_1.ActFuShiYhModel.getInstance(this.ctx, this.id);
        await actFuShiYhModel.addHook(kind, count, isSet);
        //外面的任务 
        let czKind = parseInt(kind) + 100000;
        await hook_1.hookNote(this.ctx, "fushiItem", count, czKind.toString());
    }
}
exports.ActFuShiModel = ActFuShiModel;
//# sourceMappingURL=ActFuShiModel.js.map