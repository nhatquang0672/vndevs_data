"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActChengHModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const gameMethod_1 = require("../../../common/gameMethod");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const ActTaskKindModel_1 = require("./ActTaskKindModel");
const tool_1 = require("../../util/tool");
const MailModel_1 = require("../user/MailModel");
/**
 * 称号
 */
class ActChengHModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actChengH"; //用于存储key 和  输出1级key
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
        return {
            list: { "1": { red: 0, at: 0, gq: 0 } },
            chuan: "1",
            getId: "1",
            hook: {},
            buy174: 0,
            //龙宫
            buy175: 0,
            buy176: 0,
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        let isUpdate = false;
        for (const chid in info.list) {
            if (info.list[chid].at == 0) {
                continue;
            }
            if (info.list[chid].at > this.ctx.state.newTime) {
                if (info.list[chid].gq == null) {
                    info.list[chid].gq = 0;
                }
                if (info.list[chid].gq > 0) {
                    continue;
                }
                if (info.list[chid].at < this.ctx.state.newTime + 86400) {
                    info.list[chid].gq = 1;
                    let cfg = gameCfg_1.default.chenghaoInfo.getItemCtx(this.ctx, chid);
                    let mailModel = MailModel_1.MailModel.getInstance(this.ctx, this.id);
                    await mailModel.sendMail("称号过期提示", `您的称号<${cfg.name}>即将在1天后到期，到期后属性将不再生效，请知悉。`, [], 0, info.list[chid].at - 86400);
                    isUpdate = true;
                }
                continue;
            }
            delete info.list[chid];
            if (info.chuan == chid) {
                info.chuan = info.getId;
            }
        }
        if (info.buy174 == null) {
            info.buy174 = 0;
        }
        if (info.buy175 == null) {
            info.buy175 = 0;
        }
        if (info.buy176 == null) {
            info.buy176 = 0;
        }
        if (isUpdate == true) {
            await this.update(info, [""]);
        }
        return info;
    }
    /**
     * 返回数据
     */
    async getOutPut() {
        let info = await this.getInfo();
        return info;
    }
    //每次登陆重新刷一下任务
    async loginReSet() {
        //获取新的钩子
        let isUpdate = false;
        let info = await this.getInfo();
        let cfgNext = gameCfg_1.default.chenghaoInfo.getItem((parseInt(info.getId) + 1).toString());
        if (cfgNext != null && gameMethod_1.gameMethod.isEmpty(cfgNext.locks) == false) {
            let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(this.ctx, this.id);
            let actTaskKind = await actTaskKindModel.getInfo();
            for (const _kind in cfgNext.locks) {
                if (actTaskKind.nids[_kind] == null) {
                    continue;
                }
                if (actTaskKind.nids[_kind] > 0 && info.hook[_kind] != actTaskKind.nids[_kind]) {
                    info.hook[_kind] = actTaskKind.nids[_kind];
                    isUpdate = true;
                }
            }
        }
        if (isUpdate) {
            await this.update(info);
        }
    }
    //完成晋升领取奖励
    async rwd() {
        let info = await this.getInfo();
        let cfg = gameCfg_1.default.chenghaoInfo.getItem(info.getId);
        if (cfg == null) {
            this.ctx.throw("无称号可解锁!");
            return;
        }
        let cfgNext = gameCfg_1.default.chenghaoInfo.getItem((parseInt(info.getId) + 1).toString());
        if (cfgNext == null) {
            this.ctx.throw("无称号可解锁");
            return;
        }
        if (gameMethod_1.gameMethod.isEmpty(cfgNext.locks) == true) {
            this.ctx.throw("无奖励可领取");
        }
        if (info.list[cfgNext.getId] != null) {
            this.ctx.throw("奖励已领取");
        }
        for (const tjid in cfgNext.locks) {
            if (info.hook[tjid] == null || cfg.locks[tjid] > info.hook[tjid]) {
                this.ctx.throw("任务未完成");
            }
        }
        await this.ctx.state.master.addItem2(cfg.items);
        info.getId = cfg.getId;
        info.hook = {};
        if (cfgNext != null) {
            info.list[cfg.getId] = {
                red: 1,
                at: 0,
                gq: 0
            };
        }
        //获取新的钩子
        cfgNext = gameCfg_1.default.chenghaoInfo.getItem((parseInt(info.getId) + 1).toString());
        if (cfgNext != null && gameMethod_1.gameMethod.isEmpty(cfgNext.locks) == false) {
            let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(this.ctx, this.id);
            let actTaskKind = await actTaskKindModel.getInfo();
            for (const _kind in cfgNext.locks) {
                if (actTaskKind.nids[_kind] != null) {
                    info.hook[_kind] = actTaskKind.nids[_kind];
                }
            }
        }
        await this.update(info);
    }
    /**
     * 佩戴
     * @param chid 称号ID
     */
    async peidai(chid) {
        let info = await this.getInfo();
        if (info.list[chid] == null) {
            this.ctx.throw("未获取该称号");
        }
        info.chuan = chid;
        await this.update(info);
    }
    /**
     * 获取称号
     * @param chid 称号ID
     */
    async addCh(chid) {
        let cfg = gameCfg_1.default.chenghaoInfo.getItemCtx(this.ctx, chid);
        let info = await this.getInfo();
        let at = 0;
        if (cfg.sxTime > 0) {
            at = this.ctx.state.newTime + cfg.sxTime * 86400;
        }
        if (chid == "174") {
            info.buy174 += 1;
        }
        info.list[chid] = {
            red: 1,
            at: at,
            gq: 0
        };
        await this.update(info);
        await this.ctx.state.master.addWin("msg", `获取${cfg.name}称号`);
        this.ctx.state.master.addLog(5, chid, 1, 1);
        //购买174称号 5次 发邮件送157
        if (info.buy174 >= 5 && info.list["157"] == null) {
            let mailModel = MailModel_1.MailModel.getInstance(this.ctx, this.id);
            await mailModel.sendMail("机缘称号激活", `恭喜你，成功激活了<天赐仙缘>称号，请及时领取。`, [[5, 157, 1]]);
        }
    }
    /**
     * 接收任务统计
     */
    async addHook(kind, count) {
        let info = await this.getInfo();
        let cfg = gameCfg_1.default.chenghaoInfo.getItem((parseInt(info.getId) + 1).toString());
        if (cfg != null) {
            if (cfg.locks[kind] == null) {
                return;
            }
            if (info.hook[kind] == null) {
                info.hook[kind] = 0;
            }
            info.hook[kind] += count;
            await this.update(info);
        }
    }
    /**
     * 刷新任务统计
     */
    async refreshHook(kind, count) {
        let info = await this.getInfo();
        let cfg = gameCfg_1.default.chenghaoInfo.getItem((parseInt(info.getId) + 1).toString());
        if (cfg != null) {
            if (cfg.locks[kind] == null) {
                return;
            }
            info.hook[kind] = count;
            await this.update(info);
        }
    }
    /**
     * 删除称号红点
     * @param chid 称号ID
     */
    async delRed(chid) {
        let info = await this.getInfo();
        if (info.list[chid] == null) {
            this.ctx.throw("未获取该称号");
        }
        info.list[chid].red = 0;
        await this.update(info);
    }
    /**
     * 龙宫个人显圣次数
     * type 1个人  2公会
     */
    async addXsCount(type) {
        let count = tool_1.tool.mathcfg_count(this.ctx, "longgong_chengh");
        let count1 = tool_1.tool.mathcfg_count1(this.ctx, "longgong_chengh");
        let info = await this.getInfo();
        if (type == 1) {
            if (count < info.buy175) {
                return;
            }
            info.buy175 += 1;
            if (count == info.buy175 && info.list["175"] == null) {
                //发邮件
                let mailModel = MailModel_1.MailModel.getInstance(this.ctx, this.id);
                await mailModel.sendMail("龙宫运宝称号奖励", `多次激活龙王显圣，获得称号奖励，请及时查看。`, [[5, 175, 1]]);
            }
        }
        if (type == 2) {
            if (count1 < info.buy176) {
                return;
            }
            info.buy176 += 1;
            if (count1 == info.buy176 && info.list["176"] == null) {
                //发邮件
                let mailModel = MailModel_1.MailModel.getInstance(this.ctx, this.id);
                await mailModel.sendMail("龙王仙盟称号奖励", `您所在的仙盟多次激活龙王显圣，仙盟成员获得称号奖励，请及时查看。`, [[5, 176, 1]]);
            }
        }
        await this.update(info);
    }
}
exports.ActChengHModel = ActChengHModel;
//# sourceMappingURL=ActChengHModel.js.map