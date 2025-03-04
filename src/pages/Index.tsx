
import { StoreSetupView } from "@/components/StoreSetupView";
import { StoreView } from "@/components/StoreView";
import { useStoreData } from "@/hooks/useStoreData";
import { useStoreActions } from "@/hooks/useStoreActions";
import { Loader2 } from "lucide-react";

const Index = () => {
  const {
    products,
    template,
    storeName,
    isSetupComplete,
    currentStoreId,
    isLoading,
  } = useStoreData();

  const { handleDeploy, handleSetupComplete } = useStoreActions();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg">Loading store data...</p>
        </div>
      </div>
    );
  }

  if (!isSetupComplete) {
    return <StoreSetupView onComplete={handleSetupComplete} />;
  }

  return (
    <StoreView
      storeName={storeName}
      template={template}
      products={products}
      currentStoreId={currentStoreId!}
      onDeploy={handleDeploy}
    />
  );
};

export default Index;
