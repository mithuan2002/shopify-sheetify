import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { StoreHeader } from "@/components/StoreHeader";
import { Cart } from "@/components/Cart";

const Index = () => {
  const [products, setProducts] = useState([]);
  const [storeName, setStoreName] = useState("");
  const [template, setTemplate] = useState("minimal");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStoreData = async () => {
      setLoading(true);
      setError("");
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
        setError('Unable to load store data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchStoreData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading store...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 text-primary hover:underline">
            Try again
          </button>
        </div>
      </div>
    );
  }

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