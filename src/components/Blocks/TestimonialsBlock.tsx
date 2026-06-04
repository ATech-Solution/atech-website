// Client Testimonials section — Figma node 1:26597
// Yellow (#ffd369) background, centered heading, 3 white testimonial cards

import SectionHeader from '@/components/ui/SectionHeader'
import TestimonialCard from '@/components/ui/TestimonialCard'

interface TestimonialItem {
  name: string
  role?: string
  company?: string
  quote: string
  rating?: number
}

interface TestimonialsData {
  heading: string
  subheading: string
  items: TestimonialItem[]
}

export default function TestimonialsBlock({ data }: { data: TestimonialsData }) {
  const { heading, subheading, items } = data

  return (
    <section
      className="py-20"
      style={{ background: '#ffd369' }}
    >
      <div className="mx-auto px-6 md:px-10" style={{ maxWidth: '1280px' }}>
        {/* Section heading — dark text on yellow background */}
        <div className="mb-16">
          <SectionHeader
            heading={heading}
            subheading={subheading}
            align="center"
            headingColor="#171717"
            subheadingColor="#525252"
            headingFontWeight={400}
          />
        </div>

        {/* Testimonial cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {items.map((item) => (
            <TestimonialCard
              key={item.name}
              name={item.name}
              role={item.role}
              company={item.company}
              quote={item.quote}
              rating={item.rating}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
