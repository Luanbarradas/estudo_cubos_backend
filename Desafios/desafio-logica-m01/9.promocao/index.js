function solucao(precos) {
    let itemMaisBarato = Infinity;
    let somaDosPrecos = 0;

    for(let item of precos){
        if(itemMaisBarato > item){
            itemMaisBarato = item;
        }
        somaDosPrecos += item;
    }
    if(precos.length >= 3){
        itemMaisBarato = itemMaisBarato * 0.5;
    } else {
        console.log(somaDosPrecos);
        return;
    }
    let precoFinal = somaDosPrecos - itemMaisBarato;
    console.log(precoFinal);
}


function processData(input) {
    const lista = input.split(" ");
    lista.forEach((x, i, a) => a[i] = parseInt(x, 10));
    solucao(lista);
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