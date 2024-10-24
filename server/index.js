import cors from 'cors'
import express from 'express'
import ollama from 'ollama'

const app = express()
const port = 3000

// Enable CORS
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  }),
)

// Health endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK')
})

// Get available models endpoint
app.get('/api/models', async (req, res) => {
  try {
    const models = await ollama.list()
    res.status(200).json(models)
  } catch (error) {
    console.error('Error fetching models:', error)
    res.status(500).json({
      error: 'Failed to fetch models',
      details: error.message,
    })
  }
})

// Chat endpoint
app.get('/api/chat', async (req, res) => {
  const { question, model = 'tinyllama:latest' } = req.query

  if (!question) {
    res.status(200).send('Server is running')
    return
  }

  try {
    const response = await ollama.chat({
      model: model,
      messages: [{ role: 'user', content: question }],
    })
    res.status(200).send(response.message.content)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).send('Error processing request: ' + error.message)
  }
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`)
  console.log(`Access the server at http://localhost:${port}`)
})
