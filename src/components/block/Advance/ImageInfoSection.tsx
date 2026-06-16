'use client'

import { useEffect, useRef, useState } from 'react'

interface MediaRef { url: string; alt?: string }

export interface IIBPin {
  label: string
  icon?: string
  iconBg?: string
  posX: number
  posY: number
  lineLength?: number
  showDot?: boolean
}

export interface ImageInfoSectionData {
  iibTitle?: string
  iibSubtitle?: string
  iibBgImage?: MediaRef | null
  iibMode?: 'scroll' | 'hover'
  iibTooltipText?: string
  iibTooltipMascot?: MediaRef | null
  iibPins?: IIBPin[]
}

const SCROLL_PER_PIN = 200
// Header area height: 96px top + ~140px heading block + 64px gap
const HEADER_H = 300
// Map height
const MAP_H    = 800
// Bottom padding
const FOOT_H   = 96
const SECTION_H = HEADER_H + MAP_H + FOOT_H

const DEFAULT_PINS: IIBPin[] = [
  { label: 'Chinese hires',                                          icon: '🇨🇳', iconBg: '#dc2626', posX: 44, posY: 22, lineLength: 112 },
  { label: 'Managed with Teamtrics — remote performance, tracked',   icon: '',    iconBg: '',        posX: 30, posY: 43, lineLength: 0   },
  { label: 'Malaysian hires cover Cantonese-speaking roles',         icon: '🇲🇾', iconBg: '#1e40af', posX: 34, posY: 60, lineLength: 80  },
  { label: 'Indonesian talent reduces overhead',                     icon: '🇮🇩', iconBg: '#ef4444', posX: 50, posY: 74, lineLength: 112 },
]

const CSS = `
  /* ── Wrapper ── */
  .iibw { position: relative; background: #ffffff; }

  /* ── Sticky panel ── */
  .iibs { position: sticky; top: 0; background: #ffffff; overflow: hidden; }

  /* ── Header ── */
  .iibhdr { display: flex; flex-direction: column; align-items: center; gap: 24px; padding: 96px 40px 0; }
  .iibtitle {
    font-family: 'Work Sans', sans-serif; font-weight: 500;
    font-size: 36px; line-height: 40px; color: #111827;
    text-align: center; margin: 0;
  }
  .iibsub {
    font-family: 'Work Sans', sans-serif; font-weight: 400;
    font-size: 16px; line-height: 24px; color: #4b5563;
    text-align: center; max-width: 768px; margin: 0;
  }

  /* ── Map container ── */
  .iibmap {
    position: relative; max-width: 1200px; height: 800px;
    margin: 64px auto 96px; width: 100%;
  }
  .iibmap__bg {
    position: absolute; inset: 0; opacity: 0.8; pointer-events: none; overflow: hidden;
  }
  .iibmap__bg img { position: absolute; height: 100%; left: 0; top: 0; max-width: none; }

  /* ── Dot marker ── */
  .iibdot {
    position: absolute; transform: translate(-50%, -50%);
    z-index: 10; cursor: pointer;
    width: 20px; height: 20px;
    display: flex; align-items: center; justify-content: center;
  }
  .iibdot__inner {
    width: 10px; height: 10px; border-radius: 50%;
    background: #1f2937; border: 2px solid #fff;
    box-shadow: 0 0 0 2px #1f2937;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .iibdot--active .iibdot__inner {
    transform: scale(1.4);
    box-shadow: 0 0 0 3px #1f2937, 0 0 12px rgba(31,41,55,0.4);
    background: #111827;
  }

  /* ── Pin group (line + chip) ── */
  .iibpin {
    position: absolute; transform: translateY(-50%);
    display: flex; align-items: center; z-index: 20;
    transition: opacity 0.45s cubic-bezier(0.22,1,0.36,1),
                transform 0.45s cubic-bezier(0.22,1,0.36,1);
  }
  .iibpin--scroll   { opacity: 0; pointer-events: none; transform: translateY(-50%) translateX(12px); }
  .iibpin--scroll.iibpin--vis { opacity: 1; pointer-events: auto; transform: translateY(-50%) translateX(0); }
  .iibpin--hover    { opacity: 0; pointer-events: none; transform: translateY(-50%) translateX(12px); }
  .iibpin--hover.iibpin--vis  { opacity: 1; pointer-events: auto; transform: translateY(-50%) translateX(0); }

  .iibline { height: 1px; background: #1f2937; margin-right: 12px; flex-shrink: 0; }

  .iibchip {
    background: #4a4a4a; border-radius: 9999px; padding: 10px 20px;
    display: flex; align-items: center; gap: 12px; flex-shrink: 0;
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1);
    position: relative;
  }
  .iibchip__icon {
    width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; line-height: 1; overflow: hidden;
  }
  .iibchip__label {
    font-family: 'Work Sans', sans-serif; font-size: 14px;
    line-height: 20px; color: #fff; white-space: nowrap; font-weight: 400;
  }

  /* ── Paging dots (inside map, right edge) ── */
  .iibpaging {
    position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
    display: flex; flex-direction: column; gap: 10px; z-index: 30;
  }
  .iibpaging__btn {
    width: 8px; height: 8px; border-radius: 50%;
    background: #d1d5db; border: none; padding: 0; cursor: pointer;
    transition: background 0.2s, transform 0.2s;
  }
  .iibpaging__btn--active { background: #1f2937; transform: scale(1.25); }

  /* ── Tooltip bubble ── */
  .iibtooltip {
    position: absolute; bottom: 0; right: 32px;
    display: flex; flex-direction: column; align-items: flex-end; z-index: 30;
    isolation: isolate;
  }
  .iibbubble {
    background: #e5e7eb; border-radius: 16px 16px 4px 16px;
    padding: 16px; max-width: 320px; position: relative;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
    z-index: 2;
  }
  .iibbubble p {
    font-family: 'Work Sans', sans-serif; font-size: 12px;
    line-height: 16px; color: #1f2937; margin: 0;
  }
  .iibbubble__tail {
    position: absolute; bottom: -9.32px; right: 16.69px;
    width: 22.627px; height: 22.627px;
    display: flex; align-items: center; justify-content: center;
  }
  .iibbubble__tail-inner {
    width: 16px; height: 16px; background: #e5e7eb; transform: rotate(45deg);
  }
  .iibmascot { width: 52px; height: 52px; position: relative; z-index: 1; }
  .iibmascot img { position: absolute; width: 96px; height: 96px; left: -22px; top: -22px; }

  /* ── Hover pulse ring ── */
  @keyframes iibpulse {
    0%   { box-shadow: 0 0 0 0 rgba(31,41,55,0.4); }
    70%  { box-shadow: 0 0 0 8px rgba(31,41,55,0); }
    100% { box-shadow: 0 0 0 0 rgba(31,41,55,0); }
  }
  .iibdot--hover-mode .iibdot__inner { animation: iibpulse 2s infinite; }
`

