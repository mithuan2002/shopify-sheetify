import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { fetchProductsFromSheet } from "@/utils/googleSheets";

interface StoreSetupWizardProps {
  onComplete: (sheetUrl: string, template: string, whatsappNumber: string) => void;
}

export const StoreSetupWizard = ({ onComplete }: StoreSetupWizardProps) => {
  const [step, setStep] = useState(1);
  const [sheetUrl, setSheetUrl] = useState("");
  const [template, setTemplate] = useState("minimal");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
      await fetchProductsFromSheet(sheetUrl);
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

  const handleCreateStore = () => {
    onComplete(sheetUrl, template, whatsappNumber);
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
            <div className="grid gap-4">
              <Button
                variant="outline"
                onClick={() => setTemplate("minimal")}
                className={template === "minimal" ? "border-primary" : ""}
              >
                Minimal - Clean and simple design
              </Button>
              <Button
                variant="outline"
                onClick={() => setTemplate("elegant")}
                className={template === "elegant" ? "border-primary" : ""}
              >
                Elegant - Sophisticated serif typography
              </Button>
              <Button
                variant="outline"
                onClick={() => setTemplate("modern")}
                className={template === "modern" ? "border-primary" : ""}
              >
                Modern - Vibrant gradients and bold text
              </Button>
              <Button
                variant="outline"
                onClick={() => setTemplate("boutique")}
                className={template === "boutique" ? "border-primary" : ""}
              >
                Boutique - Soft colors and feminine style
              </Button>
              <Button
                variant="outline"
                onClick={() => setTemplate("vintage")}
                className={template === "vintage" ? "border-primary" : ""}
              >
                Vintage - Classic and timeless appeal
              </Button>
              <Button
                variant="outline"
                onClick={() => setTemplate("luxury")}
                className={template === "luxury" ? "border-primary" : ""}
              >
                Luxury - Dark mode with elegant typography
              </Button>
              <Button
                variant="outline"
                onClick={() => setTemplate("minimal-dark")}
                className={template === "minimal-dark" ? "border-primary" : ""}
              >
                Minimal Dark - Sleek dark mode design
              </Button>
              <Button
                variant="outline"
                onClick={() => setTemplate("artisan")}
                className={template === "artisan" ? "border-primary" : ""}
              >
                Artisan - Handcrafted, organic feel
              </Button>
            </div>
            <Button 
                onClick={nextStep}
                className="w-full"
              >
                Next
              </Button>
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