/*
 Navicat Premium Data Transfer

 Source Server         : blcxh5_local
 Source Server Type    : MySQL
 Source Server Version : 80044 (8.0.44)
 Source Host           : localhost:3306
 Source Schema         : blcx_center

 Target Server Type    : MySQL
 Target Server Version : 80044 (8.0.44)
 File Encoding         : 65001

 Date: 11/12/2025 16:40:51
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for account
-- ----------------------------
DROP TABLE IF EXISTS `account`;
CREATE TABLE `account` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '编译',
  `account` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '账号',
  `password` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '密码',
  `registerTime` datetime DEFAULT NULL COMMENT '注册时间',
  `lastLoginTime` datetime DEFAULT NULL COMMENT '之后登陆时间',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `account` (`account`,`password`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2587 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for loginerror
-- ----------------------------
DROP TABLE IF EXISTS `loginerror`;
CREATE TABLE `loginerror` (
  `key` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `time` datetime DEFAULT NULL COMMENT '时间',
  PRIMARY KEY (`key`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='登录错误';

-- ----------------------------
-- Table structure for order
-- ----------------------------
DROP TABLE IF EXISTS `order`;
CREATE TABLE `order` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `orderCode` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '自己方订单号',
  `platformOrderCode` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '平台方订单号',
  `channelId` int NOT NULL COMMENT '渠道号',
  `payChannelId` int NOT NULL COMMENT 'payChannel表Id',
  `fromType` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '来源类型(如:activity)',
  `fromId` int DEFAULT NULL COMMENT '来源类型Id',
  `platformCode` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '平台账号唯一标识',
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `amount` double NOT NULL COMMENT '充值数量',
  `status` int NOT NULL COMMENT '(0,''已提交,未支付''),(1,''已转发,未回复''),(2,''已支付,金币发放中''),(3,''金币发放中''),(4,''充值成功,金币已发放'')',
  `ip` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '客户端IP',
  `createTime` datetime NOT NULL COMMENT '创建订单时间',
  `payTime` datetime DEFAULT NULL COMMENT '支付回调时间',
  `lastTime` datetime DEFAULT NULL COMMENT '完成发货时间',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `roleId` (`roleId`) USING BTREE,
  KEY `orderCode` (`orderCode`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=652 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='充值表';

-- ----------------------------
-- Table structure for player0
-- ----------------------------
DROP TABLE IF EXISTS `player0`;
CREATE TABLE `player0` (
  `platform` int unsigned NOT NULL COMMENT '平台标识',
  `code` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '账户',
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `serverId` int NOT NULL DEFAULT '-1' COMMENT '临时指定服务器Id',
  `internal` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '是否内部角色',
  `registerTime` datetime NOT NULL COMMENT '注册时间',
  `lastLoginTime` datetime NOT NULL COMMENT '最后登录时间',
  `lastOfflineTime` datetime DEFAULT NULL COMMENT '最后离线时间',
  `power` bigint DEFAULT NULL COMMENT '角色战力，既修炼值',
  `popularity` bigint DEFAULT NULL COMMENT '玩家人气',
  `virtue` bigint DEFAULT NULL COMMENT '玩家功德',
  `friendNum` int DEFAULT NULL COMMENT '玩家好友数量',
  `roleName` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '角色名称',
  `roleImg` bigint DEFAULT NULL COMMENT '角色头像',
  `headFrame` bigint DEFAULT NULL COMMENT '角色头像框',
  `takeOverRoleId` bigint DEFAULT '0' COMMENT '接管的角色Id',
  PRIMARY KEY (`platform`,`code`) USING BTREE,
  KEY `roleId` (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='玩家表';

-- ----------------------------
-- Table structure for player1
-- ----------------------------
DROP TABLE IF EXISTS `player1`;
CREATE TABLE `player1` (
  `platform` int unsigned NOT NULL COMMENT '平台标识',
  `code` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '账户',
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `serverId` int NOT NULL DEFAULT '-1' COMMENT '临时指定服务器Id',
  `internal` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '是否内部角色',
  `registerTime` datetime NOT NULL COMMENT '注册时间',
  `lastLoginTime` datetime NOT NULL COMMENT '最后登录时间',
  `lastOfflineTime` datetime DEFAULT NULL COMMENT '最后离线时间',
  `power` bigint DEFAULT NULL COMMENT '角色战力，既修炼值',
  `popularity` bigint DEFAULT NULL COMMENT '玩家人气',
  `virtue` bigint DEFAULT NULL COMMENT '玩家功德',
  `friendNum` int DEFAULT NULL COMMENT '玩家好友数量',
  `roleName` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '角色名称',
  `roleImg` bigint DEFAULT NULL COMMENT '角色头像',
  `headFrame` bigint DEFAULT NULL COMMENT '角色头像框',
  `takeOverRoleId` bigint DEFAULT '0' COMMENT '接管的角色Id',
  PRIMARY KEY (`platform`,`code`) USING BTREE,
  KEY `roleId` (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for player10
-- ----------------------------
DROP TABLE IF EXISTS `player10`;
CREATE TABLE `player10` (
  `platform` int unsigned NOT NULL COMMENT '平台标识',
  `code` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '账户',
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `serverId` int NOT NULL DEFAULT '-1' COMMENT '临时指定服务器Id',
  `internal` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '是否内部角色',
  `registerTime` datetime NOT NULL COMMENT '注册时间',
  `lastLoginTime` datetime NOT NULL COMMENT '最后登录时间',
  `lastOfflineTime` datetime DEFAULT NULL COMMENT '最后离线时间',
  `power` bigint DEFAULT NULL COMMENT '角色战力，既修炼值',
  `popularity` bigint DEFAULT NULL COMMENT '玩家人气',
  `virtue` bigint DEFAULT NULL COMMENT '玩家功德',
  `friendNum` int DEFAULT NULL COMMENT '玩家好友数量',
  `roleName` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '角色名称',
  `roleImg` bigint DEFAULT NULL COMMENT '角色头像',
  `headFrame` bigint DEFAULT NULL COMMENT '角色头像框',
  `takeOverRoleId` bigint DEFAULT '0' COMMENT '接管的角色Id',
  PRIMARY KEY (`platform`,`code`) USING BTREE,
  KEY `roleId` (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for player11
-- ----------------------------
DROP TABLE IF EXISTS `player11`;
CREATE TABLE `player11` (
  `platform` int unsigned NOT NULL COMMENT '平台标识',
  `code` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '账户',
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `serverId` int NOT NULL DEFAULT '-1' COMMENT '临时指定服务器Id',
  `internal` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '是否内部角色',
  `registerTime` datetime NOT NULL COMMENT '注册时间',
  `lastLoginTime` datetime NOT NULL COMMENT '最后登录时间',
  `lastOfflineTime` datetime DEFAULT NULL COMMENT '最后离线时间',
  `power` bigint DEFAULT NULL COMMENT '角色战力，既修炼值',
  `popularity` bigint DEFAULT NULL COMMENT '玩家人气',
  `virtue` bigint DEFAULT NULL COMMENT '玩家功德',
  `friendNum` int DEFAULT NULL COMMENT '玩家好友数量',
  `roleName` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '角色名称',
  `roleImg` bigint DEFAULT NULL COMMENT '角色头像',
  `headFrame` bigint DEFAULT NULL COMMENT '角色头像框',
  `takeOverRoleId` bigint DEFAULT '0' COMMENT '接管的角色Id',
  PRIMARY KEY (`platform`,`code`) USING BTREE,
  KEY `roleId` (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for player12
-- ----------------------------
DROP TABLE IF EXISTS `player12`;
CREATE TABLE `player12` (
  `platform` int unsigned NOT NULL COMMENT '平台标识',
  `code` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '账户',
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `serverId` int NOT NULL DEFAULT '-1' COMMENT '临时指定服务器Id',
  `internal` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '是否内部角色',
  `registerTime` datetime NOT NULL COMMENT '注册时间',
  `lastLoginTime` datetime NOT NULL COMMENT '最后登录时间',
  `lastOfflineTime` datetime DEFAULT NULL COMMENT '最后离线时间',
  `power` bigint DEFAULT NULL COMMENT '角色战力，既修炼值',
  `popularity` bigint DEFAULT NULL COMMENT '玩家人气',
  `virtue` bigint DEFAULT NULL COMMENT '玩家功德',
  `friendNum` int DEFAULT NULL COMMENT '玩家好友数量',
  `roleName` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '角色名称',
  `roleImg` bigint DEFAULT NULL COMMENT '角色头像',
  `headFrame` bigint DEFAULT NULL COMMENT '角色头像框',
  `takeOverRoleId` bigint DEFAULT '0' COMMENT '接管的角色Id',
  PRIMARY KEY (`platform`,`code`) USING BTREE,
  KEY `roleId` (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for player13
-- ----------------------------
DROP TABLE IF EXISTS `player13`;
CREATE TABLE `player13` (
  `platform` int unsigned NOT NULL COMMENT '平台标识',
  `code` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '账户',
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `serverId` int NOT NULL DEFAULT '-1' COMMENT '临时指定服务器Id',
  `internal` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '是否内部角色',
  `registerTime` datetime NOT NULL COMMENT '注册时间',
  `lastLoginTime` datetime NOT NULL COMMENT '最后登录时间',
  `lastOfflineTime` datetime DEFAULT NULL COMMENT '最后离线时间',
  `power` bigint DEFAULT NULL COMMENT '角色战力，既修炼值',
  `popularity` bigint DEFAULT NULL COMMENT '玩家人气',
  `virtue` bigint DEFAULT NULL COMMENT '玩家功德',
  `friendNum` int DEFAULT NULL COMMENT '玩家好友数量',
  `roleName` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '角色名称',
  `roleImg` bigint DEFAULT NULL COMMENT '角色头像',
  `headFrame` bigint DEFAULT NULL COMMENT '角色头像框',
  `takeOverRoleId` bigint DEFAULT '0' COMMENT '接管的角色Id',
  PRIMARY KEY (`platform`,`code`) USING BTREE,
  KEY `roleId` (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for player14
-- ----------------------------
DROP TABLE IF EXISTS `player14`;
CREATE TABLE `player14` (
  `platform` int unsigned NOT NULL COMMENT '平台标识',
  `code` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '账户',
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `serverId` int NOT NULL DEFAULT '-1' COMMENT '临时指定服务器Id',
  `internal` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '是否内部角色',
  `registerTime` datetime NOT NULL COMMENT '注册时间',
  `lastLoginTime` datetime NOT NULL COMMENT '最后登录时间',
  `lastOfflineTime` datetime DEFAULT NULL COMMENT '最后离线时间',
  `power` bigint DEFAULT NULL COMMENT '角色战力，既修炼值',
  `popularity` bigint DEFAULT NULL COMMENT '玩家人气',
  `virtue` bigint DEFAULT NULL COMMENT '玩家功德',
  `friendNum` int DEFAULT NULL COMMENT '玩家好友数量',
  `roleName` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '角色名称',
  `roleImg` bigint DEFAULT NULL COMMENT '角色头像',
  `headFrame` bigint DEFAULT NULL COMMENT '角色头像框',
  `takeOverRoleId` bigint DEFAULT '0' COMMENT '接管的角色Id',
  PRIMARY KEY (`platform`,`code`) USING BTREE,
  KEY `roleId` (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for player15
-- ----------------------------
DROP TABLE IF EXISTS `player15`;
CREATE TABLE `player15` (
  `platform` int unsigned NOT NULL COMMENT '平台标识',
  `code` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '账户',
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `serverId` int NOT NULL DEFAULT '-1' COMMENT '临时指定服务器Id',
  `internal` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '是否内部角色',
  `registerTime` datetime NOT NULL COMMENT '注册时间',
  `lastLoginTime` datetime NOT NULL COMMENT '最后登录时间',
  `lastOfflineTime` datetime DEFAULT NULL COMMENT '最后离线时间',
  `power` bigint DEFAULT NULL COMMENT '角色战力，既修炼值',
  `popularity` bigint DEFAULT NULL COMMENT '玩家人气',
  `virtue` bigint DEFAULT NULL COMMENT '玩家功德',
  `friendNum` int DEFAULT NULL COMMENT '玩家好友数量',
  `roleName` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '角色名称',
  `roleImg` bigint DEFAULT NULL COMMENT '角色头像',
  `headFrame` bigint DEFAULT NULL COMMENT '角色头像框',
  `takeOverRoleId` bigint DEFAULT '0' COMMENT '接管的角色Id',
  PRIMARY KEY (`platform`,`code`) USING BTREE,
  KEY `roleId` (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for player16
-- ----------------------------
DROP TABLE IF EXISTS `player16`;
CREATE TABLE `player16` (
  `platform` int unsigned NOT NULL COMMENT '平台标识',
  `code` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '账户',
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `serverId` int NOT NULL DEFAULT '-1' COMMENT '临时指定服务器Id',
  `internal` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '是否内部角色',
  `registerTime` datetime NOT NULL COMMENT '注册时间',
  `lastLoginTime` datetime NOT NULL COMMENT '最后登录时间',
  `lastOfflineTime` datetime DEFAULT NULL COMMENT '最后离线时间',
  `power` bigint DEFAULT NULL COMMENT '角色战力，既修炼值',
  `popularity` bigint DEFAULT NULL COMMENT '玩家人气',
  `virtue` bigint DEFAULT NULL COMMENT '玩家功德',
  `friendNum` int DEFAULT NULL COMMENT '玩家好友数量',
  `roleName` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '角色名称',
  `roleImg` bigint DEFAULT NULL COMMENT '角色头像',
  `headFrame` bigint DEFAULT NULL COMMENT '角色头像框',
  `takeOverRoleId` bigint DEFAULT '0' COMMENT '接管的角色Id',
  PRIMARY KEY (`platform`,`code`) USING BTREE,
  KEY `roleId` (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for player17
-- ----------------------------
DROP TABLE IF EXISTS `player17`;
CREATE TABLE `player17` (
  `platform` int unsigned NOT NULL COMMENT '平台标识',
  `code` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '账户',
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `serverId` int NOT NULL DEFAULT '-1' COMMENT '临时指定服务器Id',
  `internal` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '是否内部角色',
  `registerTime` datetime NOT NULL COMMENT '注册时间',
  `lastLoginTime` datetime NOT NULL COMMENT '最后登录时间',
  `lastOfflineTime` datetime DEFAULT NULL COMMENT '最后离线时间',
  `power` bigint DEFAULT NULL COMMENT '角色战力，既修炼值',
  `popularity` bigint DEFAULT NULL COMMENT '玩家人气',
  `virtue` bigint DEFAULT NULL COMMENT '玩家功德',
  `friendNum` int DEFAULT NULL COMMENT '玩家好友数量',
  `roleName` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '角色名称',
  `roleImg` bigint DEFAULT NULL COMMENT '角色头像',
  `headFrame` bigint DEFAULT NULL COMMENT '角色头像框',
  `takeOverRoleId` bigint DEFAULT '0' COMMENT '接管的角色Id',
  PRIMARY KEY (`platform`,`code`) USING BTREE,
  KEY `roleId` (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for player18
-- ----------------------------
DROP TABLE IF EXISTS `player18`;
CREATE TABLE `player18` (
  `platform` int unsigned NOT NULL COMMENT '平台标识',
  `code` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '账户',
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `serverId` int NOT NULL DEFAULT '-1' COMMENT '临时指定服务器Id',
  `internal` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '是否内部角色',
  `registerTime` datetime NOT NULL COMMENT '注册时间',
  `lastLoginTime` datetime NOT NULL COMMENT '最后登录时间',
  `lastOfflineTime` datetime DEFAULT NULL COMMENT '最后离线时间',
  `power` bigint DEFAULT NULL COMMENT '角色战力，既修炼值',
  `popularity` bigint DEFAULT NULL COMMENT '玩家人气',
  `virtue` bigint DEFAULT NULL COMMENT '玩家功德',
  `friendNum` int DEFAULT NULL COMMENT '玩家好友数量',
  `roleName` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '角色名称',
  `roleImg` bigint DEFAULT NULL COMMENT '角色头像',
  `headFrame` bigint DEFAULT NULL COMMENT '角色头像框',
  `takeOverRoleId` bigint DEFAULT '0' COMMENT '接管的角色Id',
  PRIMARY KEY (`platform`,`code`) USING BTREE,
  KEY `roleId` (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for player19
-- ----------------------------
DROP TABLE IF EXISTS `player19`;
CREATE TABLE `player19` (
  `platform` int unsigned NOT NULL COMMENT '平台标识',
  `code` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '账户',
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `serverId` int NOT NULL DEFAULT '-1' COMMENT '临时指定服务器Id',
  `internal` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '是否内部角色',
  `registerTime` datetime NOT NULL COMMENT '注册时间',
  `lastLoginTime` datetime NOT NULL COMMENT '最后登录时间',
  `lastOfflineTime` datetime DEFAULT NULL COMMENT '最后离线时间',
  `power` bigint DEFAULT NULL COMMENT '角色战力，既修炼值',
  `popularity` bigint DEFAULT NULL COMMENT '玩家人气',
  `virtue` bigint DEFAULT NULL COMMENT '玩家功德',
  `friendNum` int DEFAULT NULL COMMENT '玩家好友数量',
  `roleName` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '角色名称',
  `roleImg` bigint DEFAULT NULL COMMENT '角色头像',
  `headFrame` bigint DEFAULT NULL COMMENT '角色头像框',
  `takeOverRoleId` bigint DEFAULT '0' COMMENT '接管的角色Id',
  PRIMARY KEY (`platform`,`code`) USING BTREE,
  KEY `roleId` (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for player2
-- ----------------------------
DROP TABLE IF EXISTS `player2`;
CREATE TABLE `player2` (
  `platform` int unsigned NOT NULL COMMENT '平台标识',
  `code` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '账户',
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `serverId` int NOT NULL DEFAULT '-1' COMMENT '临时指定服务器Id',
  `internal` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '是否内部角色',
  `registerTime` datetime NOT NULL COMMENT '注册时间',
  `lastLoginTime` datetime NOT NULL COMMENT '最后登录时间',
  `lastOfflineTime` datetime DEFAULT NULL COMMENT '最后离线时间',
  `power` bigint DEFAULT NULL COMMENT '角色战力，既修炼值',
  `popularity` bigint DEFAULT NULL COMMENT '玩家人气',
  `virtue` bigint DEFAULT NULL COMMENT '玩家功德',
  `friendNum` int DEFAULT NULL COMMENT '玩家好友数量',
  `roleName` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '角色名称',
  `roleImg` bigint DEFAULT NULL COMMENT '角色头像',
  `headFrame` bigint DEFAULT NULL COMMENT '角色头像框',
  `takeOverRoleId` bigint DEFAULT '0' COMMENT '接管的角色Id',
  PRIMARY KEY (`platform`,`code`) USING BTREE,
  KEY `roleId` (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for player20
-- ----------------------------
DROP TABLE IF EXISTS `player20`;
CREATE TABLE `player20` (
  `platform` int unsigned NOT NULL COMMENT '平台标识',
  `code` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '账户',
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `serverId` int NOT NULL DEFAULT '-1' COMMENT '临时指定服务器Id',
  `internal` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '是否内部角色',
  `registerTime` datetime NOT NULL COMMENT '注册时间',
  `lastLoginTime` datetime NOT NULL COMMENT '最后登录时间',
  `lastOfflineTime` datetime DEFAULT NULL COMMENT '最后离线时间',
  `power` bigint DEFAULT NULL COMMENT '角色战力，既修炼值',
  `popularity` bigint DEFAULT NULL COMMENT '玩家人气',
  `virtue` bigint DEFAULT NULL COMMENT '玩家功德',
  `friendNum` int DEFAULT NULL COMMENT '玩家好友数量',
  `roleName` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '角色名称',
  `roleImg` bigint DEFAULT NULL COMMENT '角色头像',
  `headFrame` bigint DEFAULT NULL COMMENT '角色头像框',
  `takeOverRoleId` bigint DEFAULT '0' COMMENT '接管的角色Id',
  PRIMARY KEY (`platform`,`code`) USING BTREE,
  KEY `roleId` (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for player3
-- ----------------------------
DROP TABLE IF EXISTS `player3`;
CREATE TABLE `player3` (
  `platform` int unsigned NOT NULL COMMENT '平台标识',
  `code` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '账户',
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `serverId` int NOT NULL DEFAULT '-1' COMMENT '临时指定服务器Id',
  `internal` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '是否内部角色',
  `registerTime` datetime NOT NULL COMMENT '注册时间',
  `lastLoginTime` datetime NOT NULL COMMENT '最后登录时间',
  `lastOfflineTime` datetime DEFAULT NULL COMMENT '最后离线时间',
  `power` bigint DEFAULT NULL COMMENT '角色战力，既修炼值',
  `popularity` bigint DEFAULT NULL COMMENT '玩家人气',
  `virtue` bigint DEFAULT NULL COMMENT '玩家功德',
  `friendNum` int DEFAULT NULL COMMENT '玩家好友数量',
  `roleName` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '角色名称',
  `roleImg` bigint DEFAULT NULL COMMENT '角色头像',
  `headFrame` bigint DEFAULT NULL COMMENT '角色头像框',
  `takeOverRoleId` bigint DEFAULT '0' COMMENT '接管的角色Id',
  PRIMARY KEY (`platform`,`code`) USING BTREE,
  KEY `roleId` (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for player4
-- ----------------------------
DROP TABLE IF EXISTS `player4`;
CREATE TABLE `player4` (
  `platform` int unsigned NOT NULL COMMENT '平台标识',
  `code` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '账户',
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `serverId` int NOT NULL DEFAULT '-1' COMMENT '临时指定服务器Id',
  `internal` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '是否内部角色',
  `registerTime` datetime NOT NULL COMMENT '注册时间',
  `lastLoginTime` datetime NOT NULL COMMENT '最后登录时间',
  `lastOfflineTime` datetime DEFAULT NULL COMMENT '最后离线时间',
  `power` bigint DEFAULT NULL COMMENT '角色战力，既修炼值',
  `popularity` bigint DEFAULT NULL COMMENT '玩家人气',
  `virtue` bigint DEFAULT NULL COMMENT '玩家功德',
  `friendNum` int DEFAULT NULL COMMENT '玩家好友数量',
  `roleName` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '角色名称',
  `roleImg` bigint DEFAULT NULL COMMENT '角色头像',
  `headFrame` bigint DEFAULT NULL COMMENT '角色头像框',
  `takeOverRoleId` bigint DEFAULT '0' COMMENT '接管的角色Id',
  PRIMARY KEY (`platform`,`code`) USING BTREE,
  KEY `roleId` (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for player5
-- ----------------------------
DROP TABLE IF EXISTS `player5`;
CREATE TABLE `player5` (
  `platform` int unsigned NOT NULL COMMENT '平台标识',
  `code` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '账户',
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `serverId` int NOT NULL DEFAULT '-1' COMMENT '临时指定服务器Id',
  `internal` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '是否内部角色',
  `registerTime` datetime NOT NULL COMMENT '注册时间',
  `lastLoginTime` datetime NOT NULL COMMENT '最后登录时间',
  `lastOfflineTime` datetime DEFAULT NULL COMMENT '最后离线时间',
  `power` bigint DEFAULT NULL COMMENT '角色战力，既修炼值',
  `popularity` bigint DEFAULT NULL COMMENT '玩家人气',
  `virtue` bigint DEFAULT NULL COMMENT '玩家功德',
  `friendNum` int DEFAULT NULL COMMENT '玩家好友数量',
  `roleName` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '角色名称',
  `roleImg` bigint DEFAULT NULL COMMENT '角色头像',
  `headFrame` bigint DEFAULT NULL COMMENT '角色头像框',
  `takeOverRoleId` bigint DEFAULT '0' COMMENT '接管的角色Id',
  PRIMARY KEY (`platform`,`code`) USING BTREE,
  KEY `roleId` (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for player6
-- ----------------------------
DROP TABLE IF EXISTS `player6`;
CREATE TABLE `player6` (
  `platform` int unsigned NOT NULL COMMENT '平台标识',
  `code` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '账户',
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `serverId` int NOT NULL DEFAULT '-1' COMMENT '临时指定服务器Id',
  `internal` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '是否内部角色',
  `registerTime` datetime NOT NULL COMMENT '注册时间',
  `lastLoginTime` datetime NOT NULL COMMENT '最后登录时间',
  `lastOfflineTime` datetime DEFAULT NULL COMMENT '最后离线时间',
  `power` bigint DEFAULT NULL COMMENT '角色战力，既修炼值',
  `popularity` bigint DEFAULT NULL COMMENT '玩家人气',
  `virtue` bigint DEFAULT NULL COMMENT '玩家功德',
  `friendNum` int DEFAULT NULL COMMENT '玩家好友数量',
  `roleName` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '角色名称',
  `roleImg` bigint DEFAULT NULL COMMENT '角色头像',
  `headFrame` bigint DEFAULT NULL COMMENT '角色头像框',
  `takeOverRoleId` bigint DEFAULT '0' COMMENT '接管的角色Id',
  PRIMARY KEY (`platform`,`code`) USING BTREE,
  KEY `roleId` (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for player7
-- ----------------------------
DROP TABLE IF EXISTS `player7`;
CREATE TABLE `player7` (
  `platform` int unsigned NOT NULL COMMENT '平台标识',
  `code` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '账户',
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `serverId` int NOT NULL DEFAULT '-1' COMMENT '临时指定服务器Id',
  `internal` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '是否内部角色',
  `registerTime` datetime NOT NULL COMMENT '注册时间',
  `lastLoginTime` datetime NOT NULL COMMENT '最后登录时间',
  `lastOfflineTime` datetime DEFAULT NULL COMMENT '最后离线时间',
  `power` bigint DEFAULT NULL COMMENT '角色战力，既修炼值',
  `popularity` bigint DEFAULT NULL COMMENT '玩家人气',
  `virtue` bigint DEFAULT NULL COMMENT '玩家功德',
  `friendNum` int DEFAULT NULL COMMENT '玩家好友数量',
  `roleName` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '角色名称',
  `roleImg` bigint DEFAULT NULL COMMENT '角色头像',
  `headFrame` bigint DEFAULT NULL COMMENT '角色头像框',
  `takeOverRoleId` bigint DEFAULT '0' COMMENT '接管的角色Id',
  PRIMARY KEY (`platform`,`code`) USING BTREE,
  KEY `roleId` (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for player8
-- ----------------------------
DROP TABLE IF EXISTS `player8`;
CREATE TABLE `player8` (
  `platform` int unsigned NOT NULL COMMENT '平台标识',
  `code` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '账户',
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `serverId` int NOT NULL DEFAULT '-1' COMMENT '临时指定服务器Id',
  `internal` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '是否内部角色',
  `registerTime` datetime NOT NULL COMMENT '注册时间',
  `lastLoginTime` datetime NOT NULL COMMENT '最后登录时间',
  `lastOfflineTime` datetime DEFAULT NULL COMMENT '最后离线时间',
  `power` bigint DEFAULT NULL COMMENT '角色战力，既修炼值',
  `popularity` bigint DEFAULT NULL COMMENT '玩家人气',
  `virtue` bigint DEFAULT NULL COMMENT '玩家功德',
  `friendNum` int DEFAULT NULL COMMENT '玩家好友数量',
  `roleName` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '角色名称',
  `roleImg` bigint DEFAULT NULL COMMENT '角色头像',
  `headFrame` bigint DEFAULT NULL COMMENT '角色头像框',
  `takeOverRoleId` bigint DEFAULT '0' COMMENT '接管的角色Id',
  PRIMARY KEY (`platform`,`code`) USING BTREE,
  KEY `roleId` (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for player9
-- ----------------------------
DROP TABLE IF EXISTS `player9`;
CREATE TABLE `player9` (
  `platform` int unsigned NOT NULL COMMENT '平台标识',
  `code` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '账户',
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `serverId` int NOT NULL DEFAULT '-1' COMMENT '临时指定服务器Id',
  `internal` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '是否内部角色',
  `registerTime` datetime NOT NULL COMMENT '注册时间',
  `lastLoginTime` datetime NOT NULL COMMENT '最后登录时间',
  `lastOfflineTime` datetime DEFAULT NULL COMMENT '最后离线时间',
  `power` bigint DEFAULT NULL COMMENT '角色战力，既修炼值',
  `popularity` bigint DEFAULT NULL COMMENT '玩家人气',
  `virtue` bigint DEFAULT NULL COMMENT '玩家功德',
  `friendNum` int DEFAULT NULL COMMENT '玩家好友数量',
  `roleName` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '角色名称',
  `roleImg` bigint DEFAULT NULL COMMENT '角色头像',
  `headFrame` bigint DEFAULT NULL COMMENT '角色头像框',
  `takeOverRoleId` bigint DEFAULT '0' COMMENT '接管的角色Id',
  PRIMARY KEY (`platform`,`code`) USING BTREE,
  KEY `roleId` (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for recyclerole
-- ----------------------------
DROP TABLE IF EXISTS `recyclerole`;
CREATE TABLE `recyclerole` (
  `roleId` bigint NOT NULL COMMENT 'ID',
  `platform` int DEFAULT NULL COMMENT '平台标识',
  `code` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '账户',
  `time` datetime DEFAULT NULL COMMENT '时间',
  `status` tinyint(1) DEFAULT NULL COMMENT '状态(0未重新使用,1已重新使用)',
  PRIMARY KEY (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='定期检查N久没登录的角色Id回收保存在这表里，分配给新玩家';

-- ----------------------------
-- Table structure for servernode
-- ----------------------------
DROP TABLE IF EXISTS `servernode`;
CREATE TABLE `servernode` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `point` int NOT NULL COMMENT '指向ID',
  `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '名称',
  `host` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '主机',
  `port` int DEFAULT NULL COMMENT '端口',
  `wssHost` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'wss主机',
  `wssPort` int DEFAULT NULL COMMENT 'wss端口',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='服务器节点';

-- ----------------------------
-- Records of servernode
-- ----------------------------
BEGIN;
INSERT INTO `servernode` (`id`, `point`, `name`, `host`, `port`, `wssHost`, `wssPort`) VALUES (1, 1, '一区', '127.0.0.1', 9506, '127.0.0.1', 9506);
INSERT INTO `servernode` (`id`, `point`, `name`, `host`, `port`, `wssHost`, `wssPort`) VALUES (2, 2, '一区', '127.0.0.1', 9506, '127.0.0.1', 9506);
INSERT INTO `servernode` (`id`, `point`, `name`, `host`, `port`, `wssHost`, `wssPort`) VALUES (3, 3, '一区', '127.0.0.1', 9506, '127.0.0.1', 9506);
INSERT INTO `servernode` (`id`, `point`, `name`, `host`, `port`, `wssHost`, `wssPort`) VALUES (4, 4, '一区', '127.0.0.1', 9506, '127.0.0.1', 9506);
INSERT INTO `servernode` (`id`, `point`, `name`, `host`, `port`, `wssHost`, `wssPort`) VALUES (5, 5, '一区', '127.0.0.1', 9506, '127.0.0.1', 9506);
INSERT INTO `servernode` (`id`, `point`, `name`, `host`, `port`, `wssHost`, `wssPort`) VALUES (6, 6, '一区', '127.0.0.1', 9506, '127.0.0.1', 9506);
INSERT INTO `servernode` (`id`, `point`, `name`, `host`, `port`, `wssHost`, `wssPort`) VALUES (7, 7, '一区', '127.0.0.1', 9506, '127.0.0.1', 9506);
INSERT INTO `servernode` (`id`, `point`, `name`, `host`, `port`, `wssHost`, `wssPort`) VALUES (8, 8, '一区', '127.0.0.1', 9506, '127.0.0.1', 9506);
INSERT INTO `servernode` (`id`, `point`, `name`, `host`, `port`, `wssHost`, `wssPort`) VALUES (9, 9, '一区', '127.0.0.1', 9506, '127.0.0.1', 9506);
INSERT INTO `servernode` (`id`, `point`, `name`, `host`, `port`, `wssHost`, `wssPort`) VALUES (10, 10, '一区', '127.0.0.1', 9506, '127.0.0.1', 9506);
INSERT INTO `servernode` (`id`, `point`, `name`, `host`, `port`, `wssHost`, `wssPort`) VALUES (11, 11, '一区', '127.0.0.1', 9506, '127.0.0.1', 9506);
INSERT INTO `servernode` (`id`, `point`, `name`, `host`, `port`, `wssHost`, `wssPort`) VALUES (12, 12, '一区', '127.0.0.1', 9506, '127.0.0.1', 9506);
INSERT INTO `servernode` (`id`, `point`, `name`, `host`, `port`, `wssHost`, `wssPort`) VALUES (13, 13, '一区', '127.0.0.1', 9506, '127.0.0.1', 9506);
INSERT INTO `servernode` (`id`, `point`, `name`, `host`, `port`, `wssHost`, `wssPort`) VALUES (14, 14, '一区', '127.0.0.1', 9506, '127.0.0.1', 9506);
INSERT INTO `servernode` (`id`, `point`, `name`, `host`, `port`, `wssHost`, `wssPort`) VALUES (15, 15, '一区', '127.0.0.1', 9506, '127.0.0.1', 9506);
INSERT INTO `servernode` (`id`, `point`, `name`, `host`, `port`, `wssHost`, `wssPort`) VALUES (16, 16, '一区', '127.0.0.1', 9506, '127.0.0.1', 9506);
INSERT INTO `servernode` (`id`, `point`, `name`, `host`, `port`, `wssHost`, `wssPort`) VALUES (17, 17, '一区', '127.0.0.1', 9506, '127.0.0.1', 9506);
INSERT INTO `servernode` (`id`, `point`, `name`, `host`, `port`, `wssHost`, `wssPort`) VALUES (18, 18, '一区', '127.0.0.1', 9506, '127.0.0.1', 9506);
INSERT INTO `servernode` (`id`, `point`, `name`, `host`, `port`, `wssHost`, `wssPort`) VALUES (19, 19, '一区', '127.0.0.1', 9506, '127.0.0.1', 9506);
INSERT INTO `servernode` (`id`, `point`, `name`, `host`, `port`, `wssHost`, `wssPort`) VALUES (20, 20, '一区', '127.0.0.1', 9506, '127.0.0.1', 9506);
COMMIT;

-- ----------------------------
-- Table structure for sysconfig
-- ----------------------------
DROP TABLE IF EXISTS `sysconfig`;
CREATE TABLE `sysconfig` (
  `key` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '键',
  `value` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '值',
  `description` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '描述',
  PRIMARY KEY (`key`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
-- ----------------------------
-- Records of sysconfig
-- ----------------------------
BEGIN;
INSERT INTO `sysconfig` (`key`, `value`, `description`) VALUES ('startDate', '1739770222', '3');
COMMIT;


SET FOREIGN_KEY_CHECKS = 1;
