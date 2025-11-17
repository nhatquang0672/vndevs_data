"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActZhaoCaiModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const tool_1 = require("../../util/tool");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const game_1 = __importDefault(require("../../util/game"));
const gameMethod_1 = require("../../../common/gameMethod");
/**
 * 招财幡
 */
class ActZhaoCaiModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actZhaoCai"; //用于存储key 和  输出1级key
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
        let count = tool_1.tool.mathcfg_count(this.ctx, "zhaocai_maxTili");
        return {
            time: this.ctx.state.newTime,
            tili: count,
            lastAt: this.ctx.state.newTime,
            kind11: 0,
            kind11At: 0,
            buy: 0,
            xiulian: 0,
            pinzhi: "",
            step: 0,
            limit: 0,
            isWin: 1,
            items: [] //本轮升阶总奖励
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        let count = tool_1.tool.mathcfg_count(this.ctx, "zhaocai_maxTili");
        let isUpdate = false;
        if (info.time < this.ctx.state.new0) {
            info.time = this.ctx.state.newTime;
            info.tili = count;
            info.lastAt = this.ctx.state.newTime;
            info.kind11 = 0;
            info.kind11At = 0;
            info.buy = 0;
            info.xiulian = 0;
            isUpdate = true;
        }
        if (info.lastAt < this.ctx.state.new0 + 3600 * 12 && this.ctx.state.newTime >= this.ctx.state.new0 + 3600 * 12) {
            info.lastAt = this.ctx.state.new0 + 3600 * 12;
            info.tili += 1;
            isUpdate = true;
            info.tili = Math.min(info.tili, count);
        }
        if (info.lastAt < this.ctx.state.new0 + 3600 * 18 && this.ctx.state.newTime >= this.ctx.state.new0 + 3600 * 18) {
            info.lastAt = this.ctx.state.new0 + 3600 * 18;
            info.tili += 1;
            isUpdate = true;
            info.tili = Math.min(info.tili, count);
        }
        if (isUpdate) {
            await this.update(info, ['']);
        }
        return info;
    }
    /**
     * 返回数据
     */
    async getOutPut() {
        let info = await this.getInfo();
        let infoCopy = gameMethod_1.gameMethod.objCopy(info);
        infoCopy.lastAt = this.ctx.state.new0 + 86400;
        if (info.lastAt < this.ctx.state.new0 + 3600 * 18) {
            infoCopy.lastAt = this.ctx.state.new0 + 3600 * 18;
        }
        if (info.lastAt < this.ctx.state.new0 + 3600 * 12) {
            infoCopy.lastAt = this.ctx.state.new0 + 3600 * 12;
        }
        return infoCopy;
    }
    /**
    *  召唤
    */
    async zhaohuan() {
        let info = await this.getInfo();
        if (info.tili <= 0) {
            if (await this.ctx.state.master.subItem1([1, 72, 1], true) == true) {
                await this.ctx.state.master.subItem1([1, 72, 1]);
            }
            else {
                this.ctx.throw("体力不足");
            }
        }
        else {
            info.tili -= 1;
        }
        if (info.pinzhi != "") {
            this.ctx.throw("已有招财幡");
        }
        let pool = gameCfg_1.default.zhaocaiPinzhi.pool;
        let _item = game_1.default.getProbRandItem(0, pool, "prob");
        if (_item == null) {
            this.ctx.throw("抽取错误");
            return;
        }
        info.pinzhi = _item.pinzhi;
        info.step = 1;
        info.isWin = 1;
        let cfg = gameCfg_1.default.zhaocaiStep.getItemCtx(this.ctx, info.pinzhi, info.step.toString());
        info.items = game_1.default.addArr([], cfg.wItems1);
        await this.update(info);
    }
    /**
    *  升阶
    */
    async upStep() {
        let info = await this.getInfo();
        if (info.pinzhi == "") {
            this.ctx.throw("请先召唤招财幡");
        }
        let cfgNext = gameCfg_1.default.zhaocaiStep.getItemCtx(this.ctx, info.pinzhi, (info.step + 1).toString());
        if (cfgNext == null) {
            this.ctx.throw("已满阶");
        }
        let cfg = gameCfg_1.default.zhaocaiStep.getItemCtx(this.ctx, info.pinzhi, info.step.toString());
        let cfgPz = gameCfg_1.default.zhaocaiPinzhi.getItemCtx(this.ctx, info.pinzhi);
        if (info.limit >= cfgPz.limit) {
            this.ctx.throw("升阶次数已达上限");
        }
        let count = tool_1.tool.mathcfg_count(this.ctx, "zhaocai_free");
        if (info.xiulian < count) {
            //免费
        }
        else {
            await this.ctx.state.master.subItem2(cfg.need);
        }
        info.xiulian += 1;
        info.limit += 1;
        if (game_1.default.rand(1, 10000) > cfg.prob) { //失败
            let copyItems = gameMethod_1.gameMethod.objCopy(info.items);
            info.items = [];
            for (const item of copyItems) {
                let beishu = 100;
                for (const iems2 of cfgNext.lItems2) {
                    if (iems2[0] == item[0] && iems2[1] == item[1]) {
                        beishu = iems2[2];
                        break;
                    }
                }
                let count_3 = Math.floor(beishu * item[2] / 100);
                info.items.push([item[0], item[1], count_3]);
            }
            info.items = game_1.default.addArr(info.items, cfgNext.lItems1);
            info.isWin = 0;
            info.step += 1;
        }
        else {
            let copyItems = gameMethod_1.gameMethod.objCopy(info.items);
            info.items = [];
            for (const item of copyItems) {
                let beishu = 100;
                for (const iems2 of cfgNext.wItems2) {
                    if (iems2[0] == item[0] && iems2[1] == item[1]) {
                        beishu = iems2[2];
                        break;
                    }
                }
                let count_3 = Math.floor(beishu * item[2] / 100);
                info.items.push([item[0], item[1], count_3]);
            }
            info.items = game_1.default.addArr(info.items, cfgNext.wItems1);
            info.step += 1;
            info.isWin = 1;
        }
        info.items = gameMethod_1.gameMethod.mergeArr(info.items);
        await this.update(info);
    }
    /**
    *  领取奖励
    */
    async rwd() {
        let info = await this.getInfo();
        await this.ctx.state.master.addItem2(info.items, "zhaoCaiItems");
        info.pinzhi = "";
        info.step = 1;
        info.isWin = 1;
        info.items = [];
        info.limit = 0;
        await this.update(info);
    }
    /**
    *  购买体力
    */
    async buyTili() {
        let info = await this.getInfo();
        info.buy += 1;
        let cfg = gameCfg_1.default.zhaocaiBuy.getItem(info.buy.toString());
        if (cfg == null) {
            this.ctx.throw("无购买次数");
            return;
        }
        await this.ctx.state.master.subItem1(cfg.need);
        if (info.pinzhi != "") {
            this.ctx.throw("已有招财幡");
        }
        let pool = gameCfg_1.default.zhaocaiPinzhi.pool;
        let _item = game_1.default.getProbRandItem(0, pool, "prob");
        if (_item == null) {
            this.ctx.throw("抽取错误");
            return;
        }
        info.pinzhi = _item.pinzhi;
        info.step = 1;
        info.isWin = 1;
        await this.update(info);
    }
    /**
     * 看广告消耗钻石
     */
    async kind11Buy() {
        let info = await this.getInfo();
        let count = tool_1.tool.mathcfg_count(this.ctx, "zhaocai_kind11");
        // let count1 = tool.mathcfg_count(this.ctx, "zhaocai_kind11");
        if (info.kind11 >= count) {
            this.ctx.throw("今天广告次数用完了");
        }
        // if (info.kind11At + count1 * 60 > this.ctx.state.newTime) {
        //     this.ctx.throw("冷却中");
        // }
        let item = tool_1.tool.mathcfg_item(this.ctx, "zhaocai_buyfree");
        await this.ctx.state.master.subItem1(item);
        info.kind11 += 1;
        // info.kind11At = this.ctx.state.newTime
        info.tili += 1;
        await this.update(info);
    }
    /**
     * 广告下单检查
     */
    async checkUp() {
        let info = await this.getInfo();
        let count = tool_1.tool.mathcfg_count(this.ctx, "zhaocai_kind11");
        let count1 = tool_1.tool.mathcfg_count1(this.ctx, "zhaocai_kind11");
        if (info.kind11 >= count) {
            this.ctx.throw("今天广告次数用完了");
        }
        if (info.kind11At + count1 * 60 > this.ctx.state.newTime) {
            this.ctx.throw("冷却中");
        }
        return {
            type: 1,
            msg: "招财幡广告",
            data: null,
        };
    }
    /**
     * 看广告拉次数
     */
    async carryOut() {
        let info = await this.getInfo();
        let count = tool_1.tool.mathcfg_count(this.ctx, "zhaocai_kind11");
        let count1 = tool_1.tool.mathcfg_count1(this.ctx, "zhaocai_kind11");
        if (info.kind11 >= count) {
            this.ctx.throw("今天广告次数用完了");
        }
        if (info.kind11At + count1 * 60 > this.ctx.state.newTime) {
            this.ctx.throw("冷却中");
        }
        info.kind11 += 1;
        info.kind11At = this.ctx.state.newTime;
        info.tili += 1;
        await this.update(info);
        return {
            type: 1,
            msg: "",
            data: null,
        };
    }
}
exports.ActZhaoCaiModel = ActZhaoCaiModel;
//# sourceMappingURL=ActZhaoCaiModel.js.map