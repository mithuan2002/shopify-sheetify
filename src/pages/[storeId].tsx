
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { StoreHeader } from "@/components/StoreHeader";
import { Cart } from "@/components/Cart";
import { Button } from "@/components/ui/button";

const StorePage = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const [storeData, setStoreData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  
  const handleDeploy = async () => {
    setIsDeploying(true);
    try {
      const response = await fetch('/api/store/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeId })
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Deploy error:', error);
    }
    setIsDeploying(false);
  };

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await fetch(`/api/store?storeId=${storeId}`);
        if (!response.ok) {
          throw new Error('Store not found');
        }
        const data = await response.json();
        setStoreData(data);
      } catch (error) {
        setError('Store not found');
        console.error('Failed to fetch store:', error);
      }
    };
    
    if (storeId) {
      fetchStore();
    }
  }, [storeId]);

  if (error) return <div className="min-h-screen flex items-center justify-center">{error}</div>;
  if (!storeData) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      {(!storeData.status || storeData.status === 'preview') && (
        <div className="bg-yellow-500 text-black px-4 py-2 text-center">
          Preview Mode - This is how your store will look
        </div>
      )}
      <StoreHeader 
        storeName={storeData.name}
        template={storeData.template}
        isPreview={!storeData.status || storeData.status === 'preview'}
      />
      {(storeData?.status === 'preview' || !storeData?.status) && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button 
            onClick={handleDeploy}
            disabled={isDeploying}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 py-3 text-lg shadow-lg"
          >
            {isDeploying ? "Deploying..." : "Ready to Deploy? Click Here!"}
          </Button>
        </div>
      )}
      <main className="container mx-auto px-4 py-8">
        <div className="fixed top-4 right-4 z-50">
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
