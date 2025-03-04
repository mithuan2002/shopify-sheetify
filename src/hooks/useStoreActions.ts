
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
        .select('id')
        .eq('id', storeId)
        .maybeSingle();

      if (storeError) {
        console.error('Store verification error:', storeError);
        throw new Error(`Failed to verify store: ${storeError.message}`);
      }

      if (!store) {
        console.error('Store not found with ID:', storeId);
        throw new Error('Store not found');
      }

      console.log('Store verified, updating status...');
      
      // Update the store status to deployed
      const { error: updateError } = await supabase
        .from('stores')
        .update({ status: 'deployed' })
        .eq('id', storeId);
      
      if (updateError) {
        console.error('Store update error:', updateError);
        throw new Error(`Failed to update store: ${updateError.message}`);
      }
      
      console.log('Store deployed successfully');
      
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
        title: "Deployment Failed",
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

      // Process products
      if (initialProducts.length > 0) {
        console.log(`Processing ${initialProducts.length} products`);
        
        const CHUNK_SIZE = 25; // Smaller chunks for more reliable processing
        for (let i = 0; i < initialProducts.length; i += CHUNK_SIZE) {
          const chunk = initialProducts.slice(i, i + CHUNK_SIZE);
          console.log(`Processing chunk ${i/CHUNK_SIZE + 1} with ${chunk.length} products`);
          
          const productsWithStoreId = chunk.map(product => ({
            id: uuidv4(),
            store_id: storeId,
            name: product.name || 'Untitled Product',
            price: parseFloat(product.price) || 0,
            description: product.description || '',
            image: product.image || ''
          }));

          const { error: productsError } = await supabase
            .from('products')
            .insert(productsWithStoreId);

          if (productsError) {
            console.error(`Error creating products chunk:`, productsError);
            toast({
              title: "Warning",
              description: "Some products may not have been added correctly",
              variant: "destructive",
            });
            // Continue with next chunk instead of throwing error
          } else {
            console.log(`Products chunk created successfully`);
          }
        }
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
          // Non-critical error, just log warning
          toast({
            title: "Warning",
            description: "Spreadsheet connection could not be saved",
            variant: "destructive",
          });
        } else {
          console.log('Spreadsheet connection created successfully');
        }
      }

      toast({
        title: "Success!",
        description: "Store created successfully!",
      });

      // Redirect to the store page
      const previewUrl = `${window.location.origin}/${storeId}`;
      console.log('Redirecting to:', previewUrl);
      window.location.href = previewUrl;

    } catch (error: any) {
      console.error('Error creating store:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create store. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    handleDeploy,
    handleSetupComplete,
  };
};
