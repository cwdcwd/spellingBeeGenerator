import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? '';
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? 'o1-mini';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export async function GET(req: NextRequest) {
  console.log('Generating spelling list...');
  try {
    const promptText = `
      You’re an English language expert and an expert in child education.
      Generate a 7-day schedule of spelling words in CSV format.
      Use the following age groups: 6, 9, 12, and 14.
      One word per day, per age group.
      return only the csv content
    `;

    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: 'user',
          content: promptText,
        },
      ],
    });

    let csv = response.choices?.[0]?.message?.content?.trim() || '';
    csv = csv.replace(/```csv/g, '');
    csv = csv.replace(/```/g, '');

    return new NextResponse(csv, { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Error generating spelling list.', { status: 500 });
  }
}