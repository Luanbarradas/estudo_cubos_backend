function solucao(jogadores) {
    let contagemZeros = 0;
    let contagemDeUm = 0;
    let indexJogadaUm = -1;
    let indexJogadaZero = -1;

    for (let jogador of jogadores) {
        if (jogador.jogada === 0) {
            contagemZeros++;
        } else if (jogador.jogada === 1) {
            contagemDeUm++;
        }
    }
    
    if (contagemDeUm === 1) {
        for (let i = 0; i < jogadores.length; i++) {
            if (jogadores[i].jogada === 1) {
                indexJogadaUm = i;
                break;
            }
        }
        console.log(jogadores[indexJogadaUm].nome);
    } else if (contagemZeros === 1) {
        for (let j = 0; j < jogadores.length; j++) {
            if (jogadores[j].jogada === 0) {
                indexJogadaZero = j;
                break;
            }
        }
        console.log(jogadores[indexJogadaZero].nome);
    } else{
    console.log("NINGUEM")   
    }
}

function processData(input) {
	solucao(JSON.parse(input));
} 

process.stdin.resume();
process.stdin.setEncoding("ascii");
_input = "";
process.stdin.on("data", function (input) {
    _input += input;
});

process.stdin.on("end", function () {
    processData(_input);
});