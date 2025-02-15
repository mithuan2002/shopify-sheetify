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
        const name = localStorage.getItem(`store_${storeId}_name`);
        const template = localStorage.getItem(`store_${storeId}_template`);
        const products = JSON.parse(localStorage.getItem(`store_${storeId}_products`) || '[]');
        const status = localStorage.getItem(`store_${storeId}_status`);

        if (!name) {
          throw new Error('Store not found');
        }

        setStoreData({ name, template, products, status });
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
        <div className="bg-yellow-500/90 backdrop-blur-sm text-black px-4 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-50 shadow-md">
          <div className="flex items-center gap-2">
            <span className="font-medium">Preview Mode</span>
            <span className="text-sm">This is how your store will look to customers</span>
          </div>
          <Button 
            onClick={handleDeploy}
            disabled={isDeploying}
            className="bg-black text-white hover:bg-gray-800 font-semibold px-6"
          >
            {isDeploying ? "Making Public..." : "Make Store Public"}
          </Button>
        </div>
      )}
      <StoreHeader 
        storeName={storeData.name}
        template={storeData.template}
        isPreview={!storeData.status || storeData.status === 'preview'}
      />
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