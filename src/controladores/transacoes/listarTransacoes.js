const { query } = require('../../conexao')

const cadastrarTransacao = async (req, res) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body;

    if (!descricao || !valor || !data || !categoria_id || !tipo){
        return res.status(400).json({ mensagem: "Todos os campos obrigatórios devem ser informados." })
    }

    if (tipo !== 'entrada' && tipo !== 'saida') {
        return res.status(400).json({ mensagem: "O campo 'tipo' deve ser 'entrada' ou 'saida'." });
    }

    const categoriaExiste = await query('SELECT * FROM categorias WHERE id = $1', [categoria_id]);

    if (categoriaExiste.rows.length === 0) {
        return res.status(400).json({ mensagem: 'A categoria informada não existe.' });
    }

    try {
        const inserirTransacao = `
            INSERT INTO transacoes (tipo, descricao, valor, data, categoria_id, usuario_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;

        const informacoesTransacao = [tipo, descricao, valor, data, categoria_id, req.usuario.id];

        const { rows } = await query(inserirTransacao, informacoesTransacao);

        return res.status(201).json(rows[0]);

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
}

module.exports = {
    cadastrarTransacao
}