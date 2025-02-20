import { Home, Search, Heart, ShoppingCart, User } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function BottomNav() {
  const [, setLocation] = useLocation();
  const { logoutMutation } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t py-2 px-6">
      <div className="flex justify-between items-center max-w-lg mx-auto">
        <button
          onClick={() => setLocation("/")}
          className="flex flex-col items-center gap-1"
        >
          <Home className="h-6 w-6" />
          <span className="text-xs">Home</span>
        </button>

        <button
          onClick={() => setLocation("/search")}
          className="flex flex-col items-center gap-1"
        >
          <Search className="h-6 w-6" />
          <span className="text-xs">Search</span>
        </button>

        <button
          onClick={() => setLocation("/favorites")}
          className="flex flex-col items-center gap-1"
        >
          <Heart className="h-6 w-6" />
          <span className="text-xs">Favorites</span>
        </button>

        <button
          onClick={() => setLocation("/cart")}
          className="flex flex-col items-center gap-1"
        >
          <ShoppingCart className="h-6 w-6" />
          <span className="text-xs">Cart</span>
        </button>

        <button
          onClick={() => logoutMutation.mutate()}
          className="flex flex-col items-center gap-1"
        >
          <User className="h-6 w-6" />
          <span className="text-xs">Profile</span>
        </button>
      </div>
    </nav>
  );
}
