import { FC } from 'react';
import { Button } from "./ui/button";

interface StoreHeaderProps {
  storeName: string;
  template?: string;
  onTemplateChange?: (template: string) => void;
  isOwner?: boolean;
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

export const StoreHeader: FC<StoreHeaderProps> = ({ 
  storeName, 
  template = 'minimal', 
  onTemplateChange, 
  isOwner 
}) => {
  return (
    <header className={`w-full px-6 ${TEMPLATE_STYLES[template] || TEMPLATE_STYLES.minimal}`}>
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center">
          <h1 className={`text-4xl font-bold mb-4 ${
            template?.includes('dark') ? 'text-white' : 'text-gray-900'
          }`}>
            {storeName}
          </h1>
        </div>

        {isOwner && (
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {TEMPLATE_OPTIONS.map((templateOption) => (
              <Button
                key={templateOption}
                variant={template === templateOption ? "default" : "outline"}
                onClick={() => onTemplateChange?.(templateOption)}
                className="capitalize"
              >
                {templateOption.replace('-', ' ')}
              </Button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};