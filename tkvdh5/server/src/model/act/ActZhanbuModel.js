"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActZhanbuModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const game_1 = __importDefault(require("../../util/game"));
const hook_1 = require("../../util/hook");
/**
 * 抽奖 占卜转盘
 */
class ActZhanbuModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actZhanbu"; //用于存储key 和  输出1级key
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
        return {
            free: 0,
            dayAt: this.ctx.state.newTime,
            chou: 0,
            djid: "",
            over: 0,
            djnum: 0,
            ids: {},
            nowId: "",
            nowRwd: 0 //当前奖励是否已领取 0未领取 1已领取
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        if (info.dayAt == null) {
            info.dayAt = this.ctx.state.newTime;
            info.chou = 0;
            info.djid = "";
            info.over = 0;
            info.djnum = 0;
            info.ids = {};
            info.nowId = "";
            info.nowRwd = 0;
        }
        if (info.dayAt < this.ctx.state.new0) {
            info.dayAt = this.ctx.state.newTime;
            info.chou = 0;
            info.djid = "";
            info.over = 0;
            info.ids = {};
            info.nowId = "";
        }
        if (info.free == null) {
            info.free = 0;
        }
        return info;
    }
    async getOutPut() {
        let info = await this.getInfo();
        return info;
    }
    /**
     * 占卜选大奖
     */
    async xuandajiang(djid) {
        let info = await this.getInfo();
        let cfgDj = gameCfg_1.default.zhanbuDajiang.getItemCtx(this.ctx, djid);
        if (cfgDj.limit > info.djnum) {
            this.ctx.throw("大奖未解锁");
        }
        info.djid = djid;
        await this.update(info);
    }
    /**
     * 抽奖
     * @param free 0不免费1广告
     */
    async choujiang(free) {
        let info = await this.getInfo();
        if (info.djid == "") {
            this.ctx.throw("请先选一个大奖");
        }
        // if(info.over == 1){
        //     this.ctx.throw("明日再来吧");
        // }
        info.chou += 1;
        info.nowRwd = 0;
        info.nowId = "";
        let cfgPay = gameCfg_1.default.zhanbuPay.getItem(info.chou.toString());
        if (cfgPay == null) {
            this.ctx.throw("明日再来吧!");
        }
        if (free == 0 || info.chou > 3) {
            if (info.free > 0) {
                info.free -= 1;
            }
            else {
                await this.ctx.state.master.subItem1(cfgPay.need);
            }
        }
        let isZhong = 0; //是否中大奖
        if (info.over == 0 && game_1.default.rand(1, 10000) <= cfgPay.prob) {
            isZhong = 1;
        }
        if (isZhong == 1) {
            info.over = 1;
            info.djnum += 1;
            info.nowId = "1";
            info.ids["1"] = this.ctx.state.newTime;
            let cfgRwd = gameCfg_1.default.zhanbuRwd.getItemCtx(this.ctx, "1");
            if (cfgRwd.kind10 != 1) {
                info.nowRwd = 1;
                let cfgDj = gameCfg_1.default.zhanbuDajiang.getItemCtx(this.ctx, info.djid);
                await this.ctx.state.master.addItem2([cfgDj.item], "zbitems");
            }
        }
        else {
            let list = [];
            let cfgpool = gameCfg_1.default.zhanbuRwd.pool;
            for (const key in cfgpool) {
                if (cfgpool[key].prob0 <= 0) {
                    continue;
                }
                if (info.chou < cfgpool[key].limit) {
                    continue;
                }
                if (info.ids[cfgpool[key].id] != null) {
                    continue;
                }
                list.push(cfgpool[key]);
            }
            let cItem = game_1.default.getProbRandItem(0, list, "prob0");
            if (cItem == null) {
                this.ctx.throw("无奖励可抽取!");
            }
            info.ids[cItem.id] = this.ctx.state.newTime;
            info.nowId = cItem.id;
            if (cItem.kind10 != 1) { //直接获得
                info.nowRwd = 1;
                await this.ctx.state.master.addItem2([cItem.item], "zbitems");
            }
        }
        await this.update(info);
        await hook_1.hookNote(this.ctx, "zhanbuNum", 1);
    }
    /**
     * 领取奖励
     * @param count 奖励倍数
     */
    async rwd(count) {
        let info = await this.getInfo();
        if (info.nowRwd == 1) {
            this.ctx.throw("已经领取");
        }
        if (info.nowId == "1") {
            let cfgDj = gameCfg_1.default.zhanbuDajiang.getItemCtx(this.ctx, info.djid);
            await this.ctx.state.master.addItem2([[cfgDj.item[0], cfgDj.item[1], cfgDj.item[2] * count]], "zbitems");
        }
        else {
            let cfgRwd = gameCfg_1.default.zhanbuRwd.getItemCtx(this.ctx, info.nowId);
            await this.ctx.state.master.addItem2([[cfgRwd.item[0], cfgRwd.item[1], cfgRwd.item[2] * count]], "zbitems");
        }
        info.nowRwd = 1;
        await this.update(info);
    }
    /**
     * 广告下单检查
     */
    async checkUp() {
        let info = await this.getInfo();
        if (info.djid == "") {
            this.ctx.throw("请先选一个大奖");
        }
        // if(info.over == 1){
        //     this.ctx.throw("明日再来吧");
        // }
        if (info.chou > 3) {
            this.ctx.throw("每天前三次才能看广告抽奖");
        }
        return {
            type: 1,
            msg: "",
            data: null
        };
    }
    /**
     * 广告成功后执行
     */
    async carryOut() {
        await this.choujiang(1);
        return {
            type: 1,
            msg: "",
            data: null,
        };
    }
    /**
     * 广告下单检查
     */
    async checkUp1() {
        let info = await this.getInfo();
        let cfgRwd = gameCfg_1.default.zhanbuRwd.getItem(info.nowId);
        if (cfgRwd == null || cfgRwd.kind10 != 1) {
            return {
                type: 0,
                msg: "参数错误",
                data: null
            };
        }
        return {
            type: 1,
            msg: "运势奖励翻倍获取",
            data: null
        };
    }
    /**
     * 广告成功后执行
     */
    async carryOut1() {
        await this.rwd(2);
        return {
            type: 1,
            msg: "运势奖励翻倍获取",
            data: null,
        };
    }
}
exports.ActZhanbuModel = ActZhanbuModel;
//# sourceMappingURL=ActZhanbuModel.js.map