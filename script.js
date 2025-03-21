window.onload = function() {
    // Imposta lo sfondo di default a sfondo1.jpg
    document.getElementById('backgroundImage').src = 'sfondo1.jpg';
};

// Gestione dei pulsanti per cambiare lo sfondo
document.querySelectorAll('.bg-btn').forEach(button => {
    button.addEventListener('click', function() {
        const image = this.getAttribute('data-image');
        document.getElementById('backgroundImage').src = image;

        // Rimuove la classe "selected" da tutti i pulsanti e aggiunge a quello cliccato
        document.querySelectorAll(".bg-btn").forEach(btn => btn.classList.remove("selected"));
        this.classList.add("selected");
    });
});

function resizeImage() {
    var image = document.getElementById("pngOverlay");
    image.style.width = "50%";  // Modifica la larghezza a 50% della larghezza del contenitore
    image.style.height = "auto";  // Mantieni la proporzione
    image.style.margin = "0 auto";  // Centro orizzontale
    image.style.display = "block";  // Rende l'immagine un elemento di blocco per centrarla
    image.style.marginTop = "20px";  // Sposta l'immagine di 20px verso il basso (puoi regolarlo)
} 

document.getElementById("checkoutButton").addEventListener("click", async function () {
    // Definizione di orderData all'interno della funzione
    const orderData = {
        tipoDiamante: document.getElementById("diamondType").value,
        caratura: document.getElementById("caratSelect").value,
        prezzo: document.getElementById("priceDisplay").textContent,
        taglio: document.querySelector(".bg-btn.selected")?.textContent || "N/A",
        immaginePersonalizzata: document.getElementById("pngOverlay").src
    };

    console.log("Dati ordine raccolti:", orderData);

    try {
        const response = await fetch("http://localhost:3000/api/send-order", { // Invia al server locale
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        });

        const data = await response.json();

        if (response.ok) {
            alert("Ordine inviato con successo!");
            console.log("Risposta dal server:", data);
        } else {
            alert("Errore nell'invio dell'ordine!");
            console.error("Errore dal server:", data);
        }
    } catch (error) {
        console.error("Errore nella richiesta:", error);
        alert("Errore nell'invio dell'ordine.");
    }
});
