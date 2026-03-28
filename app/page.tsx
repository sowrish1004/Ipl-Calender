"use client";

import { useMemo, useState } from "react";
import { detectOS } from "@/lib/detectOS";

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

  const syncUrl = useMemo(() => {
    if (selected.size === 0) return null;
    const teams = Array.from(selected).join(",");
    const webcalUrl = `webcal://${window.location.host}/api/calendar?teams=${teams}`;
    return detectOS() === "apple"
      ? webcalUrl
      : `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcalUrl)}`;
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

        {/* Sync Button */}
        <a
          href={syncUrl ?? undefined}
          aria-disabled={!syncUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm ${syncUrl ? "hover:bg-indigo-500" : "opacity-40 pointer-events-none cursor-not-allowed"}`}
        >
          <CalendarIcon />
          Sync Calendar
        </a>
      </div>
    </main>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
      <path d="M19 4h-1V2h-2v2H8V2H6v2H5C3.9 4 3 4.9 3 6v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
    </svg>
  );
}
