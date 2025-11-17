"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActDongTianLogModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const gameMethod_1 = require("../../../common/gameMethod");
const cache_1 = __importDefault(require("../../util/cache"));
const ActDongTianModel_1 = require("./ActDongTianModel");
/**
 * 洞天
 */
class ActDongTianLogModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actDongTianLog"; //用于存储key 和  输出1级key
        this.outIsAu = true; //下发数据是否用au下发
        this.dType = master_1.DataType.user;
        /**
         * 添加聊天记录
         * 保留 50 条记录
         */
        this.maxlog = 30;
    }
    //单例模式
    static getInstance(ctx, uuid, hdcid = "1") {
        let dlKey = this.name + "_" + uuid + "_" + hdcid; //单例模式key
        if (!ctx.state.model[dlKey]) {
            ctx.state.model[dlKey] = new this(ctx, uuid, hdcid);
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
        };
    }
    /**
     * 初始化下发 a全下发
     */
    async getOutPut() {
        let info = await this.getInfo();
        let opt = {};
        for (const id in info.list) {
            opt[id] = gameMethod_1.gameMethod.objCopy(info.list[id]);
            if (gameMethod_1.gameMethod.isEmpty(info.list[id].uuid) != true) {
                if (parseInt(info.list[id].uuid) < 100000) {
                    let actDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(this.ctx, this.id);
                    opt[id].user = await actDongTianModel.get_npc_fuser(info.list[id].uuid);
                }
                else {
                    opt[id].user = await cache_1.default.getFUser(this.ctx, info.list[id].uuid, 1);
                }
            }
        }
        return opt;
    }
    /**
     * 下发执行条目
     * @param key
     * @returns
     */
    async getOutPut_u(key) {
        let info = await this.getInfo();
        let opt = gameMethod_1.gameMethod.objCopy(info.list[key]);
        if (gameMethod_1.gameMethod.isEmpty(opt.uuid) != true) {
            if (parseInt(opt.uuid) < 100000) {
                let actDongTianModel = ActDongTianModel_1.ActDongTianModel.getInstance(this.ctx, this.id);
                opt.user = await actDongTianModel.get_npc_fuser(opt.uuid);
            }
            else {
                opt.user = await cache_1.default.getFUser(this.ctx, opt.uuid, 1);
            }
        }
        return opt;
    }
    async add(data) {
        let info = await this.getInfo();
        info.id += 1;
        data.id = info.id;
        info.list[info.id] = data;
        if (info.list[info.id - this.maxlog] != null) {
            delete info.list[info.id - this.maxlog];
        }
        await this.update(info, [info.id.toString()]);
    }
    async addLog(type, carId, fuuid = "", time) {
        await this.add({
            id: 0,
            type: type,
            uuid: fuuid,
            carId: carId,
            time: time,
        });
    }
}
exports.ActDongTianLogModel = ActDongTianLogModel;
//# sourceMappingURL=ActDongTianLogModel.js.map