
import { FC } from 'react';
import { motion } from 'framer-motion';

interface StoreHeaderProps {
  storeName: string;
  template?: string;
}

const TEMPLATE_STYLES = {
  minimal: "py-8 mb-8 bg-[radial-gradient(circle_at_1_1,#ffffff,transparent)_0_0/15px_15px] bg-white shadow-sm text-gray-900 relative overflow-hidden backdrop-blur-sm",
  modern: "py-10 mb-8 bg-[conic-gradient(from_90deg_at_50%_-10%,#3b82f6,#4f46e5,#7c3aed)] text-white shadow-lg relative overflow-hidden animate-gradient-xy",
  elegant: "py-12 mb-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0zMCAzMEw2MCA2MEgweiIgZmlsbD0icmdiYSgyNDMsMjQ0LDI0NiwwLjEpIi8+PC9zdmc+')] bg-slate-50 border-y border-gray-200 text-gray-900 relative overflow-hidden",
  boutique: "py-14 mb-8 bg-gradient-to-br from-pink-100 via-rose-200 to-pink-300 text-rose-900 shadow-inner relative overflow-hidden [background-size:20px_20px] [background-image:repeating-linear-gradient(0deg,#fce7f3,transparent_1px),repeating-linear-gradient(90deg,#fce7f3,transparent_1px)]",
  vintage: "py-12 mb-8 bg-amber-50 border-4 border-double border-amber-800 text-amber-900 relative overflow-hidden [background:radial-gradient(#f59e0b_1px,transparent_1px)_0_0/20px_20px]",
  luxury: "py-16 mb-8 bg-black text-yellow-50 relative overflow-hidden [background-image:linear-gradient(45deg,#18181b_25%,transparent_25%),linear-gradient(-45deg,#18181b_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#18181b_75%),linear-gradient(-45deg,transparent_75%,#18181b_75%)] [background-size:20px_20px] [background-position:0_0,0_10px,10px_-10px,-10px_0] border-b-2 border-yellow-500",
  "minimal-dark": "py-10 mb-8 bg-zinc-900 text-zinc-100 shadow-xl relative overflow-hidden [background-image:radial-gradient(#27272a_1px,transparent_1px)] [background-size:40px_40px] [background-position:center]",
  nature: "py-12 mb-8 bg-gradient-to-r from-emerald-200 via-green-200 to-emerald-200 text-emerald-900 relative overflow-hidden [mask-image:url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTUiIGZpbGw9ImJsYWNrIi8+PC9zdmc+')] border-y-2 border-emerald-600",
  tech: "py-10 mb-8 bg-cyan-900 text-cyan-100 shadow-cyan-900/50 shadow-lg relative overflow-hidden [background:linear-gradient(90deg,rgba(103,232,249,0.1)_1px,transparent_1px),linear-gradient(rgba(103,232,249,0.1)_1px,transparent_1px)] [background-size:20px_20px]",
  artisan: "py-14 mb-8 bg-stone-100 text-stone-900 relative overflow-hidden [background-image:repeating-radial-gradient(circle_at_0_0,transparent_0,#e7e5e4_12px),repeating-linear-gradient(#78716c55,#78716c55)] border-y-4 border-stone-400",
  futuristic: "py-12 mb-8 bg-gradient-to-r from-violet-600 to-indigo-600 text-white relative overflow-hidden [background-image:linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] [background-size:30px_30px] animate-gradient-xy",
  geometric: "py-10 mb-8 bg-white text-gray-900 relative overflow-hidden [background-image:repeating-linear-gradient(45deg,#f1f5f9_25%,transparent_25%,transparent_75%,#f1f5f9_75%,#f1f5f9),repeating-linear-gradient(45deg,#f1f5f9_25%,#ffffff_25%,#ffffff_75%,#f1f5f9_75%,#f1f5f9)] [background-position:0_0,10px_10px] [background-size:20px_20px]"
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
