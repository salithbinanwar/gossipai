import { useState } from 'react'
import { FiChevronDown, FiChevronUp, FiRefreshCcw } from 'react-icons/fi'

export default function ModelParams({ onChange, defaultParams }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [params, setParams] = useState(
    defaultParams || {
      temperature: 0.85,
      top_k: 70,
      top_p: 0.9,
      repeat_penalty: 1.1,
      presence_penalty: 0.5,
      frequency_penalty: 0.5,
      mirostat: 2,
      mirostat_tau: 5,
      mirostat_eta: 0.1,
    },
  )

  const handleParamChange = (key, value) => {
    const newParams = { ...params, [key]: parseFloat(value) }
    setParams(newParams)
    onChange(newParams)
  }

  const resetDefaults = () => {
    const defaults = {
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
    setParams(defaults)
    onChange(defaults)
  }

  const paramDescriptions = {
    temperature: 'Creativity level (0.1-2.0)',
    top_k: 'Vocabulary diversity (1-100)',
    top_p: 'Response focus (0.1-1.0)',
    repeat_penalty: 'Repetition prevention (1.0-2.0)',
    presence_penalty: 'New info encouragement (0-1.0)',
    frequency_penalty: 'Word variation (0-1.0)',
    mirostat: 'Dynamic adjustment (0-2)',
    mirostat_tau: 'Surprise level (0-10)',
    mirostat_eta: 'Learning rate (0-1.0)',
  }

  return (
    <div className="space-y-2 bg-gray-800/30 rounded-lg p-3 border border-cyan-500/20">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
      >
        <span>Advanced Model Parameters</span>
        {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
      </button>

      {isExpanded && (
        <div className="space-y-4 pt-3">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={resetDefaults}
              className="flex items-center gap-2 px-2 py-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <FiRefreshCcw className="w-3 h-3" />
              Reset to Defaults
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {Object.entries(params).map(([key, value]) => (
              <div
                key={key}
                className="space-y-1"
              >
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-gray-400">
                    {key
                      .split('_')
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      .join(' ')}
                  </label>
                  <span className="text-xs text-cyan-400">{value}</span>
                </div>
                <input
                  type="range"
                  min={key.includes('mirostat') ? '0' : '0.1'}
                  max={
                    key === 'temperature'
                      ? '2'
                      : key === 'top_k'
                      ? '100'
                      : key === 'top_p'
                      ? '1'
                      : key === 'repeat_penalty'
                      ? '2'
                      : key === 'presence_penalty'
                      ? '1'
                      : key === 'frequency_penalty'
                      ? '1'
                      : key === 'mirostat'
                      ? '2'
                      : key === 'mirostat_tau'
                      ? '10'
                      : '1'
                  }
                  step={key === 'top_k' ? '1' : '0.05'}
                  value={value}
                  onChange={(e) => handleParamChange(key, e.target.value)}
                  className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2
                  [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-150"
                />
                <p className="text-xs text-gray-500">
                  {paramDescriptions[key]}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
