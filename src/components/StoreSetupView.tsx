
import { Button } from "@/components/ui/button";
import { StoreSetupWizard } from "@/components/StoreSetupWizard";

interface StoreSetupViewProps {
  onComplete: (
    sheetUrl: string,
    template: string,
    whatsappNumber: string,
    storeName: string,
    initialProducts: any[]
  ) => void;
}

export const StoreSetupView = ({ onComplete }: StoreSetupViewProps) => {
  const clearStoreData = () => {
    localStorage.clear();
    window.location.href = '/';
  };

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
      <StoreSetupWizard onComplete={onComplete} />
    </div>
  );
};
