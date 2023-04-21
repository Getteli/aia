<?php
	// charset
	header('Content-Type: text/html; charset=utf-8');

	// var
	$HOST = 'localhost';
	$USERNAME = 'root';
	$PASSWORD = 'usbw';
	$DATABASE = 'aia_db';
	$PORT = '3307'; // port do mysql
	define('HOST', 'localhost');
	define('USERNAME', 'root');
	define('PASSWORD', 'usbw');
	define('DATABASE', 'aia_db');
	define('PORT', '3307');

	// CONEXAO MYSQLI
	$conn = new mysqli($HOST, $USERNAME, $PASSWORD, $DATABASE, $PORT);

	// Caso algo tenha dado errado, exibe uma mensagem de erro
	if (mysqli_connect_errno()){
		// mostra o erro
		$get_erro = mysqli_connect_error();
		// echo $get_erro;
		// informe o erro em nosso email
		// send_email_erro($email_sender, "Erro de script", $get_erro, "tentativa de CONEXAO MYSQLI", "Conection");
		// header('location:error.php');
	}else{
		// charset utf8
		mysqli_set_charset($conn,"utf8");
		ini_set('default_charset', 'UTF-8');
		// echo "tudo show (y' - MYSQLI";
	}

	// echo "<br/>";

	// CONEXAO PDO
	class Conexao {
		public static $instance;  
		private function __construct() {
			//
		}
		public static function getInstance() {
			try{
				// verifica se ja nao ha outra conexao pdo
				if (!isset(self::$instance)) {
					self::$instance = new PDO('mysql:host='.HOST.';port='.PORT.';dbname='.DATABASE.'', USERNAME, PASSWORD, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
					self::$instance->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
					self::$instance->setAttribute(PDO::ATTR_ORACLE_NULLS, PDO::NULL_EMPTY_STRING);
					// echo "tudo show (y' - PDO";
				}
				// charset utf8
				ini_set('default_charset', 'UTF-8');
				return self::$instance;
			} catch(PDOException $e) {
				// mostra o erro
				$get_erro_pdo = $e->getMessage();
				// informe o erro em nosso email
				// send_email_erro($email_sender, "Erro de script", $get_erro_pdo, "tentativa de CONEXAO PDO", "Conection");
				// header('location:error.php');
			}
		}
	}
	// test conexao pdo
	// conexao::getInstance();

	/*
	Outros tipos de erro para o pdo:
	PDO::ERRMODE_SILENT
	PDO::ERRMODE_WARNING
	PDO::ERRMODE_EXCEPTION
	*/