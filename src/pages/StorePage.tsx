import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { StoreHeader } from "@/components/StoreHeader";
import { Cart } from "@/components/Cart";

const StorePage = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const [storeData, setStoreData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storeProducts = localStorage.getItem(`store_${storeId}_products`);
    const storeName = localStorage.getItem(`store_${storeId}_name`);
    const storeTemplate = localStorage.getItem(`store_${storeId}_template`);

    if (!storeProducts || !storeName || !storeTemplate) {
      setError('Store not found');
      return;
    }

    setStoreData({
      name: storeName,
      template: storeTemplate,
      products: JSON.parse(storeProducts)
    });

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
      <StoreHeader 
        storeName={storeData.name}
        template={storeData.template}
        isPreview={true}
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