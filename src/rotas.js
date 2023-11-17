const express = require('express');
const rotas = express();

const { cadastrarUsuario, logarUsuario } = require('./controladores/usuario/cadastrarUsuario');

rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', logarUsuario);

module.exports= rotas;