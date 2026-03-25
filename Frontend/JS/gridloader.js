// 🔹 récupérer l'ID depuis l'URL
const urlParams = new URLSearchParams(window.location.search);
const gridId = urlParams.get('id'); // "test1", "test2", etc.

if (!gridId) {
    document.getElementById('grid').textContent = "Aucune grille sélectionnée";
} else {
    fetch(`http://localhost:3000/grids/${gridId}`)
        .then(res => {
            if (!res.ok) throw new Error("Erreur serveur");
            return res.json();
        })
        .then(data => {
            // gridData et clues comme avant
            gridData = data.gridData;
            clues = data.clues;
            buildGrid();
        })
        .catch(err => console.error("Erreur fetch :", err));
}