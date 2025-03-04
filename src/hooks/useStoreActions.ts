
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useStoreActions = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSetupComplete = async (
    sheetUrl: string,
    template: string,
    whatsappNumber: string,
    storeName: string,
    initialProducts: any[]
  ) => {
    setIsProcessing(true);
    console.log("Starting store setup with:", { storeName, template, whatsappNumber });
    
    try {
      // Step 1: Create the store record first
      const { data: storeData, error: storeError } = await supabase
        .from("stores")
        .insert({
          name: storeName,
          template: template,
          whatsapp: whatsappNumber,
          status: "preview"
        })
        .select()
        .single();

      if (storeError) {
        console.error("Failed to create store:", storeError);
        throw new Error(`Store creation failed: ${storeError.message}`);
      }

      if (!storeData) {
        throw new Error("Store was created but no data was returned");
      }

      console.log("Store created successfully:", storeData);
      const storeId = storeData.id;

      // Step 2: Insert products with the correct store_id
      if (initialProducts.length > 0) {
        const productsWithStoreId = initialProducts.map(product => ({
          ...product,
          storeId: storeId // Make sure we're using the right field name matching the schema
        }));

        console.log("Inserting products with storeId:", storeId);
        
        const batchSize = 10;
        for (let i = 0; i < productsWithStoreId.length; i += batchSize) {
          const batch = productsWithStoreId.slice(i, i + batchSize);
          const { error: productsError } = await supabase
            .from("products")
            .insert(batch);

          if (productsError) {
            console.error(`Failed to insert products batch ${i}:`, productsError);
            toast({
              title: "Warning",
              description: `Some products may not have been saved: ${productsError.message}`,
              variant: "destructive",
            });
          }
        }
        console.log("Products inserted successfully");
      }

      // Step 3: Save spreadsheet connection info
      const { error: connectionError } = await supabase
        .from("spreadsheet_connections")
        .insert({
          store_id: storeId,
          spreadsheet_url: sheetUrl,
          spreadsheet_type: "google",
          whatsapp: whatsappNumber,
          template: template,
        });

      if (connectionError) {
        console.error("Failed to save spreadsheet connection:", connectionError);
        toast({
          title: "Warning",
          description: "Spreadsheet connection details may not have been saved",
          variant: "destructive",
        });
      }

      toast({
        title: "Success",
        description: "Store created successfully! Redirecting to store page.",
      });

      // Redirect to the new store page
      window.location.href = `/${storeId}`;
      
    } catch (error: any) {
      console.error("Store setup process failed:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to complete store setup",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const handleDeploy = async (storeId: string) => {
    setIsProcessing(true);
    console.log("Deploying store with ID:", storeId);

    try {
      // First verify the store exists
      const { data: store, error: checkError } = await supabase
        .from("stores")
        .select("id, name, template")
        .eq("id", storeId)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking store:", checkError);
        throw new Error(`Failed to verify store: ${checkError.message}`);
      }

      if (!store) {
        console.error("Store not found with ID:", storeId);
        throw new Error("Store not found in database");
      }

      console.log("Store found, proceeding with deployment:", store);

      // Update the store status to 'deployed'
      const { error: updateError } = await supabase
        .from("stores")
        .update({ status: "deployed" })
        .eq("id", storeId);

      if (updateError) {
        console.error("Error updating store status:", updateError);
        throw new Error(`Failed to update store status: ${updateError.message}`);
      }

      console.log("Store marked as deployed in database");

      toast({
        title: "Deployment Complete",
        description: "Your store has been successfully deployed!",
      });

      // Success! Redirect to the store page
      window.location.href = `/${storeId}`;

    } catch (error: any) {
      console.error("Deployment failed:", error);
      toast({
        title: "Deployment Failed",
        description: error.message || "An error occurred during deployment",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handleSetupComplete,
    handleDeploy,
    isProcessing,
  };
};
