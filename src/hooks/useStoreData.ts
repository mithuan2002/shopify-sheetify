
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useStoreData = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [template, setTemplate] = useState("minimal");
  const [storeName, setStoreName] = useState("");
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [currentStoreId, setCurrentStoreId] = useState<string | null>(null);
  const [storeStatus, setStoreStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const path = window.location.pathname.slice(1);
        
        if (!path) {
          console.log('On root path, showing setup wizard');
          setIsSetupComplete(false);
          setIsLoading(false);
          return;
        }

        const storeId = path.split('/')[0];
        console.log('Attempting to fetch store with ID:', storeId);
        
        if (!storeId) {
          console.log('No store ID found in URL');
          setIsLoading(false);
          return;
        }

        // Fetch the store data from Supabase
        const { data: store, error: storeError } = await supabase
          .from('stores')
          .select('*')
          .eq('id', storeId)
          .maybeSingle();

        if (storeError) {
          console.error('Error fetching store:', storeError);
          setError(`Failed to fetch store data: ${storeError.message}`);
          toast({
            title: "Error",
            description: `Failed to fetch store data: ${storeError.message}`,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        if (!store) {
          console.log('No store found with ID:', storeId);
          setError("Store not found");
          toast({
            title: "Store Not Found",
            description: "The requested store could not be found in the database",
            variant: "destructive",
          });
          
          // Only redirect if we're not on the setup page
          if (window.location.pathname !== '/') {
            setTimeout(() => {
              window.location.href = '/';
            }, 2000);
          }
          setIsLoading(false);
          return;
        }

        console.log('Store data fetched successfully:', store);
        setTemplate(store.template || 'minimal');
        setStoreName(store.name);
        setCurrentStoreId(store.id);
        setStoreStatus(store.status);
        setIsSetupComplete(true);

        // Now fetch the products for this store
        const { data: storeProducts, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('storeId', storeId);

        if (productsError) {
          console.error('Error fetching products:', productsError);
          toast({
            title: "Warning",
            description: `Failed to fetch products: ${productsError.message}`,
            variant: "destructive",
          });
        } else {
          console.log('Products fetched successfully:', storeProducts);
          setProducts(storeProducts || []);
        }

        setIsLoading(false);
      } catch (error: any) {
        console.error('Failed to fetch store data:', error);
        setError(error.message || "Unknown error");
        toast({
          title: "Error",
          description: "Failed to load store data",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchStoreData();
  }, [toast]);

  return {
    products,
    setProducts,
    template,
    setTemplate,
    storeName,
    setStoreName,
    isSetupComplete,
    setIsSetupComplete,
    currentStoreId,
    setCurrentStoreId,
    storeStatus,
    isLoading,
    error,
  };
};
