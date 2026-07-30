import { useState, useEffect } from 'react'
import { websocketService } from '../services/websocketService'

export function useWebSocket() {
  const [connected, setConnected] = useState(websocketService.isConnected())
  const [connectionState, setConnectionState] = useState(websocketService.getState())

  useEffect(() => {
    // Poll for connection state changes
    const interval = setInterval(() => {
      const newState = websocketService.getState()
      setConnectionState(newState)
      setConnected(newState === 'CONNECTED')
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return { connected, connectionState }
}