import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";

interface Match {
  id?: string;
  homeTeam: string;
  awayTeam: string;
  venue: string;
  startTime: string;
  endTime: string;
}

function toICSDate(iso: string): string {
  // Format: YYYYMMDDTHHmmssZ
  return iso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function buildICS(matches: Match[]): string {
  const now = toICSDate(new Date().toISOString());

  const events = matches
    .map((match) => {
      const dtStart = toICSDate(match.startTime);
      const dtEnd = toICSDate(match.endTime);
      const summary = `${match.homeTeam} vs ${match.awayTeam}`;

      return [
        "BEGIN:VEVENT",
        `UID:${match.homeTeam}-${match.awayTeam}-${match.startTime}@iplsync`,
        `DTSTAMP:${now}`,
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        `SUMMARY:IPL 2026 – ${summary}`,
        `LOCATION:${match.venue}`,
        `DESCRIPTION:IPL 2026 match: ${summary}`,
        "BEGIN:VALARM",
        "TRIGGER:-PT15M",
        "ACTION:DISPLAY",
        "DESCRIPTION:Match starting in 15 minutes",
        "END:VALARM",
        "END:VEVENT",
      ].join("\r\n");
    })
    .join("\r\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//IPL Calendar Sync//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:IPL 2026",
    "X-WR-TIMEZONE:UTC",
    events,
    "END:VCALENDAR",
  ].join("\r\n");
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const teamsParam = searchParams.get("teams");

  if (!teamsParam) {
    return NextResponse.json(
      { error: "Missing required query parameter: teams" },
      { status: 400 }
    );
  }

  const requestedTeams = teamsParam
    .split(",")
    .map((t) => t.trim().toUpperCase())
    .filter(Boolean);

  if (requestedTeams.length === 0) {
    return NextResponse.json(
      { error: "No valid teams provided" },
      { status: 400 }
    );
  }

  const schedulePath = path.join(process.cwd(), "data", "schedule.json");
  const allMatches: Match[] = JSON.parse(readFileSync(schedulePath, "utf-8"));

  const filtered = allMatches.filter(
    (match) =>
      requestedTeams.includes(match.homeTeam) ||
      requestedTeams.includes(match.awayTeam)
  );

  if (filtered.length === 0) {
    return NextResponse.json(
      { error: "No matches found for the requested teams" },
      { status: 404 }
    );
  }

  const icsContent = buildICS(filtered);

  return new NextResponse(icsContent, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="ipl2026.ics"',
    },
  });
}
