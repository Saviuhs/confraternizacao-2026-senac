import { describe, it as test } from "node:test";
import assert from "node:assert/strict";
import { isVotingClosed } from "./voting-schedule";

describe("results are released only when voting closes", () => {
  test("voting remains open and results hidden through October 8 in Brasília", () => {
    assert.equal(isVotingClosed(Date.parse("2026-10-08T23:59:59.999-03:00")), false);
  });

  test("voting closes and results are released at midnight after October 8", () => {
    assert.equal(isVotingClosed(Date.parse("2026-10-09T00:00:00.000-03:00")), true);
  });
});