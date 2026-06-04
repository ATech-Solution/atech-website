import type { Payload } from 'payload'

export async function seedChatbotContent(payload: Payload): Promise<void> {
  try {
    const existing = await payload.findGlobal({ slug: 'chatbot-settings' as any })
    if (existing?.nodes && (existing.nodes as any[]).length > 0) return

    await payload.updateGlobal({
      slug: 'chatbot-settings' as any,
      data: {
        active: true,
        botName: 'ATech Assistant',
        greetingMessage:
          'Hello, what can I help you with? Please enter a number of the following options:',
        defaultWhatsappUrl: 'https://wa.me/85297496042',
        contactFormTitle:
          'Please leave your name and email. Our team will contact you shortly.',
        showOnAllPages: true,
        nodes: [
          {
            label: 'What services does ATech Solution offer?',
            answer:
              'ATech Solution offers software development, recruitment services, and consultation for businesses.',
            showContactForm: false,
            showWhatsapp: true,
          },
          {
            label: 'Where are the offices of ATech Solution located?',
            answer: 'ATech Solution has offices in Hong Kong, Indonesia, and Malaysia.',
            showContactForm: false,
            showWhatsapp: false,
          },
          {
            label: 'How much does it cost to build a website?',
            answer:
              'The cost of building a website varies based on factors like complexity, required features, design elements, and platform used. A basic static website with fundamental features typically starts at HKD 15,000 and increases from there. For an accurate estimate tailored to your specific website, use our Get a Quote feature or consult with one of our professionals. They can assess your needs and provide a detailed quote based on your requirements.',
            showContactForm: true,
            showWhatsapp: true,
          },
          {
            label: 'How much does it cost to build a mobile app?',
            answer:
              'The cost of building a mobile app varies widely based on factors like app complexity, target platform (iOS, Android, or both), required features, design complexity, backend integration, and the development team\'s location and rates. Developing a simple mobile app with minimal features typically starts at HKD 30,000 and increases from there. For an accurate estimate, use our Get a Quote feature or consult with our professionals, who can assess your needs and provide a detailed quote.',
            showContactForm: true,
            showWhatsapp: true,
          },
          {
            label: 'What does it mean by offshore team?',
            answer:
              'An offshore team refers to professionals or a company located outside Hong Kong. These teams perform tasks or projects remotely, offering cost-effectiveness, specialized skills, and around-the-clock productivity due to time zone differences. Offshore teams can provide services like software development, customer support, and design, allowing businesses to access global talent without physical proximity. Use our Get a Quote feature or consult our professionals for a detailed quote.',
            showContactForm: true,
            showWhatsapp: true,
          },
          {
            label: 'Does ATech use waterfall or agile project management methodology?',
            answer:
              'ATech commonly prefers Agile methodologies due to their flexibility, iterative nature, and focus on customer collaboration. Agile enables adaptation to changing requirements and incremental value delivery, which suits the dynamic and evolving characteristics of software projects. Nevertheless, the specific methodology chosen is determined by the project\'s needs, requirements, and nature.',
            showContactForm: false,
            showWhatsapp: false,
          },
          {
            label: 'What types of software can ATech build?',
            answer:
              'ATech Solution can build a variety of software solutions to meet diverse business needs. They develop desktop and mobile applications, web applications with interactive features, and content management systems (CMS) for managing website content. Their expertise includes customer relationship management (CRM) systems, enterprise resource planning (ERP) systems, e-commerce platforms, custom business applications, database management systems, and cloud-based solutions.',
            showContactForm: false,
            showWhatsapp: true,
          },
          {
            label: 'What types of services does ATech provide?',
            answer:
              'ATech Solution offers a range of services for businesses seeking technology-driven growth. They provide customized software development, recruitment for onshore and offshore talent, and consultation on technology and digital transformation. They also offer IT strategy development, product design, desktop and mobile app creation, UI/UX design, AI-powered performance enhancement, and strategic talent recruitment from regions like Hong Kong and Indonesia.',
            showContactForm: false,
            showWhatsapp: true,
          },
          {
            label: 'What is Capacitor?',
            answer:
              'Teamtrics is ATech\'s SaaS platform using AI to bridge the gap between management and employees. It offers a time management tool for staff and AI-driven analytics for management, addressing conflicts between control and flexibility. This boosts productivity, recognizes employee efforts, and supports long-term company growth. For more information on Teamtrics, please visit: https://teamtrics.com',
            showContactForm: false,
            showWhatsapp: false,
          },
        ],
      } as any,
    })

    payload.logger.info('✅ Chatbot plugin: seeded initial Q&A content into chatbot-settings Global.')
  } catch (err) {
    payload.logger.warn(`⚠ Chatbot plugin seed skipped: ${(err as Error).message}`)
  }
}
