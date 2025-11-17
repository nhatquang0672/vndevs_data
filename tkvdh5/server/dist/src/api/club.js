"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tool_1 = require("../util/tool");
const UserModel_1 = require("../model/user/UserModel");
const SevClubModel_1 = require("../model/sev/SevClubModel");
const mongodb_1 = require("../util/mongodb");
const gameCfg_1 = __importDefault(require("../../common/gameCfg"));
const ActClubModel_1 = require("../model/act/ActClubModel");
const gameMethod_1 = require("../../common/gameMethod");
const SevClubMemberModel_1 = require("../model/sev/SevClubMemberModel");
const SevClubApplyModel_1 = require("../model/sev/SevClubApplyModel");
const SevClubHelpModel_1 = require("../model/sev/SevClubHelpModel");
const SevClubBossModel_1 = require("../model/sev/SevClubBossModel");
const lock_1 = __importDefault(require("../util/lock"));
const nameCheck_1 = require("../util/nameCheck");
const setting_1 = __importDefault(require("../crontab/setting"));
const game_1 = __importDefault(require("../util/game"));
const ActRwdOptModel_1 = require("../model/act/ActRwdOptModel");
const ActDingYueModel_1 = require("../model/act/ActDingYueModel");
const ActAdokSevModel_1 = require("../model/act/ActAdokSevModel");
const SevClubFxModel_1 = require("../model/sev/SevClubFxModel");
const ActClubMjModel_1 = require("../model/act/ActClubMjModel");
const router = new koa_router_1.default();
exports.router = router;
router.prefix("/club");
/**
 * @api {post} /club/refList 刷新仙盟列表
 * @apiName 刷新仙盟列表
 * @apiGroup club
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} isfull 是否过滤已满0不过滤1过滤
 */
router.all("/refList", async (ctx) => {
    ctx.state.apidesc = "仙盟-刷新仙盟列表";
    const { uuid, isfull } = tool_1.tool.getParams(ctx);
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    let actClub = await actClubModel.getInfo();
    if (actClub.clubId != "") {
        ctx.throw("已加入仙盟");
    }
    let clubs = await mongodb_1.dbSev.getDataDb().find("sev", { "kid": "club" });
    clubs = game_1.default.shuffle(clubs);
    let club_maxMember = tool_1.tool.mathcfg_count(ctx, "club_maxMember");
    let outf = [];
    for (const club of clubs) {
        if (outf.length >= 5) {
            break;
        }
        if (club.data.createTime <= 0) {
            continue; //创建失败
        }
        if (club.data.cash_memberCount <= 0) {
            continue; //无人
        }
        let heid = setting_1.default.getHeid(club.data.sid);
        if (await actClubModel.getHeIdByUuid(uuid) != heid) {
            continue; //不是同一个服务器
        }
        if (isfull == 1) {
            let sevClubMemberModel = SevClubMemberModel_1.SevClubMemberModel.getInstance(ctx, club.id);
            let sevClubMember = await sevClubMemberModel.getInfo();
            if (sevClubMember.count >= club_maxMember) {
                continue; //人数满了
            }
        }
        outf.push({
            clubid: club.id,
            //仙盟基础数据
            uuid: club.data.uuid,
            sid: club.data.sid,
            name: club.data.name,
            notice: club.data.notice,
            applyLevelNeed: club.data.applyLevelNeed,
            applyAuto: club.data.applyAuto,
            canselect: club.data.canselect,
            createTime: club.data.createTime,
            rstMstTime: club.data.rstMstTime,
            // 0 点时间戳 //下次需要重算的时间 //前端倒计时刷新时间
            outTime: club.data.outTime,
            cash_memberCount: club.data.cash_memberCount,
            cash_active: club.data.cash_active,
            boss: club.data.boss,
        });
    }
    ctx.state.master.addBackBuf({
        fclubs: outf
    });
});
/**
 * @api {post} /club/showClub 进盟下发信息
 * @apiName 进盟下发信息
 * @apiGroup club
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 */
router.all("/showClub", async (ctx) => {
    ctx.state.apidesc = "仙盟-进盟下发信息";
    const { uuid } = tool_1.tool.getParams(ctx);
    //获取玩家仙盟ID
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    await actClubModel.backData();
    let clubId = await actClubModel.clickClub(true);
    //仙盟锁
    await lock_1.default.setLock(ctx, "club", clubId);
    //刷仙盟信息 (包含BOSS信息)
    let sevClubModel = SevClubModel_1.SevClubModel.getInstance(ctx, clubId);
    await sevClubModel.backData();
    //刷成员信息
    let sevClubMemberModel = SevClubMemberModel_1.SevClubMemberModel.getInstance(ctx, clubId);
    await sevClubMemberModel.backData();
    //刷互助信息
    let sevClubHelpModel = SevClubHelpModel_1.SevClubHelpModel.getInstance(ctx, clubId);
    await sevClubHelpModel.backData();
    //福星
    let sevClubFxModel = SevClubFxModel_1.SevClubFxModel.getInstance(ctx, clubId);
    await sevClubFxModel.backData();
    //福星 秘笈
    let actClubMjModel = ActClubMjModel_1.ActClubMjModel.getInstance(ctx, uuid);
    await actClubMjModel.backData();
    //如果我是会长
    if (await sevClubModel.isMaster(uuid, true)) {
        //刷申请表
        let sevClubApplyModel = SevClubApplyModel_1.SevClubApplyModel.getInstance(ctx, clubId);
        await sevClubApplyModel.backData();
    }
    //设置玩家在仙盟里面
    let actAdokSevModel = ActAdokSevModel_1.ActAdokSevModel.getInstance(ctx, uuid);
    await actAdokSevModel.setPos(1);
});
/**
 * @api {post} /club/fuzzyFind 模糊查询
 * @apiName 模糊查询
 * @apiGroup club
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} sstr 搜索关键字
 */
