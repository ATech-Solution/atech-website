'use client'

import { useEffect, useRef } from 'react'

interface MediaRef { url: string; alt?: string }

export interface CaseStudyScrollItem {
  cssImage?:      MediaRef | null
  cssClientLogo?: MediaRef | null
  cssHeading?:    string
  cssBody?:       string
}

export interface CaseStudyScrollSectionData {
  caseScrollItems?: CaseStudyScrollItem[]
}

// Each item needs this many pixels of scroll to transition to the next
const SCROLL_PER_ITEM = 600
// Section visual height: 80px padding-top + 400px image + 80px padding-bottom
const SECTION_H = 560

const CSS = `
  /* ── Outer wrapper: tall to create scroll room ── */
  .cssw {
    position: relative;
  }

  /* ── Sticky panel: stays in viewport while wrapper scrolls ── */
  .csss {
    position: sticky;
    top: 0;
    height: ${SECTION_H}px;
    overflow: hidden;
    background: #ffffff;
  }

  /* ── All items: absolutely stacked, only one visible at a time ── */
  .cssi {
    position: absolute;
    inset: 0;
    padding: 80px clamp(24px, calc((100% - 1024px) / 2), 208px);
    box-sizing: border-box;
    background: #ffffff;
    opacity: 0;
    will-change: opacity;
  }
  .cssi--active {
    opacity: 1;
    z-index: 1;
  }

  /* ── Inner 1024px flex row ── */
  .cssin {
    max-width: 1024px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 64px;
    width: 100%;
    height: 100%;
  }

  /* ── Left col: 478.97px, card pushed to the right ── */
  .cssic {
    flex-shrink: 0;
    width: 478.97px;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
  }

  /* ── Image card: 400×400px ── */
  .csscard {
    width: 400px;
    height: 400px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1);
    background: #e5e7eb;
    flex-shrink: 0;
  }
  .csscard img {
    width: 100%; height: 100%; object-fit: cover; display: block;
  }

  /* ── Right col: fixed 481.03px ── */
  .csscc {
    flex-shrink: 0;
    width: 481.03px;
    padding-left: 32px;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 15.4px;
  }

  /* ── 4px left border with animated yellow fill ── */
  .cssborder {
    position: absolute;
    left: 0; top: 0; bottom: 0.9px;
    width: 4px;
    background: #e5e7eb;
    border-radius: 2px;
    overflow: hidden;
  }
  .cssborderfill {
    position: absolute;
    top: 0; left: 0; width: 100%;
    height: 0;
    background: #ffd25e;
    border-radius: 2px;
    transition: height 0.5s ease-out 0.45s;
  }
  .cssborderfill--on { height: 100%; }

  /* ── Logo, heading, body ── */
  .csslogo {
    height: 64px;
    display: flex; flex-direction: column;
    align-items: flex-start; justify-content: center;
    overflow: hidden; flex-shrink: 0;
  }
  .csslogo img { max-height: 64px; width: auto; object-fit: contain; display: block; }
  .csshwrap { padding-top: 8.6px; flex-shrink: 0; width: 100%; }
  .cssh {
    font-family: var(--font-work-sans, sans-serif);
    font-size: 36px; font-weight: 700; line-height: 40px;
    color: #111827; margin: 0; word-break: break-word;
  }
  .cssbwrap { max-width: 448px; width: 448px; flex-shrink: 0; }
  .cssb {
    font-family: var(--font-work-sans, sans-serif);
    font-size: 14px; font-weight: 400; line-height: 22.75px;
    color: #4b5563; margin: 0;
  }

  /* ── Keyframe animations ── */

  /* Scroll DOWN → new item: left from top, right from bottom */
  @keyframes css-img-dn  { from { opacity:0; transform:translateY(-52px); } to { opacity:1; transform:translateY(0); } }
  @keyframes css-con-dn  { from { opacity:0; transform:translateY( 52px); } to { opacity:1; transform:translateY(0); } }

  /* Scroll UP → new item: left from bottom, right from top */
  @keyframes css-img-up  { from { opacity:0; transform:translateY( 52px); } to { opacity:1; transform:translateY(0); } }
  @keyframes css-con-up  { from { opacity:0; transform:translateY(-52px); } to { opacity:1; transform:translateY(0); } }

  /* Exit: quick fade out */
  @keyframes css-fadeout { from { opacity:1; } to { opacity:0; } }

  .a-img-dn   { animation: css-img-dn   0.7s ease-out         forwards; }
  .a-con-dn   { animation: css-con-dn   0.7s ease-out 0.10s   forwards; }
  .a-img-up   { animation: css-img-up   0.7s ease-out         forwards; }
  .a-con-up   { animation: css-con-up   0.7s ease-out 0.10s   forwards; }
  .a-fadeout  { animation: css-fadeout  0.25s ease-out         forwards; }

  /* ── Scroll indicator dots ── */
  .cssdots {
    position: absolute;
    right: clamp(16px, calc((100% - 1024px) / 2 - 24px), 160px);
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 10;
  }
  .cssdot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #d1d5db;
    transition: background 0.3s ease, transform 0.3s ease;
    cursor: pointer;
    border: none;
    padding: 0;
  }
  .cssdot--active {
    background: #ffd25e;
    transform: scale(1.35);
  }

  /* ── Mobile: disable sticky, show all stacked ── */
  @media (max-width: 767px) {
    .cssw  { height: auto !important; }
    .csss  { position: relative !important; height: auto !important; overflow: visible !important; }
    .cssi  { position: relative !important; inset: auto !important; opacity: 1 !important; padding: 40px 24px !important; }
    .cssdots { display: none; }
    .cssin { flex-direction: column; gap: 24px; }
    .cssic { width: 100%; justify-content: center; }
    .csscard { width: 100%; height: 260px; }
    .csscc { width: 100%; }
    .cssbwrap { width: 100%; max-width: 100%; }
  }

  /* ── Tablet 768–1100px: proportional columns ── */
  @media (min-width: 768px) and (max-width: 1100px) {
    .cssic   { width: 46%; }
    .csscard { width: 100%; max-width: 400px; }
    .csscc   { width: 46%; }
    .cssbwrap { width: 100%; max-width: 100%; }
  }
`

