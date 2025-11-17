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
exports.ActLiuDaoModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const tool_1 = require("../../util/tool");
const Xys = __importStar(require("../../../common/Xys"));
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const game_1 = __importDefault(require("../../util/game"));
const gameMethod_1 = require("../../../common/gameMethod");
const UserModel_1 = require("../user/UserModel");
const fight_1 = require("../../../common/fight");
const SevLiuDaoModel_1 = require("../sev/SevLiuDaoModel");
const lock_1 = __importDefault(require("../../util/lock"));
const RdsUserModel_1 = require("../redis/RdsUserModel");
const cache_1 = __importDefault(require("../../util/cache"));
const hook_1 = require("../../util/hook");
/**
 * 六道秘境
 */
class ActLiuDaoModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actLiuDao"; //用于存储key 和  输出1级key
        this.outIsAu = false; //下发数据是否用au下发
        this.dType = master_1.DataType.user;
    }
    //单例模式
    static getInstance(ctx, uuid, hdcid = '1') {
        let dlKey = this.name + '_' + uuid + '_' + hdcid; //单例模式key
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
            time: 0,
            maxId: 0,
            sevRwd: [],
            actRwd: [],
            nowId: 0,
            start: {
                from: "",
                seed: 0,
                teams: {}
            },
            end: {
                win: 0,
                items: [],
            },
            itemLock: {} //六道获取道具数量限制
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        if (info.time < this.ctx.state.new0) {
            info.time = this.ctx.state.newTime;
            info.nowId = 0;
            info.itemLock = {};
        }
        if (info.actRwd == null) {
            info.actRwd = [];
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
    *  开启一场战斗
    */
    async fight_one() {
        let info = await this.getInfo();
        let userModel = UserModel_1.UserModel.getInstance(this.ctx, this.id);
        let gStart = await userModel.getFightEps();
        //敌方阵容
        let cfgLdInfo = gameCfg_1.default.liudaoInfo.getItem((info.nowId + 1).toString());
        if (cfgLdInfo == null) {
            this.ctx.throw("已通关");
        }
        let cfgMonInfo = gameCfg_1.default.monLiudao.getItemCtx(this.ctx, cfgLdInfo.momid);
        let monEps = gameMethod_1.gameMethod.ep_merge(gameMethod_1.gameMethod.ep_init(), cfgMonInfo.eps);
        let monXlEps = gameMethod_1.gameMethod.ep_merge(gameMethod_1.gameMethod.ep_init(), cfgMonInfo.xleps);
        info.start = {
            from: "liudao",
            seed: game_1.default.rand(1, 65535),
            teams: {
                "10": {
                    fid: this.id,
                    zhanwei: 0,
                    eps: gStart.eps,
                    level: 0,
                    wxSk: gStart.wxSk,
                    isnq: gStart.isnq,
                    jgSk: gStart.jgSk //精怪技能
                },
                "20": {
                    fid: cfgLdInfo.momid,
                    zhanwei: 0,
                    eps: monEps,
                    level: 0,
                    wxSk: {},
                    isnq: 0,
                    jgSk: {} //精怪技能
                }
            }
        };
        if (cfgMonInfo.xlid != "0") {
            info.start.teams["21"] = {
                fid: "fxl_" + cfgMonInfo.xlid.toString(),
                zhanwei: cfgMonInfo.xlzw,
                eps: monXlEps,
                level: cfgMonInfo.xllv,
                wxSk: {},
                isnq: 0,
                jgSk: {} //精怪技能
            };
        }
        if (gStart.xlid != "") {
            info.start.teams["11"] = {
                fid: "xl_" + gStart.xlid,
                zhanwei: gStart.xlzw,
                eps: gStart.xleps,
                level: gStart.xlLv,
                wxSk: {},
                isnq: 0,
                jgSk: {} //精怪技能
            };
        }
        //战斗
        let fight = new fight_1.Fight(info.start);
        let back = fight.get_outf();
        //记录战斗日志
        tool_1.tool.addFightTeam(this.ctx, info.start);
        info.end.win = back.win;
        info.end.items = [];
        if (info.end.win == 1) {
            info.nowId += 1;
            //首次奖励
            if (info.nowId > info.maxId) {
                info.maxId = info.nowId;
                await hook_1.hookNote(this.ctx, "liudaomax", info.maxId);
                info.end.items = game_1.default.addArr(info.end.items, cfgLdInfo.frwd);
                //推送给 - sev 我打到的最大层数
                let heid = await this.getHeIdByUuid(this.id);
                await lock_1.default.setLock(this.ctx, "liudao", heid); //枷锁
                let sevLiuDaoModel = SevLiuDaoModel_1.SevLiuDaoModel.getInstance(this.ctx, heid);
                await sevLiuDaoModel.addFuuid(this.id, info.maxId.toString());
                //进总榜单
                let dlRdsUserModel = RdsUserModel_1.RdsUserModel.getInstance(this.ctx, Xys.RdsUser.rdsLiuDao, heid);
                await dlRdsUserModel.zSet(this.id, info.maxId);
            }
            else {
                //通关奖励
                for (const ditem of cfgLdInfo.drwd) {
                    let ritem = game_1.default.getProbByItems(ditem[2], 0, 1);
                    if (ritem == null || ritem[0] == 0) {
                        continue;
                    }
                    let hcount = ritem[0];
                    info.end.items.push([ditem[0], ditem[1], hcount]);
                }
            }
            if (info.end.items.length > 0) {
                //加道具
                await this.ctx.state.master.addItem2(info.end.items, "");
            }
        }
        else {
            //失败什么都没有
        }
        await this.update(info);
    }
    /**
    *  六道扫荡
    */
    async saodang() {
        let info = await this.getInfo();
        let count = tool_1.tool.mathcfg_count(this.ctx, "liudao_set");
        let count1 = tool_1.tool.mathcfg_count1(this.ctx, "liudao_set");
        if (info.maxId < count) {
            this.ctx.throw(`历史最大${count}关以上可扫荡`);
        }
        if (info.maxId - info.nowId <= count1) {
            this.ctx.throw(`距离历史最大关需要${count1}关以上`);
        }
        let items = [];
        let startId = info.nowId + 1;
        let cfgkv = tool_1.tool.mathcfg_kv(this.ctx, "liudao_itemLock");
        for (let index = startId; index <= info.maxId - count1; index++) {
            info.nowId += 1;
            let cfgLdInfo = gameCfg_1.default.liudaoInfo.getItemCtx(this.ctx, index.toString());
            //通关奖励
            for (const ditem of cfgLdInfo.drwd) {
                let ritem = game_1.default.getProbByItems(ditem[2], 0, 1);
                if (ritem == null || ritem[0] == 0) {
                    continue;
                }
                let hcount = ritem[0];
                if (cfgkv[ditem[1].toString()] != null) {
                    if (info.itemLock[ditem[1].toString()] == null) {
                        info.itemLock[ditem[1].toString()] = 0;
                    }
                    if (info.itemLock[ditem[1].toString()] >= cfgkv[ditem[1].toString()]) {
                        continue; //数量已满
                    }
                    hcount = Math.min(hcount, cfgkv[ditem[1].toString()] - info.itemLock[ditem[1].toString()]);
                    info.itemLock[ditem[1].toString()] += hcount;
                }
                items.push([ditem[0], ditem[1], hcount]);
            }
        }
        if (items.length <= 0) {
            this.ctx.throw(`扫荡失败`);
        }
        await this.update(info);
        //加道具
        await this.ctx.state.master.addItem2(gameMethod_1.gameMethod.mergeArr(items));
    }
    /**
    *  获取成就进榜的5名玩家
    */
    async getCj5(id) {
        let outf = {
            id: id,
            list: []
        };
        let heid = await this.getHeIdByUuid(this.id);
        let sevLiuDaoModel = SevLiuDaoModel_1.SevLiuDaoModel.getInstance(this.ctx, heid);
        let sevLiuDao = await sevLiuDaoModel.getInfo();
        if (sevLiuDao.cj[id] == null) {
            this.ctx.state.master.addBackBuf({
                actLiuDaoG5: outf
            });
            return;
        }
        let countMax = tool_1.tool.mathcfg_count(this.ctx, "liudao_sevCj");
        let rid = 0;
        for (const fuuid of sevLiuDao.cj[id.toString()]) {
            let factLiuDaoModel = ActLiuDaoModel.getInstance(this.ctx, fuuid);
            let factLiuDao = await factLiuDaoModel.getInfo();
            rid++;
            if (rid > countMax) {
                break;
            }
            outf.list.push({
                rid: rid,
                score: factLiuDao.maxId,
                fuser: await cache_1.default.getFUser(this.ctx, fuuid, 1)
            });
        }
        this.ctx.state.master.addBackBuf({
            actLiuDaoG5: outf
        });
    }
    /**
    *  领取成就奖励  全服
    */
    async sevCjRwd(id) {
        let info = await this.getInfo();
        if (info.sevRwd.indexOf(id) != -1) {
            this.ctx.throw("已领取");
        }
        //推送给 - sev 我打到的最大层数
        let heid = await this.getHeIdByUuid(this.id);
        let sevLiuDaoModel = SevLiuDaoModel_1.SevLiuDaoModel.getInstance(this.ctx, heid);
        let sevLiuDao = await sevLiuDaoModel.getInfo();
        if (sevLiuDao.cj[id] == null || sevLiuDao.cj[id].length < 5) {
            this.ctx.throw("参数错误");
        }
        info.sevRwd.push(id);
        await this.update(info);
        let cfgLdcj = gameCfg_1.default.liudaoSevCj.getItemCtx(this.ctx, id);
        await this.ctx.state.master.addItem2(cfgLdcj.items);
    }
    /**
    *  领取成就奖励 个人
    */
    async actCjRwd(id) {
        let info = await this.getInfo();
        if (info.actRwd.indexOf(id) != -1) {
            this.ctx.throw("已领取");
        }
        if (parseInt(id) > info.maxId) {
            this.ctx.throw("未满足条件");
        }
        let cfgLdcj = gameCfg_1.default.liudaoActCj.getItem(id);
        if (cfgLdcj == null) {
            this.ctx.throw("参数参数错误");
        }
        info.actRwd.push(id);
        await this.update(info);
        await this.ctx.state.master.addItem2(cfgLdcj.items);
    }
}
exports.ActLiuDaoModel = ActLiuDaoModel;
//# sourceMappingURL=ActLiuDaoModel.js.map