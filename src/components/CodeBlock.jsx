import { useState } from 'react'
import { FiCheck, FiCopy } from 'react-icons/fi'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

const CodeBlock = ({ code, language = 'javascript' }) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }

  return (
    <div className="relative group my-4 rounded-lg overflow-hidden">
      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50
                   text-gray-400 hover:text-white transition-all duration-200
                   opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Copy code"
      >
        {isCopied ? (
          <FiCheck className="w-5 h-5 text-green-500" />
        ) : (
          <FiCopy className="w-5 h-5" />
        )}
      </button>

      {/* Code Block */}
      <SyntaxHighlighter
        language={language}
        style={atomDark}
        customStyle={{
          margin: 0,
          padding: '1rem',
          borderRadius: '0.5rem',
          backgroundColor: '#1a1a1a',
        }}
        wrapLines={true}
        wrapLongLines={true}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

export default CodeBlock
