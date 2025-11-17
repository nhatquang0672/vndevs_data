"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("../util/mongodb");
const tool_1 = require("../util/tool");
const gameMethod_1 = require("../../common/gameMethod");
const game_1 = __importDefault(require("../util/game"));
const RdsUserModel_1 = require("../model/redis/RdsUserModel");
const ActDingYueModel_1 = require("../model/act/ActDingYueModel");
const SevAdokModel_1 = require("../model/sev/SevAdokModel");
const lock_1 = __importDefault(require("../util/lock"));
const Xys = __importStar(require("../../common/Xys"));
const SevTianGongModel_1 = require("../model/sev/SevTianGongModel");
const setting_1 = __importDefault(require("./setting"));
const RdsClubModel_1 = require("../model/redis/RdsClubModel");
/**
 * 定时器处理
 */
class Timer {
    /**
     * 触发定时器
     */
    static async doTimer(new0, newTime) {
        if (Timer.nextAt > newTime) {
            return;
        }
        let lastAt = 60 - (newTime - new0) % 60;
        if (lastAt == 0) {
            lastAt = 60;
        }
        Timer.nextAt = newTime + lastAt;
        let infos = await mongodb_1.dbSev.getDataDb().find(this.table, {
            doAt: { $lt: newTime },
            isOver: 0,
        });
        for (const info of infos) {
            let isOver = 0;
            switch (info.kid) {
                case 'delData':
                    //设置明天3点
                    await tool_1.tool.addTimer("0", "delData", "0", game_1.default.getTodayId(newTime), new0 + 86400 + 3 * 3600);
                    //删除流水 保留30天
                    await mongodb_1.dbSev.getFlowDb().remove("flow1", { "time": { $lt: new0 - 86400 * 30 } }, true);
                    //删除定时脚本 保留30天
                    await mongodb_1.dbSev.getDataDb().remove("timer", { "doAt": { $lt: new0 - 86400 * 30 } }, true);
                    //删除sys_setting 保留30天
                    await mongodb_1.dbSev.getDataDb().remove("sys_setting", { "eAt": { $lt: new0 - 86400 * 30, $gt: 0 } }, true);
                    //删除过期邮件 保留30天
                    await mongodb_1.dbSev.getDataDb().remove("mail", { "data.dts": { $lt: new0, $gt: 0 } }, true);
                    // //整合过期的redis  key
                    // let fusers = await dbSev.getDataDb().find("user",{"data.lastlogin":{$gte:new0-86400*3,$lt:new0-86400}})
                    // let keys:string[] = []
                    // for (const fuser of fusers) {
                    //     keys.push(DataType.user+'_'+ fuser.id)
                    //     keys.push(DataType.player+'_'+ fuser.data.uid)
                    // }
                    // if(keys.length > 0){
                    //     await redisSev.getRedis(DataType.system).set('expireKeys',keys)
                    //     await Timer.tick()
                    // }
                    isOver = 1;
                    break;
                case 'jjcDay': //竞技场每日
                    let rdsUserModel = await new RdsUserModel_1.RdsUserModel("rdsJjc", 'x', info.sid, tool_1.tool.jjcWeekId(info.doAt - 60));
                    let getAll = await rdsUserModel.getRankBetween(1, 0);
                    //发奖
                    let rid = 1;
                    let saveData = {};
                    for (let i = 0; i < getAll.length; i += 2) {
                        let member = getAll[i];
                        let score = Math.ceil(parseFloat(getAll[i + 1]));
                        saveData[member] = [rid, score];
                        rid += 1;
                    }
                    await mongodb_1.dbSev.getDataDb().update('sys_setting', {
                        sid: info.sid,
                        kid: "jjcDay",
                        hdcid: info.hdcid
                    }, {
                        sid: info.sid,
                        kid: "jjcDay",
                        hdcid: info.hdcid,
                        msg: `竞技场${info.sid}区每日奖励`,
                        value: saveData,
                        eAt: info.doAt + 86400,
                    }, true);
                    //这边方案备用 => 周日, 更新下一个榜单前21名信息，如果是今天创建的区服，更新所有玩家
                    //把榜单的玩家拷贝到下一个榜单
                    if (game_1.default.weekId() == 7) {
                        //下周榜单
                        let rdsUserModel2 = await new RdsUserModel_1.RdsUserModel("rdsJjc", 'x', info.sid, tool_1.tool.jjcWeekId(info.doAt - 60 + 86400 * 7));
                        let addmem = [];
                        for (let i = 0; i < getAll.length; i += 2) {
                            let score = 1500 - i * 0.0000001;
                            addmem.push(score.toString());
                            addmem.push(getAll[i]);
                        }
                        if (addmem.length > 0) {
                            await rdsUserModel2.zSetVals(addmem);
                        }
                    }
                    isOver = 1;
                    break;
                case 'pvdDay': //每日挑战
                    let rdsPvdModel = await new RdsUserModel_1.RdsUserModel("rdsPvd", 'x', info.sid, game_1.default.getTodayId(info.doAt));
                    let pvdAll = await rdsPvdModel.getRankBetween(1, 0);
                    let prid = 1;
                    let psaveData = {};
                    for (let i = 0; i < pvdAll.length; i += 2) {
                        let member = pvdAll[i];
                        let score = Math.ceil(parseFloat(pvdAll[i + 1]));
                        psaveData[member] = [prid, score];
                        prid += 1;
                    }
                    await mongodb_1.dbSev.getDataDb().update('sys_setting', {
                        sid: info.sid,
                        kid: "pvdDay",
                        hdcid: game_1.default.getTodayId(info.doAt)
                    }, {
                        sid: info.sid,
                        kid: "pvdDay",
                        hdcid: game_1.default.getTodayId(info.doAt),
                        msg: `每日挑战${info.sid}区每日排行奖励`,
                        value: psaveData,
                        eAt: info.doAt + 86400 * 15,
                    }, true);
                    isOver = 1;
                    break;
                case 'dingyue': //订阅
                    let dyCtx = await tool_1.tool.ctxCreate("user", info.hdcid);
                    let actDingYueModel = ActDingYueModel_1.ActDingYueModel.getInstance(dyCtx, info.hdcid);
                    await actDingYueModel.sendDy(info.hid, info.cs);
                    await tool_1.tool.ctxUpdate(dyCtx);
                    isOver = 1;
                    break;
                case 'hdChou': //九龙秘宝
                    let rdsUserModel_rdsHdChou = await new RdsUserModel_1.RdsUserModel("rdsHdChou", info.hdcid, info.sid, info.hid);
                    let chouAll = await rdsUserModel_rdsHdChou.getRankBetween(1, 0);
                    let crid = 1;
                    let csaveData = {};
                    for (let i = 0; i < chouAll.length; i += 2) {
                        let cmember = chouAll[i].toString();
                        let score = Math.ceil(parseFloat(chouAll[i + 1]));
                        csaveData[cmember] = [crid, score];
                        crid += 1;
                    }
                    let rdsKey = info.sid + '_rdsHdChou_' + info.hdcid + '_' + info.hid;
                    await mongodb_1.dbSev.getDataDb().update('sys_setting', {
                        sid: info.sid,
                        kid: "hdChou",
                        hdcid: rdsKey,
                    }, {
                        sid: info.sid,
                        kid: "hdChou",
                        hdcid: rdsKey,
                        msg: `九龙秘宝${info.sid}区分组${info.hdcid}排行奖励`,
                        value: csaveData,
                        eAt: info.doAt + 86400 * 15,
                    }, true);
                    //通知全服奖励发放
                    let sevCtx = await tool_1.tool.ctxCreate("sevAdok", info.sid);
                    await lock_1.default.setLock(sevCtx, "sevAdok", info.sid);
                    let sevAdokModel = SevAdokModel_1.SevAdokModel.getInstance(sevCtx, info.sid);
                    await sevAdokModel.addHdChou(rdsKey, info.hdcid, info.cs[0], new0);
                    await tool_1.tool.ctxUpdate(sevCtx);
                    isOver = 1;
                    break;
                case 'hdChongbang': //冲榜
                    if (1) {
                        let rdsUserModel_rdsHdCb = await new RdsUserModel_1.RdsUserModel("rdsHdChongBang", info.hdcid, info.sid, info.hid);
                        let chouAll = await rdsUserModel_rdsHdCb.getRankBetween(1, 0);
                        let crid = 1;
                        let csaveData = {};
                        for (let i = 0; i < chouAll.length; i += 2) {
                            let cmember = chouAll[i].toString();
                            let score = Math.ceil(parseFloat(chouAll[i + 1]));
                            csaveData[cmember] = [crid, score];
                            crid += 1;
                        }
                        let rdsKey = info.sid + '_rdsHdChongBang_' + info.hdcid + '_' + info.hid;
                        await mongodb_1.dbSev.getDataDb().update('sys_setting', {
                            sid: info.sid,
                            kid: "hdChongbang",
                            hdcid: rdsKey,
                        }, {
                            sid: info.sid,
                            kid: "hdChongbang",
                            hdcid: rdsKey,
                            msg: `冲榜${info.sid}区分组${info.hdcid}排行奖励`,
                            value: csaveData,
                            eAt: info.doAt + 86400 * 15,
                        }, true);
                        //通知全服奖励发放
                        let sevCtx = await tool_1.tool.ctxCreate("sevAdok", info.sid);
                        await lock_1.default.setLock(sevCtx, "sevAdok", info.sid);
                        let sevAdokModel = SevAdokModel_1.SevAdokModel.getInstance(sevCtx, info.sid);
                        await sevAdokModel.addHdCb(rdsKey, info.hdcid, info.cs[0], new0);
                        await tool_1.tool.ctxUpdate(sevCtx);
                    }
                    isOver = 1;
                    break;
                case 'hdJiYuan': //机缘 
                    //通知全服奖励发放
                    let sevCtx1 = await tool_1.tool.ctxCreate("sevAdok", info.sid);
                    await lock_1.default.setLock(sevCtx1, "sevAdok", info.sid);
                    let sevAdokModel1 = SevAdokModel_1.SevAdokModel.getInstance(sevCtx1, info.sid);
                    await sevAdokModel1.addHdJiYuan(info.hdcid, info.cs[0], info.hid, new0);
                    await tool_1.tool.ctxUpdate(sevCtx1);
                    isOver = 1;
                    break;
                case 'hdQiYuan': //兽灵起源 
                    if (1) {
                        let rdsUserModel = new RdsUserModel_1.RdsUserModel(Xys.RdsUser.rdsHdQiYuan, info.hdcid, info.sid, info.hid);
                        let chouAll = await rdsUserModel.getRankBetween(1, 0);
                        let crid = 1;
                        let csaveData = {};
                        for (let i = 0; i < chouAll.length; i += 2) {
                            let cmember = chouAll[i].toString();
                            let score = Math.ceil(parseFloat(chouAll[i + 1]));
                            csaveData[cmember] = [crid, score];
                            crid += 1;
                        }
                        let rdsKey = `${info.sid}_${Xys.RdsUser.rdsHdQiYuan}_'${info.hdcid}_${info.hid}`;
                        await mongodb_1.dbSev.getDataDb().update('sys_setting', {
                            sid: info.sid,
                            kid: "hdQiYuan",
                            hdcid: rdsKey,
                        }, {
                            sid: info.sid,
                            kid: "hdQiYuan",
                            hdcid: rdsKey,
                            msg: `兽灵起源${info.sid}区分组${info.hdcid}排行奖励`,
                            value: csaveData,
                            eAt: info.doAt + 86400 * 15,
                        }, true);
                        //通知全服奖励发放
                        let sevCtx = await tool_1.tool.ctxCreate("sevAdok", info.sid);
                        await lock_1.default.setLock(sevCtx, "sevAdok", info.sid);
                        let sevAdokModel = SevAdokModel_1.SevAdokModel.getInstance(sevCtx, info.sid);
                        await sevAdokModel.addHdQiYuan(rdsKey, info.hdcid, info.cs[0], new0);
                        await tool_1.tool.ctxUpdate(sevCtx);
                    }
                    isOver = 1;
                    break;
                case 'hdChumo': //除魔卫道 
                    if (1) {
                        let rdsUserModel_rdsHdChumo = await new RdsUserModel_1.RdsUserModel("rdsHdChumo", info.hdcid, info.sid, info.hid);
                        let chouAll = await rdsUserModel_rdsHdChumo.getRankBetween(1, 0);
                        let crid = 1;
                        let csaveData = {};
                        for (let i = 0; i < chouAll.length; i += 2) {
                            let cmember = chouAll[i].toString();
                            let score = Math.ceil(parseFloat(chouAll[i + 1]));
                            csaveData[cmember] = [crid, score];
                            crid += 1;
                        }
                        let rdsKey = info.sid + '_rdsHdChumo_' + info.hdcid + '_' + info.hid;
                        await mongodb_1.dbSev.getDataDb().update('sys_setting', {
                            sid: info.sid,
                            kid: "hdChumo",
                            hdcid: rdsKey,
                        }, {
                            sid: info.sid,
                            kid: "hdChumo",
                            hdcid: rdsKey,
                            msg: `除魔卫道${info.sid}区分组${info.hdcid}排行奖励`,
                            value: csaveData,
                            eAt: info.doAt + 86400 * 15,
                        }, true);
                        //通知全服奖励发放
                        let sevCtx = await tool_1.tool.ctxCreate("sevAdok", info.sid);
                        await lock_1.default.setLock(sevCtx, "sevAdok", info.sid);
                        let sevAdokModel = SevAdokModel_1.SevAdokModel.getInstance(sevCtx, info.sid);
                        await sevAdokModel.addHdChumo(rdsKey, info.hdcid, info.cs[0], new0);
                        await tool_1.tool.ctxUpdate(sevCtx);
                        isOver = 1;
                    }
                    isOver = 1;
                    break;
                case 'hdHuanJing': //鱼灵幻境 
                    if (1) {
                        let rdsUserModel = new RdsUserModel_1.RdsUserModel(Xys.RdsUser.rdsHdHuanJing, info.hdcid, info.sid, info.hid);
                        let chouAll = await rdsUserModel.getRankBetween(1, 0);
                        let crid = 1;
                        let csaveData = {};
                        for (let i = 0; i < chouAll.length; i += 2) {
                            let cmember = chouAll[i].toString();
                            let score = Math.ceil(parseFloat(chouAll[i + 1]));
                            csaveData[cmember] = [crid, score];
                            crid += 1;
                        }
                        let rdsKey = `${info.sid}_${Xys.RdsUser.rdsHdHuanJing}_'${info.hdcid}_${info.hid}`;
                        await mongodb_1.dbSev.getDataDb().update('sys_setting', {
                            sid: info.sid,
                            kid: "hdHuanJing",
                            hdcid: rdsKey,
                        }, {
                            sid: info.sid,
                            kid: "hdHuanJing",
                            hdcid: rdsKey,
                            msg: `鱼灵幻境${info.sid}区分组${info.hdcid}排行奖励`,
                            value: csaveData,
                            eAt: info.doAt + 86400 * 15,
                        }, true);
                        //通知全服奖励发放
                        let sevCtx = await tool_1.tool.ctxCreate("sevAdok", info.sid);
                        await lock_1.default.setLock(sevCtx, "sevAdok", info.sid);
                        let sevAdokModel = SevAdokModel_1.SevAdokModel.getInstance(sevCtx, info.sid);
                        await sevAdokModel.addHdHuanJing(rdsKey, info.hdcid, info.cs[0], new0);
                        await tool_1.tool.ctxUpdate(sevCtx);
                    }
                    isOver = 1;
                    break;
                case 'hdXinMo': //破除心魔 
                    if (1) {
                        let rdsUserModel = new RdsUserModel_1.RdsUserModel(Xys.RdsUser.rdsHdXinMo, info.hdcid, info.sid, info.hid);
                        let chouAll = await rdsUserModel.getRankBetween(1, 0);
                        let crid = 1;
                        let csaveData = {};
                        for (let i = 0; i < chouAll.length; i += 2) {
                            let cmember = chouAll[i].toString();
                            let score = Math.ceil(parseFloat(chouAll[i + 1]));
                            csaveData[cmember] = [crid, score];
                            crid += 1;
                        }
                        let rdsKey = `${info.sid}_${Xys.RdsUser.rdsHdXinMo}_'${info.hdcid}_${info.hid}`;
                        await mongodb_1.dbSev.getDataDb().update('sys_setting', {
                            sid: info.sid,
                            kid: "hdXinMo",
                            hdcid: rdsKey,
                        }, {
                            sid: info.sid,
                            kid: "hdXinMo",
                            hdcid: rdsKey,
                            msg: `破除心魔${info.sid}区分组${info.hdcid}排行奖励`,
                            value: csaveData,
                            eAt: info.doAt + 86400 * 15,
                        }, true);
                        //通知全服奖励发放
                        let sevCtx = await tool_1.tool.ctxCreate("sevAdok", info.sid);
                        await lock_1.default.setLock(sevCtx, "sevAdok", info.sid);
                        let sevAdokModel = SevAdokModel_1.SevAdokModel.getInstance(sevCtx, info.sid);
                        await sevAdokModel.addHdXinMo(rdsKey, info.hdcid, info.cs[0], new0);
                        await tool_1.tool.ctxUpdate(sevCtx);
                    }
                    isOver = 1;
                    break;
                case 'hdLunHui': //天道轮回 
                    if (1) {
                        //通知全服奖励发放
                        let sevCtx1 = await tool_1.tool.ctxCreate("sevAdok", info.sid);
                        await lock_1.default.setLock(sevCtx1, "sevAdok", info.sid);
                        let sevAdokModel1 = SevAdokModel_1.SevAdokModel.getInstance(sevCtx1, info.sid);
                        await sevAdokModel1.addHdLunHui(info.hdcid, info.cs[0], info.hid, new0);
                        await tool_1.tool.ctxUpdate(sevCtx1);
                    }
                    isOver = 1;
                    break;
                case 'hdYueGong': //月宫探宝 
                    if (1) {
                        //通知全服奖励发放
                        let sevCtx1 = await tool_1.tool.ctxCreate("sevAdok", info.sid);
                        await lock_1.default.setLock(sevCtx1, "sevAdok", info.sid);
                        let sevAdokModel1 = SevAdokModel_1.SevAdokModel.getInstance(sevCtx1, info.sid);
                        await sevAdokModel1.addHdYueGong(info.hdcid, info.cs[0], info.hid, new0);
                        await tool_1.tool.ctxUpdate(sevCtx1);
                    }
                    isOver = 1;
                    break;
                case 'hdChongYang': //重阳出游 
                    if (1) {
                        //通知全服奖励发放
                        let sevCtx1 = await tool_1.tool.ctxCreate("sevAdok", info.sid);
                        await lock_1.default.setLock(sevCtx1, "sevAdok", info.sid);
                        let sevAdokModel1 = SevAdokModel_1.SevAdokModel.getInstance(sevCtx1, info.sid);
                        await sevAdokModel1.addHdChongYang(info.hdcid, info.cs[0], info.hid, new0);
                        await tool_1.tool.ctxUpdate(sevCtx1);
                    }
                    isOver = 1;
                    break;
                case 'hdShanhe': //山河庆典 
                    if (1) {
                        //通知全服奖励发放
                        let sevCtx1 = await tool_1.tool.ctxCreate("sevAdok", info.sid);
                        await lock_1.default.setLock(sevCtx1, "sevAdok", info.sid);
                        let sevAdokModel1 = SevAdokModel_1.SevAdokModel.getInstance(sevCtx1, info.sid);
                        await sevAdokModel1.addHdShanhe(info.hdcid, info.cs[0], info.hid, new0);
                        await tool_1.tool.ctxUpdate(sevCtx1);
                    }
                    isOver = 1;
                    break;
                case 'hdChargeTotal': //累计充值礼包 
                    if (1) {
                        //通知全服奖励发放
                        let sevCtx1 = await tool_1.tool.ctxCreate("sevAdok", info.sid);
                        await lock_1.default.setLock(sevCtx1, "sevAdok", info.sid);
                        let sevAdokModel1 = SevAdokModel_1.SevAdokModel.getInstance(sevCtx1, info.sid);
                        await sevAdokModel1.addHdChargeTotal(info.hdcid, info.cs[0], info.hid, new0);
                        await tool_1.tool.ctxUpdate(sevCtx1);
                    }
                    isOver = 1;
                    break;
                case 'hdDouLuo': //斗罗每日XX 
                    if (1) {
                        let sevCtx1 = await tool_1.tool.ctxCreate("sevAdok", info.sid);
                        let hdcid = info.cs[1];
                        let dicid_dayId = info.hdcid; //这个是什么hdcid? 这是活动的
                        //有sid 这是合服ID
                        info.sid;
                        //是否跨服 首服的判断
                        // let sevDouLuoModel = SevDouLuoModel.getInstance(sevCtx1, "1", hdcid);
                        // let ksid = await sevDouLuoModel.getDLKidBySid(info.sid)
                        //获取 dicid_dayId //每个合服 都需要标记 sevadok 任务 
                        // if  (ksid == info.sid){
                        //是跨服的主服
                        //备份竞技榜单
                        let rdsUserModel = RdsUserModel_1.RdsUserModel.getInstance(sevCtx1, Xys.RdsUser.rdsDouLuo, info.sid, hdcid, game_1.default.getDouLuoWeek(info.doAt - 1));
                        let getAll = await rdsUserModel.getRankBetween(1, 0);
                        //构造 排行信息备份
                        let rid = 1;
                        let saveData = {};
                        for (let i = 0; i < getAll.length; i += 2) {
                            let member = getAll[i];
                            if (gameMethod_1.gameMethod.isNpc(member)) {
                                continue;
                            }
                            let score = Math.ceil(parseFloat(getAll[i + 1]));
                            saveData[member] = [rid, score]; //发奖励的时候 不看名次 按照分值作为名次
                            rid += 1;
                        }
                        await mongodb_1.dbSev.getDataDb().update('sys_setting', {
                            sid: info.sid,
                            kid: "hdDouLuoDay",
                            hdcid: dicid_dayId
                        }, {
                            sid: info.sid,
                            kid: "hdDouLuoDay",
                            hdcid: dicid_dayId,
                            msg: `最强斗罗${info.sid}区每日奖励`,
                            value: saveData,
                            eAt: info.doAt + 86400 * 15,
                        }, true);
                        // }
                        //通知全服奖励发放 // 使用自动以 hdcid 使用合服ID //? 还有什么 
                        let _hefuId = setting_1.default.getHeid(info.sid);
                        let kuas = [_hefuId];
                        if (info.cs[3] != null) {
                            kuas = info.cs[3];
                        }
                        for (const _dlsid of kuas) {
                            // let dlsid = Setting.getHeid(_dlsid)
                            await lock_1.default.setLock(sevCtx1, "sevAdok", _dlsid);
                            let sevAdokModel1 = SevAdokModel_1.SevAdokModel.getInstance(sevCtx1, _dlsid);
                            //传入了 dicid_dayId做为hdcid //其他 没用
                            await sevAdokModel1.addHdDouLuo(dicid_dayId, hdcid, info.cs[0], new0, info.sid);
                        }
                        await tool_1.tool.ctxUpdate(sevCtx1);
                    }
                    isOver = 1;
                    break;
                case 'hdTianGong': //天宫乐舞 
                    if (1) {
                        let sevCtx = await tool_1.tool.ctxCreate("sevAdok", info.sid);
                        //是否跨服 首服的判断
                        let sevTianGongModel = SevTianGongModel_1.SevTianGongModel.getInstance(sevCtx, "1", info.hdcid);
                        let sevOpenInfo = await sevTianGongModel.getKidBySid(info.sid);
                        //活动开放
                        if (sevOpenInfo.open > 0) {
                            let weekid = info.hid;
                            let rdsUserModel = new RdsUserModel_1.RdsUserModel(Xys.RdsUser.rdsHdTianGong, info.hdcid, info.sid, weekid);
                            let chouAll = await rdsUserModel.getRankBetween(1, 0);
                            let crid = 1;
                            let csaveData = {};
                            for (let i = 0; i < chouAll.length; i += 2) {
                                let cmember = chouAll[i].toString();
                                let score = Math.ceil(parseFloat(chouAll[i + 1]));
                                csaveData[cmember] = [crid, score];
                                crid += 1;
                            }
                            let rdsKey = `${info.sid}_${Xys.RdsUser.rdsHdTianGong}_${info.hdcid}_${weekid}`;
                            await mongodb_1.dbSev.getDataDb().update('sys_setting', {
                                sid: info.sid,
                                kid: "hdTianGong",
                                hdcid: rdsKey,
                            }, {
                                sid: info.sid,
                                kid: "hdTianGong",
                                hdcid: rdsKey,
                                msg: `天宫乐舞${info.sid}区分组${info.hdcid}排行奖励`,
                                value: csaveData,
                                eAt: info.doAt + 86400 * 15,
                            }, true);
                            //通知全服奖励发放
                            await lock_1.default.setLock(sevCtx, "sevAdok", info.sid);
                            let sevAdokModel = SevAdokModel_1.SevAdokModel.getInstance(sevCtx, info.sid);
                            await sevAdokModel.addHdTianGong(rdsKey, info.hdcid, info.cs[0], new0);
                            //如果本服是跨服首服 拷贝保存跨服榜单
                            let rdsKey_kua = `${sevOpenInfo.ksid}_${Xys.RdsUser.rdsHdTianGongKua}_${info.hdcid}_${weekid}`;
                            if (sevOpenInfo.ksid == info.sid) {
                                let rdsUserModel_kua = new RdsUserModel_1.RdsUserModel(Xys.RdsUser.rdsHdTianGongKua, info.hdcid, info.sid, weekid);
                                let chouAll = await rdsUserModel_kua.getRankBetween(1, 0);
                                let crid = 1;
                                let csaveData = {};
                                for (let i = 0; i < chouAll.length; i += 2) {
                                    let cmember = chouAll[i].toString();
                                    let score = Math.ceil(parseFloat(chouAll[i + 1]));
                                    csaveData[cmember] = [crid, score];
                                    crid += 1;
                                }
                                // let rdsKey = `${info.sid}_${Xys.RdsUser.rdsHdTianGongKua}_'${info.hdcid}_${weekid}`
                                await mongodb_1.dbSev.getDataDb().update('sys_setting', {
                                    sid: info.sid,
                                    kid: "hdTianGongKua",
                                    hdcid: rdsKey_kua,
                                }, {
                                    sid: info.sid,
                                    kid: "hdTianGongKua",
                                    hdcid: rdsKey_kua,
                                    msg: `天宫乐舞跨服${info.sid}区分组${info.hdcid}排行奖励`,
                                    value: csaveData,
                                    eAt: info.doAt + 86400 * 15,
                                }, true);
                            }
                            //通知全服跨服奖励发放
                            await lock_1.default.setLock(sevCtx, "sevAdok", info.sid);
                            await sevAdokModel.addHdTianGongKua(rdsKey_kua, info.hdcid, info.cs[0], new0);
                            await tool_1.tool.ctxUpdate(sevCtx);
                        }
                    }
                    isOver = 1;
                    break;
                case 'hdDengShenBang': //登神榜
                    if (1) {
                        //info.sid 跨服区服ID 若25合一 sid只可能是1与25
                        //info.hdcid 活动分组ID 后台配置的
                        //info.hid 这里是周ID
                        let sevCtx = await tool_1.tool.ctxCreate("sevAdok", info.sid);
                        let rdsUserModel = RdsUserModel_1.RdsUserModel.getInstance(sevCtx, Xys.RdsUser.rdsHdDengShenBangKua, info.sid, info.hdcid, info.hid);
                        let allRank = await rdsUserModel.getRankBetween(1, 0);
                        let rid = 1;
                        let saveData = {};
                        for (let i = 0; i < allRank.length; i += 2) {
                            let cmember = allRank[i].toString();
                            let score = Math.ceil(parseFloat(allRank[i + 1]));
                            saveData[cmember] = [rid, score];
                            rid += 1;
                        }
                        //跨服ID_排行榜key_活动分组ID_周ID
                        let rdsUserKey = `${info.sid}_${Xys.RdsUser.rdsHdDengShenBangKua}_${info.hdcid}_${info.hid}`;
                        await mongodb_1.dbSev.getDataDb().update('sys_setting', {
                            sid: info.sid,
                            kid: "hdDengShenBang",
                            hdcid: rdsUserKey,
                        }, {
                            sid: info.sid,
                            kid: "hdDengShenBang",
                            hdcid: rdsUserKey,
                            msg: `登神榜(个人榜)${info.sid}跨区 分组${info.hdcid}排行奖励`,
                            value: saveData,
                            eAt: info.doAt + 86400 * 15,
                        }, true);
                        //通知全服奖励发放
                        let _hefuId = setting_1.default.getHeid(info.sid);
                        let kuas = [_hefuId];
                        if (info.cs[3] != null) {
                            kuas = info.cs[3];
                        }
                        for (const _dlsid of kuas) {
                            await lock_1.default.setLock(sevCtx, "sevAdok", _dlsid);
                            let sevAdokModel = SevAdokModel_1.SevAdokModel.getInstance(sevCtx, _dlsid);
                            await sevAdokModel.addDengShenBang(rdsUserKey, info.hdcid, info.cs[0], new0, info.sid);
                        }
                        //公会奖励
                        let rdsClubModel = RdsClubModel_1.RdsClubModel.getInstance(sevCtx, Xys.RdsClub.rdsClubDengShenBang, info.sid, info.hdcid, info.hid);
                        let allClubRank = await rdsClubModel.getRankBetween(1, 0);
                        let crid = 1;
                        let csaveData = {};
                        for (let i = 0; i < allClubRank.length; i += 2) {
                            let cmember = allClubRank[i].toString();
                            let score = Math.ceil(parseFloat(allClubRank[i + 1]));
                            csaveData[cmember] = [crid, score];
                            crid += 1;
                        }
                        //服务器ID_排行榜key_活动分组ID_周ID
                        let rdsClubKey = `${info.sid}_${Xys.RdsClub.rdsClubDengShenBang}_${info.hdcid}_${info.hid}`;
                        await mongodb_1.dbSev.getDataDb().update('sys_setting', {
                            sid: info.sid,
                            kid: "hdDengShenBang",
                            hdcid: rdsClubKey,
                        }, {
                            sid: info.sid,
                            kid: "hdDengShenBang",
                            hdcid: rdsClubKey,
                            msg: `登神榜(仙盟榜)${info.sid}跨区 分组${info.hdcid}排行奖励`,
                            value: csaveData,
                            eAt: info.doAt + 86400 * 15,
                        }, true);
                        for (const _dlsid of kuas) {
                            await lock_1.default.setLock(sevCtx, "sevAdok", _dlsid);
                            let sevAdokModel = SevAdokModel_1.SevAdokModel.getInstance(sevCtx, _dlsid);
                            await sevAdokModel.addDengShenBang(rdsClubKey, info.hdcid, info.cs[0], new0, info.sid);
                        }
                        await tool_1.tool.ctxUpdate(sevCtx);
                        //把榜单的玩家拷贝到下一个榜单
                        //匹配榜
                        let rdsUserModel_kua = RdsUserModel_1.RdsUserModel.getInstance(sevCtx, Xys.RdsUser.rdsHdDengShenBangKua, info.sid, info.hdcid, info.hid);
                        let allRank_kua = await rdsUserModel_kua.getRankBetween(1, 0);
                        let saveData_Kua = [];
                        for (let i = 0; i < allRank_kua.length; i += 2) {
                            saveData_Kua.push(allRank_kua[i + 1]);
                            saveData_Kua.push(allRank_kua[i]);
                        }
                        if (saveData_Kua && saveData_Kua.length > 0) {
                            //下周榜单
                            let rdsUserModel2 = new RdsUserModel_1.RdsUserModel(Xys.RdsUser.rdsHdDengShenBangKua, info.hdcid, info.sid, game_1.default.getWeekId(info.doAt + 86400));
                            await rdsUserModel2.zSetVals(saveData_Kua);
                        }
                    }
                    isOver = 1;
                    break;
            }
            //全部结束
            if (isOver == 1) {
                await mongodb_1.dbSev.getDataDb().update(this.table, {
                    sid: info.sid,
                    kid: info.kid,
                    hdcid: info.hdcid,
                    hid: info.hid,
                    isOver: 0
                }, { isOver: 1 }, true);
                await mongodb_1.dbSev.getDataDb().getNextId('A_VER');
            }
            else {
                //最多跑3次 ，防止没跑成功 一直跑
                let tableInfo = await mongodb_1.dbSev.getDataDb().findOne(this.table, {
                    sid: info.sid,
                    kid: info.kid,
                    hdcid: info.hdcid,
                    hid: info.hid //功能标识重置id
                });
                let upSql = {
                    paoNum: 0,
                    isOver: 0
                };
                if (tableInfo.paoNum != null) {
                    upSql.paoNum = tableInfo.paoNum;
                }
                upSql.paoNum += 1;
                if (upSql.paoNum >= 3) {
                    upSql.isOver = 2;
                }
                await mongodb_1.dbSev.getDataDb().update(this.table, {
                    sid: info.sid,
                    kid: info.kid,
                    hdcid: info.hdcid,
                    hid: info.hid //功能标识重置id
                }, upSql, true);
            }
        }
    }
}
exports.default = Timer;
Timer.table = "timer";
Timer.nextAt = 0;
//# sourceMappingURL=timer.js.map