import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    useAPIKey: true,
    tokenExpiration: 7200,
    // Only require email verification when an SMTP transport is configured.
    // Without it the verification email is never sent, locking users out.
    ...(process.env.AWS_SES_SMTP_USER ? { verify: {
      generateEmailHTML: ({ token, user }) => {
        // Use PAYLOAD_PUBLIC_SERVER_URL_* — these are resolved at runtime from process.env.
        // NEXT_PUBLIC_* vars are baked at build time by Next.js and cannot be overridden at runtime.
        const siteUrl = process.env.NODE_ENV === 'production'
          ? (process.env.PAYLOAD_PUBLIC_SERVER_URL_PROD ?? process.env.PAYLOAD_PUBLIC_SERVER_URL ?? 'http://localhost:3000')
          : (process.env.PAYLOAD_PUBLIC_SERVER_URL_DEV  ?? process.env.PAYLOAD_PUBLIC_SERVER_URL ?? 'http://localhost:3000')

        const verifyUrl = `${siteUrl}/api/users/verify/${token}`

        return `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body style="margin:0;padding:0;background:#f5f5f5;font-family:'DM Sans',Helvetica,Arial,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
              <tr>
                <td align="center">
                  <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;border-top:3px solid #034F98;overflow:hidden;">
                    <tr>
                      <td style="padding:40px 48px 32px;">
                        <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#0d1117;">Verify your email</h1>
                        <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;">
                          Hi ${(user as any)?.firstName ?? 'there'}, thanks for creating your account.
                          Click the button below to verify your email address.
                        </p>
                        <a href="${verifyUrl}"
                           style="display:inline-block;background:#034F98;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:6px;font-size:15px;font-weight:600;">
                          Verify Email
                        </a>
                        <p style="margin:24px 0 0;font-size:12px;color:#9ca3af;">
                          Or copy this link: <a href="${verifyUrl}" style="color:#034F98;">${verifyUrl}</a>
                        </p>
                        <p style="margin:16px 0 0;font-size:12px;color:#9ca3af;">
                          If you did not create this account, you can ignore this email.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="background:#f9fafb;padding:16px 48px;border-top:1px solid #e5e7eb;">
                        <p style="margin:0;font-size:12px;color:#9ca3af;">ATech — atech.software</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `
      },
      generateEmailSubject: () => 'Verify your ATech account email',
    } } : {}),
    forgotPassword: {
      generateEmailHTML: ({ token, user }) => {
        const siteUrl = process.env.NODE_ENV === 'production'
          ? (process.env.PAYLOAD_PUBLIC_SERVER_URL_PROD ?? process.env.PAYLOAD_PUBLIC_SERVER_URL ?? 'http://localhost:3000')
          : (process.env.PAYLOAD_PUBLIC_SERVER_URL_DEV  ?? process.env.PAYLOAD_PUBLIC_SERVER_URL ?? 'http://localhost:3000')

        const resetUrl = `${siteUrl}/reset-password?token=${token}`

        return `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body style="margin:0;padding:0;background:#f5f5f5;font-family:'DM Sans',Helvetica,Arial,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
              <tr>
                <td align="center">
                  <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;border-top:3px solid #034F98;overflow:hidden;">
                    <tr>
                      <td style="padding:40px 48px 32px;">
                        <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#0d1117;">Reset your password</h1>
                        <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;">
                          Hi ${(user as any)?.firstName ?? 'there'}, we received a request to reset your ATech account password.
                          Click the button below to choose a new password. This link expires in 1 hour.
                        </p>
                        <a href="${resetUrl}"
                           style="display:inline-block;background:#034F98;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:6px;font-size:15px;font-weight:600;">
                          Reset Password
                        </a>
                        <p style="margin:24px 0 0;font-size:12px;color:#9ca3af;">
                          Or copy this link: <a href="${resetUrl}" style="color:#034F98;">${resetUrl}</a>
                        </p>
                        <p style="margin:16px 0 0;font-size:12px;color:#9ca3af;">
                          If you did not request a password reset, you can safely ignore this email.
                          Your password will not change.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="background:#f9fafb;padding:16px 48px;border-top:1px solid #e5e7eb;">
                        <p style="margin:0;font-size:12px;color:#9ca3af;"><a href="${resetUrl}" style="color:#034F98;">ATech Software</a></p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `
      },
      generateEmailSubject: () => 'Reset your ATech password',
    },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName', 'role', '_verified', 'createdAt'],
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return false
    },
    create: () => true,
    update: ({ req, id }) => {
      if (!req.user) return false
      if (req.user.role === 'admin') return true
      return req.user.id === id
    },
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      label: 'First Name',
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Last Name',
    },
    {
      name: 'role',
      type: 'select',
      label: 'Role',
      defaultValue: 'editor',
      required: true,
      options: [
        { label: 'Admin',  value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Viewer', value: 'viewer' },
      ],
      access: {
        update: ({ req }) => req.user?.role === 'admin',
      },
    },
  ],
  hooks: {
    afterChange: [
      ({ doc, operation }) => {
        if (operation === 'create') {
          console.log(`[Hook] New user created: ${doc.email}`)
        }
      },
    ],
  },
}
