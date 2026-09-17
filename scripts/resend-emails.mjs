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

// ── Email Templates (exact copies from the codebase) ──────────────────────────

function buildOrderConfirmationHtml({ eventName, date, ticketType, quantity, totalAmount, name, tableSelection, bookingRef, orderId, email }) {
  const typeDisplay = ticketType === 'table_reservation' ? `Table Reservation: ${tableSelection || 'General'}` : ticketType
  return `
    <div style="font-family: sans-serif; background: #000; color: #fff; padding: 20px; text-align: center;">
      <div style="margin-bottom: 20px;">
        <img src="${BASE_URL}/logos/logo-main.png" alt="Reset HTX" style="max-width: 250px; height: auto;" />
      </div>
      <p style="font-size: 18px; color: #ccc;">Your Booking is Confirmed</p>
      
      <div style="background: #111; border: 1px solid #333; padding: 20px; margin: 20px auto; border-radius: 8px; max-width: 500px; text-align: left;">
        <h2 style="margin: 0 0 10px; color: #fff; text-align: center;">${eventName}</h2>
        <p style="color: #888; margin: 0 0 20px; text-align: center;">${new Date(date).toDateString()}</p>
        <p style="text-align: center; color: #D4AF37; font-size: 20px; font-weight: bold; margin-bottom: 20px;">Booking ID: ${bookingRef || orderId || 'N/A'}</p>
        <hr style="border-color: #333; margin: 20px 0;" />
        <p><strong>Guest:</strong> ${name}</p>
        <p><strong>Type:</strong> ${typeDisplay}</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
        <p><strong>Total:</strong> $${totalAmount}</p>
      </div>
      ${bookingRef ? `
      <div style="margin-top: 30px; text-align: center;">
        <p style="color: #ccc; font-size: 14px;">Need to change your plans?</p>
        <a href="${BASE_URL}/cancel?ref=${bookingRef}&email=${encodeURIComponent(email)}" 
           style="background-color: #333; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
           Cancel Booking
        </a>
      </div>` : ''}
      <div style="margin-top: 30px;">
        <img src="${BASE_URL}/logos/r_logo.png" alt="R Icon" style="max-width: 40px; height: auto; opacity: 0.8;" />
      </div>
      <p style="font-size: 12px; color: #666; margin-top: 10px;">Please present this email at the door. 21+ to enter.</p>
    </div>`
}

function buildAdminBookingHtml({ eventName, date, ticketType, quantity, totalAmount, name, email, tableSelection, bookingRef }) {
  const typeDisplay = ticketType === 'table_reservation' ? `Table Reservation: ${tableSelection || 'General'}` : ticketType
  return `
    <h2>New Booking Received</h2>
    <p><strong>Booking ID:</strong> ${bookingRef || 'N/A'}</p>
    <p><strong>Event:</strong> ${eventName}</p>
    <p><strong>Date:</strong> ${new Date(date).toDateString()}</p>
    <p><strong>Guest Name:</strong> ${name}</p>
    <p><strong>Guest Email:</strong> ${email}</p>
    <p><strong>Ticket Type:</strong> ${typeDisplay}</p>
    <p><strong>Quantity:</strong> ${quantity}</p>
    <p><strong>Total Amount:</strong> $${totalAmount}</p>`
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
function markTicketSent(ref) {
  if (!ref || ref === 'N/A') return
  const tracker = loadSentTracker()
  if (!tracker.ticket_purchases.includes(ref)) {
    tracker.ticket_purchases.push(ref)
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

  // Fetch ticket purchases
  const { data: tickets, error: ticketsErr } = await supabase
    .from('ticket_purchases')
    .select('id, user_name, user_email, user_phone, quantity, total_price, status, ticket_type, booking_ref, payment_intent_id, event_id, created_at')
    .gte('created_at', since)
    .order('created_at', { ascending: true })

  if (ticketsErr) {
    console.error('❌ Error querying ticket_purchases:', ticketsErr.message)
    return
  }

  // Fetch events for these tickets
  const eventIds = [...new Set(tickets.map(t => t.event_id).filter(Boolean))]
  const { data: events } = await supabase
    .from('events')
    .select('id, title, date')
    .in('id', eventIds)

  const eventMap = {}
  if (events) events.forEach(e => { eventMap[e.id] = e })

  console.log(`🎟️  Found ${tickets.length} ticket purchases in window\n`)

  // Build email queue
  const emailQueue = []
  const tracker = loadSentTracker()

  for (const t of tickets) {
    if (t.booking_ref && tracker.ticket_purchases.includes(t.booking_ref)) {
      console.log(`   ⏭️  Skipping ${t.user_name} (${t.booking_ref}) — already sent previously`)
      continue
    }

    const ev = eventMap[t.event_id] || {}
    const details = {
      eventName: ev.title || 'Event',
      date: ev.date || new Date().toISOString(),
      ticketType: t.ticket_type || 'standard_ticket',
      quantity: t.quantity || 1,
      totalAmount: t.total_price || 0,
      name: t.user_name || 'Guest',
      email: t.user_email || '',
      tableSelection: null,
      bookingRef: t.booking_ref || 'N/A',
      orderId: t.payment_intent_id || '',
    }

    if (!details.email) {
      console.log(`   ⚠️  Skipping ${details.name} — no email address`)
      continue
    }

    // Customer confirmation
    emailQueue.push({
      type: 'CUSTOMER',
      to: details.email,
      bookingRef: details.bookingRef,
      subject: `Booking Confirmed: ${details.eventName}`,
      html: buildOrderConfirmationHtml(details),
      label: `✉️  [Customer] ${details.name} <${details.email}> — ${details.eventName} (Ref: ${details.bookingRef})`,
    })

    // Admin notification
    emailQueue.push({
      type: 'ADMIN',
      to: ADMIN_EMAIL,
      bookingRef: details.bookingRef,
      subject: `🚨 New Booking: ${details.eventName} - ${details.name}`,
      html: buildAdminBookingHtml(details),
      label: `📋 [Admin]    ${details.name} — ${details.eventName} (Ref: ${details.bookingRef})`,
    })
  }

  // Print queue
  console.log(`📧 Email Queue: ${emailQueue.length} emails\n`)
  for (let i = 0; i < emailQueue.length; i++) {
    console.log(`   ${i + 1}. ${emailQueue[i].label}`)
  }

  const customerCount = emailQueue.filter(e => e.type === 'CUSTOMER').length
  const adminCount = emailQueue.filter(e => e.type === 'ADMIN').length
  console.log(`\n   📊 ${customerCount} customer emails + ${adminCount} admin emails = ${emailQueue.length} total\n`)

  if (!SEND_MODE) {
    console.log('═'.repeat(70))
    console.log('👆 DRY RUN complete. To actually send, run:')
    console.log('   node scripts/resend-emails.mjs --send')
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
      if (email.bookingRef) markTicketSent(email.bookingRef)

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
