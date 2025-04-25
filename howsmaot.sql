-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2025-04-23 13:11:17
-- 伺服器版本： 10.4.32-MariaDB
-- PHP 版本： 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `howsmaot`
--

-- --------------------------------------------------------

--
-- 資料表結構 `address`
--

CREATE TABLE `address` (
  `Aid` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `City` varchar(20) NOT NULL,
  `District` varchar(20) NOT NULL,
  `address` varchar(50) NOT NULL,
  `AdressName` varchar(30) NOT NULL COMMENT '該地址的收件人',
  `AdressPhone` varchar(30) NOT NULL COMMENT '該地址的電話'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `article`
--

CREATE TABLE `article` (
  `ArticleID` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `banner_URL` varchar(255) NOT NULL,
  `intro` varchar(255) NOT NULL,
  `pet_type` enum('dog','cat','bird','mouse') NOT NULL,
  `product_category` enum('pet_food','complementary_food','snacks','Health_Supplements','Living_Essentials','toys') NOT NULL,
  `section` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`section`)),
  `create_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `chatmessage`
--

CREATE TABLE `chatmessage` (
  `messageID` int(11) NOT NULL,
  `ChatrommID` int(11) NOT NULL,
  `speakerID` int(11) NOT NULL,
  `message` varchar(500) NOT NULL,
  `isRead` tinyint(1) NOT NULL,
  `create_time` datetime NOT NULL DEFAULT current_timestamp(),
  `media` blob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `chatroomuser`
--

CREATE TABLE `chatroomuser` (
  `chatroomID` int(11) NOT NULL,
  `uidX` int(11) NOT NULL,
  `uidY` int(11) NOT NULL,
  `jointime` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `collection`
--

CREATE TABLE `collection` (
  `CollectId` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `pid` int(11) NOT NULL,
  `time` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `coupon`
--

CREATE TABLE `coupon` (
  `coupon_id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `discount_ratio` double NOT NULL,
  `coupon_code` varchar(30) NOT NULL,
  `create_at` datetime NOT NULL DEFAULT current_timestamp(),
  `overdate` datetime NOT NULL COMMENT '優惠到期日',
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `creditcard`
--

