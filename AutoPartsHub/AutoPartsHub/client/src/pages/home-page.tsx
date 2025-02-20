import { useQuery } from "@tanstack/react-query";
import { Product, Category } from "@shared/schema";
import ProductCard from "@/components/product-card";
import BottomNav from "@/components/bottom-nav";
import CartDialog from "@/components/cart-dialog";
import VehicleSelector from "@/components/vehicle-selector";
import { useState } from "react";

interface Filters {
  make: string;
  model: string;
  year: string;
  engine: string;
  transmission: string;
}

export default function HomePage() {
  const [vehicleSelected, setVehicleSelected] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [filters, setFilters] = useState<Filters>({
    make: "",
    model: "",
    year: "",
    engine: "",
    transmission: "",
  });

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleVehicleComplete = () => {
    setVehicleSelected(true);
  };

  const filteredProducts = products?.filter((product) => {
    // Make filter
    if (filters.make && product.make.toLowerCase() !== filters.make) {
      return false;
    }

    // Model filter
    if (filters.model && product.model.toLowerCase() !== filters.model) {
      return false;
    }

    // Year filter
    if (filters.year && product.year !== filters.year) {
      return false;
    }

    // Engine filter
    if (filters.engine && product.engine.toLowerCase() !== filters.engine) {
      return false;
    }

    // Transmission filter
    if (filters.transmission && product.transmission.toLowerCase() !== filters.transmission) {
      return false;
    }

    return true;
  });

  if (productsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!vehicleSelected) {
    return (
      <div className="min-h-screen pb-16">
        <VehicleSelector
          filters={filters}
          onFilterChange={handleFilterChange}
          onComplete={handleVehicleComplete}
        />
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Vehicle Summary */}
      <div className="bg-muted/50 p-4 border-b">
        <div className="max-w-lg mx-auto">
          <h2 className="font-semibold mb-1">Selected Vehicle</h2>
          <p className="text-sm text-muted-foreground">
            {filters.year} {filters.make} {filters.model} - {filters.engine}, {filters.transmission}
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-5xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Select a Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories?.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className="group relative overflow-hidden rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <div className="aspect-[4/3] relative">
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                  <h3 className="font-bold text-white text-lg mb-1">{category.name}</h3>
                  <p className="text-white/90 text-sm">
                    {category.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Products Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-background z-50 overflow-auto">
          <div className="max-w-5xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {categories?.find((c) => c.id === selectedCategory)?.name}
              </h2>
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts
                ?.filter((p) => p.categoryId === selectedCategory)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </div>
        </div>
      )}

      <CartDialog />
      <BottomNav />
    </div>
  );
}