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
exports.Master = exports.DataType = void 0;
const game_1 = __importDefault(require("./game"));
const mongodb_1 = require("./mongodb");
const redis_1 = require("./redis");
const tool_1 = require("./tool");
const gameMethod_1 = require("../../common/gameMethod");
const Xys = __importStar(require("../../common/Xys"));
const lock_1 = __importDefault(require("./lock"));
const UserModel_1 = require("../model/user/UserModel");
const ActItemModel_1 = require("../model/act/ActItemModel");
const gameCfg_1 = __importDefault(require("../../common/gameCfg"));
const ActEquipModel_1 = require("../model/act/ActEquipModel");
const ActChengHModel_1 = require("../model/act/ActChengHModel");
const ActShopDiaMondModel_1 = require("../model/act/ActShopDiaMondModel");
const HdNewModel_1 = require("../model/hd/HdNewModel");
const ActShengQiModel_1 = require("../model/act/ActShengQiModel");
const HdSpeGiftModel_1 = require("../model/hd/HdSpeGiftModel");
const HdGrowthFundModel_1 = require("../model/hd/HdGrowthFundModel");
const ActBoxModel_1 = require("../model/act/ActBoxModel");
const ActJjcInfoModel_1 = require("../model/act/ActJjcInfoModel");
const ActClubModel_1 = require("../model/act/ActClubModel");
const HdPriCardModel_1 = require("../model/hd/HdPriCardModel");
const HdTimeBenModel_1 = require("../model/hd/HdTimeBenModel");
const HdTimeBen2Model_1 = require("../model/hd/HdTimeBen2Model");
const MailModel_1 = require("../model/user/MailModel");
const hook_1 = require("./hook");
const HdWelChestModel_1 = require("../model/hd/HdWelChestModel");
const ActZhanbuModel_1 = require("../model/act/ActZhanbuModel");
const ActPvwModel_1 = require("../model/act/ActPvwModel");
const ActBaoShiModel_1 = require("../model/act/ActBaoShiModel");
const ActDongTianModel_1 = require("../model/act/ActDongTianModel");
const PlayerModel_1 = require("../model/player/PlayerModel");
const ActFuShiModel_1 = require("../model/act/ActFuShiModel");
const ActFazhenModel_1 = require("../model/act/ActFazhenModel");
const HdLianchongModel_1 = require("../model/hd/HdLianchongModel");
const HdKaifuModel_1 = require("../model/hd/HdKaifuModel");
const HdChouModel_1 = require("../model/hd/HdChouModel");
const ActShopFushiGModel_1 = require("../model/act/ActShopFushiGModel");
const HdJiYuanModel_1 = require("../model/hd/HdJiYuanModel");
const HdXianshiModel_1 = require("../model/hd/HdXianshiModel");
const ActShopKind11Model_1 = require("../model/act/ActShopKind11Model");
const ActChiBangModel_1 = require("../model/act/ActChiBangModel");
const ActGiftDtModel_1 = require("../model/act/ActGiftDtModel");
const HdJuBaoPenModel_1 = require("../model/hd/HdJuBaoPenModel");
const ActFuShiYhModel_1 = require("../model/act/ActFuShiYhModel");
const HdQiYuanModel_1 = require("../model/hd/HdQiYuanModel");
const HdHuanJingModel_1 = require("../model/hd/HdHuanJingModel");
const HdXinMoModel_1 = require("../model/hd/HdXinMoModel");
const HdHefuqdModel_1 = require("../model/hd/HdHefuqdModel");
const HdChumoModel_1 = require("../model/hd/HdChumoModel");
const ActZhaoCaiModel_1 = require("../model/act/ActZhaoCaiModel");
const HdZixuanModel_1 = require("../model/hd/HdZixuanModel");
const ActLonggongModel_1 = require("../model/act/ActLonggongModel");
const ActTaskMainModel_1 = require("../model/act/ActTaskMainModel");
const HdLunHuiModel_1 = require("../model/hd/HdLunHuiModel");
const HdDayTeHuiModel_1 = require("../model/hd/HdDayTeHuiModel");
const HdNewJiYuanModel_1 = require("../model/hd/HdNewJiYuanModel");
const ActXianlvModel_1 = require("../model/act/ActXianlvModel");
const HdTianGongModel_1 = require("../model/hd/HdTianGongModel");
const HdYueGongModel_1 = require("../model/hd/HdYueGongModel");
const HdHuaLianModel_1 = require("../model/hd/HdHuaLianModel");
const HdShanheModel_1 = require("../model/hd/HdShanheModel");
const SevDouLuoModel_1 = require("../model/sev/SevDouLuoModel");
const HdDouLuoModel_1 = require("../model/hd/HdDouLuoModel");
const HdChongYangModel_1 = require("../model/hd/HdChongYangModel");
const ActShopJinTiaoModel_1 = require("../model/act/ActShopJinTiaoModel");
const HdDayTeJiaModel_1 = require("../model/hd/HdDayTeJiaModel");
const ActWanXiangModel_1 = require("../model/act/ActWanXiangModel");
const HdDengShenBangModel_1 = require("../model/hd/HdDengShenBangModel");
//数据类型
var DataType;
(function (DataType) {
    DataType["player"] = "player";
    DataType["user"] = "user";
    DataType["sev"] = "sev";
    DataType["rds"] = "rds";
    DataType["system"] = "system";
})(DataType = exports.DataType || (exports.DataType = {}));
class Master {
    //公共类容器
    constructor(ctx) {
        //获取的info信息
        this.allInfos = {};
        //更新保存
        this.backSave = {};
        //删除保存
        this.backDel = {};
        //给自己返回的信息
        this.backBuf = {};
        //存储他人要返回给他人的信息
        this.fBackBuf = {};
        this.ctx = ctx;
    }
    //获取当前角色
    getUuid() {
        if (gameMethod_1.gameMethod.isEmpty(this.ctx.state.fuuid) == false) {
            return this.ctx.state.fuuid;
        }
        return this.ctx.state.uuid;
    }
    //登陆的时候设置 减少登陆时长
    async setInfoAll() {
        let key1 = DataType.user + "_" + this.getUuid();
        let infos = await redis_1.redisSev.getRedis(DataType.user).hGetAll(key1);
        if (infos == null) {
            return;
        }
        for (const key2 in infos) {
            if (this.allInfos[key1] != null && this.allInfos[key1][key2]) {
                continue; //内存里面已经有了就不更新了
            }
            this.setInfo(key1, key2, JSON.parse(infos[key2]));
        }
    }
    //临时存储info信息
    setInfo(key1, key2, value) {
        if (this.allInfos[key1] == null) {
            this.allInfos[key1] = {};
        }
        if (this.allInfos[key1][key2] == null) {
            this.allInfos[key1][key2] = {};
        }
        this.allInfos[key1][key2] = value;
    }
    //获得info信息
    getInfo(key1, key2) {
        if (this.allInfos[key1] == null) {
            return null;
        }
        if (this.allInfos[key1][key2] == null) {
            return null;
        }
        return this.allInfos[key1][key2];
    }
    /**
     * 只有已经登陆了才能获取
     * 获取user信息
     */
    async getUser() {
        const { uuid, token } = tool_1.tool.getParams(this.ctx);
        this.ctx.state.uuid = uuid;
        this.ctx.state.fuuid = "";
        await lock_1.default.setLock(this.ctx, "user", uuid); //枷锁
        let userModel = UserModel_1.UserModel.getInstance(this.ctx, uuid);
        await userModel.check_s_ver();
        let userInfo = await userModel.getInfo();
        if (userInfo.sid == "") {
            this.ctx.throw("未知uuid：" + uuid);
        }
        if (token != "000") {
            if (userInfo.token == "" || userInfo.token != token) {
                this.ctx.throw(501);
            }
        }
        let playerModel = PlayerModel_1.PlayerModel.getInstance(this.ctx, userInfo.uid);
        let player = await playerModel.getInfo();
        this.ctx.state.pid = player.pid;
        this.ctx.state.uid = userInfo.uid;
        this.ctx.state.sid = userInfo.sid;
        this.ctx.state.regtime = userInfo.regtime;
        this.ctx.state.lasttime = userInfo.lastlogin;
        this.ctx.state.level = userInfo.level;
        this.ctx.state.name = userInfo.name == "" ? "初心者" + uuid : userInfo.name; //角色名字
        await userModel.clickOne(); //重置时间
    }
    /**
     * 用于临时更新存储 (覆盖更新)
     * @param key1
     * @param key2
     * @param info
     */
    addSave(key1, key2, info) {
        if (this.backSave[key1] == null) {
            this.backSave[key1] = {};
        }
        if (this.backSave[key1][key2] == null) {
            this.backSave[key1][key2] = {};
        }
        this.backSave[key1][key2] = info;
    }
    /**
     * 用于临时更新存储 (列表覆盖更新)
     * @param key1
     * @param key2
     * @param xbid
     * @param info
     */
    addSave_u(key1, key2, xbid, info) {
        if (this.backSave[key1] == null) {
            this.backSave[key1] = {};
        }
        if (this.backSave[key1][key2] == null) {
            this.backSave[key1][key2] = {};
        }
        this.backSave[key1][key2][xbid] = info;
    }
    /**
     * 用于临时删除存储
     * @param key1
     * @param key2
     * @param info
     */
    delSave(key1, key2, ids) {
        if (this.backDel[key1] == null) {
            this.backDel[key1] = {};
        }
        if (this.backDel[key1][key2] == null) {
            this.backDel[key1][key2] = [];
        }
        for (const id of ids) {
            this.backDel[key1][key2].push(id);
        }
    }
    /**
     * 添加输出信息
     * @param outf
     */
    addBackBuf(outf) {
        if (this.backBuf.type == null) {
            this.backBuf.type = Xys.SevBackType.success;
        }
        this.objMergeAud(this.backBuf, outf);
    }
    /**
     * 设置充值回调返回
     * @param outf
     */
    addSdkBackBuf(sdkBack) {
        this.backBuf.type = Xys.SevBackType.kind10;
        this.backBuf.order10Back = sdkBack;
    }
    /**
     * 添加他人输出信息
     * @param outf
     */
    addfBackBuf(fuuid, outf) {
        if (this.fBackBuf[fuuid] == null) {
            this.fBackBuf[fuuid] = {};
        }
        this.objMergeAud(this.fBackBuf[fuuid], outf);
    }
    /**
     * 两个对象合并 根据aud合并
     * @param obj1 from object
     * @param obj2 to object
     * @return obj2
     */
    objMergeAud(obj1, obj2) {
        for (const key1 in obj2) {
            if (obj1[key1] == null) {
                obj1[key1] = obj2[key1];
                continue;
            }
            for (const key2 in obj2[key1]) {
                if (obj1[key1][key2] == null) {
                    obj1[key1][key2] = obj2[key1][key2];
                    continue;
                }
                if (key2 == "a") {
                    obj1[key1][key2] = obj2[key1][key2];
                    break;
                }
                if (key2 == "u") {
                    if (obj1[key1][key2] == null) {
                        obj1[key1][key2] = obj2[key1][key2];
                        break;
                    }
                    for (const _id in obj2[key1][key2]) {
                        obj1[key1][key2][_id] = obj2[key1][key2][_id];
                    }
                    break;
                }
                if (key2 == "d") {
                    for (const _id in obj2[key1][key2]) {
                        obj1[key1][key2][_id] = true;
                    }
                    break;
                }
                //看第三层是不是aud，不是不管
                let isAud = false;
                for (const key3 in obj2[key1][key2]) {
                    if (key3 == "a") {
                        isAud = true;
                        obj1[key1][key2][key3] = obj2[key1][key2][key3];
                    }
                    if (key3 == "u") {
                        isAud = true;
                        if (obj1[key1][key2][key3] == null) {
                            obj1[key1][key2][key3] = obj2[key1][key2][key3];
                            break;
                        }
                        for (const _id in obj2[key1][key2][key3]) {
                            obj1[key1][key2][key3][_id] = obj2[key1][key2][key3][_id];
                        }
                    }
                    if (key3 == "d") {
                        isAud = true;
                        if (obj1[key1][key2][key3] == null) {
                            obj1[key1][key2][key3] = {};
                        }
                        for (const _id in obj2[key1][key2][key3]) {
                            obj1[key1][key2][key3][_id] = true;
                        }
                    }
                    break;
                }
                if (!isAud) {
                    obj1[key1][key2] = obj2[key1][key2]; //只有两层 全覆盖
                }
            }
        }
        return obj1; //然后在把复制好的对象给return出去
    }
    /**
     * 合并他人给我的输出信息
     */
    async mergeBackBuf() {
        if (gameMethod_1.gameMethod.isEmpty(this.ctx.state.uuid) == true) {
            return;
        }
        let outf = await redis_1.redisSev.getRedis(DataType.user).hGet("fBackBuf", this.ctx.state.uuid);
        if (gameMethod_1.gameMethod.isEmpty(outf) == false) {
            this.backBuf = this.objMergeAud(outf, this.backBuf); //合并 如果this.backBuf有，以this.backBuf为准
            await redis_1.redisSev.getRedis(DataType.user).hdel("fBackBuf", this.ctx.state.uuid); //删除
        }
    }
    /**
     * 处理提示信息
     * @param outf
     */
    addTypeMsg(type, key, msg) {
        if (type == Xys.SevBackType.fail) {
            this.backBuf = {}; //输出清空
            this.backSave = {}; //临时存储清空
            this.fBackBuf = {};
        }
        this.backBuf.type = type;
        this.addWin(key, msg);
    }
    /**
     * 各种提示
     * @param msg
     */
    addWin(key, param) {
        if (this.ctx.state.uuid == this.getUuid()) {
            if (this.backBuf.win == null) {
                this.backBuf.win = {};
            }
            switch (key) {
                case "msg": //文字提示
                    if (this.backBuf.win.msg == null) {
                        this.backBuf.win.msg = [];
                    }
                    this.backBuf.win.msg.push(param);
                    break;
                case "fazhenGz": //获得灵兽时弹窗
                    this.backBuf.win.fazhenGz = param;
                    break;
                case "zbitems": //获得占卜时弹窗
                    if (this.backBuf.win.zbitems == null) {
                        this.backBuf.win.zbitems = [];
                    }
                    this.backBuf.win.zbitems.push(param);
                    break;
                case "xianlvGz": //获得仙侣时弹窗
                    this.backBuf.win.xianlvGz = param;
                    break;
                case "xianlvId": //获得仙侣时弹窗
                    this.backBuf.win.xianlvId = param;
                    break;
                case "msgOut": //重新登陆
                    if (this.backBuf.win[key] == null || this.backBuf.win[key] == "") {
                        this.backBuf.win[key] = param;
                    }
                    break;
                case "fzUpRank": //重新登陆
                    this.backBuf.win.fzUpRank = param;
                    break;
                case "items":
                    if (this.backBuf.win.items == null) {
                        this.backBuf.win.items = [];
                    }
                    this.backBuf.win.items.push(param);
                    break;
                case "equipItems":
                    if (this.backBuf.win.equipItems == null) {
                        this.backBuf.win.equipItems = [];
                    }
                    this.backBuf.win.equipItems.push(param);
                    this.backBuf.win.equipItems = game_1.default.mergeArr(this.backBuf.win.equipItems);
                    break;
                case "zhaoCaiItems":
                    if (this.backBuf.win.zhaoCaiItems == null) {
                        this.backBuf.win.zhaoCaiItems = [];
                    }
                    this.backBuf.win.zhaoCaiItems.push(param);
                    break;
                case "sqItems":
                    if (this.backBuf.win.sqItems == null) {
                        this.backBuf.win.sqItems = [];
                    }
                    this.backBuf.win.sqItems = param;
                    break;
                case "xlitems":
                    if (this.backBuf.win.xlitems == null) {
                        this.backBuf.win.xlitems = [];
                    }
                    this.backBuf.win.xlitems.push(param);
                    break;
                case "dongtian": //洞天
                    if (this.backBuf.win.dongtian == null) {
                        this.backBuf.win.dongtian = [];
                    }
                    this.backBuf.win.dongtian.push(param);
                    break;
                case "bsitems":
                    if (this.backBuf.win.bsitems == null) {
                        this.backBuf.win.bsitems = [];
                    }
                    this.backBuf.win.bsitems.push(param);
                    break;
                case "fsItems":
                    if (this.backBuf.win.fsItems == null) {
                        this.backBuf.win.fsItems = [];
                    }
                    this.backBuf.win.fsItems.push(param);
                    break;
                case "baoshi":
                    if (this.backBuf.win.baoshi == null) {
                        this.backBuf.win.baoshi = [];
                    }
                    this.backBuf.win.baoshi.push(param);
                    break;
                case "fzExp":
                    this.backBuf.win.fzExp = param;
                    break;
                case "hdQiYuanRound":
                    this.backBuf.win.hdQiYuanRound = param;
                    break;
                case "hdHuanJingRound":
                    this.backBuf.win.hdHuanJingRound = param;
                    break;
                case "hdShanhe":
                    this.backBuf.win.hdShanhe = param;
                    break;
                case "hdYueGong":
                    this.backBuf.win.hdYueGong = param;
                    break;
                case "dongtianQiPao":
                    this.backBuf.win.dongtianQiPao = param;
                    break;
                case "boxUpStep":
                    this.backBuf.win.boxUpStep = param;
                    break;
                default:
                    this.ctx.throw("不存在提示key：" + key);
                    break;
            }
        }
        else {
            if (this.fBackBuf[this.getUuid()] == null) {
                this.fBackBuf[this.getUuid()] = {};
            }
            if (this.fBackBuf[this.getUuid()].win == null) {
                this.fBackBuf[this.getUuid()].win = {};
            }
            switch (key) {
                case "msg": //文字提示
                    if (this.fBackBuf[this.getUuid()].win.msg == null) {
                        this.fBackBuf[this.getUuid()].win.msg = [];
                    }
                    this.fBackBuf[this.getUuid()].win.msg.push(param);
                    break;
                case "msgOut": //文字提示
                    this.fBackBuf[this.getUuid()].win[key] = param;
                    break;
                case "items": //文字提示
                    if (this.fBackBuf[this.getUuid()].win.items == null) {
                        this.fBackBuf[this.getUuid()].win.items = [];
                    }
                    this.fBackBuf[this.getUuid()].win.items.push(param);
                    break;
                case "dongtian": //洞天
                    if (this.fBackBuf[this.getUuid()].win.dongtian == null) {
                        this.fBackBuf[this.getUuid()].win.dongtian = [];
                    }
                    this.fBackBuf[this.getUuid()].win.dongtian.push(param);
                    break;
                case "fazhenGz": //获得灵兽时弹窗
                    this.fBackBuf[this.getUuid()].win.fazhenGz = param;
                    break;
                case "zbitems": //获得占卜时弹窗
                    if (this.fBackBuf[this.getUuid()].win.zbitems == null) {
                        this.fBackBuf[this.getUuid()].win.zbitems = [];
                    }
                    this.fBackBuf[this.getUuid()].win.zbitems.push(param);
                    break;
                case "xianlvGz": //获得仙侣时弹窗
                    this.fBackBuf[this.getUuid()].win.xianlvGz = param;
                    break;
                case "dongtianQiPao":
                    this.fBackBuf[this.getUuid()].win.dongtianQiPao = param;
                    break;
                case "boxUpStep":
                    this.fBackBuf[this.getUuid()].win.boxUpStep = param;
                    break;
                case "baoshi":
                    if (this.fBackBuf[this.getUuid()].win.baoshi == null) {
                        this.fBackBuf[this.getUuid()].win.baoshi = [];
                    }
                    this.fBackBuf[this.getUuid()].win.baoshi.push(param);
                    break;
                default:
                    this.ctx.throw("不存在提示key：" + key);
                    break;
            }
        }
    }
    /**
     * 存储我给他人的输出信息
     */
    async updateFBuf() {
        for (const fuuid in this.fBackBuf) {
            //判断是否在线，不在线就不管了
            let fuserModel = UserModel_1.UserModel.getInstance(this.ctx, fuuid);
            let fuserInfo = await fuserModel.getInfo();
            if (this.ctx.state.newTime - 1800 > fuserInfo.lastlogin) {
                continue; //半小时内
            }
            let fbuf = await redis_1.redisSev.getRedis(DataType.user).hGet("fBackBuf", fuuid);
            if (fbuf == null) {
                fbuf = {};
            }
            //展示道具列表必须合并 而不是覆盖
            if (fbuf.win != null && fbuf.win.items != null && this.fBackBuf[fuuid].win != null && this.fBackBuf[fuuid].win.items != null) {
                this.fBackBuf[fuuid].win.items = game_1.default.addArr(fbuf.win.items, this.fBackBuf[fuuid].win.items);
            }
            if (this.fBackBuf[fuuid].win != null && this.fBackBuf[fuuid].win.items != null) {
                this.fBackBuf[fuuid].win.items = gameMethod_1.gameMethod.mergeArr(this.fBackBuf[fuuid].win.items);
            }
            await redis_1.redisSev.getRedis(DataType.user).hSet("fBackBuf", fuuid, this.objMergeAud(fbuf, this.fBackBuf[fuuid]));
        }
        this.fBackBuf = {}; //清空
    }
    /**
     * 返回所有输出信息给前端
     */
    backDataAll() {
        //宝石提示
        if (this.backBuf.win != null && this.backBuf.win.baoshi != null) {
            if (this.backBuf.win.baoshi.length > 0) {
                if (this.backBuf.win.baoshi.length == 1) {
                    let name = gameCfg_1.default.baoshiItem.getItemCtx(this.ctx, this.backBuf.win.baoshi[0].toString()).name;
                    this.addWin("msg", `恭喜获得${name}`);
                }
                else {
                    let name = gameCfg_1.default.baoshiItem.getItemCtx(this.ctx, this.backBuf.win.baoshi[0].toString()).name;
                    this.addWin("msg", `恭喜获得${this.backBuf.win.baoshi.length}个${name}`);
                }
            }
            delete this.backBuf.win.baoshi;
        }
        this.backBuf.time = this.ctx.state.newTime - 1; //前端时间 比后后端慢一秒 //避免完成时 后端未完成
        if (this.backBuf.type == null) {
            this.backBuf.type = 1;
        }
        if (this.backBuf.type == 2) {
            this.ctx.body = this.backBuf.order10Back;
            return 0;
        }
        else {
            // this.ctx.body = game.jiami(this.backBuf);
            this.ctx.body = this.backBuf;
        }
        return 1;
    }
    //所有东西写入
    async distroy() {
        //如果报错不更新
        if (gameMethod_1.gameMethod.isEmpty(this.backBuf) == false && this.backBuf.type == Xys.SevBackType.fail) {
            return false;
        }
        //写入缓存
        for (const key1 in this.backSave) {
            let rdsSet = {};
            let arr1 = key1.split("_");
            for (const key2 in this.backSave[key1]) {
                let arr2 = key2.split("_");
                //如果是列表
                if (arr2[2] == "list") {
                    //写入缓存
                    let listInfo = await redis_1.redisSev.getRedis(arr1[0]).hGet(key1, key2);
                    if (listInfo == null) {
                        listInfo = {};
                    }
                    for (const xbid in this.backSave[key1][key2]) {
                        listInfo[xbid] = this.backSave[key1][key2][xbid];
                        //立即写入数据库
                        await mongodb_1.dbSev.getDataDb().update(arr2[0], {
                            id: arr1[1],
                            kid: arr2[1],
                            hdcid: xbid,
                        }, {
                            id: arr1[1],
                            kid: arr2[1],
                            hdcid: xbid,
                            data: this.backSave[key1][key2][xbid],
                        }, true);
                    }
                    rdsSet[key2] = listInfo;
                }
                else {
                    rdsSet[key2] = this.backSave[key1][key2];
                    //立即写入数据库
                    await mongodb_1.dbSev.getDataDb().update(arr2[0], {
                        id: arr1[1],
                        kid: arr2[1],
                        hdcid: arr2[2],
                    }, {
                        id: arr1[1],
                        kid: arr2[1],
                        hdcid: arr2[2],
                        data: this.backSave[key1][key2],
                    }, true);
                }
            }
            //写入缓存
            await redis_1.redisSev.getRedis(arr1[0]).hmSet(key1, rdsSet);
        }
        //插入流水日志
        tool_1.tool.insertFlow(this.ctx);
    }
    /**
     * 添加道具 (二维数组)
     */
    async addItem2(items, winName = "items") {
        for (const item of items) {
            await this.addItem1(item, winName);
        }
    }
    /**
     * 添加道具 (一维数组)
     */
    async addItem1(item, winName = "items") {
        if (gameMethod_1.gameMethod.isEmpty(item) == true) {
            await this.ctx.state.master.addWin("msg", "添加道具错误" + item);
            return;
        }
        let kind = Number(item[0]);
        let itemid = Number(item[1]);
        let count = Number(item[2]); //Nan = Nan   null = 0
        if (count > 0) {
        }
        else {
            this.ctx.throw(itemid + "add道具数量不能<=0");
        }
        switch (kind) {
            case 1: //货币
                let cfgItemMoney = gameCfg_1.default.itemMoney.getItemCtx(this.ctx, itemid.toString());
                switch (cfgItemMoney.type) {
                    case "empty":
                    case "hecheng":
                    case "fushi":
                    case "douluoScore":
                    case "fazhen": //
                    case "fazhensj": //
                    case "baoshidai": //宝石袋
                    case "wanxiangdan":
                    case "mingwensj":
                    case "mingwenzx":
                    case "daoyouzx":
                    case "daoyousj":
                    case "daoyou":
                    case "mifasj":
                    case "mifazx":
                    case "jingguai":
                    case "dengShenBang":
                    case "jingguaizx": //开启后，在以下传奇精怪中自选1个
                    case "jingguaisj": //开启后，在以下传奇精怪中随机获取1个
                    case "jingguaispzx": //开启后，在以下上品精怪碎片中自选1个
                    case "jingguaispsj": //开启后，在以下极品精怪碎片中随机获得1个
                        let ActItem1 = ActItemModel_1.ActItemModel.getInstance(this.ctx, this.getUuid(), kind.toString());
                        await ActItem1.add(itemid, count);
                        if (cfgItemMoney.type == "douluoScore") {
                            let hdDouLuoModel = HdDouLuoModel_1.HdDouLuoModel.getInstance(this.ctx, this.getUuid(), "1");
                            await hdDouLuoModel.addScore(count);
                        }
                        if (cfgItemMoney.type == "fazhen" || cfgItemMoney.type == "fazhensj") {
                            this.addWin("msg", "自选兽灵已放入背包");
                        }
                        break;
                    case "userExp":
                        let userModel = UserModel_1.UserModel.getInstance(this.ctx, this.getUuid());
                        await userModel.addExp(count);
                        break;
                    case "shengqiChip":
                        let actShengQiModel = ActShengQiModel_1.ActShengQiModel.getInstance(this.ctx, this.getUuid());
                        await actShengQiModel.addChip(count);
                        break;
                    case "boxOpen":
                        let actEquipModel = ActEquipModel_1.ActEquipModel.getInstance(this.ctx, this.getUuid());
                        await actEquipModel.addBox(count);
                        break;
                    case "jjcPk":
                        let actJjcInfoModel = ActJjcInfoModel_1.ActJjcInfoModel.getInstance(this.ctx, this.getUuid());
                        await actJjcInfoModel.addCons(count);
                        break;
                    case "active7D": //7日活跃
                        let actClubModel = ActClubModel_1.ActClubModel.getInstance(this.ctx, this.getUuid());
                        await actClubModel.addActive(count);
                        break;
                    case "hdKaifu": //开服活动积分
                        await HdKaifuModel_1.HdKaifugModel.addCons(this.ctx, this.getUuid(), count);
                        break;
                    case "hdChou": //九龙秘宝活动专用抽奖券。
                        await HdChouModel_1.HdChouModel.addCons(this.ctx, this.getUuid(), count);
                        break;
                    // case "fazhen": //
                    //     let mailModel = MailModel.getInstance(this.ctx, this.getUuid());
                    //     await mailModel.sendMail("自选兽灵", `活动中获取的自选兽灵奖励，请开启足够兽灵槽位后及时领取。`, [item]);
                    //     break;
                    // case "fazhensj": //
                    //     if (cfgItemMoney.param.nums == null) {
                    //         this.ctx.throw("fazhensj_配置错误");
                    //         return;
                    //     }
                    //     for (let index = 0; index < count; index++) {
                    //         let fzid = game.getRandArr(cfgItemMoney.param.nums, 1)[0];
                    //         await this.addItem1([2, fzid, 1]);
                    //     }
                    //     return;
                    // case "baoshidai": //宝石袋
                    //     if (cfgItemMoney.param.nums == null) {
                    //         this.ctx.throw("baoshidai_配置错误");
                    //         return;
                    //     }
                    //     let items: KindItem[] = [];
                    //     for (let index = 0; index < count; index++) {
                    //         let getId = game.getRandArr(cfgItemMoney.param.nums, 1)[0];
                    //         items.push([9, getId, 1]);
                    //     }
                    //     await this.addItem2(items, "");
                    //     return;
                    case "hdJiYuan": //仙缘
                        await HdJiYuanModel_1.HdJiYuanModel.addCons(this.ctx, this.getUuid(), count);
                        break;
                    case "hdNewJiYuan": //仙缘
                        await HdNewJiYuanModel_1.HdNewJiYuanModel.addCons(this.ctx, this.getUuid(), count);
                        break;
                    case "fushiTili": //用于垂钓，体力不足时无法垂钓。
                        let actFuShiModel = ActFuShiModel_1.ActFuShiModel.getInstance(this.ctx, this.getUuid());
                        await actFuShiModel.addTiLi(count);
                        break;
                    case "actYuHuo": //用于增加鱼获盛宴的等级。
                        let actFuShiYhModel = ActFuShiYhModel_1.ActFuShiYhModel.getInstance(this.ctx, this.getUuid());
                        await actFuShiYhModel.addLvevl(count);
                        break;
                    case "hdQiYuan": //灵兽起源活动
                        if (cfgItemMoney.param.nums != null) {
                            await HdQiYuanModel_1.HdQiYuanModel.additem(this.ctx, this.getUuid(), cfgItemMoney.param.nums[0], count);
                        }
                        break;
                    case "hdHuanJing": //鱼灵幻境
                        if (cfgItemMoney.param.nums != null) {
                            await HdHuanJingModel_1.HdHuanJingModel.additem(this.ctx, this.getUuid(), cfgItemMoney.param.nums[0], count);
                        }
                        break;
                    case "hdXinMo": //破除心魔
                        if (cfgItemMoney.param.nums != null) {
                            await HdXinMoModel_1.HdXinMoModel.additem(this.ctx, this.getUuid(), cfgItemMoney.param.nums[0], count);
                        }
                        break;
                    case "xlHulu": //仙侣获得葫芦
                        if (cfgItemMoney.param.nums != null) {
                            let actXianlvModel = ActXianlvModel_1.ActXianlvModel.getInstance(this.ctx, this.getUuid());
                            await actXianlvModel.addHulu(cfgItemMoney.param.nums[0], count);
                            this.ctx.state.master.addLog(kind, itemid, count, count);
                        }
                        break;
                    case "xlZhaoHuan": //仙侣召唤
                        if (cfgItemMoney.param.nums != null && cfgItemMoney.param.nums.length > 0) {
                            let actXianlvModel = ActXianlvModel_1.ActXianlvModel.getInstance(this.ctx, this.getUuid());
                            for (let index = 0; index < count; index++) {
                                let xlid = game_1.default.getRandArr(cfgItemMoney.param.nums, 1)[0].toString();
                                await actXianlvModel.addXianlv(xlid);
                            }
                        }
                        return;
                    case "hdTianGong": //天宫道具
                        // if (cfgItemMoney.param.nums != null) {
                        // }
                        await HdTianGongModel_1.HdTianGongModel.additem(this.ctx, this.getUuid(), itemid, count);
                        break;
                    default:
                        this.ctx.throw(`kind=1道具类型未加 itemid:${itemid} type:${cfgItemMoney.type}`);
                }
                break;
            case 2: //法阵
                let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(this.ctx, this.getUuid());
                await actFazhenModel.addFazhen(itemid.toString());
                break;
            case 4: //装备
                this.ctx.state.master.addLog(4, itemid, 1, 1);
                return;
            case 5: //称号
                let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(this.ctx, this.getUuid());
                await actChengHModel.addCh(itemid.toString());
                return;
            case 6: //皮肤
                let actEquipModel = ActEquipModel_1.ActEquipModel.getInstance(this.ctx, this.getUuid());
                let buwei = gameCfg_1.default.equipPifu.getItemCtx(this.ctx, itemid.toString()).buwei;
                if (buwei == 99) {
                    //洞天道童皮肤
                    let actDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(this.ctx, this.getUuid());
                    await actDongTianModel.addPifu(itemid.toString());
                }
                else {
                    await actEquipModel.addPifu(buwei.toString(), itemid.toString());
                }
                break;
            case 8: //圣器碎片
                let actShengQiModel = ActShengQiModel_1.ActShengQiModel.getInstance(this.ctx, this.getUuid());
                await actShengQiModel.addSqChip(itemid, count);
                break;
            case 9: //宝石
                let actBaoShiModel = ActBaoShiModel_1.ActBaoShiModel.getInstance(this.ctx, this.getUuid());
                for (let index = 0; index < count; index++) {
                    await actBaoShiModel.addItem(itemid.toString());
                }
                this.ctx.state.master.addLog(9, itemid, count, count);
                break;
            case 12: //固定属性装备
                const { isNew } = tool_1.tool.getParams(this.ctx);
                if (isNew == null) {
                    this.ctx.throw("固定属性装备传参错误");
                }
                let cfgLs = gameMethod_1.gameMethod.linshi_kind12(itemid.toString());
                if (cfgLs == null) {
                    this.ctx.throw("固定属性装备配置错误" + itemid);
                    return;
                }
                let oldEquipId = cfgLs.equipId;
                let oldEquipLv = cfgLs.level;
                let actEquipModel12 = ActEquipModel_1.ActEquipModel.getInstance(this.ctx, this.getUuid());
                let actEquip = await actEquipModel12.getInfo();
                let cfgEquipInfo = gameCfg_1.default.equipInfo.getItemCtx(this.ctx, cfgLs.equipId);
                //直接穿上
                if (actEquip.chuan[cfgEquipInfo.buwei] == null) {
                    actEquip.chuan[cfgEquipInfo.buwei] = actEquipModel12.initBuWei();
                }
                if (actEquip.chuan[cfgEquipInfo.buwei].hhList[cfgLs.mrhh] == null) {
                    actEquip.chuan[cfgEquipInfo.buwei].hhList[cfgLs.mrhh] = 1;
                    actEquip.chuan[cfgEquipInfo.buwei].newHh = cfgLs.mrhh;
                }
                if (isNew == 1) {
                    //加装备
                    oldEquipId = actEquip.chuan[cfgEquipInfo.buwei].equipId;
                    oldEquipLv = actEquip.chuan[cfgEquipInfo.buwei].level;
                    actEquip.chuan[cfgEquipInfo.buwei].equipId = cfgLs.equipId;
                    actEquip.chuan[cfgEquipInfo.buwei].level = cfgLs.level;
                    actEquip.chuan[cfgEquipInfo.buwei].mrhh = cfgLs.mrhh;
                    actEquip.chuan[cfgEquipInfo.buwei].eps = gameMethod_1.gameMethod.objCopy(cfgLs.eps);
                    if (actEquip.linshi.equipId != "") {
                        let cfgEinfo1 = gameCfg_1.default.equipInfo.getItemCtx(this.ctx, actEquip.linshi.equipId);
                        if (cfgEinfo1.buwei == cfgEquipInfo.buwei) {
                            actEquip.linshiOld.equipId = actEquip.chuan[cfgEquipInfo.buwei].equipId;
                            actEquip.linshiOld.mrhh = actEquip.chuan[cfgEquipInfo.buwei].mrhh;
                            actEquip.linshiOld.hh = actEquip.chuan[cfgEquipInfo.buwei].hh;
                            actEquip.linshiOld.level = actEquip.chuan[cfgEquipInfo.buwei].level;
                            actEquip.linshiOld.eps = actEquip.chuan[cfgEquipInfo.buwei].eps;
                            actEquip.linshiOld.isNew = 0;
                        }
                    }
                    await hook_1.hookNote(this.ctx, "equipChuan", 1);
                }
                else {
                    if (actEquip.chuan[cfgEquipInfo.buwei] != null && actEquip.chuan[cfgEquipInfo.buwei].newHh != "") {
                        let cfgpf = gameCfg_1.default.equipPifu.getItem(actEquip.chuan[cfgEquipInfo.buwei].newHh);
                        if (cfgpf != null && [1, 2, 3, 4].indexOf(cfgEquipInfo.buwei) != -1 && actEquip.chuan[cfgEquipInfo.buwei].equipId != "") {
                            let actTaskMainModel = await ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.getUuid());
                            if ((await actTaskMainModel.kaiqi("6800")) == 1) {
                                this.ctx.state.master.addWin("msg", `获得解锁新${cfgpf.name}换装`);
                            }
                        }
                        actEquip.chuan[cfgEquipInfo.buwei].newHh = "";
                    }
                }
                await actEquipModel12.update(actEquip, ["chuan", "linshi", "linshiOld"]);
                if (oldEquipId != "") {
                    let actBoxModel = ActBoxModel_1.ActBoxModel.getInstance(this.ctx, this.getUuid());
                    let actBox = await actBoxModel.getInfo();
                    if (actBox.mType == 1) {
                        let pinzhi = gameCfg_1.default.equipInfo.getItemCtx(this.ctx, oldEquipId).pinzhi;
                        let fenjie = gameCfg_1.default.equipLevel.getItemCtx(this.ctx, pinzhi.toString(), cfgLs.level.toString()).fenjie;
                        if (fenjie.length > 0) {
                            await this.ctx.state.master.addItem2(fenjie);
                        }
                        await hook_1.hookNote(this.ctx, "equipFenJie", 1);
                    }
                    else {
                        let pinzhi = gameCfg_1.default.equipInfo.getItemCtx(this.ctx, oldEquipId).pinzhi;
                        let chushou = gameCfg_1.default.equipLevel.getItemCtx(this.ctx, pinzhi.toString(), oldEquipLv.toString()).chushou;
                        if (chushou > 0) {
                            await this.ctx.state.master.addItem1([1, 2, chushou]);
                        }
                        await hook_1.hookNote(this.ctx, "equipChuShou", 1);
                    }
                }
                this.ctx.state.master.addLog(12, itemid, 1, 1);
                return;
            case 13: //翅膀
                let actChiBangModel = ActChiBangModel_1.ActChiBangModel.getInstance(this.ctx, this.getUuid());
                await actChiBangModel.addChibang(itemid.toString());
                return;
            case 14: //送道童
                let actDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(this.ctx, this.getUuid());
                await actDongTianModel.addDt(count);
                return;
            case 16: //加铭文
                let actWanXiangModel = ActWanXiangModel_1.ActWanXiangModel.getInstance(this.ctx, this.getUuid());
                await actWanXiangModel.addMw(itemid.toString(), count);
                this.ctx.state.master.addLog(16, itemid, count, count);
                break;
            default:
                await this.ctx.state.master.addWin("msg", "addItem1道具未分类kind=：" + kind);
                return;
        }
        if (winName != "") {
            this.addWin(winName, [kind, itemid, count]);
        }
    }
    /**
     * 扣除道具 (二维数组)
     */
    async subItem2(items, isCheck = false) {
        let isTure = true;
        for (const item of items) {
            isTure = await this.subItem1(item, isCheck);
            if (isTure == false) {
                return isTure;
            }
        }
        return isTure;
    }
    /**
     * 扣除道具 (一维数组)
     */
    async subItem1(item, isCheck = false) {
        let kind = Number(item[0]);
        let itemid = Number(item[1]);
        let count = Number(item[2]);
        if (count <= 0) {
            this.ctx.throw(itemid + "sub道具数量不能<=0");
        }
        switch (kind) {
            case 1:
                let cfgItemMoney = gameCfg_1.default.itemMoney.getItemCtx(this.ctx, itemid.toString());
                switch (cfgItemMoney.type) {
                    case "xlHulu":
                        if (cfgItemMoney.param.nums != null) {
                            let actXianlvModel = ActXianlvModel_1.ActXianlvModel.getInstance(this.ctx, this.getUuid());
                            return await actXianlvModel.subHulu(cfgItemMoney.param.nums[0], count, isCheck);
                        }
                        break;
                    default:
                        let ActItem = ActItemModel_1.ActItemModel.getInstance(this.ctx, this.getUuid(), kind.toString());
                        return await ActItem.sub(itemid, count, isCheck);
                }
            case 10:
                this.ctx.throw("请前往充值");
                return false;
            case 11:
                this.ctx.throw("请先观看完整广告");
                return false;
            default:
                this.ctx.throw("subItem1道具未分类：" + kind);
                return false;
        }
    }
    /**
     * 发邮件
     * @param item
     * @param isCheck
     */
    async sendMail(uuid, a_mail) {
        let mailModel = MailModel_1.MailModel.getInstance(this.ctx, uuid);
        await mailModel.sendMail(a_mail.title, a_mail.content, a_mail.items != null ? gameMethod_1.gameMethod.objCopy(a_mail.items) : [], a_mail.type != null ? a_mail.type : 1, a_mail.fts != null ? a_mail.fts : this.ctx.state.newTime);
    }
    /**
     * 扣除道具 (一维数组)
     */
    addLog(kind, id, count, last) {
        if (this.ctx.state.log == null) {
            this.ctx.state.log = [];
        }
        this.ctx.state.log.push({
            czer: this.ctx.state.uuid,
            ber: this.getUuid(),
            item: [kind, id, count, last],
        });
    }
    /**
     * 订单ID
     */
    async kind10Success(orderId, platOrderId, status) {
        let orderInfo = await mongodb_1.dbSev.getDataDb().findOne("kind10", { orderId: orderId });
        if (orderInfo == null) {
            tool_1.tool.addServerError("kind10Success", [orderId], "订单异常代码：001");
            return {
                type: 0,
                msg: "订单异常代码：001",
                data: null,
            };
        }
        if (orderInfo.overAt > 0) {
            return {
                type: 1,
                msg: "该订单已完成",
                data: null,
            };
        }
        let orderInfo1 = await mongodb_1.dbSev.getDataDb().findOne("kind10", { platOrderId: platOrderId });
        if (orderInfo1 != null) {
            return {
                type: 1,
                msg: "重复订单",
                data: null,
            };
        }
        let typeMsg = {
            type: 0,
            msg: "默认",
            data: null,
        };
        let addChongzhi = true;
        switch (orderInfo.kid) {
            case "actShopDiaMond":
                let actShopDiaMondModel = ActShopDiaMondModel_1.ActShopDiaMondModel.getInstance(this.ctx, orderInfo.uuid);
                typeMsg = await actShopDiaMondModel.carryOut(orderInfo.dc);
                break;
            case "actShopJinTiao":
                let actShopJinTiaoModel = ActShopJinTiaoModel_1.ActShopJinTiaoModel.getInstance(this.ctx, orderInfo.uuid);
                typeMsg = await actShopJinTiaoModel.carryOut(orderInfo.dc);
                addChongzhi = false;
                break;
            case "actShopFushiG": //符石 - 礼包
                let actShopFushiGModel = ActShopFushiGModel_1.ActShopFushiGModel.getInstance(this.ctx, orderInfo.uuid);
                typeMsg = await actShopFushiGModel.carryOut(orderInfo.dc);
                break;
            case "hdNew": //新人礼包
                let hdNewModel = HdNewModel_1.HdNewModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await hdNewModel.carryOut();
                break;
            case "hdSpeGift": //特惠礼包
                let hdSpeGiftModel = HdSpeGiftModel_1.HdSpeGiftModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await hdSpeGiftModel.carryOut(orderInfo.dc);
                break;
            case "hdGrowthFund": //基金
                let hdGrowthFundModel = HdGrowthFundModel_1.HdGrowthFundModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await hdGrowthFundModel.carryOut();
                break;
            case "hdGrowthFundHh": //基金（豪华礼包）
                let hdGrowthFundModel1 = HdGrowthFundModel_1.HdGrowthFundModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await hdGrowthFundModel1.carryOut1();
                break;
            case "hdPriCard": //特权卡
                let hdPriCardModel = HdPriCardModel_1.HdPriCardModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await hdPriCardModel.carryOut();
                break;
            case "hdTimeBen": //限时福利
                let hdTimeBenModel = HdTimeBenModel_1.HdTimeBenModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await hdTimeBenModel.carryOut(orderInfo.dc);
                break;
            case "hdTimeBen2": //限时福利
                let hdTimeBen2Model = HdTimeBen2Model_1.HdTimeBen2Model.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await hdTimeBen2Model.carryOut(orderInfo.dc);
                break;
            case "actDongTian": //洞天礼包
                let actDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(this.ctx, orderInfo.uuid);
                typeMsg = await actDongTianModel.carryOut(orderInfo.dc);
                break;
            case "hdLianchong": //连冲活动
                let hdLianchongModel = HdLianchongModel_1.HdLianchongModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await hdLianchongModel.carryOut();
                break;
            case "hdKaifu": //开服活动
                let hdKaifugModel = HdKaifuModel_1.HdKaifugModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await hdKaifugModel.carryOut(orderInfo.dc);
                break;
            case "hdChou": //九龙宝藏
                let hdChouModel = HdChouModel_1.HdChouModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await hdChouModel.carryOut(orderInfo.dc);
                break;
            case "hdJiYuanLock": //活动机缘 - 解锁礼包
                let hdJiYuanModel = HdJiYuanModel_1.HdJiYuanModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await hdJiYuanModel.carryOut(orderInfo.dc);
                break;
            case "hdJiYuanGift": //活动机缘 - 每日礼包
                let hdJiYuanModel1 = HdJiYuanModel_1.HdJiYuanModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await hdJiYuanModel1.carryOut1(orderInfo.dc);
                break;
            case "hdNewJiYuanLock": //活动机缘 - 解锁礼包
                let hdNewJiYuanModel = HdNewJiYuanModel_1.HdNewJiYuanModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await hdNewJiYuanModel.carryOut(orderInfo.dc);
                break;
            case "hdNewJiYuanLockYue": //活动机缘 - 解锁礼包 - 月
                let hdNewJiYuanModelyue = HdNewJiYuanModel_1.HdNewJiYuanModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await hdNewJiYuanModelyue.carryOut2(orderInfo.dc);
                break;
            case "hdNewJiYuanGift": //活动机缘 - 每日礼包
                let hdNewJiYuanModel1 = HdNewJiYuanModel_1.HdNewJiYuanModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await hdNewJiYuanModel1.carryOut1(orderInfo.dc);
                break;
            case "hdXianshi": //活动 - 独立限时礼包
                let hdXianshiModel = HdXianshiModel_1.HdXianshiModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await hdXianshiModel.carryOut();
                break;
            case "actGiftDt": //常规礼包 - 洞天
                let actGiftDtModel = ActGiftDtModel_1.ActGiftDtModel.getInstance(this.ctx, orderInfo.uuid);
                typeMsg = await actGiftDtModel.carryOut(orderInfo.dc);
                break;
            case "hdJuBaoPen": //活动 - 聚宝盆
                let hdJuBaoPenModel = HdJuBaoPenModel_1.HdJuBaoPenModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await hdJuBaoPenModel.carryOut(orderInfo.dc);
                break;
            case "actFuShiYh": //鱼获盛宴
                let actFuShiYhModel = ActFuShiYhModel_1.ActFuShiYhModel.getInstance(this.ctx, orderInfo.uuid);
                typeMsg = await actFuShiYhModel.carryOut(orderInfo.dc);
                break;
            case "hdQiYuan": //兽灵起源
                let hdQiYuanModel = HdQiYuanModel_1.HdQiYuanModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await hdQiYuanModel.carryOut(orderInfo.dc);
                break;
            case "hdHuanJing": //鱼灵幻境
                let hdHuanJingModel = HdHuanJingModel_1.HdHuanJingModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await hdHuanJingModel.carryOut(orderInfo.dc);
                break;
            case "hdXinMo": //破除心魔
                let hdXinMoModel = HdXinMoModel_1.HdXinMoModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await hdXinMoModel.carryOut(orderInfo.dc);
                break;
            case "hdHefuqdTh": //合服庆典 - 特惠礼包
                let hdHefuqdModel = HdHefuqdModel_1.HdHefuqdModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await hdHefuqdModel.carryOut(orderInfo.dc);
                break;
            case "hdHefuqdCard": //合服庆典 - 超级翻倍卡
                let hdHefuqdModel1 = HdHefuqdModel_1.HdHefuqdModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await hdHefuqdModel1.carryOut1();
                break;
            case "hdChumo": //合服 - 除魔卫道
                let hdChumoModel = HdChumoModel_1.HdChumoModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await hdChumoModel.carryOut(orderInfo.dc);
                break;
            case "hdZixuan": //自选礼包
                let hdZixuanModel = HdZixuanModel_1.HdZixuanModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await hdZixuanModel.carryOut(orderInfo.dc);
                break;
            case "hdLunHui": //天道轮回
                let hdLunHuiModel = HdLunHuiModel_1.HdLunHuiModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await hdLunHuiModel.carryOut(orderInfo.dc);
                break;
            case "hdDayTeHui": //每日特惠
                let hdDayTeHuiModel = HdDayTeHuiModel_1.HdDayTeHuiModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await hdDayTeHuiModel.carryOut(orderInfo.dc);
                break;
            case "hdTianGong": //天宫乐舞
                let hdTianGongModel = HdTianGongModel_1.HdTianGongModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await hdTianGongModel.carryOut(orderInfo.dc);
                break;
            case "hdYueGong": //月宫探宝
                let hdYueGongModel = HdYueGongModel_1.HdYueGongModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await hdYueGongModel.carryOut(orderInfo.dc);
                break;
            case "hdChongYang": //重阳出游
                let hdChongYangModel = HdChongYangModel_1.HdChongYangModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await hdChongYangModel.carryOut(orderInfo.dc);
                break;
            case "hdHuaLian": //化莲
                let hdHuaLianModel = HdHuaLianModel_1.HdHuaLianModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await hdHuaLianModel.carryOut(orderInfo.dc);
                break;
            case "hdShanhe": //月宫探宝
                let hdShanheModel = HdShanheModel_1.HdShanheModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await hdShanheModel.carryOut(orderInfo.dc);
                break;
            case "hdDayTeJia": //每日特价
                let hdDayTeJiaModel = HdDayTeJiaModel_1.HdDayTeJiaModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await hdDayTeJiaModel.carryOut(orderInfo.dc);
                break;
            case "hdDengShenBang": //登神榜
                let hdDengShenBangModel = HdDengShenBangModel_1.HdDengShenBangModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await hdDengShenBangModel.carryOut(orderInfo.dc);
                break;
            default:
                typeMsg.msg = "kind10Success未添加：" + orderInfo.kid;
                return {
                    type: 0,
                    msg: "kind10Success未添加：" + orderInfo.kid,
                    data: null,
                };
        }
        //充值到账没给奖励
        if (typeMsg.type == 0) {
            await mongodb_1.dbSev.getDataDb().update("kind10", { orderId: orderId }, {
                platOrderId: platOrderId,
                status: 1,
            });
        }
        else {
            await mongodb_1.dbSev.getDataDb().update("kind10", { orderId: orderId }, {
                platOrderId: platOrderId,
                overAt: this.ctx.state.newTime,
                status: status,
            });
            if (addChongzhi) {
                await hook_1.hookNote(this.ctx, "chongzhi", orderInfo.rmb);
            }
        }
        this.ctx.state.master.addTypeMsg(typeMsg.type, "msg", typeMsg.msg);
        // let orderInfos: tableKind10[] = await dbSev.getDataDb().findOne("kind10", { uuid: orderInfo.uuid,overAt:{$gte:1} });
        // let isSc = true
        // if(orderInfos.length > 1){
        //     isSc = false
        // }
        // if (status != 4) {
        //     let userModel = UserModel.getInstance(this.ctx, orderInfo.uuid);
        //     let _user = await userModel.getInfo();
        //     huo.shangbao(_user, 5, _user.uuid);
        // }
        return {
            type: 1,
            msg: "充值成功",
            data: null,
        };
    }
    /**
     * 获取聊天的夸ID
     * @param sid
     */
    async getChatKuaId(sid) {
        let sevDouLuoModel = SevDouLuoModel_1.SevDouLuoModel.getInstance(this.ctx, "1", "1");
        let ksid = await sevDouLuoModel.getDLKidBySid(sid);
        return ksid;
    }
    /**
     * 广告订单ID
     * @param orderId 服务端订单ID
     * @param platOrderId 平台订单ID
     */
    async kind11Success(orderId, platOrderId) {
        let orderInfo = await mongodb_1.dbSev.getDataDb().findOne("kind11", { orderId: orderId });
        if (orderInfo == null) {
            tool_1.tool.addServerError("kind11Success", [orderId], "订单异常代码：001");
            this.ctx.throw("订单异常代码：001");
        }
        if (orderInfo.overAt > 0) {
            this.ctx.throw("该订单已完成");
        }
        // let orderInfo1:tableKind11 = await dbSev.getDataDb().findOne("kind11",{"platOrderId":platOrderId})
        // if(orderInfo1 != null){
        //     this.ctx.throw("重复订单")
        // }
        let typeMsg = {
            type: 0,
            msg: "默认",
            data: null,
        };
        switch (orderInfo.kid) {
            case "actBox": //宝箱进阶广告加速
                let actBoxModel = ActBoxModel_1.ActBoxModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await actBoxModel.carryOut();
                break;
            case "actBoxStep": //宝箱进阶广告加速
                let actBoxModel1 = ActBoxModel_1.ActBoxModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await actBoxModel1.carryOut1();
                break;
            case "actZhanbu": //抽奖 占卜转盘
                let actZhanbuModel = ActZhanbuModel_1.ActZhanbuModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await actZhanbuModel.carryOut();
                break;
            case "actZhanbuRwd": //抽奖 占卜转盘翻倍奖励
                let actZhanbuModel1 = ActZhanbuModel_1.ActZhanbuModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await actZhanbuModel1.carryOut1();
                break;
            case "actPvw": //试炼 速战
                let actPvwModel = ActPvwModel_1.ActPvwModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await actPvwModel.quick(1);
                break;
            case "hdWelChest": //福利宝箱
                let hdWelChestModel = HdWelChestModel_1.HdWelChestModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await hdWelChestModel.rwd(1);
                break;
            case "actFuShi": //符石进阶广告加速
                let actFuShiModel = ActFuShiModel_1.ActFuShiModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await actFuShiModel.carryOut();
                break;
            case "actDongTian": //广告下单刷新
                let actDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await actDongTianModel.carryOut11();
                break;
            case "actShopKind11": //广告商店
                let actShopKind11Model = ActShopKind11Model_1.ActShopKind11Model.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await actShopKind11Model.carryOut(orderInfo.dc);
                break;
            case "actZhaoCai": //招财幡
                let actZhaoCaiModel = ActZhaoCaiModel_1.ActZhaoCaiModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await actZhaoCaiModel.carryOut();
                break;
            case "actLonggong": //龙宫运宝
                let actLonggongModel = ActLonggongModel_1.ActLonggongModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await actLonggongModel.carryOut();
                break;
            case "actFazhen": //新版灵兽抽取看广告
                let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await actFazhenModel.carryOut();
                break;
            case "hdYueGong": //月宫探宝
                let hdYueGongModel = HdYueGongModel_1.HdYueGongModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await hdYueGongModel.carryOut11(orderInfo.dc);
                break;
            case "hdChongYang": //重阳
                let hdChongYangModel = HdChongYangModel_1.HdChongYangModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await hdChongYangModel.carryOut11(orderInfo.dc);
                break;
            case "hdShanhe": //山河庆典
                let hdShanheModel = HdShanheModel_1.HdShanheModel.getInstance(this.ctx, orderInfo.uuid, orderInfo.hdcid);
                typeMsg = await hdShanheModel.carryOut11(orderInfo.dc);
                break;
            case "actWanXiang": //万象
                let actWanXiangModel = ActWanXiangModel_1.ActWanXiangModel.getInstance(this.ctx, orderInfo.uuid);
                typeMsg = await actWanXiangModel.carryOut11();
                break;
            default:
                typeMsg.msg = "kind11Success未添加：" + orderInfo.kid;
                break;
        }
        await mongodb_1.dbSev.getDataDb().update("kind11", { orderId: orderId }, {
            platOrderId: platOrderId,
            overAt: this.ctx.state.newTime,
        });
        if (gameMethod_1.gameMethod.isEmpty(typeMsg.msg) == false) {
            this.ctx.state.master.addTypeMsg(typeMsg.type, "msg", typeMsg.msg);
        }
    }
}
exports.Master = Master;
//# sourceMappingURL=master.js.map