
import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { StoreHeader } from "@/components/StoreHeader";
import { useToast } from "@/components/ui/use-toast";
import { StoreSetupWizard } from "@/components/StoreSetupWizard";
import { Cart } from "@/components/Cart";
import { Button } from "@/components/ui/button";

// Function to clear all store data
const clearStoreData = () => {
  localStorage.clear();
  window.location.href = '/';
};

const Index = () => {
  // Clear state and initialize store
  useEffect(() => {
    localStorage.clear();
    localStorage.setItem('initStore', 'true');
  }, []);
  
  const [products, setProducts] = useState([]);
  const [template, setTemplate] = useState("minimal");
  const [storeName, setStoreName] = useState(localStorage.getItem('storeName') || "");
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await fetch('/api/store');
        const storeData = await response.json();
        if (storeData) {
          setTemplate(storeData.template);
          setProducts(storeData.products || []);
          setStoreName(localStorage.getItem('storeName') || storeData.name || "My Store");
          setIsSetupComplete(true);
        }
      } catch (error) {
        console.error('Failed to fetch store data:', error);
      }
    };
    fetchStoreData();
  }, []);

  const handleSetupComplete = (sheetUrl: string, selectedTemplate: string, whatsappNumber: string, storeName: string, initialProducts: any[]) => {
    if (!whatsappNumber || !storeName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Save all store data
    setProducts(initialProducts);
    setTemplate(selectedTemplate);
    localStorage.setItem('shopkeeperWhatsapp', whatsappNumber.replace(/[^0-9+]/g, ''));
    localStorage.setItem('storeName', storeName);
    localStorage.setItem('storeTemplate', selectedTemplate);
    localStorage.setItem('storeProducts', JSON.stringify(initialProducts));
    setIsSetupComplete(true);

    const storeId = crypto.randomUUID();
    localStorage.setItem(`store_${storeId}_name`, storeName);
    localStorage.setItem(`store_${storeId}_template`, selectedTemplate);
    localStorage.setItem(`store_${storeId}_products`, JSON.stringify(initialProducts));
    localStorage.setItem(`store_${storeId}_status`, 'preview');
    
    const previewUrl = `${window.location.origin}/${storeId}`;
    window.location.href = previewUrl;
  };

  if (!isSetupComplete) {
    return (
      <div className="min-h-screen bg-background py-16 relative">
        <Button 
          onClick={clearStoreData}
          className="absolute top-4 right-4"
          variant="outline"
        >
          Reset Store
        </Button>
        <h1 className="text-2xl font-bold text-center mb-8">Welcome to Store Builder</h1>
        <p className="text-center mb-8 text-muted-foreground">Let's set up your store in 3 easy steps:</p>
        <StoreSetupWizard onComplete={handleSetupComplete} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader 
        storeName={storeName}
        template={template}
        isPreview={true}
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
