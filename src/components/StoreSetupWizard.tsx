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
    
    const storeId = crypto.randomUUID();
    localStorage.setItem(`store_${storeId}_name`, storeName);
    localStorage.setItem(`store_${storeId}_template`, template);
    localStorage.setItem(`store_${storeId}_products`, JSON.stringify(products));
    
    localStorage.setItem('shopkeeperWhatsapp', whatsappNumber.replace(/[^0-9+]/g, ''));
    
    window.location.href = `/${storeId}`;
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
            <div className="mt-4 border rounded-lg p-4 bg-white shadow-sm">
              <h3 className="text-lg font-medium mb-2">Template Preview</h3>
              <div className={`aspect-video rounded-lg overflow-hidden ${
                template === "minimal" ? "bg-white" :
                template === "modern" ? "bg-gradient-to-br from-blue-600 to-purple-600" :
                template === "elegant" ? "bg-slate-50" :
                template === "boutique" ? "bg-rose-50" :
                template === "vintage" ? "bg-amber-50" :
                template === "luxury" ? "bg-gray-900" :
                template === "minimal-dark" ? "bg-gray-900" :
                template === "artisan" ? "bg-stone-100" : ""
              }`}>
                <div className="h-full flex flex-col items-start p-4">
                  <div className={`text-2xl font-semibold mb-4 ${
                    template === "modern" || template === "luxury" || template === "minimal-dark" ? "text-white" :
                    template === "boutique" ? "text-rose-900" :
                    template === "vintage" ? "text-amber-900" :
                    "text-gray-900"
                  }`}>
                    {storeName}
                  </div>
                  <div className="grid grid-cols-3 gap-2 w-full mt-2">
                    {products.slice(0, 3).map((product: any) => (
                      <div key={product.id} className="aspect-square rounded-md overflow-hidden bg-white shadow-sm">
                        <img 
                          src={product.image || "/placeholder.svg"} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {Array(Math.max(0, 3 - products.length)).fill(0).map((_, i) => (
                      <div key={i} className="aspect-square bg-black/5 rounded-md" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-serif">Connected Products</h2>
          <div className="max-h-[500px] overflow-y-auto space-y-4">
            {products.map((product: any) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={product.image || "/placeholder.svg"} 
                    alt={product.name} 
                    className="w-20 h-20 object-cover rounded-lg shadow-sm" 
                  />
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{product.description}</p>
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