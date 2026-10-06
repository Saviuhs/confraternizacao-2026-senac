import { describe, expect, test } from "bun:test";
import { isVotingClosed } from "./voting-schedule";

describe("results are released only when voting closes", () => {
  test("voting remains open and results hidden through October 8 in Brasília", () => {
    expect(isVotingClosed(Date.parse("2026-10-08T23:59:59.999-03:00"))).toBe(false);
  });

  test("voting closes and results are released at midnight after October 8", () => {
    expect(isVotingClosed(Date.parse("2026-10-09T00:00:00.000-03:00"))).toBe(true);
  });
});