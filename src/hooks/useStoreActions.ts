
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";

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
      // Generate a unique ID for the store
      const storeId = uuidv4();

      // Create store data
      const storeData = {
        id: storeId,
        name: storeName,
        template: template,
        whatsapp: whatsappNumber,
        status: "preview"
      };

      // Save store to localStorage
      const existingStores = localStorage.getItem('stores');
      const stores = existingStores ? JSON.parse(existingStores) : [];
      stores.push(storeData);
      localStorage.setItem('stores', JSON.stringify(stores));

      console.log("Store created successfully:", storeData);

      // Add store_id to products and save to localStorage
      if (initialProducts.length > 0) {
        const productsWithStoreId = initialProducts.map(product => ({
          ...product,
          store_id: storeId,
          id: uuidv4()
        }));
        
        console.log("Saving products with storeId:", storeId);
        
        const existingProducts = localStorage.getItem('products');
        const products = existingProducts ? JSON.parse(existingProducts) : [];
        localStorage.setItem('products', JSON.stringify([...products, ...productsWithStoreId]));
        
        console.log("Products saved successfully");
      }

      // Save spreadsheet connection info
      const connectionData = {
        id: uuidv4(),
        store_id: storeId,
        spreadsheet_url: sheetUrl,
        spreadsheet_type: "google",
        whatsapp: whatsappNumber,
        template: template,
      };
      
      const existingConnections = localStorage.getItem('spreadsheet_connections');
      const connections = existingConnections ? JSON.parse(existingConnections) : [];
      connections.push(connectionData);
      localStorage.setItem('spreadsheet_connections', JSON.stringify(connections));

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
      // Get stores from localStorage
      const storedStores = localStorage.getItem('stores');
      const stores = storedStores ? JSON.parse(storedStores) : [];
      
      // Find the store
      const storeIndex = stores.findIndex((store: any) => store.id === storeId);
      
      if (storeIndex === -1) {
        throw new Error("Store not found in localStorage");
      }
      
      // Update the store status
      stores[storeIndex].status = "deployed";
      localStorage.setItem('stores', JSON.stringify(stores));

      console.log("Store marked as deployed in localStorage");

      toast({
        title: "Deployment Complete",
        description: "Your store has been successfully deployed!",
      });

      // Redirect to the store page
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
