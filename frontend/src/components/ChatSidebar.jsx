import React from 'react'

/**
 * ChatSidebar component for conversation history.
 * Displays list of conversations with ability to create new chat and clear history.
 */
export default function ChatSidebar({ 
  conversations, 
  activeConversationId, 
  onSelectConversation, 
  onNewChat, 
  onClearAll,
  onDeleteConversation 
}) {
  const formatDate = (date) => {
    if (!date) return ''
    const d = new Date(date)
    const now = new Date()
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return d.toLocaleDateString('en-IN', { weekday: 'short' })
    }
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="chat-sidebar h-100 d-flex flex-column">
      {/* Header */}
      <div className="p-3 border-bottom">
        <button 
          className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
          onClick={onNewChat}
        >
          <i className="bi bi-plus-lg" />
          New Chat
        </button>
        {conversations.length > 0 && (
          <button 
            className="btn btn-outline-secondary btn-sm w-100 mt-2 d-flex align-items-center justify-content-center gap-2"
            onClick={onClearAll}
          >
            <i className="bi bi-trash" />
            Clear All
          </button>
        )}
      </div>

      {/* Conversations List */}
      <div className="flex-grow-1 overflow-auto">
        {conversations.length === 0 ? (
          <div className="p-3 text-muted small text-center">
            No conversations yet
          </div>
        ) : (
          <div className="list-group list-group-flush">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`list-group-item list-group-item-action border-0 rounded-0 px-3 py-2 ${
                  conv.id === activeConversationId ? 'active' : ''
                }`}
                style={{ cursor: 'pointer' }}
                onClick={() => onSelectConversation(conv.id)}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1 text-truncate">
                    <div className="small text-truncate" style={{ maxWidth: '180px' }}>
                      {conv.title || 'Untitled conversation'}
                    </div>
                    <div className="text-muted x-small">
                      {formatDate(conv.updatedAt)}
                    </div>
                  </div>
                  <button
                    className="btn btn-sm text-muted p-0 ms-2"
                    style={{ fontSize: '0.75rem' }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteConversation(conv.id)
                    }}
                    title="Delete conversation"
                  >
                    <i className="bi bi-x" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-top text-muted small">
        <i className="bi bi-chat-text me-1" />
        AI Assistant
      </div>
    </div>
  )
}