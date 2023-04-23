alert('entrei')
let img_btn_micro = document.getElementById('img_btn_micro'); // imagem do btn microphone
let box_msgs = document.getElementById('box_msgs'); // div que armazena os dialogos
let recognizing = false; // Seta o valor false para a variavel recognizing para fazermos a validação se iniciou a gravação
let cancel = false; // verificar se esta ligado ou desligado
let loop = false; // verificar se pode continuar gravando em loop
let transcricao_audio =  ''; // Crio a variavel que amarzenara a transcrição do audio
let interim_transcript = ''; // Defino a minha variavel interim_transcript como vazia
let synth = window.speechSynthesis; // cria o objeto de sintetizar a voz
let utterThis ; // let p/ elemento de sintetizar a voz
let voices = []; // lista com as vozes
let voice_selected = null;
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition; // cria o objeto de microphone para ouvir
var recognition = new SpeechRecognition();
let resultado; // recebera a transcrição do audio ou o interim
let frases = new Array(); // recebe o array com as opcoes de frases do banco
let txt_aia; // armazena a frase quem vem do banco, que a aia vai dizer
let elementp_bm = document.createElement("p"); // elemento paragrafo para a caixa de mensagem

const Methods = 
{
	// funcao para pegar o que foi dito, e colocar na caixa de mensagens exibindo
	dialogo: (who,txt_say) =>
	{
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
	},
	// voz da AIA, TXT = texto a ser falado, PITCH = AFINACAO, RATE = VELOCIDADE
	speak: (txt, pitch_sis, rate_sis) =>
	{
		if (pitch_sis == null || rate_sis == null) { // verifica se o pitch ou rate estao vazio, se for colocar padrao (1)
			pitch_sis = 1;
			rate_sis = 1;
		}
		Methods.endRecog(); // para de escutar, para poder apenas falar

		voices = synth.getVoices(); // recebe a lista de vozes
		if (voice_selected == null)
		{
			voices.map((v) =>
			{
				if (v.lang == "pt-BR")
					voice_selected = v;
			});
		}
	
		alert(voice_selected.name);

		if (txt !== '') { // se o texto for diferente de vazio, comeca a falar
			utterThis = new SpeechSynthesisUtterance(txt); // o objeto sintetizador recebe o texto para falr
			utterThis.onerror = function (event) { // informar caso haja erro
				// console.error('ocorreu algum erro na hora da AIA falar: ' + e || event);
			}
	
			utterThis.onstart = function (event) { // tudo deu certo, informa que esta falando
				// console.log('falando: voz da AIA');
			} // fim ta falando
	
			utterThis.voice = voice_selected; // pega a voz ( Google - brasil feminino )
			utterThis.pitch = pitch_sis; // recebe o pitch
			utterThis.rate = rate_sis; // recebe o rate
			synth.speak(utterThis); // fala
	
			utterThis.onend = function (event) { // informar quando acabar de falar
				// recognizing = false;
				Methods.startRecog(); // retorna a gravação
			}
		} // fim verifica txt diferente de vazio
	},
	// funcao para rolar a caixa de mensagem para baixo
	rolar: () =>
	{
		$('#box_msgs').scrollTop($('#box_msgs')[0].scrollHeight); // Methods.rolar( sempre para baixo a caixa de mensagem
	},
	// inicia e cancela o microfone
	iniciar: () =>
	{
		if (cancel || recognizing) { // se o cancelar e o recognizing for verdadeiro, termina de gravar
			Methods.endRecog(); // inicia a funcao para terminar de gravar
			img_btn_micro.src = "src/midia/micro_on.png"; // muda a imagem para terminar a gravacao
		} else { // se nao, comeca a gravar
			img_btn_micro.src = "src/midia/micro_off.png"; // muda a imagem para comecar a gravar
			Methods.startRecog(); // inicia a funcao para comecar a gravar
		}
	},
	// funcao para comecar a gravar
	startRecog: () =>
	{
		if (!recognizing ) { // se for diferente de vdd, entao ainda nao comecou a gravar
			recognition.start();
			recognizing = true;
			cancel = true;
			loop = true; // poem true para poder continuar gravando
			// console.log('passei pelo start, começou, loop agora é '+loop);
		}else{
			alert('erro ao começar a gravar. Tente outro navegador');
		}
	},
	// funcao para terminar a gravacao
	endRecog: () =>
	{
		if (recognizing) { // se for verdadeiro, termina a gravacao
			recognizing = false;
			cancel = false;
			loop = false; // poem false para poder parar de gravar
			recognition.stop();
		}
	},
	// funcao para demonstrar que o webkit speech não é suportado no browser
	unsupported: () =>
	{
		alert('A API de fala do Webkit não é suportada em seu navegador');
	},
	supported: () =>
	{
		recognition.lang = "pt-BR";
		// Especifico se o resultado final pode ser alterado ou não pela compreenção da api
		recognition.interimResults = false;
		/* Defino se a gravação sera continua ou não. Caso deixamos ela definida como false a gravação tera um tempo estimado de 3 a 4 segundos */
		recognition.continuous = true;
		recognition.onstart = function() {} // funcao para iniciar

		recognition.onresult = function(event) { // funcao para o resultado
			// Utilizo o for para concatenar os resultados da transcrição 
			for(let i = event.resultIndex; i < event.results.length; i++){
				// verifico se o parametro isFinal esta setado como true com isso identico se é o final captura
				if(event.results[i].isFinal){
					// concateno o resultado final da transcrição
					transcricao_audio = event.results[i][0].transcript;
				}else{
					// caso ainda não seja o resultado final vou concatenando os resultados obtidos
					interim_transcript = event.results[i][0].transcript;
				}
				// Verifico qual das variaveis não esta vazia e atribuo ela no variavel resultado
				resultado = transcricao_audio || interim_transcript;
				if ( resultado !== null ) { // se o resultado for diferente de vazio, entao entra no if

					Methods.dialogo(0,resultado); // escrever o que é p/ ser dito

					txt_aia = "Não entendi o que disse. Pode repetir? Use as frases de exemplo ou fale com meu criador.";

					resultado = resultado.toLowerCase();

					if (resultado.indexOf('banheiro') >= 0)
					{
						txt_aia = "O banheiro fica virando a esquerda, e seguindo reto, você encontrará a placa assim que chegar.";
					}
					else if (resultado.indexOf('lanchonete') >= 0)
					{
						txt_aia = "Está com fome não é mesmo ? eu ti ajudo, a lanchonete fica no lado Sul deste ambiente, você pode seguir em direção ao portão, caminhar reto até chegar na praça e então vire a direita. Então só seguir o cheiro.";
					}
					if (resultado.indexOf('quadro') >= 0)
					{
						txt_aia = "O quadro mais famoso do pintor holandês Van Gogh foi criado enquanto ele estava internado no hospital psiquiátrico de Saint-Rémy-de-Provence durante o ano de 1889. Vincent havia pedido para o irmão mais novo, Theo, interná-lo após uma série de surtos psicóticos. Não é confirmado propriamente qual o problema de saúde que acometia o artista, mas suspeita-se de bipolaridade e depressão profunda. A tela acima ilustra o nascer do sol visto da janela do quarto onde Van Gogh dormia. O trabalho apresenta alguns elementos peculiares como as espirais do céu que imprimem uma noção de profundidade e movimento. Apesar do céu caótico, o vilarejo que aparece na pintura tem ar pacato e alheio ao turbilhão exterior.";
					}
					else if (resultado.indexOf('olá') >= 0 || resultado.indexOf('ola') >= 0 || resultado.indexOf('oi') >= 0)
					{
						txt_aia = "Olá, no que posso ser útil ?";
					}
					else if (resultado.indexOf('obrigado') >= 0 || resultado.indexOf('obrigada') >= 0)
					{
						txt_aia = "De nada, qualquer coisa, só perguntar. Fique a vontade e aproveite o passeio.";
					}

					Methods.dialogo(1,txt_aia);
					Methods.speak( txt_aia,1,1 );
					Methods.rolar(); // Methods.rolar( a caixa de mensagens para baixo
					break;
					// COM BD
					// $.ajax({
						// dataType: "json",
						// url: 'src/php/dialogo.php',
						// success: function (result){
							// ----------------------------------------------------------------
							// COM BD
							// let rows = result.length; // pego o numero de linhas q o array me traz
							// let frases_0 = result[i].frase.replace(/'/g,""); // retiro a aspas simples do array das frases
							// frases = frases_0.split(','); // corto e transformo em array
							// if ( $.inArray( resultado.toUpperCase(), frases ) >= 0 ) { // se algo q estiver na frase corresponder ao dito, entao prosseguir
								// txt_aia = result[i].resposta; // recebe a resposta

								// Methods.dialogo(1,txt_aia); // escrever o que é p/ ser dito
								// Methods.speak(( txt_aia,result[i].pitch,result[i].rate ); // manda a aia falar citando o pitch e o rate vindo do bd
								// Methods.rolar(); // Methods.rolar( a caixa de mensagens para baixo
								// break; // se achou, entao para
							// } // fim if
				}
			}
		};
	},
	startTime: () =>
	{
		let today = new Date();
		let h = today.getHours();
		let m = today.getMinutes();
		let s = today.getSeconds();
		m = Methods.checkTime(m);
		s = Methods.checkTime(s);
		return h + ":" + m + ":" + s;
		let t = setTimeout(startTime, 500);
	},
	checkTime: (i) =>
	{
		if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
		return i;
	}
};

setTimeout(() => {
	/*inicia a verificacao para comecar ouvir e responder. Se o suporte ao webkitSpeechRecognition for falso, entao nao é suportado no browser*/
	if ( !('webkitSpeechRecognition' in window) ) {
		Methods.unsupported(); // inicia a funcao para não suportado
	} else { // se nao, inicia a funcao para ouvir e responder
		Methods.supported();
	}
}, 300);

// termina
recognition.onend = function(event) {
	if ( loop ) {
		recognizing = false;
		Methods.startRecog();
	}
}

// funcao para dizer o erro
recognition.onerror = function(event) {
	if ( event.error != 'no-speech') {
		Methods.endRecog(); // inicia a funcao para terminar de gravar
		img_btn_micro.src = "src/midia/micro_on.png"; // muda a imagem para terminar a gravacao
	}
}

// click para iniciar a gravação
$('#button').on('click', function()
{
	Methods.iniciar();
});