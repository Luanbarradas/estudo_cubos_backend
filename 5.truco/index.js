function solucao(carta) {
    if(carta === "Q"){
        console.log("J")
    } else if(carta === "J"){
        console.log("K")
    }else if(carta === "K"){
        console.log("A")
    }else if(carta === "A"){
        console.log("2")
    }else if(carta === "2"){
        console.log("3")
    }else{
        console.log("Q")
    }
}

function processData(input) {
    solucao(input);
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