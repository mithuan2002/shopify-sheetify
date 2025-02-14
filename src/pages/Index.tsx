
import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { StoreHeader } from "@/components/StoreHeader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

// Temporary mock data - will be replaced with Google Sheets data
const mockProducts = [
  {
    id: "1",
    name: "Premium Product 1",
    price: 99.99,
    description: "High-quality premium product with amazing features.",
    image: "/placeholder.svg",
  },
  {
    id: "2",
    name: "Elegant Item 2",
    price: 149.99,
    description: "Elegantly designed item perfect for your needs.",
    image: "/placeholder.svg",
  },
  {
    id: "3",
    name: "Luxury Product 3",
    price: 199.99,
    description: "Luxurious product with outstanding quality.",
    image: "/placeholder.svg",
  },
];

const Index = () => {
  const [products, setProducts] = useState(mockProducts);
  const [template, setTemplate] = useState("minimal");
  const [isOwner] = useState(true); // This will be replaced with actual authentication
  const { toast } = useToast();

  const handleEdit = (id: string) => {
    toast({
      title: "Edit Product",
      description: "Edit functionality will be implemented with Google Sheets integration.",
    });
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
    toast({
      title: "Product Deleted",
      description: "The product has been removed from your store.",
    });
  };

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

        {isOwner && (
          <div className="mt-8 text-center">
            <Button
              onClick={() => {
                toast({
                  title: "Coming Soon",
                  description: "Google Sheets integration will be added in the next update.",
                });
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Connect Google Sheet
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
