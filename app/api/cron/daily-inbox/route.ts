import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; // Adjust depending on env vars present
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  // Verifying that the request is coming from Vercel's Cron infrastructure
  // process.env.CRON_SECRET will need to be configured in Vercel settings
  if (
    process.env.CRON_SECRET &&
    request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Calculate the threshold: 24 hours ago
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // 2. Fetch messages from Supabase (oldest first, because we want oldest sent first, so newest is on top of inbox)
    const { data: messages, error } = await supabase
      .from('contact_messages')
      .select('*')
      .gte('created_at', twentyFourHoursAgo)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }

    if (!messages || messages.length === 0) {
      return NextResponse.json({ status: 'No new messages in the last 24 hours.' });
    }

    // 3. Setup Nodemailer
    const GMAIL_USER = process.env.GMAIL_USER;
    const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
       console.error('Missing email credentials in Environment Variables');
       return NextResponse.json({ error: 'Email credentials not configured.' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
    });

    let sent = 0;
    let failed = 0;

    // 4. Send emails sequentially with a delay to ensure exact chronologic sorting
    for (const m of messages) {
      const name = `${m.first_name || ''} ${m.last_name || ''}`.trim() || 'Unknown User';
      const email = m.email || 'No email provided';
      const phone = m.phone || 'N/A';
      const inquiry = m.inquiry_type || 'General Inquiry';
      const messageText = m.message || '';
      
      const dateStr = m.created_at 
        ? new Date(m.created_at).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Chicago' })
        : 'Unknown Date';

      const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:20px;background:#f4f4f4;font-family:Arial,sans-serif;">
<div style="max-width:520px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
  <div style="background:#000;padding:18px 24px;">
    <p style="margin:0;color:#D4AF37;font-size:10px;text-transform:uppercase;letter-spacing:2px;font-weight:700;">Reset HTX · Admin</p>
    <h2 style="margin:4px 0 0;color:#fff;font-size:17px;">📬 Contact Form Inquiry</h2>
  </div>
  <div style="padding:24px;">
    <p style="color:#888;font-size:12px;margin:0 0 16px;">Submitted on ${dateStr}</p>
    <table width="100%" style="border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:9px 0;border-bottom:1px solid #eee;color:#888;width:38%;">Name</td><td style="padding:9px 0;border-bottom:1px solid #eee;font-weight:600;">${name}</td></tr>
      <tr><td style="padding:9px 0;border-bottom:1px solid #eee;color:#888;">Email</td><td style="padding:9px 0;border-bottom:1px solid #eee;"><a href="mailto:${email}" style="color:#1a73e8;">${email}</a></td></tr>
      <tr><td style="padding:9px 0;border-bottom:1px solid #eee;color:#888;">Phone</td><td style="padding:9px 0;border-bottom:1px solid #eee;">${phone}</td></tr>
      <tr><td style="padding:9px 0;border-bottom:1px solid #eee;color:#888;">Inquiry Type</td><td style="padding:9px 0;border-bottom:1px solid #eee;">${inquiry}</td></tr>
      <tr><td style="padding:9px 0;color:#888;vertical-align:top;">Message</td><td style="padding:9px 0;color:#333;">${messageText}</td></tr>
    </table>
    <div style="margin-top:20px;text-align:center;">
      <a href="https://resethtx.com/admin/inbox" style="background:#000;color:#D4AF37;padding:12px 26px;text-decoration:none;border-radius:6px;font-weight:700;font-size:13px;display:inline-block;">View in Admin Inbox →</a>
    </div>
  </div>
</div>
</body>
</html>`;

      try {
        await transporter.sendMail({
          from: '"Reset HTX System" <' + GMAIL_USER + '>',
          to: GMAIL_USER,
          replyTo: email,
          subject: `📬 ${inquiry}: ${name} (${dateStr})`,
          html: html,
        });
        sent++;
      } catch (err) {
        console.error(`Failed to send message from ${name}:`, err);
        failed++;
      }

      // 2.5 second delay between emails to guarantee Gmail sorting
      await new Promise((resolve) => setTimeout(resolve, 2500));
    }

    return NextResponse.json({ 
      status: 'Success', 
      processed: messages.length, 
      sent, 
      failed 
    });

  } catch (err: any) {
    console.error('Cron job error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
