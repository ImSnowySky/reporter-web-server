-- --------------------------------------------------------
-- Хост:                         127.0.0.1
-- Версия сервера:               5.6.41 - MySQL Community Server (GPL)
-- Операционная система:         Win64
-- HeidiSQL Версия:              10.1.0.5464
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Дамп структуры базы данных reporter
DROP DATABASE IF EXISTS `reporter`;
CREATE DATABASE IF NOT EXISTS `reporter` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `reporter`;

-- Дамп структуры для таблица reporter.error
DROP TABLE IF EXISTS `error`;
CREATE TABLE IF NOT EXISTS `error` (
  `id` int(11) NOT NULL,
  `message` text,
  `line_number` int(6) DEFAULT NULL,
  `url` text,
  PRIMARY KEY (`id`),
  CONSTRAINT `FK_error_event_id` FOREIGN KEY (`id`) REFERENCES `event_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
-- Дамп структуры для таблица reporter.event_id
DROP TABLE IF EXISTS `event_id`;
CREATE TABLE IF NOT EXISTS `event_id` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8 COMMENT='Polymorphic Associations with foreign key';

-- Экспортируемые данные не выделены.
-- Дамп структуры для таблица reporter.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` tinytext NOT NULL,
  `password_hash` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
-- Дамп структуры для таблица reporter.visitors
DROP TABLE IF EXISTS `visitors`;
CREATE TABLE IF NOT EXISTS `visitors` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `hash` tinytext,
  `platform` tinytext,
  `os` tinytext,
  `os_version` tinytext,
  `browser` tinytext,
  `browser_version` tinytext,
  `user_agent` tinytext,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
-- Дамп структуры для таблица reporter.visitor_event
DROP TABLE IF EXISTS `visitor_event`;
CREATE TABLE IF NOT EXISTS `visitor_event` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `visitor_id` int(11) unsigned NOT NULL,
  `event_type` tinytext,
  `event_id` int(11) NOT NULL,
  `user_fired_at` tinytext,
  `server_fired_at` tinytext,
  `display_width` int(11) DEFAULT NULL,
  `display_height` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_visitor_event_visitors` (`visitor_id`),
  KEY `FK_visitor_event_event_id` (`event_id`),
  CONSTRAINT `FK_visitor_event_event_id` FOREIGN KEY (`event_id`) REFERENCES `event_id` (`id`),
  CONSTRAINT `FK_visitor_event_visitors` FOREIGN KEY (`visitor_id`) REFERENCES `visitors` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
