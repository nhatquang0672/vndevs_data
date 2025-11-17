"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SevChatModel = void 0;
const Xys = __importStar(require("../../../common/Xys"));
const master_1 = require("../../util/master");
const AModel_1 = require("../AModel");
const SevAdokClubModel_1 = require("./SevAdokClubModel");
const setting_1 = __importDefault(require("../../crontab/setting"));
const gameMethod_1 = require("../../../common/gameMethod");
/**
 * 聊天信息
 */
class SevChatModel extends AModel_1.AModel {
    constructor() {
        super(...arguments);
        this.table = "chat"; //数据库表名
        this.kid = "chat"; //用于存储key 和  输出1级key
        this.outIsAu = true; //下发数据是否用au下发
        this.dType = master_1.DataType.sev;
    }
    outKey2() {
        return this.hdcid; //输出2级key
    }
    init() {
        return {
            list: {},
            id: 0,
        };
    }
    //单例模式
    static getInstance(ctx, clubId, hdcid = "1") {
        let dlKey = this.name + "_" + clubId + "_" + hdcid; //单例模式key
        if (!ctx.state.model[dlKey]) {
            ctx.state.model[dlKey] = new this(ctx, clubId, hdcid);
        }
        return ctx.state.model[dlKey];
    }
    /**
     * 初始化下发 a全下发 (实际只下发最后10~20条)
     */
    async getOutPut() {
        let info = await this.getInfo();
        let opt = {};
        for (let i = info.id - 20; i <= info.id; i++) {
            if (info.list[i] == null) {
                continue;
            }
            opt[i] = gameMethod_1.gameMethod.objCopy(info.list[i]);
            //替换
            if (opt[i].type != "1") {
                continue;
            }
            let fuuid = opt[i].user.uuid;
            if (setting_1.default.isBan(fuuid, "1", this.ctx.state.newTime) == true) {
                opt[i].msg = "虚假广告套路深,大侠们莫当真";
                continue;
            }
            if (setting_1.default.isBan(fuuid, "2", this.ctx.state.newTime) == true) {
                opt[i].msg = "虚假广告套路深,大侠们莫当真";
                continue;
            }
            if (setting_1.default.isBan(opt[i].user.uid, "3", this.ctx.state.newTime) == true) {
                opt[i].msg = "虚假广告套路深,大侠们莫当真";
                continue;
            }
        }
        return opt;
    }
    /**
     * 下发执行条目
     * @param key
     * @returns
     */
    async getOutPut_u(key) {
        let info = await this.getInfo();
        let opt = gameMethod_1.gameMethod.objCopy(info.list[key]);
        //替换
        if (opt.type == "1") {
            let fuuid = opt.user.uuid;
            if (setting_1.default.isBan(fuuid, "1", this.ctx.state.newTime) == true) {
                opt.msg = "虚假广告套路深,大侠们莫当真";
            }
            else if (setting_1.default.isBan(fuuid, "2", this.ctx.state.newTime) == true) {
                opt.msg = "虚假广告套路深,大侠们莫当真";
            }
            else if (setting_1.default.isBan(opt.user.uid, "3", this.ctx.state.newTime) == true) {
                opt.msg = "虚假广告套路深,大侠们莫当真";
            }
        }
        return opt;
    }
    /**
     * 获取历史信息
     * @param id
     */
    async backData_history(id) {
        let ids = [];
        let info = await this.getInfo();
        for (let index = id - 10; index < id; index++) {
            if (info.list[index] == null) {
                continue;
            }
            ids.push(index.toString());
        }
        await this.backData_u(ids);
    }
    /**
     * 获取历史信息
     * @param id
     */
    async backData_clear() {
        let outf = {};
        outf[this.kid] = {};
        let _key2 = this.outKey2();
        outf[this.kid][_key2] = {};
        outf[this.kid][_key2]["a"] = {};
        this.ctx.state.master.addBackBuf(outf);
        let info = await this.getInfo();
        await this.backData_history(info.id + 1);
    }
    /**
     * 添加聊天记录
     * 保留 100 条记录
     */
    async add(data) {
        let info = await this.getInfo();
        info.id += 1;
        data.id = info.id;
        info.list[info.id] = data;
        if (info.list[info.id - 100] != null) {
            delete info.list[info.id - 100];
        }
        await this.update(info, [""]);
    }
    //所有更新 必须经过这个函数
    async update(info, keys = []) {
        await super.update(info, keys);
        switch (this.hdcid) {
            case Xys.ChannelType.club: //公会聊天
                //通知adok 更新
                let sevAdokClubModel = SevAdokClubModel_1.SevAdokClubModel.getInstance(this.ctx, this.id);
                await sevAdokClubModel.setVer("clubChat", info.id);
                break;
        }
    }
    /**
     * 根据我的消息ID 下发聊天信息
     * 返回当前历史信息ID
     */
    async clickBackData_ByMyid(myid) {
        let info = await this.getInfo();
        info.id; //当前最新
        myid; //我的历史
        //从 myid+1 到  info.id 全部下发
        //如果 总数 > 50 就a更新最新的10条 刷掉全部
        if (info.id <= myid) {
            //没有更新消息
            return info.id;
        }
        if (myid == 0 || info.id - myid > 10) {
            //太多重新下发数据
            await this.backData_clear();
            // await this.backData(); //-------全更新----------
        }
        else {
            //U更新指定信息
            let ids = [];
            for (let i = myid + 1; i <= info.id; i++) {
                ids.push(i.toString());
            }
            await this.backData_u(ids); //-----更新指定条目------------
        }
        return info.id;
    }
}
exports.SevChatModel = SevChatModel;
//# sourceMappingURL=SevChatModel.js.map