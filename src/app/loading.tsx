import { LoadingScrollReset } from "@/components/LoadingScrollReset";

/** Minimal loading UI — paints in milliseconds while RSC payload streams. */
export default function Loading() {
  return (
    <>
      <LoadingScrollReset />
      <div className="nav-progress" role="progressbar" aria-hidden />
    </>
  );
}
