
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
  const [template, setTemplate] = useState("minimal");
  const { toast } = useToast();

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await fetch('/api/store');
        if (!response.ok) {
          if (response.status === 404) {
            setIsSetupComplete(false);
            return;
          }
          throw new Error('Failed to fetch store data');
        }
        const storeData = await response.json();
        if (storeData) {
          setTemplate(storeData.template || "minimal");
          setProducts(storeData.products || []);
          setStoreName(storeData.name || "My Store");
          setIsSetupComplete(true);
        }
      } catch (error) {
        console.error('Failed to fetch store data:', error);
        setIsSetupComplete(false);
      }
    };
    fetchStoreData();
  }, []);

  const handleSetupComplete = async (sheetUrl: string, selectedTemplate: string, whatsappNumber: string, name: string, initialProducts: any[]) => {
    if (!whatsappNumber || !name) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          template: selectedTemplate,
          whatsapp: whatsappNumber.replace(/[^0-9+]/g, '')
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create store');
      }

      const data = await response.json();
      setStoreName(data.name);
      setTemplate(data.template);
      setProducts(initialProducts);
      setIsSetupComplete(true);
      
      toast({
        title: "Success",
        description: "Your store has been created successfully!",
      });
    } catch (error) {
      console.error('Failed to create store:', error);
      toast({
        title: "Error",
        description: "Failed to create store. Please try again.",
        variant: "destructive",
      });
    }
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
