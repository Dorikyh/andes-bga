import React, { useEffect, useState, useRef } from 'react';

/*
  UI: Tailwind + referencias clickeables/hover (tooltip estable) + lista vertical de citas completas.
  Mantengo toda la lógica de fetch/create/send/polling y NO manipulo el scroll.
*/

export default function ChatWidget() {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hoverRef, setHoverRef] = useState(null); // número o null
  const pollRef = useRef(null);
  const containerRef = useRef(null);

  const makeSessionId = () => `session_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;

  useEffect(() => {
    createChat();
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  async function createChat() {
    const session_id = makeSessionId();
    try {
      const res = await fetch('/api/chat-proxy/create', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title: 'New Chat', session_id }),
      });
      const json = await res.json();
      if (json?.id) {
        setChatId(json.id);
        setMessages(json.messages ?? []);
        startPolling(json.id);
      } else {
        console.error('Create chat failed', json);
      }
    } catch (e) {
      console.error(e);
    }
  }

  function startPolling(id) {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => fetchChat(id), 1200);
  }

  async function fetchChat(id) {
    try {
      const res = await fetch(`/api/chat-proxy/${encodeURIComponent(id)}`);
      if (!res.ok) return;
      const json = await res.json();
      setMessages(json.messages ?? []); // NO forzamos scroll
    } catch (e) { /* ignore */ }
  }

  async function sendQuestion(text) {
    if (!chatId) return;
    setLoading(true);
    setMessages(prev => [...prev, { is_bot: false, content: text, timestamp: new Date().toISOString() }]);
    setInput('');
    try {
      const res = await fetch(`/api/chat-proxy/${encodeURIComponent(chatId)}?use_tools=true`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ question: text }),
      });
      if (!res.ok) {
        console.error('send failed', await res.text());
      }
      setTimeout(() => fetchChat(chatId), 400);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    const t = input.trim();
    if (!t) return;
    sendQuestion(t);
  }

  // --- Helpers ---
  function getHostname(u) {
    try { return new URL(u).hostname.replace('www.', ''); } catch (e) { return u || ''; }
  }

  function extractLinksFromText(text) {
    if (!text) return [];
    const links = new Map();
    const mdLinkRe = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
    let m;
    while ((m = mdLinkRe.exec(text)) !== null) {
      links.set(m[2], { title: m[1], url: m[2] });
    }
    const rawUrlRe = /https?:\/\/[^\s)]+/g;
    while ((m = rawUrlRe.exec(text)) !== null) {
      const url = m[0];
      if (!links.has(url)) links.set(url, { title: getHostname(url), url });
    }
    return Array.from(links.values());
  }

  // Detecta "Sources/Fuentes/References/Referencias" en cualquier parte y corta todo lo que venga después.
  function stripSourcesBlock(text) {
    if (!text) return text;
    const markerRe = /(?:^|\n)\s*(Sources|Fuentes|References|Referencias)\s*[:\-]?\s*/i;
    const idx = text.search(markerRe);
    if (idx !== -1) return text.slice(0, idx).trim();
    return text;
  }

  function normalizeSources(m) {
    const explicit =
      m.sources ||
      m.source ||
      m.references ||
      m.meta?.sources ||
      m.metadata?.sources ||
      m.context?.sources;
    if (Array.isArray(explicit) && explicit.length > 0) {
      return explicit.map(s => {
        if (!s) return null;
        if (typeof s === 'string') {
          const urlMatch = s.match(/https?:\/\/[^\s)]+/);
          return {
            raw: s.trim(),
            title: null,
            authors: null,
            publisher: null,
            year: null,
            page: null,
            url: urlMatch ? urlMatch[0] : '',
            meta: s,
          };
        }
        return {
          raw: s.raw ?? s.citation ?? s.fullCitation ?? s.full_cita ?? null,
          title: s.title ?? s.name ?? s.titulo ?? null,
          authors: s.authors ?? s.author ?? s.autor ?? null,
          publisher: s.publisher ?? s.editorial ?? null,
          year: s.year ?? s.fecha ?? null,
          page: s.page ?? s.pages ?? s.pagina ?? null,
          url: s.url ?? s.link ?? s.href ?? s.enlace ?? '',
          meta: s,
        };
      }).filter(Boolean);
    }
    const text = m.content ?? m.text ?? '';
    const extracted = extractLinksFromText(text);
    return extracted.map(e => ({ raw: null, title: e.title, url: e.url, meta: e }));
  }

  function getMessageContent(m) {
    const raw = m.content ?? m.text ?? m.message ?? (typeof m === 'string' ? m : JSON.stringify(m));
    if (typeof raw === 'string') return stripSourcesBlock(raw);
    return typeof raw === 'object' ? (raw.text ? stripSourcesBlock(raw.text) : JSON.stringify(raw).slice(0, 1000)) : String(raw);
  }

  // Renderiza contenido y reemplaza [1],[2] por botones. Tooltip estable dentro del wrapper.
  function renderContentWithRefs(text, sources) {
    if (!text) return null;
    const parts = [];
    const re = /\[(\d+)\]/g;
    let lastIndex = 0;
    let m;
    while ((m = re.exec(text)) !== null) {
      const idx = m.index;
      if (idx > lastIndex) parts.push({ type: 'text', value: text.slice(lastIndex, idx) });
      parts.push({ type: 'ref', value: m[1] });
      lastIndex = re.lastIndex;
    }
    if (lastIndex < text.length) parts.push({ type: 'text', value: text.slice(lastIndex) });

    return parts.map((p, i) => {
      if (p.type === 'text') return <span key={i}>{p.value}</span>;
      const refNum = Number(p.value);
      const refIndex = refNum - 1;
      const src = sources && sources[refIndex];
      if (!src) {
        return <span key={i} className="text-slate-500">[{p.value}]</span>;
      }

      // wrapper relativo para tooltip — el wrapper mantiene hover estable (no parpadeo)
      return (
        <span
          key={i}
          className="relative inline-block ml-1 mr-1"
          onMouseEnter={() => setHoverRef(refIndex)}
          onMouseLeave={() => setHoverRef(null)}
        >
          <button
            onClick={() => { if (src.url) window.open(src.url, '_blank', 'noopener'); }}
            className="px-1.5 py-0.5 rounded-md text-[13px] font-medium border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 hover:shadow-sm focus:outline-none"
            title={src.raw ?? src.title ?? src.url ?? 'Fuente'}
            type="button"
          >
            [{p.value}]
          </button>

          {/* tooltip: aparece solo si hoverRef coincide */}
          {hoverRef === refIndex && (
            <div
              className="absolute z-50 mt-2 left-0 w-[min(360px,92vw)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg text-sm text-slate-800 dark:text-slate-100"
              style={{ pointerEvents: 'auto' }}
            >
              {src.raw ? (
                <div className="whitespace-pre-wrap text-xs leading-snug">{src.raw}</div>
              ) : (
                <div className="text-xs leading-snug space-y-1">
                  {src.title && <div className="font-medium">{src.title}</div>}
                  {src.authors && <div className="text-slate-500 dark:text-slate-400">{src.authors}</div>}
                  {src.publisher && <div className="text-slate-500 dark:text-slate-400">{src.publisher}{src.year ? `, ${src.year}` : ''}</div>}
                  {src.page && <div className="text-slate-500 dark:text-slate-400">p. {src.page}</div>}
                  {src.url && (
                    <div className="truncate">
                      <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-sky-600 dark:text-sky-400 text-xs">
                        {getHostname(src.url)} ↗
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </span>
      );
    });
  }

  return (
    <div className="w-full max-w-2xl h-[560px] md:h-[640px] bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 rounded-2xl shadow-lg flex flex-col overflow-hidden font-sans relative">
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
        <div className="flex flex-col">
          <div className="text-slate-800 dark:text-slate-100 font-semibold">Ventana — Chat</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">{chatId ? `session: ${chatId}` : 'Iniciando...'}</div>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 overflow-auto p-4 space-y-6 bg-transparent">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 dark:text-slate-400 mt-6">No hay mensajes aún. Escribe algo abajo.</div>
        )}

        {messages.map((m, i) => {
          const isBot = m.is_bot ?? m.isBot ?? (m.role ? m.role !== 'user' : true);
          const content = getMessageContent(m); // ya strippea el bloque de sources crudo
          const sources = normalizeSources(m); // todas las citas normalizadas

          return (
            <div key={i} className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
              <div
                className={`relative max-w-[78%] break-words whitespace-pre-wrap px-4 py-3 rounded-2xl shadow-sm
                  ${isBot ? 'bg-white border border-slate-100 text-slate-800 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100' : 'bg-sky-50 text-slate-900 dark:bg-sky-900/30 dark:text-slate-100'}
                `}
                style={{ lineHeight: 1.45 }}
              >
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {renderContentWithRefs(content, sources)}
                </div>
              </div>

              {/* Lista vertical de citas completas (una por fila). Solo estas tarjetas, NO muestro raw "Sources" */}
              {sources && sources.length > 0 && (
                <div className="mt-3 w-[78%] flex flex-col gap-2">
                  {sources.map((s, idx) => {
                    const joined = [
                      s.title ?? null,
                      s.authors ? `${s.authors}` : null,
                      s.publisher ? `${s.publisher}${s.year ? `, ${s.year}` : ''}` : null,
                      s.page ? `p. ${s.page}` : null,
                      s.url ? `${s.url}` : null,
                    ].filter(Boolean).join(' · ');

                    const citationText = (s.raw ?? joined) || s.url || 'Fuente';

                    return (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900/60 text-sm"
                        title="Clic para abrir fuente"
                        onClick={() => { if (s.url) window.open(s.url, '_blank', 'noopener'); }}
                        style={{ cursor: s.url ? 'pointer' : 'default' }}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold">
                            {idx + 1}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="text-xs leading-snug whitespace-pre-wrap text-slate-800 dark:text-slate-100">
                            {citationText}
                          </div>

                          <div className="mt-1 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            {s.publisher && <span>{s.publisher}{s.year ? `, ${s.year}` : ''}</span>}
                            {s.page && <span>p. {s.page}</span>}
                            {s.url && (
                              <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                {getHostname(s.url)} ↗
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-gradient-to-t from-transparent to-white/50 dark:to-slate-800/50">
        <form onSubmit={onSubmit} className="flex gap-3">
          <input
            className="flex-1 min-h-[44px] px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
            placeholder="Escribe tu pregunta..."
            value={input}
            onChange={e => setInput(e.target.value)}
            aria-label="Pregunta"
          />
          <button
            className="px-4 py-2 rounded-lg font-semibold bg-sky-600 text-white disabled:opacity-60 disabled:cursor-default"
            type="submit"
            disabled={!input.trim() || loading}
          >
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      </div>
    </div>
  );
}
