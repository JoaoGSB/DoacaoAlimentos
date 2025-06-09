const db = require('../db');
const Doadores = require('../models/doadoresModel');

exports.cadastrar = (req, res) => {
  // Exibe os dados recebidos para depuração
  console.log('Dados recebidos para cadastro:', req.body);

  Doadores.criar(req.body, (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar doador:', err.message || err);
      return res.status(400).json({ mensagem: err.message || 'Erro ao cadastrar doador.' });
    }
    // Pega o ID do novo doador
    const idDoador = result.insertId;
    // Salva na tabela contas (agora com todos os campos)
    const { email, senha, telefone, endereco, cpf, cnpj } = req.body;
    const sqlConta = `
      INSERT INTO contas (email, senha, tipo, id_referencia, status, telefone, endereco, cpf, cnpj, criado_em)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    db.query(
      sqlConta,
      [email, senha, 'doador', idDoador, 'ativo', telefone, endereco, cpf || null, cnpj || null],
      (err2) => {
        if (err2) {
          console.error('Erro ao criar conta:', err2);
          return res.status(500).json({ mensagem: 'Erro ao criar conta.' });
        }
        res.status(201).json({ mensagem: 'Cadastro realizado com sucesso! Faça login para continuar.' });
      }
    );
  });
};

exports.listar = (req, res) => {
  Doadores.listar((err, results) => {
    if (err) {
      console.error('Erro ao buscar doadores:', err);
      return res.status(500).send('Erro ao buscar doadores.');
    }
    res.json(results);
  });
};