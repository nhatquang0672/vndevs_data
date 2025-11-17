"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fight = void 0;
const Xys_1 = require("./Xys");
const gameMethod_1 = require("./gameMethod");
const gameCfg_1 = __importDefault(require("./gameCfg"));
// 伤害公式：			
// 	普通伤害=max((我方攻击-敌方防御)*(1+我方增伤-敌方减伤),我方攻击*0.15)*RANDBETWEEN(0.97,1.03)		
// 	暴击伤害=max((我方攻击-敌方防御)*(1+我方增伤-敌方减伤) *（2+我方增暴-敌方减暴）,我方攻击*0.15)*RANDBETWEEN(0.97,1.03)		
// 战斗逻辑			
// 1.先判断是否命中			
// 	1.敌人如果处于晕眩中，则直接命中		
// 	2.如果敌人处于非晕眩中，则按命中率判断		
// 	命中率=1+我方抗闪避-敌方闪避		
// 		a如果未命中，则战斗结束	
// 		b如果命中则先判断是否触发暴击	
// 		c无论有没有触发暴击，则继续判断是否触发连击和晕眩	
// 		暴击率=max((我方暴击-敌方抗暴击),0)	
// 		连击率=max((我方连击-敌方抗连击),0)	
// 		晕眩率=max((我方晕眩-敌方抗晕眩),0)	
// 		判断连击和晕眩的顺序随机，两个情况只能出一种，如果已经触发了连击则不再判断是否触发晕眩，如果已经触发了晕眩则不再判断是否触发连击	
// 		也就是说暴击可以和连击一起出现，也可以和晕眩一起出现，但是连击不能和晕眩一起出现。	
// 			如果触发晕眩，则不判断敌人是否触发反击
// 			如果没有触发晕眩，则判断敌人是否触发反击
// 			敌人的触发反击率=max((敌方反击-我方抗反击),0)
// 		1触发连击后的第二次攻击不能被敌人闪避，必须百分百命中，（也就是说不会被敌人闪避）	
// 		2触发连击后的第二次攻击可以继续判断是否触发暴击（也就是可以继续触发暴击）	
// 		3触发连击后的第二次攻击不会对敌人造成晕眩（也就是不能晕眩敌人）	
// 		4触发连击后的第二次攻击可以判断是否被敌人反击（也就是可以被敌人反击）	
// 			如果触发晕眩，则轮到我方继续攻击，若命中，可以继续判断是否触发暴击、是否触发连击或者晕眩，且不会被敌方反击
// 吸血规则			
// 只要给对方造成伤害就会造成吸血			
// 吸血值=伤害值*max(（我方吸血-敌方抗吸血）,0)			
// 回血规则			
// 第五回合的时候，会按自己血量上限的百分百进行血量恢复			
// 回血值=我方血量上限*max((我方回血-敌方抗回血),0)			
// 战斗中先手值的判定规则			
// 战斗中的先手值=我方基础先手值*(1-max((敌方诅咒-我方抗诅咒),0))			
//战斗    =》         命中    暴击   击晕     连击和反击
/**
 * 【回合制游戏】
 * 战斗思想：支持1v1
 */
