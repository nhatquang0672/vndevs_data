"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const master_1 = require("../util/master");
const redis_1 = require("../util/redis");
const tool_1 = require("../util/tool");
const game_1 = __importDefault(require("../util/game"));
const UserModel_1 = require("../model/user/UserModel");
const mongodb_1 = require("../util/mongodb");
const ts_md5_1 = require("ts-md5");
const lock_1 = __importDefault(require("../util/lock"));
const gameMethod_1 = require("../../common/gameMethod");
const crypto = require("crypto");
//参数配置
const configs = {};
/**
 * 仙剑问道 - 米大师
 */
class YlWechat {
    /**
     * 微信 服务器 推送过来
     */
    async zhifuIosSend(ctx) {
        const param = tool_1.tool.getParams(ctx);
        let token = "434bd5daf6b1d3de81354517688a13cc"; //Token(令牌)
        // let EncodingAESKey = "df32OvENPHRwC0a9fjVNCnDxhAcNa1mv00CSsQrbOqH"  //消息加密密钥
        let arr = [token, param.timestamp, param.nonce];
        arr = arr.sort();
        let str = "";
        for (const ar of arr) {
            str += ar;
        }
        let sign = crypto.createHash('sha1').update(str).digest('hex');
        if (sign == param.signature) {
            ctx.state.master.addSdkBackBuf(param.echostr);
            if (param.MsgType != "miniprogrampage") {
                return;
            }
            let kindId = game_1.default.rand(1, 999999).toString();
            let orderInfo = await mongodb_1.dbSev.getDataDb().findOne("kind10", { orderId: param.PagePath.toString() });
            if (orderInfo == null) {
                ctx.throw("无效订单ID");
                await this.kind10log(kindId, "无效订单ID", JSON.stringify({ "orderId": param.PagePath.toString() }));
                return;
            }
            let uuid = orderInfo.uuid;
            if (orderInfo.overAt > 0) {
                ctx.throw("订单已完成");
                await this.kind10log(kindId, uuid + "订单已完成", JSON.stringify({ "orderId": param.PagePath.toString() }));
                return;
            }
            let userModel = UserModel_1.UserModel.getInstance(ctx, uuid);
            let userInfo = await userModel.getInfo();
            let platinfo = await tool_1.tool.getOpenIdByUid(userInfo.uid);
            if (platinfo == null) {
                await this.kind10log(kindId, uuid + "zhifuIosSend1", uuid);
                return;
            }
            if (configs[platinfo.pid] == null) {
                ctx.throw("zhifuIosSend2");
                await this.kind10log(kindId, uuid + "zhifuIosSend2", uuid);
                return;
            }
            let stUrl = `https://api.weixin.qq.com/cgi-bin/stable_token`;
            //获取access_token
            let accessToken = "";
            let YlRds = await redis_1.redisSev.getRedis(master_1.DataType.system).get("ylWechatRedis");
            if (YlRds == null || YlRds.eat < ctx.state.newTime) {
                let back1 = await tool_1.tool.postSync(stUrl, { json: {
                        grant_type: "client_credential",
                        appid: configs[platinfo.pid].appid,
                        secret: configs[platinfo.pid].appsecret
                    } });
                if (back1 == "-1" || back1 == null) {
                    ctx.throw("zhifuIosSend7");
                    await this.kind10log(kindId, uuid + "zhifuIosSend7", "");
                    return;
                }
                if (typeof back1 == "string") {
                    back1 = JSON.parse(back1);
                }
                if (back1 == null || back1.access_token == null || back1.expires_in == null) {
                    ctx.throw("zhifuIosSend3");
                    await this.kind10log(kindId, uuid + "zhifuIosSend3", JSON.stringify(back1));
                    return;
                }
                await redis_1.redisSev.getRedis(master_1.DataType.system).set("ylWechatRedis", {
                    key: back1.access_token,
                    eat: ctx.state.newTime + back1.expires_in - 60
                });
                accessToken = back1.access_token;
            }
            else {
                accessToken = YlRds.key;
            }
            let url = `https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=${accessToken}`;
            let pturl = `https://api.ylxyx.cn/api/thirdparty/weixin/public/pay?key=0e0c53b147c0bae0&amount=${orderInfo.rmb * 100}&account_code=${platinfo.parms[0]}&order_id=${param.PagePath.toString()}`;
            console.log("=pturl==", uuid, pturl);
            let postData = {
                "touser": platinfo.openid,
                "msgtype": "link",
                "link": {
                    "title": "点击发起充值",
                    "description": `购买${orderInfo.title}，共${orderInfo.rmb}元`,
                    "url": pturl,
                }
                // "msgtype":"text",
                // "text":
                // {
                //   "content":`<a href="${pturl}" >点击发起充值\n        购买${orderInfo.title}，共${orderInfo.rmb}元</a>`
                // }
            };
            let back = await tool_1.tool.postSync(url, { json: postData });
            console.log('===back====', JSON.stringify(back));
            return;
        }
    }
    /**
     * 支付验证 - 苹果
     */
    async zhifuIos(ctx) {
        const { ut, sign, order_id, amount } = tool_1.tool.getParams(ctx);
        let kindId = game_1.default.rand(1, 999999).toString();
        console.log('====zhifuIos===uuid========', order_id);
        await this.kind10log(kindId, "zhifuIos", JSON.stringify(tool_1.tool.getParams(ctx)));
        let orderInfo = await mongodb_1.dbSev.getDataDb().findOne("kind10", { orderId: order_id.toString() });
        if (orderInfo == null) {
            await this.kind10log(kindId, "无效订单ID", JSON.stringify({ "orderId": order_id }));
            ctx.throw("无效订单ID");
            return;
        }
        ctx.state.uuid = "10087";
        ctx.state.fuuid = orderInfo.uuid;
        console.log('====zhifuIos===uuid=====uuid===', order_id, orderInfo.uuid);
        await lock_1.default.setLock(ctx, "user", orderInfo.uuid); //枷锁
        let fuserModel = UserModel_1.UserModel.getInstance(ctx, orderInfo.uuid);
        let fuserInfo = await fuserModel.getInfo();
        ctx.state.sid = fuserInfo.sid;
        ctx.state.regtime = fuserInfo.regtime;
        ctx.state.level = fuserInfo.level;
        let platinfo = await tool_1.tool.getOpenIdByUid(fuserInfo.uid);
        if (platinfo == null) {
            await this.kind10log(kindId, fuserInfo.uuid + "奖励发放失败1", fuserInfo.uuid);
            return;
        }
        if (configs[platinfo.pid] == null) {
            await this.kind10log(kindId, fuserInfo.uuid + "奖励发放失败2", fuserInfo.uuid);
            ctx.throw("奖励发放失败2");
            return;
        }
        if (amount < orderInfo.rmb * 100) {
            await this.kind10log(kindId, fuserInfo.uuid + "金额错误", fuserInfo.uuid);
            ctx.throw("奖励发放失败7");
            return;
        }
        let str = `amount=${amount}&order_id=${order_id}&ut=${ut}&${configs[platinfo.pid].ioskkk}`;
        let signStr = ts_md5_1.Md5.hashStr(str).toString();
        if (sign == signStr) {
            let typeMsg = await ctx.state.master.kind10Success(order_id, "ios_" + order_id, 2);
            if (typeMsg.type == 1) {
                this.shangbaoOrder(ctx, 0, orderInfo, order_id);
                ctx.state.master.addSdkBackBuf("SUCCESS");
                this.kind10log(kindId, fuserInfo.uuid + "充值成功", "SUCCESS");
                return;
            }
            this.kind10log(kindId, fuserInfo.uuid + "充值失败1", JSON.stringify(typeMsg));
        }
        else {
            await this.kind10log(kindId, orderInfo.uuid + "验证失败", JSON.stringify({ "orderId": order_id }));
            ctx.throw("验证失败");
            return;
        }
        ctx.state.master.addSdkBackBuf("FAILURE");
    }
    /**
     * 支付验证 - 安卓
     */
    async zhifuAndriod(ctx) {
        const { uuid, order10Id, wxcode } = tool_1.tool.getParams(ctx);
        console.log('====zhifuAndriod===uuid========', uuid);
        let kindId = game_1.default.rand(1, 999999).toString();
        let userModel = UserModel_1.UserModel.getInstance(ctx, uuid);
        let userInfo = await userModel.getInfo();
        let platinfo = await tool_1.tool.getOpenIdByUid(userInfo.uid);
        if (platinfo == null) {
            await this.kind10log(kindId, uuid + "奖励发放失败1", uuid);
            return;
        }
        if (configs[platinfo.pid] == null) {
            await this.kind10log(kindId, uuid + "奖励发放失败2", uuid);
            ctx.throw("奖励发放失败2");
            return;
        }
        let stUrl = `https://api.weixin.qq.com/cgi-bin/stable_token`;
        //获取access_token
        let accessToken = "";
        let YlRds = await redis_1.redisSev.getRedis(master_1.DataType.system).get("ylWechatRedis");
        if (YlRds == null || YlRds.eat < ctx.state.newTime) {
            let back1 = await tool_1.tool.postSync(stUrl, { json: {
                    grant_type: "client_credential",
                    appid: configs[platinfo.pid].appid,
                    secret: configs[platinfo.pid].appsecret
                } });
            if (back1 == "-1" || back1 == null) {
                await this.kind10log(kindId, uuid + "奖励发放失败7", "");
                ctx.throw("奖励发放失败7");
                return;
            }
            if (typeof back1 == "string") {
                back1 = JSON.parse(back1);
            }
            if (back1 == null || back1.access_token == null || back1.expires_in == null) {
                await this.kind10log(kindId, uuid + "奖励发放失败3", JSON.stringify(back1));
                ctx.throw("奖励发放失败3");
                return;
            }
            await redis_1.redisSev.getRedis(master_1.DataType.system).set("ylWechatRedis", {
                key: back1.access_token,
                eat: ctx.state.newTime + back1.expires_in - 60
            });
            accessToken = back1.access_token;
        }
        else {
            accessToken = YlRds.key;
        }
        let orderInfo = await mongodb_1.dbSev.getDataDb().findOne("kind10", { orderId: order10Id.toString() });
        if (orderInfo == null) {
            await this.kind10log(kindId, uuid + "无效订单ID", JSON.stringify({ "orderId": order10Id }));
            ctx.throw("无效订单ID");
            return;
        }
        if (orderInfo.overAt > 0) {
            await this.kind10log(kindId, uuid + "订单已完成", JSON.stringify({ "orderId": order10Id }));
            ctx.throw("订单已完成");
            return;
        }
        //post参数
        let postData = {
            openid: platinfo.openid,
            offer_id: configs[platinfo.pid].offer_id,
            ts: ctx.state.newTime,
            zone_id: "1",
            env: 0,
            user_ip: tool_1.tool.getClientIP(ctx),
            amount: orderInfo.rmb * 100,
            bill_no: order10Id.toString(),
            payitem: orderInfo.title,
            remark: "游戏礼包",
        };
        let stringSignTemp = `/wxa/game/pay&` + JSON.stringify(postData);
        let pay_sig = crypto.createHmac('sha256', configs[platinfo.pid].appkey).update(stringSignTemp, 'utf8').digest('hex');
        let wxurl = `https://api.weixin.qq.com/sns/jscode2session?appid=${configs[platinfo.pid].appid}&secret=${configs[platinfo.pid].appsecret}&js_code=${wxcode}&grant_type=authorization_code`;
        let back3 = await game_1.default.get(wxurl);
        if (typeof back3 == "string") {
            back3 = JSON.parse(back3);
        }
        if (back3 == null || back3.session_key == null) {
            await this.kind10log(kindId, uuid + "奖励发放失败8", JSON.stringify(back3));
            ctx.throw("奖励发放失败8");
            return;
        }
        let signature = crypto.createHmac('sha256', back3.session_key).update(JSON.stringify(postData), 'utf8').digest('hex');
        //扣款地址
        let subUrl = `https://api.weixin.qq.com/wxa/game/pay?access_token=${accessToken}&signature=${signature}&sig_method=hmac_sha256&pay_sig=${pay_sig}`;
        let back = await tool_1.tool.postSync(subUrl, { json: postData });
        await this.kind10log(kindId, uuid + "back", JSON.stringify(back));
        if (back == "-1" || back == null) {
            await this.kind10log(kindId, uuid + "奖励发放失败4", JSON.stringify(postData));
            ctx.throw("奖励发放失败4");
            return;
        }
        if (back.errcode != 0) {
            await this.kind10log(kindId, uuid + "奖励发放失败5", JSON.stringify(back));
            ctx.throw("奖励发放失败5");
            return;
        }
        let typeMsg = await ctx.state.master.kind10Success(order10Id, "anzhuo_" + back.bill_no, 2);
        if (typeMsg.type == 1) {
            this.shangbaoOrder(ctx, 1, orderInfo, back.bill_no);
            this.kind10log(kindId, uuid + "充值成功", "SUCCESS");
            return;
        }
        this.kind10log(kindId, uuid + "充值失败", JSON.stringify(typeMsg));
    }
    /**
      * 获取 小程序的 URL Link
      */
    async getUrlLink(ctx) {
        const { query } = tool_1.tool.getParams(ctx);
        console.log('====getUrlLink====', JSON.stringify(tool_1.tool.getParams(ctx)));
        let stUrl = `https://api.weixin.qq.com/cgi-bin/stable_token`;
        //获取access_token
        let accessToken = "";
        let YlRds = await redis_1.redisSev.getRedis(master_1.DataType.system).get("ylWechatRedis");
        if (YlRds == null || YlRds.eat < ctx.state.newTime) {
            let back1 = await tool_1.tool.postSync(stUrl, { json: {
                    grant_type: "client_credential",
                    appid: configs["402"].appid,
                    secret: configs["402"].appsecret
                } });
            if (back1 == "-1" || back1 == null) {
                ctx.throw("奖励发放失败7");
                return;
            }
            if (typeof back1 == "string") {
                back1 = JSON.parse(back1);
            }
            if (back1 == null || back1.access_token == null || back1.expires_in == null) {
                ctx.throw("奖励发放失败3");
                return;
            }
            await redis_1.redisSev.getRedis(master_1.DataType.system).set("ylWechatRedis", {
                key: back1.access_token,
                eat: ctx.state.newTime + back1.expires_in - 60
            });
            accessToken = back1.access_token;
        }
        else {
            accessToken = YlRds.key;
        }
        let lurl = `https://api.weixin.qq.com/wxa/generate_urllink?access_token=${accessToken}`;
        //post参数
        let postData = {
        // "path": "/pages/publishHomework/publishHomework",
        // "query": query.toString() ,
        // "is_expire":true,
        // "expire_type":1,
        // "expire_interval":1,
        // "env_version": "release",
        // "cloud_base":
        // {
        //     "env": "xxx",
        //     "domain": "xxx.xx",
        //     "path": "/jump-wxa.html",
        //     "query": "a=1&b=2"
        // }
        };
        if (gameMethod_1.gameMethod.isEmpty(query) == false) {
            postData["query"] = query.toString();
        }
        let back = await tool_1.tool.postSync(lurl, { json: postData });
        if (typeof back == "string") {
            back = JSON.parse(back);
        }
        ctx.state.master.addSdkBackBuf(back);
    }
    /**
      * 上报 user=用户接口
      */
    async shangbaoUser(ctx, uid, openid) {
        const params = tool_1.tool.getParams(ctx);
        if (params == null || params.pid == null || configs[params.pid] == null) {
            return;
        }
        let sburl = configs[params.pid].sburl; //上报地址
        let firstLoginIp = tool_1.tool.getClientIP(ctx);
        if (firstLoginIp.indexOf("::ffff:") != -1) {
            firstLoginIp = firstLoginIp.split("::ffff:")[1];
        }
        let cs = {
            "account": configs[params.pid].sbaccount,
            "appid": params.parms[3],
            // "secret":configs[params.pid].sbsecret,   //接口秘钥  (平台)
            "timestamp": ctx.state.newTime,
            "sign": "",
            "port": "user",
            "accountId": uid,
            "openid": openid,
            "regTime": game_1.default.getTime(),
            "firstLoginIp": firstLoginIp,
            "firstLoginScene": params.parms[4],
            "firstLoginOs": params.parms[5],
            "userAgent": params.parms[6],
            "source": gameMethod_1.gameMethod.isEmpty(params.parms[7]) == true ? "[]" : params.parms[7] //用户注册来源标记  (前端)
        };
        const keys = Object.keys(cs);
        keys.sort((a, b) => {
            if (a.toLowerCase() < b.toLowerCase()) {
                return -1;
            }
            else if (a.toLowerCase() > b.toLowerCase()) {
                return 1;
            }
            else {
                return 0;
            }
        });
        let str = "";
        for (const key of keys) {
            if (key == "sign") {
                continue;
            }
            str += `${key}=${cs[key]}&`;
        }
        let str1 = str + "key=" + configs[params.pid].sbsecret;
        let signStr = ts_md5_1.Md5.hashStr(str1).toString().toLocaleUpperCase();
        let _sburl = sburl + "?" + str + "sign=" + signStr;
        await tool_1.tool.postSync(encodeURI(_sburl), {});
    }
    /**
     * 上报 User_info=用户详情（区服）接口
     */
    async shangbaoUser_info(ctx, fuuid) {
        let userModel = UserModel_1.UserModel.getInstance(ctx, fuuid);
        let user = await userModel.getInfo();
        let back = await tool_1.tool.getOpenIdByUid(user.uid);
        if (back == null || back.plat != "ylWechat") {
            return;
        }
        let name = user.name == "" ? "初心者" + fuuid : user.name;
        let sburl = configs[back.pid].sburl; //上报地址
        let cs = {
            "account": configs[back.pid].sbaccount,
            "appid": back.parms[3],
            // "secret":configs[params.pid].sbsecret,   //接口秘钥  (平台)
            "timestamp": ctx.state.newTime,
            "sign": "",
            "port": "user_info",
            "accountId": user.uid,
            "openid": back.openid,
            "gameRoleIndex": fuuid,
            "gameArea": ctx.state.sid,
            "gameRoleName": name,
            "gameCharGuid": fuuid,
        };
        const keys = Object.keys(cs);
        keys.sort((a, b) => {
            if (a.toLowerCase() < b.toLowerCase()) {
                return -1;
            }
            else if (a.toLowerCase() > b.toLowerCase()) {
                return 1;
            }
            else {
                return 0;
            }
        });
        let str = "";
        for (const key of keys) {
            if (key == "sign") {
                continue;
            }
            str += `${key}=${cs[key]}&`;
        }
        let str1 = str + "key=" + configs[back.pid].sbsecret;
        let signStr = ts_md5_1.Md5.hashStr(str1).toString().toLocaleUpperCase();
        let _sburl = sburl + "?" + str + "sign=" + signStr;
        await tool_1.tool.postSync(encodeURI(_sburl), {});
    }
    /**
      * 上报 order=订单接口
      */
    async shangbaoOrder(ctx, type, orderInfo, platOrderId, payTime = game_1.default.getTimeS()) {
        let fuserModel = UserModel_1.UserModel.getInstance(ctx, orderInfo.uuid);
        let _fuser = await fuserModel.getInfo();
        let fuid = _fuser.uid;
        let platinfo = await tool_1.tool.getOpenIdByUid(fuid);
        if (platinfo == null) {
            console.log("===上报获取平台失败==");
            return;
        }
        let pid = platinfo.pid;
        let sburl = configs[pid].sburl; //上报地址
        let cs = {
            "account": configs[pid].sbaccount,
            "appid": configs[pid].appid,
            "secret": configs[pid].sbsecret,
            "timestamp": ctx.state.newTime,
            "sign": "",
            "port": "order",
            "accountId": fuid,
            "openid": platinfo.openid,
            "regTime": game_1.default.getTimeS(_fuser.regtime),
            "type": type,
            "tradeNo": platOrderId,
            "os": type == 0 ? "ios" : "android",
            "amount": orderInfo.money.toFixed(2),
            "payTime": payTime,
        };
        const keys = Object.keys(cs);
        keys.sort((a, b) => {
            if (a.toLowerCase() < b.toLowerCase()) {
                return -1;
            }
            else if (a.toLowerCase() > b.toLowerCase()) {
                return 1;
            }
            else {
                return 0;
            }
        });
        let str = "";
        for (const key of keys) {
            if (key == "sign") {
                continue;
            }
            str += `${key}=${cs[key]}&`;
        }
        let str1 = str + "key=" + configs[pid].sbsecret;
        let signStr = ts_md5_1.Md5.hashStr(str1).toString().toLocaleUpperCase();
        let _sburl = sburl + "?" + str + "sign=" + signStr;
        let back = await tool_1.tool.postSync(encodeURI(_sburl), {});
        console.log("===back====", back);
        if (typeof back == "string") {
            back = JSON.parse(back);
        }
        if (back.code != 200) {
            console.log("===back=1===", _sburl, cs);
        }
    }
    /**
     * 用户个人资料违规文字检测
     */
    async msg_sec_check(ctx, content, fuuid) {
        let userModel = UserModel_1.UserModel.getInstance(ctx, fuuid);
        let user = await userModel.getInfo();
        let back1 = await tool_1.tool.getOpenIdByUid(user.uid);
        if (back1 == null || back1.plat != "ylWechat") {
            return true;
        }
        let stUrl = `https://api.weixin.qq.com/cgi-bin/stable_token`;
        //获取access_token
        let accessToken = "";
        let YlRds = await redis_1.redisSev.getRedis(master_1.DataType.system).get("ylWechatRedis");
        if (YlRds == null || YlRds.eat < ctx.state.newTime) {
            let back1 = await tool_1.tool.postSync(stUrl, { json: {
                    grant_type: "client_credential",
                    appid: configs["402"].appid,
                    secret: configs["402"].appsecret
                } });
            if (back1 == "-1" || back1 == null) {
                return true;
            }
            if (typeof back1 == "string") {
                back1 = JSON.parse(back1);
            }
            if (back1 == null || back1.access_token == null || back1.expires_in == null) {
                return true;
            }
            await redis_1.redisSev.getRedis(master_1.DataType.system).set("ylWechatRedis", {
                key: back1.access_token,
                eat: ctx.state.newTime + back1.expires_in - 60
            });
            accessToken = back1.access_token;
        }
        else {
            accessToken = YlRds.key;
        }
        let url = `https://api.weixin.qq.com/wxa/msg_sec_check?access_token=${accessToken}`;
        let back = await tool_1.tool.postSync(url, { json: {
                content: content
            } });
        if (back != null && back.errmsg == "ok") {
            return true;
        }
        console.log("===back====", back);
        return false;
    }
    /**
     * 记录充值日志
     */
    async kind10log(kindId, name, str) {
        await mongodb_1.dbSev.getFlowDb().insert("YlWechat_" + game_1.default.getTodayId(), {
            kindId: kindId,
            name: name,
            str: str,
            at: game_1.default.getTime(),
        });
    }
}
let ylWechat = new YlWechat();
exports.default = ylWechat;
//# sourceMappingURL=YlWechat.js.map