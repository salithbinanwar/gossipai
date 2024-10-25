import { useEffect, useRef, useState } from 'react'
import { FiSettings, FiTrash2, FiUserX, FiX } from 'react-icons/fi'
import ConfigSettings from './components/ConfigSettings'
import ConnectionStatus from './components/ConnectionStatus'
import Footer from './components/Footer'
import LoadingDots from './components/LoadingDots'
import StreamingText from './components/StreamingText'
import { DEFAULT_SERVER } from './utils/constants'

function App() {
  // Add latestMessageId state
  const [latestMessageId, setLatestMessageId] = useState(null)
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatMessages')
    return savedMessages ? JSON.parse(savedMessages) : []
  })
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [serverIP, setServerIP] = useState(
    () => localStorage.getItem('serverIP') || DEFAULT_SERVER,
  )
  const [modelName, setModelName] = useState(
    () => localStorage.getItem('modelName') || 'tinyllama:latest',
  )
  const [modelParams, setModelParams] = useState(() => {
    const saved = localStorage.getItem('modelParams')
    return saved
      ? JSON.parse(saved)
      : {
          temperature: 0.85,
          top_k: 70,
          top_p: 0.9,
          repeat_penalty: 1.1,
          presence_penalty: 0.5,
          frequency_penalty: 0.5,
          mirostat: 2,
          mirostat_tau: 5,
          mirostat_eta: 0.1,
        }
  })
  const [aiPersonality, setAiPersonality] = useState(() => {
    const saved = localStorage.getItem('aiPersonality')
    return saved ? JSON.parse(saved) : { name: '', role: '' }
  })
  const [sessionId] = useState(() => {
    const saved = localStorage.getItem('chatSessionId')
    return saved || Math.random().toString(36).substring(7)
  })
  const chatContainerRef = useRef(null)
  const messagesEndRef = useRef(null)
  const scrollTimeout = useRef(null)

  const handleInputFocus = () => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current
      container.scrollTop = container.scrollHeight - container.clientHeight
    }
  }

  // Enhanced scroll function
  const scrollToBottom = (smooth = true) => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current)
    }
    scrollTimeout.current = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'end',
      })
    }, 100)
  }

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom()
    }
    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }
    }
  }, [messages]) //done

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages))
    localStorage.setItem('serverIP', serverIP)
    localStorage.setItem('modelName', modelName)
    localStorage.setItem('chatSessionId', sessionId)
    localStorage.setItem('aiPersonality', JSON.stringify(aiPersonality))
    localStorage.setItem('modelParams', JSON.stringify(modelParams))
  }, [messages, serverIP, modelName, sessionId, aiPersonality, modelParams])

  const clearChatHistory = async () => {
    try {
      await fetch(`${serverIP}/api/clear?sessionId=${sessionId}`, {
        method: 'POST',
      })
      setMessages([])
      localStorage.removeItem('chatMessages')
      setIsSettingsOpen(false)
    } catch (error) {
      console.error('Error clearing chat history:', error)
    }
  }

  const clearAiPersonality = () => {
    try {
      const newPersonality = { name: '', role: '' }
      setAiPersonality(newPersonality)
      localStorage.setItem('aiPersonality', JSON.stringify(newPersonality))
      clearChatHistory()
    } catch (error) {
      console.error('Error clearing AI personality:', error)
    }
  }

  const handleConfigSave = ({
    serverIP: newIP,
    modelName: newModel,
    personality,
    modelParams: newParams,
  }) => {
    setServerIP(newIP)
    setModelName(newModel)
    if (personality) {
      setAiPersonality(personality)
    }
    if (newParams) {
      setModelParams(newParams)
    }
    setIsSettingsOpen(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessageId = Date.now()
    const userMessage = { role: 'user', content: input, id: userMessageId }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    scrollToBottom(false)

    try {
      const queryParams = new URLSearchParams({
        question: input,
        sessionId: sessionId,
        model: modelName,
        personality: JSON.stringify(aiPersonality),
        params: JSON.stringify(modelParams),
      })
      const response = await fetch(`${serverIP}/api/chat?${queryParams}`)
      if (!response.ok) throw new Error('Network response was not ok')
      const data = await response.text()
      const newMessageId = Date.now()
      setLatestMessageId(newMessageId)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data, id: newMessageId },
      ])
    } catch (error) {
      console.error('Error:', error)
      const errorMessageId = Date.now()
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Sorry, I encountered an error. Please check if the server is running and accessible.',
          id: errorMessageId,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const getMessageDisplay = (message) => {
    if (message.role === 'assistant') {
      return (
        <StreamingText
          content={message.content}
          aiName={aiPersonality.name}
          isNewMessage={message.id === latestMessageId}
        />
      )
    }
    return (
      <p className="text-white/90 whitespace-pre-wrap text-sm md:text-base">
        {message.content}
      </p>
    )
  }

  // Rest of your JSX remains the same, but update the message mapping:
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/70 backdrop-blur-lg border-b border-cyan-500/20 px-4 py-3 shadow-lg">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse">
            {aiPersonality.name ? aiPersonality.name : 'Gossip AI'}
          </h1>
          <div className="flex items-center gap-3">
            <ConnectionStatus />
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-full hover:bg-gray-800/50 transition-all duration-200 text-cyan-400 hover:text-cyan-300"
            >
              <FiSettings className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl border border-cyan-500/20 p-6 max-w-md w-full shadow-xl transform transition-all max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-cyan-400">Settings</h2>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 rounded-full hover:bg-gray-800/50 transition-all duration-200 text-gray-400 hover:text-white"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-6">
              <ConfigSettings
                serverIP={serverIP}
                modelName={modelName}
                aiPersonality={aiPersonality}
                modelParams={modelParams}
                onSave={handleConfigSave}
              />
            </div>
            <div className="border-t border-gray-800 pt-6 space-y-4">
              {(aiPersonality.name || aiPersonality.role) && (
                <div>
                  <button
                    onClick={clearAiPersonality}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg
                    bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 hover:border-orange-500/30
                    text-orange-400 hover:text-orange-300 transition-all duration-200 group"
                  >
                    <FiUserX className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    Clear AI Role
                  </button>
                  <p className="text-sm text-gray-400 mt-2">
                    This will reset the AI's personality and clear chat history.
                  </p>
                </div>
              )}
              <div>
                <button
                  onClick={clearChatHistory}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg
                  bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30
                  text-red-400 hover:text-red-300 transition-all duration-200 group"
                >
                  <FiTrash2 className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  Clear Chat History
                </button>
                <p className="text-sm text-gray-400 mt-2">
                  This action cannot be undone. All chat history will be
                  permanently deleted.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Container */}
      <div className="max-w-3xl mx-auto p-3 md:p-4 h-[calc(100vh-140px)] flex flex-col">
        <div
          className={`flex-1 mb-3 ${
            messages.length > 0 ? 'overflow-y-auto' : 'overflow-hidden'
          } space-y-3 scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-gray-800`}
        >
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-400 text-center px-4">
                {aiPersonality.name
                  ? `Start a conversation with ${aiPersonality.name}!`
                  : 'No messages yet. Start a conversation!'}
              </p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id || Date.now()}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[75%] p-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-cyan-500/20 backdrop-blur-sm border border-cyan-500/30 rounded-tr-none'
                        : 'bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-tl-none'
                    } transform transition-all duration-200 hover:scale-[1.02]`}
                  >
                    {getMessageDisplay(message)}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] md:max-w-[75%] p-3 rounded-2xl bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-tl-none">
                    <LoadingDots />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="relative mt-auto"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={handleInputFocus}
            placeholder={`Message ${aiPersonality.name || 'Gossip AI'}...`}
            className="w-full p-3 md:p-4 pr-16 rounded-full bg-black/50 backdrop-blur-md border border-cyan-500/30
    focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none
    transition-all duration-300 placeholder-gray-400 text-sm md:text-base"
          />

          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative p-2 md:p-3 rounded-full overflow-hidden transition-all duration-300"
            >
              {/* Background animations */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:scale-[1.5] group-hover:blur-md transition-all duration-500 rounded-full" />

              {/* Content */}
              <div className="relative flex items-center gap-2">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span className="hidden group-hover:inline-block transition-all duration-300 text-white text-sm">
                      Sending...
                    </span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 text-cyan-400 group-hover:text-white transition-colors duration-300 ease-in-out"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M9 5l7 7-7 7" />
                    </svg>{' '}
                     
                    <span className="hidden group-hover:inline-block transition-all duration-300 ease-in-out text-white text-sm">
                      Send
                    </span>
                  </>
                )}
              </div>
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  )
}

export default App
