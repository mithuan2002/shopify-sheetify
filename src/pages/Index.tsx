
import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { StoreHeader } from "@/components/StoreHeader";
import { useToast } from "@/components/ui/use-toast";
import { StoreSetupWizard } from "@/components/StoreSetupWizard";
import { fetchProductsFromSheet } from "@/utils/googleSheets";

import { Cart } from "@/components/Cart";

const Index = () => {
  const [products, setProducts] = useState([]);
  const [template, setTemplate] = useState("minimal");

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await fetch('/api/store');
        const store = await response.json();
        if (store) {
          setTemplate(store.template);
        }
      } catch (error) {
        console.error('Failed to fetch store settings:', error);
      }
    };
    void fetchStore();
  }, []);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { toast } = useToast();

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts(products.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    ));
    setEditingProduct(null);
    toast({
      title: "Product Updated",
      description: "Product details have been updated successfully.",
    });
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
    toast({
      title: "Product Hidden",
      description: "The product has been hidden from your store. To permanently remove it, delete it from your Google Sheet.",
    });
  };

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
    <div className={`min-h-screen ${
      template === "luxury" || template === "minimal-dark" ? "bg-gray-900" : 
      template === "boutique" ? "bg-rose-50" :
      template === "vintage" ? "bg-amber-50" :
      template === "artisan" ? "bg-stone-100" :
      "bg-white"
    }`}>
      <StoreHeader
        storeName={localStorage.getItem('storeName') || "Your Beautiful Store"}
        template={template}
      />
      
      <main className="container max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              template={template}
              onEdit={() => handleEdit(product.id)}
              onDelete={() => handleDelete(product.id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
