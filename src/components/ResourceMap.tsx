import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet with webpack
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface ResourceMapProps {
  resources: any[];
  center?: [number, number];
  zoom?: number;
  selectedResourceId?: string;
  onMarkerClick?: (resourceId: string) => void;
}

const ResourceMap = ({
  resources,
  center = [0, 0],
  zoom = 2,
  selectedResourceId,
  onMarkerClick,
}: ResourceMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map("resource-map").setView(center, zoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    if (resources.length === 0) return;

    // Add markers for each resource
    const bounds: L.LatLngBoundsExpression = [];

    resources.forEach((resource) => {
      const lat = parseFloat(resource.latitude);
      const lng = parseFloat(resource.longitude);

      if (isNaN(lat) || isNaN(lng)) return;

      bounds.push([lat, lng]);

      const marker = L.marker([lat, lng])
        .addTo(mapRef.current!)
        .bindPopup(
          `
          <div class="p-2">
            <h3 class="font-bold">${resource.title}</h3>
            <p class="text-sm">${resource.resource_type}</p>
            <p class="text-xs text-gray-600">${resource.location_name}</p>
            <p class="text-xs mt-1">
              <span class="inline-block px-2 py-1 rounded text-white ${
                resource.status === "available"
                  ? "bg-green-600"
                  : resource.status === "limited"
                  ? "bg-yellow-600"
                  : "bg-red-600"
              }">
                ${resource.status.toUpperCase()}
              </span>
            </p>
          </div>
        `
        );

      if (onMarkerClick) {
        marker.on("click", () => onMarkerClick(resource.id));
      }

      markersRef.current.push(marker);
    });

    // Fit map to show all markers
    if (bounds.length > 0) {
      mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [resources, onMarkerClick]);

  // Handle selected resource
  useEffect(() => {
    if (!mapRef.current || !selectedResourceId) return;

    const selectedResource = resources.find((r) => r.id === selectedResourceId);
    if (selectedResource) {
      const lat = parseFloat(selectedResource.latitude);
      const lng = parseFloat(selectedResource.longitude);

      if (!isNaN(lat) && !isNaN(lng)) {
        mapRef.current.setView([lat, lng], 15, { animate: true });

        // Find and open popup for selected marker
        const selectedMarker = markersRef.current.find((marker) => {
          const pos = marker.getLatLng();
          return pos.lat === lat && pos.lng === lng;
        });

        if (selectedMarker) {
          selectedMarker.openPopup();
        }
      }
    }
  }, [selectedResourceId, resources]);

  return (
    <div id="resource-map" className="w-full h-full rounded-lg shadow-lg" style={{ minHeight: "400px" }} />
  );
};

export default ResourceMap;
