'use client'

import { useEffect, useRef } from 'react'

interface MediaRef { url: string; alt?: string }

export interface SBStep {
  stepTitle: string
  stepBody: string
  stepIcon?: MediaRef | null
  stepFeatured?: boolean
}

export interface StepScrollSectionData {
  sbTitle?: string
  sbSubtitle?: string
  sbSteps?: SBStep[]
}

const ICON_DISCOVERY   = '/media/step-icon-discovery.png'
const ICON_IDEATION    = '/media/step-icon-ideation.png'
const ICON_DEVELOPMENT = '/media/step-icon-development.png'
const ICON_GTM         = '/media/step-icon-gtm.png'

const DEFAULT_STEPS: SBStep[] = [
  { stepTitle: 'Early-stage Discovery',           stepBody: 'Defining goals, identifying user needs, and establishing a solid foundation for the project.',          stepIcon: { url: ICON_DISCOVERY,   alt: 'Discovery'   }, stepFeatured: false },
  { stepTitle: 'Ideation & Validation',           stepBody: 'Generating creative solutions and testing assumptions to ensure market viability.',                     stepIcon: { url: ICON_IDEATION,    alt: 'Ideation'    }, stepFeatured: false },
  { stepTitle: 'Development & Technical Roadmap', stepBody: 'Building out the core infrastructure and planning the technical milestones for scale.',                 stepIcon: { url: ICON_DEVELOPMENT, alt: 'Development' }, stepFeatured: false },
  { stepTitle: 'Go-to-Market Strategy',           stepBody: 'Executing the launch plan and establishing a competitive presence in the industry.',                   stepIcon: { url: ICON_GTM,         alt: 'GTM'         }, stepFeatured: true  },
]

// Scroll pixels to reveal each successive step
const SCROLL_PER_ITEM = 300
// Header area: 96px top-padding + 40px title + 24px gap + 78px subtitle (3 lines×26px) + 80px gap-to-timeline
const HEADER_H = 318
// Per-step row height — matches Figma card height
const ROW_H    = 128
// Gap between step rows — matches Figma timeline gap
const ROW_GAP  = 32
// Bottom padding — matches Figma py-96px
const PAD_B    = 96

// Total height of the sticky panel — must fit all steps at once
function sectionH(n: number) {
  return HEADER_H + n * ROW_H + (n - 1) * ROW_GAP + PAD_B
}

