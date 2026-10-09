// Midnight after 08/10/2026 in Brasília (UTC-3).
export const VOTING_DEADLINE_ISO = "2026-10-09T03:00:00.000Z";

export function isVotingClosed(now = Date.now()) {
  return now >= Date.parse(VOTING_DEADLINE_ISO);
}

// The public site never releases totals, regardless of the voting deadline.
export function getPublicVoteResults(_now = Date.now()): null {
  return null;
}

export function getVotingCountdown(now = Date.now()) {
  const secondsLeft = Math.max(0, Math.ceil((Date.parse(VOTING_DEADLINE_ISO) - now) / 1000));
  return {
    hours: Math.floor(secondsLeft / 3600),
    minutes: Math.floor((secondsLeft % 3600) / 60),
    seconds: secondsLeft % 60,
  };
}