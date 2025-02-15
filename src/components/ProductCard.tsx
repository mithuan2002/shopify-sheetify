
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ui/use-toast";

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
};

export const ProductCard = ({ id, name, price, description, imageUrl }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart({ id, name, price });
    toast({
      title: "Added to cart",
      description: `${name} has been added to your cart`,
      duration: 2000,
    });
  };

  return (
    <Card className="w-full h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative w-full pt-[100%]">
          <img 
            src={imageUrl || "/placeholder.svg"} 
            alt={name}
            className="absolute top-0 left-0 w-full h-full object-cover rounded-t-lg"
          />
        </div>
        <div className="p-4">
          <CardTitle className="text-xl">{name}</CardTitle>
          <CardDescription className="text-lg font-semibold mt-2">
            ${price.toFixed(2)}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {description && (
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        )}
      </CardContent>
      <CardFooter className="pt-4">
        <Button 
          className="w-full bg-primary hover:bg-primary/90" 
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};
