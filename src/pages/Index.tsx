
import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { StoreHeader } from "@/components/StoreHeader";
import { useToast } from "@/components/ui/use-toast";
import { StoreSetupWizard } from "@/components/StoreSetupWizard";
import { fetchProductsFromSheet } from "@/utils/googleSheets";

const Index = () => {
  const [products, setProducts] = useState([]);
  const [template, setTemplate] = useState("minimal");
  const [isOwner] = useState(true);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const { toast } = useToast();

  const handleEdit = (id: string) => {
    toast({
      title: "Edit Product",
      description: "To edit products, update them in your Google Sheet.",
    });
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
    toast({
      title: "Product Hidden",
      description: "The product has been hidden from your store. To permanently remove it, delete it from your Google Sheet.",
    });
  };

  const handleSetupComplete = async (sheetUrl: string, selectedTemplate: string) => {
    try {
      const fetchedProducts = await fetchProductsFromSheet(sheetUrl);
      setProducts(fetchedProducts);
      setTemplate(selectedTemplate);
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
      <div className="min-h-screen bg-background py-16">
        <StoreSetupWizard onComplete={handleSetupComplete} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background ${template === "elegant" ? "font-serif" : "font-sans"}`}>
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
