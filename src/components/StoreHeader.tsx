
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
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="modern-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 20h40M20 0v40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
              <circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.2)"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#modern-grid)" className="animate-pulse"/>
        </svg>
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 animate-gradient-xy"></div>
    </>
  ),
  luxury: (
    <>
      <div className="absolute inset-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="luxury-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 5l25 45H5z" fill="none" stroke="rgba(234,179,8,0.2)" strokeWidth="0.5"/>
              <circle cx="30" cy="30" r="2" fill="rgba(234,179,8,0.3)"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#luxury-pattern)"/>
        </svg>
      </div>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
    </>
  ),
  boutique: (
    <>
      <div className="absolute inset-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="floral-pattern" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M25 10a15 15 0 0 1 0 30a15 15 0 0 1 0-30" fill="none" stroke="rgba(244,63,94,0.1)" strokeWidth="0.5"/>
              <circle cx="25" cy="25" r="3" fill="rgba(244,63,94,0.1)"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#floral-pattern)"/>
        </svg>
      </div>
    </>
  ),
  vintage: (
    <>
      <div className="absolute inset-0">
        <svg className="w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="vintage-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 20h40M20 0v40" stroke="rgba(146,64,14,0.2)" strokeWidth="0.5" strokeDasharray="2,2"/>
              <circle cx="20" cy="20" r="1" fill="rgba(146,64,14,0.3)"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#vintage-pattern)"/>
        </svg>
      </div>
    </>
  ),
  tech: (
    <>
      <div className="absolute inset-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit-pattern" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M10 25h30M25 10v30" stroke="rgba(103,232,249,0.15)" strokeWidth="0.5"/>
              <circle cx="25" cy="25" r="2" fill="rgba(103,232,249,0.2)"/>
              <circle cx="10" cy="25" r="1" fill="rgba(103,232,249,0.2)"/>
              <circle cx="40" cy="25" r="1" fill="rgba(103,232,249,0.2)"/>
              <circle cx="25" cy="10" r="1" fill="rgba(103,232,249,0.2)"/>
              <circle cx="25" cy="40" r="1" fill="rgba(103,232,249,0.2)"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-pattern)" className="animate-pulse"/>
        </svg>
      </div>
    </>
  ),
  nature: (
    <>
      <div className="absolute inset-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="leaf-pattern" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M25 10c15 15 0 30-15 15s15-15 15 15" fill="none" stroke="rgba(6,78,59,0.1)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#leaf-pattern)"/>
        </svg>
      </div>
    </>
  ),
  geometric: (
    <>
      <div className="absolute inset-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="geo-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M20 0l20 20l-20 20l-20-20z" fill="none" stroke="rgba(100,116,139,0.1)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#geo-pattern)"/>
        </svg>
      </div>
    </>
  )
};

export const StoreHeader: FC<StoreHeaderProps> = ({ 
  storeName, 
  template = 'minimal'
}) => {
  const getHeaderStyles = (template: string) => {
    const baseStyles = "text-4xl font-bold tracking-tight relative z-20";
    const textShadow = "[text-shadow:2px_2px_4px_rgba(0,0,0,0.3),0_0_10px_rgba(255,255,255,0.5)]";
    
    const styles = {
      minimal: `${baseStyles} text-gray-900 ${textShadow} hover:scale-102 transition-transform`,
      modern: `${baseStyles} text-white ${textShadow} font-sans tracking-wider`,
      elegant: `${baseStyles} text-gray-900 ${textShadow} font-serif hover:tracking-wider transition-all duration-300`,
      boutique: `${baseStyles} text-rose-900 ${textShadow} font-serif italic hover:scale-105 transition-transform`,
      vintage: `${baseStyles} text-amber-900 ${textShadow} font-serif tracking-widest`,
      luxury: `${baseStyles} text-yellow-50 ${textShadow} font-serif`,
      "minimal-dark": `${baseStyles} text-white ${textShadow} hover:tracking-wider transition-all`,
      nature: `${baseStyles} text-emerald-900 ${textShadow} font-sans`,
      tech: `${baseStyles} text-white ${textShadow} font-mono hover:text-cyan-300 transition-colors`,
      artisan: `${baseStyles} text-stone-900 ${textShadow} font-serif hover:tracking-wide transition-all`
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
