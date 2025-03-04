
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

      console.log("Store created successfully:", storeData);
      const storeId = storeData.id;

      // Step 2: Insert products in smaller batches to avoid large payload issues
      if (initialProducts.length > 0) {
        const productsWithStoreId = initialProducts.map(product => ({
          ...product,
          store_id: storeId
        }));

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

      // Successfully created the store, redirect to store page
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
      // Verify the store exists before attempting to deploy
      const { data: store, error: storeCheckError } = await supabase
        .from("stores")
        .select("id")
        .eq("id", storeId)
        .maybeSingle();

      if (storeCheckError) {
        console.error("Error checking store:", storeCheckError);
        throw new Error(`Failed to verify store: ${storeCheckError.message}`);
      }

      if (!store) {
        console.error("Store not found with ID:", storeId);
        throw new Error("Store not found");
      }

      // Update the store status directly in Supabase
      const { error: updateError } = await supabase
        .from("stores")
        .update({ status: "deployed" })
        .eq("id", storeId);

      if (updateError) {
        console.error("Error updating store status:", updateError);
        throw new Error(`Failed to update store status: ${updateError.message}`);
      }

      toast({
        title: "Deployment Complete",
        description: "Your store has been successfully deployed!",
      });

      // Refresh the page to show the deployed state
      window.location.reload();

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
