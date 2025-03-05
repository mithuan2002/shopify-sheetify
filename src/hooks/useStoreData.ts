
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image: string | null;
  store_id: string | null;
};

type Store = {
  id: string;
  name: string;
  template: string;
  status: string | null;
  whatsapp: string | null;
};

export const useStoreData = () => {
  const [products, setProducts] = useState<Product[]>([]);
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

        // Get store data from localStorage
        const storedStores = localStorage.getItem('stores');
        const stores = storedStores ? JSON.parse(storedStores) : [];
        const store = stores.find((s: Store) => s.id === storeId);

        if (!store) {
          console.log('No store found with ID:', storeId);
          setError("Store not found");
          toast({
            title: "Store Not Found",
            description: "The requested store could not be found",
            variant: "destructive",
          });
          
          if (window.location.pathname !== '/') {
            setTimeout(() => {
              window.location.href = '/';
            }, 2000);
          }
          setIsLoading(false);
          return;
        }

        console.log('Store data fetched successfully:', store);
        setTemplate(store.template);
        setStoreName(store.name);
        setCurrentStoreId(store.id);
        setStoreStatus(store.status);
        setIsSetupComplete(true);

        // Get products for this store from localStorage
        const storedProducts = localStorage.getItem('products');
        const allProducts = storedProducts ? JSON.parse(storedProducts) : [];
        const storeProducts = allProducts.filter((p: Product) => p.store_id === storeId);

        console.log('Products fetched successfully:', storeProducts);
        setProducts(storeProducts || []);

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
