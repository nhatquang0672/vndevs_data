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
exports.ActRwdModel = void 0;
const AModel_1 = require("../AModel");
const setting_1 = __importDefault(require("../../crontab/setting"));
const master_1 = require("../../util/master");
const MailModel_1 = require("../user/MailModel");
const Xys = __importStar(require("../../../common/Xys"));
const SevAdokModel_1 = require("../sev/SevAdokModel");
const mongodb_1 = require("../../util/mongodb");
const game_1 = __importDefault(require("../../util/game"));
const gameMethod_1 = require("../../../common/gameMethod");
const SevDouLuoModel_1 = require("../sev/SevDouLuoModel");
const SevTianGongModel_1 = require("../sev/SevTianGongModel");
const ActItemModel_1 = require("./ActItemModel");
const ActClubModel_1 = require("./ActClubModel");
const HdDengShenBangModel_1 = require("../hd/HdDengShenBangModel");
/**
 * 各种领取key存储  - 不输出
 */
class ActRwdModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actRwd"; //用于存储key 和  输出1级key
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
            mail: {},
            hdChou: {},
            hdCb: {},
            hdJiYuan: {},
            hdChumo: {},
            hdQiYuan: {},
            hdTianGong: {},
            hdTianGongKua: {},
            hdHuanJing: {},
            hdXinMo: {},
            hdLunHui: {},
            hdYueGong: {},
            hdChongYang: {},
            hdShanhe: {},
            hdChargeTotal: {},
            hdDouLuo: {},
            hdDengShenBang: {},
        };
    }
    async getOutPut() {
        return null;
    }
    async backData() {
    }
    /**
     * 检查是否有新邮件
     */
    async checkMail() {
        let info = await this.getInfo();
        let sid = this.ctx.state.sid;
        let regtime = this.ctx.state.regtime;
        //后台邮件检测
        let a_mails = await setting_1.default.getMails();
        for (const xbid in a_mails) {
            if (info.mail[xbid] != null) {
                continue; //已经领取
            }
            if (a_mails[xbid].regtime != 0 && regtime > a_mails[xbid].regtime) {
                continue; //发完邮件注册的
            }
            //个人
            if (a_mails[xbid].geren == "all") {
                await this.sendMail(a_mails[xbid]);
                info.mail[xbid] = this.ctx.state.newTime;
                continue; //已经领取
            }
            let gerens = a_mails[xbid].geren.split(',');
            if (gerens.indexOf(this.id) != -1) {
                await this.sendMail(a_mails[xbid]);
                info.mail[xbid] = this.ctx.state.newTime;
                continue; //已经领取
            }
            //区服
            let sids = setting_1.default.qufuStr(a_mails[xbid].qufu);
            if (sids.indexOf(sid) != -1) {
                await this.sendMail(a_mails[xbid]);
                info.mail[xbid] = this.ctx.state.newTime;
                continue; //已经领取
            }
            //其他
        }
        await this.update(info);
    }
    /**
     * 九龙秘宝
     * 检查是否有新邮件（活动）
     */
    async checkHd() {
        let info = await this.getInfo();
        if (info.hdChou == null) {
            info.hdChou = {};
        }
        if (info.hdCb == null) {
            info.hdCb = {};
        }
        if (info.hdChumo == null) {
            info.hdChumo = {};
        }
        if (info.hdQiYuan == null) {
            info.hdQiYuan = {};
        }
        if (info.hdTianGong == null) {
            info.hdTianGong = {};
        }
        if (info.hdTianGongKua == null) {
            info.hdTianGongKua = {};
        }
        if (info.hdHuanJing == null) {
            info.hdHuanJing = {};
        }
        if (info.hdXinMo == null) {
            info.hdXinMo = {};
        }
        if (info.hdYueGong == null) {
            info.hdYueGong = {};
        }
        if (info.hdChongYang == null) {
            info.hdChongYang = {};
        }
        if (info.hdShanhe == null) {
            info.hdShanhe = {};
        }
        if (info.hdDengShenBang == null) {
            info.hdDengShenBang = {};
        }
        //合服id
        let hesid = await this.getHeIdByUuid(this.id);
        let mailModel = MailModel_1.MailModel.getInstance(this.ctx, this.id);
        let sevAdokModel = SevAdokModel_1.SevAdokModel.getInstance(this.ctx, hesid);
        let sevAdok = await sevAdokModel.getInfo();
        let isUpdate = false;
        //九龙
        for (const rdsKey in sevAdok.hdChou) {
            if (info.hdChou[rdsKey] != null) {
                continue;
            }
            isUpdate = true;
            let _sTime = sevAdok.hdChou[rdsKey].stime;
            let hdid = sevAdok.hdChou[rdsKey].hdid;
            let _hdcid = sevAdok.hdChou[rdsKey].hdcid;
            let hdRwd = setting_1.default.getSysRwds(hesid, "hdChou", rdsKey, this.ctx.state.newTime);
            if (hdRwd == null || hdRwd[this.id] == null) {
                continue;
            }
            if (setting_1.default.a_huodongs == null || setting_1.default.a_huodongs[hdid] == null) {
                continue; //已经找不到改活动配置了
            }
            let rid = hdRwd[this.id][0];
            info.hdChou[rdsKey] = rid;
            let title = "九龙秘宝排名奖励";
            let content = `九龙秘宝活动结束，恭喜大侠在九龙秘宝活动中排名第${rid}，获得以下奖励，请及时领取。`;
            let _value = eval("(" + setting_1.default.a_huodongs[hdid].value + ")");
            let items = [];
            for (const rank of _value.data.rank) {
                if (rid >= rank.pm[0] && rid <= rank.pm[1]) {
                    items = rank.items;
                    break;
                }
            }
            await mailModel.sendMail(title, content, items, items.length > 0 ? 1 : 0, _sTime);
            //查找判定有没有领取完积分档次
            let items1 = [];
            let actHdChou = await mongodb_1.dbSev.getDataDb().findOne("hd", { id: this.id, kid: "hdChou", hdcid: _hdcid });
            if (actHdChou != null && rdsKey.indexOf(actHdChou.data.hdid) != -1) { //是当前活动
                for (const dc in _value.data.jifen) {
                    if (actHdChou.data.jifendc.indexOf(dc) != -1) {
                        continue; //已经领取
                    }
                    if (_value.data.jifen[dc].need > actHdChou.data.score) {
                        continue; //未满足条件
                    }
                    items1 = game_1.default.addArr(items1, _value.data.jifen[dc].items);
                }
                //九龙秘宝过期时，如果存在未抽取奖励的次数时，直接邮件补发，单个补发500金币。
                if (actHdChou.data.itemId_802 > 0) {
                    items1.push([1, 2, 500 * actHdChou.data.itemId_802]);
                }
            }
            if (items1.length > 0) {
                let title1 = "九龙秘宝活动奖励";
                let content1 = `九龙秘宝活动结束，您有奖励尚未领取，请及时领取奖励。`;
                await mailModel.sendMail(title1, content1, gameMethod_1.gameMethod.mergeArr(items1), 1, _sTime);
            }
        }
        //冲榜
        for (const rdsKey in sevAdok.hdCb) {
            if (info.hdCb[rdsKey] != null) {
                continue;
            }
            isUpdate = true;
            let _sTime = sevAdok.hdCb[rdsKey].stime;
            let hdid = sevAdok.hdCb[rdsKey].hdid;
            let hdRwd = setting_1.default.getSysRwds(hesid, "hdChongbang", rdsKey, this.ctx.state.newTime);
            if (hdRwd == null || hdRwd[this.id] == null) {
                continue;
            }
            if (setting_1.default.a_huodongs == null || setting_1.default.a_huodongs[hdid] == null) {
                continue; //已经找不到改活动配置了
            }
            let rid = hdRwd[this.id][0];
            info.hdCb[rdsKey] = rid;
            let title = "开服冲榜排名奖励";
            let content = `开服冲榜活动结束，恭喜您获得第${rid}名，排名奖励已发放，请及时领取。`;
            let _value = eval("(" + setting_1.default.a_huodongs[hdid].value + ")");
            let items = [];
            for (const rank of _value.data.rank) {
                if (rid >= rank.pm[0] && rid <= rank.pm[1]) {
                    items = rank.items;
                    break;
                }
            }
            await mailModel.sendMail(title, content, items, items.length > 0 ? 1 : 0, _sTime);
        }
        //除魔卫道
        for (const rdsKey in sevAdok.hdChumo) {
            if (info.hdChumo[rdsKey] != null) {
                continue;
            }
            isUpdate = true;
            let _sTime = sevAdok.hdChumo[rdsKey].stime;
            let hdid = sevAdok.hdChumo[rdsKey].hdid;
            let hdRwd = setting_1.default.getSysRwds(hesid, "hdChumo", rdsKey, this.ctx.state.newTime);
            if (hdRwd == null || hdRwd[this.id] == null) {
                continue;
            }
            if (setting_1.default.a_huodongs == null || setting_1.default.a_huodongs[hdid] == null) {
                continue; //已经找不到改活动配置了
            }
            let rid = hdRwd[this.id][0];
            info.hdChumo[rdsKey] = rid;
            let title = "除魔卫道排名奖励";
            let content = `除魔卫道活动结束，恭喜大侠在除魔卫道活动中排名第${rid}，获得以下奖励，请及时领取。`;
            let _value = eval("(" + setting_1.default.a_huodongs[hdid].value + ")");
            let items = [];
            for (const rank of _value.data.rank) {
                if (rid >= rank.pm[0] && rid <= rank.pm[1]) {
                    items = rank.items;
                    break;
                }
            }
            await mailModel.sendMail(title, content, items, items.length > 0 ? 1 : 0, _sTime);
        }
        //机缘
        for (const hdid in sevAdok.hdJiYuan) {
            let _hdcid = sevAdok.hdJiYuan[hdid].hdcid;
            let _hid = sevAdok.hdJiYuan[hdid].hid;
            let _etime = sevAdok.hdJiYuan[hdid].etime;
            if (info.hdJiYuan == null) {
                info.hdJiYuan = {};
            }
            if (info.hdJiYuan[_hid] != null) {
                continue;
            }
            info.hdJiYuan[_hid] = this.ctx.state.newTime;
            isUpdate = true;
            let actHdJiYuan = await mongodb_1.dbSev.getDataDb().findOne("hd", { id: this.id, kid: "hdJiYuan", hdcid: _hdcid });
            if (actHdJiYuan == null || actHdJiYuan.data.hdid != _hid) { //是当前活动
                continue;
            }
            let _a_huodongs = await mongodb_1.dbSev.getDataDb().findOne("a_huodong", { "id": hdid });
            if (_a_huodongs == null) {
                continue;
            }
            let _value = eval("(" + _a_huodongs.value + ")");
            if (_value.info == null) {
                continue;
            }
            //检测是否有奖励没有领取
            let items = [];
            //等级
            for (const level in _value.data.xyuan) {
                if (actHdJiYuan.data.level < parseInt(level)) {
                    continue;
                }
                if (actHdJiYuan.data.lockGift != "") {
                    if (actHdJiYuan.data.xy.indexOf(level) == -1) {
                        items = game_1.default.addArr(items, _value.data.xyuan[level].xy);
                    }
                }
                if (actHdJiYuan.data.pt.indexOf(level) == -1) {
                    items = game_1.default.addArr(items, _value.data.xyuan[level].pt);
                }
            }
            //任务
            for (const dc in _value.data.task) {
                let kind = _value.data.task[dc].kind;
                if (actHdJiYuan.data.taskdc.indexOf(dc) != -1) {
                    continue;
                }
                if (actHdJiYuan.data.taskHook[kind] != null && actHdJiYuan.data.taskHook[kind] >= _value.data.task[dc].need) {
                    items = game_1.default.addArr(items, _value.data.task[dc].items);
                }
            }
            //额外礼包奖励
            if (actHdJiYuan.data.giftOver == 0 && _value.data.giftOver.need > actHdJiYuan.data.gift.length) {
                items = game_1.default.addArr(items, _value.data.giftOver.items);
            }
            if (items.length > 0) {
                items = game_1.default.mergeArr(items);
                let _items = [];
                for (const item of items) {
                    if (item[0] == 1 && item[1] == 805) {
                        continue;
                    }
                    _items.push(item);
                }
                if (_items.length > 0) {
                    let mailModel = MailModel_1.MailModel.getInstance(this.ctx, this.id);
                    await mailModel.sendMail("机缘活动奖励", "机缘活动结束，您有奖励尚未领取，请及时领取奖励。", _items, 1, _etime);
                }
            }
        }
        //兽灵起源
        for (const rdsKey in sevAdok.hdQiYuan) {
            if (info.hdQiYuan[rdsKey] != null) {
                continue;
            }
            isUpdate = true;
            let _sTime = sevAdok.hdQiYuan[rdsKey].stime;
            let hdid = sevAdok.hdQiYuan[rdsKey].hdid;
            let _hdcid = sevAdok.hdQiYuan[rdsKey].hdcid;
            let hdRwd = setting_1.default.getSysRwds(hesid, "hdQiYuan", rdsKey, this.ctx.state.newTime);
            if (hdRwd == null || hdRwd[this.id] == null) {
                continue;
            }
            if (setting_1.default.a_huodongs == null || setting_1.default.a_huodongs[hdid] == null) {
                continue; //已经找不到改活动配置了
            }
            let rid = hdRwd[this.id][0];
            info.hdQiYuan[rdsKey] = rid;
            let title = "兽灵起源排名奖励";
            let content = `兽灵起源活动结束，恭喜大侠在兽灵起源活动中排名第${rid}，获得以下奖励，请及时领取。`;
            let _value = eval("(" + setting_1.default.a_huodongs[hdid].value + ")");
            let items = [];
            for (const rank of _value.data.rank) {
                if (rid >= rank.pm[0] && rid <= rank.pm[1]) {
                    items = rank.items;
                    break;
                }
            }
            await mailModel.sendMail(title, content, items, items.length > 0 ? 1 : 0, _sTime);
            //活动结束 没有领取的奖励 邮件补发
            let items1 = [];
            let actHdQiYuan = await mongodb_1.dbSev.getDataDb().findOne("hd", { id: this.id, kid: "hdQiYuan", hdcid: _hdcid });
            if (actHdQiYuan != null && rdsKey.indexOf(actHdQiYuan.data.hdid) != -1) { //是当前活动
                //如果存在未抽取奖励的次数时，直接邮件补发，单个补发500金币。
                if (actHdQiYuan.data.item2 > 0) {
                    items1.push([1, 2, 500 * actHdQiYuan.data.item2]);
                }
            }
            if (items1.length > 0) {
                let title1 = "兽灵起源活动奖励";
                let content1 = `兽灵起源活动活动结束，您有奖励尚未领取，请及时领取奖励。`;
                await mailModel.sendMail(title1, content1, gameMethod_1.gameMethod.mergeArr(items1), 1, _sTime);
            }
        }
        //天宫乐舞  
        //  rdsHdTianGong_1_20230821   <= bug_ykey
        //1_rdsHdTianGong_1_20230821
        //1_rdsHdTianGong_1_20230821_bu
        let bug_ykey = 'rdsHdTianGong_1_20230821';
        for (const rdsKey in sevAdok.hdTianGong) {
            let ykey = rdsKey.substring(rdsKey.length - 24);
            //有发过 并且 不是BUG期 就不进入
            if (info.hdTianGong[rdsKey] != null && ykey != bug_ykey) { //rdsKey != '1_rdsHdTianGong_1_20230821'
                continue;
            }
            let bugrdsKey = ``;
            let bugrdsKey_bu = ``;
            //4种情况 
            let bugType = 0;
            if (ykey == bug_ykey) {
                //处理BUG数据
                bugrdsKey = rdsKey;
                bugrdsKey_bu = rdsKey + '_bu';
                if (info.hdTianGong[bugrdsKey] == null) {
                    // 1:没领过 来领取 正常发
                    bugType = 1;
                }
                else {
                    if (info.hdTianGong[bugrdsKey_bu] == null) {
                        // 2:领过错误的 来补发 (只发道具补偿 不发排行奖励)
                        bugType = 2;
                    }
                    else {
                        // 3:已经领完正确的
                        bugType = 3;
                        continue;
                    }
                }
            }
            else {
                //0:非BUG期数据
                bugType = 0;
            }
            // bugType 4 种状态
            // 0:非BUG期数据
            // 1:没领过 来领取 正常发
            // 2:领过错误的 来补发
            // 3:已经领完正确的 //不进入 pass
            isUpdate = true;
            let _sTime = sevAdok.hdTianGong[rdsKey].stime;
            let hdid = sevAdok.hdTianGong[rdsKey].hdid;
            let _hdcid = sevAdok.hdTianGong[rdsKey].hdcid;
            //排行奖励
            let hdRwd = setting_1.default.getSysRwds(hesid, "hdTianGong", rdsKey, this.ctx.state.newTime);
            if (hdRwd == null) {
                continue; //排行数据 还没有准备好
            }
            //活动配置
            if (setting_1.default.a_huodongs == null || setting_1.default.a_huodongs[hdid] == null) {
                continue; //已经找不到改活动配置了
            }
            let _value = eval("(" + setting_1.default.a_huodongs[hdid].value + ")");
            if (_value == null) {
                break;
            }
            let cfg = _value.data;
            //记录已经领取
            info.hdTianGong[rdsKey] = -1;
            if (bugType >= 1) {
                info.hdTianGong[bugrdsKey_bu] = 1;
            }
            //活动结束 没有领取的奖励 邮件补发 // 考虑移到 gei info 里面去
            let items1 = [];
            let actHdTianGong = await mongodb_1.dbSev.getDataDb().findOne("hd", { id: this.id, kid: "hdTianGong", hdcid: _hdcid });
            if (actHdTianGong != null) {
                let hdinfo = actHdTianGong.data;
                if (rdsKey.indexOf(hdinfo.weekId) != -1) {
                    //遍历剩余表演道具
                    for (const itemId in hdinfo.items) {
                        if (hdinfo.items[itemId] > 0) {
                            items1.push([Number(cfg.scoreItemId[0]), Number(cfg.scoreItemId[1]), hdinfo.items[itemId] * cfg.playList[itemId].score]);
                        }
                    }
                    if (items1.length > 0) {
                        let title1 = `天宫乐舞活动奖励`;
                        let content1 = `天宫乐舞活动活动结束，您有奖励尚未领取，请及时领取奖励。`;
                        await mailModel.sendMail(title1, content1, gameMethod_1.gameMethod.mergeArr(items1), 1, _sTime);
                    }
                }
            }
            if (hdRwd[this.id] != null && bugType <= 1) { //排行名次备份
                let rid = hdRwd[this.id][0];
                info.hdTianGong[rdsKey] = rid;
                let items = [];
                for (const rank of cfg.rank) {
                    if (rid >= rank.pm[0] && rid <= rank.pm[1]) {
                        items = rank.items;
                        let title = `天宫乐舞排名奖励`;
                        let content = `天宫乐舞活动结束，恭喜大侠在天宫乐舞活动中排名第${rid}，获得以下奖励，请及时领取。`;
                        await mailModel.sendMail(title, content, items, items.length > 0 ? 1 : 0, _sTime);
                        break;
                    }
                }
            }
        }
        // 天宫乐舞 跨服
        for (const rdsKey in sevAdok.hdTianGongKua) {
            if (info.hdTianGongKua[rdsKey] != null) {
                continue;
            }
            isUpdate = true;
            let _sTime = sevAdok.hdTianGongKua[rdsKey].stime;
            let hdid = sevAdok.hdTianGongKua[rdsKey].hdid;
            //从sev 获取 活动开放信息
            let sevTianGongModel = SevTianGongModel_1.SevTianGongModel.getInstance(this.ctx, "1", this.hdcid);
            let sevOpenInfo = await sevTianGongModel.getKidBySid(await this.getHeIdByUuid(this.id));
            let ksid = sevOpenInfo.ksid; //跨服id
            let hdRwd = setting_1.default.getSysRwds(ksid, "hdTianGongKua", rdsKey, this.ctx.state.newTime);
            if (hdRwd == null || hdRwd[this.id] == null) {
                continue;
            }
            if (setting_1.default.a_huodongs == null || setting_1.default.a_huodongs[hdid] == null) {
                continue; //已经找不到改活动配置了
            }
            let rid = hdRwd[this.id][0];
            info.hdTianGongKua[rdsKey] = rid;
            if (sevOpenInfo.open >= 2) { //无权限 参与跨服 不发邮件
                let _value = eval("(" + setting_1.default.a_huodongs[hdid].value + ")");
                let cfg = _value.data;
                let items = [];
                for (const rank of cfg.rank2) {
                    if (rid >= rank.pm[0] && rid <= rank.pm[1]) {
                        items = rank.items;
                        let title = "天宫乐舞跨服排名奖励";
                        let content = `天宫乐舞跨服活动结束，恭喜大侠在天宫乐舞活动中排名第${rid}，获得以下奖励，请及时领取。`;
                        await mailModel.sendMail(title, content, items, items.length > 0 ? 1 : 0, _sTime);
                        break;
                    }
                }
            }
        }
        //鱼灵幻境
        for (const rdsKey in sevAdok.hdHuanJing) {
            if (info.hdHuanJing[rdsKey] != null) {
                continue;
            }
            isUpdate = true;
            let _sTime = sevAdok.hdHuanJing[rdsKey].stime;
            let hdid = sevAdok.hdHuanJing[rdsKey].hdid;
            let _hdcid = sevAdok.hdHuanJing[rdsKey].hdcid;
            let hdRwd = setting_1.default.getSysRwds(hesid, "hdHuanJing", rdsKey, this.ctx.state.newTime);
            if (hdRwd == null || hdRwd[this.id] == null) {
                continue;
            }
            if (setting_1.default.a_huodongs == null || setting_1.default.a_huodongs[hdid] == null) {
                continue; //已经找不到改活动配置了
            }
            let rid = hdRwd[this.id][0];
            info.hdHuanJing[rdsKey] = rid;
            let title = "云中仙居排名奖励";
            let content = `云中仙居活动结束，恭喜大侠在云中仙居活动中排名第${rid}，获得以下奖励，请及时领取。`;
            let _value = eval("(" + setting_1.default.a_huodongs[hdid].value + ")");
            let items = [];
            for (const rank of _value.data.rank) {
                if (rid >= rank.pm[0] && rid <= rank.pm[1]) {
                    items = rank.items;
                    break;
                }
            }
            await mailModel.sendMail(title, content, items, items.length > 0 ? 1 : 0, _sTime);
            //活动结束 没有领取的奖励 邮件补发
            let items1 = [];
            let actHdHuanJing = await mongodb_1.dbSev.getDataDb().findOne("hd", { id: this.id, kid: "hdHuanJing", hdcid: _hdcid });
            if (actHdHuanJing != null && rdsKey.indexOf(actHdHuanJing.data.hdid) != -1) { //是当前活动
                //充值奖励
                for (const kid in _value.data.payRwd) {
                    if (actHdHuanJing.data.payRwd[kid] != null) {
                        continue; //已经领取
                    }
                    if (_value.data.payRwd[kid].need > actHdHuanJing.data.payscore) {
                        continue; //未满足条件
                    }
                    //奖励中去除 特殊道具
                    let rwd = [];
                    for (let i = 0; i < _value.data.payRwd[kid].rwd.length; i++) {
                        if (_value.data.payRwd[kid].rwd[i][1] != 917) {
                            rwd.push(_value.data.payRwd[kid].rwd[i]);
                        }
                    }
                    items1 = game_1.default.addArr(items1, rwd);
                }
                //抽奖道具补发
                if (actHdHuanJing.data.item > 0) {
                    items1.push([1, 2, 500 * actHdHuanJing.data.item]);
                }
            }
            if (items1.length > 0) {
                let title1 = "云中仙居活动奖励";
                let content1 = `云中仙居活动结束，您有奖励尚未领取，请及时领取奖励。`;
                await mailModel.sendMail(title1, content1, gameMethod_1.gameMethod.mergeArr(items1), 1, _sTime);
            }
        }
        //破除心魔
        for (const rdsKey in sevAdok.hdXinMo) {
            if (info.hdXinMo[rdsKey] != null) {
                continue;
            }
            isUpdate = true;
            let _sTime = sevAdok.hdXinMo[rdsKey].stime;
            let hdid = sevAdok.hdXinMo[rdsKey].hdid;
            let _hdcid = sevAdok.hdXinMo[rdsKey].hdcid;
            let hdRwd = setting_1.default.getSysRwds(hesid, "hdXinMo", rdsKey, this.ctx.state.newTime);
            if (hdRwd == null || hdRwd[this.id] == null) {
                continue;
            }
            if (setting_1.default.a_huodongs == null || setting_1.default.a_huodongs[hdid] == null) {
                continue; //已经找不到改活动配置了
            }
            let rid = hdRwd[this.id][0];
            info.hdXinMo[rdsKey] = rid;
            let title = "破除心魔排名奖励";
            let content = `破除心魔活动结束，恭喜大侠在破除心魔活动中排名第${rid}，获得以下奖励，请及时领取。`;
            let _value = eval("(" + setting_1.default.a_huodongs[hdid].value + ")");
            let items = [];
            for (const rank of _value.data.rank) {
                if (rid >= rank.pm[0] && rid <= rank.pm[1]) {
                    items = rank.items;
                    break;
                }
            }
            await mailModel.sendMail(title, content, items, items.length > 0 ? 1 : 0, _sTime);
            //活动结束 没有领取的奖励 邮件补发
            let items1 = [];
            let actHdXinMo = await mongodb_1.dbSev.getDataDb().findOne("hd", { id: this.id, kid: "hdHuanJing", hdcid: _hdcid });
            if (actHdXinMo != null && rdsKey.indexOf(actHdXinMo.data.hdid) != -1) { //是当前活动
                //充值奖励
                for (const kid in _value.data.payRwd) {
                    if (actHdXinMo.data.payRwd[kid] != null) {
                        continue; //已经领取
                    }
                    if (_value.data.payRwd[kid].need > actHdXinMo.data.payscore) {
                        continue; //未满足条件
                    }
                    //奖励中去除 特殊道具
                    let rwd = [];
                    for (let i = 0; i < _value.data.payRwd[kid].rwd.length; i++) {
                        if (_value.data.payRwd[kid].rwd[i][1] != 918) {
                            rwd.push(_value.data.payRwd[kid].rwd[i]);
                        }
                    }
                    items1 = game_1.default.addArr(items1, rwd);
                }
                //抽奖道具补发
                if (actHdXinMo.data.item > 0) {
                    items1.push([1, 2, 500 * actHdXinMo.data.item]);
                }
            }
            if (items1.length > 0) {
                let title1 = "破除心魔活动奖励";
                let content1 = `破除心魔活动活动结束，您有奖励尚未领取，请及时领取奖励。`;
                await mailModel.sendMail(title1, content1, gameMethod_1.gameMethod.mergeArr(items1), 1, _sTime);
            }
        }
        //天道轮回
        for (const hdid in sevAdok.hdLunHui) {
            let _hdcid = sevAdok.hdLunHui[hdid].hdcid;
            let _hid = sevAdok.hdLunHui[hdid].hid;
            let _etime = sevAdok.hdLunHui[hdid].etime;
            if (info.hdLunHui == null) {
                info.hdLunHui = {};
            }
            if (info.hdLunHui[_hid] != null) {
                continue;
            }
            info.hdLunHui[_hid] = this.ctx.state.newTime;
            isUpdate = true;
            let actHdLunHui = await mongodb_1.dbSev.getDataDb().findOne("hd", { id: this.id, kid: "hdLunHui", hdcid: _hdcid });
            if (actHdLunHui == null || actHdLunHui.data.hdid != _hid) { //是当前活动
                continue;
            }
            let _a_huodongs = await mongodb_1.dbSev.getDataDb().findOne("a_huodong", { "id": hdid });
            if (_a_huodongs == null) {
                continue;
            }
            let _value = eval("(" + _a_huodongs.value + ")");
            if (_value.info == null) {
                continue;
            }
            //检测是否有奖励没有领取
            let items = [];
            //配置
            let cfg = _value.data;
            //info
            let hdinfo = actHdLunHui.data;
            for (const id in cfg.list) {
                //是否已完成 未领取
                if (hdinfo.rwd[id] != null) {
                    //已经领取
                    continue;
                }
                //未达成
                if (hdinfo.score < cfg.list[id].need) {
                    //任务未完成
                    continue;
                }
                //奖励
                items = game_1.default.addArr(items, cfg.list[id].rwd);
            }
            //发奖励
            if (items.length > 0) {
                let mailModel = MailModel_1.MailModel.getInstance(this.ctx, this.id);
                //宠物分开独立邮件
                await mailModel.sendMail_autofazhen("天道轮回活动奖励", "天道轮回活动结束，您有奖励尚未领取，请及时领取奖励。", items, 1, _etime);
            }
        }
        //月宫探宝
        for (const hdid in sevAdok.hdYueGong) {
            let _hdcid = sevAdok.hdYueGong[hdid].hdcid;
            let _hid = sevAdok.hdYueGong[hdid].hid;
            let _etime = sevAdok.hdYueGong[hdid].etime;
            if (info.hdYueGong == null) {
                info.hdYueGong = {};
            }
            if (info.hdYueGong[_hid] != null) {
                continue;
            }
            info.hdYueGong[_hid] = this.ctx.state.newTime;
            isUpdate = true;
            if (setting_1.default.a_huodongs == null || setting_1.default.a_huodongs[hdid] == null) {
                continue; //已经找不到改活动配置了
            }
            let _value = eval("(" + setting_1.default.a_huodongs[hdid].value + ")");
            if (_value.data.taobao.need[1] == null) {
                continue;
            }
            let subId = _value.data.taobao.need[1].toString();
            let actItemModel = ActItemModel_1.ActItemModel.getInstance(this.ctx, this.id);
            let actItem = await actItemModel.getInfo();
            if (actItem[subId] == null || actItem[subId] <= 0) {
                continue;
            }
            let count = 500 * actItem[subId];
            //检测是否有奖励没有领取
            let items = [[1, 2, count]];
            await this.ctx.state.master.subItem1([1, parseInt(subId), actItem[subId]]);
            let mailModel = MailModel_1.MailModel.getInstance(this.ctx, this.id);
            let title1 = `${_value.info.title}活动奖励`;
            let content1 = `${_value.info.title}活动结束，您有奖励尚未领取，请及时领取奖励。`;
            await mailModel.sendMail(title1, content1, items, 1, _etime);
        }
        //重阳出游
        for (const hdid in sevAdok.hdChongYang) {
            let _hdcid = sevAdok.hdChongYang[hdid].hdcid;
            let _hid = sevAdok.hdChongYang[hdid].hid;
            let _etime = sevAdok.hdChongYang[hdid].etime;
            if (info.hdChongYang == null) {
                info.hdChongYang = {};
            }
            if (info.hdChongYang[_hid] != null) {
                continue;
            }
            info.hdChongYang[_hid] = this.ctx.state.newTime;
            isUpdate = true;
            if (setting_1.default.a_huodongs == null || setting_1.default.a_huodongs[hdid] == null) {
                continue; //已经找不到改活动配置了
            }
            let _value = eval("(" + setting_1.default.a_huodongs[hdid].value + ")");
            if (_value.data.need[1] == null) {
                continue;
            }
            let subId = _value.data.need[1].toString();
            let actItemModel = ActItemModel_1.ActItemModel.getInstance(this.ctx, this.id);
            let actItem = await actItemModel.getInfo();
            if (actItem[subId] == null || actItem[subId] <= 0) {
                continue;
            }
            let count = 500 * actItem[subId];
            //检测是否有奖励没有领取
            let items = [[1, 2, count]];
            await this.ctx.state.master.subItem1([1, parseInt(subId), actItem[subId]]);
            let mailModel = MailModel_1.MailModel.getInstance(this.ctx, this.id);
            let title1 = `${_value.info.title}活动奖励`;
            let content1 = `${_value.info.title}活动结束，您有奖励尚未领取，请及时领取奖励。`;
            await mailModel.sendMail(title1, content1, items, 1, _etime);
        }
        //	山河庆典
        for (const hdid in sevAdok.hdShanhe) {
            let _hdcid = sevAdok.hdShanhe[hdid].hdcid;
            let _hid = sevAdok.hdShanhe[hdid].hid;
            let _etime = sevAdok.hdShanhe[hdid].etime;
            if (info.hdShanhe == null) {
                info.hdShanhe = {};
            }
            if (info.hdShanhe[_hid] != null) {
                continue;
            }
            info.hdShanhe[_hid] = this.ctx.state.newTime;
            isUpdate = true;
            if (setting_1.default.a_huodongs == null || setting_1.default.a_huodongs[hdid] == null) {
                continue; //已经找不到改活动配置了
            }
            let _value = eval("(" + setting_1.default.a_huodongs[hdid].value + ")");
            if (_value == null || _value.data == null || _value.data.qingdian == null || _value.data.qingdian.need == null || _value.data.qingdian.need[1] == null) {
                continue;
            }
            let subId = _value.data.qingdian.need[1].toString();
            let actItemModel = ActItemModel_1.ActItemModel.getInstance(this.ctx, this.id);
            let actItem = await actItemModel.getInfo();
            if (actItem[subId] == null || actItem[subId] <= 0) {
                continue;
            }
            let count = 500 * actItem[subId];
            //检测是否有奖励没有领取
            let items = [[1, 2, count]];
            await this.ctx.state.master.subItem1([1, parseInt(subId), actItem[subId]]);
            let mailModel = MailModel_1.MailModel.getInstance(this.ctx, this.id);
            let title1 = "山河庆典活动奖励";
            let content1 = `山河庆典活动结束，您有奖励尚未领取，请及时领取奖励。`;
            await mailModel.sendMail(title1, content1, items, 1, _etime);
        }
        //累计充值礼包
        for (const hdid in sevAdok.hdChargeTotal) {
            let _hdcid = sevAdok.hdChargeTotal[hdid].hdcid;
            let _hid = sevAdok.hdChargeTotal[hdid].hid;
            let _etime = sevAdok.hdChargeTotal[hdid].etime;
            if (info.hdChargeTotal == null) {
                info.hdChargeTotal = {};
            }
            if (info.hdChargeTotal[_hid] != null) {
                continue;
            }
            info.hdChargeTotal[_hid] = this.ctx.state.newTime;
            isUpdate = true;
            let actHdChargeTotal = await mongodb_1.dbSev.getDataDb().findOne("hd", { id: this.id, kid: "hdChargeTotal", hdcid: _hdcid });
            if (actHdChargeTotal == null || actHdChargeTotal.data.hdid != _hid) { //是当前活动
                continue;
            }
            let _a_huodongs = await mongodb_1.dbSev.getDataDb().findOne("a_huodong", { "id": hdid });
            if (_a_huodongs == null) {
                continue;
            }
            let _value = eval("(" + _a_huodongs.value + ")");
            if (_value.info == null) {
                continue;
            }
            //检测是否有奖励没有领取
            let items = [];
            //配置
            let cfg = _value.data;
            //info
            let hdinfo = actHdChargeTotal.data;
            for (const id in cfg.list) {
                //是否已完成 未领取
                if (hdinfo.rwd[id] != null) {
                    //已经领取
                    continue;
                }
                //未达成
                if (hdinfo.score < cfg.list[id].need) {
                    //任务未完成
                    continue;
                }
                //奖励
                items = game_1.default.addArr(items, cfg.list[id].rwd);
            }
            //发奖励
            if (items.length > 0) {
                let mailModel = MailModel_1.MailModel.getInstance(this.ctx, this.id);
                //宠物分开独立邮件
                await mailModel.sendMail_autofazhen("累计充值活动奖励", "累计充值活动结束，您有奖励尚未领取，请及时领取奖励。", items, 1, _etime);
            }
        }
        //最强斗罗 每日
        for (const hdcid_dayid in sevAdok.hdDouLuo) {
            let _hdcid = sevAdok.hdDouLuo[hdcid_dayid].hdcid;
            let hdid = sevAdok.hdDouLuo[hdcid_dayid].hdid;
            let _etime = sevAdok.hdDouLuo[hdcid_dayid].etime; //当日结束时间
            if (info.hdDouLuo == null) {
                info.hdDouLuo = {};
            }
            if (info.hdDouLuo[hdcid_dayid] != null) {
                continue;
            }
            let ksid = "";
            if (sevAdok.hdDouLuo[hdcid_dayid].kuaid != null && sevAdok.hdDouLuo[hdcid_dayid].kuaid != "") {
                ksid = sevAdok.hdDouLuo[hdcid_dayid].kuaid;
            }
            else {
                //获取斗罗跨服ID
                let sevDouLuoModel = SevDouLuoModel_1.SevDouLuoModel.getInstance(this.ctx, "1", _hdcid);
                ksid = await sevDouLuoModel.getDLKidBySid(this.ctx.state.sid);
            }
            //去获取排行备份
            let hdRwd = setting_1.default.getSysRwds(ksid, "hdDouLuoDay", hdcid_dayid, this.ctx.state.newTime);
            if (hdRwd == null || hdRwd[this.id] == null) {
                if (hesid != this.ctx.state.sid) {
                    let sevAdokModelben = SevAdokModel_1.SevAdokModel.getInstance(this.ctx, this.ctx.state.sid);
                    let sevAdokben = await sevAdokModelben.getInfo();
                    if (sevAdokben.hdDouLuo[hdcid_dayid] == null) {
                        continue;
                    }
                    ksid = sevAdokben.hdDouLuo[hdcid_dayid].kuaid;
                    hdRwd = setting_1.default.getSysRwds(ksid, "hdDouLuoDay", hdcid_dayid, this.ctx.state.newTime);
                    if (hdRwd == null || hdRwd[this.id] == null) {
                        continue;
                    }
                }
                else {
                    continue;
                }
            }
            if (setting_1.default.a_huodongs == null || setting_1.default.a_huodongs[hdid] == null) { //??
                continue; //已经找不到改活动配置了
            }
            let _value = eval("(" + setting_1.default.a_huodongs[hdid].value + ")");
            // let rid = hdRwd[this.id][0]
            let rid = hdRwd[this.id][1]; //名次= 积分 而不是真实名次
            info.hdDouLuo[hdcid_dayid] = rid; //记录已领取奖励
            isUpdate = true;
            for (const rank of _value.data.rankDay) {
                if (rid >= rank.pm[0] && rid <= rank.pm[1]) {
                    let title = "今日最强斗罗奖励";
                    let content = `仙友今日在最强斗罗活动中大显神通，排名第${rid}，特送上好礼。`;
                    await mailModel.sendMail(title, content, rank.items, 1, _etime);
                    break;
                }
            }
            //周奖励
            if (game_1.default.weekId(_etime + 1) == 1) { //周一 发周日的 赛季奖励
                for (const rank of _value.data.rankWeek) {
                    if (rid >= rank.pm[0] && rid <= rank.pm[1]) {
                        let title = "本周最强斗罗奖励";
                        let content = `仙友本周在最强斗罗活动中大显神通，排名第${rid}，特送上好礼。`;
                        await mailModel.sendMail(title, content, rank.items, 1, _etime);
                        break;
                    }
                }
            }
        }
        //登神榜
        for (const rdsKey in sevAdok.hdDengShenBang) {
            //活动分组ID
            let _hdcid = sevAdok.hdDengShenBang[rdsKey].hdcid;
            //活动ID
            let hdid = sevAdok.hdDengShenBang[rdsKey].hdid;
            //奖励过期时间
            let _etime = sevAdok.hdDengShenBang[rdsKey].etime;
            //跨服ID
            let ksid = sevAdok.hdDengShenBang[rdsKey].kuaid;
            if (info.hdDengShenBang == null) {
                info.hdDengShenBang = {};
            }
            //排行奖励
            let hdRwd = setting_1.default.getSysRwds(ksid, "hdDengShenBang", rdsKey, this.ctx.state.newTime);
            if (info.hdDengShenBang[rdsKey] != null || !hdRwd || setting_1.default.a_huodongs == null || setting_1.default.a_huodongs[hdid] == null) {
                continue;
            }
            let _value = eval("(" + setting_1.default.a_huodongs[hdid].value + ")");
            let type = rdsKey.split("_")[1];
            //公会
            if (type === Xys.RdsClub.rdsClubDengShenBang) {
                //获取玩家公会ID
                let actClubModel = ActClubModel_1.ActClubModel.getInstance(this.ctx, this.id);
                let _sid = await actClubModel.getClubId();
                let iTime = await actClubModel.getItime();
                if (!_sid || _sid === "" || !hdRwd[_sid] || game_1.default.getNowTime() - iTime <= 86400) {
                    continue;
                }
                let rid = hdRwd[_sid][0];
                info.hdDengShenBang[rdsKey] = rid; //记录已领取奖励
                isUpdate = true;
                for (const rank of _value.data.rank3) {
                    if (rid >= rank.pm[0] && rid <= rank.pm[1]) {
                        let title = `登神榜仙盟排名奖励`;
                        let content = `您所在的仙盟在登神榜活动中获得第${rid}名，请及时领取奖励。`;
                        await mailModel.sendMail(title, content, rank.items, 1, _etime);
                        break;
                    }
                }
            }
            else {
                isUpdate = true;
                let hdDengShenBangModel = HdDengShenBangModel_1.HdDengShenBangModel.getInstance(this.ctx, this.id);
                if (!hdRwd[this.id] || !hdRwd[this.id][0] || !hdRwd[this.id][1]) {
                    continue;
                }
                let score = hdRwd[this.id][1];
                let state = await hdDengShenBangModel.getState(score);
                let stateName = _value.data.stateInfo[state].title;
                let rid = hdRwd[this.id][0];
                if (state === _value.data.stateInfo.length - 1) {
                    //个人榜 - 圣王境
                    for (const rank of _value.data.rank) {
                        if (rid >= rank.pm[0] && rid <= rank.pm[1]) {
                            let title = `登神榜个人排名奖励`;
                            let content = `恭喜您在登神榜活动中获得${stateName}第${rid}名，请及时领取奖励。`;
                            await mailModel.sendMail(title, content, rank.items, 1, _etime);
                            break;
                        }
                    }
                    info.hdDengShenBang[rdsKey] = rid; //记录已领取奖励
                }
                else {
                    //个人榜 - 其余镜
                    for (const rank of _value.data.rank2) {
                        if (rank.pm[0] === state) {
                            let title = `登神榜个人排名奖励`;
                            let content = `恭喜您在登神榜活动中获得${stateName}，请及时领取奖励。`;
                            await mailModel.sendMail(title, content, rank.items, 1, _etime);
                            break;
                        }
                    }
                    info.hdDengShenBang[rdsKey] = -1; //记录已领取奖励
                }
            }
        }
        if (isUpdate) {
            await this.update(info);
        }
    }
    /**
     * 发送新邮件
     * @param a_mail
     */
    async sendMail(a_mail) {
        let mailModel = MailModel_1.MailModel.getInstance(this.ctx, this.id);
        await mailModel.sendMail(a_mail.title, a_mail.content, a_mail.items, a_mail.type == null ? 1 : a_mail.type);
    }
}
exports.ActRwdModel = ActRwdModel;
//# sourceMappingURL=ActRwdModel.js.map