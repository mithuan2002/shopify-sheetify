
import { StoreSetupView } from "@/components/StoreSetupView";
import { StoreView } from "@/components/StoreView";
import { useStoreData } from "@/hooks/useStoreData";
import { useStoreActions } from "@/hooks/useStoreActions";
import { Loader2, AlertCircle } from "lucide-react";

const Index = () => {
  const {
    products,
    template,
    storeName,
    isSetupComplete,
    currentStoreId,
    isLoading,
    error,
  } = useStoreData();

  const { handleDeploy, handleSetupComplete, isProcessing } = useStoreActions();

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

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 max-w-md text-center p-6 bg-red-50 rounded-lg">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h2 className="text-2xl font-bold text-red-700">Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Return to Home
          </button>
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
      isDeploying={isProcessing}
    />
  );
};

export default Index;
