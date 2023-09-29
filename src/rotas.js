const express = require('express');
const { listarContas, adcionarConta, excluirConta } = require('./controladores/contas');
const validaSenha = require('./controladores/intermeriarios');

const rotas = express();

rotas.post('/contas', adcionarConta);
rotas.delete('/contas/:id', excluirConta);

rotas.use(validaSenha);
rotas.get('/contas', listarContas);


module.exports = rotas;