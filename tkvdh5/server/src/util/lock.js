"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("./redis");
const master_1 = require("./master");
/**
 * 锁
 */
class Lock {
    /**
     * 加锁 - 返回 锁key
     * @param ctx
     * @param key 枷锁key
     * @param fuuid 给谁枷锁
     */
    async setLock(ctx, key, fuuid) {
        if (ctx.state.addLock == false) {
            return; //不加锁
        }
        let uuid = ctx.state.uuid;
        if (uuid == null) {
            // return  //登陆没有uuid 不加锁
            ctx.throw('');
        }
        let lockKey = 'lock_' + key + '_' + fuuid;
        if (ctx.state.locks.indexOf(lockKey) != -1) {
            return; //重复加锁
        }
        if (await redis_1.redisSev.getRedis(master_1.DataType.system).lock(uuid, lockKey) == false) {
            console.error("===加锁失败====", uuid, ctx.url, lockKey);
            ctx.throw('服务器繁忙！！');
        }
        if (ctx.state.locks == null) {
            ctx.state.locks = [];
        }
        ctx.state.locks.push(lockKey);
    }
    //解锁
    async unLock(ctx) {
        let uuid = ctx.state.uuid;
        if (uuid != null) {
            for (const key of ctx.state.locks) {
                await redis_1.redisSev.getRedis(master_1.DataType.system).unLock(uuid, key);
            }
        }
    }
}
//输出
let lock = new Lock();
exports.default = lock;
//# sourceMappingURL=lock.js.map