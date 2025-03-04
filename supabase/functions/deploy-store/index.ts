
// @deno-types="https://deno.land/x/servest@v1.3.1/types/react/index.d.ts"
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

// Simple console log to confirm function is loaded
console.log('Deploy Store Edge Function loaded');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Immediate logging when function is called
  console.log('Deploy Store Function called with method:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const bodyText = await req.text();
    console.log('Raw request body:', bodyText);
    
    let payload;
    try {
      payload = JSON.parse(bodyText);
      console.log('Parsed payload:', payload);
    } catch (e) {
      console.error('Failed to parse JSON:', e);
      throw new Error('Invalid JSON payload');
    }

    if (!payload.storeId) {
      throw new Error('storeId is required in the payload');
    }

    const { storeId } = payload;
    console.log('Processing deployment for store ID:', storeId);

    // Initialize Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing required environment variables');
      throw new Error('Server configuration error');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized');

    // Update store status
    const { error: updateError } = await supabase
      .from('stores')
      .update({ status: 'deployed' })
      .eq('id', storeId);

    if (updateError) {
      console.error('Update error:', updateError);
      throw updateError;
    }

    console.log('Store status updated to deployed');

    // Return the URL to redirect to
    const response = {
      success: true,
      url: `${req.headers.get('origin') || ''}/${storeId}`
    };

    console.log('Sending successful response:', response);

    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
