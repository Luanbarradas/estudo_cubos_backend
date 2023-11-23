const express = require('express');
const rotas = express();

const { cadastrarUsuario, logarUsuario, detalharUsuario, atualizarUsuario } = require('./controladores/usuario/endPointsDeUsuario');
const { listarCategoria } = require('./controladores/categoria/listarCategorias');
const { validarToken } = require('./intermediario/validarToken');
const { cadastrarTransacao, listarTransacoes, detalharTransacaoId, atualizarTransacao, deletarTransacao } = require('./controladores/transacoes/endPointsTransacao');

rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', logarUsuario);

rotas.use(validarToken);

rotas.get('/usuario', detalharUsuario);
rotas.put('/usuario', atualizarUsuario);

rotas.get('/categoria', listarCategoria);

rotas.post('/transacao', cadastrarTransacao);
rotas.get('/transacao', listarTransacoes);
rotas.get('/transacao/:id', detalharTransacaoId);
rotas.put('/transacao/:id', atualizarTransacao);
rotas.delete('/transacao/:id', deletarTransacao);

module.exports = rotas;