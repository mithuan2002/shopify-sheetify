import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { StoreHeader } from "@/components/StoreHeader";
import { Cart } from "@/components/Cart";

const Index = () => {
  const [products, setProducts] = useState([]);
  const [storeName, setStoreName] = useState("");
  const [template, setTemplate] = useState("minimal");

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await fetch('/api/store');
        const storeData = await response.json();
        if (storeData) {
          setTemplate(storeData.template || "minimal");
          setProducts(storeData.products || []);
          setStoreName(storeData.name || "Store");
        }
      } catch (error) {
        console.error('Failed to fetch store data:', error);
      }
    };
    fetchStoreData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader 
        storeName={storeName}
        template={template}
      />
      <main className="container mx-auto px-4 py-8">
        <div className="fixed top-4 right-4 z-50">
          <Cart />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {products.map((product: any) => (
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

export default Index;