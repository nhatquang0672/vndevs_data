"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = require("../model/user/UserModel");
const game_1 = __importDefault(require("./game"));
const gameMethod_1 = require("../../common/gameMethod");
const mongodb_1 = require("./mongodb");
const tool_1 = require("./tool");
const setting_1 = __importDefault(require("../crontab/setting"));
/**
 * 缓存类
 */
class LockCache {
    /**
     * 获取角色消息
     * @param ctx
     * @param fuuid
     * @param jianyi 0默认全部下发 1简易消息下发
     * @returns
     */
    static async getFUser(ctx, fuuid, jianyi = 0) {
        if (LockCache.users[fuuid] == null) {
            await LockCache.makeFuser(fuuid);
        }
        if (ctx.state.newTime > LockCache.users[fuuid].time + 300) {
            LockCache.makeFuser(fuuid);
        }
        let fuserAll = gameMethod_1.gameMethod.objCopy(LockCache.users[fuuid].fuser);
        if (jianyi == 1) {
            fuserAll.sevBack = {};
        }
        //自定义设置称号
        let setChengHao = setting_1.default.getSetting("1", "setChengHao");
        if (setChengHao != null && setChengHao[fuuid] != null) {
            fuserAll.sevBack.setChengHao = setChengHao[fuuid];
        }
        return fuserAll;
    }
    static async makeFuser(fuuid) {
        let makeCtx = await tool_1.tool.ctxCreate('user', fuuid);
        makeCtx.state.addLock = false;
        if (LockCache.users[fuuid] != null && makeCtx.state.lasttime > 0 && makeCtx.state.lasttime < LockCache.users[fuuid].time) {
            LockCache.users[fuuid].time = makeCtx.state.newTime;
        }
        else {
            let userModel = UserModel_1.UserModel.getInstance(makeCtx, fuuid);
            LockCache.users[fuuid] = {
                fuser: await userModel.getFUserAll(),
                time: makeCtx.state.newTime,
            };
            // await tool.ctxUpdate(makeCtx)
        }
    }
    static setMailVer(uuid, ver) {
        LockCache.mailVers[uuid] = ver;
    }
    static getMailVer(uuid) {
        return LockCache.mailVers[uuid] ? LockCache.mailVers[uuid] : 0;
    }
    static setHdVer(uuid, ver) {
        LockCache.hdVers[uuid] = ver;
    }
    static getHdVer(uuid) {
        return LockCache.hdVers[uuid] ? LockCache.hdVers[uuid] : 0;
    }
    static async getJjcFuuid(level, nowTime) {
        if (LockCache.jjcVers[level] == null || LockCache.jjcVers[level].ver < nowTime) {
            LockCache.jjcVers[level] = {
                ver: nowTime + 600,
                uuids: []
            };
            let backs = await mongodb_1.dbSev.getDataDb().find("user", { "data.level": level });
            for (const back of backs) {
                LockCache.jjcVers[level].uuids.push(back.id);
            }
        }
        let fuuids = game_1.default.getRandArr(LockCache.jjcVers[level].uuids, 1);
        return fuuids[0] == null ? "" : fuuids[0];
    }
    static getFsJtEps(fuuid, epKey, actFuShi) {
        if (LockCache.fsJtEps[fuuid] == null || LockCache.fsJtEps[fuuid].ver != actFuShi.jtEpVer) {
            LockCache.fsJtEps[fuuid] = {
                ver: actFuShi.jtEpVer,
                eps: gameMethod_1.gameMethod.ep_fushi_jitan(actFuShi)
            };
        }
        return LockCache.fsJtEps[fuuid].eps[epKey] == null ? 0 : LockCache.fsJtEps[fuuid].eps[epKey];
    }
    static addHfuuid(key, fuuid) {
        if (LockCache.hefuRwd[key] == null) {
            LockCache.hefuRwd[key] = {};
        }
        if (LockCache.hefuRwd[key][fuuid] != null) {
            return false;
        }
        LockCache.hefuRwd[key][fuuid] = 1;
        return true;
    }
    static async getplayerallinit() {
        if (gameMethod_1.gameMethod.isEmpty(LockCache.playerall) == true) {
            LockCache.playerall = {
                key: "playerall",
                ver: "",
                json: {},
                lookAt: 1698076800,
            };
        }
        while (LockCache.playerall.lookAt < game_1.default.getNowTime()) {
            let tplayers = await mongodb_1.dbSev.getDataDb().find("player", { "data.regtime": { $gte: LockCache.playerall.lookAt, $lt: LockCache.playerall.lookAt + 7200 } });
            for (const tplayer of tplayers) {
                if (tplayer.data.qdtype == null) {
                    tplayer.data.qdtype = "DEFAULT";
                }
                LockCache.playerall.json[tplayer.id] = [tplayer.data.qdtype, Object.keys(tplayer.data.list)];
            }
            LockCache.playerall.lookAt += 7200;
        }
        LockCache.playerall.lookAt = game_1.default.getToDay_0();
    }
    static async getplayerall() {
        await LockCache.getplayerallinit();
        return LockCache.playerall.json;
    }
    static async getuerallinit() {
        if (gameMethod_1.gameMethod.isEmpty(LockCache.uerall) == true) {
            LockCache.uerall = {
                key: "userall",
                ver: "",
                json: [],
                lookAt: 1698076800,
            };
        }
        while (LockCache.uerall.lookAt < game_1.default.getNowTime()) {
            let tplayers = await mongodb_1.dbSev.getDataDb().find("user", { "data.regtime": { $gte: LockCache.uerall.lookAt, $lt: LockCache.uerall.lookAt + 7200 } });
            for (const tplayer of tplayers) {
                LockCache.uerall.json[tplayer.id] = [tplayer.id, tplayer.data.sid, tplayer.data.uid, tplayer.data.lastlogin, tplayer.data.regtime];
            }
            LockCache.uerall.lookAt += 7200;
        }
        LockCache.uerall.lookAt = game_1.default.getToDay_0();
    }
    static async getuerall() {
        await LockCache.getuerallinit();
        return LockCache.uerall.json;
    }
    static async getorderrallinit() {
        if (gameMethod_1.gameMethod.isEmpty(LockCache.orderrall) == true) {
            LockCache.orderrall = {
                key: "orderall",
                ver: "",
                json: [],
                lookAt: 1698076800,
            };
        }
        while (LockCache.orderrall.lookAt < game_1.default.getNowTime()) {
            let tplayers = await mongodb_1.dbSev.getDataDb().find("kind10", { "overAt": { $gte: LockCache.orderrall.lookAt, $lt: LockCache.orderrall.lookAt + 7200 } });
            for (const tplayer of tplayers) {
                LockCache.orderrall.json[tplayer.orderId] = tplayer;
            }
            LockCache.orderrall.lookAt += 7200;
        }
        LockCache.orderrall.lookAt = game_1.default.getToDay_0();
    }
    static async getorderrall() {
        await LockCache.getorderrallinit();
        return LockCache.orderrall.json;
    }
    static async getmd99dall(key, sql, isrefresh) {
        if (LockCache.md99dall[key] == null || isrefresh) {
            let s99s = await mongodb_1.dbSev.getFlowDb().find("Smaidian_99", sql);
            LockCache.md99dall[key] = s99s;
        }
        return LockCache.md99dall[key];
    }
}
exports.default = LockCache;
/**
 * 角色信息缓存 60秒
 */
LockCache.users = {};
/**
 * 邮件版本号缓存（后台）
 */
LockCache.mailVers = {};
/**
 * 邮件版本号缓存（活动）
 */
LockCache.hdVers = {};
//竞技场npc 指向玩家
LockCache.jjcVers = {};
//符石属性
LockCache.fsJtEps = {};
//合服缓存
LockCache.hefuRwd = {};
//sjzl
LockCache.playerall = {};
//sjzl
LockCache.uerall = {};
//sjzl
LockCache.orderrall = {};
//sjzl
LockCache.md99dall = {};
//# sourceMappingURL=cache.js.map