router.all("/fuzzyFind", async (ctx) => {
    ctx.state.apidesc = "仙盟-模糊查询";
    const { uuid, sstr } = tool_1.tool.getParams(ctx);
    //先按照 仙盟ID 搜索
    //数据库先找 找到了再new 避免new 出一个新的
    let db = mongodb_1.dbSev.getDataDb();
    let query = {
        kid: "club",
        hdcid: "1",
        id: sstr,
    };
    let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
    let result = await db.findOne("sev", query, {}); //本区 活跃仙盟 //排行榜上找?
    if (gameMethod_1.gameMethod.isEmpty(result) != true) {
        //仙盟锁
        await lock_1.default.setLock(ctx, "club", sstr);
        let fbyid_sevClubModel = SevClubModel_1.SevClubModel.getInstance(ctx, sstr);
        let fbid_info = await fbyid_sevClubModel.getInfo();
        if (setting_1.default.getQufus()[fbid_info.sid].heid == heid) {
            if (fbid_info.createTime > 0) {
                //仙盟有效
                //发送一个仙盟信息
                let outf = {
                    fclubs: [{
                            clubid: sstr,
                            //仙盟基础数据
                            uuid: fbid_info.uuid,
                            sid: fbid_info.sid,
                            name: fbid_info.name,
                            notice: fbid_info.notice,
                            applyLevelNeed: fbid_info.applyLevelNeed,
                            applyAuto: fbid_info.applyAuto,
                            canselect: fbid_info.canselect,
                            createTime: fbid_info.createTime,
                            rstMstTime: fbid_info.rstMstTime,
                            // 0 点时间戳 //下次需要重算的时间 //前端倒计时刷新时间
                            outTime: fbid_info.outTime,
                            cash_memberCount: fbid_info.cash_memberCount,
                            cash_active: fbid_info.cash_active,
                            boss: fbid_info.boss,
                        }],
                };
                ctx.state.master.addBackBuf(outf);
                return;
            }
        }
    }
    //进行模糊查找
    let fuzzyFindId = await nameCheck_1.clubNameCheck.fuzzyFind(heid, sstr);
    if (gameMethod_1.gameMethod.isEmpty(fuzzyFindId)) {
        ctx.throw("找不到仙盟信息");
    }
    let fuzzyList = [];
    for (const key in fuzzyFindId) {
        //仙盟锁
        await lock_1.default.setLock(ctx, "club", fuzzyFindId[key]);
        let sevClubModel = SevClubModel_1.SevClubModel.getInstance(ctx, fuzzyFindId[key]);
        let sevClub = await sevClubModel.getInfo();
        if (sevClub.createTime > 0 && sevClub.canselect == 1) {
            //如果不允许被查看 就不展示
            fuzzyList.push({
                clubid: fuzzyFindId[key],
                //仙盟基础数据
                uuid: sevClub.uuid,
                sid: sevClub.sid,
                name: sevClub.name,
                notice: sevClub.notice,
                applyLevelNeed: sevClub.applyLevelNeed,
                applyAuto: sevClub.applyAuto,
                canselect: sevClub.canselect,
                createTime: sevClub.createTime,
                rstMstTime: sevClub.rstMstTime,
                // 0 点时间戳 //下次需要重算的时间 //前端倒计时刷新时间
                outTime: sevClub.outTime,
                cash_memberCount: sevClub.cash_memberCount,
                cash_active: sevClub.cash_active,
                boss: sevClub.boss,
            });
        }
    }
    if (gameMethod_1.gameMethod.isEmpty(fuzzyList)) {
        ctx.throw("找不到仙盟信息");
    }
    //发送仙盟搜索表
    let outf = {
        fclubs: fuzzyList,
    };
    ctx.state.master.addBackBuf(outf);
});
/**
 * @api {post} /club/autoJoin 随机加入
 * @apiName 随机加入
 * @apiGroup club
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 */
router.all("/autoJoin", async (ctx) => {
    ctx.state.apidesc = "仙盟-随机加入";
    const { uuid } = tool_1.tool.getParams(ctx);
    //退出仙盟下次进入冷却(小时)
    let cfgMath = gameCfg_1.default.mathInfo.getItemCtx(ctx, "club_outInCd");
    if (cfgMath.pram.count == null) {
        ctx.throw("配置错误 club_outInCd");
        return;
    }
    //检查玩家是不是没有仙盟
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    await actClubModel.clickClub(false);
    //退会冷却时间
    let clubInfo = await actClubModel.getInfo();
    if (clubInfo.outClubTime + cfgMath.pram.count * 3600 > ctx.state.newTime) {
        ctx.throw(`退出仙盟后${cfgMath.pram.count}小时后才能再次入会`);
    }
    //申请条件 等级限制
    let userModel = UserModel_1.UserModel.getInstance(ctx, uuid);
    let userInfo = await userModel.getInfo();
    //人数上限配置
    let club_maxMember = tool_1.tool.mathcfg_count(ctx, "club_maxMember");
    //找出本合服的所有子服ID
    let heSids = setting_1.default.getHeSids(ctx.state.sid);
    let db = mongodb_1.dbSev.getDataDb();
    let query = {
        kid: "club",
        hdcid: "1",
        "data.sid": { $in: heSids },
        "data.applyAuto": { $gte: 1 },
        "data.canselect": { $gte: 1 },
        "data.cash_memberCount": { $lte: club_maxMember },
        "data.applyLevelNeed": { $lte: userInfo.level },
    };
    let result = await db.findLimit("sev", query, {}, 100); //本区 活跃仙盟 //排行榜上找?
    if (gameMethod_1.gameMethod.isEmpty(result)) {
        ctx.throw("没有符合条件的仙盟");
    }
    //过滤出 本服仙盟
    //对仙盟随机排列
    result = game_1.default.shuffle(result);
    for (let i = 0; i < result.length; i++) {
        let clubId = result[i].id;
        //尝试加入
        //仙盟锁
        await lock_1.default.setLock(ctx, "club", clubId);
        //这里只检查 仙盟人数上限
        //尝试加入仙盟
        try {
            await actClubModel.joinClub(clubId);
            //设置玩家在仙盟里面
            let actAdokSevModel = ActAdokSevModel_1.ActAdokSevModel.getInstance(ctx, uuid);
            await actAdokSevModel.setPos(1);
            return;
        }
        catch (error) {
            //加入失败 尝试下一个仙盟
            console.error("加入失败 尝试下一个仙盟");
            continue;
        }
    }
    ctx.throw("自动加入失败" + result.length);
});
/**
 * @api {post} /club/create 创建仙盟
 * @apiName 创建仙盟
 * @apiGroup club
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} name 仙盟名
 */
