const express = require("express");
const cors = require("cors");
// Rimuovi la riga seguente, non serve con Node.js v18+
// const fetch = require("node-fetch");

const app = express();
app.use(express.json());
app.use(cors()); // Permette richieste da qualsiasi origine

const OUTSETA_API_KEY = "be652a0a-89c2-4b7d-97f4-869fc8afe713"; // La tua API Key

app.post("/api/send-order", async (req, res) => {
    try {
        console.log("Dati ricevuti dal frontend:", req.body);

        if (!req.body.tipoDiamante || !req.body.caratura || !req.body.prezzo) {
            throw new Error("Dati mancanti nell'ordine");
        }

        const response = await fetch("https://app.outseta.com/api/v1/crm/deals", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OUTSETA_API_KEY}`
            },
            body: JSON.stringify({
                Name: `Ordine ${req.body.tipoDiamante} - ${req.body.caratura}ct`,
                Description: `Taglio: ${req.body.taglio}\nPrezzo: ${req.body.prezzo}\nImmagine Personalizzata: ${req.body.immaginePersonalizzata}`,
                DealValue: parseFloat(req.body.prezzo.replace("€", "").replace(".", "").replace(",", ".")) || 0,
                Stage: "New",
                CustomFields: {
                    TipoDiamante: req.body.tipoDiamante,
                    Caratura: req.body.caratura,
                    Taglio: req.body.taglio,
                    ImmagineURL: req.body.immaginePersonalizzata
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Errore Outseta: ${response.statusText}`);
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("Errore nel server:", error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server in esecuzione su http://localhost:${PORT}`);
});

