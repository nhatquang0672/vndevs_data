-- MySQL dump 10.13  Distrib 8.0.24, for Linux (x86_64)
--
-- Host: localhost    Database: blcx_center
-- ------------------------------------------------------
-- Server version	8.0.24

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '编译',
  `account` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '账号',
  `password` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '密码',
  `registerTime` datetime DEFAULT NULL COMMENT '注册时间',
  `lastLoginTime` datetime DEFAULT NULL COMMENT '之后登陆时间',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `account` (`account`,`password`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2572 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES (2561,'111111','111111','2025-02-17 17:01:32','2025-02-17 17:01:32'),(2562,'1111112','111111','2025-02-17 17:16:42','2025-02-17 17:16:42'),(2563,'111113','111111','2025-02-17 17:25:33','2025-02-17 17:25:33'),(2564,'1111113','111111','2025-02-17 17:26:53','2025-02-17 17:26:53'),(2565,'11111133','111111','2025-02-17 17:27:20','2025-02-17 17:27:20'),(2566,'1aaaa','111111','2025-02-17 17:30:08','2025-02-17 17:30:08'),(2567,'1111111','11111','2025-02-17 18:03:48','2025-02-17 18:03:48'),(2568,'123456','123456','2025-02-18 00:46:58','2025-02-18 00:46:58'),(2569,'11111111','111111','2025-02-18 01:19:28','2025-02-18 01:19:28'),(2570,'222222','222222','2025-02-18 01:20:08','2025-02-18 01:20:08'),(2571,'aaaa123456','123456','2025-02-18 03:11:27','2025-02-18 03:11:27');
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loginerror`
--

DROP TABLE IF EXISTS `loginerror`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loginerror` (
  `key` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `time` datetime DEFAULT NULL COMMENT '时间',
  PRIMARY KEY (`key`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='登录错误';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loginerror`
--

LOCK TABLES `loginerror` WRITE;
/*!40000 ALTER TABLE `loginerror` DISABLE KEYS */;
/*!40000 ALTER TABLE `loginerror` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=532 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='充值表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
INSERT INTO `order` VALUES (523,'202502171822128320f7f','202502171822128320f7f',0,21,'XinShouGift',999048,'1111111',31,12,2,'','2025-02-17 18:22:13','2025-02-17 18:22:13','1970-01-01 08:00:00'),(524,'202502171822135991244','202502171822135991244',0,21,'XinShouGift',999048,'1111111',31,12,2,'','2025-02-17 18:22:14','2025-02-17 18:22:14','1970-01-01 08:00:00'),(525,'20250217182213966fba9','20250217182213966fba9',0,21,'XinShouGift',999048,'1111111',31,12,2,'','2025-02-17 18:22:14','2025-02-17 18:22:14','1970-01-01 08:00:00'),(526,'202502171822141525843','202502171822141525843',0,21,'XinShouGift',999048,'1111111',31,12,2,'','2025-02-17 18:22:14','2025-02-17 18:22:14','1970-01-01 08:00:00'),(527,'20250217182214321a99a','20250217182214321a99a',0,21,'XinShouGift',999048,'1111111',31,12,2,'','2025-02-17 18:22:14','2025-02-17 18:22:14','1970-01-01 08:00:00'),(528,'20250217182214582934e','20250217182214582934e',0,21,'XinShouGift',999048,'1111111',31,12,2,'','2025-02-17 18:22:15','2025-02-17 18:22:15','1970-01-01 08:00:00'),(529,'2025021718221476946d1','2025021718221476946d1',0,21,'XinShouGift',999048,'1111111',31,12,2,'','2025-02-17 18:22:15','2025-02-17 18:22:15','1970-01-01 08:00:00'),(530,'202502171822149510c00','202502171822149510c00',0,21,'XinShouGift',999048,'1111111',31,12,2,'','2025-02-17 18:22:15','2025-02-17 18:22:15','1970-01-01 08:00:00'),(531,'20250217182215126fac7','20250217182215126fac7',0,21,'XinShouGift',999048,'1111111',31,12,2,'','2025-02-17 18:22:15','2025-02-17 18:22:15','1970-01-01 08:00:00');
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `player0`
--

DROP TABLE IF EXISTS `player0`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player0`
--

LOCK TABLES `player0` WRITE;
/*!40000 ALTER TABLE `player0` DISABLE KEYS */;
INSERT INTO `player0` VALUES (0,'1aaaa',30,-1,0,'2025-02-17 17:30:13','2025-02-17 17:39:57','2025-02-17 17:30:13',0,0,0,0,'修真者:30',100401,100402,0);
/*!40000 ALTER TABLE `player0` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `player1`
--

DROP TABLE IF EXISTS `player1`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player1`
--

LOCK TABLES `player1` WRITE;
/*!40000 ALTER TABLE `player1` DISABLE KEYS */;
INSERT INTO `player1` VALUES (0,'111111',1,-1,0,'2025-02-17 17:01:55','2025-02-18 01:18:50','2025-02-17 17:01:55',0,0,0,0,'修真者:1',100401,100402,0),(0,'1111111',31,-1,0,'2025-02-17 18:04:08','2025-02-17 18:04:08','2025-02-17 18:04:08',0,0,0,0,'修真者:31',100401,100402,0);
/*!40000 ALTER TABLE `player1` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `player10`
--

DROP TABLE IF EXISTS `player10`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player10`
--

LOCK TABLES `player10` WRITE;
/*!40000 ALTER TABLE `player10` DISABLE KEYS */;
/*!40000 ALTER TABLE `player10` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `player11`
--

DROP TABLE IF EXISTS `player11`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player11`
--

LOCK TABLES `player11` WRITE;
/*!40000 ALTER TABLE `player11` DISABLE KEYS */;
/*!40000 ALTER TABLE `player11` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `player12`
--

DROP TABLE IF EXISTS `player12`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player12`
--

LOCK TABLES `player12` WRITE;
/*!40000 ALTER TABLE `player12` DISABLE KEYS */;
/*!40000 ALTER TABLE `player12` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `player13`
--

DROP TABLE IF EXISTS `player13`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player13`
--

LOCK TABLES `player13` WRITE;
/*!40000 ALTER TABLE `player13` DISABLE KEYS */;
/*!40000 ALTER TABLE `player13` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `player14`
--

DROP TABLE IF EXISTS `player14`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player14`
--

LOCK TABLES `player14` WRITE;
/*!40000 ALTER TABLE `player14` DISABLE KEYS */;
/*!40000 ALTER TABLE `player14` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `player15`
--

DROP TABLE IF EXISTS `player15`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player15`
--

LOCK TABLES `player15` WRITE;
/*!40000 ALTER TABLE `player15` DISABLE KEYS */;
/*!40000 ALTER TABLE `player15` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `player16`
--

DROP TABLE IF EXISTS `player16`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player16`
--

LOCK TABLES `player16` WRITE;
/*!40000 ALTER TABLE `player16` DISABLE KEYS */;
/*!40000 ALTER TABLE `player16` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `player17`
--

DROP TABLE IF EXISTS `player17`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player17`
--

LOCK TABLES `player17` WRITE;
/*!40000 ALTER TABLE `player17` DISABLE KEYS */;
/*!40000 ALTER TABLE `player17` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `player18`
--

DROP TABLE IF EXISTS `player18`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player18`
--

LOCK TABLES `player18` WRITE;
/*!40000 ALTER TABLE `player18` DISABLE KEYS */;
/*!40000 ALTER TABLE `player18` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `player19`
--

DROP TABLE IF EXISTS `player19`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player19`
--

LOCK TABLES `player19` WRITE;
/*!40000 ALTER TABLE `player19` DISABLE KEYS */;
/*!40000 ALTER TABLE `player19` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `player2`
--

DROP TABLE IF EXISTS `player2`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player2`
--

LOCK TABLES `player2` WRITE;
/*!40000 ALTER TABLE `player2` DISABLE KEYS */;
INSERT INTO `player2` VALUES (0,'1111112',2,-1,0,'2025-02-17 17:16:49','2025-02-17 18:03:33','2025-02-17 17:16:49',0,0,0,0,'修真者:2',100401,100402,0),(0,'222222',42,-1,0,'2025-02-18 01:20:13','2025-02-18 01:32:00','2025-02-18 01:20:13',0,0,0,0,'修真者:42',100401,100402,0);
/*!40000 ALTER TABLE `player2` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `player3`
--

DROP TABLE IF EXISTS `player3`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player3`
--

LOCK TABLES `player3` WRITE;
/*!40000 ALTER TABLE `player3` DISABLE KEYS */;
INSERT INTO `player3` VALUES (0,'1111113',13,-1,0,'2025-02-17 17:26:59','2025-02-17 17:54:13','2025-02-17 17:26:59',0,0,0,0,'修真者:13',100401,100402,0),(0,'11111133',23,-1,0,'2025-02-17 17:27:23','2025-02-17 17:32:22','2025-02-17 17:27:23',0,0,0,0,'修真者:23',100401,100402,0),(0,'111113',3,-1,0,'2025-02-17 17:25:50','2025-02-17 17:25:50','2025-02-17 17:25:50',0,0,0,0,'修真者:3',100401,100402,0);
/*!40000 ALTER TABLE `player3` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `player4`
--

DROP TABLE IF EXISTS `player4`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player4`
--

LOCK TABLES `player4` WRITE;
/*!40000 ALTER TABLE `player4` DISABLE KEYS */;
/*!40000 ALTER TABLE `player4` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `player5`
--

DROP TABLE IF EXISTS `player5`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player5`
--

LOCK TABLES `player5` WRITE;
/*!40000 ALTER TABLE `player5` DISABLE KEYS */;
/*!40000 ALTER TABLE `player5` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `player6`
--

DROP TABLE IF EXISTS `player6`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player6`
--

LOCK TABLES `player6` WRITE;
/*!40000 ALTER TABLE `player6` DISABLE KEYS */;
INSERT INTO `player6` VALUES (0,'123456',36,-1,0,'2025-02-18 00:47:21','2025-02-18 00:47:21','2025-02-18 00:47:21',0,0,0,0,'修真者:36',100401,100402,0),(0,'aaaa123456',46,-1,0,'2025-02-18 03:11:31','2025-02-18 03:30:03','2025-02-18 03:11:31',0,0,0,0,'修真者:46',100401,100402,0);
/*!40000 ALTER TABLE `player6` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `player7`
--

DROP TABLE IF EXISTS `player7`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player7`
--

LOCK TABLES `player7` WRITE;
/*!40000 ALTER TABLE `player7` DISABLE KEYS */;
/*!40000 ALTER TABLE `player7` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `player8`
--

DROP TABLE IF EXISTS `player8`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player8`
--

LOCK TABLES `player8` WRITE;
/*!40000 ALTER TABLE `player8` DISABLE KEYS */;
/*!40000 ALTER TABLE `player8` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `player9`
--

DROP TABLE IF EXISTS `player9`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player9`
--

LOCK TABLES `player9` WRITE;
/*!40000 ALTER TABLE `player9` DISABLE KEYS */;
/*!40000 ALTER TABLE `player9` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recyclerole`
--

DROP TABLE IF EXISTS `recyclerole`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recyclerole` (
  `roleId` bigint NOT NULL COMMENT 'ID',
  `platform` int DEFAULT NULL COMMENT '平台标识',
  `code` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '账户',
  `time` datetime DEFAULT NULL COMMENT '时间',
  `status` tinyint(1) DEFAULT NULL COMMENT '状态(0未重新使用,1已重新使用)',
  PRIMARY KEY (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='定期检查N久没登录的角色Id回收保存在这表里，分配给新玩家';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recyclerole`
--

LOCK TABLES `recyclerole` WRITE;
/*!40000 ALTER TABLE `recyclerole` DISABLE KEYS */;
/*!40000 ALTER TABLE `recyclerole` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servernode`
--

DROP TABLE IF EXISTS `servernode`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servernode`
--

LOCK TABLES `servernode` WRITE;
/*!40000 ALTER TABLE `servernode` DISABLE KEYS */;
INSERT INTO `servernode` VALUES (1,1,'一区','127.0.0.1',9506,'127.0.0.1',9506),(2,2,'一区','127.0.0.1',9506,'127.0.0.1',9506),(3,3,'一区','127.0.0.1',9506,'127.0.0.1',9506),(4,4,'一区','127.0.0.1',9506,'127.0.0.1',9506),(5,5,'一区','127.0.0.1',9506,'127.0.0.1',9506),(6,6,'一区','127.0.0.1',9506,'127.0.0.1',9506),(7,7,'一区','127.0.0.1',9506,'127.0.0.1',9506),(8,8,'一区','127.0.0.1',9506,'127.0.0.1',9506),(9,9,'一区','127.0.0.1',9506,'127.0.0.1',9506),(10,10,'一区','127.0.0.1',9506,'127.0.0.1',9506),(11,11,'一区','127.0.0.1',9506,'127.0.0.1',9506),(12,12,'一区','127.0.0.1',9506,'127.0.0.1',9506),(13,13,'一区','127.0.0.1',9506,'127.0.0.1',9506),(14,14,'一区','127.0.0.1',9506,'127.0.0.1',9506),(15,15,'一区','127.0.0.1',9506,'127.0.0.1',9506),(16,16,'一区','127.0.0.1',9506,'127.0.0.1',9506),(17,17,'一区','127.0.0.1',9506,'127.0.0.1',9506),(18,18,'一区','127.0.0.1',9506,'127.0.0.1',9506),(19,19,'一区','127.0.0.1',9506,'127.0.0.1',9506),(20,0,'一区','127.0.0.1',9506,'127.0.0.1',9506);
/*!40000 ALTER TABLE `servernode` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sysconfig`
--

DROP TABLE IF EXISTS `sysconfig`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sysconfig` (
  `key` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '键',
  `value` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '值',
  `description` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '描述',
  PRIMARY KEY (`key`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sysconfig`
--

LOCK TABLES `sysconfig` WRITE;
/*!40000 ALTER TABLE `sysconfig` DISABLE KEYS */;
INSERT INTO `sysconfig` VALUES ('startDate','1739770222','3');
/*!40000 ALTER TABLE `sysconfig` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'blcx_center'
--

--
-- Dumping routines for database 'blcx_center'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-18 22:56:47
