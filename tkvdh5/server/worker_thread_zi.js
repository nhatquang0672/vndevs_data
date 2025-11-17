"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("./src/util/redis");
const mongodb_1 = require("./src/util/mongodb");
const gameCfg_1 = __importDefault(require("./common/gameCfg"));
const start_1 = require("./src/crontab/start");
//启动单物理服务器集群
sevStart();
//服务器启动
async function sevStart() {
    //启动连接数据库
    if ((await mongodb_1.dbSev.init()) != true) {
        return false;
    }
    //启动连接redis
    if ((await redis_1.redisSev.init()) != true) {
        return false;
    }
    //初始化配置表缓存
    await gameCfg_1.default.init();
    //定时脚本启动
    await start_1.crontabStart_zi();
}
//# sourceMappingURL=worker_thread_zi.js.map