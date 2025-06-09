const express = require('express');
const router = express.Router();
const contaController = require('../controllers/contaController');

// Login
router.post('/login', contaController.login);

// Buscar dados da conta por ID
router.get('/:id', contaController.getContaDados);

module.exports = router;