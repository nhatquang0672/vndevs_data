/*
 Navicat Premium Data Transfer

 Source Server         : blcxh5_local
 Source Server Type    : MySQL
 Source Server Version : 80044 (8.0.44)
 Source Host           : localhost:3306
 Source Schema         : blcx_log

 Target Server Type    : MySQL
 Target Server Version : 80044 (8.0.44)
 File Encoding         : 65001

 Date: 11/12/2025 16:40:25
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for battle
-- ----------------------------
DROP TABLE IF EXISTS `battle`;
CREATE TABLE `battle` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `roleName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '角色名字',
  `bigChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '大渠道',
  `smallChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道',
  `smallChannelPack` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道包',
  `fuBenId` bigint NOT NULL COMMENT '副本id',
  `reward` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT '奖励',
  `battleState` int NOT NULL COMMENT '状态',
  `time` datetime NOT NULL COMMENT '时间',
  `heroId` bigint DEFAULT NULL COMMENT '使用的英雄Id',
  `liveTime` int DEFAULT NULL COMMENT '生存时间',
  `type` int DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2164 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='战斗日志';

-- ----------------------------
-- Table structure for breach
-- ----------------------------
DROP TABLE IF EXISTS `breach`;
CREATE TABLE `breach` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `roleName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '角色名字',
  `bigChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '大渠道',
  `smallChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道',
  `smallChannelPack` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道包',
  `type` int NOT NULL COMMENT '类型',
  `newValue` bigint NOT NULL COMMENT '新值',
  `time` datetime NOT NULL COMMENT '时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3709 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='突破';

-- ----------------------------
-- Table structure for coin
-- ----------------------------
DROP TABLE IF EXISTS `coin`;
CREATE TABLE `coin` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `roleName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '角色名字',
  `serverId` int NOT NULL COMMENT '服Id',
  `bigChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '大渠道',
  `smallChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道',
  `smallChannelPack` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道包',
  `resId` bigint NOT NULL COMMENT '资源ResId',
  `uniqueId` bigint NOT NULL COMMENT '唯一ID',
  `time` datetime NOT NULL COMMENT '时间',
  `type` int DEFAULT NULL COMMENT '类型(1获得,2消耗)',
  `operateType` int DEFAULT NULL COMMENT '操作类型',
  `oldValue` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '原值',
  `changeValue` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '改变值',
  `newValue` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '新值',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=119200 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='金币';

-- ----------------------------
-- Table structure for dailyactive
-- ----------------------------
DROP TABLE IF EXISTS `dailyactive`;
CREATE TABLE `dailyactive` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `roleName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '角色名字',
  `serverId` int NOT NULL COMMENT '服Id',
  `bigChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '大渠道',
  `smallChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道',
  `smallChannelPack` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道包',
  `resId` bigint NOT NULL COMMENT '资源ResId',
  `uniqueId` bigint NOT NULL COMMENT '唯一ID',
  `time` datetime NOT NULL COMMENT '时间',
  `type` int DEFAULT NULL COMMENT '类型(1获得,2消耗)',
  `operateType` int DEFAULT NULL COMMENT '操作类型',
  `oldValue` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '原值',
  `changeValue` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '改变值',
  `newValue` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '新值',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=849 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='日常活跃';

-- ----------------------------
-- Table structure for end
-- ----------------------------
DROP TABLE IF EXISTS `end`;
CREATE TABLE `end` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `roleName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '角色名字',
  `serverId` int NOT NULL COMMENT '服Id',
  `bigChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '大渠道',
  `smallChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道',
  `smallChannelPack` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道包',
  `resId` bigint NOT NULL COMMENT '资源ResId',
  `uniqueId` bigint NOT NULL COMMENT '唯一ID',
  `time` datetime NOT NULL COMMENT '时间',
  `type` int DEFAULT NULL COMMENT '类型(1获得,2消耗)',
  `operateType` int DEFAULT NULL COMMENT '操作类型',
  `oldValue` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '原值',
  `changeValue` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '改变值',
  `newValue` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '新值',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=15126 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='体力';

-- ----------------------------
-- Table structure for energy
-- ----------------------------
DROP TABLE IF EXISTS `energy`;
CREATE TABLE `energy` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `roleName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '角色名字',
  `serverId` int NOT NULL COMMENT '服Id',
  `bigChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '大渠道',
  `smallChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道',
  `smallChannelPack` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道包',
  `resId` bigint NOT NULL COMMENT '资源ResId',
  `uniqueId` bigint NOT NULL COMMENT '唯一ID',
  `time` datetime NOT NULL COMMENT '时间',
  `type` int DEFAULT NULL COMMENT '类型(1获得,2消耗)',
  `operateType` int DEFAULT NULL COMMENT '操作类型',
  `oldValue` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '原值',
  `changeValue` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '改变值',
  `newValue` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '新值',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=664 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='能量';

-- ----------------------------
-- Table structure for equip
-- ----------------------------
DROP TABLE IF EXISTS `equip`;
CREATE TABLE `equip` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `roleName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '角色名字',
  `bigChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '大渠道',
  `smallChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道',
  `smallChannelPack` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道包',
  `equipId` bigint NOT NULL COMMENT '装备id',
  `resId` bigint NOT NULL COMMENT '配置id',
  `type` int NOT NULL COMMENT '日志类型',
  `time` datetime NOT NULL COMMENT '时间',
  `equipInfo` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '改变信息',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=91010 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='装备日志';

-- ----------------------------
-- Table structure for exp
-- ----------------------------
DROP TABLE IF EXISTS `exp`;
CREATE TABLE `exp` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `roleName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '角色名字',
  `serverId` int NOT NULL COMMENT '服Id',
  `bigChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '大渠道',
  `smallChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道',
  `smallChannelPack` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道包',
  `resId` bigint NOT NULL COMMENT '资源ResId',
  `uniqueId` bigint NOT NULL COMMENT '唯一ID',
  `time` datetime NOT NULL COMMENT '时间',
  `type` int DEFAULT NULL COMMENT '类型(1获得,2消耗)',
  `operateType` int DEFAULT NULL COMMENT '操作类型',
  `oldValue` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '原值',
  `changeValue` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '改变值',
  `newValue` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '新值',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6182 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='经验';

-- ----------------------------
-- Table structure for fuben
-- ----------------------------
DROP TABLE IF EXISTS `fuben`;
CREATE TABLE `fuben` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `roleName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '角色名字',
  `bigChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '大渠道',
  `smallChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道',
  `smallChannelPack` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道包',
  `type` int NOT NULL COMMENT '类型',
  `state` bigint DEFAULT NULL COMMENT '状态',
  `time` datetime NOT NULL COMMENT '时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6384 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='副本';

-- ----------------------------
-- Table structure for gem
-- ----------------------------
DROP TABLE IF EXISTS `gem`;
CREATE TABLE `gem` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `roleName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '角色名字',
  `serverId` int NOT NULL COMMENT '服Id',
  `bigChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '大渠道',
  `smallChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道',
  `smallChannelPack` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道包',
  `resId` bigint NOT NULL COMMENT '资源ResId',
  `uniqueId` bigint NOT NULL COMMENT '唯一ID',
  `time` datetime NOT NULL COMMENT '时间',
  `type` int DEFAULT NULL COMMENT '类型(1获得,2消耗)',
  `operateType` int DEFAULT NULL COMMENT '操作类型',
  `oldValue` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '原值',
  `changeValue` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '改变值',
  `newValue` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '新值',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=22137 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='钻石';

-- ----------------------------
-- Table structure for gift
-- ----------------------------
DROP TABLE IF EXISTS `gift`;
CREATE TABLE `gift` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `roleName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '角色名字',
  `bigChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '大渠道',
  `smallChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道',
  `smallChannelPack` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道包',
  `type` int NOT NULL COMMENT '类型',
  `operate` bigint DEFAULT NULL COMMENT '操作',
  `time` datetime NOT NULL COMMENT '时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=54612 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='礼包';

-- ----------------------------
-- Table structure for hangbox
-- ----------------------------
DROP TABLE IF EXISTS `hangbox`;
CREATE TABLE `hangbox` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `roleName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '角色名字',
  `bigChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '大渠道',
  `smallChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道',
  `smallChannelPack` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道包',
  `state` int NOT NULL COMMENT '状态',
  `time` datetime NOT NULL COMMENT '时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=754 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='修炼宝箱';

-- ----------------------------
-- Table structure for hero
-- ----------------------------
DROP TABLE IF EXISTS `hero`;
CREATE TABLE `hero` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `roleName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '角色名字',
  `bigChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '大渠道',
  `smallChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道',
  `smallChannelPack` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道包',
  `type` int NOT NULL COMMENT '类型',
  `time` datetime NOT NULL COMMENT '时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1143 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='英雄';

-- ----------------------------
-- Table structure for item
-- ----------------------------
DROP TABLE IF EXISTS `item`;
CREATE TABLE `item` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `roleName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '角色名字',
  `serverId` int NOT NULL COMMENT '服Id',
  `bigChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '大渠道',
  `smallChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道',
  `smallChannelPack` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道包',
  `resId` bigint NOT NULL COMMENT '资源ResId',
  `uniqueId` bigint NOT NULL COMMENT '唯一ID',
  `time` datetime NOT NULL COMMENT '时间',
  `type` int DEFAULT NULL COMMENT '类型(1获得,2消耗)',
  `operateType` int DEFAULT NULL COMMENT '操作类型',
  `oldValue` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '原值',
  `changeValue` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '改变值',
  `newValue` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '新值',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=243946 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for login
-- ----------------------------
DROP TABLE IF EXISTS `login`;
CREATE TABLE `login` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `roleName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '角色名字',
  `serverId` int NOT NULL COMMENT '服Id',
  `bigChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '大渠道',
  `smallChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道',
  `smallChannelPack` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道包',
  `loginTime` datetime NOT NULL COMMENT '登录时间',
  `ip` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'ip',
  `imei` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'imei',
  `mac` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'mac',
  `idfa` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'idfa',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=23602 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for loginout
-- ----------------------------
DROP TABLE IF EXISTS `loginout`;
CREATE TABLE `loginout` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `roleName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '角色名字',
  `serverId` int NOT NULL COMMENT '服Id',
  `bigChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '大渠道',
  `smallChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道',
  `smallChannelPack` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道包',
  `loginTime` datetime NOT NULL COMMENT '登录时间',
  `logOutTime` datetime NOT NULL COMMENT '登出时间',
  `onlineMinute` int NOT NULL COMMENT '在线时间(分钟)',
  `ip` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'ip',
  `imei` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'imei',
  `mac` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'mac',
  `idfa` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'idfa',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=25371 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for lv
-- ----------------------------
DROP TABLE IF EXISTS `lv`;
CREATE TABLE `lv` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `roleName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '角色名字',
  `serverId` int NOT NULL COMMENT '服Id',
  `bigChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '大渠道',
  `smallChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道',
  `smallChannelPack` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道包',
  `resId` bigint NOT NULL COMMENT '资源ResId',
  `uniqueId` bigint NOT NULL COMMENT '唯一ID',
  `time` datetime NOT NULL COMMENT '时间',
  `type` int DEFAULT NULL COMMENT '类型(1获得,2消耗)',
  `operateType` int DEFAULT NULL COMMENT '操作类型',
  `oldValue` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '原值',
  `changeValue` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '改变值',
  `newValue` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '新值',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9443 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='等级';

-- ----------------------------
-- Table structure for mail
-- ----------------------------
DROP TABLE IF EXISTS `mail`;
CREATE TABLE `mail` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `roleName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '角色名字',
  `bigChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '大渠道',
  `smallChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道',
  `smallChannelPack` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道包',
  `mailId` bigint NOT NULL COMMENT '邮件id',
  `type` int NOT NULL COMMENT '操作类型',
  `rewardState` int DEFAULT NULL COMMENT '奖励状态',
  `readState` int NOT NULL COMMENT '读取状态',
  `time` datetime NOT NULL COMMENT '时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1260 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='邮件日志';

-- ----------------------------
-- Table structure for mall
-- ----------------------------
DROP TABLE IF EXISTS `mall`;
CREATE TABLE `mall` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `roleName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '角色名字',
  `bigChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '大渠道',
  `smallChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道',
  `smallChannelPack` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道包',
  `type` int NOT NULL COMMENT '类型',
  `resId` bigint DEFAULT NULL COMMENT '商品配置id',
  `time` datetime NOT NULL COMMENT '时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=18000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='商城';

-- ----------------------------
-- Table structure for name
-- ----------------------------
DROP TABLE IF EXISTS `name`;
CREATE TABLE `name` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `roleName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '角色名字',
  `serverId` int NOT NULL COMMENT '服Id',
  `bigChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '大渠道',
  `smallChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道',
  `smallChannelPack` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道包',
  `resId` bigint NOT NULL COMMENT '资源ResId',
  `uniqueId` bigint NOT NULL COMMENT '唯一ID',
  `time` datetime NOT NULL COMMENT '时间',
  `type` int DEFAULT NULL COMMENT '类型(1获得,2消耗)',
  `operateType` int DEFAULT NULL COMMENT '操作类型',
  `oldValue` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '原值',
  `changeValue` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '改变值',
  `newValue` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '新值',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='名称';

-- ----------------------------
-- Table structure for online
-- ----------------------------
DROP TABLE IF EXISTS `online`;
CREATE TABLE `online` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `time` datetime NOT NULL COMMENT '时间',
  `online` int DEFAULT NULL COMMENT '在线人数',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for register
-- ----------------------------
DROP TABLE IF EXISTS `register`;
CREATE TABLE `register` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `roleName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '角色名字',
  `serverId` int NOT NULL COMMENT '服Id',
  `bigChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '大渠道',
  `smallChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道',
  `smallChannelPack` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道包',
  `time` datetime NOT NULL COMMENT '时间',
  `type` int DEFAULT NULL COMMENT '类型(1登录,2登出)',
  `ip` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'ip',
  `imei` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'imei',
  `mac` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'mac',
  `idfa` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'idfa',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2918 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for rune
-- ----------------------------
DROP TABLE IF EXISTS `rune`;
CREATE TABLE `rune` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `roleName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '角色名字',
  `bigChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '大渠道',
  `smallChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道',
  `smallChannelPack` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道包',
  `runeId` bigint NOT NULL COMMENT '装备id',
  `type` int NOT NULL COMMENT '日志类型',
  `time` datetime NOT NULL COMMENT '时间',
  `runeInfo` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '改变信息',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8049 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='符文日志';

-- ----------------------------
-- Table structure for sevendays
-- ----------------------------
DROP TABLE IF EXISTS `sevendays`;
CREATE TABLE `sevendays` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `roleName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '角色名字',
  `bigChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '大渠道',
  `smallChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道',
  `smallChannelPack` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道包',
  `time` datetime NOT NULL COMMENT '时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8021 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='七日活动任务';

-- ----------------------------
-- Table structure for sign
-- ----------------------------
DROP TABLE IF EXISTS `sign`;
CREATE TABLE `sign` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `roleName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '角色名字',
  `bigChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '大渠道',
  `smallChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道',
  `smallChannelPack` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道包',
  `type` int NOT NULL COMMENT '类型',
  `resId` bigint DEFAULT NULL COMMENT '配置id',
  `time` datetime NOT NULL COMMENT '时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=558 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='签到';

-- ----------------------------
-- Table structure for weeklyactive
-- ----------------------------
DROP TABLE IF EXISTS `weeklyactive`;
CREATE TABLE `weeklyactive` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `roleName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '角色名字',
  `serverId` int NOT NULL COMMENT '服Id',
  `bigChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '大渠道',
  `smallChannel` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道',
  `smallChannelPack` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '小渠道包',
  `resId` bigint NOT NULL COMMENT '资源ResId',
  `uniqueId` bigint NOT NULL COMMENT '唯一ID',
  `time` datetime NOT NULL COMMENT '时间',
  `type` int DEFAULT NULL COMMENT '类型(1获得,2消耗)',
  `operateType` int DEFAULT NULL COMMENT '操作类型',
  `oldValue` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '原值',
  `changeValue` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '改变值',
  `newValue` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '新值',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=284 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='周常活跃';

SET FOREIGN_KEY_CHECKS = 1;
