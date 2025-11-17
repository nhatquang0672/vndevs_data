"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SevClubBossModel = void 0;
const master_1 = require("../../util/master");
const AModel_1 = require("../AModel");
const cache_1 = __importDefault(require("../../../src/util/cache"));
/**
 * 公会BOSS 排行数据
 */
class SevClubBossModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "sev"; //数据库表名
        this.kid = "clubBoss"; //用于存储key 和  输出1级key
        this.outIsAu = true; //下发数据是否用au下发
        this.dType = master_1.DataType.sev;
    }
    static getInstance(ctx, clubId, hdcid = "1") {
        let dlKey = this.name + "_" + clubId + "_" + hdcid; //单例模式key
        if (!ctx.state.model[dlKey]) {
            ctx.state.model[dlKey] = new this(ctx, clubId, hdcid);
        }
        return ctx.state.model[dlKey];
    }
    outKey2() {
        return ""; //输出2级key
    }
    init() {
        return {
            today: {},
            last: {},
            outTime: 0,
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        //每日重置时间
        if (info.outTime < this.ctx.state.newTime) {
            info.outTime = this.ctx.state.new0 + 86400;
            //检查会长脚本
            //吧每日的 X给上次的
            for (const bossId in info.today) {
                if (info.today[bossId] != null) {
                    info.last[bossId] = info.today[bossId];
                    delete info.today[bossId];
                }
            }
            await this.update(info, [""]);
        }
        return info;
    }
    async addHurt(bossId, uuid, hurt) {
        let info = await this.getInfo();
        if (info.today[bossId] == null) {
            info.today[bossId] = {};
        }
        if (info.today[bossId][uuid] == null) {
            info.today[bossId][uuid] = 0;
        }
        info.today[bossId][uuid] += hurt;
        await this.update(info, [""]);
    }
    //没有输出
    async getOutPut() {
        return null;
    }
    //输出指定榜单
    async backRank(type, bossId) {
        //输出
        let outf = {
            clubBoss: {},
        };
        outf.clubBoss[bossId] = {
            today: await this._makeRankByType("today", bossId),
            last: await this._makeRankByType("today", bossId),
        };
        this.ctx.state.master.addBackBuf(outf);
    }
    async _makeRankByType(type, bossId) {
        let info = await this.getInfo();
        let list = info.last;
        if (type == "last") {
            //默认就是last
        }
        else if (type == "today") {
            list = info.today;
        }
        else {
            this.ctx.throw("type err");
        }
        if (list[bossId] == null) {
            //没有信息
            return {};
        }
        let hurtRds = {};
        for (const fuuid in list[bossId]) {
            hurtRds[fuuid] = {
                user: await cache_1.default.getFUser(this.ctx, fuuid, 1),
                score: list[bossId][fuuid],
            };
        }
        return hurtRds;
    }
}
exports.SevClubBossModel = SevClubBossModel;
//# sourceMappingURL=SevClubBossModel.js.map