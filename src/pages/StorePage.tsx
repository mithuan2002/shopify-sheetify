
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { StoreHeader } from "@/components/StoreHeader";
import { Cart } from "@/components/Cart";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const StorePage = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const [storeData, setStoreData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);

  const handleDeploy = async () => {
    if (!storeId) return;
    
    setIsDeploying(true);
    try {
      const { data, error } = await supabase.functions.invoke('deploy-store', {
        body: { storeId }
      });

      if (error) throw error;

      toast({
        title: "Store Deployed!",
        description: `Your store is now live at ${data.url}`,
      });

      // Update local state
      setStoreData(prev => ({
        ...prev,
        status: 'deployed',
        netlify_url: data.url
      }));
    } catch (error) {
      console.error('Deploy error:', error);
      toast({
        title: "Deployment Failed",
        description: "There was an error deploying your store. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  useEffect(() => {
    const fetchStore = async () => {
      if (!storeId) return;

      try {
        const { data: store, error: storeError } = await supabase
          .from('stores')
          .select(`
            *,
            products (*)
          `)
          .eq('id', storeId)
          .single();

        if (storeError) throw storeError;
        if (!store) throw new Error('Store not found');

        setStoreData(store);
      } catch (error) {
        setError('Store not found');
        console.error('Failed to fetch store:', error);
      }
    };

    if (storeId) {
      fetchStore();
    }

    const handleBackButton = () => {
      const currentStep = localStorage.getItem('currentStep');
      if (currentStep) {
        navigate('/', { state: { step: parseInt(currentStep) } });
      }
    };

    window.addEventListener('popstate', handleBackButton);
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [storeId, navigate]);

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg text-gray-600">{error}</p>
    </div>
  );
  
  if (!storeData) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg text-gray-600">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {(!storeData.status || storeData.status === 'preview') ? (
        <Button 
          onClick={handleDeploy}
          disabled={isDeploying}
          className="fixed top-4 right-4 z-50 bg-black text-white hover:bg-gray-800 font-semibold px-6"
        >
          {isDeploying ? "Making Public..." : "Make Store Public"}
        </Button>
      ) : (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          <a
            href={storeData.netlify_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            View Live Store
          </a>
        </div>
      )}
      <StoreHeader 
        storeName={storeData.name}
        template={storeData.template}
        isPreview={!storeData.status || storeData.status === 'preview'}
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
              description={product.description}
              imageUrl={product.image}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default StorePage;
