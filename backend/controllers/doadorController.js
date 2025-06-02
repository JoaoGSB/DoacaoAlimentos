const Doador = require('../models/doadorModel');

exports.cadastrarDoador = (req, res) => {
  const dados = req.body;

  Doador.criar(dados, (err, resultado) => {
    if (err) {
      console.error('Erro ao cadastrar doador:', err);
      res.status(500).json({ erro: 'Erro ao cadastrar doador.' });
    } else {
      res.status(201).json({ mensagem: 'Doador cadastrado com sucesso!' });
    }
  });
};
