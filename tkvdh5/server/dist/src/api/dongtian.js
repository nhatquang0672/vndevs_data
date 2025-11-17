"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tool_1 = require("../util/tool");
const ActDongTianModel_1 = require("../model/act/ActDongTianModel");
const lock_1 = __importDefault(require("../util/lock"));
const cache_1 = __importDefault(require("../util/cache"));
const ActDongTianLogModel_1 = require("../model/act/ActDongTianLogModel");
const ActDongTianFightModel_1 = require("../model/act/ActDongTianFightModel");
const gameMethod_1 = require("../../common/gameMethod");
const Xys_1 = require("../../common/Xys");
const gameCfg_1 = __importDefault(require("../../common/gameCfg"));
const ActDongTianPvdtModel_1 = require("../model/act/ActDongTianPvdtModel");
const SevDtNpcModel_1 = require("../model/sev/SevDtNpcModel");
const router = new koa_router_1.default();
exports.router = router;
router.prefix("/dongtian");
/**
 * @api {post} /dongtian/into 进入洞天
 * @apiName 进入洞天
 * @apiGroup dongtian
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all("/into", async (ctx) => {
    ctx.state.apidesc = "洞天-进入洞天";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(ctx, uuid);
    await actDongTianModel.into();
    await actDongTianModel.backData();
    //刷新榜单
    await actDongTianModel.refreRds();
});
/**
 * @api {post} /dongtian/adokCars 刷车时间到
 * @apiName 刷车时间到
 * @apiGroup dongtian
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 */
router.all("/adokCars", async (ctx) => {
    ctx.state.apidesc = "洞天-刷车时间到";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(ctx, uuid);
    await actDongTianModel.backData();
});
/**
 * @api {post} /dongtian/uplevel 升级洞天
 * @apiName 升级
 * @apiGroup dongtian
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all("/uplevel", async (ctx) => {
    ctx.state.apidesc = "洞天-升级洞天";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(ctx, uuid);
    await actDongTianModel.uplevel();
});
/**
 * @api {post} /dongtian/lache 开始拉车
 * @apiName 开始拉车
 * @apiGroup dongtian
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} fuuid 拉谁家的 自家的uuid
 * @apiParam {string} pos 车位ID
 * @apiParam {number} knum 苦工人数
 *
 */
router.all("/lache", async (ctx) => {
    ctx.state.apidesc = "洞天-开始拉车";
    const { uuid, fuuid, pos, knum } = tool_1.tool.getParams(ctx);
    let actDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(ctx, uuid);
    if (knum == 0) {
        await actDongTianModel.callback(fuuid, pos); //相当于召回
    }
    else {
        await actDongTianModel.lache(fuuid, pos, knum); //拉车
    }
    if (parseInt(fuuid) < 100000) {
        let heid = await actDongTianModel.getHeIdByUuid(uuid);
        await lock_1.default.setLock(ctx, "sevDongTian", heid);
        let sevDtNpcModel = SevDtNpcModel_1.SevDtNpcModel.getInstance(ctx, heid);
        let oneNpc = await sevDtNpcModel.getInfo(fuuid);
        let dtlv = gameCfg_1.default.dongtianNpc.getItemCtx(ctx, fuuid).dtlv;
        ctx.state.master.addBackBuf({
            "factDongTian": {
                level: dtlv,
                pifu: [],
                fuser: await actDongTianModel.get_npc_fuser(fuuid),
                dongtian: oneNpc.cars
            }
        });
        return;
    }
    //下发别人的信息
    if (fuuid != uuid) {
        await lock_1.default.setLock(ctx, "user", fuuid); //枷锁
        ctx.state.fuuid = fuuid;
        let fActDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(ctx, fuuid);
        let factDongTian = await fActDongTianModel.getInfo();
        ctx.state.fuuid = "";
        ctx.state.master.addBackBuf({
            "factDongTian": {
                level: factDongTian.level,
                pifu: factDongTian.pifu == null ? [] : factDongTian.pifu,
                fuser: await cache_1.default.getFUser(ctx, fuuid),
                dongtian: factDongTian.cars
            }
        });
    }
});
/**
 * @api {post} /dongtian/timeOut 收菜时间到
 * @apiName 收菜时间到
 * @apiGroup dongtian
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 */
router.all("/timeOut", async (ctx) => {
    ctx.state.apidesc = "洞天-收菜时间到";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(ctx, uuid);
    await actDongTianModel.robOver();
});
/**
 * @api {post} /dongtian/rstcars 刷新矿车
 * @apiName 刷新矿车
 * @apiGroup dongtian
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 */
router.all("/rstcars", async (ctx) => {
    ctx.state.apidesc = "洞天-刷新矿车";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(ctx, uuid);
    await actDongTianModel.rstcars();
});
/**
 * @api {post} /dongtian/rstcarsK11 广告花钻刷新矿车
 * @apiName 广告花钻刷新矿车
 * @apiGroup dongtian
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 */
router.all("/rstcarsK11", async (ctx) => {
    ctx.state.apidesc = "洞天-广告花钻刷新矿车";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(ctx, uuid);
    await actDongTianModel.rstcarsK11();
});
/**
 * @api {post} /dongtian/nears 查看附近洞天
 * @apiName 查看附近的洞天
 * @apiGroup dongtian
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 */
router.all("/nears", async (ctx) => {
    ctx.state.apidesc = "洞天-查看附近洞天";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(ctx, uuid);
    await actDongTianModel.getOutPut_nears();
});
/**
 * @api {post} /dongtian/enemy 查看仇人
 * @apiName 查看仇人
 * @apiGroup dongtian
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all("/enemy", async (ctx) => {
    ctx.state.apidesc = "洞天-查看仇人";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(ctx, uuid);
    await actDongTianModel.getOutPut_enemy();
});
/**
 * @api {post} /dongtian/rstnears 刷新附近洞天
 * @apiName 刷新附近洞天
 * @apiGroup dongtian
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all("/rstnears", async (ctx) => {
    ctx.state.apidesc = "洞天-刷新附近洞天";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(ctx, uuid);
    //执行刷新
    await actDongTianModel.rst_nears();
    //刷新完 下发
    await actDongTianModel.getOutPut_nears();
});
/**
 * @api {post} /dongtian/goto 前往别人家
 * @apiName 前往别人家
 * @apiGroup dongtian
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} fuuid 别人家uuid
 */
