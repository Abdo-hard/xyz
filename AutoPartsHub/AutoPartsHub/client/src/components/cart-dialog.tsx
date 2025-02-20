import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CartItem, Product } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function CartDialog() {
  const { data: cartItems } = useQuery<CartItem[]>({
    queryKey: ["/api/cart"],
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (itemId: number) => {
      await apiRequest("DELETE", `/api/cart/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  if (!cartItems || !products) return null;

  const cartProducts = cartItems.map(item => ({
    ...item,
    product: products.find(p => p.id === item.productId)!
  }));

  const total = cartProducts.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 text-xs flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>
        <div className="mt-8 space-y-4">
          {cartProducts.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <img
                src={item.product.imageUrl}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.product.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Qty: {item.quantity} × ${item.product.price}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFromCartMutation.mutate(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {cartProducts.length > 0 ? (
            <div className="pt-4 border-t">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Total:</span>
                <span className="font-bold">${total.toFixed(2)}</span>
              </div>
              <Button className="w-full">Checkout</Button>
            </div>
          ) : (
            <p className="text-center text-muted-foreground">Cart is empty</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
