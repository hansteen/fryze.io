// 1. Werkzeuge laden
require('dotenv').config(); // Lädt den Key aus der .env-Datei
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// 2. Einstellungen für den Server
app.use(cors()); // Erlaubt Ihrer HTML-Datei, mit dem Server zu reden
app.use(express.json()); // Erlaubt dem Server, JSON-Daten zu lesen

// 3. Der sichere API-Endpunkt
app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    const apiKey = process.env.OPENAI_API_KEY; // Ihr geheimer Key!

    // Hier senden wir die Anfrage an OpenAI
    const response = await fetch('https://openai.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}` // Der Key wird niemals an den Browser geschickt
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Oder ein anderes Modell Ihrer Wahl
        messages: [{ role: 'user', content: userMessage }]
      })
    });

    const data = await response.json();
    
    // Wir schicken nur die Text-Antwort zurück an die HTML-Datei
    res.json({ answer: data.choices[0].message.content });

  } catch (error) {
    console.error('Fehler:', error);
    res.status(500).json({ error: 'Etwas ist schiefgelaufen.' });
  }
});

// 4. Server starten
app.listen(PORT, () => {
  console.log(`Server läuft sicher auf http://localhost:${PORT}`);
});
