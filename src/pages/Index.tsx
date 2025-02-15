import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { StoreHeader } from "@/components/StoreHeader";
import { useToast } from "@/components/ui/use-toast";
import { StoreSetupWizard } from "@/components/StoreSetupWizard";
import { Cart } from "@/components/Cart";

const Index = () => {
  const [products, setProducts] = useState([]);
  const [storeName, setStoreName] = useState("");
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
          setStoreName(storeData.name || "My Store");
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

    toast({
      title: "Success",
      description: "Your store has been created successfully!",
    });
  };

  if (!isSetupComplete) {
    return (
      <div className="min-h-screen bg-background py-16 relative">
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
        isOwner={true}
        onTemplateChange={setTemplate}
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