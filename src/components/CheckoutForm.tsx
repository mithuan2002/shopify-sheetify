
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export const CheckoutForm = ({ onClose }: { onClose: () => void }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const { items, total } = useCart();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const orderDetails = items.map(item => 
      `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const message = `New Order!\n\nCustomer: ${name}\nPhone: ${phone}\n\nOrder Details:\n${orderDetails}\n\nTotal: $${total.toFixed(2)}`;
    
    const whatsappUrl = `https://wa.me/+919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      <div className="pt-4">
        <Button type="submit" className="w-full">
          Place Order via WhatsApp
        </Button>
      </div>
    </form>
  );
};
