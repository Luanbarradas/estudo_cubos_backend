const express = require('express');
const rotas = express();

const { cadastrarUsuario, logarUsuario, detalharUsuario, atualizarUsuario } = require('./controladores/usuario/cadastrarUsuario');
const { listarCategoria } = require('./controladores/categoria/listarCategorias');
const { validarToken } = require('./intermediario/validarToken');

rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', logarUsuario);
rotas.get('/usuario', validarToken, detalharUsuario);
rotas.put('/usuario', validarToken, atualizarUsuario);

rotas.get('/categoria', validarToken, listarCategoria);

module.exports = rotas;