"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clubNameCheck = void 0;
const setting_1 = __importDefault(require("../crontab/setting"));
const gameMethod_1 = require("../../common/gameMethod");
const mongodb_1 = require("./mongodb");
/**
 * 重名处理
 */
class NameCheck {
    constructor(tbanme) {
        this.tbanme = tbanme;
        //检查这张表的索引?
    }
    /**
     * 设置一个名字 , 如果重名 返回失败
     * 如果没有重名  直接设置掉
     * @param sid 区服id
     * @param id 身份id(uuid/clubId)
     * @param name 名字
     * @returns
     */
    async setName(sid, id, name) {
        //连接数据库
        let db = mongodb_1.dbSev.getDataDb();
        //重名检查 不需要跨服 策划说的
        //得到本区相同的名字  名字存在
        let findName = await db.findOne(this.tbanme, { sid: sid, name: name });
        if (gameMethod_1.gameMethod.isEmpty(findName) == false && id != findName.id) {
            return false;
        }
        //名字不存在  update(插入或更新)
        await db.update(this.tbanme, { sid: sid, id: id }, { name: name }, true);
        return true;
    }
    /**
     * 模糊查询(玩家/公会)名字
     * @param sid 区服id
     * @param name 名字
     * @returns
     */
    async fuzzyFind(sid, name) {
        let db = mongodb_1.dbSev.getDataDb();
        //模糊查询
        let query = {};
        if (sid != null) {
            //限制区服
            query['sid'] = { $in: setting_1.default.getHeSids(sid) };
        }
        query['name'] = { $regex: name };
        let result = await db.findLimit(this.tbanme, query, {}, 100); //模糊查询所有区服
        //模糊查询的所有名字
        let fuzzyFindId = [];
        for (let i = 0; i < result.length; i++) {
            fuzzyFindId.push(result[i].id);
        }
        return fuzzyFindId;
    }
}
//玩家名
// export let nameCheck: NameCheck = new NameCheck("username");
//公会名
exports.clubNameCheck = new NameCheck("clubname");
//# sourceMappingURL=nameCheck.js.map