const ALL_ANIM = ['a-img-dn','a-con-dn','a-img-up','a-con-up','a-fadeout']

function clearAnims(el: HTMLElement) {
  el.classList.remove(...ALL_ANIM)
  // Force reflow so re-adding the same class re-triggers animation
  void el.offsetWidth
}

function transition(
  outRow: HTMLDivElement,
  inRow:  HTMLDivElement,
  dir:    'down' | 'up',
) {
  const outImg  = outRow.querySelector('.cssic')          as HTMLElement | null
  const outCon  = outRow.querySelector('.csscc')          as HTMLElement | null
  const inImg   = inRow.querySelector('.cssic')           as HTMLElement | null
  const inCon   = inRow.querySelector('.csscc')           as HTMLElement | null
  const inFill  = inRow.querySelector('.cssborderfill')   as HTMLElement | null
  const outFill = outRow.querySelector('.cssborderfill')  as HTMLElement | null

  // Exit current: fade out
  if (outImg) { clearAnims(outImg); outImg.classList.add('a-fadeout') }
  if (outCon) { clearAnims(outCon); outCon.classList.add('a-fadeout') }
  if (outFill) outFill.classList.remove('cssborderfill--on')

  // Reset next item's border fill
  if (inFill) inFill.classList.remove('cssborderfill--on')

  // Show next item behind current while exit plays
  inRow.style.zIndex  = '0'
  inRow.style.opacity = '1'

  // Enter next item
  const imgAnim = dir === 'down' ? 'a-img-dn' : 'a-img-up'
  const conAnim = dir === 'down' ? 'a-con-dn' : 'a-con-up'
  if (inImg) { clearAnims(inImg); inImg.classList.add(imgAnim) }
  if (inCon) { clearAnims(inCon); inCon.classList.add(conAnim) }

  // After exit fade, bring next row fully on top
  setTimeout(() => {
    outRow.style.opacity = '0'
    outRow.style.zIndex  = '0'
    inRow.style.zIndex   = '1'
    if (inFill) inFill.classList.add('cssborderfill--on')
  }, 260)
}

