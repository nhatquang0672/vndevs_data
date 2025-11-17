"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionType = exports.RdsClub = exports.RdsUser = exports.DongTianLogType = exports.TimeBen2Type = exports.TimeBenType = exports.PriCardType = exports.ChannelType = exports.SevBackType = void 0;
var SevBackType;
(function (SevBackType) {
    SevBackType[SevBackType["fail"] = 0] = "fail";
    SevBackType[SevBackType["success"] = 1] = "success";
    SevBackType[SevBackType["kind10"] = 2] = "kind10";
})(SevBackType = exports.SevBackType || (exports.SevBackType = {}));
var ChannelType;
(function (ChannelType) {
    ChannelType["hefu"] = "hefu";
    ChannelType["all"] = "all";
    ChannelType["club"] = "club";
    ChannelType["kua"] = "kua";
})(ChannelType = exports.ChannelType || (exports.ChannelType = {}));
//特权卡
var PriCardType;
(function (PriCardType) {
    PriCardType["moon"] = "moon";
    PriCardType["fever"] = "fever";
    PriCardType["fushi"] = "fushi";
})(PriCardType = exports.PriCardType || (exports.PriCardType = {}));
//限时福利()
var TimeBenType;
(function (TimeBenType) {
    TimeBenType["shengqi"] = "shengqi";
    TimeBenType["chibang"] = "chibang";
    TimeBenType["fazhen"] = "fazhen";
    TimeBenType["fumo"] = "fumo";
    TimeBenType["stone"] = "stone";
    TimeBenType["fazhenZh"] = "fazhenZh";
    TimeBenType["dinglu"] = "dinglu";
    TimeBenType["baoshi"] = "baoshi";
    TimeBenType["xilian"] = "xilian";
    TimeBenType["xlDandan1"] = "xlDandan1";
    TimeBenType["xlDandan2"] = "xlDandan2";
    TimeBenType["xlDandan3"] = "xlDandan3";
    TimeBenType["xlDandan4"] = "xlDandan4";
    TimeBenType["xlDandan6"] = "xlDandan6";
    TimeBenType["xlDandan7"] = "xlDandan7";
    TimeBenType["xlDandan9"] = "xlDandan9";
    TimeBenType["mingpan"] = "mingpan";
    TimeBenType["taixianfu"] = "taixianfu";
    TimeBenType["fajue"] = "fajue";
    TimeBenType["jingguai"] = "jingguai";
})(TimeBenType = exports.TimeBenType || (exports.TimeBenType = {}));
//触发礼包改版 //不可以有下划线
var TimeBen2Type;
(function (TimeBen2Type) {
    TimeBen2Type["shengqi"] = "shengqi";
    TimeBen2Type["chibang"] = "chibang";
    TimeBen2Type["fazhen"] = "fazhen";
    TimeBen2Type["fumo"] = "fumo";
    TimeBen2Type["stone"] = "stone";
    TimeBen2Type["fazhenZh"] = "fazhenZh";
    TimeBen2Type["dinglu"] = "dinglu";
    TimeBen2Type["baoshi"] = "baoshi";
})(TimeBen2Type = exports.TimeBen2Type || (exports.TimeBen2Type = {}));
//排行业务分类 user
var DongTianLogType;
(function (DongTianLogType) {
    DongTianLogType["newCar"] = "newCar";
    DongTianLogType["rob_s_a"] = "rob_s_a";
    DongTianLogType["rob_s_b"] = "rob_s_b";
    // rob_f_a = "rob_f_a", //掠夺_失败_矿主 //守护成功
    DongTianLogType["rob_f_b"] = "rob_f_b";
    DongTianLogType["fight_a"] = "fight_a";
    DongTianLogType["fight_b"] = "fight_b";
})(DongTianLogType = exports.DongTianLogType || (exports.DongTianLogType = {}));
/**
 * 一辆车信息
 */
// export interface ActDongTian_Rob {
//     fuser?: FUserInfo;
//     pos: string; //位置
//     knum: number; //苦工数量
//     carInfo?: ActDongTian_CarInfo; //输出时候 去别人家 取来构造
//     // et: number; //结束时间
// }
//排行业务分类 user
var RdsUser;
(function (RdsUser) {
    RdsUser["rdsJjc"] = "rdsJjc";
    RdsUser["rdsPvd"] = "rdsPvd";
    RdsUser["dongtian"] = "dongtian";
    RdsUser["pvw"] = "rdsPvw";
    RdsUser["rdsLiuDao"] = "rdsLiuDao";
    RdsUser["rdsHdChou"] = "rdsHdChou";
    RdsUser["rdsHdQiYuan"] = "rdsHdQiYuan";
    RdsUser["rdsHdHuanJing"] = "rdsHdHuanJing";
    RdsUser["rdsHdXinMo"] = "rdsHdXinMo";
    RdsUser["rdsHdChumo"] = "rdsHdChumo";
    RdsUser["rdsDouLuo"] = "rdsDouLuo";
    RdsUser["rdsHdTianGong"] = "rdsHdTianGong";
    RdsUser["rdsHdTianGongKua"] = "rdsHdTianGongKua";
    RdsUser["rdsHdChongBang"] = "rdsHdChongBang";
    RdsUser["rdsHdDengShenBangKua"] = "rdsHdDengShenBangKua";
    RdsUser["rdsHdDengShenBangKing"] = "rdsHdDengShenBangKing";
})(RdsUser = exports.RdsUser || (exports.RdsUser = {}));
//排行业务分类 club
var RdsClub;
(function (RdsClub) {
    RdsClub["rdsClubActive"] = "rdsClubActive";
    RdsClub["rdsClubActiveNotFull"] = "rdsClubActiveNotFull";
    RdsClub["rdsClubDengShenBang"] = "rdsClubDengShenBang";
})(RdsClub = exports.RdsClub || (exports.RdsClub = {}));
/**
 * 战斗动作类型
 */
var ActionType;
(function (ActionType) {
    ActionType["round"] = "0";
    ActionType["buff"] = "1";
    ActionType["atk"] = "2";
    ActionType["wxsk"] = "3";
    ActionType["over"] = "999";
})(ActionType = exports.ActionType || (exports.ActionType = {}));
//# sourceMappingURL=Xys.js.map