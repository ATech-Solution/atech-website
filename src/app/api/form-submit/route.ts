import { NextResponse } from 'next/server'
import { verifyRecaptcha } from '@/lib/recaptcha'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { form, submissionData, recaptchaToken } = body

    if (!form || !Array.isArray(submissionData)) {
      return NextResponse.json({ error: 'form and submissionData are required.' }, { status: 400 })
    }

    if (!(await verifyRecaptcha(recaptchaToken ?? ''))) {
      return NextResponse.json({ error: 'reCAPTCHA verification failed.' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })
    const submission = await payload.create({
      collection: 'form-submissions',
      data: { form, submissionData },
    })

    return NextResponse.json({ doc: submission })
  } catch (err) {
    console.error('[form-submit] Error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
