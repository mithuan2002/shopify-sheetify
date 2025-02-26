
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
      console.log('Attempting to deploy store with ID:', storeId);
      
      // First verify the store exists
      const { data: store, error: storeError } = await supabase
        .from('stores')
        .select('id, status')
        .eq('id', storeId)
        .maybeSingle();

      if (storeError) {
        throw new Error(`Failed to verify store: ${storeError.message}`);
      }

      if (!store) {
        throw new Error('Store not found');
      }

      console.log('Store found, invoking deploy function...');
      
      const { data, error } = await supabase.functions.invoke('deploy-store', {
        body: { storeId }
      });

      if (error) {
        console.error('Function invocation error:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to deploy store",
          variant: "destructive",
        });
        return;
      }

      console.log('Deployment response:', data);
      toast({
        title: "Success!",
        description: "Store deployed successfully!",
      });

      if (data?.url) {
        window.location.href = data.url;
      }
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

      const productsWithStoreId = initialProducts.map(product => ({
        id: uuidv4(),
        store_id: storeId,
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image
      }));

      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .insert(productsWithStoreId)
        .select();

      if (productsError) {
        console.error('Error creating products:', productsError);
        throw productsError;
      }

      console.log('Products created successfully:', productsData);

      if (sheetUrl) {
        const { error: sheetError } = await supabase
          .from('spreadsheet_connections')
          .insert({
            store_id: storeId,
            spreadsheet_url: sheetUrl,
            spreadsheet_type: 'google'
          })
          .select();

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
