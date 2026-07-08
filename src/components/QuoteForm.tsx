"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, Loader2 } from "lucide-react";
import { submitLead } from "@/lib/actions";
import type { LeadState } from "@/lib/lead-types";

const initial: LeadState = { ok: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 size={16} className="animate-spin" /> Sending…
        </>
      ) : (
        "Request Free Quote"
      )}
    </button>
  );
}

export function QuoteForm({
  service,
  city,
  source,
  compact = false,
}: {
  service?: string;
  city?: string;
  source?: string;
  compact?: boolean;
}) {
  const [state, action] = useActionState(submitLead, initial);

  if (state.ok) {
    return (
      <div className="card flex flex-col items-center gap-3 p-8 text-center">
        <CheckCircle2 size={40} style={{ color: "var(--success)" }} />
        <p className="font-semibold text-[var(--text)]">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="card space-y-3 p-6">
      {!compact && (
        <div>
          <h3 className="text-lg font-bold text-[var(--text)]">Get a Free Quote</h3>
          <p className="text-sm text-muted">Free site survey · Response within 24 hours</p>
        </div>
      )}
      {service && <input type="hidden" name="service" value={service} />}
      {city && <input type="hidden" name="city" value={city} />}
      {source && <input type="hidden" name="source" value={source} />}

      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />

      <Field name="name" label="Name" placeholder="Your name" error={state.errors?.name} required />
      <Field
        name="phone"
        label="Phone"
        type="tel"
        placeholder="+91 90000 00000"
        error={state.errors?.phone}
        required
      />
      <Field name="email" label="Email (optional)" type="email" placeholder="you@example.com" error={state.errors?.email} />
      <div>
        <label htmlFor="message" className="form-label">
          Message (optional)
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          placeholder="Tell us about your requirement"
          className="form-field resize-none"
        />
      </div>

      {state.message && !state.ok && (
        <p className="text-sm" style={{ color: "var(--error)" }} role="alert">
          {state.message}
        </p>
      )}
      <SubmitButton />
      <p className="text-center text-xs text-muted">
        By submitting you agree to be contacted about your enquiry.
      </p>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
  error,
  required,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="form-label">
        {label} {required && <span style={{ color: "var(--error)" }}>*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        aria-invalid={!!error}
        className="form-field"
      />
      {error && (
        <p className="mt-1 text-xs" style={{ color: "var(--error)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
