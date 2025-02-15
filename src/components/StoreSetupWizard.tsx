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
  const [sheetUrl, setSheetUrl] = useState("");
  const [template, setTemplate] = useState("minimal");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
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
      const fetchedProducts = await fetchProductsFromSheet(sheetUrl);
      setProducts(fetchedProducts);
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

  const handleTemplateSelect = (selectedTemplate: string) => {
    setTemplate(selectedTemplate);
    document.body.className = `${
      selectedTemplate === "luxury" || selectedTemplate === "minimal-dark" ? "bg-gray-900" : 
      selectedTemplate === "boutique" ? "bg-rose-50" :
      selectedTemplate === "vintage" ? "bg-amber-50" :
      selectedTemplate === "artisan" ? "bg-stone-100" :
      "bg-white"
    }`;

    const previewContainer = document.getElementById('preview-container');
    if (previewContainer) {
      previewContainer.className = `preview ${selectedTemplate}`;
    }
  };

  const handlePreview = () => {
    if (!whatsappNumber || !storeName || !template || !products.length) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and add at least one product",
        variant: "destructive",
      });
      return;
    }
    onComplete(sheetUrl, template, whatsappNumber, storeName, products);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-serif">Connect Your Product Sheet</h2>
            <Input
              placeholder="Paste your Google Sheet URL"
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
            />
            <Button
              onClick={handleSheetSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Connecting..." : "Connect Sheet"}
            </Button>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-serif">Store Details</h2>
            <Input
              placeholder="Enter your Store Name"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />
            <Input
              placeholder="WhatsApp Number (with country code)"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-serif">Choose Template</h2>
            <div className="grid grid-cols-2 gap-2">
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
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-serif">Connected Products</h2>
          <div className="max-h-[500px] overflow-y-auto space-y-4">
            {products.map((product: any) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center gap-4">
                  <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-gray-500">${product.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={handlePreview}
          className="col-span-full text-lg py-6"
          size="lg"
        >
          Preview Store
        </Button>
      </motion.div>
    </div>
  );
};