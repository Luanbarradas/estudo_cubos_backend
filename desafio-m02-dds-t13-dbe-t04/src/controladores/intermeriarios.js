const validaSenha = (req, res, next) => {
    const { senha_banco } = req.query;

    if(senha_banco !== "123") {
        return res.status(401).json({ mensagem: "Senha incorreta." });
    }

    next();
}

module.exports = validaSenha;
