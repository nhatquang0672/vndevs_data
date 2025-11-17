"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SevDtNpcModel = void 0;
const LModel_1 = require("../LModel");
const master_1 = require("../../util/master");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
const game_1 = __importDefault(require("../../util/game"));
const tool_1 = require("../../util/tool");
/**
 * 洞天NPC
 */
class SevDtNpcModel extends LModel_1.LModel {
    constructor() {
        super(...arguments);
        this.table = "dtNpc"; //数据库表名
        this.kid = "dtNpcList"; //用于存储key 和  输出1级key
        this.dType = master_1.DataType.system;
    }
    //单例模式
    static getInstance(ctx, sid) {
        let dlKey = this.name + '_' + sid; //单例模式key
        if (!ctx.state.model[dlKey]) {
            ctx.state.model[dlKey] = new this(ctx, sid);
        }
        return ctx.state.model[dlKey];
    }
    outKey2() {
        return ""; //输出2级key
    }
    //初始化
    init() {
        return {
            level: 0,
            cars: {},
            adokCars: 0,
            ver: 2 //刷新空闲矿车
        };
    }
    async getOutPut() {
        let infoList = await this.getInfoList();
        let outf = {};
        for (const npcId in infoList) {
            outf[npcId] = infoList[npcId];
        }
        return outf;
    }
    async getOutPut_u(npcId) {
        let info = await this.getInfo(npcId);
        return info;
    }
    async getInfo(npcId) {
        let info = await super.getInfo(npcId);
        let isUpdate = false;
        let cfg_carMax = tool_1.tool.mathcfg_count(this.ctx, "dongtian_carMax");
        let cfgNpc = gameCfg_1.default.dongtianNpc.getItemCtx(this.ctx, npcId);
        if (info == null) {
            info = this.init();
            for (let index = 1; index <= cfg_carMax; index++) {
                info.cars[index.toString()] = this.getOneCar('3', cfgNpc.dtlv, index.toString());
            }
            info.level = cfgNpc.level;
            isUpdate = true;
        }
        //刷车CD
        let cfg_carcd = Math.ceil(gameCfg_1.default.dongtianLevel.getItemCtx(this.ctx, cfgNpc.dtlv.toString()).carCd * 0.8);
        let minEtime = this.ctx.state.newTime;
        for (const pos in info.cars) {
            if (info.cars[pos].etime == 0) {
                continue; //还没开始
            }
            if (info.cars[pos].etime <= this.ctx.state.newTime) {
                minEtime = Math.min(minEtime, info.cars[pos].etime);
                delete info.cars[pos];
                isUpdate = true;
            }
        }
        if (Object.keys(info.cars).length < cfg_carMax && info.adokCars <= this.ctx.state.newTime) {
            if (info.adokCars == 0) {
                info.adokCars = minEtime;
            }
            else {
                info.adokCars = Math.min(info.adokCars - cfg_carcd, minEtime);
            }
            //最大可获得几个矿车
            let getNum = Math.floor((this.ctx.state.newTime - info.adokCars) / cfg_carcd);
            getNum = Math.min(getNum, cfg_carMax - Object.keys(info.cars).length);
            let addNum = getNum;
            if (getNum > 0) {
                for (let index = 1; index <= cfg_carMax; index++) {
                    if (getNum <= 0) {
                        break;
                    }
                    if (info.cars[index.toString()] != null) {
                        continue;
                    }
                    getNum--;
                    info.cars[index.toString()] = this.getOneCar('3', cfgNpc.dtlv, index.toString());
                    isUpdate = true;
                }
            }
            //没补满 计算下一个矿车的adok时间
            if (Object.keys(info.cars).length < cfg_carMax) {
                info.adokCars += cfg_carcd * (addNum + 1);
                isUpdate = true;
            }
            else {
                info.adokCars = 0;
            }
        }
        if (info.ver != 2) {
            info.ver = 2;
            for (const pos in info.cars) {
                if (info.cars[pos].etime != 0) {
                    continue; //开始了
                }
                info.cars[pos] = this.getOneCar('3', cfgNpc.dtlv, pos.toString());
            }
            isUpdate = true;
        }
        if (isUpdate) {
            await this.update(npcId, info, false);
        }
        //满了不倒计时
        if (Object.keys(info.cars).length >= cfg_carMax) {
            info.adokCars = 0;
        }
        return info;
    }
    /**
     * 设置位置信息
     * @param npcId
     * @param pos
     * @param posInfo
     */
    async setPostInfo(npcId, pos, posInfo) {
        let info = await this.getInfo(npcId);
        info.cars[pos] = posInfo;
        await this.update(npcId, info, false);
    }
    //按照类型和等级 刷车 (刷NPC车直接用 '2' 调用) //1新手车 2NPC车 3普通车
    /**
     * 获取一辆矿车
     * @param type
     * @param level
     */
    getOneCar(type, level, pos) {
        if (level == null) {
            level = 1;
        }
        //所有车
        let allcars = gameCfg_1.default.dongtianCarList.getItemListCtx(this.ctx, type);
        let chou = [];
        for (const _id in allcars) {
            let p_num = allcars[_id].probLv1W[level - 2];
            if (p_num == null) {
                p_num = allcars[_id].probLv1W[0];
            }
            chou.push([allcars[_id].id, p_num, allcars[_id].lengs]);
        }
        let _item = game_1.default.getProbByItems(chou, 0, 1);
        if (_item == null) {
            this.ctx.throw("抽取矿车失败" + this.id);
        }
        //随机位置
        let dpos = game_1.default.rand(_item[2][0], _item[2][1]);
        return {
            id: _item[0],
            pos: pos,
            dpos: dpos,
            stime: 0,
            etime: 0,
            my: {
                user: null,
                knum: 0,
                pow: 0,
                fevCard: false,
                pfid: "",
            },
            he: {
                user: null,
                knum: 0,
                pow: 0,
                fevCard: false,
                pfid: "",
            },
            pklog: [],
        };
    }
}
exports.SevDtNpcModel = SevDtNpcModel;
//# sourceMappingURL=SevDtNpcModel.js.map