export default function CaseStudyScrollSection({ data }: { data: CaseStudyScrollSectionData }) {
  const wrapRef  = useRef<HTMLDivElement>(null)
  const rowRefs  = useRef<(HTMLDivElement | null)[]>([])
  const dotRefs  = useRef<(HTMLButtonElement | null)[]>([])
  const idxRef   = useRef(0)
  const items    = data.caseScrollItems ?? []
  const n        = items.length

  useEffect(() => {
    if (n < 1) return
    const rows = rowRefs.current.filter(Boolean) as HTMLDivElement[]
    const dots = dotRefs.current.filter(Boolean)  as HTMLButtonElement[]
    if (rows.length === 0) return

    // ── Initial state ──
    rows.forEach((row, i) => {
      row.style.opacity = i === 0 ? '1' : '0'
      row.style.zIndex  = i === 0 ? '1' : '0'
    })
    dots.forEach((d, i) => d.classList.toggle('cssdot--active', i === 0))

    // Animate first item in on mount
    const firstImg  = rows[0].querySelector('.cssic')         as HTMLElement | null
    const firstCon  = rows[0].querySelector('.csscc')         as HTMLElement | null
    const firstFill = rows[0].querySelector('.cssborderfill') as HTMLElement | null
    if (firstImg) { clearAnims(firstImg); firstImg.classList.add('a-img-dn') }
    if (firstCon) { clearAnims(firstCon); firstCon.classList.add('a-con-dn') }
    if (firstFill) setTimeout(() => firstFill.classList.add('cssborderfill--on'), 100)

    // ── Scroll handler ──
    const onScroll = () => {
      const wrap = wrapRef.current
      if (!wrap) return

      const scrolledIn = Math.max(0, -wrap.getBoundingClientRect().top)
      const newIdx     = Math.min(Math.max(0, Math.floor(scrolledIn / SCROLL_PER_ITEM)), n - 1)
      const curIdx     = idxRef.current
      if (newIdx === curIdx) return

      const dir = newIdx > curIdx ? 'down' : 'up'
      transition(rows[curIdx], rows[newIdx], dir)

      // Update dots
      dots.forEach((d, i) => d.classList.toggle('cssdot--active', i === newIdx))

      idxRef.current = newIdx
    }

    // Fire once on mount in case page is already scrolled into section
    onScroll()

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [n])

  if (n === 0) return null

  const wrapH = SECTION_H + (n - 1) * SCROLL_PER_ITEM

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="cssw" ref={wrapRef} style={{ height: wrapH }}>
        <div className="csss">

          {/* Progress dots */}
          {n > 1 && (
            <div className="cssdots">
              {items.map((_, i) => (
                <button
                  key={i}
                  className="cssdot"
                  ref={(el) => { dotRefs.current[i] = el }}
                  aria-label={`Go to case study ${i + 1}`}
                  onClick={() => {
                    const wrap = wrapRef.current
                    if (!wrap) return
                    const wrapTop  = wrap.getBoundingClientRect().top + window.scrollY
                    const targetY  = wrapTop + i * SCROLL_PER_ITEM
                    window.scrollTo({ top: targetY, behavior: 'smooth' })
                  }}
                />
              ))}
            </div>
          )}

          {/* Items */}
          {items.map((item, i) => (
            <div
              key={i}
              className="cssi"
              ref={(el) => { rowRefs.current[i] = el }}
            >
              <div className="cssin">
                {/* Left: image card */}
                <div className="cssic">
                  <div className="csscard">
                    {item.cssImage?.url && (
                      <img src={item.cssImage.url} alt={item.cssImage.alt ?? 'Case study'} />
                    )}
                  </div>
                </div>

                {/* Right: content */}
                <div className="csscc">
                  <div className="cssborder">
                    <div className="cssborderfill" />
                  </div>
                  {item.cssClientLogo?.url && (
                    <div className="csslogo">
                      <img src={item.cssClientLogo.url} alt={item.cssClientLogo.alt ?? 'Client logo'} />
                    </div>
                  )}
                  {item.cssHeading && (
                    <div className="csshwrap">
                      <h3 className="cssh">{item.cssHeading}</h3>
                    </div>
                  )}
                  {item.cssBody && (
                    <div className="cssbwrap">
                      <p className="cssb">{item.cssBody}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </>
  )
}
