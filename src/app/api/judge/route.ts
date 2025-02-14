import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? ''
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? 'o1-mini';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { transcription, word } = await req.json();
    if (!transcription || !word) {
      throw new Error('Transcription and word are required');
    }

    const prompt = `Compare the following transcription to the spelling bee word and determine if the transcription correctly matches the spelling be word and that the spelling bee word is correctly pronounced and spelled:
    Word: ${word}
    Transcription: ${transcription}
    Respond with "true" if they match and "false" if they do not.`;

    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const isMatch = response.choices?.[0]?.message?.content?.trim().toLowerCase() === 'true';

    return NextResponse.json({ isMatch });
  } catch (error) {
    console.error('Error comparing transcription:', error);
    return new NextResponse('Error comparing transcription', { status: 500 });
  }
}