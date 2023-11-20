const { query } = require('../conexao');
const jwt = require('jsonwebtoken');
const senhaJwt = require('../controladores/senhaJWT/senhaJWT');

const validarToken = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ mensagem: 'Usuário precisa estar logado.' });
    }

    const token = authorization.split(' ')[1];

    try {

        const { id } = jwt.verify(token, senhaJwt);

        const { rows, rowCount } = await query('SELECT * FROM usuarios WHERE id = $1', [id]);

        if (rowCount < 1) {
            return res.status(401).json({ mensagem: 'Usuário não está logado' });
        }

        req.user = rows[0];

        next();
    } catch (erro) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
}

module.exports = {
    validarToken
}