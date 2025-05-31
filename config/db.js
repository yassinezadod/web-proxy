const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connecté');
  } catch (err) {
    console.error('Connexion MongoDB échouée :', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
