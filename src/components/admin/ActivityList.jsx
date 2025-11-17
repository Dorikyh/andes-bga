import React, { useEffect, useState } from "react";

export default function ActivityList() {
  const [items, setItems] = useState([]);
  useEffect(() => { load(); }, []);
  async function load() {
    const r = await fetch('/api/list');
    if (r.ok) setItems(await r.json());
  }

  return (
    <div>
      {items.map(i => (
        <div key={i.path} className="p-2 border rounded mb-2 flex justify-between">
          <div>
            <div className="font-medium">{i.name}</div>
            <div className="text-xs text-gray-500">{i.path}</div>
          </div>
          <div className="flex gap-2">
            <a href={`/admin/edit/${encodeURIComponent(i.name.replace(/\.md$/, ""))}`} className="px-2 py-1 bg-blue-600 text-white rounded">Editar</a>
            <button onClick={async () => { if(!confirm('Borrar?')) return; await fetch('/api/delete',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({slug: i.name.replace(/\.md$/,'')})}); load(); }} className="px-2 py-1 bg-red-600 text-white rounded">Borrar</button>
          </div>
        </div>
      ))}
    </div>
  );
}
