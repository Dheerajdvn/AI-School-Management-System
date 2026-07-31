import React, { useState } from 'react'

export default function RagPipelineShowcase() {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    { step: 1, title: 'Document Ingestion', desc: 'Syllabus PDFs, lecture notes, and textbooks uploaded via spring boot REST API.', icon: 'bi-cloud-upload-fill' },
    { step: 2, title: 'Text Extraction & Parsing', desc: 'Raw document text parsed and extracted cleanly into structured content.', icon: 'bi-file-earmark-text-fill' },
    { step: 3, title: 'Deterministic Chunking', desc: 'Sliding window paragraph chunking with overlapping bounds for optimal context preservation.', icon: 'bi-scissors' },
    { step: 4, title: 'Dense Vector Embeddings', desc: 'Dense vector embeddings generated using Ollama / embedding providers.', icon: 'bi-cpu-fill' },
    { step: 5, title: 'Qdrant Similarity Indexing', desc: 'Vectors are stored and indexed in Qdrant Vector DB for low-latency similarity search.', icon: 'bi-database-fill-check' },
    { step: 6, title: 'RAG Answer Generation', desc: 'The local LLM generates context-aware answers from the retrieved document chunks and source metadata.', icon: 'bi-chat-left-quote-fill' }
  ]

  return (
    <section className="landing-section" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        <div className="text-center mb-3" style={{ marginBottom: '20px' }}>
          <span className="badge bg-primary-subtle text-primary px-3 py-1 mb-2">RAG Architecture</span>
          <h2 className="fw-bold mb-2" style={{ color: 'var(--text)', fontSize: '1.9rem' }}>How the RAG Pipeline Answers Course Questions</h2>
          <p className="text-muted mx-auto mb-3" style={{ maxWidth: '640px', fontSize: '0.95rem', lineHeight: 1.5 }}>
            From PDF upload to vector retrieval and LLM response generation with page-level citations.
          </p>
        </div>

        {/* Workflow Step Bar */}
        <div className="row g-2 mb-4">
          {steps.map((s, idx) => (
            <div key={s.step} className="col-6 col-md-4 col-lg-2">
              <button
                onClick={() => setActiveStep(idx)}
                className={`p-3 rounded-4 w-100 text-start transition-all landing-card ${activeStep === idx ? 'step-button-active' : ''}`}
                style={{
                  background: activeStep === idx ? 'rgba(26, 26, 32, 0.9)' : 'rgba(20, 20, 24, 0.8)',
                  border: activeStep === idx ? '1px solid rgba(109, 124, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: activeStep === idx ? '0 8px 24px rgba(109, 124, 255, 0.15)' : '0 4px 16px rgba(0,0,0,0.25)'
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="badge bg-primary-subtle text-primary">{s.step}</span>
                  <i className={`bi ${s.icon} ${activeStep === idx ? 'text-primary' : 'text-muted'}`}></i>
                </div>
                <div className="fw-semibold small text-truncate" style={{ color: '#F8F8FA' }}>{s.title}</div>
              </button>
            </div>
          ))}
        </div>

        {/* Selected Step Showcase Box */}
        <div className="p-4 rounded-4 landing-card">
          <div className="row align-items-center g-4">
            <div className="col-12 col-md-6">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 mb-3 rounded-pill bg-primary-subtle text-primary fw-semibold small">
                <span>Step {steps[activeStep].step} of 6</span>
              </div>
              <h3 className="fw-bold mb-3" style={{ color: 'var(--text)' }}>{steps[activeStep].title}</h3>
              <p className="lead text-muted mb-4" style={{ fontSize: '1rem', lineHeight: 1.6 }}>
                {steps[activeStep].desc}
              </p>
              <div className="d-flex align-items-center gap-2">
                <button 
                  onClick={() => setActiveStep(prev => (prev - 1 + steps.length) % steps.length)} 
                  className="btn btn-sm btn-secondary"
                >
                  <i className="bi bi-arrow-left me-1"></i> Previous
                </button>
                <button 
                  onClick={() => setActiveStep(prev => (prev + 1) % steps.length)} 
                  className="btn btn-sm btn-primary"
                >
                  Next Step <i className="bi bi-arrow-right ms-1"></i>
                </button>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="p-3 rounded-3 font-monospace small" style={{ background: 'color-mix(in srgb, var(--text) 4%, var(--bg))', color: 'var(--text)' }}>
                <div className="d-flex align-items-center justify-content-between pb-2 mb-2">
                  <span className="text-muted">// Pipeline Execution Terminal</span>
                  <span className="badge bg-success-subtle text-success">STATUS: OK</span>
                </div>
                {activeStep === 0 && (
                  <>
                    <div className="text-primary">&gt; POST /api/documents/upload</div>
                    <div className="text-muted">Filename: Physics_Syllabus_2026.pdf</div>
                    <div className="text-muted">Size: 4.2 MB | Pages: 48</div>
                  </>
                )}
                {activeStep === 1 && (
                  <>
                    <div className="text-primary">&gt; DocumentTextExtractor.extract()</div>
                    <div className="text-muted">Extracted 12,450 words. Cleaned headers & footers.</div>
                  </>
                )}
                {activeStep === 2 && (
                  <>
                    <div className="text-primary">&gt; ChunkingService.createSlidingWindow()</div>
                    <div className="text-muted">Chunk size: 750 words | Overlap: 100 words</div>
                    <div className="text-muted">Generated 28 deterministic chunks.</div>
                  </>
                )}
                {activeStep === 3 && (
                  <>
                    <div className="text-primary">&gt; OllamaEmbeddingProvider.generateEmbeddings()</div>
                    <div className="text-muted">Model: nomic-embed-text</div>
                    <div className="text-muted">Batch size: 28 chunks | Latency: 180ms</div>
                  </>
                )}
                {activeStep === 4 && (
                  <>
                    <div className="text-primary">&gt; QdrantVectorService.upsertPoints()</div>
                    <div className="text-muted">Collection: school_docs_v1</div>
                    <div className="text-muted">Payload: documentId, chunkIndex, pageNumber</div>
                  </>
                )}
                {activeStep === 5 && (
                  <>
                    <div className="text-primary">&gt; RagChatService.queryWithCitations()</div>
                    <div className="text-muted">Top K: 5 chunks retrieved via cosine similarity</div>
                    <div className="text-success">&quot;According to Physics Syllabus p. 12...&quot;</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
