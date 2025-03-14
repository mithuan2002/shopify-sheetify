
import { useState } from "react";
import { StoreHeader } from "@/components/StoreHeader";
import { Cart } from "@/components/Cart";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { Loader2, CheckCircle } from "lucide-react";

interface StoreViewProps {
  storeName: string;
  template: string;
  products: any[];
  currentStoreId: string;
  onDeploy: (storeId: string) => void;
  isDeploying?: boolean;
  storeStatus?: string | null;
}

export const StoreView = ({
  storeName,
  template,
  products,
  currentStoreId,
  onDeploy,
  isDeploying = false,
  storeStatus = null,
}: StoreViewProps) => {

  const handleDeploy = async () => {
    if (!isDeploying) {
      await onDeploy(currentStoreId);
    }
  };

  const isDeployed = storeStatus === "deployed";

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader 
        storeName={storeName}
        template={template}
        isPreview={!isDeployed}
      />
      <div className="container mx-auto px-4 py-4 flex justify-end">
        {isDeployed ? (
          <div className="flex items-center ml-auto">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-green-600">Store Deployed</span>
          </div>
        ) : (
          <Button
            onClick={handleDeploy}
            disabled={!currentStoreId || isDeploying}
            className="ml-auto block"
          >
            {isDeploying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deploying...
              </>
            ) : (
              "Deploy Store"
            )}
          </Button>
        )}
      </div>
      <main className="container mx-auto px-4 py-8">
        <div className="fixed top-4 right-4 z-50">
          <Cart />
        </div>
        {products.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-xl text-gray-500">No products found for this store.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {products.map((product: any) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                description={product.description || ''}
                imageUrl={product.image || ''}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
