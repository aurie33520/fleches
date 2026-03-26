const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// FRONTEND
app.use(express.static('frontend'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(()=>console.log("MongoDB connecté"))
  .catch(err=>console.error(err));

const gridSchema = new mongoose.Schema({
  gridId: String,
  gridData: [[String]],
  clues: mongoose.Schema.Types.Mixed,
});

const Grid = mongoose.model("Grid", gridSchema);

// API
app.get('/grids/:id', async (req,res)=>{
  try{
    const grid = await Grid.findOne({gridId: req.params.id});

    res.json({
      gridData: grid.gridData,
      clues: grid.clues
    });

  }catch(err){
    console.error(err);
    res.status(500).json({error:"Erreur serveur"});
  }
});

// PORT RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Serveur lancé sur le port", PORT);
});