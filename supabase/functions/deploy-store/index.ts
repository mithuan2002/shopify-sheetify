
// @deno-types="https://deno.land/std@0.177.0/http/server.ts"
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
// @deno-types="https://esm.sh/v132/@supabase/supabase-js@2.39.7/dist/module/index.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

console.log('Edge Function loaded'); // This will show up when the function is deployed

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Immediate logging when function is called
  console.log('Function called with method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', Object.fromEntries(req.headers.entries()));

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Log environment variables (without sensitive values)
    console.log('Checking environment variables...');
    console.log('SUPABASE_URL exists:', !!Deno.env.get('SUPABASE_URL'));
    console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));

    // Parse request body
    if (!req.body) {
      throw new Error('Request body is required');
    }

    // Read the raw body text first
    const bodyText = await req.text();
    console.log('Raw request body:', bodyText);

    // Try to parse as JSON
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

    // Initialize Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test database connection
    try {
      const { data: testData, error: testError } = await supabase
        .from('stores')
        .select('count')
        .limit(1);

      console.log('Database connection test:', testError ? 'Failed' : 'Success');
      if (testError) {
        console.error('Database connection error:', testError);
      }
    } catch (e) {
      console.error('Failed to test database connection:', e);
    }

    // Get store data
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('*')
      .eq('id', storeId)
      .single();

    if (storeError) {
      console.error('Store fetch error:', storeError);
      throw storeError;
    }

    if (!store) {
      throw new Error('Store not found');
    }

    console.log('Found store:', store);

    // Update store status
    const { error: updateError } = await supabase
      .from('stores')
      .update({ status: 'deployed' })
      .eq('id', storeId);

    if (updateError) {
      console.error('Update error:', updateError);
      throw updateError;
    }

    const response = {
      success: true,
      url: store.netlify_url || `${req.url}/${storeId}`
    };

    console.log('Sending response:', response);

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
