"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tool_1 = require("../util/tool");
const mongodb_1 = require("../util/mongodb");
const gameMethod_1 = require("../../common/gameMethod");
const router = new koa_router_1.default();
exports.router = router;
router.prefix('/taobao');
/**
 * @api {post} /taobao/kind11Rwd 淘宝广告成功奖励
 * @apiName 淘宝广告成功奖励
 * @apiGroup taobao
 *
 * @apiParam {string} uuid 角色uuid
 * @apiParam {string} token 角色token (user下发得token字段)
 *
 */
router.all('/kind11Rwd', async (ctx) => {
    ctx.state.apidesc = "淘宝-广告成功奖励";
    const { uuid, open_id } = tool_1.tool.getParams(ctx);
    let back = await mongodb_1.dbSev.getDataDb().findOne("tb_kind11", { openid: open_id });
    if (back == null || gameMethod_1.gameMethod.isEmpty(back.time) == true || gameMethod_1.gameMethod.isEmpty(back.kind11Id) == true) {
        return;
    }
    await ctx.state.master.kind11Success(back.kind11Id, back.kind11Id);
    await mongodb_1.dbSev.getDataDb().update("tb_kind11", { openid: open_id }, {
        "openid": open_id,
        "kind11Id": "",
        "time": 0
    });
});
//# sourceMappingURL=taobao.js.map