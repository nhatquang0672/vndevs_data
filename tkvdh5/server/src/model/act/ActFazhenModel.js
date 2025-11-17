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
exports.ActFazhenModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const Xys_1 = require("../../../common/Xys");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const game_1 = __importDefault(require("../../util/game"));
const gameMethod_1 = require("../../../common/gameMethod");
const hook_1 = require("../../util/hook");
const HdPriCardModel_1 = require("../hd/HdPriCardModel");
const ActDingYueModel_1 = require("./ActDingYueModel");
const Xys = __importStar(require("../../../common/Xys"));
const tool_1 = require("../../util/tool");
const ActItemModel_1 = require("./ActItemModel");
const setting_1 = __importDefault(require("../../crontab/setting"));
const HdTimeBenModel_1 = require("../hd/HdTimeBenModel");
const HdQiYuanModel_1 = require("../hd/HdQiYuanModel");
const HdXinMoModel_1 = require("../hd/HdXinMoModel");
const MailModel_1 = require("../user/MailModel");
const HdTimeBen2Model_1 = require("../hd/HdTimeBen2Model");
const ActDaoyouModel_1 = require("./ActDaoyouModel");
/**
 * 法阵
 */
class ActFazhenModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actFazhen"; //用于存储key 和  输出1级key
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
        let cfgZfList = gameCfg_1.default.fazhenInfo.pool;
        let cqlist = [];
        for (const key in cfgZfList) {
            if ([2, 3, 4].indexOf(cfgZfList[key].pinzhi) != -1) {
                cqlist.push([cfgZfList[key].id, cfgZfList[key].gjProb]);
            }
        }
        let cqId = "1";
        let _item = game_1.default.getProbByItems(cqlist, 0, 1);
        if (_item != null) {
            cqId = _item[0];
        }
        return {
            time: this.ctx.state.newTime,
            isInit: 0,
            pt: 0,
            ptBaodi: 0,
            pttqBaodi: 0,
            gj: 0,
            gjBaodi: 0,
            cqId: cqId,
            cqType: 0,
            list: {
                //已经解锁的称号列表
                "1": { fzid: "", saveId: 0, otherEps: {}, zaddp: 0, faddp: 0, sk: {}, pinzhi: 0, lsSkid: ["", 0], lsfz: { fzid: "", sk: {}, saveId: 0, pinzhi: 0, skpx: [] }, star: 0, xietong: "", skpx: [] },
                "2": { fzid: "", saveId: 0, otherEps: {}, zaddp: 0, faddp: 0, sk: {}, pinzhi: 0, lsSkid: ["", 0], lsfz: { fzid: "", sk: {}, saveId: 0, pinzhi: 0, skpx: [] }, star: 0, xietong: "", skpx: [] },
                "3": { fzid: "", saveId: 0, otherEps: {}, zaddp: 0, faddp: 0, sk: {}, pinzhi: 0, lsSkid: ["", 0], lsfz: { fzid: "", sk: {}, saveId: 0, pinzhi: 0, skpx: [] }, star: 0, xietong: "", skpx: [] },
                "4": { fzid: "", saveId: 0, otherEps: {}, zaddp: 0, faddp: 0, sk: {}, pinzhi: 0, lsSkid: ["", 0], lsfz: { fzid: "", sk: {}, saveId: 0, pinzhi: 0, skpx: [] }, star: 0, xietong: "", skpx: [] },
                "5": { fzid: "", saveId: 0, otherEps: {}, zaddp: 0, faddp: 0, sk: {}, pinzhi: 0, lsSkid: ["", 0], lsfz: { fzid: "", sk: {}, saveId: 0, pinzhi: 0, skpx: [] }, star: 0, xietong: "", skpx: [] },
            },
            useGzId: "",
            //炼金
            shouyiList: [],
            shouyiAt: this.ctx.state.newTime,
            shouyiNum: 0,
            bugVer: 4,
            bugVer1: 2,
            //兽灵大改版
            gbver: 11,
            cqIds: { "1": 0, "2": 0, "3": 0 },
            kind11: 0,
            kind11At: 0,
            gjBd: 0,
            jiban: {},
            //2023.09.13 
            mubiao: "",
            mbNum: {},
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        let isUpdate = false;
        if (info.bugVer != 4) {
            info.bugVer = 4;
            // info.cqType = 0;
            for (const _gzId in info.list) {
                if (info.list[_gzId].star == null) {
                    info.list[_gzId].star = 0;
                }
                for (const _skillId in info.list[_gzId].sk) {
                    if (info.list[_gzId].sk[_skillId].lock == null) {
                        info.list[_gzId].sk[_skillId].lock = 0;
                    }
                }
            }
            info.mubiao = "";
            info.mbNum = {};
            isUpdate = true;
        }
        if (info.bugVer1 != 2) {
            info.bugVer1 = 2;
            for (const _gzId in info.list) {
                if (info.list[_gzId].xietong == null) {
                    info.list[_gzId].xietong = "";
                }
                if (info.list[_gzId].xietong != "") {
                    let _xietong = info.list[_gzId].xietong;
                    if (info.list[_xietong] != null && info.list[_xietong].fzid == "") {
                        info.list[_gzId].xietong = "";
                    }
                }
                isUpdate = true;
            }
        }
        if (info.gbver != 11) {
            info.gbver = 11;
            info.cqIds = {};
            info.kind11 = 0;
            info.kind11At = 0;
            info.gjBd = 0;
            info.jiban = {};
            if (info.cqId != "" && info.cqType == 0 && ["2", "3"].indexOf(info.cqId) == -1) {
                info.cqIds[info.cqId] = info.cqType;
            }
            else {
                info.cqIds["1"] = 0;
            }
            info.cqIds["2"] = 0;
            info.cqIds["3"] = 0;
            //补属性
            for (const gzId in info.list) {
                if (info.list[gzId].fzid == "") {
                    continue;
                }
                let _cfgS = gameCfg_1.default.fazhenStep.getItem(info.list[gzId].fzid);
                if (_cfgS == null) {
                    continue;
                }
                for (const okey in info.list[gzId].otherEps) {
                    //如果是主属性
                    let isz = false;
                    for (const _zeps of _cfgS.zeps) {
                        if (okey == _zeps[0]) {
                            isz = true;
                        }
                    }
                    if (isz == true) {
                        info.list[gzId].otherEps[okey] = Math.floor(info.list[gzId].otherEps[okey] * _cfgS.czhu / 10000);
                    }
                    else {
                        info.list[gzId].otherEps[okey] = Math.floor(info.list[gzId].otherEps[okey] * _cfgS.cf / 10000);
                    }
                }
                isUpdate = true;
            }
            //补技能
            for (const gzId in info.list) {
                info.list[gzId].sk = {};
                info.list[gzId].pinzhi = 0;
                info.list[gzId].lsSkid = ["", 0];
                info.list[gzId].lsfz = {
                    fzid: "",
                    saveId: 0,
                    pinzhi: 0,
                    sk: {},
                    skpx: []
                };
                if (info.list[gzId].fzid == "") {
                    continue;
                }
                if (info.jiban[info.list[gzId].fzid] == null) {
                    info.jiban[info.list[gzId].fzid] = 1;
                }
                let cfginfo = gameCfg_1.default.fazhenInfo.getItemCtx(this.ctx, info.list[gzId].fzid);
                info.list[gzId].pinzhi = cfginfo.pinzhi;
                let cfgpz = gameCfg_1.default.fazhenPinzhi.getItemCtx(this.ctx, cfginfo.pinzhi.toString());
                //获取一个主动技能
                info.list[gzId].sk[cfginfo.zdId] = { lv: 1, lock: 0 };
                //获取N个被动技能
                for (let index = 0; index < cfgpz.bdMax; index++) {
                    let cfgItem = game_1.default.getProbByItems(cfgpz.prob, 0, 1);
                    if (cfgItem == null) {
                        continue;
                    }
                    let cfgList = gameCfg_1.default.fazhenSkillList.getItemListCtx(this.ctx, cfgItem[0]);
                    let listPool = [];
                    for (const _item of cfgList) {
                        if (info.list[gzId].sk[_item.id] != null) {
                            continue;
                        }
                        listPool.push(_item);
                    }
                    let cfgLItem = game_1.default.getProbRandItem(0, listPool, "prob");
                    if (cfgLItem == null) {
                        continue;
                    }
                    info.list[gzId].sk[cfgLItem.id] = { lv: 1, lock: 0 };
                }
            }
            isUpdate = true;
        }
        if (info.time < this.ctx.state.new0) {
            info.time = this.ctx.state.newTime;
            info.pt = 0;
            info.gj = 0;
            info.kind11 = 0;
            info.kind11At = 0;
        }
        let cfgMath = gameCfg_1.default.mathInfo.getItemCtx(this.ctx, "zhenfa_free");
        if (cfgMath.pram.count1 == null) {
            this.ctx.throw("配置错误Math_zhenfa_free");
        }
        else {
            //收益池上限
            if (info.shouyiNum >= cfgMath.pram.count1) {
                info.shouyiAt = this.ctx.state.newTime;
            }
            else {
                let hourAll = 0; //每小时收益 （1分钟计算一次）
                //月卡 终身卡
                let hdPriCardModel = HdPriCardModel_1.HdPriCardModel.getInstance(this.ctx, this.id, Xys_1.PriCardType.fever);
                let haveFev = await hdPriCardModel.isHave(); //终生卡状态
                let kong = true;
                for (const gzId of info.shouyiList) {
                    if (info.list[gzId].fzid == "") {
                        continue;
                    }
                    let cfg = gameCfg_1.default.fazhenInfo.getItemCtx(this.ctx, info.list[gzId].fzid);
                    hourAll += cfg.shouyi;
                    //如果有终生卡 收益+2 (每只+3)
                    if (haveFev) {
                        hourAll += 3;
                    }
                    kong = false;
                }
                if (hourAll > 0) {
                    let fenzhong = Math.floor((this.ctx.state.newTime - info.shouyiAt) / 60);
                    info.shouyiAt += fenzhong * 60;
                    info.shouyiNum += parseFloat(((hourAll * fenzhong) / 60).toFixed(2));
                }
                if (kong) {
                    info.shouyiAt = this.ctx.state.newTime;
                }
            }
            info.shouyiNum = Math.min(info.shouyiNum, cfgMath.pram.count1);
        }
        if (info.shouyiList.length > 3) {
            //月卡 终身卡 加格子 这边写
            let hdPriCardModel = HdPriCardModel_1.HdPriCardModel.getInstance(this.ctx, this.id, Xys_1.PriCardType.fever);
            let hdmoon = await hdPriCardModel.getInfo();
            if (hdmoon.btime >= 0 && hdmoon.btime <= this.ctx.state.newTime) {
                info.shouyiList.splice(3, 1);
                isUpdate = true;
            }
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
     * 初始法阵选择
     */
    async xuanzhe(fzId) {
        let info = await this.getInfo();
        if (info.isInit == 1) {
            this.ctx.throw("已经选择");
        }
        info.isInit = 1;
        let gzid = "";
        for (const _gzId in info.list) {
            if (info.list[_gzId].fzid == "") {
                gzid = _gzId;
                break;
            }
        }
        if (gzid == "") {
            let mailModel = MailModel_1.MailModel.getInstance(this.ctx, this.id);
            await mailModel.sendMail("兽灵激活", `您激活兽灵时选择的兽灵已发送，请及时查收`, [[2, parseInt(fzId), 1]]);
            this.ctx.state.master.addWin("msg", "兽灵栏位已满，请前往邮件领取");
            info.useGzId = "1";
        }
        else {
            let cfgInfo = gameCfg_1.default.fazhenInfo.getItemCtx(this.ctx, fzId);
            info.list[gzid] = {
                fzid: fzId,
                saveId: 1,
                otherEps: {},
                zaddp: 0,
                faddp: 0,
                sk: this.getsks(fzId),
                pinzhi: cfgInfo.pinzhi,
                lsSkid: ["", 0],
                lsfz: {
                    fzid: "",
                    saveId: 0,
                    pinzhi: 0,
                    sk: {},
                    skpx: []
                },
                star: 0,
                xietong: "",
                skpx: []
            };
            info.useGzId = gzid;
            if (info.jiban[fzId] == null) {
                info.jiban[fzId] = 1;
            }
            //获得灵兽时弹窗
            await this.ctx.state.master.addWin("fazhenGz", gzid);
        }
        await this.update(info);
    }
    /**
     * 获取位置
     */
    async jiesuo() {
        let info = await this.getInfo();
        let cfgMath = gameCfg_1.default.mathInfo.getItemCtx(this.ctx, "zhenfa_max");
        if (cfgMath.pram.count == null) {
            this.ctx.throw("配置错误Math_zhenfa_max");
            return;
        }
        let has = Object.keys(info.list).length;
        if (has >= cfgMath.pram.count) {
            this.ctx.throw("灵兽槽位数量已达上限");
        }
        let need = gameCfg_1.default.fazhenLock.getItemCtx(this.ctx, (has + 1).toString()).need;
        if (need.length > 0) {
            await this.ctx.state.master.subItem1(need);
        }
        info.list[(has + 1).toString()] = {
            fzid: "",
            saveId: 0,
            otherEps: {},
            zaddp: 0,
            faddp: 0,
            sk: {},
            pinzhi: 0,
            lsSkid: ["", 0],
            lsfz: {
                fzid: "",
                saveId: 0,
                pinzhi: 0,
                sk: {},
                skpx: []
            },
            star: 0,
            xietong: "",
            skpx: []
        };
        await this.update(info);
    }
    /**
     * 高级抽取
     */
    async gjChouqu() {
        let cfgMath = gameCfg_1.default.mathInfo.getItemCtx(this.ctx, "zhenfa_gj");
        if (cfgMath.pram.items == null || cfgMath.pram.item == null || cfgMath.pram.count == null || cfgMath.pram.count1 == null) {
            this.ctx.throw("配置错误Math_zhenfa_gj");
            return;
        }
        let cfgMath_baodi = gameCfg_1.default.mathInfo.getItemCtx(this.ctx, "zhenfa_gj_baodi");
        if (cfgMath_baodi.pram.count == null || cfgMath_baodi.pram.count1 == null) {
            this.ctx.throw("配置错误Math_zhenfa_gj_baodi");
            return;
        }
        let info = await this.getInfo();
        if (info.gj >= cfgMath.pram.count) {
            this.ctx.throw("今日已达次数上限");
        }
        info.gj += 1;
        info.gjBaodi += 1;
        let probItem = game_1.default.getProbByItems(cfgMath.pram.items, 0, 1);
        if (probItem == null) {
            this.ctx.throw("获取灵兽品质失败");
            return;
        }
        let pinzhi = probItem[0];
        if (info.gjBaodi >= cfgMath_baodi.pram.count) {
            pinzhi = cfgMath_baodi.pram.count1;
        }
        let tqbaodi = 0;
        let hdPriCardModel = HdPriCardModel_1.HdPriCardModel.getInstance(this.ctx, this.id, Xys_1.PriCardType.fever);
        let isHave = await hdPriCardModel.isHave();
        if (isHave == true) {
            tqbaodi = tool_1.tool.mathcfg_count(this.ctx, "zhenfa_tq_baodi");
            info.pttqBaodi += 1;
        }
        if (tqbaodi > 0 && info.pttqBaodi >= tqbaodi) {
            pinzhi = 7;
        }
        if (pinzhi >= 7) {
            info.gjBaodi = 0;
            info.pttqBaodi = 0;
        }
        let cfgZfList = gameCfg_1.default.fazhenInfoList.getItemListCtx(this.ctx, pinzhi.toString());
        let itemId = game_1.default.getProbRandId(0, cfgZfList, "gjProb");
        if (itemId == null) {
            this.ctx.throw("获取灵兽失败");
            return;
        }
        if (info.gj > cfgMath.pram.count1) {
            await this.ctx.state.master.subItem1(cfgMath.pram.item);
        }
        info.cqId = cfgZfList[itemId].id;
        info.cqType = 0;
        await this.update(info);
        //触发礼包
        await this.timeBenClick();
        await hook_1.hookNote(this.ctx, "fazhenChou", 1);
    }
    /**
     * 普通抽取
     */
    async ptChouqu() {
        let cfgMath = gameCfg_1.default.mathInfo.getItemCtx(this.ctx, "zhenfa_pt");
        if (cfgMath.pram.items == null || cfgMath.pram.item == null || cfgMath.pram.count == null || cfgMath.pram.count1 == null) {
            this.ctx.throw("配置错误Math_zhenfa_pt");
            return;
        }
        let cfgMath_baodi = gameCfg_1.default.mathInfo.getItemCtx(this.ctx, "zhenfa_pt_baodi");
        if (cfgMath_baodi.pram.count == null || cfgMath_baodi.pram.count1 == null) {
            this.ctx.throw("配置错误Math_zhenfa_pt_baodi");
            return;
        }
        let info = await this.getInfo();
        if (info.pt >= cfgMath.pram.count) {
            this.ctx.throw("今日已达次数上限");
        }
        info.pt += 1;
        info.ptBaodi += 1;
        if (info.pttqBaodi == null) {
            info.pttqBaodi = 0;
        }
        let probItem = game_1.default.getProbByItems(cfgMath.pram.items, 0, 1);
        if (probItem == null) {
            this.ctx.throw("获取灵兽品质失败");
            return;
        }
        let pinzhi = probItem[0];
        //特权保底
        let tqbaodi = 0;
        let hdPriCardModel = HdPriCardModel_1.HdPriCardModel.getInstance(this.ctx, this.id, Xys_1.PriCardType.fever);
        let isHave = await hdPriCardModel.isHave();
        if (isHave == true) {
            tqbaodi = tool_1.tool.mathcfg_count(this.ctx, "zhenfa_tq_baodi");
            info.pttqBaodi += 1;
        }
        if (tqbaodi > 0 && info.pttqBaodi >= tqbaodi) {
            pinzhi = 7;
        }
        else {
            if (info.ptBaodi >= cfgMath_baodi.pram.count) {
                pinzhi = cfgMath_baodi.pram.count1;
                info.ptBaodi = 0;
            }
        }
        if (pinzhi >= 7) {
            info.pttqBaodi = 0;
            info.gjBaodi = 0;
        }
        let cfgZfList = gameCfg_1.default.fazhenInfoList.getItemListCtx(this.ctx, pinzhi.toString());
        let itemId = game_1.default.getProbRandId(0, cfgZfList, "ptProb");
        if (itemId == null) {
            this.ctx.throw("获取灵兽失败");
            return;
        }
        if (info.pt > cfgMath.pram.count1) {
            await this.ctx.state.master.subItem1(cfgMath.pram.item);
        }
        info.cqId = cfgZfList[itemId].id;
        info.cqType = 0;
        await this.update(info);
        //触发礼包
        await this.timeBenClick();
        await hook_1.hookNote(this.ctx, "fazhenChou", 1);
    }
    /**
     * 检查召唤触发礼包
     */
    async timeBenClick() {
        // tool.clog(`timeBenClick `);
        let info = await this.getInfo();
        // if (info.cqId == "") {
        //     tool.clog(`timeBenClick _false 1`);
        //     return;
        // }
        for (const cqId in info.cqIds) {
            let fazhenCfg = gameCfg_1.default.fazhenInfo.getItemCtx(this.ctx, cqId);
            if (fazhenCfg.pinzhi < 4) {
                continue;
            }
            let need = gameCfg_1.default.fazhenInfo.getItemCtx(this.ctx, cqId).need;
            let actItem = ActItemModel_1.ActItemModel.getInstance(this.ctx, this.id, "1");
            let cha = need[2] - (await actItem.getCount(need[1]));
            if (cha <= 0) {
                continue;
            }
            let heid = await this.getHeIdByUuid(this.id);
            //触发礼包
            let cfgHdTimeBen = setting_1.default.getHuodong2(heid, "hdTimeBen");
            if (cfgHdTimeBen != null) {
                for (const hdcid in cfgHdTimeBen) {
                    let hdTimeBenModel = HdTimeBenModel_1.HdTimeBenModel.getInstance(this.ctx, this.id, hdcid);
                    await hdTimeBenModel.trip2(Xys_1.TimeBenType.fazhenZh, cha);
                }
            }
            //触发礼包改版
            let cfgHdTimeBen2 = setting_1.default.getHuodong2(heid, "hdTimeBen2");
            if (cfgHdTimeBen2 != null) {
                for (const hdcid in cfgHdTimeBen2) {
                    let hdTimeBen2Model = HdTimeBen2Model_1.HdTimeBen2Model.getInstance(this.ctx, this.id, hdcid);
                    await hdTimeBen2Model.trip2(Xys.TimeBen2Type.fazhenZh, cha);
                }
            }
            return;
        }
    }
    /**
     * 召唤法阵
     */
    async zhaohuan() {
        let info = await this.getInfo();
        if (info.cqId == "") {
            this.ctx.throw("请先抽取灵兽");
        }
        let gzid = "";
        for (const gzId in info.list) {
            if (info.list[gzId].fzid == "") {
                gzid = gzId;
                break;
            }
        }
        if (gzid == "") {
            this.ctx.throw("暂无空闲槽位，请先解锁");
        }
        let cfgInfo = gameCfg_1.default.fazhenInfo.getItemCtx(this.ctx, info.cqId);
        await this.ctx.state.master.subItem1(cfgInfo.need);
        info.list[gzid] = {
            fzid: info.cqId,
            saveId: 1,
            otherEps: {},
            zaddp: 0,
            faddp: 0,
            sk: this.getsks(info.cqId),
            pinzhi: cfgInfo.pinzhi,
            lsSkid: ["", 0],
            lsfz: {
                fzid: "",
                saveId: 0,
                pinzhi: 0,
                sk: {},
                skpx: []
            },
            star: 0,
            xietong: "",
            skpx: []
        };
        info.cqType = 1;
        if (info.jiban[info.cqId] == null) {
            info.jiban[info.cqId] = 1;
        }
        await this.update(info);
        //获得灵兽时弹窗
        await this.ctx.state.master.addWin("fazhenGz", gzid);
    }
    /**
     * 添加法阵
     */
    async addFazhen(fzId) {
        let info = await this.getInfo();
        let gzid = "";
        for (const _gzId in info.list) {
            if (info.list[_gzId].fzid == "") {
                gzid = _gzId;
                break;
            }
        }
        if (gzid == "") {
            this.ctx.throw("暂无空闲槽位，请先解锁");
        }
        let cfgInfo = gameCfg_1.default.fazhenInfo.getItemCtx(this.ctx, fzId);
        info.list[gzid] = {
            fzid: fzId,
            saveId: 1,
            otherEps: {},
            zaddp: 0,
            faddp: 0,
            sk: this.getsks(fzId),
            pinzhi: cfgInfo.pinzhi,
            lsSkid: ["", 0],
            lsfz: {
                fzid: "",
                saveId: 0,
                pinzhi: 0,
                sk: {},
                skpx: []
            },
            star: 0,
            xietong: "",
            skpx: []
        };
        if (info.jiban[fzId] == null) {
            info.jiban[fzId] = 1;
        }
        await this.update(info);
        //获得灵兽时弹窗
        await this.ctx.state.master.addWin("fazhenGz", gzid);
        this.ctx.state.master.addLog(2, fzId, 1, 1);
    }
    /**
     * 升级升阶
     */
    async upLevel(gzId, type) {
        let info = await this.getInfo();
        if (info.list[gzId] == null || info.list[gzId].fzid == "") {
            this.ctx.throw("参数错误");
        }
        let cfgLvNext = gameCfg_1.default.fazhenLevel.getItem(info.list[gzId].fzid, (info.list[gzId].saveId + 1).toString());
        if (cfgLvNext == null) {
            this.ctx.throw("已满级");
            return;
        }
        let cfgPz = gameCfg_1.default.fazhenPinzhi.getItemCtx(this.ctx, info.list[gzId].pinzhi.toString());
        if (info.list[gzId].saveId >= cfgPz.maxStep) {
            this.ctx.throw("品质等级不足");
            return;
        }
        let cfgLv = gameCfg_1.default.fazhenLevel.getItemCtx(this.ctx, info.list[gzId].fzid, info.list[gzId].saveId.toString());
        if (gameMethod_1.gameMethod.isEmpty(cfgLv.need) == false) {
            await this.ctx.state.master.subItem1(cfgLv.need);
        }
        info.list[gzId].saveId += 1;
        //有没有额外属性
        if (cfgLv.chufa == 1) {
            let cfgStep = gameCfg_1.default.fazhenStep.getItem(info.list[gzId].fzid);
            if (cfgStep != null) {
                let zprob = cfgStep.zprob + info.list[gzId].zaddp;
                let fprob = cfgStep.fprob + info.list[gzId].faddp;
                let max = zprob + fprob;
                if (type == 2 || game_1.default.rand(1, max) <= zprob) {
                    if (type == 2) { // 指定消耗道具
                        await this.ctx.state.master.subItem1(cfgLv.xsgNeed);
                    }
                    //抽到主
                    //属性偏移
                    info.list[gzId].zaddp += cfgStep.cprob[0];
                    info.list[gzId].faddp += cfgStep.cprob[1];
                    let _item = game_1.default.getProbByItems(cfgStep.zeps, 0, 2);
                    if (_item != null) {
                        if (info.list[gzId].otherEps[_item[0]] == null) {
                            info.list[gzId].otherEps[_item[0]] = 0;
                        }
                        info.list[gzId].otherEps[_item[0]] += _item[1];
                        await this.ctx.state.master.addWin("fzUpRank", {
                            isz: 0,
                            key: _item[0],
                            num: _item[1],
                        });
                    }
                }
                else {
                    //抽到副
                    let _item = game_1.default.getProbByItems(cfgStep.feps, 0, 2);
                    if (_item != null) {
                        if (info.list[gzId].otherEps[_item[0]] == null) {
                            info.list[gzId].otherEps[_item[0]] = 0;
                        }
                        info.list[gzId].otherEps[_item[0]] += _item[1];
                        await this.ctx.state.master.addWin("fzUpRank", {
                            isz: 1,
                            key: _item[0],
                            num: _item[1],
                        });
                    }
                }
            }
        }
        await this.update(info);
        if (cfgLvNext.showLv != cfgLv.showLv) {
            await hook_1.hookNote(this.ctx, "fazhenUpLv", 1);
        }
    }
    /**
     * 法阵自爆
     */
    async zibao(gzId) {
        let info = await this.getInfo();
        if (info.list[gzId] == null || info.list[gzId].fzid == "") {
            this.ctx.throw("参数错误");
        }
        if (gzId == info.useGzId) {
            this.ctx.throw("穿戴中不能自爆");
        }
        if (info.shouyiList.indexOf(gzId) != -1) {
            this.ctx.throw("炼金中不能自爆");
        }
        let cfgMath = gameCfg_1.default.mathInfo.getItemCtx(this.ctx, "zhenfa_zibao");
        if (cfgMath.pram.count == null) {
            this.ctx.throw("配置错误Math_zhenfa_zibao");
            return;
        }
        //灵兽起源 活动 自爆前结算奖励
        await HdQiYuanModel_1.HdQiYuanModel.jiesuan(this.ctx, this.id);
        let fsList = [];
        fsList.push({
            fzid: info.list[gzId].fzid,
            pinzhi: info.list[gzId].pinzhi,
            saveId: info.list[gzId].saveId,
        });
        info.list[gzId] = {
            fzid: "",
            saveId: 0,
            otherEps: {},
            zaddp: 0,
            faddp: 0,
            sk: {},
            pinzhi: 0,
            lsSkid: ["", 0],
            lsfz: {
                fzid: "",
                saveId: 0,
                pinzhi: 0,
                sk: {},
                skpx: []
            },
            star: 0,
            xietong: "",
            skpx: []
        };
        await this.update(info);
        //放生返还
        await this.fangsheng(fsList);
        //灵兽起源 活动 下掉XX
        await HdQiYuanModel_1.HdQiYuanModel.zibao(this.ctx, this.id, [gzId]);
        //破除心魔 去除使用
        await HdXinMoModel_1.HdXinMoModel.zibao(this.ctx, this.id, [gzId]);
        await this.checkXietong();
    }
    /**
     * 法阵上阵
     */
    async shangzhen(gzId) {
        let info = await this.getInfo();
        if (info.list[gzId] == null || info.list[gzId].fzid == "") {
            this.ctx.throw("参数错误");
        }
        info.useGzId = gzId;
        await this.update(info);
        await hook_1.hookNote(this.ctx, "fzchuzhan", 1);
    }
    /**
     * 炼金上阵
     */
    async lianjinShang(gzId) {
        let info = await this.getInfo();
        let cfgMath = gameCfg_1.default.mathInfo.getItemCtx(this.ctx, "zhenfa_free");
        if (cfgMath.pram.count == null) {
            this.ctx.throw("配置错误Math_zhenfa_free");
            return;
        }
        let maxGz = cfgMath.pram.count; //最多存放格子数量
        //月卡 终身卡 加格子 这边写
        let hdPriCardModel = HdPriCardModel_1.HdPriCardModel.getInstance(this.ctx, this.id, Xys_1.PriCardType.fever);
        let hdmoon = await hdPriCardModel.getInfo();
        if (hdmoon.btime < 0 || hdmoon.btime > this.ctx.state.newTime) {
            maxGz += 1;
        }
        if (info.shouyiList.length >= maxGz) {
            this.ctx.throw("炼金格子已达上限");
        }
        if (info.list[gzId] == null || info.list[gzId].fzid == "") {
            this.ctx.throw("参数错误");
        }
        if (info.shouyiList.indexOf(gzId) != -1) {
            this.ctx.throw("已上阵");
        }
        info.shouyiList.push(gzId);
        await this.update(info);
        //推送
        let hourAll = 0; //每小时收益 （1分钟计算一次）
        for (const _gzId of info.shouyiList) {
            let cfg = gameCfg_1.default.fazhenInfo.getItemCtx(this.ctx, info.list[_gzId].fzid);
            hourAll += cfg.shouyi;
        }
        if (cfgMath.pram.count1 != null && hourAll > 0) {
            let at = Math.ceil(((cfgMath.pram.count1 - info.shouyiNum) / hourAll) * 3600);
            //兽灵炼魂提醒
            let actDingYueModel = ActDingYueModel_1.ActDingYueModel.getInstance(this.ctx, this.id);
            await actDingYueModel.saveDy("10", this.ctx.state.newTime + at, []);
        }
    }
    /**
     * 炼金下阵
     */
    async lianjinXia(gzId) {
        let info = await this.getInfo();
        if (info.list[gzId] == null || info.list[gzId].fzid == "") {
            this.ctx.throw("参数错误");
        }
        if (info.shouyiList.indexOf(gzId) == -1) {
            this.ctx.throw("已下阵");
        }
        info.shouyiList.splice(info.shouyiList.indexOf(gzId), 1);
        await this.update(info);
        //推送
        let hourAll = 0; //每小时收益 （1分钟计算一次）
        for (const _gzId of info.shouyiList) {
            let cfg = gameCfg_1.default.fazhenInfo.getItemCtx(this.ctx, info.list[_gzId].fzid);
            hourAll += cfg.shouyi;
        }
        let cfgMath = gameCfg_1.default.mathInfo.getItemCtx(this.ctx, "zhenfa_free");
        if (cfgMath.pram.count1 != null && hourAll > 0) {
            let at = Math.ceil(((cfgMath.pram.count1 - info.shouyiNum) / hourAll) * 3600);
            //兽灵炼魂提醒
            let actDingYueModel = ActDingYueModel_1.ActDingYueModel.getInstance(this.ctx, this.id);
            await actDingYueModel.saveDy("10", this.ctx.state.newTime + at, []);
        }
    }
    /**
     * 炼金产出领取
     */
    async lianjinRwd() {
        let info = await this.getInfo();
        if (info.shouyiNum < 1) {
            this.ctx.throw("炼魂尚未完成，无法领取");
        }
        let rwdCount = Math.floor(info.shouyiNum); //收益数量
        await this.ctx.state.master.addItem1([1, 55, rwdCount]);
        info.shouyiNum -= rwdCount;
        await this.update(info);
        //推送
        let hourAll = 0; //每小时收益 （1分钟计算一次）
        for (const _gzId of info.shouyiList) {
            let cfg = gameCfg_1.default.fazhenInfo.getItemCtx(this.ctx, info.list[_gzId].fzid);
            hourAll += cfg.shouyi;
        }
        let cfgMath = gameCfg_1.default.mathInfo.getItemCtx(this.ctx, "zhenfa_free");
        if (cfgMath.pram.count1 != null && hourAll > 0) {
            let at = Math.ceil(((cfgMath.pram.count1 - info.shouyiNum) / hourAll) * 3600);
            //兽灵炼魂提醒
            let actDingYueModel = ActDingYueModel_1.ActDingYueModel.getInstance(this.ctx, this.id);
            await actDingYueModel.saveDy("10", this.ctx.state.newTime + at, []);
        }
        await hook_1.hookNote(this.ctx, "fazhenLianJin", 1);
    }
    //按照格子 获取兽灵配置ID
    async getFzidByGzId(gzId) {
        let info = await this.getInfo();
        if (info.list[gzId] == null || info.list[gzId].fzid == "") {
            return null;
        }
        return info.list[gzId].fzid;
    }
    //按照格子 获取兽灵
    async getFzByGzId(gzId) {
        let info = await this.getInfo();
        if (info.list[gzId] == null || info.list[gzId].fzid == "") {
            return null;
        }
        return info.list[gzId];
    }
    /**
     * 高级抽取 （灵兽大改版）
     * type 1金币抽2灵石抽3广告灵石抽4广告抽取
     */
    async chouquNew(type) {
        let cfgMathItems = tool_1.tool.mathcfg_items(this.ctx, "lingshou_gj");
        let cfgBdCount = tool_1.tool.mathcfg_count(this.ctx, "lingshou_baodi");
        let cfgBdItem = tool_1.tool.mathcfg_item(this.ctx, "lingshou_baodi");
        let info = await this.getInfo();
        switch (type) {
            case 1:
                let cqitem = tool_1.tool.mathcfg_item(this.ctx, "lingshou_chou");
                await this.ctx.state.master.subItem1(cqitem);
                break;
            case 2:
                let count1 = tool_1.tool.mathcfg_count1(this.ctx, "lingshou_chou");
                await this.ctx.state.master.subItem1([1, 1, count1]);
                break;
            case 3:
                let kcount = tool_1.tool.mathcfg_count(this.ctx, "lingshou_chou_kind11");
                if (info.kind11 >= kcount) {
                    this.ctx.throw("无广告次数");
                }
                let kcount1 = tool_1.tool.mathcfg_count1(this.ctx, "lingshou_chou_kind11");
                if (info.kind11At + kcount1 >= this.ctx.state.newTime) {
                    this.ctx.throw("广告冷却中");
                }
                let item = tool_1.tool.mathcfg_item(this.ctx, "lingshou_chou_kind11");
                await this.ctx.state.master.subItem1(item);
                info.kind11 += 1;
                info.kind11At = this.ctx.state.newTime;
                break;
            case 4:
                info.kind11 += 1;
                info.kind11At = this.ctx.state.newTime;
                break;
            default:
                this.ctx.throw("类型错误");
        }
        info.gjBaodi += 1;
        let hdPriCardModel = HdPriCardModel_1.HdPriCardModel.getInstance(this.ctx, this.id, Xys_1.PriCardType.fever);
        let isHave = await hdPriCardModel.isHave();
        //清空列表
        info.cqIds = {};
        let isBaidi = false; //是否已经触发保底
        let kk = 0; //预防死循环
        let pzProb = gameMethod_1.gameMethod.objCopy(cfgMathItems);
        while (Object.keys(info.cqIds).length < 3 && kk < 20) {
            kk++;
            //获取灵兽品质
            let probItem = game_1.default.getProbByItems(pzProb, 0, 1);
            if (probItem == null) {
                continue;
            }
            let pinzhi = probItem[0];
            if (isBaidi == false) {
                let iscf = false;
                if (isHave == true) {
                    info.pttqBaodi += 1;
                    let tqcount = tool_1.tool.mathcfg_count(this.ctx, "zhenfa_tq_baodi");
                    if (info.pttqBaodi >= tqcount) {
                        let tqcount1 = tool_1.tool.mathcfg_count1(this.ctx, "zhenfa_tq_baodi");
                        pinzhi = tqcount1;
                        info.pttqBaodi = 0;
                        iscf = true;
                        isBaidi = true;
                    }
                }
                if (pinzhi != info.gjBd) {
                    if (pinzhi == cfgBdItem[0]) {
                        info.gjBd = cfgBdItem[0];
                        info.gjBaodi = 0;
                        isBaidi = true;
                    }
                    if (pinzhi == cfgBdItem[1]) {
                        info.gjBd = 0;
                        info.gjBaodi = 0;
                        isBaidi = true;
                    }
                }
                //普通抽
                if (iscf == false) {
                    if (info.gjBaodi >= cfgBdCount) {
                        if (info.gjBd == cfgBdItem[0]) {
                            pinzhi = cfgBdItem[1];
                            info.gjBaodi = 0;
                            info.gjBd = 0;
                            isBaidi = true;
                        }
                        else {
                            info.gjBaodi = 0;
                            let _rid = game_1.default.rand(0, 1);
                            if (_rid == 1) {
                                info.gjBd = 0;
                                pinzhi = cfgBdItem[1];
                                isBaidi = true;
                            }
                            else {
                                info.gjBd = cfgBdItem[0];
                                pinzhi = cfgBdItem[0];
                                isBaidi = true;
                            }
                        }
                    }
                }
            }
            let cfgZfList = gameCfg_1.default.fazhenInfoList.getItemListCtx(this.ctx, pinzhi.toString());
            let listProb = [];
            for (const cfgfz of cfgZfList) {
                if (info.cqIds[cfgfz.id] != null) {
                    continue;
                }
                listProb.push(cfgfz);
            }
            let itemId = game_1.default.getProbRandId(0, listProb, "gjProb");
            if (itemId == null) {
                continue;
            }
            let cqId = listProb[itemId].id;
            let kv = tool_1.tool.mathcfg_kv(this.ctx, "zhenfa_mubiao");
            if (kv[pinzhi.toString()] != null) {
                if (info.mbNum[pinzhi.toString()] == null) {
                    info.mbNum[pinzhi.toString()] = 0;
                }
                let cfgMbInfo = gameCfg_1.default.fazhenInfo.getItem(info.mubiao);
                if (cfgMbInfo != null && cfgMbInfo.pinzhi == pinzhi) {
                    info.mbNum[pinzhi.toString()] += 1;
                    if (info.mbNum[pinzhi.toString()] >= kv[pinzhi.toString()]) {
                        cqId = info.mubiao;
                        info.mbNum[pinzhi.toString()] = 0;
                        if (pinzhi != info.gjBd) {
                            if (pinzhi == cfgBdItem[0]) {
                                info.gjBd = cfgBdItem[0];
                                info.gjBaodi = 0;
                                isBaidi = true;
                            }
                            if (pinzhi == cfgBdItem[1]) {
                                info.gjBd = 0;
                                info.gjBaodi = 0;
                                isBaidi = true;
                            }
                        }
                    }
                }
            }
            info.cqIds[cqId] = 0;
            if (pinzhi >= 4) { //高品质只能抽取1只
                pzProb = [];
                for (const _item of cfgMathItems) {
                    if (_item[0] >= 4) {
                        continue;
                    }
                    pzProb.push(_item);
                }
            }
            if (cqId == info.mubiao) {
                info.mbNum[pinzhi.toString()] = 0;
                if (pinzhi != info.gjBd) {
                    if (pinzhi == cfgBdItem[0]) {
                        info.gjBd = cfgBdItem[0];
                        info.gjBaodi = 0;
                        isBaidi = true;
                    }
                    if (pinzhi == cfgBdItem[1]) {
                        info.gjBd = 0;
                        info.gjBaodi = 0;
                        isBaidi = true;
                    }
                }
            }
        }
        if (Object.keys(info.cqIds).length < 3) {
            this.ctx.throw("抽取不足3个");
        }
        await this.update(info);
        //触发礼包
        await this.timeBenClick();
        await hook_1.hookNote(this.ctx, "fazhenChou", 1);
    }
    /**
     * 广告下单检查
     */
    async checkUp() {
        let info = await this.getInfo();
        let kcount = tool_1.tool.mathcfg_count(this.ctx, "lingshou_chou_kind11");
        if (info.kind11 >= kcount) {
            this.ctx.throw("无广告次数");
        }
        let kcount1 = tool_1.tool.mathcfg_count1(this.ctx, "lingshou_chou_kind11");
        if (info.kind11At + kcount1 >= this.ctx.state.newTime) {
            this.ctx.throw("广告冷却中");
        }
        return {
            type: 1,
            msg: "新版灵兽广告",
            data: null,
        };
    }
    /**
     * 看广告拉次数
     */
    async carryOut() {
        let info = await this.getInfo();
        let kcount = tool_1.tool.mathcfg_count(this.ctx, "lingshou_chou_kind11");
        if (info.kind11 >= kcount) {
            this.ctx.throw("无广告次数");
        }
        let kcount1 = tool_1.tool.mathcfg_count1(this.ctx, "lingshou_chou_kind11");
        if (info.kind11At + kcount1 >= this.ctx.state.newTime) {
            this.ctx.throw("广告冷却中");
        }
        await this.chouquNew(4);
        return {
            type: 1,
            msg: "",
            data: null,
        };
    }
    /**
     * 大改版捕捉
     */
    async buzhuo(fzId) {
        let info = await this.getInfo();
        if (info.cqIds[fzId] == null || info.cqIds[fzId] != 0) {
            this.ctx.throw("参数错误");
        }
        let gzid = "";
        for (const gzId in info.list) {
            if (info.list[gzId].fzid == "") {
                gzid = gzId;
                break;
            }
        }
        if (gzid == "") {
            this.ctx.throw("暂无空闲槽位，请先解锁");
        }
        let cfgInfo = gameCfg_1.default.fazhenInfo.getItemCtx(this.ctx, fzId);
        await this.ctx.state.master.subItem1(cfgInfo.need);
        info.list[gzid] = {
            fzid: fzId,
            saveId: 1,
            otherEps: {},
            zaddp: 0,
            faddp: 0,
            sk: this.getsks(fzId),
            pinzhi: cfgInfo.pinzhi,
            lsSkid: ["", 0],
            lsfz: {
                fzid: "",
                saveId: 0,
                pinzhi: 0,
                sk: {},
                skpx: []
            },
            star: 0,
            xietong: "",
            skpx: []
        };
        info.cqIds[fzId] = 1;
        if (info.jiban[fzId] == null) {
            info.jiban[fzId] = 1;
        }
        await this.update(info);
        //获得灵兽时弹窗
        await this.ctx.state.master.addWin("fazhenGz", gzid);
        await hook_1.hookNote(this.ctx, "fazhenZhao", 1);
    }
    /**
     * 获取灵兽技能
     * @param fzId 灵兽ID
     */
    getsks(fzId) {
        let sk = {};
        let cfginfo = gameCfg_1.default.fazhenInfo.getItemCtx(this.ctx, fzId);
        let cfgpz = gameCfg_1.default.fazhenPinzhi.getItemCtx(this.ctx, cfginfo.pinzhi.toString());
        let hasKey = [];
        //获取一个主动技能
        sk[cfginfo.zdId] = { lv: 1, lock: 0 };
        //获取N个被动技能
        for (let index = 0; index < cfgpz.bdMax; index++) {
            let cfgItem = game_1.default.getProbByItems(cfgpz.prob, 0, 1);
            if (cfgItem == null) {
                continue;
            }
            let cfgList = gameCfg_1.default.fazhenSkillList.getItemListCtx(this.ctx, cfgItem[0]);
            let listPool = [];
            for (const _item of cfgList) {
                if (sk[_item.id] != null) {
                    continue;
                }
                let pass = true;
                let cs3 = gameCfg_1.default.fazhenSkillLv.getItemCtx(this.ctx, _item.id, "1").cs;
                for (const key3 in cs3) {
                    if (hasKey.indexOf(key3) != -1) {
                        pass = false;
                    }
                }
                if (pass == false) {
                    continue;
                }
                listPool.push(_item);
            }
            let cfgLItem = game_1.default.getProbRandItem(0, listPool, "prob");
            if (cfgLItem == null) {
                continue;
            }
            sk[cfgLItem.id] = { lv: 1, lock: 0 };
            let cs4 = gameCfg_1.default.fazhenSkillLv.getItemCtx(this.ctx, cfgLItem.id, "1").cs;
            for (const key3 in cs4) {
                hasKey.push(key3);
            }
        }
        return sk;
    }
    /**
     * 大改版升品质
     */
    async upPinZhi(gzIds) {
        if (gzIds.length <= 1) {
            this.ctx.throw("参数错误");
        }
        let info = await this.getInfo();
        if (gzIds[0] == null || info.list[gzIds[0]] == null || info.list[gzIds[0]].fzid == "") {
            this.ctx.throw("参数错误!");
        }
        let cfgLvNext = gameCfg_1.default.fazhenLevel.getItemCtx(this.ctx, info.list[gzIds[0]].fzid, (info.list[gzIds[0]].saveId + 1).toString());
        if (cfgLvNext == null) {
            this.ctx.throw("已满级");
            return;
        }
        let pinzhi0 = info.list[gzIds[0]].pinzhi;
        let cfgPz = gameCfg_1.default.fazhenPinzhi.getItemCtx(this.ctx, pinzhi0.toString());
        if (info.list[gzIds[0]].saveId < cfgPz.maxStep) {
            this.ctx.throw("未达到满级");
            return;
        }
        //灵兽起源 活动 升阶前结算奖励
        await HdQiYuanModel_1.HdQiYuanModel.jiesuan(this.ctx, this.id);
        let zbgzs = []; //消耗的格子ID
        let fsList = [];
        for (let index = 1; index <= cfgPz.need[1]; index++) {
            if (gzIds[index] == null) {
                this.ctx.throw("参数错误" + index);
            }
            if (info.list[gzIds[index]] == null || info.list[gzIds[index]].fzid == "") {
                this.ctx.throw("参数错误!!");
            }
            if (info.list[gzIds[index]].pinzhi != cfgPz.need[0]) {
                this.ctx.throw("参数品质错误" + info.list[gzIds[index]].pinzhi);
            }
            if (gzIds[index] == info.useGzId) {
                this.ctx.throw("出战中,不能当材料");
            }
            //炼金中 下下来
            if (info.shouyiList.indexOf(gzIds[index]) != -1) {
                info.shouyiList.splice(info.shouyiList.indexOf(gzIds[index]), 1);
            }
            zbgzs.push(gzIds[index]);
            fsList.push({
                fzid: info.list[gzIds[index]].fzid,
                pinzhi: info.list[gzIds[index]].pinzhi,
                saveId: info.list[gzIds[index]].saveId,
            });
            info.list[gzIds[index]] = {
                fzid: "",
                saveId: 0,
                otherEps: {},
                zaddp: 0,
                faddp: 0,
                sk: {},
                pinzhi: 0,
                lsSkid: ["", 0],
                lsfz: {
                    fzid: "",
                    saveId: 0,
                    pinzhi: 0,
                    sk: {},
                    skpx: []
                },
                star: 0,
                xietong: "",
                skpx: []
            };
        }
        info.list[gzIds[0]].pinzhi = cfgPz.nextid;
        let cfgpz = gameCfg_1.default.fazhenPinzhi.getItemCtx(this.ctx, info.list[gzIds[0]].pinzhi.toString());
        //升品获取被动技能
        if (gameMethod_1.gameMethod.isEmpty(info.list[gzIds[0]].skpx) == true) {
            info.list[gzIds[0]].skpx = Object.keys(info.list[gzIds[0]].sk);
        }
        let skLeng = Object.keys(info.list[gzIds[0]].sk).length - 1;
        for (let index = skLeng + 1; index <= cfgpz.bdMax; index++) {
            //获取N个被动技能
            let cfgItem = game_1.default.getProbByItems(cfgpz.prob, 0, 1);
            if (cfgItem == null) {
                continue;
            }
            let cfgList = gameCfg_1.default.fazhenSkillList.getItemListCtx(this.ctx, cfgItem[0]);
            let listPool = [];
            for (const _item of cfgList) {
                if (info.list[gzIds[0]].sk[_item.id] != null) {
                    continue;
                }
                listPool.push(_item);
            }
            let cfgLItem = game_1.default.getProbRandItem(0, listPool, "prob");
            if (cfgLItem == null) {
                continue;
            }
            info.list[gzIds[0]].sk[cfgLItem.id] = { lv: 1, lock: 0 };
            info.list[gzIds[0]].skpx.push(cfgLItem.id);
        }
        await this.update(info);
        await this.fangsheng(fsList);
        //灵兽起源 活动 下掉XX
        await HdQiYuanModel_1.HdQiYuanModel.zibao(this.ctx, this.id, zbgzs);
        //破除心魔 去除使用
        await HdXinMoModel_1.HdXinMoModel.zibao(this.ctx, this.id, zbgzs);
        await this.checkXietong();
    }
    /**
     * 大改版吞噬
     */
    async gjtunshi(cs) {
        if (cs.length != 4) {
            this.ctx.throw("参数错误");
        }
        let info = await this.getInfo();
        if (info.list[cs[0]] == null || info.list[cs[0]].fzid == "") {
            this.ctx.throw("参数错误!");
        }
        if (info.list[cs[0]].lsSkid[0] != "") {
            this.ctx.throw("未处理临时技能!");
        }
        if (Object.keys(info.list[cs[0]].sk).length < 5) {
            this.ctx.throw("兽灵满5个技能时，开启融合");
        }
        if (Object.keys(info.list[cs[2]].sk).length < 5) {
            this.ctx.throw("兽灵需要满5个技能才能参与融合");
        }
        let mathItem = tool_1.tool.mathcfg_item(this.ctx, "zhenfa_gjtunshi");
        await this.ctx.state.master.subItem1(mathItem);
        //灵兽起源 活动 吞噬前结算奖励
        await HdQiYuanModel_1.HdQiYuanModel.jiesuan(this.ctx, this.id);
        let zbgzs = []; //消耗的格子ID
        let fsList = [];
        if (info.list[cs[2]] == null || info.list[cs[2]].fzid == "") {
            this.ctx.throw("参数错误!!");
        }
        if (info.list[cs[2]].pinzhi > info.list[cs[0]].pinzhi) {
            this.ctx.throw("融合需要消耗【品质】及以下品质的兽灵");
        }
        if (cs[2] == info.useGzId) {
            this.ctx.throw("出战中,不能当材料");
        }
        //炼金中 下下来
        if (info.shouyiList.indexOf(cs[2]) != -1) {
            info.shouyiList.splice(info.shouyiList.indexOf(cs[2]), 1);
        }
        if (info.list[cs[0]].sk[cs[1]] == null) {
            this.ctx.throw("主体技能参数错误");
        }
        if (info.list[cs[2]].sk[cs[3]] == null) {
            this.ctx.throw("材料技能参数错误");
        }
        zbgzs.push(cs[2]);
        fsList.push(gameMethod_1.gameMethod.objCopy(info.list[cs[2]]));
        let sKey = [];
        if (parseInt(cs[1]) >= 1000) {
            let cs0 = gameCfg_1.default.fazhenSkillLv.getItemCtx(this.ctx, cs[1], info.list[cs[0]].sk[cs[1]].lv.toString()).cs;
            for (const key0 in cs0) {
                sKey.push(key0);
            }
        }
        if (gameMethod_1.gameMethod.isEmpty(info.list[cs[0]].skpx) == true) {
            info.list[cs[0]].skpx = Object.keys(info.list[cs[0]].sk);
        }
        let xbid = info.list[cs[0]].skpx.indexOf(cs[1]);
        delete info.list[cs[0]].sk[cs[1]];
        if (info.list[cs[0]].sk[cs[3]] != null) {
            this.ctx.throw("相同品质技能无法共存，仅能替换");
        }
        let hasKey = [];
        for (const _skid1 in info.list[cs[0]].sk) {
            if (parseInt(_skid1) < 1000) {
                continue;
            }
            let cs1 = gameCfg_1.default.fazhenSkillLv.getItemCtx(this.ctx, _skid1, info.list[cs[0]].sk[_skid1].lv.toString()).cs;
            for (const key1 in cs1) {
                hasKey.push(key1);
            }
        }
        let cs2 = gameCfg_1.default.fazhenSkillLv.getItemCtx(this.ctx, cs[3], info.list[cs[2]].sk[cs[3]].lv.toString()).cs;
        for (const key2 in cs2) {
            if (sKey.indexOf(key2) != -1) {
                continue;
            }
            if (hasKey.indexOf(key2) != -1) {
                this.ctx.throw("相同类型技能无法共存，仅能替换");
            }
        }
        info.list[cs[0]].sk[cs[3]] = {
            lv: info.list[cs[2]].sk[cs[3]].lv,
            lock: 0
        };
        info.list[cs[0]].skpx[xbid] = cs[3];
        await this.fangsheng([{
                fzid: info.list[cs[2]].fzid,
                pinzhi: info.list[cs[2]].pinzhi,
                saveId: info.list[cs[2]].saveId,
            }]);
        info.list[cs[2]] = {
            fzid: "",
            saveId: 0,
            otherEps: {},
            zaddp: 0,
            faddp: 0,
            sk: {},
            pinzhi: 0,
            lsSkid: ["", 0],
            lsfz: {
                fzid: "",
                saveId: 0,
                pinzhi: 0,
                sk: {},
                skpx: []
            },
            star: 0,
            xietong: "",
            skpx: []
        };
        await this.update(info);
        await hook_1.hookNote(this.ctx, "fztushi", 1);
        //灵兽起源 活动 下掉XX
        await HdQiYuanModel_1.HdQiYuanModel.zibao(this.ctx, this.id, zbgzs);
        //破除心魔 去除使用
        await HdXinMoModel_1.HdXinMoModel.zibao(this.ctx, this.id, zbgzs);
        await this.checkXietong();
    }
    /**
     * 大改版吞噬
     */
    async tunshi(gzIds) {
        if (gzIds.length <= 1) {
            this.ctx.throw("参数错误");
        }
        let info = await this.getInfo();
        if (gzIds[0] == null || info.list[gzIds[0]] == null || info.list[gzIds[0]].fzid == "") {
            this.ctx.throw("参数错误!");
        }
        if (gzIds[1] == null || info.list[gzIds[1]] == null || info.list[gzIds[1]].fzid == "") {
            this.ctx.throw("参数错误!");
        }
        if (info.list[gzIds[0]].lsSkid[0] != "") {
            this.ctx.throw("未处理临时技能!");
        }
        if (Object.keys(info.list[gzIds[0]].sk).length < 5) {
            this.ctx.throw("兽灵满5个技能时，开启融合");
        }
        if (Object.keys(info.list[gzIds[1]].sk).length < 5) {
            this.ctx.throw("兽灵需要满5个技能才能参与融合");
        }
        if (gzIds[1] == info.useGzId) {
            this.ctx.throw("出战中,不能当材料");
        }
        //灵兽起源 活动 吞噬前结算奖励
        await HdQiYuanModel_1.HdQiYuanModel.jiesuan(this.ctx, this.id);
        let zbgzs = []; //消耗的格子ID
        //抽取临时技能   [技能ID，等级，权重]
        let skids = [];
        for (const skillId in info.list[gzIds[1]].sk) {
            //过滤我满级的技能
            if (info.list[gzIds[0]].sk[skillId] != null) {
                let maxLv = 1;
                let cfgSkList = gameCfg_1.default.fazhenSkillLvList.getItemListCtx(this.ctx, info.list[gzIds[0]].fzid);
                for (const cfgSk of cfgSkList) {
                    maxLv = Math.max(maxLv, cfgSk.level);
                }
                if (info.list[gzIds[1]].sk[skillId].lv >= maxLv) {
                    continue;
                }
            }
            let prob1 = gameCfg_1.default.fazhenSkill.getItemCtx(this.ctx, skillId).prob1;
            skids.push([skillId, info.list[gzIds[1]].sk[skillId].lv, prob1]);
        }
        if (skids.length <= 0) {
            this.ctx.throw("读取技能失败!!");
        }
        let _item = game_1.default.getProbByItems(skids, 0, 2);
        if (_item == null) {
            this.ctx.throw("抽取技能失败!!");
        }
        //炼金中 下下来
        if (info.shouyiList.indexOf(gzIds[1]) != -1) {
            info.shouyiList.splice(info.shouyiList.indexOf(gzIds[1]), 1);
        }
        info.list[gzIds[0]].lsSkid = [_item[0], _item[1]];
        info.list[gzIds[0]].lsfz = {
            fzid: info.list[gzIds[1]].fzid,
            saveId: info.list[gzIds[1]].saveId,
            pinzhi: info.list[gzIds[1]].pinzhi,
            sk: info.list[gzIds[1]].sk,
            skpx: info.list[gzIds[1]].skpx
        };
        zbgzs.push(gzIds[1]);
        // fsList.push(gameMethod.objCopy(info.list[gzIds[1]]))
        info.list[gzIds[1]] = {
            fzid: "",
            saveId: 0,
            otherEps: {},
            zaddp: 0,
            faddp: 0,
            sk: {},
            pinzhi: 0,
            lsSkid: ["", 0],
            lsfz: {
                fzid: "",
                saveId: 0,
                pinzhi: 0,
                sk: {},
                skpx: []
            },
            star: 0,
            xietong: "",
            skpx: []
        };
        await this.update(info);
        // await this.fangsheng(fsList)
        await hook_1.hookNote(this.ctx, "fztushi", 1);
        //灵兽起源 活动 下掉XX
        await HdQiYuanModel_1.HdQiYuanModel.zibao(this.ctx, this.id, zbgzs);
        //破除心魔 去除使用
        await HdXinMoModel_1.HdXinMoModel.zibao(this.ctx, this.id, zbgzs);
        await this.checkXietong();
    }
    /**
     * 更换技能
     */
    async genghuan(gzId, skillId) {
        let info = await this.getInfo();
        if (info.list[gzId] == null || info.list[gzId].fzid == "" || info.list[gzId].sk[skillId] == null) {
            this.ctx.throw("参数错误");
        }
        if (info.list[gzId].lsSkid[0] == "") {
            this.ctx.throw("无临时技能");
        }
        let sKey = [];
        if (parseInt(skillId) >= 1000) {
            let cs0 = gameCfg_1.default.fazhenSkillLv.getItemCtx(this.ctx, skillId, info.list[gzId].sk[skillId].lv.toString()).cs;
            for (const key0 in cs0) {
                sKey.push(key0);
            }
        }
        if (gameMethod_1.gameMethod.isEmpty(info.list[gzId].skpx) == true) {
            info.list[gzId].skpx = Object.keys(info.list[gzId].sk);
        }
        let xbid = info.list[gzId].skpx.indexOf(skillId);
        delete info.list[gzId].sk[skillId];
        if (info.list[gzId].sk[info.list[gzId].lsSkid[0]] != null) {
            this.ctx.throw("相同品质技能无法共存，仅能替换");
        }
        let hasKey = [];
        for (const _skid1 in info.list[gzId].sk) {
            if (parseInt(_skid1) < 1000) {
                continue;
            }
            let cs1 = gameCfg_1.default.fazhenSkillLv.getItemCtx(this.ctx, _skid1, info.list[gzId].sk[_skid1].lv.toString()).cs;
            for (const key1 in cs1) {
                hasKey.push(key1);
            }
        }
        let cs2 = gameCfg_1.default.fazhenSkillLv.getItemCtx(this.ctx, info.list[gzId].lsSkid[0], info.list[gzId].lsSkid[1].toString()).cs;
        for (const key2 in cs2) {
            if (sKey.indexOf(key2) != -1) {
                continue;
            }
            if (hasKey.indexOf(key2) != -1) {
                this.ctx.throw("相同类型技能无法共存，仅能替换");
            }
        }
        info.list[gzId].sk[info.list[gzId].lsSkid[0]] = {
            lv: info.list[gzId].lsSkid[1],
            lock: 0
        };
        info.list[gzId].skpx[xbid] = info.list[gzId].lsSkid[0];
        await this.fangsheng([{
                fzid: info.list[gzId].lsfz.fzid,
                pinzhi: info.list[gzId].lsfz.pinzhi,
                saveId: info.list[gzId].lsfz.saveId,
            }]);
        info.list[gzId].lsSkid = ["", 0];
        info.list[gzId].lsfz = {
            fzid: "",
            saveId: 0,
            pinzhi: 0,
            sk: {},
            skpx: []
        };
        await this.update(info);
    }
    /**
     * 放弃技能
     */
    async fangqi(gzId) {
        let info = await this.getInfo();
        if (info.list[gzId] == null || info.list[gzId].fzid == "") {
            this.ctx.throw("参数错误");
        }
        if (info.list[gzId].lsSkid[0] == "") {
            this.ctx.throw("无临时技能");
        }
        await this.fangsheng([{
                fzid: info.list[gzId].lsfz.fzid,
                pinzhi: info.list[gzId].lsfz.pinzhi,
                saveId: info.list[gzId].lsfz.saveId,
            }]);
        info.list[gzId].lsSkid = ["", 0];
        info.list[gzId].lsfz = {
            fzid: "",
            saveId: 0,
            pinzhi: 0,
            sk: {},
            skpx: []
        };
        await this.update(info);
    }
    /**
     * 删除羁绊红点
     */
    async delRed(fzId) {
        let info = await this.getInfo();
        if (info.jiban[fzId] == null) {
            return;
        }
        info.jiban[fzId] = 0;
        await this.update(info);
    }
    /**
     * 删除羁绊红点
     */
    async delRedAll() {
        let isUpdate = false;
        let info = await this.getInfo();
        for (const fzId in info.jiban) {
            if (info.jiban[fzId] == 1) {
                isUpdate = true;
                info.jiban[fzId] = 0;
            }
        }
        if (isUpdate) {
            await this.update(info);
        }
    }
    /**
     * 重生
     */
    async chongsheng(gzId) {
        let info = await this.getInfo();
        if (info.list[gzId] == null || info.list[gzId].fzid == "") {
            this.ctx.throw("参数错误");
        }
        let items = [];
        let count = tool_1.tool.mathcfg_count(this.ctx, "lingshou_lv_chongsheng");
        //等级返还
        for (let index = 1; index < info.list[gzId].saveId; index++) {
            let cfgLv = gameCfg_1.default.fazhenLevel.getItemCtx(this.ctx, info.list[gzId].fzid, index.toString());
            if (cfgLv.need.length <= 0) {
                continue;
            }
            let lcount = Math.floor(cfgLv.need[2] * count / 100);
            if (lcount > 0) {
                items.push([cfgLv.need[0], cfgLv.need[1], lcount]);
            }
        }
        if (items.length > 0) {
            await this.ctx.state.master.addItem2(gameMethod_1.gameMethod.mergeArr(items));
        }
        info.list[gzId].saveId = 1;
        info.list[gzId].otherEps = {};
        info.list[gzId].zaddp = 0;
        info.list[gzId].faddp = 0;
        info.list[gzId].lsSkid = ["", 0];
        info.list[gzId].lsfz = { fzid: "", sk: {}, saveId: 0, pinzhi: 0, skpx: [] };
        await this.update(info);
    }
    /**
     * 放生返还道具
     * @param fsList
     */
    async fangsheng(fsList) {
        let items = [];
        let count = tool_1.tool.mathcfg_count(this.ctx, "lingshou_lv_bucang");
        for (const fs of fsList) {
            let cfgPz = gameCfg_1.default.fazhenPinzhi.getItemCtx(this.ctx, fs.pinzhi.toString());
            //品质返还
            items = game_1.default.addArr(items, cfgPz.items);
            //等级返还
            for (let index = 1; index < fs.saveId; index++) {
                let cfgLv = gameCfg_1.default.fazhenLevel.getItemCtx(this.ctx, fs.fzid, index.toString());
                if (cfgLv.need.length <= 0) {
                    continue;
                }
                let lcount = Math.floor(cfgLv.need[2] * count / 100);
                if (lcount > 0) {
                    items.push([cfgLv.need[0], cfgLv.need[1], lcount]);
                }
            }
        }
        //道友额外返还血脉精华
        let actDaoyouModel = ActDaoyouModel_1.ActDaoyouModel.getInstance(this.ctx, this.id);
        let rate = await actDaoyouModel.getDaoYouSkill("6");
        if (rate) {
            let ewjl = 0;
            for (let item of items) {
                let r = Math.floor(item[2] * rate);
                item[2] += r;
                ewjl += r;
            }
            if (ewjl) {
                this.ctx.state.master.addWin("msg", "道友为您额外返还" + ewjl + "血脉精华");
            }
        }
        if (items.length > 0) {
            await this.ctx.state.master.addItem2(gameMethod_1.gameMethod.mergeArr(items));
        }
    }
    /**
     * 升星(吞噬)
     */
    async upStar(gzId1, gzId2) {
        let info = await this.getInfo();
        if (info.list[gzId1] == null || info.list[gzId1].fzid == "") {
            this.ctx.throw("参数错误1");
        }
        if (info.list[gzId2] == null || info.list[gzId2].fzid == "") {
            this.ctx.throw("参数错误2");
        }
        if (info.list[gzId1].fzid != info.list[gzId2].fzid) {
            this.ctx.throw("吞噬同名兽灵才能进行升星");
        }
        //灵兽起源 活动 吞噬前结算奖励
        await HdQiYuanModel_1.HdQiYuanModel.jiesuan(this.ctx, this.id);
        let cfgpz = gameCfg_1.default.fazhenPinzhi.getItemCtx(this.ctx, info.list[gzId1].pinzhi.toString());
        let hasKey = [];
        for (const _skid1 in info.list[gzId1].sk) {
            if (parseInt(_skid1) < 1000) {
                continue;
            }
            let cs1 = gameCfg_1.default.fazhenSkillLv.getItemCtx(this.ctx, _skid1, info.list[gzId1].sk[_skid1].lv.toString()).cs;
            for (const key1 in cs1) {
                hasKey.push(key1);
            }
        }
        //统计增加的次数
        let max_lv = 1; //自身1次
        // //获取技能所有等级 1级 = 1次
        // for (const skid2 in info.list[gzId2].sk) {
        //     max_lv += info.list[gzId2].sk[skid2].lv
        // }
        // //通过品质找出 基础 被动技能个数（=等级） = bdmax2
        // let pinzhi2 = Gamecfg.fazhenInfo.getItemCtx(this.ctx,info.list[gzId2].fzid).pinzhi
        // let bdmax2 = Gamecfg.fazhenPinzhi.getItemCtx(this.ctx,pinzhi2.toString()).bdMax
        // //扣掉 被动技能个数 和 1个主动技能
        // max_lv -= (bdmax2 + 1)
        // if(max_lv - 2 > info.list[gzId2].star){
        //     this.ctx.throw("吞噬信息错误")
        // }
        max_lv += info.list[gzId2].star; //星级
        if (gameMethod_1.gameMethod.isEmpty(info.list[gzId1].skpx) == true) {
            info.list[gzId1].skpx = Object.keys(info.list[gzId1].sk);
        }
        //2.新增吞噬功能
        for (let index = 0; index < max_lv; index++) {
            //升星
            if (info.list[gzId1].star < 25) {
                info.list[gzId1].star += 1;
            }
            //未满5个技能 +技能
            if (Object.keys(info.list[gzId1].sk).length < 5) {
                let cfgItem = game_1.default.getProbByItems(cfgpz.prob, 0, 1);
                if (cfgItem == null) {
                    this.ctx.throw("抽取技能失败");
                }
                let cfgList = gameCfg_1.default.fazhenSkillList.getItemListCtx(this.ctx, cfgItem[0]);
                let listPool = [];
                for (const _item of cfgList) {
                    if (info.list[gzId1].sk[_item.id] != null) {
                        continue;
                    }
                    let pass = true;
                    let cs3 = gameCfg_1.default.fazhenSkillLv.getItemCtx(this.ctx, _item.id, "1").cs;
                    for (const key3 in cs3) {
                        if (hasKey.indexOf(key3) != -1) {
                            pass = false;
                        }
                    }
                    if (pass == false) {
                        continue;
                    }
                    listPool.push(_item);
                }
                let cfgLItem = game_1.default.getProbRandItem(0, listPool, "prob");
                if (cfgLItem == null) {
                    this.ctx.throw("抽取技能失败1");
                }
                info.list[gzId1].sk[cfgLItem.id] = { lv: 1, lock: 0 };
                info.list[gzId1].skpx.push(cfgLItem.id);
                let cs4 = gameCfg_1.default.fazhenSkillLv.getItemCtx(this.ctx, cfgLItem.id, "1").cs;
                for (const key3 in cs4) {
                    hasKey.push(key3);
                }
            }
            else {
                //技能升级
                let sks = [];
                for (const _skid in info.list[gzId1].sk) {
                    let skfzid = info.list[gzId1].fzid;
                    let skLv = info.list[gzId1].sk[_skid].lv;
                    let cfgSvNext = gameCfg_1.default.fazhenSkillLv.getItem(skfzid, (skLv + 1).toString());
                    if (cfgSvNext != null) {
                        sks.push(_skid);
                    }
                }
                if (sks.length <= 0) {
                    continue;
                }
                let cqId = game_1.default.getRandArr(sks, 1)[0];
                if (info.list[gzId1].sk[cqId] == null) {
                    this.ctx.throw("技能升级失败");
                }
                info.list[gzId1].sk[cqId].lv += 1;
            }
        }
        //灵兽起源 活动 下掉XX
        await HdQiYuanModel_1.HdQiYuanModel.zibao(this.ctx, this.id, [gzId2]);
        //破除心魔 去除使用
        await HdXinMoModel_1.HdXinMoModel.zibao(this.ctx, this.id, [gzId2]);
        //炼金中 下下来
        if (info.shouyiList.indexOf(gzId2) != -1) {
            info.shouyiList.splice(info.shouyiList.indexOf(gzId2), 1);
        }
        let fsList = [];
        fsList.push({
            fzid: info.list[gzId2].fzid,
            pinzhi: info.list[gzId2].pinzhi,
            saveId: info.list[gzId2].saveId,
        });
        info.list[gzId2] = {
            fzid: "",
            saveId: 0,
            otherEps: {},
            zaddp: 0,
            faddp: 0,
            sk: {},
            pinzhi: 0,
            lsSkid: ["", 0],
            lsfz: {
                fzid: "",
                saveId: 0,
                pinzhi: 0,
                sk: {},
                skpx: []
            },
            star: 0,
            xietong: "",
            skpx: []
        };
        await this.update(info);
        //放生返还
        await this.fangsheng(fsList);
        //
        await this.checkXietong();
    }
    /**
     * 技能锁定/解锁
     */
    async suoding(gzId, skid) {
        let info = await this.getInfo();
        if (info.list[gzId] == null || info.list[gzId].sk[skid] == null) {
            this.ctx.throw("参数错误");
        }
        if (info.list[gzId].sk[skid].lock != 1) {
            info.list[gzId].sk[skid].lock = 1;
        }
        else {
            info.list[gzId].sk[skid].lock = 0;
        }
        let suoNum = 0;
        for (const skid in info.list[gzId].sk) {
            if (info.list[gzId].sk[skid].lock == 1) {
                suoNum += 1;
            }
        }
        let item2 = tool_1.tool.mathcfg_item(this.ctx, "zhenfa_xilian_item2");
        if (suoNum > item2.length - 1) {
            this.ctx.throw(`最多只能锁定${item2.length - 1}个技能`);
        }
        await this.update(info);
    }
    /**
     * 洗练
     */
    async xilian(gzId) {
        let info = await this.getInfo();
        if (Object.keys(info.list[gzId].sk).length < 5) {
            this.ctx.throw("兽灵满5个技能时，开启洗炼");
        }
        let suoNum = 0;
        let sdSk = []; //已经锁定的技能
        for (const skid in info.list[gzId].sk) {
            if (info.list[gzId].sk[skid].lock == 1) {
                suoNum += 1;
                sdSk.push(skid);
            }
        }
        //消耗
        let subItems = [];
        let item2 = tool_1.tool.mathcfg_item(this.ctx, "zhenfa_xilian_item2");
        if (item2[suoNum] == null) {
            this.ctx.throw("zhenfa_xilian_item2配置错误");
        }
        subItems.push([1, 2, item2[suoNum]]);
        let item1 = tool_1.tool.mathcfg_item(this.ctx, "zhenfa_xilian_item1");
        if (item1[suoNum] == null) {
            this.ctx.throw("zhenfa_xilian_item1配置错误");
        }
        subItems.push([1, 83, item1[suoNum]]);
        await this.ctx.state.master.subItem2(subItems);
        if (gameMethod_1.gameMethod.isEmpty(info.list[gzId].skpx) == true) {
            info.list[gzId].skpx = Object.keys(info.list[gzId].sk);
        }
        let cfgpz = gameCfg_1.default.fazhenPinzhi.getItemCtx(this.ctx, info.list[gzId].pinzhi.toString());
        let hasKey = [];
        for (const _skid1 in info.list[gzId].sk) {
            if (parseInt(_skid1) < 1000) {
                continue;
            }
            if (info.list[gzId].sk[_skid1].lock != 1) {
                continue;
            }
            let cs1 = gameCfg_1.default.fazhenSkillLv.getItemCtx(this.ctx, _skid1, info.list[gzId].sk[_skid1].lv.toString()).cs;
            for (const key1 in cs1) {
                hasKey.push(key1);
            }
        }
        let copysk = gameMethod_1.gameMethod.objCopy(info.list[gzId].sk);
        info.list[gzId].sk = {};
        for (const _skid in copysk) {
            if (copysk[_skid].lock == 1) {
                info.list[gzId].sk[_skid] = copysk[_skid];
                continue;
            }
            let cdtype1 = gameCfg_1.default.fazhenSkill.getItemCtx(this.ctx, _skid).type;
            if (cdtype1 == 1) {
                info.list[gzId].sk[_skid] = copysk[_skid];
                continue;
            }
            let xbid = info.list[gzId].skpx.indexOf(_skid);
            let cfgItem = game_1.default.getProbByItems(cfgpz.prob, 0, 1);
            if (cfgItem == null) {
                this.ctx.throw("抽取技能失败");
            }
            let cfgList = gameCfg_1.default.fazhenSkillList.getItemListCtx(this.ctx, cfgItem[0]);
            let listPool = [];
            for (const _item of cfgList) {
                if (sdSk.indexOf(_item.id) != -1) {
                    continue;
                }
                let pass = true;
                let cs3 = gameCfg_1.default.fazhenSkillLv.getItemCtx(this.ctx, _item.id, "1").cs;
                for (const key3 in cs3) {
                    if (hasKey.indexOf(key3) != -1) {
                        pass = false;
                    }
                }
                if (pass == false) {
                    continue;
                }
                listPool.push(_item);
            }
            let cfgLItem = game_1.default.getProbRandItem(0, listPool, "prob");
            if (cfgLItem == null) {
                this.ctx.throw("抽取技能失败1");
            }
            info.list[gzId].sk[cfgLItem.id] = copysk[_skid];
            info.list[gzId].skpx[xbid] = cfgLItem.id;
            let cs5 = gameCfg_1.default.fazhenSkillLv.getItemCtx(this.ctx, cfgLItem.id, "1").cs;
            for (const key5 in cs5) {
                hasKey.push(key5);
            }
            sdSk.push(cfgLItem.id);
        }
        await this.update(info);
        if (await this.ctx.state.master.subItem2(subItems, true) != true) {
            let heid = await this.getHeIdByUuid(this.id);
            //触发礼包
            //活动 - 限时福利
            let cfgHdTimeBen = setting_1.default.getHuodong2(heid, "hdTimeBen");
            if (cfgHdTimeBen != null) {
                for (const hdcid in cfgHdTimeBen) {
                    let hdTimeBenModel = HdTimeBenModel_1.HdTimeBenModel.getInstance(this.ctx, this.id, hdcid);
                    await hdTimeBenModel.trip(Xys_1.TimeBenType.xilian);
                }
            }
        }
    }
    /**
     * 兽灵协同
     */
    async xietong(gzId, xtId) {
        let info = await this.getInfo();
        if (info.list[gzId] == null || info.list[gzId].fzid == "") {
            this.ctx.throw("参数错误gzId");
        }
        for (const _gzId in info.list) {
            if (info.list[_gzId].xietong == xtId) {
                info.list[_gzId].xietong = "";
            }
        }
        info.list[gzId].xietong = xtId;
        await this.update(info);
    }
    /**
     * 检测协同是否已经被不存在了
     */
    async checkXietong() {
        let isUpdate = false;
        let info = await this.getInfo();
        for (const _gzId in info.list) {
            if (info.list[_gzId].xietong == null) {
                info.list[_gzId].xietong = "";
            }
            if (info.list[_gzId].xietong != "") {
                let _xietong = info.list[_gzId].xietong;
                if (info.list[_xietong] != null && info.list[_xietong].fzid == "") {
                    info.list[_gzId].xietong = "";
                    isUpdate = true;
                }
            }
        }
        if (isUpdate) {
            await this.update(info);
        }
    }
    /**
     * 设置目标兽灵
     */
    async setFzid(fzid) {
        let info = await this.getInfo();
        let pinzhi = gameCfg_1.default.fazhenInfo.getItemCtx(this.ctx, fzid).pinzhi;
        let kv = tool_1.tool.mathcfg_kv(this.ctx, "zhenfa_mubiao");
        if (kv[pinzhi.toString()] == null) {
            this.ctx.throw("参数错误fzid");
        }
        info.mubiao = fzid;
        if (info.mbNum[pinzhi.toString()] == null) {
            info.mbNum[pinzhi.toString()] = 0;
        }
        await this.update(info);
    }
}
exports.ActFazhenModel = ActFazhenModel;
//# sourceMappingURL=ActFazhenModel.js.map