router.all("/goto", async (ctx) => {
    ctx.state.apidesc = "洞天-前往别人家";
    const { uuid, fuuid } = tool_1.tool.getParams(ctx);
    let actDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(ctx, uuid);
    if (uuid == fuuid) {
        ctx.throw("不能查看自己");
    }
    if (parseInt(fuuid) < 100000) {
        let heid = await actDongTianModel.getHeIdByUuid(uuid);
        await lock_1.default.setLock(ctx, "sevDongTian", heid);
        let sevDtNpcModel = SevDtNpcModel_1.SevDtNpcModel.getInstance(ctx, heid);
        let oneNpc = await sevDtNpcModel.getInfo(fuuid);
        let dtlv = gameCfg_1.default.dongtianNpc.getItemCtx(ctx, fuuid).dtlv;
        ctx.state.master.addBackBuf({
            "factDongTian": {
                level: dtlv,
                pifu: [],
                fuser: await actDongTianModel.get_npc_fuser(fuuid),
                dongtian: oneNpc.cars
            }
        });
        return;
    }
    await lock_1.default.setLock(ctx, "user", fuuid); //枷锁
    ctx.state.fuuid = fuuid;
    let fActDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(ctx, fuuid);
    let factDongTian = await fActDongTianModel.getInfo();
    //合服检查
    if (await fActDongTianModel.getHeIdByUuid(fuuid) != await actDongTianModel.getHeIdByUuid(uuid)) {
        ctx.throw(`跨服异常`);
    }
    ctx.state.fuuid = "";
    await actDongTianModel.backData();
    ctx.state.master.addBackBuf({
        "factDongTian": {
            level: factDongTian.level,
            pifu: factDongTian.pifu == null ? [] : factDongTian.pifu,
            fuser: await cache_1.default.getFUser(ctx, fuuid),
            dongtian: factDongTian.cars
        }
    });
    ctx.state.fuuid = "";
});
/**
 * @api {post} /dongtian/callback 召回
 * @apiName 召回
 * @apiGroup dongtian
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} fuuid 召回谁家的 自家的
 * @apiParam {string} pos 车位ID
 *
 */
