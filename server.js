```js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const upload = multer({
  storage: multer.memoryStorage()
});

// =================================
// Sprach-Transkription
// =================================
app.post('/api/transcribe', upload.single('audio'), async (req, res) => {

  try {

    const apiKey = process.env.OPENAI_API_KEY;

    if (!req.file) {
      return res.status(400).json({
        error: 'Keine Audio-Datei erhalten.'
      });
    }

    const formData = new FormData();

    const audioBlob = new Blob(
      [req.file.buffer],
      { type: req.file.mimetype }
    );

    formData.append(
      'file',
      audioBlob,
      'speech.webm'
    );

    formData.append(
      'model',
      'gpt-4o-mini-transcribe'
    );

    formData.append(
      'language',
      'de'
    );

    const response = await fetch(
      'https://api.openai.com/v1/audio/transcriptions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`
        },
        body: formData
      }
    );

    const data = await response.json();

    console.log('Transcript:', data.text);

    res.json({
      transcript: data.text || ''
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Transkription fehlgeschlagen.'
    });
  }
});

// =================================
// Server starten
// =================================
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
```
