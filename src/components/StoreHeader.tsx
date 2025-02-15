
import { FC } from 'react';

interface StoreHeaderProps {
  storeName: string;
  template?: string;
}

const TEMPLATE_STYLES = {
  minimal: "py-8 mb-8 bg-white border-b border-gray-200 text-gray-900",
  elegant: "py-12 mb-8 bg-gradient-to-r from-slate-100 to-slate-50 border-y border-slate-200 text-gray-900",
  modern: "py-10 mb-8 bg-gradient-to-r from-violet-100 via-purple-100 to-fuchsia-100 shadow-md text-gray-900",
  boutique: "py-16 mb-8 bg-gradient-to-r from-rose-200 via-pink-100 to-rose-100 border-b-2 border-rose-300 text-gray-900",
  vintage: "py-12 mb-8 bg-amber-50 border-y-4 border-double border-amber-800 text-amber-900",
  luxury: "py-14 mb-8 bg-gradient-to-r from-gray-900 via-slate-900 to-gray-800 border-b border-gold-500 text-white",
  "minimal-dark": "py-10 mb-8 bg-zinc-900 border-b border-zinc-700 text-zinc-100",
  artisan: "py-12 mb-8 bg-stone-100 border-y-2 border-stone-400 text-stone-900"
};

export const StoreHeader: FC<StoreHeaderProps> = ({ 
  storeName, 
  template = 'minimal'
}) => {
  const getHeaderStyles = (template: string) => {
    const baseStyles = "text-4xl font-bold tracking-tight";
    const shadowStyles = "drop-shadow-md [text-shadow:_1px_1px_2px_rgb(0_0_0_/_20%)]";
    
    if (template.includes('luxury')) {
      return `${baseStyles} ${shadowStyles} font-serif text-gold-100`;
    }
    if (template.includes('vintage')) {
      return `${baseStyles} font-serif text-amber-900`;
    }
    if (template.includes('dark')) {
      return `${baseStyles} ${shadowStyles} text-zinc-100`;
    }
    return `${baseStyles} ${shadowStyles} text-gray-900`;
  };

  return (
    <header className={`w-full px-6 ${TEMPLATE_STYLES[template] || TEMPLATE_STYLES.minimal}`}>
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center">
          <h1 className={getHeaderStyles(template)}>
            {storeName}
          </h1>
        </div>
      </div>
    </header>
  );
};
