import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

let stompClient = null
let reconnectAttempts = 0
const maxReconnectAttempts = 10
const reconnectDelay = 3000

const getConnectionState = () => ({
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  DISCONNECTED: 'DISCONNECTED',
  ERROR: 'ERROR',
})

export const websocketService = {
  connect: (userId, role, onMessage, onError, onConnect, onDisconnect) => {
    // Guard: prevent duplicate connections
    if (stompClient && stompClient.active) {
      console.warn('WebSocket already connected, skipping duplicate connect')
      onConnect && onConnect()
      return stompClient
    }

    // If there's a deactivating client, clean it up first
    if (stompClient) {
      try { stompClient.deactivate() } catch (e) { /* ignore */ }
      stompClient = null
    }

    const socket = new SockJS('/api/ws')
    stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: reconnectDelay,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      maxReconnectAttempts: maxReconnectAttempts,
      onConnect: () => {
        reconnectAttempts = 0
        console.log('WebSocket connected')
        onConnect && onConnect()
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame)
        onError && onError(frame)
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected')
        onDisconnect && onDisconnect()
      },
      onWebSocketClose: () => {
        console.log('WebSocket connection closed')
        if (stompClient) stompClient.active = false
        onDisconnect && onDisconnect()
      },
    })

    stompClient.activate()
    return stompClient
  },

  disconnect: () => {
    if (stompClient && stompClient.active) {
      stompClient.deactivate()
    }
    stompClient = null
  },

  subscribe: (destination, callback) => {
    if (stompClient && stompClient.connected) {
      return stompClient.subscribe(destination, (message) => {
        try {
          const body = JSON.parse(message.body)
          callback(body)
        } catch (e) {
          callback(message.body)
        }
      })
    }
    return null
  },

  publish: (destination, body) => {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination,
        body: JSON.stringify(body),
      })
    }
  },

  isConnected: () => stompClient && stompClient.connected,

  getState: () => {
    if (!stompClient) return getConnectionState().DISCONNECTED
    if (stompClient.active && stompClient.connected) return getConnectionState().CONNECTED
    return getConnectionState().CONNECTING
  },
}

export default websocketService