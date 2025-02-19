
import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { StoreHeader } from "@/components/StoreHeader";
import { useToast } from "@/components/ui/use-toast";
import { StoreSetupWizard } from "@/components/StoreSetupWizard";
import { Cart } from "@/components/Cart";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";

// Function to clear all store data
const clearStoreData = () => {
  localStorage.clear();
  window.location.href = '/';
};

const Index = () => {
  const [products, setProducts] = useState([]);
  const [template, setTemplate] = useState("minimal");
  const [storeName, setStoreName] = useState("");
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        // Get store ID from URL if it exists
        const storeId = window.location.pathname.split('/')[1];
        if (!storeId) return;

        const { data: store, error: storeError } = await supabase
          .from('stores')
          .select(`
            *,
            products (*)
          `)
          .eq('id', storeId)
          .single();

        if (storeError) {
          console.error('Error fetching store:', storeError);
          return;
        }

        if (store) {
          setTemplate(store.template);
          setProducts(store.products || []);
          setStoreName(store.name);
          setIsSetupComplete(true);
        }
      } catch (error) {
        console.error('Failed to fetch store data:', error);
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
      // Create new store in Supabase
      const storeId = uuidv4();
      const { error: storeError } = await supabase
        .from('stores')
        .insert({
          id: storeId,
          name,
          template: selectedTemplate,
          whatsapp: whatsappNumber.replace(/[^0-9+]/g, ''),
          status: 'preview'
        });

      if (storeError) throw storeError;

      // Insert products
      const productsWithStoreId = initialProducts.map(product => ({
        ...product,
        store_id: storeId
      }));

      const { error: productsError } = await supabase
        .from('products')
        .insert(productsWithStoreId);

      if (productsError) throw productsError;

      // Save sheet connection if URL provided
      if (sheetUrl) {
        const { error: sheetError } = await supabase
          .from('spreadsheet_connections')
          .insert({
            store_id: storeId,
            spreadsheet_url: sheetUrl,
            spreadsheet_type: 'google'
          });

        if (sheetError) throw sheetError;
      }

      // Update local state
      setProducts(initialProducts);
      setTemplate(selectedTemplate);
      setStoreName(name);
      setIsSetupComplete(true);

      // Redirect to store preview
      const previewUrl = `${window.location.origin}/${storeId}`;
      window.location.href = previewUrl;

    } catch (error) {
      console.error('Error creating store:', error);
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
