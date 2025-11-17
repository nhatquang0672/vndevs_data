"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HdTimeBenModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const game_1 = __importDefault(require("../../util/game"));
const tool_1 = require("../../util/tool");
const gameMethod_1 = require("../../../common/gameMethod");
const setting_1 = __importDefault(require("../../crontab/setting"));
const ActTaskMainModel_1 = require("../act/ActTaskMainModel");
/**
 * 活动 限时福利 //
 * HdTimeBenModel
 */
class HdTimeBenModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdTimeBen"; //用于存储key 和  输出1级key
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
    //启动钩子 整合代码
    static async start(ctx, uuid) {
        let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
        //活动 - 累计天数充值礼包
        let cfgHdTimeBen = setting_1.default.getHuodong2(heid, "hdTimeBen");
        if (cfgHdTimeBen != null) {
            for (const hdcid in cfgHdTimeBen) {
                let hdTimeBenModel = HdTimeBenModel.getInstance(ctx, uuid, hdcid);
                await hdTimeBenModel.start();
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
            // buys: {},
            // show: {},
            // task: {},
            nowType: null,
            otime: 0,
            outTime: 0,
            newList: {},
            isOpen: 1,
            endTime: 0
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        let cfg = (await this.getHdCfg());
        if (cfg != null && cfg.info.id != info.hdid) {
            info = this.init();
            info.hdid = cfg.info.id;
        }
        if (info.isOpen == null) {
            info.isOpen = 0;
        }
        if (info.endTime == null) {
            info.endTime = this.ctx.state.newTime;
        }
        //新增字段
        if (info.newList == null) {
            info.newList = {};
        }
        //每日重置
        if (this.ctx.state.newTime > info.outTime) {
            // info.buys = {};
            // info.task = {};
            // info.show = {};
            // info.nowType: null, //当前生效礼包
            // info.otime: 0, //当前生效礼包 过期时间
            info.outTime = this.ctx.state.new0 + 86400;
            //改动逻辑
            for (const type in info.newList) {
                info.newList[type].show = 0; //每日弹出次数 清空
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
                return {
                    buys: {},
                    nowType: info.nowType,
                    otime: info.otime,
                    show: {},
                    outTime: info.outTime,
                    newList: info.newList,
                };
        }
        return null;
    }
    /**
     * 获取红点 充值活动 没有红点
     */
    async getRed() {
        return 0;
    }
    /**
     * 任务钩子 后端尝试触发礼包
     * @param type
     * @param count
     */
    // async task(type: Xys.TimeBenType, count: number): Promise<void> {
    //     //记录次数
    //     let cfg = (await this.getHdCfg()) as Xys.HdCfg<Xys.HdTimeBenData>;
    //     if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
    //         return;
    //     }
    //     if (cfg.data.task[type] == null) {
    //         this.ctx.throw(`task档次错误 ${type}`);
    //     }
    //     let info: Info = await this.getInfo();
    //     if (info.task[type] == null) {
    //         info.task[type] = 0;
    //     }
    //     info.task[type] += count;
    //     await this.update(info, ["outf", "red"]);
    //     //目标达成 尝试触发
    //     if (info.task[type] >= cfg.data.task[type].count) {
    //         await this.trip(type);
    //     }
    // }
    //尝试触发礼包 调用 / /前端触发 直接调用
    async trip(type) {
        // console.log(`尝试触发 trip ${type}`);
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            //this.ctx.throw("trip活动未生效"); //去除提示?
            return;
        }
        let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
        if (await actTaskMainModel.kaiqi('5400') <= 0) {
            //this.ctx.throw("trip活动未开启"); //去除提示?
            return; //未开启
        }
        //新版触发逻辑
        let typecfg = cfg.data.listNew[type]; //本类型礼包配置
        if (typecfg == null) {
            //this.ctx.throw(`类型错误 ${type}`);
            return;
        }
        let info = await this.getInfo();
        //礼包信息初始化
        if (info.newList[type] == null) {
            info.newList[type] = {
                dc: 1,
                otime: 0,
                show: 0,
                showTime: 0,
                buyTime: 0,
            };
        }
        //配置档次是否存在
        let dccfg = typecfg.dclist[info.newList[type].dc]; //本档次礼包配置
        if (dccfg == null) {
            //this.ctx.throw(`档次错误 ${info.newList[type].dc}`);
            return;
        }
        if (info.newList[type].otime + dccfg.nextcd > this.ctx.state.newTime) {
            //礼包生效中 或者 冷却时间还没过 不触发
            //this.ctx.throw(`礼包生效中 或者 冷却时间还没过`);
            return;
        }
        if (info.newList[type].show >= typecfg.show) {
            //今天已经触发过X次 不再触发
            //this.ctx.throw(`今天已经触发过${info.newList[type].show}次 不再触发`);
            return;
        }
        //判定完 开始触发
        //降档判定
        let bdid = game_1.default.getToDay_0(info.newList[type].buyTime); //购买日
        // let swid = game.getToDay_0(info.newList[type].showTime); //触发日
        let tdid = game_1.default.getToDay_0(); //今日
        // //购买日 <不等于> 触发日 <不等于> 今日  就降档
        // if (bdid != swid && swid != tdid) {
        //     if (info.newList[type].dc > 1) {
        //         info.newList[type].dc -= 1;
        //     }
        // }
        //购买日 <不等于> 今日  就降档
        if (bdid != tdid) {
            //降一档
            info.newList[type].dc -= 1;
            //是否有降档起点档
            if (gameMethod_1.gameMethod.isEmpty(typecfg.dwMax) != true) {
                //保底档次 //降档的话 至少降到这一档
                info.newList[type].dc = Math.min(info.newList[type].dc, typecfg.dwMax);
            }
            info.newList[type].dc = Math.max(1, info.newList[type].dc);
        }
        //触发
        info.newList[type].otime = this.ctx.state.newTime + dccfg.cd;
        info.newList[type].show += 1;
        info.newList[type].showTime = this.ctx.state.newTime;
        info.isOpen = 0;
        info.endTime = this.ctx.state.newTime;
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
        let typecfg = cfg.data.listNew[type]; //本类型礼包配置
        if (typecfg == null) {
            console.error(`类型错误 ${type}`);
            return;
        }
        //是否按档次触发类型礼包
        if (typecfg == null || typecfg.type != 2) {
            console.error(`type礼包类型错误 ${type}`);
            return;
        }
        //搜索指定档次 找不到 就用最高档次
        let chufadc = 1;
        for (let dc = 1; dc <= 100; dc++) {
            let dccfg = typecfg.dclist[dc]; //本档次礼包配置
            if (dccfg == null) {
                break;
            }
            chufadc = dc;
            if (dccfg.type2_need != null && cha < dccfg.type2_need) {
                //触发本档
                break;
            }
        }
        //触发档次是否存在
        let dccfg = typecfg.dclist[chufadc];
        if (dccfg == null) {
            console.error(`档次错误 ${chufadc}`);
            return;
        }
        let info = await this.getInfo();
        //礼包信息初始化
        if (info.newList[type] == null) {
            info.newList[type] = {
                dc: 1,
                otime: 0,
                show: 0,
                showTime: 0,
                buyTime: 0,
            };
        }
        if (info.newList[type].otime + dccfg.nextcd > this.ctx.state.newTime) {
            //礼包生效中 或者 冷却时间还没过 不触发
            tool_1.tool.clog(`trip2 礼包 冷却时间还没过 不触发`);
            return;
        }
        if (info.newList[type].show >= typecfg.show) {
            //今天已经触发过X次 不再触发
            tool_1.tool.clog(`今天已经触发过 ${typecfg.show}次 不再触发`);
            return;
        }
        //判定完 开始触发
        info.newList[type].dc = chufadc;
        info.newList[type].otime = this.ctx.state.newTime + dccfg.cd;
        info.newList[type].show += 1;
        info.newList[type].showTime = this.ctx.state.newTime;
        info.isOpen = 0;
        info.endTime = this.ctx.state.newTime;
        await this.update(info, ["outf", "red"]);
        tool_1.tool.clog(`trip2 礼包触发`);
        return;
    }
    /**
     * 充值下单检查
     * isNew : 是否新版
     */
    async checkUp(type, dc1) {
        //新版 //直接使用新版
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动未生效");
        }
        let typecfg = cfg.data.listNew[type]; //本类型礼包配置
        if (typecfg == null) {
            this.ctx.throw(`礼包类型错误 ${type}`);
        }
        let info = await this.getInfo();
        if (info.newList[type] == null) {
            this.ctx.throw("礼包未触发");
        }
        if (info.newList[type].otime < this.ctx.state.newTime) {
            this.ctx.throw("礼包已过期");
        }
        if (dc1 != null && dc1 != "" && info.newList[type].dc.toString() != dc1) {
            await this.ctx.state.master.addWin("msg", "该档次已经购买");
            await this.backData();
            return {
                type: 2,
                msg: cfg.info.title,
                data: "",
                kind10Cs: "",
            };
        }
        //档次配置
        let dccfg = typecfg.dclist[info.newList[type].dc]; //本档次礼包配置
        if (dccfg == null) {
            this.ctx.throw(`档次配置错误 ${type}`);
        }
        if (dccfg.need[0] != 10) {
            this.ctx.throw("参数错误");
        }
        return {
            type: 1,
            msg: cfg.info.title,
            data: dccfg.need[1],
            kind10Cs: this.kid + "_" + this.hdcid + "_" + type + "_" + dccfg.need[1],
        };
        //以下旧版代码 不再使用
        /*
        if (cfg.data.list[nowType] == null) {
            this.ctx.throw(`档次错误 ${nowType}`);
        }

        if (cfg.data.list[nowType].need[0] != 10) {
            this.ctx.throw("参数错误");
        }

        let info: Info = await this.getInfo();
        if (info.nowType != nowType) {
            this.ctx.throw("不是当前礼包");
        }
        if (info.otime < this.ctx.state.newTime) {
            this.ctx.throw("已过期");
        }

        return {
            type: 1,
            msg: cfg.info.title,
            data: cfg.data.list[nowType].need[1],
        };
        */
    }
    /**
     * 充值成功后执行
     */
    async carryOut(type) {
        //新版
        //直接使用新版
        //如果没有本档次 就提示 请更新
        let cfg = (await this.getHdCfg());
        if (cfg == null) {
            return {
                type: 0,
                msg: "充值失败",
                data: null,
            };
        }
        let typecfg = cfg.data.listNew[type]; //本类型礼包配置
        if (typecfg == null) {
            this.ctx.throw(`礼包类型错误 ${type}`);
        }
        let info = await this.getInfo();
        if (info.newList[type] == null) {
            this.ctx.throw("礼包未触发");
        }
        // if (info.newList[type].otime < this.ctx.state.newTime){
        //     this.ctx.throw("礼包已过期");
        // }
        //档次配置
        let dccfg = typecfg.dclist[info.newList[type].dc]; //本档次礼包配置
        //记录充值
        info.newList[type].buyTime = this.ctx.state.newTime;
        //加上奖励
        await this.ctx.state.master.addItem2(dccfg.rwd);
        //直接触发下一档
        let nextDcId = info.newList[type].dc + 1;
        // if(info.isOpen == 1){
        //     info.isOpen = 0
        //     nextDcId = 1
        // }
        if (typecfg.dclist[nextDcId] != null && typecfg.type != 2) {
            //下一档存在
            info.newList[type].dc = nextDcId;
            info.newList[type].otime = this.ctx.state.newTime + dccfg.cd;
            info.newList[type].showTime = this.ctx.state.newTime;
            // info.newList[type].show += 1; //不计算累计次数
        }
        else {
            //下一档不存在 关闭礼包
            info.newList[type].otime = this.ctx.state.newTime - 2;
        }
        await this.update(info, ["outf", "red"]);
        return {
            type: 1,
            msg: "充值成功",
            data: dccfg.need[1],
        };
    }
    /**
     * 启动活动
     */
    async start() {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            return null;
        }
        let info = await this.getInfo();
        //是否已经启动
        if (info.endTime > 0) {
            //报错 已经启动
            return;
        }
        if (cfg.data.listNew["dinglu"] == null) {
            return;
        }
        info.endTime = this.ctx.state.newTime;
        info.isOpen = 1;
        info.newList["dinglu"] = {
            "dc": 1,
            "otime": this.ctx.state.newTime + cfg.data.listNew["dinglu"].dclist[1].cd,
            "show": 1,
            "showTime": this.ctx.state.newTime,
            "buyTime": 0
        };
        await this.update(info, ["outf", "red"]);
    }
}
exports.HdTimeBenModel = HdTimeBenModel;
//# sourceMappingURL=HdTimeBenModel.js.map