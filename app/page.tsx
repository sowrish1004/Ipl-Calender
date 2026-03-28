"use client";

import { useMemo, useState } from "react";
import { detectOS } from "@/lib/detectOS";

const TEAMS = [
  { id: "CSK",  label: "Chennai Super Kings",        color: "#FFFF3C", textWhite: false },
  { id: "DC",   label: "Delhi Capitals",              color: "#00008B", textWhite: true  },
  { id: "GT",   label: "Gujarat Titans",              color: "#1B2133", textWhite: true  },
  { id: "KKR",  label: "Kolkata Knight Riders",       color: "#2E0854", textWhite: true  },
  { id: "LSG",  label: "Lucknow Super Giants",        color: "#0056D4", textWhite: true  },
  { id: "MI",   label: "Mumbai Indians",              color: "#004BA0", textWhite: true  },
  { id: "PBKS", label: "Punjab Kings",                color: "#DD1A32", textWhite: true  },
  { id: "RR",   label: "Rajasthan Royals",            color: "#EA1A85", textWhite: true  },
  { id: "RCB",  label: "Royal Challengers Bengaluru", color: "#EC1C24", textWhite: true  },
  { id: "SRH",  label: "Sunrisers Hyderabad",         color: "#FF822A", textWhite: false },
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
    <main className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl shadow-xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400 leading-tight">
            IPL 2026
          </h1>
          <p className="text-lg font-semibold text-gray-700 dark:text-slate-300 mt-1">
            Calendar Sync
          </p>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">
            Select your teams and subscribe to their match schedule.
          </p>
        </div>

        {/* Team Selection */}
        <div className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-3">
            Select Teams
          </h2>

          {/* All Teams pill */}
          <button
            onClick={toggleAll}
            className={`w-full rounded-xl py-3 px-4 font-semibold text-sm transition-all duration-200 cursor-pointer mb-4 ${
              allSelected
                ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                : someSelected
                ? "bg-indigo-50 dark:bg-indigo-950/40 border-2 border-indigo-400 dark:border-indigo-500 text-indigo-700 dark:text-indigo-300"
                : "bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300"
            }`}
          >
            All Teams
            {someSelected && (
              <span className="ml-2 text-xs font-normal opacity-70">
                ({selected.size}/{TEAMS.length})
              </span>
            )}
          </button>

          {/* Team pill grid */}
          <div className="grid grid-cols-2 gap-3">
            {TEAMS.map((team) => {
              const isSelected = selected.has(team.id);
              return (
                <button
                  key={team.id}
                  onClick={() => toggleTeam(team.id)}
                  className={`rounded-xl py-3 px-4 text-left transition-all duration-200 cursor-pointer flex flex-col items-start gap-0.5 w-full ${
                    isSelected
                      ? "border border-transparent shadow-sm"
                      : "bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-200"
                  }`}
                  style={
                    isSelected
                      ? { backgroundColor: team.color, color: team.textWhite ? "#ffffff" : "#000000" }
                      : undefined
                  }
                >
                  <span className="text-base font-bold leading-none">{team.id}</span>
                  <span className="text-xs leading-tight opacity-80">{team.label}</span>
                </button>
              );
            })}
          </div>

          {selected.size > 0 && (
            <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-3 text-right">
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
          className={`w-full flex items-center justify-center gap-2 mt-6 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold py-4 px-4 rounded-xl text-base shadow-lg transition-all duration-200 ${
            syncUrl
              ? "hover:scale-[1.02] hover:shadow-xl"
              : "opacity-40 pointer-events-none cursor-not-allowed"
          }`}
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
