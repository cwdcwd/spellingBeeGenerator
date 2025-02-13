import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import { Readable } from 'stream';
import { FormData } from 'formdata-node';
import { fileFromPath } from 'formdata-node/file-from-path';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? '';
const OPENAI_MODEL = process.env.OPENAI_S2T_MODEL ?? 'whisper-1';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const chunks: Buffer[] = [];
  const reader = req.body?.getReader();

  if (!reader) {
    return new NextResponse('No file uploaded', { status: 400 });
  }

  let done = false;
  while (!done) {
    const { value, done: doneReading } = await reader.read();
    if (value) {
      chunks.push(Buffer.from(value));
    }
    done = doneReading;
  }

  const buffer = Buffer.concat(chunks);
  const tempFilePath = '/tmp/uploaded-audio.wav';
  fs.writeFileSync(tempFilePath, buffer); 

  try {
    const response = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: OPENAI_MODEL,
    });

    fs.unlinkSync(tempFilePath); // Clean up the temporary file

    return new NextResponse(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error('Error processing audio:', error);
    return new NextResponse('Failed to process audio', { status: 500 });
  }
}