"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tool_1 = require("../util/tool");
const ActEquipModel_1 = require("../model/act/ActEquipModel");
const ActChiBangModel_1 = require("../model/act/ActChiBangModel");
const ActBoxModel_1 = require("../model/act/ActBoxModel");
const UserModel_1 = require("../model/user/UserModel");
const ActEquipFangAnModel_1 = require("../model/act/ActEquipFangAnModel");
const router = new koa_router_1.default();
exports.router = router;
router.prefix('/equip');
/**
 * @api {post} /equip/openBox 开宝箱
 * @apiName 开宝箱
 * @apiGroup equip
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all('/openBox', async (ctx) => {
    ctx.state.apidesc = "装备-开宝箱";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actEquipModel = ActEquipModel_1.ActEquipModel.getInstance(ctx, uuid);
    await actEquipModel.openBoxNew1();
});
/**
 * @api {post} /equip/openBox95 新版开宝箱95
 * @apiName 新版开宝箱95
 * @apiGroup equip
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {number} needNum 开宝箱个数
 *
 */
router.all('/openBox95', async (ctx) => {
    ctx.state.apidesc = "装备-新版开宝箱95";
    const { uuid, needNum } = tool_1.tool.getParams(ctx);
    let actEquipModel = ActEquipModel_1.ActEquipModel.getInstance(ctx, uuid);
    await actEquipModel.openBox95(needNum);
    if (needNum == 1) {
        await actEquipModel.xuanzhong("1");
    }
});
/**
 * @api {post} /equip/loopBox95 新版宝箱循环开启95
 * @apiName 新版宝箱循环开启95
 * @apiGroup equip
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {number} isOpen 0关1开
 * @apiParam {number} needNum 开宝箱个数
 *
 */
router.all('/loopBox95', async (ctx) => {
    ctx.state.apidesc = "装备-新版宝箱循环开启95";
    const { uuid, isOpen, needNum } = tool_1.tool.getParams(ctx);
    let actBoxModel = ActBoxModel_1.ActBoxModel.getInstance(ctx, uuid);
    let actBox = await actBoxModel.getInfo();
    let actEquipModel = ActEquipModel_1.ActEquipModel.getInstance(ctx, uuid);
    let actEquip = await actEquipModel.getInfo();
    for (const xbid in actEquip.linshi95) {
        if (actBox.bType == 1) {
            await actEquipModel.fenjie95(xbid);
        }
        else {
            await actEquipModel.chushou95(xbid);
        }
    }
    if (isOpen == 1) {
        await actEquipModel.openBox95(Math.min(needNum, actEquip.box));
        if (needNum == 1) {
            await actEquipModel.xuanzhong("1");
        }
    }
});
/**
 * @api {post} /equip/xuanzhong 新版选中装备95
 * @apiName 新版选中装备95
 * @apiGroup equip
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} xbid linshi95的xbid
 *
 */
router.all('/xuanzhong', async (ctx) => {
    ctx.state.apidesc = "装备-新版选中装备95";
    const { uuid, xbid } = tool_1.tool.getParams(ctx);
    let actEquipModel = ActEquipModel_1.ActEquipModel.getInstance(ctx, uuid);
    await actEquipModel.xuanzhong(xbid);
});
/**
 * @api {post} /equip/deal95 新版装备处理掉95
 * @apiName 新版装备处理掉95
 * @apiGroup equip
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} xbid linshi95的xbid
 *
 */
router.all('/deal95', async (ctx) => {
    ctx.state.apidesc = "装备-新版装备处理掉95";
    const { uuid, xbid } = tool_1.tool.getParams(ctx);
    let actBoxModel = ActBoxModel_1.ActBoxModel.getInstance(ctx, uuid);
    let actBox = await actBoxModel.getInfo();
    let actEquipModel = ActEquipModel_1.ActEquipModel.getInstance(ctx, uuid);
    await actEquipModel.zhuangbei(xbid);
    if (actBox.mType == 1) {
        await actEquipModel.fenjie95(xbid);
    }
    else {
        await actEquipModel.chushou95(xbid);
    }
});
/**
 * @api {post} /equip/dealAll95 新版装备处理掉所有
 * @apiName 新版装备处理掉所有
 * @apiGroup equip
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {number} mType 1分解2出售
 *
 */
