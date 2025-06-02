// server.js

const express = require('express');
const cors = require('cors');
const app = express();

// Defina a porta da API
const port = 3000; // ⚠️ A porta 1433 é do MySQL, para Node.js use algo como 3000

// Conexão com o banco de dados
const db = require('./db');

// Middlewares
app.use(cors());
app.use(express.json()); // Permite ler JSON do corpo das requisições

// Importar rotas
const doadorRoutes = require('./routes/doadorRoutes');
const ongRoutes = require('./routes/ongRoutes');
const doacaoRoutes = require('./routes/doacaoRoutes');

// Usar rotas
app.use('/api/doadores', doadorRoutes);
app.use('/api/ongs', ongRoutes);
app.use('/api/doacoes', doacaoRoutes);

// Rota para ver se o servidor está rodando
app.get('/', (req, res) => {
  res.send('API DoaFácil rodando com sucesso!');
});

// Rota 404 para requisições inválidas
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`✅ Servidor rodando em: http://localhost:${port}`);
});
