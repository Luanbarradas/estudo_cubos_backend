const bcrypt = require('bcrypt')
const { pool, query } = require('../../conexao')

const cadastrarUsuario = async (req, res) => {
	const { nome, email, senha } = req.body

	try {
        if( !nome || !email || !senha ){
            return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." })
        }

		const emailExiste = await query(
			'SELECT * FROM usuarios WHERE email = $1',
			[email]
		);

		if (emailExiste.rowCount > 0) {
			return res.status(400).json({ mensagem: 'Email já cadastrado.' })
		}

		const senhaCriptografada = await bcrypt.hash(senha, 10)

		const inserirUsuarioQuery = `
            INSERT INTO usuarios (nome, email, senha)
            VALUES ($1, $2, $3) RETURNING *
        `

		const { rows } = await query(inserirUsuarioQuery, [nome, email, senhaCriptografada])

		const { senha: _, ...usuario } = rows[0]

		return res.status(201).json(usuario)
	} catch (error) {
		return res.status(500).json({ mensagem: 'Erro interno do servidor' })
	}
}

module.exports = {
    cadastrarUsuario
}