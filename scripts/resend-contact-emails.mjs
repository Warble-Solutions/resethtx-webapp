import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'

// ── Load .env.local ───────────────────────────────────────────────────────────
const envPath = resolve(process.cwd(), '.env.local')
const envContent = readFileSync(envPath, 'utf8')
const env = {}
for (const line of envContent.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const eqIdx = trimmed.indexOf('=')
  if (eqIdx === -1) continue
  const key = trimmed.slice(0, eqIdx)
  let val = trimmed.slice(eqIdx + 1)
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1)
  }
  env[key] = val
}

const SEND_MODE = process.argv.includes('--send')
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const GMAIL_USER = env.GMAIL_USER
const GMAIL_PASS = env.GMAIL_APP_PASSWORD
const ADMIN_EMAIL = env.GMAIL_USER || 'resethtx@gmail.com'
const BASE_URL = 'https://resethtx.com'

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

if (!env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️  Notice: SUPABASE_SERVICE_ROLE_KEY not found in .env.local; using NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  console.warn('⚠️  Because contact_messages has RLS restricted to authenticated users, anon queries will return 0 rows.')
}

const supabase = createClient(supabaseUrl, supabaseKey)

// ── Gmail SMTP Transporter ────────────────────────────────────────────────────
function getTransporter() {
  if (!GMAIL_USER || !GMAIL_PASS) {
    console.error('❌ Missing GMAIL_USER or GMAIL_APP_PASSWORD in .env.local')
    return null
  }
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user: GMAIL_USER, pass: GMAIL_PASS },
    tls: { rejectUnauthorized: false }
  })
}

// ── Email Templates (exact copies from contact.ts) ────────────────────────────

function buildAdminNotificationHtml(data) {
  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:20px;background:#f4f4f4;font-family:Arial,sans-serif;">
<div style="max-width:520px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
  <div style="background:#000;padding:18px 24px;">
    <p style="margin:0;color:#D4AF37;font-size:10px;text-transform:uppercase;letter-spacing:2px;font-weight:700;">Reset HTX · Admin</p>
    <h2 style="margin:4px 0 0;color:#fff;font-size:17px;">📬 New Contact Form Submission</h2>
  </div>
  <div style="padding:24px;">
    <table width="100%" style="border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:9px 0;border-bottom:1px solid #eee;color:#888;width:38%;">Name</td><td style="padding:9px 0;border-bottom:1px solid #eee;font-weight:600;">${data.first_name} ${data.last_name}</td></tr>
      <tr><td style="padding:9px 0;border-bottom:1px solid #eee;color:#888;">Email</td><td style="padding:9px 0;border-bottom:1px solid #eee;"><a href="mailto:${data.email}" style="color:#1a73e8;">${data.email}</a></td></tr>
      <tr><td style="padding:9px 0;border-bottom:1px solid #eee;color:#888;">Phone</td><td style="padding:9px 0;border-bottom:1px solid #eee;">${data.phone || 'N/A'}</td></tr>
      <tr><td style="padding:9px 0;border-bottom:1px solid #eee;color:#888;">Date of Birth</td><td style="padding:9px 0;border-bottom:1px solid #eee;">${data.dob || 'N/A'}</td></tr>
      <tr><td style="padding:9px 0;border-bottom:1px solid #eee;color:#888;">Inquiry Type</td><td style="padding:9px 0;border-bottom:1px solid #eee;">${data.inquiry_type || 'General'}</td></tr>
      <tr><td style="padding:9px 0;color:#888;vertical-align:top;">Message</td><td style="padding:9px 0;color:#333;">${data.message}</td></tr>
    </table>
    <div style="margin-top:20px;text-align:center;">
      <a href="${BASE_URL}/admin/inbox" style="background:#000;color:#D4AF37;padding:12px 26px;text-decoration:none;border-radius:6px;font-weight:700;font-size:13px;display:inline-block;">View in Admin Inbox →</a>
    </div>
  </div>
</div>
</body>
</html>`
}

function buildCustomerAutoReplyHtml(data) {
  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#000;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#000;padding:40px 20px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
  <tr><td style="background:linear-gradient(135deg,#D4AF37 0%,#F0DEAA 100%);border-radius:12px 12px 0 0;padding:32px;text-align:center;">
    <h1 style="margin:0;color:#000;font-size:20px;font-weight:800;letter-spacing:3px;text-transform:uppercase;">We Got Your Message!</h1>
    <p style="margin:8px 0 0;color:rgba(0,0,0,0.6);font-size:13px;">Thank you for reaching out to Reset HTX</p>
  </td></tr>
  <tr><td style="background:#111;border:1px solid #222;border-top:none;border-radius:0 0 12px 12px;padding:32px;">
    <p style="color:#ccc;font-size:15px;line-height:1.7;margin:0 0 16px;">Hi ${data.first_name},</p>
    <p style="color:#ccc;font-size:15px;line-height:1.7;margin:0 0 24px;">
      Thank you for contacting us! We've received your inquiry and will get back to you as soon as possible — typically within 24–48 hours.
    </p>
    <div style="background:#000;border-left:3px solid #D4AF37;border-radius:4px;padding:16px;margin-bottom:24px;">
      <p style="margin:0;color:#bbb;font-size:13px;line-height:1.7;">
        <strong style="color:#fff;">Your message:</strong><br/>${data.message}
      </p>
    </div>
    <p style="color:#888;font-size:13px;line-height:1.7;margin:0 0 24px;">
      In the meantime, feel free to follow us on social media for the latest events and updates.
    </p>
    <div style="text-align:center;margin-top:28px;padding-top:24px;border-top:1px solid #1e1e1e;">
      <p style="margin:0;color:#444;font-size:12px;">Reset HTX · 606 Dennis St Ste 200, Houston, TX 77006</p>
      <p style="margin:5px 0 0;color:#333;font-size:11px;">resethtx@gmail.com · (832) 281-9991</p>
    </div>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`
}

