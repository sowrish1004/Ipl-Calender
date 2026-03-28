"use client";

import { useMemo, useState } from "react";

const TEAMS = [
  { id: "CSK", label: "Chennai Super Kings" },
  { id: "DC", label: "Delhi Capitals" },
  { id: "GT", label: "Gujarat Titans" },
  { id: "KKR", label: "Kolkata Knight Riders" },
  { id: "LSG", label: "Lucknow Super Giants" },
  { id: "MI", label: "Mumbai Indians" },
  { id: "PBKS", label: "Punjab Kings" },
  { id: "RR", label: "Rajasthan Royals" },
  { id: "RCB", label: "Royal Challengers Bengaluru" },
  { id: "SRH", label: "Sunrisers Hyderabad" },
];

export default function Home() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allSelected = selected.size === TEAMS.length;
  const someSelected = selected.size > 0 && !allSelected;

  const { appleUrl, googleUrl } = useMemo(() => {
    if (selected.size === 0) return { appleUrl: null, googleUrl: null };
    const teams = Array.from(selected).join(",");
    const webcalUrl = `webcal://${window.location.host}/api/calendar?teams=${teams}`;
    return {
      appleUrl: webcalUrl,
      googleUrl: `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcalUrl)}`,
    };
  }, [selected]);

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(TEAMS.map((t) => t.id)));
    }
  }

  function toggleTeam(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700 leading-tight">
            IPL 2026
          </h1>
          <p className="text-lg font-semibold text-gray-700 mt-1">
            Calendar Sync
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Select your teams and subscribe to their match schedule.
          </p>
        </div>

        {/* Team Selection */}
        <div className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            Select Teams
          </h2>

          {/* All Teams */}
          <label className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-indigo-50 transition-colors border border-indigo-200 mb-3">
            <input
              type="checkbox"
              checked={allSelected}
              ref={(el) => {
                if (el) el.indeterminate = someSelected;
              }}
              onChange={toggleAll}
              className="w-4 h-4 accent-indigo-600 cursor-pointer"
            />
            <span className="font-semibold text-indigo-700">All Teams</span>
          </label>

          {/* Individual Teams */}
          <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
            {TEAMS.map((team) => (
              <label
                key={team.id}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selected.has(team.id)}
                  onChange={() => toggleTeam(team.id)}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                />
                <span className="font-medium text-gray-800 text-sm">
                  {team.id}
                </span>
                <span className="text-gray-400 text-sm ml-auto">
                  {team.label}
                </span>
              </label>
            ))}
          </div>

          {selected.size > 0 && (
            <p className="text-xs text-indigo-500 mt-2 text-right">
              {selected.size} team{selected.size > 1 ? "s" : ""} selected
            </p>
          )}
        </div>

        {/* Subscribe Buttons */}
        <div className="flex flex-col gap-3">
          <a
            href={appleUrl ?? undefined}
            aria-disabled={!appleUrl}
            className={`w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm ${appleUrl ? "hover:bg-gray-700" : "opacity-40 pointer-events-none cursor-not-allowed"}`}
          >
            <AppleIcon />
            Subscribe on Apple Calendar
          </a>
          <a
            href={googleUrl ?? undefined}
            aria-disabled={!googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm ${googleUrl ? "hover:bg-indigo-500" : "opacity-40 pointer-events-none cursor-not-allowed"}`}
          >
            <GoogleIcon />
            Subscribe on Google Calendar
          </a>
        </div>
      </div>
    </main>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
