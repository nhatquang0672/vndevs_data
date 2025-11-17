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
const tool_1 = require("../../src/util/tool");
const UserModel_1 = require("../../src/model/user/UserModel");
const game_1 = __importDefault(require("../../src/util/game"));
const ActEquipModel_1 = require("../../src/model/act/ActEquipModel");
const gameCfg_1 = __importDefault(require("../../common/gameCfg"));
const ActChengHModel_1 = require("../../src/model/act/ActChengHModel");
const ActChiBangModel_1 = require("../../src/model/act/ActChiBangModel");
const ActFazhenModel_1 = require("../../src/model/act/ActFazhenModel");
const ActShengQiModel_1 = require("../../src/model/act/ActShengQiModel");
const ActBaoShiModel_1 = require("../../src/model/act/ActBaoShiModel");
const RdsUserModel_1 = require("../../src/model/redis/RdsUserModel");
const ActClubModel_1 = require("../../src/model/act/ActClubModel");
const SevClubModel_1 = require("../../src/model/sev/SevClubModel");
const ActPveInfoModel_1 = require("../../src/model/act/ActPveInfoModel");
const ActPveJyModel_1 = require("../../src/model/act/ActPveJyModel");
const setting_1 = __importDefault(require("../../src/crontab/setting"));
router.prefix('/s_playerKsh');
router.all('/:token', async (ctx) => {
    let { uuid } = tool_1.tool.getParamsAdmin(ctx);
    if (uuid == null || uuid == "") {
        let back = await s_game_1.default.allOut(ctx, []);
        await ctx.render('a_playerKsh', back);
        return;
    }
    let zsxx = [];
    let adminCtx = await tool_1.tool.ctxCreate('user', uuid);
    //角色基础信息
    let fuserModel = UserModel_1.UserModel.getInstance(adminCtx, uuid);
    let fuser = await fuserModel.getInfo();
    if (fuser.uid == "") {
        let back = await s_game_1.default.allOut(ctx, zsxx, { uuid: uuid, msg: "用户不存在" });
        ctx.render('a_playerKsh', back);
        return;
    }
    await setting_1.default.createCash(game_1.default.getToDay_0(), game_1.default.getNowTime(), false);
    let status = "正常";
    if (setting_1.default.isBan(fuser.uuid, "1", game_1.default.getNowTime()) == true) {
        status = "禁言";
    }
    if (setting_1.default.isBan(fuser.uuid, "2", game_1.default.getNowTime()) == true) {
        status = "封角色";
    }
    if (setting_1.default.isBan(fuser.uid, "3", game_1.default.getNowTime()) == true) {
        status = "封号";
    }
    zsxx.push(["", "", "", "基础信息", "", "", ""]);
    zsxx.push(["角色ID：", fuser.uuid, "状态：", status, "", "", ""]);
    zsxx.push(["账号ID：", fuser.uid, "", "", "", "", ""]);
    zsxx.push(["区服：", fuser.sid, "", "", "", "", ""]);
    zsxx.push(["名字：", fuser.name, "", "", "", "", ""]);
    zsxx.push(["等级：", fuser.level, "充值金额：", fuser.iscz, "", "", ""]);
    zsxx.push(["最后一次登录时间：", game_1.default.getTimeS(fuser.lastlogin), "", "", "", "", ""]);
    zsxx.push(["注册时间：", game_1.default.getTimeS(fuser.regtime), "", "", "", "", ""]);
    //斗法信息
    let heid = setting_1.default.getHeid(fuser.sid);
    let rdsUserModel = await new RdsUserModel_1.RdsUserModel("rdsJjc", 'x', heid, tool_1.tool.jjcWeekId(game_1.default.getNowTime()));
    let score = Math.ceil(parseFloat(await rdsUserModel.zScore(uuid)));
    let _myr = await rdsUserModel.zRevrank(uuid);
    zsxx.push(["斗法当前排名：", _myr == null ? "未上榜" : _myr + 1, "斗法当前积分：", score == null ? "未上榜" : score, "", "", ""]);
    //公会信息
    let actClubModel = ActClubModel_1.ActClubModel.getInstance(adminCtx, uuid);
    let actClub = await actClubModel.getInfo();
    if (actClub.clubId != "") {
        let sevClubModel = SevClubModel_1.SevClubModel.getInstance(adminCtx, actClub.clubId);
        let sevClub = await sevClubModel.getInfo();
        zsxx.push(["仙盟ID：", actClub.clubId, sevClub.name, "", "", "", ""]);
    }
    else {
        zsxx.push(["仙盟ID：", actClub.clubId, "", "", "", "", ""]);
    }
    //pve信息
    let actPveInfoModel = ActPveInfoModel_1.ActPveInfoModel.getInstance(adminCtx, uuid);
    let actPveInfo = await actPveInfoModel.getInfo();
    let pveName = "已通关";
    let cfgPve = gameCfg_1.default.pveInfo.getItem(actPveInfo.id.toString());
    if (cfgPve != null) {
        pveName = cfgPve.name;
    }
    zsxx.push(["当前在打的关卡：", actPveInfo.id, pveName, "", "", "", ""]);
    //pve精英信息
    let actPveJyModel = ActPveJyModel_1.ActPveJyModel.getInstance(adminCtx, uuid);
    let actPveJy = await actPveJyModel.getInfo();
    let pvjyName = "已通关";
    let cfgPvjy = gameCfg_1.default.pveJingying.getItem(actPveJy.id.toString());
    if (cfgPvjy != null) {
        pvjyName = cfgPvjy.name;
    }
    zsxx.push(["当前在打的精英关卡：", actPveJy.id, pvjyName, "今日已扫荡次数：", actPveJy.sdNum, "", ""]);
    //装备信息
    let actEquipModel = ActEquipModel_1.ActEquipModel.getInstance(adminCtx, uuid);
    let actEquip = await actEquipModel.getInfo();
    zsxx.push(["", "", "", "装备信息", "", "", ""]);
    zsxx.push(["剩余宝箱数量：", actEquip.box, "", "", "", "", ""]);
    zsxx.push(["开箱获得战旗：", actEquip.jjc, "", "", "", "", ""]);
    for (const buwei in actEquip.chuan) {
        if (actEquip.chuan[buwei].equipId == "") {
            continue;
        }
        let cfgEquip = gameCfg_1.default.equipInfo.getItem(actEquip.chuan[buwei].equipId);
        if (cfgEquip == null) {
            continue;
        }
        zsxx.push([
            cfgEquip.name,
            `部位：${cfgEquip.buwei}`,
            `品质：${cfgEquip.pinzhi}`,
            `等级：${actEquip.chuan[buwei].level}`,
            `默认皮肤：${actEquip.chuan[buwei].mrhh}`,
            `(优先)幻化皮肤：${actEquip.chuan[buwei].hh}`,
            `附魔等级：${actEquip.chuan[buwei].fmLv}`,
        ]);
    }
    //称号信息
    let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(adminCtx, uuid);
    let actChengH = await actChengHModel.getInfo();
    zsxx.push(["", "", "", "称号信息", "", "", ""]);
    for (const chid in actChengH.list) {
        let cfgCh = gameCfg_1.default.chenghaoInfo.getItem(chid);
        if (cfgCh == null) {
            continue;
        }
        let gqsj = "永久";
        if (actChengH.list[chid].at > 0) {
            gqsj = game_1.default.getTimeS(fuser.regtime);
        }
        if (chid == actChengH.chuan) {
            zsxx.push([chid, cfgCh.name, gqsj, "穿戴", "", "", ""]);
        }
        else {
            zsxx.push([chid, cfgCh.name, gqsj, "", "", "", ""]);
        }
    }
    //翅膀信息
    let actChiBangModel = ActChiBangModel_1.ActChiBangModel.getInstance(adminCtx, uuid);
    let actChiBang = await actChiBangModel.getInfo();
    zsxx.push(["", "", "", "剑灵信息", "", "", ""]);
    for (const _hh of actChiBang.hhList) {
        let cfgCbInfo = gameCfg_1.default.chibangInfo.getItem(_hh);
        if (cfgCbInfo != null) {
            if (actChiBang.hh == _hh) {
                zsxx.push(["拥有:", _hh, cfgCbInfo.name, "已佩戴", "", "", ""]);
            }
            else {
                zsxx.push(["拥有:", _hh, cfgCbInfo.name, "", "", "", ""]);
            }
        }
    }
    let cfgCbLv = gameCfg_1.default.chibangLevel.getItem(actChiBang.id.toString());
    if (cfgCbLv != null) {
        zsxx.push(["当前阶级：", cfgCbLv.step, "当前等级：", cfgCbLv.level, "当前进度：", actChiBang.exp, ""]);
    }
    //法阵信息
    let actFazhenModel = ActFazhenModel_1.ActFazhenModel.getInstance(adminCtx, uuid);
    let actFazhen = await actFazhenModel.getInfo();
    zsxx.push(["", "", "", "兽灵信息", "", "", ""]);
    zsxx.push(["普通已抽取次数:", actFazhen.pt, "", "", "", "", ""]);
    zsxx.push(["普通保底已抽取次数:", actFazhen.ptBaodi, "", "", "", "", ""]);
    // zsxx.push(["普通保底特权已经抽取次数:",actFazhen.pttqBaodi,"","","","",""])
    zsxx.push(["高级已经抽取次数:", actFazhen.gj, "", "", "", "", ""]);
    zsxx.push(["高级保底已经抽取次数:", actFazhen.gjBaodi, "", "", "", "", ""]);
    let cfgInfo = gameCfg_1.default.fazhenInfo.getItem(actFazhen.cqId);
    if (cfgInfo != null) {
        let msg1 = "未购买";
        if (actFazhen.cqType == 1) {
            msg1 = "已购买";
        }
        zsxx.push(["当前抽取到的兽灵Id：", actFazhen.cqId, "名字：", cfgInfo.name, msg1, "", ""]);
    }
    for (const gzId in actFazhen.list) {
        if (actFazhen.list[gzId].fzid == "") {
            continue;
        }
        let cfgFzInfo1 = gameCfg_1.default.fazhenInfo.getItem(actFazhen.list[gzId].fzid);
        if (cfgFzInfo1 == null) {
            continue;
        }
        let cfgFzLv1 = gameCfg_1.default.fazhenLevel.getItem(actFazhen.list[gzId].saveId.toString());
        if (cfgFzLv1 == null) {
            continue;
        }
        let chuzhan = "";
        if (gzId == actFazhen.useGzId) {
            chuzhan = "出战中...";
        }
        zsxx.push([
            `格子ID：${gzId}`,
            `兽灵ID：${actFazhen.list[gzId].fzid}`,
            cfgFzInfo1.name,
            `当前阶级：${cfgFzLv1.showStep}`,
            `当前等级：${cfgFzLv1.showLv}`,
            `当前进度：${cfgFzLv1.showJd}`,
            chuzhan
        ]);
    }
    zsxx.push(["炼金可收益数量:", actFazhen.shouyiNum, "", "", "", "", ""]);
    //圣器信息
    let actShengQiModel = ActShengQiModel_1.ActShengQiModel.getInstance(adminCtx, uuid);
    let actShengQi = await actShengQiModel.getInfo();
    zsxx.push(["", "", "", "圣器信息", "", "", ""]);
    zsxx.push(["今日已抽取次数:", actShengQi.cons, "", "", "", "", ""]);
    zsxx.push(["拥有万能碎片:", actShengQi.chip, "", "", "", "", ""]);
    let cname = "";
    if (actShengQi.chuan != "") {
        let cfgSq = gameCfg_1.default.shengqiInfo.getItem(actShengQi.chuan);
        if (cfgSq != null) {
            cname = cfgSq.name;
        }
    }
    zsxx.push(["穿戴圣器ID:", actShengQi.chuan, cname, "", "", "", ""]);
    for (const sqId in actShengQi.list) {
        let cfgSq1 = gameCfg_1.default.shengqiInfo.getItem(sqId);
        if (cfgSq1 != null) {
            zsxx.push([
                "拥有圣器:",
                sqId,
                cfgSq1.name,
                `当前等级：${actShengQi.list[sqId].level}`,
                `当前进度：${actShengQi.list[sqId].exp}`,
                "", ""
            ]);
        }
    }
    //宝石信息
    let actBaoShiModel = ActBaoShiModel_1.ActBaoShiModel.getInstance(adminCtx, uuid);
    let actBaoShi = await actBaoShiModel.getInfo();
    zsxx.push(["", "", "", "星宿信息", "", "", ""]);
    for (const xtId in actBaoShi.list) {
        let cfgBs = gameCfg_1.default.baoshiInfo.getItem(xtId);
        if (cfgBs != null) {
            zsxx.push(["星图:", xtId, cfgBs.name, "当前等级：", actBaoShi.list[xtId].level, "", ""]);
        }
    }
    for (const key in actBaoShi.tssx) {
        let msg2 = "未解锁";
        if (actBaoShi.tssx[key] == 1) {
            msg2 = "已解锁";
        }
        if (actBaoShi.tssx[key] == 2) {
            msg2 = "使用中...";
        }
        let cfgUep = gameCfg_1.default.userEp.getItem(key);
        if (cfgUep != null) {
            zsxx.push(["特殊属性:", key, cfgUep.name, msg2, "", "", ""]);
        }
    }
    for (const key in actBaoShi.tskx) {
        let msg2 = "未解锁";
        if (actBaoShi.tssx[key] == 1) {
            msg2 = "已解锁";
        }
        if (actBaoShi.tssx[key] == 2) {
            msg2 = "使用中...";
        }
        let cfgUep = gameCfg_1.default.userEp.getItem(key);
        if (cfgUep != null) {
            zsxx.push(["特殊抗性:", key, cfgUep.name, msg2, "", "", ""]);
        }
    }
    //符石信息
    // let actFuShiModel = ActFuShiModel.getInstance(adminCtx,uuid)
    // let actFuShi = await actFuShiModel.getInfo()
    // zsxx.push(["","","","符石信息","","",""])
    // zsxx.push(["当前点数:",actFuShi.tili.con,"","","","",""])
    // fsku:{  //符石库
    //     level:number  //当前等级
    //     exp:number   //当前完成进度
    //     upType:number  //0:未进阶  1：进阶中
    //     endAt:number  //完成进阶截止时间
    //     list:{
    //         [leibie:string]:{
    //             [wzid:string]:{ //等级一到这边会解锁位置
    //                 itemid:string
    //                 pf:number  //评分
    //                 eps:{[key:string]:number}  //主角属性
    //             } 
    //         }
    //     }
    // }
    // task:{   //任务
    //     [xbId:string]:{
    //         taskId:string  //任务ID
    //         con:number //已经完成进度
    //         rwd:number  //0不能领取1可领取2已领取
    //     }
    // }
    // shouce:{  //手册
    //     id:number  //手册已经解锁到第几本
    //     hook:{ //下一本完成进度
    //         [taskId:string]:number
    //     }
    //     useId:number  //当前使用的手册ID
    // }
    // tujian:{//图鉴
    //     [itemId:string]:number  //道具ID：红点
    // }  
    // nowId:string  //当前使用的灵石ID 默认"1000"
    // //祭坛
    // jitan:{
    //     [id:string]:{ //1纳灵2灵焰3神像4灵基
    //         saveid:number  //等级
    //         cons:number  //任务进度
    //         epList:{ //附灵祭坛属性
    //             [xhid:string]:{ //序号ID
    //                 lock:number  //是否上锁 0没有1上锁
    //                 ep:[string,number]  //属性key 属性值
    //             }
    //         }
    //         useType:number   //1道具2钻石
    //         linshi:{ //临时
    //             [xhid:string]:[string,number]  //属性key 属性值
    //         }
    //     }
    // }
    // actFuShi: { a: actFuShi },   //符石
    let back = await s_game_1.default.allOut(ctx, zsxx, { uuid: uuid });
    ctx.render('a_playerKsh', back);
});
//# sourceMappingURL=s_playerKsh.js.map