/*
 Navicat Premium Data Transfer

 Source Server         : blcx_host
 Source Server Type    : MySQL
 Source Server Version : 80043 (8.0.43)
 Source Host           : localhost:3306
 Source Schema         : blcx_center

 Target Server Type    : MySQL
 Target Server Version : 80043 (8.0.43)
 File Encoding         : 65001

 Date: 04/11/2025 15:25:35
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
-- Records of account
-- ----------------------------
BEGIN;
INSERT INTO `account` (`id`, `account`, `password`, `registerTime`, `lastLoginTime`) VALUES (2561, '111111', '111111', '2025-02-17 17:01:32', '2025-02-17 17:01:32');
INSERT INTO `account` (`id`, `account`, `password`, `registerTime`, `lastLoginTime`) VALUES (2562, '1111112', '111111', '2025-02-17 17:16:42', '2025-02-17 17:16:42');
INSERT INTO `account` (`id`, `account`, `password`, `registerTime`, `lastLoginTime`) VALUES (2563, '111113', '111111', '2025-02-17 17:25:33', '2025-02-17 17:25:33');
INSERT INTO `account` (`id`, `account`, `password`, `registerTime`, `lastLoginTime`) VALUES (2564, '1111113', '111111', '2025-02-17 17:26:53', '2025-02-17 17:26:53');
INSERT INTO `account` (`id`, `account`, `password`, `registerTime`, `lastLoginTime`) VALUES (2565, '11111133', '111111', '2025-02-17 17:27:20', '2025-02-17 17:27:20');
INSERT INTO `account` (`id`, `account`, `password`, `registerTime`, `lastLoginTime`) VALUES (2566, '1aaaa', '111111', '2025-02-17 17:30:08', '2025-02-17 17:30:08');
INSERT INTO `account` (`id`, `account`, `password`, `registerTime`, `lastLoginTime`) VALUES (2567, '1111111', '11111', '2025-02-17 18:03:48', '2025-02-17 18:03:48');
INSERT INTO `account` (`id`, `account`, `password`, `registerTime`, `lastLoginTime`) VALUES (2568, '123456', '123456', '2025-02-18 00:46:58', '2025-02-18 00:46:58');
INSERT INTO `account` (`id`, `account`, `password`, `registerTime`, `lastLoginTime`) VALUES (2569, '11111111', '111111', '2025-02-18 01:19:28', '2025-02-18 01:19:28');
INSERT INTO `account` (`id`, `account`, `password`, `registerTime`, `lastLoginTime`) VALUES (2570, '222222', '222222', '2025-02-18 01:20:08', '2025-02-18 01:20:08');
INSERT INTO `account` (`id`, `account`, `password`, `registerTime`, `lastLoginTime`) VALUES (2571, 'aaaa123456', '123456', '2025-02-18 03:11:27', '2025-02-18 03:11:27');
INSERT INTO `account` (`id`, `account`, `password`, `registerTime`, `lastLoginTime`) VALUES (2572, '1', '1', '2025-10-10 22:05:54', '2025-10-10 22:05:54');
INSERT INTO `account` (`id`, `account`, `password`, `registerTime`, `lastLoginTime`) VALUES (2573, 'quang123', 'quang123', '2025-10-10 22:24:54', '2025-10-10 22:24:54');
INSERT INTO `account` (`id`, `account`, `password`, `registerTime`, `lastLoginTime`) VALUES (2574, 'quang1234', 'quang1234', '2025-10-10 23:10:34', '2025-10-10 23:10:34');
INSERT INTO `account` (`id`, `account`, `password`, `registerTime`, `lastLoginTime`) VALUES (2575, '2', '2', '2025-10-15 18:22:14', '2025-10-15 18:22:14');
INSERT INTO `account` (`id`, `account`, `password`, `registerTime`, `lastLoginTime`) VALUES (2576, '3', '3', '2025-10-20 22:08:14', '2025-10-20 22:08:14');
INSERT INTO `account` (`id`, `account`, `password`, `registerTime`, `lastLoginTime`) VALUES (2577, '5', '5', '2025-10-20 22:44:44', '2025-10-20 22:44:44');
INSERT INTO `account` (`id`, `account`, `password`, `registerTime`, `lastLoginTime`) VALUES (2578, '6', '6', '2025-10-21 17:58:56', '2025-10-21 17:58:56');
INSERT INTO `account` (`id`, `account`, `password`, `registerTime`, `lastLoginTime`) VALUES (2579, '7', '7', '2025-10-23 23:48:04', '2025-10-23 23:48:04');
INSERT INTO `account` (`id`, `account`, `password`, `registerTime`, `lastLoginTime`) VALUES (2580, '10', '10', '2025-10-26 00:50:18', '2025-10-26 00:50:18');
INSERT INTO `account` (`id`, `account`, `password`, `registerTime`, `lastLoginTime`) VALUES (2581, '11', '11', '2025-10-26 00:50:41', '2025-10-26 00:50:41');
INSERT INTO `account` (`id`, `account`, `password`, `registerTime`, `lastLoginTime`) VALUES (2582, '12', '12', '2025-10-26 00:51:03', '2025-10-26 00:51:03');
INSERT INTO `account` (`id`, `account`, `password`, `registerTime`, `lastLoginTime`) VALUES (2583, '13', '13', '2025-10-26 00:58:05', '2025-10-26 00:58:05');
INSERT INTO `account` (`id`, `account`, `password`, `registerTime`, `lastLoginTime`) VALUES (2584, '14', '14', '2025-10-26 01:13:49', '2025-10-26 01:13:49');
INSERT INTO `account` (`id`, `account`, `password`, `registerTime`, `lastLoginTime`) VALUES (2585, '15', '15', '2025-10-26 01:15:58', '2025-10-26 01:15:58');
INSERT INTO `account` (`id`, `account`, `password`, `registerTime`, `lastLoginTime`) VALUES (2586, '17', '17', '2025-10-28 00:04:18', '2025-10-28 00:04:18');
COMMIT;

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
-- Records of loginerror
-- ----------------------------
BEGIN;
COMMIT;

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
) ENGINE=InnoDB AUTO_INCREMENT=647 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='充值表';

-- ----------------------------
-- Records of order
-- ----------------------------
BEGIN;
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (552, '20251014083621977d516', '20251014083621977d516', 0, 21, 'XinShouGift', 999048, '1', 61, 12, 4, '', '2025-10-14 16:36:22', '2025-10-14 16:36:22', '2025-10-17 00:12:45');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (553, '202510140836229638db1', '202510140836229638db1', 0, 21, 'XinShouGift', 999048, '1', 61, 12, 4, '', '2025-10-14 16:36:23', '2025-10-14 16:36:23', '2025-10-17 00:12:45');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (554, '20251014124055998e251', '20251014124055998e251', 0, 21, 'XinShouGift', 999048, '1', 61, 12, 4, '', '2025-10-14 20:40:56', '2025-10-14 20:40:56', '2025-10-17 00:12:45');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (555, '2025101413554178873c6', '2025101413554178873c6', 0, 21, 'XinShouGift', 999048, '1', 61, 12, 4, '', '2025-10-14 21:55:42', '2025-10-14 21:55:42', '2025-10-17 00:12:45');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (556, '2025101413562755a45f', '2025101413562755a45f', 0, 1, 'mall', 999001, '1', 61, 1, 4, '', '2025-10-14 21:56:27', '2025-10-14 21:56:27', '2025-10-17 00:12:45');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (557, '20251014135628170e132', '20251014135628170e132', 0, 1, 'mall', 999001, '1', 61, 1, 4, '', '2025-10-14 21:56:28', '2025-10-14 21:56:28', '2025-10-17 00:12:45');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (558, '202510141356283906a65', '202510141356283906a65', 0, 1, 'mall', 999001, '1', 61, 1, 4, '', '2025-10-14 21:56:28', '2025-10-14 21:56:28', '2025-10-17 00:12:45');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (559, '20251014135628574a416', '20251014135628574a416', 0, 1, 'mall', 999001, '1', 61, 1, 4, '', '2025-10-14 21:56:29', '2025-10-14 21:56:29', '2025-10-17 00:12:45');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (560, '20251014135628723f29d', '20251014135628723f29d', 0, 1, 'mall', 999001, '1', 61, 1, 4, '', '2025-10-14 21:56:29', '2025-10-14 21:56:29', '2025-10-17 00:12:45');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (561, '202510141356289275633', '202510141356289275633', 0, 1, 'mall', 999001, '1', 61, 1, 4, '', '2025-10-14 21:56:29', '2025-10-14 21:56:29', '2025-10-17 00:12:45');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (562, '202510150937058615e1e', '202510150937058615e1e', 0, 4, 'mall', 999004, '1', 61, 128, 4, '', '2025-10-15 17:37:06', '2025-10-15 17:37:06', '2025-10-17 00:12:45');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (563, '202510150946071564b83', '202510150946071564b83', 0, 5, 'mall', 999005, '1', 61, 328, 4, '', '2025-10-15 17:46:07', '2025-10-15 17:46:07', '2025-10-17 00:12:45');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (564, '202510150946286951d51', '202510150946286951d51', 0, 6, 'mall', 999006, '1', 61, 648, 4, '', '2025-10-15 17:46:29', '2025-10-15 17:46:29', '2025-10-17 00:12:45');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (565, '2025101509581176714c', '2025101509581176714c', 0, 21, 'XinShouGift', 999048, '1', 61, 12, 4, '', '2025-10-15 17:58:11', '2025-10-15 17:58:11', '2025-10-17 00:12:45');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (566, '2025101509581289767fa', '2025101509581289767fa', 0, 21, 'XinShouGift', 999048, '1', 61, 12, 4, '', '2025-10-15 17:58:13', '2025-10-15 17:58:13', '2025-10-17 00:12:45');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (567, '202510151017422577c0', '202510151017422577c0', 0, 6, 'mall', 999006, 'quang1234', 54, 648, 4, '', '2025-10-15 18:17:42', '2025-10-15 18:17:42', '2025-10-17 19:41:22');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (568, '20251015101806343326f', '20251015101806343326f', 0, 4, 'mall', 999004, 'quang1234', 54, 128, 4, '', '2025-10-15 18:18:06', '2025-10-15 18:18:06', '2025-10-17 19:41:22');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (569, '2025101510304972b9c3', '2025101510304972b9c3', 0, 6, 'mall', 999006, '2', 62, 648, 4, '', '2025-10-15 18:30:49', '2025-10-15 18:30:49', '2025-10-17 19:41:22');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (570, '2025101510363375986fb', '2025101510363375986fb', 0, 6, 'mall', 999006, '2', 62, 648, 4, '', '2025-10-15 18:36:34', '2025-10-15 18:36:34', '2025-10-17 19:41:22');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (571, '20251017185735286791b', '20251017185735286791b', 0, 6, 'mall', 999006, '2', 62, 648, 4, '', '2025-10-17 19:57:35', '2025-10-17 19:57:35', '2025-10-17 19:57:35');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (572, '202510171857359086bf1', '202510171857359086bf1', 0, 6, 'mall', 999006, '2', 62, 648, 4, '', '2025-10-17 19:57:36', '2025-10-17 19:57:36', '2025-10-17 19:57:36');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (573, '202510171857376222eb6', '202510171857376222eb6', 0, 6, 'mall', 999006, '2', 62, 648, 4, '', '2025-10-17 19:57:38', '2025-10-17 19:57:38', '2025-10-17 19:57:38');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (574, '20251017190354675aab5', '20251017190354675aab5', 0, 6, 'mall', 999006, '2', 62, 648, 4, '', '2025-10-17 20:03:55', '1970-01-01 08:00:00', '2025-10-17 20:06:14');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (584, '20251017191028692464b', '20251017191028692464b', 0, 5, 'mall', 999005, '2', 62, 328, 4, '', '2025-10-17 20:10:29', '2025-10-17 20:10:29', '2025-10-17 20:10:29');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (585, '20251017191032229d946', '20251017191032229d946', 0, 6, 'mall', 999006, '2', 62, 648, 4, '', '2025-10-17 20:10:32', '2025-10-17 20:10:32', '2025-10-17 20:10:32');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (586, '2025101719103517252bc', '2025101719103517252bc', 0, 1, 'mall', 999001, '2', 62, 1, 4, '', '2025-10-17 20:10:35', '2025-10-17 20:10:35', '2025-10-17 20:10:35');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (587, '20251017191038498a965', '20251017191038498a965', 0, 1, 'mall', 999001, '2', 62, 1, 4, '', '2025-10-17 20:10:38', '2025-10-17 20:10:39', '2025-10-17 20:10:39');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (588, '2025101719104164799a', '2025101719104164799a', 0, 1, 'mall', 999001, '2', 62, 1, 4, '', '2025-10-17 20:10:41', '2025-10-17 20:10:41', '2025-10-17 20:10:41');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (589, '20251017192719278b6b', '20251017192719278b6b', 0, 2, 'mall', 999002, '2', 62, 30, 4, '', '2025-10-17 20:27:19', '2025-10-17 20:27:19', '2025-10-17 20:27:19');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (590, '202510171929542666277', '202510171929542666277', 0, 28, 'monthCard', 999098, '2', 62, 45, 4, '', '2025-10-17 20:29:54', '2025-10-17 20:29:54', '2025-10-17 20:29:55');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (591, '20251017192958981873a', '20251017192958981873a', 0, 28, 'monthCard', 999098, '2', 62, 45, 4, '', '2025-10-17 20:29:59', '2025-10-17 20:29:59', '2025-10-17 20:29:59');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (592, '20251017193000547430b', '20251017193000547430b', 0, 28, 'monthCard', 999098, '2', 62, 45, 4, '', '2025-10-17 20:30:01', '2025-10-17 20:30:01', '2025-10-17 20:30:01');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (593, '202510171930047414a86', '202510171930047414a86', 0, 3, 'monthCard', 999099, '2', 62, 68, 4, '', '2025-10-17 20:30:05', '2025-10-17 20:30:05', '2025-10-17 20:30:05');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (594, '20251017193007502c1e9', '20251017193007502c1e9', 0, 3, 'monthCard', 999099, '2', 62, 68, 4, '', '2025-10-17 20:30:08', '2025-10-17 20:30:08', '2025-10-17 20:30:08');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (595, '202510171930092943301', '202510171930092943301', 0, 3, 'monthCard', 999099, '2', 62, 68, 4, '', '2025-10-17 20:30:09', '2025-10-17 20:30:09', '2025-10-17 20:30:09');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (596, '2025101809155480636c9', '2025101809155480636c9', 0, 21, 'XinShouGift', 999048, '2', 62, 12, 4, '', '2025-10-18 10:15:55', '2025-10-18 10:15:55', '2025-10-18 10:15:55');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (597, '202510180916048442e67', '202510180916048442e67', 0, 25, 'XinShouGift', 999049, '2', 62, 18, 4, '', '2025-10-18 10:16:05', '2025-10-18 10:16:05', '2025-10-18 10:16:05');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (598, '202510182256384338073', '202510182256384338073', 0, 5, 'mall', 999005, '2', 62, 328, 4, '', '2025-10-18 23:56:38', '2025-10-18 23:56:38', '2025-10-18 23:56:39');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (599, '20251019175857551a315', '20251019175857551a315', 0, 25, 'XinShouGift', 999050, '2', 62, 18, 4, '', '2025-10-19 18:58:58', '2025-10-19 18:58:58', '2025-10-19 18:58:58');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (600, '20251019200332751bdc8', '20251019200332751bdc8', 0, 3, 'monthCard', 999099, '2', 62, 68, 4, '', '2025-10-19 21:03:33', '2025-10-19 21:03:33', '2025-10-19 21:03:33');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (601, '2025101920033352229a3', '2025101920033352229a3', 0, 3, 'monthCard', 999099, '2', 62, 68, 4, '', '2025-10-19 21:03:34', '2025-10-19 21:03:34', '2025-10-19 21:03:34');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (602, '202510192003351788c7a', '202510192003351788c7a', 0, 28, 'monthCard', 999098, '2', 62, 45, 4, '', '2025-10-19 21:03:35', '2025-10-19 21:03:35', '2025-10-19 21:03:35');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (603, '20251019200335780ff22', '20251019200335780ff22', 0, 28, 'monthCard', 999098, '2', 62, 45, 4, '', '2025-10-19 21:03:36', '2025-10-19 21:03:36', '2025-10-19 21:03:36');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (604, '202510192003365475a04', '202510192003365475a04', 0, 28, 'monthCard', 999098, '2', 62, 45, 4, '', '2025-10-19 21:03:37', '2025-10-19 21:03:37', '2025-10-19 21:03:37');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (605, '20251019200337168b363', '20251019200337168b363', 0, 28, 'monthCard', 999098, '2', 62, 45, 4, '', '2025-10-19 21:03:37', '2025-10-19 21:03:37', '2025-10-19 21:03:37');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (606, '2025101920033817997c9', '2025101920033817997c9', 0, 28, 'monthCard', 999098, '2', 62, 45, 4, '', '2025-10-19 21:03:38', '2025-10-19 21:03:38', '2025-10-19 21:03:38');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (607, '20251019200338835a698', '20251019200338835a698', 0, 28, 'monthCard', 999098, '2', 62, 45, 4, '', '2025-10-19 21:03:39', '2025-10-19 21:03:39', '2025-10-19 21:03:39');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (608, '2025102117015793727ef', '2025102117015793727ef', 0, 1, 'gift', 999033, '2', 62, 1, 4, '', '2025-10-21 18:01:58', '2025-10-21 18:01:58', '2025-10-21 18:01:59');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (609, '20251021170158567af0c', '20251021170158567af0c', 0, 1, 'gift', 999033, '2', 62, 1, 4, '', '2025-10-21 18:01:59', '2025-10-21 18:01:59', '2025-10-21 18:01:59');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (610, '20251021170201876696c', '20251021170201876696c', 0, 1, 'gift', 999033, '2', 62, 1, 4, '', '2025-10-21 18:02:02', '2025-10-21 18:02:02', '2025-10-21 18:02:02');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (611, '202510211702033659577', '202510211702033659577', 0, 2, 'gift', 999035, '2', 62, 30, 4, '', '2025-10-21 18:02:03', '2025-10-21 18:02:03', '2025-10-21 18:02:04');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (612, '20251023224920251efbc', '20251023224920251efbc', 0, 2, 'mall', 999002, '2', 62, 30, 4, '', '2025-10-23 23:49:20', '1970-01-01 08:00:00', '2025-10-23 23:56:07');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (613, '20251023224925551a8a4', '20251023224925551a8a4', 0, 2, 'mall', 999002, '2', 62, 30, 4, '', '2025-10-23 23:49:26', '1970-01-01 08:00:00', '2025-10-23 23:55:30');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (614, '20251023225948852d276', '20251023225948852d276', 0, 5, 'mall', 999005, '2', 62, 328, 0, '', '2025-10-23 23:59:49', '1970-01-01 08:00:00', '1970-01-01 08:00:00');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (615, '20251023225949718c04d', '20251023225949718c04d', 0, 5, 'mall', 999005, '2', 62, 328, 0, '', '2025-10-23 23:59:50', '1970-01-01 08:00:00', '1970-01-01 08:00:00');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (616, '2025102322595073303cc', '2025102322595073303cc', 0, 5, 'mall', 999005, '2', 62, 328, 0, '', '2025-10-23 23:59:51', '1970-01-01 08:00:00', '1970-01-01 08:00:00');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (617, '20251026001752273ef61', '20251026001752273ef61', 0, 2, 'mall', 999002, '2', 62, 30, 0, '', '2025-10-26 01:17:52', '1970-01-01 08:00:00', '1970-01-01 08:00:00');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (618, '202510260018053947665', '202510260018053947665', 0, 4, 'mall', 999004, '2', 62, 128, 0, '', '2025-10-26 01:18:05', '1970-01-01 08:00:00', '1970-01-01 08:00:00');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (619, '2025102600181493885f6', '2025102600181493885f6', 0, 2, 'mall', 999002, '2', 62, 30, 0, '', '2025-10-26 01:18:15', '1970-01-01 08:00:00', '1970-01-01 08:00:00');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (620, '202510272244361062b21', '202510272244361062b21', 0, 5, 'mall', 999005, '2', 62, 328, 0, '', '2025-10-27 23:44:36', '1970-01-01 08:00:00', '1970-01-01 08:00:00');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (621, '20251027224938401fa6c', '20251027224938401fa6c', 0, 29, 'XinShouGift', 999057, '2', 62, 88, 4, '', '2025-10-27 23:49:38', '1970-01-01 08:00:00', '2025-10-27 23:50:54');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (622, '20251027224943645f427', '20251027224943645f427', 0, 29, 'XinShouGift', 999057, '2', 62, 88, 4, '', '2025-10-27 23:49:44', '1970-01-01 08:00:00', '2025-10-27 23:50:58');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (623, '202510272251158175f7d', '202510272251158175f7d', 0, 29, 'XinShouGift', 999058, '2', 62, 88, 4, '', '2025-10-27 23:51:16', '1970-01-01 08:00:00', '2025-10-27 23:52:22');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (624, '20251027225133146ae2', '20251027225133146ae2', 0, 29, 'XinShouGift', 999058, '2', 62, 88, 4, '', '2025-10-27 23:51:33', '1970-01-01 08:00:00', '2025-10-27 23:51:51');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (625, '20251027225644559856a', '20251027225644559856a', 0, 6, 'mall', 999006, '5', 65, 648, 0, '', '2025-10-27 23:56:45', '1970-01-01 08:00:00', '1970-01-01 08:00:00');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (626, '202510272305045756707', '202510272305045756707', 0, 5, 'mall', 999005, '5', 65, 328, 0, '', '2025-10-28 00:05:05', '1970-01-01 08:00:00', '1970-01-01 08:00:00');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (627, '20251027230716337b061', '20251027230716337b061', 0, 5, 'mall', 999005, '2', 62, 328, 0, '', '2025-10-28 00:07:16', '1970-01-01 08:00:00', '1970-01-01 08:00:00');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (628, '202510272307301191b92', '202510272307301191b92', 0, 5, 'mall', 999005, '2', 62, 328, 0, '', '2025-10-28 00:07:30', '1970-01-01 08:00:00', '1970-01-01 08:00:00');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (629, '2025102723224019289cd', '2025102723224019289cd', 0, 1, 'mall', 999001, '2', 62, 1, 0, '', '2025-10-28 00:22:40', '1970-01-01 08:00:00', '1970-01-01 08:00:00');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (630, '202510272322448421278', '202510272322448421278', 0, 1, 'mall', 999001, '2', 62, 1, 0, '', '2025-10-28 00:22:45', '1970-01-01 08:00:00', '1970-01-01 08:00:00');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (631, '20251027232251324eaf2', '20251027232251324eaf2', 0, 6, 'mall', 999006, '2', 62, 648, 0, '', '2025-10-28 00:22:51', '1970-01-01 08:00:00', '1970-01-01 08:00:00');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (632, '202510272323259109387', '202510272323259109387', 0, 6, 'mall', 999006, '2', 62, 648, 0, '', '2025-10-28 00:23:26', '1970-01-01 08:00:00', '1970-01-01 08:00:00');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (633, '20251027232500401c8be', '20251027232500401c8be', 0, 2, 'XinShouGift', 999051, '2', 62, 30, 0, '', '2025-10-28 00:25:00', '1970-01-01 08:00:00', '1970-01-01 08:00:00');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (634, '20251027232507951f634', '20251027232507951f634', 0, 5, 'mall', 999005, '2', 62, 328, 0, '', '2025-10-28 00:25:08', '1970-01-01 08:00:00', '1970-01-01 08:00:00');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (635, '202510272325172009b47', '202510272325172009b47', 0, 6, 'mall', 999006, '2', 62, 648, 0, '', '2025-10-28 00:25:17', '1970-01-01 08:00:00', '1970-01-01 08:00:00');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (636, '202510272328028664413', '202510272328028664413', 0, 2, 'XinShouGift', 999051, '2', 62, 30, 4, '', '2025-10-28 00:28:03', '1970-01-01 08:00:00', '2025-10-28 00:33:49');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (637, '20251027232810812962c', '20251027232810812962c', 0, 4, 'mall', 999004, '2', 62, 128, 4, '', '2025-10-28 00:28:11', '1970-01-01 08:00:00', '2025-10-28 00:33:27');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (638, '20251027233422947aa63', '20251027233422947aa63', 0, 4, 'mall', 999004, '2', 62, 128, 4, '', '2025-10-28 00:34:23', '1970-01-01 08:00:00', '2025-10-28 00:34:41');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (639, '202510272334544866221', '202510272334544866221', 0, 1, 'mall', 999001, '2', 62, 1, 4, '', '2025-10-28 00:34:54', '1970-01-01 08:00:00', '2025-10-28 00:35:24');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (640, '202510272335103606de5', '202510272335103606de5', 0, 1, 'mall', 999001, '2', 62, 1, 4, '', '2025-10-28 00:35:10', '1970-01-01 08:00:00', '2025-10-28 00:36:35');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (641, '20251027233643928b435', '20251027233643928b435', 0, 6, 'mall', 999006, '2', 62, 648, 4, '', '2025-10-28 00:36:44', '1970-01-01 08:00:00', '2025-10-28 00:36:53');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (642, '20251027233707499d54', '20251027233707499d54', 0, 2, 'mall', 999002, '2', 62, 30, 4, '', '2025-10-28 00:37:07', '1970-01-01 08:00:00', '2025-10-28 00:37:30');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (643, '202510272337503692e70', '202510272337503692e70', 0, 5, 'mall', 999005, '2', 62, 328, 4, '', '2025-10-28 00:37:50', '1970-01-01 08:00:00', '2025-10-28 00:39:30');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (644, '20251027233949887b8f2', '20251027233949887b8f2', 0, 3, 'mall', 999003, '2', 62, 68, 4, '', '2025-10-28 00:39:50', '1970-01-01 08:00:00', '2025-10-28 00:40:01');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (645, '20251103154826243f2b7', '20251103154826243f2b7', 0, 3, 'mall', 999003, '2', 62, 68, 0, '', '2025-11-03 16:48:26', '1970-01-01 08:00:00', '1970-01-01 08:00:00');
INSERT INTO `order` (`id`, `orderCode`, `platformOrderCode`, `channelId`, `payChannelId`, `fromType`, `fromId`, `platformCode`, `roleId`, `amount`, `status`, `ip`, `createTime`, `payTime`, `lastTime`) VALUES (646, '20251103154909174371f', '20251103154909174371f', 0, 5, 'mall', 999005, '2', 62, 328, 0, '', '2025-11-03 16:49:09', '1970-01-01 08:00:00', '1970-01-01 08:00:00');
COMMIT;

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
-- Records of player0
-- ----------------------------
BEGIN;
INSERT INTO `player0` (`platform`, `code`, `roleId`, `serverId`, `internal`, `registerTime`, `lastLoginTime`, `lastOfflineTime`, `power`, `popularity`, `virtue`, `friendNum`, `roleName`, `roleImg`, `headFrame`, `takeOverRoleId`) VALUES (0, '1aaaa', 30, -1, 0, '2025-02-17 17:30:13', '2025-02-17 17:39:57', '2025-02-17 17:30:13', 0, 0, 0, 0, '修真者:30', 100401, 100402, 0);
COMMIT;

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
-- Records of player1
-- ----------------------------
BEGIN;
INSERT INTO `player1` (`platform`, `code`, `roleId`, `serverId`, `internal`, `registerTime`, `lastLoginTime`, `lastOfflineTime`, `power`, `popularity`, `virtue`, `friendNum`, `roleName`, `roleImg`, `headFrame`, `takeOverRoleId`) VALUES (0, '1', 61, -1, 0, '2025-10-14 16:17:35', '2025-10-19 19:29:33', '2025-10-19 19:29:33', 195, 0, 0, 0, '修真者:61', 100401, 100402, 0);
INSERT INTO `player1` (`platform`, `code`, `roleId`, `serverId`, `internal`, `registerTime`, `lastLoginTime`, `lastOfflineTime`, `power`, `popularity`, `virtue`, `friendNum`, `roleName`, `roleImg`, `headFrame`, `takeOverRoleId`) VALUES (0, '111111', 1, -1, 0, '2025-02-17 17:01:55', '2025-10-10 22:19:49', '2025-02-17 17:01:55', 0, 0, 0, 0, '修真者:1', 100401, 100402, 0);
INSERT INTO `player1` (`platform`, `code`, `roleId`, `serverId`, `internal`, `registerTime`, `lastLoginTime`, `lastOfflineTime`, `power`, `popularity`, `virtue`, `friendNum`, `roleName`, `roleImg`, `headFrame`, `takeOverRoleId`) VALUES (0, '1111111', 31, -1, 0, '2025-02-17 18:04:08', '2025-02-17 18:04:08', '2025-02-17 18:04:08', 0, 0, 0, 0, '修真者:31', 100401, 100402, 0);
COMMIT;

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
-- Records of player10
-- ----------------------------
BEGIN;
COMMIT;

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
-- Records of player11
-- ----------------------------
BEGIN;
COMMIT;

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
-- Records of player12
-- ----------------------------
BEGIN;
COMMIT;

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
-- Records of player13
-- ----------------------------
BEGIN;
COMMIT;

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
-- Records of player14
-- ----------------------------
BEGIN;
COMMIT;

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
-- Records of player15
-- ----------------------------
BEGIN;
COMMIT;

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
-- Records of player16
-- ----------------------------
BEGIN;
COMMIT;

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
-- Records of player17
-- ----------------------------
BEGIN;
COMMIT;

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
-- Records of player18
-- ----------------------------
BEGIN;
COMMIT;

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
-- Records of player19
-- ----------------------------
BEGIN;
COMMIT;

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
-- Records of player2
-- ----------------------------
BEGIN;
INSERT INTO `player2` (`platform`, `code`, `roleId`, `serverId`, `internal`, `registerTime`, `lastLoginTime`, `lastOfflineTime`, `power`, `popularity`, `virtue`, `friendNum`, `roleName`, `roleImg`, `headFrame`, `takeOverRoleId`) VALUES (0, '1111112', 2, -1, 0, '2025-02-17 17:16:49', '2025-02-17 18:03:33', '2025-02-17 17:16:49', 0, 0, 0, 0, '修真者:2', 100401, 100402, 0);
INSERT INTO `player2` (`platform`, `code`, `roleId`, `serverId`, `internal`, `registerTime`, `lastLoginTime`, `lastOfflineTime`, `power`, `popularity`, `virtue`, `friendNum`, `roleName`, `roleImg`, `headFrame`, `takeOverRoleId`) VALUES (0, '2', 62, 5, 0, '2025-10-15 18:22:18', '2025-11-04 16:19:05', '2025-10-27 23:52:29', 1318, 0, 0, 2, '修真者:62', 100401, 100402, 0);
INSERT INTO `player2` (`platform`, `code`, `roleId`, `serverId`, `internal`, `registerTime`, `lastLoginTime`, `lastOfflineTime`, `power`, `popularity`, `virtue`, `friendNum`, `roleName`, `roleImg`, `headFrame`, `takeOverRoleId`) VALUES (0, '222222', 42, -1, 0, '2025-02-18 01:20:13', '2025-02-18 01:32:00', '2025-02-18 01:20:13', 0, 0, 0, 0, '修真者:42', 100401, 100402, 0);
COMMIT;

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
-- Records of player20
-- ----------------------------
BEGIN;
COMMIT;

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
-- Records of player3
-- ----------------------------
BEGIN;
INSERT INTO `player3` (`platform`, `code`, `roleId`, `serverId`, `internal`, `registerTime`, `lastLoginTime`, `lastOfflineTime`, `power`, `popularity`, `virtue`, `friendNum`, `roleName`, `roleImg`, `headFrame`, `takeOverRoleId`) VALUES (0, '1111113', 13, -1, 0, '2025-02-17 17:26:59', '2025-02-17 17:54:13', '2025-02-17 17:26:59', 0, 0, 0, 0, '修真者:13', 100401, 100402, 0);
INSERT INTO `player3` (`platform`, `code`, `roleId`, `serverId`, `internal`, `registerTime`, `lastLoginTime`, `lastOfflineTime`, `power`, `popularity`, `virtue`, `friendNum`, `roleName`, `roleImg`, `headFrame`, `takeOverRoleId`) VALUES (0, '11111133', 23, -1, 0, '2025-02-17 17:27:23', '2025-02-17 17:32:22', '2025-02-17 17:27:23', 0, 0, 0, 0, '修真者:23', 100401, 100402, 0);
INSERT INTO `player3` (`platform`, `code`, `roleId`, `serverId`, `internal`, `registerTime`, `lastLoginTime`, `lastOfflineTime`, `power`, `popularity`, `virtue`, `friendNum`, `roleName`, `roleImg`, `headFrame`, `takeOverRoleId`) VALUES (0, '111113', 3, -1, 0, '2025-02-17 17:25:50', '2025-02-17 17:25:50', '2025-02-17 17:25:50', 0, 0, 0, 0, '修真者:3', 100401, 100402, 0);
INSERT INTO `player3` (`platform`, `code`, `roleId`, `serverId`, `internal`, `registerTime`, `lastLoginTime`, `lastOfflineTime`, `power`, `popularity`, `virtue`, `friendNum`, `roleName`, `roleImg`, `headFrame`, `takeOverRoleId`) VALUES (0, '3', 63, -1, 0, '2025-10-20 22:08:22', '2025-10-21 17:56:36', '2025-10-21 17:56:36', 82, 0, 0, 2, '修真者:63', 100401, 100402, 0);
INSERT INTO `player3` (`platform`, `code`, `roleId`, `serverId`, `internal`, `registerTime`, `lastLoginTime`, `lastOfflineTime`, `power`, `popularity`, `virtue`, `friendNum`, `roleName`, `roleImg`, `headFrame`, `takeOverRoleId`) VALUES (0, 'quang123', 53, -1, 0, '2025-10-10 22:25:01', '2025-10-10 22:59:28', '2025-10-10 22:25:01', 0, 0, 0, 0, '修真者:53', 100401, 100402, 0);
COMMIT;

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
-- Records of player4
-- ----------------------------
BEGIN;
INSERT INTO `player4` (`platform`, `code`, `roleId`, `serverId`, `internal`, `registerTime`, `lastLoginTime`, `lastOfflineTime`, `power`, `popularity`, `virtue`, `friendNum`, `roleName`, `roleImg`, `headFrame`, `takeOverRoleId`) VALUES (0, '14', 68, -1, 0, '2025-10-26 01:14:16', '2025-11-04 16:18:43', '2025-10-26 01:14:16', 0, 0, 0, 0, '修真者:68', 100401, 100402, 0);
INSERT INTO `player4` (`platform`, `code`, `roleId`, `serverId`, `internal`, `registerTime`, `lastLoginTime`, `lastOfflineTime`, `power`, `popularity`, `virtue`, `friendNum`, `roleName`, `roleImg`, `headFrame`, `takeOverRoleId`) VALUES (0, 'quang1234', 54, 5, 0, '2025-10-10 23:10:38', '2025-10-23 23:57:25', '2025-10-10 23:10:38', 0, 0, 0, 0, '修真者:54', 100401, 100402, 0);
COMMIT;

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
-- Records of player5
-- ----------------------------
BEGIN;
INSERT INTO `player5` (`platform`, `code`, `roleId`, `serverId`, `internal`, `registerTime`, `lastLoginTime`, `lastOfflineTime`, `power`, `popularity`, `virtue`, `friendNum`, `roleName`, `roleImg`, `headFrame`, `takeOverRoleId`) VALUES (0, '15', 69, -1, 0, '2025-10-26 01:16:03', '2025-10-26 01:16:03', '2025-10-26 01:16:03', 0, 0, 0, 0, '修真者:69', 100401, 100402, 0);
INSERT INTO `player5` (`platform`, `code`, `roleId`, `serverId`, `internal`, `registerTime`, `lastLoginTime`, `lastOfflineTime`, `power`, `popularity`, `virtue`, `friendNum`, `roleName`, `roleImg`, `headFrame`, `takeOverRoleId`) VALUES (0, '5', 65, -1, 0, '2025-10-20 22:44:47', '2025-10-28 00:04:55', '2025-10-27 23:56:17', 82, 0, 0, 2, '修真者:65', 100401, 100402, 0);
COMMIT;

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
-- Records of player6
-- ----------------------------
BEGIN;
INSERT INTO `player6` (`platform`, `code`, `roleId`, `serverId`, `internal`, `registerTime`, `lastLoginTime`, `lastOfflineTime`, `power`, `popularity`, `virtue`, `friendNum`, `roleName`, `roleImg`, `headFrame`, `takeOverRoleId`) VALUES (0, '123456', 36, -1, 0, '2025-02-18 00:47:21', '2025-02-18 00:47:21', '2025-02-18 00:47:21', 0, 0, 0, 0, '修真者:36', 100401, 100402, 0);
INSERT INTO `player6` (`platform`, `code`, `roleId`, `serverId`, `internal`, `registerTime`, `lastLoginTime`, `lastOfflineTime`, `power`, `popularity`, `virtue`, `friendNum`, `roleName`, `roleImg`, `headFrame`, `takeOverRoleId`) VALUES (0, '6', 66, -1, 0, '2025-10-21 17:58:59', '2025-10-23 23:47:54', '2025-10-21 17:59:20', 82, 0, 0, 0, '修真者:66', 100401, 100402, 0);
INSERT INTO `player6` (`platform`, `code`, `roleId`, `serverId`, `internal`, `registerTime`, `lastLoginTime`, `lastOfflineTime`, `power`, `popularity`, `virtue`, `friendNum`, `roleName`, `roleImg`, `headFrame`, `takeOverRoleId`) VALUES (0, 'aaaa123456', 46, -1, 0, '2025-02-18 03:11:31', '2025-02-18 03:30:03', '2025-02-18 03:11:31', 0, 0, 0, 0, '修真者:46', 100401, 100402, 0);
COMMIT;

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
-- Records of player7
-- ----------------------------
BEGIN;
INSERT INTO `player7` (`platform`, `code`, `roleId`, `serverId`, `internal`, `registerTime`, `lastLoginTime`, `lastOfflineTime`, `power`, `popularity`, `virtue`, `friendNum`, `roleName`, `roleImg`, `headFrame`, `takeOverRoleId`) VALUES (0, '17', 70, -1, 0, '2025-10-28 00:04:28', '2025-10-28 00:04:28', '2025-10-28 00:04:28', 0, 0, 0, 0, '修真者:70', 100401, 100402, 0);
INSERT INTO `player7` (`platform`, `code`, `roleId`, `serverId`, `internal`, `registerTime`, `lastLoginTime`, `lastOfflineTime`, `power`, `popularity`, `virtue`, `friendNum`, `roleName`, `roleImg`, `headFrame`, `takeOverRoleId`) VALUES (0, '7', 67, -1, 0, '2025-10-23 23:48:09', '2025-10-23 23:48:09', '2025-10-23 23:48:09', 0, 0, 0, 0, '修真者:67', 100401, 100402, 0);
COMMIT;

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
-- Records of player8
-- ----------------------------
BEGIN;
COMMIT;

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
-- Records of player9
-- ----------------------------
BEGIN;
COMMIT;

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
-- Records of recyclerole
-- ----------------------------
BEGIN;
COMMIT;

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
