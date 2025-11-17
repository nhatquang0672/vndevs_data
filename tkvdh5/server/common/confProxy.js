"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfListProxy = void 0;
class ConfProxy {
    constructor(conf, ...args) {
        this.pool = {};
        conf.forEach(element => {
            this.pool[ConfProxy.setKey(element, args)] = element;
        });
    }
    static getKey(args) {
        let out = "";
        args.forEach(element => {
            out += element;
            out += "_";
        });
        return out;
    }
    static setKey(target, args) {
        let out = "";
        args.forEach(element => {
            out += target[element];
            out += "_";
        });
        return out;
    }
    getItem(...args) {
        return this.pool[ConfProxy.getKey(args)];
    }
    getItemCtx(ctx, ...args) {
        let back = this.pool[ConfProxy.getKey(args)];
        if (back == null) {
            ctx.throw("配置错误" + args);
        }
        return back;
    }
}
exports.default = ConfProxy;
class ConfListProxy {
    constructor(conf, ...args) {
        this.pool = {};
        conf.forEach(element => {
            let key = ConfProxy.setKey(element, args);
            if (this.pool[key] == null) {
                this.pool[key] = [];
            }
            this.pool[key].push(element);
        });
    }
    getItemList(...args) {
        return this.pool[ConfProxy.getKey(args)];
    }
    getItemListCtx(ctx, ...args) {
        let back = this.pool[ConfProxy.getKey(args)];
        if (back == null) {
            ctx.throw("list配置错误" + args);
        }
        return back;
    }
}
exports.ConfListProxy = ConfListProxy;
//# sourceMappingURL=confProxy.js.map