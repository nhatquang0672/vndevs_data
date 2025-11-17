"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActBaoShiModel = void 0;
const AModel_1 = require("../AModel");
const master_1 = require("../../util/master");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const hook_1 = require("../../util/hook");
const game_1 = __importDefault(require("../../util/game"));
const tool_1 = require("../../util/tool");
/**
 * 宝石
 */
class ActBaoShiModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "act"; //数据库表名
        this.kid = "actBaoShi"; //用于存储key 和  输出1级key
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
    /**
     * 初始化单个星图
     * @param xtId
     */
    initXt(xtId) {
        let cfg = gameCfg_1.default.baoshiInfo.getItemCtx(this.ctx, xtId);
        let xqs = {};
        for (let index = 1; index <= cfg.xzs.length; index++) {
            xqs[index.toString()] = {
                iid: "",
            };
        }
        return {
            xqs: xqs,
            level: 1,
        };
    }
    //初始化
    init() {
        let cfg = gameCfg_1.default.baoshiInfo.getItemCtx(this.ctx, "1");
        let xqs = {};
        for (let index = 1; index <= cfg.xzs.length; index++) {
            xqs[index.toString()] = "";
        }
        return {
            list: {
                "1": this.initXt("1")
            },
            items: {},
            tssx: { "jiyun": 0, "shanbi": 0, "lianji": 0, "fanji": 0, "baoji": 0 },
            tskx: { "hsjiyun": 0, "hsshanbi": 0, "hslianji": 0, "hsfanji": 0, "hsbaoji": 0 },
            iid: 0,
            ver: 1,
            zuojia: 0 //作假次数
        };
    }
    async getInfo() {
        let info = await super.getInfo();
        if (info.ver != 1) {
            info = this.init();
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
     * 返回数据
     */
    async addItem(id) {
        let info = await this.getInfo();
        info.iid += 1;
        info.items[info.iid.toString()] = id;
        await this.update(info);
        await this.ctx.state.master.addWin("baoshi", id);
    }
    /**
     * 返回数据
     */
    async setZuoJia(count) {
        let info = await this.getInfo();
        info.zuojia += count;
        await this.update(info, ['']);
    }
    /**
     * 宝石合成
     */
    async hecheng(iids) {
        let info = await this.getInfo();
        let level = 0;
        if (iids.length != 3) {
            this.ctx.throw("参数错误");
        }
        for (const _iid of iids) {
            if (info.items[_iid] == null) {
                this.ctx.throw("道具不足");
            }
            //下掉
            for (const xtId in info.list) {
                for (const wwzid in info.list[xtId].xqs) {
                    if (info.list[xtId].xqs[wwzid].iid == _iid) {
                        info.list[xtId].xqs[wwzid].iid = "";
                    }
                }
            }
            let id = info.items[_iid];
            delete info.items[_iid];
            let cfgLv = gameCfg_1.default.baoshiItem.getItemCtx(this.ctx, id).level;
            if (level == 0) {
                level = cfgLv;
                continue;
            }
            if (level != cfgLv) {
                this.ctx.throw("参数错误!");
            }
        }
        let cfgList = gameCfg_1.default.baoshiItemList.getItemList((level + 1).toString());
        if (cfgList == null) {
            this.ctx.throw("已满级!");
            return;
        }
        let chou = [];
        for (const key in cfgList) {
            chou.push([cfgList[key].id, 1]);
        }
        let item = game_1.default.getProbByItems(chou, 0, 1);
        if (item == null) {
            this.ctx.throw("合成失败!");
        }
        await this.update(info);
        await this.ctx.state.master.addItem1([9, item[0], 1], "bsitems");
        await hook_1.hookNote(this.ctx, "stoneHeCheng", 1);
    }
    /**
     * 宝石批量合成
     * 点击自动合成以后，弹出自动合成选择界面，玩家可以选择2~7级以下（不含当前选择等级）的星魂进行自动合成。
     */
    async plhecheng(level) {
        let baoshis = {};
        let info = await this.getInfo();
        let ciids = []; //穿戴的iids 
        //统计镶嵌的
        for (const xtId in info.list) {
            for (const wwzid in info.list[xtId].xqs) {
                if (info.list[xtId].xqs[wwzid].iid != "") {
                    ciids.push(info.list[xtId].xqs[wwzid].iid);
                }
            }
        }
        //统计可合的
        for (const _iid in info.items) {
            let bsid = info.items[_iid]; //宝石ID
            let cfgBs = gameCfg_1.default.baoshiItem.getItemCtx(this.ctx, bsid);
            if (cfgBs.level >= level) {
                continue;
            }
            if (ciids.indexOf(_iid) != -1) {
                continue; //穿戴的不合
            }
            if (baoshis[cfgBs.level.toString()] == null) {
                baoshis[cfgBs.level.toString()] = [];
            }
            baoshis[cfgBs.level.toString()].push(_iid);
        }
        let dels = []; //最终要删除的宝石iid 
        let adds = []; //要新增的等级宝石
        //合成
        for (let _lv = 1; _lv < level; _lv++) {
            while (baoshis[_lv.toString()] != null && baoshis[_lv.toString()].length >= 3) {
                let p1 = baoshis[_lv.toString()].pop();
                let p2 = baoshis[_lv.toString()].pop();
                let p3 = baoshis[_lv.toString()].pop();
                let nextLv = _lv + 1;
                if (baoshis[nextLv.toString()] == null) {
                    baoshis[nextLv.toString()] = [];
                }
                baoshis[nextLv.toString()].push("0");
                if (p1 != "0" && p1 != null) {
                    dels.push(p1);
                }
                if (p2 != "0" && p2 != null) {
                    dels.push(p2);
                }
                if (p3 != "0" && p3 != null) {
                    dels.push(p3);
                }
            }
        }
        //合成完之后,统计要新增的宝石等级
        for (const _lv in baoshis) {
            for (const _iid of baoshis[_lv]) {
                if (_iid == "0") {
                    adds.push(parseInt(_lv));
                }
            }
        }
        //删除
        for (const _iid of dels) {
            delete info.items[_iid];
        }
        //生成
        let items = [];
        for (const _lv of adds) {
            let cfgList = gameCfg_1.default.baoshiItemList.getItemList(_lv.toString());
            if (cfgList == null) {
                this.ctx.throw("生成异常");
                return;
            }
            let chou = [];
            for (const key in cfgList) {
                chou.push([cfgList[key].id, 1]);
            }
            let item = game_1.default.getProbByItems(chou, 0, 1);
            if (item == null) {
                this.ctx.throw("生成异常!");
            }
            items.push([9, item[0], 1]);
        }
        if (items.length <= 0) {
            this.ctx.throw("无星魂可合成");
        }
        await this.update(info);
        await this.ctx.state.master.addItem2(items);
        if (this.ctx.state.master.backBuf.win == null) {
            this.ctx.state.master.backBuf.win = {};
        }
        delete this.ctx.state.master.backBuf.win.baoshi;
        await hook_1.hookNote(this.ctx, "stoneHeCheng", items.length);
    }
    /**
     * 星图激活
     */
    async jihuo(xtid) {
        let info = await this.getInfo();
        if (info.list[xtid] != null) {
            this.ctx.throw("已激活");
        }
        let cfg = gameCfg_1.default.baoshiInfo.getItemCtx(this.ctx, xtid);
        if (cfg.need2 > 0) {
            await this.ctx.state.master.subItem1([1, 1, cfg.need2]);
        }
        let allNengLiang = 0; //总能量
        if (info.list[(parseInt(xtid) - 1).toString()] == null) {
            this.ctx.throw("前置未激活");
        }
        for (const _xtid in info.list) {
            for (const wzid in info.list[_xtid].xqs) {
                let iid = info.list[_xtid].xqs[wzid].iid;
                if (iid == "") {
                    continue;
                }
                let _itemid = info.items[iid];
                let cfgBsItem = gameCfg_1.default.baoshiItem.getItem(_itemid);
                if (cfgBsItem == null) {
                    continue;
                }
                //取星图对应 宝石有效等级上限
                let maxLv = cfgBsItem.level;
                let cfgBsStep = gameCfg_1.default.baoshiStep.getItem(_xtid, info.list[_xtid].level.toString());
                if (cfgBsStep != null) {
                    maxLv = Math.min(maxLv, cfgBsStep.lvMax);
                }
                //获取能量
                let cfgBsitem1 = gameCfg_1.default.baoshiByXzAndLv.getItem(cfgBsItem.xingzhuang.toString(), maxLv.toString());
                if (cfgBsitem1 != null) {
                    allNengLiang += cfgBsitem1.nengliang;
                }
            }
        }
        if (allNengLiang < cfg.need1) {
            this.ctx.throw("能量不足");
        }
        info.list[xtid] = this.initXt(xtid);
        await this.update(info);
        await hook_1.hookNote(this.ctx, "baoshiJihuo", Object.keys(info.list).length);
    }
    /**
     * 星图镶嵌宝石
     */
    async xiangqian(xtid, wzid, iid) {
        let info = await this.getInfo();
        if (info.list[xtid] == null) {
            this.ctx.throw("未激活");
        }
        if (info.list[xtid].xqs[wzid] == null) {
            this.ctx.throw("参数错误");
        }
        if (info.items[iid] == null) {
            this.ctx.throw("宝石不足");
        }
        let itemId = info.items[iid];
        let level = gameCfg_1.default.baoshiItem.getItemCtx(this.ctx, itemId).level;
        let cfgStep = gameCfg_1.default.baoshiStep.getItemCtx(this.ctx, xtid, info.list[xtid].level.toString());
        if (level < cfgStep.lvMin) {
            this.ctx.throw("宝石等级太低");
        }
        for (const _xtid in info.list) {
            for (const _wzid in info.list[_xtid].xqs) {
                if (info.list[_xtid].xqs[_wzid].iid == iid) {
                    info.list[_xtid].xqs[_wzid].iid = "";
                }
            }
        }
        info.list[xtid].xqs[wzid].iid = iid;
        await this.update(info);
        await hook_1.hookNote(this.ctx, "stoneXiangQian", 1);
    }
    /**
     * 星图宝石互换
     */
    async huhuan(xtid, wzid, wzid1) {
        let info = await this.getInfo();
        if (info.list[xtid] == null) {
            this.ctx.throw("未激活");
        }
        if (info.list[xtid].xqs[wzid] == null || info.list[xtid].xqs[wzid1] == null) {
            this.ctx.throw("参数错误");
        }
        [info.list[xtid].xqs[wzid].iid, info.list[xtid].xqs[wzid1].iid] = [info.list[xtid].xqs[wzid1].iid, info.list[xtid].xqs[wzid].iid];
        await this.update(info);
    }
    /**
     * 星图卸下宝石
     */
    async xiexia(xtid, xb) {
        let info = await this.getInfo();
        if (info.list[xtid] == null || info.list[xtid].xqs[xb] == null) {
            this.ctx.throw("未激活");
        }
        if (info.list[xtid].xqs[xb].iid == "") {
            this.ctx.throw("已卸下");
        }
        info.list[xtid].xqs[xb].iid = "";
        await this.update(info);
    }
    /**
     * 星图升阶
     */
    async upLevel(xtid) {
        let info = await this.getInfo();
        if (info.list[xtid] == null) {
            this.ctx.throw("未激活");
        }
        let cfgNext = gameCfg_1.default.baoshiStep.getItem(xtid, (info.list[xtid].level + 1).toString());
        if (cfgNext == null) {
            this.ctx.throw("已满级");
        }
        let cfg = gameCfg_1.default.baoshiStep.getItemCtx(this.ctx, xtid, info.list[xtid].level.toString());
        await this.ctx.state.master.subItem2(cfg.need);
        info.list[xtid].level += 1;
        await this.update(info);
        await this.ctx.state.master.addWin("msg", "升阶成功");
    }
    /**
     * 宝石重铸
     */
    async chongzhu(iid) {
        let info = await this.getInfo();
        if (info.items[iid] == null) {
            this.ctx.throw("参数错误");
        }
        let subitem = tool_1.tool.mathcfg_item(this.ctx, "baoshi_chongzhu");
        await this.ctx.state.master.subItem1(subitem);
        for (const xtId in info.list) {
            for (const wzid in info.list[xtId].xqs) {
                if (info.list[xtId].xqs[wzid].iid == iid) {
                    info.list[xtId].xqs[wzid].iid = "";
                }
            }
        }
        let itemId = info.items[iid];
        let level = gameCfg_1.default.baoshiItem.getItemCtx(this.ctx, itemId).level;
        let cfgList = gameCfg_1.default.baoshiItemList.getItemListCtx(this.ctx, level.toString());
        let chou = [];
        for (const key in cfgList) {
            chou.push(cfgList[key].id);
        }
        if (chou.length <= 0) {
            this.ctx.throw("抽取失败");
        }
        let getId = game_1.default.getRandArr(chou, 1)[0];
        delete info.items[iid];
        await this.update(info);
        await this.ctx.state.master.addItem1([9, parseInt(getId), 1]);
    }
    /**
     * 特殊属性解锁
     * @param key 属性key
     */
    async sxJiesuo(key) {
        let info = await this.getInfo();
        if (info.tssx[key] == null) {
            this.ctx.throw("参数错误");
        }
        if (info.tssx[key] != 0) {
            this.ctx.throw("已经解锁");
        }
        let count = 0;
        for (const _key in info.tssx) {
            if (info.tssx[_key] == 0) {
                count += 1;
            }
        }
        if (count == 0) {
            this.ctx.throw("都已经解锁了");
        }
        let need = gameCfg_1.default.baoshiTssx.getItemCtx(this.ctx, "1", (6 - count).toString()).need;
        if (need > 0) {
            await this.ctx.state.master.subItem1([1, 1, need]);
            info.tssx[key] = 1;
        }
        else {
            info.tssx[key] = 2;
        }
        await this.update(info);
    }
    /**
     * 特殊属性使用
     * @param key 属性key
     */
    async sxUse(key) {
        let info = await this.getInfo();
        if (info.tssx[key] == null) {
            this.ctx.throw("参数错误");
        }
        if (info.tssx[key] == 0) {
            this.ctx.throw("未解锁");
        }
        for (const _key in info.tssx) {
            if (info.tssx[_key] == 2) {
                info.tssx[_key] = 1;
            }
        }
        info.tssx[key] = 2;
        await this.update(info);
    }
    /**
     * 特殊属性解锁
     * @param key 属性key
     */
    async kxJiesuo(key) {
        let info = await this.getInfo();
        if (info.tskx[key] == null) {
            this.ctx.throw("参数错误");
        }
        if (info.tskx[key] != 0) {
            this.ctx.throw("已经解锁");
        }
        let count = 0;
        for (const _key in info.tskx) {
            if (info.tskx[_key] == 0) {
                count += 1;
            }
        }
        if (count == 0) {
            this.ctx.throw("都已经解锁了");
        }
        let need = gameCfg_1.default.baoshiTssx.getItemCtx(this.ctx, "2", (6 - count).toString()).need;
        if (need > 0) {
            await this.ctx.state.master.subItem1([1, 1, need]);
        }
        info.tskx[key] = 1;
        await this.update(info);
    }
    /**
     * 特殊属性使用
     * @param xtid 星图ID
     * @param key 属性key
     */
    async kxUse(key) {
        let info = await this.getInfo();
        if (info.tskx[key] == null) {
            this.ctx.throw("参数错误");
        }
        if (info.tskx[key] == 0) {
            this.ctx.throw("未解锁");
        }
        for (const _key in info.tskx) {
            if (info.tskx[_key] == 2) {
                info.tskx[_key] = 1;
            }
        }
        info.tskx[key] = 2;
        await this.update(info);
    }
}
exports.ActBaoShiModel = ActBaoShiModel;
//# sourceMappingURL=ActBaoShiModel.js.map