class Fight {
    constructor(fightStart) {
        //存储所有战场日志
        this.outf = {
            win: 2,
            log: {},
        };
        this.uuids = {}; //存放身份
        this.speedLoop = {}; //轮询出手存放 取第一个，出手完放最后一个
        this.teams = {}; //战斗成员列表
        this.siles = []; //记录当前回合死了的身份标识列表
        this.cfwanxiang = false; //是否触发万象技能
        this.teams = gameMethod_1.gameMethod.objCopy(fightStart.teams); //战斗成员列表
        this.seedRand = new gameMethod_1.SeedRand(fightStart.seed); //随机种子
        this.from = fightStart.from; //战斗类型
        this.outf = {
            win: 2,
            log: {},
        };
        this.huihe = 0;
        this.isOver = false;
        this.siles = [];
        this.war_init(); //战斗初始化数据  谁优先 + 初始化战斗成员信息
        this.war_loop(); // 执行一行(一个战场) 出手轮询
    }
    /**
     * 输出我方日志
     */
    get_outf() {
        return this.outf;
    }
    /**
     * 总伤害
     */
    get_hurt() {
        let allHurt = this.uuids["10"].hurt;
        if (this.uuids["11"] != null) {
            allHurt += this.uuids["11"].hurt;
        }
        return allHurt;
    }
    /**
     * 战斗初始化
     */
    war_init() {
        // 战斗中先手值的判定规则 N 打 N  两个两个比较
        // 战斗中的先手值=我方基础先手值*(1-max((敌方诅咒-我方抗诅咒),0))
        //获取此次战斗 有几个人参与
        let cqiids = [];
        let _iids = Object.keys(this.teams);
        //需要在战斗内部处理的技能
        let cfgFzIds = [
            "51", "53",
            "101", "102", "103", "104", "105", "106", "151", "152", "153", "154", "155", "156", "157",
            "201", "202", "203", "204", "205", "206", "207"
        ];
        let cfgSqIds = ["1", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"]; //圣器
        //初始化身份标识
        for (const _iid of _iids) {
            //0:默认无  998:玩家  999:怪物  1:人神  2:灵仙  3:地府  4:古神
            let role = 0;
            let zhanwei = this.teams[_iid].zhanwei;
            if (_iid == "10" || _iid == "20") {
                let xlid = (parseInt(_iid) + 1).toString();
                if (this.teams[xlid] != null && this.teams[xlid].zhanwei == 1) {
                    zhanwei = 2;
                }
                role = 998;
                if (parseInt(this.teams[_iid].fid) < 100000) {
                    role = 999;
                }
            }
            //全部法阵技能统一计算
            let fzSk = {};
            for (const _fzid of cfgFzIds) {
                fzSk[_fzid] = { "default": 0, "default1": 0, "default2": 0, "default_per": 0, "default_per1": 0, "default_per2": 0, "round": 0, "count": 0 };
                if (this.teams[_iid].eps["fzSk"][_fzid] == null) {
                    continue; //过滤 我没有带的法阵技能
                }
                let cfgSk = gameCfg_1.default.fazhenSkillLv.getItem(_fzid, this.teams[_iid].eps["fzSk"][_fzid].toString());
                if (cfgSk == null) {
                    continue;
                }
                for (const ckey in cfgSk.cs) {
                    if (fzSk[_fzid][ckey] != null) {
                        fzSk[_fzid][ckey] = cfgSk.cs[ckey];
                    }
                }
            }
            //全部圣器技能统一计算
            let sqSk = {};
            for (const _sqid of cfgSqIds) {
                sqSk[_sqid] = [0, 0, 0, 0, 0]; //初始5个数值，
                if (this.teams[_iid].eps.shengqi.toString() != _sqid) {
                    continue; //过滤 我没有带的圣器技能
                }
                let cfgSq = gameCfg_1.default.shengqiLevel.getItem(this.teams[_iid].eps.shengqi.toString(), this.teams[_iid].eps.shengqiLv.toString());
                if (cfgSq == null) {
                    continue;
                }
                for (let index = 0; index < cfgSq.skillVal.length; index++) {
                    sqSk[_sqid][index] = cfgSq.skillVal[index];
                }
            }
            //仙侣技能统计计算
            let kan = "1001";
            let xlSk = {};
            let cfgXlSkDePool = gameCfg_1.default.xianlvSkill_desc.pool;
            for (const key in cfgXlSkDePool) { //初始化所有仙侣技能  备注这边语法用in没关系
                if (parseInt(cfgXlSkDePool[key].id) > 1000) {
                    continue;
                }
                xlSk[cfgXlSkDePool[key].id] = [0, 0, 0, 0, 0];
            }
            let xl_fanji = 0; //仙侣技能触发反击概率
            let xl_lianji = 0; //仙侣技能触连击击概率
            let xl_baoji = 0; //仙侣技能触发暴击概率
            let xl_xuanyun = 0; //仙侣技能触发眩晕概率
            let xl_shanbi = 0; //仙侣技能触发闪避概率
            if (_iid == "11" || _iid == "21") {
                //技能1级寻找
                let _xlSk = {};
                const fidarr = this.teams[_iid].fid.split("_");
                let _cfgXlInfo = gameCfg_1.default.xianlvInfo.getItem(fidarr[1]);
                if (_cfgXlInfo != null) {
                    let cfgXlInfo = gameMethod_1.gameMethod.objCopy(_cfgXlInfo);
                    role = cfgXlInfo.tujian; //1:人神  2:灵仙  3:地府  4:古神
                    kan = cfgXlInfo.ptatk.toString(); //普通技能1级寻找
                    for (let index = 0; index < cfgXlInfo.sk_lv.length; index++) {
                        if (cfgXlInfo.sk_lv[index] <= this.teams[_iid].level) {
                            _xlSk[cfgXlInfo.sk[index].toString()] = [];
                        }
                    }
                }
                //普通技能2级寻找
                let _cfgXlSk = gameCfg_1.default.xianlvSkill.getItem(kan);
                if (_cfgXlSk != null) {
                    let cfgXlSk = gameMethod_1.gameMethod.objCopy(_cfgXlSk);
                    let xb = -1;
                    for (let index = 0; index < cfgXlSk.sk_lv.length; index++) {
                        if (cfgXlSk.sk_lv[index] <= this.teams[_iid].level) {
                            xb = index;
                        }
                    }
                    if (xb >= 0) {
                        kan = cfgXlSk.sks[xb].toString();
                    }
                }
                //技能2级寻找
                for (const sk1 in _xlSk) { //备注这边语法用in没关系
                    let cfgXlSk = gameCfg_1.default.xianlvSkill.getItem(sk1);
                    if (cfgXlSk != null) {
                        let xb = -1;
                        for (let index = 0; index < cfgXlSk.sk_lv.length; index++) {
                            if (cfgXlSk.sk_lv[index] <= this.teams[_iid].level) {
                                xb = index;
                            }
                        }
                        if (xb >= 0) {
                            let skid2 = cfgXlSk.sks[xb].toString();
                            let cfgXlSkDe = gameCfg_1.default.xianlvSkill_desc.getItem(skid2);
                            if (cfgXlSkDe != null) {
                                for (let index = 0; index < cfgXlSkDe.cs.length; index++) {
                                    xlSk[skid2][index] = cfgXlSkDe.cs[index];
                                }
                            }
                        }
                    }
                }
                xl_fanji = this.teams[_iid].eps.fanji; //仙侣技能触发反击概率
                xl_lianji = this.teams[_iid].eps.lianji; //仙侣技能触连击击概率
                xl_baoji = this.teams[_iid].eps.baoji; //仙侣技能触发暴击概率
                xl_xuanyun = this.teams[_iid].eps.jiyun; //仙侣技能触发眩晕概率
                xl_shanbi = this.teams[_iid].eps.shanbi; //仙侣技能触发闪避概率
            }
            this.uuids[_iid] = {
                fid: this.teams[_iid].fid,
                zhanwei: zhanwei,
                hurt: 0,
                addHp: 0,
                camp: Math.floor(parseInt(_iid) / 10),
                fzSk: fzSk,
                sqSk: sqSk,
                xlSk: xlSk,
                pkSk: [],
                role: role,
                lianji_count: 0,
                count_fz101: 0,
                xl_fanji: xl_fanji,
                xl_lianji: xl_lianji,
                xl_baoji: xl_baoji,
                xl_xuanyun: xl_xuanyun,
                xl_shanbi: xl_shanbi,
                atk_per: 0,
                nuqi: 0,
                nqc1: 0,
                nqc2: 0,
                xl_360: 0,
                yishang: ["", 0],
                sq11: 0,
                sq12: 0
            };
        }
        //增加属性
        for (const _iid of _iids) {
            let speed_per = 0;
            //龟丞相害怕与强大的敌人作战，速度{0}
            for (const _xlskid of ["24", "25", "26", "91", "92", "93", "94", "95", "111", "112", "113", "114", "115", "266", "267", "268", "269", "270", "307", "308", "309", "310", "311"]) {
                speed_per += this.uuids[_iid].xlSk[_xlskid][0];
            }
            //二郎神出场附带一身金光，威慑场上所有敌对单位，使其速度降低{0}
            for (const _xlskid2 of ["345", "346", "347", "348", "349"]) {
                if (["10", "11"].indexOf(_iid) != -1 && this.uuids["21"] != null) {
                    speed_per -= this.uuids["21"].xlSk[_xlskid2][0];
                }
                if (["20", "21"].indexOf(_iid) != -1 && this.uuids["11"] != null) {
                    speed_per -= this.uuids["11"].xlSk[_xlskid2][0];
                }
            }
            //战斗开始时，增加{0}速度
            if (this.teams[_iid].wxSk["wxxf_65"] != null) {
                speed_per += this.teams[_iid].wxSk["wxxf_65"][0];
            }
            if (this.teams[_iid].jgSk["js_49"] != null) {
                speed_per += this.teams[_iid].jgSk["js_49"][0];
            }
            this.teams[_iid].eps.speed += Math.floor(this.teams[_iid].eps.speed * speed_per / 10000);
            //生命上限
            let hp_max_per = 0;
            //生命{0}
            for (const _xlskid of ["77", "78", "79", "80", "152", "153", "154", "155", "156", "162", "163", "164", "165", "166", "214", "215", "216", "217", "218", "370", "371", "372", "373", "374", "385", "386", "387", "388", "389", "395", "396", "397", "398", "399", "410", "411", "412", "413", "414"]) {
                hp_max_per += this.uuids[_iid].xlSk[_xlskid][0];
            }
            //生命{1}
            for (const _xlskid of ["182", "183", "184", "185", "186", "224", "225", "226", "227", "228", "281", "282", "283", "284", "285", "313", "314", "315", "316", "317", "440", "441", "442", "443", "444"]) {
                hp_max_per += this.uuids[_iid].xlSk[_xlskid][1];
            }
            //生命{2}
            for (const _xlskid of ["355", "356", "357", "358", "359"]) {
                hp_max_per += this.uuids[_iid].xlSk[_xlskid][2];
            }
            //战斗开始时增加6%攻击、6%生命、6%防御
            if (this.teams[_iid].jgSk["jg_1"] != null) {
                hp_max_per += this.teams[_iid].jgSk["jg_1"][0];
            }
            if (this.teams[_iid].jgSk["jg_48"] != null) {
                hp_max_per += this.teams[_iid].jgSk["jg_48"][0];
            }
            let addMax_hp = Math.floor(this.teams[_iid].eps.hp_max * hp_max_per / 10000);
            if (addMax_hp > 0) {
                this.teams[_iid].eps.hp_max += addMax_hp;
                this.teams[_iid].eps.hp += addMax_hp;
            }
            //攻击
            let atk_per = 0;
            //攻击{0}
            for (const _xlskid of ["33", "34", "35", "60", "61", "62", "63", "101", "102", "103", "104", "105", "192", "193", "194", "195", "196", "197", "198", "199", "200", "201", "224", "225", "226", "227", "228", "292", "293", "294", "295", "296", "318", "319", "320", "321", "322", "323", "324", "325", "326", "327", "425", "426", "427", "428", "429", "460", "461", "462", "463", "464"]) {
                atk_per += this.uuids[_iid].xlSk[_xlskid][0];
            }
            //攻击{1}
            for (const _xlskid of ["86", "87", "88", "89", "90", "111", "112", "113", "114", "115", "307", "308", "309", "310", "311"]) {
                atk_per += this.uuids[_iid].xlSk[_xlskid][1];
            }
            //攻击{2}
            for (const _xlskid of ["136", "137", "138", "139", "140"]) {
                atk_per += this.uuids[_iid].xlSk[_xlskid][2];
            }
            //战斗开始时增加6%攻击、6%生命、6%防御
            if (this.teams[_iid].jgSk["jg_1"] != null) {
                atk_per += this.teams[_iid].jgSk["jg_1"][1];
            }
            if (this.teams[_iid].jgSk["jg_47"] != null) {
                atk_per += this.teams[_iid].jgSk["jg_47"][1];
            }
            this.teams[_iid].eps.atk += Math.floor(this.teams[_iid].eps.atk * atk_per / 10000);
            //防御
            let def_per = 0;
            //防御{0}
            for (const _xlskid of ["18", "19", "20", "56", "57", "58", "59", "380", "381", "382", "383", "384", "440", "441", "442", "443", "444"]) {
                def_per += this.uuids[_iid].xlSk[_xlskid][0];
            }
            //防御{1}
            for (const _xlskid of ["77", "78", "79", "80", "96", "97", "98", "99", "100", "146", "147", "148", "149", "150", "255", "256", "257", "258", "259", "410", "411", "412", "413", "414"]) {
                def_per += this.uuids[_iid].xlSk[_xlskid][1];
            }
            //防御{2}
            for (const _xlskid of ["167", "168", "169", "170", "171"]) {
                def_per += this.uuids[_iid].xlSk[_xlskid][2];
            }
            //降低防御{0}
            for (const _xlskid of ["126", "127", "128", "129", "130"]) {
                def_per -= this.uuids[_iid].xlSk[_xlskid][0];
                def_per = Math.max(0, def_per);
            }
            //战斗开始时增加6%攻击、6%生命、6%防御
            if (this.teams[_iid].jgSk["jg_1"] != null) {
                def_per += this.teams[_iid].jgSk["jg_1"][2];
            }
            if (this.teams[_iid].jgSk["jg_46"] != null) {
                def_per += this.teams[_iid].jgSk["jg_46"][2];
            }
            this.teams[_iid].eps.def += Math.floor(this.teams[_iid].eps.def * def_per / 10000);
            //反击{0}
            for (const _xlskid of ["4", "5", "65", "66", "67", "68", "157", "158", "159", "160", "161"]) {
                this.uuids[_iid].xl_fanji += this.uuids[_iid].xlSk[_xlskid][0];
            }
            //反击{1}
            for (const _xlskid of ["91", "92", "93", "94", "95", "250", "251", "252", "253", "254", "380", "381", "382", "383", "384"]) {
                this.uuids[_iid].xl_fanji += this.uuids[_iid].xlSk[_xlskid][1];
            }
            //闪避{0}
            for (const _xlskid of ["6", "7", "8", "9", "10", "39", "40", "41", "42", "141", "142", "143", "144", "145", "287", "288", "289", "290", "291"]) {
                this.uuids[_iid].xl_shanbi += this.uuids[_iid].xlSk[_xlskid][0];
            }
            //吸血{0}
            for (const _xlskid of ["11", "12", "13", "271", "272", "273", "274", "275"]) {
                this.teams[_iid].eps.xixue += this.uuids[_iid].xlSk[_xlskid][0];
            }
            //吸血{1}
            for (const _xlskid of ["60", "61", "62", "63", "81", "82", "83", "84", "85", "330", "331", "332", "333", "334"]) {
                this.teams[_iid].eps.xixue += this.uuids[_iid].xlSk[_xlskid][1];
            }
            //击晕{0}
            for (const _xlskid of ["15", "16", "17", "52", "53", "54", "55", "121", "122", "123", "124", "125", "177", "178", "179", "180", "181", "445", "446", "447", "448", "449"]) {
                this.uuids[_iid].xl_xuanyun += this.uuids[_iid].xlSk[_xlskid][0];
            }
            //击晕{1}
            for (const _xlskid of ["197", "198", "199", "200", "201", "271", "272", "273", "274", "275", "370", "371", "372", "373", "374"]) {
                this.uuids[_iid].xl_xuanyun += this.uuids[_iid].xlSk[_xlskid][1];
            }
            //暴击{0}
            for (const _xlskid of ["21", "22", "23", "81", "82", "83", "84", "85", "167", "168", "169", "170", "171", "297", "298", "299", "300", "301"]) {
                this.uuids[_iid].xl_baoji += this.uuids[_iid].xlSk[_xlskid][0];
            }
            //暴击{1}
            for (const _xlskid of ["192", "193", "194", "195", "196"]) {
                this.uuids[_iid].xl_baoji += this.uuids[_iid].xlSk[_xlskid][1];
            }
            //爆伤增加{1}
            for (const _xlskid of ["167", "168", "169", "170", "171", "297", "298", "299", "300", "301"]) {
                this.teams[_iid].eps.baonue += this.uuids[_iid].xlSk[_xlskid][1];
            }
            //连击{0}
            for (const _xlskid of ["27", "28", "29", "73", "74", "75", "76", "131", "132", "133", "134", "135", "209", "210", "211", "212", "213"]) {
                this.uuids[_iid].xl_lianji += this.uuids[_iid].xlSk[_xlskid][0];
            }
            //连击{1}
            for (const _xlskid of ["101", "102", "103", "104", "105", "460", "461", "462", "463", "464"]) {
                this.uuids[_iid].xl_lianji += this.uuids[_iid].xlSk[_xlskid][1];
            }
            //忽视击晕{0}
            for (const _xlskid of ["106", "107", "108", "109", "110", "470", "471", "472", "473", "474"]) {
                this.teams[_iid].eps.hsjiyun += this.uuids[_iid].xlSk[_xlskid][0];
            }
            //忽视击晕{1}
            for (const _xlskid of ["56", "57", "58", "59", "430", "431", "432", "433", "434"]) {
                this.teams[_iid].eps.hsjiyun += this.uuids[_iid].xlSk[_xlskid][1];
            }
            //忽视击晕{2}
            for (const _xlskid of ["271", "272", "273", "274", "275", "440", "441", "442", "443", "444"]) {
                this.teams[_iid].eps.hsjiyun += this.uuids[_iid].xlSk[_xlskid][2];
            }
            //忽视闪避{0}
            for (const _xlskid of ["106", "107", "108", "109", "110", "302", "303", "304", "305", "306", "470", "471", "472", "473", "474"]) {
                this.teams[_iid].eps.hsshanbi += this.uuids[_iid].xlSk[_xlskid][0];
            }
            //忽视闪避{1}
            for (const _xlskid of ["235", "236", "237", "238", "239"]) {
                this.teams[_iid].eps.hsshanbi += this.uuids[_iid].xlSk[_xlskid][1];
            }
            //忽视闪避{2}
            for (const _xlskid of ["440", "441", "442", "443", "444"]) {
                this.teams[_iid].eps.hsshanbi += this.uuids[_iid].xlSk[_xlskid][2];
            }
            //忽视连击{0}
            for (const _xlskid of ["106", "107", "108", "109", "110", "470", "471", "472", "473", "474"]) {
                this.teams[_iid].eps.hslianji += this.uuids[_iid].xlSk[_xlskid][0];
            }
            //忽视连击{2}
            for (const _xlskid of ["440", "441", "442", "443", "444"]) {
                this.teams[_iid].eps.hslianji += this.uuids[_iid].xlSk[_xlskid][2];
            }
            //忽视反击{0}
            for (const _xlskid of ["106", "107", "108", "109", "110", "235", "236", "237", "238", "239", "470", "471", "472", "473", "474"]) {
                this.teams[_iid].eps.hsfanji += this.uuids[_iid].xlSk[_xlskid][0];
            }
            //忽视反击{2}
            for (const _xlskid of ["440", "441", "442", "443", "444"]) {
                this.teams[_iid].eps.hsfanji += this.uuids[_iid].xlSk[_xlskid][2];
            }
            //忽视暴击{0}
            for (const _xlskid of ["106", "107", "108", "109", "110", "470", "471", "472", "473", "474"]) {
                this.teams[_iid].eps.hsbaoji += this.uuids[_iid].xlSk[_xlskid][0];
            }
            //忽视暴击{1}
            for (const _xlskid of ["287", "288", "289", "290", "291"]) {
                this.teams[_iid].eps.hsbaoji += this.uuids[_iid].xlSk[_xlskid][1];
            }
            //忽视暴击{2}
            for (const _xlskid of ["440", "441", "442", "443", "444"]) {
                this.teams[_iid].eps.hsbaoji += this.uuids[_iid].xlSk[_xlskid][2];
            }
            //忽视吸血{0}
            for (const _xlskid of ["106", "107", "108", "109", "110", "146", "147", "148", "149", "150", "313", "314", "315", "316", "317", "470", "471", "472", "473", "474"]) {
                this.teams[_iid].eps.hsxixue += this.uuids[_iid].xlSk[_xlskid][0];
            }
            //忽视吸血{2}
            for (const _xlskid of ["440", "441", "442", "443", "444"]) {
                this.teams[_iid].eps.hsxixue += this.uuids[_iid].xlSk[_xlskid][2];
            }
            //战斗开始时，增加{0}最终减伤
            if (this.teams[_iid].wxSk["wxxf_38"] != null) {
                this.teams[_iid].eps.jianshang += this.teams[_iid].wxSk["wxxf_38"][0];
            }
            //战斗开始时，增加强化治疗（对吸血有效）25%，持续到战斗结束
            if (this.teams[_iid].jgSk["jg_45"] != null) {
                this.teams[_iid].eps.qhzhiliao += this.teams[_iid].jgSk["jg_45"][0];
            }
            if (this.teams[_iid].eps.hp < 1) {
                continue;
            }
            //计算速度
            if (_iid == "10") {
                let speed10 = this.teams["10"].eps.speed;
                speed10 = speed10 * (10000 - Math.max(0, this.teams["20"].eps.tuihua - this.teams["10"].eps.yazhi)) / 10000;
                cqiids.push(["10", speed10]);
                continue;
            }
            if (_iid == "20") {
                let speed20 = this.teams["20"].eps.speed;
                speed20 = speed20 * (10000 - Math.max(0, this.teams["10"].eps.tuihua - this.teams["20"].eps.yazhi)) / 10000;
                cqiids.push(["20", speed20]);
                continue;
            }
            let speed = this.teams[_iid].eps.speed;
            cqiids.push([_iid, speed]);
            //战斗开始时获得反伤盾，可反弹80%受到的伤害，持续3回合
            if (this.teams[_iid].jgSk["jg_38"] != null) {
                this.uuids[_iid].pkSk.push(["jg_38", this.teams[_iid].jgSk["jg_38"][1], this.teams[_iid].jgSk["jg_38"][0], 0, 0]);
            }
        }
        //计算优先级
        cqiids.sort(function (a, b) {
            return b[1] - a[1];
        });
        this.speedLoop["0"] = [];
        for (const _cqiid of cqiids) {
            this.speedLoop["0"].push(_cqiid[0]);
        }
    }
    /**
     * 添加回合日志
     * @param log 当前行动日志
     */
    addLog(log) {
        if (this.outf.log == null) {
            this.outf.log = {};
        }
        let kk = this.huihe.toString();
        if (this.outf.log[kk] == null) {
            this.outf.log[kk] = [];
        }
        this.outf.log[kk].push(gameMethod_1.gameMethod.objCopy(log));
    }
    /**
     * 开始战斗
     */
    war_loop() {
        let loop = true;
        while (loop) {
            this.huihe++; //当前行回合数增加
            this.speedLoop[this.huihe.toString()] = [];
            for (const _iid of this.speedLoop[(this.huihe - 1).toString()]) {
                if (this.teams[_iid].eps.hp < 1) {
                    continue;
                }
                this.speedLoop[this.huihe.toString()].push(_iid);
            }
            let count = 0;
            for (const iid of this.speedLoop[this.huihe.toString()]) {
                if (this.teams[iid].eps.hp < 1) {
                    continue;
                }
                this.isOver = false; //新的一次出手
                count++;
                if (count == 1) { //当前回合第一次出手
                    this.pk_one_round(); //回合开始 玩家出手前
                }
                this.uuids[iid].count_fz101 = 0;
                //清除所有人的怒气值结算次数
                for (const _fi in this.uuids) {
                    this.uuids[_fi].nqc1 = 0;
                    this.uuids[_fi].nqc2 = 0;
                }
                this.cfwanxiang = false;
                this.pk_one_buff(iid); //一次出手(前)
                this.pk_one_atk(iid, "", 0); //一次出手(中)
                if (this.cfwanxiang && this.teams[iid].eps.hp > 0) { //如果是释放技能 就在打一次
                    this.pk_one_atk(iid, "", 0); //一次出手(中)
                }
                this.pk_one_over(iid, 0); //一次出手(后)  个人结束  技能回合数扣除  死人复活
                //判定一方全部阵亡了没
                let Mcamp = 0; //我方阵营人数(还没阵亡)
                let Fcamp = 0; //对方阵营人数(还没阵亡)
                for (const iid in this.teams) { //备注这边语法用in没关系
                    if (this.teams[iid].eps.hp < 1) {
                        continue;
                    }
                    if (parseInt(iid) < 20) {
                        Mcamp += 1;
                    }
                    else {
                        Fcamp += 1;
                    }
                }
                if (Mcamp < 1) {
                    loop = false;
                    this.outf.win = 0;
                    break;
                }
                if (Fcamp < 1) {
                    loop = false;
                    this.outf.win = 1;
                    break;
                }
            }
            //我方 大于30回合判输
            if (this.huihe >= 30) {
                loop = false;
                this.outf.win = 0;
                //人人pk    回合达到上限的话，如果是PK的话。应该是，对比双方的伤害量+治疗量，大的一方胜
                if (parseInt(this.teams["20"].fid) >= 100000 && ["longgong", "dongtianpvp", "douluo", "jjc"].indexOf(this.from) != -1) {
                    let myJb = this.uuids["10"].addHp;
                    if (this.uuids["11"] != null) {
                        myJb += this.uuids["11"].addHp;
                    }
                    let fjb = this.uuids["20"].addHp;
                    if (this.uuids["21"] != null) {
                        fjb += this.uuids["21"].addHp;
                    }
                    if (myJb > fjb) {
                        this.outf.win = 1;
                    }
                }
                break;
            }
        }
    }
    /**
     * 回合开始 玩家出手前
     */
    pk_one_round() {
        if (this.isOver) {
            return;
        }
        //先buff
        let log = {
            aType: Xys_1.ActionType.round,
            atker: {
                fid: "",
                iid: "",
                hp: 0,
                nuqi: 0,
                buff: [],
                effect: [],
                status: 0,
            },
            target: [],
            isUp: 0
        };
        let _iids = Object.keys(this.teams);
        //主角
        for (const _iid of _iids) {
            if (["10", "20"].indexOf(_iid) == -1) {
                continue; //不是 主角逻辑  过滤
            }
            if (this.teams[_iid].eps.hp < 1) {
                continue; //已经亡了
            }
            let fiid = _iid == "10" ? "20" : "10";
            let fXlid = _iid == "10" ? "21" : "11";
            let _target = {
                fid: this.teams[_iid].fid,
                iid: _iid,
                hp: this.teams[_iid].eps.hp,
                nuqi: this.uuids[_iid].nuqi,
                buff: this.getShowBuff(_iid),
                effect: [],
                isUp: 0,
                status: 0,
            };
            //战斗开始时，获得额外{0}恢复效果，持续到战斗结束。
            let huifu_per_fz53 = this.uuids[_iid].fzSk["53"]["default_per"];
            //圣器 - 触发血量恢复
            if (this.teams[_iid].eps.shengqi == 1) {
                let cfgSqLv = gameCfg_1.default.shengqiLevel.getItem(this.teams[_iid].eps.shengqi.toString(), this.teams[_iid].eps.shengqiLv.toString());
                if (cfgSqLv != null && cfgSqLv.skillVal[0] > 0) {
                    let addHp_per = huifu_per_fz53;
                    let addHp = cfgSqLv.skillVal[0];
                    addHp += Math.floor(addHp * addHp_per / 10000);
                    for (const _xlskid of ["395", "396", "397", "398", "399"]) {
                        addHp += (addHp * this.uuids[_iid].xlSk[_xlskid][1] / 10000);
                    }
                    //太白金星在场时，所有敌对单位的生命回复效果降低{0}
                    if (this.uuids[fXlid] != null && this.teams[fXlid].eps.hp > 0 && this.uuids[fXlid].camp != this.uuids[_iid].camp) {
                        let yzhuifu = this.uuids[fXlid].xlSk["202"][0];
                        for (const _xlskid of ["435", "436", "437", "438", "439"]) {
                            yzhuifu += this.uuids[fXlid].xlSk[_xlskid][0];
                        }
                        addHp -= Math.floor(addHp * yzhuifu / 10000);
                    }
                    for (const val of this.uuids[_iid].pkSk) {
                        if (val[0] == "wxxf_74" || val[0] == "wxxf_75") {
                            addHp += Math.floor(addHp * val[2] / 10000);
                        }
                        if (val[0] == "wxxf_33") {
                            addHp -= Math.floor(addHp * val[2] / 10000);
                        }
                    }
                    addHp += Math.floor(addHp * this.teams[_iid].eps.qhzhiliao / 10000);
                    if (addHp > 0) {
                        this.teams[_iid].eps.hp += addHp;
                        if (this.teams[_iid].eps.hp > this.teams[_iid].eps.hp_max) {
                            this.teams[_iid].eps.hp = this.teams[_iid].eps.hp_max;
                        }
                        this.uuids[_iid].addHp += addHp;
                        _target.effect.push(['huifu', addHp]);
                        _target.hp = this.teams[_iid].eps.hp;
                        _target.isUp = 1;
                    }
                }
            }
            //第一回合触发 
            if (this.huihe == 1) {
                let jgids = ["jg_1", "jg_38", "jg_40", "jg_41", "jg_42", "jg_43", "jg_44", "jg_45", "jg_46", "jg_47", "jg_48", "jg_49"];
                for (const jgid of jgids) {
                    if (this.teams[_iid].jgSk[jgid] == null) {
                        continue;
                    }
                    _target.effect.push([jgid, 1]);
                    _target.isUp = 1;
                }
                let fzids = [1, 2, 3, 52, 53, 152, 201, 202, 203, 206, 207, 251, 252, 253, 254, 255];
                //前端技能展示
                for (const skid in this.teams[_iid].eps.fzSk) { //这边放in没问题
                    if (fzids.indexOf(parseInt(skid)) == -1) {
                        continue;
                    }
                    _target.effect.push(['fazhen', parseInt(skid)]);
                    _target.isUp = 1;
                }
            }
            //第五回合 是否回血 第五回合的时候，会按自己血量上限的百分百进行血量恢复  回血值=我方血量上限*max((我方回血-敌方抗回血),0)
            if (this.huihe == 5) {
                let hf5 = this.teams[_iid].eps.huifu + huifu_per_fz53;
                //马面以战补元在战斗的第5个回合将回复生命，恢复+{0}
                for (const _xlskid of ["36", "37", "38"]) {
                    hf5 += this.uuids[_iid].xlSk[_xlskid][0];
                }
                let addHp = Math.floor(this.teams[_iid].eps.hp_max * Math.max(0, hf5 - this.teams[fiid].eps.jinliao) / 10000);
                for (const _xlskid of ["395", "396", "397", "398", "399"]) {
                    addHp += Math.floor(addHp * this.uuids[_iid].xlSk[_xlskid][1] / 10000);
                }
                //太白金星在场时，所有敌对单位的生命回复效果降低{0}
                if (this.uuids[fXlid] != null && this.teams[fXlid].eps.hp > 0 && this.uuids[fXlid].camp != this.uuids[_iid].camp) {
                    let yzhuifu = this.uuids[fXlid].xlSk["202"][0];
                    for (const _xlskid of ["435", "436", "437", "438", "439"]) {
                        yzhuifu += this.uuids[fXlid].xlSk[_xlskid][0];
                    }
                    addHp -= Math.floor(addHp * yzhuifu / 10000);
                }
                for (const val of this.uuids[_iid].pkSk) {
                    if (val[0] == "wxxf_74" || val[0] == "wxxf_75") {
                        addHp += Math.floor(addHp * val[2] / 10000);
                    }
                    if (val[0] == "wxxf_33") {
                        addHp -= Math.floor(addHp * val[2] / 10000);
                    }
                }
                addHp += Math.floor(addHp * this.teams[_iid].eps.qhzhiliao / 10000);
                if (addHp > 0) {
                    this.uuids[_iid].addHp += addHp;
                    _target.effect.push(['huifu', addHp]);
                    this.teams[_iid].eps.hp += addHp;
                    if (this.teams[_iid].eps.hp > this.teams[_iid].eps.hp_max) {
                        this.teams[_iid].eps.hp = this.teams[_iid].eps.hp_max;
                    }
                    _target.hp = this.teams[_iid].eps.hp;
                    _target.isUp = 1;
                }
            }
            if (_target.isUp == 1) {
                log.target.push(_target);
                log.isUp = 1;
            }
        }
        //仙侣
        for (const _iid of _iids) { //这个不能用in
            if (["11", "21"].indexOf(_iid) == -1) {
                continue; //不是 主角逻辑  过滤
            }
            let fXlid = _iid == "11" ? "21" : "11";
            if (this.teams[_iid].eps.hp < 1) {
                continue; //已经亡了
            }
            let _target = {
                fid: this.teams[_iid].fid,
                iid: _iid,
                hp: this.teams[_iid].eps.hp,
                nuqi: this.uuids[_iid].nuqi,
                buff: this.getShowBuff(_iid),
                effect: [],
                isUp: 0,
                status: 0,
            };
            //第五回合 是否回血 第五回合的时候，会按自己血量上限的百分百进行血量恢复  回血值=我方血量上限*max((我方回血-敌方抗回血),0)
            if (this.huihe == 5) {
                let hf5 = this.teams[_iid].eps.huifu;
                //马面以战补元在战斗的第5个回合将回复生命，恢复+{0}
                for (const _xlskid of ["36", "37", "38"]) {
                    hf5 += this.uuids[_iid].xlSk[_xlskid][0];
                }
                for (const _xlskid of ["385", "386", "387", "388", "389"]) {
                    hf5 += this.uuids[_iid].xlSk[_xlskid][1];
                }
                let addHp = Math.floor(this.teams[_iid].eps.hp_max * hf5 / 10000);
                for (const _xlskid of ["395", "396", "397", "398", "399"]) {
                    addHp += Math.floor(addHp * this.uuids[_iid].xlSk[_xlskid][1] / 10000);
                }
                //太白金星在场时，所有敌对单位的生命回复效果降低{0}
                if (this.uuids[fXlid] != null && this.teams[fXlid].eps.hp > 0 && this.uuids[fXlid].camp != this.uuids[_iid].camp) {
                    let yzhuifu = this.uuids[fXlid].xlSk["202"][0];
                    for (const _xlskid of ["435", "436", "437", "438", "439"]) {
                        yzhuifu += this.uuids[fXlid].xlSk[_xlskid][0];
                    }
                    addHp -= Math.floor(addHp * yzhuifu / 10000);
                }
                for (const val of this.uuids[_iid].pkSk) {
                    if (val[0] == "wxxf_74" || val[0] == "wxxf_75") {
                        addHp += Math.floor(addHp * val[2] / 10000);
                    }
                    if (val[0] == "wxxf_33") {
                        addHp -= Math.floor(addHp * val[2] / 10000);
                    }
                }
                if (addHp > 0) {
                    this.teams[_iid].eps.hp += addHp;
                    if (this.teams[_iid].eps.hp > this.teams[_iid].eps.hp_max) {
                        this.teams[_iid].eps.hp = this.teams[_iid].eps.hp_max;
                    }
                    this.uuids[_iid].addHp += addHp;
                    _target.effect.push(['huifu', addHp]);
                    _target.hp = this.teams[_iid].eps.hp;
                    _target.isUp = 1;
                }
            }
            if (_target.isUp == 1) {
                log.target.push(_target);
                log.isUp = 1;
            }
        }
        if (log.isUp == 1) {
            this.addLog(log);
        }
    }
    /**
     * 战斗 - 一次行动（前）
     * @param 本回合出手方 iid
     */
    pk_one_buff(iid) {
        this.xl360_364();
        if (this.isOver) {
            return;
        }
        //先buff
        let log = {
            aType: Xys_1.ActionType.buff,
            atker: {
                fid: this.teams[iid].fid,
                iid: iid,
                hp: this.teams[iid].eps.hp,
                nuqi: this.uuids[iid].nuqi,
                buff: this.getShowBuff(iid),
                effect: [],
                status: 0,
            },
            target: [],
            isUp: 1
        };
        //连击概率直接清空
        this.uuids[iid].lianji_count = 0;
        //触发秒杀
        if (this.teams[iid].eps.miaosha > 0 && this.teams[iid].eps.miaosha <= this.huihe) {
            log.isUp = 1;
            this.addLog(log);
            return; //秒杀 直接无敌了
        }
        //buff
        let allsub = 0;
        for (const _val of this.uuids[iid].pkSk) {
            if (_val[0] == "wxxf_50") {
                log.atker.effect.push(['huifu', _val[2]]);
                log.isUp = 1;
                this.teams[iid].eps.hp += _val[2];
                log.atker.hp = this.teams[iid].eps.hp;
            }
            //土地攻击时有{0}概率点燃对手，使其{1}回合内每回合损失当前生命的{2}，该伤害不能超过仙侣攻击的{3}
            if (["xl_3", "xl_14", "xl_51", "xl_64", "xl_151", "xl_234", "xl_265", "xl_329"].indexOf(_val[0]) != -1) {
                let subhp = Math.floor(this.teams[iid].eps.hp * _val[2] / 10000);
                if (subhp > _val[3]) {
                    subhp = _val[3];
                }
                allsub += subhp;
            }
            //进行一次{0}攻击力的攻击，并使敌人燃烧，每回合造成{1}攻击力伤害，持续{2}回合
            if (["wxxf_15", "wxxf_51", 'wxxf_8', 'wxxf_11', "wxxf_12", "jg_20"].indexOf(_val[0]) != -1) {
                let subhp = _val[2];
                allsub += subhp;
            }
            //触发眩晕
            if (_val[0] == "jiyun") {
                log.atker.effect.push(["jiyun", 1]);
                log.isUp = 1;
                this.isOver = true;
            }
            if (_val[0] == "wxxf_32") {
                log.atker.effect.push(["wxxf_32", 1]);
                log.isUp = 1;
                this.isOver = true;
            }
        }
        if (this.teams[iid].wxSk["wxxf_34"] != null) {
            let fiid_34 = iid == "10" ? "20" : "10";
            let addHp = Math.floor((this.teams[iid].eps.hp_max - this.teams[iid].eps.hp) * this.teams[iid].wxSk["wxxf_34"][0] / 10000);
            if (addHp > 0) {
                addHp += Math.floor(addHp * (10000 + this.teams[iid].eps.qhzhiliao - this.teams[fiid_34].eps.rhzhiliao) / 10000);
                this.teams[iid].eps.hp += addHp;
                if (this.teams[iid].eps.hp > this.teams[iid].eps.hp_max) {
                    this.teams[iid].eps.hp = this.teams[iid].eps.hp_max;
                }
                log.atker.effect.push(['huifu', addHp]);
                this.uuids[iid].addHp += addHp;
                log.isUp = 1;
            }
        }
        if (allsub > 0) {
            log.atker.effect.push(['hp', -1 * allsub]);
            log.isUp = 1;
            this.teams[iid].eps.hp -= allsub;
            log.atker.hp = this.teams[iid].eps.hp;
            if (this.teams[iid].eps.hp < 1 && this.siles.indexOf(iid) == -1) {
                if (this.teams[iid].eps.shengqi == 5 || this.teams[iid].wxSk["wxxf_55"] != null) {
                    log.atker.status = 1;
                }
                for (const _xlskid of ["390", "391", "392", "393", "394"]) {
                    if (this.uuids[iid].xlSk[_xlskid][0] > 0) {
                        log.atker.status = 1;
                    }
                }
                this.isOver = true;
                if (["xlf_43", "xl_43"].indexOf(this.teams[iid].fid) != -1) {
                    this.teams[iid].eps.hp = 1;
                    log.atker.hp = this.teams[iid].eps.hp;
                    this.uuids[iid].xl_360 = 1;
                }
                else {
                    this.siles.push(iid);
                }
            }
        }
        if (log.isUp == 1) {
            this.addLog(log);
        }
    }
    /**
     * 战斗 - 一次行动（中）
     * @param iid 进攻方
     * @param fiid 被打方（主打）
     * @param isAtk 0正常攻击  1反击 2连击
     */
    pk_one_atk(iid, zfiid, isAtk) {
        this.xl360_364();
        if (this.teams[iid].eps.hp <= 0) {
            this.isOver = true;
            return;
        }
        if (isAtk != 0 && this.teams[zfiid].eps.hp <= 0) {
            this.isOver = true;
            return;
        }
        if (this.isOver) {
            return;
        }
        //如果没有指定攻击对象,就自己获取攻击对象
        let fiids = [];
        if (zfiid != "") {
            fiids.push(zfiid);
        }
        else {
            fiids = this.findIids(iid);
        }
        if (fiids.length <= 0) {
            this.isOver = true; //没有对手直接结束  防错
            return;
        }
        zfiid = fiids[0]; //主对手
        let fXlid = iid == "11" || iid == "10" ? "21" : "11";
        let myXlid = iid == "11" || iid == "10" ? "11" : "21";
        let fzhuid = iid == "11" || iid == "10" ? "20" : "10";
        let zhuid = iid == "11" || iid == "10" ? "10" : "20";
        //普通攻击
        let log = {
            aType: Xys_1.ActionType.atk,
            atker: {
                fid: this.teams[iid].fid,
                iid: iid,
                hp: this.teams[iid].eps.hp,
                nuqi: this.uuids[iid].nuqi,
                buff: this.getShowBuff(iid),
                effect: [],
                status: 0,
            },
            target: [],
            isUp: 0
        };
        let fz51 = 0; //是否触发特殊伤害
        if (this.teams[iid].jgSk["jg_6"] != null && this.seedRand.rand(1, 10000) <= this.teams[iid].jgSk["jg_6"][0]) {
            log.atker.effect.push(['jg_6', 1]);
            log.isUp = 1;
            this.uuids[iid].pkSk.push(["jg_6", this.teams[iid].jgSk["jg_6"][2] + 1, this.teams[iid].jgSk["jg_6"][1], 0, 0]);
        }
        //攻击时有25%概率给目标触发中毒效果，每回合造成35%攻击的伤害，持续3回合
        if (this.teams[iid].jgSk["jg_20"] != null && this.seedRand.rand(1, 10000) <= this.teams[iid].jgSk["jg_20"][0]) {
            log.atker.effect.push(['jg_20', 1]);
            log.isUp = 1;
            //最大伤害
            let jianshang = this.teams[zfiid].eps.jianshang;
            for (const val of this.uuids[zfiid].pkSk) {
                if (val[0] == "jg_2" || val[0] == "jg_9" || val[0] == "wxxf_68") {
                    jianshang -= val[2];
                }
                if (val[0] == "wxxf_39") {
                    jianshang += val[2];
                }
            }
            jianshang = Math.max(0, jianshang);
            let jg_9_hit = Math.floor(this.teams[iid].eps.atk * this.teams[iid].jgSk["jg_20"][1] / 10000);
            let max_baseHit = (jg_9_hit - this.teams[zfiid].eps.def) * (10000 + this.teams[iid].eps.zengshang - jianshang) / 10000;
            let max_ptHit = Math.round(Math.max(max_baseHit, jg_9_hit * 0.15) * this.seedRand.rand(97, 103) / 100);
            this.uuids[zfiid].pkSk.push(["jg_20", this.teams[iid].jgSk["jg_20"][2], max_ptHit, 0, 0]);
        }
        //攻击时有25%概率偷取目标（暴击、晕眩、反击、连击、闪避）中最高属性24%，持续3回合
        if (this.teams[iid].jgSk["jg_21"] != null && this.seedRand.rand(1, 10000) <= this.teams[iid].jgSk["jg_21"][0]) {
            log.atker.effect.push(['jg_21', 1]);
            log.isUp = 1;
            let maxkk = 0;
            let maxep = 0;
            if (this.teams[zfiid].eps.baoji > maxep) {
                maxep = this.teams[zfiid].eps.baoji;
                maxkk = 1;
            }
            if (this.teams[zfiid].eps.jiyun > maxep) {
                maxep = this.teams[zfiid].eps.jiyun;
                maxkk = 2;
            }
            if (this.teams[zfiid].eps.fanji > maxep) {
                maxep = this.teams[zfiid].eps.fanji;
                maxkk = 3;
            }
            if (this.teams[zfiid].eps.lianji > maxep) {
                maxep = this.teams[zfiid].eps.lianji;
                maxkk = 4;
            }
            if (this.teams[zfiid].eps.shanbi > maxep) {
                maxep = this.teams[zfiid].eps.shanbi;
                maxkk = 5;
            }
            this.uuids[iid].pkSk.push(["jg_21", this.teams[iid].jgSk["jg_21"][3] + 1, this.teams[iid].jgSk["jg_21"][2], maxkk, 0]);
            this.uuids[zfiid].pkSk.push(["jg_21", this.teams[iid].jgSk["jg_21"][3], -1 * this.teams[iid].jgSk["jg_21"][2], maxkk, 0]);
        }
        //战将攻击时，有25%概率，弱化敌方战将25%，持续2回合
        if (["11", "21"].indexOf(iid) != -1 && this.teams[iid].jgSk["jg_7"] != null && this.teams[fXlid] != null && this.teams[fXlid].eps.hp > 0) {
            if (this.seedRand.rand(1, 10000) <= this.teams[iid].jgSk["jg_7"][0]) {
                log.atker.effect.push(['jg_7', 1]);
                log.isUp = 1;
                this.uuids[fXlid].pkSk.push(["jg_7", this.teams[iid].jgSk["jg_7"][2], this.teams[iid].jgSk["jg_7"][1], 0, 0]);
            }
        }
        //战将攻击时，有25%概率加100怒气
        if (["11", "21"].indexOf(iid) != -1 && this.teams[iid].jgSk["jg_8"] != null && this.teams[zhuid].eps.hp > 0) {
            if (this.seedRand.rand(1, 10000) <= this.teams[iid].jgSk["jg_8"][0]) {
                log.atker.effect.push(['jg_8', 1]);
                log.isUp = 1;
                this.uuids[zhuid].nuqi += this.teams[iid].jgSk["jg_8"][1];
            }
        }
        //战将攻击时，会标记目标，降低目标20%最终减伤，持续2回合
        if (["11", "21"].indexOf(iid) != -1 && this.teams[iid].jgSk["jg_9"] != null) {
            log.atker.effect.push(['jg_9', 1]);
            log.isUp = 1;
            this.uuids[fXlid].pkSk.push(["jg_9", this.teams[iid].jgSk["jg_9"][2], this.teams[iid].jgSk["jg_9"][1], 0, 0]);
        }
        //攻击时，有25%概率提高自身20.4%强化战将，持续2回合
        if (["10", "20"].indexOf(iid) != -1 && this.teams[iid].jgSk["jg_10"] != null && this.teams[myXlid] != null && this.teams[myXlid].eps.hp > 0) {
            if (this.seedRand.rand(1, 10000) <= this.teams[iid].jgSk["jg_10"][0]) {
                log.atker.effect.push(['jg_10', 1]);
                log.isUp = 1;
                this.uuids[myXlid].pkSk.push(["jg_10", this.teams[iid].jgSk["jg_10"][2], this.teams[iid].jgSk["jg_10"][1], 0, 0]);
            }
        }
        //攻击时，有25%概率提高12点怒气
        if (this.teams[iid].jgSk["jg_15"] != null) {
            if (this.seedRand.rand(1, 10000) <= this.teams[iid].jgSk["jg_15"][0]) {
                this.uuids[iid].nuqi += this.teams[iid].jgSk["jg_15"][1];
                log.atker.effect.push(['jg_15', 1]);
                log.atker.nuqi = this.uuids[iid].nuqi;
                log.isUp = 1;
            }
        }
        //攻击时，如果对方有负面效果，会给目标施加暴击印记，产生暴击后，附加额外的34%伤害
        if (this.teams[iid].jgSk["jg_19"] != null) {
            for (const val of this.uuids[zfiid].pkSk) {
                if (["xl_329", "xl_3", "xl_14", "xl_51", "xl_64", "xl_234", "xl_265", "xl_151", "wxxf_32", "wxxf_31"].indexOf(val[0]) != -1) {
                    this.uuids[zfiid].yishang = ["jg_19", this.teams[iid].jgSk["jg_19"][0]];
                    break;
                }
            }
        }
        //攻击时有25%概率触发一个可吸收25%攻击力伤害量的护盾，持续2回合
        if (this.teams[iid].jgSk["jg_22"] != null) {
            if (this.seedRand.rand(1, 10000) <= this.teams[iid].jgSk["jg_22"][0]) {
                log.atker.effect.push(['jg_22', 1]);
                log.isUp = 1;
                let hdnum = Math.floor(this.teams[iid].eps.atk * this.teams[iid].jgSk["jg_22"][1] / 10000);
                this.uuids[iid].pkSk.push(["jg_22", this.teams[iid].jgSk["jg_22"][2], hdnum, 0, 0]);
            }
        }
        //攻击时有25%概率回复攻击18%的生命值，并降低敌人10%攻击力，持续3回合
        if (this.teams[iid].jgSk["jg_23"] != null) {
            if (this.seedRand.rand(1, 10000) <= this.teams[iid].jgSk["jg_23"][0]) {
                log.atker.effect.push(['jg_23', 1]);
                let addHp = Math.floor(this.teams[iid].eps.atk * this.teams[iid].jgSk["jg_23"][1] / 10000);
                addHp += Math.floor(addHp * (this.teams[zhuid].eps.qhmifa - this.teams[fzhuid].eps.rhmifa) / 10000);
                addHp += Math.floor(addHp * (this.teams[zhuid].eps.qhzhiliao - this.teams[fzhuid].eps.rhzhiliao) / 10000);
                addHp = Math.max(1, addHp);
                this.teams[iid].eps.hp += addHp;
                if (this.teams[iid].eps.hp > this.teams[iid].eps.hp_max) {
                    this.teams[iid].eps.hp = this.teams[iid].eps.hp_max;
                }
                log.atker.effect.push(['huifu', addHp]);
                this.uuids[iid].addHp += addHp;
                log.isUp = 1;
                this.uuids[zfiid].pkSk.push(["jg_23", this.teams[iid].jgSk["jg_23"][3], this.teams[iid].jgSk["jg_23"][2], 0, 0]);
            }
        }
        //攻击时有25%概率减少目标18%连击抗性，可叠加3层，持续5回合
        if (this.teams[iid].jgSk["jg_27"] != null) {
            if (this.seedRand.rand(1, 10000) <= this.teams[iid].jgSk["jg_27"][0]) {
                log.atker.effect.push(['jg_27', 1]);
                log.isUp = 1;
                let count = 0;
                for (const val of this.uuids[zfiid].pkSk) {
                    if (val[0] == "jg_27") {
                        count += 1;
                    }
                }
                if (count < this.teams[iid].jgSk["jg_27"][2]) {
                    this.uuids[zfiid].pkSk.push(["jg_27", this.teams[iid].jgSk["jg_27"][3], this.teams[iid].jgSk["jg_27"][1], 0, 0]);
                }
            }
        }
        //攻击时有25%概率提高10%反击和8%攻击，并削弱目标10%连击，持续2回合
        if (this.teams[iid].jgSk["jg_28"] != null) {
            if (this.seedRand.rand(1, 10000) <= this.teams[iid].jgSk["jg_28"][0]) {
                log.atker.effect.push(['jg_28', 1]);
                log.isUp = 1;
                this.uuids[iid].pkSk.push(["jg_28", this.teams[iid].jgSk["jg_28"][4], this.teams[iid].jgSk["jg_28"][1], this.teams[iid].jgSk["jg_28"][2], 0]);
                this.uuids[zfiid].pkSk.push(["jg_28", this.teams[iid].jgSk["jg_28"][4], 0, 0, this.teams[iid].jgSk["jg_28"][3]]);
            }
        }
        //攻击时有25%概率提高18%晕眩和10%防御，持续2回合
        if (this.teams[iid].jgSk["jg_29"] != null) {
            if (this.seedRand.rand(1, 10000) <= this.teams[iid].jgSk["jg_29"][0]) {
                log.atker.effect.push(['jg_29', 1]);
                log.isUp = 1;
                this.uuids[iid].pkSk.push(["jg_29", this.teams[iid].jgSk["jg_29"][3], this.teams[iid].jgSk["jg_29"][1], this.teams[iid].jgSk["jg_29"][2], 0]);
            }
        }
        //攻击时有25%概率提供自身14%防御力，持续2回合
        if (this.teams[iid].jgSk["jg_30"] != null) {
            if (this.seedRand.rand(1, 10000) <= this.teams[iid].jgSk["jg_30"][0]) {
                log.atker.effect.push(['jg_30', 1]);
                log.isUp = 1;
                this.uuids[iid].pkSk.push(["jg_30", this.teams[iid].jgSk["jg_30"][2] + 1, this.teams[iid].jgSk["jg_30"][1], 0, 0]);
            }
        }
        //攻击时有25%概率减少目标17%防御力，持续2回合
        if (this.teams[iid].jgSk["jg_31"] != null) {
            if (this.seedRand.rand(1, 10000) <= this.teams[iid].jgSk["jg_31"][0]) {
                log.atker.effect.push(['jg_31', 1]);
                log.isUp = 1;
                this.uuids[zfiid].pkSk.push(["jg_31", this.teams[iid].jgSk["jg_31"][2], this.teams[iid].jgSk["jg_31"][1], 0, 0]);
            }
        }
        //攻击时有25%概率提高自身11%攻击力，持续2回合
        if (this.teams[iid].jgSk["jg_32"] != null) {
            if (this.seedRand.rand(1, 10000) <= this.teams[iid].jgSk["jg_32"][0]) {
                log.atker.effect.push(['jg_32', 1]);
                log.isUp = 1;
                this.uuids[zfiid].pkSk.push(["jg_32", this.teams[iid].jgSk["jg_32"][2], this.teams[iid].jgSk["jg_32"][1], 0, 0]);
            }
        }
        //攻击时有25%概率降低自身11%攻击力，持续2回合
        if (this.teams[iid].jgSk["jg_33"] != null) {
            if (this.seedRand.rand(1, 10000) <= this.teams[iid].jgSk["jg_33"][0]) {
                log.atker.effect.push(['jg_33', 1]);
                log.isUp = 1;
                this.uuids[zfiid].pkSk.push(["jg_33", this.teams[iid].jgSk["jg_33"][2] + 1, this.teams[iid].jgSk["jg_33"][1], 0, 0]);
            }
        }
        //攻击时有25%概率回复攻击力14%的生命值
        if (this.teams[iid].jgSk["jg_34"] != null) {
            if (this.seedRand.rand(1, 10000) <= this.teams[iid].jgSk["jg_34"][0]) {
                log.atker.effect.push(['jg_34', 1]);
                let addHp = Math.floor(this.teams[iid].eps.atk * this.teams[iid].jgSk["jg_34"][1] / 10000);
                addHp += Math.floor(addHp * (this.teams[iid].eps.qhmifa - this.teams[zfiid].eps.rhmifa) / 10000);
                addHp += Math.floor(addHp * (this.teams[iid].eps.qhzhiliao - this.teams[zfiid].eps.rhzhiliao) / 10000);
                addHp = Math.max(1, addHp);
                this.teams[iid].eps.hp += addHp;
                if (this.teams[iid].eps.hp > this.teams[iid].eps.hp_max) {
                    this.teams[iid].eps.hp = this.teams[iid].eps.hp_max;
                }
                log.atker.effect.push(['huifu', addHp]);
                this.uuids[iid].addHp += addHp;
                log.isUp = 1;
            }
        }
        //攻击时有25%概率减少目标8%强化战将，可叠加3层，持续5回合
        if (this.teams[iid].jgSk["jg_24"] != null && this.teams[fXlid] != null && this.teams[fXlid].eps.hp > 0) {
            if (this.seedRand.rand(1, 10000) <= this.teams[iid].jgSk["jg_24"][0]) {
                log.atker.effect.push(['jg_24', 1]);
                log.isUp = 1;
                let count = 0;
                for (const val of this.uuids[fXlid].pkSk) {
                    if (val[0] == "jg_24") {
                        count += 1;
                    }
                }
                if (count < this.teams[iid].jgSk["jg_24"][2]) {
                    this.uuids[fXlid].pkSk.push(["jg_24", this.teams[iid].jgSk["jg_24"][3], this.teams[iid].jgSk["jg_24"][1], 0, 0]);
                }
            }
        }
        //每2回合吸取目标一次12%攻击力，持续1回合
        if (this.teams[iid].jgSk["jg_39"] != null && this.huihe / this.teams[iid].jgSk["jg_39"][0] == 0) {
            this.uuids[iid].pkSk.push(["jg_39", this.teams[iid].jgSk["jg_39"][2], this.teams[iid].jgSk["jg_39"][1], 0, 0]);
            this.uuids[zfiid].pkSk.push(["jg_39", this.teams[iid].jgSk["jg_39"][2], -1 * this.teams[iid].jgSk["jg_39"][1], 0, 0]);
        }
        //isAtk 0正常攻击  1反击 2连击
        if (isAtk == 0) {
            //【通幽】每回合提升6%的晕眩几率
            if (this.teams[iid].wxSk["wxlm_6"] != null) {
                this.teams[iid].eps.jiyun += this.teams[iid].wxSk["wxlm_6"][0];
            }
        }
        //isAtk 0正常攻击  1反击 2连击
        if (isAtk == 1) {
            log.isUp = 1;
            log.atker.effect.push(['fanji', 1]);
            fz51 = 1;
            //每次反击都提升{0}吸血，最多叠加{1}次，持续至战斗结束。
            if (this.uuids[iid].fzSk["105"]["default"] > 0) {
                this.uuids[iid].fzSk["105"]["default"] -= 1;
                log.atker.effect.push(['fazhen', 105]);
                this.teams[iid].eps.xixue += this.uuids[iid].fzSk["105"]["default_per"];
            }
            if (this.teams[iid].wxSk["wxxf_6"] != null && this.uuids[myXlid] != null) {
                this.uuids[myXlid].pkSk.push(["wxxf_6", this.teams[iid].wxSk["wxxf_6"][1], this.teams[iid].wxSk["wxxf_6"][0], 0, 0]);
            }
            if (this.teams[iid].jgSk["jg_4"] != null && this.seedRand.rand(1, 10000) <= this.teams[iid].jgSk["jg_4"][0]) {
                log.atker.effect.push(['jg_4', 1]);
                let addAtk = Math.floor(this.teams[zfiid].eps.atk * this.teams[iid].jgSk["jg_4"][1] / 10000);
                this.uuids[iid].pkSk.push(["jg_4", this.teams[iid].jgSk["jg_4"][2], addAtk, 0, 0]);
                this.uuids[zfiid].pkSk.push(["jg_4", this.teams[iid].jgSk["jg_4"][2], -1 * addAtk, 0, 0]);
            }
            if (this.uuids[iid].sqSk["11"][0] > 0 && this.uuids[zfiid].sq11 < 3) {
                this.uuids[zfiid].sq11 += 1;
                this.teams[zfiid].eps.shanbi -= this.uuids[iid].sqSk["11"][0];
            }
        }
        //isAtk 0正常攻击  1反击 2连击
        if (isAtk == 2) {
            fz51 = 1;
            log.isUp = 1;
            log.atker.effect.push(['lianji', 1]);
            //触发连击时，恢复自身{0}攻击力的生命值。
            if (this.uuids[iid].fzSk["102"]["default_per"] > 0) {
                let add_per = 0;
                add_per += this.uuids[iid].fzSk["102"]["default_per"];
                log.atker.effect.push(['fazhen', 102]);
                add_per += this.uuids[iid].fzSk["53"]["default_per"];
                for (const _xlskid of ["395", "396", "397", "398", "399"]) {
                    add_per += this.uuids[iid].xlSk[_xlskid][1];
                }
                let addHp = Math.floor(this.teams[iid].eps.atk * add_per / 10000);
                //太白金星在场时，所有敌对单位的生命回复效果降低{0}
                if (this.uuids[fXlid] != null && this.teams[fXlid].eps.hp > 0 && this.uuids[fXlid].camp != this.uuids[iid].camp) {
                    let yzhuifu = this.uuids[fXlid].xlSk["202"][0];
                    for (const _xlskid of ["435", "436", "437", "438", "439"]) {
                        yzhuifu += this.uuids[fXlid].xlSk[_xlskid][0];
                    }
                    addHp -= Math.floor(addHp * yzhuifu / 10000);
                }
                for (const val of this.uuids[iid].pkSk) {
                    if (val[0] == "wxxf_74" || val[0] == "wxxf_75") {
                        addHp += Math.floor(addHp * val[2] / 10000);
                    }
                    if (val[0] == "wxxf_33") {
                        addHp -= Math.floor(addHp * val[2] / 10000);
                    }
                }
                if (addHp > 0) {
                    this.uuids[iid].addHp += addHp;
                    log.atker.effect.push(['huifu', addHp]);
                    this.teams[iid].eps.hp = Math.min(this.teams[iid].eps.hp + addHp, this.teams[iid].eps.hp_max);
                    log.atker.hp = this.teams[iid].eps.hp;
                }
            }
            if (this.teams[iid].jgSk["jg_5"] != null) {
                let jg_5_c = 0;
                for (const val of this.uuids[iid].pkSk) {
                    if (val[0] == "jg_5") {
                        jg_5_c += 1;
                    }
                }
                if (jg_5_c < this.teams[iid].jgSk["jg_5"][2]) {
                    log.atker.effect.push(['jg_5', 1]);
                    this.uuids[iid].pkSk.push(["jg_5", this.teams[iid].jgSk["jg_5"][1], this.teams[iid].jgSk["jg_5"][0], 0, 0]);
                }
            }
        }
        let zptHit = 0; //主攻击伤害
        let wxmf_type_1 = 0; //万象秘法类型1
        let wxmf_type_1_id = ""; //触发技能id
        if (this.cfwanxiang == false && isAtk == 0 && this.uuids[iid].nuqi >= 10000) {
            //进行一次{0}攻击力的攻击，并提升{1}攻击力，持续{2}回合
            if (this.teams[iid].wxSk["wxxf_1"] != null) {
                this.uuids[iid].nuqi = 0;
                log.atker.nuqi = 0;
                wxmf_type_1 = 1;
                wxmf_type_1_id = "wxxf_1";
                this.cfwanxiang = true;
                log.aType = Xys_1.ActionType.wxsk;
                this.uuids[iid].pkSk.push(["wxxf_1", this.teams[iid].wxSk["wxxf_1"][2] + 1, this.teams[iid].wxSk["wxxf_1"][1], 0, 0]);
            }
            if (this.teams[iid].wxSk["wxxf_2"] != null) {
                this.uuids[iid].nuqi = 0;
                log.atker.nuqi = 0;
                wxmf_type_1 = 1;
                wxmf_type_1_id = "wxxf_2";
                this.cfwanxiang = true;
                log.aType = Xys_1.ActionType.wxsk;
            }
            if (this.teams[iid].wxSk["wxxf_13"] != null) {
                this.uuids[iid].nuqi = 0;
                log.atker.nuqi = 0;
                wxmf_type_1 = 1;
                wxmf_type_1_id = "wxxf_13";
                this.cfwanxiang = true;
                log.aType = Xys_1.ActionType.wxsk;
                this.uuids[iid].pkSk.push(["wxxf_13", this.teams[iid].wxSk["wxxf_13"][2] + 1, this.teams[iid].wxSk["wxxf_13"][1], 0, 0]);
                let addHp = Math.floor(this.teams[iid].eps.atk * this.teams[iid].wxSk["wxxf_13"][0] / 10000);
                addHp += Math.floor(addHp * (this.teams[zhuid].eps.qhmifa - this.teams[fzhuid].eps.rhmifa) / 10000);
                addHp += Math.floor(addHp * (this.teams[zhuid].eps.qhzhiliao - this.teams[fzhuid].eps.rhzhiliao) / 10000);
                addHp = Math.max(1, addHp);
                this.teams[iid].eps.hp += addHp;
                if (this.teams[iid].eps.hp > this.teams[iid].eps.hp_max) {
                    this.teams[iid].eps.hp = this.teams[iid].eps.hp_max;
                }
                log.atker.effect.push(['huifu', addHp]);
                this.uuids[iid].addHp += addHp;
                log.isUp = 1;
                this.addLog(log);
                return;
            }
            if (this.teams[iid].wxSk["wxxf_15"] != null) {
                this.uuids[iid].nuqi = 0;
                log.atker.nuqi = 0;
                wxmf_type_1 = 1;
                wxmf_type_1_id = "wxxf_15";
                this.cfwanxiang = true;
                log.aType = Xys_1.ActionType.wxsk;
            }
            if (this.teams[iid].wxSk["wxxf_18"] != null) {
                this.uuids[iid].nuqi = 0;
                log.atker.nuqi = 0;
                wxmf_type_1 = 1;
                wxmf_type_1_id = "wxxf_18";
                this.cfwanxiang = true;
                log.aType = Xys_1.ActionType.wxsk;
                this.uuids[iid].pkSk.push(["wxxf_18", 2, this.teams[iid].wxSk["wxxf_18"][1], 0, 0]);
            }
            if (this.teams[iid].wxSk["wxxf_28"] != null) {
                this.uuids[iid].nuqi = 0;
                log.atker.nuqi = 0;
                wxmf_type_1 = 1;
                wxmf_type_1_id = "wxxf_28";
                this.cfwanxiang = true;
                log.aType = Xys_1.ActionType.wxsk;
            }
            if (this.teams[iid].wxSk["wxxf_32"] != null) {
                this.uuids[iid].nuqi = 0;
                log.atker.nuqi = 0;
                wxmf_type_1 = 1;
                wxmf_type_1_id = "wxxf_32";
                this.cfwanxiang = true;
                log.aType = Xys_1.ActionType.wxsk;
                this.uuids[zfiid].pkSk.push(["wxxf_32", 1, 0, 0, 0]);
            }
            if (this.teams[iid].wxSk["wxxf_39"] != null) {
                this.uuids[iid].nuqi = 0;
                log.atker.nuqi = 0;
                wxmf_type_1 = 1;
                wxmf_type_1_id = "wxxf_39";
                this.cfwanxiang = true;
                log.aType = Xys_1.ActionType.wxsk;
                this.uuids[iid].pkSk.push(["wxxf_39", 2, this.teams[iid].wxSk["wxxf_39"][1], 0, 0]); //并获得{1}最终减伤，持续到下回合结束
                let addHp = Math.floor(this.teams[iid].eps.atk * this.teams[iid].wxSk["wxxf_39"][0] / 10000);
                addHp += Math.floor(addHp * (this.teams[zhuid].eps.qhmifa - this.teams[fzhuid].eps.rhmifa) / 10000);
                addHp += Math.floor(addHp * (this.teams[zhuid].eps.qhzhiliao - this.teams[fzhuid].eps.rhzhiliao) / 10000);
                addHp = Math.max(1, addHp);
                this.teams[iid].eps.hp += addHp;
                if (this.teams[iid].eps.hp > this.teams[iid].eps.hp_max) {
                    this.teams[iid].eps.hp = this.teams[iid].eps.hp_max;
                }
                log.atker.effect.push(['huifu', addHp]);
                this.uuids[iid].addHp += addHp;
                log.isUp = 1;
                this.addLog(log);
                return;
            }
            if (this.teams[iid].wxSk["wxxf_42"] != null) {
                this.uuids[iid].nuqi = 0;
                wxmf_type_1 = 1;
                wxmf_type_1_id = "wxxf_42";
                this.cfwanxiang = true;
                log.aType = Xys_1.ActionType.wxsk;
                this.uuids[iid].nuqi += this.teams[iid].wxSk["wxxf_42"][1];
                log.atker.nuqi = this.uuids[iid].nuqi;
            }
            if (this.teams[iid].wxSk["wxxf_43"] != null) {
                this.uuids[iid].nuqi = 0;
                log.atker.nuqi = 0;
                wxmf_type_1 = 1;
                wxmf_type_1_id = "wxxf_43";
                this.cfwanxiang = true;
                log.aType = Xys_1.ActionType.wxsk;
            }
            if (this.teams[iid].wxSk["wxxf_49"] != null) {
                this.uuids[iid].nuqi = 0;
                log.atker.nuqi = 0;
                wxmf_type_1 = 1;
                wxmf_type_1_id = "wxxf_49";
                this.cfwanxiang = true;
                log.aType = Xys_1.ActionType.wxsk;
                this.uuids[iid].pkSk.push(["wxxf_49", this.teams[iid].wxSk["wxxf_49"][2] + 1, this.teams[iid].wxSk["wxxf_49"][1], 0, 0]); //并提升{1}爆伤，持续{2}回合
            }
            if (this.teams[iid].wxSk["wxxf_50"] != null) {
                this.uuids[iid].nuqi = 0;
                log.atker.nuqi = 0;
                wxmf_type_1 = 1;
                wxmf_type_1_id = "wxxf_50";
                this.cfwanxiang = true;
                log.aType = Xys_1.ActionType.wxsk;
                let wxxf_50_hp = Math.floor(this.teams[iid].eps.atk * this.teams[iid].wxSk["wxxf_50"][1] / 10000);
                this.uuids[iid].pkSk.push(["wxxf_50", this.teams[iid].wxSk["wxxf_50"][2] + 1, wxxf_50_hp, 0, 0]); //接下来每回合恢复{1}攻击力生命值，持续{2}回合
                let addHp = Math.floor(this.teams[iid].eps.atk * this.teams[iid].wxSk["wxxf_50"][0] / 10000);
                addHp += Math.floor(addHp * (this.teams[zhuid].eps.qhmifa - this.teams[fzhuid].eps.rhmifa) / 10000);
                addHp += Math.floor(addHp * (this.teams[zhuid].eps.qhzhiliao - this.teams[fzhuid].eps.rhzhiliao) / 10000);
                addHp = Math.max(1, addHp);
                this.teams[iid].eps.hp += addHp;
                if (this.teams[iid].eps.hp > this.teams[iid].eps.hp_max) {
                    this.teams[iid].eps.hp = this.teams[iid].eps.hp_max;
                }
                log.atker.effect.push(['huifu', addHp]);
                this.uuids[iid].addHp += addHp;
                log.isUp = 1;
                this.addLog(log);
                return;
            }
            if (this.teams[iid].wxSk["wxxf_51"] != null) {
                this.uuids[iid].nuqi = 0;
                log.atker.nuqi = 0;
                wxmf_type_1 = 1;
                wxmf_type_1_id = "wxxf_51";
                this.cfwanxiang = true;
                log.aType = Xys_1.ActionType.wxsk;
            }
            if (this.teams[iid].wxSk["wxxf_53"] != null) {
                this.uuids[iid].nuqi = 0;
                log.atker.nuqi = 0;
                wxmf_type_1 = 1;
                wxmf_type_1_id = "wxxf_53";
                this.cfwanxiang = true;
                log.aType = Xys_1.ActionType.wxsk;
                //并恢复自身{1}攻击力生命
                let addHp = Math.floor(this.teams[iid].eps.atk * this.teams[iid].wxSk["wxxf_53"][1] / 10000);
                addHp += Math.floor(addHp * (this.teams[zhuid].eps.qhmifa - this.teams[fzhuid].eps.rhmifa) / 10000);
                addHp += Math.floor(addHp * (this.teams[zhuid].eps.qhzhiliao - this.teams[fzhuid].eps.rhzhiliao) / 10000);
                addHp = Math.max(1, addHp);
                this.teams[iid].eps.hp += addHp;
                if (this.teams[iid].eps.hp > this.teams[iid].eps.hp_max) {
                    this.teams[iid].eps.hp = this.teams[iid].eps.hp_max;
                }
                log.atker.effect.push(['huifu', addHp]);
                this.uuids[iid].addHp += addHp;
                log.isUp = 1;
            }
            if (this.teams[iid].wxSk["wxxf_58"] != null) {
                this.uuids[iid].nuqi = 0;
                log.atker.nuqi = 0;
                wxmf_type_1 = 1;
                wxmf_type_1_id = "wxxf_58";
                this.cfwanxiang = true;
                log.aType = Xys_1.ActionType.wxsk;
                this.uuids[iid].pkSk.push(["wxxf_58", this.teams[iid].wxSk["wxxf_58"][3] + 1, this.teams[iid].wxSk["wxxf_58"][1], this.teams[iid].wxSk["wxxf_58"][2], 0]); //接下来每回合恢复{1}攻击力生命值，持续{2}回合
            }
            if (this.teams[iid].wxSk["wxxf_68"] != null) {
                this.uuids[iid].nuqi = 0;
                log.atker.nuqi = 0;
                wxmf_type_1 = 1;
                wxmf_type_1_id = "wxxf_68";
                this.cfwanxiang = true;
                log.aType = Xys_1.ActionType.wxsk;
            }
            if (this.teams[iid].wxSk["wxxf_69"] != null) {
                this.uuids[iid].nuqi = 0;
                log.atker.nuqi = 0;
                wxmf_type_1 = 1;
                wxmf_type_1_id = "wxxf_69";
                this.cfwanxiang = true;
                log.aType = Xys_1.ActionType.wxsk;
            }
            if (this.teams[iid].wxSk["wxxf_72"] != null) {
                this.uuids[iid].nuqi = 0;
                log.atker.nuqi = 0;
                wxmf_type_1 = 1;
                wxmf_type_1_id = "wxxf_72";
                this.cfwanxiang = true;
                log.aType = Xys_1.ActionType.wxsk;
                this.uuids[iid].pkSk.push(["wxxf_72", 2, this.teams[iid].wxSk["wxxf_72"][1], 0, 0]); //提升自己下回合{1}闪避
            }
            if (this.teams[iid].wxSk["wxxf_74"] != null) {
                this.uuids[iid].nuqi = 0;
                log.atker.nuqi = 0;
                wxmf_type_1 = 1;
                wxmf_type_1_id = "wxxf_74";
                this.cfwanxiang = true;
                log.aType = Xys_1.ActionType.wxsk;
                this.uuids[iid].pkSk.push(["wxxf_74", this.teams[iid].wxSk["wxxf_74"][2] + 1, this.teams[iid].wxSk["wxxf_74"][1], 0, 0]); //提升{1}强化治疗，持续{2}回合
                let addHp = Math.floor((this.teams[iid].eps.hp_max - this.teams[iid].eps.hp) * this.teams[iid].wxSk["wxxf_74"][0] / 10000);
                addHp += Math.floor(addHp * (this.teams[zhuid].eps.qhmifa - this.teams[fzhuid].eps.rhmifa) / 10000);
                addHp += Math.floor(addHp * (this.teams[zhuid].eps.qhzhiliao - this.teams[fzhuid].eps.rhzhiliao) / 10000);
                addHp = Math.max(1, addHp);
                this.teams[iid].eps.hp += addHp;
                if (this.teams[iid].eps.hp > this.teams[iid].eps.hp_max) {
                    this.teams[iid].eps.hp = this.teams[iid].eps.hp_max;
                }
                log.atker.effect.push(['huifu', addHp]);
                this.uuids[iid].addHp += addHp;
                log.isUp = 1;
                this.addLog(log);
                return;
            }
        }
        let wxmf_type_2 = 0; //万象秘法类型2
        let wxmf_type_2_id = ""; //触发技能2id
        if (["10", "20"].indexOf(iid) != -1) {
            let wxmf_type_keys_2 = [
                "wxxf_3", "wxxf_7", "wxxf_8", "wxxf_11", "wxxf_17", "wxxf_21", "wxxf_22", "wxxf_23", "wxxf_24", "wxxf_29", "wxxf_40",
                "wxxf_47", "wxxf_52", "wxxf_54", "wxxf_59", "wxxf_64", "wxxf_66", "wxxf_67", "wxxf_70"
            ];
            for (const keys of wxmf_type_keys_2) {
                if (this.teams[iid].wxSk[keys] != null) {
                    wxmf_type_2 = 1; //万象秘法类型2
                    wxmf_type_2_id = keys; //触发技能2id
                }
            }
        }
        let wxmf_type_3 = 0; //万象秘法类型3
        let wxmf_type_3_id = ""; //触发技能3id
        if (["11", "21"].indexOf(iid) != -1) {
            let wxmf_type_keys_3 = [
                "wxxf_4", "wxxf_5", "wxxf_9", "wxxf_12", "wxxf_19", "wxxf_26", "wxxf_30", "wxxf_31", "wxxf_33",
                "wxxf_35", "wxxf_36", "wxxf_45", "wxxf_46", "wxxf_48", "wxxf_55", "wxxf_61", "wxxf_62", "wxxf_71", "wxxf_75"
            ];
            for (const keys of wxmf_type_keys_3) {
                if (this.teams[zhuid].wxSk[keys] != null) {
                    wxmf_type_3 = 1; //万象秘法类型3
                    wxmf_type_3_id = keys; //触发技能3id
                }
            }
            //使携带仙侣的治疗效果增加{0}
            if (wxmf_type_3_id == "wxxf_4" && this.teams[zhuid].wxSk["wxxf_4"][0] > 0) {
                this.teams[iid].eps.xixue += this.teams[zhuid].wxSk["wxxf_4"][0];
                this.teams[zhuid].wxSk["wxxf_4"][0] = 0;
            }
            //第{0}回合开始，下次仙侣释放技能时对主角进行{1}次治疗，恢复已损失生命的{2}
            if (wxmf_type_3_id == "wxxf_5" && this.huihe >= this.teams[zhuid].wxSk["wxxf_5"][0] && this.teams[zhuid].eps.hp > 0) {
                let addHp = Math.floor((this.teams[zhuid].eps.hp_max - this.teams[zhuid].eps.hp) * this.teams[zhuid].wxSk["wxxf_5"][0] / 10000);
                addHp += Math.floor(addHp * (this.teams[zhuid].eps.qhzhiliao - this.teams[fzhuid].eps.rhzhiliao) / 10000);
                this.teams[zhuid].eps.hp += addHp;
                if (this.teams[zhuid].eps.hp > this.teams[zhuid].eps.hp_max) {
                    this.teams[zhuid].eps.hp = this.teams[zhuid].eps.hp_max;
                }
                log.atker.effect.push(['huifu', addHp]);
                this.uuids[zhuid].addHp += addHp;
                log.isUp = 1;
            }
            //仙侣首次释放技能时，使主角生命恢复{0}，免疫燃烧和冰冻{1}回合
            if (wxmf_type_3_id == "wxxf_9" && this.teams[zhuid].eps.hp > 0) {
                let addHp = Math.floor(this.teams[zhuid].eps.hp_max * this.teams[zhuid].wxSk["wxxf_9"][0] / 10000);
                addHp += Math.floor(addHp * (this.teams[zhuid].eps.qhzhiliao - this.teams[fzhuid].eps.rhzhiliao) / 10000);
                this.teams[zhuid].eps.hp += addHp;
                if (this.teams[zhuid].eps.hp > this.teams[zhuid].eps.hp_max) {
                    this.teams[zhuid].eps.hp = this.teams[zhuid].eps.hp_max;
                }
                log.atker.effect.push(['huifu', addHp]);
                this.uuids[zhuid].addHp += addHp;
                log.isUp = 1;
                this.uuids[zhuid].pkSk.push(["wxxf_9", this.teams[zhuid].wxSk["wxxf_9"][1], 0, 0, 0]);
                //仙侣首次释放技能时，使主角生命恢复{0}，免疫燃烧和冰冻{1}回合
                let copyPkSk = gameMethod_1.gameMethod.objCopy(this.uuids[zhuid].pkSk);
                this.uuids[zhuid].pkSk = [];
                for (const val of copyPkSk) {
                    if (["xl_3", "xl_14", "xl_51", "xl_64", "wxxf_12", "wxxf_32", "wxxf_31"].indexOf(val[0]) == -1) {
                        this.uuids[iid].pkSk.push(val);
                    }
                }
                delete this.teams[zhuid].wxSk["wxxf_9"];
            }
            //仙侣首次释放技能后将获取{0}连击和抗连击属性，同时移除对手等量的属性，直到战斗结束
            if (wxmf_type_3_id == "wxxf_26" && this.teams[zhuid].wxSk["wxxf_26"][0] > 0) {
                this.teams[iid].eps.lianji += this.teams[zhuid].wxSk["wxxf_26"][0];
                this.teams[iid].eps.hslianji += this.teams[zhuid].wxSk["wxxf_26"][0];
                this.teams[zfiid].eps.lianji = Math.max(0, this.teams[zfiid].eps.lianji - this.teams[zhuid].wxSk["wxxf_26"][0]);
                this.teams[zfiid].eps.hslianji = Math.max(0, this.teams[zfiid].eps.lianji - this.teams[zhuid].wxSk["wxxf_26"][0]);
                delete this.teams[zhuid].wxSk["wxxf_26"];
            }
            //仙侣每次释放技能都能回复额外{0}点灵力
            if (wxmf_type_3_id == "wxxf_30") {
                this.uuids[zhuid].nuqi += this.teams[zhuid].wxSk["wxxf_30"][0];
                let _target1 = {
                    fid: this.teams[zhuid].fid,
                    iid: zhuid,
                    hp: this.teams[zhuid].eps.hp,
                    nuqi: this.uuids[zhuid].nuqi,
                    buff: this.getShowBuff(zhuid),
                    effect: [],
                    isUp: 0,
                    status: 0,
                };
                log.target.push(_target1);
            }
            //每过{0}回合，在仙侣下一次释放技能后有{1}概率对敌人施加一次冰冻技能，持续到下回合
            if (wxmf_type_3_id == "wxxf_31" && this.huihe % this.teams[zhuid].wxSk["wxxf_31"][0] == 0) {
                if (this.seedRand.rand(1, 10000) <= this.teams[zhuid].wxSk["wxxf_31"][1]) {
                    this.uuids[zfiid].pkSk.push(["wxxf_31", 1, 0, 0, 0]);
                }
            }
            //仙侣攻击时，使目标受到的治疗降低{0}，持续{1}回合
            if (wxmf_type_3_id == "wxxf_33") {
                this.uuids[zfiid].pkSk.push(["wxxf_33", this.teams[zhuid].wxSk["wxxf_33"][1], this.teams[zhuid].wxSk["wxxf_33"][0], 0, 0]);
            }
            //释放技能后，使主角连击抵抗提高{0}，持续{1}回合
            if (wxmf_type_3_id == "wxxf_35") {
                this.uuids[zhuid].pkSk.push(["wxxf_35", this.teams[zhuid].wxSk["wxxf_35"][1], this.teams[zhuid].wxSk["wxxf_35"][0], 0, 0]);
            }
            //仙侣每次攻击后，为主角恢复生命值上限{0}的血量，并增加{1}的攻击力，持续{2}回合
            if (wxmf_type_3_id == "wxxf_36" && this.teams[zhuid].eps.hp > 0) {
                let addHp = Math.floor(this.teams[zhuid].eps.hp_max * this.teams[zhuid].wxSk["wxxf_36"][0] / 10000);
                addHp += Math.floor(addHp * (this.teams[zhuid].eps.qhzhiliao - this.teams[fzhuid].eps.rhzhiliao) / 10000);
                this.teams[zhuid].eps.hp += addHp;
                if (this.teams[zhuid].eps.hp > this.teams[zhuid].eps.hp_max) {
                    this.teams[zhuid].eps.hp = this.teams[zhuid].eps.hp_max;
                }
                this.uuids[zhuid].addHp += addHp;
                log.isUp = 1;
                let _target1 = {
                    fid: this.teams[zhuid].fid,
                    iid: zhuid,
                    hp: this.teams[zhuid].eps.hp,
                    nuqi: this.uuids[zhuid].nuqi,
                    buff: this.getShowBuff(zhuid),
                    effect: [['huifu', addHp]],
                    isUp: 0,
                    status: 0,
                };
                log.target.push(_target1);
                this.uuids[zhuid].pkSk.push(["wxxf_36", this.teams[zhuid].wxSk["wxxf_36"][2], this.teams[zhuid].wxSk["wxxf_36"][1], 0, 0]);
            }
            //仙侣攻击后，降低敌人的{0}暴击抵抗、吸血抵抗，持续{1}回合
            if (wxmf_type_3_id == "wxxf_46") {
                this.uuids[zfiid].pkSk.push(["wxxf_46", this.teams[zhuid].wxSk["wxxf_46"][1], this.teams[zhuid].wxSk["wxxf_46"][0], 0, 0]);
            }
            //仙侣攻击时，降低敌方的全特殊属性{0}，持续{1}回合
            if (wxmf_type_3_id == "wxxf_48") {
                this.uuids[zfiid].pkSk.push(["wxxf_48", this.teams[zhuid].wxSk["wxxf_48"][1], this.teams[zhuid].wxSk["wxxf_48"][0], 0, 0]);
            }
            //仙侣攻击携带负面状态的敌人时，使其最终减伤降低{0}，持续{1}回合
            if (wxmf_type_3_id == "wxxf_61") {
                for (const val of this.uuids[zfiid].pkSk) {
                    if (["xl_329", "xl_3", "xl_14", "xl_51", "xl_64", "xl_234", "xl_265", "xl_151", "wxxf_32", "wxxf_31"].indexOf(val[0]) != -1) {
                        this.uuids[zfiid].pkSk.push(["wxxf_61", this.teams[zhuid].wxSk["wxxf_61"][1], this.teams[zhuid].wxSk["wxxf_61"][0], 0, 0]); //并获得{1}最终减伤，持续到下回合结束
                        break;
                    }
                }
            }
            //仙侣行动后提升自身{0}速度，可叠加，持续到战斗结束
            if (wxmf_type_3_id == "wxxf_71") {
                this.teams[iid].eps.speed += Math.floor(this.teams[zhuid].eps.speed * this.teams[zhuid].wxSk["wxxf_71"][0] / 10000);
            }
            //仙侣行动后提升自身{0}吸血和{1}治疗强化，持续{2}回合
            if (wxmf_type_3_id == "wxxf_75") {
                this.uuids[zhuid].pkSk.push(["wxxf_75", this.teams[zhuid].wxSk["wxxf_75"][2], this.teams[zhuid].wxSk["wxxf_75"][0], this.teams[zhuid].wxSk["wxxf_75"][1], 0]);
            }
        }
        let wxmf_type_4 = 0; //万象秘法类型4
        let wxmf_type_4_id = ""; //触发技能4id
        if (["10", "20"].indexOf(iid) != -1) {
            let wxmf_type_keys_4 = [
                "wxxf_6", "wxxf_10", "wxxf_14", "wxxf_16", "wxxf_20", "wxxf_25", "wxxf_27", "wxxf_37",
                "wxxf_41", "wxxf_44", "wxxf_56", "wxxf_57", "wxxf_60", "wxxf_63", "wxxf_73", "wxxf_76"
            ];
            for (const keys of wxmf_type_keys_4) {
                if (this.teams[iid].wxSk[keys] != null) {
                    wxmf_type_4 = 1; //万象秘法类型3
                    wxmf_type_4_id = keys; //触发技能3id
                }
            }
            if (wxmf_type_4_id == "wxxf_16") {
                this.uuids[iid].pkSk.push(["wxxf_16", this.teams[iid].wxSk["wxxf_16"][2], this.teams[iid].wxSk["wxxf_16"][1], this.teams[zhuid].wxSk["wxxf_16"][0], 0]);
                delete this.teams[iid].wxSk["wxxf_16"];
            }
            if (wxmf_type_4_id == "wxxf_25") {
                this.uuids[iid].pkSk.push(["wxxf_25", this.teams[iid].wxSk["wxxf_25"][1], this.teams[iid].wxSk["wxxf_25"][0], 0, 0]);
                delete this.teams[iid].wxSk["wxxf_25"];
            }
            if (wxmf_type_4_id == "wxxf_56") {
                this.uuids[iid].nuqi += this.teams[iid].wxSk["wxxf_56"][0];
                log.atker.nuqi += this.uuids[iid].nuqi;
                log.isUp = 1;
            }
            //开场时，偷取敌方{0}的速度和{1}的攻击力，偷取攻击最高不超过{2}自身攻击力，持续{3}回合
            if (wxmf_type_4_id == "wxxf_60") {
                let max_tou = Math.min(this.teams[zfiid].eps.atk * this.teams[iid].wxSk["wxxf_60"][1] / 10000, this.teams[iid].eps.atk * this.teams[iid].wxSk["wxxf_60"][2] / 10000);
                this.uuids[iid].pkSk.push(["wxxf_60", this.teams[iid].wxSk["wxxf_60"][3], this.teams[iid].wxSk["wxxf_60"][0], Math.floor(max_tou), 0]);
                delete this.teams[iid].wxSk["wxxf_60"];
            }
            //每次被攻击增加{0}仙侣强化，最高叠加{1}层，持续到下次仙侣行动
            if (wxmf_type_4_id == "wxxf_63" && this.uuids[fXlid] != null && this.teams[fXlid].eps.hp < 1) {
                this.teams[iid].wxSk["wxxf_63"][2] = 0;
            }
        }
        for (const fiid of fiids) {
            let _target = {
                fid: this.teams[fiid].fid,
                iid: fiid,
                hp: this.teams[fiid].eps.hp,
                nuqi: this.uuids[fiid].nuqi,
                buff: this.getShowBuff(fiid),
                effect: [],
                isUp: 0,
                status: 0,
            };
            if (fiid == zfiid) {
                //每次被攻击增加{0}仙侣强化，最高叠加{1}层，持续到下次仙侣行动
                if (this.teams[zfiid].wxSk["wxxf_63"] != null && this.uuids[fXlid] != null) {
                    if (this.teams[zfiid].wxSk["wxxf_63"][2] == null) {
                        this.teams[zfiid].wxSk["wxxf_63"][2] = 0;
                    }
                    if (this.teams[zfiid].wxSk["wxxf_63"][1] > this.teams[zfiid].wxSk["wxxf_63"][2]) {
                        this.teams[zfiid].wxSk["wxxf_63"][2] += 1;
                        this.uuids[fXlid].pkSk.push(["wxxf_63", 1, this.teams[zfiid].wxSk["wxxf_63"][0], 0, 0]);
                    }
                }
                if (wxmf_type_1_id == "wxxf_2") {
                    this.uuids[zfiid].nuqi = Math.max(0, this.uuids[zfiid].nuqi - this.teams[iid].wxSk["wxxf_2"][1]);
                    _target.nuqi = this.uuids[zfiid].nuqi;
                }
                //攻击时，额外造成24%攻击力的伤害，并有25%概率提高35%暴击，持续2回合
                if (this.teams[iid].jgSk["jg_26"] != null) {
                    log.atker.effect.push(['jg_26', 1]);
                    let subHpwx = Math.floor(this.teams[iid].eps.atk * this.teams[iid].jgSk["jg_26"][0] / 10000);
                    this.uuids[iid].hurt += subHpwx;
                    this.teams[zfiid].eps.hp = Math.max(0, this.teams[zfiid].eps.hp - subHpwx);
                    _target.effect.push(['hp', -1 * subHpwx]);
                    _target.hp = this.teams[fiid].eps.hp;
                    _target.isUp = 1;
                    log.isUp = 1;
                    if (this.teams[fiid].eps.hp < 1 && this.siles.indexOf(fiid) == -1) {
                        if (this.teams[fiid].eps.shengqi == 5 || this.teams[fiid].wxSk["wxxf_55"] != null) {
                            _target.status = 1;
                        }
                        for (const _xlskid of ["390", "391", "392", "393", "394"]) {
                            if (this.uuids[fiid].xlSk[_xlskid][0] > 0) {
                                _target.status = 1;
                            }
                        }
                        if (["xlf_43", "xl_43"].indexOf(this.teams[fiid].fid) != -1) {
                            this.teams[fiid].eps.hp = 1;
                            _target.hp = this.teams[fiid].eps.hp;
                            this.uuids[fiid].xl_360 = 1;
                        }
                        else {
                            this.siles.push(fiid);
                        }
                    }
                    if (this.seedRand.rand(1, 10000) <= this.teams[iid].jgSk["jg_26"][1]) {
                        this.uuids[iid].pkSk.push(["jg_26", this.teams[iid].jgSk["jg_26"][3], this.teams[iid].jgSk["jg_26"][2], 0, 0]);
                    }
                }
            }
            //每次攻击偷取目标{0}的攻击力，每层最高不超过{1}自身攻击力，最多叠加{2}层，持续到战斗结束
            if (wxmf_type_2 == 1 && fiid == zfiid) {
                if (wxmf_type_2_id == "wxxf_24" && this.teams[iid].wxSk["wxxf_24"][2] > 0) {
                    this.teams[iid].wxSk["wxxf_24"][2] -= 1;
                    //最大伤害
                    let max_atk = Math.floor(this.teams[iid].eps.atk * this.teams[iid].wxSk["wxxf_24"][1] / 10000);
                    let max_fatk = Math.floor(this.teams[fiid].eps.atk * this.teams[iid].wxSk["wxxf_24"][0] / 10000);
                    max_atk = Math.min(max_atk, max_fatk);
                    this.teams[iid].eps.atk += max_atk;
                    this.teams[fiid].eps.atk = Math.max(1, this.teams[fiid].eps.atk - max_atk);
                }
                if (wxmf_type_2_id == "wxxf_52" && this.teams[myXlid] != null) {
                    this.uuids[myXlid].pkSk.push(["wxxf_52", 1, this.teams[iid].wxSk["wxxf_52"][0], 0, 0]);
                }
                if (wxmf_type_2_id == "wxxf_66") {
                    for (const val of this.uuids[fiid].pkSk) {
                        if (["xl_329", "xl_3", "xl_14", "xl_51", "xl_64", "xl_234", "xl_265", "xl_151", "wxxf_32", "wxxf_31"].indexOf(val[0]) != -1) {
                            if (this.seedRand.rand(1, 10000) <= this.teams[iid].wxSk["wxxf_66"][0]) {
                                let addHp = Math.floor((this.teams[fiid].eps.hp_max - this.teams[fiid].eps.hp) * this.teams[iid].wxSk["wxxf_66"][1] / 10000);
                                addHp += Math.floor(addHp * (this.teams[zhuid].eps.qhzhiliao - this.teams[fzhuid].eps.rhzhiliao) / 10000);
                                this.uuids[fiid].addHp += addHp;
                                _target.effect.push(["huifu", addHp]);
                                this.teams[fiid].eps.hp = Math.min(this.teams[fiid].eps.hp_max, this.teams[fiid].eps.hp + addHp);
                                _target.hp = this.teams[fiid].eps.hp;
                                _target.isUp = 1;
                            }
                        }
                    }
                }
                if (wxmf_type_2_id == "wxxf_70") {
                    if (this.teams[iid].wxSk["wxxf_70"][1] > 0) {
                        this.teams[iid].wxSk["wxxf_70"][1] -= 1;
                        this.teams[iid].eps.jiyun += this.teams[iid].wxSk["wxxf_70"][0];
                    }
                }
            }
            let allatk = this.teams[iid].eps.atk + this.uuids[iid].sqSk["10"][1];
            //战斗开始时，攻击力增加{0}。当生命值首次低于{1}时，额外再增加{2}攻击，持续到战斗结束。
            if (this.uuids[iid].fzSk["202"]["round"] == 0 && this.teams[iid].eps.hp * 10000 / this.teams[iid].eps.hp_max < this.uuids[iid].fzSk["202"]["default_per1"]) {
                this.uuids[iid].fzSk["202"]["round"] += 1;
                allatk += Math.floor(this.teams[iid].eps.e_atk * this.uuids[iid].fzSk["202"]["default_per2"] / 10000);
                log.atker.effect.push(['fazhen', 202]);
                log.isUp = 1;
            }
            //战斗开始时，攻击力增加{0}。每次触发连击时，偷取目标{1}的攻击力，持续{2}回合。 (对方有这个buff)
            let atk_203 = 0;
            for (const _val of this.uuids[fzhuid].pkSk) { //被他偷走攻击力
                if (_val[0] == "fz_203") {
                    if (atk_203 == 0) {
                        atk_203 = this.teams[iid].eps.atk;
                    }
                    let tou_203 = Math.floor(atk_203 * this.uuids[fzhuid].fzSk["203"]["default_per1"] / 10000);
                    allatk -= tou_203;
                    atk_203 -= tou_203;
                }
            }
            if (["10", "20"].indexOf(iid) != -1) {
                for (const _val of this.uuids[fzhuid].pkSk) { //被他偷走攻击力
                    if (_val[0] == "wxxf_60") {
                        allatk -= _val[3];
                        atk_203 -= _val[3];
                    }
                }
            }
            atk_203 = 0;
            for (const _val of this.uuids[iid].pkSk) { //我偷走他的攻击力
                if (_val[0] == "fz_203" && this.teams[_val[2].toString()] != null) {
                    if (atk_203 == 0) {
                        atk_203 = this.teams[_val[2].toString()].eps.atk;
                    }
                    let tou_203 = Math.floor(atk_203 * this.uuids[iid].fzSk["203"]["default_per1"] / 10000);
                    allatk += tou_203;
                    atk_203 -= tou_203;
                    // log.atker.effect.push(['fazhen',203])
                }
                if (_val[0] == "fz_101") {
                    allatk += Math.floor(this.teams[iid].eps.e_atk * this.uuids[iid].fzSk["101"]["default_per"] / 10000);
                }
                //东皇太一在攻击时有{0}概率使目标的攻击力降低{2}，持续{1}回合
                if (["xl_335", "xl_336", "xl_337", "xl_338", "xl_339", "wxxf_7"].indexOf(_val[0]) != -1) {
                    allatk -= Math.floor(this.teams[iid].eps.atk * _val[2] / 10000);
                }
                if (["wxxf_21", "wxxf_67", "wxxf_36"].indexOf(_val[0]) != -1) {
                    allatk += Math.floor(this.teams[iid].eps.atk * _val[2] / 10000);
                }
                if (["jg_4"].indexOf(_val[0]) != -1) {
                    allatk += _val[2];
                }
            }
            if (["10", "20"].indexOf(iid) != -1) {
                for (const _val of this.uuids[iid].pkSk) { //偷他走攻击力
                    if (_val[0] == "wxxf_60") {
                        allatk += _val[3];
                        atk_203 += _val[3];
                    }
                }
            }
            if (wxmf_type_2 == 1 && fiid == zfiid) {
                if (wxmf_type_2_id == "wxxf_3") {
                    //最大伤害
                    let max_atk = Math.floor(allatk * this.teams[iid].wxSk["wxxf_3"][1] / 10000);
                    let jianshang = this.teams[zfiid].eps.jianshang;
                    for (const val of this.uuids[zfiid].pkSk) {
                        if (val[0] == "jg_2" || val[0] == "jg_9" || val[0] == "wxxf_68") {
                            jianshang -= val[2];
                        }
                        if (val[0] == "wxxf_39") {
                            jianshang += val[2];
                        }
                    }
                    jianshang = Math.max(0, jianshang);
                    let max_baseHit = (max_atk - this.teams[zfiid].eps.def) * (10000 + this.teams[iid].eps.zengshang - jianshang) / 10000;
                    let max_ptHit = Math.round(Math.max(max_baseHit, max_atk * 0.15) * this.seedRand.rand(97, 103) / 100);
                    let subHpwx = Math.min(max_ptHit, Math.floor(this.teams[zfiid].eps.hp * this.teams[iid].wxSk["wxxf_3"][0] / 10000));
                    this.uuids[iid].hurt += subHpwx;
                    this.teams[fiid].eps.hp = Math.max(0, this.teams[fiid].eps.hp - subHpwx);
                    _target.effect.push(['hp', -1 * subHpwx]);
                    _target.hp = this.teams[fiid].eps.hp;
                    _target.isUp = 1;
                    log.isUp = 1;
                }
                if (wxmf_type_2_id == "wxxf_23") {
                    this.uuids[fiid].nuqi = Math.max(0, this.uuids[fiid].nuqi - this.teams[iid].wxSk["wxxf_23"][0]);
                    _target.nuqi = this.uuids[fiid].nuqi;
                    _target.isUp = 1;
                    log.isUp = 1;
                }
            }
            let isZhong = false;
            for (const _val of this.uuids[fiid].pkSk) {
                if (_val[0] == "jiyun") {
                    isZhong = true; //对方眩晕 必中   7	太虚盾 闪避触发时可回复{0}血量，并移除被晕眩无法闪避的限制
                    break;
                }
            }
            for (const _val of this.uuids[fiid].pkSk) {
                if (_val[0] == "wxxf_32" || _val[0] == "wxxf_31") {
                    isZhong = true; //对方冰冻 必中 
                    break;
                }
            }
            if (isAtk == 1) {
                isZhong = true;
            }
            if (isZhong == false) {
                //2.如果敌人处于非晕眩中，则按命中率判断   命中率=1+我方抗闪避-敌方闪避	
                let fshanbi_per = this.teams[fiid].eps.shanbi + this.teams[fiid].eps.hsteshu - this.teams[iid].eps.hsshanbi - this.teams[iid].eps.qhteshu;
                fshanbi_per += this.teams[fiid].eps.qhkangxing - this.teams[iid].eps.hskangxing;
                if (this.uuids[fiid].xl_shanbi > 0) { //如果是仙侣技能触发闪避 直接概率
                    fshanbi_per = this.uuids[fiid].xl_shanbi;
                }
                for (const val of this.uuids[fiid].pkSk) {
                    if (val[0] == "wxxf_72") {
                        fshanbi_per += val[2];
                    }
                    if (val[0] == "wxxf_48") {
                        fshanbi_per -= val[2];
                    }
                    if (val[0] == "jg_6") {
                        fshanbi_per += val[2];
                    }
                    if (val[0] == "jg_21" && val[3] == 5) {
                        fshanbi_per += val[2];
                    }
                }
                if (this.seedRand.rand(1, 10000) > fshanbi_per) {
                    isZhong = true;
                }
                else {
                    _target.effect.push(["shanbi", 1]); //对方闪避
                    //【元神】触发闪避后，强化仙侣提升4%，最多叠加5次。
                    if (this.uuids[myXlid] != null && this.teams[iid].wxSk["wxlm_4"] != null && this.teams[iid].wxSk["wxlm_4"][1] > 0) {
                        this.teams[iid].wxSk["wxlm_4"][1] -= 1;
                        this.uuids[myXlid].atk_per += this.teams[iid].wxSk["wxlm_4"][0];
                    }
                    if (wxmf_type_2 == 1 && fiid == zfiid) {
                        if (wxmf_type_2_id == "wxxf_22") {
                            //最大伤害
                            let max_atk = Math.floor(allatk * this.teams[iid].wxSk["wxxf_22"][1] / 10000);
                            let jianshang = this.teams[zfiid].eps.jianshang;
                            for (const val of this.uuids[zfiid].pkSk) {
                                if (val[0] == "jg_2" || val[0] == "jg_9" || val[0] == "wxxf_68") {
                                    jianshang -= val[2];
                                }
                                if (val[0] == "wxxf_39") {
                                    jianshang += val[2];
                                }
                            }
                            jianshang = Math.max(0, jianshang);
                            let max_baseHit = (max_atk - this.teams[zfiid].eps.def) * (10000 + this.teams[iid].eps.zengshang - jianshang) / 10000;
                            let max_ptHit = Math.round(Math.max(max_baseHit, max_atk * 0.15) * this.seedRand.rand(97, 103) / 100);
                            let subHpwx = Math.min(max_ptHit, Math.floor(this.teams[zfiid].eps.hp_max * this.teams[iid].wxSk["wxxf_22"][0] / 10000));
                            this.uuids[iid].hurt += subHpwx;
                            this.teams[fiid].eps.hp = Math.max(0, this.teams[fiid].eps.hp - subHpwx);
                            _target.effect.push(['hp', -1 * subHpwx]);
                            _target.hp = this.teams[fiid].eps.hp;
                            _target.isUp = 1;
                            log.isUp = 1;
                            if (this.teams[fiid].eps.hp < 1 && this.siles.indexOf(fiid) == -1) {
                                if (this.teams[fiid].eps.shengqi == 5 || this.teams[fiid].wxSk["wxxf_55"] != null) {
                                    _target.status = 1;
                                }
                                for (const _xlskid of ["390", "391", "392", "393", "394"]) {
                                    if (this.uuids[fiid].xlSk[_xlskid][0] > 0) {
                                        _target.status = 1;
                                    }
                                }
                                if (["xlf_43", "xl_43"].indexOf(this.teams[fiid].fid) != -1) {
                                    this.teams[fiid].eps.hp = 1;
                                    _target.hp = this.teams[fiid].eps.hp;
                                    this.uuids[fiid].xl_360 = 1;
                                }
                                else {
                                    this.siles.push(fiid);
                                }
                            }
                        }
                    }
                    _target.isUp = 1;
                    //每次闪避后，恢复自身生命值上限的{1}。
                    if (this.uuids[fiid].fzSk["157"]["default_per"] > 0) {
                        let add_per = this.uuids[fiid].fzSk["53"]["default_per"] + this.uuids[fiid].fzSk["157"]["default_per"];
                        for (const _xlskid of ["395", "396", "397", "398", "399"]) {
                            add_per += this.uuids[fiid].xlSk[_xlskid][1];
                        }
                        let addHp = Math.floor(this.teams[fiid].eps.hp_max * add_per / 10000);
                        addHp += Math.floor(addHp * (this.teams[fiid].eps.qhzhiliao - this.teams[iid].eps.rhzhiliao) / 10000);
                        //太白金星在场时，所有敌对单位的生命回复效果降低{0}
                        if (this.uuids[myXlid] != null && this.teams[myXlid].eps.hp > 0 && this.uuids[myXlid].camp != this.uuids[fiid].camp) {
                            let yzhuifu = this.uuids[myXlid].xlSk["202"][0];
                            for (const _xlskid of ["435", "436", "437", "438", "439"]) {
                                yzhuifu += this.uuids[myXlid].xlSk[_xlskid][0];
                            }
                            addHp -= Math.floor(addHp * yzhuifu / 10000);
                        }
                        for (const val of this.uuids[iid].pkSk) {
                            if (val[0] == "wxxf_74" || val[0] == "wxxf_75") {
                                addHp += Math.floor(addHp * val[2] / 10000);
                            }
                            if (val[0] == "wxxf_33") {
                                addHp -= Math.floor(addHp * val[2] / 10000);
                            }
                        }
                        if (addHp > 0) {
                            this.uuids[fiid].addHp += addHp;
                            _target.effect.push(["huifu", addHp]);
                            _target.effect.push(["fazhen", 157]);
                            this.teams[fiid].eps.hp = Math.min(this.teams[fiid].eps.hp_max, this.teams[fiid].eps.hp + addHp);
                            _target.hp = this.teams[fiid].eps.hp;
                            _target.isUp = 1;
                        }
                    }
                    //201 战斗开始时，生命值上限增加{0}。每次触发闪避时，恢复攻击力{1}的生命值，同时对敌人造成{2}攻击的伤害。
                    if (this.uuids[fiid].fzSk["201"]["default_per1"] > 0) {
                        let add_per = this.uuids[fiid].fzSk["53"]["default_per"] + this.uuids[fiid].fzSk["201"]["default_per1"];
                        for (const _xlskid of ["395", "396", "397", "398", "399"]) {
                            add_per += this.uuids[fiid].xlSk[_xlskid][1];
                        }
                        let addHp = Math.floor(this.teams[fiid].eps.hp_max * add_per / 10000);
                        addHp += Math.floor(addHp * (this.teams[fiid].eps.qhzhiliao - this.teams[iid].eps.rhzhiliao) / 10000);
                        //太白金星在场时，所有敌对单位的生命回复效果降低{0}
                        if (this.uuids[myXlid] != null && this.teams[myXlid].eps.hp > 0 && this.uuids[myXlid].camp != this.uuids[fiid].camp) {
                            let yzhuifu = this.uuids[myXlid].xlSk["202"][0];
                            for (const _xlskid of ["435", "436", "437", "438", "439"]) {
                                yzhuifu += this.uuids[myXlid].xlSk[_xlskid][0];
                            }
                            addHp -= Math.floor(addHp * yzhuifu / 10000);
                        }
                        for (const val of this.uuids[iid].pkSk) {
                            if (val[0] == "wxxf_74" || val[0] == "wxxf_75") {
                                addHp += Math.floor(addHp * val[2] / 10000);
                            }
                            if (val[0] == "wxxf_33") {
                                addHp -= Math.floor(addHp * val[2] / 10000);
                            }
                        }
                        if (addHp > 0) {
                            this.uuids[fiid].addHp += addHp;
                            _target.effect.push(["huifu", addHp]);
                            _target.effect.push(["fazhen", 201]);
                            this.teams[fiid].eps.hp = Math.min(this.teams[fiid].eps.hp_max, this.teams[fiid].eps.hp + addHp);
                            _target.hp = this.teams[fiid].eps.hp;
                            _target.isUp = 1;
                        }
                        let subhp201 = Math.floor(this.teams[fiid].eps.atk * this.uuids[fiid].fzSk["201"]["default_per2"] / 10000);
                        if (subhp201 > 0) {
                            log.atker.effect.push(['hp', -1 * subhp201]);
                            this.teams[iid].eps.hp -= subhp201;
                            log.atker.hp = this.teams[iid].eps.hp;
                            log.isUp = 1;
                        }
                        if (this.teams[iid].eps.hp < 1) { //打方被反死
                            if (this.teams[iid].eps.shengqi == 5 || this.teams[iid].wxSk["wxxf_55"] != null) {
                                _target.status = 1;
                            }
                            for (const _xlskid of ["390", "391", "392", "393", "394"]) {
                                if (this.uuids[iid].xlSk[_xlskid][0] > 0) {
                                    _target.status = 1;
                                }
                            }
                            if (["xlf_43", "xl_43"].indexOf(this.teams[iid].fid) != -1) {
                                this.teams[iid].eps.hp = 1;
                                log.atker.hp = this.teams[iid].eps.hp;
                                this.uuids[iid].xl_360 = 1;
                            }
                            else {
                                this.siles.push(iid);
                            }
                            this.isOver = true;
                            log.target.push(_target);
                            this.addLog(log);
                            return;
                        }
                    }
                    //躲避触发时可回复{0}血量，并移除被禁锢无法躲避的限制
                    if (this.uuids[fiid].sqSk["7"][0] > 0) {
                        let add_per = this.uuids[fiid].fzSk["53"]["default_per"] + this.uuids[fiid].sqSk["7"][0];
                        for (const _xlskid of ["395", "396", "397", "398", "399"]) {
                            add_per += this.uuids[fiid].xlSk[_xlskid][1];
                        }
                        let addHp = Math.floor(this.teams[fiid].eps.hp_max * add_per / 10000);
                        addHp += Math.floor(addHp * (this.teams[fiid].eps.qhzhiliao - this.teams[iid].eps.rhzhiliao) / 10000);
                        //太白金星在场时，所有敌对单位的生命回复效果降低{0}
                        if (this.uuids[myXlid] != null && this.teams[myXlid].eps.hp > 0 && this.uuids[myXlid].camp != this.uuids[fiid].camp) {
                            let yzhuifu = this.uuids[myXlid].xlSk["202"][0];
                            for (const _xlskid of ["435", "436", "437", "438", "439"]) {
                                yzhuifu += this.uuids[myXlid].xlSk[_xlskid][0];
                            }
                            addHp -= Math.floor(addHp * yzhuifu / 10000);
                        }
                        for (const val of this.uuids[iid].pkSk) {
                            if (val[0] == "wxxf_74" || val[0] == "wxxf_75") {
                                addHp += Math.floor(addHp * val[2] / 10000);
                            }
                            if (val[0] == "wxxf_33") {
                                addHp -= Math.floor(addHp * val[2] / 10000);
                            }
                        }
                        if (addHp > 0) {
                            this.uuids[fiid].addHp += addHp;
                            _target.effect.push(["huifu", addHp]);
                            this.teams[fiid].eps.hp = Math.min(this.teams[fiid].eps.hp_max, this.teams[fiid].eps.hp + addHp);
                            _target.hp = this.teams[fiid].eps.hp;
                            _target.isUp = 1;
                        }
                    }
                    //战斗中如果闪避，回复10%血量，持续到战斗结束
                    if (this.teams[fiid].jgSk["jg_44"] != null) {
                        let addHp = Math.floor(this.teams[fiid].eps.hp_max * this.teams[fiid].jgSk["jg_44"][0] / 10000);
                        addHp += Math.floor(addHp * (this.teams[fiid].eps.qhzhiliao - this.teams[iid].eps.rhzhiliao) / 10000);
                        //太白金星在场时，所有敌对单位的生命回复效果降低{0}
                        if (this.uuids[myXlid] != null && this.teams[myXlid].eps.hp > 0 && this.uuids[myXlid].camp != this.uuids[fiid].camp) {
                            let yzhuifu = this.uuids[myXlid].xlSk["202"][0];
                            for (const _xlskid of ["435", "436", "437", "438", "439"]) {
                                yzhuifu += this.uuids[myXlid].xlSk[_xlskid][0];
                            }
                            addHp -= Math.floor(addHp * yzhuifu / 10000);
                        }
                        for (const val of this.uuids[fiid].pkSk) {
                            if (val[0] == "wxxf_74" || val[0] == "wxxf_75") {
                                addHp += Math.floor(addHp * val[2] / 10000);
                            }
                            if (val[0] == "wxxf_33") {
                                addHp -= Math.floor(addHp * val[2] / 10000);
                            }
                        }
                        if (addHp > 0) {
                            this.uuids[fiid].addHp += addHp;
                            _target.effect.push(["huifu", addHp]);
                            this.teams[fiid].eps.hp = Math.min(this.teams[fiid].eps.hp_max, this.teams[fiid].eps.hp + addHp);
                            _target.hp = this.teams[fiid].eps.hp;
                            _target.isUp = 1;
                        }
                    }
                    //自身闪避时，本回合反击率提升{0}。
                    if (this.uuids[fiid].fzSk["104"]["default_per"] > 0) {
                        this.uuids[fiid].fzSk["104"]["round"] = 1;
                    }
                    //闪避时，有{0}概率造成对方晕眩，持续{1}回合
                    if (this.teams[fiid].wxSk["wxxf_10"] != null) {
                        if (this.seedRand.rand(1, 10000) <= this.teams[fiid].wxSk["wxxf_10"][0]) {
                            this.uuids[iid].pkSk.push(["jiyun", this.teams[fiid].wxSk["wxxf_10"][1] + 1, 0, 0, 0]);
                            log.atker.effect.push(["jiyun", 1]);
                        }
                    }
                    //当自身闪避后，增加{0}的暴击概率，持续{1}回合
                    if (this.teams[fiid].wxSk["wxxf_44"] != null) {
                        this.uuids[fiid].pkSk.push(["wxxf_44", this.teams[fiid].wxSk["wxxf_44"][1], this.teams[fiid].wxSk["wxxf_44"][0], 0, 0]);
                    }
                    //触发闪避时，攻击伤害提高15%，最多叠加5次，持续到战斗结束
                    if (this.teams[fiid].jgSk["jg_25"] != null && this.teams[fiid].jgSk["jg_25"][1] > 0) {
                        this.teams[fiid].jgSk["jg_25"][1] -= 1;
                        this.uuids[fiid].pkSk.push(["jg_25", 30, this.teams[fiid].jgSk["jg_25"][0], 0, 0]);
                    }
                }
            }
            if (isZhong == false) {
                if (_target.isUp == 1) {
                    log.target.push(_target);
                    log.isUp = 1;
                }
                continue;
            }
            let baoji_hit_per = 0; //增加暴击伤害
            //// 就是，反击跟连击（第二次）时，不会暴击，也不会闪避，但是必中
            //b如果命中则先判断是否触发暴击  暴击率=max((我方暴击-敌方抗暴击),0)
            let baoji_per = this.teams[iid].eps.baoji + this.teams[iid].eps.qhteshu - this.teams[fiid].eps.hsteshu; //暴击概率
            let hsbaoji_per = this.teams[fiid].eps.hsbaoji + this.teams[fiid].eps.qhkangxing - this.teams[iid].eps.hskangxing; //暴击概率
            //战斗前3回合，暴击概率提升{0}，暴击伤害提升{1}。
            if (this.huihe <= 3 && this.uuids[iid].fzSk["152"]["default_per"] > 0) {
                baoji_per += this.uuids[iid].fzSk["152"]["default_per"];
                _target.effect.push(["fazhen", 152]);
                _target.isUp = 1;
            }
            //前3回合暴击伤害提高54.4%
            if (this.teams[iid].jgSk["jg_35"] != null && this.huihe <= this.teams[iid].jgSk["jg_35"][0]) {
                baoji_per += this.teams[iid].jgSk["jg_35"][1];
            }
            if (isAtk == 1) { //反暴击
                baoji_per = this.teams[iid].eps.fanbao;
                hsbaoji_per = this.teams[fiid].eps.hsfanbao;
            }
            if (isAtk == 2) { //连爆
                baoji_per = this.teams[iid].eps.lianbao;
                hsbaoji_per = this.teams[fiid].eps.hslianbao;
            }
            //战斗前3回合，暴击概率提升{0}，暴击伤害提升{1}。
            if (this.huihe <= 3 && this.uuids[iid].fzSk["152"]["default_per"] > 0) {
                baoji_hit_per += this.uuids[iid].fzSk["152"]["default_per1"];
                _target.isUp = 1;
            }
            if (this.teams[iid].jgSk["jg_41"] != null) {
                baoji_hit_per += this.teams[iid].jgSk["jg_41"][0];
                _target.isUp = 1;
            }
            for (const _val of this.uuids[iid].pkSk) {
                if (["wxxf_49", "wxxf_54"].indexOf(_val[0]) != -1) {
                    baoji_hit_per += _val[2];
                }
                if (["wxxf_58", "wxxf_16"].indexOf(_val[0]) != -1) {
                    baoji_per += _val[2];
                    baoji_hit_per += _val[3];
                }
                if (_val[0] == "wxxf_48" || _val[0] == "wxxf_44") {
                    baoji_per -= _val[2];
                }
                if (_val[0] == "jg_26") {
                    baoji_per += _val[2];
                }
            }
            let fdef = this.teams[fiid].eps.def;
            let sub_fdef_per = 0;
            //钟馗的攻击直击灵魂，忽视防御{0}
            for (const _xlskid of ["187", "188", "189", "190", "191", "350", "351", "352", "353", "354"]) {
                sub_fdef_per += this.uuids[iid].xlSk[_xlskid][0];
            }
            //忽视防御{1}
            for (const _xlskid of ["302", "303", "304", "305", "306"]) {
                sub_fdef_per += this.uuids[iid].xlSk[_xlskid][1];
            }
            //忽视防御{2}
            for (const _xlskid of ["229", "230", "231", "232", "233"]) {
                sub_fdef_per += this.uuids[iid].xlSk[_xlskid][2];
            }
            //蚩尤受到伤害减免{0}，攻击时有{1}概率使对方防御降低{2}，持续{3}回合
            for (const _val of this.uuids[iid].pkSk) {
                if (["xl_400", "xl_401", "xl_402", "xl_403", "xl_404", "xl_465", "xl_466", "xl_467", "xl_468", "xl_469", "wxxf_13"].indexOf(_val[0]) != -1) {
                    sub_fdef_per += _val[2];
                }
            }
            //地藏菩萨受到攻击时，有{0}概率提高自身{1}防御，持续{2}回合，重复施加时重新计时
            for (const _val of this.uuids[fiid].pkSk) {
                if (["xl_375", "xl_376", "xl_377", "xl_378", "xl_379", "js_30"].indexOf(_val[0]) != -1) {
                    sub_fdef_per -= _val[2];
                }
                if (["wxxf_17", "js_31"].indexOf(_val[0]) != -1) {
                    sub_fdef_per += _val[2];
                }
            }
            //并提升百分比攻击力，持续{2}回合
            let allatk_per = 10000;
            for (const _val of this.uuids[iid].pkSk) {
                if (["wxxf_1", "jg_25", "jg_32", "jg_39"].indexOf(_val[0]) != -1) {
                    allatk_per += _val[2];
                }
                if (["jg_24", "jg_33", "jg_23"].indexOf(_val[0]) != -1) {
                    allatk_per -= _val[2];
                }
                if (["jg_28"].indexOf(_val[0]) != -1) {
                    allatk_per += _val[3];
                }
            }
            //前5回合攻击力提高13.6%
            if (this.teams[iid].jgSk["jg_37"] != null && this.huihe <= this.teams[iid].jgSk["jg_37"][0]) {
                log.atker.effect.push(["jg_37", 1]);
                allatk_per += this.teams[iid].jgSk["jg_37"][1];
            }
            if (sub_fdef_per > 0) {
                fdef -= Math.floor(fdef * sub_fdef_per / 10000);
            }
            //  伤害公式：
            // 	普通伤害=max((我方攻击-敌方防御)*(1+我方增伤-敌方减伤),我方攻击*0.15)*RANDBETWEEN(0.97,1.03)
            // 	暴击伤害=max((我方攻击-敌方防御)*2*（我方增暴-敌方减暴）*(1+我方增伤-敌方减伤),我方攻击*0.15)*RANDBETWEEN(0.97,1.03)
            //触发万象技能
            if (wxmf_type_1 == 1) {
                if (["wxxf_1", "wxxf_2", "wxxf_15", "wxxf_18", "wxxf_28", "wxxf_32", "wxxf_42", "wxxf_43", "wxxf_49", "wxxf_51", "wxxf_53", "wxxf_58", "wxxf_68", "wxxf_69", "wxxf_72"].indexOf(wxmf_type_1_id) != -1) {
                    allatk = Math.floor(allatk * this.teams[iid].wxSk[wxmf_type_1_id][0] / 10000);
                }
                if (["wxxf_15", "wxxf_51"].indexOf(wxmf_type_1_id) != -1) {
                    let wxxf_dr_hit = Math.floor(this.teams[iid].eps.atk * this.teams[iid].wxSk[wxmf_type_1_id][1] / 10000);
                    this.uuids[zfiid].pkSk.push([wxmf_type_1_id, this.teams[iid].wxSk[wxmf_type_1_id][2], wxxf_dr_hit, 0, 0]);
                }
                if (wxmf_type_1_id == "wxxf_32") {
                    _target.effect.push(["wxxf_32", 1]); //冰冻效果
                    _target.isUp = 1;
                }
            }
            let fbaoji_per = baoji_per - hsbaoji_per;
            if (this.uuids[iid].xl_baoji > 0) { //如果是仙侣技能触发 直接概率
                fbaoji_per = this.uuids[iid].xl_baoji;
            }
            for (const val of this.uuids[fiid].pkSk) {
                if (val[0] == "wxxf_46") {
                    fbaoji_per = Math.max(0, fbaoji_per - val[2]);
                }
                if (val[0] == "jg_21" && val[3] == 1) {
                    fbaoji_per = Math.max(0, fbaoji_per - val[2]);
                }
            }
            //释放阵图技能时，有25%提高阵图技能暴击，并且增加18%的爆伤
            if (wxmf_type_1 == 1 && this.teams[iid].jgSk["jg_12"] != null) {
                log.atker.effect.push(["jg_12", 1]);
                fbaoji_per += this.teams[iid].jgSk["jg_12"][0];
                baoji_hit_per += this.teams[iid].jgSk["jg_12"][1];
            }
            if (wxmf_type_1_id == "wxxf_68") {
                allatk = Math.floor(allatk * this.teams[iid].wxSk["wxxf_68"][0] / 10000);
            }
            //基础伤害
            allatk = Math.floor(allatk * allatk_per / 10000);
            let jianshang = this.teams[zfiid].eps.jianshang;
            for (const val of this.uuids[zfiid].pkSk) {
                if (val[0] == "jg_2" || val[0] == "jg_9" || val[0] == "wxxf_68") {
                    jianshang -= val[2];
                }
                if (val[0] == "wxxf_39") {
                    jianshang += val[2];
                }
            }
            jianshang = Math.max(0, jianshang);
            let baseHit = (allatk - fdef) * (10000 + this.teams[iid].eps.zengshang - jianshang) / 10000;
            //普通伤害
            let ptHit = Math.round(Math.max(baseHit, allatk * 0.15) * this.seedRand.rand(97, 103) / 100);
            //暴击伤害
            let bjHit = Math.round(Math.max(baseHit * (20000 + this.teams[iid].eps.baonue + baoji_hit_per - this.teams[fiid].eps.renai) / 10000, allatk * (0.15 * (20000 + this.teams[iid].eps.baonue + baoji_hit_per - this.teams[fiid].eps.renai) / 10000)) * this.seedRand.rand(97, 103) / 100);
            if (this.seedRand.rand(1, 10000) <= fbaoji_per) {
                //【五行】每次暴击后，爆伤提升12%，直到战斗结束
                if (this.teams[iid].wxSk["wxlm_5"] != null) {
                    this.teams[iid].eps.baonue += this.teams[iid].wxSk["wxlm_5"][0];
                }
                fz51 = 1;
                //触发暴击后，增加自身{0}攻击力，持续{1}回合。
                if (this.uuids[iid].fzSk["101"]["default_per"] > 0 && this.uuids[iid].count_fz101 == 0) {
                    this.uuids[iid].pkSk.push(["fz_101", this.uuids[iid].fzSk["101"]["default"] + 1, 0, 0, 0]); //这边+1 因为结束会减1
                    log.atker.effect.push(['fazhen', 101]);
                    this.uuids[iid].count_fz101 += 1;
                }
                //每次暴击后都会提高{0}的攻击力，直到战斗结束
                if (this.uuids[iid].sqSk["10"][0] > 0 && this.uuids[iid].sqSk["10"][2] < 3) {
                    this.uuids[iid].sqSk["10"][2] += 1;
                    this.uuids[iid].sqSk["10"][1] += Math.floor(this.teams[iid].eps.atk * this.uuids[iid].sqSk["10"][0] / 10000);
                }
                let addwxhit = 0;
                if (this.uuids[fiid].yishang[0] == "wxxf_29") {
                    addwxhit = Math.floor(ptHit * this.uuids[fiid].yishang[1] / 10000);
                    this.uuids[fiid].yishang = ["", 0];
                }
                if (this.uuids[fiid].yishang[0] == "jg_19") {
                    addwxhit = Math.floor(ptHit * this.uuids[fiid].yishang[1] / 10000);
                    this.uuids[fiid].yishang = ["", 0];
                }
                ptHit = bjHit;
                ptHit += addwxhit;
                log.atker.effect.push(['baoji', 1]);
                log.isUp = 1;
                if (wxmf_type_2_id == "wxxf_54") {
                    let addHp = this.teams[iid].eps.atk * this.teams[iid].wxSk["wxxf_54"][0];
                    addHp += Math.floor(addHp * (this.teams[iid].eps.qhzhiliao - this.teams[fiid].eps.rhzhiliao) / 10000);
                    this.uuids[iid].addHp += addHp;
                    log.atker.effect.push(['huifu', addHp]);
                    this.teams[iid].eps.hp = Math.min(this.teams[iid].eps.hp + addHp, this.teams[iid].eps.hp_max);
                    log.atker.hp = this.teams[iid].eps.hp;
                    log.isUp = 1;
                    this.uuids[iid].pkSk.push(["wxxf_54", this.teams[iid].wxSk["wxxf_54"][2] + 1, this.teams[iid].wxSk["wxxf_54"][1], 0, 0]);
                }
                //暴击后，降低目标最终减伤34%，持续2回合
                if (this.teams[iid].jgSk["jg_2"] != null) {
                    _target.effect.push(["jg_2", 1]); //冰冻效果
                    _target.isUp = 1;
                    this.uuids[fiid].pkSk.push(["jg_2", this.teams[iid].jgSk["jg_2"][1], this.teams[iid].jgSk["jg_2"][0], 0, 0]);
                }
            }
            let atk_per = 0; //基数1W  伤害提升
            atk_per += this.uuids[iid].atk_per;
            //反击所造成的伤害额外提高{0}，并移除被禁锢无法反击的限制
            if (isAtk == 1) {
                atk_per += this.teams[iid].eps.qhfanji - this.teams[fiid].eps.rhfanji;
                atk_per += this.uuids[iid].sqSk["9"][0];
                //【灵根】反击时，伤害提升40%
                if (this.teams[iid].wxSk["wxlm_2"] != null) {
                    atk_per += this.teams[iid].wxSk["wxlm_2"][0];
                }
            }
            if (isAtk == 2) {
                atk_per += this.teams[iid].eps.qhlianji - this.teams[fiid].eps.rhlianji;
            }
            let add_speed = 0;
            if (["10", "20"].indexOf(iid) != -1) {
                for (const _val of this.uuids[zfiid].pkSk) { //被他偷走攻击力
                    if (_val[0] == "wxxf_60") {
                        add_speed -= Math.floor(this.teams[iid].eps.speed * _val[2] / 10000);
                    }
                }
            }
            if (["10", "20"].indexOf(iid) != -1) {
                for (const _val of this.uuids[iid].pkSk) { //被他偷走攻击力
                    if (_val[0] == "wxxf_60") {
                        add_speed += Math.floor(this.teams[fiid].eps.speed * _val[2] / 10000);
                    }
                }
            }
            //每比对方高1%的魔力值，则伤害提高{0}
            let beishu = Math.floor((this.teams[iid].eps.speed + add_speed - this.teams[fiid].eps.speed) / 100);
            if (beishu > 0) {
                atk_per += Math.min(2000, this.uuids[iid].sqSk["13"][0] * beishu);
            }
            //血量每降低1%，造成伤害提高{0}
            beishu = Math.floor((this.teams[iid].eps.hp_max - this.teams[iid].eps.hp) * 100 / this.teams[iid].eps.hp_max);
            atk_per += this.uuids[iid].sqSk["14"][0] * beishu;
            //土行孙对生命值低于{0}的单位造成的伤害提高{1}
            for (const _xlskid of ["36", "37", "38"]) {
                if (this.teams[iid].eps.hp * 10000 / this.teams[iid].eps.hp_max < this.uuids[iid].xlSk[_xlskid][0]) {
                    atk_per += this.uuids[iid].xlSk[_xlskid][0];
                }
            }
            //伤害+{0}
            for (const _xlskid of ["330", "331", "332", "333", "334", "355", "356", "357", "358", "359"]) {
                atk_per += this.uuids[iid].xlSk[_xlskid][0];
            }
            //伤害+{2}
            for (const _xlskid of ["307", "308", "309", "310", "311", "460", "461", "462", "463", "464"]) {
                atk_per += this.uuids[iid].xlSk[_xlskid][2];
            }
            //对非地府系仙侣造成的伤害+{0}
            if (this.uuids[fiid].role != 3) {
                for (const _xlskid of ["172", "173", "174", "175", "176", "203", "204", "205", "206", "207"]) {
                    atk_per += this.uuids[iid].xlSk[_xlskid][0];
                }
            }
            //对地府系仙侣伤害加成+{0}，
            if (this.uuids[fiid].role == 3) {
                for (const _xlskid of ["415", "416", "417", "418", "419"]) {
                    atk_per += this.uuids[iid].xlSk[_xlskid][0];
                }
            }
            //受人神伤害减免
            if (this.uuids[iid].role == 1) {
                //伤害减免{1}
                for (const _xlskid of ["219", "220", "221", "222", "223"]) {
                    atk_per -= this.uuids[fiid].xlSk[_xlskid][0];
                }
            }
            //受地府系仙侣伤害减免+{1}
            if (this.uuids[iid].role == 3) {
                //伤害减免{1}
                for (const _xlskid of ["415", "416", "417", "418", "419"]) {
                    atk_per -= this.uuids[iid].xlSk[_xlskid][0];
                }
            }
            if (fiid == zfiid) {
                //是否击晕
                let jiyun_per = this.teams[iid].eps.jiyun + this.teams[iid].eps.qhteshu - this.teams[zfiid].eps.hsteshu;
                for (const _val of this.uuids[iid].pkSk) {
                    if (_val[0] == "wxxf_48") {
                        jiyun_per -= _val[2];
                    }
                    if (_val[0] == "jg_29") {
                        jiyun_per += _val[2];
                    }
                    if (_val[0] == "jg_21" && _val[3] == 2) {
                        jiyun_per = Math.max(0, jiyun_per + _val[2]);
                    }
                }
                if (this.uuids[iid].fzSk["153"]["default_per"] > 0) {
                    if (this.teams[fiid].eps.hp * 10000 / this.teams[fiid].eps.hp_max > this.uuids[iid].fzSk["153"]["default_per"]) {
                        jiyun_per += this.uuids[iid].fzSk["153"]["default_per1"];
                        log.atker.effect.push(["fazhen", 153]);
                        log.isUp = 1;
                    }
                }
                let fxuanyun_per = jiyun_per - this.teams[fiid].eps.hsjiyun - this.teams[fiid].eps.qhkangxing + this.teams[iid].eps.hskangxing;
                if (this.uuids[iid].xl_xuanyun > 0) { //如果是仙侣技能触发 直接概率
                    fxuanyun_per = this.uuids[iid].xl_xuanyun;
                }
                if (wxmf_type_1 == 0 && this.seedRand.rand(1, 10000) <= fxuanyun_per) {
                    this.uuids[fiid].pkSk.push(['jiyun', 1, 0, 0, 0]);
                    _target.effect.push(['jiyun', 1]);
                    _target.buff = this.getShowBuff(fiid);
                    _target.isUp = 1;
                    //禁锢触发时，可额外提高{0}伤害(百分比) 本次出手
                    atk_per += this.uuids[iid].sqSk["6"][0];
                    fz51 = 1;
                    //击晕敌人时，造成1次{0}攻击力的额外伤害。
                    if (this.uuids[iid].fzSk["103"]["default_per"] > 0) {
                        log.atker.effect.push(["fazhen", 103]);
                        log.isUp = 1;
                        let subHp = Math.floor(this.teams[iid].eps.e_atk * this.uuids[iid].fzSk["103"]["default_per"] / 10000);
                        if (subHp > 0) {
                            this.teams[fiid].eps.hp = Math.max(0, this.teams[fiid].eps.hp - subHp);
                            _target.effect.push(['hp', -1 * subHp]);
                            _target.hp = this.teams[fiid].eps.hp;
                        }
                    }
                    atk_per += this.teams[iid].eps.qhjiyun - this.teams[fiid].eps.rhjiyun;
                    //攻击时如果造成晕眩，给目标造成23.8%攻击力的伤害
                    if (this.teams[iid].jgSk["jg_3"] != null) {
                        log.atker.effect.push(["jg_3", 1]);
                        log.isUp = 1;
                        let subHp = Math.floor(this.teams[iid].eps.e_atk * this.teams[iid].jgSk["jg_3"][0] / 10000);
                        if (subHp > 0) {
                            this.teams[fiid].eps.hp = Math.max(0, this.teams[fiid].eps.hp - subHp);
                            _target.effect.push(['hp', -1 * subHp]);
                            _target.hp = this.teams[fiid].eps.hp;
                        }
                    }
                }
            }
            //对生命值低于{0}的敌人，伤害增加{1}。
            if (this.uuids[iid].fzSk["205"]["default_per"] > 0) {
                if (this.teams[fiid].eps.hp * 10000 / this.teams[fiid].eps.hp_max < this.uuids[iid].fzSk["205"]["default_per"]) {
                    atk_per += this.uuids[iid].fzSk["205"]["default_per1"];
                }
            }
            //土行孙对生命值低于{0}的单位造成的伤害提高{1}
            for (const _xlskid of ["43", "44", "45", "46"]) {
                if (this.teams[fiid].eps.hp * 10000 / this.teams[fiid].eps.hp_max < this.uuids[iid].xlSk[_xlskid][0]) {
                    atk_per += this.uuids[iid].xlSk[_xlskid][1];
                }
            }
            //对玩家伤害加成{0}，
            if (this.uuids[fiid].role == 998) {
                for (const _xlskid of ["86", "87", "88", "89", "90"]) {
                    atk_per += this.uuids[iid].xlSk[_xlskid][0];
                }
                for (const _xlskid of ["425", "426", "427", "428", "429"]) {
                    atk_per += this.uuids[iid].xlSk[_xlskid][1];
                }
            }
            let sub_def_per = 0; //伤害减免
            //大鹏明王的普通攻击引发龙卷风，对目标及其相邻的单位同时造成伤害，但伤害降低{0}  这个是打人的
            for (const _xlskid of ["260", "261", "262", "263", "264"]) {
                sub_def_per += this.uuids[iid].xlSk[_xlskid][0];
            }
            //伤害减免{0}
            for (const _xlskid of ["30", "31", "32", "182", "183", "184", "185", "186", "400", "401", "402", "403", "404"]) {
                sub_def_per += this.uuids[fiid].xlSk[_xlskid][0];
            }
            //伤害减免{1}
            for (const _xlskid of ["266", "267", "268", "269", "270", "292", "293", "294", "295", "296", "318", "319", "320", "321", "322", "450", "451", "452", "453", "454"]) {
                sub_def_per += this.uuids[fiid].xlSk[_xlskid][1];
            }
            //受怪物伤害减免
            if (this.uuids[iid].role == 999) {
                //伤害减免{0}
                for (const _xlskid of ["96", "97", "98", "99", "100", "430", "431", "432", "433", "434"]) {
                    sub_def_per += this.uuids[fiid].xlSk[_xlskid][0];
                }
                //伤害减免{1}
                for (const _xlskid of ["162", "163", "164", "165", "166", "214", "215", "216", "217", "218"]) {
                    sub_def_per += this.uuids[fiid].xlSk[_xlskid][1];
                }
            }
            //受玩家伤害减免
            if (this.uuids[iid].role == 998) {
                //伤害减免{0}
                for (const _xlskid of ["250", "251", "252", "253", "254"]) {
                    sub_def_per += this.uuids[fiid].xlSk[_xlskid][0];
                }
                //伤害减免{1}
                for (const _xlskid of ["152", "153", "154", "155", "156", "203", "204", "205", "206", "207", "355", "356", "357", "358", "359"]) {
                    sub_def_per += this.uuids[fiid].xlSk[_xlskid][1];
                }
            }
            //受人神伤害减免
            if (this.uuids[iid].role == 1) {
                //伤害减免{1}
                for (const _xlskid of ["219", "220", "221", "222", "223"]) {
                    sub_def_per += this.uuids[fiid].xlSk[_xlskid][1];
                }
            }
            //受人神伤害减免
            if (this.uuids[iid].role == 2) {
                //伤害减免{1}
                for (const _xlskid of ["255", "256", "257", "258", "259"]) {
                    sub_def_per += this.uuids[fiid].xlSk[_xlskid][0];
                }
            }
            //受人神伤害减免
            if (this.uuids[iid].role == 3) {
                //伤害减免{1}
                for (const _xlskid of ["281", "282", "283", "284", "285"]) {
                    sub_def_per += this.uuids[fiid].xlSk[_xlskid][0];
                }
            }
            //地涌夫人自己对伤害麻木，出战时伤害减免提高{0}，持续{1}回合，欺凌{2}
            for (const _xlskid of ["276", "277", "278", "279", "280"]) {
                if (this.huihe <= this.uuids[fiid].xlSk[_xlskid][1]) {
                    sub_def_per += this.uuids[fiid].xlSk[_xlskid][0];
                }
                if (this.teams[fiid].eps.hp * 100 / this.teams[fiid].eps.hp_max < 50) {
                    atk_per += this.uuids[fiid].xlSk[_xlskid][2];
                }
            }
            //龙吉公主的普通攻击有{0}概率对随机{1}个目标同时造成伤害，但伤害降低{2}
            for (const _xlskid of ["47", "48", "49", "50", "69", "70", "71", "72", "116", "117", "118", "119", "120", "126", "127", "128", "129", "130", "240", "241", "242", "243", "244"]) {
                if (this.uuids[iid].xlSk[_xlskid][3] > 0) {
                    sub_def_per += this.uuids[iid].xlSk[_xlskid][3];
                }
            }
            //生命值首次低于30%时，降低受到的伤害，持续到战斗结束。
            if (this.uuids[fiid].fzSk["204"]["count"] > 0) {
                sub_def_per += this.uuids[fiid].fzSk["204"]["default_per1"];
            }
            if (["11", "21"].indexOf(iid) != -1) {
                atk_per += this.teams[zhuid].eps.qhxianlv - this.teams[fzhuid].eps.rhxianlv;
            }
            if (wxmf_type_1 == 1) {
                atk_per += this.teams[iid].eps.qhmifa - this.teams[fiid].eps.rhmifa;
            }
            ptHit += Math.floor(ptHit * (atk_per - sub_def_per) / 10000);
            //聂小倩攻击时有{0}概率引发一场大潮，对所有敌对单位造成当前生命{1}的伤害，单次伤害不能超过仙侣攻击的{2}
            for (const _xlskid of ["286"]) {
                if (this.uuids[iid].xlSk[_xlskid][3] > 0) {
                    ptHit = Math.min(ptHit, this.uuids[iid].xlSk[_xlskid][3]);
                }
            }
            //多宝道人的普通攻击有{0}概率召唤漫天星辰，对所有敌对单位造成一次攻击力{1}的伤害
            for (const _xlskid of ["328"]) {
                if (this.uuids[iid].xlSk[_xlskid][2] > 0) {
                    ptHit = this.uuids[iid].xlSk[_xlskid][2];
                }
            }
            //作为堕落的神祗，东皇太一不会受到超过生命上限{0}之外的伤害
            for (const _xlskid of ["340", "341", "342", "343", "344"]) {
                if (this.uuids[fiid].xlSk[_xlskid][0] > 0) {
                    ptHit = Math.min(ptHit, Math.floor(this.teams[fiid].eps.hp_max * this.uuids[fiid].xlSk[_xlskid][0] / 10000));
                }
            }
            //回合杀
            ptHit += Math.ceil(this.teams[fiid].eps.hp_max * this.teams[iid].eps.roundsha / 10000);
            //增加吸血比例
            let addXixue = this.teams[iid].eps.xixue;
            for (const _val of this.uuids[iid].pkSk) {
                if (_val[0] == "wxxf_48" || _val[0] == "wxxf_75") {
                    addXixue -= _val[2];
                }
            }
            //【武道】开场3回合内，吸血属性提升20%
            if (this.teams[iid].wxSk["wxlm_1"] != null && this.huihe <= this.teams[iid].wxSk["wxlm_1"][0]) {
                addXixue += this.teams[iid].wxSk["wxlm_1"][1];
            }
            //战斗开始时，获得额外{0}恢复效果，持续到战斗结束。
            addXixue += this.uuids[iid].fzSk["53"]["default_per"];
            //生命低于对手时，吸血按当前值提高{0}
            if (this.teams[iid].eps.hp < this.teams[fiid].eps.hp) {
                addXixue += this.uuids[iid].sqSk["8"][0];
            }
            //每次攻击时，{0}概率额外恢复攻击力{1}的生命值。
            if (this.uuids[iid].fzSk["154"]["default_per1"] > 0) {
                if (this.seedRand.rand(1, 10000) < this.uuids[iid].fzSk["154"]["default_per"]) {
                    let add_per = this.uuids[iid].fzSk["154"]["default_per1"];
                    for (const _xlskid of ["395", "396", "397", "398", "399"]) {
                        add_per += this.uuids[fiid].xlSk[_xlskid][1];
                    }
                    let addHp = Math.floor(this.teams[iid].eps.atk * add_per / 10000);
                    addHp += Math.floor(addHp * (this.teams[iid].eps.qhzhiliao - this.teams[fiid].eps.rhzhiliao) / 10000);
                    //太白金星在场时，所有敌对单位的生命回复效果降低{0}
                    if (this.uuids[fXlid] != null && this.teams[fXlid].eps.hp > 0 && this.uuids[fXlid].camp != this.uuids[iid].camp) {
                        let yzhuifu = this.uuids[fXlid].xlSk["202"][0];
                        for (const _xlskid of ["435", "436", "437", "438", "439"]) {
                            yzhuifu += this.uuids[fXlid].xlSk[_xlskid][0];
                        }
                        addHp -= Math.floor(addHp * yzhuifu / 10000);
                    }
                    for (const val of this.uuids[iid].pkSk) {
                        if (val[0] == "wxxf_74" || val[0] == "wxxf_75") {
                            addHp += Math.floor(addHp * val[2] / 10000);
                        }
                        if (val[0] == "wxxf_33") {
                            addHp -= Math.floor(addHp * val[2] / 10000);
                        }
                    }
                    if (addHp > 0) {
                        this.uuids[iid].addHp += addHp;
                        log.atker.effect.push(['huifu', addHp]);
                        log.atker.effect.push(['fazhen', 154]);
                        this.teams[iid].eps.hp = Math.min(this.teams[iid].eps.hp + addHp, this.teams[iid].eps.hp_max);
                        log.atker.hp = this.teams[iid].eps.hp;
                        log.isUp = 1;
                    }
                }
            }
            let fhsxixue = this.teams[fiid].eps.hsxixue;
            if (["11", "21"].indexOf(iid) != -1) {
                fhsxixue = 0;
            }
            for (const val of this.uuids[fiid].pkSk) {
                if (val[0] == "wxxf_46") {
                    fhsxixue = Math.max(0, fhsxixue - val[2]);
                }
            }
            if (wxmf_type_2 == 1 && wxmf_type_2_id == "wxxf_64") {
                addXixue += this.teams[iid].wxSk["wxxf_64"][0];
            }
            addXixue += this.teams[iid].eps.qhzhiliao - this.teams[fiid].eps.rhzhiliao;
            //生命汲取
            if (addXixue > fhsxixue) {
                let addHp = Math.ceil(ptHit * (addXixue - fhsxixue) / 10000);
                //太白金星在场时，所有敌对单位的生命回复效果降低{0}
                if (this.uuids[fXlid] != null && this.teams[fXlid].eps.hp > 0 && this.uuids[fXlid].camp != this.uuids[iid].camp) {
                    let yzhuifu = this.uuids[fXlid].xlSk["202"][0];
                    for (const _xlskid of ["435", "436", "437", "438", "439"]) {
                        yzhuifu += this.uuids[fXlid].xlSk[_xlskid][0];
                    }
                    addHp -= Math.floor(addHp * yzhuifu / 10000);
                }
                for (const val of this.uuids[iid].pkSk) {
                    if (val[0] == "wxxf_74" || val[0] == "wxxf_75") {
                        addHp += Math.floor(addHp * val[2] / 10000);
                    }
                    if (val[0] == "wxxf_33") {
                        addHp -= Math.floor(addHp * val[2] / 10000);
                    }
                }
                if (addHp > 0) {
                    log.atker.effect.push(['xixue', addHp]);
                    log.isUp = 1;
                    this.teams[iid].eps.hp = Math.min(this.teams[iid].eps.hp + addHp, this.teams[iid].eps.hp_max);
                    log.atker.hp = this.teams[iid].eps.hp;
                    this.uuids[iid].addHp += addHp;
                }
            }
            //镇元子的普通攻击有{0}概率逆转日月，对所有敌对单位造成攻击力{1}的伤害
            for (const _xlskid of ["365", "366", "367", "368", "369"]) {
                if (this.seedRand.rand(1, 10000) <= this.uuids[iid].xlSk[_xlskid][0]) {
                    ptHit = Math.floor(this.teams[iid].eps.atk * this.uuids[iid].xlSk[_xlskid][1] / 10000);
                    ptHit = Math.max(1, ptHit); //最少扣1点血
                    let fiid1 = zfiid;
                    if (zfiid == "10") {
                        fiid1 = "11";
                    }
                    if (zfiid == "11") {
                        fiid1 = "10";
                    }
                    if (zfiid == "20") {
                        fiid1 = "21";
                    }
                    if (zfiid == "21") {
                        fiid1 = "20";
                    }
                    if (this.teams[fiid1] != null && this.teams[fiid1].eps.hp > 0) {
                        this.teams[fiid1].eps.hp = Math.max(0, this.teams[fiid1].eps.hp - ptHit);
                        if (this.teams[fiid1].eps.hp < 1) {
                            if (["xlf_43", "xl_43"].indexOf(this.teams[fiid1].fid) != -1) {
                                this.teams[fiid1].eps.hp = 1;
                                this.uuids[fiid1].xl_360 = 1;
                            }
                            else {
                                this.siles.push(fiid1);
                            }
                        }
                        log.isUp = 1;
                        log.target.push({
                            fid: this.teams[fiid1].fid,
                            iid: fiid1,
                            hp: this.teams[fiid1].eps.hp,
                            nuqi: this.uuids[fiid1].nuqi,
                            buff: this.getShowBuff(fiid1),
                            effect: [['hp', -1 * ptHit]],
                            status: 0,
                        });
                        this.uuids[iid].hurt += ptHit;
                    }
                }
            }
            //触发万象技能
            if (wxmf_type_1 == 1 && wxmf_type_1_id == "wxxf_28") {
                if (this.teams[fiid].eps.hp * 10000 / this.teams[fiid].eps.hp_max < this.teams[iid].wxSk["wxxf_28"][1]) {
                    ptHit = Math.floor(this.teams[iid].eps.atk * this.teams[iid].wxSk["wxxf_28"][2] / 10000);
                }
            }
            if (wxmf_type_1 == 1) {
                for (const val of this.uuids[fiid].pkSk) {
                    if (["wxxf_61"].indexOf(val[0]) != -1) { //并获得{1}最终减伤，持续到下回合结束
                        ptHit -= Math.floor(ptHit * this.teams[iid].wxSk[val[0]][2] / 10000);
                    }
                }
                if (wxmf_type_1_id == "wxxf_69") {
                    if (this.seedRand.rand(1, 10000) <= this.teams[iid].wxSk["wxxf_69"][1]) {
                        this.uuids[fiid].pkSk.push(['jiyun', this.teams[iid].wxSk["wxxf_69"][2], 0, 0, 0]);
                        _target.effect.push(['jiyun', this.teams[iid].wxSk["wxxf_69"][2]]);
                        _target.buff = this.getShowBuff(fiid);
                        _target.isUp = 1;
                    }
                }
                if (wxmf_type_2_id == "wxxf_47") {
                    ptHit += Math.floor(ptHit * this.teams[iid].wxSk["wxxf_47"][0] / 10000);
                    if (this.seedRand.rand(1, 10000) <= this.teams[iid].wxSk["wxxf_47"][1]) {
                        this.uuids[fiid].pkSk.push(["jiyun", this.teams[iid].wxSk["wxxf_47"][2], 0, 0, 0]);
                    }
                }
            }
            if (["11", "21"].indexOf(iid) != -1) {
                let add_ptHit = 0;
                for (const val of this.uuids[iid].pkSk) {
                    if (val[0] == "wxxf_52" || val[0] == "wxxf_6") {
                        add_ptHit += val[2];
                    }
                }
                ptHit += Math.floor(ptHit * add_ptHit / 10000);
            }
            if (wxmf_type_2 == 1 && fiid == zfiid) {
                if (wxmf_type_2_id == "wxxf_40" && isAtk == 2) {
                    let addHp = Math.floor(ptHit * this.teams[iid].wxSk["wxxf_40"][0] / 10000);
                    addHp += Math.floor(addHp * (this.teams[iid].eps.qhzhiliao - this.teams[fiid].eps.rhzhiliao) / 10000);
                    log.atker.effect.push(['huifu', addHp]);
                    log.isUp = 1;
                    this.teams[iid].eps.hp = Math.min(this.teams[iid].eps.hp + addHp, this.teams[iid].eps.hp_max);
                    log.atker.hp = this.teams[iid].eps.hp;
                    this.uuids[iid].addHp += addHp;
                    this.uuids[iid].nuqi += this.teams[iid].wxSk["wxxf_40"][1];
                }
                if (wxmf_type_2_id == "wxxf_29") {
                    this.uuids[zfiid].yishang = ["wxxf_29", this.teams[iid].wxSk["wxxf_29"][0]];
                }
                if (wxmf_type_2_id == "wxxf_59") {
                    if (this.seedRand.rand(1, 10000) <= this.teams[iid].wxSk["wxxf_59"][0]) {
                        ptHit = Math.floor(ptHit * this.teams[iid].wxSk["wxxf_59"][1]);
                    }
                    else if (this.seedRand.rand(1, 10000) <= this.teams[iid].wxSk["wxxf_59"][2]) {
                        ptHit = Math.floor(ptHit * this.teams[iid].wxSk["wxxf_59"][3]);
                    }
                }
                if (wxmf_type_2_id == "wxxf_64") {
                    let subHp = Math.floor(this.teams[iid].eps.hp * this.teams[iid].wxSk["wxxf_64"][1] / 10000);
                    log.atker.effect.push(['hp', -1 * subHp]);
                    log.isUp = 1;
                    this.teams[iid].eps.hp -= subHp;
                    log.atker.hp = this.teams[iid].eps.hp;
                    ptHit = Math.max(subHp, Math.floor(this.teams[iid].eps.atk * this.teams[iid].wxSk["wxxf_64"][2] / 10000));
                }
                if (wxmf_type_2_id == "wxxf_67" && isAtk == 1) {
                    this.uuids[iid].pkSk.push(["wxxf_67", this.teams[iid].wxSk["wxxf_67"][1] + 1, this.teams[iid].wxSk["wxxf_67"][0], 0, 0]);
                }
            }
            if (wxmf_type_3 == 1 && wxmf_type_3_id == "wxxf_62") {
                ptHit += Math.floor(ptHit * this.teams[zhuid].wxSk["wxxf_62"][0] / 10000);
                delete this.teams[zhuid].wxSk["wxxf_62"];
            }
            //反击时，造成额外{0}攻击力的伤害
            if (isAtk == 1 && this.teams[iid].wxSk["wxxf_20"] != null) {
                ptHit += Math.floor(ptHit * this.teams[iid].wxSk["wxxf_20"][0] / 10000);
            }
            for (const val of this.uuids[iid].pkSk) {
                let shup = 0;
                if (val[0] == "jg_5") {
                    shup += val[2];
                }
                ptHit += Math.floor(ptHit * shup / 10000);
            }
            //触发秒杀
            if (this.teams[iid].eps.miaosha > 0 && this.teams[iid].eps.miaosha <= this.huihe) {
                ptHit = this.teams[fiid].eps.hp;
                this.teams[fiid].eps.shengqi = 0;
            }
            else {
                //受到伤害，有{0}几率恢复所受伤害{1}的生命
                if (this.teams[fiid].wxSk["wxxf_14"] != null) {
                    if (this.seedRand.rand(1, 10000) <= this.teams[fiid].wxSk["wxxf_14"][0]) {
                        let addHp = Math.floor(ptHit * this.teams[fiid].wxSk["wxxf_14"][1] / 10000);
                        addHp += Math.floor(addHp * (this.teams[fiid].eps.qhzhiliao - this.teams[iid].eps.rhzhiliao) / 10000);
                        this.uuids[fiid].addHp += addHp;
                        _target.effect.push(["huifu", addHp]);
                        this.teams[fiid].eps.hp = Math.min(this.teams[fiid].eps.hp_max, this.teams[fiid].eps.hp + addHp);
                        _target.hp = this.teams[fiid].eps.hp;
                        _target.isUp = 1;
                    }
                }
                for (const val of this.uuids[fiid].pkSk) {
                    if (val[0] == "wxxf_57") {
                        ptHit = Math.min(ptHit, val[2]);
                    }
                }
                let addptHit = 0;
                //每次被攻击增加{0}仙侣强化，最高叠加{1}层，持续到下次仙侣行动
                if (["11", "21"].indexOf(iid) != -1) {
                    for (const val of this.uuids[iid].pkSk) {
                        if (val[0] == "wxxf_63" || val[0] == "jg_10") {
                            addptHit += Math.floor(val[2] * ptHit / 10000);
                        }
                        if (val[0] == "jg_7") {
                            addptHit -= Math.floor(val[2] * ptHit / 10000);
                        }
                    }
                    if (this.teams[zhuid].jgSk["jg_11"] != null) {
                        addptHit += Math.floor(ptHit * this.teams[zhuid].jgSk["jg_11"][0] / 10000);
                    }
                }
                //每回合额外增加5点怒气，并使自身阵图技能伤害增加5%
                if (wxmf_type_1 == 1) {
                    if (this.teams[iid].jgSk["jg_13"] != null) {
                        log.atker.effect.push(["jg_13", 1]);
                        this.uuids[iid].nuqi += this.teams[iid].jgSk["jg_13"][0];
                        log.isUp = 1;
                        log.atker.nuqi = this.uuids[iid].nuqi;
                        addptHit += Math.floor(ptHit * this.teams[iid].jgSk["jg_13"][1] / 10000);
                    }
                    for (const key in this.uuids[fiid].pkSk) {
                        for (const val of this.uuids[iid].pkSk) {
                            if (val[0] == "jg_14") {
                                addptHit += Math.floor(val[2] * ptHit / 10000);
                            }
                        }
                    }
                    if (this.teams[iid].jgSk["jg_16"] != null) {
                        log.atker.effect.push(["jg_16", 1]);
                        log.isUp = 1;
                        let jg_16_hit = Math.floor(this.teams[fiid].eps.hp_max * this.teams[iid].jgSk["jg_16"][0] / 10000);
                        jg_16_hit = Math.min(jg_16_hit, this.teams[iid].eps.atk * this.teams[iid].jgSk["jg_16"][1]);
                        this.teams[fiid].eps.hp -= jg_16_hit;
                        this.teams[fiid].eps.hp = Math.max(0, this.teams[fiid].eps.hp);
                        _target.effect.push(['hp', -1 * jg_16_hit]);
                        _target.hp = this.teams[fiid].eps.hp;
                        _target.isUp = 1;
                        this.uuids[iid].hurt += jg_16_hit;
                    }
                }
                if (wxmf_type_3_id == "wxxf_45") {
                    addptHit += Math.floor(ptHit * this.teams[zhuid].wxSk["wxxf_45"][0] / 10000);
                }
                //4回合后阵图技能伤害提高12%
                if (wxmf_type_1 == 1 && this.teams[iid].jgSk["jg_36"] != null && this.huihe > this.teams[iid].jgSk["jg_36"][0]) {
                    log.atker.effect.push(["jg_36", 1]);
                    addptHit += Math.floor(ptHit * this.teams[iid].jgSk["jg_36"][1] / 10000);
                }
                //如果攻击力高于对方，本次伤害提升13.6%
                if (this.teams[iid].jgSk["jg_17"] != null && this.teams[iid].eps.atk > this.teams[fiid].eps.atk) {
                    log.atker.effect.push(["jg_17", 1]);
                    addptHit += Math.floor(ptHit * this.teams[iid].jgSk["jg_17"][0] / 10000);
                }
                //如果目标生命值高于自己，本次伤害提升30.6%
                if (this.teams[iid].jgSk["jg_18"] != null && this.teams[fiid].eps.hp > this.teams[iid].eps.hp) {
                    log.atker.effect.push(["jg_18", 1]);
                    addptHit += Math.floor(ptHit * this.teams[iid].jgSk["jg_18"][0] / 10000);
                }
                for (const val of this.uuids[fiid].pkSk) {
                    if (val[0] == "jg_22") {
                        addptHit -= val[2];
                    }
                }
                if (isAtk == 1 && this.teams[iid].jgSk["jg_40"] != null) {
                    addptHit += Math.floor(ptHit * this.teams[iid].jgSk["jg_40"][0] / 10000);
                }
                if (isAtk == 2 && this.teams[iid].jgSk["jg_42"] != null) {
                    addptHit += Math.floor(ptHit * this.teams[iid].jgSk["jg_42"][0] / 10000);
                }
                ptHit += addptHit;
                //最终减伤
                let zzjs_per = 0;
                for (const val of this.uuids[fiid].pkSk) {
                    if (val[0] == "wxxf_25") {
                        zzjs_per += val[2];
                    }
                }
                ptHit -= Math.floor(ptHit * zzjs_per / 10000);
                //战斗中如果晕眩，额外造成15%伤害，持续到战斗结束
                if (this.teams[iid].jgSk["jg_43"] != null) {
                    let jiyun_43 = false;
                    for (const _val of this.uuids[fiid].pkSk) {
                        if (_val[0] == "jiyun") {
                            jiyun_43 = true;
                            break;
                        }
                    }
                    if (jiyun_43) {
                        let subHp = Math.floor(ptHit * this.teams[iid].jgSk["jg_43"][0] / 10000);
                        if (subHp > 0) {
                            this.teams[fiid].eps.hp = Math.max(0, this.teams[fiid].eps.hp - subHp);
                            _target.effect.push(['hp', -1 * subHp]);
                            _target.hp = this.teams[fiid].eps.hp;
                        }
                    }
                }
            }
            //对方扣血
            ptHit = Math.max(1, ptHit); //最少扣1点血
            //主角攻击时获得的灵力值最低，最高   我自己的回合 其他不算
            if (this.uuids[iid].nqc1 < 1 && wxmf_type_1 == 0) {
                this.uuids[iid].nqc1 += 1;
                let cfgMath1 = gameCfg_1.default.mathInfo.getItem("lingli_atk");
                if (cfgMath1 != null && cfgMath1.pram.count != null && cfgMath1.pram.count1 != null) {
                    this.uuids[iid].nuqi += this.seedRand.rand(cfgMath1.pram.count, cfgMath1.pram.count1);
                    log.atker.nuqi = this.uuids[iid].nuqi;
                }
            }
            // 主角受到伤害时获得的灵力值最低，最高  每个角色的回合最多加一次
            if (this.uuids[zfiid].nqc2 < 1) {
                this.uuids[zfiid].nqc2 += 1;
                let cfgMath2 = gameCfg_1.default.mathInfo.getItem("lingli_hit");
                if (cfgMath2 != null && cfgMath2.pram.count != null && cfgMath2.pram.count1 != null) {
                    this.uuids[zfiid].nuqi += this.seedRand.rand(cfgMath2.pram.count, cfgMath2.pram.count1);
                }
            }
            this.teams[fiid].eps.hp = Math.max(0, this.teams[fiid].eps.hp - ptHit);
            _target.effect.push(['hp', -1 * ptHit]);
            _target.hp = this.teams[fiid].eps.hp;
            _target.nuqi = this.uuids[fiid].nuqi;
            _target.isUp = 1;
            log.isUp = 1;
            if (["longgong", "dengshenbangfight", "dongtianpvp", "douluo", "jjc"].indexOf(this.from) != -1) {
                if (this.uuids[fiid].sqSk["12"][0] > 0 && this.uuids[iid].sq12 < 5) {
                    this.uuids[iid].sq12 += 1;
                    this.teams[iid].eps.atk -= Math.floor(this.teams[iid].eps.atk * this.uuids[fiid].sqSk["12"][0] / 10000);
                }
            }
            if (fiid == zfiid && this.teams[fiid].wxSk["wxxf_27"] != null && this.teams[fiid].wxSk["wxxf_27"][1] > 0) {
                this.teams[fiid].wxSk["wxxf_27"][1] -= 1;
                this.teams[fiid].eps.atk += Math.floor(this.teams[fiid].eps.atk * this.teams[fiid].wxSk["wxxf_27"][0] / 10000);
            }
            //对敌人造成晕眩或者攻击处于晕眩状态的敌人时，立即结算敌人的燃烧状态，且燃烧伤害增加
            if (fiid == zfiid && this.teams[fiid].wxSk["wxxf_76"] != null) {
                let isxy = 0;
                let all_sub = 0;
                let copyPkSk = [];
                for (const val of this.uuids[fiid].pkSk) {
                    if (val[0] == "jiyun") {
                        isxy = 1;
                        continue;
                    }
                    if (["xl_3", "xl_14", "xl_51", "xl_64", "xl_151", "xl_234", "xl_265", "xl_329"].indexOf(val[0]) != -1) {
                        let subhp = Math.floor(this.teams[iid].eps.hp * val[2] / 10000);
                        if (subhp > val[3]) {
                            subhp = val[3];
                        }
                        all_sub += subhp * val[1];
                        continue;
                    }
                    if (["wxxf_15", "wxxf_51", 'wxxf_8', 'wxxf_11', "wxxf_12"].indexOf(val[0]) != -1) {
                        all_sub += val[2] * val[1];
                        continue;
                    }
                    copyPkSk.push(val);
                }
                if (isxy == 1 && all_sub > 0) {
                    log.atker.effect.push(['hp', -1 * all_sub]);
                    log.isUp = 1;
                    this.teams[iid].eps.hp -= all_sub;
                    log.atker.hp = this.teams[iid].eps.hp;
                    if (this.teams[iid].eps.hp < 1 && this.siles.indexOf(iid) == -1) {
                        if (this.teams[iid].eps.shengqi == 5 || this.teams[iid].wxSk["wxxf_55"] != null) {
                            log.atker.status = 1;
                        }
                        for (const _xlskid of ["390", "391", "392", "393", "394"]) {
                            if (this.uuids[iid].xlSk[_xlskid][0] > 0) {
                                log.atker.status = 1;
                            }
                        }
                        this.isOver = true;
                        if (["xlf_43", "xl_43"].indexOf(this.teams[iid].fid) != -1) {
                            this.teams[iid].eps.hp = 1;
                            log.atker.hp = this.teams[iid].eps.hp;
                            this.uuids[iid].xl_360 = 1;
                        }
                        else {
                            this.siles.push(iid);
                        }
                    }
                    this.uuids[fiid].pkSk = copyPkSk;
                }
            }
            if (wxmf_type_2 == 1 && fiid == zfiid) {
                //对目标造成伤害时，降低目标{0}攻击，持续{1}回合
                if (wxmf_type_2_id == "wxxf_7") {
                    this.uuids[fiid].pkSk.push(["wxxf_7", this.teams[iid].wxSk["wxxf_7"][1], this.teams[iid].wxSk["wxxf_7"][0], 0, 0]);
                }
                //对目标造成伤害时，每回合额外造成{0}流血伤害，最高造成{1}攻击伤害，直至战斗结束
                if (wxmf_type_2_id == "wxxf_8") {
                    //最大伤害
                    let max_atk = Math.floor(allatk * this.teams[iid].wxSk["wxxf_8"][1] / 10000);
                    let jianshang = this.teams[zfiid].eps.jianshang;
                    for (const val of this.uuids[zfiid].pkSk) {
                        if (val[0] == "jg_2" || val[0] == "jg_9" || val[0] == "wxxf_68") {
                            jianshang -= val[2];
                        }
                        if (val[0] == "wxxf_39") {
                            jianshang += val[2];
                        }
                    }
                    jianshang = Math.max(0, jianshang);
                    let max_baseHit = (max_atk - this.teams[zfiid].eps.def) * (10000 + this.teams[iid].eps.zengshang - jianshang) / 10000;
                    let max_ptHit = Math.round(Math.max(max_baseHit, max_atk * 0.15) * this.seedRand.rand(97, 103) / 100);
                    let subHpwx = Math.min(max_ptHit, Math.floor(this.teams[zfiid].eps.hp_max * this.teams[iid].wxSk["wxxf_8"][0] / 10000));
                    this.uuids[fiid].pkSk.push(['wxxf_8', 30, subHpwx, 0, 0]);
                }
                //对目标造成伤害时，有{0}概率使目标燃烧，每回合额外造成{1}伤害，持续{2}回合
                if (wxmf_type_2_id == "wxxf_11") {
                    if (this.seedRand.rand(1, 10000) <= this.teams[iid].wxSk["wxxf_11"][0]) {
                        this.uuids[fiid].pkSk.push(['wxxf_11', this.teams[iid].wxSk["wxxf_11"][2], this.teams[iid].wxSk["wxxf_11"][1], 0, 0]);
                    }
                }
                //对目标造成伤害时，降低目标{0}防御，持续{1}回合
                if (wxmf_type_2_id == "wxxf_17") {
                    this.uuids[fiid].pkSk.push(['wxxf_17', this.teams[iid].wxSk["wxxf_17"][1], this.teams[iid].wxSk["wxxf_17"][0], 0, 0]);
                }
                //每次攻击时有{0}概率触发，增加自身攻击{1}，持续{2}回合
                if (wxmf_type_2_id == "wxxf_21") {
                    if (this.seedRand.rand(1, 10000) <= this.teams[iid].wxSk["wxxf_21"][0]) {
                        this.uuids[iid].pkSk.push(['wxxf_21', this.teams[iid].wxSk["wxxf_21"][2], this.teams[iid].wxSk["wxxf_21"][1], 0, 0]);
                    }
                }
            }
            //灵兽技能51 当玩家触发特殊攻击时，对敌人造成额外{0}攻击力伤害。 跳2次伤害
            if (fz51 == 1 && this.uuids[iid].fzSk["51"]["default_per"] > 0 && this.teams[fiid].eps.hp > 0) {
                log.atker.effect.push(["fazhen", 51]);
                log.isUp = 1;
                let subHp = Math.floor(this.teams[iid].eps.atk * this.uuids[iid].fzSk["51"]["default_per"] / 10000);
                if (subHp > 0) {
                    _target.effect.push(['hp', -1 * subHp]);
                    //对方扣血
                    this.teams[fiid].eps.hp = Math.max(0, this.teams[fiid].eps.hp - subHp);
                    _target.hp = this.teams[fiid].eps.hp;
                    this.uuids[iid].hurt += subHp;
                }
            }
            //灵兽技能51 当玩家触发特殊攻击时，对敌人造成额外{0}攻击力伤害。 跳2次伤害
            if (wxmf_type_3 == 1 && wxmf_type_3_id == "wxxf_19") {
                log.isUp = 1;
                let subHp = Math.floor(this.teams[iid].eps.atk * this.teams[zhuid].wxSk["wxxf_19"][0] / 10000);
                if (subHp > 0) {
                    _target.effect.push(['hp', -1 * subHp]);
                    //对方扣血
                    this.teams[fiid].eps.hp = Math.max(0, this.teams[fiid].eps.hp - subHp);
                    _target.hp = this.teams[fiid].eps.hp;
                    this.uuids[iid].hurt += subHp;
                }
            }
            //孔雀明王佛法开悟，攻击时有{0}概率对目标额外造成其当前生命{1}的伤害，该伤害不能超过仙侣攻击的{2}
            for (const _xlskid of ["312", "455", "456", "457", "458", "459"]) {
                if (this.seedRand.rand(1, 10000) < this.uuids[iid].xlSk[_xlskid][0] && this.teams[fiid].eps.hp > 0) {
                    let subHp1 = Math.floor(Math.min(this.teams[fiid].eps.hp * this.uuids[iid].xlSk[_xlskid][1] / 10000, this.teams[fiid].eps.atk * this.uuids[iid].xlSk[_xlskid][2] / 10000));
                    if (subHp1 > 0) {
                        log.isUp = 1;
                        _target.effect.push(['hp', -1 * subHp1]);
                        //对方扣血
                        this.teams[fiid].eps.hp = Math.max(0, this.teams[fiid].eps.hp - subHp1);
                        _target.hp = this.teams[fiid].eps.hp;
                        this.uuids[iid].hurt += subHp1;
                    }
                }
            }
            //生命值首次低于{0}时，降低{1}受到的伤害，持续到战斗结束。
            if (this.uuids[fiid].fzSk["204"]["default_per"] > 0 && this.uuids[fiid].fzSk["204"]["count"] <= 0) {
                if (this.teams[fiid].eps.hp * 10000 / this.teams[fiid].eps.hp_max < this.uuids[fiid].fzSk["204"]["default_per"]) {
                    this.uuids[fiid].fzSk["204"]["count"] += 1;
                    _target.effect.push(["fazhen", 204]);
                }
            }
            //血量首次低于{0}时触发，使你的吸血提高{1}，持续到战斗结束
            if (this.teams[fiid].wxSk["wxxf_41"] != null) {
                if (this.teams[fiid].eps.hp * 10000 / this.teams[fiid].eps.hp_max < this.teams[fiid].wxSk["wxxf_41"][0]) {
                    this.teams[fiid].eps.xixue += this.teams[fiid].wxSk["wxxf_41"][1];
                    delete this.teams[fiid].wxSk["wxxf_41"];
                }
            }
            //生命值首次低于60%是，阵图技能伤害提升30.6%
            if (this.teams[fiid].jgSk["jg_14"] != null) {
                if (this.teams[fiid].eps.hp * 10000 / this.teams[fiid].eps.hp_max < this.teams[fiid].jgSk["jg_14"][0]) {
                    this.uuids[fiid].pkSk.push(["jg_14", 30, this.teams[fiid].jgSk["jg_14"][1], 0, 0]);
                }
            }
            //血量低于{0}时，攻击力提升{1}
            if (this.teams[fiid].wxSk["wxxf_73"] != null) {
                if (this.teams[fiid].eps.hp * 10000 / this.teams[fiid].eps.hp_max < this.teams[fiid].wxSk["wxxf_73"][0]) {
                    this.teams[fiid].eps.atk += Math.floor(this.teams[fiid].eps.atk * this.teams[fiid].wxSk["wxxf_73"][1] / 10000);
                    delete this.teams[fiid].wxSk["wxxf_73"];
                }
            }
            //当生命值低于{0}，每次受到的伤害不会高于自身最大生命值的{1}，持续{2}回合
            if (this.teams[fiid].wxSk["wxxf_57"] != null) {
                if (this.teams[fiid].eps.hp * 10000 / this.teams[fiid].eps.hp_max < this.teams[fiid].wxSk["wxxf_57"][0]) {
                    let max_hit = Math.floor(this.teams[fiid].eps.hp_max * this.teams[fiid].wxSk["wxxf_57"][1] / 10000);
                    this.uuids[fiid].pkSk.push(["wxxf_57", this.teams[fiid].wxSk["wxxf_57"][2], max_hit, 0, 0]);
                    delete this.teams[fiid].wxSk["wxxf_57"];
                }
            }
            this.uuids[iid].hurt += ptHit;
            if (zfiid == fiid) {
                zptHit = ptHit;
            }
            //每次被击后增加{0}闪避，最多叠加{1}次，持续到战斗结束。
            if (this.uuids[fiid].fzSk["151"]["default"] > this.uuids[fiid].fzSk["151"]["count"]) {
                this.uuids[fiid].fzSk["151"]["count"] += 1;
                this.teams[fiid].eps.shanbi += this.uuids[fiid].fzSk["151"]["default_per"];
                _target.effect.push(['fazhen', 151]);
                _target.isUp = 1;
            }
            //每次被击时，增加{0}连击，最多叠加{1}次，持续到战斗结束。
            if (this.uuids[fiid].fzSk["155"]["default"] > this.uuids[fiid].fzSk["155"]["count"]) {
                this.uuids[fiid].fzSk["155"]["count"] += 1;
                this.teams[fiid].eps.lianji += this.uuids[fiid].fzSk["155"]["default_per"];
                _target.effect.push(['fazhen', 155]);
                _target.isUp = 1;
            }
            //主 被打触发
            if (fiid == zfiid) {
                //清除 免疫燃烧和冰冻{1}回合
                let ismy = 0;
                for (const val of this.uuids[fiid].pkSk) {
                    if (val[0] == "wxxf_9") {
                        ismy = 1;
                    }
                }
                //仙侣技能 土地攻击时有{0}概率点燃对手，使其{1}回合内每回合损失当前生命的{2}，该伤害不能超过仙侣攻击的{3}
                for (const _xlskid of ["3", "14", "51", "64"]) {
                    if (ismy == 0 && this.seedRand.rand(1, 10000) <= this.uuids[iid].xlSk[_xlskid][0]) {
                        let maxLxHp = Math.floor(this.teams[iid].eps.atk * this.uuids[iid].xlSk[_xlskid][3] / 10000);
                        let isHas = false;
                        let pkSkCopy = gameMethod_1.gameMethod.objCopy(this.uuids[zfiid].pkSk);
                        this.uuids[zfiid].pkSk = [];
                        for (const pval of pkSkCopy) {
                            if (pval[0] == "xl_" + _xlskid) {
                                this.uuids[zfiid].pkSk.push(["xl_" + _xlskid, this.uuids[iid].xlSk[_xlskid][1], this.uuids[iid].xlSk[_xlskid][2], maxLxHp, 0]);
                                isHas = true;
                            }
                            else {
                                this.uuids[zfiid].pkSk.push(pval);
                            }
                        }
                        if (isHas == false) {
                            this.uuids[zfiid].pkSk.push(["xl_" + _xlskid, this.uuids[iid].xlSk[_xlskid][1], this.uuids[iid].xlSk[_xlskid][2], maxLxHp, 0]);
                        }
                        _target.buff = this.getShowBuff(zfiid);
                        _target.isUp = 1;
                    }
                }
                //仙侣释放技能后，有{0}概率施加一次燃烧技能，每回合额外造成{1}伤害，持续{2}回合
                if (ismy == 0 && wxmf_type_3_id == "wxxf_12") {
                    if (this.seedRand.rand(1, 10000) <= this.teams[zhuid].wxSk["wxxf_12"][0]) {
                        let maxLxHp = Math.floor(this.teams[iid].eps.atk * this.teams[zhuid].wxSk["wxxf_12"][1] / 10000);
                        let isHas = false;
                        let pkSkCopy = gameMethod_1.gameMethod.objCopy(this.uuids[zfiid].pkSk);
                        this.uuids[zfiid].pkSk = [];
                        for (const pval of pkSkCopy) {
                            if (pval[0] == "wxxf_12") {
                                this.uuids[zfiid].pkSk.push(["wxxf_12", this.teams[zhuid].wxSk["wxxf_12"][2], maxLxHp, 0, 0]);
                                isHas = true;
                            }
                            else {
                                this.uuids[zfiid].pkSk.push(pval);
                            }
                        }
                        if (isHas == false) {
                            this.uuids[zfiid].pkSk.push(["wxxf_12", this.teams[zhuid].wxSk["wxxf_12"][2], maxLxHp, 0, 0]);
                        }
                        _target.buff = this.getShowBuff(zfiid);
                        _target.isUp = 1;
                    }
                }
                //多宝道人的攻击有{0}概率使对方中毒，每回合损失当前生命的{1}，持续{2}回合，单次伤害不能超过仙侣攻击的{3}
                for (const _xlskid of ["151", "234", "265", "329"]) {
                    if (this.seedRand.rand(1, 10000) <= this.uuids[iid].xlSk[_xlskid][0]) {
                        let maxLxHp = Math.floor(this.teams[iid].eps.atk * this.uuids[iid].xlSk[_xlskid][3] / 10000);
                        let isHas = false;
                        let pkSkCopy = gameMethod_1.gameMethod.objCopy(this.uuids[zfiid].pkSk);
                        this.uuids[zfiid].pkSk = [];
                        for (const pval of pkSkCopy) {
                            if (pval[0] == "xl_" + _xlskid) {
                                this.uuids[zfiid].pkSk.push(["xl_" + _xlskid, this.uuids[iid].xlSk[_xlskid][2], this.uuids[iid].xlSk[_xlskid][1], maxLxHp, 0]);
                                isHas = true;
                            }
                            else {
                                this.uuids[zfiid].pkSk.push(pval);
                            }
                        }
                        if (isHas == false) {
                            this.uuids[zfiid].pkSk.push(["xl_" + _xlskid, this.uuids[iid].xlSk[_xlskid][2], this.uuids[iid].xlSk[_xlskid][1], maxLxHp, 0]);
                        }
                        _target.buff = this.getShowBuff(zfiid);
                        _target.isUp = 1;
                    }
                }
                //地藏菩萨受到攻击时，有{0}概率提高自身{1}防御，持续{2}回合，重复施加时重新计时
                for (const _xlskid of ["375", "376", "377", "378", "379"]) {
                    if (this.seedRand.rand(1, 10000) <= this.uuids[zfiid].xlSk[_xlskid][0]) {
                        let isHas = false;
                        let pkSkCopy = gameMethod_1.gameMethod.objCopy(this.uuids[zfiid].pkSk);
                        this.uuids[zfiid].pkSk = [];
                        for (const pval of pkSkCopy) {
                            if (pval[0] == "xl_" + _xlskid) {
                                this.uuids[zfiid].pkSk.push(["xl_" + _xlskid, this.uuids[zfiid].xlSk[_xlskid][2], this.uuids[zfiid].xlSk[_xlskid][1], 0, 0]);
                                isHas = true;
                            }
                            else {
                                this.uuids[zfiid].pkSk.push(pval);
                            }
                        }
                        if (isHas == false) {
                            this.uuids[zfiid].pkSk.push(["xl_" + _xlskid, this.uuids[zfiid].xlSk[_xlskid][2], this.uuids[zfiid].xlSk[_xlskid][1], 0, 0]);
                        }
                        _target.buff = this.getShowBuff(zfiid);
                        _target.isUp = 1;
                    }
                }
                if (this.teams[fiid].eps.hp < 1 && this.siles.indexOf(fiid) == -1) {
                    if (this.teams[fiid].eps.shengqi == 5 || this.teams[fiid].wxSk["wxxf_55"] != null) {
                        _target.status = 1;
                    }
                    for (const _xlskid of ["390", "391", "392", "393", "394"]) {
                        if (this.uuids[fiid].xlSk[_xlskid][0] > 0) {
                            _target.status = 1;
                        }
                    }
                    if (["xlf_43", "xl_43"].indexOf(this.teams[fiid].fid) != -1) {
                        this.teams[fiid].eps.hp = 1;
                        _target.hp = this.teams[fiid].eps.hp;
                        this.uuids[fiid].xl_360 = 1;
                    }
                    else {
                        this.siles.push(fiid);
                    }
                }
            }
            //任何对牛魔王普通攻击的敌人都会被他的愤怒震慑，反弹伤害{0}
            for (const _xlskid of ["245", "246", "247", "248", "249", "450", "451", "452", "453", "454"]) {
                if (this.uuids[fiid].xlSk[_xlskid][0] > 0) {
                    log.isUp = 1;
                    let subHp = Math.floor(ptHit * this.uuids[fiid].xlSk[_xlskid][0] / 10000);
                    if (subHp > 0) {
                        //我方扣血
                        this.teams[iid].eps.hp = Math.max(0, this.teams[iid].eps.hp - subHp);
                        log.atker.hp = this.teams[iid].eps.hp;
                        log.atker.effect.push(['hp', -1 * subHp]);
                        this.uuids[fiid].hurt += ptHit;
                    }
                    if (this.teams[iid].eps.hp < 1 && this.siles.indexOf(iid) == -1) {
                        if (this.teams[iid].eps.shengqi == 5 || this.teams[iid].wxSk["wxxf_55"] != null) {
                            log.atker.status = 1;
                        }
                        for (const _xlskid of ["390", "391", "392", "393", "394"]) {
                            if (this.uuids[iid].xlSk[_xlskid][0] > 0) {
                                log.atker.status = 1;
                            }
                        }
                        this.isOver = true;
                        if (["xlf_43", "xl_43"].indexOf(this.teams[iid].fid) != -1) {
                            this.teams[iid].eps.hp = 1;
                            log.atker.hp = this.teams[iid].eps.hp;
                            this.uuids[iid].xl_360 = 1;
                        }
                        else {
                            this.siles.push(iid);
                        }
                        this.addLog(log);
                        return;
                    }
                }
            }
            for (const val of this.uuids[fiid].pkSk) {
                if (val[0] == "jg_38") {
                    log.isUp = 1;
                    let subHp = Math.floor(ptHit * val[2] / 10000);
                    if (subHp > 0) {
                        //我方扣血
                        this.teams[iid].eps.hp = Math.max(0, this.teams[iid].eps.hp - subHp);
                        log.atker.hp = this.teams[iid].eps.hp;
                        log.atker.effect.push(['hp', -1 * subHp]);
                        this.uuids[fiid].hurt += ptHit;
                    }
                    if (this.teams[iid].eps.hp < 1 && this.siles.indexOf(iid) == -1) {
                        if (this.teams[iid].eps.shengqi == 5 || this.teams[iid].wxSk["wxxf_55"] != null) {
                            log.atker.status = 1;
                        }
                        for (const _xlskid of ["390", "391", "392", "393", "394"]) {
                            if (this.uuids[iid].xlSk[_xlskid][0] > 0) {
                                log.atker.status = 1;
                            }
                        }
                        this.isOver = true;
                        if (["xlf_43", "xl_43"].indexOf(this.teams[iid].fid) != -1) {
                            this.teams[iid].eps.hp = 1;
                            log.atker.hp = this.teams[iid].eps.hp;
                            this.uuids[iid].xl_360 = 1;
                        }
                        else {
                            this.siles.push(iid);
                        }
                        this.addLog(log);
                        return;
                    }
                }
            }
            if (this.teams[fiid].wxSk["wxxf_37"] != null) {
                log.isUp = 1;
                let subHp = Math.floor(ptHit * this.teams[fiid].wxSk["wxxf_37"][0] / 10000);
                if (subHp > 0) {
                    //我方扣血
                    this.teams[iid].eps.hp = Math.max(0, this.teams[iid].eps.hp - subHp);
                    log.atker.hp = this.teams[iid].eps.hp;
                    log.atker.effect.push(['hp', -1 * subHp]);
                    this.uuids[fiid].hurt += ptHit;
                }
                if (this.teams[iid].eps.hp < 1 && this.siles.indexOf(iid) == -1) {
                    if (this.teams[iid].eps.shengqi == 5 || this.teams[iid].wxSk["wxxf_55"] != null) {
                        log.atker.status = 1;
                    }
                    for (const _xlskid of ["390", "391", "392", "393", "394"]) {
                        if (this.uuids[iid].xlSk[_xlskid][0] > 0) {
                            log.atker.status = 1;
                        }
                    }
                    this.isOver = true;
                    if (["xlf_43", "xl_43"].indexOf(this.teams[iid].fid) != -1) {
                        this.teams[iid].eps.hp = 1;
                        log.atker.hp = this.teams[iid].eps.hp;
                        this.uuids[iid].xl_360 = 1;
                    }
                    else {
                        this.siles.push(iid);
                    }
                    this.addLog(log);
                    return;
                }
            }
            if (_target.isUp == 1) {
                if (this.teams[_target.iid].eps.hp < 1 && ["xlf_43", "xl_43"].indexOf(this.teams[_target.iid].fid) != -1) {
                    this.teams[_target.iid].eps.hp = 1;
                    _target.hp = this.teams[_target.iid].eps.hp;
                    this.uuids[_target.iid].xl_360 = 1;
                }
                log.target.push(_target);
                log.isUp = 1;
            }
        } //这边是循环攻击结束
        //银角大王催动法宝幌金绳，攻击时有{0}概率对后排{1}名敌对单位造成等额伤害，攻击{2}
        for (const _xlskid of ["136", "137", "138", "139", "140"]) {
            if (this.seedRand.rand(1, 10000) <= this.uuids[iid].xlSk[_xlskid][0]) {
                let fiid1 = zfiid;
                if (zfiid == "10") {
                    fiid1 = "11";
                }
                if (zfiid == "11") {
                    fiid1 = "10";
                }
                if (zfiid == "20") {
                    fiid1 = "21";
                }
                if (zfiid == "21") {
                    fiid1 = "20";
                }
                if (this.teams[fiid1] != null && zptHit > 0 && this.teams[fiid1].eps.hp > 0) {
                    this.teams[fiid1].eps.hp = Math.max(0, this.teams[fiid1].eps.hp - zptHit);
                    let _status = 0;
                    let _isreturn = false;
                    if (this.teams[fiid1].eps.hp < 1 && this.siles.indexOf(fiid1) == -1) {
                        if (this.teams[fiid1].eps.shengqi == 5 || this.teams[fiid1].wxSk["wxxf_55"] != null) {
                            _status = 1;
                        }
                        for (const _xlskid of ["390", "391", "392", "393", "394"]) {
                            if (this.uuids[fiid1].xlSk[_xlskid][0] > 0) {
                                _status = 1;
                            }
                        }
                        this.isOver = true;
                        if (["xlf_43", "xl_43"].indexOf(this.teams[fiid1].fid) != -1) {
                            this.teams[fiid1].eps.hp = 1;
                            this.uuids[fiid1].xl_360 = 1;
                        }
                        else {
                            this.siles.push(fiid1);
                        }
                        _isreturn = true;
                    }
                    log.isUp = 1;
                    log.target.push({
                        fid: this.teams[fiid1].fid,
                        iid: fiid1,
                        hp: this.teams[fiid1].eps.hp,
                        nuqi: this.uuids[fiid1].nuqi,
                        buff: this.getShowBuff(fiid1),
                        effect: [['hp', -1 * zptHit]],
                        status: _status,
                    });
                    this.uuids[iid].hurt += zptHit;
                    if (_isreturn) {
                        this.addLog(log);
                        return;
                    }
                }
            }
        }
        //昊天上帝在攻击时有{0}的概率回复场上所有友方单位生命上限的{1}生命值，但不包括自己，该治疗不能超过仙侣攻击的{2}
        for (const _xlskid of ["405", "406", "407", "408", "409"]) {
            if (this.seedRand.rand(1, 10000) <= this.uuids[iid].xlSk[_xlskid][0]) {
                let oiid = "10";
                if (iid == "10") {
                    oiid = "11";
                }
                if (iid == "11") {
                    oiid = "10";
                }
                if (iid == "20") {
                    oiid = "21";
                }
                if (iid == "21") {
                    oiid = "20";
                }
                if (this.teams[oiid] != null && this.teams[oiid].eps.hp > 0) {
                    let addxlHp = Math.floor(this.teams[oiid].eps.hp_max * this.uuids[iid].xlSk[_xlskid][1] / 10000);
                    let addXlMaxHp = Math.floor(this.teams[iid].eps.atk * this.uuids[iid].xlSk[_xlskid][2] / 10000);
                    //战斗开始时，获得额外{0}恢复效果，持续到战斗结束。
                    let add_per = this.uuids[oiid].fzSk["53"]["default_per"];
                    for (const _xlskid of ["395", "396", "397", "398", "399"]) {
                        add_per += this.uuids[oiid].xlSk[_xlskid][1];
                    }
                    addXlMaxHp += Math.floor(addXlMaxHp * add_per / 10000);
                    addxlHp = Math.min(addXlMaxHp, addxlHp);
                    //太白金星在场时，所有敌对单位的生命回复效果降低{0}
                    if (this.uuids[fXlid] != null && this.teams[fXlid].eps.hp > 0 && this.uuids[fXlid].camp != this.uuids[oiid].camp) {
                        let yzhuifu = this.uuids[fXlid].xlSk["202"][0];
                        for (const _xlskid of ["435", "436", "437", "438", "439"]) {
                            yzhuifu += this.uuids[fXlid].xlSk[_xlskid][0];
                        }
                        addxlHp -= Math.floor(addxlHp * yzhuifu / 10000);
                    }
                    this.teams[oiid].eps.hp = Math.min(this.teams[oiid].eps.hp + addxlHp, this.teams[oiid].eps.hp_max);
                    log.isUp = 1;
                    log.target.push({
                        fid: this.teams[oiid].fid,
                        iid: oiid,
                        hp: this.teams[oiid].eps.hp,
                        nuqi: this.uuids[oiid].nuqi,
                        buff: this.getShowBuff(oiid),
                        effect: [['huifu', addxlHp]],
                        status: 0,
                    });
                    this.uuids[iid].addHp += addxlHp;
                }
            }
        }
        //托塔天王每次攻击都有{0}概率降低目标全忽视属性{1}，可叠加
        for (const _xlskid of ["229", "230", "231", "232", "233"]) {
            if (this.seedRand.rand(1, 10000) <= this.uuids[iid].xlSk[_xlskid][0]) {
                this.teams[zfiid].eps.hsjiyun = Math.max(0, this.teams[zfiid].eps.hsjiyun - this.uuids[iid].xlSk[_xlskid][1]);
                this.teams[zfiid].eps.hsshanbi = Math.max(0, this.teams[zfiid].eps.hsshanbi - this.uuids[iid].xlSk[_xlskid][1]);
                this.teams[zfiid].eps.hslianji = Math.max(0, this.teams[zfiid].eps.hslianji - this.uuids[iid].xlSk[_xlskid][1]);
                this.teams[zfiid].eps.hsfanji = Math.max(0, this.teams[zfiid].eps.hsfanji - this.uuids[iid].xlSk[_xlskid][1]);
                this.teams[zfiid].eps.hsbaoji = Math.max(0, this.teams[zfiid].eps.hsbaoji - this.uuids[iid].xlSk[_xlskid][1]);
            }
        }
        //是否连击
        if (isAtk != 1) {
            let lianji_per = this.teams[iid].eps.lianji + this.teams[iid].eps.qhteshu - this.teams[zfiid].eps.hsteshu;
            //自身生命值大于{0}时，获得{1}连击。
            if (this.uuids[iid].fzSk["156"]["default_per"] > 0) {
                if (this.teams[iid].eps.hp * 10000 / this.teams[iid].eps.hp_max > this.uuids[iid].fzSk["156"]["default_per"]) {
                    lianji_per += this.uuids[iid].fzSk["156"]["default_per1"];
                    log.atker.effect.push(['fazhen', 156]);
                    log.isUp = 1;
                }
            }
            //【神识】第1回合连击几率提升20%
            if (this.teams[iid].wxSk["wxlm_3"] != null && this.huihe <= this.teams[iid].wxSk["wxlm_3"][0]) {
                lianji_per += this.teams[iid].wxSk["wxlm_3"][1];
            }
            let fhslianji_per = this.teams[zfiid].eps.hslianji + this.teams[zfiid].eps.qhkangxing - this.teams[iid].eps.hskangxing;
            for (const val of this.uuids[zfiid].pkSk) {
                if (val[0] == "wxxf_35") {
                    fhslianji_per += val[2];
                }
                if (val[0] == "jg_27") {
                    fhslianji_per -= val[2];
                }
                if (["jg_28"].indexOf(val[0]) != -1) {
                    fhslianji_per -= val[4];
                }
            }
            if (this.uuids[iid].xl_lianji > 0) { //如果是仙侣技能触发 直接概率
                lianji_per = this.uuids[iid].xl_lianji;
                fhslianji_per = 0;
            }
            fhslianji_per = Math.max(0, fhslianji_per);
            //超过1次 每次 X 0.65
            for (let index = 1; index <= this.uuids[iid].lianji_count; index++) {
                lianji_per = Math.ceil(lianji_per * 0.65);
            }
            for (const val of this.uuids[iid].pkSk) {
                if (val[0] == "wxxf_18") {
                    lianji_per += val[2];
                }
                if (val[0] == "wxxf_48") {
                    lianji_per -= val[2];
                }
                if (val[0] == "jg_21" && val[3] == 4) {
                    lianji_per += val[2];
                }
            }
            if (wxmf_type_1 == 0 && this.seedRand.rand(1, 10000) <= lianji_per - fhslianji_per) {
                //战斗开始时，攻击力增加{0}。每次触发连击时，偷取目标{1}的攻击力，持续{2}回合。
                if (this.uuids[iid].fzSk["203"]["default_per1"] > 0 && this.uuids[iid].lianji_count == 0) {
                    log.atker.effect.push(['fazhen', 203]);
                    log.isUp = 1;
                    this.uuids[iid].pkSk.push(["fz_203", this.uuids[iid].fzSk["203"]["default"] + 1, parseInt(zfiid), 0, 0]);
                }
                this.uuids[iid].lianji_count += 1;
            }
            else {
                this.uuids[iid].lianji_count = 0;
            }
        }
        //如果触发晕眩，则不判断敌人是否触发反击
        //如果没有触发晕眩，则判断敌人是否触发反击
        //敌人的触发反击率=max((敌方反击-我方抗反击),0)
        let zjiyun = false; //主对手是否眩晕
        for (const _val of this.uuids[zfiid].pkSk) {
            if (_val[0] == "jiyun") {
                zjiyun = true;
                break;
            }
        }
        for (const _val of this.uuids[zfiid].pkSk) {
            if (_val[0] == "wxxf_32" || _val[0] == "wxxf_31") {
                zjiyun = true; //对方冰冻
                break;
            }
        }
        let isfanji = false; //对方是否反击
        if (zjiyun == false) { //反击所造成的伤害额外提高{0}，并移除被禁锢无法反击的限制
            let t2fj_per = this.teams[zfiid].eps.fanji;
            //自身闪避时，本回合反击率提升{0}。
            if (this.uuids[zfiid].fzSk["104"]["round"] > 0) {
                t2fj_per += this.uuids[zfiid].fzSk["104"]["default_per"];
            }
            let fhsfanji = this.teams[iid].eps.hsfanji + this.teams[iid].eps.qhkangxing - this.teams[zfiid].eps.hskangxing;
            if (this.uuids[zfiid].xl_fanji > 0) { //如果是仙侣技能触发 直接概率
                t2fj_per = this.uuids[zfiid].xl_fanji;
                fhsfanji = 0;
            }
            for (const val of this.uuids[iid].pkSk) {
                if (val[0] == "wxxf_48") {
                    t2fj_per -= val[2];
                }
                if (val[0] == "jg_28") {
                    t2fj_per += val[2];
                }
                if (val[0] == "jg_21" && val[3] == 3) {
                    t2fj_per += val[2];
                }
            }
            t2fj_per += this.teams[zfiid].eps.qhteshu - this.teams[iid].eps.hsteshu;
            if (this.seedRand.rand(1, 10000) <= t2fj_per - fhsfanji) {
                isfanji = true;
            }
        }
        //每次攻击后增加{0}暴击，最多叠加{1}次，持续到战斗结束。   连击和 反击 都要算
        if (this.uuids[iid].fzSk["106"]["count"] < this.uuids[iid].fzSk["106"]["default"]) {
            this.uuids[iid].fzSk["106"]["count"] += 1;
            log.atker.effect.push(['fazhen', 106]);
            log.isUp = 1;
            this.teams[iid].eps.baoji += this.uuids[iid].fzSk["106"]["default_per"];
        }
        //东皇太一在攻击时有{0}概率使目标的攻击力降低{2}，持续{1}回合
        for (const _xlskid of ["335", "336", "337", "338", "339"]) {
            if (this.seedRand.rand(1, 10000) <= this.uuids[iid].xlSk[_xlskid][0]) {
                this.uuids[zfiid].pkSk.push(["xl_" + _xlskid, this.uuids[iid].xlSk[_xlskid][2], this.uuids[iid].xlSk[_xlskid][1], 0, 0]);
            }
        }
        //蚩尤受到伤害减免{0}，攻击时有{1}概率使对方防御降低{2}，持续{3}回合
        for (const _xlskid of ["400", "401", "402", "403", "404"]) {
            if (this.seedRand.rand(1, 10000) <= this.uuids[iid].xlSk[_xlskid][1]) {
                this.uuids[zfiid].pkSk.push(["xl_" + _xlskid, this.uuids[iid].xlSk[_xlskid][3], this.uuids[iid].xlSk[_xlskid][2], 0, 0]);
            }
        }
        //如来佛祖的普通攻击有{0}概率击碎对手的防御，使其{1}回合内防御降低{2}
        for (const _xlskid of ["465", "466", "467", "468", "469"]) {
            if (this.seedRand.rand(1, 10000) <= this.uuids[iid].xlSk[_xlskid][0]) {
                this.uuids[zfiid].pkSk.push(["xl_" + _xlskid, this.uuids[iid].xlSk[_xlskid][2], this.uuids[iid].xlSk[_xlskid][1], 0, 0]);
            }
        }
        //添加日志
        if (log.isUp == 1) {
            this.addLog(log);
        }
        //陆压道君攻击时，有{0}概率额外对目标追加{1}次{2}攻击力的攻击
        for (const _xlskid of ["420", "421", "422", "423", "424"]) {
            if (this.seedRand.rand(1, 10000) <= this.uuids[iid].xlSk[_xlskid][0]) {
                for (let index = 0; index < this.uuids[iid].xlSk[_xlskid][1]; index++) {
                    if (this.teams[zfiid].eps.hp <= 0) {
                        continue;
                    }
                    let log = {
                        aType: Xys_1.ActionType.atk,
                        atker: {
                            fid: this.teams[iid].fid,
                            iid: iid,
                            hp: this.teams[iid].eps.hp,
                            nuqi: this.uuids[iid].nuqi,
                            buff: this.getShowBuff(iid),
                            effect: [],
                            status: 0,
                        },
                        target: [],
                        isUp: 1
                    };
                    let subXlHp = Math.floor(this.teams[iid].eps.atk * this.uuids[iid].xlSk[_xlskid][2] / 10000);
                    let fdef = this.teams[zfiid].eps.def;
                    let sub_fdef_per = 0;
                    //地藏菩萨受到攻击时，有{0}概率提高自身{1}防御，持续{2}回合，重复施加时重新计时
                    for (const _val of this.uuids[zfiid].pkSk) {
                        if (["xl_375", "xl_376", "xl_377", "xl_378", "xl_379"].indexOf(_val[0]) != -1) {
                            sub_fdef_per += _val[2];
                        }
                    }
                    //钟馗的攻击直击灵魂，忽视防御{0}
                    for (const _xlskid of ["187", "188", "189", "190", "191", "350", "351", "352", "353", "354"]) {
                        sub_fdef_per += this.uuids[iid].xlSk[_xlskid][0];
                    }
                    //忽视防御{1}
                    for (const _xlskid of ["302", "303", "304", "305", "306"]) {
                        sub_fdef_per += this.uuids[iid].xlSk[_xlskid][1];
                    }
                    //忽视防御{2}
                    for (const _xlskid of ["229", "230", "231", "232", "233"]) {
                        sub_fdef_per += this.uuids[iid].xlSk[_xlskid][2];
                    }
                    //蚩尤受到伤害减免{0}，攻击时有{1}概率使对方防御降低{2}，持续{3}回合
                    for (const _val of this.uuids[iid].pkSk) {
                        if (["xl_400", "xl_401", "xl_402", "xl_403", "xl_404", "xl_465", "xl_466", "xl_467", "xl_468", "xl_469"].indexOf(_val[0]) != -1) {
                            sub_fdef_per += _val[2];
                        }
                        if (["jg_29"].indexOf(_val[0]) != -1) {
                            sub_fdef_per -= _val[3];
                        }
                    }
                    fdef -= Math.floor(fdef * sub_fdef_per / 10000);
                    //  伤害公式：
                    // 	普通伤害=max((我方攻击-敌方防御)*(1+我方增伤-敌方减伤),我方攻击*0.15)*RANDBETWEEN(0.97,1.03)
                    // 	暴击伤害=max((我方攻击-敌方防御)*2*（我方增暴-敌方减暴）*(1+我方增伤-敌方减伤),我方攻击*0.15)*RANDBETWEEN(0.97,1.03)
                    //基础伤害
                    let jianshang = this.teams[zfiid].eps.jianshang;
                    for (const val of this.uuids[zfiid].pkSk) {
                        if (val[0] == "jg_2" || val[0] == "jg_9" || val[0] == "wxxf_68") {
                            jianshang -= val[2];
                        }
                        if (val[0] == "wxxf_39") {
                            jianshang += val[2];
                        }
                    }
                    jianshang = Math.max(0, jianshang);
                    let baseHit = (subXlHp - fdef) * (10000 + this.teams[iid].eps.zengshang - jianshang) / 10000;
                    //普通伤害
                    let ptHit = Math.round(Math.max(baseHit, subXlHp * 0.15) * this.seedRand.rand(97, 103) / 100);
                    let atk_per = 0; //基数1W  伤害提升
                    //反击所造成的伤害额外提高{0}，并移除被禁锢无法反击的限制
                    if (isAtk == 1) {
                        atk_per += this.uuids[iid].sqSk["9"][0];
                    }
                    //每比对方高1%的魔力值，则伤害提高{0}
                    let add_speed = 0;
                    if (["10", "20"].indexOf(iid) != -1) {
                        for (const _val of this.uuids[zfiid].pkSk) { //被他偷走攻击力
                            if (_val[0] == "wxxf_60") {
                                add_speed -= Math.floor(this.teams[iid].eps.speed * _val[2] / 10000);
                            }
                        }
                    }
                    if (["10", "20"].indexOf(iid) != -1) {
                        for (const _val of this.uuids[iid].pkSk) { //被他偷走攻击力
                            if (_val[0] == "wxxf_60") {
                                add_speed += Math.floor(this.teams[zfiid].eps.speed * _val[2] / 10000);
                            }
                        }
                    }
                    let beishu = Math.floor((this.teams[iid].eps.speed + add_speed - this.teams[zfiid].eps.speed) / 100);
                    if (beishu > 0) {
                        atk_per += Math.min(2000, this.uuids[iid].sqSk["13"][0] * beishu);
                    }
                    //血量每降低1%，造成伤害提高{0}
                    beishu = Math.floor((this.teams[iid].eps.hp_max - this.teams[iid].eps.hp) * 100 / this.teams[iid].eps.hp_max);
                    atk_per += this.uuids[iid].sqSk["14"][0] * beishu;
                    //伤害+{0}
                    for (const _xlskid of ["330", "331", "332", "333", "334", "355", "356", "357", "358", "359"]) {
                        atk_per += this.uuids[iid].xlSk[_xlskid][0];
                    }
                    //伤害+{2}
                    for (const _xlskid of ["307", "308", "309", "310", "311", "460", "461", "462", "463", "464"]) {
                        atk_per += this.uuids[iid].xlSk[_xlskid][2];
                    }
                    //对非地府系仙侣造成的伤害+{0}
                    if (this.uuids[zfiid].role != 3) {
                        for (const _xlskid of ["172", "173", "174", "175", "176", "203", "204", "205", "206", "207"]) {
                            atk_per += this.uuids[iid].xlSk[_xlskid][0];
                        }
                    }
                    //对地府系仙侣伤害加成+{0}，
                    if (this.uuids[zfiid].role == 3) {
                        for (const _xlskid of ["415", "416", "417", "418", "419"]) {
                            atk_per += this.uuids[iid].xlSk[_xlskid][0];
                        }
                    }
                    //受人神伤害减免
                    if (this.uuids[iid].role == 1) {
                        //伤害减免{1}
                        for (const _xlskid of ["219", "220", "221", "222", "223"]) {
                            atk_per -= this.uuids[zfiid].xlSk[_xlskid][0];
                        }
                    }
                    //受地府系仙侣伤害减免+{1}
                    if (this.uuids[iid].role == 3) {
                        //伤害减免{1}
                        for (const _xlskid of ["415", "416", "417", "418", "419"]) {
                            atk_per -= this.uuids[iid].xlSk[_xlskid][0];
                        }
                    }
                    //对生命值低于{0}的敌人，伤害增加{1}。
                    if (this.uuids[iid].fzSk["205"]["default_per"] > 0) {
                        if (this.teams[zfiid].eps.hp * 10000 / this.teams[zfiid].eps.hp_max < this.uuids[iid].fzSk["205"]["default_per"]) {
                            atk_per += this.uuids[iid].fzSk["205"]["default_per1"];
                        }
                    }
                    //对玩家伤害加成{0}，
                    if (this.uuids[zfiid].role == 998) {
                        for (const _xlskid of ["86", "87", "88", "89", "90"]) {
                            atk_per += this.uuids[iid].xlSk[_xlskid][0];
                        }
                        for (const _xlskid of ["425", "426", "427", "428", "429"]) {
                            atk_per += this.uuids[iid].xlSk[_xlskid][1];
                        }
                    }
                    let sub_def_per = 0; //伤害减免
                    //伤害减免{0}
                    for (const _xlskid of ["30", "31", "32", "182", "183", "184", "185", "186", "400", "401", "402", "403", "404"]) {
                        sub_def_per += this.uuids[zfiid].xlSk[_xlskid][0];
                    }
                    //伤害减免{1}
                    for (const _xlskid of ["266", "267", "268", "269", "270", "292", "293", "294", "295", "296", "318", "319", "320", "321", "322", "450", "451", "452", "453", "454"]) {
                        sub_def_per += this.uuids[zfiid].xlSk[_xlskid][1];
                    }
                    //受怪物伤害减免
                    if (this.uuids[iid].role == 999) {
                        //伤害减免{0}
                        for (const _xlskid of ["96", "97", "98", "99", "100", "430", "431", "432", "433", "434"]) {
                            sub_def_per += this.uuids[zfiid].xlSk[_xlskid][0];
                        }
                        //伤害减免{1}
                        for (const _xlskid of ["162", "163", "164", "165", "166", "214", "215", "216", "217", "218"]) {
                            sub_def_per += this.uuids[zfiid].xlSk[_xlskid][1];
                        }
                    }
                    //受玩家伤害减免
                    if (this.uuids[iid].role == 998) {
                        //伤害减免{0}
                        for (const _xlskid of ["250", "251", "252", "253", "254"]) {
                            sub_def_per += this.uuids[zfiid].xlSk[_xlskid][0];
                        }
                        //伤害减免{1}
                        for (const _xlskid of ["152", "153", "154", "155", "156", "203", "204", "205", "206", "207", "355", "356", "357", "358", "359"]) {
                            sub_def_per += this.uuids[zfiid].xlSk[_xlskid][1];
                        }
                    }
                    //受人神伤害减免
                    if (this.uuids[iid].role == 1) {
                        //伤害减免{1}
                        for (const _xlskid of ["219", "220", "221", "222", "223"]) {
                            sub_def_per += this.uuids[zfiid].xlSk[_xlskid][1];
                        }
                    }
                    //受人神伤害减免
                    if (this.uuids[iid].role == 2) {
                        //伤害减免{1}
                        for (const _xlskid of ["255", "256", "257", "258", "259"]) {
                            sub_def_per += this.uuids[zfiid].xlSk[_xlskid][0];
                        }
                    }
                    //受人神伤害减免
                    if (this.uuids[iid].role == 3) {
                        //伤害减免{1}
                        for (const _xlskid of ["281", "282", "283", "284", "285"]) {
                            sub_def_per += this.uuids[zfiid].xlSk[_xlskid][0];
                        }
                    }
                    //地涌夫人自己对伤害麻木，出战时伤害减免提高{0}，持续{1}回合，欺凌{2}
                    for (const _xlskid of ["276", "277", "278", "279", "280"]) {
                        if (this.huihe <= this.uuids[zfiid].xlSk[_xlskid][1]) {
                            sub_def_per += this.uuids[zfiid].xlSk[_xlskid][0];
                        }
                        if (this.teams[zfiid].eps.hp * 100 / this.teams[zfiid].eps.hp_max < 50) {
                            atk_per += this.uuids[zfiid].xlSk[_xlskid][2];
                        }
                    }
                    //生命值首次低于30%时，降低受到的伤害，持续到战斗结束。
                    if (this.uuids[zfiid].fzSk["204"]["count"] > 0) {
                        sub_def_per += this.uuids[zfiid].fzSk["204"]["default_per1"];
                    }
                    ptHit += Math.floor(ptHit * atk_per / 10000);
                    ptHit -= Math.floor(ptHit * sub_def_per / 10000);
                    //作为堕落的神祗，东皇太一不会受到超过生命上限{0}之外的伤害
                    for (const _xlskid of ["340", "341", "342", "343", "344"]) {
                        if (this.uuids[zfiid].xlSk[_xlskid][0] > 0) {
                            ptHit = Math.min(ptHit, Math.floor(this.teams[zfiid].eps.hp_max * this.uuids[zfiid].xlSk[_xlskid][0] / 10000));
                        }
                    }
                    let _status = 0;
                    let isreturn = false;
                    if (this.teams[zfiid].eps.hp < 1 && this.siles.indexOf(zfiid) == -1) {
                        if (this.teams[zfiid].eps.shengqi == 5 || this.teams[zfiid].wxSk["wxxf_55"] != null) {
                            _status = 1;
                        }
                        for (const _xlskid of ["390", "391", "392", "393", "394"]) {
                            if (this.uuids[zfiid].xlSk[_xlskid][0] > 0) {
                                _status = 1;
                            }
                        }
                        this.isOver = true;
                        if (["xlf_43", "xl_43"].indexOf(this.teams[zfiid].fid) != -1) {
                            this.teams[zfiid].eps.hp = 1;
                            this.uuids[zfiid].xl_360 = 1;
                        }
                        else {
                            this.siles.push(zfiid);
                        }
                        isreturn = true;
                    }
                    this.teams[zfiid].eps.hp = Math.max(0, this.teams[zfiid].eps.hp - ptHit);
                    let _target = {
                        fid: this.teams[zfiid].fid,
                        iid: zfiid,
                        hp: this.teams[zfiid].eps.hp,
                        nuqi: this.uuids[zfiid].nuqi,
                        buff: this.getShowBuff(zfiid),
                        effect: [],
                        isUp: 1,
                        status: _status,
                    };
                    _target.effect.push(['hp', -1 * ptHit]);
                    log.target.push(_target);
                    if (isreturn) {
                        this.addLog(log);
                        return;
                    }
                    if (log.isUp == 1) {
                        this.addLog(log);
                    }
                }
            }
        }
        if (isAtk == 1) { //如果是反击 反击结束
            this.pk_one_over(iid, isAtk);
            return;
        }
        //触发万象技能   有{1}概率命令仙侣立即进行一次攻击
        if (wxmf_type_1 == 1) {
            if (wxmf_type_1_id == "wxxf_43" && this.uuids[myXlid] != null) {
                if (this.seedRand.rand(1, 10000) <= this.teams[iid].wxSk["wxxf_43"][1]) {
                    this.pk_one_atk(myXlid, "", 0);
                }
            }
        }
        if (this.teams[zfiid].eps.hp < 1) { //主被打的 死了 本回合就结束了
            this.isOver = true;
            return;
        }
        //触发反击
        if (isfanji) {
            //触发反击 时  出手方要先回到起始位置
            let log = {
                aType: Xys_1.ActionType.over,
                atker: {
                    fid: this.teams[iid].fid,
                    iid: iid,
                    hp: this.teams[iid].eps.hp,
                    nuqi: this.uuids[iid].nuqi,
                    buff: this.getShowBuff(iid),
                    effect: [],
                    status: 2
                },
                target: [],
                isUp: 1
            };
            if (log.isUp == 1) {
                this.addLog(log);
            }
            this.pk_one_atk(zfiid, iid, 1);
        }
        //连击
        if (this.uuids[iid].lianji_count > 0) {
            this.pk_one_atk(iid, zfiid, 2);
        }
    }
    /**
     * 战斗 - 一次行动（后）
     * @param iid 攻击者
     * @param isAtk 0正常攻击  1反击 2连击
     */
    pk_one_over(iid, isAtk) {
        this.xl360_364();
        if (isAtk == 0) {
            //生效回合扣除  所有回合数 都在他出手完扣除
            for (const _fzid in this.uuids[iid].fzSk) { //这边放in没问题
                if (this.uuids[iid].fzSk[_fzid]["round"] > 0) {
                    this.uuids[iid].fzSk[_fzid]["round"] -= 1;
                }
            }
            //扣除回合数
            let copyPkSk = gameMethod_1.gameMethod.objCopy(this.uuids[iid].pkSk);
            this.uuids[iid].pkSk = [];
            for (const val of copyPkSk) {
                if (val[1] > 1) {
                    this.uuids[iid].pkSk.push([val[0], val[1] - 1, val[2], val[3], 0]);
                }
            }
            //每次反击都提升{0}吸血，最多叠加{1}次，持续至战斗结束。
            if (this.uuids[iid].fzSk["105"]["default_per"] > 0) {
                this.uuids[iid].fzSk["105"]["count"] += 1;
                if (this.uuids[iid].fzSk["105"]["count"] > this.uuids[iid].fzSk["105"]["default"]) {
                    this.uuids[iid].fzSk["105"]["count"] = this.uuids[iid].fzSk["105"]["default"];
                }
            }
        }
        let log = {
            aType: Xys_1.ActionType.over,
            atker: {
                fid: this.teams[iid].fid,
                iid: iid,
                hp: this.teams[iid].eps.hp,
                nuqi: this.uuids[iid].nuqi,
                buff: this.getShowBuff(iid),
                effect: [],
                status: 0,
            },
            target: [],
            isUp: 1
        };
        if (log.isUp == 1) {
            this.addLog(log);
        }
        //检测 死人复活
        if (this.siles.length > 0) {
            //加一个复活日志
            let log = {
                aType: Xys_1.ActionType.round,
                atker: {
                    fid: "",
                    iid: "",
                    hp: 0,
                    nuqi: 0,
                    buff: this.getShowBuff(iid),
                    effect: [],
                    status: 0,
                },
                target: [],
                isUp: 0
            };
            for (const _siid of this.siles) {
                //第一次死亡后复活，回复{0}生命，且攻击、防御提高{1}
                let add_per = 0;
                if (this.teams[_siid].eps.shengqi == 5) {
                    let cfgSqLv = gameCfg_1.default.shengqiLevel.getItem(this.teams[_siid].eps.shengqi.toString(), this.teams[_siid].eps.shengqiLv.toString());
                    if (cfgSqLv != null && cfgSqLv.skillVal[0] > 0) {
                        add_per = cfgSqLv.skillVal[0];
                        this.teams[_siid].eps.atk += Math.floor(this.teams[_siid].eps.atk * cfgSqLv.skillVal[1] / 10000);
                        this.teams[_siid].eps.def += Math.floor(this.teams[_siid].eps.def * cfgSqLv.skillVal[1] / 10000);
                    }
                }
                else if (this.teams[_siid].wxSk["wxxf_55"] != null) {
                    add_per = this.teams[_siid].wxSk["wxxf_55"][0];
                }
                else {
                    continue;
                }
                if (add_per < 1) {
                    continue;
                }
                this.uuids[_siid].pkSk = [];
                let addHp = Math.floor(this.teams[_siid].eps.hp_max * add_per / 10000);
                addHp += Math.floor(addHp * (this.teams[_siid].eps.qhzhiliao) / 10000);
                if (addHp > 0) {
                    this.teams[_siid].eps.hp = Math.min(this.teams[_siid].eps.hp_max, addHp);
                }
                this.teams[_siid].eps.shengqi = 0;
                this.uuids[_siid].nuqi = 0;
                delete this.teams[_siid].wxSk["wxxf_55"];
                this.uuids[_siid].addHp += this.teams[_siid].eps.hp;
                log.target.push({
                    fid: this.teams[_siid].fid,
                    iid: _siid,
                    hp: this.teams[_siid].eps.hp,
                    nuqi: this.uuids[_siid].nuqi,
                    buff: this.getShowBuff(_siid),
                    effect: [["fuhuo", 1], ['huifu', this.teams[_siid].eps.hp]],
                    status: 0,
                });
                log.isUp = 1;
            }
            for (const _siid of this.siles) {
                let addXlHp = 0;
                let add_per = 0;
                // for (const _xlskid of ["395","396","397","398","399"]) {
                // 	add_per += this.uuids[_siid].xlSk[_xlskid][1]
                // }
                for (const _xlskid of ["390", "391", "392", "393", "394"]) {
                    if (this.uuids[_siid].xlSk[_xlskid][0] > 0) {
                        addXlHp = Math.floor(this.teams[_siid].eps.hp_max * (this.uuids[_siid].xlSk[_xlskid][0] + add_per) / 10000);
                        this.uuids[_siid].xlSk[_xlskid][0] = 0;
                    }
                }
                if (addXlHp <= 0) {
                    continue;
                }
                this.uuids[_siid].pkSk = [];
                this.uuids[_siid].nuqi = 0;
                addXlHp += Math.floor(addXlHp * (this.teams[iid].eps.qhzhiliao));
                if (addXlHp > 0) {
                    this.teams[_siid].eps.hp = Math.min(this.teams[_siid].eps.hp_max, addXlHp);
                }
                this.uuids[_siid].addHp += this.teams[_siid].eps.hp;
                log.target.push({
                    fid: this.teams[_siid].fid,
                    iid: _siid,
                    hp: this.teams[_siid].eps.hp,
                    nuqi: this.uuids[_siid].nuqi,
                    buff: this.getShowBuff(_siid),
                    effect: [["fuhuo", 1], ['huifu', this.teams[_siid].eps.hp]],
                    status: 0,
                });
                log.isUp = 1;
            }
            this.siles = [];
            if (log.isUp == 1) {
                this.addLog(log);
            }
        }
    }
    // -------------辅助函数----------
    /**
     * 查找要打的对手
     * @param iid 攻击方
     * 返回 被打列表 第0为主被打
     */
    findIids(iid) {
        let getNum = 1; //获取个数
        //多宝道人的普通攻击有{0}概率召唤漫天星辰，对所有敌对单位造成一次攻击力{1}的伤害 -重置
        for (const _xlskid of ["328"]) {
            if (this.uuids[iid].xlSk[_xlskid][2] > 0) {
                this.uuids[iid].xlSk[_xlskid][2] = 0;
            }
        }
        //秒杀回合的时候  对面是所有成员
        if (this.teams[iid].eps.miaosha > 0 && this.teams[iid].eps.miaosha <= this.huihe) {
            getNum = 2;
        }
        else {
            //龙吉公主的普通攻击有{0}概率对随机{1}个目标同时造成伤害，但伤害降低{2}
            for (const _xlskid of ["47", "48", "49", "50", "69", "70", "71", "72", "116", "117", "118", "119", "120", "240", "241", "242", "243", "244"]) {
                if (this.seedRand.rand(1, 10000) <= this.uuids[iid].xlSk[_xlskid][0]) {
                    getNum = this.uuids[iid].xlSk[_xlskid][1];
                    this.uuids[iid].xlSk[_xlskid][3] = this.uuids[iid].xlSk[_xlskid][2];
                }
                else {
                    this.uuids[iid].xlSk[_xlskid][3] = 0;
                }
            }
            //小白龙的防御{0}，普通攻击对随机{1}名敌对单位造成伤害，但伤害降低{2}
            for (const _xlskid of ["126", "127", "128", "129", "130"]) {
                if (this.uuids[iid].xlSk[_xlskid][1] > 0) {
                    getNum = this.uuids[iid].xlSk[_xlskid][1];
                    this.uuids[iid].xlSk[_xlskid][3] = this.uuids[iid].xlSk[_xlskid][2];
                }
            }
            //聂小倩攻击时有{0}概率引发一场大潮，对所有敌对单位造成当前生命{1}的伤害，单次伤害不能超过仙侣攻击的{2}
            for (const _xlskid of ["286"]) {
                if (this.seedRand.rand(1, 10000) <= this.uuids[iid].xlSk[_xlskid][0]) {
                    getNum = 2;
                    this.uuids[iid].xlSk[_xlskid][3] = Math.floor(this.teams[iid].eps.atk * this.uuids[iid].xlSk[_xlskid][2] / 10000);
                }
                else {
                    this.uuids[iid].xlSk[_xlskid][3] = 0;
                }
            }
            //聂小倩攻击时有{0}概率引发一场大潮，对所有敌对单位造成当前生命{1}的伤害，单次伤害不能超过仙侣攻击的{2}
            for (const _xlskid of ["328"]) {
                if (this.seedRand.rand(1, 10000) <= this.uuids[iid].xlSk[_xlskid][0]) {
                    getNum = 2;
                    this.uuids[iid].xlSk[_xlskid][2] = Math.floor(this.teams[iid].eps.atk * this.uuids[iid].xlSk[_xlskid][1] / 10000);
                }
            }
            //哪吒的普通攻击将随机对场上{0}个敌对单位造成伤害
            for (const _xlskid of ["208", "260", "261", "262", "263", "264"]) {
                if (this.uuids[iid].xlSk[_xlskid][0] > 0) {
                    getNum = this.uuids[iid].xlSk[_xlskid][0];
                }
            }
        }
        let Mcamp = this.uuids[iid].camp;
        let giids = [];
        for (const _iid in this.uuids) {
            if (this.uuids[_iid].camp == Mcamp) {
                continue; //同阵营的
            }
            if (this.teams[_iid].eps.hp < 1) {
                continue; //阵亡了
            }
            let zwProb = this.uuids[_iid].zhanwei + 100;
            for (const _xlskid of ["323", "324", "325", "326", "327"]) {
                if (this.uuids[iid].xlSk[_xlskid][0] > 0) {
                    zwProb = 100 - this.uuids[_iid].zhanwei; //打后面的
                }
            }
            giids.push([_iid, zwProb]);
        }
        let fiids = [];
        if (giids.length <= 0) {
            return fiids;
        }
        giids.sort(function (a, b) {
            return a[1] - b[1];
        });
        for (let index = 0; index < getNum; index++) {
            if (giids[index] == null) {
                break; //没有那么多个对手
            }
            fiids.push(giids[index][0]);
        }
        return fiids;
    }
    /**
     * 前端展示的buff
     * @param fiid
     */
    getShowBuff(fiid) {
        let buff = [];
        for (const _val of this.uuids[fiid].pkSk) { //被他偷走攻击力
            if (["fz_203", "fz_101", "jiyun", "xl_3", "xl_14", "xl_51", "xl_64", "xl_151", "xl_234", "xl_265", "xl_329"].indexOf(_val[0]) == -1) {
                continue;
            }
            buff.push([_val[0], _val[1]]);
        }
        return buff;
    }
    /**
     * 镇元子在阵亡时元神出窍，对所有敌对单位造成生命上限{0}的伤害，该伤害不能超过仙侣攻击的{1}
     * @param fiid
     */
    xl360_364() {
        for (const fiid in this.uuids) {
            if (this.uuids[fiid].xl_360 != 1) {
                continue;
            }
            this.uuids[fiid].xl_360 = 0;
            this.teams[fiid].eps.hp = 0;
            for (const _xlskid of ["360", "361", "362", "363", "364"]) {
                if (this.uuids[fiid].xlSk[_xlskid][0] <= 0) {
                    continue;
                }
                let fiids = ["10", "11"];
                if (["10", "11"].indexOf(fiid) != -1) {
                    fiids = ["20", "21"];
                }
                let maxHit355 = Math.floor(this.teams[fiid].eps.atk * this.uuids[fiid].xlSk[_xlskid][1] / 10000);
                //先buff
                let log = {
                    aType: Xys_1.ActionType.atk,
                    atker: {
                        fid: this.teams[fiid].fid,
                        iid: fiid,
                        hp: 1,
                        nuqi: this.uuids[fiid].nuqi,
                        buff: [],
                        effect: [],
                        status: 0,
                    },
                    target: [],
                    isUp: 0
                };
                for (const _fiid of fiids) {
                    if (this.teams[_fiid] == null || this.teams[_fiid].eps.hp <= 0) {
                        continue;
                    }
                    let hit366 = Math.floor(this.teams[_fiid].eps.hp_max * this.uuids[fiid].xlSk[_xlskid][0] / 10000);
                    hit366 = Math.min(hit366, maxHit355);
                    log.isUp = 1;
                    this.teams[_fiid].eps.hp = Math.max(0, this.teams[_fiid].eps.hp - hit366);
                    log.target.push({
                        fid: this.teams[_fiid].fid,
                        iid: _fiid,
                        hp: this.teams[_fiid].eps.hp,
                        nuqi: this.uuids[_fiid].nuqi,
                        buff: this.getShowBuff(_fiid),
                        effect: [["hp", -1 * hit366]],
                        status: 0,
                    });
                    this.uuids[fiid].hurt += hit366;
                    if (this.teams[_fiid].eps.hp < 1 && this.siles.indexOf(_fiid) == -1) {
                        if (this.teams[_fiid].eps.shengqi == 5 || this.teams[_fiid].wxSk["wxxf_55"] != null) {
                            log.atker.status = 1;
                        }
                        for (const _xlskid of ["390", "391", "392", "393", "394"]) {
                            if (this.uuids[_fiid].xlSk[_xlskid][0] > 0) {
                                log.atker.status = 1;
                            }
                        }
                        if (["xlf_43", "xl_43"].indexOf(this.teams[_fiid].fid) != -1) {
                            this.teams[_fiid].eps.hp = 1;
                            log.atker.hp = this.teams[_fiid].eps.hp;
                            this.uuids[_fiid].xl_360 = 1;
                        }
                        else {
                            this.siles.push(_fiid);
                        }
                    }
                }
                if (log.isUp == 1) {
                    this.addLog(log);
                    let log1 = {
                        aType: Xys_1.ActionType.over,
                        atker: {
                            fid: this.teams[fiid].fid,
                            iid: fiid,
                            hp: 0,
                            nuqi: 0,
                            buff: [],
                            effect: [],
                            status: 0,
                        },
                        target: [],
                        isUp: 0
                    };
                    this.addLog(log1);
                }
                this.uuids[fiid].xlSk[_xlskid][0] = 0;
            }
        }
    }
}
exports.Fight = Fight;
//# sourceMappingURL=fight.js.map