console.log('Iniciando servidor...');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas organizadas
const doadoresRoutes = require('./routes/doadoresRoutes');
const ongsRoutes = require('./routes/ongsRoutes');
const doacaoRoutes = require('./routes/doacoesRoutes');
const contaRoutes = require('./routes/contaRoutes');
const contatoRoutes = require('./routes/contatoRoutes');

// Use as rotas corretamente
app.use('/api/doadores', doadoresRoutes);
app.use('/api/ongs', ongsRoutes);
app.use('/api/doacoes', doacaoRoutes);
app.use('/api/contas', contaRoutes);
app.use(contatoRoutes); // contatoRoutes já define o caminho '/api/contato'

// Servir arquivos estáticos
app.use('/Views', express.static(path.join(__dirname, '../Views')));
app.use('/Styles', express.static(path.join(__dirname, '../Styles')));
app.use('/Scripts', express.static(path.join(__dirname, '../Scripts')));

app.get('/', (req, res) => {
  res.send('API DoaFácil rodando com sucesso!');
});

// ROTA 404 - DEVE SER SEMPRE A ÚLTIMA
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

console.log('Preparando para escutar na porta', port);

app.listen(port, () => {
  console.log(`✅ Servidor rodando em: http://localhost:${port}`);
});