import { Product } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/cart", {
        productId: product.id,
        quantity: 1,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      });
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/favorites/toggle", {
        productId: product.id,
      });
    },
    onSuccess: () => {
      setIsFavorite(!isFavorite);
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
    },
  });

  return (
    <Card className="overflow-hidden">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full aspect-square object-cover"
      />
      <CardContent className="p-4">
        <h3 className="font-semibold truncate">{product.name}</h3>
        <p className="text-sm text-muted-foreground truncate">
          {product.description}
        </p>
        <p className="font-bold mt-2">${product.price}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          className="flex-1"
          onClick={() => addToCartMutation.mutate()}
          disabled={addToCartMutation.isPending}
        >
          Add to Cart
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => toggleFavoriteMutation.mutate()}
          disabled={toggleFavoriteMutation.isPending}
        >
          <Heart
            className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
          />
        </Button>
      </CardFooter>
    </Card>
  );
}
