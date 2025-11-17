"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailModel = void 0;
const LModel_1 = require("../LModel");
const mongodb_1 = require("../../util/mongodb");
const master_1 = require("../../util/master");
const gameCfg_1 = __importDefault(require("../../../common/gameCfg"));
/**
 * 邮件模块
 */
class MailModel extends LModel_1.LModel {
    constructor() {
        super(...arguments);
        this.table = "mail"; //数据库表名
        this.kid = "mailList"; //用于存储key 和  输出1级key
        this.dType = master_1.DataType.user;
    }
    //单例模式
    static getInstance(ctx, uuid) {
        let dlKey = this.name + '_' + uuid; //单例模式key
        if (!ctx.state.model[dlKey]) {
            ctx.state.model[dlKey] = new this(ctx, uuid);
        }
        return ctx.state.model[dlKey];
    }
    outKey2() {
        return ""; //输出2级key
    }
    //初始化
    init() {
        return {
            id: "",
            type: 0,
            title: "",
            content: "",
            items: [],
            fts: this.ctx.state.newTime,
            rts: 0,
            ets: this.ctx.state.newTime + 15 * 86400,
            dts: this.ctx.state.newTime + 30 * 86400 //过期时间
        };
    }
    async getOutPut() {
        let infoList = await this.getInfoList();
        let outf = {};
        for (const mailId in infoList) {
            if (infoList[mailId].ets < this.ctx.state.newTime) {
                continue;
            }
            outf[mailId] = infoList[mailId];
        }
        return outf;
    }
    async getOutPut_u(mailId) {
        let info = await this.getInfo(mailId);
        return info;
    }
    /**
     * 新增一封邮件
     * @param title
     * @param content
     * @param ets
     * @param items
     */
    async sendMail(title, content, items = [], type = 1, fts = this.ctx.state.newTime) {
        let mid = await mongodb_1.dbSev.getDataDb().getNextId('MAIL');
        let info = this.init();
        info.id = mid;
        info.title = title;
        info.content = content;
        info.items = items;
        info.type = type;
        info.fts = fts;
        info.ets = fts + 15 * 86400;
        info.dts = fts + 30 * 86400;
        await this.update(mid, info);
    }
    /**
     * 新增邮件 自动分离宠物
     */
    async sendMail_autofazhen(title, content, items = [], type = 1, fts = this.ctx.state.newTime) {
        let _items = [];
        //分离出宠物
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item[0] == 2) {
                //宠物单发 //一只一封邮件
                for (let j = 0; j < item[2]; j++) {
                    let _fzitem = [2, item[1], 1];
                    await this.sendMail(title, content, [_fzitem], type, fts);
                }
            }
            else {
                _items.push(item);
            }
        }
        //其他奖励
        await this.sendMail(title, content, _items, type, fts);
    }
    /**
    * 领取邮件奖励
    * @param mid
    */
    async redMail(mailId) {
        let info = await this.getInfo(mailId);
        if (info == null) {
            this.ctx.throw('邮件ID错误');
        }
        if (info.rts > 0) {
            this.ctx.throw('邮件已领取');
        }
        if (info.ets < this.ctx.state.newTime) {
            this.ctx.throw('邮件已过期');
        }
        info.rts = this.ctx.state.newTime;
        await this.update(mailId, info);
        await this.ctx.state.master.addItem2(info.items);
    }
    /**
    * 一键领取邮件奖励
    * @param mid
    */
    async redAllMail() {
        let infos = await this.getInfoList();
        for (const mid in infos) {
            if (infos[mid].rts > 0) {
                continue;
            }
            if (infos[mid].ets < this.ctx.state.newTime) {
                continue;
            }
            if (infos[mid].type != 2 && infos[mid].items.length > 0) {
                //过滤 红色兽灵自选
                let isPass = true;
                for (const _item of infos[mid].items) {
                    if (_item[0] == 1) {
                        let type = gameCfg_1.default.itemMoney.getItemCtx(this.ctx, _item[1].toString()).type;
                        if (type == "fazhen") {
                            isPass = false;
                            break;
                        }
                    }
                }
                if (isPass == false) {
                    continue;
                }
                await this.ctx.state.master.addItem2(infos[mid].items);
            }
            infos[mid].rts = this.ctx.state.newTime;
            await this.update(mid, infos[mid]);
        }
    }
    /**
    * 删除邮件
    * @param mid
    */
    async delMail(mailId) {
        let info = await this.getInfo(mailId);
        if (info == null) {
            this.ctx.throw('邮件ID错误');
        }
        if (info.rts <= 0) {
            this.ctx.throw('邮件未领取');
        }
        info.ets = this.ctx.state.new0;
        info.dts = this.ctx.state.new0 + 15 * 86400;
        await this.update(mailId, info, false);
        await this.backData_d([mailId]);
    }
    /**
    * 一键删除邮件
    */
    async delAllMail() {
        let infos = await this.getInfoList();
        for (const mid in infos) {
            if (infos[mid].rts <= 0 && infos[mid].type == 1 && infos[mid].items.length > 0) {
                continue; //点击后仅不删除带附件邮件，已读和未读的无附件邮件可删除
            }
            if (infos[mid].ets < this.ctx.state.newTime) {
                continue;
            }
            if (infos[mid].type == 2 && infos[mid].rts == 0) {
                continue;
            }
            infos[mid].rts = this.ctx.state.newTime;
            infos[mid].ets = this.ctx.state.new0;
            infos[mid].dts = this.ctx.state.new0 + 15 * 86400;
            await this.update(mid, infos[mid], false);
            await this.backData_d([mid]);
        }
    }
}
exports.MailModel = MailModel;
//# sourceMappingURL=MailModel.js.map