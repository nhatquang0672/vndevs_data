"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tool_1 = require("../util/tool");
const ActLonggongModel_1 = require("../model/act/ActLonggongModel");
const SevClubMemberModel_1 = require("../model/sev/SevClubMemberModel");
const ActClubModel_1 = require("../model/act/ActClubModel");
const SevLonggongModel_1 = require("../model/sev/SevLonggongModel");
const ActAdokSevModel_1 = require("../model/act/ActAdokSevModel");
const lock_1 = __importDefault(require("../util/lock"));
const UserModel_1 = require("../model/user/UserModel");
const game_1 = __importDefault(require("../util/game"));
const fight_1 = require("../../common/fight");
const gameMethod_1 = require("../../common/gameMethod");
const ActRedDailyModel_1 = require("../model/act/ActRedDailyModel");
const ActLonggongLogModel_1 = require("../model/act/ActLonggongLogModel");
const cache_1 = __importDefault(require("../util/cache"));
const router = new koa_router_1.default();
exports.router = router;
router.prefix('/longgong');
/**
 * @api {post} /longgong/into 进入龙宫
 * @apiName 进入龙宫
 * @apiGroup longgong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all('/into', async (ctx) => {
    ctx.state.apidesc = "龙宫运宝-进入龙宫";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actLonggongModel = ActLonggongModel_1.ActLonggongModel.getInstance(ctx, uuid);
    await actLonggongModel.clickYun();
    await actLonggongModel.adokYun();
    await actLonggongModel.backData();
    await actLonggongModel.backData_Run_a();
    let heid = await actLonggongModel.getHeIdByUuid(uuid);
    await lock_1.default.setLock(ctx, "sevLonggong", heid);
    let sevLonggongModel = SevLonggongModel_1.SevLonggongModel.getInstance(ctx, heid);
    await sevLonggongModel.clearYunOver();
    await sevLonggongModel.backData();
    let actAdokSevModel = ActAdokSevModel_1.ActAdokSevModel.getInstance(ctx, uuid);
    await actAdokSevModel.setPos(2);
});
/**
 * @api {post} /longgong/zhaohuan 召唤
 * @apiName 召唤
 * @apiGroup longgong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all('/zhaohuan', async (ctx) => {
    ctx.state.apidesc = "龙宫运宝-召唤";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actLonggongModel = ActLonggongModel_1.ActLonggongModel.getInstance(ctx, uuid);
    await actLonggongModel.zhaohuan();
});
/**
 * @api {post} /longgong/shuaxin 重新召唤
 * @apiName 重新召唤
 * @apiGroup longgong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all('/shuaxin', async (ctx) => {
    ctx.state.apidesc = "龙宫运宝-重新召唤";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actLonggongModel = ActLonggongModel_1.ActLonggongModel.getInstance(ctx, uuid);
    await actLonggongModel.shuaxin();
});
/**
 * @api {post} /longgong/getMems 获取公会成员
 * @apiName 获取公会成员
 * @apiGroup longgong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all('/getMems', async (ctx) => {
    ctx.state.apidesc = "龙宫运宝-获取公会成员";
    const { uuid } = tool_1.tool.getParams(ctx);
    //获取玩家仙盟ID
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    let clubId = await actClubModel.clickClub(true);
    let sevClubMemberModel = SevClubMemberModel_1.SevClubMemberModel.getInstance(ctx, clubId);
    await sevClubMemberModel.backData();
});
/**
 * @api {post} /longgong/yaoqing 邀请
 * @apiName 邀请
 * @apiGroup longgong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} fuuid 邀请角色ID
 *
 */
