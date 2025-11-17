"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActAdokSevModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const Xys_1 = require("../../../common/Xys");
const game_1 = __importDefault(require("../../util/game"));
const gameMethod_1 = require("../../../common/gameMethod");
const SevAdokClubModel_1 = require("../sev/SevAdokClubModel");
const ActClubModel_1 = require("./ActClubModel");
const SevClubModel_1 = require("../sev/SevClubModel");
const SevClubMemberModel_1 = require("../sev/SevClubMemberModel");
const SevClubApplyModel_1 = require("../sev/SevClubApplyModel");
const SevClubHelpModel_1 = require("../sev/SevClubHelpModel");
const SevChatModel_1 = require("../sev/SevChatModel");
const setting_1 = __importDefault(require("../../crontab/setting"));
const ActJjcInfoModel_1 = require("./ActJjcInfoModel");
const SevClubFxModel_1 = require("../sev/SevClubFxModel");
const ActLonggongModel_1 = require("./ActLonggongModel");
const SevPaoMaModel_1 = require("../sev/SevPaoMaModel");
const ActTaskMainModel_1 = require("./ActTaskMainModel");
/**
 * 公共信息下发检查
 */
class ActAdokSevModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actAdokSev"; //用于存储key 和  输出1级key
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
            pos: 0,
            club: game_1.default.sevAdok_club_init(),
            hefu: game_1.default.sevAdok_he_init(),
            setting: {
                iosPay: 0 //IOS支付开关0关1开
            },
            jjcAt: this.ctx.state.new0 + 22 * 3600 + 45,
            chatKua: 0 //跨服聊天最后下发id
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        if (info.setting == null) {
            info.setting = {
                iosPay: 0
            };
        }
        if (info.jjcAt == null) {
            info.jjcAt = this.ctx.state.new0 + 22 * 3600 + 45;
        }
        if (info.club.clubFx == null) {
            info.club.clubFx = 0;
        }
        return info;
    }
    async getOutPut() {
        return null;
    }
    //检查所有sev 并返回信息
    //登录 清除所有下发key
    async clearAll() {
        let info = this.init();
        await this.update(info, [""]);
    }
    //进出公会 清除所有公会下发KEY
    async clearClub() {
        let info = await this.getInfo();
        info.club = game_1.default.sevAdok_club_init();
        await this.update(info, [""]);
    }
    //登录设置
    async login_set() {
        let kuaid = await this.ctx.state.master.getChatKuaId(this.ctx.state.sid);
        let info = await this.getInfo();
        //跨服聊天
        let sevChatModel = SevChatModel_1.SevChatModel.getInstance(this.ctx, kuaid, Xys_1.ChannelType.kua);
        await sevChatModel.backData_clear();
        let sevChat = await sevChatModel.getInfo();
        info.chatKua = sevChat.id;
        await this.update(info, [""]);
    }
    /**
     * 设置当前玩家所属位置
     * @param pos
     */
    async setPos(pos) {
        let info = await this.getInfo();
        info.pos = pos;
        await this.update(info, [""]);
    }
    //进出公会 清除公会下发key
    //检查所有sev互动信息下发
    async clickAllSev() {
        let info = await this.getInfo();
        let isUpdate = false;
        //获取我的公会ID
        let actClubModel = ActClubModel_1.ActClubModel.getInstance(this.ctx, this.id);
        let clubId = await actClubModel.getClubId();
        let heid = await actClubModel.getHeIdByUuid(this.id);
        if (gameMethod_1.gameMethod.isEmpty(clubId)) {
            //没有公会
        }
        else {
            //拥有公会 检查公会下发信息
            let sevAdokClubModel = SevAdokClubModel_1.SevAdokClubModel.getInstance(this.ctx, clubId);
            let sadokInfo = await sevAdokClubModel.getInfo();
            //公会基础信息
            if (info.pos == 1 && info.club.base < sadokInfo.base) {
                //下发公会信息给自己
                let sevClubModel = SevClubModel_1.SevClubModel.getInstance(this.ctx, clubId);
                await sevClubModel.backData();
                //更新自己的公会信息标记
                info.club.base = sadokInfo.base;
                isUpdate = true;
            }
            //公会成员
            if (info.pos == 1 && info.club.member < sadokInfo.member) {
                //下发公会成员信息给自己
                let sevCluMemberbModel = SevClubMemberModel_1.SevClubMemberModel.getInstance(this.ctx, clubId);
                await sevCluMemberbModel.backData();
                //更新自己的公会信息标记
                info.club.member = sadokInfo.member;
                isUpdate = true;
            }
            //公会申请表
            if (info.club.apply < sadokInfo.apply) {
                //下发XX信息给自己
                let sevClubApplyModel = SevClubApplyModel_1.SevClubApplyModel.getInstance(this.ctx, clubId);
                await sevClubApplyModel.backData();
                //更新自己的公会信息标记
                info.club.apply = sadokInfo.apply;
                isUpdate = true;
            }
            //公会助力
            if (info.club.help < sadokInfo.help) {
                //下发XX信息给自己
                let sevClubHelpModel = SevClubHelpModel_1.SevClubHelpModel.getInstance(this.ctx, clubId);
                await sevClubHelpModel.backData();
                //更新自己的公会信息标记
                info.club.help = sadokInfo.help;
                isUpdate = true;
            }
            //公会聊天
            if (info.pos == 1 && info.club.chat < sadokInfo.chat) {
                let sevChatModel = SevChatModel_1.SevChatModel.getInstance(this.ctx, clubId, Xys_1.ChannelType.club);
                info.club.chat = await sevChatModel.clickBackData_ByMyid(info.club.chat);
                isUpdate = true;
            }
            //公会福星高照
            if (info.club.clubFx < sadokInfo.clubFx) {
                //下发XX信息给自己
                let sevClubFxModel = SevClubFxModel_1.SevClubFxModel.getInstance(this.ctx, clubId);
                await sevClubFxModel.backData();
                //更新自己的公会信息标记
                info.club.clubFx = sadokInfo.clubFx;
                isUpdate = true;
            }
        }
        //龙宫检测
        if (info.pos == 2) {
            let actLonggongModel = ActLonggongModel_1.ActLonggongModel.getInstance(this.ctx, this.id);
            await actLonggongModel.clickYun();
        }
        //合服信息检查
        //跑马灯
        let actTaskMainModel = await ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
        if (await actTaskMainModel.kaiqi("1100") == 1) {
            let sevPaoMaModel = SevPaoMaModel_1.SevPaoMaModel.getInstance(this.ctx, heid);
            await sevPaoMaModel.backData_history(this.id);
        }
        let chatKua = info.chatKua;
        //跨服信息检查
        if (await actTaskMainModel.kaiqi("1700") == 1 && this.ctx.state.sid != null) {
            let kuaid = await this.ctx.state.master.getChatKuaId(this.ctx.state.sid);
            let sevChatModel = SevChatModel_1.SevChatModel.getInstance(this.ctx, kuaid, Xys_1.ChannelType.kua);
            info.chatKua = await sevChatModel.clickBackData_ByMyid(info.chatKua);
            if (chatKua < info.chatKua) {
                isUpdate = true;
            }
        }
        //设置配置更新
        let cfgswitch = setting_1.default.getSetting("1", "switch");
        if (cfgswitch != null && cfgswitch.iosPay != null) {
            if (info.setting.iosPay != cfgswitch.iosPay) {
                info.setting.iosPay = cfgswitch.iosPay;
                isUpdate = true;
                this.ctx.state.master.addBackBuf({
                    switch: cfgswitch
                });
            }
        }
        if (this.ctx.state.newTime > info.jjcAt) {
            info.jjcAt += 86400;
            let actJjcInfoModel = await ActJjcInfoModel_1.ActJjcInfoModel.getInstance(this.ctx, this.id);
            await actJjcInfoModel.getInfo();
        }
        if (isUpdate) {
            await this.update(info, [""]);
        }
    }
}
exports.ActAdokSevModel = ActAdokSevModel;
//# sourceMappingURL=ActAdokSevModel.js.map