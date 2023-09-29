const bancodedados = require('../bancodedados');
let idProximaConta = 1;

const listarContas = (req, res) => {
    return res.status(200).json(bancodedados.contas);
}


const adcionarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome) {
        return res.status(400).json({ mensagem: "O nome deve ser informado." });
    }

    if (!cpf) {
        return res.status(400).json({ mensagem: "O CPF deve ser informado." });
    }

    if (!data_nascimento) {
        return res.status(400).json({ mensagem: "A data de nascimento deve ser informada." });
    }

    if (!telefone) {
        return res.status(400).json({ mensagem: "O telefone deve ser informado." });
    }

    if (!email) {
        return res.status(400).json({ mensagem: "O email deve ser informado." });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: "A senha deve ser informada." });
    }


    const novaConta = {
            numero: idProximaConta++,
            saldo: 0,
            usuario: {
                nome,
                cpf,
                data_nascimento,
                telefone,
                email,
                senha
            }
        }

    bancodedados.contas.push(novaConta);

    return res.status(201).send();
}


const excluirConta = (req, res) => {
    const numContaExclusao = Number(req.params.id);

    if (isNaN(numContaExclusao)) {
        return res.status(400).json({ mensagem: "O número da conta informado não é um número válido." });
    }

    const contaExclusao = bancodedados.contas.findIndex((conta) =>{
        return conta.numero === numContaExclusao
    });

    if (contaExclusao < 0) {
        return res.status(404).json({ mensagem: "Conta não encontrado." })
    }

    const contaExcluida = bancodedados.contas.splice(contaExclusao, 1)[0];

    return res.json(contaExcluida);
}

module.exports = {
    listarContas,
    adcionarConta,
    excluirConta
}
