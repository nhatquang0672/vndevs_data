"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tool_1 = require("../util/tool");
const UserModel_1 = require("../model/user/UserModel");
const ActBoxModel_1 = require("../model/act/ActBoxModel");
const lock_1 = __importDefault(require("../util/lock"));
const mongodb_1 = require("../util/mongodb");
const setting_1 = __importDefault(require("../crontab/setting"));
const PlayerModel_1 = require("../model/player/PlayerModel");
const ActCodeModel_1 = require("../model/act/ActCodeModel");
const ActRedModel_1 = require("../model/act/ActRedModel");
const ActDingYueModel_1 = require("../model/act/ActDingYueModel");
const gameCfg_1 = __importDefault(require("../../common/gameCfg"));
const ActEquipModel_1 = require("../model/act/ActEquipModel");
const game_1 = __importDefault(require("../util/game"));
const ActAdokSevModel_1 = require("../model/act/ActAdokSevModel");
const gameMethod_1 = require("../../common/gameMethod");
const ActFuShiModel_1 = require("../model/act/ActFuShiModel");
const ActChengHModel_1 = require("../model/act/ActChengHModel");
const ActPvdModel_1 = require("../model/act/ActPvdModel");
const RdsUserModel_1 = require("../model/redis/RdsUserModel");
const ActZhaoCaiModel_1 = require("../model/act/ActZhaoCaiModel");
const ActLonggongModel_1 = require("../model/act/ActLonggongModel");
const ActXiantuModel_1 = require("../model/act/ActXiantuModel");
const ActXianlvModel_1 = require("../model/act/ActXianlvModel");
const ActTaskMainModel_1 = require("../model/act/ActTaskMainModel");
const cache_1 = __importDefault(require("../util/cache"));
const router = new koa_router_1.default();
exports.router = router;
router.prefix('/user');
/**
 * @api {post} /user/lookFuuidAll 查看其他玩家所有信息
 * @apiName 查看其他玩家所有信息
 * @apiGroup user
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} realId 真身ID(获取真实数据)
 * @apiParam {string} fuuid  查看对象(获取假身基础信息)
 */
router.all('/lookFuuidAll', async (ctx) => {
    ctx.state.apidesc = "角色-查看其他玩家所有信息";
    const { realId, fuuid } = tool_1.tool.getParams(ctx);
    if (parseInt(fuuid) < 100000 && parseInt(realId) < 100000) {
        //竞技场机器人
        let cfg = gameCfg_1.default.jjcNpc.getItemCtx(ctx, realId);
        let sevBackNpc = {};
        sevBackNpc["actChiBang"] = {};
        sevBackNpc.actChiBang.hh = cfg.jianling[0].toString();
        sevBackNpc.actChiBang.id = cfg.jianling[1];
        if (cfg.shouling.length > 0) {
            sevBackNpc["actFazhen"] = {};
            sevBackNpc["actFazhen"]["list"] = {};
            sevBackNpc.actFazhen.list["1"] = {
                fzid: cfg.shouling[0].toString(),
                saveId: cfg.shouling[1],
                otherEps: {},
                zaddp: 0,
                faddp: 0
            };
            sevBackNpc.actFazhen.useGzId = "1";
        }
        let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
        let rdsUserModel = await new RdsUserModel_1.RdsUserModel("rdsJjc", 'x', heid, tool_1.tool.jjcWeekId(ctx.state.newTime));
        sevBackNpc["rdsJjcMy"] = {
            rid: 0,
            score: Math.ceil(parseFloat(await rdsUserModel.zScore(realId)))
        };
        let jjcfuserAll = {
            uid: realId,
            uuid: realId,
            sid: ctx.state.sid,
            name: cfg.name,
            sex: 0,
            head: "",
            wxhead: "",
            tzid: "",
            level: cfg.level,
            lastlogin: ctx.state.newTime,
            clubName: "",
            chid: "1",
            cbid: "1",
            sevBack: sevBackNpc,
        };
        ctx.state.master.addBackBuf({
            fuserAll: jjcfuserAll
        });
    }
    else {
        ctx.state.master.addBackBuf({
            fuserAll: await cache_1.default.getFUser(ctx, realId)
        });
    }
});
/**
 * @api {post} /user/useCode 使用兑换码
 * @apiName 使用兑换码
 * @apiGroup user
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} key  兑换码key
 */
