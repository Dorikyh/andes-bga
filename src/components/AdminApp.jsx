import { useEffect, useState } from "react";
import L from "leaflet";

export const prerender = false;

const API = (p) => `/api/${p}`;

export default function AdminApp() {
  const [session, setSession] = useState(null);
  const [msg, setMsg] = useState("");
  const [list, setList] = useState([]);
  const [form, setForm] = useState(null);
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem("theme") === "dark";
    } catch {
      return false;
    }
  });
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch {}
  }, [dark]);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(API("session"), { credentials: "include" });
        if (r.ok) {
          setSession(true);
          await loadList();
        } else setSession(false);
      } catch {
        setSession(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        setLoginPass("");
        await loadList();
      } else {
        setMsg(j.error || "Credenciales incorrectas");
        setSession(false);
      }
    } catch {
      setMsg("Error de conexión");
      setSession(false);
    }
  }

  async function logout() {
    try {
      await fetch(API("logout"), { method: "POST", credentials: "include" });
    } catch {}
    setSession(false);
    setList([]);
    setForm(null);
  }

  async function loadList() {
    try {
      const r = await fetch(API("list"), { credentials: "include" });
      if (r.ok) setList(await r.json());
      else setList([]);
    } catch {
      setList([]);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 transition-colors">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <header className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Panel de actividades</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Administra actividades — local & GitHub</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDark((v) => !v)}
              aria-label="Toggle theme"
              className="flex items-center gap-2 px-3 py-2 rounded bg-white/60 dark:bg-black/40 border border-neutral-200 dark:border-neutral-700 shadow-sm"
            >
              {dark ? "🌙 Dark" : "☀️ Light"}
            </button>

            {session ? (
              <button onClick={logout} className="px-3 py-2 rounded bg-red-600 text-white">Cerrar sesión</button>
            ) : null}
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-1">
            {!session ? (
              <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 shadow-sm">
                <h2 className="font-semibold mb-3">Iniciar sesión</h2>

                <label className="text-sm">Usuario</label>
                <input
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  className="mt-1 mb-3 block w-full border rounded p-2 bg-transparent"
                  placeholder="usuario"
                />

                <label className="text-sm">Contraseña</label>
                <input
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  type="password"
                  className="mt-1 mb-4 block w-full border rounded p-2 bg-transparent"
                  placeholder="contraseña"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => login(loginUser, loginPass)}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded"
                  >
                    Entrar
                  </button>
                  <button
                    onClick={() => { setLoginUser(""); setLoginPass(""); }}
                    className="px-3 py-2 rounded border"
                  >
                    Limpiar
                  </button>
                </div>

                {msg && <div className="mt-3 text-sm text-red-500">{msg}</div>}
              </div>
            ) : (
              <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Actividades</h3>
                  <div className="flex gap-2">
                    <button onClick={() => setForm({})} className="bg-green-600 text-white px-3 py-1 rounded">+ Nueva</button>
                    <button onClick={loadList} className="px-3 py-1 rounded border">Refrescar</button>
                  </div>
                </div>

                <div className="space-y-2 max-h-[52vh] overflow-auto pr-2">
                  {list.length === 0 && <div className="text-sm text-neutral-500">No hay actividades.</div>}
                  {list.map((it) => (
                    <button
                      key={it.path}
                      onClick={() => setForm(it)}
                      className="w-full text-left p-2 rounded border hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center justify-between"
                    >
                      <div className="truncate text-sm">
                        <div className="font-medium">{it.name || it.title}</div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">{it.path}</div>
                      </div>
                      <div className="text-xs text-neutral-400">→</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="lg:col-span-2">
            {!form ? (
              <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 shadow-sm">
                <h2 className="font-semibold mb-2">Selecciona una actividad o crea una nueva</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Haz clic en "+ Nueva" para crear una actividad o selecciona una existente en la lista.</p>
              </div>
            ) : (
              <EditorForm
                data={form}
                onClose={() => setForm(null)}
                onSaved={() => { loadList(); setForm(null); }}
                key={form.path || "new"}
              />
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

/* ---------------- EditorForm ---------------- */
function EditorForm({ data = {}, onClose = () => {}, onSaved = () => {} }) {
  const mapId = "map-" + Math.random().toString(36).slice(2, 9);

  const initialCoords = data?.coords ? [data.coords.lat, data.coords.lng] : [7.06639, -73.08222];

  const [title, setTitle] = useState(data?.title || (data.name ? data.name.replace(/\.md$/, "") : ""));
  const [start, setStart] = useState(data?.start || "");
  const [end, setEnd] = useState(data?.end || "");
  const [location, setLocation] = useState(data?.location || "");
  const [image, setImage] = useState(data?.image || "");
  const [published, setPublished] = useState(data?.published ?? true);
  const [tags, setTags] = useState(Array.isArray(data?.tags) ? data.tags.join(", ") : "");
  const [excerpt, setExcerpt] = useState(data?.excerpt || "");
  const [body, setBody] = useState(data?.body || "");
  const [saving, setSaving] = useState(false);
  const [previewImg, setPreviewImg] = useState(data?.image || "");

  useEffect(() => {
    let map, marker;
    if (typeof window !== "undefined") {
      // avoid duplicate map if re-render
      try {
        map = L.map(mapId).setView(initialCoords, 13);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
        marker = L.marker(initialCoords, { draggable: true }).addTo(map);
        marker.on("dragend", () => {
          const p = marker.getLatLng();
          const el = document.getElementById(mapId);
          if (el) {
            el.dataset.lat = p.lat.toFixed(6);
            el.dataset.lng = p.lng.toFixed(6);
          }
        });
      } catch (e) {
        // ignore leaflet init errors
      }
    }
    return () => {
      try { map && map.remove(); } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPreviewImg(image || data?.image || "");
  }, [image, data]);

  async function save() {
    setSaving(true);
    try {
      const el = document.getElementById(mapId);
      const lat = Number(el?.dataset?.lat ?? initialCoords[0]);
      const lng = Number(el?.dataset?.lng ?? initialCoords[1]);

      const slug = data?.path
        ? data.path.replace(/^src\/content\/actividades\/|\.md$/g, "")
        : title
          ? title.toLowerCase().replace(/\s+/g, "-")
          : `actividad-${Date.now()}`;

      const frontmatter = {
        title: title || slug,
        start: start || "",
        end: end || "",
        location: location || "",
        coords: { lat, lng },
        image: image || "",
        published: !!published,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        excerpt: excerpt || ""
      };

      const payload = { slug, frontmatter, body };

      const r = await fetch(API("save"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const j = await r.json();

      if (r.ok && j.ok) {
        onSaved && onSaved();
        onClose && onClose();
      } else {
        alert("Error guardando: " + JSON.stringify(j));
      }
    } catch (err) {
      alert("Error guardando: " + String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold">{data?.path ? "Editar actividad" : "Nueva actividad"}</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Rellena los campos y pulsa Guardar.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="px-3 py-1 rounded border">Cerrar</button>
          <button
            onClick={save}
            disabled={saving}
            className="px-4 py-1 rounded bg-green-600 text-white disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="col-span-1 space-y-3">
          <label className="block text-sm font-medium">Título</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded bg-transparent" placeholder="Título" />

          <label className="block text-sm font-medium">Fechas</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="p-2 border rounded bg-transparent"
            />
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="p-2 border rounded bg-transparent"
            />
          </div>

          <label className="block text-sm font-medium">Lugar</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-2 border rounded bg-transparent" placeholder="Lugar o dirección" />

          <label className="block text-sm font-medium">Imagen (URL)</label>
          <input value={image} onChange={(e) => setImage(e.target.value)} className="w-full p-2 border rounded bg-transparent" placeholder="/images/foto.jpg" />
          {previewImg && (
            <div className="mt-2">
              <img src={previewImg} alt="preview" className="w-full max-h-40 object-cover rounded border" />
            </div>
          )}

          <label className="block text-sm font-medium">Resumen (excerpt)</label>
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className="w-full p-2 border rounded bg-transparent" />

          <label className="block text-sm font-medium">Tags (separadas por coma)</label>
          <input value={tags} onChange={(e) => setTags(e.target.value)} className="w-full p-2 border rounded bg-transparent" placeholder="educacion, movilizacion" />

          <label className="inline-flex items-center gap-2 mt-2">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
            <span className="text-sm">Publicado</span>
          </label>
        </div>

        <div className="col-span-1 space-y-3">
          <label className="block text-sm font-medium">Contenido / body (Markdown)</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={12} className="w-full p-2 border rounded bg-transparent" placeholder="Contenido en Markdown..." />

          <label className="block text-sm font-medium">Posición (arrastra el marcador)</label>
          <div id={mapId} className="w-full h-48 border rounded" data-lat={initialCoords[0]} data-lng={initialCoords[1]} />

          <div className="flex gap-2 mt-2">
            <button onClick={save} disabled={saving} className="flex-1 bg-green-600 text-white px-3 py-2 rounded">
              {saving ? "Guardando..." : "Guardar"}
            </button>
            <button onClick={onClose} className="flex-1 border px-3 py-2 rounded">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
