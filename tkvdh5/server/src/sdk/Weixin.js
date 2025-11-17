"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = __importDefault(require("../util/game"));
const mongodb_1 = require("../util/mongodb");
const ts_md5_1 = require("ts-md5");
const gameMethod_1 = require("../../common/gameMethod");
const tool_1 = require("../util/tool");
const gameCfg_1 = __importDefault(require("../../common/gameCfg"));
const setting_1 = __importDefault(require("../crontab/setting"));
//参数配置
const configs = {};
/**
 * 微信
 */
class Weixin {
    /**
     * 微信登陆
     * @param pid
     * @param code
     */
    async login(ctx, pid, code) {
        let url = "https://api.weixin.qq.com/sns/jscode2session?";
        url += `appid=${configs[pid].appid}`;
        url += `&secret=${configs[pid].appsecret}`;
        url += `&js_code=${code}&grant_type=authorization_code`;
        let back = JSON.parse(await game_1.default.get(url));
        if (back == null) {
            ctx.throw("微信登陆失败");
        }
        if (gameMethod_1.gameMethod.isEmpty(back.openid) == true) {
            tool_1.tool.clog('微信登陆', back);
            ctx.throw(back.errmsg);
        }
        //验证key
        let token = ts_md5_1.Md5.hashStr(pid + '_' + back.openid + '_' + ctx.state.newTime).toString();
        await mongodb_1.dbSev.getDataDb().update("plat", {
            pid: pid,
            openid: back.openid
        }, {
            pid: pid,
            openid: back.openid,
            token: token,
            plat: "wechat"
        }, true);
        //平台正常返回
        ctx.state.master.addBackBuf({ "platBack": {
                openid: back.openid,
                token: token //后端验证key
            } });
    }
    /**
     * 订阅发送
     *
     *  cp发送订阅消息
        url: https://mp.xibanli.com/cp/msg/sendSubMsg
        请求方式: post

        参数: app_id,mem_id,user_token,sign  同cp/user/check接口参数
        附加参数:
            template_id: 订阅模板id  (String)
            page: 跳转页面,为空默认 index  (String)
            data: 模板内容[字段与模板id对应]  (String) 例: '{"name01": {"value": "某某"},"amount01": {"value": "￥100"},"thing01": {"value": "广州至北京"} ,"date01": {"value": "2018-01-01"}}'
            
     */
    async dingYueSend(uid, id, param) {
        let platinfo = await tool_1.tool.getOpenIdByUid(uid);
        if (platinfo == null || platinfo.wxopenid == "") {
            return;
        }
        let pid = platinfo.pid;
        if (configs[pid] == null) {
            return;
        }
        //推送
        let cfg = gameCfg_1.default.subscribeInfo.getItem(id);
        if (cfg == null) {
            return;
        }
        let desc1 = cfg.desc1;
        let desc2 = cfg.desc2;
        if (id == '1') {
            desc1 = desc1.replace('{0}', param[0]);
        }
        if (id == '4') {
            desc1 = desc1.replace('{0}', param[0]);
        }
        if (id == '5') {
            //[uuid,heid]
            let dayRwd = setting_1.default.getSysRwds(param[1], 'jjcDay', 'x', game_1.default.getNowTime());
            let rid = "";
            if (dayRwd[param[0]] != null) {
                rid = dayRwd[param[0]][0].toString();
            }
            desc2 = desc2.replace('{0}', rid);
        }
        if (id == '8') {
            desc1 = desc1.replace('{0}', param[0]);
        }
        if (id == '9') {
            desc1 = desc1.replace('{0}', param[0]);
        }
        let data = {};
        data[cfg.geshi[0]] = {
            "value": desc1,
        };
        data[cfg.geshi[1]] = {
            "value": desc2,
        };
    }
}
let weixin = new Weixin();
exports.default = weixin;
//# sourceMappingURL=Weixin.js.map