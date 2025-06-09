const db = require('../db');
const Ongs = require('../models/ongsModel');

exports.cadastrar = (req, res) => {
  Ongs.cadastrar(req.body, (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar ONG:', err);
      return res.status(500).send('Erro ao cadastrar ONG.');
    }
    // Pega o ID da nova ONG
    const idOng = result.insertId;
    // Salva na tabela contas com telefone, endereco e cnpj
    const { email, senha, telefone, endereco, cnpj } = req.body;
    const sqlConta = 'INSERT INTO contas (email, senha, tipo, id_referencia, status, criado_em, telefone, endereco, cnpj) VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?)';
    db.query(sqlConta, [email, senha, 'ong', idOng, 'ativo', telefone, endereco, cnpj], (err2) => {
      if (err2) {
        console.error('Erro ao criar conta:', err2);
        return res.status(500).send('Erro ao criar conta.');
      }
      res.redirect('/Views/Login.html');
    });
  });
};

exports.listar = (req, res) => {
  Ongs.listar((err, results) => {
    if (err) {
      console.error('Erro ao buscar ONGs:', err);
      return res.status(500).send('Erro ao buscar ONGs.');
    }
    res.json(results);
  });
};