router.all('/yaoqing', async (ctx) => {
    ctx.state.apidesc = "龙宫运宝-邀请";
    const { uuid, fuuid } = tool_1.tool.getParams(ctx);
    let actLonggongModel = ActLonggongModel_1.ActLonggongModel.getInstance(ctx, uuid);
    await actLonggongModel.yaoqing(fuuid);
});
/**
 * @api {post} /longgong/yunbao 开始运宝
 * @apiName 开始运宝
 * @apiGroup longgong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all('/yunbao', async (ctx) => {
    ctx.state.apidesc = "龙宫运宝-开始运宝";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actLonggongModel = ActLonggongModel_1.ActLonggongModel.getInstance(ctx, uuid);
    await actLonggongModel.yunbao();
    await actLonggongModel.backData_Run_u([uuid]);
});
/**
 * @api {post} /longgong/shangxiang 上香
 * @apiName 上香
 * @apiGroup longgong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} xlsid 配置表id
 *
 */
router.all('/shangxiang', async (ctx) => {
    ctx.state.apidesc = "龙宫运宝-上香";
    const { uuid, xlsid } = tool_1.tool.getParams(ctx);
    let actLonggongModel = ActLonggongModel_1.ActLonggongModel.getInstance(ctx, uuid);
    await actLonggongModel.shangxiang(xlsid);
});
/**
 * @api {post} /longgong/xiansheng 手动显圣
 * @apiName 手动显圣
 * @apiGroup longgong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all('/xiansheng', async (ctx) => {
    ctx.state.apidesc = "龙宫运宝-手动显圣";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actLonggongModel = ActLonggongModel_1.ActLonggongModel.getInstance(ctx, uuid);
    await actLonggongModel.xiansheng();
});
/**
 * @api {post} /longgong/get5 下拉获取5个跑图玩家
 * @apiName 下拉获取5个跑图玩家
 * @apiGroup longgong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all('/get5', async (ctx) => {
    ctx.state.apidesc = "龙宫运宝-下拉获取5个跑图玩家";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actLonggongModel = ActLonggongModel_1.ActLonggongModel.getInstance(ctx, uuid);
    await actLonggongModel.get5();
});
/**
 * @api {post} /longgong/buyKind11 花钻石跳过广告
 * @apiName 花钻石跳过广告
 * @apiGroup longgong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all('/buyKind11', async (ctx) => {
    ctx.state.apidesc = "龙宫运宝-花钻石跳过广告";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actLonggongModel = ActLonggongModel_1.ActLonggongModel.getInstance(ctx, uuid);
    await actLonggongModel.buyKind11();
});
/**
 * @api {post} /longgong/fight 掠夺战
 * @apiName 掠夺战
 * @apiGroup longgong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} fuuid 角色fuuid
 *
 */
