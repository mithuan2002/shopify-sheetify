import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { ProductCard } from "@/components/ProductCard";
import { StoreHeader } from "@/components/StoreHeader";
import { Cart } from "@/components/Cart";
import { Button } from "@/components/ui/button";

const StorePage = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate(); // Initialize useNavigate
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
    //Added this to handle back navigation.  Assumes '/templates' is the template selection route
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


  if (error) return <div className="min-h-screen flex items-center justify-center">{error}</div>;
  if (!storeData) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      {(!storeData.status || storeData.status === 'preview') && (
        <Button 
          onClick={handleDeploy}
          disabled={isDeploying}
          className="fixed top-4 right-4 z-50 bg-black text-white hover:bg-gray-800 font-semibold px-6"
        >
          {isDeploying ? "Making Public..." : "Make Store Public"}
        </Button>
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