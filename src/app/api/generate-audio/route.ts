import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai' // Adjust the import according to your setup

const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? ''
const OPENAI_TTS_MODEL = process.env.OPENAI_TTS_MODEL ?? 'tts-1'
const OPENAI_VOICE: OpenAIVoice = (process.env.OPENAI_VOICE as OpenAIVoice) ?? 'nova';

type OpenAIVoice = 'alloy' | 'ash' | 'coral' | 'echo' | 'fable' | 'onyx' | 'nova' | 'sage' | 'shimmer';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});


export async function POST(req: NextRequest) {
  try {
    const { word } = await req.json();
    if (!word) {
      throw new Error('Word is required');
    }

    const ttsResponse = await openai.audio.speech.create({
      input: word,
      model: OPENAI_TTS_MODEL,
      voice: OPENAI_VOICE,
    });

    const audioArrayBuffer = await ttsResponse.arrayBuffer();
    const audioBuffer = Buffer.from(new Uint8Array(audioArrayBuffer));

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/wav',
      },
    });
  } catch (error) {
    console.error('Error generating audio:', error);
    return new NextResponse('Error generating audio', { status: 500 });
  }
}