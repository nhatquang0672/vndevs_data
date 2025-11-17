"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActEquipModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const Xys_1 = require("../../../common/Xys");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const gameMethod_1 = require("../../../common/gameMethod");
const ActJjcInfoModel_1 = require("./ActJjcInfoModel");
const ActBoxModel_1 = require("./ActBoxModel");
const game_1 = __importDefault(require("../../util/game"));
const UserModel_1 = require("../user/UserModel");
const hook_1 = require("../../util/hook");
const PlayerModel_1 = require("../player/PlayerModel");
const lock_1 = __importDefault(require("../../util/lock"));
const ActInviteModel_1 = require("./ActInviteModel");
const HdPriCardModel_1 = require("../hd/HdPriCardModel");
const tool_1 = require("../../util/tool");
const setting_1 = __importDefault(require("../../../src/crontab/setting"));
const HdTimeBenModel_1 = require("../hd/HdTimeBenModel");
const HdNewModel_1 = require("../hd/HdNewModel");
const ActTaskMainModel_1 = require("./ActTaskMainModel");
const HdTimeBen2Model_1 = require("../hd/HdTimeBen2Model");
const ActDaoyouModel_1 = require("./ActDaoyouModel");
/**
 * 装备穿着 信息
 */
class ActEquipModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actEquip"; //用于存储key 和  输出1级key
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
        return ""; //输出2级key
    }
    //初始化
    init() {
        return {
            chuan: {},
            box: 20,
            linshi: {
                //开启宝箱临时的装备列表
                equipId: "",
                mrhh: "",
                hh: "",
                level: 0,
                eps: {},
                isNew: 0,
            },
            linshi95: {},
            linshiOld: {
                //开启宝箱临时的装备列表
                equipId: "",
                mrhh: "",
                hh: "",
                level: 0,
                eps: {},
                isNew: 0,
            },
            linshixz: "",
            openCount: 0,
            pingji: 0,
            count: 0,
            time: 0,
            jjc: 0,
            trader: 0,
            czpf: {},
            ver: "2",
            ver1: "1",
            opAt: 0,
            verfm: 1,
            fmCount: 0,
        };
    }
    //初始化部位
    initBuWei() {
        return {
            equipId: "",
            level: 0,
            eps: {},
            hhList: {},
            mrhh: "",
            hh: "",
            newHh: "",
            fmLv: 0,
            fmBd: 0,
            fmEps: [],
            fmZhBd: [],
            fmZhls: [] //附魔转换临时属性
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        if (this.ctx.state.new0 > info.time) {
            info.time = this.ctx.state.newTime;
            info.jjc = 0;
        }
        if (info.openCount == null) {
            info.openCount = 1;
        }
        if (info.fmCount == null) {
            info.fmCount = 1;
        }
        if (info.linshi95 == null) {
            info.linshi95 = {};
        }
        if (info.czpf == null) {
            info.czpf = {};
        }
        //修复版本
        if (info.ver == null) {
            info.ver = "2";
            for (const buwei in info.chuan) {
                info.chuan[buwei].fmEps = [];
            }
        }
        if (info.ver1 != "1") {
            info.ver1 = "1";
            for (const _buwei in info.chuan) {
                info.chuan[_buwei].fmZhBd = [];
                info.chuan[_buwei].fmZhls = [];
            }
        }
        if (info.verfm == null) {
            info.verfm = 1;
            for (const _buwei in info.chuan) {
                let oldfmEps = gameMethod_1.gameMethod.objCopy(info.chuan[_buwei].fmEps);
                info.chuan[_buwei].fmEps = [];
                let eps_prol = gameCfg_1.default.equipFumo.getItemCtx(this.ctx, info.chuan[_buwei].fmLv.toString()).eps_prol;
                for (const _eps of oldfmEps) {
                    for (const eps_pro of eps_prol) {
                        if (eps_pro[0] == _eps[0]) {
                            info.chuan[_buwei].fmEps.push([_eps[0], eps_pro[1]]);
                            break;
                        }
                    }
                }
            }
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
     * 增加宝箱数量
     */
    async addBox(cons) {
        let info = await this.getInfo();
        info.box += cons;
        await this.update(info);
        this.ctx.state.master.addLog(1, 902, cons, info.box);
    }
    /**
     * 重新获取装备商人属性
     */
    async resetTrader() {
        let info = await this.getInfo();
        let userModel = UserModel_1.UserModel.getInstance(this.ctx, this.id);
        let gStart = await userModel.getFightEps();
        info.trader = gStart.eps.trader;
        await this.update(info, ['']);
    }
    /**
     * 开启宝箱
     * @param itemId
     */
    async openBox() {
        let info = await this.getInfo();
        if (info.linshi.equipId != "") {
            await this.backData();
            return; //还没展示完
        }
        if (info.box < 1) {
            this.ctx.throw("鼎炉不足");
        }
        let outfkey = ["box", "jjc", "linshi", "linshiOld", "linshi95"];
        let cfgZj = gameCfg_1.default.equipZuojia.getItem((info.count + 1).toString());
        if (cfgZj != null) { //作假
            let pinzhi = cfgZj.pinzhi;
            let cfgInfobp = gameCfg_1.default.equipBuweipinz.getItemCtx(this.ctx, cfgZj.buwei, cfgZj.pinzhi);
            let level = cfgZj.level;
            let equipId = cfgInfobp.id;
            let cfgElv = gameCfg_1.default.equipLevel.getItemCtx(this.ctx, pinzhi.toString(), level.toString());
            let eps = {};
            eps["hp_max"] = Math.max(0, cfgElv.hp_max + game_1.default.rand(-1 * cfgElv.hp_max_bd, cfgElv.hp_max_bd));
            eps["atk"] = Math.max(0, cfgElv.atk + game_1.default.rand(-1 * cfgElv.atk_bd, cfgElv.atk_bd));
            eps["def"] = Math.max(0, cfgElv.def + game_1.default.rand(-1 * cfgElv.def_bd, cfgElv.def_bd));
            eps["speed"] = Math.max(0, cfgElv.speed + game_1.default.rand(-1 * cfgElv.speed_bd, cfgElv.speed_bd));
            //特殊属性
            for (const tcid of cfgInfobp.tsCid) {
                let cfgTsCList = gameCfg_1.default.equipTsChiList.getItemListCtx(this.ctx, tcid);
                let _item1 = game_1.default.getProbRandItem(0, cfgTsCList, "prob");
                if (_item1 == null) {
                    this.ctx.throw("获取装备池子属性失败");
                    return;
                }
                let cfgEtsEp = gameCfg_1.default.equipTsEp.getItemCtx(this.ctx, pinzhi.toString(), _item1.epkey);
                eps[_item1.epkey] = game_1.default.rand(cfgEtsEp.min, cfgEtsEp.max);
            }
            let mrhh = ""; //皮肤
            //根据部位 获取皮肤
            let cfgPifuList = gameCfg_1.default.equipPifuList.getItemList(cfgZj.buwei);
            let chouItem = [];
            if (cfgPifuList != null && cfgPifuList.length > 0) {
                for (const pfinfo of cfgPifuList) {
                    if (pfinfo.limit > 0) {
                        if (info.czpf == null) {
                            continue;
                        }
                        //前置ID
                        let qzid = (parseInt(pfinfo.id) - 1).toString();
                        if (info.czpf[qzid] == null || info.czpf[qzid] < pfinfo.limit) {
                            continue;
                        }
                    }
                    chouItem.push([parseInt(pfinfo.id), pfinfo.prob]);
                }
            }
            if (chouItem.length > 0) {
                let _item3 = game_1.default.getProbByItems(chouItem, 0, 1);
                if (_item3 != null) {
                    mrhh = _item3[0].toString();
                    if (info.chuan[cfgZj.buwei] == null) {
                        info.chuan[cfgZj.buwei] = this.initBuWei();
                    }
                    info.chuan[cfgZj.buwei].newHh = "";
                    if (info.chuan[cfgZj.buwei].hhList[mrhh] == null) {
                        info.chuan[cfgZj.buwei].hhList[mrhh] = 1;
                        info.chuan[cfgZj.buwei].newHh = mrhh;
                        let _buwei1 = cfgZj.buwei.toString();
                        if (info.chuan[_buwei1] != null && info.chuan[_buwei1].newHh != "") {
                            let cfgpf = gameCfg_1.default.equipPifu.getItem(info.chuan[_buwei1].newHh);
                            if (cfgpf != null && ['1', '2', '3', '4'].indexOf(_buwei1) != -1 && info.chuan[_buwei1].equipId != "") {
                                let actTaskMainModel = await ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
                                if (await actTaskMainModel.kaiqi("6800") == 1) {
                                    this.ctx.state.master.addWin("msg", `获得解锁新${cfgpf.name}换装`);
                                }
                            }
                            info.chuan[_buwei1].newHh = "";
                        }
                    }
                    outfkey.push("chuan");
                }
            }
            if (mrhh == "") {
                this.ctx.throw("mrhh_err");
            }
            info.linshi = {
                equipId: equipId,
                mrhh: mrhh,
                hh: "",
                level: level,
                eps: eps,
                isNew: 1,
            };
            //扣除宝箱
            info.box -= 1;
            info.count += 1;
            //加角色经验
            let userModel = await UserModel_1.UserModel.getInstance(this.ctx, this.id);
            //有几率获得竞技场门票
            let cfgMath1 = gameCfg_1.default.mathInfo.getItemCtx(this.ctx, "box_open_jjc");
            if (cfgMath1.pram.items == null) {
                this.ctx.throw("配置错误Math_box_open_jjc");
                return;
            }
            let cfgMath2 = gameCfg_1.default.mathInfo.getItemCtx(this.ctx, "jjc_box_max");
            if (cfgMath2.pram.count == null) {
                this.ctx.throw("配置错误Math_jjc_box_max");
                return;
            }
            let maxCount = cfgMath2.pram.count;
            //月卡 终身卡
            let hdPriCardModel = HdPriCardModel_1.HdPriCardModel.getInstance(this.ctx, this.id, Xys_1.PriCardType.fever);
            let hdmoon = await hdPriCardModel.getInfo();
            if (hdmoon.btime < 0 || hdmoon.btime > this.ctx.state.newTime) {
                maxCount += 2;
            }
            //检测是否抽中
            let actTaskMainModel = await ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
            if (await actTaskMainModel.kaiqi("5000") == 1) {
                let actJjcInfoModel = ActJjcInfoModel_1.ActJjcInfoModel.getInstance(this.ctx, this.id);
                let actJjcInfo = await actJjcInfoModel.getInfo();
                if (actJjcInfo.cons < maxCount) {
                    for (const jjcItems of cfgMath1.pram.items) {
                        if (info.jjc >= jjcItems[0] && info.jjc <= jjcItems[1]) {
                            if (game_1.default.rand(1, 10000) <= jjcItems[2]) {
                                info.jjc += 1;
                                await actJjcInfoModel.addCons(1);
                                this.ctx.state.master.addWin("msg", "获得斗法-战旗X1");
                            }
                            break;
                        }
                    }
                }
            }
            //首次开箱 完成邀请
            if (info.count <= 1) {
                //邀请类 . 尝试触发
                //获取 uid
                let myuid = (await userModel.getInfo()).uid;
                //play类
                let playerModel = PlayerModel_1.PlayerModel.getInstance(this.ctx, myuid);
                //我是不是别人邀请进来的
                let pinfo = await playerModel.getInfo();
                if (gameMethod_1.gameMethod.isEmpty(pinfo.invuuid) != true && pinfo.invuuid != "no") {
                    //去找这个人 给他完成邀请任务
                    let fuuid = pinfo.invuuid;
                    await lock_1.default.setLock(this.ctx, "user", fuuid); //枷锁
                    this.ctx.state.fuuid = fuuid;
                    let actInviteModel = ActInviteModel_1.ActInviteModel.getInstance(this.ctx, fuuid);
                    await actInviteModel.invs_add(myuid);
                    this.ctx.state.fuuid = "";
                }
            }
            //临时给前端展示
            info.linshiOld = {
                //开启宝箱临时的装备列表
                equipId: "",
                mrhh: "",
                hh: "",
                level: 0,
                eps: {},
                isNew: 0,
            };
            if (info.chuan[cfgZj.buwei] != null) {
                info.linshiOld.equipId = info.chuan[cfgZj.buwei].equipId;
                info.linshiOld.mrhh = info.chuan[cfgZj.buwei].equipId == "" ? "" : info.chuan[cfgZj.buwei].mrhh;
                info.linshiOld.hh = info.chuan[cfgZj.buwei].hh;
                info.linshiOld.level = info.chuan[cfgZj.buwei].level;
                info.linshiOld.eps = info.chuan[cfgZj.buwei].eps;
                info.linshiOld.isNew = 0;
            }
            //记录皮肤抽中次数
            if (info.czpf == null) {
                info.czpf = {};
            }
            if (info.czpf[mrhh] == null) {
                info.czpf[mrhh] = 0;
            }
            info.czpf[mrhh] += 1;
            await this.update(info, ["box", "jjc", "linshi", "linshiOld", "linshi95"]);
            await hook_1.hookNote(this.ctx, "boxOpen", 1);
            return;
        }
        let actBoxModel = ActBoxModel_1.ActBoxModel.getInstance(this.ctx, this.id);
        let actBox = await actBoxModel.getInfo();
        //根据宝箱等级 获取装备品质
        let cfgEquipBox = gameCfg_1.default.equipBox.getItemCtx(this.ctx, actBox.level.toString());
        let _item = game_1.default.getProbByItems(cfgEquipBox.ePinZhiProb, 0, 1);
        if (_item == null) {
            this.ctx.throw("获取装备品质失败");
            return;
        }
        let pinzhi = _item[0];
        //在根据品质获取 装备种类ID 其实就是部位
        let cfgEInfoList = gameCfg_1.default.equipInfoList.getItemListCtx(this.ctx, pinzhi.toString());
        let _id = game_1.default.getProbRandId(0, cfgEInfoList, "pinzhi");
        if (_id == null) {
            this.ctx.throw("抽取装备失败");
            return;
        }
        let cfgMath = gameCfg_1.default.mathInfo.getItemCtx(this.ctx, "box_equip_lv");
        if (cfgMath.pram.items == null) {
            this.ctx.throw("配置错误Math_box_equip_lv");
            return;
        }
        let _item2 = game_1.default.getProbByItems(cfgMath.pram.items, 0, 1);
        if (_item2 == null) {
            this.ctx.throw("获取装备等级浮动失败");
            return;
        }
        let level = Math.max(1, this.ctx.state.level + _item2[0]);
        let equipId = cfgEInfoList[_id].id;
        if (equipId == "") {
            this.ctx.throw("装备获取失败");
            tool_1.tool.addServerError(this.ctx.url, tool_1.tool.getParams(this.ctx), {
                _id: _id,
                pinzhi: pinzhi,
                cfgEInfoList: JSON.stringify(cfgEInfoList)
            });
            return;
        }
        let cfgElv = gameCfg_1.default.equipLevel.getItemCtx(this.ctx, pinzhi.toString(), level.toString());
        let eps = {};
        eps["hp_max"] = Math.max(0, cfgElv.hp_max + game_1.default.rand(-1 * cfgElv.hp_max_bd, cfgElv.hp_max_bd));
        eps["atk"] = Math.max(0, cfgElv.atk + game_1.default.rand(-1 * cfgElv.atk_bd, cfgElv.atk_bd));
        eps["def"] = Math.max(0, cfgElv.def + game_1.default.rand(-1 * cfgElv.def_bd, cfgElv.def_bd));
        eps["speed"] = Math.max(0, cfgElv.speed + game_1.default.rand(-1 * cfgElv.speed_bd, cfgElv.speed_bd));
        //特殊属性
        let cfgEinfo = gameCfg_1.default.equipInfo.getItemCtx(this.ctx, equipId);
        for (const tcid of cfgEinfo.tsCid) {
            let cfgTsCList = gameCfg_1.default.equipTsChiList.getItemListCtx(this.ctx, tcid);
            let _item1 = game_1.default.getProbRandItem(0, cfgTsCList, "prob");
            if (_item1 == null) {
                this.ctx.throw("获取装备池子属性失败");
                return;
            }
            let cfgEtsEp = gameCfg_1.default.equipTsEp.getItemCtx(this.ctx, pinzhi.toString(), _item1.epkey);
            eps[_item1.epkey] = game_1.default.rand(cfgEtsEp.min, cfgEtsEp.max);
        }
        let mrhh = ""; //皮肤
        //根据部位 获取皮肤
        let cfgPifuList = gameCfg_1.default.equipPifuList.getItemList(cfgEinfo.buwei.toString());
        let chouItem = [];
        if (cfgPifuList != null && cfgPifuList.length > 0) {
            for (const pfinfo of cfgPifuList) {
                if (pfinfo.limit > 0) {
                    if (info.czpf == null) {
                        continue;
                    }
                    //前置ID
                    let qzid = (parseInt(pfinfo.id) - 1).toString();
                    if (info.czpf[qzid] == null || info.czpf[qzid] < pfinfo.limit) {
                        continue;
                    }
                }
                chouItem.push([parseInt(pfinfo.id), pfinfo.prob]);
            }
        }
        if (chouItem.length > 0) {
            let _item3 = game_1.default.getProbByItems(chouItem, 0, 1);
            if (_item3 != null) {
                mrhh = _item3[0].toString();
                if (info.chuan[cfgEinfo.buwei.toString()] == null) {
                    info.chuan[cfgEinfo.buwei.toString()] = this.initBuWei();
                }
                info.chuan[cfgEinfo.buwei.toString()].newHh = "";
                if (info.chuan[cfgEinfo.buwei.toString()].hhList[mrhh] == null) {
                    info.chuan[cfgEinfo.buwei.toString()].hhList[mrhh] = 1;
                    info.chuan[cfgEinfo.buwei.toString()].newHh = mrhh;
                    let _buwei1 = cfgEinfo.buwei.toString();
                    if (info.chuan[_buwei1] != null && info.chuan[_buwei1].newHh != "") {
                        let cfgpf = gameCfg_1.default.equipPifu.getItem(info.chuan[_buwei1].newHh);
                        if (cfgpf != null && ['1', '2', '3', '4'].indexOf(_buwei1) != -1 && info.chuan[_buwei1].equipId != "") {
                            let actTaskMainModel = await ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
                            if (await actTaskMainModel.kaiqi("6800") == 1) {
                                this.ctx.state.master.addWin("msg", `获得解锁新${cfgpf.name}换装`);
                            }
                        }
                        info.chuan[_buwei1].newHh = "";
                    }
                }
            }
            outfkey.push("chuan");
        }
        if (mrhh == "") {
            this.ctx.throw("mrhh_err");
        }
        info.linshi = {
            equipId: equipId,
            mrhh: mrhh,
            hh: "",
            level: level,
            eps: eps,
            isNew: 1,
        };
        //扣除宝箱
        info.box -= 1;
        info.count += 1;
        //加角色经验
        // let addExp = game.getRandArr(cfgEquipBox.addExps, 1)[0];
        let userModel = await UserModel_1.UserModel.getInstance(this.ctx, this.id);
        // await userModel.addExp(addExp);
        //有几率获得竞技场门票
        let cfgMath1 = gameCfg_1.default.mathInfo.getItemCtx(this.ctx, "box_open_jjc");
        if (cfgMath1.pram.items == null) {
            this.ctx.throw("配置错误Math_box_open_jjc");
            return;
        }
        let cfgMath2 = gameCfg_1.default.mathInfo.getItemCtx(this.ctx, "jjc_box_max");
        if (cfgMath2.pram.count == null) {
            this.ctx.throw("配置错误Math_jjc_box_max");
            return;
        }
        let maxCount = cfgMath2.pram.count;
        //月卡 终身卡
        let hdPriCardModel = HdPriCardModel_1.HdPriCardModel.getInstance(this.ctx, this.id, Xys_1.PriCardType.fever);
        let hdmoon = await hdPriCardModel.getInfo();
        if (hdmoon.btime < 0 || hdmoon.btime > this.ctx.state.newTime) {
            maxCount += 2;
        }
        //检测是否抽中
        let actTaskMainModel = await ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
        if (await actTaskMainModel.kaiqi("5000") == 1) {
            let actJjcInfoModel = ActJjcInfoModel_1.ActJjcInfoModel.getInstance(this.ctx, this.id);
            let actJjcInfo = await actJjcInfoModel.getInfo();
            if (actJjcInfo.cons < maxCount) {
                for (const jjcItems of cfgMath1.pram.items) {
                    if (info.jjc >= jjcItems[0] && info.jjc <= jjcItems[1]) {
                        if (game_1.default.rand(1, 10000) <= jjcItems[2]) {
                            info.jjc += 1;
                            await actJjcInfoModel.addCons(1);
                            this.ctx.state.master.addWin("msg", "获得斗法-战旗X1");
                        }
                        break;
                    }
                }
            }
        }
        //首次开箱 完成邀请
        if (info.count <= 1) {
            //邀请类 . 尝试触发
            //获取 uid
            let myuid = (await userModel.getInfo()).uid;
            //play类
            let playerModel = PlayerModel_1.PlayerModel.getInstance(this.ctx, myuid);
            //我是不是别人邀请进来的
            let pinfo = await playerModel.getInfo();
            if (gameMethod_1.gameMethod.isEmpty(pinfo.invuuid) != true && pinfo.invuuid != "no") {
                //去找这个人 给他完成邀请任务
                let fuuid = pinfo.invuuid;
                await lock_1.default.setLock(this.ctx, "user", fuuid); //枷锁
                this.ctx.state.fuuid = fuuid;
                let actInviteModel = ActInviteModel_1.ActInviteModel.getInstance(this.ctx, fuuid);
                await actInviteModel.invs_add(myuid);
                this.ctx.state.fuuid = "";
            }
        }
        //临时给前端展示
        info.linshiOld = {
            //开启宝箱临时的装备列表
            equipId: "",
            mrhh: "",
            hh: "",
            level: 0,
            eps: {},
            isNew: 0,
        };
        let buwei = cfgEinfo.buwei.toString();
        if (info.chuan[buwei] != null) {
            info.linshiOld.equipId = info.chuan[buwei].equipId;
            info.linshiOld.mrhh = info.chuan[buwei].equipId == "" ? "" : info.chuan[buwei].mrhh;
            info.linshiOld.hh = info.chuan[buwei].hh;
            info.linshiOld.level = info.chuan[buwei].level;
            info.linshiOld.eps = info.chuan[buwei].eps;
            info.linshiOld.isNew = 0;
        }
        //记录皮肤抽中次数
        if (info.czpf == null) {
            info.czpf = {};
        }
        if (info.czpf[mrhh] == null) {
            info.czpf[mrhh] = 0;
        }
        info.czpf[mrhh] += 1;
        await this.update(info, outfkey);
        await hook_1.hookNote(this.ctx, "boxOpen", 1);
    }
    /**
     *  开启宝箱 (20230612版本)
     *  做2倍开鼎，就是一下扣2个炉子，然后随机两次，把好的装备给玩家，另外一个自动卖掉。
        PS：
        如果是抽到2个装备，两个都比身上的好，那就随机一个出来。
        如果是抽到2个，一个比身上的好，一个比身上的垃圾，那就给好的那个。
        如果是抽到2个，都比身上的垃圾，那就随机一个。
     */
    async openBoxNew() {
        let info = await this.getInfo();
        if (info.linshi.equipId != "") {
            await this.backData();
            return; //还没展示完
        }
        //检测是否开加速器
        if (info.opAt != null && info.opAt >= this.ctx.state.newTime) {
            this.ctx.throw(502, "本地时间异常,请重新登录");
        }
        info.opAt = this.ctx.state.newTime;
        info.openCount = 1;
        let actBoxModel = ActBoxModel_1.ActBoxModel.getInstance(this.ctx, this.id);
        let actBox = await actBoxModel.getInfo();
        if (gameMethod_1.gameMethod.isEmpty(actBox.fangan) == false) {
            let fangan = JSON.parse(actBox.fangan);
            if (fangan != null && fangan["7"] != null && fangan["7"]["openCount"] != null) {
                info.openCount = fangan["7"]["openCount"];
            }
        }
        if (info.openCount < 1) {
            info.openCount = 1;
        }
        if (info.box < info.openCount) {
            this.ctx.throw("鼎炉不足");
        }
        info.box -= info.openCount;
        let outfkey = ["box", "jjc", "linshi", "linshiOld", "linshi95"];
        //初始化临时装备
        info.linshi = {
            equipId: "",
            mrhh: "",
            hh: "",
            level: 0,
            eps: {},
            isNew: 1,
        };
        info.pingji = 0;
        for (let index = 0; index < info.openCount; index++) {
            //单次获取临时存储
            let oneLinshi = {
                equipId: "",
                mrhh: "",
                hh: "",
                level: 0,
                eps: {},
                isNew: 1,
            };
            let oneBuwei = "";
            let newPingJi = 0; //评级 0最差,1一个属性优,2二个属性优,3三个属性优,4四个属性优
            let cfgZj = gameCfg_1.default.equipZuojia.getItem((info.count + 1).toString());
            if (cfgZj != null) { //作假
                let pinzhi = cfgZj.pinzhi;
                newPingJi += parseInt(pinzhi);
                let cfgInfobp = gameCfg_1.default.equipBuweipinz.getItemCtx(this.ctx, cfgZj.buwei, cfgZj.pinzhi);
                oneBuwei = cfgZj.buwei;
                let level = cfgZj.level;
                let equipId = cfgInfobp.id;
                let cfgElv = gameCfg_1.default.equipLevel.getItemCtx(this.ctx, pinzhi.toString(), level.toString());
                let eps = {};
                eps["hp_max"] = Math.max(0, cfgElv.hp_max + game_1.default.rand(-1 * cfgElv.hp_max_bd, cfgElv.hp_max_bd));
                eps["atk"] = Math.max(0, cfgElv.atk + game_1.default.rand(-1 * cfgElv.atk_bd, cfgElv.atk_bd));
                eps["def"] = Math.max(0, cfgElv.def + game_1.default.rand(-1 * cfgElv.def_bd, cfgElv.def_bd));
                eps["speed"] = Math.max(0, cfgElv.speed + game_1.default.rand(-1 * cfgElv.speed_bd, cfgElv.speed_bd));
                //特殊属性
                for (const tcid of cfgInfobp.tsCid) {
                    let cfgTsCList = gameCfg_1.default.equipTsChiList.getItemListCtx(this.ctx, tcid);
                    let _item1 = game_1.default.getProbRandItem(0, cfgTsCList, "prob");
                    if (_item1 == null) {
                        this.ctx.throw("获取装备池子属性失败");
                        return;
                    }
                    let cfgEtsEp = gameCfg_1.default.equipTsEp.getItemCtx(this.ctx, pinzhi.toString(), _item1.epkey);
                    eps[_item1.epkey] = game_1.default.rand(cfgEtsEp.min, cfgEtsEp.max);
                }
                let mrhh = ""; //皮肤
                //根据部位 获取皮肤
                let cfgPifuList = gameCfg_1.default.equipPifuList.getItemList(cfgZj.buwei);
                let chouItem = [];
                if (cfgPifuList != null && cfgPifuList.length > 0) {
                    for (const pfinfo of cfgPifuList) {
                        if (pfinfo.limit > 0) {
                            if (info.czpf == null) {
                                continue;
                            }
                            //前置ID
                            let qzid = (parseInt(pfinfo.id) - 1).toString();
                            if (info.czpf[qzid] == null || info.czpf[qzid] < pfinfo.limit) {
                                continue;
                            }
                        }
                        chouItem.push([parseInt(pfinfo.id), pfinfo.prob]);
                    }
                }
                if (chouItem.length > 0) {
                    let _item3 = game_1.default.getProbByItems(chouItem, 0, 1);
                    if (_item3 != null) {
                        mrhh = _item3[0].toString();
                        if (info.chuan[cfgZj.buwei] == null) {
                            info.chuan[cfgZj.buwei] = this.initBuWei();
                        }
                        info.chuan[cfgZj.buwei].newHh = "";
                        if (info.chuan[cfgZj.buwei].hhList[mrhh] == null) {
                            info.chuan[cfgZj.buwei].hhList[mrhh] = 1;
                            info.chuan[cfgZj.buwei].newHh = mrhh;
                            let _buwei1 = cfgZj.buwei.toString();
                            if (info.chuan[_buwei1] != null && info.chuan[_buwei1].newHh != "") {
                                let cfgpf = gameCfg_1.default.equipPifu.getItem(info.chuan[_buwei1].newHh);
                                if (cfgpf != null && ['1', '2', '3', '4'].indexOf(_buwei1) != -1 && info.chuan[_buwei1].equipId != "") {
                                    let actTaskMainModel = await ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
                                    if (await actTaskMainModel.kaiqi("6800") == 1) {
                                        this.ctx.state.master.addWin("msg", `获得解锁新${cfgpf.name}换装`);
                                    }
                                }
                                info.chuan[_buwei1].newHh = "";
                            }
                        }
                        outfkey.push("chuan");
                    }
                }
                if (mrhh == "") {
                    this.ctx.throw("mrhh_err");
                }
                oneLinshi = {
                    equipId: equipId,
                    mrhh: mrhh,
                    hh: "",
                    level: level,
                    eps: eps,
                    isNew: 1,
                };
                //扣除宝箱
                info.count += 1;
            }
            else {
                //上面作假 ， 这里不做假
                let cfgEquipBox = gameCfg_1.default.equipBox.getItemCtx(this.ctx, actBox.level.toString());
                let _item = game_1.default.getProbByItems(cfgEquipBox.ePinZhiProb, 0, 1);
                if (_item == null) {
                    this.ctx.throw("获取装备品质失败");
                    return;
                }
                let pinzhi = _item[0];
                newPingJi += parseInt(pinzhi);
                //在根据品质获取 装备种类ID 其实就是部位
                let cfgEInfoList = gameCfg_1.default.equipInfoList.getItemListCtx(this.ctx, pinzhi.toString());
                let _id = game_1.default.getProbRandId(0, cfgEInfoList, "pinzhi");
                if (_id == null || gameMethod_1.gameMethod.isEmpty(cfgEInfoList[_id].id) == true) {
                    this.ctx.throw("抽取装备失败" + _id);
                    return;
                }
                let cfgMath = gameCfg_1.default.mathInfo.getItemCtx(this.ctx, "box_equip_lv");
                if (cfgMath.pram.items == null) {
                    this.ctx.throw("配置错误Math_box_equip_lv");
                    return;
                }
                let _item2 = game_1.default.getProbByItems(cfgMath.pram.items, 0, 1);
                if (_item2 == null) {
                    this.ctx.throw("获取装备等级浮动失败");
                    return;
                }
                let level = Math.max(1, this.ctx.state.level + _item2[0]);
                let equipId = cfgEInfoList[_id].id;
                if (equipId == "") {
                    this.ctx.throw("装备获取失败");
                    tool_1.tool.addServerError(this.ctx.url, tool_1.tool.getParams(this.ctx), {
                        _id: _id,
                        pinzhi: pinzhi,
                        cfgEInfoList: JSON.stringify(cfgEInfoList)
                    });
                    return;
                }
                let cfgElv = gameCfg_1.default.equipLevel.getItemCtx(this.ctx, pinzhi.toString(), level.toString());
                let eps = {};
                eps["hp_max"] = Math.max(0, cfgElv.hp_max + game_1.default.rand(-1 * cfgElv.hp_max_bd, cfgElv.hp_max_bd));
                eps["atk"] = Math.max(0, cfgElv.atk + game_1.default.rand(-1 * cfgElv.atk_bd, cfgElv.atk_bd));
                eps["def"] = Math.max(0, cfgElv.def + game_1.default.rand(-1 * cfgElv.def_bd, cfgElv.def_bd));
                eps["speed"] = Math.max(0, cfgElv.speed + game_1.default.rand(-1 * cfgElv.speed_bd, cfgElv.speed_bd));
                //特殊属性
                let cfgEinfo = gameCfg_1.default.equipInfo.getItemCtx(this.ctx, equipId);
                oneBuwei = cfgEinfo.buwei.toString();
                for (const tcid of cfgEinfo.tsCid) {
                    let cfgTsCList = gameCfg_1.default.equipTsChiList.getItemListCtx(this.ctx, tcid);
                    let _item1 = game_1.default.getProbRandItem(0, cfgTsCList, "prob");
                    if (_item1 == null) {
                        this.ctx.throw("获取装备池子属性失败");
                        return;
                    }
                    let cfgEtsEp = gameCfg_1.default.equipTsEp.getItemCtx(this.ctx, pinzhi.toString(), _item1.epkey);
                    eps[_item1.epkey] = game_1.default.rand(cfgEtsEp.min, cfgEtsEp.max);
                }
                let mrhh = ""; //皮肤
                //根据部位 获取皮肤
                let cfgPifuList = gameCfg_1.default.equipPifuList.getItemList(cfgEinfo.buwei.toString());
                let chouItem = [];
                if (cfgPifuList != null && cfgPifuList.length > 0) {
                    for (const pfinfo of cfgPifuList) {
                        if (pfinfo.limit > 0) {
                            if (info.czpf == null) {
                                continue;
                            }
                            //前置ID
                            let qzid = (parseInt(pfinfo.id) - 1).toString();
                            if (info.czpf[qzid] == null || info.czpf[qzid] < pfinfo.limit) {
                                continue;
                            }
                        }
                        chouItem.push([parseInt(pfinfo.id), pfinfo.prob]);
                    }
                }
                if (chouItem.length > 0) {
                    let _item3 = game_1.default.getProbByItems(chouItem, 0, 1);
                    if (_item3 != null) {
                        mrhh = _item3[0].toString();
                        if (info.chuan[cfgEinfo.buwei.toString()] == null) {
                            info.chuan[cfgEinfo.buwei.toString()] = this.initBuWei();
                        }
                        info.chuan[cfgEinfo.buwei.toString()].newHh = "";
                        if (info.chuan[cfgEinfo.buwei.toString()].hhList[mrhh] == null) {
                            info.chuan[cfgEinfo.buwei.toString()].hhList[mrhh] = 1;
                            info.chuan[cfgEinfo.buwei.toString()].newHh = mrhh;
                            let _buwei1 = cfgEinfo.buwei.toString();
                            if (info.chuan[_buwei1] != null && info.chuan[_buwei1].newHh != "") {
                                let cfgpf = gameCfg_1.default.equipPifu.getItem(info.chuan[_buwei1].newHh);
                                if (cfgpf != null && ['1', '2', '3', '4'].indexOf(_buwei1) != -1 && info.chuan[_buwei1].equipId != "") {
                                    let actTaskMainModel = await ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
                                    if (await actTaskMainModel.kaiqi("6800") == 1) {
                                        this.ctx.state.master.addWin("msg", `获得解锁新${cfgpf.name}换装`);
                                    }
                                }
                                info.chuan[_buwei1].newHh = "";
                            }
                        }
                    }
                    outfkey.push("chuan");
                }
                if (mrhh == "") {
                    this.ctx.throw("mrhh_err");
                }
                oneLinshi = {
                    equipId: equipId,
                    mrhh: mrhh,
                    hh: "",
                    level: level,
                    eps: eps,
                    isNew: 1,
                };
                info.count += 1;
            }
            //记录皮肤抽中次数
            if (info.czpf == null) {
                info.czpf = {};
            }
            if (info.czpf[oneLinshi.mrhh] == null) {
                info.czpf[oneLinshi.mrhh] = 0;
            }
            info.czpf[oneLinshi.mrhh] += 1;
            //有几率获得竞技场门票
            let cfgMath1 = gameCfg_1.default.mathInfo.getItemCtx(this.ctx, "box_open_jjc");
            if (cfgMath1.pram.items == null) {
                this.ctx.throw("配置错误Math_box_open_jjc");
                return;
            }
            let cfgMath2 = gameCfg_1.default.mathInfo.getItemCtx(this.ctx, "jjc_box_max");
            if (cfgMath2.pram.count == null) {
                this.ctx.throw("配置错误Math_jjc_box_max");
                return;
            }
            let maxCount = cfgMath2.pram.count;
            //月卡 终身卡
            let hdPriCardModel = HdPriCardModel_1.HdPriCardModel.getInstance(this.ctx, this.id, Xys_1.PriCardType.fever);
            let hdmoon = await hdPriCardModel.getInfo();
            if (hdmoon.btime < 0 || hdmoon.btime > this.ctx.state.newTime) {
                maxCount += 2;
            }
            //检测是否抽中
            let actTaskMainModel = await ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
            if (await actTaskMainModel.kaiqi("5000") == 1) {
                let actJjcInfoModel = ActJjcInfoModel_1.ActJjcInfoModel.getInstance(this.ctx, this.id);
                let actJjcInfo = await actJjcInfoModel.getInfo();
                if (actJjcInfo.cons < maxCount) {
                    for (const jjcItems of cfgMath1.pram.items) {
                        if (info.jjc >= jjcItems[0] && info.jjc <= jjcItems[1]) {
                            if (game_1.default.rand(1, 10000) <= jjcItems[2]) {
                                info.jjc += 1;
                                await actJjcInfoModel.addCons(1);
                                this.ctx.state.master.addWin("msg", "获得斗法-战旗X1");
                            }
                            break;
                        }
                    }
                }
            }
            //首次开箱 完成邀请
            if (info.count <= 1) {
                //邀请类 . 尝试触发
                //获取 uid
                //加角色经验
                let userModel = await UserModel_1.UserModel.getInstance(this.ctx, this.id);
                let myuid = (await userModel.getInfo()).uid;
                //play类
                let playerModel = PlayerModel_1.PlayerModel.getInstance(this.ctx, myuid);
                //我是不是别人邀请进来的
                let pinfo = await playerModel.getInfo();
                if (gameMethod_1.gameMethod.isEmpty(pinfo.invuuid) != true && pinfo.invuuid != "no") {
                    //去找这个人 给他完成邀请任务
                    let fuuid = pinfo.invuuid;
                    await lock_1.default.setLock(this.ctx, "user", fuuid); //枷锁
                    this.ctx.state.fuuid = fuuid;
                    let actInviteModel = ActInviteModel_1.ActInviteModel.getInstance(this.ctx, fuuid);
                    await actInviteModel.invs_add(myuid);
                    this.ctx.state.fuuid = "";
                }
            }
            if (oneLinshi.equipId == "" || oneBuwei == "") {
                this.ctx.throw("开启失败");
            }
            if (info.chuan[oneBuwei] == null) {
                newPingJi += 400;
            }
            else {
                let myatk = info.chuan[oneBuwei].eps["atk"] == null ? 0 : info.chuan[oneBuwei].eps["atk"];
                let mydef = info.chuan[oneBuwei].eps["def"] == null ? 0 : info.chuan[oneBuwei].eps["def"];
                let myspeed = info.chuan[oneBuwei].eps["speed"] == null ? 0 : info.chuan[oneBuwei].eps["speed"];
                let myhp = info.chuan[oneBuwei].eps["hp_max"] == null ? 0 : info.chuan[oneBuwei].eps["hp_max"];
                let fatk = oneLinshi.eps["atk"] == null ? 0 : oneLinshi.eps["atk"];
                let fdef = oneLinshi.eps["def"] == null ? 0 : oneLinshi.eps["def"];
                let fspeed = oneLinshi.eps["speed"] == null ? 0 : oneLinshi.eps["speed"];
                let fhp = oneLinshi.eps["hp_max"] == null ? 0 : oneLinshi.eps["hp_max"];
                if (fatk > myatk) {
                    newPingJi += 100;
                }
                if (mydef > fdef) {
                    newPingJi += 100;
                }
                if (myspeed > fspeed) {
                    newPingJi += 100;
                }
                if (myhp > fhp) {
                    newPingJi += 100;
                }
            }
            //优胜劣汰
            if (newPingJi >= info.pingji) {
                info.linshi = gameMethod_1.gameMethod.objCopy(oneLinshi);
                info.pingji = newPingJi;
            }
        }
        let lastBuwei = gameCfg_1.default.equipInfo.getItemCtx(this.ctx, info.linshi.equipId).buwei;
        //临时给前端展示
        info.linshiOld = {
            //开启宝箱临时的装备列表
            equipId: "",
            mrhh: "",
            hh: "",
            level: 0,
            eps: {},
            isNew: 0,
        };
        if (info.chuan[lastBuwei] != null) {
            info.linshiOld.equipId = info.chuan[lastBuwei].equipId;
            info.linshiOld.mrhh = info.chuan[lastBuwei].equipId == "" ? "" : info.chuan[lastBuwei].mrhh;
            info.linshiOld.hh = info.chuan[lastBuwei].hh;
            info.linshiOld.level = info.chuan[lastBuwei].level;
            info.linshiOld.eps = info.chuan[lastBuwei].eps;
            info.linshiOld.isNew = 0;
        }
        await this.update(info, outfkey);
        await hook_1.hookNote(this.ctx, "boxOpen", info.openCount);
    }
    /**
     *  开启宝箱 (20230719版本)
     *  倍数开鼎直接把几率乘以几倍之后去抽，不用循环两次。
     */
    async openBoxNew1() {
        let info = await this.getInfo();
        if (info.linshi.equipId != "") {
            await this.backData();
            return; //还没展示完
        }
        //检测是否开加速器
        if (info.opAt != null && info.opAt >= this.ctx.state.newTime) {
            this.ctx.throw(502, "本地时间异常,请重新登录");
        }
        info.opAt = this.ctx.state.newTime;
        info.openCount = 1;
        let actBoxModel = ActBoxModel_1.ActBoxModel.getInstance(this.ctx, this.id);
        let actBox = await actBoxModel.getInfo();
        if (gameMethod_1.gameMethod.isEmpty(actBox.fangan) == false) {
            let fangan = JSON.parse(actBox.fangan);
            if (fangan != null && fangan["7"] != null && fangan["7"]["openCount"] != null) {
                info.openCount = fangan["7"]["openCount"];
            }
        }
        if (info.openCount < 1) {
            info.openCount = 1;
        }
        if (info.box < info.openCount) {
            this.ctx.throw("鼎炉不足");
        }
        info.box -= info.openCount;
        let outfkey = ["box", "jjc", "linshi", "linshiOld", "linshi95"];
        //初始化临时装备
        info.linshi = {
            equipId: "",
            mrhh: "",
            hh: "",
            level: 0,
            eps: {},
            isNew: 1,
        };
        //单次获取临时存储
        let oneLinshi = {
            equipId: "",
            mrhh: "",
            hh: "",
            level: 0,
            eps: {},
            isNew: 1,
        };
        let oneBuwei = "";
        let cfgZj = gameCfg_1.default.equipZuojia.getItem((info.count + 1).toString());
        if (cfgZj != null) { //作假
            let pinzhi = cfgZj.pinzhi;
            let cfgInfobp = gameCfg_1.default.equipBuweipinz.getItemCtx(this.ctx, cfgZj.buwei, cfgZj.pinzhi);
            oneBuwei = cfgZj.buwei;
            let level = cfgZj.level;
            let equipId = cfgInfobp.id;
            let cfgElv = gameCfg_1.default.equipLevel.getItemCtx(this.ctx, pinzhi.toString(), level.toString());
            let eps = {};
            eps["hp_max"] = Math.max(0, cfgElv.hp_max + game_1.default.rand(-1 * cfgElv.hp_max_bd, cfgElv.hp_max_bd));
            eps["atk"] = Math.max(0, cfgElv.atk + game_1.default.rand(-1 * cfgElv.atk_bd, cfgElv.atk_bd));
            eps["def"] = Math.max(0, cfgElv.def + game_1.default.rand(-1 * cfgElv.def_bd, cfgElv.def_bd));
            eps["speed"] = Math.max(0, cfgElv.speed + game_1.default.rand(-1 * cfgElv.speed_bd, cfgElv.speed_bd));
            //特殊属性
            for (const tcid of cfgInfobp.tsCid) {
                let cfgTsCList = gameCfg_1.default.equipTsChiList.getItemListCtx(this.ctx, tcid);
                let _item1 = game_1.default.getProbRandItem(0, cfgTsCList, "prob");
                if (_item1 == null) {
                    this.ctx.throw("获取装备池子属性失败");
                    return;
                }
                let cfgEtsEp = gameCfg_1.default.equipTsEp.getItemCtx(this.ctx, pinzhi.toString(), _item1.epkey);
                eps[_item1.epkey] = game_1.default.rand(cfgEtsEp.min, cfgEtsEp.max);
            }
            let mrhh = ""; //皮肤
            //根据部位 获取皮肤
            let cfgPifuList = gameCfg_1.default.equipPifuList.getItemList(cfgZj.buwei);
            let chouItem = [];
            if (cfgPifuList != null && cfgPifuList.length > 0) {
                for (const pfinfo of cfgPifuList) {
                    if (pfinfo.limit > 0) {
                        if (info.czpf == null) {
                            continue;
                        }
                        //前置ID
                        let qzid = (parseInt(pfinfo.id) - 1).toString();
                        if (info.czpf[qzid] == null || info.czpf[qzid] < pfinfo.limit) {
                            continue;
                        }
                    }
                    chouItem.push([parseInt(pfinfo.id), pfinfo.prob]);
                }
            }
            if (chouItem.length > 0) {
                let _item3 = game_1.default.getProbByItems(chouItem, 0, 1);
                if (_item3 != null) {
                    mrhh = _item3[0].toString();
                    if (info.chuan[cfgZj.buwei] == null) {
                        info.chuan[cfgZj.buwei] = this.initBuWei();
                    }
                    info.chuan[cfgZj.buwei].newHh = "";
                    if (info.chuan[cfgZj.buwei].hhList[mrhh] == null) {
                        info.chuan[cfgZj.buwei].hhList[mrhh] = 1;
                        info.chuan[cfgZj.buwei].newHh = mrhh;
                        let _buwei1 = cfgZj.buwei.toString();
                        if (info.chuan[_buwei1] != null && info.chuan[_buwei1].newHh != "") {
                            let cfgpf = gameCfg_1.default.equipPifu.getItem(info.chuan[_buwei1].newHh);
                            if (cfgpf != null && ['1', '2', '3', '4'].indexOf(_buwei1) != -1 && info.chuan[_buwei1].equipId != "") {
                                let actTaskMainModel = await ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
                                if (await actTaskMainModel.kaiqi("6800") == 1) {
                                    this.ctx.state.master.addWin("msg", `获得解锁新${cfgpf.name}换装`);
                                }
                            }
                            info.chuan[_buwei1].newHh = "";
                        }
                    }
                    outfkey.push("chuan");
                }
            }
            if (mrhh == "") {
                this.ctx.throw("mrhh_err");
            }
            oneLinshi = {
                equipId: equipId,
                mrhh: mrhh,
                hh: "",
                level: level,
                eps: eps,
                isNew: 1,
            };
            //扣除宝箱
            info.count += 1;
        }
        else {
            //上面作假 ， 这里不做假
            let cfgEquipBox = gameCfg_1.default.equipBox.getItemCtx(this.ctx, actBox.level.toString());
            let ePinZhiProb = [];
            for (const ePinZhi of cfgEquipBox.ePinZhiProb) {
                if (ePinZhi[1] == 0) {
                    continue;
                }
                if (ePinZhi[0] == 1) {
                    ePinZhiProb.push([ePinZhi[0], Math.floor(ePinZhi[1] / info.openCount)]);
                }
                else {
                    ePinZhiProb.push([ePinZhi[0], ePinZhi[1] * info.openCount]);
                }
            }
            let _item = game_1.default.getProbByItems(ePinZhiProb, 0, 1);
            if (_item == null) {
                this.ctx.throw("获取装备品质失败");
                return;
            }
            let pinzhi = _item[0];
            //在根据品质获取 装备种类ID 其实就是部位
            let cfgEInfoList = gameCfg_1.default.equipInfoList.getItemListCtx(this.ctx, pinzhi.toString());
            let _id = game_1.default.getProbRandId(0, cfgEInfoList, "pinzhi");
            if (_id == null || gameMethod_1.gameMethod.isEmpty(cfgEInfoList[_id].id) == true) {
                this.ctx.throw("抽取装备失败" + _id);
                return;
            }
            let cfgMath = gameCfg_1.default.mathInfo.getItemCtx(this.ctx, "box_equip_lv");
            if (cfgMath.pram.items == null) {
                this.ctx.throw("配置错误Math_box_equip_lv");
                return;
            }
            let _item2 = game_1.default.getProbByItems(cfgMath.pram.items, 0, 1);
            if (_item2 == null) {
                this.ctx.throw("获取装备等级浮动失败");
                return;
            }
            let level = Math.max(1, this.ctx.state.level + _item2[0]);
            let equipId = cfgEInfoList[_id].id;
            if (equipId == "") {
                this.ctx.throw("装备获取失败");
                tool_1.tool.addServerError(this.ctx.url, tool_1.tool.getParams(this.ctx), {
                    _id: _id,
                    pinzhi: pinzhi,
                    cfgEInfoList: JSON.stringify(cfgEInfoList)
                });
                return;
            }
            let cfgElv = gameCfg_1.default.equipLevel.getItemCtx(this.ctx, pinzhi.toString(), level.toString());
            let eps = {};
            eps["hp_max"] = Math.max(0, cfgElv.hp_max + game_1.default.rand(-1 * cfgElv.hp_max_bd, cfgElv.hp_max_bd));
            eps["atk"] = Math.max(0, cfgElv.atk + game_1.default.rand(-1 * cfgElv.atk_bd, cfgElv.atk_bd));
            eps["def"] = Math.max(0, cfgElv.def + game_1.default.rand(-1 * cfgElv.def_bd, cfgElv.def_bd));
            eps["speed"] = Math.max(0, cfgElv.speed + game_1.default.rand(-1 * cfgElv.speed_bd, cfgElv.speed_bd));
            //特殊属性
            let cfgEinfo = gameCfg_1.default.equipInfo.getItemCtx(this.ctx, equipId);
            oneBuwei = cfgEinfo.buwei.toString();
            for (const tcid of cfgEinfo.tsCid) {
                let cfgTsCList = gameCfg_1.default.equipTsChiList.getItemListCtx(this.ctx, tcid);
                let _item1 = game_1.default.getProbRandItem(0, cfgTsCList, "prob");
                if (_item1 == null) {
                    this.ctx.throw("获取装备池子属性失败");
                    return;
                }
                let cfgEtsEp = gameCfg_1.default.equipTsEp.getItemCtx(this.ctx, pinzhi.toString(), _item1.epkey);
                eps[_item1.epkey] = game_1.default.rand(cfgEtsEp.min, cfgEtsEp.max);
            }
            let mrhh = ""; //皮肤
            //根据部位 获取皮肤
            let cfgPifuList = gameCfg_1.default.equipPifuList.getItemList(cfgEinfo.buwei.toString());
            let chouItem = [];
            if (cfgPifuList != null && cfgPifuList.length > 0) {
                for (const pfinfo of cfgPifuList) {
                    if (pfinfo.limit > 0) {
                        if (info.czpf == null) {
                            continue;
                        }
                        //前置ID
                        let qzid = (parseInt(pfinfo.id) - 1).toString();
                        if (info.czpf[qzid] == null || info.czpf[qzid] < pfinfo.limit) {
                            continue;
                        }
                    }
                    chouItem.push([parseInt(pfinfo.id), pfinfo.prob]);
                }
            }
            if (chouItem.length > 0) {
                let _item3 = game_1.default.getProbByItems(chouItem, 0, 1);
                if (_item3 != null) {
                    mrhh = _item3[0].toString();
                    if (info.chuan[cfgEinfo.buwei.toString()] == null) {
                        info.chuan[cfgEinfo.buwei.toString()] = this.initBuWei();
                    }
                    info.chuan[cfgEinfo.buwei.toString()].newHh = "";
                    if (info.chuan[cfgEinfo.buwei.toString()].hhList[mrhh] == null) {
                        info.chuan[cfgEinfo.buwei.toString()].hhList[mrhh] = 1;
                        info.chuan[cfgEinfo.buwei.toString()].newHh = mrhh;
                        let _buwei1 = cfgEinfo.buwei.toString();
                        if (info.chuan[_buwei1] != null && info.chuan[_buwei1].newHh != "") {
                            let cfgpf = gameCfg_1.default.equipPifu.getItem(info.chuan[_buwei1].newHh);
                            if (cfgpf != null && ['1', '2', '3', '4'].indexOf(_buwei1) != -1 && info.chuan[_buwei1].equipId != "") {
                                let actTaskMainModel = await ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
                                if (await actTaskMainModel.kaiqi("6800") == 1) {
                                    this.ctx.state.master.addWin("msg", `获得解锁新${cfgpf.name}换装`);
                                }
                            }
                            info.chuan[_buwei1].newHh = "";
                        }
                    }
                }
                outfkey.push("chuan");
            }
            if (mrhh == "") {
                this.ctx.throw("mrhh_err");
            }
            oneLinshi = {
                equipId: equipId,
                mrhh: mrhh,
                hh: "",
                level: level,
                eps: eps,
                isNew: 1,
            };
            info.count += 1;
        }
        //记录皮肤抽中次数
        if (info.czpf == null) {
            info.czpf = {};
        }
        if (info.czpf[oneLinshi.mrhh] == null) {
            info.czpf[oneLinshi.mrhh] = 0;
        }
        info.czpf[oneLinshi.mrhh] += 1;
        //有几率获得竞技场门票
        let cfgMath1 = gameCfg_1.default.mathInfo.getItemCtx(this.ctx, "box_open_jjc");
        if (cfgMath1.pram.items == null) {
            this.ctx.throw("配置错误Math_box_open_jjc");
            return;
        }
        let cfgMath2 = gameCfg_1.default.mathInfo.getItemCtx(this.ctx, "jjc_box_max");
        if (cfgMath2.pram.count == null) {
            this.ctx.throw("配置错误Math_jjc_box_max");
            return;
        }
        let maxCount = cfgMath2.pram.count;
        //月卡 终身卡
        let hdPriCardModel = HdPriCardModel_1.HdPriCardModel.getInstance(this.ctx, this.id, Xys_1.PriCardType.fever);
        let hdmoon = await hdPriCardModel.getInfo();
        if (hdmoon.btime < 0 || hdmoon.btime > this.ctx.state.newTime) {
            maxCount += 2;
        }
        //检测是否抽中
        let actTaskMainModel = await ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
        if (await actTaskMainModel.kaiqi("5000") == 1) {
            let actJjcInfoModel = ActJjcInfoModel_1.ActJjcInfoModel.getInstance(this.ctx, this.id);
            let actJjcInfo = await actJjcInfoModel.getInfo();
            if (actJjcInfo.cons < maxCount) {
                for (const jjcItems of cfgMath1.pram.items) {
                    if (info.jjc >= jjcItems[0] && info.jjc <= jjcItems[1]) {
                        if (game_1.default.rand(1, 10000) <= jjcItems[2] * info.openCount) {
                            info.jjc += 1;
                            await actJjcInfoModel.addCons(1);
                            this.ctx.state.master.addWin("msg", "获得斗法-战旗X1");
                        }
                        break;
                    }
                }
            }
        }
        //首次开箱 完成邀请
        if (info.count <= 1) {
            //邀请类 . 尝试触发
            //获取 uid
            //加角色经验
            let userModel = await UserModel_1.UserModel.getInstance(this.ctx, this.id);
            let myuid = (await userModel.getInfo()).uid;
            //play类
            let playerModel = PlayerModel_1.PlayerModel.getInstance(this.ctx, myuid);
            //我是不是别人邀请进来的
            let pinfo = await playerModel.getInfo();
            if (gameMethod_1.gameMethod.isEmpty(pinfo.invuuid) != true && pinfo.invuuid != "no") {
                //去找这个人 给他完成邀请任务
                let fuuid = pinfo.invuuid;
                await lock_1.default.setLock(this.ctx, "user", fuuid); //枷锁
                this.ctx.state.fuuid = fuuid;
                let actInviteModel = ActInviteModel_1.ActInviteModel.getInstance(this.ctx, fuuid);
                await actInviteModel.invs_add(myuid);
                this.ctx.state.fuuid = "";
            }
        }
        if (oneLinshi.equipId == "" || oneBuwei == "") {
            this.ctx.throw("开启失败");
        }
        info.linshi = gameMethod_1.gameMethod.objCopy(oneLinshi);
        let cfgLs = gameCfg_1.default.equipInfo.getItemCtx(this.ctx, info.linshi.equipId);
        let lastBuwei = cfgLs.buwei;
        //临时给前端展示
        info.linshiOld = {
            //开启宝箱临时的装备列表
            equipId: "",
            mrhh: "",
            hh: "",
            level: 0,
            eps: {},
            isNew: 0,
        };
        if (info.chuan[lastBuwei] != null) {
            info.linshiOld.equipId = info.chuan[lastBuwei].equipId;
            info.linshiOld.mrhh = info.chuan[lastBuwei].equipId == "" ? "" : info.chuan[lastBuwei].mrhh;
            info.linshiOld.hh = info.chuan[lastBuwei].hh;
            info.linshiOld.level = info.chuan[lastBuwei].level;
            info.linshiOld.eps = info.chuan[lastBuwei].eps;
            info.linshiOld.isNew = 0;
        }
        await this.update(info, outfkey);
        await hook_1.hookNote(this.ctx, "boxOpen", info.openCount);
    }
    /**
     *  新版开宝箱95 (20230905)
     *  needNum  消耗宝箱个数
     */
    async openBox95(needNum) {
        let info = await this.getInfo();
        //检测是否开加速器
        if (info.opAt != null && info.opAt >= this.ctx.state.newTime) {
            this.ctx.throw(502, "本地时间异常,请重新登录");
        }
        if (needNum < 1) {
            this.ctx.throw("参数错误");
        }
        if (info.box < needNum) {
            this.ctx.throw("鼎炉不足");
        }
        info.opAt = this.ctx.state.newTime;
        info.box -= needNum;
        info.linshi95 = {};
        info.linshi = {
            equipId: "",
            mrhh: "",
            hh: "",
            level: 0,
            eps: {},
            isNew: 0,
        };
        info.linshiOld = {
            equipId: "",
            mrhh: "",
            hh: "",
            level: 0,
            eps: {},
            isNew: 0,
        };
        let outfkey = ["box", "jjc", "linshi", "linshiOld", "linshi95"];
        //加角色经验
        let actBoxModel = ActBoxModel_1.ActBoxModel.getInstance(this.ctx, this.id);
        let actBox = await actBoxModel.getInfo();
        //道友数据
        let actDaoyouModel = ActDaoyouModel_1.ActDaoyouModel.getInstance(this.ctx, this.id);
        let fangan;
        if (gameMethod_1.gameMethod.isEmpty(actBox.fangan) == false) {
            fangan = JSON.parse(actBox.fangan);
        }
        //有几率获得竞技场门票
        let cfgMath1 = gameCfg_1.default.mathInfo.getItemCtx(this.ctx, "box_open_jjc");
        if (cfgMath1.pram.items == null) {
            this.ctx.throw("配置错误Math_box_open_jjc");
        }
        let cfgMath2 = gameCfg_1.default.mathInfo.getItemCtx(this.ctx, "jjc_box_max");
        if (cfgMath2.pram.count == null) {
            this.ctx.throw("配置错误Math_jjc_box_max");
        }
        let maxCount = cfgMath2.pram.count;
        //月卡 终身卡
        let hdPriCardModel = HdPriCardModel_1.HdPriCardModel.getInstance(this.ctx, this.id, Xys_1.PriCardType.fever);
        let hdmoon = await hdPriCardModel.getInfo();
        if (hdmoon.btime < 0 || hdmoon.btime > this.ctx.state.newTime) {
            maxCount += 2;
        }
        let actTaskMainModel = await ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
        let actJjcInfoModel = ActJjcInfoModel_1.ActJjcInfoModel.getInstance(this.ctx, this.id);
        let actJjcInfo = await actJjcInfoModel.getInfo();
        let ssitems = [];
        for (let index = 1; index <= needNum; index++) {
            let xhid = index.toString();
            let cfgZj = gameCfg_1.default.equipZuojia.getItem((info.count + 1).toString());
            if (cfgZj != null) { //作假
                let pinzhi = cfgZj.pinzhi;
                let cfgInfobp = gameCfg_1.default.equipBuweipinz.getItemCtx(this.ctx, cfgZj.buwei, cfgZj.pinzhi);
                let level = cfgZj.level;
                let equipId = cfgInfobp.id;
                let cfgElv = gameCfg_1.default.equipLevel.getItemCtx(this.ctx, pinzhi.toString(), level.toString());
                let eps = {};
                eps["hp_max"] = Math.max(0, cfgElv.hp_max + game_1.default.rand(-1 * cfgElv.hp_max_bd, cfgElv.hp_max_bd));
                eps["atk"] = Math.max(0, cfgElv.atk + game_1.default.rand(-1 * cfgElv.atk_bd, cfgElv.atk_bd));
                eps["def"] = Math.max(0, cfgElv.def + game_1.default.rand(-1 * cfgElv.def_bd, cfgElv.def_bd));
                eps["speed"] = Math.max(0, cfgElv.speed + game_1.default.rand(-1 * cfgElv.speed_bd, cfgElv.speed_bd));
                //特殊属性
                for (const tcid of cfgInfobp.tsCid) {
                    let cfgTsCList = gameCfg_1.default.equipTsChiList.getItemListCtx(this.ctx, tcid);
                    let temp_cfgTsCList = gameMethod_1.gameMethod.objCopy(cfgTsCList);
                    if (fangan) {
                        //道友提升选中方案的概率
                        let totalSkillRate = await actDaoyouModel.getDaoYouSkill("2");
                        if (totalSkillRate) {
                            if (fangan["1"]["isCheck"]) {
                                let upEp = fangan["1"]["ep2"];
                                let upEp1 = fangan["1"]["ep1"];
                                for (const temp_ep of temp_cfgTsCList) {
                                    if (temp_ep.epkey === upEp) {
                                        temp_ep.prob *= (1 + totalSkillRate);
                                        continue;
                                    }
                                    if (temp_ep.epkey === upEp1) {
                                        temp_ep.prob *= (1 + totalSkillRate);
                                    }
                                }
                            }
                            if (fangan["2"]["isCheck"]) {
                                let upEp = fangan["2"]["ep2"];
                                let upEp1 = fangan["2"]["ep1"];
                                for (const temp_ep of temp_cfgTsCList) {
                                    if (temp_ep.epkey === upEp && upEp !== fangan["1"]["ep2"]) {
                                        temp_ep.prob *= (1 + totalSkillRate);
                                        continue;
                                    }
                                    if (temp_ep.epkey === upEp1 && upEp1 !== fangan["1"]["ep1"]) {
                                        temp_ep.prob *= (1 + totalSkillRate);
                                    }
                                }
                            }
                        }
                    }
                    let _item1 = game_1.default.getProbRandItem(0, cfgTsCList, "prob");
                    if (_item1 == null) {
                        this.ctx.throw("获取装备池子属性失败");
                        return;
                    }
                    let cfgEtsEp = gameCfg_1.default.equipTsEp.getItemCtx(this.ctx, pinzhi.toString(), _item1.epkey);
                    eps[_item1.epkey] = game_1.default.rand(cfgEtsEp.min, cfgEtsEp.max);
                }
                let mrhh = ""; //皮肤
                //根据部位 获取皮肤
                let cfgPifuList = gameCfg_1.default.equipPifuList.getItemList(cfgZj.buwei);
                let chouItem = [];
                if (cfgPifuList != null && cfgPifuList.length > 0) {
                    for (const pfinfo of cfgPifuList) {
                        if (pfinfo.limit > 0) {
                            if (info.czpf == null) {
                                continue;
                            }
                            //前置ID
                            let qzid = (parseInt(pfinfo.id) - 1).toString();
                            if (info.czpf[qzid] == null || info.czpf[qzid] < pfinfo.limit) {
                                continue;
                            }
                        }
                        chouItem.push([parseInt(pfinfo.id), pfinfo.prob]);
                    }
                }
                if (chouItem.length > 0) {
                    let _item3 = game_1.default.getProbByItems(chouItem, 0, 1);
                    if (_item3 != null) {
                        mrhh = _item3[0].toString();
                        if (info.chuan[cfgZj.buwei] == null) {
                            info.chuan[cfgZj.buwei] = this.initBuWei();
                        }
                        info.chuan[cfgZj.buwei].newHh = "";
                        if (info.chuan[cfgZj.buwei].hhList[mrhh] == null) {
                            info.chuan[cfgZj.buwei].hhList[mrhh] = 1;
                            info.chuan[cfgZj.buwei].newHh = mrhh;
                            let _buwei1 = cfgZj.buwei.toString();
                            if (info.chuan[_buwei1] != null && info.chuan[_buwei1].newHh != "") {
                                let cfgpf = gameCfg_1.default.equipPifu.getItem(info.chuan[_buwei1].newHh);
                                if (cfgpf != null && ['1', '2', '3', '4'].indexOf(_buwei1) != -1 && info.chuan[_buwei1].equipId != "") {
                                    let actTaskMainModel = await ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
                                    if (await actTaskMainModel.kaiqi("6800") == 1) {
                                        this.ctx.state.master.addWin("msg", `获得解锁新${cfgpf.name}换装`);
                                    }
                                }
                                info.chuan[_buwei1].newHh = "";
                            }
                        }
                        outfkey.push("chuan");
                    }
                }
                if (mrhh == "") {
                    this.ctx.throw("mrhh_err");
                }
                info.linshi95[xhid] = {
                    equipId: equipId,
                    mrhh: mrhh,
                    hh: "",
                    level: level,
                    eps: eps,
                    isNew: 1,
                };
                let cfgss = gameCfg_1.default.equipInfo.getItemCtx(this.ctx, equipId);
                ssitems.push([cfgss.name, cfgss.pinzhi, level]);
            }
            else {
                //上面作假 ， 这里不做假
                let cfgEquipBox = gameCfg_1.default.equipBox.getItemCtx(this.ctx, actBox.level.toString());
                let ePinZhiProb = [];
                for (const ePinZhi of cfgEquipBox.ePinZhiProb) {
                    if (ePinZhi[1] == 0) {
                        continue;
                    }
                    ePinZhiProb.push([ePinZhi[0], ePinZhi[1]]);
                }
                let _item = game_1.default.getProbByItems(ePinZhiProb, 0, 1);
                if (_item == null) {
                    this.ctx.throw("获取装备品质失败"); //101832
                }
                let pinzhi = _item[0];
                //在根据品质获取 装备种类ID 其实就是部位
                let cfgEInfoList = gameCfg_1.default.equipInfoList.getItemListCtx(this.ctx, pinzhi.toString());
                let _id = game_1.default.getProbRandId(0, cfgEInfoList, "pinzhi");
                if (_id == null || gameMethod_1.gameMethod.isEmpty(cfgEInfoList[_id].id) == true) {
                    this.ctx.throw("抽取装备失败" + _id);
                    return;
                }
                let cfgMath = gameCfg_1.default.mathInfo.getItemCtx(this.ctx, "box_equip_lv");
                if (cfgMath.pram.items == null) {
                    this.ctx.throw("配置错误Math_box_equip_lv");
                    return;
                }
                let _item2 = game_1.default.getProbByItems(cfgMath.pram.items, 0, 1);
                if (_item2 == null) {
                    this.ctx.throw("获取装备等级浮动失败");
                    return;
                }
                let level = Math.max(1, this.ctx.state.level + _item2[0]);
                let equipId = cfgEInfoList[_id].id;
                if (equipId == "") {
                    this.ctx.throw("装备获取失败");
                    return;
                }
                let cfgElv = gameCfg_1.default.equipLevel.getItemCtx(this.ctx, pinzhi.toString(), level.toString());
                let eps = {};
                eps["hp_max"] = Math.max(0, cfgElv.hp_max + game_1.default.rand(-1 * cfgElv.hp_max_bd, cfgElv.hp_max_bd));
                eps["atk"] = Math.max(0, cfgElv.atk + game_1.default.rand(-1 * cfgElv.atk_bd, cfgElv.atk_bd));
                eps["def"] = Math.max(0, cfgElv.def + game_1.default.rand(-1 * cfgElv.def_bd, cfgElv.def_bd));
                eps["speed"] = Math.max(0, cfgElv.speed + game_1.default.rand(-1 * cfgElv.speed_bd, cfgElv.speed_bd));
                //特殊属性
                let cfgEinfo = gameCfg_1.default.equipInfo.getItemCtx(this.ctx, equipId);
                for (const tcid of cfgEinfo.tsCid) {
                    let cfgTsCList = gameCfg_1.default.equipTsChiList.getItemListCtx(this.ctx, tcid);
                    let temp_cfgTsCList = gameMethod_1.gameMethod.objCopy(cfgTsCList);
                    if (fangan) {
                        //道友提升选中方案的概率
                        let totalSkillRate = await actDaoyouModel.getDaoYouSkill("2");
                        if (totalSkillRate) {
                            //提升方案1的品质权重
                            if (fangan["1"]["isCheck"]) {
                                let upEp = fangan["1"]["ep2"];
                                let upEp1 = fangan["1"]["ep1"];
                                for (const temp_ep of temp_cfgTsCList) {
                                    if (temp_ep.epkey === upEp) {
                                        temp_ep.prob *= (1 + totalSkillRate);
                                        continue;
                                    }
                                    if (temp_ep.epkey === upEp1) {
                                        temp_ep.prob *= (1 + totalSkillRate);
                                    }
                                }
                            }
                            //
                            if (fangan["2"]["isCheck"]) {
                                let upEp = fangan["2"]["ep2"];
                                let upEp1 = fangan["2"]["ep1"];
                                for (const temp_ep of temp_cfgTsCList) {
                                    if (temp_ep.epkey === upEp && upEp !== fangan["1"]["ep2"]) {
                                        temp_ep.prob *= (1 + totalSkillRate);
                                        continue;
                                    }
                                    if (temp_ep.epkey === upEp1 && upEp1 !== fangan["1"]["ep1"]) {
                                        temp_ep.prob *= (1 + totalSkillRate);
                                    }
                                }
                            }
                        }
                    }
                    let _item1 = game_1.default.getProbRandItem(0, temp_cfgTsCList, "prob");
                    if (_item1 == null) {
                        this.ctx.throw("获取装备池子属性失败");
                        return;
                    }
                    let cfgEtsEp = gameCfg_1.default.equipTsEp.getItemCtx(this.ctx, pinzhi.toString(), _item1.epkey);
                    eps[_item1.epkey] = game_1.default.rand(cfgEtsEp.min, cfgEtsEp.max);
                }
                let mrhh = ""; //皮肤
                //根据部位 获取皮肤
                let cfgPifuList = gameCfg_1.default.equipPifuList.getItemList(cfgEinfo.buwei.toString());
                let chouItem = [];
                if (cfgPifuList != null && cfgPifuList.length > 0) {
                    for (const pfinfo of cfgPifuList) {
                        if (pfinfo.limit > 0) {
                            if (info.czpf == null) {
                                continue;
                            }
                            //前置ID
                            let qzid = (parseInt(pfinfo.id) - 1).toString();
                            if (info.czpf[qzid] == null || info.czpf[qzid] < pfinfo.limit) {
                                continue;
                            }
                        }
                        chouItem.push([parseInt(pfinfo.id), pfinfo.prob]);
                    }
                }
                if (chouItem.length > 0) {
                    let _item3 = game_1.default.getProbByItems(chouItem, 0, 1);
                    if (_item3 != null) {
                        mrhh = _item3[0].toString();
                        if (info.chuan[cfgEinfo.buwei.toString()] == null) {
                            info.chuan[cfgEinfo.buwei.toString()] = this.initBuWei();
                        }
                        info.chuan[cfgEinfo.buwei.toString()].newHh = "";
                        if (info.chuan[cfgEinfo.buwei.toString()].hhList[mrhh] == null) {
                            info.chuan[cfgEinfo.buwei.toString()].hhList[mrhh] = 1;
                            info.chuan[cfgEinfo.buwei.toString()].newHh = mrhh;
                            let _buwei1 = cfgEinfo.buwei.toString();
                            if (info.chuan[_buwei1] != null && info.chuan[_buwei1].newHh != "") {
                                let cfgpf = gameCfg_1.default.equipPifu.getItem(info.chuan[_buwei1].newHh);
                                if (cfgpf != null && ['1', '2', '3', '4'].indexOf(_buwei1) != -1 && info.chuan[_buwei1].equipId != "") {
                                    let actTaskMainModel = await ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
                                    if (await actTaskMainModel.kaiqi("6800") == 1) {
                                        this.ctx.state.master.addWin("msg", `获得解锁新${cfgpf.name}换装`);
                                    }
                                }
                                info.chuan[_buwei1].newHh = "";
                            }
                        }
                    }
                    outfkey.push("chuan");
                }
                if (mrhh == "") {
                    this.ctx.throw("mrhh_err");
                }
                info.linshi95[xhid] = {
                    equipId: equipId,
                    mrhh: mrhh,
                    hh: "",
                    level: level,
                    eps: eps,
                    isNew: 1,
                };
                ssitems.push([cfgEinfo.name, cfgEinfo.pinzhi, level]);
            }
            info.count += 1;
            //记录皮肤抽中次数
            if (info.czpf[info.linshi95[xhid].mrhh] == null) {
                info.czpf[info.linshi95[xhid].mrhh] = 0;
            }
            info.czpf[info.linshi95[xhid].mrhh] += 1;
            //检测是否抽中
            if (await actTaskMainModel.kaiqi("5000") == 1) {
                if (actJjcInfo.cons < maxCount) {
                    for (const jjcItems of cfgMath1.pram.items) {
                        if (info.jjc >= jjcItems[0] && info.jjc <= jjcItems[1]) {
                            if (game_1.default.rand(1, 10000) <= jjcItems[2]) {
                                info.jjc += 1;
                                await actJjcInfoModel.addCons(1);
                                this.ctx.state.master.addWin("msg", "获得斗法-战旗X1");
                            }
                            break;
                        }
                    }
                }
            }
            //首次开箱 完成邀请
            if (info.count <= 1) {
                //邀请类 . 尝试触发
                //获取 uid
                //加角色经验
                let userModel = await UserModel_1.UserModel.getInstance(this.ctx, this.id);
                let myuid = (await userModel.getInfo()).uid;
                //play类
                let playerModel = PlayerModel_1.PlayerModel.getInstance(this.ctx, myuid);
                //我是不是别人邀请进来的
                let pinfo = await playerModel.getInfo();
                if (gameMethod_1.gameMethod.isEmpty(pinfo.invuuid) != true && pinfo.invuuid != "no") {
                    //去找这个人 给他完成邀请任务
                    let fuuid = pinfo.invuuid;
                    await lock_1.default.setLock(this.ctx, "user", fuuid); //枷锁
                    this.ctx.state.fuuid = fuuid;
                    let actInviteModel = ActInviteModel_1.ActInviteModel.getInstance(this.ctx, fuuid);
                    await actInviteModel.invs_add(myuid);
                    this.ctx.state.fuuid = "";
                }
            }
            if (info.linshi95[xhid].equipId == "") {
                this.ctx.throw("开启失败");
            }
        }
        await this.update(info, outfkey);
        await hook_1.hookNote(this.ctx, "boxOpen", needNum);
    }
    /**
     * 分解
     * @param xhId 宝箱临时列表序号ID
     */
    async xuanzhong(xbid) {
        let info = await this.getInfo();
        if (info.linshi95[xbid] == null) {
            await this.backData();
            return;
        }
        info.linshixz = xbid;
        //临时给前端展示
        // info.linshiOld = {
        //     //开启宝箱临时的装备列表
        //     equipId: "", //装备ID
        //     mrhh: "", //默认的皮肤ID
        //     hh: "", //皮肤ID
        //     level: 0, //装备等级
        //     eps: {}, //装备属性
        //     isNew: 0, //1新0旧
        // }
        //临时给前端展示
        let cfgInfo = gameCfg_1.default.equipInfo.getItemCtx(this.ctx, info.linshi95[xbid].equipId);
        if (info.chuan[cfgInfo.buwei] != null) {
            if (info.linshiOld.isNew == 1) { //如果是新的
                let cfgold = gameCfg_1.default.equipInfo.getItemCtx(this.ctx, info.linshiOld.equipId);
                if (cfgold.buwei == cfgInfo.buwei) {
                    await this.backData_u(["linshi", "linshiOld", "linshi95"]);
                    return;
                }
            }
            info.linshiOld.equipId = info.chuan[cfgInfo.buwei].equipId;
            info.linshiOld.mrhh = info.chuan[cfgInfo.buwei].equipId == "" ? "" : info.chuan[cfgInfo.buwei].mrhh;
            info.linshiOld.hh = info.chuan[cfgInfo.buwei].hh;
            info.linshiOld.level = info.chuan[cfgInfo.buwei].level;
            info.linshiOld.eps = info.chuan[cfgInfo.buwei].eps;
            info.linshiOld.isNew = 0;
        }
        info.linshi = gameMethod_1.gameMethod.objCopy(info.linshi95[xbid]);
        await this.update(info, ["linshi", "linshiOld", "linshi95"]);
    }
    /**
     * 分解
     * @param xhId 宝箱临时列表序号ID
     */
    async fenjie95(xbid) {
        let info = await this.getInfo();
        if (info.linshi95[xbid] == null) {
            await this.backData_u(["linshi", "linshiOld", "linshi95"]);
            return;
        }
        let cfgEinfo = gameCfg_1.default.equipInfo.getItemCtx(this.ctx, info.linshi95[xbid].equipId);
        let pinzhi = cfgEinfo.pinzhi;
        let fenjie = gameCfg_1.default.equipLevel.getItemCtx(this.ctx, pinzhi.toString(), info.linshi95[xbid].level.toString()).fenjie;
        let items = gameMethod_1.gameMethod.objCopy(fenjie);
        //加角色经验
        let actBoxModel = ActBoxModel_1.ActBoxModel.getInstance(this.ctx, this.id);
        let actBox = await actBoxModel.getInfo();
        let cfgEquipBox = gameCfg_1.default.equipBox.getItemCtx(this.ctx, actBox.level.toString());
        let addExp = game_1.default.getRandArr(cfgEquipBox.addExps, 1)[0];
        if (addExp != null) {
            items.push([1, 901, addExp]);
        }
        else {
            tool_1.tool.addServerError(this.ctx.url, tool_1.tool.getParams(this.ctx), {
                level: actBox.level,
            });
        }
        if (items.length > 0) {
            await this.ctx.state.master.addItem2(items, 'equipItems');
            for (const _fenjie of fenjie) {
                if (_fenjie[0] == 1 && _fenjie[1] == 62) {
                    await hook_1.hookNote(this.ctx, "fenjieGet1_62", _fenjie[2]);
                }
            }
            await hook_1.hookNote(this.ctx, "equipFenJie", 1);
        }
        delete info.linshi95[xbid];
        info.linshiOld = {
            //开启宝箱临时的装备列表
            equipId: "",
            mrhh: "",
            hh: "",
            level: 0,
            eps: {},
            isNew: 0,
        };
        info.linshi = {
            //开启宝箱临时的装备列表
            equipId: "",
            mrhh: "",
            hh: "",
            level: 0,
            eps: {},
            isNew: 0,
        };
        info.linshixz = "";
        await this.update(info, ["linshi", "count", "linshi95"]);
        //活动 - 限时福利 触发礼包
        await this._trip_equip();
    }
    /**
     * 出售
     * @param xhId 宝箱临时列表序号ID
     */
    async chushou95(xbid) {
        let info = await this.getInfo();
        if (info.linshi95[xbid] == null) {
            await this.backData_u(["linshi", "linshiOld", "linshi95"]);
            return;
        }
        let cfgEinfo = gameCfg_1.default.equipInfo.getItemCtx(this.ctx, info.linshi95[xbid].equipId);
        let pinzhi = cfgEinfo.pinzhi;
        let buwei = cfgEinfo.buwei.toString();
        let chushou = gameCfg_1.default.equipLevel.getItemCtx(this.ctx, pinzhi.toString(), info.linshi95[xbid].level.toString()).chushou;
        let count = chushou + Math.floor(chushou * info.trader / 10000);
        let items = [];
        if (count != null) {
            items.push([1, 2, count]);
        }
        else {
            tool_1.tool.addServerError(this.ctx.url, tool_1.tool.getParams(this.ctx), {
                trader: info.trader,
                chushou: chushou,
                pinzhi: pinzhi,
                level: info.linshi95[xbid].level,
            });
        }
        //加角色经验
        let actBoxModel = ActBoxModel_1.ActBoxModel.getInstance(this.ctx, this.id);
        let actBox = await actBoxModel.getInfo();
        let cfgEquipBox = gameCfg_1.default.equipBox.getItemCtx(this.ctx, actBox.level.toString());
        let addExp = game_1.default.getRandArr(cfgEquipBox.addExps, 1)[0];
        if (addExp != null) {
            items.push([1, 901, addExp]);
        }
        else {
            tool_1.tool.addServerError(this.ctx.url, tool_1.tool.getParams(this.ctx), {
                level: actBox.level,
            });
        }
        if (items.length > 0) {
            await this.ctx.state.master.addItem2(items, "equipItems");
            await hook_1.hookNote(this.ctx, "chushouGet1_2", count);
            await hook_1.hookNote(this.ctx, "equipChuShou", 1);
        }
        if (info.chuan[buwei] != null && info.chuan[buwei].newHh != "") {
            info.chuan[buwei].newHh = "";
        }
        delete info.linshi95[xbid];
        info.linshiOld = {
            //开启宝箱临时的装备列表
            equipId: "",
            mrhh: "",
            hh: "",
            level: 0,
            eps: {},
            isNew: 0,
        };
        info.linshi = {
            //开启宝箱临时的装备列表
            equipId: "",
            mrhh: "",
            hh: "",
            level: 0,
            eps: {},
            isNew: 0,
        };
        info.linshixz = "";
        await this.update(info, ["linshi", "count", "linshi95"]);
        //活动 - 限时福利 触发礼包
        await this._trip_equip();
    }
    /**
      * 替换装备
      */
    async tihuan() {
        let info = await this.getInfo();
        if (info.linshi.equipId == "") {
            await this.backData();
            return;
        }
        let oldLs = gameMethod_1.gameMethod.objCopy(info.linshiOld);
        info.linshiOld = gameMethod_1.gameMethod.objCopy(info.linshi);
        info.linshi = oldLs;
        let cfgEquipInfo = gameCfg_1.default.equipInfo.getItemCtx(this.ctx, info.linshi.equipId);
        if (info.chuan[cfgEquipInfo.buwei].hhList[info.linshiOld.mrhh] != null) {
            info.chuan[cfgEquipInfo.buwei].hhList[info.linshiOld.mrhh] = 1;
            info.chuan[cfgEquipInfo.buwei].equipId = info.linshiOld.equipId;
            info.chuan[cfgEquipInfo.buwei].level = info.linshiOld.level;
            info.chuan[cfgEquipInfo.buwei].mrhh = info.linshiOld.mrhh;
            info.chuan[cfgEquipInfo.buwei].eps = info.linshiOld.eps;
            info.chuan[cfgEquipInfo.buwei].newHh = "";
        }
        if (info.linshi95[info.linshixz] != null) {
            info.linshi95[info.linshixz] = oldLs;
        }
        await this.update(info, ["linshi", "chuan", "linshiOld", "count", "linshi95"]);
    }
    /**
     * 装备
     * @param xhId 宝箱临时列表序号ID
     */
    async zhuangbei(xbid) {
        let info = await this.getInfo();
        if (info.linshi.equipId == "") {
            await this.backData();
            return;
        }
        let cfgEquipInfo = gameCfg_1.default.equipInfo.getItemCtx(this.ctx, info.linshi.equipId);
        //直接穿上
        if (info.chuan[cfgEquipInfo.buwei] == null) {
            info.chuan[cfgEquipInfo.buwei] = this.initBuWei();
        }
        if (info.chuan[cfgEquipInfo.buwei].equipId == "") {
            info.chuan[cfgEquipInfo.buwei].equipId = info.linshi.equipId;
            info.chuan[cfgEquipInfo.buwei].level = info.linshi.level;
            info.chuan[cfgEquipInfo.buwei].eps = gameMethod_1.gameMethod.objCopy(info.linshi.eps);
            info.chuan[cfgEquipInfo.buwei].newHh = "";
            info.chuan[cfgEquipInfo.buwei].mrhh = info.linshi.mrhh;
            if (info.chuan[cfgEquipInfo.buwei].hhList[info.linshi.mrhh] == null) {
                info.chuan[cfgEquipInfo.buwei].hhList[info.linshi.mrhh] = 1;
            }
            info.linshi.equipId = "";
            info.linshi.level = 0;
            info.linshi.eps = {};
            info.linshi.isNew = 0;
            delete info.linshi95[xbid];
            await this.update(info, ['linshi', 'chuan', "count", "linshi95"]);
            await hook_1.hookNote(this.ctx, "equipChuan", 1);
            //活动 - 限时福利 触发礼包
            await this._trip_equip();
            return;
        }
        //穿戴
        if (info.linshiOld.isNew == 1) {
            if (info.linshiOld.equipId == "") {
                tool_1.tool.addServerError(this.ctx.url, tool_1.tool.getParams(this.ctx), JSON.stringify(info));
                await this.backData();
                return;
            }
            else {
                if (info.chuan[cfgEquipInfo.buwei].hhList[info.linshiOld.mrhh] == null) {
                    info.chuan[cfgEquipInfo.buwei].hhList[info.linshiOld.mrhh] = 1;
                }
                info.chuan[cfgEquipInfo.buwei].equipId = info.linshiOld.equipId;
                info.chuan[cfgEquipInfo.buwei].level = info.linshiOld.level;
                info.chuan[cfgEquipInfo.buwei].mrhh = info.linshiOld.mrhh;
                info.chuan[cfgEquipInfo.buwei].eps = info.linshiOld.eps;
                info.chuan[cfgEquipInfo.buwei].newHh = "";
                await this.update(info, ["linshi", "chuan", "linshiOld", "count", "linshi95"]);
                await hook_1.hookNote(this.ctx, "equipChuan", 1);
            }
        }
        //活动 - 签到
        //当玩家身上的装备生命、攻击、防御高于新人礼包所出售的装备时，则相应的新人礼包会直接跳到下一档。
        let cfgHdNew = setting_1.default.getHuodong2(await this.getHeIdByUuid(this.id), "hdNew");
        if (cfgHdNew != null) {
            for (const hdcid in cfgHdNew) {
                let hdNewModel = HdNewModel_1.HdNewModel.getInstance(this.ctx, this.id, hdcid);
                await hdNewModel.checkUpDc();
            }
        }
    }
    /**
     * 分解
     * @param xhId 宝箱临时列表序号ID
     */
    async fenjie() {
        let info = await this.getInfo();
        if (info.linshi.equipId == "") {
            await this.backData();
            return;
        }
        let cfgEinfo = gameCfg_1.default.equipInfo.getItemCtx(this.ctx, info.linshi.equipId);
        let pinzhi = cfgEinfo.pinzhi;
        let fenjie = gameCfg_1.default.equipLevel.getItemCtx(this.ctx, pinzhi.toString(), info.linshi.level.toString()).fenjie;
        let items = gameMethod_1.gameMethod.objCopy(fenjie);
        //加角色经验
        let actBoxModel = ActBoxModel_1.ActBoxModel.getInstance(this.ctx, this.id);
        let actBox = await actBoxModel.getInfo();
        let cfgEquipBox = gameCfg_1.default.equipBox.getItemCtx(this.ctx, actBox.level.toString());
        let addExp = game_1.default.getRandArr(cfgEquipBox.addExps, 1)[0];
        if (addExp != null) {
            items.push([1, 901, addExp]);
        }
        else {
            tool_1.tool.addServerError(this.ctx.url, tool_1.tool.getParams(this.ctx), {
                level: actBox.level,
            });
        }
        items = game_1.default.chengArr(items, info.openCount);
        if (items.length > 0) {
            await this.ctx.state.master.addItem2(items, 'equipItems');
            for (const _fenjie of fenjie) {
                if (_fenjie[0] == 1 && _fenjie[1] == 62) {
                    await hook_1.hookNote(this.ctx, "fenjieGet1_62", _fenjie[2] * info.openCount);
                }
            }
            await hook_1.hookNote(this.ctx, "equipFenJie", info.openCount);
        }
        info.openCount = 0;
        info.linshi.equipId = "";
        info.linshi.level = 0;
        info.linshi.mrhh = "";
        info.linshi.eps = {};
        await this.update(info, ["linshi", "count"]);
        //活动 - 限时福利 触发礼包
        await this._trip_equip();
    }
    //触发礼包 
    async _trip_equip() {
        let info = await this.getInfo();
        if (info.linshi.equipId != "") {
            return; //还没展示完
        }
        if (info.box > 0) {
            return; //宝箱还有
        }
        //活动 - 限时福利
        let cfgHdTimeBen = setting_1.default.getHuodong2(await this.getHeIdByUuid(this.id), "hdTimeBen");
        if (cfgHdTimeBen != null) {
            for (const hdcid in cfgHdTimeBen) {
                let hdTimeBenModel = HdTimeBenModel_1.HdTimeBenModel.getInstance(this.ctx, this.id, hdcid);
                await hdTimeBenModel.trip(Xys_1.TimeBenType.dinglu);
            }
        }
        //活动 - 限时福利 改版列表版
        let cfgHdTimeBen2 = setting_1.default.getHuodong2(await this.getHeIdByUuid(this.id), "hdTimeBen2");
        if (cfgHdTimeBen2 != null) {
            for (const hdcid in cfgHdTimeBen2) {
                let hdTimeBen2Model = HdTimeBen2Model_1.HdTimeBen2Model.getInstance(this.ctx, this.id, hdcid);
                await hdTimeBen2Model.trip(Xys_1.TimeBen2Type.dinglu);
            }
        }
    }
    /**
     * 出售
     * @param xhId 宝箱临时列表序号ID
     */
    async chushou() {
        let info = await this.getInfo();
        if (info.linshi.equipId == "") {
            await this.backData();
            return;
        }
        let cfgEinfo = gameCfg_1.default.equipInfo.getItemCtx(this.ctx, info.linshi.equipId);
        let pinzhi = cfgEinfo.pinzhi;
        let buwei = cfgEinfo.buwei.toString();
        let chushou = gameCfg_1.default.equipLevel.getItemCtx(this.ctx, pinzhi.toString(), info.linshi.level.toString()).chushou;
        let count = chushou + Math.floor(chushou * info.trader / 10000);
        let items = [];
        if (count != null) {
            items.push([1, 2, count]);
        }
        else {
            tool_1.tool.addServerError(this.ctx.url, tool_1.tool.getParams(this.ctx), {
                trader: info.trader,
                chushou: chushou,
                pinzhi: pinzhi,
                level: info.linshi.level,
            });
        }
        //加角色经验
        let actBoxModel = ActBoxModel_1.ActBoxModel.getInstance(this.ctx, this.id);
        let actBox = await actBoxModel.getInfo();
        let cfgEquipBox = gameCfg_1.default.equipBox.getItemCtx(this.ctx, actBox.level.toString());
        let addExp = game_1.default.getRandArr(cfgEquipBox.addExps, 1)[0];
        if (addExp != null) {
            items.push([1, 901, addExp]);
        }
        else {
            tool_1.tool.addServerError(this.ctx.url, tool_1.tool.getParams(this.ctx), {
                level: actBox.level,
            });
        }
        if (info.openCount == null) {
            info.openCount = 1;
        }
        items = game_1.default.chengArr(items, info.openCount);
        if (items.length > 0) {
            await this.ctx.state.master.addItem2(items, "equipItems");
            await hook_1.hookNote(this.ctx, "chushouGet1_2", count * info.openCount);
            await hook_1.hookNote(this.ctx, "equipChuShou", info.openCount);
        }
        info.openCount = 0;
        if (info.chuan[buwei] != null && info.chuan[buwei].newHh != "") {
            info.chuan[buwei].newHh = "";
        }
        info.linshi.equipId = "";
        info.linshi.mrhh = "";
        info.linshi.level = 0;
        info.linshi.eps = {};
        await this.update(info, ["linshi", "count"]);
        //活动 - 限时福利 触发礼包
        await this._trip_equip();
    }
    // /**
    //  * 解锁头发
    //  * @param level 角色等级
    //  */
    // async addBuwei13(level:number) {
    //     let toufa = Gamecfg.userInfo.getItemCtx(this.ctx,level.toString()).toufa
    //     if(toufa.length <= 0){
    //         return
    //     }
    //     let info: Info = await this.getInfo();
    //     for (const tf of toufa) {
    //         let buwei:string = tf[0].toString()
    //         let hh:string = tf[1].toString()
    //         if (info.chuan[buwei] == null ) {
    //             info.chuan[buwei] = this.initBuWei();
    //             info.chuan[buwei].equipId = buwei == "13" ? "11301" : "11401"
    //         }
    //         info.chuan[buwei].mrhh = hh;
    //         info.chuan[buwei].hh = hh;
    //         info.chuan[buwei].hhList[hh] = 1
    //     }
    //     await this.update(info, ["chuan"]);
    // }
    /**
     * 幻化
     * @param buwei 部位ID
     * @param equipId 装备ID
     */
    async huanhua(buwei, hhId) {
        let info = await this.getInfo();
        if (info.chuan[buwei] == null) {
            this.ctx.throw("参数错误");
        }
        info.chuan[buwei].hh = hhId;
        await this.update(info, ["chuan"]);
        //设置套装ID
        let userModel = UserModel_1.UserModel.getInstance(this.ctx, this.id);
        let userInfo = await userModel.getInfo();
        if (userInfo.tzid != "") {
            userInfo.tzid = "";
            await userModel.update(userInfo);
        }
    }
    /**
     * 幻化
     * @param buwei 部位ID
     * @param hh 皮肤ID
     */
    async delPifuRed(buwei, hh) {
        let info = await this.getInfo();
        if (info.chuan[buwei] == null || info.chuan[buwei].hhList[hh] == null) {
            this.ctx.throw("参数错误");
        }
        info.chuan[buwei].hhList[hh] = 0;
        await this.update(info, ["chuan"]);
    }
    /**
     * 幻化
     */
    async delPifuRedAll() {
        let info = await this.getInfo();
        for (const _buwei in info.chuan) {
            for (const _hh in info.chuan[_buwei].hhList) {
                if (info.chuan[_buwei].hhList[_hh] == 1) {
                    info.chuan[_buwei].hhList[_hh] = 0;
                }
            }
        }
        await this.update(info, ["chuan"]);
    }
    /**
     * 幻化
     * @param buwei 部位ID
     * @param hh 皮肤ID
     */
    async addPifu(buwei, hh) {
        let info = await this.getInfo();
        if (info.chuan[buwei] == null) {
            info.chuan[buwei] = this.initBuWei();
        }
        if (info.chuan[buwei].hhList[hh] != null) {
            return;
        }
        info.chuan[buwei].hhList[hh] = 1;
        await this.update(info, ["chuan"]);
    }
    /**
     * 恢复默认
     */
    async backMoRen() {
        let info = await this.getInfo();
        for (const buwei in info.chuan) {
            info.chuan[buwei].hh = "";
        }
        await this.update(info, ["chuan"]);
    }
    /**
     * 附魔 - 升级
     * @param buwei 部位ID
     */
    async fm_uplevel(buwei) {
        let info = await this.getInfo();
        if (info.chuan[buwei] == null) {
            this.ctx.throw("参数错误");
        }
        let cfgNext = gameCfg_1.default.equipFumo.getItem((info.chuan[buwei].fmLv + 1).toString());
        if (cfgNext == null) {
            this.ctx.throw("已满级");
            return;
        }
        let cfg = gameCfg_1.default.equipFumo.getItemCtx(this.ctx, info.chuan[buwei].fmLv.toString());
        //升级消耗
        await this.ctx.state.master.subItem2(cfg.need1);
        info.chuan[buwei].fmLv += 1;
        //绑定消耗
        let max = 0;
        if (info.chuan[buwei].fmBd == 1) {
            //查找相同属性个数
            let ceps = {};
            for (const fmEps of info.chuan[buwei].fmEps) {
                if (ceps[fmEps[0]] == null) {
                    ceps[fmEps[0]] = 0;
                }
                ceps[fmEps[0]] += 1;
                max = Math.max(ceps[fmEps[0]] - 1, max);
            }
            let need = cfg.need[0];
            if (cfg.need[max] != null) {
                need = cfg.need[max];
            }
            await this.ctx.state.master.subItem1(need);
            let cqeps = {};
            for (const val of cfgNext.eps_prol) {
                cqeps[val[0]] = val[1];
            }
            //绑定提示属性
            info.chuan[buwei].fmEps = [];
            for (const key in ceps) {
                if (cqeps[key] == null) {
                    continue;
                }
                for (let index = 1; index <= ceps[key]; index++) {
                    info.chuan[buwei].fmEps.push([key, cqeps[key]]);
                }
            }
        }
        else {
            info.chuan[buwei].fmEps = [];
        }
        //属性生成
        let hasLeng = info.chuan[buwei].fmEps.length;
        for (let index = hasLeng + 1; index <= cfgNext.citiao; index++) {
            let _item = game_1.default.getProbByItems(cfgNext.eps_prol, 0, 2);
            if (_item == null) {
                this.ctx.throw("抽取新属性失败");
                return;
            }
            if (info.fmCount == 0) {
                _item = ["atk", 75];
                info.fmCount = 1;
            }
            info.chuan[buwei].fmEps.push([_item[0], _item[1]]);
        }
        await this.update(info, ["chuan"]);
        await hook_1.hookNote(this.ctx, "fmUpLevel", info.chuan[buwei].fmLv);
        let lvall = 0;
        for (const _buwei in info.chuan) {
            lvall += info.chuan[_buwei].fmLv;
        }
        await hook_1.hookNote(this.ctx, "fmUpLvAll", lvall);
        //----触发礼包--
        //下一级消耗
        let nextNeed = [];
        let cfgNext2 = gameCfg_1.default.equipFumo.getItem((info.chuan[buwei].fmLv + 1).toString());
        if (cfgNext2 != null) {
            let cfg2 = gameCfg_1.default.equipFumo.getItemCtx(this.ctx, info.chuan[buwei].fmLv.toString());
            nextNeed = gameMethod_1.gameMethod.objCopy(cfg2.need1);
            //绑定累加
            if (cfg2.need[max] != null) {
                nextNeed.push(cfg2.need[max]);
            }
            if (await this.ctx.state.master.subItem2(nextNeed, true) != true) {
                let heid = await this.getHeIdByUuid(this.id);
                //触发礼包
                //活动 - 限时福利
                let cfgHdTimeBen = setting_1.default.getHuodong2(heid, "hdTimeBen");
                if (cfgHdTimeBen != null) {
                    for (const hdcid in cfgHdTimeBen) {
                        let hdTimeBenModel = HdTimeBenModel_1.HdTimeBenModel.getInstance(this.ctx, this.id, hdcid);
                        await hdTimeBenModel.trip(Xys_1.TimeBenType.fumo);
                    }
                }
                //触发礼包 改版 列表版
                let cfgHdTime2Ben = setting_1.default.getHuodong2(heid, "hdTimeBen2");
                if (cfgHdTime2Ben != null) {
                    for (const hdcid in cfgHdTime2Ben) {
                        let hdTimeBen2Model = HdTimeBen2Model_1.HdTimeBen2Model.getInstance(this.ctx, this.id, hdcid);
                        await hdTimeBen2Model.trip(Xys_1.TimeBen2Type.fumo);
                    }
                }
            }
        }
    }
    /**
     * 附魔 - 设置转换绑定
     * @param buwei 部位ID
     * @param fmZhBd 绑定列表
     */
    async fm_zhbd(buwei, fmZhBd) {
        let info = await this.getInfo();
        if (info.chuan[buwei] == null) {
            this.ctx.throw("参数错误");
        }
        info.chuan[buwei].fmZhBd = fmZhBd;
        await this.update(info, ["chuan"]);
    }
    /**
     * 附魔 - 转换
     * @param buwei 部位ID
     */
    async fm_zhuanhuan(buwei) {
        let info = await this.getInfo();
        if (info.chuan[buwei] == null) {
            this.ctx.throw("参数错误");
        }
        let cfg = gameCfg_1.default.equipFumo.getItemCtx(this.ctx, info.chuan[buwei].fmLv.toString());
        await this.ctx.state.master.subItem2(cfg.need2);
        if (info.chuan[buwei].fmZhBd == null) {
            info.chuan[buwei].fmZhBd = [];
        }
        //锁定消耗
        if (info.chuan[buwei].fmZhBd.length > 0 && cfg.need3[info.chuan[buwei].fmZhBd.length - 1] != null) {
            await this.ctx.state.master.subItem1(cfg.need3[info.chuan[buwei].fmZhBd.length - 1]);
        }
        //属性生成
        info.chuan[buwei].fmZhls = [];
        for (let index = 0; index < cfg.citiao; index++) {
            if (info.chuan[buwei].fmZhBd.indexOf(index) != -1) {
                info.chuan[buwei].fmZhls.push(info.chuan[buwei].fmEps[index]);
                continue;
            }
            let _item = game_1.default.getProbByItems(cfg.eps_prol, 0, 2);
            if (_item == null) {
                this.ctx.throw("抽取新属性失败");
                return;
            }
            info.chuan[buwei].fmZhls.push([_item[0], _item[1]]);
        }
        await this.update(info, ["chuan"]);
    }
    /**
     * 附魔 - 转换保存
     * @param buwei 部位ID
     */
    async fm_zh_save(buwei) {
        let info = await this.getInfo();
        if (info.chuan[buwei] == null) {
            this.ctx.throw("参数错误");
        }
        info.chuan[buwei].fmEps = gameMethod_1.gameMethod.objCopy(info.chuan[buwei].fmZhls);
        info.chuan[buwei].fmZhls = [];
        await this.update(info, ["chuan"]);
    }
    /**
     * 附魔 - 绑定
     * @param buwei 部位ID
     */
    async fm_bangding(buwei) {
        let info = await this.getInfo();
        if (info.chuan[buwei] == null) {
            this.ctx.throw("参数错误");
        }
        if (info.chuan[buwei].fmBd == 1) {
            info.chuan[buwei].fmBd = 0;
        }
        else {
            info.chuan[buwei].fmBd = 1;
        }
        await this.update(info, ["chuan"]);
    }
}
exports.ActEquipModel = ActEquipModel;
//# sourceMappingURL=ActEquipModel.js.map