router.all("/create", async (ctx) => {
    ctx.state.apidesc = "仙盟-创建仙盟";
    const { uuid, name } = tool_1.tool.getParams(ctx);
    //获取玩家仙盟ID
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    await actClubModel.clickClub(false);
    //创建仙盟货币需求
    let cfgMath = gameCfg_1.default.mathInfo.getItemCtx(ctx, "club_createNeed");
    if (cfgMath.pram.item == null) {
        ctx.throw("配置错误 club_createNeed");
        return;
    }
    //扣钱
    await ctx.state.master.subItem1(cfgMath.pram.item);
    //名字长度合法
    let cfgMath2 = gameCfg_1.default.mathInfo.getItemCtx(ctx, "club_nameLong");
    if (cfgMath2.pram.count == null || cfgMath2.pram.count1 == null) {
        ctx.throw("配置错误 club_nameLong");
        return;
    }
    let strlen = gameMethod_1.gameMethod.getStrCharacterLength(name);
    if (strlen < cfgMath2.pram.count || strlen > cfgMath2.pram.count1) {
        ctx.throw(`名字长度${cfgMath2.pram.count}-${cfgMath2.pram.count1}个字符`);
    }
    //获取一个仙盟自增ID
    let clubId = await mongodb_1.dbSev.getDataDb().getNextId("CLUBID");
    //仙盟锁
    await lock_1.default.setLock(ctx, "club", clubId);
    //重名检查 名字唯一性
    if ((await nameCheck_1.clubNameCheck.setName(await actClubModel.getHeIdByUuid(uuid), clubId, name)) != true) {
        ctx.throw(`名字已被占用`);
    }
    //创建仙盟
    let sevClubModel = SevClubModel_1.SevClubModel.getInstance(ctx, clubId);
    await sevClubModel.create(uuid, name, ctx.state.sid);
    //加入仙盟
    await actClubModel.joinClub(clubId);
    //设置玩家在仙盟里面
    let actAdokSevModel = ActAdokSevModel_1.ActAdokSevModel.getInstance(ctx, uuid);
    await actAdokSevModel.setPos(1);
});
/**
 * @api {post} /club/gaiming 仙盟改名
 * @apiName 仙盟改名
 * @apiGroup club
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} name 仙盟名
 */
