
import React from "react";
import { cn } from "@/lib/utils";
import { BodyS, Caption } from "./typography";

export type TableData = {
  id: string | number;
  [key: string]: any;
};

export type TableColumn<T extends TableData> = {
  header: React.ReactNode;
  accessor: keyof T | ((data: T) => React.ReactNode);
  cell?: (data: T) => React.ReactNode;
  className?: string;
};

export type TableProps<T extends TableData> = {
  data: T[];
  columns: TableColumn<T>[];
  className?: string;
  tableClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  rowClassName?: (row: T, index: number) => string;
  onRowClick?: (row: T) => void;
  emptyState?: React.ReactNode;
  isLoading?: boolean;
  loadingRows?: number;
  caption?: string;
  stickyHeader?: boolean;
  striped?: boolean;
  compact?: boolean;
  bordered?: boolean;
};

export function CDTable<T extends TableData>({
  data,
  columns,
  className,
  tableClassName,
  headerClassName,
  bodyClassName,
  rowClassName,
  onRowClick,
  emptyState,
  isLoading = false,
  loadingRows = 3,
  caption,
  stickyHeader = false,
  striped = false,
  compact = false,
  bordered = false,
}: TableProps<T>) {
  // Generate skeleton rows when loading
  const loadingData = Array.from({ length: loadingRows }).map((_, index) => ({
    id: `loading-${index}`,
  })) as T[];

  // Use loading skeleton data if loading
  const tableData = isLoading ? loadingData : data;

  // Check if table is empty (and not loading)
  const isEmpty = !isLoading && tableData.length === 0;

  return (
    <div
      className={cn(
        "w-full overflow-auto relative",
        "bg-white rounded-lg",
        bordered && "border border-neutral-light",
        className
      )}
    >
      <table
        className={cn(
          "w-full border-collapse",
          compact ? "text-sm" : "text-base",
          tableClassName
        )}
      >
        {caption && (
          <caption className="p-2 text-sm text-neutral-dark text-left">
            {caption}
          </caption>
        )}
        <thead
          className={cn(
            "bg-neutral-lighter text-neutral-darker font-medium",
            "border-b border-neutral-light",
            stickyHeader && "sticky top-0 z-10",
            headerClassName
          )}
        >
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={cn(
                  "text-left",
                  compact ? "px-3 py-2" : "px-4 py-3",
                  "whitespace-nowrap",
                  column.className
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={cn("divide-y divide-neutral-light", bodyClassName)}>
          {isEmpty && emptyState ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-8">
                {emptyState}
              </td>
            </tr>
          ) : (
            tableData.map((row, rowIndex) => (
              <tr
                key={row.id}
                className={cn(
                  "transition-colors",
                  striped && rowIndex % 2 === 1 && "bg-neutral-lighter/50",
                  onRowClick && "cursor-pointer hover:bg-neutral-lighter",
                  rowClassName && rowClassName(row, rowIndex)
                )}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={cn(
                      compact ? "px-3 py-2" : "px-4 py-3",
                      "align-middle",
                      isLoading && "animate-pulse",
                      column.className
                    )}
                  >
                    {isLoading ? (
                      <div className="h-4 bg-neutral-light rounded w-3/4" />
                    ) : column.cell ? (
                      column.cell(row)
                    ) : typeof column.accessor === "function" ? (
                      column.accessor(row)
                    ) : (
                      row[column.accessor]
                    )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CDTable;
