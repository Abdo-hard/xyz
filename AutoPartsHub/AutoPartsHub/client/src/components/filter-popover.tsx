import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface FilterPopoverProps {
  filters: {
    make: string;
    model: string;
    year: string;
    engine: string;
    transmission: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

export default function FilterPopover({ filters, onFilterChange }: FilterPopoverProps) {
  // Sample data - in a real app, this would come from the API
  const makes = ["Volkswagen", "Audi", "Porsche", "Bentley", "Lamborghini"];
  const years = Array.from({ length: 25 }, (_, i) => (2024 - i).toString());
  const engines = [
    "2.0L 4-Cylinder",
    "2.5L 5-Cylinder",
    "3.0L V6",
    "3.6L V6",
    "2.0L TDI"
  ];
  const transmissions = [
    "6-Speed Manual",
    "7-Speed DSG",
    "8-Speed Automatic",
    "6-Speed Automatic"
  ];

  // Models depend on the selected make
  const modelsByMake: Record<string, string[]> = {
    volkswagen: ["Golf", "Jetta", "Passat", "Tiguan", "Atlas", "ID.4"],
    audi: ["A3", "A4", "A6", "Q3", "Q5", "Q7"],
    porsche: ["911", "Cayenne", "Macan", "Panamera"],
    bentley: ["Continental GT", "Flying Spur", "Bentayga"],
    lamborghini: ["Urus", "Huracán", "Aventador"],
  };

  const selectedMakeModels = filters.make ? 
    modelsByMake[filters.make.toLowerCase()] || [] : [];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Vehicle Filters</h4>
            <p className="text-sm text-muted-foreground">
              Select your vehicle specifications
            </p>
          </div>
          <div className="grid gap-3">
            <Select
              value={filters.make}
              onValueChange={(value) => {
                onFilterChange("make", value);
                // Reset dependent fields when make changes
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
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}