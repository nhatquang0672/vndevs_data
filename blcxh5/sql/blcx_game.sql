/*
 Navicat Premium Data Transfer

 Source Server         : blcxh5_local
 Source Server Type    : MySQL
 Source Server Version : 80044 (8.0.44)
 Source Host           : localhost:3306
 Source Schema         : blcx_game

 Target Server Type    : MySQL
 Target Server Version : 80044 (8.0.44)
 File Encoding         : 65001

 Date: 11/12/2025 16:40:38
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for buysta
-- ----------------------------
DROP TABLE IF EXISTS `buysta`;
CREATE TABLE `buysta` (
  `roleId` bigint NOT NULL COMMENT '角色id',
  `buyState` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '购买状态(Class:Map<Integer,Integer>)',
  `time` datetime NOT NULL COMMENT '重置时间',
  PRIMARY KEY (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for card
-- ----------------------------
DROP TABLE IF EXISTS `card`;
CREATE TABLE `card` (
  `roleId` bigint NOT NULL COMMENT '角色时间',
  `resId` int NOT NULL COMMENT '普通或高级月卡',
  `activationState` int NOT NULL COMMENT '激活状态',
  `rewardState` int NOT NULL COMMENT '领取状态',
  `time` datetime NOT NULL COMMENT '到期时间',
  `rewardTime` datetime DEFAULT NULL COMMENT '领奖时间',
  PRIMARY KEY (`roleId`,`resId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for chapter
-- ----------------------------
DROP TABLE IF EXISTS `chapter`;
CREATE TABLE `chapter` (
  `roleId` bigint unsigned NOT NULL COMMENT '角色id',
  `resId` bigint unsigned NOT NULL COMMENT '章节id',
  `finishState` tinyint unsigned NOT NULL COMMENT '通关状态',
  `liveTime` bigint unsigned NOT NULL COMMENT '生存时间',
  `rewardState` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '领取状态(Class:Map<Long, Integer>)',
  `giftState` tinyint unsigned NOT NULL COMMENT '章节礼包购买状态',
  `hasBattle` tinyint(1) DEFAULT NULL COMMENT '是否打过(Class:Boolean)',
  PRIMARY KEY (`resId`,`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for clientopenani
-- ----------------------------
DROP TABLE IF EXISTS `clientopenani`;
CREATE TABLE `clientopenani` (
  `roleId` bigint unsigned NOT NULL COMMENT '角色id',
  `alreadyPlay` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '客户端已经播放动画的功能记录(Class:Set<Integer>)',
  PRIMARY KEY (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT=' 客户端功能开发动画记录';

-- ----------------------------
-- Table structure for code
-- ----------------------------
DROP TABLE IF EXISTS `code`;
CREATE TABLE `code` (
  `id` bigint NOT NULL COMMENT 'id',
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `code` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '礼包码',
  `useTime` datetime NOT NULL COMMENT '使用时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for equip
-- ----------------------------
DROP TABLE IF EXISTS `equip`;
CREATE TABLE `equip` (
  `id` bigint unsigned NOT NULL,
  `roleId` bigint unsigned NOT NULL COMMENT '角色id',
  `resId` bigint unsigned NOT NULL COMMENT '资源id',
  `quality` int unsigned NOT NULL COMMENT '品质',
  `phase` int unsigned NOT NULL COMMENT '阶段',
  `level` int unsigned NOT NULL COMMENT '等级',
  `isNew` tinyint DEFAULT '1' COMMENT '是否新(Class:Boolean)',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `roleId` (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for everydaysign
-- ----------------------------
DROP TABLE IF EXISTS `everydaysign`;
CREATE TABLE `everydaysign` (
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `signDays` int NOT NULL COMMENT '签到天数',
  `rewardState` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '领取状态(Class:Map<Integer,Integer>)',
  `signTime` datetime DEFAULT NULL COMMENT '上次签到时间',
  `rewardDay` int DEFAULT NULL COMMENT '上次领取宝箱天数',
  PRIMARY KEY (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for friend
-- ----------------------------
DROP TABLE IF EXISTS `friend`;
CREATE TABLE `friend` (
  `roleId` bigint NOT NULL COMMENT '玩家id',
  `friendId` bigint NOT NULL COMMENT '好友玩家id',
  `roleName` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '好友名称',
  `roleImg` bigint DEFAULT NULL COMMENT '好友头像',
  `headFrame` bigint DEFAULT NULL COMMENT '好友头像框',
  `power` bigint DEFAULT NULL COMMENT '好友战力（修炼值）',
  `popularity` bigint DEFAULT NULL COMMENT '好友人气',
  `virtue` bigint DEFAULT NULL COMMENT '好友功德',
  `online` tinyint DEFAULT NULL COMMENT '好友在线状态(Class:boolean)',
  `lastLoginTime` bigint DEFAULT NULL COMMENT '好友最后一次上线时间，用于计算离线时长',
  `lastOfflineTime` bigint DEFAULT NULL COMMENT '好友最后一次下线时间，用于计算离线时长',
  `lastEndSendTime` bigint DEFAULT NULL COMMENT '上一次玩家送体力给该好友的时间，用于判断今日是否已赠送体力给该好友',
  `lastEndReceiveTime` bigint DEFAULT NULL COMMENT '上一次该好友送体力给玩家的时间，用于判断今日是否可领取该好友赠送的体力',
  `lastTakeEndTime` bigint DEFAULT NULL COMMENT '上一次玩家领取该玩家赠送体力的时间，用于判断今日是否已领取该好友赠送的体力',
  `lastLikeTime` bigint DEFAULT NULL COMMENT '上一次玩家点赞该好友时间，用于判断今日是否点赞好友',
  PRIMARY KEY (`roleId`,`friendId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='好友表(Package:friends)';

-- ----------------------------
-- Table structure for friendlist
-- ----------------------------
DROP TABLE IF EXISTS `friendlist`;
CREATE TABLE `friendlist` (
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `roleFriend` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT '玩家好友列表(Class:ConcurrentHashSet<Long>)',
  `blackFriend` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT '玩家好友黑名单列表(Class:ConcurrentHashSet<Long>)',
  `receiveApplyFriend` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT '玩家收到的好友申请列表(Class:ConcurrentHashSet<Long>)',
  `sendApplyFriend` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT '玩家发送的好友申请列表(Class:ConcurrentHashSet<Long>)',
  `todaySendEndNum` int DEFAULT NULL COMMENT '今日已赠送体力数量',
  `lastUpdateSendTime` bigint DEFAULT NULL COMMENT '最后一次更新赠送体力赠送情况的时间，当前时间与该时间跨天时需要重置todaySendEndNum并更新该时间',
  `todayTakeEndNum` int DEFAULT NULL COMMENT '今日已领取体力数量',
  `lastUpdateTakeTime` bigint DEFAULT NULL COMMENT '最后一次更新领取体力领取情况的时间，当前时间与该时间跨天时需要重置todayTakeEndNum并更新该时间',
  PRIMARY KEY (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='玩家好友信息表';

-- ----------------------------
-- Table structure for fuben
-- ----------------------------
DROP TABLE IF EXISTS `fuben`;
CREATE TABLE `fuben` (
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `resId` bigint NOT NULL COMMENT '副本Id',
  `info` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '副本信息(Class:com.xkhy.blcx.service.fuben.res.FuBenRes)',
  `time` datetime DEFAULT NULL COMMENT '生成时间',
  PRIMARY KEY (`roleId`,`resId`) USING BTREE,
  KEY `roleId` (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for fund
-- ----------------------------
DROP TABLE IF EXISTS `fund`;
CREATE TABLE `fund` (
  `roleId` bigint NOT NULL COMMENT '角色id',
  `id` bigint NOT NULL COMMENT '基金id',
  `buyState` int NOT NULL COMMENT '激活状态',
  `rewardState` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '奖励状态(Class:Map<Long,Integer>)',
  PRIMARY KEY (`roleId`,`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for gift
-- ----------------------------
DROP TABLE IF EXISTS `gift`;
CREATE TABLE `gift` (
  `roleId` bigint unsigned NOT NULL COMMENT '角色Id',
  `dayGift` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '每日礼包(Class:com.xkhy.blcx.handler.dayWeekMonthGift.DayWeekMonthGiftData)',
  `weekGift` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '每周礼包(Class:com.xkhy.blcx.handler.dayWeekMonthGift.DayWeekMonthGiftData)',
  `monthGift` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '每月礼包(Class:com.xkhy.blcx.handler.dayWeekMonthGift.DayWeekMonthGiftData)',
  `rechargeCount` int DEFAULT NULL COMMENT '累积充值天数',
  `rechargeState` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '累充状态(Class:Map<Integer,Integer>)',
  `rechargeTime` datetime DEFAULT NULL COMMENT '上次累充时间',
  PRIMARY KEY (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for guide
-- ----------------------------
DROP TABLE IF EXISTS `guide`;
CREATE TABLE `guide` (
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `guideKey` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '引导key',
  PRIMARY KEY (`roleId`,`guideKey`) USING BTREE,
  KEY `roleId` (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for hero
-- ----------------------------
DROP TABLE IF EXISTS `hero`;
CREATE TABLE `hero` (
  `roleId` bigint unsigned NOT NULL COMMENT '角色Id',
  `resId` bigint unsigned NOT NULL COMMENT '英雄Id',
  `level` bigint unsigned NOT NULL COMMENT '英雄等级',
  `equip` bigint DEFAULT NULL COMMENT '武器id',
  PRIMARY KEY (`roleId`,`resId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for herounlock
-- ----------------------------
DROP TABLE IF EXISTS `herounlock`;
CREATE TABLE `herounlock` (
  `roleId` bigint unsigned NOT NULL COMMENT '角色Id',
  `resId` bigint unsigned NOT NULL COMMENT '任务Id',
  `count` int unsigned NOT NULL COMMENT '进度',
  `rewardState` tinyint NOT NULL COMMENT '奖励状态',
  PRIMARY KEY (`roleId`,`resId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for item
-- ----------------------------
DROP TABLE IF EXISTS `item`;
CREATE TABLE `item` (
  `roleId` bigint unsigned NOT NULL COMMENT '角色Id',
  `resId` bigint unsigned NOT NULL COMMENT '物品Id',
  `number` int NOT NULL COMMENT '数量(Set:init)',
  PRIMARY KEY (`resId`,`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for luckycat
-- ----------------------------
DROP TABLE IF EXISTS `luckycat`;
CREATE TABLE `luckycat` (
  `roleId` bigint unsigned NOT NULL COMMENT '角色id',
  `resId` bigint NOT NULL COMMENT '档位id',
  `processIndex` int NOT NULL COMMENT '进度索引',
  `endTime` datetime NOT NULL COMMENT '结束时间',
  `first` tinyint NOT NULL DEFAULT '1' COMMENT '是否首次(Class:Boolean)',
  `buy` tinyint DEFAULT '0' COMMENT '是否已购买(Class:Boolean)',
  PRIMARY KEY (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT=' 招财猫';

-- ----------------------------
-- Table structure for mail
-- ----------------------------
DROP TABLE IF EXISTS `mail`;
CREATE TABLE `mail` (
  `id` bigint unsigned NOT NULL COMMENT '邮件Id',
  `roleId` bigint unsigned NOT NULL COMMENT '角色Id',
  `title` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_cs_0900_ai_ci NOT NULL COMMENT '邮件标题',
  `content` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_cs_0900_ai_ci NOT NULL COMMENT '邮件内容',
  `goodsList` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_cs_0900_ai_ci DEFAULT NULL COMMENT '奖励(Class:List<com.xkhy.blcx.domain.res.ResItem>)',
  `readState` tinyint(1) NOT NULL COMMENT '是否已读',
  `drawState` tinyint(1) NOT NULL COMMENT '是否领取奖励',
  `time` datetime NOT NULL COMMENT '发送时间',
  `readTime` datetime DEFAULT NULL COMMENT '阅读时间',
  `source` tinyint NOT NULL COMMENT '邮件来源',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `roleId` (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_cs_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for mailmodel
-- ----------------------------
DROP TABLE IF EXISTS `mailmodel`;
CREATE TABLE `mailmodel` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '邮件Id',
  `title` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_cs_0900_ai_ci NOT NULL COMMENT '邮件标题',
  `content` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_cs_0900_ai_ci NOT NULL COMMENT '邮件内容',
  `goodsList` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_cs_0900_ai_ci DEFAULT NULL COMMENT '奖励(Class:List<com.xkhy.blcx.domain.res.ResItem>)',
  `time` datetime NOT NULL COMMENT '发送时间',
  `source` tinyint NOT NULL COMMENT '邮件来源',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_cs_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for mailrole
-- ----------------------------
DROP TABLE IF EXISTS `mailrole`;
CREATE TABLE `mailrole` (
  `roleId` bigint unsigned NOT NULL,
  `mailId` bigint unsigned NOT NULL,
  PRIMARY KEY (`roleId`,`mailId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for recharge
-- ----------------------------
DROP TABLE IF EXISTS `recharge`;
CREATE TABLE `recharge` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `orderCode` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '自己方订单号',
  `channelId` int NOT NULL COMMENT '渠道号',
  `payChannelId` int NOT NULL COMMENT 'payChannel表Id',
  `fromType` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '来源类型(如:activity)',
  `fromId` int DEFAULT NULL COMMENT '来源类型Id',
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `amount` double NOT NULL COMMENT '充值数量',
  `time` datetime DEFAULT NULL COMMENT '支付回调时间',
  `rewards` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '奖励(Class:List<com.xkhy.blcx.domain.res.ResItem>)',
  `status` tinyint(1) DEFAULT NULL COMMENT '状态(0未领取,1已领取)',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `roleId` (`roleId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2609 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='充值表';

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id` bigint unsigned NOT NULL COMMENT '角色Id',
  `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '角色名称',
  `img` bigint NOT NULL COMMENT '头像',
  `headFrame` bigint NOT NULL COMMENT '头像框',
  `lv` int NOT NULL DEFAULT '0' COMMENT '等级',
  `exp` int NOT NULL DEFAULT '0' COMMENT '经验',
  `energy` decimal(65,0) NOT NULL DEFAULT '0' COMMENT '能量精华(Set:init)',
  `coin` decimal(65,0) NOT NULL DEFAULT '0' COMMENT '金币(Set:init)',
  `gem` decimal(65,0) NOT NULL DEFAULT '0' COMMENT '宝石(Set:init)',
  `end` int NOT NULL DEFAULT '0' COMMENT '体力(Set:init)',
  `equipList` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '装备(Class:Set<Long>)',
  `runeMap` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '符文(Class:Map<Long,Integer>)',
  `heroId` bigint unsigned NOT NULL COMMENT '英雄id',
  `createTime` datetime NOT NULL COMMENT '创角时间',
  `dailyActive` int unsigned NOT NULL DEFAULT '0' COMMENT '日常活跃',
  `dailyActiveTake` int DEFAULT '0' COMMENT '日常活跃领取进度',
  `dailyActiveUpdateTime` datetime DEFAULT NULL COMMENT '日常活跃最后更新时间',
  `weeklyActive` int unsigned NOT NULL DEFAULT '0' COMMENT '周常活跃',
  `weeklyActiveTake` int DEFAULT '0' COMMENT '周常活跃领取进度',
  `weeklyActiveUpdateTime` datetime DEFAULT NULL COMMENT '周常活跃最后更新时间',
  `endRecoverTime` datetime NOT NULL COMMENT '最后恢复时间',
  `hangTime` datetime NOT NULL COMMENT '开始挂机时间',
  `quickHangTimes` int NOT NULL COMMENT '快速巡逻次数',
  `passiveSkills` bigint unsigned NOT NULL COMMENT '被动技能突破等级',
  `specialSkills` bigint unsigned NOT NULL COMMENT '特殊技能突破等级',
  `battleState` int NOT NULL COMMENT '战斗状态',
  `battleData` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT '战斗数据(Class:com.xkhy.blcx.service.battle.res.BattleBeatRes)',
  `lastLoginTime` datetime DEFAULT NULL COMMENT '上次登录时间',
  `firstRecharge` int DEFAULT NULL COMMENT '首充状态',
  `onlineTime` bigint DEFAULT NULL COMMENT '在线时长',
  `power` bigint DEFAULT NULL COMMENT '玩家战力，既修炼值',
  `popularity` bigint DEFAULT NULL COMMENT '玩家人气',
  `virtue` bigint DEFAULT NULL COMMENT '玩家功德',
  `lastOfflineTime` datetime DEFAULT NULL COMMENT '最后一次下线时间',
  `bossSavePoint` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT '上一次boss保存点(Class:com.xkhy.blcx.service.battle.res.BattleBeatRes)',
  `renameNum` int DEFAULT NULL,
  `alreadyShare` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='角色';

-- ----------------------------
-- Table structure for roleactivity
-- ----------------------------
DROP TABLE IF EXISTS `roleactivity`;
CREATE TABLE `roleactivity` (
  `roleId` bigint unsigned NOT NULL COMMENT '角色Id',
  `resId` bigint unsigned NOT NULL COMMENT '活动唯一Id',
  `activityType` int NOT NULL COMMENT '活动类型',
  `content` varchar(4096) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '活动数据',
  `time` datetime DEFAULT NULL,
  PRIMARY KEY (`roleId`,`resId`) USING BTREE,
  KEY `roleId` (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for roleattribute
-- ----------------------------
DROP TABLE IF EXISTS `roleattribute`;
CREATE TABLE `roleattribute` (
  `roleId` bigint unsigned NOT NULL COMMENT '角色Id',
  `attribute` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '通用属性,以后注意设置字段大小(Class:Map<Integer,Integer>)',
  PRIMARY KEY (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='角色属性，一般属性放在attribute字段里的map中，一般都是Int值，其他特殊属性新建字段，要统计排行榜的字段新建字段';

-- ----------------------------
-- Table structure for roleitemstate
-- ----------------------------
DROP TABLE IF EXISTS `roleitemstate`;
CREATE TABLE `roleitemstate` (
  `roleId` bigint unsigned NOT NULL COMMENT '角色id',
  `readItem` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '玩家已点击过的物品id列表(Class:Set<Long>)',
  PRIMARY KEY (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='玩家物品状态';

-- ----------------------------
-- Table structure for rolemall
-- ----------------------------
DROP TABLE IF EXISTS `rolemall`;
CREATE TABLE `rolemall` (
  `roleId` bigint NOT NULL COMMENT '角色id',
  `resId` bigint NOT NULL COMMENT '组件id',
  `content` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '组件数据(Class:Set<String>)',
  `time` datetime NOT NULL COMMENT '生成时间',
  PRIMARY KEY (`roleId`,`resId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for rolesign
-- ----------------------------
DROP TABLE IF EXISTS `rolesign`;
CREATE TABLE `rolesign` (
  `id` bigint unsigned NOT NULL COMMENT '角色Id',
  `isChangeName` tinyint(1) NOT NULL COMMENT '是否改名',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for rune
-- ----------------------------
DROP TABLE IF EXISTS `rune`;
CREATE TABLE `rune` (
  `id` bigint unsigned NOT NULL,
  `roleId` bigint unsigned NOT NULL COMMENT '角色id',
  `resId` bigint unsigned NOT NULL COMMENT '资源id',
  `quality` int unsigned NOT NULL COMMENT '品质',
  `phase` int unsigned NOT NULL COMMENT '阶段',
  `isNew` tinyint DEFAULT '1' COMMENT '是否新(Class:Boolean)',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for share
-- ----------------------------
DROP TABLE IF EXISTS `share`;
CREATE TABLE `share` (
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `shareState` int DEFAULT NULL COMMENT '分享状态',
  `rewardState` int DEFAULT NULL COMMENT '领奖状态',
  PRIMARY KEY (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for specialgift
-- ----------------------------
DROP TABLE IF EXISTS `specialgift`;
CREATE TABLE `specialgift` (
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `resId` bigint NOT NULL COMMENT '礼包Id',
  `state` int NOT NULL COMMENT '购买状态',
  `endTime` datetime DEFAULT NULL COMMENT '结束时间',
  `failTimes` int DEFAULT NULL COMMENT '失败次数',
  `alreadyShow` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '已经弹窗过的礼包(Class:Set<Long>)',
  PRIMARY KEY (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for systemdata
-- ----------------------------
DROP TABLE IF EXISTS `systemdata`;
CREATE TABLE `systemdata` (
  `systemId` int NOT NULL COMMENT '系统id',
  `dataDetail` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '系统详细数据(Class:SystemDataDetail)',
  `lastUpdateTime` datetime NOT NULL COMMENT '上次更新时间',
  PRIMARY KEY (`systemId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT=' 系统数据';

-- ----------------------------
-- Table structure for task
-- ----------------------------
DROP TABLE IF EXISTS `task`;
CREATE TABLE `task` (
  `roleId` bigint unsigned NOT NULL COMMENT '角色Id',
  `resId` bigint unsigned NOT NULL COMMENT '任务Id',
  `count` int unsigned NOT NULL COMMENT '进度',
  `rewardState` tinyint NOT NULL COMMENT '奖励状态',
  PRIMARY KEY (`roleId`,`resId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for taskcreate
-- ----------------------------
DROP TABLE IF EXISTS `taskcreate`;
CREATE TABLE `taskcreate` (
  `roleId` bigint unsigned NOT NULL COMMENT '角色Id',
  `type` int unsigned NOT NULL COMMENT '任务类型',
  `time` datetime NOT NULL COMMENT '生成时间',
  `extendData` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT '扩展数据(Class:TaskExtendData)',
  PRIMARY KEY (`roleId`,`type`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for test
-- ----------------------------
DROP TABLE IF EXISTS `test`;
CREATE TABLE `test` (
  `id` int NOT NULL COMMENT '1',
  `name` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '1',
  `roleId` bigint DEFAULT NULL,
  `ids` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT 'Id列表(Class:List<Integer>)',
  `equips` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '装备列表(Class:Map<Integer,com.xkhy.blcx.domain.model.game.equip.Equip>)',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='测试表';

SET FOREIGN_KEY_CHECKS = 1;
