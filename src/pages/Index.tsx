
import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { StoreHeader } from "@/components/StoreHeader";
import { useToast } from "@/components/ui/use-toast";
import { StoreSetupWizard } from "@/components/StoreSetupWizard";
import { fetchProductsFromSheet } from "@/utils/googleSheets";

import { Cart } from "@/components/Cart";

const Index = () => {
  const [products, setProducts] = useState([]);
  const [template, setTemplate] = useState("minimal");
  const [isOwner] = useState(true);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditingStoreName, setIsEditingStoreName] = useState(false);
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

  const handleSetupComplete = async (sheetUrl: string, selectedTemplate: string, whatsappNumber: string) => {
    try {
      const fetchedProducts = await fetchProductsFromSheet(sheetUrl);
      setProducts(fetchedProducts);
      setTemplate(selectedTemplate);
      localStorage.setItem('shopkeeperWhatsapp', whatsappNumber.replace(/[^0-9+]/g, ''));
      setIsSetupComplete(true);
      toast({
        title: "Store Created!",
        description: "Your store has been created successfully with your products.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load products from your sheet. Please try again.",
        variant: "destructive",
      });
    }
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
    <div className={`min-h-screen bg-background ${
      template === "luxury" || template === "minimal-dark" ? "bg-gray-900" : 
      template === "boutique" ? "bg-rose-50" :
      template === "vintage" ? "bg-amber-50" :
      template === "artisan" ? "bg-stone-100" :
      "bg-white"
    }`}>
      <StoreHeader
        storeName="Your Beautiful Store"
        template={template}
        onTemplateChange={setTemplate}
        isOwner={isOwner}
      />
      
      <main className="container max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              template={template}
              isOwner={isOwner}
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
