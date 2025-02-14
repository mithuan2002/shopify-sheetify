import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { fetchProductsFromSheet } from "@/utils/googleSheets";

interface StoreSetupWizardProps {
  onComplete: (sheetUrl: string, template: string, whatsappNumber: string, storeName: string, products: any[]) => void;
}

export const StoreSetupWizard = ({ onComplete }: StoreSetupWizardProps) => {
  const [step, setStep] = useState(1);
  const [sheetUrl, setSheetUrl] = useState("");
  const [template, setTemplate] = useState("minimal");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [storeName, setStoreName] = useState("Your Beautiful Store");
  const { toast } = useToast();

  const handleSheetSubmit = async () => {
    if (!sheetUrl) {
      toast({
        title: "Error",
        description: "Please enter a Google Sheet URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Try to fetch products from the sheet
      const fetchedProducts = await fetchProductsFromSheet(sheetUrl);
      setProducts(fetchedProducts);
      setStep(2);
      toast({
        title: "Success!",
        description: "Successfully connected to your Google Sheet.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Make sure your Google Sheet is publicly accessible and contains the correct columns: Name, Price, Description, Image URL",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const handleEditProduct = (product) => {
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

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(p => p.id !== productId));
    toast({
      title: "Product Deleted",
      description: "Product has been removed successfully.",
    });
  };

  const handleCreateStore = () => {
    onComplete(sheetUrl, template, whatsappNumber, storeName, products);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {step === 1 ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-serif mb-4">Connect Your Product Sheet</h2>
            <div className="space-y-2">
              <Input
                placeholder="Paste your Google Sheet URL"
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Your sheet should have these columns: Name, Price, Description, Image URL
              </p>
            </div>
            <Button
              onClick={handleSheetSubmit}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Connecting..." : "Connect Sheet"}
            </Button>
          </div>
        ) : step === 2 ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-serif mb-4">Edit Store Name</h2>
            <Input
              placeholder="Enter your Store Name"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full mb-4"
            />
            <h2 className="text-2xl font-serif mb-4">Edit/Delete Products</h2>
            {products.map((product) => (
              <div key={product.id} className="border p-4 mb-4">
                <h3>{product.name}</h3>
                <p>Price: {product.price}</p>
                <p>Description: {product.description}</p>
                <p>Image URL: {product.imageUrl}</p>
                <Button onClick={() => handleEditProduct(product)}>Edit</Button>
                <Button onClick={() => handleDeleteProduct(product.id)}>Delete</Button>
              </div>
            ))}
            {editingProduct && (
              <div>
                {/* Add form to edit product here */}
              </div>
            )}

            <Button onClick={nextStep} className="w-full">Next</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-serif mb-4">Enter Your WhatsApp Number</h2>
            <div className="space-y-2">
              <Input
                placeholder="WhatsApp Number (with country code)"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Your customers' orders will be sent to this number
              </p>
            </div>
            <Button
              onClick={handleCreateStore}
              className="w-full"
            >
              Create Store
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};