
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/context/CartContext";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import StorePage from "./pages/StorePage";

const App = () => {
  return (
    <TooltipProvider>
      <CartProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/:storeId" element={<StorePage />} />
            <Route path="*" element={<Navigate to="/" replace />} /> {/* Redirect unknown routes to home */}
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  );
};

export default App;
