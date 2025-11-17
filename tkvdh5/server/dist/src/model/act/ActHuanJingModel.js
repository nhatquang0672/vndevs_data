"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActHuanJingModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
/**
 * 幻境阁
 */
class ActHuanJingModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actHuanJing"; //用于存储key 和  输出1级key
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
            list: {}
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        // if(gameMethod.isEmpty(info.list) == true){
        //     let pool = Gamecfg.huanjingInfo.pool
        //     for (const key in pool) {
        //         if(pool[key].cons <= 0){
        //             info.list[pool[key].id] = this.ctx.state.newTime
        //         }
        //     }
        // }
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
    *  解锁
    */
    async jiesuo(id) {
        // let cfg =  Gamecfg.huanjingInfo.getItemCtx(this.ctx,id)
        // switch(cfg.kind) {
        //     case "2":  //2、钻石购买
        //         await this.ctx.state.master.subItem1([1,1,cfg.cons])
        //         break
        //     case "3":  //3、全部装备外形数量【解锁{0}个收藏（10/20）】
        //         let actEquipModel =  ActEquipModel.getInstance(this.ctx,this.id)
        //         let actEquip = await actEquipModel.getInfo()
        //         let hasCons:number = 0
        //         for (const buwei in actEquip.chuan) {
        //             hasCons += Object.keys(actEquip.chuan[buwei].hhList).length
        //         }
        //         if(hasCons < cfg.cons){
        //             this.ctx.throw("未完成")
        //         }
        //         break
        //     case "4":  //4、鼎炉等级【训练场升级到{0}级（10/20）】
        //         let actBoxModel = ActBoxModel.getInstance(this.ctx,this.id)
        //         let actBox = await actBoxModel.getInfo()
        //         if(actBox.level < cfg.cons){
        //             this.ctx.throw("未完成")
        //         }
        //         break
        //     case "5":  //5、玩家等级【角色升级到{0}级（10/20）】
        //         if(this.ctx.state.level < cfg.cons){
        //             this.ctx.throw("未完成")
        //         }
        //         break
        //     case "6":  //6、通关主线关卡【通关主线 {0}（10/20）】（这里显示的是主线关卡的名称）
        //         let actPveInfoModel = ActPveInfoModel.getInstance(this.ctx,this.id)
        //         let actPveInfo = await actPveInfoModel.getInfo()
        //         if(actPveInfo.id -1 < cfg.cons){
        //             this.ctx.throw("未完成")
        //         }
        //         break
        //     case "7":  //7、通关精英关卡【通关精英 {0}（10/20）】
        //         let actPveJyModel = ActPveJyModel.getInstance(this.ctx,this.id)
        //         let actPveJy = await actPveJyModel.getInfo()
        //         if(actPveJy.id -1 < cfg.cons){
        //             this.ctx.throw("未完成")
        //         }
        //         break
        //     case "8":  //8、每日BOSS累积次数【参加每日挑战{0}次（10/20）】
        //         let actTaskKindModel = ActTaskKindModel.getInstance(this.ctx,this.id)
        //         let actTaskKind = await actTaskKindModel.getInfo()
        //         if(actTaskKind.nids["166"] == null || actTaskKind.nids["166"] < cfg.cons){
        //             this.ctx.throw("未完成")
        //         }
        //         break
        //     case "9":  //9、通关试练关卡多少层【试炼达到{0}层（10/20）】
        //         let actPvwModel = ActPvwModel.getInstance(this.ctx,this.id)
        //         let actPvw = await actPvwModel.getInfo()
        //         if(actPvw.histMax < cfg.cons){
        //             this.ctx.throw("未完成")
        //         }
        //         break
        //     case "10":  //10、锦绣坊解锁某角色【通过锦绣坊解锁套装】
        //         let actJinxiu = ActJinxiuModel.getInstance(this.ctx,this.id)
        //         let actJx = await actJinxiu.getInfo()
        //         if(actJx.list[cfg.cons] == null){
        //             this.ctx.throw("未解锁")
        //         }
        //         break
        //     default:
        //         this.ctx.throw("开启条件种类错误")
        // }
        // let info: Info = await this.getInfo();
        // info.list[id] = this.ctx.state.newTime
        // await this.update(info)
    }
    /**
    *  解锁
    */
    async setpf(id) {
        // let info: Info = await this.getInfo();
        // if(info.list[id] == null){
        //     await this.jiesuo(id)
        // }
        // let actEquipModel =  ActEquipModel.getInstance(this.ctx,this.id)
        // let actEquip = await actEquipModel.getInfo()
        // actEquip.btpf = id
        // await actEquipModel.update(actEquip,["btpf","btcj"])
    }
    /**
    *  解锁
    */
    async setcj(id) {
        // let info: Info = await this.getInfo();
        // if(info.list[id] == null){
        //     await this.jiesuo(id)
        // }
        // let actEquipModel =  ActEquipModel.getInstance(this.ctx,this.id)
        // let actEquip = await actEquipModel.getInfo()
        // actEquip.btcj = id
        // await actEquipModel.update(actEquip,["btpf","btcj"])
    }
}
exports.ActHuanJingModel = ActHuanJingModel;
//# sourceMappingURL=ActHuanJingModel.js.map