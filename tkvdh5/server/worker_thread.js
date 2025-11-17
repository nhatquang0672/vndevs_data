"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tool_1 = require("./src/util/tool");
const redis_1 = require("./src/util/redis");
const mongodb_1 = require("./src/util/mongodb");
const gameCfg_1 = __importDefault(require("./common/gameCfg"));
const start_1 = require("./src/crontab/start");
const game_1 = __importDefault(require("./src/util/game"));
const master_1 = require("./src/util/master");
//启动单物理服务器集群
sevStart();
//服务器启动
async function sevStart() {
    //检测获取服务器启动IP
    if (tool_1.tool.getLockIp() == "") {
        console.error("获取主服务器ip失败");
        return false;
    }
    //启动连接数据库
    if ((await mongodb_1.dbSev.init()) != true) {
        return false;
    }
    //连接成功后 插入计数器
    await tool_1.tool.mongoTableCount();
    //加索引 - game
    await tool_1.tool.mongoIndex(2);
    //加索引 - flow
    await tool_1.tool.mongoFlow(2);
    //启动连接redis
    if ((await redis_1.redisSev.init()) != true) {
        return false;
    }
    //初始化配置表缓存
    await gameCfg_1.default.init();
    //添加 删除业务信息的 定时器
    await tool_1.tool.addTimer("0", "delData", "0", game_1.default.getTodayId(), game_1.default.getToDay_0() + 86400 + 3 * 3600);
    //重启清除 给他人的输出信息
    await redis_1.redisSev.getRedis(master_1.DataType.user).del("fBackBuf");
    //定时脚本启动
    await start_1.crontabStart_zhu();
}
//# sourceMappingURL=worker_thread.js.map