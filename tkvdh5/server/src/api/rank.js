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
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tool_1 = require("../util/tool");
const Xys = __importStar(require("../../common/Xys"));
const RdsUserModel_1 = require("../model/redis/RdsUserModel");
const setting_1 = __importDefault(require("../crontab/setting"));
const game_1 = __importDefault(require("../util/game"));
const RdsClubModel_1 = require("../model/redis/RdsClubModel");
const gameMethod_1 = require("../../common/gameMethod");
const HdDouLuoModel_1 = require("../model/hd/HdDouLuoModel");
const HdTianGongModel_1 = require("../model/hd/HdTianGongModel");
const HdDengShenBangModel_1 = require("../model/hd/HdDengShenBangModel");
const ActClubModel_1 = require("../model/act/ActClubModel");
const router = new koa_router_1.default();
exports.router = router;
router.prefix("/rank");
/**
 * @api {post} /rank/getList  获取排行数据
 * @apiName 获取排行数据
 * @apiGroup ranking
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} kid 排行榜标识 协议key
 * @apiParam {string} hdcid 排行榜标识对应的分组ID 默认为"x"
 * @apiParam {number} lastId 下标ID,从0开始，每次拉起20个 默认为0
 */
router.all("/getList", async (ctx) => {
    ctx.state.apidesc = "排行-获取排行数据";
    const { uuid, kid, hdcid, lastId } = tool_1.tool.getParams(ctx);
    let _lastId = lastId == null ? 1 : lastId + 1;
    let _hdcid = hdcid == null ? "x" : hdcid;
    let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
    switch (kid) {
        case "rdsJjc": //竞技场排行榜
            let rdsUserModel_rdsJjc = await new RdsUserModel_1.RdsUserModel(kid, _hdcid, heid, tool_1.tool.jjcWeekId(ctx.state.newTime));
            await rdsUserModel_rdsJjc.backData_u(ctx, _lastId, _lastId + 9);
            await rdsUserModel_rdsJjc.backData_my(ctx, uuid);
            break;
        case "rdsPvd": //每日挑战排行榜
            let rdsUserModel_rdsPvd = await new RdsUserModel_1.RdsUserModel(kid, _hdcid, heid, game_1.default.getTodayId(ctx.state.newTime));
            await rdsUserModel_rdsPvd.backData_u(ctx, _lastId, _lastId + 9);
            await rdsUserModel_rdsPvd.backData_my(ctx, uuid);
            break;
        case Xys.RdsUser.pvw: //试炼周排行
            let rdsUserModel_pvw = RdsUserModel_1.RdsUserModel.getInstance(ctx, kid, heid, _hdcid, game_1.default.getWeekId());
            await rdsUserModel_pvw.backData_u(ctx, _lastId, _lastId + 9);
            await rdsUserModel_pvw.backData_my(ctx, uuid);
            break;
        case Xys.RdsUser.rdsLiuDao: //六道秘境
            let rdsUserModel_ld = RdsUserModel_1.RdsUserModel.getInstance(ctx, kid, heid);
            await rdsUserModel_ld.backData_u(ctx, _lastId, _lastId + 9);
            await rdsUserModel_ld.backData_my(ctx, uuid);
            break;
        // case Xys.RdsClub.rdsClubActive: //公会 活跃度
        //     let rdsClubModel = RdsClubModel.getInstance(ctx, kid, heid);
        //     await rdsClubModel.backData_u(ctx, _lastId, _lastId + 9);
        //     await rdsClubModel.backData_my(ctx, uuid);
        //     break;
        case "rdsHdChou": //九龙秘宝排行榜
            let hdCfg = gameMethod_1.gameMethod.objCopy(setting_1.default.getHuodong3(heid, "hdChou", _hdcid));
            if (hdCfg == null) {
                ctx.throw("活动未开启");
            }
            let rdsUserModel_rdsHdChou = await new RdsUserModel_1.RdsUserModel(kid, _hdcid, heid, hdCfg.info.id);
            await rdsUserModel_rdsHdChou.backData_u(ctx, _lastId, _lastId + 9);
            await rdsUserModel_rdsHdChou.backData_my(ctx, uuid);
            break;
        case "rdsHdChongBang": //冲榜
            let hdCfgcb = gameMethod_1.gameMethod.objCopy(setting_1.default.getHuodong3(heid, "hdChongbang", _hdcid));
            if (hdCfgcb == null) {
                ctx.throw("活动未开启");
            }
            let rdsUserModel_rdsHdCb = await new RdsUserModel_1.RdsUserModel(kid, _hdcid, heid, hdCfgcb.info.id);
            await rdsUserModel_rdsHdCb.backData_u(ctx, _lastId, _lastId + 9);
            await rdsUserModel_rdsHdCb.backData_my(ctx, uuid);
            break;
        case Xys.RdsUser.rdsHdQiYuan: //兽灵起源
            let hdCfg_hdQiYuan = gameMethod_1.gameMethod.objCopy(setting_1.default.getHuodong3(heid, "hdQiYuan", _hdcid));
            if (hdCfg_hdQiYuan == null) {
                ctx.throw("活动未开启");
            }
            let rdsUserModel_rdsHdQiYuan = new RdsUserModel_1.RdsUserModel(kid, _hdcid, heid, hdCfg_hdQiYuan.info.id);
            await rdsUserModel_rdsHdQiYuan.backData_u(ctx, _lastId, _lastId + 9);
            await rdsUserModel_rdsHdQiYuan.backData_my(ctx, uuid);
            break;
        case Xys.RdsUser.rdsHdHuanJing: //鱼灵幻境
            let hdCfg_hdHuanJing = gameMethod_1.gameMethod.objCopy(setting_1.default.getHuodong3(heid, "hdHuanJing", _hdcid));
            if (hdCfg_hdHuanJing == null) {
                ctx.throw("活动未开启");
            }
            let rdsUserModel_rdsHdHuanJing = new RdsUserModel_1.RdsUserModel(kid, _hdcid, heid, hdCfg_hdHuanJing.info.id);
            await rdsUserModel_rdsHdHuanJing.backData_u(ctx, _lastId, _lastId + 9);
            await rdsUserModel_rdsHdHuanJing.backData_my(ctx, uuid);
            break;
        case Xys.RdsUser.rdsHdXinMo: //破除心魔
            let hdCfg_hdXinMo = gameMethod_1.gameMethod.objCopy(setting_1.default.getHuodong3(heid, "hdXinMo", _hdcid));
            if (hdCfg_hdXinMo == null) {
                ctx.throw("活动未开启");
            }
            let rdsUserModel_rdsHdXinMo = new RdsUserModel_1.RdsUserModel(kid, _hdcid, heid, hdCfg_hdXinMo.info.id);
            await rdsUserModel_rdsHdXinMo.backData_u(ctx, _lastId, _lastId + 9);
            await rdsUserModel_rdsHdXinMo.backData_my(ctx, uuid);
            break;
        case Xys.RdsUser.rdsHdChumo: //除魔卫道
            let hdCfg_chumo = gameMethod_1.gameMethod.objCopy(setting_1.default.getHuodong3(heid, "hdChumo", _hdcid));
            if (hdCfg_chumo == null) {
                ctx.throw("活动未开启");
            }
            let rdsUserModel_rdsHdChumo = await new RdsUserModel_1.RdsUserModel(kid, _hdcid, heid, hdCfg_chumo.info.id);
            await rdsUserModel_rdsHdChumo.backData_u(ctx, _lastId, _lastId + 9);
            await rdsUserModel_rdsHdChumo.backData_my(ctx, uuid);
            break;
        case Xys.RdsUser.rdsDouLuo: //最强斗罗
            //获取当前 hdcid 和 重置ID 用前端传来的 hdcid
            let hdDouLuoModel = HdDouLuoModel_1.HdDouLuoModel.getInstance(ctx, uuid, hdcid);
            //获取重置ID
            let douLuoInfo = await hdDouLuoModel.getInfo();
            //排行
            let rdsUserModel_rdsDouLuo = RdsUserModel_1.RdsUserModel.getInstance(ctx, Xys.RdsUser.rdsDouLuo, douLuoInfo.ksid, hdcid, douLuoInfo.weekId);
            await rdsUserModel_rdsDouLuo.backData_u(ctx, _lastId, _lastId + 9);
            await rdsUserModel_rdsDouLuo.backData_my(ctx, uuid);
            break;
        case Xys.RdsUser.rdsHdTianGong: //天宫乐舞
            let hdCfg_TianGong = gameMethod_1.gameMethod.objCopy(setting_1.default.getHuodong3(heid, "hdTianGong", _hdcid));
            if (hdCfg_TianGong == null) {
                ctx.throw("活动未开启");
            }
            //RdsUserModel.getInstance(this.ctx, Xys.RdsUser.rdsHdTianGong, hesid, this.hdcid, info.weekId);
            let rdsUserModel_rdsHdTianGong = new RdsUserModel_1.RdsUserModel(kid, _hdcid, heid, game_1.default.getTianGongWeek());
            await rdsUserModel_rdsHdTianGong.backData_u(ctx, _lastId, _lastId + 9);
            await rdsUserModel_rdsHdTianGong.backData_my(ctx, uuid);
            break;
        case Xys.RdsUser.rdsHdTianGongKua: //天宫乐舞 跨服
            let hdCfg_TianGongKua = gameMethod_1.gameMethod.objCopy(setting_1.default.getHuodong3(heid, "hdTianGong", _hdcid));
            if (hdCfg_TianGongKua == null) {
                ctx.throw("活动未开启");
            }
            //去活动 获取 跨服ID
            let hdTianGongModel = HdTianGongModel_1.HdTianGongModel.getInstance(ctx, uuid, _hdcid);
            let ksid = await hdTianGongModel.getKsid();
            let rdsUserModel_rdsHdTianGongKua = new RdsUserModel_1.RdsUserModel(kid, _hdcid, ksid, game_1.default.getTianGongWeek());
            await rdsUserModel_rdsHdTianGongKua.backData_u(ctx, _lastId, _lastId + 9);
            await rdsUserModel_rdsHdTianGongKua.backData_my(ctx, uuid);
            break;
        case Xys.RdsUser.rdsHdDengShenBangKing: //登神榜 个人榜(圣王榜)
            let hdCfg_DengShenBang = gameMethod_1.gameMethod.objCopy(setting_1.default.getHuodong3(heid, "hdDengShenBang", _hdcid));
            if (hdCfg_DengShenBang == null) {
                ctx.throw("活动未开启");
            }
            //去活动 获取 跨服ID
            let hdDengShenBangModel = HdDengShenBangModel_1.HdDengShenBangModel.getInstance(ctx, uuid, _hdcid);
            let ksid_deng = await hdDengShenBangModel.getKsid();
            let rdsUserModel_rdsDengShenBan = new RdsUserModel_1.RdsUserModel(kid, _hdcid, ksid_deng, game_1.default.getWeekId());
            await rdsUserModel_rdsDengShenBan.backData_u(ctx, _lastId, _lastId + 9);
            await rdsUserModel_rdsDengShenBan.backData_my(ctx, uuid);
            break;
        case Xys.RdsClub.rdsClubDengShenBang: //登神榜 仙盟榜
            let hdCfg_DengShenBangClub = gameMethod_1.gameMethod.objCopy(setting_1.default.getHuodong3(heid, "hdDengShenBang", _hdcid));
            if (hdCfg_DengShenBangClub == null) {
                ctx.throw("活动未开启");
            }
            //获取玩家公会ID
            let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
            let _sid = await actClubModel.getClubId();
            //去活动 获取 跨服ID
            let hdDengShenBangModel_club = HdDengShenBangModel_1.HdDengShenBangModel.getInstance(ctx, uuid, _hdcid);
            let ksid_deng_club = await hdDengShenBangModel_club.getKsid();
            let rdsUserModel_rdsDengShenBanClub = new RdsClubModel_1.RdsClubModel(kid, _hdcid, ksid_deng_club, game_1.default.getWeekId());
            await rdsUserModel_rdsDengShenBanClub.backData_u(ctx, _lastId, _lastId + 9);
            await rdsUserModel_rdsDengShenBanClub.backData_my(ctx, _sid);
            break;
    }
});
/**
 * @api {post} /rank/getMy  获取我的排行信息
 * @apiName 获取排行数据
 * @apiGroup ranking
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} kid 排行榜标识 协议key
 * @apiParam {string} hdcid 排行榜标识对应的分组ID 默认为"x"
 */
