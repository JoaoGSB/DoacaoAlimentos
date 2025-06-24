const db = require('../db');

// Busca dados completos da conta 
const getContaDados = async (req, res) => {
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
      cnpj: conta.cnpj,
      emailNotificacoes: conta.emailNotificacoes || false,
      smsNotificacoes: conta.smsNotificacoes || false,
      mostrarDoacoes: conta.mostrarDoacoes || false
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar dados da conta' });
  }
};

module.exports = { getContaDados };