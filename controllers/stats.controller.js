// controllers/stats.controller.js
const Log = require('../models/log.model');

const getStats = async (req, res) => {
  try {
    const totalRequests = await Log.countDocuments();

    const totalBandwidth = await Log.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$bandwidthUsed' }
        }
      }
    ]);

    const topUrls = await Log.aggregate([
      {
        $group: {
          _id: '$url',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      totalRequests,
      totalBandwidth: totalBandwidth[0]?.total || 0,
      topUrls
    });
  } catch (error) {
    console.error('Erreur /api/stats:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { getStats };
