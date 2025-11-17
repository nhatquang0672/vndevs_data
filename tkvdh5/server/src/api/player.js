"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tool_1 = require("../util/tool");
const lock_1 = __importDefault(require("../util/lock"));
const gameMethod_1 = require("../../common/gameMethod");
const UserModel_1 = require("../model/user/UserModel");
const MailModel_1 = require("../model/user/MailModel");
const setting_1 = __importDefault(require("../crontab/setting"));
const PlayerModel_1 = require("../model/player/PlayerModel");
const ActItemModel_1 = require("../model/act/ActItemModel");
const ActPveInfoModel_1 = require("../model/act/ActPveInfoModel");
const ActEquipModel_1 = require("../model/act/ActEquipModel");
const ActChiBangModel_1 = require("../model/act/ActChiBangModel");
const ActJjcInfoModel_1 = require("../model/act/ActJjcInfoModel");
const ActJjcLogModel_1 = require("../model/act/ActJjcLogModel");
const ActShopClubModel_1 = require("../model/act/ActShopClubModel");
const ActShopPvwModel_1 = require("../model/act/ActShopPvwModel");
const ActShopItemModel_1 = require("../model/act/ActShopItemModel");
const ActShopDiaMondModel_1 = require("../model/act/ActShopDiaMondModel");
const ActShopCoinModel_1 = require("../model/act/ActShopCoinModel");
const ActChengHModel_1 = require("../model/act/ActChengHModel");
const ActFazhenModel_1 = require("../model/act/ActFazhenModel");
const HdNewModel_1 = require("../model/hd/HdNewModel");
const ActClubModel_1 = require("../model/act/ActClubModel");
const ActAdokSevModel_1 = require("../model/act/ActAdokSevModel");
const ActShengQiModel_1 = require("../model/act/ActShengQiModel");
const HdSpeGiftModel_1 = require("../model/hd/HdSpeGiftModel");
const HdGrowthFundModel_1 = require("../model/hd/HdGrowthFundModel");
const ActBoxModel_1 = require("../model/act/ActBoxModel");
const HdSignGiftModel_1 = require("../model/hd/HdSignGiftModel");
const HdPriCardModel_1 = require("../model/hd/HdPriCardModel");
const HdWelChestModel_1 = require("../model/hd/HdWelChestModel");
const HdTimeBenModel_1 = require("../model/hd/HdTimeBenModel");
const HdTimeBen2Model_1 = require("../model/hd/HdTimeBen2Model");
const ActShopWuqiModel_1 = require("../model/act/ActShopWuqiModel");
const ActShopMaoziModel_1 = require("../model/act/ActShopMaoziModel");
const ActShopYifuModel_1 = require("../model/act/ActShopYifuModel");
const ActShopFushouModel_1 = require("../model/act/ActShopFushouModel");
const ActDongTianModel_1 = require("../model/act/ActDongTianModel");
const ActPveJyModel_1 = require("../model/act/ActPveJyModel");
const ActRwdOptModel_1 = require("../model/act/ActRwdOptModel");
const ActDongTianLogModel_1 = require("../model/act/ActDongTianLogModel");
const ActTaskMainModel_1 = require("../model/act/ActTaskMainModel");
const HdTimeActModel_1 = require("../model/hd/HdTimeActModel");
const ActZhanbuModel_1 = require("../model/act/ActZhanbuModel");
const ActPvwModel_1 = require("../model/act/ActPvwModel");
const ActPvwFightModel_1 = require("../model/act/ActPvwFightModel");
const ActInviteModel_1 = require("../model/act/ActInviteModel");
const gameCfg_1 = __importDefault(require("../../common/gameCfg"));
const Weixin_1 = __importDefault(require("../sdk/Weixin"));
const ActBaoShiModel_1 = require("../model/act/ActBaoShiModel");
const SevPvdModel_1 = require("../model/sev/SevPvdModel");
const ActPvdModel_1 = require("../model/act/ActPvdModel");
const ActShopRenWuModel_1 = require("../model/act/ActShopRenWuModel");
const ActShopFushiGModel_1 = require("../model/act/ActShopFushiGModel");
const ActShopFushiZModel_1 = require("../model/act/ActShopFushiZModel");
const ActShopFushiCModel_1 = require("../model/act/ActShopFushiCModel");
const mongodb_1 = require("../util/mongodb");
const ActRedModel_1 = require("../model/act/ActRedModel");
const ActRedDailyModel_1 = require("../model/act/ActRedDailyModel");
const ActDingYueModel_1 = require("../model/act/ActDingYueModel");
const ActFuShiModel_1 = require("../model/act/ActFuShiModel");
const SevClubModel_1 = require("../model/sev/SevClubModel");
const SevClubMemberModel_1 = require("../model/sev/SevClubMemberModel");
const SevClubApplyModel_1 = require("../model/sev/SevClubApplyModel");
const SevClubHelpModel_1 = require("../model/sev/SevClubHelpModel");
const SevChatModel_1 = require("../model/sev/SevChatModel");
const Xys_1 = require("../../common/Xys");
const game_1 = __importDefault(require("../util/game"));
const ActGuideModel_1 = require("../model/act/ActGuideModel");
const HdLianchongModel_1 = require("../model/hd/HdLianchongModel");
const HdKaifuModel_1 = require("../model/hd/HdKaifuModel");
const HdEquipShopModel_1 = require("../model/hd/HdEquipShopModel");
const HdChouModel_1 = require("../model/hd/HdChouModel");
const ActTaskKindModel_1 = require("../model/act/ActTaskKindModel");
const HdJiYuanModel_1 = require("../model/hd/HdJiYuanModel");
const HdXianshiModel_1 = require("../model/hd/HdXianshiModel");
const ActShopKind11Model_1 = require("../model/act/ActShopKind11Model");
const ActGiftDtModel_1 = require("../model/act/ActGiftDtModel");
const HdJuBaoPenModel_1 = require("../model/hd/HdJuBaoPenModel");
const ActFuShiYhModel_1 = require("../model/act/ActFuShiYhModel");
const ActClubMjModel_1 = require("../model/act/ActClubMjModel");
const HdQiYuanModel_1 = require("../model/hd/HdQiYuanModel");
const HdHuanJingModel_1 = require("../model/hd/HdHuanJingModel");
const HdXinMoModel_1 = require("../model/hd/HdXinMoModel");
const HdHefuqdModel_1 = require("../model/hd/HdHefuqdModel");
const HdChumoModel_1 = require("../model/hd/HdChumoModel");
const RdsUserModel_1 = require("../model/redis/RdsUserModel");
const HdZixuanModel_1 = require("../model/hd/HdZixuanModel");
const ActLonggongModel_1 = require("../model/act/ActLonggongModel");
const ActZhaoCaiModel_1 = require("../model/act/ActZhaoCaiModel");
const ActJinxiuModel_1 = require("../model/act/ActJinxiuModel");
const ActXiantuModel_1 = require("../model/act/ActXiantuModel");
const YlWechat_1 = __importDefault(require("../sdk/YlWechat"));
const HdLunHuiModel_1 = require("../model/hd/HdLunHuiModel");
const HdDayTeHuiModel_1 = require("../model/hd/HdDayTeHuiModel");
const HdChargeDays_1 = require("../model/hd/HdChargeDays");
const HdChargeTotal_1 = require("../model/hd/HdChargeTotal");
const HdNewJiYuanModel_1 = require("../model/hd/HdNewJiYuanModel");
const HdDouLuoModel_1 = require("../model/hd/HdDouLuoModel");
const ActXianlvModel_1 = require("../model/act/ActXianlvModel");
const HdTianGongModel_1 = require("../model/hd/HdTianGongModel");
const Zhiling_1 = __importDefault(require("../sdk/Zhiling"));
const HdChongBangModel_1 = require("../model/hd/HdChongBangModel");
const HdYueGongModel_1 = require("../model/hd/HdYueGongModel");
const HdHuaLianModel_1 = require("../model/hd/HdHuaLianModel");
const SevPaoMaModel_1 = require("../model/sev/SevPaoMaModel");
const HdShanheModel_1 = require("../model/hd/HdShanheModel");
const taobao_1 = __importDefault(require("../sdk/taobao"));
const ActLiuDaoModel_1 = require("../model/act/ActLiuDaoModel");
const SevLiuDaoModel_1 = require("../model/sev/SevLiuDaoModel");
const Wan17_1 = __importDefault(require("../sdk/Wan17"));
const HdChongYangModel_1 = require("../model/hd/HdChongYangModel");
const HdDayTeJiaModel_1 = require("../model/hd/HdDayTeJiaModel");
const ActShopJinTiaoModel_1 = require("../model/act/ActShopJinTiaoModel");
const ActHuanJingModel_1 = require("../model/act/ActHuanJingModel");
const ActWanXiangModel_1 = require("../model/act/ActWanXiangModel");
const ActJingGuaiModel_1 = require("../model/act/ActJingGuaiModel");
const ActDaoyouModel_1 = require("../model/act/ActDaoyouModel");
const HdDengShenBangModel_1 = require("../model/hd/HdDengShenBangModel");
// import taobao from "../sdk/taobao";
const router = new koa_router_1.default();
exports.router = router;
router.prefix("/player");
/**
 * @api {post} /player/login 平台登陆
 * @apiName 平台登陆
 * @apiGroup player
 *
 * @apiParam {string} pid 包ID
 * @apiParam {string[]} param 参数
 */
