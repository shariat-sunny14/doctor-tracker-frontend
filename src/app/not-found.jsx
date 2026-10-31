import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-7xl font-semibold text-brand-700">404</p>
      <h1 className="mt-3 font-display text-2xl font-semibold text-ink-900">This page does not exist</h1>
      <p className="mt-2 max-w-sm text-ink-600">The link may be broken, or the page may have been moved.</p>
      <Link
        href="/dashboard"
        className="mt-6 inline-flex h-10 items-center rounded-lg bg-brand-700 px-4 text-sm font-semibold text-white hover:bg-brand-800"
      >
        Back to dashboard
      </Link>
    </main>
  );
}
