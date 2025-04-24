// script.js

// Questa funzione invia i dati al server backend
async function sendOrder(data) {
  try {
    const response = await fetch('http://localhost:3000/api/send-order', {  // Cambiato per inviare al backend
      method: 'POST',  // Metodo POST
      headers: {
        'Content-Type': 'application/json',  // Indica che invii i dati in formato JSON
      },
      body: JSON.stringify(data),  // Converte i dati in formato JSON
    });

    const responseData = await response.json();  // Ottieni la risposta dal backend
    console.log('Dati ricevuti dal server:', responseData);
  } catch (error) {
    console.error('Errore durante la richiesta al backend:', error);  // Gestione degli errori
  }
}

// Esempio di dati da inviare
const orderData = {
  tipoDiamante: 'Diamante1',
  caratura: 1.0,
  prezzo: '1000',
  taglio: 'C',
  immaginePersonalizzata: 'image.png',
};

// Invio dei dati al server
sendOrder(orderData);