import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface VehicleSelectorProps {
  filters: {
    make: string;
    model: string;
    year: string;
    engine: string;
    transmission: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onComplete: () => void;
}

export default function VehicleSelector({
  filters,
  onFilterChange,
  onComplete,
}: VehicleSelectorProps) {
  // Sample data - in a real app, this would come from the API
  const makes = ["Volkswagen", "Audi", "Porsche", "Bentley", "Lamborghini"];
  const years = Array.from({ length: 25 }, (_, i) => (2024 - i).toString());
  const engines = [
    "2.0L 4-Cylinder",
    "2.5L 5-Cylinder",
    "3.0L V6",
    "3.6L V6",
    "2.0L TDI",
  ];
  const transmissions = [
    "6-Speed Manual",
    "7-Speed DSG",
    "8-Speed Automatic",
    "6-Speed Automatic",
  ];

  const modelsByMake: Record<string, string[]> = {
    volkswagen: ["Golf", "Jetta", "Passat", "Tiguan", "Atlas", "ID.4"],
    audi: ["A3", "A4", "A6", "Q3", "Q5", "Q7"],
    porsche: ["911", "Cayenne", "Macan", "Panamera"],
    bentley: ["Continental GT", "Flying Spur", "Bentayga"],
    lamborghini: ["Urus", "Huracán", "Aventador"],
  };

  const selectedMakeModels = filters.make ? modelsByMake[filters.make.toLowerCase()] || [] : [];

  const isComplete = filters.make && filters.model && filters.year && filters.engine && filters.transmission;

  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <h1 className="text-3xl font-bold mb-2">Select Your Vehicle</h1>
      <p className="text-muted-foreground mb-8">
        To find the right parts for your vehicle, please provide the following information
      </p>

      <div className="grid gap-4 max-w-sm mx-auto">
        <Select
          value={filters.make}
          onValueChange={(value) => {
            onFilterChange("make", value);
            onFilterChange("model", "");
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select make" />
          </SelectTrigger>
          <SelectContent>
            {makes.map((make) => (
              <SelectItem key={make} value={make.toLowerCase()}>
                {make}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.model}
          onValueChange={(value) => onFilterChange("model", value)}
          disabled={!filters.make}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            {selectedMakeModels.map((model) => (
              <SelectItem key={model} value={model.toLowerCase()}>
                {model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.year}
          onValueChange={(value) => onFilterChange("year", value)}
          disabled={!filters.model}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.engine}
          onValueChange={(value) => onFilterChange("engine", value)}
          disabled={!filters.year}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select engine" />
          </SelectTrigger>
          <SelectContent>
            {engines.map((engine) => (
              <SelectItem key={engine} value={engine.toLowerCase()}>
                {engine}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.transmission}
          onValueChange={(value) => onFilterChange("transmission", value)}
          disabled={!filters.engine}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select transmission" />
          </SelectTrigger>
          <SelectContent>
            {transmissions.map((transmission) => (
              <SelectItem key={transmission} value={transmission.toLowerCase()}>
                {transmission}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button 
          onClick={onComplete}
          disabled={!isComplete}
          className="mt-4"
        >
          Continue to Categories <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Active Selections Display */}
      {Object.values(filters).some(Boolean) && (
        <div className="mt-8 space-y-1 text-sm text-muted-foreground">
          {filters.make && <div>Make: {filters.make}</div>}
          {filters.model && <div>Model: {filters.model}</div>}
          {filters.year && <div>Year: {filters.year}</div>}
          {filters.engine && <div>Engine: {filters.engine}</div>}
          {filters.transmission && <div>Transmission: {filters.transmission}</div>}
        </div>
      )}
    </div>
  );
}
