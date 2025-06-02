const Ong = require('../models/ongModel');

exports.cadastrarOng = async (req, res) => {
  const { nome, email, endereco, telefone, cnpj } = req.body;
  try {
    const resultado = await Ong.cadastrar({ nome, email, endereco, telefone, cnpj });
    res.status(201).json({ mensagem: 'ONG cadastrada com sucesso!', id: resultado.insertId });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao cadastrar ONG.' });
  }
};

exports.listarOngs = async (req, res) => {
  try {
    const ongs = await Ong.listar();
    res.status(200).json(ongs);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar ONGs.' });
  }
};
