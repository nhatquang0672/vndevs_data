"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HdShanheModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const game_1 = __importDefault(require("../../util/game"));
const gameMethod_1 = require("../../../common/gameMethod");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const ActItemModel_1 = require("../act/ActItemModel");
const UserModel_1 = require("../user/UserModel");
const fight_1 = require("../../../common/fight");
const tool_1 = require("../../util/tool");
/**
 * 活动 山河庆典
 */
class HdShanheModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "hd"; //数据库表名
        this.kid = "hdShanhe"; //用于存储key 和  输出1级key
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
        return this.hdcid; //输出2级key
    }
    //初始化
    init() {
        return {
            hdid: "",
            time: this.ctx.state.newTime,
            gift: {},
            sign: [],
            nowId: 1,
            start: {
                from: "",
                seed: 0,
                teams: {}
            },
            end: {
                win: 0,
                items: [],
            },
            chumo: {},
            list: {},
            leiji: {},
            baodi: 0,
            cons: 0,
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        let cfg = await this.getHdCfg();
        if (cfg != null && cfg.info.id != info.hdid) {
            info = this.init();
            info.hdid = cfg.info.id;
        }
        if (info.time < this.ctx.state.new0) {
            info.time = this.ctx.state.newTime;
            info.gift = {};
        }
        if (info.baodi == null) {
            info.baodi = 0;
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
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            return null;
        }
        let info = await this.getInfo();
        switch (key) {
            case "info":
                return cfg[key];
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
     * 获取红点
     */
    async getRed() {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime >= cfg.info.eAt) {
            return 0;
        }
        let info = await this.getInfo();
        let passDay = game_1.default.passDay(cfg.info.sAt);
        for (let index = 1; index <= passDay; index++) {
            if (cfg.data.sign[index.toString()] != null && info.sign.indexOf(index.toString()) == -1) {
                return 1;
            }
        }
        if (cfg.data.gift["1"] != null && cfg.data.gift["1"].need.length == 0 && info.gift["1"] == null) {
            return 1;
        }
        let subItemid = cfg.data.qingdian.need[1].toString();
        let actItemModel = ActItemModel_1.ActItemModel.getInstance(this.ctx, this.id);
        let actItem = await actItemModel.getInfo();
        if (actItem[subItemid] != null && actItem[subItemid] > 0) {
            return 1;
        }
        let has = 0;
        for (const _id of ["16", "26", "36", "46", "56", "66", "60", "61", "62", "63", "64", "65"]) {
            if (info.list[_id] == 1) {
                has += 1;
            }
        }
        for (const dc in cfg.data.leiji) {
            if (has < cfg.data.leiji[dc].need) {
                continue;
            }
            if (info.leiji[dc] == null) {
                return 1;
            }
        }
        return 0;
    }
    /**
     * 山河庆典领取累计大奖
     */
    async hdShLeiji(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime >= cfg.info.eAt) {
            this.ctx.throw("活动已结束");
        }
        if (cfg.data.leiji[dc] == null) {
            this.ctx.throw("参数错误");
        }
        let info = await this.getInfo();
        if (info.leiji[dc] != null) {
            this.ctx.throw("已经领取");
        }
        let has = 0;
        for (const _id of ["16", "26", "36", "46", "56", "66", "60", "61", "62", "63", "64", "65"]) {
            if (info.list[_id] == 1) {
                has += 1;
            }
        }
        if (has < cfg.data.leiji[dc].need) {
            this.ctx.throw("未满足条件");
        }
        info.leiji[dc] = this.ctx.state.newTime;
        await this.update(info, ["red", "outf"]);
        await this.ctx.state.master.addItem2(cfg.data.leiji[dc].items);
    }
    /**
     * 领取礼包
     */
    async hdShGift(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime >= cfg.info.eAt) {
            this.ctx.throw("活动已结束");
        }
        if (cfg.data.gift[dc] == null) {
            this.ctx.throw("参数错误");
        }
        let info = await this.getInfo();
        if (info.gift[dc] == null) {
            info.gift[dc] = 0;
        }
        if (info.gift[dc] >= cfg.data.gift[dc].limit) {
            this.ctx.throw("购买次数已达上限");
        }
        info.gift[dc] += 1;
        await this.update(info, ["red", "outf"]);
        if (cfg.data.gift[dc].need.length > 0) {
            await this.ctx.state.master.subItem1(cfg.data.gift[dc].need);
        }
        await this.ctx.state.master.addItem2(cfg.data.gift[dc].items);
    }
    /**
     * 签到
     */
    async hdShSign(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime >= cfg.info.eAt) {
            this.ctx.throw("活动已结束");
        }
        let info = await this.getInfo();
        let passDay = game_1.default.passDay(cfg.info.sAt);
        if (passDay < parseInt(dc)) {
            this.ctx.throw("未满足条件");
        }
        if (info.sign.indexOf(dc) != -1) {
            this.ctx.throw("已签到");
        }
        info.sign.push(dc);
        if (cfg.data.sign[dc] == null) {
            this.ctx.throw("活动配置错误");
        }
        await this.update(info, ["red", "outf"]);
        await this.ctx.state.master.addItem2(cfg.data.sign[dc].items);
    }
    /**
     * 充值下单检查
     */
    async checkUp(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动已结束");
        }
        if (cfg.data.gift[dc] == null) {
            this.ctx.throw("参数错误");
        }
        if (cfg.data.gift[dc].need[0] != 10) {
            this.ctx.throw("不是充值档次");
        }
        let info = await this.getInfo();
        if (info.gift[dc] == null) {
            info.gift[dc] = 0;
        }
        if (info.gift[dc] >= cfg.data.gift[dc].limit) {
            this.ctx.throw("无次数");
        }
        return {
            type: 1,
            msg: cfg.data.gift[dc].title,
            data: cfg.data.gift[dc].need[1],
            kind10Cs: this.kid + "_" + this.hdcid + "_" + dc + "_" + cfg.data.gift[dc].need[1]
        };
    }
    /**
     * 充值成功后执行
     */
    async carryOut(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            return {
                type: 0,
                msg: "活动已关闭",
                data: null
            };
        }
        let info = await this.getInfo();
        if (info.gift[dc] == null) {
            info.gift[dc] = 0;
        }
        info.gift[dc] += 1;
        await this.update(info, ["outf", "red"]);
        await this.ctx.state.master.addItem2(cfg.data.gift[dc].items);
        return {
            type: 1,
            msg: "充值成功",
            data: cfg.data.gift[dc].need[1]
        };
    }
    /**
     * 充值下单检查
     */
    async checkUp11(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动已结束");
        }
        if (cfg.data.gift[dc] == null) {
            this.ctx.throw("参数错误");
        }
        if (cfg.data.gift[dc].need[0] != 11) {
            this.ctx.throw("不是充值档次");
        }
        let info = await this.getInfo();
        if (info.gift[dc] == null) {
            info.gift[dc] = 0;
        }
        if (info.gift[dc] >= cfg.data.gift[dc].limit) {
            this.ctx.throw("无次数");
        }
        return {
            type: 1,
            msg: cfg.data.gift[dc].title,
            data: cfg.data.gift[dc].need[1]
        };
    }
    /**
     * 充值成功后执行
     */
    async carryOut11(dc) {
        let cfg = await this.getHdCfg();
        if (cfg == null) {
            return {
                type: 0,
                msg: "活动已关闭",
                data: null
            };
        }
        let info = await this.getInfo();
        if (info.gift[dc] == null) {
            info.gift[dc] = 0;
        }
        if (info.gift[dc] >= cfg.data.gift[dc].limit) {
            this.ctx.throw("无次数");
        }
        info.gift[dc] += 1;
        await this.update(info, ["outf", "red"]);
        await this.ctx.state.master.addItem2(cfg.data.gift[dc].items);
        return {
            type: 1,
            msg: "",
            data: null
        };
    }
    /**
     * 战斗
     */
    async fight_one() {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动已结束");
        }
        let info = await this.getInfo();
        if (cfg.data.chumo[info.nowId] == null) {
            this.ctx.throw("已通关");
            return;
        }
        let monid = cfg.data.chumo[info.nowId].monid;
        let cfgMon = gameCfg_1.default.monHdShanhe.getItem(monid.toString());
        if (cfgMon == null) {
            this.ctx.throw("怪物未生成");
            return;
        }
        let userModel = UserModel_1.UserModel.getInstance(this.ctx, this.id);
        let gStart = await userModel.getFightEps();
        info.start = {
            from: "hdShanhe",
            seed: game_1.default.rand(1, 65535),
            teams: {
                "10": {
                    fid: this.id,
                    zhanwei: 0,
                    eps: gStart.eps,
                    level: 0,
                    wxSk: gStart.wxSk,
                    isnq: gStart.isnq,
                    jgSk: gStart.jgSk //精怪技能
                },
                "20": {
                    fid: monid.toString(),
                    zhanwei: 0,
                    eps: gameMethod_1.gameMethod.ep_merge(gameMethod_1.gameMethod.ep_init(), cfgMon.eps),
                    level: 0,
                    wxSk: {},
                    isnq: 0,
                    jgSk: {} //精怪技能
                },
            }
        };
        if (gStart.xlid != "") {
            info.start.teams["11"] = {
                fid: "xl_" + gStart.xlid,
                zhanwei: gStart.xlzw,
                eps: gStart.xleps,
                level: gStart.xlLv,
                wxSk: {},
                isnq: 0,
                jgSk: {} //精怪技能
            };
        }
        //战斗
        let fight = new fight_1.Fight(info.start);
        let back = fight.get_outf();
        //记录战斗日志
        tool_1.tool.addFightTeam(this.ctx, info.start);
        info.end.win = back.win;
        info.end.items = [];
        if (info.end.win == 1) {
            if (info.chumo[info.nowId.toString()] == null) {
                info.end.items = game_1.default.addArr(info.end.items, cfg.data.chumo[info.nowId].items);
                await this.ctx.state.master.addItem2(info.end.items, "");
                info.chumo[info.nowId.toString()] = this.ctx.state.newTime;
            }
            info.nowId += 1;
        }
        await this.update(info, ['outf', 'red']);
    }
    /**
     * 抽奖
     */
    async choujiang(num) {
        let cfg = (await this.getHdCfg());
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动已结束");
        }
        let subItemid = cfg.data.qingdian.need[1].toString();
        let actItemModel = ActItemModel_1.ActItemModel.getInstance(this.ctx, this.id);
        let actItem = await actItemModel.getInfo();
        if (actItem[subItemid] != null && actItem[subItemid] > 0) {
            num = Math.min(num, actItem[subItemid]);
        }
        if (num < 1) {
            this.ctx.throw("参数错误");
        }
        let need = cfg.data.qingdian.need;
        await this.ctx.state.master.subItem1([need[0], need[1], need[2] * num]);
        let info = await this.getInfo();
        let items = [];
        let hdShanheWin = {
            items: {}
        };
        for (let index = 0; index < num; index++) {
            info.baodi += 1;
            info.cons += 1;
            let wzdc = []; //还没抽中的档次
            if (info.baodi >= cfg.data.qingdian.baodi) {
                info.baodi = 0;
                for (const _dc in cfg.data.qingdian.list) {
                    if (Math.floor(parseInt(_dc) / 10) > 5 || Math.floor(parseInt(_dc) % 10) > 5) {
                        continue;
                    }
                    if (info.list[_dc] != null) {
                        continue;
                    }
                    wzdc.push(_dc);
                }
            }
            //大奖保底
            let kk = 0;
            let has = 0;
            for (const _id of ["16", "26", "36", "46", "56", "66", "60", "61", "62", "63", "64", "65"]) {
                if (info.list[_id] == 1) {
                    has += 1;
                }
            }
            let axdc = ""; //暗箱档次
            for (const dj of cfg.data.qingdian.baodidj) {
                kk++;
                if (has >= kk) {
                    continue; //已经够大奖个数了
                }
                if (info.cons <= dj) {
                    continue; //次数还没达到
                }
                let anType = "";
                let anMax = 0;
                let anwzs = {
                    "x1": [], "x2": [],
                    "h1": [], "h2": [], "h3": [], "h4": [], "h5": [],
                    "s1": [], "s2": [], "s3": [], "s4": [], "s5": [],
                };
                //斜1
                let x1 = 0;
                for (const xx of [11, 22, 33, 44, 55]) {
                    if (info.list[xx] != null) {
                        x1 += 1;
                    }
                    else {
                        anwzs["x1"].push(xx);
                    }
                }
                if (x1 != 5 && x1 > anMax) {
                    anMax = x1;
                    anType = "x1";
                }
                //斜2
                let x2 = 0;
                for (const xx of [15, 24, 33, 42, 51]) {
                    if (info.list[xx] != null) {
                        x2 += 1;
                    }
                    else {
                        anwzs["x2"].push(xx);
                    }
                }
                if (x2 != 5 && x2 > anMax) {
                    anMax = x2;
                    anType = "x2";
                }
                //找横向有几个中的
                let geth = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
                //找竖向有几个中的
                let gets = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
                for (const dc in info.list) {
                    if (Math.floor(parseInt(dc) / 10) > 5 || Math.floor(parseInt(dc) % 10) > 5) {
                        continue;
                    }
                    let heng = Math.floor(parseInt(dc) / 10).toString();
                    geth[heng] += 1;
                    let shu = Math.floor(parseInt(dc) % 10).toString();
                    gets[shu] += 1;
                }
                for (const hh in geth) {
                    if (geth[hh] != 5 && geth[hh] > anMax) {
                        anMax = geth[hh];
                        anType = "h" + hh;
                    }
                    for (let index = 1; index <= 5; index++) {
                        let hhdc = parseInt(hh) * 10 + index;
                        if (info.list[hhdc.toString()] == null) {
                            anwzs["h" + hh].push(hhdc);
                        }
                    }
                }
                for (const ss in geth) {
                    if (geth[ss] != 5 && geth[ss] > anMax) {
                        anMax = geth[ss];
                        anType = "s" + ss;
                    }
                    for (let index = 1; index <= 5; index++) {
                        let ssdc = parseInt(ss) + 10 * index;
                        if (info.list[ssdc.toString()] == null) {
                            anwzs["s" + ss].push(ssdc);
                        }
                    }
                }
                if (anwzs[anType] != null && anwzs[anType].length > 0) {
                    axdc = game_1.default.getRandArr(anwzs[anType], 1)[0].toString();
                }
            }
            let getList = this.getGzProb(info.list, cfg.data.qingdian.list, cfg.data.qingdian.prob);
            let getdc = game_1.default.getProbRandId(0, getList, "");
            if (getdc == null) {
                this.ctx.throw("抽取失败");
            }
            if (wzdc.length > 0) {
                getdc = game_1.default.getRandArr(wzdc, 1)[0];
            }
            if (axdc != "") {
                getdc = axdc; //暗箱操作
            }
            if (info.list[getdc] == null) {
                info.baodi = 0;
            }
            info.list[getdc] = 1;
            //获取奖励
            items.push(cfg.data.qingdian.list[getdc]);
            if (hdShanheWin.items[getdc] == null) {
                hdShanheWin.items[getdc] = [];
            }
            hdShanheWin.items[getdc].push(cfg.data.qingdian.list[getdc]);
            //检测 横向 竖向   和 斜向 奖励
            for (const heng of [16, 26, 36, 46, 56]) {
                if (info.list[heng.toString()] == 1) {
                    continue;
                }
                let pass = true;
                let shi = Math.floor(heng / 10) * 10;
                for (let index = shi + 1; index <= shi + 5; index++) {
                    if (info.list[index.toString()] != 1) {
                        pass = false;
                        break;
                    }
                }
                if (pass == false) {
                    continue;
                }
                info.list[heng.toString()] = 1;
                items.push(cfg.data.qingdian.list[heng.toString()]);
                if (hdShanheWin.items[heng.toString()] == null) {
                    hdShanheWin.items[heng.toString()] = [];
                }
                hdShanheWin.items[heng.toString()].push(cfg.data.qingdian.list[heng.toString()]);
            }
            for (const shu of [61, 62, 63, 64, 65]) {
                if (info.list[shu.toString()] == 1) {
                    continue;
                }
                let pass = true;
                for (let index = 1; index <= 5; index++) {
                    let shi = Math.floor(shu % 10) + 10 * index;
                    if (info.list[shi.toString()] != 1) {
                        pass = false;
                        break;
                    }
                }
                if (pass == false) {
                    continue;
                }
                info.list[shu.toString()] = 1;
                items.push(cfg.data.qingdian.list[shu.toString()]);
                if (hdShanheWin.items[shu.toString()] == null) {
                    hdShanheWin.items[shu.toString()] = [];
                }
                hdShanheWin.items[shu.toString()].push(cfg.data.qingdian.list[shu.toString()]);
            }
            if (info.list["60"] != 1) {
                let pass = true;
                for (const hs of [15, 24, 33, 42, 51]) {
                    if (info.list[hs] != 1) {
                        pass = false;
                    }
                }
                if (pass == true) {
                    info.list["60"] = 1;
                    items.push(cfg.data.qingdian.list["60"]);
                    if (hdShanheWin.items["60"] == null) {
                        hdShanheWin.items["60"] = [];
                    }
                    hdShanheWin.items["60"].push(cfg.data.qingdian.list["60"]);
                }
            }
            if (info.list["66"] != 1) {
                let pass = true;
                for (const hs of [11, 22, 33, 44, 55]) {
                    if (info.list[hs] != 1) {
                        pass = false;
                    }
                }
                if (pass == true) {
                    info.list["66"] = 1;
                    items.push(cfg.data.qingdian.list["66"]);
                    if (hdShanheWin.items["66"] == null) {
                        hdShanheWin.items["66"] = [];
                    }
                    hdShanheWin.items["66"].push(cfg.data.qingdian.list["66"]);
                }
            }
        }
        await this.ctx.state.master.addItem2(items, "");
        await this.update(info, ['outf', 'red']);
        //弹窗
        this.ctx.state.master.addWin("hdShanhe", hdShanheWin);
    }
    /**
     * 获取各个格子的概率
     */
    getGzProb(zlist, clist, prob) {
        let getList = {};
        //找横向有几个中的
        let geth = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
        //找竖向有几个中的
        let gets = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
        for (const dc in zlist) {
            if (Math.floor(parseInt(dc) / 10) > 5 || Math.floor(parseInt(dc) % 10) > 5) {
                continue;
            }
            let heng = Math.floor(parseInt(dc) / 10).toString();
            geth[heng] += 1;
            let shu = Math.floor(parseInt(dc) % 10).toString();
            gets[shu] += 1;
        }
        for (const dc in clist) {
            if (Math.floor(parseInt(dc) / 10) > 5 || Math.floor(parseInt(dc) % 10) > 5) {
                continue;
            }
            let heng = Math.floor(parseInt(dc) / 10).toString();
            let shu = Math.floor(parseInt(dc) % 10).toString();
            if (zlist[dc] == 1) { //中的概率
                let _hprob = geth[heng] == 0 ? prob[0] : prob[geth[heng]] / geth[heng];
                let _sprob = gets[shu] == 0 ? prob[0] : prob[gets[shu]] / gets[shu];
                getList[dc] = Math.max(Math.floor(_hprob), Math.floor(_sprob));
            }
            else {
                let _hprob = geth[heng] == 0 ? prob[0] : (10000 - prob[geth[heng]]) / geth[heng];
                let _sprob = gets[shu] == 0 ? prob[0] : (10000 - prob[gets[shu]]) / gets[shu];
                getList[dc] = Math.min(Math.floor(_hprob), Math.floor(_sprob));
            }
        }
        // console.log('====getList====',JSON.stringify(getList))
        return getList;
    }
}
exports.HdShanheModel = HdShanheModel;
//# sourceMappingURL=HdShanheModel.js.map