const CSS = `
  /* ── Outer wrapper: tall to create scroll room ── */
  .sbw { position: relative; background: #ffffff; }

  /* ── Sticky panel: vertically centered in viewport ── */
  .sbs {
    position: sticky;
    overflow: hidden;
    background: #ffffff;
  }

  /* ── Header: py-96 px-40 gap-24 (Figma 1393:11534) ── */
  .sbhdr {
    display: flex; flex-direction: column; align-items: center;
    gap: 24px;
    padding: 96px 40px 0;
    box-sizing: border-box;
  }
  .sbtitle {
    font-family: 'Work Sans', sans-serif; font-weight: 500;
    font-size: 36px; line-height: 40px; color: #111827;
    text-align: center; margin: 0;
  }
  .sbsub {
    font-family: 'Work Sans', sans-serif; font-weight: 400;
    font-size: 16px; line-height: 26px; color: #4b5563;
    text-align: center; max-width: 768px; margin: 0;
  }

  /* ── Timeline: w-720 gap-32 margin-top-80 (Figma 1393:11540) ── */
  .sbtl {
    display: flex; flex-direction: column;
    gap: ${ROW_GAP}px;
    max-width: 720px; width: 100%;
    margin: 80px auto 0;
    padding: 0 0 ${PAD_B}px;
    box-sizing: border-box;
  }

  /* ── Step row: gap-32 items-center (Figma 1393:11541) ── */
  .sbrow {
    display: flex; gap: 32px; align-items: center;
    position: relative;
    opacity: 0;
    transform: translateY(22px);
    transition: opacity 0.45s cubic-bezier(0.22,1,0.36,1),
                transform 0.45s cubic-bezier(0.22,1,0.36,1);
  }
  .sbrow--vis {
    opacity: 1;
    transform: translateY(0);
  }
  .sbrow--hide {
    opacity: 0;
    transform: translateY(22px);
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  /* ── Yellow connector line: left-31 top-64 bottom--32 w-4 (Figma 1393:11546) ── */
  .sbline {
    position: absolute;
    left: 31px; top: 64px; bottom: -32px; width: 4px;
    background: #ffd15b;
    transform-origin: top;
    transform: scaleY(0);
    transition: transform 0.35s cubic-bezier(0.22,1,0.36,1) 0.2s;
  }
  .sbline--vis { transform: scaleY(1); }
  .sbline--hide {
    transform: scaleY(0);
    transition: transform 0.2s ease;
  }

  /* ── Icon circle: size-64 bg-#2b2b2b (Figma 1393:11542) ── */
  .sbicon {
    flex-shrink: 0;
    width: 64px; height: 64px; border-radius: 50%;
    background: #2b2b2b;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1);
    position: relative; z-index: 1;
  }
  .sbicon img { display: block; max-width: 25px; max-height: 20px; object-fit: contain; }
  .sbicon__num { color: #fff; font-weight: 700; font-size: 18px; }

  /* ── Card: h-128 p-32 rounded-12 (Figma 1393:11547) ── */
  .sbcard {
    flex: 1 0 0; height: 128px;
    display: flex; align-items: center;
    padding: 32px; border-radius: 12px;
    overflow: hidden; position: relative; min-width: 0;
  }
  .sbcard--odd  { background: #4a4a4a; }
  .sbcard--even { background: #1e1e1e; }

  /* Ghost number: font-100 bottom--16 right-16 (Figma 1393:11549) */
  .sbcard__num {
    position: absolute; bottom: -16px; right: 16px;
    font-family: 'Work Sans', sans-serif; font-weight: 900;
    font-size: 100px; line-height: 100px;
    pointer-events: none; user-select: none;
  }
  .sbcard--odd  .sbcard__num { color: rgba(255,255,255,0.10); }
  .sbcard--even .sbcard__num { color: rgba(255,255,255,0.05); }

  /* Card body: w-420 gap-7.25 (Figma 1393:11550) */
  .sbcard__body {
    position: relative; z-index: 1;
    display: flex; flex-direction: column; gap: 7.25px;
    max-width: 420px;
  }
  .sbcard__title {
    font-family: 'Work Sans', sans-serif; font-weight: 700;
    font-size: 20px; line-height: 28px; color: #ffffff; margin: 0;
  }
  .sbcard__title--featured { color: #ffd15b; }
  .sbcard__desc {
    font-family: 'Work Sans', sans-serif; font-weight: 400;
    font-size: 12px; line-height: 19.5px; color: #d1d5db; margin: 0;
  }

  /* ── Progress dots ── */
  .sbdots {
    position: absolute;
    right: clamp(8px, calc((100% - 720px) / 2 - 24px), 120px);
    top: 50%; transform: translateY(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    z-index: 10;
  }
  .sbdot {
    display: block; width: 2px; height: 18px; border-radius: 2px;
    background: #d1d5db;
    transition: height 0.3s ease, background 0.3s ease;
    cursor: pointer; border: none; padding: 0; flex-shrink: 0;
  }
  .sbdot--active { height: 36px; background: #ffd25e; }

  /* ── Mobile: disable sticky, show all stacked ── */
  @media (max-width: 767px) {
    .sbw  { height: auto !important; }
    .sbs  { position: relative !important; height: auto !important; top: 0 !important; }
    .sbrow { opacity: 1 !important; transform: none !important; }
    .sbdots { display: none; }
    .sbhdr { padding: 48px 24px 0; }
    .sbtl { margin-top: 40px; padding: 0 24px 48px; }
    .sbcard { height: auto; min-height: 96px; padding: 20px 24px; }
    .sbcard__num { font-size: 64px; line-height: 64px; }
  }
`

