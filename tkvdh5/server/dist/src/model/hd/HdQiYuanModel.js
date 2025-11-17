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
exports.HdQiYuanModel = void 0;
const AModel_1 = require("../AModel");
const Xys = __importStar(require("../../../common/Xys"));
const master_1 = require("../../util/master");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const setting_1 = __importDefault(require("../../crontab/setting"));
const ActFazhenModel_1 = require("../act/ActFazhenModel");
const gameMethod_1 = require("../../../common/gameMethod");
const game_1 = __importDefault(require("../../util/game"));
const RdsUserModel_1 = require("../redis/RdsUserModel");
const ActTaskMainModel_1 = require("../act/ActTaskMainModel");
const mongodb_1 = require("mongodb");
const hook_1 = require("../../util/hook");
/**
 * 兽灵起源
 */
class HdQiYuanModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdQiYuan"; //用于存储key 和  输出1级key
        this.outIsAu = true; //下发数据是否用au下发
        this.dType = master_1.DataType.user;
    }
    //单例模式
    static getInstance(ctx, uuid, hdcid = "1") {
        let dlKey = this.name + "_" + uuid + "_" + hdcid;
        mongodb_1.GridFSBucketReadStream;
        //单例模式key
        if (!ctx.state.model[dlKey]) {
            ctx.state.model[dlKey] = new this(ctx, uuid, hdcid);
        }
        return ctx.state.model[dlKey];
    }
    //钩子 整合代码
    static async hook(ctx, uuid, kind, count, md = "add") {
        let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
        //活动 - 兽灵起源
        let cfgHdQiYuan = setting_1.default.getHuodong2(heid, "hdQiYuan");
        if (cfgHdQiYuan != null) {
            for (const hdcid in cfgHdQiYuan) {
                let hdQiYuanModel = HdQiYuanModel.getInstance(ctx, uuid, hdcid);
                await hdQiYuanModel.hook(kind, count, md);
            }
        }
    }
    //灵兽 结算 整合代码 //自爆前需要调用
    static async jiesuan(ctx, uuid) {
        let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
        //活动 - 兽灵起源
        let cfgHdQiYuan = setting_1.default.getHuodong2(heid, "hdQiYuan");
        if (cfgHdQiYuan != null) {
            for (const hdcid in cfgHdQiYuan) {
                let hdQiYuanModel = HdQiYuanModel.getInstance(ctx, uuid, hdcid);
                await hdQiYuanModel.jiesuan();
            }
        }
    }
    //灵兽 自爆 整合代码
    static async zibao(ctx, uuid, gzIds) {
        let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
        //活动 - 兽灵起源
        let cfgHdQiYuan = setting_1.default.getHuodong2(heid, "hdQiYuan");
        if (cfgHdQiYuan != null) {
            for (const hdcid in cfgHdQiYuan) {
                let hdQiYuanModel = HdQiYuanModel.getInstance(ctx, uuid, hdcid);
                for (let i = 0; i < gzIds.length; i++) {
                    await hdQiYuanModel.zibao(gzIds[i]);
                }
            }
        }
    }
    //加道具 整合代码
    static async additem(ctx, uuid, id, count) {
        let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
        //活动 - 兽灵起源
        let cfgHdQiYuan = setting_1.default.getHuodong2(heid, "hdQiYuan");
        if (cfgHdQiYuan != null) {
            for (const hdcid in cfgHdQiYuan) {
                let hdQiYuanModel = HdQiYuanModel.getInstance(ctx, uuid, hdcid);
                let info = await hdQiYuanModel.getInfo();
                switch (id) {
                    case 1:
                        info.item1 += count;
                        break;
                    case 2:
                        info.item2 += count;
                        break;
                    case 3:
                        info.score += count;
                        //加入排行榜
                        let rdsUserModel = new RdsUserModel_1.RdsUserModel(Xys.RdsUser.rdsHdQiYuan, hdcid, await hdQiYuanModel.getHeIdByUuid(uuid), cfgHdQiYuan[hdcid].info.id);
                        await rdsUserModel.zSet(uuid, info.score);
                        //内部钩子 : 累积获取起源积分{0}分
                        await hdQiYuanModel.hook("177", count);
                        break;
                }
                await hdQiYuanModel.update(info, ["outf", "red"]);
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
            //额外道具表
            item1: 0,
            item2: 0,
            score: 0,
            rwds1: {},
            rwds2: {},
            hook: {},
            //树
            tree: {
                //横列
                list: {},
                s_num: 0,
                s_time: 0,
                z_num: 0,
                z_times: 0,
                z_ptAt: this.ctx.state.newTime,
            },
            //转盘
            round: {
                totol: {},
                z1Bd: 0,
                z1bd2Num: 0,
                z2Bd: 0,
                z2bd2Num: 0,
            },
            //礼包购买
            gift: {},
            //礼包购买 日限购
            giftDay: {},
            //每日重置
            outTime: 0,
            bug: 1
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        //新增字段 判空
        if (info.round.z2Bd == null) {
            info.round.z2Bd = 0;
        }
        if (info.round.z2bd2Num == null) {
            info.round.z2bd2Num = 0;
        }
        if (info.tree.z_ptAt == null) {
            info.tree.z_ptAt = this.ctx.state.newTime;
        }
        let cfg = (await this.getHdCfg());
        if (cfg != null && cfg.info.id != info.hdid) {
            info = this.init();
            //活动重置ID
            info.hdid = cfg.info.id;
            // //吧免费档次 默认解锁了
            // for (const pzid in cfg.data.tree.list) {
            //     //遍历价格
            //     for (let i = 0; i < cfg.data.tree.list[pzid].open_nd.length; i++) {
            //         if (cfg.data.tree.list[pzid].open_nd[i] <= 0) {
            //             //默认解锁
            //             if (info.tree.list[pzid] == null) {
            //                 info.tree.list[pzid] = {
            //                     open: 0,
            //                     fzList: {},
            //                 };
            //                 info.tree.list[pzid].open = i + 1;
            //             }
            //         } else {
            //             break;
            //         }
            //     }
            // }
            //挂机开始时间 是活动开始时间
            info.tree.s_time = cfg.info.sAt;
            await this.update(info, ["outf", "red"]);
        }
        //每日重置
        if (this.ctx.state.newTime > info.outTime) {
            info.outTime = this.ctx.state.new0 + 86400;
            //每日限购清空
            info.giftDay = {};
        }
        if (info.bug != 1 && parseInt(this.ctx.state.sid) < 75) {
            info.bug = 1;
            //加入排行榜
            let rdsUserModel = new RdsUserModel_1.RdsUserModel(Xys.RdsUser.rdsHdQiYuan, this.hdcid, await this.getHeIdByUuid(this.id), cfg.info.id);
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
    async hook(kind, count, md = "add") {
        let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
        if (await actTaskMainModel.kaiqi("4006") != 1) {
            return;
        }
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            //this.ctx.throw("活动未开启");
            return;
        }
        let isPass = false;
        for (const dc in cfg.data.task1) {
            if (kind == cfg.data.task1[dc].kind) {
                isPass = true;
                break;
            }
        }
        for (const dc in cfg.data.task2) {
            if (kind == cfg.data.task2[dc].kind) {
                isPass = true;
                break;
            }
        }
        if (isPass == false) {
            return;
        }
        let info = await this.getInfo();
        if (info.hook[kind] == null) {
            info.hook[kind] = 0;
        }
        switch (md) {
            case "add":
                info.hook[kind] += count;
                break;
            case "set":
                info.hook[kind] = count;
                break;
            case "max":
                info.hook[kind] = Math.max(info.hook[kind], count);
                break;
            case "min":
                info.hook[kind] = Math.min(info.hook[kind], count);
                break;
        }
        await this.update(info, ["outf", "red"]);
    }
    /**
     * 活跃任务 领奖
     * @param id
     */
    async task1Rwd(id) {
        return this._taskRwd(id, 1);
    }
    /**
     * 探索任务 领奖
     * @param id
     */
    async task2Rwd(id) {
        return this._taskRwd(id, 2);
    }
    //领取任务 奖励 通用
    async _taskRwd(id, key) {
        let task_key = key == 1 ? "task1" : "task2";
        let rwd_key = key == 1 ? "rwds1" : "rwds2";
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        let info = await this.getInfo();
        if (cfg.data[task_key][id] == null) {
            this.ctx.throw("任务ID错误" + id);
            return;
        }
        //当前已领取档次
        if (info[rwd_key][id] == null) {
            info[rwd_key][id] = 0;
        }
        let nowDc = info[rwd_key][id];
        nowDc += 1; //要领取的档次
        //要领取的档次 配置是否存在
        if (cfg.data[task_key][id].dc[nowDc] == null) {
            this.ctx.throw("已经领完");
            return;
        }
        //要领取的档次 是否已完成
        if (info.hook[cfg.data[task_key][id].kind] == null || info.hook[cfg.data[task_key][id].kind] < cfg.data[task_key][id].dc[nowDc].need) {
            this.ctx.throw("任务未完成");
            return;
        }
        //记录领奖
        info[rwd_key][id] = nowDc;
        await this.update(info, ["outf", "red"]);
        //给与奖励
        await this.ctx.state.master.addItem2(cfg.data[task_key][id].dc[nowDc].rwd);
    }
    //树: 开格子 qiYuan
    async treeOpen(lid) {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        //品质配置
        if (cfg.data.tree.list[lid] == null) {
            this.ctx.throw(`lid_err:${lid}`);
        }
        let info = await this.getInfo();
        //当前开了几个
        if (info.tree.list[lid] == null) {
            info.tree.list[lid] = {
                open: 0,
                fzList: {},
            };
        }
        let openNum = info.tree.list[lid].open; //已经开的格子数
        if (cfg.data.tree.list[lid].open_nd[openNum] == null) {
            this.ctx.throw("已经全开");
        }
        //扣除需求道具
        if (cfg.data.tree.list[lid].open_nd[openNum] > 0) {
            await this._subitem1(info, cfg.data.tree.list[lid].open_nd[openNum]);
        }
        else {
            //可以免费开
        }
        //结算奖励
        await this.jiesuan();
        //开启格子
        info.tree.list[lid].open += 1;
        //保存
        await this.update(info, ["outf", "red"]);
        this.ctx.state.master.addWin("msg", "成功开启起源之树格子");
        //内部钩子 : 解锁起源空位{0}个
        await this.hook("174", 1);
        if (info.tree.list[lid].open == 1) {
            await hook_1.hookNote(this.ctx, "qyjiesuo", 1);
        }
    }
    //扣除 起源仙尘
    async _subitem1(info, count) {
        //扣除需求道具
        info.item1 -= count;
        if (info.item1 < 0) {
            this.ctx.throw("道具不足");
        }
        //内部钩子 : 消耗起源仙尘数量
        await this.hook("175", count);
    }
    //扣除 起源之证
    async _subitem2(info, count) {
        //扣除需求道具
        info.item2 -= count;
        if (info.item2 < 0) {
            this.ctx.throw("道具不足");
        }
    }
    /**
     * 树: 放兽灵
     * @param lid 行ID
     * @param gz 格子ID
     * @param gzid 阵法格子ID
     */
    async treePush(lid, gz, gzid) {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        //结算奖励
        await this.jiesuan();
        let info = await this.getInfo();
        if (gameMethod_1.gameMethod.isEmpty(gzid)) {
            //没发来 阵法ID 下掉兽灵
            if (info.tree.list[lid] == null || info.tree.list[lid].fzList[gz] == null) {
                this.ctx.throw("格子是空的");
            }
            delete info.tree.list[lid].fzList[gz];
        }
        else {
            //兽灵是否存在
            let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(this.ctx, this.id);
            let fzId = await actFazhenModel.getFzidByGzId(gzid);
            if (fzId == null) {
                //没有这个兽灵
                this.ctx.throw(`gzid_null:${gzid}`);
            }
            //兽灵是否没有被 其他格子 占用
            for (const k_list in info.tree.list) {
                //遍历品质
                for (const k_gzId in info.tree.list[k_list].fzList) {
                    //遍历格子
                    if (info.tree.list[k_list].fzList[k_gzId] == gzid) {
                        //已被占用
                        this.ctx.throw(`in_use: ${k_gzId} ${gzid}`);
                    }
                }
            }
            //当前格子 是不是已经开放
            if (info.tree.list[lid] == null || info.tree.list[lid].open < gz) {
                //格子还没开
                this.ctx.throw(`not_open: ${lid} ${gz}`);
            }
            //上阵灵兽
            info.tree.list[lid].fzList[gz] = gzid;
        }
        //保存
        await this.update(info, ["outf", "red"]);
        //内部钩子 : 起源积分产量达到{0}分
        let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(this.ctx, this.id);
        let fzinfo = await actFazhenModel.getInfo();
        let rate = gameMethod_1.gameMethod.hdQiYuanModelRate(info, cfg.data, fzinfo);
        await this.hook("178", rate, "max"); //最大值? maxHook?
    }
    /**
     * 有个兽灵 自爆了 //内部调用
     * @param gzid 兽灵所在格子ID
     */
    async zibao(gzid) {
        //遍历查找 自己是不是用了
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        let info = await this.getInfo();
        for (const k_pz in info.tree.list) {
            //遍历品质
            for (const k_gzId in info.tree.list[k_pz].fzList) {
                //遍历格子
                if (info.tree.list[k_pz].fzList[k_gzId] == gzid) {
                    //找到使用点
                    //结算奖励 //有兽灵 已经被自爆 这边不做结算 免得报错
                    // await this.jiesuan();
                    //下掉
                    delete info.tree.list[k_pz].fzList[k_gzId];
                    //保存
                    await this.update(info, ["outf", "red"]);
                    return;
                }
            }
        }
    }
    /**
     * 结算挂机奖励
     */
    async jiesuan() {
        //遍历查找 自己是不是用了
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(this.ctx, this.id);
        let fzinfo = await actFazhenModel.getInfo();
        let info = await this.getInfo();
        //计算速度
        let rate = gameMethod_1.gameMethod.hdQiYuanModelRate(info, cfg.data, fzinfo);
        //计算积分产出
        let tot = gameMethod_1.gameMethod.hdQiYuanModelTotol(info, cfg.data, rate, this.ctx.state.newTime);
        info.tree.s_num = tot.totol; //总数
        info.tree.s_time = this.ctx.state.newTime; //时间
        //产出时长 //结算点 //小时点
        //起源之证 可用来产出的时长
        let addNum = Math.floor((this.ctx.state.newTime - info.tree.z_ptAt) / 7200);
        if (addNum > 0) {
            info.tree.z_num += addNum;
            info.tree.z_ptAt += addNum * 7200;
        }
        // info.tree.z_times += tot.dtime;
        // let z_ours = Math.floor(info.tree.z_times / 3600); //产出次数/小时数
        // info.tree.z_num += this.jiesuan_zz(rate, cfg.data.tree.zzProb, z_ours); //计算产出多少之证
        // //减去已用时间
        // info.tree.z_times -= z_ours * 3600;
        //保存
        await this.update(info, ["outf", "red"]);
    }
    /**
     * 之证 随机算法
     * @param rate 积分产出速率 /每小时
     * @param zzProb 配置的系数
     * @param z_ours //几小时
     */
    jiesuan_zz(rate, zzProb, z_ours) {
        //zzProb
        let zz = 0;
        //循环产出之证
        for (let i = 0; i < z_ours; i++) {
            if (gameMethod_1.gameMethod.rand(1, 10000) < rate * zzProb) {
                zz += 1;
            }
        }
        return zz;
    }
    //树: 领取
    async treeRwd() {
        //结算奖励
        await this.jiesuan();
        let info = await this.getInfo();
        //加上奖励
        let items = [];
        if (info.tree.z_num > 0) {
            items.push([1, 915, info.tree.z_num]);
        }
        if (info.tree.s_num > 0) {
            items.push([1, 916, info.tree.s_num]);
        }
        await this.ctx.state.master.addItem2(items);
        //清除仓库
        info.tree.z_num = 0;
        info.tree.s_num = 0;
        //保存
        await this.update(info, ["outf", "red"]);
    }
    //树: 快速挂机
    async treeQuick() {
        //遍历查找 自己是不是用了
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        let info = await this.getInfo();
        //要求 格子 全部开完 才能速战
        //遍历配置
        // for (const pzid in cfg.data.tree.list) {
        //     if (
        //         info.tree.list[pzid] == null || //没开
        //         info.tree.list[pzid].open < cfg.data.tree.list[pzid].open_nd.length //没开完
        //     ) {
        //         this.ctx.throw("格子开完才能速战");
        //     }
        // }
        //扣除速战需求
        await this._subitem1(info, cfg.data.tree.quick_nd1);
        //兽灵
        let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(this.ctx, this.id);
        let fzinfo = await actFazhenModel.getInfo();
        //计算速度
        let rate = gameMethod_1.gameMethod.hdQiYuanModelRate(info, cfg.data, fzinfo);
        let s_num = rate * 2;
        // let z_num = this.jiesuan_zz(rate, cfg.data.tree.zzProb, 2);
        //掉落抽奖券的个数=1+挂机收益的速度/10000*掉落概率
        let z_num = Math.floor(1 + rate / 10000 * cfg.data.tree.zzProb);
        //加上奖励
        let items = [];
        if (z_num > 0) {
            items.push([1, 915, z_num]);
        }
        if (s_num > 0) {
            items.push([1, 916, s_num]);
        }
        //加上奖励
        await this.ctx.state.master.addItem2(items);
        await this.update(info, ["outf", "red"]);
        //内部钩子 累积快速挂机次数
        await this.hook("176", 1);
    }
    //轮: 抽奖
    async round() {
        //遍历查找 自己是不是用了
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        let info = await this.getInfo();
        //扣除抽奖需求
        await this._subitem2(info, cfg.data.round.chou_nd2);
        //开始抽奖
        //总概率
        let g_gid = {};
        //构造 概率表 //去除限购
        for (const z_k in cfg.data.round.rwd) {
            for (let i = 0; i < cfg.data.round.rwd[z_k].item.length; i++) {
                let id = cfg.data.round.rwd[z_k].item[i].id;
                if (info.round.totol[id] == null) {
                    info.round.totol[id] = 0;
                }
                if (cfg.data.round.rwd[z_k].item[i].limit <= 0 || //本商品 不限购
                    info.round.totol[id] < cfg.data.round.rwd[z_k].item[i].limit //本商品 未达限购数量
                ) {
                    if (g_gid[z_k] == null) {
                        g_gid[z_k] = {
                            prob: cfg.data.round.rwd[z_k].prob,
                            items: [],
                        };
                    }
                    if (z_k == "z1" && //限购组
                        info.round.z1bd2Num > 1 && //2次保底次数达到
                        cfg.data.round.rwd[z_k].item[i].id == cfg.data.round.z1bd2tid // 是本ID
                    ) {
                        //本组 只出本道具 跳出组循环
                        g_gid[z_k].items = [
                            {
                                id: id,
                                item: cfg.data.round.rwd[z_k].item[i].item,
                                prob: cfg.data.round.rwd[z_k].item[i].prob,
                            },
                        ];
                        break;
                    }
                    else {
                        g_gid[z_k].items.push({
                            id: id,
                            item: cfg.data.round.rwd[z_k].item[i].item,
                            prob: cfg.data.round.rwd[z_k].item[i].prob,
                        });
                    }
                    if (z_k == "z2" && info.round.z2bd2Num > 1 &&
                        cfg.data.round.rwd[z_k].item[i].id == cfg.data.round.z2bd2tid // 是本ID
                    ) {
                        //本组 只出本道具 跳出组循环
                        g_gid[z_k].items = [
                            {
                                id: id,
                                item: cfg.data.round.rwd[z_k].item[i].item,
                                prob: cfg.data.round.rwd[z_k].item[i].prob,
                            },
                        ];
                        break;
                    }
                    else {
                        g_gid[z_k].items.push({
                            id: id,
                            item: cfg.data.round.rwd[z_k].item[i].item,
                            prob: cfg.data.round.rwd[z_k].item[i].prob,
                        });
                    }
                }
            }
        }
        //抽完的组 概率给 自己指定的组
        for (const z_k in cfg.data.round.rwd) {
            //抽完 && 自己指定的组还活着
            if (g_gid[z_k] == null && g_gid[cfg.data.round.rwd[z_k].overTo] != null) {
                g_gid[cfg.data.round.rwd[z_k].overTo].prob += cfg.data.round.rwd[z_k].prob;
            }
        }
        //构造抽奖表 z1 暗杠保底操作
        if (info.round.z1Bd + 1 < cfg.data.round.z1bdMin) {
            //未到 组1暗杠 不出组1
            delete g_gid["z1"];
        }
        else if (info.round.z1Bd + 1 < cfg.data.round.z1bdMax) {
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
        //构造抽奖表 z2 暗杠保底操作
        if (info.round.z2Bd < cfg.data.round.z2bdMin) {
            //未到 组2暗杠 不出组2
            delete g_gid["z2"];
        }
        else if (info.round.z2Bd < cfg.data.round.z2bdMax) {
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
            info.round.z1Bd = 0;
        }
        else {
            //保底次数++
            info.round.z1Bd += 1;
        }
        if (z_key == "z2") {
            //爆了大奖
            //重置保底
            info.round.z2Bd = 0;
        }
        else {
            //保底次数++
            info.round.z2Bd += 1;
        }
        //根据组 进行道具随机
        let zu_randMax = game_1.default.getProbMax(g_gid[z_key].items, "prob");
        let rwdKey = game_1.default.getProbRandId(zu_randMax, g_gid[z_key].items, "prob");
        if (rwdKey == null || g_gid[z_key].items[Number(rwdKey)] == null) {
            this.ctx.throw(`z_rwd_err z_key:${z_key} zu_randMax:${zu_randMax}`);
        }
        let rwdCfg = g_gid[z_key].items[Number(rwdKey)];
        //是否触发2次保底 组1
        if (rwdCfg.id == cfg.data.round.z1bd2tid) {
            info.round.z1bd2Num = 0; //二次保底次数
        }
        else {
            if (z_key == "z1") {
                info.round.z1bd2Num += 1; //二次保底次数++
            }
        }
        //是否触发2次保底 组2
        if (rwdCfg.id == cfg.data.round.z2bd2tid) {
            info.round.z2bd2Num = 0; //二次保底次数
        }
        else {
            if (z_key == "z2") {
                info.round.z2bd2Num += 1; //二次保底次数++
            }
        }
        //弹窗 摇到哪一档
        this.ctx.state.master.addWin("hdQiYuanRound", {
            id: rwdCfg.id,
        });
        //发送奖励
        //记录奖励次数
        info.round.totol[rwdCfg.id] += 1;
        await this.update(info, ["outf", "red"]);
        //直接加上道具
        await this.ctx.state.master.addItem1(rwdCfg.item);
    }
    /**
     * 获得兽灵的时候 需要刷新本红点 (有相关任务钩子触发 暂时省略)
     *
     * 获取红点
     */
    async getRed() {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            return 0;
        }
        let info = await this.getInfo();
        //5. 兽灵起源，有道具可以进行抽奖时，页签红点，抽一次按钮红点，道具不足时红点消失。
        if (info.item2 > 0) {
            return 1;
        }
        //2. 礼包页签，有免费礼包可以领取时红点，领取后消失。
        for (const dc in cfg.data.gift) {
            //非免费档
            if (cfg.data.gift[dc].need.length > 0) {
                continue;
            }
            //每日限制
            if (cfg.data.gift[dc].dayLimit > 0 && //有每日总量限制
                info.giftDay[dc] != null && //有领过
                info.giftDay[dc] >= cfg.data.gift[dc].dayLimit //已经领完
            ) {
                //每日限制到了 就不管总限制了
                continue;
            }
            else {
                //每日限制 放开了 还要看 总限制达到没
                //总限制
                if (cfg.data.gift[dc].limit > 0 && //有总量限制
                    info.gift[dc] != null && //有领过
                    info.gift[dc] >= cfg.data.gift[dc].limit //已经领完
                ) {
                    continue;
                }
                else {
                    return 1;
                }
            }
        }
        //6. 任务有可以领取的时候，页签红点，进入以后对应任务所在的小分页红点。
        for (const tid in cfg.data.task1) {
            //本任务 已领取档次
            let rdc = 0;
            if (info.rwds1[tid] != null) {
                rdc = info.rwds1[tid];
            }
            rdc += 1; //下一档次
            if (cfg.data.task1[tid].dc[rdc] != null && //下一档次 存在
                info.hook[cfg.data.task1[tid].kind] != null && //下一档次 已完成
                info.hook[cfg.data.task1[tid].kind] >= cfg.data.task1[tid].dc[rdc].need) {
                return 1;
            }
        }
        for (const tid in cfg.data.task2) {
            //本任务 已领取档次
            let rdc = 0;
            if (info.rwds2[tid] != null) {
                rdc = info.rwds2[tid];
            }
            rdc += 1; //下一档次
            if (cfg.data.task2[tid].dc[rdc] != null && //下一档次 存在
                info.hook[cfg.data.task2[tid].kind] != null && //下一档次 已完成
                info.hook[cfg.data.task2[tid].kind] >= cfg.data.task2[tid].dc[rdc].need) {
                return 1;
            }
        }
        //构造 已使用兽灵 id 表
        let useFz = {};
        //构造 有空格的 品质=> 数量表
        let kPzs = {};
        //3. 起源之树，有可以解锁的格子时，页签红点，可以解锁的格子红点，直到不可解锁时消失。
        for (const pzid in cfg.data.tree.list) {
            //遍历数品质档
            //当前开到第X格
            let open = 0;
            if (info.tree.list[pzid] != null) {
                open = info.tree.list[pzid].open;
            }
            //下一格是否存在 下一格是否够钱
            if (cfg.data.tree.list[pzid].open_nd[open] != null && cfg.data.tree.list[pzid].open_nd[open] <= info.item1) {
                return 1;
            }
            //遍历格子 看是否有空格
            if (open > 0) {
                for (let gid = 1; gid <= open; gid++) {
                    if (info.tree.list[pzid].fzList[gid] == null) {
                        //本品质 有空格子
                        kPzs[pzid] = 1;
                    }
                    else {
                        //本兽灵 已被使用
                        useFz[info.tree.list[pzid].fzList[gid]] = 1;
                    }
                }
            }
        }
        //4. 已解锁的空格子，有对应可以放进去翻倍并且还没被派遣到其他格子的兽灵时，对应的空格子红点，
        //进入兽灵选择界面以后，达到要求的兽灵头像红点。不满足条件时红点消失。
        //遍历已开的空格
        //兽灵是否存在
        let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(this.ctx, this.id);
        //构建所有未上阵兽灵 品质表
        let fzinfo = await actFazhenModel.getInfo();
        for (const gzid in fzinfo.list) {
            if (useFz[gzid] != null) {
                //本兽灵 已被使用
                continue;
            }
            //获取兽灵 配置
            let fzCfg = gameCfg_1.default.fazhenInfo.getItem(fzinfo.list[gzid].fzid);
            if (fzCfg != null) {
                if (kPzs[fzCfg.pinzhi] != null) {
                    return 1;
                }
            }
        }
        //7. 有以上情况存在时，首页的入口按钮红点。
        return 0;
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
exports.HdQiYuanModel = HdQiYuanModel;
//# sourceMappingURL=HdQiYuanModel.js.map