router.all('/login', async (ctx) => {
    ctx.state.apidesc = "账号-平台登陆";
    ctx.state.addLock = false;
    const { pid, param } = tool_1.tool.getParams(ctx);
    let cfg = gameCfg_1.default.packageInfo.getItemCtx(ctx, pid);
    switch (cfg.plat) {
        case 'wechat':
            await Weixin_1.default.login(ctx, pid, param[0]);
            break;
        case 'local':
            break;
        case 'ylWechat': //仙剑问道
            break;
        case 'zhiling': //智灵
            await Zhiling_1.default.login(ctx, pid, param[0], param[1], param[2]);
            break;
        case 'taobao':
            await taobao_1.default.login(ctx);
            break;
        case 'wan17':
            await Wan17_1.default.login(ctx);
            break;
        default:
            ctx.throw("plat_err");
            break;
    }
    //登陆界面公告
    let noticeWais = setting_1.default.getSetting("1", "noticeWai");
    if (noticeWais != null && noticeWais.length > 0) {
        ctx.state.master.addBackBuf({
            noticeWais: noticeWais
        });
    }
});
/**
 * @api {post} /player/pay sdk支付
 * @apiName sdk支付
 * @apiGroup player
 *
 * @apiParam {string[]} param post必须有参数防止apiParm脚本出错
 */
router.all('/pay/:pid', async (ctx) => {
    ctx.state.apidesc = "账号-sdk支付";
    const { pid } = tool_1.tool.getParams(ctx);
    let cfg = gameCfg_1.default.packageInfo.getItemCtx(ctx, pid);
    switch (cfg.plat) {
        case 'taobao':
            //正式回调：https://shanhaitb.weimigames.com/player/pay/902
            // ctx.set( "Content-Type", 'text/xml ;charset=GBK');
            console.log("======54645646====");
            await taobao_1.default.zhifu(ctx);
            break;
        default:
            ctx.throw("plat_err");
            break;
    }
});
/**
 * @api {post} /player/tb_zc_order 该API用于在游戏直冲时，向供应商下单
 * @apiName 该API用于在游戏直冲时，向供应商下单
 * @apiGroup player
 */
router.all('/tb_zc_order', async (ctx) => {
    //  https://shanhaitb.weimigames.com/player/tb_zc_order
    ctx.set("Content-Type", 'text/xml ;charset=GBK');
    await taobao_1.default.zc_order(ctx);
});
/**
 * @api {post} /player/tb_zc_cancel 淘宝游戏充值直充过程中，由于向厂商取消订单
 * @apiName 淘宝游戏充值直充过程中，由于向厂商取消订单
 * @apiGroup player
 */
router.all('/tb_zc_cancel', async (ctx) => {
    //  https://shanhaitb.weimigames.com/player/tb_zc_cancel
    ctx.set("Content-Type", 'text/xml ;charset=GBK');
    await taobao_1.default.zc_cancel(ctx);
});
/**
 * @api {post} /player/tb_zc_query 该API用于在游戏直充时，向供应商查询已下单子的执行进度
 * @apiName 该API用于在游戏直充时，向供应商查询已下单子的执行进度
 * @apiGroup player
 */
