"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("../util/mongodb");
const game_1 = __importDefault(require("../util/game"));
const tool_1 = require("../util/tool");
const gameMethod_1 = require("../../common/gameMethod");
const cluster_1 = __importDefault(require("cluster"));
const process_1 = __importDefault(require("process"));
const HdTianGongModel_1 = require("../model/hd/HdTianGongModel");
const worker_threads_1 = require("worker_threads");
/**
 * 后台区服配置信息
 */
class Setting {
    /**
     * 生成换成
     * @param new0 今天0点
     * @param newTime 现在时间
     * @param sType 服务器类型 0默认  1主服务器主进程 2子服务器主进程 3所有服务器 子进程
     */
    static async createCash(new0, newTime, isSend) {
        if (Setting.nextAt > newTime) {
            return;
        }
        let lastAt = 60 - (newTime - new0) % 60;
        if (lastAt == 0) {
            lastAt = 60;
        }
        Setting.nextAt = newTime + lastAt;
        //版本号不同 或者 10分钟更新下最新数据
        let a_ver = await tool_1.tool.getTableCount("A_VER");
        if (a_ver == Setting.ver && newTime < Setting.createAt + 3600 && Setting.createAt >= new0) {
            return;
        }
        Setting.ver = a_ver;
        //区服列表
        let fa_qufus = {};
        let _a_qufus = await mongodb_1.dbSev.getDataDb().find("a_qufu");
        for (const _a_qufu of _a_qufus) {
            fa_qufus[_a_qufu.sid] = _a_qufu;
        }
        Setting.a_qufus = fa_qufus;
        //setting列表
        let fa_settings = {};
        let _a_settings = await mongodb_1.dbSev.getDataDb().find("a_setting");
        for (const _a_setting of _a_settings) {
            fa_settings[_a_setting.key] = _a_setting;
        }
        Setting.a_settings = fa_settings;
        //活动列表
        let fa_huodongs = {};
        let _a_huodongs = await mongodb_1.dbSev.getDataDb().find("a_huodong");
        for (const _a_huodong of _a_huodongs) {
            fa_huodongs[_a_huodong.id] = _a_huodong;
        }
        Setting.a_huodongs = fa_huodongs;
        //合服活动列表
        let fhefu_hds = {};
        let db_hefu_hd = await mongodb_1.dbSev.getDataDb().find("hefu_hd");
        for (const db_hd of db_hefu_hd) {
            fhefu_hds[db_hd.zuid] = db_hd;
        }
        Setting.hefu_hds = fhefu_hds;
        //合服活动列表
        let fputong_hds = {};
        let db_putong_hd = await mongodb_1.dbSev.getDataDb().find("putong_hd");
        for (const db_hd of db_putong_hd) {
            if (fputong_hds[db_hd.sid] == null) {
                fputong_hds[db_hd.sid] = {};
            }
            fputong_hds[db_hd.sid][db_hd.zuid] = db_hd;
        }
        Setting.putong_hds = fputong_hds;
        //邮件列表
        let fa_mails = {};
        let _a_mails = await mongodb_1.dbSev.getDataDb().find("a_mail");
        for (const _a_mail of _a_mails) {
            fa_mails[_a_mail.id] = _a_mail;
        }
        Setting.a_mails = fa_mails;
        // ----   以下每15秒刷新一次  纯缓存操作
        if (gameMethod_1.gameMethod.isEmpty(Setting.a_qufus) == false) {
            //生成缓存 - 区服
            await Setting.qufuCash(new0, newTime);
            //生成缓存 - 配置
            await Setting.settingCash();
            //生成缓存 - 活动
            await Setting.huodongCash(new0, newTime);
            //生成缓存 - 邮件
            await Setting.mailCash(new0, newTime);
            //生成缓存 - 生成系统奖励
            await Setting.sysSttingCash(new0, newTime);
            //更新最新的活动版本号用于检测下发奖励
            Setting.hdver = await tool_1.tool.getTableCount("A_HDVER");
            Setting.createAt = newTime;
        }
        if (isSend) {
            Setting.master_process_Send();
        }
    }
    //生成缓存 - 区服
    static async qufuCash(new0, newTime) {
        let _qufus = {}; //所有区服列表
        let _hefus = {}; //合服表
        let _qufuNewId = 1;
        for (const sid in Setting.a_qufus) {
            _qufus[sid] = {
                sid: Setting.a_qufus[sid].sid,
                name: Setting.a_qufus[sid].name,
                openAt: Setting.a_qufus[sid].openAt,
                status: Setting.a_qufus[sid].status,
                heid: Setting.a_qufus[sid].heid,
                suofu: Setting.a_qufus[sid].suofu,
            };
            if (newTime > Setting.a_qufus[sid].openAt) {
                _qufuNewId = Math.max(_qufuNewId, parseInt(sid));
            }
            //合服记录
            _hefus[Setting.a_qufus[sid].heid] = 1;
            //主服务器生效 检测竞技场榜单时间（一天一次），检测这周 和 下周
            if (Setting.jjcNpcVer[sid] == null) {
                Setting.jjcNpcVer[sid] = 0;
            }
            if (Setting.jjcNpcVer[sid] < newTime && cluster_1.default.isMaster && tool_1.tool.isZhuIp() == true) {
                Setting.jjcNpcVer[sid] = new0 + 86400 + 2 * 3600;
                //竞技场发放每日奖励
                let ctx_rds = await tool_1.tool.ctxCreate("rds", "10086");
                let jjc_day_time = tool_1.tool.mathcfg_count(ctx_rds, "jjc_day_time");
                if (newTime < new0 + jjc_day_time && sid == Setting.a_qufus[sid].heid) {
                    await tool_1.tool.addTimer(sid, "jjcDay", "x", game_1.default.getTodayId(), new0 + jjc_day_time);
                }
                //每日挑战发放每日奖励
                if (newTime < new0 + 86400 - 300 && sid == Setting.a_qufus[sid].heid) {
                    await tool_1.tool.addTimer(sid, "pvdDay", "x", game_1.default.getTodayId(), new0 + 86400 - 299);
                }
            }
        }
        Setting.qufus = _qufus;
        Setting.qufuNewId = _qufuNewId;
        Setting.hefus = _hefus;
    }
    //生成缓存 - setting
    static async settingCash() {
        let _settings = {};
        for (const key in Setting.a_settings) {
            let list = Setting.qufuStr(Setting.a_settings[key].qufu); //获取服务器列表
            for (const sid of list) {
                if (_settings[sid] == null) {
                    _settings[sid] = {};
                }
                _settings[sid][key] = eval("(" + Setting.a_settings[key].value + ")");
            }
        }
        Setting.settings = _settings;
    }
    //生成缓存 - huodong
    static async huodongCash(new0, newTime) {
        Setting.huodongs = await this._huodongCash(new0, newTime);
    }
    //根据时间生成活动缓存
    static async _huodongCash(new0, newTime) {
        let _huodongs = {};
        let cfgSysHefu = Setting.getSetting("1", "sys_hefu");
        let hfHuodong1 = ["hdHefuqd", "hdChumo"]; //合服活动列表1  以最新一次合服时间判定
        //合服活动
        let hfHds = {};
        //已经是合服区服
        if (cfgSysHefu != null && cfgSysHefu.list["1"] != null) {
            let cfgHefuHd = Setting.getSetting("1", "hefu_hd");
            let hfDay0 = cfgSysHefu.list["1"].firstAt; //1区首次合服时间作为起始点
            for (const zuid in cfgHefuHd) {
                if (cfgHefuHd[zuid].list[cfgHefuHd[zuid].initId] == null) {
                    continue; //惯例判定  配置错误
                }
                if (Setting.hefu_hds[zuid] == null) { //新的
                    let hfSxid = cfgHefuHd[zuid].initId;
                    let hfkey = cfgHefuHd[zuid].list[hfSxid].key;
                    let hfHdcid = cfgHefuHd[zuid].list[hfSxid].hdcid;
                    let hfCx = cfgHefuHd[zuid].list[hfSxid].cx;
                    let hdOpenDay = game_1.default.passDayByTimes(newTime, hfDay0);
                    if (hdOpenDay < cfgHefuHd[zuid].openDay) {
                        continue; //还没到时间
                    }
                    let hfsAt = game_1.default.getToDay_0(hfDay0); //0点
                    let pass = true;
                    while (hfsAt + hfCx * 86400 < newTime && pass) {
                        hfsAt += hfCx * 86400;
                        hfSxid = cfgHefuHd[zuid].list[hfSxid].nextId;
                        if (cfgHefuHd[zuid].list[hfSxid] == null) {
                            pass = false;
                        }
                        hfCx = cfgHefuHd[zuid].list[hfSxid].cx;
                        hfkey = cfgHefuHd[zuid].list[hfSxid].key;
                        hfHdcid = cfgHefuHd[zuid].list[hfSxid].hdcid;
                    }
                    if (pass == false) {
                        continue; //找不到下一档
                    }
                    //更新数据
                    await mongodb_1.dbSev.getDataDb().update("hefu_hd", { zuid: zuid }, { zuid: zuid, sxid: cfgHefuHd[zuid].initId, sAt: hfsAt }, true);
                    //不是空档期
                    if (hfkey != "") {
                        if (hfHds[hfkey] == null) {
                            hfHds[hfkey] = {};
                        }
                        if (hfHds[hfkey][hfHdcid] == null) {
                            hfHds[hfkey][hfHdcid] = {
                                sAt: hfsAt,
                                eAt: hfsAt + hfCx * 86400,
                                hdid: game_1.default.getTodayId(hfsAt)
                            };
                        }
                    }
                }
                else { //已经生成的
                    let hfSxid = Setting.hefu_hds[zuid].sxid;
                    let hfkey = cfgHefuHd[zuid].list[hfSxid].key;
                    let hfHdcid = cfgHefuHd[zuid].list[hfSxid].hdcid;
                    let hfCx = cfgHefuHd[zuid].list[hfSxid].cx;
                    hfCx = cfgHefuHd[zuid].list[Setting.hefu_hds[zuid].sxid].cx; //当前生效的持续时间
                    if (Setting.hefu_hds[zuid].sAt + hfCx * 86400 < newTime) { //活动已过期，下个活动
                        Setting.hefu_hds[zuid].sAt += hfCx * 86400;
                        if (cfgHefuHd[zuid].list[Setting.hefu_hds[zuid].sxid] == null) {
                            continue; //没下一个
                        }
                        hfSxid = cfgHefuHd[zuid].list[hfSxid].nextId; //下一个
                        hfCx = cfgHefuHd[zuid].list[hfSxid].cx;
                        hfkey = cfgHefuHd[zuid].list[hfSxid].key;
                        hfHdcid = cfgHefuHd[zuid].list[hfSxid].hdcid;
                        //更新数据
                        await mongodb_1.dbSev.getDataDb().update("hefu_hd", { zuid: zuid }, { zuid: zuid, sxid: hfSxid, sAt: Setting.hefu_hds[zuid].sAt }, true);
                    }
                    //不是空档期
                    if (hfkey != "") {
                        if (hfHds[hfkey] == null) {
                            hfHds[hfkey] = {};
                        }
                        if (hfHds[hfkey][hfHdcid] == null) {
                            hfHds[hfkey][hfHdcid] = {
                                sAt: Setting.hefu_hds[zuid].sAt,
                                eAt: Setting.hefu_hds[zuid].sAt + hfCx * 86400,
                                hdid: game_1.default.getTodayId(Setting.hefu_hds[zuid].sAt)
                            };
                        }
                    }
                }
            }
        }
        //常规循环活动
        let ptHds = {};
        for (const sid in this.qufus) {
            if (sid != this.qufus[sid].heid) {
                continue;
            }
            ptHds[sid] = {};
            //常规活动循环配置
            let cfgPtHd = Setting.getSetting("1", "putong_hd");
            for (const zuid in cfgPtHd) {
                if (Setting.putong_hds[sid] == null || Setting.putong_hds[sid][zuid] == null) { //新的
                    let hfSxid = cfgPtHd[zuid].initId;
                    let hfkey = cfgPtHd[zuid].list[hfSxid].key;
                    let hfHdcid = cfgPtHd[zuid].list[hfSxid].hdcid;
                    let hfCx = cfgPtHd[zuid].list[hfSxid].cx;
                    let hdOpenDay = game_1.default.passDayByTimes(newTime, this.qufus[sid].openAt);
                    if (hdOpenDay < cfgPtHd[zuid].openDay) {
                        continue; //还没到时间
                    }
                    let hfsAt = game_1.default.getToDay_0(this.qufus[sid].openAt) + (cfgPtHd[zuid].openDay - 1) * 86400; //0点
                    let pass = true;
                    while (hfsAt + hfCx * 86400 <= newTime && pass) {
                        hfsAt += hfCx * 86400;
                        hfSxid = cfgPtHd[zuid].list[hfSxid].nextId;
                        if (cfgPtHd[zuid].list[hfSxid] == null) {
                            pass = false;
                        }
                        hfCx = cfgPtHd[zuid].list[hfSxid].cx;
                        hfkey = cfgPtHd[zuid].list[hfSxid].key;
                        hfHdcid = cfgPtHd[zuid].list[hfSxid].hdcid;
                    }
                    if (pass == false) {
                        continue; //找不到下一档
                    }
                    //更新数据
                    await mongodb_1.dbSev.getDataDb().update("putong_hd", { sid: sid, zuid: zuid }, { sid: sid, zuid: zuid, sxid: cfgPtHd[zuid].initId, sAt: hfsAt }, true, true);
                    //不是空档期
                    if (hfkey != "") {
                        if (ptHds[sid][hfkey] == null) {
                            ptHds[sid][hfkey] = {};
                        }
                        if (ptHds[sid][hfkey][hfHdcid] == null) {
                            ptHds[sid][hfkey][hfHdcid] = {
                                sAt: hfsAt,
                                eAt: hfsAt + hfCx * 86400,
                                hdid: game_1.default.getTodayId(hfsAt)
                            };
                        }
                    }
                }
                else { //已经生成的
                    let hfSxid = Setting.putong_hds[sid][zuid].sxid;
                    let hfkey = cfgPtHd[zuid].list[hfSxid].key;
                    let hfHdcid = cfgPtHd[zuid].list[hfSxid].hdcid;
                    let hfCx = cfgPtHd[zuid].list[hfSxid].cx;
                    hfCx = cfgPtHd[zuid].list[Setting.putong_hds[sid][zuid].sxid].cx; //当前生效的持续时间
                    if (Setting.putong_hds[sid][zuid].sAt + hfCx * 86400 <= newTime) { //活动已过期，下个活动
                        Setting.putong_hds[sid][zuid].sAt += hfCx * 86400;
                        if (cfgPtHd[zuid].list[Setting.putong_hds[sid][zuid].sxid] == null) {
                            continue; //没下一个
                        }
                        hfSxid = cfgPtHd[zuid].list[hfSxid].nextId; //下一个
                        hfCx = cfgPtHd[zuid].list[hfSxid].cx;
                        hfkey = cfgPtHd[zuid].list[hfSxid].key;
                        hfHdcid = cfgPtHd[zuid].list[hfSxid].hdcid;
                        //更新数据
                        await mongodb_1.dbSev.getDataDb().update("putong_hd", { sid: sid, zuid: zuid }, { sid: sid, zuid: zuid, sxid: hfSxid, sAt: Setting.putong_hds[sid][zuid].sAt }, true, true);
                    }
                    //不是空档期
                    if (hfkey != "") {
                        if (ptHds[sid][hfkey] == null) {
                            ptHds[sid][hfkey] = {};
                        }
                        if (ptHds[sid][hfkey][hfHdcid] == null) {
                            ptHds[sid][hfkey][hfHdcid] = {
                                sAt: Setting.putong_hds[sid][zuid].sAt,
                                eAt: Setting.putong_hds[sid][zuid].sAt + hfCx * 86400,
                                hdid: game_1.default.getTodayId(Setting.putong_hds[sid][zuid].sAt)
                            };
                        }
                    }
                }
            }
        }
        let sidstr = {};
        //活动时间普通配置
        console.log('===vndevs: HUODONG CONFIGURATION');
        for (const id in Setting.a_huodongs) {
            console.log();
            console.log('##########');
            console.log('#### HDID: ', id, Setting.a_huodongs[id].key);
            //活动生效区服
            let qufustr = Setting.a_huodongs[id].qufu;
            let sevs = [];
            if (sidstr[qufustr] == null) {
                sevs = Setting.qufuStr(Setting.a_huodongs[id].qufu); //获取服务器列表
            }
            else {
                sevs = sidstr[qufustr];
            }
            for (const sid in this.qufus) {
                if (sevs.indexOf(sid) == -1) {
                    continue; //这个区服没有该活动
                }
                if (sid != this.getHeid(sid)) {
                    continue; //被合掉的区服 不生成活动
                }
                let hdkey = Setting.a_huodongs[id].key; //活动key
                let hdHdcid = Setting.a_huodongs[id].hdcid; //活动分组
                console.log();
                let isSx = false; //活动是否已经生效
                let sAt = 0; //活动开始时间
                let eAt = 0; //活动绝对时间
                if (hfHuodong1.indexOf(hdkey) != -1) { //是合服
                    if (cfgSysHefu == null || cfgSysHefu.list[sid] == null) {
                        continue;
                    }
                    if (hfHuodong1.indexOf(hdkey) != -1) { //合服活动列表1  以最新一次合服时间判定
                        let openDay = game_1.default.passDayByTimes(newTime, cfgSysHefu.list[sid].lastAt);
                        console.log('check index hdkey != -1  : ');
                        console.log(openDay, Setting.a_huodongs[id].s_qf, Setting.a_huodongs[id].e_qf, Setting.a_huodongs[id].s_at, Setting.a_huodongs[id].e_at);
                        // console.log(openDay, JSON.stringify(Setting.a_huodongs[id]))
                        if (Setting.a_huodongs[id].s_qf != 0 || Setting.a_huodongs[id].e_qf != 0) {
                            //优先区服
                            if (Setting.a_huodongs[id].s_qf <= openDay && Setting.a_huodongs[id].e_qf >= openDay) {
                                //活动生效了
                                sAt = game_1.default.getToDay_0(cfgSysHefu.list[sid].lastAt) + (Setting.a_huodongs[id].s_qf - 1) * 86400;
                                eAt = game_1.default.getToDay_0(cfgSysHefu.list[sid].lastAt) + Setting.a_huodongs[id].e_qf * 86400 - 1;
                                isSx = true;
                                console.log('1111 ', sAt, eAt);
                            }
                        }
                        //绝对时间
                        if (isSx == false && (Setting.a_huodongs[id].s_at != 0 || Setting.a_huodongs[id].e_at != 0)) {
                            console.log('isSx == false: ', JSON.stringify(Setting.a_huodongs[id]));
                            if (Setting.a_huodongs[id].s_at >= cfgSysHefu.list[sid].lastAt && Setting.a_huodongs[id].s_at <= newTime && Setting.a_huodongs[id].e_at > newTime) {
                                //活动生效了
                                sAt = Setting.a_huodongs[id].s_at;
                                eAt = Setting.a_huodongs[id].e_at;
                                isSx = true;
                                console.log('22222 ', sAt, eAt);
                            }
                        }
                    }
                }
                else {
                    let openDay = game_1.default.passDayByTimes(newTime, this.qufus[sid].openAt);
                    console.log('### without indexxx');
                    console.log(openDay, Setting.a_huodongs[id].s_qf, Setting.a_huodongs[id].e_qf, Setting.a_huodongs[id].s_at, Setting.a_huodongs[id].e_at);
                    if (Setting.a_huodongs[id].s_qf != 0 || Setting.a_huodongs[id].e_qf != 0) {
                        console.log(typeof Setting.a_huodongs[id].s_qf);
                        console.log(typeof Setting.a_huodongs[id].e_qf);
                        //优先区服
                        if (Setting.a_huodongs[id].s_qf <= openDay && Setting.a_huodongs[id].e_qf >= openDay) {
                            //活动生效了
                            sAt = game_1.default.getToDay_0(this.qufus[sid].openAt) + (Setting.a_huodongs[id].s_qf - 1) * 86400;
                            eAt = game_1.default.getToDay_0(this.qufus[sid].openAt) + Setting.a_huodongs[id].e_qf * 86400;
                            isSx = true;
                            console.log('33333  ', sAt, eAt);
                        }
                    }
                    //绝对时间
                    if (isSx == false && (Setting.a_huodongs[id].s_at != 0 || Setting.a_huodongs[id].e_at != 0)) {
                        if (Setting.a_huodongs[id].s_at <= newTime && Setting.a_huodongs[id].e_at > newTime) {
                            //活动生效了
                            sAt = Setting.a_huodongs[id].s_at;
                            eAt = Setting.a_huodongs[id].e_at;
                            isSx = true;
                            console.log('444444  ', sAt, eAt);
                        }
                    }
                }
                let tslunhui = false; //轮回是否生效  优先合服合服
                //已经是合服区服
                if (cfgSysHefu != null && cfgSysHefu.list[sid] != null) {
                    if (hfHds[hdkey] != null) {
                        if (hfHds[hdkey][hdHdcid] != null) {
                            sAt = hfHds[hdkey][hdHdcid].sAt;
                            eAt = hfHds[hdkey][hdHdcid].eAt;
                            isSx = true;
                        }
                        if (hdkey == "hdLunHui") {
                            tslunhui = true;
                        }
                    }
                }
                //普通循环
                if (ptHds[sid] != null && ptHds[sid][hdkey] != null && ptHds[sid][hdkey][hdHdcid] != null) {
                    if ((hdkey == "hdLunHui" && !tslunhui) || hdkey != "hdLunHui") {
                        sAt = ptHds[sid][hdkey][hdHdcid].sAt;
                        eAt = ptHds[sid][hdkey][hdHdcid].eAt;
                        isSx = true;
                        console.log('oh no lunhui');
                    }
                }
                if (isSx == false) {
                    continue; //活动没有生效
                }
                if (newTime < sAt) {
                    continue;
                }
                if (hdkey == "" && hdHdcid == "") {
                    continue;
                }
                //记录生效列表信息
                if (_huodongs[sid] == null) {
                    _huodongs[sid] = {};
                }
                if (_huodongs[sid][hdkey] == null) {
                    _huodongs[sid][hdkey] = {};
                }
                let _value = eval("(" + Setting.a_huodongs[id].value + ")");
                if (_value.info == null) {
                    continue;
                }
                console.log('---- reach here, input houdong data');
                if (_huodongs[sid][hdkey][hdHdcid] == null) {
                    _huodongs[sid][hdkey][hdHdcid] = _value;
                }
                if (_huodongs[sid][hdkey][hdHdcid].info.id == "day") {
                    _huodongs[sid][hdkey][hdHdcid].info.id = game_1.default.getTodayId(newTime);
                }
                if (hfHuodong1.indexOf(hdkey) != -1 && cfgSysHefu != null) {
                    _huodongs[sid][hdkey][hdHdcid].info.id = game_1.default.getTodayId(cfgSysHefu.list[sid].lastAt);
                }
                //已经是合服区服
                if (cfgSysHefu != null && cfgSysHefu.list[sid] != null) {
                    if (hfHds[hdkey] != null && hfHds[hdkey][hdHdcid] != null) {
                        _huodongs[sid][hdkey][hdHdcid].info.id = hfHds[hdkey][hdHdcid].hdid;
                    }
                }
                //普通循环
                if (ptHds[sid] != null && ptHds[sid][hdkey] != null && ptHds[sid][hdkey][hdHdcid] != null) {
                    _huodongs[sid][hdkey][hdHdcid].info.id = ptHds[sid][hdkey][hdHdcid].hdid;
                }
                _huodongs[sid][hdkey][hdHdcid].info.sAt = sAt;
                _huodongs[sid][hdkey][hdHdcid].info.eAt = eAt;
                _huodongs[sid][hdkey][hdHdcid].info.dAt = eAt + _huodongs[sid][hdkey][hdHdcid].info.show * 60;
                // 这边填写需要排行下发奖励的活动key
                let rdsKey = ["hdChou", "hdJiYuan", "hdChumo", "hdQiYuan", "hdHuanJing", "hdXinMo", "hdLunHui", "hdYueGong", "hdChongYang", "hdShanhe", "hdChargeTotal", "hdChongbang"];
                //加发放奖励的定时器  主服 结束之前半小时内加入定时器
                if (tool_1.tool.isZhuIp() == true && rdsKey.indexOf(hdkey) != -1 && newTime > eAt - 5400 && newTime < eAt) {
                    tool_1.tool.addTimer(sid, hdkey, hdHdcid, _huodongs[sid][hdkey][hdHdcid].info.id, eAt, [id, _huodongs[sid][hdkey][hdHdcid].info.title]);
                }
                //最强斗罗
                if (tool_1.tool.isZhuIp() == true && hdkey == "hdDouLuo" && sid == "1" && newTime > new0 + 3600 * 18) { //第一服去触发所有
                    //这边使用  hdcid + 活动日的DAYID 作为索引 替代hdcid //需要传入的hdcid 藏入 cs里面 
                    let dicid_dayId = `${hdHdcid}_${game_1.default.getTodayId()}`;
                    if (game_1.default.inDouLuoTime()) { // && game.getTodaySec() > 86400-1800
                        let sevDl = await mongodb_1.dbSev.getDataDb().findOne("sev", {
                            id: "1",
                            kid: "douLuo",
                            hdcid: "1"
                        });
                        if (sevDl != null) {
                            let kdllist = {};
                            for (const dlsid in sevDl.data.list) {
                                let dlkuaid = sevDl.data.list[dlsid];
                                if (kdllist[dlkuaid] == null) {
                                    kdllist[dlkuaid] = [];
                                }
                                kdllist[dlkuaid].push(dlsid);
                            }
                            for (const dlsid in sevDl.data.list) {
                                if (dlsid == sevDl.data.list[dlsid]) {
                                    tool_1.tool.addTimer(dlsid, "hdDouLuo", dicid_dayId, // dicid_dayId 
                                    _huodongs[sid][hdkey][hdHdcid].info.id, game_1.default.getToDay_0() + 86400, //今晚0点
                                    [id, hdHdcid, _huodongs[sid][hdkey][hdHdcid].info.title, kdllist[dlsid]]);
                                }
                            }
                        }
                    }
                }
                //天宫乐舞
                if (tool_1.tool.isZhuIp() == true && hdkey == "hdTianGong") {
                    //重新获取活动结束时间点
                    let tghdCfg = await HdTianGongModel_1.HdTianGongModel.getHdCfg(hdHdcid);
                    //活动结束前 半小时
                    if (tghdCfg != null) { // && newTime > tghdCfg.info.eAt - 1800 && newTime < tghdCfg.info.eAt
                        tool_1.tool.addTimer(sid, "hdTianGong", hdHdcid, // dicid_dayId 
                        game_1.default.getTianGongWeek(), //weekid
                        tghdCfg.info.eAt, //结束时间
                        [id, tghdCfg.info.title]);
                    }
                }
                //登神榜 主服 结束之前半小时内加入定时器
                if (tool_1.tool.isZhuIp() && hdkey == "hdDengShenBang") {
                    //跨服配置
                    let sevDl = await mongodb_1.dbSev.getDataDb().findOne("sev", {
                        id: "1",
                        kid: "dengShenBang",
                        hdcid: "1"
                    });
                    if (sevDl != null) {
                        //跨服ID：所有的区服ID
                        let kdllist = {};
                        for (const _sid of Object.keys(sevDl.data.list)) {
                            let ksid = sevDl.data.list[_sid].ksid;
                            if (kdllist[ksid] == null) {
                                kdllist[ksid] = [];
                            }
                            kdllist[ksid].push(_sid);
                        }
                        for (const _sid of Object.keys(sevDl.data.list)) {
                            let endTime = sevDl.data.list[_sid].endTime;
                            if (_sid == sevDl.data.list[_sid].ksid && newTime > endTime - 5400 && newTime < endTime) {
                                tool_1.tool.addTimer(_sid, hdkey, hdHdcid, game_1.default.getWeekId(), 
                                //结束后一分钟结算
                                endTime + 60, [id, hdHdcid, _huodongs[sid][hdkey][hdHdcid].info.title, kdllist[_sid]]);
                            }
                        }
                    }
                }
            }
        }
        return _huodongs;
    }
    //生成缓存 - 邮件
    static async mailCash(new0, newTime) {
        let _mails = {}; //所有邮件列表
        for (const id in Setting.a_mails) {
            if (Setting.a_mails[id].etime > 0 && Setting.a_mails[id].etime <= newTime) {
                continue; //过期了
            }
            _mails[id] = {
                id: Setting.a_mails[id].id,
                type: Setting.a_mails[id].type,
                title: Setting.a_mails[id].title,
                content: Setting.a_mails[id].content,
                geren: Setting.a_mails[id].geren,
                qufu: Setting.a_mails[id].qufu,
                regtime: Setting.a_mails[id].regtime,
                items: eval("(" + Setting.a_mails[id].items + ")"),
                etime: Setting.a_mails[id].etime,
            };
        }
        Setting.mails = _mails;
    }
    ////生成缓存 - 生成系统奖励
    static async sysSttingCash(new0, newTime) {
        let sysRwds = {};
        let syss = await mongodb_1.dbSev.getDataDb().find("sys_setting", { "eAt": { $gt: newTime } });
        for (const sys of syss) {
            if (sys.eAt > 0 && sys.eAt <= newTime) {
                continue; //过期了
            }
            if (sysRwds[sys.sid] == null) {
                sysRwds[sys.sid] = {};
            }
            if (sysRwds[sys.sid][sys.kid] == null) {
                sysRwds[sys.sid][sys.kid] = {};
            }
            sysRwds[sys.sid][sys.kid][sys.hdcid] = {
                eAt: sys.eAt,
                value: sys.value,
            };
        }
        Setting.sysRwds = sysRwds;
    }
    /**
     * 获取奖励
     */
    static getSysRwds(sid, kid, hdcid, newTime) {
        if (Setting.sysRwds[sid] == null) {
            return null; //这个区服没有奖励
        }
        if (Setting.sysRwds[sid][kid] == null) {
            return null; //这个kid没有奖励
        }
        if (Setting.sysRwds[sid][kid][hdcid] == null) {
            return null; //这个hdcid没有奖励
        }
        if (Setting.sysRwds[sid][kid][hdcid].eAt <= newTime) {
            return null; //奖励已经过期
        }
        return Setting.sysRwds[sid][kid][hdcid].value; //返回奖励个数
    }
    /**
     * 获取配置 - 获取区服配置
     */
    static getQufus() {
        return this.qufus;
    }
    /**
     * 获取配置 - 获取合服配置
     */
    static getHefus() {
        return this.hefus;
    }
    /**
     * 获取合服ID
     */
    static getHeid(fsid) {
        if (this.qufus[fsid] == null) {
            return "";
        }
        return this.qufus[fsid].heid;
    }
    /**
     * 获取跟本服合服的所有服务器ID
     */
    static getHeSids(sid) {
        if (this.qufus[sid] == null) {
            return [];
        }
        let sids = [];
        for (const k_sid in this.qufus) {
            if (this.qufus[k_sid].heid == this.qufus[sid].heid) {
                sids.push(k_sid);
            }
        }
        return sids;
    }
    /**
     * 获取配置 - 获取setting配置
     */
    static getSetting(qufu, key) {
        if (this.settings == null || this.settings[qufu] == null || this.settings[qufu][key] == null) {
            return null;
        }
        return this.settings[qufu][key];
    }
    // /**
    //  * 获取配置 -通过ID获取配置
    //  */
    // static getHdCfg(id: string): Huodonginfo {
    //     return Setting.a_huodongs[id];
    // }
    /**
     * 获取配置 - 获取huodong配置 一个参数
     */
    static getHuodong(qufu) {
        if (this.huodongs == null || this.huodongs[qufu] == null) {
            return null;
        }
        return this.huodongs[qufu];
    }
    /**
     * 获取配置 - 获取huodong配置 2个参数
     */
    static getHuodong2(qufu, key) {
        if (this.getHuodong(qufu) == null || this.huodongs[qufu][key] == null) {
            return null;
        }
        return this.huodongs[qufu][key];
    }
    /**
     * 获取配置 - 获取huodong配置 3个参数
     */
    static getHuodong3(qufu, key, hdcid) {
        if (this.getHuodong2(qufu, key) == null || this.huodongs[qufu][key][hdcid] == null) {
            return null;
        }
        return this.huodongs[qufu][key][hdcid];
    }
    /**
     * 获取配置 - 获取邮件配置
     */
    static getMails() {
        return this.mails;
    }
    /**
     * 获取配置 - 获取区服最新ID
     */
    static getQufuNewId() {
        return this.qufuNewId.toString();
    }
    /**
     * 封禁
     * @param uuid 角色ID
     * @param type 1:角色禁言  2:封角色  3:封号
     * @param newTime 当前时间
     */
    static isBan(uuid, type, newTime) {
        let cfgBan = Setting.getSetting("1", "a_ban");
        if (cfgBan == null) {
            return false;
        }
        if (type == "3") {
            for (const fuuid in cfgBan) {
                if (cfgBan[fuuid].uid.toString() == uuid && cfgBan[fuuid].list[type] != null && cfgBan[fuuid].list[type] > newTime) {
                    return true;
                }
            }
        }
        else {
            if (cfgBan[uuid] != null && cfgBan[uuid].list[type] != null && cfgBan[uuid].list[type] > newTime) {
                return true;
            }
        }
        return false;
    }
    /**
     * 区服格式解析
     */
    static qufuStr(str) {
        if (str == null || str == "") {
            return [];
        }
        let qufus = Object.keys(Setting.getQufus());
        if (str == "all") {
            return qufus;
        }
        let list = [];
        let arr = str.split(",");
        for (const val of arr) {
            if (val == null) {
                continue;
            }
            let arr1 = val.split("_");
            //单服，不是区间
            if (arr1[1] == null) {
                list.push(arr1[0]);
            }
            else {
                //区服
                for (let i = parseInt(arr1[0]); i <= parseInt(arr1[1]); i++) {
                    if (qufus.indexOf(i.toString()) == -1) {
                        continue; //不在配置的区服列表里面
                    }
                    list.push(i.toString());
                }
            }
        }
        return list;
    }
    /**
     * 主进程发送调用
     */
    static master_process_Send() {
        if (cluster_1.default.isMaster == false) {
            return;
        }
        let allCfg = {
            "createAt": Setting.createAt,
            "ver": Setting.ver,
            "hdver": Setting.hdver,
            "a_qufus": Setting.a_qufus,
            "a_settings": Setting.a_settings,
            "a_huodongs": Setting.a_huodongs,
            "a_mails": Setting.a_mails,
            "qufus": Setting.qufus,
            "hefus": Setting.hefus,
            "qufuNewId": Setting.qufuNewId,
            "settings": Setting.settings,
            "huodongs": Setting.huodongs,
            "mails": Setting.mails,
            "sysRwds": Setting.sysRwds,
            "jjcNpcVer": Setting.jjcNpcVer,
        };
        worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage(allCfg);
        console.log("========主_子线程发送 主进程===", Setting.createAt);
        /*
        parentPort?.postMessage({
            "huodongs":Setting.huodongs,
        });
        parentPort?.postMessage({
            "sysRwds":Setting.sysRwds,
        });
        parentPort?.postMessage({
            "ver":Setting.ver,
            "hdver":Setting.hdver,
            "a_qufus":Setting.a_qufus,
            "jjcNpcVer":Setting.jjcNpcVer,
            "a_settings":Setting.a_settings,
            "a_huodongs":Setting.a_huodongs,
            "a_mails":Setting.a_mails,
            "qufus":Setting.qufus,
            "hefus":Setting.hefus,
            "qufuNewId":Setting.qufuNewId,
            "settings":Setting.settings,
            "mails":Setting.mails,
            "createAt":Setting.createAt,
        });
        */
    }
    /**
     * 子进程接受调用
     */
    static worker_process_on() {
        if (cluster_1.default.isMaster == true) {
            return;
        }
        process_1.default.on('message', (msg) => {
            for (const fkey in msg) {
                switch (fkey) {
                    case "createAt":
                        Setting.createAt = msg[fkey];
                        break;
                    case "ver":
                        Setting.ver = msg[fkey];
                        break;
                    case "hdver":
                        Setting.hdver = msg[fkey];
                        break;
                    case "a_qufus":
                        Setting.a_qufus = msg[fkey];
                        break;
                    case "a_settings":
                        Setting.a_settings = msg[fkey];
                        break;
                    case "a_huodongs":
                        Setting.a_huodongs = msg[fkey];
                        break;
                    case "a_mails":
                        Setting.a_mails = msg[fkey];
                        break;
                    case "qufus":
                        Setting.qufus = msg[fkey];
                        break;
                    case "hefus":
                        Setting.hefus = msg[fkey];
                        break;
                    case "qufuNewId":
                        Setting.qufuNewId = msg[fkey];
                        break;
                    case "settings":
                        Setting.settings = msg[fkey];
                        break;
                    case "huodongs":
                        Setting.huodongs = msg[fkey];
                        break;
                    case "mails":
                        Setting.mails = msg[fkey];
                        break;
                    case "sysRwds":
                        Setting.sysRwds = msg[fkey];
                        break;
                    case "jjcNpcVer":
                        Setting.jjcNpcVer = msg[fkey];
                        break;
                }
            }
        });
    }
    /**
     * 子线程同步给主线程缓存
     */
    static tongbu_setting_cache(msg) {
        console.log("==子线程同步给主线程缓存===", process_1.default.pid);
        for (const fkey in msg) {
            switch (fkey) {
                case "createAt":
                    Setting.createAt = msg[fkey];
                    break;
                case "ver":
                    Setting.ver = msg[fkey];
                    break;
                case "hdver":
                    Setting.hdver = msg[fkey];
                    break;
                case "a_qufus":
                    Setting.a_qufus = msg[fkey];
                    break;
                case "a_settings":
                    Setting.a_settings = msg[fkey];
                    break;
                case "a_huodongs":
                    Setting.a_huodongs = msg[fkey];
                    break;
                case "a_mails":
                    Setting.a_mails = msg[fkey];
                    break;
                case "qufus":
                    Setting.qufus = msg[fkey];
                    break;
                case "hefus":
                    Setting.hefus = msg[fkey];
                    break;
                case "qufuNewId":
                    Setting.qufuNewId = msg[fkey];
                    break;
                case "settings":
                    Setting.settings = msg[fkey];
                    break;
                case "huodongs":
                    Setting.huodongs = msg[fkey];
                    break;
                case "mails":
                    Setting.mails = msg[fkey];
                    break;
                case "sysRwds":
                    Setting.sysRwds = msg[fkey];
                    break;
                case "jjcNpcVer":
                    Setting.jjcNpcVer = msg[fkey];
                    break;
            }
        }
    }
}
exports.default = Setting;
Setting.createAt = 0; //最终生成缓存的时间
Setting.ver = 0; //当前执行版本号
Setting.hdver = 0; //当前执行版本号（活动）
Setting.nextAt = 0; //下一次执行时间
//获取表格数据
Setting.a_qufus = {};
Setting.a_settings = {};
Setting.a_huodongs = {};
Setting.hefu_hds = {};
Setting.putong_hds = {};
Setting.a_mails = {};
//缓存【区服】部分
Setting.qufus = {}; //生效区服列表
Setting.qufuNewId = 1; //最新区服ID
Setting.hefus = {}; //合服表
//缓存【Setting】部分
Setting.settings = {}; //所有setting列表
//缓存【活动】部分
Setting.huodongs = {};
//缓存【邮件】部分
Setting.mails = {}; //所有邮件列表
//缓存【系统奖励】部分
Setting.sysRwds = {};
//检测竞技场榜单时间（一天一次），检测这周 和 下周
Setting.jjcNpcVer = {};
//# sourceMappingURL=setting.js.map