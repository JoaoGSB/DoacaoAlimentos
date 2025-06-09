const Conta = require('../models/contaModel');
const db = require('../db');

exports.login = (req, res) => {
  const { email, senha } = req.body;
  Conta.autenticar(email, senha, (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err);
      return res.status(500).json({ mensagem: 'Erro no servidor.' });
    }
    if (results.length > 0) {
      const conta = results[0];
      res.json({
        id: conta.id,
        tipo: conta.tipo,
        nome: conta.nome,
        email: conta.email
      });
    } else {
      res.status(401).json({ mensagem: 'Usuário ou senha inválidos!' });
    }
  });
};

exports.getContaDados = async (req, res) => {
  const { id } = req.params;

  try {
    // Busca todos os dados diretamente da tabela contas
    const [contaResult] = await db.promise().query('SELECT * FROM contas WHERE id = ?', [id]);

    if (contaResult.length === 0) {
      return res.status(404).json({ erro: 'Conta não encontrada' });
    }

    const conta = contaResult[0];

    res.json({
      nome: conta.nome,
      email: conta.email,
      tipo: conta.tipo,
      status: conta.status,
      criado_em: conta.criado_em,
      telefone: conta.telefone,
      endereco: conta.endereco,
      cpf: conta.cpf,
      cnpj: conta.cnpj
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar dados da conta' });
  }
};