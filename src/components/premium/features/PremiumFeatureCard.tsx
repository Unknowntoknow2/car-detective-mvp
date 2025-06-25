
import { useState } from "react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface PremiumFeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  value: string;
  color: string;
  benefits: string[];
  onSelect: () => void;
  isSelected?: boolean;
}

export function PremiumFeatureCard({
  icon: Icon,
  title,
  description,
  value,
  color,
  benefits,
  onSelect,
  isSelected,
}: PremiumFeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const colorVariants: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    orange: "bg-orange-50 text-orange-500 border-orange-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    cyan: "bg-cyan-50 text-cyan-600 border-cyan-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
  };

  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <Card
          className={cn(
            "relative overflow-hidden transition-all duration-300 cursor-pointer",
            "border-2",
            isSelected
              ? "border-primary ring-2 ring-primary/20"
              : "border-border hover:border-primary/30",
            isHovered ? "transform -translate-y-1 shadow-lg" : "shadow-md",
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={onSelect}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {/* Feature Icon */}
              <div className={cn("p-3 rounded-lg border", colorVariants[color])}>
                <Icon className="h-6 w-6" />
              </div>
              
              <div className="space-y-2 flex-1">
                {/* Feature Header */}
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-lg">{title}</h3>
                  <span className={cn("text-sm font-medium px-2 py-1 rounded", colorVariants[color])}>
                    {value}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{description}</p>
              </div>
            </div>

            <div
              className={cn(
                "mt-4 pt-4 border-t transition-all duration-300",
                isHovered ? "opacity-100" : "opacity-0",
              )}
            >
              <Button
                variant="ghost"
                className="w-full justify-between hover:bg-primary/5"
              >
                Learn More <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </HoverCardTrigger>

      {/* Feature Benefits List */}
      <HoverCardContent className="w-80">
        <div className="space-y-3">
          <h4 className="font-semibold">{title} Benefits</h4>
          <ul className="space-y-2">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
