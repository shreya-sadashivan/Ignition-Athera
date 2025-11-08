import { cn } from "@/lib/utils";

interface SensorGaugeProps {
  value: number;
  max: number;
  min?: number;
  label: string;
  unit: string;
  color?: string;
}

export function SensorGauge({
  value,
  max,
  min = 0,
  label,
  unit,
  color = "bg-primary",
}: SensorGaugeProps) {
  const range = max - min;
  const percentage = ((value - min) / range) * 100;
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  // Calculate rotation for the needle (0-270 degrees for visual appeal)
  const rotation = (clampedPercentage / 100) * 270 - 135;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-48 h-48">
        {/* Outer circle background */}
        <svg
          className="w-full h-full"
          viewBox="0 0 200 200"
          style={{ transform: "rotate(-135deg)" }}
        >
          {/* Background arc */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="8"
          />
          {/* Value arc */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke={`hsl(var(--${color.replace("bg-", "")}))`}
            strokeWidth="8"
            strokeDasharray={`${(clampedPercentage / 100) * 565} 565`}
            style={{ transition: "stroke-dasharray 0.5s ease-out" }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-foreground">
            {value.toFixed(1)}
          </div>
          <div className="text-xs text-muted-foreground">{unit}</div>
        </div>
      </div>

      <div className="text-center w-full">
        <h3 className="text-sm font-semibold text-foreground">{label}</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Range: {min.toFixed(0)} - {max.toFixed(0)}
        </p>
      </div>
    </div>
  );
}
