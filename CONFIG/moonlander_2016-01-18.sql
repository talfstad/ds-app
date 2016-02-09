# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: 52.88.173.62 (MySQL 5.5.44-0ubuntu0.14.04.1)
# Database: moonlander
# Generation Time: 2016-01-19 03:16:42 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table active_snippets
# ------------------------------------------------------------

DROP TABLE IF EXISTS `active_snippets`;

CREATE TABLE `active_snippets` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `last_updated` datetime DEFAULT NULL,
  `snippet_id` int(11) unsigned DEFAULT NULL,
  `user_id` int(11) unsigned DEFAULT NULL,
  `url_endpoint_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKactive_snippets_snippet_id_snippets_id` (`snippet_id`),
  CONSTRAINT `FKactive_snippets_snippet_id_snippets_id` FOREIGN KEY (`snippet_id`) REFERENCES `snippets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `active_snippets` WRITE;
/*!40000 ALTER TABLE `active_snippets` DISABLE KEYS */;

INSERT INTO `active_snippets` (`id`, `last_updated`, `snippet_id`, `user_id`, `url_endpoint_id`)
VALUES
	(433,NULL,NULL,4,6),
	(450,NULL,1,4,9),
	(452,NULL,2,4,9),
	(454,NULL,1,4,7),
	(456,NULL,2,4,7);

/*!40000 ALTER TABLE `active_snippets` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table campaigns
# ------------------------------------------------------------

DROP TABLE IF EXISTS `campaigns`;

CREATE TABLE `campaigns` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `user_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_campaigns_user_id_users_id` (`user_id`),
  CONSTRAINT `FK_campaigns_user_id_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `campaigns` WRITE;
/*!40000 ALTER TABLE `campaigns` DISABLE KEYS */;

INSERT INTO `campaigns` (`id`, `name`, `user_id`)
VALUES
	(1,'default',4),
	(2,'camp1',4);

/*!40000 ALTER TABLE `campaigns` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table campaigns_with_domains
# ------------------------------------------------------------

DROP TABLE IF EXISTS `campaigns_with_domains`;

CREATE TABLE `campaigns_with_domains` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `campaign_id` int(11) unsigned DEFAULT NULL,
  `user_id` int(11) unsigned DEFAULT NULL,
  `domain_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_campaigns_with_domains_user_id` (`user_id`),
  CONSTRAINT `FK_campaigns_with_domains_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `campaigns_with_domains` WRITE;
/*!40000 ALTER TABLE `campaigns_with_domains` DISABLE KEYS */;

INSERT INTO `campaigns_with_domains` (`id`, `campaign_id`, `user_id`, `domain_id`)
VALUES
	(10,2,4,1),
	(11,2,4,2),
	(14,1,4,1),
	(15,2,4,3);

/*!40000 ALTER TABLE `campaigns_with_domains` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table deployed_landers
# ------------------------------------------------------------

DROP TABLE IF EXISTS `deployed_landers`;

CREATE TABLE `deployed_landers` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `domain_id` int(11) unsigned DEFAULT NULL,
  `user_id` int(11) unsigned DEFAULT NULL,
  `lander_id` bigint(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_user_id` (`user_id`),
  KEY `FK_deployed_landers_lander_id_landers_id` (`lander_id`),
  CONSTRAINT `FK_deployed_landers_lander_id_landers_id` FOREIGN KEY (`lander_id`) REFERENCES `landers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `deployed_landers` WRITE;
/*!40000 ALTER TABLE `deployed_landers` DISABLE KEYS */;

INSERT INTO `deployed_landers` (`id`, `domain_id`, `user_id`, `lander_id`)
VALUES
	(520,2,4,231),
	(523,3,4,237),
	(528,1,4,251),
	(529,3,4,251),
	(530,2,4,251),
	(532,3,4,224),
	(733,3,4,269),
	(734,3,4,255),
	(1106,2,4,232),
	(1132,2,4,272),
	(1207,3,4,232),
	(1208,3,4,231),
	(1237,2,4,211),
	(1238,3,4,211),
	(1239,1,4,211),
	(1592,1,4,240),
	(1629,2,4,210),
	(1721,2,4,219),
	(1722,2,4,219),
	(1723,3,4,226),
	(1749,2,4,294),
	(1750,2,4,294),
	(1751,1,4,294),
	(1752,1,4,235);

