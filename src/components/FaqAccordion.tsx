"use client";



import { useState } from "react";

import { ChevronDown } from "lucide-react";



export type FaqItem = { question: string; answer: string };



export function FaqAccordion({ items }: { items: FaqItem[] }) {

  const [open, setOpen] = useState<number | null>(0);

  if (!items.length) return null;

  return (

    <div className="space-y-3">

      {items.map((item, i) => {

        const isOpen = open === i;

        return (

          <div

            key={i}

            className="card overflow-hidden transition-shadow"

            style={{

              borderColor: isOpen ? "color-mix(in srgb, var(--accent) 35%, var(--border))" : undefined,

            }}

          >

            <button

              type="button"

              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold transition hover:bg-[var(--bg-subtle)]"

              aria-expanded={isOpen}

              onClick={() => setOpen(isOpen ? null : i)}

            >

              <span className="text-sm md:text-base">{item.question}</span>

              <ChevronDown

                size={18}

                className={`shrink-0 text-[var(--accent)] transition-transform ${isOpen ? "rotate-180" : ""}`}

                aria-hidden

              />

            </button>

            {isOpen && (

              <div className="border-t px-5 py-4 text-sm leading-relaxed text-muted">{item.answer}</div>

            )}

          </div>

        );

      })}

    </div>

  );

}


