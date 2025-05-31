const axios = require('axios');
const Log = require('../models/log.model');

const proxyRequest = async (req, res) => {
  const { url, disableJS, blockAds } = req.query;

  if (!url) {
    return res.status(400).json({ message: 'Paramètre url est requis' });
  }

  try {
    const response = await axios.get(url);
    let data = response.data;

    if (disableJS === 'true') {
      data = data.replace(/<script[\s\S]*?<\/script>/gi, '');
    }

    if (blockAds === 'true') {
      data = data.replace(/<iframe[\s\S]*?<\/iframe>/gi, '');
      data = data.replace(/<div[^>]*(id|class)="[^"]*ad[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');
    }

    const bandwidth = Buffer.byteLength(data, 'utf8');

    // Préparer l'objet log
    const logData = {
      url,
      ip: req.ip || req.connection.remoteAddress || '0.0.0.0', // fallback IP
      userAgent: req.headers['user-agent'] || 'unknown',
      statusCode: response.status,
      bandwidthUsed: bandwidth,
      settingsUsed: {
        disableJS: disableJS === 'true',
        blockAds: blockAds === 'true'
      }
    };

    console.log('Log à insérer :', logData);

    // Créer le log dans MongoDB
    const savedLog = await Log.create(logData);
    console.log('Log inséré avec succès :', savedLog);

    res.send(data);
  } catch (error) {
    console.error('Erreur proxy:', error.message);
    res.status(500).json({ message: 'Erreur lors de la requête proxy' });
  }
};

module.exports = { proxyRequest };
