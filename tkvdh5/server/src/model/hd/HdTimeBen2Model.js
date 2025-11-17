"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HdTimeBen2Model = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const tool_1 = require("../../util/tool");
/**
 * 活动 限时福利
 * HdTimeBen2Model
 */
class HdTimeBen2Model extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdTimeBen2"; //用于存储key 和  输出1级key
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
    outKey2() {
        return this.hdcid; //输出2级key
    }
    //初始化
    init() {
        return {
            hdid: "",
            list: {},
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        let cfg = (await this.getHdCfg());
        if (cfg != null && cfg.info.id != info.hdid) {
            info = this.init();
            info.hdid = cfg.info.id;
        }
        //每一档单独进行每日重置
        for (const type in info.list) {
            //如果是昨天触发的 并且已经失效
            if (info.list[type].showTime < this.ctx.state.new0 && //昨天触发
                info.list[type].otime < this.ctx.state.newTime //已经过期了
            ) {
                //已经失效
                delete info.list[type]; //重置
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
     * 获取红点 充值活动 没有红点
     */
    async getRed() {
        return 0;
    }
    _dcinit() {
        return {
            dc: 1,
            otime: 0,
            show: 0,
            showTime: 0,
            dcBuys: {},
        };
    }
    //尝试触发礼包 调用 //前端触发 直接调用
    async trip(type) {
        // console.log(`尝试触发 trip ${type}`);
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            // this.ctx.throw("trip活动未生效"); //去除提示?
            return;
        }
        //新版触发逻辑
        let typecfg = cfg.data.list[type]; //本类型礼包配置
        if (typecfg == null) {
            // console.error(`类型错误 ${type}`);
            return;
        }
        //是否 升降级礼包
        if (typecfg == null || typecfg.type != 1) {
            console.error(`type礼包类型错误 ${type}`);
            return;
        }
        let info = await this.getInfo();
        //礼包信息初始化
        if (info.list[type] == null) {
            info.list[type] = this._dcinit();
        }
        //配置档次是否存在
        let dccfg = typecfg.dclist[info.list[type].dc]; //本档次礼包配置
        if (dccfg == null) {
            // console.error(`档次错误 ${info.newList[type].dc}`);
            return;
        }
        if (info.list[type].otime + typecfg.nextcd > this.ctx.state.newTime) {
            //礼包生效中 或者 冷却时间还没过 不触发
            // console.log(`礼包生效中 或者 冷却时间还没过`);
            return;
        }
        if (info.list[type].show >= typecfg.show) {
            //今天已经触发过X次 不再触发
            // console.log(`今天已经触发过${info.newList[type].show}次 不再触发`);
            return;
        }
        //本档次礼包 已经被买完了 不再触发
        let buyOver = true;
        for (const id in typecfg.dclist[info.list[type].dc].glist) {
            if (info.list[type].dcBuys[id] != null) {
                buyOver = false;
                break;
            }
        }
        if (buyOver) {
            //本档次(最高档)已经卖完 不再触发
            return;
        }
        //触发
        info.list[type].otime = this.ctx.state.newTime + typecfg.cd;
        info.list[type].show += 1;
        info.list[type].showTime = this.ctx.state.newTime;
        await this.update(info, ["outf", "red"]);
        return;
    }
    /**
     * 按照需求数额 触发的礼包
     * @param type
     * @param cha 需求的数额
     * @returns
     */
    async trip2(type, cha) {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            tool_1.tool.clog(`trip2 活动未生效`);
            return;
        }
        //新版触发逻辑
        let typecfg = cfg.data.list[type]; //本类型礼包配置
        if (typecfg == null) {
            console.error(`类型错误 ${type}`);
            return;
        }
        //是否按档次触发类型礼包
        if (typecfg == null || typecfg.type != 2) {
            console.error(`type礼包类型错误 ${type}`);
            return;
        }
        let info = await this.getInfo();
        //礼包信息初始化
        if (info.list[type] == null) {
            info.list[type] = this._dcinit();
        }
        if (info.list[type].otime + typecfg.nextcd > this.ctx.state.newTime) {
            //礼包生效中 或者 冷却时间还没过 不触发
            tool_1.tool.clog(`trip2 礼包 冷却时间还没过 不触发`);
            return;
        }
        if (info.list[type].show >= typecfg.show) {
            //今天已经触发过X次 不再触发
            tool_1.tool.clog(`今天已经触发过 ${typecfg.show}次 不再触发`);
            return;
        }
        //搜索指定档次 找不到 就用最高档次
        let chufadc = 0;
        for (let dc = 1; dc <= 100; dc++) {
            let dccfg = typecfg.dclist[dc]; //本档次礼包配置
            if (dccfg == null) {
                break;
            }
            //本档次礼包 已经被买完了 不再触发
            let buyOver = true;
            for (const id in dccfg.glist) {
                if (info.list[type].dcBuys[id] != null) {
                    buyOver = false;
                    break;
                }
            }
            if (buyOver) {
                //本档次已经卖完 不再触发
                continue;
            }
            chufadc = dc;
            if (dccfg.type2_need != null && cha < dccfg.type2_need) {
                //触发本档
                break;
            }
        }
        //判定完 开始触发
        info.list[type].dc = chufadc;
        info.list[type].otime = this.ctx.state.newTime + typecfg.cd;
        info.list[type].show += 1;
        info.list[type].showTime = this.ctx.state.newTime;
        await this.update(info, ["outf", "red"]);
        tool_1.tool.clog(`trip2 礼包触发`);
        return;
    }
    /**
     * 充值下单检查
     * isNew : 是否新版
     */
    async checkUp(typeid) {
        const { type, id } = this.idFen(typeid);
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        let typecfg = cfg.data.list[type]; //本类型礼包配置
        if (typecfg == null) {
            this.ctx.throw(`礼包类型错误 ${type}`);
        }
        let info = await this.getInfo();
        if (info.list[type] == null) {
            this.ctx.throw("礼包未触发");
        }
        if (info.list[type].otime < this.ctx.state.newTime) {
            this.ctx.throw("礼包已过期");
        }
        //礼包已被买完 // 购买记录dcBuys >= 本次弹出次数 show
        if (info.list[type].dcBuys[id] != null) {
            // && info.list[type].dcBuys[id] >= info.list[type].show
            this.ctx.throw("礼包买过");
        }
        //档次配置
        let dccfg = typecfg.dclist[info.list[type].dc]; //本档次礼包配置
        if (dccfg == null || dccfg.glist[id] == null) {
            this.ctx.throw(`档次配置错误 ${type} ${id}`);
        }
        if (dccfg.glist[id].need[0] != 10) {
            this.ctx.throw("参数错误");
        }
        return {
            type: 1,
            msg: cfg.info.title,
            data: dccfg.glist[id].need[1],
            kind10Cs: this.kid + "_" + this.hdcid + "_" + type + "_" + dccfg.glist[id].need[1]
        };
    }
    // //档次ID 和 礼包ID 合体 前端
    // private idHe(type: Xys.TimeBen2Type, id: string) {
    //     return `${type}_${id}`;
    // }
    //档次ID 和 礼包ID 合体
    idFen(typeid) {
        let arr = typeid.split("_");
        return {
            type: arr[0],
            id: arr[1],
        };
    }
    /**
     * 充值成功后执行
     */
    async carryOut(typeid) {
        const { type, id } = this.idFen(typeid);
        let cfg = (await this.getHdCfg());
        if (cfg == null) {
            return {
                type: 0,
                msg: "充值失败",
                data: null,
            };
        }
        let typecfg = cfg.data.list[type]; //本类型礼包配置
        if (typecfg == null) {
            this.ctx.throw(`礼包类型错误 ${type}`);
        }
        let info = await this.getInfo();
        if (info.list[type] == null) {
            this.ctx.throw("礼包未触发");
        }
        // if (info.newList[type].otime < this.ctx.state.newTime){
        //     this.ctx.throw("礼包已过期");
        // }
        //档次配置
        let dccfg = typecfg.dclist[info.list[type].dc]; //本档次礼包配置
        if (dccfg == null || dccfg.glist[id] == null) {
            this.ctx.throw(`档次配置错误 ${type} ${id}`);
        }
        //礼包已被买完 // 购买记录dcBuys >= 本次弹出次数 show
        if (info.list[type].dcBuys[id] != null) {
            // && info.list[type].dcBuys[id] >= info.list[type].show
            this.ctx.throw("礼包买过");
        }
        //记录档次 购买记录 = 弹出次
        info.list[type].dcBuys[id] = info.list[type].show;
        //加上奖励
        await this.ctx.state.master.addItem2(dccfg.glist[id].rwd);
        //本档次 全部买完了
        let isOver = true;
        for (const _id in dccfg.glist) {
            if (info.list[type].dcBuys[_id] == null) {
                // || info.list[type].dcBuys[_id] < info.list[type].show
                //未购买完
                isOver = false;
                break;
            }
        }
        if (isOver) {
            //去除过期时间 / 1去除礼包 2去除CD
            info.list[type].otime = 0;
            if (typecfg.type == 1) {
                //去除失败次数
                info.list[type].show = 0;
                //升降类型 买完升级
                if (typecfg.dclist[info.list[type].dc + 1] != null) {
                    //下次触发 就升档
                    info.list[type].dc += 1;
                }
            }
        }
        await this.update(info, ["outf", "red"]);
        return {
            type: 1,
            msg: "充值成功",
            data: dccfg.glist[id].need[1],
        };
    }
}
exports.HdTimeBen2Model = HdTimeBen2Model;
/**
 *  type: 1 | 2; //礼包类型 1:升降级礼包 2:指定档礼包()
            show: number; //一天触发次数限制
            nextcd: number; //同一类型礼包  消失后 多久才能再次触发
            cd: number; //消失时间
            dclist: {
                [dc: number]: {
                    glist:{
                        [id:string]:{
                            need: KindItem; //需求
                            rwd: KindItem[]; //奖励
                            prec: number; //折扣
                        }
                    }
                    type2_need?: number; //指定档礼包 缺失数额
                };
            };
 */
// let a = {
//     info:{ //活动基础信息
//         id: "20230307_1", //重置ID
//         icon: "1", //图片id
//         title: "限时福利", //活动标题
//         cuser:"", //创号区间 格式：1_7
//         show:0 //展示时间 (分钟)
//     },
//     data: {
//         list: {
//             "shengqi": { //天工锤礼包
//                 type: 1, //礼包类型 升降级礼包
//                 show: 2, //触发次数限制
//                 nextcd: 1800, //同类型 消失后 触发CD
//                 cd: 14400, //消失时间
//                 dclist: { //档次列表
//                     1:{
//                         glist:{
//                             '1':{
//                                 need: [10,30], //需求
//                                 rwd: [[1,1,300],[1,56,12],[1,902,20]], //奖励
//                                 prec: 500, //折扣
//                             },
//                             '2':{
//                                 need: [10,68], //需求
//                                 rwd: [[1,1,680],[1,56,28],[1,902,40]], //奖励
//                                 prec: 500, //折扣
//                             },
//                             '3':{
//                                 need: [10,128], //需求
//                                 rwd: [[1,1,1280],[1,56,54],[1,902,60]], //奖励
//                                 prec: 500, //折扣
//                             },
//                         }
//                     },
//                     2:{
//                         glist:{
//                             '4':{
//                                 need: [10,198], //需求
//                                 rwd: [[1,1,1980],[1,56,84],[1,902,80]], //奖励
//                                 prec: 500, //折扣
//                             },
//                             '5':{
//                                 need: [10,328], //需求
//                                 rwd: [[1,1,3280],[1,56,140],[1,902,130]], //奖励
//                                 prec: 500, //折扣
//                             },
//                             '6':{
//                                 need: [10,648], //需求
//                                 rwd: [[1,1,6480],[1,56,275],[1,902,250]], //奖励
//                                 prec: 500, //折扣
//                             },
//                         }
//                     }
//                 }
//             },
//             "chibang": { //百炼玉礼包
//                 type: 1, //礼包类型 升降级礼包
//                 show: 2, //触发次数限制
//                 nextcd: 1800, //同类型 消失后 触发CD
//                 cd: 14400, //消失时间
//                 dclist: { //档次列表
//                     1:{
//                         glist:{
//                             '1':{
//                                 need: [10,30], //需求
//                                 rwd: [[1,1,300],[1,52,15],[1,902,20]], //奖励
//                                 prec: 500, //折扣
//                             },
//                             '2':{
//                                 need: [10,68], //需求
//                                 rwd: [[1,1,680],[1,52,28],[1,902,40]], //奖励
//                                 prec: 500, //折扣
//                             },
//                             '3':{
//                                 need: [10,128], //需求
//                                 rwd: [[1,1,1280],[1,52,55],[1,902,60]], //奖励
//                                 prec: 500, //折扣
//                             },
//                         }
//                     },
//                     2:{
//                         glist:{
//                             '4':{
//                                 need: [10,198], //需求
//                                 rwd: [[1,1,1980],[1,52,85],[1,902,80]], //奖励
//                                 prec: 500, //折扣
//                             },
//                             '5':{
//                                 need: [10,328], //需求
//                                 rwd: [[1,1,3280],[1,52,142],[1,902,130]], //奖励
//                                 prec: 500, //折扣
//                             },
//                             '6':{
//                                 need: [10,648], //需求
//                                 rwd: [[1,1,6480],[1,52,280],[1,902,250]], //奖励
//                                 prec: 500, //折扣
//                             },
//                         }
//                     },
//                 }
//             },
//             "fazhen": { //血脉精华礼包
//                 type: 1, //礼包类型 升降级礼包
//                 show: 2, //触发次数限制
//                 nextcd: 1800, //同类型 消失后 触发CD
//                 cd: 14400, //消失时间
//                 dclist: { //档次列表
//                     1:{
//                         glist:{
//                             '1':{
//                                 need: [10,30], //需求
//                                 rwd: [[1,1,300],[1,55,750],[1,902,20]], //奖励
//                                 prec: 500, //折扣
//                             },
//                             '2':{
//                                 need: [10,68], //需求
//                                 rwd: [[1,1,680],[1,55,1750],[1,902,40]], //奖励
//                                 prec: 500, //折扣
//                             },
//                             '3':{
//                                 need: [10,128], //需求
//                                 rwd: [[1,1,1280],[1,55,3300],[1,902,60]], //奖励
//                                 prec: 500, //折扣
//                             },
//                         }
//                     },
//                     2:{
//                         glist:{
//                             '4':{
//                                 need: [10,198], //需求
//                                 rwd: [[1,1,1980],[1,55,5100],[1,902,80]], //奖励
//                                 prec: 500, //折扣
//                             },
//                             '5':{
//                                 need: [10,328], //需求
//                                 rwd: [[1,1,3280],[1,55,8500],[1,902,130]], //奖励
//                                 prec: 500, //折扣
//                             },
//                             '6':{
//                                 need: [10,648], //需求
//                                 rwd: [[1,1,6480],[1,55,13750],[1,902,250]], //奖励
//                                 prec: 500, //折扣
//                             },
//                         }
//                     }
//                 }
//             },
//             "fumo": { //附魔礼包
//                 type: 1, //礼包类型 升降级礼包
//                 show: 2, //触发次数限制
//                 nextcd: 1800, //同类型 消失后 触发CD
//                 cd: 14400, //消失时间
//                 dclist: { //档次列表
//                     1:{
//                         glist:{
//                             '1':{
//                                 need: [10,30], //需求
//                                 rwd: [[1,1,300],[1,62,12000],[1,902,20]], //奖励
//                                 prec: 500, //折扣
//                             },
//                             '2':{
//                                 need: [10,68], //需求
//                                 rwd: [[1,1,680],[1,62,28000],[1,902,40]], //奖励
//                                 prec: 500, //折扣
//                             },
//                             '3':{
//                                 need: [10,128], //需求
//                                 rwd: [[1,1,1280],[1,62,55000],[1,902,60]], //奖励
//                                 prec: 500, //折扣
//                             },
//                         }
//                     },
//                     2:{
//                         glist:{
//                             '4':{
//                                 need: [10,198], //需求
//                                 rwd: [[1,1,1980],[1,62,85000],[1,902,80]], //奖励
//                                 prec: 500, //折扣
//                             },
//                             '5':{
//                                 need: [10,328], //需求
//                                 rwd: [[1,1,3280],[1,62,142000],[1,902,130]], //奖励
//                                 prec: 500, //折扣
//                             },
//                             '6':{
//                                 need: [10,648], //需求
//                                 rwd: [[1,1,6480],[1,62,280000],[1,902,250]], //奖励
//                                 prec: 500, //折扣
//                             },
//                         }
//                     }
//                 }
//             },
//             "stone": { //宝石礼包
//                 type: 1, //礼包类型 升降级礼包
//                 show: 2, //触发次数限制
//                 nextcd: 1800, //同类型 消失后 触发CD
//                 cd: 14400, //消失时间
//                 dclist: { //档次列表
//                     1:{
//                         glist:{
//                             '1':{
//                                 need: [10,30], //需求
//                                 rwd: [[1,1,300],[1,59,15],[1,902,20]], //奖励
//                                 prec: 500, //折扣
//                             },
//                             '2':{
//                                 need: [10,68], //需求
//                                 rwd: [[1,1,680],[1,59,35],[1,902,40]], //奖励
//                                 prec: 500, //折扣
//                             },
//                             '3':{
//                                 need: [10,128], //需求
//                                 rwd: [[1,1,1280],[1,59,66],[1,902,60]], //奖励
//                                 prec: 500, //折扣
//                             },
//                         }
//                     },
//                     2:{
//                         glist:{
//                             '4':{
//                                 need: [10,198], //需求
//                                 rwd: [[1,1,1980],[1,59,102],[1,902,80]], //奖励
//                                 prec: 500, //折扣
//                             },
//                             '5':{
//                                 need: [10,328], //需求
//                                 rwd: [[1,1,3280],[1,59,170],[1,902,130]], //奖励
//                                 prec: 500, //折扣
//                             },
//                             '6':{
//                                 need: [10,648], //需求
//                                 rwd: [[1,1,6480],[1,59,335],[1,902,250]], //奖励
//                                 prec: 500, //折扣
//                             },
//                         }
//                     }
//                 }
//             },
//             "fazhenZh": { //灵兽召唤礼包  //每个独立一档
//                 type: 2, //礼包类型 指定档次
//                 show: 2, //触发次数限制
//                 nextcd: 0, //同类型 消失后 触发CD
//                 cd: 14400, //消失时间
//                 dclist: { //档次列表
//                     1:{
//                         type2_need: 50,//需求数量
//                         glist:{
//                             '1':{
//                                 need: [10,30], //需求
//                                 rwd: [[1,1,300],[1,54,50],[1,902,20]], //奖励
//                                 prec: 500, //折扣
//                             },
//                         }
//                     },
//                     2:{
//                         type2_need: 120,//需求数量
//                         glist:{
//                             '2':{
//                                 need: [10,68], //需求
//                                 rwd: [[1,1,680],[1,54,120],[1,902,40]], //奖励
//                                 prec: 500, //折扣
//                             },
//                         }
//                     },
//                     3:{
//                         type2_need: 170,//需求数量
//                         glist:{
//                             '3':{
//                                 need: [10,98], //需求
//                                 rwd: [[1,1,980],[1,54,170],[1,902,50]], //奖励
//                                 prec: 500, //折扣
//                             },
//                         }
//                     },
//                     4:{
//                         type2_need: 230,//需求数量
//                         glist:{
//                             '4':{
//                                 need: [10,128], //需求
//                                 rwd: [[1,1,1280],[1,54,230],[1,902,60]], //奖励
//                                 prec: 500, //折扣
//                             },
//                         }
//                     },
//                     5:{
//                         type2_need: 360,//需求数量
//                         glist:{
//                             '5':{
//                                 need: [10,198], //需求
//                                 rwd: [[1,1,1980],[1,54,360],[1,902,80]], //奖励
//                                 prec: 500, //折扣
//                             },
//                         }
//                     },
//                     6:{
//                         type2_need: 620,//需求数量
//                         glist:{
//                             '6':{
//                                 need: [10,328], //需求
//                                 rwd: [[1,1,3280],[1,54,620],[1,902,130]], //奖励
//                                 prec: 500, //折扣
//                             },
//                         }
//                     },
//                     7:{
//                         type2_need: 99999,//需求数量
//                         glist:{
//                             '7':{
//                                 need: [10,648], //需求
//                                 rwd: [[1,1,6480],[1,54,1288],[1,902,250]], //奖励
//                                 prec: 500, //折扣
//                             },
//                         }
//                     }
//                 }
//             },
//             "dinglu": { //箱子礼包  单一
//                 type: 1, //礼包类型 升降级礼包
//                 show: 1, //触发次数限制
//                 cd: 14400, //消失时间
//                 nextcd: 100000000, //同类型 消失后 触发CD (冷却时间3年)
//                 dclist: { //档次列表
//                     1:{
//                         glist:{
//                             '1':{
//                                 need: [10,68], //需求
//                                 rwd: [[1,902,600]], //奖励
//                                 prec: 500, //折扣
//                             }
//                         }
//                     }
//                 }
//             },
//             "baoshi": { //星宿升阶礼包
//                 type: 1, //礼包类型 升降级礼包
//                 show: 2, //触发次数限制
//                 nextcd: 1800, //同类型 消失后 触发CD
//                 cd: 14400, //消失时间
//                 dclist: { //档次列表
//                     1:{
//                         glist:{
//                             '1':{
//                                 need: [10,30], //需求
//                                 rwd: [[1,1,300],[1,60,600],[1,902,20]], //奖励
//                                 prec: 500, //折扣
//                             },
//                             '2':{
//                                 need: [10,68], //需求
//                                 rwd: [[1,1,680],[1,60,1400],[1,902,40]], //奖励
//                                 prec: 500, //折扣
//                             },
//                             '3':{
//                                 need: [10,128], //需求
//                                 rwd: [[1,1,1280],[1,60,2750],[1,902,60]], //奖励
//                                 prec: 500, //折扣
//                             },
//                         }
//                     },
//                     2:{
//                         glist:{
//                             '4':{
//                                 need: [10,198], //需求
//                                 rwd: [[1,1,1980],[1,60,4250],[1,902,80]], //奖励
//                                 prec: 500, //折扣
//                             },
//                             '5':{
//                                 need: [10,328], //需求
//                                 rwd: [[1,1,3280],[1,60,7100],[1,902,130]], //奖励
//                                 prec: 500, //折扣
//                             },
//                             '6':{
//                                 need: [10,648], //需求
//                                 rwd: [[1,1,6480],[1,60,14000],[1,902,250]], //奖励
//                                 prec: 500, //折扣
//                             },
//                         }
//                     }
//                 }
//             },
//         }
//     }
// }
//# sourceMappingURL=HdTimeBen2Model.js.map