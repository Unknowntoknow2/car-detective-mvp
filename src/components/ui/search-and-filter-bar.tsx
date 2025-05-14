
import React from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface SortOption {
  label: string;
  value: string;
  sortFn?: (a: any, b: any) => number;
}

interface SearchAndFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  sortOptions: SortOption[];
  searchPlaceholder?: string;
  className?: string;
}

export const SearchAndFilterBar = React.forwardRef<HTMLDivElement, SearchAndFilterBarProps>(({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  sortOptions,
  searchPlaceholder = "Search...",
  className,
}, ref) => {
  // Get the active sort function
  const activeSortOption = sortOptions.find(option => option.value === sortBy) || sortOptions[0];

  return (
    <div ref={ref} className={`flex flex-col sm:flex-row gap-4 ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
        {searchTerm && (
          <button 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600" 
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto sm:min-w-[180px] justify-between">
            Sort: {activeSortOption.label}
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={option.value === sortBy ? "bg-accent text-accent-foreground" : ""}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});

SearchAndFilterBar.displayName = 'SearchAndFilterBar';

export default SearchAndFilterBar;
