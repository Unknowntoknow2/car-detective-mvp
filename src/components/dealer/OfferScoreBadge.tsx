
import React from "react";
import { Badge } from "@/components/ui/badge";

interface OfferScoreBadgeProps {
  score: number;
}

export function OfferScoreBadge({ score }: OfferScoreBadgeProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "default";
    if (score >= 70) return "secondary";
    return "destructive";
  };

  return (
    <Badge variant={getScoreColor(score)}>
      Score: {score}%
    </Badge>
  );
}
