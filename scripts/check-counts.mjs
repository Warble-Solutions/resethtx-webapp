import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Load .env.local manually
const envPath = resolve(process.cwd(), '.env.local')
const envContent = readFileSync(envPath, 'utf-8')
const env = {}
for (const line of envContent.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const eqIdx = trimmed.indexOf('=')
  if (eqIdx === -1) continue
  const key = trimmed.slice(0, eqIdx)
  let val = trimmed.slice(eqIdx + 1)
  // Remove surrounding quotes
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1)
  }
  env[key] = val
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// 7 days ago
const sevenDaysAgo = new Date()
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
const since = sevenDaysAgo.toISOString()

console.log(`\n📅 Querying records since: ${sevenDaysAgo.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`)
console.log(`   (ISO: ${since})\n`)

// --- 1. Ticket Purchases ---
const { data: tickets, error: ticketsErr } = await supabase
  .from('ticket_purchases')
  .select('id, user_name, user_email, user_phone, quantity, total_price, status, ticket_type, booking_ref, payment_intent_id, event_id, created_at')
  .gte('created_at', since)
  .order('created_at', { ascending: false })

if (ticketsErr) {
  console.error('❌ Error querying ticket_purchases:', ticketsErr.message)
} else {
  console.log(`🎟️  TICKET PURCHASES (event bookings): ${tickets.length} records`)
  if (tickets.length > 0) {
    // Get event details for these tickets
    const eventIds = [...new Set(tickets.map(t => t.event_id).filter(Boolean))]
    const { data: events } = await supabase
      .from('events')
      .select('id, title, date')
      .in('id', eventIds)

    const eventMap = {}
    if (events) events.forEach(e => { eventMap[e.id] = e })

    console.log('   ┌─────────────────────────────────────────────────────────────────────────────')
    for (const t of tickets) {
      const ev = eventMap[t.event_id] || {}
      console.log(`   │ ${t.user_name} <${t.user_email}> | ${ev.title || 'Unknown Event'} | ${t.ticket_type} | $${t.total_price} | ${t.status} | Ref: ${t.booking_ref || 'N/A'} | ${new Date(t.created_at).toLocaleString()}`)
    }
    console.log('   └─────────────────────────────────────────────────────────────────────────────')
    
    const paidTickets = tickets.filter(t => t.status === 'paid')
    console.log(`   → ${paidTickets.length} paid tickets need: Customer Confirmation + Admin Notification = ${paidTickets.length * 2} emails`)
  }
}

console.log()

// --- 2. Reservations ---
const { data: reservations, error: resErr } = await supabase
  .from('reservations')
  .select('id, full_name, email, phone, guests, date, time, status, special_requests, created_at')
  .gte('created_at', since)
  .order('created_at', { ascending: false })

if (resErr) {
  console.error('❌ Error querying reservations:', resErr.message)
} else {
  console.log(`🍽️  RESERVATIONS (general table bookings): ${reservations.length} records`)
  if (reservations.length > 0) {
    console.log('   ┌─────────────────────────────────────────────────────────────────────────────')
    for (const r of reservations) {
      const refMatch = r.special_requests?.match(/Booking Ref: (RST-\w+)/)
      const ref = refMatch?.[1] || 'N/A'
      console.log(`   │ ${r.full_name} <${r.email}> | Date: ${r.date} ${r.time || ''} | Guests: ${r.guests} | Status: ${r.status} | Ref: ${ref} | ${new Date(r.created_at).toLocaleString()}`)
    }
    console.log('   └─────────────────────────────────────────────────────────────────────────────')
    
    const confirmed = reservations.filter(r => r.status === 'confirmed')
    console.log(`   → ${confirmed.length} confirmed reservations need: Guest Confirmation + Admin Notification = ${confirmed.length * 2} emails`)
  }
}

console.log()

// --- 3. Contact Messages ---
const { data: contacts, error: contactErr } = await supabase
  .from('contact_messages')
  .select('id, first_name, last_name, email, inquiry_type, message, created_at')
  .gte('created_at', since)
  .order('created_at', { ascending: false })

if (contactErr) {
  console.error('❌ Error querying contact_messages:', contactErr.message)
} else {
  console.log(`📬 CONTACT MESSAGES: ${contacts.length} records`)
  if (contacts.length > 0) {
    console.log('   ┌─────────────────────────────────────────────────────────────────────────────')
    for (const c of contacts) {
      console.log(`   │ ${c.first_name} ${c.last_name} <${c.email}> | Type: ${c.inquiry_type || 'General'} | ${new Date(c.created_at).toLocaleString()}`)
    }
    console.log('   └─────────────────────────────────────────────────────────────────────────────')
    
    console.log(`   → ${contacts.length} contacts need: Customer Auto-Reply + Admin Notification = ${contacts.length * 2} emails`)
  }
}

// --- Summary ---
const paidTickets = tickets?.filter(t => t.status === 'paid').length || 0
const confirmedRes = reservations?.filter(r => r.status === 'confirmed').length || 0
const contactCount = contacts?.length || 0

const totalCustomerEmails = paidTickets + confirmedRes + contactCount
const totalAdminEmails = paidTickets + confirmedRes + contactCount
const totalEmails = totalCustomerEmails + totalAdminEmails

console.log('\n' + '═'.repeat(70))
console.log('📊 SUMMARY')
console.log('═'.repeat(70))
console.log(`   Ticket purchases (paid):     ${paidTickets}`)
console.log(`   Reservations (confirmed):    ${confirmedRes}`)
console.log(`   Contact messages:            ${contactCount}`)
console.log('─'.repeat(70))
console.log(`   Customer-facing emails:      ${totalCustomerEmails}`)
console.log(`   Admin notification emails:   ${totalAdminEmails}`)
console.log(`   ─────────────────────────────────`)
console.log(`   TOTAL EMAILS TO SEND:        ${totalEmails}`)
console.log('═'.repeat(70))
