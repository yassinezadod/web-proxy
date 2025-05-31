const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/logout', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Non autorisé' });
  }
  try {
    const token = auth.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET);
    // Pas d'invalidation réelle côté serveur pour JWT stateless
    res.json({ message: "Déconnexion réussie" });
  } catch (err) {
    res.status(401).json({ message: 'Token invalide' });
  }
});

module.exports = router;
