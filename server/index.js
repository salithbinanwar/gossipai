import cors from 'cors'
import express from 'express'
import ollama from 'ollama'

const app = express()
const port = 3000
const LM = 'mrthinger/dolphin-2.9.3-qwen2-0.5b:Q2_K' // Change this to your model

// Configure CORS to allow requests from any origin during development
app.use(
  cors({
    origin: '*', // Be careful with this in production
    methods: ['GET', 'POST'],
    credentials: true,
  }),
)

app.get('/api/chat', async (req, res) => {
  const question = req.query.question
  if (!question) {
    res.status(200).send('good and running')
  } else {
    try {
      const response = await ollama.chat({
        model: LM,
        messages: [{ role: 'user', content: question }],
      })
      res.status(200).send(response.message.content)
    } catch (error) {
      console.error('Error:', error)
      res.status(500).send('Error processing request: ' + error.message)
    }
  }
})

// Listen on all network interfaces
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`)
  console.log(`Access the server at http://localhost:${port}`)
})