/*!40000 ALTER TABLE `deployed_landers` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table domains
# ------------------------------------------------------------

DROP TABLE IF EXISTS `domains`;

CREATE TABLE `domains` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `domain` varchar(255) DEFAULT NULL,
  `user_id` int(11) unsigned DEFAULT NULL,
  `nameservers` text,
  PRIMARY KEY (`id`),
  KEY `FK_domains_user` (`user_id`),
  CONSTRAINT `FK_user_id_domains` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `domains` WRITE;
/*!40000 ALTER TABLE `domains` DISABLE KEYS */;

INSERT INTO `domains` (`id`, `domain`, `user_id`, `nameservers`)
VALUES
	(1,'hardbodiesandboners.org',4,''),
	(2,'weightlosskey.com',4,''),
	(3,'notdeployed.com',4,NULL);

/*!40000 ALTER TABLE `domains` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table jobs
# ------------------------------------------------------------

DROP TABLE IF EXISTS `jobs`;

CREATE TABLE `jobs` (
  `id` bigint(11) unsigned NOT NULL AUTO_INCREMENT,
  `working_node_id` bigint(11) DEFAULT NULL,
  `action` varchar(100) CHARACTER SET ascii DEFAULT NULL,
  `processing` tinyint(1) DEFAULT NULL,
  `lander_id` bigint(11) unsigned DEFAULT NULL,
  `domain_id` bigint(11) DEFAULT NULL,
  `campaign_id` bigint(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `done` tinyint(1) DEFAULT NULL,
  `error` tinyint(1) DEFAULT NULL,
  `lander_url` varchar(200) DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_jobs_lander_id_landers_id` (`lander_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;

INSERT INTO `jobs` (`id`, `working_node_id`, `action`, `processing`, `lander_id`, `domain_id`, `campaign_id`, `user_id`, `done`, `error`, `lander_url`, `created_on`)
VALUES
	(1,1,'undeployLanderFromDomain',1,293,1,NULL,4,NULL,NULL,NULL,'2016-01-06 00:38:45'),
	(2,1,'deployLanderToDomain',1,293,1,NULL,4,NULL,NULL,NULL,'2016-01-06 00:38:45'),
	(3,1,'undeployLanderFromDomain',1,293,1,NULL,4,NULL,NULL,NULL,'2016-01-06 00:38:51'),
	(4,1,'undeployLanderFromDomain',0,294,2,NULL,4,1,NULL,NULL,'2016-01-06 22:24:39'),
	(5,1,'undeployLanderFromDomain',0,294,1,NULL,4,1,NULL,NULL,'2016-01-06 22:24:39'),
	(6,1,'deployLanderToDomain',0,294,1,NULL,4,1,NULL,NULL,'2016-01-06 22:24:40'),
	(7,1,'deployLanderToDomain',0,294,2,NULL,4,1,NULL,NULL,'2016-01-06 22:24:40'),
	(8,1,'undeployLanderFromDomain',0,291,1,NULL,4,1,NULL,NULL,'2016-01-06 22:24:50'),
	(9,1,'ripNewLander',1,301,0,NULL,4,NULL,NULL,NULL,'2016-01-09 17:32:11'),
	(10,1,'undeployLanderFromDomain',0,235,1,NULL,4,1,NULL,NULL,'2016-01-16 18:53:25'),
	(11,1,'deployLanderToDomain',0,235,1,NULL,4,1,NULL,NULL,'2016-01-16 18:53:26');

/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table landers
# ------------------------------------------------------------

DROP TABLE IF EXISTS `landers`;

CREATE TABLE `landers` (
  `id` bigint(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(75) DEFAULT NULL,
  `download_url` varchar(150) DEFAULT NULL,
  `bucket_name` varchar(20) DEFAULT NULL,
  `bucket_path` varchar(20) DEFAULT NULL,
  `user_id` int(11) unsigned DEFAULT NULL,
  `last_updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `optimize_js` tinyint(1) DEFAULT NULL,
  `optimize_css` tinyint(1) DEFAULT NULL,
  `optimize_images` tinyint(1) DEFAULT NULL,
  `optimize_gzip` tinyint(1) DEFAULT NULL,
  `modified` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `landers` WRITE;
/*!40000 ALTER TABLE `landers` DISABLE KEYS */;