router.all('/useCode', async (ctx) => {
    ctx.state.apidesc = "角色-使用兑换码";
    const { uuid, key } = tool_1.tool.getParams(ctx);
    let maKey = key.trim();
    await lock_1.default.setLock(ctx, "code", maKey); //枷锁
    let result = await mongodb_1.dbSev.getDataDb().findOne("a_codeMa", { "ma": maKey });
    if (result == null) {
        ctx.throw("兑换码错误");
    }
    let result1 = await mongodb_1.dbSev.getDataDb().findOne("a_code", { "id": result.id });
    if (result1 == null) {
        ctx.throw("兑换码类型错误");
    }
    if (result1.etime > 0 && ctx.state.newTime > result1.etime) {
        ctx.throw("兑换码已过期");
    }
    let actCodeModel = ActCodeModel_1.ActCodeModel.getInstance(ctx, uuid);
    let actCode = await actCodeModel.getInfo();
    if (result1.type == "通用码") {
        if (actCode.gonggong.indexOf(maKey) != -1) {
            ctx.throw("已领取");
        }
        actCode.gonggong.push(maKey);
    }
    else {
        if (result.fuuid != null && result.fuuid != "") {
            ctx.throw("兑换码已使用");
        }
        if (actCode.siren.indexOf(result1.id) != -1) {
            ctx.throw("已领取");
        }
        actCode.siren.push(result1.id);
    }
    await actCodeModel.update(actCode, ['']);
    if (result1.type == "累充码") {
        let backs = await mongodb_1.dbSev.getDataDb().find("kind10", { "uuid": uuid });
        let allrmb = 0;
        for (const back of backs) {
            if (back.status == 0) {
                continue;
            }
            if (result1.kstime > 0 && result1.jstime > 0) {
                if (result1.kstime > back.overAt || result1.jstime < back.overAt) {
                    continue;
                }
            }
            allrmb += back.rmb;
        }
        if (allrmb < parseInt(result1.lccount)) {
            ctx.throw("累充未满足条件");
        }
    }
    if (result1.type == "单日码") {
        let backs = await mongodb_1.dbSev.getDataDb().find("kind10", { "uuid": uuid });
        let allrmb = 0;
        for (const back of backs) {
            if (back.status == 0) {
                continue;
            }
            if (game_1.default.getTodayId(result1.xdtime) != game_1.default.getTodayId(back.overAt)) {
                continue;
            }
            allrmb += back.rmb;
        }
        if (allrmb < parseInt(result1.lccount)) {
            ctx.throw("单日未满足条件");
        }
    }
    await mongodb_1.dbSev.getDataDb().update("a_codeMa", { "ma": maKey }, { "fuuid": uuid });
    await mongodb_1.dbSev.getDataDb().update("a_code", { "id": result.id }, { "count": result1.count + 1 });
    //根据乙方和丙方在不同运营阶段的需求，提供各个游戏服务器内不同数量、不同等级、不同装备的账号，供乙方和丙方派人使用
    if (result1.type == "GM私人码") {
        //特殊处理
        let _items = JSON.parse(result1.items);
        let actEquipModel = ActEquipModel_1.ActEquipModel.getInstance(ctx, uuid);
        let actEquip = await actEquipModel.getInfo();
        //调等级
        if (_items[0][0] != null && _items[0][0] > 0) {
            if (ctx.state.level > _items[0][0]) {
                ctx.state.master.addWin("msg", "等级不能向下调");
            }
            else {
                let addexp = 0;
                for (let index = ctx.state.level; index < _items[0][0]; index++) {
                    let cfgUserInfo = gameCfg_1.default.userInfo.getItem(index.toString());
                    if (cfgUserInfo == null) {
                        continue;
                    }
                    addexp += cfgUserInfo.exp;
                }
                addexp = Math.max(addexp, 1);
                if (addexp > 0) {
                    await ctx.state.master.addItem1([1, 901, addexp]);
                }
                //预估抽取宝箱获得
                let count = Math.floor(addexp / 500);
                actEquip.count += count;
            }
        }
        for (let index = 0; index < 12; index++) {
            if (_items[1][index] == null || _items[1][index] == 0) {
                continue; //品质0和不处理
            }
            let buwei = (index + 1).toString();
            let pinzhi = _items[1][index];
            //在根据品质获取 装备种类ID 其实就是部位
            let cfgInfobwpz = gameCfg_1.default.equipBuweipinz.getItem(buwei, pinzhi.toString());
            if (cfgInfobwpz == null) {
                continue; //抽不到
            }
            let level = ctx.state.level;
            let equipId = cfgInfobwpz.id;
            let cfgElv = gameCfg_1.default.equipLevel.getItemCtx(ctx, pinzhi.toString(), level.toString());
            let eps = {};
            eps["hp_max"] = Math.max(0, cfgElv.hp_max + game_1.default.rand(-1 * cfgElv.hp_max_bd, cfgElv.hp_max_bd));
            eps["atk"] = Math.max(0, cfgElv.atk + game_1.default.rand(-1 * cfgElv.atk_bd, cfgElv.atk_bd));
            eps["def"] = Math.max(0, cfgElv.def + game_1.default.rand(-1 * cfgElv.def_bd, cfgElv.def_bd));
            eps["speed"] = Math.max(0, cfgElv.speed + game_1.default.rand(-1 * cfgElv.speed_bd, cfgElv.speed_bd));
            //特殊属性
            let cfgEinfo = gameCfg_1.default.equipInfo.getItemCtx(ctx, equipId);
            for (const tcid of cfgEinfo.tsCid) {
                let cfgTsCList = gameCfg_1.default.equipTsChiList.getItemListCtx(ctx, tcid);
                let _item1 = game_1.default.getProbRandItem(0, cfgTsCList, "prob");
                if (_item1 != null) {
                    let cfgEtsEp = gameCfg_1.default.equipTsEp.getItemCtx(ctx, pinzhi.toString(), _item1.epkey);
                    eps[_item1.epkey] = game_1.default.rand(cfgEtsEp.min, cfgEtsEp.max);
                }
            }
            let mrhh = ""; //皮肤
            //根据部位 获取皮肤
            let cfgPifuList = gameCfg_1.default.equipPifuList.getItemList(cfgEinfo.buwei.toString());
            let chouItem = [];
            if (cfgPifuList != null && cfgPifuList.length > 0) {
                for (const pfinfo of cfgPifuList) {
                    if (pfinfo.limit > 0) {
                        if (actEquip.czpf == null) {
                            continue;
                        }
                        //前置ID
                        let qzid = (parseInt(pfinfo.id) - 1).toString();
                        if (actEquip.czpf[qzid] == null || actEquip.czpf[qzid] < pfinfo.limit) {
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
                    if (actEquip.chuan[cfgEinfo.buwei.toString()] == null) {
                        actEquip.chuan[cfgEinfo.buwei.toString()] = actEquipModel.initBuWei();
                    }
                    if (actEquip.chuan[cfgEinfo.buwei.toString()].hhList[mrhh] == null) {
                        actEquip.chuan[cfgEinfo.buwei.toString()].hhList[mrhh] = 1;
                    }
                    actEquip.chuan[cfgEinfo.buwei.toString()].equipId = equipId;
                    actEquip.chuan[cfgEinfo.buwei.toString()].level = level;
                    actEquip.chuan[cfgEinfo.buwei.toString()].eps = eps;
                    actEquip.chuan[cfgEinfo.buwei.toString()].mrhh = mrhh;
                }
            }
            else {
            }
        }
        //保存
        await actEquipModel.update(actEquip);
        let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
        let actTaskMain = await actTaskMainModel.getInfo();
        actTaskMain.id = 360;
        await actTaskMainModel.update(actTaskMain);
    }
    else {
        await ctx.state.master.addItem2(JSON.parse(result1.items));
    }
});
/**
 * @api {post} /user/adok 角色心跳接口
 * @apiName 角色心跳接口
 * @apiGroup user
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} kid   xys协议1级key 例如体力：actTili
 * @apiParam {string} hdcid   xys协议2级hdcid 默认："1"
 */
router.all('/adok', async (ctx) => {
    ctx.state.apidesc = "角色-角色心跳接口";
    const { uuid, kid, hdcid } = tool_1.tool.getParams(ctx);
    switch (kid) {
        case 'actBox':
            let actBoxModel = ActBoxModel_1.ActBoxModel.getInstance(ctx, uuid);
            await actBoxModel.backData();
            break;
        case 'actFuShi':
            let actFuShiModel = ActFuShiModel_1.ActFuShiModel.getInstance(ctx, uuid);
            await actFuShiModel.backData();
            break;
        case 'actChengH':
            let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
            await actChengHModel.backData();
            break;
        case 'actPvd':
            let actPvdModel = ActPvdModel_1.ActPvdModel.getInstance(ctx, uuid);
            await actPvdModel.backData();
            break;
        case 'actZhaoCai':
            let actZhaoCaiModel = ActZhaoCaiModel_1.ActZhaoCaiModel.getInstance(ctx, uuid);
            await actZhaoCaiModel.backData();
            break;
        case 'actLonggong':
            let actLonggongModel = ActLonggongModel_1.ActLonggongModel.getInstance(ctx, uuid);
            await actLonggongModel.adokYun();
            break;
        case 'actXianlv':
            let actXianlvModel = ActXianlvModel_1.ActXianlvModel.getInstance(ctx, uuid);
            await actXianlvModel.backData();
            break;
    }
});
/**
 * @api {post} /user/red 游戏红点
 * @apiName 游戏红点
 * @apiGroup user
 *
 * @apiParam {string} uuid  角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} key   红点key
 * @apiParam {number} val   红点状态1有红点0没有
 */
router.all('/red', async (ctx) => {
    ctx.state.apidesc = "角色-游戏红点";
    const { uuid, key, val } = tool_1.tool.getParams(ctx);
    let actRedModel = ActRedModel_1.ActRedModel.getInstance(ctx, uuid);
    await actRedModel.set(key, val);
});
/**
 * @api {post} /user/redAll 游戏批量红点
 * @apiName 游戏批量红点
 * @apiGroup user
 *
 * @apiParam {string} uuid  角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {keyValue} keyVal   红点key
 */
router.all('/redAll', async (ctx) => {
    ctx.state.apidesc = "角色-游戏红点";
    const { uuid, keyVal } = tool_1.tool.getParams(ctx);
    let actRedModel = ActRedModel_1.ActRedModel.getInstance(ctx, uuid);
    for (const key in keyVal) {
        await actRedModel.set(key, keyVal[key]);
    }
});
/**
 * @api {post} /user/huanFu 换服
 * @apiName 换服
 * @apiGroup user
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} sid   区服ID
 */
router.all('/huanFu', async (ctx) => {
    ctx.state.apidesc = "角色-换服";
    const { uuid, sid } = tool_1.tool.getParams(ctx);
    let sids = setting_1.default.getQufus();
    if (sids == null || sids[sid] == null || sids[sid].openAt > ctx.state.newTime) {
        ctx.throw("参数错误");
    }
    if (sids[sid].status == "4") {
        ctx.throw("该区服维护中");
    }
    let userModel = UserModel_1.UserModel.getInstance(ctx, uuid);
    let user = await userModel.getInfo();
    let playerModel = PlayerModel_1.PlayerModel.getInstance(ctx, user.uid);
    await playerModel.setSid(sid);
});
/**
 * @api {post} /user/wechatSq 微信授权
 * @apiName 微信授权
 * @apiGroup user
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} nickname  微信昵称
 * @apiParam {string} headimgurl  微信头像
 * @apiParam {string} wxOpenid  微信openid
 */
router.all('/wechatSq', async (ctx) => {
    ctx.state.apidesc = "角色-微信授权";
    const { uuid, nickname, headimgurl } = tool_1.tool.getParams(ctx);
    let userModel = UserModel_1.UserModel.getInstance(ctx, uuid);
    await userModel.wechatSq(nickname, headimgurl);
});
/**
 * @api {post} /user/dySetOpen 订阅设置open
 * @apiName 订阅设置open
 * @apiGroup user
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} id  配置表序号ID
 * @apiParam {number} val 设置值
 */
router.all('/dySetOpen', async (ctx) => {
    ctx.state.apidesc = "角色-订阅设置open";
    const { uuid, id, val } = tool_1.tool.getParams(ctx);
    let actDingYueModel = ActDingYueModel_1.ActDingYueModel.getInstance(ctx, uuid);
    await actDingYueModel.setOpen(id, val);
});
/**
 * @api {post} /user/dySetDy 订阅设置dy
 * @apiName 订阅设置dy
 * @apiGroup user
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string[]} ids  配置表序号ID
 */
router.all('/dySetDy', async (ctx) => {
    ctx.state.apidesc = "角色-订阅设置dy";
    const { uuid, ids } = tool_1.tool.getParams(ctx);
    let actDingYueModel = ActDingYueModel_1.ActDingYueModel.getInstance(ctx, uuid);
    await actDingYueModel.setDy(ids);
});
/**
 * @api {post} /user/setPos 设置玩家当前位置
 * @apiName 设置玩家当前位置
 * @apiGroup user
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {number} pos  当前角色所属位置0:默认1:公会里面2:龙宫里面
 */
router.all('/setPos', async (ctx) => {
    ctx.state.apidesc = "角色-设置玩家当前位置";
    const { uuid, pos } = tool_1.tool.getParams(ctx);
    let actAdokSevModel = ActAdokSevModel_1.ActAdokSevModel.getInstance(ctx, uuid);
    await actAdokSevModel.setPos(pos);
});
/**
 * @api {post} /user/getFx 获取分享信息
 * @apiName 获取分享信息
 * @apiGroup user
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 */
router.all('/getFx', async (ctx) => {
    ctx.state.apidesc = "角色-获取分享信息";
    const { uuid } = tool_1.tool.getParams(ctx);
    //登陆界面公告
    let fenxiang = setting_1.default.getSetting("1", "fenxiang");
    if (fenxiang == null) {
        ctx.throw("fenxiang未配置");
    }
    ctx.state.master.addBackBuf({
        fenxiang: {
            wenan: game_1.default.getRandArr(fenxiang.wenan, 1)[0],
            tupian: game_1.default.getRandArr(fenxiang.tupian, 1)[0],
            newtupian: fenxiang.newtupian == null || fenxiang.newtupian.length <= 0 ? [] : game_1.default.getRandArr(fenxiang.newtupian, 1)[0],
        }
    });
});
/**
 * @api {post} /user/setName 设置角色名字
 * @apiName 设置角色名字
 * @apiGroup user
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} name 角色名字
 */
router.all('/setName', async (ctx) => {
    ctx.state.apidesc = "角色-设置角色名字";
    const { uuid, name } = tool_1.tool.getParams(ctx);
    if (name == null || name == "") {
        ctx.throw("名字不能为空");
    }
    let strlen = gameMethod_1.gameMethod.getStrCharacterLength(name);
    if (strlen < 3 || strlen > 15) {
        ctx.throw(`名字长度3-15个字符`);
    }
    let userModel = UserModel_1.UserModel.getInstance(ctx, uuid);
    let userInfo = await userModel.getInfo();
    if (userInfo.ncount != null && userInfo.ncount > 0) {
        let _item = tool_1.tool.mathcfg_item(ctx, "user_set_name");
        await ctx.state.master.subItem1(_item);
    }
    await userModel.setName(name);
});
/**
 * @api {post} /user/setWxhead 设置微信头像
 * @apiName 设置微信头像
 * @apiGroup user
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} str 头像
 */
router.all('/setWxhead', async (ctx) => {
    ctx.state.apidesc = "角色-设置微信头像";
    const { uuid, str } = tool_1.tool.getParams(ctx);
    let userModel = UserModel_1.UserModel.getInstance(ctx, uuid);
    await userModel.setWxhead(str);
});
/**
 * @api {post} /user/xiantu 仙途领取奖励
 * @apiName 仙途领取奖励
 * @apiGroup user
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} id 配置表ID
 */
router.all('/xiantu', async (ctx) => {
    ctx.state.apidesc = "角色-仙途领取奖励";
    const { uuid, id } = tool_1.tool.getParams(ctx);
    let actXiantuModel = ActXiantuModel_1.ActXiantuModel.getInstance(ctx, uuid);
    await actXiantuModel.xiantu(id);
});
/**
 * @api {post} /user/checTiktok 抖音订单检查
 * @apiName 抖音订单检查
 * @apiGroup user
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} pid 包ID
 * @apiParam {string} order10Id 服务器订单ID
 */
router.all('/checTiktok', async (ctx) => {
    ctx.state.apidesc = "角色-抖音订单检查";
});
/**
 * @api {post} /user/setHead 设置角色头像
 * @apiName 设置角色头像
 * @apiGroup user
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} id 配置表ID
 */
router.all('/setHead', async (ctx) => {
    ctx.state.apidesc = "角色-设置角色头像";
    const { uuid, id } = tool_1.tool.getParams(ctx);
    let userModel = UserModel_1.UserModel.getInstance(ctx, uuid);
    await userModel.setHead(id);
});
/**
 * @api {post} /user/setZj 记录运营组件玩家
 * @apiName 记录运营组件玩家
 * @apiGroup user
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 */
router.all('/setZj', async (ctx) => {
    ctx.state.apidesc = "角色-记录运营组件玩家";
    const { uuid, id } = tool_1.tool.getParams(ctx);
    let userModel = UserModel_1.UserModel.getInstance(ctx, uuid);
    await userModel.setZj();
});
//# sourceMappingURL=user.js.map