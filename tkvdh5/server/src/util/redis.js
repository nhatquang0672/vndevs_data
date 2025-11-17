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
exports.redisSev = void 0;
const redis = __importStar(require("redis"));
const tool_1 = require("./tool");
const game_1 = __importDefault(require("./game"));
const master_1 = require("./master");
//redis封装，管理redis连接，基本操作改等
class Redis {
    //构造函数
    constructor() {
        this._redisClient = null; //redis客户端
    }
    //连接函数
    connect(cfg) {
        return new Promise((reslove, reject) => {
            //连接redis服务器
            this._redisClient = redis.createClient(cfg.port, cfg.host, { password: cfg.passwd });
            this._redisClient.on("error", function (error) {
                console.log('===redis连接失败====', cfg.host + ':' + cfg.port);
                reject(error);
            });
            console.log('===redis连接成功====', cfg.host + ':' + cfg.port);
            reslove(true);
        });
    }
    /**
     * 插入或更新榜单数据(key不存在也会直接创建)
     * @param key 键
     * @param member 值
     * @param score  权重
     * @return 被成功添加的新成员的数量，不包括那些被更新的、已经存在的成员
     */
    async zAdd(key, score, member) {
        return new Promise((reslove, reject) => {
            if (this._redisClient == null) {
                reject("redis已经断开");
                return;
            }
            this._redisClient.zadd(key, score, member, (err, reply) => {
                if (err) {
                    reject(err);
                }
                else {
                    reslove(reply);
                }
            });
        });
    }
    /**
     * 插入或更新榜单数据(key不存在也会直接创建)
     * @param key 键
     * @param member 值
     * @param score  权重
     * @return 被成功添加的新成员的数量，不包括那些被更新的、已经存在的成员
     */
    async zAddArr(key, arr) {
        return new Promise((reslove, reject) => {
            if (this._redisClient == null) {
                reject("redis已经断开");
                return;
            }
            this._redisClient.zadd(key, arr, (err, reply) => {
                if (err) {
                    reject(err);
                }
                else {
                    reslove(reply);
                }
            });
        });
    }
    /**
     * 删除redisKey
     * @param key 键
     */
    async del(key) {
        //zadd key score member
        return new Promise((reslove, reject) => {
            if (this._redisClient == null) {
                //错误处理
                reject("redis已经断开");
                return;
            }
            this._redisClient.UNLINK(key, (err, reply) => {
                if (err) {
                    reject(err);
                }
                else {
                    reslove(reply);
                }
            });
        });
    }
    /**
     * 返回有序集个数
     * @param key 键
     * @return 返回集合中的个数，如果不存在返回0
     */
    zCard(key) {
        //zadd key score member
        return new Promise((reslove, reject) => {
            if (this._redisClient == null) {
                //错误处理
                reject("redis已经断开");
                return;
            }
            this._redisClient.zcard(key, (err, reply) => {
                if (err) {
                    reject(err);
                }
                else {
                    reslove(reply);
                }
            });
        });
    }
    /**
     * 返回key中的value对应的排名 升序
     * @param key 键
     * @param member 值
     * @return  存在返回number，不存在返回null，排名从0开始的
     */
    zRank(key, member) {
        return new Promise((reslove, reject) => {
            if (this._redisClient == null) {
                //错误处理
                reject("redis已经断开");
                return;
            }
            this._redisClient.zrank(key, member, (err, reply) => {
                if (err) {
                    reject(err);
                }
                else {
                    reslove(reply);
                }
            });
        });
    }
    /**
     * 返回key中的value对应的排名 降序
     * @param key 键
     * @param member 值
     * @return  存在返回number，不存在返回null，排名从0开始的
     */
    zRevrank(key, member) {
        return new Promise((reslove, reject) => {
            if (this._redisClient == null) {
                //错误处理
                reject("redis已经断开");
                return;
            }
            this._redisClient.zrevrank(key, member, (err, reply) => {
                if (err) {
                    reject(err);
                }
                else {
                    reslove(reply);
                }
            });
        });
    }
    /**
     * 模糊查询返回 key
     * @param key 键
     * @return  存在返回number，不存在返回null，排名从0开始的
     */
    getKeys(key = "*") {
        return new Promise((reslove, reject) => {
            if (this._redisClient == null) {
                //错误处理
                reject("redis已经断开");
                return;
            }
            this._redisClient.keys(key, (err, reply) => {
                if (err) {
                    reject(err);
                }
                else {
                    reslove(reply);
                }
            });
        });
    }
    /**
     * 删除所有key
     */
    delall() {
        return new Promise((reslove, reject) => {
            if (this._redisClient == null) {
                //错误处理
                reject("redis已经断开");
                return;
            }
            this._redisClient.FLUSHALL((err, reply) => {
                if (err) {
                    reject(err);
                }
                else {
                    reslove(reply);
                }
            });
        });
    }
    /**
     * 返回key中的value对应的权重
     * @param key 键
     * @param member 值
     * @return  不存在返回空,存在返回字符串
     */
    zScore(key, member) {
        return new Promise((reslove, reject) => {
            if (this._redisClient == null) {
                //错误处理
                reject("redis已经断开");
                return;
            }
            this._redisClient.zscore(key, member, (err, reply) => {
                if (err) {
                    reject(err);
                }
                else {
                    reslove(reply);
                }
            });
        });
    }
    /**
     * 获取名次范围，降序
     * @param key 集合名字
     * @param start 开始名次 从0开始
     * @param end 结束名次 如果要输出所有的话，那么end设置成-1
     * @return string[]，如果不存在返回的是[]
     */
    zRevrange(key, start, end) {
        return new Promise((reslove, reject) => {
            if (this._redisClient == null) {
                //错误处理
                reject("redis已经断开");
                return;
            }
            //事件复杂度 O(log(N)+M) N 有续集个数，m返回的个数
            return this._redisClient.zrevrange(key, start, end, (err, reply) => {
                if (err) {
                    reject(err);
                }
                else {
                    reslove(reply);
                }
            });
        });
    }
    /**
     * 获取名次范围，升序
     * @param key 集合名字
     * @param start 开始名次 从0开始
     * @param end 结束名次 如果要输出所有的话，那么end设置成-1
     * @return string[]，如果不存在返回的是[]
     */
    zRange(key, start, end) {
        return new Promise((reslove, reject) => {
            if (this._redisClient == null) {
                //错误处理
                reject("redis已经断开");
                return;
            }
            //事件复杂度 O(log(N)+M) N 有续集个数，m返回的个数
            return this._redisClient.zrange(key, start, end, (err, reply) => {
                if (err) {
                    reject(err);
                }
                else {
                    reslove(reply);
                }
            });
        });
    }
    /**
     * 获取名次范围， 携带对应的分数（权重） 降序
     * @param key 集合名字
     * @param start 开始名次 从0开始
     * @param end 结束名次 如果要输出所有的话，那么end设置成-1
     * @return Smb[]，如果不存在返回的是[]
     */
    zRevrangeWithScores(key, start, end) {
        return new Promise((reslove, reject) => {
            if (this._redisClient == null) {
                //错误处理
                reject("redis已经断开");
                return;
            }
            //事件复杂度 O(log(N)+M) N 有续集个数，m返回的个数
            return this._redisClient.zrevrange(key, start, end, "WITHSCORES", (err, reply) => {
                if (err) {
                    reject(new Error(JSON.stringify(err)));
                }
                else {
                    reslove(reply);
                }
            });
        });
    }
    /**
     * 获取名次范围， 携带对应的分数（权重） 升序
     * @param key 集合名字
     * @param start 开始名次 从0开始
     * @param end 结束名次 如果要输出所有的话，那么end设置成-1
     * @return Smb[]，如果不存在返回的是[]
     */
    zRangeWithScores(key, start, end) {
        return new Promise((reslove, reject) => {
            if (this._redisClient == null) {
                //错误处理
                reject("redis已经断开");
                return;
            }
            //事件复杂度 O(log(N)+M) N 有续集个数，m返回的个数
            return this._redisClient.zrange(key, start, end, "WITHSCORES", (err, reply) => {
                if (err) {
                    reject(err);
                }
                else {
                    reslove(reply);
                }
            });
        });
    }
    /**
     * 为有序集key的成员member的score值加上增量increment。如果key不存在或者member不存在的话，那么久相当于zAdd
     * @param key 键
     * @param member 值
     * @param incrementScore  要增加的权重
     * @return 返回更新之后的权重
     */
    zIncrby(key, incrementScore, member) {
        //zadd key score member
        return new Promise((reslove, reject) => {
            if (this._redisClient == null) {
                //错误处理
                reject("redis已经断开");
                return;
            }
            this._redisClient.zincrby(key, incrementScore, member, (err, reply) => {
                if (err) {
                    reject(err);
                }
                else {
                    reslove(reply);
                }
            });
        });
    }
    /**
     * 删除有序集中的一个或多个成员
     * @param key :集合名字
     * @param member: 要删除的成员数据
     * @return 要删除的对象的个数：如果没删除到的话，就是返回0
     */
    zRem(key, member) {
        return new Promise((reslove, reject) => {
            if (this._redisClient == null) {
                //错误处理
                reject("redis已经断开");
                return;
            }
            this._redisClient.zrem(key, member, (err, reply) => {
                if (err) {
                    reject(err);
                }
                else {
                    reslove(reply);
                }
            });
        });
    }
    /**
     * 删除有序集中,权重在startNum和endNum之间的数据，都是闭区间
     * @param key :集合名字
     * @param startNum: 开始的权重
     * @param endNum: 结束的权重
     * @return 要删除的对象的个数：如果没删除到的话，就是返回0
     */
    zRemRangeByScore(key, startNum, endNum) {
        return new Promise((reslove, reject) => {
            if (this._redisClient == null) {
                //错误处理
                reject("redis已经断开");
                return;
            }
            this._redisClient.zremrangebyscore(key, startNum, endNum, (err, reply) => {
                if (err) {
                    reject(err);
                }
                else {
                    reslove(reply);
                }
            });
        });
    }
    /**
     * 返回有序集key中，score值在min和max之间(默认包括score值等于min或max)的成员。
     * @param key 集合名字
     * @param start 权重的开始。闭区间
     * @param end 权重的结束。闭区间
     * @return 再权重区间的个数，不存在返回0
     */
    zCount(key, start, end) {
        return new Promise((reslove, reject) => {
            if (this._redisClient == null) {
                //错误处理
                reject("redis已经断开");
                return;
            }
            //事件复杂度 O(log(N)+M) N 有续集个数，m返回的个数
            return this._redisClient.zcount(key, start, end, (err, reply) => {
                if (err) {
                    reject(err);
                }
                else {
                    reslove(reply);
                }
            });
        });
    }
    /**
     * 返回有序集key中，所有score值介于min和max之间(包括等于min或max)的成员。有序集成员按score值递增(从小到大)次序排列。
     * @param key 集合名字
     * @param start 权重的开始。闭区间  "(1" 代表  大于1  -inf：负无穷
     * @param end 权重的结束。闭区间  "(2" 代表  小于2    +inf：正无穷
     * @return 返回范围内的数据
     */
    zRangeByScore(key, start, end) {
        return new Promise((reslove, reject) => {
            if (this._redisClient == null) {
                //错误处理
                reject("redis已经断开");
                return;
            }
            //事件复杂度 O(log(N)+M) N 有续集个数，m返回的个数
            return this._redisClient.zrangebyscore(key, start, end, (err, reply) => {
                if (err) {
                    reject(err);
                }
                else {
                    reslove(reply);
                }
            });
        });
    }
    /**
     * 返回有序集key中，所有score值介于min和max之间(包括等于min或max)的成员。有序集成员按score值递增(从小到大)次序排列。
     * @param key 集合名字
     * @param start 权重的开始。闭区间  "(1" 代表  大于1  -inf：负无穷
     * @param end 权重的结束。闭区间  "(2" 代表  小于2    +inf：正无穷
     * @return 返回范围内的数据，带权重
     */
    zRangeByScorewithScore(key, start, end) {
        return new Promise((reslove, reject) => {
            if (this._redisClient == null) {
                //错误处理
                reject("redis已经断开");
                return;
            }
            //事件复杂度 O(log(N)+M) N 有续集个数，m返回的个数
            return this._redisClient.zrangebyscore(key, start, end, "WITHSCORES", (err, reply) => {
                if (err) {
                    reject(err);
                }
                else {
                    reslove(reply);
                }
            });
        });
    }
    /**
     * 返回有序集key中，所有score值介于max和min之间(包括等于min或max)的成员。有序集成员按score值递增(从大到小)次序排列。
     * @param key 集合名字
     * @param max 权重的开始。闭区间  "(10" 代表  小于10  +inf：正无穷
     * @param min 权重的结束。闭区间  "(2" 代表   大于2    -inf：负无穷
     * @return 返回范围内的数据
     */
    zRevRangeByScore(key, max, min) {
        return new Promise((reslove, reject) => {
            if (this._redisClient == null) {
                //错误处理
                reject("redis已经断开");
                return;
            }
            //事件复杂度 O(log(N)+M) N 有续集个数，m返回的个数
            return this._redisClient.zrevrangebyscore(key, max, min, (err, reply) => {
                if (err) {
                    reject(err);
                }
                else {
                    reslove(reply);
                }
            });
        });
    }
    /**
     * 返回有序集key中，所有score值介于max和min之间(包括等于min或max)的成员。有序集成员按score值递增(从大到小)次序排列。
     * @param key 集合名字
     * @param max 权重的开始。闭区间  "(10" 代表  小于10  +inf：正无穷
     * @param min 权重的结束。闭区间  "(2" 代表   大于2    -inf：负无穷
     * @return 返回范围内的数据,带权重
     */
    zRevRangeByScoreWithScore(key, max, min) {
        return new Promise((reslove, reject) => {
            //事件复杂度 O(log(N)+M) N 有续集个数，m返回的个数
            if (this._redisClient == null) {
                //错误处理
                reject("redis已经断开");
                return;
            }
            return this._redisClient.zrevrangebyscore(key, max, min, "WITHSCORES", (err, reply) => {
                if (err) {
                    reject(err);
                }
                else {
                    reslove(reply);
                }
            });
        });
    }
    /**
     * 移除有序集key中，指定排名(rank)区间内的所有成员。
     * @param key 集合名字
     * @param max 权重的开始。闭区间
     * @param min 权重的结束。闭区间
     * start和stop都以0为底。-1表示最后一个成员，-2表示倒数第二个成员，以此类推
     * @return 被移除成员的数量
     */
    zRemRangeByRank(key, min, max) {
        return new Promise((reslove, reject) => {
            if (this._redisClient == null) {
                //错误处理
                reject("redis已经断开");
                return;
            }
            //事件复杂度 O(log(N)+M) N 有续集个数，m返回的个数
            return this._redisClient.zremrangebyrank(key, min, max, (err, reply) => {
                if (err) {
                    reject(err);
                }
                else {
                    reslove(reply);
                }
            });
        });
    }
    get(key) {
        return new Promise((reslove, reject) => {
            if (this._redisClient == null) {
                //错误处理
                reject("redis已经断开");
                return;
            }
            return this._redisClient.get(key, (err, reply) => {
                if (err) {
                    reject(err);
                }
                else {
                    if (reply == null) {
                        reslove(null);
                    }
                    else {
                        try {
                            reslove(JSON.parse(reply));
                        }
                        catch (error) {
                            reslove(reply);
                        }
                    }
                }
            });
        });
    }
    set(key, value) {
        return new Promise((reslove, reject) => {
            //get(key: string, cb?: Callback<string | null>): R;
            if (this._redisClient == null) {
                //错误处理
                reject("redis已经断开");
                return;
            }
            //对象转换
            if (typeof value == "object") {
                value = JSON.stringify(value);
            }
            return this._redisClient.set(key, value, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    reslove(true);
                }
            });
        });
    }
    //哈希 获取所有
    hGetAll(key) {
        return new Promise((reslove, reject) => {
            //get(key: string, cb?: Callback<string | null>): R;
            if (this._redisClient == null) {
                //错误处理
                reject("redis已经断开");
                return;
            }
            return this._redisClient.hgetall(key, (err, reply) => {
                if (err) {
                    reject(err);
                }
                else {
                    reslove(reply);
                }
            });
        });
    }
    //哈希 按 field 获取
    hGet(key, field) {
        return new Promise((reslove, reject) => {
            if (this._redisClient == null) {
                //错误处理
                reject("redis已经断开");
                return;
            }
            return this._redisClient.hget(key, field, (err, reply) => {
                if (err) {
                    reject(err);
                }
                else {
                    if (reply == null) {
                        reslove(null);
                    }
                    else {
                        try {
                            reslove(JSON.parse(reply));
                        }
                        catch (error) {
                            reslove(reply);
                        }
                    }
                }
            });
        });
    }
    hSet(key, field, value) {
        return new Promise((reslove, reject) => {
            if (this._redisClient == null) {
                //错误处理
                reject("redis已经断开");
                return;
            }
            //对象转换
            if (typeof value == "object") {
                value = JSON.stringify(value);
            }
            return this._redisClient.hset(key, field, value, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    reslove(true);
                }
            });
        });
    }
    hmSet(key, field) {
        return new Promise((reslove, reject) => {
            if (this._redisClient == null) {
                //错误处理
                reject("redis已经断开");
                return;
            }
            for (const key2 in field) {
                if (typeof field[key2] == "object") {
                    field[key2] = JSON.stringify(field[key2]);
                }
            }
            return this._redisClient.hmset(key, field, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    reslove(true);
                }
            });
        });
    }
    /**
     * 删除redisKey
     * @param key 键
     */
    hdel(key, field) {
        //zadd key score member
        return new Promise((reslove, reject) => {
            if (this._redisClient == null) {
                //错误处理
                reject("redis已经断开");
                return false;
            }
            this._redisClient.hdel(key, field, (err, reply) => {
                if (err) {
                    reject(err);
                }
                else {
                    reslove(true);
                }
            });
        });
    }
    //加锁类操作 key: string, seconds: number
    setnx(key, value) {
        return new Promise((reslove, reject) => {
            //get(key: string, cb?: Callback<string | null>): R;
            if (this._redisClient == null) {
                //错误处理
                reject("redis已经断开");
                return;
            }
            return this._redisClient.setnx(key, value, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    reslove(true);
                }
            });
        });
    }
    /**
     * 加锁 1S内没加上锁就返回false
     * @param key  加锁 key
     * @param fuuid 谁要加锁
     */
    async lock(fuuid, key) {
        let count = 10;
        while (count > 0) {
            //加锁过期3000ms
            if (await this._lock(key, fuuid)) {
                return true;
            }
            else {
                //继续下次加锁尝试
                await game_1.default.sleep(100);
            }
            count--;
        }
        return false;
    }
    async _lock(key, value) {
        return new Promise((reslove, reject) => {
            if (this._redisClient == null) {
                //错误处理
                reject("redis已经断开");
                return;
            }
            //nx:当key不存在时，我们进行set操作；若key已经存在，则不做任何操作, px:意思是我们要给这个key加一个过期的设置，具体时间由第五个参数决定, 过期时间-秒
            return this._redisClient.set(key, value, "nx", "px", 2000, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    if (data == "OK") {
                        reslove(true);
                    }
                    else {
                        //加锁失败
                        reslove(false);
                    }
                }
            });
        });
    }
    /**
     * 解锁
     */
    async unLock(fuuid, key) {
        let value = await this.get(key);
        if (value == fuuid) {
            await this.del(key);
        }
    }
}
class RedisSev {
    constructor() {
        //游戏redis连接
        this.rdss = {};
    }
    //游戏redis初始化
    async init() {
        //连接redis rds
        this.rdss["ph"] = new Redis();
        if (await this.rdss["ph"].connect(tool_1.tool.getServerCfg().redis["ph"]) != true) {
            throw new Error('=======连接游戏redis err=====');
            return false;
        }
        //连接redis act1
        this.rdss["yw1"] = new Redis();
        if (await this.rdss["yw1"].connect(tool_1.tool.getServerCfg().redis["yw1"]) != true) {
            console.error('=======连接游戏redis err=====');
            return false;
        }
        return true;
    }
    //redis 分库
    getRedis(type) {
        switch (type) {
            case master_1.DataType.player:
            case master_1.DataType.user:
            case master_1.DataType.sev:
                return this.rdss["yw1"];
            case master_1.DataType.rds:
            case master_1.DataType.system:
                return this.rdss["ph"];
            default:
                console.error("未收到redis分库，已经自动转至ph");
                return this.rdss["ph"];
        }
    }
}
exports.redisSev = new RedisSev();
//# sourceMappingURL=redis.js.map