const gridData = [
  ["1","input","2","3","input","4","input","5","input"],
  ["input","input","input","input","input","input","input","6","input"],
  ["7","input","input","input","input","8","input","input","input"],
  ["input","input","input","input","9","input","input","input","input"],
  ["10","input","input","input","input","11","input","input","input"],
  ["input","input","input","12","input","input","input","input","input"],
  ["13","input","14","input","input","input","input","input","input"],
  ["input","input","input","input","input","input","input","15","16"],
  ["17","input","input","input","18","input","19","input","input"],
  ["input","input","input","input","input","input","input","20","input"],
  ["21","input","input","input","input","input","input","input","input"],
  ["input","22","23","input","input","input","input","input","24"],
  ["input","input","25","input","input","input","input","input","input"],
  ["26","input","input","input","input","27","input","input","input"]
];

const grid = document.getElementById("grid");
let lastCell = null;
const gridSize = gridData[0].length;

// 🔹 créer toutes les cellules
gridData.forEach((row,rowIndex)=>{
  row.forEach((cellType,colIndex)=>{
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.row = rowIndex;
    cell.dataset.col = colIndex;

    // CASE INPUT
    if(cellType === "input"){
      cell.classList.add("input");
      const letter = document.createElement("input");
      letter.type = "text";
      letter.maxLength = 1;
      letter.classList.add("letter");
      cell.appendChild(letter);

      // focus pour stocker la cellule
      letter.addEventListener("focus",()=> lastCell = cell);

      // saisie lettre
      letter.addEventListener("input",()=>{
        letter.value = letter.value.toUpperCase().replace(/[^A-Z]/g,'');
        if(letter.value !== ''){
          const dir = cell.dataset.direction || "right";
          const next = getNextCell(cell,dir);
          if(next) next.querySelector('.letter').focus();
        }
      });

      // backspace
      letter.addEventListener("keydown",e=>{
        if(e.key==='Backspace'){
          e.preventDefault();
          if(letter.value!=='') letter.value='';
          else {
            const prev = getPrevCell(cell,cell.dataset.direction || "right");
            if(prev){
              const prevInput = prev.querySelector('.letter');
              prevInput.focus();
              prevInput.value='';
            }
          }
        }
      });

    } else if(cellType==="block"){
      cell.classList.add("block");

    } else if(typeof clues!=="undefined" && clues[cellType]){
      cell.classList.add("arrow");
      cell.dataset.clue = cellType;

      // conteneur pour indices
      const topLeft = document.createElement("div");
      topLeft.classList.add("top-left");
      
      if(clues[cellType].up){
        const spanU = document.createElement("span");
        spanU.classList.add("verticalhorizontalup");
        spanU.textContent = clues[cellType].up; // indice réel
        topLeft.appendChild(spanU);
      }
      if(clues[cellType].right){
        const spanH = document.createElement("span");
        spanH.classList.add("horizontal");
        spanH.textContent = clues[cellType].right; // indice réel
        topLeft.appendChild(spanH);
      }
      if(clues[cellType].rightenbas){
          const spanHB = document.createElement("span");
          spanHB.classList.add("vertical");  // ❌ mauvaise classe
          spanHB.textContent = clues[cellType].rightenbas;
          topLeft.appendChild(spanHB);
        }
      if(clues[cellType].down){
        const spanV = document.createElement("span");
        spanV.classList.add("vertical");
        spanV.textContent = clues[cellType].down; // indice réel
        topLeft.appendChild(spanV);
      }
      if(clues[cellType].rightdown){
        const spanHV = document.createElement("span");
        spanHV.classList.add("vertical");
        spanHV.textContent = clues[cellType].rightdown; // indice réel
        topLeft.appendChild(spanHV);
      }
      if(clues[cellType].downright){
        const spanVH = document.createElement("span");
        spanVH.classList.add("vertical");
        spanVH.textContent = clues[cellType].downright; // indice réel
        topLeft.appendChild(spanVH);
      }
      
      if(topLeft.children.length>0) cell.appendChild(topLeft);
    }

    grid.appendChild(cell);
  });
});

