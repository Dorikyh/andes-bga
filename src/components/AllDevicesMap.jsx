import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default function AllDevicesMap({
  apiPath = "/api/locations",
  pollInterval = 10000,
  height = "500px",
  defaultZoom = 6,
}) {
  const mapRef = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    if (!mapRef.current) {
      // Creamos el mapa sin el control de atribución
      const map = L.map("all-devices-map", { attributionControl: false }).setView([4.65, -74.05], defaultZoom);

      // TileLayer sin mensaje ni logo Leaflet
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '', // completamente vacío
      }).addTo(map);

      // Coordenadas del Instituto Pedagógico Nacional
      const ipnCoords = [4.7053, -74.0344];

      // Marcador especial para el IPN
      L.circleMarker(ipnCoords, {
        radius: 12,
        color: "blue",
        fillColor: "lightblue",
        fillOpacity: 0.7,
      })
        .addTo(map)
        .bindPopup("<b>Instituto Pedagógico Nacional</b><br/>Punto de encuentro");

      mapRef.current = map;
    }

    async function fetchLocations() {
      try {
        const res = await fetch(apiPath);
        if (!res.ok) throw new Error("Error en la API");
        const json = await res.json();
        const data = json.data || [];

        data.forEach((d) => {
          if (!d.lat || !d.lon) return;

          const lat = d.lat;
          const lng = d.lon;

          if (!markersRef.current[d.device]) {
            // Crear marcador y polyline
            const marker = L.circleMarker([lat, lng], {
              radius: 8,
              color: "red",
              fillColor: "orange",
              fillOpacity: 0.7,
            }).addTo(mapRef.current);

            marker.bindPopup(
              `<b>${d.device}</b><br/>${lat}, ${lng}<br/>${new Date(
                d.received_at
              ).toLocaleString()}`
            );

            const polyline = L.polyline([[lat, lng]], { color: "blue" }).addTo(mapRef.current);

            markersRef.current[d.device] = { marker, polyline, path: [[lat, lng]] };
          } else {
            // Actualizar marcador
            const obj = markersRef.current[d.device];
            obj.marker.setLatLng([lat, lng]);
            obj.path.push([lat, lng]);
            obj.polyline.setLatLngs(obj.path);
            obj.marker.bindPopup(
              `<b>${d.device}</b><br/>${lat}, ${lng}<br/>${new Date(
                d.received_at
              ).toLocaleString()}`
            );
          }
        });
      } catch (err) {
        console.error("Error fetching locations:", err);
      }
    }

    fetchLocations();
    let intervalId;
    if (pollInterval > 0) intervalId = setInterval(fetchLocations, pollInterval);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [apiPath, pollInterval, defaultZoom]);

return (
  <div
    id="all-devices-map"
    style={{
      width: "100%",
      height,
      borderRadius: "12px",
      overflow: "hidden",
      position: "relative", 
      zIndex: 0,         
    }}
  ></div>
);
}