INSERT INTO `landers` (`id`, `name`, `download_url`, `bucket_name`, `bucket_path`, `user_id`, `last_updated`, `optimize_js`, `optimize_css`, `optimize_images`, `optimize_gzip`, `modified`)
VALUES
	(202,'ten',NULL,NULL,NULL,4,'2015-12-06 03:58:41',1,0,0,1,0),
	(207,'aLEAFY & TREvvvyy',NULL,NULL,NULL,4,'2015-12-06 05:44:50',0,0,0,1,0),
	(210,'a',NULL,NULL,NULL,4,'2015-12-06 08:25:32',0,0,0,1,1),
	(211,'A',NULL,NULL,NULL,4,'2015-12-06 08:25:48',0,0,0,1,0),
	(215,'ABcdefg',NULL,NULL,NULL,4,'2015-12-06 08:36:28',0,0,0,1,0),
	(219,'234325235',NULL,NULL,NULL,4,'2015-12-06 10:09:32',1,0,0,1,0),
	(221,'TREV',NULL,NULL,NULL,4,'2015-12-06 19:11:26',0,0,0,1,0),
	(222,'TREV123',NULL,NULL,NULL,4,'2015-12-06 19:13:09',0,0,0,1,0),
	(223,'TREV1234',NULL,NULL,NULL,4,'2015-12-06 19:14:24',0,0,0,1,0),
	(224,'TREV12345678',NULL,NULL,NULL,4,'2015-12-06 19:15:44',0,0,0,1,0),
	(225,'TREV',NULL,NULL,NULL,4,'2015-12-06 19:18:26',0,0,0,1,0),
	(226,'1122TREVYYY',NULL,NULL,NULL,4,'2015-12-06 19:19:16',1,0,0,0,1),
	(227,'duplicated',NULL,NULL,NULL,4,'2015-12-06 19:30:19',0,0,0,1,0),
	(228,'duplicate TREVY',NULL,NULL,NULL,4,'2015-12-06 19:32:30',0,0,0,1,0),
	(229,'DUP DUP DUP',NULL,NULL,NULL,4,'2015-12-06 19:33:51',0,0,0,1,0),
	(231,'aaaaadup',NULL,NULL,NULL,4,'2015-12-06 19:41:57',0,0,0,1,0),
	(232,'1dup',NULL,NULL,NULL,4,'2015-12-06 19:42:47',1,1,0,1,0),
	(235,'1122TREVY dup',NULL,NULL,NULL,4,'2015-12-06 19:53:53',1,0,1,1,0),
	(237,'TREVY1234 dup',NULL,NULL,NULL,4,'2015-12-06 19:54:57',0,0,0,1,0),
	(240,'1122TREVY dup dup dup dup',NULL,NULL,NULL,4,'2015-12-06 19:58:08',0,1,1,1,0),
	(244,'TREVVddd',NULL,NULL,NULL,4,'2015-12-06 20:10:26',0,0,0,1,0),
	(245,'again',NULL,NULL,NULL,4,'2015-12-06 20:14:20',0,0,0,1,0),
	(246,'try this again',NULL,NULL,NULL,4,'2015-12-06 20:15:35',0,0,0,1,0),
	(247,'and again',NULL,NULL,NULL,4,'2015-12-06 20:16:08',0,0,0,1,0),
	(248,'test snippets',NULL,NULL,NULL,4,'2015-12-06 20:16:54',0,0,0,1,0),
	(249,'test snippets agin',NULL,NULL,NULL,4,'2015-12-06 20:17:16',0,0,0,1,0),
	(250,'maybe this one snippet will work',NULL,NULL,NULL,4,'2015-12-06 20:20:54',0,0,0,1,0),
	(251,'why why why',NULL,NULL,NULL,4,'2015-12-06 20:22:41',0,0,0,1,0),
	(253,'trevandleafy4everrrr',NULL,NULL,NULL,4,'2015-12-06 20:34:55',0,0,0,1,0),
	(255,'test a rip today',NULL,NULL,NULL,4,'2015-12-07 00:30:04',0,0,0,1,0),
	(260,'sdf',NULL,NULL,NULL,4,'2015-12-07 00:38:46',0,0,0,1,0),
	(262,'asdf',NULL,NULL,NULL,4,'2015-12-07 00:41:41',0,0,0,1,0),
	(265,'test',NULL,NULL,NULL,4,'2015-12-09 19:14:35',0,0,0,1,0),
	(266,'alex dup',NULL,NULL,NULL,4,'2015-12-09 19:15:27',0,0,0,1,0),
	(267,'ztesttrevnew',NULL,NULL,NULL,4,'2015-12-11 00:24:02',0,0,0,1,0),
	(268,'zzOKOK',NULL,NULL,NULL,4,'2015-12-11 23:26:56',0,0,0,1,0),
	(269,'another dup',NULL,NULL,NULL,4,'2015-12-19 20:41:28',0,0,0,1,0),
	(272,'again again 333',NULL,NULL,NULL,4,'2015-12-23 00:55:49',0,0,0,0,0),
	(273,'aaaa 444555',NULL,NULL,NULL,4,'2015-12-23 00:59:02',0,0,0,0,0),
	(274,'asdfasdfvvv  dd',NULL,NULL,NULL,4,'2015-12-23 01:01:13',0,0,0,0,0),
	(290,'lifen <3',NULL,NULL,NULL,4,'2016-01-03 00:27:38',0,0,0,1,0),
	(291,'11111',NULL,NULL,NULL,4,'2016-01-03 02:18:06',1,1,0,1,1),
	(292,'111',NULL,NULL,NULL,4,'2016-01-03 02:20:06',0,1,1,1,1),
	(293,'11',NULL,NULL,NULL,4,'2016-01-04 21:33:28',0,1,1,1,0),
	(294,'1',NULL,NULL,NULL,4,'2016-01-05 02:23:18',1,0,0,0,1);

