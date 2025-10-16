'use server'

import { Resend } from 'resend'
import { render } from '@react-email/render'

export async function sendEmail({ to, subject, react }) {
  const resend = new Resend(process.env.RESEND_API_KEY || '')
  const htmlString = await render(react)
  const textString = render(react, { plainText: true })

  try {
    const data = await resend.emails.send({
      from: 'Spendly <onboarding@resend.dev>',
      to,
      subject,
      html: htmlString, // HTML email
      text: String(textString),
    })

    console.log('email success -->', data)

    return { success: true, data }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error }
  }
}
