import React from 'react'
import { FiRefreshCw } from 'react-icons/fi'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl max-w-lg">
            <h1 className="text-2xl font-bold text-red-400 mb-4">
              Oops! Something went wrong
            </h1>
            <div className="text-gray-300 mb-4 text-sm overflow-auto max-h-40">
              <p className="font-semibold mb-2">Error Details:</p>
              <pre className="text-left bg-gray-900 p-3 rounded">
                {this.state.error?.toString()}
              </pre>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center gap-2 mx-auto"
            >
              <FiRefreshCw className="w-4 h-4" />
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
