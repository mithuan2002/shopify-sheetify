
import { Button } from "./ui/button";
import { useCart } from "@/context/CartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Input } from "./ui/input";

export const Cart = () => {
  const { items, total, removeFromCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const handlePlaceOrder = () => {
    if (!customerName || !customerPhone) {
      alert("Please fill in your name and phone number");
      return;
    }

    const shopkeeperNumber = localStorage.getItem('shopkeeperWhatsapp') || '';
    if (!shopkeeperNumber) {
      alert("Store owner's WhatsApp number not found");
      return;
    }

    const orderDetails = items.map(item => 
      `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const message = `New Order!\n\nCustomer: ${customerName}\nPhone: ${customerPhone}\n\nOrder Details:\n${orderDetails}\n\nTotal: $${total.toFixed(2)}`;
    
    const whatsappUrl = `https://wa.me/${shopkeeperNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    setIsOpen(false);
  };

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
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
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
              <div className="space-y-4">
                <Input
                  placeholder="Your Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
                <Input
                  placeholder="Your Phone Number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
                <Button
                  className="w-full"
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground mt-8">
              Your cart is empty
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
