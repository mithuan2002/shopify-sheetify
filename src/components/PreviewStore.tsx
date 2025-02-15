
import { FC } from 'react';
import { StoreHeader } from './StoreHeader';
import { ProductCard } from './ProductCard';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';

interface PreviewStoreProps {
  storeName: string;
  template: string;
  products: any[];
  onConfirm: () => void;
  onBack: () => void;
  open: boolean;
}

export const PreviewStore: FC<PreviewStoreProps> = ({
  storeName,
  template,
  products,
  onConfirm,
  onBack,
  open
}) => {
  return (
    <Dialog open={open}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Store Preview</DialogTitle>
        </DialogHeader>
        
        <div className="preview-container">
          <div className="min-h-screen bg-background">
            <StoreHeader 
              storeName={storeName}
              template={template}
            />
            <main className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
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
            </main>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onBack}>Go Back</Button>
          <Button onClick={onConfirm}>Launch Store</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
