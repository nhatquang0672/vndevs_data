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
exports.adminHttpStart = void 0;
const tool_1 = require("./../src/util/tool");
const koa_1 = __importDefault(require("koa"));
const render = require("koa-art-template");
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
const koa2_cors_1 = __importDefault(require("koa2-cors")); //跨域
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser")); //POST数据获取
const koa_static_1 = __importDefault(require("koa-static")); //静态文件
const mongodb_1 = require("../src/util/mongodb");
const redis_1 = require("../src/util/redis");
const gameCfg_1 = __importDefault(require("../common/gameCfg"));
const setting_1 = __importDefault(require("../src/crontab/setting"));
const game_1 = __importDefault(require("../src/util/game"));
const A_UserModel_1 = require("./model/A_UserModel");
//后台
const koa2 = new koa_1.default();
async function adminHttpStart() {
    //启动连接数据库
    if (await mongodb_1.dbSev.init() != true) {
        return;
    }
    //启动连接redis
    if (await redis_1.redisSev.init() != true) {
        return;
    }
    //初始化配置表缓存
    await gameCfg_1.default.init();
    await setting_1.default.createCash(game_1.default.getToDay_0(), game_1.default.getNowTime(), false);
    //允许跨域
    koa2.use(koa2_cors_1.default({
        origin: function (ctx) {
            return '*'; // 允许来自所有域名请求
        },
        maxAge: 3600,
        credentials: true,
        allowMethods: ['GET', 'POST'],
        allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    }));
    //获取POST数据
    koa2.use(koa_bodyparser_1.default({
        enableTypes: ['json', 'form', 'text'],
        formLimit: "10mb",
        jsonLimit: "10mb"
    }));
    //渲染
    koa2.use(koa_static_1.default(path_1.default.join(__dirname, 'public')));
    render(koa2, {
        root: path_1.default.join(__dirname, 'view'),
        extname: '.html',
        debug: process.env.NODE_ENV !== 'production'
    });
    // 中间件 
    koa2.use(async (ctx, next) => {
        console.log('admin前端请求：', ctx.url, ctx.request.body);
        //业务执行
        try {
            if (ctx.url.indexOf("/s_index") == -1) {
                let arr = ctx.url.split("/");
                let token = "";
                for (const ar of arr) {
                    if (ar != null && ar.length == 32) {
                        token = ar;
                    }
                }
                let user = await A_UserModel_1.a_UserModel.tokenPass(token);
                if (user.id == "") {
                    ctx.throw('token过期，请重新登陆！');
                }
                if (user.ip != tool_1.tool.getClientIP(ctx)) {
                    ctx.throw('异常操作！！！');
                }
            }
            await next();
        }
        catch (error) {
            console.log('===捕获错误=====', error);
            await ctx.render('a_index', {
                msg: error.message
            });
        }
        //console.log('后端返回：',ctx.body)
    });
    //路由
    //http自动路由
    const dirApi = path_1.default.resolve(`${__dirname}`, './api');
    fs.readdir(dirApi, (err, files) => {
        for (const file of files) {
            if (file.indexOf('.js.map') != -1) {
                continue; //包含.js.map 过滤
            }
            if (file.indexOf('.js') == -1) {
                continue; //不包含.js 过滤
            }
            let _file = file.split('.js')[0];
            let route = require(`./api/${_file}`);
            koa2.use(route.router.routes());
        }
    });
    koa2.listen(tool_1.tool.getServerCfg().adminPort);
    console.log("admin端口：", tool_1.tool.getServerCfg().adminPort);
    // console.log("======getpayerall====")
    // await LockCache.getplayerallinit()
    // console.log("======geUserall====")
    // await LockCache.getuerallinit()
    // console.log("======georderall====")
    // await LockCache.getorderrallinit()
    // console.log("======end====")
}
exports.adminHttpStart = adminHttpStart;
adminHttpStart();
//# sourceMappingURL=www.js.map