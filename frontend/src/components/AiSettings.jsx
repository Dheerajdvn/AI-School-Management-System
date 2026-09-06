import React, { useState, useEffect } from 'react'
import { AiConfigApi } from '../services/api'

const PROVIDER_INFO = {
  Ollama: { icon: 'bi-hdd-network', requiresKey: false, defaultBaseUrl: 'http://localhost:11434', defaultModel: 'qwen2.5-coder:3b' },
  OpenAI: { icon: 'bi-translate', requiresKey: true, defaultBaseUrl: 'https://api.openai.com', defaultModel: 'gpt-4o-mini' },
  Anthropic: { icon: 'bi-shield-check', requiresKey: true, defaultBaseUrl: 'https://api.anthropic.com', defaultModel: 'claude-3-5-sonnet-20241022' },
  'Google Gemini': { icon: 'bi-stars', requiresKey: true, defaultBaseUrl: 'https://generativelanguage.googleapis.com', defaultModel: 'gemini-3.6-flash' },
  Groq: { icon: 'bi-lightning', requiresKey: true, defaultBaseUrl: 'https://api.groq.com', defaultModel: 'llama-3.3-70b-versatile' },
  OpenRouter: { icon: 'bi-router', requiresKey: true, defaultBaseUrl: 'https://openrouter.ai', defaultModel: 'meta-llama/llama-3.3-70b-instruct' },
  'Azure OpenAI': { icon: 'bi-cloud', requiresKey: true, defaultBaseUrl: 'https://your-resource.openai.azure.com', defaultModel: 'gpt-4o' },
  DeepSeek: { icon: 'bi-eye', requiresKey: true, defaultBaseUrl: 'https://api.deepseek.com', defaultModel: 'deepseek-chat' },
  'Mistral AI': { icon: 'bi-wind', requiresKey: true, defaultBaseUrl: 'https://api.mistral.ai', defaultModel: 'mistral-small-latest' },
}

const DEFAULT_CONFIG = {
  provider: 'Ollama',
  apiKey: '',
  baseUrl: 'http://localhost:11434',
  model: 'qwen2.5-coder:3b',
  temperature: 0.2,
  maxTokens: 2048,
  streamingEnabled: true,
  aiSuggestionsEnabled: true,
  isConnected: false,
}

