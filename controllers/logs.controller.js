const Log = require('../models/log.model');

// Contrôleur pour récupérer les logs
const getLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 }); // tri du plus récent au plus ancien
    res.status(200).json(logs);
  } catch (error) {
    console.error('Erreur récupération logs:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des logs' });
  }
};

module.exports = { getLogs };
