
import { FC } from 'react';
import { motion } from 'framer-motion';

interface StoreHeaderProps {
  storeName: string;
  template?: string;
}

const TEMPLATE_STYLES = {
  minimal: "py-8 mb-8 bg-gradient-to-b from-white to-gray-50 shadow-sm text-gray-900 relative overflow-hidden",
  modern: "py-10 mb-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg relative overflow-hidden",
  elegant: "py-12 mb-8 bg-gradient-to-b from-slate-50 to-gray-100 border-y border-gray-200 text-gray-900 relative overflow-hidden",
  boutique: "py-14 mb-8 bg-gradient-to-br from-pink-100 via-rose-200 to-pink-300 text-rose-900 shadow-inner relative overflow-hidden",
  vintage: "py-12 mb-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100 via-amber-50 to-amber-100 border-4 border-double border-amber-800 text-amber-900 relative overflow-hidden",
  luxury: "py-16 mb-8 bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-800 to-black border-b-2 border-yellow-500 text-yellow-50 relative overflow-hidden",
  "minimal-dark": "py-10 mb-8 bg-[linear-gradient(to_right,_var(--tw-gradient-stops))] from-zinc-900 via-gray-900 to-zinc-900 border-b border-zinc-800 text-zinc-100 shadow-xl relative overflow-hidden",
  nature: "py-12 mb-8 bg-gradient-to-r from-emerald-200 via-green-200 to-emerald-200 border-y-2 border-emerald-600 text-emerald-900 relative overflow-hidden",
  tech: "py-10 mb-8 bg-[linear-gradient(to_right,_var(--tw-gradient-stops))] from-cyan-900 via-blue-900 to-cyan-900 text-cyan-100 shadow-cyan-900/50 shadow-lg relative overflow-hidden",
  artisan: "py-14 mb-8 bg-gradient-to-br from-stone-200 via-stone-100 to-stone-50 border-y-4 border-stone-400 text-stone-900 relative overflow-hidden"
};

const decorativeElements = {
  modern: (
    <>
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:500px_500px] animate-modern-gradient"></div>
      <div className="absolute -top-12 -left-12 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-purple-400/20 rounded-full blur-xl"></div>
    </>
  ),
  luxury: (
    <>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDIxNyw4NywwLjEpIi8+PC9zdmc+')] opacity-20"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
    </>
  ),
  tech: (
    <>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0zMCAzMEw2MCA2MEgweiIgZmlsbD0icmdiYSgxMDMsMjMyLDI0OSwwLjEpIi8+PC9zdmc+')] animate-pulse"></div>
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
    </>
  )
};

export const StoreHeader: FC<StoreHeaderProps> = ({ 
  storeName, 
  template = 'minimal'
}) => {
  const getHeaderStyles = (template: string) => {
    const baseStyles = "text-4xl font-bold tracking-tight";
    const shadowStyles = "drop-shadow-md";
    
    const styles = {
      minimal: `${baseStyles} text-gray-900 hover:scale-102 transition-transform`,
      modern: `${baseStyles} ${shadowStyles} font-sans text-white tracking-wider [text-shadow:0_0_30px_rgba(255,255,255,0.5)]`,
      elegant: `${baseStyles} font-serif text-gray-800 hover:tracking-wider transition-all duration-300`,
      boutique: `${baseStyles} font-serif text-rose-900 italic hover:scale-105 transition-transform`,
      vintage: `${baseStyles} font-serif text-amber-900 tracking-widest [text-shadow:2px_2px_0_rgba(217,119,6,0.2)]`,
      luxury: `${baseStyles} ${shadowStyles} font-serif text-yellow-50 [text-shadow:0_0_20px_rgba(234,179,8,0.5)]`,
      "minimal-dark": `${baseStyles} ${shadowStyles} text-zinc-100 hover:tracking-wider transition-all`,
      nature: `${baseStyles} font-sans text-emerald-900 [text-shadow:0_2px_4px_rgba(6,78,59,0.2)]`,
      tech: `${baseStyles} ${shadowStyles} font-mono text-cyan-100 hover:text-cyan-300 transition-colors`,
      artisan: `${baseStyles} font-serif text-stone-900 hover:tracking-wide transition-all`
    };

    return styles[template as keyof typeof styles] || styles.minimal;
  };

  return (
    <header className={`w-full px-6 ${TEMPLATE_STYLES[template as keyof typeof TEMPLATE_STYLES] || TEMPLATE_STYLES.minimal}`}>
      {decorativeElements[template as keyof typeof decorativeElements]}
      <motion.div 
        className="container max-w-6xl mx-auto px-4 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <motion.h1 
            className={getHeaderStyles(template)}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {storeName}
          </motion.h1>
        </div>
      </motion.div>
    </header>
  );
};
