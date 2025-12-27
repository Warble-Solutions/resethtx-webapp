
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testInsert() {
    console.log('Testing insert to contact_messages...')
    const { data, error } = await supabase
        .from('contact_messages')
        .insert({
            first_name: 'Test',
            last_name: 'Script',
            email: 'test@example.com',
            message: 'Hello from script',
            inquiry_type: 'Test'
        })
        .select()

    if (error) {
        console.error('Insert Error:', JSON.stringify(error, null, 2))
    } else {
        console.log('Insert Success:', data)
    }
}

testInsert()
