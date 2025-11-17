"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedRand = exports.gameMethod = void 0;
const gameCfg_1 = __importDefault(require("./gameCfg"));
class GameMethod {
    /**
     * 两个对象合并
     * @param obj1 from object
     * @param obj2 to object
     * @return obj2
     */
    objMerge(obj1, obj2) {
        obj1 = typeof obj1 != "object" ? {} : obj1;
        obj2 = typeof obj2 != "object" ? {} : obj2;
        for (const key in obj2) {
            if (obj1[key] == null) {
                obj1[key] = obj2[key];
                continue;
            }
            if (typeof obj2[key] == "object") {
                this.objMerge(obj1[key], obj2[key]);
                continue;
            }
            obj1[key] = obj2[key];
        }
        return obj1; //然后在把复制好的对象给return出去
    }
    /**
     * 数组合并
     */
    addArr(arr1, arr2) {
        let _arr1 = JSON.parse(JSON.stringify(arr1));
        let _arr2 = JSON.parse(JSON.stringify(arr2));
        for (const arr of _arr2) {
            _arr1.push(arr);
        }
        return _arr1;
    }
    /**
     * 业务判空 以下情况返回true
     * 字符串 : 空字符的为空
     * 数值: 0 为空 负数不为空
     * 数组: 长度为0
     * 对象: 没有节点
     * 布尔型 false
     */
    isEmpty(value) {
        if (value == null) {
            return true;
        }
        switch (typeof value) {
            case "string":
                if (value.length == null || value.length <= 0) {
                    return true;
                }
                break;
            case "object":
                for (const key in value) {
                    return false;
                }
                return true;
            case "number":
                if (value == 0) {
                    return true;
                }
                break;
            case "boolean":
                if (value == false) {
                    return true;
                }
                break;
        }
        return false;
    }
    /**
     * 通用深拷贝函数。
     * @param obj from object
     * @return obj2
     */
    objCopy(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
    /**
     *  相同kind 和 itemid 数组合并
     */
    mergeArr(arrs) {
        let resObj = {};
        for (const arr of arrs) {
            if (resObj[arr[0]] == null) {
                resObj[arr[0]] = {};
            }
            if (resObj[arr[0]][arr[1]] == null) {
                resObj[arr[0]][arr[1]] = 0;
            }
            resObj[arr[0]][arr[1]] += arr[2];
        }
        let resArr = [];
        for (const kind in resObj) {
            for (const id in resObj[kind]) {
                resArr.push([parseInt(kind), parseInt(id), resObj[kind][id]]);
            }
        }
        return resArr;
    }
    // 判断字符长度
    getStrCharacterLength(str) {
        let patternChinese = new RegExp("[\u4E00-\u9FA5]+"); // 中文
        let leng = 0;
        for (let index = 0; index < str.length; index++) {
            if (patternChinese.test(str[index])) {
                leng += 2;
            }
            else {
                leng += 1;
            }
        }
        return leng;
    }
    /**
     * 随机数
     * @param min
     * @param max
     */
    rand(min, max) {
        return Math.round((max - min + 1) * Math.random() - 0.5) + min;
    }
    //--------------属性计算 （主角基础属性 ） -------------------------
    // （天赋数值+装备数值+基础属性）*（1+百分比加成）=面板属性
    /**
     * 属性合并
     */
    ep_merge(_eps1, _eps2) {
        let eps = this.objCopy(_eps1);
        let ep2 = this.objCopy(_eps2);
        for (const key in ep2) {
            if (key == "fzSk") {
                continue;
            }
            eps[key] += ep2[key];
        }
        if (eps["hp_max"] != null) {
            eps["hp"] = eps["hp_max"];
        }
        return eps;
    }
    /**
     * {[key:string]:number} 属性合并
     */
    ep_mergeKv(_eps1, _eps2) {
        let eps = this.objCopy(_eps1);
        let ep2 = this.objCopy(_eps2);
        for (const key in ep2) {
            if (key == "fzSk") {
                continue;
            }
            if (eps[key] == null) {
                eps[key] = 0;
            }
            eps[key] += ep2[key];
        }
        return eps;
    }
    /**
     * {[key:string]:number} 属性合并 _eps2的key _eps1没有就不加
     */
    ep_mergeKv_has(_eps1, _eps2) {
        let eps = this.objCopy(_eps1);
        let ep2 = this.objCopy(_eps2);
        for (const key in ep2) {
            if (key == "fzSk") {
                continue;
            }
            if (eps[key] == null) {
                continue;
            }
            eps[key] += ep2[key];
        }
        return eps;
    }
    /**
     * {[key:string]:number} 属性合并 x 系数
     */
    ep_KvRate(_eps1, rate) {
        let eps = this.objCopy(_eps1);
        for (const key in eps) {
            if (key == "fzSk") {
                continue;
            }
            eps[key] = Math.floor(eps[key] * rate);
        }
        return eps;
    }
    /**
     * 属性初始化
     */
    ep_init() {
        let eps = {};
        let userEpPool = gameCfg_1.default.userEp.pool;
        for (const key in userEpPool) {
            if (key == "fzSk") {
                continue;
            }
            eps[userEpPool[key].key] = 0;
        }
        delete eps["fzSk"];
        eps["fzSk"] = {};
        return eps;
    }
    /**
     * 角色基础属性
     */
    ep_user() {
        let eps = {};
        let userEpPool = gameCfg_1.default.userEp.pool;
        for (const key in userEpPool) {
            if (key == "fzSk") {
                continue;
            }
            eps[userEpPool[key].key] = userEpPool[key].initEp;
        }
        return eps;
    }
    /**
     * 装备 包含 皮肤属性 和 附魔属性
     */
    ep_equip(actEquip) {
        let eps = {};
        for (const buwei in actEquip.chuan) {
            //装备属性
            eps = this.ep_mergeKv(eps, actEquip.chuan[buwei].eps);
            //皮肤属性
            for (const hh in actEquip.chuan[buwei].hhList) {
                let cfgPf = gameCfg_1.default.equipPifu.getItem(hh);
                if (cfgPf == null || this.isEmpty(cfgPf.eps) == true) {
                    continue;
                }
                eps = this.ep_mergeKv(eps, cfgPf.eps);
            }
            //附魔属性
            let addEps = {};
            for (const fmEps of actEquip.chuan[buwei].fmEps) {
                if (addEps[fmEps[0]] == null) {
                    addEps[fmEps[0]] = 0;
                }
                addEps[fmEps[0]] += fmEps[1];
            }
            eps = this.ep_mergeKv(eps, addEps);
        }
        return eps;
    }
    /**
     * 称号  所有称号属性累加
     */
    ep_chenghao(actChengH) {
        let eps = {};
        for (const chid in actChengH.list) {
            let cfg = gameCfg_1.default.chenghaoInfo.getItem(chid);
            if (cfg == null) {
                continue;
            }
            eps = this.ep_mergeKv(eps, cfg.addEp);
        }
        return eps;
    }
    /**
     * 翅膀  基础属性 + 穿戴特殊属性
     */
    ep_chibang(actChiBang, actJinxiu) {
        let eps = {};
        if (actChiBang.id == 0) {
            return eps; //未解锁
        }
        let cfg = gameCfg_1.default.chibangLevel.getItem(actChiBang.id.toString());
        if (cfg != null) {
            eps = this.ep_mergeKv(eps, cfg.ep0);
            let cfgStep = gameCfg_1.default.chibangStep.getItem(actChiBang.hh, cfg.step.toString());
            if (cfgStep != null) {
                eps = this.ep_mergeKv(eps, cfgStep.epBase); //加基础的
                eps = this.ep_mergeKv(eps, cfgStep.ep); // 加特殊的
            }
        }
        let minLv = -1;
        //淬炼
        for (const key in actChiBang.cleps) {
            let cfg = gameCfg_1.default.chibangClLv.getItem(key, actChiBang.cleps[key].toString());
            if (cfg == null) {
                continue;
            }
            eps = this.ep_mergeKv(eps, cfg.ep);
            if (minLv == -1) {
                minLv = actChiBang.cleps[key];
            }
            else {
                minLv = Math.min(minLv, actChiBang.cleps[key]);
            }
        }
        //淬炼大师
        let dsEps = {};
        let dsLv = 0;
        let cfgDsPool = gameCfg_1.default.chibangDashi.pool;
        for (const key in cfgDsPool) {
            if (cfgDsPool[key].level > minLv) {
                break;
            }
            if (dsLv > cfgDsPool[key].level) {
                continue;
            }
            dsLv = cfgDsPool[key].level;
            dsEps = cfgDsPool[key].ep;
        }
        if (actChiBang.hh != "") {
            let cfgJx = gameCfg_1.default.jinxiuByGlid.getItem(actChiBang.hh);
            if (cfgJx != null && actJinxiu.list[cfgJx.tzid] != null) {
                for (let index = 0; index <= actJinxiu.list[cfgJx.tzid].step; index++) {
                    let cfgStep = gameCfg_1.default.jinxiuStep.getItem(cfgJx.tzid, index.toString());
                    if (cfgStep == null || exports.gameMethod.isEmpty(cfgStep.eps) == true) {
                        continue;
                    }
                    eps = this.ep_mergeKv(eps, cfgStep.eps);
                }
            }
        }
        eps = this.ep_mergeKv(eps, dsEps);
        return eps;
    }
    /**
     * 宝石
     */
    ep_baoshi(actBaoShi, gxtid = "") {
        let eps = {};
        let addEp = { atk: 0, def: 0, speed: 0, hp_max: 0 };
        for (const xtid in actBaoShi.list) {
            if (gxtid != "" && xtid != gxtid) {
                continue;
            }
            let cfgBsInfo = gameCfg_1.default.baoshiInfo.getItem(xtid);
            if (cfgBsInfo == null) {
                continue;
            }
            for (const wzid in actBaoShi.list[xtid].xqs) {
                let iid = actBaoShi.list[xtid].xqs[wzid].iid;
                if (iid == "") {
                    continue;
                }
                let _itemid = actBaoShi.items[iid];
                let cfgBsItem = gameCfg_1.default.baoshiItem.getItem(_itemid);
                if (cfgBsItem == null) {
                    continue;
                }
                //取星图对应 宝石有效等级上限
                let maxLv = cfgBsItem.level;
                let cfgBsStep = gameCfg_1.default.baoshiStep.getItem(xtid, actBaoShi.list[xtid].level.toString());
                if (cfgBsStep != null) {
                    maxLv = Math.min(maxLv, cfgBsStep.lvMax);
                }
                //获取能量
                let cfgBsitem1 = gameCfg_1.default.baoshiByXzAndLv.getItem(cfgBsItem.xingzhuang.toString(), maxLv.toString());
                if (cfgBsitem1 != null) {
                    addEp = this.ep_mergeKv(addEp, this.ep_KvRate(cfgBsInfo.eps[parseInt(wzid) - 1], cfgBsitem1.nengliang));
                }
            }
        }
        //特殊主属性  特殊副属性
        let cfgMathz = gameCfg_1.default.mathInfo.getItem("baoshi_base_sx");
        if (cfgMathz != null && cfgMathz.pram.count != null) {
            addEp["bszhu"] += cfgMathz.pram.count;
        }
        for (const key in actBaoShi.tssx) {
            if (addEp[key] == null) {
                addEp[key] = 0;
            }
            if (actBaoShi.tssx[key] == 2) {
                let fep = addEp["bszhu"] == null ? 0 : addEp["bszhu"];
                addEp[key] += fep;
            }
            else {
                let fep = addEp["bsfu"] == null ? 0 : addEp["bsfu"];
                addEp[key] += fep;
            }
        }
        //特殊抗性
        let cfgMath = gameCfg_1.default.mathInfo.getItem("baoshi_base_sx");
        if (cfgMath != null && cfgMath.pram.count1 != null) {
            addEp["bshs"] += cfgMath.pram.count1;
        }
        for (const key in actBaoShi.tskx) {
            if (addEp[key] == null) {
                addEp[key] = 0;
            }
            if (actBaoShi.tskx[key] == 2) {
                let fep = addEp["bshs"] == null ? 0 : addEp["bshs"];
                addEp[key] += fep;
            }
        }
        //其他属性
        eps = this.ep_mergeKv(eps, addEp); //镶嵌效果
        return eps;
    }
    /**
     * 符石 (符石库 + 图鉴)
     */
    ep_fushi(actFuShi) {
        let eps = {};
        //符石库
        eps = this.ep_mergeKv(eps, this.ep_fushi_fsku(actFuShi));
        //图鉴
        eps = this.ep_mergeKv(eps, this.ep_fushi_tujian(actFuShi));
        return eps;
    }
    /**
     * 符石 - 符石库
     */
    ep_fushi_fsku(actFuShi) {
        let eps = {};
        //符石库
        for (const leibie in actFuShi.fsku.list) {
            for (const wzid in actFuShi.fsku.list[leibie]) {
                eps = this.ep_mergeKv(eps, actFuShi.fsku.list[leibie][wzid].eps); //额外固定效果
            }
        }
        //19	饲养员	水族箱属性增加5%
        let tjeps = this.ep_fushi_jitan(actFuShi);
        let add19 = tjeps["19"] == null ? 0 : tjeps["19"];
        eps = this.ep_KvRate(eps, (10000 + add19) / 10000);
        return eps;
    }
    /**
     * 符石 - 图鉴
     */
    ep_fushi_tujian(actFuShi) {
        let eps = {};
        let cfgPool = gameCfg_1.default.fushiTujian.pool;
        for (const key in cfgPool) {
            let isOver = true;
            for (const itemId of cfgPool[key].itemIds) {
                if (actFuShi.tujian[itemId] == null) {
                    isOver = false;
                    break;
                }
            }
            if (!isOver) {
                continue;
            }
            eps = this.ep_mergeKv(eps, cfgPool[key].eps);
        }
        return eps;
    }
    /**
     * 符石 - 祭坛属性 （符石自己的属性）
     */
    ep_fushi_jitan(actFuShi) {
        let eps = {};
        for (const jtid in actFuShi.jitan) {
            //祭坛等级属性
            let cfgJt = gameCfg_1.default.fushiJitan.getItem(jtid, actFuShi.jitan[jtid].saveid.toString());
            if (cfgJt != null && this.isEmpty(cfgJt.eps) == false) {
                eps = this.ep_mergeKv(eps, cfgJt.eps);
            }
            //祭坛附灵属性
            for (const xhid in actFuShi.jitan[jtid].epList) {
                let flKey = actFuShi.jitan[jtid].epList[xhid].ep[0];
                let flVal = actFuShi.jitan[jtid].epList[xhid].ep[1];
                if (eps[flKey] == null) {
                    eps[flKey] = 0;
                }
                eps[flKey] += flVal;
            }
        }
        return eps;
    }
    /**
     * 法阵
     * @param actFazhen
     * @param gzId 指定法阵格子ID
     */
    ep_fazhen(actFazhen) {
        let eps = {};
        let czEps = this.ep_fazhen_gezi(actFazhen, actFazhen.useGzId);
        //额外属性
        eps = this.ep_mergeKv(eps, czEps);
        return eps;
    }
    /**
     * 法阵 - 协同继承战斗 属性
     * @param actFazhen
     */
    ep_fazhen_xietong(actFazhen, gezi) {
        let eps = {};
        if (gezi == ""
            || actFazhen.list[gezi] == null
            || actFazhen.list[gezi].fzid == ""
            || actFazhen.list[gezi].xietong == "") {
            return eps;
        }
        let xietong = actFazhen.list[gezi].xietong;
        if (actFazhen.list[xietong] == null || actFazhen.list[xietong].fzid == "") {
            return eps;
        }
        let cfgFzPz = gameCfg_1.default.fazhenPinzhi.getItem(actFazhen.list[xietong].pinzhi.toString());
        if (cfgFzPz == null) {
            return eps;
        }
        let fzid = actFazhen.list[xietong].fzid;
        //基础属性
        let cfgInfo = gameCfg_1.default.fazhenInfo.getItem(fzid);
        let cfgLv = gameCfg_1.default.fazhenLevel.getItem(fzid, actFazhen.list[xietong].saveId.toString());
        if (cfgInfo != null && cfgLv != null) {
            eps = this.ep_mergeKv(eps, cfgLv.addEp);
            //升星
            let cfgFzStar = gameCfg_1.default.fazhenStar.getItem(cfgInfo.pinzhi.toString(), actFazhen.list[xietong].star.toString());
            if (cfgFzStar != null) {
                eps = this.ep_baifenbi_4(eps, cfgFzStar.eps);
            }
            //额外属性
            eps = this.ep_mergeKv(eps, actFazhen.list[xietong].otherEps);
            eps = this.ep_KvRate(eps, cfgFzPz.jcbase / 10000);
        }
        //技能属性 
        for (const skillId in actFazhen.list[xietong].sk) {
            let cfgSkill = gameCfg_1.default.fazhenSkill.getItem(skillId);
            if (cfgSkill == null || cfgSkill.type != 2) {
                continue;
            }
            let sklv = actFazhen.list[xietong].sk[skillId].lv;
            let cfgFzsk = gameCfg_1.default.fazhenSkillLv.getItem(skillId, sklv.toString());
            if (cfgFzsk == null) {
                continue;
            }
            let skEp = this.objCopy(cfgFzsk.cs);
            skEp = this.ep_KvRate(skEp, cfgFzPz.skbase / 10000);
            eps = this.ep_mergeKv(eps, skEp);
        }
        return eps;
    }
    /**
     * 法阵 格子对应属性
     * @param actFazhen
     * @param gzId 指定法阵格子ID
     * @param addXt 是否增加协同属性
     */
    ep_fazhen_gezi(actFazhen, gezi, addXt = 1) {
        let eps = {};
        if (actFazhen.list[gezi] == null || actFazhen.list[gezi].fzid == "") {
            return eps;
        }
        let fzid = actFazhen.list[gezi].fzid;
        let cfgInfo = gameCfg_1.default.fazhenInfo.getItem(fzid);
        //基础属性
        let cfgLv = gameCfg_1.default.fazhenLevel.getItem(fzid, actFazhen.list[gezi].saveId.toString());
        if (cfgInfo != null && cfgLv != null) {
            eps = this.ep_mergeKv(eps, cfgLv.addEp);
            //升星
            let cfgFzStar = gameCfg_1.default.fazhenStar.getItem(cfgInfo.pinzhi.toString(), actFazhen.list[gezi].star.toString());
            if (cfgFzStar != null) {
                eps = this.ep_baifenbi_4(eps, cfgFzStar.eps);
            }
        }
        //额外属性
        eps = this.ep_mergeKv(eps, actFazhen.list[gezi].otherEps);
        //+法阵协同
        if (addXt == 1) {
            eps = this.ep_mergeKv(eps, this.ep_fazhen_xietong(actFazhen, gezi));
        }
        return eps;
    }
    /**
     * 洞天 道童属性 只在洞天内生效
     */
    ep_dongtian(actDongTian) {
        let eps = {};
        if (actDongTian.xlLv == null) {
            return eps;
        }
        for (const type in actDongTian.xlLv) {
            let cfg = gameCfg_1.default.dongtianXlLv.getItem(type, actDongTian.xlLv[type].toString());
            if (cfg == null || this.isEmpty(cfg.eps) == true) {
                continue;
            }
            eps = this.ep_mergeKv(eps, cfg.eps);
        }
        return eps;
    }
    /**
     * 公会 - 秘笈
     */
    ep_clubMj(actClubMj) {
        let eps = {};
        for (const type in actClubMj.list) {
            let cfg = gameCfg_1.default.clubMiji.getItem(type, actClubMj.list[type].id.toString());
            if (cfg == null || this.isEmpty(cfg.eps) == true) {
                continue;
            }
            eps = this.ep_mergeKv(eps, cfg.eps);
        }
        return eps;
    }
    /**
     * 万象 - 命盘
     * @param actWanXiang
     * @returns
     */
    ep_wanxiang(actWanXiang) {
        let eps = {};
        //命盘
        for (const id in actWanXiang.mpList) {
            eps = this.ep_mergeKv(eps, actWanXiang.mpList[id].eps);
        }
        //上阵列表
        let szMfids = [];
        for (const _type in actWanXiang.mfZhan) {
            if (actWanXiang.mfZhan[_type] == "") {
                continue;
            }
            szMfids.push(actWanXiang.mfZhan[_type]);
        }
        //仙法 + 铭文
        for (const mfid in actWanXiang.mfList) {
            if (szMfids.indexOf(mfid) == -1) {
                continue; //没上阵 不加属性
            }
            let cfg = gameCfg_1.default.wanxiangXflv.getItem(actWanXiang.mfList[mfid].level.toString());
            if (cfg != null) {
                if (eps["hp_max"] == null) {
                    eps["hp_max"] = 0;
                }
                if (eps["atk"] == null) {
                    eps["atk"] = 0;
                }
                if (eps["def"] == null) {
                    eps["def"] = 0;
                }
                eps["hp_max"] += cfg.hp_max;
                eps["atk"] += cfg.atk;
                eps["def"] += cfg.def;
            }
            for (const mwid of actWanXiang.mfList[mfid].mwLock) {
                if (mwid == null || mwid == "") {
                    continue;
                }
                let cfgMw = gameCfg_1.default.wanxiangMingwen.getItem(mwid);
                if (cfgMw != null) {
                    eps = this.ep_mergeKv(eps, cfgMw.eps);
                }
            }
        }
        //图鉴
        for (const tjid in actWanXiang.tjlist) {
            if (actWanXiang.tjlist[tjid] < 1) {
                continue;
            }
            let cfgtj = gameCfg_1.default.wanxiangXftj.getItem(tjid);
            if (cfgtj != null) {
                let tjeps = this.ep_KvRate(cfgtj.eps, actWanXiang.tjlist[tjid]);
                eps = this.ep_mergeKv(eps, tjeps);
            }
        }
        return eps;
    }
    /**
     * 万象 - 命盘
     * @param actWanXiang
     * @returns
     */
    ep_jingguai(actJingGuai) {
        let eps = {};
        //精怪基础加成
        for (const jgid in actJingGuai.jgList) {
            if (actJingGuai.jgList[jgid].jihuo != 1) {
                continue; //没有激活
            }
            let cfgInfo = gameCfg_1.default.jingguaiInfo.getItem(jgid);
            if (cfgInfo == null) {
                continue;
            }
            for (const epOne of cfgInfo.eps) {
                if (eps[epOne[0]] == null) {
                    eps[epOne[0]] = 0;
                }
                eps[epOne[0]] += epOne[1]; //加基础
                for (const val of epOne[2]) {
                    for (let index = val[0]; index <= val[1]; index++) {
                        if (actJingGuai.jgList[jgid].level >= index) {
                            eps[epOne[0]] += val[2];
                        }
                    }
                }
            }
        }
        //羁绊
        let szcount = 0; //上阵数量
        let szPz = 999; //上阵最小品质
        for (const jgid of actJingGuai.szList[actJingGuai.szid]) {
            if (jgid == "") {
                continue;
            }
            let cfgInfo = gameCfg_1.default.jingguaiInfo.getItem(jgid);
            if (cfgInfo == null) {
                continue;
            }
            szcount += 1;
            szPz = Math.min(cfgInfo.pinzhi, szPz);
        }
        if (szcount >= 3) {
            let cfgPz = gameCfg_1.default.jingguaiPinzhi.getItem(szPz.toString());
            if (cfgPz != null) {
                eps = this.ep_mergeKv(eps, cfgPz.eps);
            }
        }
        return eps;
    }
    /**
     * 锦绣坊
     */
    ep_jinxiu(actJinxiu) {
        let eps = {};
        let locks = {}; //类ID：[总个数 ，解锁个数，最小等级]
        //单个套装属性
        let cfgPool = gameCfg_1.default.jinxiuInfo.pool;
        for (const key in cfgPool) {
            let leiId = cfgPool[key].id;
            let tzid = cfgPool[key].tzid;
            if (locks[leiId] == null) {
                locks[leiId] = [0, 0, 10000];
            }
            locks[leiId][0] += 1;
            if (actJinxiu.list[tzid] == null) {
                continue;
            }
            let step = actJinxiu.list[tzid].step;
            locks[leiId][1] += 1;
            locks[leiId][2] = Math.min(locks[leiId][2], step);
            if (leiId != "6") { //这个这边不加 ， 翅膀那边加 （穿戴中生效）
                for (let index = 0; index <= step; index++) {
                    let cfgStep = gameCfg_1.default.jinxiuStep.getItem(tzid, index.toString());
                    if (cfgStep == null || exports.gameMethod.isEmpty(cfgStep.eps) == true) {
                        continue;
                    }
                    eps = this.ep_mergeKv(eps, cfgStep.eps);
                }
            }
        }
        //额外属性
        for (const id in locks) {
            let cfg = gameCfg_1.default.jinxiuInfo.getItem(id, locks[id][1].toString());
            if (cfg != null && exports.gameMethod.isEmpty(cfg.eps) != true) {
                eps = this.ep_mergeKv(eps, cfg.eps);
            }
            if (locks[id][1] < locks[id][0]) {
                locks[id][2] = 0;
            }
            let cfgGglist = gameCfg_1.default.jinxiuGuanghuanList.getItemList(id);
            if (cfgGglist == null) {
                continue;
            }
            //加光环属性
            let ggEps = {};
            for (const key in cfgGglist) {
                if (cfgGglist[key].step <= locks[id][2]) {
                    ggEps = cfgGglist[key].eps;
                }
            }
            eps = this.ep_mergeKv(eps, ggEps);
        }
        return eps;
    }
    /**
     * 属性展示总属性 （面板属性）
     * 面板属性 = 角色基础属性
     */
    ep_all_base(sevBack) {
        //属性初始化
        let eps = this.ep_init();
        //+角色基础属性
        eps = this.ep_merge(eps, this.ep_user());
        //+装备 +皮肤
        if (sevBack.actEquip != null && sevBack.actEquip.a != null) {
            let equip_eps = this.ep_equip(sevBack.actEquip.a);
            eps = this.ep_merge(eps, equip_eps);
            eps.e_hp_max = equip_eps["hp_max"] == null ? 0 : equip_eps["hp_max"];
            eps.e_atk = equip_eps["atk"] == null ? 0 : equip_eps["atk"];
            eps.e_def = equip_eps["def"] == null ? 0 : equip_eps["def"];
        }
        //+称号
        if (sevBack.actChengH != null) {
            eps = this.ep_merge(eps, this.ep_chenghao(sevBack.actChengH));
        }
        //+翅膀
        if (sevBack.actChiBang != null && sevBack.actJinxiu != null) {
            eps = this.ep_merge(eps, this.ep_chibang(sevBack.actChiBang, sevBack.actJinxiu));
        }
        //+宝石
        if (sevBack.actBaoShi != null) {
            eps = this.ep_merge(eps, this.ep_baoshi(sevBack.actBaoShi));
        }
        //+符石
        if (sevBack.actFuShi != null && sevBack.actFuShi.a != null) {
            eps = this.ep_merge(eps, this.ep_fushi(sevBack.actFuShi.a));
        }
        //+洞天
        if (sevBack.actDongTian != null) {
            eps = this.ep_merge(eps, this.ep_dongtian(sevBack.actDongTian));
        }
        //+公会秘笈
        if (sevBack.actClubMj != null) {
            eps = this.ep_merge(eps, this.ep_clubMj(sevBack.actClubMj));
        }
        //+法阵
        if (sevBack.actFazhen != null) {
            //基础属性
            let zfEps = this.ep_fazhen(sevBack.actFazhen);
            //阵法的所有属性提高{0}
            if (sevBack.actShengQi != null && sevBack.actShengQi.a != null && sevBack.actShengQi.a.chuan == "15") {
                let sqid = sevBack.actShengQi.a.chuan; //圣器ID
                let cfgSqLv = gameCfg_1.default.shengqiLevel.getItem(sqid, sevBack.actShengQi.a.list[sqid].level.toString());
                if (cfgSqLv != null && cfgSqLv.skillVal[0] > 0) {
                    for (const key in zfEps) {
                        zfEps[key] += Math.floor((zfEps[key] * cfgSqLv.skillVal[0]) / 10000);
                    }
                }
            }
            eps = this.ep_merge(eps, zfEps);
            let useGzId = sevBack.actFazhen.useGzId;
            if (useGzId != "" && sevBack.actFazhen.list[useGzId] != null && sevBack.actFazhen.list[useGzId].fzid != "") {
                //技能属性 
                for (const skillId in sevBack.actFazhen.list[useGzId].sk) {
                    let sklv = sevBack.actFazhen.list[useGzId].sk[skillId].lv;
                    let cfgFzsk = gameCfg_1.default.fazhenSkillLv.getItem(skillId, sklv.toString());
                    if (cfgFzsk == null) {
                        continue;
                    }
                    eps = this.ep_mergeKv_has(eps, cfgFzsk.cs);
                }
            }
            //羁绊
            let cfgJbPool = gameCfg_1.default.fazhenJiban.pool;
            for (const _key in cfgJbPool) {
                let isPass = true;
                for (const _fzid of cfgJbPool[_key].fzids) {
                    if (sevBack.actFazhen.jiban[_fzid] == null) {
                        isPass = false;
                        break;
                    }
                }
                if (isPass == false) {
                    continue;
                }
                eps = this.ep_merge(eps, cfgJbPool[_key].eps);
            }
        }
        // +锦绣坊
        if (sevBack.actJinxiu != null) {
            eps = this.ep_merge(eps, this.ep_jinxiu(sevBack.actJinxiu));
        }
        // +万象
        if (sevBack.actWanXiang != null) {
            eps = this.ep_merge(eps, this.ep_wanxiang(sevBack.actWanXiang));
        }
        // +精怪
        if (sevBack.actJingGuai != null) {
            eps = this.ep_merge(eps, this.ep_jingguai(sevBack.actJingGuai));
        }
        //处理圣器
        if (sevBack.actShengQi != null && sevBack.actShengQi.a != null && sevBack.actShengQi.a.chuan != "") {
            let sqid = sevBack.actShengQi.a.chuan; //圣器ID
            eps.shengqi = parseInt(sqid);
            eps.shengqiLv = sevBack.actShengQi.a.list[sqid].level;
            //魔力增加{0}(百分比)
            if (eps.shengqi == 2) {
                let cfgSqLv = gameCfg_1.default.shengqiLevel.getItem(sqid, eps.shengqiLv.toString());
                if (cfgSqLv != null && cfgSqLv.skillVal[0] > 0) {
                    eps.speed += Math.floor((eps.speed * cfgSqLv.skillVal[0]) / 10000);
                }
            }
            //五项特殊属性中，最高项提高{0}(百分比)
            if (eps.shengqi == 3) {
                let cfgSqLv = gameCfg_1.default.shengqiLevel.getItem(sqid, eps.shengqiLv.toString());
                if (cfgSqLv != null && cfgSqLv.skillVal[0] > 0) {
                    let maxKey = "jiyun";
                    let maxVal = eps.jiyun;
                    if (maxVal < eps.shanbi) {
                        maxKey = "shanbi";
                        maxVal = eps.shanbi;
                    }
                    if (maxVal < eps.lianji) {
                        maxKey = "lianji";
                        maxVal = eps.lianji;
                    }
                    if (maxVal < eps.fanji) {
                        maxKey = "fanji";
                        maxVal = eps.fanji;
                    }
                    if (maxVal < eps.baoji) {
                        maxKey = "baoji";
                        maxVal = eps.baoji;
                    }
                    eps[maxKey] += cfgSqLv.skillVal[0];
                }
            }
            //五项抵抗属性中，最高项提高{0}(百分比)
            if (eps.shengqi == 4) {
                let cfgSqLv = gameCfg_1.default.shengqiLevel.getItem(sqid, eps.shengqiLv.toString());
                if (cfgSqLv != null && cfgSqLv.skillVal[0] > 0) {
                    let maxKey = "hsjiyun";
                    let maxVal = eps.hsjiyun;
                    if (maxVal < eps.hsshanbi) {
                        maxKey = "hsshanbi";
                        maxVal = eps.hsshanbi;
                    }
                    if (maxVal < eps.hslianji) {
                        maxKey = "hslianji";
                        maxVal = eps.hslianji;
                    }
                    if (maxVal < eps.hsfanji) {
                        maxKey = "hsfanji";
                        maxVal = eps.hsfanji;
                    }
                    if (maxVal < eps.hsbaoji) {
                        maxKey = "hsbaoji";
                        maxVal = eps.hsbaoji;
                    }
                    eps[maxKey] += cfgSqLv.skillVal[0];
                }
            }
            //反击会转化为连击，且连击额外提高{0}(百分比)
            // if (eps.shengqi == 11) {
            //     eps.lianji += eps.fanji;
            //     eps.fanji = 0;
            //     let cfgSqLv = Gamecfg.shengqiLevel.getItem(sqid, eps.shengqiLv.toString());
            //     if (cfgSqLv != null && cfgSqLv.skillVal[0] > 0) {
            //         eps.lianji += cfgSqLv.skillVal[0];
            //     }
            // }
        }
        // 道友
        if (sevBack.actDaoyou != null) {
            for (const daoyou of Object.values(sevBack.actDaoyou.daoyouMap)) {
                eps = this.ep_merge(eps, this.ep_daoyou(daoyou));
            }
        }
        return eps;
    }
    /**
     * 属性展示总属性 （面板属性）
     * 面板属性 = 角色基础属性
     */
    ep_all(sevBack) {
        let eps = this.ep_all_base(sevBack);
        eps = this.ep_baifenbi(eps);
        return eps;
    }
    /**
     * 仙侣战力属性
     */
    ep_xianlv_all(sevBack) {
        let eps = this.ep_xianlv(sevBack, "0");
        eps = this.ep_merge(eps, this.ep_xianlv_zhuzhan(sevBack));
        return eps;
    }
    /**
     * 属性转化成战力
     * @param type 默认  0默认  1怪物
     * @param eps 属性消息
     * @returns
     */
    ep_power(type, eps) {
        let power = 0;
        let cfgEpPool = gameCfg_1.default.userEp.pool;
        for (const key in cfgEpPool) {
            let rpKey = cfgEpPool[key].key;
            if (eps[rpKey] == null || typeof eps[rpKey] != "number") {
                continue;
            }
            let xishu = 0;
            switch (type) {
                case 1:
                    if (exports.gameMethod.isEmpty(cfgEpPool[key].momPower) == true) {
                        continue;
                    }
                    xishu = cfgEpPool[key].momPower;
                    break;
                default:
                    if (exports.gameMethod.isEmpty(cfgEpPool[key].power) == true) {
                        continue;
                    }
                    xishu = cfgEpPool[key].power;
                    break;
            }
            let addPower = Math.floor(xishu * eps[rpKey]);
            if (addPower >= 1) { //防错操作
                power += addPower;
            }
        }
        return power;
    }
    /**
     * 处理百分比
     */
    ep_baifenbi(eps) {
        if (eps.hp_max != null && eps.hp_max_per != null) {
            eps.hp_max += Math.floor((eps.hp_max * eps.hp_max_per) / 10000);
        }
        if (eps.atk != null && eps.atk_per != null) {
            eps.atk += Math.floor((eps.atk * eps.atk_per) / 10000);
        }
        if (eps.def != null && eps.def_per != null) {
            eps.def += Math.floor((eps.def * eps.def_per) / 10000);
        }
        if (eps.speed != null && eps.speed_per != null) {
            eps.speed += Math.floor((eps.speed * eps.speed_per) / 10000);
        }
        eps.hp = eps.hp_max;
        return eps;
    }
    /**
     * 处理百分比 处理基础4项百分比 加成
     */
    ep_baifenbi_4(eps, eps1) {
        if (eps.hp_max != null && eps1.hp_max_per != null) {
            eps.hp_max += Math.floor((eps.hp_max * eps1.hp_max_per) / 10000);
        }
        if (eps.atk != null && eps1.atk_per != null) {
            eps.atk += Math.floor((eps.atk * eps1.atk_per) / 10000);
        }
        if (eps.def != null && eps1.def_per != null) {
            eps.def += Math.floor((eps.def * eps1.def_per) / 10000);
        }
        if (eps.speed != null && eps1.speed_per != null) {
            eps.speed += Math.floor((eps.speed * eps1.speed_per) / 10000);
        }
        return eps;
    }
    /**
     * 试炼装备属性
     *
     */
    ep_pvw_equip(type, level) {
        let typeCfg = gameCfg_1.default.pvwType.getItem(type);
        if (typeCfg == null) {
            return {};
        }
        return this.ep_x(typeCfg.addEp, level);
    }
    /**
     * 属性倍数
     */
    ep_x(ep, bs) {
        let newep = {};
        for (const ek in ep) {
            newep[ek] = Math.floor(ep[ek] * bs);
        }
        return newep;
    }
    /**
     * 试炼 所有装备属性
     */
    ep_pvw(epos) {
        let allEp = {};
        for (const pos in epos) {
            allEp = this.ep_mergeKv(allEp, this.ep_pvw_equip(epos[pos].type, epos[pos].level));
        }
        return allEp;
    }
    /**
     * 战斗属性
     */
    ep_fight(sevBack) {
        let eps = this.ep_all_base(sevBack);
        eps = this.ep_baifenbi(eps);
        //+法阵主动技能
        if (sevBack.actFazhen != null && sevBack.actFazhen.list[sevBack.actFazhen.useGzId] != null && sevBack.actFazhen.list[sevBack.actFazhen.useGzId].fzid != "") {
            let sk = sevBack.actFazhen.list[sevBack.actFazhen.useGzId].sk;
            for (const skid in sk) {
                let cfgsk = gameCfg_1.default.fazhenSkill.getItem(skid);
                if (cfgsk != null && cfgsk.type == 1) {
                    eps["fzSk"][skid] = sk[skid].lv;
                }
            }
            //我方灵兽主动技能触发
            for (const skid in eps["fzSk"]) {
                let level = eps["fzSk"][skid];
                let cfgSkLv = gameCfg_1.default.fazhenSkillLv.getItem(skid, level.toString());
                if (cfgSkLv == null) {
                    continue;
                }
                let defa_per = cfgSkLv.cs["default_per"] == null ? 0 : cfgSkLv.cs["default_per"]; //万分比，要显示成百分比
                switch (skid) {
                    case "1": // 1	招摇草妖	战斗开始时，获得额外{0}生命上限，持续到战斗结束。 按装备的属性进行计算
                        eps.hp_max += Math.floor(eps.e_hp_max * defa_per / 10000);
                        eps.hp = eps.hp_max;
                        break;
                    case "2": // 2	金冠地蟾	战斗开始时，获得额外{0}防御，持续到战斗结束。按装备的属性进行计算
                        eps.def += Math.floor(eps.e_def * defa_per / 10000);
                        break;
                    case "3": // 3	赤顶玄蛇	战斗开始时，获得额外{0}攻击，持续到战斗结束按装备的属性进行计算
                        eps.atk += Math.floor(eps.e_atk * defa_per / 10000);
                        break;
                    case "52": // 52	玲珑锦鲤	战斗开始时，获得额外{0}减伤，持续到战斗结束。
                        eps.jianshang += defa_per;
                        break;
                    case "201": // 201	烈火麒麟	战斗开始时，生命值上限增加{0}。每次触发闪避时，恢复攻击力{1}的生命值，同时对敌人造成{2}攻击的伤害。
                        eps.hp_max += Math.floor(eps.hp_max * defa_per / 10000);
                        eps.hp = eps.hp_max;
                        break;
                    case "202": // 202	负山龙龟	战斗开始时，攻击力增加{0}。当生命值首次低于{1}时，额外再增加{2}攻击，持续到战斗结束。
                        eps.atk_per += defa_per;
                        break;
                    case "203": // 203	踏云墨挣	战斗开始时，攻击力增加{0}。每次触发连击时，偷取目标{1}的攻击力，持续{2}回合。
                        eps.atk_per += defa_per;
                        break;
                    case "206": // 206	落龙子  	战斗开始时，获得{0}的暴击伤害，持续到战斗结束。
                        eps.baonue += defa_per;
                        break;
                    case "207": // 207	暗夜陆吾	战斗开始时，获得额外{0}攻击，持续到战斗结束。按装备的属性进行计算
                        eps.atk += Math.floor(eps.e_atk * defa_per / 10000);
                        break;
                    case "251": // 251	狂傲血熊	战斗开始时，获得额外{0}晕眩，持续到战斗结束。
                        eps.jiyun += defa_per;
                        break;
                    case "252": // 252	摩柯战象	战斗开始时，获得额外{0}暴击，持续到战斗结束。
                        eps.baoji += defa_per;
                        break;
                    case "253": // 253	天命玄鸟	战斗开始时，获得额外{0}闪避，持续到战斗结束。
                        eps.shanbi += defa_per;
                        break;
                    case "254": // 254	千年角龙	战斗开始时，获得额外{0}连击，持续到战斗结束。
                        eps.lianji += defa_per;
                        break;
                    case "255": // 255	冥渊巨鲲	战斗开始时，获得额外{0}反击，持续到战斗结束。
                        eps.fanji += defa_per;
                        break;
                }
            }
        }
        return eps;
    }
    /**
     * 仙侣属性
     * sevBack 业务数据
     * gzid 合成区域1-n  出战0
     */
    ep_xianlv(sevBack, gzid) {
        //属性初始化
        let eps = this.ep_init();
        if (sevBack.actXianlv == null) {
            return eps;
        }
        if (gzid == "0" && sevBack.actXianlv.shangzhen.xlid == "") {
            return eps;
        }
        if (gzid != "0" && (sevBack.actXianlv.hecheng[gzid] == null || sevBack.actXianlv.hecheng[gzid].xlid == "")) {
            return eps;
        }
        let xlid = ""; //仙侣ID
        let xllv = 0; //仙侣等级
        if (gzid == "0") {
            xlid = sevBack.actXianlv.shangzhen.xlid;
            xllv = sevBack.actXianlv.shangzhen.level;
        }
        else if (["97", "98", "99"]) {
            if (sevBack.actXianlv.zhuzhan[gzid] != null) {
                xlid = sevBack.actXianlv.zhuzhan[gzid].xlid;
                xllv = sevBack.actXianlv.zhuzhan[gzid].level;
            }
        }
        else {
            xlid = sevBack.actXianlv.hecheng[gzid].xlid;
            xllv = sevBack.actXianlv.hecheng[gzid].level;
        }
        let cfg = gameCfg_1.default.xianlvInfo.getItem(xlid);
        if (cfg == null) {
            return eps;
        }
        // + 初始属性
        eps = this.ep_mergeKv_has(eps, cfg.eps);
        // 继承属性比例基数1W
        let epAll = this.ep_all(sevBack);
        for (const key in cfg.jicheng) {
            switch (key) {
                case "jc_speed_per":
                    eps.speed += Math.floor(epAll.speed * cfg.jicheng["jc_speed_per"] / 10000);
                    break;
                case "jc_hp_max_per":
                    eps.hp_max += Math.floor(epAll.hp_max * cfg.jicheng["jc_hp_max_per"] / 10000);
                    break;
                case "jc_atk_per":
                    eps.atk += Math.floor(epAll.atk * cfg.jicheng["jc_atk_per"] / 10000);
                    break;
                case "jc_def_per":
                    eps.def += Math.floor(epAll.def * cfg.jicheng["jc_def_per"] / 10000);
                    break;
            }
        }
        //资质属性 - 四项基础属性
        let ups = [];
        let _xllv = xllv;
        for (let index = 0; index < cfg.zz_lv.length; index++) {
            if (cfg.zz_lv[index + 1] == null) { //最后一级 一直读取最后档次
                ups.push(_xllv);
                break;
            }
            else {
                let max = cfg.zz_lv[index + 1] - cfg.zz_lv[index];
                if (_xllv > max) {
                    ups.push(max);
                    _xllv -= max;
                }
                else {
                    ups.push(_xllv);
                    break;
                }
            }
        }
        for (let index = 0; index < ups.length; index++) {
            eps.speed += ups[index] * (cfg.zz_speed[index] == null ? 0 : cfg.zz_speed[index]);
            eps.hp_max += ups[index] * (cfg.zz_hp[index] == null ? 0 : cfg.zz_hp[index]);
            eps.atk += ups[index] * (cfg.zz_atk[index] == null ? 0 : cfg.zz_atk[index]);
            eps.def += ups[index] * (cfg.zz_def[index] == null ? 0 : cfg.zz_def[index]);
        }
        //资质属性 - 资质忽视属性
        ups = [];
        let _index = -1;
        for (let index = 0; index < cfg.hs_lv.length; index++) {
            if (cfg.hs_lv[index] > xllv) {
                continue;
            }
            if (cfg.zz_hs[index] == null) {
                continue;
            }
            _index = Math.max(_index, index);
        }
        if (_index != -1) {
            eps.hsjiyun += cfg.zz_hs[_index];
            eps.hsshanbi += cfg.zz_hs[_index];
            eps.hslianji += cfg.zz_hs[_index];
            eps.hsfanji += cfg.zz_hs[_index];
            eps.hsbaoji += cfg.zz_hs[_index];
            eps.hsxixue += cfg.zz_hs[_index];
        }
        eps.hp = eps.hp_max;
        return eps;
    }
    /**
     * 仙侣属性 - 助战属性
     * sevBack 业务数据
     */
    ep_xianlv_zhuzhan(sevBack) {
        //属性初始化
        let eps = this.ep_init();
        if (sevBack.actXianlv == null) {
            return eps;
        }
        let xlzzs = [];
        for (const zzid in sevBack.actXianlv.zhuzhan) {
            if (sevBack.actXianlv.zhuzhan[zzid].xlid != "") {
                xlzzs.push([sevBack.actXianlv.zhuzhan[zzid].xlid, sevBack.actXianlv.zhuzhan[zzid].level]);
            }
        }
        let xlzzSks = [];
        for (const xlzz of xlzzs) {
            //技能1级寻找
            let _cfgXlInfo = gameCfg_1.default.xianlvInfo.getItem(xlzz[0]);
            if (_cfgXlInfo != null) {
                let zzSks1 = [];
                for (let index = 0; index < _cfgXlInfo.sk_xiezhan_lv.length; index++) {
                    if (_cfgXlInfo.sk_xiezhan_lv[index] <= xlzz[1]) {
                        zzSks1.push(_cfgXlInfo.sk_xiezhan[index].toString());
                    }
                }
                for (const zzSk1 of zzSks1) {
                    let cfgXlSk = gameCfg_1.default.xianlvSkill.getItem(zzSk1);
                    if (cfgXlSk != null) {
                        let xb = -1;
                        for (let index = 0; index < cfgXlSk.sk_lv.length; index++) {
                            if (cfgXlSk.sk_lv[index] <= xlzz[1]) {
                                xb = index;
                            }
                        }
                        if (xb >= 0) {
                            let skid2 = cfgXlSk.sks[xb].toString();
                            let cfgXlSkDe = gameCfg_1.default.xianlvSkill_desc.getItem(skid2);
                            if (cfgXlSkDe != null) {
                                xlzzSks.push([skid2, cfgXlSkDe.cs]);
                            }
                        }
                    }
                }
            }
        }
        //仙侣助战 - 出战仙侣全抵抗属性{0}
        for (const xlzzSk of xlzzSks) {
            if (["10101", "10102", "10103", "10104", "10105", "10106", "10107", "10108", "10109", "10110",
                "10111", "10201", "10202", "10203", "10204", "10205", "10206", "10207", "10208", "10209",
                "10210", "10211", "10301", "10302", "10303", "10304", "10305", "10306", "10307", "10308",
                "10309", "10310", "10311", "10401", "10402", "10403", "10404", "10405", "10406", "10407",
                "10408", "10409", "10410", "10411", "10501", "10502", "10503", "10504", "10505", "10506",
                "10507", "10508", "10509", "10510", "10511", "10601", "10602", "10603", "10604", "10605",
                "10606", "10607", "10608", "10609", "10610", "10611", "10701", "10702", "10703", "10704",
                "10705", "10706", "10707", "10708", "10709", "10710", "10711", "10801", "10802", "10803",
                "10804", "10805", "10806", "10807", "10808", "10809", "10810", "10811"].indexOf(xlzzSk[0]) != -1) {
                eps.hsbaoji += xlzzSk[1][0];
                eps.hsxixue += xlzzSk[1][0];
                eps.hsjiyun += xlzzSk[1][0];
                eps.hsfanji += xlzzSk[1][0];
                eps.hsshanbi += xlzzSk[1][0];
                eps.hslianji += xlzzSk[1][0];
            }
            //仙侣助战 - 抵抗暴击[协战]
            if (["301001", "301002", "301003",
                "406001", "406002", "406003", "406004",
                "510001", "510002", "510003", "510004", "510005"
            ].indexOf(xlzzSk[0]) != -1) {
                eps.hsbaoji += xlzzSk[1][0];
            }
            if (["604001", "604002", "604003", "604004", "604005", "604006", "604007",
                "611001", "611002", "611003", "611004", "611005", "611006", "611007",
                "701001", "701002", "701003", "701004", "701005", "701006", "701007", "701008"].indexOf(xlzzSk[0]) != -1) {
                eps.hsbaoji += xlzzSk[1][1];
            }
            if (["703001", "703002", "703003", "703004", "703005", "703006", "703007", "703008"].indexOf(xlzzSk[0]) != -1) {
                eps.hsbaoji += xlzzSk[1][2];
            }
            //仙侣助战 - 抵抗吸血[协战]
            if ([
                "302001", "302002", "302003",
                "404001", "404002", "404003", "404004",
                "507001", "507002", "507003", "507004", "507005"
            ].indexOf(xlzzSk[0]) != -1) {
                eps.hsxixue += xlzzSk[1][0];
            }
            if (["605001", "605002", "605003", "605004", "605005", "605006", "605007",
                "607001", "607002", "607003", "607004", "607005", "607006", "607007",
                "703001", "703002", "703003", "703004", "703005", "703006", "703007", "703008"
            ].indexOf(xlzzSk[0]) != -1) {
                eps.hsxixue += xlzzSk[1][1];
            }
            if (["701001", "701002", "701003", "701004", "701005", "701006", "701007", "701008"].indexOf(xlzzSk[0]) != -1) {
                eps.hsxixue += xlzzSk[1][2];
            }
            //仙侣助战 - 抵抗击晕[协战]
            if ([
                "303001", "303002", "303003",
                "403001", "403002", "403003", "403004",
                "508001", "508002", "508003", "508004", "508005"
            ].indexOf(xlzzSk[0]) != -1) {
                eps.hsjiyun += xlzzSk[1][0];
            }
            if (["603001", "603002", "603003", "603004", "603005", "603006", "603007",
                "610001", "610002", "610003", "610004", "610005", "610006", "610007",
                "704001", "704002", "704003", "704004", "704005", "704006", "704007", "704008"
            ].indexOf(xlzzSk[0]) != -1) {
                eps.hsjiyun += xlzzSk[1][1];
            }
            if (["705001", "705002", "705003", "705004", "705005", "705006", "705007", "705008"].indexOf(xlzzSk[0]) != -1) {
                eps.hsjiyun += xlzzSk[1][2];
            }
            //仙侣助战 - 抵抗连击[协战]
            if ([
                "304001", "304002", "304003",
                "402001", "402002", "402003", "402004",
                "509001", "509002", "509003", "509004", "509005"
            ].indexOf(xlzzSk[0]) != -1) {
                eps.hslianji += xlzzSk[1][0];
            }
            if (["606001", "606002", "606003", "606004", "606005", "606006", "606007",
                "608001", "608002", "608003", "608004", "608005", "608006", "608007",
                "705001", "705002", "705003", "705004", "705005", "705006", "705007", "705008"
            ].indexOf(xlzzSk[0]) != -1) {
                eps.hslianji += xlzzSk[1][1];
            }
            if (["702001", "702002", "702003", "702004", "702005", "702006", "702007", "702008"].indexOf(xlzzSk[0]) != -1) {
                eps.hslianji += xlzzSk[1][2];
            }
            //仙侣助战 - 抵抗闪避[协战]
            if (["305001", "305002", "305003",
                "401001", "401002", "401003", "401004",
                "512001", "512002", "512003", "512004", "512005"
            ].indexOf(xlzzSk[0]) != -1) {
                eps.hsshanbi += xlzzSk[1][0];
            }
            if (["601001", "601002", "601003", "601004", "601005", "601006", "601007",
                "609001", "609002", "609003", "609004", "609005", "609006", "609007",
                "702001", "702002", "702003", "702004", "702005", "702006", "702007", "702008"].indexOf(xlzzSk[0]) != -1) {
                eps.hsshanbi += xlzzSk[1][1];
            }
            if (["706001", "706002", "706003", "706004", "706005", "706006", "706007", "706008"].indexOf(xlzzSk[0]) != -1) {
                eps.hsshanbi += xlzzSk[1][2];
            }
            //仙侣助战 - 抵抗反击[协战]
            if (["306001", "306002", "306003",
                "405001", "405002", "405003", "405004",
                "511001", "511002", "511003", "511004", "511005"
            ].indexOf(xlzzSk[0]) != -1) {
                eps.hsfanji += xlzzSk[1][0];
            }
            if (["602001", "602002", "602003", "602004", "602005", "602006", "602007",
                "612001", "612002", "612003", "612004", "612005", "612006", "612007",
                "706001", "706002", "706003", "706004", "706005", "706006", "706007", "706008"
            ].indexOf(xlzzSk[0]) != -1) {
                eps.hsfanji += xlzzSk[1][1];
            }
            if (["704001", "704002", "704003", "704004", "704005", "704006", "704007", "704008"].indexOf(xlzzSk[0]) != -1) {
                eps.hsfanji += xlzzSk[1][2];
            }
            //仙侣助战 - 暴击增幅[协战]
            if (["501001", "501002", "501003", "501004", "501005",
                "603001", "603002", "603003", "603004", "603005", "603006", "603007",
                "609001", "609002", "609003", "609004", "609005", "609006", "609007",
                "704001", "704002", "704003", "704004", "704005", "704006", "704007", "704008",
                "802001", "802002", "802003", "802004", "802005", "802006", "802007", "802008"
            ].indexOf(xlzzSk[0]) != -1) {
                eps.baoji += xlzzSk[1][0];
            }
            //仙侣助战 - 反击增幅[协战]
            if (["502001", "502002", "502003", "502004", "502005",
                "605001", "605002", "605003", "605004", "605005", "605006", "605007",
                "610001", "610002", "610003", "610004", "610005", "610006", "610007",
                "703001", "703002", "703003", "703004", "703005", "703006", "703007", "703008",
                "801001", "801002", "801003", "801004", "801005", "801006", "801007", "801008"
            ].indexOf(xlzzSk[0]) != -1) {
                eps.fanji += xlzzSk[1][0];
            }
            //仙侣助战 - 击晕增幅[协战]
            if (["503001", "503002", "503003", "503004", "503005",
                "601001", "601002", "601003", "601004", "601005", "601006", "601007",
                "607001", "607002", "607003", "607004", "607005", "607006", "607007",
                "702001", "702002", "702003", "702004", "702005", "702006", "702007", "702008"
            ].indexOf(xlzzSk[0]) != -1) {
                eps.jiyun += xlzzSk[1][0];
            }
            if (["801001", "801002", "801003", "801004", "801005", "801006", "801007", "801008"].indexOf(xlzzSk[0]) != -1) {
                eps.jiyun += xlzzSk[1][1];
            }
            //仙侣助战 - 闪避增幅[协战]
            if (["504001", "504002", "504003", "504004", "504005",
                "701001", "701002", "701003", "701004", "701005", "701006", "701007", "701008"
            ].indexOf(xlzzSk[0]) != -1) {
                eps.shanbi += xlzzSk[1][0];
            }
            //仙侣助战 - 吸血增幅[协战]
            if (["505001", "505002", "505003", "505004", "505005",
                "604001", "604002", "604003", "604004", "604005", "604006", "604007",
                "606001", "606002", "606003", "606004", "606005", "606006", "606007",
                "608001", "608002", "608003", "608004", "608005", "608006", "608007",
                "612001", "612002", "612003", "612004", "612005", "612006", "612007",
                "705001", "705002", "705003", "705004", "705005", "705006", "705007", "705008"
            ].indexOf(xlzzSk[0]) != -1) {
                eps.xixue += xlzzSk[1][0];
            }
            if (["802001", "802002", "802003", "802004", "802005", "802006", "802007", "802008"].indexOf(xlzzSk[0]) != -1) {
                eps.xixue += xlzzSk[1][1];
            }
            //仙侣助战 - 连击增幅[协战]
            if (["506001", "506002", "506003", "506004", "506005",
                "602001", "602002", "602003", "602004", "602005", "602006", "602007",
                "611001", "611002", "611003", "611004", "611005", "611006", "611007",
                "706001", "706002", "706003", "706004", "706005", "706006", "706007", "706008"
            ].indexOf(xlzzSk[0]) != -1) {
                eps.lianji += xlzzSk[1][0];
            }
            if (["802001", "802002", "802003", "802004", "802005", "802006", "802007", "802008",
                "801001", "801002", "801003", "801004", "801005", "801006", "801007", "801008"].indexOf(xlzzSk[0]) != -1) {
                eps.lianji += xlzzSk[1][2];
            }
        }
        return eps;
    }
    /**
     * 单个道友的属性
     */
    ep_daoyou(daoyou) {
        let eps = {};
        for (const cfg of Object.values(gameCfg_1.default.daoyouFavorLv.pool)) {
            if (cfg.id === daoyou.did && cfg.flv <= daoyou.favorLv) {
                for (const kv of Object.values(cfg.eps)) {
                    eps = this.ep_mergeKv(eps, kv);
                }
            }
        }
        return eps;
    }
    /**
     * 解析洞天 矿车数据
     * @param carInfo
     * @param now
     * @returns edtime //离结束 还有多长时间 (0 已完成 )(未开始 -1)
     * @returns win //胜利方是谁 0守方 1攻方 (未开始默认0)
     * @returns nowpos nowpos, //当前位置
     */
    getDongTianCar(carInfo, now) {
        if (carInfo.stime <= 0) {
            //未启动
            return {
                edtime: -1,
                win: 0,
                nowpos: carInfo.dpos,
            };
        }
        //获取矿车配置
        let carCfg = gameCfg_1.default.dongtianCar.getItem(carInfo.id);
        if (carCfg == null) {
            console.error(`dongtianCar_err:${carInfo.id}`);
            return {
                edtime: -1,
                win: 0,
                nowpos: carInfo.dpos,
            };
        }
        let dnum = 0; //胜利方多出来的人数
        let pow = 1; //胜利方状态值
        let leng = carInfo.dpos; //距离(本方距离)
        let win = 0;
        let fevCard = false; //胜利方是否有终生卡
        let pfid = "100000"; //胜利方皮肤ID
        //人数对比
        if (carInfo.he.knum > carInfo.my.knum) {
            //进攻方胜利
            dnum = carInfo.he.knum - carInfo.my.knum;
            pow = carInfo.he.pow;
            leng = carCfg.lengs[2] - carInfo.dpos; //反向距离
            win = 1; //进攻方胜利
            fevCard = carInfo.he.fevCard; //终生卡
            pfid = carInfo.he.pfid;
        }
        else {
            //防守方胜利
            dnum = carInfo.my.knum - carInfo.he.knum;
            pow = carInfo.my.pow;
            fevCard = carInfo.my.fevCard; //终生卡
            pfid = carInfo.my.pfid;
        }
        //如果人数 <= 0 (防守方胜利 系数0.7)  就当防守方有0.7个人
        dnum = Math.max(dnum, 0.7);
        //状态系数
        let pow_r = 1;
        for (let i = 1; i <= 10; i++) {
            let powCfg = gameCfg_1.default.dongtianPow.getItem(i.toString());
            if (powCfg != null) {
                if (pow >= powCfg.min) {
                    pow_r = powCfg.rate;
                    break;
                }
            }
        }
        //哥布林速度系数
        let wkVel = 1;
        let cfgMath = gameCfg_1.default.mathInfo.getItem("dongtian_wkVel");
        if (cfgMath == null || cfgMath.pram.count == null) {
            console.error(`dongtian_wkVel`);
        }
        else {
            wkVel = cfgMath.pram.count;
        }
        //总速度
        let vel = (dnum * wkVel * pow_r) / 100;
        //终生卡 速度加成 +5%
        let sdadd = 10000;
        if (fevCard) {
            sdadd += 500;
        }
        let cfgepf = gameCfg_1.default.equipPifu.getItem(pfid);
        if (cfgepf != null && cfgepf.eps["laqusudu"] != null) {
            sdadd += cfgepf.eps["laqusudu"];
        }
        vel = (vel * sdadd) / 10000;
        //总的需要时间 计算公式
        let allTime = Math.ceil(leng / vel);
        //经过时间
        let dtime = now - carInfo.stime;
        if (dtime >= allTime) {
            //已完成
            return {
                edtime: 0,
                win: win,
                nowpos: win ? carCfg.lengs[2] : 0,
            };
        }
        else {
            //未完成 计算 当前位置偏移量
            let dpos = dtime * vel;
            //当前位置
            let nowpos = carInfo.dpos;
            if (win > 0) {
                nowpos += dpos;
                nowpos = Math.floor(nowpos); //进攻方胜利 取余偏向防守方(小值)
            }
            else {
                nowpos -= dpos;
                nowpos = Math.ceil(nowpos); //防守方胜利 取余偏向进攻方(大值)
            }
            return {
                edtime: allTime - dtime,
                win: win,
                nowpos: nowpos,
            };
        }
    }
    /**
     * 解析洞天数据
     * @param uuid 自己的uuid
     * @param dtInfo
     */
    getDongTianShow(uuid, dtInfo) {
        let dtCfg = gameCfg_1.default.dongtianDtlv.getItem(dtInfo.dtlv.toString());
        if (dtCfg == null) {
            console.error(`dongtianLevel_err:${dtInfo.level}`);
            return {
                kmax: 0,
                busy: 0,
            };
        }
        dtCfg.worker; //苦力上限
        let busy = 0; //忙碌中的苦力人数
        //干活的人
        for (const fuuid in dtInfo.rob) {
            for (const pos in dtInfo.rob[fuuid]) {
                if (fuuid == uuid) {
                    busy += dtInfo.rob[fuuid][pos].my.knum;
                }
                else {
                    busy += dtInfo.rob[fuuid][pos].he.knum;
                }
            }
        }
        //获取我的苦力人数 和上限
        return {
            kmax: dtCfg.worker + dtInfo.dtNum,
            busy: busy,
        };
    }
    /**
     * 获取试炼状态
     */
    pvwStatic(info) {
        let cfg = gameCfg_1.default.pvwMonster.getItem((info.rwdId + 1).toString());
        if (cfg == null || cfg.prob.length <= 0) {
            return "fight";
        }
        if (info.nowId > info.rwdId) {
            return "sel";
        }
        return "fight";
    }
    /**
     * 钻石购买金币获得道具公式
     * @param id 配置表档位ID
     * @param level 角色等级
     */
    shopCoinItem(id, level) {
        let cfg = gameCfg_1.default.shopCoin.getItem(id);
        if (cfg == null) {
            return [1, 2, 1];
        }
        let count = cfg.rate * Math.min(11 + Math.floor(level / 2), 60);
        return [1, 2, count];
    }
    /**
     * 道具类型12 固定属性装备
     * 转临时属性
     */
    linshi_kind12(itemid) {
        let cfg = gameCfg_1.default.itemEquip.getItem(itemid);
        if (cfg != null) {
            return {
                //装备特殊处理
                equipId: cfg.equipId,
                mrhh: cfg.mrhh,
                hh: "",
                level: cfg.level,
                eps: cfg.eps,
                isNew: 1,
            };
        }
        return null;
    }
    /**
     * 计算兽灵起源挂机奖励
     * 法阵信息
     * 兽灵起源信息
     */
    hdQiYuanModelRate(out, data, fazhen) {
        //先计算出 速率
        let rate = 0;
        //遍历已存在XX
        for (const pzid in out.tree.list) {
            //遍历品质
            if (data.tree.list[pzid] == null) {
                console.error(`hd_cfg_err:hdQiYuanModelRate:${pzid}`); //活动配置异常
                continue;
            }
            //遍历开放序号 (1开始)
            for (let ygzid = 1; ygzid <= out.tree.list[pzid].open; ygzid++) {
                if (exports.gameMethod.isEmpty(out.tree.list[pzid].fzList[ygzid]) || fazhen.list[out.tree.list[pzid].fzList[ygzid]] == null) {
                    //空位 没上
                    rate += data.tree.list[pzid].make["2"][0];
                }
                else {
                    let fazhenGzid = out.tree.list[pzid].fzList[ygzid];
                    let fzpinzhi = fazhen.list[fazhenGzid].pinzhi;
                    //获取品质
                    let cfgFzInfo = gameCfg_1.default.fazhenInfo.getItem(fazhen.list[out.tree.list[pzid].fzList[ygzid]].fzid);
                    if (cfgFzInfo != null && cfgFzInfo.wuxing == Number(pzid)) {
                        //品质一致
                        rate += data.tree.list[pzid].make[fzpinzhi.toString()][2];
                    }
                    else {
                        //品质不一样
                        rate += data.tree.list[pzid].make[fzpinzhi.toString()][1];
                    }
                }
            }
        }
        //根据速率 结算
        return rate;
    }
    //根据速度和 当前XX 计算出当前总积分
    hdQiYuanModelTotol(out, data, rate, nowTime) {
        //过了多长时间
        let dtime = nowTime - out.tree.s_time;
        //根据速度 掉落
        let score = Math.round((rate * dtime) / 3600);
        let totol = score + out.tree.s_num;
        if (totol > data.tree.scoreMax) {
            //实际产出
            let sj = data.tree.scoreMax - out.tree.s_num;
            //实际产出 所需时间
            dtime = Math.round((sj / rate) * 3600);
            //获得的总产出
            totol = data.tree.scoreMax;
        }
        //根据速率 结算
        return {
            totol: totol,
            dtime: dtime,
        };
    }
    /**
     * 计算心魔积分范围
     */
    hdXinMoScore(xmId, cfg, actJingGuai, gzids) {
        let xinmoCfg = cfg.xinmo[xmId];
        if (xinmoCfg == null) {
            console.error(`xmId_err :${xmId}`);
            return [0, 0];
        }
        //初始积分: 心魔积分
        let scores = [xinmoCfg.score[0], xinmoCfg.score[1]];
        for (let i = 0; i < gzids.length; i++) {
            let gzid = gzids[i];
            let addOne = exports.gameMethod.hdXinMoScoreOne(cfg, actJingGuai, gzid);
            scores[0] += addOne[0];
            scores[1] += addOne[1];
        }
        return scores;
    }
    /**
     * 心魔计算 一个宠物加的积分
     */
    hdXinMoScoreOne(cfg, jginfo, gzid) {
        //初始积分: 心魔积分
        let sadd = [0, 0];
        //是否存在
        if (jginfo.jgList[gzid] == null || jginfo.jgList[gzid].jihuo != 1) {
            console.error(`fzInfo_null :${gzid}`);
            return sadd;
        }
        //获取法阵等级配置
        let cfgjg = gameCfg_1.default.jingguaiInfo.getItem(gzid);
        if (cfgjg == null) {
            console.error(`cfgjg_null :${gzid}`);
            return sadd;
        }
        //等级积分累加
        if (cfg.sMath.xs[cfgjg.pinzhi] != null) {
            //[积分价值,积分下限,积分上限,系数下限,系数上限]
            let pzcfg = cfg.sMath.xs[cfgjg.pinzhi];
            //积分价值
            sadd[0] += pzcfg[0];
            sadd[1] += pzcfg[0];
            //积分上下限
            sadd[0] += pzcfg[1];
            sadd[1] += pzcfg[2];
            //积分系数 * 等级(saveId)
            sadd[0] += jginfo.jgList[gzid].level * pzcfg[3];
            sadd[1] += jginfo.jgList[gzid].level * pzcfg[4];
        }
        return sadd;
    }
    /**
     * 龙宫运保奖励
     * @param yun 运宝信息
     * @param type 0总奖励 1:运宝最后奖励 2：抢夺奖励 3:完美上交保护费剩余奖励 4保护费奖励
     */
    longgong_yubao(yun, type) {
        //结算
        let cfg = gameCfg_1.default.longgongJiaofu.getItem(yun.jiaofu);
        if (cfg == null) {
            return [];
        }
        let cfgItems = exports.gameMethod.objCopy(cfg.items);
        let items = [];
        if (yun.lgLv == null || yun.lgLv == 0) {
            items = cfgItems;
        }
        else {
            let cfgLv = gameCfg_1.default.longgongLevel.getItem(yun.lgLv.toString());
            if (cfgLv != null) { //上香加成
                for (const item of cfgItems) {
                    let isPass = false;
                    for (const _item2 of cfgLv.items2) {
                        if (item[0] == _item2[0] && item[1] == _item2[1]) {
                            items.push([item[0], item[1], Math.floor(item[2] + item[2] * _item2[2] / 10000)]);
                            isPass = true;
                            break;
                        }
                    }
                    if (isPass == false) {
                        items.push(item);
                    }
                }
                items = exports.gameMethod.addArr(items, cfgLv.items1); //加上固定加成
            }
        }
        items = exports.gameMethod.mergeArr(items);
        if (type == 0) { //0总奖励 1:运宝最后奖励 2：抢夺奖励 3:完美上交保护费剩余奖励 4保护费奖励
            return items;
        }
        let lastItems = []; //奖励
        let bqPool = 0; //被抢比例
        let cfgMath = gameCfg_1.default.mathInfo.getItem("longgong_duoqu");
        //0总奖励 1:运宝最后奖励 2：抢夺奖励 3:完美上交保护费剩余奖励 4保护费奖励
        if (type == 1) {
            if (cfgMath != null && cfgMath.pram.count != null) {
                bqPool = yun.beida * cfgMath.pram.count;
            }
            for (const item of items) {
                let lcCount = item[2] - Math.floor(item[2] * bqPool / 100);
                if (lcCount > 0) {
                    lastItems.push([item[0], item[1], lcCount]);
                }
            }
            return lastItems;
        }
        //0总奖励 1:运宝最后奖励 2：抢夺奖励 3:完美上交保护费剩余奖励 4保护费奖励
        if (type == 2) {
            if (cfgMath != null && cfgMath.pram.count != null) {
                bqPool = cfgMath.pram.count;
            }
            for (const item of items) {
                let qcCount = Math.ceil(item[2] * bqPool / 100);
                if (qcCount > 0) {
                    lastItems.push([item[0], item[1], qcCount]);
                }
            }
            return lastItems;
        }
        //0总奖励 1:运宝最后奖励 2：抢夺奖励 3:完美上交保护费剩余奖励 4保护费奖励
        if (type == 3) {
            for (const item of items) {
                let lcCount = item[2] - Math.ceil(item[2] * 10 / 100);
                if (lcCount > 0) {
                    lastItems.push([item[0], item[1], lcCount]);
                }
            }
            return lastItems;
        }
        //0总奖励 1:运宝最后奖励 2：抢夺奖励 3:完美上交保护费剩余奖励 4保护费奖励
        if (type == 4) {
            for (const item of items) {
                let lcCount = Math.ceil(item[2] * 10 / 100);
                if (lcCount > 0) {
                    lastItems.push([item[0], item[1], lcCount]);
                }
            }
            return lastItems;
        }
        return lastItems;
    }
    /**
     * 龙宫运宝跑图
     */
    longgong_run(_yun, xhuo, newTime) {
        let yun = exports.gameMethod.objCopy(_yun);
        if (yun.ybEat <= newTime) {
            return yun; //运宝结束
        }
        let cfg = gameCfg_1.default.longgongJiaofu.getItem(yun.jiaofu);
        if (cfg == null) {
            return yun; //找不到配置 直接返回
        }
        let cfgMath = gameCfg_1.default.mathInfo.getItem("longgong_xiansheng");
        if (cfgMath == null || cfgMath.pram.count == null) {
            return yun; //找不到配置 直接返回
        }
        //显圣结束时间
        if (yun.ybSat < xhuo.fAt) { //显圣阶段
            if (newTime <= xhuo.fAt) { //都在显圣范围内
                yun.ybpos += Math.floor((newTime - yun.ybSat) * 100 / cfgMath.pram.count);
                yun.ybSat = newTime;
                return yun;
            }
            yun.ybpos += Math.floor((xhuo.fAt - yun.ybSat) * 100 / cfgMath.pram.count);
            yun.ybSat = xhuo.fAt;
        }
        yun.ybpos += newTime - yun.ybSat;
        yun.ybSat = newTime;
        return yun;
    }
    //判断uuid是否npc
    isNpc(fuuid) {
        if (Number(fuuid) < 10000) {
            return true;
        }
        return false;
    }
    /**
     * 获取天宫 跨服表
     * @param sid  本服ID
     * @param qufuList 区服表
     * @param sevOpens //合服 => 跨服ID
     */
    getTianGongSevIds(sid, qufuList, sevOpens) {
        if (qufuList[sid] == null) {
            console.error(`getTianGongSevIds sid err`);
            return [];
        }
        let heid = qufuList[sid].heid;
        //根据合服id获取我的 跨服ID
        if (sevOpens[heid] == null || sevOpens[heid].open <= 0) {
            //本合服 未参与天宫跨服
            return [];
        }
        let ksid = sevOpens[heid].ksid;
        let sevs = [];
        //遍历所有服务器看大家的跨服ID 是否和我一致
        for (const _sid in qufuList) {
            let _hsid = qufuList[_sid].heid;
            if (sevOpens[_hsid] == null || sevOpens[_hsid].open <= 0) {
                //本合服 未参与天宫跨服
                continue;
            }
            if (sevOpens[_hsid].ksid == ksid) {
                sevs.push(qufuList[_sid]);
            }
        }
        //排序?
        return sevs;
    }
    /**
     * 随机排列一个数组
     */
    equip_change(_actEquip) {
        let actEquip = exports.gameMethod.objCopy(_actEquip);
        let outf = {
            chuan: actEquip.chuan,
            box: actEquip.box,
            linshi: actEquip.linshi,
            linshi95: {},
            linshiOld: actEquip.linshiOld,
            jjc: actEquip.jjc,
            count: actEquip.count,
        };
        for (const xhid in _actEquip.linshi95) {
            let cfg = gameCfg_1.default.equipInfo.getItem(_actEquip.linshi95[xhid].equipId);
            if (cfg == null) {
                continue;
            }
            let tip = 1;
            if (_actEquip.linshi95[xhid].eps["hp_max"] == null || (actEquip.chuan[cfg.buwei] != null && actEquip.chuan[cfg.buwei].eps["hp_max"] != null && actEquip.chuan[cfg.buwei].eps["hp_max"] >= _actEquip.linshi95[xhid].eps["hp_max"])) {
                tip = 0;
            }
            if (_actEquip.linshi95[xhid].eps["def"] == null || (actEquip.chuan[cfg.buwei] != null && actEquip.chuan[cfg.buwei].eps["def"] != null && actEquip.chuan[cfg.buwei].eps["def"] >= _actEquip.linshi95[xhid].eps["def"])) {
                tip = 0;
            }
            if (_actEquip.linshi95[xhid].eps["atk"] == null || (actEquip.chuan[cfg.buwei] != null && actEquip.chuan[cfg.buwei].eps["atk"] != null && actEquip.chuan[cfg.buwei].eps["atk"] >= _actEquip.linshi95[xhid].eps["atk"])) {
                tip = 0;
            }
            if (_actEquip.linshi95[xhid].eps["speed"] == null || (actEquip.chuan[cfg.buwei] != null && actEquip.chuan[cfg.buwei].eps["speed"] != null && actEquip.chuan[cfg.buwei].eps["speed"] >= _actEquip.linshi95[xhid].eps["speed"])) {
                tip = 0;
            }
            outf.linshi95[xhid] = {
                equipId: _actEquip.linshi95[xhid].equipId,
                mrhh: _actEquip.linshi95[xhid].mrhh,
                hh: _actEquip.linshi95[xhid].hh,
                level: _actEquip.linshi95[xhid].level,
                eps: _actEquip.linshi95[xhid].eps,
                isNew: _actEquip.linshi95[xhid].isNew,
                tip: tip //0:低于原先属性 1高于
            };
        }
        return outf;
    }
}
//输出
exports.gameMethod = new GameMethod();
//种子随机
class SeedRand {
    constructor(seed) {
        this.seed = seed;
    }
    /**
     * 核心方法 输出一个小数
     */
    random() {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280.0;
    }
    /**
     * 按照范围获取一个随机数
     */
    rand(min, max) {
        let _rd = Math.round((max - min + 1) * this.random() - 0.5) + min;
        return _rd;
    }
    /**
     * 通过道具数组格式 概率获取一件道具
     * ps : 第四位是概率
     */
    getProbByItems(data, max = 0, xb = 3) {
        if (data == null || data.length <= 0) {
            return null;
        }
        if (max == 0) {
            for (const item of data) {
                if (item[xb] == null) {
                    continue;
                }
                max += item[xb];
            }
        }
        let r = this.rand(1, max);
        for (const item of data) {
            if (item[xb] == null) {
                continue;
            }
            if (r <= item[xb]) {
                return item;
            }
            r -= item[xb];
        }
        return null;
    }
    /**
     * 随机排列一个数组
     */
    arrayShuffle(arr) {
        let len = arr.length;
        for (let i = 0; i < len - 1; i++) {
            let index = this.rand(0, len - i - 1);
            let temp = arr[index];
            arr[index] = arr[len - i - 1];
            arr[len - i - 1] = temp;
        }
    }
}
exports.SeedRand = SeedRand;
//# sourceMappingURL=gameMethod.js.map