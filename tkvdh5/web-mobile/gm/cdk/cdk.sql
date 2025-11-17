/*
 Navicat Premium Data Transfer

 Source Server         : 192.168.31.74
 Source Server Type    : MySQL
 Source Server Version : 80024
 Source Host           : 192.168.31.74:3306
 Source Schema         : platform

 Target Server Type    : MySQL
 Target Server Version : 80024
 File Encoding         : 65001

 Date: 21/12/2024 14:36:19
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for cdk
-- ----------------------------
DROP TABLE IF EXISTS `cdk`;
CREATE TABLE `cdk`  (
  `cdk` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'cdk',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'cdk对应的礼包名',
  `info` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '礼包内容'
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
