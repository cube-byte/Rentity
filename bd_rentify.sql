-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: db_rentify
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comprobante`
--

DROP TABLE IF EXISTS `comprobante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comprobante` (
  `id_comprobante` bigint NOT NULL AUTO_INCREMENT,
  `codigo` varchar(255) DEFAULT NULL,
  `id_pago` bigint DEFAULT NULL,
  PRIMARY KEY (`id_comprobante`),
  UNIQUE KEY `UK_ktryxanenok6u5haih7qlaph3` (`codigo`),
  KEY `FK6u8o36tk1d40kbkonc34l3115` (`id_pago`),
  CONSTRAINT `FK6u8o36tk1d40kbkonc34l3115` FOREIGN KEY (`id_pago`) REFERENCES `pago` (`id_pago`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comprobante`
--

LOCK TABLES `comprobante` WRITE;
/*!40000 ALTER TABLE `comprobante` DISABLE KEYS */;
INSERT INTO `comprobante` VALUES (1,'C-2026-0001',1),(2,'C-2026-0002',4),(3,'C-2026-0003',5);
/*!40000 ALTER TABLE `comprobante` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pago`
--

DROP TABLE IF EXISTS `pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pago` (
  `id_pago` bigint NOT NULL AUTO_INCREMENT,
  `estado` varchar(255) DEFAULT NULL,
  `fecha` datetime(6) DEFAULT NULL,
  `metodo` varchar(255) DEFAULT NULL,
  `monto` decimal(38,2) DEFAULT NULL,
  `id_reserva` bigint NOT NULL,
  PRIMARY KEY (`id_pago`),
  KEY `FKcf877idupj5b48wjatfaws6sg` (`id_reserva`),
  CONSTRAINT `FKcf877idupj5b48wjatfaws6sg` FOREIGN KEY (`id_reserva`) REFERENCES `reserva` (`id_reserva`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pago`
--

LOCK TABLES `pago` WRITE;
/*!40000 ALTER TABLE `pago` DISABLE KEYS */;
INSERT INTO `pago` VALUES (1,'COMPLETADO','2026-02-22 17:54:12.083168','TARJETA',88.00,1),(3,'PENDIENTE','2026-02-22 18:20:24.504222',NULL,525.00,3),(4,'COMPLETADO','2026-02-22 18:21:01.251439','TARJETA',58.00,4),(5,'COMPLETADO','2026-02-22 18:25:20.300336','TARJETA',1026.00,5);
/*!40000 ALTER TABLE `pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reserva`
--

DROP TABLE IF EXISTS `reserva`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reserva` (
  `id_reserva` bigint NOT NULL AUTO_INCREMENT,
  `estado` varchar(255) DEFAULT NULL,
  `fecha` datetime(6) DEFAULT NULL,
  `fecha_fin` datetime(6) DEFAULT NULL,
  `fecha_inicio` datetime(6) DEFAULT NULL,
  `precio_total` decimal(38,2) DEFAULT NULL,
  `id_auto` bigint NOT NULL,
  `id_usuario` bigint NOT NULL,
  `id_vehiculo` bigint NOT NULL,
  PRIMARY KEY (`id_reserva`),
  UNIQUE KEY `UK_ju47ymwf01j0g6wutudsqhoi8` (`id_auto`),
  KEY `FKj8cxeodpmehovje6152y4ywqm` (`id_usuario`),
  KEY `FKccl83gj740rqeee9jreolvn2o` (`id_vehiculo`),
  CONSTRAINT `FKccl83gj740rqeee9jreolvn2o` FOREIGN KEY (`id_vehiculo`) REFERENCES `tb_vehiculo` (`id_vehiculo`),
  CONSTRAINT `FKj8cxeodpmehovje6152y4ywqm` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `FKt0tc09q6acp0lcs8ss38abr7k` FOREIGN KEY (`id_auto`) REFERENCES `tb_auto` (`id_auto`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reserva`
--

LOCK TABLES `reserva` WRITE;
/*!40000 ALTER TABLE `reserva` DISABLE KEYS */;
INSERT INTO `reserva` VALUES (1,'CONFIRMADA','2026-02-22 17:54:12.078606','2026-02-22 10:00:00.000000','2026-02-20 10:00:00.000000',88.00,7,5,7),(3,'NUEVA','2026-02-22 18:20:24.500217','2026-03-18 10:00:00.000000','2026-02-25 10:00:00.000000',525.00,10,4,1),(4,'TERMINADA','2026-02-22 18:21:01.249437','2026-02-23 10:00:00.000000','2026-02-22 10:00:00.000000',58.00,8,1,8),(5,'CONFIRMADA','2026-02-22 18:25:20.298376','2026-05-28 10:00:00.000000','2026-04-01 10:00:00.000000',1026.00,6,6,6);
/*!40000 ALTER TABLE `reserva` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_auto`
--

DROP TABLE IF EXISTS `tb_auto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_auto` (
  `id_auto` bigint NOT NULL AUTO_INCREMENT,
  `color` varchar(255) DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `fecha_registro` datetime(6) DEFAULT NULL,
  `kilometraje` bigint NOT NULL,
  `placa` varchar(255) DEFAULT NULL,
  `id_ubicacion` bigint DEFAULT NULL,
  `id_vehiculo` bigint NOT NULL,
  PRIMARY KEY (`id_auto`),
  UNIQUE KEY `UK_dntir0w6abn734qomgkunlnam` (`placa`),
  KEY `FKatgid57obxbagxmlhlkn8pe7l` (`id_ubicacion`),
  KEY `FKdqrflu2l65sjtltxd02fqcv8x` (`id_vehiculo`),
  CONSTRAINT `FKatgid57obxbagxmlhlkn8pe7l` FOREIGN KEY (`id_ubicacion`) REFERENCES `tb_ubicacion` (`id_ubicacion`),
  CONSTRAINT `FKdqrflu2l65sjtltxd02fqcv8x` FOREIGN KEY (`id_vehiculo`) REFERENCES `tb_vehiculo` (`id_vehiculo`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_auto`
--

LOCK TABLES `tb_auto` WRITE;
/*!40000 ALTER TABLE `tb_auto` DISABLE KEYS */;
INSERT INTO `tb_auto` VALUES (1,'Gris','DISPONIBLE','2026-02-22 17:40:37.575265',38215,'ABC-412',1,1),(2,'Blanco','DISPONIBLE','2026-02-22 17:41:00.052465',21480,'BKT-903',1,2),(3,'Gris','DISPONIBLE','2026-02-22 17:41:21.318830',19870,'CXM-557',1,3),(4,'Rojo Oscuro','DISPONIBLE','2026-02-22 17:41:39.920538',46790,'DFR-228',1,4),(5,'Noche','DISPONIBLE','2026-02-22 17:42:05.908339',52340,'EPL-771',1,5),(6,'Negro','OCUPADO','2026-02-22 17:42:22.593768',55820,'FQH-660',1,6),(7,'Gris','OCUPADO','2026-02-22 17:42:38.730960',33650,'GTR-119',1,7),(8,'Plomo','DISPONIBLE','2026-02-22 17:42:57.024841',27430,'HYS-884',1,8),(9,'Negro','DISPONIBLE','2026-02-22 17:44:14.905220',44102,'TYT-598',1,1),(10,'Blanco','OCUPADO','2026-02-22 17:44:49.943658',29780,'TYO-734',1,1),(11,'Gris','DISPONIBLE','2026-02-22 17:45:13.629545',51240,'DFR-315',1,4),(12,'Blanco','DISPONIBLE','2026-02-22 17:45:37.652753',28990,'GTR-208',1,7);
/*!40000 ALTER TABLE `tb_auto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_ubicacion`
--

DROP TABLE IF EXISTS `tb_ubicacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_ubicacion` (
  `id_ubicacion` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_ubicacion`),
  UNIQUE KEY `UK_agduoqelmh0ibhmd5pyfhh0v8` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_ubicacion`
--

LOCK TABLES `tb_ubicacion` WRITE;
/*!40000 ALTER TABLE `tb_ubicacion` DISABLE KEYS */;
INSERT INTO `tb_ubicacion` VALUES (1,'Lima - Sede Central');
/*!40000 ALTER TABLE `tb_ubicacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_vehiculo`
--

DROP TABLE IF EXISTS `tb_vehiculo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_vehiculo` (
  `id_vehiculo` bigint NOT NULL AUTO_INCREMENT,
  `carroceria` varchar(255) DEFAULT NULL,
  `categoria` varchar(255) DEFAULT NULL,
  `combustible` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `marca` varchar(255) DEFAULT NULL,
  `model` varchar(255) DEFAULT NULL,
  `precio` decimal(38,2) DEFAULT NULL,
  `version` varchar(255) DEFAULT NULL,
  `year` int NOT NULL,
  PRIMARY KEY (`id_vehiculo`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_vehiculo`
--

LOCK TABLES `tb_vehiculo` WRITE;
/*!40000 ALTER TABLE `tb_vehiculo` DISABLE KEYS */;
INSERT INTO `tb_vehiculo` VALUES (1,'Sedan','AUTO','GASOLINA','Sedán confiable y económico, ideal para ciudad y viajes largos','DISPONIBLE','/Frontend/recursos/img/autos/car_toyota_corolla_1.jpg','Toyota','Corolla',25.00,'XEI CVT',2022),(2,'SUV','SUV','HIBRIDO','SUV híbrida moderna con excelente rendimiento y tecnología avanzada','DISPONIBLE','/Frontend/recursos/img/autos/car_toyota_rav4_2.jpg','Toyota','RAV4',45.00,'Adventure AWD',2023),(3,'SUV','SUV','GASOLINA','Diseño moderno y gran comodidad para viajes familiares','DISPONIBLE','/Frontend/recursos/img/autos/car_hyundai_tucson_3.jpg','Hyundai','Tucson',42.00,'GLS',2023),(4,'Sedan','AUTO','GASOLINA','Compacto eficiente, perfecto para movilidad urbana','DISPONIBLE','/Frontend/recursos/img/autos/car_kia_rio_4.jpg','Kia','Rio',22.00,'Sedan LX',2021),(5,'Pickup','CAMIONETA','DIESEL','Camioneta robusta ideal para trabajo pesado y aventuras','DISPONIBLE','/Frontend/recursos/img/autos/car_ford_ranger_5.jpg','Ford','Ranger',55.00,'XLT 4x4',2022),(6,'Hatchback','AUTO','GASOLINA','Pequeño, ágil y fácil de estacionar en la ciudad','DISPONIBLE','/Frontend/recursos/img/autos/car_chevrolet_spark_6.jpg','Chevrolet','Spark',18.00,'GT',2021),(7,'SUV','SUV','GASOLINA','Espaciosa y cómoda, ideal para viajes largos','DISPONIBLE','/Frontend/recursos/img/autos/car_nissan_x-trail_7.jpg','Nissan','X-Trail',44.00,'Exclusive',2022),(8,'Pickup','CAMIONETA','DIESEL','Camioneta potente y cómoda para trabajo y uso diario','DISPONIBLE','/Frontend/recursos/img/autos/car_volkswagen_amarok_8.jpg','Volkswagen','Amarok',58.00,'Highline 4Motion',2023);
/*!40000 ALTER TABLE `tb_vehiculo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` bigint NOT NULL AUTO_INCREMENT,
  `activo` bit(1) NOT NULL,
  `apellidos` varchar(50) NOT NULL,
  `documento` varchar(12) NOT NULL,
  `email` varchar(100) NOT NULL,
  `fecha_registro` datetime(6) NOT NULL,
  `licencia` varchar(255) NOT NULL,
  `nombres` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('CLIENTE','ADMINISTRADOR') NOT NULL,
  `telefono` varchar(9) NOT NULL,
  `id_ubicacion` bigint DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `UK_51x567hg32si9nj9gjcbabcnm` (`documento`),
  UNIQUE KEY `UK_kfsp0s1tflm1cwlj8idhqsad0` (`email`),
  KEY `FKk7nddviscadik41h34gywg6ba` (`id_ubicacion`),
  CONSTRAINT `FKk7nddviscadik41h34gywg6ba` FOREIGN KEY (`id_ubicacion`) REFERENCES `tb_ubicacion` (`id_ubicacion`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,_binary '','General','12345678','admin@rentify.com','2026-02-22 17:11:32.364910','LIC-ADMIN','Administrador','$2a$10$vh5bWFFSs1aTwQch4sblXOzWIj6uK.MNdsynsPGGJnb4jloNTSkw.','ADMINISTRADOR','999999999',NULL),(2,_binary '','Demo','87654321','cliente@rentify.com','2026-02-22 17:11:32.618362','LIC-CLIENTE','Cliente','$2a$10$bQF9AXgh6K793ODYqri7wuJqiFCR4giIJdZVHGdueK.n.YPVwDH3i','CLIENTE','988888888',NULL),(3,_binary '','Ramírez Soto','45892137','carlos.ramirez@email.com','2026-02-22 17:47:47.407031','LIC-45892137','Carlos Alberto','$2a$10$tFlxE3/65TNjP7.ILs2dCuhEBHpWa50lvNEg7W.io7l44.xXKrWNq','CLIENTE','987654321',NULL),(4,_binary '','Torres Delgado','73261485','maria.torres@email.com','2026-02-22 17:48:24.110167','LIC-73261485','María Fernanda','$2a$10$5QoivCJsmC1m7u6pfCvvz.L2z8zsmbgn3nxnZVcNO9b8ZslOxOtru','CLIENTE','976543218',NULL),(5,_binary '','Ohara Pomes','81927364','miguelohara1234@gmail.com','2026-02-22 17:50:33.165591','LIC-81927364','Miguel Harold','$2a$10$VvhkdlWJ4R42GS7YvcobweD.suZbiQex/T1TeNpqe14OV3f8XE98q','CLIENTE','965432187',NULL),(6,_binary '','Flores Fernan','676767676767','FernandoF67@gmail.com','2026-02-22 18:24:44.259954','LIC-6767676767','Fernando Fernandez','$2a$10$v.kKuaWsQHe4JkQQK1waP.uZbdDuQNzKUDVW9HwXsMkB.uMxaU7OW','CLIENTE','999677676',NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-22 18:31:43