router.all('/dealAll95', async (ctx) => {
    ctx.state.apidesc = "装备-新版装备处理掉所有";
    const { uuid, mType } = tool_1.tool.getParams(ctx);
    let actEquipModel = ActEquipModel_1.ActEquipModel.getInstance(ctx, uuid);
    let actEquip = await actEquipModel.getInfo();
    for (const xbid in actEquip.linshi95) {
        if (mType == 1) {
            await actEquipModel.fenjie95(xbid);
        }
        else {
            await actEquipModel.chushou95(xbid);
        }
    }
});
/**
 * @api {post} /equip/loopBox 宝箱循环开启
 * @apiName 宝箱循环开启
 * @apiGroup equip
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {number} isOpen 0关1开
 *
 */
router.all('/loopBox', async (ctx) => {
    ctx.state.apidesc = "装备-宝箱循环开启";
    const { uuid, isOpen } = tool_1.tool.getParams(ctx);
    let actBoxModel = ActBoxModel_1.ActBoxModel.getInstance(ctx, uuid);
    let actBox = await actBoxModel.getInfo();
    let actEquipModel = ActEquipModel_1.ActEquipModel.getInstance(ctx, uuid);
    if (actBox.bType == 1) {
        await actEquipModel.fenjie();
    }
    else {
        await actEquipModel.chushou();
    }
    if (isOpen == 1) {
        await actEquipModel.openBoxNew1();
    }
});
/**
 * @api {post} /equip/tihuan 装备替换
 * @apiName 装备替换
 * @apiGroup equip
 *
 * @apiParam {string} uuid  角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {number} type  1立即替换+装备+卖掉
 * @apiParam {string} xbid linshi95的xbid
 *
 */
router.all('/tihuan', async (ctx) => {
    ctx.state.apidesc = "pkFirst-装备替换";
    const { uuid, type, xbid } = tool_1.tool.getParams(ctx);
    let actEquipModel = ActEquipModel_1.ActEquipModel.getInstance(ctx, uuid);
    await actEquipModel.tihuan();
    if (type == 1) {
        await actEquipModel.zhuangbei(xbid);
        let actEquip = await actEquipModel.getInfo();
        if (actEquip.linshi.equipId != "") {
            let actBoxModel = ActBoxModel_1.ActBoxModel.getInstance(ctx, uuid);
            let actBox = await actBoxModel.getInfo();
            if (actBox.mType == 1) {
                await actEquipModel.fenjie95(xbid);
            }
            else {
                await actEquipModel.chushou95(xbid);
            }
        }
    }
});
/**
 * @api {post} /equip/deal 装备处理掉
 * @apiName 装备处理掉
 * @apiGroup equip
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all('/deal', async (ctx) => {
    ctx.state.apidesc = "pkFirst-装备处理掉";
    ctx.throw("api_deal弃用");
    // const {uuid} = tool.getParams(ctx)
    // let actBoxModel = ActBoxModel.getInstance(ctx,uuid)
    // let actBox = await actBoxModel.getInfo()
    // let actEquipModel = ActEquipModel.getInstance(ctx,uuid)
    // await actEquipModel.zhuangbei()
    // let actEquip = await actEquipModel.getInfo()
    // if(actEquip.linshi.equipId != ""){
    //     if(actBox.mType == 1){
    //         await actEquipModel.fenjie()
    //     }else{
    //         await actEquipModel.chushou()
    //     }
    // }
});
/**
 * @api {post} /equip/huanhua 幻化
 * @apiName 幻化
 * @apiGroup equip
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} buwei 部位
 * @apiParam {string} equipId 装备ID
 *
 */
router.all('/huanhua', async (ctx) => {
    ctx.state.apidesc = "pkFirst-幻化";
    const { uuid, buwei, equipId } = tool_1.tool.getParams(ctx);
    let actEquipModel = ActEquipModel_1.ActEquipModel.getInstance(ctx, uuid);
    await actEquipModel.huanhua(buwei, equipId);
});
/**
 * @api {post} /equip/delPifuRed 去掉皮肤红点
 * @apiName 去掉皮肤红点
 * @apiGroup equip
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} buwei 部位
 * @apiParam {string} hh 皮肤ID
 *
 */
