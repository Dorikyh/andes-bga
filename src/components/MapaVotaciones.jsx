import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster/dist/leaflet.markercluster.js";

export default function MapaVotaciones({
  jsonPath = "/data/puestos_filtrados.json",
  height = "60vh", // más responsivo por defecto
  defaultZoom = 12,
}) {
  const mapRef = useRef(null);
  const containerId = "map-puestos";

  const coloresMunicipios = {
    BUCARAMANGA: "yellow",
    FLORIDABLANCA: "green",
  };

  useEffect(() => {
    // Crear mapa si no existe
    if (!mapRef.current) {
      mapRef.current = L.map(containerId, { attributionControl: false }).setView(
        [7.119349, -73.122741],
        defaultZoom
      );

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      ).addTo(mapRef.current);

      // límites y zoom
      const bounds = L.latLngBounds([7.015, -73.155], [7.170, -73.045]);
      mapRef.current.setMaxBounds(bounds);
      mapRef.current.setMinZoom(12);
      mapRef.current.setMaxZoom(18);
      mapRef.current.on("drag", () => {
        mapRef.current?.panInsideBounds(bounds, { animate: false });
      });

      // leyenda
      const legend = L.control({ position: "bottomright" });
      legend.onAdd = () => {
        const div = L.DomUtil.create("div", "info legend");
        Object.assign(div.style, {
          background: "rgba(0,0,0,0.7)",
          padding: "10px",
          borderRadius: "6px",
          color: "white",
          fontSize: "13px",
        });
        div.innerHTML = `
          <strong>Leyenda</strong><br/>
          <span style="color:yellow">●</span> Bucaramanga<br/>
          <span style="color:green">●</span> Floridablanca<br/>
        `;
        return div;
      };
      legend.addTo(mapRef.current);

      // botón fullscreen (control personalizado)
      const FullscreenControl = L.Control.extend({
        options: { position: "topright" },
        onAdd: function () {
          const btn = L.DomUtil.create("button", "leaflet-bar leaflet-control");
          btn.type = "button";
          btn.title = "Pantalla completa";
          Object.assign(btn.style, {
            width: "34px",
            height: "34px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            background: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "4px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
          });
          btn.innerHTML = "⤢"; // icono de entrar fullscreen

          // evitar que arrastre el mapa
          L.DomEvent.disableClickPropagation(btn);
          L.DomEvent.on(btn, "click", (e) => {
            e.preventDefault();
            const container = document.getElementById(containerId);
            if (!document.fullscreenElement) {
              // entrar en fullscreen
              if (container.requestFullscreen) container.requestFullscreen();
            } else {
              if (document.exitFullscreen) document.exitFullscreen();
            }
          });

          return btn;
        },
      });

      mapRef.current.addControl(new FullscreenControl());
    }

    // Lanzar marcadores
    const markers = L.markerClusterGroup();

    let fitBoundsAdded = false;

    fetch(jsonPath)
      .then((res) => res.json())
      .then((data) => {
        const bounds = [];

        Object.values(data).forEach((municipios) => {
          municipios.forEach((puesto) => {
            if (!puesto.lat || !puesto.lng) return;

            const color =
              coloresMunicipios[puesto.municipio?.toUpperCase()] || "gray";

            const icon = L.divIcon({
              html: `<div style="
                background:${color};
                width:14px;
                height:14px;
                border-radius:50%;
                border:2px solid white;
                box-shadow:0 0 4px rgba(0,0,0,0.6)"></div>`,
              className: "",
              iconSize: [14, 14],
            });

            const marker = L.marker([puesto.lat, puesto.lng], { icon }).bindPopup(
              `<b>${puesto.puesto}</b><br/>${puesto.direccion || ""}<br/><small>${puesto.municipio || ""} - ${puesto.comuna || ""}</small>`
            );

            markers.addLayer(marker);
            bounds.push([puesto.lat, puesto.lng]);
          });
        });

        if (bounds.length) {
          mapRef.current.addLayer(markers);
          mapRef.current.fitBounds(bounds, { padding: [30, 30] });
          fitBoundsAdded = true;
          // give leaflet a moment to render properly
          setTimeout(() => mapRef.current.invalidateSize(), 250);
        } else {
          // si no hay bounds, solo añadir markers vacíos y centrar por defecto
          mapRef.current.addLayer(markers);
          mapRef.current.setView([7.119349, -73.122741], defaultZoom);
          setTimeout(() => mapRef.current.invalidateSize(), 250);
        }
      })
      .catch((err) => {
        console.error("Error cargando JSON de puestos:", err);
      });

    // Cuando cambie el estado de fullscreen, forzamos repaint del mapa
    const onFullScreenChange = () => {
      // cambiar icono del botón
      const btn = document.querySelector(
        `#${containerId} .leaflet-control button[title="Pantalla completa"]`
      );
      if (btn) btn.innerHTML = document.fullscreenElement ? "⤡" : "⤢";
      // invalidar tamaño para que leaflet redibuje
      setTimeout(() => mapRef.current?.invalidateSize(), 200);
    };
    document.addEventListener("fullscreenchange", onFullScreenChange);

    // cleanup
    return () => {
      document.removeEventListener("fullscreenchange", onFullScreenChange);
      // quitar mapa completamente (evita duplicados si el componente se desmonta)
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [jsonPath, defaultZoom]);

  return (
    <div
      id={containerId}
      style={{
        width: "100%",
        height: height,
        borderRadius: "10px",
        overflow: "hidden",
      }}
    />
  );
}
