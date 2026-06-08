import OpenAI from "openai";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false
  }
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Nur POST erlaubt" });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {

    if (err) {
      console.error("FORM ERROR:", err);
      return res.status(500).json({ error: "Form Fehler" });
    }

    try {

      const audioFile = files.audio;

      if (!audioFile) {
        return res.status(400).json({ error: "Keine Audio Datei" });
      }

      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(audioFile.filepath),
        model: "gpt-4o-mini-transcribe",
        language: "de"
      });

      return res.status(200).json({
        transcript: transcription.text
      });

    } catch (err) {
      console.error("OPENAI ERROR:", err);

      return res.status(500).json({
        error: "Transkription fehlgeschlagen"
      });
    }
  });
}
