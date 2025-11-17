"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SevAdokModel = void 0;
const master_1 = require("../../util/master");
const AModel_1 = require("../AModel");
const mongodb_1 = require("../../util/mongodb");
/**
 * sev信息 版本号 - 区服
 */
class SevAdokModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "sev"; //数据库表名
        this.kid = "adok"; //用于存储key 和  输出1级key
        this.outIsAu = false; //下发数据是否用au下发
        this.dType = master_1.DataType.sev;
    }
    //单例模式
    static getInstance(ctx, sid, hdcid = "1") {
        let dlKey = this.name + "_" + sid + "_" + hdcid; //单例模式key
        if (!ctx.state.model[dlKey]) {
            ctx.state.model[dlKey] = new this(ctx, sid, hdcid);
        }
        return ctx.state.model[dlKey];
    }
    outKey2() {
        return ""; //输出2级key
    }
    init() {
        return {
            hdChou: {},
            hdCb: {},
            hdChumo: {},
            hdJiYuan: {},
            hdQiYuan: {},
            hdTianGong: {},
            hdTianGongKua: {},
            hdHuanJing: {},
            hdXinMo: {},
            hdLunHui: {},
            hdYueGong: {},
            hdChongYang: {},
            hdShanhe: {},
            hdChargeTotal: {},
            hdDouLuo: {},
            hdDengShenBang: {},
        };
    }
    // async getInfo(): Promise<Info> {
    //     let info = await super.getInfo();
    //     return info;
    // }
    async getOutPut() {
        return null;
    }
    /**
     * 设置九龙秘宝版本号
     */
    async addHdChou(rdsKey, hdcid, hdid, stime) {
        let info = await this.getInfo();
        if (info.hdChou == null) {
            info.hdChou = {};
        }
        //清理过期数据
        for (const rdsKey in info.hdChou) {
            if (this.ctx.state.newTime >= info.hdChou[rdsKey].stime + 86400 * 15) {
                delete info.hdChou[rdsKey];
            }
        }
        info.hdChou[rdsKey] = {
            hdcid: hdcid,
            hdid: hdid,
            stime: stime,
        };
        await this.update(info, [""]);
        await mongodb_1.dbSev.getDataDb().getNextId('A_HDVER'); //更新活动版本号
    }
    /**
     * 设置冲榜版本号
     */
    async addHdCb(rdsKey, hdcid, hdid, stime) {
        let info = await this.getInfo();
        if (info.hdCb == null) {
            info.hdCb = {};
        }
        //清理过期数据
        for (const rdsKey in info.hdCb) {
            if (this.ctx.state.newTime >= info.hdCb[rdsKey].stime + 86400 * 15) {
                delete info.hdCb[rdsKey];
            }
        }
        info.hdCb[rdsKey] = {
            hdcid: hdcid,
            hdid: hdid,
            stime: stime,
        };
        await this.update(info, [""]);
        await mongodb_1.dbSev.getDataDb().getNextId('A_HDVER'); //更新活动版本号
    }
    /**
     * 设置除魔卫道版本号
     */
    async addHdChumo(rdsKey, hdcid, hdid, stime) {
        let info = await this.getInfo();
        if (info.hdChumo == null) {
            info.hdChumo = {};
        }
        //清理过期数据
        for (const rdsKey in info.hdChumo) {
            if (this.ctx.state.newTime >= info.hdChumo[rdsKey].stime + 86400 * 15) {
                delete info.hdChumo[rdsKey];
            }
        }
        info.hdChumo[rdsKey] = {
            hdcid: hdcid,
            hdid: hdid,
            stime: stime,
        };
        await this.update(info, [""]);
        await mongodb_1.dbSev.getDataDb().getNextId('A_HDVER'); //更新活动版本号
    }
    /**
     * 设置机缘活动版本号
     */
    async addHdJiYuan(hdcid, hdid, hid, etime) {
        let info = await this.getInfo();
        if (info.hdJiYuan == null) {
            info.hdJiYuan = {};
        }
        //清理过期数据
        for (const rdsKey in info.hdJiYuan) {
            if (this.ctx.state.newTime >= info.hdJiYuan[rdsKey].etime + 86400 * 15) {
                delete info.hdJiYuan[rdsKey];
            }
        }
        info.hdJiYuan[hdid] = {
            hdcid: hdcid,
            hid: hid,
            etime: etime,
        };
        await this.update(info, [""]);
        await mongodb_1.dbSev.getDataDb().getNextId('A_HDVER'); //更新活动版本号
    }
    /**
     * 设置兽灵起源版本号
     */
    async addHdQiYuan(rdsKey, hdcid, hdid, stime) {
        let info = await this.getInfo();
        if (info.hdQiYuan == null) {
            info.hdQiYuan = {};
        }
        //清理过期数据
        for (const rdsKey in info.hdQiYuan) {
            if (this.ctx.state.newTime >= info.hdQiYuan[rdsKey].stime + 86400 * 15) {
                delete info.hdQiYuan[rdsKey];
            }
        }
        info.hdQiYuan[rdsKey] = {
            hdcid: hdcid,
            hdid: hdid,
            stime: stime,
        };
        await this.update(info, [""]);
        await mongodb_1.dbSev.getDataDb().getNextId('A_HDVER'); //更新活动版本号
    }
    /**
     * 设置天宫乐舞版本号
     */
    async addHdTianGong(rdsKey, hdcid, hdid, stime) {
        let info = await this.getInfo();
        if (info.hdTianGong == null) {
            info.hdTianGong = {};
        }
        //清理过期数据
        for (const rdsKey in info.hdTianGong) {
            if (this.ctx.state.newTime >= info.hdTianGong[rdsKey].stime + 86400 * 15) {
                delete info.hdTianGong[rdsKey];
            }
        }
        info.hdTianGong[rdsKey] = {
            hdcid: hdcid,
            hdid: hdid,
            stime: stime,
        };
        await this.update(info, [""]);
        await mongodb_1.dbSev.getDataDb().getNextId('A_HDVER'); //更新活动版本号
    }
    /**
     * 设置天宫乐舞 跨服 版本号
     */
    async addHdTianGongKua(rdsKey, hdcid, hdid, stime) {
        let info = await this.getInfo();
        if (info.hdTianGongKua == null) {
            info.hdTianGongKua = {};
        }
        //清理过期数据
        for (const rdsKey in info.hdTianGongKua) {
            if (this.ctx.state.newTime >= info.hdTianGongKua[rdsKey].stime + 86400 * 15) {
                delete info.hdTianGongKua[rdsKey];
            }
        }
        info.hdTianGongKua[rdsKey] = {
            hdcid: hdcid,
            hdid: hdid,
            stime: stime,
        };
        await this.update(info, [""]);
        await mongodb_1.dbSev.getDataDb().getNextId('A_HDVER'); //更新活动版本号
    }
    /**
     * 设置兽灵起源版本号
     */
    async addHdHuanJing(rdsKey, hdcid, hdid, stime) {
        let info = await this.getInfo();
        if (info.hdHuanJing == null) {
            info.hdHuanJing = {};
        }
        //清理过期数据
        for (const rdsKey in info.hdHuanJing) {
            if (this.ctx.state.newTime >= info.hdHuanJing[rdsKey].stime + 86400 * 15) {
                delete info.hdHuanJing[rdsKey];
            }
        }
        info.hdHuanJing[rdsKey] = {
            hdcid: hdcid,
            hdid: hdid,
            stime: stime,
        };
        await this.update(info, [""]);
        await mongodb_1.dbSev.getDataDb().getNextId('A_HDVER'); //更新活动版本号
    }
    /**
     * 设置破除心魔版本号
     */
    async addHdXinMo(rdsKey, hdcid, hdid, stime) {
        let info = await this.getInfo();
        if (info.hdXinMo == null) {
            info.hdXinMo = {};
        }
        //清理过期数据
        for (const rdsKey in info.hdXinMo) {
            if (this.ctx.state.newTime >= info.hdXinMo[rdsKey].stime + 86400 * 15) {
                delete info.hdXinMo[rdsKey];
            }
        }
        info.hdXinMo[rdsKey] = {
            hdcid: hdcid,
            hdid: hdid,
            stime: stime,
        };
        await this.update(info, [""]);
        await mongodb_1.dbSev.getDataDb().getNextId('A_HDVER'); //更新活动版本号
    }
    /**
     * 设置 天道轮回 活动版本号
     */
    async addHdLunHui(hdcid, hdid, hid, etime) {
        let info = await this.getInfo();
        if (info.hdLunHui == null) {
            info.hdLunHui = {};
        }
        //清理过期数据
        for (const rdsKey in info.hdLunHui) {
            if (this.ctx.state.newTime >= info.hdLunHui[rdsKey].etime + 86400 * 15) {
                delete info.hdLunHui[rdsKey];
            }
        }
        info.hdLunHui[hdid] = {
            hdcid: hdcid,
            hid: hid,
            etime: etime,
        };
        await this.update(info, [""]);
        await mongodb_1.dbSev.getDataDb().getNextId('A_HDVER'); //更新活动版本号
    }
    /**
     * 设置 月宫探宝 活动版本号
     */
    async addHdYueGong(hdcid, hdid, hid, etime) {
        let info = await this.getInfo();
        if (info.hdYueGong == null) {
            info.hdYueGong = {};
        }
        //清理过期数据
        for (const rdsKey in info.hdYueGong) {
            if (this.ctx.state.newTime >= info.hdYueGong[rdsKey].etime + 86400 * 15) {
                delete info.hdYueGong[rdsKey];
            }
        }
        info.hdYueGong[hdid] = {
            hdcid: hdcid,
            hid: hid,
            etime: etime,
        };
        await this.update(info, [""]);
        await mongodb_1.dbSev.getDataDb().getNextId('A_HDVER'); //更新活动版本号
    }
    /**
     * 设置 重阳出游 活动版本号
     */
    async addHdChongYang(hdcid, hdid, hid, etime) {
        let info = await this.getInfo();
        if (info.hdChongYang == null) {
            info.hdChongYang = {};
        }
        //清理过期数据
        for (const rdsKey in info.hdChongYang) {
            if (this.ctx.state.newTime >= info.hdChongYang[rdsKey].etime + 86400 * 15) {
                delete info.hdChongYang[rdsKey];
            }
        }
        info.hdChongYang[hdid] = {
            hdcid: hdcid,
            hid: hid,
            etime: etime,
        };
        await this.update(info, [""]);
        await mongodb_1.dbSev.getDataDb().getNextId('A_HDVER'); //更新活动版本号
    }
    /**
     * 设置 山河庆典 活动版本号
     */
    async addHdShanhe(hdcid, hdid, hid, etime) {
        let info = await this.getInfo();
        if (info.hdShanhe == null) {
            info.hdShanhe = {};
        }
        //清理过期数据
        for (const rdsKey in info.hdShanhe) {
            if (this.ctx.state.newTime >= info.hdShanhe[rdsKey].etime + 86400 * 15) {
                delete info.hdShanhe[rdsKey];
            }
        }
        info.hdShanhe[hdid] = {
            hdcid: hdcid,
            hid: hid,
            etime: etime,
        };
        await this.update(info, [""]);
        await mongodb_1.dbSev.getDataDb().getNextId('A_HDVER'); //更新活动版本号
    }
    /**
     * 设置 累计充值礼包  活动版本号
     */
    async addHdChargeTotal(hdcid, hdid, hid, etime) {
        let info = await this.getInfo();
        if (info.hdChargeTotal == null) {
            info.hdChargeTotal = {};
        }
        //清理过期数据
        for (const rdsKey in info.hdChargeTotal) {
            if (this.ctx.state.newTime >= info.hdChargeTotal[rdsKey].etime + 86400 * 15) {
                delete info.hdChargeTotal[rdsKey];
            }
        }
        info.hdChargeTotal[hdid] = {
            hdcid: hdcid,
            hid: hid,
            etime: etime,
        };
        await this.update(info, [""]);
        await mongodb_1.dbSev.getDataDb().getNextId('A_HDVER'); //更新活动版本号
    }
    /**
     * 设置 最强斗罗  活动版本号
     */
    async addHdDouLuo(hdcid_dayid, hdcid, hid, etime, kuaid) {
        let info = await this.getInfo();
        if (info.hdDouLuo == null) {
            info.hdDouLuo = {};
        }
        //清理过期数据
        for (const rdsKey in info.hdDouLuo) {
            if (this.ctx.state.newTime >= info.hdDouLuo[rdsKey].etime + 86400 * 15) {
                delete info.hdDouLuo[rdsKey];
            }
        }
        info.hdDouLuo[hdcid_dayid] = {
            hdid: hid,
            hdcid: hdcid,
            etime: etime,
            kuaid: kuaid
        };
        await this.update(info, [""]);
        await mongodb_1.dbSev.getDataDb().getNextId('A_HDVER'); //更新活动版本号
    }
    /**
     * 设置 登神榜  活动版本号
     * @param rdsKey 排行榜key
     * @param hdcid 活动分组ID 后台配置的
     * @param hid 活动ID 后台配置的
     * @param etime 奖励过期时间
     * @param kuaid 跨服ID
     */
    async addDengShenBang(rdsKey, hdcid, hid, etime, kuaid) {
        let info = await this.getInfo();
        if (info.hdDengShenBang == null) {
            info.hdDengShenBang = {};
        }
        //清理过期数据
        for (const rdsKey in info.hdDengShenBang) {
            if (this.ctx.state.newTime >= info.hdDengShenBang[rdsKey].etime + 86400 * 15) {
                delete info.hdDengShenBang[rdsKey];
            }
        }
        info.hdDengShenBang[rdsKey] = {
            hdid: hid,
            hdcid: hdcid,
            etime: etime,
            kuaid: kuaid
        };
        await this.update(info, [""]);
        await mongodb_1.dbSev.getDataDb().getNextId('A_HDVER'); //更新活动版本号
    }
}
exports.SevAdokModel = SevAdokModel;
//# sourceMappingURL=SevAdokModel.js.map