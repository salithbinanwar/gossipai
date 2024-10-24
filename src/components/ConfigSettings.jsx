import { useEffect, useState } from 'react'
import { FiBox, FiRefreshCw, FiSave, FiServer, FiUser } from 'react-icons/fi'
import ModelParams from './ModelParams'
import ModelPersonality from './ModelPersonality'
import NetworkInfo from './NetworkInfo'

export default function ConfigSettings({
  serverIP,
  modelName,
  onSave,
  defaultModel = 'tinyllama:latest',
}) {
  const [availableModels, setAvailableModels] = useState([])
  const [isLoadingModels, setIsLoadingModels] = useState(false)
  const [error, setError] = useState('')
  const [selectedModel, setSelectedModel] = useState(modelName || defaultModel)
  const [currentIP, setCurrentIP] = useState(serverIP || '')
  const [activeTab, setActiveTab] = useState('network')
  const [aiPersonality, setAiPersonality] = useState(() => {
    const saved = localStorage.getItem('aiPersonality')
    return saved ? JSON.parse(saved) : { name: '', role: '' }
  })
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

  const formatSize = (bytes) => {
    const GB = 1024 * 1024 * 1024
    const MB = 1024 * 1024
    if (bytes >= GB) {
      const sizeInGB = (bytes / GB).toFixed(1)
      return `${sizeInGB} GB`
    } else {
      const sizeInMB = Math.round(bytes / MB)
      return `${sizeInMB} MB`
    }
  }

  useEffect(() => {
    localStorage.setItem('aiPersonality', JSON.stringify(aiPersonality))
    localStorage.setItem('modelParams', JSON.stringify(modelParams))
  }, [aiPersonality, modelParams])

  const fetchModels = async () => {
    if (!currentIP) return
    setIsLoadingModels(true)
    setError('')
    try {
      // Add timeout to the fetch request
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 5000)

      const response = await fetch(`${currentIP}/api/models`, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })

      clearTimeout(timeout)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }

      setAvailableModels(data.models || [])
    } catch (error) {
      console.error('Error fetching models:', error)
      if (error.name === 'AbortError') {
        setError('Connection timed out. Please check your server connection.')
      } else {
        setError(
          `Failed to fetch models: ${error.message}. Please check if Ollama is running.`,
        )
      }
    } finally {
      setIsLoadingModels(false)
    }
  }

  useEffect(() => {
    if (currentIP) {
      fetchModels()
    }
  }, [currentIP])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!currentIP) {
      setError('Please enter a server IP address')
      return
    }
    onSave({
      serverIP: currentIP,
      modelName: selectedModel,
      personality: aiPersonality,
      modelParams: modelParams,
    })
  }

  const handleIPChange = (e) => {
    let value = e.target.value
    if (
      value &&
      !value.startsWith('http://') &&
      !value.startsWith('https://')
    ) {
      value = `http://${value}`
    }
    setCurrentIP(value)
  }

  const handleNetworkComplete = async () => {
    if (currentIP) {
      await fetchModels()
      if (!error) {
        setActiveTab('model')
      }
    }
  }

  const renderModelSection = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-cyan-400">
          Available Models
        </label>
        <button
          type="button"
          onClick={fetchModels}
          className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20
          border border-cyan-500/30 text-cyan-400 text-sm transition-all duration-200"
          disabled={isLoadingModels}
        >
          <FiRefreshCw
            className={`w-4 h-4 ${isLoadingModels ? 'animate-spin' : ''}`}
          />
        </button>
      </div>

      <div className="relative">
        {isLoadingModels ? (
          <div className="animate-pulse space-y-2">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-10 bg-gray-800/50 rounded-lg"
              ></div>
            ))}
          </div>
        ) : error ? (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {availableModels.map((model) => (
              <label
                key={model.name}
                className={`flex items-center p-2 rounded-lg border transition-all duration-200 cursor-pointer
                  ${
                    selectedModel === model.name
                      ? 'bg-cyan-500/20 border-cyan-500/30'
                      : 'bg-gray-800/50 border-gray-700 hover:border-cyan-500/30'
                  }`}
              >
                <input
                  type="radio"
                  name="model"
                  value={model.name}
                  checked={selectedModel === model.name}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="hidden"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{model.name}</p>
                  <p className="text-xs text-gray-400">
                    {formatSize(model.size)}
                  </p>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 ml-2
                    ${
                      selectedModel === model.name
                        ? 'border-cyan-400 bg-cyan-400'
                        : 'border-gray-500'
                    }`}
                />
              </label>
            ))}
            {availableModels.length === 0 && (
              <div className="text-center p-4 text-gray-400">
                No models found. Please check your server connection.
              </div>
            )}
          </div>
        )}
      </div>

      {selectedModel && (
        <>
          <ModelParams
            onChange={setModelParams}
            defaultParams={modelParams}
          />
          <button
            type="button"
            onClick={() => setActiveTab('personality')}
            className="mt-4 w-full py-2 px-4 bg-cyan-500/10 hover:bg-cyan-500/20
            border border-cyan-500/30 rounded-lg text-cyan-400 text-sm
            transition-all duration-200"
          >
            Continue to Role Setup →
          </button>
        </>
      )}
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'network':
        return (
          <>
            <NetworkInfo
              onIPSelect={(ip) => setCurrentIP(`http://${ip}:3000`)}
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-cyan-400">
                Server Address
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentIP}
                  onChange={handleIPChange}
                  placeholder="http://your.ip.address:3000"
                  className="flex-1 p-2 rounded-lg bg-gray-800/50 border border-cyan-500/30
                  focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none
                  transition-all duration-300 placeholder-gray-500 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={handleNetworkComplete}
                  className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20
                  border border-cyan-500/30 text-cyan-400 transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!currentIP || isLoadingModels}
                >
                  <FiRefreshCw
                    className={`w-5 h-5 ${
                      isLoadingModels ? 'animate-spin' : ''
                    }`}
                  />
                </button>
              </div>
              {currentIP && (
                <button
                  type="button"
                  onClick={() => setActiveTab('model')}
                  className="mt-4 w-full py-2 px-4 bg-cyan-500/10 hover:bg-cyan-500/20
                  border border-cyan-500/30 rounded-lg text-cyan-400 text-sm
                  transition-all duration-200"
                >
                  Continue to Model Selection →
                </button>
              )}
            </div>
          </>
        )
      case 'model':
        return renderModelSection()
      case 'personality':
        return (
          <ModelPersonality
            initialName={aiPersonality.name}
            initialRole={aiPersonality.role}
            onSave={(personality) => setAiPersonality(personality)}
          />
        )
      default:
        return null
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div className="flex rounded-lg bg-gray-800/30 p-1 mb-4">
        {['network', 'model', 'personality'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
              ${
                activeTab === tab
                  ? 'bg-cyan-500/20 text-cyan-400 shadow-lg'
                  : 'text-gray-400 hover:text-cyan-300'
              }`}
          >
            {tab === 'network' && <FiServer className="w-4 h-4" />}
            {tab === 'model' && <FiBox className="w-4 h-4" />}
            {tab === 'personality' && <FiUser className="w-4 h-4" />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-4">{renderTabContent()}</div>

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg
        bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400
        text-white font-medium transition-all duration-200 group disabled:opacity-50
        disabled:cursor-not-allowed mt-6"
        disabled={!currentIP}
      >
        <FiSave className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
        Save Configuration
      </button>
    </form>
  )
}
