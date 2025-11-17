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
exports.ActDongTianModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const game_1 = __importDefault(require("../../util/game"));
const tool_1 = require("../../util/tool");
const Xys = __importStar(require("../../../common/Xys"));
const gameMethod_1 = require("../../../common/gameMethod");
const cache_1 = __importDefault(require("../../util/cache"));
const lock_1 = __importDefault(require("../../util/lock"));
const RdsUserModel_1 = require("../redis/RdsUserModel");
const UserModel_1 = require("../user/UserModel");
const hook_1 = require("../../util/hook");
const ActDingYueModel_1 = require("./ActDingYueModel");
const ActDongTianLogModel_1 = require("./ActDongTianLogModel");
const SevDtNpcModel_1 = require("../sev/SevDtNpcModel");
/**
 * 洞天
 */
class ActDongTianModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actDongTian"; //用于存储key 和  输出1级key
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
            //自家矿车
            cars: {},
            adokCars: 0,
            //哥布林拉车信息
            rob: {},
            //附近
            rntime: 0,
            nears: [],
            //附近海岛 npc临时矿车
            npc: {},
            //敌对表
            enemy: {},
            //每日刷新字段
            outTime: 0,
            level: 0,
            //礼包购买
            giftId: 0,
            giftTime: 0,
            //苦工状态值
            power: 0,
            snum: 0,
            rstcars: 0,
            kind11: 0,
            kindAt: 0,
            //新手保护字段
            myCount: 0,
            heCount: 0,
            mdAt: 0,
            md1105At: 0,
            pifu: ["100000"],
            pfList: { "100000": 0 },
            xlStep: 0,
            xlLv: {},
            pvdt: 1,
            ver: 2,
            sb: 0,
            dtlv: 0,
            dtNum: 0,
            verNpc: 3 //NPC改版 20230612
        };
    }
    /**
     * 返回数据
     */
    async getOutPut() {
        let info = await this.getInfo();
        return info;
    }
    /**
     * 获取皮肤ID
     */
    async getPfId() {
        let info = await this.getInfo();
        if (info.pifu == null || info.pifu.length <= 0) {
            return "";
        }
        return info.pifu[0];
    }
    async getInfo() {
        let info = await super.getInfo();
        if (info.xlStep == null) {
            info.xlStep = 0;
        }
        if (info.xlLv == null) {
            info.xlLv = {};
        }
        if (info.pvdt == null) {
            info.pvdt = 1;
        }
        if (info.sb == null) {
            info.sb = 0;
        }
        if (info.kind11 == null) {
            info.kind11 = 0;
        }
        if (info.kindAt == null) {
            info.kindAt = 0;
        }
        //兼容老号
        if (info.ver != 2) {
            info.ver = 2;
            if (info.pfList == null) {
                info.pfList = {};
            }
            info.pfList["100000"] = 0;
            if (info.pifu != null && info.pifu[0] != null) {
                info.pfList[info.pifu[0]] = 0;
            }
            else {
                info.pifu = ["100000"];
            }
        }
        if (info.level <= 0) {
            return info; //未开启
        }
        let isUpdate = false;
        if (info.dtlv == null) {
            info.dtlv = info.level; //道童等级
            await this.refreKind172();
            isUpdate = true;
        }
        if (info.dtNum == null) {
            info.dtNum = 0; //道童额外数量
        }
        //刷车CD
        let cfg_carcd = gameCfg_1.default.dongtianLevel.getItemCtx(this.ctx, info.level.toString()).carCd;
        let cfg_carMax = tool_1.tool.mathcfg_count(this.ctx, "dongtian_carMax");
        if (info.outTime <= this.ctx.state.newTime) {
            info.outTime = this.ctx.state.new0 + 86400;
            //苦工体力回满
            info.power = 100;
            info.snum = 0;
            info.rstcars = 0;
            info.kind11 = 0;
            info.kindAt = 0;
        }
        let minEtime = this.ctx.state.newTime;
        for (const pos in info.cars) {
            if (info.cars[pos].etime == 0) {
                continue; //还没开始
            }
            if (info.cars[pos].etime <= this.ctx.state.newTime) {
                minEtime = Math.min(minEtime, info.cars[pos].etime);
                let fuser = info.cars[pos].he.user;
                let result = gameMethod_1.gameMethod.getDongTianCar(info.cars[pos], info.cars[pos].etime + 1);
                if (fuser != null && result.win == 1) { //是我自己的，但我被抢了
                    let actDongTianLogModel = ActDongTianLogModel_1.ActDongTianLogModel.getInstance(this.ctx, this.id);
                    await actDongTianLogModel.addLog(Xys.DongTianLogType.rob_s_a, info.cars[pos].id, fuser.uuid, info.cars[pos].etime);
                }
                isUpdate = true;
                delete info.cars[pos];
            }
        }
        if (Object.keys(info.cars).length < cfg_carMax && info.adokCars <= this.ctx.state.newTime) {
            if (info.adokCars == 0) {
                info.adokCars = minEtime;
            }
            else {
                info.adokCars = Math.min(info.adokCars - cfg_carcd, minEtime);
            }
            //最大可获得几个矿车
            let getNum = Math.floor((this.ctx.state.newTime - info.adokCars) / cfg_carcd);
            getNum = Math.min(getNum, cfg_carMax - Object.keys(info.cars).length);
            let addNum = getNum;
            let kk = 0;
            if (getNum > 0) {
                for (let index = 1; index <= cfg_carMax; index++) {
                    if (getNum <= 0) {
                        break;
                    }
                    if (info.cars[index.toString()] != null) {
                        continue;
                    }
                    getNum--;
                    kk++;
                    if (info.myCount + info.heCount < 10) {
                        info.cars[index.toString()] = this.getOneCar('1', info.level, index.toString());
                    }
                    else {
                        info.cars[index.toString()] = this.getOneCar('3', info.level, index.toString());
                    }
                    let actDongTianLogModel = ActDongTianLogModel_1.ActDongTianLogModel.getInstance(this.ctx, this.id);
                    await actDongTianLogModel.addLog(Xys.DongTianLogType.newCar, info.cars[index.toString()].id, "", info.adokCars + cfg_carcd * kk);
                    //推送
                    let carLv = gameCfg_1.default.dongtianCar.getItemCtx(this.ctx, info.cars[index.toString()].id).level;
                    if (carLv >= 3) {
                        let actDingYueModel = ActDingYueModel_1.ActDingYueModel.getInstance(this.ctx, this.id);
                        await actDingYueModel.sendDy('7', []);
                    }
                    isUpdate = true;
                }
            }
            //没补满 计算下一个矿车的adok时间
            if (Object.keys(info.cars).length < cfg_carMax) {
                info.adokCars += cfg_carcd * (addNum + 1);
                isUpdate = true;
            }
            else {
                info.adokCars = 0;
            }
        }
        if (info.sb == 0 && info.myCount + info.heCount >= 10) {
            info.sb = 1;
            isUpdate = true;
            await this.refreRds();
            //换掉新手车
            for (let index = 1; index <= cfg_carMax; index++) {
                let pos = index.toString();
                if (info.cars[pos] != null && info.cars[pos].stime <= 0) {
                    info.cars[pos] = this.getOneCar('3', info.level, pos);
                }
            }
        }
        if (info.verNpc != 3) {
            info.verNpc = 3;
            //删除正在拉取的NPC
            for (const fuuid in info.rob) {
                if (parseInt(fuuid) < 100000) {
                    delete info.rob[fuuid];
                }
            }
            info.npc = {};
            //刷新我的矿车   没拉完直接刷新 重新获取 修正数据
            for (let index = 1; index <= cfg_carMax; index++) {
                let pos = index.toString();
                //换掉
                if (info.myCount + info.heCount < 10) {
                    info.cars[pos] = this.getOneCar('1', info.level, pos);
                }
                else {
                    info.cars[pos] = this.getOneCar('3', info.level, pos);
                }
            }
            isUpdate = true;
        }
        if (isUpdate) {
            await this.update(info);
        }
        //满了不倒计时
        if (Object.keys(info.cars).length >= cfg_carMax) {
            info.adokCars = 0;
        }
        return info;
    }
    async into() {
        let info = await this.getInfo();
        if (info.level > 0) {
            return info; //开启
        }
        //车辆上限
        info.level = 1; //开启
        let cfg_carMax = tool_1.tool.mathcfg_count(this.ctx, "dongtian_carMax");
        for (let index = 1; index <= cfg_carMax; index++) {
            info.cars[index.toString()] = this.getOneCar('1', info.level, index.toString());
        }
        let cfgNpcList = gameCfg_1.default.dongtianNpcList.getItemListCtx(this.ctx, info.level.toString());
        let npcs = [];
        for (const cfgNpc of cfgNpcList) {
            if (cfgNpc.biaoshi == 0) {
                continue;
            }
            npcs.push(cfgNpc.id);
        }
        let dongtian_nearsMax = tool_1.tool.mathcfg_count(this.ctx, "dongtian_nearsMax");
        let get5 = game_1.default.getRandArr(npcs, dongtian_nearsMax);
        for (const getid of get5) {
            info.nears.push(getid);
        }
        await this.update(info, ['']);
        //获得{0}个道童
        await this.refreKind172();
    }
    //按照类型和等级 刷车 (刷NPC车直接用 '2' 调用) //1新手车 2NPC车 3普通车
    /**
     * 获取一辆矿车
     * @param type
     * @param level
     */
    getOneCar(type, level, pos) {
        if (level == null) {
            level = 1;
        }
        //所有车
        let allcars = gameCfg_1.default.dongtianCarList.getItemListCtx(this.ctx, type);
        let chou = [];
        for (const _id in allcars) {
            let p_num = allcars[_id].probLv1W[level - 1];
            if (p_num == null) {
                p_num = allcars[_id].probLv1W[0];
            }
            chou.push([allcars[_id].id, p_num, allcars[_id].lengs]);
        }
        let _item = game_1.default.getProbByItems(chou, 0, 1);
        if (_item == null) {
            this.ctx.throw("抽取矿车失败" + this.id);
        }
        //随机位置
        let dpos = game_1.default.rand(_item[2][0], _item[2][1]);
        return {
            id: _item[0],
            pos: pos,
            dpos: dpos,
            stime: 0,
            etime: 0,
            my: {
                user: null,
                knum: 0,
                pow: 0,
                fevCard: false,
                pfid: "",
            },
            he: {
                user: null,
                knum: 0,
                pow: 0,
                fevCard: false,
                pfid: "",
            },
            pklog: [],
        };
    }
    /**
     * 哥布林结算
     */
    async robOver() {
        let info = await this.getInfo();
        if (info.level <= 0) {
            return info; //开启
        }
        //哥布林拉车信息 - 时间道具结算
        for (const fuuid in info.rob) {
            for (const pos in info.rob[fuuid]) {
                if (info.rob[fuuid][pos].etime > this.ctx.state.newTime) {
                    continue; //还没结束
                }
                let fuser = info.rob[fuuid][pos].he.user;
                let myuser = info.rob[fuuid][pos].my.user;
                let result = gameMethod_1.gameMethod.getDongTianCar(info.rob[fuuid][pos], this.ctx.state.newTime);
                if (fuuid == this.id && result.win == 1) { //是我自己的，但我被抢了
                    let actDongTianLogModel = ActDongTianLogModel_1.ActDongTianLogModel.getInstance(this.ctx, this.id);
                    await actDongTianLogModel.addLog(Xys.DongTianLogType.rob_s_a, info.rob[fuuid][pos].id, fuser.uuid, info.rob[fuuid][pos].etime);
                }
                if (fuuid != this.id && result.win == 1) { //不是我自己的，但我抢了
                    let actDongTianLogModel = ActDongTianLogModel_1.ActDongTianLogModel.getInstance(this.ctx, this.id);
                    await actDongTianLogModel.addLog(Xys.DongTianLogType.rob_s_b, info.rob[fuuid][pos].id, myuser.uuid, info.rob[fuuid][pos].etime);
                }
                if (fuuid != this.id && result.win == 0) { //不是我自己的，但我抢失败了
                    let actDongTianLogModel = ActDongTianLogModel_1.ActDongTianLogModel.getInstance(this.ctx, this.id);
                    await actDongTianLogModel.addLog(Xys.DongTianLogType.rob_f_b, info.rob[fuuid][pos].id, myuser.uuid, info.rob[fuuid][pos].etime);
                }
                let carCfg = gameCfg_1.default.dongtianCar.getItemCtx(this.ctx, info.rob[fuuid][pos].id);
                if (info.rob[fuuid][pos].etime > this.ctx.state.new0) {
                    info.power -= carCfg.npow;
                }
                info.power = Math.max(1, info.power);
                info.myCount += 1; //总自己次数
                //给自己加上资源
                let dongtian_dayMax = tool_1.tool.mathcfg_count(this.ctx, "dongtian_dayMax");
                if (info.snum <= dongtian_dayMax) { //赢了
                    if ((fuuid == this.id && result.win == 0) || (fuuid != this.id && result.win == 1)) {
                        this.ctx.state.master.addWin("msg", `你成功采集了【${carCfg.name}】`);
                        await this.ctx.state.master.addItem1(carCfg.rwd, "dongtian");
                        if (fuuid == this.id) {
                            await hook_1.hookNote(this.ctx, "dongTianLqMy", 1);
                        }
                        else {
                            await hook_1.hookNote(this.ctx, "dongTianLqF", 1);
                        }
                        let cfgCar = gameCfg_1.default.dongtianCar.getItem(info.rob[fuuid][pos].id);
                        if (cfgCar != null) {
                            switch (cfgCar.type) {
                                case "secret": //神秘资源
                                    await hook_1.hookNote(this.ctx, "dongTianPsecret", 1);
                                    break;
                                case "box": //卡牌
                                    await hook_1.hookNote(this.ctx, "dongTianPbox", 1);
                                    break;
                                case "fzlv": //唤魔珠
                                    await hook_1.hookNote(this.ctx, "dongTianPfzlv", 1);
                                    break;
                                case "cash": //钻石
                                    await hook_1.hookNote(this.ctx, "dongTianPcash", 1);
                                    break;
                                case "dtlv": //金块
                                    await hook_1.hookNote(this.ctx, "dongTianPdtlv", 1);
                                    break;
                            }
                        }
                    }
                }
                else {
                    //每日上限 没有收益 //任务次数是加的
                    this.ctx.state.master.addTypeMsg(1, "msg", "已达每日拉车上限" + dongtian_dayMax);
                }
                info.snum += 1; //每日次数
                delete info.rob[fuuid][pos];
                //下发气泡
                this.ctx.state.master.addWin("dongtianQiPao", {
                    type: 1
                });
            }
            if (gameMethod_1.gameMethod.isEmpty(info.rob[fuuid]) == true) {
                delete info.rob[fuuid];
            }
        }
        if (gameMethod_1.gameMethod.isEmpty(info.rob) == true) {
            info.rob = {};
        }
        await this.update(info);
    }
    /**
     * 升级
     */
    async uplevel() {
        let info = await this.getInfo();
        let levelCfg = gameCfg_1.default.dongtianLevel.getItemCtx(this.ctx, info.level.toString());
        //下一级配置是否存在
        gameCfg_1.default.dongtianLevel.getItemCtx(this.ctx, (info.level + 1).toString());
        //扣除道具
        await this.ctx.state.master.subItem2(levelCfg.need);
        info.level += 1;
        await this.update(info);
        //钩子
        await hook_1.hookNote(this.ctx, "dongTianUpLv", info.level); //矿场升级次数
        await this.refreRds();
    }
    /**
     * 充值下单检查
     */
    async checkUp(gid) {
        let info = await this.getInfo();
        //购买档次 是否当前档次的下一档
        if (info.giftId + 1 != Number(gid)) {
            this.ctx.throw("档次错误");
        }
        //礼包是否可购买
        if (this.ctx.state.newTime < info.giftTime) {
            this.ctx.throw("礼包明天才能买");
        }
        let dongtianPaygift = gameCfg_1.default.dongtianPaygift.getItemCtx(this.ctx, gid);
        return {
            type: 1,
            msg: "洞天礼包" + gid,
            data: dongtianPaygift.need[1],
            kind10Cs: this.kid + "_" + "1" + "_" + gid + "_" + dongtianPaygift.need[1]
        };
    }
    /**
     * 充值成功后执行
     */
    async carryOut(gid) {
        let dongtianPaygift = gameCfg_1.default.dongtianPaygift.getItemCtx(this.ctx, gid);
        let info = await this.getInfo();
        //记录充值
        info.giftId += 1;
        //下个礼包 明天才能买
        info.giftTime = this.ctx.state.new0 + 86400;
        await this.update(info);
        //加上奖励
        await this.ctx.state.master.addItem2(dongtianPaygift.rwd);
        return {
            type: 1,
            msg: "充值成功",
            data: dongtianPaygift.need[1],
        };
    }
    /**
     * 拉车
     */
    async lache(fuuid, pos, knum) {
        //次数上限检查
        let info = await this.getInfo();
        let dongtian_dayMax = tool_1.tool.mathcfg_count(this.ctx, "dongtian_dayMax");
        if (info.snum >= dongtian_dayMax) {
            this.ctx.throw(`每日上限${dongtian_dayMax}次`);
        }
        //获取我的苦力人数
        let dtShow = gameMethod_1.gameMethod.getDongTianShow(this.id, info);
        let hasKnum = 0;
        let _fuuid = fuuid == "" || fuuid == null ? this.id : fuuid;
        if (info.rob[_fuuid] != null && info.rob[_fuuid][pos] != null) {
            if (_fuuid == this.id) {
                hasKnum = info.rob[_fuuid][pos].my.knum;
            }
            else {
                hasKnum = info.rob[_fuuid][pos].he.knum;
            }
        }
        if (dtShow.busy - hasKnum >= dtShow.kmax) {
            this.ctx.throw("苦力不足");
        }
        //总人数 + 空闲人数 + 本车当前人数 < 请求人数
        if (dtShow.kmax - dtShow.busy + hasKnum < knum) {
            this.ctx.throw("上阵道童数量达到上限");
        }
        await hook_1.hookNote(this.ctx, "dongTianlc", 1);
        let userModel = UserModel_1.UserModel.getInstance(this.ctx, this.id);
        //开始拉自家的矿车
        if (fuuid == this.id) {
            if (info.cars[pos] == null) {
                await this.backData();
                this.ctx.state.master.addWin("msg", "矿车不存在!");
                console.log('==lache=自己===');
                return;
            }
            //矿车配置
            let carCfg = gameCfg_1.default.dongtianCar.getItem(info.cars[pos].id);
            if (carCfg == null) {
                this.ctx.throw(`dongtianCar_id:${info.cars[pos].id}`);
                return;
            }
            if (knum > carCfg.post) {
                this.ctx.throw(`人手过多`);
            }
            if (info.cars[pos].stime != 0) {
                let carShow = gameMethod_1.gameMethod.getDongTianCar(info.cars[pos], this.ctx.state.newTime);
                info.cars[pos].dpos = carShow.nowpos;
            }
            info.cars[pos].stime = this.ctx.state.newTime; //开始时间
            info.cars[pos].my.knum = knum; //人数
            info.cars[pos].my.pow = info.power; //状态
            info.cars[pos].my.user = await cache_1.default.getFUser(this.ctx, this.id, 1); //状态
            info.cars[pos].my.pfid = await this.getPfId();
            info.cars[pos].my.fevCard = false;
            //结算当前距离
            let carShow = gameMethod_1.gameMethod.getDongTianCar(info.cars[pos], this.ctx.state.newTime);
            info.cars[pos].dpos = carShow.nowpos;
            info.cars[pos].stime = this.ctx.state.newTime; //开始时间
            info.cars[pos].etime = this.ctx.state.newTime + carShow.edtime; //拉车结束时间
            // 哥布林拉车信息  1-5是 自己的  fuuid 是别人的
            if (info.rob[this.id] == null) {
                info.rob[this.id] = {};
            }
            info.rob[this.id][pos] = info.cars[pos];
            await this.update(info);
            //如果对方有人
            if (info.cars[pos].he.knum > 0) {
                //推送
                let fuser = info.cars[pos].he.user;
                await lock_1.default.setLock(this.ctx, "user", fuser.uuid); //枷锁
                this.ctx.state.fuuid = fuser.uuid;
                let fActDongTianModel = ActDongTianModel.getInstance(this.ctx, fuser.uuid);
                let fActDongTian = await fActDongTianModel.getInfo();
                fActDongTian.rob[this.id][pos] = gameMethod_1.gameMethod.objCopy(info.cars[pos]);
                await fActDongTianModel.update(fActDongTian);
                let carLv = gameCfg_1.default.dongtianCar.getItemCtx(this.ctx, info.cars[pos].id).level;
                let factDingYueModel = ActDingYueModel_1.ActDingYueModel.getInstance(this.ctx, fuser.uuid);
                await factDingYueModel.sendDy('9', [carLv.toString()]);
                this.ctx.state.fuuid = "";
            }
            await this.hdChuFaMd1105();
            await hook_1.hookNote(this.ctx, "dongTianlcMy", 1);
            return;
        }
        info.heCount += 1;
        //拉NPC
        if (parseInt(fuuid) < 100000) {
            let heid = await this.getHeIdByUuid(this.id);
            await lock_1.default.setLock(this.ctx, "sevDongTian", heid);
            let sevDtNpcModel = SevDtNpcModel_1.SevDtNpcModel.getInstance(this.ctx, heid);
            let oneNpc = await sevDtNpcModel.getInfo(fuuid);
            let dtlv = gameCfg_1.default.dongtianNpc.getItemCtx(this.ctx, fuuid).dtlv;
            if (oneNpc.cars[pos] == null) {
                this.ctx.state.master.addWin("msg", "矿车不存在!!");
                this.ctx.state.master.addBackBuf({
                    "factDongTian": {
                        level: dtlv,
                        pifu: [],
                        fuser: await this.get_npc_fuser(fuuid),
                        dongtian: oneNpc.cars
                    }
                });
                console.log('==lache=NPC===');
                return;
            }
            //矿车配置
            let carCfg = gameCfg_1.default.dongtianCar.getItemCtx(this.ctx, oneNpc.cars[pos].id);
            if (knum > carCfg.post) {
                this.ctx.throw(`人手过多`);
            }
            if (oneNpc.cars[pos].stime != 0) {
                let carShow = gameMethod_1.gameMethod.getDongTianCar(oneNpc.cars[pos], this.ctx.state.newTime);
                oneNpc.cars[pos].dpos = carShow.nowpos;
            }
            oneNpc.cars[pos].stime = this.ctx.state.newTime; //开始时间
            oneNpc.cars[pos].he.knum = knum; //人数
            oneNpc.cars[pos].he.pow = info.power; //状态
            oneNpc.cars[pos].he.user = await cache_1.default.getFUser(this.ctx, this.id, 1); //状态
            oneNpc.cars[pos].he.pfid = await this.getPfId();
            oneNpc.cars[pos].he.fevCard = false;
            //对方信息
            oneNpc.cars[pos].my.user = this.get_npc_fuser(fuuid);
            //结算当前距离
            let carShow = gameMethod_1.gameMethod.getDongTianCar(oneNpc.cars[pos], this.ctx.state.newTime);
            oneNpc.cars[pos].dpos = carShow.nowpos;
            oneNpc.cars[pos].stime = this.ctx.state.newTime; //开始时间
            oneNpc.cars[pos].etime = this.ctx.state.newTime + carShow.edtime; //拉车结束时间
            await sevDtNpcModel.setPostInfo(fuuid, pos, oneNpc.cars[pos]);
            // 哥布林拉车信息  1-5是 自己的  fuuid 是别人的
            if (info.rob[fuuid] == null) {
                info.rob[fuuid] = {};
            }
            info.rob[fuuid][pos] = gameMethod_1.gameMethod.objCopy(oneNpc.cars[pos]);
            await this.update(info);
            await this.hdChuFaMd1105();
            await hook_1.hookNote(this.ctx, "dongTianlcF", 1);
            return;
        }
        //别人
        await lock_1.default.setLock(this.ctx, "user", fuuid); //枷锁
        this.ctx.state.fuuid = fuuid;
        let fActDongTianModel = ActDongTianModel.getInstance(this.ctx, fuuid);
        //合服检查
        if (await fActDongTianModel.getHeIdByUuid(fuuid) != await this.getHeIdByUuid(this.id)) {
            this.ctx.throw(`跨服异常`);
        }
        let factDongTian = await fActDongTianModel.getInfo();
        if (factDongTian.cars[pos] == null) {
            this.ctx.state.master.addWin("msg", "矿车不存在!!!");
            this.ctx.state.fuuid = "";
            console.log('==lache=别人===');
            return;
        }
        let fuser = factDongTian.cars[pos].he.user;
        if (factDongTian.cars[pos].he.knum > 0 && fuser.uuid != this.id) {
            this.ctx.state.fuuid = "";
            this.ctx.state.master.addWin("msg", "矿车已经被抢");
            return;
        }
        //矿车配置
        let carCfg = gameCfg_1.default.dongtianCar.getItemCtx(this.ctx, factDongTian.cars[pos].id);
        if (knum > carCfg.post) {
            this.ctx.throw(`人手过多`);
        }
        if (factDongTian.cars[pos].stime != 0) {
            let carShow = gameMethod_1.gameMethod.getDongTianCar(factDongTian.cars[pos], this.ctx.state.newTime);
            factDongTian.cars[pos].dpos = carShow.nowpos;
        }
        factDongTian.cars[pos].stime = this.ctx.state.newTime; //开始时间
        factDongTian.cars[pos].he.knum = knum; //人数
        factDongTian.cars[pos].he.pow = info.power; //状态
        factDongTian.cars[pos].he.user = await cache_1.default.getFUser(this.ctx, this.id, 1); //状态
        factDongTian.cars[pos].he.pfid = await this.getPfId();
        factDongTian.cars[pos].he.fevCard = false;
        //对方信息
        factDongTian.cars[pos].my.user = await cache_1.default.getFUser(this.ctx, fuuid, 1);
        //结算当前距离
        let carShow = gameMethod_1.gameMethod.getDongTianCar(factDongTian.cars[pos], this.ctx.state.newTime);
        factDongTian.cars[pos].etime = this.ctx.state.newTime + carShow.edtime; //拉车结束时间
        factDongTian.cars[pos].dpos = carShow.nowpos;
        factDongTian.cars[pos].stime = this.ctx.state.newTime; //开始时间
        //给别人加入仇人信息
        factDongTian.enemy[this.id] = this.ctx.state.newTime;
        if (factDongTian.cars[pos].my.knum > 0) {
            factDongTian.rob[fuuid][pos] = gameMethod_1.gameMethod.objCopy(factDongTian.cars[pos]);
        }
        await fActDongTianModel.update(factDongTian);
        //推送
        let carLv = gameCfg_1.default.dongtianCar.getItemCtx(this.ctx, factDongTian.cars[pos].id).level;
        let factDingYueModel = ActDingYueModel_1.ActDingYueModel.getInstance(this.ctx, fuuid);
        await factDingYueModel.sendDy('8', [carLv.toString()]);
        this.ctx.state.fuuid = "";
        // 哥布林拉车信息  1-5是 自己的  fuuid 是别人的
        if (info.rob[fuuid] == null) {
            info.rob[fuuid] = {};
        }
        info.rob[fuuid][pos] = gameMethod_1.gameMethod.objCopy(factDongTian.cars[pos]);
        await this.update(info);
        await this.hdChuFaMd1105();
        await hook_1.hookNote(this.ctx, "dongTianlcF", 1);
        return;
    }
    /**
     * 刷新矿车
     */
    async rstcars() {
        let info = await this.getInfo();
        //刷新要多少钱
        let dongtian_flushed = tool_1.tool.mathcfg_items(this.ctx, "dongtian_flushed");
        let maxLen = Math.min(dongtian_flushed.length - 1, info.rstcars);
        if (dongtian_flushed[maxLen] == null) {
            this.ctx.throw('今日已无刷新次数');
        }
        let need = dongtian_flushed[maxLen];
        if (gameMethod_1.gameMethod.isEmpty(need)) {
            this.ctx.throw(`need_err`);
        }
        //扣钱
        await this.ctx.state.master.subItem1(need);
        //记录次数
        info.rstcars += 1;
        let actDongTianLogModel = ActDongTianLogModel_1.ActDongTianLogModel.getInstance(this.ctx, this.id);
        //车辆上限
        let cfg_carMax = tool_1.tool.mathcfg_count(this.ctx, "dongtian_carMax");
        //初始化矿车
        for (let index = 1; index <= cfg_carMax; index++) {
            let pos = index.toString();
            if (info.cars[pos] == null || info.cars[pos].stime <= 0) {
                //换掉
                if (info.myCount + info.heCount < 10) {
                    info.cars[pos] = this.getOneCar('1', info.level, pos);
                }
                else {
                    info.cars[pos] = this.getOneCar('3', info.level, pos);
                }
                await actDongTianLogModel.addLog(Xys.DongTianLogType.newCar, info.cars[pos].id, "", this.ctx.state.newTime);
            }
        }
        await this.update(info);
        await hook_1.hookNote(this.ctx, "dongTianRefreshMy", 1);
    }
    /**
     * 广告花钻刷新矿车
     */
    async rstcarsK11() {
        let info = await this.getInfo();
        if (info.kind11 >= 5) {
            this.ctx.throw("今日已无刷新次数");
        }
        //扣钱
        await this.ctx.state.master.subItem1([1, 1, 6]);
        //记录次数
        info.kind11 += 1;
        info.kindAt = this.ctx.state.newTime + 300;
        let actDongTianLogModel = ActDongTianLogModel_1.ActDongTianLogModel.getInstance(this.ctx, this.id);
        //车辆上限
        let cfg_carMax = tool_1.tool.mathcfg_count(this.ctx, "dongtian_carMax");
        //初始化矿车
        for (let index = 1; index <= cfg_carMax; index++) {
            let pos = index.toString();
            if (info.cars[pos] == null || info.cars[pos].stime <= 0) {
                //换掉
                if (info.myCount + info.heCount < 10) {
                    info.cars[pos] = this.getOneCar('1', info.level, pos);
                }
                else {
                    info.cars[pos] = this.getOneCar('3', info.level, pos);
                }
                await actDongTianLogModel.addLog(Xys.DongTianLogType.newCar, info.cars[pos].id, "", this.ctx.state.newTime);
            }
        }
        await this.update(info);
        await hook_1.hookNote(this.ctx, "dongTianRefreshMy", 1);
    }
    //输出我的附近海岛
    async getOutPut_nears() {
        let info = await this.getInfo();
        let users = {};
        let heid = await this.getHeIdByUuid(this.id);
        await lock_1.default.setLock(this.ctx, "sevDongTian", heid);
        let sevDtNpcModel = SevDtNpcModel_1.SevDtNpcModel.getInstance(this.ctx, heid);
        for (const fuuid of info.nears) {
            if (parseInt(fuuid) < 100000) {
                let oneNpc = await sevDtNpcModel.getInfo(fuuid);
                //npc 信息
                users[fuuid] = {
                    level: 1,
                    pifu: [],
                    fuser: this.get_npc_fuser(fuuid),
                    dongtian: oneNpc.cars,
                };
            }
            else {
                //别人的洞天信息
                this.ctx.state.fuuid = fuuid;
                let fActDongTianModel = ActDongTianModel.getInstance(this.ctx, fuuid);
                let fActDongTian = await fActDongTianModel.getInfo();
                users[fuuid] = {
                    level: fActDongTian.level,
                    pifu: fActDongTian.pifu == null ? [] : fActDongTian.pifu,
                    fuser: await cache_1.default.getFUser(this.ctx, fuuid, 1),
                    dongtian: (await fActDongTianModel.getInfo()).cars,
                };
                this.ctx.state.fuuid = "";
            }
        }
        //输出
        let outf = {
            nearsActDongTian: users,
        };
        this.ctx.state.master.addBackBuf(outf);
        return null;
    }
    /**
     * NPC构造玩家数据
     * @param npcId
     */
    get_npc_fuser(npcId) {
        let npc_usinfo = {
            uid: "",
            uuid: npcId,
            sid: this.ctx.state.sid,
            name: `npc_${npcId}`,
            sex: 1,
            head: "",
            wxhead: "",
            tzid: "",
            level: 1,
            lastlogin: this.ctx.state.newTime,
            clubName: "",
            chid: "",
            cbid: "",
        };
        let npcCfg = gameCfg_1.default.dongtianNpc.getItem(npcId);
        if (npcCfg != null) {
            npc_usinfo.name = npcCfg.name;
            npc_usinfo.level = npcCfg.level;
            npc_usinfo.head = npcCfg.head;
        }
        return npc_usinfo;
    }
    //输出我的仇人海岛
    async getOutPut_enemy() {
        let info = await this.getInfo();
        let users = {};
        let enemys = [];
        for (const fuuid in info.enemy) {
            enemys.push([fuuid, info.enemy[fuuid]]);
        }
        enemys.sort(function (a, b) {
            return b[1] - a[1];
        });
        let isUpdate = false;
        let kk = 0;
        for (const enemy of enemys) {
            kk++;
            if (kk > 15) {
                delete info.enemy[enemy[0]];
                isUpdate = true;
                continue;
            }
            //别人的洞天信息
            this.ctx.state.fuuid = enemy[0];
            let fActDongTianModel = ActDongTianModel.getInstance(this.ctx, enemy[0]);
            let fActDongTian = await fActDongTianModel.getInfo();
            users[enemy[0]] = {
                level: fActDongTian.level,
                pifu: fActDongTian.pifu == null ? [] : fActDongTian.pifu,
                fuser: await cache_1.default.getFUser(this.ctx, enemy[0], 1),
                dongtian: (await fActDongTianModel.getInfo()).cars,
            };
            this.ctx.state.fuuid = "";
        }
        if (isUpdate == true) {
            await this.update(info, [""]);
        }
        //输出
        let outf = {
            enemyActDongTian: users,
        };
        this.ctx.state.master.addBackBuf(outf);
    }
    /**
     * 刷新我的附近海岛
     */
    async rst_nears() {
        let info = await this.getInfo();
        //冷却时间配置
        let dongtian_rnearsCd = tool_1.tool.mathcfg_count(this.ctx, "dongtian_rnearsCd");
        if (info.rntime + dongtian_rnearsCd > this.ctx.state.newTime) {
            this.ctx.throw("刷新冷却中"); //
        }
        info.rntime = this.ctx.state.newTime;
        //刷几个
        let dongtian_nearsMax = tool_1.tool.mathcfg_count(this.ctx, "dongtian_nearsMax");
        let nears = [];
        if (info.heCount + info.myCount >= 10) {
            //洞天排行
            let rdsUserModel = RdsUserModel_1.RdsUserModel.getInstance(this.ctx, Xys.RdsUser.dongtian, await this.getHeIdByUuid(this.id));
            let rdsUser = await rdsUserModel.getScoreBetween(info.level - 1, info.level + 1);
            rdsUser = game_1.default.shuffle(rdsUser);
            let hasCar4 = {
                "4": [],
                "3": [],
                "2": [],
                "1": [],
            };
            for (const fuuid of rdsUser) {
                if (nears.length >= 5) {
                    break;
                }
                if (fuuid == this.id) {
                    continue;
                }
                await lock_1.default.setLock(this.ctx, "user", fuuid); //枷锁
                this.ctx.state.fuuid = fuuid;
                let fActDongTianModel = ActDongTianModel.getInstance(this.ctx, fuuid);
                let fActDongTian = await fActDongTianModel.getInfo();
                this.ctx.state.fuuid = "";
                let len = Object.keys(fActDongTian.cars).length;
                if (len >= 5) {
                    nears.push(fuuid);
                    continue;
                }
                if (hasCar4[len.toString()] != null) {
                    hasCar4[len.toString()].push(fuuid);
                }
            }
            for (const has in hasCar4) {
                if (nears.length >= 5) {
                    break;
                }
                for (const _fuuid of hasCar4[has]) {
                    if (nears.length >= 5) {
                        break;
                    }
                    nears.push(_fuuid);
                }
            }
        }
        else {
            //新手期间 不刷真人
        }
        let cfgNpcList = gameCfg_1.default.dongtianNpcList.getItemListCtx(this.ctx, info.level.toString());
        let npcs = [];
        for (const cfgNpc of cfgNpcList) {
            if (cfgNpc.biaoshi == 0) {
                continue;
            }
            npcs.push(cfgNpc.id);
        }
        let npcIds = game_1.default.shuffle(npcs);
        while (nears.length < dongtian_nearsMax && npcIds.length > 0) {
            let _npcid = npcIds.pop();
            if (_npcid == null || nears.indexOf(_npcid) != -1) {
                continue;
            }
            nears.push(_npcid);
        }
        info.nears = nears;
        await this.update(info);
        await hook_1.hookNote(this.ctx, "dongTianRefresh", 1);
    }
    /**
     *召回
     */
    async callback(_fuuid, pos) {
        let info = await this.getInfo();
        let fuuid = _fuuid;
        if (_fuuid == null || _fuuid == "") {
            fuuid = this.id;
        }
        if (fuuid == this.id) { //自己
            if (info.cars[pos] == null) {
                this.ctx.state.master.addWin("msg", "矿车不存在");
                console.log('==callback=自己===');
                return;
            }
            let carShow = gameMethod_1.gameMethod.getDongTianCar(info.cars[pos], this.ctx.state.newTime);
            info.cars[pos].stime = this.ctx.state.newTime;
            info.cars[pos].dpos = carShow.nowpos;
            info.cars[pos].etime = carShow.edtime + this.ctx.state.newTime;
            info.cars[pos].my.knum = 0;
            if (info.cars[pos].he.knum <= 0) { //没有对手
                info.cars[pos].my.user = null;
                info.cars[pos].he.knum = 0;
                info.cars[pos].he.user = null;
                info.cars[pos].etime = 0;
                info.cars[pos].stime = 0;
            }
            else {
                let carShow = gameMethod_1.gameMethod.getDongTianCar(info.cars[pos], this.ctx.state.newTime);
                info.cars[pos].stime = this.ctx.state.newTime;
                info.cars[pos].dpos = carShow.nowpos;
                info.cars[pos].etime = carShow.edtime + this.ctx.state.newTime;
                let fuser = info.cars[pos].he.user;
                await lock_1.default.setLock(this.ctx, "user", fuser.uuid); //枷锁
                this.ctx.state.fuuid = fuser.uuid;
                let fActDongTianModel = ActDongTianModel.getInstance(this.ctx, fuser.uuid);
                let fActDongTian = await fActDongTianModel.getInfo();
                fActDongTian.rob[this.id][pos] = gameMethod_1.gameMethod.objCopy(info.cars[pos]);
                await fActDongTianModel.update(fActDongTian);
                this.ctx.state.fuuid = "";
            }
        }
        else if (parseInt(fuuid) < 100000) {
            if (info.rob[fuuid] == null || info.rob[fuuid][pos] == null) {
                this.ctx.state.master.addWin("msg", "矿车不存在");
                console.log('==callback=npc===');
                return;
            }
            let carShow = gameMethod_1.gameMethod.getDongTianCar(info.rob[fuuid][pos], this.ctx.state.newTime);
            info.rob[fuuid][pos].dpos = carShow.nowpos;
            info.rob[fuuid][pos].etime = 0;
            info.rob[fuuid][pos].stime = 0;
            info.rob[fuuid][pos].he.user = null;
            info.rob[fuuid][pos].he.knum = 0;
            info.rob[fuuid][pos].my.user = null;
            info.rob[fuuid][pos].my.knum = 0;
            let heid = await this.getHeIdByUuid(this.id);
            await lock_1.default.setLock(this.ctx, "sevDongTian", heid);
            let sevDtNpcModel = SevDtNpcModel_1.SevDtNpcModel.getInstance(this.ctx, heid);
            await sevDtNpcModel.setPostInfo(fuuid, pos, gameMethod_1.gameMethod.objCopy(info.rob[fuuid][pos]));
        }
        else { //别人
            await lock_1.default.setLock(this.ctx, "user", fuuid); //枷锁
            this.ctx.state.fuuid = fuuid;
            let fActDongTianModel = ActDongTianModel.getInstance(this.ctx, fuuid);
            let fActDongTian = await fActDongTianModel.getInfo();
            if (fActDongTian.cars[pos] == null) {
                this.ctx.state.master.addWin("msg", "矿车不存在");
                console.log('==callback=别人===');
                return;
            }
            let carShow = gameMethod_1.gameMethod.getDongTianCar(fActDongTian.cars[pos], this.ctx.state.newTime);
            fActDongTian.cars[pos].stime = this.ctx.state.newTime;
            fActDongTian.cars[pos].dpos = carShow.nowpos;
            fActDongTian.cars[pos].etime = carShow.edtime + this.ctx.state.newTime;
            fActDongTian.cars[pos].he.user = null;
            fActDongTian.cars[pos].he.knum = 0;
            if (fActDongTian.cars[pos].my.knum == 0) {
                fActDongTian.cars[pos].my.user = null;
                fActDongTian.cars[pos].etime = 0;
                fActDongTian.cars[pos].stime = 0;
            }
            else {
                let carShow = gameMethod_1.gameMethod.getDongTianCar(fActDongTian.cars[pos], this.ctx.state.newTime);
                fActDongTian.cars[pos].dpos = carShow.nowpos;
                fActDongTian.cars[pos].stime = this.ctx.state.newTime;
                fActDongTian.cars[pos].etime = carShow.edtime + this.ctx.state.newTime;
                //赋值他得拉车信息
                fActDongTian.rob[fuuid][pos] = gameMethod_1.gameMethod.objCopy(fActDongTian.cars[pos]);
            }
            await fActDongTianModel.update(fActDongTian);
            this.ctx.state.fuuid = "";
        }
        delete info.rob[fuuid][pos];
        if (gameMethod_1.gameMethod.isEmpty(info.rob[fuuid]) == true) {
            delete info.rob[fuuid];
        }
        await this.update(info);
    }
    /**
     * 活动触发埋点
     */
    async hdChuFaMd() {
        let info = await this.getInfo();
        if (game_1.default.isToday(info.mdAt) == true) {
            return;
        }
        info.mdAt = this.ctx.state.newTime;
        await this.update(info, [""]);
    }
    /**
     * 活动触发埋点
     */
    async hdChuFaMd1105() {
        let info = await this.getInfo();
        if (game_1.default.isToday(info.md1105At) == true) {
            return;
        }
        info.md1105At = this.ctx.state.newTime;
        await this.update(info, [""]);
    }
    /**
     * 添加道童皮肤
     */
    async addPifu(pfid) {
        let info = await this.getInfo();
        info.pfList[pfid] = 1;
        await this.update(info);
    }
    /**
     * 洞天训练升级
     * @param type  1马场2木桩3靶场4铁匠铺
     */
    async xlUplv(type) {
        let info = await this.getInfo();
        if (info.xlLv[type] == null) {
            info.xlLv[type] = 0;
        }
        let needs = gameCfg_1.default.dongtianXlStep.getItemCtx(this.ctx, info.xlStep.toString()).needs;
        if (needs[type] != null && info.xlLv[type] >= needs[type]) {
            this.ctx.throw("未进阶");
        }
        let cfgNext = gameCfg_1.default.dongtianXlLv.getItem(type, (info.xlLv[type] + 1).toString());
        if (cfgNext == null) {
            this.ctx.throw("已满级");
        }
        let need = gameCfg_1.default.dongtianXlLv.getItemCtx(this.ctx, type, info.xlLv[type].toString()).need;
        await this.ctx.state.master.subItem2(need);
        info.xlLv[type] += 1;
        await this.update(info);
    }
    /**
     * 洞天训练升阶
     */
    async xlUpStep() {
        let info = await this.getInfo();
        let cfgNext = gameCfg_1.default.dongtianXlStep.getItemCtx(this.ctx, (info.xlStep + 1).toString());
        if (cfgNext == null) {
            this.ctx.throw("已满阶");
        }
        let cfg = gameCfg_1.default.dongtianXlStep.getItemCtx(this.ctx, info.xlStep.toString());
        for (const type in cfg.needs) {
            if (info.xlLv[type] == null) {
                this.ctx.throw("未满足升阶条件");
            }
            if (info.xlLv[type] < cfg.needs[type]) {
                this.ctx.throw("未满足升阶条件!");
            }
        }
        await this.ctx.state.master.subItem2(cfg.need);
        info.xlStep += 1;
        await this.update(info);
    }
    /**
     * 消除皮肤红点
     */
    async delPfRed(pfid) {
        let info = await this.getInfo();
        if (info.pfList[pfid] == null) {
            this.ctx.throw("未获得该皮肤!");
        }
        if (info.pfList[pfid] == 0) {
            return;
        }
        info.pfList[pfid] = 0;
        await this.update(info);
    }
    /**
     * 设置皮肤
     */
    async setPf(pfid) {
        let info = await this.getInfo();
        if (info.pfList[pfid] == null) {
            this.ctx.throw("未获得该皮肤!");
        }
        info.pifu = [pfid];
        //哥布林拉车信息
        for (const fuuid in info.rob) {
            for (const pos in info.rob[fuuid]) {
                if (info.rob[fuuid][pos].stime == 0) {
                    continue; //没有在拉车
                }
                let carShow = gameMethod_1.gameMethod.getDongTianCar(info.rob[fuuid][pos], this.ctx.state.newTime);
                info.rob[fuuid][pos].dpos = carShow.nowpos;
                info.rob[fuuid][pos].etime = this.ctx.state.newTime + carShow.edtime; //拉车结束时间
                info.rob[fuuid][pos].stime = this.ctx.state.newTime; //开始时间
                let myuser = info.rob[fuuid][pos].my.user;
                if (info.rob[fuuid][pos].my.knum > 0 && myuser != null && myuser.uuid == this.id) {
                    info.rob[fuuid][pos].my.pfid = info.pifu[0];
                }
                let fuser = info.rob[fuuid][pos].he.user;
                if (info.rob[fuuid][pos].he.knum > 0 && fuser != null && fuser.uuid == this.id) {
                    info.rob[fuuid][pos].he.pfid = info.pifu[0];
                }
                carShow = gameMethod_1.gameMethod.getDongTianCar(info.rob[fuuid][pos], this.ctx.state.newTime);
                info.rob[fuuid][pos].dpos = carShow.nowpos;
                info.rob[fuuid][pos].etime = this.ctx.state.newTime + carShow.edtime; //拉车结束时间
                info.rob[fuuid][pos].stime = this.ctx.state.newTime; //开始时间
                //自己的
                if (fuuid == this.id) {
                    info.cars[pos] = gameMethod_1.gameMethod.objCopy(info.rob[fuuid][pos]);
                    continue;
                }
                //机器人的
                if (parseInt(fuuid) < 100000) {
                    let heid = await this.getHeIdByUuid(this.id);
                    await lock_1.default.setLock(this.ctx, "sevDongTian", heid);
                    let sevDtNpcModel = SevDtNpcModel_1.SevDtNpcModel.getInstance(this.ctx, heid);
                    await sevDtNpcModel.setPostInfo(fuuid, pos, gameMethod_1.gameMethod.objCopy(info.rob[fuuid][pos]));
                    continue;
                }
                //别人的
                await lock_1.default.setLock(this.ctx, "user", fuuid); //枷锁
                this.ctx.state.fuuid = fuuid;
                let fActDongTianModel = ActDongTianModel.getInstance(this.ctx, fuuid);
                let factDongTian = await fActDongTianModel.getInfo();
                factDongTian.cars[pos] = gameMethod_1.gameMethod.objCopy(info.rob[fuuid][pos]);
                await fActDongTianModel.update(factDongTian);
                this.ctx.state.fuuid = "";
            }
        }
        await this.update(info);
    }
    /**
     * 道童关卡
     */
    async pvdtPass() {
        let info = await this.getInfo();
        info.pvdt += 1;
        await this.update(info);
    }
    /**
     * 获取NPC等级
     */
    async getNpcLv() {
        let info = await this.getInfo();
        if (info.level == 2) {
            return game_1.default.rand(1, 2);
        }
        if (info.level == 3) {
            return game_1.default.rand(2, 4);
        }
        if (info.level == 4) {
            return game_1.default.rand(2, 4);
        }
        if (info.level == 5) {
            return game_1.default.rand(2, 5);
        }
        if (info.level == 6) {
            return game_1.default.rand(2, 6);
        }
        return 1;
    }
    /**
     * 购买终身卡 刷新我在拉的车
     */
    async zsfBuyTq() {
        let info = await this.getInfo();
        //哥布林拉车信息
        for (const fuuid in info.rob) {
            for (const pos in info.rob[fuuid]) {
                if (info.rob[fuuid][pos].stime == 0) {
                    continue; //没有在拉车
                }
                let carShow = gameMethod_1.gameMethod.getDongTianCar(info.rob[fuuid][pos], this.ctx.state.newTime);
                info.rob[fuuid][pos].dpos = carShow.nowpos;
                info.rob[fuuid][pos].etime = this.ctx.state.newTime + carShow.edtime; //拉车结束时间
                info.rob[fuuid][pos].stime = this.ctx.state.newTime; //开始时间
                let myuser = info.rob[fuuid][pos].my.user;
                if (info.rob[fuuid][pos].my.knum > 0 && myuser != null && myuser.uuid == this.id) {
                    info.rob[fuuid][pos].my.fevCard = true;
                }
                let fuser = info.rob[fuuid][pos].he.user;
                if (info.rob[fuuid][pos].he.knum > 0 && fuser != null && fuser.uuid == this.id) {
                    info.rob[fuuid][pos].he.fevCard = true;
                }
                carShow = gameMethod_1.gameMethod.getDongTianCar(info.rob[fuuid][pos], this.ctx.state.newTime);
                info.rob[fuuid][pos].dpos = carShow.nowpos;
                info.rob[fuuid][pos].etime = this.ctx.state.newTime + carShow.edtime; //拉车结束时间
                info.rob[fuuid][pos].stime = this.ctx.state.newTime; //开始时间
                //自己的
                if (fuuid == this.id) {
                    info.cars[pos] = gameMethod_1.gameMethod.objCopy(info.rob[fuuid][pos]);
                    continue;
                }
                //机器人的
                if (parseInt(fuuid) < 100000) {
                    let heid = await this.getHeIdByUuid(this.id);
                    await lock_1.default.setLock(this.ctx, "sevDongTian", heid);
                    let sevDtNpcModel = SevDtNpcModel_1.SevDtNpcModel.getInstance(this.ctx, heid);
                    await sevDtNpcModel.setPostInfo(fuuid, pos, gameMethod_1.gameMethod.objCopy(info.rob[fuuid][pos]));
                    continue;
                }
                //别人的
                await lock_1.default.setLock(this.ctx, "user", fuuid); //枷锁
                this.ctx.state.fuuid = fuuid;
                let fActDongTianModel = ActDongTianModel.getInstance(this.ctx, fuuid);
                let factDongTian = await fActDongTianModel.getInfo();
                factDongTian.cars[pos] = gameMethod_1.gameMethod.objCopy(info.rob[fuuid][pos]);
                await fActDongTianModel.update(factDongTian);
                this.ctx.state.fuuid = "";
            }
        }
        await this.update(info);
    }
    /**
     * 广告下单检查
     */
    async checkUp11() {
        let info = await this.getInfo();
        if (info.kind11 >= 5) {
            this.ctx.throw("今日已无刷新次数");
        }
        if (this.ctx.state.newTime <= info.kindAt) {
            this.ctx.throw("冷却中...");
        }
        return {
            type: 1,
            msg: "洞天广告刷新",
            data: null
        };
    }
    /**
     * 广告成功后执行
     */
    async carryOut11() {
        let info = await this.getInfo();
        //记录次数
        info.kind11 += 1;
        info.kindAt = this.ctx.state.newTime + 300;
        let actDongTianLogModel = ActDongTianLogModel_1.ActDongTianLogModel.getInstance(this.ctx, this.id);
        //车辆上限
        let cfg_carMax = tool_1.tool.mathcfg_count(this.ctx, "dongtian_carMax");
        //初始化矿车
        for (let index = 1; index <= cfg_carMax; index++) {
            let pos = index.toString();
            if (info.cars[pos] == null || info.cars[pos].stime <= 0) {
                //换掉
                if (info.myCount + info.heCount < 10) {
                    info.cars[pos] = this.getOneCar('1', info.level, pos);
                }
                else {
                    info.cars[pos] = this.getOneCar('3', info.level, pos);
                }
                await actDongTianLogModel.addLog(Xys.DongTianLogType.newCar, info.cars[pos].id, "", this.ctx.state.newTime);
            }
        }
        await this.update(info);
        await hook_1.hookNote(this.ctx, "dongTianRefreshMy", 1);
        return {
            type: 1,
            msg: "",
            data: null
        };
    }
    /**
     * 道童升级
     */
    async dtUpLevel() {
        let info = await this.getInfo();
        let cfgNext = gameCfg_1.default.dongtianDtlv.getItem((info.dtlv + 1).toString());
        if (cfgNext == null) {
            this.ctx.throw("已满级");
        }
        let cfg = gameCfg_1.default.dongtianDtlv.getItemCtx(this.ctx, info.dtlv.toString());
        await this.ctx.state.master.subItem2(cfg.dtneed);
        info.dtlv += 1;
        await this.update(info);
        //获得{0}个道童
        await this.refreKind172();
    }
    /**
     * 送道童
     */
    async addDt(count) {
        let info = await this.getInfo();
        info.dtNum += count;
        await this.update(info);
        //获得{0}个道童
        await this.refreKind172();
    }
    /**
     * 刷新榜单 玩家活跃等级榜单
     */
    async refreRds() {
        let info = await this.getInfo();
        if (info.heCount + info.myCount < 10) {
            return;
        }
        //更新海岛排行榜 //加个其他因素 //当前拥有的XX道具数量?
        let rdsUserModel = RdsUserModel_1.RdsUserModel.getInstance(this.ctx, Xys.RdsUser.dongtian, await this.getHeIdByUuid(this.id));
        await rdsUserModel.zSet(this.id, info.level);
    }
    /**
     * 获得{0}个道童
     */
    async refreKind172() {
        let info = await this.getInfo();
        let dtCfg = gameCfg_1.default.dongtianDtlv.getItemCtx(this.ctx, info.dtlv.toString());
        await hook_1.hookNote(this.ctx, "dongTianDtNum", dtCfg.worker + info.dtNum);
    }
}
exports.ActDongTianModel = ActDongTianModel;
//# sourceMappingURL=ActDongTianModel.js.map