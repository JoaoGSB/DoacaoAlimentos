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

app.use('/api/doadores', doadoresRoutes);
app.use('/api/ongs', ongsRoutes);
app.use('/api/doacoes', doacaoRoutes);
app.use('/api/contas', contaRoutes);

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

app.listen(port, () => {
  console.log(`✅ Servidor rodando em: http://localhost:${port}`);
});