export default function ImageInfoSection({ data }: { data: ImageInfoSectionData }) {
  const pins  = data.iibPins?.length ? data.iibPins : DEFAULT_PINS
  const mode  = data.iibMode ?? 'scroll'
  const wrapRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    if (mode !== 'scroll') return
    const wrapper = wrapRef.current
    if (!wrapper) return

    function update() {
      const top     = wrapper!.getBoundingClientRect().top
      const scrolled = -top
      const idx = Math.min(Math.max(0, Math.floor(scrolled / SCROLL_PER_PIN)), pins.length - 1)
      setActiveIdx(Math.max(0, idx))
    }

    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [mode, pins.length])

  const wrapperH = mode === 'scroll' ? SECTION_H + pins.length * SCROLL_PER_PIN : 'auto'

  return (
    <div
      ref={wrapRef}
      className="iibw"
      style={{ height: wrapperH }}
    >
      <style>{CSS}</style>

      {/* ── Sticky panel ── */}
      <div className="iibs" style={{ height: mode === 'scroll' ? SECTION_H : 'auto' }}>

        {/* Heading */}
        <div className="iibhdr">
          {data.iibTitle && <h2 className="iibtitle">{data.iibTitle}</h2>}
          {data.iibSubtitle && <p className="iibsub">{data.iibSubtitle}</p>}
        </div>

        {/* Map */}
        <div className="iibmap">

          {/* Background image */}
          {data.iibBgImage?.url && (
            <div className="iibmap__bg">
              <img src={data.iibBgImage.url} alt={data.iibBgImage.alt ?? ''} />
            </div>
          )}

          {pins.map((pin, i) => {
            const isActive = i === activeIdx
            const vis      = isActive ? ' iibpin--vis' : ''
            const dotClass = `iibdot${isActive ? ' iibdot--active' : ''}${mode === 'hover' ? ' iibdot--hover-mode' : ''}`

            return (
              <div key={i}>
                {/* Dot on map — optional */}
                {(pin.showDot ?? true) && (
                  <div
                    className={dotClass}
                    style={{ left: `${pin.posX}%`, top: `${pin.posY}%` }}
                    onMouseEnter={() => mode === 'hover' && setActiveIdx(i)}
                    onClick={() => setActiveIdx(i)}
                  >
                    <div className="iibdot__inner" />
                  </div>
                )}

                {/* Pin pill — posX/posY is the label anchor */}
                <div
                  className={`iibpin iibpin--${mode}${vis}`}
                  style={{ left: `${pin.posX}%`, top: `${pin.posY}%` }}
                  onMouseEnter={() => mode === 'hover' && !(pin.showDot ?? true) && setActiveIdx(i)}
                >
                  {(pin.lineLength ?? 0) > 0 && (
                    <div className="iibline" style={{ width: pin.lineLength }} />
                  )}
                  <div className="iibchip">
                    {pin.icon && (
                      <div className="iibchip__icon" style={{ background: pin.iconBg ?? '#4a4a4a' }}>
                        {pin.icon}
                      </div>
                    )}
                    <span className="iibchip__label">{pin.label}</span>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Paging dots — click jumps to that pin's scroll position */}
          <div className="iibpaging">
            {pins.map((_, i) => (
              <button
                key={i}
                className={`iibpaging__btn${i === activeIdx ? ' iibpaging__btn--active' : ''}`}
                onClick={() => {
                  if (mode === 'hover') { setActiveIdx(i); return }
                  const wrap = wrapRef.current
                  if (!wrap) return
                  const wrapTop = wrap.getBoundingClientRect().top + window.scrollY
                  window.scrollTo({ top: wrapTop + i * SCROLL_PER_PIN, behavior: 'smooth' })
                }}
                aria-label={`Pin ${i + 1}`}
              />
            ))}
          </div>

          {/* Tooltip + mascot */}
          {data.iibTooltipText && (
            <div className="iibtooltip">
              <div className="iibbubble">
                <p>{data.iibTooltipText}</p>
                <div className="iibbubble__tail">
                  <div className="iibbubble__tail-inner" />
                </div>
              </div>
              {data.iibTooltipMascot?.url && (
                <div className="iibmascot">
                  <img src={data.iibTooltipMascot.url} alt="" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
