"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hookNoteMap = exports.hookNote = void 0;
const setting_1 = __importDefault(require("../crontab/setting"));
const HdSignGiftModel_1 = require("../model/hd/HdSignGiftModel");
const ActTaskKindModel_1 = require("../model/act/ActTaskKindModel");
const ActTaskMainModel_1 = require("../model/act/ActTaskMainModel");
const ActChengHModel_1 = require("../model/act/ActChengHModel");
const HdTimeActModel_1 = require("../model/hd/HdTimeActModel");
const tool_1 = require("./tool");
const ActClubModel_1 = require("../model/act/ActClubModel");
const UserModel_1 = require("../model/user/UserModel");
const HdKaifuModel_1 = require("../model/hd/HdKaifuModel");
const HdEquipShopModel_1 = require("../model/hd/HdEquipShopModel");
const HdChouModel_1 = require("../model/hd/HdChouModel");
const HdJiYuanModel_1 = require("../model/hd/HdJiYuanModel");
const HdGrowthFundModel_1 = require("../model/hd/HdGrowthFundModel");
const HdXianshiModel_1 = require("../model/hd/HdXianshiModel");
const HdJuBaoPenModel_1 = require("../model/hd/HdJuBaoPenModel");
const ActFuShiModel_1 = require("../model/act/ActFuShiModel");
const HdQiYuanModel_1 = require("../model/hd/HdQiYuanModel");
const HdHuanJingModel_1 = require("../model/hd/HdHuanJingModel");
const HdXinMoModel_1 = require("../model/hd/HdXinMoModel");
const HdHefuqdModel_1 = require("../model/hd/HdHefuqdModel");
const HdChargeDays_1 = require("../model/hd/HdChargeDays");
const HdChargeTotal_1 = require("../model/hd/HdChargeTotal");
const HdNewJiYuanModel_1 = require("../model/hd/HdNewJiYuanModel");
const HdTianGongModel_1 = require("../model/hd/HdTianGongModel");
const HdChongBangModel_1 = require("../model/hd/HdChongBangModel");
const HdYueGongModel_1 = require("../model/hd/HdYueGongModel");
const HdHuaLianModel_1 = require("../model/hd/HdHuaLianModel");
const HdChongYangModel_1 = require("../model/hd/HdChongYangModel");
const ActJingGuaiModel_1 = require("../model/act/ActJingGuaiModel");
/**
 * 任务钩子
 */
