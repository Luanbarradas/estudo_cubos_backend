const { query } = require('../../conexao')

const listarCategoria = async (req, res) => {
    try {
        const categoriasQuery = 'SELECT * FROM categorias';
        const categorias = await query(categoriasQuery);

        res.status(200).json(categorias.rows);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
}

module.exports = {
    listarCategoria
}