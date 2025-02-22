
import { StoreHeader } from "@/components/StoreHeader";
import { Cart } from "@/components/Cart";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";

interface StoreViewProps {
  storeName: string;
  template: string;
  products: any[];
  currentStoreId: string;
  onDeploy: (storeId: string) => void;
}

export const StoreView = ({
  storeName,
  template,
  products,
  currentStoreId,
  onDeploy,
}: StoreViewProps) => {
  return (
    <div className="min-h-screen bg-background">
      <StoreHeader 
        storeName={storeName}
        template={template}
        isPreview={true}
      />
      <div className="container mx-auto px-4 py-4">
        <Button
          onClick={() => onDeploy(currentStoreId)}
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
