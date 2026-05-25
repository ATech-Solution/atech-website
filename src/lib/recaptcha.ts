export async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY
  if (!secret) return true // bypass when no secret configured

  // Widget couldn't render (e.g. localhost not in allowed domains) — allow in non-production
  if (token === 'recaptcha-unavailable') {
    return process.env.NODE_ENV !== 'production'
  }

  if (!token) return false

  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token }),
  })
  const data = (await res.json()) as { success: boolean }
  return data.success === true
}
