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
exports.ActClubModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const Xys = __importStar(require("../../../common/Xys"));
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const game_1 = __importDefault(require("../../util/game"));
const gameMethod_1 = require("../../../common/gameMethod");
const SevClubMemberModel_1 = require("../sev/SevClubMemberModel");
const SevClubApplyModel_1 = require("../sev/SevClubApplyModel");
const ActBoxModel_1 = require("./ActBoxModel");
const SevClubHelpModel_1 = require("../sev/SevClubHelpModel");
const SevClubModel_1 = require("../sev/SevClubModel");
const SevClubBossModel_1 = require("../sev/SevClubBossModel");
const tool_1 = require("../../util/tool");
const lock_1 = __importDefault(require("../../util/lock"));
const ActClubFightModel_1 = require("./ActClubFightModel");
const SevChatModel_1 = require("../sev/SevChatModel");
const cache_1 = __importDefault(require("../../util/cache"));
const hook_1 = require("../../util/hook");
const ActFuShiModel_1 = require("./ActFuShiModel");
const ActDongTianModel_1 = require("./ActDongTianModel");
const SevClubFxModel_1 = require("../sev/SevClubFxModel");
const ActTaskMainModel_1 = require("./ActTaskMainModel");
/**
 * 工会 个人信息
 */
class ActClubModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actClub"; //用于存储key 和  输出1级key
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
            clubId: "",
            active7D: game_1.default.active7D_init(),
            tbAtAt: 0,
            outClubTime: 0,
            outClubNum: 0,
            itime: 0,
            outTime: 0,
            applyIds: {},
            help: this._helpInit(),
            boss: {
                hnum: 0,
                htime: 0,
            },
            alimit: {},
            md1205: 0,
            md1235: 0,
            //福星高照
            qifu: 0,
            gaiyun: 0,
            gaiyunAll: 0,
            qfRwd: [],
            fxs: [],
            chatTime: 0,
        };
    }
    //互助信息 初始化
    _helpInit() {
        return {
            hnum: 0,
            htype: {
                box: 0,
                boxStep: 0,
                fushi: 0,
                dongtian: 0,
            },
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        //新增字段
        if (info.active7D == null) {
            info.active7D = game_1.default.active7D_init();
        }
        if (info.applyIds == null) {
            info.applyIds = {};
        }
        if (info.boss == null) {
            info.boss = {
                hnum: 0,
                htime: 0,
            };
        }
        if (info.itime == null) {
            if (info.clubId) {
                info.itime = this.ctx.state.newTime - 86400;
            }
            else {
                info.itime = 0;
            }
        }
        if (info.tbAtAt == null) {
            info.tbAtAt = 0;
        }
        if (info.help.htype.dongtian == null) {
            info.help.htype.dongtian = 0;
        }
        if (info.gaiyun == null) {
            info.gaiyun = 0;
            info.qifu = 0;
            info.gaiyunAll = 0;
            info.fxs = [];
            info.qfRwd = [];
        }
        if (info.outClubNum == null) {
            info.outClubNum = 0;
        }
        if (info.chatTime == null) {
            info.chatTime = 0;
        }
        //每日更新
        if (this.ctx.state.newTime >= info.outTime) {
            //下次过期时间
            info.outTime = this.ctx.state.new0 + 86400;
            //更新7日活跃值
            info.active7D = game_1.default.active7D_rst(info.active7D, this.ctx.state.newTime);
            info.alimit = {};
            //重置打BOSS次数
            info.boss.hnum = 0;
            //重置互助信息
            info.help = this._helpInit(); //互助信息
            info.help.hnum = 0;
            info.help.htype.box = 0;
            info.help.htype.fushi = 0;
            info.gaiyun = 0;
            info.qifu = 0;
            info.gaiyunAll = 0;
            info.fxs = [];
            info.qfRwd = [];
            //同步我的活跃值 更新给仙盟
            await this.upActiveToClubMember(info);
            this.update(info);
        }
        return info;
    }
    /**
     * 获取我的仙盟ID
     */
    async getClubId() {
        let info = await this.getInfo();
        return info.clubId;
    }
    /**
     * 获取这个人加入仙盟时间
     */
    async getItime() {
        let info = await this.getInfo();
        // if (gameMethod.isEmpty(info.clubId)) {
        //     this.ctx.throw("不在仙盟里面");
        // }
        if (gameMethod_1.gameMethod.isEmpty(info.clubId)) {
            console.error(`getItime 不在仙盟里面 ${this.id} ${info.clubId}`);
            // this.ctx.throw("不在仙盟里面");
            return this.ctx.state.newTime + 86400;
        }
        return info.itime;
    }
    /**
     * 获取我的7日活跃
     */
    async getActive() {
        let info = await this.getInfo();
        return info.active7D.all;
    }
    /**
     * 给我 加活跃值
     */
    async addActive(count) {
        let info = await this.getInfo();
        //加上活跃值
        info.active7D = game_1.default.active7D_add(info.active7D, count, this.ctx.state.newTime);
        //同步我的活跃值 更新给仙盟  
        if (this.ctx.state.newTime >= info.tbAtAt) { //这边做一个缓冲，防止一直更新
            info.tbAtAt = this.ctx.state.newTime + game_1.default.rand(20, 60);
            await this.upActiveToClubMember(info);
        }
        await this.update(info, [""]);
    }
    //同步我的活跃值 更新给仙盟
    async upActiveToClubMember(info) {
        //更新给仙盟 我的活跃值
        if (gameMethod_1.gameMethod.isEmpty(info.clubId)) {
            //不在一个仙盟里面
        }
        else {
            //仙盟锁
            await lock_1.default.setLock(this.ctx, "club", info.clubId);
            let sevClubMemberModel = SevClubMemberModel_1.SevClubMemberModel.getInstance(this.ctx, info.clubId);
            await sevClubMemberModel.setActive7D(this.id, info.active7D.all);
        }
    }
    /**
     * 检查是否有仙盟
     * @param have true:查有,有就不报错(并且返回仙盟ID) false查空:空就不报错
     * @returns
     */
    async clickClub(have) {
        let info = await this.getInfo();
        if (gameMethod_1.gameMethod.isEmpty(info.clubId)) {
            //没有仙盟
            if (have) {
                this.ctx.throw("没有在一个仙盟里面");
            }
        }
        else {
            if (have != true) {
                //false查空 有工会报错
                this.ctx.throw("已经在一个仙盟里面");
            }
        }
        return info.clubId;
    }
    /**
     * 加入仙盟 业务集合
     */
    async joinClub(clubId) {
        //加入仙盟成员
        let sevClubMemberModel = SevClubMemberModel_1.SevClubMemberModel.getInstance(this.ctx, clubId);
        //人员上限
        await sevClubMemberModel.isFull();
        //新增
        await sevClubMemberModel.add(this.id);
        let info = await this.getInfo();
        //设置我的仙盟ID
        info.clubId = clubId;
        info.itime = this.ctx.state.newTime;
        info.chatTime = 0;
        //取消我对其他所有仙盟的申请
        for (const fclubid in info.applyIds) {
            //仙盟锁
            await lock_1.default.setLock(this.ctx, "club", fclubid);
            //仙盟申请表
            let fsevClubApplyModel = SevClubApplyModel_1.SevClubApplyModel.getInstance(this.ctx, fclubid);
            await fsevClubApplyModel.del(this.id);
        }
        //清空申请表
        info.applyIds = {};
        await this.update(info);
        //仙盟
        let sevClubModel = SevClubModel_1.SevClubModel.getInstance(this.ctx, clubId);
        let clubname = (await sevClubModel.getInfo()).name;
        await this.ctx.state.master.sendMail(this.id, {
            title: "加入仙盟",
            content: `您成功加入仙盟[${clubname}] ，江湖路远，相扶相持!`,
            items: [],
        });
        let fuser = await cache_1.default.getFUser(this.ctx, this.id, 1);
        await lock_1.default.setLock(this.ctx, "chat_" + Xys.ChannelType.club, clubId);
        let sevChatModel = SevChatModel_1.SevChatModel.getInstance(this.ctx, clubId, Xys.ChannelType.club);
        let data = {
            id: 0,
            type: "3",
            user: fuser,
            msg: fuser.name + "加入了仙盟",
            time: game_1.default.getNowTime(),
        };
        await sevChatModel.add(data);
        //检测是否已经加入钩子
        let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
        await actTaskMainModel.clickKind191();
    }
    /**
     * 离开仙盟 业务集合
     * isT 0主动退出 1被剔除  2仙盟解散
     *  clubIdClick //公会ID验证
     */
    async outClub(isT, clubname, clubIdClick = null) {
        //获取我的仙盟ID
        //兼容BUG数据 处理
        // let clubId: string = await this.clickClub(true);
        let info = await this.getInfo();
        let clubId = info.clubId;
        //如果传入公会ID 要求验证
        if (clubIdClick != null && clubId != clubIdClick) {
            //公会ID 不一致 只T人 不做个人数据处理 不做提醒
            let sevClubMemberModel = SevClubMemberModel_1.SevClubMemberModel.getInstance(this.ctx, clubIdClick);
            await sevClubMemberModel.del(this.id);
            return;
        }
        //仙盟成员
        let sevClubMemberModel = SevClubMemberModel_1.SevClubMemberModel.getInstance(this.ctx, clubId);
        await sevClubMemberModel.del(this.id);
        //公会 - 福星
        await lock_1.default.setLock(this.ctx, "clubFx", info.clubId);
        let sevClubFxModel = SevClubFxModel_1.SevClubFxModel.getInstance(this.ctx, info.clubId);
        await sevClubFxModel.subList(this.id);
        //设置我的仙盟ID
        info.clubId = "";
        if (isT == 0) {
            //主动退出
            if (info.outClubNum > 0) {
                info.outClubTime = this.ctx.state.newTime;
            }
            info.outClubNum += 1;
            await this.ctx.state.master.sendMail(this.id, {
                title: "退出仙盟",
                content: `您退出了仙盟[${clubname}]，山高水远，江湖不见。`,
                items: [],
            });
            let fuser = await cache_1.default.getFUser(this.ctx, this.id, 1);
            await lock_1.default.setLock(this.ctx, "chat_" + Xys.ChannelType.club, clubId);
            let sevChatModel = SevChatModel_1.SevChatModel.getInstance(this.ctx, clubId, Xys.ChannelType.club);
            let data = {
                id: 0,
                type: "3",
                user: fuser,
                msg: fuser.name + "退出了仙盟",
                time: game_1.default.getNowTime(),
            };
            await sevChatModel.add(data);
        }
        if (isT == 1) {
            //被T
            await this.ctx.state.master.sendMail(this.id, {
                title: "驱逐仙盟",
                content: `道不同，不相为谋，您被仙盟[${clubname}]驱逐`,
                items: [],
            });
            let fuser = await cache_1.default.getFUser(this.ctx, this.id, 1);
            await lock_1.default.setLock(this.ctx, "chat_" + Xys.ChannelType.club, clubId);
            let sevChatModel = SevChatModel_1.SevChatModel.getInstance(this.ctx, clubId, Xys.ChannelType.club);
            let data = {
                id: 0,
                type: "3",
                user: fuser,
                msg: fuser.name + "被驱逐仙盟",
                time: game_1.default.getNowTime(),
            };
            await sevChatModel.add(data);
        }
        if (isT == 2) {
            //被T
            await this.ctx.state.master.sendMail(this.id, {
                title: "仙盟解散",
                content: `您所在仙盟[${clubname}] 已解散，有更多仙盟期待您的加入！`,
                items: [],
            });
        }
        await this.update(info);
    }
    /**
     * 加入仙盟 申请表
     */
    async joinClubApplyIds(clubId) {
        //仙盟申请表
        let sevClubApplyModel = SevClubApplyModel_1.SevClubApplyModel.getInstance(this.ctx, clubId);
        //人员上限
        await sevClubApplyModel.isFull();
        await sevClubApplyModel.add(this.id);
        //新增申请ID
        let info = await this.getInfo();
        info.applyIds[clubId] = this.ctx.state.newTime;
        await this.update(info);
    }
    /**
     * 离开仙盟申请表
     */
    async outClubApplyIds(clubId) {
        //仙盟申请表
        let sevClubApplyModel = SevClubApplyModel_1.SevClubApplyModel.getInstance(this.ctx, clubId);
        await sevClubApplyModel.del(this.id);
        //去除申请ID
        let info = await this.getInfo();
        delete info.applyIds[clubId];
        await this.update(info);
    }
    /**
     * 返回数据
     */
    async getOutPut() {
        let info = await this.getInfo();
        let opt = {
            clubId: info.clubId,
            outClubTime: info.outClubTime,
            active: info.active7D.all,
            itime: info.itime,
            applyIds: info.applyIds,
            help: info.help,
            boss: info.boss,
            //福星高照
            qifu: info.qifu,
            gaiyun: info.gaiyun,
            gaiyunAll: info.gaiyunAll,
            fxs: info.fxs,
            qfRwd: info.qfRwd,
            chatTime: info.chatTime,
        };
        return opt;
    }
    /**
     * 发布 互助需求
     */
    async helpMe(type) {
        //获取我的仙盟ID
        let clubId = await this.clickClub(true);
        //仙盟锁
        await lock_1.default.setLock(this.ctx, "club", clubId);
        //今天发过没
        let info = await this.getInfo();
        let chatType = "";
        let dtCars = {};
        let otime = 0;
        if (type == "box") {
            if (info.help.htype[type] > 0) {
                this.ctx.throw("今天已经发过");
            }
            //是否处于升级卡库中
            let actBoxModel = ActBoxModel_1.ActBoxModel.getInstance(this.ctx, this.id);
            otime = await actBoxModel.zhuliTime();
            if (otime <= 0) {
                this.ctx.throw("不需要助力");
            }
            chatType = "5";
        }
        else if (type == "boxStep") {
            if (info.help.htype[type] > 0) {
                this.ctx.throw("今天已经发过");
            }
            //是否处于升级卡库中
            let actBoxModel = ActBoxModel_1.ActBoxModel.getInstance(this.ctx, this.id);
            otime = await actBoxModel.zhuliTimeStep();
            if (otime <= 0) {
                this.ctx.throw("不需要助力");
            }
            chatType = "5";
        }
        else if (type == "fushi") {
            if (info.help.htype[type] > 0) {
                this.ctx.throw("今天已经发过");
            }
            let actFuShiModel = ActFuShiModel_1.ActFuShiModel.getInstance(this.ctx, this.id);
            otime = await actFuShiModel.zhuliTime();
            if (otime <= 0) {
                this.ctx.throw("不需要助力");
            }
            chatType = "5";
        }
        else if (type == "dongtian") {
            let mathCount = tool_1.tool.mathcfg_count(this.ctx, "dongtian_seekCd");
            if (this.ctx.state.newTime < info.help.htype[type] + mathCount) {
                this.ctx.throw("冷却中");
            }
            let actDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(this.ctx, this.id);
            let actDongTian = await actDongTianModel.getInfo();
            for (const pos in actDongTian.cars) {
                dtCars[pos] = actDongTian.cars[pos].id;
            }
            chatType = "4";
        }
        else {
            this.ctx.throw("未知互助类型" + type);
        }
        //记录今天已经发布
        info.help.htype[type] = this.ctx.state.newTime;
        await this.update(info);
        //发布一条助力信息
        let sevClubHelpModel = SevClubHelpModel_1.SevClubHelpModel.getInstance(this.ctx, clubId);
        let lid = await sevClubHelpModel.add({
            uuid: this.id,
            type: type,
            helps: {},
            cars: dtCars,
            otime: otime,
        });
        //发布一条助力信息到聊天窗口
        await lock_1.default.setLock(this.ctx, "chat_club_" + this.ctx.state.sid, clubId);
        let sevChatModel = SevChatModel_1.SevChatModel.getInstance(this.ctx, clubId, "club");
        let data = {
            id: 0,
            type: chatType,
            user: await cache_1.default.getFUser(this.ctx, this.id, 1),
            msg: lid,
            time: game_1.default.getNowTime(),
        };
        await sevChatModel.add(data);
    }
    /**
     * 帮助他人
     */
    async helpHe(id) {
        //获取我的仙盟ID
        let clubId = await this.clickClub(true);
        //仙盟锁
        await lock_1.default.setLock(this.ctx, "club", clubId);
        //助力信息更新
        let sevClubHelpModel = SevClubHelpModel_1.SevClubHelpModel.getInstance(this.ctx, clubId);
        await sevClubHelpModel.helpTask(this.id, id);
        //计数
        let info = await this.getInfo();
        info.help.hnum += 1;
        await this.update(info);
        await hook_1.hookNote(this.ctx, "clubHelpHe", 1);
    }
    /**
     * 获取今日秒数
     */
    getNowSec() {
        return this.ctx.state.newTime - this.ctx.state.new0;
    }
    /**
     * 打BOSS
     * 	{"count":3,"count1":3}	每日可免费挑战boss3次耗道具额外挑战3次
     */
    async bossFight(type) {
        //获取我的仙盟ID
        let clubId = await this.clickClub(true);
        //仙盟锁
        await lock_1.default.setLock(this.ctx, "club", clubId);
        //当前是否处于可以打的时间范围内
        //时间范围
        let cfg_bdhr = tool_1.tool.mathcfg_item(this.ctx, "club_bossStartDayHour");
        let nowSec = this.getNowSec(); //今日秒数
        if (nowSec < cfg_bdhr[0] || nowSec > cfg_bdhr[2]) {
            this.ctx.throw("不在挑战时间范围内");
        }
        //我的仙盟数据
        let info = await this.getInfo();
        //	{"count":24}	进入新仙盟后24小时才可以打boss
        let cfg_fbcd = tool_1.tool.mathcfg_count(this.ctx, "club_fightBossCd");
        if (info.itime + 3600 * cfg_fbcd > this.ctx.state.newTime) {
            this.ctx.throw(`进入新仙盟后${cfg_fbcd}小时才可以打boss`);
        }
        //次数配置
        let cfg_ts_count = tool_1.tool.mathcfg_count(this.ctx, "club_bossFreeTimes"); //免费次数
        let cfg_ts_count1 = tool_1.tool.mathcfg_count1(this.ctx, "club_bossFreeTimes"); //道具次数
        let cfg_ts_time = tool_1.tool.mathcfg_item(this.ctx, "club_bossFreeTimes"); //道具
        //挑战冷却 	{"count":120}	Boss挑战冷却 秒数
        let cfg_cd = tool_1.tool.mathcfg_count(this.ctx, "club_bossHurtCd");
        if (this.ctx.state.newTime < info.boss.htime + cfg_cd) {
            this.ctx.throw("挑战冷却中");
        }
        info.boss.htime = this.ctx.state.newTime;
        if (type == "item") {
            //扣道具
            if ((await this.ctx.state.master.subItem1(cfg_ts_time, true)) == true) {
                await this.ctx.state.master.subItem1(cfg_ts_time);
            }
            else {
                let cfgdc = gameCfg_1.default.shopTool.getItemCtx(this.ctx, "clubBoss").dc;
                let need = gameCfg_1.default.shopItem.getItemCtx(this.ctx, cfgdc).need;
                await this.ctx.state.master.subItem1(need);
            }
        }
        // if (info.boss.hnum < cfg_ts_count) {
        //     //还有免费次数
        //     if (type != "free") {
        //         this.ctx.throw("有免费次数"); //本报错可以去除
        //     }
        // } else if (info.boss.hnum < cfg_ts_count + cfg_ts_count1) {
        //     //还有免费次数
        //     if (type != "item") {
        //         this.ctx.throw("免费次数用完了");
        //     }
        // //扣道具
        // await this.ctx.state.master.subItem1(cfg_ts_time);
        // } else {
        //     this.ctx.throw("次数用完了");
        // }
        //次数++
        info.boss.hnum += 1;
        await this.update(info);
        //执行战斗 获得血量 //
        //先判断BOSS 死了没?
        //仙盟
        let sevClubModel = SevClubModel_1.SevClubModel.getInstance(this.ctx, clubId);
        let clubInfo = await sevClubModel.getInfo();
        //两个限制
        let cfg_bot = tool_1.tool.mathcfg_count(this.ctx, "club_bossOpenTime");
        if (clubInfo.createTime + 3600 * cfg_bot > this.ctx.state.newTime) {
            this.ctx.throw(`仙盟创建${cfg_bot}小时后开启boss功能`);
        }
        //BOSS开放没
        if (clubInfo.boss.open <= 0) {
            if (nowSec > cfg_bdhr[1]) {
                clubInfo.boss.open = clubInfo.boss.unlock;
                //时间到 自动开启
                const bossCfg1 = gameCfg_1.default.monClubBoss.getItem(clubInfo.boss.unlock.toString());
                if (bossCfg1 == null) {
                    clubInfo.boss.open = clubInfo.boss.unlock - 1;
                }
            }
            else {
                this.ctx.throw("BOSS还没开");
            }
        }
        if (gameMethod_1.gameMethod.isEmpty(clubInfo.boss.kill) != true) {
            this.ctx.throw("BOSS已被击杀");
        }
        //BOSS配置
        let bossId = clubInfo.boss.open.toString();
        const bossCfg = gameCfg_1.default.monClubBoss.getItemCtx(this.ctx, bossId);
        let bossEps = gameMethod_1.gameMethod.ep_merge(gameMethod_1.gameMethod.ep_init(), bossCfg.eps);
        //开打
        let actClubFightModel = ActClubFightModel_1.ActClubFightModel.getInstance(this.ctx, this.id);
        let hurt = await actClubFightModel.fight_one(bossId, clubInfo.boss.hurt);
        // 虚拟伤害
        // let hurt = Math.round(gameMethod.rand(bossEps.hp_max / 7, bossEps.hp_max / 8));
        //加上伤害
        clubInfo.boss.hurt += hurt;
        //伤害排行操作
        if (hurt > 0) {
            let sevClubBossModel = SevClubBossModel_1.SevClubBossModel.getInstance(this.ctx, clubId);
            await sevClubBossModel.addHurt(bossId, this.id, hurt);
        }
        //判断击杀
        if (clubInfo.boss.hurt >= bossEps.hp_max) {
            //记录击杀
            clubInfo.boss.kill = this.id;
            //如果是最大BOSS 则解锁下一只
            if (clubInfo.boss.open == clubInfo.boss.unlock) {
                clubInfo.boss.unlock += 1; //不管通关的事 / 前端做兼容 /开打的时候 开打做限制
            }
            //加入仙盟满X小时的仙盟成员可获得通关奖励
            let cfg_brai = tool_1.tool.mathcfg_count(this.ctx, "club_bossRwdAtimes");
            //有奖励的 最晚加入时间
            let limitAtime = this.ctx.state.newTime - cfg_brai * 3600;
            //全仙盟 发奖励
            let sevClubMemberModel = SevClubMemberModel_1.SevClubMemberModel.getInstance(this.ctx, clubId);
            let sevClubMemberInfo = await sevClubMemberModel.getInfo();
            for (const fuuid in sevClubMemberInfo.list) {
                //发奖励 邮件
                await lock_1.default.setLock(this.ctx, "user", fuuid); //枷锁
                this.ctx.state.fuuid = fuuid;
                let factClubModel = ActClubModel.getInstance(this.ctx, fuuid);
                if ((await factClubModel.getItime()) > limitAtime) {
                    continue;
                }
                //发邮件
                await this.ctx.state.master.sendMail(fuuid, {
                    title: "仙盟BOSS奖励",
                    content: `剑气纵横三万里，一剑霜寒十四州，大妖${bossCfg.name}已被封印，仙盟论功行赏：`,
                    items: bossCfg.killrwd,
                });
                this.ctx.state.fuuid = "";
            }
            //XX配置
        }
        //更新仙盟信息
        await sevClubModel.update(clubInfo, [""]);
        //仙盟BOSS
        await hook_1.hookNote(this.ctx, "clubBossPk", 1);
    }
    /**
     * 触发活跃值
     */
    async chuFaActive(id, count = 1) {
        let cfg = gameCfg_1.default.clubActive.getItem(id);
        if (cfg == null) {
            return;
        }
        let info = await this.getInfo();
        if (info.alimit == null) {
            info.alimit = {};
        }
        if (info.alimit[id] == null) {
            info.alimit[id] = 0;
        }
        if (info.alimit[id] >= cfg.max) {
            return;
        }
        let all = Math.min(cfg.one * count, cfg.max - info.alimit[id]);
        info.alimit[id] += all;
        await this.update(info, [""]);
        await this.addActive(all);
    }
    /**
     * 祈福
     */
    async qifu() {
        let info = await this.getInfo();
        if (info.clubId == "") {
            this.ctx.throw("请先加入仙盟");
        }
        if (info.qifu >= tool_1.tool.mathcfg_count1(this.ctx, "club_chouFu")) {
            this.ctx.throw("今日无祈福次数");
        }
        info.qifu += 1;
        if (info.gaiyunAll >= tool_1.tool.mathcfg_count(this.ctx, "club_zhuanFu")) {
            info.gaiyun = 1;
        }
        info.fxs = [];
        let prob100 = tool_1.tool.mathcfg_count(this.ctx, "club_chouFu");
        for (let index = 0; index < 6; index++) {
            if (game_1.default.rand(1, 10000) > prob100) {
                info.fxs.push(game_1.default.rand(1, 5));
            }
            else {
                info.fxs.push(6);
            }
        }
        await this.update(info);
    }
    /**
     * 一键满福
     */
    async maxFu() {
        let info = await this.getInfo();
        if (info.clubId == "") {
            this.ctx.throw("请先加入仙盟");
        }
        if (info.qifu >= tool_1.tool.mathcfg_count1(this.ctx, "club_chouFu")) {
            this.ctx.throw("今日无祈福次数");
        }
        info.qifu += 1;
        let item = tool_1.tool.mathcfg_item(this.ctx, "club_fu_max");
        await this.ctx.state.master.subItem1(item);
        info.fxs = [];
        for (let index = 0; index < 6; index++) {
            info.fxs.push(6);
        }
        await this.update(info);
    }
    /**
     * 改运
     */
    async gaiyun() {
        let info = await this.getInfo();
        if (info.clubId == "") {
            this.ctx.throw("请先加入仙盟");
        }
        //每天免费10次,之后转福字消费灵石（单局重置）
        let item = tool_1.tool.mathcfg_item(this.ctx, "club_zhuanFu");
        let count = 0; //改运消耗
        if (item[info.gaiyun] == null) {
            count = item[item.length - 1];
        }
        else {
            count = item[info.gaiyun];
        }
        if (count > 0) {
            await this.ctx.state.master.subItem1([1, 1, count]);
        }
        info.gaiyunAll += 1;
        if (info.gaiyunAll >= tool_1.tool.mathcfg_count(this.ctx, "club_zhuanFu")) {
            info.gaiyun += 1;
        }
        else {
            info.gaiyun = 0;
        }
        let prob100 = tool_1.tool.mathcfg_count(this.ctx, "club_chouFu");
        let isUpdate = false;
        for (let index = 0; index < 6; index++) {
            if (info.fxs[index] == 6) {
                continue;
            }
            if (game_1.default.rand(1, 10000) > prob100) {
                info.fxs[index] = game_1.default.rand(1, 5);
            }
            else {
                info.fxs[index] = 6;
            }
            isUpdate = true;
        }
        if (isUpdate) {
            await this.update(info);
        }
        else {
            this.ctx.throw("满6副则无法改运");
        }
    }
    /**
     * 祈福领取
     */
    async lingqu() {
        let info = await this.getInfo();
        if (info.clubId == "") {
            this.ctx.throw("请先加入仙盟");
        }
        info.gaiyun = 0;
        let count6 = 0; //福字个数
        for (let index = 0; index < 6; index++) {
            if (info.fxs[index] == 6) {
                count6 += 1;
            }
        }
        let yl = 0;
        let jjd = 0;
        let gx = 0;
        let items = gameCfg_1.default.clubFuxing.getItemCtx(this.ctx, count6.toString()).items;
        for (const _item of items) {
            if (_item[0] == 1) {
                if (_item[1] == 7) {
                    gx += _item[2];
                }
                if (_item[1] == 912) {
                    yl += _item[2];
                }
                if (_item[1] == 913) {
                    jjd += _item[2];
                }
            }
        }
        await this.ctx.state.master.addItem2(items);
        info.fxs = [];
        await this.update(info);
        await lock_1.default.setLock(this.ctx, "clubFx", info.clubId);
        let sevClubFxModel = SevClubFxModel_1.SevClubFxModel.getInstance(this.ctx, info.clubId);
        await sevClubFxModel.addList(this.id, count6, yl, jjd, gx);
    }
    /**
     * 祈福档位领取
     */
    async qfRwd(id) {
        let cfg = gameCfg_1.default.clubFuxingBox.getItemCtx(this.ctx, id);
        let info = await this.getInfo();
        let sevClubFxModel = SevClubFxModel_1.SevClubFxModel.getInstance(this.ctx, info.clubId);
        let sevClubFx = await sevClubFxModel.getInfo();
        if (sevClubFx.cons < cfg.need) {
            this.ctx.throw("未满足条件");
        }
        if (info.clubId == "") {
            this.ctx.throw("请先加入仙盟");
        }
        if (info.qfRwd.indexOf(id) != -1) {
            this.ctx.throw("已领取");
        }
        info.qfRwd.push(id);
        await this.update(info);
        await this.ctx.state.master.addItem2(cfg.items);
    }
    /**
     * 查看公会聊天 红点
     */
    async lookChat() {
        let info = await this.getInfo();
        info.chatTime = this.ctx.state.newTime;
        await this.update(info);
    }
}
exports.ActClubModel = ActClubModel;
//# sourceMappingURL=ActClubModel.js.map