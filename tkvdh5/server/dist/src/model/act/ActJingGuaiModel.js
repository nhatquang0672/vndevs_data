"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActJingGuaiModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const tool_1 = require("../../util/tool");
const gameMethod_1 = require("../../../common/gameMethod");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const game_1 = __importDefault(require("../../util/game"));
const hook_1 = require("../../util/hook");
/**
 *精怪
 */
class ActJingGuaiModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actJingGuai"; //用于存储key 和  输出1级key
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
        let cfgItem = tool_1.tool.mathcfg_item(this.ctx, "jingguai_sz_lv");
        let str = [];
        for (const val of cfgItem) {
            if (this.ctx.state.level >= val) {
                str.push("");
            }
        }
        return {
            baodi: 0,
            jgList: {},
            szList: {
                "1": str,
                "2": str,
                "3": str,
            },
            szid: "1",
            fjcons: 0,
            dzItem: [],
            dzcount: 0 //第几次打造
        };
    }
    async getOutPut() {
        let info = await this.getInfo();
        return info;
    }
    /**
    *  打造精怪
    */
    async dazao(count) {
        let mathItem = tool_1.tool.mathcfg_item(this.ctx, "jingguai_chou");
        let mathCount = tool_1.tool.mathcfg_count(this.ctx, "jingguai_chou");
        let mathCount1 = tool_1.tool.mathcfg_count1(this.ctx, "jingguai_chou");
        await this.ctx.state.master.subItem1([mathItem[0], mathItem[1], mathItem[2] * count]);
        let cfgpool = gameCfg_1.default.jingguaiPinzhi.pool;
        let info = await this.getInfo();
        if (info.dzcount == null) {
            info.dzcount = 0;
        }
        info.dzItem = [];
        for (let index = 0; index < count; index++) {
            info.dzcount += 1;
            info.baodi += 1;
            let cfgzj = gameCfg_1.default.jingguaiZuojia.getItem(info.dzcount.toString());
            if (cfgzj != null) {
                if (info.jgList[cfgzj.jgid] == null) {
                    info.jgList[cfgzj.jgid] = {
                        jihuo: 0,
                        level: 0,
                        chip: 0 //精怪碎片
                    };
                }
                info.jgList[cfgzj.jgid].chip += cfgzj.chip;
                info.dzItem.push([20, parseInt(cfgzj.jgid), cfgzj.chip]);
                continue;
            }
            let pinzhi = "";
            let iswz = 0; //0碎片 1完整
            if (info.baodi >= mathCount) {
                info.baodi -= mathCount;
                pinzhi = mathCount1.toString();
                iswz = 1;
            }
            else {
                let cfgitem = game_1.default.getProbRandItem(0, cfgpool, "prob0");
                if (cfgitem == null) {
                    this.ctx.throw("打造失败");
                }
                pinzhi = cfgitem.id;
                let maxProb = cfgitem.prob1 + cfgitem.prob2;
                if (game_1.default.rand(1, maxProb) <= cfgitem.prob1) {
                    iswz = 1;
                }
            }
            if (pinzhi == "") {
                this.ctx.throw("品质获取失败");
            }
            let pzlist = gameCfg_1.default.jingguaiInfoList.getItemListCtx(this.ctx, pinzhi);
            let cfgitem1 = game_1.default.getProbRandItem(0, pzlist, "pinzhi");
            if (cfgitem1 == null) {
                this.ctx.throw("打造_失败" + pinzhi);
            }
            if (info.jgList[cfgitem1.id] == null) {
                info.jgList[cfgitem1.id] = {
                    jihuo: 0,
                    level: 0,
                    chip: 0 //精怪碎片
                };
            }
            if (iswz == 1) {
                // if(info.jgList[cfgitem1.id].jihuo == 1){
                info.jgList[cfgitem1.id].chip += cfgitem1.hecheng;
                info.dzItem.push([20, parseInt(cfgitem1.id), cfgitem1.hecheng]);
                // }else{
                //     info.jgList[cfgitem1.id].jihuo = 1
                //     info.jgList[cfgitem1.id].level = 1
                //     info.dzItem.push([19,parseInt(cfgitem1.id),1])
                //     await hookNote(this.ctx, "jghasnum",Object.keys(info.jgList).length);
                // }
            }
            else {
                info.jgList[cfgitem1.id].chip += 1;
                info.dzItem.push([20, parseInt(cfgitem1.id), 1]);
            }
        }
        await this.update(info);
        await hook_1.hookNote(this.ctx, "jgzhnum", count);
    }
    /**
    *  解锁格子
    */
    async jiesuogz(level) {
        let mathItem = tool_1.tool.mathcfg_item(this.ctx, "jingguai_sz_lv");
        let info = await this.getInfo();
        let has = info.szList["1"].length; //已经解锁几个
        let ke = 0;
        for (const val of mathItem) {
            if (level >= val) {
                ke += 1;
            }
        }
        if (ke > has) {
            for (let index = has + 1; index <= ke; index++) {
                info.szList["1"].push("");
                info.szList["2"].push("");
                info.szList["3"].push("");
            }
            await this.update(info);
        }
    }
    /**
    *  上阵
    */
    async shangzhen(id1, id2, jgid) {
        let info = await this.getInfo();
        if (info.szList[id1] == null) {
            this.ctx.throw("参数错误1");
        }
        if (info.szList[id1][id2] == null) {
            this.ctx.throw("参数错误2");
        }
        if (jgid != "" && info.jgList[jgid] != null && info.jgList[jgid].jihuo != 1) {
            this.ctx.throw("参数错误3");
        }
        info.szList[id1][id2] = jgid;
        await this.update(info);
        let count = 0;
        for (const _id1 in info.szList) {
            for (const _id2 in info.szList[_id1]) {
                if (info.szList[_id1][_id2] != "") {
                    count += 1;
                }
            }
        }
        await hook_1.hookNote(this.ctx, "jgsz", count);
    }
    /**
    *  切换阵容
    */
    async qiehuan(id) {
        let info = await this.getInfo();
        if (info.szList[id] == null) {
            this.ctx.throw("参数错误1");
        }
        info.szid = id;
        await this.update(info);
    }
    /**
    *  升级
    */
    async uplevel(jgid) {
        let info = await this.getInfo();
        if (info.jgList[jgid] == null) {
            this.ctx.throw("参数错误");
        }
        if (info.jgList[jgid].jihuo != 1) {
            this.ctx.throw("未激活");
        }
        let cfgInfo = gameCfg_1.default.jingguaiInfo.getItemCtx(this.ctx, jgid);
        let cfgLv = gameCfg_1.default.jingguaiLevel.getItemCtx(this.ctx, info.jgList[jgid].level.toString());
        let cfgLvNext = gameCfg_1.default.jingguaiLevel.getItem((info.jgList[jgid].level + 1).toString());
        if (cfgLvNext == null) {
            this.ctx.throw("已满级");
        }
        let need = cfgLv["need_" + cfgInfo.pinzhi];
        if (info.jgList[jgid].chip < need) {
            this.ctx.throw("碎片不足");
        }
        info.jgList[jgid].chip -= need;
        info.jgList[jgid].level += 1;
        await this.update(info);
        await hook_1.hookNote(this.ctx, "jguplv", 1);
    }
    /**
    *  分解
    */
    async fenjie(jgids, pzs) {
        let info = await this.getInfo();
        let isUpdate = false;
        if (gameMethod_1.gameMethod.isEmpty(jgids) == false) {
            for (const jgid of jgids) {
                if (info.jgList[jgid] == null || info.jgList[jgid].jihuo != 1) {
                    this.ctx.throw("参数错误1");
                }
                if (info.jgList[jgid].chip <= 0) {
                    continue; //没有碎片
                }
                let cfgLvNext = gameCfg_1.default.jingguaiLevel.getItem((info.jgList[jgid].level + 1).toString());
                if (cfgLvNext != null) {
                    this.ctx.throw("未满级");
                }
                let cfgInfo = gameCfg_1.default.jingguaiInfo.getItemCtx(this.ctx, jgid);
                info.fjcons += cfgInfo.fenjie * info.jgList[jgid].chip;
                info.jgList[jgid].chip = 0;
                isUpdate = true;
            }
        }
        if (gameMethod_1.gameMethod.isEmpty(pzs) == false) {
            for (const jgid in info.jgList) {
                if (info.jgList[jgid].chip <= 0) {
                    continue; //没有碎片
                }
                let cfgLvNext = gameCfg_1.default.jingguaiLevel.getItem((info.jgList[jgid].level + 1).toString());
                if (cfgLvNext != null) {
                    this.ctx.throw("未满级");
                }
                let cfgInfo = gameCfg_1.default.jingguaiInfo.getItemCtx(this.ctx, jgid);
                if (pzs.indexOf(cfgInfo.pinzhi) == -1) {
                    continue;
                }
                info.fjcons += cfgInfo.fenjie * info.jgList[jgid].chip;
                info.jgList[jgid].chip = 0;
                isUpdate = true;
            }
        }
        let mathItem = tool_1.tool.mathcfg_item(this.ctx, "jingguai_fenjie");
        let mathCount = tool_1.tool.mathcfg_count(this.ctx, "jingguai_fenjie");
        if (info.fjcons >= mathCount) {
            let add = Math.floor(info.fjcons / mathCount);
            info.fjcons -= mathCount * add;
            isUpdate = true;
            await this.ctx.state.master.addItem1([mathItem[0], mathItem[1], mathItem[2] * add]);
        }
        if (isUpdate) {
            await this.update(info);
        }
        else {
            this.ctx.throw("无碎片可分解");
        }
    }
    /**
    *  hecheng
    */
    async hecheng(jgid) {
        let info = await this.getInfo();
        info.dzItem = [];
        if (info.jgList[jgid] == null) {
            this.ctx.throw("参数错误");
        }
        if (info.jgList[jgid].jihuo == 1) {
            this.ctx.throw("已激活");
        }
        let cfgInfo = gameCfg_1.default.jingguaiInfo.getItemCtx(this.ctx, jgid);
        if (cfgInfo.hecheng > info.jgList[jgid].chip) {
            this.ctx.throw("碎片不足");
        }
        info.jgList[jgid].chip -= cfgInfo.hecheng;
        info.jgList[jgid].jihuo = 1;
        info.jgList[jgid].level = 1;
        info.dzItem.push([19, parseInt(jgid), 1]);
        await this.update(info);
        await hook_1.hookNote(this.ctx, "jghasnum", Object.keys(info.jgList).length);
    }
    /**
    *  增加碎片
    */
    async addChip(jgid, count) {
        let info = await this.getInfo();
        if (info.jgList[jgid] == null) {
            info.jgList[jgid] = {
                jihuo: 0,
                level: 0,
                chip: 0 //精怪碎片
            };
        }
        info.jgList[jgid].chip += count;
        await this.update(info);
    }
}
exports.ActJingGuaiModel = ActJingGuaiModel;
//# sourceMappingURL=ActJingGuaiModel.js.map