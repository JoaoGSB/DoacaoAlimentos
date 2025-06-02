const express = require('express');
const router = express.Router();
const ongController = require('../controllers/ongController');

router.post('/', ongController.cadastrarOng);
router.get('/', ongController.listarOngs);

module.exports = router;
