import Link from "next/link";
import { Section } from "@/components/ui";

export default function NotFound() {
  return (
    <Section>
      <div className="mx-auto max-w-lg text-center">
        <p className="text-6xl font-extrabold text-[var(--primary)]">404</p>
        <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-muted">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            Back to Home
          </Link>
          <Link href="/services" className="btn btn-outline">
            Browse Services
          </Link>
        </div>
      </div>
    </Section>
  );
}
