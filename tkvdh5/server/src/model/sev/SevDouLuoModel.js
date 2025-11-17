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
exports.SevDouLuoModel = void 0;
const Xys = __importStar(require("../../../common/Xys"));
const master_1 = require("../../util/master");
const AModel_1 = require("../AModel");
const setting_1 = __importDefault(require("../../crontab/setting"));
const gameMethod_1 = require("../../../common/gameMethod");
const game_1 = __importDefault(require("../../util/game"));
const RdsUserModel_1 = require("../redis/RdsUserModel");
const tool_1 = require("../../util/tool");
const lock_1 = __importDefault(require("../../util/lock"));
/**
 * 斗罗跨服信息
 * SevDouLuoModel
 */
class SevDouLuoModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "sev"; //数据库表名
        this.kid = "douLuo"; //用于存储key 和  输出1级key
        this.outIsAu = true; //下发数据是否用au下发
        this.dType = master_1.DataType.sev;
    }
    outKey2() {
        return this.hdcid; //输出2级key
    }
    init() {
        return {
            hdid: "",
            weekId: "",
            list: {},
            kids: {},
            bug: 2
        };
    }
    //单例模式
    static getInstance(ctx, cid = "1", hdcid = "1") {
        let dlKey = this.name + "_" + cid + "_" + hdcid; //单例模式key
        if (!ctx.state.model[dlKey]) {
            ctx.state.model[dlKey] = new this(ctx, cid, hdcid);
        }
        return ctx.state.model[dlKey];
    }
    /**
     * 初始化下发 不下发
     */
    async getOutPut() {
        return null;
    }
    async getInfo() {
        let info = await super.getInfo();
        let cfg = gameMethod_1.gameMethod.objCopy(setting_1.default.getHuodong3('1', 'hdDouLuo', this.hdcid));
        let weekId = game_1.default.getDouLuoWeek();
        if (cfg != null && (cfg.info.id != info.hdid || info.weekId != weekId)) {
            info = this.init();
            info.weekId = weekId;
            info.hdid = cfg.info.id;
        }
        if (info.bug != 2) {
            info.bug = 2;
            info.list = {};
            info.kids = {};
        }
        return info;
    }
    //获取 斗罗跨服ID  //传入合服ID
    async getDLKidBySid(hsid) {
        let allQufu = setting_1.default.getQufus();
        if (allQufu[hsid] == null) {
            tool_1.tool.addServerError(this.ctx.url, tool_1.tool.getParams(this.ctx), {
                err: "跨服ID错误",
                hsid: hsid,
                id: this.id,
                hdcid: this.hdcid
            });
            this.ctx.throw(``);
        }
        let info = await this.getInfo();
        let getHfid = setting_1.default.getHeid(hsid); //获取合服ID
        if (info.list[hsid] == null) {
            if (info.list[getHfid] != null) {
                info.list[hsid] = getHfid;
                await this.update(info);
                return info.list[getHfid];
            }
            let vals = [];
            let hsids = Object.keys(allQufu);
            let max = 10; //每10个合服夸
            let count = 0;
            let hfid = "1";
            //遍历所有服ID
            for (let i_hsid = 0; i_hsid < hsids.length; i_hsid++) {
                let _sid = hsids[i_hsid]; //本合服ID
                if (_sid != allQufu[_sid].heid) { //已经合服了  子服跟着主服走
                    if (info.list[_sid] == null) {
                        info.list[_sid] = hfid;
                    }
                    continue;
                }
                count++;
                if (count > max) {
                    count = 1;
                    hfid = _sid;
                }
                if (info.list[_sid] == null) {
                    info.list[_sid] = hfid;
                }
                if (info.kids[hfid] == null) {
                    await lock_1.default.setLock(this.ctx, "duoluo_1", hfid.toString());
                    //初始化NPC表 1~499
                    //排行
                    let rdsUserModel = RdsUserModel_1.RdsUserModel.getInstance(this.ctx, Xys.RdsUser.rdsDouLuo, hfid.toString(), this.hdcid, game_1.default.getDouLuoWeek());
                    if (vals.length <= 0) {
                        for (let rid = 1; rid <= 500; rid++) {
                            vals.push(rid.toString()); //npc uuid
                            vals.push(rid.toString()); //名次 = 分值 倒序表
                        }
                    }
                    //批量设置
                    await rdsUserModel.del(rdsUserModel.getKey()); //清空所有
                    await rdsUserModel.zSetVals(vals);
                    //记录NPC已经初始化
                    info.kids[hfid] = this.ctx.state.newTime;
                }
            }
            await this.update(info);
        }
        return info.list[getHfid];
    }
}
exports.SevDouLuoModel = SevDouLuoModel;
//# sourceMappingURL=SevDouLuoModel.js.map