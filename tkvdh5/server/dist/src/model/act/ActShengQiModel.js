"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActShengQiModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const Xys_1 = require("../../../common/Xys");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const game_1 = __importDefault(require("../../util/game"));
const hook_1 = require("../../util/hook");
const HdTimeBenModel_1 = require("../hd/HdTimeBenModel");
const HdTimeBen2Model_1 = require("../hd/HdTimeBen2Model");
const setting_1 = __importDefault(require("../../../src/crontab/setting"));
/**
 * 圣器
 */
class ActShengQiModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actShengQi"; //用于存储key 和  输出1级key
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
            time: this.ctx.state.newTime,
            cons: 0,
            chip: 0,
            chuan: "",
            list: {},
            log: [],
            zuojia: 0,
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        if (info.time < this.ctx.state.new0) {
            info.time = this.ctx.state.new0;
            info.cons = 0;
        }
        if (info.chip < 0) {
            info.chip = 0;
        }
        if (info.zuojia == null) {
            info.zuojia = 0;
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
    /**
     * 增加万能碎片
     * @param count
     */
    async addChip(count) {
        let info = await this.getInfo();
        info.chip += count;
        await this.update(info, ['chip']);
        this.ctx.state.master.addLog(1, 57, count, info.chip);
    }
    /**
     * 增加万能碎片
     * @param count
     */
    async addSqChip(itemid, count) {
        let info = await this.getInfo();
        if (info.list[itemid.toString()] == null) {
            info.list[itemid.toString()] = {
                level: 0,
                exp: 0
            };
        }
        info.list[itemid.toString()].exp += count;
        await this.update(info, ['list']);
        this.ctx.state.master.addLog(8, itemid, count, info.list[itemid.toString()].exp);
    }
    /**
     * 开启宝箱
     */
    async chou() {
        let cfgMath = gameCfg_1.default.mathInfo.getItemCtx(this.ctx, 'shengqi_sett');
        if (cfgMath.pram.item == null || cfgMath.pram.count == null) {
            this.ctx.throw("配置错误Math_shengqi_sett");
            return;
        }
        let info = await this.getInfo();
        info.cons += 1;
        //扣除道具
        if (info.cons > cfgMath.pram.count) {
            await this.ctx.state.master.subItem1(cfgMath.pram.item);
        }
        let item = [];
        let cfgzj = gameCfg_1.default.shengqiZuojia.getItem((info.zuojia + 1).toString());
        if (cfgzj != null) {
            if (cfgzj.type == 1) {
                item = [8, cfgzj.item[0], 1];
            }
            else {
                item = cfgzj.item;
            }
            info.zuojia += 1;
        }
        else {
            let cfgChouPool = gameCfg_1.default.shengqiChou.pool;
            let _key = game_1.default.getProbRandId(0, cfgChouPool, 'prob');
            if (_key == null) {
                this.ctx.throw("shengqi_chou获取失败");
                return;
            }
            if (cfgChouPool[_key].type == 1) {
                let _item = game_1.default.getProbByItems(cfgChouPool[_key].item, 0, 1);
                if (_item == null) {
                    this.ctx.throw("shengqi_碎片抽取失败");
                    return;
                }
                item = [8, _item[0], 1];
            }
            else {
                item = cfgChouPool[_key].item[0];
            }
        }
        await this.ctx.state.master.addItem1(item, 'sqItems');
        //记录日志
        info.log.unshift([item[0], item[1], item[2], this.ctx.state.newTime]);
        info.log = info.log.slice(0, 30);
        await this.update(info, ['cons', 'list']);
        await hook_1.hookNote(this.ctx, "shenqiChou", 1);
        //触发礼包
        //下次不免费
        if (info.cons + 1 > cfgMath.pram.count) {
            //如果下次不够钱了
            if (await this.ctx.state.master.subItem1(cfgMath.pram.item, true) != true) {
                let heid = await this.getHeIdByUuid(this.id);
                //触发礼包
                //活动 - 限时福利
                let cfgHdTimeBen = setting_1.default.getHuodong2(heid, "hdTimeBen");
                if (cfgHdTimeBen != null) {
                    for (const hdcid in cfgHdTimeBen) {
                        let hdTimeBenModel = HdTimeBenModel_1.HdTimeBenModel.getInstance(this.ctx, this.id, hdcid);
                        await hdTimeBenModel.trip(Xys_1.TimeBenType.shengqi);
                    }
                }
                //触发礼包 改版列表版
                let cfgHdTimeBen2 = setting_1.default.getHuodong2(heid, "hdTimeBen2");
                if (cfgHdTimeBen2 != null) {
                    for (const hdcid in cfgHdTimeBen2) {
                        let hdTimeBen2Model = HdTimeBen2Model_1.HdTimeBen2Model.getInstance(this.ctx, this.id, hdcid);
                        await hdTimeBen2Model.trip(Xys_1.TimeBen2Type.shengqi);
                    }
                }
            }
        }
    }
    /**
     * 激活或升级
     * @param sqId 圣器ID
     */
    async upLevel(sqId) {
        let info = await this.getInfo();
        if (info.list[sqId] == null) {
            this.ctx.throw("未激活无法使用万能碎片");
        }
        let cfgNext = gameCfg_1.default.shengqiLevel.getItem(sqId, (info.list[sqId].level + 1).toString());
        if (cfgNext == null) {
            this.ctx.throw("已满级");
        }
        let needExp = gameCfg_1.default.shengqiLevel.getItemCtx(this.ctx, sqId, info.list[sqId].level.toString()).exp;
        if (needExp > info.list[sqId].exp) {
            if (info.list[sqId].level < 1 && needExp > info.list[sqId].exp) {
                this.ctx.throw("未激活无法使用万能碎片");
            }
            if (needExp - info.list[sqId].exp > info.chip) {
                this.ctx.throw("碎片不足");
            }
            info.chip -= (needExp - info.list[sqId].exp);
            info.list[sqId].exp = 0;
            this.ctx.state.master.addLog(1, 57, (-1) * (needExp - info.list[sqId].exp), info.chip);
        }
        else {
            info.list[sqId].exp -= needExp;
        }
        info.list[sqId].level += 1;
        await this.update(info, ['chip', 'list']);
        await hook_1.hookNote(this.ctx, "shenqiUplv", info.list[sqId].level);
    }
    /**
     * 穿戴
     * @param sqId 圣器ID
     */
    async chuandai(sqId) {
        let info = await this.getInfo();
        if (info.list[sqId] == null) {
            this.ctx.throw("参数错误");
        }
        if (info.list[sqId].level == 0) {
            this.ctx.throw("未激活");
        }
        info.chuan = sqId;
        await this.update(info, ['chuan']);
    }
}
exports.ActShengQiModel = ActShengQiModel;
//# sourceMappingURL=ActShengQiModel.js.map