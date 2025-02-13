import { NextRequest, NextResponse } from 'next/server';
import formidable, { IncomingForm } from 'formidable';
import fs from 'fs';
import { OpenAI } from 'openai'; // Adjust the import according to your setup

const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? ''
const OPENAI_MODEL = process.env.OPENAI_S2T_MODEL ?? 'whisper-1'

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData()
    const formFile = data.get('file')
    // save formFile to disk
    const file = formFile as File
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const tempFilePath = `/tmp/uploaded-audio-${new Date().getTime()}.wav`

    fs.writeFileSync(tempFilePath, buffer)
    const fileStream = fs.createReadStream(tempFilePath)
    
    console.log('file:', file)

      if (!file) {
        return new NextResponse('No file uploaded', { status: 400 })
      }
    
      const oaiResp = await openai.audio.transcriptions.create({
        file: fileStream,
        model: OPENAI_MODEL,
      })

    return new NextResponse('Hello, world!', { status: 200 })
  } catch (error) {
    console.error('Error processing request:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
  
  // try {
  //   const [fields, files] = await form.parse()
  //   console.log('fields:', fields)

  //   const file = files.file // Adjust according to your form field name

  //   if (!file) {
  //     return new NextResponse('No file uploaded', { status: 400 })
  //   }

  //   const tempFilePath = `/tmp/uploaded-audio-${new Date().getTime()}.wav`
  //   fs.renameSync(file[0].filepath, tempFilePath)

  //   try {
  //     const response = await openai.audio.transcriptions.create({
  //       file: fs.createReadStream(tempFilePath),
  //       model: OPENAI_MODEL,
  //     })

  //     fs.unlinkSync(tempFilePath) // Clean up the temporary file

  //     return new NextResponse(JSON.stringify(response), { status: 200 })
  //   } catch (error) {
  //     console.error('Error processing audio:', error)
  //     return new NextResponse('Failed to process audio', { status: 500 })
  //   }
  // } catch (error) {
  //   console.error('Error processing request:', error)
  //   return new NextResponse('Internal server error', { status: 500 })
  // }
}