router.all('/fight', async (ctx) => {
    ctx.state.apidesc = "龙宫运宝-掠夺战";
    const { uuid, fuuid } = tool_1.tool.getParams(ctx);
    if (fuuid == uuid) {
        ctx.throw("不能对自己下手");
    }
    let count = tool_1.tool.mathcfg_count(ctx, "longgong_lengqie");
    let actLonggongModel = ActLonggongModel_1.ActLonggongModel.getInstance(ctx, uuid);
    let heid = await actLonggongModel.getHeIdByUuid(uuid);
    await lock_1.default.setLock(ctx, "sevLonggong", heid);
    let sevLonggongModel = SevLonggongModel_1.SevLonggongModel.getInstance(ctx, heid);
    let sevLonggong = await sevLonggongModel.getInfo();
    if (sevLonggong.list[fuuid] == null || sevLonggong.list[fuuid].ybEat <= ctx.state.newTime) {
        await actLonggongModel.backData_Run_u([fuuid]);
        ctx.state.master.addWin("msg", "对方已运宝结束");
        return;
    }
    let count1 = tool_1.tool.mathcfg_count1(ctx, "longgong_duoqu");
    if (sevLonggong.list[fuuid].beida >= count1) {
        await actLonggongModel.backData_Run_u([fuuid]);
        ctx.state.master.addWin("msg", "该玩家已被掠夺2次，给他留点吧");
        return;
    }
    let actLonggong = await actLonggongModel.getInfo();
    count1 = tool_1.tool.mathcfg_count1(ctx, "longgong_lengqie");
    if (actLonggong.duo < count1) {
        if (actLonggong.duoAt + count > ctx.state.newTime) {
            ctx.throw("掠夺冷却中");
        }
        actLonggong.duo += 1;
        actLonggong.duoAt = ctx.state.newTime;
        await actLonggongModel.update(actLonggong);
    }
    else {
        await ctx.state.master.subItem1([1, 75, 1]);
    }
    let pkfuuid = fuuid;
    if (sevLonggong.list[fuuid].ybFuuid != "") { //如果有护卫，需要打护卫
        pkfuuid = sevLonggong.list[fuuid].ybFuuid;
    }
    if (pkfuuid == uuid) {
        ctx.throw("你正在护卫该宝主，无法掠夺");
    }
    let userModel = UserModel_1.UserModel.getInstance(ctx, uuid);
    let gStart = await userModel.getFightEps();
    let fuserModel = UserModel_1.UserModel.getInstance(ctx, pkfuuid);
    let fgStart = await fuserModel.getFightEps();
    let fightinfo = {
        fuserAll: await cache_1.default.getFUser(ctx, pkfuuid),
        start: {
            from: "longgong",
            seed: game_1.default.rand(1, 65535),
            teams: {
                "10": {
                    fid: uuid,
                    zhanwei: 0,
                    eps: gStart.eps,
                    level: 0,
                    wxSk: gStart.wxSk,
                    isnq: gStart.isnq,
                    jgSk: gStart.jgSk //精怪技能
                },
                "20": {
                    fid: pkfuuid,
                    zhanwei: 0,
                    eps: fgStart.eps,
                    level: 0,
                    wxSk: fgStart.wxSk,
                    isnq: fgStart.isnq,
                    jgSk: fgStart.jgSk //精怪技能
                }
            }
        },
        end: {
            win: 2,
            items: [] //获得奖励
        }
    };
    if (gStart.xlid != "") {
        fightinfo.start.teams["11"] = {
            fid: "xl_" + gStart.xlid,
            zhanwei: gStart.xlzw,
            eps: gStart.xleps,
            level: gStart.xlLv,
            wxSk: {},
            isnq: 0,
            jgSk: {} //精怪技能
        };
    }
    if (fgStart.xlid != "") {
        fightinfo.start.teams["21"] = {
            fid: "xlf_" + fgStart.xlid,
            zhanwei: fgStart.xlzw,
            eps: fgStart.xleps,
            level: fgStart.xlLv,
            wxSk: {},
            isnq: 0,
            jgSk: {} //精怪技能
        };
    }
    //战斗
    let fight = new fight_1.Fight(fightinfo.start);
    let back = fight.get_outf();
    fightinfo.end.win = back.win;
    //记录战斗日志
    tool_1.tool.addFightTeam(ctx, fightinfo.start);
    if (back.win == 1) { //掠夺成功
        sevLonggong.list[fuuid].beida += 1;
        await sevLonggongModel.update(sevLonggong, [""]);
        await actLonggongModel.backData_Run_u([fuuid]);
        await lock_1.default.setLock(ctx, "user", fuuid);
        ctx.state.fuuid = fuuid;
        let factLonggongModel = ActLonggongModel_1.ActLonggongModel.getInstance(ctx, fuuid);
        let factLonggong = await factLonggongModel.getInfo();
        factLonggong.yun = sevLonggong.list[fuuid];
        await factLonggongModel.update(factLonggong);
        let factLonggongLogModel = ActLonggongLogModel_1.ActLonggongLogModel.getInstance(ctx, fuuid);
        await factLonggongLogModel.addList(uuid, factLonggong.yun.jiaofu, 1, 2);
        ctx.state.fuuid = "";
        //结算奖励
        fightinfo.end.items = gameMethod_1.gameMethod.longgong_yubao(factLonggong.yun, 2);
        if (fightinfo.end.items.length > 0) {
            await ctx.state.master.addItem2(fightinfo.end.items, "");
        }
    }
    else {
        //记录战斗失败次数
        let actRedDailyModel = ActRedDailyModel_1.ActRedDailyModel.getInstance(ctx, fuuid);
        await actRedDailyModel.battleFailed();
        await lock_1.default.setLock(ctx, "user", fuuid);
        ctx.state.fuuid = fuuid;
        let factLonggongModel = ActLonggongModel_1.ActLonggongModel.getInstance(ctx, fuuid);
        let factLonggong = await factLonggongModel.getInfo();
        let factLonggongLogModel = ActLonggongLogModel_1.ActLonggongLogModel.getInstance(ctx, fuuid);
        await factLonggongLogModel.addList(uuid, factLonggong.yun.jiaofu, 0, 1);
        ctx.state.fuuid = "";
    }
    //下发战斗信息
    ctx.state.master.addBackBuf({ "actLonggongFight": fightinfo });
});
/**
 * @api {post} /longgong/logInfo 日志输出
 * @apiName 日志掠夺战
 * @apiGroup longgong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all('/logInfo', async (ctx) => {
    ctx.state.apidesc = "龙宫运宝-日志输出";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actLonggongLogModel = ActLonggongLogModel_1.ActLonggongLogModel.getInstance(ctx, uuid);
    await actLonggongLogModel.backData();
});
/**
 * @api {post} /longgong/logfight 日志掠夺战
 * @apiName 日志掠夺战
 * @apiGroup longgong
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} iid 日志序号ID
 *
 */
