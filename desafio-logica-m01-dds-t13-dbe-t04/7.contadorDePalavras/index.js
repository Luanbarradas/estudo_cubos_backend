function solucao(texto) {
    let arrayDePalavras = texto.split(' ');
    let quantidadeDePalavras = 0;
    
    for (let i = 0; i < arrayDePalavras.length; i++) {
        if (arrayDePalavras[i] !== '') {
            quantidadeDePalavras++;
        }
    }
    console.log(quantidadeDePalavras);
}


function processData(input) {
	solucao(input)
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