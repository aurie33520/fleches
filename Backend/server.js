const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(()=>console.log("MongoDB connecté"))
  .catch(err=>console.error(err));

const gridSchema = new mongoose.Schema({
  gridId: String,
  gridData: [[String]],
  clues: mongoose.Schema.Types.Mixed,
});

const Grid = mongoose.model("Grid", gridSchema);

/*app.get('/grids/:id', async (req,res)=>{
  try{
    const grid = await Grid.findOne({gridId: req.params.id});
    if(!grid) return res.status(404).json({error:"Grille introuvable"});
    res.json({
      gridData: grid.gridData,
      clues: grid.clues
    });
  }catch(err){
    console.error(err);
    res.status(500).json({error:"Erreur serveur"});
  }
});*/

app.get('/grids/:id', async (req,res)=>{
  try{
    const grid = await Grid.findOne({gridId: req.params.id});

    console.log("GRID récupérée :", grid); // 👈 ici
    console.log("gridData :", grid.gridData);
    console.log("clues :", grid.clues);

    res.json({
      gridData: grid.gridData,
      clues: grid.clues
    });
  }catch(err){
    console.error(err);
    res.status(500).json({error:"Erreur serveur"});
  }
});

app.listen(3000, ()=>console.log("Serveur lancé sur http://localhost:3000"));

