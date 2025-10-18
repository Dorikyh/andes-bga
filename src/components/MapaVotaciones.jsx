import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster/dist/leaflet.markercluster.js";

export default function MapaVotaciones({
  jsonPath = "/data/puestos_filtrados.json",
  height = "60vh",
  defaultZoom = 12,
}) {
  const mapRef = useRef(null);
  const containerId = "map-puestos";

  const coloresMunicipios = {
    BUCARAMANGA: "yellow",
    FLORIDABLANCA: "green",
  };

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map(containerId, { attributionControl: false }).setView(
        [7.119349, -73.122741],
        defaultZoom
      );

      // Capa base clara (sin dark mode)
      const tileLight = L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      );
      tileLight.addTo(mapRef.current);

      // Fullscreen control simple
      const FullscreenControl = L.Control.extend({
        options: { position: "topright" },
        onAdd: function () {
          const btn = L.DomUtil.create("button", "leaflet-bar leaflet-control");
          btn.type = "button";
          btn.title = "Pantalla completa";
          btn.innerHTML = "⤢";
          btn.style.width = "34px";
          btn.style.height = "34px";
          btn.style.cursor = "pointer";
          L.DomEvent.disableClickPropagation(btn);
          L.DomEvent.on(btn, "click", () => {
            const container = document.getElementById(containerId);
            if (!document.fullscreenElement) container.requestFullscreen?.();
            else document.exitFullscreen?.();
          });
          return btn;
        },
      });
      mapRef.current.addControl(new FullscreenControl());

      // Límites
      const bounds = L.latLngBounds([7.015, -73.155], [7.170, -73.045]);
      mapRef.current.setMaxBounds(bounds);
      mapRef.current.on("drag", () => {
        mapRef.current?.panInsideBounds(bounds, { animate: false });
      });

      // Leyenda simple
      const legend = L.control({ position: "bottomright" });
      legend.onAdd = () => {
        const div = L.DomUtil.create("div", "info legend");
        div.style.background = "white";
        div.style.padding = "10px";
        div.style.borderRadius = "6px";
        div.innerHTML = `
          <strong>Leyenda</strong><br/>
          <span style="color:yellow">●</span> Bucaramanga<br/>
          <span style="color:green">●</span> Floridablanca<br/>
        `;
        return div;
      };
      legend.addTo(mapRef.current);

      // Marcadores
      const markers = L.markerClusterGroup();
      fetch(jsonPath)
        .then((res) => res.json())
        .then((data) => {
          const boundsArr = [];
          Object.values(data).forEach((municipios) => {
            municipios.forEach((puesto) => {
              if (!puesto.lat || !puesto.lng) return;
              const color = coloresMunicipios[puesto.municipio?.toUpperCase()] || "gray";
              const marker = L.marker([puesto.lat, puesto.lng], {
                icon: L.divIcon({
                  html: `<div style="background:${color};width:14px;height:14px;border-radius:50%;border:2px solid white;"></div>`,
                  className: "",
                  iconSize: [14, 14],
                }),
              }).bindPopup(
                `<b>${puesto.puesto}</b><br/>${puesto.direccion || ""}<br/><small>${puesto.municipio}</small>`
              );
              markers.addLayer(marker);
              boundsArr.push([puesto.lat, puesto.lng]);
            });
          });
          mapRef.current.addLayer(markers);
          if (boundsArr.length) mapRef.current.fitBounds(boundsArr);
        })
        .catch((err) => console.error("Error cargando JSON:", err));

      // Redibuja al entrar/salir fullscreen
      document.addEventListener("fullscreenchange", () =>
        setTimeout(() => mapRef.current?.invalidateSize(), 200)
      );

      return () => {
        if (mapRef.current) mapRef.current.remove();
        mapRef.current = null;
      };
    }
  }, [jsonPath, defaultZoom]);

  return (
    <div
      id={containerId}
      style={{
        width: "100%",
        height,
        borderRadius: "10px",
        overflow: "hidden",
      }}
    />
  );
}