const AiSettings = () => {
  const [config, setConfig] = useState(DEFAULT_CONFIG)
  const [availableModels, setAvailableModels] = useState([])
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [configRes, providersRes] = await Promise.all([
        AiConfigApi.getConfig(),
        AiConfigApi.getProviders(),
      ])

      if (configRes) {
        const prov = configRes.provider || 'Ollama'
        const defaultMod = PROVIDER_INFO[prov]?.defaultModel || ''
        const resolvedModel = configRes.model || defaultMod
        setConfig({
          provider: prov,
          apiKey: configRes.apiKey || '',
          baseUrl: configRes.baseUrl || getDefaultBaseUrl(prov),
          model: resolvedModel,
          temperature: configRes.temperature ?? 0.2,
          maxTokens: configRes.maxTokens ?? 2048,
          streamingEnabled: configRes.streamingEnabled ?? true,
          aiSuggestionsEnabled: configRes.aiSuggestionsEnabled ?? true,
          isConnected: configRes.isConnected ?? false,
        })
        if (resolvedModel) {
          setAvailableModels([resolvedModel])
        }
      }

      if (providersRes) {
        setProviders(providersRes)
      }
    } catch (err) {
      setError('Failed to load AI configuration. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getDefaultBaseUrl = (provider) => {
    return PROVIDER_INFO[provider]?.defaultBaseUrl || ''
  }

  const handleProviderChange = (e) => {
    const newProvider = e.target.value
    const info = PROVIDER_INFO[newProvider]
    const defaultMod = info?.defaultModel || ''
    setConfig(prev => ({
      ...prev,
      provider: newProvider,
      apiKey: info.requiresKey ? prev.apiKey : '',
      baseUrl: info.defaultBaseUrl,
      model: defaultMod,
      isConnected: false,
    }))
    setAvailableModels(defaultMod ? [defaultMod] : [])
    setSuccess('')
    setError('')
  }

  const handleVerifyConnection = async () => {
    setVerifying(true)
    setError('')
    setSuccess('')

    try {
      const result = await AiConfigApi.verifyConnection({
        provider: config.provider,
        apiKey: config.apiKey,
        baseUrl: config.baseUrl,
      })

      if (result.connected) {
        const models = result.models || []
        setAvailableModels(models)
        setConfig(prev => ({
          ...prev,
          isConnected: true,
          model: (prev.model && models.includes(prev.model))
            ? prev.model
            : (models[0] || PROVIDER_INFO[prev.provider]?.defaultModel || prev.model || '')
        }))
        setSuccess(`Connection verified successfully. ${models.length} model(s) available.`)
      } else {
        setConfig(prev => ({ ...prev, isConnected: false }))
        setError(result.message || 'Failed to connect to the provider.')
      }
    } catch (err) {
      setError('Verification failed. Please check your credentials and try again.')
      console.error(err)
    } finally {
      setVerifying(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const defaultMod = PROVIDER_INFO[config.provider]?.defaultModel || ''
      const payload = {
        ...config,
        model: (config.model && config.model.trim()) ? config.model.trim() : defaultMod
      }
      await AiConfigApi.saveConfig(payload)
      setConfig(payload)
      setSuccess('AI settings saved successfully!')
    } catch (err) {
      setError('Failed to save settings. Please try again.')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    if (!window.confirm('Reset all AI settings to defaults? This cannot be undone.')) return

    try {
      const resetConfig = await AiConfigApi.resetConfig()
      setConfig({
        provider: resetConfig.provider || 'Ollama',
        apiKey: resetConfig.apiKey || '',
        baseUrl: resetConfig.baseUrl || getDefaultBaseUrl(resetConfig.provider || 'Ollama'),
        model: resetConfig.model || '',
        temperature: resetConfig.temperature ?? 0.2,
        maxTokens: resetConfig.maxTokens ?? 2048,
        streamingEnabled: resetConfig.streamingEnabled ?? true,
        aiSuggestionsEnabled: resetConfig.aiSuggestionsEnabled ?? true,
        isConnected: resetConfig.isConnected ?? false,
      })
      setAvailableModels([])
      setSuccess('Settings reset to defaults.')
      setError('')
    } catch (err) {
      setError('Failed to reset settings.')
      console.error(err)
    }
  }

  const handleUseDefaultBaseUrl = () => {
    setConfig(prev => ({ ...prev, baseUrl: getDefaultBaseUrl(prev.provider) }))
  }

  if (loading) {
    return (
      <div className="card">
        <div className="card-body text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-2 mb-0">Loading AI settings...</p>
        </div>
      </div>
    )
  }

  const providerInfo = PROVIDER_INFO[config.provider] || PROVIDER_INFO.Ollama
  const showApiKey = providerInfo.requiresKey

  return (
    <>
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">
          <i className="bi bi-robot me-2" />
          AI Settings
        </h5>
        <p className="text-muted small mb-0 mt-1">
          Configure your preferred LLM provider and connection settings.
        </p>
      </div>
      <div className="card-body">
        {/* Success / Error alerts */}
        {success && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            <i className="bi bi-check-circle me-2" />
            {success}
            <button type="button" className="btn-close" onClick={() => setSuccess('')} />
          </div>
        )}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <i className="bi bi-exclamation-triangle me-2" />
            {error}
            <button type="button" className="btn-close" onClick={() => setError('')} />
          </div>
        )}

        {/* Provider Selector */}
        <div className="mb-3">
          <label className="form-label fw-medium">
            <i className={`bi ${providerInfo.icon} me-1`} />
            AI Provider
          </label>
          <select
            className="form-select"
            value={config.provider}
            onChange={handleProviderChange}
          >
            {providers.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <small className="text-muted">
            {showApiKey ? 'API key is required for this provider.' : 'No API key needed - runs locally.'}
          </small>
        </div>

        {/* API Key Field */}
        {showApiKey && (
          <div className="mb-3">
            <label className="form-label fw-medium">API Key</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your API key"
              value={config.apiKey}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
            />
            <small className="text-muted">
              Your API key is stored encrypted and never shared.
            </small>
          </div>
        )}

        {/* Base URL Field */}
        <div className="mb-3">
          <label className="form-label fw-medium">Base URL</label>
          <div className="input-group">
            <input
              type="url"
              className="form-control"
              placeholder="https://api.example.com"
              value={config.baseUrl}
              onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleUseDefaultBaseUrl}
              title="Reset to default base URL"
            >
              <i className="bi bi-arrow-counterclockwise" />
            </button>
          </div>
          <small className="text-muted">
            Custom endpoint for OpenAI-compatible services. Default: {providerInfo.defaultBaseUrl}
          </small>
        </div>

        {/* Verify Connection Button */}
        <div className="mb-3">
          <button
            className="btn btn-outline-primary"
            onClick={handleVerifyConnection}
            disabled={verifying || (showApiKey && !config.apiKey)}
          >
            {verifying ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Verifying...
              </>
            ) : (
              <>
                <i className="bi bi-wifi me-2" />
                Verify Connection
              </>
            )}
          </button>

          {/* Connection Status Indicator */}
          <span className={`badge ms-3 ${config.isConnected ? 'bg-success' : 'bg-secondary'}`}>
            <i className={`bi ${config.isConnected ? 'bi-check-circle' : 'bi-x-circle'} me-1`} />
            {config.isConnected ? 'Connected' : 'Not Connected'}
          </span>
        </div>

        {/* Model Dropdown (populated after verification) */}
        <div className="mb-3">
          <label className="form-label fw-medium">Model</label>
          <select
            className="form-select"
            value={config.model}
            onChange={(e) => setConfig({ ...config, model: e.target.value })}
            disabled={!config.isConnected || availableModels.length === 0}
          >
            {availableModels.length > 0 ? (
              availableModels.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))
            ) : (
              <option value="">
                {config.isConnected ? 'No models available' : 'Verify connection to load models'}
              </option>
            )}
          </select>
          <small className="text-muted">
            Models are fetched dynamically from the provider after verification.
          </small>
        </div>

        {/* Temperature Slider */}
        <div className="mb-3">
          <label className="form-label fw-medium d-flex justify-content-between">
            <span>
              <i className="bi bi-thermometer-half me-1" />
              Temperature
            </span>
            <span className="badge bg-light text-dark">{config.temperature.toFixed(1)}</span>
          </label>
          <input
            type="range"
            className="form-range"
            min="0"
            max="1"
            step="0.1"
            value={config.temperature}
            onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
          />
          <div className="d-flex justify-content-between small text-muted">
            <span>Deterministic (0.0)</span>
            <span>Creative (1.0)</span>
          </div>
        </div>

        {/* Max Tokens */}
        <div className="mb-3">
          <label className="form-label fw-medium">Max Tokens</label>
          <input
            type="number"
            className="form-control"
            min="1"
            max="100000"
            value={config.maxTokens}
            onChange={(e) => setConfig({ ...config, maxTokens: parseInt(e.target.value) || 2048 })}
          />
          <small className="text-muted">
            Maximum number of tokens the model can generate in a single response.
          </small>
        </div>

        {/* Streaming Toggle */}
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <div>
            <label className="form-label fw-medium mb-0">
              <i className="bi bi-play-circle me-1" />
              Streaming
            </label>
            <small className="text-muted d-block">
              Enable streaming responses for real-time output.
            </small>
          </div>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="streamingToggle"
              checked={config.streamingEnabled}
              onChange={(e) => setConfig({ ...config, streamingEnabled: e.target.checked })}
            />
            <label className="form-check-label" htmlFor="streamingToggle">
              {config.streamingEnabled ? 'Enabled' : 'Disabled'}
            </label>
          </div>
        </div>

        {/* AI Suggestions Toggle */}
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <div>
            <label className="form-label fw-medium mb-0">
              <i className="bi bi-lightbulb me-1" />
              AI Suggestions
            </label>
            <small className="text-muted d-block">
              Show AI-powered suggestions automatically.
            </small>
          </div>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="aiSuggestionsToggle"
              checked={config.aiSuggestionsEnabled}
              onChange={(e) => setConfig({ ...config, aiSuggestionsEnabled: e.target.checked })}
            />
            <label className="form-check-label" htmlFor="aiSuggestionsToggle">
              {config.aiSuggestionsEnabled ? 'Enabled' : 'Disabled'}
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex gap-2 pt-3 border-top">
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Saving...
              </>
            ) : (
              <>
                <i className="bi bi-save me-2" />
                Save Settings
              </>
            )}
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={handleReset}
          >
            <i className="bi bi-arrow-counterclockwise me-2" />
            Reset to Default
          </button>
        </div>
      </div>
    </div>

    {/* Model Context Protocol (MCP) Integration Card */}
    <div className="card shadow-sm border-0 mt-4">
      <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
        <div>
          <h5 className="mb-0 d-flex align-items-center gap-2">
            <i className="bi bi-cpu text-info" />
            Model Context Protocol (MCP) Server
          </h5>
          <small className="text-white-50">Enterprise JSON-RPC 2.0 & SSE Protocol Integration</small>
        </div>
        <span className="badge bg-success bg-opacity-75">Protocol v2024-11-05</span>
      </div>
      <div className="card-body">
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <div className="p-3 rounded border bg-light">
              <span className="text-muted small d-block">SSE Handshake Endpoint</span>
              <code className="text-primary fw-bold">GET /api/mcp/sse</code>
            </div>
          </div>
          <div className="col-md-6">
            <div className="p-3 rounded border bg-light">
              <span className="text-muted small d-block">JSON-RPC 2.0 Message Dispatch</span>
              <code className="text-primary fw-bold">POST /api/mcp/message</code>
            </div>
          </div>
        </div>

        <h6 className="fw-bold mb-2">Registered MCP Tools & Role-Based Guardrails (RBAC)</h6>
        <div className="table-responsive mb-3">
          <table className="table table-sm table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Tool Name</th>
                <th>Target Resource</th>
                <th>Access Level</th>
                <th>Token Optimization</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>search_course_knowledge</code></td>
                <td>Qdrant Vector Store (Embeddings)</td>
                <td><span className="badge bg-success">Students, Teachers, Admins</span></td>
                <td>Truncated to 350 chars/chunk</td>
              </tr>
              <tr>
                <td><code>get_course_details</code></td>
                <td>PostgreSQL Course & Teacher Entities</td>
                <td><span className="badge bg-success">Students, Teachers, Admins</span></td>
                <td>Structured summary object</td>
              </tr>
              <tr>
                <td><code>get_student_analytics</code></td>
                <td>PostgreSQL Aggregations (Fees, Cities)</td>
                <td><span className="badge bg-danger">Teachers & Admins Only</span></td>
                <td>Pruned from Student prompts</td>
              </tr>
              <tr>
                <td><code>create_assignment_draft</code></td>
                <td>Assignment Workflow Engine</td>
                <td><span className="badge bg-danger">Teachers & Admins Only</span></td>
                <td>Safe DRAFT status, human-in-loop</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="alert alert-info py-2 small mb-3">
          <i className="bi bi-shield-check me-2" />
          <strong>AI Token & Guardrail Defense:</strong> Casual greetings (e.g. "hi", "thanks") bypass tool calling to consume 0 overhead tokens. Tool recursion is capped at 3 hops maximum to prevent infinite generation loops.
        </div>

        <h6 className="fw-bold mb-2">Claude Desktop / External Host Configuration</h6>
        <pre className="p-3 rounded bg-dark text-white-50 small mb-0" style={{ fontSize: '11px', maxHeight: '140px', overflow: 'auto' }}>
{JSON.stringify({
  "mcpServers": {
    "ai-school-system": {
      "url": "http://localhost:8080/api/mcp/sse",
      "headers": {
        "Authorization": "Bearer <YOUR_JWT_TOKEN>"
      }
    }
  }
}, null, 2)}
        </pre>
      </div>
    </div>
  </>
  )
}

export default AiSettings
