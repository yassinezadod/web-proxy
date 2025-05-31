const express = require('express');
const router = express.Router();
const { getLogs } = require('../controllers/logs.controller');
const protect = require('../middlewares/auth.middleware');

// Route protégée pour récupérer les logs
router.get('/logs',  protect, getLogs);

module.exports = router;
