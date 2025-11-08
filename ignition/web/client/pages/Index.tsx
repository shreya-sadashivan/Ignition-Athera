import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Navigation,
  Zap,
  TrendingUp,
  BarChart3,
  Smartphone,
} from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background overflow-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/40 backdrop-blur-md bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">Athera</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/routes">
              <Button variant="ghost" className="hover:bg-card">
                Routes
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Launch Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-40 right-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30 animate-pulse-glow" />
            <div className="absolute bottom-40 left-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-30 animate-pulse-glow" />
          </div>

          <div className="relative z-10">
            <div className="text-center mb-12">
              <div className="inline-block mb-6">
                <span className="px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                  ✨ Advanced Wearable Telemetry
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
                Real-Time Movement
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  Intelligence
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
                Capture and visualize every movement with precision. Our wearable telemetry system
                mounts on your gear to deliver real-time insights from accelerometers, GPS, and
                gyroscopes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/dashboard">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    View Live Dashboard
                    <Zap className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border hover:bg-card"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Comprehensive Sensor Suite
            </h2>
            <p className="text-lg text-muted-foreground">
              Multi-dimensional data capture for complete movement analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Accelerometer Card */}
            <div className="group relative p-8 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-primary/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                  <Activity className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Accelerometer
                </h3>
                <p className="text-muted-foreground">
                  Measure linear acceleration across X, Y, Z axes for precise motion tracking
                </p>
              </div>
            </div>

            {/* GPS Card */}
            <div className="group relative p-8 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-primary/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                  <Navigation className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  GPS Tracking
                </h3>
                <p className="text-muted-foreground">
                  Real-time location data with latitude, longitude, and altitude measurements
                </p>
              </div>
            </div>

            {/* Gyroscope Card */}
            <div className="group relative p-8 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-primary/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                  <BarChart3 className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Gyroscope
                </h3>
                <p className="text-muted-foreground">
                  Capture rotational velocity for comprehensive orientation and spin analysis
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 rounded-lg bg-card border border-border">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                500+
              </div>
              <p className="text-sm text-muted-foreground">Data Points/Second</p>
            </div>
            <div className="p-6 rounded-lg bg-card border border-border">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                99.9%
              </div>
              <p className="text-sm text-muted-foreground">Accuracy</p>
            </div>
            <div className="p-6 rounded-lg bg-card border border-border">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                &lt;50ms
              </div>
              <p className="text-sm text-muted-foreground">Latency</p>
            </div>
            <div className="p-6 rounded-lg bg-card border border-border">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                24hrs
              </div>
              <p className="text-sm text-muted-foreground">Battery Life</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-12 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary blur-3xl" />
            </div>
            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready to Monitor Your Rides?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Access the live dashboard to visualize your telemetry data in real-time
              </p>
              <Link to="/dashboard">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Start Monitoring
                  <TrendingUp className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">Athera</span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-right">
              Advanced Wearable Telemetry System for Real-Time Movement Analysis
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
