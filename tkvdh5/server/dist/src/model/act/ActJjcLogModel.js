"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActJjcLogModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const cache_1 = __importDefault(require("../../util/cache"));
const ActJjcFightModel_1 = require("./ActJjcFightModel");
const game_1 = __importDefault(require("../../util/game"));
/**
 * Jjc 战斗日志
 */
class ActJjcLogModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actJjcLog"; //用于存储key 和  输出1级key
        this.outIsAu = true; //下发数据是否用au下发
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
            list: {},
            id: 1,
            weekId: game_1.default.getWeekId(this.ctx.state.new0 + 86400)
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        if (info.weekId != game_1.default.getWeekId(this.ctx.state.new0 + 86400)) {
            info = this.init();
        }
        return info;
    }
    /**
     * 返回数据
     */
    async getOutPut() {
        let info = await this.getInfo();
        let outf = {};
        for (const id in info.list) {
            outf[id] = await this.getOutPut_u(id);
        }
        return outf;
    }
    async getOutPut_u(id) {
        let info = await this.getInfo();
        let fuser = await cache_1.default.getFUser(this.ctx, info.list[id][0]);
        fuser.win = info.list[id][1]; //1胜0负
        fuser.score = info.list[id][2]; //获得积分
        fuser.fuchou = info.list[id][3]; //1是0否复仇
        fuser.cAt = info.list[id][4]; //被打时间
        return fuser;
    }
    /**
     * 复仇
     * @param id 日志下标ID
     */
    async fuchou(id) {
        let info = await this.getInfo();
        if (info.list[id] == null) {
            this.ctx.throw("参数错误");
        }
        if (info.list[id][3] != 0) {
            this.ctx.throw("已经复仇");
        }
        //战斗
        let actJjcFightModel = ActJjcFightModel_1.ActJjcFightModel.getInstance(this.ctx, this.id);
        let isWin = await actJjcFightModel.fight_one(info.list[id][0], 1);
        if (isWin == 1) {
            info.list[id][3] = 1;
            await this.update(info, [id]);
        }
    }
    /**
     * 记录被打日志
     * @param fuuid 谁打我
     * @param win 1胜0负
     * @param score 获得积分
     */
    async addLog(fuuid, win, score, fc = 0) {
        let info = await this.getInfo();
        //序号ID：[谁打我,1胜0负,获得积分,1是0否复仇,被打时间]
        info.list[info.id.toString()] = [fuuid, win, score, fc, this.ctx.state.newTime];
        //只保留20条
        if (info.list[(info.id - 20).toString()] != null) {
            delete info.list[(info.id - 20).toString()];
        }
        info.id += 1;
        await this.update(info);
    }
}
exports.ActJjcLogModel = ActJjcLogModel;
//# sourceMappingURL=ActJjcLogModel.js.map