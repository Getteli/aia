// DECLARAÇÃO DE VARIAVEL
var img_btn_micro = document.getElementById('img_btn_micro'); // imagem do btn microphone
var box_msgs = document.getElementById('box_msgs'); // div que armazena os dialogos
var recognizing = false; // Seta o valor false para a variavel recognizing para fazermos a validação se iniciou a gravação
var cancel = false; // verificar se esta ligado ou desligado
var loop = false; // verificar se pode continuar gravando em loop
// var loopend = false; // verificar se pode continuar gravando em loop pelo onend
// var loopspeak = false; // verificar se pode continuar gravando em loop apos aia falar
var transcricao_audio =  ''; // Crio a variavel que amarzenara a transcrição do audio
var interim_transcript = ''; // Defino a minha variavel interim_transcript como vazia
var synth = window.speechSynthesis; // cria o objeto de sintetizar a voz
var utterThis ; // var p/ elemento de sintetizar a voz
var voices = []; // lista com as vozes
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition; // cria o objeto de microphone para ouvir
var recognition = new SpeechRecognition();
var resultado; // recebera a transcrição do audio ou o interim
var frases = new Array(); // recebe o array com as opcoes de frases do banco
var txt_aia; // armazena a frase quem vem do banco, que a aia vai dizer
var elementp_bm = document.createElement("p"); // elemento paragrafo para a caixa de mensagem

// funcao para pegar o que foi dito, e colocar na caixa de mensagens exibindo
function dialogo(who,txt_say) {
	elementp_bm = document.createElement("p"); // cria o elemento p
	elementp_bm.innerHTML = txt_say; // add ao html o texto
	// verifica se a fala é da AIA ou do humano ( AIA == 1, humano == 0 )
	if (who == 1) {
		// aia
		elementp_bm.classList.add('sis_bm');
		box_msgs.appendChild(elementp_bm);
	}else{
		// nos
		elementp_bm.classList.add('we_bm');
		box_msgs.appendChild(elementp_bm);
	}
} // fim funcao dialogo

// voz da AIA, TXT = texto a ser falado, PITCH = AFINACAO, RATE = VELOCIDADE
function speak(txt, pitch_sis, rate_sis){
	if (pitch_sis == null || rate_sis == null) { // verifica se o pitch ou rate estao vazio, se for colocar padrao (1)
		pitch_sis = 1;
		rate_sis = 1;
	}
	// loopspeak = true;
	endRecog(); // para de escutar, para poder apenas falar
	voices = synth.getVoices(); // recebe a lista de vozes

	if (txt !== '') { // se o texto for diferente de vazio, comeca a falar
		utterThis = new SpeechSynthesisUtterance(txt); // o objeto sintetizador recebe o texto para falr
		utterThis.onerror = function (event) { // informar caso haja erro
			// console.error('ocorreu algum erro na hora da AIA falar: ' + e || event);
			alert('erro no speak');
		}

		utterThis.onstart = function (event) { // tudo deu certo, informa que esta falando
			// console.log('falando: voz da AIA');
		} // fim ta falando

		// console.log("AIA: " + txt + ", pitch: " + pitch_sis + ", rate: " + rate_sis) // p/ teste ver o que esta sendo dito e se esta respondendo
		utterThis.voice = voices[16]; // pega a voz ( Google - brasil feminino )
		utterThis.pitch = pitch_sis; // recebe o pitch
		utterThis.rate = rate_sis; // recebe o rate
		synth.speak(utterThis); // fala

		utterThis.onend = function (event) { // informar quando acabar de falar
			// console.log('---- AIA acabou de falar ----');
			// alert('erro 0');
			// loop = true; // poem true para poder continuar gravando
			// recognizing = false;
			startRecog(); // retorna a gravação
		}
	} // fim verifica txt diferente de vazio
} // fim funcao speak

// funcao para rolar a caixa de mensagem para baixo
function rolar() {
	$('#box_msgs').scrollTop($('#box_msgs')[0].scrollHeight); // rolar sempre para baixo a caixa de mensagem
} // fim funcao rolar para baixo

// click para iniciar a gravação
$('#button').on('click', function() {
	if (cancel || recognizing) { // se o cancelar e o recognizing for verdadeiro, termina de gravar
		endRecog(); // inicia a funcao para terminar de gravar
		alert('nao escutando');
		// console.log("nao ouvindo mais - acabou a gravacao"); // info
		img_btn_micro.src = "_src/midia/micro_on.png"; // muda a imagem para terminar a gravacao
	} else { // se nao, comeca a gravar
		// console.log("cliquei em começar, ouvindo - comecou a gravacao. " + startTime()); // info
		alert('ouvindo');
		img_btn_micro.src = "_src/midia/micro_off.png"; // muda a imagem para comecar a gravar
		startRecog(); // inicia a funcao para comecar a gravar
	}
}); // fim click

// funcao para comecar a gravar
function startRecog() {
	if (!recognizing ) { // se for diferente de vdd, entao ainda nao comecou a gravar
		recognition.start();
		recognizing = true;
		cancel = true;
		loop = true; // poem true para poder continuar gravando
		// console.log('passei pelo start, começou, loop agora é '+loop);
		// alert('erro 1');
	}else{
		// console.log('nao pode iniciar o startRecog. a recognizing é ' + recognizing);
		// alert('erro 2');
	}
};

// funcao para terminar a gravacao
function endRecog() {
	if (recognizing) { // se for verdadeiro, termina a gravacao
		recognizing = false;
		cancel = false;
		// loop = false; // poem false para poder parar de gravar
		// loopend = true; // poem true para poder gravar e verificar no onend
		// console.log("loop ficou "+loop+", passei pelo endRecog");
		// alert('erro 3');
		recognition.stop();
	}
}

