function solucao(lista) {
    let possuiMaiores = false;
    let maioresDeIdade = [];
    let menorMaiorIdade = Infinity;
    
    for(let idade of lista){
        if(idade >= 18){
            possuiMaiores = true;
            maioresDeIdade.push(idade);
        }
    }
    for(let idade of maioresDeIdade){
        if(idade < menorMaiorIdade){
        menorMaiorIdade = idade;   
        }
    }
    if(!possuiMaiores){
        console.log("CRESCA E APARECA");
    } else {
        console.log(menorMaiorIdade)
    }
}

function processData(input) {
    //Enter your code here
    const strings = input.split(" ");
    const numeros = [];
	for(let i = 0; i < strings.length; i++) {
        numeros.push(parseInt(strings[i] ,10));
    }
    solucao(numeros);
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