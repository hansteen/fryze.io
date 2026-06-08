import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Nur POST erlaubt" });
  }

  try {

    const formData = await req.formData();
    const audio = formData.get("audio");

    if (!audio) {
      return res.status(400).json({ error: "Keine Audio-Datei" });
    }

    const transcription = await openai.audio.transcriptions.create({
      file: audio,
      model: "gpt-4o-mini-transcribe",
      language: "de"
    });

    return res.status(200).json({
      transcript: transcription.text
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Transkription fehlgeschlagen"
    });
  }
}
