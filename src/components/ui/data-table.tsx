
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

interface DataTableProps<TData> {
  columns: Array<{
    accessorKey?: string;
    header: string;
    id?: string;
    cell?: (props: { row: { original: TData; getValue: (key: string) => any } }) => React.ReactNode;
  }>;
  data: TData[];
}

export function DataTable<TData>({ columns, data }: DataTableProps<TData>) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.id || column.accessorKey || column.header}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column) => (
                <TableCell key={column.id || column.accessorKey || column.header}>
                  {column.cell
                    ? column.cell({ 
                        row: { 
                          original: row, 
                          getValue: (key: string) => {
                            if (column.accessorKey) {
                              return row[column.accessorKey as keyof TData];
                            }
                            return null;
                          }
                        } 
                      })
                    : column.accessorKey
                    ? (row[column.accessorKey as keyof TData] as React.ReactNode)
                    : null}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
