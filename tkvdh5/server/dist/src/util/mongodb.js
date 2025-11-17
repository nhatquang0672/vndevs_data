"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbSev = exports.MongoDb = void 0;
const mongodb_1 = require("mongodb");
const tool_1 = require("./tool");
class MongoDb {
    constructor() {
        this.client = null; //连接
        this.db = null; //数据库
    }
    /**
     * 数据库连接
     */
    async connect(cfg) {
        let url = '';
        if (cfg.user == null || cfg.user == '') { //兼容无用户名密码方式
            url = "mongodb://" + cfg.host + ":" + cfg.port + "/";
        }
        else {
            url = "mongodb://" + cfg.user + ":" + cfg.pwd + "@" + cfg.host + ":" + cfg.port + "/" + cfg.name + "?replicaSet=cmgo-gc1s8hph_0&authSource=admin&readPreference=secondaryPreferred";
        }
        console.log("===url==", url);
        return new Promise((reslove, reject) => {
            mongodb_1.MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
                if (!err) {
                    this.client = db;
                    this.db = db.db(cfg.name);
                    console.log('===数据库连接成功====', cfg.name);
                    reslove(true);
                }
                else {
                    reject(err);
                }
                ;
            });
        });
    }
    /**
     * 关闭连接
     */
    async close() {
        if (this.client != null) {
            this.client.close();
            this.client = null;
            this.db = null;
        }
    }
    /**
     * 查询一行
     * @param table 集合名(表名)
     * @param query 查询语句
     * @return 查询到是对应的值，查询不到的话 得到是null,出错抛异常
     */
    async findOne(table, query = {}, options = {}) {
        return new Promise((reslove, reject) => {
            if (this.db == null) {
                //错误处理
                reject("db已经断开");
                return;
            }
            this.db.collection(table).findOne(query, options, (err, request) => {
                if (!err) {
                    //查询成功 输出结果
                    reslove(request);
                }
                else {
                    //err错误处理 reject
                    reject(err);
                }
                ;
            });
        });
    }
    /**
    * 删除table所有索引
    */
    async dropIndexes(table) {
        return new Promise((reslove, reject) => {
            if (this.db == null) {
                //错误处理
                reject("db已经断开");
                return;
            }
            this.db.collection(table).dropIndexes((err, request) => {
                if (!err) {
                    //查询成功 输出结果
                    reslove(request);
                }
                else {
                    //err错误处理 reject
                    reject(err);
                    //    throw "fuckyou bitch";
                }
                ;
            });
        });
    }
    /**
    * 创建table所有索引
    */
    async createIndexes(table, query = {}) {
        return new Promise((reslove, reject) => {
            if (this.db == null) {
                //错误处理
                reject("db已经断开");
                return;
            }
            this.db.collection(table).createIndex(query, (err, request) => {
                if (!err) {
                    //查询成功 输出结果
                    reslove(request);
                }
                else {
                    //err错误处理 reject
                    reject(err);
                    //    throw "fuckyou bitch";
                }
                ;
            });
        });
    }
    /**
    * 获取table所有索引
    */
    async indexes(table) {
        return new Promise((reslove, reject) => {
            if (this.db == null) {
                //错误处理
                reject("db已经断开");
                return;
            }
            this.db.collection(table).indexes((err, request) => {
                if (!err) {
                    //查询成功 输出结果
                    reslove(request);
                }
                else {
                    //err错误处理 reject
                    reject(err);
                    //    throw "fuckyou bitch";
                }
                ;
            });
        });
    }
    /**
     * 获取集合
     */
    async collections() {
        if (this.db == null) {
            //错误处理
            throw new Error('db已经断开');
            return;
        }
        return await this.db.listCollections({}, {}).toArray();
    }
    /**
     * 查询所有
     * @param table 集合名(表名)
     * @param query 查询语句
     */
    async findCursor(table, query = {}, options = {}) {
        if (this.db == null) {
            //错误处理
            throw new Error('db已经断开');
            return;
        }
        return this.db.collection(table).find(query, options);
    }
    /**
     * 查询所有
     * @param table 集合名(表名)
     * @param query 查询语句
     */
    async find(table, query = {}, options = {}) {
        return new Promise((reslove, reject) => {
            if (this.db == null) {
                //错误处理
                reject("db已经断开");
                return;
            }
            this.db.collection(table).find(query, options).toArray(function (err, request) {
                if (!err) {
                    //查询成功 输出结果
                    if (null == request) {
                        request = [];
                    }
                    reslove(request);
                }
                else {
                    //err错误处理 reject
                    reject(err);
                }
                ;
            });
        });
    }
    /**
     * 查询所有
     * @param table 集合名(表名)
     * @param query 查询语句
     */
    async findCount(table, query = {}, options = {}) {
        return new Promise((reslove, reject) => {
            if (this.db == null) {
                //错误处理
                reject("db已经断开");
                return;
            }
            this.db.collection(table).find(query, options).count(function (err, result) {
                if (!err) {
                    reslove(result);
                }
                else {
                    //err错误处理 reject
                    reject(err);
                }
                ;
            });
        });
    }
    /**
     * 删除文档
     * @param table 集合名(表名)
     * @param query 查询语句
     * @param singleDel 是否删除多条
     */
    async remove(table, query = {}, singleDel = false) {
        return new Promise((reslove, reject) => {
            if (singleDel == true) //删除多条
             {
                if (this.db == null) {
                    //错误处理
                    reject("db已经断开");
                    return;
                }
                this.db.collection(table).deleteMany(query, (err, request) => {
                    if (!err) {
                        //查询成功 输出结果
                        reslove(request);
                    }
                    else {
                        //err错误处理 reject
                        reject(err);
                    }
                    ;
                });
            }
            else //删除一条
             {
                if (this.db == null) {
                    //错误处理
                    reject("db已经断开");
                    return;
                }
                this.db.collection(table).deleteOne(query, (err, request) => {
                    if (!err) {
                        //查询成功 输出结果
                        reslove(request);
                    }
                    else {
                        //err错误处理 reject
                        reject(err);
                    }
                    ;
                });
            }
        });
    }
    /**
     * 更新
     * @param table 集合名(表名)
     * @param query 查询条件
     * @param update 更新语句
     * @param upsert 如果找不到匹配的数据，直接插入一条
     * @param multi 条数限制 mongodb 默认是false,只更新找到的第一条记录
     */
    async update(table, query = {}, update = {}, upsert = false, multi = false) {
        return new Promise((reslove, reject) => {
            if (this.db == null) {
                //错误处理
                reject("db已经断开");
                return;
            }
            if (multi == false) //更新一条
             {
                this.db.collection(table).updateOne(query, { $set: update }, { upsert: upsert }, (err, request) => {
                    if (!err) {
                        reslove(request);
                    }
                    else {
                        reject(err);
                    }
                    ;
                });
            }
            else //更新多条
             {
                this.db.collection(table).updateMany(query, { $set: update }, { upsert: upsert }, (err, request) => {
                    if (!err) {
                        reslove(request);
                    }
                    else {
                        reject(err);
                    }
                    ;
                });
            }
        });
    }
    /**
     * 更新 删除节点
     * @param table 集合名(表名)
     * @param query 查询条件
     * @param update 更新语句(删除节点)
     * @param multi 条数限制 mongodb 默认是false,只更新找到的第一条记录
     */
    async updateRemove(table, query = {}, update = {}, multi = false) {
        return new Promise((reslove, reject) => {
            if (this.db == null) {
                //错误处理
                reject("db已经断开");
                return;
            }
            if (multi == false) //更新一条
             {
                this.db.collection(table).updateOne(query, { $unset: update }, { upsert: false }, (err, request) => {
                    if (!err) {
                        reslove(request);
                    }
                    else {
                        reject(err);
                    }
                    ;
                });
            }
            else //更新多条
             {
                this.db.collection(table).updateMany(query, { $unset: update }, { upsert: false }, (err, request) => {
                    if (!err) {
                        reslove(request);
                    }
                    else {
                        reject(err);
                    }
                    ;
                });
            }
        });
    }
    /**
     * 更新
     * @param table 集合名(表名)
     * @param query 查询条件
     * @param update 更新语句
     * @param upsert 如果找不到匹配的数据，直接插入一条
     * @param multi 条数限制 mongodb 默认是false,只更新找到的第一条记录
     */
    async newUpdate(table, query = {}, update = {}, upsert = false, multi = false) {
        return new Promise((reslove, reject) => {
            if (this.db == null) {
                //错误处理
                reject("db已经断开");
                return;
            }
            if (multi == false) //更新一条
             {
                this.db.collection(table).updateOne(query, update, { upsert: upsert }, (err, request) => {
                    if (!err) {
                        reslove(request);
                    }
                    else {
                        reject(err);
                    }
                    ;
                });
            }
            else //更新多条
             {
                this.db.collection(table).updateMany(query, update, { upsert: upsert }, (err, request) => {
                    if (!err) {
                        reslove(request);
                    }
                    else {
                        reject(err);
                    }
                    ;
                });
            }
        });
    }
    /**
    * 更新 没有就插入
    * @param table 集合名(表名)
    * @param query 查询条件
    * @param update 更新语句
    */
    async replace(table, query = {}, update = {}) {
        return new Promise((reslove, reject) => {
            if (this.db == null) {
                //错误处理
                reject("db已经断开");
                return;
            }
            this.db.collection(table).update(query, { $set: update }, { upsert: true }, (err, request) => {
                if (!err) {
                    //更新成功 输出?
                    reslove(request);
                }
                else {
                    //err错误处理 reject
                    reject(err);
                }
                ;
            });
        });
    }
    /**
     * 插入
     * @param table 集合名(表名)
     * @param update 插入语句
     */
    async insert(table, insert = {}) {
        return new Promise((reslove, reject) => {
            if (this.db == null) {
                //错误处理
                reject("db已经断开");
                return false;
            }
            this.db.collection(table).insertOne(insert, (err, request) => {
                if (!err) {
                    //插入成功 输出?
                    reslove(request.insertedId);
                }
                else {
                    //err错误处理 reject
                    reject(err);
                }
                ;
            });
        });
    }
    /**
    * 一次性插入多条信息
    * @param table 集合名(表名)
    * @param update 插入语句
    */
    async insertMany(table, insert = []) {
        return new Promise((reslove, reject) => {
            if (this.db == null) {
                //错误处理
                reject("db已经断开");
                return;
            }
            this.db.collection(table).insertMany(insert, (err, request) => {
                if (!err) {
                    //插入成功 输出?
                    reslove(request);
                }
                else {
                    //err错误处理 reject
                    reject(err);
                }
                ;
            });
        });
    }
    //获取所有的集合名字
    async getAllCollection() {
        return new Promise((reslove, reject) => {
            if (this.db == null) {
                //错误处理
                reject("db已经断开");
                return;
            }
            this.db.collections((err, docs) => {
                if (err) {
                    reject(err);
                }
                else {
                    let setVec = [];
                    for (let item in docs) {
                        setVec.push(docs[item].s.name);
                    }
                    reslove(setVec);
                }
            });
        });
    }
    /**
     * 查询所有
     * @param table 集合名(表名)
     * @param query 查询语句
     */
    async findLimit(table, query = {}, options = {}, limit) {
        return new Promise((reslove, reject) => {
            if (this.db == null) {
                //错误处理
                reject("db已经断开");
                return;
            }
            this.db.collection(table).find(query, options).limit(limit).toArray(function (err, request) {
                if (!err) {
                    //查询成功 输出结果
                    if (null == request) {
                        request = [];
                    }
                    reslove(request);
                }
                else {
                    //err错误处理 reject
                    reject(err);
                }
                ;
            });
        });
    }
    /**
     * 创建函数 getNextSequenceValue 来作为序列名的输入， 指定的序列会自动增长 1 并返回最新序列值
     * @param table
     * @param sequenceName
     */
    async getNextId(key) {
        return new Promise((reslove, reject) => {
            if (this.db == null) {
                //错误处理
                reject("db已经断开");
                return;
            }
            this.db.collection('table_count').findOneAndUpdate({ "name": key }, { $inc: { "points": 1 } }, (err, request) => {
                if (!err) {
                    //插入成功 输出?
                    reslove(request.value.points);
                }
                else {
                    //err错误处理 reject
                    reject(err);
                }
                ;
            });
        });
    }
    //1.数据库的存在查询无API
    //2.数据库的增加没有API,一般集合存在之后，数据库就有了
    //3.数据库的删除
    deleteDataBase() {
        return new Promise((resolve, reject) => {
            if (this.db == null) {
                //错误处理
                reject("db已经断开");
                return;
            }
            this.db.dropDatabase((err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    //创建集合
    //常见的option：capped：是否设置存储上限，默认为false。autoIndexId：是否设置_id为索引,默认为true
    //size:针对capped来设置，默认无限大。max设置文档最大的文档数，默认无限大。size优先级大于max
    //db.createCollection(name, {capped: <Boolean>, autoIndexId: <Boolean>, size: <number>, max <number>} )
    createCollection(collection, option = {}) {
        return new Promise((reslove, reject) => {
            if (this.db == null) {
                //错误处理
                reject("db已经断开");
                return;
            }
            this.db.createCollection(collection, option), (err, docs) => {
                if (err) {
                    reject(err);
                }
                else {
                    reslove(docs);
                }
            };
        });
    }
    /**
     * 从数据库中删除集合,不存在报错
     * @param table 集合名(表名)
     */
    async dropExistTable(table) {
        return new Promise((reslove, reject) => {
            if (this.db == null) {
                //错误处理
                reject("db已经断开");
                return;
            }
            this.db.collection(table).drop((err, request) => {
                if (!err) {
                    //更新成功 输出?
                    reslove(true);
                }
                else {
                    //err错误处理 reject
                    reject(err);
                }
                ;
            });
        });
    }
    async drop(table) {
        //获取所有集合
        let allSet = await this.getAllCollection();
        let alreadyExist = false;
        for (let item in allSet) {
            if (allSet[item] == table) {
                alreadyExist = true;
                break;
            }
        }
        //如果要删除的集合不存在，直接返回true;
        if (alreadyExist == false) {
            return true;
        }
        //存在就返回删除的结果
        return await this.dropExistTable(table);
    }
    //创建索引
    //background 建索引过程会阻塞其它数据库操作，background可指定以后台方式创建索引，即增加 "background" 可选参数。 "background" 默认值为false。
    //unique 唯一索引  默认false
    //name 索引名字
    //dropDups 唯一索引是否丢弃重复数据 默认false
    //sparse 不存在的字段不启用索引 默认false 
    //@param tableName:要创建索引的表
    //@param field：要创建的字段
    //@param option:创建的选项
    //@etc DbSev.createIndex("huangyanling",{"name":1},{unique:true});  //1代表升序
    createIndex(tableName, field, option) {
        return new Promise((reslove, reject) => {
            if (this.db == null) {
                //错误处理
                reject("db已经断开");
                return;
            }
            //获取所有的索引
            this.db.createIndex(tableName, field, option, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    reslove(result);
                }
            });
        });
    }
    //查询索引是否存在
    whetherExistIndex(collection, index) {
        return new Promise((reslove, reject) => {
            if (this.db == null) {
                //错误处理
                reject("db已经断开");
                return;
            }
            //获取所有的索引
            this.db.indexInformation(collection, {}, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    for (let indexName in result) {
                        if (indexName == index) {
                            reslove(true);
                        }
                    }
                    reslove(false);
                }
            });
        });
    }
}
exports.MongoDb = MongoDb;
class DbSev {
    constructor() {
        //数据库连接
        this.dbs = {};
    }
    //数据库初始化
    async init() {
        //获取配置
        let config = tool_1.tool.getServerCfg();
        //连接游戏数据库
        this.dbs["data"] = new MongoDb();
        if (await this.dbs["data"].connect(config.mongoDb["data"]) != true) {
            console.error('=======连接游戏数据库 err=====');
            return false;
        }
        this.dbs["data"].insert("test", { "name": "生成" });
        //连接游戏数据库  -用于查询
        // this.dbs["dataFind"] = new MongoDb()
        // if (await this.dbs["dataFind"].connect(config.mongoDb["dataFind"]) != true) {
        //     console.error('=======连接游戏数据库 err=====')
        //     return false
        // }
        //连接流水数据库
        this.dbs["flow"] = new MongoDb();
        if (await this.dbs["flow"].connect(config.mongoDb["flow"]) != true) {
            console.error('=======连接流水数据库 err=====');
            return false;
        }
        this.dbs["flow"].insert("test", { "name": "生成" });
        return true;
    }
    //获取业务数据库
    getDataDb() {
        return this.dbs["data"];
    }
    //获取业务数据库  - 用于业务查询 分担压力
    // getDataFindDb(): MongoDb {
    //     return this.dbs["dataFind"]
    // }
    //获取流水数据库
    getFlowDb() {
        return this.dbs["flow"];
    }
}
exports.dbSev = new DbSev();
//# sourceMappingURL=mongodb.js.map