
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { StoreHeader } from "@/components/StoreHeader";
import { Cart } from "@/components/Cart";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const StorePage = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const [storeData, setStoreData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStoreData = async () => {
      if (!storeId) {
        setError('Store ID is missing');
        setIsLoading(false);
        return;
      }

      try {
        console.log('Fetching store data for ID:', storeId);
        
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
          setError('Failed to fetch store data');
          toast({
            title: "Error",
            description: "Failed to fetch store data",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        if (!store) {
          console.log('No store found with ID:', storeId);
          setError('Store not found');
          toast({
            title: "Store Not Found",
            description: "The requested store could not be found",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        console.log('Store data fetched successfully:', store);
        setStoreData({
          name: store.name,
          template: store.template,
          products: store.products || []
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch store data:', error);
        setError('An unexpected error occurred');
        toast({
          title: "Error",
          description: "Failed to load store data",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchStoreData();
  }, [storeId, toast, navigate]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg text-gray-600">Loading store...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <p className="text-lg text-gray-600">{error}</p>
      <Button onClick={() => navigate('/')}>Go Back to Home</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader 
        storeName={storeData.name}
        template={storeData.template}
        isPreview={false}
      />
      <main className="container mx-auto px-4 py-8">
        <div className="fixed top-4 right-20 z-50">
          <Cart />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {storeData.products?.map((product: any) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              description={product.description || ''}
              imageUrl={product.image || ''}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default StorePage;