router.all('/delPifuRed', async (ctx) => {
    ctx.state.apidesc = "pkFirst-去掉皮肤红点";
    const { uuid, buwei, hh } = tool_1.tool.getParams(ctx);
    let actEquipModel = ActEquipModel_1.ActEquipModel.getInstance(ctx, uuid);
    await actEquipModel.delPifuRed(buwei, hh);
});
/**
 * @api {post} /equip/delPifuRedAll 去掉皮肤部位红点
 * @apiName 去掉皮肤部位红点
 * @apiGroup equip
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all('/delPifuRedAll', async (ctx) => {
    ctx.state.apidesc = "pkFirst-去掉皮肤部位红点";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actEquipModel = ActEquipModel_1.ActEquipModel.getInstance(ctx, uuid);
    await actEquipModel.delPifuRedAll();
});
/**
 * @api {post} /equip/backMoRen 恢复默认
 * @apiName 恢复默认
 * @apiGroup equip
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all('/backMoRen', async (ctx) => {
    ctx.state.apidesc = "pkFirst-恢复默认";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actEquipModel = ActEquipModel_1.ActEquipModel.getInstance(ctx, uuid);
    await actEquipModel.backMoRen();
    let userModel = UserModel_1.UserModel.getInstance(ctx, uuid);
    let userInfo = await userModel.getInfo();
    userInfo.tzid = "";
    await userModel.update(userInfo);
});
/**
 * @api {post} /equip/fmUplevel 附魔升级
 * @apiName 附魔升级
 * @apiGroup equip
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} buwei 部位
 *
 */
router.all('/fmUplevel', async (ctx) => {
    ctx.state.apidesc = "pkFirst-附魔升级";
    const { uuid, buwei } = tool_1.tool.getParams(ctx);
    let actEquipModel = ActEquipModel_1.ActEquipModel.getInstance(ctx, uuid);
    await actEquipModel.fm_uplevel(buwei);
});
/**
 * @api {post} /equip/fmZhuanHuan 附魔转换
 * @apiName 附魔转换
 * @apiGroup equip
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} buwei 部位
 *
 */
router.all('/fmZhuanHuan', async (ctx) => {
    ctx.state.apidesc = "pkFirst-附魔转换";
    const { uuid, buwei } = tool_1.tool.getParams(ctx);
    let actEquipModel = ActEquipModel_1.ActEquipModel.getInstance(ctx, uuid);
    await actEquipModel.fm_zhuanhuan(buwei);
});
/**
 * @api {post} /equip/fmSetZhbd 附魔转换绑定设置
 * @apiName 附魔转换绑定设置
 * @apiGroup equip
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} buwei 部位
 * @apiParam {number[]} fmZhBd 绑定列表下标id第一位为0
 *
 */
router.all('/fmSetZhbd', async (ctx) => {
    ctx.state.apidesc = "pkFirst-附魔转换绑定设置";
    const { uuid, buwei, fmZhBd } = tool_1.tool.getParams(ctx);
    let actEquipModel = ActEquipModel_1.ActEquipModel.getInstance(ctx, uuid);
    await actEquipModel.fm_zhbd(buwei, fmZhBd);
});
/**
 * @api {post} /equip/fmSaveZhbd 附魔转换属性保存
 * @apiName 附魔转换属性保存
 * @apiGroup equip
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} buwei 部位
 *
 */
router.all('/fmSaveZhbd', async (ctx) => {
    ctx.state.apidesc = "pkFirst-附魔转换属性保存";
    const { uuid, buwei } = tool_1.tool.getParams(ctx);
    let actEquipModel = ActEquipModel_1.ActEquipModel.getInstance(ctx, uuid);
    await actEquipModel.fm_zh_save(buwei);
});
/**
 * @api {post} /equip/fmBangDing 附魔绑定
 * @apiName 附魔绑定
 * @apiGroup equip
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} buwei 部位
 *
 */
router.all('/fmBangDing', async (ctx) => {
    ctx.state.apidesc = "pkFirst-附魔绑定";
    const { uuid, buwei } = tool_1.tool.getParams(ctx);
    let actEquipModel = ActEquipModel_1.ActEquipModel.getInstance(ctx, uuid);
    await actEquipModel.fm_bangding(buwei);
});
/**
 * @api {post} /equip/cbBuy 翅膀购买
 * @apiName 翅膀购买
 * @apiGroup equip
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} id 翅膀ID
 *
 */
