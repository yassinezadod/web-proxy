const express = require('express');
const router = express.Router();
const { login, getMe } = require('../controllers/auth.controller');
const protect = require('../middlewares/auth.middleware');

router.post('/login', login);
router.get('/user/me', protect, getMe);

module.exports = router;