router.all('/tb_zc_query', async (ctx) => {
    //  https://shanhaitb.weimigames.com/player/tb_zc_query
    ctx.set("Content-Type", 'text/xml ;charset=GBK');
    await taobao_1.default.zc_query(ctx);
});
router.all('/getVersion', async (ctx) => {
    ctx.state.apidesc = "账号-getVersion";
    //前端控制却换服务器
    //https://shanhai.weimigames.com/player/getVersion
    //https://office.weimigames.com:4048/player/getVersion
    let cfgVer = setting_1.default.getSetting("1", "clent_ver");
    if (cfgVer != null) {
        ctx.state.master.addSdkBackBuf(cfgVer);
    }
});
router.all('/checkServer', async (ctx) => {
    ctx.state.apidesc = "账号-服务器检测";
    //服务器检测
    //https://office.weimigames.com:4049/player/checkServer
    ctx.throw(503);
});
//仙剑问道发送客服消息
router.all('/ylSend', async (ctx) => {
    ctx.state.apidesc = "账号-仙剑问道发送客服消息";
    //https://shanhaiwd.weimigames.com/player/ylSend
    await YlWechat_1.default.zhifuIosSend(ctx);
});
//淘宝广告-奖励发放
router.all('/tbFaFang', async (ctx) => {
    ctx.state.apidesc = "淘宝广告-奖励发放";
    //https://shanhaitb.weimigames.com/player/tbFaFang
    if (taobao_1.default.checkSign(ctx) == true) {
        const { openId, channel } = tool_1.tool.getParams(ctx);
        // "openId": "AAFa-yJUAOQFzuZ4n4cAJmEd",
        // "channel": "dft",
        // "count": "123",
        // "actionId": "a2b3",
        // "strategy": "random",
        // "type": "gold",
        // "target_appkey": "34494156",
        // "method": "qimen.taobao.hudong.open.award.send",
        // "format": "json",
        // "sign": "753222bf-3942-461f-948e-9f32ffb81b7a",
        // "app_key": "23558957",
        // "sign_method": "md5",
        // "request_id": "16ko8owhb1fwx",
        // "source_appkey": "23558957",
        // "timestamp": "2023-10-11 11:23:47"
        if (channel == "taobaotask") {
            // channel	 发放渠道	双方协商发放的广告渠道，用于约定奖励发放来自哪里。
            // strategy	发放策略	双方协商发放的策略，用于约定发放方式。
            // actionId	动作幂等 ID	需要保障重复的 actionId 在用户级别下不发生重复的发放、扣除动作。 淘宝调用传入的幂等ID是用户级别的（就是不同的用户可能幂等ID相同）
            // type	奖励类型	英文字符，用于声明类型。
            // count	奖励个数	奖励的发放数量，显示声明的发放数量。
            // openId	用户 id	转换过的用户 id
            const { strategy, actionId, type, count } = tool_1.tool.getParams(ctx);
            let back = await mongodb_1.dbSev.getDataDb().findOne("tb_task", { openId: openId, actionId: actionId });
            if (back == null) {
                let uid = "";
                let fuuid = "";
                let info = await mongodb_1.dbSev.getDataDb().findOne("loginPlatform", { "openId": openId });
                if (info != null) {
                    uid = info.uid;
                }
                if (uid != "") {
                    let playerModel = PlayerModel_1.PlayerModel.getInstance(ctx, uid);
                    let player = await playerModel.getInfo();
                    fuuid = player.list[player.sid].uuid;
                    ctx.state.uuid = "10086";
                    ctx.state.fuuid = fuuid;
                    await lock_1.default.setLock(ctx, "user", fuuid); //枷锁
                    switch (type) {
                        case "lingshi":
                            await ctx.state.master.addItem1([1, 1, 100]);
                            break;
                        case "lunhuishi":
                            await ctx.state.master.addItem1([1, 51, 5]);
                            break;
                        case "bailianyu":
                            await ctx.state.master.addItem1([1, 52, 3]);
                            break;
                        case "fanpinxiandan":
                            await ctx.state.master.addItem1([1, 1500, 10]);
                            break;
                    }
                }
                await mongodb_1.dbSev.getDataDb().update("tb_task", { openId: openId, actionId: actionId }, {
                    openId: openId,
                    actionId: actionId,
                    type: type,
                    count: count,
                    channel: channel,
                    strategy: strategy,
                    uid: uid,
                    fuuid: fuuid
                }, true);
            }
        }
        else {
            let back = await mongodb_1.dbSev.getDataDb().findOne("tb_kind11", { openid: openId });
            if (back != null) {
                await mongodb_1.dbSev.getDataDb().update("tb_kind11", { openid: openId }, {
                    "openid": openId,
                    "time": ctx.state.newTime
                });
            }
        }
        ctx.state.master.addSdkBackBuf({
            "bizCode": "SUCCESS",
            "bizMsg": "success",
            "success": true,
            "type": "sprite",
            "count": 1,
            "displayUnit": "宝箱",
            "displayCount": "0.01",
            "displayIcon": "",
            "totalCount": "1231231"
        });
        return;
    }
    ctx.state.master.addSdkBackBuf({
        "bizCode": "sign-check-failure",
    });
});
//淘宝广告 - 奖励回收 
router.all('/tbHuiShou', async (ctx) => {
    ctx.state.apidesc = "淘宝广告  - 奖励回收";
    //https://shanhaikaifa.weimigames.com/player/tbHuiShou
    if (taobao_1.default.checkSign(ctx) == true) {
        const { openId } = tool_1.tool.getParams(ctx);
        let back = await mongodb_1.dbSev.getDataDb().findOne("tb_kind11", { openid: openId });
        if (back != null) {
            await mongodb_1.dbSev.getDataDb().update("tb_kind11", { openid: openId }, {
                "openid": openId,
                "kind11Id": "",
                "time": 0
            });
        }
        ctx.state.master.addSdkBackBuf({
            "bizCode": "SUCCESS",
            "bizMsg": "success",
            "success": true,
            "type": "sprite",
            "count": 1,
            "displayUnit": "宝箱",
            "displayCount": "0.01",
            "displayIcon": "",
            "totalCount": "1231231"
        });
        return;
    }
    ctx.state.master.addSdkBackBuf({
        "bizCode": "sign-check-failure",
    });
});
/**
 * @api {post} /player/shebeijihuo 设备激活
 * @apiName 设备激活
 * @apiGroup player
 *
 * @apiParam {string} pid 分包ID
 * @apiParam {string} wyid 唯一标识
 */
router.all('/shebeijihuo', async (ctx) => {
    ctx.state.apidesc = "账号-设备激活";
    let { pid, wyid } = tool_1.tool.getParams(ctx);
    let back = await mongodb_1.dbSev.getFlowDb().find("shebei", { pid: pid, wyid: wyid });
    if (back != null) {
        return;
    }
    await mongodb_1.dbSev.getFlowDb().update("shebei", { pid: pid, wyid: wyid }, { pid: pid, wyid: wyid }, true);
});
/**
 * @api {post} /player/loginPlayer 账号登陆
 * @apiName 账号登陆
 * @apiGroup player
 *
 * @apiParam {string} pid 分包ID
 * @apiParam {string} openid 登陆唯一标识
 * @apiParam {string} lang 语言
 * @apiParam {string} plat 登陆平台
 * @apiParam {string[]} parms 其他参数
 * @apiParam {string} invuuid 邀请者 uuid
 */