router.all("/gaiming", async (ctx) => {
    ctx.state.apidesc = "仙盟-仙盟改名";
    const { uuid, name } = tool_1.tool.getParams(ctx);
    //获取玩家仙盟ID
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    let clubId = await actClubModel.clickClub(true);
    //名字长度合法
    let cfgMath2 = gameCfg_1.default.mathInfo.getItemCtx(ctx, "club_nameLong");
    if (cfgMath2.pram.count == null || cfgMath2.pram.count1 == null) {
        ctx.throw("配置错误 club_nameLong");
        return;
    }
    let strlen = gameMethod_1.gameMethod.getStrCharacterLength(name);
    if (strlen < cfgMath2.pram.count || strlen > cfgMath2.pram.count1) {
        ctx.throw(`名字长度${cfgMath2.pram.count}-${cfgMath2.pram.count1}个字符`);
    }
    //仙盟锁
    await lock_1.default.setLock(ctx, "club", clubId);
    //玩家职位 验证
    let sevClubModel = SevClubModel_1.SevClubModel.getInstance(ctx, clubId);
    await sevClubModel.isMaster(uuid);
    await sevClubModel.gaiming(name);
});
/**
 * @api {post} /club/reNotice 修改仙盟公告
 * @apiName 修改仙盟公告
 * @apiGroup club
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} notice 公告内容
 */
router.all("/reNotice", async (ctx) => {
    ctx.state.apidesc = "仙盟-修改仙盟公告";
    const { uuid, notice } = tool_1.tool.getParams(ctx);
    //获取玩家仙盟ID
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    let clubId = await actClubModel.clickClub(true);
    //仙盟锁
    await lock_1.default.setLock(ctx, "club", clubId);
    //仙盟
    let sevClubModel = SevClubModel_1.SevClubModel.getInstance(ctx, clubId);
    //玩家职位 验证
    await sevClubModel.isMaster(uuid);
    //修改公告
    await sevClubModel.rstNotice(notice.toString());
});
/**
 * @api {post} /club/rstApLevel 修改申请等级
 * @apiName 修改申请等级
 * @apiGroup club
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} level 等级
 */
router.all("/rstApLevel", async (ctx) => {
    ctx.state.apidesc = "仙盟-修改申请等级";
    const { uuid, level } = tool_1.tool.getParams(ctx);
    //获取玩家仙盟ID
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    let clubId = await actClubModel.clickClub(true);
    //仙盟锁
    await lock_1.default.setLock(ctx, "club", clubId);
    //仙盟
    let sevClubModel = SevClubModel_1.SevClubModel.getInstance(ctx, clubId);
    //玩家职位 验证
    await sevClubModel.isMaster(uuid);
    //设置等级
    await sevClubModel.rstApLevel(Number(level));
});
/**
 * @api {post} /club/rstApAuto 修改自动加入状态
 * @apiName 修改自动加入状态
 * @apiGroup club
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {boolean} auto 是否允许自动加入 true自动 false不自动
 */
router.all("/rstApAuto", async (ctx) => {
    ctx.state.apidesc = "仙盟-修改自动加入状态";
    const { uuid, auto } = tool_1.tool.getParams(ctx);
    //获取玩家仙盟ID
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    let clubId = await actClubModel.clickClub(true);
    //仙盟锁
    await lock_1.default.setLock(ctx, "club", clubId);
    //仙盟
    let sevClubModel = SevClubModel_1.SevClubModel.getInstance(ctx, clubId);
    //玩家职位 验证
    await sevClubModel.isMaster(uuid);
    //设置自动状态
    await sevClubModel.rstApAuto(auto ? true : false);
});
/**
 * @api {post} /club/setSelect 修改允许被搜索状态
 * @apiName 修改允许被搜索状态
 * @apiGroup club
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {boolean} auto 是否允许自动加入 true自动 false不自动
 */
