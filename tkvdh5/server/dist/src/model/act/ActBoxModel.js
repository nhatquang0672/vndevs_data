"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActBoxModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const hook_1 = require("../../util/hook");
const ActDingYueModel_1 = require("./ActDingYueModel");
const ActTaskKindModel_1 = require("./ActTaskKindModel");
const SevPaoMaModel_1 = require("../sev/SevPaoMaModel");
const lock_1 = __importDefault(require("../../util/lock"));
/**
 * 宝箱
 */
class ActBoxModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actBox"; //用于存储key 和  输出1级key
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
            fangan: "",
            bType: 0,
            mType: 0,
            level: 0,
            exp: 0,
            upType: 1,
            endAt: 0,
            time: 0,
            lqAt: 0,
            stepLevel: 1,
            stepExp: 0,
            stepUpType: 0,
            stepEndAt: 0,
            steplqAt: 0,
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        //初始化阶级
        if (info.stepLevel == null) {
            info.stepLevel = 1;
            info.stepExp = 0;
            info.stepUpType = 0;
            info.stepEndAt = 0;
            info.steplqAt = 0;
        }
        if (info.time < this.ctx.state.new0) {
            info.time = this.ctx.state.new0;
            info.lqAt = this.ctx.state.new0;
            info.steplqAt = this.ctx.state.new0;
        }
        let isUpdate = false;
        //（等级）升阶完成
        if (info.upType == 1 && this.ctx.state.newTime >= info.endAt) {
            isUpdate = true;
            info.upType = 0;
            info.level += 1;
            info.exp = 0;
            await hook_1.hookNote(this.ctx, "boxLevel", info.level);
            if (info.level >= 2) {
                this.ctx.state.master.addWin("msg", `鼎炉成功升级为${info.level}级`);
            }
            let cfgBox = gameCfg_1.default.equipBox.getItem(info.level.toString());
            if (cfgBox != null && info.level >= 10) {
                let heid = await this.getHeIdByUuid(this.id);
                await lock_1.default.setLock(this.ctx, "paoma", heid); //枷锁
                let sevPaoMaModel = SevPaoMaModel_1.SevPaoMaModel.getInstance(this.ctx, heid);
                await sevPaoMaModel.addList("1", [this.ctx.state.name, info.level.toString(), cfgBox.paoma]);
            }
        }
        //（等阶）升阶完成
        if (info.stepUpType == 1 && this.ctx.state.newTime >= info.stepEndAt) {
            isUpdate = true;
            info.stepUpType = 0;
            info.stepLevel += 1;
            info.stepExp = 0;
            //下发气泡
            this.ctx.state.master.addWin("boxUpStep", {
                type: 1
            });
            let cfgBoxStep = gameCfg_1.default.equipBoxStep.getItem(info.stepLevel.toString());
            if (cfgBoxStep != null) {
                this.ctx.state.master.addWin("msg", `锻造成功,开启鼎炉上限为${cfgBoxStep.maxBox}个`);
                if (info.stepLevel >= 6) {
                    let heid = await this.getHeIdByUuid(this.id);
                    await lock_1.default.setLock(this.ctx, "paoma", heid); //枷锁
                    let sevPaoMaModel = SevPaoMaModel_1.SevPaoMaModel.getInstance(this.ctx, heid);
                    await sevPaoMaModel.addList("2", [this.ctx.state.name, info.level.toString(), cfgBoxStep.maxBox.toString()]);
                }
            }
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
        return info;
    }
    //升级(增加进度条)
    async upLevel() {
        let info = await this.getInfo();
        if (info.upType == 1) {
            this.ctx.throw("升级中...");
        }
        let cfgNext = gameCfg_1.default.equipBox.getItem((info.level + 1).toString());
        if (cfgNext == null) {
            this.ctx.throw("已满级");
        }
        let cfg = gameCfg_1.default.equipBox.getItemCtx(this.ctx, info.level.toString());
        if (info.exp >= cfg.exp) {
            this.ctx.throw("当前进度条已满");
        }
        await this.ctx.state.master.subItem1([1, 2, cfg.coin]);
        info.exp += 1;
        await this.update(info);
        await hook_1.hookNote(this.ctx, "boxUpLevel", 1);
    }
    async setMType() {
        let info = await this.getInfo();
        if (info.mType == 1) {
            info.mType = 0;
        }
        else {
            info.mType = 1;
        }
        await this.update(info);
    }
    async setBType() {
        let info = await this.getInfo();
        if (info.bType == 1) {
            info.bType = 0;
        }
        else {
            info.bType = 1;
        }
        await this.update(info);
    }
    //设置方案
    async setFangAn(fangan) {
        let info = await this.getInfo();
        info.fangan = fangan;
        await this.update(info);
    }
    //升阶(进入下一等级)
    async upStep() {
        let info = await this.getInfo();
        if (info.upType == 1) {
            this.ctx.throw("升级中...");
        }
        let cfg = gameCfg_1.default.equipBox.getItemCtx(this.ctx, info.level.toString());
        if (info.exp < cfg.exp) {
            this.ctx.throw("当前进度条未满");
        }
        info.upType = 1;
        info.endAt = this.ctx.state.newTime + cfg.miao;
        await this.update(info);
        let actDingYueModel = ActDingYueModel_1.ActDingYueModel.getInstance(this.ctx, this.id);
        await actDingYueModel.saveDy('1', info.endAt, [(info.level + 1).toString()]);
    }
    /**
     * 工会助力 返回加速时长
    */
    async clubZhuLi() {
        let info = await this.getInfo();
        if (info.upType == 0) {
            return 0;
        }
        let cfgMath = gameCfg_1.default.mathInfo.getItemCtx(this.ctx, "box_zhuli_club");
        if (cfgMath.pram.count == null) {
            this.ctx.throw("配置错误Math_box_zhuli_club");
            return 0;
        }
        info.endAt -= cfgMath.pram.count;
        await this.update(info);
        let actDingYueModel = ActDingYueModel_1.ActDingYueModel.getInstance(this.ctx, this.id);
        await actDingYueModel.saveDy('1', info.endAt, [(info.level + 1).toString()]);
        return cfgMath.pram.count;
    }
    /**
     * 工会助力 返回加速时长 (阶级)
    */
    async clubZhuLiStep() {
        let info = await this.getInfo();
        if (info.stepUpType == 0) {
            return 0;
        }
        let cfgMath = gameCfg_1.default.mathInfo.getItemCtx(this.ctx, "box_zhuli_club");
        if (cfgMath.pram.count == null) {
            this.ctx.throw("配置错误Math_box_zhuli_club");
            return 0;
        }
        info.stepEndAt -= cfgMath.pram.count;
        await this.update(info);
        return cfgMath.pram.count;
    }
    /**
     * 获取升阶截止时间 (用来判断当前是否允许进行助力发布)
     */
    async zhuliTime() {
        let info = await this.getInfo();
        if (info.upType == 0) {
            //不需要助力
            return 0;
        }
        return info.endAt;
    }
    /**
     * 获取升阶截止时间 (用来判断当前是否允许进行助力发布)
     */
    async zhuliTimeStep() {
        let info = await this.getInfo();
        if (info.stepUpType == 0) {
            //不需要助力
            return 0;
        }
        return info.stepEndAt;
    }
    /**
     * 道具助力
     */
    async itemZhuLi(count) {
        let info = await this.getInfo();
        if (info.upType == 0) {
            return;
        }
        let cfgMath = gameCfg_1.default.mathInfo.getItemCtx(this.ctx, 'box_zhuli_item');
        if (cfgMath.pram.count == null || cfgMath.pram.item == null) {
            this.ctx.throw("配置错误box_zhuli_item");
            return;
        }
        await this.ctx.state.master.subItem1([cfgMath.pram.item[0], cfgMath.pram.item[1], count]);
        info.endAt -= cfgMath.pram.count * count;
        await this.update(info);
        await hook_1.hookNote(this.ctx, "itemZhuLi", count);
        let actDingYueModel = ActDingYueModel_1.ActDingYueModel.getInstance(this.ctx, this.id);
        await actDingYueModel.saveDy('1', info.endAt, [(info.level + 1).toString()]);
    }
    /**
     * 钻石助力
     */
    async speed() {
        let info = await this.getInfo();
        if (info.upType == 0) {
            return;
        }
        let cfgMath = gameCfg_1.default.mathInfo.getItemCtx(this.ctx, 'box_lengqie');
        if (cfgMath.pram.count == null || cfgMath.pram.count1 == null || cfgMath.pram.item == null) {
            this.ctx.throw("配置错误box_lengqie");
            return;
        }
        if (info.upType != 1) {
            this.ctx.throw("已完成进阶");
        }
        await this.ctx.state.master.subItem1(cfgMath.pram.item);
        info.endAt -= cfgMath.pram.count1;
        info.lqAt = this.ctx.state.newTime + cfgMath.pram.count;
        await this.update(info);
        let actDingYueModel = ActDingYueModel_1.ActDingYueModel.getInstance(this.ctx, this.id);
        await actDingYueModel.saveDy('1', info.endAt, [(info.level + 1).toString()]);
    }
    /**
     * 广告下单检查
     */
    async checkUp() {
        let info = await this.getInfo();
        if (info.upType == 0) {
            this.ctx.throw("活动未生效");
        }
        return {
            type: 1,
            msg: "宝箱进阶广告加速",
            data: null
        };
    }
    /**
     * 广告成功后执行
     */
    async carryOut() {
        let info = await this.getInfo();
        if (info.upType == 0) {
            return {
                type: 1,
                msg: "宝箱进阶广告加速失败0",
                data: null
            };
        }
        let cfgMath = gameCfg_1.default.mathInfo.getItemCtx(this.ctx, 'box_lengqie');
        if (cfgMath.pram.count == null || cfgMath.pram.count1 == null || cfgMath.pram.item == null) {
            this.ctx.throw("配置错误box_lengqie");
            return {
                type: 0,
                msg: "宝箱进阶广告加速失败",
                data: null
            };
        }
        info.endAt -= cfgMath.pram.count1;
        info.lqAt = this.ctx.state.newTime + cfgMath.pram.count;
        await this.update(info);
        let actDingYueModel = ActDingYueModel_1.ActDingYueModel.getInstance(this.ctx, this.id);
        await actDingYueModel.saveDy('1', info.endAt, [(info.level + 1).toString()]);
        let msg = `鼎炉升级冷却缩减${Math.floor(cfgMath.pram.count1 / 60)}分钟`;
        if (info.upType == 0) {
            msg = "";
        }
        return {
            type: 1,
            msg: msg,
            data: null
        };
    }
    //升阶增加进度条(增加进度条)
    async upStepLv() {
        let info = await this.getInfo();
        if (info.stepUpType == 1) {
            this.ctx.throw("升阶中...");
        }
        let cfgNext = gameCfg_1.default.equipBoxStep.getItem((info.stepLevel + 1).toString());
        if (cfgNext == null) {
            this.ctx.throw("已满级");
        }
        let cfg = gameCfg_1.default.equipBoxStep.getItemCtx(this.ctx, info.stepLevel.toString());
        if (info.stepExp >= cfg.exp) {
            this.ctx.throw("当前进度条已满");
        }
        await this.ctx.state.master.subItem1(cfg.need);
        info.stepExp += 1;
        await this.update(info);
    }
    //升阶进入下一阶级
    async upStepNext() {
        let info = await this.getInfo();
        if (info.stepUpType == 1) {
            this.ctx.throw("升级中...");
        }
        let cfg = gameCfg_1.default.equipBoxStep.getItemCtx(this.ctx, info.stepLevel.toString());
        if (info.stepExp < cfg.exp) {
            this.ctx.throw("当前进度条未满");
        }
        let actTaskKindModel = ActTaskKindModel_1.ActTaskKindModel.getInstance(this.ctx, this.id);
        let actTaskKind = await actTaskKindModel.getInfo();
        for (const lockId in cfg.locks) {
            if (actTaskKind.nids[lockId] == null) {
                this.ctx.throw("鼎炉升阶任务未完成");
            }
            if (actTaskKind.nids[lockId] < cfg.locks[lockId]) {
                this.ctx.throw("鼎炉升阶任务未完成!");
            }
        }
        info.stepUpType = 1;
        info.stepEndAt = this.ctx.state.newTime + cfg.miao;
        await this.update(info);
    }
    /**
     * 阶级道具助力
     */
    async itemZhuLiStep(count) {
        let info = await this.getInfo();
        if (info.stepUpType == 0) {
            return;
        }
        let cfgMath = gameCfg_1.default.mathInfo.getItemCtx(this.ctx, 'box_zhuli_item');
        if (cfgMath.pram.count == null || cfgMath.pram.item == null) {
            this.ctx.throw("配置错误box_zhuli_item");
            return;
        }
        await this.ctx.state.master.subItem1([cfgMath.pram.item[0], cfgMath.pram.item[1], count]);
        info.stepEndAt -= cfgMath.pram.count * count;
        await this.update(info);
        await hook_1.hookNote(this.ctx, "itemZhuLi", count);
    }
    /**
     * 广告下单检查
     */
    async checkUp1() {
        let info = await this.getInfo();
        if (info.stepUpType == 0) {
            this.ctx.throw("活动未生效");
        }
        return {
            type: 1,
            msg: "宝箱进阶广告加速",
            data: null
        };
    }
    /**
     * 广告成功后执行
     */
    async carryOut1() {
        let info = await this.getInfo();
        if (info.stepUpType == 0) {
            return {
                type: 1,
                msg: "宝箱进阶广告加速失败0",
                data: null
            };
        }
        let cfgMath = gameCfg_1.default.mathInfo.getItemCtx(this.ctx, 'box_lengqie');
        if (cfgMath.pram.count == null || cfgMath.pram.count1 == null || cfgMath.pram.item == null) {
            this.ctx.throw("配置错误box_lengqie");
            return {
                type: 0,
                msg: "宝箱进阶广告加速失败",
                data: null
            };
        }
        info.stepEndAt -= cfgMath.pram.count1;
        info.steplqAt = this.ctx.state.newTime + cfgMath.pram.count;
        await this.update(info);
        let msg = `鼎炉锻造冷却缩减${Math.floor(cfgMath.pram.count1 / 60)}分钟`;
        if (info.stepUpType == 0) {
            msg = "";
        }
        return {
            type: 1,
            msg: msg,
            data: null
        };
    }
}
exports.ActBoxModel = ActBoxModel;
//# sourceMappingURL=ActBoxModel.js.map