# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: 52.88.173.62 (MySQL 5.6.30-0ubuntu0.14.04.1)
# Database: moonlander
# Generation Time: 2016-05-31 00:42:29 +0000
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
  `created_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `snippet_id` int(11) unsigned DEFAULT NULL,
  `user_id` int(11) unsigned DEFAULT NULL,
  `url_endpoint_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKactive_snippets_snippet_id_snippets_id` (`snippet_id`),
  KEY `url_endpoint_id_url_endpoints_id` (`url_endpoint_id`),
  CONSTRAINT `url_endpoint_id_url_endpoints_id` FOREIGN KEY (`url_endpoint_id`) REFERENCES `url_endpoints` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table campaigns
# ------------------------------------------------------------

DROP TABLE IF EXISTS `campaigns`;

CREATE TABLE `campaigns` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `user_id` int(11) unsigned DEFAULT NULL,
  `created_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_campaigns_user_id_users_id` (`user_id`),
  CONSTRAINT `FK_campaigns_user_id_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `campaigns` WRITE;
/*!40000 ALTER TABLE `campaigns` DISABLE KEYS */;

INSERT INTO `campaigns` (`id`, `name`, `user_id`, `created_on`)
VALUES
	(55,'asdf',4,'2016-04-05 03:22:17');

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
  UNIQUE KEY `my_unique_key` (`user_id`,`campaign_id`,`domain_id`),
  KEY `FK_campaigns_with_domains_user_id` (`user_id`),
  KEY `FK_campaigns_with_domains_campaigns_id` (`campaign_id`),
  CONSTRAINT `FK_campaigns_with_domains_campaigns_id` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_campaigns_with_domains_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table deployed_landers
# ------------------------------------------------------------

DROP TABLE IF EXISTS `deployed_landers`;

