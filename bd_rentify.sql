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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pago`
--

LOCK TABLES `pago` WRITE;
/*!40000 ALTER TABLE `pago` DISABLE KEYS */;
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
  `dni` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `fecha` datetime(6) DEFAULT NULL,
  `fecha_fin` datetime(6) DEFAULT NULL,
  `fecha_inicio` datetime(6) DEFAULT NULL,
  `nombres` varchar(255) DEFAULT NULL,
  `precio_total` decimal(38,2) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `id_auto` bigint NOT NULL,
  `id_usuario` bigint DEFAULT NULL,
  PRIMARY KEY (`id_reserva`),
  KEY `FKt0tc09q6acp0lcs8ss38abr7k` (`id_auto`),
  KEY `FKj8cxeodpmehovje6152y4ywqm` (`id_usuario`),
  CONSTRAINT `FKj8cxeodpmehovje6152y4ywqm` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `FKt0tc09q6acp0lcs8ss38abr7k` FOREIGN KEY (`id_auto`) REFERENCES `tb_auto` (`id_auto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reserva`
--

LOCK TABLES `reserva` WRITE;
/*!40000 ALTER TABLE `reserva` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_auto`
--

LOCK TABLES `tb_auto` WRITE;
/*!40000 ALTER TABLE `tb_auto` DISABLE KEYS */;
INSERT INTO `tb_auto` VALUES (1,'VERDE','DISPONIBLE','2026-02-17 02:09:02.099499',1020,'AWI-120',1,1),(2,'Gris','DISPONIBLE','2026-02-17 02:49:21.251942',12,'TST-120',1,1),(3,'Blanco','DISPONIBLE','2026-02-17 03:33:41.361415',23,'EST-021',1,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_vehiculo`
--

LOCK TABLES `tb_vehiculo` WRITE;
/*!40000 ALTER TABLE `tb_vehiculo` DISABLE KEYS */;
INSERT INTO `tb_vehiculo` VALUES (1,'SUV','SUV','GASOLINA','El Kia Sportage es un SUV compacto con un diseño moderno, un motor eficiente y una excelente calidad de construcción. Ofrece gran confort y tecnología como pantalla táctil y asistentes de conducción','DISPONIBLE','/Frontend/recursos/img/autos/car_kia_sportage.jpg','KIA','Sportage',60.00,'EX',2023),(2,'SEDAN','AUTO','GASOLINA','El Toyota Corolla es conocido por su fiabilidad, eficiencia de combustible y bajo costo de mantenimiento. Viene con tecnología avanzada de seguridad y una conducción cómoda','DISPONIBLE','/Frontend/recursos/img/autos/car_toyota_corolla.jpg','TOYOTA','Corolla',50.00,'XLE',2023),(3,'SEDAN','AUTO','GASOLINA','El Nissan Altima ofrece una experiencia de conducción ágil y una tecnología de seguridad avanzada. Es ideal para viajes largos gracias a su comodidad y capacidad de rendimiento','DISPONIBLE','/Frontend/recursos/img/autos/car_nissan_altima.jpg','NISSAN','Altima',55.00,'SR',2022);
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,_binary '','General','12345678','admin@rentify.com','2026-02-17 01:59:40.236699','LIC-ADMIN','Administrador','$2a$10$f3doij696XdBYxLh8CU9X.r1i.Wl88YgPsbp4FckT3EuzVLqa82bu','ADMINISTRADOR','999999999',NULL),(2,_binary '','Demo','87654321','cliente@rentify.com','2026-02-17 01:59:40.381964','LIC-CLIENTE','Cliente','$2a$10$WG/Pa0LW2i6s4AshBZKbYe6tKq6JMe/rbpIV547Davq06LUR1LJgC','CLIENTE','988888888',NULL);
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

-- Dump completed on 2026-02-17  6:17:26
