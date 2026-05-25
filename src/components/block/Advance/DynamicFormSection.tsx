'use client'

import React, { useEffect, useId, useRef, useState } from 'react'

declare global {
  interface Window {
    grecaptcha?: {
      render:      (container: string | HTMLElement, params: Record<string, string>) => number
      getResponse: (widgetId?: number) => string
      reset:       (widgetId?: number) => void
      ready:       (cb: () => void) => void
    }
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface FormField {
  id:            string
  blockType:     string
  name:          string
  label?:        string
  required?:     boolean
  defaultValue?: string
  options?:      Array<{ label: string; value: string }>
  width?:        number
  message?:      string
  // scale block
  scaleMin?:     number
  scaleMax?:     number
  minLabel?:     string
  maxLabel?:     string
  scoreWeight?:  number
  // stepSeparator block
  stepLabel?:    string
  stepDescription?: string
}

interface FormStep {
  label:        string
  description?: string
  fields:       FormField[]
}

interface FormSchema {
  id:                   string
  title?:               string
  confirmationType?:    string
  confirmationMessage?: any
  redirect?:            { url?: string }
  fields:               FormField[]
}

interface Props {
  data: {
    formRef?:         string | { id: string; title?: string }
    title?:           string
    formSubmitLabel?: string
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildSteps(fields: FormField[]): FormStep[] {
  const steps: FormStep[] = []
  let current: FormStep = { label: 'Details', description: '', fields: [] }

  for (const field of fields) {
    if (field.blockType === 'stepSeparator') {
      if (current.fields.length === 0) {
        current.label       = field.stepLabel       ?? current.label
        current.description = field.stepDescription ?? ''
      } else {
        steps.push(current)
        current = {
          label:       field.stepLabel       ?? `Step ${steps.length + 2}`,
          description: field.stepDescription ?? '',
          fields:      [],
        }
      }
    } else {
      current.fields.push(field)
    }
  }
  if (current.fields.length > 0) steps.push(current)
  return steps
}

function calcScore(values: Record<string, string>, fields: FormField[]) {
  let total = 0, max = 0
  for (const f of fields) {
    if (f.blockType === 'scale') {
      const val    = parseFloat(values[f.name] ?? '0') || 0
      const weight = f.scoreWeight ?? 1
      const fmax   = f.scaleMax ?? 10
      total += val * weight
      max   += fmax * weight
    }
  }
  const pct = max > 0 ? Math.round((total / max) * 100) : 0
  return { total, max, pct }
}

function scoreLabel(pct: number): { text: string; color: string } {
  if (pct >= 90) return { text: 'Outstanding',        color: '#1CB528' }
  if (pct >= 75) return { text: 'Excellent',          color: '#4DBF20' }
  if (pct >= 60) return { text: 'Good',               color: '#87CC1E' }
  if (pct >= 45) return { text: 'Fair',               color: '#FFC912' }
  return           { text: 'Needs Improvement',        color: '#FF7432' }
}

// 0-10 → red→orange→yellow→green (matches reference image)
const NPS_COLORS = [
  '#FF4444', '#FF5C38', '#FF7432', '#FF8D28', '#FFAB1C', '#FFC912',
  '#FFE408', '#CCDD14', '#87CC1E', '#4DBF20', '#1CB528',
]

function npsColor(n: number, min: number, max: number) {
  const range  = max - min || 10
  const idx    = Math.round(((n - min) / range) * (NPS_COLORS.length - 1))
  return NPS_COLORS[Math.max(0, Math.min(idx, NPS_COLORS.length - 1))]
}

// ── Scale field (NPS buttons) ─────────────────────────────────────────────────

function ScaleField({
  field, value, onChange, error,
}: { field: FormField; value: string; onChange: (v: string) => void; error?: string }) {
  const min   = field.scaleMin ?? 0
  const max   = field.scaleMax ?? 10
  const range = Array.from({ length: max - min + 1 }, (_, i) => i + min)

  return (
    <div style={{ marginBottom: 36 }}>
      <p style={{
        fontSize: 16, fontWeight: 500,
        color: 'var(--color-text, #fafafa)',
        marginBottom: 20, lineHeight: 1.55,
        fontFamily: 'var(--font-work-sans, sans-serif)',
      }}>
        {field.label || field.name}
        {field.required && <span style={{ color: '#f87171', marginLeft: 4 }}>*</span>}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {range.map((n) => {
          const col      = npsColor(n, min, max)
          const selected = value === String(n)
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(String(n))}
              style={{
                width: 46, height: 46,
                borderRadius: 10,
                border:     selected ? `2px solid ${col}` : '2px solid rgba(255,255,255,0.07)',
                background: selected ? col               : `${col}18`,
                color:      selected ? '#000'            : col,
                fontWeight: 700, fontSize: 14,
                cursor: 'pointer',
                transition: 'all 0.12s',
                boxShadow:  selected ? `0 0 18px ${col}55` : 'none',
                transform:  selected ? 'scale(1.12)' : 'scale(1)',
                fontFamily: 'var(--font-work-sans, sans-serif)',
                lineHeight: 1,
              }}
            >
              {n}
            </button>
          )
        })}
      </div>

      {(field.minLabel || field.maxLabel) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
          <span style={{ fontSize: 11, color: 'var(--color-muted, #777)', fontFamily: 'var(--font-work-sans, sans-serif)' }}>
            {field.minLabel}
          </span>
          <span style={{ fontSize: 11, color: 'var(--color-muted, #777)', fontFamily: 'var(--font-work-sans, sans-serif)' }}>
            {field.maxLabel}
          </span>
        </div>
      )}

      {error && <p style={{ fontSize: 12, color: '#f87171', marginTop: 6 }}>{error}</p>}
    </div>
  )
}

// ── Generic field ─────────────────────────────────────────────────────────────

function Field({
  field, value, onChange, error,
}: { field: FormField; value: string; onChange: (v: string) => void; error?: string }) {
  if (field.blockType === 'scale') return (
    <ScaleField field={field} value={value} onChange={onChange} error={error} />
  )

  const base: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${error ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: 8, padding: '12px 16px',
    fontSize: 15, color: 'var(--color-text, #fafafa)',
    fontFamily: 'var(--font-work-sans, sans-serif)', outline: 'none',
    transition: 'border-color 0.15s',
  }

  if (field.blockType === 'message') return (
    <div style={{ padding: '10px 0', fontSize: 14, color: 'var(--color-muted, #888)', lineHeight: 1.6 }}>
      {field.message ?? field.label}
    </div>
  )

  return (
    <div style={{
      marginBottom: 20,
      width: field.width ? `${field.width}%` : '100%',
      paddingRight: field.width && field.width < 100 ? 8 : 0,
      boxSizing: 'border-box',
    }}>
      {field.blockType !== 'checkbox' && (
        <label style={{
          display: 'block', fontSize: 13, fontWeight: 500,
          marginBottom: 8, color: 'var(--color-muted, #aaa)',
          fontFamily: 'var(--font-work-sans, sans-serif)',
        }}>
          {field.label || field.name}
          {field.required && <span style={{ color: '#f87171', marginLeft: 3 }}>*</span>}
        </label>
      )}

      {field.blockType === 'text'     && <input type="text"   style={base} value={value} onChange={e => onChange(e.target.value)} />}
      {field.blockType === 'email'    && <input type="email"  style={base} value={value} onChange={e => onChange(e.target.value)} />}
      {field.blockType === 'number'   && <input type="number" style={base} value={value} onChange={e => onChange(e.target.value)} />}
      {field.blockType === 'textarea' && (
        <textarea style={{ ...base, resize: 'vertical', minHeight: 100 }}
          value={value} onChange={e => onChange(e.target.value)} />
      )}
      {field.blockType === 'select' && (
        <select style={{ ...base, appearance: 'none' }} value={value} onChange={e => onChange(e.target.value)}>
          <option value="">Select…</option>
          {field.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      )}
      {field.blockType === 'checkbox' && (
        <label style={{ display: 'flex', gap: 10, cursor: 'pointer', fontSize: 14, color: 'var(--color-text, #fafafa)', alignItems: 'center', fontFamily: 'var(--font-work-sans, sans-serif)' }}>
          <input type="checkbox" checked={value === 'true'} onChange={e => onChange(e.target.checked ? 'true' : 'false')}
            style={{ width: 16, height: 16, accentColor: 'var(--color-accent, #ffd369)' }} />
          {field.label || field.name}
          {field.required && <span style={{ color: '#f87171' }}>*</span>}
        </label>
      )}

      {error && <p style={{ fontSize: 12, color: '#f87171', marginTop: 4 }}>{error}</p>}
    </div>
  )
}

// ── Progress bar ──────────────────────────────────────────────────────────────

function ProgressBar({ steps, currentStep, isReview }: { steps: FormStep[]; currentStep: number; isReview: boolean }) {
  const total = steps.length
  const done  = isReview ? total : currentStep
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div style={{ marginBottom: 44 }}>
      {/* Thin progress line */}
      <div style={{
        height: 3, background: 'rgba(255,255,255,0.07)',
        borderRadius: 99, marginBottom: 32, overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, var(--color-accent, #ffd369), #f0c040)',
          borderRadius: 99, width: `${pct}%`,
          transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: '0 0 12px rgba(255,211,105,0.4)',
        }} />
      </div>

      {/* Step dots + connector lines */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {steps.map((step, i) => {
          const isDone   = i < done
          const isActive = !isReview && i === currentStep

          return (
            <React.Fragment key={i}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background:  isDone   ? 'var(--color-accent, #ffd369)' :
                               isActive ? 'var(--color-accent, #ffd369)' :
                               'rgba(255,255,255,0.05)',
                  border: `2px solid ${isDone || isActive ? 'var(--color-accent, #ffd369)' : 'rgba(255,255,255,0.12)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s',
                  boxShadow: isActive ? '0 0 24px rgba(255,211,105,0.45)' : 'none',
                }}>
                  {isDone ? (
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <path d="M2.5 7l3 3 6-6" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span style={{
                      fontSize: 12, fontWeight: 700,
                      color: isActive ? '#000' : 'rgba(255,255,255,0.35)',
                      fontFamily: 'var(--font-work-sans, sans-serif)',
                    }}>{i + 1}</span>
                  )}
                </div>

                {isActive && (
                  <span style={{
                    position: 'absolute', top: 40,
                    fontSize: 10, fontWeight: 600,
                    color: 'var(--color-accent, #ffd369)',
                    whiteSpace: 'nowrap',
                    fontFamily: 'var(--font-work-sans, sans-serif)',
                    letterSpacing: '0.05em', textTransform: 'uppercase',
                  }}>
                    {step.label}
                  </span>
                )}
                {isReview && i === steps.length - 1 && (
                  <span style={{
                    position: 'absolute', top: 40,
                    fontSize: 10, fontWeight: 600,
                    color: 'var(--color-accent, #ffd369)',
                    whiteSpace: 'nowrap',
                    fontFamily: 'var(--font-work-sans, sans-serif)',
                    letterSpacing: '0.05em', textTransform: 'uppercase',
                  }}>
                    Review
                  </span>
                )}
              </div>

              {i < steps.length - 1 && (
                <div style={{
                  flex: 1, height: 2,
                  background: i < done ? 'var(--color-accent, #ffd369)' : 'rgba(255,255,255,0.07)',
                  transition: 'background 0.3s',
                }} />
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Space for step label below dots */}
      <div style={{ height: 24 }} />

      {/* Step counter */}
      <p style={{
        fontSize: 12, color: 'var(--color-muted, #666)',
        fontFamily: 'var(--font-work-sans, sans-serif)',
        letterSpacing: '0.06em', textTransform: 'uppercase',
        marginTop: 4,
      }}>
        {isReview ? 'Review' : `Step ${currentStep + 1} of ${total}`} &nbsp;·&nbsp; {pct}% complete
      </p>
    </div>
  )
}

// ── Score arc ─────────────────────────────────────────────────────────────────

function ScoreArc({ pct, color }: { pct: number; color: string }) {
  const r       = 60
  const cx      = 80
  const cy      = 80
  const stroke  = 8
  const circ    = 2 * Math.PI * r
  const arc     = circ * 0.75
  const dash    = (pct / 100) * arc
  const gap     = arc - dash
  const bg      = circ * 0.75

  return (
    <svg width="160" height="130" viewBox="0 0 160 130">
      {/* Track */}
      <circle cx={cx} cy={cy} r={r} fill="none"
        stroke="rgba(255,255,255,0.06)" strokeWidth={stroke}
        strokeDasharray={`${bg} ${circ - bg}`}
        strokeDashoffset={circ * 0.125 + circ * 0.25 / 2}
        strokeLinecap="round"
      />
      {/* Fill */}
      <circle cx={cx} cy={cy} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${gap + circ * 0.25}`}
        strokeDashoffset={circ * 0.125 + circ * 0.25 / 2}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 1s cubic-bezier(0.4,0,0.2,1)' }}
      />
      <text x={cx} y={cy + 6} textAnchor="middle"
        fill={color} fontSize="26" fontWeight="700"
        fontFamily="var(--font-work-sans, sans-serif)">
        {pct}
      </text>
      <text x={cx} y={cy + 22} textAnchor="middle"
        fill="rgba(255,255,255,0.35)" fontSize="11"
        fontFamily="var(--font-work-sans, sans-serif)">
        out of 100
      </text>
    </svg>
  )
}

// ── Review step ───────────────────────────────────────────────────────────────

function ReviewStep({
  steps, values, hasScaleFields, onEdit, onSubmit, submitting, submitError,
  captchaReady, captchaRef, captchaId, siteKey,
}: {
  steps:          FormStep[]
  values:         Record<string, string>
  hasScaleFields: boolean
  onEdit:         (i: number) => void
  onSubmit:       (e: React.FormEvent) => void
  submitting:     boolean
  submitError:    string | null
  captchaReady:   boolean | null
  captchaRef:     React.RefObject<HTMLDivElement>
  captchaId:      string
  siteKey:        string
}) {
  const allFields  = steps.flatMap(s => s.fields)
  const scoreInfo  = calcScore(values, allFields)
  const label      = scoreLabel(scoreInfo.pct)

  return (
    <div>
      {/* Score summary (if survey) */}
      {hasScaleFields && (
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16, padding: '28px 32px',
          marginBottom: 32, display: 'flex', alignItems: 'center', gap: 28,
        }}>
          <ScoreArc pct={scoreInfo.pct} color={label.color} />
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-muted, #777)', marginBottom: 8, fontFamily: 'var(--font-work-sans, sans-serif)' }}>
              Your Score
            </p>
            <p style={{ fontSize: 26, fontWeight: 700, color: label.color, marginBottom: 4, fontFamily: 'var(--font-work-sans, sans-serif)' }}>
              {label.text}
            </p>
            <p style={{ fontSize: 14, color: 'var(--color-muted, #888)', fontFamily: 'var(--font-work-sans, sans-serif)' }}>
              {scoreInfo.total} / {scoreInfo.max} points
            </p>
          </div>
        </div>
      )}

      {/* Answers per step */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
        {steps.map((step, si) => (
          <div key={si} style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12, overflow: 'hidden',
          }}>
            {/* Step header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.02)',
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text, #fafafa)', letterSpacing: '0.02em', fontFamily: 'var(--font-work-sans, sans-serif)' }}>
                {step.label}
              </span>
              <button
                type="button"
                onClick={() => onEdit(si)}
                style={{
                  background: 'rgba(255,211,105,0.1)',
                  border: '1px solid rgba(255,211,105,0.25)',
                  borderRadius: 6, padding: '5px 12px',
                  fontSize: 11, fontWeight: 600,
                  color: 'var(--color-accent, #ffd369)',
                  cursor: 'pointer',
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  transition: 'background 0.15s',
                }}
              >
                Edit
              </button>
            </div>

            {/* Fields in step */}
            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {step.fields.filter(f => f.blockType !== 'message').map(f => {
                const val = values[f.name] ?? ''
                let display = val || <span style={{ color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>—</span>
                if (f.blockType === 'scale' && val) {
                  const col = npsColor(parseInt(val), f.scaleMin ?? 0, f.scaleMax ?? 10)
                  display = (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 30, height: 30, borderRadius: 6,
                      background: col, color: '#000',
                      fontWeight: 700, fontSize: 13,
                      fontFamily: 'var(--font-work-sans, sans-serif)',
                    }}>{val}</span>
                  )
                }
                if (f.blockType === 'checkbox') display = val === 'true' ? '✓ Yes' : '✗ No'
                return (
                  <div key={f.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontSize: 13, color: 'var(--color-muted, #888)', fontFamily: 'var(--font-work-sans, sans-serif)', flex: 1 }}>
                      {f.label || f.name}
                    </span>
                    <span style={{ fontSize: 13, color: 'var(--color-text, #fafafa)', fontFamily: 'var(--font-work-sans, sans-serif)', textAlign: 'right', maxWidth: '55%' }}>
                      {display}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* reCAPTCHA + submit */}
      <form onSubmit={onSubmit}>
        {siteKey && <div ref={captchaRef} id={`recaptcha-${captchaId}`} style={{ marginBottom: 20 }} />}

        {submitError && (
          <div style={{
            padding: '12px 16px', borderRadius: 8, marginBottom: 20,
            background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
            fontSize: 13, color: '#f87171', fontFamily: 'var(--font-work-sans, sans-serif)',
          }}>
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || captchaReady === false}
          style={{
            width: '100%', padding: '15px 32px',
            background: submitting ? 'rgba(255,211,105,0.5)' : 'var(--color-accent, #ffd369)',
            color: '#000', border: 'none', borderRadius: 10,
            fontSize: 15, fontWeight: 700,
            fontFamily: 'var(--font-work-sans, sans-serif)',
            cursor: submitting ? 'not-allowed' : 'pointer',
            transition: 'opacity 0.2s',
            letterSpacing: '0.02em',
          }}
        >
          {submitting ? 'Submitting…' : 'Submit →'}
        </button>
      </form>
    </div>
  )
}

// ── Success screen ────────────────────────────────────────────────────────────

function SuccessScreen({ values, steps, hasScaleFields }: { values: Record<string, string>; steps: FormStep[]; hasScaleFields: boolean }) {
  const allFields = steps.flatMap(s => s.fields)
  const scoreInfo = calcScore(values, allFields)
  const label     = scoreLabel(scoreInfo.pct)

  if (hasScaleFields) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px' }}>
        <ScoreArc pct={scoreInfo.pct} color={label.color} />
        <h2 style={{ fontSize: 28, fontWeight: 700, color: label.color, marginBottom: 8, fontFamily: 'var(--font-work-sans, sans-serif)' }}>
          {label.text}!
        </h2>
        <p style={{ fontSize: 15, color: 'var(--color-muted, #888)', marginBottom: 4, fontFamily: 'var(--font-work-sans, sans-serif)' }}>
          Your score: {scoreInfo.total} / {scoreInfo.max} points
        </p>
        <p style={{ fontSize: 14, color: 'var(--color-muted, #666)', marginTop: 20, fontFamily: 'var(--font-work-sans, sans-serif)' }}>
          Thank you for your feedback! Your responses have been recorded.
        </p>
      </div>
    )
  }

  return (
    <div style={{ textAlign: 'center', padding: '48px 24px' }}>
      <div style={{
        width: 60, height: 60, borderRadius: '50%',
        background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px', fontSize: 24,
      }}>
        ✓
      </div>
      <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text, #fafafa)', fontFamily: 'var(--font-work-sans, sans-serif)' }}>
        Thank you!
      </p>
      <p style={{ fontSize: 14, color: 'var(--color-muted, #888)', marginTop: 8, fontFamily: 'var(--font-work-sans, sans-serif)' }}>
        Your submission has been received.
      </p>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function DynamicFormSection({ data }: Props) {
  const formId = typeof data.formRef === 'object' ? data.formRef?.id : data.formRef

  const siteKey     = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ''
  const captchaId   = useId().replace(/:/g, '')
  const captchaRef  = useRef<HTMLDivElement>(null)
  const sectionRef  = useRef<HTMLElement | null>(null)
  const widgetIdRef = useRef<number | null>(null)
  const timerRef    = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [schema,      setSchema]      = useState<FormSchema | null>(null)
  const [loadError,   setLoadError]   = useState(false)
  const [values,      setValues]      = useState<Record<string, string>>({})
  const [errors,      setErrors]      = useState<Record<string, string>>({})
  const [submitting,  setSubmitting]  = useState(false)
  const [submitted,   setSubmitted]   = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [captchaReady, setCaptchaReady] = useState<boolean | null>(!siteKey ? true : false)

  // Parse steps from schema
  const steps         = schema ? buildSteps(schema.fields ?? []) : []
  const isMultiStep   = steps.length > 1
  const isReviewStep  = isMultiStep && currentStep >= steps.length
  const allFields     = schema?.fields.filter(f => f.blockType !== 'stepSeparator') ?? []
  const hasScaleFields = allFields.some(f => f.blockType === 'scale')

  // Load form schema
  useEffect(() => {
    if (!formId) return
    fetch(`/api/forms/${formId}?depth=1`)
      .then(r => r.json())
      .then(d => {
        if (d?.id) {
          setSchema(d)
          const defaults: Record<string, string> = {}
          for (const f of d.fields ?? []) {
            if (f.blockType !== 'stepSeparator') defaults[f.name] = f.defaultValue ?? ''
          }
          setValues(defaults)
        } else setLoadError(true)
      })
      .catch(() => setLoadError(true))
  }, [formId])

  // reCAPTCHA setup
  useEffect(() => {
    if (!siteKey) return
    if (document.querySelector('script[src*="recaptcha/api.js"]')) { renderCaptcha(); return }
    const script   = document.createElement('script')
    script.src     = 'https://www.google.com/recaptcha/api.js?render=explicit'
    script.async   = true; script.defer = true
    script.onload  = renderCaptcha
    script.onerror = () => setCaptchaReady(null)
    document.head.appendChild(script)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      widgetIdRef.current = null  // allow re-init on StrictMode remount
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey])

  // For multi-step forms: captchaRef is only in the review step. Re-trigger
  // renderCaptcha when we arrive there so the widget actually mounts.
  useEffect(() => {
    if (isReviewStep && siteKey && captchaReady === false) renderCaptcha()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReviewStep])

  function renderCaptcha() {
    if (!siteKey) return
    if (!captchaRef.current) { setCaptchaReady(null); return }
    window.grecaptcha?.ready(() => {
      if (widgetIdRef.current !== null) return
      try { widgetIdRef.current = window.grecaptcha!.render(captchaRef.current!, { sitekey: siteKey }) } catch {}
      timerRef.current = setTimeout(() => {
        setCaptchaReady(captchaRef.current?.querySelector('iframe') ? true : null)
      }, 3000)
    })
  }

  function validateStep(stepIndex: number): boolean {
    const fields = isMultiStep ? (steps[stepIndex]?.fields ?? []) : allFields
    const errs: Record<string, string> = {}
    for (const f of fields) {
      if (f.required && f.blockType !== 'message') {
        const v = values[f.name] ?? ''
        if (!v.trim() || v === 'false') errs[f.name] = 'This field is required'
      }
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleNext() {
    if (!validateStep(currentStep)) return
    setErrors({})
    setCurrentStep(p => p + 1)
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handlePrev() {
    setErrors({})
    setCurrentStep(p => Math.max(0, p - 1))
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleEditStep(i: number) {
    setErrors({})
    setCurrentStep(i)
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const recaptchaToken = captchaReady === true
      ? (window.grecaptcha?.getResponse(widgetIdRef.current ?? undefined) ?? '')
      : captchaReady === null ? 'recaptcha-unavailable' : ''

    if (captchaReady === false) { setSubmitError('Security check is still loading.'); return }
    if (captchaReady === true && !recaptchaToken) { setSubmitError('Please complete the reCAPTCHA.'); return }

    setSubmitting(true)
    setSubmitError(null)

    const scoreInfo      = calcScore(values, allFields)
    const submissionData = allFields
      .filter(f => f.blockType !== 'message')
      .map(f   => ({ field: f.name, value: values[f.name] ?? '' }))

    if (hasScaleFields) {
      submissionData.push({ field: '_surveyScore', value: String(scoreInfo.pct)                  })
      submissionData.push({ field: '_surveyRaw',   value: `${scoreInfo.total}/${scoreInfo.max}` })
    }

    try {
      const res = await fetch('/api/form-submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ form: schema!.id, submissionData, recaptchaToken }),
      })

      if (res.ok) {
        setSubmitted(true)
        if (schema!.confirmationType === 'redirect' && schema!.redirect?.url) {
          window.location.href = schema!.redirect.url
        }
      } else {
        const d = await res.json().catch(() => ({}))
        setSubmitError(d?.error ?? 'Submission failed. Please try again.')
        if (captchaReady === true) window.grecaptcha?.reset(widgetIdRef.current ?? undefined)
      }
    } catch {
      setSubmitError('Network error. Please check your connection and try again.')
      if (captchaReady === true) window.grecaptcha?.reset(widgetIdRef.current ?? undefined)
    } finally {
      setSubmitting(false)
    }
  }

  // ── Render states ───────────────────────────────────────────────────────────

  if (!formId)                  return null
  if (!schema && !loadError)    return (
    <section style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--color-muted, #888)', fontSize: 14 }}>
      Loading form…
    </section>
  )
  if (loadError) return (
    <section style={{ padding: '48px 24px', textAlign: 'center', color: '#f87171', fontSize: 14 }}>
      Form could not be loaded.
    </section>
  )

  if (submitted) return (
    <section style={{ padding: '64px 24px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <SuccessScreen values={values} steps={steps} hasScaleFields={hasScaleFields} />
      </div>
    </section>
  )

  if (isReviewStep) return (
    <section ref={el => { sectionRef.current = el }} style={{ padding: '64px 24px' }}>
      <div style={{ maxWidth: 660, margin: '0 auto' }}>
        {isMultiStep && <ProgressBar steps={steps} currentStep={currentStep} isReview />}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
          <div>
            <h2 style={{
              fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)',
              fontWeight: 700, letterSpacing: '-0.02em',
              color: 'var(--color-text, #fafafa)',
              fontFamily: 'var(--font-work-sans, sans-serif)',
              marginBottom: 6,
            }}>
              Review Your Answers
            </h2>
            <p style={{ fontSize: 14, color: 'var(--color-muted, #888)', fontFamily: 'var(--font-work-sans, sans-serif)' }}>
              Check everything looks right, then submit.
            </p>
          </div>
          <button
            type="button"
            onClick={handlePrev}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8, padding: '9px 18px',
              fontSize: 13, color: 'var(--color-muted, #888)',
              cursor: 'pointer', fontFamily: 'var(--font-work-sans, sans-serif)',
              transition: 'border-color 0.15s',
            }}
          >
            ← Back
          </button>
        </div>

        <ReviewStep
          steps={steps} values={values} hasScaleFields={hasScaleFields}
          onEdit={handleEditStep} onSubmit={handleSubmit}
          submitting={submitting} submitError={submitError}
          captchaReady={captchaReady} captchaRef={captchaRef}
          captchaId={captchaId} siteKey={siteKey}
        />
      </div>
    </section>
  )

  // ── Form step (or single-page) ──────────────────────────────────────────────

  const currentFields = isMultiStep ? (steps[currentStep]?.fields ?? []) : allFields
  const stepTitle     = isMultiStep ? steps[currentStep]?.label : (data.title ?? schema?.title)
  const stepDesc      = isMultiStep ? steps[currentStep]?.description : undefined
  const isLastStep    = currentStep === steps.length - 1

  return (
    <section ref={el => { sectionRef.current = el }} style={{ padding: '64px 24px' }}>
      <div style={{ maxWidth: 660, margin: '0 auto' }}>
        {isMultiStep && <ProgressBar steps={steps} currentStep={currentStep} isReview={false} />}

        {stepTitle && (
          <h2 style={{
            fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)',
            fontWeight: 700, letterSpacing: '-0.02em', marginBottom: stepDesc ? 8 : 28,
            fontFamily: 'var(--font-work-sans, sans-serif)',
            color: 'var(--color-text, #fafafa)',
          }}>
            {stepTitle}
          </h2>
        )}
        {stepDesc && (
          <p style={{ fontSize: 14, color: 'var(--color-muted, #888)', marginBottom: 28, lineHeight: 1.6, fontFamily: 'var(--font-work-sans, sans-serif)' }}>
            {stepDesc}
          </p>
        )}

        <form
          onSubmit={isMultiStep ? (e) => { e.preventDefault(); handleNext() } : handleSubmit}
          noValidate
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 16px' }}>
            {currentFields.map(field => (
              <Field
                key={field.id ?? field.name}
                field={field}
                value={values[field.name] ?? ''}
                onChange={v => {
                  setValues(prev => ({ ...prev, [field.name]: v }))
                  if (errors[field.name]) setErrors(prev => { const n = { ...prev }; delete n[field.name]; return n })
                }}
                error={errors[field.name]}
              />
            ))}
          </div>

          {/* reCAPTCHA only on last step for single-page forms */}
          {!isMultiStep && siteKey && (
            <div ref={captchaRef} id={`recaptcha-${captchaId}`} style={{ marginBottom: 16 }} />
          )}

          {submitError && (
            <div style={{
              padding: '10px 14px', borderRadius: 8, marginBottom: 16,
              background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
              fontSize: 13, color: '#f87171', fontFamily: 'var(--font-work-sans, sans-serif)',
            }}>
              {submitError}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 32, gap: 12 }}>
            {isMultiStep && currentStep > 0 ? (
              <button
                type="button"
                onClick={handlePrev}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 10, padding: '12px 24px',
                  fontSize: 14, fontWeight: 500,
                  color: 'var(--color-muted, #888)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  transition: 'border-color 0.15s',
                }}
              >
                ← Back
              </button>
            ) : <div />}

            {isMultiStep ? (
              <button
                type="submit"
                style={{
                  background: 'var(--color-accent, #ffd369)',
                  border: 'none', borderRadius: 10,
                  padding: '12px 32px',
                  fontSize: 14, fontWeight: 700,
                  color: '#000', cursor: 'pointer',
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  transition: 'opacity 0.2s',
                  boxShadow: '0 4px 20px rgba(255,211,105,0.2)',
                }}
              >
                {isLastStep ? 'Review Answers →' : 'Next →'}
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting || captchaReady === false}
                style={{
                  background: submitting ? 'rgba(255,211,105,0.5)' : 'var(--color-accent, #ffd369)',
                  border: 'none', borderRadius: 10,
                  padding: '12px 32px',
                  fontSize: 14, fontWeight: 700,
                  color: '#000', cursor: submitting ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  transition: 'opacity 0.2s',
                  boxShadow: '0 4px 20px rgba(255,211,105,0.2)',
                }}
              >
                {submitting ? 'Submitting…' : (data.formSubmitLabel ?? 'Submit')}
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}
