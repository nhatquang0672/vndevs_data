"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SevClubMemberModel = void 0;
const master_1 = require("../../util/master");
const AModel_1 = require("../AModel");
const cache_1 = __importDefault(require("../../../src/util/cache"));
const SevAdokClubModel_1 = require("./SevAdokClubModel");
const SevClubModel_1 = require("./SevClubModel");
const ActClubModel_1 = require("../act/ActClubModel");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
/**
 * 公会成员
 */
class SevClubMemberModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "sev"; //数据库表名
        this.kid = "clubMember"; //用于存储key 和  输出1级key
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
            time: 0,
            list: {},
            count: 0,
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        if (info.time == null || info.time < this.ctx.state.new0) {
            info.time = this.ctx.state.newTime;
            for (const uuid in info.list) {
                info.list[uuid].longgong = 0;
            }
        }
        return info;
    }
    async update(info, keys = [], isAdok = true) {
        await super.update(info, keys);
        //通知adok 更新
        if (isAdok) {
            let sevAdokClubModel = SevAdokClubModel_1.SevAdokClubModel.getInstance(this.ctx, this.id);
            await sevAdokClubModel.setVer("clubMember");
        }
    }
    //给公会成员加活跃值 //加到成员身上 / 更新到公会里面 //公会自己有自己的活跃值 不取这边的 / 每次加的时候 从公会加
    //公会成员XX
    async getOutPut() {
        let info = await this.getInfo();
        //获取(更新) 需要吧每个成员拉出来? //全公会一起更新/ 不关个人的事? 公会成员的7日活跃
        //列表更新列表的 公会更新公会的?
        let opt = {};
        for (const fuuid in info.list) {
            opt[fuuid] = {
                user: await cache_1.default.getFUser(this.ctx, fuuid),
                // post: info.list[fuuid].post, //职位 '1001' 会长 0' 会员
                active7D: info.list[fuuid].active7D,
                longgong: info.list[fuuid].longgong //龙宫守卫次数
            };
        }
        return opt;
    }
    /**
     * 获取成员
     */
    async getById(id) {
        let info = await this.getInfo();
        if (info.list[id] == null) {
            this.ctx.throw("成员错误:" + id);
        }
        return info.list[id];
    }
    /**
     * 获取成员数量
     */
    async count() {
        let info = await this.getInfo();
        return info.count;
    }
    /**
     * 检查成员已满
     */
    async isFull() {
        let count = await this.count();
        //获取成员配置
        //创建公会货币需求
        let cfgMath = gameCfg_1.default.mathInfo.getItemCtx(this.ctx, "club_maxMember");
        if (cfgMath.pram.count == null) {
            this.ctx.throw("配置错误 club_maxMember");
            return 0;
        }
        if (count >= cfgMath.pram.count) {
            this.ctx.throw(`公会成员已满`);
        }
        return count;
    }
    /**
     * 添加公会成员
     */
    async add(fuuid, post = "") {
        let info = await this.getInfo();
        if (info.list[fuuid] != null) {
            this.ctx.throw(`成员已存在 ${fuuid}`);
        }
        //获取这个人的7日活跃值 更新
        let actClubModel = ActClubModel_1.ActClubModel.getInstance(this.ctx, fuuid);
        info.list[fuuid] = {
            post: post,
            active7D: await actClubModel.getActive(),
            longgong: 0
            // itime: this.ctx.state.newTime,//加入公会时间
        };
        info.count = Object.keys(info.list).length;
        await this.update(info, [""]);
        //一旦更新成员数量 就联动更新公会 成员数量
        let sevClubModel = SevClubModel_1.SevClubModel.getInstance(this.ctx, this.id);
        await sevClubModel.setMemberCount(info.count);
        //更新活跃
        await this.upActiveToClub();
    }
    /**
     * 删除公会成员
     */
    async del(fuuid) {
        let info = await this.getInfo();
        if (info.list[fuuid] == null) {
            return;
        }
        delete info.list[fuuid];
        info.count = Object.keys(info.list).length;
        await this.update(info, [""]);
        //一旦更新成员数量 就联动更新公会 成员数量
        let sevClubModel = SevClubModel_1.SevClubModel.getInstance(this.ctx, this.id);
        await sevClubModel.setMemberCount(info.count);
        //更新活跃
        await this.upActiveToClub();
    }
    /**
     * 设置指定成员 活跃值缓存
     */
    async setActive7D(fuuid, active7D) {
        let info = await this.getInfo();
        if (info.list[fuuid] == null) {
            return;
        }
        info.list[fuuid].active7D = active7D;
        await this.update(info, [""], false);
        //计算总活跃 更新给公会
        await this.upActiveToClub();
    }
    //计算总活跃 更新给公会
    async upActiveToClub() {
        let info = await this.getInfo();
        let allActive7D = 0;
        for (const fuuid in info.list) {
            allActive7D += info.list[fuuid].active7D;
        }
        let sevClubModel = SevClubModel_1.SevClubModel.getInstance(this.ctx, this.id);
        await sevClubModel.setActive(allActive7D);
    }
}
exports.SevClubMemberModel = SevClubMemberModel;
//# sourceMappingURL=SevClubMemberModel.js.map