router.all("/setSelect", async (ctx) => {
    ctx.state.apidesc = "仙盟-修改允许被搜索状态";
    const { uuid, auto } = tool_1.tool.getParams(ctx);
    //获取玩家仙盟ID
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    let clubId = await actClubModel.clickClub(true);
    //仙盟锁
    await lock_1.default.setLock(ctx, "club", clubId);
    //仙盟
    let sevClubModel = SevClubModel_1.SevClubModel.getInstance(ctx, clubId);
    //玩家职位 验证
    await sevClubModel.isMaster(uuid);
    //设置自动状态
    await sevClubModel.setSelect(auto ? true : false);
});
/**
 * @api {post} /club/apply 申请加入
 * @apiName 申请加入
 * @apiGroup club
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} cid 仙盟ID
 */
router.all("/apply", async (ctx) => {
    ctx.state.apidesc = "仙盟-申请加入";
    const { uuid, cid } = tool_1.tool.getParams(ctx);
    let clubId = cid.toString();
    //检查玩家是不是没有仙盟
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    await actClubModel.clickClub(false);
    //仙盟锁
    await lock_1.default.setLock(ctx, "club", clubId);
    //所申请的仙盟 是不是本服的
    let sevClubModel = SevClubModel_1.SevClubModel.getInstance(ctx, clubId);
    await sevClubModel.clickHe(ctx.state.sid);
    //退出仙盟下次进入冷却(小时)
    let cfgMath = gameCfg_1.default.mathInfo.getItemCtx(ctx, "club_outInCd");
    if (cfgMath.pram.count == null) {
        ctx.throw("配置错误 club_outInCd");
        return;
    }
    let clubInfo = await actClubModel.getInfo();
    if (clubInfo.outClubTime + cfgMath.pram.count * 3600 > ctx.state.newTime) {
        ctx.throw(`退出仙盟后${cfgMath.pram.count}小时后才能再次入会`);
    }
    //仙盟信息
    let sevClubInfo = await sevClubModel.getInfo();
    //是否达到申请条件
    let userModel = UserModel_1.UserModel.getInstance(ctx, uuid);
    let userInfo = await userModel.getInfo();
    if (sevClubInfo.applyLevelNeed > userInfo.level) {
        ctx.throw("等级不达标");
    }
    //是否自动入会
    if (sevClubInfo.applyAuto > 0) {
        //加入仙盟
        await actClubModel.joinClub(clubId);
        //设置玩家在仙盟里面
        let actAdokSevModel = ActAdokSevModel_1.ActAdokSevModel.getInstance(ctx, uuid);
        await actAdokSevModel.setPos(1);
        return;
    }
    //加入申请表
    await actClubModel.joinClubApplyIds(clubId);
});
/**
 * @api {post} /club/allow 同意申请
 * @apiName 同意申请
 * @apiGroup club
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} fuuid 目标玩家
 */
router.all("/allow", async (ctx) => {
    ctx.state.apidesc = "仙盟-同意申请";
    const { uuid, fuuid } = tool_1.tool.getParams(ctx);
    //获取玩家仙盟ID
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    let clubId = await actClubModel.clickClub(true);
    //仙盟锁
    await lock_1.default.setLock(ctx, "club", clubId);
    //仙盟
    let sevClubModel = SevClubModel_1.SevClubModel.getInstance(ctx, clubId);
    //玩家职位 验证
    await sevClubModel.isMaster(uuid);
    //仙盟申请表
    let sevClubApplyModel = SevClubApplyModel_1.SevClubApplyModel.getInstance(ctx, clubId);
    //这个人有没有在我的申请表里面
    await sevClubApplyModel.getById(fuuid);
    //对方玩家 加入仙盟
    await lock_1.default.setLock(ctx, "user", fuuid); //枷锁
    ctx.state.fuuid = fuuid;
    let factClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, fuuid);
    await factClubModel.joinClub(clubId);
    ctx.state.fuuid = "";
});
/**
 * @api {post} /club/refuse 拒绝申请
 * @apiName 拒绝申请
 * @apiGroup club
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} fuuid 目标玩家
 */
