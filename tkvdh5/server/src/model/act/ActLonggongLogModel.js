"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActLonggongLogModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const cache_1 = __importDefault(require("../../util/cache"));
const lock_1 = __importDefault(require("../../util/lock"));
const SevLonggongModel_1 = require("../sev/SevLonggongModel");
const gameMethod_1 = require("../../../common/gameMethod");
/**
 * 龙宫运宝 - 抢夺日志
 */
class ActLonggongLogModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actLonggongLog"; //用于存储key 和  输出1级key
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
            iid: 0 //日志序号ID
        };
    }
    /**
     * 返回数据
     */
    async getOutPut() {
        let info = await this.getInfo();
        let outf = gameMethod_1.gameMethod.objCopy(info.list);
        let heid = await this.getHeIdByUuid(this.id);
        await lock_1.default.setLock(this.ctx, "sevLonggong", heid);
        let sevLonggongModel = SevLonggongModel_1.SevLonggongModel.getInstance(this.ctx, heid);
        let sevLonggong = await sevLonggongModel.getInfo();
        for (const iid in outf) {
            let fuuid = outf[iid].fuser.uuid;
            if (sevLonggong.list[fuuid] == null || sevLonggong.list[fuuid].ybEat < this.ctx.state.newTime) {
                outf[iid].status = 0;
            }
        }
        return outf;
    }
    async getOutPut_u(iid) {
        let info = await this.getInfo();
        let outf = gameMethod_1.gameMethod.objCopy(info.list[iid]);
        if (info.list[iid] == null) {
            return outf;
        }
        let heid = await this.getHeIdByUuid(this.id);
        await lock_1.default.setLock(this.ctx, "sevLonggong", heid);
        let sevLonggongModel = SevLonggongModel_1.SevLonggongModel.getInstance(this.ctx, heid);
        let sevLonggong = await sevLonggongModel.getInfo();
        let fuuid = outf.fuser.uuid;
        if (sevLonggong.list[fuuid] == null || sevLonggong.list[fuuid].ybEat < this.ctx.state.newTime) {
            outf.status = 0;
        }
        return outf;
    }
    /**
     * 添加日志
     */
    async addList(fuuid, jiaofu, isWin, status) {
        let info = await this.getInfo();
        info.iid += 1;
        info.list[info.iid.toString()] = {
            fuser: await cache_1.default.getFUser(this.ctx, fuuid, 1),
            jiaofu: jiaofu,
            isWin: isWin,
            status: status //0TA不在运宝  1去掠夺   2去复仇  3已复仇 
        };
        await this.update(info, [info.iid.toString()]);
        if (info.list[(info.iid - 20).toString()] != null) {
            delete info.list[(info.iid - 20).toString()];
            await this.update(info, []);
            await this.backData_d([(info.iid - 20).toString()]);
        }
    }
}
exports.ActLonggongLogModel = ActLonggongLogModel;
//# sourceMappingURL=ActLonggongLogModel.js.map