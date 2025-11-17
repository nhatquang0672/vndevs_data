"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tool_1 = require("../util/tool");
const ts_md5_1 = require("ts-md5");
const mongodb_1 = require("../util/mongodb");
const game_1 = __importDefault(require("../util/game"));
const lock_1 = __importDefault(require("../util/lock"));
const UserModel_1 = require("../model/user/UserModel");
const iconv_lite_1 = require("iconv-lite");
const crypto = require("crypto");
//参数配置
const configs = {
    '901': {
        'appkey': "34494156",
        'appsecret': "c24ab46076c261b4970a609259e29fea",
        'hddz': "https://shanhaitb.weimigames.com/player/pay/902",
    },
    '902': {
        'appkey': "34494156",
        'appsecret': "c24ab46076c261b4970a609259e29fea",
        'hddz': "https://shanhaitb.weimigames.com/player/pay/902"
    },
    '903': {
        'appkey': "34494156",
        'appsecret': "c24ab46076c261b4970a609259e29fea",
        'hddz': "https://shanhaitb.weimigames.com/player/pay/902"
    }
};
//每30天授权地址
//https://oauth.taobao.com/tac/authorize?client_id=34494156&response_type=code&redirect_url=https://shanhaitb.weimigames.com/player/pay/902
//小程序  appsecret = 038a6c9e279a7184ea728d355dcd47a7
/**
 * 淘宝
 */
