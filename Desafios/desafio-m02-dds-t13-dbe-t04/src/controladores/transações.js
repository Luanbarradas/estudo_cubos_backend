const { contas, saques, depositos, transferencias } = require('../bancodedados');
const { format } = require('date-fns');

const depositar = (req,res) => {
    const {numero_conta, valor } = req.body;

    if(!numero_conta || !valor){
        return res.status(400).json({mensagem: "O número da conta e valor são obrigatórios."});
    }

    const encontrarConta = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });

    if(!encontrarConta){
        return res.status(404).json({mensagem: "Conta não encontrada"});
    }

    if(!numero_conta){
        return res.status(404).json({mensagem: "É obrigatório informar o numero da conta"});
    }

    if(!valor){
        return res.status(404).json({mensagem: "É obrigatório informar o valor que irá depositar na conta"});
    }

    if(valor < 0){
        return res.status(400).json({mensagem: "O deposito deve ter um valor acima de zero"});
    }

    encontrarConta.saldo += valor;

    const data = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const transacao = { data, numero_conta, valor}

    depositos.push(transacao);

    return res.status(200).json({mensagem: "Deposito realizado com sucesso"});
}

const sacar = (req, res) => {
    const { numero_conta, senha, valor } = req.body;

    const encontrarConta = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });

    if(!encontrarConta){
        return res.status(404).json({mensagem: "Conta não encontrada"});
    }

    if(senha !== encontrarConta.usuario.senha){
        return res.status(404).json({mensagem: "Senha incorreta"});
    }

    if(valor > encontrarConta.saldo){
        return res.status(400).json({mensagem: "Saldo insuficiente"})
    }

    encontrarConta.saldo -= valor;

    const data = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const transacao = { data, numero_conta, valor}

    saques.push(transacao);

    return res.status(200).json({mensagem: "Saque realizado com sucesso"});
}

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino,valor, senha } = req.body;

    if(!numero_conta_origem || !numero_conta_destino || !valor || !senha){
        return res.status(404).json({mensagem: "Numero da conta origem ou destino inválido"});
    }

    const contaOrigem = contas.find((conta) =>{
        return conta.numero === Number(numero_conta_origem)
    });
    
    const contaDestino = contas.find((conta) =>{
        return conta.numero === Number(numero_conta_destino)
    });
    
    if(!contaDestino || !contaOrigem){
        return res.status(404).json({mensagem: "Destinatário ou conta de origem não encontrados"});
    }
    
    if(valor === 0){
        return res.status(400).json({mensagem: "Valor precisa ser maior do que zero."});
    }

    if(contaOrigem.saldo < valor){
        return res.status(400).json({mensagem: "Saldo insuficiente."});
    }
    
    if(contaOrigem.usuario.senha !== senha){
        return res.status(401).json({mensagem: "Senha incorreta"});
    }

    contaOrigem.saldo -= valor;
    contaDestino.saldo += valor;
    
    const data = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const transacao = { data, numero_conta_origem, numero_conta_destino, valor}
    
    transferencias.push(transacao);
    
    return res.status(200).json({mensagem: "Tranferência realizada com sucesso"});
}

const saldo = (req, res) => {
    const { numero_conta, senha } = req.query;

    const encontrarConta = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });

    if (!encontrarConta) {
        return res.status(404).json({ mensagem: "Conta não encontrada" });
    }

    if (senha !== encontrarConta.usuario.senha) {
        return res.status(401).json({ mensagem: "Senha incorreta." });
    }

    const saldoDaConta = encontrarConta.saldo;

    return res.status(200).json({ saldo: saldoDaConta });
}

const extrato = (req, res) => {
    const { numero_conta, senha } = req.query;

    if(!numero_conta || !senha){
        return res.status(403).json({mensagem: "Número da conta e senha são obrigatórios"});
    }

    const encontrarConta = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });

    if(!encontrarConta){
        return res.status(404).json({mensagem: "Conta não encontrada"});
    }

    if(senha !== encontrarConta.usuario.senha){
        return res.status(404).json({mensagem: "Senha incorreta"});
    }

    if(encontrarConta){
        return res.status(200).json({
            saques: saques,
            depositos: depositos,
            transferencias: transferencias
        });
    }
}

module.exports = {
    depositar,
    sacar,
    transferir,
    saldo,
    extrato
}