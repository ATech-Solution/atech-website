export default function MaintenancePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #09090f;
          --surface: #111118;
          --border: rgba(255,255,255,0.07);
          --accent: #c8f135;
          --accent-dim: rgba(200,241,53,0.12);
          --text: #f0f0f0;
          --muted: rgba(240,240,240,0.38);
        }

        html, body {
          height: 100%;
          background: var(--bg);
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
        }

        .wrap {
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 2rem;
          isolation: isolate;
        }

        /* Layered background */
        .wrap::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 20% 10%, rgba(200,241,53,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 80% 90%, rgba(79,70,229,0.08) 0%, transparent 55%),
            radial-gradient(ellipse 40% 40% at 50% 50%, rgba(200,241,53,0.03) 0%, transparent 70%);
          z-index: -2;
        }

        /* Grid texture */
        .wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 90% 90% at 50% 50%, black 30%, transparent 80%);
          z-index: -1;
        }

        /* Floating orb */
        .orb {
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(200,241,53,0.07) 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: pulse-orb 4s ease-in-out infinite;
          pointer-events: none;
          z-index: -1;
        }

        @keyframes pulse-orb {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
        }

        /* Status pill */
        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--accent-dim);
          border: 1px solid rgba(200,241,53,0.25);
          border-radius: 100px;
          padding: 0.375rem 1rem;
          font-size: 0.72rem;
          font-weight: 400;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 2.5rem;
          animation: fade-in 0.6s ease both;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          animation: blink 1.4s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }

        /* Main heading */
        h1 {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(3rem, 8vw, 6.5rem);
          line-height: 0.95;
          letter-spacing: -0.03em;
          text-align: center;
          animation: slide-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
        }

        h1 span {
          display: block;
          color: var(--accent);
        }

        /* Subtext */
        p.sub {
          margin-top: 1.75rem;
          font-size: clamp(0.95rem, 2vw, 1.05rem);
          color: var(--muted);
          font-weight: 300;
          line-height: 1.7;
          max-width: 440px;
          text-align: center;
          animation: slide-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
        }

        /* Progress bar */
        .progress-track {
          margin-top: 3rem;
          width: min(420px, 90vw);
          height: 2px;
          background: var(--border);
          border-radius: 2px;
          overflow: hidden;
          animation: fade-in 0.6s ease 0.4s both;
        }

        .progress-fill {
          height: 100%;
          width: 0%;
          background: linear-gradient(90deg, var(--accent), rgba(200,241,53,0.4));
          border-radius: 2px;
          animation: load-bar 2.8s cubic-bezier(0.4, 0, 0.2, 1) 0.6s forwards;
          box-shadow: 0 0 12px rgba(200,241,53,0.5);
        }

        @keyframes load-bar {
          0%   { width: 0%; }
          40%  { width: 55%; }
          70%  { width: 72%; }
          85%  { width: 81%; }
          100% { width: 87%; }
        }

        /* Stats row */
        .stats {
          display: flex;
          gap: 2.5rem;
          margin-top: 3rem;
          animation: slide-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          font-family: 'Syne', sans-serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--text);
          letter-spacing: -0.02em;
        }

        .stat-label {
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          margin-top: 0.2rem;
        }

        /* Divider */
        .divider {
          width: 1px;
          height: 36px;
          background: var(--border);
          align-self: center;
        }

        /* Corner decoration */
        .corner {
          position: absolute;
          width: 80px;
          height: 80px;
          opacity: 0.25;
        }
        .corner.tl { top: 2rem; left: 2rem; border-top: 1px solid var(--accent); border-left: 1px solid var(--accent); }
        .corner.br { bottom: 2rem; right: 2rem; border-bottom: 1px solid var(--accent); border-right: 1px solid var(--accent); }

        /* Animations */
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 480px) {
          .stats { gap: 1.5rem; }
          .stat-value { font-size: 1.3rem; }
          .corner { width: 50px; height: 50px; }
        }
      `}</style>

      <div className="wrap">
        <div className="orb" />
        <div className="corner tl" />
        <div className="corner br" />

        <div className="status-pill">
          <span className="dot" />
          System upgrade in progress
        </div>

        <h1>
          Under<br />
          <span>Construction.</span>
        </h1>

        <p className="sub">
          We&apos;re rebuilding something great. Our systems are temporarily offline while we upgrade — we&apos;ll be back shortly.
        </p>

        <div className="progress-track">
          <div className="progress-fill" />
        </div>

        <div className="stats">
          <div className="stat">
            <div className="stat-value">87%</div>
            <div className="stat-label">Complete</div>
          </div>
          <div className="divider" />
          <div className="stat">
            <div className="stat-value">ATech</div>
            <div className="stat-label">Systems</div>
          </div>
          <div className="divider" />
          <div className="stat">
            <div className="stat-value">Soon</div>
            <div className="stat-label">Back online</div>
          </div>
        </div>
      </div>
    </>
  )
}
