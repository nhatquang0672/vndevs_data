"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SevClubModel = void 0;
const master_1 = require("../../util/master");
const AModel_1 = require("../AModel");
const tool_1 = require("../../util/tool");
const SevAdokClubModel_1 = require("./SevAdokClubModel");
const SevClubMemberModel_1 = require("./SevClubMemberModel");
const cache_1 = __importDefault(require("../../util/cache"));
const setting_1 = __importDefault(require("../../crontab/setting"));
const nameCheck_1 = require("../../util/nameCheck");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
/**
 * 仙盟信息
 */
class SevClubModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "sev"; //数据库表名
        this.kid = "club"; //用于存储key 和  输出1级key
        this.outIsAu = false; //下发数据是否用au下发
        this.dType = master_1.DataType.sev;
    }
    //单例模式
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
            //仙盟基础数据
            uuid: "",
            sid: "",
            name: "",
            // reNameTime: number; //仙盟下次改名时间
            notice: "",
            applyLevelNeed: 0,
            applyAuto: 1,
            canselect: 1,
            createTime: 0,
            rstMstTime: 0,
            outTime: 0,
            cash_memberCount: 0,
            cash_active: 0,
            boss: {
                unlock: 1,
                md1220: 0,
                open: 0,
                hurt: 0,
                kill: "",
            },
            hfVer: "",
            gmNum: 0,
            lgLv: 1,
            lgExp: 0,
        };
    }
    async getOutPut() {
        let info = await this.getInfo();
        let out = {
            //仙盟基础数据
            id: this.id,
            mUser: await cache_1.default.getFUser(this.ctx, info.uuid, 1),
            uuid: info.uuid,
            sid: info.sid,
            name: info.name,
            // reNameTime: info., //仙盟下次改名时间
            notice: info.notice,
            applyLevelNeed: info.applyLevelNeed,
            applyAuto: info.applyAuto,
            canselect: info.canselect,
            createTime: info.createTime,
            rstMstTime: info.rstMstTime,
            // 0 点时间戳 //下次需要重算的时间 //前端倒计时刷新时间
            outTime: info.outTime,
            memberCount: info.cash_memberCount,
            active: info.cash_active,
            boss: info.boss,
            gmNum: info.gmNum,
            lgLv: info.lgLv,
            lgExp: info.lgExp,
        };
        return out;
    }
    async getInfo() {
        let info = await super.getInfo();
        if (info.hfVer == null) {
            info.hfVer = "";
            info.gmNum = 0;
        }
        if (info.sid != "") {
            let heid = setting_1.default.getHeid(info.sid);
            let cfgSysHefu = setting_1.default.getSetting("1", "sys_hefu");
            if (cfgSysHefu != null && cfgSysHefu.list[heid] != null) {
                let hfAt = cfgSysHefu.list[heid].newVer;
                let qz = 'S' + info.sid + '服*';
                if (info.hfVer != hfAt && info.name.indexOf(qz) == -1) {
                    info.hfVer = hfAt;
                    info.name = qz + info.name;
                    info.gmNum = 1;
                }
            }
        }
        //每日重置时间
        if (info.createTime > 0 && info.outTime < this.ctx.state.newTime) {
            info.outTime = this.ctx.state.new0 + 86400;
            info.boss.open = 0; //BOSS每日重置
            info.boss.hurt = 0;
            info.boss.kill = "";
            //检查会长脚本
            await this.autoMaster();
            await this.update(info);
        }
        let cfg_bdhr = tool_1.tool.mathcfg_item(this.ctx, "club_bossStartDayHour");
        if (info.boss.open <= 0 && this.ctx.state.newTime > cfg_bdhr[1] && info.boss.md1220 < cfg_bdhr[1]) {
            info.boss.md1220 = this.ctx.state.newTime;
            await this.update(info, [""]);
        }
        if (info.lgLv == null) {
            info.lgLv = 1;
            info.lgExp = 0;
        }
        return info;
    }
    //仙盟是不是不存在
    async clickEmpty(have) {
        let info = await this.getInfo();
        if (info.createTime > 0) {
            //仙盟已存在
            if (have != true) {
                this.ctx.throw("仙盟已存在");
            }
        }
        else {
            if (have) {
                this.ctx.throw("仙盟不存在");
            }
        }
        return info;
    }
    /**
     * 检查仙盟是不是本合服的
     * @param sid
     * @returns
     */
    async clickHe(sid) {
        let info = await this.getInfo();
        let qfcfg = setting_1.default.getQufus();
        if (qfcfg[sid] == null || qfcfg[info.sid] == null) {
            this.ctx.throw("服务器ID异常");
        }
        if (qfcfg[sid].heid != qfcfg[info.sid].heid) {
            this.ctx.throw("跨区仙盟");
        }
        return true;
    }
    //创建仙盟
    async create(uuid, name, sid) {
        //检查仙盟是不是不存在
        let info = await this.clickEmpty(false);
        //重置仙盟信息
        info = this.init();
        info.uuid = uuid;
        info.name = name;
        info.sid = sid;
        info.createTime = this.ctx.state.newTime; //创建时间
        let heid = setting_1.default.getHeid(info.sid);
        let cfgSysHefu = setting_1.default.getSetting("1", "sys_hefu");
        if (cfgSysHefu != null && cfgSysHefu.list[heid] != null) {
            info.hfVer = cfgSysHefu.list[heid].newVer;
        }
        await this.update(info, [""]);
        return true;
    }
    //删除仙盟
    async delete() {
        //检查仙盟是不是不存在
        let info = await this.getInfo();
        info = this.init();
        await this.update(info, [""]);
        return true;
    }
    //判断这人是不是会长
    async isMaster(uuid, onluClick = false) {
        let info = await this.clickEmpty(true);
        if (uuid.toString() == info.uuid.toString()) {
            return true;
        }
        if (onluClick) {
            return false;
        }
        this.ctx.throw(`不是会长`);
        return false;
    }
    // 改名
    async gaiming(name) {
        let info = await this.clickEmpty(true);
        if (info.gmNum < 1) {
            this.ctx.throw(`无改名次数`);
        }
        //重名检查 名字唯一性
        let heid = setting_1.default.getHeid(info.sid);
        if ((await nameCheck_1.clubNameCheck.setName(heid, this.id, name)) != true) {
            this.ctx.throw(`名字已被占用`);
        }
        info.gmNum -= 1;
        info.name = name;
        await this.update(info, [""]);
    }
    //改会长
    async setMasterUuid(uuid) {
        //成员列表
        let sevClubMemberModel = SevClubMemberModel_1.SevClubMemberModel.getInstance(this.ctx, this.id);
        await sevClubMemberModel.getById(uuid);
        let info = await this.clickEmpty(true);
        info.uuid = uuid;
        await this.update(info, [""]);
        return true;
    }
    //设置仙盟成员数量 (这个数量只用来给输出)
    async setMemberCount(count) {
        let info = await this.clickEmpty(true);
        info.cash_memberCount = count;
        await this.update(info, [""]);
        return true;
    }
    //设置仙盟总7日活跃 (这个数量只用来给输出)
    async setActive(count) {
        let info = await this.clickEmpty(true);
        info.cash_active = count;
        await this.update(info, [""], false);
        return true;
    }
    //改公告
    async rstNotice(notice) {
        //检查仙盟是存在
        let info = await this.clickEmpty(true);
        //公告长度配置
        let cfg_nl = tool_1.tool.mathcfg_count(this.ctx, "club_noticeLong");
        if (notice.length > cfg_nl) {
            this.ctx.throw(`公告最大长度:${cfg_nl}`);
        }
        //重置仙盟公告信息
        info.notice = notice;
        await this.update(info, [""]);
        return true;
    }
    //修改申请等级限制
    async rstApLevel(level) {
        //自动换会长时间配置
        let cfg_alm = tool_1.tool.mathcfg_count(this.ctx, "club_applyLevelMax");
        if (level > cfg_alm) {
            this.ctx.throw("最大等级限制:" + cfg_alm);
        }
        //检查仙盟是存在
        let info = await this.clickEmpty(true);
        info.applyLevelNeed = level;
        await this.update(info, [""]);
        return true;
    }
    //修改自动加入状态
    async rstApAuto(auto) {
        //检查仙盟是存在
        let info = await this.clickEmpty(true);
        if (auto) {
            //允许自动加入
            info.applyAuto = this.ctx.state.newTime;
        }
        else {
            //不允许自动加入
            info.applyAuto = 0;
        }
        await this.update(info, [""]);
        return true;
    }
    //修改允许搜索状态
    async setSelect(auto) {
        //检查仙盟是存在
        let info = await this.clickEmpty(true);
        if (auto) {
            //允许被搜索
            info.canselect = this.ctx.state.newTime;
        }
        else {
            //不允许被搜索
            info.canselect = 0;
        }
        await this.update(info, [""]);
        return true;
    }
    async update(info, keys = [], isAdok = true) {
        await super.update(info, keys);
        //通知adok 更新
        if (isAdok) {
            let sevAdokClubModel = SevAdokClubModel_1.SevAdokClubModel.getInstance(this.ctx, this.id);
            await sevAdokClubModel.setVer("club");
        }
    }
    //检查和换会长
    async autoMaster() {
        //检查仙盟是存在
        let info = await this.getInfo();
        if (info.createTime <= 0) {
            //仙盟无效
            return;
        }
        //自动换会长时间配置
        let cfg_amt = tool_1.tool.mathcfg_count(this.ctx, "club_autoMaster");
        //7天前时间点
        let day7ago = this.ctx.state.newTime - cfg_amt * 86400;
        let fUser = await cache_1.default.getFUser(this.ctx, info.uuid);
        //活跃时间过期
        if (fUser.lastlogin > day7ago) {
            //未过期
            return;
        }
        //换人
        //遍历仙盟成员
        let sevClubMemberModel = SevClubMemberModel_1.SevClubMemberModel.getInstance(this.ctx, this.id);
        let clubMember = await sevClubMemberModel.getInfo();
        let acarr = []; //活跃表
        for (const fuuid in clubMember.list) {
            if (fuuid == info.uuid) {
                //会长除外
                continue;
            }
            //7天内 有活跃的
            let m_fUser = await cache_1.default.getFUser(this.ctx, fuuid);
            if (m_fUser.lastlogin < day7ago) {
                //7天内 没有活跃的
                continue;
            }
            if (clubMember.list[fuuid].active7D <= 0) {
                //没有一点 活跃值的 不算 //避免两个死号 每天轮换
                continue;
            }
            //加入X榜
            acarr.push({ uuid: fuuid, active: clubMember.list[fuuid].active7D });
        }
        if (acarr.length <= 0) {
            //无人可换
            return;
        }
        //排序 换人
        acarr.sort((a, b) => {
            return b.active - a.active;
        });
        //新会长
        let newUuid = acarr[0].uuid;
        //换会长
        await this.setMasterUuid(newUuid);
        //群发邮件通知
    }
    /**
     * 获取今日秒数
     */
    getNowSec() {
        return this.ctx.state.newTime - this.ctx.state.new0;
    }
    /**
     * 开启BOSS
     */
    async bossOpen(id) {
        let info = await this.clickEmpty(true);
        if (info.boss.open > 0) {
            this.ctx.throw("开启中");
        }
        if (info.boss.unlock < id) {
            this.ctx.throw("未解锁");
        }
        //配置  仙盟创建X小时后开启boss功能
        let cfg_bop = tool_1.tool.mathcfg_count(this.ctx, "club_bossOpenTime");
        if (info.createTime > this.ctx.state.newTime - cfg_bop * 3600) {
            this.ctx.throw(`创建仙盟${cfg_bop}小时后开放`);
        }
        //时间范围
        let cfg_sdh = tool_1.tool.mathcfg_item(this.ctx, "club_bossStartDayHour");
        //是否处于时间范围内
        let nowSec = this.getNowSec(); //今日秒数
        if (nowSec < cfg_sdh[0] || nowSec > cfg_sdh[1]) {
            this.ctx.throw("不在开启时间范围内");
        }
        //开启BOSS
        info.boss.open = id;
        await this.update(info);
    }
    /**
     * 添加龙宫上香经验
     */
    async addLgExp(exp) {
        let info = await this.clickEmpty(true);
        info.lgExp += exp;
        let cfgNext = gameCfg_1.default.longgongLevel.getItem((info.lgLv + 1).toString());
        if (cfgNext == null) {
            await this.update(info);
            return;
        }
        let cfg = gameCfg_1.default.longgongLevel.getItemCtx(this.ctx, info.lgLv.toString());
        if (info.lgExp >= cfg.exp) {
            info.lgExp -= cfg.exp;
            info.lgLv += 1;
        }
        await this.update(info);
    }
}
exports.SevClubModel = SevClubModel;
//# sourceMappingURL=SevClubModel.js.map