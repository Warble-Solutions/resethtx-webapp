/* eslint-disable @typescript-eslint/no-unused-vars */
import { createClient } from '@/utils/supabase/server'


import { updatePassword, updateSiteSettings } from './actions'

import SpotlightCard from '@/app/components/SpotlightCard'
import { Suspense } from 'react'
import SettingsForm from './form' // We will move your client code here

export default async function SettingsPage() {
  const supabase = await createClient()

  // 1. Fetch current site settings from the DB
  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .single()

  // 2. Pass data to the client form
  return (
    <div className="p-4 md:p-8">
      <Suspense fallback={<div className="text-white">Loading settings...</div>}>
        <SettingsForm initialSettings={settings} />
      </Suspense>
    </div>
  )
}