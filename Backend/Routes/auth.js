const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ username, email, passwordHash: hash });
    res.json({ message: 'Utilisateur créé' });
  } catch(err) { res.status(400).json({ error: err.message }); }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if(!user) return res.status(400).json({ error: "Utilisateur non trouvé" });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if(!valid) return res.status(400).json({ error: "Mot de passe incorrect" });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, username: user.username });
});

module.exports = router;