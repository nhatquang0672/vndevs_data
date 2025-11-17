"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SevLonggongModel = void 0;
const master_1 = require("../../util/master");
const AModel_1 = require("../AModel");
const gameMethod_1 = require("../../../common/gameMethod");
const cache_1 = __importDefault(require("../../util/cache"));
const tool_1 = require("../../util/tool");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
/**
 * 龙宫运宝
 */
class SevLonggongModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "sev"; //数据库表名
        this.kid = "sevLonggong"; //用于存储key 和  输出1级key
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
            time: 0,
            xhuo: {
                fuuid: "",
                fAt: 0 //玩家触发显圣结束时间
            },
            list: {},
            ver: 1 //公共数据更新版本
        };
    }
    async getOutPut() {
        let info = await this.getInfo();
        let xhuo = gameMethod_1.gameMethod.objCopy(info.xhuo);
        if (xhuo.fuuid != "") {
            xhuo.fuser = await cache_1.default.getFUser(this.ctx, xhuo.fuuid, 1);
        }
        return xhuo;
    }
    /**
     * 添加运宝信息
     * @param fuuid
     * @param yun
     */
    async addList(fuuid, yun) {
        let info = await this.getInfo();
        info.list[fuuid] = yun;
        await this.update(info, [""]);
    }
    /**
     * 清除运宝结束
     */
    async clearYunOver() {
        let info = await this.getInfo();
        if (this.ctx.state.newTime < info.time) {
            return;
        }
        info.time = this.ctx.state.newTime + 3600;
        for (const fuuid in info.list) {
            if (info.list[fuuid].ybEat <= this.ctx.state.newTime) {
                delete info.list[fuuid];
            }
        }
        await this.update(info, [""]);
    }
    /**
     * 显圣
     */
    async sevXiansheng(fuuid) {
        let info = await this.getInfo();
        if (info.xhuo.fuuid != "" && info.xhuo.fAt > this.ctx.state.newTime) {
            this.ctx.state.master.addWin("msg", "其他玩家龙王显圣未结束");
            await this.backData();
            return;
        }
        let item = tool_1.tool.mathcfg_item(this.ctx, "longgong_xs_need");
        await this.ctx.state.master.subItem1(item);
        //先结算
        for (const _fuuid in info.list) {
            if (info.list[_fuuid].ybEat <= this.ctx.state.newTime) {
                continue; //结束了
            }
            info.list[_fuuid] = gameMethod_1.gameMethod.longgong_run(info.list[_fuuid], info.xhuo, this.ctx.state.newTime);
        }
        //之前的显圣结束时间
        let oldxsAt = Math.max(info.xhuo.fAt, this.ctx.state.newTime);
        let count1 = tool_1.tool.mathcfg_count1(this.ctx, "longgong_xs_need");
        info.xhuo.fuuid = fuuid;
        info.xhuo.fAt = this.ctx.state.newTime + count1;
        info.ver += 1;
        //现在显圣结束时间
        let newxsAt = info.xhuo.fAt;
        //重新结算 结束时间
        if (newxsAt > oldxsAt) {
            let count = tool_1.tool.mathcfg_count(this.ctx, "longgong_xiansheng");
            for (const _fuuid in info.list) {
                if (info.list[_fuuid].ybEat <= this.ctx.state.newTime) {
                    continue; //结束了
                }
                if (info.list[_fuuid].ybEat <= oldxsAt) {
                    continue; //之前距离全部加速了
                }
                let cfgMiao = gameCfg_1.default.longgongJiaofu.getItemCtx(this.ctx, info.list[_fuuid].jiaofu).miao;
                //加速的我可以走多少距离
                let jsMax = Math.floor((newxsAt - info.list[_fuuid].ybSat) * 100 / count);
                let leftMiao = cfgMiao - info.list[_fuuid].ybpos;
                if (jsMax > leftMiao) {
                    info.list[_fuuid].ybEat = info.list[_fuuid].ybSat + leftMiao / (100 / count);
                }
                else {
                    info.list[_fuuid].ybEat = info.list[_fuuid].ybSat + jsMax / (100 / count);
                    info.list[_fuuid].ybEat += (leftMiao - jsMax);
                }
            }
        }
        await this.update(info);
    }
}
exports.SevLonggongModel = SevLonggongModel;
//# sourceMappingURL=SevLonggongModel.js.map