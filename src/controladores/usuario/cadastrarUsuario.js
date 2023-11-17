const bcrypt = require('bcrypt')
const { query } = require('../../conexao')
const jwt = require('jsonwebtoken')
const senhaJwt = require('../senhaJWT/senhaJWT')

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
			return res.status(400).json({ mensagem: 'Já existe usuário cadastrado com o e-mail informado.' })
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

const logarUsuario = async (req, res) => {
	const { email, senha } = req.body

	try {
		const { rows, rowCount } = await query(
			'SELECT * FROM usuarios WHERE email = $1',
			[email]
		)

		if (rowCount === 0) {
			return res.status(400).json({ mensagem: 'Usuário e/ou senha inválido(s).' })
		}

		const { senha: senhaCriptografada, ...usuario } = rows[0]

		const senhaCorreta = await bcrypt.compare(senha, senhaCriptografada)

		if (!senhaCorreta) {
			return res.status(400).json({ mensagem: 'Usuário e/ou senha inválido(s).' })
		}

		const token = jwt.sign({ id: usuario.id, nome: usuario.nome }, senhaJwt, { expiresIn: '8h' })

		return res.status(200).json({
			usuario,
			token,
		})
	} catch (error) {
		return res.status(500).json({ mensagem: 'Erro interno do servidor' })
	}
}


module.exports = {
    cadastrarUsuario,
	logarUsuario
}