router.all("/callback", async (ctx) => {
    ctx.state.apidesc = "洞天-召回";
    const { uuid, fuuid, pos } = tool_1.tool.getParams(ctx);
    let actDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(ctx, uuid);
    await actDongTianModel.callback(fuuid, pos);
    if (parseInt(fuuid) < 100000) {
        let heid = await actDongTianModel.getHeIdByUuid(uuid);
        await lock_1.default.setLock(ctx, "sevDongTian", heid);
        let sevDtNpcModel = SevDtNpcModel_1.SevDtNpcModel.getInstance(ctx, heid);
        let oneNpc = await sevDtNpcModel.getInfo(fuuid);
        let dtlv = gameCfg_1.default.dongtianNpc.getItemCtx(ctx, fuuid).dtlv;
        ctx.state.master.addBackBuf({
            "factDongTian": {
                level: dtlv,
                pifu: [],
                fuser: await actDongTianModel.get_npc_fuser(fuuid),
                dongtian: oneNpc.cars
            }
        });
        return;
    }
    //下发别人的信息
    if (fuuid != uuid) {
        await lock_1.default.setLock(ctx, "user", fuuid); //枷锁
        ctx.state.fuuid = fuuid;
        let fActDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(ctx, fuuid);
        let factDongTian = await fActDongTianModel.getInfo();
        ctx.state.fuuid = "";
        ctx.state.master.addBackBuf({
            "factDongTian": {
                level: factDongTian.level,
                pifu: factDongTian.pifu == null ? [] : factDongTian.pifu,
                fuser: await cache_1.default.getFUser(ctx, fuuid),
                dongtian: factDongTian.cars
            }
        });
    }
});
/**
 * @api {post} /dongtian/fight 打架驱赶
 * @apiName 打架驱赶
 * @apiGroup dongtian
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} fuuid 去谁家打架
 * @apiParam {string} pos 打架的车位
 */
