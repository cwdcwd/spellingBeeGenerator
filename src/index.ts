import Fastify from 'fastify'
import path from 'path'
import OpenAI from 'openai'
import fastifyStatic from '@fastify/static'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? ''
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? 'o1-mini'
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
})
// Initialize Fastify
const fastifyServer = Fastify({
  logger: true, // Optional: logs requests and errors
})

// Serve static files from the "public" folder
fastifyServer.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/', // Serve from the root path
})

// Define an endpoint to get the CSV of spelling words
fastifyServer.get('/api/spelling-list', async (request, reply) => {
  try {
    const promptText = `
      You’re an English language expert and an expert in child education.
      Generate a 7-day schedule of spelling words in CSV format.
      Use the following age groups: 6, 9, 12, and 14.
      One word per day, per age group.
      return only the csv content
    `

    // Using text-davinci-003 with createCompletion
    // Feel free to switch to ChatCompletion if needed
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      // reasoning_effort: "medium",
      messages: [
        {
          role: 'user',
          content: promptText
        }
      ],
      store: true,
      // max_tokens: 200,
      // temperature: 0.7,
    })

    let csv = response.choices?.[0]?.message?.content?.trim() || ''
    csv = csv.replace(/```csv/g, '')
    csv = csv.replace(/```/g, '')

    reply.type('text/csv').send(csv)
  } catch (error) {
    request.log.error(error)
    reply.status(500).send('Error generating spelling list.')
  }
})

// Start the server

fastifyServer.listen({ host: '::', port: PORT }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  fastifyServer.log.info(`Server listening on ${address}`)
})

export { fastifyServer }