// routes/stats.routes.js
const express = require('express');
const { getStats } = require('../controllers/stats.controller');
const protect = require('../middlewares/auth.middleware');
const router = express.Router();

// Middleware d'auth si besoin ici

router.get('/stats', protect, getStats);

module.exports = router;
