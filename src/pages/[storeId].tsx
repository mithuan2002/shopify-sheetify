
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { StoreHeader } from "@/components/StoreHeader";
import { Cart } from "@/components/Cart";

const StorePage = () => {
  const { storeId } = useParams();
  const [storeData, setStoreData] = useState<any>(null);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await fetch(`/api/store/${storeId}`);
        const data = await response.json();
        setStoreData(data);
      } catch (error) {
        console.error('Failed to fetch store:', error);
      }
    };
    fetchStore();
  }, [storeId]);

  if (!storeData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader 
        storeName={storeData.name}
        template={storeData.template}
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
