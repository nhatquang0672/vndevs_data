"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActTaskKindModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const ActTaskMainModel_1 = require("./ActTaskMainModel");
const ActChengHModel_1 = require("./ActChengHModel");
const HdTimeActModel_1 = require("../hd/HdTimeActModel");
const ActEquipModel_1 = require("./ActEquipModel");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const HdKaifuModel_1 = require("../hd/HdKaifuModel");
const ActPvwModel_1 = require("./ActPvwModel");
const ActBaoShiModel_1 = require("./ActBaoShiModel");
const HdJiYuanModel_1 = require("../hd/HdJiYuanModel");
const HdHefuqdModel_1 = require("../hd/HdHefuqdModel");
const HdQiYuanModel_1 = require("../hd/HdQiYuanModel");
const HdHuanJingModel_1 = require("../hd/HdHuanJingModel");
const HdXinMoModel_1 = require("../hd/HdXinMoModel");
const HdNewJiYuanModel_1 = require("../hd/HdNewJiYuanModel");
const HdYueGongModel_1 = require("../hd/HdYueGongModel");
const HdHuaLianModel_1 = require("../hd/HdHuaLianModel");
const HdChongYangModel_1 = require("../hd/HdChongYangModel");
const ActDaoyouModel_1 = require("./ActDaoyouModel");
/**
 * 接收任务统计 从注册开始
 */
class ActTaskKindModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actTaskKind"; //用于存储key 和  输出1级key
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
            nids: {},
            bugver: 1,
            bugBs: 1
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        if (info.bugver != 2) {
            info.bugver = 2;
            let actPvwModel = ActPvwModel_1.ActPvwModel.getInstance(this.ctx, this.id);
            info.nids["117"] = (await actPvwModel.getInfo()).histMax;
            await this.update(info, [""]);
        }
        if (info.nids["215"] == null) {
            info.nids["215"] = 1;
        }
        if (info.nids["211"] == null) {
            info.nids["211"] = 1;
        }
        return info;
    }
    /**
     * 返回数据
     */
    async getOutPut() {
        let info = await this.getInfo();
        return info;
    }
    /**
     * 开启宝石获得推送
     */
    async jiesuoBaoshi() {
        let actTaskMainModel = await ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
        if (await actTaskMainModel.kaiqi("7400") == 1) {
            let info = await super.getInfo();
            if (info.bugBs != 4) {
                info.bugBs = 4;
                let actBaoShiModel = ActBaoShiModel_1.ActBaoShiModel.getInstance(this.ctx, this.id);
                let actBaoShi = await actBaoShiModel.getInfo();
                info.nids["160"] = Object.keys(actBaoShi.list).length;
                await this.update(info, [""]);
            }
        }
    }
    /**
     * 接收任务统计 从注册开始
     */
    async addHook(kind, count, isSet) {
        let info = await this.getInfo();
        if (info.nids[kind] == null) {
            info.nids[kind] = 0;
        }
        switch (kind) {
            case "102": //英雄累积升级到 %n 级
            case "103": //炉鼎升级 {0} 次
            case "104": //宝箱累积升级到 %n 级
            case "105": //使用加速券 %n 个
            case "107": //分解装备 %n 次
            case "111": //升级神器 %n 次
            case "112": //通关主线 %n 次
            case "113": //进行主线战斗{0}次
            case "114": //参与副本 %n 次
            case "115": //副本扫荡 %n 次
            case "116": //试炼 %n 次
            case "117": //试炼达到 %n 层
            case "118": //获得试炼币 %n 次
            case "119": //解锁试炼装备槽位 %n 次
            case "120": //斗法挑战 {0} 次
            case "121": //洞天拉取{0}次
            case "124": //洞天掠夺刷新{0}次
            case "125": //洞天升级 {0} 次
            case "126": //获取宝石 %n 次
            case "127": //镶嵌宝石 %n 次
            case "128": //更换宝石图纸 %n 次
            case "129": //合成宝石 %n 次
            case "130": //附魔 %n 次
            case "131": //升级附魔 %n 次
            case "132": //升级翅膀 %n 次
            case "133": //升阶翅膀 %n 次
            case "134": //魔法阵升级 %n 次
            case "135": //魔法阵炼金 %n 次
            case "136": //登录 %n 次
            case "139": //商店购买 %n 次
            case "140": //充值 %n 次
            case "150": //通过主线关卡 {0} 
            case "160": //累计激活 {0} 个星宿
            case "162": //附魔总等级达{0}
            case "165": //洞天刷新物资{0}次
            case "166": //参加每日挑战{0}次
            case "167": //兽灵炼魂领取{0}次
            case "168": //刷新灵兽抽取{0}次
            case "169": //运势占卜{0}次
            case "170": //参与仙盟BOSS{0}次
            case "171": //消耗灵石{0}次
            case "172": //获得{0}个道童
            case "173": //召唤兽灵{0}次
            case "187": //洞天拉取{0}次
            case "188": //洞天拉取自己物资{0}次
            case "189": //洞天抢夺他人物资{0}次
            case "199": //抽取命盘{0}次
            case "200": //命盘境界达到第{0}境
            case "202": //通关罗浮仙域{0}层
            case "203": //获得{0}本秘法
            case "206": //秘法镶嵌{0}个铭文
            case "207": //获取{0}只精怪
            case "210": //上阵{0}只精怪
            case "211": //获得{0}个道友
            case "212": //与道友切磋{0}次
            case "213": //道友赠礼{0}次
            case "214": //吞噬兽灵{0}次
            case "215": //兽灵上阵{0}次
            case "216": //完成道友委托{0}次
            case "217": //完成道友邀约{0}次
            case "218": //道友亲密提升{0}级
                if (isSet) {
                    info.nids[kind] = count;
                }
                else {
                    info.nids[kind] += count;
                }
                break;
            // case "109": //穿戴装备 %n 件
            case "151": //穿着 {0} 件 1-9品质装备
                info.nids["109"] = await this.getKind151(1);
                info.nids["151"] = await this.getKind151(1);
                info.nids["152"] = await this.getKind151(2);
                info.nids["153"] = await this.getKind151(3);
                info.nids["154"] = await this.getKind151(4);
                info.nids["155"] = await this.getKind151(5);
                info.nids["156"] = await this.getKind151(6);
                info.nids["157"] = await this.getKind151(7);
                info.nids["158"] = await this.getKind151(8);
                info.nids["159"] = await this.getKind151(9);
                break;
            case "161": //最高法器等级为{0}级
            case "163": //斗法积分达到{0}
                if (info.nids[kind] == null) {
                    info.nids[kind] = 0;
                }
                info.nids[kind] = Math.max(info.nids[kind], count);
                break;
            default:
                return;
        }
        await this.update(info);
        let kinds = [kind];
        if (kind == "151") {
            kinds.push("109");
            kinds.push("152");
            kinds.push("153");
            kinds.push("154");
            kinds.push("155");
            kinds.push("156");
            kinds.push("157");
            kinds.push("158");
            kinds.push("159");
        }
        let actTaskMainModel = ActTaskMainModel_1.ActTaskMainModel.getInstance(this.ctx, this.id);
        let actChengHModel = ActChengHModel_1.ActChengHModel.getInstance(this.ctx, this.id);
        for (const _kind of kinds) {
            //刷新主线任务
            await actTaskMainModel.refreshHook(_kind, info.nids[_kind]);
            //刷新称号任务
            await actChengHModel.refreshHook(_kind, info.nids[_kind]);
            //限时活动_任务
            await HdTimeActModel_1.HdTimeActModel.refreHook(this.ctx, this.id, _kind, info.nids[_kind]);
            //开服活动_任务
            await HdKaifuModel_1.HdKaifugModel.refreHook(this.ctx, this.id, _kind, info.nids[_kind]);
            //机缘活动_任务  - 特殊处理  历史统计 也转为 活动开启累计
            await HdJiYuanModel_1.HdJiYuanModel.refreHook(this.ctx, this.id, _kind, count, isSet);
            //机缘活动_任务  - 特殊处理  历史统计 也转为 活动开启累计
            await HdNewJiYuanModel_1.HdNewJiYuanModel.refreHook(this.ctx, this.id, _kind, count, isSet);
            //合服庆典_任务  - 特殊处理  历史统计 也转为 活动开启累计
            await HdHefuqdModel_1.HdHefuqdModel.hook(this.ctx, this.id, _kind, count, isSet);
            //兽灵起源  - 特殊处理  历史统计 也转为 活动开启累计
            await HdQiYuanModel_1.HdQiYuanModel.hook(this.ctx, this.id, _kind, count, isSet ? 'set' : 'add');
            //鱼灵幻境  - 特殊处理  历史统计 也转为 活动开启累计
            await HdHuanJingModel_1.HdHuanJingModel.hook(this.ctx, this.id, _kind, count); //,isSet?'set':'add'
            //破除心魔  - 特殊处理  历史统计 也转为 活动开启累计
            await HdXinMoModel_1.HdXinMoModel.hook(this.ctx, this.id, _kind, count); //,isSet?'set':'add'
            //月宫探宝
            await HdYueGongModel_1.HdYueGongModel.hook(this.ctx, this.id, _kind, count, isSet);
            //重阳出游
            await HdChongYangModel_1.HdChongYangModel.hook(this.ctx, this.id, _kind, count, isSet);
            //化莲
            await HdHuaLianModel_1.HdHuaLianModel.hook(this.ctx, this.id, _kind, count, isSet);
        }
        let actDaoyouModel = ActDaoyouModel_1.ActDaoyouModel.getInstance(this.ctx, this.id);
        await actDaoyouModel.checkTask(info.nids);
    }
    /**
     * 穿着 {0} 件 {0} 品质装备
     * @param ppz 需要的品质
     */
    async getKind151(ppz) {
        let actEquipModel = ActEquipModel_1.ActEquipModel.getInstance(this.ctx, this.id);
        let actEquip = await actEquipModel.getInfo();
        let outf = 0;
        for (const buwei in actEquip.chuan) {
            if (actEquip.chuan[buwei].equipId == "" || actEquip.chuan[buwei].equipId == null) {
                continue;
            }
            let cfgEquip = gameCfg_1.default.equipInfo.getItem(actEquip.chuan[buwei].equipId);
            if (cfgEquip == null) {
                continue;
            }
            if (cfgEquip.pinzhi >= ppz) {
                outf += 1;
            }
        }
        return outf;
    }
}
exports.ActTaskKindModel = ActTaskKindModel;
//# sourceMappingURL=ActTaskKindModel.js.map