router.all("/fight", async (ctx) => {
    ctx.state.apidesc = "洞天-打架驱赶";
    const { uuid, fuuid, pos } = tool_1.tool.getParams(ctx);
    if (uuid == fuuid) {
        ctx.throw("自家不能打");
    }
    let actDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(ctx, uuid);
    let heid = await actDongTianModel.getHeIdByUuid(uuid);
    //去NPC家
    if (parseInt(fuuid) < 100000) {
        await lock_1.default.setLock(ctx, "sevDongTian", heid);
        let sevDtNpcModel = SevDtNpcModel_1.SevDtNpcModel.getInstance(ctx, heid);
        let oneNpc = await sevDtNpcModel.getInfo(fuuid);
        //掠夺者uuid
        let fuser = oneNpc.cars[pos].he.user;
        let rot_fuuid = fuser.uuid;
        if (uuid == rot_fuuid) {
            ctx.throw("这是自己");
        }
        let actDongTianFightModel = ActDongTianFightModel_1.ActDongTianFightModel.getInstance(ctx, uuid);
        let win = await actDongTianFightModel.fight_one(rot_fuuid, oneNpc.cars[pos].id);
        //矿车日志加上
        oneNpc.cars[pos].pklog.push({
            time: ctx.state.newTime,
            win: win,
            user1: await cache_1.default.getFUser(ctx, uuid),
            user2: await cache_1.default.getFUser(ctx, rot_fuuid),
        });
        if (win == 1) { //打赢了
            //矿主矿车最新信息
            let carShow = gameMethod_1.gameMethod.getDongTianCar(oneNpc.cars[pos], ctx.state.newTime);
            oneNpc.cars[pos].dpos = carShow.nowpos;
            oneNpc.cars[pos].he.user = null;
            oneNpc.cars[pos].he.knum = 0;
            oneNpc.cars[pos].he.pow = 0;
            oneNpc.cars[pos].stime = 0;
            oneNpc.cars[pos].etime = 0;
        }
        await sevDtNpcModel.setPostInfo(fuuid, pos, oneNpc.cars[pos]);
        //操作掠夺者
        if (win == 1) {
            await lock_1.default.setLock(ctx, "user", rot_fuuid); //枷锁
            ctx.state.fuuid = rot_fuuid;
            let fr_ActDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(ctx, rot_fuuid);
            let fr_ActDongTian = await fr_ActDongTianModel.getInfo();
            delete fr_ActDongTian.rob[fuuid];
            await fr_ActDongTianModel.update(fr_ActDongTian);
            //劫匪加日志 : 被人劫道了
            let fr_fActDongTianLogModel = ActDongTianLogModel_1.ActDongTianLogModel.getInstance(ctx, rot_fuuid);
            await fr_fActDongTianLogModel.addLog(Xys_1.DongTianLogType.fight_b, oneNpc.cars[pos].id, uuid, ctx.state.newTime);
        }
        ctx.state.fuuid = "";
        //操作自己的
        if (win == 1) {
            let actDongTianLogModel = ActDongTianLogModel_1.ActDongTianLogModel.getInstance(ctx, uuid);
            await actDongTianLogModel.addLog(Xys_1.DongTianLogType.fight_a, oneNpc.cars[pos].id, rot_fuuid, ctx.state.newTime);
        }
        let dtlv = gameCfg_1.default.dongtianNpc.getItemCtx(ctx, fuuid).dtlv;
        //刷新矿主加信息给我
        ctx.state.master.addBackBuf({
            "factDongTian": {
                level: dtlv,
                pifu: [],
                fuser: await actDongTianModel.get_npc_fuser(fuuid),
                dongtian: oneNpc.cars
            }
        });
    }
    else {
        //加上主人家的锁
        await lock_1.default.setLock(ctx, "user", fuuid); //枷锁
        ctx.state.fuuid = fuuid;
        let fActDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(ctx, fuuid);
        //合服检查 //双查 //矿主和 打劫者都要查
        if (await fActDongTianModel.getHeIdByUuid(fuuid) != heid) {
            ctx.throw(`矿主跨服错误`);
        }
        let factDongTian = await fActDongTianModel.getInfo();
        if (factDongTian.cars[pos] == null || factDongTian.cars[pos].he.knum <= 0 || factDongTian.cars[pos].he.user == null) {
            ctx.state.fuuid = "";
            ctx.state.master.addWin("msg", "矿车无效");
            //刷新他人信息给我
            ctx.state.master.addBackBuf({
                "factDongTian": {
                    level: factDongTian.level,
                    pifu: factDongTian.pifu == null ? [] : factDongTian.pifu,
                    fuser: await cache_1.default.getFUser(ctx, fuuid),
                    dongtian: factDongTian.cars
                }
            });
            return;
        }
        //掠夺者uuid
        let fuser = factDongTian.cars[pos].he.user;
        let rot_fuuid = fuser.uuid;
        if (uuid == rot_fuuid) {
            ctx.throw("这是友军");
        }
        //加上抢劫者的锁
        await lock_1.default.setLock(ctx, "user", rot_fuuid); //枷锁
        //打架
        ctx.state.fuuid = "";
        let actDongTianFightModel = ActDongTianFightModel_1.ActDongTianFightModel.getInstance(ctx, uuid);
        let win = await actDongTianFightModel.fight_one(rot_fuuid, factDongTian.cars[pos].id);
        //开始操作矿主
        ctx.state.fuuid = fuuid;
        //矿车日志加上
        factDongTian.cars[pos].pklog.push({
            time: ctx.state.newTime,
            win: win,
            user1: await cache_1.default.getFUser(ctx, uuid),
            user2: await cache_1.default.getFUser(ctx, rot_fuuid),
        });
        if (win == 1) { //打赢了
            //矿主矿车最新信息
            let carShow = gameMethod_1.gameMethod.getDongTianCar(factDongTian.cars[pos], ctx.state.newTime);
            factDongTian.cars[pos].dpos = carShow.nowpos;
            factDongTian.cars[pos].he.user = null;
            factDongTian.cars[pos].he.knum = 0;
            factDongTian.cars[pos].he.pow = 0;
            factDongTian.cars[pos].stime = ctx.state.newTime;
            factDongTian.cars[pos].etime = 0;
            if (factDongTian.cars[pos].my.knum == 0) {
                factDongTian.cars[pos].stime = 0;
            }
            else {
                let carShow = gameMethod_1.gameMethod.getDongTianCar(factDongTian.cars[pos], ctx.state.newTime);
                factDongTian.cars[pos].stime = ctx.state.newTime;
                factDongTian.cars[pos].dpos = carShow.nowpos;
                factDongTian.cars[pos].etime = carShow.edtime + ctx.state.newTime;
                factDongTian.rob[fuuid][pos] = gameMethod_1.gameMethod.objCopy(factDongTian.cars[pos]);
            }
        }
        await fActDongTianModel.update(factDongTian);
        //以上矿主操作完了
        //操作掠夺者
        if (win == 1) {
            ctx.state.fuuid = rot_fuuid;
            let fr_ActDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(ctx, rot_fuuid);
            let fr_ActDongTian = await fr_ActDongTianModel.getInfo();
            delete fr_ActDongTian.rob[fuuid];
            await fr_ActDongTianModel.update(fr_ActDongTian);
            //劫匪加日志 : 被人劫道了
            let fr_fActDongTianLogModel = ActDongTianLogModel_1.ActDongTianLogModel.getInstance(ctx, rot_fuuid);
            await fr_fActDongTianLogModel.addLog(Xys_1.DongTianLogType.fight_b, factDongTian.cars[pos].id, uuid, ctx.state.newTime);
        }
        //操作自己
        ctx.state.fuuid = "";
        if (win == 1) {
            let actDongTianLogModel = ActDongTianLogModel_1.ActDongTianLogModel.getInstance(ctx, uuid);
            await actDongTianLogModel.addLog(Xys_1.DongTianLogType.fight_a, factDongTian.cars[pos].id, rot_fuuid, ctx.state.newTime);
        }
        //刷新矿主加信息给我
        ctx.state.master.addBackBuf({
            "factDongTian": {
                level: factDongTian.level,
                pifu: factDongTian.pifu == null ? [] : factDongTian.pifu,
                fuser: await cache_1.default.getFUser(ctx, fuuid),
                dongtian: factDongTian.cars
            }
        });
    }
});
/**
 * @api {post} /dongtian/intoGift 进入洞天礼包
 * @apiName 进入洞天礼包
 * @apiGroup dongtian
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all("/intoGift", async (ctx) => {
    ctx.state.apidesc = "洞天-进入洞天礼包";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(ctx, uuid);
    await actDongTianModel.hdChuFaMd();
});
/**
 * @api {post} /dongtian/xlUplv 洞天训练升级
 * @apiName 洞天训练升级
 * @apiGroup dongtian
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} type  1马场2木桩3靶场4铁匠铺
 *
 */
