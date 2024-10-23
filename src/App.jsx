import { useEffect, useRef, useState } from 'react'
import LoadingDots from './components/LoadingDots'

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Use your computer's IP address here
      const response = await fetch(
        `http://192.168.1.101:3000/api/chat?question=${encodeURIComponent(
          input,
        )}`,
      )
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.text()
      setMessages((prev) => [...prev, { role: 'assistant', content: data }])
    } catch (error) {
      console.error('Error:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Sorry, I encountered an error. Please check if the server is running and accessible.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-md border-b border-cyan-500/20 p-4">
        <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 animate-glow">
          Gossip Ai
        </h1>
      </header>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto p-4 h-[calc(100vh-180px)] flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-gray-800">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-cyan-500/20 backdrop-blur-sm border border-cyan-500/30'
                    : 'bg-blue-500/20 backdrop-blur-sm border border-blue-500/30'
                }`}
              >
                <p className="text-white/90 whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-4 rounded-lg bg-blue-500/20 backdrop-blur-sm border border-blue-500/30">
                <LoadingDots />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="relative"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="w-full p-4 pr-24 rounded-lg bg-black/50 backdrop-blur-md border border-cyan-500/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300 placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-md hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

export default App
