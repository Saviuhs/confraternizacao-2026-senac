// Midnight after 08/10/2026 in Brasília (UTC-3).
export const VOTING_DEADLINE_ISO = "2026-10-09T03:00:00.000Z";

export function isVotingClosed(now = Date.now()) {
  return now >= Date.parse(VOTING_DEADLINE_ISO);
}