class Taobao {
    /**
  * 淘宝登陆
  * @param pid
  * @param code
  */
    async login(ctx) {
        const { open_id, access_token } = tool_1.tool.getParams(ctx);
        //平台正常返回
        ctx.state.master.addBackBuf({ "platBack": {
                openid: open_id,
                token: access_token //后端验证key
            } });
    }
    /**
     * 该API用于在游戏直冲时，向供应商下单
     */
    async zc_order(ctx) {
        // const param = tool.getParams(ctx)
        // console.log("===ctx====",ctx.querystring)
        // if(this.checkSign_1(ctx) == false){
        //     ctx.state.master.addSdkBackBuf(`
        //     <gamezctoporder>
        //         <tbOrderNo>${param.tbOrderNo}</tbOrderNo>
        //         <coopOrderSuccessTime>${game.getSecondsId()}</coopOrderSuccessTime>
        //         <coopOrderStatus>GENERAL_ERROR</coopOrderStatus>
        //         <failedReason>check failed</failedReason>
        //         <coopOrderNo>${param.coopId}</coopOrderNo>
        //         <failedCode>0102</failedCode>
        //         <coopOrderSnap>taobao|game|order</coopOrderSnap>
        //     </gamezctoporder>
        //     `)
        //     return
        // }
        await this.zhifu(ctx);
    }
    /**
     * 淘宝游戏充值直充过程中，由于向厂商取消订单
     */
    async zc_cancel(ctx) {
        const param = tool_1.tool.getParams(ctx);
        let kindId = game_1.default.rand(1, 999999).toString();
        this.kind10log(kindId, "zc_cancel", "param_" + JSON.stringify(param));
        if (this.checkSign(ctx) == false) {
            ctx.state.master.addSdkBackBuf(`
            <gamezctopcancel>
                <tbOrderNo>${param.tbOrderNo}</tbOrderNo>
                <coopOrderNo>${param.coopId}</coopOrderNo>
                <coopOrderStatus>GENERAL_ERROR</coopOrderStatus>
                <coopOrderSnap>taobao|game service</coopOrderSnap>
                <coopOrderSuccessTime>${game_1.default.getSecondsId()}</coopOrderSuccessTime>
                <failedCode>0102</failedCode>
                <failedReason>check fail</failedReason>
            </gamezctopcancel>
            `);
            return;
        }
        this.kind10log(kindId, "zc_cancel", "success");
        ctx.state.master.addSdkBackBuf(`
        <gamezctopcancel>
            <tbOrderNo>${param.tbOrderNo}</tbOrderNo>
            <coopOrderNo>${param.coopId}</coopOrderNo>
            <coopOrderStatus>CANCEL</coopOrderStatus>
            <coopOrderSnap>taobao|game service</coopOrderSnap>
            <coopOrderSuccessTime>${game_1.default.getSecondsId()}</coopOrderSuccessTime>
            <failedCode>0101</failedCode>
            <failedReason>the order is cancel</failedReason>
        </gamezctopcancel>
        `);
    }
    /**
     * 该API用于在游戏直充时，向供应商查询已下单子的执行进度
     */
    async zc_query(ctx) {
        const param = tool_1.tool.getParams(ctx);
        console.log("=====zc_query==param====", param);
        let kindId = game_1.default.rand(1, 999999).toString();
        this.kind10log(kindId, "zc_query", "param_" + JSON.stringify(param));
        if (this.checkSign(ctx) == false) {
            ctx.state.master.addSdkBackBuf(`
            <gamezctopquery>
                <tbOrderNo>${param.tbOrderNo}</tbOrderNo>
                <coopOrderSuccessTime>${game_1.default.getSecondsId()}</coopOrderSuccessTime>
                <coopOrderStatus>GENERAL_ERROR</coopOrderStatus>
                <failedReason>do not have the order</failedReason>
                <coopOrderNo>${param.coopId}</coopOrderNo>
                <failedCode>0102</failedCode>
                <coopOrderSnap>moshou|qufu1</coopOrderSnap>
            </gamezctopquery>
            `);
            return;
        }
        let orderInfo = await mongodb_1.dbSev.getDataDb().findOne("kind10", { orderId: param.coopId });
        if (orderInfo == null) {
            ctx.state.master.addSdkBackBuf(`
            <gamezctopquery>
                <tbOrderNo>${param.tbOrderNo}</tbOrderNo>
                <coopOrderSuccessTime>${game_1.default.getSecondsId()}</coopOrderSuccessTime>
                <coopOrderStatus>FAILED</coopOrderStatus>
                <failedReason>do not have the order</failedReason>
                <coopOrderNo>${param.coopId}</coopOrderNo>
                <failedCode>0501</failedCode>
                <coopOrderSnap>moshou|qufu1</coopOrderSnap>
            </gamezctopquery>
            `);
            return;
        }
        if (orderInfo.createAt > 0) {
            ctx.state.master.addSdkBackBuf(`
            <gamezctopquery>
                <tbOrderNo>${param.tbOrderNo}</tbOrderNo>
                <coopOrderSuccessTime>${game_1.default.getSecondsId()}</coopOrderSuccessTime>
                <coopOrderStatus>SUCCESS</coopOrderStatus>
                <failedReason>do not have the order</failedReason>
                <coopOrderNo>${param.coopId}</coopOrderNo>
                <failedCode>N/A</failedCode>
                <coopOrderSnap>moshou|qufu1</coopOrderSnap>
            </gamezctopquery>
            `);
            return;
        }
        if (orderInfo.createAt + 3600 < ctx.state.newTime) {
            ctx.state.master.addSdkBackBuf(`
            <gamezctopquery>
                <tbOrderNo>${param.tbOrderNo}</tbOrderNo>
                <coopOrderSuccessTime>${game_1.default.getSecondsId()}</coopOrderSuccessTime>
                <coopOrderStatus>UNDERWAY</coopOrderStatus>
                <failedReason>do not have the order</failedReason>
                <coopOrderNo>${param.coopId}</coopOrderNo>
                <failedCode>N/A</failedCode>
                <coopOrderSnap>moshou|qufu1</coopOrderSnap>
            </gamezctopquery>
            `);
            return;
        }
        ctx.state.master.addSdkBackBuf(`
        <gamezctopquery>
            <tbOrderNo>${param.tbOrderNo}</tbOrderNo>
            <coopOrderSuccessTime>${game_1.default.getSecondsId()}</coopOrderSuccessTime>
            <coopOrderStatus>FAILED</coopOrderStatus>
            <failedReason>do not have the order</failedReason>
            <coopOrderNo>${param.coopId}</coopOrderNo>
            <failedCode>0501</failedCode>
            <coopOrderSnap>moshou|qufu1</coopOrderSnap>
        </gamezctopquery>
        `);
    }
    checkSign(ctx, appsecret = "c24ab46076c261b4970a609259e29fea") {
        const bizParams = tool_1.tool.getParams(ctx);
        var remoteSign = bizParams['sign'];
        var sorted = Object.keys(bizParams).sort();
        var bastString = appsecret;
        var localSign;
        for (var i = 0, l = sorted.length; i < l; i++) {
            var k = sorted[i];
            var value = bizParams[k];
            if (k == 'sign') {
                continue;
            }
            if (k == 'timestamp') {
                value = value.replace('+', ' ');
            }
            bastString += k;
            bastString += value;
        }
        bastString += appsecret;
        localSign = ts_md5_1.Md5.hashStr(bastString).toString().toUpperCase();
        if (localSign == remoteSign) {
            return true;
        }
        return false;
    }
    checkSign_1(ctx, appsecret = "c24ab46076c261b4970a609259e29fea") {
        const bizParams = {};
        var urlParams = ctx.querystring.split("&");
        for (var i = 0; i < urlParams.length; i++) {
            var params = urlParams[i].split("=");
            bizParams[params[0]] = params[1];
        }
        var remoteSign = bizParams['sign'];
        var sorted = Object.keys(bizParams).sort();
        var bastString = appsecret;
        var localSign;
        for (var i = 0, l = sorted.length; i < l; i++) {
            var k = sorted[i];
            var value = bizParams[k];
            if (k == 'sign') {
                continue;
            }
            let gbkData = "";
            if (k != "tbOrderSnap") {
                gbkData = decodeURIComponent(value); // 将 GBK 编码解码为字符串  
            }
            else {
                let arr = value.split("%7C");
                for (let index = 0; index < arr.length; index++) {
                    if (arr[index] != null && arr[index] != "") {
                        if (index == 1) {
                            arr[index] == "%E5%D0%D2%A3%CF%C91%D4%AA%D3%CE%CF%B7%C0%F1%B0%FC";
                            let str11 = arr[index].replace('%E5%D0%D2%A3%CF%C9', '逍遥仙');
                            let str12 = str11.replace('%D4%AA%D3%CE%CF%B7%C0%F1%B0%FC', '元游戏礼包');
                            let str13 = str12.replace('%D4%AA%C0%F1%B0%FC', '元礼包');
                            gbkData += str13;
                        }
                        else {
                            gbkData += decodeURIComponent(arr[index]);
                        }
                    }
                    if (index != arr.length - 1) {
                        gbkData += "|";
                    }
                }
                // gbkData = '1.00|逍遥仙1元游戏礼包||||{"buyerIp":"","buyerIpv6":"","outerId":""}'
            }
            if (k == 'timestamp') {
                gbkData = gbkData.replace('+', ' ');
            }
            bastString += k;
            bastString += gbkData;
        }
        bastString += appsecret;
        console.log("====bastString====", bastString);
        var buffer = iconv_lite_1.encode(bastString, "gbk");
        var sum = crypto.createHash("md5");
        var isBuffer = Buffer.isBuffer(buffer);
        // if (!isBuffer && typeof bastString === 'object') {
        //     s = JSON.stringify(sortObject(bastString));
        // }
        sum.update(buffer, isBuffer ? 'binary' : 'utf8');
        localSign = sum.digest('hex').toString().toUpperCase();
        // localSign = Md5.hashStr(bastString).toString().toUpperCase();
        console.log("====localSign=1====", localSign);
        console.log("====localSign=0====", remoteSign);
        if (localSign == remoteSign) {
            return true;
        }
        return false;
    }
    /**
     * 支付验证
     */
    async zhifu(ctx) {
        let kindId = game_1.default.rand(1, 999999).toString();
        const param = tool_1.tool.getParams(ctx);
        this.kind10log(kindId, "zhifu", "querystring_" + ctx.querystring);
        if (this.checkSign_1(ctx) == false) {
            this.kind10log(kindId, "验证失败", "验证失败");
            ctx.state.master.addSdkBackBuf(`
            <gamezctoporder>
                <tbOrderNo>${param.tbOrderNo}</tbOrderNo>
                <coopOrderSuccessTime>${game_1.default.getSecondsId()}</coopOrderSuccessTime>
                <coopOrderStatus>GENERAL_ERROR</coopOrderStatus>
                <failedReason>check failed</failedReason>
                <coopOrderNo>${param.coopId}</coopOrderNo>
                <failedCode>0102</failedCode>
                <coopOrderSnap>taobao|game|order</coopOrderSnap>
            </gamezctoporder>
            `);
            return;
        }
        let lpback = await mongodb_1.dbSev.getDataDb().findOne("loginPlatform", { 'openId': param.customer });
        if (lpback == null || lpback.order10Id == null || lpback.order10Id == "") {
            this.kind10log(kindId, "后端下单ID错误", "cp_order10Id_" + param.customer);
            ctx.state.master.addSdkBackBuf(`
            <gamezctoporder>
                <tbOrderNo>${param.tbOrderNo}</tbOrderNo>
                <coopOrderSuccessTime>${game_1.default.getSecondsId()}</coopOrderSuccessTime>
                <coopOrderStatus>FAILED</coopOrderStatus>
                <failedReason>后端下单ID错误</failedReason>
                <coopOrderNo>${param.coopId}</coopOrderNo>
                <failedCode>0</failedCode>
                <coopOrderSnap>${param.tbOrderSnap}</coopOrderSnap>
            </gamezctoporder>
            `);
            return;
        }
        let orderInfo = await mongodb_1.dbSev.getDataDb().findOne("kind10", { orderId: lpback.order10Id });
        if (orderInfo == null) {
            this.kind10log(kindId, "后端订单ID错误", "cp_order_id_" + lpback.order10Id);
            ctx.state.master.addSdkBackBuf(`
            <gamezctoporder>
                <tbOrderNo>${param.tbOrderNo}</tbOrderNo>
                <coopOrderSuccessTime>${game_1.default.getSecondsId()}</coopOrderSuccessTime>
                <coopOrderStatus>FAILED</coopOrderStatus>
                <failedReason>后端订单ID错误</failedReason>
                <coopOrderNo>${param.coopId}</coopOrderNo>
                <failedCode>0</failedCode>
                <coopOrderSnap>${param.tbOrderSnap}</coopOrderSnap>
            </gamezctoporder>
            `);
            return;
        }
        if (orderInfo.money != parseInt(param.sum)) {
            this.kind10log(kindId, "充值金额对不上", parseInt(param.sum) + "_" + orderInfo.money);
            ctx.state.master.addSdkBackBuf(`
            <gamezctoporder>
                <tbOrderNo>${param.tbOrderNo}</tbOrderNo>
                <coopOrderSuccessTime>${game_1.default.getSecondsId()}</coopOrderSuccessTime>
                <coopOrderStatus>FAILED</coopOrderStatus>
                <failedReason>充值金额对不上</failedReason>
                <coopOrderNo>${param.coopId}</coopOrderNo>
                <failedCode>0</failedCode>
                <coopOrderSnap>${param.tbOrderSnap}</coopOrderSnap>
            </gamezctoporder>
            `);
            return;
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
        let typeMsg = await ctx.state.master.kind10Success(lpback.order10Id, param.tbOrderNo, 2);
        if (typeMsg.type == 1) {
            this.kind10log(kindId, "充值成功", "SUCCESS");
            ctx.state.master.addSdkBackBuf(`
            <gamezctoporder>
                <tbOrderNo>${param.tbOrderNo}</tbOrderNo>
                <coopOrderSuccessTime>${game_1.default.getSecondsId()}</coopOrderSuccessTime>
                <coopOrderStatus>SUCCESS</coopOrderStatus>
                <failedReason>the order is succeed</failedReason>
                <coopOrderNo>${param.coopId}</coopOrderNo>
                <failedCode>0</failedCode>
                <coopOrderSnap>taobao|game|order</coopOrderSnap>
            </gamezctoporder>
            `);
            return;
        }
        this.kind10log(kindId, "充值失败", JSON.stringify(typeMsg));
        ctx.state.master.addSdkBackBuf(`
        <gamezctoporder>
            <tbOrderNo>${param.tbOrderNo}</tbOrderNo>
            <coopOrderSuccessTime>${game_1.default.getSecondsId()}</coopOrderSuccessTime>
            <coopOrderStatus>FAILED</coopOrderStatus>
            <failedReason>充值失败</failedReason>
            <coopOrderNo>${param.coopId}</coopOrderNo>
            <failedCode>0</failedCode>
            <coopOrderSnap>${param.tbOrderSnap}</coopOrderSnap>
        </gamezctoporder>
        `);
        return;
    }
    /**
     * 记录充值日志
     */
    async kind10log(kindId, name, str) {
        await mongodb_1.dbSev.getFlowDb().insert("taobao_" + game_1.default.getTodayId(), {
            kindId: kindId,
            name: name,
            str: str,
            at: game_1.default.getTime(),
        });
    }
}
let taobao = new Taobao();
exports.default = taobao;
//# sourceMappingURL=taobao.js.map