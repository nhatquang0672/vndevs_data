"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const router = new koa_router_1.default();
exports.router = router;
const s_game_1 = __importDefault(require("../tool/s_game"));
const mongodb_1 = require("../../src/util/mongodb");
const tool_1 = require("../../src/util/tool");
const gameMethod_1 = require("../../common/gameMethod");
const game_1 = __importDefault(require("../../src/util/game"));
const gameCfg_1 = __importDefault(require("../../common/gameCfg"));
const setting_1 = __importDefault(require("../../src/crontab/setting"));
const UserModel_1 = require("../../src/model/user/UserModel");
router.prefix('/s_zhichong');
router.all('/:token', async (ctx) => {
    let { uuid, gkey } = tool_1.tool.getParamsAdmin(ctx);
    let outf = {
        log: [],
        gift: {}
    };
    //初始化配置表缓存
    await gameCfg_1.default.init();
    await setting_1.default.createCash(game_1.default.getToDay_0(), game_1.default.getNowTime(), false);
    let _a_huodongs = await mongodb_1.dbSev.getDataDb().find("a_huodong");
    for (const hdcfg of _a_huodongs) {
        let value = eval("(" + hdcfg.value + ")");
        switch (hdcfg.key) {
            case "hdNew":
                for (const dc in value.data.list) {
                    if (value.data.list[dc].need[0] != 10) {
                        continue;
                    }
                    let giftkey1 = hdcfg.key + '_' + hdcfg.hdcid + '_' + dc + '_' + value.data.list[dc].need[1];
                    outf.gift[giftkey1] = `(${hdcfg.msg})` + dc + '_' + value.data.list[dc].need[1] + "元";
                    clog(giftkey1, hdcfg.msg, `(${hdcfg.msg})` + dc, value.data.list[dc].need[1], itemsName(value.data.list[dc].items));
                }
                break;
            case "hdXianshi":
                let giftkey11 = hdcfg.key + '_' + hdcfg.hdcid + '_' + "1" + '_' + value.data.need[1];
                outf.gift[giftkey11] = `(${hdcfg.msg})` + "1" + '_' + value.data.need[1] + "元";
                clog(giftkey11, hdcfg.msg, `(${hdcfg.msg})` + "1", value.data.need[1], itemsName(value.data.items));
                break;
            case "hdSpeGift":
                for (const dc in value.data.list) {
                    if (value.data.list[dc].need[0] != 10) {
                        continue;
                    }
                    let giftkey1 = hdcfg.key + '_' + hdcfg.hdcid + '_' + dc + '_' + value.data.list[dc].need[1];
                    outf.gift[giftkey1] = `(${hdcfg.msg})` + value.data.list[dc].title + '_' + dc + '_' + value.data.list[dc].need[1] + "元";
                    clog(giftkey1, hdcfg.msg, value.data.list[dc].title, value.data.list[dc].need[1], itemsName(value.data.list[dc].items));
                }
                break;
            case 'hdTimeBen':
                for (const dc in value.data.listNew) {
                    for (const dc1 in value.data.listNew[dc].dclist) {
                        if (value.data.listNew[dc].dclist[dc1].need[0] != 10) {
                            continue;
                        }
                        let giftkey1 = hdcfg.key + '_' + hdcfg.hdcid + '_' + dc + '_' + value.data.listNew[dc].dclist[dc1].need[1];
                        outf.gift[giftkey1] = `(${hdcfg.msg})` + dc + '_' + dc1 + '_' + value.data.listNew[dc].dclist[dc1].need[1] + "元";
                        clog(giftkey1, hdcfg.msg, `(${hdcfg.msg})` + dc, value.data.listNew[dc].dclist[dc1].need[1], itemsName(value.data.listNew[dc].dclist[dc1].rwd));
                    }
                }
                break;
            case 'hdKaifu':
            case 'hdChou':
                for (const dc in value.data.gift) {
                    if (value.data.gift[dc].need[0] != 10) {
                        continue;
                    }
                    let giftkey1 = hdcfg.key + '_' + hdcfg.hdcid + '_' + dc + '_' + value.data.gift[dc].need[1];
                    outf.gift[giftkey1] = `(${hdcfg.msg})` + value.data.gift[dc].title + '_' + dc + '_' + value.data.gift[dc].need[1] + "元";
                    clog(giftkey1, hdcfg.msg, value.data.gift[dc].title, value.data.gift[dc].need[1], itemsName(value.data.gift[dc].items));
                }
                break;
            case 'hdGrowthFund':
                if (value.data.need[0] != 10) {
                    continue;
                }
                let giftkey10 = hdcfg.key + '_' + hdcfg.hdcid + '_' + '1' + '_' + value.data.need[1];
                outf.gift[giftkey10] = `(${hdcfg.msg})` + '_' + hdcfg.hdcid + '_' + value.data.need[1] + "元";
                clog(giftkey10, hdcfg.msg, hdcfg.msg, value.data.need[1], itemsName([]));
                if (value.data.need1 != null && value.data.need1[0] == 10) {
                    let giftkey10 = "hdGrowthFundHh" + '_' + hdcfg.hdcid + '_' + '1' + '_' + value.data.need1[1];
                    outf.gift[giftkey10] = `(${hdcfg.msg})` + '_' + hdcfg.hdcid + '_豪华_' + value.data.need1[1] + "元";
                    clog(giftkey10, hdcfg.msg, `(${hdcfg.msg})` + '_' + hdcfg.hdcid + '_豪华', value.data.need1[1], itemsName([]));
                }
                break;
            case 'hdPriCard':
                if (value.data.card.need[0] != 10) {
                    continue;
                }
                let giftkey = hdcfg.key + '_' + hdcfg.hdcid + '_' + '1' + '_' + value.data.card.need[1];
                outf.gift[giftkey] = `(${hdcfg.msg})` + '_' + value.data.card.need[1] + "元";
                clog(giftkey, hdcfg.msg, hdcfg.msg, value.data.card.need[1], itemsName([]));
                break;
            case 'hdLianchong':
                for (const dc in value.data.buy) {
                    if (value.data.buy[dc].need[0] != 10) {
                        continue;
                    }
                    let giftkey1 = hdcfg.key + '_' + hdcfg.hdcid + '_' + dc + '_' + value.data.buy[dc].need[1];
                    outf.gift[giftkey1] = `(${hdcfg.msg})` + '_' + dc + '_' + value.data.buy[dc].need[1] + "元";
                    clog(giftkey1, hdcfg.msg, `(${hdcfg.msg})` + '_' + dc, value.data.buy[dc].need[1], itemsName(value.data.buy[dc].items));
                }
                break;
            case 'hdJiYuan':
                for (const dc in value.data.gift) {
                    if (value.data.gift[dc].need[0] != 10) {
                        continue;
                    }
                    let giftkey1 = "hdJiYuanGift" + '_' + hdcfg.hdcid + '_' + dc + '_' + value.data.gift[dc].need[1];
                    outf.gift[giftkey1] = "(旧版机缘)" + value.data.gift[dc].title + '_' + dc + '_' + value.data.gift[dc].need[1] + "元";
                    clog(giftkey1, "(旧版机缘)", value.data.gift[dc].title + '_' + dc, value.data.gift[dc].need[1], itemsName(value.data.gift[dc].items));
                }
                for (const dc in value.data.lockGift) {
                    if (value.data.lockGift[dc].need[0] != 10) {
                        continue;
                    }
                    let giftkey1 = "hdJiYuanLock" + '_' + hdcfg.hdcid + '_' + dc + '_' + value.data.lockGift[dc].need[1];
                    outf.gift[giftkey1] = "(旧版机缘)" + value.data.lockGift[dc].title + '_' + dc + '_' + value.data.lockGift[dc].need[1] + "元";
                    clog(giftkey1, "(旧版机缘)", value.data.lockGift[dc].title + '_' + dc, value.data.lockGift[dc].need[1], itemsName([]));
                }
                break;
            case 'hdNewJiYuan':
                for (const dc in value.data.gift) {
                    if (value.data.gift[dc].need[0] != 10) {
                        continue;
                    }
                    let giftkey1 = "hdNewJiYuanGift" + '_' + hdcfg.hdcid + '_' + dc + '_' + value.data.gift[dc].need[1];
                    outf.gift[giftkey1] = "(新版机缘)" + value.data.gift[dc].title + '_' + dc + '_' + value.data.gift[dc].need[1] + "元";
                    clog(giftkey1, "(新版机缘)", value.data.gift[dc].title + '_' + dc, value.data.gift[dc].need[1], itemsName(value.data.gift[dc].items));
                }
                for (const dc in value.data.lockGift) {
                    if (value.data.lockGift[dc].need[0] != 10) {
                        continue;
                    }
                    let giftkey1 = "hdNewJiYuanLock" + '_' + hdcfg.hdcid + '_' + dc + '_' + value.data.lockGift[dc].need[1];
                    outf.gift[giftkey1] = "(新版机缘)" + value.data.lockGift[dc].title + '_' + dc + '_' + value.data.lockGift[dc].need[1] + "元";
                    clog(giftkey1, "(新版机缘)", value.data.lockGift[dc].title + '_' + dc, value.data.lockGift[dc].need[1], itemsName(value.data.lockGift[dc].items2));
                }
                break;
            case 'hdQiYuan':
            case 'hdHuanJing':
            case 'hdXinMo':
            case 'hdChumo':
            case 'hdLunHui':
            case 'hdYueGong':
            case 'hdHuaLian':
            case 'hdShanhe':
            case 'hdChongYang':
                for (const dc in value.data.gift) {
                    if (value.data.gift[dc].need[0] != 10) {
                        continue;
                    }
                    let giftkey1 = hdcfg.key + '_' + hdcfg.hdcid + '_' + dc + '_' + value.data.gift[dc].need[1];
                    outf.gift[giftkey1] = `(${hdcfg.msg})` + value.data.gift[dc].title + '_' + dc + '_' + value.data.gift[dc].need[1] + "元";
                    if (["hdQiYuan", "hdHuanJing", "hdXinMo", "hdLunHui"].indexOf(hdcfg.key) != -1) {
                        clog(giftkey1, hdcfg.msg, value.data.gift[dc].title + '_' + dc, value.data.gift[dc].need[1], itemsName(value.data.gift[dc].rwd));
                    }
                    else {
                        clog(giftkey1, hdcfg.msg, value.data.gift[dc].title + '_' + dc, value.data.gift[dc].need[1], itemsName(value.data.gift[dc].items));
                    }
                }
                break;
            case 'hdHefuqd':
                for (const dc in value.data.tehui) {
                    if (value.data.tehui[dc].need[0] != 10) {
                        continue;
                    }
                    let giftkey1 = "hdHefuqdTh" + '_' + hdcfg.hdcid + '_' + dc + '_' + value.data.tehui[dc].need[1];
                    outf.gift[giftkey1] = `(${hdcfg.msg})` + value.data.tehui[dc].title + '_' + dc + '_' + value.data.tehui[dc].need[1] + "元";
                    clog(giftkey1, hdcfg.msg, value.data.tehui[dc].title + '_' + dc, value.data.tehui[dc].need[1], itemsName(value.data.tehui[dc].items));
                }
                let giftkey1 = "hdHefuqdCard" + '_' + hdcfg.hdcid + '_1_' + value.data.superCard.need[1];
                outf.gift[giftkey1] = `(${hdcfg.msg})` + '_超级翻倍卡_' + value.data.superCard.need[1] + "元";
                clog(giftkey1, hdcfg.msg, `(${hdcfg.msg})` + '_超级翻倍卡', value.data.superCard.need[1], itemsName([]));
                break;
            case 'hdZixuan':
                for (const dc in value.data.list) {
                    if (value.data.list[dc].need[0] != 10) {
                        continue;
                    }
                    let giftkey1 = hdcfg.key + '_' + hdcfg.hdcid + '_' + dc + '_' + value.data.list[dc].need[1];
                    outf.gift[giftkey1] = `(${hdcfg.msg})` + value.data.list[dc].name + '_' + dc + '_' + value.data.list[dc].need[1] + "元";
                    clog(giftkey1, hdcfg.msg, value.data.list[dc].name + '_' + dc, value.data.list[dc].need[1], itemsName([]));
                }
                break;
            case 'hdTianGong':
                for (const dc in value.data.buyList) {
                    if (value.data.buyList[dc].need[0] != 10) {
                        continue;
                    }
                    let giftkey1 = hdcfg.key + '_' + hdcfg.hdcid + '_' + dc + '_' + value.data.buyList[dc].need[1];
                    outf.gift[giftkey1] = `(${hdcfg.msg})` + value.data.buyList[dc].title + '_' + dc + '_' + value.data.buyList[dc].need[1] + "元";
                    clog(giftkey1, hdcfg.msg, value.data.buyList[dc].title + '_' + dc, value.data.buyList[dc].need[1], itemsName(value.data.buyList[dc].rwd));
                }
                break;
            case 'hdJuBaoPen':
                for (const dc in value.data) {
                    if (value.data[dc].need == null || value.data[dc].need[0] != 10) {
                        continue;
                    }
                    let giftkey1 = hdcfg.key + '_' + hdcfg.hdcid + '_' + dc + '_' + value.data[dc].need[1];
                    outf.gift[giftkey1] = `(${hdcfg.msg})` + '_' + dc + '_' + value.data[dc].need[1] + "元";
                    clog(giftkey1, hdcfg.msg, `(${hdcfg.msg})` + '_' + dc, value.data[dc].need[1], itemsName([[1, 1, value.data[dc].fanwei[1]]]));
                }
                break;
            case 'hdDayTeHui':
                for (const dc in value.data.dayList) {
                    if (value.data.dayList[dc].need == null || value.data.dayList[dc].need[0] != 10) {
                        continue;
                    }
                    let giftkey1 = hdcfg.key + '_' + hdcfg.hdcid + '_' + dc + '_' + value.data.dayList[dc].need[1];
                    outf.gift[giftkey1] = `(${hdcfg.msg})` + value.data.dayList[dc].title + '_' + dc + '_' + value.data.dayList[dc].need[1] + "元";
                    clog(giftkey1, hdcfg.msg, value.data.dayList[dc].title + '_' + dc, value.data.dayList[dc].need[1], itemsName(value.data.dayList[dc].rwd));
                }
                let giftkey2 = hdcfg.key + '_' + hdcfg.hdcid + '_' + "" + '_' + value.data.allNeed[1];
                outf.gift[giftkey2] = `(${hdcfg.msg})` + value.data.allTitle + '_' + "" + '_' + value.data.allNeed[1] + "元";
                clog(giftkey2, hdcfg.msg, value.data.allTitle, value.data.allNeed[1], itemsName([]));
                break;
            case 'hdChargeDays':
                let giftkey3 = hdcfg.key + '_' + hdcfg.hdcid + '_' + "" + '_' + value.data.dayNeed;
                outf.gift[giftkey3] = `(${hdcfg.msg})` + '_' + "" + '_' + value.data.dayNeed + "元";
                clog(giftkey3, hdcfg.msg, hdcfg.msg, value.data.dayNeed, itemsName([]));
                break;
        }
    }
    let shopDpool = gameCfg_1.default.shopDiamond.pool;
    for (const key in shopDpool) {
        let giftkey3 = "actShopDiaMond" + '_' + "1" + '_' + shopDpool[key].id + '_' + shopDpool[key].need[1];
        outf.gift[giftkey3] = shopDpool[key].name + '_' + shopDpool[key].id + '_' + shopDpool[key].need[1] + "元";
        clog(giftkey3, shopDpool[key].name, shopDpool[key].name + '_' + shopDpool[key].id, shopDpool[key].need[1], itemsName([shopDpool[key].item]));
    }
    let dtDpool = gameCfg_1.default.dongtianPaygift.pool;
    for (const key in dtDpool) {
        let giftkey4 = "actDongTian" + '_' + "1" + '_' + shopDpool[key].id + '_' + dtDpool[key].need[1];
        outf.gift[giftkey4] = "洞天" + '_' + shopDpool[key].id + '_' + dtDpool[key].need[1] + "元";
        clog(giftkey4, "洞天", "洞天" + '_' + shopDpool[key].id, dtDpool[key].need[1], itemsName(dtDpool[key].rwd));
    }
    let giftpool = gameCfg_1.default.giftDongtian.pool;
    for (const key in giftpool) {
        let giftkey4 = "actGiftDt" + '_' + giftpool[key].dc + '_' + giftpool[key].type + '_' + giftpool[key].need[1];
        outf.gift[giftkey4] = "洞天" + giftpool[key].type + '_' + giftpool[key].dc + '_' + giftpool[key].need[1] + "元";
        clog(giftkey4, "洞天" + giftpool[key].type, "洞天" + giftpool[key].type + '_' + giftpool[key].dc, giftpool[key].need[1], itemsName(giftpool[key].items));
    }
    if (gkey != '' && gkey != null && uuid != '' && uuid != null) {
        let zcCtx = await tool_1.tool.ctxCreate('user', uuid);
        zcCtx.state.fuuid = uuid;
        zcCtx.state.sid = setting_1.default.getHeid(zcCtx.state.sid);
        let cfgOrder = setting_1.default.getSetting(zcCtx.state.sid, "order");
        let uidInfo = await tool_1.tool.getInfoByUid(zcCtx);
        let userModel = UserModel_1.UserModel.getInstance(zcCtx, uuid);
        let user = await userModel.getInfo();
        let arr = gkey.split('_');
        let order_id = await mongodb_1.dbSev.getDataDb().getNextId("KIND10_ID");
        let orderInfo = {
            orderId: order_id.toString(),
            plat: uidInfo.plat,
            platOrderId: "",
            uid: user.uid,
            uuid: uuid,
            sid: zcCtx.state.sid,
            createAt: zcCtx.state.newTime,
            kid: arr[0],
            hdcid: arr[1],
            dc: arr[2],
            money: cfgOrder[uidInfo.plat][arr[3]].money,
            rmb: cfgOrder[uidInfo.plat][arr[3]].rmb,
            title: outf.gift[gkey],
            overAt: 0,
            status: 0,
            param: [],
        };
        //立即写入数据库
        await mongodb_1.dbSev.getDataDb().insert("kind10", orderInfo);
        let typeMsg = await zcCtx.state.master.kind10Success(order_id.toString(), order_id.toString(), 4);
        await tool_1.tool.ctxUpdate(zcCtx);
    }
    let kind10s = await mongodb_1.dbSev.getDataDb().find("kind10");
    for (const kind10 of kind10s) {
        if (uuid != null && uuid != "" && kind10.uuid != uuid) {
            continue;
        }
        if (kind10.status != 4) {
            continue;
        }
        if (kind10.createAt < game_1.default.getToDay_0() - 86400 * 3) {
            continue;
        }
        let _outf = gameMethod_1.gameMethod.objCopy(kind10);
        _outf.status = "后台直冲";
        _outf.createAt = game_1.default.getDayTime(_outf.createAt);
        _outf.overAt = _outf.overAt == 0 ? "未完成" : game_1.default.getDayTime(_outf.overAt);
        outf.log.push(_outf);
    }
    let back = await s_game_1.default.allOut(ctx, outf, { uuid: uuid });
    await ctx.render('a_zhichong', back);
});
function clog(s1, s2, s3, s4, s5) {
    return;
    console.log(s1 + "###" + s2 + "###" + s3 + "###" + s4 + "###" + s5);
}
function itemsName(items) {
    let str = "";
    if (items.length <= 0) {
        return str;
    }
    for (const item of items) {
        if (typeof item == "string" || typeof item == "number") {
            console.log("======格式错误===");
            return str;
        }
        let itemName = "未读取";
        switch (item[0]) {
            case 1:
                let cfg1 = gameCfg_1.default.itemMoney.getItem(item[1].toString());
                if (cfg1 != null) {
                    itemName = cfg1.name;
                }
                break;
            case 2:
                let cfg2 = gameCfg_1.default.fazhenInfo.getItem(item[1].toString());
                if (cfg2 != null) {
                    itemName = cfg2.name;
                }
                break;
            case 3:
                let cfg3 = gameCfg_1.default.fushiItem.getItem(item[1].toString());
                if (cfg3 != null) {
                    itemName = cfg3.name;
                }
                break;
            case 4:
                itemName = "装备";
                break;
            case 5:
                let cfg5 = gameCfg_1.default.chenghaoInfo.getItem(item[1].toString());
                if (cfg5 != null) {
                    itemName = cfg5.name;
                }
                break;
            case 6:
                let cfg6 = gameCfg_1.default.equipPifu.getItem(item[1].toString());
                if (cfg6 != null) {
                    itemName = cfg6.name;
                }
                break;
            case 13:
                let cfg13 = gameCfg_1.default.chibangInfo.getItem(item[1].toString());
                if (cfg13 != null) {
                    itemName = cfg13.name;
                }
                break;
            default:
                console.log("类型未处理" + item[0]);
                return "";
        }
        str += itemName + "x" + item[2] + ', ';
    }
    return str;
}
//# sourceMappingURL=s_zhichong.js.map