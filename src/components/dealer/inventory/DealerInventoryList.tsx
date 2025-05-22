
import React, { useState } from 'react';
import { DealerInventoryItem } from '@/types/vehicle';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, Edit, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/utils/formatCurrency';

export interface DealerInventoryListProps {
  inventory: DealerInventoryItem[];
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const DealerInventoryList: React.FC<DealerInventoryListProps> = ({
  inventory,
  isLoading,
  onEdit,
  onDelete
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredInventory = inventory.filter(vehicle => {
    const matchesSearch = 
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.year.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="ml-2 text-muted-foreground">Loading inventory...</p>
        </CardContent>
      </Card>
    );
  }

  if (inventory.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8">
          <p className="text-muted-foreground mb-4">No vehicles in inventory</p>
          <p className="text-sm text-muted-foreground">
            Add your first vehicle to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search inventory..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
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

      {filteredInventory.length === 0 ? (
        <Card>
          <CardContent className="flex justify-center p-8">
            <p className="text-muted-foreground">No matching vehicles found</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Mileage</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">
                      {vehicle.make} {vehicle.model}
                    </TableCell>
                    <TableCell>{vehicle.year}</TableCell>
                    <TableCell>{vehicle.condition}</TableCell>
                    <TableCell>{vehicle.mileage?.toLocaleString() || 'N/A'}</TableCell>
                    <TableCell>{formatCurrency(vehicle.listingPrice)}</TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                        vehicle.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(vehicle.id)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete(vehicle.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DealerInventoryList;
