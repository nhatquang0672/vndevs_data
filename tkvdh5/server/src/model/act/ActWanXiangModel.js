"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActWanXiangModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const tool_1 = require("../../util/tool");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const game_1 = __importDefault(require("../../util/game"));
const gameMethod_1 = require("../../../common/gameMethod");
const hook_1 = require("../../util/hook");
const ActDaoyouModel_1 = require("./ActDaoyouModel");
/**
 * 万象
 */
class ActWanXiangModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actWanXiang"; //用于存储key 和  输出1级key
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
    //初始化
    init() {
        return {
            level: 1,
            exp: 0,
            mpList: {},
            linshi: {
                id: "",
                eps: {},
                level: 0,
                pinzhi: 0,
                lingmai: "",
                isNew: 0 //是不是新的
            },
            isYw: 0,
            dayAt: 0,
            cons: 50,
            buycons: 0,
            isOpen: 0,
            openAt: 0,
            kwd: 1,
            fjExp: 0,
            moshi: {
                pinzhi: 1,
                hq: 0,
                upPower: 1,
                keys: [0, "", ""],
                lm: [0, ""] //[是否选择，灵脉id] ""表示任意
            },
            //秘法部分
            baodi: 0,
            mfList: {},
            cwids: [],
            mfZhan: {},
            mwlist: {},
            tjlist: {},
            free: 0,
            cwNum: 0
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        if (info.tjlist == null) {
            info.tjlist = {};
        }
        if (info.dayAt < this.ctx.state.new0) {
            info.dayAt = this.ctx.state.newTime;
            info.cons = Math.max(info.cons, 50);
            //道友特权自动演算次数
            let actDaoyouModel = ActDaoyouModel_1.ActDaoyouModel.getInstance(this.ctx, this.id);
            let times = await actDaoyouModel.getDaoYouSkill("5", false);
            if (times) {
                info.cons += times;
            }
            info.buycons = 0;
            info.free = 0;
            info.cwNum = 0;
        }
        if (info.cwNum == null) {
            info.cwNum = 0;
        }
        if (info.fjExp > 0) {
            await this.ctx.state.master.addItem1([1, 88, info.fjExp]);
            info.fjExp = 0;
            await this.update(info);
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
    *  进入万象
    */
    async into() {
        // let info: Info = await this.getInfo();
        // if(info.isOpen == 0 || info.cons <= 0 || info.openAt + 4 < this.ctx.state.newTime){
        //     return //没开   没自动演算次数 三秒内不管
        // }
        // let count = Math.floor(( this.ctx.state.newTime - (info.openAt + 4) ) / 3)
        // count = Math.min(info.cons,count)
        // info.openAt = this.ctx.state.newTime
        // if(count <= 0){
        //     await this.update(info)
        //     return
        // }
        // for (let index = 0; index < count; index++) {
        //     //怎么停下来
        //     await this.yansuan()  //演算一次
        //     if(info.moshi.hq == 1){
        //         if(info.moshi.keys[0] == 1 ){
        //             if(info.linshi.pinzhi >= info.moshi.pinzhi){
        //                 if(info.moshi.keys[1] == "" && info.moshi.keys[2] == "" ){
        //                     return
        //                 }
        //                 if(info.linshi.eps[info.moshi.keys[1]] != null && info.moshi.keys[2] == "" ){
        //                     return
        //                 }
        //                 if(info.moshi.keys[1] == "" && info.linshi.eps[info.moshi.keys[2]] != null ){
        //                     return
        //                 }
        //                 if(info.linshi.eps[info.moshi.keys[1]] != null && info.linshi.eps[info.moshi.keys[2]] != null ){
        //                     return
        //                 }
        //             }
        //         }
        //     }else{
        //         if(info.linshi.pinzhi >= info.moshi.pinzhi){
        //             return
        //         }
        //         if(info.moshi.keys[0] == 1 && info.moshi.keys[1] == "" && info.moshi.keys[2] == "" ){
        //             return
        //         }
        //         if(info.moshi.keys[0] == 1 && info.linshi.eps[info.moshi.keys[1]] != null && info.moshi.keys[2] == "" ){
        //             return
        //         }
        //         if(info.moshi.keys[0] == 1 && info.moshi.keys[1] == "" && info.linshi.eps[info.moshi.keys[2]] != null ){
        //             return
        //         }
        //         if(info.moshi.keys[0] == 1 && info.linshi.eps[info.moshi.keys[1]] != null && info.linshi.eps[info.moshi.keys[2]] != null ){
        //             return
        //         }
        //     }
        //     // lm:[number,number]   //[是否选择，灵脉id] 0表示任意
        //     if(info.moshi.lm[0] == 1){
        //         if(info.moshi.lm[1] == "" && info.linshi.lingmai != ""){
        //             return
        //         }
        //         if(info.moshi.lm[1] ==  info.linshi.lingmai){
        //             return
        //         }
        //     }
        // }
        // await this.update(info)
    }
    /**
    *  演算
    */
    async yansuan(isOpen) {
        let info = await this.getInfo();
        if (info.linshi.id != "") {
            await this.backData();
            return;
        }
        let mathCount = tool_1.tool.mathcfg_count(this.ctx, "wanxiang_chou");
        let mathItem = tool_1.tool.mathcfg_item(this.ctx, "wanxiang_chou");
        await this.ctx.state.master.subItem1(mathItem);
        if (isOpen == 1) {
            info.cons -= 1;
            info.openAt = this.ctx.state.newTime;
        }
        if (info.cons < 0) {
            info.cons = 0;
            // this.ctx.throw("无自动演算次数")
        }
        info.exp += mathCount;
        let cfgMingge = gameCfg_1.default.wanxiangMingge.getItemCtx(this.ctx, info.level.toString());
        if (info.exp >= cfgMingge.exp) {
            let cfgNextMingge = gameCfg_1.default.wanxiangMingge.getItem((info.level + 1).toString());
            if (cfgNextMingge != null) {
                info.exp -= cfgMingge.exp;
                info.level += 1;
                await hook_1.hookNote(this.ctx, "wxmingpanLv", info.level);
            }
            else {
                info.exp = 0; //最顶级不在加经验
            }
        }
        // 命格的随机规则：				
        // 1.先随机出什么命格				
        // 2.根据随机出来的命格出固定属性				
        // 3.固定属性的等级根据命盘的等级上下波动±1				
        // 4.根据命盘的等级判断是否出特殊抗性以及出几条特殊抗性				
        // 5.根据开悟的等级出命格的品质				
        // 6.根据命格的品质出抗性的数值				
        // 7.基础属性值=等级对应数值*基础属性品质系数				
        // 8.特殊属性值=等级对应数值*特殊属性品质系数		
        let cfgPool = gameCfg_1.default.wanxiangInfo.pool;
        let cfgItem = game_1.default.getProbRandItem(0, cfgPool, "prob");
        if (cfgItem == null) {
            this.ctx.throw("演算失败");
        }
        info.linshi = {
            id: "",
            eps: {},
            level: 0,
            pinzhi: 0,
            lingmai: "",
            isNew: 1
        };
        info.linshi.id = cfgItem.id;
        info.linshi.level = Math.max(game_1.default.rand(info.level - 1, info.level + 1), 1);
        info.linshi.eps[cfgItem.gdep] = 0;
        let kk = 0; //记录生成几条随机属性
        for (const _lv of cfgItem.locklv) {
            if (info.level >= _lv) {
                kk += 1;
            }
        }
        let sjKeys = ["speed", "hsjiyun", "hsshanbi", "hslianji", "hsfanji", "hsbaoji", "hsxixue"];
        if (kk > 0) {
            let rkeys = game_1.default.getRandArr(sjKeys, kk);
            for (const key of rkeys) {
                info.linshi.eps[key] = 0;
            }
        }
        let cfgKw = gameCfg_1.default.wanxiangKaiwu.getItemCtx(this.ctx, info.kwd.toString());
        let rProb = game_1.default.rand(1, 10000);
        info.linshi.pinzhi = 1;
        for (let index = 1; index <= 9; index++) {
            let sprob = cfgKw["prob_" + index];
            if (rProb <= sprob) {
                info.linshi.pinzhi = index;
                break;
            }
            else {
                rProb -= sprob;
            }
        }
        //计算属性
        let cfgWxPz = gameCfg_1.default.wanxiangPinzhi.getItemCtx(this.ctx, info.linshi.pinzhi.toString());
        for (const _key in info.linshi.eps) {
            switch (_key) {
                case "atk":
                    info.linshi.eps[_key] = Math.floor(game_1.default.rand(cfgMingge.atk - cfgMingge.atk_bd, cfgMingge.atk + cfgMingge.atk_bd) * cfgWxPz.jcbase);
                    break;
                case "def":
                    info.linshi.eps[_key] = Math.floor(game_1.default.rand(cfgMingge.def - cfgMingge.def_bd, cfgMingge.def + cfgMingge.def_bd) * cfgWxPz.jcbase);
                    break;
                case "speed":
                    info.linshi.eps[_key] = Math.floor(game_1.default.rand(cfgMingge.speed - cfgMingge.speed_bd, cfgMingge.speed + cfgMingge.speed_bd) * cfgWxPz.jcbase);
                    break;
                case "hp_max":
                    info.linshi.eps[_key] = Math.floor(game_1.default.rand(cfgMingge.hp_max - cfgMingge.hp_max_bd, cfgMingge.hp_max + cfgMingge.hp_max_bd) * cfgWxPz.jcbase);
                    break;
                case "jiyun":
                case "shanbi":
                case "lianji":
                case "fanji":
                case "baoji":
                case "xixue":
                    info.linshi.eps[_key] = Math.floor(game_1.default.rand(cfgMingge.ts - cfgMingge.ts_bd, cfgMingge.ts + cfgMingge.ts_bd) * cfgWxPz.jcbase);
                    break;
                case "hsjiyun":
                case "hsshanbi":
                case "hslianji":
                case "hsfanji":
                case "hsbaoji":
                case "hsxixue":
                    info.linshi.eps[_key] = Math.floor(cfgMingge["kx_" + info.linshi.pinzhi] * cfgWxPz.jcbase);
                    break;
                default:
                    this.ctx.throw("配置错误key" + _key);
                    break;
            }
        }
        //衍生出一条灵脉
        if (["9", "10", "11", "12"].indexOf(cfgItem.id) != -1) {
            info.linshi.lingmai = game_1.default.rand(1, 6).toString();
        }
        await this.update(info);
        await hook_1.hookNote(this.ctx, "wxchouqumingpan", 1);
    }
    /**
    *  装备
    */
    async zhuangbei() {
        let info = await this.getInfo();
        let obj = gameMethod_1.gameMethod.objCopy(info.linshi);
        if (info.mpList[obj.id] == null) {
            info.linshi = {
                id: "",
                eps: {},
                level: 0,
                pinzhi: 0,
                lingmai: "",
                isNew: 0
            };
        }
        else {
            info.linshi = {
                id: obj.id,
                eps: info.mpList[obj.id].eps,
                level: info.mpList[obj.id].level,
                pinzhi: info.mpList[obj.id].pinzhi,
                lingmai: info.mpList[obj.id].lingmai,
                isNew: obj.isNew == 0 ? 1 : 0
            };
        }
        info.mpList[obj.id] = {
            eps: obj.eps,
            level: obj.level,
            pinzhi: obj.pinzhi,
            lingmai: obj.lingmai
        };
        await this.update(info);
        if (info.isYw == 1) {
            await this.yiwang();
        }
    }
    /**
    *  遗忘
    */
    async yiwang() {
        let info = await this.getInfo();
        if (info.linshi.id == "") {
            return;
        }
        info.linshi = {
            id: "",
            eps: {},
            level: 0,
            pinzhi: 0,
            lingmai: "",
            isNew: 0
        };
        let item = tool_1.tool.mathcfg_item(this.ctx, "wanxiang_fenjie");
        let mathCount1 = item[2];
        //道友特权提升法决经验
        let actDaoyouModel = ActDaoyouModel_1.ActDaoyouModel.getInstance(this.ctx, this.id);
        let totalSkillRate = await actDaoyouModel.getDaoYouSkill("3");
        if (totalSkillRate) {
            let jl = Math.floor(mathCount1 * totalSkillRate);
            mathCount1 += jl;
            // this.ctx.state.master.addWin("msg","道友额外为你提升"+jl+"法决经验")
        }
        await this.update(info);
        await this.ctx.state.master.addItem1([item[0], item[1], mathCount1], "");
    }
    /**
    *  设置是否自动遗忘
    */
    async setYw() {
        let info = await this.getInfo();
        if (info.isYw == 1) {
            info.isYw = 0;
        }
        else {
            info.isYw = 1;
        }
        await this.update(info);
    }
    /**
    *  设置自动模式
    */
    async setMoshi() {
        const { hq, pinzhi, keys, lm, upPower } = tool_1.tool.getParams(this.ctx);
        let info = await this.getInfo();
        info.moshi.pinzhi = pinzhi;
        info.moshi.upPower = upPower;
        info.moshi.hq = hq;
        info.moshi.keys = keys;
        info.moshi.lm = lm;
        await this.update(info);
    }
    /**
    *  设置是否开启自动模式
    */
    async setOpen() {
        // let info: Info = await this.getInfo();
        // if(info.isOpen == 1){
        //     info.isOpen = 0
        //     info.openAt = 0
        // }else{
        //     info.isOpen = 1
        //     info.openAt = this.ctx.state.newTime
        // }
        // await this.update(info)
    }
    /**
    *  提升开悟点
    */
    async upKwd(count) {
        let info = await this.getInfo();
        let mathItem = tool_1.tool.mathcfg_item(this.ctx, "wanxiang_kaiwu");
        await this.ctx.state.master.subItem1([mathItem[0], mathItem[1], mathItem[2] * count]);
        info.kwd += count;
        let cfgKw = gameCfg_1.default.wanxiangKaiwu.getItem(info.kwd.toString());
        if (cfgKw == null) {
            this.ctx.throw("参数错误");
        }
        await this.update(info);
        await hook_1.hookNote(this.ctx, "wxkaiwunum", count);
    }
    /**
    *  秘法参悟
    */
    async canwu(count, isSub = true) {
        let info = await this.getInfo();
        let mathItem = tool_1.tool.mathcfg_item(this.ctx, "wanxiang_canwu");
        let mathCount = tool_1.tool.mathcfg_count(this.ctx, "wanxiang_canwu");
        let mathCount1 = tool_1.tool.mathcfg_count1(this.ctx, "wanxiang_canwu");
        if (isSub) {
            let subCount = count;
            if (info.cwNum <= 0) {
                subCount -= 1;
                info.cwNum += count;
            }
            if (subCount > 0) {
                await this.ctx.state.master.subItem1([mathItem[0], mathItem[1], mathItem[2] * subCount]);
            }
        }
        info.cwids = [];
        let cfgPool = gameCfg_1.default.wanxiangXfinfo.pool;
        for (let index = 0; index < count; index++) {
            info.baodi += 1;
            let cqpinzhi = 0; //抽取配置 0不限制
            if (info.baodi >= mathCount) {
                info.baodi = 0;
                cqpinzhi = mathCount1;
            }
            let mftype = 0;
            if (gameMethod_1.gameMethod.isEmpty(info.mfList)) { //作假
                cqpinzhi = 2;
                mftype = 1;
            }
            let cfglist = [];
            for (const key in cfgPool) {
                if (cqpinzhi > 0 && cfgPool[key].pinzhi != cqpinzhi) {
                    continue;
                }
                if (mftype != 0 && cfgPool[key].type != mftype) {
                    continue;
                }
                cfglist.push(cfgPool[key]);
            }
            let ccfg = game_1.default.getProbRandItem(0, cfglist, "prob");
            if (ccfg == null) {
                this.ctx.throw("参悟失败");
            }
            if (info.mfList[ccfg.id] == null) {
                info.mfList[ccfg.id] = {
                    level: 1,
                    step: 1,
                    chip: 0,
                    mwLock: []
                };
                info.cwids.push([ccfg.id, 0]);
                await hook_1.hookNote(this.ctx, "wxxfNum", Object.keys(info.mfList).length);
            }
            else {
                info.mfList[ccfg.id].chip += ccfg.fenjie;
                info.cwids.push([ccfg.id, ccfg.fenjie]);
            }
        }
        await this.update(info);
        await hook_1.hookNote(this.ctx, "wxxfchou", count);
    }
    /**
    *  添加秘法
    */
    async addMf(mfid) {
        let info = await this.getInfo();
        if (info.mfList[mfid] == null) {
            info.mfList[mfid] = {
                level: 1,
                step: 1,
                chip: 0,
                mwLock: []
            };
            info.cwids.push([mfid, 0]);
            await this.update(info);
            await hook_1.hookNote(this.ctx, "wxxfNum", Object.keys(info.mfList).length);
            return [17, mfid, 1];
        }
        else {
            let cfg = gameCfg_1.default.wanxiangXfinfo.getItemCtx(this.ctx, mfid);
            info.mfList[mfid].chip += cfg.fenjie;
            info.cwids.push([mfid, cfg.fenjie]);
            await this.update(info);
            return [18, mfid, cfg.fenjie];
        }
    }
    /**
    *  秘法升级
    */
    async upLv(mfid) {
        let info = await this.getInfo();
        if (info.mfList[mfid] == null) {
            this.ctx.throw("秘法未解锁");
        }
        let cfgStep = gameCfg_1.default.wanxiangXfstep.getItemCtx(this.ctx, info.mfList[mfid].step.toString());
        if (info.mfList[mfid].level >= cfgStep.maxLv) {
            this.ctx.throw("秘法未突破");
        }
        let cfgNextLv = gameCfg_1.default.wanxiangXflv.getItemCtx(this.ctx, (info.mfList[mfid].level + 1).toString());
        if (cfgNextLv == null) {
            this.ctx.throw("秘法已满级");
        }
        let cfgLv = gameCfg_1.default.wanxiangXflv.getItemCtx(this.ctx, info.mfList[mfid].level.toString());
        await this.ctx.state.master.subItem2(cfgLv.need);
        info.mfList[mfid].level += 1;
        //检测是否有解锁铭文孔
        let cfgXfInfo = gameCfg_1.default.wanxiangXfinfo.getItemCtx(this.ctx, mfid);
        for (let index = 0; index < cfgXfInfo.mwLock.length; index++) {
            if (cfgXfInfo.mwLock[0] > info.mfList[mfid].level) {
                continue; //未达到要求
            }
            if (info.mfList[mfid].mwLock[index] != null) {
                continue; //已经解锁
            }
            info.mfList[mfid].mwLock[index] = ""; //解锁
        }
        await this.update(info);
        await hook_1.hookNote(this.ctx, "wxxfaddLv", 1);
    }
    /**
    *  秘法升阶
    */
    async upStep(mfid) {
        let info = await this.getInfo();
        if (info.mfList[mfid] == null) {
            this.ctx.throw("秘法未解锁");
        }
        let cfgNextStep = gameCfg_1.default.wanxiangXfstep.getItemCtx(this.ctx, (info.mfList[mfid].step + 1).toString());
        if (cfgNextStep == null) {
            this.ctx.throw("秘法已满阶");
        }
        let cfgStep = gameCfg_1.default.wanxiangXfstep.getItemCtx(this.ctx, info.mfList[mfid].step.toString());
        if (info.mfList[mfid].chip < cfgStep.need) {
            this.ctx.throw("碎片不足");
        }
        info.mfList[mfid].chip -= cfgStep.need;
        info.mfList[mfid].step += 1;
        await this.update(info);
    }
    /**
    *  秘法重置
    */
    async chongzhi(mfid) {
        let info = await this.getInfo();
        if (info.mfList[mfid] == null) {
            this.ctx.throw("秘法未解锁");
        }
        if (info.mfList[mfid].level <= 1) {
            this.ctx.throw("无法重置");
        }
        let items = [];
        for (let index = 1; index < info.mfList[mfid].level; index++) {
            let cfgLv = gameCfg_1.default.wanxiangXflv.getItemCtx(this.ctx, index.toString());
            items = game_1.default.addArr(items, cfgLv.need);
        }
        info.mfList[mfid].level = 1;
        // info.mfList[mfid].step = 1
        //卸下宝石
        for (const mwid of info.mfList[mfid].mwLock) {
            if (mwid == "") {
                continue;
            }
            if (info.mwlist[mwid] == null) {
                info.mwlist[mwid] = 0;
            }
            // info.mwlist[mwid] += 1
            items.push([16, parseInt(mwid), 1]);
        }
        info.mfList[mfid].mwLock = [];
        await this.update(info);
        await this.ctx.state.master.addItem2(game_1.default.mergeArr(items));
        let mwmax = 0;
        for (const _mfid in info.mfList) {
            for (const mwid of info.mfList[_mfid].mwLock) {
                if (mwid != "") {
                    mwmax += 1;
                }
            }
        }
        await hook_1.hookNote(this.ctx, "wxxfmwNum", mwmax);
    }
    /**
    *  秘法出站
    */
    async chuzhan(mfid) {
        let info = await this.getInfo();
        if (info.mfList[mfid] == null) {
            this.ctx.throw("秘法未解锁");
        }
        let cfgInfo = gameCfg_1.default.wanxiangXfinfo.getItemCtx(this.ctx, mfid);
        info.mfZhan[cfgInfo.type] = mfid;
        await this.update(info);
    }
    /**
     * 更换铭文
     * @param mfid
     * @param xbid
     * @param mwid
     */
    async mwGenghuan(mfid, xbid, mwid) {
        let info = await this.getInfo();
        if (info.mfList[mfid] == null) {
            this.ctx.throw("秘法未解锁");
        }
        if (info.mfList[mfid].mwLock[xbid] == null) {
            this.ctx.throw("铭文槽未解锁");
        }
        if (mwid != "") {
            if (info.mwlist[mwid] == null || info.mwlist[mwid] <= 0) {
                this.ctx.throw("铭文不足");
            }
            info.mwlist[mwid] -= 1;
        }
        if (info.mfList[mfid].mwLock[xbid] != "") {
            let oldMw = info.mfList[mfid].mwLock[xbid];
            if (info.mwlist[oldMw] == null) {
                info.mwlist[oldMw] = 0;
            }
            info.mwlist[oldMw] += 1;
        }
        info.mfList[mfid].mwLock[xbid] = mwid.toString();
        await this.update(info);
        let mwmax = 0;
        for (const _mfid in info.mfList) {
            for (const mwid of info.mfList[_mfid].mwLock) {
                if (mwid != "") {
                    mwmax += 1;
                }
            }
        }
        await hook_1.hookNote(this.ctx, "wxxfmwNum", mwmax);
    }
    /**
     * 铭文3合1
     * @param mwid
     */
    async mwhecheng(mwid) {
        let info = await this.getInfo();
        if (info.mwlist[mwid] == null || info.mwlist[mwid] < 3) {
            this.ctx.throw("铭文不足");
        }
        info.mwlist[mwid] -= 3;
        let cfgmw = gameCfg_1.default.wanxiangMingwen.getItemCtx(this.ctx, mwid);
        if (cfgmw.nextid == null || cfgmw.nextid == "0") {
            this.ctx.throw("无法合成");
        }
        if (info.mwlist[cfgmw.nextid] == null) {
            info.mwlist[cfgmw.nextid] = 0;
        }
        info.mwlist[cfgmw.nextid] += 1;
        await this.update(info);
    }
    /**
     * 铭文一键合成
     */
    async mwhcAll() {
        let info = await this.getInfo();
        let pool = gameCfg_1.default.wanxiangMingwen.pool;
        let isUpdate = false;
        let tipItems = {};
        for (const key in pool) {
            if (pool[key].nextid == "0") {
                continue; //最顶级
            }
            let _mwid = pool[key].id;
            if (info.mwlist[_mwid] == null || info.mwlist[_mwid] < 3) {
                continue; //铭文不足
            }
            let nextid = pool[key].nextid;
            let max = Math.floor(info.mwlist[_mwid] / 3); //最多能生成几个
            info.mwlist[_mwid] -= 3 * max;
            if (info.mwlist[nextid] == null) {
                info.mwlist[nextid] = 0;
            }
            info.mwlist[nextid] += max;
            isUpdate = true;
            if (tipItems[nextid] == null) {
                tipItems[nextid] = 0;
            }
            tipItems[nextid] += 3;
        }
        if (isUpdate) {
            await this.update(info);
            let items = [];
            for (const _id in tipItems) {
                if (info.mwlist[_id] == null || info.mwlist[_id] < 1) {
                    continue;
                }
                let maxCount = Math.min(tipItems[_id], info.mwlist[_id]);
                this.ctx.state.master.addWin("items", [16, parseInt(_id), maxCount]);
            }
        }
        else {
            this.ctx.throw("铭文数量不足");
        }
    }
    /**
     * 添加铭文
     * @param mwid
     */
    async addMw(mwid, count) {
        let info = await this.getInfo();
        if (info.mwlist[mwid] == null) {
            info.mwlist[mwid] = 0;
        }
        info.mwlist[mwid] += count;
        await this.update(info);
    }
    async addCons(count) {
        let info = await this.getInfo();
        info.cons += count;
        await this.update(info);
    }
    /**
     * 购买自动开启命盘次数
     */
    async buyCons(count) {
        if (count < 1) {
            this.ctx.throw("参数错误");
        }
        let info = await this.getInfo();
        info.cons += count;
        info.buycons += count;
        let cfgCount = tool_1.tool.mathcfg_count(this.ctx, "wanxiang_zidong");
        if (info.buycons > cfgCount) {
            this.ctx.throw("参数错误1");
        }
        await this.update(info);
        let cfgItem = tool_1.tool.mathcfg_item(this.ctx, "wanxiang_zidong");
        await this.ctx.state.master.subItem1([cfgItem[0], cfgItem[1], cfgItem[2] * count]);
    }
    /**
     * 图鉴升级
     * @param mwid
     */
    async tjUplv(tjid) {
        let cfg = gameCfg_1.default.wanxiangXftj.getItemCtx(this.ctx, tjid);
        let info = await this.getInfo();
        if (info.tjlist[tjid] == null) {
            info.tjlist[tjid] = 0;
        }
        for (const xfid of cfg.xfids) {
            if (info.mfList[xfid] == null) {
                this.ctx.throw("未满足条件");
            }
            if (info.mfList[xfid].step <= info.tjlist[tjid]) {
                this.ctx.throw("未满足条件!");
            }
        }
        info.tjlist[tjid] += 1;
        await this.update(info);
    }
    /**
     * 充值下单检查
     */
    async checkUp11() {
        let mathCount = tool_1.tool.mathcfg_count(this.ctx, "wanxiang_canwu");
        let info = await this.getInfo();
        if (info.free >= mathCount) {
            this.ctx.throw("无免费次数");
        }
        return {
            type: 1,
            msg: "万象悟道",
            data: "0"
        };
    }
    /**
     * 充值成功后执行
     */
    async carryOut11() {
        let info = await this.getInfo();
        info.free += 1;
        await this.update(info);
        await this.canwu(1, false);
        return {
            type: 1,
            msg: "",
            data: null
        };
    }
}
exports.ActWanXiangModel = ActWanXiangModel;
//# sourceMappingURL=ActWanXiangModel.js.map