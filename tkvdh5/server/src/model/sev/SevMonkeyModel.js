"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SevMonkeyModel = void 0;
const master_1 = require("../../util/master");
const AModel_1 = require("../AModel");
const game_1 = __importDefault(require("../../util/game"));
/**
 * 魔种降生
 */
class SevMonkeyModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "sev"; //数据库表名
        this.kid = "sevMonkey"; //用于存储key 和  输出1级key
        this.outIsAu = false; //下发数据是否用au下发
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
            //幸运日志
            luckyLogs: [],
            //皮肤池-限量
            sevPool2: {},
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        return info;
    }
    async getOutPut() {
        let info = await this.getInfo();
        return info;
    }
    /**
     * 辅助方法：检查活动状态和获取信息
     *
     * @returns 存储数据和活动配置数据
     */
    async checkActivityAndGetInfo() {
        const cfg = (await this.getHdCfg());
        const info = await this.getInfo();
        if (cfg == null || this.ctx.state.newTime > cfg.info.eAt) {
            this.ctx.throw("活动已结束");
        }
        return { info, cfg };
    }
    /**
     * 抽皮肤
     *
     * @param num 抽数
     *
     */
    //奖池里有三个奖品和其他若干普通奖品，这三个奖品都有数量限制，当其中一个奖品达到数量限制时，抽奖不再获得这个奖品
    async skinDraw(num) {
        // 调用辅助方法
        const { info, cfg } = await this.checkActivityAndGetInfo();
        await this.ctx.state.master.subItem1([cfg.data.skinDraw[0], cfg.data.skinDraw[1], cfg.data.skinDraw[2] * num]);
        //记录抽奖接结果的数组
        let items = [];
        for (let index = 0; index < num; index++) {
            //获取抽取库
            let copy = cfg.data.pool2;
            for (const id in copy) {
                if (copy[id].limit == 0) {
                    continue;
                }
                if (info.sevPool2[id] == null) {
                    continue;
                }
                if (copy[id].limit <= info.sevPool2[id]) {
                    delete copy[id];
                }
            }
            //获取奖品
            let _id = game_1.default.getProbRandId(0, copy, "prob");
            if (_id == null) {
                this.ctx.throw("获取奖励失败");
            }
            else {
                items.push(copy[_id].item);
                info.luckyLogs.push({ timestamp: game_1.default.getNowTime(), name: this.ctx.state.name, prize: copy[_id].item });
                if (info.sevPool2[_id] == null) {
                    info.sevPool2[_id] = 0;
                }
                info.sevPool2[_id] += 1;
            }
        }
        await this.update(info, ["red", "outf"]);
        await this.ctx.state.master.addItem2(items);
    }
}
exports.SevMonkeyModel = SevMonkeyModel;
//# sourceMappingURL=SevMonkeyModel.js.map