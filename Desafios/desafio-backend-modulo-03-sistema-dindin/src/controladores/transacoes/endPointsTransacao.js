const { query } = require('../../conexao');
const { obterUsuarioId } = require('../../intermediario/validarToken');

const cadastrarTransacao = async (req, res) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body;

    if (!descricao || !valor || !data || !categoria_id || !tipo) {
        return res.status(400).json({ mensagem: "Todos os campos obrigatórios devem ser informados." })
    }

    if (tipo !== 'entrada' && tipo !== 'saida') {
        return res.status(400).json({ mensagem: "O campo 'tipo' deve ser 'entrada' ou 'saida'." });
    }

    const usuario_id = await obterUsuarioId(req);

    try {

        const categoriaExiste = await query('SELECT * FROM categorias WHERE id = $1', [categoria_id]);

        if (categoriaExiste.rows.length === 0) {
            return res.status(400).json({ mensagem: 'A categoria informada não existe.' });
        }

        const { rows } = await query(`INSERT INTO transacoes (descricao, valor, data, categoria_id, usuario_id, tipo) values ($1, $2, $3, $4, $5, $6) returning *`, [descricao, valor, data, categoria_id, usuario_id, tipo]);

        rows[0].categoria_nome = categoriaExiste.rows[0].descricao

        return res.json(rows[0]);

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
}

const listarTransacoes = async (req, res) => {
    try {
        const { rows: transacoes } = await query(`
        select t.*, c.descricao as categoria_nome from transacoes t join categorias c on t.categoria_id = c.id where usuario_id = $1`,
        [req.user.id]
        )

        return res.status(200).json(transacoes)
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}

const detalharTransacaoId = async (req, res) => {
    const { id } = req.params;

    try {
        const usuario_id = await obterUsuarioId(req);

        const transacaoQuery = await query(
            `SELECT t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao as categoria_nome
            FROM transacoes t JOIN categorias c ON t.categoria_id = c.id 
            WHERE t.usuario_id = $1 AND t.id = $2`, [usuario_id, id]);

        if (transacaoQuery.rowCount < 1) {
            return res.status(404).json({ mensagem: 'Transação não encontrada.' });
        }
        
        return res.status(200).json(transacaoQuery.rows[0]);
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno de servidor.' });
    }
}

const atualizarTransacao = async (req, res) => {
	const { descricao, valor, data, categoria_id, tipo } = req.body;
    const { id } = req.params;

	try {
		if (!descricao || !valor || !data || !categoria_id || !tipo) {
			return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." })
		}

        if (tipo !== 'entrada' && tipo !== 'saida') {
            return res.status(400).json({ mensagem: "O campo 'tipo' deve ser 'entrada' ou 'saida'." });
        }

		const usuario_id = await obterUsuarioId(req);

        const { rowCount } = await query(
			'SELECT * FROM transacoes WHERE id = $1 and usuario_id = $2',
			[id, usuario_id]
		)

		if (rowCount === 0) {
			return res.status(404).json({ mensagem: 'Transação não encontrada.' })
		}

		await query('UPDATE transacoes SET descricao =$1, valor =$2, data = $3, categoria_id = $4, tipo = $5 WHERE id = $6 and usuario_id = $7', [descricao, valor, data, categoria_id, tipo, id, usuario_id]);

		return res.status(204).send()
	} catch (error) {
		return res.status(500).json({ message: 'Erro interno de servidor.' })
	}
}

const deletarTransacao = async (req, res) => {
	const { id } = req.params

	try {
		const usuario_id = await obterUsuarioId(req);

		const rowCount = await query(
			'SELECT  id, descricao, valor, data, tipo from transacoes WHERE id = $1 and usuario_id = $2',
			[id, usuario_id]
		)

		if (rowCount === 0) {
			return res.status(404).json({ mensagem: 'Transação não encontrada.' })
		}

		await query('DELETE FROM transacoes WHERE id = $1', [id])

		return res.status(204).send()
	} catch (error) {
		return res.status(500).json({ mensagem: 'Erro interno do servidor' })
	}
}

const extratoTransacoes = async (req, res) => {
    try {
        const usuario_id = await obterUsuarioId(req);

        const consultaEntradas = 'SELECT COALESCE(SUM(valor), 0) as entrada FROM transacoes WHERE usuario_id = $1 AND tipo = $2';

        const resultadoEntradas = await query(consultaEntradas, [usuario_id, 'entrada']);

        const entrada = resultadoEntradas.rows[0].entrada;


        const consultaSaidas = 'SELECT COALESCE(SUM(valor), 0) as saida FROM transacoes WHERE usuario_id = $1 AND tipo = $2';

        const resultadoSaidas = await query(consultaSaidas, [usuario_id, 'saida']);

        const saida = resultadoSaidas.rows[0].saida;

        res.status(200).json({ entrada, saida });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
}

module.exports = {
    cadastrarTransacao,
    listarTransacoes,
    detalharTransacaoId,
    atualizarTransacao,
    deletarTransacao,
    extratoTransacoes
}