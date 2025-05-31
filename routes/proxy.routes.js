const express = require('express');
const router = express.Router();
const { proxyRequest } = require('../controllers/proxy.controller');

router.get('/proxy', proxyRequest);

module.exports = router;
