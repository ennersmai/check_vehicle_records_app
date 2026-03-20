import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''
const FROM_EMAIL = 'Check Vehicle Records <noreply@checkvehiclerecords.co.uk>'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, platform, appLink, storeName } = await req.json()

    if (!email || !appLink) {
      return new Response(
        JSON.stringify({ error: 'Email and app link are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const subject = `Download Check Vehicle Records on ${storeName}`

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:40px 20px">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
          <!-- Header -->
          <tr>
            <td style="background:#007ea7;padding:32px 40px;text-align:center">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:0.5px">Check Vehicle Records</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px">
              <h2 style="margin:0 0 16px;color:#1a1a1a;font-size:22px;font-weight:700">Get the App on ${storeName}</h2>
              <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.6">
                You requested a download link for the <strong>Check Vehicle Records</strong> app for <strong>${platform === 'android' ? 'Android' : 'iOS'}</strong>. 
                Tap the button below on your phone to install it directly.
              </p>
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 32px">
                    <a href="${appLink}" target="_blank" style="display:inline-block;background:#007ea7;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 40px;border-radius:8px;letter-spacing:0.5px">
                      DOWNLOAD FROM ${storeName.toUpperCase()}
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px;color:#888;font-size:13px">Or copy this link into your phone's browser:</p>
              <p style="margin:0 0 24px;color:#007ea7;font-size:13px;word-break:break-all">
                <a href="${appLink}" style="color:#007ea7;text-decoration:underline">${appLink}</a>
              </p>
              <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
              <p style="margin:0;color:#999;font-size:12px;line-height:1.5">
                Check any vehicle's history in seconds — accidents, finance, stolen status, MOT, mileage, and more.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f8f9fa;padding:24px 40px;text-align:center">
              <p style="margin:0 0 4px;color:#aaa;font-size:11px">© ${new Date().getFullYear()} Check Vehicle Records</p>
              <p style="margin:0;color:#aaa;font-size:11px">
                <a href="https://www.checkvehiclerecords.co.uk" style="color:#007ea7;text-decoration:none">www.checkvehiclerecords.co.uk</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

    // Send via Resend API
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject,
        html,
      }),
    })

    if (!res.ok) {
      const errBody = await res.text()
      console.error('Resend error:', errBody)
      throw new Error(`Email service error: ${res.status}`)
    }

    const result = await res.json()

    return new Response(
      JSON.stringify({ success: true, id: result.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    console.error('send-app-link error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
