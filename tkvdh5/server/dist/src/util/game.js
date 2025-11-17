"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BufSetType = void 0;
const request = __importStar(require("request"));
const gameMethod_1 = require("../../common/gameMethod");
const gameCfg_1 = __importDefault(require("../../common/gameCfg"));
const crypto = require("crypto");
var BufSetType;
(function (BufSetType) {
    BufSetType[BufSetType["set"] = 1] = "set";
    BufSetType[BufSetType["push"] = 2] = "push";
    BufSetType[BufSetType["objAdd"] = 3] = "objAdd";
})(BufSetType = exports.BufSetType || (exports.BufSetType = {}));
/**
 * 各种算法
 */
class Game {
    /**
     * 数组合并
     */
    addArr(arr1, arr2) {
        let _arr1 = JSON.parse(JSON.stringify(arr1));
        let _arr2 = JSON.parse(JSON.stringify(arr2));
        for (const arr of _arr2) {
            _arr1.push(arr);
        }
        return _arr1;
    }
    /**
     * 数组倍数
     */
    chengArr(arr1, num) {
        if (num <= 0) {
            return [];
        }
        let arr1Copy = gameMethod_1.gameMethod.objCopy(arr1);
        let arr2 = [];
        for (const arr of arr1Copy) {
            arr[2] *= num;
            arr2.push(arr);
        }
        return arr2;
    }
    /**
     * 随机获取数组元素
     */
    getRandArr(_arr, num) {
        let arr = gameMethod_1.gameMethod.objCopy(_arr);
        let result = [];
        num = Math.min(num, arr.length);
        for (let i = 0; i < num; i++) {
            let ran = Math.floor(Math.random() * (arr.length - i));
            result.push(arr[ran]);
            arr[ran] = arr[arr.length - i - 1];
        }
        return result;
    }
    /**
     * 数组合并
     */
    mergeArr(arrs) {
        let resObj = {};
        for (const arr of arrs) {
            if (resObj[arr[0]] == null) {
                resObj[arr[0]] = {};
            }
            if (resObj[arr[0]][arr[1]] == null) {
                resObj[arr[0]][arr[1]] = 0;
            }
            resObj[arr[0]][arr[1]] += arr[2];
        }
        let resArr = [];
        for (const kind in resObj) {
            for (const id in resObj[kind]) {
                resArr.push([parseInt(kind), parseInt(id), resObj[kind][id]]);
            }
        }
        return resArr;
    }
    /**
     * 打乱数组
     */
    shuffle(_arr) {
        let arr = this.addArr([], _arr);
        let m = arr.length;
        while (m > 1) {
            let index = Math.floor(Math.random() * m--); //交换的索引
            [arr[m], arr[index]] = [arr[index], arr[m]]; //交换数据
        }
        return arr;
    }
    /**
     * 随机数
     * @param min
     * @param max
     */
    rand(min, max) {
        return Math.round((max - min + 1) * Math.random() - 0.5) + min;
    }
    /**
     * 通过道具数组格式 概率获取一件道具
     * ps : 第四位是概率
     */
    getProbByItems(_data, max = 0, xb = 3) {
        if (_data == null || _data.length <= 0) {
            return null;
        }
        let data = gameMethod_1.gameMethod.objCopy(_data);
        if (max == 0) {
            for (const item of data) {
                if (item[xb] == null) {
                    continue;
                }
                max += item[xb];
            }
        }
        let r = this.rand(1, max);
        for (const item of data) {
            if (item[xb] == null) {
                continue;
            }
            if (r <= item[xb]) {
                return item;
            }
            r -= item[xb];
        }
        return null;
    }
    /**
     * 通过道具数组格式 概率获取一件道具
     * ps : 第四位是概率
     */
    getPIdByItems(_data, max = 0, xb = 3) {
        if (_data == null || _data.length <= 0) {
            return null;
        }
        let data = gameMethod_1.gameMethod.objCopy(_data);
        if (max == 0) {
            for (const item of data) {
                if (item[xb] == null) {
                    continue;
                }
                max += item[xb];
            }
        }
        let r = this.rand(1, max);
        for (const i in data) {
            if (data[i][xb] == null) {
                continue;
            }
            if (r <= data[i][xb]) {
                return parseInt(i);
            }
            r -= data[i][xb];
        }
        return null;
    }
    /**
     * 通用随机函数 - 获取key
     * 随机上限,配置数组,概率key
     * @param rmax int 随机上限
     * @param data array 配置数组
     * @param pkey string 概率值KEY
     */
    getProbRandId(rmax, data, pkey) {
        if (data == null) {
            return null;
        }
        if (rmax == 0) {
            for (const key in data) {
                if (pkey == null || pkey == "") {
                    rmax += data[key];
                }
                else {
                    rmax += data[key][pkey];
                }
            }
        }
        let r = this.rand(1, rmax);
        for (const key in data) {
            if (data[key] != null) {
                if (pkey == null || pkey == "") {
                    if (r <= data[key]) {
                        return key;
                    }
                    r -= data[key];
                }
                else {
                    if (r <= data[key][pkey]) {
                        return key;
                    }
                    r -= data[key][pkey];
                }
            }
        }
        return null;
    }
    /**
     * 通用随机函数 - 获取key
     * 随机上限,配置数组,概率key
     * @param rmax int 随机上限
     * @param data array 配置数组
     * @param pkey string 概率值KEY
     *
     *
     */
    getProbRandItem(rmax, data, pkey) {
        if (data == null) {
            return null;
        }
        if (rmax == 0) {
            for (const key in data) {
                if (pkey == null || pkey == "") {
                    rmax += data[key];
                }
                else {
                    rmax += data[key][pkey];
                }
            }
        }
        let r = this.rand(1, rmax);
        for (const key in data) {
            if (data[key] != null) {
                if (pkey == null || pkey == "") {
                    if (r <= data[key]) {
                        return data[key];
                    }
                    r -= data[key];
                }
                else {
                    if (r <= data[key][pkey]) {
                        return data[key];
                    }
                    r -= data[key][pkey];
                }
            }
        }
        return null;
    }
    /**
     * 通用随机函数 - 获取权重
     * @param data array 配置数组
     * @param pkey string 概率值KEY
     */
    getProbMax(data, pkey) {
        if (data == null) {
            return 0;
        }
        let rmax = 0;
        for (const key in data) {
            if (data[key] != null) {
                if (pkey == null || pkey == "") {
                    rmax += Number(data[key]);
                }
                else {
                    rmax += Number(data[key][pkey]);
                }
            }
        }
        return rmax;
    }
    /**
     * 冷却时间算法
     * @param sTime  冷却开始
     * @param count  当前累积次数
     * @param cd  CD秒数
     * @param max 累积上限
     */
    cdTime(sTime, count, cd, max, nowTime = null) {
        if (nowTime == null) {
            nowTime = this.getNowTime();
        }
        if (count >= max) {
            return {
                stime: nowTime,
                next: 0,
                count: count,
            };
        }
        //恢复的时间长度
        let d_time = nowTime - sTime;
        //这段时间可以恢复多少点
        let d_num = Math.floor(d_time / cd);
        //恢复后总点数
        count = count + d_num;
        //上限判定
        let next;
        if (count >= max) {
            //已满
            count = max;
            sTime = nowTime; //到达上限 以当前时间为恢复时间
            next = 0;
        }
        else {
            //未满 恢复中
            //开始恢复时间 += 恢复点数消耗的时间
            sTime += d_num * cd;
            //下一点恢复倒计时
            next = sTime + cd;
        }
        return {
            stime: sTime,
            next: next,
            count: count,
        };
    }
    //判断字符串长度
    str2to32(str) {
        str = str.trim(); //去空
        let strlen = 0; //计算字符长度
        for (let i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 255) {
                strlen += 2;
            }
            else {
                strlen++;
            }
        }
        if (strlen < 1 || strlen > 16) {
            return false;
        }
        return true;
    }
    //字符串 截取 汉字算2个 去空格
    strSlice(str, num) {
        let strlen = 0;
        let newstr = "";
        for (let i = 0; i < str.length; i++) {
            let _str = str[i];
            _str = _str.trim(); //去空白
            if (_str.length <= 0) {
                continue;
            }
            if (str.charCodeAt(i) > 255) {
                strlen += 2;
            }
            else {
                strlen++;
            }
            newstr += str[i];
            if (strlen > num) {
                newstr += "...";
                break;
            }
        }
        return newstr;
    }
    /**
     * 月ID
     */
    getMonthId(time = null) {
        const Dates = new Date();
        if (time != null) {
            Dates.setTime(time * 1000);
        }
        const year = Dates.getFullYear().toString();
        const month = Dates.getMonth() + 1 < 10 ? "0" + (Dates.getMonth() + 1) : (Dates.getMonth() + 1).toString();
        return year + month;
    }
    /**
     * 当月日ID
     */
    getMonthByDayId(time = null) {
        const Dates = new Date();
        if (time != null) {
            Dates.setTime(time * 1000);
        }
        return Dates.getDate().toString();
    }
    /**
     * 当天日期ID  例如 20180806 // 小时偏移问题
     */
    getTodayId(time = null) {
        const Dates = new Date();
        if (time != null) {
            Dates.setTime(time * 1000);
        }
        const year = Dates.getFullYear().toString();
        const month = Dates.getMonth() + 1 < 10 ? "0" + (Dates.getMonth() + 1) : (Dates.getMonth() + 1).toString();
        const day = Dates.getDate() < 10 ? "0" + Dates.getDate() : Dates.getDate().toString();
        return year + month + day;
    }
    /**
     * 获取周几
     */
    getWeek(time = null) {
        let date = new Date();
        if (time != null) {
            date.setTime(time * 1000);
        }
        let id = date.getDay();
        id = ((id + 6) % 7) + 1;
        return id.toString();
    }
    /**
     * 获取周ID  一般用于每周重置
     */
    getWeekId(time = null) {
        //本周1 的 日ID 作为周ID
        if (time == null) {
            return this.getTodayId(this.getWeek0(this.getNowTime()));
        }
        return this.getTodayId(this.getWeek0(time));
    }
    /**
     * 当天日期ID 精确到分钟   例如 20180806 // 小时偏移问题
     */
    getMinuteId() {
        const Dates = new Date();
        const hour = Dates.getHours() < 10 ? "0" + Dates.getHours() : Dates.getHours().toString();
        const minute = Dates.getMinutes() < 10 ? "0" + Dates.getMinutes() : Dates.getMinutes().toString();
        return this.getTodayId() + hour + minute;
    }
    /**
     * 当天日期ID 精确到精确到秒
     */
    getSecondsId() {
        const Dates = new Date();
        const hour = Dates.getHours() < 10 ? "0" + Dates.getHours() : Dates.getHours().toString();
        const minute = Dates.getMinutes() < 10 ? "0" + Dates.getMinutes() : Dates.getMinutes().toString();
        const seconds = Dates.getSeconds() < 10 ? "0" + Dates.getSeconds() : Dates.getSeconds().toString();
        return this.getTodayId() + hour + minute + seconds;
    }
    /**
     * 当天日期ID 精确到小时   例如 20180806 // 小时偏移问题
     */
    getHourId() {
        const Dates = new Date();
        const hour = Dates.getHours() < 10 ? "0" + Dates.getHours() : Dates.getHours().toString();
        return this.getTodayId() + hour;
    }
    /**
    * 获取当前的小时数
    */
    getHour() {
        const Dates = new Date();
        const hour = Dates.getHours() < 10 ? 0 + Dates.getHours() : Dates.getHours();
        return hour;
    }
    /**
     * 昨天日期ID  例如 20180806 // 小时偏移问题
     */
    getYesterdayId() {
        const Dates = new Date(new Date().getTime() - 1000 * 60 * 60 * 24);
        const year = Dates.getFullYear().toString();
        const month = Dates.getMonth() + 1 < 10 ? "0" + (Dates.getMonth() + 1) : (Dates.getMonth() + 1).toString();
        const day = Dates.getDate() < 10 ? "0" + Dates.getDate() : Dates.getDate().toString();
        return year + month + day;
    }
    /**
     * 获取今天秒数
     */
    getTodaySec() {
        const Dates = new Date();
        let h = Dates.getHours();
        let m = Dates.getMinutes();
        let s = Dates.getSeconds();
        return h * 3600 + m * 60 + s;
    }
    /**
     * 日期转换为时间戳
     * @param str
     * @returns
     */
    getTimeByStr(da) {
        return Math.floor(new Date(da).getTime() / 1000);
    }
    //指定时间戳 是否今天
    isToday(time) {
        let Dates = new Date().setHours(0, 0, 0, 0); //获取今天0点0分0秒0毫秒。
        let checkTime = this.getToDay_0(time) * 1000;
        if (Dates == checkTime) {
            return true;
        }
        return false;
    }
    //获取当前时间 格式 2014-10-16 11:03:46
    getTime() {
        var today = new Date();
        var year = today.getFullYear(); //年
        var month = today.getMonth() + 1; //月
        var day = today.getDate(); //日
        var hh = today.getHours(); //时
        var mm = today.getMinutes(); //分
        var ss = today.getSeconds(); //秒
        var clock = year + "-";
        if (month < 10)
            clock += "0";
        clock += month + "-";
        if (day < 10)
            clock += "0";
        clock += day + " ";
        if (hh < 10)
            clock += "0";
        clock += hh + ":";
        if (mm < 10)
            clock += "0";
        clock += mm + ":";
        if (ss < 10)
            clock += "0";
        clock += ss;
        return clock;
    }
    //获取当前时间 格式 2014-10-16
    getDayTime(time = null) {
        let today = new Date();
        if (time != null) {
            today = new Date(time * 1000);
        }
        let year = today.getFullYear(); //年
        let month = today.getMonth() + 1; //月
        let day = today.getDate(); //日
        let clock = year + "-";
        if (month < 10)
            clock += "0";
        clock += month + "-";
        if (day < 10)
            clock += "0";
        clock += day;
        clock += "T";
        let hour = today.getHours();
        if (hour < 10)
            clock += "0";
        clock += hour + ":";
        let minute = today.getMinutes();
        if (minute < 10)
            clock += "0";
        clock += minute;
        // let second  = today.getSeconds()
        // if (second < 10) clock += "0";
        // clock += minute;
        return clock;
    }
    //获取当前时间 格式 2014-10-16 00:00:00
    getTimeS(time = null) {
        let today = new Date();
        if (time != null) {
            today = new Date(time * 1000);
        }
        let year = today.getFullYear(); //年
        let month = today.getMonth() + 1; //月
        let day = today.getDate(); //日
        let clock = year + "-";
        if (month < 10)
            clock += "0";
        clock += month + "-";
        if (day < 10)
            clock += "0";
        clock += day;
        clock += " ";
        let hour = today.getHours();
        if (hour < 10)
            clock += "0";
        clock += hour + ":";
        let minute = today.getMinutes();
        if (minute < 10)
            clock += "0";
        clock += minute + ":";
        let second = today.getSeconds();
        if (second < 10)
            clock += "0";
        clock += second;
        return clock;
    }
    /**
     * 输出单位 秒 (今日0点时间戳)
     * str 指定时间戳
     */
    getToDay_0(time = null) {
        let checkTime = 0;
        if (time == null) {
            checkTime = new Date().setHours(0, 0, 0, 0); //获取当天0点0分0秒0毫秒
        }
        else {
            checkTime = new Date(time * 1000).setHours(0, 0, 0, 0); //获取当天0点0分0秒0毫秒
        }
        return Math.floor(checkTime / 1000);
    }
    /**
     * 当前小时
     */
    getToDay_hour() {
        let today = new Date();
        return today.getHours();
    }
    /**
     * 输出单位 秒 (今日0点时间戳)
     * str 指定时间戳
     */
    getToDay_Hours(time, hours) {
        let checkTime = new Date(time * 1000).setHours(hours, 0, 0, 0); //获取当天0点0分0秒0毫秒
        return Math.floor(checkTime / 1000);
    }
    /**
    获取本周0点
     */
    getWeek_0() {
        let Date_0 = new Date().setHours(0, 0, 0, 0); //获取今天0点0分0秒0毫秒。
        let Dates = new Date();
        let days = new Date().getDay() == 0 ? 7 : Dates.getDay(); //今天是这周的第几天
        return Math.floor(Date_0 / 1000 - (days - 1) * 86400);
    }
    /**
     * 获取本月0点
     */
    getMonth_0(str = null) {
        let Date_0 = new Date().setHours(0, 0, 0, 0); //获取今天0点0分0秒0毫秒。
        let days = new Date().getDate();
        return Math.floor(Date_0 / 1000 - (days - 1) * 86400);
    }
    /*
     * 获取下个月的第一天0点
     */
    nextMonthFirstDay() {
        var time = new Date();
        var year = time.getFullYear();
        var month = time.getMonth() + 2;
        if (month > 12) {
            month = month - 12;
            year = year + 1;
        }
        var day = 1;
        var date = new Date(`${year}-${month}-${day}`);
        var time1 = Math.floor(date.getTime() / 1000);
        return time1;
    }
    /**
     * 一个时间点 距离今天相差几天    以1开始算  今天算1天   今天之后的算0天
     * @param str
     */
    passDay(time) {
        let Dates = new Date().setHours(0, 0, 0, 0); //获取今天0点0分0秒0毫秒。
        let checkTime = new Date(time * 1000).setHours(0, 0, 0, 0); //获取当天0点0分0秒0毫秒。
        if (Dates < checkTime) {
            return 0;
        }
        return Math.abs(Math.floor((Dates - checkTime) / 86400000)) + 1;
    }
    /**
     * 两个时间相隔多少天 ， 同一天为 1
     * @param t1
     * @param t2
     */
    passDayByTimes(t1, t2) {
        let day1 = new Date(t1 * 1000).setHours(0, 0, 0, 0); //获取当天0点0分0秒0毫秒。
        let day2 = new Date(t2 * 1000).setHours(0, 0, 0, 0); //获取当天0点0分0秒0毫秒。
        return Math.abs(day1 - day2) / 86400 / 1000 + 1;
    }
    /**
     * 获取指定时间 的周一0点时间戳 (time 秒)
     * @param time
     * @returns
     */
    getWeek0(time) {
        const date = new Date(time * 1000);
        //time是周几
        let dayOfWeek = date.getDay();
        if (dayOfWeek == 0) {
            //周天getDay()是0  1234560
            dayOfWeek = 7;
        }
        // time周一的时间戳
        let week0ime = time - (dayOfWeek - 1) * 24 * 60 * 60;
        // time周一的0点时间戳(秒)
        let mondayTimeStamp = new Date(week0ime * 1000).setHours(0, 0, 0, 0) / 1000;
        return Math.floor(mondayTimeStamp);
    }
    /**
     * 获取本周一 0 点的时间戳
     */
    week_0(time = null) {
        let Date_1 = new Date();
        if (time != null) {
            Date_1.setTime(time * 1000);
        }
        let Date_0 = Date_1.setHours(0, 0, 0, 0); //获取今天0点0分0秒0毫秒
        let Dates = new Date();
        if (time != null) {
            Dates.setTime(time * 1000);
        }
        let days = Dates.getDay() == 0 ? 7 : Dates.getDay(); //今天是这周的第几天
        return Math.floor(Date_0 / 1000 - (days - 1) * 86400);
    }
    /**
     * 获取本周几 1 - 7
     */
    weekId(time = null) {
        let Dates = new Date();
        if (time != null) {
            Dates.setTime(time * 1000);
        }
        let days = Dates.getDay() == 0 ? 7 : Dates.getDay(); //今天是这周的第几天
        return days;
    }
    /**
     * 获取当前时间戳
     */
    getNowTime() {
        return Math.floor(Date.now() / 1000);
    }
    /**
     * 获取当前时间戳
     */
    getNowTimeMS() {
        return Date.now();
    }
    /**
     * 加密
     */
    jiami(obj) {
        let keyBuf = this._base64_decode("65gkjU43HuMbTNhgp8pEMNhTTpLCfBgh"); //秘钥 必须24位
        let ivBuf = this._base64_decode("z0pA3Hxm7SQ"); // 偏移量 必须8位
        const cipher = crypto.createCipheriv("des-ede3-cbc", keyBuf, ivBuf);
        let encrypted = cipher.update(JSON.stringify(obj), "utf8", "base64");
        encrypted += cipher.final("base64");
        return encrypted;
    }
    /**
     * 解密
     */
    jiemi(encrypted) {
        let keyBuf = this._base64_decode("65gkjU43HuMbTNhgp8pEMNhTTpLCfBgh"); //秘钥 必须24位
        let ivBuf = this._base64_decode("z0pA3Hxm7SQ"); // 偏移量 必须8位
        const decipher = crypto.createDecipheriv("des-ede3-cbc", keyBuf, ivBuf);
        let decrypted = decipher.update(encrypted, "base64", "utf8");
        decrypted += decipher.final("utf8");
        let json = JSON.parse(decrypted);
        return json;
    }
    //base 64 解码 输出buff 而不是字符串
    _base64_decode(code) {
        var b = Buffer.from(code, "base64");
        return b;
    }
    /**
     * 获取现在是哪个月份
     */
    getNowMonth(time = null) {
        const Dates = new Date();
        if (time != null) {
            Dates.setTime(time * 1000);
        }
        let month = Dates.getMonth() + 1;
        return month;
    }
    /**
     * 延迟多少毫秒
     */
    async sleep(ms) {
        if (ms < 1) {
            return;
        }
        return new Promise((reslove, reject) => {
            setTimeout(() => {
                reslove(1);
            }, ms);
        });
    }
    async get(url) {
        return new Promise((reslove, reject) => {
            request.get(url, (error, response, body) => {
                if (!error) {
                    reslove(body);
                }
                else {
                    reject(error);
                }
            });
        });
    }
    //7日活跃算法
    active7D_init() {
        return {
            all: 0,
            days: {},
        };
    }
    //更新7日活跃 (去除过期的)
    active7D_rst(old, now) {
        //重新计算7日活跃
        let active = this.active7D_init();
        // 从今天开始 往上推算7天
        for (let i = 0; i < 7; i++) {
            let dayId = game.getTodayId(now - 86400 * i);
            if (old.days[dayId] != null) {
                active.days[dayId] = old.days[dayId];
                active.all += active.days[dayId];
            }
        }
        return active;
    }
    active7D_add(active, score, now) {
        let dayId = game.getTodayId(now);
        if (active.days[dayId] == null) {
            active.days[dayId] = 0;
        }
        active.days[dayId] += score;
        active.all += score;
        return active;
    }
    //sev adok 信息 初始化
    sevAdok_club_init() {
        return {
            base: 0,
            member: 0,
            apply: 0,
            help: 0,
            chat: 0,
            clubFx: 0,
        };
    }
    sevAdok_he_init() {
        return {
            chat: 0,
            zouma: 0,
        };
    }
    /**
     * @returns
     * (time: number | null = null): number {
        const Dates = new Date();
        if (time != null) {
            Dates.setTime(time * 1000);
        }
     */
    //获取最强斗罗周ID
    getDouLuoWeek(time = null) {
        //这边 输出正常 week ID
        //看排行的 排行那边去输出做周偏移
        return this.getWeekId(time);
        //按照自然周 1~4 休息 567 打
        //周4晚上
        //获取本周 0 点
        // let now = time ? time : this.getNowTime();
        // let weeksec = now - this.week_0(time); //本周秒数
        // //周4晚上10点之前
        // let q_sec = 3600 * (24 * 4 + 20); //切换时间点
        // //时间还没到 算上周的
        // if (weeksec < q_sec) {
        //     return this.getWeekId(now - 3600 * 7);
        // } else {
        //     //时间到了 算本周的
        //     return this.getWeekId(time);
        // }
    }
    //获取天宫乐舞斗罗周ID
    getTianGongWeek(time = null) {
        //这边 输出正常 week ID
        //看排行的 排行那边去输出做周偏移
        return this.getWeekId(time);
        //按照自然周 1~4 休息 567 打
        //周4晚上
        //获取本周 0 点
        // let now = time ? time : this.getNowTime();
        // let weeksec = now - this.week_0(time); //本周秒数
        // //周4晚上10点之前
        // let q_sec = 3600 * (24 * 4 + 20); //切换时间点
        // //时间还没到 算上周的
        // if (weeksec < q_sec) {
        //     return this.getWeekId(now - 3600 * 7);
        // } else {
        //     //时间到了 算本周的
        //     return this.getWeekId(time);
        // }
    }
    //是否处于斗罗战斗时间内
    inDouLuoTime() {
        //按照自然周 1~4 休息 567 打
        // let now = this.getNowTime();
        // let weeksec = now - this.week_0(); //本周秒数
        // if (weeksec < 86400 * 4){
        //     return false
        // }
        return true; //测试期间 全开
    }
    //获取最强斗罗 下次发日奖时间
    douLuoDayAt(time = null) {
        let now = this.getNowTime();
        if (time != null) {
            now = time;
        }
        let weeksec = now - this.week_0(time); //本周秒数
        if (weeksec < 86400 * 5) {
            //周5之前 输出周5晚上
            return 86400 * 5;
        }
        else {
            //周67 输出本日晚上
            return game.getToDay_0() + 86400;
        }
    }
    //获取最强斗罗 下次发周奖时间
    douLuoWeekAt(time = null) {
        //本周末
        return this.week_0(time) + 86400 * 7;
    }
    initEquip(hh) {
        return {
            equipId: "",
            level: 0,
            eps: {},
            hhList: {},
            mrhh: hh,
            hh: "",
            newHh: "",
            fmLv: 0,
            fmBd: 0,
            fmEps: [],
            fmZhBd: [],
            fmZhls: [],
        };
    }
    getDouLuoNpc(npcId) {
        // 机器人
        let cfg = gameCfg_1.default.douLuoNpc.getItem(npcId);
        if (cfg == null) {
            return null;
        }
        let actFazhen = { list: {}, useGzId: "" };
        if (cfg.shouling.length > 0) {
            actFazhen = {
                list: { "1": { fzid: cfg.shouling[0], saveId: cfg.shouling[1], otherEps: {}, zaddp: 0, faddp: 0 } },
                useGzId: "1",
            };
        }
        // cfg.
        // cfg.shenguang
        let chuan = {};
        chuan["1"] = this.initEquip(cfg.pos1);
        chuan["2"] = this.initEquip(cfg.pos2);
        chuan["3"] = this.initEquip(cfg.pos3);
        chuan["4"] = this.initEquip(cfg.pos4);
        return {
            actChiBang: {
                hh: cfg.jianling[0].toString(),
                hhList: [cfg.jianling[0].toString()],
                id: cfg.jianling[1],
                exp: 0,
                cleps: {},
            },
            actFazhen: actFazhen,
            actEquip: {
                a: {
                    chuan: chuan,
                    box: 275,
                    linshi: {
                        equipId: "",
                        mrhh: "",
                        hh: "",
                        level: 0,
                        eps: {},
                        isNew: 0,
                    },
                    linshi95: {},
                    linshiOld: {
                        equipId: "",
                        mrhh: "",
                        hh: "",
                        level: 1,
                        eps: {},
                        isNew: 1,
                    },
                    jjc: 0,
                    count: 0,
                },
            },
        };
    }
    getDengShenBangNpc(npcId) {
        // 机器人
        let cfg = gameCfg_1.default.dengshenbangNpc.getItem(npcId);
        if (cfg == null) {
            return null;
        }
        let actFazhen = { list: {}, useGzId: "" };
        if (cfg.shouling.length > 0) {
            actFazhen = {
                list: { "1": { fzid: cfg.shouling[0], saveId: cfg.shouling[1], otherEps: {}, zaddp: 0, faddp: 0 } },
                useGzId: "1",
            };
        }
        // cfg.
        // cfg.shenguang
        let chuan = {};
        chuan["1"] = this.initEquip(cfg.pos1);
        chuan["2"] = this.initEquip(cfg.pos2);
        chuan["3"] = this.initEquip(cfg.pos3);
        chuan["4"] = this.initEquip(cfg.pos4);
        return {
            actChiBang: {
                hh: cfg.jianling[0].toString(),
                hhList: [cfg.jianling[0].toString()],
                id: cfg.jianling[1],
                exp: 0,
                cleps: {},
            },
            actFazhen: actFazhen,
            actEquip: {
                a: {
                    chuan: chuan,
                    box: 275,
                    linshi: {
                        equipId: "",
                        mrhh: "",
                        hh: "",
                        level: 0,
                        eps: {},
                        isNew: 0,
                    },
                    linshi95: {},
                    linshiOld: {
                        equipId: "",
                        mrhh: "",
                        hh: "",
                        level: 1,
                        eps: {},
                        isNew: 1,
                    },
                    jjc: 0,
                    count: 0,
                },
            },
        };
    }
}
//输出
let game = new Game();
exports.default = game;
//# sourceMappingURL=game.js.map