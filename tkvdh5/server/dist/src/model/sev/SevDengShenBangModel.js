"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SevDengShenBangModel = void 0;
const master_1 = require("../../util/master");
const setting_1 = __importDefault(require("../../crontab/setting"));
const gameMethod_1 = require("../../../common/gameMethod");
const game_1 = __importDefault(require("../../util/game"));
const AModel_1 = require("../AModel");
/**
 * 登神榜跨服信息
 * SevDengShenBangModel
 */
class SevDengShenBangModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "sev"; //数据库表名
        this.kid = "dengShenBang"; //用于存储key 和  输出1级key
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
        let cfg = gameMethod_1.gameMethod.objCopy(setting_1.default.getHuodong3("1", "hdDengShenBang", this.hdcid));
        let weekId = game_1.default.getWeekId();
        //hid重置 全部重置
        if (cfg != null && cfg.info.id != info.hdid) {
            info = this.init();
            info.hdid = cfg.info.id;
        }
        if (info.weekId != weekId) {
            //跨周 重新计算服务器开启时间
            info.weekId = weekId;
            //所有合服ID 排列一下
            let hsids = Object.keys(setting_1.default.getHefus());
            //本周的开启时间
            let weekstime = game_1.default.week_0() + (cfg.data.openWeek[0] - 1) * 86400;
            //遍历所有合服ID 设置其活动开启时间与结束时间
            for (let i_hsid = 0; i_hsid < hsids.length; i_hsid++) {
                let _hsid = hsids[i_hsid]; //本合服ID
                if (info.list[_hsid] == null) {
                    info.list[_hsid] = {
                        ksid: "",
                        open: 0,
                        openTime: 0,
                        endTime: 0,
                    };
                }
                //计算出 本合服ID的跨服ID 的下标
                let kid_xb = Math.floor(i_hsid / cfg.data.zoneNum) * cfg.data.zoneNum;
                info.list[_hsid].ksid = hsids[kid_xb]; //跨服ID;
                //获取本服 相对于本周活动开始的 开服天数
                let openDays = 0;
                if (setting_1.default.qufus[info.list[_hsid].ksid] != null) {
                    openDays = Math.floor((weekstime - game_1.default.getToDay_0(setting_1.default.qufus[_hsid].openAt)) / 86400);
                }
                //本周开始时间
                let openTime = game_1.default.week_0() + (cfg.data.openWeek[0] - 1) * 86400 + cfg.data.openHour[0] * 3600 + cfg.data.openHour[1] * 60;
                //本周结束时间
                let endtime = game_1.default.week_0() + (cfg.data.openWeek[1] - 1) * 86400 + cfg.data.endHour[0] * 3600 + cfg.data.endHour[1] * 60;
                if (openDays >= (cfg.data.delayDays - 1)) {
                    info.list[_hsid].open = 1; //活动开启
                }
                else {
                    //未开启活动
                    info.list[_hsid].open = 0; //活动未开启
                    //开启时间调为下周
                    openTime += 86400 * 7;
                    endtime += 86400 * 7;
                }
                info.list[_hsid].openTime = openTime;
                info.list[_hsid].endTime = endtime;
            }
            await this.update(info);
        }
        return info;
    }
    //获取跨服ID  //传入合服ID
    async getKidBySid(hsid) {
        let cfg = gameMethod_1.gameMethod.objCopy(setting_1.default.getHuodong3("1", "hdDengShenBang", this.hdcid));
        if (cfg == null) {
            return {
                ksid: hsid,
                open: 0,
                openTime: 0,
                endTime: 0,
            };
        }
        let info = await this.getInfo();
        if (info.list[hsid] == null) {
            return {
                ksid: hsid,
                open: 0,
                openTime: 0,
                endTime: 0,
            };
        }
        return info.list[hsid];
    }
}
exports.SevDengShenBangModel = SevDengShenBangModel;
//# sourceMappingURL=SevDengShenBangModel.js.map