// funcao para demonstrar que o webkit speech não é suportado no browser
function unsupported() {
	// console.log('A API de fala do Webkit não é suportada em seu navegador'); // info
	alert('erro 4');
} // fim funcao unsupported

/*inicia a verificacao para comecar ouvir e responder. Se o suporte ao webkitSpeechRecognition for falso, entao nao é suportado no browser*/
if ( !('webkitSpeechRecognition' in window) ) {
	unsupported(); // inicia a funcao para não suportado
} else { // se nao, inicia a funcao para ouvir e responder
	// Especifico se o resultado final pode ser alterado ou não pela compreenção da api
	recognition.interimResults = false;
	/* Defino se a gravação sera continua ou não. Caso deixamos ela definida como false a gravação tera um tempo estimado de 3 a 4 segundos */
	recognition.continuous = true;
	recognition.onstart = function() {} // funcao para iniciar

	recognition.onresult = function(event) { // funcao para o resultado
		// Utilizo o for para contatenar os resultados da transcrição 
		for(var i = event.resultIndex; i < event.results.length; i++){
			// verifico se o parametro isFinal esta setado como true com isso identico se é o final captura
			if(event.results[i].isFinal){
				// Contateno o resultado final da transcrição
				transcricao_audio = event.results[i][0].transcript;
			}else{
				// caso ainda não seja o resultado final vou concatenando os resultados obtidos
				interim_transcript = event.results[i][0].transcript;
			}
			// Verifico qual das variaveis não esta vazia e atribuo ela no variavel resultado
			resultado = transcricao_audio || interim_transcript;
			// console.log("Humano: " + resultado); // p/ teste ver o que esta sendo dito e se esta respondendo
			if ( resultado !== null ) { // se o resultado for diferente de vazio, entao entra no if

				dialogo(0,resultado); // escrever o que é p/ ser dito
				// COM BD
				// $.ajax({
					// dataType: "json",
					// url: '_src/php/dialogo.php',
					// success: function (result){
						// ----------------------------------------------------------------
						// COM BD
						// var rows = result.length; // pego o numero de linhas q o array me traz
						// VERSAO DEMO
						var frases;
						var rows = 3;
						for(var i = 0; i < rows; i++){ // rodo o for ate o final do numero de linhas
							// COM BD
							// var frases_0 = result[i].frase.replace(/'/g,""); // retiro a aspas simples do array das frases
							// frases = frases_0.split(','); // corto e transformo em array
							// if ( $.inArray( resultado.toUpperCase(), frases ) >= 0 ) { // se algo q estiver na frase corresponder ao dito, entao prosseguir
								// txt_aia = result[i].resposta; // recebe a resposta

								// dialogo(1,txt_aia); // escrever o que é p/ ser dito
								// speak( txt_aia,result[i].pitch,result[i].rate ); // manda a aia falar citando o pitch e o rate vindo do bd
								// rolar(); // rolar a caixa de mensagens para baixo
								// break; // se achou, entao para
							// } // fim if
							// VERSAO DEMO
							frases1 = ['OLA','OLÁ','OI','OLÁ AIA','OLA AIA','OI AIA','oi','olá']  // corto e transformo em array
							if ( $.inArray( resultado.toUpperCase(), frases1 ) >= 0 ) {
								txt_aia = "Olá humano, em que posso ajudar?"; // recebe a resposta
								dialogo(1,txt_aia); // escrever o que é p/ ser dito
								speak( txt_aia,1,1 ); // manda a aia falar citando o pitch e o rate vindo do bd
								rolar(); // rolar a caixa de mensagens para baixo
								break;
							}else{
								txt_aia = "Não entendi o que disse. Pode repetir? Use as frases de exemplo ou fale com meu criador."; // recebe a resposta
								dialogo(1,txt_aia); // escrever o que é p/ ser dito
								speak( txt_aia,1,1 ); // manda a aia falar citando o pitch e o rate vindo do bd
								// rolar(); // rolar a caixa de mensagens para baixo
								break;
							}
						} // fim for
						// if ( !($.inArray( resultado.toUpperCase(), frases ) >= 0) ) { // se nao achar, entao da uma padrao
							// txt_aia = "Não entendi o que disse. Pode repetir?";

							// dialogo(1,txt_aia);
							// speak( txt_aia,1,1 );
							// rolar(); // rolar a caixa de mensagens para baixo
						// }// fim if
						// ----------------------------------------------------------------
					// } // fim sucess
				// }); // fim required AJAX

				// rolar(); // rolar a caixa de mensagens para baixo

			} // fim if resultado diferente de vazio
		} // fim do for
	}; // fim da funcao de onresult
} // fim else para webkitSpeechRecognition

// termina
recognition.onend = function(event) {
	console.log("acabou");
	alert('parou, end');
}

recognition.onerror = function(event) { // funcao para dizer o erro
	// if ( event.error == 'no-speech') {
	// 	console.log('continua gravando pois apenas identificou q esta sem ouvir');
	// 	alert('erro 7');
	// }else{
	// 	console.log("Ocorreu um erro: " + event.error + ". Mensagem: " + event.message + startTime());
	// 	alert('erro 8');
	// 	endRecog(); // inicia a funcao para terminar de gravar
	// 	console.log("cliquei em parar ou houve um erro - acabou a gravacao"); // info
	// 	img_btn_micro.src = "_src/midia/micro_on.png"; // muda a imagem para terminar a gravacao
	// }
	alert('parou, erro');
}