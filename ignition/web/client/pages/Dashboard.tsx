import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SensorStatCard } from "@/components/SensorStatCard";
import { SensorChart } from "@/components/SensorChart";
import {
  Navigation,
  MapPin,
  Zap,
  Clock,
  ChevronLeft,
  Smartphone,
} from "lucide-react";

interface ChartDataPoint {
  time: string;
  value: number;
}

type ActivityType = "riding" | "walking" | "idle";

export default function Dashboard() {
  const [rideActive, setRideActive] = useState(true);
  const [activityType, setActivityType] = useState<ActivityType>("riding");

  // GPS data
  const [latitude, setLatitude] = useState(37.7749);
  const [longitude, setLongitude] = useState(-122.4194);
  const [altitude, setAltitude] = useState(52.5);
  const [speed, setSpeed] = useState(12.5);

  // Chart data
  const [speedChartData, setSpeedChartData] = useState<ChartDataPoint[]>([]);

  // Activity detection logic
  useEffect(() => {
    if (speed < 3) {
      setActivityType("idle");
    } else if (speed < 12) {
      setActivityType("walking");
    } else {
      setActivityType("riding");
    }
  }, [speed]);

  // Simulation function
  useEffect(() => {
    if (!rideActive) return;

    const interval = setInterval(() => {
      // Simulate GPS data
      setLatitude((prev) => prev + (Math.random() - 0.5) * 0.00001);
      setLongitude((prev) => prev + (Math.random() - 0.5) * 0.00001);
      setAltitude((prev) => {
        const noise = (Math.random() - 0.5) * 5;
        return Math.max(0, Math.min(500, prev + noise));
      });

      setSpeed((prev) => {
        const noise = (Math.random() - 0.5) * 1.5;
        return Math.max(0, Math.min(50, prev + noise));
      });

      // Update chart data
      const now = new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setSpeedChartData((prev) => {
        const newData = [
          ...prev.slice(-59),
          { time: now, value: parseFloat(speed.toFixed(2)) },
        ];
        return newData;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [rideActive, speed]);

  const getActivityColor = () => {
    switch (activityType) {
      case "riding":
        return "text-blue-400";
      case "walking":
        return "text-orange-400";
      case "idle":
        return "text-gray-400";
      default:
        return "text-primary";
    }
  };

  const getActivityBgColor = () => {
    switch (activityType) {
      case "riding":
        return "bg-blue-500/20";
      case "walking":
        return "bg-orange-500/20";
      case "idle":
        return "bg-gray-500/20";
      default:
        return "bg-primary/20";
    }
  };

  const getActivityLabel = () => {
    switch (activityType) {
      case "riding":
        return "Riding";
      case "walking":
        return "Walking";
      case "idle":
        return "Idle";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/40 backdrop-blur-md bg-background/80">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:h-16 sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center justify-between sm:flex-row gap-3 sm:gap-4 mb-3 sm:mb-0">
            <div className="flex items-center gap-2">
              <Link to="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-card p-1 h-8 w-8"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Smartphone className="w-4 sm:w-5 h-4 sm:h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-sm sm:text-lg text-foreground whitespace-nowrap">Athera</span>
              </div>
            </div>

            {/* Mobile Status */}
            <div className="flex items-center gap-2 sm:hidden">
              {/* Activity Type Status - Mobile */}
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${getActivityBgColor()} border-primary/30`}>
                <div className={`w-1.5 h-1.5 rounded-full ${getActivityColor().replace('text-', 'bg-')}`} />
                <span className={`font-medium ${getActivityColor()}`}>
                  {getActivityLabel()}
                </span>
              </div>

              {/* Ride Status - Mobile */}
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-card border border-border">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    rideActive ? "bg-green-500 animate-pulse" : "bg-red-500"
                  }`}
                />
                <span className="text-xs text-muted-foreground">
                  {rideActive ? "Live" : "Paused"}
                </span>
              </div>
            </div>
          </div>

          {/* Desktop and Mobile Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
            {/* Routes Link */}
            <Link to="/routes" className="w-full sm:w-auto">
              <Button variant="ghost" size="sm" className="hover:bg-card w-full sm:w-auto">
                Routes
              </Button>
            </Link>

            {/* Desktop Status - Hidden on Mobile */}
            <div className="hidden sm:flex items-center gap-4">
              {/* Activity Type Status */}
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getActivityBgColor()} border-primary/30`}>
                <Smartphone className={`w-4 h-4 ${getActivityColor()}`} />
                <span className={`text-xs font-medium ${getActivityColor()}`}>
                  {getActivityLabel()}
                </span>
              </div>

              {/* Ride Status */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border">
                <div
                  className={`w-2 h-2 rounded-full ${
                    rideActive ? "bg-green-500 animate-pulse" : "bg-red-500"
                  }`}
                />
                <span className="text-xs text-muted-foreground">
                  {rideActive ? "Live" : "Paused"}
                </span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex gap-2 w-full sm:w-auto">
              {!rideActive && (
                <Button
                  size="sm"
                  onClick={() => setRideActive(true)}
                  className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
                >
                  Start Ride
                </Button>
              )}
              {rideActive && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setRideActive(false)}
                  className="flex-1 sm:flex-none border-orange-500/50 hover:bg-orange-500/10 text-orange-400 text-xs sm:text-sm"
                >
                  Pause Ride
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-1 sm:mb-2">
            Live Telemetry Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Real-time sensor data from your wearable telemetry device
          </p>
        </div>

        {/* Session Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <SensorStatCard
            label="Session Time"
            value={Math.floor(Math.random() * 60)}
            unit="minutes"
            icon={Clock}
            trend="up"
            trendValue={1.2}
          />
          <SensorStatCard
            label="Distance"
            value={Math.random() * 15}
            unit="km"
            icon={MapPin}
            trend="up"
            trendValue={0.5}
          />
          <SensorStatCard
            label="Max Speed"
            value={42.5}
            unit="km/h"
            icon={Zap}
            trend="stable"
            trendValue={0}
          />
          <SensorStatCard
            label="Current Speed"
            value={speed}
            unit="km/h"
            icon={Navigation}
            trend={speed > 15 ? "up" : "down"}
            trendValue={speed > 15 ? 2.3 : -1.5}
          />
        </div>

        {/* GPS Section */}
        <div className="mb-6 sm:mb-8">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2 mb-1 sm:mb-2">
              <Navigation className="w-5 sm:w-6 h-5 sm:h-6 text-primary" />
              GPS Data
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Location and altitude information
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <SensorStatCard
              label="Latitude"
              value={latitude}
              unit="°"
              icon={Navigation}
            />
            <SensorStatCard
              label="Longitude"
              value={longitude}
              unit="°"
              icon={Navigation}
            />
            <SensorStatCard
              label="Altitude"
              value={altitude}
              unit="m"
              icon={Navigation}
            />
            <SensorStatCard
              label="Speed"
              value={speed}
              unit="km/h"
              icon={Zap}
              trend={speed > 15 ? "up" : "down"}
            />
          </div>

          {speedChartData.length > 0 && (
            <div>
              <SensorChart
                data={speedChartData}
                title="Speed Over Time"
                color="#10b981"
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
