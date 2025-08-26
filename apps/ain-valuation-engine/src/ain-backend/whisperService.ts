import OpenAI from 'openai';
import logger from '../utils/logger.js';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
});

export async function transcribeAudio(audioBuffer: Buffer) {
  try {
    // Create a temporary file for the audio buffer
    const tempFilePath = path.join('/tmp', `audio_${Date.now()}.webm`);
    fs.writeFileSync(tempFilePath, audioBuffer);

    // Transcribe the audio
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: "whisper-1",
      language: "en", // Specify language for better accuracy
      response_format: "text"
    });

    // Clean up temporary file
    fs.unlinkSync(tempFilePath);

    return transcription;
  } catch (error) {
    logger.error('Whisper API error:', error);
    return "Audio transcription temporarily unavailable. Please try again later.";
  }
}
