const Doacoes = require('../models/doacoesModel');

exports.cadastrar = (req, res) => {
  console.log('Dados recebidos para doação:', req.body); // Para depuração
  Doacoes.criar(req.body, (err, result) => {
    if (err) {
      console.error('Erro ao registrar doação:', err);
      return res.status(500).json({ mensagem: 'Erro ao registrar doação.' });
    }
    res.status(201).json({ mensagem: 'Doação registrada com sucesso!' });
  });
};

exports.listar = (req, res) => {
  Doacoes.listar((err, results) => {
    if (err) {
      console.error('Erro ao buscar doações:', err);
      return res.status(500).send('Erro ao buscar doações.');
    }
    res.json(results);
  });
};

exports.listarPorDoador = (req, res) => {
  const idDoador = req.params.id;
  Doacoes.listarPorDoador(idDoador, (err, results) => {
    if (err) {
      console.error('Erro ao buscar doações do doador:', err);
      return res.status(500).json({ erro: 'Erro ao buscar doações do doador.' });
    }
    res.json(results);
  });
};

exports.listarPorOng = (req, res) => {
  const idOng = req.params.id;
  Doacoes.listarPorOng(idOng, (err, results) => {
    if (err) {
      console.error('Erro ao buscar doações da ONG:', err);
      return res.status(500).json({ erro: 'Erro ao buscar doações da ONG.' });
    }
    res.json(results);
  });
};