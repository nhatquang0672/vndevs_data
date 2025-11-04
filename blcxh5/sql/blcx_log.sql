-- MySQL dump 10.13  Distrib 8.0.24, for Linux (x86_64)
--
-- Host: localhost    Database: blcx_log
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
-- Table structure for table `battle`
--

DROP TABLE IF EXISTS `battle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2132 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='战斗日志';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `battle`
--

LOCK TABLES `battle` WRITE;
/*!40000 ALTER TABLE `battle` DISABLE KEYS */;
/*!40000 ALTER TABLE `battle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `breach`
--

DROP TABLE IF EXISTS `breach`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=3616 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='突破';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `breach`
--

LOCK TABLES `breach` WRITE;
/*!40000 ALTER TABLE `breach` DISABLE KEYS */;
INSERT INTO `breach` VALUES (3609,46,'修真者:46','','','',1,5,'2025-02-18 03:17:59'),(3610,46,'修真者:46','','','',1,6,'2025-02-18 03:18:00'),(3611,46,'修真者:46','','','',1,7,'2025-02-18 03:27:29'),(3612,46,'修真者:46','','','',1,8,'2025-02-18 03:27:31'),(3613,46,'修真者:46','','','',1,9,'2025-02-18 03:27:33'),(3614,46,'修真者:46','','','',1,10,'2025-02-18 03:27:34'),(3615,46,'修真者:46','','','',1,11,'2025-02-18 03:27:36');
/*!40000 ALTER TABLE `breach` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coin`
--

DROP TABLE IF EXISTS `coin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=118545 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='金币';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coin`
--

LOCK TABLES `coin` WRITE;
/*!40000 ALTER TABLE `coin` DISABLE KEYS */;
INSERT INTO `coin` VALUES (118493,31,'修真者:31',5,'','','',2,2,'2025-02-17 18:08:27',1,1,'0','900','900'),(118494,31,'修真者:31',5,'','','',2,2,'2025-02-17 18:08:27',1,1,'900','3000','3900'),(118495,31,'修真者:31',5,'','','',2,2,'2025-02-17 18:09:40',1,1,'3900','1','3901'),(118496,31,'修真者:31',5,'','','',2,2,'2025-02-17 18:09:40',1,1,'3901','10','3911'),(118497,31,'修真者:31',5,'','','',2,2,'2025-02-17 18:09:40',1,1,'3911','100','4011'),(118498,31,'修真者:31',5,'','','',2,2,'2025-02-17 18:09:40',1,1,'4011','30','4041'),(118499,31,'修真者:31',5,'','','',2,2,'2025-02-17 18:09:40',1,1,'4041','3300','7341'),(118500,31,'修真者:31',5,'','','',2,2,'2025-02-17 18:09:40',1,1,'7341','19800','27141'),(118501,31,'修真者:31',5,'','','',2,2,'2025-02-17 18:09:40',1,1,'27141','6600','33741'),(118502,31,'修真者:31',5,'','','',2,2,'2025-02-17 18:09:40',1,1,'33741','79200','112941'),(118503,31,'修真者:31',5,'','','',2,2,'2025-02-17 18:12:22',1,1,'112941','1','112942'),(118504,31,'修真者:31',5,'','','',2,2,'2025-02-17 18:12:22',1,1,'112942','10','112952'),(118505,31,'修真者:31',5,'','','',2,2,'2025-02-17 18:12:22',1,1,'112952','100','113052'),(118506,31,'修真者:31',5,'','','',2,2,'2025-02-17 18:12:22',1,1,'113052','30','113082'),(118507,31,'修真者:31',5,'','','',2,2,'2025-02-17 18:12:22',1,1,'113082','3300','116382'),(118508,31,'修真者:31',5,'','','',2,2,'2025-02-17 18:12:22',1,1,'116382','19800','136182'),(118509,31,'修真者:31',5,'','','',2,2,'2025-02-17 18:12:22',1,1,'136182','6600','142782'),(118510,31,'修真者:31',5,'','','',2,2,'2025-02-17 18:12:22',1,1,'142782','79200','221982'),(118511,31,'修真者:31',5,'','','',2,2,'2025-02-17 18:15:32',1,1,'221982','19000','240982'),(118512,31,'修真者:31',5,'','','',2,2,'2025-02-17 18:20:49',1,1,'240982','1140','242122'),(118513,31,'修真者:31',5,'','','',2,2,'2025-02-17 18:20:49',1,1,'242122','5000','247122'),(118514,31,'搬搬屋',5,'','','',2,2,'2025-02-17 18:22:16',1,1,'247122','300','247422'),(118515,42,'修真者:42',5,'','','',2,2,'2025-02-18 01:24:22',1,1,'0','1','1'),(118516,42,'修真者:42',5,'','','',2,2,'2025-02-18 01:24:22',1,1,'1','10','11'),(118517,42,'修真者:42',5,'','','',2,2,'2025-02-18 01:24:22',1,1,'11','100','111'),(118518,42,'修真者:42',5,'','','',2,2,'2025-02-18 01:24:22',1,1,'111','30','141'),(118519,42,'修真者:42',5,'','','',2,2,'2025-02-18 01:24:22',1,1,'141','3300','3441'),(118520,42,'修真者:42',5,'','','',2,2,'2025-02-18 01:24:22',1,1,'3441','19800','23241'),(118521,42,'修真者:42',5,'','','',2,2,'2025-02-18 01:24:22',1,1,'23241','6600','29841'),(118522,42,'修真者:42',5,'','','',2,2,'2025-02-18 01:24:22',1,1,'29841','79200','109041'),(118523,42,'修真者:42',5,'','','',2,2,'2025-02-18 01:25:59',1,1,'109041','1','109042'),(118524,42,'修真者:42',5,'','','',2,2,'2025-02-18 01:25:59',1,1,'109042','10','109052'),(118525,42,'修真者:42',5,'','','',2,2,'2025-02-18 01:25:59',1,1,'109052','100','109152'),(118526,42,'修真者:42',5,'','','',2,2,'2025-02-18 01:25:59',1,1,'109152','30','109182'),(118527,42,'修真者:42',5,'','','',2,2,'2025-02-18 01:25:59',1,1,'109182','3300','112482'),(118528,42,'修真者:42',5,'','','',2,2,'2025-02-18 01:25:59',1,1,'112482','19800','132282'),(118529,42,'修真者:42',5,'','','',2,2,'2025-02-18 01:25:59',1,1,'132282','6600','138882'),(118530,42,'修真者:42',5,'','','',2,2,'2025-02-18 01:25:59',1,1,'138882','79200','218082'),(118531,46,'修真者:46',5,'','','',2,2,'2025-02-18 03:16:58',1,1,'0','1230','1230'),(118532,46,'修真者:46',5,'','','',2,2,'2025-02-18 03:16:58',1,1,'1230','5000','6230'),(118533,46,'修真者:46',5,'','','',2,2,'2025-02-18 03:17:51',1,1,'1230','3300','4530'),(118534,46,'修真者:46',5,'','','',2,2,'2025-02-18 03:17:59',2,2,'4530','-2000','2530'),(118535,46,'修真者:46',5,'','','',2,2,'2025-02-18 03:18:00',2,2,'2530','-2000','530'),(118536,46,'修真者:46',5,'','','',2,2,'2025-02-18 03:18:40',1,1,'530','19000','19530'),(118537,46,'修真者:46',5,'','','',2,2,'2025-02-18 03:19:36',2,2,'19530','-1000','18530'),(118538,46,'修真者:46',5,'','','',2,2,'2025-02-18 03:19:37',2,2,'18530','-2000','16530'),(118539,46,'修真者:46',5,'','','',2,2,'2025-02-18 03:25:49',1,1,'16530','9210','25740'),(118540,46,'修真者:46',5,'','','',2,2,'2025-02-18 03:27:29',2,2,'30740','-3000','27740'),(118541,46,'修真者:46',5,'','','',2,2,'2025-02-18 03:27:31',2,2,'27740','-3000','24740'),(118542,46,'修真者:46',5,'','','',2,2,'2025-02-18 03:27:33',2,2,'24740','-3000','21740'),(118543,46,'修真者:46',5,'','','',2,2,'2025-02-18 03:27:34',2,2,'21740','-4000','17740'),(118544,46,'修真者:46',5,'','','',2,2,'2025-02-18 03:27:36',2,2,'17740','-4000','13740');
/*!40000 ALTER TABLE `coin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dailyactive`
--

DROP TABLE IF EXISTS `dailyactive`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=808 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='日常活跃';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dailyactive`
--

LOCK TABLES `dailyactive` WRITE;
/*!40000 ALTER TABLE `dailyactive` DISABLE KEYS */;
INSERT INTO `dailyactive` VALUES (801,31,'修真者:31',5,'','','',7,7,'2025-02-17 18:09:40',1,1,'0','1','1'),(802,31,'修真者:31',5,'','','',7,7,'2025-02-17 18:12:22',1,1,'1','1','2'),(803,42,'修真者:42',5,'','','',7,7,'2025-02-18 01:24:22',1,1,'0','1','1'),(804,42,'修真者:42',5,'','','',7,7,'2025-02-18 01:25:59',1,1,'1','1','2'),(805,46,'修真者:46',5,'','','',7,7,'2025-02-18 03:17:49',1,1,'0','10','10'),(806,46,'修真者:46',5,'','','',7,7,'2025-02-18 03:17:50',1,1,'10','10','20'),(807,46,'修真者:46',5,'','','',7,7,'2025-02-18 03:27:43',1,1,'20','10','30');
/*!40000 ALTER TABLE `dailyactive` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `end`
--

DROP TABLE IF EXISTS `end`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=15023 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='体力';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `end`
--

LOCK TABLES `end` WRITE;
/*!40000 ALTER TABLE `end` DISABLE KEYS */;
INSERT INTO `end` VALUES (15002,1,'修真者:1',5,'','','',1,1,'2025-02-17 17:06:11',2,2,'30','-5','25'),(15003,13,'修真者:13',5,'','','',1,1,'2025-02-17 17:54:17',2,2,'30','-5','25'),(15004,2,'修真者:2',5,'','','',1,1,'2025-02-17 18:03:39',2,2,'30','-5','25'),(15005,31,'修真者:31',5,'','','',1,1,'2025-02-17 18:04:22',2,2,'30','-5','25'),(15006,31,'修真者:31',5,'','','',1,1,'2025-02-17 18:05:22',2,2,'25','-5','20'),(15007,31,'修真者:31',5,'','','',1,1,'2025-02-17 18:08:28',1,1,'20','5','25'),(15008,31,'修真者:31',5,'','','',1,1,'2025-02-17 18:09:40',1,1,'25','1','26'),(15009,31,'修真者:31',5,'','','',1,1,'2025-02-17 18:12:22',1,1,'26','1','27'),(15010,31,'修真者:31',5,'','','',1,1,'2025-02-17 18:12:35',2,2,'27','-5','22'),(15011,31,'修真者:31',5,'','','',1,1,'2025-02-17 18:15:38',2,2,'22','-5','17'),(15012,36,'修真者:36',5,'','','',1,1,'2025-02-18 00:47:33',2,2,'30','-5','25'),(15013,42,'修真者:42',5,'','','',1,1,'2025-02-18 01:20:20',2,2,'30','-5','25'),(15014,42,'修真者:42',5,'','','',1,1,'2025-02-18 01:24:22',1,1,'25','1','26'),(15015,42,'修真者:42',5,'','','',1,1,'2025-02-18 01:25:59',1,1,'26','1','27'),(15016,42,'修真者:42',5,'','','',1,1,'2025-02-18 01:27:45',1,1,'27','5','32'),(15017,46,'修真者:46',5,'','','',1,1,'2025-02-18 03:11:45',2,2,'30','-5','25'),(15018,46,'修真者:46',5,'','','',1,1,'2025-02-18 03:16:58',1,1,'25','5','30'),(15019,46,'修真者:46',5,'','','',1,1,'2025-02-18 03:17:55',1,1,'30','5','35'),(15020,46,'修真者:46',5,'','','',1,1,'2025-02-18 03:22:46',2,2,'35','-5','30'),(15021,46,'修真者:46',5,'','','',1,1,'2025-02-18 03:25:49',1,1,'30','5','35'),(15022,46,'修真者:46',5,'','','',1,1,'2025-02-18 03:27:55',2,2,'35','-5','30');
/*!40000 ALTER TABLE `end` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `energy`
--

DROP TABLE IF EXISTS `energy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=659 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='能量';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `energy`
--

LOCK TABLES `energy` WRITE;
/*!40000 ALTER TABLE `energy` DISABLE KEYS */;
INSERT INTO `energy` VALUES (655,31,'修真者:31',5,'','','',6,6,'2025-02-17 18:09:40',1,1,'0','1','1'),(656,31,'修真者:31',5,'','','',6,6,'2025-02-17 18:12:22',1,1,'1','1','2'),(657,42,'修真者:42',5,'','','',6,6,'2025-02-18 01:24:22',1,1,'0','1','1'),(658,42,'修真者:42',5,'','','',6,6,'2025-02-18 01:25:59',1,1,'1','1','2');
/*!40000 ALTER TABLE `energy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equip`
--

DROP TABLE IF EXISTS `equip`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=90402 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='装备日志';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equip`
--

LOCK TABLES `equip` WRITE;
/*!40000 ALTER TABLE `equip` DISABLE KEYS */;
INSERT INTO `equip` VALUES (90064,31,'修真者:31','','','',1,201500,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90065,31,'修真者:31','','','',2,206500,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90066,31,'修真者:31','','','',3,203200,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90067,31,'修真者:31','','','',4,202500,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90068,31,'修真者:31','','','',5,205500,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90069,31,'修真者:31','','','',6,204200,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90070,31,'修真者:31','','','',7,206300,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90071,31,'修真者:31','','','',8,201300,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=2'),(90072,31,'修真者:31','','','',9,204200,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=2'),(90073,31,'修真者:31','','','',10,203100,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=2'),(90074,31,'修真者:31','','','',11,202300,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=2'),(90075,31,'修真者:31','','','',12,205300,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=2'),(90076,31,'修真者:31','','','',13,204300,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=2'),(90077,31,'修真者:31','','','',14,206100,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=2'),(90078,31,'修真者:31','','','',15,202300,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=5'),(90079,31,'修真者:31','','','',16,201400,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=5'),(90080,31,'修真者:31','','','',17,204400,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=5'),(90081,31,'修真者:31','','','',18,203400,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=5'),(90082,31,'修真者:31','','','',19,202400,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=5'),(90083,31,'修真者:31','','','',20,205400,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=5'),(90084,31,'修真者:31','','','',21,204200,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=5'),(90085,31,'修真者:31','','','',22,206100,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=5'),(90086,31,'修真者:31','','','',23,201100,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90087,31,'修真者:31','','','',24,201200,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90088,31,'修真者:31','','','',25,201300,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90089,31,'修真者:31','','','',26,201400,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90090,31,'修真者:31','','','',27,201500,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90091,31,'修真者:31','','','',28,205200,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90092,31,'修真者:31','','','',29,202100,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90093,31,'修真者:31','','','',30,202200,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90094,31,'修真者:31','','','',31,202300,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90095,31,'修真者:31','','','',32,202400,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90096,31,'修真者:31','','','',33,202500,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90097,31,'修真者:31','','','',34,203100,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90098,31,'修真者:31','','','',35,203200,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90099,31,'修真者:31','','','',36,203300,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90100,31,'修真者:31','','','',37,203400,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90101,31,'修真者:31','','','',38,203500,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90102,31,'修真者:31','','','',39,204100,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90103,31,'修真者:31','','','',40,204200,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90104,31,'修真者:31','','','',41,204300,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90105,31,'修真者:31','','','',42,204400,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90106,31,'修真者:31','','','',43,204500,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90107,31,'修真者:31','','','',44,205100,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90108,31,'修真者:31','','','',45,205300,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90109,31,'修真者:31','','','',46,205400,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90110,31,'修真者:31','','','',47,205500,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90111,31,'修真者:31','','','',48,206100,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90112,31,'修真者:31','','','',49,206200,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90113,31,'修真者:31','','','',50,206300,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90114,31,'修真者:31','','','',51,206400,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90115,31,'修真者:31','','','',52,206500,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90116,31,'修真者:31','','','',53,203300,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90117,31,'修真者:31','','','',54,202500,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90118,31,'修真者:31','','','',55,205300,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90119,31,'修真者:31','','','',56,204100,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90120,31,'修真者:31','','','',57,206400,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90121,31,'修真者:31','','','',58,205600,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90122,31,'修真者:31','','','',59,206600,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90123,31,'修真者:31','','','',60,203500,1,'2025-02-17 18:09:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90124,31,'修真者:31','','','',64,202500,1,'2025-02-17 18:09:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90125,31,'修真者:31','','','',65,204100,1,'2025-02-17 18:09:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90126,31,'修真者:31','','','',66,203400,1,'2025-02-17 18:09:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90127,31,'修真者:31','','','',67,206600,1,'2025-02-17 18:09:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90128,31,'修真者:31','','','',68,201100,1,'2025-02-17 18:09:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90129,31,'修真者:31','','','',69,204300,1,'2025-02-17 18:09:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90130,31,'修真者:31','','','',70,203600,1,'2025-02-17 18:09:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90131,31,'修真者:31','','','',71,205200,1,'2025-02-17 18:09:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90132,31,'修真者:31','','','',72,201300,1,'2025-02-17 18:09:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90133,31,'修真者:31','','','',73,204500,1,'2025-02-17 18:09:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90134,31,'修真者:31','','','',74,206100,1,'2025-02-17 18:09:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90135,31,'修真者:31','','','',75,202200,1,'2025-02-17 18:09:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90136,31,'修真者:31','','','',76,205400,1,'2025-02-17 18:09:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90137,31,'修真者:31','','','',77,201500,1,'2025-02-17 18:09:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90138,31,'修真者:31','','','',78,203100,1,'2025-02-17 18:09:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90139,31,'修真者:31','','','',79,206300,1,'2025-02-17 18:09:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90140,31,'修真者:31','','','',80,202400,1,'2025-02-17 18:09:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90141,31,'修真者:31','','','',81,205600,1,'2025-02-17 18:09:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90142,31,'修真者:31','','','',82,201700,1,'2025-02-17 18:09:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90143,31,'修真者:31','','','',83,203300,1,'2025-02-17 18:09:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90144,31,'修真者:31','','','',84,206500,1,'2025-02-17 18:09:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90145,31,'修真者:31','','','',85,202600,1,'2025-02-17 18:09:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90146,31,'修真者:31','','','',86,204200,1,'2025-02-17 18:09:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90147,31,'修真者:31','','','',87,203500,1,'2025-02-17 18:09:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90148,31,'修真者:31','','','',88,205100,1,'2025-02-17 18:09:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90149,31,'修真者:31','','','',89,201200,1,'2025-02-17 18:09:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90150,31,'修真者:31','','','',90,204400,1,'2025-02-17 18:09:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90151,31,'修真者:31','','','',91,202100,1,'2025-02-17 18:09:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90152,31,'修真者:31','','','',92,205300,1,'2025-02-17 18:09:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90153,31,'修真者:31','','','',93,201400,1,'2025-02-17 18:09:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90154,31,'修真者:31','','','',94,204600,1,'2025-02-17 18:09:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90155,31,'修真者:31','','','',95,206200,1,'2025-02-17 18:09:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90156,31,'修真者:31','','','',96,202300,1,'2025-02-17 18:09:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90157,31,'修真者:31','','','',97,205500,1,'2025-02-17 18:09:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90158,31,'修真者:31','','','',61,201600,1,'2025-02-17 18:09:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90159,31,'修真者:31','','','',62,203200,1,'2025-02-17 18:09:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90160,31,'修真者:31','','','',63,206400,1,'2025-02-17 18:09:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90161,31,'修真者:31','','','',19,202400,5,'2025-02-17 18:10:20','oldLevel=1, oldPhase=0, oldQuality=5, newLevel=1, newPhase=0, newQuality=5'),(90162,31,'修真者:31','','','',18,203400,5,'2025-02-17 18:10:22','oldLevel=1, oldPhase=0, oldQuality=5, newLevel=1, newPhase=0, newQuality=5'),(90163,31,'修真者:31','','','',15,202300,5,'2025-02-17 18:10:23','oldLevel=1, oldPhase=0, oldQuality=5, newLevel=1, newPhase=0, newQuality=5'),(90164,31,'修真者:31','','','',19,202400,5,'2025-02-17 18:10:24','oldLevel=1, oldPhase=0, oldQuality=5, newLevel=1, newPhase=0, newQuality=5'),(90165,31,'修真者:31','','','',21,204200,5,'2025-02-17 18:10:26','oldLevel=1, oldPhase=0, oldQuality=5, newLevel=1, newPhase=0, newQuality=5'),(90166,31,'修真者:31','','','',20,205400,5,'2025-02-17 18:10:27','oldLevel=1, oldPhase=0, oldQuality=5, newLevel=1, newPhase=0, newQuality=5'),(90167,31,'修真者:31','','','',22,206100,5,'2025-02-17 18:10:28','oldLevel=1, oldPhase=0, oldQuality=5, newLevel=1, newPhase=0, newQuality=5'),(90168,31,'修真者:31','','','',17,204400,5,'2025-02-17 18:10:29','oldLevel=1, oldPhase=0, oldQuality=5, newLevel=1, newPhase=0, newQuality=5'),(90169,31,'修真者:31','','','',128,202300,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90170,31,'修真者:31','','','',129,202400,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90171,31,'修真者:31','','','',130,202500,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90172,31,'修真者:31','','','',131,203100,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90173,31,'修真者:31','','','',132,203200,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90174,31,'修真者:31','','','',133,203300,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90175,31,'修真者:31','','','',134,203400,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90176,31,'修真者:31','','','',135,203500,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90177,31,'修真者:31','','','',136,204100,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90178,31,'修真者:31','','','',137,204200,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90179,31,'修真者:31','','','',138,204300,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90180,31,'修真者:31','','','',139,204400,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90181,31,'修真者:31','','','',140,204500,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90182,31,'修真者:31','','','',141,205100,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90183,31,'修真者:31','','','',142,205300,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90184,31,'修真者:31','','','',143,205400,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90185,31,'修真者:31','','','',144,205500,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90186,31,'修真者:31','','','',145,206100,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90187,31,'修真者:31','','','',146,206200,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90188,31,'修真者:31','','','',147,206300,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90189,31,'修真者:31','','','',148,206400,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90190,31,'修真者:31','','','',149,206500,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90191,31,'修真者:31','','','',150,203100,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90192,31,'修真者:31','','','',151,202400,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90193,31,'修真者:31','','','',152,205400,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90194,31,'修真者:31','','','',153,204200,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90195,31,'修真者:31','','','',154,206500,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90196,31,'修真者:31','','','',155,204600,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90197,31,'修真者:31','','','',156,206600,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90198,31,'修真者:31','','','',157,203400,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90199,31,'修真者:31','','','',98,201500,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90200,31,'修真者:31','','','',99,202200,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90201,31,'修真者:31','','','',100,203300,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90202,31,'修真者:31','','','',101,202100,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90203,31,'修真者:31','','','',102,205300,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90204,31,'修真者:31','','','',103,204100,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90205,31,'修真者:31','','','',104,206200,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90206,31,'修真者:31','','','',105,201200,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=2'),(90207,31,'修真者:31','','','',106,206200,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=2'),(90208,31,'修真者:31','','','',107,203500,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=2'),(90209,31,'修真者:31','','','',108,202500,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=2'),(90210,31,'修真者:31','','','',109,205100,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=2'),(90211,31,'修真者:31','','','',110,204300,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=2'),(90212,31,'修真者:31','','','',111,206100,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=2'),(90213,31,'修真者:31','','','',112,202500,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=5'),(90214,31,'修真者:31','','','',113,201200,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=5'),(90215,31,'修真者:31','','','',114,204300,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=5'),(90216,31,'修真者:31','','','',115,203500,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=5'),(90217,31,'修真者:31','','','',116,202300,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=5'),(90218,31,'修真者:31','','','',117,205500,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=5'),(90219,31,'修真者:31','','','',118,204300,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=5'),(90220,31,'修真者:31','','','',119,206500,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=5'),(90221,31,'修真者:31','','','',120,201100,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90222,31,'修真者:31','','','',121,201200,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90223,31,'修真者:31','','','',122,201300,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90224,31,'修真者:31','','','',123,201400,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90225,31,'修真者:31','','','',124,201500,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90226,31,'修真者:31','','','',125,205200,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90227,31,'修真者:31','','','',126,202100,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90228,31,'修真者:31','','','',127,202200,1,'2025-02-17 18:12:22','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90229,31,'修真者:31','','','',192,206200,1,'2025-02-17 18:12:29','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90230,31,'修真者:31','','','',193,202300,1,'2025-02-17 18:12:29','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90231,31,'修真者:31','','','',194,205500,1,'2025-02-17 18:12:29','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90232,31,'修真者:31','','','',158,201600,1,'2025-02-17 18:12:29','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90233,31,'修真者:31','','','',159,203200,1,'2025-02-17 18:12:29','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90234,31,'修真者:31','','','',160,206400,1,'2025-02-17 18:12:29','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90235,31,'修真者:31','','','',161,202500,1,'2025-02-17 18:12:29','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90236,31,'修真者:31','','','',162,204100,1,'2025-02-17 18:12:29','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90237,31,'修真者:31','','','',163,203400,1,'2025-02-17 18:12:29','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90238,31,'修真者:31','','','',164,206600,1,'2025-02-17 18:12:29','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90239,31,'修真者:31','','','',165,201100,1,'2025-02-17 18:12:29','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90240,31,'修真者:31','','','',166,204300,1,'2025-02-17 18:12:29','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90241,31,'修真者:31','','','',167,203600,1,'2025-02-17 18:12:29','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90242,31,'修真者:31','','','',168,205200,1,'2025-02-17 18:12:29','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90243,31,'修真者:31','','','',169,201300,1,'2025-02-17 18:12:29','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90244,31,'修真者:31','','','',170,204500,1,'2025-02-17 18:12:29','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90245,31,'修真者:31','','','',171,206100,1,'2025-02-17 18:12:29','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90246,31,'修真者:31','','','',172,202200,1,'2025-02-17 18:12:29','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90247,31,'修真者:31','','','',173,205400,1,'2025-02-17 18:12:29','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90248,31,'修真者:31','','','',174,201500,1,'2025-02-17 18:12:29','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90249,31,'修真者:31','','','',175,203100,1,'2025-02-17 18:12:29','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90250,31,'修真者:31','','','',176,206300,1,'2025-02-17 18:12:29','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90251,31,'修真者:31','','','',177,202400,1,'2025-02-17 18:12:29','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90252,31,'修真者:31','','','',178,205600,1,'2025-02-17 18:12:29','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90253,31,'修真者:31','','','',179,201700,1,'2025-02-17 18:12:29','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90254,31,'修真者:31','','','',180,203300,1,'2025-02-17 18:12:29','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90255,31,'修真者:31','','','',181,206500,1,'2025-02-17 18:12:29','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90256,31,'修真者:31','','','',182,202600,1,'2025-02-17 18:12:29','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90257,31,'修真者:31','','','',183,204200,1,'2025-02-17 18:12:29','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90258,31,'修真者:31','','','',184,203500,1,'2025-02-17 18:12:29','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90259,31,'修真者:31','','','',185,205100,1,'2025-02-17 18:12:29','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90260,31,'修真者:31','','','',186,201200,1,'2025-02-17 18:12:29','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90261,31,'修真者:31','','','',187,204400,1,'2025-02-17 18:12:29','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90262,31,'修真者:31','','','',188,202100,1,'2025-02-17 18:12:29','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90263,31,'修真者:31','','','',189,205300,1,'2025-02-17 18:12:29','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90264,31,'修真者:31','','','',190,201400,1,'2025-02-17 18:12:29','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90265,31,'修真者:31','','','',191,204600,1,'2025-02-17 18:12:29','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90266,31,'修真者:31','','','',195,202100,1,'2025-02-17 18:15:32','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=2'),(90267,31,'修真者:31','','','',196,203100,1,'2025-02-17 18:15:32','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90268,31,'修真者:31','','','',197,202300,1,'2025-02-17 18:20:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90269,31,'搬搬屋','','','',198,203300,1,'2025-02-17 18:21:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90270,31,'搬搬屋','','','',199,201200,1,'2025-02-17 18:21:49','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=2'),(90271,31,'搬搬屋','','','',200,206400,1,'2025-02-17 18:22:16','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=2'),(90272,42,'修真者:42','','','',256,205400,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90273,42,'修真者:42','','','',257,204400,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90274,42,'修真者:42','','','',258,206400,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90275,42,'修真者:42','','','',259,203600,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90276,42,'修真者:42','','','',260,202600,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90277,42,'修真者:42','','','',261,201200,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90278,42,'修真者:42','','','',202,201400,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90279,42,'修真者:42','','','',203,203300,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90280,42,'修真者:42','','','',204,203200,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90281,42,'修真者:42','','','',205,202400,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90282,42,'修真者:42','','','',206,205300,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90283,42,'修真者:42','','','',207,204100,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90284,42,'修真者:42','','','',208,206100,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90285,42,'修真者:42','','','',209,201400,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=2'),(90286,42,'修真者:42','','','',210,202300,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=2'),(90287,42,'修真者:42','','','',211,203100,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=2'),(90288,42,'修真者:42','','','',212,202100,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=2'),(90289,42,'修真者:42','','','',213,205300,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=2'),(90290,42,'修真者:42','','','',214,204500,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=2'),(90291,42,'修真者:42','','','',215,206200,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=2'),(90292,42,'修真者:42','','','',216,204200,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=5'),(90293,42,'修真者:42','','','',217,201200,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=5'),(90294,42,'修真者:42','','','',218,206300,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=5'),(90295,42,'修真者:42','','','',219,203200,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=5'),(90296,42,'修真者:42','','','',220,202400,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=5'),(90297,42,'修真者:42','','','',221,205100,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=5'),(90298,42,'修真者:42','','','',222,204400,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=5'),(90299,42,'修真者:42','','','',223,206300,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=5'),(90300,42,'修真者:42','','','',224,201100,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90301,42,'修真者:42','','','',225,201200,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90302,42,'修真者:42','','','',226,201300,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90303,42,'修真者:42','','','',227,201400,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90304,42,'修真者:42','','','',228,201500,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90305,42,'修真者:42','','','',229,205200,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90306,42,'修真者:42','','','',230,202100,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90307,42,'修真者:42','','','',231,202200,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90308,42,'修真者:42','','','',232,202300,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90309,42,'修真者:42','','','',233,202400,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90310,42,'修真者:42','','','',234,202500,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90311,42,'修真者:42','','','',235,203100,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90312,42,'修真者:42','','','',236,203200,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90313,42,'修真者:42','','','',237,203300,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90314,42,'修真者:42','','','',238,203400,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90315,42,'修真者:42','','','',239,203500,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90316,42,'修真者:42','','','',240,204100,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90317,42,'修真者:42','','','',241,204200,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90318,42,'修真者:42','','','',242,204300,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90319,42,'修真者:42','','','',243,204400,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90320,42,'修真者:42','','','',244,204500,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90321,42,'修真者:42','','','',245,205100,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90322,42,'修真者:42','','','',246,205300,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90323,42,'修真者:42','','','',247,205400,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90324,42,'修真者:42','','','',248,205500,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90325,42,'修真者:42','','','',249,206100,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90326,42,'修真者:42','','','',250,206200,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90327,42,'修真者:42','','','',251,206300,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90328,42,'修真者:42','','','',252,206400,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90329,42,'修真者:42','','','',253,206500,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90330,42,'修真者:42','','','',254,203500,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90331,42,'修真者:42','','','',255,202100,1,'2025-02-18 01:24:23','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90332,42,'修真者:42','','','',262,201500,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90333,42,'修真者:42','','','',263,204100,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90334,42,'修真者:42','','','',264,203300,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90335,42,'修真者:42','','','',265,202100,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90336,42,'修真者:42','','','',266,205100,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90337,42,'修真者:42','','','',267,204400,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90338,42,'修真者:42','','','',268,206200,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90339,42,'修真者:42','','','',269,201500,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=2'),(90340,42,'修真者:42','','','',270,206100,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=2'),(90341,42,'修真者:42','','','',271,203100,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=2'),(90342,42,'修真者:42','','','',272,202500,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=2'),(90343,42,'修真者:42','','','',273,205100,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=2'),(90344,42,'修真者:42','','','',274,204500,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=2'),(90345,42,'修真者:42','','','',275,206100,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=2'),(90346,42,'修真者:42','','','',276,204400,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=5'),(90347,42,'修真者:42','','','',277,201500,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=5'),(90348,42,'修真者:42','','','',278,204300,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=5'),(90349,42,'修真者:42','','','',279,203500,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=5'),(90350,42,'修真者:42','','','',280,202500,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=5'),(90351,42,'修真者:42','','','',281,205100,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=5'),(90352,42,'修真者:42','','','',282,204500,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=5'),(90353,42,'修真者:42','','','',283,206500,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=5'),(90354,42,'修真者:42','','','',284,201100,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90355,42,'修真者:42','','','',285,201200,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90356,42,'修真者:42','','','',286,201300,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90357,42,'修真者:42','','','',287,201400,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90358,42,'修真者:42','','','',288,201500,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90359,42,'修真者:42','','','',289,205200,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90360,42,'修真者:42','','','',290,202100,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90361,42,'修真者:42','','','',291,202200,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90362,42,'修真者:42','','','',292,202300,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90363,42,'修真者:42','','','',293,202400,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90364,42,'修真者:42','','','',294,202500,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90365,42,'修真者:42','','','',295,203100,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90366,42,'修真者:42','','','',296,203200,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90367,42,'修真者:42','','','',297,203300,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90368,42,'修真者:42','','','',298,203400,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90369,42,'修真者:42','','','',299,203500,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90370,42,'修真者:42','','','',300,204100,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90371,42,'修真者:42','','','',301,204200,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90372,42,'修真者:42','','','',302,204300,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90373,42,'修真者:42','','','',303,204400,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90374,42,'修真者:42','','','',304,204500,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90375,42,'修真者:42','','','',305,205100,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90376,42,'修真者:42','','','',306,205300,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90377,42,'修真者:42','','','',307,205400,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90378,42,'修真者:42','','','',308,205500,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90379,42,'修真者:42','','','',309,206100,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90380,42,'修真者:42','','','',310,206200,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90381,42,'修真者:42','','','',311,206300,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90382,42,'修真者:42','','','',312,206400,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90383,42,'修真者:42','','','',313,206500,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90384,42,'修真者:42','','','',314,203100,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90385,42,'修真者:42','','','',315,202300,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90386,42,'修真者:42','','','',316,205100,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90387,42,'修真者:42','','','',317,204300,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90388,42,'修真者:42','','','',318,206200,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=3'),(90389,42,'修真者:42','','','',319,202600,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90390,42,'修真者:42','','','',320,204600,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90391,42,'修真者:42','','','',321,202400,1,'2025-02-18 01:25:59','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90392,42,'修真者:42','','','',322,203300,1,'2025-02-18 01:30:48','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=4'),(90393,42,'修真者:42','','','',323,201200,1,'2025-02-18 01:30:48','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=2'),(90394,46,'修真者:46','','','',324,202200,1,'2025-02-18 03:16:58','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90395,46,'修真者:46','','','',324,202200,5,'2025-02-18 03:18:10','oldLevel=1, oldPhase=0, oldQuality=1, newLevel=1, newPhase=0, newQuality=1'),(90396,46,'修真者:46','','','',325,202100,1,'2025-02-18 03:18:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=2'),(90397,46,'修真者:46','','','',326,203100,1,'2025-02-18 03:18:40','oldLevel=0, oldPhase=0, oldQuality=0, newLevel=1, newPhase=0, newQuality=1'),(90398,46,'修真者:46','','','',325,202100,5,'2025-02-18 03:19:24','oldLevel=1, oldPhase=0, oldQuality=2, newLevel=1, newPhase=0, newQuality=2'),(90399,46,'修真者:46','','','',326,203100,5,'2025-02-18 03:19:25','oldLevel=1, oldPhase=0, oldQuality=1, newLevel=1, newPhase=0, newQuality=1'),(90400,46,'修真者:46','','','',326,203100,3,'2025-02-18 03:19:36','oldLevel=1, oldPhase=0, oldQuality=1, newLevel=2, newPhase=0, newQuality=1'),(90401,46,'修真者:46','','','',326,203100,3,'2025-02-18 03:19:37','oldLevel=2, oldPhase=0, oldQuality=1, newLevel=3, newPhase=0, newQuality=1');
/*!40000 ALTER TABLE `equip` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exp`
--

DROP TABLE IF EXISTS `exp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=6148 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='经验';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exp`
--

LOCK TABLES `exp` WRITE;
/*!40000 ALTER TABLE `exp` DISABLE KEYS */;
INSERT INTO `exp` VALUES (6140,31,'修真者:31',5,'','','',3,3,'2025-02-17 18:08:28',1,1,'-500','500','0'),(6141,31,'修真者:31',5,'','','',3,3,'2025-02-17 18:09:40',1,1,'0','1','1'),(6142,31,'修真者:31',5,'','','',3,3,'2025-02-17 18:12:22',1,1,'1','1','2'),(6143,31,'修真者:31',5,'','','',3,3,'2025-02-17 18:20:49',1,1,'2','1000','1002'),(6144,42,'修真者:42',5,'','','',3,3,'2025-02-18 01:24:22',1,1,'0','1','1'),(6145,42,'修真者:42',5,'','','',3,3,'2025-02-18 01:25:59',1,1,'1','1','2'),(6146,46,'修真者:46',5,'','','',3,3,'2025-02-18 03:16:58',1,1,'-500','1000','500'),(6147,46,'修真者:46',5,'','','',3,3,'2025-02-18 03:25:49',1,1,'-100','550','450');
/*!40000 ALTER TABLE `exp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fuben`
--

DROP TABLE IF EXISTS `fuben`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=6352 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='副本';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fuben`
--

LOCK TABLES `fuben` WRITE;
/*!40000 ALTER TABLE `fuben` DISABLE KEYS */;
/*!40000 ALTER TABLE `fuben` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gem`
--

DROP TABLE IF EXISTS `gem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=21719 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='钻石';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gem`
--

LOCK TABLES `gem` WRITE;
/*!40000 ALTER TABLE `gem` DISABLE KEYS */;
INSERT INTO `gem` VALUES (21703,31,'修真者:31',5,'','','',4,4,'2025-02-17 18:08:28',1,1,'0','100','100'),(21704,31,'修真者:31',5,'','','',4,4,'2025-02-17 18:09:40',1,1,'100','1','101'),(21705,31,'修真者:31',5,'','','',4,4,'2025-02-17 18:12:22',1,1,'101','1','102'),(21706,42,'修真者:42',5,'','','',4,4,'2025-02-18 01:24:22',1,1,'0','1','1'),(21707,42,'修真者:42',5,'','','',4,4,'2025-02-18 01:25:59',1,1,'1','1','2'),(21708,42,'修真者:42',5,'','','',4,4,'2025-02-18 01:30:38',1,1,'2','10','12'),(21709,42,'修真者:42',5,'','','',4,4,'2025-02-18 01:30:39',1,1,'12','10','22'),(21710,42,'修真者:42',5,'','','',4,4,'2025-02-18 01:30:40',1,1,'22','10','32'),(21711,46,'修真者:46',5,'','','',4,4,'2025-02-18 03:16:58',1,1,'0','100','100'),(21712,46,'修真者:46',5,'','','',4,4,'2025-02-18 03:17:45',1,1,'100','10','110'),(21713,46,'修真者:46',5,'','','',4,4,'2025-02-18 03:17:53',1,1,'110','20','130'),(21714,46,'修真者:46',5,'','','',4,4,'2025-02-18 03:18:04',1,1,'130','10','140'),(21715,46,'修真者:46',5,'','','',4,4,'2025-02-18 03:25:49',1,1,'140','100','240'),(21716,46,'修真者:46',5,'','','',4,4,'2025-02-18 03:27:40',1,1,'240','10','250'),(21717,46,'修真者:46',5,'','','',4,4,'2025-02-18 03:27:40',1,1,'250','10','260'),(21718,46,'修真者:46',5,'','','',4,4,'2025-02-18 03:27:44',1,1,'260','20','280');
/*!40000 ALTER TABLE `gem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gift`
--

DROP TABLE IF EXISTS `gift`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=54588 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='礼包';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gift`
--

LOCK TABLES `gift` WRITE;
/*!40000 ALTER TABLE `gift` DISABLE KEYS */;
INSERT INTO `gift` VALUES (54584,31,'搬搬屋','','','',1,1,'2025-02-17 18:21:47'),(54585,31,'搬搬屋','','','',1,3,'2025-02-17 18:21:49'),(54586,42,'修真者:42','','','',1,1,'2025-02-18 01:30:47'),(54587,42,'修真者:42','','','',1,3,'2025-02-18 01:30:48');
/*!40000 ALTER TABLE `gift` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hangbox`
--

DROP TABLE IF EXISTS `hangbox`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=746 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='修炼宝箱';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hangbox`
--

LOCK TABLES `hangbox` WRITE;
/*!40000 ALTER TABLE `hangbox` DISABLE KEYS */;
/*!40000 ALTER TABLE `hangbox` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hero`
--

DROP TABLE IF EXISTS `hero`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=1129 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='英雄';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hero`
--

LOCK TABLES `hero` WRITE;
/*!40000 ALTER TABLE `hero` DISABLE KEYS */;
/*!40000 ALTER TABLE `hero` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item`
--

DROP TABLE IF EXISTS `item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=242660 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item`
--

LOCK TABLES `item` WRITE;
/*!40000 ALTER TABLE `item` DISABLE KEYS */;
INSERT INTO `item` VALUES (242419,1,'修真者:1',5,'','','',100401,100401,'2025-02-17 17:06:07',1,1,'0','1','1'),(242420,1,'修真者:1',5,'','','',100402,100402,'2025-02-17 17:06:07',1,1,'0','1','1'),(242421,13,'修真者:13',5,'','','',100401,100401,'2025-02-17 17:54:14',1,1,'0','1','1'),(242422,13,'修真者:13',5,'','','',100402,100402,'2025-02-17 17:54:14',1,1,'0','1','1'),(242423,2,'修真者:2',5,'','','',100401,100401,'2025-02-17 18:03:34',1,1,'0','1','1'),(242424,2,'修真者:2',5,'','','',100402,100402,'2025-02-17 18:03:34',1,1,'0','1','1'),(242425,31,'修真者:31',5,'','','',100401,100401,'2025-02-17 18:04:12',1,1,'0','1','1'),(242426,31,'修真者:31',5,'','','',100402,100402,'2025-02-17 18:04:12',1,1,'0','1','1'),(242427,31,'修真者:31',5,'','','',100101,100101,'2025-02-17 18:09:40',1,1,'0','1','1'),(242428,31,'修真者:31',5,'','','',100102,100102,'2025-02-17 18:09:40',1,1,'0','1','1'),(242429,31,'修真者:31',5,'','','',113160,113160,'2025-02-17 18:09:40',1,1,'0','1','1'),(242430,31,'修真者:31',5,'','','',112140,112140,'2025-02-17 18:09:40',1,1,'0','1','1'),(242431,31,'修真者:31',5,'','','',110351,110351,'2025-02-17 18:09:40',1,1,'0','1','1'),(242432,31,'修真者:31',5,'','','',110101,110101,'2025-02-17 18:09:40',1,1,'0','1','1'),(242433,31,'修真者:31',5,'','','',112150,112150,'2025-02-17 18:09:40',1,1,'0','1','1'),(242434,31,'修真者:31',5,'','','',112160,112160,'2025-02-17 18:09:40',1,1,'0','1','1'),(242435,31,'修真者:31',5,'','','',111140,111140,'2025-02-17 18:09:40',1,1,'0','1','1'),(242436,31,'修真者:31',5,'','','',111150,111150,'2025-02-17 18:09:40',1,1,'0','1','1'),(242437,31,'修真者:31',5,'','','',100401,100401,'2025-02-17 18:09:40',1,1,'1','1','2'),(242438,31,'修真者:31',5,'','','',100403,100403,'2025-02-17 18:09:40',1,1,'0','1','1'),(242439,31,'修真者:31',5,'','','',100402,100402,'2025-02-17 18:09:40',1,1,'1','1','2'),(242440,31,'修真者:31',5,'','','',100405,100405,'2025-02-17 18:09:40',1,1,'0','1','1'),(242441,31,'修真者:31',5,'','','',100404,100404,'2025-02-17 18:09:40',1,1,'0','1','1'),(242442,31,'修真者:31',5,'','','',111160,111160,'2025-02-17 18:09:40',1,1,'0','1','1'),(242443,31,'修真者:31',5,'','','',100411,100411,'2025-02-17 18:09:40',1,1,'0','1','1'),(242444,31,'修真者:31',5,'','','',100413,100413,'2025-02-17 18:09:40',1,1,'0','1','1'),(242445,31,'修真者:31',5,'','','',100415,100415,'2025-02-17 18:09:40',1,1,'0','1','1'),(242446,31,'修真者:31',5,'','','',100414,100414,'2025-02-17 18:09:40',1,1,'0','1','1'),(242447,31,'修真者:31',5,'','','',100416,100416,'2025-02-17 18:09:40',1,1,'0','1','1'),(242448,31,'修真者:31',5,'','','',100201,100201,'2025-02-17 18:09:40',1,1,'0','1','1'),(242449,31,'修真者:31',5,'','','',100203,100203,'2025-02-17 18:09:40',1,1,'0','1','1'),(242450,31,'修真者:31',5,'','','',100202,100202,'2025-02-17 18:09:40',1,1,'0','1','1'),(242451,31,'修真者:31',5,'','','',110205,110205,'2025-02-17 18:09:40',1,1,'0','1','1'),(242452,31,'修真者:31',5,'','','',110204,110204,'2025-02-17 18:09:40',1,1,'0','1','1'),(242453,31,'修真者:31',5,'','','',110206,110206,'2025-02-17 18:09:40',1,1,'0','1','1'),(242454,31,'修真者:31',5,'','','',100303,100303,'2025-02-17 18:09:40',1,1,'0','1','1'),(242455,31,'修真者:31',5,'','','',116140,116140,'2025-02-17 18:09:40',1,1,'0','1','1'),(242456,31,'修真者:31',5,'','','',116150,116150,'2025-02-17 18:09:40',1,1,'0','1','1'),(242457,31,'修真者:31',5,'','','',116160,116160,'2025-02-17 18:09:40',1,1,'0','1','1'),(242458,31,'修真者:31',5,'','','',115140,115140,'2025-02-17 18:09:40',1,1,'0','1','1'),(242459,31,'修真者:31',5,'','','',100301,100301,'2025-02-17 18:09:40',1,1,'0','1','1'),(242460,31,'修真者:31',5,'','','',100303,100303,'2025-02-17 18:09:40',1,1,'1','1','2'),(242461,31,'修真者:31',5,'','','',100302,100302,'2025-02-17 18:09:40',1,1,'0','1','1'),(242462,31,'修真者:31',5,'','','',115150,115150,'2025-02-17 18:09:40',1,1,'0','1','1'),(242463,31,'修真者:31',5,'','','',100305,100305,'2025-02-17 18:09:40',1,1,'0','1','1'),(242464,31,'修真者:31',5,'','','',100304,100304,'2025-02-17 18:09:40',1,1,'0','1','1'),(242465,31,'修真者:31',5,'','','',100306,100306,'2025-02-17 18:09:40',1,1,'0','1','1'),(242466,31,'修真者:31',5,'','','',115160,115160,'2025-02-17 18:09:40',1,1,'0','1','1'),(242467,31,'修真者:31',5,'','','',110301,110301,'2025-02-17 18:09:40',1,1,'0','1','1'),(242468,31,'修真者:31',5,'','','',114140,114140,'2025-02-17 18:09:40',1,1,'0','1','1'),(242469,31,'修真者:31',5,'','','',110302,110302,'2025-02-17 18:09:40',1,1,'0','1','1'),(242470,31,'修真者:31',5,'','','',114150,114150,'2025-02-17 18:09:40',1,1,'0','1','1'),(242471,31,'修真者:31',5,'','','',110321,110321,'2025-02-17 18:09:40',1,1,'0','1','1'),(242472,31,'修真者:31',5,'','','',114160,114160,'2025-02-17 18:09:40',1,1,'0','1','1'),(242473,31,'修真者:31',5,'','','',110322,110322,'2025-02-17 18:09:40',1,1,'0','1','1'),(242474,31,'修真者:31',5,'','','',113140,113140,'2025-02-17 18:09:40',1,1,'0','1','1'),(242475,31,'修真者:31',5,'','','',110331,110331,'2025-02-17 18:09:40',1,1,'0','1','1'),(242476,31,'修真者:31',5,'','','',113150,113150,'2025-02-17 18:09:40',1,1,'0','1','1'),(242477,31,'修真者:31',5,'','','',100101,100101,'2025-02-17 18:12:22',1,1,'1','1','2'),(242478,31,'修真者:31',5,'','','',100102,100102,'2025-02-17 18:12:22',1,1,'1','1','2'),(242479,31,'修真者:31',5,'','','',113160,113160,'2025-02-17 18:12:22',1,1,'1','1','2'),(242480,31,'修真者:31',5,'','','',112140,112140,'2025-02-17 18:12:22',1,1,'1','1','2'),(242481,31,'修真者:31',5,'','','',110351,110351,'2025-02-17 18:12:22',1,1,'1','1','2'),(242482,31,'修真者:31',5,'','','',110101,110101,'2025-02-17 18:12:22',1,1,'1','1','2'),(242483,31,'修真者:31',5,'','','',112150,112150,'2025-02-17 18:12:22',1,1,'1','1','2'),(242484,31,'修真者:31',5,'','','',112160,112160,'2025-02-17 18:12:22',1,1,'1','1','2'),(242485,31,'修真者:31',5,'','','',111140,111140,'2025-02-17 18:12:22',1,1,'1','1','2'),(242486,31,'修真者:31',5,'','','',111150,111150,'2025-02-17 18:12:22',1,1,'1','1','2'),(242487,31,'修真者:31',5,'','','',100401,100401,'2025-02-17 18:12:22',1,1,'2','1','3'),(242488,31,'修真者:31',5,'','','',100403,100403,'2025-02-17 18:12:22',1,1,'1','1','2'),(242489,31,'修真者:31',5,'','','',100402,100402,'2025-02-17 18:12:22',1,1,'2','1','3'),(242490,31,'修真者:31',5,'','','',100405,100405,'2025-02-17 18:12:22',1,1,'1','1','2'),(242491,31,'修真者:31',5,'','','',100404,100404,'2025-02-17 18:12:22',1,1,'1','1','2'),(242492,31,'修真者:31',5,'','','',111160,111160,'2025-02-17 18:12:22',1,1,'1','1','2'),(242493,31,'修真者:31',5,'','','',100411,100411,'2025-02-17 18:12:22',1,1,'1','1','2'),(242494,31,'修真者:31',5,'','','',100413,100413,'2025-02-17 18:12:22',1,1,'1','1','2'),(242495,31,'修真者:31',5,'','','',100415,100415,'2025-02-17 18:12:22',1,1,'1','1','2'),(242496,31,'修真者:31',5,'','','',100414,100414,'2025-02-17 18:12:22',1,1,'1','1','2'),(242497,31,'修真者:31',5,'','','',100416,100416,'2025-02-17 18:12:22',1,1,'1','1','2'),(242498,31,'修真者:31',5,'','','',100201,100201,'2025-02-17 18:12:22',1,1,'1','1','2'),(242499,31,'修真者:31',5,'','','',100203,100203,'2025-02-17 18:12:22',1,1,'1','1','2'),(242500,31,'修真者:31',5,'','','',100202,100202,'2025-02-17 18:12:22',1,1,'1','1','2'),(242501,31,'修真者:31',5,'','','',110205,110205,'2025-02-17 18:12:22',1,1,'1','1','2'),(242502,31,'修真者:31',5,'','','',110204,110204,'2025-02-17 18:12:22',1,1,'1','1','2'),(242503,31,'修真者:31',5,'','','',110206,110206,'2025-02-17 18:12:22',1,1,'1','1','2'),(242504,31,'修真者:31',5,'','','',100303,100303,'2025-02-17 18:12:22',1,1,'2','1','3'),(242505,31,'修真者:31',5,'','','',116140,116140,'2025-02-17 18:12:22',1,1,'1','1','2'),(242506,31,'修真者:31',5,'','','',116150,116150,'2025-02-17 18:12:22',1,1,'1','1','2'),(242507,31,'修真者:31',5,'','','',116160,116160,'2025-02-17 18:12:22',1,1,'1','1','2'),(242508,31,'修真者:31',5,'','','',115140,115140,'2025-02-17 18:12:22',1,1,'1','1','2'),(242509,31,'修真者:31',5,'','','',100301,100301,'2025-02-17 18:12:22',1,1,'1','1','2'),(242510,31,'修真者:31',5,'','','',100303,100303,'2025-02-17 18:12:22',1,1,'3','1','4'),(242511,31,'修真者:31',5,'','','',100302,100302,'2025-02-17 18:12:22',1,1,'1','1','2'),(242512,31,'修真者:31',5,'','','',115150,115150,'2025-02-17 18:12:22',1,1,'1','1','2'),(242513,31,'修真者:31',5,'','','',100305,100305,'2025-02-17 18:12:22',1,1,'1','1','2'),(242514,31,'修真者:31',5,'','','',100304,100304,'2025-02-17 18:12:22',1,1,'1','1','2'),(242515,31,'修真者:31',5,'','','',100306,100306,'2025-02-17 18:12:22',1,1,'1','1','2'),(242516,31,'修真者:31',5,'','','',115160,115160,'2025-02-17 18:12:22',1,1,'1','1','2'),(242517,31,'修真者:31',5,'','','',110301,110301,'2025-02-17 18:12:22',1,1,'1','1','2'),(242518,31,'修真者:31',5,'','','',114140,114140,'2025-02-17 18:12:22',1,1,'1','1','2'),(242519,31,'修真者:31',5,'','','',110302,110302,'2025-02-17 18:12:22',1,1,'1','1','2'),(242520,31,'修真者:31',5,'','','',114150,114150,'2025-02-17 18:12:22',1,1,'1','1','2'),(242521,31,'修真者:31',5,'','','',110321,110321,'2025-02-17 18:12:22',1,1,'1','1','2'),(242522,31,'修真者:31',5,'','','',114160,114160,'2025-02-17 18:12:22',1,1,'1','1','2'),(242523,31,'修真者:31',5,'','','',110322,110322,'2025-02-17 18:12:22',1,1,'1','1','2'),(242524,31,'修真者:31',5,'','','',113140,113140,'2025-02-17 18:12:22',1,1,'1','1','2'),(242525,31,'修真者:31',5,'','','',110331,110331,'2025-02-17 18:12:22',1,1,'1','1','2'),(242526,31,'修真者:31',5,'','','',113150,113150,'2025-02-17 18:12:22',1,1,'1','1','2'),(242527,31,'修真者:31',5,'','','',100301,100301,'2025-02-17 18:20:49',1,1,'2','1','3'),(242528,31,'修真者:31',5,'','','',100301,100301,'2025-02-17 18:20:49',1,1,'3','1','4'),(242529,31,'修真者:31',5,'','','',100303,100303,'2025-02-17 18:20:49',1,1,'4','1','5'),(242530,31,'搬搬屋',5,'','','',100101,100101,'2025-02-17 18:21:49',1,1,'2','3','5'),(242531,31,'搬搬屋',5,'','','',100203,100203,'2025-02-17 18:22:16',2,2,'2','-1','1'),(242532,36,'修真者:36',5,'','','',100401,100401,'2025-02-18 00:47:23',1,1,'0','1','1'),(242533,36,'修真者:36',5,'','','',100402,100402,'2025-02-18 00:47:23',1,1,'0','1','1'),(242534,1,'',5,'','','',100401,100401,'2025-02-18 01:17:01',1,1,'1','1','2'),(242535,1,'',5,'','','',100402,100402,'2025-02-18 01:17:01',1,1,'1','1','2'),(242536,1,'',5,'','','',100401,100401,'2025-02-18 01:17:45',1,1,'2','1','3'),(242537,1,'',5,'','','',100402,100402,'2025-02-18 01:17:45',1,1,'2','1','3'),(242538,1,'',5,'','','',100401,100401,'2025-02-18 01:18:51',1,1,'3','1','4'),(242539,1,'',5,'','','',100402,100402,'2025-02-18 01:18:51',1,1,'3','1','4'),(242540,42,'修真者:42',5,'','','',100401,100401,'2025-02-18 01:20:14',1,1,'0','1','1'),(242541,42,'修真者:42',5,'','','',100402,100402,'2025-02-18 01:20:14',1,1,'0','1','1'),(242542,42,'修真者:42',5,'','','',100101,100101,'2025-02-18 01:24:22',1,1,'0','1','1'),(242543,42,'修真者:42',5,'','','',100102,100102,'2025-02-18 01:24:22',1,1,'0','1','1'),(242544,42,'修真者:42',5,'','','',113160,113160,'2025-02-18 01:24:22',1,1,'0','1','1'),(242545,42,'修真者:42',5,'','','',112140,112140,'2025-02-18 01:24:22',1,1,'0','1','1'),(242546,42,'修真者:42',5,'','','',110351,110351,'2025-02-18 01:24:22',1,1,'0','1','1'),(242547,42,'修真者:42',5,'','','',110101,110101,'2025-02-18 01:24:22',1,1,'0','1','1'),(242548,42,'修真者:42',5,'','','',112150,112150,'2025-02-18 01:24:22',1,1,'0','1','1'),(242549,42,'修真者:42',5,'','','',112160,112160,'2025-02-18 01:24:22',1,1,'0','1','1'),(242550,42,'修真者:42',5,'','','',111140,111140,'2025-02-18 01:24:22',1,1,'0','1','1'),(242551,42,'修真者:42',5,'','','',111150,111150,'2025-02-18 01:24:22',1,1,'0','1','1'),(242552,42,'修真者:42',5,'','','',100401,100401,'2025-02-18 01:24:22',1,1,'1','1','2'),(242553,42,'修真者:42',5,'','','',100403,100403,'2025-02-18 01:24:22',1,1,'0','1','1'),(242554,42,'修真者:42',5,'','','',100402,100402,'2025-02-18 01:24:22',1,1,'1','1','2'),(242555,42,'修真者:42',5,'','','',100405,100405,'2025-02-18 01:24:22',1,1,'0','1','1'),(242556,42,'修真者:42',5,'','','',100404,100404,'2025-02-18 01:24:22',1,1,'0','1','1'),(242557,42,'修真者:42',5,'','','',111160,111160,'2025-02-18 01:24:22',1,1,'0','1','1'),(242558,42,'修真者:42',5,'','','',100411,100411,'2025-02-18 01:24:22',1,1,'0','1','1'),(242559,42,'修真者:42',5,'','','',100413,100413,'2025-02-18 01:24:22',1,1,'0','1','1'),(242560,42,'修真者:42',5,'','','',100415,100415,'2025-02-18 01:24:22',1,1,'0','1','1'),(242561,42,'修真者:42',5,'','','',100414,100414,'2025-02-18 01:24:22',1,1,'0','1','1'),(242562,42,'修真者:42',5,'','','',100416,100416,'2025-02-18 01:24:22',1,1,'0','1','1'),(242563,42,'修真者:42',5,'','','',100201,100201,'2025-02-18 01:24:22',1,1,'0','1','1'),(242564,42,'修真者:42',5,'','','',100203,100203,'2025-02-18 01:24:22',1,1,'0','1','1'),(242565,42,'修真者:42',5,'','','',100202,100202,'2025-02-18 01:24:22',1,1,'0','1','1'),(242566,42,'修真者:42',5,'','','',110205,110205,'2025-02-18 01:24:22',1,1,'0','1','1'),(242567,42,'修真者:42',5,'','','',110204,110204,'2025-02-18 01:24:22',1,1,'0','1','1'),(242568,42,'修真者:42',5,'','','',110206,110206,'2025-02-18 01:24:22',1,1,'0','1','1'),(242569,42,'修真者:42',5,'','','',100305,100305,'2025-02-18 01:24:22',1,1,'0','1','1'),(242570,42,'修真者:42',5,'','','',116140,116140,'2025-02-18 01:24:22',1,1,'0','1','1'),(242571,42,'修真者:42',5,'','','',116150,116150,'2025-02-18 01:24:22',1,1,'0','1','1'),(242572,42,'修真者:42',5,'','','',116160,116160,'2025-02-18 01:24:22',1,1,'0','1','1'),(242573,42,'修真者:42',5,'','','',115140,115140,'2025-02-18 01:24:22',1,1,'0','1','1'),(242574,42,'修真者:42',5,'','','',100301,100301,'2025-02-18 01:24:22',1,1,'0','1','1'),(242575,42,'修真者:42',5,'','','',100303,100303,'2025-02-18 01:24:22',1,1,'0','1','1'),(242576,42,'修真者:42',5,'','','',100302,100302,'2025-02-18 01:24:22',1,1,'0','1','1'),(242577,42,'修真者:42',5,'','','',115150,115150,'2025-02-18 01:24:22',1,1,'0','1','1'),(242578,42,'修真者:42',5,'','','',100305,100305,'2025-02-18 01:24:22',1,1,'1','1','2'),(242579,42,'修真者:42',5,'','','',100304,100304,'2025-02-18 01:24:22',1,1,'0','1','1'),(242580,42,'修真者:42',5,'','','',100306,100306,'2025-02-18 01:24:22',1,1,'0','1','1'),(242581,42,'修真者:42',5,'','','',115160,115160,'2025-02-18 01:24:22',1,1,'0','1','1'),(242582,42,'修真者:42',5,'','','',110301,110301,'2025-02-18 01:24:22',1,1,'0','1','1'),(242583,42,'修真者:42',5,'','','',114140,114140,'2025-02-18 01:24:22',1,1,'0','1','1'),(242584,42,'修真者:42',5,'','','',110302,110302,'2025-02-18 01:24:22',1,1,'0','1','1'),(242585,42,'修真者:42',5,'','','',114150,114150,'2025-02-18 01:24:22',1,1,'0','1','1'),(242586,42,'修真者:42',5,'','','',110321,110321,'2025-02-18 01:24:22',1,1,'0','1','1'),(242587,42,'修真者:42',5,'','','',114160,114160,'2025-02-18 01:24:22',1,1,'0','1','1'),(242588,42,'修真者:42',5,'','','',110322,110322,'2025-02-18 01:24:22',1,1,'0','1','1'),(242589,42,'修真者:42',5,'','','',113140,113140,'2025-02-18 01:24:22',1,1,'0','1','1'),(242590,42,'修真者:42',5,'','','',110331,110331,'2025-02-18 01:24:22',1,1,'0','1','1'),(242591,42,'修真者:42',5,'','','',113150,113150,'2025-02-18 01:24:22',1,1,'0','1','1'),(242592,42,'修真者:42',5,'','','',100101,100101,'2025-02-18 01:25:59',1,1,'1','1','2'),(242593,42,'修真者:42',5,'','','',100102,100102,'2025-02-18 01:25:59',1,1,'1','1','2'),(242594,42,'修真者:42',5,'','','',113160,113160,'2025-02-18 01:25:59',1,1,'1','1','2'),(242595,42,'修真者:42',5,'','','',112140,112140,'2025-02-18 01:25:59',1,1,'1','1','2'),(242596,42,'修真者:42',5,'','','',110351,110351,'2025-02-18 01:25:59',1,1,'1','1','2'),(242597,42,'修真者:42',5,'','','',110101,110101,'2025-02-18 01:25:59',1,1,'1','1','2'),(242598,42,'修真者:42',5,'','','',112150,112150,'2025-02-18 01:25:59',1,1,'1','1','2'),(242599,42,'修真者:42',5,'','','',112160,112160,'2025-02-18 01:25:59',1,1,'1','1','2'),(242600,42,'修真者:42',5,'','','',111140,111140,'2025-02-18 01:25:59',1,1,'1','1','2'),(242601,42,'修真者:42',5,'','','',111150,111150,'2025-02-18 01:25:59',1,1,'1','1','2'),(242602,42,'修真者:42',5,'','','',100401,100401,'2025-02-18 01:25:59',1,1,'2','1','3'),(242603,42,'修真者:42',5,'','','',100403,100403,'2025-02-18 01:25:59',1,1,'1','1','2'),(242604,42,'修真者:42',5,'','','',100402,100402,'2025-02-18 01:25:59',1,1,'2','1','3'),(242605,42,'修真者:42',5,'','','',100405,100405,'2025-02-18 01:25:59',1,1,'1','1','2'),(242606,42,'修真者:42',5,'','','',100404,100404,'2025-02-18 01:25:59',1,1,'1','1','2'),(242607,42,'修真者:42',5,'','','',111160,111160,'2025-02-18 01:25:59',1,1,'1','1','2'),(242608,42,'修真者:42',5,'','','',100411,100411,'2025-02-18 01:25:59',1,1,'1','1','2'),(242609,42,'修真者:42',5,'','','',100413,100413,'2025-02-18 01:25:59',1,1,'1','1','2'),(242610,42,'修真者:42',5,'','','',100415,100415,'2025-02-18 01:25:59',1,1,'1','1','2'),(242611,42,'修真者:42',5,'','','',100414,100414,'2025-02-18 01:25:59',1,1,'1','1','2'),(242612,42,'修真者:42',5,'','','',100416,100416,'2025-02-18 01:25:59',1,1,'1','1','2'),(242613,42,'修真者:42',5,'','','',100201,100201,'2025-02-18 01:25:59',1,1,'1','1','2'),(242614,42,'修真者:42',5,'','','',100203,100203,'2025-02-18 01:25:59',1,1,'1','1','2'),(242615,42,'修真者:42',5,'','','',100202,100202,'2025-02-18 01:25:59',1,1,'1','1','2'),(242616,42,'修真者:42',5,'','','',110205,110205,'2025-02-18 01:25:59',1,1,'1','1','2'),(242617,42,'修真者:42',5,'','','',110204,110204,'2025-02-18 01:25:59',1,1,'1','1','2'),(242618,42,'修真者:42',5,'','','',110206,110206,'2025-02-18 01:25:59',1,1,'1','1','2'),(242619,42,'修真者:42',5,'','','',100304,100304,'2025-02-18 01:25:59',1,1,'1','1','2'),(242620,42,'修真者:42',5,'','','',116140,116140,'2025-02-18 01:25:59',1,1,'1','1','2'),(242621,42,'修真者:42',5,'','','',116150,116150,'2025-02-18 01:25:59',1,1,'1','1','2'),(242622,42,'修真者:42',5,'','','',116160,116160,'2025-02-18 01:25:59',1,1,'1','1','2'),(242623,42,'修真者:42',5,'','','',115140,115140,'2025-02-18 01:25:59',1,1,'1','1','2'),(242624,42,'修真者:42',5,'','','',100301,100301,'2025-02-18 01:25:59',1,1,'1','1','2'),(242625,42,'修真者:42',5,'','','',100303,100303,'2025-02-18 01:25:59',1,1,'1','1','2'),(242626,42,'修真者:42',5,'','','',100302,100302,'2025-02-18 01:25:59',1,1,'1','1','2'),(242627,42,'修真者:42',5,'','','',115150,115150,'2025-02-18 01:25:59',1,1,'1','1','2'),(242628,42,'修真者:42',5,'','','',100305,100305,'2025-02-18 01:25:59',1,1,'2','1','3'),(242629,42,'修真者:42',5,'','','',100304,100304,'2025-02-18 01:25:59',1,1,'2','1','3'),(242630,42,'修真者:42',5,'','','',100306,100306,'2025-02-18 01:25:59',1,1,'1','1','2'),(242631,42,'修真者:42',5,'','','',115160,115160,'2025-02-18 01:25:59',1,1,'1','1','2'),(242632,42,'修真者:42',5,'','','',110301,110301,'2025-02-18 01:25:59',1,1,'1','1','2'),(242633,42,'修真者:42',5,'','','',114140,114140,'2025-02-18 01:25:59',1,1,'1','1','2'),(242634,42,'修真者:42',5,'','','',110302,110302,'2025-02-18 01:25:59',1,1,'1','1','2'),(242635,42,'修真者:42',5,'','','',114150,114150,'2025-02-18 01:25:59',1,1,'1','1','2'),(242636,42,'修真者:42',5,'','','',110321,110321,'2025-02-18 01:25:59',1,1,'1','1','2'),(242637,42,'修真者:42',5,'','','',114160,114160,'2025-02-18 01:25:59',1,1,'1','1','2'),(242638,42,'修真者:42',5,'','','',110322,110322,'2025-02-18 01:25:59',1,1,'1','1','2'),(242639,42,'修真者:42',5,'','','',113140,113140,'2025-02-18 01:25:59',1,1,'1','1','2'),(242640,42,'修真者:42',5,'','','',110331,110331,'2025-02-18 01:25:59',1,1,'1','1','2'),(242641,42,'修真者:42',5,'','','',113150,113150,'2025-02-18 01:25:59',1,1,'1','1','2'),(242642,42,'修真者:42',5,'','','',100101,100101,'2025-02-18 01:27:45',1,1,'2','1','3'),(242643,42,'修真者:42',5,'','','',100101,100101,'2025-02-18 01:30:48',1,1,'3','3','6'),(242644,46,'修真者:46',5,'','','',100401,100401,'2025-02-18 03:11:33',1,1,'0','1','1'),(242645,46,'修真者:46',5,'','','',100402,100402,'2025-02-18 03:11:33',1,1,'0','1','1'),(242646,46,'修真者:46',5,'','','',100303,100303,'2025-02-18 03:16:58',1,1,'0','1','1'),(242647,46,'修真者:46',5,'','','',100306,100306,'2025-02-18 03:16:58',1,1,'0','1','1'),(242648,46,'修真者:46',5,'','','',100301,100301,'2025-02-18 03:16:58',1,1,'0','1','1'),(242649,46,'修真者:46',5,'','','',100302,100302,'2025-02-18 03:16:58',1,1,'0','1','1'),(242650,46,'修真者:46',5,'','','',100303,100303,'2025-02-18 03:16:58',1,1,'1','1','2'),(242651,46,'修真者:46',5,'','','',100302,100302,'2025-02-18 03:16:58',1,1,'1','1','2'),(242652,46,'修真者:46',5,'','','',100302,100302,'2025-02-18 03:17:51',1,1,'2','1','3'),(242653,46,'修真者:46',5,'','','',100302,100302,'2025-02-18 03:17:51',1,1,'3','1','4'),(242654,46,'修真者:46',5,'','','',100101,100101,'2025-02-18 03:17:55',1,1,'0','1','1'),(242655,46,'修真者:46',5,'','','',100201,100201,'2025-02-18 03:18:41',1,1,'0','1','1'),(242656,46,'修真者:46',5,'','','',100101,100101,'2025-02-18 03:18:41',1,1,'1','1','2'),(242657,46,'修真者:46',5,'','','',100202,100202,'2025-02-18 03:18:42',1,1,'0','1','1'),(242658,46,'修真者:46',5,'','','',100303,100303,'2025-02-18 03:19:36',2,2,'2','-1','1'),(242659,46,'修真者:46',5,'','','',100303,100303,'2025-02-18 03:19:37',2,2,'1','-1','0');
/*!40000 ALTER TABLE `item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `login`
--

DROP TABLE IF EXISTS `login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=23490 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login`
--

LOCK TABLES `login` WRITE;
/*!40000 ALTER TABLE `login` DISABLE KEYS */;
INSERT INTO `login` VALUES (23464,1,'修真者:1',5,'null','null','null','2025-02-17 17:20:26','218.69.226.32','null','null','null'),(23465,1,'修真者:1',5,'null','null','null','2025-02-17 17:22:53','218.69.226.32','null','null','null'),(23466,1,'修真者:1',5,'null','null','null','2025-02-17 17:24:55','218.69.226.32','null','null','null'),(23467,1,'修真者:1',5,'null','null','null','2025-02-17 17:26:17','218.69.226.32','null','null','null'),(23468,1,'修真者:1',5,'null','null','null','2025-02-17 17:32:39','218.69.226.32','null','null','null'),(23469,1,'修真者:1',5,'null','null','null','2025-02-17 17:37:16','218.69.226.32','null','null','null'),(23470,1,'修真者:1',5,'null','null','null','2025-02-17 17:41:38','218.69.226.32','null','null','null'),(23471,31,'修真者:31',5,'null','null','null','2025-02-17 18:11:05','106.116.226.73','null','null','null'),(23472,31,'修真者:31',5,'null','null','null','2025-02-17 18:11:12','106.116.226.73','null','null','null'),(23473,31,'修真者:31',5,'null','null','null','2025-02-17 18:11:17','106.116.226.73','null','null','null'),(23474,31,'修真者:31',5,'null','null','null','2025-02-17 18:11:26','106.116.226.73','null','null','null'),(23475,31,'修真者:31',5,'null','null','null','2025-02-17 18:12:30','106.116.226.73','null','null','null'),(23476,42,'修真者:42',5,'null','null','null','2025-02-18 01:23:02','221.192.123.39','null','null','null'),(23477,42,'修真者:42',5,'null','null','null','2025-02-18 01:23:35','221.192.123.39','null','null','null'),(23478,42,'修真者:42',5,'null','null','null','2025-02-18 01:25:42','221.192.123.39','null','null','null'),(23479,42,'修真者:42',5,'null','null','null','2025-02-18 01:27:25','221.192.123.39','null','null','null'),(23480,42,'修真者:42',5,'null','null','null','2025-02-18 01:28:40','221.192.123.39','null','null','null'),(23481,42,'修真者:42',5,'null','null','null','2025-02-18 01:29:16','221.192.123.39','null','null','null'),(23482,42,'修真者:42',5,'null','null','null','2025-02-18 01:30:28','221.192.123.39','null','null','null'),(23483,42,'修真者:42',5,'null','null','null','2025-02-18 01:31:19','221.192.123.39','null','null','null'),(23484,42,'修真者:42',5,'null','null','null','2025-02-18 01:32:01','221.192.123.39','null','null','null'),(23485,46,'修真者:46',5,'null','null','null','2025-02-18 03:18:53','218.69.226.32','null','null','null'),(23486,46,'修真者:46',5,'null','null','null','2025-02-18 03:21:03','218.69.226.32','null','null','null'),(23487,46,'修真者:46',5,'null','null','null','2025-02-18 03:21:07','218.69.226.32','null','null','null'),(23488,46,'修真者:46',5,'null','null','null','2025-02-18 03:21:52','218.69.226.32','null','null','null'),(23489,46,'修真者:46',5,'null','null','null','2025-02-18 03:26:57','218.69.226.32','null','null','null');
/*!40000 ALTER TABLE `login` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loginout`
--

DROP TABLE IF EXISTS `loginout`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=25262 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loginout`
--

LOCK TABLES `loginout` WRITE;
/*!40000 ALTER TABLE `loginout` DISABLE KEYS */;
INSERT INTO `loginout` VALUES (25233,1,'修真者:1',5,'null','null','null','2025-02-17 17:06:07','2025-02-17 17:16:25',10,'218.69.226.32','null','null','null'),(25234,1,'修真者:1',5,'null','null','null','2025-02-17 17:20:26','2025-02-17 17:22:43',2,'218.69.226.32','null','null','null'),(25235,1,'修真者:1',5,'null','null','null','2025-02-17 17:24:55','2025-02-17 17:24:58',0,'218.69.226.32','null','null','null'),(25236,1,'修真者:1',5,'null','null','null','2025-02-17 17:26:17','2025-02-17 17:26:41',0,'218.69.226.32','null','null','null'),(25237,1,'修真者:1',5,'null','null','null','2025-02-17 17:32:39','2025-02-17 17:37:07',4,'218.69.226.32','null','null','null'),(25238,1,'修真者:1',5,'null','null','null','2025-02-17 17:37:16','2025-02-17 17:38:53',1,'218.69.226.32','null','null','null'),(25239,1,'修真者:1',5,'null','null','null','2025-02-17 17:41:38','2025-02-17 17:41:39',0,'218.69.226.32','null','null','null'),(25240,13,'修真者:13',5,'null','null','null','2025-02-17 17:54:14','2025-02-17 18:03:25',9,'218.69.226.32','null','null','null'),(25241,2,'修真者:2',5,'null','null','null','2025-02-17 18:03:34','2025-02-17 18:09:19',5,'218.69.226.32','null','null','null'),(25242,31,'修真者:31',5,'null','null','null','2025-02-17 18:09:08','2025-02-17 18:11:05',1,'106.116.226.73','null','null','null'),(25243,31,'修真者:31',5,'null','null','null','2025-02-17 18:11:05','2025-02-17 18:11:12',0,'106.116.226.73','null','null','null'),(25244,31,'修真者:31',5,'null','null','null','2025-02-17 18:11:12','2025-02-17 18:11:17',0,'106.116.226.73','null','null','null'),(25245,31,'修真者:31',5,'null','null','null','2025-02-17 18:11:17','2025-02-17 18:11:26',0,'106.116.226.73','null','null','null'),(25246,31,'修真者:31',5,'null','null','null','2025-02-17 18:11:26','2025-02-17 18:12:30',1,'106.116.226.73','null','null','null'),(25247,36,'修真者:36',5,'null','null','null','2025-02-18 00:47:22','2025-02-18 00:51:08',3,'218.69.226.32','null','null','null'),(25248,42,'修真者:42',5,'null','null','null','2025-02-18 01:20:14','2025-02-18 01:22:56',2,'221.192.123.39','null','null','null'),(25249,42,'修真者:42',5,'null','null','null','2025-02-18 01:23:02','2025-02-18 01:23:30',0,'221.192.123.39','null','null','null'),(25250,42,'修真者:42',5,'null','null','null','2025-02-18 01:23:35','2025-02-18 01:25:37',2,'221.192.123.39','null','null','null'),(25251,42,'修真者:42',5,'null','null','null','2025-02-18 01:25:42','2025-02-18 01:27:20',1,'221.192.123.39','null','null','null'),(25252,42,'修真者:42',5,'null','null','null','2025-02-18 01:27:25','2025-02-18 01:28:36',1,'221.192.123.39','null','null','null'),(25253,42,'修真者:42',5,'null','null','null','2025-02-18 01:28:40','2025-02-18 01:29:12',0,'221.192.123.39','null','null','null'),(25254,42,'修真者:42',5,'null','null','null','2025-02-18 01:29:16','2025-02-18 01:30:21',1,'221.192.123.39','null','null','null'),(25255,42,'修真者:42',5,'null','null','null','2025-02-18 01:30:28','2025-02-18 01:31:15',0,'221.192.123.39','null','null','null'),(25256,42,'修真者:42',5,'null','null','null','2025-02-18 01:31:19','2025-02-18 01:31:40',0,'221.192.123.39','null','null','null'),(25257,46,'修真者:46',5,'null','null','null','2025-02-18 03:11:33','2025-02-18 03:18:53',7,'218.69.226.32','null','null','null'),(25258,46,'修真者:46',5,'null','null','null','2025-02-18 03:18:53','2025-02-18 03:21:03',2,'218.69.226.32','null','null','null'),(25259,46,'修真者:46',5,'null','null','null','2025-02-18 03:21:03','2025-02-18 03:21:07',0,'218.69.226.32','null','null','null'),(25260,46,'修真者:46',5,'null','null','null','2025-02-18 03:21:07','2025-02-18 03:21:43',0,'218.69.226.32','null','null','null'),(25261,46,'修真者:46',5,'null','null','null','2025-02-18 03:21:52','2025-02-18 03:26:57',5,'218.69.226.32','null','null','null');
/*!40000 ALTER TABLE `loginout` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lv`
--

DROP TABLE IF EXISTS `lv`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=9409 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='等级';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lv`
--

LOCK TABLES `lv` WRITE;
/*!40000 ALTER TABLE `lv` DISABLE KEYS */;
INSERT INTO `lv` VALUES (9402,31,'修真者:31',5,'','','',5,5,'2025-02-17 18:08:28',1,1,'1','1','2'),(9403,31,'修真者:31',5,'','','',5,5,'2025-02-17 18:09:40',1,1,'2','1','3'),(9404,31,'修真者:31',5,'','','',5,5,'2025-02-17 18:12:22',1,1,'3','1','4'),(9405,42,'修真者:42',5,'','','',5,5,'2025-02-18 01:24:22',1,1,'1','1','2'),(9406,42,'修真者:42',5,'','','',5,5,'2025-02-18 01:25:59',1,1,'2','1','3'),(9407,46,'修真者:46',5,'','','',5,5,'2025-02-18 03:16:58',1,1,'1','1','2'),(9408,46,'修真者:46',5,'','','',5,5,'2025-02-18 03:25:49',1,1,'2','1','3');
/*!40000 ALTER TABLE `lv` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mail`
--

DROP TABLE IF EXISTS `mail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=1193 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='邮件日志';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mail`
--

LOCK TABLES `mail` WRITE;
/*!40000 ALTER TABLE `mail` DISABLE KEYS */;
INSERT INTO `mail` VALUES (1187,42,'修真者:42','','','',1,1,0,0,'2025-02-18 01:23:11'),(1188,42,'修真者:42','','','',2,1,0,0,'2025-02-18 01:23:12'),(1189,42,'修真者:42','','','',3,1,0,0,'2025-02-18 01:23:13'),(1190,42,'修真者:42','','','',4,1,0,0,'2025-02-18 01:23:13'),(1191,46,'修真者:46','','','',8,1,0,0,'2025-02-18 03:22:39'),(1192,46,'修真者:46','','','',8,3,0,1,'2025-02-18 03:27:47');
/*!40000 ALTER TABLE `mail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mall`
--

DROP TABLE IF EXISTS `mall`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=17729 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='商城';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mall`
--

LOCK TABLES `mall` WRITE;
/*!40000 ALTER TABLE `mall` DISABLE KEYS */;
INSERT INTO `mall` VALUES (17720,31,'搬搬屋','','','',0,0,'2025-02-17 18:22:12'),(17721,31,'搬搬屋','','','',4,1,'2025-02-17 18:22:16'),(17722,46,'修真者:46','','','',0,0,'2025-02-18 03:18:14'),(17723,46,'修真者:46','','','',0,0,'2025-02-18 03:18:35'),(17724,46,'修真者:46','','','',0,0,'2025-02-18 03:19:16'),(17725,46,'修真者:46','','','',0,0,'2025-02-18 03:20:44'),(17726,46,'修真者:46','','','',0,0,'2025-02-18 03:21:41'),(17727,46,'修真者:46','','','',0,0,'2025-02-18 03:21:56'),(17728,46,'修真者:46','','','',0,0,'2025-02-18 03:22:44');
/*!40000 ALTER TABLE `mall` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `name`
--

DROP TABLE IF EXISTS `name`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `name`
--

LOCK TABLES `name` WRITE;
/*!40000 ALTER TABLE `name` DISABLE KEYS */;
/*!40000 ALTER TABLE `name` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `online`
--

DROP TABLE IF EXISTS `online`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `online` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `time` datetime NOT NULL COMMENT '时间',
  `online` int DEFAULT NULL COMMENT '在线人数',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `online`
--

LOCK TABLES `online` WRITE;
/*!40000 ALTER TABLE `online` DISABLE KEYS */;
/*!40000 ALTER TABLE `online` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `register`
--

DROP TABLE IF EXISTS `register`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=2890 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `register`
--

LOCK TABLES `register` WRITE;
/*!40000 ALTER TABLE `register` DISABLE KEYS */;
INSERT INTO `register` VALUES (2880,1,'修真者:1',5,'null','null','null','2025-02-17 17:06:07',0,'218.69.226.32','null','null','null'),(2881,13,'修真者:13',5,'null','null','null','2025-02-17 17:54:14',0,'218.69.226.32','null','null','null'),(2882,2,'修真者:2',5,'null','null','null','2025-02-17 18:03:34',0,'218.69.226.32','null','null','null'),(2883,31,'修真者:31',5,'null','null','null','2025-02-17 18:04:12',0,'106.116.226.73','null','null','null'),(2884,36,'修真者:36',5,'null','null','null','2025-02-18 00:47:23',0,'218.69.226.32','null','null','null'),(2885,1,'修真者:1',5,'null','null','null','2025-02-18 01:17:01',0,'221.192.123.39','null','null','null'),(2886,1,'修真者:1',5,'null','null','null','2025-02-18 01:17:45',0,'221.192.123.39','null','null','null'),(2887,1,'修真者:1',5,'null','null','null','2025-02-18 01:18:51',0,'221.192.123.39','null','null','null'),(2888,42,'修真者:42',5,'null','null','null','2025-02-18 01:20:14',0,'221.192.123.39','null','null','null'),(2889,46,'修真者:46',5,'null','null','null','2025-02-18 03:11:33',0,'218.69.226.32','null','null','null');
/*!40000 ALTER TABLE `register` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rune`
--

DROP TABLE IF EXISTS `rune`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=8048 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='符文日志';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rune`
--

LOCK TABLES `rune` WRITE;
/*!40000 ALTER TABLE `rune` DISABLE KEYS */;
INSERT INTO `rune` VALUES (8000,31,'修真者:31','','','',2,1,'2025-02-17 18:09:40','oldPhase=0, oldQuality=0, newPhase=0, newQuality=1'),(8001,31,'修真者:31','','','',3,1,'2025-02-17 18:09:40','oldPhase=0, oldQuality=0, newPhase=0, newQuality=4'),(8002,31,'修真者:31','','','',4,1,'2025-02-17 18:09:40','oldPhase=0, oldQuality=0, newPhase=0, newQuality=2'),(8003,31,'修真者:31','','','',5,1,'2025-02-17 18:09:40','oldPhase=0, oldQuality=0, newPhase=0, newQuality=2'),(8004,31,'修真者:31','','','',6,1,'2025-02-17 18:09:40','oldPhase=0, oldQuality=0, newPhase=0, newQuality=5'),(8005,31,'修真者:31','','','',7,1,'2025-02-17 18:09:40','oldPhase=0, oldQuality=0, newPhase=0, newQuality=3'),(8006,31,'修真者:31','','','',8,1,'2025-02-17 18:09:40','oldPhase=0, oldQuality=0, newPhase=0, newQuality=2'),(8007,31,'修真者:31','','','',9,1,'2025-02-17 18:09:40','oldPhase=0, oldQuality=0, newPhase=0, newQuality=3'),(8008,31,'修真者:31','','','',10,1,'2025-02-17 18:09:40','oldPhase=0, oldQuality=0, newPhase=0, newQuality=4'),(8009,31,'修真者:31','','','',11,1,'2025-02-17 18:09:40','oldPhase=0, oldQuality=0, newPhase=0, newQuality=5'),(8010,31,'修真者:31','','','',16,1,'2025-02-17 18:12:22','oldPhase=0, oldQuality=0, newPhase=0, newQuality=5'),(8011,31,'修真者:31','','','',17,1,'2025-02-17 18:12:22','oldPhase=0, oldQuality=0, newPhase=0, newQuality=3'),(8012,31,'修真者:31','','','',18,1,'2025-02-17 18:12:22','oldPhase=0, oldQuality=0, newPhase=0, newQuality=1'),(8013,31,'修真者:31','','','',19,1,'2025-02-17 18:12:22','oldPhase=0, oldQuality=0, newPhase=0, newQuality=2'),(8014,31,'修真者:31','','','',20,1,'2025-02-17 18:12:22','oldPhase=0, oldQuality=0, newPhase=0, newQuality=4'),(8015,31,'修真者:31','','','',21,1,'2025-02-17 18:12:22','oldPhase=0, oldQuality=0, newPhase=0, newQuality=5'),(8016,31,'修真者:31','','','',12,1,'2025-02-17 18:12:22','oldPhase=0, oldQuality=0, newPhase=0, newQuality=1'),(8017,31,'修真者:31','','','',13,1,'2025-02-17 18:12:22','oldPhase=0, oldQuality=0, newPhase=0, newQuality=4'),(8018,31,'修真者:31','','','',14,1,'2025-02-17 18:12:22','oldPhase=0, oldQuality=0, newPhase=0, newQuality=2'),(8019,31,'修真者:31','','','',15,1,'2025-02-17 18:12:22','oldPhase=0, oldQuality=0, newPhase=0, newQuality=1'),(8020,42,'修真者:42','','','',32,1,'2025-02-18 01:24:23','oldPhase=0, oldQuality=0, newPhase=0, newQuality=5'),(8021,42,'修真者:42','','','',23,1,'2025-02-18 01:24:23','oldPhase=0, oldQuality=0, newPhase=0, newQuality=1'),(8022,42,'修真者:42','','','',24,1,'2025-02-18 01:24:23','oldPhase=0, oldQuality=0, newPhase=0, newQuality=4'),(8023,42,'修真者:42','','','',25,1,'2025-02-18 01:24:23','oldPhase=0, oldQuality=0, newPhase=0, newQuality=2'),(8024,42,'修真者:42','','','',26,1,'2025-02-18 01:24:23','oldPhase=0, oldQuality=0, newPhase=0, newQuality=2'),(8025,42,'修真者:42','','','',27,1,'2025-02-18 01:24:23','oldPhase=0, oldQuality=0, newPhase=0, newQuality=5'),(8026,42,'修真者:42','','','',28,1,'2025-02-18 01:24:23','oldPhase=0, oldQuality=0, newPhase=0, newQuality=3'),(8027,42,'修真者:42','','','',29,1,'2025-02-18 01:24:23','oldPhase=0, oldQuality=0, newPhase=0, newQuality=2'),(8028,42,'修真者:42','','','',30,1,'2025-02-18 01:24:23','oldPhase=0, oldQuality=0, newPhase=0, newQuality=2'),(8029,42,'修真者:42','','','',31,1,'2025-02-18 01:24:23','oldPhase=0, oldQuality=0, newPhase=0, newQuality=4'),(8030,42,'修真者:42','','','',33,1,'2025-02-18 01:25:59','oldPhase=0, oldQuality=0, newPhase=0, newQuality=1'),(8031,42,'修真者:42','','','',34,1,'2025-02-18 01:25:59','oldPhase=0, oldQuality=0, newPhase=0, newQuality=4'),(8032,42,'修真者:42','','','',35,1,'2025-02-18 01:25:59','oldPhase=0, oldQuality=0, newPhase=0, newQuality=2'),(8033,42,'修真者:42','','','',36,1,'2025-02-18 01:25:59','oldPhase=0, oldQuality=0, newPhase=0, newQuality=2'),(8034,42,'修真者:42','','','',37,1,'2025-02-18 01:25:59','oldPhase=0, oldQuality=0, newPhase=0, newQuality=5'),(8035,42,'修真者:42','','','',38,1,'2025-02-18 01:25:59','oldPhase=0, oldQuality=0, newPhase=0, newQuality=3'),(8036,42,'修真者:42','','','',39,1,'2025-02-18 01:25:59','oldPhase=0, oldQuality=0, newPhase=0, newQuality=2'),(8037,42,'修真者:42','','','',40,1,'2025-02-18 01:25:59','oldPhase=0, oldQuality=0, newPhase=0, newQuality=3'),(8038,42,'修真者:42','','','',41,1,'2025-02-18 01:25:59','oldPhase=0, oldQuality=0, newPhase=0, newQuality=4'),(8039,42,'修真者:42','','','',42,1,'2025-02-18 01:25:59','oldPhase=0, oldQuality=0, newPhase=0, newQuality=5'),(8040,42,'修真者:42','','','',45,2,'2025-02-18 01:28:20','oldPhase=0, oldQuality=1, newPhase=0, newQuality=1'),(8041,42,'修真者:42','','','',47,2,'2025-02-18 01:28:20','oldPhase=0, oldQuality=1, newPhase=0, newQuality=1'),(8042,42,'修真者:42','','','',43,3,'2025-02-18 01:28:20','oldPhase=0, oldQuality=1, newPhase=0, newQuality=2'),(8043,42,'修真者:42','','','',43,1,'2025-02-18 01:28:20','oldPhase=0, oldQuality=0, newPhase=0, newQuality=2'),(8044,42,'修真者:42','','','',48,2,'2025-02-18 01:28:21','oldPhase=0, oldQuality=1, newPhase=0, newQuality=1'),(8045,42,'修真者:42','','','',50,2,'2025-02-18 01:28:21','oldPhase=0, oldQuality=1, newPhase=0, newQuality=1'),(8046,42,'修真者:42','','','',46,3,'2025-02-18 01:28:21','oldPhase=0, oldQuality=1, newPhase=0, newQuality=2'),(8047,42,'修真者:42','','','',46,1,'2025-02-18 01:28:21','oldPhase=0, oldQuality=0, newPhase=0, newQuality=2');
/*!40000 ALTER TABLE `rune` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sevendays`
--

DROP TABLE IF EXISTS `sevendays`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sevendays`
--

LOCK TABLES `sevendays` WRITE;
/*!40000 ALTER TABLE `sevendays` DISABLE KEYS */;
/*!40000 ALTER TABLE `sevendays` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sign`
--

DROP TABLE IF EXISTS `sign`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=542 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='签到';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sign`
--

LOCK TABLES `sign` WRITE;
/*!40000 ALTER TABLE `sign` DISABLE KEYS */;
INSERT INTO `sign` VALUES (540,42,'修真者:42','','','',2,1,'2025-02-18 01:27:45'),(541,46,'修真者:46','','','',2,1,'2025-02-18 03:17:55');
/*!40000 ALTER TABLE `sign` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `weeklyactive`
--

DROP TABLE IF EXISTS `weeklyactive`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=281 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='周常活跃';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weeklyactive`
--

LOCK TABLES `weeklyactive` WRITE;
/*!40000 ALTER TABLE `weeklyactive` DISABLE KEYS */;
INSERT INTO `weeklyactive` VALUES (277,31,'修真者:31',5,'','','',8,8,'2025-02-17 18:09:40',1,1,'0','1','1'),(278,31,'修真者:31',5,'','','',8,8,'2025-02-17 18:12:22',1,1,'1','1','2'),(279,42,'修真者:42',5,'','','',8,8,'2025-02-18 01:24:22',1,1,'0','1','1'),(280,42,'修真者:42',5,'','','',8,8,'2025-02-18 01:25:59',1,1,'1','1','2');
/*!40000 ALTER TABLE `weeklyactive` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'blcx_log'
--

--
-- Dumping routines for database 'blcx_log'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-18 22:56:37
