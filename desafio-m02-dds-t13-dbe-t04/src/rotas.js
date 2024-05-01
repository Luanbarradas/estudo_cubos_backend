const express = require('express');
// contas
const { listarContas, adcionarConta, excluirConta, atualizarConta } = require('./controladores/contas');
// transações
const { depositar, sacar, transferir, saldo, extrato } = require('./controladores/transações');
// intermediários
const validaSenha = require('./controladores/intermeriarios');

const rotas = express();

// Rotas de transações
rotas.post('/transacoes/depositar', depositar);
rotas.post('/transacoes/sacar', sacar);
rotas.post('/transacoes/transferir', transferir);

// Rotas de contas
rotas.post('/contas', adcionarConta);
rotas.delete('/contas/:id', excluirConta);
rotas.put('/contas/:id/usuario', atualizarConta);
rotas.get('/contas/saldo', saldo);
rotas.get('/contas/extrato', extrato);

rotas.use(validaSenha);
rotas.get('/contas', listarContas);


module.exports = rotas;