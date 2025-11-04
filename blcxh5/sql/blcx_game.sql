-- MySQL dump 10.13  Distrib 8.0.24, for Linux (x86_64)
--
-- Host: localhost    Database: blcx_game
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
-- Table structure for table `buysta`
--

DROP TABLE IF EXISTS `buysta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `buysta` (
  `roleId` bigint NOT NULL COMMENT '角色id',
  `buyState` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '购买状态(Class:Map<Integer,Integer>)',
  `time` datetime NOT NULL COMMENT '重置时间',
  PRIMARY KEY (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buysta`
--

LOCK TABLES `buysta` WRITE;
/*!40000 ALTER TABLE `buysta` DISABLE KEYS */;
INSERT INTO `buysta` VALUES (1,'{\"1\":0,\"2\":0}','2025-02-18 01:17:02'),(2,'{\"1\":0,\"2\":0}','2025-02-17 18:03:35'),(13,'{\"1\":0,\"2\":0}','2025-02-17 17:54:14'),(31,'{\"1\":0,\"2\":0}','2025-02-17 18:04:12'),(36,'{\"1\":0,\"2\":0}','2025-02-18 00:47:23'),(42,'{\"1\":0,\"2\":0}','2025-02-18 01:20:14'),(46,'{\"1\":0,\"2\":0}','2025-02-18 03:11:33');
/*!40000 ALTER TABLE `buysta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `card`
--

DROP TABLE IF EXISTS `card`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `card` (
  `roleId` bigint NOT NULL COMMENT '角色时间',
  `resId` int NOT NULL COMMENT '普通或高级月卡',
  `activationState` int NOT NULL COMMENT '激活状态',
  `rewardState` int NOT NULL COMMENT '领取状态',
  `time` datetime NOT NULL COMMENT '到期时间',
  `rewardTime` datetime DEFAULT NULL COMMENT '领奖时间',
  PRIMARY KEY (`roleId`,`resId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `card`
--

LOCK TABLES `card` WRITE;
/*!40000 ALTER TABLE `card` DISABLE KEYS */;
/*!40000 ALTER TABLE `card` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chapter`
--

DROP TABLE IF EXISTS `chapter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chapter`
--

LOCK TABLES `chapter` WRITE;
/*!40000 ALTER TABLE `chapter` DISABLE KEYS */;
INSERT INTO `chapter` VALUES (1,101,2,0,'{\"1001\":0,\"1002\":0,\"1003\":0}',0,0),(2,101,2,0,'{\"1001\":0,\"1002\":0,\"1003\":0}',0,0),(13,101,2,0,'{\"1001\":0,\"1002\":0,\"1003\":0}',0,0),(31,101,1,241,'{\"1001\":2,\"1002\":1,\"1003\":1}',0,1),(36,101,2,0,'{\"1001\":0,\"1002\":0,\"1003\":0}',0,0),(42,101,2,0,'{\"1001\":0,\"1002\":0,\"1003\":0}',0,0),(46,101,1,241,'{\"1001\":2,\"1002\":2,\"1003\":2}',0,1),(31,102,2,0,'{\"1004\":0}',0,0),(46,102,2,0,'{\"1004\":0}',0,0),(31,201,2,0,'{\"1011\":0,\"1012\":0,\"1013\":0}',0,0),(46,201,2,149,'{\"1011\":2,\"1012\":0,\"1013\":0}',0,1);
/*!40000 ALTER TABLE `chapter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientopenani`
--

DROP TABLE IF EXISTS `clientopenani`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientopenani` (
  `roleId` bigint unsigned NOT NULL COMMENT '角色id',
  `alreadyPlay` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '客户端已经播放动画的功能记录(Class:Set<Integer>)',
  PRIMARY KEY (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT=' 客户端功能开发动画记录';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientopenani`
--

LOCK TABLES `clientopenani` WRITE;
/*!40000 ALTER TABLE `clientopenani` DISABLE KEYS */;
INSERT INTO `clientopenani` VALUES (1,'[]'),(2,'[]'),(13,'[]'),(31,'[1,2,19,5,7]'),(36,'[]'),(42,'[1,7]'),(46,'[1,2,19,5,7]');
/*!40000 ALTER TABLE `clientopenani` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `code`
--

DROP TABLE IF EXISTS `code`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `code` (
  `id` bigint NOT NULL COMMENT 'id',
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `code` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '礼包码',
  `useTime` datetime NOT NULL COMMENT '使用时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `code`
--

LOCK TABLES `code` WRITE;
/*!40000 ALTER TABLE `code` DISABLE KEYS */;
/*!40000 ALTER TABLE `code` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equip`
--

DROP TABLE IF EXISTS `equip`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equip`
--

LOCK TABLES `equip` WRITE;
/*!40000 ALTER TABLE `equip` DISABLE KEYS */;
INSERT INTO `equip` VALUES (1,31,201500,4,0,1,1),(2,31,206500,4,0,1,1),(3,31,203200,4,0,1,1),(4,31,202500,4,0,1,1),(5,31,205500,4,0,1,1),(6,31,204200,4,0,1,1),(7,31,206300,4,0,1,1),(8,31,201300,2,0,1,1),(9,31,204200,2,0,1,1),(10,31,203100,2,0,1,1),(11,31,202300,2,0,1,1),(12,31,205300,2,0,1,1),(13,31,204300,2,0,1,1),(14,31,206100,2,0,1,1),(15,31,202300,5,0,1,1),(16,31,201400,5,0,1,1),(17,31,204400,5,0,1,1),(18,31,203400,5,0,1,1),(19,31,202400,5,0,1,1),(20,31,205400,5,0,1,1),(21,31,204200,5,0,1,1),(22,31,206100,5,0,1,1),(23,31,201100,3,0,1,1),(24,31,201200,3,0,1,1),(25,31,201300,3,0,1,1),(26,31,201400,3,0,1,1),(27,31,201500,3,0,1,1),(28,31,205200,3,0,1,1),(29,31,202100,3,0,1,1),(30,31,202200,3,0,1,1),(31,31,202300,3,0,1,1),(32,31,202400,3,0,1,1),(33,31,202500,3,0,1,1),(34,31,203100,3,0,1,1),(35,31,203200,3,0,1,1),(36,31,203300,3,0,1,1),(37,31,203400,3,0,1,1),(38,31,203500,3,0,1,1),(39,31,204100,3,0,1,1),(40,31,204200,3,0,1,1),(41,31,204300,3,0,1,1),(42,31,204400,3,0,1,1),(43,31,204500,3,0,1,1),(44,31,205100,3,0,1,1),(45,31,205300,3,0,1,1),(46,31,205400,3,0,1,1),(47,31,205500,3,0,1,1),(48,31,206100,3,0,1,1),(49,31,206200,3,0,1,1),(50,31,206300,3,0,1,1),(51,31,206400,3,0,1,1),(52,31,206500,3,0,1,1),(53,31,203300,3,0,1,1),(54,31,202500,3,0,1,1),(55,31,205300,3,0,1,1),(56,31,204100,3,0,1,1),(57,31,206400,3,0,1,1),(58,31,205600,4,0,1,1),(59,31,206600,4,0,1,1),(60,31,203500,1,0,1,1),(61,31,201600,1,0,1,1),(62,31,203200,1,0,1,1),(63,31,206400,1,0,1,1),(64,31,202500,1,0,1,1),(65,31,204100,1,0,1,1),(66,31,203400,1,0,1,1),(67,31,206600,1,0,1,1),(68,31,201100,1,0,1,1),(69,31,204300,1,0,1,1),(70,31,203600,1,0,1,1),(71,31,205200,1,0,1,1),(72,31,201300,1,0,1,1),(73,31,204500,1,0,1,1),(74,31,206100,1,0,1,1),(75,31,202200,1,0,1,1),(76,31,205400,1,0,1,1),(77,31,201500,1,0,1,1),(78,31,203100,1,0,1,1),(79,31,206300,1,0,1,1),(80,31,202400,1,0,1,1),(81,31,205600,1,0,1,1),(82,31,201700,1,0,1,1),(83,31,203300,1,0,1,1),(84,31,206500,1,0,1,1),(85,31,202600,1,0,1,1),(86,31,204200,1,0,1,1),(87,31,203500,1,0,1,1),(88,31,205100,1,0,1,1),(89,31,201200,1,0,1,1),(90,31,204400,1,0,1,1),(91,31,202100,1,0,1,1),(92,31,205300,1,0,1,1),(93,31,201400,1,0,1,1),(94,31,204600,1,0,1,1),(95,31,206200,1,0,1,1),(96,31,202300,1,0,1,1),(97,31,205500,1,0,1,1),(98,31,201500,4,0,1,1),(99,31,202200,4,0,1,1),(100,31,203300,4,0,1,1),(101,31,202100,4,0,1,1),(102,31,205300,4,0,1,1),(103,31,204100,4,0,1,1),(104,31,206200,4,0,1,1),(105,31,201200,2,0,1,1),(106,31,206200,2,0,1,1),(107,31,203500,2,0,1,1),(108,31,202500,2,0,1,1),(109,31,205100,2,0,1,1),(110,31,204300,2,0,1,1),(111,31,206100,2,0,1,1),(112,31,202500,5,0,1,1),(113,31,201200,5,0,1,1),(114,31,204300,5,0,1,1),(115,31,203500,5,0,1,1),(116,31,202300,5,0,1,1),(117,31,205500,5,0,1,1),(118,31,204300,5,0,1,1),(119,31,206500,5,0,1,1),(120,31,201100,3,0,1,1),(121,31,201200,3,0,1,1),(122,31,201300,3,0,1,1),(123,31,201400,3,0,1,1),(124,31,201500,3,0,1,1),(125,31,205200,3,0,1,1),(126,31,202100,3,0,1,1),(127,31,202200,3,0,1,1),(128,31,202300,3,0,1,1),(129,31,202400,3,0,1,1),(130,31,202500,3,0,1,1),(131,31,203100,3,0,1,1),(132,31,203200,3,0,1,1),(133,31,203300,3,0,1,1),(134,31,203400,3,0,1,1),(135,31,203500,3,0,1,1),(136,31,204100,3,0,1,1),(137,31,204200,3,0,1,1),(138,31,204300,3,0,1,1),(139,31,204400,3,0,1,1),(140,31,204500,3,0,1,1),(141,31,205100,3,0,1,1),(142,31,205300,3,0,1,1),(143,31,205400,3,0,1,1),(144,31,205500,3,0,1,1),(145,31,206100,3,0,1,1),(146,31,206200,3,0,1,1),(147,31,206300,3,0,1,1),(148,31,206400,3,0,1,1),(149,31,206500,3,0,1,1),(150,31,203100,3,0,1,1),(151,31,202400,3,0,1,1),(152,31,205400,3,0,1,1),(153,31,204200,3,0,1,1),(154,31,206500,3,0,1,1),(155,31,204600,4,0,1,1),(156,31,206600,4,0,1,1),(157,31,203400,1,0,1,1),(158,31,201600,1,0,1,1),(159,31,203200,1,0,1,1),(160,31,206400,1,0,1,1),(161,31,202500,1,0,1,1),(162,31,204100,1,0,1,1),(163,31,203400,1,0,1,1),(164,31,206600,1,0,1,1),(165,31,201100,1,0,1,1),(166,31,204300,1,0,1,1),(167,31,203600,1,0,1,1),(168,31,205200,1,0,1,1),(169,31,201300,1,0,1,1),(170,31,204500,1,0,1,1),(171,31,206100,1,0,1,1),(172,31,202200,1,0,1,1),(173,31,205400,1,0,1,1),(174,31,201500,1,0,1,1),(175,31,203100,1,0,1,1),(176,31,206300,1,0,1,1),(177,31,202400,1,0,1,1),(178,31,205600,1,0,1,1),(179,31,201700,1,0,1,1),(180,31,203300,1,0,1,1),(181,31,206500,1,0,1,1),(182,31,202600,1,0,1,1),(183,31,204200,1,0,1,1),(184,31,203500,1,0,1,1),(185,31,205100,1,0,1,1),(186,31,201200,1,0,1,1),(187,31,204400,1,0,1,1),(188,31,202100,1,0,1,1),(189,31,205300,1,0,1,1),(190,31,201400,1,0,1,1),(191,31,204600,1,0,1,1),(192,31,206200,1,0,1,1),(193,31,202300,1,0,1,1),(194,31,205500,1,0,1,1),(195,31,202100,2,0,1,1),(196,31,203100,1,0,1,1),(197,31,202300,1,0,1,1),(198,31,203300,4,0,1,1),(199,31,201200,2,0,1,1),(200,31,206400,2,0,1,1),(201,31,201100,1,0,1,1),(202,42,201400,4,0,1,1),(203,42,203300,4,0,1,1),(204,42,203200,4,0,1,1),(205,42,202400,4,0,1,1),(206,42,205300,4,0,1,1),(207,42,204100,4,0,1,1),(208,42,206100,4,0,1,1),(209,42,201400,2,0,1,1),(210,42,202300,2,0,1,1),(211,42,203100,2,0,1,1),(212,42,202100,2,0,1,1),(213,42,205300,2,0,1,1),(214,42,204500,2,0,1,1),(215,42,206200,2,0,1,1),(216,42,204200,5,0,1,1),(217,42,201200,5,0,1,1),(218,42,206300,5,0,1,1),(219,42,203200,5,0,1,1),(220,42,202400,5,0,1,1),(221,42,205100,5,0,1,1),(222,42,204400,5,0,1,1),(223,42,206300,5,0,1,1),(224,42,201100,3,0,1,1),(225,42,201200,3,0,1,1),(226,42,201300,3,0,1,1),(227,42,201400,3,0,1,1),(228,42,201500,3,0,1,1),(229,42,205200,3,0,1,1),(230,42,202100,3,0,1,1),(231,42,202200,3,0,1,1),(232,42,202300,3,0,1,1),(233,42,202400,3,0,1,1),(234,42,202500,3,0,1,1),(235,42,203100,3,0,1,1),(236,42,203200,3,0,1,1),(237,42,203300,3,0,1,1),(238,42,203400,3,0,1,1),(239,42,203500,3,0,1,1),(240,42,204100,3,0,1,1),(241,42,204200,3,0,1,1),(242,42,204300,3,0,1,1),(243,42,204400,3,0,1,1),(244,42,204500,3,0,1,1),(245,42,205100,3,0,1,1),(246,42,205300,3,0,1,1),(247,42,205400,3,0,1,1),(248,42,205500,3,0,1,1),(249,42,206100,3,0,1,1),(250,42,206200,3,0,1,1),(251,42,206300,3,0,1,1),(252,42,206400,3,0,1,1),(253,42,206500,3,0,1,1),(254,42,203500,3,0,1,1),(255,42,202100,3,0,1,1),(256,42,205400,3,0,1,1),(257,42,204400,3,0,1,1),(258,42,206400,3,0,1,1),(259,42,203600,4,0,1,1),(260,42,202600,4,0,1,1),(261,42,201200,1,0,1,1),(262,42,201500,4,0,1,1),(263,42,204100,4,0,1,1),(264,42,203300,4,0,1,1),(265,42,202100,4,0,1,1),(266,42,205100,4,0,1,1),(267,42,204400,4,0,1,1),(268,42,206200,4,0,1,1),(269,42,201500,2,0,1,1),(270,42,206100,2,0,1,1),(271,42,203100,2,0,1,1),(272,42,202500,2,0,1,1),(273,42,205100,2,0,1,1),(274,42,204500,2,0,1,1),(275,42,206100,2,0,1,1),(276,42,204400,5,0,1,1),(277,42,201500,5,0,1,1),(278,42,204300,5,0,1,1),(279,42,203500,5,0,1,1),(280,42,202500,5,0,1,1),(281,42,205100,5,0,1,1),(282,42,204500,5,0,1,1),(283,42,206500,5,0,1,1),(284,42,201100,3,0,1,1),(285,42,201200,3,0,1,1),(286,42,201300,3,0,1,1),(287,42,201400,3,0,1,1),(288,42,201500,3,0,1,1),(289,42,205200,3,0,1,1),(290,42,202100,3,0,1,1),(291,42,202200,3,0,1,1),(292,42,202300,3,0,1,1),(293,42,202400,3,0,1,1),(294,42,202500,3,0,1,1),(295,42,203100,3,0,1,1),(296,42,203200,3,0,1,1),(297,42,203300,3,0,1,1),(298,42,203400,3,0,1,1),(299,42,203500,3,0,1,1),(300,42,204100,3,0,1,1),(301,42,204200,3,0,1,1),(302,42,204300,3,0,1,1),(303,42,204400,3,0,1,1),(304,42,204500,3,0,1,1),(305,42,205100,3,0,1,1),(306,42,205300,3,0,1,1),(307,42,205400,3,0,1,1),(308,42,205500,3,0,1,1),(309,42,206100,3,0,1,1),(310,42,206200,3,0,1,1),(311,42,206300,3,0,1,1),(312,42,206400,3,0,1,1),(313,42,206500,3,0,1,1),(314,42,203100,3,0,1,1),(315,42,202300,3,0,1,1),(316,42,205100,3,0,1,1),(317,42,204300,3,0,1,1),(318,42,206200,3,0,1,1),(319,42,202600,4,0,1,1),(320,42,204600,4,0,1,1),(321,42,202400,1,0,1,1),(322,42,203300,4,0,1,1),(323,42,201200,2,0,1,1),(324,46,202200,1,0,1,1),(325,46,202100,2,0,4,1),(326,46,203100,1,0,3,1);
/*!40000 ALTER TABLE `equip` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `everydaysign`
--

DROP TABLE IF EXISTS `everydaysign`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `everydaysign` (
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `signDays` int NOT NULL COMMENT '签到天数',
  `rewardState` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '领取状态(Class:Map<Integer,Integer>)',
  `signTime` datetime DEFAULT NULL COMMENT '上次签到时间',
  `rewardDay` int DEFAULT NULL COMMENT '上次领取宝箱天数',
  PRIMARY KEY (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `everydaysign`
--

LOCK TABLES `everydaysign` WRITE;
/*!40000 ALTER TABLE `everydaysign` DISABLE KEYS */;
INSERT INTO `everydaysign` VALUES (1,0,'{\"2\":0,\"4\":0,\"6\":0,\"8\":0,\"10\":0}','1970-01-01 08:00:00',0),(2,0,'{\"2\":0,\"4\":0,\"6\":0,\"8\":0,\"10\":0}','1970-01-01 08:00:00',0),(13,0,'{\"2\":0,\"4\":0,\"6\":0,\"8\":0,\"10\":0}','1970-01-01 08:00:00',0),(31,0,'{\"2\":0,\"4\":0,\"6\":0,\"8\":0,\"10\":0}','1970-01-01 08:00:00',0),(36,0,'{\"2\":0,\"4\":0,\"6\":0,\"8\":0,\"10\":0}','1970-01-01 08:00:00',0),(42,0,'{\"2\":0,\"4\":0,\"6\":0,\"8\":0,\"10\":0}','1970-01-01 08:00:00',0),(46,0,'{\"2\":0,\"4\":0,\"6\":0,\"8\":0,\"10\":0}','1970-01-01 08:00:00',0);
/*!40000 ALTER TABLE `everydaysign` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `friend`
--

DROP TABLE IF EXISTS `friend`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friend`
--

LOCK TABLES `friend` WRITE;
/*!40000 ALTER TABLE `friend` DISABLE KEYS */;
/*!40000 ALTER TABLE `friend` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `friendlist`
--

DROP TABLE IF EXISTS `friendlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friendlist`
--

LOCK TABLES `friendlist` WRITE;
/*!40000 ALTER TABLE `friendlist` DISABLE KEYS */;
INSERT INTO `friendlist` VALUES (1,'[]','[]','[]','[]',0,1739812621549,0,1739812621549),(2,'[]','[]','[]','[]',0,1739786614865,0,1739786614865),(13,'[]','[]','[]','[]',0,1739786054012,0,1739786054012),(31,'[]','[]','[]','[]',0,1739786652092,0,1739786652092),(36,'[]','[]','[]','[]',0,1739810843024,0,1739810843024),(42,'[]','[]','[]','[]',0,1739812813846,0,1739812813846),(46,'[]','[]','[]','[]',0,1739819492959,0,1739819492959);
/*!40000 ALTER TABLE `friendlist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fuben`
--

DROP TABLE IF EXISTS `fuben`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fuben` (
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `resId` bigint NOT NULL COMMENT '副本Id',
  `info` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '副本信息(Class:com.xkhy.blcx.service.fuben.res.FuBenRes)',
  `time` datetime DEFAULT NULL COMMENT '生成时间',
  PRIMARY KEY (`roleId`,`resId`) USING BTREE,
  KEY `roleId` (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fuben`
--

LOCK TABLES `fuben` WRITE;
/*!40000 ALTER TABLE `fuben` DISABLE KEYS */;
INSERT INTO `fuben` VALUES (1,1001,'{\"resId\":1001,\"type\":2,\"level\":1,\"buyTime\":0,\"enterCount\":0,\"freeTime\":2,\"bestPoint\":0,\"rewardState\":null}','2025-02-18 01:17:02'),(1,2001,'{\"resId\":2001,\"type\":3,\"level\":1,\"buyTime\":2,\"enterCount\":0,\"freeTime\":2,\"bestPoint\":0,\"rewardState\":{\"10010\":0,\"10011\":0,\"10012\":0}}','2025-02-18 01:17:02'),(1,2002,'{\"resId\":2002,\"type\":3,\"level\":1,\"buyTime\":2,\"enterCount\":0,\"freeTime\":2,\"bestPoint\":0,\"rewardState\":{\"10013\":0,\"10014\":0,\"10015\":0}}','2025-02-17 17:06:07'),(2,1001,'{\"resId\":1001,\"type\":2,\"level\":1,\"buyTime\":0,\"enterCount\":0,\"freeTime\":2,\"bestPoint\":0,\"rewardState\":null}','2025-02-17 18:03:35'),(2,2002,'{\"resId\":2002,\"type\":3,\"level\":1,\"buyTime\":2,\"enterCount\":0,\"freeTime\":2,\"bestPoint\":0,\"rewardState\":{\"10013\":0,\"10014\":0,\"10015\":0}}','2025-02-17 18:03:35'),(13,1001,'{\"resId\":1001,\"type\":2,\"level\":1,\"buyTime\":0,\"enterCount\":0,\"freeTime\":2,\"bestPoint\":0,\"rewardState\":null}','2025-02-17 17:54:14'),(13,2002,'{\"resId\":2002,\"type\":3,\"level\":1,\"buyTime\":2,\"enterCount\":0,\"freeTime\":2,\"bestPoint\":0,\"rewardState\":{\"10013\":0,\"10014\":0,\"10015\":0}}','2025-02-17 17:54:14'),(31,1001,'{\"resId\":1001,\"type\":2,\"level\":1,\"buyTime\":0,\"enterCount\":0,\"freeTime\":2,\"bestPoint\":0,\"rewardState\":null}','2025-02-17 18:04:12'),(31,2002,'{\"resId\":2002,\"type\":3,\"level\":1,\"buyTime\":2,\"enterCount\":0,\"freeTime\":2,\"bestPoint\":0,\"rewardState\":{\"10013\":0,\"10014\":0,\"10015\":0}}','2025-02-17 18:04:12'),(36,1001,'{\"resId\":1001,\"type\":2,\"level\":1,\"buyTime\":0,\"enterCount\":0,\"freeTime\":2,\"bestPoint\":0,\"rewardState\":null}','2025-02-18 00:47:23'),(36,2001,'{\"resId\":2001,\"type\":3,\"level\":1,\"buyTime\":2,\"enterCount\":0,\"freeTime\":2,\"bestPoint\":0,\"rewardState\":{\"10010\":0,\"10011\":0,\"10012\":0}}','2025-02-18 00:47:23'),(42,1001,'{\"resId\":1001,\"type\":2,\"level\":1,\"buyTime\":0,\"enterCount\":0,\"freeTime\":2,\"bestPoint\":0,\"rewardState\":null}','2025-02-18 01:20:14'),(42,2001,'{\"resId\":2001,\"type\":3,\"level\":1,\"buyTime\":2,\"enterCount\":0,\"freeTime\":2,\"bestPoint\":0,\"rewardState\":{\"10010\":0,\"10011\":0,\"10012\":0}}','2025-02-18 01:20:14'),(46,1001,'{\"resId\":1001,\"type\":2,\"level\":1,\"buyTime\":0,\"enterCount\":0,\"freeTime\":2,\"bestPoint\":0,\"rewardState\":null}','2025-02-18 03:11:33'),(46,2001,'{\"resId\":2001,\"type\":3,\"level\":1,\"buyTime\":2,\"enterCount\":0,\"freeTime\":2,\"bestPoint\":0,\"rewardState\":{\"10010\":0,\"10011\":0,\"10012\":0}}','2025-02-18 03:11:33');
/*!40000 ALTER TABLE `fuben` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fund`
--

DROP TABLE IF EXISTS `fund`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fund` (
  `roleId` bigint NOT NULL COMMENT '角色id',
  `id` bigint NOT NULL COMMENT '基金id',
  `buyState` int NOT NULL COMMENT '激活状态',
  `rewardState` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '奖励状态(Class:Map<Long,Integer>)',
  PRIMARY KEY (`roleId`,`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fund`
--

LOCK TABLES `fund` WRITE;
/*!40000 ALTER TABLE `fund` DISABLE KEYS */;
INSERT INTO `fund` VALUES (1,1001,1,'{\"11041\":0,\"11011\":0,\"11091\":0,\"11061\":0,\"11031\":0,\"11111\":0,\"11081\":0,\"11051\":0,\"11021\":0,\"11101\":0,\"11071\":0}'),(1,1002,0,'{\"11072\":0,\"11042\":0,\"11012\":0,\"11092\":0,\"11062\":0,\"11032\":0,\"11112\":0,\"11082\":0,\"11052\":0,\"11022\":0,\"11102\":0}'),(1,1003,0,'{\"11073\":0,\"11043\":0,\"11013\":0,\"11093\":0,\"11063\":0,\"11033\":0,\"11113\":0,\"11083\":0,\"11053\":0,\"11023\":0,\"11103\":0}'),(1,2001,1,'{\"12081\":0,\"12051\":0,\"12101\":0,\"12021\":0,\"12071\":0,\"12041\":0,\"12091\":0,\"12011\":0,\"12061\":0,\"12031\":0}'),(1,2002,0,'{\"12032\":0,\"12082\":0,\"12052\":0,\"12102\":0,\"12022\":0,\"12072\":0,\"12042\":0,\"12092\":0,\"12012\":0,\"12062\":0}'),(1,2003,0,'{\"12033\":0,\"12083\":0,\"12053\":0,\"12103\":0,\"12023\":0,\"12073\":0,\"12043\":0,\"12093\":0,\"12013\":0,\"12063\":0}'),(1,3001,1,'{\"13041\":0,\"13091\":0,\"13011\":0,\"13061\":0,\"13031\":0,\"13081\":0,\"13051\":0,\"13101\":0,\"13021\":0,\"13071\":0}'),(1,3002,0,'{\"13072\":0,\"13042\":0,\"13092\":0,\"13012\":0,\"13062\":0,\"13032\":0,\"13082\":0,\"13052\":0,\"13102\":0,\"13022\":0}'),(1,3003,0,'{\"13073\":0,\"13043\":0,\"13093\":0,\"13013\":0,\"13063\":0,\"13033\":0,\"13083\":0,\"13053\":0,\"13103\":0,\"13023\":0}'),(2,1001,1,'{\"11041\":0,\"11011\":0,\"11091\":0,\"11061\":0,\"11031\":0,\"11111\":0,\"11081\":0,\"11051\":0,\"11021\":0,\"11101\":0,\"11071\":0}'),(2,1002,0,'{\"11072\":0,\"11042\":0,\"11012\":0,\"11092\":0,\"11062\":0,\"11032\":0,\"11112\":0,\"11082\":0,\"11052\":0,\"11022\":0,\"11102\":0}'),(2,1003,0,'{\"11073\":0,\"11043\":0,\"11013\":0,\"11093\":0,\"11063\":0,\"11033\":0,\"11113\":0,\"11083\":0,\"11053\":0,\"11023\":0,\"11103\":0}'),(2,2001,1,'{\"12081\":0,\"12051\":0,\"12101\":0,\"12021\":0,\"12071\":0,\"12041\":0,\"12091\":0,\"12011\":0,\"12061\":0,\"12031\":0}'),(2,2002,0,'{\"12032\":0,\"12082\":0,\"12052\":0,\"12102\":0,\"12022\":0,\"12072\":0,\"12042\":0,\"12092\":0,\"12012\":0,\"12062\":0}'),(2,2003,0,'{\"12033\":0,\"12083\":0,\"12053\":0,\"12103\":0,\"12023\":0,\"12073\":0,\"12043\":0,\"12093\":0,\"12013\":0,\"12063\":0}'),(2,3001,1,'{\"13041\":0,\"13091\":0,\"13011\":0,\"13061\":0,\"13031\":0,\"13081\":0,\"13051\":0,\"13101\":0,\"13021\":0,\"13071\":0}'),(2,3002,0,'{\"13072\":0,\"13042\":0,\"13092\":0,\"13012\":0,\"13062\":0,\"13032\":0,\"13082\":0,\"13052\":0,\"13102\":0,\"13022\":0}'),(2,3003,0,'{\"13073\":0,\"13043\":0,\"13093\":0,\"13013\":0,\"13063\":0,\"13033\":0,\"13083\":0,\"13053\":0,\"13103\":0,\"13023\":0}'),(13,1001,1,'{\"11041\":0,\"11011\":0,\"11091\":0,\"11061\":0,\"11031\":0,\"11111\":0,\"11081\":0,\"11051\":0,\"11021\":0,\"11101\":0,\"11071\":0}'),(13,1002,0,'{\"11072\":0,\"11042\":0,\"11012\":0,\"11092\":0,\"11062\":0,\"11032\":0,\"11112\":0,\"11082\":0,\"11052\":0,\"11022\":0,\"11102\":0}'),(13,1003,0,'{\"11073\":0,\"11043\":0,\"11013\":0,\"11093\":0,\"11063\":0,\"11033\":0,\"11113\":0,\"11083\":0,\"11053\":0,\"11023\":0,\"11103\":0}'),(13,2001,1,'{\"12081\":0,\"12051\":0,\"12101\":0,\"12021\":0,\"12071\":0,\"12041\":0,\"12091\":0,\"12011\":0,\"12061\":0,\"12031\":0}'),(13,2002,0,'{\"12032\":0,\"12082\":0,\"12052\":0,\"12102\":0,\"12022\":0,\"12072\":0,\"12042\":0,\"12092\":0,\"12012\":0,\"12062\":0}'),(13,2003,0,'{\"12033\":0,\"12083\":0,\"12053\":0,\"12103\":0,\"12023\":0,\"12073\":0,\"12043\":0,\"12093\":0,\"12013\":0,\"12063\":0}'),(13,3001,1,'{\"13041\":0,\"13091\":0,\"13011\":0,\"13061\":0,\"13031\":0,\"13081\":0,\"13051\":0,\"13101\":0,\"13021\":0,\"13071\":0}'),(13,3002,0,'{\"13072\":0,\"13042\":0,\"13092\":0,\"13012\":0,\"13062\":0,\"13032\":0,\"13082\":0,\"13052\":0,\"13102\":0,\"13022\":0}'),(13,3003,0,'{\"13073\":0,\"13043\":0,\"13093\":0,\"13013\":0,\"13063\":0,\"13033\":0,\"13083\":0,\"13053\":0,\"13103\":0,\"13023\":0}'),(31,1001,1,'{\"11041\":0,\"11011\":0,\"11091\":0,\"11061\":0,\"11031\":0,\"11111\":0,\"11081\":0,\"11051\":0,\"11021\":0,\"11101\":0,\"11071\":0}'),(31,1002,0,'{\"11072\":0,\"11042\":0,\"11012\":0,\"11092\":0,\"11062\":0,\"11032\":0,\"11112\":0,\"11082\":0,\"11052\":0,\"11022\":0,\"11102\":0}'),(31,1003,0,'{\"11073\":0,\"11043\":0,\"11013\":0,\"11093\":0,\"11063\":0,\"11033\":0,\"11113\":0,\"11083\":0,\"11053\":0,\"11023\":0,\"11103\":0}'),(31,2001,1,'{\"12081\":0,\"12051\":0,\"12101\":0,\"12021\":0,\"12071\":0,\"12041\":0,\"12091\":0,\"12011\":0,\"12061\":0,\"12031\":0}'),(31,2002,0,'{\"12032\":0,\"12082\":0,\"12052\":0,\"12102\":0,\"12022\":0,\"12072\":0,\"12042\":0,\"12092\":0,\"12012\":0,\"12062\":0}'),(31,2003,0,'{\"12033\":0,\"12083\":0,\"12053\":0,\"12103\":0,\"12023\":0,\"12073\":0,\"12043\":0,\"12093\":0,\"12013\":0,\"12063\":0}'),(31,3001,1,'{\"13041\":0,\"13091\":0,\"13011\":0,\"13061\":0,\"13031\":0,\"13081\":0,\"13051\":0,\"13101\":0,\"13021\":0,\"13071\":0}'),(31,3002,0,'{\"13072\":0,\"13042\":0,\"13092\":0,\"13012\":0,\"13062\":0,\"13032\":0,\"13082\":0,\"13052\":0,\"13102\":0,\"13022\":0}'),(31,3003,0,'{\"13073\":0,\"13043\":0,\"13093\":0,\"13013\":0,\"13063\":0,\"13033\":0,\"13083\":0,\"13053\":0,\"13103\":0,\"13023\":0}'),(36,1001,1,'{\"11041\":0,\"11011\":0,\"11091\":0,\"11061\":0,\"11031\":0,\"11111\":0,\"11081\":0,\"11051\":0,\"11021\":0,\"11101\":0,\"11071\":0}'),(36,1002,0,'{\"11072\":0,\"11042\":0,\"11012\":0,\"11092\":0,\"11062\":0,\"11032\":0,\"11112\":0,\"11082\":0,\"11052\":0,\"11022\":0,\"11102\":0}'),(36,1003,0,'{\"11073\":0,\"11043\":0,\"11013\":0,\"11093\":0,\"11063\":0,\"11033\":0,\"11113\":0,\"11083\":0,\"11053\":0,\"11023\":0,\"11103\":0}'),(36,2001,1,'{\"12081\":0,\"12051\":0,\"12101\":0,\"12021\":0,\"12071\":0,\"12041\":0,\"12091\":0,\"12011\":0,\"12061\":0,\"12031\":0}'),(36,2002,0,'{\"12032\":0,\"12082\":0,\"12052\":0,\"12102\":0,\"12022\":0,\"12072\":0,\"12042\":0,\"12092\":0,\"12012\":0,\"12062\":0}'),(36,2003,0,'{\"12033\":0,\"12083\":0,\"12053\":0,\"12103\":0,\"12023\":0,\"12073\":0,\"12043\":0,\"12093\":0,\"12013\":0,\"12063\":0}'),(36,3001,1,'{\"13041\":0,\"13091\":0,\"13011\":0,\"13061\":0,\"13031\":0,\"13081\":0,\"13051\":0,\"13101\":0,\"13021\":0,\"13071\":0}'),(36,3002,0,'{\"13072\":0,\"13042\":0,\"13092\":0,\"13012\":0,\"13062\":0,\"13032\":0,\"13082\":0,\"13052\":0,\"13102\":0,\"13022\":0}'),(36,3003,0,'{\"13073\":0,\"13043\":0,\"13093\":0,\"13013\":0,\"13063\":0,\"13033\":0,\"13083\":0,\"13053\":0,\"13103\":0,\"13023\":0}'),(42,1001,1,'{\"11041\":0,\"11011\":0,\"11091\":0,\"11061\":0,\"11031\":0,\"11111\":0,\"11081\":0,\"11051\":0,\"11021\":0,\"11101\":0,\"11071\":0}'),(42,1002,0,'{\"11072\":0,\"11042\":0,\"11012\":0,\"11092\":0,\"11062\":0,\"11032\":0,\"11112\":0,\"11082\":0,\"11052\":0,\"11022\":0,\"11102\":0}'),(42,1003,0,'{\"11073\":0,\"11043\":0,\"11013\":0,\"11093\":0,\"11063\":0,\"11033\":0,\"11113\":0,\"11083\":0,\"11053\":0,\"11023\":0,\"11103\":0}'),(42,2001,1,'{\"12081\":0,\"12051\":0,\"12101\":0,\"12021\":0,\"12071\":0,\"12041\":0,\"12091\":0,\"12011\":0,\"12061\":0,\"12031\":0}'),(42,2002,0,'{\"12032\":0,\"12082\":0,\"12052\":0,\"12102\":0,\"12022\":0,\"12072\":0,\"12042\":0,\"12092\":0,\"12012\":0,\"12062\":0}'),(42,2003,0,'{\"12033\":0,\"12083\":0,\"12053\":0,\"12103\":0,\"12023\":0,\"12073\":0,\"12043\":0,\"12093\":0,\"12013\":0,\"12063\":0}'),(42,3001,1,'{\"13041\":0,\"13091\":0,\"13011\":0,\"13061\":0,\"13031\":0,\"13081\":0,\"13051\":0,\"13101\":0,\"13021\":0,\"13071\":0}'),(42,3002,0,'{\"13072\":0,\"13042\":0,\"13092\":0,\"13012\":0,\"13062\":0,\"13032\":0,\"13082\":0,\"13052\":0,\"13102\":0,\"13022\":0}'),(42,3003,0,'{\"13073\":0,\"13043\":0,\"13093\":0,\"13013\":0,\"13063\":0,\"13033\":0,\"13083\":0,\"13053\":0,\"13103\":0,\"13023\":0}'),(46,1001,1,'{\"11041\":0,\"11011\":0,\"11091\":0,\"11061\":0,\"11031\":0,\"11111\":0,\"11081\":0,\"11051\":0,\"11021\":0,\"11101\":0,\"11071\":0}'),(46,1002,0,'{\"11072\":0,\"11042\":0,\"11012\":0,\"11092\":0,\"11062\":0,\"11032\":0,\"11112\":0,\"11082\":0,\"11052\":0,\"11022\":0,\"11102\":0}'),(46,1003,0,'{\"11073\":0,\"11043\":0,\"11013\":0,\"11093\":0,\"11063\":0,\"11033\":0,\"11113\":0,\"11083\":0,\"11053\":0,\"11023\":0,\"11103\":0}'),(46,2001,1,'{\"12081\":0,\"12051\":0,\"12101\":0,\"12021\":0,\"12071\":0,\"12041\":0,\"12091\":0,\"12011\":0,\"12061\":0,\"12031\":0}'),(46,2002,0,'{\"12032\":0,\"12082\":0,\"12052\":0,\"12102\":0,\"12022\":0,\"12072\":0,\"12042\":0,\"12092\":0,\"12012\":0,\"12062\":0}'),(46,2003,0,'{\"12033\":0,\"12083\":0,\"12053\":0,\"12103\":0,\"12023\":0,\"12073\":0,\"12043\":0,\"12093\":0,\"12013\":0,\"12063\":0}'),(46,3001,1,'{\"13041\":0,\"13091\":0,\"13011\":0,\"13061\":0,\"13031\":0,\"13081\":0,\"13051\":0,\"13101\":0,\"13021\":0,\"13071\":0}'),(46,3002,0,'{\"13072\":0,\"13042\":0,\"13092\":0,\"13012\":0,\"13062\":0,\"13032\":0,\"13082\":0,\"13052\":0,\"13102\":0,\"13022\":0}'),(46,3003,0,'{\"13073\":0,\"13043\":0,\"13093\":0,\"13013\":0,\"13063\":0,\"13033\":0,\"13083\":0,\"13053\":0,\"13103\":0,\"13023\":0}');
/*!40000 ALTER TABLE `fund` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gift`
--

DROP TABLE IF EXISTS `gift`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gift`
--

LOCK TABLES `gift` WRITE;
/*!40000 ALTER TABLE `gift` DISABLE KEYS */;
INSERT INTO `gift` VALUES (1,'{\"giftData\":{},\"time\":1739812621498}','{\"giftData\":{},\"time\":1739783167048}','{\"giftData\":{},\"time\":1739783167048}',0,'{\"1\":0,\"2\":0,\"4\":0,\"6\":0,\"8\":0,\"10\":0,\"12\":0,\"14\":0}','1970-01-01 08:00:00'),(2,'{\"giftData\":{},\"time\":1739786614762}','{\"giftData\":{},\"time\":1739786614762}','{\"giftData\":{},\"time\":1739786614762}',0,'{\"1\":0,\"2\":0,\"4\":0,\"6\":0,\"8\":0,\"10\":0,\"12\":0,\"14\":0}','1970-01-01 08:00:00'),(13,'{\"giftData\":{},\"time\":1739786053882}','{\"giftData\":{},\"time\":1739786053882}','{\"giftData\":{},\"time\":1739786053882}',0,'{\"1\":0,\"2\":0,\"4\":0,\"6\":0,\"8\":0,\"10\":0,\"12\":0,\"14\":0}','1970-01-01 08:00:00'),(31,'{\"giftData\":{},\"time\":1739786652004}','{\"giftData\":{},\"time\":1739786652004}','{\"giftData\":{},\"time\":1739786652004}',0,'{\"1\":0,\"2\":0,\"4\":0,\"6\":0,\"8\":0,\"10\":0,\"12\":0,\"14\":0}','1970-01-01 08:00:00'),(36,'{\"giftData\":{},\"time\":1739810842837}','{\"giftData\":{},\"time\":1739810842837}','{\"giftData\":{},\"time\":1739810842837}',0,'{\"1\":0,\"2\":0,\"4\":0,\"6\":0,\"8\":0,\"10\":0,\"12\":0,\"14\":0}','1970-01-01 08:00:00'),(42,'{\"giftData\":{},\"time\":1739812813769}','{\"giftData\":{},\"time\":1739812813769}','{\"giftData\":{},\"time\":1739812813769}',0,'{\"1\":0,\"2\":0,\"4\":0,\"6\":0,\"8\":0,\"10\":0,\"12\":0,\"14\":0}','1970-01-01 08:00:00'),(46,'{\"giftData\":{},\"time\":1739819492884}','{\"giftData\":{},\"time\":1739819492884}','{\"giftData\":{},\"time\":1739819492884}',0,'{\"1\":0,\"2\":0,\"4\":0,\"6\":0,\"8\":0,\"10\":0,\"12\":0,\"14\":0}','1970-01-01 08:00:00');
/*!40000 ALTER TABLE `gift` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guide`
--

DROP TABLE IF EXISTS `guide`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guide` (
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `guideKey` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '引导key',
  PRIMARY KEY (`roleId`,`guideKey`) USING BTREE,
  KEY `roleId` (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guide`
--

LOCK TABLES `guide` WRITE;
/*!40000 ALTER TABLE `guide` DISABLE KEYS */;
INSERT INTO `guide` VALUES (1,'1'),(1,'2'),(2,'1'),(2,'2'),(13,'1'),(31,'1'),(31,'2'),(36,'1'),(36,'2'),(42,'1'),(42,'2'),(46,'1'),(46,'2');
/*!40000 ALTER TABLE `guide` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hero`
--

DROP TABLE IF EXISTS `hero`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hero` (
  `roleId` bigint unsigned NOT NULL COMMENT '角色Id',
  `resId` bigint unsigned NOT NULL COMMENT '英雄Id',
  `level` bigint unsigned NOT NULL COMMENT '英雄等级',
  `equip` bigint DEFAULT NULL COMMENT '武器id',
  PRIMARY KEY (`roleId`,`resId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hero`
--

LOCK TABLES `hero` WRITE;
/*!40000 ALTER TABLE `hero` DISABLE KEYS */;
INSERT INTO `hero` VALUES (1,400001,1,0),(2,400001,1,0),(13,400001,1,0),(31,400001,1,0),(31,400002,1,0),(31,400003,1,0),(31,400004,1,0),(31,400006,1,0),(36,400001,1,0),(42,400001,1,0),(42,400002,1,0),(42,400003,1,0),(42,400004,1,0),(42,400006,1,0),(46,400001,1,0);
/*!40000 ALTER TABLE `hero` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `herounlock`
--

DROP TABLE IF EXISTS `herounlock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `herounlock` (
  `roleId` bigint unsigned NOT NULL COMMENT '角色Id',
  `resId` bigint unsigned NOT NULL COMMENT '任务Id',
  `count` int unsigned NOT NULL COMMENT '进度',
  `rewardState` tinyint NOT NULL COMMENT '奖励状态',
  PRIMARY KEY (`roleId`,`resId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `herounlock`
--

LOCK TABLES `herounlock` WRITE;
/*!40000 ALTER TABLE `herounlock` DISABLE KEYS */;
INSERT INTO `herounlock` VALUES (1,1,0,0),(1,2,0,0),(1,3,1,0),(1,4,0,0),(2,1,0,0),(2,2,0,0),(2,3,1,0),(2,4,0,0),(13,1,0,0),(13,2,0,0),(13,3,1,0),(13,4,0,0),(31,1,0,2),(31,2,1,0),(31,3,1,0),(31,4,1,0),(36,1,0,0),(36,2,0,0),(36,3,1,0),(36,4,0,0),(42,1,0,2),(42,2,0,0),(42,3,1,0),(42,4,0,0),(46,1,0,0),(46,2,1,0),(46,3,1,0),(46,4,1,0);
/*!40000 ALTER TABLE `herounlock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item`
--

DROP TABLE IF EXISTS `item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item` (
  `roleId` bigint unsigned NOT NULL COMMENT '角色Id',
  `resId` bigint unsigned NOT NULL COMMENT '物品Id',
  `number` int NOT NULL COMMENT '数量(Set:init)',
  PRIMARY KEY (`resId`,`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item`
--

LOCK TABLES `item` WRITE;
/*!40000 ALTER TABLE `item` DISABLE KEYS */;
INSERT INTO `item` VALUES (2,100101,1),(31,100101,5),(42,100101,6),(46,100101,2),(31,100102,2),(42,100102,2),(31,100201,1),(42,100201,2),(46,100201,1),(31,100202,2),(42,100202,2),(46,100202,1),(31,100203,1),(42,100203,2),(31,100301,4),(42,100301,2),(46,100301,1),(31,100302,2),(42,100302,2),(46,100302,1),(31,100303,5),(42,100303,2),(31,100304,2),(42,100304,3),(31,100305,2),(42,100305,3),(31,100306,2),(42,100306,2),(46,100306,1),(1,100401,4),(2,100401,1),(13,100401,1),(31,100401,3),(36,100401,1),(42,100401,3),(46,100401,1),(1,100402,4),(2,100402,1),(13,100402,1),(31,100402,3),(36,100402,1),(42,100402,3),(46,100402,1),(31,100403,2),(42,100403,2),(31,100404,2),(42,100404,2),(31,100405,2),(42,100405,2),(31,100411,2),(42,100411,2),(31,100413,2),(42,100413,2),(31,100414,2),(42,100414,2),(31,100415,2),(42,100415,2),(31,100416,2),(42,100416,2),(31,110101,2),(42,110101,2),(31,110204,2),(42,110204,2),(31,110205,2),(42,110205,2),(31,110206,2),(42,110206,2),(31,110301,2),(42,110301,2),(31,110302,2),(42,110302,2),(31,110321,2),(42,110321,2),(31,110322,2),(42,110322,2),(31,110331,2),(42,110331,2),(31,110351,2),(42,110351,2),(31,111140,2),(42,111140,2),(31,111150,2),(42,111150,2),(31,111160,2),(42,111160,2),(31,112140,2),(42,112140,2),(31,112150,2),(42,112150,2),(31,112160,2),(42,112160,2),(31,113140,2),(42,113140,2),(31,113150,2),(42,113150,2),(31,113160,2),(42,113160,2),(31,114140,2),(42,114140,2),(31,114150,2),(42,114150,2),(31,114160,2),(42,114160,2),(31,115140,2),(42,115140,2),(31,115150,2),(42,115150,2),(31,115160,2),(42,115160,2),(31,116140,2),(42,116140,2),(31,116150,2),(42,116150,2),(31,116160,2),(42,116160,2);
/*!40000 ALTER TABLE `item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `luckycat`
--

DROP TABLE IF EXISTS `luckycat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `luckycat` (
  `roleId` bigint unsigned NOT NULL COMMENT '角色id',
  `resId` bigint NOT NULL COMMENT '档位id',
  `processIndex` int NOT NULL COMMENT '进度索引',
  `endTime` datetime NOT NULL COMMENT '结束时间',
  `first` tinyint NOT NULL DEFAULT '1' COMMENT '是否首次(Class:Boolean)',
  `buy` tinyint DEFAULT '0' COMMENT '是否已购买(Class:Boolean)',
  PRIMARY KEY (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT=' 招财猫';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `luckycat`
--

LOCK TABLES `luckycat` WRITE;
/*!40000 ALTER TABLE `luckycat` DISABLE KEYS */;
INSERT INTO `luckycat` VALUES (1,0,0,'1970-01-01 08:00:00',1,0),(2,0,0,'1970-01-01 08:00:00',1,0),(13,0,0,'1970-01-01 08:00:00',1,0),(31,0,0,'1970-01-01 08:00:00',1,0),(36,0,0,'1970-01-01 08:00:00',1,0),(42,0,0,'1970-01-01 08:00:00',1,0),(46,0,0,'1970-01-01 08:00:00',1,0);
/*!40000 ALTER TABLE `luckycat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mail`
--

DROP TABLE IF EXISTS `mail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mail`
--

LOCK TABLES `mail` WRITE;
/*!40000 ALTER TABLE `mail` DISABLE KEYS */;
INSERT INTO `mail` VALUES (1,42,'测试标题','测试内容',NULL,0,0,'2025-02-18 01:23:11','1970-01-01 08:00:00',1),(2,42,'测试标题','测试内容',NULL,0,0,'2025-02-18 01:23:12','1970-01-01 08:00:00',1),(3,42,'测试标题','测试内容',NULL,0,0,'2025-02-18 01:23:13','1970-01-01 08:00:00',1),(4,42,'测试标题','测试内容',NULL,0,0,'2025-02-18 01:23:13','1970-01-01 08:00:00',1),(8,46,'测试标题','测试内容',NULL,1,0,'2025-02-18 03:22:39','2025-02-18 03:27:47',1);
/*!40000 ALTER TABLE `mail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mailmodel`
--

DROP TABLE IF EXISTS `mailmodel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mailmodel` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '邮件Id',
  `title` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_cs_0900_ai_ci NOT NULL COMMENT '邮件标题',
  `content` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_cs_0900_ai_ci NOT NULL COMMENT '邮件内容',
  `goodsList` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_cs_0900_ai_ci DEFAULT NULL COMMENT '奖励(Class:List<com.xkhy.blcx.domain.res.ResItem>)',
  `time` datetime NOT NULL COMMENT '发送时间',
  `source` tinyint NOT NULL COMMENT '邮件来源',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_cs_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mailmodel`
--

LOCK TABLES `mailmodel` WRITE;
/*!40000 ALTER TABLE `mailmodel` DISABLE KEYS */;
/*!40000 ALTER TABLE `mailmodel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mailrole`
--

DROP TABLE IF EXISTS `mailrole`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mailrole` (
  `roleId` bigint unsigned NOT NULL,
  `mailId` bigint unsigned NOT NULL,
  PRIMARY KEY (`roleId`,`mailId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mailrole`
--

LOCK TABLES `mailrole` WRITE;
/*!40000 ALTER TABLE `mailrole` DISABLE KEYS */;
/*!40000 ALTER TABLE `mailrole` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recharge`
--

DROP TABLE IF EXISTS `recharge`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=2540 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='充值表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recharge`
--

LOCK TABLES `recharge` WRITE;
/*!40000 ALTER TABLE `recharge` DISABLE KEYS */;
/*!40000 ALTER TABLE `recharge` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='角色';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roleactivity`
--

DROP TABLE IF EXISTS `roleactivity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roleactivity` (
  `roleId` bigint unsigned NOT NULL COMMENT '角色Id',
  `resId` bigint unsigned NOT NULL COMMENT '活动唯一Id',
  `activityType` int NOT NULL COMMENT '活动类型',
  `content` varchar(4096) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '活动数据',
  PRIMARY KEY (`roleId`,`resId`) USING BTREE,
  KEY `roleId` (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roleactivity`
--

LOCK TABLES `roleactivity` WRITE;
/*!40000 ALTER TABLE `roleactivity` DISABLE KEYS */;
/*!40000 ALTER TABLE `roleactivity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roleattribute`
--

DROP TABLE IF EXISTS `roleattribute`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roleattribute` (
  `roleId` bigint unsigned NOT NULL COMMENT '角色Id',
  `attribute` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '通用属性,以后注意设置字段大小(Class:Map<Integer,Integer>)',
  PRIMARY KEY (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='角色属性，一般属性放在attribute字段里的map中，一般都是Int值，其他特殊属性新建字段，要统计排行榜的字段新建字段';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roleattribute`
--

LOCK TABLES `roleattribute` WRITE;
/*!40000 ALTER TABLE `roleattribute` DISABLE KEYS */;
/*!40000 ALTER TABLE `roleattribute` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roleitemstate`
--

DROP TABLE IF EXISTS `roleitemstate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roleitemstate` (
  `roleId` bigint unsigned NOT NULL COMMENT '角色id',
  `readItem` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '玩家已点击过的物品id列表(Class:Set<Long>)',
  PRIMARY KEY (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='玩家物品状态';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roleitemstate`
--

LOCK TABLES `roleitemstate` WRITE;
/*!40000 ALTER TABLE `roleitemstate` DISABLE KEYS */;
INSERT INTO `roleitemstate` VALUES (1,'[]'),(2,'[]'),(13,'[]'),(31,'[]'),(36,'[]'),(42,'[]'),(46,'[]');
/*!40000 ALTER TABLE `roleitemstate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rolemall`
--

DROP TABLE IF EXISTS `rolemall`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rolemall` (
  `roleId` bigint NOT NULL COMMENT '角色id',
  `resId` bigint NOT NULL COMMENT '组件id',
  `content` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '组件数据(Class:Set<String>)',
  `time` datetime NOT NULL COMMENT '生成时间',
  PRIMARY KEY (`roleId`,`resId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rolemall`
--

LOCK TABLES `rolemall` WRITE;
/*!40000 ALTER TABLE `rolemall` DISABLE KEYS */;
INSERT INTO `rolemall` VALUES (1,1,'[\"{\\\"resId\\\":5,\\\"state\\\":0}\",\"{\\\"resId\\\":15,\\\"state\\\":0}\",\"{\\\"resId\\\":3,\\\"state\\\":0}\",\"{\\\"resId\\\":7,\\\"state\\\":0}\",\"{\\\"resId\\\":12,\\\"state\\\":0}\",\"{\\\"resId\\\":9,\\\"state\\\":0}\",\"{\\\"resId\\\":10,\\\"state\\\":0}\",\"{\\\"resId\\\":6,\\\"state\\\":0}\",\"{\\\"resId\\\":14,\\\"state\\\":0}\",\"{\\\"resId\\\":1,\\\"state\\\":0}\",\"{\\\"resId\\\":2,\\\"state\\\":0}\",\"{\\\"resId\\\":4,\\\"state\\\":0}\",\"{\\\"resId\\\":13,\\\"state\\\":0}\",\"{\\\"resId\\\":8,\\\"state\\\":0}\",\"{\\\"resId\\\":11,\\\"state\\\":0}\"]','1970-01-01 08:00:00'),(1,2,'[\"{\\\"resId\\\":6,\\\"rewardId\\\":41,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"250\\\",\\\"discount\\\":\\\"0.7\\\",\\\"finalNumber\\\":\\\"175.0\\\"}\",\"{\\\"resId\\\":1,\\\"rewardId\\\":1,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"0\\\",\\\"discount\\\":\\\"1.0\\\",\\\"finalNumber\\\":\\\"0.0\\\"}\",\"{\\\"resId\\\":3,\\\"rewardId\\\":87,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"450\\\",\\\"discount\\\":\\\"0.8\\\",\\\"finalNumber\\\":\\\"360.0\\\"}\",\"{\\\"resId\\\":7,\\\"rewardId\\\":100,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"270\\\",\\\"discount\\\":\\\"1.0\\\",\\\"finalNumber\\\":\\\"270.0\\\"}\",\"{\\\"resId\\\":5,\\\"rewardId\\\":28,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"30000\\\",\\\"discount\\\":\\\"0.9\\\",\\\"finalNumber\\\":\\\"27000.0\\\"}\",\"{\\\"resId\\\":4,\\\"rewardId\\\":24,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"20000\\\",\\\"discount\\\":\\\"0.6\\\",\\\"finalNumber\\\":\\\"12000.0\\\"}\",\"{\\\"resId\\\":2,\\\"rewardId\\\":29,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"30000\\\",\\\"discount\\\":\\\"0.8\\\",\\\"finalNumber\\\":\\\"24000.0\\\"}\"]','2025-02-18 01:17:01'),(1,3,'[\"{\\\"resId\\\":1,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":2,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":7,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":3,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":4,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":5,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":6,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\"]','2025-02-18 01:17:01'),(1,4,'[\"{\\\"resId\\\":1,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":2,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":7,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":3,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":4,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":5,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":6,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\"]','2025-02-18 01:17:01'),(1,5,'[\"{\\\"resId\\\":1,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"freeTime\\\":0,\\\"firstDraw\\\":true}\",\"{\\\"resId\\\":2,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"freeTime\\\":0,\\\"firstDraw\\\":true}\"]','2025-02-18 01:17:01'),(1,6,'[\"{\\\"chargeId\\\":6,\\\"state\\\":0}\",\"{\\\"chargeId\\\":3,\\\"state\\\":0}\",\"{\\\"chargeId\\\":1,\\\"state\\\":0}\",\"{\\\"chargeId\\\":2,\\\"state\\\":0}\",\"{\\\"chargeId\\\":4,\\\"state\\\":0}\",\"{\\\"chargeId\\\":5,\\\"state\\\":0}\"]','1970-01-01 08:00:00'),(1,7,'[\"{\\\"resId\\\":3,\\\"buyCount\\\":0,\\\"freeTime\\\":0}\",\"{\\\"resId\\\":2,\\\"buyCount\\\":0,\\\"freeTime\\\":0}\",\"{\\\"resId\\\":1,\\\"buyCount\\\":0,\\\"freeTime\\\":0}\"]','2025-02-18 01:17:01'),(2,1,'[\"{\\\"resId\\\":5,\\\"state\\\":0}\",\"{\\\"resId\\\":15,\\\"state\\\":0}\",\"{\\\"resId\\\":3,\\\"state\\\":0}\",\"{\\\"resId\\\":7,\\\"state\\\":0}\",\"{\\\"resId\\\":12,\\\"state\\\":0}\",\"{\\\"resId\\\":9,\\\"state\\\":0}\",\"{\\\"resId\\\":10,\\\"state\\\":0}\",\"{\\\"resId\\\":6,\\\"state\\\":0}\",\"{\\\"resId\\\":14,\\\"state\\\":0}\",\"{\\\"resId\\\":1,\\\"state\\\":0}\",\"{\\\"resId\\\":2,\\\"state\\\":0}\",\"{\\\"resId\\\":4,\\\"state\\\":0}\",\"{\\\"resId\\\":13,\\\"state\\\":0}\",\"{\\\"resId\\\":8,\\\"state\\\":0}\",\"{\\\"resId\\\":11,\\\"state\\\":0}\"]','1970-01-01 08:00:00'),(2,2,'[\"{\\\"resId\\\":3,\\\"rewardId\\\":64,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"150\\\",\\\"discount\\\":\\\"0.2\\\",\\\"finalNumber\\\":\\\"30.0\\\"}\",\"{\\\"resId\\\":1,\\\"rewardId\\\":1,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"0\\\",\\\"discount\\\":\\\"1.0\\\",\\\"finalNumber\\\":\\\"0.0\\\"}\",\"{\\\"resId\\\":2,\\\"rewardId\\\":30,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"30000\\\",\\\"discount\\\":\\\"0.8\\\",\\\"finalNumber\\\":\\\"24000.0\\\"}\",\"{\\\"resId\\\":6,\\\"rewardId\\\":89,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"525\\\",\\\"discount\\\":\\\"0.6\\\",\\\"finalNumber\\\":\\\"315.0\\\"}\",\"{\\\"resId\\\":5,\\\"rewardId\\\":21,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"20000\\\",\\\"discount\\\":\\\"0.5\\\",\\\"finalNumber\\\":\\\"10000.0\\\"}\",\"{\\\"resId\\\":7,\\\"rewardId\\\":98,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"30\\\",\\\"discount\\\":\\\"1.0\\\",\\\"finalNumber\\\":\\\"30.0\\\"}\",\"{\\\"resId\\\":4,\\\"rewardId\\\":31,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"30000\\\",\\\"discount\\\":\\\"0.9\\\",\\\"finalNumber\\\":\\\"27000.0\\\"}\"]','2025-02-17 18:03:35'),(2,3,'[\"{\\\"resId\\\":1,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":2,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":7,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":3,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":4,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":5,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":6,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\"]','2025-02-17 18:03:35'),(2,4,'[\"{\\\"resId\\\":1,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":2,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":7,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":3,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":4,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":5,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":6,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\"]','2025-02-17 18:03:35'),(2,5,'[\"{\\\"resId\\\":1,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"freeTime\\\":0,\\\"firstDraw\\\":true}\",\"{\\\"resId\\\":2,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"freeTime\\\":0,\\\"firstDraw\\\":true}\"]','2025-02-17 18:03:35'),(2,6,'[\"{\\\"chargeId\\\":6,\\\"state\\\":0}\",\"{\\\"chargeId\\\":3,\\\"state\\\":0}\",\"{\\\"chargeId\\\":1,\\\"state\\\":0}\",\"{\\\"chargeId\\\":2,\\\"state\\\":0}\",\"{\\\"chargeId\\\":4,\\\"state\\\":0}\",\"{\\\"chargeId\\\":5,\\\"state\\\":0}\"]','1970-01-01 08:00:00'),(2,7,'[\"{\\\"resId\\\":3,\\\"buyCount\\\":0,\\\"freeTime\\\":0}\",\"{\\\"resId\\\":2,\\\"buyCount\\\":0,\\\"freeTime\\\":0}\",\"{\\\"resId\\\":1,\\\"buyCount\\\":0,\\\"freeTime\\\":0}\"]','2025-02-17 18:03:35'),(13,1,'[\"{\\\"resId\\\":5,\\\"state\\\":0}\",\"{\\\"resId\\\":15,\\\"state\\\":0}\",\"{\\\"resId\\\":3,\\\"state\\\":0}\",\"{\\\"resId\\\":7,\\\"state\\\":0}\",\"{\\\"resId\\\":12,\\\"state\\\":0}\",\"{\\\"resId\\\":9,\\\"state\\\":0}\",\"{\\\"resId\\\":10,\\\"state\\\":0}\",\"{\\\"resId\\\":6,\\\"state\\\":0}\",\"{\\\"resId\\\":14,\\\"state\\\":0}\",\"{\\\"resId\\\":1,\\\"state\\\":0}\",\"{\\\"resId\\\":2,\\\"state\\\":0}\",\"{\\\"resId\\\":4,\\\"state\\\":0}\",\"{\\\"resId\\\":13,\\\"state\\\":0}\",\"{\\\"resId\\\":8,\\\"state\\\":0}\",\"{\\\"resId\\\":11,\\\"state\\\":0}\"]','1970-01-01 08:00:00'),(13,2,'[\"{\\\"resId\\\":3,\\\"rewardId\\\":43,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"200\\\",\\\"discount\\\":\\\"0.5\\\",\\\"finalNumber\\\":\\\"100.0\\\"}\",\"{\\\"resId\\\":6,\\\"rewardId\\\":83,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"450\\\",\\\"discount\\\":\\\"0.9\\\",\\\"finalNumber\\\":\\\"405.0\\\"}\",\"{\\\"resId\\\":1,\\\"rewardId\\\":1,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"0\\\",\\\"discount\\\":\\\"1.0\\\",\\\"finalNumber\\\":\\\"0.0\\\"}\",\"{\\\"resId\\\":5,\\\"rewardId\\\":36,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"40000\\\",\\\"discount\\\":\\\"0.9\\\",\\\"finalNumber\\\":\\\"36000.0\\\"}\",\"{\\\"resId\\\":7,\\\"rewardId\\\":99,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"90\\\",\\\"discount\\\":\\\"1.0\\\",\\\"finalNumber\\\":\\\"90.0\\\"}\",\"{\\\"resId\\\":2,\\\"rewardId\\\":22,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"20000\\\",\\\"discount\\\":\\\"0.8\\\",\\\"finalNumber\\\":\\\"16000.0\\\"}\",\"{\\\"resId\\\":4,\\\"rewardId\\\":33,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"40000\\\",\\\"discount\\\":\\\"0.9\\\",\\\"finalNumber\\\":\\\"36000.0\\\"}\"]','2025-02-17 17:54:14'),(13,3,'[\"{\\\"resId\\\":1,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":2,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":7,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":3,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":4,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":5,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":6,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\"]','2025-02-17 17:54:14'),(13,4,'[\"{\\\"resId\\\":1,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":2,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":7,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":3,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":4,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":5,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":6,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\"]','2025-02-17 17:54:14'),(13,5,'[\"{\\\"resId\\\":1,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"freeTime\\\":0,\\\"firstDraw\\\":true}\",\"{\\\"resId\\\":2,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"freeTime\\\":0,\\\"firstDraw\\\":true}\"]','2025-02-17 17:54:14'),(13,6,'[\"{\\\"chargeId\\\":6,\\\"state\\\":0}\",\"{\\\"chargeId\\\":3,\\\"state\\\":0}\",\"{\\\"chargeId\\\":1,\\\"state\\\":0}\",\"{\\\"chargeId\\\":2,\\\"state\\\":0}\",\"{\\\"chargeId\\\":4,\\\"state\\\":0}\",\"{\\\"chargeId\\\":5,\\\"state\\\":0}\"]','1970-01-01 08:00:00'),(13,7,'[\"{\\\"resId\\\":3,\\\"buyCount\\\":0,\\\"freeTime\\\":0}\",\"{\\\"resId\\\":2,\\\"buyCount\\\":0,\\\"freeTime\\\":0}\",\"{\\\"resId\\\":1,\\\"buyCount\\\":0,\\\"freeTime\\\":0}\"]','2025-02-17 17:54:14'),(31,1,'[\"{\\\"resId\\\":5,\\\"state\\\":0}\",\"{\\\"resId\\\":15,\\\"state\\\":0}\",\"{\\\"resId\\\":3,\\\"state\\\":0}\",\"{\\\"resId\\\":7,\\\"state\\\":0}\",\"{\\\"resId\\\":12,\\\"state\\\":0}\",\"{\\\"resId\\\":9,\\\"state\\\":0}\",\"{\\\"resId\\\":10,\\\"state\\\":0}\",\"{\\\"resId\\\":6,\\\"state\\\":0}\",\"{\\\"resId\\\":14,\\\"state\\\":0}\",\"{\\\"resId\\\":1,\\\"state\\\":0}\",\"{\\\"resId\\\":2,\\\"state\\\":0}\",\"{\\\"resId\\\":4,\\\"state\\\":0}\",\"{\\\"resId\\\":13,\\\"state\\\":0}\",\"{\\\"resId\\\":8,\\\"state\\\":0}\",\"{\\\"resId\\\":11,\\\"state\\\":0}\"]','1970-01-01 08:00:00'),(31,2,'[\"{\\\"resId\\\":4,\\\"rewardId\\\":21,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"20000\\\",\\\"discount\\\":\\\"0.6\\\",\\\"finalNumber\\\":\\\"12000.0\\\"}\",\"{\\\"resId\\\":6,\\\"rewardId\\\":95,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"450\\\",\\\"discount\\\":\\\"0.7\\\",\\\"finalNumber\\\":\\\"315.0\\\"}\",\"{\\\"resId\\\":3,\\\"rewardId\\\":48,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"200\\\",\\\"discount\\\":\\\"0.4\\\",\\\"finalNumber\\\":\\\"80.0\\\"}\",\"{\\\"resId\\\":1,\\\"rewardId\\\":1,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"0\\\",\\\"discount\\\":\\\"1.0\\\",\\\"finalNumber\\\":\\\"0.0\\\"}\",\"{\\\"resId\\\":2,\\\"rewardId\\\":32,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"40000\\\",\\\"discount\\\":\\\"0.5\\\",\\\"finalNumber\\\":\\\"20000.0\\\"}\",\"{\\\"resId\\\":7,\\\"rewardId\\\":100,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"270\\\",\\\"discount\\\":\\\"1.0\\\",\\\"finalNumber\\\":\\\"270.0\\\"}\",\"{\\\"resId\\\":5,\\\"rewardId\\\":21,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"20000\\\",\\\"discount\\\":\\\"0.6\\\",\\\"finalNumber\\\":\\\"12000.0\\\"}\"]','2025-02-17 18:04:12'),(31,3,'[\"{\\\"resId\\\":1,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":2,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":7,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":3,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":4,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":5,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":6,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\"]','2025-02-17 18:04:12'),(31,4,'[\"{\\\"resId\\\":2,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":7,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":1,\\\"buyCount\\\":1,\\\"bigPrizeCount\\\":1,\\\"ultimatePrizeCount\\\":1,\\\"totalBuyCount\\\":1}\",\"{\\\"resId\\\":3,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":4,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":5,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":6,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\"]','2025-02-17 18:04:12'),(31,5,'[\"{\\\"resId\\\":1,\\\"buyCount\\\":1,\\\"bigPrizeCount\\\":1,\\\"freeTime\\\":0,\\\"firstDraw\\\":false}\",\"{\\\"resId\\\":2,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"freeTime\\\":0,\\\"firstDraw\\\":true}\"]','2025-02-17 18:04:12'),(31,6,'[\"{\\\"chargeId\\\":6,\\\"state\\\":0}\",\"{\\\"chargeId\\\":3,\\\"state\\\":0}\",\"{\\\"chargeId\\\":1,\\\"state\\\":0}\",\"{\\\"chargeId\\\":2,\\\"state\\\":0}\",\"{\\\"chargeId\\\":4,\\\"state\\\":0}\",\"{\\\"chargeId\\\":5,\\\"state\\\":0}\"]','1970-01-01 08:00:00'),(31,7,'[\"{\\\"resId\\\":3,\\\"buyCount\\\":0,\\\"freeTime\\\":0}\",\"{\\\"resId\\\":2,\\\"buyCount\\\":0,\\\"freeTime\\\":0}\",\"{\\\"resId\\\":1,\\\"buyCount\\\":0,\\\"freeTime\\\":0}\"]','2025-02-17 18:04:12'),(36,1,'[\"{\\\"resId\\\":5,\\\"state\\\":0}\",\"{\\\"resId\\\":15,\\\"state\\\":0}\",\"{\\\"resId\\\":3,\\\"state\\\":0}\",\"{\\\"resId\\\":7,\\\"state\\\":0}\",\"{\\\"resId\\\":12,\\\"state\\\":0}\",\"{\\\"resId\\\":9,\\\"state\\\":0}\",\"{\\\"resId\\\":10,\\\"state\\\":0}\",\"{\\\"resId\\\":6,\\\"state\\\":0}\",\"{\\\"resId\\\":14,\\\"state\\\":0}\",\"{\\\"resId\\\":1,\\\"state\\\":0}\",\"{\\\"resId\\\":2,\\\"state\\\":0}\",\"{\\\"resId\\\":4,\\\"state\\\":0}\",\"{\\\"resId\\\":13,\\\"state\\\":0}\",\"{\\\"resId\\\":8,\\\"state\\\":0}\",\"{\\\"resId\\\":11,\\\"state\\\":0}\"]','1970-01-01 08:00:00'),(36,2,'[\"{\\\"resId\\\":6,\\\"rewardId\\\":63,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"150\\\",\\\"discount\\\":\\\"0.3\\\",\\\"finalNumber\\\":\\\"45.0\\\"}\",\"{\\\"resId\\\":1,\\\"rewardId\\\":1,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"0\\\",\\\"discount\\\":\\\"1.0\\\",\\\"finalNumber\\\":\\\"0.0\\\"}\",\"{\\\"resId\\\":2,\\\"rewardId\\\":36,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"40000\\\",\\\"discount\\\":\\\"0.8\\\",\\\"finalNumber\\\":\\\"32000.0\\\"}\",\"{\\\"resId\\\":7,\\\"rewardId\\\":100,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"270\\\",\\\"discount\\\":\\\"1.0\\\",\\\"finalNumber\\\":\\\"270.0\\\"}\",\"{\\\"resId\\\":5,\\\"rewardId\\\":21,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"20000\\\",\\\"discount\\\":\\\"0.6\\\",\\\"finalNumber\\\":\\\"12000.0\\\"}\",\"{\\\"resId\\\":3,\\\"rewardId\\\":49,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"200\\\",\\\"discount\\\":\\\"0.6\\\",\\\"finalNumber\\\":\\\"121.0\\\"}\",\"{\\\"resId\\\":4,\\\"rewardId\\\":36,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"40000\\\",\\\"discount\\\":\\\"0.9\\\",\\\"finalNumber\\\":\\\"36000.0\\\"}\"]','2025-02-18 00:47:23'),(36,3,'[\"{\\\"resId\\\":1,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":2,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":7,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":3,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":4,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":5,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":6,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\"]','2025-02-18 00:47:23'),(36,4,'[\"{\\\"resId\\\":1,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":2,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":7,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":3,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":4,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":5,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":6,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\"]','2025-02-18 00:47:23'),(36,5,'[\"{\\\"resId\\\":1,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"freeTime\\\":0,\\\"firstDraw\\\":true}\",\"{\\\"resId\\\":2,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"freeTime\\\":0,\\\"firstDraw\\\":true}\"]','2025-02-18 00:47:23'),(36,6,'[\"{\\\"chargeId\\\":6,\\\"state\\\":0}\",\"{\\\"chargeId\\\":3,\\\"state\\\":0}\",\"{\\\"chargeId\\\":1,\\\"state\\\":0}\",\"{\\\"chargeId\\\":2,\\\"state\\\":0}\",\"{\\\"chargeId\\\":4,\\\"state\\\":0}\",\"{\\\"chargeId\\\":5,\\\"state\\\":0}\"]','1970-01-01 08:00:00'),(36,7,'[\"{\\\"resId\\\":3,\\\"buyCount\\\":0,\\\"freeTime\\\":0}\",\"{\\\"resId\\\":2,\\\"buyCount\\\":0,\\\"freeTime\\\":0}\",\"{\\\"resId\\\":1,\\\"buyCount\\\":0,\\\"freeTime\\\":0}\"]','2025-02-18 00:47:23'),(42,1,'[\"{\\\"resId\\\":1,\\\"buyCount\\\":1,\\\"bigPrizeCount\\\":1,\\\"ultimatePrizeCount\\\":1,\\\"totalBuyCount\\\":0}\"]','1970-01-01 08:00:00'),(42,2,'[\"{\\\"resId\\\":5,\\\"rewardId\\\":31,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"30000\\\",\\\"discount\\\":\\\"0.9\\\",\\\"finalNumber\\\":\\\"27000.0\\\"}\",\"{\\\"resId\\\":1,\\\"rewardId\\\":1,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"0\\\",\\\"discount\\\":\\\"1.0\\\",\\\"finalNumber\\\":\\\"0.0\\\"}\",\"{\\\"resId\\\":7,\\\"rewardId\\\":100,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"270\\\",\\\"discount\\\":\\\"1.0\\\",\\\"finalNumber\\\":\\\"270.0\\\"}\",\"{\\\"resId\\\":3,\\\"rewardId\\\":66,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"150\\\",\\\"discount\\\":\\\"0.3\\\",\\\"finalNumber\\\":\\\"45.0\\\"}\",\"{\\\"resId\\\":6,\\\"rewardId\\\":91,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"525\\\",\\\"discount\\\":\\\"0.7\\\",\\\"finalNumber\\\":\\\"368.0\\\"}\",\"{\\\"resId\\\":4,\\\"rewardId\\\":22,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"20000\\\",\\\"discount\\\":\\\"0.7\\\",\\\"finalNumber\\\":\\\"14000.0\\\"}\",\"{\\\"resId\\\":2,\\\"rewardId\\\":26,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"30000\\\",\\\"discount\\\":\\\"0.8\\\",\\\"finalNumber\\\":\\\"24000.0\\\"}\"]','2025-02-18 01:20:14'),(42,3,'[\"{\\\"resId\\\":1,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":2,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":7,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":3,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":4,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":5,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":6,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\"]','2025-02-18 01:20:14'),(42,4,'[\"{\\\"resId\\\":1,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":2,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":7,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":3,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":4,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":5,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":6,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\"]','2025-02-18 01:20:14'),(42,5,'[\"{\\\"resId\\\":1,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"freeTime\\\":0,\\\"firstDraw\\\":true}\",\"{\\\"resId\\\":2,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"freeTime\\\":0,\\\"firstDraw\\\":true}\"]','2025-02-18 01:20:14'),(42,6,'[\"{\\\"chargeId\\\":6,\\\"state\\\":0}\",\"{\\\"chargeId\\\":3,\\\"state\\\":0}\",\"{\\\"chargeId\\\":1,\\\"state\\\":0}\",\"{\\\"chargeId\\\":2,\\\"state\\\":0}\",\"{\\\"chargeId\\\":4,\\\"state\\\":0}\",\"{\\\"chargeId\\\":5,\\\"state\\\":0}\"]','1970-01-01 08:00:00'),(42,7,'[\"{\\\"resId\\\":3,\\\"buyCount\\\":0,\\\"freeTime\\\":0}\",\"{\\\"resId\\\":2,\\\"buyCount\\\":0,\\\"freeTime\\\":0}\",\"{\\\"resId\\\":1,\\\"buyCount\\\":0,\\\"freeTime\\\":0}\"]','2025-02-18 01:20:14'),(46,1,'[\"{\\\"resId\\\":5,\\\"state\\\":0}\",\"{\\\"resId\\\":15,\\\"state\\\":0}\",\"{\\\"resId\\\":3,\\\"state\\\":0}\",\"{\\\"resId\\\":7,\\\"state\\\":0}\",\"{\\\"resId\\\":12,\\\"state\\\":0}\",\"{\\\"resId\\\":9,\\\"state\\\":0}\",\"{\\\"resId\\\":10,\\\"state\\\":0}\",\"{\\\"resId\\\":6,\\\"state\\\":0}\",\"{\\\"resId\\\":14,\\\"state\\\":0}\",\"{\\\"resId\\\":1,\\\"state\\\":0}\",\"{\\\"resId\\\":2,\\\"state\\\":0}\",\"{\\\"resId\\\":4,\\\"state\\\":0}\",\"{\\\"resId\\\":13,\\\"state\\\":0}\",\"{\\\"resId\\\":8,\\\"state\\\":0}\",\"{\\\"resId\\\":11,\\\"state\\\":0}\"]','1970-01-01 08:00:00'),(46,2,'[\"{\\\"resId\\\":2,\\\"rewardId\\\":25,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"20000\\\",\\\"discount\\\":\\\"0.7\\\",\\\"finalNumber\\\":\\\"14000.0\\\"}\",\"{\\\"resId\\\":6,\\\"rewardId\\\":69,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"750\\\",\\\"discount\\\":\\\"0.7\\\",\\\"finalNumber\\\":\\\"525.0\\\"}\",\"{\\\"resId\\\":3,\\\"rewardId\\\":71,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"750\\\",\\\"discount\\\":\\\"0.7\\\",\\\"finalNumber\\\":\\\"525.0\\\"}\",\"{\\\"resId\\\":1,\\\"rewardId\\\":1,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"0\\\",\\\"discount\\\":\\\"1.0\\\",\\\"finalNumber\\\":\\\"0.0\\\"}\",\"{\\\"resId\\\":5,\\\"rewardId\\\":32,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"40000\\\",\\\"discount\\\":\\\"0.9\\\",\\\"finalNumber\\\":\\\"36000.0\\\"}\",\"{\\\"resId\\\":7,\\\"rewardId\\\":100,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"270\\\",\\\"discount\\\":\\\"1.0\\\",\\\"finalNumber\\\":\\\"270.0\\\"}\",\"{\\\"resId\\\":4,\\\"rewardId\\\":33,\\\"buyCount\\\":0,\\\"adTime\\\":0,\\\"original\\\":\\\"40000\\\",\\\"discount\\\":\\\"0.9\\\",\\\"finalNumber\\\":\\\"36000.0\\\"}\"]','2025-02-18 03:11:33'),(46,3,'[\"{\\\"resId\\\":1,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":2,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":7,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":3,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":4,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":5,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":6,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\"]','2025-02-18 03:11:33'),(46,4,'[\"{\\\"resId\\\":1,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":2,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":7,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":3,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":4,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":5,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\",\"{\\\"resId\\\":6,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"ultimatePrizeCount\\\":0,\\\"totalBuyCount\\\":0}\"]','2025-02-18 03:11:33'),(46,5,'[\"{\\\"resId\\\":1,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"freeTime\\\":0,\\\"firstDraw\\\":true}\",\"{\\\"resId\\\":2,\\\"buyCount\\\":0,\\\"bigPrizeCount\\\":0,\\\"freeTime\\\":0,\\\"firstDraw\\\":true}\"]','2025-02-18 03:11:33'),(46,6,'[\"{\\\"chargeId\\\":6,\\\"state\\\":0}\",\"{\\\"chargeId\\\":3,\\\"state\\\":0}\",\"{\\\"chargeId\\\":1,\\\"state\\\":0}\",\"{\\\"chargeId\\\":2,\\\"state\\\":0}\",\"{\\\"chargeId\\\":4,\\\"state\\\":0}\",\"{\\\"chargeId\\\":5,\\\"state\\\":0}\"]','1970-01-01 08:00:00'),(46,7,'[\"{\\\"resId\\\":3,\\\"buyCount\\\":0,\\\"freeTime\\\":0}\",\"{\\\"resId\\\":2,\\\"buyCount\\\":0,\\\"freeTime\\\":0}\",\"{\\\"resId\\\":1,\\\"buyCount\\\":0,\\\"freeTime\\\":0}\"]','2025-02-18 03:11:33');
/*!40000 ALTER TABLE `rolemall` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rolesign`
--

DROP TABLE IF EXISTS `rolesign`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rolesign` (
  `id` bigint unsigned NOT NULL COMMENT '角色Id',
  `isChangeName` tinyint(1) NOT NULL COMMENT '是否改名',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rolesign`
--

LOCK TABLES `rolesign` WRITE;
/*!40000 ALTER TABLE `rolesign` DISABLE KEYS */;
INSERT INTO `rolesign` VALUES (1,0),(2,0),(13,0),(31,0),(36,0),(42,0),(46,0);
/*!40000 ALTER TABLE `rolesign` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rune`
--

DROP TABLE IF EXISTS `rune`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rune` (
  `id` bigint unsigned NOT NULL,
  `roleId` bigint unsigned NOT NULL COMMENT '角色id',
  `resId` bigint unsigned NOT NULL COMMENT '资源id',
  `quality` int unsigned NOT NULL COMMENT '品质',
  `phase` int unsigned NOT NULL COMMENT '阶段',
  `isNew` tinyint DEFAULT '1' COMMENT '是否新(Class:Boolean)',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rune`
--

LOCK TABLES `rune` WRITE;
/*!40000 ALTER TABLE `rune` DISABLE KEYS */;
INSERT INTO `rune` VALUES (2,31,310500,1,0,1),(3,31,310100,4,0,1),(4,31,320500,2,0,1),(5,31,320100,2,0,1),(6,31,310300,5,0,1),(7,31,310400,3,0,1),(8,31,310100,2,0,1),(9,31,320100,3,0,1),(10,31,310300,4,0,1),(11,31,310300,5,0,1),(12,31,310100,1,0,1),(13,31,320600,4,0,1),(14,31,310400,2,0,1),(15,31,310300,1,0,1),(16,31,310400,5,0,1),(17,31,320200,3,0,1),(18,31,310500,1,0,1),(19,31,320200,2,0,1),(20,31,320500,4,0,1),(21,31,320400,5,0,1),(23,42,320400,1,0,1),(24,42,320400,4,0,1),(25,42,310300,2,0,1),(26,42,310500,2,0,1),(27,42,320600,5,0,1),(28,42,320400,3,0,1),(29,42,320500,2,0,1),(30,42,320500,2,0,1),(31,42,320100,4,0,1),(32,42,310600,5,0,1),(33,42,320100,1,0,1),(34,42,310300,4,0,1),(35,42,320300,2,0,1),(36,42,320200,2,0,1),(37,42,320200,5,0,1),(38,42,310500,3,0,1),(39,42,310600,2,0,1),(40,42,310500,3,0,1),(41,42,320300,4,0,1),(42,42,320100,5,0,1);
/*!40000 ALTER TABLE `rune` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `share`
--

DROP TABLE IF EXISTS `share`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `share` (
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `shareState` int DEFAULT NULL COMMENT '分享状态',
  `rewardState` int DEFAULT NULL COMMENT '领奖状态',
  PRIMARY KEY (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `share`
--

LOCK TABLES `share` WRITE;
/*!40000 ALTER TABLE `share` DISABLE KEYS */;
/*!40000 ALTER TABLE `share` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `specialgift`
--

DROP TABLE IF EXISTS `specialgift`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `specialgift` (
  `roleId` bigint NOT NULL COMMENT '角色Id',
  `resId` bigint NOT NULL COMMENT '礼包Id',
  `state` int NOT NULL COMMENT '购买状态',
  `endTime` datetime DEFAULT NULL COMMENT '结束时间',
  `failTimes` int DEFAULT NULL COMMENT '失败次数',
  `alreadyShow` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '已经弹窗过的礼包(Class:Set<Long>)',
  PRIMARY KEY (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `specialgift`
--

LOCK TABLES `specialgift` WRITE;
/*!40000 ALTER TABLE `specialgift` DISABLE KEYS */;
INSERT INTO `specialgift` VALUES (1,0,0,'1970-01-01 08:00:00',0,'[]'),(2,0,0,'1970-01-01 08:00:00',0,'[]'),(13,0,0,'1970-01-01 08:00:00',0,'[]'),(31,0,0,'1970-01-01 08:00:00',0,'[]'),(36,0,0,'1970-01-01 08:00:00',0,'[]'),(42,0,0,'1970-01-01 08:00:00',0,'[]'),(46,0,0,'1970-01-01 08:00:00',0,'[]');
/*!40000 ALTER TABLE `specialgift` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `systemdata`
--

DROP TABLE IF EXISTS `systemdata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `systemdata` (
  `systemId` int NOT NULL COMMENT '系统id',
  `dataDetail` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '系统详细数据(Class:SystemDataDetail)',
  `lastUpdateTime` datetime NOT NULL COMMENT '上次更新时间',
  PRIMARY KEY (`systemId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT=' 系统数据';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `systemdata`
--

LOCK TABLES `systemdata` WRITE;
/*!40000 ALTER TABLE `systemdata` DISABLE KEYS */;
INSERT INTO `systemdata` VALUES (1,'{\"todayFuBenResIdMap\":{\"2\":1001,\"3\":2001}}','2025-02-18 00:43:18');
/*!40000 ALTER TABLE `systemdata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task`
--

DROP TABLE IF EXISTS `task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task` (
  `roleId` bigint unsigned NOT NULL COMMENT '角色Id',
  `resId` bigint unsigned NOT NULL COMMENT '任务Id',
  `count` int unsigned NOT NULL COMMENT '进度',
  `rewardState` tinyint NOT NULL COMMENT '奖励状态',
  PRIMARY KEY (`roleId`,`resId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task`
--

LOCK TABLES `task` WRITE;
/*!40000 ALTER TABLE `task` DISABLE KEYS */;
INSERT INTO `task` VALUES (1,10001,0,0),(1,10002,0,0),(1,10003,0,0),(1,10004,0,0),(1,10005,0,0),(1,10006,0,0),(1,10007,0,0),(1,10008,0,0),(1,10009,0,0),(1,10011,0,0),(1,20001,0,0),(1,20002,0,0),(1,20003,0,0),(1,20004,0,0),(1,20005,0,0),(1,20006,0,0),(1,30011,0,0),(1,30012,0,0),(1,30013,0,0),(1,30105,0,0),(1,30106,0,0),(1,30107,0,0),(1,30108,0,0),(1,30109,0,0),(1,30110,0,0),(1,30111,0,0),(1,30112,0,0),(1,30113,0,0),(1,30114,0,0),(1,30115,0,0),(1,30116,0,0),(1,30117,0,0),(1,30118,0,0),(1,30119,0,0),(1,30201,0,0),(1,30202,0,0),(1,30203,0,0),(1,30204,0,0),(1,30205,0,0),(1,30206,0,0),(1,30207,0,0),(1,30208,0,0),(1,30209,0,0),(1,30210,0,0),(1,30211,0,0),(1,30212,0,0),(1,30213,0,0),(1,30214,0,0),(1,30301,0,0),(1,30302,0,0),(1,30303,0,0),(1,30304,0,0),(1,30305,0,0),(1,30306,0,0),(1,30307,0,0),(1,30308,0,0),(1,30309,0,0),(1,30310,0,0),(1,30311,0,0),(1,30312,0,0),(1,30313,0,0),(1,30314,0,0),(1,30401,0,0),(1,30402,0,0),(1,30403,0,0),(1,30404,0,0),(1,30405,0,0),(1,30406,0,0),(1,30407,0,0),(1,30408,0,0),(1,30409,0,0),(1,30410,0,0),(1,30411,0,0),(1,30501,1,0),(1,30502,1,0),(1,30503,1,0),(1,30504,1,0),(1,30505,1,0),(1,30506,1,0),(1,30507,1,0),(1,30508,1,0),(1,30509,1,0),(1,30510,1,0),(1,30511,1,0),(1,30512,1,0),(1,30513,1,0),(1,30514,1,0),(1,30515,1,0),(1,30516,1,0),(1,30517,1,0),(1,30518,1,0),(1,30519,1,0),(1,30520,1,0),(1,30521,1,0),(1,30522,1,0),(1,30523,1,0),(1,30524,1,0),(1,30525,1,0),(1,30526,1,0),(1,30527,1,0),(1,30528,1,0),(1,30529,1,0),(1,30530,1,0),(1,30531,1,0),(1,30532,1,0),(1,30533,1,0),(1,30534,1,0),(1,30535,1,0),(1,30536,1,0),(1,30537,1,0),(1,30538,1,0),(1,30539,1,0),(1,30601,0,0),(1,30602,0,0),(1,30603,0,0),(1,30604,0,0),(1,30605,0,0),(1,30606,0,0),(1,30607,0,0),(1,30608,0,0),(1,30609,0,0),(1,30610,0,0),(1,30611,0,0),(1,30612,0,0),(1,30613,0,0),(1,30614,0,0),(1,30701,0,0),(1,30702,0,0),(1,30703,0,0),(1,30704,0,0),(1,30705,0,0),(1,30706,0,0),(1,30707,0,0),(1,30708,0,0),(1,30709,0,0),(1,30710,0,0),(1,30711,0,0),(1,30712,0,0),(1,30801,0,0),(1,30802,0,0),(1,30803,0,0),(1,30804,0,0),(1,30805,0,0),(1,30806,0,0),(1,30807,0,0),(1,30808,0,0),(1,30809,0,0),(1,30810,0,0),(1,30811,0,0),(1,30812,0,0),(1,30901,0,0),(1,30902,0,0),(1,30903,0,0),(1,30904,0,0),(1,30905,0,0),(1,30906,0,0),(1,30907,0,0),(1,30908,0,0),(1,30909,0,0),(1,30910,0,0),(1,30911,0,0),(1,30912,0,0),(1,30913,0,0),(1,30914,0,0),(1,30915,0,0),(1,30916,0,0),(1,30917,0,0),(1,30918,0,0),(1,30919,0,0),(1,30920,0,0),(1,31001,0,0),(1,31002,0,0),(1,31003,0,0),(1,31004,0,0),(1,31005,0,0),(1,31006,0,0),(1,31007,0,0),(1,31008,0,0),(1,31009,0,0),(1,31010,0,0),(1,31011,0,0),(1,31012,0,0),(1,31013,0,0),(1,31014,0,0),(1,31015,0,0),(1,31016,0,0),(1,31017,0,0),(1,31018,0,0),(1,31019,0,0),(1,31020,0,0),(1,31021,0,0),(1,31022,0,0),(1,31023,0,0),(1,31024,0,0),(1,31025,0,0),(1,31026,0,0),(1,31027,0,0),(1,31028,0,0),(1,31029,0,0),(1,31030,0,0),(1,31101,0,0),(1,31102,0,0),(1,31103,0,0),(1,31104,0,0),(1,31105,0,0),(1,31106,0,0),(1,31107,0,0),(1,31108,0,0),(1,31109,0,0),(1,31110,0,0),(1,31111,0,0),(1,31112,0,0),(1,31113,0,0),(1,31114,0,0),(1,31115,0,0),(1,31116,0,0),(1,31117,0,0),(1,31118,0,0),(1,31119,0,0),(1,31120,0,0),(1,31121,0,0),(1,31122,0,0),(1,31123,0,0),(1,31124,0,0),(1,31125,0,0),(1,31126,0,0),(1,31127,0,0),(1,31128,0,0),(1,31129,0,0),(1,31130,0,0),(1,31201,0,0),(1,31202,0,0),(1,31203,0,0),(1,31204,0,0),(1,31205,0,0),(1,31206,0,0),(1,31207,0,0),(1,31208,0,0),(1,31209,0,0),(1,31210,0,0),(1,31211,0,0),(1,31212,0,0),(1,31213,0,0),(1,31214,0,0),(1,31215,0,0),(1,31216,0,0),(1,31217,0,0),(1,31218,0,0),(1,31219,0,0),(1,31220,0,0),(1,31221,0,0),(1,31222,0,0),(1,31223,0,0),(1,31224,0,0),(1,31225,0,0),(1,31226,0,0),(1,31227,0,0),(1,31228,0,0),(1,31229,0,0),(1,31230,0,0),(1,31231,0,0),(1,31232,0,0),(1,31233,0,0),(1,31234,0,0),(1,31235,0,0),(1,31236,0,0),(1,31237,0,0),(1,31238,0,0),(1,31239,0,0),(1,31240,0,0),(1,31241,0,0),(1,31242,0,0),(1,31243,0,0),(1,31244,0,0),(1,31245,0,0),(1,31246,0,0),(1,31247,0,0),(1,31248,0,0),(1,31249,0,0),(1,31250,0,0),(1,31301,0,0),(1,31302,0,0),(1,31303,0,0),(1,31304,0,0),(1,31305,0,0),(1,31306,0,0),(1,31307,0,0),(1,31308,0,0),(1,31309,0,0),(1,31310,0,0),(1,31311,0,0),(1,31312,0,0),(1,31313,0,0),(1,31314,0,0),(1,31315,0,0),(1,31316,0,0),(1,31317,0,0),(1,31318,0,0),(1,31319,0,0),(1,31320,0,0),(1,31321,0,0),(1,31322,0,0),(1,31323,0,0),(1,31324,0,0),(1,31325,0,0),(1,31326,0,0),(1,31327,0,0),(1,31328,0,0),(1,31401,0,0),(1,31402,0,0),(1,31403,0,0),(1,31404,0,0),(1,31405,0,0),(1,31406,0,0),(1,31407,0,0),(1,31408,0,0),(1,31409,0,0),(1,31410,0,0),(1,31411,0,0),(1,31412,0,0),(1,31413,0,0),(1,31414,0,0),(1,31415,0,0),(1,31416,0,0),(1,31417,0,0),(1,31418,0,0),(1,31419,0,0),(1,31420,0,0),(1,31501,0,0),(1,31502,0,0),(1,31503,0,0),(1,31504,0,0),(1,31505,0,0),(1,31506,0,0),(1,31507,0,0),(1,31508,0,0),(1,31509,0,0),(1,31510,0,0),(1,31511,0,0),(1,31512,0,0),(1,31513,0,0),(1,31514,0,0),(1,31515,0,0),(1,31516,0,0),(1,31517,0,0),(1,31518,0,0),(1,31519,0,0),(1,31520,0,0),(1,31521,0,0),(1,31522,0,0),(1,31523,0,0),(1,31524,0,0),(1,31525,0,0),(1,31526,0,0),(1,31527,0,0),(1,31528,0,0),(1,31529,0,0),(1,31530,0,0),(1,31601,0,0),(1,31602,0,0),(1,31603,0,0),(1,31604,0,0),(1,31605,0,0),(1,31606,0,0),(1,31607,0,0),(1,31608,0,0),(1,31609,0,0),(1,31610,0,0),(1,31611,0,0),(1,31612,0,0),(1,31613,0,0),(1,31614,0,0),(1,31615,0,0),(1,31616,0,0),(1,31617,0,0),(1,31618,0,0),(1,31619,0,0),(1,31620,0,0),(1,31621,0,0),(1,31622,0,0),(1,31623,0,0),(1,31624,0,0),(1,31625,0,0),(1,31626,0,0),(1,31627,0,0),(1,31628,0,0),(1,31629,0,0),(1,31630,0,0),(1,31701,0,0),(1,31702,0,0),(1,31703,0,0),(1,31704,0,0),(1,31705,0,0),(1,31706,0,0),(1,31707,0,0),(1,31708,0,0),(1,31709,0,0),(1,31710,0,0),(1,31711,0,0),(1,31712,0,0),(1,31713,0,0),(1,31714,0,0),(1,31801,0,0),(1,31802,0,0),(1,31803,0,0),(1,31901,0,0),(1,31902,0,0),(1,31903,0,0),(1,31904,0,0),(1,31905,0,0),(1,31906,0,0),(1,31907,0,0),(1,31908,0,0),(1,31909,0,0),(1,31910,0,0),(1,31911,0,0),(1,31912,0,0),(1,32001,1,0),(1,32002,1,0),(1,32003,1,0),(1,32004,1,0),(1,32005,1,0),(1,32006,1,0),(1,32007,1,0),(1,32008,1,0),(1,32009,1,0),(1,32010,1,0),(1,32011,1,0),(1,32012,1,0),(1,32013,1,0),(1,32014,1,0),(1,32015,1,0),(1,32016,1,0),(1,32017,1,0),(1,32018,1,0),(1,32019,1,0),(1,32020,1,0),(1,32021,1,0),(1,32022,1,0),(1,32023,1,0),(1,32024,1,0),(2,10001,1,1),(2,10002,1,1),(2,10003,0,0),(2,10005,0,0),(2,10006,0,0),(2,10007,0,0),(2,10008,0,0),(2,10009,0,0),(2,10010,0,0),(2,10011,0,0),(2,20001,93,0),(2,20002,0,0),(2,20003,0,0),(2,20004,0,0),(2,20005,0,0),(2,20006,0,0),(2,30011,0,0),(2,30012,0,0),(2,30013,0,0),(2,30105,0,0),(2,30106,0,0),(2,30107,0,0),(2,30108,0,0),(2,30109,0,0),(2,30110,0,0),(2,30111,0,0),(2,30112,0,0),(2,30113,0,0),(2,30114,0,0),(2,30115,0,0),(2,30116,0,0),(2,30117,0,0),(2,30118,0,0),(2,30119,0,0),(2,30201,0,0),(2,30202,0,0),(2,30203,0,0),(2,30204,0,0),(2,30205,0,0),(2,30206,0,0),(2,30207,0,0),(2,30208,0,0),(2,30209,0,0),(2,30210,0,0),(2,30211,0,0),(2,30212,0,0),(2,30213,0,0),(2,30214,0,0),(2,30301,0,0),(2,30302,0,0),(2,30303,0,0),(2,30304,0,0),(2,30305,0,0),(2,30306,0,0),(2,30307,0,0),(2,30308,0,0),(2,30309,0,0),(2,30310,0,0),(2,30311,0,0),(2,30312,0,0),(2,30313,0,0),(2,30314,0,0),(2,30401,0,0),(2,30402,0,0),(2,30403,0,0),(2,30404,0,0),(2,30405,0,0),(2,30406,0,0),(2,30407,0,0),(2,30408,0,0),(2,30409,0,0),(2,30410,0,0),(2,30411,0,0),(2,30501,1,0),(2,30502,1,0),(2,30503,1,0),(2,30504,1,0),(2,30505,1,0),(2,30506,1,0),(2,30507,1,0),(2,30508,1,0),(2,30509,1,0),(2,30510,1,0),(2,30511,1,0),(2,30512,1,0),(2,30513,1,0),(2,30514,1,0),(2,30515,1,0),(2,30516,1,0),(2,30517,1,0),(2,30518,1,0),(2,30519,1,0),(2,30520,1,0),(2,30521,1,0),(2,30522,1,0),(2,30523,1,0),(2,30524,1,0),(2,30525,1,0),(2,30526,1,0),(2,30527,1,0),(2,30528,1,0),(2,30529,1,0),(2,30530,1,0),(2,30531,1,0),(2,30532,1,0),(2,30533,1,0),(2,30534,1,0),(2,30535,1,0),(2,30536,1,0),(2,30537,1,0),(2,30538,1,0),(2,30539,1,0),(2,30601,0,0),(2,30602,0,0),(2,30603,0,0),(2,30604,0,0),(2,30605,0,0),(2,30606,0,0),(2,30607,0,0),(2,30608,0,0),(2,30609,0,0),(2,30610,0,0),(2,30611,0,0),(2,30612,0,0),(2,30613,0,0),(2,30614,0,0),(2,30701,0,0),(2,30702,0,0),(2,30703,0,0),(2,30704,0,0),(2,30705,0,0),(2,30706,0,0),(2,30707,0,0),(2,30708,0,0),(2,30709,0,0),(2,30710,0,0),(2,30711,0,0),(2,30712,0,0),(2,30801,0,0),(2,30802,0,0),(2,30803,0,0),(2,30804,0,0),(2,30805,0,0),(2,30806,0,0),(2,30807,0,0),(2,30808,0,0),(2,30809,0,0),(2,30810,0,0),(2,30811,0,0),(2,30812,0,0),(2,30901,0,0),(2,30902,0,0),(2,30903,0,0),(2,30904,0,0),(2,30905,0,0),(2,30906,0,0),(2,30907,0,0),(2,30908,0,0),(2,30909,0,0),(2,30910,0,0),(2,30911,0,0),(2,30912,0,0),(2,30913,0,0),(2,30914,0,0),(2,30915,0,0),(2,30916,0,0),(2,30917,0,0),(2,30918,0,0),(2,30919,0,0),(2,30920,0,0),(2,31001,0,0),(2,31002,0,0),(2,31003,0,0),(2,31004,0,0),(2,31005,0,0),(2,31006,0,0),(2,31007,0,0),(2,31008,0,0),(2,31009,0,0),(2,31010,0,0),(2,31011,0,0),(2,31012,0,0),(2,31013,0,0),(2,31014,0,0),(2,31015,0,0),(2,31016,0,0),(2,31017,0,0),(2,31018,0,0),(2,31019,0,0),(2,31020,0,0),(2,31021,0,0),(2,31022,0,0),(2,31023,0,0),(2,31024,0,0),(2,31025,0,0),(2,31026,0,0),(2,31027,0,0),(2,31028,0,0),(2,31029,0,0),(2,31030,0,0),(2,31101,0,0),(2,31102,0,0),(2,31103,0,0),(2,31104,0,0),(2,31105,0,0),(2,31106,0,0),(2,31107,0,0),(2,31108,0,0),(2,31109,0,0),(2,31110,0,0),(2,31111,0,0),(2,31112,0,0),(2,31113,0,0),(2,31114,0,0),(2,31115,0,0),(2,31116,0,0),(2,31117,0,0),(2,31118,0,0),(2,31119,0,0),(2,31120,0,0),(2,31121,0,0),(2,31122,0,0),(2,31123,0,0),(2,31124,0,0),(2,31125,0,0),(2,31126,0,0),(2,31127,0,0),(2,31128,0,0),(2,31129,0,0),(2,31130,0,0),(2,31201,0,0),(2,31202,0,0),(2,31203,0,0),(2,31204,0,0),(2,31205,0,0),(2,31206,0,0),(2,31207,0,0),(2,31208,0,0),(2,31209,0,0),(2,31210,0,0),(2,31211,0,0),(2,31212,0,0),(2,31213,0,0),(2,31214,0,0),(2,31215,0,0),(2,31216,0,0),(2,31217,0,0),(2,31218,0,0),(2,31219,0,0),(2,31220,0,0),(2,31221,0,0),(2,31222,0,0),(2,31223,0,0),(2,31224,0,0),(2,31225,0,0),(2,31226,0,0),(2,31227,0,0),(2,31228,0,0),(2,31229,0,0),(2,31230,0,0),(2,31231,0,0),(2,31232,0,0),(2,31233,0,0),(2,31234,0,0),(2,31235,0,0),(2,31236,0,0),(2,31237,0,0),(2,31238,0,0),(2,31239,0,0),(2,31240,0,0),(2,31241,0,0),(2,31242,0,0),(2,31243,0,0),(2,31244,0,0),(2,31245,0,0),(2,31246,0,0),(2,31247,0,0),(2,31248,0,0),(2,31249,0,0),(2,31250,0,0),(2,31301,0,0),(2,31302,0,0),(2,31303,0,0),(2,31304,0,0),(2,31305,0,0),(2,31306,0,0),(2,31307,0,0),(2,31308,0,0),(2,31309,0,0),(2,31310,0,0),(2,31311,0,0),(2,31312,0,0),(2,31313,0,0),(2,31314,0,0),(2,31315,0,0),(2,31316,0,0),(2,31317,0,0),(2,31318,0,0),(2,31319,0,0),(2,31320,0,0),(2,31321,0,0),(2,31322,0,0),(2,31323,0,0),(2,31324,0,0),(2,31325,0,0),(2,31326,0,0),(2,31327,0,0),(2,31328,0,0),(2,31401,0,0),(2,31402,0,0),(2,31403,0,0),(2,31404,0,0),(2,31405,0,0),(2,31406,0,0),(2,31407,0,0),(2,31408,0,0),(2,31409,0,0),(2,31410,0,0),(2,31411,0,0),(2,31412,0,0),(2,31413,0,0),(2,31414,0,0),(2,31415,0,0),(2,31416,0,0),(2,31417,0,0),(2,31418,0,0),(2,31419,0,0),(2,31420,0,0),(2,31501,0,0),(2,31502,0,0),(2,31503,0,0),(2,31504,0,0),(2,31505,0,0),(2,31506,0,0),(2,31507,0,0),(2,31508,0,0),(2,31509,0,0),(2,31510,0,0),(2,31511,0,0),(2,31512,0,0),(2,31513,0,0),(2,31514,0,0),(2,31515,0,0),(2,31516,0,0),(2,31517,0,0),(2,31518,0,0),(2,31519,0,0),(2,31520,0,0),(2,31521,0,0),(2,31522,0,0),(2,31523,0,0),(2,31524,0,0),(2,31525,0,0),(2,31526,0,0),(2,31527,0,0),(2,31528,0,0),(2,31529,0,0),(2,31530,0,0),(2,31601,0,0),(2,31602,0,0),(2,31603,0,0),(2,31604,0,0),(2,31605,0,0),(2,31606,0,0),(2,31607,0,0),(2,31608,0,0),(2,31609,0,0),(2,31610,0,0),(2,31611,0,0),(2,31612,0,0),(2,31613,0,0),(2,31614,0,0),(2,31615,0,0),(2,31616,0,0),(2,31617,0,0),(2,31618,0,0),(2,31619,0,0),(2,31620,0,0),(2,31621,0,0),(2,31622,0,0),(2,31623,0,0),(2,31624,0,0),(2,31625,0,0),(2,31626,0,0),(2,31627,0,0),(2,31628,0,0),(2,31629,0,0),(2,31630,0,0),(2,31701,93,0),(2,31702,93,0),(2,31703,93,0),(2,31704,93,0),(2,31705,93,0),(2,31706,93,0),(2,31707,93,0),(2,31708,93,0),(2,31709,93,0),(2,31710,93,0),(2,31711,93,0),(2,31712,93,0),(2,31713,93,0),(2,31714,93,0),(2,31801,0,0),(2,31802,0,0),(2,31803,0,0),(2,31901,0,0),(2,31902,0,0),(2,31903,0,0),(2,31904,0,0),(2,31905,0,0),(2,31906,0,0),(2,31907,0,0),(2,31908,0,0),(2,31909,0,0),(2,31910,0,0),(2,31911,0,0),(2,31912,0,0),(2,32001,1,0),(2,32002,1,0),(2,32003,1,0),(2,32004,1,0),(2,32005,1,0),(2,32006,1,0),(2,32007,1,0),(2,32008,1,0),(2,32009,1,0),(2,32010,1,0),(2,32011,1,0),(2,32012,1,0),(2,32013,1,0),(2,32014,1,0),(2,32015,1,0),(2,32016,1,0),(2,32017,1,0),(2,32018,1,0),(2,32019,1,0),(2,32020,1,0),(2,32021,1,0),(2,32022,1,0),(2,32023,1,0),(2,32024,1,0),(13,10001,1,1),(13,10002,0,0),(13,10003,0,0),(13,10004,0,0),(13,10005,0,0),(13,10006,0,0),(13,10007,0,0),(13,10008,0,0),(13,10010,0,0),(13,10011,0,0),(13,20001,0,0),(13,20002,0,0),(13,20003,0,0),(13,20004,0,0),(13,20005,0,0),(13,20006,0,0),(13,30011,0,0),(13,30012,0,0),(13,30013,0,0),(13,30105,0,0),(13,30106,0,0),(13,30107,0,0),(13,30108,0,0),(13,30109,0,0),(13,30110,0,0),(13,30111,0,0),(13,30112,0,0),(13,30113,0,0),(13,30114,0,0),(13,30115,0,0),(13,30116,0,0),(13,30117,0,0),(13,30118,0,0),(13,30119,0,0),(13,30201,0,0),(13,30202,0,0),(13,30203,0,0),(13,30204,0,0),(13,30205,0,0),(13,30206,0,0),(13,30207,0,0),(13,30208,0,0),(13,30209,0,0),(13,30210,0,0),(13,30211,0,0),(13,30212,0,0),(13,30213,0,0),(13,30214,0,0),(13,30301,0,0),(13,30302,0,0),(13,30303,0,0),(13,30304,0,0),(13,30305,0,0),(13,30306,0,0),(13,30307,0,0),(13,30308,0,0),(13,30309,0,0),(13,30310,0,0),(13,30311,0,0),(13,30312,0,0),(13,30313,0,0),(13,30314,0,0),(13,30401,0,0),(13,30402,0,0),(13,30403,0,0),(13,30404,0,0),(13,30405,0,0),(13,30406,0,0),(13,30407,0,0),(13,30408,0,0),(13,30409,0,0),(13,30410,0,0),(13,30411,0,0),(13,30501,1,0),(13,30502,1,0),(13,30503,1,0),(13,30504,1,0),(13,30505,1,0),(13,30506,1,0),(13,30507,1,0),(13,30508,1,0),(13,30509,1,0),(13,30510,1,0),(13,30511,1,0),(13,30512,1,0),(13,30513,1,0),(13,30514,1,0),(13,30515,1,0),(13,30516,1,0),(13,30517,1,0),(13,30518,1,0),(13,30519,1,0),(13,30520,1,0),(13,30521,1,0),(13,30522,1,0),(13,30523,1,0),(13,30524,1,0),(13,30525,1,0),(13,30526,1,0),(13,30527,1,0),(13,30528,1,0),(13,30529,1,0),(13,30530,1,0),(13,30531,1,0),(13,30532,1,0),(13,30533,1,0),(13,30534,1,0),(13,30535,1,0),(13,30536,1,0),(13,30537,1,0),(13,30538,1,0),(13,30539,1,0),(13,30601,0,0),(13,30602,0,0),(13,30603,0,0),(13,30604,0,0),(13,30605,0,0),(13,30606,0,0),(13,30607,0,0),(13,30608,0,0),(13,30609,0,0),(13,30610,0,0),(13,30611,0,0),(13,30612,0,0),(13,30613,0,0),(13,30614,0,0),(13,30701,0,0),(13,30702,0,0),(13,30703,0,0),(13,30704,0,0),(13,30705,0,0),(13,30706,0,0),(13,30707,0,0),(13,30708,0,0),(13,30709,0,0),(13,30710,0,0),(13,30711,0,0),(13,30712,0,0),(13,30801,0,0),(13,30802,0,0),(13,30803,0,0),(13,30804,0,0),(13,30805,0,0),(13,30806,0,0),(13,30807,0,0),(13,30808,0,0),(13,30809,0,0),(13,30810,0,0),(13,30811,0,0),(13,30812,0,0),(13,30901,0,0),(13,30902,0,0),(13,30903,0,0),(13,30904,0,0),(13,30905,0,0),(13,30906,0,0),(13,30907,0,0),(13,30908,0,0),(13,30909,0,0),(13,30910,0,0),(13,30911,0,0),(13,30912,0,0),(13,30913,0,0),(13,30914,0,0),(13,30915,0,0),(13,30916,0,0),(13,30917,0,0),(13,30918,0,0),(13,30919,0,0),(13,30920,0,0),(13,31001,0,0),(13,31002,0,0),(13,31003,0,0),(13,31004,0,0),(13,31005,0,0),(13,31006,0,0),(13,31007,0,0),(13,31008,0,0),(13,31009,0,0),(13,31010,0,0),(13,31011,0,0),(13,31012,0,0),(13,31013,0,0),(13,31014,0,0),(13,31015,0,0),(13,31016,0,0),(13,31017,0,0),(13,31018,0,0),(13,31019,0,0),(13,31020,0,0),(13,31021,0,0),(13,31022,0,0),(13,31023,0,0),(13,31024,0,0),(13,31025,0,0),(13,31026,0,0),(13,31027,0,0),(13,31028,0,0),(13,31029,0,0),(13,31030,0,0),(13,31101,0,0),(13,31102,0,0),(13,31103,0,0),(13,31104,0,0),(13,31105,0,0),(13,31106,0,0),(13,31107,0,0),(13,31108,0,0),(13,31109,0,0),(13,31110,0,0),(13,31111,0,0),(13,31112,0,0),(13,31113,0,0),(13,31114,0,0),(13,31115,0,0),(13,31116,0,0),(13,31117,0,0),(13,31118,0,0),(13,31119,0,0),(13,31120,0,0),(13,31121,0,0),(13,31122,0,0),(13,31123,0,0),(13,31124,0,0),(13,31125,0,0),(13,31126,0,0),(13,31127,0,0),(13,31128,0,0),(13,31129,0,0),(13,31130,0,0),(13,31201,0,0),(13,31202,0,0),(13,31203,0,0),(13,31204,0,0),(13,31205,0,0),(13,31206,0,0),(13,31207,0,0),(13,31208,0,0),(13,31209,0,0),(13,31210,0,0),(13,31211,0,0),(13,31212,0,0),(13,31213,0,0),(13,31214,0,0),(13,31215,0,0),(13,31216,0,0),(13,31217,0,0),(13,31218,0,0),(13,31219,0,0),(13,31220,0,0),(13,31221,0,0),(13,31222,0,0),(13,31223,0,0),(13,31224,0,0),(13,31225,0,0),(13,31226,0,0),(13,31227,0,0),(13,31228,0,0),(13,31229,0,0),(13,31230,0,0),(13,31231,0,0),(13,31232,0,0),(13,31233,0,0),(13,31234,0,0),(13,31235,0,0),(13,31236,0,0),(13,31237,0,0),(13,31238,0,0),(13,31239,0,0),(13,31240,0,0),(13,31241,0,0),(13,31242,0,0),(13,31243,0,0),(13,31244,0,0),(13,31245,0,0),(13,31246,0,0),(13,31247,0,0),(13,31248,0,0),(13,31249,0,0),(13,31250,0,0),(13,31301,0,0),(13,31302,0,0),(13,31303,0,0),(13,31304,0,0),(13,31305,0,0),(13,31306,0,0),(13,31307,0,0),(13,31308,0,0),(13,31309,0,0),(13,31310,0,0),(13,31311,0,0),(13,31312,0,0),(13,31313,0,0),(13,31314,0,0),(13,31315,0,0),(13,31316,0,0),(13,31317,0,0),(13,31318,0,0),(13,31319,0,0),(13,31320,0,0),(13,31321,0,0),(13,31322,0,0),(13,31323,0,0),(13,31324,0,0),(13,31325,0,0),(13,31326,0,0),(13,31327,0,0),(13,31328,0,0),(13,31401,0,0),(13,31402,0,0),(13,31403,0,0),(13,31404,0,0),(13,31405,0,0),(13,31406,0,0),(13,31407,0,0),(13,31408,0,0),(13,31409,0,0),(13,31410,0,0),(13,31411,0,0),(13,31412,0,0),(13,31413,0,0),(13,31414,0,0),(13,31415,0,0),(13,31416,0,0),(13,31417,0,0),(13,31418,0,0),(13,31419,0,0),(13,31420,0,0),(13,31501,0,0),(13,31502,0,0),(13,31503,0,0),(13,31504,0,0),(13,31505,0,0),(13,31506,0,0),(13,31507,0,0),(13,31508,0,0),(13,31509,0,0),(13,31510,0,0),(13,31511,0,0),(13,31512,0,0),(13,31513,0,0),(13,31514,0,0),(13,31515,0,0),(13,31516,0,0),(13,31517,0,0),(13,31518,0,0),(13,31519,0,0),(13,31520,0,0),(13,31521,0,0),(13,31522,0,0),(13,31523,0,0),(13,31524,0,0),(13,31525,0,0),(13,31526,0,0),(13,31527,0,0),(13,31528,0,0),(13,31529,0,0),(13,31530,0,0),(13,31601,0,0),(13,31602,0,0),(13,31603,0,0),(13,31604,0,0),(13,31605,0,0),(13,31606,0,0),(13,31607,0,0),(13,31608,0,0),(13,31609,0,0),(13,31610,0,0),(13,31611,0,0),(13,31612,0,0),(13,31613,0,0),(13,31614,0,0),(13,31615,0,0),(13,31616,0,0),(13,31617,0,0),(13,31618,0,0),(13,31619,0,0),(13,31620,0,0),(13,31621,0,0),(13,31622,0,0),(13,31623,0,0),(13,31624,0,0),(13,31625,0,0),(13,31626,0,0),(13,31627,0,0),(13,31628,0,0),(13,31629,0,0),(13,31630,0,0),(13,31701,0,0),(13,31702,0,0),(13,31703,0,0),(13,31704,0,0),(13,31705,0,0),(13,31706,0,0),(13,31707,0,0),(13,31708,0,0),(13,31709,0,0),(13,31710,0,0),(13,31711,0,0),(13,31712,0,0),(13,31713,0,0),(13,31714,0,0),(13,31801,0,0),(13,31802,0,0),(13,31803,0,0),(13,31901,0,0),(13,31902,0,0),(13,31903,0,0),(13,31904,0,0),(13,31905,0,0),(13,31906,0,0),(13,31907,0,0),(13,31908,0,0),(13,31909,0,0),(13,31910,0,0),(13,31911,0,0),(13,31912,0,0),(13,32001,0,0),(13,32002,0,0),(13,32003,0,0),(13,32004,0,0),(13,32005,0,0),(13,32006,0,0),(13,32007,0,0),(13,32008,0,0),(13,32009,0,0),(13,32010,0,0),(13,32011,0,0),(13,32012,0,0),(13,32013,0,0),(13,32014,0,0),(13,32015,0,0),(13,32016,0,0),(13,32017,0,0),(13,32018,0,0),(13,32019,0,0),(13,32020,0,0),(13,32021,0,0),(13,32022,0,0),(13,32023,0,0),(13,32024,0,0),(31,10001,1,1),(31,10002,1,1),(31,10003,0,0),(31,10004,0,0),(31,10006,0,0),(31,10007,0,0),(31,10008,0,0),(31,10009,0,0),(31,10010,0,0),(31,10011,0,0),(31,20001,1363,0),(31,20002,1,0),(31,20003,0,0),(31,20004,0,0),(31,20005,0,0),(31,20006,2,0),(31,30011,9,1),(31,30012,8,1),(31,30013,0,0),(31,30105,9,1),(31,30106,18,1),(31,30107,19,0),(31,30108,19,0),(31,30109,19,0),(31,30110,19,0),(31,30111,19,0),(31,30112,19,0),(31,30113,19,0),(31,30114,19,0),(31,30115,19,0),(31,30116,19,0),(31,30117,19,0),(31,30118,19,0),(31,30119,19,0),(31,30201,0,0),(31,30202,0,0),(31,30203,0,0),(31,30204,0,0),(31,30205,0,0),(31,30206,0,0),(31,30207,0,0),(31,30208,0,0),(31,30209,0,0),(31,30210,0,0),(31,30211,0,0),(31,30212,0,0),(31,30213,0,0),(31,30214,0,0),(31,30301,161400,1),(31,30302,185780,0),(31,30303,185780,0),(31,30304,185780,0),(31,30305,185780,0),(31,30306,185780,0),(31,30307,185780,0),(31,30308,185780,0),(31,30309,185780,0),(31,30310,185780,0),(31,30311,185780,0),(31,30312,185780,0),(31,30313,185780,0),(31,30314,185780,0),(31,30401,4,0),(31,30402,4,0),(31,30403,4,0),(31,30404,4,0),(31,30405,4,0),(31,30406,4,0),(31,30407,4,0),(31,30408,4,0),(31,30409,4,0),(31,30410,4,0),(31,30411,4,0),(31,30501,1,0),(31,30502,1,0),(31,30503,1,0),(31,30504,1,0),(31,30505,1,0),(31,30506,1,0),(31,30507,1,0),(31,30508,1,0),(31,30509,1,0),(31,30510,1,0),(31,30511,1,0),(31,30512,1,0),(31,30513,1,0),(31,30514,1,0),(31,30515,1,0),(31,30516,1,0),(31,30517,1,0),(31,30518,1,0),(31,30519,1,0),(31,30520,1,0),(31,30521,1,0),(31,30522,1,0),(31,30523,1,0),(31,30524,1,0),(31,30525,1,0),(31,30526,1,0),(31,30527,1,0),(31,30528,1,0),(31,30529,1,0),(31,30530,1,0),(31,30531,1,0),(31,30532,1,0),(31,30533,1,0),(31,30534,1,0),(31,30535,1,0),(31,30536,1,0),(31,30537,1,0),(31,30538,1,0),(31,30539,1,0),(31,30601,1,0),(31,30602,1,0),(31,30603,1,0),(31,30604,1,0),(31,30605,1,0),(31,30606,1,0),(31,30607,1,0),(31,30608,1,0),(31,30609,1,0),(31,30610,1,0),(31,30611,1,0),(31,30612,1,0),(31,30613,1,0),(31,30614,1,0),(31,30701,0,0),(31,30702,0,0),(31,30703,0,0),(31,30704,0,0),(31,30705,0,0),(31,30706,0,0),(31,30707,0,0),(31,30708,0,0),(31,30709,0,0),(31,30710,0,0),(31,30711,0,0),(31,30712,0,0),(31,30801,0,0),(31,30802,0,0),(31,30803,0,0),(31,30804,0,0),(31,30805,0,0),(31,30806,0,0),(31,30807,0,0),(31,30808,0,0),(31,30809,0,0),(31,30810,0,0),(31,30811,0,0),(31,30812,0,0),(31,30901,0,0),(31,30902,0,0),(31,30903,0,0),(31,30904,0,0),(31,30905,0,0),(31,30906,0,0),(31,30907,0,0),(31,30908,0,0),(31,30909,0,0),(31,30910,0,0),(31,30911,0,0),(31,30912,0,0),(31,30913,0,0),(31,30914,0,0),(31,30915,0,0),(31,30916,0,0),(31,30917,0,0),(31,30918,0,0),(31,30919,0,0),(31,30920,0,0),(31,31001,10,1),(31,31002,20,1),(31,31003,20,0),(31,31004,20,0),(31,31005,20,0),(31,31006,20,0),(31,31007,20,0),(31,31008,20,0),(31,31009,20,0),(31,31010,20,0),(31,31011,20,0),(31,31012,20,0),(31,31013,20,0),(31,31014,20,0),(31,31015,20,0),(31,31016,20,0),(31,31017,20,0),(31,31018,20,0),(31,31019,20,0),(31,31020,20,0),(31,31021,20,0),(31,31022,20,0),(31,31023,20,0),(31,31024,20,0),(31,31025,20,0),(31,31026,20,0),(31,31027,20,0),(31,31028,20,0),(31,31029,20,0),(31,31030,20,0),(31,31101,0,0),(31,31102,0,0),(31,31103,0,0),(31,31104,0,0),(31,31105,0,0),(31,31106,0,0),(31,31107,0,0),(31,31108,0,0),(31,31109,0,0),(31,31110,0,0),(31,31111,0,0),(31,31112,0,0),(31,31113,0,0),(31,31114,0,0),(31,31115,0,0),(31,31116,0,0),(31,31117,0,0),(31,31118,0,0),(31,31119,0,0),(31,31120,0,0),(31,31121,0,0),(31,31122,0,0),(31,31123,0,0),(31,31124,0,0),(31,31125,0,0),(31,31126,0,0),(31,31127,0,0),(31,31128,0,0),(31,31129,0,0),(31,31130,0,0),(31,31201,1,1),(31,31202,1,0),(31,31203,1,0),(31,31204,1,0),(31,31205,1,0),(31,31206,1,0),(31,31207,1,0),(31,31208,1,0),(31,31209,1,0),(31,31210,1,0),(31,31211,1,0),(31,31212,1,0),(31,31213,1,0),(31,31214,1,0),(31,31215,1,0),(31,31216,1,0),(31,31217,1,0),(31,31218,1,0),(31,31219,1,0),(31,31220,1,0),(31,31221,1,0),(31,31222,1,0),(31,31223,1,0),(31,31224,1,0),(31,31225,1,0),(31,31226,1,0),(31,31227,1,0),(31,31228,1,0),(31,31229,1,0),(31,31230,1,0),(31,31231,1,0),(31,31232,1,0),(31,31233,1,0),(31,31234,1,0),(31,31235,1,0),(31,31236,1,0),(31,31237,1,0),(31,31238,1,0),(31,31239,1,0),(31,31240,1,0),(31,31241,1,0),(31,31242,1,0),(31,31243,1,0),(31,31244,1,0),(31,31245,1,0),(31,31246,1,0),(31,31247,1,0),(31,31248,1,0),(31,31249,1,0),(31,31250,1,0),(31,31301,0,0),(31,31302,0,0),(31,31303,0,0),(31,31304,0,0),(31,31305,0,0),(31,31306,0,0),(31,31307,0,0),(31,31308,0,0),(31,31309,0,0),(31,31310,0,0),(31,31311,0,0),(31,31312,0,0),(31,31313,0,0),(31,31314,0,0),(31,31315,0,0),(31,31316,0,0),(31,31317,0,0),(31,31318,0,0),(31,31319,0,0),(31,31320,0,0),(31,31321,0,0),(31,31322,0,0),(31,31323,0,0),(31,31324,0,0),(31,31325,0,0),(31,31326,0,0),(31,31327,0,0),(31,31328,0,0),(31,31401,0,0),(31,31402,0,0),(31,31403,0,0),(31,31404,0,0),(31,31405,0,0),(31,31406,0,0),(31,31407,0,0),(31,31408,0,0),(31,31409,0,0),(31,31410,0,0),(31,31411,0,0),(31,31412,0,0),(31,31413,0,0),(31,31414,0,0),(31,31415,0,0),(31,31416,0,0),(31,31417,0,0),(31,31418,0,0),(31,31419,0,0),(31,31420,0,0),(31,31501,2,0),(31,31502,2,0),(31,31503,2,0),(31,31504,2,0),(31,31505,2,0),(31,31506,2,0),(31,31507,2,0),(31,31508,2,0),(31,31509,2,0),(31,31510,2,0),(31,31511,2,0),(31,31512,2,0),(31,31513,2,0),(31,31514,2,0),(31,31515,2,0),(31,31516,2,0),(31,31517,2,0),(31,31518,2,0),(31,31519,2,0),(31,31520,2,0),(31,31521,2,0),(31,31522,2,0),(31,31523,2,0),(31,31524,2,0),(31,31525,2,0),(31,31526,2,0),(31,31527,2,0),(31,31528,2,0),(31,31529,2,0),(31,31530,2,0),(31,31601,60,1),(31,31602,60,1),(31,31603,60,1),(31,31604,60,1),(31,31605,97,1),(31,31606,157,1),(31,31607,157,1),(31,31608,194,1),(31,31609,201,0),(31,31610,201,0),(31,31611,201,0),(31,31612,201,0),(31,31613,201,0),(31,31614,201,0),(31,31615,201,0),(31,31616,201,0),(31,31617,201,0),(31,31618,201,0),(31,31619,201,0),(31,31620,201,0),(31,31621,201,0),(31,31622,201,0),(31,31623,201,0),(31,31624,201,0),(31,31625,201,0),(31,31626,201,0),(31,31627,201,0),(31,31628,201,0),(31,31629,201,0),(31,31630,201,0),(31,31701,1363,0),(31,31702,1363,0),(31,31703,1363,0),(31,31704,1363,0),(31,31705,1363,0),(31,31706,1363,0),(31,31707,1363,0),(31,31708,1363,0),(31,31709,1363,0),(31,31710,1363,0),(31,31711,1363,0),(31,31712,1363,0),(31,31713,1363,0),(31,31714,1363,0),(31,31801,2,1),(31,31802,2,1),(31,31803,0,0),(31,31901,0,0),(31,31902,0,0),(31,31903,0,0),(31,31904,0,0),(31,31905,0,0),(31,31906,0,0),(31,31907,0,0),(31,31908,0,0),(31,31909,0,0),(31,31910,0,0),(31,31911,0,0),(31,31912,0,0),(31,32001,4,0),(31,32002,4,0),(31,32003,4,0),(31,32004,4,0),(31,32005,4,0),(31,32006,4,0),(31,32007,4,0),(31,32008,4,0),(31,32009,4,0),(31,32010,4,0),(31,32011,4,0),(31,32012,4,0),(31,32013,4,0),(31,32014,4,0),(31,32015,4,0),(31,32016,4,0),(31,32017,4,0),(31,32018,4,0),(31,32019,4,0),(31,32020,4,0),(31,32021,4,0),(31,32022,4,0),(31,32023,4,0),(31,32024,4,0),(36,10001,1,1),(36,10002,0,0),(36,10003,0,0),(36,10004,0,0),(36,10005,0,0),(36,10006,0,0),(36,10007,0,0),(36,10008,0,0),(36,10009,0,0),(36,10010,0,0),(36,20001,0,0),(36,20002,0,0),(36,20003,0,0),(36,20004,0,0),(36,20005,0,0),(36,20006,0,0),(36,30011,0,0),(36,30012,0,0),(36,30013,0,0),(36,30105,0,0),(36,30106,0,0),(36,30107,0,0),(36,30108,0,0),(36,30109,0,0),(36,30110,0,0),(36,30111,0,0),(36,30112,0,0),(36,30113,0,0),(36,30114,0,0),(36,30115,0,0),(36,30116,0,0),(36,30117,0,0),(36,30118,0,0),(36,30119,0,0),(36,30201,0,0),(36,30202,0,0),(36,30203,0,0),(36,30204,0,0),(36,30205,0,0),(36,30206,0,0),(36,30207,0,0),(36,30208,0,0),(36,30209,0,0),(36,30210,0,0),(36,30211,0,0),(36,30212,0,0),(36,30213,0,0),(36,30214,0,0),(36,30301,0,0),(36,30302,0,0),(36,30303,0,0),(36,30304,0,0),(36,30305,0,0),(36,30306,0,0),(36,30307,0,0),(36,30308,0,0),(36,30309,0,0),(36,30310,0,0),(36,30311,0,0),(36,30312,0,0),(36,30313,0,0),(36,30314,0,0),(36,30401,0,0),(36,30402,0,0),(36,30403,0,0),(36,30404,0,0),(36,30405,0,0),(36,30406,0,0),(36,30407,0,0),(36,30408,0,0),(36,30409,0,0),(36,30410,0,0),(36,30411,0,0),(36,30501,1,0),(36,30502,1,0),(36,30503,1,0),(36,30504,1,0),(36,30505,1,0),(36,30506,1,0),(36,30507,1,0),(36,30508,1,0),(36,30509,1,0),(36,30510,1,0),(36,30511,1,0),(36,30512,1,0),(36,30513,1,0),(36,30514,1,0),(36,30515,1,0),(36,30516,1,0),(36,30517,1,0),(36,30518,1,0),(36,30519,1,0),(36,30520,1,0),(36,30521,1,0),(36,30522,1,0),(36,30523,1,0),(36,30524,1,0),(36,30525,1,0),(36,30526,1,0),(36,30527,1,0),(36,30528,1,0),(36,30529,1,0),(36,30530,1,0),(36,30531,1,0),(36,30532,1,0),(36,30533,1,0),(36,30534,1,0),(36,30535,1,0),(36,30536,1,0),(36,30537,1,0),(36,30538,1,0),(36,30539,1,0),(36,30601,0,0),(36,30602,0,0),(36,30603,0,0),(36,30604,0,0),(36,30605,0,0),(36,30606,0,0),(36,30607,0,0),(36,30608,0,0),(36,30609,0,0),(36,30610,0,0),(36,30611,0,0),(36,30612,0,0),(36,30613,0,0),(36,30614,0,0),(36,30701,0,0),(36,30702,0,0),(36,30703,0,0),(36,30704,0,0),(36,30705,0,0),(36,30706,0,0),(36,30707,0,0),(36,30708,0,0),(36,30709,0,0),(36,30710,0,0),(36,30711,0,0),(36,30712,0,0),(36,30801,0,0),(36,30802,0,0),(36,30803,0,0),(36,30804,0,0),(36,30805,0,0),(36,30806,0,0),(36,30807,0,0),(36,30808,0,0),(36,30809,0,0),(36,30810,0,0),(36,30811,0,0),(36,30812,0,0),(36,30901,0,0),(36,30902,0,0),(36,30903,0,0),(36,30904,0,0),(36,30905,0,0),(36,30906,0,0),(36,30907,0,0),(36,30908,0,0),(36,30909,0,0),(36,30910,0,0),(36,30911,0,0),(36,30912,0,0),(36,30913,0,0),(36,30914,0,0),(36,30915,0,0),(36,30916,0,0),(36,30917,0,0),(36,30918,0,0),(36,30919,0,0),(36,30920,0,0),(36,31001,0,0),(36,31002,0,0),(36,31003,0,0),(36,31004,0,0),(36,31005,0,0),(36,31006,0,0),(36,31007,0,0),(36,31008,0,0),(36,31009,0,0),(36,31010,0,0),(36,31011,0,0),(36,31012,0,0),(36,31013,0,0),(36,31014,0,0),(36,31015,0,0),(36,31016,0,0),(36,31017,0,0),(36,31018,0,0),(36,31019,0,0),(36,31020,0,0),(36,31021,0,0),(36,31022,0,0),(36,31023,0,0),(36,31024,0,0),(36,31025,0,0),(36,31026,0,0),(36,31027,0,0),(36,31028,0,0),(36,31029,0,0),(36,31030,0,0),(36,31101,0,0),(36,31102,0,0),(36,31103,0,0),(36,31104,0,0),(36,31105,0,0),(36,31106,0,0),(36,31107,0,0),(36,31108,0,0),(36,31109,0,0),(36,31110,0,0),(36,31111,0,0),(36,31112,0,0),(36,31113,0,0),(36,31114,0,0),(36,31115,0,0),(36,31116,0,0),(36,31117,0,0),(36,31118,0,0),(36,31119,0,0),(36,31120,0,0),(36,31121,0,0),(36,31122,0,0),(36,31123,0,0),(36,31124,0,0),(36,31125,0,0),(36,31126,0,0),(36,31127,0,0),(36,31128,0,0),(36,31129,0,0),(36,31130,0,0),(36,31201,0,0),(36,31202,0,0),(36,31203,0,0),(36,31204,0,0),(36,31205,0,0),(36,31206,0,0),(36,31207,0,0),(36,31208,0,0),(36,31209,0,0),(36,31210,0,0),(36,31211,0,0),(36,31212,0,0),(36,31213,0,0),(36,31214,0,0),(36,31215,0,0),(36,31216,0,0),(36,31217,0,0),(36,31218,0,0),(36,31219,0,0),(36,31220,0,0),(36,31221,0,0),(36,31222,0,0),(36,31223,0,0),(36,31224,0,0),(36,31225,0,0),(36,31226,0,0),(36,31227,0,0),(36,31228,0,0),(36,31229,0,0),(36,31230,0,0),(36,31231,0,0),(36,31232,0,0),(36,31233,0,0),(36,31234,0,0),(36,31235,0,0),(36,31236,0,0),(36,31237,0,0),(36,31238,0,0),(36,31239,0,0),(36,31240,0,0),(36,31241,0,0),(36,31242,0,0),(36,31243,0,0),(36,31244,0,0),(36,31245,0,0),(36,31246,0,0),(36,31247,0,0),(36,31248,0,0),(36,31249,0,0),(36,31250,0,0),(36,31301,0,0),(36,31302,0,0),(36,31303,0,0),(36,31304,0,0),(36,31305,0,0),(36,31306,0,0),(36,31307,0,0),(36,31308,0,0),(36,31309,0,0),(36,31310,0,0),(36,31311,0,0),(36,31312,0,0),(36,31313,0,0),(36,31314,0,0),(36,31315,0,0),(36,31316,0,0),(36,31317,0,0),(36,31318,0,0),(36,31319,0,0),(36,31320,0,0),(36,31321,0,0),(36,31322,0,0),(36,31323,0,0),(36,31324,0,0),(36,31325,0,0),(36,31326,0,0),(36,31327,0,0),(36,31328,0,0),(36,31401,0,0),(36,31402,0,0),(36,31403,0,0),(36,31404,0,0),(36,31405,0,0),(36,31406,0,0),(36,31407,0,0),(36,31408,0,0),(36,31409,0,0),(36,31410,0,0),(36,31411,0,0),(36,31412,0,0),(36,31413,0,0),(36,31414,0,0),(36,31415,0,0),(36,31416,0,0),(36,31417,0,0),(36,31418,0,0),(36,31419,0,0),(36,31420,0,0),(36,31501,0,0),(36,31502,0,0),(36,31503,0,0),(36,31504,0,0),(36,31505,0,0),(36,31506,0,0),(36,31507,0,0),(36,31508,0,0),(36,31509,0,0),(36,31510,0,0),(36,31511,0,0),(36,31512,0,0),(36,31513,0,0),(36,31514,0,0),(36,31515,0,0),(36,31516,0,0),(36,31517,0,0),(36,31518,0,0),(36,31519,0,0),(36,31520,0,0),(36,31521,0,0),(36,31522,0,0),(36,31523,0,0),(36,31524,0,0),(36,31525,0,0),(36,31526,0,0),(36,31527,0,0),(36,31528,0,0),(36,31529,0,0),(36,31530,0,0),(36,31601,0,0),(36,31602,0,0),(36,31603,0,0),(36,31604,0,0),(36,31605,0,0),(36,31606,0,0),(36,31607,0,0),(36,31608,0,0),(36,31609,0,0),(36,31610,0,0),(36,31611,0,0),(36,31612,0,0),(36,31613,0,0),(36,31614,0,0),(36,31615,0,0),(36,31616,0,0),(36,31617,0,0),(36,31618,0,0),(36,31619,0,0),(36,31620,0,0),(36,31621,0,0),(36,31622,0,0),(36,31623,0,0),(36,31624,0,0),(36,31625,0,0),(36,31626,0,0),(36,31627,0,0),(36,31628,0,0),(36,31629,0,0),(36,31630,0,0),(36,31701,0,0),(36,31702,0,0),(36,31703,0,0),(36,31704,0,0),(36,31705,0,0),(36,31706,0,0),(36,31707,0,0),(36,31708,0,0),(36,31709,0,0),(36,31710,0,0),(36,31711,0,0),(36,31712,0,0),(36,31713,0,0),(36,31714,0,0),(36,31801,0,0),(36,31802,0,0),(36,31803,0,0),(36,31901,0,0),(36,31902,0,0),(36,31903,0,0),(36,31904,0,0),(36,31905,0,0),(36,31906,0,0),(36,31907,0,0),(36,31908,0,0),(36,31909,0,0),(36,31910,0,0),(36,31911,0,0),(36,31912,0,0),(36,32001,0,0),(36,32002,0,0),(36,32003,0,0),(36,32004,0,0),(36,32005,0,0),(36,32006,0,0),(36,32007,0,0),(36,32008,0,0),(36,32009,0,0),(36,32010,0,0),(36,32011,0,0),(36,32012,0,0),(36,32013,0,0),(36,32014,0,0),(36,32015,0,0),(36,32016,0,0),(36,32017,0,0),(36,32018,0,0),(36,32019,0,0),(36,32020,0,0),(36,32021,0,0),(36,32022,0,0),(36,32023,0,0),(36,32024,0,0),(42,10001,1,1),(42,10002,1,1),(42,10003,0,0),(42,10004,0,0),(42,10005,0,0),(42,10006,0,0),(42,10007,0,0),(42,10008,0,0),(42,10009,0,0),(42,10010,0,0),(42,20001,0,0),(42,20002,0,0),(42,20003,0,0),(42,20004,0,0),(42,20005,0,0),(42,20006,0,0),(42,30011,9,1),(42,30012,8,1),(42,30013,0,0),(42,30105,9,1),(42,30106,18,1),(42,30107,19,0),(42,30108,19,0),(42,30109,19,0),(42,30110,19,0),(42,30111,19,0),(42,30112,19,0),(42,30113,19,0),(42,30114,19,0),(42,30115,19,0),(42,30116,19,0),(42,30117,19,0),(42,30118,19,0),(42,30119,19,0),(42,30201,0,0),(42,30202,0,0),(42,30203,0,0),(42,30204,0,0),(42,30205,0,0),(42,30206,0,0),(42,30207,0,0),(42,30208,0,0),(42,30209,0,0),(42,30210,0,0),(42,30211,0,0),(42,30212,0,0),(42,30213,0,0),(42,30214,0,0),(42,30301,158400,1),(42,30302,158400,0),(42,30303,158400,0),(42,30304,158400,0),(42,30305,158400,0),(42,30306,158400,0),(42,30307,158400,0),(42,30308,158400,0),(42,30309,158400,0),(42,30310,158400,0),(42,30311,158400,0),(42,30312,158400,0),(42,30313,158400,0),(42,30314,158400,0),(42,30401,3,0),(42,30402,3,0),(42,30403,3,0),(42,30404,3,0),(42,30405,3,0),(42,30406,3,0),(42,30407,3,0),(42,30408,3,0),(42,30409,3,0),(42,30410,3,0),(42,30411,3,0),(42,30501,1,0),(42,30502,1,0),(42,30503,1,0),(42,30504,1,0),(42,30505,1,0),(42,30506,1,0),(42,30507,1,0),(42,30508,1,0),(42,30509,1,0),(42,30510,1,0),(42,30511,1,0),(42,30512,1,0),(42,30513,1,0),(42,30514,1,0),(42,30515,1,0),(42,30516,1,0),(42,30517,1,0),(42,30518,1,0),(42,30519,1,0),(42,30520,1,0),(42,30521,1,0),(42,30522,1,0),(42,30523,1,0),(42,30524,1,0),(42,30525,1,0),(42,30526,1,0),(42,30527,1,0),(42,30528,1,0),(42,30529,1,0),(42,30530,1,0),(42,30531,1,0),(42,30532,1,0),(42,30533,1,0),(42,30534,1,0),(42,30535,1,0),(42,30536,1,0),(42,30537,1,0),(42,30538,1,0),(42,30539,1,0),(42,30601,0,0),(42,30602,0,0),(42,30603,0,0),(42,30604,0,0),(42,30605,0,0),(42,30606,0,0),(42,30607,0,0),(42,30608,0,0),(42,30609,0,0),(42,30610,0,0),(42,30611,0,0),(42,30612,0,0),(42,30613,0,0),(42,30614,0,0),(42,30701,0,0),(42,30702,0,0),(42,30703,0,0),(42,30704,0,0),(42,30705,0,0),(42,30706,0,0),(42,30707,0,0),(42,30708,0,0),(42,30709,0,0),(42,30710,0,0),(42,30711,0,0),(42,30712,0,0),(42,30801,0,0),(42,30802,0,0),(42,30803,0,0),(42,30804,0,0),(42,30805,0,0),(42,30806,0,0),(42,30807,0,0),(42,30808,0,0),(42,30809,0,0),(42,30810,0,0),(42,30811,0,0),(42,30812,0,0),(42,30901,0,0),(42,30902,0,0),(42,30903,0,0),(42,30904,0,0),(42,30905,0,0),(42,30906,0,0),(42,30907,0,0),(42,30908,0,0),(42,30909,0,0),(42,30910,0,0),(42,30911,0,0),(42,30912,0,0),(42,30913,0,0),(42,30914,0,0),(42,30915,0,0),(42,30916,0,0),(42,30917,0,0),(42,30918,0,0),(42,30919,0,0),(42,30920,0,0),(42,31001,10,1),(42,31002,20,1),(42,31003,22,0),(42,31004,22,0),(42,31005,22,0),(42,31006,22,0),(42,31007,22,0),(42,31008,22,0),(42,31009,22,0),(42,31010,22,0),(42,31011,22,0),(42,31012,22,0),(42,31013,22,0),(42,31014,22,0),(42,31015,22,0),(42,31016,22,0),(42,31017,22,0),(42,31018,22,0),(42,31019,22,0),(42,31020,22,0),(42,31021,22,0),(42,31022,22,0),(42,31023,22,0),(42,31024,22,0),(42,31025,22,0),(42,31026,22,0),(42,31027,22,0),(42,31028,22,0),(42,31029,22,0),(42,31030,22,0),(42,31101,0,0),(42,31102,0,0),(42,31103,0,0),(42,31104,0,0),(42,31105,0,0),(42,31106,0,0),(42,31107,0,0),(42,31108,0,0),(42,31109,0,0),(42,31110,0,0),(42,31111,0,0),(42,31112,0,0),(42,31113,0,0),(42,31114,0,0),(42,31115,0,0),(42,31116,0,0),(42,31117,0,0),(42,31118,0,0),(42,31119,0,0),(42,31120,0,0),(42,31121,0,0),(42,31122,0,0),(42,31123,0,0),(42,31124,0,0),(42,31125,0,0),(42,31126,0,0),(42,31127,0,0),(42,31128,0,0),(42,31129,0,0),(42,31130,0,0),(42,31201,0,0),(42,31202,0,0),(42,31203,0,0),(42,31204,0,0),(42,31205,0,0),(42,31206,0,0),(42,31207,0,0),(42,31208,0,0),(42,31209,0,0),(42,31210,0,0),(42,31211,0,0),(42,31212,0,0),(42,31213,0,0),(42,31214,0,0),(42,31215,0,0),(42,31216,0,0),(42,31217,0,0),(42,31218,0,0),(42,31219,0,0),(42,31220,0,0),(42,31221,0,0),(42,31222,0,0),(42,31223,0,0),(42,31224,0,0),(42,31225,0,0),(42,31226,0,0),(42,31227,0,0),(42,31228,0,0),(42,31229,0,0),(42,31230,0,0),(42,31231,0,0),(42,31232,0,0),(42,31233,0,0),(42,31234,0,0),(42,31235,0,0),(42,31236,0,0),(42,31237,0,0),(42,31238,0,0),(42,31239,0,0),(42,31240,0,0),(42,31241,0,0),(42,31242,0,0),(42,31243,0,0),(42,31244,0,0),(42,31245,0,0),(42,31246,0,0),(42,31247,0,0),(42,31248,0,0),(42,31249,0,0),(42,31250,0,0),(42,31301,0,0),(42,31302,0,0),(42,31303,0,0),(42,31304,0,0),(42,31305,0,0),(42,31306,0,0),(42,31307,0,0),(42,31308,0,0),(42,31309,0,0),(42,31310,0,0),(42,31311,0,0),(42,31312,0,0),(42,31313,0,0),(42,31314,0,0),(42,31315,0,0),(42,31316,0,0),(42,31317,0,0),(42,31318,0,0),(42,31319,0,0),(42,31320,0,0),(42,31321,0,0),(42,31322,0,0),(42,31323,0,0),(42,31324,0,0),(42,31325,0,0),(42,31326,0,0),(42,31327,0,0),(42,31328,0,0),(42,31401,0,0),(42,31402,0,0),(42,31403,0,0),(42,31404,0,0),(42,31405,0,0),(42,31406,0,0),(42,31407,0,0),(42,31408,0,0),(42,31409,0,0),(42,31410,0,0),(42,31411,0,0),(42,31412,0,0),(42,31413,0,0),(42,31414,0,0),(42,31415,0,0),(42,31416,0,0),(42,31417,0,0),(42,31418,0,0),(42,31419,0,0),(42,31420,0,0),(42,31501,0,0),(42,31502,0,0),(42,31503,0,0),(42,31504,0,0),(42,31505,0,0),(42,31506,0,0),(42,31507,0,0),(42,31508,0,0),(42,31509,0,0),(42,31510,0,0),(42,31511,0,0),(42,31512,0,0),(42,31513,0,0),(42,31514,0,0),(42,31515,0,0),(42,31516,0,0),(42,31517,0,0),(42,31518,0,0),(42,31519,0,0),(42,31520,0,0),(42,31521,0,0),(42,31522,0,0),(42,31523,0,0),(42,31524,0,0),(42,31525,0,0),(42,31526,0,0),(42,31527,0,0),(42,31528,0,0),(42,31529,0,0),(42,31530,0,0),(42,31601,60,1),(42,31602,60,1),(42,31603,60,1),(42,31604,60,1),(42,31605,120,1),(42,31606,120,1),(42,31607,122,0),(42,31608,122,0),(42,31609,122,0),(42,31610,122,0),(42,31611,122,0),(42,31612,122,0),(42,31613,122,0),(42,31614,122,0),(42,31615,122,0),(42,31616,122,0),(42,31617,122,0),(42,31618,122,0),(42,31619,122,0),(42,31620,122,0),(42,31621,122,0),(42,31622,122,0),(42,31623,122,0),(42,31624,122,0),(42,31625,122,0),(42,31626,122,0),(42,31627,122,0),(42,31628,122,0),(42,31629,122,0),(42,31630,122,0),(42,31701,0,0),(42,31702,0,0),(42,31703,0,0),(42,31704,0,0),(42,31705,0,0),(42,31706,0,0),(42,31707,0,0),(42,31708,0,0),(42,31709,0,0),(42,31710,0,0),(42,31711,0,0),(42,31712,0,0),(42,31713,0,0),(42,31714,0,0),(42,31801,2,1),(42,31802,2,1),(42,31803,0,0),(42,31901,0,0),(42,31902,0,0),(42,31903,0,0),(42,31904,0,0),(42,31905,0,0),(42,31906,0,0),(42,31907,0,0),(42,31908,0,0),(42,31909,0,0),(42,31910,0,0),(42,31911,0,0),(42,31912,0,0),(42,32001,1,0),(42,32002,1,0),(42,32003,1,0),(42,32004,1,0),(42,32005,1,0),(42,32006,1,0),(42,32007,1,0),(42,32008,1,0),(42,32009,1,0),(42,32010,1,0),(42,32011,1,0),(42,32012,1,0),(42,32013,1,0),(42,32014,1,0),(42,32015,1,0),(42,32016,1,0),(42,32017,1,0),(42,32018,1,0),(42,32019,1,0),(42,32020,1,0),(42,32021,1,0),(42,32022,1,0),(42,32023,1,0),(42,32024,1,0),(46,10001,1,2),(46,10002,1,2),(46,10003,0,0),(46,10004,0,0),(46,10005,0,0),(46,10007,0,0),(46,10008,0,0),(46,10009,0,0),(46,10010,1,2),(46,10011,0,0),(46,20001,940,0),(46,20002,1,0),(46,20003,0,0),(46,20004,0,0),(46,20005,0,0),(46,20006,0,0),(46,30011,0,0),(46,30012,0,0),(46,30013,0,0),(46,30105,0,0),(46,30106,0,0),(46,30107,0,0),(46,30108,0,0),(46,30109,0,0),(46,30110,0,0),(46,30111,0,0),(46,30112,0,0),(46,30113,0,0),(46,30114,0,0),(46,30115,0,0),(46,30116,0,0),(46,30117,0,0),(46,30118,0,0),(46,30119,0,0),(46,30201,0,0),(46,30202,0,0),(46,30203,0,0),(46,30204,0,0),(46,30205,0,0),(46,30206,0,0),(46,30207,0,0),(46,30208,0,0),(46,30209,0,0),(46,30210,0,0),(46,30211,0,0),(46,30212,0,0),(46,30213,0,0),(46,30214,0,0),(46,30301,47510,0),(46,30302,47510,0),(46,30303,47510,0),(46,30304,47510,0),(46,30305,47510,0),(46,30306,47510,0),(46,30307,47510,0),(46,30308,47510,0),(46,30309,47510,0),(46,30310,47510,0),(46,30311,47510,0),(46,30312,47510,0),(46,30313,47510,0),(46,30314,47510,0),(46,30401,3,0),(46,30402,3,0),(46,30403,3,0),(46,30404,3,0),(46,30405,3,0),(46,30406,3,0),(46,30407,3,0),(46,30408,3,0),(46,30409,3,0),(46,30410,3,0),(46,30411,3,0),(46,30501,1,0),(46,30502,1,0),(46,30503,1,0),(46,30504,1,0),(46,30505,1,0),(46,30506,1,0),(46,30507,1,0),(46,30508,1,0),(46,30509,1,0),(46,30510,1,0),(46,30511,1,0),(46,30512,1,0),(46,30513,1,0),(46,30514,1,0),(46,30515,1,0),(46,30516,1,0),(46,30517,1,0),(46,30518,1,0),(46,30519,1,0),(46,30520,1,0),(46,30521,1,0),(46,30522,1,0),(46,30523,1,0),(46,30524,1,0),(46,30525,1,0),(46,30526,1,0),(46,30527,1,0),(46,30528,1,0),(46,30529,1,0),(46,30530,1,0),(46,30531,1,0),(46,30532,1,0),(46,30533,1,0),(46,30534,1,0),(46,30535,1,0),(46,30536,1,0),(46,30537,1,0),(46,30538,1,0),(46,30539,1,0),(46,30601,1,0),(46,30602,1,0),(46,30603,1,0),(46,30604,1,0),(46,30605,1,0),(46,30606,1,0),(46,30607,1,0),(46,30608,1,0),(46,30609,1,0),(46,30610,1,0),(46,30611,1,0),(46,30612,1,0),(46,30613,1,0),(46,30614,1,0),(46,30701,0,0),(46,30702,0,0),(46,30703,0,0),(46,30704,0,0),(46,30705,0,0),(46,30706,0,0),(46,30707,0,0),(46,30708,0,0),(46,30709,0,0),(46,30710,0,0),(46,30711,0,0),(46,30712,0,0),(46,30801,0,0),(46,30802,0,0),(46,30803,0,0),(46,30804,0,0),(46,30805,0,0),(46,30806,0,0),(46,30807,0,0),(46,30808,0,0),(46,30809,0,0),(46,30810,0,0),(46,30811,0,0),(46,30812,0,0),(46,30901,0,0),(46,30902,0,0),(46,30903,0,0),(46,30904,0,0),(46,30905,0,0),(46,30906,0,0),(46,30907,0,0),(46,30908,0,0),(46,30909,0,0),(46,30910,0,0),(46,30911,0,0),(46,30912,0,0),(46,30913,0,0),(46,30914,0,0),(46,30915,0,0),(46,30916,0,0),(46,30917,0,0),(46,30918,0,0),(46,30919,0,0),(46,30920,0,0),(46,31001,0,0),(46,31002,0,0),(46,31003,0,0),(46,31004,0,0),(46,31005,0,0),(46,31006,0,0),(46,31007,0,0),(46,31008,0,0),(46,31009,0,0),(46,31010,0,0),(46,31011,0,0),(46,31012,0,0),(46,31013,0,0),(46,31014,0,0),(46,31015,0,0),(46,31016,0,0),(46,31017,0,0),(46,31018,0,0),(46,31019,0,0),(46,31020,0,0),(46,31021,0,0),(46,31022,0,0),(46,31023,0,0),(46,31024,0,0),(46,31025,0,0),(46,31026,0,0),(46,31027,0,0),(46,31028,0,0),(46,31029,0,0),(46,31030,0,0),(46,31101,10,2),(46,31102,11,0),(46,31103,11,0),(46,31104,11,0),(46,31105,11,0),(46,31106,11,0),(46,31107,11,0),(46,31108,11,0),(46,31109,11,0),(46,31110,11,0),(46,31111,11,0),(46,31112,11,0),(46,31113,11,0),(46,31114,11,0),(46,31115,11,0),(46,31116,11,0),(46,31117,11,0),(46,31118,11,0),(46,31119,11,0),(46,31120,11,0),(46,31121,11,0),(46,31122,11,0),(46,31123,11,0),(46,31124,11,0),(46,31125,11,0),(46,31126,11,0),(46,31127,11,0),(46,31128,11,0),(46,31129,11,0),(46,31130,11,0),(46,31201,1,2),(46,31202,1,0),(46,31203,1,0),(46,31204,1,0),(46,31205,1,0),(46,31206,1,0),(46,31207,1,0),(46,31208,1,0),(46,31209,1,0),(46,31210,1,0),(46,31211,1,0),(46,31212,1,0),(46,31213,1,0),(46,31214,1,0),(46,31215,1,0),(46,31216,1,0),(46,31217,1,0),(46,31218,1,0),(46,31219,1,0),(46,31220,1,0),(46,31221,1,0),(46,31222,1,0),(46,31223,1,0),(46,31224,1,0),(46,31225,1,0),(46,31226,1,0),(46,31227,1,0),(46,31228,1,0),(46,31229,1,0),(46,31230,1,0),(46,31231,1,0),(46,31232,1,0),(46,31233,1,0),(46,31234,1,0),(46,31235,1,0),(46,31236,1,0),(46,31237,1,0),(46,31238,1,0),(46,31239,1,0),(46,31240,1,0),(46,31241,1,0),(46,31242,1,0),(46,31243,1,0),(46,31244,1,0),(46,31245,1,0),(46,31246,1,0),(46,31247,1,0),(46,31248,1,0),(46,31249,1,0),(46,31250,1,0),(46,31301,0,0),(46,31302,0,0),(46,31303,0,0),(46,31304,0,0),(46,31305,0,0),(46,31306,0,0),(46,31307,0,0),(46,31308,0,0),(46,31309,0,0),(46,31310,0,0),(46,31311,0,0),(46,31312,0,0),(46,31313,0,0),(46,31314,0,0),(46,31315,0,0),(46,31316,0,0),(46,31317,0,0),(46,31318,0,0),(46,31319,0,0),(46,31320,0,0),(46,31321,0,0),(46,31322,0,0),(46,31323,0,0),(46,31324,0,0),(46,31325,0,0),(46,31326,0,0),(46,31327,0,0),(46,31328,0,0),(46,31401,0,0),(46,31402,0,0),(46,31403,0,0),(46,31404,0,0),(46,31405,0,0),(46,31406,0,0),(46,31407,0,0),(46,31408,0,0),(46,31409,0,0),(46,31410,0,0),(46,31411,0,0),(46,31412,0,0),(46,31413,0,0),(46,31414,0,0),(46,31415,0,0),(46,31416,0,0),(46,31417,0,0),(46,31418,0,0),(46,31419,0,0),(46,31420,0,0),(46,31501,0,0),(46,31502,0,0),(46,31503,0,0),(46,31504,0,0),(46,31505,0,0),(46,31506,0,0),(46,31507,0,0),(46,31508,0,0),(46,31509,0,0),(46,31510,0,0),(46,31511,0,0),(46,31512,0,0),(46,31513,0,0),(46,31514,0,0),(46,31515,0,0),(46,31516,0,0),(46,31517,0,0),(46,31518,0,0),(46,31519,0,0),(46,31520,0,0),(46,31521,0,0),(46,31522,0,0),(46,31523,0,0),(46,31524,0,0),(46,31525,0,0),(46,31526,0,0),(46,31527,0,0),(46,31528,0,0),(46,31529,0,0),(46,31530,0,0),(46,31601,3,0),(46,31602,3,0),(46,31603,3,0),(46,31604,3,0),(46,31605,3,0),(46,31606,3,0),(46,31607,3,0),(46,31608,3,0),(46,31609,3,0),(46,31610,3,0),(46,31611,3,0),(46,31612,3,0),(46,31613,3,0),(46,31614,3,0),(46,31615,3,0),(46,31616,3,0),(46,31617,3,0),(46,31618,3,0),(46,31619,3,0),(46,31620,3,0),(46,31621,3,0),(46,31622,3,0),(46,31623,3,0),(46,31624,3,0),(46,31625,3,0),(46,31626,3,0),(46,31627,3,0),(46,31628,3,0),(46,31629,3,0),(46,31630,3,0),(46,31701,940,0),(46,31702,940,0),(46,31703,940,0),(46,31704,940,0),(46,31705,940,0),(46,31706,940,0),(46,31707,940,0),(46,31708,940,0),(46,31709,940,0),(46,31710,940,0),(46,31711,940,0),(46,31712,940,0),(46,31713,940,0),(46,31714,940,0),(46,31801,0,0),(46,31802,0,0),(46,31803,0,0),(46,31901,0,0),(46,31902,0,0),(46,31903,0,0),(46,31904,0,0),(46,31905,0,0),(46,31906,0,0),(46,31907,0,0),(46,31908,0,0),(46,31909,0,0),(46,31910,0,0),(46,31911,0,0),(46,31912,0,0),(46,32001,2,0),(46,32002,2,0),(46,32003,2,0),(46,32004,2,0),(46,32005,2,0),(46,32006,2,0),(46,32007,2,0),(46,32008,2,0),(46,32009,2,0),(46,32010,2,0),(46,32011,2,0),(46,32012,2,0),(46,32013,2,0),(46,32014,2,0),(46,32015,2,0),(46,32016,2,0),(46,32017,2,0),(46,32018,2,0),(46,32019,2,0),(46,32020,2,0),(46,32021,2,0),(46,32022,2,0),(46,32023,2,0),(46,32024,2,0);
/*!40000 ALTER TABLE `task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `taskcreate`
--

DROP TABLE IF EXISTS `taskcreate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `taskcreate` (
  `roleId` bigint unsigned NOT NULL COMMENT '角色Id',
  `type` int unsigned NOT NULL COMMENT '任务类型',
  `time` datetime NOT NULL COMMENT '生成时间',
  `extendData` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT '扩展数据(Class:TaskExtendData)',
  PRIMARY KEY (`roleId`,`type`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `taskcreate`
--

LOCK TABLES `taskcreate` WRITE;
/*!40000 ALTER TABLE `taskcreate` DISABLE KEYS */;
INSERT INTO `taskcreate` VALUES (1,0,'2025-02-18 01:17:01','{\"groupTaskProcessMap\":{}}'),(1,1,'2025-02-17 17:06:07','{\"groupTaskProcessMap\":{}}'),(1,2,'2025-02-17 17:06:07','{\"groupTaskProcessMap\":{\"1600\":31601,\"800\":30801,\"1700\":31701,\"100\":30105,\"900\":30901,\"200\":30201,\"1000\":31001,\"1800\":31801,\"10\":30011,\"300\":30301,\"1100\":31101,\"1900\":31901,\"400\":30401,\"1200\":31201,\"2000\":32001,\"500\":30501,\"1300\":31301,\"600\":30601,\"1400\":31401,\"700\":30701,\"1500\":31501}}'),(2,0,'2025-02-17 18:03:35','{\"groupTaskProcessMap\":{}}'),(2,1,'2025-02-17 18:03:35','{\"groupTaskProcessMap\":{}}'),(2,2,'2025-02-17 18:03:35','{\"groupTaskProcessMap\":{\"1600\":31601,\"800\":30801,\"1700\":31701,\"100\":30105,\"900\":30901,\"200\":30201,\"1000\":31001,\"1800\":31801,\"10\":30011,\"300\":30301,\"1100\":31101,\"1900\":31901,\"400\":30401,\"1200\":31201,\"2000\":32001,\"500\":30501,\"1300\":31301,\"600\":30601,\"1400\":31401,\"700\":30701,\"1500\":31501}}'),(13,0,'2025-02-17 17:54:14','{\"groupTaskProcessMap\":{}}'),(13,1,'2025-02-17 17:54:14','{\"groupTaskProcessMap\":{}}'),(13,2,'2025-02-17 17:54:14','{\"groupTaskProcessMap\":{\"1600\":31601,\"800\":30801,\"1700\":31701,\"100\":30105,\"900\":30901,\"200\":30201,\"1000\":31001,\"1800\":31801,\"10\":30011,\"300\":30301,\"1100\":31101,\"1900\":31901,\"400\":30401,\"1200\":31201,\"2000\":32001,\"500\":30501,\"1300\":31301,\"600\":30601,\"1400\":31401,\"700\":30701,\"1500\":31501}}'),(31,0,'2025-02-17 18:04:12','{\"groupTaskProcessMap\":{}}'),(31,1,'2025-02-17 18:04:12','{\"groupTaskProcessMap\":{}}'),(31,2,'2025-02-17 18:04:12','{\"groupTaskProcessMap\":{\"1600\":31601,\"800\":30801,\"1700\":31701,\"100\":30105,\"900\":30901,\"200\":30201,\"1000\":31001,\"1800\":31801,\"10\":30011,\"300\":30301,\"1100\":31101,\"1900\":31901,\"400\":30401,\"1200\":31201,\"2000\":32001,\"500\":30501,\"1300\":31301,\"600\":30601,\"1400\":31401,\"700\":30701,\"1500\":31501}}'),(36,0,'2025-02-18 00:47:23','{\"groupTaskProcessMap\":{}}'),(36,1,'2025-02-18 00:47:23','{\"groupTaskProcessMap\":{}}'),(36,2,'2025-02-18 00:47:23','{\"groupTaskProcessMap\":{\"1600\":31601,\"800\":30801,\"1700\":31701,\"100\":30105,\"900\":30901,\"200\":30201,\"1000\":31001,\"1800\":31801,\"10\":30011,\"300\":30301,\"1100\":31101,\"1900\":31901,\"400\":30401,\"1200\":31201,\"2000\":32001,\"500\":30501,\"1300\":31301,\"600\":30601,\"1400\":31401,\"700\":30701,\"1500\":31501}}'),(42,0,'2025-02-18 01:20:14','{\"groupTaskProcessMap\":{}}'),(42,1,'2025-02-18 01:20:14','{\"groupTaskProcessMap\":{}}'),(42,2,'2025-02-18 01:20:14','{\"groupTaskProcessMap\":{\"1600\":31601,\"800\":30801,\"1700\":31701,\"100\":30105,\"900\":30901,\"200\":30201,\"1000\":31001,\"1800\":31801,\"10\":30011,\"300\":30301,\"1100\":31101,\"1900\":31901,\"400\":30401,\"1200\":31201,\"2000\":32001,\"500\":30501,\"1300\":31301,\"600\":30601,\"1400\":31401,\"700\":30701,\"1500\":31501}}'),(46,0,'2025-02-18 03:11:33','{\"groupTaskProcessMap\":{}}'),(46,1,'2025-02-18 03:11:33','{\"groupTaskProcessMap\":{}}'),(46,2,'2025-02-18 03:11:33','{\"groupTaskProcessMap\":{\"1600\":31601,\"800\":30801,\"1700\":31701,\"100\":30105,\"900\":30901,\"200\":30201,\"1000\":31001,\"1800\":31801,\"10\":30011,\"300\":30301,\"1100\":31102,\"1900\":31901,\"400\":30401,\"1200\":31202,\"2000\":32001,\"500\":30501,\"1300\":31301,\"600\":30601,\"1400\":31401,\"700\":30701,\"1500\":31501}}');
/*!40000 ALTER TABLE `taskcreate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test`
--

DROP TABLE IF EXISTS `test`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test` (
  `id` int NOT NULL COMMENT '1',
  `name` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '1',
  `roleId` bigint DEFAULT NULL,
  `ids` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT 'Id列表(Class:List<Integer>)',
  `equips` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '装备列表(Class:Map<Integer,com.xkhy.blcx.domain.model.game.equip.Equip>)',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='测试表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test`
--

LOCK TABLES `test` WRITE;
/*!40000 ALTER TABLE `test` DISABLE KEYS */;
/*!40000 ALTER TABLE `test` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'blcx_game'
--

--
-- Dumping routines for database 'blcx_game'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-18 22:56:42