/*!40000 ALTER TABLE `landers` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table landers_with_campaigns
# ------------------------------------------------------------

DROP TABLE IF EXISTS `landers_with_campaigns`;

CREATE TABLE `landers_with_campaigns` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `campaign_id` int(11) unsigned DEFAULT NULL,
  `user_id` int(11) unsigned DEFAULT NULL,
  `lander_id` bigint(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_landers_with_campaigns_user_id` (`user_id`),
  KEY `FK_landers_with_campaigns_lander_id_landers_id` (`lander_id`),
  CONSTRAINT `FK_landers_with_campaigns_lander_id_landers_id` FOREIGN KEY (`lander_id`) REFERENCES `landers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_landers_with_campaigns_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `landers_with_campaigns` WRITE;
/*!40000 ALTER TABLE `landers_with_campaigns` DISABLE KEYS */;

INSERT INTO `landers_with_campaigns` (`id`, `campaign_id`, `user_id`, `lander_id`)
VALUES
	(269,2,4,251),
	(429,1,4,235);

/*!40000 ALTER TABLE `landers_with_campaigns` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table snippets
# ------------------------------------------------------------

DROP TABLE IF EXISTS `snippets`;

CREATE TABLE `snippets` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `code` text,
  `name` varchar(100) DEFAULT NULL,
  `user_id` int(11) unsigned DEFAULT NULL,
  `for_everyone` tinyint(1) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `snippets` WRITE;
/*!40000 ALTER TABLE `snippets` DISABLE KEYS */;

