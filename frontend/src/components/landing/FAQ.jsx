import React, { useState } from 'react'

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState(0)

  const faqs = [
    {
      q: 'How does the AI Learning Assistant help students understand coursework?',
      a: 'The AI Assistant acts as a 24/7 personal tutor. When students ask questions about their lessons or homework, the AI references their exact course syllabi and textbooks to provide clear, step-by-step explanations with page-level citations.'
    },
    {
      q: 'Can teachers upload their own course syllabi and generate lesson materials?',
      a: 'Yes. Teachers can upload lecture notes, textbook chapters, and syllabi in standard formats. The platform automatically organizes the content, allowing teachers to create AI-generated lesson plans, custom quiz problem sets, and automated rubric grading criteria.'
    },
    {
      q: 'How is student privacy and institutional data protected?',
      a: 'We enforce strict institutional boundaries and role-based access control. All student records, grades, and school documents are isolated within your institution and protected by enterprise-grade encryption. School data is never shared publicly or used to train third-party public models.'
    },
    {
      q: 'Can administrators manage multiple campuses, departments, and faculty rosters?',
      a: 'Yes. School administrators and principals have centralized oversight over multi-campus departments, faculty timetables, student enrollments, academic calendars, and real-time institutional analytics.'
    }
  ]

  return (
    <section className="landing-section" style={{ paddingTop: '44px', paddingBottom: '40px' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        <div className="text-center mb-4">
          <span className="badge bg-primary-subtle text-primary px-3 py-1.5 mb-2 rounded-pill fw-semibold">
            Common Questions
          </span>
          <h2 className="fw-bold mb-2" style={{ color: 'var(--text)', fontSize: '2rem' }}>Frequently Asked Questions</h2>
          <p className="text-muted mb-3" style={{ fontSize: '1rem', lineHeight: 1.5 }}>Everything you need to know about the platform and how it empowers your school.</p>
        </div>

        <div className="d-flex flex-column gap-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-4 overflow-hidden landing-card border shadow-xs">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                className="w-100 p-3.5 text-start bg-transparent border-0 d-flex align-items-center justify-content-between"
                style={{ color: 'var(--text)', fontSize: '1rem' }}
              >
                <span className="fw-semibold">{faq.q}</span>
                <i className={`bi ${openFaq === idx ? 'bi-dash-circle-fill text-primary' : 'bi-plus-circle text-muted'} fs-5`}></i>
              </button>
              {openFaq === idx && (
                <div className="px-3.5 pb-3.5 pt-0 text-muted small" style={{ lineHeight: 1.65, fontSize: '0.92rem' }}>
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
