
import React from 'react';
import { X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

interface SearchAndFilterBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  sortOption: string;
  onSortOptionChange: (value: string) => void;
  totalVehicles: number;
  filteredCount: number;
  onClearFilters: () => void;
}

export const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortOption,
  onSortOptionChange,
  totalVehicles,
  filteredCount,
  onClearFilters,
}) => {
  const filtersActive = searchTerm !== '' || statusFilter !== 'all';
  
  return (
    <div className="space-y-2">
      <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between">
        <div className="flex-1 flex flex-col sm:flex-row gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Input
              placeholder="Search make, model, or year..."
              value={searchTerm}
              onChange={onSearchChange}
              className="w-full pl-3 pr-9"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange({ target: { value: '' } } as any)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {/* Mobile Filter Button */}
          <div className="block sm:hidden">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full flex justify-between">
                  <span className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </span>
                  {filtersActive && (
                    <Badge variant="secondary" className="ml-2">
                      Active
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Status</h4>
                    <Select
                      value={statusFilter}
                      onValueChange={onStatusFilterChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Sort By</h4>
                    <Select
                      value={sortOption}
                      onValueChange={onSortOptionChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="year-new">Year: Newest First</SelectItem>
                        <SelectItem value="year-old">Year: Oldest First</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {filtersActive && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={onClearFilters}
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {/* Desktop Filters */}
        <div className="hidden sm:flex items-center gap-2">
          <Select
            value={statusFilter}
            onValueChange={onStatusFilterChange}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={sortOption}
            onValueChange={onSortOptionChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="year-new">Year: Newest First</SelectItem>
              <SelectItem value="year-old">Year: Oldest First</SelectItem>
            </SelectContent>
          </Select>
          
          {filtersActive && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-sm flex items-center gap-1"
            >
              <X className="h-3 w-3" /> Clear
            </Button>
          )}
        </div>
      </div>
      
      {/* Results count */}
      <div className="flex items-center text-sm text-muted-foreground">
        {filteredCount === totalVehicles ? (
          <span>Showing all {totalVehicles} vehicles</span>
        ) : (
          <span>Showing {filteredCount} of {totalVehicles} vehicles</span>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilterBar;
