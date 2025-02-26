
// @deno-types="https://deno.land/std@0.177.0/http/server.ts"
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
// @deno-types="https://esm.sh/v132/@supabase/supabase-js@2.39.7/dist/module/index.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

declare global {
  interface Deno {
    env: {
      get(key: string): string | undefined;
    };
  }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('Deploy store function invoked');
  console.log('Request method:', req.method);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Validate that the request has a body
    if (!req.body) {
      console.error('No request body provided');
      throw new Error('Request body is required');
    }

    let payload;
    try {
      const text = await req.text();
      console.log('Raw request body:', text);
      payload = JSON.parse(text);
      console.log('Parsed payload:', payload);
    } catch (e) {
      console.error('Error parsing JSON:', e);
      throw new Error('Invalid JSON payload');
    }

    if (!payload.storeId) {
      console.error('No storeId in payload');
      throw new Error('storeId is required in the payload');
    }

    const { storeId } = payload;
    console.log('Deploying store with ID:', storeId);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables');
      throw new Error('Server configuration error');
    }

    console.log('Initializing Supabase client with URL:', supabaseUrl);
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get store data
    console.log('Fetching store data...');
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('*')
      .eq('id', storeId)
      .single();

    if (storeError) {
      console.error('Error fetching store:', storeError);
      throw storeError;
    }

    if (!store) {
      console.error('Store not found with ID:', storeId);
      throw new Error('Store not found');
    }

    console.log('Store found:', store);

    // Update store status
    console.log('Updating store status to deployed...');
    const { error: updateError } = await supabase
      .from('stores')
      .update({ status: 'deployed' })
      .eq('id', storeId);

    if (updateError) {
      console.error('Error updating store status:', updateError);
      throw updateError;
    }

    console.log('Store status updated successfully');
    
    const responseData = {
      success: true,
      url: store.netlify_url || `${req.url}/${storeId}`
    };
    console.log('Sending response:', responseData);
    
    return new Response(
      JSON.stringify(responseData),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
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
    );
  }
});