router.all('/logfight', async (ctx) => {
    ctx.state.apidesc = "龙宫运宝-日志掠夺战";
    const { uuid, iid } = tool_1.tool.getParams(ctx);
    let actLonggongLogModel = ActLonggongLogModel_1.ActLonggongLogModel.getInstance(ctx, uuid);
    let actLonggongLog = await actLonggongLogModel.getInfo();
    if (actLonggongLog.list[iid] == null) {
        ctx.state.master.addWin("msg", "该日志不存在");
        await actLonggongLogModel.backData();
        return;
    }
    let fuuid = actLonggongLog.list[iid].fuser.uuid;
    if (fuuid == uuid) {
        ctx.throw("不能对自己下手");
    }
    let count = tool_1.tool.mathcfg_count(ctx, "longgong_lengqie");
    let actLonggongModel = ActLonggongModel_1.ActLonggongModel.getInstance(ctx, uuid);
    let heid = await actLonggongModel.getHeIdByUuid(uuid);
    await lock_1.default.setLock(ctx, "sevLonggong", heid);
    let sevLonggongModel = SevLonggongModel_1.SevLonggongModel.getInstance(ctx, heid);
    let sevLonggong = await sevLonggongModel.getInfo();
    if (sevLonggong.list[fuuid] == null || sevLonggong.list[fuuid].ybEat <= ctx.state.newTime) {
        await actLonggongModel.backData_Run_u([fuuid]);
        ctx.state.master.addWin("msg", "对方已运宝结束");
        return;
    }
    let count1 = tool_1.tool.mathcfg_count1(ctx, "longgong_duoqu");
    if (sevLonggong.list[fuuid].beida >= count1) {
        await actLonggongModel.backData_Run_u([fuuid]);
        ctx.state.master.addWin("msg", "该玩家已被掠夺2次，给他留点吧");
        return;
    }
    let actLonggong = await actLonggongModel.getInfo();
    count1 = tool_1.tool.mathcfg_count1(ctx, "longgong_lengqie");
    if (actLonggong.duo < count1) {
        if (actLonggong.duoAt + count > ctx.state.newTime) {
            ctx.throw("掠夺冷却中");
        }
        actLonggong.duo += 1;
        actLonggong.duoAt = ctx.state.newTime;
        await actLonggongModel.update(actLonggong);
    }
    else {
        await ctx.state.master.subItem1([1, 75, 1]);
    }
    let userModel = UserModel_1.UserModel.getInstance(ctx, uuid);
    let gStart = await userModel.getFightEps();
    let pkfuuid = fuuid;
    if (sevLonggong.list[fuuid].ybFuuid != "") { //如果有护卫，需要打护卫
        pkfuuid = sevLonggong.list[fuuid].ybFuuid;
    }
    let fuserModel = UserModel_1.UserModel.getInstance(ctx, pkfuuid);
    let fgStart = await fuserModel.getFightEps();
    let fightinfo = {
        fuserAll: await cache_1.default.getFUser(ctx, pkfuuid),
        start: {
            from: "longgong",
            seed: game_1.default.rand(1, 65535),
            teams: {
                "10": {
                    fid: uuid,
                    zhanwei: 0,
                    eps: gStart.eps,
                    level: 0,
                    wxSk: gStart.wxSk,
                    isnq: gStart.isnq,
                    jgSk: gStart.jgSk //精怪技能
                },
                "20": {
                    fid: pkfuuid,
                    zhanwei: 0,
                    eps: fgStart.eps,
                    level: 0,
                    wxSk: fgStart.wxSk,
                    isnq: fgStart.isnq,
                    jgSk: fgStart.jgSk //精怪技能
                },
            }
        },
        end: {
            win: 2,
            items: [] //获得奖励
        }
    };
    if (gStart.xlid != "") {
        fightinfo.start.teams["11"] = {
            fid: "xl_" + gStart.xlid,
            zhanwei: gStart.xlzw,
            eps: gStart.xleps,
            level: gStart.xlLv,
            wxSk: {},
            isnq: 0,
            jgSk: {} //精怪技能
        };
    }
    if (fgStart.xlid != "") {
        fightinfo.start.teams["21"] = {
            fid: "xlf_" + fgStart.xlid,
            zhanwei: fgStart.xlzw,
            eps: fgStart.xleps,
            level: fgStart.xlLv,
            wxSk: {},
            isnq: 0,
            jgSk: {} //精怪技能
        };
    }
    //战斗
    let fight = new fight_1.Fight(fightinfo.start);
    let back = fight.get_outf();
    fightinfo.end.win = back.win;
    //记录战斗日志
    tool_1.tool.addFightTeam(ctx, fightinfo.start);
    if (back.win == 1) { //掠夺成功
        sevLonggong.list[fuuid].beida += 1;
        await sevLonggongModel.update(sevLonggong, [""]);
        await actLonggongModel.backData_Run_u([fuuid]);
        await lock_1.default.setLock(ctx, "user", fuuid);
        ctx.state.fuuid = fuuid;
        let factLonggongModel = ActLonggongModel_1.ActLonggongModel.getInstance(ctx, fuuid);
        let factLonggong = await factLonggongModel.getInfo();
        factLonggong.yun = sevLonggong.list[fuuid];
        await factLonggongModel.update(factLonggong);
        let factLonggongLogModel = ActLonggongLogModel_1.ActLonggongLogModel.getInstance(ctx, fuuid);
        factLonggongLogModel.addList(uuid, factLonggong.yun.jiaofu, 1, 2);
        ctx.state.fuuid = "";
        //结算奖励
        fightinfo.end.items = gameMethod_1.gameMethod.longgong_yubao(factLonggong.yun, 2);
        if (fightinfo.end.items.length > 0) {
            await ctx.state.master.addItem2(fightinfo.end.items, "");
        }
    }
    else {
        //记录战斗失败次数
        let actRedDailyModel = ActRedDailyModel_1.ActRedDailyModel.getInstance(ctx, fuuid);
        await actRedDailyModel.battleFailed();
        await lock_1.default.setLock(ctx, "user", fuuid);
        ctx.state.fuuid = fuuid;
        let factLonggongModel = ActLonggongModel_1.ActLonggongModel.getInstance(ctx, fuuid);
        let factLonggong = await factLonggongModel.getInfo();
        let factLonggongLogModel = ActLonggongLogModel_1.ActLonggongLogModel.getInstance(ctx, fuuid);
        factLonggongLogModel.addList(uuid, factLonggong.yun.jiaofu, 0, 1);
        ctx.state.fuuid = "";
    }
    actLonggongLog.list[iid].status = 3;
    await actLonggongLogModel.update(actLonggongLog, [iid]);
    //下发战斗信息
    ctx.state.master.addBackBuf({ "actLonggongFight": fightinfo });
});
//# sourceMappingURL=longgong.js.map