router.all("/refuse", async (ctx) => {
    ctx.state.apidesc = "仙盟-拒绝申请";
    const { uuid, fuuid } = tool_1.tool.getParams(ctx);
    //获取玩家仙盟ID
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    let clubId = await actClubModel.clickClub(true);
    //仙盟锁
    await lock_1.default.setLock(ctx, "club", clubId);
    //仙盟
    let sevClubModel = SevClubModel_1.SevClubModel.getInstance(ctx, clubId);
    //玩家职位 验证
    await sevClubModel.isMaster(uuid);
    //他的申请信息 去除
    await lock_1.default.setLock(ctx, "user", fuuid); //枷锁
    ctx.state.fuuid = fuuid;
    let factClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, fuuid);
    await factClubModel.outClubApplyIds(clubId);
    ctx.state.fuuid = "";
});
/**
 * @api {post} /club/out 退出仙盟
 * @apiName 退出仙盟
 * @apiGroup club
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 */
router.all("/out", async (ctx) => {
    ctx.state.apidesc = "仙盟-退出仙盟";
    const { uuid } = tool_1.tool.getParams(ctx);
    //获取玩家仙盟ID
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    let clubId = await actClubModel.clickClub(true);
    //仙盟锁
    await lock_1.default.setLock(ctx, "club", clubId);
    //仙盟
    let sevClubModel = SevClubModel_1.SevClubModel.getInstance(ctx, clubId);
    let clubname = (await sevClubModel.getInfo()).name;
    //玩家职位 验证
    if (await sevClubModel.isMaster(uuid, true)) {
        //会长退出仙盟 执行解散机制
        let sevClubMemberModel = SevClubMemberModel_1.SevClubMemberModel.getInstance(ctx, clubId);
        if ((await sevClubMemberModel.count()) > 1) {
            ctx.throw(`先把会长转让给别人`);
        }
        //退出仙盟
        await actClubModel.outClub(2, clubname);
        //删除仙盟
        await sevClubModel.delete();
    }
    else {
        //会员退出仙盟
        await actClubModel.outClub(0, clubname);
    }
});
/**
 * @api {post} /club/kick 踢出仙盟
 * @apiName 踢出仙盟
 * @apiGroup club
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} fuuid 目标玩家
 */
router.all("/kick", async (ctx) => {
    ctx.state.apidesc = "仙盟-踢出仙盟";
    const { uuid, fuuid } = tool_1.tool.getParams(ctx);
    //获取玩家仙盟ID
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    let clubId = await actClubModel.clickClub(true);
    //仙盟锁
    await lock_1.default.setLock(ctx, "club", clubId);
    //仙盟
    let sevClubModel = SevClubModel_1.SevClubModel.getInstance(ctx, clubId);
    let clubname = (await sevClubModel.getInfo()).name;
    //玩家职位 验证
    await sevClubModel.isMaster(uuid);
    //目标玩家退出仙盟
    await lock_1.default.setLock(ctx, "user", fuuid); //枷锁
    ctx.state.fuuid = fuuid;
    let factClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, fuuid);
    await factClubModel.outClub(1, clubname, clubId);
    ctx.state.fuuid = "";
});
/**
 * @api {post} /club/giveport 转让会长
 * @apiName 转让会长
 * @apiGroup club
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} fuuid 目标玩家
 */
router.all("/giveport", async (ctx) => {
    ctx.state.apidesc = "仙盟-转让会长";
    const { uuid, fuuid } = tool_1.tool.getParams(ctx);
    //获取玩家仙盟ID
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    let clubId = await actClubModel.clickClub(true);
    //仙盟锁
    await lock_1.default.setLock(ctx, "club", clubId);
    //仙盟
    let sevClubModel = SevClubModel_1.SevClubModel.getInstance(ctx, clubId);
    //玩家职位 验证
    await sevClubModel.isMaster(uuid);
    //会长转让冷却
    let cfgMath = gameCfg_1.default.mathInfo.getItemCtx(ctx, "club_giveportCd");
    if (cfgMath.pram.count == null) {
        ctx.throw("配置错误 club_giveportCd");
        return;
    }
    let clubInfo = await sevClubModel.getInfo();
    if (clubInfo.rstMstTime + cfgMath.pram.count * 3600 > ctx.state.newTime) {
        ctx.throw("转让会长冷却中");
    }
    clubInfo.rstMstTime = ctx.state.newTime;
    await sevClubModel.update(clubInfo);
    //改会长
    await sevClubModel.setMasterUuid(fuuid);
});
//
/**
 * @api {post} /club/dissolution 解散仙盟
 * @apiName 解散仙盟
 * @apiGroup club
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 */
router.all("/dissolution", async (ctx) => {
    ctx.state.apidesc = "仙盟-解散仙盟";
    const { uuid, fuuid } = tool_1.tool.getParams(ctx);
    //获取玩家仙盟ID
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    let clubId = await actClubModel.clickClub(true);
    //仙盟锁
    await lock_1.default.setLock(ctx, "club", clubId);
    //仙盟
    let sevClubModel = SevClubModel_1.SevClubModel.getInstance(ctx, clubId);
    let clubname = (await sevClubModel.getInfo()).name;
    //玩家职位 验证
    await sevClubModel.isMaster(uuid);
    let sevClubMemberModel = SevClubMemberModel_1.SevClubMemberModel.getInstance(ctx, clubId);
    if ((await sevClubMemberModel.count()) > 1) {
        ctx.throw(`仙盟还有人不能解散`);
    }
    //退出仙盟
    await actClubModel.outClub(2, clubname);
    //删除仙盟
    await sevClubModel.delete();
});
/**
 * @api {post} /club/helpMe 仙盟互助发布
 * @apiName 仙盟互助发布
 * @apiGroup club
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} type 互助类型box卡牌升级boxStep卡牌升阶fushi符文升阶dongtian洞天求助
 */
