// Quote Form Section — white background, centered heading + large quote form

interface QuoteFormData {
  heading?:     string
  subheading?:  string
  submitLabel?: string
}

export default function QuoteFormSection({ data }: { data: QuoteFormData }) {
  const { heading, subheading, submitLabel = 'Request Your Quote' } = data

  return (
    <section id="quote" className="py-24 px-6 md:px-10" style={{ background: '#ffffff', borderTop: '1px solid #e5e5e5' }}>
      <div className="mx-auto flex flex-col items-center gap-6" style={{ maxWidth: '896px' }}>
        {heading && (
          <h2
            style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, color: '#171717', textAlign: 'center', letterSpacing: '-0.8px', lineHeight: 1 }}
          >
            {heading}
          </h2>
        )}
        {subheading && (
          <p className="text-center max-w-2xl" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.25rem', color: '#525252', lineHeight: '1.625' }}>
            {subheading}
          </p>
        )}

        <form className="w-full flex flex-col gap-6 mt-4" style={{ maxWidth: '672px' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <input type="text" placeholder="First Name *" className="w-full px-6 py-4 text-base outline-none" style={{ border: '2px solid #e5e5e5', background: '#ffffff', fontFamily: 'var(--font-work-sans, sans-serif)', color: '#171717' }} />
            <input type="text" placeholder="Last Name *" className="w-full px-6 py-4 text-base outline-none" style={{ border: '2px solid #e5e5e5', background: '#ffffff', fontFamily: 'var(--font-work-sans, sans-serif)', color: '#171717' }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <input type="email" placeholder="Email Address *" className="w-full px-6 py-4 text-base outline-none" style={{ border: '2px solid #e5e5e5', background: '#ffffff', fontFamily: 'var(--font-work-sans, sans-serif)', color: '#171717' }} />
            <input type="tel" placeholder="Phone Number" className="w-full px-6 py-4 text-base outline-none" style={{ border: '2px solid #e5e5e5', background: '#ffffff', fontFamily: 'var(--font-work-sans, sans-serif)', color: '#171717' }} />
          </div>
          <input type="text" placeholder="Company Name" className="w-full px-6 py-4 text-base outline-none" style={{ border: '2px solid #e5e5e5', background: '#ffffff', fontFamily: 'var(--font-work-sans, sans-serif)', color: '#171717' }} />
          <select className="w-full px-6 py-4 text-base outline-none appearance-none" style={{ border: '2px solid #e5e5e5', background: '#efefef', fontFamily: 'var(--font-work-sans, sans-serif)', color: '#525252' }}>
            <option value="">Select Service Type *</option>
            <option>Web Development</option>
            <option>Mobile Development</option>
            <option>IT Consulting</option>
            <option>HR Recruitment</option>
            <option>Cloud Solutions</option>
          </select>
          <select className="w-full px-6 py-4 text-base outline-none appearance-none" style={{ border: '2px solid #e5e5e5', background: '#efefef', fontFamily: 'var(--font-work-sans, sans-serif)', color: '#525252' }}>
            <option value="">Select &ldquo;Service Selected&rdquo; Type *</option>
            <option>Basic</option>
            <option>Standard</option>
            <option>Enterprise</option>
          </select>
          <select className="w-full px-6 py-4 text-base outline-none appearance-none" style={{ border: '2px solid #e5e5e5', background: '#efefef', fontFamily: 'var(--font-work-sans, sans-serif)', color: '#525252' }}>
            <option value="">Development Time *</option>
            <option>1-3 months</option>
            <option>3-6 months</option>
            <option>6-12 months</option>
            <option>12+ months</option>
          </select>
          <textarea placeholder="Project Details *" rows={5} className="w-full px-6 py-4 text-base outline-none resize-none" style={{ border: '2px solid #e5e5e5', background: '#ffffff', fontFamily: 'var(--font-work-sans, sans-serif)', color: '#171717' }} />
          <button
            type="submit"
            className="w-full py-5 text-lg font-normal transition-opacity duration-200 hover:opacity-80"
            style={{ background: '#171717', color: '#ffffff', fontFamily: 'var(--font-work-sans, sans-serif)' }}
          >
            {submitLabel}
          </button>
        </form>
      </div>
    </section>
  )
}