router.all("/loginPlayer", async (ctx) => {
    ctx.state.apidesc = "账号-账号登陆";
    let { pid, plat, invuuid, openid, parms } = tool_1.tool.getParams(ctx);
    let typeMsg = await tool_1.tool.openidLogin(ctx);
    if (setting_1.default.isBan(typeMsg.data, "3", ctx.state.newTime) == true) {
        ctx.throw(502, "该账号已被封禁，请联系客服！");
    }
    let qdtype = "DEFAULT";
    if (parms[1] != null && typeof parms[1] == "string") {
        let qdinfo = JSON.parse(parms[1]);
        if (qdinfo != null && qdinfo.extra != null) {
            qdtype = qdinfo.extra.raw;
        }
    }
    let playerModel = PlayerModel_1.PlayerModel.getInstance(ctx, typeMsg.data);
    await playerModel.setPid(pid, qdtype);
    await playerModel.resetToken();
    let player = await playerModel.getInfo();
    //设置邀请 uuid //是uuid 不是 uid
    await playerModel.setInvite(invuuid); //作为深度邀请逻辑使用
    let qflist = setting_1.default.getQufus();
    //区服列表
    let outf = {};
    outf["qufuList"] = qflist;
    //下发充值档次信息
    let cfgOrder = setting_1.default.getSetting("1", "order");
    if (cfgOrder[plat] == null) {
        ctx.throw(`平台${plat}未配置充值档次信息`);
    }
    outf["orderList"] = cfgOrder[plat];
    //开关
    let cfgswitch = setting_1.default.getSetting("1", "switch");
    if (cfgswitch != null) {
        ctx.state.master.addBackBuf({
            switch: cfgswitch
        });
    }
    ctx.state.master.addBackBuf(outf);
    if (player.sid != "" && qflist[player.sid] != null) {
        let heid = qflist[player.sid].heid;
        let rdsUserModel_rdsJjc = await new RdsUserModel_1.RdsUserModel("rdsJjc", "x", heid, tool_1.tool.jjcWeekId(ctx.state.newTime));
        await rdsUserModel_rdsJjc.backData_u(ctx, 1, 3);
    }
});
/**
 * @api {post} /player/reconnect 短线重连
 * @apiName 短线重连
 * @apiGroup player
 *
 * @apiParam {string} uid 账号uid
 * @apiParam {string} sid 区服ID  （传0默认为1）
 * @apiParam {string} token 账号token (player下发得token字段)
 */
router.all("/reconnect", async (ctx) => {
    ctx.state.apidesc = "账号-短线重连";
    await user_login_send(ctx);
});
/**
 * @api {post} /player/loginUser 角色登陆
 * @apiName 角色登陆
 * @apiGroup player
 *
 * @apiParam {string} uid 账号uid
 * @apiParam {string} sid 区服ID  （传0默认为1）
 * @apiParam {string} token 账号token (player下发得token字段)
 */
router.all("/loginUser", async (ctx) => {
    ctx.state.apidesc = "账号-角色登陆";
    await user_login_send(ctx);
});
//仙剑问道 获取小程序的 URL Link
router.all('/getUrlLink', async (ctx) => {
    ctx.state.apidesc = "账号-仙剑问道 获取小程序的";
    //https://shanhaiwd.weimigames.com/player/getUrlLink
    await YlWechat_1.default.getUrlLink(ctx);
});
/**
 * @api {post} /player/addClientError 记录前端错误日志
 * @apiName 记录前端错误日志
 * @apiGroup player
 *
 * @apiParam {string} pid 分包ID
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string[]} error 错误信息
 */
router.all("/addClientError", async (ctx) => {
    ctx.state.apidesc = "账号-记录前端错误日志";
    let { pid, uuid, error } = tool_1.tool.getParams(ctx);
    tool_1.tool.addClientError(pid, uuid, error);
});
/**
 * @api {post} /player/maidian 前端埋点
 * @apiName 前端埋点
 * @apiGroup player
 *
 * @apiParam {string} pid 包ID
 * @apiParam {string} openid 唯一标识
 * @apiParam {string} step 埋点ID
 * @apiParam {string} uuid 角色ID
 * @apiParam {string[]} key 参数key
 */
