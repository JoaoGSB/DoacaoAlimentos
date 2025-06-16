// 1. Importar dependências
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// 2. Rota POST para receber o formulário
router.post('/api/contato', async (req, res) => {
  const { nome, email, mensagem } = req.body;

  // 3. Validar campos
  if (!nome || !email || !mensagem) {
    return res.status(400).json({ mensagem: 'Preencha todos os campos.' });
  }

  // 4. Configurar o Nodemailer usando variáveis de ambiente
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // 5. Enviar o e-mail
  try {
    await transporter.sendMail({
      from: `"${nome}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: 'Mensagem de contato do site',
      text: mensagem,
      html: `<p><b>Nome:</b> ${nome}</p>
             <p><b>E-mail:</b> ${email}</p>
             <p><b>Mensagem:</b><br>${mensagem}</p>`
    });
    res.json({ mensagem: 'Mensagem enviada com sucesso!' });
  } catch (err) {
    console.log(err); // Mostra o erro detalhado no terminal
    res.status(500).json({ mensagem: 'Erro ao enviar mensagem.' });
  }
});

// 6. Exportar o router
module.exports = router;