// 🔹 ajouter les flèches
if(typeof clues!=='undefined'){
  Object.keys(clues).forEach(clueId=>{
    const clue = clues[clueId];
    const cell = document.querySelector(`.cell[data-clue="${clueId}"]`);
    if(!cell) return;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    // flèche horizontale

    if(clue.up){
      for(let r = row - 1; r >= 0; r--){
        const target = document.querySelector(`.cell[data-row="${r}"][data-col="${col}"]`);
        if(target){
          if(target.classList.contains("input")){
            if(!target.querySelector(".arrow-indicator.verticalhorizontalup")){
              const arrow = document.createElement("div");
              arrow.classList.add("arrow-indicator", "verticalhorizontalup");
              arrow.textContent = "▶"; // flèche vers le haut
              target.appendChild(arrow);
            }
            target.dataset.direction = "up"; 
            break;
          } else if(target.classList.contains("block")) break;
        }
      }
    }
    if(clue.right){
      for(let i=col+1;i<gridSize;i++){
        const target = document.querySelector(`.cell[data-row="${row}"][data-col="${i}"]`);
        if(target){
          if(target.classList.contains("input")){
            if(!target.querySelector(".arrow-indicator.horizontal")){
              const arrow = document.createElement("div");
              arrow.classList.add("arrow-indicator","horizontal");
              arrow.textContent = "▶";
              target.appendChild(arrow);
            }
            target.dataset.direction = "right"; // ajoute la direction
            break;
          } else if(target.classList.contains("block")) break;
        }
      }
    }

    if(clue.rightenbas){
      for(let i = col + 1; i < gridSize; i++){
        const target = document.querySelector(`.cell[data-row="${row}"][data-col="${i}"]`);
        if(target){
          if(target.classList.contains("input")){
            if(!target.querySelector(".arrow-indicator.horizontalbas")){
              const arrow = document.createElement("div");
              arrow.classList.add("arrow-indicator","horizontalbas");
              arrow.textContent = "▶"; // flèche vers la droite
              target.appendChild(arrow);
            }
            target.dataset.direction = "rightenbas"; // ajoute la direction
            break;
          } else if(target.classList.contains("block")) break;
        }
      }
    }

    // flèche horizontale pour un mot vers le bas
    if(clue.rightdown){
      for(let i=col+1;i<gridSize;i++){
        const target = document.querySelector(`.cell[data-row="${row}"][data-col="${i}"]`);
        if(target){
          if(target.classList.contains("input")){
            if(!target.querySelector(".arrow-indicator.horizontalVertical")){
              const arrow = document.createElement("div");
              arrow.classList.add("arrow-indicator","horizontalVertical");
              arrow.textContent = "▼";
              target.appendChild(arrow);
            }
            target.dataset.direction = "rightdown"; // ajoute la direction
            break;
          } else if(target.classList.contains("block")) break;
        }
      }
    }

    // flèche verticale
    if(clue.down){
      for(let i=row+1;i<gridData.length;i++){
        const target = document.querySelector(`.cell[data-row="${i}"][data-col="${col}"]`);
        if(target){
          if(target.classList.contains("input")){
            if(!target.querySelector(".arrow-indicator.vertical")){
              const arrow = document.createElement("div");
              arrow.classList.add("arrow-indicator","vertical");
              arrow.textContent = "▼";
              target.appendChild(arrow);
            }
            target.dataset.direction = "down"; // ajoute la direction
            break;
          } else if(target.classList.contains("block")) break;
        }
      }
    }

    // flèche verticale pour un mot vers la droite
    if(clue.downright){
      for(let i=row+1;i<gridData.length;i++){
        const target = document.querySelector(`.cell[data-row="${i}"][data-col="${col}"]`);
        if(target){
          if(target.classList.contains("input")){
            if(!target.querySelector(".arrow-indicator.verticalhorizontal")){
              const arrow = document.createElement("div");
              arrow.classList.add("arrow-indicator","verticalhorizontal");
              arrow.textContent = "▶";
              target.appendChild(arrow);
            }
            target.dataset.direction = "downright"; // ajoute la direction
            break;
          } else if(target.classList.contains("block")) break;
        }
      }
    }
  });
}

// 🔹 navigation
function getNextCell(cell,dir="right"){
  let row = parseInt(cell.dataset.row);
  let col = parseInt(cell.dataset.col);
  while(true){
    if(dir==="right") col++;
    else if(dir==="down") col++;
    if(row>=gridData.length || col>=gridSize) return null;
    const next = document.querySelector(`.input[data-row="${row}"][data-col="${col}"]`);
    if(next) return next;
  }
}

function getPrevCell(cell,dir="right"){
  let row = parseInt(cell.dataset.row);
  let col = parseInt(cell.dataset.col);
  while(true){
    if(dir==="right") col--;
    else if(dir==="down") row--;
    if(row<0 || col<0) return null;
    const prev = document.querySelector(`.input[data-row="${row}"][data-col="${col}"]`);
    if(prev) return prev;
  }
}