router.all("/xlUplv", async (ctx) => {
    ctx.state.apidesc = "洞天-洞天训练升级";
    const { uuid, type } = tool_1.tool.getParams(ctx);
    let actDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(ctx, uuid);
    await actDongTianModel.xlUplv(type);
});
/**
 * @api {post} /dongtian/xlUpStep 洞天训练升阶
 * @apiName 洞天训练升阶
 * @apiGroup dongtian
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all("/xlUpStep", async (ctx) => {
    ctx.state.apidesc = "洞天-洞天训练升阶";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(ctx, uuid);
    await actDongTianModel.xlUpStep();
});
/**
 * @api {post} /dongtian/delPfRed 消除皮肤红点
 * @apiName 消除皮肤红点
 * @apiGroup dongtian
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} pfid 皮肤ID
 *
 */
router.all("/delPfRed", async (ctx) => {
    ctx.state.apidesc = "洞天-消除皮肤红点";
    const { uuid, pfid } = tool_1.tool.getParams(ctx);
    let actDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(ctx, uuid);
    await actDongTianModel.delPfRed(pfid);
});
/**
 * @api {post} /dongtian/setPf 设置道童皮肤
 * @apiName 设置道童皮肤
 * @apiGroup dongtian
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} pfid 皮肤ID
 *
 */
router.all("/setPf", async (ctx) => {
    ctx.state.apidesc = "洞天-设置道童皮肤";
    const { uuid, pfid } = tool_1.tool.getParams(ctx);
    let actDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(ctx, uuid);
    await actDongTianModel.setPf(pfid);
});
/**
 * @api {post} /dongtian/pvdt 打道童关卡
 * @apiName 打道童关卡
 * @apiGroup dongtian
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all("/pvdt", async (ctx) => {
    ctx.state.apidesc = "洞天-打道童关卡";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actDongTianPvdtModel = ActDongTianPvdtModel_1.ActDongTianPvdtModel.getInstance(ctx, uuid);
    await actDongTianPvdtModel.fight_one();
});
/**
 * @api {post} /dongtian/dtUpLevel 道童升级
 * @apiName 道童升级
 * @apiGroup dongtian
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all("/dtUpLevel", async (ctx) => {
    ctx.state.apidesc = "洞天-道童升级";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(ctx, uuid);
    await actDongTianModel.dtUpLevel();
});
//# sourceMappingURL=dongtian.js.map