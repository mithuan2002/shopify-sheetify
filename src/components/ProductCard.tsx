
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
}

export const ProductCard = ({ id, name, price, description, image, onEdit, onDelete, isOwner = false }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <Card
        className="relative overflow-hidden transition-all duration-300 transform hover:shadow-xl"
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
          <h3 className="font-serif text-xl mb-2">{name}</h3>
          <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{description}</p>
          <p className="font-semibold">${price.toFixed(2)}</p>
          
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
