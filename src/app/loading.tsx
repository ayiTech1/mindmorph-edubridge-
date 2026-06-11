export default function Loading() {
  return (
    <div className="min-h-[50vh] grid place-items-center" role="status" aria-label="Loading">
      <div className="flex items-center gap-3 text-brand-slate">
        <svg
          className="animate-spin h-6 w-6 text-brand-ocean"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-90"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <span className="text-sm">Loading…</span>
      </div>
    </div>
  );
}
