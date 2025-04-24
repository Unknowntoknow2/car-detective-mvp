
import React, { useEffect, useRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface YearScrollerProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  startYear?: number;
  endYear?: number;
  disabled?: boolean;
}

export function YearScroller({
  selectedYear,
  onYearChange,
  startYear = 1980,
  endYear = new Date().getFullYear() + 1,
  disabled = false
}: YearScrollerProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => endYear - i
  );

  useEffect(() => {
    const index = years.findIndex((y) => y === selectedYear);
    const node = listRef.current?.children[index] as HTMLElement;
    if (node) {
      node.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [selectedYear, years]);

  return (
    <ScrollArea className="h-48 w-32 rounded-md border">
      <ul ref={listRef} className="p-1">
        {years.map((year) => (
          <li key={year} className="mb-1 last:mb-0">
            <Button
              variant={year === selectedYear ? "default" : "ghost"}
              className="w-full justify-center"
              onClick={() => onYearChange(year)}
              disabled={disabled}
            >
              {year}
            </Button>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}
