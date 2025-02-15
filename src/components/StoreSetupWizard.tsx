import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { fetchProductsFromSheet } from "@/utils/googleSheets";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
    if (step === 2 && !template) {
      toast({
        title: "Please select a template",
        description: "Choose a template for your store before proceeding",
        variant: "destructive",
      });
      return;
    }
    setStep(step + 1);
  };

  const handleTemplateSelect = (selectedTemplate: string) => {
    setTemplate(selectedTemplate);
    // Update preview immediately
    document.body.className = `${
      selectedTemplate === "luxury" || selectedTemplate === "minimal-dark" ? "bg-gray-900" : 
      selectedTemplate === "boutique" ? "bg-rose-50" :
      selectedTemplate === "vintage" ? "bg-amber-50" :
      selectedTemplate === "artisan" ? "bg-stone-100" :
      "bg-white"
    }`;
    
    // Apply template-specific styles for preview
    const previewContainer = document.getElementById('preview-container');
    if (previewContainer) {
      previewContainer.className = `preview ${selectedTemplate}`;
    }
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

  const handleCreateStore = async () => {
    if (!whatsappNumber || !storeName || !template) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    try {
      const response = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: storeName, template, whatsapp: whatsappNumber })
      });
      const store = await response.json();
      localStorage.setItem('storeId', store.id);
    } catch (error) {
      console.error('Failed to save store settings:', error);
    }
    
    if (!products.length) {
      toast({
        title: "Error",
        description: "Please add at least one product",
        variant: "destructive",
      });
      return;
    }

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
            <h2 className="text-2xl font-serif mb-4">Choose Your Store Template</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {["minimal", "elegant", "modern", "boutique", "vintage", "luxury", "minimal-dark", "artisan"].map((templateOption) => (
                  <Button
                    key={templateOption}
                    variant={template === templateOption ? "default" : "outline"}
                    className="w-full capitalize"
                    onClick={() => handleTemplateSelect(templateOption)}
                  >
                    {templateOption}
                  </Button>
                ))}
              </div>
              
              <div className={`preview-container p-6 rounded-lg ${
                template === "luxury" || template === "minimal-dark" ? "bg-gray-900 text-white" : 
                template === "boutique" ? "bg-rose-50" :
                template === "vintage" ? "bg-amber-50" :
                template === "artisan" ? "bg-stone-100" :
                "bg-white"
              }`}>
                <h3 className="text-lg font-semibold mb-4">Template Preview</h3>
                <div className="border rounded-lg p-4">
                  <div className="w-full h-40 bg-gray-200 rounded-lg mb-4"></div>
                  <h4 className={`text-xl font-bold ${template?.includes('dark') ? 'text-white' : 'text-gray-900'}`}>
                    Sample Product
                  </h4>
                  <p className={`mt-2 ${template?.includes('dark') ? 'text-gray-300' : 'text-gray-600'}`}>
                    This is how your products will look with the {template} template.
                  </p>
                  <div className="mt-4">
                    <Button className="w-full">Add to Cart</Button>
                  </div>
                </div>
              </div>
            </div>
            <Button onClick={nextStep} className="w-full mt-4">Next</Button>
            <h2 className="text-2xl font-serif mb-4">Edit Store Name</h2>
            <Input
              placeholder="Enter your Store Name"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full mb-4"
            />
            <h2 className="text-2xl font-serif mb-4">Edit/Delete Products</h2>
            <div className="grid gap-4">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md p-6 space-y-4 transition-all hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-medium">${product.price}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Image</p>
                      <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-cover rounded" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="text-sm">{product.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {editingProduct && (
              <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        type="number"
                        value={editingProduct.price}
                        onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={editingProduct.description}
                        onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <Input
                        id="imageUrl"
                        value={editingProduct.imageUrl}
                        onChange={(e) => setEditingProduct({...editingProduct, imageUrl: e.target.value})}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditingProduct(null)}>Cancel</Button>
                    <Button onClick={() => handleUpdateProduct(editingProduct)}>Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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