router.all("/getMy", async (ctx) => {
    ctx.state.apidesc = "排行-获取我的排行信息";
    const { uuid, kid, hdcid } = tool_1.tool.getParams(ctx);
    let _hdcid = hdcid == null ? "x" : hdcid;
    let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
    switch (kid) {
        case "rdsJjc": //竞技场排行榜
            let rdsUserModel_rdsJjc = await new RdsUserModel_1.RdsUserModel("rdsJjc", _hdcid, heid, tool_1.tool.jjcWeekId(ctx.state.newTime));
            await rdsUserModel_rdsJjc.backData_my(ctx, uuid);
            break;
        case Xys.RdsUser.pvw: //试炼周排行
            let rdsUserModel_pvw = RdsUserModel_1.RdsUserModel.getInstance(ctx, "rdsPvw", heid, _hdcid, game_1.default.getWeekId());
            await rdsUserModel_pvw.backData_my(ctx, uuid);
            break;
        case Xys.RdsUser.rdsLiuDao: //六道秘境
            let rdsUserModel_ld = RdsUserModel_1.RdsUserModel.getInstance(ctx, kid, heid);
            await rdsUserModel_ld.backData_my(ctx, uuid);
            break;
        case "rdsHdChongBang": //冲榜
            let hdCfgcb = gameMethod_1.gameMethod.objCopy(setting_1.default.getHuodong3(heid, "hdChongbang", _hdcid));
            if (hdCfgcb == null) {
                ctx.throw("活动未开启");
            }
            let rdsUserModel_rdsHdCb = await new RdsUserModel_1.RdsUserModel(kid, _hdcid, heid, hdCfgcb.info.id);
            await rdsUserModel_rdsHdCb.backData_my(ctx, uuid);
            break;
        // case Xys.RdsClub.rdsClubActive: //公会 活跃度
        //     let rdsClubModel = RdsClubModel.getInstance(ctx, kid, heid);
        //     await rdsClubModel.backData_my(ctx, uuid);
        //     break;
    }
});
//# sourceMappingURL=rank.js.map