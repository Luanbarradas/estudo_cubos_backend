const express = require('express');
const rotas = express();

const { cadastrarUsuario } = require('./controladores/usuario/cadastrarUsuario');

rotas.post('/usuario', cadastrarUsuario);

module.exports= rotas;