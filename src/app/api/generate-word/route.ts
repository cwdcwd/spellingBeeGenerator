import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai'; // Adjust the import according to your setup

const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? '';
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? 'o1-mini';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ageLevel = searchParams.get('ageLevel') || 'nine';
    const promptText = `You’re an English language expert and an expert in child education. Generate a random word for pronunciation suitable for a ${ageLevel} year old. Only one word is needed. Response should just be the word, its pronunciation, and a sentence using the word.` //then its the word "pronunciation:" followed by the phonteic sounding out of the pronunciation

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

    return NextResponse.json({ word });
  } catch (error) {
    console.error('Error generating word:', error);
    return new NextResponse('Error generating word', { status: 500 });
  }
}