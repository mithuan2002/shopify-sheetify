
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
};

export const ProductCard = ({ id, name, price, description, imageUrl }: ProductCardProps) => {
  const { addToCart } = useCart();

  return (
    <Card className="w-full">
      <CardHeader>
        {imageUrl && (
          <img src={imageUrl} alt={name} className="w-full h-48 object-cover rounded-t-lg" />
        )}
        <CardTitle>{name}</CardTitle>
        <CardDescription>${price.toFixed(2)}</CardDescription>
      </CardHeader>
      <CardContent>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => addToCart({ id, name, price })}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};
