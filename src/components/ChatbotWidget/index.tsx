'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import './ChatbotWidget.css'

// ── Types ────────────────────────────────────────────────────────────────────

interface ChatbotNode {
  id: string
  label: string
  answer?: string
  showContactForm?: boolean
  showWhatsapp?: boolean
  whatsappUrl?: string
  children?: ChatbotNode[]
  subChildren?: ChatbotNode[]
}

interface ChatbotConfig {
  active: boolean
  botName: string
  greetingMessage: string
  defaultWhatsappUrl: string
  contactFormTitle: string
  notifyEmail?: string
  showOnAllPages: boolean
  pageWhitelist?: { path: string }[]
  nodes: ChatbotNode[]
  availabilityEnabled?: boolean
  availabilityStart?: number
  availabilityEnd?: number
  availabilityMessage?: string
}

type ChatState = 'closed' | 'open' | 'minimized'

interface Message {
  type: 'bot' | 'user' | 'options' | 'contact-form' | 'success'
  text?: string
  nodes?: ChatbotNode[]
  nodeLabel?: string
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  let sid = localStorage.getItem('cb_session')
  if (!sid) {
    sid = Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem('cb_session', sid)
  }
  return sid
}

function isOnline(cfg: ChatbotConfig): boolean {
  if (!cfg.availabilityEnabled) return true
  const now = new Date()
  // Convert to HKT (UTC+8)
  const hkt = new Date(now.getTime() + 8 * 60 * 60 * 1000)
  const day = hkt.getUTCDay() // 0=Sun, 6=Sat
  const hour = hkt.getUTCHours()
  if (day === 0 || day === 6) return false
  return hour >= (cfg.availabilityStart ?? 9) && hour < (cfg.availabilityEnd ?? 17)
}

function getNodeChildren(node: ChatbotNode): ChatbotNode[] {
  return node.children?.length ? node.children : node.subChildren ?? []
}

async function trackEvent(
  eventType: string,
  nodeLabel?: string,
  conversationPath?: string,
  page?: string,
) {
  try {
    await fetch('/api/plugins/chatbot/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType,
        nodeLabel,
        conversationPath,
        page: page ?? window.location.pathname,
        sessionId: getSessionId(),
      }),
    })
  } catch { /* fire-and-forget */ }
}

// ── SVG Icon ─────────────────────────────────────────────────────────────────

function ChatIcon({ size = 28, color = '#171717' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="50 26 700 700" fill="none" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M400 26.2c-193.3 0-350 156.7-350 350 0 136.2 77.9 254.3 191.5 312.1 15.4 8.1 31.4 15.1 48.1 20.8l-16.5 63.5c-2 7.8 5.4 14.7 13 12.1l229.8-77.6c14.6-5.3 28.8-11.6 42.4-18.7C672 630.6 750 512.5 750 376.2c0-193.3-156.7-350-350-350zm211.1 510.7c-10.8 26.5-41.9 77.2-121.5 77.2-79.9 0-110.9-51-121.6-77.4-2.8-6.8 5-13.4 13.8-11.8 76.2 13.7 147.7 13 215.3.3 8.9-1.8 16.8 4.8 14 11.7z"
        fill={color}
      />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.28 7.044L.787 23.213l4.253-1.493A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.246 0-4.334-.647-6.1-1.763l-.436-.27-2.527.887.848-2.6-.284-.454A9.93 9.93 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#171717" aria-hidden="true">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  )
}

// ── Typing indicator ──────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="cb-typing" aria-label="Bot is typing">
      <span /><span /><span />
    </div>
  )
}

// ── Contact form ──────────────────────────────────────────────────────────────

