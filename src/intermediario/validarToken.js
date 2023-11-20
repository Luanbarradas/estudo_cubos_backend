const { query } = require('../conexao');
const jwt = require('jsonwebtoken');
const senhaJwt = require('../controladores/senhaJWT/senhaJWT');

const validarToken = async (req, res, next) => {
    const { authorization } = req.headers;

    try {
        if (!authorization) {
            return res.status(401).json({ mensagem: 'Usuário precisa estar logado.' });
        }
        const token = authorization.split(' ')[1];

        const { id } = await jwt.verify(token, senhaJwt);
        const { rows, rowCount } = await query('SELECT * from usuarios where id = $1', [id]);
        req.user = rows[0]

        if (rowCount < 1) {
            return res.status(401).json({ mensagem: 'Usuário não está logado.' });
        }

        next();
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
};

module.exports = {
    validarToken
}