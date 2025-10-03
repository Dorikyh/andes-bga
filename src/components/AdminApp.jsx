import { useState, useEffect } from "react";
import L from "leaflet";
export const prerender = false;

const API = (p) => `/api/${p}`;

export default function AdminApp() {
  const [session, setSession] = useState(null); // null = validando
  const [msg, setMsg] = useState("");
  const [list, setList] = useState([]);
  const [form, setForm] = useState(null);

  // validar sesión al cargar (no muestra panel hasta tener resultado)
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(API("session"), { credentials: "include" });
        if (r.ok) {
          setSession(true);
          await loadList();
        } else {
          setSession(false);
        }
      } catch (e) {
        setSession(false);
      }
    })();
  }, []);

  async function login(user, pass) {
    setMsg("Validando...");
    try {
      const r = await fetch(API("login"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, pass }),
      });
      const j = await r.json();
      if (r.ok && j.ok) {
        setSession(true);
        setMsg("");
        await loadList();
      } else {
        setMsg(j.error || "Credenciales incorrectas");
        setSession(false);
      }
    } catch (e) {
      setMsg("Error de conexión");
      setSession(false);
    }
  }

  async function logout() {
    await fetch(API("logout"), { method: "POST", credentials: "include" });
    setSession(false);
    setList([]);
    setForm(null);
  }

  async function loadList() {
    try {
      const r = await fetch(API("list"), { credentials: "include" });
      if (r.ok) {
        const j = await r.json();
        setList(j);
      } else {
        setList([]);
      }
    } catch (e) {
      setList([]);
    }
  }

  if (session === null) return <div className="p-6 max-w-sm mx-auto">Validando sesión...</div>;

  if (!session) {
    // LOGIN VIEW
    return (
      <div className="p-6 max-w-sm mx-auto">
        <h2 className="text-xl font-bold mb-2">Login</h2>
        <input id="u" placeholder="usuario" className="border p-2 w-full mb-2" />
        <input id="p" type="password" placeholder="contraseña" className="border p-2 w-full mb-2" />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => login(document.getElementById("u").value, document.getElementById("p").value)}
        >
          Entrar
        </button>
        <div className="text-red-500 mt-2">{msg}</div>
      </div>
    );
  }

  // PANEL (solo si session === true)
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Panel de actividades</h2>
        <button className="bg-gray-700 text-white px-3 py-1 rounded" onClick={logout}>Cerrar sesión</button>
      </div>

      <div className="mb-4 flex gap-2">
        <button className="bg-green-600 text-white px-3 py-2 rounded" onClick={() => setForm({})}>+ Nueva actividad</button>
        <button className="bg-blue-500 text-white px-3 py-2 rounded" onClick={loadList}>Refrescar lista</button>
      </div>

      <div className="mt-4 space-y-2">
        {list.map((it) => (
          <button key={it.path} className="block w-full text-left border p-2 rounded hover:bg-gray-100"
            onClick={() => setForm(it)}>
            {it.name}
          </button>
        ))}
      </div>

      {form && <EditorForm data={form} onClose={() => setForm(null)} onSaved={loadList} />}
    </div>
  );
}

function EditorForm({ data, onClose, onSaved }) {
  const mapId = "map-" + Math.random().toString(36).slice(2, 9);
  const initialCoords = (data && data.coords) ? [data.coords.lat, data.coords.lng] : [7.06639, -73.08222];
  const [title, setTitle] = useState(data?.name?.replace(/\.md$/, "") || data?.title || "");
  const [body, setBody] = useState("");

  useEffect(() => {
    let map, marker;
    if (typeof window !== "undefined") {
      map = L.map(mapId).setView(initialCoords, 15);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
      marker = L.marker(initialCoords, { draggable: true }).addTo(map);
      marker.on("dragend", () => {
        const p = marker.getLatLng();
        // almacena coords en dataset del div
        const el = document.getElementById(mapId);
        el.dataset.lat = p.lat.toFixed(6);
        el.dataset.lng = p.lng.toFixed(6);
      });
    }
    return () => {
      if (map) map.remove();
    };
  }, [mapId]);

  async function save() {
    const el = document.getElementById(mapId);
    const lat = el?.dataset?.lat ?? initialCoords[0];
    const lng = el?.dataset?.lng ?? initialCoords[1];
    const slug = (data && data.path) ? data.path.replace(/^src\/content\/actividades\/|\.md$/g, "") : (title ? title.toLowerCase().replace(/\s+/g, "-") : `actividad-${Date.now()}`);
    const frontmatter = {
      title: title,
      start: "", end: null, location: null,
      coords: { lat: Number(lat), lng: Number(lng) },
      image: null, published: true, tags: [], excerpt: ""
    };
    const payload = { slug, frontmatter, body };
    const r = await fetch(API("save"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const j = await r.json();
    if (r.ok && j.ok) {
      alert("Guardado ✅");
      onSaved && onSaved();
      onClose();
    } else {
      alert("Error guardando: " + JSON.stringify(j));
    }
  }

  return (
    <div className="mt-6 border rounded p-4">
      <h3 className="font-bold mb-2">Editor</h3>
      <input className="border p-2 w-full mb-2" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Título" />
      <textarea className="border p-2 w-full mb-2" rows="6" value={body} onChange={(e)=>setBody(e.target.value)} placeholder="Contenido / body"></textarea>
      <div id={mapId} className="h-64 mb-2 rounded border" data-lat={initialCoords[0]} data-lng={initialCoords[1]}></div>
      <div className="flex gap-2">
        <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={save}>Guardar</button>
        <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}
