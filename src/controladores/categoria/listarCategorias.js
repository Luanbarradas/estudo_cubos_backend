const { query } = require('../../conexao')

const listarCategoria = async (req, res) => {
    try {
        const categoriaQuery = 'SELECT * FROM categorias';
        const categorias = await query(categoriaQuery);

        res.status(200).json(categorias.rows);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
}

module.exports = {
    listarCategoria
}