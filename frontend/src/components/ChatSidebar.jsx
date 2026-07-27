import React, { useState } from 'react'

/**
 * ChatSidebar component for conversation history.
 * Displays list of conversations with ability to create new chat, rename chat, and clear history.
 */
export default function ChatSidebar({ 
  conversations, 
  activeConversationId, 
  onSelectConversation, 
  onNewChat, 
  onClearAll,
  onDeleteConversation,
  onRenameConversation 
}) {
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')

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

  const startRename = (conv, e) => {
    e.stopPropagation()
    setEditingId(conv.id)
    setEditTitle(conv.title || 'Conversation')
  }

  const saveRename = (id, e) => {
    e.stopPropagation()
    if (editTitle.trim() && onRenameConversation) {
      onRenameConversation(id, editTitle.trim())
    }
    setEditingId(null)
  }

  return (
    <div className="chat-sidebar h-100 d-flex flex-column bg-surface border-end">
      {/* Header */}
      <div className="p-3 border-bottom">
        <button 
          className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 rounded-3 fw-semibold shadow-xs"
          onClick={onNewChat}
        >
          <i className="bi bi-plus-lg" />
          New Chat
        </button>
        {conversations.length > 0 && (
          <button 
            className="btn btn-outline-secondary btn-sm w-100 mt-2 d-flex align-items-center justify-content-center gap-2 rounded-3"
            onClick={onClearAll}
          >
            <i className="bi bi-trash" />
            Clear History
          </button>
        )}
      </div>

      {/* Conversations List */}
      <div className="flex-grow-1 overflow-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-muted small text-center">
            <i className="bi bi-chat-square-dots display-6 d-block mb-2 opacity-50" />
            No conversations yet
          </div>
        ) : (
          <div className="list-group list-group-flush">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`list-group-item list-group-item-action border-0 px-3 py-2.5 transition ${
                  conv.id === activeConversationId ? 'active bg-primary bg-opacity-10 text-primary border-start border-3 border-primary' : ''
                }`}
                style={{ cursor: 'pointer' }}
                onClick={() => onSelectConversation(conv.id)}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div className="flex-grow-1 text-truncate pe-2">
                    {editingId === conv.id ? (
                      <div className="input-group input-group-sm" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          className="form-control py-0 px-2 style-input"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveRename(conv.id, e)}
                          autoFocus
                        />
                        <button className="btn btn-sm btn-success py-0 px-2" onClick={(e) => saveRename(conv.id, e)}>
                          <i className="bi bi-check" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="small fw-semibold text-truncate" style={{ maxWidth: '170px' }}>
                          <i className="bi bi-chat-left-text me-2 opacity-75" />
                          {conv.title || 'Untitled conversation'}
                        </div>
                        <div className="text-muted x-small ms-4 opacity-75">
                          {formatDate(conv.updatedAt)}
                        </div>
                      </>
                    )}
                  </div>

                  {editingId !== conv.id && (
                    <div className="d-flex align-items-center gap-1">
                      <button
                        className="btn btn-sm text-muted p-0 opacity-75 hover-opacity-100"
                        style={{ fontSize: '0.8rem' }}
                        onClick={(e) => startRename(conv, e)}
                        title="Rename conversation"
                      >
                        <i className="bi bi-pencil" />
                      </button>
                      <button
                        className="btn btn-sm text-muted p-0 opacity-75 hover-opacity-100"
                        style={{ fontSize: '0.8rem' }}
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteConversation(conv.id)
                        }}
                        title="Delete conversation"
                      >
                        <i className="bi bi-x-lg" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-top text-muted small d-flex align-items-center justify-content-between">
        <span className="d-flex align-items-center gap-2">
          <i className="bi bi-robot text-primary" /> Enterprise RAG
        </span>
        <span className="badge bg-success bg-opacity-25 text-success rounded-pill px-2">Online</span>
      </div>
    </div>
  )
}