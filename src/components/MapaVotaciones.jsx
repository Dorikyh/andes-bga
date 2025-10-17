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

      const tileDark = L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      );
      const tileLight = L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      );

      const prefersDarkMedia = () =>
        window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

      // Preferencia principal: clase 'dark' en <html> (Tailwind). Fallback: prefers-color-scheme.
      const isDark = () =>
        document.documentElement.classList.contains("dark") || prefersDarkMedia();

      // aplicar capa inicial según isDark()
      if (isDark()) tileDark.addTo(mapRef.current);
      else tileLight.addTo(mapRef.current);

      // Fullscreen control (sin tema)
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
            fontSize: "14px",
            background: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "4px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
            marginLeft: "6px",
          });
          btn.innerHTML = "⤢";
          L.DomEvent.disableClickPropagation(btn);
          L.DomEvent.on(btn, "click", (e) => {
            e.preventDefault();
            const container = document.getElementById(containerId);
            if (!document.fullscreenElement) {
              if (container.requestFullscreen) container.requestFullscreen();
            } else {
              if (document.exitFullscreen) document.exitFullscreen();
            }
          });
          return btn;
        },
      });
      mapRef.current.addControl(new FullscreenControl());

      // límites y comportamiento
      const bounds = L.latLngBounds([7.015, -73.155], [7.170, -73.045]);
      mapRef.current.setMaxBounds(bounds);
      mapRef.current.setMinZoom(12);
      mapRef.current.setMaxZoom(18);
      mapRef.current.on("drag", () => {
        mapRef.current?.panInsideBounds(bounds, { animate: false });
      });

      // Leyenda (ajustable según tema)
      const legend = L.control({ position: "bottomright" });
      legend.onAdd = () => {
        const div = L.DomUtil.create("div", "info legend");
        Object.assign(div.style, {
          padding: "10px",
          borderRadius: "6px",
          fontSize: "13px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
        });
        div.innerHTML = `
          <strong>Leyenda</strong><br/>
          <span style="color:yellow">●</span> Bucaramanga<br/>
          <span style="color:green">●</span> Floridablanca<br/>
        `;
        // estilo inicial
        if (isDark()) Object.assign(div.style, { background: "rgba(0,0,0,0.7)", color: "white" });
        else Object.assign(div.style, { background: "rgba(255,255,255,0.95)", color: "black" });

        return div;
      };
      legend.addTo(mapRef.current);

      const setLegendStyle = (dark) => {
        const div = document.querySelector(`#${containerId} .info.legend`);
        if (!div) return;
        if (dark) Object.assign(div.style, { background: "rgba(0,0,0,0.7)", color: "white" });
        else Object.assign(div.style, { background: "rgba(255,255,255,0.95)", color: "black" });
      };

      // Observador: escucha cambios en la clase de <html> (tu toggler Tailwind)
      const obs = new MutationObserver((mutations) => {
        let themeChanged = false;
        for (const m of mutations) {
          if (m.type === "attributes" && m.attributeName === "class") {
            themeChanged = true;
            break;
          }
        }
        if (!themeChanged) return;
        const darkNow = document.documentElement.classList.contains("dark") || prefersDarkMedia();
        // swap capas si es necesario
        if (darkNow) {
          if (mapRef.current.hasLayer(tileLight)) mapRef.current.removeLayer(tileLight);
          if (!mapRef.current.hasLayer(tileDark)) tileDark.addTo(mapRef.current);
        } else {
          if (mapRef.current.hasLayer(tileDark)) mapRef.current.removeLayer(tileDark);
          if (!mapRef.current.hasLayer(tileLight)) tileLight.addTo(mapRef.current);
        }
        setLegendStyle(darkNow);
        setTimeout(() => mapRef.current?.invalidateSize(), 150);
      });
      obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

      // También reaccionar a cambio de preferencia del sistema (fallback)
      const mq = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
      const onPrefChange = (e) => {
        // si el toggler no controla 'dark' en html, entonces aplicamos el cambio por system pref
        if (!document.documentElement.classList.contains("dark")) {
          if (e.matches) {
            if (mapRef.current.hasLayer(tileLight)) mapRef.current.removeLayer(tileLight);
            tileDark.addTo(mapRef.current);
            setLegendStyle(true);
          } else {
            if (mapRef.current.hasLayer(tileDark)) mapRef.current.removeLayer(tileDark);
            tileLight.addTo(mapRef.current);
            setLegendStyle(false);
          }
          setTimeout(() => mapRef.current.invalidateSize(), 150);
        }
      };
      if (mq && mq.addEventListener) mq.addEventListener("change", onPrefChange);
      else if (mq && mq.addListener) mq.addListener(onPrefChange);

      // cargar marcadores
      const markers = L.markerClusterGroup();
      fetch(jsonPath)
        .then((res) => res.json())
        .then((data) => {
          const boundsArr = [];
          Object.values(data).forEach((municipios) => {
            municipios.forEach((puesto) => {
              if (!puesto.lat || !puesto.lng) return;
              const color = coloresMunicipios[puesto.municipio?.toUpperCase()] || "gray";
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
              boundsArr.push([puesto.lat, puesto.lng]);
            });
          });

          if (boundsArr.length) {
            mapRef.current.addLayer(markers);
            mapRef.current.fitBounds(boundsArr, { padding: [30, 30] });
            setTimeout(() => mapRef.current.invalidateSize(), 250);
          } else {
            mapRef.current.addLayer(markers);
            mapRef.current.setView([7.119349, -73.122741], defaultZoom);
            setTimeout(() => mapRef.current.invalidateSize(), 250);
          }
        })
        .catch((err) => console.error("Error cargando JSON de puestos:", err));

      // redraw on fullscreen change
      const onFullScreenChange = () => setTimeout(() => mapRef.current?.invalidateSize(), 200);
      document.addEventListener("fullscreenchange", onFullScreenChange);

      // cleanup
      return () => {
        document.removeEventListener("fullscreenchange", onFullScreenChange);
        obs.disconnect();
        if (mq && (mq.removeEventListener || mq.removeListener)) {
          try {
            if (mq.removeEventListener) mq.removeEventListener("change", onPrefChange);
            else mq.removeListener(onPrefChange);
          } catch (e) {}
        }
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
