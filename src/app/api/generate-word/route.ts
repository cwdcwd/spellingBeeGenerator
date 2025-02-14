import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai'; // Adjust the import according to your setup

const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? '';
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? 'o1-mini';
const OPENAI_TTS_MODEL = process.env.OPENAI_TTS_MODEL ?? 'tts-1';

type OpenAIVoice = 'alloy' | 'ash' | 'coral' | 'echo' | 'fable' | 'onyx' | 'nova' | 'sage' | 'shimmer';

const OPENAI_VOICE: OpenAIVoice = (process.env.OPENAI_VOICE as OpenAIVoice) ?? 'coral';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export async function GET(req: NextRequest) {
  try {
    const promptText = 'Generate a random word for pronunciation.';

    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: 'user',
          content: promptText,
        },
      ],
    });

    const word = response.choices?.[0]?.message?.content?.trim() || '';
    console.log('Generated word:', word);

    const ttsResponse = await openai.audio.speech.create({
      input: word,
      model: OPENAI_TTS_MODEL,
      voice: OPENAI_VOICE,
    });

    const audioArrayBuffer = await ttsResponse.arrayBuffer()
    const audioBuffer = Buffer.from(new Uint8Array(audioArrayBuffer));

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/wav',
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse('Error generating word audio.', { status: 500 });
  }
}