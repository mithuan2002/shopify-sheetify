
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface StoreHeaderProps {
  storeName: string;
  template: string;
  onTemplateChange: (template: string) => void;
  isOwner?: boolean;
}

export const StoreHeader = ({ storeName, template, onTemplateChange, isOwner = false }: StoreHeaderProps) => {
  const { toast } = useToast();

  const handleTemplateChange = (newTemplate: string) => {
    onTemplateChange(newTemplate);
    toast({
      title: "Template Updated",
      description: "Your store's appearance has been updated.",
    });
  };

  return (
    <header className="w-full py-8 mb-8">
      <div className="container max-w-6xl mx-auto px-4">
        <h1 className="font-serif text-4xl md:text-5xl mb-4 text-center">{storeName}</h1>
        
        {isOwner && (
          <div className="flex justify-center gap-4 mt-6">
            <Button
              variant="outline"
              onClick={() => handleTemplateChange("minimal")}
              className={template === "minimal" ? "border-primary" : ""}
            >
              Minimal
            </Button>
            <Button
              variant="outline"
              onClick={() => handleTemplateChange("elegant")}
              className={template === "elegant" ? "border-primary" : ""}
            >
              Elegant
            </Button>
            <Button
              variant="outline"
              onClick={() => handleTemplateChange("modern")}
              className={template === "modern" ? "border-primary" : ""}
            >
              Modern
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
