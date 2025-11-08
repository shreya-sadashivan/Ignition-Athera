import { useEffect, useRef } from "react";
import L from "leaflet";

// Load Leaflet CSS from CDN
const leafletCSS = document.createElement("link");
leafletCSS.rel = "stylesheet";
leafletCSS.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
document.head.appendChild(leafletCSS);

interface GPSPoint {
  latitude: number;
  longitude: number;
  timestamp?: number;
}

interface RouteMapProps {
  points: GPSPoint[];
  startPoint?: GPSPoint;
  endPoint?: GPSPoint;
  height?: number;
}

export function RouteMap({
  points,
  startPoint,
  endPoint,
  height = 400,
}: RouteMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !points || points.length === 0) return;

    // Destroy previous map instance
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    // Initialize map
    mapInstance.current = L.map(mapContainer.current).setView([37.7749, -122.4194], 13);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(mapInstance.current);

    // Create route line
    const routeCoordinates: [number, number][] = points.map((p) => [
      p.latitude,
      p.longitude,
    ]);

    // Add route polyline
    L.polyline(routeCoordinates, {
      color: "#00d4ff",
      weight: 3,
      opacity: 0.8,
      lineCap: "round",
      lineJoin: "round",
    }).addTo(mapInstance.current);

    // Add start marker
    const startCoord = startPoint || points[0];
    const startIcon = L.divIcon({
      className: "custom-marker start-marker",
      html: `
        <div style="
          width: 32px;
          height: 32px;
          background: #00d4ff;
          border: 3px solid hsl(200 40% 7%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 10px rgba(0, 212, 255, 0.4);
        ">
          <span style="color: hsl(200 40% 7%); font-weight: bold; font-size: 16px;">S</span>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    L.marker([startCoord.latitude, startCoord.longitude], { icon: startIcon })
      .bindPopup("<strong>Start</strong>")
      .addTo(mapInstance.current)
      .openPopup();

    // Add end marker
    const endCoord = endPoint || points[points.length - 1];
    const endIcon = L.divIcon({
      className: "custom-marker end-marker",
      html: `
        <div style="
          width: 32px;
          height: 32px;
          background: #b55ef7;
          border: 3px solid hsl(200 40% 7%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 10px rgba(184, 94, 247, 0.4);
        ">
          <span style="color: hsl(200 40% 7%); font-weight: bold; font-size: 16px;">E</span>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    L.marker([endCoord.latitude, endCoord.longitude], { icon: endIcon })
      .bindPopup("<strong>End</strong>")
      .addTo(mapInstance.current);

    // Fit bounds to show entire route
    const bounds = L.latLngBounds(routeCoordinates);
    mapInstance.current.fitBounds(bounds, { padding: [50, 50] });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [points, startPoint, endPoint]);

  if (!points || points.length === 0) {
    return (
      <div
        className="w-full rounded-lg bg-card border border-border flex items-center justify-center"
        style={{ height }}
      >
        <p className="text-muted-foreground">No route data available</p>
      </div>
    );
  }

  return (
    <div
      ref={mapContainer}
      className="w-full rounded-lg border border-border overflow-hidden"
      style={{ height }}
    />
  );
}
