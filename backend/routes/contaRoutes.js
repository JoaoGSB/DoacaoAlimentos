const express = require('express');
const router = express.Router();
const contaController = require('../controllers/contaController');

// Cadastro de conta (doador ou ong)
router.post('/', contaController.cadastrar);

// Buscar conta por email
router.get('/email/:email', contaController.buscarPorEmail);

// Buscar conta por id
router.get('/:id', contaController.buscarPorId);

// Listar todas as ONGs
router.get('/ongs', contaController.listarOngs);

// Listar todos os doadores
router.get('/doadores', contaController.listarDoadores);

router.post('/login', contaController.login);


// Atualizar conta (telefone, endereço, senha)
router.put('/:id', contaController.atualizar);

// Atualizar senha (rota específica, se desejar)
router.put('/:id/senha', contaController.atualizarSenha);

module.exports = router;