INSERT INTO `snippets` (`id`, `code`, `name`, `user_id`, `for_everyone`, `description`)
VALUES
	(1,'kthis is the codeff\nd\nvar 10 = this;\n\nsffsdf\nhey ok ','JS No-referrer',4,0,'JS No-Referrer is a javascript library that makes sure your referrer is removed when any link is clicked on your page. It is compatible with pretty much every browser, and on browsers it is not compatible with it will not allow a user to click a link at all.\n                    \n                    '),
	(2,'snippet2 code\nasdf\nasdf','testes',4,0,'This snippet sounds the default android alert on page load.'),
	(3,'third snippet code','third one',3,0,'third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code ');

/*!40000 ALTER TABLE `snippets` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table url_endpoints
# ------------------------------------------------------------

DROP TABLE IF EXISTS `url_endpoints`;

CREATE TABLE `url_endpoints` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(250) DEFAULT NULL,
  `user_id` int(11) unsigned DEFAULT NULL,
  `lander_id` bigint(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_user_id_users_id` (`user_id`),
  KEY `FK_urlendpoints_lander_id_landers_id` (`lander_id`),
  CONSTRAINT `FK_urlendpoints_lander_id_landers_id` FOREIGN KEY (`lander_id`) REFERENCES `landers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_user_id_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `url_endpoints` WRITE;
/*!40000 ALTER TABLE `url_endpoints` DISABLE KEYS */;

INSERT INTO `url_endpoints` (`id`, `name`, `user_id`, `lander_id`)
VALUES
	(6,'index1.html',4,235),
	(7,'index2.html',4,235),
	(8,'onetwo.html',4,240),
	(9,'three.html',4,240),
	(10,'hey.html',4,202),
	(11,'ok.html',4,202),
	(12,'test/europe_three/whatever.html',4,202);

