"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SevPaoMaModel = void 0;
const master_1 = require("../../util/master");
const AModel_1 = require("../AModel");
const setting_1 = __importDefault(require("../../crontab/setting"));
/**
 * 跑马灯
 */
class SevPaoMaModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "sev"; //数据库表名
        this.kid = "paoma"; //用于存储key 和  输出1级key
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
            list: {},
            id: 0,
            uuids: {}
        };
    }
    /**
     * 初始化下发 a全下发 (实际只下发最后10~20条)
     */
    async getOutPut() {
        let info = await this.getInfo();
        return info.list;
    }
    /**
     * 初始化下发 u下发
     */
    async getOutPut_u(id) {
        let info = await this.getInfo();
        return info.list[id];
    }
    async addList(pmid, cs) {
        //切换uuid
        let cfgPaoma = setting_1.default.getSetting(this.id, "paoma");
        if (cfgPaoma != null && cfgPaoma[pmid] == 0) {
            return;
        }
        let info = await this.getInfo();
        info.id += 1;
        info.list[info.id] = {
            pmid: pmid,
            cs: cs //跑马灯参数
        };
        if (info.list[info.id - 50] != null) {
            delete info.list[info.id - 50];
        }
        for (const _uuid in info.uuids) {
            if (info.uuids[_uuid] < info.id - 200) {
                delete info.uuids[_uuid]; //太久了 删掉
            }
        }
        await this.update(info, [""]);
    }
    /**
     * 初始化跑马灯
     * @param id
     */
    async backData_login(fuuid) {
        let info = await this.getInfo();
        info.uuids[fuuid] = info.id;
        await this.update(info, [""]);
    }
    /**
     * 获取历史信息
     * @param id
     */
    async backData_history(fuuid) {
        let info = await this.getInfo();
        if (info.uuids[fuuid] == null) {
            info.uuids[fuuid] = info.id;
        }
        let ids = [];
        for (let index = info.uuids[fuuid] + 1; index <= info.id; index++) {
            if (info.list[index] == null) {
                continue;
            }
            ids.push(index.toString());
        }
        info.uuids[fuuid] = info.id;
        await this.update(info, [""]);
        await this.backData_u(ids);
    }
}
exports.SevPaoMaModel = SevPaoMaModel;
//# sourceMappingURL=SevPaoMaModel.js.map