export default function StepScrollSection({ data }: { data: StepScrollSectionData }) {
  const steps   = data.sbSteps?.length ? data.sbSteps : DEFAULT_STEPS
  const n       = steps.length
  const SECT_H  = sectionH(n)

  const wrapRef    = useRef<HTMLDivElement>(null)
  const stickyRef  = useRef<HTMLDivElement>(null)
  const rowRefs    = useRef<(HTMLDivElement | null)[]>([])
  const lineRefs   = useRef<(HTMLDivElement | null)[]>([])
  const dotRefs    = useRef<(HTMLButtonElement | null)[]>([])
  const countRef   = useRef(0)  // how many steps are currently revealed

  useEffect(() => {
    if (n < 1) return
    const sticky = stickyRef.current
    if (sticky) {
      sticky.style.height = `${SECT_H}px`
      // Clamp to 16px min so on smaller viewports the panel never goes off-screen
      sticky.style.top    = `max(16px, calc(50vh - ${SECT_H / 2}px))`
    }

    const rows  = rowRefs.current.filter(Boolean)  as HTMLDivElement[]
    const lines = lineRefs.current.filter(Boolean) as HTMLDivElement[]
    const dots  = dotRefs.current.filter(Boolean)  as HTMLButtonElement[]

    function setDot(idx: number) {
      // Highest revealed step = idx (0-based), dots highlight up to idx
      dots.forEach((d, i) => d.classList.toggle('sbdot--active', i === idx))
    }

    const onScroll = () => {
      const wrap = wrapRef.current
      if (!wrap) return

      const centerOffset = (window.innerHeight - SECT_H) / 2
      const rawScrolled  = -(wrap.getBoundingClientRect().top - centerOffset)

      // How many steps should be visible (0 = none, n = all)
      const newCount = rawScrolled < 0
        ? 0
        : Math.min(Math.floor(rawScrolled / SCROLL_PER_ITEM) + 1, n)

      const prev = countRef.current
      if (newCount === prev) return

      if (newCount > prev) {
        // Reveal steps prev..(newCount-1)
        for (let i = prev; i < newCount; i++) {
          rows[i].classList.remove('sbrow--hide')
          rows[i].classList.add('sbrow--vis')
          if (i > 0 && lines[i - 1]) {
            lines[i - 1].classList.remove('sbline--hide')
            lines[i - 1].classList.add('sbline--vis')
          }
        }
      } else {
        // Hide steps (newCount)..(prev-1) in reverse order
        for (let i = prev - 1; i >= newCount; i--) {
          rows[i].classList.remove('sbrow--vis')
          rows[i].classList.add('sbrow--hide')
          if (i > 0 && lines[i - 1]) {
            lines[i - 1].classList.remove('sbline--vis')
            lines[i - 1].classList.add('sbline--hide')
          }
        }
      }

      countRef.current = newCount
      setDot(Math.max(0, newCount - 1))
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [n, SECT_H])

  if (n === 0) return null

  // Extra scroll at end so all steps stay visible briefly before block scrolls away
  const wrapH = SECT_H + (n - 1) * SCROLL_PER_ITEM + SCROLL_PER_ITEM

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="sbw" ref={wrapRef} style={{ height: wrapH }}>
        <div className="sbs" ref={stickyRef}>

          {/* Header */}
          <div className="sbhdr">
            {data.sbTitle    && <h2 className="sbtitle">{data.sbTitle}</h2>}
            {data.sbSubtitle && <p  className="sbsub">{data.sbSubtitle}</p>}
          </div>

          {/* Progress dots */}
          {n > 1 && (
            <div className="sbdots">
              {steps.map((_, i) => (
                <button
                  key={i}
                  className="sbdot"
                  ref={(el) => { dotRefs.current[i] = el }}
                  aria-label={`Step ${i + 1}`}
                  onClick={() => {
                    const wrap = wrapRef.current
                    if (!wrap) return
                    const centerOffset = (window.innerHeight - SECT_H) / 2
                    const wrapTop = wrap.getBoundingClientRect().top + window.scrollY
                    window.scrollTo({ top: wrapTop - centerOffset + i * SCROLL_PER_ITEM, behavior: 'smooth' })
                  }}
                />
              ))}
            </div>
          )}

          {/* Timeline */}
          <div className="sbtl">
            {steps.map((step, i) => {
              const isOdd  = i % 2 === 0
              const hasLine = i < n - 1
              return (
                <div
                  key={i}
                  className="sbrow"
                  ref={(el) => { rowRefs.current[i] = el }}
                >
                  {hasLine && (
                    <div
                      className="sbline"
                      ref={(el) => { lineRefs.current[i] = el }}
                    />
                  )}

                  <div className="sbicon">
                    {step.stepIcon?.url
                      ? <img src={step.stepIcon.url} alt={step.stepIcon.alt ?? ''} />
                      : <span className="sbicon__num">{i + 1}</span>
                    }
                  </div>

                  <div className={`sbcard${isOdd ? ' sbcard--odd' : ' sbcard--even'}`}>
                    <span className="sbcard__num">{i + 1}</span>
                    <div className="sbcard__body">
                      <p className={`sbcard__title${step.stepFeatured ? ' sbcard__title--featured' : ''}`}>
                        {step.stepTitle}
                      </p>
                      <p className="sbcard__desc">{step.stepBody}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </>
  )
}
