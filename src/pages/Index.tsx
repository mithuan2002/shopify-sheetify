
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
  const [currentStoreId, setCurrentStoreId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        // Get store ID from URL if it exists
        const storeId = window.location.pathname.split('/')[1];
        console.log('Attempting to fetch store with ID:', storeId);
        
        if (!storeId) {
          console.log('No store ID found in URL');
          return;
        }

        const { data: store, error: storeError } = await supabase
          .from('stores')
          .select(`
            *,
            products (*)
          `)
          .eq('id', storeId)
          .maybeSingle();

        if (storeError) {
          console.error('Error fetching store:', storeError);
          return;
        }

        if (store) {
          console.log('Store data fetched successfully:', store);
          setTemplate(store.template);
          setProducts(store.products || []);
          setStoreName(store.name);
          setCurrentStoreId(store.id);
          setIsSetupComplete(true);
        } else {
          console.log('No store found with ID:', storeId);
          toast({
            title: "Error",
            description: "Store not found",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Failed to fetch store data:', error);
      }
    };
    fetchStoreData();
  }, [toast]);

  const handleDeploy = async (storeId: string) => {
    if (!storeId) {
      toast({
        title: "Error",
        description: "No store ID available to deploy",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Attempting to deploy store:', storeId);
      const { data, error } = await supabase.functions.invoke('deploy-store', {
        body: { storeId }
      });

      if (error) {
        console.error('Function invocation error:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to deploy store",
          variant: "destructive",
        });
        return;
      }

      console.log('Deployment response:', data);
      toast({
        title: "Success!",
        description: "Store deployed successfully!",
      });

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Deployment error:', error);
      toast({
        title: "Error",
        description: "Failed to deploy store. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSetupComplete = async (sheetUrl: string, selectedTemplate: string, whatsappNumber: string, name: string, initialProducts: any[]) => {
    console.log('Starting store setup with:', { sheetUrl, selectedTemplate, whatsappNumber, name, productsCount: initialProducts.length });

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
      console.log('Generated store ID:', storeId);

      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .insert({
          id: storeId,
          name,
          template: selectedTemplate,
          whatsapp: whatsappNumber.replace(/[^0-9+]/g, ''),
          status: 'preview'
        })
        .select()
        .single();

      if (storeError) {
        console.error('Error creating store:', storeError);
        throw storeError;
      }

      console.log('Store created successfully:', storeData);

      // Insert products
      const productsWithStoreId = initialProducts.map(product => ({
        id: uuidv4(),
        store_id: storeId,
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image
      }));

      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .insert(productsWithStoreId)
        .select();

      if (productsError) {
        console.error('Error creating products:', productsError);
        throw productsError;
      }

      console.log('Products created successfully:', productsData);

      // Save sheet connection if URL provided
      if (sheetUrl) {
        const { error: sheetError } = await supabase
          .from('spreadsheet_connections')
          .insert({
            store_id: storeId,
            spreadsheet_url: sheetUrl,
            spreadsheet_type: 'google'
          })
          .select()
          .single();

        if (sheetError) {
          console.error('Error creating spreadsheet connection:', sheetError);
          throw sheetError;
        }

        console.log('Spreadsheet connection created successfully');
      }

      // Update local state
      setProducts(productsWithStoreId);
      setTemplate(selectedTemplate);
      setStoreName(name);
      setCurrentStoreId(storeId);
      setIsSetupComplete(true);

      toast({
        title: "Success!",
        description: "Store created successfully!",
      });

      // Redirect to store preview
      const previewUrl = `${window.location.origin}/${storeId}`;
      console.log('Redirecting to:', previewUrl);
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
      {/* Added deploy button in preview mode */}
      <div className="container mx-auto px-4 py-4">
        <Button
          onClick={() => handleDeploy(currentStoreId!)}
          className="ml-auto block"
          disabled={!currentStoreId}
        >
          Deploy Store
        </Button>
      </div>
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
