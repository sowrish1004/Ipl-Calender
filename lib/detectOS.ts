export type CalendarTarget = "apple" | "google";

/**
 * Inspects navigator.userAgent to decide which calendar subscription
 * flow to use. Returns "apple" for iOS/macOS, "google" for everything
 * else. Falls back to "google" when navigator is unavailable (SSR).
 */
export function detectOS(): CalendarTarget {
  if (typeof navigator === "undefined") return "google";

  const ua = navigator.userAgent;

  // iOS devices (must check before macOS — iPad UA contains "Macintosh" on iPadOS 13+)
  if (/iPhone|iPad|iPod/i.test(ua)) return "apple";

  // macOS desktop
  if (/Macintosh/i.test(ua)) return "apple";

  // Android, Windows, Linux → Google Calendar
  // (Android UAs also contain "Linux", so Android is checked first)
  if (/Android|Windows|Linux/i.test(ua)) return "google";

  // Unknown OS — default to Google
  return "google";
}
