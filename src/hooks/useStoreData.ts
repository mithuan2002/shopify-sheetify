
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useStoreData = () => {
  const [products, setProducts] = useState([]);
  const [template, setTemplate] = useState("minimal");
  const [storeName, setStoreName] = useState("");
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [currentStoreId, setCurrentStoreId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const path = window.location.pathname.slice(1);
        
        if (!path) {
          console.log('On root path, showing setup wizard');
          setIsSetupComplete(false);
          return;
        }

        const storeId = path.split('/')[0];
        console.log('Attempting to fetch store with ID:', storeId);
        
        if (!storeId) {
          console.log('No store ID found in URL');
          return;
        }

        const { data: store, error: storeError } = await supabase
          .from('stores')
          .select(`
            *,
            products (*)
          `)
          .eq('id', storeId)
          .maybeSingle();

        if (storeError) {
          console.error('Error fetching store:', storeError);
          toast({
            title: "Error",
            description: "Failed to fetch store data",
            variant: "destructive",
          });
          return;
        }

        if (store) {
          console.log('Store data fetched successfully:', store);
          setTemplate(store.template);
          setProducts(store.products || []);
          setStoreName(store.name);
          setCurrentStoreId(store.id);
          setIsSetupComplete(true);
        } else {
          console.log('No store found with ID:', storeId);
          toast({
            title: "Store Not Found",
            description: "The requested store could not be found",
            variant: "destructive",
          });
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        }
      } catch (error) {
        console.error('Failed to fetch store data:', error);
        toast({
          title: "Error",
          description: "Failed to load store data",
          variant: "destructive",
        });
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
  };
};
