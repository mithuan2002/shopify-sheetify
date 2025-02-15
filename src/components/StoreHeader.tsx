
import { FC } from 'react';

interface StoreHeaderProps {
  storeName: string;
  template?: string;
}

const TEMPLATE_STYLES = {
  minimal: "py-8 mb-8 bg-white shadow-sm text-gray-900",
  modern: "py-10 mb-8 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-lg",
  elegant: "py-12 mb-8 bg-gradient-to-b from-slate-50 to-gray-100 border-y border-gray-200 text-gray-900",
  boutique: "py-14 mb-8 bg-gradient-to-br from-pink-100 via-rose-200 to-pink-300 text-rose-900 shadow-inner",
  vintage: "py-12 mb-8 bg-amber-50 border-4 border-double border-amber-800 text-amber-900",
  luxury: "py-16 mb-8 bg-gradient-to-r from-zinc-900 to-black border-b-2 border-yellow-500 text-yellow-50",
  "minimal-dark": "py-10 mb-8 bg-zinc-900 border-b border-zinc-800 text-zinc-100 shadow-xl",
  nature: "py-12 mb-8 bg-gradient-to-r from-emerald-100 to-green-200 border-y-2 border-emerald-600 text-emerald-900",
  tech: "py-10 mb-8 bg-gradient-to-r from-cyan-900 to-blue-900 text-cyan-100 shadow-cyan-900/50 shadow-lg",
  artisan: "py-14 mb-8 bg-stone-100 border-y-4 border-stone-400 text-stone-900"
};

export const StoreHeader: FC<StoreHeaderProps> = ({ 
  storeName, 
  template = 'minimal'
}) => {
  const getHeaderStyles = (template: string) => {
    const baseStyles = "text-4xl font-bold tracking-tight";
    const shadowStyles = "drop-shadow-md";
    
    const styles = {
      minimal: `${baseStyles} text-gray-900`,
      modern: `${baseStyles} ${shadowStyles} font-sans text-white tracking-wider`,
      elegant: `${baseStyles} font-serif text-gray-800`,
      boutique: `${baseStyles} font-serif text-rose-900 italic`,
      vintage: `${baseStyles} font-serif text-amber-900 tracking-widest`,
      luxury: `${baseStyles} ${shadowStyles} font-serif text-yellow-50`,
      "minimal-dark": `${baseStyles} ${shadowStyles} text-zinc-100`,
      nature: `${baseStyles} font-sans text-emerald-900`,
      tech: `${baseStyles} ${shadowStyles} font-mono text-cyan-100`,
      artisan: `${baseStyles} font-serif text-stone-900`
    };

    return styles[template as keyof typeof styles] || styles.minimal;
  };

  return (
    <header className={`w-full px-6 ${TEMPLATE_STYLES[template as keyof typeof TEMPLATE_STYLES] || TEMPLATE_STYLES.minimal}`}>
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
