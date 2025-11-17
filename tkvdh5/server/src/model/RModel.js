"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RModel = void 0;
const redis_1 = require("../util/redis");
const game_1 = __importDefault(require("../util/game"));
const master_1 = require("../util/master");
const setting_1 = __importDefault(require("../crontab/setting"));
const gameMethod_1 = require("../../common/gameMethod");
//排行类基类 
class RModel {
    /**
     * 构造函数
     * @param kid 业务key
     * @param hdcid 分组ID / 业务ID
     * @param id   区服ID/公会ID
     * @param hid   重置ID
     */
    constructor(kid, hdcid, id, hid) {
        this.dType = master_1.DataType.rds; //数据类型  user：个人数据  sev区服数据
        //排序顺序
        this._sortType = 1; //排序方式，1代表降序，-1代表升序  ，默认是降序
        this.Hdcids = ["x", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "n", "m"];
        this.kid = kid;
        this.hdcid = hdcid;
        this.id = id;
        this.hid = hid;
        let cfgSysHefu = setting_1.default.getSetting("1", "sys_hefu");
        if (cfgSysHefu != null && cfgSysHefu.keys.indexOf(kid) != -1) {
            if (cfgSysHefu.list[id] != null) {
                if (hdcid == "old") {
                    this.hdcid = cfgSysHefu.list[id].oldx;
                }
                else {
                    this.hdcid = cfgSysHefu.list[id].newx;
                }
            }
        }
    }
    getKey() {
        return this.id + '_' + this.kid + '_' + this.hdcid + '_' + this.hid;
    }
    async getOutPut(ctx, min, max) {
        let outf = {};
        let get20 = await this.getRankBetween(min, max);
        let rid = min;
        for (let i = 0; i < get20.length; i += 2) {
            outf[rid.toString()] = await this.getInfo(ctx, get20[i], rid, get20[i + 1]);
            rid++;
        }
        return outf;
    }
    //u下发
    async backData_u(ctx, min, max) {
        let outPut = await this.getOutPut(ctx, min, max);
        let outf = {};
        outf[this.kid] = {};
        if (this.Hdcids.indexOf(this.hdcid) != -1) {
            outf[this.kid]["u"] = outPut;
        }
        else {
            outf[this.kid][this.hdcid] = {};
            outf[this.kid][this.hdcid]["u"] = outPut;
        }
        ctx.state.master.addBackBuf(outf);
    }
    async backData_my(ctx, member) {
        let rid = await this.zRevrank(member);
        let score = Math.ceil(parseFloat(await this.zScore(member)));
        let MyKey = this.kid + 'My';
        let outf = {};
        outf[MyKey] = {};
        if (this.Hdcids.indexOf(this.hdcid) != -1) {
            outf[MyKey] = {
                rid: rid == null ? 0 : rid + 1,
                score: rid == null ? 0 : score,
            };
        }
        else {
            outf[MyKey][this.hdcid] = {};
            outf[MyKey][this.hdcid] = {
                rid: rid == null ? 0 : rid + 1,
                score: rid == null ? 0 : score,
            };
        }
        ctx.state.master.addBackBuf(outf);
    }
    /**
     * 通过排名获取getInfo信息
     */
    async getInfoByRid(ctx, rid) {
        let get20 = await this.getRankBetween(rid, rid);
        if (gameMethod_1.gameMethod.isEmpty(get20)) {
            get20 = ["500", "500"];
            // ctx.throw(`RModel getInfoByRid_err key:${this.getKey()} rid:${rid}`);
        }
        return await this.getInfo(ctx, get20[0], rid, get20[1]);
    }
    /**
     *
     * 输出以排名为key的排名数据 通过排名获取
     */
    async getRankBetween(start, end) {
        let strArr;
        if (this._sortType == 1) {
            strArr = await redis_1.redisSev.getRedis(this.dType).zRevrangeWithScores(this.getKey(), start - 1, end - 1);
        }
        else {
            strArr = await redis_1.redisSev.getRedis(this.dType).zRangeWithScores(this.getKey(), start - 1, end - 1);
        }
        return strArr;
    }
    /**
     *
     * 输出以排名为key的排名数据  通过score获取
     */
    async getScoreBetween(start, end) {
        let strArr;
        if (this._sortType == 1) {
            strArr = await redis_1.redisSev.getRedis(this.dType).zRangeByScore(this.getKey(), start, end);
        }
        else {
            strArr = await redis_1.redisSev.getRedis(this.dType).zRangeByScorewithScore(this.getKey(), start, end);
        }
        return strArr;
    }
    //更新我的分值(会生成小数点)
    async zSet(member, score) {
        score = this.scorePoint(score);
        await redis_1.redisSev.getRedis(this.dType).zAdd(this.getKey(), score, member);
    }
    //更新我的分值（直接设置值）
    async zSetVal(member, score) {
        await redis_1.redisSev.getRedis(this.dType).zAdd(this.getKey(), score, member);
    }
    //批量更新我的分值（直接设置值）
    async zSetVals(arr) {
        await redis_1.redisSev.getRedis(this.dType).zAddArr(this.getKey(), arr);
    }
    //删除榜单
    async del(key) {
        await redis_1.redisSev.getRedis(this.dType).del(key);
    }
    //更新我的分值
    async zAdd(member, score) {
        score = this.scorePoint(score);
        let oldScore = await this.zScore(member);
        if (oldScore == null) {
            oldScore = '0';
        }
        await redis_1.redisSev.getRedis(this.dType).zAdd(this.getKey(), Math.ceil(parseFloat(oldScore)) + score, member);
    }
    /**
     * 更新列表
     * @param arr [score,member,score,member,....]
     */
    async zAddArr(arr) {
        await redis_1.redisSev.getRedis(this.dType).zAddArr(this.getKey(), arr);
    }
    //获取列表个数
    async zCount(start = "-inf", end = "+inf") {
        let num = await redis_1.redisSev.getRedis(this.dType).zCount(this.getKey(), start, end);
        return num;
    }
    //删除
    async zDel(member) {
        await redis_1.redisSev.getRedis(this.dType).zRem(this.getKey(), member);
    }
    /**
     * 分值 + 小数点
     */
    scorePoint(score) {
        return score < 9000000 ? score - game_1.default.getNowTime() / 10000000000 : score;
    }
    /**
     * 获取我的名次
     */
    async zRevrank(member) {
        if (this._sortType == 1) {
            return await redis_1.redisSev.getRedis(this.dType).zRevrank(this.getKey(), member);
        }
        else {
            return await redis_1.redisSev.getRedis(this.dType).zRank(this.getKey(), member);
        }
    }
    /**
    * 根据排名id获取成员
    * @param rid 排名id
    */
    async getMemberByRid(rid) {
        let member;
        if (this._sortType == 1) {
            //从大到小
            member = await redis_1.redisSev.getRedis(this.dType).zRevrange(this.getKey(), rid - 1, rid - 1); //下标从0开始
        }
        else {
            //从小到大
            member = await redis_1.redisSev.getRedis(this.dType).zRange(this.getKey(), rid - 1, rid - 1); //下标从0开始
        }
        if (member.length == 0) {
            return "";
        }
        return member[0];
    }
    /**
     * 获取我的分值
     */
    async zScore(member) {
        return await redis_1.redisSev.getRedis(this.dType).zScore(this.getKey(), member);
    }
}
exports.RModel = RModel;
//# sourceMappingURL=RModel.js.map