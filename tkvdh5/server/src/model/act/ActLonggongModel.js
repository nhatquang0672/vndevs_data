"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActLonggongModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const game_1 = __importDefault(require("../../util/game"));
const tool_1 = require("../../util/tool");
const ActClubModel_1 = require("./ActClubModel");
const SevClubMemberModel_1 = require("../sev/SevClubMemberModel");
const lock_1 = __importDefault(require("../../util/lock"));
const SevLonggongModel_1 = require("../sev/SevLonggongModel");
const UserModel_1 = require("../user/UserModel");
const gameMethod_1 = require("../../../common/gameMethod");
const cache_1 = __importDefault(require("../../util/cache"));
const MailModel_1 = require("../user/MailModel");
const SevClubModel_1 = require("../sev/SevClubModel");
const ActChengHModel_1 = require("./ActChengHModel");
/**
 * 龙宫运宝
 */
class ActLonggongModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actLonggong"; //用于存储key 和  输出1级key
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
    init_yun() {
        return {
            ybFuuid: "",
            ybpos: 0,
            ybSat: 0,
            ybEat: 0,
            jiaofu: "",
            beida: 0,
            lgLv: 0,
        };
    }
    //初始化
    init() {
        return {
            time: this.ctx.state.newTime,
            yunbao: 0,
            yun: this.init_yun(),
            yunVer: 0,
            duo: 0,
            duoAt: 0,
            fuuids: [],
            kind11At: 0,
            sxNum: 0,
            sxid: [] //上香ID
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        if (info.sxNum == null) {
            info.sxNum = 0;
        }
        if (info.time < this.ctx.state.new0) {
            info.time = this.ctx.state.newTime;
            info.yunbao = 0;
            info.duo = 0;
            info.duoAt = 0;
            info.kind11At = 0;
            info.sxNum = 0;
            info.sxid = [];
        }
        return info;
    }
    /**
     * 返回数据
     */
    async getOutPut() {
        let info = await this.getInfo();
        let outf = gameMethod_1.gameMethod.objCopy(info);
        if (outf.yun.ybFuuid != "") {
            outf.yun.fuser = await cache_1.default.getFUser(this.ctx, outf.yun.ybFuuid);
        }
        return outf;
    }
    /**
     * 界面玩家跑图 重置下发
     */
    async backData_Run_a() {
        let info = await this.getInfo();
        let heid = await this.getHeIdByUuid(this.id);
        let sevLonggongModel = SevLonggongModel_1.SevLonggongModel.getInstance(this.ctx, heid);
        let sevLonggong = await sevLonggongModel.getInfo();
        let allFuuids = [];
        for (const _fuuid in info.fuuids) {
            if (sevLonggong.list[_fuuid] == null) {
                continue;
            }
            if (sevLonggong.list[_fuuid].ybEat <= this.ctx.state.newTime) {
                continue;
            }
            allFuuids.push(_fuuid);
            if (allFuuids.length > 30) {
                break;
            }
        }
        for (const _fuuid in sevLonggong.list) {
            if (allFuuids.length > 30) {
                break;
            }
            if (allFuuids.indexOf(_fuuid) != -1) {
                break;
            }
            if (sevLonggong.list[_fuuid].ybEat <= this.ctx.state.newTime) {
                continue;
            }
            allFuuids.push(_fuuid);
        }
        info.fuuids = allFuuids;
        await this.update(info, [""]);
        let outf = {};
        outf["actLonggongRun"] = {};
        outf["actLonggongRun"]["a"] = {};
        for (const _fuuid1 of info.fuuids) {
            outf["actLonggongRun"]["a"][_fuuid1] = sevLonggong.list[_fuuid1];
            if (sevLonggong.list[_fuuid1].ybFuuid != "") {
                outf["actLonggongRun"]["a"][_fuuid1].fuser = await cache_1.default.getFUser(this.ctx, sevLonggong.list[_fuuid1].ybFuuid);
            }
            outf["actLonggongRun"]["a"][_fuuid1].ybuser = await cache_1.default.getFUser(this.ctx, _fuuid1);
        }
        this.ctx.state.master.addBackBuf(outf);
    }
    /**
     * 界面玩家跑图 补发
     */
    async backData_Run_u(fuuids) {
        let outf = {};
        outf["actLonggongRun"] = {};
        outf["actLonggongRun"]["u"] = {};
        let heid = await this.getHeIdByUuid(this.id);
        let sevLonggongModel = SevLonggongModel_1.SevLonggongModel.getInstance(this.ctx, heid);
        let sevLonggong = await sevLonggongModel.getInfo();
        for (const _fuuid1 of fuuids) {
            if (sevLonggong.list[_fuuid1].ybEat <= this.ctx.state.newTime) {
                continue;
            }
            outf["actLonggongRun"]["u"][_fuuid1] = sevLonggong.list[_fuuid1];
            if (sevLonggong.list[_fuuid1].ybFuuid != "") {
                outf["actLonggongRun"]["u"][_fuuid1].fuser = await cache_1.default.getFUser(this.ctx, sevLonggong.list[_fuuid1].ybFuuid);
            }
            outf["actLonggongRun"]["u"][_fuuid1].ybuser = await cache_1.default.getFUser(this.ctx, _fuuid1);
        }
        this.ctx.state.master.addBackBuf(outf);
    }
    /**
    *  检测是否数据发生改变
    */
    async clickYun() {
        let info = await this.getInfo();
        if (info.yunVer == 0 || info.yun.jiaofu == "" || info.yun.ybSat == 0) {
            return;
        }
        let heid = await this.getHeIdByUuid(this.id);
        let sevLonggongModel = SevLonggongModel_1.SevLonggongModel.getInstance(this.ctx, heid);
        let sevLonggong = await sevLonggongModel.getInfo();
        if (info.yunVer == sevLonggong.ver) {
            return;
        }
        info.yunVer = sevLonggong.ver;
        if (info.yun.ybEat > this.ctx.state.newTime) {
            if (sevLonggong.list[this.id] == null || sevLonggong.list[this.id].ybEat <= this.ctx.state.newTime) {
                info.yun.ybEat = this.ctx.state.newTime;
            }
            else {
                if (sevLonggong.list[this.id].ybEat == info.yun.ybEat) {
                    return;
                }
                info.yun = gameMethod_1.gameMethod.objCopy(sevLonggong.list[this.id]);
            }
        }
        //重新检测我的跑图列表
        let fuuids = [];
        for (const _fuuid in info.fuuids) {
            if (sevLonggong.list[_fuuid] == null || sevLonggong.list[_fuuid].ybEat <= this.ctx.state.newTime) {
                continue;
            }
            fuuids.push(_fuuid);
        }
        //不够30个 重新补充
        for (const _fuuid in sevLonggong.list) {
            if (fuuids.length >= 30) {
                break;
            }
            if (sevLonggong.list[_fuuid] == null || sevLonggong.list[_fuuid].ybEat <= this.ctx.state.newTime) {
                continue;
            }
            fuuids.push(_fuuid);
        }
        info.fuuids = fuuids;
        await this.update(info);
        await this.backData_Run_u(info.fuuids);
    }
    /**
    *  检测运保是否完成
    */
    async adokYun() {
        let info = await this.getInfo();
        if (info.yun.jiaofu == "" || info.yun.ybEat > this.ctx.state.newTime) {
            await this.backData();
            return;
        }
        if (info.yun.ybSat == 0) {
            return;
        }
        //结算
        if (info.yun.beida == 0) {
            if (info.yun.ybFuuid == "") { //没有请护卫
                let items = gameMethod_1.gameMethod.longgong_yubao(info.yun, 1);
                await this.ctx.state.master.addItem2(items);
            }
            else {
                let items = gameMethod_1.gameMethod.longgong_yubao(info.yun, 3);
                await this.ctx.state.master.addItem2(items);
                //上交保护费
                await lock_1.default.setLock(this.ctx, "user", info.yun.ybFuuid); //枷锁
                let sjitems = gameMethod_1.gameMethod.longgong_yubao(info.yun, 4);
                let fmailModel = MailModel_1.MailModel.getInstance(this.ctx, info.yun.ybFuuid);
                let title1 = "龙宫运宝护送奖励";
                let content1 = `龙宫运宝中成功护送宝主，获得奖励`;
                await fmailModel.sendMail(title1, content1, sjitems, 1);
            }
        }
        else {
            let items = gameMethod_1.gameMethod.longgong_yubao(info.yun, 1);
            await this.ctx.state.master.addItem2(items);
        }
        info.yun = this.init_yun();
        await this.update(info);
    }
    /**
    *  召唤
    */
    async zhaohuan() {
        let info = await this.getInfo();
        if (info.yun.jiaofu != "") {
            this.ctx.throw("已有龙宫脚夫");
        }
        let pool = gameCfg_1.default.longgongJiaofu.pool;
        let _item = game_1.default.getProbRandItem(0, pool, "prob");
        if (_item == null) {
            this.ctx.throw("抽取错误");
            return;
        }
        info.yun.jiaofu = _item.id;
        await this.update(info);
    }
    /**
    *  重新召唤
    */
    async shuaxin() {
        let info = await this.getInfo();
        let count = tool_1.tool.mathcfg_count(this.ctx, "longgong_jiaofu");
        if (info.sxNum >= count) {
            if (await this.ctx.state.master.subItem1([1, 73, 1], true) == true) {
                await this.ctx.state.master.subItem1([1, 73, 1]);
            }
            else {
                let items = tool_1.tool.mathcfg_items(this.ctx, "longgong_jiaofu");
                let xb = Math.min(info.sxNum - count, items.length - 1);
                await this.ctx.state.master.subItem1(items[xb]);
                info.sxNum += 1;
            }
        }
        else {
            info.sxNum += 1;
        }
        let xsitems = tool_1.tool.mathcfg_items(this.ctx, "longgong_shuaxin");
        let _item = game_1.default.getProbByItems(xsitems, 0, 1);
        if (_item == null) {
            this.ctx.throw("抽取错误");
            return;
        }
        let maxId = 0;
        let pool = gameCfg_1.default.longgongJiaofu.pool;
        for (const key in pool) {
            maxId = Math.max(maxId, parseInt(pool[key].id));
        }
        info.yun.jiaofu = (Math.min(parseInt(info.yun.jiaofu) + _item[0], maxId)).toString();
        await this.update(info);
    }
    /**
    *  邀请
    */
    async yaoqing(fuuid) {
        //获取玩家仙盟ID
        let actClubModel = ActClubModel_1.ActClubModel.getInstance(this.ctx, this.id);
        let clubId = await actClubModel.clickClub(true);
        let info = await this.getInfo();
        if (info.yun.ybSat > 0) {
            this.ctx.throw("运宝中");
        }
        //仙盟锁
        await lock_1.default.setLock(this.ctx, "club", clubId);
        let sevClubMemberModel = SevClubMemberModel_1.SevClubMemberModel.getInstance(this.ctx, clubId);
        let sevClubMember = await sevClubMemberModel.getInfo();
        if (fuuid != "" && sevClubMember.list[fuuid] == null) {
            this.ctx.state.master.addWin("msg", "当前玩家已离开仙盟");
            await sevClubMemberModel.backData();
            return;
        }
        //之前邀请的人
        let oldyq = info.yun.ybFuuid;
        if (oldyq != "" && oldyq == fuuid) {
            this.ctx.state.master.addWin("msg", "已邀请");
            await sevClubMemberModel.backData();
            return;
        }
        let count1 = tool_1.tool.mathcfg_count1(this.ctx, "longgong_duoqu");
        if (fuuid != "" && sevClubMember.list[fuuid].longgong >= count1) {
            this.ctx.state.master.addWin("msg", "该成员已无被邀请次数");
            await sevClubMemberModel.backData();
            return;
        }
        if (oldyq != "" && sevClubMember.list[oldyq] != null) {
            sevClubMember.list[oldyq].longgong -= 1;
            sevClubMember.list[oldyq].longgong = Math.max(0, sevClubMember.list[oldyq].longgong); //防错
        }
        if (fuuid != "") {
            sevClubMember.list[fuuid].longgong += 1;
        }
        await sevClubMemberModel.update(sevClubMember);
        info.yun.ybFuuid = fuuid;
        await this.update(info);
    }
    /**
    *  运保
    */
    async yunbao() {
        let info = await this.getInfo();
        let count = tool_1.tool.mathcfg_count(this.ctx, "longgong_yunbao");
        if (info.yunbao >= count) {
            await this.ctx.state.master.subItem1([1, 74, 1]);
        }
        let actClubModel = ActClubModel_1.ActClubModel.getInstance(this.ctx, this.id);
        let actClub = await actClubModel.getInfo();
        let lgLv = 0;
        if (actClub.clubId != "") {
            //仙盟锁
            await lock_1.default.setLock(this.ctx, "club", actClub.clubId);
            //仙盟
            let sevClubModel = SevClubModel_1.SevClubModel.getInstance(this.ctx, actClub.clubId);
            let sevClub = await sevClubModel.getInfo();
            lgLv = sevClub.lgLv;
        }
        let heid = await this.getHeIdByUuid(this.id);
        await lock_1.default.setLock(this.ctx, "sevLonggong", heid);
        let sevLonggongModel = SevLonggongModel_1.SevLonggongModel.getInstance(this.ctx, heid);
        let sevLonggong = await sevLonggongModel.getInfo();
        let cfg = gameCfg_1.default.longgongJiaofu.getItemCtx(this.ctx, info.yun.jiaofu);
        info.yun.ybpos = 0;
        info.yun.ybSat = this.ctx.state.newTime;
        info.yun.beida = 0;
        info.yun.lgLv = lgLv;
        info.yunbao += 1;
        info.yunVer = sevLonggong.ver;
        info.yun.ybEat = this.ctx.state.newTime + cfg.miao;
        //如果有显圣 要计算显圣节省时间
        let maxEndAt = Math.min(sevLonggong.xhuo.fAt, info.yun.ybEat);
        if (maxEndAt > info.yun.ybSat) {
            let count = tool_1.tool.mathcfg_count(this.ctx, "longgong_xiansheng");
            //加速的我可以走多少距离
            let jsMax = Math.floor((maxEndAt - info.yun.ybSat) * 100 / count);
            if (jsMax > cfg.miao) {
                info.yun.ybEat = info.yun.ybSat + cfg.miao / (100 / count);
            }
            else {
                info.yun.ybEat = info.yun.ybSat + jsMax / (100 / count);
                info.yun.ybEat += (cfg.miao - jsMax);
            }
        }
        await this.update(info);
        //同步到公共列表
        await sevLonggongModel.addList(this.id, info.yun);
    }
    /**
    *  手动显圣
    */
    async shangxiang(xlsid) {
        let info = await this.getInfo();
        if (info.sxid.indexOf(xlsid) != -1) {
            this.ctx.throw("今日已上香");
        }
        info.sxid.push(xlsid);
        await this.update(info);
        let actClubModel = ActClubModel_1.ActClubModel.getInstance(this.ctx, this.id);
        let actClub = await actClubModel.getInfo();
        if (actClub.clubId == "") {
            this.ctx.throw("请先加入仙盟");
        }
        let cfg = gameCfg_1.default.longgongBai.getItemCtx(this.ctx, xlsid);
        await this.ctx.state.master.subItem1(cfg.need);
        //仙盟锁
        await lock_1.default.setLock(this.ctx, "club", actClub.clubId);
        //仙盟
        let sevClubModel = SevClubModel_1.SevClubModel.getInstance(this.ctx, actClub.clubId);
        await sevClubModel.addLgExp(cfg.xianghuo);
        //直接获得道具
        await this.ctx.state.master.addItem1(cfg.item);
    }
    /**
    *  手动显圣
    */
    async xiansheng() {
        let userModel = UserModel_1.UserModel.getInstance(this.ctx, this.id);
        let userInfo = await userModel.getInfo();
        let count = tool_1.tool.mathcfg_count(this.ctx, "longgong_xs_need");
        if (userInfo.iscz < count) {
            this.ctx.throw("未满足条件");
        }
        let heid = await this.getHeIdByUuid(this.id);
        await lock_1.default.setLock(this.ctx, "sevLonggong", heid);
        let sevLonggongModel = SevLonggongModel_1.SevLonggongModel.getInstance(this.ctx, heid);
        await sevLonggongModel.sevXiansheng(this.id);
        //称号
        let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(this.ctx, this.id);
        await actChengHModel.addXsCount(1);
        //仙盟锁
        let actClubModel = ActClubModel_1.ActClubModel.getInstance(this.ctx, this.id);
        let actClub = await actClubModel.getInfo();
        if (actClub.clubId != "") {
            await actChengHModel.addXsCount(2);
            //仙盟锁
            await lock_1.default.setLock(this.ctx, "club", actClub.clubId);
            //仙盟
            let sevClubMemberModel = SevClubMemberModel_1.SevClubMemberModel.getInstance(this.ctx, actClub.clubId);
            let sevClubMember = await sevClubMemberModel.getInfo();
            for (const _uuid in sevClubMember.list) {
                if (_uuid == this.id) {
                    continue;
                }
                await lock_1.default.setLock(this.ctx, "user", _uuid);
                this.ctx.state.fuuid = _uuid;
                let factChengHModel = ActChengHModel_1.ActChengHModel.getInstance(this.ctx, _uuid);
                await factChengHModel.addXsCount(2);
                this.ctx.state.fuuid = "";
            }
        }
    }
    /**
    *  下拉获取5个跑图玩家
    */
    async get5() {
        let info = await this.getInfo();
        let heid = await this.getHeIdByUuid(this.id);
        await lock_1.default.setLock(this.ctx, "sevLonggong", heid);
        let sevLonggongModel = SevLonggongModel_1.SevLonggongModel.getInstance(this.ctx, heid);
        let sevLonggong = await sevLonggongModel.getInfo();
        let fuuids = [];
        //不够30个 重新补充
        for (const _fuuid in sevLonggong.list) {
            if (fuuids.length >= 5) {
                break;
            }
            if (info.fuuids.indexOf(_fuuid) != -1) {
                continue;
            }
            if (sevLonggong.list[_fuuid] == null || sevLonggong.list[_fuuid].ybEat <= this.ctx.state.newTime) {
                continue;
            }
            fuuids.push(_fuuid);
        }
        if (fuuids.length <= 0) {
            return;
        }
        await this.backData_Run_u(fuuids);
        info.fuuids = game_1.default.addArr(info.fuuids, fuuids);
        await this.update(info, [""]);
    }
    /**
    *  花钻石跳过广告
    */
    async buyKind11() {
        let info = await this.getInfo();
        let count = tool_1.tool.mathcfg_count(this.ctx, "longgong_lengqie");
        let count1 = tool_1.tool.mathcfg_count1(this.ctx, "longgong_lengqie");
        if (info.duo >= count1) {
            this.ctx.throw("无免费的掠夺次数");
        }
        if (info.duoAt + count <= this.ctx.state.newTime) {
            this.ctx.throw("已经完成冷却");
        }
        await this.ctx.state.master.subItem1([1, 1, 6]);
        info.duoAt = 0;
        await this.update(info);
    }
    /**
     * 广告下单检查
     */
    async checkUp() {
        let info = await this.getInfo();
        let count = tool_1.tool.mathcfg_count(this.ctx, "longgong_lengqie");
        let count1 = tool_1.tool.mathcfg_count1(this.ctx, "longgong_lengqie");
        if (info.duo >= count1) {
            this.ctx.throw("无免费的掠夺次数");
        }
        if (info.duoAt + count <= this.ctx.state.newTime) {
            this.ctx.throw("已经完成冷却");
        }
        return {
            type: 1,
            msg: "龙宫广告",
            data: null,
        };
    }
    /**
     * 看广告拉次数
     */
    async carryOut() {
        let info = await this.getInfo();
        let count = tool_1.tool.mathcfg_count(this.ctx, "longgong_lengqie");
        let count1 = tool_1.tool.mathcfg_count1(this.ctx, "longgong_lengqie");
        if (info.duo >= count1) {
            this.ctx.throw("无免费的掠夺次数");
        }
        if (info.duoAt + count <= this.ctx.state.newTime) {
            this.ctx.throw("已经完成冷却");
        }
        info.duoAt = 0;
        info.kind11At = this.ctx.state.newTime;
        await this.update(info);
        return {
            type: 1,
            msg: "龙宫掠夺冷却完成",
            data: null,
        };
    }
}
exports.ActLonggongModel = ActLonggongModel;
//# sourceMappingURL=ActLonggongModel.js.map