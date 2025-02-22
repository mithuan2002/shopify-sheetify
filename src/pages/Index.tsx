
import { StoreSetupView } from "@/components/StoreSetupView";
import { StoreView } from "@/components/StoreView";
import { useStoreData } from "@/hooks/useStoreData";
import { useStoreActions } from "@/hooks/useStoreActions";

const Index = () => {
  const {
    products,
    template,
    storeName,
    isSetupComplete,
    currentStoreId,
  } = useStoreData();

  const { handleDeploy, handleSetupComplete } = useStoreActions();

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
