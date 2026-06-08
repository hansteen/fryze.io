import OpenAI from "openai";

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

  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio");

    if (!audioFile) {
      return res.status(400).json({ error: "Keine Audio-Datei" });
    }

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "gpt-4o-mini-transcribe",
      language: "de"
    });

    res.status(200).json({
      transcript: transcription.text
    });

  } catch (error) {
    res.status(500).json({
      error: "Transkription fehlgeschlagen"
    });
  }
}
