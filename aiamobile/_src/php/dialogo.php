<?php
//fara a conexao com banco de dados
include_once 'connection.php';

header("Content-type: text/html; charset=utf-8");

$result  = array(); // Cria um array para armazenar mais tarde

// busca todas frases existentes no brain
$get_query = mysqli_query($conn,"SELECT id,frase,resposta,pitch,rate FROM brain");

// add tudo ao array
while ( $row = mysqli_fetch_array($get_query) ){

	$id = $row['id'];
	$frase = $row['frase'];
	$resposta = $row['resposta'];
	$pitch = $row['pitch'];
	$rate = $row['rate'];

	$result[] = array(
					"id" => $id,
					"frase" => $frase,
					"resposta" => $resposta,
					"pitch" => $pitch,
					"rate" => $rate
				);
}
// exibi o array
echo json_encode($result,JSON_UNESCAPED_UNICODE);
// sai
exit;

?>