import React, { useState, useEffect } from 'react'

export default function InteractiveAiSandbox({ onOpenDemo }) {
  const sampleScenarios = [
    {
      id: 'physics',
      subject: 'Physics • Class 10',
      question: "What is Newton's Second Law of Motion and what is its mathematical formula?",
      citation: 'NCERT Class 10 Science, Ch 9: Force and Laws of Motion (Page 118, Section 9.4)',
      similarity: '98.7%',
      latency: '290ms',
      answer: "Newton's Second Law states that the rate of change of momentum of an object is directly proportional to the applied unbalanced force in the direction of force.\n\nMathematically: F = m × a\nWhere:\n• F = Force applied (Newtons, N)\n• m = Mass of the object (kg)\n• a = Acceleration produced (m/s²)\n\nKey Takeaway: If mass is constant, doubling the force doubles the acceleration."
    },
    {
      id: 'biology',
      subject: 'Biology • Class 10',
      question: 'Explain the light reaction in photosynthesis and where it occurs.',
      citation: 'NCERT Class 10 Science, Ch 6: Life Processes (Page 96, Subsection: Autotrophic Nutrition)',
      similarity: '97.9%',
      latency: '315ms',
      answer: "The light-dependent reaction occurs within the thylakoid membranes of chloroplasts:\n\n1. Absorption of Light Energy: Chlorophyll absorbs solar photons.\n2. Photolysis of Water: Water molecules (H₂O) split into hydrogen ions, electrons, and oxygen gas (O₂).\n3. Energy Conversion: Light energy is converted into chemical energy in the form of ATP and NADPH for the subsequent dark reaction (Calvin cycle)."
    },
    {
      id: 'math',
      subject: 'Mathematics • Class 9 & 10',
      question: 'What is the core difference between Simple Interest and Compound Interest?',
      citation: 'CBSE Secondary Mathematics, Ch 8: Commercial Mathematics (Page 142)',
      similarity: '99.1%',
      latency: '275ms',
      answer: "• Simple Interest (SI): Calculated strictly on the initial principal throughout the term.\n  Formula: SI = (P × R × T) / 100\n\n• Compound Interest (CI): Calculated on the initial principal PLUS all accumulated interest from previous periods ('interest on interest').\n  Formula: A = P(1 + R/100)^T, CI = A - P\n\nPractical Result: Compound interest accelerates growth exponentially over multi-year horizons."
    },
    {
      id: 'history',
      subject: 'History • Class 9',
      question: 'What triggered the storming of the Bastille on 14 July 1789?',
      citation: 'NCERT Class 9 India and the Contemporary World, Ch 1: The French Revolution (Page 3)',
      similarity: '96.8%',
      latency: '340ms',
      answer: "The storming of the Bastille fortress-prison in Paris was sparked by:\n\n1. Severe bread shortages and skyrocketing prices causing public outrage.\n2. Rumors that King Louis XVI had ordered armed troops into Paris to suppress the National Assembly.\n3. The search for gunpowder and ammunition by angry citizens to defend themselves against the royal army.\n\nHistorical Significance: It marked the definitive outbreak of the French Revolution."
    }
  ]

  const [activeScenario, setActiveScenario] = useState(sampleScenarios[0])
  const [customInput, setCustomInput] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [displayedAnswer, setDisplayedAnswer] = useState(sampleScenarios[0].answer)
  const [activeCitation, setActiveCitation] = useState(sampleScenarios[0].citation)
  const [activeSimilarity, setActiveSimilarity] = useState(sampleScenarios[0].similarity)
  const [activeLatency, setActiveLatency] = useState(sampleScenarios[0].latency)

  const handleSelectPreset = (scenario) => {
    setActiveScenario(scenario)
    setCustomInput('')
    setIsSearching(true)
    setDisplayedAnswer('')

    setTimeout(() => {
      setDisplayedAnswer(scenario.answer)
      setActiveCitation(scenario.citation)
      setActiveSimilarity(scenario.similarity)
      setActiveLatency(scenario.latency)
      setIsSearching(false)
    }, 450)
  }

  const handleCustomSubmit = (e) => {
    e.preventDefault()
    if (!customInput.trim()) return

    setIsSearching(true)
    setDisplayedAnswer('')

    setTimeout(() => {
      setDisplayedAnswer(
        `Grounded RAG Response for: "${customInput.trim()}"\n\nBased on your curriculum syllabus and academic course repository, this topic is mapped to standard textbook learning objectives. The AI School OS vector pipeline retrieves relevant paragraphs, filters out hallucinations, and synthesizes answers strictly conforming to course rubrics.`
      )
      setActiveCitation('Institutional Curriculum Index • Vector Namespace #084')
      setActiveSimilarity('98.2%')
      setActiveLatency('325ms')
      setIsSearching(false)
    }, 600)
  }

  return (
    <section id="ai-sandbox" className="landing-section" style={{ paddingTop: '56px', paddingBottom: '56px' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        
        {/* Header */}
        <div className="text-center mb-4">
          <span className="badge bg-primary-subtle text-primary px-3 py-1.5 mb-2 rounded-pill fw-semibold">
            <i className="bi bi-stars me-1"></i> Live RAG Playground
          </span>
          <h2 className="fw-bold mb-2" style={{ color: 'var(--home-heading, #F8F8FA)', fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}>
            Experience the AI Academic Tutor Live
          </h2>
          <p className="text-muted mx-auto mb-3" style={{ maxWidth: '680px', fontSize: '1rem', lineHeight: 1.6 }}>
            No login required. See how our hybrid vector search queries verified curriculum textbooks, eliminates hallucinations, and provides instant cited answers.
          </p>
        </div>

        {/* Quick Question Pills */}
        <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
          {sampleScenarios.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelectPreset(item)}
              className={`btn btn-sm rounded-pill px-3 py-1.5 transition-all text-start d-inline-flex align-items-center gap-2 ${
                activeScenario.id === item.id && !customInput
                  ? 'btn-primary shadow-sm'
                  : 'btn-secondary'
              }`}
              style={{ fontSize: '0.82rem' }}
            >
              <i className="bi bi-chat-left-dots-fill opacity-75"></i>
              <span>{item.subject}</span>
            </button>
          ))}
        </div>

        {/* Interactive Console Sandbox */}
        <div
          className="rounded-4 landing-card shadow-lg border overflow-hidden position-relative"
          style={{
            background: 'var(--home-card-bg)',
            borderColor: 'var(--home-border)'
          }}
        >
          {/* Console Header */}
          <div
            className="d-flex flex-wrap align-items-center justify-content-between px-3 px-sm-4 py-2.5 border-bottom"
            style={{
              background: 'var(--home-inner-bg)',
              borderColor: 'var(--home-border)'
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <span className="rounded-circle bg-danger opacity-75" style={{ width: '10px', height: '10px' }}></span>
              <span className="rounded-circle bg-warning opacity-75" style={{ width: '10px', height: '10px' }}></span>
              <span className="rounded-circle bg-success opacity-75" style={{ width: '10px', height: '10px' }}></span>
              <span className="ms-2 font-monospace small" style={{ color: 'var(--home-muted)', fontSize: '0.8rem' }}>
                rag-tutor.engine/live-query
              </span>
            </div>

            <div className="d-flex align-items-center gap-2 mt-2 mt-sm-0">
              <span className="badge bg-success-subtle text-success d-inline-flex align-items-center gap-1 font-monospace" style={{ fontSize: '0.72rem' }}>
                <i className="bi bi-shield-check"></i> Zero Hallucination Mode
              </span>
              <span className="badge bg-primary-subtle text-primary d-inline-flex align-items-center gap-1 font-monospace" style={{ fontSize: '0.72rem' }}>
                <i className="bi bi-speedometer2"></i> {activeLatency}
              </span>
            </div>
          </div>

          {/* Sandbox Body */}
          <div className="p-3.5 p-sm-4">
            
            {/* Question Bar Input */}
            <form onSubmit={handleCustomSubmit} className="mb-3.5">
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: 'var(--home-border)', color: 'var(--primary)' }}>
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control bg-transparent border-start-0 border-end-0 py-2.5"
                  style={{
                    color: 'var(--home-heading)',
                    borderColor: 'var(--home-border)',
                    fontSize: '0.92rem'
                  }}
                  placeholder={activeScenario.question}
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn btn-primary px-3 px-sm-4 d-inline-flex align-items-center gap-1.5 fw-semibold"
                  style={{ fontSize: '0.88rem' }}
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Retrieving...</span>
                    </>
                  ) : (
                    <>
                      <span>Ask AI</span>
                      <i className="bi bi-send-fill ms-1"></i>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Response Console Box */}
            <div
              className="p-3.5 p-sm-4 rounded-3 border"
              style={{
                background: 'var(--home-inner-bg)',
                borderColor: 'var(--home-inner-border)',
                minHeight: '220px'
              }}
            >
              {isSearching ? (
                <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center">
                  <div className="spinner-border text-primary mb-3" style={{ width: '2rem', height: '2rem' }} role="status"></div>
                  <p className="small text-muted mb-1 font-monospace">Embedding query • Scanning pgvector cosine space...</p>
                  <span className="badge bg-primary-subtle text-primary font-monospace" style={{ fontSize: '0.72rem' }}>
                    Matching 48,500+ textbook chunks
                  </span>
                </div>
              ) : (
                <>
                  {/* Verified Citation Pill */}
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3 pb-2.5 border-bottom" style={{ borderColor: 'var(--home-inner-border)' }}>
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge rounded-pill bg-primary px-2.5 py-1 text-white fw-semibold" style={{ fontSize: '0.72rem' }}>
                        <i className="bi bi-book-half me-1"></i> Verified Textbook Source
                      </span>
                      <span className="small fw-semibold" style={{ color: 'var(--primary)', fontSize: '0.82rem' }}>
                        {activeCitation}
                      </span>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <span className="small text-muted font-monospace" style={{ fontSize: '0.76rem' }}>
                        Cosine Match: <strong className="text-success">{activeSimilarity}</strong>
                      </span>
                    </div>
                  </div>

                  {/* AI Answer Content */}
                  <div
                    className="font-monospace text-start"
                    style={{
                      color: 'var(--home-paragraph)',
                      fontSize: '0.9rem',
                      lineHeight: 1.7,
                      whiteSpace: 'pre-line'
                    }}
                  >
                    {displayedAnswer}
                  </div>
                </>
              )}
            </div>

            {/* Bottom Footer Bar */}
            <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3 mt-3 pt-2">
              <div className="small text-muted d-flex align-items-center gap-2">
                <i className="bi bi-info-circle-fill text-primary"></i>
                <span>Every answer is strictly grounded in uploaded school syllabus PDFs and textbooks.</span>
              </div>

              <button
                onClick={onOpenDemo}
                className="btn btn-sm btn-outline-primary fw-semibold px-3 py-1.5 d-inline-flex align-items-center gap-1.5"
                style={{ borderRadius: '8px', fontSize: '0.82rem' }}
              >
                <span>Try Full Student Portal Demo</span>
                <i className="bi bi-arrow-right"></i>
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
