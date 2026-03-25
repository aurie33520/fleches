// grid.js
let gridData = [];
let clues = {};
let lastCell = null;

// 🔹 fonction pour créer la grille
function buildGrid() {
    console.log("buildGrid appelée !");
    const grid = document.getElementById("grid");
    grid.innerHTML = ""; // vider la grille avant reconstruction
    const gridSize = gridData[0].length;

    // créer toutes les cellules
    gridData.forEach((row, rowIndex) => {
        row.forEach((cellType, colIndex) => {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = rowIndex;
            cell.dataset.col = colIndex;

            // CASE INPUT
            if (cellType === "input") {
                cell.classList.add("input");
                const letter = document.createElement("input");
                letter.type = "text";
                letter.maxLength = 1;
                letter.classList.add("letter");
                cell.appendChild(letter);

                // focus pour stocker la cellule
                letter.addEventListener("focus", () => lastCell = cell);

                // saisie lettre
                letter.addEventListener("input", () => {
                    letter.value = letter.value.toUpperCase().replace(/[^A-Z]/g, '');
                    if (letter.value !== '') {
                        const dir = cell.dataset.direction || "right";
                        const next = getNextCell(cell, dir);
                        if (next) next.querySelector('.letter').focus();
                    }
                });

                // backspace
                letter.addEventListener("keydown", e => {
                    if (e.key === 'Backspace') {
                        e.preventDefault();
                        if (letter.value !== '') letter.value = '';
                        else {
                            const prev = getPrevCell(cell, cell.dataset.direction || "right");
                            if (prev) {
                                const prevInput = prev.querySelector('.letter');
                                prevInput.focus();
                                prevInput.value = '';
                            }
                        }
                    }
                });
            }

            // CASE CLUE / FLÈCHE
            else if (clues[cellType]) {
                cell.classList.add("arrow");
                cell.dataset.clue = cellType;

                const topLeft = document.createElement("div");
                topLeft.classList.add("top-left");

                const clue = clues[cellType];
                if (clue.up) topLeft.innerHTML += `<span class="verticalhorizontalup">${clue.up}</span>`;
                if (clue.right) topLeft.innerHTML += `<span class="horizontal">${clue.right}</span>`;
                if (clue.down) topLeft.innerHTML += `<span class="vertical">${clue.down}</span>`;
                if (clue.downright) topLeft.innerHTML += `<span class="verticalhorizontal">${clue.downright}</span>`;
                if (clue.rightdown) topLeft.innerHTML += `<span class="verticalhorizontal">${clue.rightdown}</span>`;
                if (clue.rightenbas) topLeft.innerHTML += `<span class="vertical">${clue.rightenbas}</span>`;

                cell.appendChild(topLeft);
            }

            // CASE BLOCK
            else {
                cell.classList.add("block");
                cell.textContent = cellType;
            }

            grid.appendChild(cell);
        });
    });

    // ajouter les flèches
    if (clues) {
        Object.keys(clues).forEach(clueId => {
            const clue = clues[clueId];
            const cell = document.querySelector(`.cell[data-clue="${clueId}"]`);
            if (!cell) return;
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);

            // flèches vers la droite
            if (clue.right) {
                for (let i = col + 1; i < gridSize; i++) {
                    const target = document.querySelector(`.cell[data-row="${row}"][data-col="${i}"]`);
                    if (!target) break;
                    if (target.classList.contains("input")) {
                        const arrow = document.createElement("div");
                        arrow.classList.add("arrow-indicator", "horizontal");
                        arrow.textContent = "▶";
                        target.appendChild(arrow);
                        target.dataset.direction = "right";
                        break;
                    } else if (target.classList.contains("block")) break;
                }
            }

            // flèches vers le bas
            if (clue.down) {
                for (let i = row + 1; i < gridData.length; i++) {
                    const target = document.querySelector(`.cell[data-row="${i}"][data-col="${col}"]`);
                    if (!target) break;
                    if (target.classList.contains("input")) {
                        const arrow = document.createElement("div");
                        arrow.classList.add("arrow-indicator", "vertical");
                        arrow.textContent = "▼";
                        target.appendChild(arrow);
                        target.dataset.direction = "down";
                        break;
                    } else if (target.classList.contains("block")) break;
                }
            }

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
}


// 🔹 navigation
function getNextCell(cell, dir = "right") {
    let row = parseInt(cell.dataset.row);
    let col = parseInt(cell.dataset.col);
    while (true) {
        if (dir === "right") col++;
        else if (dir === "down") row++;
        if (row >= gridData.length || col >= gridData[0].length) return null;
        const next = document.querySelector(`.input[data-row="${row}"][data-col="${col}"]`);
        if (next) return next;
    }
}

function getPrevCell(cell, dir = "right") {
    let row = parseInt(cell.dataset.row);
    let col = parseInt(cell.dataset.col);
    while (true) {
        if (dir === "right") col--;
        else if (dir === "down") row--;
        if (row < 0 || col < 0) return null;
        const prev = document.querySelector(`.input[data-row="${row}"][data-col="${col}"]`);
        if (prev) return prev;
    }
}

/*// 🔹 fetch depuis MongoDB
fetch('http://localhost:3000/grids/test1')
    .then(res => {
        if (!res.ok) throw new Error("Erreur serveur");
        return res.json();
    })
    .then(data => {
        console.log("DATA:", data);
        if (!data || !data.gridData) return console.error("Data invalide !");

        gridData = data.gridData; // contient "input", "block", ou indices
        clues = data.clues;

        buildGrid();
    })
    .catch(err => console.error("Erreur fetch :", err));*/