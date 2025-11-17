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
exports.UserModel = void 0;
//继承于基类
const AModel_1 = require("../AModel");
const Xys = __importStar(require("../../../common/Xys"));
const ts_md5_1 = require("ts-md5");
const game_1 = __importDefault(require("../../util/game"));
const master_1 = require("../../util/master");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const cache_1 = __importDefault(require("../../util/cache"));
const setting_1 = __importDefault(require("../../crontab/setting"));
const ActRwdModel_1 = require("../act/ActRwdModel");
const hook_1 = require("../../util/hook");
const gameMethod_1 = require("../../../common/gameMethod");
const ActChiBangModel_1 = require("../act/ActChiBangModel");
const ActEquipModel_1 = require("../act/ActEquipModel");
const ActChengHModel_1 = require("../act/ActChengHModel");
const ActFazhenModel_1 = require("../act/ActFazhenModel");
const ActClubModel_1 = require("../act/ActClubModel");
const SevClubModel_1 = require("../sev/SevClubModel");
const RdsUserModel_1 = require("../redis/RdsUserModel");
const ActShengQiModel_1 = require("../act/ActShengQiModel");
const ActBaoShiModel_1 = require("../act/ActBaoShiModel");
const PlayerModel_1 = require("../player/PlayerModel");
const SevPvdModel_1 = require("../sev/SevPvdModel");
const ActPvdModel_1 = require("../act/ActPvdModel");
const ActShopFushiCModel_1 = require("../act/ActShopFushiCModel");
const ActShopFushiGModel_1 = require("../act/ActShopFushiGModel");
const ActFuShiModel_1 = require("../act/ActFuShiModel");
const HdLianchongModel_1 = require("../hd/HdLianchongModel");
const tool_1 = require("../../util/tool");
const HdChouModel_1 = require("../hd/HdChouModel");
const HdJiYuanModel_1 = require("../hd/HdJiYuanModel");
const mongodb_1 = require("../../util/mongodb");
const ActGiftDtModel_1 = require("../act/ActGiftDtModel");
const ActDongTianModel_1 = require("../act/ActDongTianModel");
const ActClubMjModel_1 = require("../act/ActClubMjModel");
const HdHefuqdModel_1 = require("../hd/HdHefuqdModel");
const HdChumoModel_1 = require("../hd/HdChumoModel");
const ActZhaoCaiModel_1 = require("../act/ActZhaoCaiModel");
const HdZixuanModel_1 = require("../hd/HdZixuanModel");
const ActLonggongModel_1 = require("../act/ActLonggongModel");
const HdNewJiYuanModel_1 = require("../hd/HdNewJiYuanModel");
const ActXianlvModel_1 = require("../act/ActXianlvModel");
const HdDouLuoModel_1 = require("../hd/HdDouLuoModel");
const ActJinxiuModel_1 = require("../act/ActJinxiuModel");
const HdChongBangModel_1 = require("../hd/HdChongBangModel");
const YlWechat_1 = __importDefault(require("../../sdk/YlWechat"));
const HdYueGongModel_1 = require("../hd/HdYueGongModel");
const HdHuaLianModel_1 = require("../hd/HdHuaLianModel");
const HdShanheModel_1 = require("../hd/HdShanheModel");
const ActLiuDaoModel_1 = require("../act/ActLiuDaoModel");
const HdChongYangModel_1 = require("../hd/HdChongYangModel");
const HdDayTeJiaModel_1 = require("../hd/HdDayTeJiaModel");
const ActShopDiaMondModel_1 = require("../act/ActShopDiaMondModel");
const ActWanXiangModel_1 = require("../act/ActWanXiangModel");
const ActJingGuaiModel_1 = require("../act/ActJingGuaiModel");
const ActDaoyouModel_1 = require("../act/ActDaoyouModel");
const HdDengShenBangModel_1 = require("../hd/HdDengShenBangModel");
/**
 * 角色模块
 */
class UserModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "user"; //数据库表名
        this.kid = "userInfo"; //用于存储key 和  输出1级key
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
            uid: "",
            uuid: "",
            sid: "",
            name: "",
            ncount: 0,
            sex: 0,
            head: "",
            wxhead: "",
            tzid: "",
            level: 1,
            exp: 0,
            lastlogin: this.ctx.state.newTime,
            regtime: this.ctx.state.newTime,
            lang: "zh",
            token: "",
            s_ver: 0,
            iscz: 0,
            ver: 1,
            hfVer: "",
            expVer: "1",
            yyzj: 0 //1是运营组件玩家
        };
    }
    /**
     * 兼容老玩家钩子
     */
    async loginIscz() {
        let info = await this.getInfo();
        if (info.ver == null) {
            info.ver = 1;
            info.iscz = 0;
            let backs = await mongodb_1.dbSev.getDataDb().find("kind10", { "uuid": this.id });
            for (const back of backs) {
                if (back.status == 0) {
                    continue;
                }
                if (back.createAt == 0) {
                    continue;
                }
                info.iscz += back.rmb;
            }
            await this.update(info);
        }
        if (info.expVer != "1") {
            info.expVer = "1";
            if (info.level > 100) {
                for (let index = 100; index < info.level; index++) {
                    info.exp += gameCfg_1.default.userInfo.getItemCtx(this.ctx, index.toString()).oldexp;
                }
                info.level = 100;
                //自动升级
                let cfgUserInfo = gameCfg_1.default.userInfo.getItem(info.level.toString());
                let cfgUserInfoNext = gameCfg_1.default.userInfo.getItem((info.level + 1).toString());
                while (cfgUserInfoNext != null && cfgUserInfo != null && cfgUserInfo.exp > 0 && cfgUserInfo.exp <= info.exp) {
                    info.exp -= cfgUserInfo.exp;
                    info.level += 1;
                    this.ctx.state.level = info.level;
                    await hook_1.hookNote(this.ctx, "userLevel", info.level);
                    cfgUserInfo = gameCfg_1.default.userInfo.getItem(info.level.toString());
                    cfgUserInfoNext = gameCfg_1.default.userInfo.getItem((info.level + 1).toString());
                }
            }
            await this.update(info);
        }
    }
    /**
     * 创建角色信息
     * @param sid
     * @param ip
     */
    async doInit(uid, uuid, sid) {
        let heid = setting_1.default.getHeid(sid);
        let hfAt = "";
        let cfgSysHefu = setting_1.default.getSetting("1", "sys_hefu");
        if (cfgSysHefu != null && cfgSysHefu.list[heid] != null) {
            hfAt = cfgSysHefu.list[heid].newVer;
        }
        let actInfo = await this.getInfo();
        actInfo.uid = uid;
        actInfo.uuid = uuid;
        actInfo.sid = sid;
        actInfo.name = "";
        actInfo.hfVer = hfAt;
        await this.update(actInfo);
        this.ctx.state.regtime = actInfo.regtime;
        this.ctx.state.level = actInfo.level;
        this.ctx.state.uid = uid;
        await hook_1.hookNote(this.ctx, "userLevel", 1);
        await hook_1.hookNote(this.ctx, "lodingdays", 1);
        YlWechat_1.default.shangbaoUser_info(this.ctx, uuid);
    }
    async getInfo() {
        let info = await super.getInfo();
        if (info.hfVer == null) {
            info.hfVer = "";
        }
        if (info.ncount == null) {
            info.ncount = 0;
        }
        if (info.tzid == null) {
            info.tzid = "";
        }
        // if(info.name == ""){
        //     info.name = "初心者"+this.id
        // }
        if (info.sid != "") {
            let heid = setting_1.default.getHeid(info.sid);
            let cfgSysHefu = setting_1.default.getSetting("1", "sys_hefu");
            if (cfgSysHefu != null && cfgSysHefu.list[heid] != null) {
                let hfAt = cfgSysHefu.list[heid].newVer;
                let qz = 'S' + info.sid + '服*';
                if (info.hfVer != hfAt && info.name.indexOf(qz) == -1) {
                    info.hfVer = hfAt;
                    info.name = qz + info.name;
                }
            }
        }
        return info;
    }
    /**
     * 设置token
     */
    async setToken() {
        let actInfo = await this.getInfo();
        actInfo.token = ts_md5_1.Md5.hashStr(this.id + this.ctx.state.newTime + game_1.default.rand(1, 10000)).toString();
        await this.update(actInfo);
    }
    /**
     * 构造输出信息
     * @returns
     */
    async getOutPut() {
        let info = await this.getInfo();
        return {
            uuid: this.id,
            sid: info.sid,
            name: info.name == "" ? "初心者" + this.id : info.name,
            ncount: info.ncount,
            sex: info.sex,
            head: info.head,
            wxhead: info.wxhead,
            tzid: info.tzid,
            level: info.level,
            exp: info.exp,
            lastlogin: info.lastlogin,
            regtime: info.regtime,
            lang: info.lang,
            token: info.token,
            iscz: info.iscz
        };
    }
    /**
     * 设置是否充值
     */
    async setIscz(count) {
        let info = await this.getInfo();
        if (info.iscz == null) {
            info.iscz = 0;
        }
        info.iscz += count;
        await this.update(info);
    }
    /**
     * 设置名字
     */
    async setName(name) {
        let info = await this.getInfo();
        info.name = name;
        info.ncount += 1;
        await this.update(info);
        YlWechat_1.default.shangbaoUser_info(this.ctx, this.id);
    }
    /**
     * 设置微信头像
     */
    async setWxhead(str) {
        let info = await this.getInfo();
        info.wxhead = str;
        await this.update(info);
    }
    /**
     * 设置版本号
     */
    async set_s_ver() {
        let info = await this.getInfo();
        let cfgSystem = setting_1.default.getSetting("1", "system");
        if (cfgSystem != null && cfgSystem.s_ver != null) {
            info.s_ver = cfgSystem.s_ver;
            await this.update(info);
        }
    }
    /**
     * 检测版本号
     */
    async check_s_ver() {
        let cfgSystem = setting_1.default.getSetting("1", "system");
        if (cfgSystem != null && cfgSystem.s_ver != null) {
            let info = await this.getInfo();
            if (info.s_ver != cfgSystem.s_ver) {
                this.ctx.throw(502, "服务器更新，请重新登陆！");
            }
        }
    }
    /**
     * 微信授权
     */
    async wechatSq(nickname, headimgurl) {
        let info = await this.getInfo();
        if (info.name == "") {
            info.name = nickname;
        }
        info.head = headimgurl;
        await this.update(info);
    }
    /**
     * 增加经验
     */
    async addExp(exp) {
        let info = await this.getInfo();
        if (exp == null) {
            return;
        }
        let oldLv = info.level;
        info.exp += exp;
        //自动升级
        let cfgUserInfo = gameCfg_1.default.userInfo.getItem(info.level.toString());
        let cfgUserInfoNext = gameCfg_1.default.userInfo.getItem((info.level + 1).toString());
        while (cfgUserInfoNext != null && cfgUserInfo != null && cfgUserInfo.exp > 0 && cfgUserInfo.exp <= info.exp) {
            info.exp -= cfgUserInfo.exp;
            info.level += 1;
            this.ctx.state.level = info.level;
            await hook_1.hookNote(this.ctx, "userLevel", info.level);
            cfgUserInfo = gameCfg_1.default.userInfo.getItem(info.level.toString());
            cfgUserInfoNext = gameCfg_1.default.userInfo.getItem((info.level + 1).toString());
        }
        await this.update(info);
    }
    /**
     * 获取他人信息
     * @returns
     */
    async getFUserInfo() {
        let info = await this.getInfo();
        //称号
        let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(this.ctx, this.id);
        let actChengH = await actChengHModel.getInfo();
        //获取工会名字
        let actClubModel = ActClubModel_1.ActClubModel.getInstance(this.ctx, this.id);
        let clubId = (await actClubModel.getBaseInfo()).clubId;
        let clubName = "";
        if (clubId != null) {
            let sevClubModel = SevClubModel_1.SevClubModel.getInstance(this.ctx, clubId);
            let sevClub = await sevClubModel.getBaseInfo();
            clubName = sevClub.name;
        }
        //翅膀
        let actChiBangModel = ActChiBangModel_1.ActChiBangModel.getInstance(this.ctx, this.id);
        let actChiBang = await actChiBangModel.getInfo();
        return {
            uid: info.uid.toString(),
            uuid: this.id,
            sid: info.sid,
            name: info.name == "" ? "初心者" + this.id : info.name,
            sex: info.sex,
            head: info.head,
            wxhead: info.wxhead,
            tzid: info.tzid,
            level: info.level,
            lastlogin: info.lastlogin,
            clubName: clubName,
            chid: actChengH.chuan,
            cbid: actChiBang.hh,
        };
    }
    /**
     * 获取他人信息
     * @returns
     */
    async getFUserAll(realId = this.id) {
        let info = await this.getInfo();
        //获取工会名字
        let actClubModel = ActClubModel_1.ActClubModel.getInstance(this.ctx, this.id);
        let actClub = await actClubModel.getBaseInfo();
        let clubName = "";
        if (actClub != null && actClub.clubId != null) {
            let sevClubModel = SevClubModel_1.SevClubModel.getInstance(this.ctx, actClub.clubId);
            let sevClub = await sevClubModel.getBaseInfo();
            clubName = sevClub.name;
        }
        //穿着
        let actEquipModel = ActEquipModel_1.ActEquipModel.getInstance(this.ctx, this.id);
        let actEquip = await actEquipModel.getBaseInfo();
        //称号
        let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(this.ctx, this.id);
        let actChengH = await actChengHModel.getBaseInfo();
        //翅膀
        let actChiBangModel = ActChiBangModel_1.ActChiBangModel.getInstance(this.ctx, this.id);
        let actChiBang = await actChiBangModel.getBaseInfo();
        //法阵
        let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(this.ctx, this.id);
        let actFazhen = await actFazhenModel.getBaseInfo();
        //圣器
        let actShengQiModel = ActShengQiModel_1.ActShengQiModel.getInstance(this.ctx, this.id);
        let actShengQi = await actShengQiModel.getBaseInfo();
        //宝石
        let actBaoShiModel = ActBaoShiModel_1.ActBaoShiModel.getInstance(this.ctx, this.id);
        let actBaoShi = await actBaoShiModel.getBaseInfo();
        //符石
        let actFuShiModel = ActFuShiModel_1.ActFuShiModel.getInstance(this.ctx, this.id);
        let actFuShi = await actFuShiModel.getBaseInfo();
        //洞天
        let actDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(this.ctx, this.id);
        let actDongTian = await actDongTianModel.getBaseInfo();
        //公会秘笈
        let actClubMjModel = ActClubMjModel_1.ActClubMjModel.getInstance(this.ctx, this.id);
        let actClubMj = await actClubMjModel.getBaseInfo();
        //锦绣坊
        let actJinxiuModel = ActJinxiuModel_1.ActJinxiuModel.getInstance(this.ctx, this.id);
        let actJinxiu = await actJinxiuModel.getBaseInfo();
        //仙侣
        let actXianlvModel = ActXianlvModel_1.ActXianlvModel.getInstance(this.ctx, this.id);
        let actXianlv = await actXianlvModel.getBaseInfo();
        //万象
        let actWanXiangModel = ActWanXiangModel_1.ActWanXiangModel.getInstance(this.ctx, this.id);
        let actWanXiang = await actWanXiangModel.getBaseInfo();
        //精怪
        let actJingGuaiModel = ActJingGuaiModel_1.ActJingGuaiModel.getInstance(this.ctx, this.id);
        let actJingGuai = await actJingGuaiModel.getBaseInfo();
        let score = 0;
        if (this.id != null) {
            let rdsUserModel = await new RdsUserModel_1.RdsUserModel("rdsJjc", 'x', await this.getHeIdByUuid(this.id), tool_1.tool.jjcWeekId(this.ctx.state.newTime));
            if (realId != this.id) {
                score = Math.ceil(parseFloat(await rdsUserModel.zScore(realId)));
            }
            else {
                score = Math.ceil(parseFloat(await rdsUserModel.zScore(this.id)));
            }
        }
        let heid = setting_1.default.getHeid(info.sid);
        let dlRid = "";
        //活动 - 最强斗罗
        let cfgHdDouLuo = setting_1.default.getHuodong2(heid, "hdDouLuo");
        if (cfgHdDouLuo != null) {
            for (const _hdcid in cfgHdDouLuo) {
                //获取当前 hdcid 和 重置ID 用前端传来的 hdcid
                let hdDouLuoModel = HdDouLuoModel_1.HdDouLuoModel.getInstance(this.ctx, this.id, "1");
                //获取重置ID
                let douLuoInfo = await hdDouLuoModel.getBaseInfo();
                //排行
                let rdsUserModel_rdsDouLuo = RdsUserModel_1.RdsUserModel.getInstance(this.ctx, Xys.RdsUser.rdsDouLuo, douLuoInfo.ksid, "1", douLuoInfo.weekId);
                dlRid = await rdsUserModel_rdsDouLuo.zScore(this.id);
                if (dlRid == null) {
                    dlRid = "501";
                }
                break;
            }
        }
        let sevBack = {
            actEquip: { a: actEquip },
            actChengH: actChengH,
            actChiBang: actChiBang,
            actFazhen: actFazhen,
            rdsJjcMy: { rid: 0, score: score },
            actShengQi: { a: actShengQi },
            actBaoShi: actBaoShi,
            actFuShi: { a: actFuShi },
            actDongTian: actDongTian,
            actClubMj: actClubMj,
            actJinxiu: actJinxiu,
            actWanXiang: actWanXiang,
            actJingGuai: actJingGuai,
            actXianlv: actXianlv,
            rdsDouLuoMy: { "1": { rid: Number(dlRid), score: 0 } },
        };
        if (parseInt(realId) < 100000) {
            //竞技场机器人
            let cfg = gameCfg_1.default.jjcNpc.getItemCtx(this.ctx, realId);
            let sevBackNpc = gameMethod_1.gameMethod.objCopy(sevBack);
            if (sevBackNpc.actChiBang != null) {
                sevBackNpc.actChiBang.hh = cfg.jianling[0].toString();
                sevBackNpc.actChiBang.id = cfg.jianling[1];
            }
            if (cfg.shouling.length > 0) {
                if (sevBackNpc.actFazhen != null) {
                    sevBackNpc.actFazhen.list["1"] = {
                        fzid: cfg.shouling[0].toString(),
                        saveId: cfg.shouling[1],
                        otherEps: {},
                        zaddp: 0,
                        faddp: 0
                    };
                    sevBackNpc.actFazhen.useGzId = "1";
                }
            }
            return {
                uid: realId,
                uuid: realId,
                sid: this.ctx.state.sid,
                name: cfg.name,
                sex: 0,
                head: "",
                wxhead: "",
                level: cfg.level,
                lastlogin: this.ctx.state.newTime,
                clubName: "",
                tzid: "",
                chid: "1",
                cbid: "1",
                sevBack: sevBackNpc,
            };
        }
        else {
            return {
                uid: info.uid,
                uuid: this.id,
                sid: info.sid,
                name: info.name == "" ? "初心者" + this.id : info.name,
                sex: info.sex,
                head: info.head,
                wxhead: info.wxhead,
                tzid: info.tzid,
                level: info.level,
                lastlogin: info.lastlogin,
                clubName: clubName,
                chid: actChengH.chuan,
                cbid: actChiBang.hh,
                sevBack: sevBack,
            };
        }
    }
    /**
     * 获取战斗属性
     */
    async getFightEps(isPvp = false) {
        //穿着
        let actEquipModel = ActEquipModel_1.ActEquipModel.getInstance(this.ctx, this.id);
        let actEquip = await actEquipModel.getInfo();
        //称号
        let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(this.ctx, this.id);
        let actChengH = await actChengHModel.getInfo();
        //翅膀
        let actChiBangModel = ActChiBangModel_1.ActChiBangModel.getInstance(this.ctx, this.id);
        let actChiBang = await actChiBangModel.getInfo();
        //法阵
        let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(this.ctx, this.id);
        let actFazhen = await actFazhenModel.getInfo();
        //圣器
        let actShengQiModel = ActShengQiModel_1.ActShengQiModel.getInstance(this.ctx, this.id);
        let actShengQi = await actShengQiModel.getInfo();
        //宝石
        let actBaoShiModel = ActBaoShiModel_1.ActBaoShiModel.getInstance(this.ctx, this.id);
        let actBaoShi = await actBaoShiModel.getInfo();
        //符石
        let actFuShiModel = ActFuShiModel_1.ActFuShiModel.getInstance(this.ctx, this.id);
        let actFuShi = await actFuShiModel.getInfo();
        //洞天
        let actDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(this.ctx, this.id);
        let actDongTian = await actDongTianModel.getInfo();
        //公会秘笈
        let actClubMjModel = ActClubMjModel_1.ActClubMjModel.getInstance(this.ctx, this.id);
        let actClubMj = await actClubMjModel.getInfo();
        //仙侣
        let actXianlvModel = ActXianlvModel_1.ActXianlvModel.getInstance(this.ctx, this.id);
        let actXianlv = await actXianlvModel.getInfo();
        //锦绣坊
        let actJinxiuModel = ActJinxiuModel_1.ActJinxiuModel.getInstance(this.ctx, this.id);
        let actJinxiu = await actJinxiuModel.getInfo();
        //万象
        let actWanXiangModel = ActWanXiangModel_1.ActWanXiangModel.getInstance(this.ctx, this.id);
        let actWanXiang = await actWanXiangModel.getInfo();
        //是否要显示怒气值
        let isnq = gameMethod_1.gameMethod.isEmpty(actWanXiang.mfZhan["1"]) ? 0 : 1;
        //精怪
        let actJingGuaiModel = ActJingGuaiModel_1.ActJingGuaiModel.getInstance(this.ctx, this.id);
        let actJingGuai = await actJingGuaiModel.getInfo();
        //道友
        let daoyouModel = ActDaoyouModel_1.ActDaoyouModel.getInstance(this.ctx, this.id);
        let actDaoyou = await daoyouModel.getInfo();
        let sevBack = {
            actEquip: { a: actEquip },
            actChengH: actChengH,
            actChiBang: actChiBang,
            actFazhen: actFazhen,
            actShengQi: { a: actShengQi },
            actBaoShi: actBaoShi,
            actFuShi: { a: actFuShi },
            actDongTian: actDongTian,
            actClubMj: actClubMj,
            actXianlv: actXianlv,
            actJinxiu: actJinxiu,
            actWanXiang: actWanXiang,
            actJingGuai: actJingGuai,
            actDaoyou: actDaoyou,
        };
        let eps = gameMethod_1.gameMethod.ep_fight(sevBack);
        if (isPvp) {
            let actDaoyouModel = ActDaoyouModel_1.ActDaoyouModel.getInstance(this.ctx, this.id);
            let rate8 = await actDaoyouModel.getDaoYouSkill("8", false);
            let rate9 = await actDaoyouModel.getDaoYouSkill("9", false);
            eps.zengshang += rate8;
            eps.jianshang += rate8;
            eps.hsbaoji += rate9;
            eps.hsfanji += rate9;
            eps.hslianji += rate9;
            eps.hsxixue += rate9;
            eps.hsjiyun += rate9;
            eps.hsshanbi += rate9;
        }
        let xleps = gameMethod_1.gameMethod.ep_xianlv(sevBack, "0");
        //后台加个牛逼的统计呗。就是支持选择区服，或所有区服的攻击力（算平均值）。按等级排序。可以选择充值的区间。
        let info = await this.getInfo();
        mongodb_1.dbSev.getFlowDb().update("Smaidian_atk", {
            uuid: this.id,
        }, {
            uuid: this.id,
            heid: await this.getHeIdByUuid(this.id),
            name: info.name,
            level: info.level,
            iscz: info.iscz,
            atk: eps.atk,
            def: eps.def,
            hp_max: eps.hp_max,
            speed: eps.speed,
            time: this.ctx.state.newTime
        }, true);
        //万象技能
        let wxSk = {};
        //灵脉
        let lingmai = {};
        for (const mpid in actWanXiang.mpList) {
            if (actWanXiang.mpList[mpid].lingmai == "") {
                continue;
            }
            if (lingmai[actWanXiang.mpList[mpid].lingmai] == null) {
                lingmai[actWanXiang.mpList[mpid].lingmai] = 0;
            }
            lingmai[actWanXiang.mpList[mpid].lingmai] += 1;
        }
        for (const lmid in lingmai) {
            let cfglm = gameCfg_1.default.wanxiangLingmai.getItemCtx(this.ctx, lmid, lingmai[lmid].toString());
            wxSk["wxlm_" + lmid] = cfglm.cs;
        }
        //技能
        let czlist = [];
        for (const type in actWanXiang.mfZhan) {
            if (actWanXiang.mfZhan[type] != "") {
                czlist.push(actWanXiang.mfZhan[type]);
            }
        }
        for (const xfid in actWanXiang.mfList) {
            if (czlist.indexOf(xfid) == -1) {
                continue;
            }
            wxSk["wxxf_" + xfid] = [0, 0, 0, 0, 0]; //初始化
            let step = actWanXiang.mfList[xfid].step;
            let cfgXf = gameCfg_1.default.wanxiangXfinfo.getItemCtx(this.ctx, xfid);
            //参数1
            if (cfgXf.cs1[0] != null) {
                if (step >= 1) {
                    wxSk["wxxf_" + xfid][0] += cfgXf.cs1[0];
                }
                for (const arr of cfgXf.cs1[1]) {
                    for (let index = arr[0]; index <= arr[1]; index++) {
                        if (index <= step) {
                            wxSk["wxxf_" + xfid][0] += arr[2];
                            continue;
                        }
                        break;
                    }
                }
            }
            //参数2
            if (cfgXf.cs2[0] != null) {
                if (step >= 1) {
                    wxSk["wxxf_" + xfid][1] += cfgXf.cs2[0];
                }
                for (const arr of cfgXf.cs2[1]) {
                    for (let index = arr[0]; index <= arr[1]; index++) {
                        if (index <= step) {
                            wxSk["wxxf_" + xfid][1] += arr[2];
                            continue;
                        }
                        break;
                    }
                }
            }
            //参数3
            if (cfgXf.cs3[0] != null) {
                if (step >= 1) {
                    wxSk["wxxf_" + xfid][2] += cfgXf.cs3[0];
                }
                for (const arr of cfgXf.cs3[1]) {
                    for (let index = arr[0]; index <= arr[1]; index++) {
                        if (index <= step) {
                            wxSk["wxxf_" + xfid][2] += arr[2];
                            continue;
                        }
                        break;
                    }
                }
            }
            //参数4
            if (cfgXf.cs4[0] != null) {
                if (step >= 1) {
                    wxSk["wxxf_" + xfid][3] += cfgXf.cs4[0];
                }
                for (const arr of cfgXf.cs4[1]) {
                    for (let index = arr[0]; index <= arr[1]; index++) {
                        if (index <= step) {
                            wxSk["wxxf_" + xfid][3] += arr[2];
                            continue;
                        }
                        break;
                    }
                }
            }
        }
        //精怪技能
        let jgSk = {};
        for (const jgid of actJingGuai.szList[actJingGuai.szid]) {
            if (jgid == "") {
                continue;
            }
            let cfg = gameCfg_1.default.jingguaiInfo.getItem(jgid);
            if (cfg == null) {
                continue;
            }
            let level = actJingGuai.jgList[jgid].level;
            jgSk["jg_" + jgid] = [0, 0, 0, 0, 0]; //初始化
            //参数1
            if (cfg.cs1[0] != null) {
                if (level >= 1) {
                    jgSk["jg_" + jgid][0] += cfg.cs1[0];
                }
                for (const arr of cfg.cs1[1]) {
                    for (let index = arr[0]; index <= arr[1]; index++) {
                        if (index <= level) {
                            jgSk["jg_" + jgid][0] += arr[2];
                            continue;
                        }
                        break;
                    }
                }
            }
            //参数2
            if (cfg.cs2[0] != null) {
                if (level >= 1) {
                    jgSk["jg_" + jgid][1] += cfg.cs2[0];
                }
                for (const arr of cfg.cs2[1]) {
                    for (let index = arr[0]; index <= arr[1]; index++) {
                        if (index <= level) {
                            jgSk["jg_" + jgid][1] += arr[2];
                            continue;
                        }
                        break;
                    }
                }
            }
            //参数3
            if (cfg.cs3[0] != null) {
                if (level >= 1) {
                    jgSk["jg_" + jgid][2] += cfg.cs3[0];
                }
                for (const arr of cfg.cs3[1]) {
                    for (let index = arr[0]; index <= arr[1]; index++) {
                        if (index <= level) {
                            jgSk["jg_" + jgid][2] += arr[2];
                            continue;
                        }
                        break;
                    }
                }
            }
            //参数4
            if (cfg.cs4[0] != null) {
                if (level >= 1) {
                    jgSk["jg_" + jgid][3] += cfg.cs4[0];
                }
                for (const arr of cfg.cs4[1]) {
                    for (let index = arr[0]; index <= arr[1]; index++) {
                        if (index <= level) {
                            jgSk["jg_" + jgid][3] += arr[2];
                            continue;
                        }
                        break;
                    }
                }
            }
            //参数5
            if (cfg.cs5[0] != null) {
                if (level >= 1) {
                    jgSk["jg_" + jgid][4] += cfg.cs5[0];
                }
                for (const arr of cfg.cs5[1]) {
                    for (let index = arr[0]; index <= arr[1]; index++) {
                        if (index <= level) {
                            jgSk["jg_" + jgid][4] += arr[2];
                            continue;
                        }
                        break;
                    }
                }
            }
        }
        return {
            xlid: actXianlv.shangzhen.xlid,
            xlzw: actXianlv.shangzhen.zhanwei,
            xlLv: actXianlv.shangzhen.level,
            eps: eps,
            xleps: xleps,
            wxSk: wxSk,
            isnq: isnq,
            jgSk: jgSk,
        };
    }
    /**
     * 每次请求检查
     */
    async clickOne() {
        if (setting_1.default.isBan(this.id, "2", this.ctx.state.newTime) == true) {
            this.ctx.throw(502, "该角色已被封禁，请联系客服！");
        }
        let info = await this.getInfo();
        if (setting_1.default.isBan(info.uid, "3", this.ctx.state.newTime) == true) {
            this.ctx.throw(502, "该账号已被封禁，请联系客服！");
        }
        if (setting_1.default.getQufus()[info.sid].status == "4") {
            this.ctx.throw(502, "区服维护中");
        }
        if (this.ctx.state.new0 > info.lastlogin) {
            //跨天
            info.lastlogin = this.ctx.state.newTime;
            //跨天
            let playerModel = PlayerModel_1.PlayerModel.getInstance(this.ctx, info.uid);
            await playerModel.setLastlogin();
            //每日登录
            await hook_1.hookNote(this.ctx, "lodingdays", 1);
            let heid = setting_1.default.getQufus()[info.sid].heid;
            let kfdays = game_1.default.passDay(setting_1.default.getQufus()[heid].openAt);
            //刷新0点时间戳
            this.ctx.state.master.addBackBuf({
                other: {
                    new0: this.ctx.state.new0,
                    week0: game_1.default.week_0(),
                    kfdays: kfdays
                },
            });
            //pvd信息 - 下发排行奖励
            let actPvdModel = ActPvdModel_1.ActPvdModel.getInstance(this.ctx, this.id);
            await actPvdModel.backData();
            let actShopDiaMondModel = ActShopDiaMondModel_1.ActShopDiaMondModel.getInstance(this.ctx, this.id);
            await actShopDiaMondModel.backData();
            //每日挑战的sev部分
            let sevPvdModel = SevPvdModel_1.SevPvdModel.getInstance(this.ctx, heid);
            await sevPvdModel.backData();
            //符石商店 - 礼包
            let actShopFushiGModel = ActShopFushiGModel_1.ActShopFushiGModel.getInstance(this.ctx, this.id);
            await actShopFushiGModel.backData();
            //符石商店 - 符石币
            let actShopFushiCModel = ActShopFushiCModel_1.ActShopFushiCModel.getInstance(this.ctx, this.id);
            await actShopFushiCModel.backData();
            //常规礼包 - 洞天
            let actGiftDtModel = ActGiftDtModel_1.ActGiftDtModel.getInstance(this.ctx, this.id);
            await actGiftDtModel.backData();
            //招财幡
            let actZhaoCaiModel = ActZhaoCaiModel_1.ActZhaoCaiModel.getInstance(this.ctx, this.id);
            await actZhaoCaiModel.backData();
            //龙宫运宝
            let actLonggongModel = ActLonggongModel_1.ActLonggongModel.getInstance(this.ctx, this.id);
            await actLonggongModel.backData();
            //六道秘境 - act
            let actLiuDaoModel = ActLiuDaoModel_1.ActLiuDaoModel.getInstance(this.ctx, this.id);
            await actLiuDaoModel.backData();
            //万象
            let actWanXiangModel = ActWanXiangModel_1.ActWanXiangModel.getInstance(this.ctx, this.id);
            await actWanXiangModel.backData();
            //活动 - 连冲活动
            let cfgHdLianchong = setting_1.default.getHuodong2(heid, "hdLianchong");
            if (cfgHdLianchong != null) {
                for (const hdcid in cfgHdLianchong) {
                    let hdLianchongModel = HdLianchongModel_1.HdLianchongModel.getInstance(this.ctx, this.id, hdcid);
                    await hdLianchongModel.backData();
                }
            }
            //活动 - 九龙秘宝
            let cfgHdChou = setting_1.default.getHuodong2(heid, "hdChou");
            if (cfgHdChou != null) {
                for (const hdcid in cfgHdChou) {
                    let hdChouModel = HdChouModel_1.HdChouModel.getInstance(this.ctx, this.id, hdcid);
                    await hdChouModel.backData_u(["info", "red"]);
                }
            }
            //活动 - 机缘
            let cfgHdJiYuan = setting_1.default.getHuodong2(heid, "hdJiYuan");
            if (cfgHdJiYuan != null) {
                for (const hdcid in cfgHdJiYuan) {
                    let hdJiYuanModel = HdJiYuanModel_1.HdJiYuanModel.getInstance(this.ctx, this.id, hdcid);
                    await hdJiYuanModel.backData_u(["info", "red"]);
                }
            }
            //活动 - 每日特价
            let cfgHdTj = setting_1.default.getHuodong2(heid, "hdDayTeJia");
            if (cfgHdTj != null) {
                for (const hdcid in cfgHdTj) {
                    let hdDayTeJiaModel = HdDayTeJiaModel_1.HdDayTeJiaModel.getInstance(this.ctx, this.id, hdcid);
                    await hdDayTeJiaModel.backData();
                }
            }
            //活动 - 机缘
            let cfgHdNewJiYuan = setting_1.default.getHuodong2(heid, "hdNewJiYuan");
            if (cfgHdNewJiYuan != null) {
                for (const hdcid in cfgHdNewJiYuan) {
                    let hdNewJiYuanModel = HdNewJiYuanModel_1.HdNewJiYuanModel.getInstance(this.ctx, this.id, hdcid);
                    await hdNewJiYuanModel.backData_u(["info", "red"]);
                }
            }
            //活动 - 合服庆典
            let cfgHefuqd = setting_1.default.getHuodong2(heid, "hdHefuqd");
            if (cfgHefuqd != null) {
                for (const hdcid in cfgHefuqd) {
                    let hdHefuqdModel = HdHefuqdModel_1.HdHefuqdModel.getInstance(this.ctx, this.id, hdcid);
                    await hdHefuqdModel.backData_u(["info", "red"]);
                }
            }
            //活动 - 合服除魔卫道
            let cfgHdChumo = setting_1.default.getHuodong2(heid, "hdChumo");
            if (cfgHdChumo != null) {
                for (const hdcid in cfgHdChumo) {
                    let hdChumoModel = HdChumoModel_1.HdChumoModel.getInstance(this.ctx, this.id, hdcid);
                    await hdChumoModel.backData_u(["info", "red"]);
                }
            }
            //活动 - 自选礼包
            let cfgHdZixuan = setting_1.default.getHuodong2(heid, "hdZixuan");
            if (cfgHdZixuan != null) {
                for (const hdcid in cfgHdZixuan) {
                    let hdZixuanModel = HdZixuanModel_1.HdZixuanModel.getInstance(this.ctx, this.id, hdcid);
                    await hdZixuanModel.backData_u(["info", "red"]);
                }
            }
            //活动 - 冲榜
            let cfgHdCb = setting_1.default.getHuodong2(heid, "hdChongbang");
            if (cfgHdCb != null) {
                for (const hdcid in cfgHdCb) {
                    let hdChongBangModel = HdChongBangModel_1.HdChongBangModel.getInstance(this.ctx, this.id, hdcid);
                    await hdChongBangModel.backData();
                }
            }
            //活动 - 月宫探宝
            let cfgHdYg = setting_1.default.getHuodong2(heid, "hdYueGong");
            if (cfgHdYg != null) {
                for (const hdcid in cfgHdYg) {
                    let hdYueGongModel = HdYueGongModel_1.HdYueGongModel.getInstance(this.ctx, this.id, hdcid);
                    await hdYueGongModel.backData_u(["info", "red"]);
                }
            }
            //活动 - 山河庆典
            let cfgHdSh = setting_1.default.getHuodong2(heid, "hdShanhe");
            if (cfgHdSh != null) {
                for (const hdcid in cfgHdSh) {
                    let hdShanheModel = HdShanheModel_1.HdShanheModel.getInstance(this.ctx, this.id, hdcid);
                    await hdShanheModel.backData_u(["info", "red"]);
                }
            }
            //活动 - 化莲
            let cfgHdHl = setting_1.default.getHuodong2(heid, "hdHuaLian");
            if (cfgHdHl != null) {
                for (const hdcid in cfgHdHl) {
                    let hdHuaLianModel = HdHuaLianModel_1.HdHuaLianModel.getInstance(this.ctx, this.id, hdcid);
                    await hdHuaLianModel.backData_u(["info", "red"]);
                }
            }
            //活动 - 重阳出游
            let cfgHdcy = setting_1.default.getHuodong2(heid, "hdChongYang");
            if (cfgHdcy != null) {
                for (const hdcid in cfgHdcy) {
                    let hdChongYangModel = HdChongYangModel_1.HdChongYangModel.getInstance(this.ctx, this.id, hdcid);
                    await hdChongYangModel.backData_u(["info", "red"]);
                }
            }
            //活动 - 登神榜
            let cfgDsb = setting_1.default.getHuodong2(heid, "hdDengShenBang");
            if (cfgDsb != null) {
                for (const hdcid in cfgDsb) {
                    let hdDengShenBangModel = HdDengShenBangModel_1.HdDengShenBangModel.getInstance(this.ctx, this.id, hdcid);
                    if (await hdDengShenBangModel.in_show()) {
                        await hdDengShenBangModel.backData_u(["info", "red"]);
                    }
                }
            }
            //法阵
            let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(this.ctx, this.id);
            await actFazhenModel.backData();
            await this.update(info);
        }
        else {
            //每次请求都执行的 (建议改成一分钟存一次)
            //最后一次活跃时间
            let isUpdate = false;
            if (this.ctx.state.newTime - info.lastlogin > 60) {
                isUpdate = true;
            }
            info.lastlogin = this.ctx.state.newTime;
            if (isUpdate) {
                await this.update(info, [""]);
            }
        }
        //检查是否有新邮件（后台邮件）
        if (setting_1.default.ver != cache_1.default.getMailVer(this.id)) {
            cache_1.default.setMailVer(this.id, setting_1.default.ver);
            let actRwdModel = ActRwdModel_1.ActRwdModel.getInstance(this.ctx, this.id);
            await actRwdModel.checkMail();
        }
        //检查是否有新邮件（活动奖励邮件）
        if (setting_1.default.hdver != cache_1.default.getHdVer(this.id)) {
            cache_1.default.setHdVer(this.id, setting_1.default.hdver);
            let actRwdModel = ActRwdModel_1.ActRwdModel.getInstance(this.ctx, this.id);
            await actRwdModel.checkHd();
        }
    }
    /**
     * 设置角色头像
     */
    async setHead(id) {
        let info = await this.getInfo();
        info.head = id;
        await this.update(info);
    }
    /**
     * 设置角色头像
     */
    async setZj() {
        let info = await this.getInfo();
        info.yyzj = 1;
        await this.update(info);
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=UserModel.js.map