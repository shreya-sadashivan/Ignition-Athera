import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SensorStatCardProps {
  label: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "stable";
  trendValue?: number;
  className?: string;
}

export function SensorStatCard({
  label,
  value,
  unit,
  icon: Icon,
  trend,
  trendValue,
  className,
}: SensorStatCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-orange-500";
      case "down":
        return "text-green-500";
      case "stable":
        return "text-primary";
      default:
        return "text-muted-foreground";
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return "↑";
      case "down":
        return "↓";
      case "stable":
        return "→";
      default:
        return "";
    }
  };

  return (
    <div
      className={cn(
        "p-3 sm:p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-300 group",
        className
      )}
    >
      <div className="flex items-start justify-between mb-2 sm:mb-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-muted-foreground mb-1">{label}</p>
          <div className="flex items-baseline gap-1 sm:gap-2">
            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground truncate">
              {value.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground whitespace-nowrap">{unit}</span>
          </div>
        </div>
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors ml-2">
          <Icon className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
        </div>
      </div>

      {trend && trendValue !== undefined && (
        <div className={cn("text-xs font-medium", getTrendColor())}>
          {getTrendIcon()} {Math.abs(trendValue).toFixed(1)} {unit}
        </div>
      )}
    </div>
  );
}
