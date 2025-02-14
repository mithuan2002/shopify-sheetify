
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

interface StoreSetupWizardProps {
  onComplete: (sheetUrl: string, template: string) => void;
}

export const StoreSetupWizard = ({ onComplete }: StoreSetupWizardProps) => {
  const [step, setStep] = useState(1);
  const [sheetUrl, setSheetUrl] = useState("");
  const [template, setTemplate] = useState("minimal");
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
      // Here we'll add the actual Google Sheets API call
      // For now, we'll simulate loading
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStep(2);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to Google Sheet",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateStore = () => {
    onComplete(sheetUrl, template);
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
                Make sure your sheet is publicly accessible and contains product details
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
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-serif mb-4">Choose Your Store Template</h2>
            <div className="grid gap-4">
              <Button
                variant="outline"
                onClick={() => setTemplate("minimal")}
                className={template === "minimal" ? "border-primary" : ""}
              >
                Minimal
              </Button>
              <Button
                variant="outline"
                onClick={() => setTemplate("elegant")}
                className={template === "elegant" ? "border-primary" : ""}
              >
                Elegant
              </Button>
              <Button
                variant="outline"
                onClick={() => setTemplate("modern")}
                className={template === "modern" ? "border-primary" : ""}
              >
                Modern
              </Button>
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
