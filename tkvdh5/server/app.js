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
const tool_1 = require("./src/util/tool");
const master_1 = require("./src/util/master");
const koa_1 = __importDefault(require("koa"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const koa2_cors_1 = __importDefault(require("koa2-cors")); //跨域
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser")); //POST数据获取
const redis_1 = require("./src/util/redis");
const mongodb_1 = require("./src/util/mongodb");
const game_1 = __importDefault(require("./src/util/game"));
const lock_1 = __importDefault(require("./src/util/lock"));
const gameMethod_1 = require("./common/gameMethod");
const gameCfg_1 = __importDefault(require("./common/gameCfg"));
const setting_1 = __importDefault(require("./src/crontab/setting"));
const worker_threads_1 = __importDefault(require("worker_threads"));
const cluster_1 = __importDefault(require("cluster"));
const os_1 = require("os");
const process_1 = __importDefault(require("process"));
const ActAdokSevModel_1 = require("./src/model/act/ActAdokSevModel");
const numCPUs = os_1.cpus().length;
//游戏业务
const koa = new koa_1.default();
//启动单物理服务器集群
severCluster();
process_1.default.on('uncaughtException', (err) => {
    console.error("==捕获node错误==", err);
});
async function severCluster() {
    //单个物理服务器上创建 主进程和子进程
    if (cluster_1.default.isMaster) {
        console.log(`Primary ${process_1.default.pid} is running`);
        //创建子进程
        let cpunum = Math.max(numCPUs / 2, 1);
        for (let i = 0; i < 1; i++) {
            let worker = cluster_1.default.fork();
            worker.on("exit", (code, signal) => {
                //报错子进程删除。创建一个新的子进程，如果在创建失败，就没有了。
                console.log("=========app=====子进程关闭===", worker.process.pid);
            });
        }
        //创建一条主进程里面的 子线程
        let master_thread = new worker_threads_1.default.Worker(path.resolve(__dirname, 'worker_thread.js'));
        master_thread.on('message', async (msg) => {
            //接收（主）子线程传回的信息  转给其他子进程
            // console.time("主进程接收完成")
            // Setting.tongbu_setting_cache(msg)  //设置主进程
            // for (const wkid in cluster.workers) {  //同步给子进程
            //     cluster.workers[wkid]?.send({"sysRwds":msg["key"]})  
            // }
            // console.timeEnd("主进程接收完成")
        });
        cluster_1.default.on("fork", (worker) => {
            console.info(`${new Date()} worker${worker.process.pid}进程启动成功`);
        });
    }
    else {
        //调用启动
        // Setting.worker_process_on()  //监听主进程传来的数据
        //创建一条主进程里面的 子线程
        let master_thread_zi = new worker_threads_1.default.Worker(path.resolve(__dirname, 'worker_thread_zi.js'));
        master_thread_zi.on('message', async (msg) => {
            console.time("子进程接收完成");
            setting_1.default.tongbu_setting_cache(msg); //设置主进程
            console.timeEnd("子进程接收完成");
        });
        //启动连接数据库
        if ((await mongodb_1.dbSev.init()) != true) {
            return false;
        }
        //启动连接redis
        if ((await redis_1.redisSev.init()) != true) {
            return false;
        }
        //初始化配置表缓存
        gameCfg_1.default.init();
        gameHttpStart();
        koa.listen(tool_1.tool.getServerCfg().gamePort);
    }
}
//启动业务
function gameHttpStart() {
    //允许跨域
    koa.use(koa2_cors_1.default({
        origin: function (ctx) {
            //设置允许来自指定域名请求
            return "*"; // 允许来自所有域名请求
        },
        maxAge: 3600,
        credentials: false,
        allowMethods: ["GET", "POST"],
        allowHeaders: ["Content-Type", "Authorization", "Accept"],
    }));
    //获取POST数据
    koa.use(koa_bodyparser_1.default({
        enableTypes: ["json", "form", "text"],
    }));
    // 洋葱模式 中间件1
    koa.use(async (ctx, next) => {
        if (ctx.url == "/favicon.ico") {
            return;
        }
        let addAt = 0;
        let cfgAddTime = setting_1.default.getSetting("1", "addTime");
        if (cfgAddTime != null && cfgAddTime["add"] != null) {
            addAt += cfgAddTime["add"] * 86400;
        }
        ctx.state.newTime = game_1.default.getNowTime() + addAt;
        ctx.state.new0 = game_1.default.getToDay_0(ctx.state.newTime);
        ctx.state.model = {};
        ctx.state.master = new master_1.Master(ctx);
        ctx.state.locks = [];
        ctx.state.addLock = true;
        ctx.state.apidesc = "";
        //获取版本信息要让通过
        if (ctx.url.indexOf("/player/getVersion") == -1
            && ctx.url.indexOf("/player/btml") == -1
            && ctx.url.indexOf("/player/pay") == -1
            && ctx.url.indexOf("/player/btUuinfo") == -1) {
            //关服维护
            let cfgCloseQufu = setting_1.default.getSetting("1", "closeQufu");
            if (cfgCloseQufu != null && gameMethod_1.gameMethod.isEmpty(cfgCloseQufu.msg) == false) {
                let pass = false;
                let myIp = tool_1.tool.getClientIP(ctx);
                let cfgSystem = setting_1.default.getSetting("1", "system");
                if (cfgSystem != null && cfgSystem.ips != null && cfgSystem.ips.length > 0) {
                    for (const _ip of cfgSystem.ips) {
                        if (myIp.indexOf(_ip) != -1) {
                            pass = true;
                            break;
                        }
                    }
                }
                if (pass == false) {
                    let backBuf = {
                        type: 0,
                        win: {
                            msgOut: cfgCloseQufu.msg,
                        },
                    };
                    ctx.body = backBuf;
                    return;
                }
            }
        }
        //保证当前活动已经更新
        if (setting_1.default.createAt + addAt < ctx.state.new0) {
            let backBuf = {
                type: 0,
                win: {
                    msg: ["服务器繁忙！"],
                },
            };
            ctx.body = backBuf;
            return;
        }
        await next();
    });
    // 洋葱模式 中间件2
    koa.use(async (ctx, next) => {
        let isClose = true;
        let cfgSystem = setting_1.default.getSetting("1", "system");
        //如果是local ，开关也有开 直接充值
        if (cfgSystem != null && cfgSystem.log_open == 1) {
            isClose = false;
        }
        if (ctx.url.indexOf("/user/adok") != -1) {
            isClose = true;
        }
        let rid = game_1.default.rand(1, 9999999);
        if (!isClose) {
            console.time(rid + "执行时间：");
            tool_1.tool.clog("前端请求：", ctx.url, JSON.stringify(tool_1.tool.getParams(ctx)));
        }
        //业务执行
        try {
            //已经账号登陆 和 角色登陆
            if (ctx.url.indexOf("/player") == -1) {
                await ctx.state.master.getUser(); //获取角色基础信息 全局通用
            }
            await next();
            //互动信息检查下发  
            const { uuid, token } = tool_1.tool.getParams(ctx);
            if (gameMethod_1.gameMethod.isEmpty(uuid) != true && gameMethod_1.gameMethod.isEmpty(token) != true) {
                let actAdokSevModel = ActAdokSevModel_1.ActAdokSevModel.getInstance(ctx, uuid);
                await actAdokSevModel.clickAllSev();
                //设置离线点
                if (uuid == ctx.state.qhao) {
                    mongodb_1.dbSev.getFlowDb().update("LoginDown", { "uuid": uuid }, { "uuid": uuid, "sid": ctx.state.sid, "dAt": ctx.state.newTime + 30 }, true);
                }
            }
            else {
                // console.log(`adok  检查 本请求 没有 uuid`)
            }
            await ctx.state.master.updateFBuf(); //存储我给他人的输出信息
            await ctx.state.master.distroy(); //写入
        }
        catch (error) {
            ctx.state.fuuid = "";
            if (error.status == 500) {
                //业务报错
                ctx.state.master.addTypeMsg(0, "msg", error.message);
            }
            else if (error.status == 501) {
                ctx.state.master.addTypeMsg(0, "msgOut", "已在其他地方登陆");
            }
            else if (error.status == 502) {
                ctx.state.master.addTypeMsg(0, "msgOut", error.message);
            }
            else if (error.status == 503) {
                ctx.status = 200;
            }
            else if (error.status == 504) {
                ctx.status = 404;
            }
            else {
                //系统报错
                ctx.state.master.addTypeMsg(0, "msg", "异常错误");
                tool_1.tool.addServerError(ctx.url, tool_1.tool.getParams(ctx), error);
            }
        }
        await lock_1.default.unLock(ctx); //解锁
        await ctx.state.master.mergeBackBuf(); //合并他人给我的输出信息
        if (ctx.state.master.backDataAll() == 1 && !isClose) {
            ; //输出所有信息
            // tool.clog("后端返回：", JSON.stringify(game.jiemi(JSON.stringify(ctx.body))));
            tool_1.tool.clog("后端返回：", JSON.stringify(ctx.body));
            console.timeEnd(rid + "执行时间：");
            console.log(game_1.default.getTime());
        }
    });
    //http自动路由
    const dirApi = path.resolve(`${__dirname}`, "./src/api");
    fs.readdir(dirApi, (err, files) => {
        for (const file of files) {
            if (file.indexOf(".js.map") != -1) {
                continue; //包含.js.map 过滤
            }
            if (file.indexOf(".js") == -1) {
                continue; //不包含.js 过滤
            }
            let _file = file.split(".js")[0];
            let route = require(`./src/api/${_file}`);
            koa.use(route.router.routes());
        }
    });
}
//# sourceMappingURL=app.js.map