function ContactForm({
  title,
  question,
  conversationPath,
  onSuccess,
}: {
  title: string
  question: string
  conversationPath: string
  onSuccess: () => void
}) {
  const [name,   setName]   = useState('')
  const [email,  setEmail]  = useState('')
  const [honey,  setHoney]  = useState('')
  const [loading, setLoading] = useState(false)
  const [error,  setError]  = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (honey) return // honeypot triggered — silently discard
    if (!name.trim() || !email.trim()) { setError('Both fields are required.'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/plugins/chatbot/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          _honey: honey,
          question,
          conversationPath,
          page: window.location.pathname,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      trackEvent('lead_submitted', question, conversationPath)
      onSuccess()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="cb-contact-form" onSubmit={handleSubmit} noValidate>
      <p className="cb-contact-title">{title}</p>
      {/* Honeypot — invisible to humans, filled by bots */}
      <input
        type="text"
        name="_honey"
        value={honey}
        onChange={(e) => setHoney(e.target.value)}
        tabIndex={-1}
        aria-hidden
        style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
      />
      <input
        className="cb-input"
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={loading}
        required
      />
      <input
        className="cb-input"
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        required
      />
      {error && <p className="cb-form-error">{error}</p>}
      <button className="cb-submit-btn" type="submit" disabled={loading}>
        {loading ? 'Sending…' : 'Send'}
      </button>
    </form>
  )
}

// ── Main widget ───────────────────────────────────────────────────────────────

export function ChatbotWidget() {
  const [config, setConfig] = useState<ChatbotConfig | null>(null)
  const [chatState, setChatState] = useState<ChatState>('closed')
  const [messages, setMessages] = useState<Message[]>([])
  const [navStack, setNavStack] = useState<ChatbotNode[][]>([])
  const [showNotif, setShowNotif] = useState(false)
  const [unreadCount, setUnreadCount] = useState(1)
  const [isTyping, setIsTyping] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  // ── Load config ──────────────────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/plugins/chatbot/config')
      .then((r) => r.json())
      .then((data: ChatbotConfig) => setConfig(data))
      .catch(() => {})
  }, [])

  // ── Show notification bubble after 3s ────────────────────────────────────
  useEffect(() => {
    if (!config?.active) return
    const greeted = sessionStorage.getItem('cb_greeted')
    if (greeted) return
    const t = setTimeout(() => setShowNotif(true), 3000)
    return () => clearTimeout(t)
  }, [config])

  // ── Visibility check ─────────────────────────────────────────────────────
  const isVisible = (() => {
    if (!config?.active) return false
    if (config.showOnAllPages) return true
    const current = window.location.pathname
    return (config.pageWhitelist ?? []).some((p) => p.path === current)
  })()

  // ── Scroll to bottom ─────────────────────────────────────────────────────
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [messages, isTyping])

  // ── Add message with typing delay ────────────────────────────────────────
  const addBotMessage = useCallback((msg: Message, delay = 700) => {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [...prev, msg])
    }, delay)
  }, [])

  // ── Open chat ────────────────────────────────────────────────────────────
  const openChat = useCallback(() => {
    if (!config) return
    setShowNotif(false)
    sessionStorage.setItem('cb_greeted', '1')
    setUnreadCount(0)
    setChatState('open')
    trackEvent('widget_opened')

    if (messages.length === 0) {
      const online = isOnline(config)
      setMessages([
        {
          type: 'bot',
          text: online
            ? config.greetingMessage
            : (config.availabilityMessage ?? config.greetingMessage),
        },
        ...(online ? [{ type: 'options' as const, nodes: config.nodes }] : []),
      ])
      setNavStack([config.nodes])
    }
  }, [config, messages.length])

  // ── Close / minimise ─────────────────────────────────────────────────────
  const closeChat = () => {
    trackEvent('widget_closed')
    setChatState('closed')
    // Reset conversation
    setMessages([])
    setNavStack([])
    setFormSubmitted(false)
  }

  const minimizeChat = () => setChatState('minimized')

  // ── Select a node ────────────────────────────────────────────────────────
  const selectNode = useCallback(
    (node: ChatbotNode, pathLabels: string[]) => {
      if (!config) return
      const conversationPath = pathLabels.join(' > ')

      // Add user bubble
      setMessages((prev) => [
        ...prev.filter((m) => m.type !== 'options'),
        { type: 'user', text: node.label },
      ])

      trackEvent('node_selected', node.label, conversationPath)

      const childNodes = getNodeChildren(node)
      const hasChildren = childNodes.length > 0

      if (hasChildren) {
        // Push sub-questions
        setNavStack((s) => [...s, childNodes])
        addBotMessage(
          {
            type: 'bot',
            text: `About **${node.label}** — please select:`,
          },
          600,
        )
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { type: 'options', nodes: childNodes },
          ])
        }, 600 + 700)
      } else {
        // Leaf node — show answer
        trackEvent('answer_viewed', node.label, conversationPath)
        if (node.answer) {
          addBotMessage({ type: 'bot', text: node.answer, nodeLabel: node.label }, 700)
        }

        // WhatsApp button
        const waUrl = node.whatsappUrl || config.defaultWhatsappUrl
        if (node.showWhatsapp !== false) {
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                type: 'bot',
                text: '__whatsapp__',
                nodeLabel: waUrl,
              },
            ])
          }, 1400)
        }

        // Contact form (3s delay)
        if (node.showContactForm) {
          trackEvent('contact_form_shown', node.label, conversationPath)
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                type: 'contact-form',
                nodeLabel: node.label,
                text: conversationPath,
              },
            ])
          }, 3000)
        }

        // Quick replies
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { type: 'options', nodes: config.nodes, nodeLabel: '__quick-reply__' },
          ])
        }, node.showContactForm ? 3500 : 2000)
      }
    },
    [config, addBotMessage],
  )

  // ── Back navigation ───────────────────────────────────────────────────────
  const goBack = () => {
    setNavStack((s) => s.slice(0, -1))
    setMessages((prev) => {
      // Remove last options block and last user bubble
      const withoutOptions = prev.filter((m) => m.type !== 'options')
      const lastUser = withoutOptions.map((m, i) => ({ m, i })).filter(({ m }) => m.type === 'user').pop()
      if (lastUser) {
        return withoutOptions.slice(0, lastUser.i)
      }
      return withoutOptions
    })
    // Re-add parent options
    setTimeout(() => {
      setMessages((prev) => {
        const parentNodes = navStack[navStack.length - 2] ?? config?.nodes ?? []
        return [...prev, { type: 'options', nodes: parentNodes }]
      })
    }, 50)
    trackEvent('back_navigated')
  }

  if (!isVisible || !config) return null

  const currentNodes = navStack[navStack.length - 1] ?? config.nodes
  const canGoBack = navStack.length > 1

  return (
    <>
      {/* Notification bubble */}
      {showNotif && chatState === 'closed' && (
        <div className="cb-notif" onClick={openChat} role="button" tabIndex={0}>
          <span>👋 Hi! Got questions about <strong>ATech</strong>?</span>
          <button
            className="cb-notif-close"
            onClick={(e) => { e.stopPropagation(); setShowNotif(false) }}
            aria-label="Dismiss"
          >✕</button>
        </div>
      )}

      {/* FAB */}
      <button
        className={`cb-fab${chatState !== 'closed' ? ' cb-fab--open' : ''}`}
        onClick={chatState === 'closed' || chatState === 'minimized' ? openChat : minimizeChat}
        aria-label={chatState !== 'closed' ? 'Minimise chat' : 'Open chat'}
      >
        {chatState !== 'closed' ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#171717" aria-hidden="true">
            <path d="M19 13H5v-2h14v2z" />
          </svg>
        ) : (
          <ChatIcon size={30} color="#171717" />
        )}
        {chatState === 'closed' && unreadCount > 0 && (
          <span className="cb-badge">{unreadCount}</span>
        )}
      </button>

      {/* Chat window */}
      {chatState === 'open' && (
        <div className="cb-window" role="dialog" aria-label="ATech chat assistant">
          {/* Header */}
          <div className="cb-header">
            <div className="cb-header-avatar">
              <ChatIcon size={18} color="#171717" />
            </div>
            <div className="cb-header-info">
              <span className="cb-header-name">{config.botName}</span>
              <span className="cb-header-status">
                <span className="cb-status-dot" />
                {isOnline(config) ? 'Online now' : 'Offline'}
              </span>
            </div>
            <div className="cb-header-actions">
              <button className="cb-icon-btn" onClick={minimizeChat} aria-label="Minimise">—</button>
              <button className="cb-icon-btn" onClick={closeChat} aria-label="Close">✕</button>
            </div>
          </div>

          {/* Body */}
          <div className="cb-body" ref={bodyRef}>
            {messages.map((msg, i) => {
              // WhatsApp bubble
              if (msg.type === 'bot' && msg.text === '__whatsapp__') {
                return (
                  <button
                    key={i}
                    className="cb-wa-btn"
                    onClick={() => {
                      trackEvent('whatsapp_clicked', undefined, undefined)
                      window.open(msg.nodeLabel, '_blank', 'noopener,noreferrer')
                    }}
                  >
                    <WhatsAppIcon />
                    Chat with us on WhatsApp
                  </button>
                )
              }

              // Bot text bubble — supports **bold** markdown
              if (msg.type === 'bot') {
                const html = (msg.text ?? '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                return (
                  <div key={i} className="cb-bot-bubble">
                    <span dangerouslySetInnerHTML={{ __html: html }} />
                  </div>
                )
              }

              // User bubble
              if (msg.type === 'user') {
                return (
                  <div key={i} className="cb-user-bubble">{msg.text}</div>
                )
              }

              // Options list
              if (msg.type === 'options') {
                const isQuickReply = msg.nodeLabel === '__quick-reply__'
                const nodes = msg.nodes ?? []
                return (
                  <div key={i} className="cb-options">
                    {isQuickReply && (
                      <p className="cb-quick-label">Anything else I can help with?</p>
                    )}
                    {nodes.map((node, ni) => (
                      <button
                        key={node.id ?? ni}
                        className="cb-opt-btn"
                        onClick={() => {
                          const pathLabels = navStack.map((_, idx) => {
                            const parent = messages.filter((m) => m.type === 'user')[idx]
                            return parent?.text ?? ''
                          }).filter(Boolean)
                          selectNode(node, [...pathLabels, node.label])
                        }}
                      >
                        <span className="cb-opt-num">{ni + 1}</span>
                        {node.label}
                      </button>
                    ))}
                    {canGoBack && !isQuickReply && (
                      <button className="cb-back-btn" onClick={goBack}>
                        ← Back
                      </button>
                    )}
                  </div>
                )
              }

              // Contact form
              if (msg.type === 'contact-form') {
                if (formSubmitted) return null
                return (
                  <ContactForm
                    key={i}
                    title={config.contactFormTitle}
                    question={msg.nodeLabel ?? ''}
                    conversationPath={msg.text ?? ''}
                    onSuccess={() => {
                      setFormSubmitted(true)
                      setMessages((prev) => [
                        ...prev.filter((m) => m.type !== 'contact-form'),
                        { type: 'success', text: '✅ Message received! Our team will be in touch shortly.' },
                      ])
                    }}
                  />
                )
              }

              // Success
              if (msg.type === 'success') {
                return (
                  <div key={i} className="cb-success-bubble">{msg.text}</div>
                )
              }

              return null
            })}

            {isTyping && <TypingIndicator />}
          </div>

          {/* Input row (future: free-text) */}
          <div className="cb-input-row">
            <input
              className="cb-text-input"
              placeholder="Type a message…"
              disabled
              aria-label="Chat input (select an option above)"
            />
            <button className="cb-send-btn" disabled aria-label="Send">
              <SendIcon />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
