import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { StoreHeader } from "@/components/StoreHeader";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";


const Index = () => {
  const [products, setProducts] = useState([]);
  const [storeName, setStoreName] = useState("");
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [template, setTemplate] = useState("minimal");
  const { toast: useToast } = useToast();
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, whatsapp }),
      });

      if (!response.ok) {
        throw new Error('Failed to create store');
      }

      const data = await response.json();
      useToast({
        title: "Success",
        description: "Your store has been created successfully!",
      });
      console.log('Store created:', data);
      setStoreName(data.name);
      setIsSetupComplete(true);

    } catch (error) {
      useToast({
        title: "Error",
        description: "Failed to create store. Please try again.",
        variant: "destructive",
      });
      console.error('Error:', error);
    }
  };

  if (!isSetupComplete) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Create Store</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Store Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              type="text"
              placeholder="WhatsApp Number"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Create Store</Button>
        </form>
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