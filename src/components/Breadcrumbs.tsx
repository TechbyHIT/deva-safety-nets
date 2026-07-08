import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "./JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export type Crumb = { name: string; path: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const full: Crumb[] = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <JsonLd data={breadcrumbSchema(full)} />
      <nav aria-label="Breadcrumb" className="breadcrumb-bar">
        <ol className="container-page flex flex-wrap items-center gap-1 py-3.5 text-sm">
          {full.map((c, i) => {
            const last = i === full.length - 1;
            return (
              <li key={c.path} className="flex items-center gap-1">
                {last ? (
                  <span aria-current="page" className="font-semibold text-[var(--text)]">
                    {c.name}
                  </span>
                ) : (
                  <Link href={c.path} className="text-muted transition hover:text-[var(--primary)]">
                    {c.name}
                  </Link>
                )}
                {!last && <ChevronRight size={14} className="text-muted" aria-hidden />}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
