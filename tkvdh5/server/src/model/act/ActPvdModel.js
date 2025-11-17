"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActPvdModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const game_1 = __importDefault(require("../../util/game"));
const gameMethod_1 = require("../../../common/gameMethod");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const fight_1 = require("../../../common/fight");
const UserModel_1 = require("../user/UserModel");
const SevPvdModel_1 = require("../sev/SevPvdModel");
const RdsUserModel_1 = require("../redis/RdsUserModel");
const setting_1 = __importDefault(require("../../crontab/setting"));
const MailModel_1 = require("../user/MailModel");
const hook_1 = require("../../util/hook");
const tool_1 = require("../../util/tool");
/**
 * 每日挑战
 */
class ActPvdModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actPvd"; //用于存储key 和  输出1级key
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
            ver: 1,
            time: this.ctx.state.new0 + 86400,
            maxHit: 0,
            tili: 3,
            lastAt: this.ctx.state.newTime,
            start: {
                from: "",
                seed: 0,
                teams: {}
            },
            end: {
                win: 0,
                items: [],
                hurt: 0 //本次伤害
            },
            hfVer: "",
            bug: 1
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        if (info.ver != 1) {
            info = this.init();
        }
        if (info.time + 86400 * 13 < this.ctx.state.new0) {
            info = this.init(); //13天 没有上线  ，直接重置
        }
        let isUpdate = false;
        if (info.hfVer == null) {
            info.hfVer = "";
        }
        let heid = await this.getHeIdByUuid(this.id);
        let cfgSysHefu = setting_1.default.getSetting("1", "sys_hefu");
        if (cfgSysHefu != null && cfgSysHefu.list[heid] != null) {
            let hfAt = cfgSysHefu.list[heid].newVer;
            if (info.hfVer != hfAt) {
                info.hfVer = hfAt;
                info.tili = 3;
                isUpdate = true;
                heid = cfgSysHefu.list[heid].oldSid;
            }
        }
        //每日更新
        if (this.ctx.state.newTime >= info.time) {
            //查看奖励是否领取到
            let dayRwd = setting_1.default.getSysRwds(heid, 'pvdDay', game_1.default.getTodayId(info.time - 86400), this.ctx.state.newTime);
            if (dayRwd != null) { //如果为空需要等待奖励到达
                if (dayRwd[this.id] != null) {
                    let rid = dayRwd[this.id][0];
                    let cfgpvdPool = gameCfg_1.default.dailybossRankrwd.pool;
                    for (const key in cfgpvdPool) {
                        if (rid >= cfgpvdPool[key].start && rid <= cfgpvdPool[key].end) {
                            let title = "每日挑战奖励";
                            let content = `恭喜您在每日挑战中表现优异，获得第${rid}名，以下为您的奖励，请注意查收。`;
                            let mailModel = MailModel_1.MailModel.getInstance(this.ctx, this.id);
                            await mailModel.sendMail(title, content, cfgpvdPool[key].rwd, 1, info.time);
                            break;
                        }
                    }
                }
                info = this.init();
                isUpdate = true;
            }
            //10天前的 没用获得奖励，就直接重置了
            if (info.time < this.ctx.state.new0 - 864000) {
                info = this.init();
                isUpdate = true;
            }
        }
        if (info.lastAt < this.ctx.state.new0 + 3600 * 12 && this.ctx.state.newTime >= this.ctx.state.new0 + 3600 * 12) {
            info.lastAt = this.ctx.state.new0 + 3600 * 12;
            info.tili += 1;
            isUpdate = true;
        }
        if (info.lastAt < this.ctx.state.new0 + 3600 * 18 && this.ctx.state.newTime >= this.ctx.state.new0 + 3600 * 18) {
            info.lastAt = this.ctx.state.new0 + 3600 * 18;
            info.tili += 1;
            isUpdate = true;
        }
        info.tili = Math.min(info.tili, 3);
        if (info.bug != 1 && parseInt(this.ctx.state.sid) < 75) {
            info.bug = 1;
            let rdsUserModel = await new RdsUserModel_1.RdsUserModel("rdsPvd", 'x', await this.getHeIdByUuid(this.id), game_1.default.getTodayId(this.ctx.state.newTime));
            await rdsUserModel.zSet(this.id, info.maxHit);
            isUpdate = true;
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
        let nextAt = this.ctx.state.new0 + 86400;
        if (info.lastAt < this.ctx.state.new0 + 3600 * 18) {
            nextAt = this.ctx.state.new0 + 3600 * 18;
        }
        if (info.lastAt < this.ctx.state.new0 + 3600 * 12) {
            nextAt = this.ctx.state.new0 + 3600 * 12;
        }
        return {
            maxHit: info.maxHit,
            maxTili: 3,
            tili: info.tili,
            nextAt: nextAt,
            start: info.start,
            end: info.end
        };
    }
    /**
    *  开启一场战斗
    */
    async fight_one() {
        let info = await this.getInfo();
        if (this.ctx.state.newTime >= info.time - 300) {
            this.ctx.throw("排行奖励结算中...");
        }
        if (info.tili <= 0) {
            this.ctx.throw("无挑战次数");
        }
        info.tili -= 1;
        //创建对战阵容 
        let userModel = UserModel_1.UserModel.getInstance(this.ctx, this.id);
        let gStart = await userModel.getFightEps();
        //敌方阵容
        let sevPvdModel = SevPvdModel_1.SevPvdModel.getInstance(this.ctx, await this.getHeIdByUuid(this.id));
        let pkid = (await sevPvdModel.getInfo()).pkid.toString();
        //敌方阵容
        let cfgdaily = gameCfg_1.default.dailybossInfo.getItemCtx(this.ctx, pkid);
        let cfgList = gameCfg_1.default.dailybossKuRwdList.getItemListCtx(this.ctx, cfgdaily.kuid);
        let cfgMon = gameCfg_1.default.monDaildboss.getItemCtx(this.ctx, cfgdaily.monid);
        let feps = gameMethod_1.gameMethod.ep_merge(gameMethod_1.gameMethod.ep_init(), cfgMon.eps);
        // let max_hp = 0
        // for (const cl of cfgList) {
        //     max_hp += cl.hurt
        // }
        // feps.hp_max = max_hp
        // feps.hp = max_hp
        info.start = {
            from: "pvd",
            seed: game_1.default.rand(1, 65535),
            teams: {
                "10": {
                    fid: this.id,
                    zhanwei: 0,
                    eps: gStart.eps,
                    level: 0,
                    wxSk: gStart.wxSk,
                    isnq: gStart.isnq,
                    jgSk: gStart.jgSk //精怪技能
                },
                "20": {
                    fid: cfgdaily.monid,
                    zhanwei: 0,
                    eps: feps,
                    level: 0,
                    wxSk: {},
                    isnq: 0,
                    jgSk: {} //精怪技能
                },
            }
        };
        //战斗
        let fight = new fight_1.Fight(info.start);
        //记录战斗日志
        tool_1.tool.addFightTeam(this.ctx, info.start);
        info.end.win = 1;
        info.end.items = [];
        info.end.hurt = fight.get_hurt();
        let allHit = info.end.hurt;
        for (const list of cfgList) {
            if (allHit < list.hurt) {
                break;
            }
            allHit -= list.hurt;
            for (const _item of list.items) {
                info.end.items.push([_item[0], _item[1], game_1.default.rand(_item[2], _item[3])]);
            }
        }
        info.end.items = game_1.default.mergeArr(info.end.items);
        info.maxHit += info.end.hurt;
        //上榜
        let rdsUserModel = await new RdsUserModel_1.RdsUserModel("rdsPvd", 'x', await this.getHeIdByUuid(this.id), game_1.default.getTodayId(this.ctx.state.newTime));
        await rdsUserModel.zSet(this.id, info.maxHit);
        if (info.end.items.length > 0) {
            await this.ctx.state.master.addItem2(info.end.items, "");
        }
        await this.update(info);
        await hook_1.hookNote(this.ctx, "pvdPk", 1);
    }
}
exports.ActPvdModel = ActPvdModel;
//# sourceMappingURL=ActPvdModel.js.map