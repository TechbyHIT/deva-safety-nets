"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

export type FaqItem = { question: string; answer: string };

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);
  if (!items.length) return null;

  return (
    <div className="space-y-2" role="list">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-button-${i}`;

        return (
          <div
            key={i}
            role="listitem"
            className="overflow-hidden border-b border-[var(--border)]"
          >
            <h3 className="m-0">
              <button
                type="button"
                id={buttonId}
                className="flex w-full items-center justify-between gap-4 py-4 text-left font-semibold transition hover:text-[var(--forest)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] dark:hover:text-[var(--sage)]"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="text-sm md:text-base">{item.question}</span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-[var(--sage)] transition-transform ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="pb-4 text-sm leading-relaxed text-muted"
            >
              {isOpen ? item.answer : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