CREATE TABLE `deployed_landers` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `domain_id` int(11) unsigned DEFAULT NULL,
  `user_id` int(11) unsigned DEFAULT NULL,
  `lander_id` bigint(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `domain_id` (`domain_id`,`lander_id`),
  UNIQUE KEY `unique_lander_id_domain_id` (`lander_id`,`domain_id`),
  KEY `FK_user_id` (`user_id`),
  CONSTRAINT `FK_deployed_landers_lander_id_landers_id` FOREIGN KEY (`lander_id`) REFERENCES `landers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `deployed_landers` WRITE;
/*!40000 ALTER TABLE `deployed_landers` DISABLE KEYS */;

INSERT INTO `deployed_landers` (`id`, `domain_id`, `user_id`, `lander_id`)
VALUES
	(192,133,4,407),
	(195,133,4,413);

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
  `created_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `cloudfront_domain` text,
  `cloudfront_id` varchar(25) DEFAULT '',
  `hosted_zone_id` varchar(50) DEFAULT '',
  `aws_root_bucket` varchar(80) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_domains_user` (`user_id`),
  CONSTRAINT `FK_user_id_domains` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `domains` WRITE;
/*!40000 ALTER TABLE `domains` DISABLE KEYS */;

INSERT INTO `domains` (`id`, `domain`, `user_id`, `nameservers`, `created_on`, `cloudfront_domain`, `cloudfront_id`, `hosted_zone_id`, `aws_root_bucket`)
VALUES
	(133,'trevoralfstad.com',4,'ns-1525.awsdns-62.org,ns-873.awsdns-45.net,ns-1721.awsdns-23.co.uk,ns-418.awsdns-52.com','2016-04-13 02:21:48','d1fzybzjz0xweu.cloudfront.net','E17YA54RI8AENO','/hostedzone/Z3VPUMNH8DSL90','lander-ds-010e29a5-ec2f-4bd8-bbd9-ca1782fdc26b');

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
  `deploy_status` varchar(100) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `done` tinyint(1) DEFAULT NULL,
  `error` tinyint(1) DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `error_code` varchar(80) DEFAULT NULL,
  `alternate_action` varchar(100) CHARACTER SET ascii DEFAULT NULL,
  `staging_path` varchar(300) DEFAULT NULL,
  `master_job_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_jobs_lander_id_landers_id` (`lander_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;

INSERT INTO `jobs` (`id`, `working_node_id`, `action`, `processing`, `lander_id`, `domain_id`, `campaign_id`, `deploy_status`, `user_id`, `done`, `error`, `created_on`, `error_code`, `alternate_action`, `staging_path`, `master_job_id`)
VALUES
	(282,1,'deleteDomain',0,0,134,0,'deleting',4,1,NULL,'2016-05-28 15:16:27',NULL,NULL,NULL,NULL),
	(283,1,'deleteDomain',0,0,135,0,'deleting',4,1,NULL,'2016-05-28 15:16:31',NULL,NULL,NULL,NULL),
	(284,1,'deleteLander',0,396,0,0,'deleting',4,1,NULL,'2016-05-28 15:21:03',NULL,NULL,NULL,NULL),
	(285,1,'deleteLander',0,397,0,0,'deleting',4,1,NULL,'2016-05-29 13:34:35',NULL,NULL,NULL,NULL),
	(286,1,'deployLanderToDomain',0,405,133,0,'deployed',4,1,NULL,'2016-05-29 14:12:44',NULL,NULL,NULL,NULL),
	(287,1,'undeployLanderFromDomain',0,405,133,0,'invalidating_delete',4,1,NULL,'2016-05-29 14:30:06',NULL,NULL,NULL,NULL),
	(288,1,'deployLanderToDomain',0,405,133,0,'deployed',4,1,NULL,'2016-05-29 14:32:16',NULL,NULL,NULL,NULL),
	(289,1,'deployLanderToDomain',0,406,133,0,'deployed',4,1,NULL,'2016-05-29 14:37:15',NULL,NULL,NULL,NULL),
	(290,1,'deployLanderToDomain',0,407,133,0,'deployed',4,1,NULL,'2016-05-29 14:48:48',NULL,NULL,NULL,NULL),
	(291,1,'deployLanderToDomain',0,408,133,0,'deployed',4,1,NULL,'2016-05-29 15:00:16',NULL,NULL,NULL,NULL),
	(292,1,'deployLanderToDomain',0,412,133,0,'deploying',4,1,1,'2016-05-29 15:38:12','CouldNotCopyLanderFromS3ToStaging',NULL,NULL,NULL),
	(293,1,'deployLanderToDomain',0,413,133,0,'deployed',4,1,NULL,'2016-05-29 15:41:55',NULL,NULL,NULL,NULL),
	(294,1,'redeploy',1,407,133,NULL,'redeploying',4,NULL,NULL,'2016-05-29 16:03:57',NULL,NULL,NULL,NULL),
	(295,1,'deployLanderToDomain',0,411,133,55,'deployed',4,1,NULL,'2016-05-29 17:06:31',NULL,NULL,NULL,NULL),
	(296,1,'deleteDomain',0,0,136,0,'deleting',4,1,NULL,'2016-05-29 17:18:06',NULL,NULL,NULL,NULL),
	(297,1,'deleteLander',0,406,0,0,'deleting',4,1,NULL,'2016-05-29 17:25:57',NULL,NULL,NULL,NULL),
	(298,1,'deleteLander',0,408,0,0,'deleting',4,1,NULL,'2016-05-29 17:26:03',NULL,NULL,NULL,NULL),
	(299,1,'undeployLanderFromDomain',0,411,133,55,'invalidating_delete',4,1,NULL,'2016-05-29 19:27:57',NULL,NULL,NULL,NULL),
	(300,1,'undeployLanderFromDomain',0,412,133,55,'invalidating_delete',4,1,NULL,'2016-05-29 19:27:57',NULL,NULL,NULL,NULL);

/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table landers
# ------------------------------------------------------------

DROP TABLE IF EXISTS `landers`;

CREATE TABLE `landers` (
  `id` bigint(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(75) DEFAULT NULL,
  `s3_folder_name` varchar(80) DEFAULT NULL,
  `user_id` int(11) unsigned DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `optimized` tinyint(1) DEFAULT NULL,
  `deploy_root` tinyint(1) DEFAULT NULL,
  `modified` tinyint(1) DEFAULT NULL,
  `ripped_from` varchar(300) DEFAULT NULL,
  `deployment_folder_name` varchar(200) DEFAULT NULL,
  `old_deployment_folder_name` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `landers` WRITE;
/*!40000 ALTER TABLE `landers` DISABLE KEYS */;

INSERT INTO `landers` (`id`, `name`, `s3_folder_name`, `user_id`, `created_on`, `optimized`, `deploy_root`, `modified`, `ripped_from`, `deployment_folder_name`, `old_deployment_folder_name`)
VALUES
	(405,'muscle lander 1','09217d4c-42da-425a-9d0f-f5f1691ed964',4,'2016-05-29 14:10:07',1,0,0,'http://beatruemen.com/Hypertoneforceza/musclemen.reportsweekly.com/index865f.html','trev','09217d4c-42da-425a-9d0f-f5f1691ed964'),
	(407,'eerrr','0c3b43a1-6384-4066-b301-ec1469b61afb',4,'2016-05-29 14:48:19',1,0,0,'http://trevoralfstad.com/trev/index.html','4','0c3b43a1-6384-4066-b301-ec1469b61afb'),
	(409,'new1','3f855585-83d6-4067-bb23-1bd146031c4f',4,'2016-05-29 15:19:07',1,0,0,'http://lander-ds-010e29a5-ec2f-4bd8-bbd9-ca1782fdc26b.s3-website-us-west-2.amazonaws.com/trevor@buildcave.com/landers/09217d4c-42da-425a-9d0f-f5f1691ed964/index.html','1666','1'),
	(410,'should work','cba54ea5-b837-48eb-84b3-4ef0bba683f8',4,'2016-05-29 15:30:03',1,0,NULL,'http://lander-ds-010e29a5-ec2f-4bd8-bbd9-ca1782fdc26b.s3-website-us-west-2.amazonaws.com/trevor@buildcave.com/landers/09217d4c-42da-425a-9d0f-f5f1691ed964/index.html','cba54ea5-b837-48eb-84b3-4ef0bba683f8',NULL),
	(411,'maybe ethis one','644fdfcc-285a-4e36-8cae-82cebb2482bf',4,'2016-05-29 15:35:01',1,0,0,'http://lander-ds-010e29a5-ec2f-4bd8-bbd9-ca1782fdc26b.s3-website-us-west-2.amazonaws.com/trevor@buildcave.com/landers/09217d4c-42da-425a-9d0f-f5f1691ed964/index.html','2','644fdfcc-285a-4e36-8cae-82cebb2482bf'),
	(412,'this one for sure','e79e281b-39da-4808-aeae-2a471d2b10ae',4,'2016-05-29 15:37:56',1,0,0,'http://lander-ds-010e29a5-ec2f-4bd8-bbd9-ca1782fdc26b.s3-website-us-west-2.amazonaws.com/trevor@buildcave.com/landers/09217d4c-42da-425a-9d0f-f5f1691ed964/index.html','1','e79e281b-39da-4808-aeae-2a471d2b10ae'),
	(413,'copy test','494f8619-5e40-4ed0-8783-965813c4b5f3',4,'2016-05-29 15:39:53',1,0,0,'http://lander-ds-010e29a5-ec2f-4bd8-bbd9-ca1782fdc26b.s3-website-us-west-2.amazonaws.com/trevor@buildcave.com/landers/09217d4c-42da-425a-9d0f-f5f1691ed964/index.html','1','494f8619-5e40-4ed0-8783-965813c4b5f3');

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
  UNIQUE KEY `unique_lander_id_user_id_campaign_id` (`user_id`,`campaign_id`,`lander_id`),
  KEY `FK_landers_with_campaigns_user_id` (`user_id`),
  KEY `FK_landers_with_campaigns_lander_id_landers_id` (`lander_id`),
  KEY `FK_landers_with_campaigns_campaigns_id` (`campaign_id`),
  CONSTRAINT `FK_landers_with_campaigns_campaigns_id` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_landers_with_campaigns_lander_id_landers_id` FOREIGN KEY (`lander_id`) REFERENCES `landers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_landers_with_campaigns_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



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
  `load_before_dom` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `snippets` WRITE;
/*!40000 ALTER TABLE `snippets` DISABLE KEYS */;

INSERT INTO `snippets` (`id`, `code`, `name`, `user_id`, `for_everyone`, `description`, `load_before_dom`)
VALUES
	(1,'kthis is the codeff\nd\nvar 10 = this;\n\nsffsdf\nhey ok ','JS No-referrer',4,0,'JS No-Referrer is a javascript library that makes sure your referrer is removed when any link is clicked on your page. It is compatible with pretty much every browser, and on browsers it is not compatible with it will not allow a user to click a link at all.\n                    \n                    ',NULL),
	(2,'snippet2 code\nasdf\nasdf','testes',4,0,'This snippet sounds the default android alert on page load.',NULL),
	(3,'third snippet code','third one',3,0,'third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code third snippet code ',NULL);

/*!40000 ALTER TABLE `snippets` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table url_endpoints
# ------------------------------------------------------------

DROP TABLE IF EXISTS `url_endpoints`;

CREATE TABLE `url_endpoints` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `filename` varchar(250) DEFAULT NULL,
  `user_id` int(11) unsigned DEFAULT NULL,
  `lander_id` bigint(11) unsigned DEFAULT NULL,
  `relative_path` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_user_id_users_id` (`user_id`),
  KEY `FK_urlendpoints_lander_id_landers_id` (`lander_id`),
  CONSTRAINT `FK_urlendpoints_lander_id_landers_id` FOREIGN KEY (`lander_id`) REFERENCES `landers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_user_id_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `url_endpoints` WRITE;
/*!40000 ALTER TABLE `url_endpoints` DISABLE KEYS */;

INSERT INTO `url_endpoints` (`id`, `filename`, `user_id`, `lander_id`, `relative_path`)
VALUES
	(79,'index.html',4,405,NULL),
	(81,'index.html',4,407,NULL),
	(83,'index.html',4,409,NULL),
	(84,'index.html',4,410,NULL),
	(85,'index.html',4,411,NULL),
	(86,'index.html',4,412,NULL),
	(87,'index.html',4,413,NULL);

/*!40000 ALTER TABLE `url_endpoints` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user` varchar(100) DEFAULT NULL,
  `hash` varchar(200) DEFAULT NULL,
  `approved` tinyint(1) unsigned DEFAULT NULL,
  `last_login` datetime NOT NULL,
  `admin` tinyint(4) unsigned DEFAULT '0',
  `username` varchar(200) DEFAULT NULL,
  `reset_pw_timestamp` timestamp NULL DEFAULT NULL,
  `reset_pw_code` varchar(50) DEFAULT NULL,
  `validate_user_code` varchar(50) DEFAULT NULL,
  `aws_root_bucket` varchar(80) DEFAULT NULL,
  `aws_access_key_id` varchar(25) DEFAULT NULL,
  `aws_secret_access_key` varchar(50) DEFAULT NULL,
  `auth_token` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user` (`user`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `user`, `hash`, `approved`, `last_login`, `admin`, `username`, `reset_pw_timestamp`, `reset_pw_code`, `validate_user_code`, `aws_root_bucket`, `aws_access_key_id`, `aws_secret_access_key`, `auth_token`)
VALUES
	(1,'test@email.com','$2a$08$rLjHUsIZeI/CxRBzoiMj1uCjixLeSewFZhHNZa7qrPxeUk30vjN52',1,'0000-00-00 00:00:00',1,'buildcave',NULL,NULL,NULL,NULL,'AKIAIEE5MHUPJDVVQ5FQ','DsipSn7RN7AXvyP1ijvsvHprQaaesU7ZanPBe9ha',NULL),
	(4,'trevor@buildcave.com','$2a$08$FnNXtbth1TWhawDcdMjsKuovKCmXGqFAA/QqHkFcDeZToN6XfEXHy',0,'0000-00-00 00:00:00',0,'trevor',NULL,NULL,NULL,'lander-ds-010e29a5-ec2f-4bd8-bbd9-ca1782fdc26b','AKIAIGEHZO373H6MTW6Q','u4W2dWg5Du/xeoiLINkNAJN1ht2cT3HOmLDaT1xL','7d6ee2bb-6823-4aa5-a96d-73a3d05beb34');

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
/*!50003 CREATE*/ /*!50020 DEFINER=`buildcave`@`%`*/ /*!50003 PROCEDURE `add_campaign_to_lander`(IN `in_lander_id` BIGINT, IN `in_campaign_id` BIGINT, IN `in_user_id` INT)
BEGIN
	INSERT INTO landers_with_campaigns (campaign_id, lander_id, user_id) VALUES (in_campaign_id, in_lander_id, in_user_id);
	SELECT LAST_INSERT_ID();
	SELECT a.domain_id,b.domain FROM campaigns_with_domains a JOIN domains b ON a.domain_id = b.id WHERE (a.user_id = in_user_id AND a.campaign_id = in_campaign_id);
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE add_deployed_lander
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `add_deployed_lander` */;;
/*!50003 SET SESSION SQL_MODE="NO_ENGINE_SUBSTITUTION"*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`buildcave`@`%`*/ /*!50003 PROCEDURE `add_deployed_lander`(IN `in_user_id` INT, IN `in_lander_id` BIGINT, IN `in_domain_id` BIGINT)
BEGIN
	INSERT IGNORE INTO deployed_landers(user_id, lander_id, domain_id) VALUES (in_user_id, in_lander_id, in_domain_id);
	SELECT LAST_INSERT_ID();
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE add_domain_to_campaign
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `add_domain_to_campaign` */;;
/*!50003 SET SESSION SQL_MODE="NO_ENGINE_SUBSTITUTION"*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`buildcave`@`%`*/ /*!50003 PROCEDURE `add_domain_to_campaign`(IN `in_domain_id` BIGINT, IN `in_campaign_id` BIGINT, IN `in_user_id` INT)
BEGIN
	INSERT INTO campaigns_with_domains (campaign_id, domain_id, user_id) VALUES (in_campaign_id, in_domain_id, in_user_id);
	SELECT LAST_INSERT_ID();
	SELECT a.lander_id,b.name FROM landers_with_campaigns a JOIN landers b ON a.lander_id = b.id WHERE (a.user_id = in_user_id AND a.campaign_id = in_campaign_id);
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE add_lander_to_campaign
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `add_lander_to_campaign` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`buildcave`@`%`*/ /*!50003 PROCEDURE `add_lander_to_campaign`(IN `in_lander_id` INT, IN `in_campaign_id` INT, IN `in_user` VARCHAR(50))
BEGIN
	IF NOT EXISTS(SELECT * FROM campaign_landers WHERE campaign_id=in_campaign_id AND lander_id=in_lander_id) THEN
		INSERT INTO campaign_landers (lander_id, campaign_id, user) VALUES (in_lander_id, in_campaign_id, in_user);
	END IF;
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE add_new_snippet
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `add_new_snippet` */;;
/*!50003 SET SESSION SQL_MODE="NO_ENGINE_SUBSTITUTION"*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`buildcave`@`%`*/ /*!50003 PROCEDURE `add_new_snippet`(IN `in_user_id` INT, IN `in_name` VARCHAR(100), IN `in_description` TEXT, IN `in_load_before_dom` TINYINT)
BEGIN
	INSERT INTO snippets (user_id, name, description, load_before_dom, code, for_everyone) VALUES (in_user_id, in_name, in_description, in_load_before_dom,"", 0);
	SELECT LAST_INSERT_ID();
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE add_snippet_to_url_endpoint
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `add_snippet_to_url_endpoint` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`buildcave`@`%`*/ /*!50003 PROCEDURE `add_snippet_to_url_endpoint`(IN `in_snippet_id` INT, IN `in_url_endpoint_id` VARCHAR(100), IN `in_user_id` INT)
BEGIN
	INSERT INTO active_snippets (snippet_id, url_endpoint_id, user_id) VALUES (in_snippet_id, in_url_endpoint_id, in_user_id);
	SELECT LAST_INSERT_ID();
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE delete_campaign
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `delete_campaign` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`buildcave`@`%`*/ /*!50003 PROCEDURE `delete_campaign`(IN `in_id` INT, IN `in_user` VARCHAR(50))
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
/*!50003 CREATE*/ /*!50020 DEFINER=`buildcave`@`%`*/ /*!50003 PROCEDURE `delete_domain`(IN `in_id` INT, IN `in_user` VARCHAR(50))
BEGIN
	DELETE FROM domains WHERE user=in_user and id=in_id;
	DELETE FROM domain_campaigns WHERE user=in_user and domain_id=in_id;
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE delete_lander
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `delete_lander` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`buildcave`@`%`*/ /*!50003 PROCEDURE `delete_lander`(IN `in_id` INT, IN `in_user` VARCHAR(50))
BEGIN
	DELETE FROM landers WHERE user=in_user and id=in_id;
	DELETE FROM campaign_landers WHERE user=in_user and lander_id=in_id;
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE get_lander_info_all
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `get_lander_info_all` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`buildcave`@`%`*/ /*!50003 PROCEDURE `get_lander_info_all`(IN `in_user` VARCHAR(50))
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
/*!50003 CREATE*/ /*!50020 DEFINER=`buildcave`@`%`*/ /*!50003 PROCEDURE `insert_campaign`(IN `in_name` VARCHAR(100), IN `in_user` VARCHAR(50))
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
/*!50003 CREATE*/ /*!50020 DEFINER=`buildcave`@`%`*/ /*!50003 PROCEDURE `insert_domain`(IN `in_domain` VARCHAR(255), IN `in_nameservers` TEXT, IN `in_user` VARCHAR(50))
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
/*!50003 CREATE*/ /*!50020 DEFINER=`buildcave`@`%`*/ /*!50003 PROCEDURE `insert_lander`(IN `in_name` VARCHAR(100), IN `in_download_url` VARCHAR(300), IN `in_user` VARCHAR(50))
BEGIN
	IF NOT EXISTS (SELECT * FROM landers WHERE name=in_name AND user=in_user) THEN
        INSERT INTO landers (name, download_url, user) VALUES(in_name, in_download_url, in_user);
   END IF;
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE insert_new_campaign
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `insert_new_campaign` */;;
/*!50003 SET SESSION SQL_MODE="NO_ENGINE_SUBSTITUTION"*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`buildcave`@`%`*/ /*!50003 PROCEDURE `insert_new_campaign`(IN `in_user_id` INT, IN `in_name` VARCHAR(255))
BEGIN
	INSERT INTO campaigns (user_id, name) VALUES (in_user_id, in_name);
	SELECT LAST_INSERT_ID();
	SELECT DATE_FORMAT(created_on, '%b %e, %Y %l:%i:%s %p') AS created_on from campaigns where id = LAST_INSERT_ID();
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE insert_new_domain
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `insert_new_domain` */;;
/*!50003 SET SESSION SQL_MODE="NO_ENGINE_SUBSTITUTION"*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`buildcave`@`%`*/ /*!50003 PROCEDURE `insert_new_domain`(IN `in_user_id` INT, IN `in_domain` VARCHAR(255), `in_nameservers` TEXT, IN `in_cloudfront_domain` TEXT, IN `in_cloudfront_id` VARCHAR(25), `in_hosted_zone_id` VARCHAR(50), `in_root_bucket` VARCHAR(80))
BEGIN
	INSERT INTO domains (user_id, domain, nameservers, cloudfront_domain, cloudfront_id, hosted_zone_id, aws_root_bucket) VALUES (in_user_id, in_nameservers, in_domain, in_cloudfront_domain, in_cloudfront_id, in_hosted_zone_id, in_root_bucket);
	SELECT LAST_INSERT_ID();
	SELECT DATE_FORMAT(created_on, '%b %e, %Y %l:%i:%s %p') AS created_on from domains where id = LAST_INSERT_ID();
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE register_job
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `register_job` */;;
/*!50003 SET SESSION SQL_MODE="NO_ENGINE_SUBSTITUTION"*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`buildcave`@`%`*/ /*!50003 PROCEDURE `register_job`(IN `in_deploy_status` VARCHAR(100), IN `in_working_node_id` INT, IN `in_action` VARCHAR(100), IN `in_alternate_action` VARCHAR(100), IN `in_processing` TINYINT, IN `in_lander_id` BIGINT, IN `in_domain_id` BIGINT, IN `in_campaign_id` BIGINT, IN `in_user_id` INT, `in_master_job_id` INT)
BEGIN
	INSERT INTO jobs (deploy_status, working_node_id, action, alternate_action, processing, lander_id, domain_id, campaign_id, user_id, master_job_id) VALUES (in_deploy_status, in_working_node_id, in_action, in_alternate_action, in_processing, in_lander_id, in_domain_id, in_campaign_id, in_user_id, in_master_job_id);
	SELECT LAST_INSERT_ID();
	SELECT created_on from jobs where id = LAST_INSERT_ID();
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE reset_password
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `reset_password` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`buildcave`@`%`*/ /*!50003 PROCEDURE `reset_password`(IN `in_code` VARCHAR(50), IN `in_hash` VARCHAR(200))
BEGIN
	UPDATE users SET hash=in_hash, reset_pw_code=NULL, reset_pw_timestamp=NULL WHERE reset_pw_code=in_code;
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE save_new_duplicate_lander
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `save_new_duplicate_lander` */;;
/*!50003 SET SESSION SQL_MODE="NO_ENGINE_SUBSTITUTION"*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`buildcave`@`%`*/ /*!50003 PROCEDURE `save_new_duplicate_lander`(IN `in_lander_name` VARCHAR(75), IN `in_user_id` INT, IN `in_optimized` TINYINT)
BEGIN
	INSERT INTO landers (name, user_id, optimized) VALUES (in_lander_name, in_user_id, in_optimized);
	SELECT LAST_INSERT_ID();
	SELECT DATE_FORMAT(last_updated, '%b %e, %Y %l:%i:%s %p') AS last_updated FROM landers WHERE user_id = in_user_id AND id = LAST_INSERT_ID();
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE save_new_lander
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `save_new_lander` */;;
/*!50003 SET SESSION SQL_MODE="NO_ENGINE_SUBSTITUTION"*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`buildcave`@`%`*/ /*!50003 PROCEDURE `save_new_lander`(IN `in_lander_name` VARCHAR(75), IN `in_ripped_from` VARCHAR(300), IN `in_s3_folder_name` VARCHAR(80), IN `in_user_id` INT)
BEGIN
	INSERT INTO landers (name, ripped_from, s3_folder_name, deployment_folder_name, user_id, deploy_root, optimized) VALUES (in_lander_name, in_ripped_from, in_s3_folder_name, in_s3_folder_name, in_user_id, false, true);
	SELECT LAST_INSERT_ID();
	SELECT DATE_FORMAT(created_on, '%b %e, %Y %l:%i:%s %p') AS created_on FROM landers WHERE user_id = in_user_id AND id = LAST_INSERT_ID();
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE update_api_keys
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `update_api_keys` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`buildcave`@`%`*/ /*!50003 PROCEDURE `update_api_keys`(IN `in_user` VARCHAR(100), IN `in_access_key_id` VARCHAR(50), IN `in_secret_access_key` VARCHAR(50))
BEGIN
	UPDATE users SET access_key_id=in_access_key_id, secret_access_key=in_secret_access_key WHERE user=in_user;
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE update_campaign
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `update_campaign` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`buildcave`@`%`*/ /*!50003 PROCEDURE `update_campaign`(IN `in_id` INT, IN `in_name` VARCHAR(100), IN `in_user` VARCHAR(50))
BEGIN
	UPDATE campaigns SET name=in_name WHERE id=in_id AND user=in_user;
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE update_domain
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `update_domain` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`buildcave`@`%`*/ /*!50003 PROCEDURE `update_domain`(IN `in_id` INT, IN `in_domain` VARCHAR(255), IN `in_nameservers` TEXT, IN `in_user` VARCHAR(50))
BEGIN
	UPDATE domains SET domain=in_domains,nameservers=in_nameservers WHERE id=in_id AND user=in_user;
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE update_lander
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `update_lander` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`buildcave`@`%`*/ /*!50003 PROCEDURE `update_lander`(IN `in_id` INT, IN `in_name` VARCHAR(100), IN `in_download_url` TEXT, IN `in_user` VARCHAR(50))
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
/*!50003 CREATE*/ /*!50020 DEFINER=`buildcave`@`%`*/ /*!50003 FUNCTION `check_password_reset_code`(`in_code` VARCHAR(50), `in_reset_code_lifespan_minutes` INT) RETURNS varchar(20) CHARSET latin1
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
/*!50003 CREATE*/ /*!50020 DEFINER=`buildcave`@`%`*/ /*!50003 FUNCTION `request_reset_password`(`in_user` VARCHAR(100), `in_code` VARCHAR(50)) RETURNS varchar(50) CHARSET latin1
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
