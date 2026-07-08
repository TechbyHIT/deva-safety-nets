"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import { scrollPageToTop } from "@/lib/scroll-to-top";

type Result = { type: string; title: string; subtitle: string; href: string };

export function SearchBox({ variant = "header" }: { variant?: "header" | "page" }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);
  const router = useRouter();
  const boxRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Debounced fetch.
  useEffect(() => {
    if (q.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const id = setTimeout(async () => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal });
        const data = await res.json();
        setResults(data.results ?? []);
        setActive(-1);
      } catch {
        /* aborted or failed */
      } finally {
        setLoading(false);
      }
    }, 180);
    return () => clearTimeout(id);
  }, [q]);

  // Close on outside click.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function go(href: string) {
    setOpen(false);
    setQ("");
    setResults([]);
    scrollPageToTop();
    router.push(href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, -1));
    } else if (e.key === "Enter") {
      if (active >= 0 && results[active]) go(results[active].href);
      else if (q.trim()) go(`/search?q=${encodeURIComponent(q)}`);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={boxRef} className={`relative ${variant === "header" ? "w-full max-w-xs" : "w-full"}`}>
      <div className="search-input">
        <Search size={16} className="shrink-0 text-muted" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search services, cities, areas…"
          aria-label="Search the site"
        />
        {loading && <Loader2 size={15} className="animate-spin text-muted" />}
        {q && !loading && (
          <button type="button" aria-label="Clear search" onClick={() => { setQ(""); setResults([]); }}>
            <X size={15} className="text-muted" />
          </button>
        )}
      </div>

      {open && q.trim().length >= 2 && (
        <div
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[70vh] overflow-auto rounded-xl border shadow-xl"
          style={{ backgroundColor: "var(--surface)" }}
        >
          {results.length === 0 && !loading ? (
            <p className="px-4 py-6 text-center text-sm text-muted">No results for “{q}”.</p>
          ) : (
            <ul className="py-1">
              {results.map((r, i) => (
                <li key={`${r.href}-${i}`}>
                  <button
                    onClick={() => go(r.href)}
                    onMouseEnter={() => setActive(i)}
                    className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left ${
                      active === i ? "bg-[var(--bg-subtle)]" : ""
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{r.title}</span>
                      <span className="block truncate text-xs text-muted">{r.subtitle}</span>
                    </span>
                    <span className="shrink-0 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">
                      {r.type}
                    </span>
                  </button>
                </li>
              ))}
              {q.trim() && (
                <li>
                  <button
                    onClick={() => go(`/search?q=${encodeURIComponent(q)}`)}
                    className="w-full px-4 py-2.5 text-left text-sm font-medium text-[var(--primary)]"
                  >
                    See all results for “{q}” →
                  </button>
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
