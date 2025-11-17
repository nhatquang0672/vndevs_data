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
exports.HdXinMoModel = void 0;
const AModel_1 = require("../AModel");
const Xys = __importStar(require("../../../common/Xys"));
const master_1 = require("../../util/master");
const setting_1 = __importDefault(require("../../crontab/setting"));
const gameMethod_1 = require("../../../common/gameMethod");
const game_1 = __importDefault(require("../../util/game"));
const RdsUserModel_1 = require("../redis/RdsUserModel");
const ActTaskMainModel_1 = require("../act/ActTaskMainModel");
const ActJingGuaiModel_1 = require("../act/ActJingGuaiModel");
/**
 * 破除心魔
 */
class HdXinMoModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdXinMo"; //用于存储key 和  输出1级key
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
        //活动 - 破除心魔
        let cfgHdXinMo = setting_1.default.getHuodong2(heid, "hdXinMo");
        if (cfgHdXinMo != null) {
            for (const hdcid in cfgHdXinMo) {
                let hdXinMoModel = HdXinMoModel.getInstance(ctx, uuid, hdcid);
                await hdXinMoModel.addHook(kind, count);
            }
        }
    }
    //灵兽 自爆 整合代码
    static async zibao(ctx, uuid, gzIds) {
        let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
        //活动 - 破除心魔
        let cfgHdXinMo = setting_1.default.getHuodong2(heid, "hdXinMo");
        if (cfgHdXinMo != null) {
            for (const hdcid in cfgHdXinMo) {
                let hdXinMoModel = HdXinMoModel.getInstance(ctx, uuid, hdcid);
                for (let i = 0; i < gzIds.length; i++) {
                    await hdXinMoModel.zibao(gzIds[i]);
                }
            }
        }
    }
    //加道具 整合代码
    static async additem(ctx, uuid, id, count) {
        let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
        let cfgHdXinMo = setting_1.default.getHuodong2(heid, "hdXinMo");
        if (cfgHdXinMo != null) {
            for (const hdcid in cfgHdXinMo) {
                let hdXinMoModel = HdXinMoModel.getInstance(ctx, uuid, hdcid);
                let info = await hdXinMoModel.getInfo();
                switch (id) {
                    case 1:
                        info.item += count;
                        break;
                    case 2:
                        info.score += count;
                        //更新排行榜
                        await hdXinMoModel.upRedis();
                        break;
                }
                await hdXinMoModel.update(info, ["outf", "red"]);
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
            itemTime: 0,
            score: 0,
            payscore: 0,
            task: {},
            hook: {},
            xinmo: {},
            dieFz: {},
            dayFree: 0,
            gift: {},
            giftDay: {},
            payRwd: {},
            //每日重置
            outTime: 0,
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        let cfg = (await this.getHdCfg());
        if (cfg != null && cfg.info.id != info.hdid) {
            info = this.init();
            //活动重置ID
            info.hdid = cfg.info.id;
            //初始化心魔
            info.xinmo = this._retXinMo(cfg);
            //初始化 镇灵符刷新时间
            info.itemTime = cfg.info.sAt;
            await this.update(info, ["outf", "red"]); //保存 避免每次刷新掉
        }
        //每日重置
        if (this.ctx.state.newTime > info.outTime) {
            info.outTime = this.ctx.state.new0 + 86400;
            //刷新每日任务
            info.task = {};
            info.hook = {};
            if (cfg != null) {
                let taskIds = Object.keys(cfg.data.task);
                let seedRand = new gameMethod_1.SeedRand(this.ctx.state.new0);
                seedRand.arrayShuffle(taskIds);
                //每天刷5个
                for (let i = 0; i < taskIds.length && i < cfg.data.dayTaskNum; i++) {
                    info.task[taskIds[i]] = 0;
                }
            }
            info.dayFree = 0; //每日免费刷新次数
            info.dieFz = {}; //已经用过的兽灵列表 //今日
            info.giftDay = {}; //日限购
            await this.update(info, ["outf", "red"]);
        }
        //刷镇灵符
        if (cfg != null && this.ctx.state.newTime > info.itemTime) {
            //计算可以刷几次
            //经过时长
            let dtime = this.ctx.state.newTime - info.itemTime;
            let add = Math.floor(dtime / cfg.data.stime);
            if (add > 0) {
                info.itemTime += add * cfg.data.stime; //上次刷新时间
                info.item += add; //加上 镇灵符
                //不需要保存
            }
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
        //查找自己的 死亡灵兽格子 去除掉
        if (info.dieFz[gzid] != null) {
            delete info.dieFz[gzid];
            await this.update(info, ["outf", "red"]);
        }
    }
    /**
     * 接收任务统计
     */
    async addHook(kind, count) {
        let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
        if (await actTaskMainModel.kaiqi("4007") != 1) {
            return;
        }
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            //this.ctx.throw("活动未开启");
            return;
        }
        let isPass = false;
        for (const dc in cfg.data.task) {
            if (kind == cfg.data.task[dc].kind) {
                isPass = true;
                break;
            }
        }
        if (isPass) {
            let info = await this.getInfo();
            if (info.hook[kind] == null) {
                info.hook[kind] = 0;
            }
            info.hook[kind] += count;
            await this.update(info, ["outf", "red"]);
        }
        //充值 加积分
        if (kind == "208") {
            let info = await this.getInfo();
            info.score += cfg.data.dazaojg * count;
            await this.update(info, ["outf", "red"]);
            //更新排行榜
            await this.upRedis();
        }
        // //充值 加积分
        // if (kind == "164") {
        //     let info: Info = await this.getInfo();
        //     let addJf = cfg.data.payXs * count;
        //     info.payscore += addJf; //充值积分累计
        //     this.ctx.state.master.addWin("msg", `破除心魔充值积分+ ${addJf}`);
        //     await this.update(info, ["outf", "red"]);
        //     //更新排行榜
        //     // await this.upRedis();
        // }
    }
    //更新排行榜
    async upRedis() {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            //this.ctx.throw("活动未开启");
            return;
        }
        let info = await this.getInfo();
        //加入排行榜
        let rdsUserModel = new RdsUserModel_1.RdsUserModel(Xys.RdsUser.rdsHdXinMo, this.hdcid, await this.getHeIdByUuid(this.id), cfg.info.id);
        await rdsUserModel.zSet(this.id, info.score);
    }
    /**
     * 任务领奖
     * @param id
     */
    async taskRwd(id) {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        let info = await this.getInfo();
        if (cfg.data.task[id] == null) {
            this.ctx.throw("任务ID错误" + id);
        }
        //当前已领取档次
        if (info.task[id] == null) {
            this.ctx.throw("任务未触发");
        }
        //当前已领取档次
        if (info.task[id] > 0) {
            this.ctx.throw("已经领取" + id);
        }
        //要领取的档次 是否已完成
        if (info.hook[cfg.data.task[id].kind] == null || info.hook[cfg.data.task[id].kind] < cfg.data.task[id].need) {
            this.ctx.throw("任务未完成");
        }
        //记录领奖
        info.task[id] = this.ctx.state.newTime;
        await this.update(info, ["outf", "red"]);
        //给与奖励
        await this.ctx.state.master.addItem2(cfg.data.task[id].rwd);
    }
    /**
     * 手动刷新心魔
     */
    async rstXinMo() {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        let info = await this.getInfo();
        //有没免费次数
        if (info.dayFree < cfg.data.dayFree) {
            //免费刷
            info.dayFree += 1;
        }
        else {
            //扣除需求道具
            await this.ctx.state.master.subItem1(cfg.data.reNeed);
        }
        //刷新
        info.xinmo = this._retXinMo(cfg);
        await this.update(info, ["outf", "red"]);
    }
    //心魔: 刷新
    _retXinMo(cfg) {
        let xinmo = {};
        //重新随机心魔
        let probMax = game_1.default.getProbMax(cfg.data.xinmo, "prob");
        for (let i = 1; i <= 3; i++) {
            let xmid = game_1.default.getProbRandId(probMax, cfg.data.xinmo, "prob");
            if (xmid != null) {
                xinmo[i] = {
                    xmid: xmid.toString(),
                    die: 0,
                };
            }
        }
        return xinmo;
    }
    //心魔: 击杀
    async killXinMo(xmlid, gzids) {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        let info = await this.getInfo();
        if (info.xinmo[xmlid] == null || info.xinmo[xmlid].die > 0) {
            //心魔序号错误|已经死亡
            this.ctx.throw(`xmlid_err:${xmlid}`);
        }
        //获取心魔配置
        if (cfg.data.xinmo[info.xinmo[xmlid].xmid] == null) {
            this.ctx.throw(`cfg_err:${info.xinmo[xmlid].xmid}`);
        }
        //扣除道具
        if (info.item <= 0) {
            this.ctx.throw(`道具不足`);
        }
        info.item -= 1;
        //兽灵是否存在
        let actJingGuaiModel = ActJingGuaiModel_1.ActJingGuaiModel.getInstance(this.ctx, this.id);
        let actJingGuai = await actJingGuaiModel.getInfo();
        //合法性判断
        //阵容人数是否一致
        if (gzids.length != cfg.data.xinmo[info.xinmo[xmlid].xmid].tnum) {
            this.ctx.throw(`阵容人数不符`);
        }
        for (let i = 0; i < gzids.length; i++) {
            let gzid = gzids[i];
            //是否存在
            if (actJingGuai.jgList[gzid] == null || actJingGuai.jgList[gzid].jihuo != 1) {
                //没有这个兽灵
                this.ctx.throw(`gzid_null:${gzid}`);
            }
            //是否已经用过
            if (info.dieFz[gzid] != null) {
                this.ctx.throw(`fzId :${gzid} 已经出战过了`);
            }
            //记录使用
            info.dieFz[gzid] = this.ctx.state.newTime;
        }
        //获取心魔积分范围
        let scores = gameMethod_1.gameMethod.hdXinMoScore(info.xinmo[xmlid].xmid, cfg.data, actJingGuai, gzids);
        let frand = gameMethod_1.gameMethod.rand(scores[0], scores[1]); //随机积分范围
        //加上 破魔积分
        await this.ctx.state.master.addItem1([1, 920, frand]);
        //记录击杀
        info.xinmo[xmlid].die = this.ctx.state.newTime;
        //是否全部击杀
        let allkill = true;
        for (const kmid in info.xinmo) {
            if (info.xinmo[kmid].die <= 0) {
                allkill = false;
                break;
            }
        }
        if (allkill) {
            //全部击杀 刷新
            this.ctx.state.master.addWin("msg", `心魔重生了`);
            info.xinmo = this._retXinMo(cfg);
        }
        await this.update(info, ["outf", "red"]);
        //加上击杀奖励
        await this.ctx.state.master.addItem2(cfg.data.xinmo[info.xinmo[xmlid].xmid].rwd);
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
        //添加道具
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
        let actJingGuaiModel = ActJingGuaiModel_1.ActJingGuaiModel.getInstance(this.ctx, this.id);
        let actJingGuai = await actJingGuaiModel.getInfo();
        //2. 任务有可以领取奖励时，任务按钮红点，没可以领取的奖励时消失。
        //遍历今日任务
        for (const tid in info.task) {
            if (info.task[tid] != 0) {
                //已领取
                continue;
            }
            //配置
            if (cfg.data.task[tid] != null && //任务配置存在
                info.hook[cfg.data.task[tid].kind] != null && //hook数据存在
                info.hook[cfg.data.task[tid].kind] >= cfg.data.task[tid].need //任务已完成
            ) {
                return 1;
            }
        }
        //. 累充，有奖励可以领取时，累充按钮红点，领取完消失。
        //遍历配置
        for (const id in cfg.data.payRwd) {
            if (info.payRwd[id] == null && //未领取
                cfg.data.payRwd[id].need <= info.payscore //积分需求
            ) {
                return 1;
            }
        }
        //5. 礼包，有免费礼包可以领取时红点入口红点，领取后消失。
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
        //1. 破魔材料足够时，镇压按钮红点，材料不足时消失。
        if (info.item > 0) {
            // 找出 需求最低的 BOSS
            let need = 0;
            for (const xmlid in info.xinmo) {
                if (cfg.data.xinmo[info.xinmo[xmlid].xmid] == null) {
                    //配置异常
                    continue;
                }
                if (info.xinmo[xmlid].die > 0) {
                    //已被击杀
                    continue;
                }
                if (need == 0 ||
                    need > cfg.data.xinmo[info.xinmo[xmlid].xmid].tnum) {
                    need = cfg.data.xinmo[info.xinmo[xmlid].xmid].tnum;
                }
            }
            if (need > 0) {
                //兽灵够不够上阵
                let have = 0;
                for (const jgid in actJingGuai.jgList) {
                    if (actJingGuai.jgList[jgid].jihuo != 1) {
                        continue;
                    }
                    if (info.dieFz[jgid] == null) {
                        have += 1;
                        if (have >= need) {
                            return 1;
                        }
                    }
                }
            }
        }
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
exports.HdXinMoModel = HdXinMoModel;
//# sourceMappingURL=HdXinMoModel.js.map