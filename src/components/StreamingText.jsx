import { useEffect, useState } from 'react'
import CodeBlock from './CodeBlock'

const StreamingText = ({ content, aiName = '', isNewMessage = false }) => {
  const [displayedContent, setDisplayedContent] = useState(
    isNewMessage ? '' : content,
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(!isNewMessage)

  useEffect(() => {
    if (!isNewMessage) return

    if (currentIndex < content.length) {
      const timer = setTimeout(() => {
        setDisplayedContent((prev) => prev + content[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, 15)
      return () => clearTimeout(timer)
    } else {
      setIsComplete(true)
    }
  }, [content, currentIndex, isNewMessage])

  // Helper function to detect code blocks
  const hasCodeBlock = (text) => {
    return text.includes('```')
  }

  // Helper function to parse content with code blocks
  const parseContent = (text) => {
    const parts = []
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
    let lastIndex = 0
    let match

    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex, match.index),
        })
      }

      // Add code block
      parts.push({
        type: 'code',
        language: match[1] || 'javascript',
        content: match[2].trim(),
      })

      lastIndex = match.index + match[0].length
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex),
      })
    }

    return parts
  }

  if (!isComplete) {
    return (
      <div>
        {aiName && <div className="text-xs text-cyan-400 mb-1">{aiName}</div>}
        <p className="text-white/90 whitespace-pre-wrap text-sm md:text-base">
          {displayedContent}
          <span className="animate-pulse">▊</span>
        </p>
      </div>
    )
  }

  // Once streaming is complete, render with proper formatting
  if (hasCodeBlock(content)) {
    const parts = parseContent(content)
    return (
      <div>
        {aiName && <div className="text-xs text-cyan-400 mb-1">{aiName}</div>}
        {parts.map((part, index) => (
          <div
            key={index}
            className="mb-2"
          >
            {part.type === 'code' ? (
              <CodeBlock
                code={part.content}
                language={part.language}
              />
            ) : (
              <p className="text-white/90 whitespace-pre-wrap text-sm md:text-base">
                {part.content}
              </p>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      {aiName && <div className="text-xs text-cyan-400 mb-1">{aiName}</div>}
      <p className="text-white/90 whitespace-pre-wrap text-sm md:text-base">
        {content}
      </p>
    </div>
  )
}

export default StreamingText
