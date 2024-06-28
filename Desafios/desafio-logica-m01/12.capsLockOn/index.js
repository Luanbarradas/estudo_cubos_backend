function processData(input) {
    if (input === input.toUpperCase() || (input.slice(0, 1) === input.slice(0, 1).toLowerCase() &&
    input.slice(1, input.length) === input.slice(1, input.length).toUpperCase())
    ) {
    if (input === input.toUpperCase()) {
        console.log(input.toLowerCase());
    } else {
        console.log(
        input[0].toUpperCase() + input.slice(1, input.length).toLowerCase()
        );
    }
    } else {
    console.log(input);
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