async function hookNote(ctx, dosth, count, kind = "") {
    if (exports.hookNoteMap[dosth]) {
        await exports.hookNoteMap[dosth](ctx, count, kind);
    }
}
exports.hookNote = hookNote;
//主角升级次数 （这边包括创建角色初始1级） count = 主角当前等级
async function userLevel(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("102", count, true);
    await actTaskKindModel.jiesuoBaoshi();
    //精怪
    let actJingGuaiModel = ActJingGuaiModel_1.ActJingGuaiModel.getInstance(ctx, uuid);
    await actJingGuaiModel.jiesuogz(count);
    //解锁装备头发
    // let actEquipModel = ActEquipModel.getInstance(ctx, uuid);
    // await actEquipModel.addBuwei13(count);
    //任务开启_统计主角升级次数
    if (count > 1) {
        let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
        await actTaskMainModel.addHook("101", 1);
        //称号
        let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
        await actChengHModel.addHook("101", 1);
        //活动 - 限时活动 任务
        await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "101", 1);
        //开服活动
        await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "101", 1);
        //机缘活动_任务
        await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "101", 1);
        //机缘活动_任务
        await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "101", 1);
        //合服庆典_任务
        await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "101", 1, false);
        //兽灵起源
        await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "101", 1);
        //鱼灵幻境
        await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "101", 1);
        //破除心魔
        await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "101", 1);
        //月宫探宝
        await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "101", 1);
        //重阳出游
        await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "101", 1);
        //化莲
        await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "101", 1);
        let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
        //活动 - 装备商人
        let cfgHdEquipShop = setting_1.default.getHuodong2(heid, "hdEquipShop");
        if (cfgHdEquipShop != null) {
            for (const hdcid in cfgHdEquipShop) {
                let hdEquipShopModel = HdEquipShopModel_1.HdEquipShopModel.getInstance(ctx, uuid, hdcid);
                await hdEquipShopModel.lock(count);
            }
        }
        //刷新角色基金
        let hdGrowthFundModel = HdGrowthFundModel_1.HdGrowthFundModel.getInstance(ctx, uuid, "2");
        await hdGrowthFundModel.backData_u(["red"]);
        //刷新角色基金
        let hdGrowthFundModel5 = HdGrowthFundModel_1.HdGrowthFundModel.getInstance(ctx, uuid, "5");
        await hdGrowthFundModel5.backData_u(["red"]);
    }
}
//宝箱升级次数  count = 宝箱当前等级
async function boxLevel(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("104", count, true);
    //刷新宝箱基金
    let hdGrowthFundModel = HdGrowthFundModel_1.HdGrowthFundModel.getInstance(ctx, uuid, "1");
    await hdGrowthFundModel.backData_u(["red"]);
    //刷新宝箱基金
    let hdGrowthFundModel4 = HdGrowthFundModel_1.HdGrowthFundModel.getInstance(ctx, uuid, "4");
    await hdGrowthFundModel4.backData_u(["red"]);
}
//宝箱点击升级按钮次数
async function boxUpLevel(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("103", count, false);
}
//开宝箱次数
async function boxOpen(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //任务开启_开宝箱次数
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook("106", count);
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.addHook("106", count);
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "106", count);
    //开服活动
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "106", count);
    //机缘活动
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "106", count);
    //机缘活动_任务
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "106", count);
    //合服庆典_任务
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "106", count, false);
    //兽灵起源
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "106", count);
    //鱼灵幻境
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "106", count);
    //破除心魔
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "106", count);
    //月宫探宝
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "106", count);
    //重阳出游
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "106", count);
    //化莲
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "106", count);
    //触发公会活跃值
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    await actClubModel.chuFaActive("2");
    //九龙秘宝
    let hdChouModel = HdChouModel_1.HdChouModel.getInstance(ctx, uuid, "1");
    await hdChouModel.hook();
}
//使用加速券
async function itemZhuLi(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("105", count, false);
}
//分解装备
async function equipFenJie(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //任务开启_开宝箱次数
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook("107", count);
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.addHook("107", count);
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "107", count);
    //开服活动
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "107", count);
    //机缘活动
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "107", count);
    //机缘活动
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "107", count);
    //合服庆典_任务
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "107", count, false);
    //兽灵起源
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "107", count);
    //鱼灵幻境
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "107", count);
    //破除心魔
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "107", count);
    //月宫探宝
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "107", count);
    //重阳出游
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "107", count);
    //化莲
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "107", count);
}
//出售装备
async function equipChuShou(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //任务开启_开宝箱次数
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook("108", count);
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.addHook("108", count);
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "108", count);
    //开服活动
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "108", count);
    //机缘活动
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "108", count);
    //机缘活动
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "108", count);
    //合服庆典_任务
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "108", count, false);
    //兽灵起源
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "108", count);
    //鱼灵幻境
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "108", count);
    //破除心魔
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "108", count);
    //月宫探宝
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "108", count);
    //重阳出游
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "108", count);
    //化莲
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "108", count);
}
//穿戴装备
async function equipChuan(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("151", 1, true);
}
//抽取神器
async function shenqiChou(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //任务开启_开宝箱次数
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook("110", count);
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.addHook("110", count);
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "110", count);
    //开服活动
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "110", count);
    //机缘活动
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "110", count);
    //机缘活动
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "110", count);
    //合服庆典_任务
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "110", count, false);
    //兽灵起源
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "110", count);
    //鱼灵幻境
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "110", count);
    //破除心魔
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "110", count);
    //月宫探宝
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "110", count);
    //重阳出游
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "110", count);
    //化莲
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "110", count);
}
//升级神器
async function shenqiUplv(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("111", 1, false);
    await actTaskKindModel.addHook("161", count, true);
}
//通关主线
async function pvePass(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("112", 1, false);
    await actTaskKindModel.addHook("150", count, true);
    let actFuShiModel = ActFuShiModel_1.ActFuShiModel.getInstance(ctx, uuid);
    await actFuShiModel.addHook("536", count, true);
    //刷新关卡基金
    let hdGrowthFundModel5 = HdGrowthFundModel_1.HdGrowthFundModel.getInstance(ctx, uuid, "7");
    await hdGrowthFundModel5.backData_u(["red"]);
    //pve 冲榜
    let hdChongBangModel = HdChongBangModel_1.HdChongBangModel.getInstance(ctx, uuid, "1");
    await hdChongBangModel.addHook(count);
}
//通关主线
async function pvePk(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("113", 1, false);
    // //任务开启_进行主线战斗
    // let actTaskMainModel = ActTaskMainModel.getInstance(ctx, uuid);
    // await actTaskMainModel.addHook("113", 1);
    // //称号
    // let actChengHModel = ActChengHModel.getInstance(ctx, uuid);
    // await actChengHModel.addHook("113", 1);
    // //活动 - 限时活动 任务
    // await HdTimeActModel.hook(ctx, uuid, "113", 1);
    // //开服活动
    // await HdKaifugModel.hook(ctx, uuid, "113", 1);
    // //机缘活动
    // await HdJiYuanModel.hook(ctx, uuid, "113", 1);
}
//参与副本
async function pveJyPk(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("114", count, true);
}
//副本扫荡
async function pveJySd(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("115", count, false);
}
//竞技场挑战次数 无论胜败
async function jjcPk(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("120", count, false);
    //触发公会活跃值
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    await actClubModel.chuFaActive("4");
    //九龙秘宝
    let hdChouModel = HdChouModel_1.HdChouModel.getInstance(ctx, uuid, "2");
    await hdChouModel.hook();
    //任务开启_开宝箱次数
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook("190", count);
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.addHook("190", count);
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "190", count);
    //开服活动
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "190", count);
    //机缘活动
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "190", count);
    //机缘活动
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "190", count);
    //合服庆典_任务
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "190", count, false);
    //兽灵起源
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "190", count);
    //鱼灵幻境
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "190", count);
    //破除心魔
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "190", count);
    //月宫探宝
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "190", count);
    //重阳出游
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "190", count);
    //化莲
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "190", count);
}
async function jjcScore(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("163", count, true);
}
//升级翅膀
async function chibangUpLv(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("132", count, false);
}
//升阶翅膀
async function chibangUpStep(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("133", count, false);
}
//魔法阵升级
async function fazhenUpLv(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("134", count, false);
}
//魔法阵炼金
async function fazhenLianJin(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("135", count, false);
}
//刷新灵兽抽取{0}次
async function fazhenChou(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("168", count, false);
}
//召唤兽灵{0}次
async function fazhenZhao(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("173", 1, false);
}
//174	解锁起源空位{0}个
async function hdQiYuanOpen(ctx, count) {
    //起源活动内部自调 这边不放代码
}
//175	消耗起源仙尘{0}个
async function hdQiYuanUseItem1(ctx, count) {
    //起源活动内部自调 这边不放代码
}
//176	累积快速挂机{0}次
async function hdQiYuanQuick(ctx, count) {
    //起源活动内部自调 这边不放代码
}
//177	累积获取起源积分{0}分
async function hdQiYuanScore(ctx, count) {
    //起源活动内部自调 这边不放代码
}
//178	起源积分产量达到{0}分
async function hdQiYuanRate(ctx, count) {
    //起源活动内部自调 这边不放代码
}
//商店购买(魔法三大商店)
async function shopBuy3(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    let kind = "139";
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook(kind, count, false);
}
//累计充值金额
async function chongzhi(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("140", 1, false); //计算次数
    //任务开启_累计充值次数
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook("141", 1); //今日累计充值
    await actTaskMainModel.addHook("142", 1); //本周累计充值
    await actTaskMainModel.addHook("164", count); //累积充值{0}元
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.addHook("141", 1);
    await actChengHModel.addHook("142", 1);
    await actChengHModel.addHook("164", count); //累积充值{0}元
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "141", 1);
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "142", 1);
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "164", count); //累积充值{0}元
    //开服活动
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "141", 1);
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "142", 1);
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "164", count); //累积充值{0}元
    //机缘活动
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "141", 1);
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "142", 1);
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "164", count);
    //机缘活动
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "141", 1);
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "142", 1);
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "164", count);
    //合服庆典_任务
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "141", 1, false);
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "142", 1, false);
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "164", count, false);
    //兽灵起源
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "141", 1);
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "142", 1);
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "164", count);
    //鱼灵幻境
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "141", 1);
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "142", 1);
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "164", count);
    //破除心魔
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "141", 1);
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "142", 1);
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "164", count);
    //月宫探宝
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "141", 1);
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "142", 1);
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "164", count);
    //重阳出游
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "141", 1);
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "142", 1);
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "164", count);
    //化莲
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "141", 1);
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "142", 1);
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "164", count);
    //累计天数充值礼包
    await HdChargeDays_1.HdChargeDaysModel.hook(ctx, uuid, count);
    //累计充值礼包
    await HdChargeTotal_1.HdChargeTotalModel.hook(ctx, uuid, count);
    //天宫乐舞
    await HdTianGongModel_1.HdTianGongModel.hook(ctx, uuid, count);
    //设置是否充值
    let userModel = UserModel_1.UserModel.getInstance(ctx, uuid);
    await userModel.setIscz(count);
}
//每日登录
async function lodingdays(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //任务开启_每日登录
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook("137", 1);
    await actTaskMainModel.addHook("138", 1);
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.addHook("137", 1);
    await actChengHModel.addHook("138", 1);
    // //每日签到 //累计登录天数
    HdSignGiftModel_1.HdSignGiftModel.hook(ctx, ctx.state.master.getUuid());
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, ctx.state.master.getUuid(), "137", 1);
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, ctx.state.master.getUuid(), "138", 1);
    //开服活动
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "137", 1);
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "138", 1);
    //机缘活动
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "137", 1);
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "138", 1);
    //机缘活动
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "137", 1);
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "138", 1);
    //合服庆典_任务
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "137", 1, false);
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "138", 1, false);
    //兽灵起源
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "137", count);
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "138", count);
    //鱼灵幻境
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "137", count);
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "138", count);
    //破除心魔
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "137", count);
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "138", count);
    //月宫探宝
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "137", count);
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "138", count);
    //重阳出游
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "137", count);
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "138", count);
    //化莲
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "137", count);
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "138", count);
    //触发公会活跃值
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    await actClubModel.chuFaActive("1");
    //登陆
    tool_1.tool.maidian(ctx, 9900);
}
//矿场拉取自己物资次数
async function dongTianLqMy(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //任务开启_矿场拉取自己物资次数
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook("122", count);
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.addHook("122", count);
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "122", count);
    //开服活动
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "122", count);
    //机缘活动
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "122", count);
    //机缘活动
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "122", count);
    //合服庆典_任务
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "122", count, false);
    //兽灵起源
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "122", count);
    //鱼灵幻境
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "122", count);
    //破除心魔
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "122", count);
    //月宫探宝
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "122", count);
    //重阳出游
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "122", count);
    //化莲
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "122", count);
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("121", 1, false); //计算次数
    //触发公会活跃值
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    await actClubModel.chuFaActive("3");
    //九龙秘宝
    let hdChouModel = HdChouModel_1.HdChouModel.getInstance(ctx, uuid, "3");
    await hdChouModel.hook();
}
//矿场抢夺他人物资次数
async function dongTianLqF(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //任务开启_矿场抢夺他人物资次数
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook("123", count);
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.addHook("123", count);
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "123", count);
    //开服活动
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "123", count);
    //机缘活动
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "123", count);
    //机缘活动
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "123", count);
    //合服庆典_任务
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "123", count, false);
    //兽灵起源
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "123", count);
    //鱼灵幻境
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "123", count);
    //破除心魔
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "123", count);
    //月宫探宝
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "123", count);
    //重阳出游
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "123", count);
    //化莲
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "123", count);
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("121", 1, false); //计算次数
    //触发公会活跃值
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    await actClubModel.chuFaActive("3");
    //九龙秘宝
    let hdChouModel = HdChouModel_1.HdChouModel.getInstance(ctx, uuid, "3");
    await hdChouModel.hook();
    //聚宝盆
    await HdJuBaoPenModel_1.HdJuBaoPenModel.addHook(ctx, uuid);
}
//矿场刷新次数
async function dongTianRefresh(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("124", count, false);
}
//矿场刷新次数（自己）
async function dongTianRefreshMy(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("165", 1, false);
}
//矿场升级次数
async function dongTianUpLv(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("125", 1, false);
    //2级触发
    if (count == 2) {
        let hdXianshiModel = HdXianshiModel_1.HdXianshiModel.getInstance(ctx, uuid, "1");
        await hdXianshiModel.chufaHdcid_1();
    }
}
//矿场拉取神秘资源
async function dongTianPsecret(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //任务开启_
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook("143", count);
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.addHook("143", count);
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "143", count);
    //开服活动
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "143", count);
    //机缘活动
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "143", count);
    //机缘活动
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "143", count);
    //合服庆典_任务
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "143", count, false);
    //兽灵起源
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "143", count);
    //鱼灵幻境
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "143", count);
    //破除心魔
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "143", count);
    //月宫探宝
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "143", count);
    //重阳出游
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "143", count);
    //化莲
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "143", count);
}
//矿场拉取卡牌
async function dongTianPbox(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //任务开启
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook("144", count);
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "144", count);
}
//矿场拉取唤魔珠
async function dongTianPfzlv(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //任务开启_
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook("145", count);
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.addHook("145", count);
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "145", count);
    //开服活动
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "145", count);
    //机缘活动
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "145", count);
    //机缘活动
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "145", count);
    //合服庆典_任务
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "145", count, false);
    //兽灵起源
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "145", count);
    //鱼灵幻境
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "145", count);
    //破除心魔
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "145", count);
    //月宫探宝
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "145", count);
    //重阳出游
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "145", count);
    //化莲
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "145", count);
}
//矿场拉取钻石
async function dongTianPcash(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //任务开启_
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook("146", count);
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.addHook("146", count);
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "146", count);
    //开服活动
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "146", count);
    //机缘活动
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "146", count);
    //机缘活动
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "146", count);
    //合服庆典_任务
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "146", count, false);
    //兽灵起源
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "146", count);
    //鱼灵幻境
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "146", count);
    //破除心魔
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "146", count);
    //月宫探宝
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "146", count);
    //重阳出游
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "146", count);
    //化莲
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "146", count);
}
//矿场拉取金块
async function dongTianPdtlv(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //任务开启_
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook("147", count);
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.addHook("147", count);
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "147", count);
    //开服活动
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "147", count);
    //机缘活动
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "147", count);
    //机缘活动
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "147", count);
    //合服庆典_任务
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "147", count, false);
    //兽灵起源
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "147", count);
    //鱼灵幻境
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "147", count);
    //破除心魔
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "147", count);
    //月宫探宝
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "147", count);
    //重阳出游
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "147", count);
    //化莲
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "147", count);
}
//获得{0}个道童
async function dongTianDtNum(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("172", count, true);
}
//洞天拉取{0}次 拉取就算
async function dongTianlc(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("187", count, false);
}
//洞天拉取自己物资{0}次 拉取就算
async function dongTianlcMy(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("188", count, false);
}
//洞天抢夺他人物资{0}次 拉取就算
async function dongTianlcF(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("189", count, false);
}
//累计试炼次数
async function pveSlPk(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("116", count, false); //计算次数
}
//累计试炼达到最大层
async function pveSlMax(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("117", count, true);
    //触发公会活跃值
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    await actClubModel.chuFaActive("6");
    //刷新试炼基金
    let hdGrowthFundModel = HdGrowthFundModel_1.HdGrowthFundModel.getInstance(ctx, uuid, "3");
    await hdGrowthFundModel.backData_u(["red"]);
    //刷新试炼基金
    let hdGrowthFundModel6 = HdGrowthFundModel_1.HdGrowthFundModel.getInstance(ctx, uuid, "6");
    await hdGrowthFundModel6.backData_u(["red"]);
}
//累计获得试炼币次数
async function pveSlCoin(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("118", count, false);
}
//累计解锁试炼装备槽位次数
async function pveSlCao(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("119", count, false);
}
//累计获取宝石次数
async function stoneGet(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("126", count, false);
}
//累计镶嵌宝石次数
async function stoneXiangQian(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("127", count, false);
}
//累计更换宝石图纸次数
async function stoneGengHuan(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("128", count, false);
}
//累计合成宝石次数
async function stoneHeCheng(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("129", count, false);
}
//出售装备获得 {0} 铜钱
async function chushouGet1_2(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //任务开启_
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook("148", count);
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.addHook("148", count);
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "148", count);
    //开服活动
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "148", count);
    //机缘活动
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "148", count);
    //机缘活动
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "148", count);
    //合服庆典_任务
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "148", count, false);
    //兽灵起源
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "148", count);
    //鱼灵幻境
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "148", count);
    //破除心魔
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "148", count);
    //月宫探宝
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "148", count);
    //重阳出游
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "148", count);
    //化莲
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "148", count);
    let heid = setting_1.default.getQufus()[ctx.state.sid].heid;
    //活动 - 装备商人
    let cfgHdEquipShop = setting_1.default.getHuodong2(heid, "hdEquipShop");
    if (cfgHdEquipShop != null) {
        for (const hdcid in cfgHdEquipShop) {
            let hdEquipShopModel = HdEquipShopModel_1.HdEquipShopModel.getInstance(ctx, uuid, hdcid);
            await hdEquipShopModel.addCons(count);
        }
    }
}
async function fenjieGet1_62(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //任务开启_
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook("149", count);
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.addHook("149", count);
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "149", count);
    //开服活动
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "149", count);
    //机缘活动
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "149", count);
    //机缘活动
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "149", count);
    //合服庆典_任务
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "149", count, false);
    //兽灵起源
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "149", count);
    //鱼灵幻境
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "149", count);
    //破除心魔
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "149", count);
    //月宫探宝
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "149", count);
    //重阳出游
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "149", count);
    //化莲
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "149", count);
}
async function baoshiJihuo(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("160", count, true);
}
async function subItem1_1(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //触发公会活跃值
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    await actClubModel.chuFaActive("5", count);
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("171", count, false);
}
async function clubHelpHe(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //触发公会活跃值
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    await actClubModel.chuFaActive("7", count);
}
async function clubBossPk(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //触发公会活跃值
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(ctx, uuid);
    await actClubModel.chuFaActive("8", count);
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("170", 1, false);
}
async function fmUpLevel(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("131", 1, false);
    await actTaskKindModel.addHook("162", 1, false);
}
//装备附魔{0}次 总等级
async function fmUpLvAll(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("130", count, true);
}
//参加每日挑战{0}次
async function pvdPk(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("166", 1, false);
}
//运势占卜{0}次
async function zhanbuNum(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("169", 1, false);
}
//符石钓鱼触发任务 10W开头
async function fushiItem(ctx, count, kind) {
    let uuid = ctx.state.master.getUuid();
    //任务开启_
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook(kind, count);
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.addHook(kind, count);
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, kind, count);
    //开服活动
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, kind, count);
    //机缘活动
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, kind, count);
    //机缘活动
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, kind, count);
    //合服庆典_任务
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, kind, count, false);
    //兽灵起源
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, kind, count);
    //鱼灵幻境
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, kind, count);
    //破除心魔
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, kind, count);
    //月宫探宝
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, kind, count);
    //重阳出游
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, kind, count);
    //化莲
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, kind, count);
}
//179钓鱼刷新订单{0}次
async function fushiTaskRef(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //任务开启_
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook("179", count);
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.addHook("179", count);
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "179", count);
    //开服活动
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "179", count);
    //机缘活动
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "179", count);
    //机缘活动
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "179", count);
    //合服庆典_任务
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "179", count, false);
    //兽灵起源
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "179", count);
    //鱼灵幻境
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "179", count);
    //破除心魔
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "179", count);
    //月宫探宝
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "179", count);
    //重阳出游
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "179", count);
    //化莲
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "179", count);
}
//180消耗非面团鱼饵{0}个
async function fushiUseItem(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //任务开启_
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook("180", count);
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.addHook("180", count);
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "180", count);
    //开服活动
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "180", count);
    //机缘活动
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "180", count);
    //机缘活动
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "180", count);
    //合服庆典_任务
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "180", count, false);
    //兽灵起源
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "180", count);
    //鱼灵幻境
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "180", count);
    //破除心魔
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "180", count);
    //月宫探宝
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "180", count);
    //重阳出游
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "180", count);
    //化莲
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "180", count);
}
//181钓到白品以上的鱼
async function fushiItem_pz1(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //任务开启_
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook("181", count);
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.addHook("181", count);
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "181", count);
    //开服活动
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "181", count);
    //机缘活动
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "181", count);
    //机缘活动
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "181", count);
    //合服庆典_任务
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "181", count, false);
    //兽灵起源
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "181", count);
    //鱼灵幻境
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "181", count);
    //破除心魔
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "181", count);
    //月宫探宝
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "181", count);
    //重阳出游
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "181", count);
    //化莲
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "181", count);
}
//182	钓到绿品以上的鱼{0}条
async function fushiItem_pz2(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //任务开启_
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook("182", count);
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.addHook("182", count);
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "182", count);
    //开服活动
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "182", count);
    //机缘活动
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "182", count);
    //机缘活动
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "182", count);
    //合服庆典_任务
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "182", count, false);
    //兽灵起源
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "182", count);
    //鱼灵幻境
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "182", count);
    //破除心魔
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "182", count);
    //月宫探宝
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "182", count);
    //重阳出游
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "182", count);
    //化莲
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "182", count);
}
//183	钓到蓝色以上的鱼{0}条
async function fushiItem_pz3(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //任务开启_
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook("183", count);
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.addHook("183", count);
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "183", count);
    //开服活动
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "183", count);
    //机缘活动
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "183", count);
    //机缘活动
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "183", count);
    //合服庆典_任务
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "183", count, false);
    //兽灵起源
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "183", count);
    //鱼灵幻境
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "183", count);
    //破除心魔
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "183", count);
    //月宫探宝
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "183", count);
    //重阳出游
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "183", count);
    //化莲
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "183", count);
}
//184	钓到紫色以上的鱼{0}条
async function fushiItem_pz4(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //任务开启_
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook("184", count);
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.addHook("184", count);
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "184", count);
    //开服活动
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "184", count);
    //机缘活动
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "184", count);
    //机缘活动
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "184", count);
    //合服庆典_任务
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "184", count, false);
    //兽灵起源
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "184", count);
    //鱼灵幻境
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "184", count);
    //破除心魔
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "184", count);
    //月宫探宝
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "184", count);
    //重阳出游
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "184", count);
    //化莲
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "184", count);
}
//185	钓到橙色以上的鱼{0}条
async function fushiItem_pz6(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //任务开启_
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook("185", count);
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.addHook("185", count);
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "185", count);
    //开服活动
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "185", count);
    //机缘活动
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "185", count);
    //机缘活动
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "185", count);
    //合服庆典_任务
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "185", count, false);
    //兽灵起源
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "185", count);
    //鱼灵幻境
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "185", count);
    //破除心魔
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "185", count);
    //月宫探宝
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "185", count);
    //重阳出游
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "185", count);
    //化莲
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "185", count);
}
//186	完成订单达成{0}星
async function fushiTaskStar(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //任务开启_
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook("186", count);
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.addHook("186", count);
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "186", count);
    //开服活动
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "186", count);
    //机缘活动
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "186", count);
    //机缘活动
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "186", count);
    //合服庆典_任务
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "186", count, false);
    //兽灵起源
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "186", count);
    //鱼灵幻境
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "186", count);
    //破除心魔
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "186", count);
    //月宫探宝
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "186", count);
    //重阳出游
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "186", count);
    //化莲
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "186", count);
}
//192 分享次数
async function fenxiang(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //任务开启_
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook("192", count);
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.addHook("192", count);
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "192", count);
    //开服活动
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "192", count);
    //机缘活动
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "192", count);
    //机缘活动
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "192", count);
    //合服庆典_任务
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "192", count, false);
    //兽灵起源
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "192", count);
    //鱼灵幻境
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "192", count);
    //破除心魔
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "192", count);
    //月宫探宝
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "192", count);
    //重阳出游
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "192", count);
    //化莲
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "192", count);
}
//193 参加最强斗罗{0}次
async function joinDouLuo(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //任务开启_
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook("193", count);
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.addHook("193", count);
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "193", count);
    //开服活动
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "193", count);
    //机缘活动
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "193", count);
    //机缘活动
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "193", count);
    //合服庆典_任务
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "193", count, false);
    //兽灵起源
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "193", count);
    //鱼灵幻境
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "193", count);
    //破除心魔
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "193", count);
    //月宫探宝
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "193", count);
    //重阳出游
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "193", count);
    //化莲
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "193", count);
}
//194	剑灵淬炼{0}次
async function clUplevel(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //任务开启_
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook("194", count);
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.addHook("194", count);
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "194", count);
    //开服活动
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "194", count);
    //机缘活动
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "194", count);
    //机缘活动
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "194", count);
    //合服庆典_任务
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "194", count, false);
    //兽灵起源
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "194", count);
    //鱼灵幻境
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "194", count);
    //破除心魔
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "194", count);
    //月宫探宝
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "194", count);
    //重阳出游
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "194", count);
    //化莲
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "194", count);
}
//195	召唤{0}次仙侣
async function xlZhaohuan(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //任务开启_
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook("195", count);
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.addHook("195", count);
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "195", count);
    //开服活动
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "195", count);
    //机缘活动
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "195", count);
    //机缘活动
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "195", count);
    //合服庆典_任务
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "195", count, false);
    //兽灵起源
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "195", count);
    //鱼灵幻境
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "195", count);
    //破除心魔
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "195", count);
    //月宫探宝
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "195", count);
    //重阳出游
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "195", count);
    //化莲
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "195", count);
}
//196	升级{0}次仙侣
async function xlUpLevel(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //任务开启_
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook("196", count);
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.addHook("196", count);
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "196", count);
    //开服活动
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "196", count);
    //机缘活动
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "196", count);
    //机缘活动
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "196", count);
    //合服庆典_任务
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "196", count, false);
    //兽灵起源
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "196", count);
    //鱼灵幻境
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "196", count);
    //破除心魔
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "196", count);
    //月宫探宝
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "196", count);
    //重阳出游
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "196", count);
    //化莲
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "196", count);
}
//197	解锁区域{0}个（起源的五行区域，一共5个区域）
async function qyjiesuo(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //任务开启_
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook("197", count);
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.addHook("197", count);
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "197", count);
    //开服活动
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "197", count);
    //机缘活动
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "197", count);
    //机缘活动
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "197", count);
    //合服庆典_任务
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "197", count, false);
    //兽灵起源
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "197", count);
    //鱼灵幻境
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "197", count);
    //破除心魔
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "197", count);
    //月宫探宝
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "197", count);
    //重阳出游
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "197", count);
    //化莲
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "197", count);
}
//198	合成{0}次仙侣
async function xlUpHecheng(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //任务开启_
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook("198", count);
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.addHook("198", count);
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "198", count);
    //开服活动
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "198", count);
    //机缘活动
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "198", count);
    //机缘活动
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "198", count);
    //合服庆典_任务
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "198", count, false);
    //兽灵起源
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "198", count);
    //鱼灵幻境
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "198", count);
    //破除心魔
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "198", count);
    //月宫探宝
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "198", count);
    //重阳出游
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "198", count);
    //化莲
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "198", count);
}
//199	抽取命盘{0}次
async function wxchouqumingpan(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //任务开启_
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook("199", count);
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.addHook("199", count);
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "199", count);
    //开服活动
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "199", count);
    //机缘活动
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "199", count);
    //机缘活动
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "199", count);
    //合服庆典_任务
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "199", count, false);
    //兽灵起源
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "199", count);
    //鱼灵幻境
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "199", count);
    //破除心魔
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "199", count);
    //月宫探宝
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "199", count);
    //重阳出游
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "199", count);
    //化莲
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "199", count);
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("199", count, false);
}
//200	命盘境界达到第{0}境
async function wxmingpanLv(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("200", count, true);
}
//201	悟道开悟{0}次
async function wxkaiwunum(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //任务开启_
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook("201", count);
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.addHook("201", count);
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "201", count);
    //开服活动
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "201", count);
    //机缘活动
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "201", count);
    //机缘活动
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "201", count);
    //合服庆典_任务
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "201", count, false);
    //兽灵起源
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "201", count);
    //鱼灵幻境
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "201", count);
    //破除心魔
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "201", count);
    //月宫探宝
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "201", count);
    //重阳出游
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "201", count);
    //化莲
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "201", count);
}
//202	通关罗浮仙域{0}层
async function liudaomax(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("202", count, true);
}
//203	获得{0}本秘法
async function wxxfNum(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("203", count, true);
}
//204	累积抽取{0}次秘法
async function wxxfchou(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //任务开启_
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook("204", count);
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.addHook("204", count);
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "204", count);
    //开服活动
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "204", count);
    //机缘活动
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "204", count);
    //机缘活动
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "204", count);
    //合服庆典_任务
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "204", count, false);
    //兽灵起源
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "204", count);
    //鱼灵幻境
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "204", count);
    //破除心魔
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "204", count);
    //月宫探宝
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "204", count);
    //重阳出游
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "204", count);
    //化莲
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "204", count);
    //刷新角色基金
    let hdGrowthFundModel5 = HdGrowthFundModel_1.HdGrowthFundModel.getInstance(ctx, uuid, "8");
    await hdGrowthFundModel5.backData_u(["red"]);
}
//205	秘法提升至{0}级
async function wxxfaddLv(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //任务开启_
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook("205", count);
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.addHook("205", count);
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "205", count);
    //开服活动
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "205", count);
    //机缘活动
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "205", count);
    //机缘活动
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "205", count);
    //合服庆典_任务
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "205", count, false);
    //兽灵起源
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "205", count);
    //鱼灵幻境
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "205", count);
    //破除心魔
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "205", count);
    //月宫探宝
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "205", count);
    //重阳出游
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "205", count);
    //化莲
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "205", count);
}
//206	秘法镶嵌{0}个铭文
async function wxxfmwNum(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("206", count, true);
}
//207	获取{0}只精怪（获得几只）
async function jghasnum(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("207", count, true);
}
//208	召唤{0}次精怪（抽几次）
async function jgzhnum(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //任务开启_
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook("208", count);
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.addHook("208", count);
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "208", count);
    //开服活动
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "208", count);
    //机缘活动
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "208", count);
    //机缘活动
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "208", count);
    //合服庆典_任务
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "208", count, false);
    //兽灵起源
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "208", count);
    //鱼灵幻境
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "208", count);
    //破除心魔
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "208", count);
    //月宫探宝
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "208", count);
    //重阳出游
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "208", count);
    //化莲
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "208", count);
}
//209	升级{0}次精怪
async function jguplv(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //任务开启_
    let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(ctx, uuid);
    await actTaskMainModel.addHook("209", count);
    //称号
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(ctx, uuid);
    await actChengHModel.addHook("209", count);
    //活动 - 限时活动 任务
    await HdTimeActModel_1.HdTimeActModel.hook(ctx, uuid, "209", count);
    //开服活动
    await HdKaifuModel_1.HdKaifugModel.hook(ctx, uuid, "209", count);
    //机缘活动
    await HdJiYuanModel_1.HdJiYuanModel.hook(ctx, uuid, "209", count);
    //机缘活动
    await HdNewJiYuanModel_1.HdNewJiYuanModel.hook(ctx, uuid, "209", count);
    //合服庆典_任务
    await HdHefuqdModel_1.HdHefuqdModel.hook(ctx, uuid, "209", count, false);
    //兽灵起源
    await HdQiYuanModel_1.HdQiYuanModel.hook(ctx, uuid, "209", count);
    //鱼灵幻境
    await HdHuanJingModel_1.HdHuanJingModel.hook(ctx, uuid, "209", count);
    //破除心魔
    await HdXinMoModel_1.HdXinMoModel.hook(ctx, uuid, "209", count);
    //月宫探宝
    await HdYueGongModel_1.HdYueGongModel.hook(ctx, uuid, "209", count);
    //重阳出游
    await HdChongYangModel_1.HdChongYangModel.hook(ctx, uuid, "209", count);
    //化莲
    await HdHuaLianModel_1.HdHuaLianModel.hook(ctx, uuid, "209", count);
}
//210	上阵{0}只精怪（上阵几次）
async function jgsz(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("210", count, true);
}
//211	获得{0}个道友
async function dyhasnum(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("211", count, true);
}
//212	与道友切磋{0}次
async function dyqiecuo(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("212", count, false);
}
//213	道友赠礼{0}次
async function dyzengli(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("213", count, false);
}
//214	吞噬兽灵{0}次【兽灵】
async function fztushi(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("214", count, true);
}
//215	设置兽灵出战{0}次【兽灵】
async function fzchuzhan(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("215", count, true);
}
//216	完成道友委托{0}次
async function dyweituo(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("216", count, false);
}
//217	完成道友邀约{0}次
async function dyyaoyue(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("217", count, false);
}
//218	道友亲密提升{0}级
async function dyqinmidu(ctx, count) {
    let uuid = ctx.state.master.getUuid();
    //接收任务统计 从注册开始
    let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(ctx, uuid);
    await actTaskKindModel.addHook("218", count, false);
}
exports.hookNoteMap = {
    userLevel: userLevel,
    boxLevel: boxLevel,
    boxUpLevel: boxUpLevel,
    boxOpen: boxOpen,
    itemZhuLi: itemZhuLi,
    equipFenJie: equipFenJie,
    equipChuShou: equipChuShou,
    equipChuan: equipChuan,
    shenqiChou: shenqiChou,
    shenqiUplv: shenqiUplv,
    pvePass: pvePass,
    pvePk: pvePk,
    pveJyPk: pveJyPk,
    pveJySd: pveJySd,
    chibangUpLv: chibangUpLv,
    chibangUpStep: chibangUpStep,
    fazhenUpLv: fazhenUpLv,
    fazhenLianJin: fazhenLianJin,
    fazhenChou: fazhenChou,
    lodingdays: lodingdays,
    shopBuy3: shopBuy3,
    chongzhi: chongzhi,
    jjcPk: jjcPk,
    jjcScore: jjcScore,
    dongTianLqMy: dongTianLqMy,
    dongTianLqF: dongTianLqF,
    dongTianRefresh: dongTianRefresh,
    dongTianRefreshMy: dongTianRefreshMy,
    dongTianUpLv: dongTianUpLv,
    dongTianPsecret: dongTianPsecret,
    dongTianPbox: dongTianPbox,
    dongTianPfzlv: dongTianPfzlv,
    dongTianPcash: dongTianPcash,
    dongTianPdtlv: dongTianPdtlv,
    dongTianDtNum: dongTianDtNum,
    dongTianlc: dongTianlc,
    dongTianlcMy: dongTianlcMy,
    dongTianlcF: dongTianlcF,
    pveSlPk: pveSlPk,
    pveSlMax: pveSlMax,
    pveSlCoin: pveSlCoin,
    pveSlCao: pveSlCao,
    stoneGet: stoneGet,
    stoneXiangQian: stoneXiangQian,
    stoneGengHuan: stoneGengHuan,
    stoneHeCheng: stoneHeCheng,
    chushouGet1_2: chushouGet1_2,
    fenjieGet1_62: fenjieGet1_62,
    baoshiJihuo: baoshiJihuo,
    subItem1_1: subItem1_1,
    clubHelpHe: clubHelpHe,
    clubBossPk: clubBossPk,
    fmUpLevel: fmUpLevel,
    fmUpLvAll: fmUpLvAll,
    pvdPk: pvdPk,
    zhanbuNum: zhanbuNum,
    fazhenZhao: fazhenZhao,
    hdQiYuanOpen: hdQiYuanOpen,
    hdQiYuanUseItem1: hdQiYuanUseItem1,
    hdQiYuanQuick: hdQiYuanQuick,
    hdQiYuanScore: hdQiYuanScore,
    hdQiYuanRate: hdQiYuanRate,
    //符石钓鱼触发任务
    fushiItem: fushiItem,
    fushiTaskRef: fushiTaskRef,
    fushiUseItem: fushiUseItem,
    fushiItem_pz1: fushiItem_pz1,
    fushiItem_pz2: fushiItem_pz2,
    fushiItem_pz3: fushiItem_pz3,
    fushiItem_pz4: fushiItem_pz4,
    fushiItem_pz6: fushiItem_pz6,
    fushiTaskStar: fushiTaskStar,
    fenxiang: fenxiang,
    joinDouLuo: joinDouLuo,
    clUplevel: clUplevel,
    xlZhaohuan: xlZhaohuan,
    xlUpLevel: xlUpLevel,
    qyjiesuo: qyjiesuo,
    xlUpHecheng: xlUpHecheng,
    wxchouqumingpan: wxchouqumingpan,
    wxmingpanLv: wxmingpanLv,
    wxkaiwunum: wxkaiwunum,
    liudaomax: liudaomax,
    wxxfNum: wxxfNum,
    wxxfchou: wxxfchou,
    wxxfaddLv: wxxfaddLv,
    wxxfmwNum: wxxfmwNum,
    jghasnum: jghasnum,
    jgzhnum: jgzhnum,
    jguplv: jguplv,
    jgsz: jgsz,
    dyhasnum: dyhasnum,
    dyqiecuo: dyqiecuo,
    dyzengli: dyzengli,
    fztushi: fztushi,
    fzchuzhan: fzchuzhan,
    dyweituo: dyweituo,
    dyyaoyue: dyyaoyue,
    dyqinmidu: dyqinmidu,
};
//# sourceMappingURL=hook.js.map