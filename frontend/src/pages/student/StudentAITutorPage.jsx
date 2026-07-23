import React, { useState, useEffect } from 'react'

export default function StudentAITutorPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const suggestedPrompts = [
    'Explain Newton\'s Laws',
    'Solve this equation',
    'Summarize Chapter 5',
    'Translate this paragraph',
    'Generate revision notes'
  ]

  useEffect(() => {
    setMessages([
      { id: 1, role: 'assistant', text: 'Hello! I\'m your AI Tutor. How can I help you today?' }
    ])
  }, [])

  const handleSend = (text = input) => {
    if (!text.trim()) return
    const userMsg = { id: Date.now(), role: 'user', text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    setTimeout(() => {
      const responses = [
        `Great question! Let me explain...`,
        `Here's a step-by-step solution...`,
        `Let me break this down for you...`,
        `Based on your question, here's what you need to know...`,
        `I'll help you understand this concept...`
      ]
      const aiMsg = { id: Date.now() + 1, role: 'assistant', text: responses[Math.floor(Math.random() * responses.length)] }
      setMessages(prev => [...prev, aiMsg])
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="ait-page">
      <h4 className="mb-3"><i className="bi bi-robot me-2" />AI Tutor</h4>
      <div className="glass-card mb-3">
        <div className="card-header-custom"><h5>Suggested Prompts</h5></div>
        <div className="card-body">
          <div className="suggested-prompts">
            {suggestedPrompts.map((prompt, i) => (
              <button key={i} className="prompt-chip" onClick={() => handleSend(prompt)}>{prompt}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card mb-3" style={{ minHeight: '400px', maxHeight: '500px', overflowY: 'auto' }}>
        <div className="card-body">
          {messages.map(msg => (
            <div key={msg.id} className={`message ${msg.role}`}>
              <div className="message-avatar">
                <i className={`bi ${msg.role === 'user' ? 'bi-person' : 'bi-robot'}`} />
              </div>
              <div className="message-content">
                <p>{msg.text}</p>
                {msg.role === 'assistant' && (
                  <div className="message-actions">
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => alert('Copied!')}><i className="bi bi-clipboard me-1" />Copy</button>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => handleSend('Regenerate')}><i className="bi bi-arrow-clockwise me-1" />Regenerate</button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="message assistant">
              <div className="message-avatar"><i className="bi bi-robot" /></div>
              <div className="message-content"><div className="typing-indicator"><span></span><span></span><span></span></div></div>
            </div>
          )}
        </div>
      </div>

      <div className="input-group">
        <input type="text" className="form-control" placeholder="Ask anything..." value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} />
        <button className="btn btn-primary" onClick={() => handleSend()} disabled={!input.trim()}><i className="bi bi-send" /></button>
      </div>

      <style>{aitStyles}</style>
    </div>
  )
}

const aitStyles = `
.ait-page .glass-card { background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
.ait-page .card-header-custom { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
.ait-page .card-header-custom h5 { margin: 0; font-weight: 600; }
.ait-page .card-body { padding: 1.25rem; }
.ait-page .suggested-prompts { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.ait-page .prompt-chip { padding: 0.5rem 1rem; border-radius: 20px; background: rgba(59,130,246,0.15); border: 1px solid rgba(59,130,246,0.3); color: #60a5fa; cursor: pointer; transition: all 0.3s; font-size: 0.85rem; }
.ait-page .prompt-chip:hover { background: rgba(59,130,246,0.25); transform: translateY(-1px); }
.ait-page .message { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
.ait-page .message.user { flex-direction: row-reverse; }
.ait-page .message-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3)); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
.ait-page .message-content { flex: 1; max-width: 70%; }
.ait-page .message.user .message-content { text-align: right; }
.ait-page .message-content p { padding: 0.75rem 1rem; border-radius: 12px; margin: 0; font-size: 0.9rem; }
.ait-page .message.assistant .message-content p { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); }
.ait-page .message.user .message-content p { background: linear-gradient(135deg, #3b82f6, #2563eb); }
.ait-page .message-actions { display: flex; gap: 0.5rem; margin-top: 0.5rem; justify-content: flex-end; }
.ait-page .typing-indicator { display: flex; gap: 4px; padding: 0.75rem 1rem; }
.ait-page .typing-indicator span { width: 8px; height: 8px; border-radius: 50%; background: #60a5fa; animation: typing 1.4s infinite; }
.ait-page .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.ait-page .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
.ait-page .input-group { display: flex; gap: 0.5rem; }
.ait-page .form-control { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: inherit; border-radius: 10px; }
.ait-page .form-control:focus { background: rgba(255,255,255,0.1); border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
.ait-page .btn-primary { background: linear-gradient(135deg, #3b82f6, #2563eb); border: none; border-radius: 10px; font-weight: 600; }
@keyframes typing { 0%, 100% { opacity: 0.3; transform: translateY(0); } 50% { opacity: 1; transform: translateY(-4px); } }
`