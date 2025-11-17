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
//参数配置
const configs = {};
/**
 * 17玩
 */
class Wan17 {
    /**
     * 登陆验证
     * @param pid 包ID
     * @param user_id 平台用户唯一ID
     */
    async login(ctx) {
        const { pid, param } = tool_1.tool.getParams(ctx);
        if (configs[pid] == null) {
            ctx.throw("pid_err" + pid);
        }
        let str1 = `accountid=${param[0]}&gameid=${param[1]}&sessionid=${param[2]}`;
        let _sign = ts_md5_1.Md5.hashStr(str1 + configs[pid].Gsid);
        let back = await game_1.default.get(configs[pid].url + str1 + "&sign=" + _sign);
        if (back == null) {
            ctx.throw("登陆失败");
        }
        if (typeof back == "string") {
            back = JSON.parse(back);
        }
        if (back.code != 0) {
            ctx.throw(back.code + "_" + back.msg);
        }
        //登录成功
        ctx.state.master.addBackBuf({
            platBack: {
                openid: param[0],
                token: ts_md5_1.Md5.hashStr(param[2] + configs[pid].Gsid).toString(),
            },
        });
    }
    /**
     * 支付验证
     */
    async zhifu(ctx) {
        let kindId = game_1.default.rand(1, 999999).toString();
        const param = tool_1.tool.getParams(ctx);
        this.kind10log(kindId, "参数", JSON.stringify(param));
        /*
        “account“:”<用户账号ID>”,
        “money”:”<充值金额(单位:分)>”,
        “addtime”:”<创建时间(时间戳)>”,
        “orderid”:”<阿游戏平台订单号>”,
        “customorderid”:”<商户订单号,请求充值时传递给sdk的订单号>”,
        “paytype”:”<充值类型>”,
        “senddate”:”<发送时间(时间戳)>”,
        “custominfo”:”<商户自定义信息,请求充值时传递给sdk的信息>”,
        “success”:”<是否成功:1成功,其他失败>”
        “sign”:”<签名信息>”
        */
        let orderInfo = await mongodb_1.dbSev.getDataDb().findOne("kind10", { orderId: param["customorderid"] });
        if (orderInfo == null) {
            this.kind10log(kindId, "后端订单ID错误", "cp_order_id_" + param["customorderid"]);
            ctx.state.master.addSdkBackBuf("failure");
            return "failure";
        }
        if (orderInfo.money * 100 != parseInt(param["money"])) {
            this.kind10log(kindId, "充值金额对不上", parseInt(param["money"]) + "_" + orderInfo.money * 100);
            ctx.state.master.addSdkBackBuf("failure");
            return "failure";
        }
        let pplayer = await tool_1.tool.getOpenIdByUid(orderInfo.uid);
        if (pplayer == null) {
            this.kind10log(kindId, "获取账号平台消息失败", orderInfo.uid);
            ctx.state.master.addSdkBackBuf("failure");
            return "failure";
        }
        if (pplayer.openid != param["account"]) {
            this.kind10log(kindId, "account校验错误", pplayer.openid + "_" + param["account"]);
            ctx.state.master.addSdkBackBuf("failure");
            return "failure";
        }
        let str = "";
        let keys = Object.keys(param).sort();
        let kk = 0;
        for (const key of keys) {
            if (key == "“sign”") {
                continue;
            }
            if (kk > 0) {
                str += "&";
            }
            str += key + "=" + param[key];
            kk++;
        }
        let _sign = ts_md5_1.Md5.hashStr(str + configs[pplayer.pid].Gsid);
        if (_sign != param["sign"]) {
            this.kind10log(kindId, "验证不通过", "_sign_" + _sign);
            ctx.state.master.addSdkBackBuf("failure");
            return "failure";
        }
        ctx.state.uuid = "10086";
        ctx.state.fuuid = orderInfo.uuid;
        await lock_1.default.setLock(ctx, "user", orderInfo.uuid); //枷锁
        let fuserModel = UserModel_1.UserModel.getInstance(ctx, orderInfo.uuid);
        let fuserInfo = await fuserModel.getInfo();
        ctx.state.sid = fuserInfo.sid;
        ctx.state.regtime = fuserInfo.regtime;
        ctx.state.level = fuserInfo.level;
        ctx.state.name = fuserInfo.name == "" ? "初心者" + orderInfo.uuid : fuserInfo.name;
        let typeMsg = await ctx.state.master.kind10Success(param["customorderid"], param["orderid"], 2);
        if (typeMsg.type == 1) {
            this.kind10log(kindId, "充值成功", "success");
            ctx.state.master.addSdkBackBuf("success");
            return "success";
        }
        this.kind10log(kindId, "充值失败", JSON.stringify(typeMsg));
        ctx.state.master.addSdkBackBuf("failure");
        return "failure";
    }
    /**
     * 记录充值日志
     */
    async kind10log(kindId, name, str) {
        await mongodb_1.dbSev.getFlowDb().insert("wan17_" + game_1.default.getTodayId(), {
            kindId: kindId,
            name: name,
            str: str,
            at: game_1.default.getTime(),
        });
    }
}
let wan17 = new Wan17();
exports.default = wan17;
//# sourceMappingURL=Wan17.js.map