// ── Sent Tracker ─────────────────────────────────────────────────────────────
const TRACKER_PATH = resolve(process.cwd(), 'scripts/.sent_emails.json')
function loadSentTracker() {
  if (!existsSync(TRACKER_PATH)) return { ticket_purchases: [], contact_messages: [], contact_message_keys: [] }
  try {
    return JSON.parse(readFileSync(TRACKER_PATH, 'utf8'))
  } catch {
    return { ticket_purchases: [], contact_messages: [], contact_message_keys: [] }
  }
}
function markContactSent(id, email) {
  const tracker = loadSentTracker()
  let changed = false
  if (id && !tracker.contact_messages.includes(id)) {
    tracker.contact_messages.push(id)
    changed = true
  }
  if (email && !tracker.contact_message_keys.includes(email)) {
    tracker.contact_message_keys.push(email)
    changed = true
  }
  if (changed) {
    writeFileSync(TRACKER_PATH, JSON.stringify(tracker, null, 2), 'utf8')
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n' + '═'.repeat(70))
  console.log(SEND_MODE ? '🚀 SEND MODE — Emails will be sent!' : '👀 DRY RUN — No emails will be sent (use --send to send)')
  console.log('═'.repeat(70))

  // 24 hours ago
  const oneDayAgo = new Date()
  oneDayAgo.setHours(oneDayAgo.getHours() - 24)
  const since = oneDayAgo.toISOString()
  console.log(`\n📅 Records since: ${oneDayAgo.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}\n`)

  // Fetch contact messages
  const { data: contacts, error: contactErr } = await supabase
    .from('contact_messages')
    .select('id, first_name, last_name, email, phone, dob, inquiry_type, message, created_at')
    .gte('created_at', since)
    .order('created_at', { ascending: true })

  if (contactErr) {
    console.error('❌ Error querying contact_messages:', contactErr.message)
    return
  }

  console.log(`📬 Found ${contacts.length} contact form submissions in window\n`)

  // Build email queue
  const emailQueue = []
  const tracker = loadSentTracker()

  for (const c of contacts) {
    if (tracker.contact_messages.includes(c.id) || (tracker.contact_message_keys && tracker.contact_message_keys.includes(c.email))) {
      console.log(`   ⏭️  Skipping ${c.first_name} ${c.last_name} (${c.email}) — already sent previously`)
      continue
    }

    if (!c.email) {
      console.log(`   ⚠️  Skipping ${c.first_name} ${c.last_name} — no email address`)
      continue
    }

    // Customer auto-reply
    emailQueue.push({
      type: 'CUSTOMER',
      to: c.email,
      contactId: c.id,
      contactEmail: c.email,
      subject: `We received your message — Reset HTX`,
      html: buildCustomerAutoReplyHtml(c),
      label: `✉️  [Customer] ${c.first_name} ${c.last_name} <${c.email}> — "${c.inquiry_type || 'General'}"`,
    })

    // Admin notification
    emailQueue.push({
      type: 'ADMIN',
      to: ADMIN_EMAIL,
      contactId: c.id,
      contactEmail: c.email,
      subject: `📬 New Inquiry from ${c.first_name} ${c.last_name} — Reset HTX`,
      html: buildAdminNotificationHtml(c),
      label: `📋 [Admin]    ${c.first_name} ${c.last_name} — "${c.inquiry_type || 'General'}"`,
    })
  }

  // Print queue
  console.log(`📧 Email Queue: ${emailQueue.length} emails\n`)
  for (let i = 0; i < emailQueue.length; i++) {
    console.log(`   ${i + 1}. ${emailQueue[i].label}`)
  }

  const customerCount = emailQueue.filter(e => e.type === 'CUSTOMER').length
  const adminCount = emailQueue.filter(e => e.type === 'ADMIN').length
  console.log(`\n   📊 ${customerCount} customer auto-replies + ${adminCount} admin notifications = ${emailQueue.length} total\n`)

  if (!SEND_MODE) {
    console.log('═'.repeat(70))
    console.log('👆 DRY RUN complete. To actually send, run:')
    console.log('   node scripts/resend-contact-emails.mjs --send')
    console.log('═'.repeat(70))
    return
  }

  // ── Actually send ─────────────────────────────────────────────────────────
  const transporter = getTransporter()
  if (!transporter) {
    console.error('❌ Cannot create email transporter. Check GMAIL_USER and GMAIL_APP_PASSWORD.')
    process.exit(1)
  }

  // Verify connection
  try {
    await transporter.verify()
    console.log('✅ SMTP connection verified\n')
  } catch (err) {
    console.error('❌ SMTP connection failed:', err.message)
    process.exit(1)
  }

  let sent = 0
  let failed = 0

  for (const email of emailQueue) {
    try {
      await transporter.sendMail({
        from: `"Reset HTX" <${GMAIL_USER}>`,
        to: email.to,
        subject: email.subject,
        html: email.html,
      })
      console.log(`   ✅ Sent: ${email.label}`)
      sent++
      if (email.contactId || email.contactEmail) markContactSent(email.contactId, email.contactEmail)

      // Small delay between emails to avoid rate limiting
      await new Promise(r => setTimeout(r, 1500))
    } catch (err) {
      console.error(`   ❌ Failed: ${email.label} — ${err.message}`)
      failed++
    }
  }

  console.log('\n' + '═'.repeat(70))
  console.log(`📊 RESULTS: ${sent} sent, ${failed} failed, ${emailQueue.length} total`)
  console.log('═'.repeat(70))
}

main().catch(console.error)
