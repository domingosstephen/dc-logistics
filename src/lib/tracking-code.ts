/**
 * Tracking code format: DCBR-YYMM-NNNNNN
 *
 * The sequential number is generated server-side via the
 * next_tracking_code() Postgres function (see migration-005).
 * This module provides the client-side normalisation helper only.
 */

/**
 * Normalise a user-supplied tracking code before lookup.
 * Strips spaces and hyphens, uppercases. Matches RPC behaviour.
 */
export function normaliseTrackingCode(raw: string): string {
  return raw.replace(/[\s\-]/g, "").toUpperCase();
}

/**
 * Validate that a string looks like a DCBR tracking code.
 * Accepts with or without separators.
 */
export function isValidTrackingFormat(code: string): boolean {
  const normalised = normaliseTrackingCode(code);
  // DCBR + 4-digit YYMM + 6-digit sequential = 14 chars
  return /^DCBR\d{4}\d{6}$/.test(normalised);
}
