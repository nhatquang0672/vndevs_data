"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("../util/mongodb");
const ts_md5_1 = require("ts-md5");
const tool_1 = require("../util/tool");
const lock_1 = __importDefault(require("../util/lock"));
const UserModel_1 = require("../model/user/UserModel");
const game_1 = __importDefault(require("../util/game"));
const gameMethod_1 = require("../../common/gameMethod");
//参数配置
const configs = {};
/**
 * 智灵
 */
class Zhiling {
    /**
     * 登陆验证
     * @param pid 包ID
     * @param user_id 平台用户唯一ID
     * @param user_token
     * @param game_id 游戏编号
     */
    async login(ctx, pid, user_id, user_token, game_id) {
        if (configs[pid] == null) {
            ctx.throw("pid_err" + pid);
        }
        if (gameMethod_1.gameMethod.isEmpty(user_id)) {
            ctx.throw("user_id_null");
        }
        if (gameMethod_1.gameMethod.isEmpty(user_token)) {
            ctx.throw("user_token_null");
        }
        let url = "https://www.mmlinux.com/sdk/v1/h5/user/check";
        // let sign = Md5.hashStr(stryz);
        //post参数
        let postData = {
            game_id: configs[pid].game_id,
            user_id: user_id,
            user_token: user_token,
            timestamp: ctx.state.newTime,
            nonce: game_1.default.rand(1, 100000),
        };
        //按KEY排序 输出连接字符串
        let bstr = this.sortAndJoinParams(postData);
        bstr += configs[pid].game_secret; //拼接上秘钥
        let sign = ts_md5_1.Md5.hashStr(bstr);
        postData.sign = sign;
        let back = await tool_1.tool.url_post_from(url, postData);
        back = typeof back == 'string' ? JSON.parse(back) : back;
        if (back.code != "0") {
            console.log(back);
            ctx.throw(`code:${back.code} msg:${back.msg}`);
        }
        //验证key
        let token = ts_md5_1.Md5.hashStr(pid + "_" + user_id + "_" + ctx.state.newTime).toString();
        await mongodb_1.dbSev.getDataDb().update("plat", {
            pid: pid,
            openid: user_id,
        }, {
            pid: pid,
            openid: user_id,
            token: token,
            plat: "zhiling",
        }, true);
        //登录成功
        ctx.state.master.addBackBuf({
            platBack: {
                openid: user_id,
                token: token,
            },
        });
    }
    //构建加密串
    sortAndJoinParams(params) {
        const sortedKeys = Object.keys(params).sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));
        const paramString = sortedKeys.map((key) => `${key}=${params[key]}`).join("&");
        return paramString;
    }
    /**
     * 支付验证
     */
    async zhifu(ctx) {
        let kindId = game_1.default.rand(1, 999999).toString();
        const { pid, sign, amount, out_trade_no, game_trade_no, product_id, product_name, game_id } = tool_1.tool.getParams(ctx);
        let parms = {
            amount: amount,
            out_trade_no: out_trade_no,
            game_trade_no: game_trade_no,
            product_id: product_id,
            product_name: product_name,
            game_id: game_id,
        };
        console.log(parms);
        //按KEY排序 输出连接字符串
        let bstr = this.sortAndJoinParams(parms);
        bstr += configs[pid].game_secret; //拼接上秘钥
        console.log(bstr);
        let _sign = ts_md5_1.Md5.hashStr(bstr);
        if (_sign != sign) {
            this.kind10log(kindId, "验证不通过", "bstr" + bstr);
            ctx.state.master.addSdkBackBuf("FAILURE");
            return "FAILURE";
        }
        //平台验证完成 -----
        let orderInfo = await mongodb_1.dbSev.getDataDb().findOne("kind10", { orderId: game_trade_no });
        if (orderInfo == null) {
            this.kind10log(kindId, "后端订单ID错误", "cp_order_id_" + game_trade_no);
            ctx.state.master.addSdkBackBuf("FAILURE");
            return "FAILURE";
        }
        if (orderInfo.money != parseInt(amount) / 100) {
            this.kind10log(kindId, "充值金额对不上", amount + "_" + orderInfo.money);
            ctx.state.master.addSdkBackBuf("FAILURE");
            return "FAILURE";
        }
        ctx.state.uuid = "10086";
        ctx.state.fuuid = orderInfo.uuid;
        await lock_1.default.setLock(ctx, "user", orderInfo.uuid); //枷锁
        let fuserModel = UserModel_1.UserModel.getInstance(ctx, orderInfo.uuid);
        let fuserInfo = await fuserModel.getInfo();
        ctx.state.sid = fuserInfo.sid;
        ctx.state.regtime = fuserInfo.regtime;
        ctx.state.level = fuserInfo.level;
        let typeMsg = await ctx.state.master.kind10Success(game_trade_no, game_trade_no, 2);
        if (typeMsg.type == 1) {
            this.kind10log(kindId, "充值成功", "SUCCESS");
            ctx.state.master.addSdkBackBuf("SUCCESS");
            return "SUCCESS";
        }
        this.kind10log(kindId, "充值失败", JSON.stringify(typeMsg));
        ctx.state.master.addSdkBackBuf("FAILURE");
        return "FAILURE";
    }
    /**
     * 记录充值日志
     */
    async kind10log(kindId, name, str) {
        await mongodb_1.dbSev.getFlowDb().insert("Zhiling_" + game_1.default.getTodayId(), {
            kindId: kindId,
            name: name,
            str: str,
            at: game_1.default.getTime(),
        });
    }
}
let zhiling = new Zhiling();
exports.default = zhiling;
//# sourceMappingURL=Zhiling.js.map