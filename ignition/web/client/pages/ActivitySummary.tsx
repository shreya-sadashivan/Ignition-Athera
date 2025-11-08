import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RouteMap } from "@/components/RouteMap";
import { SensorStatCard } from "@/components/SensorStatCard";
import {
  Activity,
  MapPin,
  Clock,
  Zap,
  TrendingUp,
  Calendar,
  ChevronLeft,
  Share2,
} from "lucide-react";

interface ActivityData {
  id: string;
  title: string;
  date: string;
  duration: number; // in minutes
  distance: number; // in km
  avgSpeed: number; // in km/h
  maxSpeed: number; // in km/h
  route: Array<{
    latitude: number;
    longitude: number;
    timestamp: number;
  }>;
  isActive?: boolean;
}

// Sample activity data
const SAMPLE_ACTIVITIES: ActivityData[] = [
  {
    id: "current-ride",
    title: "Current Ride",
    date: new Date().toISOString(),
    duration: 45,
    distance: 12.5,
    avgSpeed: 16.7,
    maxSpeed: 42.5,
    isActive: true,
    route: [
      { latitude: 37.7749, longitude: -122.4194, timestamp: 0 },
      { latitude: 37.775, longitude: -122.418, timestamp: 1000 },
      { latitude: 37.776, longitude: -122.417, timestamp: 2000 },
      { latitude: 37.778, longitude: -122.415, timestamp: 3000 },
      { latitude: 37.781, longitude: -122.413, timestamp: 4000 },
      { latitude: 37.785, longitude: -122.41, timestamp: 5000 },
      { latitude: 37.787, longitude: -122.408, timestamp: 6000 },
      { latitude: 37.789, longitude: -122.405, timestamp: 7000 },
      { latitude: 37.788, longitude: -122.4, timestamp: 8000 },
      { latitude: 37.786, longitude: -122.395, timestamp: 9000 },
    ],
  },
  {
    id: "ride-001",
    title: "Morning Commute",
    date: "2024-01-15T08:30:00Z",
    duration: 32,
    distance: 8.2,
    avgSpeed: 15.4,
    maxSpeed: 38.2,
    isActive: false,
    route: [
      { latitude: 37.7749, longitude: -122.4194, timestamp: 0 },
      { latitude: 37.772, longitude: -122.415, timestamp: 1000 },
      { latitude: 37.768, longitude: -122.41, timestamp: 2000 },
      { latitude: 37.765, longitude: -122.408, timestamp: 3000 },
      { latitude: 37.76, longitude: -122.405, timestamp: 4000 },
      { latitude: 37.755, longitude: -122.4, timestamp: 5000 },
    ],
  },
  {
    id: "ride-002",
    title: "Evening Hill Session",
    date: "2024-01-14T17:45:00Z",
    duration: 58,
    distance: 16.8,
    avgSpeed: 17.3,
    maxSpeed: 45.1,
    isActive: false,
    route: [
      { latitude: 37.74, longitude: -122.42, timestamp: 0 },
      { latitude: 37.745, longitude: -122.418, timestamp: 1000 },
      { latitude: 37.75, longitude: -122.415, timestamp: 2000 },
      { latitude: 37.755, longitude: -122.41, timestamp: 3000 },
      { latitude: 37.765, longitude: -122.405, timestamp: 4000 },
      { latitude: 37.77, longitude: -122.4, timestamp: 5000 },
      { latitude: 37.775, longitude: -122.395, timestamp: 6000 },
      { latitude: 37.78, longitude: -122.39, timestamp: 7000 },
    ],
  },
];

export default function ActivitySummary() {
  const [selectedActivity, setSelectedActivity] = useState<ActivityData>(
    SAMPLE_ACTIVITIES[0]
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };


  const getTotalDistance = () => {
    return SAMPLE_ACTIVITIES.reduce((sum, a) => sum + a.distance, 0).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/40 backdrop-blur-md bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="hover:bg-card">
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-foreground">Athera</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-card"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-1 sm:mb-2">
            Your Routes
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Track and review all your rides and activities
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <SensorStatCard
            label="Total Distance"
            value={parseFloat(getTotalDistance())}
            unit="km"
            icon={MapPin}
          />
          <SensorStatCard
            label="Rides Completed"
            value={SAMPLE_ACTIVITIES.length}
            unit="rides"
            icon={Activity}
          />
          <SensorStatCard
            label="This Week"
            value={3}
            unit="activities"
            icon={Calendar}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Left: Activity List */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="text-lg font-bold text-foreground mb-4">
                Activities
              </h2>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {SAMPLE_ACTIVITIES.map((activity) => (
                  <button
                    key={activity.id}
                    onClick={() => setSelectedActivity(activity)}
                    className={`w-full p-4 rounded-lg border transition-all duration-200 text-left ${
                      selectedActivity.id === activity.id
                        ? "bg-primary/10 border-primary"
                        : "border-border hover:border-primary/50 bg-card"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-foreground text-sm">
                        {activity.title}
                      </h3>
                      {activity.isActive && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 text-xs font-medium text-green-400">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          Live
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {formatDate(activity.date)} at {formatTime(activity.date)}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Distance</span>
                        <p className="font-semibold text-foreground">
                          {activity.distance} km
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Duration</span>
                        <p className="font-semibold text-foreground">
                          {activity.duration} min
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Activity Details */}
          <div className="lg:col-span-2">
            {/* Activity Header */}
            <div className="mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0 sm:mb-4">
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1 truncate">
                    {selectedActivity.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {formatDate(selectedActivity.date)} at{" "}
                    {formatTime(selectedActivity.date)}
                  </p>
                </div>
                {selectedActivity.isActive && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-sm font-medium text-green-400">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Live
                  </span>
                )}
              </div>
            </div>

            {/* Route Map */}
            <div className="mb-6">
              <RouteMap
                points={selectedActivity.route}
                startPoint={selectedActivity.route[0]}
                endPoint={
                  selectedActivity.route[selectedActivity.route.length - 1]
                }
                height={350}
              />
            </div>

            {/* Activity Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <SensorStatCard
                label="Distance"
                value={selectedActivity.distance}
                unit="km"
                icon={MapPin}
              />
              <SensorStatCard
                label="Duration"
                value={selectedActivity.duration}
                unit="min"
                icon={Clock}
              />
              <SensorStatCard
                label="Avg Speed"
                value={selectedActivity.avgSpeed}
                unit="km/h"
                icon={TrendingUp}
              />
              <SensorStatCard
                label="Max Speed"
                value={selectedActivity.maxSpeed}
                unit="km/h"
                icon={Zap}
              />
            </div>


            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <Link to="/dashboard" className="flex-1">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Back to Dashboard
                </Button>
              </Link>
              <Button variant="outline" className="flex-1 border-border hover:bg-card">
                Export Activity
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
