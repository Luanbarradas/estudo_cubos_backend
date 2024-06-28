function solucao(min, km) {
    const tempoMin = 20;
    const distanciaMin = 10;

    let valorInicialMin = 50; let valorInicialKm = 70;
    let valorComDescontoMin = 30; let valorComDescontoKm = 50;
    
    let valorMinCorridaMin = valorInicialMin * min; //1000 conto - 20
    let valorMinCorridaKm = valorInicialKm * km; //700 conto - 10
    let semDescontoMin = 1000;
    let semDescontoKm = 700;
    
    let calculoMin = min - tempoMin; // min - 20;
    let calculoKm = km - distanciaMin; //km - 10;
    
    let valorDaCorrida = 0;

    if (min <= tempoMin && km <= distanciaMin) { // -20 e -10
        valorDaCorrida = valorMinCorridaMin + valorMinCorridaKm;
        console.log(Math.floor(valorDaCorrida));
    } else if (min > tempoMin && km <= distanciaMin) { // +20 e -10
        valorDaCorrida = (semDescontoMin + (calculoMin * valorComDescontoMin)) + valorMinCorridaKm;
        console.log(Math.floor(valorDaCorrida));
    } else if (min <= tempoMin && km > distanciaMin) { // -20 e +10
        valorDaCorrida = valorMinCorridaMin + (semDescontoKm + (calculoKm * valorComDescontoKm));
        console.log(Math.floor(valorDaCorrida));
    } else { // +20 e +10
        valorDaCorrida = (semDescontoMin + (calculoMin * valorComDescontoMin)) + (semDescontoKm + (calculoKm * valorComDescontoKm));
        console.log(Math.floor(valorDaCorrida));
    }
}


function processData(input) {
    const x = input.split(" ");
    const min = parseFloat(x[0], 10);
    const km = parseFloat(x[1], 10);
    solucao(min, km);
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