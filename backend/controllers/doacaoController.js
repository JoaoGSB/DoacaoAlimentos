const Doacao = require('../models/doacaoModel');

exports.realizarDoacao = async (req, res) => {
  const { doador_id, ong_id, descricao, data } = req.body;
  try {
    const resultado = await Doacao.doar({ doador_id, ong_id, descricao, data });
    res.status(201).json({ mensagem: 'Doação registrada com sucesso!', id: resultado.insertId });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao registrar doação.' });
  }
};

exports.listarDoacoes = async (req, res) => {
  try {
    const doacoes = await Doacao.listar();
    res.status(200).json(doacoes);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar doações.' });
  }
};
