
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CheckoutForm } from "./CheckoutForm";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";

export const Cart = () => {
  const { items, total, removeFromCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{showCheckout ? "Checkout" : "Your Cart"}</SheetTitle>
        </SheetHeader>
        {!showCheckout ? (
          <div className="mt-8">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ${item.price.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            {items.length > 0 ? (
              <div className="mt-8">
                <div className="flex justify-between font-medium mb-4">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <Button
                  className="w-full"
                  onClick={() => setShowCheckout(true)}
                >
                  Proceed to Checkout
                </Button>
              </div>
            ) : (
              <p className="text-center text-muted-foreground mt-8">
                Your cart is empty
              </p>
            )}
          </div>
        ) : (
          <div className="mt-8">
            <CheckoutForm onClose={() => {
              setShowCheckout(false);
              setIsOpen(false);
            }} />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
