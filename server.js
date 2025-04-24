import express from 'express';        // Usa 'import' per ESM
import cors from 'cors';              // Usa 'import' per ESM
import fetch from 'node-fetch';       // Usa 'import' per ESM

const app = express();

// 1) Servi i file dentro public (index, css, js, immagini)
app.use(express.static('public'));

// 2) Permetti al browser di ricevere risposte da questo server
app.use(cors());
app.use(express.json());

// Sostituisci con la tua chiave API, il tuo segreto e il tuo subdominio
const OUTSETA_API_KEY = 'be652a0a-89c2-4b7d-97f4-869fc8afe713';  // Sostituisci con la tua chiave API
const OUTSETA_SECRET_KEY = 'a72d9a14133f127b0fd36cb5a5a73779';  // Sostituisci con il tuo segreto API
const OUTSETA_SUBDOMAIN = 'laserdiamond';  // Sostituisci con il tuo subdominio Outseta

// Funzione per verificare la chiave API
async function verificaAPIKey() {
  try {
    const response = await fetch(`https://${OUTSETA_SUBDOMAIN}.outseta.com/api/v1/crm/people`, {
      method: 'GET',
      headers: {
        'Authorization': `Outseta ${OUTSETA_API_KEY}:${OUTSETA_SECRET_KEY}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.log(`Errore ${response.status}: ${response.statusText}`);
      console.log('Dettagli errore:', errorData);
      return;
    }

    const data = await response.json();
    console.log('API Key valida. Dati ricevuti:', data);
  } catch (err) {
    console.error('Errore durante la verifica della chiave API:', err);
  }
}

// Verifica la chiave API all'avvio del server
verificaAPIKey();

app.post('/api/send-order', async (req, res) => {
  try {
    const { tipoDiamante, caratura, prezzo, taglio, immaginePersonalizzata } = req.body;

    const payload = {
      Title: 'Ordine Diamante',
      UDF_tipo_diamante: tipoDiamante,
      UDF_caratura: parseFloat(caratura),
      UDF_prezzo: parseFloat(prezzo.replace(/[^0-9.]/g, '')),
      UDF_taglio: taglio,
      UDF_png_overlay: immaginePersonalizzata,
    };

    const apiRes = await fetch(
      `https://${OUTSETA_SUBDOMAIN}.outseta.com/api/v1/crm/deals`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Outseta ${OUTSETA_API_KEY}:${OUTSETA_SECRET_KEY}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await apiRes.json();
    if (!apiRes.ok) throw new Error(data.message || 'Errore API');

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Server in ascolto su http://localhost:3000'));