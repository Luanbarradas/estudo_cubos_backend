const express = require('express');
const rotas = express();

const { cadastrarUsuario, logarUsuario, detalharUsuario, atualizarUsuario } = require('./controladores/usuario/cadastrarUsuario');
const { listarCategoria } = require('./controladores/categoria/listarCategorias');


rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', logarUsuario);
rotas.get('/usuario', detalharUsuario);
rotas.put('/usuario', atualizarUsuario);

rotas.get('/categoria', listarCategoria);

module.exports = rotas;