const RESEND_API = 'https://api.resend.com/emails';

interface ContactEmailParams {
  name: string;
  email: string;
  company: string;
  service: string;
  message: string;
}

function staffHtml(p: ContactEmailParams): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08);">
        <tr>
          <td style="background:#1c1917;padding:28px 40px;">
            <p style="margin:0;font-family:Georgia,serif;font-size:20px;color:#C9A44A;letter-spacing:.05em;">DOXA &amp; CO</p>
            <p style="margin:4px 0 0;font-size:11px;color:#78716c;letter-spacing:.15em;text-transform:uppercase;">New Contact Inquiry</p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 24px;font-size:15px;color:#44403c;">You have a new message from the website contact form.</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e7e5e4;width:38%;font-size:12px;font-family:sans-serif;color:#78716c;text-transform:uppercase;letter-spacing:.08em;">Name</td>
                <td style="padding:10px 0;border-bottom:1px solid #e7e5e4;font-size:14px;color:#1c1917;">${p.name}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e7e5e4;font-size:12px;font-family:sans-serif;color:#78716c;text-transform:uppercase;letter-spacing:.08em;">Email</td>
                <td style="padding:10px 0;border-bottom:1px solid #e7e5e4;font-size:14px;color:#1c1917;"><a href="mailto:${p.email}" style="color:#059669;text-decoration:none;">${p.email}</a></td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e7e5e4;font-size:12px;font-family:sans-serif;color:#78716c;text-transform:uppercase;letter-spacing:.08em;">Company</td>
                <td style="padding:10px 0;border-bottom:1px solid #e7e5e4;font-size:14px;color:#1c1917;">${p.company || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e7e5e4;font-size:12px;font-family:sans-serif;color:#78716c;text-transform:uppercase;letter-spacing:.08em;">Interested In</td>
                <td style="padding:10px 0;border-bottom:1px solid #e7e5e4;font-size:14px;color:#1c1917;">${p.service}</td>
              </tr>
            </table>
            <div style="margin-top:24px;background:#fafaf9;border-left:3px solid #C9A44A;padding:16px 20px;border-radius:0 4px 4px 0;">
              <p style="margin:0 0 6px;font-size:11px;font-family:sans-serif;color:#78716c;text-transform:uppercase;letter-spacing:.08em;">Message</p>
              <p style="margin:0;font-size:14px;color:#1c1917;line-height:1.6;">${p.message}</p>
            </div>
          </td>
        </tr>
        <tr>
          <td style="background:#fafaf9;padding:20px 40px;border-top:1px solid #e7e5e4;">
            <p style="margin:0;font-size:11px;font-family:sans-serif;color:#a8a29e;">doxaandco.co · ename@doxaandco.co</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function clientHtml(p: ContactEmailParams): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08);">
        <tr>
          <td style="background:#1c1917;padding:28px 40px;">
            <p style="margin:0;font-family:Georgia,serif;font-size:20px;color:#C9A44A;letter-spacing:.05em;">DOXA &amp; CO</p>
            <p style="margin:4px 0 0;font-size:11px;color:#78716c;letter-spacing:.15em;text-transform:uppercase;">Message Received</p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 8px;font-size:18px;color:#1c1917;">Hi ${p.name},</p>
            <p style="margin:0 0 24px;font-size:15px;color:#57534e;line-height:1.6;">Thank you for reaching out. Your message has been received and I'll respond within one business day.</p>

            <div style="background:#fafaf9;border:1px solid #e7e5e4;border-radius:8px;padding:24px 28px;margin-bottom:28px;">
              <p style="margin:0 0 14px;font-size:11px;font-family:sans-serif;color:#78716c;text-transform:uppercase;letter-spacing:.12em;">Your Message</p>
              <p style="margin:0 0 10px;font-size:13px;font-family:sans-serif;color:#78716c;">Subject: <span style="color:#1c1917;">${p.service}</span></p>
              <p style="margin:0;font-size:14px;color:#44403c;line-height:1.6;">${p.message}</p>
            </div>

            <p style="margin:0 0 6px;font-size:14px;color:#57534e;line-height:1.6;">In the meantime, feel free to explore <a href="https://doxaandco.co" style="color:#059669;text-decoration:none;">doxaandco.co</a> or reach out directly at <a href="mailto:ename@doxaandco.co" style="color:#059669;text-decoration:none;">ename@doxaandco.co</a>.</p>
            <p style="margin:24px 0 0;font-size:14px;color:#57534e;">Talk soon.</p>
            <p style="margin:4px 0 0;font-size:14px;color:#1c1917;font-family:Georgia,serif;">— Enam Egyir</p>
          </td>
        </tr>
        <tr>
          <td style="background:#fafaf9;padding:20px 40px;border-top:1px solid #e7e5e4;">
            <p style="margin:0;font-size:11px;font-family:sans-serif;color:#a8a29e;">Doxa &amp; Co · Strategy · Product · Delivery</p>
            <p style="margin:4px 0 0;font-size:11px;font-family:sans-serif;color:#a8a29e;">doxaandco.co · ename@doxaandco.co</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Email service not configured' }), {
      status: 503, headers: { 'Content-Type': 'application/json' },
    });
  }

  let params: ContactEmailParams;
  try {
    params = await req.json() as ContactEmailParams;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  const from = 'Doxa & Co <ename@doxaandco.co>';

  async function send(to: string, subject: string, html: string) {
    const res = await fetch(RESEND_API, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], subject, html }),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  }

  try {
    await send(
      'ename@doxaandco.co',
      `New inquiry: ${params.name} — ${params.service}`,
      staffHtml(params)
    );
    await send(
      params.email,
      `Got your message — Doxa & Co`,
      clientHtml(params)
    );
    return new Response(JSON.stringify({ ok: true }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[send-contact-email]', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const config = { path: '/api/send-contact-email' };
