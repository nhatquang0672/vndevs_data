"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menu = void 0;
const A_UserModel_1 = require("../model/A_UserModel");
const tool_1 = require("../../src/util/tool");
const gameMethod_1 = require("../../common/gameMethod");
const A_LogModel_1 = require("../model/A_LogModel");
exports.menu = {
    // "风控账号":{
    //     "/s_playerKsh" :{"name":"角色信息展示"},
    //     "/s_ban" :{"name":"封禁"},
    //     "/s_flow" :{"name":"游戏日志"},
    //     "/s_qfuser" :{"name":"区服用户查询"},
    //     "/s_sevClub" :{"name":"公会信息查询"},
    //     "/s_ltjk" :{"name":"聊天监控"},
    //     "/s_sevClubs" :{"name":"公会公告监控"},
    // },
    "账号": {
        "/s_user": { "name": "后台账号" },
    },
    "策划": {
        "/s_qufu": { "name": "区服配置" },
        "/s_setting": { "name": "setting配置" },
        "/s_huodong": { "name": "活动配置" },
        "/s_gmMail": { "name": "GM Mail Item" },
        "/s_mail": { "name": "邮件" },
        "/s_code": { "name": "兑换码" },
    },
    "游戏数据": {
        "/s_player": { "name": "角色信息" },
        "/s_sev": { "name": "sev信息" },
        "/s_redis": { "name": "redis信息" },
        "/s_chongqi": { "name": "服务器重启" },
    },
    "玩家数据": {
        "/s_playerKsh": { "name": "角色信息展示" },
        "/s_flow": { "name": "游戏日志" },
        "/s_qfuser": { "name": "区服用户查询" },
        "/s_sevClub": { "name": "公会信息查询" },
        "/s_ban": { "name": "封禁" },
        "/s_ltjk": { "name": "聊天监控" },
        "/s_ltjkKua": { "name": "跨服聊天监控" },
        "/s_sevClubs": { "name": "公会公告监控" },
    },
    "后端": {
        // "/s_api" :{"name":"接口测试","apiUrl":"http://119.45.195.106:4001/api/index.html"},
        "/s_api": { "name": "接口测试", "apiUrl": "https://shkaifa.xmsgame.com:4002/api/index.html" },
        "/s_timer": { "name": "定时脚本" },
        "/s_serverError": { "name": "报错日志" },
        "/s_qingdang": { "name": "清档流程" },
        "/s_hefu": { "name": "合服流程" },
        "/s_showHd": { "name": "生效活动" },
        "/s_fight": { "name": "战斗重放" },
    },
    "前端": {
        "/s_clientError": { "name": "报错日志" },
    },
    "后台日志": {
        "/s_adminLog": { "name": "后台日志" },
    },
    "留存统计": {
        "/s_drlc": { "name": "多日留存" },
        "/s_czlc": { "name": "充值留存" },
        "/s_lvPve": { "name": "等级关卡分布" },
        "/s_atk": { "name": "攻击力分布" },
    },
    "付费消费统计": {
        "/s_ltv": { "name": "LTV" },
        "/s_sjzl": { "name": "数据总览" },
        "/s_czjl": { "name": "充值统计" },
        "/s_czLog": { "name": "充值记录" },
        "/s_zhichong": { "name": "后台直冲" },
    },
    "实时数据": {
        "/s_jssjtj": { "name": "即时数据统计" },
        "/s_qdmd": { "name": "前端埋点" },
        "/s_ffls": { "name": "付费流失" },
    },
};
class S_Game {
    async allOut(ctx, data = null, win = null) {
        let { token } = ctx.params;
        let user = await A_UserModel_1.a_UserModel.tokenPass(token);
        if (user.id == "") {
            ctx.throw('token过期，请重新登陆！');
        }
        if (user.ip != tool_1.tool.getClientIP(ctx)) {
            ctx.throw('异常操作！！！');
        }
        //记录操作日志
        await A_LogModel_1.a_LogModel.insert(ctx, user);
        delete user.ip;
        let menuCopy = {};
        if (user.department == "管理员") {
            menuCopy = gameMethod_1.gameMethod.objCopy(exports.menu);
        }
        if (user.department == "后端") {
            menuCopy = gameMethod_1.gameMethod.objCopy(exports.menu);
        }
        if (user.department == "前端") {
            menuCopy["策划"] = gameMethod_1.gameMethod.objCopy(exports.menu["策划"]);
            menuCopy["游戏数据"] = gameMethod_1.gameMethod.objCopy(exports.menu["游戏数据"]);
            delete menuCopy["游戏数据"]["/s_redis"];
            delete menuCopy["游戏数据"]["/s_chongqi"];
            menuCopy["前端"] = gameMethod_1.gameMethod.objCopy(exports.menu["前端"]);
        }
        if (user.department == "策划") {
            menuCopy["策划"] = gameMethod_1.gameMethod.objCopy(exports.menu["策划"]);
            menuCopy["游戏数据"] = gameMethod_1.gameMethod.objCopy(exports.menu["游戏数据"]);
            delete menuCopy["游戏数据"]["/s_redis"];
            delete menuCopy["游戏数据"]["/s_chongqi"];
            menuCopy["玩家数据"] = gameMethod_1.gameMethod.objCopy(exports.menu["玩家数据"]);
            menuCopy["留存统计"] = gameMethod_1.gameMethod.objCopy(exports.menu["留存统计"]);
            menuCopy["付费消费统计"] = gameMethod_1.gameMethod.objCopy(exports.menu["付费消费统计"]);
            menuCopy["实时数据"] = gameMethod_1.gameMethod.objCopy(exports.menu["实时数据"]);
        }
        if (user.department == "第三方") {
            // menuCopy["策划"] = gameMethod.objCopy(menu["策划"])
            // menuCopy["玩家数据"] = gameMethod.objCopy(menu["玩家数据"])
            menuCopy["留存统计"] = gameMethod_1.gameMethod.objCopy(exports.menu["留存统计"]);
            menuCopy["付费消费统计"] = gameMethod_1.gameMethod.objCopy(exports.menu["付费消费统计"]);
            // menuCopy["实时数据"] = gameMethod.objCopy(menu["实时数据"])
            delete menuCopy["付费消费统计"]["/s_zhichong"];
            // menuCopy["后端埋点"] = gameMethod.objCopy(menu["后端埋点"])
        }
        if (user.department == "第三方策划") {
            menuCopy["策划"] = gameMethod_1.gameMethod.objCopy(exports.menu["策划"]);
            // delete menuCopy["策划"]["/s_setting"]
            delete menuCopy["策划"]["/s_huodong"];
            // delete menuCopy["策划"]["/s_code"]
            // menuCopy["游戏数据"] = gameMethod.objCopy(menu["游戏数据"])
            // delete menuCopy["游戏数据"]["/s_redis"]
            // delete menuCopy["游戏数据"]["/s_chongqi"]
            menuCopy["玩家数据"] = gameMethod_1.gameMethod.objCopy(exports.menu["玩家数据"]);
            menuCopy["留存统计"] = gameMethod_1.gameMethod.objCopy(exports.menu["留存统计"]);
            menuCopy["付费消费统计"] = gameMethod_1.gameMethod.objCopy(exports.menu["付费消费统计"]);
            // menuCopy["实时数据"] = gameMethod.objCopy(menu["实时数据"])
            // delete menuCopy["付费消费统计"]["/s_zhichong"]
        }
        if (user.department == "第三方风控") {
            menuCopy["玩家数据"] = gameMethod_1.gameMethod.objCopy(exports.menu["玩家数据"]);
            delete menuCopy["付费消费统计"]["/s_zhichong"];
        }
        if (user.department == "财务") {
            menuCopy["付费消费统计"] = gameMethod_1.gameMethod.objCopy(exports.menu["付费消费统计"]);
            delete menuCopy["付费消费统计"]["/s_ltv"];
            delete menuCopy["付费消费统计"]["/s_sjzl"];
            delete menuCopy["付费消费统计"]["/s_czLog"];
            delete menuCopy["付费消费统计"]["/s_zhichong"];
        }
        if (user.department == "松鹤") {
            menuCopy["付费消费统计"] = gameMethod_1.gameMethod.objCopy(exports.menu["付费消费统计"]);
            delete menuCopy["付费消费统计"]["/s_ltv"];
            delete menuCopy["付费消费统计"]["/s_czLog"];
            delete menuCopy["付费消费统计"]["/s_zhichong"];
        }
        return {
            "token": token,
            "user": user,
            "menu": menuCopy,
            "data": data,
            "win": win
        };
    }
}
//输出
let s_Game = new S_Game();
exports.default = s_Game;
//# sourceMappingURL=s_game.js.map