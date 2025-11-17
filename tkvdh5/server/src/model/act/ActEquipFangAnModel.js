"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActEquipFangAnModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const gameMethod_1 = require("../../../common/gameMethod");
const tool_1 = require("../../util/tool");
const ActEquipModel_1 = require("./ActEquipModel");
/**
 * 装备方案
 */
class ActEquipFangAnModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actEquipFangAn"; //用于存储key 和  输出1级key
        this.outIsAu = false; //下发数据是否用au下发
        this.dType = master_1.DataType.user;
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
    //初始化
    init() {
        return {
            list: {},
            nowFangan: ""
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        if (info.nowFangan != "") {
            return info;
        }
        let item = tool_1.tool.mathcfg_item(this.ctx, "equip_fangan_need");
        let kk = 0;
        for (const need of item) {
            if (need == 0) {
                kk++;
                info.list[kk.toString()] = {
                    name: "",
                    chuan: {}
                };
            }
        }
        info.nowFangan = "1";
        return info;
    }
    /**
     * 返回数据
     */
    async getOutPut() {
        let info = await this.getInfo();
        return info;
    }
    /**
     * 进入方案列表
     */
    async intoList() {
        let info = await this.getInfo();
        if (info.list[info.nowFangan] == null) {
            this.ctx.throw("数据异常");
        }
        let actEquipModel = ActEquipModel_1.ActEquipModel.getInstance(this.ctx, this.id);
        let actEquip = await actEquipModel.getInfo();
        info.list[info.nowFangan].chuan = gameMethod_1.gameMethod.objCopy(actEquip.chuan);
        await this.update(info);
    }
    /**
     * 设置方案标题
     * @param faid 方案id
     * @param name 方案名字
     */
    async setFname(faid, name) {
        let info = await this.getInfo();
        if (info.list[faid] == null) {
            this.ctx.throw("未解锁");
        }
        info.list[faid].name = name;
        await this.update(info);
    }
    /**
     * 设置使用方案
     * @param faid 方案id
     */
    async setChuan(faid) {
        let info = await this.getInfo();
        if (info.list[faid] == null) {
            this.ctx.throw("未解锁");
        }
        if (info.nowFangan == faid) {
            this.ctx.throw("已设置");
        }
        info.nowFangan = faid;
        await this.update(info);
        let actEquipModel = ActEquipModel_1.ActEquipModel.getInstance(this.ctx, this.id);
        let actEquip = await actEquipModel.getInfo();
        actEquip.chuan = gameMethod_1.gameMethod.objCopy(info.list[info.nowFangan].chuan);
        await actEquipModel.update(actEquip);
    }
    /**
     * 解锁方案格子
     */
    async buyGz() {
        let info = await this.getInfo();
        let len = Object.keys(info.list).length;
        let item = tool_1.tool.mathcfg_item(this.ctx, "equip_fangan_need");
        if (item[len] == null) {
            this.ctx.throw("无方案可购买");
        }
        if (item[len] > 0) {
            await this.ctx.state.master.subItem1([1, 1, item[len]]);
        }
        info.list[(len + 1).toString()] = {
            name: "",
            chuan: {}
        };
        await this.update(info);
    }
}
exports.ActEquipFangAnModel = ActEquipFangAnModel;
//# sourceMappingURL=ActEquipFangAnModel.js.map