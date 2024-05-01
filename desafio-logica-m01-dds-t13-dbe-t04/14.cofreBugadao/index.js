function processData(input) {
    let palavraCubos = "cubos";
    let semEspacos = "";

    for (let letra of input) {
        if (letra !== " ") {
            semEspacos += letra;
        }
    }

    let semPrimeiroCubos = semEspacos.replace(palavraCubos, '');
    let possueCubos = [];

    for (let i = 0; i < semPrimeiroCubos.length; i++) {
        if (semPrimeiroCubos[i] === palavraCubos[possueCubos.length]) {
            possueCubos.push(semPrimeiroCubos[i]);
        }
    }

    if (possueCubos.length === palavraCubos.length) {
        console.log("SIM");
    } else {
        console.log("NAO");
    }
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