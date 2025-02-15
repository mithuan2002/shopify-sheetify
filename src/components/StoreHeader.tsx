import { FC, useState, useEffect } from 'react'; // Added useEffect
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";

interface StoreHeaderProps {
  storeName: string;
  template?: string;
  onTemplateChange?: (template: string) => void;
  onStoreNameChange?: (name: string) => void;
  isOwner?: boolean;
  products?: { name: string; price: number }[]; // Added products prop
}

const TEMPLATE_STYLES = {
  minimal: "py-8 mb-8 bg-white text-gray-900",
  elegant: "py-12 mb-8 bg-slate-50 border-b border-slate-200 text-gray-900",
  modern: "py-8 mb-8 bg-gradient-to-r from-purple-50 to-pink-50 text-gray-900",
  boutique: "py-16 mb-8 bg-gradient-to-r from-rose-100 to-teal-100 text-gray-900",
  vintage: "py-12 mb-8 bg-amber-50 border-y-2 border-amber-900 text-gray-900",
  luxury: "py-12 mb-8 bg-gradient-to-r from-gray-900 to-gray-800 text-white",
  "minimal-dark": "py-8 mb-8 bg-gray-900 text-white",
  artisan: "py-12 mb-8 bg-stone-100 border-y border-stone-300 text-gray-900"
};

const TEMPLATE_OPTIONS = Object.keys(TEMPLATE_STYLES);

export const StoreHeader: FC<StoreHeaderProps> = ({ storeName, template = 'minimal', onTemplateChange, onStoreNameChange, isOwner, products = [] }) => { // Added default products
  const { toast } = useToast();

  const headerClass = template === "luxury" || template === "minimal-dark" 
    ? "bg-gray-900 text-white" 
    : "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60";

  const handleTemplateChange = (templateOption: string) => {
    if (onTemplateChange) {
      onTemplateChange(templateOption);
      localStorage.setItem('storeTemplate', templateOption);
    }
  };

  return (
    <header className={`w-full py-4 px-6 ${TEMPLATE_STYLES[template] || TEMPLATE_STYLES.minimal}`}>
      <div className="container max-w-6xl mx-auto px-4">
        <div className="relative mb-4 text-center">
          <h1 className={`text-3xl font-bold ${template?.includes('dark') ? 'text-white' : 'text-gray-900'}`}>
            {storeName}
          </h1>
        </div>

        {products.length > 0 && ( // Added conditional rendering for products
          <div>
            <h2>Products:</h2>
            <ul>
              {products.map((product, index) => (
                <li key={index}>{product.name} - ${product.price}</li>
              ))}
            </ul>
          </div>
        )}

        {isOwner && (
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {TEMPLATE_OPTIONS.map((templateOption) => (
              <Button
                key={templateOption}
                variant="outline"
                onClick={() => handleTemplateChange(templateOption)}
                className={template === templateOption ? "border-primary" : ""}
              >
                {templateOption.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};