"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crontabStart_zi = exports.crontabStart_zhu = void 0;
const tool_1 = require("../util/tool");
const setting_1 = __importDefault(require("./setting"));
const game_1 = __importDefault(require("../util/game"));
const timer_1 = __importDefault(require("./timer"));
const redis_1 = require("../util/redis");
const process_1 = __importDefault(require("process"));
const mongodb_1 = require("../util/mongodb");
//启动  - 主服务器的   主进程 脚本
async function crontabStart_zhu() {
    //15秒轮询一次  这边虽然设置15秒 但内在逻辑要自己控制时间 , 每天0点 固定会执行一次
    let newTime = game_1.default.getNowTime();
    let new0 = game_1.default.getToDay_0(newTime);
    let lastAt = 15 - (newTime - new0) % 15;
    if (lastAt == 0) {
        lastAt = 15;
    }
    //15秒后 调用自身
    setTimeout(crontabStart_zhu, lastAt * 1000);
    //setting配置  + 活动配置 + 后台邮件配置
    await setting_1.default.createCash(new0, newTime, false);
    //主服务器  主进程  特有
    if (tool_1.tool.isZhuIp() == true) {
        oneServerCrontab(new0, newTime);
    }
}
exports.crontabStart_zhu = crontabStart_zhu;
//启动  - 所有服务器的 子进程 脚本
async function crontabStart_zi() {
    //15秒轮询一次  这边虽然设置15秒 但内在逻辑要自己控制时间 , 每天0点 固定会执行一次
    let newTime = game_1.default.getNowTime();
    let new0 = game_1.default.getToDay_0(newTime);
    let lastAt = 15 - (newTime - new0) % 15;
    if (lastAt == 0) {
        lastAt = 15;
    }
    //15秒后 调用自身
    setTimeout(crontabStart_zi, lastAt * 1000);
    //setting配置  + 活动配置 + 后台邮件配置
    await setting_1.default.createCash(new0, newTime, true);
    //检查redis  和  mongodb  是否正常
    if (await checkAll(game_1.default.getNowTime()) == false) {
        process_1.default.exit(0);
    }
}
exports.crontabStart_zi = crontabStart_zi;
//单服务器处理
async function oneServerCrontab(new0, newTime) {
    //通过脚本下发奖励
    await timer_1.default.doTimer(new0, newTime);
    //自动开服检查
    let back = setting_1.default.getSetting("1", "autoOpenQufu");
    if (back != null && back.auto == 1) { //开启
        let nowSid = setting_1.default.qufuNewId;
        //先检测充值人数
        let kind10s = await mongodb_1.dbSev.getDataDb().find("kind10", { "sid": nowSid.toString(), "overAt": { $gte: 1 } });
        let kind10Count = 0;
        if (kind10s != null) {
            let fuuids = {};
            for (const kind10 of kind10s) {
                if (fuuids[kind10.uuid] == null) {
                    fuuids[kind10.uuid] = 1;
                    kind10Count += 1;
                }
            }
        }
        let isAdd = 0;
        if (kind10Count >= back.order) {
            isAdd = 1;
            console.log("=====充值人数达到========", kind10Count);
        }
        else {
            //在检测玩家数量
            let userCount = await mongodb_1.dbSev.getDataDb().findCount("user", { "data.sid": nowSid.toString() });
            if (userCount >= back.users) {
                isAdd = 1;
                console.log("=====在检测玩家数量达到========", userCount);
            }
        }
        if (isAdd == 1) {
            let addSid = (nowSid + 1).toString();
            console.log("===加新服==", nowSid);
            //检测是否已经加了  如果加了 就不管了
            let back2 = await mongodb_1.dbSev.getDataDb().findOne("a_qufu", { sid: addSid });
            if (back2 == null || back2.openAt > newTime + 180) {
                let id = await mongodb_1.dbSev.getDataDb().getNextId('A_QUFU');
                await mongodb_1.dbSev.getDataDb().update("a_qufu", { sid: addSid }, {
                    id: id.toString(),
                    sid: addSid,
                    name: back.name.replace('{0}', addSid),
                    openAt: newTime + 180,
                    status: "1",
                    heid: addSid //合服ID
                }, true);
                console.log("====加完了===");
            }
            else {
                console.log("====不用管===");
            }
            await mongodb_1.dbSev.getDataDb().getNextId('A_VER');
        }
    }
    //检测启动是否启动版本更新操作
    //订阅功能已关闭 
    // let cfgYingyue = Setting.getSetting("1", "dingyue");
    // if (cfgYingyue != null && cfgYingyue.send == 1) {
    //     await dbSev.getDataDb().update("a_setting",{"key":"dingyue"},{
    //         value: '{\r\n  send:"0"  //0关闭1推送\r\n}'
    //     })
    //     let timers:tableTimer[] = await dbSev.getDataDb().find("timer",{
    //         kid:"dingyue",
    //         hid:"3",
    //         isOver:0  //是否发放完成
    //     })
    //     for (const timer of timers) {
    //         tool.updateTimer(timer.sid, "dingyue", timer.hdcid, "3", newTime+60,timer.cs);
    //     }
    // }
    // 【huo】每15秒上报一次下线玩家
    // let LoginDown = await dbSev.getFlowDb().findOne("LoginDown",{"uuid":"10086"})
    // let minDat = 0
    // let maxDat = newTime
    // if(LoginDown != null){
    //     minDat = LoginDown.dAt + 1
    // }
    // await dbSev.getFlowDb().update("LoginDown",{"uuid":"10086"},{"uuid":"10086","dAt":maxDat},true)
    // let sql:any = {}
    // sql["dAt"] = {$gt : minDat,$lte : maxDat}
    // let listDown = await dbSev.getFlowDb().find("LoginDown",sql)
    // for (const down of listDown) {
    //     if(down.uuid == "10086"){
    //         continue
    //     }
    //     let huoCtx = await tool.ctxCreate('huo',down.uuid)
    //     let fuserModel = UserModel.getInstance(huoCtx,down.uuid)
    //     let fuser = await fuserModel.getInfo()
    //     huo.shangbao(fuser,4,fuser.uuid) 
    // }
}
//检测 redis 和 db
async function checkAll(newTime) {
    //联系检测三次都跪了 关闭主进程
    if (await checkDB() == false) {
        game_1.default.sleep(100); //延长100ms
        if (await checkDB() == false) {
            game_1.default.sleep(100); //延长100ms
            if (await checkDB() == false) {
                console.log('=====start_checkDB=====主进程关闭===');
                return false;
            }
        }
    }
    //联系检测三次都跪了 关闭主进程
    if (await checkRedis(newTime) == false) {
        game_1.default.sleep(100); //延长100ms
        if (await checkRedis(newTime) == false) {
            game_1.default.sleep(100); //延长100ms
            if (await checkRedis(newTime) == false) {
                console.log('=====start_checkRedis=====主进程关闭===');
                return false;
            }
        }
    }
    return true;
}
//检测DB是否正常
async function checkDB() {
    try {
        await mongodb_1.dbSev.getDataDb().getNextId('FORK_ID');
        return true;
    }
    catch (err) {
        return false;
    }
}
//检测Redis是否正常
async function checkRedis(newTime) {
    try {
        for (const key in redis_1.redisSev.rdss) {
            await redis_1.redisSev.rdss[key].zAdd('FORK_ID', newTime, 'fork_id');
        }
        return true;
    }
    catch (err) {
        return false;
    }
}
//# sourceMappingURL=start.js.map