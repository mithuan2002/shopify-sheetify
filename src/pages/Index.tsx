import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { StoreHeader } from "@/components/StoreHeader";
import { useToast } from "@/components/ui/use-toast";
import { StoreSetupWizard } from "@/components/StoreSetupWizard";
import { fetchProductsFromSheet } from "@/utils/googleSheets"; // Added import from original code
import { Cart } from "@/components/Cart";

const Index = () => {
  const [products, setProducts] = useState([
    {
      id: '1',
      name: 'Sample Product 1',
      price: 19.99,
      description: 'This is a sample product description',
      imageUrl: 'https://placehold.co/400x300'
    },
    {
      id: '2',
      name: 'Sample Product 2',
      price: 29.99,
      description: 'Another sample product description',
      imageUrl: 'https://placehold.co/400x300'
    },
    {
      id: '3',
      name: 'Sample Product 3',
      price: 39.99,
      description: 'Yet another sample product',
      imageUrl: 'https://placehold.co/400x300'
    }
  ]);
  const [template, setTemplate] = useState("minimal");
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedTemplate = localStorage.getItem('storeTemplate');
    const storedName = localStorage.getItem('storeName');
    if (storedTemplate && storedName) {
      setTemplate(storedTemplate);
      setIsSetupComplete(true);
    }
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

    setProducts(initialProducts);
    setTemplate(selectedTemplate);
    localStorage.setItem('shopkeeperWhatsapp', whatsappNumber.replace(/[^0-9+]/g, ''));
    localStorage.setItem('storeName', storeName);
    localStorage.setItem('storeTemplate', selectedTemplate);
    setIsSetupComplete(true);

    toast({
      title: "Success",
      description: "Your store has been created successfully!",
    });
  };

  if (!isSetupComplete) {
    return (
      <div className="min-h-screen bg-background py-16 relative">
        <div className="fixed top-4 right-4 z-50">
          <Cart />
        </div>
        <StoreSetupWizard onComplete={handleSetupComplete} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background`}>
      <div className="fixed top-4 right-4 z-50">
        <Cart />
      </div>
      <div className="container mx-auto px-4 py-8">
        <StoreHeader />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {products.map((product: any) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              description={product.description}
              imageUrl={product.imageUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;