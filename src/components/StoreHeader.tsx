
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

  const getHeaderClasses = (currentTemplate: string) => {
    switch (currentTemplate) {
      case "minimal":
        return "py-8 mb-8 bg-white";
      case "elegant":
        return "py-12 mb-8 bg-slate-50 border-b border-slate-200";
      case "modern":
        return "py-8 mb-8 bg-gradient-to-r from-purple-50 to-pink-50";
      case "boutique":
        return "py-16 mb-8 bg-gradient-to-r from-rose-100 to-teal-100";
      case "vintage":
        return "py-12 mb-8 bg-amber-50 border-y-2 border-amber-900";
      case "luxury":
        return "py-12 mb-8 bg-gradient-to-r from-gray-900 to-gray-800 text-white";
      case "minimal-dark":
        return "py-8 mb-8 bg-gray-900 text-white";
      case "artisan":
        return "py-12 mb-8 bg-stone-100 border-y border-stone-300";
      default:
        return "py-8 mb-8";
    }
  };

  const getStoreNameClasses = (currentTemplate: string) => {
    switch (currentTemplate) {
      case "minimal":
        return "text-4xl md:text-5xl font-light tracking-tight";
      case "elegant":
        return "text-4xl md:text-5xl font-serif italic";
      case "modern":
        return "text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text";
      case "boutique":
        return "text-4xl md:text-5xl font-serif text-rose-800";
      case "vintage":
        return "text-4xl md:text-5xl font-serif text-amber-900 uppercase tracking-widest";
      case "luxury":
        return "text-4xl md:text-5xl font-light tracking-widest uppercase text-white";
      case "minimal-dark":
        return "text-4xl md:text-5xl font-light tracking-tight text-white";
      case "artisan":
        return "text-4xl md:text-5xl font-serif text-stone-800";
      default:
        return "text-4xl md:text-5xl";
    }
  };

  return (
    <header className={getHeaderClasses(template)}>
      <div className="container max-w-6xl mx-auto px-4">
        <h1 className={`mb-4 text-center ${getStoreNameClasses(template)}`}>{storeName}</h1>
        
        {isOwner && (
          <div className="flex flex-wrap justify-center gap-2 mt-6">
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
            <Button
              variant="outline"
              onClick={() => handleTemplateChange("boutique")}
              className={template === "boutique" ? "border-primary" : ""}
            >
              Boutique
            </Button>
            <Button
              variant="outline"
              onClick={() => handleTemplateChange("vintage")}
              className={template === "vintage" ? "border-primary" : ""}
            >
              Vintage
            </Button>
            <Button
              variant="outline"
              onClick={() => handleTemplateChange("luxury")}
              className={template === "luxury" ? "border-primary" : ""}
            >
              Luxury
            </Button>
            <Button
              variant="outline"
              onClick={() => handleTemplateChange("minimal-dark")}
              className={template === "minimal-dark" ? "border-primary" : ""}
            >
              Minimal Dark
            </Button>
            <Button
              variant="outline"
              onClick={() => handleTemplateChange("artisan")}
              className={template === "artisan" ? "border-primary" : ""}
            >
              Artisan
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