/*!40000 ALTER TABLE `url_endpoints` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `user` varchar(100) DEFAULT NULL,
  `hash` varchar(200) DEFAULT NULL,
  `approved` tinyint(1) unsigned DEFAULT NULL,
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `last_login` datetime NOT NULL,
  `admin` tinyint(4) unsigned DEFAULT '0',
  `username` varchar(200) DEFAULT NULL,
  `uid` varchar(50) DEFAULT NULL,
  `reset_pw_timestamp` timestamp NULL DEFAULT NULL,
  `reset_pw_code` varchar(50) DEFAULT NULL,
  `validate_user_code` varchar(50) DEFAULT NULL,
  `aws_access_key_id` varchar(25) DEFAULT NULL,
  `aws_secret_access_key` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user` (`user`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`user`, `hash`, `approved`, `id`, `last_login`, `admin`, `username`, `uid`, `reset_pw_timestamp`, `reset_pw_code`, `validate_user_code`, `aws_access_key_id`, `aws_secret_access_key`)
VALUES
	('test@email.com','$2a$08$rLjHUsIZeI/CxRBzoiMj1uCjixLeSewFZhHNZa7qrPxeUk30vjN52',1,1,'0000-00-00 00:00:00',1,'buildcave',NULL,NULL,NULL,NULL,NULL,NULL),
	('trevor@buildcave.com','$2a$08$fDSefrjTB9aBzlAqCkvKhOiirZ75UJECJUkD98Dyl4woJtu0G/sqe',0,4,'0000-00-00 00:00:00',0,NULL,NULL,NULL,NULL,NULL,'trev25','alfstad'),
	('troy@buildcave.com','$2a$08$PkLBYKIZQyB0LRGPgF0e3OYeLUQb38LUx7hsqo9iDoD.pokfRnyOe',1,6,'0000-00-00 00:00:00',1,'Troy','3wdmm6qljx44','2015-09-06 03:10:09','359acf0a-1df8-4627-9f4e-2e4291f2f740',NULL,'AKIAI466DJECC35NREIA','YBxqd6XlNDC/4QxBj2tTrCxSB');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



--
-- Dumping routines (PROCEDURE) for database 'moonlander'
--
DELIMITER ;;

# Dump of PROCEDURE add_campaign_to_lander
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `add_campaign_to_lander` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`%`*/ /*!50003 PROCEDURE `add_campaign_to_lander`(IN `in_lander_id` BIGINT, IN `in_campaign_id` BIGINT, IN `in_user_id` INT)
BEGIN
	INSERT INTO landers_with_campaigns (campaign_id, lander_id, user_id) VALUES (in_campaign_id, in_lander_id, in_user_id);
	SELECT LAST_INSERT_ID();
	SELECT a.domain_id,b.domain FROM campaigns_with_domains a JOIN domains b ON a.domain_id = b.id WHERE (a.user_id = in_user_id AND a.campaign_id = in_campaign_id);
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE add_lander_to_campaign
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `add_lander_to_campaign` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`%`*/ /*!50003 PROCEDURE `add_lander_to_campaign`(IN `in_lander_id` INT, IN `in_campaign_id` INT, IN `in_user` VARCHAR(50))
BEGIN
	IF NOT EXISTS(SELECT * FROM campaign_landers WHERE campaign_id=in_campaign_id AND lander_id=in_lander_id) THEN
		INSERT INTO campaign_landers (lander_id, campaign_id, user) VALUES (in_lander_id, in_campaign_id, in_user);
	END IF;
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE add_new_snippet
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `add_new_snippet` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`%`*/ /*!50003 PROCEDURE `add_new_snippet`(IN `in_user_id` INT, IN `in_name` VARCHAR(100), IN `in_description` TEXT)
BEGIN
	INSERT INTO snippets (user_id, name, description, code, for_everyone) VALUES (in_user_id, in_name, in_description, "", 0);
	SELECT LAST_INSERT_ID();
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE add_snippet_to_url_endpoint
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `add_snippet_to_url_endpoint` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`%`*/ /*!50003 PROCEDURE `add_snippet_to_url_endpoint`(IN `in_snippet_id` INT, IN `in_url_endpoint_id` VARCHAR(100), IN `in_user_id` INT)
BEGIN
	INSERT INTO active_snippets (snippet_id, url_endpoint_id, user_id) VALUES (in_snippet_id, in_url_endpoint_id, in_user_id);
	SELECT LAST_INSERT_ID();
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE delete_campaign
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `delete_campaign` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`%`*/ /*!50003 PROCEDURE `delete_campaign`(IN `in_id` INT, IN `in_user` VARCHAR(50))
BEGIN
	DELETE FROM campaigns WHERE user=in_user and id=in_id;
	DELETE FROM campaign_landers WHERE user=in_user and campaign_id=in_id;
	DELETE FROM domain_campaigns WHERE user=in_user and campaign_id=in_id;
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE delete_domain
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `delete_domain` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`%`*/ /*!50003 PROCEDURE `delete_domain`(IN `in_id` INT, IN `in_user` VARCHAR(50))
BEGIN
	DELETE FROM domains WHERE user=in_user and id=in_id;
	DELETE FROM domain_campaigns WHERE user=in_user and domain_id=in_id;
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE delete_lander
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `delete_lander` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`%`*/ /*!50003 PROCEDURE `delete_lander`(IN `in_id` INT, IN `in_user` VARCHAR(50))
BEGIN
	DELETE FROM landers WHERE user=in_user and id=in_id;
	DELETE FROM campaign_landers WHERE user=in_user and lander_id=in_id;
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE get_lander_info_all
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `get_lander_info_all` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`%`*/ /*!50003 PROCEDURE `get_lander_info_all`(IN `in_user` VARCHAR(50))
BEGIN
SELECT landers.*, COALESCE(campaign_landers.campaign_id, NULL) AS cl_c_id,  COALESCE(campaigns.name, NULL) AS campaign_name,  COALESCE(campaigns.`default`, NULL) as default_campaign, 
 COALESCE(domain_campaigns.domain_id, NULL) AS dc_d_id,  COALESCE(domains.domain, NULL) AS domain,  COALESCE(domains.nameservers, NULL) AS nameservers
FROM landers
    LEFT JOIN campaign_landers
        ON campaign_landers.lander_id = landers.id
    LEFT JOIN campaigns
        ON campaigns.id = campaign_landers.campaign_id
    LEFT JOIN domain_campaigns
        ON domain_campaigns.campaign_id = campaigns.id
    LEFT JOIN domains
    	  ON domains.id = domain_campaigns.domain_id
WHERE landers.user = in_user;
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE insert_campaign
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `insert_campaign` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`%`*/ /*!50003 PROCEDURE `insert_campaign`(IN `in_name` VARCHAR(100), IN `in_user` VARCHAR(50))
BEGIN
	IF NOT EXISTS (SELECT * FROM campaigns WHERE name=in_name AND user=in_user) THEN
        INSERT INTO campaigns (name, user) VALUES(in_name, in_user);
   END IF;
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE insert_domain
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `insert_domain` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`%`*/ /*!50003 PROCEDURE `insert_domain`(IN `in_domain` VARCHAR(255), IN `in_nameservers` TEXT, IN `in_user` VARCHAR(50))
BEGIN
	IF NOT EXISTS (SELECT * FROM domains WHERE domain=in_domain AND user=in_user) THEN
        INSERT INTO domains (domain, user, nameservers) VALUES(in_domain, in_user, in_nameservers);
   END IF;
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE insert_lander
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `insert_lander` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`%`*/ /*!50003 PROCEDURE `insert_lander`(IN `in_name` VARCHAR(100), IN `in_download_url` VARCHAR(300), IN `in_user` VARCHAR(50))
BEGIN
	IF NOT EXISTS (SELECT * FROM landers WHERE name=in_name AND user=in_user) THEN
        INSERT INTO landers (name, download_url, user) VALUES(in_name, in_download_url, in_user);
   END IF;
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE register_job
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `register_job` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`%`*/ /*!50003 PROCEDURE `register_job`(IN `in_working_node_id` INT, IN `in_action` VARCHAR(100), IN `in_processing` TINYINT, IN `in_lander_id` BIGINT, IN `in_domain_id` BIGINT, IN `in_campaign_id` BIGINT, IN `in_user_id` INT, IN `in_lander_url` VARCHAR(200))
BEGIN
	INSERT INTO jobs (working_node_id, action, processing, lander_id, domain_id, campaign_id, user_id, lander_url) VALUES (in_working_node_id, in_action, in_processing, in_lander_id, in_domain_id, in_campaign_id, in_user_id, in_lander_url);
	SELECT LAST_INSERT_ID();
	SELECT created_on from jobs where id = LAST_INSERT_ID();
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE reset_password
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `reset_password` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`%`*/ /*!50003 PROCEDURE `reset_password`(IN `in_code` VARCHAR(50), IN `in_hash` VARCHAR(200))
BEGIN
	UPDATE users SET hash=in_hash, reset_pw_code=NULL, reset_pw_timestamp=NULL WHERE reset_pw_code=in_code;
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE save_new_duplicate_lander
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `save_new_duplicate_lander` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`%`*/ /*!50003 PROCEDURE `save_new_duplicate_lander`(IN `in_lander_name` VARCHAR(75), IN `in_user_id` INT, IN in_optimize_js INT, IN in_optimize_css INT, IN in_optimize_images INT, IN in_optimize_gzip INT)
BEGIN
	INSERT INTO landers (name, user_id, optimize_js, optimize_css, optimize_images, optimize_gzip) VALUES (in_lander_name, in_user_id, in_optimize_js, in_optimize_css, in_optimize_images, in_optimize_gzip);
	SELECT LAST_INSERT_ID();
	SELECT DATE_FORMAT(last_updated, '%b %e, %Y %l:%i:%s %p') AS last_updated FROM landers WHERE user_id = in_user_id AND id = LAST_INSERT_ID();
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE save_new_lander
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `save_new_lander` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`%`*/ /*!50003 PROCEDURE `save_new_lander`(IN `in_lander_name` VARCHAR(75), IN `in_user_id` INT)
BEGIN
	INSERT INTO landers (name, user_id, optimize_js, optimize_css, optimize_images, optimize_gzip) VALUES (in_lander_name, in_user_id, false, false, false, true);
	SELECT LAST_INSERT_ID();
	SELECT DATE_FORMAT(last_updated, '%b %e, %Y %l:%i:%s %p') AS last_updated FROM landers WHERE user_id = in_user_id AND id = LAST_INSERT_ID();
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE update_api_keys
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `update_api_keys` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`%`*/ /*!50003 PROCEDURE `update_api_keys`(IN `in_user` VARCHAR(100), IN `in_access_key_id` VARCHAR(50), IN `in_secret_access_key` VARCHAR(50))
BEGIN
	UPDATE users SET access_key_id=in_access_key_id, secret_access_key=in_secret_access_key WHERE user=in_user;
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE update_campaign
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `update_campaign` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`%`*/ /*!50003 PROCEDURE `update_campaign`(IN `in_id` INT, IN `in_name` VARCHAR(100), IN `in_user` VARCHAR(50))
BEGIN
	UPDATE campaigns SET name=in_name WHERE id=in_id AND user=in_user;
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE update_domain
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `update_domain` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`%`*/ /*!50003 PROCEDURE `update_domain`(IN `in_id` INT, IN `in_domain` VARCHAR(255), IN `in_nameservers` TEXT, IN `in_user` VARCHAR(50))
BEGIN
	UPDATE domains SET domain=in_domains,nameservers=in_nameservers WHERE id=in_id AND user=in_user;
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE update_lander
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `update_lander` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`%`*/ /*!50003 PROCEDURE `update_lander`(IN `in_id` INT, IN `in_name` VARCHAR(100), IN `in_download_url` TEXT, IN `in_user` VARCHAR(50))
BEGIN
	UPDATE lander SET download_url=in_download_url,name=in_name WHERE id=in_id AND user=in_user;
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
DELIMITER ;

--
-- Dumping routines (FUNCTION) for database 'moonlander'
--
DELIMITER ;;

# Dump of FUNCTION check_password_reset_code
# ------------------------------------------------------------

/*!50003 DROP FUNCTION IF EXISTS `check_password_reset_code` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`%`*/ /*!50003 FUNCTION `check_password_reset_code`(`in_code` VARCHAR(50), `in_reset_code_lifespan_minutes` INT) RETURNS varchar(20) CHARSET latin1
BEGIN
	DECLARE var_reset_pw_timestamp TIMESTAMP;

	IF EXISTS (SELECT * FROM users WHERE reset_pw_code=in_code) THEN
		SELECT reset_pw_timestamp INTO var_reset_pw_timestamp FROM users WHERE reset_pw_code=in_code;
		IF(DATE_SUB(NOW(), INTERVAL in_reset_code_lifespan_minutes MINUTE) < var_reset_pw_timestamp) THEN
			return "VALID";
		ELSE
			return "EXPIRED";
		END IF;
	ELSE
		return "INVALID";
	END IF;
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of FUNCTION request_reset_password
# ------------------------------------------------------------

/*!50003 DROP FUNCTION IF EXISTS `request_reset_password` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`%`*/ /*!50003 FUNCTION `request_reset_password`(`in_user` VARCHAR(100), `in_code` VARCHAR(50)) RETURNS varchar(50) CHARSET latin1
BEGIN
	IF EXISTS (SELECT * FROM users WHERE user=in_user) THEN
		UPDATE users SET reset_pw_code=in_code, reset_pw_timestamp=NOW() WHERE user=in_user;
		RETURN "SUCCESS";
	ELSE
		RETURN "USER_NOT_FOUND";
	END IF;
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
DELIMITER ;

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
