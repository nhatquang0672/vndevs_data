"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const master_1 = require("../util/master");
const tool_1 = require("../util/tool");
const mongodb_1 = require("../util/mongodb");
const game_1 = __importDefault(require("../util/game"));
const redis_1 = require("../util/redis");
//参数配置
const configs = {};
/**
 * 抖音
 */
class YlTiktok {
    /**
     * 支付验证
     */
    async zhifu(ctx) {
        let kindId = game_1.default.rand(1, 999999).toString();
        const param = tool_1.tool.getParams(ctx);
        this.kind10log(kindId, "参数", JSON.stringify(param));
        if (configs[param.pid] == null) {
            this.kind10log(kindId, "pid_err", JSON.stringify(param.pid));
            return;
        }
        //需要对这些参数按字符串自然大小进行排序
        const strArr = [configs[param.pid].token, param.timestamp, param.nonce, param.msg].sort();
        const str = strArr.join('');
        //使用SHA1算法生成signature
        const _signature = require('crypto').createHash('sha1').update(str).digest('hex');
        //{"echostr":"RUWQAAMWRJ","msg":"","nonce":"347","signature":"d3548dc9a9b64b153e667cf54c9dc70427884d4d","timestamp":"1686644694"}
        // signature 一致表示请求来源于 字节小程序服务端
        if (_signature === param.signature) {
            //发放道具
            ctx.state.master.addSdkBackBuf(param.echostr);
            this.kind10log(kindId, "充值成功", param.echostr);
            return;
        }
        this.kind10log(kindId, "充值失败", "");
    }
    /**
     * 验证是否已完成支付防止支付成功没回调但没到账
     */
    async checkZhifu(ctx) {
        let kindId = game_1.default.rand(1, 999999).toString();
        const { pid, order10Id } = tool_1.tool.getParams(ctx);
        this.kind10log(kindId, "checkZhifu参数", pid + "_" + order10Id);
        if (configs[pid] == null) {
            this.kind10log(kindId, "pid_err", pid + "_" + order10Id);
            return 0;
        }
        let access_token = "";
        let rdsBack = await redis_1.redisSev.getRedis(master_1.DataType.system).get("tt_token");
        if (rdsBack == null || ctx.state.newTime >= rdsBack.expires_in) {
            let url1 = "https://minigame.zijieapi.com/mgplatform/api/apps/v2/token";
            let back1 = await tool_1.tool.postSync(url1, { json: {
                    appid: configs[pid].appid,
                    secret: configs[pid].appsecret,
                    grant_type: "client_credential",
                } });
            if (back1 == "-1" || back1.status != 1) {
                this.kind10log(kindId, "access_token_err", JSON.stringify(back1));
                return 0;
            }
            await redis_1.redisSev.getRedis(master_1.DataType.system).set("tt_token", { access_token: back1.access_token, expires_in: back1.expires_in + ctx.state.newTime });
            access_token = back1.access_token;
        }
        let url = `https://developer.toutiao.com/api/apps/game/payment/queryPayState?access_token=${access_token}&orderno=${order10Id}`;
        let back = await game_1.default.get(url);
        if (typeof back == "string") {
            back = JSON.parse(back);
        }
        if (back == null || back.status != "success") {
            this.kind10log(kindId, "检测未支付", JSON.stringify(back));
            return 0;
        }
        //
        let orderInfo = await mongodb_1.dbSev.getDataDb().findOne("kind10", { orderId: order10Id });
        if (orderInfo == null) {
            this.kind10log(kindId, "检测不存在订单", order10Id);
            return 1; //不存在订单
        }
        if (orderInfo.overAt > 0) {
            this.kind10log(kindId, "检测已完成", order10Id);
            return 1; //已经完成订单
        }
        let typeMsg = await ctx.state.master.kind10Success(order10Id, order10Id, 2);
        if (typeMsg.type == 1) {
            this.kind10log(kindId, "检测道具下发", JSON.stringify(typeMsg));
            return 1; //完成
        }
        this.kind10log(kindId, "充值失败", "");
        return 0;
    }
    /**
     * 记录充值日志
     */
    async kind10log(kindId, name, str) {
        await mongodb_1.dbSev.getFlowDb().insert("ylTiktok_" + game_1.default.getTodayId(), {
            kindId: kindId,
            name: name,
            str: str,
            at: game_1.default.getTime(),
        });
    }
}
let ylTiktok = new YlTiktok();
exports.default = ylTiktok;
//# sourceMappingURL=YlTiktok.js.map