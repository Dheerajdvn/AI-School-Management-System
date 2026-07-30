import React, { useState } from 'react'

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState(0)

  const faqs = [
    {
      q: 'What technologies power the backend and vector search?',
      a: 'The backend is built with Spring Boot 3.5 (Java 21), PostgreSQL for relational data, Redis for rate-limiting, and Qdrant vector database for high-speed cosine similarity document chunk retrieval.'
    },
    {
      q: 'How does the RAG (Retrieval-Augmented Generation) assistant work?',
      a: 'When a user asks a question, the system generates dense vector embeddings for the query, retrieves matching document chunks from Qdrant, and feeds them as context to the local LLM for source-backed answers.'
    },
    {
      q: 'Can teachers upload custom course syllabi and assignments?',
      a: 'Yes. Teachers can upload PDF documents per course. The system automatically parses the text, creates deterministic sliding window chunks, stores vector embeddings in Qdrant, and makes them instantly searchable.'
    },
    {
      q: 'How is authentication and security managed?',
      a: 'Authentication uses JWT access tokens, refresh-token support, and role-based authorization. Provider API keys are protected with AES field encryption.'
    }
  ]

  return (
    <section className="landing-section py-5 border-top" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold mb-2" style={{ color: 'var(--text)' }}>Frequently Asked Questions</h2>
          <p className="text-muted">Technical overview and architecture details.</p>
        </div>

        <div className="d-flex flex-column gap-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border rounded-3 overflow-hidden landing-card-static" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <button
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                className="w-100 p-3 text-start bg-transparent border-0 d-flex align-items-center justify-content-between font-weight-bold"
                style={{ color: 'var(--text)' }}
              >
                <span className="fw-semibold">{faq.q}</span>
                <i className={`bi ${openFaq === idx ? 'bi-dash-lg' : 'bi-plus-lg'} text-primary`}></i>
              </button>
              {openFaq === idx && (
                <div className="px-3 pb-3 pt-0 border-top text-muted small" style={{ borderColor: 'var(--border)', lineHeight: 1.6 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
