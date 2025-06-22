const express = require('express');
const router = express.Router();
const ongsController = require('../controllers/ongsController');

router.post('/cadastrar', ongsController.cadastrar);
router.get('/', ongsController.listar);

module.exports = router;