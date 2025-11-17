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
exports.HdHuanJingModel = void 0;
const AModel_1 = require("../AModel");
const Xys = __importStar(require("../../../common/Xys"));
const master_1 = require("../../util/master");
const setting_1 = __importDefault(require("../../crontab/setting"));
const gameMethod_1 = require("../../../common/gameMethod");
const game_1 = __importDefault(require("../../util/game"));
const RdsUserModel_1 = require("../redis/RdsUserModel");
const ActTaskMainModel_1 = require("../act/ActTaskMainModel");
/**
 * 鱼灵幻境
 */
class HdHuanJingModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdHuanJing"; //用于存储key 和  输出1级key
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
    static async hook(ctx, uuid, kind, count) {
        let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
        //活动 - 鱼灵幻境
        let cfgHdHuanJing = setting_1.default.getHuodong2(heid, "hdHuanJing");
        if (cfgHdHuanJing != null) {
            for (const hdcid in cfgHdHuanJing) {
                let hdHuanJingModel = HdHuanJingModel.getInstance(ctx, uuid, hdcid);
                await hdHuanJingModel.addHook(kind, count);
            }
        }
    }
    //钩子 整合代码
    static async addScore(ctx, uuid) {
        let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
        //活动 - 鱼灵幻境
        let cfgHdHuanJing = setting_1.default.getHuodong2(heid, "hdHuanJing");
        if (cfgHdHuanJing != null) {
            for (const hdcid in cfgHdHuanJing) {
                let hdHuanJingModel = HdHuanJingModel.getInstance(ctx, uuid, hdcid);
                await hdHuanJingModel.addScore();
            }
        }
    }
    //加道具 整合代码
    static async additem(ctx, uuid, id, count) {
        let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
        let cfgHdHuanJing = setting_1.default.getHuodong2(heid, "hdHuanJing");
        if (cfgHdHuanJing != null) {
            for (const hdcid in cfgHdHuanJing) {
                let hdHuanJingModel = HdHuanJingModel.getInstance(ctx, uuid, hdcid);
                let info = await hdHuanJingModel.getInfo();
                switch (id) {
                    case 1:
                        info.item += count;
                        break;
                    case 2:
                        info.score += count;
                        //更新排行榜
                        await hdHuanJingModel.upRedis();
                        break;
                }
                await hdHuanJingModel.update(info, ["outf", "red"]);
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
            item: 0,
            score: 0,
            payscore: 0,
            chou: {
                //抽奖数据
                allChou: 0,
                totol: {},
                z1Bd: 0,
                z1bd2Num: 0,
                z2Bd: 0,
                z2bd2Num: 0,
            },
            task: {},
            hook: {},
            scRwd: {},
            payRwd: {},
            gift: {},
            giftDay: {},
            //每日重置
            outTime: 0,
            //读取任务配置
            taskVer: 1,
            taskid: "1",
            bug: 1
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        let cfg = (await this.getHdCfg());
        if (cfg != null && cfg.info.id != info.hdid) {
            info = this.init();
            //活动重置ID
            info.hdid = cfg.info.id;
        }
        // if(gameMethod.isEmpty(info.task) == true){
        //     info.task = {};
        //     for (const _id in cfg.data.task) {
        //         info.task[_id] = 0;
        //     }
        // }
        //每日重置
        if (this.ctx.state.newTime > info.outTime) {
            info.outTime = this.ctx.state.new0 + 86400;
            info.giftDay = {}; //礼包购买 每日
            //刷新每日任务
            // info.hook = {};
            info.hook = {};
            info.task = {};
            let passDay = game_1.default.passDay(cfg.info.sAt);
            info.taskid = passDay.toString();
            if (cfg.data.task[info.taskid] == null) {
                info.taskid = "1";
            }
            await this.update(info, ["outf", "red"]);
        }
        if (info.taskVer != 1) {
            info.taskVer = 1;
            info.taskid = "1";
        }
        if (info.bug != 1 && parseInt(this.ctx.state.sid) < 75) {
            info.bug = 1;
            //加入排行榜
            let rdsUserModel = new RdsUserModel_1.RdsUserModel(Xys.RdsUser.rdsHdHuanJing, this.hdcid, await this.getHeIdByUuid(this.id), cfg.info.id);
            await rdsUserModel.zSet(this.id, info.score);
            await this.update(info);
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
     * 接收任务统计
     */
    async addHook(kind, count) {
        let actTaskMainModel = await ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
        if (await actTaskMainModel.kaiqi("4008") != 1) {
            return;
        }
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            //this.ctx.throw("活动未开启");
            return;
        }
        let info = await this.getInfo();
        let isPass = false;
        for (const dc in cfg.data.task[info.taskid]) {
            if (kind == cfg.data.task[info.taskid][dc].kind) {
                isPass = true;
                break;
            }
        }
        if (isPass) {
            if (info.hook[kind] == null) {
                info.hook[kind] = 0;
            }
            info.hook[kind] += count;
            await this.update(info, ["outf", "red"]);
        }
        //充值 加积分
        // if (kind == "164") {
        //     let info: Info = await this.getInfo();
        //     let addJf = cfg.data.payXs * count;
        //     info.payscore += addJf; //充值积分累计
        //     this.ctx.state.master.addWin("msg", `鱼灵幻境充值积分+ ${addJf}`);
        //     await this.update(info, ["outf", "red"]);
        //     //更新排行榜
        //     // await this.upRedis();
        // }
    }
    /**
     * 增加积分
     */
    async addScore() {
        let actTaskMainModel = await ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
        if (await actTaskMainModel.kaiqi("4008") != 1) {
            return;
        }
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            //this.ctx.throw("活动未开启");
            return;
        }
        let info = await this.getInfo();
        info.score += cfg.data.xlhcScore;
        await this.update(info, ["outf", "red"]);
        //更新排行榜
        await this.upRedis();
    }
    //更新排行榜
    async upRedis() {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            //this.ctx.throw("活动未开启");
            return;
        }
        //加入排行榜
        let rdsUserModel = new RdsUserModel_1.RdsUserModel(Xys.RdsUser.rdsHdHuanJing, this.hdcid, await this.getHeIdByUuid(this.id), cfg.info.id);
        let info = await this.getInfo();
        await rdsUserModel.zSet(this.id, info.score);
    }
    /**
     * 任务领奖
     * @param id
     */
    async taskRwd(dc1, dc2) {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        let info = await this.getInfo();
        if (cfg.data.task[info.taskid] == null || cfg.data.task[info.taskid][dc1] == null || cfg.data.task[info.taskid][dc1].dc[dc2] == null) {
            this.ctx.throw("任务ID错误" + dc1);
        }
        //当前已领取档次
        if (info.task[dc1] == null) {
            info.task[dc1] = [];
        }
        //当前已领取档次
        if (info.task[dc1].indexOf(dc2) != -1) {
            this.ctx.throw("已经领取dc1" + dc2);
        }
        //要领取的档次 是否已完成
        if (info.hook[cfg.data.task[info.taskid][dc1].kind] == null || info.hook[cfg.data.task[info.taskid][dc1].kind] < cfg.data.task[info.taskid][dc1].dc[dc2].need) {
            this.ctx.throw("任务未完成");
        }
        //记录领奖
        info.task[dc1].push(dc2);
        await this.update(info, ["outf", "red"]);
        //给与奖励
        await this.ctx.state.master.addItem2(cfg.data.task[info.taskid][dc1].dc[dc2].rwd);
    }
    //抽奖
    async chou(count) {
        //配置
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        //参数安全化
        count = Math.floor(count);
        if (count <= 0 && count > 100) {
            this.ctx.throw("count_err");
        }
        let need_item = count * cfg.data.chou.need; //需求幻灵玉数量
        let info = await this.getInfo();
        //减去幻灵玉
        info.item -= need_item;
        if (info.item < 0) {
            this.ctx.throw("道具不足");
        }
        //次数循环
        let score_add = 0; //积分
        for (let t = 0; t < count; t++) {
            //开始抽奖
            //总概率
            let g_gid = {};
            //构造 概率表 //去除限购
            for (const z_k in cfg.data.chou.rwd) {
                for (let i = 0; i < cfg.data.chou.rwd[z_k].item.length; i++) {
                    let id = cfg.data.chou.rwd[z_k].item[i].id;
                    if (info.chou.totol[id] == null) {
                        info.chou.totol[id] = 0;
                    }
                    if (cfg.data.chou.rwd[z_k].item[i].limit <= 0 || //本商品 不限购
                        info.chou.totol[id] < cfg.data.chou.rwd[z_k].item[i].limit //本商品 未达限购数量
                    ) {
                        if (g_gid[z_k] == null) {
                            g_gid[z_k] = {
                                prob: cfg.data.chou.rwd[z_k].prob,
                                items: [],
                            };
                        }
                        if (z_k == "z1" && //限购组
                            info.chou.z1bd2Num > 1 && //2次保底次数达到
                            cfg.data.chou.rwd[z_k].item[i].id == cfg.data.chou.z1bd2tid // 是本ID
                        ) {
                            //本组 只出本道具 跳出组循环
                            g_gid[z_k].items = [
                                {
                                    id: id,
                                    item: cfg.data.chou.rwd[z_k].item[i].item,
                                    prob: cfg.data.chou.rwd[z_k].item[i].prob,
                                },
                            ];
                            break;
                        }
                        else {
                            g_gid[z_k].items.push({
                                id: id,
                                item: cfg.data.chou.rwd[z_k].item[i].item,
                                prob: cfg.data.chou.rwd[z_k].item[i].prob,
                            });
                        }
                        if (z_k == "z2" && //限购组
                            info.chou.z2bd2Num > 1 && //2次保底次数达到
                            cfg.data.chou.rwd[z_k].item[i].id == cfg.data.chou.z2bd2tid // 是本ID
                        ) {
                            //本组 只出本道具 跳出组循环
                            g_gid[z_k].items = [
                                {
                                    id: id,
                                    item: cfg.data.chou.rwd[z_k].item[i].item,
                                    prob: cfg.data.chou.rwd[z_k].item[i].prob,
                                },
                            ];
                            break;
                        }
                        else {
                            g_gid[z_k].items.push({
                                id: id,
                                item: cfg.data.chou.rwd[z_k].item[i].item,
                                prob: cfg.data.chou.rwd[z_k].item[i].prob,
                            });
                        }
                    }
                }
            }
            //抽完的组 概率给 自己指定的组
            for (const z_k in cfg.data.chou.rwd) {
                //抽完 && 自己指定的组还活着
                if (g_gid[z_k] == null && g_gid[cfg.data.chou.rwd[z_k].overTo] != null) {
                    g_gid[cfg.data.chou.rwd[z_k].overTo].prob += cfg.data.chou.rwd[z_k].prob;
                }
            }
            //构造抽奖表
            if (info.chou.z1Bd < cfg.data.chou.z1bdMin) {
                //未到 组1暗杠 不出组1
                delete g_gid["z1"];
            }
            else if (info.chou.z1Bd < cfg.data.chou.z1bdMax) {
                //未到 保底 按概率出
            }
            else {
                //已达保底 一定出
                if (g_gid["z1"] != null) {
                    //去除其他档次
                    g_gid = {
                        z1: g_gid["z1"],
                    };
                }
                else {
                    //限购档次 已经全部出完
                }
            }
            //构造抽奖表
            if (info.chou.z2Bd < cfg.data.chou.z2bdMin) {
                //未到 组2暗杠 不出组2
                delete g_gid["z2"];
            }
            else if (info.chou.z2Bd < cfg.data.chou.z2bdMax) {
                //未到 保底 按概率出
            }
            else {
                //已达保底 一定出
                if (g_gid["z2"] != null) {
                    //去除其他档次
                    g_gid = {
                        z2: g_gid["z2"],
                    };
                }
                else {
                    //限购档次 已经全部出完
                }
            }
            //随机概率上限
            let randMax = game_1.default.getProbMax(g_gid, "prob");
            //档次随机
            let z_key = game_1.default.getProbRandId(randMax, g_gid, "prob");
            if (z_key == null) {
                //异常 出错
                this.ctx.throw("z_key_null");
                return;
            }
            if (z_key == "z1") {
                //爆了大奖
                //重置保底
                info.chou.z1Bd = 0;
            }
            else {
                //保底次数++
                info.chou.z1Bd += 1;
            }
            if (z_key == "z2") {
                //爆了中奖
                //重置保底
                info.chou.z2Bd = 0;
            }
            else {
                //保底次数++
                info.chou.z2Bd += 1;
            }
            //根据组 进行道具随机
            let zu_randMax = game_1.default.getProbMax(g_gid[z_key].items, "prob");
            let rwdKey = game_1.default.getProbRandId(zu_randMax, g_gid[z_key].items, "prob");
            if (rwdKey == null || g_gid[z_key].items[Number(rwdKey)] == null) {
                this.ctx.throw(`z_rwd_err z_key:${z_key} zu_randMax:${zu_randMax}`);
            }
            let rwdCfg = g_gid[z_key].items[Number(rwdKey)];
            //是否触发2次保底
            if (rwdCfg.id == cfg.data.chou.z1bd2tid) {
                info.chou.z1bd2Num = 0; //二次保底次数
            }
            else {
                if (z_key == "z1") {
                    info.chou.z1bd2Num += 1; //二次保底次数++
                }
            }
            //是否触发2次保底
            if (rwdCfg.id == cfg.data.chou.z2bd2tid) {
                info.chou.z2bd2Num = 0; //二次保底次数
            }
            else {
                if (z_key == "z2") {
                    info.chou.z2bd2Num += 1; //二次保底次数++
                }
            }
            //弹窗 摇到哪一档
            this.ctx.state.master.addWin("hdHuanJingRound", {
                id: rwdCfg.id,
            });
            //发送奖励
            //记录奖励次数
            info.chou.totol[rwdCfg.id] += 1;
            //加上奖励
            await this.ctx.state.master.addItem1(rwdCfg.item);
            //积分
            score_add += gameMethod_1.gameMethod.rand(cfg.data.chou.score[0], cfg.data.chou.score[1]);
            //加上抽奖次数
            info.chou.allChou += 1;
            score_add += cfg.data.xlhcScore;
        }
        if (score_add > 0) {
            //加上 幻境积分
            await this.ctx.state.master.addItem1([1, 919, score_add]);
        }
        await this.update(info, ["outf", "red"]);
    }
    //积分奖励领取 / 改为抽奖次数领奖
    async scoreRwd(id) {
        //配置
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        if (cfg.data.scoreRwd[id] == null) {
            //配置档次不存在
            this.ctx.throw(`id_err:${id}`);
        }
        let info = await this.getInfo();
        //积分到达
        if (cfg.data.scoreRwd[id].need > info.score) {
            this.ctx.throw("抽奖积分不足");
        }
        //已经领取
        if (info.scRwd[id] != null) {
            this.ctx.throw("已经领取");
        }
        //记录领取
        info.scRwd[id] = this.ctx.state.newTime;
        await this.update(info, ["outf", "red"]);
        //加上奖励
        await this.ctx.state.master.addItem1(cfg.data.scoreRwd[id].rwd);
    }
    //充值奖励领取
    async payRwd(id) {
        //配置
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        if (cfg.data.payRwd[id] == null) {
            //配置档次不存在
            this.ctx.throw(`id_err:${id}`);
        }
        let info = await this.getInfo();
        //积分到达
        if (cfg.data.payRwd[id].need > info.payscore) {
            this.ctx.throw("充值积分不足");
        }
        //已经领取
        if (info.payRwd[id] != null) {
            this.ctx.throw("已经领取");
        }
        //记录领取
        info.payRwd[id] = this.ctx.state.newTime;
        await this.update(info, ["outf", "red"]);
        //加上奖励
        await this.ctx.state.master.addItem2(cfg.data.payRwd[id].rwd);
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
        //1. 跃龙门可以跃的时候，跃1次按钮红点，道具不足时消失。
        //2. 跃龙门可以跃10次的时候，跃10次按钮红点（这个出现的时候，跃1次也有红点存在），道具不足时消失。
        if (info.item > cfg.data.chou.need) {
            return 1;
        }
        //6. 任务有可以领取奖励的任务时，鱼灵幻境活动首页入口红点，没有奖励可领取时消失。
        //遍历今日任务
        for (const dc1 in cfg.data.task[info.taskid]) {
            if (info.hook[cfg.data.task[info.taskid][dc1].kind] == null) {
                continue;
            }
            for (const dc2 in cfg.data.task[info.taskid][dc1].dc) {
                if (info.task[dc1] == null) {
                    info.task[dc1] = [];
                }
                if (info.task[dc1] != null && info.task[dc1].indexOf(dc2) != -1) {
                    continue;
                }
                if (info.hook[cfg.data.task[info.taskid][dc1].kind] >= cfg.data.task[info.taskid][dc1].dc[dc2].need) {
                    return 1;
                }
            }
        }
        //5. 礼包，有免费礼包可以领取时红点，领取后消失。
        for (const dc in cfg.data.gift) { //遍历配置礼包
            if (cfg.data.gift[dc].need.length <= 0 && //免费档
                info.gift[dc] == null //未领取
            ) {
                //要钱的
                return 1;
            }
        }
        return 0;
        //4. 礼包，每天登录第一次鱼灵幻境活动首页入口红点，进入页面时消失。
        //7. 有以上任意情况存在，鱼灵幻境在游戏首页的入口红点。
    }
    /**
     * 领取免费档次
     */
    async gitFree(id) {
        //遍历查找 自己是不是用了
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        if (cfg.data.gift[id] == null) {
            this.ctx.throw(`id_null:${id}`);
        }
        if (gameMethod_1.gameMethod.isEmpty(cfg.data.gift[id].need) != true) {
            this.ctx.throw("非免费");
        }
        let info = await this.getInfo();
        //总限购
        if (info.gift[id] == null) {
            info.gift[id] = 0;
        }
        if (cfg.data.gift[id].limit > 0 && //有限购
            info.gift[id] >= cfg.data.gift[id].limit //限购达到
        ) {
            this.ctx.throw("购买上限");
        }
        //日限购上限
        //总限购
        if (info.giftDay[id] == null) {
            info.giftDay[id] = 0;
        }
        if (cfg.data.gift[id].dayLimit > 0 && //有每日限购
            info.giftDay[id] >= cfg.data.gift[id].dayLimit //每日限购达到
        ) {
            this.ctx.throw("每日购买上限");
        }
        //礼包购买次数累计
        info.gift[id] += 1;
        info.giftDay[id] += 1;
        await this.update(info, ["outf", "red"]);
        //加上礼包奖励
        await this.ctx.state.master.addItem2(cfg.data.gift[id].rwd);
    }
    /**
     * 充值下单检查
     */
    async checkUp(id) {
        //遍历查找 自己是不是用了
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        if (cfg.data.gift[id] == null) {
            this.ctx.throw(`id_null:${id}`);
        }
        if (cfg.data.gift[id].need[0] != 10) {
            this.ctx.throw("参数错误");
        }
        let info = await this.getInfo();
        //总限购
        if (info.gift[id] == null && //没买过
            cfg.data.gift[id].limit > 0 && //有限购
            info.gift[id] >= cfg.data.gift[id].limit //限购达到
        ) {
            this.ctx.throw("购买上限");
        }
        //日限购上限
        if (info.giftDay[id] == null && //今天没买过
            cfg.data.gift[id].dayLimit > 0 && //有每日限购
            info.giftDay[id] >= cfg.data.gift[id].dayLimit //每日限购达到
        ) {
            this.ctx.throw("每日购买上限");
        }
        return {
            type: 1,
            msg: cfg.data.gift[id].title,
            data: cfg.data.gift[id].need[1],
            kind10Cs: this.kid + "_" + this.hdcid + "_" + id + "_" + cfg.data.gift[id].need[1]
        };
    }
    /**
     * 充值成功后执行
     */
    async carryOut(id) {
        //遍历查找 自己是不是用了
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            return {
                type: 0,
                msg: "活动未生效",
                data: null,
            };
        }
        if (cfg.data.gift[id] == null) {
            return {
                type: 0,
                msg: `id_null:${id}`,
                data: null,
            };
        }
        if (cfg.data.gift[id].need[0] != 10) {
            return {
                type: 0,
                msg: `参数错误`,
                data: null,
            };
        }
        let info = await this.getInfo();
        if (info.gift[id] == null) {
            info.gift[id] = 0;
        }
        if (cfg.data.gift[id].limit > 0 && //有限购
            info.gift[id] >= cfg.data.gift[id].limit //限购达到
        ) {
            return {
                type: 0,
                msg: `购买上限`,
                data: null,
            };
        }
        if (info.giftDay[id] == null) {
            info.giftDay[id] = 0;
        }
        if (cfg.data.gift[id].dayLimit > 0 && //有每日限购
            info.giftDay[id] >= cfg.data.gift[id].dayLimit //每日限购达到
        ) {
            return {
                type: 0,
                msg: `每日购买上限`,
                data: null,
            };
        }
        //礼包购买次数累计
        info.gift[id] += 1;
        info.giftDay[id] += 1;
        await this.update(info, ["outf", "red"]);
        //加上礼包奖励
        await this.ctx.state.master.addItem2(cfg.data.gift[id].rwd);
        return {
            type: 1,
            msg: "充值成功",
            data: cfg.data.gift[id].need[1],
        };
    }
}
exports.HdHuanJingModel = HdHuanJingModel;
//# sourceMappingURL=HdHuanJingModel.js.map