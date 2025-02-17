
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const NETLIFY_PAT = Deno.env.get('NETLIFY_PAT')
    const NETLIFY_WEBHOOK_URL = Deno.env.get('NETLIFY_WEBHOOK_URL')
    
    if (!NETLIFY_PAT) {
      throw new Error('Netlify PAT not configured')
    }
    if (!NETLIFY_WEBHOOK_URL) {
      throw new Error('Netlify webhook URL not configured')
    }

    const { storeId } = await req.json()

    // Get store data
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('*')
      .eq('id', storeId)
      .single()

    if (storeError || !store) {
      console.error('Error fetching store:', storeError)
      return new Response(
        JSON.stringify({ error: 'Store not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create a new site on Netlify
    const siteName = `${store.name}-${store.id}`
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    console.log('Creating Netlify site:', siteName)

    const createSiteResponse = await fetch('https://api.netlify.com/api/v1/sites', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NETLIFY_PAT}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: siteName,
        custom_domain: null,
        build_settings: {
          cmd: 'npm run build',
          dir: 'dist',
          env: {
            STORE_ID: store.id
          }
        }
      })
    })

    if (!createSiteResponse.ok) {
      const error = await createSiteResponse.text()
      console.error('Netlify site creation failed:', error)
      throw new Error('Failed to create Netlify site')
    }

    const siteData = await createSiteResponse.json()
    const siteUrl = siteData.ssl_url || siteData.url

    console.log('Netlify site created:', siteUrl)

    // Update store with Netlify URL
    const { error: updateError } = await supabase
      .from('stores')
      .update({ 
        status: 'deployed',
        netlify_url: siteUrl
      })
      .eq('id', storeId)

    if (updateError) {
      console.error('Error updating store:', updateError)
      throw new Error('Failed to update store status')
    }

    // Trigger initial build using webhook
    console.log('Triggering initial build via webhook...')
    const buildResponse = await fetch(NETLIFY_WEBHOOK_URL, {
      method: 'POST'
    })

    if (!buildResponse.ok) {
      console.error('Failed to trigger build webhook:', await buildResponse.text())
      // Don't throw error here as the site is already created
      console.log('Site created successfully but build trigger failed')
    } else {
      console.log('Build triggered successfully')
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        url: siteUrl
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Deployment error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
