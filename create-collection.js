const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/user.model');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB');

    const email = 'admin@example.com';
    const password = 'password123';

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('⚠️ Utilisateur admin déjà présent');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ email, password: hashedPassword });
    await user.save();

    console.log(`Admin créé : ${email} / ${password}`);
    process.exit(0);
  } catch (err) {
    console.error(' Erreur:', err);
    process.exit(1);
  }
}

createAdmin();
