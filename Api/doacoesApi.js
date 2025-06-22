const db = require('../db');

// Função para buscar todas as doações com dados completos de doador e ONG
async function listarDoacoesCompletas(req, res) {
  try {
    // Filtra por id_doador se informado na query
    const { conta_id } = req.query;
    let query = `
      SELECT 
        d.id,
        d.alimento,
        d.quantidade,
        d.tipo,
        d.data_vencimento,
        d.data_doacao,
        d.status,
        d.observacoes,
        doadores.nome AS nome_doador,
        doadores.email AS email_doador,
        ongs.nome AS nome_ong,
        ongs.email AS email_ong,
        pref_doador.receber_notificacoes AS receber_notificacoes_doador,
        pref_doador.sms_notificacoes AS sms_notificacoes_doador,
        pref_ong.receber_notificacoes AS receber_notificacoes_ong,
        pref_ong.sms_notificacoes AS sms_notificacoes_ong
      FROM doacoes d
      JOIN doadores ON d.id_doador = doadores.id
      JOIN ongs ON d.id_ong = ongs.id
      LEFT JOIN preferencias pref_doador ON doadores.id = pref_doador.conta_id
      LEFT JOIN preferencias pref_ong ON ongs.id = pref_ong.conta_id
    `;
    const params = [];
    if (conta_id) {
      query += ' WHERE d.id_doador = ?';
      params.push(conta_id);
    }
    query += ' ORDER BY d.data_doacao DESC';

    const [results] = await db.promise().query(query, params);
    res.json(results);
  } catch (err) {
    console.error('Erro ao buscar doações completas:', err);
    res.status(500).json({ mensagem: 'Erro ao buscar doações.' });
  }
}

module.exports = {
  listarDoacoesCompletas
};