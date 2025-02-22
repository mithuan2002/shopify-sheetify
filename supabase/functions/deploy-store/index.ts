
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
    // Validate that the request has a body
    if (!req.body) {
      throw new Error('Request body is required');
    }

    let payload;
    try {
      payload = await req.json();
      console.log('Received payload:', payload);
    } catch (e) {
      console.error('Error parsing JSON:', e);
      throw new Error('Invalid JSON payload');
    }

    if (!payload.storeId) {
      throw new Error('storeId is required in the payload');
    }

    const { storeId } = payload;
    console.log('Deploying store with ID:', storeId);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get store data
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('*')
      .eq('id', storeId)
      .single()

    if (storeError) {
      console.error('Error fetching store:', storeError);
      throw storeError;
    }

    if (!store) {
      throw new Error('Store not found');
    }

    console.log('Store found:', store);

    // For now, just update the status to deployed
    const { error: updateError } = await supabase
      .from('stores')
      .update({ status: 'deployed' })
      .eq('id', storeId);

    if (updateError) {
      console.error('Error updating store status:', updateError);
      throw updateError;
    }

    console.log('Store status updated successfully');
    
    return new Response(
      JSON.stringify({
        success: true,
        url: store.netlify_url || `${req.url}/${storeId}`
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
  } catch (error) {
    console.error('Deployment error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error'
      }),
      { 
        status: error.message === 'Invalid JSON payload' ? 400 : 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})
