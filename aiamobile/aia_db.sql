-- phpMyAdmin SQL Dump
-- version 4.0.4.2
-- http://www.phpmyadmin.net
--
-- Máquina: localhost
-- Data de Criação: 31-Ago-2018 às 21:19
-- Versão do servidor: 5.6.13
-- versão do PHP: 5.4.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de Dados: `aia_db`
--
CREATE DATABASE IF NOT EXISTS `aia_db` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `aia_db`;

-- --------------------------------------------------------

--
-- Estrutura da tabela `brain`
--

CREATE TABLE IF NOT EXISTS `brain` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `frase` varchar(1000) NOT NULL,
  `resposta` varchar(174) NOT NULL,
  `pitch` float NOT NULL DEFAULT '1',
  `rate` float NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Extraindo dados da tabela `brain`
--

INSERT INTO `brain` (`id`, `frase`, `resposta`, `pitch`, `rate`) VALUES
(1, '''OLÁ'',''OI'', ''OLÁ AIA'', ''OLA AIA'', ''OI AIA''', 'Olá humano', 1, 1);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
