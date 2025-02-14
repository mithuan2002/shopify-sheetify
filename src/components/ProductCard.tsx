
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  onEdit?: () => void;
  onDelete?: () => void;
  isOwner?: boolean;
  template?: string;
}

import { useCart } from "@/context/CartContext";

export const ProductCard = ({ 
  id, 
  name, 
  price, 
  description, 
  image, 
  onEdit, 
  onDelete, 
  isOwner = false,
  template = "minimal" 
}: ProductCardProps) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const getCardClasses = () => {
    const baseClasses = "relative overflow-hidden transition-all duration-300 transform";
    
    switch (template) {
      case "minimal":
        return `${baseClasses} hover:shadow-lg`;
      case "elegant":
        return `${baseClasses} hover:shadow-xl border-slate-200`;
      case "modern":
        return `${baseClasses} hover:shadow-xl rounded-2xl`;
      case "boutique":
        return `${baseClasses} hover:shadow-xl border-rose-100 rounded-lg`;
      case "vintage":
        return `${baseClasses} hover:shadow-xl border-2 border-amber-900`;
      case "luxury":
        return `${baseClasses} hover:shadow-2xl bg-gray-900 text-white`;
      case "minimal-dark":
        return `${baseClasses} hover:shadow-xl bg-gray-800 text-white`;
      case "artisan":
        return `${baseClasses} hover:shadow-xl border border-stone-300 bg-stone-50`;
      default:
        return baseClasses;
    }
  };

  const getNameClasses = () => {
    switch (template) {
      case "minimal":
        return "text-xl font-medium";
      case "elegant":
        return "font-serif text-xl italic";
      case "modern":
        return "text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text";
      case "boutique":
        return "font-serif text-xl text-rose-800";
      case "vintage":
        return "font-serif text-xl uppercase tracking-wider text-amber-900";
      case "luxury":
        return "text-xl font-light tracking-wide uppercase";
      case "minimal-dark":
        return "text-xl font-medium text-white";
      case "artisan":
        return "font-serif text-xl text-stone-800";
      default:
        return "text-xl";
    }
  };

  const getPriceClasses = () => {
    switch (template) {
      case "minimal":
        return "font-semibold";
      case "elegant":
        return "font-serif italic";
      case "modern":
        return "font-bold text-purple-600";
      case "boutique":
        return "font-serif text-rose-700";
      case "vintage":
        return "font-serif text-amber-800";
      case "luxury":
        return "font-light tracking-wider text-gray-300";
      case "minimal-dark":
        return "font-semibold text-gray-300";
      case "artisan":
        return "font-serif text-stone-700";
      default:
        return "font-semibold";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        className={getCardClasses()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="aspect-square overflow-hidden">
          <img
            src={image || "/placeholder.svg"}
            alt={name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className={getNameClasses()}>{name}</h3>
          <p className={`text-muted-foreground text-sm mb-2 line-clamp-2 ${template === "luxury" || template === "minimal-dark" ? "text-gray-400" : ""}`}>
            {description}
          </p>
          <p className={getPriceClasses()}>${price.toFixed(2)}</p>
      {!isOwner && (
        <Button 
          onClick={() => addToCart({ id, name, price })}
          className="w-full mt-2"
        >
          Add to Cart
        </Button>
      )}
          
          {isOwner && (
            <div className={`absolute right-2 top-2 flex gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <Button
                variant="secondary"
                size="sm"
                onClick={onEdit}
                className="backdrop-blur-sm bg-white/30"
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={onDelete}
                className="backdrop-blur-sm bg-white/30"
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
