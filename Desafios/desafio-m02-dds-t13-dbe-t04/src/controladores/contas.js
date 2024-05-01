const { contas } = require('../bancodedados');
let idProximaConta = 1;

const listarContas = (req, res) => {
    const { senha_banco } = req.query;
    if(senha_banco !== "123"){
        return res.status(404).json({mensagem: "Senha incorreta"});
    }
    return res.status(200).json(contas);
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

    const cpfExistente = contas.find((encontrarCpf) => {
        return encontrarCpf.usuario.cpf === cpf
    });

    if (cpfExistente) {
        return res.status(404).json({ mensagem: "Já existe conta com o cpf informado." });
    }
    
    const emailExistente = contas.find((encontraEmail) => {
        return encontraEmail.usuario.email === email
    });

    if (emailExistente) {
        return res.status(404).json({ mensagem: "Já existe conta com o email informado." });
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

    contas.push(novaConta);

    return res.status(201).send();
}


const excluirConta = (req, res) => {
    const numContaExclusao = Number(req.params.id);
    
    if (isNaN(numContaExclusao)) {
        return res.status(400).json({ mensagem: "O número da conta informado não é um número válido." });
    }

    const contaExclusao = contas.findIndex((conta) =>{
        return conta.numero === numContaExclusao
    });

    if (contaExclusao < 0) {
        return res.status(404).json({ mensagem: "Conta não encontrado." });
    }

    if(contas[contaExclusao].saldo > 0){
        return res.status(400).json({mensagem: "O saldo da conta não está zerado."});
    }

    const contaExcluida = contas.splice(contaExclusao, 1)[0];

    return res.json(contaExcluida);
}

const atualizarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: "É obrigatório preencher ao menos um campo"});
    }

    const contaExistente = contas.find((conta) => {
        return conta.numero === Number(req.params.id)
    });

    if (!contaExistente) {
        return res.status(404).json({ mensagem: "Não existe conta para ser atualizada com o numero informado." });
    }

    const cpfExistente = contas.find((cpf) => {
        return cpf.usuario.cpf === cpf
    });

    if (cpfExistente) {
        return res.status(404).json({ mensagem: "Não existe conta com o cpf informado para ser atualizada." });
    }

    const emailExistente = contas.find((email) => {
        return email.usuario.email === email
    });

    if (emailExistente) {
        return res.status(404).json({ mensagem: "Não existe conta para ser atualizada com o numero informado." });
    }

    contaExistente.usuario.nome = nome;
    contaExistente.usuario.cpf = cpf;
    contaExistente.usuario.data_nascimento = data_nascimento;
    contaExistente.usuario.telefone = telefone;
    contaExistente.usuario.email = email;
    contaExistente.usuario.senha = senha;
    return res.json({ mensagem: "Conta atualizada com sucesso"});
}

module.exports = {
    listarContas,
    adcionarConta,
    excluirConta,
    atualizarConta
}
