const bcrypt = require('bcrypt')
const { query } = require('../../conexao')
const jwt = require('jsonwebtoken')
const senhaJwt = require('../senhaJWT/senhaJWT')

const cadastrarUsuario = async (req, res) => {
	const { nome, email, senha } = req.body

	try {
		if (!nome || !email || !senha) {
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

const detalharUsuario = async (req, res) => {
	const tokenHeader = req.header('Autorização');

	if (!tokenHeader) {
		return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' });
	}

	const token = tokenHeader.split(' ')[1];

	if (!token) {
		return res.status(401).json({ mensagem: 'Formato de token inválido' });
	}

	jwt.verify(token, senhaJwt, async (erro, decodificado) => {
		if (erro) {
			return res.status(401).json({ mensagem: 'Token de autorização inválido' });
		}
		const usuarioId = decodificado.usuarioId;
		const usuarioQuery = 'SELECT * FROM usuarios WHERE id = $1';
		const usuario = await query(usuarioQuery, [usuarioId]);

		if (usuario.rowCount === 0) {
			return res.status(401).json({ mensagem: 'Usuário não encontrado.' });
		}

		req.usuario = usuario.rows[0];
	});
};

const atualizarUsuario = async (req, res) => {
	const { nome, email, senha } = req.body;

	try {
		if (!nome || !email || !senha) {
			return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
		}

		const emailQuery = 'SELECT * FROM usuarios WHERE email = $1 AND id <> $2';
		const emailExistente = await query(emailQuery, [email]);

		if (emailExistente.rowCount > 0) {
			return res.status(400).json({ mensagem: 'O e-mail informado já está sendo utilizado por outro usuário.' });
		}
		const senhaHash = await bcrypt.hash(senha, 10);

		const atualizarQuery = 'UPDATE usuarios SET nome = $1, email = $2, senha = $3'
		await query(atualizarQuery, [nome, email, senhaHash]);

		res.status(204).send();
	} catch (erro) {
		return res.status(500).json({ mensagem: 'Erro interno do servidor' })
	}
	const tokenHeader = req.header('Autorização');

	if (!tokenHeader) {
		return res.status(401).json({ mensagem: 'Token não fornecido' });
	}

	const token = tokenHeader.split(' ')[1];

	if (!token) {
		return res.status(401).json({ mensagem: 'Formato do token inválido' });
	}
	jwt.verify(token, senhaJwt, async (erro, decodificado) => {
		if (erro) {
			return res.status(401).json({ mensagem: 'Token de autenticação inválido' });
		}
		const idUser = decodificado.idUser;
		const queryUsuario = 'SELECT * FROM usuarios WHERE id = $1';
		const usuario = await query(queryUsuario, [idUser]);

		if (usuario.rowCount === 0) {
			return res.status(401).json({ mensagem: 'Usuário não encontrado' });
		}
	})
}

module.exports = {
	cadastrarUsuario,
	logarUsuario,
	detalharUsuario,
	atualizarUsuario
}