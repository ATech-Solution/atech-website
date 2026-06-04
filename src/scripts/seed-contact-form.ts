import payload from 'payload'
import config from '../payload.config'

async function main() {
  await payload.init({ config })

  // Check if Contact form already exists
  const existing = await payload.find({
    collection: 'forms',
    where: { title: { equals: 'Contact' } },
    limit: 1,
  })

  if (existing.totalDocs > 0) {
    console.log('Contact form already exists, id:', existing.docs[0].id)
    process.exit(0)
  }

  const form = await payload.create({
    collection: 'forms',
    data: {
      title: 'Contact',
      submitButtonLabel: 'Send Message',
      confirmationType: 'message',
      confirmationMessage: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'Thank you! We\'ll get back to you within 1–2 business days.' }],
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      fields: [
        {
          blockType: 'text',
          name: 'firstName',
          label: 'First Name',
          required: true,
          width: 50,
        },
        {
          blockType: 'text',
          name: 'lastName',
          label: 'Last Name',
          required: false,
          width: 50,
        },
        {
          blockType: 'email',
          name: 'email',
          label: 'Email',
          required: true,
          width: 100,
        },
        {
          blockType: 'text',
          name: 'phone',
          label: 'Phone (optional)',
          required: false,
          width: 100,
        },
        {
          blockType: 'textarea',
          name: 'message',
          label: 'Message',
          required: true,
          width: 100,
        },
      ] as any,
    },
  })

  console.log('Contact form created, id:', form.id)
  process.exit(0)
}

main().catch(e => { console.error(e); process.exit(1) })
