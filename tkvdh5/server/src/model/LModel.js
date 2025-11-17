"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LModel = void 0;
const master_1 = require("../util/master");
const redis_1 = require("../util/redis");
const mongodb_1 = require("../util/mongodb");
const gameMethod_1 = require("../../common/gameMethod");
/**
 * 列表存储类基类
 */
class LModel {
    /**
     * 构造函数
     * @param id
     */
    constructor(ctx, id) {
        this.ctx = ctx;
        this.id = id;
    }
    //获取缓存1级key
    getKey1() {
        if (this.id == null) {
            this.ctx.throw("getKey1_err");
        }
        return this.dType + '_' + this.id;
    }
    //获取列表key
    getKey2() {
        if (this.kid == null) {
            this.ctx.throw("getKey2_err");
        }
        return this.table + '_' + this.kid + '_list';
    }
    //返回数据
    async backData() {
        let outPut = await this.getOutPut();
        if (outPut == null) {
            return;
        }
        let outf = {};
        outf[this.kid] = {};
        let _key2 = this.outKey2();
        if (_key2 != "") {
            outf[this.kid][_key2] = {};
            outf[this.kid][_key2]["a"] = outPut;
        }
        else {
            outf[this.kid]["a"] = outPut;
        }
        if (this.dType == master_1.DataType.user && this.ctx.state.uuid != null && this.id != this.ctx.state.uuid) {
            this.ctx.state.master.addfBackBuf(this.id, outf);
        }
        else {
            this.ctx.state.master.addBackBuf(outf);
        }
    }
    //u下发
    async backData_u(keys) {
        if (keys.length < 1) {
            return;
        }
        let outf = {};
        outf[this.kid] = {};
        let _key2 = this.outKey2();
        for (const key of keys) {
            let outPut = await this.getOutPut_u(key);
            if (outPut == null) {
                continue;
            }
            if (_key2 != "") {
                if (outf[this.kid][_key2] == null) {
                    outf[this.kid][_key2] = {};
                }
                if (outf[this.kid][_key2]["u"] == null) {
                    outf[this.kid][_key2]["u"] = {};
                }
                outf[this.kid][_key2]["u"][key] = outPut;
            }
            else {
                if (outf[this.kid]["u"] == null) {
                    outf[this.kid]["u"] = {};
                }
                outf[this.kid]["u"][key] = outPut;
            }
        }
        if (this.dType == master_1.DataType.user && this.ctx.state.uuid != null && this.id != this.ctx.state.uuid) {
            this.ctx.state.master.addfBackBuf(this.id, outf);
        }
        else {
            this.ctx.state.master.addBackBuf(outf);
        }
    }
    //d下发
    async backData_d(keys) {
        if (keys.length < 1) {
            return;
        }
        let outf = {};
        outf[this.kid] = {};
        let _key2 = this.outKey2();
        if (_key2 != "") {
            outf[this.kid][this.outKey2()] = {};
            outf[this.kid][this.outKey2()]["d"] = {};
            for (const key of keys) {
                outf[this.kid][this.outKey2()]["d"][key] = true;
            }
        }
        else {
            outf[this.kid]["d"] = {};
            for (const key of keys) {
                outf[this.kid]["d"][key] = true;
            }
        }
        if (this.dType == master_1.DataType.user && this.ctx.state.uuid != null && this.id != this.ctx.state.uuid) {
            this.ctx.state.master.addfBackBuf(this.id, outf);
        }
        else {
            this.ctx.state.master.addBackBuf(outf);
        }
    }
    /**
     * 从数据库获取列表信息
     */
    async getInfoList() {
        let infoList = this.ctx.state.master.getInfo(this.getKey1(), this.getKey2());
        if (infoList != null) {
            return infoList;
        }
        infoList = await redis_1.redisSev.getRedis(this.dType).hGet(this.getKey1(), this.getKey2());
        if (gameMethod_1.gameMethod.isEmpty(infoList) == true) {
            infoList = {};
            let dbList = await this._getInfoFromDb();
            for (const one of dbList) {
                infoList[one.hdcid] = one.data;
            }
            if (gameMethod_1.gameMethod.isEmpty(infoList) == false) {
                this.ctx.state.master.addSave(this.getKey1(), this.getKey2(), infoList);
            }
        }
        this.ctx.state.master.setInfo(this.getKey1(), this.getKey2(), infoList);
        return infoList;
    }
    /**
     * 从缓存获取用户信息
     */
    async getInfo(xbid) {
        let list = await this.getInfoList();
        return list[xbid.toString()];
    }
    /**
     * 从数据库获取用户信息
     */
    async _getInfoFromDb() {
        let result = await mongodb_1.dbSev.getDataDb().find(this.table, {
            id: this.id.toString(),
            kid: this.kid.toString()
        });
        return result;
    }
    //所有更新 必须经过这个函数
    async update(xbid, info, isBack = true) {
        let list = await this.getInfoList();
        list[xbid.toString()] = info;
        this.ctx.state.master.setInfo(this.getKey1(), this.getKey2(), list);
        this.ctx.state.master.addSave_u(this.getKey1(), this.getKey2(), xbid.toString(), list[xbid.toString()]);
        if (isBack) {
            await this.backData_u([xbid.toString()]);
        }
    }
}
exports.LModel = LModel;
//# sourceMappingURL=LModel.js.map