CREATE TABLE `creditcard` (
  `cid` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `credit_num` varchar(255) NOT NULL,
  `expiry_date` varchar(30) NOT NULL COMMENT '到期年/日'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `newactivity`
--

CREATE TABLE `newactivity` (
  `ActivityId` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `content` varchar(500) NOT NULL,
  `img_path` varchar(100) NOT NULL,
  `create_at` datetime NOT NULL DEFAULT current_timestamp(),
  `category` enum('最新快訊','政府法令') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `orderitem`
--

CREATE TABLE `orderitem` (
  `order_item_id` int(11) NOT NULL COMMENT '購物車單品編號',
  `orderid` int(11) NOT NULL,
  `pid` int(11) NOT NULL,
  `pd_name` varchar(100) NOT NULL COMMENT '商品名稱',
  `spec` varchar(100) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` int(11) NOT NULL,
  `total_price` int(11) NOT NULL,
  `img_path` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `order_type` enum('new','second') NOT NULL,
  `order_time` datetime NOT NULL DEFAULT current_timestamp(),
  `display_order_num` varchar(100) NOT NULL,
  `total_price` int(11) NOT NULL,
  `pay_way` enum('信用卡','行動支付','貨到付款') NOT NULL,
  `card_last4` int(11) NOT NULL,
  `delivery_method` enum('宅配','面交','超商取貨') NOT NULL,
  `receiver_name` varchar(30) NOT NULL,
  `receiver_phone` varchar(50) NOT NULL,
  `receiver_address` varchar(50) NOT NULL,
  `receipt` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `productslist`
--

CREATE TABLE `productslist` (
  `pid` int(11) NOT NULL COMMENT '商品編號',
  `uid` int(11) NOT NULL,
  `condition` enum('new','second') NOT NULL,
  `status` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `pet_type` enum('dog','cat','bird','mouse') NOT NULL,
  `pd_name` varchar(100) NOT NULL,
  `city` varchar(30) NOT NULL,
  `district` varchar(30) NOT NULL,
  `new_level` enum('1','2','3','4','5') NOT NULL,
  `price` int(11) NOT NULL,
  `description` varchar(300) NOT NULL,
  `stock` int(11) NOT NULL,
  `categories` enum('pet_food','complementary_food','snacks','Health_Supplements','Living_Essentials','toys') NOT NULL,
  `sale_count` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `product_attribute`
--

CREATE TABLE `product_attribute` (
  `pd_attr_id` int(11) NOT NULL,
  `pid` int(11) NOT NULL,
  `attr` varchar(100) NOT NULL,
  `attr_value` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `product_image`
--

CREATE TABLE `product_image` (
  `pd_img_id` int(11) NOT NULL,
  `pid` int(11) NOT NULL,
  `img_type` enum('point_area','content_area') NOT NULL,
  `img_path` varchar(255) NOT NULL,
  `img_value` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `question`
--

CREATE TABLE `question` (
  `questionID` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `content` varchar(500) NOT NULL,
  `lastupdatetime` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `review`
--

CREATE TABLE `review` (
  `review_id` int(11) NOT NULL,
  `pid` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `rating` enum('1','2','3','4','5') NOT NULL,
  `comment` varchar(255) NOT NULL,
  `create_time` datetime NOT NULL DEFAULT current_timestamp(),
  `spdname` varchar(100) NOT NULL COMMENT '二手商品名'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `shoppingcart`
--

CREATE TABLE `shoppingcart` (
  `cart_id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `couponId` int(11) NOT NULL,
  `pid` int(11) NOT NULL,
  `spec` varchar(20) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `userinfo`
--

CREATE TABLE `userinfo` (
  `uid` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `photo` blob DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `firstname` varchar(30) NOT NULL,
  `lastname` varchar(30) NOT NULL,
  `fullname` varchar(60) NOT NULL,
  `birthday` date NOT NULL,
  `power` enum('developer','seller','buyer') NOT NULL COMMENT '帳號權限',
  `last_time_login` datetime NOT NULL COMMENT '上次登入',
  `AboutMe` varchar(100) NOT NULL COMMENT '關於我',
  `Device` int(11) NOT NULL COMMENT '載具'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `address`
--
ALTER TABLE `address`
  ADD PRIMARY KEY (`Aid`);

--
-- 資料表索引 `article`
--
ALTER TABLE `article`
  ADD PRIMARY KEY (`ArticleID`);

--
-- 資料表索引 `chatmessage`
--
ALTER TABLE `chatmessage`
  ADD PRIMARY KEY (`messageID`);

--
-- 資料表索引 `chatroomuser`
--
ALTER TABLE `chatroomuser`
  ADD PRIMARY KEY (`chatroomID`);

--
-- 資料表索引 `collection`
--
ALTER TABLE `collection`
  ADD PRIMARY KEY (`CollectId`);

--
-- 資料表索引 `coupon`
--
ALTER TABLE `coupon`
  ADD PRIMARY KEY (`coupon_id`);

--
-- 資料表索引 `creditcard`
--
ALTER TABLE `creditcard`
  ADD PRIMARY KEY (`cid`);

--
-- 資料表索引 `newactivity`
--
ALTER TABLE `newactivity`
  ADD PRIMARY KEY (`ActivityId`);

--
-- 資料表索引 `orderitem`
--
ALTER TABLE `orderitem`
  ADD PRIMARY KEY (`order_item_id`);

--
-- 資料表索引 `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`);

--
-- 資料表索引 `productslist`
--
ALTER TABLE `productslist`
  ADD PRIMARY KEY (`pid`);

--
-- 資料表索引 `product_attribute`
--
ALTER TABLE `product_attribute`
  ADD PRIMARY KEY (`pd_attr_id`);

--
-- 資料表索引 `product_image`
--
ALTER TABLE `product_image`
  ADD PRIMARY KEY (`pd_img_id`);

--
-- 資料表索引 `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`questionID`);

--
-- 資料表索引 `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`review_id`);

--
-- 資料表索引 `userinfo`
--
ALTER TABLE `userinfo`
  ADD PRIMARY KEY (`uid`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `address`
--
ALTER TABLE `address`
  MODIFY `Aid` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `article`
--
ALTER TABLE `article`
  MODIFY `ArticleID` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `chatmessage`
--
ALTER TABLE `chatmessage`
  MODIFY `messageID` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `chatroomuser`
--
ALTER TABLE `chatroomuser`
  MODIFY `chatroomID` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `collection`
--
ALTER TABLE `collection`
  MODIFY `CollectId` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `coupon`
--
ALTER TABLE `coupon`
  MODIFY `coupon_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `creditcard`
--
ALTER TABLE `creditcard`
  MODIFY `cid` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `newactivity`
--
ALTER TABLE `newactivity`
  MODIFY `ActivityId` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `orderitem`
--
ALTER TABLE `orderitem`
  MODIFY `order_item_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '購物車單品編號';

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `productslist`
--
ALTER TABLE `productslist`
  MODIFY `pid` int(11) NOT NULL AUTO_INCREMENT COMMENT '商品編號';

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `product_attribute`
--
ALTER TABLE `product_attribute`
  MODIFY `pd_attr_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `product_image`
--
ALTER TABLE `product_image`
  MODIFY `pd_img_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `question`
--
ALTER TABLE `question`
  MODIFY `questionID` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `review`
--
ALTER TABLE `review`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `userinfo`
--
ALTER TABLE `userinfo`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