router.all('/cbBuy', async (ctx) => {
    ctx.state.apidesc = "装备-翅膀购买";
    const { uuid, id } = tool_1.tool.getParams(ctx);
    let actChiBangModel = ActChiBangModel_1.ActChiBangModel.getInstance(ctx, uuid);
    await actChiBangModel.buy(id);
});
/**
 * @api {post} /equip/cbGengHuan 翅膀更换
 * @apiName 翅膀更换
 * @apiGroup equip
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} id 翅膀ID
 *
 */
router.all('/cbGengHuan', async (ctx) => {
    ctx.state.apidesc = "装备-翅膀更换";
    const { uuid, id } = tool_1.tool.getParams(ctx);
    let actChiBangModel = ActChiBangModel_1.ActChiBangModel.getInstance(ctx, uuid);
    await actChiBangModel.gengHuan(id);
});
/**
 * @api {post} /equip/cbTiSheng 翅膀提升
 * @apiName 翅膀提升
 * @apiGroup equip
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all('/cbTiSheng', async (ctx) => {
    ctx.state.apidesc = "装备-翅膀提升";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actChiBangModel = ActChiBangModel_1.ActChiBangModel.getInstance(ctx, uuid);
    await actChiBangModel.tiSheng();
});
/**
 * @api {post} /equip/cbTiShengAll 翅膀一键提升
 * @apiName 翅膀一键提升
 * @apiGroup equip
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all('/cbTiShengAll', async (ctx) => {
    ctx.state.apidesc = "装备-翅膀一键提升";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actChiBangModel = ActChiBangModel_1.ActChiBangModel.getInstance(ctx, uuid);
    await actChiBangModel.tiShengAll();
});
/**
 * @api {post} /equip/cuilian 淬炼提升
 * @apiName 淬炼提升
 * @apiGroup equip
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} key 属性key
 *
 */
router.all('/cuilian', async (ctx) => {
    ctx.state.apidesc = "装备-淬炼提升";
    const { uuid, key } = tool_1.tool.getParams(ctx);
    let actChiBangModel = ActChiBangModel_1.ActChiBangModel.getInstance(ctx, uuid);
    await actChiBangModel.cuilian(key);
});
/**
 * @api {post} /equip/intoFangan 进入装备方案列表
 * @apiName 进入装备方案列表
 * @apiGroup equip
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all('/intoFangan', async (ctx) => {
    ctx.state.apidesc = "装备-进入装备方案列表";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actEquipFangAnModel = ActEquipFangAnModel_1.ActEquipFangAnModel.getInstance(ctx, uuid);
    await actEquipFangAnModel.intoList();
});
/**
 * @api {post} /equip/setFname 进入装备方案列表
 * @apiName 进入装备方案列表
 * @apiGroup equip
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} faid 方案ID
 * @apiParam {string} name 方案名称
 */
router.all('/setFname', async (ctx) => {
    ctx.state.apidesc = "装备-进入装备方案列表";
    const { uuid, faid, name } = tool_1.tool.getParams(ctx);
    let actEquipFangAnModel = ActEquipFangAnModel_1.ActEquipFangAnModel.getInstance(ctx, uuid);
    await actEquipFangAnModel.setFname(faid, name);
});
/**
 * @api {post} /equip/setChuan 设置使用方案
 * @apiName 设置使用方案
 * @apiGroup equip
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 * @apiParam {string} faid 方案ID
 */
router.all('/setChuan', async (ctx) => {
    ctx.state.apidesc = "装备-设置使用方案";
    const { uuid, faid } = tool_1.tool.getParams(ctx);
    let actEquipFangAnModel = ActEquipFangAnModel_1.ActEquipFangAnModel.getInstance(ctx, uuid);
    await actEquipFangAnModel.setChuan(faid);
});
/**
 * @api {post} /equip/buyFangan 购买方案格子
 * @apiName 购买方案格子
 * @apiGroup equip
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 */
router.all('/buyFangan', async (ctx) => {
    ctx.state.apidesc = "装备-购买方案格子";
    const { uuid } = tool_1.tool.getParams(ctx);
    let actEquipFangAnModel = ActEquipFangAnModel_1.ActEquipFangAnModel.getInstance(ctx, uuid);
    await actEquipFangAnModel.buyGz();
});
//# sourceMappingURL=equip.js.map