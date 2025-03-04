
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

export const useStoreActions = () => {
  const { toast } = useToast();

  const handleDeploy = async (storeId: string) => {
    if (!storeId) {
      toast({
        title: "Error",
        description: "No store ID available to deploy",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Starting deployment process for store:', storeId);
      
      // First verify the store exists
      const { data: store, error: storeError } = await supabase
        .from('stores')
        .select('id, status')
        .eq('id', storeId)
        .maybeSingle();

      if (storeError) {
        console.error('Store verification error:', storeError);
        throw new Error(`Failed to verify store: ${storeError.message}`);
      }

      if (!store) {
        throw new Error('Store not found');
      }

      console.log('Store verified, updating status...');
      
      // Instead of calling an Edge Function, just update the store status directly
      const { data: updatedStore, error: updateError } = await supabase
        .from('stores')
        .update({ status: 'deployed' })
        .eq('id', storeId)
        .select()
        .single();
      
      if (updateError) {
        console.error('Store update error:', updateError);
        throw new Error(`Failed to update store: ${updateError.message}`);
      }
      
      console.log('Store deployed successfully:', updatedStore);
      
      toast({
        title: "Success!",
        description: "Store deployed successfully!",
      });

      // Redirect to the store page
      const storeUrl = `${window.location.origin}/${storeId}`;
      console.log('Redirecting to:', storeUrl);
      window.location.href = storeUrl;
      
    } catch (error: any) {
      console.error('Deployment error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to deploy store. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSetupComplete = async (
    sheetUrl: string,
    selectedTemplate: string,
    whatsappNumber: string,
    name: string,
    initialProducts: any[]
  ) => {
    console.log('Starting store setup with:', {
      sheetUrl,
      selectedTemplate,
      whatsappNumber,
      name,
      productsCount: initialProducts.length,
    });

    if (!whatsappNumber || !name) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const storeId = uuidv4();
      console.log('Generated store ID:', storeId);

      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .insert({
          id: storeId,
          name,
          template: selectedTemplate,
          whatsapp: whatsappNumber.replace(/[^0-9+]/g, ''),
          status: 'preview'
        })
        .select()
        .single();

      if (storeError) {
        console.error('Error creating store:', storeError);
        throw storeError;
      }

      console.log('Store created successfully:', storeData);

      // Process products in chunks to avoid request size limits
      const CHUNK_SIZE = 50;
      const productChunks = [];
      
      for (let i = 0; i < initialProducts.length; i += CHUNK_SIZE) {
        productChunks.push(initialProducts.slice(i, i + CHUNK_SIZE));
      }
      
      console.log(`Processing ${productChunks.length} product chunks`);
      
      for (let i = 0; i < productChunks.length; i++) {
        const chunk = productChunks[i];
        console.log(`Processing chunk ${i+1}/${productChunks.length} with ${chunk.length} products`);
        
        const productsWithStoreId = chunk.map(product => ({
          id: uuidv4(),
          store_id: storeId,
          name: product.name,
          price: product.price,
          description: product.description || '',
          image: product.image || ''
        }));

        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .insert(productsWithStoreId)
          .select();

        if (productsError) {
          console.error(`Error creating products chunk ${i+1}:`, productsError);
          throw productsError;
        }

        console.log(`Products chunk ${i+1} created successfully:`, productsData);
      }

      if (sheetUrl) {
        const { error: sheetError } = await supabase
          .from('spreadsheet_connections')
          .insert({
            store_id: storeId,
            spreadsheet_url: sheetUrl,
            spreadsheet_type: 'google'
          });

        if (sheetError) {
          console.error('Error creating spreadsheet connection:', sheetError);
          throw sheetError;
        }

        console.log('Spreadsheet connection created successfully');
      }

      toast({
        title: "Success!",
        description: "Store created successfully!",
      });

      // Redirect to the store page
      const previewUrl = `${window.location.origin}/${storeId}`;
      console.log('Redirecting to:', previewUrl);
      window.location.href = previewUrl;

    } catch (error) {
      console.error('Error creating store:', error);
      toast({
        title: "Error",
        description: "Failed to create store. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    handleDeploy,
    handleSetupComplete,
  };
};
