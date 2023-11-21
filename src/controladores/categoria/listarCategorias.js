// const { query } = require('../../conexao')

// const listarCategoria = async (req, res) => {
//     try {
//         const categoriasQuery = 'SELECT * FROM categorias';
//         const categorias = await query(categoriasQuery);

//         res.status(200).json(categorias.rows);
//     } catch (error) {
//         res.status(500).json({ mensagem: 'Erro interno no servidor' });
//     }
// };

const { query } = require('../../conexao')
const jwt = require('jsonwebtoken')
const senhaJwt = require('../senhaJWT/senhaJWT')

const listarCategoria = async (req, res, next) => {
    try {
        const categoriaQuery = 'SELECT * FROM categorias';
        const categorias = await query(categoriaQuery);

        res.status(200).json(categorias.rows);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
    const tokenHeader = req.header('Autorizacao');

    if (!tokenHeader) {
        return res.status(401).json({ mensagem: 'Token não fornecido' });
    }

    const token = tokenHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ mensagem: 'Formato de token invalido' });
    }

    jwt.verify(token, senhaJwt, async (erro, decodificado) => {
        if (erro) {
            return res.status(401).json({ mensagem: 'Token inválido' });
        }

        const usuarioId = decodificado.usuarioId;
        const usuarioQuery = 'SELECT * FROM usuarios WHERE id = $1';
        const usuario = await query(usuarioQuery, [usuarioId]);

        if (usuario.rowCount === 0) {
            return res.status(401).json({ mensagem: 'Usuario não encontrado' });
        }
        req.usuario = usuario.rows[0];
    });
};

module.exports = {
    listarCategoria
}