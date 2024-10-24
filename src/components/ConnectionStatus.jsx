import { useEffect, useState } from 'react'
import { FaWifi } from 'react-icons/fa'
import { DEFAULT_SERVER } from '../utils/constants'

function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState(false)
  const serverUrl = DEFAULT_SERVER

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(`${serverUrl}/health`)
        setIsConnected(response.ok)
      } catch (error) {
        console.error('Connection check failed:', error)
        setIsConnected(false)
      }
    }

    checkConnection()
    const interval = setInterval(checkConnection, 5000) // Check every 5 seconds

    return () => clearInterval(interval)
  }, [serverUrl])

  return (
    <div className="flex items-center">
      <FaWifi
        className={`text-xl ${
          isConnected ? 'text-green-500' : 'text-red-500'
        } transition-colors duration-300`}
        title={isConnected ? 'Connected to server' : 'Server disconnected'}
      />
    </div>
  )
}

export default ConnectionStatus
