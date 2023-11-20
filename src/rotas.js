const express = require('express');
const rotas = express();

const { cadastrarUsuario, logarUsuario, detalharUsuario, atualizarUsuario } = require('./controladores/usuario/endPointsDeUsuario');
const { listarCategoria } = require('./controladores/categoria/listarCategorias');
const { cadastrarTransacao } = require('./controladores/transacoes/listarTransacoes')
const { validarToken } = require('./intermediario/validarToken');

rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', logarUsuario);

rotas.use(validarToken)

rotas.get('/usuario', detalharUsuario);
rotas.put('/usuario', atualizarUsuario);

rotas.get('/categoria', listarCategoria);

rotas.post('/transacao', cadastrarTransacao);

module.exports = rotas;