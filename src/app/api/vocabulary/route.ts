import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? '';
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? 'o1-mini';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export async function GET() {
  console.log('Generating vocabulary words of the day...');
  try {
    const promptText = `
      You're an English language expert and an expert in child education.
      Generate vocabulary words of the day for different age groups with their definitions.
      
      Create 4 vocabulary words with definitions for these age groups: 6, 9, 12, and 14 years old.
      Each word should be age-appropriate and educational.
      
      Return the response in JSON format with this structure:
      {
        "6": {
          "word": "example_word",
          "definition": "A clear, simple definition suitable for a 6-year-old"
        },
        "9": {
          "word": "example_word",
          "definition": "A definition suitable for a 9-year-old"
        },
        "12": {
          "word": "example_word", 
          "definition": "A definition suitable for a 12-year-old"
        },
        "14": {
          "word": "example_word",
          "definition": "A definition suitable for a 14-year-old"
        }
      }
      
      Make sure the words increase in complexity as the age increases. Return only the JSON content.
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

    let content = response.choices?.[0]?.message?.content?.trim() || '';
    
    // Clean up any markdown formatting
    content = content.replace(/```json/g, '');
    content = content.replace(/```/g, '');
    
    // Parse and validate JSON
    try {
      const vocabularyData = JSON.parse(content);
      return NextResponse.json(vocabularyData, { status: 200 });
    } catch (parseError) {
      console.error('Error parsing JSON from OpenAI response:', parseError);
      return new NextResponse('Error parsing vocabulary data.', { status: 500 });
    }
    
  } catch (error) {
    console.error('Error generating vocabulary words:', error);
    return new NextResponse('Error generating vocabulary words.', { status: 500 });
  }
}