router.all("/helpMe", async (ctx) => {
    ctx.state.apidesc = "仙盟-仙盟互助发布";
    const { uuid, type } = tool_1.tool.getParams(ctx);
    //玩家仙盟ID
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    await actClubModel.helpMe(type);
});
/**
 * @api {post} /club/helpHe 仙盟互助帮助别人
 * @apiName 仙盟互助帮助别人
 * @apiGroup club
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} id 任务ID
 */
router.all("/helpHe", async (ctx) => {
    ctx.state.apidesc = "仙盟-仙盟互助帮助别人";
    const { uuid, id } = tool_1.tool.getParams(ctx);
    //获取玩家仙盟ID
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    await actClubModel.helpHe(id);
});
/**
 * @api {post} /club/bossOpen 开启BOSS
 * @apiName 开启BOSS
 * @apiGroup club
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} id bossId
 */
router.all("/bossOpen", async (ctx) => {
    ctx.state.apidesc = "仙盟-开启BOSS";
    const { uuid, id } = tool_1.tool.getParams(ctx);
    //获取玩家仙盟ID
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    let clubId = await actClubModel.clickClub(true);
    //仙盟锁
    await lock_1.default.setLock(ctx, "club", clubId);
    //仙盟
    let sevClubModel = SevClubModel_1.SevClubModel.getInstance(ctx, clubId);
    //玩家职位 验证
    await sevClubModel.isMaster(uuid);
    //设置等级
    await sevClubModel.bossOpen(Number(id));
    //推送
    let sevClubMemberModel = SevClubMemberModel_1.SevClubMemberModel.getInstance(ctx, clubId);
    let sevClubMemberInfo = await sevClubMemberModel.getInfo();
    for (const fuuid in sevClubMemberInfo.list) {
        if (fuuid == uuid) {
            continue; //过滤自己
        }
        //发奖励 邮件
        await lock_1.default.setLock(ctx, "user", fuuid); //枷锁
        ctx.state.fuuid = fuuid;
        let factDingYueModel = ActDingYueModel_1.ActDingYueModel.getInstance(ctx, fuuid);
        await factDingYueModel.sendDy("6", []);
        ctx.state.fuuid = "";
    }
});
/**
 * @api {post} /club/bossFight 打BOSS
 * @apiName 打BOSS
 * @apiGroup club
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} type free免费item道具
 */
router.all("/bossFight", async (ctx) => {
    ctx.state.apidesc = "仙盟-打BOSS";
    const { uuid, type } = tool_1.tool.getParams(ctx);
    //设置玩家在仙盟里面
    let actAdokSevModel = ActAdokSevModel_1.ActAdokSevModel.getInstance(ctx, uuid);
    await actAdokSevModel.setPos(1);
    //获取玩家仙盟ID
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    //BOSS开打
    await actClubModel.bossFight(type);
});
/**
 * @api {post} /club/bossRank 查看排行
 * @apiName 查看排行
 * @apiGroup club
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} type 排行标签today当前last上次
 * @apiParam {string} id bossId
 */
router.all("/bossRank", async (ctx) => {
    ctx.state.apidesc = "仙盟-查看排行";
    const { uuid, type, id } = tool_1.tool.getParams(ctx);
    //获取玩家仙盟ID
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    let clubId = await actClubModel.clickClub(true);
    let sevClubBossModel = SevClubBossModel_1.SevClubBossModel.getInstance(ctx, clubId);
    await sevClubBossModel.backRank(type, id);
});
/**
 * @api {post} /club/rwdFp 仙盟防骗奖励
 * @apiName 防骗奖励
 * @apiGroup club
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 */
router.all("/rwdFp", async (ctx) => {
    ctx.state.apidesc = "仙盟-仙盟防骗奖励";
    const { uuid } = tool_1.tool.getParams(ctx);
    //杂项奖励
    let actRwdOptModel = ActRwdOptModel_1.ActRwdOptModel.getInstance(ctx, uuid);
    await actRwdOptModel.club_fp();
});
/**
 * @api {post} /club/rwdChatFp 仙盟聊天防骗奖励
 * @apiName 仙盟聊天防骗奖励
 * @apiGroup rwdChatFp
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 */
router.all("/rwdChatFp", async (ctx) => {
    ctx.state.apidesc = "仙盟-仙盟聊天防骗奖励";
    const { uuid } = tool_1.tool.getParams(ctx);
    //杂项奖励
    let actRwdOptModel = ActRwdOptModel_1.ActRwdOptModel.getInstance(ctx, uuid);
    await actRwdOptModel.club_chat();
});
/**
 * @api {post} /club/buguser 仙盟BGU玩家处理
 * @apiName 仙盟BGU玩家处理
 * @apiGroup rwdChatFp
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} fuuid BUG玩家uuid
 * @apiParam {string} clubId BUG公会id
 */
