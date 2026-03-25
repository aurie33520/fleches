const express = require('express');
const router = express.Router();
const Grid = require('../models/Grid');

router.get('/:id', async (req, res) => {
  try {
    const grid = await Grid.findOne({ gridId: req.params.id });
    if (!grid) return res.status(404).send("Grille introuvable");
    res.json(grid);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;