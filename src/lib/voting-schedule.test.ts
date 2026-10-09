import { describe, it as test } from "node:test";
import assert from "node:assert/strict";
import { getPublicVoteResults, getVotingCountdown, isVotingClosed } from "./voting-schedule";

describe("voting deadline and permanent public results privacy", () => {
  test("voting remains open through October 8 in Brasília", () => {
    assert.equal(isVotingClosed(Date.parse("2026-10-08T23:59:59.999-03:00")), false);
  });

  test("voting closes at midnight after October 8", () => {
    assert.equal(isVotingClosed(Date.parse("2026-10-09T00:00:00.000-03:00")), true);
  });

  test("countdown uses Brasília midnight after the last minute of October 8", () => {
    assert.deepEqual(getVotingCountdown(Date.parse("2026-10-08T12:23:00-03:00")), {
      hours: 11, minutes: 37, seconds: 0,
    });
  });

  test("countdown never becomes negative after the deadline", () => {
    assert.deepEqual(getVotingCountdown(Date.parse("2026-10-09T12:00:00-03:00")), {
      hours: 0, minutes: 0, seconds: 0,
    });
  });

  test("public results stay hidden before closing, on October 9 and thereafter", () => {
    for (const date of ["2026-10-08T23:59:59.999-03:00", "2026-10-09T00:00:00-03:00", "2026-12-04T12:00:00-03:00"]) {
      assert.equal(getPublicVoteResults(Date.parse(date)), null);
    }
  });
});