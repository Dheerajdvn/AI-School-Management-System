import { websocketService } from './websocketService'

let subscription = null

export const chatSocket = {
  connect: () => {
    websocketService.connect(null, null, null, null)
  },

  disconnect: () => {
    if (subscription) {
      subscription.unsubscribe()
      subscription = null
    }
    websocketService.disconnect()
  },

  subscribeToConversation: (conversationId, onMessage, onTyping, onComplete) => {
    if (subscription) {
      subscription.unsubscribe()
    }
    subscription = websocketService.subscribe(`/topic/conversation/${conversationId}`, (message) => {
      onMessage && onMessage(message)
    })
    // Also subscribe to typing indicator
    websocketService.subscribe(`/topic/conversation/${conversationId}/typing`, (data) => {
      onTyping && onTyping(data)
    })
    websocketService.subscribe(`/topic/conversation/${conversationId}/complete`, (data) => {
      onComplete && onComplete(data)
    })
  },

  sendMessage: (conversationId, message) => {
    websocketService.publish(`/app/chat.send`, {
      conversationId,
      content: message,
    })
  },

  sendTyping: (conversationId) => {
    websocketService.publish(`/app/chat.typing`, {
      conversationId,
    })
  },

  stopGeneration: (conversationId) => {
    websocketService.publish(`/app/chat.stop`, {
      conversationId,
    })
  },
}

export default chatSocket