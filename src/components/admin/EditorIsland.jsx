import React, { useEffect, useState } from "react";
import EditorForm from "./EditorForm.jsx";

export default function EditorIsland({ slug }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    (async () => {
      if (!slug) { setData({}); return; }
      const r = await fetch(`/api/get?path=src/content/actividades/${encodeURIComponent(slug)}.md`);
      if (r.ok) {
        const j = await r.json();
        // j.frontmatter + j.body expected
        setData(j);
      } else {
        setData({}); // allow editing even if file missing
      }
    })();
  }, [slug]);

  if (data === null) return <div>Loading…</div>;
  return <EditorForm data={data} />;
}
