export function HeaderShell() {
  return (
    <header className="sticky top-0 z-[1000] bg-[var(--header-bg)] shadow-md" aria-hidden>
      <div className="mx-auto box-border flex h-[68px] max-w-7xl items-center justify-between border-t-[3px] border-t-[var(--gold)] px-4 md:px-8">
        <div className="h-11 w-32 animate-pulse rounded-lg bg-[var(--bg-subtle)]" />
        <div className="flex items-center gap-2 md:hidden">
          <div className="h-10 w-10 animate-pulse rounded-full bg-[var(--bg-subtle)]" />
          <div className="h-10 w-16 animate-pulse rounded-full bg-[var(--bg-subtle)]" />
          <div className="h-6 w-7 animate-pulse rounded bg-[var(--bg-subtle)]" />
        </div>
      </div>
    </header>
  );
}
