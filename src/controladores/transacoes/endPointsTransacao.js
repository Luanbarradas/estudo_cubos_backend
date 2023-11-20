const { query } = require('../../conexao');
const jwt = require('jsonwebtoken');
const senhaJWT = require('../senhaJWT/senhaJWT');

const cadastrarTransacao = async (req, res) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body;

    if (!descricao || !valor || !data || !categoria_id || !tipo){
        return res.status(400).json({ mensagem: "Todos os campos obrigatórios devem ser informados." })
    }

    if (tipo !== 'entrada' && tipo !== 'saida') {
        return res.status(400).json({ mensagem: "O campo 'tipo' deve ser 'entrada' ou 'saida'." });
    }

        const token = req.headers.authorization.split(' ')[1]
        const tokenUsuario = jwt.verify(token, senhaJWT);
        
    try {
        
        const categoriaExiste = await query('SELECT * FROM categorias WHERE id = $1', [categoria_id]);

        if (categoriaExiste.rows.length === 0) {
            return res.status(400).json({ mensagem: 'A categoria informada não existe.' });
        }

        const {rows} = await query(`INSERT INTO transacoes (descricao, valor, data, catagoria_id, usuario_id, tipo) values ($1, $2, $3, $4, $5, $6) returning *`, [descricao, valor, data, categoria_id, tokenUsuario.id, tipo]);

        rows[0].categoria_nome = categoriaExiste.rows[0].descricao

        return res.json(rows[0]);

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
}

const listarTransacoes = async (req, res) => {
	try {
		const { rows: transacoes } = await query(`
        select t.*, c.descricao as categoria_nome from transacoes t join categorias c on t.catagoria_id = c.id where usuario_id = $1`,
		[req.usuario.id]
		)

		return res.status(200).json(transacoes)
	} catch (error) {
        console.log(error)
		return res.status(500).json({ mensagem: 'Erro interno do servidor' })
	}
}

module.exports = {
    cadastrarTransacao,
    listarTransacoes
}