router.all('/maidian', async (ctx) => {
    ctx.state.apidesc = "账号-前端埋点";
    let { pid, openid, step, uuid, key } = tool_1.tool.getParams(ctx);
    await mongodb_1.dbSev.getFlowDb().insert("Cmaidian", {
        pid: pid,
        openid: openid,
        step: step,
        key: JSON.stringify(key),
        uuid: uuid,
        at: ctx.state.newTime,
        ip: tool_1.tool.getClientIP(ctx),
    });
});
//角色登陆下发信息函数 （登陆+短线重连）
async function user_login_send(ctx) {
    let { uid, token, sid, open_id } = tool_1.tool.getParams(ctx);
    let playerModel = PlayerModel_1.PlayerModel.getInstance(ctx, uid);
    let playerInfo = await playerModel.getInfo();
    await playerModel.checkToken(token); //检查token
    if (sid == null || sid == "0" || sid == "") {
        sid = setting_1.default.getQufuNewId();
    }
    if (setting_1.default.getQufus()[sid] == null) {
        ctx.throw("入口已消失！");
    }
    if (setting_1.default.getQufus()[sid].status == "4") {
        ctx.throw(502, "区服维护中");
    }
    if (setting_1.default.getQufus()[sid].openAt > ctx.state.newTime) {
        ctx.throw("区服未开启");
    }
    ctx.state.sid = sid; //赋值Sid
    let uuid = await playerModel.doInit(sid); //初始化user/更新player  获取uuid
    ctx.state.qhao = uuid;
    //切换uuid
    let cfgLoginUuid = setting_1.default.getSetting("1", "loginUuid");
    if (cfgLoginUuid != null && cfgLoginUuid[uuid] != null) {
        uuid = cfgLoginUuid[uuid];
    }
    if (setting_1.default.isBan(uuid, "2", ctx.state.newTime) == true) {
        ctx.throw(502, "该角色已被封禁，请联系客服！");
    }
    ctx.state.uuid = uuid; //赋值角色ID
    await lock_1.default.setLock(ctx, "user", uuid); //枷锁
    await ctx.state.master.setInfoAll(); //用户个人信息登陆提速
    let userModel = UserModel_1.UserModel.getInstance(ctx, uuid);
    await userModel.set_s_ver();
    await userModel.loginIscz();
    let userInfo = await userModel.getInfo();
    ctx.state.regtime = userInfo.regtime; //赋值角色ID
    ctx.state.level = userInfo.level;
    ctx.state.sid = userInfo.sid;
    ctx.state.uid = userInfo.uid;
    ctx.state.pid = playerInfo.pid;
    //输出用户信息
    await userModel.setToken();
    await userModel.clickOne(); //重置时间
    await playerModel.backData(); //在下发一次
    let heid = setting_1.default.getHeid(ctx.state.sid);
    let kfdays = game_1.default.passDay(setting_1.default.getQufus()[heid].openAt);
    ctx.state.master.addBackBuf({
        sbUuid: ctx.state.uuid,
        other: {
            new0: ctx.state.new0,
            week0: game_1.default.week_0(),
            kfdays: kfdays
        },
    });
    let notices = setting_1.default.getSetting(sid, "notice");
    if (notices != null && notices.length > 0) {
        ctx.state.master.addBackBuf({
            notices: notices
        });
    }
    //邮件
    let mailModel = MailModel_1.MailModel.getInstance(ctx, uuid);
    await mailModel.backData();
    //道具下发
    let itemHdcids = ["1", "2", "9"];
    for (const hdcid of itemHdcids) {
        let actItem = ActItemModel_1.ActItemModel.getInstance(ctx, uuid, hdcid);
        await actItem.backData();
    }
    //接收任务统计 数据处理
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.jiesuoBaoshi();
    await actTaskKindModel.backData();
    //宝箱
    let actBoxModel = ActBoxModel_1.ActBoxModel.getInstance(ctx, uuid);
    await actBoxModel.backData();
    //pve信息
    let actPveInfoModel = ActPveInfoModel_1.ActPveInfoModel.getInstance(ctx, uuid);
    await actPveInfoModel.backData();
    //pvd信息
    let actPvdModel = ActPvdModel_1.ActPvdModel.getInstance(ctx, uuid);
    await actPvdModel.backData();
    //pve精英信息
    let actPveJyModel = ActPveJyModel_1.ActPveJyModel.getInstance(ctx, uuid);
    await actPveJyModel.backData();
    //翅膀
    let actChiBangModel = ActChiBangModel_1.ActChiBangModel.getInstance(ctx, uuid);
    await actChiBangModel.unLock();
    await actChiBangModel.backData();
    //竞技场信息
    let actJjcInfoModel = ActJjcInfoModel_1.ActJjcInfoModel.getInstance(ctx, uuid);
    await actJjcInfoModel.backData();
    //竞技场日志信息
    let actJjcLogModel = ActJjcLogModel_1.ActJjcLogModel.getInstance(ctx, uuid);
    await actJjcLogModel.backData();
    //装备穿着
    let actEquipModel = ActEquipModel_1.ActEquipModel.getInstance(ctx, uuid);
    await actEquipModel.resetTrader();
    await actEquipModel.backData();
    //商店 - 道具
    let actShopKind11Model = ActShopKind11Model_1.ActShopKind11Model.getInstance(ctx, uuid);
    await actShopKind11Model.backData();
    //商店 - 道具
    let actShopItemModel = ActShopItemModel_1.ActShopItemModel.getInstance(ctx, uuid);
    await actShopItemModel.backData();
    //商店 - 金条
    let actShopJinTiaoModel = ActShopJinTiaoModel_1.ActShopJinTiaoModel.getInstance(ctx, uuid);
    await actShopJinTiaoModel.backData();
    //商店 - 金币
    let actShopCoinModel = ActShopCoinModel_1.ActShopCoinModel.getInstance(ctx, uuid);
    await actShopCoinModel.backData();
    //商店 钻石
    let actShopDiaMondModel = ActShopDiaMondModel_1.ActShopDiaMondModel.getInstance(ctx, uuid);
    await actShopDiaMondModel.backData();
    //商店-工会
    let actShopClubModel = ActShopClubModel_1.ActShopClubModel.getInstance(ctx, uuid);
    await actShopClubModel.backData();
    //商店-试炼
    let actShopPvwModel = ActShopPvwModel_1.ActShopPvwModel.getInstance(ctx, uuid);
    await actShopPvwModel.backData();
    //商店-武器
    let actShopWuqiModel = ActShopWuqiModel_1.ActShopWuqiModel.getInstance(ctx, uuid);
    await actShopWuqiModel.backData();
    //商店-帽子
    let actShopMaoziModel = ActShopMaoziModel_1.ActShopMaoziModel.getInstance(ctx, uuid);
    await actShopMaoziModel.backData();
    //商店-衣服
    let actShopYifuModel = ActShopYifuModel_1.ActShopYifuModel.getInstance(ctx, uuid);
    await actShopYifuModel.backData();
    //商店-副手
    let actShopFushouModel = ActShopFushouModel_1.ActShopFushouModel.getInstance(ctx, uuid);
    await actShopFushouModel.backData();
    //商店-皮肤头像
    let actShopRenWuModel = ActShopRenWuModel_1.ActShopRenWuModel.getInstance(ctx, uuid);
    await actShopRenWuModel.backData();
    //符石商店 - 礼包
    let actShopFushiGModel = ActShopFushiGModel_1.ActShopFushiGModel.getInstance(ctx, uuid);
    await actShopFushiGModel.backData();
    //符石商店 - 符石币
    let actShopFushiCModel = ActShopFushiCModel_1.ActShopFushiCModel.getInstance(ctx, uuid);
    await actShopFushiCModel.backData();
    //符石商店 - 钻石
    let actShopFushiZModel = ActShopFushiZModel_1.ActShopFushiZModel.getInstance(ctx, uuid);
    await actShopFushiZModel.backData();
    //常规礼包 - 洞天
    let actGiftDtModel = ActGiftDtModel_1.ActGiftDtModel.getInstance(ctx, uuid);
    await actGiftDtModel.backData();
    //幻境阁
    let actHuanJingModel = ActHuanJingModel_1.ActHuanJingModel.getInstance(ctx, uuid);
    await actHuanJingModel.backData();
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.loginReSet(); //每次登陆检测
    await actChengHModel.backData();
    //法阵
    let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(ctx, uuid);
    await actFazhenModel.backData();
    //公会
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    let actClub = await actClubModel.getInfo();
    await actClubModel.backData();
    if (actClub.clubId != "") {
        let actClubMjModel = ActClubMjModel_1.ActClubMjModel.getInstance(ctx, uuid);
        await actClubMjModel.backData();
    }
    //圣器
    let actShengQiModel = ActShengQiModel_1.ActShengQiModel.getInstance(ctx, uuid);
    await actShengQiModel.backData();
    //主线任务
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.LoginrefreshHook();
    await actTaskMainModel.clickKind191();
    await actTaskMainModel.backData();
    //六道秘境 - act
    let actLiuDaoModel = ActLiuDaoModel_1.ActLiuDaoModel.getInstance(ctx, uuid);
    await actLiuDaoModel.backData();
    //六道秘境 - sev
    let sevLiuDaoModel = SevLiuDaoModel_1.SevLiuDaoModel.getInstance(ctx, heid);
    await sevLiuDaoModel.backData();
    //精怪
    let actJingGuaiModel = ActJingGuaiModel_1.ActJingGuaiModel.getInstance(ctx, uuid);
    await actJingGuaiModel.backData();
    //洞天
    let actDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(ctx, uuid);
    await actDongTianModel.robOver();
    await actDongTianModel.backData();
    //洞天日志
    let actDongTianLogModel = ActDongTianLogModel_1.ActDongTianLogModel.getInstance(ctx, uuid);
    await actDongTianLogModel.backData();
    //杂项奖励
    let actRwdOptModel = ActRwdOptModel_1.ActRwdOptModel.getInstance(ctx, uuid);
    await actRwdOptModel.backData();
    //占卜转盘
    let actZhanbuModel = ActZhanbuModel_1.ActZhanbuModel.getInstance(ctx, uuid);
    await actZhanbuModel.backData();
    //试炼
    let actPvwModel = ActPvwModel_1.ActPvwModel.getInstance(ctx, uuid);
    await actPvwModel.backData();
    //试炼战斗
    let actPvwFightModel = ActPvwFightModel_1.ActPvwFightModel.getInstance(ctx, uuid);
    await actPvwFightModel.backData();
    //邀请
    let actInviteModel = ActInviteModel_1.ActInviteModel.getInstance(ctx, uuid);
    await actInviteModel.backData();
    //宝石
    let actBaoShiModel = ActBaoShiModel_1.ActBaoShiModel.getInstance(ctx, uuid);
    await actBaoShiModel.backData();
    //符石
    let actFuShiModel = ActFuShiModel_1.ActFuShiModel.getInstance(ctx, uuid);
    await actFuShiModel.backData();
    //符石 - 鱼获盛宴
    let actFuShiYhModel = ActFuShiYhModel_1.ActFuShiYhModel.getInstance(ctx, uuid);
    await actFuShiYhModel.backData();
    //红点
    let actRedModel = ActRedModel_1.ActRedModel.getInstance(ctx, uuid);
    await actRedModel.backData();
    //万象
    let actWanXiangModel = ActWanXiangModel_1.ActWanXiangModel.getInstance(ctx, uuid);
    await actWanXiangModel.backData();
    //红点每日重置
    let actRedDailyModel = ActRedDailyModel_1.ActRedDailyModel.getInstance(ctx, uuid);
    await actRedDailyModel.backData();
    //新手引导
    let actGuideModel = ActGuideModel_1.ActGuideModel.getInstance(ctx, uuid);
    await actGuideModel.backData();
    //仙途
    let actXiantuModel = ActXiantuModel_1.ActXiantuModel.getInstance(ctx, uuid);
    await actXiantuModel.backData();
    //订阅
    let actDingYueModel = ActDingYueModel_1.ActDingYueModel.getInstance(ctx, uuid);
    await actDingYueModel.backData();
    //招财幡
    let actZhaoCaiModel = ActZhaoCaiModel_1.ActZhaoCaiModel.getInstance(ctx, uuid);
    await actZhaoCaiModel.backData();
    //龙宫运宝
    let actLonggongModel = ActLonggongModel_1.ActLonggongModel.getInstance(ctx, uuid);
    await actLonggongModel.backData();
    //锦绣坊
    let actJinxiuModel = ActJinxiuModel_1.ActJinxiuModel.getInstance(ctx, uuid);
    await actJinxiuModel.backData();
    //仙侣
    let actXianlvModel = ActXianlvModel_1.ActXianlvModel.getInstance(ctx, uuid);
    await actXianlvModel.backData();
    //道友
    let daoyoumodel = ActDaoyouModel_1.ActDaoyouModel.getInstance(ctx, uuid);
    await daoyoumodel.backData();
    //自定义设置称号
    let setChengHao = setting_1.default.getSetting("1", "setChengHao");
    if (setChengHao != null && setChengHao[uuid] != null) {
        ctx.state.master.addBackBuf({
            setChengHao: setChengHao[uuid]
        });
    }
    //活动 - 签到
    let cfgHdNew = setting_1.default.getHuodong2(heid, "hdNew");
    if (cfgHdNew != null) {
        for (const hdcid in cfgHdNew) {
            let hdNewModel = HdNewModel_1.HdNewModel.getInstance(ctx, uuid, hdcid);
            await hdNewModel.setRed(1);
            await hdNewModel.backData();
        }
    }
    //活动 - 特惠礼包
    let cfgHdSpeGift = setting_1.default.getHuodong2(heid, "hdSpeGift");
    if (cfgHdSpeGift != null) {
        for (const hdcid in cfgHdSpeGift) {
            let hdSpeGiftModel = HdSpeGiftModel_1.HdSpeGiftModel.getInstance(ctx, uuid, hdcid);
            await hdSpeGiftModel.backData();
        }
    }
    //活动 - 基金 成长基金 角色基金
    let cfgHdGrowthFund = setting_1.default.getHuodong2(heid, "hdGrowthFund");
    if (cfgHdGrowthFund != null) {
        for (const hdcid in cfgHdGrowthFund) {
            let hdGrowthFundModel = HdGrowthFundModel_1.HdGrowthFundModel.getInstance(ctx, uuid, hdcid);
            await hdGrowthFundModel.checkIsOver();
            await hdGrowthFundModel.backData();
        }
    }
    //活动 - 签到
    let cfgHdSignGift = setting_1.default.getHuodong2(heid, "hdSignGift");
    if (cfgHdSignGift != null) {
        for (const hdcid in cfgHdSignGift) {
            let hdSignGiftModel = HdSignGiftModel_1.HdSignGiftModel.getInstance(ctx, uuid, hdcid);
            await hdSignGiftModel.backData();
        }
    }
    //活动 - 特权卡
    let cfgHdPriCard = setting_1.default.getHuodong2(heid, "hdPriCard");
    if (cfgHdPriCard != null) {
        for (const hdcid in cfgHdPriCard) {
            let hdPriCardModel = HdPriCardModel_1.HdPriCardModel.getInstance(ctx, uuid, hdcid);
            await hdPriCardModel.backData();
        }
    }
    //活动 - 福利宝箱
    let cfgHdWelChest = setting_1.default.getHuodong2(heid, "hdWelChest");
    if (cfgHdWelChest != null) {
        for (const hdcid in cfgHdWelChest) {
            let hdWelChestModel = HdWelChestModel_1.HdWelChestModel.getInstance(ctx, uuid, hdcid);
            await hdWelChestModel.backData();
        }
    }
    //活动 - 限时福利
    let cfgHdTimeBen = setting_1.default.getHuodong2(heid, "hdTimeBen");
    if (cfgHdTimeBen != null) {
        for (const hdcid in cfgHdTimeBen) {
            let hdTimeBenModel = HdTimeBenModel_1.HdTimeBenModel.getInstance(ctx, uuid, hdcid);
            await hdTimeBenModel.backData();
        }
    }
    //活动 - 限时福利 触发礼包改版 改列表
    let cfgHdTime2Ben = setting_1.default.getHuodong2(heid, "hdTimeBen2");
    if (cfgHdTime2Ben != null) {
        for (const hdcid in cfgHdTime2Ben) {
            let hdTimeBen2Model = HdTimeBen2Model_1.HdTimeBen2Model.getInstance(ctx, uuid, hdcid);
            await hdTimeBen2Model.backData();
        }
    }
    //活动 - 限时活动 任务
    let cfgHdTimeAct = setting_1.default.getHuodong2(heid, "hdTimeAct");
    if (cfgHdTimeAct != null) {
        for (const hdcid in cfgHdTimeAct) {
            let hdTimeActModel = HdTimeActModel_1.HdTimeActModel.getInstance(ctx, uuid, hdcid);
            await hdTimeActModel.backData();
        }
    }
    //活动 - 连冲活动
    let cfgHdLianchong = setting_1.default.getHuodong2(heid, "hdLianchong");
    if (cfgHdLianchong != null) {
        for (const hdcid in cfgHdLianchong) {
            let hdLianchongModel = HdLianchongModel_1.HdLianchongModel.getInstance(ctx, uuid, hdcid);
            await hdLianchongModel.backData();
        }
    }
    //活动 - 开服活动
    let cfgHdKaifu = setting_1.default.getHuodong2(heid, "hdKaifu");
    if (cfgHdKaifu != null) {
        for (const hdcid in cfgHdKaifu) {
            let hdKaifugModel = HdKaifuModel_1.HdKaifugModel.getInstance(ctx, uuid, hdcid);
            await hdKaifugModel.backData_u(['info', 'red']);
        }
    }
    //活动 - 装备商人
    let cfgHdEquipShop = setting_1.default.getHuodong2(heid, "hdEquipShop");
    if (cfgHdEquipShop != null) {
        for (const hdcid in cfgHdEquipShop) {
            let hdEquipShopModel = HdEquipShopModel_1.HdEquipShopModel.getInstance(ctx, uuid, hdcid);
            await hdEquipShopModel.backData();
        }
    }
    //活动 - 九龙秘宝
    let cfgHdChou = setting_1.default.getHuodong2(heid, "hdChou");
    if (cfgHdChou != null) {
        for (const hdcid in cfgHdChou) {
            let hdChouModel = HdChouModel_1.HdChouModel.getInstance(ctx, uuid, hdcid);
            await hdChouModel.backData_u(["info", "red"]);
        }
    }
    //活动 - 机缘
    let cfgHdJiYuan = setting_1.default.getHuodong2(heid, "hdJiYuan");
    if (cfgHdJiYuan != null) {
        for (const hdcid in cfgHdJiYuan) {
            let hdJiYuanModel = HdJiYuanModel_1.HdJiYuanModel.getInstance(ctx, uuid, hdcid);
            await hdJiYuanModel.backData_u(["info", "red"]);
        }
    }
    //活动 - 新版机缘
    let cfgHdNewJiYuan = setting_1.default.getHuodong2(heid, "hdNewJiYuan");
    if (cfgHdNewJiYuan != null) {
        for (const hdcid in cfgHdNewJiYuan) {
            let hdNewJiYuanModel = HdNewJiYuanModel_1.HdNewJiYuanModel.getInstance(ctx, uuid, hdcid);
            await hdNewJiYuanModel.backData_u(["info", "red"]);
        }
    }
    //活动 - 独立限时礼包
    let cfgHdXianshi = setting_1.default.getHuodong2(heid, "hdXianshi");
    if (cfgHdXianshi != null) {
        for (const hdcid in cfgHdXianshi) {
            let hdXianshiModel = HdXianshiModel_1.HdXianshiModel.getInstance(ctx, uuid, hdcid);
            await hdXianshiModel.backData();
        }
    }
    //活动 - 聚宝盆
    let cfgHdJuBaoPen = setting_1.default.getHuodong2(heid, "hdJuBaoPen");
    if (cfgHdJuBaoPen != null) {
        for (const hdcid in cfgHdJuBaoPen) {
            let hdJuBaoPenModel = HdJuBaoPenModel_1.HdJuBaoPenModel.getInstance(ctx, uuid, hdcid);
            await hdJuBaoPenModel.backData();
        }
    }
    //活动 - 兽灵起源
    let cfgHdQiYuan = setting_1.default.getHuodong2(heid, "hdQiYuan");
    if (cfgHdQiYuan != null) {
        for (const hdcid in cfgHdQiYuan) {
            let hdQiYuanModel = HdQiYuanModel_1.HdQiYuanModel.getInstance(ctx, uuid, hdcid);
            await hdQiYuanModel.backData_u(["info", "red"]);
        }
    }
    //活动 - 鱼灵幻境
    let cfgHdHuanJing = setting_1.default.getHuodong2(heid, "hdHuanJing");
    if (cfgHdHuanJing != null) {
        for (const hdcid in cfgHdHuanJing) {
            let hdHuanJingModel = HdHuanJingModel_1.HdHuanJingModel.getInstance(ctx, uuid, hdcid);
            await hdHuanJingModel.backData_u(["info", "red"]);
        }
    }
    //活动 - 破除心魔
    let cfgHdXinMo = setting_1.default.getHuodong2(heid, "hdXinMo");
    if (cfgHdXinMo != null) {
        for (const hdcid in cfgHdXinMo) {
            let hdXinMoModel = HdXinMoModel_1.HdXinMoModel.getInstance(ctx, uuid, hdcid);
            await hdXinMoModel.backData_u(["info", "red"]);
        }
    }
    //活动 - 合服庆典
    let cfgHefuqd = setting_1.default.getHuodong2(heid, "hdHefuqd");
    if (cfgHefuqd != null) {
        for (const hdcid in cfgHefuqd) {
            let hdHefuqdModel = HdHefuqdModel_1.HdHefuqdModel.getInstance(ctx, uuid, hdcid);
            await hdHefuqdModel.backData_u(["info", "red"]);
        }
    }
    //活动 - 合服除魔卫道
    let cfgHdChumo = setting_1.default.getHuodong2(heid, "hdChumo");
    if (cfgHdChumo != null) {
        for (const hdcid in cfgHdChumo) {
            let hdChumoModel = HdChumoModel_1.HdChumoModel.getInstance(ctx, uuid, hdcid);
            await hdChumoModel.backData_u(["info", "red"]);
        }
    }
    //活动 - 自选礼包
    let cfgHdZixuan = setting_1.default.getHuodong2(heid, "hdZixuan");
    if (cfgHdZixuan != null) {
        for (const hdcid in cfgHdZixuan) {
            let hdZixuanModel = HdZixuanModel_1.HdZixuanModel.getInstance(ctx, uuid, hdcid);
            await hdZixuanModel.backData_u(["info", "red"]);
        }
    }
    //活动 - 天道轮回
    let cfgHdLunHui = setting_1.default.getHuodong2(heid, "hdLunHui");
    if (cfgHdLunHui != null) {
        for (const hdcid in cfgHdLunHui) {
            let hdLunHuiModel = HdLunHuiModel_1.HdLunHuiModel.getInstance(ctx, uuid, hdcid);
            await hdLunHuiModel.backData_u(["info", "red"]);
        }
    }
    //活动 - 每日特惠
    let cfgHdDayTeHui = setting_1.default.getHuodong2(heid, "hdDayTeHui");
    if (cfgHdDayTeHui != null) {
        for (const hdcid in cfgHdDayTeHui) {
            let hdDayTeHuiModel = HdDayTeHuiModel_1.HdDayTeHuiModel.getInstance(ctx, uuid, hdcid);
            await hdDayTeHuiModel.backData_u(["info", "red", "outf"]);
        }
    }
    //活动 - 累计天数充值礼包
    let cfgHdChargeDays = setting_1.default.getHuodong2(heid, "hdChargeDays");
    if (cfgHdChargeDays != null) {
        for (const hdcid in cfgHdChargeDays) {
            let hdChargeDaysModel = HdChargeDays_1.HdChargeDaysModel.getInstance(ctx, uuid, hdcid);
            await hdChargeDaysModel.backData_u(["info", "red", "outf"]);
        }
    }
    //活动 - 累计充值礼包
    let cfgHdChargeTotal = setting_1.default.getHuodong2(heid, "hdChargeTotal");
    if (cfgHdChargeTotal != null) {
        for (const hdcid in cfgHdChargeTotal) {
            let hdChargeTotalModel = HdChargeTotal_1.HdChargeTotalModel.getInstance(ctx, uuid, hdcid);
            await hdChargeTotalModel.backData();
        }
    }
    //活动 - 最强斗罗
    let cfgHdDouLuo = setting_1.default.getHuodong2(heid, "hdDouLuo");
    if (cfgHdDouLuo != null) {
        for (const hdcid in cfgHdDouLuo) {
            let hdDouLuoModel = HdDouLuoModel_1.HdDouLuoModel.getInstance(ctx, uuid, hdcid);
            await hdDouLuoModel.setLogin(1);
            await hdDouLuoModel.backData();
        }
    }
    //活动 - 天宫乐舞 hdTianGong  // 合服ID
    let cfgHdTianGong = setting_1.default.getHuodong2(heid, "hdTianGong");
    if (cfgHdTianGong != null) {
        for (const hdcid in cfgHdTianGong) {
            let hdTianGongModel = HdTianGongModel_1.HdTianGongModel.getInstance(ctx, uuid, hdcid);
            await hdTianGongModel.backData_u(["info", "red", "outf"]);
        }
    }
    //活动 - 冲榜
    let cfgHdCb = setting_1.default.getHuodong2(heid, "hdChongbang");
    if (cfgHdCb != null) {
        for (const hdcid in cfgHdCb) {
            let hdChongBangModel = HdChongBangModel_1.HdChongBangModel.getInstance(ctx, uuid, hdcid);
            await hdChongBangModel.isOpenHd();
            await hdChongBangModel.backData();
        }
    }
    //活动 - 月宫探宝
    let cfgHdYg = setting_1.default.getHuodong2(heid, "hdYueGong");
    if (cfgHdYg != null) {
        for (const hdcid in cfgHdYg) {
            let hdYueGongModel = HdYueGongModel_1.HdYueGongModel.getInstance(ctx, uuid, hdcid);
            await hdYueGongModel.backData_u(["info", "red"]);
        }
    }
    //活动 - 山河庆典
    let cfgHdSh = setting_1.default.getHuodong2(heid, "hdShanhe");
    if (cfgHdSh != null) {
        for (const hdcid in cfgHdSh) {
            let hdShanheModel = HdShanheModel_1.HdShanheModel.getInstance(ctx, uuid, hdcid);
            await hdShanheModel.backData_u(["info", "red"]);
        }
    }
    //活动 - 每日特价
    let cfgHdTj = setting_1.default.getHuodong2(heid, "hdDayTeJia");
    if (cfgHdTj != null) {
        for (const hdcid in cfgHdTj) {
            let hdDayTeJiaModel = HdDayTeJiaModel_1.HdDayTeJiaModel.getInstance(ctx, uuid, hdcid);
            await hdDayTeJiaModel.backData();
        }
    }
    //活动 - 化莲
    let cfgHdHl = setting_1.default.getHuodong2(heid, "hdHuaLian");
    if (cfgHdHl != null) {
        for (const hdcid in cfgHdHl) {
            let hdHuaLianModel = HdHuaLianModel_1.HdHuaLianModel.getInstance(ctx, uuid, hdcid);
            await hdHuaLianModel.backData_u(["info", "red"]);
        }
    }
    //活动 - 重阳出游
    let cfgHdcy = setting_1.default.getHuodong2(heid, "hdChongYang");
    if (cfgHdcy != null) {
        for (const hdcid in cfgHdcy) {
            let hdChongYangModel = HdChongYangModel_1.HdChongYangModel.getInstance(ctx, uuid, hdcid);
            await hdChongYangModel.backData_u(["info", "red"]);
        }
    }
    //活动 - 登神榜
    let cfgDsb = setting_1.default.getHuodong2(heid, "hdDengShenBang");
    if (cfgDsb != null) {
        for (const hdcid in cfgDsb) {
            let hdDengShenBangModel = HdDengShenBangModel_1.HdDengShenBangModel.getInstance(ctx, uuid, hdcid);
            if (await hdDengShenBangModel.in_show()) {
                await hdDengShenBangModel.backData_u(["info", "red"]);
            }
        }
    }
    // //聊天信息
    // let sevChatHefu = new SevChatModel(ctx,Setting.getQufus()[sid].heid,ChannelType.hefu)
    // await sevChatHefu.clickBackData_u()
    // let sevChatAll = new SevChatModel(ctx,'0',ChannelType.all)
    // await sevChatAll.clickBackData_u()
    //初始化跑马灯
    let sevPaoMaModel = SevPaoMaModel_1.SevPaoMaModel.getInstance(ctx, heid);
    await sevPaoMaModel.backData_login(uuid);
    //清除 adoksev 记录
    let actAdokSevModel = ActAdokSevModel_1.ActAdokSevModel.getInstance(ctx, uuid);
    await actAdokSevModel.clearAll();
    await actAdokSevModel.login_set();
    //登录请求 外部没有uuid  是这边 手动刷sev 信息
    await actAdokSevModel.clickAllSev();
    //每日挑战的sev部分
    let sevPvdModel = SevPvdModel_1.SevPvdModel.getInstance(ctx, heid);
    await sevPvdModel.backData();
    if (actClub.clubId != "") {
        let sevClubModel = SevClubModel_1.SevClubModel.getInstance(ctx, actClub.clubId);
        await sevClubModel.backData();
        let sevCluMemberbModel = SevClubMemberModel_1.SevClubMemberModel.getInstance(ctx, actClub.clubId);
        await sevCluMemberbModel.backData();
        let sevClubApplyModel = SevClubApplyModel_1.SevClubApplyModel.getInstance(ctx, actClub.clubId);
        await sevClubApplyModel.backData();
        let sevClubHelpModel = SevClubHelpModel_1.SevClubHelpModel.getInstance(ctx, actClub.clubId);
        await sevClubHelpModel.backData();
        let sevChatModel = SevChatModel_1.SevChatModel.getInstance(ctx, actClub.clubId, Xys_1.ChannelType.club);
        await sevChatModel.clickBackData_ByMyid(0);
    }
    if (uuid == ctx.state.qhao) {
        let backPlat = await tool_1.tool.getOpenIdByUid(uid);
        if (backPlat != null) {
            mongodb_1.dbSev.getFlowDb().update("LoginDown", { "uuid": uuid }, {
                "uuid": uuid,
                "sid": ctx.state.sid,
                "uid": uid,
                "name": userInfo.name,
                "pid": backPlat.pid,
                "dAt": ctx.state.newTime + 30,
                "loginAt": ctx.state.newTime
            }, true);
        }
    }
    let back = await mongodb_1.dbSev.getDataDb().findOne("tb_kind11", { openid: open_id });
    if (back != null && gameMethod_1.gameMethod.isEmpty(back.time) == false && gameMethod_1.gameMethod.isEmpty(back.kind11Id) == false) {
        try {
            await ctx.state.master.kind11Success(back.kind11Id, back.kind11Id);
        }
        catch (err) {
        }
        await mongodb_1.dbSev.getDataDb().update("tb_kind11", { openid: open_id }, {
            "openid": open_id,
            "kind11Id": "",
            "time": 0
        });
    }
}
//# sourceMappingURL=player.js.map