router.all("/buguser", async (ctx) => {
    ctx.state.apidesc = "仙盟-仙盟BGU玩家处理";
    const { fuuid, clubId } = tool_1.tool.getParams(ctx);
    //传入一个玩家ID 和一个 公会ID (手动数据去数据库找)
    //如果这个玩家的 公会ID是空
    //并且 这个公会里面有这个玩家
    //那么就把这个玩家 从公会列表移除
    //检查玩家是不是没有仙盟
    let f_actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, fuuid);
    let f_clubInfo = await f_actClubModel.getInfo();
    //我是不是没有公会IIID
    if (gameMethod_1.gameMethod.isEmpty(f_clubInfo.clubId) != true) {
        ctx.throw(`有公会ID ${f_clubInfo.clubId}`);
    }
    //公会里面有没有他
    //仙盟锁
    await lock_1.default.setLock(ctx, "club", clubId);
    //公会成员表
    let sevClubMemberModel = SevClubMemberModel_1.SevClubMemberModel.getInstance(ctx, clubId);
    let sevClubinfo = await sevClubMemberModel.getInfo();
    if (sevClubinfo.list[fuuid] == null) {
        ctx.throw(`这个公会里面 没有我 ${clubId}`);
    }
    //删除我
    await sevClubMemberModel.del(fuuid);
});
/**
 * @api {post} /club/qifu 祈福
 * @apiName 祈福
 * @apiGroup club
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 */
router.all("/qifu", async (ctx) => {
    ctx.state.apidesc = "仙盟-祈福";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    await actClubModel.qifu();
});
/**
 * @api {post} /club/maxFu  一键满福
 * @apiName 一键满福
 * @apiGroup club
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 */
router.all("/maxFu", async (ctx) => {
    ctx.state.apidesc = "仙盟-祈福";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    await actClubModel.maxFu();
});
/**
 * @api {post} /club/gaiyun 改运
 * @apiName 改运
 * @apiGroup club
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 */
router.all("/gaiyun", async (ctx) => {
    ctx.state.apidesc = "仙盟-改运";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    await actClubModel.gaiyun();
});
/**
 * @api {post} /club/lingqu 祈福领取
 * @apiName 祈福领取
 * @apiGroup club
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 */
router.all("/lingqu", async (ctx) => {
    ctx.state.apidesc = "仙盟-祈福领取";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    await actClubModel.lingqu();
});
/**
 * @api {post} /club/qfRwd 祈福档位领取
 * @apiName 祈福档位领取
 * @apiGroup club
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} id 配置表ID
 */
router.all("/qfRwd", async (ctx) => {
    ctx.state.apidesc = "仙盟-祈福档位领取";
    const { uuid, id } = tool_1.tool.getParams(ctx);
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    await actClubModel.qfRwd(id);
});
/**
 * @api {post} /club/mjUpLv 秘笈升级升阶
 * @apiName 秘笈升级升阶
 * @apiGroup club
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} type 配置表type
 */
router.all("/mjUpLv", async (ctx) => {
    ctx.state.apidesc = "仙盟-秘笈升级升阶";
    const { uuid, type } = tool_1.tool.getParams(ctx);
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    let actClub = await actClubModel.getInfo();
    if (actClub.clubId == "") {
        ctx.throw("请先加入仙盟");
    }
    let actClubMjModel = ActClubMjModel_1.ActClubMjModel.getInstance(ctx, uuid);
    await actClubMjModel.mjUpLv(type);
});
/**
 * @api {post} /club/lookChat 查看聊天信息
 * @apiName 查看聊天信息
 * @apiGroup club
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 */
router.all("/lookChat", async (ctx) => {
    ctx.state.apidesc = "仙盟-查看聊天信息";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    let actClub = await actClubModel.getInfo();
    if (actClub.clubId == "") {
        ctx.throw("请先加入仙盟");
    }
    //更新查看时间
    await actClubModel.lookChat();
});
//# sourceMappingURL=club.js.map